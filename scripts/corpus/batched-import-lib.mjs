import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { StringDecoder } from "node:string_decoder";

import { canonicalSha256 } from "./shadow-import-lib.mjs";

export const DEFAULT_IMPORT_BATCH_SIZE = 500;
export const DEFAULT_IMPORT_BATCH_BYTES = 1024 * 1024;
export const IMPORTER_LOCK_KEY = "one-dhs-pac-corpus-import-v2";

const REQUIRED_STAGE_FILES = [
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

const OPTIONAL_STAGE_FILES = ["source_receipts.jsonl"];
const SUPPORTED_STAGE_FILES = new Set([...REQUIRED_STAGE_FILES, ...OPTIONAL_STAGE_FILES]);

export class HardConflict extends Error {
  constructor(businessId, detail) {
    super(`Hard conflict for ${businessId}: ${detail}`);
    this.businessId = businessId;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function positiveInteger(value, fallback, minimum, maximum, label) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${label} must be an integer from ${minimum} through ${maximum}.`);
  }
  return parsed;
}

export function importBatchOptions(environment = process.env) {
  return {
    maxRows: positiveInteger(
      environment.PAC_IMPORT_BATCH_SIZE,
      DEFAULT_IMPORT_BATCH_SIZE,
      25,
      2000,
      "PAC_IMPORT_BATCH_SIZE",
    ),
    maxBytes: positiveInteger(
      environment.PAC_IMPORT_BATCH_BYTES,
      DEFAULT_IMPORT_BATCH_BYTES,
      256 * 1024,
      8 * 1024 * 1024,
      "PAC_IMPORT_BATCH_BYTES",
    ),
  };
}

function normalizedTimestamp(value) {
  if (value === null || value === undefined) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return date.toISOString();
}

function picked(row, names, timestampNames = []) {
  const result = {};
  for (const name of names) {
    result[name] = timestampNames.includes(name) ? normalizedTimestamp(row[name]) : row[name];
  }
  return result;
}

function tupleKey(kind, values) {
  return `${kind}:${JSON.stringify(values)}`;
}

const specs = [
  {
    name: "source carriers",
    fileName: "source_carriers.jsonl",
    rowType: "carrier",
    insertedAction: "inserted",
    businessId: (row) => `carrier:${row.logical_key}`,
    sourceItemId: () => null,
    identityKeys: (row) => [tupleKey("carrier-id", [row.carrier_id]), tupleKey("carrier-key", [row.logical_key])],
    comparable: (row) => picked(row, [
      "carrier_id", "logical_key", "media_type", "original_name", "byte_count", "raw_blob_sha256",
      "storage_key", "external_locator", "captured_at", "captured_by",
    ], ["captured_at"]),
    conflictDetail: "the same carrier identity has different metadata or bytes",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          carrier_id uuid, logical_key text
        )
      )
      select carrier_id, logical_key, media_type, original_name,
        byte_count::double precision as byte_count, raw_blob_sha256, storage_key,
        external_locator, captured_at, captured_by
      from pac.source_carriers e
      where exists (
        select 1 from stage s
        where e.carrier_id = s.carrier_id or e.logical_key = s.logical_key
      )`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          carrier_id uuid, logical_key text, media_type text, original_name text,
          byte_count bigint, raw_blob_sha256 text, storage_key text,
          external_locator jsonb, captured_at timestamptz, captured_by text
        )
      )
      insert into pac.source_carriers (
        carrier_id, logical_key, media_type, original_name, byte_count,
        raw_blob_sha256, storage_key, external_locator, captured_at, captured_by
      )
      select carrier_id, logical_key, media_type, original_name, byte_count,
        raw_blob_sha256, storage_key, external_locator, captured_at, captured_by
      from stage`,
  },
  {
    name: "source items",
    fileName: "source_items.jsonl",
    rowType: "source-item",
    insertedAction: "inserted",
    businessId: (row) => `source-item:${row.source_item_id}`,
    sourceItemId: (row) => row.source_item_id,
    identityKeys: (row) => {
      const keys = [
        tupleKey("source-id", [row.source_item_id]),
        tupleKey("source-business-version", [row.source_business_id, row.source_version]),
      ];
      if (row.carrier_id !== null && row.source_pointer !== null) {
        keys.push(tupleKey("source-carrier-pointer-version", [row.carrier_id, row.source_pointer, row.source_version]));
      }
      return keys;
    },
    comparable: (row) => picked(row, [
      "source_item_id", "source_business_id", "carrier_id", "source_version", "source_pointer", "title",
      "normalized_payload", "normalized_item_sha256", "hash_algorithm", "hash_algorithm_version",
      "owner_approval_status", "accounting_status", "access_scope",
    ]),
    conflictDetail: "the same source ID or business version has different content",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          source_item_id text, source_business_id text, carrier_id uuid,
          source_version text, source_pointer text
        )
      )
      select source_item_id, source_business_id, carrier_id, source_version, source_pointer,
        title, normalized_payload, normalized_item_sha256, hash_algorithm,
        hash_algorithm_version, owner_approval_status, accounting_status, access_scope
      from pac.source_items e
      where exists (
        select 1 from stage s
        where e.source_item_id = s.source_item_id
          or (e.source_business_id = s.source_business_id and e.source_version = s.source_version)
          or (
            s.carrier_id is not null and s.source_pointer is not null
            and e.carrier_id = s.carrier_id and e.source_pointer = s.source_pointer
            and e.source_version = s.source_version
          )
      )`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          source_item_id text, source_business_id text, carrier_id uuid,
          source_version text, source_pointer text, title text, normalized_payload jsonb,
          normalized_item_sha256 text, hash_algorithm text, hash_algorithm_version text,
          owner_approval_status text, accounting_status text, access_scope text
        )
      )
      insert into pac.source_items (
        source_item_id, source_business_id, carrier_id, source_version, source_pointer,
        title, normalized_payload, normalized_item_sha256, hash_algorithm,
        hash_algorithm_version, owner_approval_status, accounting_status, access_scope,
        import_batch_id
      )
      select source_item_id, source_business_id, carrier_id, source_version, source_pointer,
        title, normalized_payload, normalized_item_sha256, hash_algorithm,
        hash_algorithm_version, owner_approval_status, accounting_status, access_scope,
        $2::uuid
      from stage`,
  },
  {
    name: "source receipts",
    fileName: "source_receipts.jsonl",
    optional: true,
    rowType: "source-receipt",
    insertedAction: "inserted",
    businessId: (row) => `source-receipt:${row.receipt_id}`,
    sourceItemId: (row) => row.source_item_id,
    identityKeys: (row) => [tupleKey("receipt-id", [row.receipt_id]), tupleKey("receipt-source", [row.source_item_id])],
    comparable: (row) => picked(row, [
      "receipt_id", "source_item_id", "disposition", "canonical_family_id", "canonical_item_id",
      "decision_payload", "decision_sha256", "decided_at", "decided_by", "release_commit",
      "release_manifest_sha256",
    ], ["decided_at"]),
    conflictDetail: "the same receipt or source has a different disposition",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(receipt_id text, source_item_id text)
      )
      select receipt_id, source_item_id, disposition, canonical_family_id,
        canonical_item_id, decision_payload, decision_sha256, decided_at,
        decided_by, release_commit, release_manifest_sha256
      from pac.source_receipts e
      where exists (
        select 1 from stage s
        where e.receipt_id = s.receipt_id or e.source_item_id = s.source_item_id
      )`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          receipt_id text, source_item_id text, disposition text, canonical_family_id text,
          canonical_item_id text, decision_payload jsonb, decision_sha256 text,
          decided_at timestamptz, decided_by text, release_commit text,
          release_manifest_sha256 text
        )
      )
      insert into pac.source_receipts (
        receipt_id, source_item_id, disposition, canonical_family_id, canonical_item_id,
        decision_payload, decision_sha256, decided_at, decided_by, release_commit,
        release_manifest_sha256
      )
      select receipt_id, source_item_id, disposition, canonical_family_id, canonical_item_id,
        decision_payload, decision_sha256, decided_at, decided_by, release_commit,
        release_manifest_sha256
      from stage`,
  },
  {
    name: "source reviews",
    fileName: "source_review_records.jsonl",
    rowType: "source-review",
    insertedAction: "inserted",
    businessId: (row) => `source-review:${row.source_review_id}`,
    sourceItemId: (row) => row.source_item_id,
    identityKeys: (row) => [tupleKey("source-review-id", [row.source_review_id])],
    comparable: (row) => picked(row, [
      "source_review_id", "source_item_id", "dimension", "status", "reviewer_role",
      "reviewer_id", "findings", "recorded_at", "supersedes_source_review_id",
    ], ["recorded_at"]),
    conflictDetail: "the same review ID has different findings",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(source_review_id uuid)
      )
      select source_review_id, source_item_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_source_review_id
      from pac.source_review_records e
      where exists (select 1 from stage s where e.source_review_id = s.source_review_id)`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          source_review_id uuid, source_item_id text, dimension text, status text,
          reviewer_role text, reviewer_id text, findings jsonb, recorded_at timestamptz,
          supersedes_source_review_id uuid
        )
      )
      insert into pac.source_review_records (
        source_review_id, source_item_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_source_review_id, import_batch_id
      )
      select source_review_id, source_item_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_source_review_id, $2::uuid
      from stage`,
  },
  {
    name: "content collections",
    fileName: "content_collections.jsonl",
    rowType: "collection",
    insertedAction: "inserted",
    businessId: (row) => `collection:${row.collection_id}`,
    sourceItemId: () => null,
    identityKeys: (row) => [tupleKey("collection-id", [row.collection_id])],
    comparable: (row) => picked(row, [
      "collection_id", "name", "purpose", "preservation_rule", "created_at", "created_by",
    ], ["created_at"]),
    conflictDetail: "the same collection ID has different content",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(collection_id text)
      )
      select collection_id, name, purpose, preservation_rule, created_at, created_by
      from pac.content_collections e
      where exists (select 1 from stage s where e.collection_id = s.collection_id)`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          collection_id text, name text, purpose text, preservation_rule text,
          created_at timestamptz, created_by text
        )
      )
      insert into pac.content_collections (
        collection_id, name, purpose, preservation_rule, created_at, created_by
      )
      select collection_id, name, purpose, preservation_rule, created_at, created_by
      from stage`,
  },
  {
    name: "content items",
    fileName: "content_items.jsonl",
    rowType: "content-item",
    insertedAction: "inserted",
    businessId: (row) => `content-item:${row.content_item_id}`,
    sourceItemId: () => null,
    identityKeys: (row) => [tupleKey("content-item-id", [row.content_item_id])],
    comparable: (row) => picked(row, [
      "content_item_id", "content_kind", "default_scope_id", "staff_label", "restricted",
      "created_at", "created_by", "retired_at", "retired_by",
    ], ["created_at", "retired_at"]),
    conflictDetail: "the same content ID has different identity metadata",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(content_item_id text)
      )
      select content_item_id, content_kind, default_scope_id, staff_label, restricted,
        created_at, created_by, retired_at, retired_by
      from pac.content_items e
      where exists (select 1 from stage s where e.content_item_id = s.content_item_id)`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          content_item_id text, content_kind text, default_scope_id text, staff_label text,
          restricted boolean, created_at timestamptz, created_by text,
          retired_at timestamptz, retired_by text
        )
      )
      insert into pac.content_items (
        content_item_id, content_kind, default_scope_id, staff_label, restricted,
        created_at, created_by, retired_at, retired_by
      )
      select content_item_id, content_kind, default_scope_id, staff_label, restricted,
        created_at, created_by, retired_at, retired_by
      from stage`,
  },
  {
    name: "content revisions",
    fileName: "content_revisions.jsonl",
    rowType: "content-revision",
    insertedAction: "inserted",
    businessId: (row) => `content-revision:${row.content_item_id}@${row.revision_number}`,
    sourceItemId: () => null,
    identityKeys: (row) => [
      tupleKey("revision-id", [row.revision_id]),
      tupleKey("revision-number", [row.content_item_id, row.revision_number]),
    ],
    comparable: (row) => picked(row, [
      "revision_id", "content_item_id", "revision_number", "canonical_payload", "change_summary",
      "required_review_dimensions", "created_at", "created_by", "based_on_revision_id",
    ], ["created_at"]),
    conflictDetail: "the same revision ID or number has different content",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          revision_id uuid, content_item_id text, revision_number integer
        )
      )
      select revision_id, content_item_id, revision_number, canonical_payload,
        change_summary, required_review_dimensions, created_at, created_by,
        based_on_revision_id
      from pac.content_revisions e
      where exists (
        select 1 from stage s
        where e.revision_id = s.revision_id
          or (e.content_item_id = s.content_item_id and e.revision_number = s.revision_number)
      )`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          revision_id uuid, content_item_id text, revision_number integer,
          canonical_payload jsonb, change_summary text, required_review_dimensions text[],
          created_at timestamptz, created_by text, based_on_revision_id uuid
        )
      )
      insert into pac.content_revisions (
        revision_id, content_item_id, revision_number, canonical_payload, change_summary,
        required_review_dimensions, created_at, created_by, based_on_revision_id, import_batch_id
      )
      select revision_id, content_item_id, revision_number, canonical_payload, change_summary,
        required_review_dimensions, created_at, created_by, based_on_revision_id, $2::uuid
      from stage`,
  },
  {
    name: "revision sources",
    fileName: "revision_sources.jsonl",
    rowType: "revision-source",
    insertedAction: "linked",
    businessId: (row) => `revision-source:${row.revision_id}:${row.source_item_id}`,
    sourceItemId: (row) => row.source_item_id,
    identityKeys: (row) => [tupleKey("revision-source", [row.revision_id, row.source_item_id, row.relationship])],
    comparable: (row) => picked(row, ["revision_id", "source_item_id", "relationship", "note"]),
    conflictDetail: "the same link has a different note",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          revision_id uuid, source_item_id text, relationship text
        )
      )
      select revision_id, source_item_id, relationship, note
      from pac.revision_sources e
      where exists (
        select 1 from stage s
        where e.revision_id = s.revision_id and e.source_item_id = s.source_item_id
          and e.relationship = s.relationship
      )`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          revision_id uuid, source_item_id text, relationship text, note text
        )
      )
      insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
      select revision_id, source_item_id, relationship, note from stage`,
  },
  {
    name: "content reviews",
    fileName: "review_records.jsonl",
    rowType: "content-review",
    insertedAction: "inserted",
    businessId: (row) => `content-review:${row.review_id}`,
    sourceItemId: () => null,
    identityKeys: (row) => [tupleKey("content-review-id", [row.review_id])],
    comparable: (row) => picked(row, [
      "review_id", "revision_id", "dimension", "status", "reviewer_role", "reviewer_id",
      "findings", "recorded_at", "supersedes_review_id",
    ], ["recorded_at"]),
    conflictDetail: "the same review ID has different findings",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(review_id uuid)
      )
      select review_id, revision_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_review_id
      from pac.review_records e
      where exists (select 1 from stage s where e.review_id = s.review_id)`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          review_id uuid, revision_id uuid, dimension text, status text,
          reviewer_role text, reviewer_id text, findings jsonb, recorded_at timestamptz,
          supersedes_review_id uuid
        )
      )
      insert into pac.review_records (
        review_id, revision_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_review_id
      )
      select review_id, revision_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_review_id
      from stage`,
  },
  {
    name: "collection memberships",
    fileName: "collection_membership_decisions.jsonl",
    rowType: "membership",
    insertedAction: "linked",
    businessId: (row) => `membership:${row.collection_id}:${row.content_item_id}`,
    sourceItemId: () => null,
    identityKeys: (row) => [tupleKey("membership", [row.collection_id, row.content_item_id])],
    comparable: (row) => picked(row, [
      "collection_id", "content_item_id", "action", "decided_at", "decided_by", "reason",
    ], ["decided_at"]),
    conflictDetail: "the latest collection decision has different content",
    selectSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(collection_id text, content_item_id text)
      ), wanted as (
        select distinct collection_id, content_item_id from stage
      )
      select distinct on (e.collection_id, e.content_item_id)
        e.collection_id, e.content_item_id, e.action, e.decided_at, e.decided_by, e.reason
      from pac.collection_membership_decisions e
      join wanted w using (collection_id, content_item_id)
      order by e.collection_id, e.content_item_id, e.decision_id desc`,
    insertSql: `
      with stage as (
        select * from jsonb_to_recordset($1::jsonb) as s(
          collection_id text, content_item_id text, action text, decided_at timestamptz,
          decided_by text, reason text
        )
      )
      insert into pac.collection_membership_decisions (
        collection_id, content_item_id, action, decided_at, decided_by, reason, ingest_run_id
      )
      select collection_id, content_item_id, action, decided_at, decided_by, reason, $2::uuid
      from stage`,
  },
];

