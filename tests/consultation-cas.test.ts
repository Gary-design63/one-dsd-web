import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createFileStoreForTests,
  resetStoreForTests,
  type ConsultationMutationKind,
  type Store,
} from "@/lib/intelligence/memory/store";
import {
  buildTestConsultationRecord,
  buildTestConsultationTombstone,
  withConsultationStatus,
} from "@/tests/helpers/consultation-record";
import type { ConsultRequest } from "@/lib/intelligence/consult/schema";

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

const temporaryRoots: string[] = [];
let consultationSequence = 9100;

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    if (
      path.dirname(root) === path.resolve(tmpdir())
      && path.basename(root).startsWith("pac-consultation-cas-")
    ) {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

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

async function seed(store: Store, record: TestConsultation) {
  await store.put("consult_request", record.request_id, record);
}

describe("consultation compare-and-swap boundary", () => {
  it("allows only one concurrent requester correction or withdrawal", async () => {
    const store = resetStoreForTests();
    const now = new Date().toISOString();
    const record = fullRecord("CR-correction-withdrawal", "2099-01-01T00:00:00.000Z");
    await seed(store, record);

    const correction = {
      ...record,
      situation: "Corrected S3 consultation material with enough context for the protected test record.",
      updated_at: now,
      version: 2,
      correction_history: [{ at: now, fields: ["situation"], by: "requester" }],
    };
    const withdrawal = withConsultationStatus(
      record as unknown as ConsultRequest,
      "withdrawn",
      now,
      "requester",
    ) as unknown as TestConsultation;
    const [corrected, withdrawn] = await Promise.all([
      store.compareAndSwapConsultation(record.request_id, expectation(record, now, "requester_correction"), correction),
      store.compareAndSwapConsultation(record.request_id, expectation(record, now, "requester_withdrawal"), withdrawal),
    ]);

    expect([corrected.applied, withdrawn.applied].filter(Boolean)).toHaveLength(1);
    expect([corrected, withdrawn].find((result) => !result.applied)).toMatchObject({
      applied: false,
      reason: "conflict",
    });
    const stored = await store.get<TestConsultation>("consult_request", record.request_id);
    expect(stored?.version).toBe(2);
    expect(stored).toEqual(corrected.applied ? correction : withdrawal);
  });

  it("retries expiry against the latest version and never resurrects full S3", async () => {
    const store = resetStoreForTests();
    const beforeExpiry = new Date().toISOString();
    const expiry = new Date(Date.now() + 30_000).toISOString();
    const afterExpiry = new Date(Date.now() + 60_000).toISOString();
    const record = fullRecord("CR-update-expiry", expiry);
    await seed(store, record);

    const correction = {
      ...record,
      situation: "A corrected S3 situation committed immediately before expiry for the atomic test.",
      updated_at: beforeExpiry,
      version: 2,
      correction_history: [{ at: beforeExpiry, fields: ["situation"], by: "requester" }],
    };
    const firstTombstone = tombstone(record, afterExpiry);
    const [corrected, redacted] = await Promise.all([
      store.compareAndSwapConsultation(record.request_id, expectation(record, beforeExpiry, "requester_correction"), correction),
      store.compareAndSwapConsultation(record.request_id, expectation(record, afterExpiry, "expiry_tombstone"), firstTombstone),
    ]);
    expect(corrected.applied).toBe(true);
    expect(redacted).toMatchObject({ applied: false, reason: "conflict" });
    if (redacted.applied || !redacted.current) throw new Error("Expected the latest full record after the race.");

    const latest = redacted.current;
    const retriedTombstone = tombstone(latest, afterExpiry);
    const retry = await store.compareAndSwapConsultation(
      record.request_id,
      expectation(latest, afterExpiry, "expiry_tombstone"),
      retriedTombstone,
    );
    expect(retry).toEqual({ applied: true, value: retriedTombstone });

    const staleFullWrite = await store.compareAndSwapConsultation(
      record.request_id,
      expectation(record, beforeExpiry, "requester_correction"),
      correction,
    );
    expect(staleFullWrite).toMatchObject({ applied: false, reason: "tombstone" });
    const stored = await store.get<TestConsultation>("consult_request", record.request_id);
    expect(stored).toEqual(retriedTombstone);
    expect(stored).not.toHaveProperty("situation");
    expect(Object.keys(stored ?? {}).sort()).toEqual([
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
  });

  it("rotates only the credential hash and rejects a disguised content update", async () => {
    const store = resetStoreForTests();
    const record = fullRecord("CR-credential-rotation", "2099-01-01T00:00:00.000Z");
    await seed(store, record);
    const at = new Date().toISOString();
    const rotated = {
      ...record,
      access_key_hash: "c".repeat(64),
      updated_at: at,
      version: record.version + 1,
    };
    await expect(store.compareAndSwapConsultation(
      record.request_id,
      expectation(record, at, "credential_rotation"),
      rotated,
    )).resolves.toEqual({ applied: true, value: rotated });

    const disguised = {
      ...rotated,
      access_key_hash: "d".repeat(64),
      situation: "A changed consultation situation must not ride along with a credential replacement.",
      updated_at: new Date(Date.parse(at) + 1).toISOString(),
      version: rotated.version + 1,
    };
    await expect(store.compareAndSwapConsultation(
      record.request_id,
      expectation(rotated, disguised.updated_at, "credential_rotation"),
      disguised,
    )).resolves.toMatchObject({ applied: false, reason: "conflict" });
    await expect(store.get("consult_request", record.request_id)).resolves.toEqual(rotated);
  });

  it("rejects provenance and plausible-history rewrites under narrower mutation authority", async () => {
    const store = resetStoreForTests();
    const record = fullRecord("CR-authority-guard", "2099-01-01T00:00:00.000Z");
    await seed(store, record);
    const at = new Date().toISOString();

    const provenanceRewrite = {
      ...record,
      submission_fingerprint: "c".repeat(64),
      updated_at: at,
      version: record.version + 1,
      correction_history: [{ at, fields: ["work_name"], by: "requester" }],
    };
    await expect(store.compareAndSwapConsultation(
      record.request_id,
      expectation(record, at, "requester_correction"),
      provenanceRewrite,
    )).resolves.toMatchObject({ applied: false, reason: "conflict" });

    const historyRewrite = {
      ...record,
      owner_notes: "General consultation planning note",
      updated_at: at,
      version: record.version + 1,
      history: [{ ...((record.history as Record<string, unknown>[])[0]), note: "Rewritten provenance." }],
    };
    await expect(store.compareAndSwapConsultation(
      record.request_id,
      expectation(record, at, "owner_update"),
      historyRewrite,
    )).resolves.toMatchObject({ applied: false, reason: "conflict" });
    await expect(store.get("consult_request", record.request_id)).resolves.toEqual(record);
  });

  it("allows direct creation only at the version-one pending intake state", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "pac-consultation-cas-"));
    temporaryRoots.push(root);
    const stores = [resetStoreForTests(), createFileStoreForTests(root)];

    for (const store of stores) {
      const record = fullRecord("CR-initial-only", "2099-01-01T00:00:00.000Z");
      const at = new Date(Date.parse(String(record.updated_at)) + 1_000).toISOString();
      const received = withConsultationStatus(
        record as unknown as ConsultRequest,
        "received",
        at,
        "owner",
      ) as unknown as TestConsultation;
      await expect(store.put("consult_request", received.request_id, received))
        .rejects.toThrow(/approved intake state/i);
      await expect(store.get("consult_request", received.request_id)).resolves.toBeNull();
      await expect(store.put("consult_request", record.request_id, record))
        .resolves.toMatchObject({ applied: true });
    }
  });

  it("atomically redacts a full S3 record with an invalid expiry", async () => {
    const store = resetStoreForTests();
    const guardAt = new Date().toISOString();
    const record = fullRecord("CR-invalid-expiry", "2099-01-01T00:00:00.000Z");
    await seed(store, record);
    // Simulate legacy corruption beneath the normal write contract.
    record.retention_expires_at = "not-a-retention-date";
    const replacement = tombstone(record, guardAt, guardAt);

    const result = await store.compareAndSwapConsultation(
      record.request_id,
      expectation(record, guardAt, "invalid_expiry_tombstone"),
      replacement,
    );

    expect(result).toEqual({ applied: true, value: replacement });
    expect(await store.get("consult_request", record.request_id)).toEqual(replacement);
    expect(replacement).not.toHaveProperty("private_text");
  });

  it("rejects caller-selected redaction times outside bounded server clock skew", async () => {
    const store = resetStoreForTests();
    const now = Date.now();

    const oldExpiry = new Date(now - 86_400_000).toISOString();
    const oldRecord = fullRecord("CR-old-clock", oldExpiry);
    await seed(store, oldRecord);
    const backdatedGuard = new Date(now - 60 * 60 * 1000).toISOString();
    await expect(store.compareAndSwapConsultation(
      oldRecord.request_id,
      expectation(oldRecord, backdatedGuard, "expiry_tombstone"),
      tombstone(oldRecord, backdatedGuard),
    )).resolves.toMatchObject({ applied: false, reason: "conflict" });

    const futureExpiry = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const futureRecord = fullRecord("CR-future-clock", futureExpiry);
    await seed(store, futureRecord);
    const futureGuard = new Date(now + 24 * 60 * 60 * 1000 + 1_000).toISOString();
    await expect(store.compareAndSwapConsultation(
      futureRecord.request_id,
      expectation(futureRecord, futureGuard, "expiry_tombstone"),
      tombstone(futureRecord, futureGuard),
    )).resolves.toMatchObject({ applied: false, reason: "conflict" });
  });

  it("rejects tombstones that retain extra S3 fields", async () => {
    const store = resetStoreForTests();
    const expiry = new Date(Date.now() - 60_000).toISOString();
    const guardAt = new Date().toISOString();
    const record = fullRecord("CR-invalid-tombstone", expiry);
    await seed(store, record);

    await expect(store.compareAndSwapConsultation(
      record.request_id,
      expectation(record, guardAt, "expiry_tombstone"),
      { ...tombstone(record, guardAt), situation: record.situation },
    )).rejects.toThrow(/approved (?:consultation tombstone|persistence contract)/i);
  });

  it("prevents direct put from resurrecting a tombstone in memory and file stores", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "pac-consultation-cas-"));
    temporaryRoots.push(root);
    const stores = [resetStoreForTests(), createFileStoreForTests(root)];

    for (const [index, store] of stores.entries()) {
      const guardAt = new Date().toISOString();
      const record = fullRecord(`CR-no-resurrection-${index}`, "2020-01-01T00:00:00.000Z");
      await seed(store, record);
      const redacted = tombstone(record, guardAt);
      await expect(store.compareAndSwapConsultation(
        record.request_id,
        expectation(record, guardAt, "expiry_tombstone"),
        redacted,
      )).resolves.toEqual({ applied: true, value: redacted });

      await expect(store.put("consult_request", record.request_id, record))
        .rejects.toThrow(/only through compare-and-swap/i);
      await expect(store.get("consult_request", record.request_id)).resolves.toEqual(redacted);
    }
  });

  it("returns only ENOENT as absent in the file store", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "pac-consultation-cas-"));
    temporaryRoots.push(root);
    const store = createFileStoreForTests(root);
    expect(await store.get("consult_request", "missing")).toBeNull();
    expect(await store.list("consult_request")).toEqual([]);

    const directory = path.join(root, "consult_request");
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, "corrupt.json"), "{not-json", "utf8");
    await expect(store.get("consult_request", "corrupt")).rejects.toBeInstanceOf(SyntaxError);
    await expect(store.list("consult_request")).rejects.toBeInstanceOf(SyntaxError);
  });

  it("fails closed on corrupt local audit and counter files", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "pac-consultation-cas-"));
    temporaryRoots.push(root);
    const store = createFileStoreForTests(root);

    expect(await store.listAudit()).toEqual([]);
    expect(await store.counter("consult")).toBe(1);

    writeFileSync(path.join(root, "audit.jsonl"), "{not-json\n", "utf8");
    writeFileSync(path.join(root, "counters.json"), "{not-json", "utf8");
    await expect(store.listAudit()).rejects.toBeInstanceOf(SyntaxError);
    await expect(store.counter("consult")).rejects.toBeInstanceOf(SyntaxError);
  });
});
