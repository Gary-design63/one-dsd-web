#!/usr/bin/env node
/**
 * One DHS / One DSD People, Access and Culture — portable offline launcher.
 *
 * Runs the complete application from this folder with its own Node.js and a
 * private PostgreSQL database, so pages, audio, owner editing and saved work
 * all function without the internet. Commands:
 *
 *   start            start (or reopen) the program and open it as the owner
 *   stop             stop the program and its database
 *   owner            open the Consultant Workspace again as the owner
 *   share            show and copy the link other computers can open
 *   backup           save all edits and saved work to backups\
 *   restore <file>   replace all edits and saved work with a backup
 *
 * Machine-local state (database, keys, logs) lives in the Windows user folder,
 * never in the program folder, so the folder can be copied or synced safely.
 */
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, unwatchFile, watchFile, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP = path.join(ROOT, "app");
const PG_BIN = path.join(ROOT, "runtime", "pgsql", "bin");
const NODE = process.execPath;
const LOCAL = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
const DATA = process.env.PAC_OFFLINE_DATA_DIR?.trim() || path.join(LOCAL, "OneDHS-PAC-Offline");
const PGDATA = path.join(DATA, "pgdata");
const LOGS = path.join(DATA, "logs");
const SECRETS = path.join(DATA, "secrets.json");
const SETTINGS = path.join(DATA, "settings.json");
const STATE = path.join(DATA, "state.json");
const CONNECTORS = path.join(DATA, "connectors.json");
const BACKUPS = path.join(ROOT, "backups");
const DATABASE = "pac";
const RUNTIME_ROLE = "pac_app_runtime";
const DEFAULT_SETTINGS = { appPort: 3100, databasePort: 55433, shareOnNetwork: true };

// ---------------------------------------------------------------- utilities

function say(message = "") {
  console.log(message);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  renameSync(temporary, file);
}

function secret(bytes = 36) {
  return randomBytes(bytes).toString("base64url");
}

function pg(name) {
  return path.join(PG_BIN, `${name}.exe`);
}

function run(command, args, { env, input, log } = {}) {
  const result = spawnSync(command, args, {
    env: env ?? process.env,
    input,
    encoding: "utf8",
    windowsHide: true,
    stdio: input === undefined ? ["ignore", "pipe", "pipe"] : ["pipe", "pipe", "pipe"],
  });
  if (log) writeFileSync(path.join(LOGS, log), `${result.stdout ?? ""}${result.stderr ?? ""}`, "utf8");
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || String(result.error ?? "")).trim().split(/\r?\n/).slice(-6).join("\n");
    throw new Error(`${path.basename(command)} did not finish.\n${detail}`);
  }
  return result.stdout ?? "";
}

function portIsFree(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.listen(port, host, () => server.close(() => resolve(true)));
  });
}

async function choosePort(preferred, host) {
  for (let port = preferred; port < preferred + 50; port += 1) {
    if (await portIsFree(port, host)) return port;
  }
  throw new Error(`No free network port was found near ${preferred}.`);
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

async function healthy(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
}

function openInBrowser(url) {
  spawn("cmd.exe", ["/d", "/c", "start", "", url], { detached: true, stdio: "ignore", windowsHide: true }).unref();
}

function copyToClipboard(text) {
  try {
    spawnSync("clip.exe", { input: text, windowsHide: true });
    return true;
  } catch {
    return false;
  }
}

function networkAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((entry) => entry && entry.family === "IPv4" && !entry.internal && !entry.address.startsWith("169.254."))
    .map((entry) => entry.address);
}

// ---------------------------------------------------------- local secrets

function loadSettings() {
  const settings = { ...DEFAULT_SETTINGS, ...readJson(SETTINGS, {}) };
  if (!existsSync(SETTINGS)) writeJson(SETTINGS, settings);
  return settings;
}

function loadSecrets() {
  let secrets = readJson(SECRETS, null);
  if (!secrets || secrets.version !== 1) {
    secrets = {
      version: 1,
      ownerKey: secret(36),
      rateLimitSecret: secret(36),
      databasePassword: secret(24),
      runtimePassword: secret(24),
    };
    writeJson(SECRETS, secrets);
  }
  return secrets;
}

