import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CORPUS } from "@/lib/content/corpus";
import seedManifest from "@/data/source-ledger/current-seed-2026-09-04.json";

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .filter((key) => record[key] !== undefined)
        .map((key) => [key, canonicalize(record[key])]),
    );
  }
  return value;
}

function canonicalSha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex").toUpperCase();
}

describe("permanent seed collection", () => {
  it("retains every original stable ID in the active corpus", () => {
    const currentIds = new Set(CORPUS.map((item) => item.id));
    expect(seedManifest.items).toHaveLength(25);
    expect(new Set(seedManifest.items.map((item) => item.id)).size).toBe(25);
    for (const item of seedManifest.items) expect(currentIds.has(item.id)).toBe(true);
  });

  it("preserves the complete revision-one payload for each seed", () => {
    for (const item of seedManifest.items) {
      expect(canonicalSha256(item.payload), item.id).toBe(item.payloadSha256);
    }
  });
});
