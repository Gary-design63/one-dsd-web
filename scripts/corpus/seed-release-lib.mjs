import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import {
  REPOSITORY_ROOT,
  canonicalJson,
  canonicalSha256,
  deterministicUuid,
  sha256File,
  sha256Text,
} from "./shadow-import-lib.mjs";

export { canonicalSha256 } from "./shadow-import-lib.mjs";
export const SEED_RELEASE_REPOSITORY_ROOT = REPOSITORY_ROOT;

export const DEFAULT_SEED_RELEASE_MANIFEST = resolve(
  REPOSITORY_ROOT,
  "data/release-manifests/permanent-seed-staff-release-2026-09-05.json",
);
export const DEFAULT_SEED_RELEASE_STAGE = resolve(
  REPOSITORY_ROOT,
  ".pac-import-staging/permanent-seed-staff-release-2026-09-05",
);
export const SEED_RELEASE_FILE_ORDER = [
  "content_revisions.jsonl",
  "revision_sources.jsonl",
  "review_records.jsonl",
  "publication_decisions.jsonl",
];
export const SEED_RELEASE_TRUST_DECISION = Object.freeze({
  sensitivityClass: "S1",
  ordinaryIndexingAllowed: true,
  modelContextAllowed: false,
  unauthenticatedExposurePermitted: true,
  exposureReason: "The consultant-approved permanent seed release contains reviewed internal-purpose resources and is intentionally available at the staff-facing web address without sign-in.",
  decisionSource: "governed_seed_release",
  limitations: [
    "Internal-purpose staff resource; exposure approved by the governed permanent seed release.",
  ],
});

const SEED_RELEASE_LIMITATIONS = SEED_RELEASE_TRUST_DECISION.limitations;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON ${relative(REPOSITORY_ROOT, filePath)}: ${error.message}`);
  }
}

function readJsonLines(filePath) {
  const body = readFileSync(filePath, "utf8");
  return body.split(/\r?\n/).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${relative(REPOSITORY_ROOT, filePath)} line ${index + 1} is invalid JSON: ${error.message}`);
    }
  });
}

function jsonLines(records) {
  return records.map((record) => canonicalJson(record)).join("\n") + (records.length ? "\n" : "");
}

function validateReleaseManifest(manifest, baseline) {
  const { releaseSetSha256, ...releaseSet } = manifest;
  assert(canonicalSha256(releaseSet) === releaseSetSha256, "The permanent seed release manifest hash is invalid.");
  assert(manifest.releaseId === "permanent-seed-staff-release-2026-09-05", "The seed release ID is not recognized.");
  assert(manifest.collectionId === baseline.collectionId, "The seed release points to the wrong permanent collection.");
  assert(manifest.baseline.sha256 === sha256File(resolve(REPOSITORY_ROOT, manifest.baseline.path)), "The seed baseline receipt changed.");
  assert(manifest.items.length === 25 && baseline.items.length === 25, "The seed release must account for exactly 25 items.");
  assert(new Set(manifest.reviewDimensions).size === 6, "The seed release must complete all six required review dimensions.");

  const baselineById = new Map(baseline.items.map((item) => [item.id, item]));
  assert(baselineById.size === 25, "The permanent seed baseline contains duplicate IDs.");
  const releaseIds = new Set();
  for (const item of manifest.items) {
    assert(!releaseIds.has(item.id), `The seed release repeats ${item.id}.`);
    releaseIds.add(item.id);
    const baselineItem = baselineById.get(item.id);
    assert(baselineItem, `The seed release contains non-seed item ${item.id}.`);
    assert(canonicalSha256(baselineItem.payload) === item.baselinePayloadSha256, `${item.id} baseline hash changed.`);
    assert(canonicalSha256(item.payload) === item.payloadSha256, `${item.id} current payload hash changed.`);
    assert(item.payload.id === item.id, `${item.id} payload identity changed.`);
    assert(item.payload.status === "approved", `${item.id} is not approved.`);
    assert(
      item.payload.accessibility === "reviewed"
        || (item.payload.authority === "external_verify" && item.payload.accessibility === "pending"),
      `${item.id} has not completed accessibility review for the local staff-facing content.`,
    );
    assert(item.scopeId === (item.payload.scope === "agencywide" ? "one-dhs" : "dsd"), `${item.id} scope mapping is invalid.`);
    const changed = item.payloadSha256 !== item.baselinePayloadSha256;
    assert(changed === item.changedFromBaseline, `${item.id} change status is invalid.`);
    assert(item.activeRevision === (changed ? 2 : 1), `${item.id} active revision is invalid.`);
  }
  assert([...baselineById.keys()].every((id) => releaseIds.has(id)), "The seed release omits a permanent seed ID.");
  assert(manifest.counts.changedRevisions === manifest.items.filter((item) => item.changedFromBaseline).length, "Changed revision count is invalid.");
  assert(manifest.counts.unchangedRevisions === manifest.items.filter((item) => !item.changedFromBaseline).length, "Unchanged revision count is invalid.");
  assert(manifest.counts.completedReviews === 150, "The seed release must contain 150 completed reviews.");
  assert(manifest.counts.publicationDecisions === 25, "The seed release must contain 25 publication decisions.");
}

