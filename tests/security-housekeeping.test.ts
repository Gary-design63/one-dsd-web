import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createFileStoreForTests,
  resetStoreForTests,
  type Store,
} from "@/lib/intelligence/memory/store";
import { runCycle } from "@/lib/intelligence/agents/cycle";
import { setPolicy } from "@/lib/intelligence/policy";
import type { AuditEvent } from "@/lib/intelligence/types";
import type { ResearchUsageEvent } from "@/lib/intelligence/research/governance";
import {
  OPERATIONAL_RECORD_RETENTION_DAYS,
  OPERATIONAL_RETENTION_BATCH_LIMIT,
} from "@/lib/privacy/operational-retention";
import { testSpanId, testTraceId } from "@/tests/helpers/opaque-identifiers";

const NOW = Date.UTC(2026, 8, 5, 17, 0, 0);
const EXPIRED_HASH = "a".repeat(64);
const ACTIVE_HASH = "b".repeat(64);
const DAY = 24 * 60 * 60 * 1000;
const HOUSEKEEPING_MIGRATION = readFileSync(
  path.resolve(import.meta.dirname, "../db/migrations/0013_pac_security_housekeeping.sql"),
  "utf8",
);

function revocation(sessionHash: string, revokedAt: string, expiresAt: string) {
  return {
    objectId: `owner-session-revoked-${sessionHash}`,
    value: {
      kind: "owner_session_revocation" as const,
      session_hash: sessionHash,
      revoked_at: revokedAt,
      expires_at: expiresAt,
    },
  };
}

