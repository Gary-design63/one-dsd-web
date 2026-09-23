#!/usr/bin/env node

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  canonicalSha256,
  deterministicUuid,
} from "./shadow-import-lib.mjs";
import {
  DEFAULT_SOURCE_OBJECT_STAGE_DIRECTORY,
  resolveStagedObjectPath,
  safeOperationalError,
  sha256Bytes,
  validateSourceObjectStage,
} from "./source-object-stage-lib.mjs";
import { readFileSync } from "node:fs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function databaseOptions(url) {
  const configured = (process.env.PAC_DATABASE_SSL ?? "").toLowerCase();
  if (configured === "disable" || configured === "false") return { ssl: false };
  if (configured === "require" || configured === "true") return { ssl: "require" };
  const hostname = new URL(url).hostname;
  return { ssl: ["localhost", "127.0.0.1", "::1"].includes(hostname) ? false : "require" };
}

function storageUrl(baseUrl, route, bucket, objectKey = null) {
  const root = String(baseUrl).replace(/\/+$/, "");
  const encodedBucket = encodeURIComponent(bucket);
  const encodedKey = objectKey
    ? `/${objectKey.split("/").map((part) => encodeURIComponent(part)).join("/")}`
    : "";
  return `${root}/storage/v1/${route}/${encodedBucket}${encodedKey}`;
}

function storageHeaders(secretKey, additional = {}) {
  return {
    apikey: secretKey,
    authorization: `Bearer ${secretKey}`,
    ...additional,
  };
}

async function storageFetch(url, options) {
  let failure;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(45_000) });
      if (![429, 502, 503, 504].includes(response.status) || attempt === 2) return response;
      await response.body?.cancel();
    } catch (error) {
      failure = error;
      if (attempt === 2) throw failure;
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
  }
  throw failure ?? new Error("Private storage is temporarily unavailable.");
}

function verifyBytes(bytes, object, label) {
  const actualBytes = bytes.byteLength;
  const actualSha256 = sha256Bytes(bytes);
  if (actualBytes !== object.byte_count || actualSha256 !== object.sha256) {
    throw new Error(
      `Hard conflict: ${label} for ${object.object_key} has SHA-256 or byte-count drift.`,
    );
  }
}