function baselineRevisionId(item) {
  return deterministicUuid(`content-revision:${item.id}:${item.baselineRevision}:${item.baselinePayloadSha256}`);
}

function activeRevisionId(item) {
  return deterministicUuid(`content-revision:${item.id}:${item.activeRevision}:${item.payloadSha256}`);
}

function buildRecords(manifest) {
  const sourceItemId = "owner:current-seed-collection-2026-09-04:v1";
  const revisions = [];
  const revisionSources = [];
  const reviews = [];
  const publications = [];

  for (const item of [...manifest.items].sort((left, right) => left.ordinal - right.ordinal)) {
    const baselineId = baselineRevisionId(item);
    const revisionId = activeRevisionId(item);
    if (item.changedFromBaseline) {
      revisions.push({
        revision_id: revisionId,
        content_item_id: item.id,
        revision_number: item.activeRevision,
        canonical_payload: item.payload,
        payload_sha256: item.payloadSha256,
        change_summary: "Revised for clear, direct, and professionally warm staff use while retaining the stable resource identity.",
        required_review_dimensions: manifest.reviewDimensions,
        created_at: manifest.createdAt,
        created_by: "Equity and Inclusion Operations Consultant",
        based_on_revision_id: baselineId,
        sensitivity_class: SEED_RELEASE_TRUST_DECISION.sensitivityClass,
        ordinary_indexing_allowed: SEED_RELEASE_TRUST_DECISION.ordinaryIndexingAllowed,
        model_context_allowed: SEED_RELEASE_TRUST_DECISION.modelContextAllowed,
        limitations: SEED_RELEASE_LIMITATIONS,
      });
      revisionSources.push({
        revision_id: revisionId,
        source_item_id: sourceItemId,
        relationship: "adapted_from",
        note: "Current reviewed wording derived from the preserved permanent seed baseline.",
      });
    }

    for (const dimension of manifest.reviewDimensions) {
      const pendingReviewId = deterministicUuid(`content-review:${baselineId}:${dimension}:pending`);
      reviews.push({
        review_id: deterministicUuid(`seed-release-review:${manifest.releaseId}:${revisionId}:${dimension}:pass`),
        revision_id: revisionId,
        dimension,
        status: "pass",
        reviewer_role: "program content review",
        reviewer_id: null,
        findings: {
          conclusion: manifest.reviewBasis[dimension],
          evidence_checks: manifest.evidenceChecks,
          release_id: manifest.releaseId,
          local_staff_content_accessibility: "pass",
          external_destination_accessibility: item.payload.authority === "external_verify"
            ? "not represented as reviewed"
            : "not applicable",
        },
        recorded_at: manifest.createdAt,
        supersedes_review_id: pendingReviewId,
      });
    }

    publications.push({
      content_item_id: item.id,
      revision_id: revisionId,
      scope_id: item.scopeId,
      decision: "publish",
      gate_snapshot: {
        release_id: manifest.releaseId,
        collection_id: manifest.collectionId,
        payload_sha256: item.payloadSha256,
        required_reviews: Object.fromEntries(manifest.reviewDimensions.map((dimension) => [dimension, "pass"])),
        linked_source_item_id: sourceItemId,
        source_approval: "owner_approved_for_ingestion",
        source_accounting: "accounted",
        staff_retrieval_eligible: true,
        sensitivity_class: SEED_RELEASE_TRUST_DECISION.sensitivityClass,
        ordinary_indexing_allowed: SEED_RELEASE_TRUST_DECISION.ordinaryIndexingAllowed,
        model_context_allowed: SEED_RELEASE_TRUST_DECISION.modelContextAllowed,
        unauthenticated_exposure_permitted:
          SEED_RELEASE_TRUST_DECISION.unauthenticatedExposurePermitted,
        exposure_reason_recorded: true,
        trust_decision_source: SEED_RELEASE_TRUST_DECISION.decisionSource,
      },
      decided_at: manifest.createdAt,
      decided_by: "Equity and Inclusion Operations Consultant",
      reason: item.scopeId === "one-dhs"
        ? "This reviewed permanent seed resource is ready for staff use across the One DHS program."
        : "This reviewed permanent seed resource is ready for staff use within the Disability Services Division.",
      sensitivity_class: SEED_RELEASE_TRUST_DECISION.sensitivityClass,
      unauthenticated_exposure_permitted:
        SEED_RELEASE_TRUST_DECISION.unauthenticatedExposurePermitted,
      exposure_reason: SEED_RELEASE_TRUST_DECISION.exposureReason,
    });
  }

  return {
    revisions: revisions.sort((left, right) => left.content_item_id.localeCompare(right.content_item_id)),
    revisionSources: revisionSources.sort((left, right) => left.revision_id.localeCompare(right.revision_id)),
    reviews: reviews.sort((left, right) => left.review_id.localeCompare(right.review_id)),
    publications: publications.sort((left, right) => left.content_item_id.localeCompare(right.content_item_id)),
  };
}