export const IMPORT_SPECS = Object.freeze(specs);

const INGEST_ENTRY_SQL = `
  with entries as (
    select * from jsonb_to_recordset($1::jsonb) as e(
      source_item_id text, business_id text, action text,
      expected_sha256 text, actual_sha256 text, row_type text
    )
  )
  insert into pac.ingest_entries (
    ingest_run_id, source_item_id, business_id, action,
    expected_sha256, actual_sha256, detail
  )
  select $2::uuid, source_item_id, business_id, action,
    expected_sha256, actual_sha256, jsonb_build_object('rowType', row_type)
  from entries`;

function stageSetForHash(manifest) {
  return {
    stageId: manifest.stageId,
    mode: manifest.mode,
    inputs: manifest.inputs,
    counts: manifest.counts,
    files: manifest.files,
    ownerApprovalDoesNotPublish: manifest.ownerApprovalDoesNotPublish,
    publicationDecisionRows: manifest.publicationDecisionRows,
    protectedLogoSha256: manifest.protectedLogoSha256,
  };
}

export async function validateJsonLinesFile(filePath, receipt) {
  assert(existsSync(filePath), `Shadow file is missing: ${receipt.name}`);
  const input = createReadStream(filePath);
  const hash = createHash("sha256");
  const decoder = new StringDecoder("utf8");
  let carry = "";
  let bytes = 0;
  let records = 0;
  let physicalLine = 0;

  const parseLine = (line) => {
    physicalLine += 1;
    const normalized = line.endsWith("\r") ? line.slice(0, -1) : line;
    if (!normalized) return;
    try {
      JSON.parse(normalized);
    } catch (error) {
      throw new Error(`${receipt.name} line ${physicalLine} is invalid JSON: ${error.message}`);
    }
    records += 1;
  };

  for await (const chunk of input) {
    hash.update(chunk);
    bytes += chunk.length;
    const text = carry + decoder.write(chunk);
    const lines = text.split("\n");
    carry = lines.pop() ?? "";
    for (const line of lines) parseLine(line);
  }
  carry += decoder.end();
  if (carry) parseLine(carry);

  const sha256 = hash.digest("hex").toUpperCase();
  assert(sha256 === receipt.sha256, `${receipt.name} SHA-256 changed.`);
  assert(bytes === receipt.bytes, `${receipt.name} byte count changed.`);
  assert(records === receipt.records, `${receipt.name} record count changed.`);
  return { records, bytes, sha256 };
}