// ---------------------------------------------------------------- database

function databaseUrl(secrets, port, database = DATABASE) {
  return `postgres://postgres:${encodeURIComponent(secrets.databasePassword)}@127.0.0.1:${port}/${database}`;
}

function runtimeUrl(secrets, port) {
  return `postgres://${RUNTIME_ROLE}:${encodeURIComponent(secrets.runtimePassword)}@127.0.0.1:${port}/${DATABASE}`;
}

function databaseRunning() {
  if (!existsSync(path.join(PGDATA, "PG_VERSION"))) return false;
  return spawnSync(pg("pg_ctl"), ["status", "-D", PGDATA], { windowsHide: true, stdio: "ignore" }).status === 0;
}

function ensureCluster(secrets) {
  if (existsSync(path.join(PGDATA, "PG_VERSION"))) return false;
  say("Preparing the program's database on this computer (first start only)...");
  mkdirSync(DATA, { recursive: true });
  const passwordFile = path.join(DATA, `initdb-${process.pid}.tmp`);
  writeFileSync(passwordFile, `${secrets.databasePassword}\n`, { encoding: "utf8", mode: 0o600 });
  try {
    run(pg("initdb"), ["-D", PGDATA, "-U", "postgres", "--auth=scram-sha-256", `--pwfile=${passwordFile}`, "-E", "UTF8", "--locale=C"], { log: "initdb.log" });
  } finally {
    rmSync(passwordFile, { force: true });
  }
  return true;
}

async function startDatabase(settings) {
  if (databaseRunning()) {
    const state = readJson(STATE, {});
    if (state.databasePort) return state.databasePort;
    run(pg("pg_ctl"), ["stop", "-D", PGDATA, "-m", "fast", "-w"]);
  }
  const port = await choosePort(settings.databasePort, "127.0.0.1");
  // pg_ctl leaves the server running in the background; its output goes to a log file.
  const result = spawnSync(pg("pg_ctl"), ["start", "-D", PGDATA, "-l", path.join(LOGS, "postgres.log"), "-o", `-p ${port} -h 127.0.0.1`, "-w", "-t", "90"], { windowsHide: true, stdio: "ignore" });
  if (result.status !== 0) throw new Error(`The database did not start. See ${path.join(LOGS, "postgres.log")}.`);
  return port;
}

function stopDatabase() {
  if (databaseRunning()) spawnSync(pg("pg_ctl"), ["stop", "-D", PGDATA, "-m", "fast", "-w", "-t", "60"], { windowsHide: true, stdio: "ignore" });
}

function postgresClient(url) {
  const require = createRequire(path.join(APP, "package.json"));
  const postgres = require("postgres");
  return postgres(url, { max: 1, prepare: false, ssl: false, onnotice: () => {} });
}

