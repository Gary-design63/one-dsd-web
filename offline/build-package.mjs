#!/usr/bin/env node
/**
 * Build the portable offline edition.
 *
 *   node offline/build-package.mjs "<output folder>"
 *
 * Copies this source into a staging folder, installs dependencies, builds the
 * application for plain-HTTP local-network use (PAC_OFFLINE_BUILD=1), removes
 * development-only packages, and assembles the output folder with the bundled
 * Node.js runtime, PostgreSQL server files, launcher and shortcuts.
 * The output folder must not already exist.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO = path.resolve(import.meta.dirname, "..");
const target = process.argv[2];
if (!target) {
  console.error('Usage: node offline/build-package.mjs "<output folder>"');
  process.exit(1);
}
const OUT = path.resolve(target);
if (existsSync(OUT)) {
  console.error(`The output folder already exists: ${OUT}\nChoose a new folder name so nothing is overwritten.`);
  process.exit(1);
}
const PG_HOME = process.env.PAC_OFFLINE_PG_HOME || "C:\\Program Files\\PostgreSQL\\16";
const LOCAL = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
const STAGE = path.join(LOCAL, "OneDHS-PAC-build");
const STAGE_APP = path.join(STAGE, "app");

const EXCLUDED_TOP_LEVEL = new Set(["node_modules", ".next", "tests", ".data", ".git", ".claude", "offline", "coverage"]);

function step(message) {
  console.log(`\n== ${message}`);
}

function run(command, args, cwd, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed with status ${result.status}.`);
}

function sourceFilter(source) {
  const relative = path.relative(REPO, source);
  if (!relative) return true;
  const [top] = relative.split(path.sep);
  if (EXCLUDED_TOP_LEVEL.has(top)) return false;
  const base = path.basename(source);
  if (base.startsWith(".env") && base !== ".env.example") return false;
  return true;
}

function folderBytes(folder) {
  let total = 0;
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    total += entry.isDirectory() ? folderBytes(full) : statSync(full).size;
  }
  return total;
}

step(`Staging source in ${STAGE_APP}`);
rmSync(STAGE, { recursive: true, force: true });
cpSync(REPO, STAGE_APP, { recursive: true, filter: sourceFilter });

step("Installing dependencies");
run("npm", ["ci"], STAGE_APP);

step("Building the application for the offline edition");
run("npm", ["run", "build"], STAGE_APP, { PAC_OFFLINE_BUILD: "1", NEXT_TELEMETRY_DISABLED: "1" });

step("Removing development-only packages and build caches");
run("npm", ["prune", "--omit=dev"], STAGE_APP);
rmSync(path.join(STAGE_APP, ".next", "cache"), { recursive: true, force: true });

step(`Assembling ${OUT}`);
mkdirSync(OUT, { recursive: true });
cpSync(STAGE_APP, path.join(OUT, "app"), { recursive: true });

const nodeFolder = path.join(OUT, "runtime", "node");
mkdirSync(nodeFolder, { recursive: true });
copyFileSync(process.execPath, path.join(nodeFolder, "node.exe"));
const nodeLicense = path.join(path.dirname(process.execPath), "LICENSE");
if (existsSync(nodeLicense)) copyFileSync(nodeLicense, path.join(nodeFolder, "LICENSE.txt"));

const pgFolder = path.join(OUT, "runtime", "pgsql");
for (const part of ["bin", "lib", "share"]) {
  cpSync(path.join(PG_HOME, part), path.join(pgFolder, part), { recursive: true, filter: (source) => !source.endsWith(".pdb") });
}
for (const license of ["server_license.txt", "commandlinetools_3rd_party_licenses.txt"]) {
  const file = path.join(PG_HOME, license);
  if (existsSync(file)) copyFileSync(file, path.join(pgFolder, license));
}

mkdirSync(path.join(OUT, "launcher"), { recursive: true });
copyFileSync(path.join(REPO, "offline", "launcher.mjs"), path.join(OUT, "launcher", "launcher.mjs"));
for (const file of readdirSync(path.join(REPO, "offline", "package"))) {
  copyFileSync(path.join(REPO, "offline", "package", file), path.join(OUT, file));
}
mkdirSync(path.join(OUT, "backups"), { recursive: true });

const pgVersion = spawnSync(path.join(pgFolder, "bin", "postgres.exe"), ["--version"], { encoding: "utf8" }).stdout.trim();
const manifest = {
  edition: "One DHS / One DSD People, Access and Culture — portable offline edition",
  builtAt: new Date().toISOString(),
  applicationVersion: JSON.parse(readFileSync(path.join(REPO, "package.json"), "utf8")).version,
  node: process.version,
  postgres: pgVersion,
  offlineBuild: true,
  audioFiles: readdirSync(path.join(OUT, "app", "public"), { recursive: true }).filter((name) => /\.(mp3|wav|m4a)$/i.test(String(name))).length,
  migrations: readdirSync(path.join(OUT, "app", "db", "migrations")).filter((name) => name.endsWith(".sql")).length,
  bytes: folderBytes(OUT),
  secretsIncluded: false,
};
writeFileSync(path.join(OUT, "PACKAGE-MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
rmSync(STAGE, { recursive: true, force: true });

console.log(`\nDone. ${(manifest.bytes / 1024 / 1024).toFixed(0)} MB in ${OUT}`);
console.log(JSON.stringify(manifest, null, 2));
