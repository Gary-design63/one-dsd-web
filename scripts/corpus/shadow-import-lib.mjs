import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, relative, resolve, sep } from "node:path";

export const REPOSITORY_ROOT = resolve(import.meta.dirname, "../..");
export const DEFAULT_STAGE_DIRECTORY = resolve(
  REPOSITORY_ROOT,
  ".pac-import-staging/pac-corpus-import-2026-09-04",
);

const SOURCE_REVIEW_DIMENSIONS = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
  "rights_and_consent",
];

const STAGE_FILE_ORDER = [
  "source_carriers.jsonl",
  "source_items.jsonl",
  "source_review_records.jsonl",
  "content_collections.jsonl",
  "content_items.jsonl",
  "content_revisions.jsonl",
  "revision_sources.jsonl",
  "review_records.jsonl",
  "collection_membership_decisions.jsonl",
  "publication_decisions.jsonl",
];

export function canonicalize(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .filter((key) => value[key] !== undefined)
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

export function canonicalSha256(value) {
  return sha256Text(canonicalJson(value));
}

export function sha256Text(value) {
  return createHash("sha256").update(value).digest("hex").toUpperCase();
}

export function sha256File(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex").toUpperCase();
}

export function deterministicUuid(name) {
  const bytes = createHash("sha256").update(`one-dhs-pac:${name}`).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON ${relative(REPOSITORY_ROOT, filePath)}: ${error.message}`);
  }
}

function readJsonLines(filePath) {
  const text = readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);
  const records = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].trim()) continue;
    try {
      records.push({ lineNumber: index + 1, value: JSON.parse(lines[index]) });
    } catch (error) {
      throw new Error(`${filePath} line ${index + 1} is not valid JSON: ${error.message}`);
    }
  }
  return records;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSha(value, label) {
  assert(/^[0-9a-fA-F]{64}$/.test(String(value ?? "")), `${label} is not a SHA-256 digest.`);
}

function isInsideRepository(filePath) {
  const pathFromRoot = relative(REPOSITORY_ROOT, resolve(filePath));
  return pathFromRoot === "" || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== "..");
}

function repositoryPath(filePath) {
  assert(isInsideRepository(filePath), `Snapshot path escapes the repository: ${filePath}`);
  return relative(REPOSITORY_ROOT, filePath).replaceAll("\\", "/");
}

function findManifestFiles(directory) {
  if (!existsSync(directory)) return [];
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) found.push(...findManifestFiles(path));
    if (entry.isFile() && entry.name === "manifest.json") found.push(path);
  }
  return found.sort();
}

function snapshotContentHash(entry, snapshot) {
  if (entry.textSha256 !== undefined) {
    assert(typeof snapshot.content === "string", `${entry.sourceId} snapshot has no text content.`);
    const actual = sha256Text(snapshot.content);
    assert(
      actual === String(entry.textSha256).toUpperCase(),
      `${entry.sourceId} snapshot text hash changed: expected ${entry.textSha256}; found ${actual}.`,
    );
  }
  if (entry.extractedTextSha256 !== undefined) {
    const text = snapshot.extraction?.text ?? "";
    assert(typeof text === "string", `${entry.sourceId} snapshot has no extracted text.`);
    const actual = sha256Text(text);
    assert(
      actual === String(entry.extractedTextSha256).toUpperCase(),
      `${entry.sourceId} extracted-text hash changed: expected ${entry.extractedTextSha256}; found ${actual}.`,
    );
  }
}

function loadSnapshots(ownerSources) {
  const sourceById = new Map(ownerSources.map((source) => [source.sourceId, source]));
  const sourceByDriveId = new Map(
    ownerSources
      .filter((source) => source.locator?.fileId)
      .map((source) => [source.locator.fileId, source]),
  );
  const manifests = [];
  const snapshotsByOwnerSourceId = new Map();
  const aliases = [];
  const snapshotRoot = resolve(REPOSITORY_ROOT, "data/source-snapshots");

  for (const manifestPath of findManifestFiles(snapshotRoot)) {
    const manifest = readJson(manifestPath);
    const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
    const metadataPath = resolve(dirname(manifestPath), "metadata.json");
    const metadataDocument = existsSync(metadataPath) ? readJson(metadataPath) : null;
    const metadataEntries = metadataDocument?.entries ?? [];
    const metadataBySourceId = new Map(metadataEntries.map((entry) => [entry.sourceId, entry]));
    if (metadataDocument?.counts?.registered !== undefined) {
      assert(
        metadataDocument.counts.registered === metadataEntries.length,
        `${repositoryPath(metadataPath)} metadata count does not match its entries.`,
      );
    }
    let manualExtractionRequired = 0;
    let captured = 0;

    for (const entry of entries) {
      assert(entry.sourceId && entry.snapshotPath, `${manifestPath} has an incomplete snapshot entry.`);
      const snapshotPath = resolve(REPOSITORY_ROOT, entry.snapshotPath);
      assert(isInsideRepository(snapshotPath), `${entry.sourceId} snapshot path is outside the repository.`);
      assert(existsSync(snapshotPath), `${entry.sourceId} snapshot file is missing: ${entry.snapshotPath}`);
      const snapshot = readJson(snapshotPath);
      snapshotContentHash(entry, snapshot);

      const ownerSource = sourceById.get(entry.sourceId) ?? sourceByDriveId.get(snapshot.id);
      assert(ownerSource, `${entry.sourceId} snapshot cannot be reconciled to the owner source ledger.`);
      if (entry.sourceSha256 && ownerSource.evidence?.sha256) {
        assert(
          String(entry.sourceSha256).toUpperCase() === String(ownerSource.evidence.sha256).toUpperCase(),
          `${entry.sourceId} snapshot source hash disagrees with the owner ledger.`,
        );
      }
      if (snapshotsByOwnerSourceId.has(ownerSource.sourceId)) {
        throw new Error(`More than one snapshot maps to owner source ${ownerSource.sourceId}.`);
      }

      const declaredAliases = [...new Set([
        ...(entry.aliases ?? []),
        ...(snapshot.aliases ?? []),
        ...(entry.sourceId !== ownerSource.sourceId ? [entry.sourceId] : []),
      ])];
      for (const alias of declaredAliases) {
        aliases.push({
          ownerSourceId: ownerSource.sourceId,
          snapshotSourceId: alias,
          match: entry.sourceId !== ownerSource.sourceId && snapshot.id === ownerSource.locator?.fileId
            ? "locator_file_id"
            : "declared_alias",
        });
      }

      if (String(entry.status).includes("manual") || String(entry.status).includes("required")) {
        manualExtractionRequired += String(entry.status).includes("manual") ? 1 : 0;
      }
      if (!String(entry.status).includes("manual")) captured += 1;

      snapshotsByOwnerSourceId.set(ownerSource.sourceId, {
        entry,
        snapshot,
        snapshotPath: repositoryPath(snapshotPath),
        snapshotFileSha256: sha256File(snapshotPath),
        snapshotBytes: statSync(snapshotPath).size,
        aliases: declaredAliases,
        connectedMetadata: metadataBySourceId.get(ownerSource.sourceId) ?? null,
      });
    }

    if (manifest.counts?.registered !== undefined) {
      assert(
        manifest.counts.registered === entries.length,
        `${repositoryPath(manifestPath)} says ${manifest.counts.registered} entries but contains ${entries.length}.`,
      );
    }
    if (manifest.counts?.expected !== undefined) {
      assert(
        manifest.counts.expected === entries.length,
        `${repositoryPath(manifestPath)} says ${manifest.counts.expected} expected entries but contains ${entries.length}.`,
      );
    }
    if (manifest.counts?.captured !== undefined) {
      assert(
        manifest.counts.captured === entries.length,
        `${repositoryPath(manifestPath)} says ${manifest.counts.captured} captured entries but contains ${entries.length}.`,
      );
    }
    if (manifest.counts?.manualExtractionRequired !== undefined) {
      assert(
        manifest.counts.manualExtractionRequired === manualExtractionRequired,
        `${repositoryPath(manifestPath)} manual-extraction count does not match its entries.`,
      );
    }

    manifests.push({
      path: repositoryPath(manifestPath),
      sha256: sha256File(manifestPath),
      registered: entries.length,
      captured,
      manualExtractionRequired,
      metadata: metadataDocument ? {
        path: repositoryPath(metadataPath),
        sha256: sha256File(metadataPath),
        records: metadataEntries.length,
      } : null,
    });
  }

  return { manifests, snapshotsByOwnerSourceId, aliases };
}

function resolveCatalogPath(explicitCatalogPath, localResolver) {
  const candidates = [
    explicitCatalogPath,
    process.env.PAC_CATALOG_PATH,
    localResolver?.paths?.["complete-normalized-catalog-578"],
  ].filter(Boolean);
  const catalogPath = candidates.find((candidate) => existsSync(candidate));
  assert(
    catalogPath,
    "The 578-record catalog cannot be located. Supply --catalog, PAC_CATALOG_PATH, or the ignored local resolver.",
  );
  return resolve(catalogPath);
}

function sourceAccessScope(source) {
  const audience = String(source.audience ?? "");
  if (audience.includes("consultant")) return "consultant";
  if (audience.includes("scope_controlled")) return "scope_controlled";
  if (audience.includes("staff")) return "staff_candidate";
  return "internal_source";
}

function mediaTypeForSource(source) {
  const type = String(source.sourceType ?? "").toLowerCase();
  if (type.includes("docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (type.includes("ppt") || type.includes("slide")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (type.includes("mp3") || type.includes("audio")) return "audio/mpeg";
  if (type.includes("html")) return "text/html";
  if (type.includes("jsonl")) return "application/x-ndjson";
  if (type.includes("json")) return "application/json";
  if (type.includes("text") || type.includes("glossary")) return "text/plain";
  if (type.includes("zip") || type.includes("package")) return "application/zip";
  return "application/octet-stream";
}

function normalizedReviewStatus(recordedState) {
  const state = String(recordedState ?? "").toLowerCase();
  if (state === "not_applicable") return "not_applicable";
  if (state.startsWith("blocked")) return "blocked";
  if (state === "pass" || state === "passed") return "pass";
  if (
    state.includes("revise") ||
    state.includes("revision") ||
    state.includes("quarantine") ||
    state.includes("hold") ||
    state.includes("incomplete") ||
    state.includes("5_pass_20")
  ) return "revise";
  return "pending";
}

function contentKind(payload) {
  if (payload.type === "learning_module") return "learning_module";
  if (payload.type === "question_bank") return "question_bank";
  return "resource";
}

function addUniqueRecord(records, index, key, record, label) {
  const hash = canonicalSha256(record);
  const previous = index.get(key);
  if (previous) {
    if (previous.hash !== hash) throw new Error(`Hard conflict: ${label} ${key} has different content.`);
    throw new Error(`Duplicate ${label} ${key} appears twice in one stage.`);
  }
  index.set(key, { hash, record });
  records.push(record);
}

function buildCarrierAdder(capturedAt) {
  const records = [];
  const byLogicalKey = new Map();
  return {
    records,
    add(input) {
      const record = {
        carrier_id: deterministicUuid(`source-carrier:${input.logical_key}`),
        logical_key: input.logical_key,
        media_type: input.media_type,
        original_name: input.original_name ?? null,
        byte_count: input.byte_count ?? null,
        raw_blob_sha256: input.raw_blob_sha256?.toUpperCase() ?? null,
        storage_key: null,
        external_locator: input.external_locator ?? {},
        captured_at: capturedAt,
        captured_by: "program_owner_corpus_intake",
      };
      if (record.raw_blob_sha256) assertSha(record.raw_blob_sha256, record.logical_key);
      const previous = byLogicalKey.get(record.logical_key);
      if (previous) {
        const previousIdentity = {
          media_type: previous.media_type,
          byte_count: previous.byte_count,
          raw_blob_sha256: previous.raw_blob_sha256,
        };
        const recordIdentity = {
          media_type: record.media_type,
          byte_count: record.byte_count,
          raw_blob_sha256: record.raw_blob_sha256,
        };
        if (canonicalSha256(previousIdentity) !== canonicalSha256(recordIdentity)) {
          throw new Error(`Hard conflict: source carrier ${record.logical_key} has different content.`);
        }
        return previous.carrier_id;
      }
      byLogicalKey.set(record.logical_key, record);
      records.push(record);
      return record.carrier_id;
    },
  };
}

function localPathForSource(source, localResolver) {
  if (source.locator?.kind === "local_logical") {
    return localResolver?.paths?.[source.locator.resolverKey] ?? null;
  }
  if (source.locator?.kind === "codex_attachment") {
    return localResolver?.attachments?.[source.sourceId] ?? null;
  }
  return null;
}

function verifyResolvedFile(source, candidate) {
  const candidates = (Array.isArray(candidate) ? candidate : [candidate]).filter(Boolean);
  const filePath = candidates.find((path) => existsSync(path) && statSync(path).isFile());
  if (!filePath || !source.evidence?.sha256) return null;
  const expectedSha = String(source.evidence.sha256).toUpperCase();
  const actualSha = sha256File(filePath);
  assert(actualSha === expectedSha, `${source.sourceId} raw-file SHA-256 changed.`);
  if (source.evidence.bytes !== undefined) {
    assert(statSync(filePath).size === source.evidence.bytes, `${source.sourceId} raw-file byte count changed.`);
  }
  return filePath;
}

function buildStageRecords({ catalogPath, contract, ledger, seed, builtIns, localResolver, snapshots }) {
  const capturedAt = `${contract.createdOn}T00:00:00.000Z`;
  const catalogRows = readJsonLines(catalogPath);
  const expectedCatalog = contract.exactLayerCounts.normalizedCatalogRecords;
  assert(catalogRows.length === expectedCatalog, `Expected ${expectedCatalog} catalog rows; found ${catalogRows.length}.`);
  const catalogSha = sha256File(catalogPath);
  assert(
    catalogSha === String(contract.inputs.normalizedCatalog.sha256).toUpperCase(),
    `Catalog SHA-256 changed: expected ${contract.inputs.normalizedCatalog.sha256}; found ${catalogSha}.`,
  );

  assert(builtIns.items?.length === builtIns.count, "Legacy built-in manifest count is inconsistent.");
  assert(
    builtIns.count === contract.exactLayerCounts.builtInSourceRecords,
    `Expected ${contract.exactLayerCounts.builtInSourceRecords} built-ins; found ${builtIns.count}.`,
  );
  assert(ledger.sources?.length === ledger.counts?.ledgerEntries, "Owner source ledger count is inconsistent.");
  assert(seed.items?.length === seed.count && seed.count === 25, "Permanent seed manifest must contain 25 items.");

  const carrierBuilder = buildCarrierAdder(capturedAt);
  const catalogCarrierId = carrierBuilder.add({
    logical_key: `sha256:${catalogSha}`,
    media_type: "application/x-ndjson",
    original_name: basename(catalogPath),
    byte_count: statSync(catalogPath).size,
    raw_blob_sha256: catalogSha,
    external_locator: {
      sourceId: contract.inputs.normalizedCatalog.sourceId,
      locatorClass: "local_resolver",
    },
  });

  const builtInManifestPath = resolve(REPOSITORY_ROOT, "data/import-manifests/legacy-built-ins-2026-09-04.json");
  const builtInManifestSha = sha256File(builtInManifestPath);
  const builtInCarrierId = carrierBuilder.add({
    logical_key: `sha256:${builtInManifestSha}`,
    media_type: "application/json",
    original_name: basename(builtInManifestPath),
    byte_count: statSync(builtInManifestPath).size,
    raw_blob_sha256: builtInManifestSha,
    external_locator: { repositoryPath: repositoryPath(builtInManifestPath) },
  });

  const sourceItems = [];
  const sourceItemIndex = new Map();
  for (const { lineNumber, value } of catalogRows) {
    assert(value.assetId, `Catalog line ${lineNumber} has no assetId.`);
    const sourceVersion = String(value.version ?? 1);
    const record = {
      source_item_id: `catalog:${value.assetId}:v${sourceVersion}`,
      source_business_id: `catalog:${value.assetId}`,
      carrier_id: catalogCarrierId,
      source_version: sourceVersion,
      source_pointer: `catalog.jsonl#L${String(lineNumber).padStart(6, "0")}`,
      title: value.title ?? value.assetId,
      normalized_payload: value,
      normalized_item_sha256: canonicalSha256(value),
      hash_algorithm: "SHA-256",
      hash_algorithm_version: "canonical-json-v1",
      owner_approval_status: "owner_approved_for_ingestion",
      accounting_status: "accounted",
      access_scope: value.visibility === "consultant" ? "consultant" : "staff_candidate",
    };
    addUniqueRecord(sourceItems, sourceItemIndex, record.source_item_id, record, "source item");
  }

  for (const item of builtIns.items) {
    const payload = { ...item };
    const record = {
      source_item_id: `legacy-built-in:${item.id}:v${item.version}`,
      source_business_id: `legacy-built-in:${item.id}`,
      carrier_id: builtInCarrierId,
      source_version: String(item.version),
      source_pointer: `${builtIns.sourceReference}#${item.id}`,
      title: item.title,
      normalized_payload: payload,
      normalized_item_sha256: canonicalSha256(payload),
      hash_algorithm: "SHA-256",
      hash_algorithm_version: "canonical-json-v1",
      owner_approval_status: builtIns.ownerApproval,
      accounting_status: "accounted",
      access_scope: "staff_candidate",
    };
    addUniqueRecord(sourceItems, sourceItemIndex, record.source_item_id, record, "source item");
  }

  const ownerSourceItemIdBySourceId = new Map();
  for (const source of ledger.sources) {
    let carrierId = null;
    const snapshot = snapshots.snapshotsByOwnerSourceId.get(source.sourceId);
    if (snapshot) {
      const candidate = localPathForSource(source, localResolver);
      const verifiedFile = candidate ? verifyResolvedFile(source, candidate) : null;
      const recordedSourceSha = snapshot.entry.sourceSha256 ?? snapshot.snapshot.sourceSha256 ?? null;
      const recordedSourceBytes = snapshot.entry.sourceBytes ?? snapshot.snapshot.sourceBytes ?? null;
      const rawSha = verifiedFile
        ? String(source.evidence.sha256).toUpperCase()
        : recordedSourceSha
          ? String(recordedSourceSha).toUpperCase()
          : null;
      carrierId = carrierBuilder.add(rawSha ? {
        logical_key: `sha256:${rawSha}`,
        media_type: mediaTypeForSource(source),
        original_name: source.locator?.fileName ?? snapshot.snapshot.sourceFileName ?? null,
        byte_count: source.evidence?.bytes ?? recordedSourceBytes,
        raw_blob_sha256: rawSha,
        external_locator: {
          locatorClass: verifiedFile ? "verified_local_source" : "captured_source_receipt",
          sourceLocator: source.locator,
          snapshotPath: snapshot.snapshotPath,
          snapshotFileSha256: snapshot.snapshotFileSha256,
          captureStatus: snapshot.entry.status,
        },
      } : {
        logical_key: `sha256:${snapshot.snapshotFileSha256}`,
        media_type: "application/json",
        original_name: basename(snapshot.snapshotPath),
        byte_count: snapshot.snapshotBytes,
        raw_blob_sha256: snapshot.snapshotFileSha256,
        external_locator: {
          repositoryPath: snapshot.snapshotPath,
          originalLocator: source.locator,
          captureStatus: snapshot.entry.status,
          textSha256: snapshot.entry.textSha256 ?? snapshot.entry.extractedTextSha256 ?? null,
        },
      });
    } else if (source.accountingStatus !== "accounted_awaiting_source") {
      const candidate = localPathForSource(source, localResolver);
      const verifiedFile = candidate ? verifyResolvedFile(source, candidate) : null;
      const rawSha = source.evidence?.sha256 && verifiedFile
        ? String(source.evidence.sha256).toUpperCase()
        : null;
      const logicalKey = rawSha ? `sha256:${rawSha}` : `locator:${source.sourceId}`;
      carrierId = carrierBuilder.add({
        logical_key: logicalKey,
        media_type: mediaTypeForSource(source),
        original_name: source.locator?.fileName ?? null,
        byte_count: source.evidence?.bytes ?? null,
        raw_blob_sha256: rawSha,
        external_locator: source.locator ?? { sourceId: source.sourceId },
      });
    }

    const payload = snapshot
      ? {
          ledger: source,
          snapshot: snapshot.snapshot,
          snapshotReceipt: snapshot.entry,
          connectedMetadata: snapshot.connectedMetadata,
          sourceAliases: snapshot.aliases,
        }
      : { ledger: source };
    const sourceItemId = `owner:${source.sourceId}:v1`;
    const record = {
      source_item_id: sourceItemId,
      source_business_id: `owner:${source.sourceId}`,
      carrier_id: carrierId,
      source_version: "1",
      source_pointer: snapshot?.snapshotPath ?? source.locator?.path ?? source.locator?.url ?? source.sourceId,
      title: source.title,
      normalized_payload: payload,
      normalized_item_sha256: canonicalSha256(payload),
      hash_algorithm: "SHA-256",
      hash_algorithm_version: "canonical-json-v1",
      owner_approval_status: source.ownerApproval,
      accounting_status: source.accountingStatus,
      access_scope: sourceAccessScope(source),
    };
    addUniqueRecord(sourceItems, sourceItemIndex, record.source_item_id, record, "source item");
    ownerSourceItemIdBySourceId.set(source.sourceId, sourceItemId);
  }

  const sourceReviews = [];
  const sourceReviewIndex = new Map();
  for (const source of ledger.sources) {
    const sourceItemId = ownerSourceItemIdBySourceId.get(source.sourceId);
    for (const dimension of SOURCE_REVIEW_DIMENSIONS) {
      const recordedState = source.review?.[dimension] ?? "pending";
      const review = {
        source_review_id: deterministicUuid(`source-review:${source.sourceId}:${dimension}:${recordedState}`),
        source_item_id: sourceItemId,
        dimension,
        status: normalizedReviewStatus(recordedState),
        reviewer_role: "source_intake_review",
        reviewer_id: null,
        findings: {
          recordedState,
          pipelineStatus: source.pipelineStatus,
          publicationStatus: source.publicationStatus,
          ownerApprovalIsNotStaffRelease: true,
        },
        recorded_at: capturedAt,
        supersedes_source_review_id: null,
      };
      addUniqueRecord(sourceReviews, sourceReviewIndex, review.source_review_id, review, "source review");
    }
  }

  const collection = {
    collection_id: seed.collectionId,
    name: seed.name,
    purpose: "Permanent first-party seed collection retained alongside the larger corpus.",
    preservation_rule: "append_only",
    created_at: capturedAt,
    created_by: "program_owner_seed_preservation",
  };
  const contentItems = [];
  const contentRevisions = [];
  const revisionSources = [];
  const contentReviews = [];
  const memberships = [];
  const contentIndex = new Map();
  const revisionIndex = new Map();
  const membershipIndex = new Map();
  const contentReviewIndex = new Map();
  const seedSourceItemId = ownerSourceItemIdBySourceId.get("current-seed-collection-2026-09-04");
  assert(seedSourceItemId, "The owner ledger does not contain the permanent seed collection receipt.");

  for (const item of [...seed.items].sort((left, right) => left.ordinal - right.ordinal)) {
    assert(canonicalSha256(item.payload) === item.payloadSha256, `Permanent seed ${item.id} payload changed.`);
    const contentItem = {
      content_item_id: item.id,
      content_kind: contentKind(item.payload),
      default_scope_id: "one-dhs",
      staff_label: item.payload.title,
      restricted: false,
      created_at: capturedAt,
      created_by: "program_owner_seed_preservation",
      retired_at: null,
      retired_by: null,
    };
    addUniqueRecord(contentItems, contentIndex, item.id, contentItem, "content item");

    const revisionId = deterministicUuid(`content-revision:${item.id}:${item.revision}:${item.payloadSha256}`);
    const revision = {
      revision_id: revisionId,
      content_item_id: item.id,
      revision_number: item.revision,
      canonical_payload: item.payload,
      payload_sha256: item.payloadSha256,
      change_summary: "Preserved permanent seed baseline.",
      required_review_dimensions: SOURCE_REVIEW_DIMENSIONS,
      created_at: capturedAt,
      created_by: "program_owner_seed_preservation",
      based_on_revision_id: null,
    };
    addUniqueRecord(contentRevisions, revisionIndex, `${item.id}@${item.revision}`, revision, "content revision");

    revisionSources.push({
      revision_id: revisionId,
      source_item_id: seedSourceItemId,
      relationship: "primary",
      note: "Payload preserved in the permanent 25-item seed manifest.",
    });

    for (const dimension of SOURCE_REVIEW_DIMENSIONS) {
      const review = {
        review_id: deterministicUuid(`content-review:${revisionId}:${dimension}:pending`),
        revision_id: revisionId,
        dimension,
        status: "pending",
        reviewer_role: "staff_release_review_queue",
        reviewer_id: null,
        findings: {
          reason: "Owner ingestion approval is preserved separately. This revision still requires staff-release review.",
        },
        recorded_at: capturedAt,
        supersedes_review_id: null,
      };
      addUniqueRecord(contentReviews, contentReviewIndex, review.review_id, review, "content review");
    }

    const membership = {
      collection_id: seed.collectionId,
      content_item_id: item.id,
      action: "add",
      decided_at: capturedAt,
      decided_by: "program_owner_seed_preservation",
      reason: "Retain every stable seed ID as an append-only permanent collection.",
    };
    addUniqueRecord(memberships, membershipIndex, `${seed.collectionId}:${item.id}`, membership, "collection membership");
  }

  assert(sourceItems.length === 578 + 5 + ledger.sources.length, "Source-item accounting total is incomplete.");
  assert(contentItems.length === 25 && memberships.length === 25, "Permanent seed accounting is incomplete.");

  return {
    sourceCarriers: carrierBuilder.records.sort((a, b) => a.logical_key.localeCompare(b.logical_key)),
    sourceItems: sourceItems.sort((a, b) => a.source_item_id.localeCompare(b.source_item_id)),
    sourceReviews: sourceReviews.sort((a, b) => a.source_review_id.localeCompare(b.source_review_id)),
    contentCollections: [collection],
    contentItems: contentItems.sort((a, b) => a.content_item_id.localeCompare(b.content_item_id)),
    contentRevisions: contentRevisions.sort((a, b) => a.content_item_id.localeCompare(b.content_item_id)),
    revisionSources: revisionSources.sort((a, b) => a.revision_id.localeCompare(b.revision_id)),
    contentReviews: contentReviews.sort((a, b) => a.review_id.localeCompare(b.review_id)),
    memberships: memberships.sort((a, b) => a.content_item_id.localeCompare(b.content_item_id)),
    publicationDecisions: [],
    catalogSha,
    catalogBytes: statSync(catalogPath).size,
  };
}

