#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const migrationDirectory = resolve(root, "db/migrations");

function sha256(text) {
  return createHash("sha256").update(text).digest("hex").toUpperCase();
}

function migrations() {
  return readdirSync(migrationDirectory)
    .filter((name) => /^\d+.*\.sql$/.test(name))
    .sort()
    .map((name) => {
      const path = resolve(migrationDirectory, name);
      const sql = readFileSync(path, "utf8");
      return { name, path, sql, sha256: sha256(sql) };
    });
}

function databaseOptions(url) {
  const configured = (process.env.PAC_DATABASE_SSL ?? "").toLowerCase();
  if (configured === "disable" || configured === "false") return { ssl: false };
  if (configured === "require" || configured === "true") return { ssl: "require" };
  const hostname = new URL(url).hostname;
  return { ssl: ["localhost", "127.0.0.1", "::1"].includes(hostname) ? false : "require" };
}

const files = migrations();
if (!process.argv.includes("--apply")) {
  console.log(JSON.stringify({
    ok: true,
    mode: "check",
    databaseChanged: false,
    migrations: files.map(({ name, sha256: hash }) => ({ name, sha256: hash })),
  }, null, 2));
  process.exit(0);
}

const url = process.env.PAC_DATABASE_URL;
if (!url) {
  console.error("Set the server-only PAC_DATABASE_URL before using --apply.");
  process.exit(1);
}

const { default: postgres } = await import("postgres");
const sql = postgres(url, { max: 1, prepare: false, ...databaseOptions(url) });
try {
  await sql`select pg_advisory_lock(hashtextextended('one-dhs-pac-schema-migrations', 0))`;
  await sql`create schema if not exists pac`;
  await sql`
    create table if not exists pac.schema_migrations (
      migration_name text primary key,
      migration_sha256 text not null check (migration_sha256 ~ '^[0-9a-fA-F]{64}$'),
      applied_at timestamptz not null default now(),
      applied_by text not null
    )
  `;

  const results = [];
  for (const migration of files) {
    const existing = await sql`
      select migration_sha256 from pac.schema_migrations
      where migration_name = ${migration.name}
    `;
    if (existing.length) {
      if (String(existing[0].migration_sha256).toUpperCase() !== migration.sha256) {
        throw new Error(`Applied migration ${migration.name} has a different SHA-256. Add a new migration instead of rewriting history.`);
      }
      results.push({ name: migration.name, action: "exact_replay", sha256: migration.sha256 });
      continue;
    }

    await sql.unsafe(migration.sql);
    await sql`
      insert into pac.schema_migrations (migration_name, migration_sha256, applied_by)
      values (${migration.name}, ${migration.sha256}, ${process.env.PAC_IMPORT_ACTOR ?? "pac_schema_migrator"})
    `;
    results.push({ name: migration.name, action: "applied", sha256: migration.sha256 });
  }
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await sql`select pg_advisory_unlock(hashtextextended('one-dhs-pac-schema-migrations', 0))`.catch(() => undefined);
  await sql.end();
}
