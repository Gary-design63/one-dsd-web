import { randomUUID } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { PostgresStore } from "@/lib/intelligence/memory/postgres-store";
import type { AuditEvent } from "@/lib/intelligence/types";
import { testSpanId, testTraceId } from "@/tests/helpers/opaque-identifiers";

const ROOT = path.resolve(__dirname, "..");

function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const configured = process.env.PAC_TEST_POSTGRES_BIN;
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    configured ? path.join(configured, executable) : "",
    process.platform === "win32" ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable) : "",
    `/usr/lib/postgresql/16/bin/${executable}`,
    `/usr/lib/postgresql/15/bin/${executable}`,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const INITDB = postgresBinary("initdb");
const PG_CTL = postgresBinary("pg_ctl");
const LOCAL_POSTGRES_AVAILABLE = Boolean(INITDB && PG_CTL);

function run(executable: string, args: string[]): void {
  const result = spawnSync(executable, args, {
    stdio: "ignore",
    windowsHide: true,
    timeout: 60_000,
  });
  if (result.status !== 0) {
    throw new Error(`${path.basename(executable)} failed with status ${result.status ?? "unknown"}.`);
  }
}

async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not allocate a local PostgreSQL test port."));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

function audit(label: string): AuditEvent {
  return {
    trace_id: testTraceId(`postgres-store-${label}`),
    span_id: testSpanId(`postgres-store-${label}`),
    at: new Date().toISOString(),
    agent_id: "system",
    agent_version: "0.1.0",
    tool_name: "corpus.search",
    autonomy_level_used: "A0",
    permission_mode: "always",
    dry_run: false,
    content_ids_touched: [],
    allowlist_hit: true,
    ok: true,
  };
}

