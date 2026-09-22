import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAskResponseRecord, FileAskRecordsStore, MemoryAskRecordsStore,
  getAskRecordsStore, listAskResponseRecords, deleteAskResponseRecords,
  saveAskResponseRecord, askRecordingHealth, validateAskRecord,
} from "@/lib/intelligence/observability/ask-records";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { runCycle } from "@/lib/intelligence/agents/cycle";
import { setPolicy } from "@/lib/intelligence/policy";

const answer = {
  kind: "answer" as const,
  answer: { shortAnswer: "Complete answer. ".repeat(500), whyItMatters: "", sources: [],
    limits: [], nextActions: [{ label: "Learning", href: "/learn" }] },
};
function record(question = "Explain accessible meeting design.", now = new Date()) {
  return createAskResponseRecord({
    traceId: randomUUID(), programScope: "one-dhs", researchMode: "program_only",
    status: "answered", httpStatus: 200, question, response: answer, researchStatus: "not_requested",
  }, now);
}
beforeEach(() => { resetStoreForTests(); delete process.env.PAC_ASK_RECORD_RETENTION_DAYS; });
afterEach(() => { vi.restoreAllMocks(); delete process.env.PAC_ASK_RECORD_RETENTION_DAYS; });

describe("dedicated owner ASK response records", () => {
  it("preserves the complete response without adding tracking fields", async () => {
    const saved = record();
    await getAskRecordsStore().append(saved);
    const result = await listAskResponseRecords();
    expect(result.records).toEqual([saved]);
    expect(result.records[0].response).toEqual(answer);
    expect(result.recording).toMatchObject({ backend: "memory", durable: false, retentionDays: null });
    expect(saved.expiresAt).toBeNull();
    expect(() => validateAskRecord({ ...saved, userId: "unwanted" })).toThrow();
    expect(() => validateAskRecord({ ...saved, response: { ...answer, ip: "127.0.0.1" } })).toThrow();
    expect(JSON.stringify(saved)).not.toMatch(/sessionId|userId|userAgent|ipAddress|cookie/);
  });
  it("omits private question content but retains the safe response", () => {
    const saved = record("My SSN is 123-45-6789. Help me.");
    expect(saved.question).toBeNull();
    expect(saved.questionOmittedReason).toBe("private_information");
    expect(JSON.stringify(saved)).not.toContain("123-45-6789");
    expect(saved.response).toEqual(answer);
    expect(record("What is confidential information?").question).toBe("What is confidential information?");
  });
  it("pages without duplicates when timestamps match and supports owner deletion", async () => {
    const records = Array.from({ length: 3 }, () => record("Explain the method.", new Date("2026-09-07T10:00:00.000Z")));
    await Promise.all(records.map(value => getAskRecordsStore().append(value)));
    const page1 = await listAskResponseRecords({ limit: 2 });
    const page2 = await listAskResponseRecords({ limit: 2, before: page1.nextCursor! });
    expect(new Set([...page1.records, ...page2.records].map(value => value.id)).size).toBe(3);
    expect(page2.nextCursor).toBeNull();
    expect(await deleteAskResponseRecords([records[0].id])).toBe(1);
    expect((await listAskResponseRecords()).records).toHaveLength(2);
    await expect(listAskResponseRecords({ before: "not-a-cursor" })).rejects.toThrow();
  });
  it("applies explicitly configured retention only to new records and cleans up during a killed scheduled cycle", async () => {
    const permanent = record("Permanent example.", new Date(Date.now() - 10 * 86_400_000));
    process.env.PAC_ASK_RECORD_RETENTION_DAYS = "2";
    const expired = record("Expired example.", new Date(Date.now() - 3 * 86_400_000));
    const current = record();
    expect(permanent.expiresAt).toBeNull();
    expect(Date.parse(current.expiresAt!) - Date.parse(current.createdAt)).toBe(2 * 86_400_000);
    await Promise.all([permanent, expired, current].map(value => getAskRecordsStore().append(value)));
    await setPolicy({ killed: true });
    const report = await runCycle("cron");
    expect(report.steps.find(step => step.name === "purge expired ASK response records")).toMatchObject({ outcome: "done", detail: "1 expired ASK response records removed" });
    expect(await getAskRecordsStore().list(10, null, "2000-01-01T00:00:00.000Z")).toHaveLength(2);
  });
  it("rejects invalid retention without silently claiming a saved record", async () => {
    process.env.PAC_ASK_RECORD_RETENTION_DAYS = "-1";
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await saveAskResponseRecord({
      traceId: randomUUID(), programScope: "dsd", researchMode: "auto", status: "failed",
      httpStatus: 503, question: "Help me.", response: { error: "Answer unavailable." }, researchStatus: "failed",
    })).toBe(false);
    expect(warn.mock.calls[0][0]).toContain("record_write_failed");
    expect(warn.mock.calls[0][0]).not.toContain("Help me.");
    delete process.env.PAC_ASK_RECORD_RETENTION_DAYS;
    expect(askRecordingHealth().lastWriteFailure).toMatchObject({ code: "record_write_failed" });
  });
  it("does not expose malformed trace input in a recording failure log", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await saveAskResponseRecord({
      traceId: "secret-instead-of-opaque-trace", programScope: "dsd", researchMode: "auto",
      status: "failed", httpStatus: 503, question: "Help me.", response: { error: "Unavailable." },
      researchStatus: "failed",
    })).toBe(false);
    expect(warn.mock.calls[0][0]).not.toContain("secret-instead-of-opaque-trace");
    expect(JSON.parse(warn.mock.calls[0][0])).toMatchObject({ event: "ask_record_write_failed", code: "record_write_failed" });
  });
  it("keeps durable local files immutable and readable after a fresh store instance", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "pac-ask-records-test-"));
    try {
      const first = new FileAskRecordsStore(directory);
      const saved = record();
      await Promise.all([first.append(saved), first.append(saved)]);
      const restarted = new FileAskRecordsStore(directory);
      expect(await restarted.list(10, null, new Date().toISOString())).toEqual([saved]);
      await expect(restarted.append({ ...saved, question: "Changed question." })).rejects.toThrow("immutable");
      expect(await restarted.delete([saved.id])).toBe(1);
      expect(await restarted.list(10, null, new Date().toISOString())).toEqual([]);
    } finally {
      if (path.dirname(path.resolve(directory)) !== path.resolve(tmpdir()) || !path.basename(directory).startsWith("pac-ask-records-test-")) throw new Error("Unsafe test cleanup target.");
      await rm(directory, { recursive: true, force: true });
    }
  });
  it("rejects excessive full responses instead of truncating them", async () => {
    const store = new MemoryAskRecordsStore();
    const saved = record();
    await expect(store.append({ ...saved, response: { error: "x".repeat(1_048_577) } })).rejects.toThrow("storage limit");
    expect(await store.list(10, null, new Date().toISOString())).toEqual([]);
  });
});
