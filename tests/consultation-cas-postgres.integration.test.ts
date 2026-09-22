import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { PostgresStore } from "@/lib/intelligence/memory/postgres-store";
import type { ConsultationMutationKind } from "@/lib/intelligence/memory/consultation-cas";
import type { ConsultRequest } from "@/lib/intelligence/consult/schema";
import { assertWorkObjectPersistence } from "@/lib/trust/work-object-contract";
import {
  buildTestConsultationRecord,
  buildTestConsultationTombstone,
  withConsultationStatus,
} from "@/tests/helpers/consultation-record";

const ROOT = path.resolve(import.meta.dirname, "..");
let consultationSequence = 9300;
const MALFORMED_REVOCATION_HASH = "c".repeat(64);

type TestConsultation = Record<string, unknown> & {
  request_id: string;
  record_type: "consultation_request" | "consultation_tombstone";
  access_key_hash: string;
  access_key_version: "sha256-v1";
  retention_policy_id: string;
  retention_expires_at: string;
  updated_at: string;
  version: number;
};

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

function fullRecord(
  _requestId: string,
  retentionExpiresAt: string,
  overrides: Record<string, unknown> = {},
): TestConsultation {
  const expiry = Date.parse(retentionExpiresAt);
  const createdAt = Number.isFinite(expiry) && expiry <= Date.now()
    ? new Date(expiry - 86_400_000).toISOString()
    : undefined;
  return {
    ...buildTestConsultationRecord({ sequence: consultationSequence++, createdAt, retentionExpiresAt }),
    ...overrides,
  } as unknown as TestConsultation;
}

function tombstone(
  record: TestConsultation,
  at: string,
  retentionExpiresAt = record.retention_expires_at,
): TestConsultation {
  return buildTestConsultationTombstone(
    record as unknown as ConsultRequest,
    at,
    retentionExpiresAt,
  ) as unknown as TestConsultation;
}

function expectation(
  record: TestConsultation,
  guardAt: string,
  mutation: ConsultationMutationKind,
) {
  return {
    version: record.version,
    recordType: "consultation_request" as const,
    retentionExpiresAt: record.retention_expires_at,
    guardAt,
    mutation,
  };
}

function correctedSituation(record: TestConsultation, at: string, situation: string): TestConsultation {
  const existing = Array.isArray(record.correction_history) ? record.correction_history : [];
  return {
    ...record,
    situation,
    updated_at: at,
    version: record.version + 1,
    correction_history: [...existing, { at, fields: ["situation"], by: "requester" }],
  };
}