async function ensureDatabase(secrets, port, name = DATABASE) {
  const sql = postgresClient(databaseUrl(secrets, port, "postgres"));
  try {
    const found = await sql`select 1 from pg_database where datname = ${name}`;
    if (!found.length) await sql.unsafe(`create database ${name} encoding 'UTF8' template template0`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

function migrate(secrets, port, name = DATABASE) {
  run(NODE, [path.join(APP, "scripts", "db", "migrate.mjs"), "--apply"], {
    env: { ...cleanEnvironment(), PAC_DATABASE_URL: databaseUrl(secrets, port, name), PAC_DATABASE_SSL: "disable" },
    log: "migrations.log",
  });
}

async function setRuntimePassword(secrets, port) {
  const sql = postgresClient(databaseUrl(secrets, port));
  try {
    const [row] = await sql`select format('alter role %I password %L', ${RUNTIME_ROLE}::text, ${secrets.runtimePassword}::text) as statement`;
    await sql.unsafe(row.statement);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function prepareDatabase(settings, secrets) {
  const created = ensureCluster(secrets);
  const port = await startDatabase(settings);
  await ensureDatabase(secrets, port);
  if (created) say("Setting up program content...");
  migrate(secrets, port);
  await setRuntimePassword(secrets, port);
  return port;
}

// -------------------------------------------------------------- application

/** Pass only operating-system settings through; the program's own settings come from here. */
function cleanEnvironment() {
  const keep = ["SystemRoot", "SYSTEMROOT", "windir", "ComSpec", "PATHEXT", "TEMP", "TMP", "USERPROFILE", "LOCALAPPDATA", "APPDATA", "HOMEDRIVE", "HOMEPATH", "COMPUTERNAME", "NUMBER_OF_PROCESSORS", "PROCESSOR_ARCHITECTURE"];
  const environment = {};
  for (const name of keep) if (process.env[name]) environment[name] = process.env[name];
  environment.PATH = [path.dirname(NODE), PG_BIN, process.env.SystemRoot ? path.join(process.env.SystemRoot, "System32") : ""].filter(Boolean).join(path.delimiter);
  return environment;
}

function connectorEnvironment() {
  const settings = readJson(CONNECTORS, null);
  if (!settings || settings.version !== 1) return {};
  const environment = {
    PAC_GENERATIVE_PILOT: settings.generativePilot === "on" ? "on" : "off",
    PAC_RESEARCH_ENABLED: settings.researchEnabled === "on" ? "on" : "off",
    PAC_RESEARCH_MONTHLY_USD_CAP: /^[0-9]+(?:\.[0-9]{1,2})?$/.test(settings.researchMonthlyUsdCap ?? "") ? settings.researchMonthlyUsdCap : "0",
  };
  if (settings.anthropicApiKey) environment.ANTHROPIC_API_KEY = settings.anthropicApiKey;
  if (settings.openaiApiKey) environment.OPENAI_API_KEY = settings.openaiApiKey;
  if (settings.perplexityApiKey) environment.PERPLEXITY_API_KEY = settings.perplexityApiKey;
  return environment;
}

function applicationEnvironment({ secrets, databasePort, appPort, handoffToken, shareOrigin }) {
  return {
    ...cleanEnvironment(),
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    PAC_DATA_ENV: "offline",
    PAC_STORE: "postgres",
    PAC_CONTENT_SOURCE: "postgres",
    PAC_STAFF_SCOPE: "one-dhs",
    PAC_RUNTIME_DATABASE_URL: runtimeUrl(secrets, databasePort),
    PAC_RUNTIME_DATABASE_SSL: "disable",
    PAC_OWNER_KEY: secrets.ownerKey,
    PAC_RATE_LIMIT_SECRET: secrets.rateLimitSecret,
    PAC_OFFLINE_MODE: "on",
    PAC_OFFLINE_HANDOFF_TOKEN: handoffToken,
    PAC_OFFLINE_CONNECTORS_FILE: CONNECTORS,
    ...(shareOrigin ? { PAC_OFFLINE_SHARE_ORIGIN: shareOrigin } : {}),
    PORT: String(appPort),
    ...connectorEnvironment(),
  };
}

function startApplication(environment, port, host) {
  const log = openSync(path.join(LOGS, "program.log"), "a");
  const args = [path.join(APP, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port), ...(host ? ["-H", host] : [])];
  return spawn(NODE, args, {
    cwd: APP,
    env: environment,
    stdio: ["ignore", log, log],
    windowsHide: true,
  });
}

async function waitUntilHealthy(port, child, seconds = 180) {
  const deadline = Date.now() + seconds * 1000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`The program stopped while starting. See ${path.join(LOGS, "program.log")}.`);
    if (await healthy(port)) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`The program did not start in time. See ${path.join(LOGS, "program.log")}.`);
}

function ownerUrl(state) {
  return `http://localhost:${state.appPort}/api/offline/owner?token=${state.handoffToken}`;
}

// ---------------------------------------------------------------- commands

async function start() {
  mkdirSync(LOGS, { recursive: true });
  const existing = readJson(STATE, null);
  if (existing && processIsAlive(existing.launcherPid) && (await healthy(existing.appPort))) {
    say("The program is already running. Opening it now.");
    openInBrowser(ownerUrl(existing));
    return;
  }

  const settings = loadSettings();
  const secrets = loadSecrets();
  say("Starting One DHS People, Access and Culture...");
  const databasePort = await prepareDatabase(settings, secrets);

  // Without a host, Next.js listens on IPv6 and IPv4 (so localhost as ::1 and network
  // addresses both work) and keeps "localhost" as its internal address.
  const host = settings.shareOnNetwork ? null : "127.0.0.1";
  const appPort = await choosePort(settings.appPort, host ?? "::");
  const addresses = settings.shareOnNetwork ? networkAddresses() : [];
  const shareOrigin = addresses.length ? `http://${addresses[0]}:${appPort}` : null;
  const state = {
    launcherPid: process.pid,
    appPort,
    databasePort,
    handoffToken: secret(32),
    shareOrigin,
    shareByName: settings.shareOnNetwork ? `http://${os.hostname()}:${appPort}` : null,
    startedAt: new Date().toISOString(),
  };

  let child = null;
  let stopping = false;
  const launch = async () => {
    child = startApplication(applicationEnvironment({ secrets, ...state }), appPort, host);
    child.on("exit", (code) => {
      if (!stopping && !restarting) {
        say(`\nThe program stopped unexpectedly (code ${code}). See ${path.join(LOGS, "program.log")}.`);
        shutdown(1);
      }
    });
    await waitUntilHealthy(appPort, child);
  };

  let restarting = false;
  const shutdown = (code = 0) => {
    if (stopping) return;
    stopping = true;
    unwatchFile(CONNECTORS);
    say("\nStopping the program...");
    try { child?.kill(); } catch { /* already stopped */ }
    stopDatabase();
    rmSync(STATE, { force: true });
    say("Stopped. You can close this window.");
    process.exit(code);
  };
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"]) process.on(signal, () => shutdown(0));

  try {
    await launch();
  } catch (error) {
    try { child?.kill(); } catch { /* already stopped */ }
    stopDatabase();
    throw error;
  }
  writeJson(STATE, state);

  // Saving API connections in the workspace restarts the program with the new settings.
  watchFile(CONNECTORS, { interval: 1000 }, async (now, before) => {
    // The watcher also reports once for a file that does not exist yet; act only on a real save.
    if (now.mtimeMs === before.mtimeMs || now.mtimeMs === 0) return;
    if (stopping || restarting) return;
    restarting = true;
    say("API connections changed. Restarting the program to use them...");
    const previous = child;
    await new Promise((resolve) => { previous.once("exit", resolve); previous.kill(); });
    try {
      await launch();
      say("Restarted.");
    } catch (error) {
      say(error.message);
    } finally {
      restarting = false;
    }
  });

  // Prepare the first page in the background so it opens quickly for the first visitor.
  fetch(`http://127.0.0.1:${appPort}/`).catch(() => {});
  openInBrowser(ownerUrl(state));

  say("");
  say("The program is running.");
  say(`  On this computer:   http://localhost:${appPort}`);
  if (shareOrigin) {
    say(`  Share this link:    ${shareOrigin}`);
    say(`  Or by name:         ${state.shareByName}`);
    say("  (Anyone on the same network can open it. The link is copied to your clipboard.)");
    copyToClipboard(shareOrigin);
  } else if (settings.shareOnNetwork) {
    say("  No network connection was found, so only this computer can open the program.");
  }
  say("");
  say("Keep this window open while the program is in use. Close it, or press Ctrl+C, to stop.");
}

async function stop() {
  const state = readJson(STATE, null);
  if (state && processIsAlive(state.launcherPid)) {
    spawnSync("taskkill.exe", ["/PID", String(state.launcherPid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
  }
  stopDatabase();
  rmSync(STATE, { force: true });
  say("The program is stopped.");
}

async function reopenAsOwner() {
  const state = readJson(STATE, null);
  if (!state || !(await healthy(state.appPort))) {
    say("The program is not running. Use Start One DHS PAC first.");
    process.exitCode = 1;
    return;
  }
  openInBrowser(ownerUrl(state));
}

async function share() {
  const state = readJson(STATE, null);
  if (!state || !(await healthy(state.appPort))) {
    say("The program is not running. Use Start One DHS PAC first.");
    process.exitCode = 1;
    return;
  }
  if (!state.shareOrigin) {
    say("Network sharing is off or no network connection was found. Only this computer can open the program.");
    return;
  }
  copyToClipboard(state.shareOrigin);
  say(`Share this link: ${state.shareOrigin}   (copied to your clipboard)`);
  say(`Or by name:      ${state.shareByName}`);
}

/** Run a database task, starting the database briefly if the program is not running. */
async function withDatabase(task) {
  mkdirSync(LOGS, { recursive: true });
  const settings = loadSettings();
  const secrets = loadSecrets();
  const running = readJson(STATE, null);
  const wasRunning = databaseRunning();
  ensureCluster(secrets);
  const port = wasRunning && running?.databasePort ? running.databasePort : await startDatabase(settings);
  try {
    return await task(secrets, port);
  } finally {
    if (!wasRunning) stopDatabase();
  }
}

async function backup() {
  mkdirSync(BACKUPS, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 13);
  const file = path.join(BACKUPS, `one-dhs-pac-edits-${stamp}.backup`);
  await withDatabase(async (secrets, port) => {
    run(pg("pg_dump"), ["-h", "127.0.0.1", "-p", String(port), "-U", "postgres", "-d", DATABASE, "-Fc", "-f", file], {
      env: { ...cleanEnvironment(), PGPASSWORD: secrets.databasePassword },
      log: "backup.log",
    });
  });
  say(`Saved a backup of all edits and saved work:\n  ${file}`);
}

async function restore(file) {
  if (!file || !existsSync(file)) {
    say("Choose a backup file: drag it onto Restore edits.cmd, or run: restore <path-to-backup>.");
    process.exitCode = 1;
    return;
  }
  const state = readJson(STATE, null);
  if (state && processIsAlive(state.launcherPid)) {
    say("Stop the program before restoring a backup.");
    process.exitCode = 1;
    return;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`This replaces ALL edits and saved work on this computer with:\n  ${file}\nType RESTORE to continue: `);
  rl.close();
  if (answer.trim() !== "RESTORE") {
    say("Nothing was changed.");
    return;
  }
  await withDatabase(async (secrets, port) => {
    const sql = postgresClient(databaseUrl(secrets, port, "postgres"));
    try {
      await sql.unsafe(`drop database if exists ${DATABASE} with (force)`);
      // A fresh computer needs the program's database logins before restoring grants to them.
      await sql.unsafe("drop database if exists pac_setup with (force)");
    } finally {
      await sql.end({ timeout: 5 });
    }
    await ensureDatabase(secrets, port, "pac_setup");
    migrate(secrets, port, "pac_setup");
    await ensureDatabase(secrets, port);
    run(pg("pg_restore"), ["-h", "127.0.0.1", "-p", String(port), "-U", "postgres", "-d", DATABASE, "--single-transaction", file], {
      env: { ...cleanEnvironment(), PGPASSWORD: secrets.databasePassword },
      log: "restore.log",
    });
    const cleanup = postgresClient(databaseUrl(secrets, port, "postgres"));
    try {
      await cleanup.unsafe("drop database if exists pac_setup with (force)");
    } finally {
      await cleanup.end({ timeout: 5 });
    }
    migrate(secrets, port);
    await setRuntimePassword(secrets, port);
  });
  say("Restored. Start the program to see the restored edits.");
}

const [command = "start", ...rest] = process.argv.slice(2);
const commands = { start, stop, owner: reopenAsOwner, share, backup, restore: () => restore(rest[0]) };
if (!commands[command]) {
  say(`Unknown command "${command}". Use: ${Object.keys(commands).join(", ")}.`);
  process.exit(1);
}
try {
  await commands[command]();
} catch (error) {
  say(`\n${error.message}`);
  say(`Logs are in ${LOGS}.`);
  process.exitCode = 1;
}