describe.skipIf(!LOCAL_POSTGRES_AVAILABLE)("PostgreSQL runtime store integration", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let logFile = "";
  let databaseUrl = "";
  let runtimeDatabaseUrl = "";
  let admin: ReturnType<typeof postgres> | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-postgres-test-"));
    dataDirectory = path.join(temporaryRoot, "data");
    logFile = path.join(temporaryRoot, "postgres.log");
    const port = await unusedPort();

    run(INITDB!, [
      "-D",
      dataDirectory,
      "--username=pac_test",
      "--auth=trust",
      "--encoding=UTF8",
      "--no-locale",
    ]);
    run(PG_CTL!, [
      "-D",
      dataDirectory,
      "-l",
      logFile,
      "-o",
      localPostgresServerOptions(port, temporaryRoot),
      "-w",
      "start",
    ]);

    databaseUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    admin = postgres(databaseUrl, { ssl: false, max: 1, prepare: false });
    await admin.unsafe(`
      create schema if not exists pac;
      create table pac.private_probe (id integer);
      create or replace function pac.prevent_immutable_change()
      returns trigger
      language plpgsql
      as $$
      begin
        if tg_op = 'DELETE' then return old; end if;
        return new;
      end;
      $$;
    `);
    const migration = readFileSync(path.join(ROOT, "db", "migrations", "0002_pac_runtime_store.sql"), "utf8");

    await admin.unsafe(`
      create role pac_app_runtime
        login inherit createdb createrole replication bypassrls
        connection limit -1;
    `);
    const unsafeRoleConnection = postgres(databaseUrl, { ssl: false, max: 1, prepare: false });
    let unsafeRoleRejection: unknown;
    try {
      await unsafeRoleConnection.unsafe(migration);
    } catch (error) {
      unsafeRoleRejection = error;
    } finally {
      await unsafeRoleConnection.end({ timeout: 5 });
    }
    expect(unsafeRoleRejection).toMatchObject({ code: "42501" });
    const [unchangedUnsafeRole] = await admin.unsafe<{ rolcreatedb: boolean }[]>(
      "select rolcreatedb from pg_catalog.pg_roles where rolname = 'pac_app_runtime'",
    );
    expect(unchangedUnsafeRole?.rolcreatedb).toBe(true);
    await admin.unsafe("drop role pac_app_runtime");

    await admin.unsafe(migration);
    await admin.unsafe(migration);
    const [runtimeRole] = await admin.unsafe<{
      rolcanlogin: boolean;
      rolinherit: boolean;
      rolsuper: boolean;
      rolcreatedb: boolean;
      rolcreaterole: boolean;
      rolreplication: boolean;
      rolbypassrls: boolean;
      rolconnlimit: number;
      membership_count: number | string;
    }[]>(`
      select role.rolcanlogin, role.rolinherit, role.rolsuper,
        role.rolcreatedb, role.rolcreaterole, role.rolreplication,
        role.rolbypassrls, role.rolconnlimit,
        (select count(*) from pg_catalog.pg_auth_members memberships
          where memberships.member = role.oid) as membership_count
      from pg_catalog.pg_roles role
      where role.rolname = 'pac_app_runtime'
    `);
    expect(runtimeRole).toMatchObject({
      rolcanlogin: true,
      rolinherit: false,
      rolsuper: false,
      rolcreatedb: false,
      rolcreaterole: false,
      rolreplication: false,
      rolbypassrls: false,
      rolconnlimit: 20,
    });
    expect(Number(runtimeRole?.membership_count)).toBe(0);
    runtimeDatabaseUrl = databaseUrl.replace("pac_test@", "pac_app_runtime@");
  }, 60_000);

  afterAll(async () => {
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore",
        windowsHide: true,
        timeout: 30_000,
      });
    }
    const safeTemporaryRoot =
      temporaryRoot &&
      path.dirname(temporaryRoot) === path.resolve(tmpdir()) &&
      path.basename(temporaryRoot).startsWith("pac-postgres-test-");
    if (safeTemporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  it("preserves work objects, receipts, audit records, and counters across a cold store restart", async () => {
    const suffix = randomUUID();
    const restricted = postgres(runtimeDatabaseUrl, { ssl: false, max: 1, prepare: false });
    const [identity] = await restricted.unsafe<{ current_user: string; can_create: boolean }[]>(
      "select current_user, has_schema_privilege(current_user, 'pac', 'create') as can_create",
    );
    expect(identity).toEqual({ current_user: "pac_app_runtime", can_create: false });
    await expect(restricted.unsafe("select * from pac.private_probe")).rejects.toMatchObject({ code: "42501" });
    await restricted.end({ timeout: 5 });

    const storeA = new PostgresStore({ databaseUrl: runtimeDatabaseUrl, sslMode: "disable" });
    const decision = {
      id: `asset-${suffix}`,
      title: "Keep the approved scope",
      owner: "Program steward",
      reviewDate: "2027-09-01",
      problem: "review_due_soon",
      cycle_id: `cycle-${suffix}`,
      flagged_at: "2026-09-05T00:00:00.000Z",
      disposition: "pending",
    };
    const decisionKey = `stale_flag:${decision.id}:${decision.problem}`;
    const idempotencyKey = `idem-${suffix}`;

    const attempts = await Promise.all(
      Array.from({ length: 6 }, () => storeA.put("decision", decisionKey, decision, idempotencyKey)),
    );
    expect(attempts.filter((attempt) => attempt.applied)).toHaveLength(1);
    expect(attempts.every((attempt) => attempt.value.id === decision.id)).toBe(true);

    const counterValues = await Promise.all(
      Array.from({ length: 8 }, () => storeA.counter("cr:20260905")),
    );
    expect([...counterValues].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    const event = audit(suffix);
    await storeA.appendAudit(event);
    await storeA.close();

    const storeB = new PostgresStore({ databaseUrl: runtimeDatabaseUrl, sslMode: "disable" });
    expect(await storeB.get("decision", decisionKey)).toEqual(decision);
    expect(await storeB.list("decision")).toContainEqual(decision);
    expect(await storeB.listAudit(1)).toEqual([event]);
    expect(await storeB.counter("cr:20260905")).toBe(9);

    const replay = await storeB.put(
      "decision",
      decisionKey,
      { ...decision, title: "This replay must not replace the first value" },
      idempotencyKey,
    );
    expect(replay).toEqual({ applied: false, value: decision });
    expect(await storeB.get("decision", decisionKey)).toEqual(decision);
    await storeB.close();
  }, 30_000);
});
