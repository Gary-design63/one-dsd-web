import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import {
  buildShadowImport,
  canonicalJson,
  canonicalSha256,
  deterministicUuid,
  REPOSITORY_ROOT,
  sha256File,
  sha256Text,
} from "./shadow-import-lib.mjs";

export const SOURCE_OBJECT_STAGE_ID = "pac-private-source-objects-2026-09-05";
export const DEFAULT_SOURCE_OBJECT_STAGE_DIRECTORY = resolve(
  REPOSITORY_ROOT,
  `.pac-object-staging/${SOURCE_OBJECT_STAGE_ID}`,
);

const RECORDED_AT = "2026-09-05T00:00:00.000Z";
const RESOLVER_PATH = resolve(REPOSITORY_ROOT, "data/source-ledger/local-resolver.local.json");
const STAGE_FILE_ORDER = ["objects.jsonl", "holds.jsonl"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readJsonLines(filePath) {
  const text = readFileSync(filePath, "utf8");
  if (!text.trim()) return [];
  return text.split(/\r?\n/).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${relative(REPOSITORY_ROOT, filePath)} line ${index + 1} is invalid JSON: ${error.message}`);
    }
  });
}

function repositoryPath(filePath) {
  const absolute = resolve(filePath);
  const fromRoot = relative(REPOSITORY_ROOT, absolute);
  assert(
    fromRoot === "" || (!fromRoot.startsWith(`..${sep}`) && fromRoot !== ".."),
    "A repository object path escapes the repository.",
  );
  return fromRoot.replaceAll("\\", "/");
}

function jsonLines(records) {
  return records.length ? `${records.map(canonicalJson).join("\n")}\n` : "";
}

export function safeOperationalError(error) {
  let message = String(error?.message ?? error ?? "Unknown source-object error.");
  for (const sensitive of [process.env.PAC_SUPABASE_SECRET_KEY, process.env.PAC_DATABASE_URL]) {
    if (sensitive) message = message.replaceAll(sensitive, "[redacted]");
  }
  message = message.replace(/postgres(?:ql)?:\/\/[^\s'\"]+/gi, "[database connection redacted]");
  message = message.replace(/[A-Za-z]:\\[^\r\n]*/g, "[local path redacted]");
  return message;
}

function extensionFor(mediaType, descriptor) {
  const byType = new Map([
    ["application/json", ".json"],
    ["application/x-ndjson", ".jsonl"],
    ["application/zip", ".zip"],
    ["application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx"],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"],
    ["audio/mpeg", ".mp3"],
    ["text/html", ".html"],
    ["text/plain", ".txt"],
  ]);
  if (byType.has(mediaType)) return byType.get(mediaType);
  if (descriptor.kind === "repository_path") {
    const extension = extname(descriptor.path).toLowerCase();
    if (/^\.[a-z0-9]{1,8}$/.test(extension)) return extension;
  }
  return ".bin";
}

function objectKeyFor(sha256, representationKind, mediaType, descriptor) {
  const hash = sha256.toLowerCase();
  return `source-carriers/sha256/${hash.slice(0, 2)}/${hash}/${representationKind}${extensionFor(mediaType, descriptor)}`;
}

let cachedResolver = null;
function resolverDocument() {
  assert(existsSync(RESOLVER_PATH), "The ignored local source resolver is required to account for source objects.");
  cachedResolver ??= readJson(RESOLVER_PATH);
  return cachedResolver;
}

function descriptorCandidates(descriptor, resolver) {
  if (descriptor.kind === "repository_path") {
    const absolute = resolve(REPOSITORY_ROOT, descriptor.path);
    repositoryPath(absolute);
    return [absolute];
  }
  const section = descriptor.kind === "resolver_attachment" ? resolver.attachments : resolver.paths;
  const configured = section?.[descriptor.key];
  return (Array.isArray(configured) ? configured : [configured]).filter(Boolean).map((entry) => resolve(entry));
}

export function resolveStagedObjectPath(object, resolver = resolverDocument()) {
  const candidates = descriptorCandidates(object.local_locator, resolver);
  const files = candidates.filter((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  if (!files.length) {
    throw new Error(`Source object ${object.object_key} is no longer available through its local resolver.`);
  }
  for (const filePath of files) {
    const byteCount = statSync(filePath).size;
    if (byteCount !== object.byte_count) continue;
    if (sha256File(filePath) === object.sha256) return filePath;
  }
  throw new Error(`Hard conflict: source object ${object.object_key} no longer matches its staged SHA-256 and byte count.`);
}

function inspectDescriptor(descriptor, resolver, expectedSha256 = null, expectedBytes = null) {
  const candidates = descriptorCandidates(descriptor, resolver);
  const files = candidates.filter((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  const directories = candidates.filter((candidate) => existsSync(candidate) && statSync(candidate).isDirectory());
  if (!files.length) return { status: directories.length ? "directory" : "missing" };

  if (expectedSha256) {
    const expectedHash = String(expectedSha256).toUpperCase();
    for (const filePath of files) {
      if (expectedBytes !== null && expectedBytes !== undefined && statSync(filePath).size !== expectedBytes) continue;
      if (sha256File(filePath) === expectedHash) return { status: "file", filePath };
    }
    throw new Error("Hard conflict: a resolved source file does not match its recorded SHA-256 and byte count.");
  }
  return { status: "file", filePath: files[0] };
}

function linkedOwnerSourceIds(sourceItems, carrierId) {
  return sourceItems
    .filter((item) => item.carrier_id === carrierId && item.source_business_id.startsWith("owner:"))
    .map((item) => item.source_business_id.slice("owner:".length))
    .sort();
}

function attachmentKeyFor(locator, linkedSourceIds, resolver) {
  for (const sourceId of linkedSourceIds) {
    if (resolver.attachments?.[sourceId]) return sourceId;
  }
  const attachmentId = locator?.attachmentId;
  if (!attachmentId) return null;
  return Object.keys(resolver.attachments ?? {})
    .sort()
    .find((key) => String(resolver.attachments[key]).includes(attachmentId)) ?? null;
}

function primaryDescriptor(carrier, linkedSourceIds, resolver) {
  const locator = carrier.external_locator ?? {};
  const sourceLocator = locator.sourceLocator ?? {};
  if (sourceLocator.kind === "local_logical" && sourceLocator.resolverKey) {
    return { kind: "resolver_path", key: sourceLocator.resolverKey };
  }
  if (sourceLocator.kind === "codex_attachment") {
    const key = attachmentKeyFor(sourceLocator, linkedSourceIds, resolver);
    return key ? { kind: "resolver_attachment", key } : null;
  }
  if (locator.locatorClass === "local_resolver" && locator.sourceId) {
    return { kind: "resolver_path", key: locator.sourceId };
  }
  if (locator.kind === "local_logical" && locator.resolverKey) {
    return { kind: "resolver_path", key: locator.resolverKey };
  }
  if (locator.repositoryPath) {
    return { kind: "repository_path", path: locator.repositoryPath };
  }
  if (locator.kind === "repository_path" && locator.path) {
    return { kind: "repository_path", path: locator.path };
  }
  return null;
}

function representationKindFor(descriptor) {
  if (descriptor.kind !== "repository_path") return "original";
  if (descriptor.path.startsWith("data/source-snapshots/")) return "derived_snapshot";
  return "repository_source";
}

function statusHoldKinds(status) {
  const value = String(status ?? "");
  return [
    value.includes("manual") ? "manual_extraction_required" : null,
    value.includes("transcript_required") ? "transcript_required" : null,
    value.includes("quarantined_never_execute") ? "quarantined_never_execute" : null,
  ].filter(Boolean);
}

export function buildSourceObjectStage(options = {}) {
  const shadow = buildShadowImport({ catalogPath: options.catalogPath });
  const resolver = resolverDocument();
  const objects = [];
  const holds = [];
  const objectIndex = new Map();
  const holdIndex = new Map();

  function addObject(carrier, representationKind, descriptor, expectedSha256 = null, expectedBytes = null, mediaType = null) {
    const inspected = inspectDescriptor(descriptor, resolver, expectedSha256, expectedBytes);
    if (inspected.status !== "file") return inspected.status;
    // Source bytes are read only for size and SHA-256. HTML is never parsed, rendered, imported, or executed.
    const byteCount = statSync(inspected.filePath).size;
    const sha256 = sha256File(inspected.filePath);
    const resolvedMediaType = mediaType ?? carrier.media_type;
    const record = {
      carrier_id: carrier.carrier_id,
      representation_kind: representationKind,
      local_locator: descriptor,
      media_type: resolvedMediaType,
      byte_count: byteCount,
      sha256,
      object_key: objectKeyFor(sha256, representationKind, resolvedMediaType, descriptor),
    };
    const identity = `${carrier.carrier_id}:${representationKind}:${sha256}:${byteCount}`;
    const previous = objectIndex.get(identity);
    if (previous && canonicalSha256(previous) !== canonicalSha256(record)) {
      throw new Error(`Hard conflict: duplicate source representation ${identity} has different placement.`);
    }
    if (!previous) {
      objectIndex.set(identity, record);
      objects.push(record);
    }
    return "file";
  }

  function addHold({ carrierId = null, sourceItemId = null, holdKind, detail = {} }) {
    const identity = `${carrierId ?? "none"}:${sourceItemId ?? "none"}:${holdKind}`;
    if (holdIndex.has(identity)) return;
    const record = {
      hold_id: deterministicUuid(`source-binary-hold:${identity}`),
      carrier_id: carrierId,
      source_item_id: sourceItemId,
      hold_kind: holdKind,
      detail,
      recorded_at: RECORDED_AT,
      recorded_by: "program_owner_source_accounting",
    };
    holdIndex.set(identity, record);
    holds.push(record);
  }

  for (const carrier of shadow.records.sourceCarriers) {
    const sourceIds = linkedOwnerSourceIds(shadow.records.sourceItems, carrier.carrier_id);
    const sourceItemId = sourceIds.length ? `owner:${sourceIds[0]}:v1` : null;
    const locator = carrier.external_locator ?? {};
    const descriptor = primaryDescriptor(carrier, sourceIds, resolver);
    let primaryStatus = "missing";

    if (descriptor) {
      primaryStatus = addObject(
        carrier,
        representationKindFor(descriptor),
        descriptor,
        carrier.raw_blob_sha256,
        carrier.byte_count,
      );
    }

    if (locator.snapshotPath) {
      const snapshotDescriptor = { kind: "repository_path", path: locator.snapshotPath };
      const sameAsPrimary = descriptor && canonicalJson(descriptor) === canonicalJson(snapshotDescriptor);
      if (!sameAsPrimary) {
        addObject(
          carrier,
          "derived_snapshot",
          snapshotDescriptor,
          locator.snapshotFileSha256 ?? null,
          null,
          "application/json",
        );
      }
    }

    if (primaryStatus === "directory") {
      addHold({
        carrierId: carrier.carrier_id,
        sourceItemId,
        holdKind: "directory_requires_manifest",
        detail: { locatorKind: locator.kind ?? locator.locatorClass ?? "local_logical" },
      });
    } else if (primaryStatus === "missing" && carrier.raw_blob_sha256) {
      addHold({
        carrierId: carrier.carrier_id,
        sourceItemId,
        holdKind: "original_not_locally_available",
        detail: { expectedSha256: carrier.raw_blob_sha256, expectedBytes: carrier.byte_count },
      });
    } else if (!descriptor && ["url", "github"].includes(locator.kind)) {
      addHold({
        carrierId: carrier.carrier_id,
        sourceItemId,
        holdKind: "external_only",
        detail: { locatorKind: locator.kind },
      });
    } else if (!descriptor && !carrier.raw_blob_sha256) {
      addHold({
        carrierId: carrier.carrier_id,
        sourceItemId,
        holdKind: "original_not_locally_available",
        detail: { locatorKind: locator.kind ?? "unresolved" },
      });
    }

    if (locator.originalLocator?.kind === "google_drive") {
      addHold({
        carrierId: carrier.carrier_id,
        sourceItemId,
        holdKind: "original_not_locally_available",
        detail: { locatorKind: "google_drive", retainedRepresentation: "derived_snapshot" },
      });
    }
    for (const holdKind of statusHoldKinds(locator.captureStatus)) {
      addHold({
        carrierId: carrier.carrier_id,
        sourceItemId,
        holdKind,
        detail: { captureStatus: locator.captureStatus },
      });
    }
  }

  // A byte-identical original may support more than one source receipt. Walk the
  // source items as well as the deduplicated carriers so every derived snapshot is
  // retained even when several receipts share one original carrier.
  const carrierById = new Map(shadow.records.sourceCarriers.map((carrier) => [carrier.carrier_id, carrier]));
  for (const item of shadow.records.sourceItems) {
    const snapshotPath = item.normalized_payload?.snapshotReceipt?.snapshotPath;
    if (!item.carrier_id || !snapshotPath) continue;
    const carrier = carrierById.get(item.carrier_id);
    assert(carrier, `Source item ${item.source_item_id} refers to an unknown carrier.`);
    addObject(
      carrier,
      "derived_snapshot",
      { kind: "repository_path", path: snapshotPath },
      null,
      null,
      "application/json",
    );
    const captureStatus = item.normalized_payload?.snapshotReceipt?.status;
    for (const holdKind of statusHoldKinds(captureStatus)) {
      addHold({
        carrierId: item.carrier_id,
        sourceItemId: item.source_item_id,
        holdKind,
        detail: { captureStatus },
      });
    }
  }

  for (const item of shadow.records.sourceItems) {
    if (item.accounting_status !== "accounted_awaiting_source") continue;
    addHold({
      carrierId: item.carrier_id,
      sourceItemId: item.source_item_id,
      holdKind: "missing_original",
      detail: { accountingStatus: item.accounting_status },
    });
  }

  objects.sort((left, right) => left.object_key.localeCompare(right.object_key));
  holds.sort((left, right) => left.hold_id.localeCompare(right.hold_id));
  const files = new Map([
    ["objects.jsonl", objects],
    ["holds.jsonl", holds],
  ]);
  const fileReceipts = STAGE_FILE_ORDER.map((name) => {
    const body = jsonLines(files.get(name));
    return {
      name,
      records: files.get(name).length,
      bytes: Buffer.byteLength(body),
      sha256: sha256Text(body),
    };
  });
  const carriersWithStorage = new Set(objects.map((item) => item.carrier_id));
  const counts = {
    sourceCarriers: shadow.records.sourceCarriers.length,
    carriersWithStorage: carriersWithStorage.size,
    carriersWithoutStorage: shadow.records.sourceCarriers.length - carriersWithStorage.size,
    storedRepresentations: objects.length,
    uniqueObjects: new Set(objects.map((item) => item.object_key)).size,
    originals: objects.filter((item) => item.representation_kind === "original").length,
    derivedSnapshots: objects.filter((item) => item.representation_kind === "derived_snapshot").length,
    repositorySources: objects.filter((item) => item.representation_kind === "repository_source").length,
    holds: holds.length,
    missingOriginalHolds: holds.filter((item) => item.hold_kind === "missing_original").length,
    externalOnlyHolds: holds.filter((item) => item.hold_kind === "external_only").length,
    directoryManifestHolds: holds.filter((item) => item.hold_kind === "directory_requires_manifest").length,
    originalUnavailableHolds: holds.filter((item) => item.hold_kind === "original_not_locally_available").length,
    manualExtractionHolds: holds.filter((item) => item.hold_kind === "manual_extraction_required").length,
    transcriptRequiredHolds: holds.filter((item) => item.hold_kind === "transcript_required").length,
    quarantinedNeverExecuteHolds: holds.filter((item) => item.hold_kind === "quarantined_never_execute").length,
    totalBytes: objects.reduce((sum, item) => sum + item.byte_count, 0),
    staffPublicationDecisions: 0,
  };
  const stageSet = {
    stageId: SOURCE_OBJECT_STAGE_ID,
    mode: "private_objects_and_explicit_holds",
    shadowStageSetSha256: shadow.manifest.stageSetSha256,
    counts,
    files: fileReceipts,
    bucketSetting: "PAC_SUPABASE_BUCKET",
    privateOnly: true,
    publicationDecisionRows: 0,
  };
  const manifest = {
    schemaVersion: "1.0.0",
    ...stageSet,
    stageSetSha256: canonicalSha256(stageSet),
    safety: {
      htmlHandling: "hash_and_store_bytes_only_never_execute",
      databaseRecordOrder: "after_successful_upload_and_download_verification",
      exactReplay: "allowed_only_when_sha256_and_byte_count_match",
      mismatch: "hard_conflict",
    },
  };

  assert(counts.sourceCarriers === 44, `Expected 44 source carriers; found ${counts.sourceCarriers}.`);
  assert(counts.missingOriginalHolds === 3, "All three known missing originals must remain explicit holds.");
  assert(counts.derivedSnapshots === 34, "All 34 repository snapshots must have private-object placements.");
  assert(counts.uniqueObjects <= counts.storedRepresentations, "Unique object accounting exceeds its placements.");
  assert(counts.quarantinedNeverExecuteHolds === 1, "The quarantined HTML must remain an explicit never-execute hold.");
  assert(counts.staffPublicationDecisions === 0, "Source-object staging must never publish content.");
  return { manifest, objects, holds, files };
}

export function writeSourceObjectStage(stage, outputDirectory = DEFAULT_SOURCE_OBJECT_STAGE_DIRECTORY) {
  const output = resolve(outputDirectory);
  const fromRoot = relative(REPOSITORY_ROOT, output);
  assert(
    fromRoot === ".pac-object-staging" || fromRoot.startsWith(`.pac-object-staging${sep}`),
    "Source-object output must stay inside .pac-object-staging.",
  );
  mkdirSync(output, { recursive: true });
  for (const name of STAGE_FILE_ORDER) {
    writeFileSync(resolve(output, name), jsonLines(stage.files.get(name)), "utf8");
  }
  writeFileSync(resolve(output, "manifest.json"), `${JSON.stringify(stage.manifest, null, 2)}\n`, "utf8");
  return output;
}

export function validateSourceObjectStage(outputDirectory = DEFAULT_SOURCE_OBJECT_STAGE_DIRECTORY) {
  const output = resolve(outputDirectory);
  const manifestPath = resolve(output, "manifest.json");
  assert(existsSync(manifestPath), "The source-object stage manifest is missing.");
  const manifest = readJson(manifestPath);
  const expectedSetHash = canonicalSha256({
    stageId: manifest.stageId,
    mode: manifest.mode,
    shadowStageSetSha256: manifest.shadowStageSetSha256,
    counts: manifest.counts,
    files: manifest.files,
    bucketSetting: manifest.bucketSetting,
    privateOnly: manifest.privateOnly,
    publicationDecisionRows: manifest.publicationDecisionRows,
  });
  assert(expectedSetHash === manifest.stageSetSha256, "The source-object stage set hash is invalid.");
  const records = {};
  for (const receipt of manifest.files) {
    assert(STAGE_FILE_ORDER.includes(receipt.name), `Unexpected source-object stage file ${receipt.name}.`);
    const filePath = resolve(output, receipt.name);
    assert(existsSync(filePath), `Source-object stage file ${receipt.name} is missing.`);
    const body = readFileSync(filePath, "utf8");
    assert(sha256Text(body) === receipt.sha256, `${receipt.name} SHA-256 changed.`);
    assert(Buffer.byteLength(body) === receipt.bytes, `${receipt.name} byte count changed.`);
    records[receipt.name] = readJsonLines(filePath);
    assert(records[receipt.name].length === receipt.records, `${receipt.name} record count changed.`);
  }
  assert(manifest.privateOnly === true, "Source objects must remain private.");
  assert(manifest.publicationDecisionRows === 0, "A source-object stage cannot contain publication decisions.");
  const objects = records["objects.jsonl"];
  const holds = records["holds.jsonl"];
  assert(objects.length === manifest.counts.storedRepresentations, "Stored-representation count does not match the stage.");
  assert(holds.length === manifest.counts.holds, "Hold count does not match the stage.");
  assert(new Set(objects.map((item) => item.object_key)).size === manifest.counts.uniqueObjects, "Unique-object count does not match the stage.");
  assert(objects.reduce((sum, item) => sum + item.byte_count, 0) === manifest.counts.totalBytes, "Stored byte count does not match the stage.");
  assert(holds.filter((item) => item.hold_kind === "missing_original").length === 3, "Known missing originals are not fully held.");
  assert(holds.filter((item) => item.hold_kind === "quarantined_never_execute").length === 1, "Quarantined HTML accounting changed.");
  assert(objects.every((item) => !canonicalJson(item).match(/[A-Za-z]:\\\\/)), "A stage contains an absolute local path.");
  const objectKeys = new Map();
  for (const object of objects) {
    assert(/^[0-9A-F]{64}$/.test(object.sha256), `Object ${object.object_key} has an invalid SHA-256.`);
    assert(Number.isSafeInteger(object.byte_count) && object.byte_count >= 0, `Object ${object.object_key} has an invalid byte count.`);
    assert(
      object.object_key.includes(`/sha256/${object.sha256.slice(0, 2).toLowerCase()}/${object.sha256.toLowerCase()}/`),
      `Object ${object.object_key} is not content-addressed.`,
    );
    assert(
      ["original", "derived_snapshot", "repository_source"].includes(object.representation_kind),
      `Object ${object.object_key} has an invalid representation kind.`,
    );
    assert(
      ["resolver_path", "resolver_attachment", "repository_path"].includes(object.local_locator?.kind),
      `Object ${object.object_key} has an invalid local locator.`,
    );
    const previous = objectKeys.get(object.object_key);
    const storedIdentity = { sha256: object.sha256, byte_count: object.byte_count, media_type: object.media_type };
    if (previous) {
      assert(sameStoredObject(previous, storedIdentity), `Hard conflict: ${object.object_key} identifies different bytes.`);
    } else {
      objectKeys.set(object.object_key, storedIdentity);
    }
  }
  const resolver = resolverDocument();
  for (const object of objects) resolveStagedObjectPath(object, resolver);
  return { manifest, objects, holds };
}

function sameStoredObject(left, right) {
  return canonicalSha256(left) === canonicalSha256(right);
}

export function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex").toUpperCase();
}