function filesForRecords(records) {
  return new Map([
    ["content_revisions.jsonl", records.revisions],
    ["revision_sources.jsonl", records.revisionSources],
    ["review_records.jsonl", records.reviews],
    ["publication_decisions.jsonl", records.publications],
  ]);
}

export function buildSeedReleaseStage(options = {}) {
  const releaseManifestPath = options.releaseManifestPath
    ? resolve(options.releaseManifestPath)
    : DEFAULT_SEED_RELEASE_MANIFEST;
  const releaseManifest = readJson(releaseManifestPath);
  const baselinePath = resolve(REPOSITORY_ROOT, releaseManifest.baseline.path);
  const baseline = readJson(baselinePath);
  validateReleaseManifest(releaseManifest, baseline);
  const records = buildRecords(releaseManifest);
  const files = filesForRecords(records);
  const fileReceipts = SEED_RELEASE_FILE_ORDER.map((name) => {
    const body = jsonLines(files.get(name));
    return {
      name,
      records: files.get(name).length,
      bytes: Buffer.byteLength(body),
      sha256: sha256Text(body),
    };
  });
  const counts = {
    permanentSeedItems: releaseManifest.items.length,
    changedRevisions: records.revisions.length,
    unchangedRevisions: releaseManifest.items.length - records.revisions.length,
    revisionSourceLinks: records.revisionSources.length,
    completedReviews: records.reviews.length,
    agencywidePublicationDecisions: records.publications.filter((row) => row.scope_id === "one-dhs").length,
    dsdPublicationDecisions: records.publications.filter((row) => row.scope_id === "dsd").length,
    staffPublicationDecisions: records.publications.length,
    nonSeedPublicationDecisions: 0,
    stagedRows: SEED_RELEASE_FILE_ORDER.reduce((sum, name) => sum + files.get(name).length, 0),
  };
  assert(counts.permanentSeedItems === 25, "The release does not contain exactly 25 permanent seed items.");
  assert(counts.completedReviews === 150, "The release does not complete all 150 seed reviews.");
  assert(counts.staffPublicationDecisions === 25, "The release does not contain exactly 25 staff publication decisions.");
  assert(counts.nonSeedPublicationDecisions === 0, "The release contains a non-seed publication decision.");
  assert(records.publications.every((row) => row.decision === "publish"), "The release contains a non-publish decision.");

  const protectedLogo = resolve(REPOSITORY_ROOT, "public/images/dhs-logo.png");
  const protectedLogoSha256 = sha256File(protectedLogo);
  assert(
    protectedLogoSha256 === "E9D767446EC871A7FBE829C2A978CF0CB47886AAD31A4FFCFF59A78AE89ADD74",
    "The protected DHS logo hash changed.",
  );
  const stageSet = {
    schemaVersion: "1.0.0",
    stageId: releaseManifest.releaseId,
    mode: "reviewed_permanent_seed_staff_release",
    createdAt: releaseManifest.createdAt,
    inputs: {
      releaseManifest: {
        path: relative(REPOSITORY_ROOT, releaseManifestPath).replaceAll("\\", "/"),
        sha256: sha256File(releaseManifestPath),
        releaseSetSha256: releaseManifest.releaseSetSha256,
      },
      baseline: releaseManifest.baseline,
      currentCorpusSource: releaseManifest.currentCorpusSource,
    },
    collectionId: releaseManifest.collectionId,
    releasedItemIdsSha256: canonicalSha256(records.publications.map((row) => row.content_item_id)),
    counts,
    files: fileReceipts,
    reviewDimensions: releaseManifest.reviewDimensions,
    trustDecision: SEED_RELEASE_TRUST_DECISION,
    protectedLogoSha256,
  };
  const manifest = {
    ...stageSet,
    stageSetSha256: canonicalSha256(stageSet),
    noOmissionChecks: {
      permanentSeeds: "25_of_25",
      completedReviews: "150_of_150",
      publicationDecisions: "25_of_25",
      nonSeedPublications: "0",
    },
    releaseBoundaries: {
      ownerSuppliedSourcesPublished: 0,
      donorResourcesPublished: 0,
      canonicalProjectionResourcesPublished: 0,
      communityBriefsPublished: 0,
      heldItemsPublished: 0,
    },
  };
  return { manifest, releaseManifest, baseline, records, files };
}