async function downloadStoredObject({ baseUrl, bucket, secretKey, object, fetchImpl }) {
  const response = await fetchImpl(
    storageUrl(baseUrl, "object/authenticated", bucket, object.object_key),
    { method: "GET", headers: storageHeaders(secretKey), cache: "no-store" },
  );
  if (response.status === 404) return null;
  // Storage may wrap NoSuchKey in HTTP 400. Only its explicit missing-object
  // response permits creation; authentication and other errors still stop.
  if (response.status === 400) {
    const error = await response.json().catch(() => null);
    if (String(error?.statusCode) === "404" && error?.code === "NoSuchKey") return null;
  }
  if (!response.ok) {
    throw new Error(`Private object verification failed with storage status ${response.status}.`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function ensureStoredObject({
  baseUrl,
  bucket,
  secretKey,
  object,
  bytes,
  fetchImpl = storageFetch,
}) {
  verifyBytes(bytes, object, "local source");
  const existing = await downloadStoredObject({ baseUrl, bucket, secretKey, object, fetchImpl });
  if (existing) {
    verifyBytes(existing, object, "existing private object");
    return { action: "exact_replay", bytes: existing.byteLength };
  }

  const upload = await fetchImpl(storageUrl(baseUrl, "object", bucket, object.object_key), {
    method: "POST",
    headers: storageHeaders(secretKey, {
      "cache-control": "no-store",
      "content-type": object.media_type,
      "x-upsert": "false",
    }),
    body: bytes,
  });
  if (!upload.ok) {
    // A concurrent content-addressed upload may win between the initial GET and POST.
    // Accept it only after downloading and matching every byte-accounting invariant.
    const raced = await downloadStoredObject({ baseUrl, bucket, secretKey, object, fetchImpl });
    if (!raced) throw new Error(`Private object upload failed with storage status ${upload.status}.`);
    verifyBytes(raced, object, "concurrent private object");
    return { action: "exact_replay", bytes: raced.byteLength };
  }

  const stored = await downloadStoredObject({ baseUrl, bucket, secretKey, object, fetchImpl });
  if (!stored) throw new Error("Private object upload completed but download verification could not find the object.");
  verifyBytes(stored, object, "uploaded private object");
  return { action: "uploaded", bytes: stored.byteLength };
}

async function assertPrivateBucket({ baseUrl, bucket, secretKey, fetchImpl = storageFetch }) {
  const response = await fetchImpl(storageUrl(baseUrl, "bucket", bucket), {
    method: "GET",
    headers: storageHeaders(secretKey),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Private bucket verification failed with storage status ${response.status}.`);
  const metadata = await response.json();
  assert(metadata && metadata.public === false, "PAC_SUPABASE_BUCKET must identify a private bucket.");
}

function same(left, right) {
  return canonicalSha256(left) === canonicalSha256(right);
}

async function insertLocation(tx, object, bucket, actor, verifiedAt, counts) {
  const locationId = deterministicUuid(
    `source-carrier-location:supabase_storage:${bucket}:${object.carrier_id}:${object.representation_kind}:${object.sha256}:${object.byte_count}`,
  );
  const comparable = {
    location_id: locationId,
    carrier_id: object.carrier_id,
    representation_kind: object.representation_kind,
    storage_provider: "supabase_storage",
    bucket_name: bucket,
    object_key: object.object_key,
    media_type: object.media_type,
    byte_count: object.byte_count,
    sha256: object.sha256,
    verification_method: "download_sha256_and_byte_count",
  };
  const existing = await tx`
    select location_id, carrier_id, representation_kind, storage_provider,
      bucket_name, object_key, media_type, byte_count::double precision as byte_count,
      sha256, verification_method
    from pac.source_carrier_locations
    where location_id = ${locationId}
       or (
         carrier_id = ${object.carrier_id}
         and representation_kind = ${object.representation_kind}
         and storage_provider = 'supabase_storage'
         and bucket_name = ${bucket}
         and object_key = ${object.object_key}
       )
       or (
         carrier_id = ${object.carrier_id}
         and representation_kind = ${object.representation_kind}
         and storage_provider = 'supabase_storage'
         and bucket_name = ${bucket}
         and sha256 = ${object.sha256}
         and byte_count = ${object.byte_count}
       )
  `;
  if (existing.length) {
    if (existing.length !== 1 || !same(comparable, existing[0])) {
      throw new Error(`Hard conflict: database placement for ${object.object_key} differs from the verified object.`);
    }
    counts.locationExactReplay += 1;
    return;
  }
  await tx`
    insert into pac.source_carrier_locations (
      location_id, carrier_id, representation_kind, storage_provider,
      bucket_name, object_key, media_type, byte_count, sha256,
      verification_method, verified_at, recorded_at, recorded_by
    ) values (
      ${locationId}, ${object.carrier_id}, ${object.representation_kind}, 'supabase_storage',
      ${bucket}, ${object.object_key}, ${object.media_type}, ${object.byte_count}, ${object.sha256},
      'download_sha256_and_byte_count', ${verifiedAt}, ${verifiedAt}, ${actor}
    )
  `;
  counts.locationInserted += 1;
}

async function insertHold(tx, hold, counts) {
  const comparable = {
    hold_id: hold.hold_id,
    carrier_id: hold.carrier_id,
    source_item_id: hold.source_item_id,
    hold_kind: hold.hold_kind,
    detail: hold.detail,
    recorded_at: hold.recorded_at,
    recorded_by: hold.recorded_by,
  };
  const existing = await tx`
    select hold_id, carrier_id, source_item_id, hold_kind, detail, recorded_at, recorded_by
    from pac.source_binary_holds
    where hold_id = ${hold.hold_id}
       or (
         carrier_id is not distinct from ${hold.carrier_id}
         and source_item_id is not distinct from ${hold.source_item_id}
         and hold_kind = ${hold.hold_kind}
       )
  `;
  if (existing.length) {
    if (existing.length !== 1 || !same(comparable, existing[0])) {
      throw new Error(`Hard conflict: database hold ${hold.hold_id} has different accounting.`);
    }
    counts.holdExactReplay += 1;
    return;
  }
  await tx`
    insert into pac.source_binary_holds (
      hold_id, carrier_id, source_item_id, hold_kind, detail, recorded_at, recorded_by
    ) values (
      ${hold.hold_id}, ${hold.carrier_id}, ${hold.source_item_id}, ${hold.hold_kind},
      ${tx.json(hold.detail)}, ${hold.recorded_at}, ${hold.recorded_by}
    )
  `;
  counts.holdInserted += 1;
}

async function recordVerifiedPlacements({ databaseUrl, bucket, objects, holds, actor, verifiedAt }) {
  const { default: postgres } = await import("postgres");
  const sql = postgres(databaseUrl, { max: 1, prepare: false, ...databaseOptions(databaseUrl) });
  const counts = {
    locationInserted: 0,
    locationExactReplay: 0,
    holdInserted: 0,
    holdExactReplay: 0,
  };
  try {
    await sql.begin(async (tx) => {
      for (const object of objects) await insertLocation(tx, object, bucket, actor, verifiedAt, counts);
      for (const hold of holds) await insertHold(tx, hold, counts);
    });
    return counts;
  } finally {
    await sql.end();
  }
}

async function main() {
  const stageDirectory = option("--stage")
    ? resolve(process.cwd(), option("--stage"))
    : DEFAULT_SOURCE_OBJECT_STAGE_DIRECTORY;
  const stage = validateSourceObjectStage(stageDirectory);
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({
      ok: true,
      mode: "validated_only",
      databaseChanged: false,
      objectStorageChanged: false,
      stageId: stage.manifest.stageId,
      stageSetSha256: stage.manifest.stageSetSha256,
      counts: stage.manifest.counts,
      staffPublicationDecisions: 0,
    }, null, 2));
    return;
  }

  const baseUrl = process.env.PAC_SUPABASE_URL;
  const bucket = process.env.PAC_SUPABASE_BUCKET;
  const secretKey = process.env.PAC_SUPABASE_SECRET_KEY;
  const databaseUrl = process.env.PAC_DATABASE_URL;
  if (!baseUrl || !bucket || !secretKey || !databaseUrl) {
    throw new Error(
      "Set server-only PAC_SUPABASE_URL, PAC_SUPABASE_BUCKET, PAC_SUPABASE_SECRET_KEY, and PAC_DATABASE_URL before using --apply.",
    );
  }
  const publicStorageSecret = Object.keys(process.env).find(
    (name) => name.startsWith("NEXT_PUBLIC_") && name.endsWith("SUPABASE_SECRET_KEY"),
  );
  assert(!publicStorageSecret, "A Supabase secret key must never use a NEXT_PUBLIC_ name.");
  await assertPrivateBucket({ baseUrl, bucket, secretKey });

  const uploadCounts = { uploaded: 0, exactReplay: 0, verifiedBytes: 0 };
  for (const object of stage.objects) {
    const localPath = resolveStagedObjectPath(object);
    const bytes = readFileSync(localPath);
    const result = await ensureStoredObject({ baseUrl, bucket, secretKey, object, bytes });
    uploadCounts[result.action === "uploaded" ? "uploaded" : "exactReplay"] += 1;
    uploadCounts.verifiedBytes += result.bytes;
    console.log(JSON.stringify({
      event: "source_object_verified",
      verified: uploadCounts.uploaded + uploadCounts.exactReplay,
      total: stage.objects.length,
      verifiedBytes: uploadCounts.verifiedBytes,
    }));
  }

  // Storage is fully verified before any placement record is committed.
  const databaseCounts = await recordVerifiedPlacements({
    databaseUrl,
    bucket,
    objects: stage.objects,
    holds: stage.holds,
    actor: process.env.PAC_IMPORT_ACTOR ?? "pac_private_source_object_loader",
    verifiedAt: new Date().toISOString(),
  });
  console.log(JSON.stringify({
    ok: true,
    mode: "applied",
    stageId: stage.manifest.stageId,
    stageSetSha256: stage.manifest.stageSetSha256,
    privateBucketVerified: true,
    objectStorage: uploadCounts,
    database: databaseCounts,
    staffPublicationDecisions: 0,
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(JSON.stringify({ ok: false, error: safeOperationalError(error) }, null, 2));
    process.exit(1);
  });
}
