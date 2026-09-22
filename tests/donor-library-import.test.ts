import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildDonorLibraryImport, REVIEW_DIMENSIONS } from "../scripts/corpus/donor-library-import-lib.mjs";
import { readSnapshotFile } from "../scripts/corpus/donor-snapshot-lib.mjs";

const root = path.resolve(import.meta.dirname, "..");
const snapshotRoot = path.resolve(root, "data/source-snapshots/donor-library");

function sha256(pathname: string) {
  return createHash("sha256").update(readFileSync(pathname)).digest("hex").toUpperCase();
}

describe("recovered donor corpus", () => {
  it("accounts for the executable donor registries without relying on TypeScript file counts", () => {
    const manifest = JSON.parse(readFileSync(path.resolve(snapshotRoot, "manifest.json"), "utf8"));
    expect(manifest.counts).toEqual({
      authoredCourses: 45,
      generatedCurriculumCourses: 41,
      totalCourses: 86,
      staffCommunityBriefs: 40,
      unmatchedCommunityGuides: 1,
      religionBriefs: 8,
      domainResources: 34,
      totalGovernedCandidates: 169,
    });
    for (const receipt of manifest.snapshots) {
      const pathname = path.resolve(root, receipt.path);
      expect(readSnapshotFile(pathname)).toHaveLength(receipt.records);
      expect(readFileSync(pathname).byteLength).toBe(receipt.bytes);
      expect(sha256(pathname)).toBe(receipt.sha256);
    }
  });

  it("keeps every complete original beside a plain renderable adaptation", () => {
    const records = [
      ...readSnapshotFile(path.resolve(snapshotRoot, "course-candidates.jsonl")),
      ...readSnapshotFile(path.resolve(snapshotRoot, "community-candidates.jsonl")),
      ...readSnapshotFile(path.resolve(snapshotRoot, "domain-candidates.jsonl")),
    ];
    expect(records).toHaveLength(169);
    expect(new Set(records.map((record) => record.contentItemId)).size).toBe(169);
    expect(records.every((record) => record.richOriginal && Object.keys(record.richOriginal).length > 0)).toBe(true);
    expect(records.every((record) => record.renderable?.presentation === "plain_resource")).toBe(true);
    expect(records.every((record) => Array.isArray(record.renderable?.sections))).toBe(true);
    expect(records.every((record) => record.ownerDirection?.ingestionApproval === "owner_approved_for_ingestion")).toBe(true);
    expect(records.every((record) => record.ownerDirection?.publicationAuthorization === "none")).toBe(true);
    expect(records.filter((record) => record.sourceClass === "authored" && record.contentKind === "course")).toHaveLength(45);
    expect(records.filter((record) => record.sourceClass === "generated_curriculum")).toHaveLength(41);
    expect(records.filter((record) => record.assetKind === "community_brief")).toHaveLength(40);
    expect(records.filter((record) => record.assetKind === "community_brief_unmatched_guide")).toHaveLength(1);
    expect(records.filter((record) => record.assetKind === "religion_brief")).toHaveLength(8);
    expect(records.filter((record) => record.assetKind === "domain_resource")).toHaveLength(34);
  });

  it("builds an idempotent owner-only candidate stage with all reviews pending and no publication", () => {
    const first = buildDonorLibraryImport();
    const second = buildDonorLibraryImport();
    expect(first.manifest.stageSetSha256).toBe(second.manifest.stageSetSha256);
    expect(first.manifest.files).toEqual(second.manifest.files);
    expect(first.manifest.counts).toMatchObject({
      donorCandidates: 169,
      courses: 86,
      authoredCourses: 45,
      generatedCurriculumCourses: 41,
      communityAndReligionBriefs: 49,
      domainResources: 34,
      sourceReviewRecords: 169 * REVIEW_DIMENSIONS.length,
      contentReviewRecords: 169 * REVIEW_DIMENSIONS.length,
      permanentSeedsPreservedSeparately: 25,
      canonicalBaselinesPreservedSeparately: 73,
      staffPublicationDecisions: 0,
    });
    expect(first.records.sourceItems.every((row) => row.access_scope === "consultant")).toBe(true);
    expect(first.records.contentItems.every((row) => row.restricted === true)).toBe(true);
    expect(first.records.sourceReviews.every((row) => row.status === "pending")).toBe(true);
    expect(first.records.contentReviews.every((row) => row.status === "pending")).toBe(true);
    expect(first.records.publications).toEqual([]);
    expect(first.files.get("publication_decisions.jsonl")).toEqual([]);
  });
});