export function writeSeedReleaseStage(stage, outputDirectory = DEFAULT_SEED_RELEASE_STAGE) {
  const output = resolve(outputDirectory);
  const relativeOutput = relative(REPOSITORY_ROOT, output);
  assert(
    relativeOutput.startsWith(`.pac-import-staging${sep}`) || relativeOutput === ".pac-import-staging",
    "Seed release output must stay inside the repository's .pac-import-staging directory.",
  );
  mkdirSync(output, { recursive: true });
  for (const name of SEED_RELEASE_FILE_ORDER) {
    writeFileSync(resolve(output, name), jsonLines(stage.files.get(name)), "utf8");
  }
  writeFileSync(resolve(output, "manifest.json"), `${JSON.stringify(stage.manifest, null, 2)}\n`, "utf8");
  return output;
}

export function readSeedReleaseStage(outputDirectory = DEFAULT_SEED_RELEASE_STAGE) {
  const output = resolve(outputDirectory);
  return {
    revisions: readJsonLines(resolve(output, "content_revisions.jsonl")),
    revisionSources: readJsonLines(resolve(output, "revision_sources.jsonl")),
    reviews: readJsonLines(resolve(output, "review_records.jsonl")),
    publications: readJsonLines(resolve(output, "publication_decisions.jsonl")),
  };
}

