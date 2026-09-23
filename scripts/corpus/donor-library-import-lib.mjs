import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { relative, resolve, sep } from "node:path";

import {
  canonicalJson,
  canonicalSha256,
  deterministicUuid,
  REPOSITORY_ROOT,
  sha256File,
  sha256Text,
} from "./shadow-import-lib.mjs";
import {
  DONOR_SNAPSHOT_DIRECTORY,
  readSnapshotFile,
  validateSnapshotRecords,
} from "./donor-snapshot-lib.mjs";

export const DEFAULT_DONOR_STAGE_DIRECTORY = resolve(
  REPOSITORY_ROOT,
  ".pac-import-staging/pac-donor-library-2026-09-05",
);

export const DONOR_SNAPSHOT_SPECS = Object.freeze([
  { name: "course-candidates.jsonl", count: 86, collection: "donor-course-candidates-2026-09-05" },
  { name: "community-candidates.jsonl", count: 49, collection: "donor-community-candidates-2026-09-05" },
  { name: "domain-candidates.jsonl", count: 34, collection: "reconstruction-domain-candidates-2026-09-05" },
]);

export const REVIEW_DIMENSIONS = Object.freeze([
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
  "rights_and_consent",
  "community_representation",
  "legal_policy",
]);

const CREATED_AT = "2026-09-05T18:00:00.000Z";
const CREATED_BY = "program_owner_donor_recovery";
const EXPECTED_LOGO_SHA256 = "E9D767446EC871A7FBE829C2A978CF0CB47886AAD31A4FFCFF59A78AE89ADD74";
const STAGE_FILE_ORDER = [
  "source_carriers.jsonl",
  "source_items.jsonl",
  "source_receipts.jsonl",
  "source_review_records.jsonl",
  "content_collections.jsonl",
  "content_items.jsonl",
  "content_revisions.jsonl",
  "revision_sources.jsonl",
  "review_records.jsonl",
  "collection_membership_decisions.jsonl",
  "publication_decisions.jsonl",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readJsonLines(path) {
  return readFileSync(path, "utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse);
}

function unique(records, keyOf, label) {
  const keys = new Set();
  for (const record of records) {
    const key = keyOf(record);
    assert(key && !keys.has(key), `Duplicate ${label} ${key}.`);
    keys.add(key);
  }
  return keys;
}

function contentScope(record) {
  const value = record.renderable?.appliesTo ?? record.richOriginal?.contentItem?.scope;
  if (value === "dsd" || value === "one-dsd-team") return value;
  return "one-dhs";
}

function sourceItemId(record) {
  return `donor:${record.assetKind}:${record.assetId}:${record.donor.commit.slice(0, 12)}`;
}

function receiptId(record) {
  return `donor-recovery:${record.assetKind}:${record.assetId}:${record.donor.commit.slice(0, 12)}`;
}

function revisionPayload(record) {
  return {
    schemaVersion: "1.0.0",
    editorialStatus: "candidate",
    assetKind: record.assetKind,
    sourceClass: record.sourceClass,
    title: record.title,
    donor: record.donor,
    ownerDirection: record.ownerDirection,
    richOriginal: record.richOriginal,
    renderable: record.renderable,
  };
}

function stageFiles(records) {
  return new Map([
    ["source_carriers.jsonl", records.sourceCarriers],
    ["source_items.jsonl", records.sourceItems],
    ["source_receipts.jsonl", records.sourceReceipts],
    ["source_review_records.jsonl", records.sourceReviews],
    ["content_collections.jsonl", records.collections],
    ["content_items.jsonl", records.contentItems],
    ["content_revisions.jsonl", records.contentRevisions],
    ["revision_sources.jsonl", records.revisionSources],
    ["review_records.jsonl", records.contentReviews],
    ["collection_membership_decisions.jsonl", records.memberships],
    ["publication_decisions.jsonl", records.publications],
  ]);
}

function sourceReviewFindings(record) {
  return {
    ownerIngestionApproval: "recorded",
    publicationAuthorization: "none",
    reason: "The owner approved this recovered asset for ingestion. Editorial, accessibility, currentness, representation, rights, scope, placement, and legal-policy review remain pending before release.",
    donorCommit: record.donor.commit,
  };
}

function contentReviewFindings(record) {
  return {
    ownerIngestionApproval: "recorded",
    publicationAuthorization: "none",
    reason: "This candidate preserves the complete recovered source and adds a plain renderable adaptation. Review remains pending before any publication decision.",
    assetKind: record.assetKind,
  };
}

function buildRecords(snapshotGroups) {
  const seedManifest = readJson(resolve(REPOSITORY_ROOT, "data/source-ledger/current-seed-2026-09-04.json"));
  const canonicalBaselines = readJsonLines(resolve(REPOSITORY_ROOT, "data/source-snapshots/canonical-release/canonical-editor-baseline.jsonl"));
  const permanentIds = new Set(seedManifest.items.map((item) => item.id));
  for (const row of canonicalBaselines) permanentIds.add(row.entityId);

  const allSnapshots = snapshotGroups.flatMap((group) =>
    group.records.map((record) => ({ ...record, collectionId: group.spec.collection })),
  ).sort((left, right) => left.contentItemId.localeCompare(right.contentItemId));
  unique(allSnapshots, (record) => `${record.assetKind}:${record.assetId}`, "donor asset");
  const contentIds = unique(allSnapshots, (record) => record.contentItemId, "donor content ID");
  assert(
    [...contentIds].every((id) => !permanentIds.has(id)),
    "A donor candidate would overwrite a permanent seed or canonical resource ID.",
  );

  const collections = DONOR_SNAPSHOT_SPECS.map((spec) => ({
    collection_id: spec.collection,
    name: spec.name === "course-candidates.jsonl"
      ? "Recovered course candidates"
      : spec.name === "community-candidates.jsonl"
        ? "Recovered Minnesota community and religion brief candidates"
        : "Recovered reconstruction domain candidates",
    purpose: "Complete recovered content held for editorial review; membership does not authorize staff publication.",
    preservation_rule: "append_only",
    created_at: CREATED_AT,
    created_by: CREATED_BY,
  }));

  const sourceItems = [];
  const sourceReceipts = [];
  const sourceReviews = [];
  const contentItems = [];
  const contentRevisions = [];
  const revisionSources = [];
  const contentReviews = [];
  const memberships = [];

  for (const record of allSnapshots) {
    const sourceId = sourceItemId(record);
    const normalizedPayload = {
      schemaVersion: record.schemaVersion,
      assetKind: record.assetKind,
      assetId: record.assetId,
      contentItemId: record.contentItemId,
      title: record.title,
      sourceClass: record.sourceClass,
      donor: record.donor,
      ownerDirection: record.ownerDirection,
      richOriginal: record.richOriginal,
    };
    sourceItems.push({
      source_item_id: sourceId,
      source_business_id: `donor:${record.assetKind}:${record.assetId}`,
      carrier_id: null,
      source_version: record.donor.commit,
      source_pointer: `${record.donor.repository}@${record.donor.commit}:${record.donor.entryPaths.join("|")}#${record.assetId}`,
      title: record.title,
      normalized_payload: normalizedPayload,
      normalized_item_sha256: canonicalSha256(normalizedPayload),
      hash_algorithm: "SHA-256",
      hash_algorithm_version: "canonical-json-v1",
      owner_approval_status: "owner_approved_for_ingestion",
      accounting_status: "accounted",
      access_scope: "consultant",
    });

    const decisionPayload = {
      assetKind: record.assetKind,
      sourceClass: record.sourceClass,
      assetId: record.assetId,
      ownerApproval: "approved_for_ingestion",
      disposition: "active_revise",
      pendingReviews: REVIEW_DIMENSIONS,
      publicationAuthorization: "none",
    };
    sourceReceipts.push({
      receipt_id: receiptId(record),
      source_item_id: sourceId,
      disposition: "active_revise",
      canonical_family_id: null,
      canonical_item_id: record.contentItemId,
      decision_payload: decisionPayload,
      decision_sha256: canonicalSha256(decisionPayload),
      decided_at: CREATED_AT,
      decided_by: "program_owner",
      release_commit: record.donor.commit,
      release_manifest_sha256: null,
    });

    for (const dimension of REVIEW_DIMENSIONS) {
      sourceReviews.push({
        source_review_id: deterministicUuid(`donor-source-review:${sourceId}:${dimension}:pending`),
        source_item_id: sourceId,
        dimension,
        status: "pending",
        reviewer_role: "donor_content_review_queue",
        reviewer_id: null,
        findings: sourceReviewFindings(record),
        recorded_at: CREATED_AT,
        supersedes_source_review_id: null,
      });
    }

    contentItems.push({
      content_item_id: record.contentItemId,
      content_kind: record.contentKind,
      default_scope_id: contentScope(record),
      staff_label: record.title,
      restricted: true,
      created_at: CREATED_AT,
      created_by: CREATED_BY,
      retired_at: null,
      retired_by: null,
    });

    const payload = revisionPayload(record);
    const payloadSha256 = canonicalSha256(payload);
    const revisionId = deterministicUuid(`donor-content-revision:${record.contentItemId}:1:${payloadSha256}`);
    contentRevisions.push({
      revision_id: revisionId,
      content_item_id: record.contentItemId,
      revision_number: 1,
      canonical_payload: payload,
      payload_sha256: payloadSha256,
      source_content_sha256: canonicalSha256(record.richOriginal),
      change_summary: "Recovered in full from the pinned donor tree and adapted into a plain candidate resource without authorizing publication.",
      required_review_dimensions: REVIEW_DIMENSIONS,
      created_at: CREATED_AT,
      created_by: CREATED_BY,
      based_on_revision_id: null,
    });
    revisionSources.push({
      revision_id: revisionId,
      source_item_id: sourceId,
      relationship: "adapted_from",
      note: "The complete rich original is retained with this plain renderable candidate.",
    });
    for (const dimension of REVIEW_DIMENSIONS) {
      contentReviews.push({
        review_id: deterministicUuid(`donor-content-review:${revisionId}:${dimension}:pending`),
        revision_id: revisionId,
        dimension,
        status: "pending",
        reviewer_role: "donor_content_review_queue",
        reviewer_id: null,
        findings: contentReviewFindings(record),
        recorded_at: CREATED_AT,
        supersedes_review_id: null,
      });
    }
    memberships.push({
      collection_id: record.collectionId,
      content_item_id: record.contentItemId,
      action: "add",
      decided_at: CREATED_AT,
      decided_by: CREATED_BY,
      reason: "Keep this recovered candidate in the governed editorial inventory while publication review is pending.",
    });
  }

  return {
    sourceCarriers: [],
    sourceItems,
    sourceReceipts,
    sourceReviews,
    collections,
    contentItems,
    contentRevisions,
    revisionSources,
    contentReviews,
    memberships,
    publications: [],
    permanentSeedCount: seedManifest.items.length,
    canonicalBaselineCount: canonicalBaselines.length,
  };
}

function readSnapshotGroups(snapshotDirectory) {
  return DONOR_SNAPSHOT_SPECS.map((spec) => {
    const path = resolve(snapshotDirectory, spec.name);
    assert(existsSync(path), `Donor snapshot is missing: ${spec.name}.`);
    const records = validateSnapshotRecords(readSnapshotFile(path), { count: spec.count });
    return {
      spec,
      records,
      receipt: {
        path: relative(REPOSITORY_ROOT, path).replaceAll("\\", "/"),
        records: records.length,
        bytes: readFileSync(path).byteLength,
        sha256: sha256File(path),
      },
    };
  });
}

export function buildDonorLibraryImport(options = {}) {
  const snapshotDirectory = resolve(options.snapshotDirectory ?? DONOR_SNAPSHOT_DIRECTORY);
  const snapshotGroups = readSnapshotGroups(snapshotDirectory);
  const records = buildRecords(snapshotGroups);
  const files = stageFiles(records);
  const fileReceipts = STAGE_FILE_ORDER.map((name) => {
    const body = files.get(name).map((record) => canonicalJson(record)).join("\n")
      + (files.get(name).length ? "\n" : "");
    return { name, records: files.get(name).length, bytes: Buffer.byteLength(body), sha256: sha256Text(body) };
  });
  const byAssetKind = Object.fromEntries(
    [...new Set(snapshotGroups.flatMap((group) => group.records.map((record) => record.assetKind)))]
      .sort()
      .map((kind) => [kind, snapshotGroups.flatMap((group) => group.records).filter((record) => record.assetKind === kind).length]),
  );
  const counts = {
    donorCandidates: records.contentItems.length,
    courses: records.contentItems.filter((item) => item.content_kind === "course").length,
    authoredCourses: snapshotGroups.flatMap((group) => group.records).filter((record) => record.contentKind === "course" && record.sourceClass === "authored").length,
    generatedCurriculumCourses: snapshotGroups.flatMap((group) => group.records).filter((record) => record.contentKind === "course" && record.sourceClass === "generated_curriculum").length,
    communityAndReligionBriefs: records.contentItems.filter((item) => item.content_kind === "community_brief").length,
    domainResources: snapshotGroups.find((group) => group.spec.name === "domain-candidates.jsonl").records.length,
    byAssetKind,
    sourceItems: records.sourceItems.length,
    sourceDispositionReceipts: records.sourceReceipts.length,
    sourceReviewRecords: records.sourceReviews.length,
    collections: records.collections.length,
    contentItems: records.contentItems.length,
    contentRevisions: records.contentRevisions.length,
    revisionSourceLinks: records.revisionSources.length,
    contentReviewRecords: records.contentReviews.length,
    membershipDecisions: records.memberships.length,
    permanentSeedsPreservedSeparately: records.permanentSeedCount,
    canonicalBaselinesPreservedSeparately: records.canonicalBaselineCount,
    staffPublicationDecisions: 0,
  };
  assert(counts.donorCandidates === 169, `Expected 169 governed donor candidates; found ${counts.donorCandidates}.`);
  assert(counts.courses === 86, `Expected 86 courses; found ${counts.courses}.`);
  assert(counts.authoredCourses === 45, `Expected 45 authored courses; found ${counts.authoredCourses}.`);
  assert(counts.generatedCurriculumCourses === 41, `Expected 41 generated curriculum courses; found ${counts.generatedCurriculumCourses}.`);
  assert(counts.communityAndReligionBriefs === 49, `Expected 49 community/religion candidates; found ${counts.communityAndReligionBriefs}.`);
  assert(counts.domainResources === 34, `Expected 34 domain resources; found ${counts.domainResources}.`);
  assert(counts.sourceReviewRecords === 169 * REVIEW_DIMENSIONS.length, "Every donor source must enter all review queues.");
  assert(counts.contentReviewRecords === 169 * REVIEW_DIMENSIONS.length, "Every candidate revision must enter all review queues.");
  assert(counts.permanentSeedsPreservedSeparately === 25, "The permanent seed collection count changed.");
  assert(counts.canonicalBaselinesPreservedSeparately === 73, "The canonical baseline collection count changed.");
  assert(counts.staffPublicationDecisions === 0 && records.publications.length === 0, "Donor recovery cannot create publication decisions.");

  const logoSha256 = sha256File(resolve(REPOSITORY_ROOT, "public/images/dhs-logo.png"));
  assert(logoSha256 === EXPECTED_LOGO_SHA256, "The protected DHS logo digest changed.");
  const stageSet = {
    stageId: "pac-donor-library-2026-09-05",
    mode: "recovered_donor_candidates_held",
    inputs: {
      snapshots: snapshotGroups.map((group) => group.receipt),
      donorCommits: [...new Set(snapshotGroups.flatMap((group) => group.records.map((record) => record.donor.commit)))].sort(),
    },
    counts,
    files: fileReceipts,
    ownerApprovalDoesNotPublish: true,
    publicationDecisionRows: 0,
    protectedLogoSha256: logoSha256,
  };
  return {
    records,
    files,
    manifest: {
      schemaVersion: "1.0.0",
      ...stageSet,
      stageSetSha256: canonicalSha256(stageSet),
      noOmissionChecks: {
        authoredCourses: "45_of_45",
        generatedCurriculumCourses: "41_of_41",
        totalCourses: "86_of_86",
        staffCommunityBriefs: "40_of_40",
        unmatchedCommunityGuides: "1_of_1",
        religionBriefs: "8_of_8",
        domainResources: "34_of_34",
        permanentSeeds: "25_preserved_separately",
        canonicalBaselines: "73_preserved_separately",
      },
      heldFromStaffRelease: {
        donorCandidates: 169,
        pendingSourceReviews: counts.sourceReviewRecords,
        pendingContentReviews: counts.contentReviewRecords,
        publicationDecisions: 0,
      },
    },
    snapshotManifest: {
      schemaVersion: "1.0.0",
      capturedAt: CREATED_AT,
      purpose: "Pinned donor content recovered in full for governed editorial review.",
      snapshots: snapshotGroups.map((group) => group.receipt),
      counts: {
        authoredCourses: 45,
        generatedCurriculumCourses: 41,
        totalCourses: 86,
        staffCommunityBriefs: 40,
        unmatchedCommunityGuides: 1,
        religionBriefs: 8,
        domainResources: 34,
        totalGovernedCandidates: 169,
      },
      ownerDirection: {
        ingestionApproval: "owner_approved_for_ingestion",
        publicationAuthorization: "none",
        reviews: "pending",
      },
    },
  };
}

export function writeDonorLibraryImport(stage, outputDirectory = DEFAULT_DONOR_STAGE_DIRECTORY) {
  const output = resolve(outputDirectory);
  const fromRoot = relative(REPOSITORY_ROOT, output);
  assert(
    fromRoot === ".pac-import-staging" || fromRoot.startsWith(`.pac-import-staging${sep}`),
    "Donor import output must stay inside .pac-import-staging.",
  );
  mkdirSync(output, { recursive: true });
  for (const name of STAGE_FILE_ORDER) {
    const rows = stage.files.get(name);
    const body = rows.map((record) => canonicalJson(record)).join("\n") + (rows.length ? "\n" : "");
    writeFileSync(resolve(output, name), body, "utf8");
  }
  writeFileSync(resolve(output, "manifest.json"), `${JSON.stringify(stage.manifest, null, 2)}\n`, "utf8");
  writeFileSync(
    resolve(DONOR_SNAPSHOT_DIRECTORY, "manifest.json"),
    `${JSON.stringify(stage.snapshotManifest, null, 2)}\n`,
    "utf8",
  );
  return output;
}
