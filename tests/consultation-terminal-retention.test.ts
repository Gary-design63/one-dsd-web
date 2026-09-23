import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createFileStoreForTests,
  resetStoreForTests,
  type Store,
} from "@/lib/intelligence/memory/store";
import {
  CONSULTATION_TOMBSTONE_RETENTION_DAYS,
  CONSULTATION_TOMBSTONE_RETENTION_MS,
  consultationTombstoneTerminalDeletionDue,
} from "@/lib/privacy/consultation-terminal-retention";
import {
  buildTestConsultationRecord,
  buildTestConsultationTombstone,
} from "@/tests/helpers/consultation-record";

const roots: string[] = [];
const REDACTED_AT = "2026-07-03T00:00:00.000Z";

afterEach(() => {
  vi.useRealTimers();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

async function seedTerminalTombstone(store: Store, sequence: number) {
  vi.useFakeTimers();
  vi.setSystemTime(REDACTED_AT);
  const request = buildTestConsultationRecord({
    sequence,
    createdAt: "2026-07-01T00:00:00.000Z",
    retentionExpiresAt: "2026-07-02T00:00:00.000Z",
  });
  const idempotencyKey = `consult-submit-v2-${sequence.toString(16).padStart(64, "0")}`;
  await store.put("consult_request", request.request_id, request, idempotencyKey);
  const tombstone = buildTestConsultationTombstone(request, REDACTED_AT);
  const result = await store.compareAndSwapConsultation(request.request_id, {
    version: request.version,
    recordType: "consultation_request",
    retentionExpiresAt: request.retention_expires_at,
    mutation: "expiry_tombstone",
    guardAt: REDACTED_AT,
  }, tombstone);
  expect(result.applied).toBe(true);
  return { request, tombstone };
}

describe("terminal consultation tombstone lifecycle", () => {
  it("uses an exact 30-day boundary and never treats malformed data as deletion authority", () => {
    expect(CONSULTATION_TOMBSTONE_RETENTION_DAYS).toBe(30);
    const request = buildTestConsultationRecord({
      sequence: 9801,
      createdAt: "2026-07-01T00:00:00.000Z",
      retentionExpiresAt: "2026-07-02T00:00:00.000Z",
    });
    const tombstone = buildTestConsultationTombstone(request, REDACTED_AT);
    const boundary = Date.parse(REDACTED_AT) + CONSULTATION_TOMBSTONE_RETENTION_MS;
    expect(consultationTombstoneTerminalDeletionDue(request.request_id, tombstone, boundary - 1)).toBe(false);
    expect(consultationTombstoneTerminalDeletionDue(request.request_id, tombstone, boundary)).toBe(true);
    expect(consultationTombstoneTerminalDeletionDue(request.request_id, {
      ...tombstone,
      redacted_at: "not-a-time",
    }, boundary)).toBe(false);
  });

  it.each(["memory", "file"] as const)(
    "removes a %s tombstone and its replay receipt only at terminal expiry",
    async (backend) => {
      const root = backend === "file" ? mkdtempSync(path.join(tmpdir(), "pac-terminal-consult-")) : null;
      if (root) roots.push(root);
      const store = root ? createFileStoreForTests(root) : resetStoreForTests();
      const { request } = await seedTerminalTombstone(store, backend === "file" ? 9803 : 9802);
      const boundary = Date.parse(REDACTED_AT) + CONSULTATION_TOMBSTONE_RETENTION_MS;

      vi.setSystemTime(boundary - 1);
      await expect(store.purgeExpiredSecurityRecords()).resolves.toMatchObject({
        consultationTombstones: 0,
        idempotencyReceipts: 0,
      });
      await expect(store.get("consult_request", request.request_id)).resolves.not.toBeNull();

      vi.setSystemTime(boundary);
      await expect(store.purgeExpiredSecurityRecords()).resolves.toMatchObject({
        consultationTombstones: 1,
        idempotencyReceipts: 1,
      });
      await expect(store.get("consult_request", request.request_id)).resolves.toBeNull();
    },
  );
});