export async function validateStageDirectoryStreaming(stageDirectory) {
  const output = resolve(stageDirectory);
  const manifestPath = resolve(output, "manifest.json");
  assert(existsSync(manifestPath), `Shadow manifest is missing: ${manifestPath}`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert(canonicalSha256(stageSetForHash(manifest)) === manifest.stageSetSha256, "Shadow manifest set hash is invalid.");
  assert(Array.isArray(manifest.files), "Shadow manifest files are missing.");

  const names = new Set();
  for (const receipt of manifest.files) {
    assert(!names.has(receipt.name), `Shadow manifest repeats ${receipt.name}.`);
    assert(SUPPORTED_STAGE_FILES.has(receipt.name), `Shadow importer does not support ${receipt.name}.`);
    names.add(receipt.name);
    await validateJsonLinesFile(resolve(output, receipt.name), receipt);
  }
  for (const required of REQUIRED_STAGE_FILES) {
    assert(names.has(required), `Shadow manifest is missing ${required}.`);
  }
  const publicationReceipt = manifest.files.find((entry) => entry.name === "publication_decisions.jsonl");
  assert(publicationReceipt?.records === 0, "Corpus stage contains publication decisions and cannot be applied.");
  assert(manifest.counts?.staffPublicationDecisions === 0, "Shadow stage contains a staff publication decision.");
  return manifest;
}

async function* readLfDelimitedLines(filePath) {
  const input = createReadStream(filePath);
  const decoder = new StringDecoder("utf8");
  let carry = "";
  for await (const chunk of input) {
    const text = carry + decoder.write(chunk);
    const lines = text.split("\n");
    carry = lines.pop() ?? "";
    for (const line of lines) {
      yield line.endsWith("\r") ? line.slice(0, -1) : line;
    }
  }
  carry += decoder.end();
  if (carry) yield carry.endsWith("\r") ? carry.slice(0, -1) : carry;
}

export async function* readJsonLineBatches(filePath, options = {}) {
  const maxRows = options.maxRows ?? DEFAULT_IMPORT_BATCH_SIZE;
  const maxBytes = options.maxBytes ?? DEFAULT_IMPORT_BATCH_BYTES;
  let rows = [];
  let bytes = 0;
  let lineNumber = 0;

  // Some approved source text contains Unicode line separator U+2028 inside
  // JSON strings, so stage records must be split only on the JSONL LF byte.
  for await (const line of readLfDelimitedLines(filePath)) {
    lineNumber += 1;
    if (!line) continue;
    const lineBytes = Buffer.byteLength(line) + 1;
    if (rows.length && (rows.length >= maxRows || bytes + lineBytes > maxBytes)) {
      yield { rows, bytes };
      rows = [];
      bytes = 0;
    }
    try {
      rows.push(JSON.parse(line));
    } catch (error) {
      throw new Error(`${filePath} line ${lineNumber} is invalid JSON: ${error.message}`);
    }
    bytes += lineBytes;
  }
  if (rows.length) yield { rows, bytes };
}

function indexExisting(spec, existing) {
  const index = new Map();
  for (const row of existing) {
    for (const key of spec.identityKeys(row)) {
      const matches = index.get(key) ?? [];
      matches.push(row);
      index.set(key, matches);
    }
  }
  return index;
}

function findMatches(spec, row, existingIndex) {
  const matches = new Set();
  for (const key of spec.identityKeys(row)) {
    for (const match of existingIndex.get(key) ?? []) matches.add(match);
  }
  return [...matches];
}

function checkStageIdentity(seenIdentities, spec, row) {
  const rowHash = canonicalSha256(spec.comparable(row));
  for (const key of spec.identityKeys(row)) {
    const previous = seenIdentities.get(key);
    if (previous) {
      throw new HardConflict(
        spec.businessId(row),
        previous === rowHash
          ? `the stage repeats identity ${key}`
          : `the stage assigns different content to identity ${key}`,
      );
    }
    seenIdentities.set(key, rowHash);
  }
}

export async function processImportBatch({ tx, runId, spec, rows, counts, metrics, seenIdentities }) {
  for (const row of rows) checkStageIdentity(seenIdentities, spec, row);

  metrics.queryCount += 1;
  const existing = await tx.unsafe(spec.selectSql, [rows]);
  const existingIndex = indexExisting(spec, existing);
  const missing = [];
  const entries = [];

  for (const row of rows) {
    const matches = findMatches(spec, row, existingIndex);
    let action;
    if (!matches.length) {
      missing.push(row);
      action = spec.insertedAction;
      counts.inserted += 1;
    } else {
      if (matches.length !== 1 || canonicalSha256(spec.comparable(row)) !== canonicalSha256(spec.comparable(matches[0]))) {
        throw new HardConflict(spec.businessId(row), spec.conflictDetail);
      }
      action = "exact_replay";
      counts.exactReplay += 1;
    }
    const hash = canonicalSha256(row);
    entries.push({
      source_item_id: spec.sourceItemId(row),
      business_id: spec.businessId(row),
      action,
      expected_sha256: hash,
      actual_sha256: hash,
      row_type: spec.rowType,
    });
  }

  if (missing.length) {
    metrics.queryCount += 1;
    const parameters = spec.insertSql.includes("$2") ? [missing, runId] : [missing];
    const inserted = await tx.unsafe(spec.insertSql, parameters);
    if (Number(inserted.count) !== missing.length) {
      throw new Error(`${spec.name} batch inserted ${inserted.count} rows; ${missing.length} were required.`);
    }
  }

  metrics.queryCount += 1;
  const recorded = await tx.unsafe(INGEST_ENTRY_SQL, [entries, runId]);
  if (Number(recorded.count) !== rows.length) {
    throw new Error(`${spec.name} batch recorded ${recorded.count} receipts; ${rows.length} were required.`);
  }
  metrics.batches += 1;
  metrics.maxBatchRows = Math.max(metrics.maxBatchRows, rows.length);
  metrics.maxBatchBytes = Math.max(metrics.maxBatchBytes, Buffer.byteLength(JSON.stringify(rows)));
}

export function queryCountComparison(rowCount, batchCount, fixedQueries = 7) {
  const legacyMinimum = rowCount * 2 + fixedQueries;
  const legacyAllInsert = rowCount * 3 + fixedQueries;
  const batchedMaximum = batchCount * 3 + fixedQueries;
  return {
    legacyMinimum,
    legacyAllInsert,
    batchedMaximum,
    reductionVersusLegacyMinimum: legacyMinimum
      ? 1 - batchedMaximum / legacyMinimum
      : 0,
  };
}

export function importerVersionFor(manifest) {
  return manifest.mode === "canonical_projection_held"
    ? "canonical-projection-v2-batched"
    : "shadow-import-v2-batched";
}

export async function loadStageRowsBatched({ tx, runId, stageDirectory, manifest, batchOptions }) {
  const counts = {
    inserted: 0,
    exactReplay: 0,
    stageRows: manifest.files.reduce((sum, file) => sum + file.records, 0),
  };
  const metrics = {
    batches: 0,
    queryCount: 0,
    maxBatchRows: 0,
    maxBatchBytes: 0,
  };
  let loadedRows = 0;

  for (const spec of IMPORT_SPECS) {
    const receipt = manifest.files.find((entry) => entry.name === spec.fileName);
    if (!receipt) {
      if (spec.optional) continue;
      throw new Error(`Shadow manifest is missing ${spec.fileName}.`);
    }
    const seenIdentities = new Map();
    for await (const batch of readJsonLineBatches(resolve(stageDirectory, spec.fileName), batchOptions)) {
      await processImportBatch({
        tx,
        runId,
        spec,
        rows: batch.rows,
        counts,
        metrics,
        seenIdentities,
      });
      loadedRows += batch.rows.length;
    }
    if (seenIdentities.size && receipt.records === 0) {
      throw new Error(`${spec.fileName} loaded rows despite a zero-record receipt.`);
    }
  }

  if (loadedRows !== counts.stageRows) {
    throw new Error(`Loaded ${loadedRows} stage rows; manifest requires ${counts.stageRows}.`);
  }
  if (counts.inserted + counts.exactReplay !== counts.stageRows) {
    throw new Error(
      `Import accounting recorded ${counts.inserted + counts.exactReplay} rows; the validated stage contains ${counts.stageRows}.`,
    );
  }
  return { counts, metrics };
}

