import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

import {
  HardConflict,
  IMPORT_SPECS,
  processImportBatch,
  queryCountComparison,
  readJsonLineBatches,
  validateJsonLinesFile,
} from "../scripts/corpus/batched-import-lib.mjs";
import { interruptedRunResolution } from "../scripts/corpus/load-shadow-import-v2.mjs";
import { localFrozenStagesIt, requireLocalFrozenStages } from "./helpers/local-corpus-fixtures";

const root = path.resolve(import.meta.dirname, "..");
const testRoot = path.resolve(root, ".pac-import-staging/vitest-batched-import");

afterAll(() => {
  rmSync(testRoot, { recursive: true, force: true });
});

function contentItem(index: number) {
  return {
    content_item_id: `synthetic-${index}`,
    content_kind: "resource",
    default_scope_id: "dsd",
    staff_label: `Synthetic resource ${index}`,
    restricted: false,
    created_at: "2026-09-05T00:00:00.000Z",
    created_by: "performance_test",
    retired_at: null,
    retired_by: null,
  };
}

describe("bounded corpus importer", () => {
  it("streams a 50,000-row stage in bounded batches and cuts the query envelope by more than 99%", async () => {
    mkdirSync(testRoot, { recursive: true });
    const file = path.resolve(testRoot, "synthetic-content-items.jsonl");
    const rows = Array.from({ length: 50_000 }, (_, index) => JSON.stringify(contentItem(index))).join("\n") + "\n";
    writeFileSync(file, rows, "utf8");

    let total = 0;
    let batches = 0;
    let largestBatch = 0;
    for await (const batch of readJsonLineBatches(file, { maxRows: 500, maxBytes: 8 * 1024 * 1024 })) {
      total += batch.rows.length;
      batches += 1;
      largestBatch = Math.max(largestBatch, batch.rows.length);
    }

    expect(total).toBe(50_000);
    expect(batches).toBe(100);
    expect(largestBatch).toBe(500);
    const comparison = queryCountComparison(total, batches);
    expect(comparison.legacyMinimum).toBe(100_007);
    expect(comparison.batchedMaximum).toBe(307);
    expect(comparison.reductionVersusLegacyMinimum).toBeGreaterThan(0.99);
  }, 30_000);

  it("keeps byte-bounded batches small when individual records are large", async () => {
    mkdirSync(testRoot, { recursive: true });
    const file = path.resolve(testRoot, "large-lines.jsonl");
    const rows = Array.from({ length: 20 }, (_, index) => ({
      index, body: "x".repeat(40_000) + "\u2028" + "y".repeat(40_000),
    }));
    const body = rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
    writeFileSync(file, body, "utf8");

    let total = 0;
    for await (const batch of readJsonLineBatches(file, { maxRows: 500, maxBytes: 256 * 1024 })) {
      total += batch.rows.length;
      expect(batch.bytes).toBeLessThanOrEqual(256 * 1024);
      expect(batch.rows.length).toBeLessThanOrEqual(3);
    }
    expect(total).toBe(20);
  });

  it("validates the original bytes, record count, and hash without a whole-file read", async () => {
    mkdirSync(testRoot, { recursive: true });
    const file = path.resolve(testRoot, "validated.jsonl");
    const body = `${JSON.stringify({ id: 1 })}\n${JSON.stringify({ id: 2 })}\n`;
    writeFileSync(file, body, "utf8");
    const receipt = {
      name: "validated.jsonl",
      records: 2,
      bytes: Buffer.byteLength(body),
      sha256: createHash("sha256").update(body).digest("hex").toUpperCase(),
    };
    await expect(validateJsonLinesFile(file, receipt)).resolves.toEqual({
      records: receipt.records,
      bytes: receipt.bytes,
      sha256: receipt.sha256,
    });
  });

  it("uses one lookup, one set insert, and one receipt write for a new batch", async () => {
    const spec = IMPORT_SPECS.find((entry) => entry.fileName === "content_items.jsonl");
    expect(spec).toBeDefined();
    const rows = Array.from({ length: 500 }, (_, index) => contentItem(index));
    const calls: string[] = [];
    const tx = {
      unsafe: async (sql: string, parameters: unknown[]) => {
        calls.push(sql);
        if (calls.length === 1) return [];
        return { count: (parameters[0] as unknown[]).length };
      },
    };
    const counts = { inserted: 0, exactReplay: 0, stageRows: rows.length };
    const metrics = { batches: 0, queryCount: 0, maxBatchRows: 0, maxBatchBytes: 0 };
    await processImportBatch({
      tx,
      runId: "00000000-0000-0000-0000-000000000001",
      spec,
      rows,
      counts,
      metrics,
      seenIdentities: new Map(),
    });
    expect(calls).toHaveLength(3);
    expect(metrics.queryCount).toBe(3);
    expect(counts).toMatchObject({ inserted: 500, exactReplay: 0 });
  });

  it("stops a mismatched existing identity before any insert or receipt write", async () => {
    const spec = IMPORT_SPECS.find((entry) => entry.fileName === "content_items.jsonl");
    const staged = contentItem(1);
    const tx = {
      unsafe: async () => [{ ...staged, staff_label: "Different immutable identity" }],
    };
    await expect(processImportBatch({
      tx,
      runId: "00000000-0000-0000-0000-000000000001",
      spec,
      rows: [staged],
      counts: { inserted: 0, exactReplay: 0, stageRows: 1 },
      metrics: { batches: 0, queryCount: 0, maxBatchRows: 0, maxBatchBytes: 0 },
      seenIdentities: new Map(),
    })).rejects.toBeInstanceOf(HardConflict);
  });

  it("recovers only a complete interrupted receipt set and fails partial or conflicted runs", () => {
    expect(interruptedRunResolution({ inserted: 700, linked: 100, exact_replay: 200 }, 1000)).toEqual({
      action: "recover",
      receiptCount: 1000,
      counts: { inserted: 800, exactReplay: 200, stageRows: 1000 },
    });
    expect(interruptedRunResolution({ inserted: 999 }, 1000).action).toBe("fail_and_retry");
    expect(interruptedRunResolution({ inserted: 999, conflict: 1 }, 1000).action).toBe("fail_and_retry");
  });

  localFrozenStagesIt("validates both frozen v1 stages without changing their hashes", () => {
    requireLocalFrozenStages();
    for (const stage of [
      ".pac-import-staging/pac-corpus-import-2026-09-04",
      ".pac-import-staging/pac-canonical-projection-2026-09-05",
    ]) {
      const result = JSON.parse(execFileSync(process.execPath, [
        "scripts/corpus/load-shadow-import-v2.mjs", "--stage", stage,
      ], { cwd: root, encoding: "utf8" }));
      expect(result).toMatchObject({
        ok: true,
        databaseChanged: false,
        staffPublicationDecisions: 0,
      });
      expect(result.importerVersion).toContain("v2-batched");
    }
  }, 30_000);
});
