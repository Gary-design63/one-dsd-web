import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { PostgresStore } from "@/lib/intelligence/memory/postgres-store";
import { OPERATIONAL_RECORD_RETENTION_DAYS } from "@/lib/privacy/operational-retention";
import { CONSULTATION_TOMBSTONE_RETENTION_DAYS } from "@/lib/privacy/consultation-terminal-retention";
import {
  buildTestConsultationRecord,
  buildTestConsultationTombstone,
} from "@/tests/helpers/consultation-record";
import { testSpanId, testTraceId } from "@/tests/helpers/opaque-identifiers";

const ROOT = path.resolve(import.meta.dirname, "..");
const DAY = 24 * 60 * 60 * 1000;

function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    process.env.PAC_TEST_POSTGRES_BIN
      ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable)
      : "",
    process.platform === "win32"
      ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable)
      : "",
    `/usr/lib/postgresql/16/bin/${executable}`,
    `/usr/lib/postgresql/15/bin/${executable}`,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const INITDB = postgresBinary("initdb");
const PG_CTL = postgresBinary("pg_ctl");

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

function auditEvent(label: string, at: string) {
  return {
    trace_id: testTraceId(`postgres-housekeeping-${label}`),
    span_id: testSpanId(`postgres-housekeeping-${label}`),
    at,
    agent_id: "ask_concierge",
    agent_version: "0.1.0",
    tool_name: "research.current_answer",
    autonomy_level_used: "A0",
    permission_mode: "always",
    dry_run: false,
    content_ids_touched: [],
    allowlist_hit: true,
    model_id: "fixture/research-1",
    ok: true,
  };
}

function researchUsage(sequence: number, at: string) {
  const suffix = sequence.toString(16).padStart(4, "0");
  const id = `ru_${at.replace(/[^0-9]/g, "").slice(0, 14)}_${"d".repeat(6)}_${suffix}`;
  return {
    id,
    at,
    provider: "fixture",
    model: "fixture/research-1",
    depth: "current_web",
    query_hash: "d".repeat(16),
    domains: ["example.org"],
    estimated_usd: 0,
    ok: true,
    latency_ms: 1,
    trace_id: `00000000-0000-4000-8000-00000000${suffix}`,
  };
}

