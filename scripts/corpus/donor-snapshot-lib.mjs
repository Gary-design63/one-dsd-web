import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";

import {
  canonicalJson,
  canonicalSha256,
  REPOSITORY_ROOT,
  sha256File,
} from "./shadow-import-lib.mjs";

export const DONOR_SNAPSHOT_DIRECTORY = resolve(
  REPOSITORY_ROOT,
  "data/source-snapshots/donor-library",
);

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function nonEmptyText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function compactText(values) {
  return values.flatMap((value) => {
    if (Array.isArray(value)) return compactText(value);
    const text = nonEmptyText(value);
    return text ? [text] : [];
  });
}

export function section(heading, paragraphs) {
  const cleaned = compactText(paragraphs);
  return cleaned.length ? { heading, paragraphs: cleaned } : null;
}

export function removeEmptySections(sections) {
  return sections.filter(Boolean);
}

export function snapshotRecord({
  assetKind,
  assetId,
  contentItemId,
  contentKind,
  title,
  sourceClass = "authored",
  donor,
  richOriginal,
  renderable,
}) {
  assert(nonEmptyText(assetKind), "A donor snapshot record has no asset kind.");
  assert(nonEmptyText(assetId), `A ${assetKind} snapshot record has no asset ID.`);
  assert(nonEmptyText(contentItemId), `Donor asset ${assetId} has no content item ID.`);
  assert(nonEmptyText(contentKind), `Donor asset ${assetId} has no content kind.`);
  assert(nonEmptyText(title), `Donor asset ${assetId} has no title.`);
  assert(["authored", "generated_curriculum"].includes(sourceClass), `Donor asset ${assetId} has an unknown source class ${sourceClass}.`);
  assert(donor?.commit && donor?.repository && donor?.entryPaths?.length, `Donor asset ${assetId} has no pinned source.`);
  assert(richOriginal && typeof richOriginal === "object", `Donor asset ${assetId} has no rich original.`);
  assert(renderable?.title && Array.isArray(renderable.sections), `Donor asset ${assetId} has no renderable adaptation.`);
  return {
    schemaVersion: "1.0.0",
    assetKind,
    assetId,
    contentItemId,
    contentKind,
    title: title.trim(),
    sourceClass,
    donor,
    ownerDirection: {
      ingestionApproval: "owner_approved_for_ingestion",
      contentPosture: "candidate_revision_with_pending_reviews",
      publicationAuthorization: "none",
    },
    richOriginal,
    renderable,
  };
}

export function validateSnapshotRecords(records, expectations = {}) {
  assert(Array.isArray(records), "Donor snapshot records must be an array.");
  if (expectations.count !== undefined) {
    assert(records.length === expectations.count, `Expected ${expectations.count} donor records; found ${records.length}.`);
  }
  const assetKeys = new Set();
  const contentIds = new Set();
  for (const record of records) {
    snapshotRecord(record);
    const assetKey = `${record.assetKind}:${record.assetId}`;
    assert(!assetKeys.has(assetKey), `Duplicate donor asset ${assetKey}.`);
    assert(!contentIds.has(record.contentItemId), `Duplicate donor content item ${record.contentItemId}.`);
    assetKeys.add(assetKey);
    contentIds.add(record.contentItemId);
    assert(
      canonicalSha256(record.richOriginal) === canonicalSha256(JSON.parse(canonicalJson(record.richOriginal))),
      `Donor asset ${assetKey} cannot be represented as canonical JSON.`,
    );
  }
  return records;
}

export function jsonLines(records) {
  return records.map((record) => canonicalJson(record)).join("\n") + (records.length ? "\n" : "");
}

export function writeSnapshotFile(records, fileName, outputDirectory = DONOR_SNAPSHOT_DIRECTORY) {
  assert(!fileName.includes("/") && !fileName.includes("\\") && fileName.endsWith(".jsonl"), `Unsafe snapshot file name ${fileName}.`);
  const output = resolve(outputDirectory);
  const fromRoot = relative(REPOSITORY_ROOT, output);
  const snapshotRoot = ["data", "source-snapshots", "donor-library"].join(sep);
  assert(
    fromRoot === snapshotRoot || fromRoot.startsWith(`${snapshotRoot}${sep}`),
    "Donor snapshots must stay inside data/source-snapshots/donor-library.",
  );
  const path = resolve(output, fileName);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, jsonLines(records), "utf8");
  return {
    path: relative(REPOSITORY_ROOT, path).replaceAll("\\", "/"),
    records: records.length,
    bytes: readFileSync(path).byteLength,
    sha256: sha256File(path),
  };
}

export function readSnapshotFile(path) {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`${path} line ${index + 1} is invalid JSON: ${error.message}`);
      }
    });
}
