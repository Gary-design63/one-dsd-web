import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const ledgerPath = resolve(root, "data/source-ledger/owner-supplied-inputs.json");
const seedManifestPath = resolve(root, "data/source-ledger/current-seed-2026-09-04.json");
const resolverPath = resolve(root, "data/source-ledger/local-resolver.local.json");
const requiredReviewDimensions = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
  "rights_and_consent",
];

function fail(message) {
  throw new Error(message);
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

function canonicalize(value) {
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

function canonicalSha256(value) {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex").toUpperCase();
}

if (!existsSync(ledgerPath)) fail("The source ledger is missing.");
const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
const localResolver = existsSync(resolverPath) ? JSON.parse(readFileSync(resolverPath, "utf8")) : null;
const sources = ledger.sources ?? [];

if (ledger.counts?.ledgerEntries !== sources.length) {
  fail(`Ledger count says ${ledger.counts?.ledgerEntries}; found ${sources.length}.`);
}

const byId = new Map();
for (const source of sources) {
  if (!source.sourceId) fail("A ledger entry has no sourceId.");
  if (byId.has(source.sourceId)) fail(`Duplicate sourceId: ${source.sourceId}`);
  byId.set(source.sourceId, source);

  if (!String(source.ownerApproval ?? "").startsWith("owner_approved")) {
    fail(`${source.sourceId} does not preserve the owner's ingestion decision.`);
  }
  for (const dimension of requiredReviewDimensions) {
    if (!source.review?.[dimension]) fail(`${source.sourceId} has no ${dimension} review state.`);
  }
  if (source.accountingStatus === "accounted_awaiting_source" && source.pipelineStatus !== "blocked_missing_bytes") {
    fail(`${source.sourceId} is missing but is not blocked from byte import.`);
  }
}

for (const source of sources) {
  if (source.duplicateOf) {
    const original = byId.get(source.duplicateOf);
    if (!original) fail(`${source.sourceId} points to missing duplicate target ${source.duplicateOf}.`);
    if (source.evidence?.sha256 !== original.evidence?.sha256) {
      fail(`${source.sourceId} is marked byte-identical but its SHA-256 differs.`);
    }
  }
  if (source.duplicatePayloadOf && !byId.has(source.duplicatePayloadOf)) {
    fail(`${source.sourceId} points to missing payload target ${source.duplicatePayloadOf}.`);
  }
}

const seed = byId.get("current-seed-collection-2026-09-04");
const seedIds = seed?.evidence?.stableIds ?? [];
if (seedIds.length !== 25 || new Set(seedIds).size !== 25) {
  fail("The permanent seed collection must contain exactly 25 unique stable IDs.");
}
if (!existsSync(seedManifestPath)) fail("The permanent seed payload manifest is missing.");
const seedManifest = JSON.parse(readFileSync(seedManifestPath, "utf8"));
if (seedManifest.count !== 25 || seedManifest.items?.length !== 25) {
  fail("The permanent seed payload manifest must contain exactly 25 items.");
}
const manifestIds = seedManifest.items.map((item) => item.id);
if (new Set(manifestIds).size !== 25 || seedIds.some((id) => !manifestIds.includes(id))) {
  fail("The source ledger and permanent seed payload manifest do not contain the same 25 IDs.");
}
for (const item of seedManifest.items) {
  const actualHash = canonicalSha256(item.payload);
  if (actualHash !== item.payloadSha256) fail(`The preserved seed payload changed for ${item.id}.`);
}

for (const memberId of ledger.identityCorrection?.memberSourceIds ?? []) {
  if (!byId.has(memberId)) fail(`The IDI orientation sequence points to missing source ${memberId}.`);
}

const missingCount = sources.filter((source) => source.accountingStatus === "accounted_awaiting_source").length;
if (missingCount !== ledger.counts?.knownMissingOriginals) {
  fail(`Missing-source count says ${ledger.counts?.knownMissingOriginals}; found ${missingCount}.`);
}

let verifiedLocalFiles = 0;
if (localResolver) {
  for (const source of sources) {
    let candidate = null;
    if (source.locator?.kind === "local_logical") candidate = localResolver.paths?.[source.locator.resolverKey];
    if (source.locator?.kind === "codex_attachment") candidate = localResolver.attachments?.[source.sourceId];
    if (!candidate) continue;

    const paths = Array.isArray(candidate) ? candidate : [candidate];
    if (!paths.some((path) => existsSync(path))) fail(`No local path exists for ${source.sourceId}.`);
    if (!source.evidence?.sha256) continue;

    const filePath = paths.find((path) => existsSync(path) && statSync(path).isFile());
    if (!filePath) fail(`A file hash was recorded for ${source.sourceId}, but its resolver does not point to a file.`);
    const actualBytes = statSync(filePath).size;
    if (source.evidence.bytes !== undefined && actualBytes !== source.evidence.bytes) {
      fail(`${source.sourceId} byte count changed: expected ${source.evidence.bytes}; found ${actualBytes}.`);
    }
    const actualHash = sha256(filePath);
    if (actualHash !== String(source.evidence.sha256).toUpperCase()) {
      fail(`${source.sourceId} SHA-256 changed: expected ${source.evidence.sha256}; found ${actualHash}.`);
    }
    verifiedLocalFiles += 1;
  }
}

const counts = {
  entries: sources.length,
  ownerApproved: sources.filter((source) => String(source.ownerApproval).startsWith("owner_approved")).length,
  missingOriginals: missingCount,
  drivePresentations: sources.filter((source) => source.locator?.kind === "google_drive").length,
  permanentSeedItems: seedIds.length,
  localFilesHashVerified: verifiedLocalFiles,
};

console.log(JSON.stringify({ ok: true, counts, localResolverUsed: Boolean(localResolver) }, null, 2));