describe.skipIf(!INITDB || !PG_CTL)("consultation PostgreSQL compare-and-swap boundary", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let runtimeDatabaseUrl = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtime: ReturnType<typeof postgres> | null = null;
  let store: PostgresStore | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-consultation-cas-pg-"));
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
    runtimeDatabaseUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    const migrationNames = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort();
    expect(migrationNames).toContain("0011_pac_consultation_atomic_cas.sql");
    expect(migrationNames).toContain("0013_pac_security_housekeeping.sql");
    expect(migrationNames).toContain("0014_pac_consultation_persistence_contract.sql");
    for (const name of migrationNames) {
      try {
        await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", name), "utf8"));
      } catch (error) {
        throw new Error(`Fresh migration sequence failed at ${name}.`, { cause: error });
      }
    }
    runtime = postgres(runtimeDatabaseUrl, { ssl: false, max: 1, prepare: false });
    store = new PostgresStore({ databaseUrl: runtimeDatabaseUrl, sslMode: "disable" });
  }, 90_000);

  afterAll(async () => {
    await store?.close().catch(() => undefined);
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore",
        windowsHide: true,
        timeout: 30_000,
      });
    }
    if (
      temporaryRoot
      && path.dirname(temporaryRoot) === path.resolve(tmpdir())
      && path.basename(temporaryRoot).startsWith("pac-consultation-cas-pg-")
    ) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 45_000);

  it("serializes concurrent correction and withdrawal and refuses stale writes", async () => {
    const record = fullRecord("CR-pg-correction-withdrawal", "2099-01-01T00:00:00.000Z");
    await store!.put("consult_request", record.request_id, record);
    const at = new Date().toISOString();
    const correction = correctedSituation(
      record,
      at,
      "Corrected S3 material with enough context for the protected PostgreSQL test.",
    );
    const withdrawal = withConsultationStatus(
      record as unknown as ConsultRequest,
      "withdrawn",
      at,
      "requester",
    ) as unknown as TestConsultation;

    const [corrected, withdrawn] = await Promise.all([
      store!.compareAndSwapConsultation(record.request_id, expectation(record, at, "requester_correction"), correction),
      store!.compareAndSwapConsultation(record.request_id, expectation(record, at, "requester_withdrawal"), withdrawal),
    ]);

    expect([corrected.applied, withdrawn.applied].filter(Boolean)).toHaveLength(1);
    expect([corrected, withdrawn].find((result) => !result.applied)).toMatchObject({
      applied: false,
      reason: "conflict",
    });
    const persisted = await store!.get<TestConsultation>("consult_request", record.request_id);
    expect(persisted?.version).toBe(2);
    expect(persisted).toEqual(corrected.applied ? correction : withdrawal);
  });

  it("enforces lifecycle transitions and prevents terminal or eligibility resurrection", async () => {
    const baseTime = Date.now() - 20_000;
    const instant = (offset: number) => new Date(baseTime + offset).toISOString();

    const receivedBase = buildTestConsultationRecord({
      sequence: consultationSequence++,
      createdAt: instant(0),
    });
    const received = withConsultationStatus(receivedBase, "received", instant(1_000)) as unknown as TestConsultation;
    await store!.put("consult_request", receivedBase.request_id, receivedBase);
    await expect(store!.compareAndSwapConsultation(
      receivedBase.request_id,
      expectation(receivedBase as unknown as TestConsultation, instant(1_000), "owner_update"),
      received,
    )).resolves.toEqual({ applied: true, value: received });

    const skipped = withConsultationStatus(
      received as unknown as ConsultRequest,
      "completed",
      instant(2_000),
    ) as unknown as TestConsultation;
    await expect(store!.compareAndSwapConsultation(
      received.request_id,
      expectation(received, instant(2_000), "owner_update"),
      skipped,
    )).rejects.toMatchObject({ code: "invalid_work_object_contract" });

    const eligibilityRegression = {
      ...withConsultationStatus(
        received as unknown as ConsultRequest,
        "declined",
        instant(3_000),
      ),
      eligibility_status: "not_dsd",
    } as unknown as TestConsultation;
    expect(() => assertWorkObjectPersistence(
      "consult_request",
      received.request_id,
      eligibilityRegression,
    )).not.toThrow();
    await expect(store!.compareAndSwapConsultation(
      received.request_id,
      expectation(received, instant(3_000), "owner_update"),
      eligibilityRegression,
    )).rejects.toMatchObject({
      code: "22023",
      message: "Consultation mutation exceeds its authority",
    });

    const terminalBase = buildTestConsultationRecord({
      sequence: consultationSequence++,
      createdAt: instant(4_000),
    });
    const terminalReceived = withConsultationStatus(terminalBase, "received", instant(5_000));
    const terminalReview = withConsultationStatus(terminalReceived, "under_review", instant(6_000));
    const terminalProgress = withConsultationStatus(terminalReview, "in_progress", instant(7_000));
    const terminal = withConsultationStatus(terminalProgress, "completed", instant(8_000)) as unknown as TestConsultation;
    await store!.put("consult_request", terminalBase.request_id, terminalBase);
    for (const [current, next, at] of [
      [terminalBase, terminalReceived, instant(5_000)],
      [terminalReceived, terminalReview, instant(6_000)],
      [terminalReview, terminalProgress, instant(7_000)],
      [terminalProgress, terminal, instant(8_000)],
    ] as const) {
      await expect(store!.compareAndSwapConsultation(
        terminal.request_id,
        expectation(current as unknown as TestConsultation, at, "owner_update"),
        next as unknown as TestConsultation,
      )).resolves.toEqual({ applied: true, value: next });
    }
    const resurrection = withConsultationStatus(
      terminal as unknown as ConsultRequest,
      "under_review",
      instant(9_000),
    ) as unknown as TestConsultation;
    await expect(store!.compareAndSwapConsultation(
      terminal.request_id,
      expectation(terminal, instant(9_000), "owner_update"),
      resurrection,
    )).rejects.toMatchObject({ code: "invalid_work_object_contract" });

    const compoundBase = buildTestConsultationRecord({
      sequence: consultationSequence++,
      createdAt: instant(10_000),
    });
    await store!.put("consult_request", compoundBase.request_id, compoundBase);
    const compoundAt = instant(11_000);
    const compoundReceived = withConsultationStatus(compoundBase, "received", compoundAt);
    const compoundReview = {
      ...withConsultationStatus(compoundReceived, "under_review", compoundAt),
      version: compoundBase.version + 1,
    } as unknown as TestConsultation;
    await expect(store!.compareAndSwapConsultation(
      compoundBase.request_id,
      expectation(compoundBase as unknown as TestConsultation, compoundAt, "owner_update"),
      compoundReview,
    )).resolves.toEqual({ applied: true, value: compoundReview });

    const pendingTerminalBase = buildTestConsultationRecord({
      sequence: consultationSequence++,
      createdAt: instant(12_000),
    });
    const pendingTerminal = withConsultationStatus(
      pendingTerminalBase,
      "withdrawn",
      instant(13_000),
      "requester",
    ) as unknown as TestConsultation;
    await store!.put("consult_request", pendingTerminalBase.request_id, pendingTerminalBase);
    await expect(store!.compareAndSwapConsultation(
      pendingTerminal.request_id,
      expectation(pendingTerminalBase as unknown as TestConsultation, instant(13_000), "requester_withdrawal"),
      pendingTerminal,
    )).resolves.toEqual({ applied: true, value: pendingTerminal });
    const eligibilityResurrection = {
      ...pendingTerminal,
      eligibility_status: "confirmed_dsd",
      updated_at: instant(14_000),
      version: pendingTerminal.version + 1,
    } as unknown as TestConsultation;
    await expect(store!.compareAndSwapConsultation(
      pendingTerminal.request_id,
      expectation(pendingTerminal, instant(14_000), "owner_update"),
      eligibilityResurrection,
    )).rejects.toMatchObject({ code: "22023" });
  });

  it("makes the tombstone win an update-versus-expiry race and blocks resurrection", async () => {
    const mutationAt = new Date().toISOString();
    const expiry = new Date(Date.now() - 1_000).toISOString();
    const record = fullRecord("CR-pg-update-expiry", expiry);
    await store!.put("consult_request", record.request_id, record);
    const correction = correctedSituation(
      record,
      mutationAt,
      "A corrected S3 situation immediately before expiry for the PostgreSQL race test.",
    );
    const initialTombstone = tombstone(record, mutationAt);
    const [correctionResult, initialRedaction] = await Promise.all([
      store!.compareAndSwapConsultation(
        record.request_id,
        expectation(record, mutationAt, "requester_correction"),
        correction,
      ),
      store!.compareAndSwapConsultation(
        record.request_id,
        expectation(record, mutationAt, "expiry_tombstone"),
        initialTombstone,
      ),
    ]);
    expect(initialRedaction).toEqual({ applied: true, value: initialTombstone });
    expect(correctionResult).toMatchObject({ applied: false });

    const persisted = await store!.get<TestConsultation>("consult_request", record.request_id);
    expect(persisted?.record_type).toBe("consultation_tombstone");
    expect(persisted).not.toHaveProperty("situation");
    expect(Object.keys(persisted ?? {}).sort()).toEqual([
      "access_key_hash",
      "access_key_version",
      "record_type",
      "redacted_at",
      "request_id",
      "retention_expires_at",
      "retention_policy_id",
      "status",
      "updated_at",
      "version",
    ]);

    const stale = await store!.compareAndSwapConsultation(
      record.request_id,
      expectation(record, mutationAt, "requester_correction"),
      correction,
    );
    expect(stale).toMatchObject({ applied: false, reason: "tombstone" });
    await expect(store!.put("consult_request", record.request_id, correction))
      .rejects.toThrow("A new consultation must begin at the approved intake state.");
  });

  it("redacts an invalid expiry atomically and substitutes a valid tombstone deadline", async () => {
    const record = fullRecord("CR-pg-invalid-expiry", "2099-01-01T00:00:00.000Z");
    await store!.put("consult_request", record.request_id, record);
    // Recreate a legacy/corrupt row beneath today's write contracts, then prove
    // the only permitted runtime mutation is an atomic minimal tombstone.
    await admin!.unsafe(`alter table pac.runtime_work_objects disable trigger consultation_cas_update`);
    await admin!.unsafe(`alter table pac.runtime_work_objects disable trigger consultation_persistence_contract`);
    await admin!.unsafe(`alter table pac.runtime_work_objects disable trigger runtime_work_object_contract`);
    try {
      await admin!.unsafe(
        `update pac.runtime_work_objects
            set value = jsonb_set(value, '{retention_expires_at}', '"9999"'::jsonb)
          where work_kind = 'consult_request' and object_id = $1`,
        [record.request_id],
      );
    } finally {
      await admin!.unsafe(`alter table pac.runtime_work_objects enable trigger runtime_work_object_contract`);
      await admin!.unsafe(`alter table pac.runtime_work_objects enable trigger consultation_persistence_contract`);
      await admin!.unsafe(`alter table pac.runtime_work_objects enable trigger consultation_cas_update`);
    }
    record.retention_expires_at = "9999";
    const guardAt = new Date().toISOString();
    const replacement = tombstone(record, guardAt, guardAt);

    const result = await store!.compareAndSwapConsultation(
      record.request_id,
      expectation(record, guardAt, "invalid_expiry_tombstone"),
      replacement,
    );

    expect(result).toEqual({ applied: true, value: replacement });
    const persisted = await store!.get<TestConsultation>("consult_request", record.request_id);
    expect(persisted).toEqual(replacement);
    expect(Number.isFinite(Date.parse(persisted!.retention_expires_at))).toBe(true);
    const databaseRow = await admin!.unsafe<{ value: TestConsultation }[]>(
      `select value from pac.runtime_work_objects
       where work_kind = 'consult_request' and object_id = $1`,
      [record.request_id],
    );
    expect(databaseRow[0].value).not.toHaveProperty("situation");
  });

  it("rejects adversarial consultation shapes at the direct PostgreSQL boundary", async () => {
    const adversarial: Array<[string, (candidate: Record<string, unknown>) => void]> = [
      ["unknown root field", (candidate) => { candidate.favorite_color = "blue"; }],
      ["missing packet", (candidate) => { delete candidate.packet; }],
      ["invalid enum", (candidate) => { candidate.stage = "finished"; }],
      ["impossible state", (candidate) => { candidate.status = "received"; }],
      ["malformed hash", (candidate) => { candidate.access_key_hash = "no"; }],
      ["noncanonical time", (candidate) => { candidate.updated_at = "2026-09-05 12:00:00Z"; }],
      ["fractional version", (candidate) => { candidate.version = 1.5; }],
      ["bad correction field", (candidate) => {
        candidate.correction_history = [{
          at: candidate.updated_at,
          fields: ["owner_notes"],
          by: "requester",
        }];
      }],
      ["malformed nested packet", (candidate) => {
        (candidate.packet as { agenda: unknown }).agenda = [{ minutes: "five", item: "Review", owner: "Requester" }];
      }],
      ["profile-like bucket", (candidate) => { candidate.employee_equity_score = 100; }],
    ];

    for (const [label, mutate] of adversarial) {
      const record = buildTestConsultationRecord({ sequence: consultationSequence++ });
      const candidate = structuredClone(record) as unknown as Record<string, unknown>;
      mutate(candidate);
      await expect(runtime!.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('consult_request', $1, $2::jsonb)`,
        [record.request_id, JSON.stringify(candidate)],
      ), label).rejects.toMatchObject({ code: "22023" });
    }

    const mismatch = buildTestConsultationRecord({ sequence: consultationSequence++ });
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('consult_request', $1, $2::jsonb)`,
      [buildTestConsultationRecord({ sequence: consultationSequence++ }).request_id, JSON.stringify(mismatch)],
    )).rejects.toMatchObject({ code: "22023" });

    const malformedId = { ...buildTestConsultationRecord({ sequence: consultationSequence++ }), request_id: "CR-free-form" };
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('consult_request', $1, $2::jsonb)`,
      [malformedId.request_id, JSON.stringify(malformedId)],
    )).rejects.toMatchObject({ code: "22023" });

    const full = buildTestConsultationRecord({ sequence: consultationSequence++ });
    const at = new Date(Date.parse(full.created_at) + 60_000).toISOString();
    const overfullTombstone = { ...buildTestConsultationTombstone(full, at), situation: full.situation };
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('consult_request', $1, $2::jsonb)`,
      [full.request_id, JSON.stringify(overfullTombstone)],
    )).rejects.toMatchObject({ code: "22023" });
  });

  it("purges only expired valid revocations and rate buckets through the bounded runtime function", async () => {
    const now = Date.now();
    const expiredHash = "d".repeat(64);
    const activeHash = "e".repeat(64);
    const expiredId = `owner-session-revoked-${expiredHash}`;
    const activeId = `owner-session-revoked-${activeHash}`;
    await admin!.unsafe("alter table pac.runtime_work_objects disable trigger runtime_work_object_contract");
    await admin!.unsafe("alter table pac.runtime_work_objects disable trigger owner_session_revocation_contract");
    try {
      await admin!.unsafe(
        `insert into pac.runtime_work_objects (work_kind, object_id, value)
         values ('decision', $1, $2::jsonb)`,
        [
          `owner-session-revoked-${MALFORMED_REVOCATION_HASH}`,
          {
            kind: "owner_session_revocation",
            session_hash: MALFORMED_REVOCATION_HASH,
            revoked_at: "malformed-but-fail-closed",
            expires_at: "malformed-but-fail-closed",
          },
        ],
      );
    } finally {
      await admin!.unsafe("alter table pac.runtime_work_objects enable trigger owner_session_revocation_contract");
      await admin!.unsafe("alter table pac.runtime_work_objects enable trigger runtime_work_object_contract");
    }
    await store!.put("decision", expiredId, {
      kind: "owner_session_revocation",
      session_hash: expiredHash,
      revoked_at: new Date(now - 30 * 60_000).toISOString(),
      expires_at: new Date(now - 20 * 60_000).toISOString(),
    });
    await store!.put("decision", activeId, {
      kind: "owner_session_revocation",
      session_hash: activeHash,
      revoked_at: new Date(now - 60_000).toISOString(),
      expires_at: new Date(now + 60 * 60_000).toISOString(),
    });
    await admin!.unsafe(
      `insert into pac.runtime_rate_limits (scope, subject_hash, request_count, reset_at)
       values ('staff-ask', $1, 1, clock_timestamp() - interval '1 minute'),
              ('staff-ask', $2, 1, clock_timestamp() + interval '1 hour')`,
      ["f".repeat(64), "1".repeat(64)],
    );

    await expect(runtime!.unsafe(
      `delete from pac.runtime_work_objects where object_id = $1`,
      [expiredId],
    )).rejects.toMatchObject({ code: "42501" });
    await expect(runtime!.unsafe(
      `delete from pac.runtime_rate_limits where scope = 'staff-ask'`,
    )).rejects.toMatchObject({ code: "42501" });

    const purged = await runtime!.unsafe<Array<{
      owner_session_revocations_deleted: number;
      rate_limit_buckets_deleted: number;
    }>>(`select * from pac.purge_expired_security_records()`);
    expect(Number(purged[0].owner_session_revocations_deleted)).toBe(1);
    expect(Number(purged[0].rate_limit_buckets_deleted)).toBe(1);

    const decisions = await admin!.unsafe<Array<{ object_id: string }>>(
      `select object_id from pac.runtime_work_objects
       where object_id = any($1::text[]) order by object_id`,
      [[expiredId, activeId, `owner-session-revoked-${MALFORMED_REVOCATION_HASH}`]],
    );
    expect(decisions.map((row) => row.object_id)).toEqual([
      activeId,
      `owner-session-revoked-${MALFORMED_REVOCATION_HASH}`,
    ].sort());
    const buckets = await admin!.unsafe<Array<{ subject_hash: string }>>(
      `select subject_hash from pac.runtime_rate_limits where scope = 'staff-ask' order by subject_hash`,
    );
    expect(buckets.map((row) => row.subject_hash)).toEqual(["1".repeat(64)]);

    const second = await runtime!.unsafe<Array<{
      owner_session_revocations_deleted: number;
      rate_limit_buckets_deleted: number;
    }>>(`select * from pac.purge_expired_security_records()`);
    expect(Number(second[0].owner_session_revocations_deleted)).toBe(0);
    expect(Number(second[0].rate_limit_buckets_deleted)).toBe(0);
  });
});
