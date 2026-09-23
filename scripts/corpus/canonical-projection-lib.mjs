import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { relative, resolve, sep } from "node:path";
import {
  buildShadowImport,
  canonicalJson,
  canonicalSha256,
  deterministicUuid,
  REPOSITORY_ROOT,
  sha256File,
  sha256Text,
} from "./shadow-import-lib.mjs";

export const DEFAULT_CANONICAL_SOURCE_DIRECTORY = resolve(
  REPOSITORY_ROOT,
  "data/source-snapshots/canonical-release",
);

export const DEFAULT_CANONICAL_STAGE_DIRECTORY = resolve(
  REPOSITORY_ROOT,
  ".pac-import-staging/pac-canonical-projection-2026-09-05",
);

const CREATED_AT = "2026-09-05T00:00:00.000Z";
const RELEASE_DATE = "2026-07-21";
const RELEASE_SOURCE_ITEM_ID = "owner:staging-canonical-release:v1";
const FAMILY_COLLECTION_ID = `canonical-family-library-${RELEASE_DATE}`;
const CHILD_COLLECTION_ID = `canonical-active-resource-library-${RELEASE_DATE}`;
const REVIEW_DIMENSIONS = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
  "rights_and_consent",
];

const INPUT_FILES = {
  canonicalResources: "canonical-resources.jsonl",
  canonicalFamilies: "canonical-families.jsonl",
  editorBaseline: "canonical-editor-baseline.jsonl",
  dispositionLedger: "disposition-ledger.jsonl",
  sourceManifest: "source-manifest.json",
};

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
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read ${path}: ${error.message}`);
  }
}

function readJsonLines(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  return lines.flatMap((line, index) => {
    if (!line.trim()) return [];
    try {
      return [JSON.parse(line)];
    } catch (error) {
      throw new Error(`${path} line ${index + 1} is not valid JSON: ${error.message}`);
    }
  });
}

function exactSet(left, right) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function uniqueMap(records, keyOf, label) {
  const result = new Map();
  for (const record of records) {
    const key = keyOf(record);
    assert(key, `${label} has no stable ID.`);
    assert(!result.has(key), `Hard conflict: duplicate ${label} ID ${key}.`);
    result.set(key, record);
  }
  return result;
}

function validateTitle(title, label) {
  assert(typeof title === "string" && title.trim(), `${label} has no usable title.`);
  assert(!/[<>]/.test(title), `${label} title contains markup.`);
  assert(!/^\s*(undefined|null)\s*$/i.test(title), `${label} has a placeholder title.`);
  return title.trim();
}

function jsonLines(records) {
  return records.map((record) => canonicalJson(record)).join("\n") + (records.length ? "\n" : "");
}

function projectedSourceItemId(receipt, builtInIds, sourceItemsById) {
  const version = String(receipt.sourceVersion ?? 1);
  const sourceItemId = builtInIds.has(receipt.assetId)
    ? `legacy-built-in:${receipt.assetId}:v${version}`
    : `catalog:${receipt.assetId}:v${version}`;
  assert(sourceItemsById.has(sourceItemId), `Receipt ${receipt.receiptId} cannot find source ${sourceItemId}.`);
  return sourceItemId;
}

function fileReceipt(sourceDirectory, name, expectedSha256) {
  const path = resolve(sourceDirectory, name);
  assert(existsSync(path), `Pinned canonical input is missing: ${name}.`);
  const actualSha256 = sha256File(path);
  assert(
    actualSha256 === String(expectedSha256).toUpperCase(),
    `${name} SHA-256 changed: expected ${expectedSha256}; found ${actualSha256}.`,
  );
  return {
    path: `data/source-snapshots/canonical-release/${name}`,
    bytes: readFileSync(path).byteLength,
    sha256: actualSha256,
  };
}

function verifySourceInputs(sourceDirectory, contract) {
  const expected = contract.inputs.stagingRelease.files;
  const receipts = {
    canonicalResources: fileReceipt(sourceDirectory, INPUT_FILES.canonicalResources, expected.canonicalResourcesSha256),
    canonicalFamilies: fileReceipt(sourceDirectory, INPUT_FILES.canonicalFamilies, expected.canonicalFamiliesSha256),
    editorBaseline: fileReceipt(sourceDirectory, INPUT_FILES.editorBaseline, expected.editorBaselineSha256),
    dispositionLedger: fileReceipt(sourceDirectory, INPUT_FILES.dispositionLedger, expected.dispositionLedgerSha256),
    sourceManifest: fileReceipt(sourceDirectory, INPUT_FILES.sourceManifest, expected.sourceManifestSha256),
  };
  return receipts;
}

function buildRecords({ contract, seed, builtIns, shadow, sourceDirectory }) {
  const resourceFamilies = readJsonLines(resolve(sourceDirectory, INPUT_FILES.canonicalResources));
  const familyIndex = readJsonLines(resolve(sourceDirectory, INPUT_FILES.canonicalFamilies));
  const editorBaseline = readJsonLines(resolve(sourceDirectory, INPUT_FILES.editorBaseline));
  const dispositionLedger = readJsonLines(resolve(sourceDirectory, INPUT_FILES.dispositionLedger));
  const sourceManifest = readJson(resolve(sourceDirectory, INPUT_FILES.sourceManifest));

  assert(resourceFamilies.length === contract.exactLayerCounts.canonicalFamilies, "Canonical resource-family count drifted.");
  assert(familyIndex.length === contract.exactLayerCounts.canonicalFamilies, "Canonical family-index count drifted.");
  assert(editorBaseline.length === contract.exactLayerCounts.canonicalEditableUnits, "Canonical editor-baseline count drifted.");
  assert(dispositionLedger.length === contract.exactLayerCounts.staffDispositionReceipts, "Disposition receipt count drifted.");
  assert(sourceManifest.staffTransformationCount === dispositionLedger.length, "Source manifest and receipt ledger disagree.");

  const resourceFamiliesById = uniqueMap(resourceFamilies, (row) => row.familyId, "canonical resource family");
  const familyIndexById = uniqueMap(familyIndex, (row) => row.familyId, "canonical family index");
  uniqueMap(editorBaseline, (row) => row.entityId, "canonical editor baseline");
  const receiptsById = uniqueMap(dispositionLedger, (row) => row.receiptId, "disposition receipt");
  const receiptByAssetId = uniqueMap(dispositionLedger, (row) => row.assetId, "disposition asset");

  assert(exactSet(new Set(resourceFamiliesById.keys()), new Set(familyIndexById.keys())), "The two canonical family files contain different family IDs.");

  const familyBaselines = editorBaseline.filter((row) => row.entityType === "family");
  const childBaselines = editorBaseline.filter((row) => row.entityType === "child");
  assert(familyBaselines.length === 21, `Expected 21 family baselines; found ${familyBaselines.length}.`);
  assert(childBaselines.length === 52, `Expected 52 child baselines; found ${childBaselines.length}.`);
  assert(exactSet(new Set(familyBaselines.map((row) => row.entityId)), new Set(resourceFamiliesById.keys())), "Family baseline IDs do not match the canonical families.");

  const activeReceipts = dispositionLedger.filter((row) => ["active_retain", "active_revise"].includes(row.decision));
  const mergedReceipts = dispositionLedger.filter((row) => row.decision === "component_merge");
  const internalReceipts = dispositionLedger.filter((row) => row.decision === "internal_reclassify");
  assert(activeReceipts.length === contract.exactLayerCounts.activeSourceCandidates, "Active-candidate count drifted.");
  assert(mergedReceipts.length === contract.exactLayerCounts.mergeComponents, "Merged-component count drifted.");
  assert(internalReceipts.length === contract.exactLayerCounts.internalCandidates, "Internal-source count drifted.");
  assert(activeReceipts.length + mergedReceipts.length + internalReceipts.length === dispositionLedger.length, "Unknown disposition decision found.");
  assert(exactSet(new Set(activeReceipts.map((row) => row.assetId)), new Set(childBaselines.map((row) => row.entityId))), "The 52 active receipts do not exactly match the 52 child baselines.");

  const seedIds = new Set(seed.items.map((item) => item.id));
  const projectedIds = new Set(editorBaseline.map((row) => row.entityId));
  assert([...projectedIds].every((id) => !seedIds.has(id)), "Canonical projection would overwrite a permanent seed ID.");

  const sourceItemsById = new Map(shadow.records.sourceItems.map((row) => [row.source_item_id, row]));
  assert(sourceItemsById.has(RELEASE_SOURCE_ITEM_ID), "The canonical release source receipt is missing from the shadow source layer.");
  const builtInIds = new Set(builtIns.items.map((item) => item.id));
  const sourceItemIdByAssetId = new Map();

  const sourceReceipts = [...receiptsById.values()].map((receipt) => {
    const sourceItemId = projectedSourceItemId(receipt, builtInIds, sourceItemsById);
    sourceItemIdByAssetId.set(receipt.assetId, sourceItemId);
    return {
      receipt_id: receipt.receiptId,
      source_item_id: sourceItemId,
      disposition: receipt.decision,
      canonical_family_id: receipt.familyId ?? null,
      canonical_item_id: ["active_retain", "active_revise"].includes(receipt.decision)
        ? receipt.assetId
        : receipt.decision === "component_merge"
          ? receipt.familyId
          : null,
      decision_payload: receipt,
      decision_sha256: canonicalSha256(receipt),
      decided_at: receipt.decidedAt,
      decided_by: receipt.authority,
      release_commit: contract.inputs.stagingRelease.commit,
      release_manifest_sha256: contract.inputs.stagingRelease.completeReleaseManifestSha256.toUpperCase(),
    };
  }).sort((left, right) => left.receipt_id.localeCompare(right.receipt_id));

  const collections = [
    {
      collection_id: FAMILY_COLLECTION_ID,
      name: "One DSD canonical resource families",
      purpose: "The 21 editable resource areas retained from the pinned canonical release for current review.",
      preservation_rule: "replaceable_view",
      created_at: CREATED_AT,
      created_by: "program_owner_canonical_projection",
    },
    {
      collection_id: CHILD_COLLECTION_ID,
      name: "One DSD canonical active resources",
      purpose: "The 52 active top-level resources retained from the pinned canonical release for current review.",
      preservation_rule: "replaceable_view",
      created_at: CREATED_AT,
      created_by: "program_owner_canonical_projection",
    },
  ];

  const contentItems = [];
  const contentRevisions = [];
  const revisionSources = [];
  const contentReviews = [];
  const memberships = [];

  for (const baseline of [...editorBaseline].sort((left, right) => left.entityId.localeCompare(right.entityId))) {
    assert(["family", "child"].includes(baseline.entityType), `Unknown baseline type ${baseline.entityType}.`);
    assert(baseline.fields?.kind === baseline.entityType, `Baseline ${baseline.entityId} kind does not match its entity type.`);
    assert(baseline.familyId && resourceFamiliesById.has(baseline.familyId), `Baseline ${baseline.entityId} has an unknown family.`);
    const upstreamHash = sha256Text(JSON.stringify(baseline.fields)).toLowerCase();
    assert(upstreamHash === String(baseline.contentHash).toLowerCase(), `Baseline ${baseline.entityId} content hash changed.`);
    const title = validateTitle(baseline.fields.title, `Baseline ${baseline.entityId}`);
    const family = resourceFamiliesById.get(baseline.familyId);
    const restricted = baseline.entityType === "family"
      && !family.audiences?.some((audience) => ["staff", "leadership"].includes(audience));
    contentItems.push({
      content_item_id: baseline.entityId,
      content_kind: baseline.entityType === "family" ? "family" : "resource",
      default_scope_id: "dsd",
      staff_label: title,
      restricted,
      created_at: CREATED_AT,
      created_by: "program_owner_canonical_projection",
      retired_at: null,
      retired_by: null,
    });

    const revisionId = deterministicUuid(`canonical-projection:${baseline.entityId}:1:${baseline.contentHash}`);
    contentRevisions.push({
      revision_id: revisionId,
      content_item_id: baseline.entityId,
      revision_number: 1,
      canonical_payload: baseline.fields,
      payload_sha256: canonicalSha256(baseline.fields),
      source_content_sha256: String(baseline.contentHash).toUpperCase(),
      change_summary: "Imported unchanged from the pinned canonical editor baseline.",
      required_review_dimensions: REVIEW_DIMENSIONS,
      created_at: CREATED_AT,
      created_by: "program_owner_canonical_projection",
      based_on_revision_id: null,
    });

    revisionSources.push({
      revision_id: revisionId,
      source_item_id: RELEASE_SOURCE_ITEM_ID,
      relationship: "primary",
      note: "Pinned canonical release containing this unchanged editor baseline.",
    });

    if (baseline.entityType === "child") {
      const receipt = receiptByAssetId.get(baseline.entityId);
      assert(receipt && ["active_retain", "active_revise"].includes(receipt.decision), `Child ${baseline.entityId} has no active receipt.`);
      revisionSources.push({
        revision_id: revisionId,
        source_item_id: sourceItemIdByAssetId.get(baseline.entityId),
        relationship: "adapted_from",
        note: `Original source retained under receipt ${receipt.receiptId}; current disposition is ${receipt.decision}.`,
      });
    } else {
      const familyComponents = mergedReceipts.filter((receipt) => receipt.familyId === baseline.familyId);
      for (const receipt of familyComponents) {
        revisionSources.push({
          revision_id: revisionId,
          source_item_id: sourceItemIdByAssetId.get(receipt.assetId),
          relationship: "merged_component",
          note: `Component retained under receipt ${receipt.receiptId}; it is not a separate staff page.`,
        });
      }
    }

    const disposition = baseline.entityType === "child"
      ? receiptByAssetId.get(baseline.entityId).decision
      : "canonical_family";
    for (const dimension of REVIEW_DIMENSIONS) {
      contentReviews.push({
        review_id: deterministicUuid(`canonical-projection-review:${revisionId}:${dimension}:pending`),
        revision_id: revisionId,
        dimension,
        status: "pending",
        reviewer_role: "canonical_release_review_queue",
        reviewer_id: null,
        findings: {
          disposition,
          reason: "The pinned source is preserved unchanged. Current program review is required before any staff release decision.",
        },
        recorded_at: CREATED_AT,
        supersedes_review_id: null,
      });
    }

    memberships.push({
      collection_id: baseline.entityType === "family" ? FAMILY_COLLECTION_ID : CHILD_COLLECTION_ID,
      content_item_id: baseline.entityId,
      action: "add",
      decided_at: CREATED_AT,
      decided_by: "program_owner_canonical_projection",
      reason: baseline.entityType === "family"
        ? "Retain this canonical family as an editable, review-held resource area."
        : "Retain this active canonical resource as an editable, review-held resource.",
    });
  }

  const relationshipKey = (row) => `${row.revision_id}:${row.source_item_id}:${row.relationship}`;
  uniqueMap(revisionSources, relationshipKey, "revision source link");
  uniqueMap(contentReviews, (row) => row.review_id, "content review");
  uniqueMap(memberships, (row) => `${row.collection_id}:${row.content_item_id}`, "collection membership");

  return {
    sourceCarriers: [],
    sourceItems: [],
    sourceReceipts,
    sourceReviews: [],
    collections,
    contentItems,
    contentRevisions,
    revisionSources: revisionSources.sort((left, right) => relationshipKey(left).localeCompare(relationshipKey(right))),
    contentReviews: contentReviews.sort((left, right) => left.review_id.localeCompare(right.review_id)),
    memberships: memberships.sort((left, right) => left.content_item_id.localeCompare(right.content_item_id)),
    publications: [],
    partitions: {
      activeRetain: activeReceipts.filter((row) => row.decision === "active_retain").length,
      activeRevise: activeReceipts.filter((row) => row.decision === "active_revise").length,
      merged: mergedReceipts.length,
      internal: internalReceipts.length,
    },
    seedIds,
    projectedIds,
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

export function buildCanonicalProjection(options = {}) {
  const contractPath = resolve(REPOSITORY_ROOT, "data/import-manifests/corpus-import-contract-2026-09-04.json");
  const seedPath = resolve(REPOSITORY_ROOT, "data/source-ledger/current-seed-2026-09-04.json");
  const builtInsPath = resolve(REPOSITORY_ROOT, "data/import-manifests/legacy-built-ins-2026-09-04.json");
  const contract = readJson(contractPath);
  const seed = readJson(seedPath);
  const builtIns = readJson(builtInsPath);
  const sourceDirectory = resolve(options.sourceDirectory ?? DEFAULT_CANONICAL_SOURCE_DIRECTORY);
  const inputReceipts = verifySourceInputs(sourceDirectory, contract);
  const shadow = buildShadowImport({ catalogPath: options.catalogPath });
  const records = buildRecords({ contract, seed, builtIns, shadow, sourceDirectory });
  const files = stageFiles(records);
  const fileReceipts = STAGE_FILE_ORDER.map((name) => {
    const body = jsonLines(files.get(name));
    return { name, records: files.get(name).length, bytes: Buffer.byteLength(body), sha256: sha256Text(body) };
  });

  const counts = {
    dispositionReceipts: records.sourceReceipts.length,
    activeRetainReceipts: records.partitions.activeRetain,
    activeReviseReceipts: records.partitions.activeRevise,
    mergedComponentReceipts: records.partitions.merged,
    internalReclassifiedReceipts: records.partitions.internal,
    collections: records.collections.length,
    canonicalFamilies: records.contentItems.filter((row) => row.content_kind === "family").length,
    canonicalChildren: records.contentItems.filter((row) => row.content_kind === "resource").length,
    canonicalRevisions: records.contentRevisions.length,
    revisionSourceLinks: records.revisionSources.length,
    reviewRecords: records.contentReviews.length,
    membershipDecisions: records.memberships.length,
    permanentSeedsPreservedSeparately: seed.items.length,
    seedIdCollisions: [...records.projectedIds].filter((id) => records.seedIds.has(id)).length,
    staffPublicationDecisions: records.publications.length,
  };

  assert(counts.dispositionReceipts === 557, "All 557 disposition receipts must remain accounted for.");
  assert(counts.canonicalFamilies === 21 && counts.canonicalChildren === 52, "Canonical projection must contain 21 families and 52 children.");
  assert(counts.canonicalRevisions === 73 && counts.membershipDecisions === 73, "Every canonical unit must have one baseline and one staged membership.");
  assert(counts.reviewRecords === 73 * REVIEW_DIMENSIONS.length, "Every canonical revision must enter every required review queue.");
  assert(counts.seedIdCollisions === 0 && counts.permanentSeedsPreservedSeparately === 25, "Permanent seeds were not preserved separately.");
  assert(counts.staffPublicationDecisions === 0, "Canonical projection must not create staff publication decisions.");

  const stageSet = {
    stageId: "pac-canonical-projection-2026-09-05",
    mode: "canonical_projection_held",
    inputs: {
      contract: { path: relative(REPOSITORY_ROOT, contractPath).replaceAll("\\", "/"), sha256: sha256File(contractPath) },
      seedManifest: { path: relative(REPOSITORY_ROOT, seedPath).replaceAll("\\", "/"), sha256: sha256File(seedPath), entries: seed.items.length },
      shadowSourceSetSha256: shadow.manifest.stageSetSha256,
      stagingRelease: {
        repository: contract.inputs.stagingRelease.repository,
        commit: contract.inputs.stagingRelease.commit,
        completeReleaseManifestSha256: contract.inputs.stagingRelease.completeReleaseManifestSha256.toUpperCase(),
        files: inputReceipts,
      },
    },
    counts,
    files: fileReceipts,
    ownerApprovalDoesNotPublish: true,
    publicationDecisionRows: 0,
    protectedLogoSha256: shadow.manifest.protectedLogoSha256,
  };

  return {
    records,
    files,
    manifest: {
      schemaVersion: "1.0.0",
      ...stageSet,
      stageSetSha256: canonicalSha256(stageSet),
      noOmissionChecks: {
        canonicalFamilies: "21_of_21",
        activeChildren: "52_of_52",
        dispositionReceipts: "557_of_557",
        activeReceiptToChildMatch: "52_of_52",
        permanentSeeds: "25_preserved_separately",
      },
      heldFromStaffRelease: {
        allCanonicalRevisions: 73,
        activeRevisionRequired: records.partitions.activeRevise,
        mergedComponentsNotSeparatePages: records.partitions.merged,
        internalSourcesRestricted: records.partitions.internal,
      },
    },
  };
}

export function writeCanonicalProjection(stage, outputDirectory = DEFAULT_CANONICAL_STAGE_DIRECTORY) {
  const output = resolve(outputDirectory);
  const fromRoot = relative(REPOSITORY_ROOT, output);
  assert(
    fromRoot === ".pac-import-staging" || fromRoot.startsWith(`.pac-import-staging${sep}`),
    "Canonical projection output must stay inside .pac-import-staging.",
  );
  mkdirSync(output, { recursive: true });
  for (const name of STAGE_FILE_ORDER) {
    writeFileSync(resolve(output, name), jsonLines(stage.files.get(name)), "utf8");
  }
  writeFileSync(resolve(output, "manifest.json"), `${JSON.stringify(stage.manifest, null, 2)}\n`, "utf8");
  return output;
}