function replayIdentity(fileName, row) {
  if (fileName === "content_revisions.jsonl") return `${row.content_item_id}@${row.revision_number}`;
  if (fileName === "revision_sources.jsonl") return `${row.revision_id}:${row.source_item_id}:${row.relationship}`;
  if (fileName === "review_records.jsonl") return row.review_id;
  if (fileName === "publication_decisions.jsonl") return `${row.content_item_id}:${row.scope_id}:${row.decided_at}`;
  throw new Error(`Unsupported seed release file ${fileName}.`);
}

export function simulateSeedReleaseReplay(stage) {
  const stored = new Map();
  let inserted = 0;
  let exactReplay = 0;
  const apply = () => {
    for (const fileName of SEED_RELEASE_FILE_ORDER) {
      for (const row of stage.files.get(fileName)) {
        const identity = `${fileName}:${replayIdentity(fileName, row)}`;
        const hash = canonicalSha256(row);
        if (!stored.has(identity)) {
          stored.set(identity, hash);
          inserted += 1;
        } else if (stored.get(identity) === hash) {
          exactReplay += 1;
        } else {
          throw new Error(`Hard conflict for ${identity}: the same identity has different content.`);
        }
      }
    }
  };
  apply();
  const firstInserted = inserted;
  apply();
  return { firstInserted, secondExactReplay: exactReplay, conflicts: 0 };
}