function jsonLines(records) {
  return records.map((record) => canonicalJson(record)).join("\n") + (records.length ? "\n" : "");
}

function stageFiles(records) {
  return new Map([
    ["source_carriers.jsonl", records.sourceCarriers],
    ["source_items.jsonl", records.sourceItems],
    ["source_review_records.jsonl", records.sourceReviews],
    ["content_collections.jsonl", records.contentCollections],
    ["content_items.jsonl", records.contentItems],
    ["content_revisions.jsonl", records.contentRevisions],
    ["revision_sources.jsonl", records.revisionSources],
    ["review_records.jsonl", records.contentReviews],
    ["collection_membership_decisions.jsonl", records.memberships],
    ["publication_decisions.jsonl", records.publicationDecisions],
  ]);
}

export function buildShadowImport(options = {}) {
  const contractPath = resolve(REPOSITORY_ROOT, "data/import-manifests/corpus-import-contract-2026-09-04.json");
  const ledgerPath = resolve(REPOSITORY_ROOT, "data/source-ledger/owner-supplied-inputs.json");
  const seedPath = resolve(REPOSITORY_ROOT, "data/source-ledger/current-seed-2026-09-04.json");
  const builtInsPath = resolve(REPOSITORY_ROOT, "data/import-manifests/legacy-built-ins-2026-09-04.json");
  const resolverPath = resolve(REPOSITORY_ROOT, "data/source-ledger/local-resolver.local.json");
  const contract = readJson(contractPath);
  const ledger = readJson(ledgerPath);
  const seed = readJson(seedPath);
  const builtIns = readJson(builtInsPath);
  const localResolver = existsSync(resolverPath) ? readJson(resolverPath) : null;
  const catalogPath = resolveCatalogPath(options.catalogPath, localResolver);
  const snapshots = loadSnapshots(ledger.sources);
  const records = buildStageRecords({ catalogPath, contract, ledger, seed, builtIns, localResolver, snapshots });
  const files = stageFiles(records);
  const fileReceipts = STAGE_FILE_ORDER.map((name) => {
    const body = jsonLines(files.get(name));
    return { name, records: files.get(name).length, bytes: Buffer.byteLength(body), sha256: sha256Text(body) };
  });

  const inputs = {
    contract: { path: repositoryPath(contractPath), sha256: sha256File(contractPath) },
    ownerLedger: { path: repositoryPath(ledgerPath), sha256: sha256File(ledgerPath), entries: ledger.sources.length },
    seedManifest: { path: repositoryPath(seedPath), sha256: sha256File(seedPath), entries: seed.items.length },
    legacyBuiltIns: { path: repositoryPath(builtInsPath), sha256: sha256File(builtInsPath), entries: builtIns.items.length },
    normalizedCatalog: { sha256: records.catalogSha, bytes: records.catalogBytes, entries: 578 },
    snapshotManifests: snapshots.manifests,
  };

  const counts = {
    catalogSourceItems: 578,
    legacyBuiltInSourceItems: 5,
    ownerLedgerSourceItems: ledger.sources.length,
    sourceItemsTotal: records.sourceItems.length,
    sourceCarriers: records.sourceCarriers.length,
    sourceReviews: records.sourceReviews.length,
    snapshotsRegistered: snapshots.manifests.reduce((sum, item) => sum + item.registered, 0),
    driveSnapshotsRegistered: snapshots.manifests
      .filter((item) => item.path.includes("/google-drive/"))
      .reduce((sum, item) => sum + item.registered, 0),
    localSnapshotsRegistered: snapshots.manifests
      .filter((item) => item.path.includes("/local/"))
      .reduce((sum, item) => sum + item.registered, 0),
    snapshotManualExtractionRequired: snapshots.manifests.reduce((sum, item) => sum + item.manualExtractionRequired, 0),
    snapshotAliases: snapshots.aliases.length,
    missingOriginals: ledger.sources.filter((source) => source.accountingStatus === "accounted_awaiting_source").length,
    permanentSeedItems: records.contentItems.length,
    permanentSeedRevisions: records.contentRevisions.length,
    stagedMembershipDecisions: records.memberships.length,
    staffPublicationDecisions: records.publicationDecisions.length,
  };

  assert(counts.catalogSourceItems === contract.exactLayerCounts.normalizedCatalogRecords, "Catalog layer count drifted.");
  assert(counts.legacyBuiltInSourceItems === contract.exactLayerCounts.builtInSourceRecords, "Built-in layer count drifted.");
  assert(counts.ownerLedgerSourceItems === contract.exactLayerCounts.ownerLedgerSourceRecords, "Owner-ledger layer count drifted.");
  assert(counts.sourceItemsTotal === contract.exactLayerCounts.shadowSourceRecords, "Shadow source total drifted.");
  assert(counts.snapshotsRegistered === contract.exactLayerCounts.sourceSnapshotReceipts, "Source-snapshot count drifted.");
  assert(counts.driveSnapshotsRegistered === contract.inputs.sourceSnapshots.googleDrive.entries, "Drive snapshot count drifted.");
  assert(counts.localSnapshotsRegistered === contract.inputs.sourceSnapshots.local.entries, "Local snapshot count drifted.");
  assert(counts.permanentSeedItems === contract.exactLayerCounts.currentSeedCollection, "Seed layer count drifted.");
  assert(counts.missingOriginals === ledger.counts.knownMissingOriginals, "Missing-source accounting drifted.");
  assert(counts.staffPublicationDecisions === 0, "A shadow import must never stage staff publication decisions.");

  const protectedLogoPath = resolve(REPOSITORY_ROOT, contract.protectedLogo.path);
  assert(existsSync(protectedLogoPath), "The protected logo is missing.");
  const logoSha = sha256File(protectedLogoPath);
  assert(logoSha === contract.protectedLogo.sha256.toUpperCase(), "The protected logo hash changed.");

  const stageSet = {
    stageId: contract.contractId,
    mode: "shadow_validated_not_published",
    inputs,
    counts,
    files: fileReceipts,
    ownerApprovalDoesNotPublish: true,
    publicationDecisionRows: 0,
    protectedLogoSha256: logoSha,
  };
  const manifest = {
    schemaVersion: "1.0.0",
    ...stageSet,
    stageSetSha256: canonicalSha256(stageSet),
    noOmissionChecks: {
      normalizedCatalog: "578_of_578",
      legacyBuiltIns: "5_of_5",
      ownerLedger: `${ledger.sources.length}_of_${ledger.sources.length}`,
      permanentSeeds: "25_of_25",
      missingSources: `${counts.missingOriginals}_explicitly_held`,
      sourceSnapshots: `${counts.snapshotsRegistered}_accounted`,
      driveSnapshots: `${counts.driveSnapshotsRegistered}_of_${ledger.counts.googlePresentationLinks}`,
    },
    heldFromStaffRelease: {
      allOwnerLedgerEntries: true,
      allShadowImportedSeedRevisions: true,
      manualExtractionSourceIds: [...snapshots.snapshotsByOwnerSourceId.entries()]
        .filter(([, snapshot]) => String(snapshot.entry.status).includes("manual"))
        .map(([sourceId]) => sourceId),
      transcriptRequiredSourceIds: [...snapshots.snapshotsByOwnerSourceId.entries()]
        .filter(([, snapshot]) => String(snapshot.entry.status).includes("transcript_required"))
        .map(([sourceId]) => sourceId),
      quarantinedNeverExecuteSourceIds: [...snapshots.snapshotsByOwnerSourceId.entries()]
        .filter(([, snapshot]) => String(snapshot.entry.status).includes("quarantined_never_execute"))
        .map(([sourceId]) => sourceId),
    },
    sourceAliases: snapshots.aliases,
  };

  return { manifest, records, files };
}