function auditEvent(label: string, at: string): AuditEvent {
  return {
    trace_id: testTraceId(`housekeeping-audit-${label}`),
    span_id: testSpanId(`housekeeping-audit-${label}`),
    at,
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

function researchUsage(sequence: number, at: string): ResearchUsageEvent {
  const suffix = sequence.toString(16).padStart(4, "0");
  const id = `ru_${at.replace(/[^0-9]/g, "").slice(0, 14)}_${"c".repeat(6)}_${suffix}`;
  return {
    id,
    at,
    provider: "fixture",
    model: "fixture/research-1",
    depth: "current_web",
    query_hash: "c".repeat(16),
    domains: ["example.org"],
    estimated_usd: 0,
    ok: true,
    latency_ms: 1,
    trace_id: `00000000-0000-4000-8000-00000000${suffix}`,
  };
}

async function seedSecurityRecords(store: Store): Promise<{
  expiredId: string;
  activeId: string;
  expiredUsageId: string;
  activeUsageId: string;
}> {
  const expired = revocation(
    EXPIRED_HASH,
    "2026-09-05T15:00:00.000Z",
    "2026-09-05T16:00:00.000Z",
  );
  const active = revocation(
    ACTIVE_HASH,
    "2026-09-05T16:00:00.000Z",
    "2026-09-05T18:00:00.000Z",
  );
  await store.put("decision", expired.objectId, expired.value);
  await store.put("decision", active.objectId, active.value);

  vi.setSystemTime(NOW - 2_000);
  await store.consumeRateLimit("expired.window", EXPIRED_HASH, 3, 1);
  vi.setSystemTime(NOW);
  await store.consumeRateLimit("active.window", ACTIVE_HASH, 3, 60);
  const expiredUsage = researchUsage(
    1,
    new Date(NOW - (OPERATIONAL_RECORD_RETENTION_DAYS + 1) * DAY).toISOString(),
  );
  const activeUsage = researchUsage(
    2,
    new Date(NOW - (OPERATIONAL_RECORD_RETENTION_DAYS - 1) * DAY).toISOString(),
  );
  await store.put("decision", `research_usage:${expiredUsage.id}`, expiredUsage);
  await store.put("decision", `research_usage:${activeUsage.id}`, activeUsage);
  await store.appendAudit(auditEvent("expired", expiredUsage.at));
  await store.appendAudit(auditEvent("active", activeUsage.at));
  return {
    expiredId: expired.objectId,
    activeId: active.objectId,
    expiredUsageId: `research_usage:${expiredUsage.id}`,
    activeUsageId: `research_usage:${activeUsage.id}`,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("expired security-record housekeeping", () => {
  it("keeps database cleanup bounded and denies direct runtime-table deletion", () => {
    expect(HOUSEKEEPING_MIGRATION).toContain("create or replace function pac.purge_expired_security_records()");
    expect(HOUSEKEEPING_MIGRATION.match(/limit 10000/g)).toHaveLength(4);
    expect(OPERATIONAL_RETENTION_BATCH_LIMIT).toBe(10_000);
    expect(HOUSEKEEPING_MIGRATION).toContain("clock_timestamp() - interval '90 days'");
    expect(HOUSEKEEPING_MIGRATION).toContain("pac.is_valid_research_usage_record(object_id, value)");
    expect(HOUSEKEEPING_MIGRATION).toContain("pac.is_canonical_utc_instant(event ->> 'at')");
    expect(HOUSEKEEPING_MIGRATION).toContain("grant execute on function pac.purge_expired_security_records() to pac_app_runtime");
    expect(HOUSEKEEPING_MIGRATION).not.toMatch(/grant\s+delete\s+on\s+pac\.runtime_(?:work_objects|rate_limits|audit_events)/i);
    expect(HOUSEKEEPING_MIGRATION).toContain("clock_timestamp() - interval '10 minutes'");
    expect(HOUSEKEEPING_MIGRATION).toContain("and value ->> 'expires_at' <= revocation_cutoff");
    expect(HOUSEKEEPING_MIGRATION).toContain("where reset_at <= clock_timestamp()");
  });

  it("removes only expired revocations and buckets from the memory store", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const store = resetStoreForTests();
    const { expiredId, activeId, expiredUsageId, activeUsageId } = await seedSecurityRecords(store);
    const insideGrace = revocation(
      "c".repeat(64),
      "2026-09-05T16:00:00.000Z",
      "2026-09-05T16:55:00.000Z",
    );
    await store.put("decision", insideGrace.objectId, insideGrace.value);

    await expect(store.purgeExpiredSecurityRecords()).resolves.toEqual({
      ownerSessionRevocations: 1,
      rateLimitBuckets: 1,
      auditEvents: 1,
      researchUsageRecords: 1,
      consultationTombstones: 0,
      idempotencyReceipts: 0,
    });
    await expect(store.get("decision", expiredId)).resolves.toBeNull();
    await expect(store.get("decision", activeId)).resolves.not.toBeNull();
    await expect(store.get("decision", expiredUsageId)).resolves.toBeNull();
    await expect(store.get("decision", activeUsageId)).resolves.not.toBeNull();
    await expect(store.listAudit()).resolves.toEqual([
      expect.objectContaining({ trace_id: testTraceId("housekeeping-audit-active") }),
    ]);
    await expect(store.get("decision", insideGrace.objectId)).resolves.not.toBeNull();
    await expect(store.purgeExpiredSecurityRecords()).resolves.toEqual({
      ownerSessionRevocations: 0,
      rateLimitBuckets: 0,
      auditEvents: 0,
      researchUsageRecords: 0,
      consultationTombstones: 0,
      idempotencyReceipts: 0,
    });
  });

  it("applies the same lifecycle to the local file store", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const root = mkdtempSync(path.join(tmpdir(), "pac-security-housekeeping-"));
    try {
      const store = createFileStoreForTests(root);
      const { expiredId, activeId, expiredUsageId, activeUsageId } = await seedSecurityRecords(store);

      await expect(store.purgeExpiredSecurityRecords()).resolves.toEqual({
        ownerSessionRevocations: 1,
        rateLimitBuckets: 1,
        auditEvents: 1,
        researchUsageRecords: 1,
        consultationTombstones: 0,
        idempotencyReceipts: 0,
      });
      await expect(store.get("decision", expiredId)).resolves.toBeNull();
      await expect(store.get("decision", activeId)).resolves.not.toBeNull();
      await expect(store.get("decision", expiredUsageId)).resolves.toBeNull();
      await expect(store.get("decision", activeUsageId)).resolves.not.toBeNull();
      await expect(store.listAudit()).resolves.toEqual([
        expect.objectContaining({ trace_id: testTraceId("housekeeping-audit-active") }),
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("serializes local audit cleanup with concurrent appends", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const root = mkdtempSync(path.join(tmpdir(), "pac-audit-race-"));
    try {
      const store = createFileStoreForTests(root);
      await store.appendAudit(auditEvent(
        "race-expired",
        new Date(NOW - (OPERATIONAL_RECORD_RETENTION_DAYS + 1) * DAY).toISOString(),
      ));
      const active = auditEvent("race-active", new Date(NOW).toISOString());
      await Promise.all([
        store.purgeExpiredSecurityRecords(),
        store.appendAudit(active),
      ]);
      await expect(store.listAudit()).resolves.toEqual([active]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("runs housekeeping during a killed orchestration cycle", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const store = resetStoreForTests();
    const { expiredId, expiredUsageId } = await seedSecurityRecords(store);
    await setPolicy({ killed: true, note: "Synthetic housekeeping kill-switch check." }, "owner");

    const report = await runCycle("owner");
    expect(report.steps.find((step) => step.name === "purge expired security records")).toMatchObject({
      outcome: "done",
      autonomy: "A0",
    });
    await expect(store.get("decision", expiredId)).resolves.toBeNull();
    await expect(store.get("decision", expiredUsageId)).resolves.toBeNull();
    await expect(store.listAudit()).resolves.toEqual([
      expect.objectContaining({ trace_id: testTraceId("housekeeping-audit-active") }),
    ]);
  });

  it("requires canonical UTC timestamps for new operational records", async () => {
    const store = resetStoreForTests();
    await expect(store.appendAudit(auditEvent("noncanonical", "2026-09-05 17:00:00Z")))
      .rejects.toThrow(/canonical UTC timestamp|approved persistence contract/i);
  });

  it("does not silently discard recent audit records before the retention deadline", async () => {
    const store = resetStoreForTests();
    const event = auditEvent("recent-volume", "2026-09-05T17:00:00.000Z");
    for (let index = 0; index < 5_001; index += 1) await store.appendAudit(event);
    await expect(store.listAudit(6_000)).resolves.toHaveLength(5_001);
  });

  it("retains malformed operational records instead of treating them as deletion authority", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const store = resetStoreForTests();
    const malformedUsage = researchUsage(3, "2026-01-01 00:00:00Z");
    const internals = store as unknown as {
      data: Map<string, unknown>;
      audit: AuditEvent[];
    };
    internals.data.set(`decision:research_usage:${malformedUsage.id}`, malformedUsage);
    internals.audit.push(auditEvent("malformed", "2026-01-01 00:00:00Z"));

    await expect(store.purgeExpiredSecurityRecords()).resolves.toEqual({
      ownerSessionRevocations: 0,
      rateLimitBuckets: 0,
      auditEvents: 0,
      researchUsageRecords: 0,
      consultationTombstones: 0,
      idempotencyReceipts: 0,
    });
    await expect(store.get("decision", `research_usage:${malformedUsage.id}`))
      .resolves.toEqual(malformedUsage);
    await expect(store.listAudit()).resolves.toEqual([
      expect.objectContaining({ trace_id: testTraceId("housekeeping-audit-malformed") }),
    ]);
  });

  it("retains an unreadable revocation marker and fails the cleanup closed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const root = mkdtempSync(path.join(tmpdir(), "pac-security-housekeeping-corrupt-"));
    const decisionDirectory = path.join(root, "decision");
    const filename = path.join(decisionDirectory, `owner-session-revoked-${EXPIRED_HASH}.json`);
    try {
      mkdirSync(decisionDirectory, { recursive: true });
      writeFileSync(filename, "{not valid JSON", "utf8");
      const store = createFileStoreForTests(root);

      await expect(store.purgeExpiredSecurityRecords()).rejects.toBeInstanceOf(SyntaxError);
      expect(existsSync(filename)).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("rejects mismatched hashes and non-canonical revocation timestamps", async () => {
    const store = resetStoreForTests();
    await expect(store.put("decision", `owner-session-revoked-${EXPIRED_HASH}`, {
      kind: "owner_session_revocation",
      session_hash: ACTIVE_HASH,
      revoked_at: "2026-09-05T15:00:00.000Z",
      expires_at: "2026-09-05T16:00:00.000Z",
    })).rejects.toThrow("approved persistence contract");

    await expect(store.put("decision", `owner-session-revoked-${EXPIRED_HASH}`, {
      kind: "owner_session_revocation",
      session_hash: EXPIRED_HASH,
      revoked_at: "2026-09-05 15:00:00Z",
      expires_at: "2026-09-05T16:00:00.000Z",
    })).rejects.toThrow("approved persistence contract");
  });
});
