import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { localCatalogIt, requireLocalCatalog } from "./helpers/local-corpus-fixtures";

const root = path.resolve(import.meta.dirname, "..");
const testRoot = path.resolve(root, ".pac-import-staging/vitest-shadow-import");
const firstStage = path.resolve(testRoot, "first");
const secondStage = path.resolve(testRoot, "second");

function runJson(script: string, args: string[]) {
  const output = execFileSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  return JSON.parse(output);
}

afterAll(() => {
  rmSync(testRoot, { recursive: true, force: true });
});

describe("portable PAC shadow import", () => {
  localCatalogIt("accounts for every required layer without publishing held content", () => {
    requireLocalCatalog();
    const result = runJson("scripts/corpus/build-shadow-import.mjs", ["--check"]);
    expect(result.ok).toBe(true);
    expect(result.counts).toMatchObject({
      catalogSourceItems: 578,
      legacyBuiltInSourceItems: 5,
      ownerLedgerSourceItems: 47,
      sourceItemsTotal: 630,
      snapshotsRegistered: 34,
      driveSnapshotsRegistered: 12,
      localSnapshotsRegistered: 22,
      missingOriginals: 3,
      permanentSeedItems: 25,
      stagedMembershipDecisions: 25,
      staffPublicationDecisions: 0,
    });
    expect(result.heldFromStaffRelease.manualExtractionSourceIds).toEqual([
      "drive-intergenerational-handout",
    ]);
    expect(result.heldFromStaffRelease.transcriptRequiredSourceIds).toEqual([
      "local-racism-in-america-audio",
    ]);
    expect(result.heldFromStaffRelease.quarantinedNeverExecuteSourceIds).toEqual([
      "local-race-racism-minnesota-course",
    ]);
  }, 30_000);

  localCatalogIt("writes a deterministic, self-validating JSONL stage", () => {
    requireLocalCatalog();
    runJson("scripts/corpus/build-shadow-import.mjs", ["--write", "--out", firstStage]);
    runJson("scripts/corpus/build-shadow-import.mjs", ["--write", "--out", secondStage]);
    const first = JSON.parse(readFileSync(path.resolve(firstStage, "manifest.json"), "utf8"));
    const second = JSON.parse(readFileSync(path.resolve(secondStage, "manifest.json"), "utf8"));
    expect(first.stageSetSha256).toBe(second.stageSetSha256);
    expect(first.files).toEqual(second.files);
    expect(first.publicationDecisionRows).toBe(0);

    const validation = runJson("scripts/corpus/load-shadow-import.mjs", ["--stage", firstStage]);
    expect(validation).toMatchObject({
      ok: true,
      mode: "validated_only",
      databaseChanged: false,
      staffPublicationDecisions: 0,
    });
  }, 30_000);

  it("keeps the private schema unavailable to Supabase browser roles", () => {
    const migration = readFileSync(
      path.resolve(root, "db/migrations/0001_pac_content_foundation.sql"),
      "utf8",
    );
    expect(migration).toContain("enable row level security");
    expect(migration).toContain("revoke all privileges on schema pac from public");
    expect(migration).toContain("array['anon', 'authenticated']");
    expect(migration).toContain("with (security_invoker = true)");
    expect(migration).not.toMatch(/grant\s+.+\s+to\s+(anon|authenticated)/i);
  });

  it("implements same-ID/different-content as a hard conflict", () => {
    const loader = readFileSync(
      path.resolve(root, "scripts/corpus/load-shadow-import.mjs"),
      "utf8",
    );
    expect(loader).toContain("class HardConflict extends Error");
    expect(loader).toContain("the same source ID or business version has different content");
    expect(loader).toContain("the same revision ID or number has different content");
    expect(loader).toContain("action, detail");
  });
});