export function validateSeedReleaseDirectory(outputDirectory = DEFAULT_SEED_RELEASE_STAGE) {
  const output = resolve(outputDirectory);
  const manifestPath = resolve(output, "manifest.json");
  assert(existsSync(manifestPath), `Seed release manifest is missing: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const stageSet = {
    schemaVersion: manifest.schemaVersion,
    stageId: manifest.stageId,
    mode: manifest.mode,
    createdAt: manifest.createdAt,
    inputs: manifest.inputs,
    collectionId: manifest.collectionId,
    releasedItemIdsSha256: manifest.releasedItemIdsSha256,
    counts: manifest.counts,
    files: manifest.files,
    reviewDimensions: manifest.reviewDimensions,
    trustDecision: manifest.trustDecision,
    protectedLogoSha256: manifest.protectedLogoSha256,
  };
  assert(canonicalSha256(stageSet) === manifest.stageSetSha256, "The seed release stage hash is invalid.");

  for (const receipt of manifest.files) {
    assert(SEED_RELEASE_FILE_ORDER.includes(receipt.name), `Unexpected file in seed release manifest: ${receipt.name}.`);
    const filePath = resolve(output, receipt.name);
    assert(existsSync(filePath), `Seed release file is missing: ${receipt.name}`);
    const body = readFileSync(filePath, "utf8");
    assert(sha256Text(body) === receipt.sha256, `${receipt.name} SHA-256 changed.`);
    assert(Buffer.byteLength(body) === receipt.bytes, `${receipt.name} byte count changed.`);
    assert(readJsonLines(filePath).length === receipt.records, `${receipt.name} record count changed.`);
  }

  const rows = readSeedReleaseStage(output);
  assert(
    canonicalSha256(manifest.trustDecision) === canonicalSha256(SEED_RELEASE_TRUST_DECISION),
    "The seed release trust decision is missing or changed.",
  );
  const seedManifest = readJson(resolve(REPOSITORY_ROOT, manifest.inputs.releaseManifest.path));
  const seedIds = new Set(seedManifest.items.map((item) => item.id));
  const activeRevisionById = new Map(seedManifest.items.map((item) => [item.id, activeRevisionId(item)]));
  assert(seedIds.size === 25, "The frozen seed release does not contain 25 unique IDs.");
  assert(rows.revisions.length === manifest.counts.changedRevisions, "Changed revision count does not match the stage manifest.");
  assert(rows.revisionSources.length === rows.revisions.length, "Every changed revision must have one source link.");
  assert(rows.reviews.length === 150, "The seed release must contain 150 completed review records.");
  assert(rows.publications.length === 25, "The seed release must contain 25 publication decisions.");
  assert(new Set(rows.publications.map((row) => row.content_item_id)).size === 25, "The seed release repeats a publication item.");
  for (const row of rows.publications) {
    assert(seedIds.has(row.content_item_id), `Non-seed publication blocked: ${row.content_item_id}.`);
    assert(row.revision_id === activeRevisionById.get(row.content_item_id), `${row.content_item_id} publication points to the wrong revision.`);
    assert(row.decision === "publish", `${row.content_item_id} has a non-publish decision.`);
    assert(["one-dhs", "dsd"].includes(row.scope_id), `${row.content_item_id} has an invalid publication scope.`);
    assert(row.gate_snapshot.staff_retrieval_eligible === true, `${row.content_item_id} is not marked eligible for staff retrieval.`);
    assert(row.sensitivity_class === SEED_RELEASE_TRUST_DECISION.sensitivityClass, `${row.content_item_id} does not carry the explicit seed sensitivity decision.`);
    assert(row.unauthenticated_exposure_permitted === true, `${row.content_item_id} does not explicitly permit staff-facing access without sign-in.`);
    assert(row.exposure_reason === SEED_RELEASE_TRUST_DECISION.exposureReason, `${row.content_item_id} does not carry the approved seed exposure reason.`);
    assert(row.gate_snapshot.trust_decision_source === SEED_RELEASE_TRUST_DECISION.decisionSource, `${row.content_item_id} does not identify its governed trust decision.`);
  }
  for (const row of rows.revisions) {
    assert(row.sensitivity_class === SEED_RELEASE_TRUST_DECISION.sensitivityClass, `${row.revision_id} does not carry the explicit seed sensitivity decision.`);
    assert(row.ordinary_indexing_allowed === true, `${row.revision_id} is not approved for ordinary staff retrieval.`);
    assert(row.model_context_allowed === false, `${row.revision_id} must remain outside model context without a separate decision.`);
    assert(canonicalSha256(row.limitations) === canonicalSha256(SEED_RELEASE_LIMITATIONS), `${row.revision_id} has an unexpected trust limitation.`);
  }
  const reviewPairs = new Set();
  for (const row of rows.reviews) {
    assert(row.status === "pass", `${row.review_id} is not a completed pass review.`);
    assert(manifest.reviewDimensions.includes(row.dimension), `${row.review_id} has an unexpected review dimension.`);
    const pair = `${row.revision_id}:${row.dimension}`;
    assert(!reviewPairs.has(pair), `Duplicate completed review ${pair}.`);
    reviewPairs.add(pair);
  }
  for (const revisionId of activeRevisionById.values()) {
    for (const dimension of manifest.reviewDimensions) {
      assert(reviewPairs.has(`${revisionId}:${dimension}`), `Missing ${dimension} review for ${revisionId}.`);
    }
  }
  assert(manifest.releaseBoundaries.ownerSuppliedSourcesPublished === 0, "Owner-supplied source publication is not allowed in this seed release.");
  assert(manifest.releaseBoundaries.donorResourcesPublished === 0, "Donor publication is not allowed in this seed release.");
  assert(manifest.releaseBoundaries.canonicalProjectionResourcesPublished === 0, "Canonical projection publication is not allowed in this seed release.");
  assert(manifest.releaseBoundaries.communityBriefsPublished === 0, "Community brief publication is not allowed in this seed release.");
  assert(manifest.releaseBoundaries.heldItemsPublished === 0, "Held content publication is not allowed in this seed release.");
  assert(manifest.protectedLogoSha256 === sha256File(resolve(REPOSITORY_ROOT, "public/images/dhs-logo.png")), "The protected logo changed after staging.");
  return { manifest, rows };
}