describe.skipIf(!INITDB || !PG_CTL)("fresh PostgreSQL operational-record retention", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtimeUrl = "";

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-security-housekeeping-postgres-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const logFile = path.join(temporaryRoot, "postgres.log");
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

    const adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    const migrations = [
      "0001_pac_content_foundation.sql",
      "0002_pac_runtime_store.sql",
      "0003_pac_private_source_objects.sql",
      "0004_pac_scoped_staff_publications.sql",
      "0005_pac_owner_resource_drafts.sql",
      "0006_pac_owner_resource_release.sql",
      "0007_pac_home_footer_content.sql",
      "0008_pac_owner_resource_release.sql",
      "0009_pac_data_trust_foundation.sql",
      "0010_pac_trusted_resource_release.sql",
      "0011_pac_consultation_atomic_cas.sql",
      "0012_pac_no_surveillance_contracts.sql",
      "0013_pac_security_housekeeping.sql",
      "0014_pac_consultation_persistence_contract.sql",
      "0015_pac_terminal_consultation_cleanup.sql",
      "0016_pac_trusted_home_footer_release.sql",
    ];
    for (const migration of migrations) {
      try {
        await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", migration), "utf8"));
      } catch (error) {
        throw new Error(`Fresh migration sequence failed at ${migration}.`, { cause: error });
      }
    }
    runtimeUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
  }, 120_000);

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
      temporaryRoot
      && path.dirname(temporaryRoot) === path.resolve(tmpdir())
      && path.basename(temporaryRoot).startsWith("pac-security-housekeeping-postgres-");
    if (safeTemporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  it("deletes only valid expired records and is repeatable through the restricted role", async () => {
    const now = Date.now();
    const expiredAt = new Date(now - (OPERATIONAL_RECORD_RETENTION_DAYS + 1) * DAY).toISOString();
    const activeAt = new Date(now - (OPERATIONAL_RECORD_RETENTION_DAYS - 1) * DAY).toISOString();
    const oldExpiry = new Date(now - 11 * 60 * 1000).toISOString();
    const oldRevokedAt = new Date(now - 60 * 60 * 1000).toISOString();
    const futureExpiry = new Date(now + 60 * 60 * 1000).toISOString();
    const expiredHash = "a".repeat(64);
    const activeHash = "b".repeat(64);
    const tombstoneRedactedAt = new Date(
      now - (CONSULTATION_TOMBSTONE_RETENTION_DAYS + 1) * DAY,
    ).toISOString();
    const terminalRequest = buildTestConsultationRecord({
      sequence: 9901,
      createdAt: new Date(now - (CONSULTATION_TOMBSTONE_RETENTION_DAYS + 3) * DAY).toISOString(),
      retentionExpiresAt: new Date(now - (CONSULTATION_TOMBSTONE_RETENTION_DAYS + 2) * DAY).toISOString(),
    });
    const terminalTombstone = buildTestConsultationTombstone(terminalRequest, tombstoneRedactedAt);
    const terminalIdempotencyKey = `consult-submit-v2-${"9".repeat(64)}`;

    await admin!.unsafe(
      `insert into pac.runtime_audit_events (event, occurred_at) values
        ($1::jsonb, $2::timestamptz),
        ($3::jsonb, $4::timestamptz)`,
      [
        auditEvent("expired", expiredAt), expiredAt,
        auditEvent("active", activeAt), activeAt,
      ],
    );
    await admin!.unsafe("alter table pac.runtime_audit_events disable trigger runtime_audit_event_contract");
    try {
      await admin!.unsafe(
        `insert into pac.runtime_audit_events (event, occurred_at) values
          ($1::jsonb, $2::timestamptz),
          ($3::jsonb, $4::timestamptz)`,
        [
          auditEvent("mismatch", expiredAt), activeAt,
          auditEvent("malformed", "2026-01-01 00:00:00Z"), expiredAt,
        ],
      );
    } finally {
      await admin!.unsafe("alter table pac.runtime_audit_events enable trigger runtime_audit_event_contract");
    }

    const expiredUsage = researchUsage(1, expiredAt);
    const activeUsage = researchUsage(2, activeAt);
    const malformedUsage = researchUsage(3, "2026-01-01 00:00:00Z");
    await admin!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value) values
        ('decision', $1, $2::jsonb),
        ('decision', $3, $4::jsonb),
        ('decision', 'research_policy', '{"enabled": false}'::jsonb),
        ('decision', $5, $6::jsonb),
        ('decision', $7, $8::jsonb)`,
      [
        `research_usage:${expiredUsage.id}`, expiredUsage,
        `research_usage:${activeUsage.id}`, activeUsage,
        `owner-session-revoked-${expiredHash}`,
        {
          kind: "owner_session_revocation",
          session_hash: expiredHash,
          revoked_at: oldRevokedAt,
          expires_at: oldExpiry,
        },
        `owner-session-revoked-${activeHash}`,
        {
          kind: "owner_session_revocation",
          session_hash: activeHash,
          revoked_at: oldRevokedAt,
          expires_at: futureExpiry,
        },
      ],
    );
    await admin!.unsafe("alter table pac.runtime_work_objects disable trigger runtime_work_object_contract");
    try {
      await admin!.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('decision', $1, $2::jsonb)`,
        [`research_usage:${malformedUsage.id}`, malformedUsage],
      );
    } finally {
      await admin!.unsafe("alter table pac.runtime_work_objects enable trigger runtime_work_object_contract");
    }
    await admin!.unsafe(
      `insert into pac.runtime_rate_limits (scope, subject_hash, request_count, reset_at) values
        ('staff-ask', $1, 1, clock_timestamp() - interval '1 minute'),
        ('owner-login', $2, 1, clock_timestamp() + interval '1 hour')`,
      [expiredHash, activeHash],
    );
    await admin!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('consult_request', $1, $2::jsonb)`,
      [terminalRequest.request_id, terminalTombstone],
    );
    await admin!.unsafe(
      `insert into pac.runtime_idempotency (idempotency_key, work_kind, object_id, value)
       values ($1, 'consult_request', $2, $3::jsonb)`,
      [
        terminalIdempotencyKey,
        terminalRequest.request_id,
        { work_kind: "consult_request", object_id: terminalRequest.request_id },
      ],
    );

    const runtime = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false });
    await expect(runtime.unsafe("delete from pac.runtime_audit_events"))
      .rejects.toMatchObject({ code: "42501" });
    await expect(runtime.unsafe("delete from pac.runtime_work_objects"))
      .rejects.toMatchObject({ code: "42501" });
    await runtime.end({ timeout: 5 });

    const store = new PostgresStore({ databaseUrl: runtimeUrl, sslMode: "disable" });
    await expect(store.purgeExpiredSecurityRecords()).resolves.toEqual({
      ownerSessionRevocations: 1,
      rateLimitBuckets: 1,
      auditEvents: 1,
      researchUsageRecords: 1,
      consultationTombstones: 1,
      idempotencyReceipts: 1,
    });
    await expect(store.purgeExpiredSecurityRecords()).resolves.toEqual({
      ownerSessionRevocations: 0,
      rateLimitBuckets: 0,
      auditEvents: 0,
      researchUsageRecords: 0,
      consultationTombstones: 0,
      idempotencyReceipts: 0,
    });
    await store.close();

    const remainingAudit = await admin!.unsafe<{ trace_id: string }[]>(
      `select event ->> 'trace_id' as trace_id from pac.runtime_audit_events order by audit_id`,
    );
    expect(remainingAudit.map((row) => row.trace_id)).toEqual([
      testTraceId("postgres-housekeeping-active"),
      testTraceId("postgres-housekeeping-mismatch"),
      testTraceId("postgres-housekeeping-malformed"),
    ]);
    const remainingDecisions = await admin!.unsafe<{ object_id: string }[]>(
      `select object_id from pac.runtime_work_objects where work_kind = 'decision' order by object_id`,
    );
    expect(remainingDecisions.map((row) => row.object_id)).toEqual(expect.arrayContaining([
      `research_usage:${activeUsage.id}`,
      `research_usage:${malformedUsage.id}`,
      "research_policy",
      `owner-session-revoked-${activeHash}`,
    ]));
    expect(remainingDecisions.map((row) => row.object_id)).not.toContain(
      `research_usage:${expiredUsage.id}`,
    );
    expect(remainingDecisions.map((row) => row.object_id)).not.toContain(
      `owner-session-revoked-${expiredHash}`,
    );
    const remainingTerminal = await admin!.unsafe<{ request_count: number; receipt_count: number }[]>(
      `select
         (select count(*)::integer from pac.runtime_work_objects
          where work_kind = 'consult_request' and object_id = $1) as request_count,
         (select count(*)::integer from pac.runtime_idempotency
          where idempotency_key = $2) as receipt_count`,
      [terminalRequest.request_id, terminalIdempotencyKey],
    );
    expect(remainingTerminal[0]).toEqual({ request_count: 0, receipt_count: 0 });
  }, 30_000);
});
