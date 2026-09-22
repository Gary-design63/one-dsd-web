import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import postgres from "postgres";

// This harness never accepts a remote database address or reads application
// credentials. Its cluster and credentials exist only for the local audit.
const root = process.cwd();
const directory = path.join(root, ".data", "local-audit");
const data = path.join(directory, "postgres");
const bin = "C:/Program Files/PostgreSQL/16/bin";
const port = 55439;
mkdirSync(directory, { recursive: true });
function run(name, args) {
  const result = spawnSync(path.join(bin, `${name}.exe`), args, { windowsHide: true, timeout: 60000, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${name} failed: ${result.stderr}`);
}
if (!existsSync(path.join(data, "PG_VERSION"))) run("initdb", ["-D", data, "--username=pac_audit", "--auth=trust", "--encoding=UTF8", "--no-locale"]);
if (!existsSync(path.join(data, "postmaster.pid"))) run("pg_ctl", ["-D", data, "-l", path.join(directory, "postgres.log"), "-o", `-F -p ${port} -h 127.0.0.1`, "-w", "start"]);
const sql = postgres(`postgres://pac_audit@127.0.0.1:${port}/postgres`, { max: 1, ssl: false, prepare: false, onnotice: () => {} });
try {
  const marker = path.join(directory, "migrations.json");
  if (!existsSync(marker)) {
    const migrations = readdirSync(path.join(root, "db/migrations")).filter((name) => /^\d{4}_.+\.sql$/.test(name)).sort();
    for (const migration of migrations) await sql.unsafe(readFileSync(path.join(root, "db/migrations", migration), "utf8"));
    writeFileSync(marker, JSON.stringify({ at: new Date().toISOString(), migrations }, null, 2));
  }
  const ownerFile = path.join(directory, "owner-key.txt");
  const owner = existsSync(ownerFile) ? readFileSync(ownerFile, "utf8").trim() : randomBytes(48).toString("base64url");
  writeFileSync(ownerFile, owner);
  const envFile = path.join(root, ".env.local");
  if (existsSync(envFile) && !existsSync(path.join(directory, "original-env.backup"))) writeFileSync(path.join(directory, "original-env.backup"), readFileSync(envFile));
  writeFileSync(envFile, [
    "# Isolated local audit. No production credentials.",
    "PAC_STORE=postgres", "PAC_CONTENT_SOURCE=static", "PAC_STAFF_SCOPE=one-dhs", "PAC_DATA_ENV=local", "PAC_AUTONOMY_MAX=A5",
    `PAC_RUNTIME_DATABASE_URL=postgres://pac_app_runtime@127.0.0.1:${port}/postgres`, "PAC_RUNTIME_DATABASE_SSL=disable",
    `PAC_OWNER_KEY=${owner}`, `PAC_RATE_LIMIT_SECRET=${randomBytes(48).toString("base64url")}`, `CRON_SECRET=${randomBytes(48).toString("base64url")}`,
    "PAC_GENERATIVE_PILOT=false", "",
  ].join("\n"));
  console.log(JSON.stringify({ status: "ready", database: `127.0.0.1:${port}`, runtime: "restricted PostgreSQL role", content: "bundled static collection", external_services: "not enabled", migrations: JSON.parse(readFileSync(marker, "utf8")).migrations.length }));
} finally { await sql.end(); }