export function writeShadowImport(stage, outputDirectory = DEFAULT_STAGE_DIRECTORY) {
  const output = resolve(outputDirectory);
  const relativeOutput = relative(REPOSITORY_ROOT, output);
  assert(
    relativeOutput.startsWith(`.pac-import-staging${sep}`) || relativeOutput === ".pac-import-staging",
    "Shadow output must stay inside the repository's .pac-import-staging directory.",
  );
  mkdirSync(output, { recursive: true });
  for (const name of STAGE_FILE_ORDER) {
    writeFileSync(resolve(output, name), jsonLines(stage.files.get(name)), "utf8");
  }
  writeFileSync(resolve(output, "manifest.json"), `${JSON.stringify(stage.manifest, null, 2)}\n`, "utf8");
  return output;
}

export function validateShadowImportDirectory(outputDirectory = DEFAULT_STAGE_DIRECTORY) {
  const output = resolve(outputDirectory);
  const manifestPath = resolve(output, "manifest.json");
  assert(existsSync(manifestPath), `Shadow manifest is missing: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const expectedSetHash = canonicalSha256({
    stageId: manifest.stageId,
    mode: manifest.mode,
    inputs: manifest.inputs,
    counts: manifest.counts,
    files: manifest.files,
    ownerApprovalDoesNotPublish: manifest.ownerApprovalDoesNotPublish,
    publicationDecisionRows: manifest.publicationDecisionRows,
    protectedLogoSha256: manifest.protectedLogoSha256,
  });
  assert(expectedSetHash === manifest.stageSetSha256, "Shadow manifest set hash is invalid.");

  for (const receipt of manifest.files) {
    const filePath = resolve(output, receipt.name);
    assert(existsSync(filePath), `Shadow file is missing: ${receipt.name}`);
    const body = readFileSync(filePath, "utf8");
    assert(sha256Text(body) === receipt.sha256, `${receipt.name} SHA-256 changed.`);
    assert(Buffer.byteLength(body) === receipt.bytes, `${receipt.name} byte count changed.`);
    const records = body ? body.split(/\r?\n/).filter(Boolean) : [];
    assert(records.length === receipt.records, `${receipt.name} record count changed.`);
    for (let index = 0; index < records.length; index += 1) {
      try {
        JSON.parse(records[index]);
      } catch (error) {
        throw new Error(`${receipt.name} line ${index + 1} is invalid JSON: ${error.message}`);
      }
    }
  }
  assert(manifest.counts.staffPublicationDecisions === 0, "Shadow stage contains a staff publication decision.");
  return manifest;
}

export function readStageJsonLines(stageDirectory, fileName) {
  return readJsonLines(resolve(stageDirectory, fileName)).map((entry) => entry.value);
}
