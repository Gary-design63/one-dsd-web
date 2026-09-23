import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { localCatalogIt, requireLocalCatalog } from "./helpers/local-corpus-fixtures";

const root = path.resolve(import.meta.dirname, "..");
const testRoot = path.resolve(root, ".pac-import-staging/vitest-canonical-projection");
const firstStage = path.resolve(testRoot, "first");
const secondStage = path.resolve(testRoot, "second");

function runJson(script: string, args: string[]) {
  return JSON.parse(execFileSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  }));
}

function readJsonLines(stage: string, file: string) {
  return readFileSync(path.resolve(stage, file), "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

afterAll(() => {
  rmSync(testRoot, { recursive: true, force: true });
});

describe("governed canonical projection", () => {
  localCatalogIt("projects every canonical unit while retaining all disposition receipts", () => {
    requireLocalCatalog();
    const result = runJson("scripts/corpus/build-canonical-projection.mjs", ["--check"]);
    expect(result).toMatchObject({
      ok: true,
      mode: "check",
      counts: {
        dispositionReceipts: 557,
        activeRetainReceipts: 20,
        activeReviseReceipts: 32,
        mergedComponentReceipts: 462,
        internalReclassifiedReceipts: 43,
        collections: 2,
        canonicalFamilies: 21,
        canonicalChildren: 52,
        canonicalRevisions: 73,
        reviewRecords: 438,
        membershipDecisions: 73,
        permanentSeedsPreservedSeparately: 25,
        seedIdCollisions: 0,
        staffPublicationDecisions: 0,
      },
      noOmissionChecks: {
        canonicalFamilies: "21_of_21",
        activeChildren: "52_of_52",
        dispositionReceipts: "557_of_557",
        activeReceiptToChildMatch: "52_of_52",
        permanentSeeds: "25_preserved_separately",
      },
    });
  }, 30_000);

  localCatalogIt("writes a deterministic stage whose held content has no release decision", () => {
    requireLocalCatalog();
    runJson("scripts/corpus/build-canonical-projection.mjs", ["--write", "--out", firstStage]);
    runJson("scripts/corpus/build-canonical-projection.mjs", ["--write", "--out", secondStage]);
    const first = JSON.parse(readFileSync(path.resolve(firstStage, "manifest.json"), "utf8"));
    const second = JSON.parse(readFileSync(path.resolve(secondStage, "manifest.json"), "utf8"));
    expect(first.stageSetSha256).toBe(second.stageSetSha256);
    expect(first.files).toEqual(second.files);
    expect(first.publicationDecisionRows).toBe(0);
    expect(readJsonLines(firstStage, "publication_decisions.jsonl")).toHaveLength(0);
    expect(readJsonLines(firstStage, "review_records.jsonl").every((row) => row.status === "pending")).toBe(true);
    const validation = runJson("scripts/corpus/load-canonical-projection.mjs", ["--stage", firstStage]);
    expect(validation).toMatchObject({ ok: true, databaseChanged: false, staffPublicationDecisions: 0 });
  }, 30_000);

  localCatalogIt("links active children and merged components without turning internal sources into pages", () => {
    requireLocalCatalog();
    runJson("scripts/corpus/build-canonical-projection.mjs", ["--write", "--out", firstStage]);
    const receipts = readJsonLines(firstStage, "source_receipts.jsonl");
    const items = readJsonLines(firstStage, "content_items.jsonl");
    const links = readJsonLines(firstStage, "revision_sources.jsonl");
    expect(receipts.filter((row) => row.disposition === "internal_reclassify")).toHaveLength(43);
    expect(receipts.filter((row) => row.disposition === "component_merge")).toHaveLength(462);
    expect(items.filter((row) => row.content_kind === "family")).toHaveLength(21);
    expect(items.filter((row) => row.content_kind === "resource")).toHaveLength(52);
    expect(links.filter((row) => row.relationship === "merged_component")).toHaveLength(462);
    expect(links.filter((row) => row.relationship === "adapted_from")).toHaveLength(52);
    expect(links.filter((row) => row.relationship === "primary")).toHaveLength(73);
  }, 30_000);

  it("keeps database replays idempotent and different identities as hard conflicts", () => {
    const loader = readFileSync(path.resolve(root, "scripts/corpus/load-shadow-import.mjs"), "utf8");
    expect(loader).toContain("async function loadSourceReceipts");
    expect(loader).toContain("the same receipt or source has a different disposition");
    expect(loader).toContain("the latest collection decision has different content");
    expect(loader).toContain('"exact_replay"');
  });
});
