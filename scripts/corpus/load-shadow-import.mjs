#!/usr/bin/env node

import { resolve } from "node:path";
import {
  canonicalSha256,
  DEFAULT_STAGE_DIRECTORY,
  readStageJsonLines,
  validateShadowImportDirectory,
} from "./shadow-import-lib.mjs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function databaseOptions(url) {
  const configured = (process.env.PAC_DATABASE_SSL ?? "").toLowerCase();
  if (configured === "disable" || configured === "false") return { ssl: false };
  if (configured === "require" || configured === "true") return { ssl: "require" };
  const hostname = new URL(url).hostname;
  return { ssl: ["localhost", "127.0.0.1", "::1"].includes(hostname) ? false : "require" };
}

class HardConflict extends Error {
  constructor(businessId, detail) {
    super(`Hard conflict for ${businessId}: ${detail}`);
    this.businessId = businessId;
  }
}

function same(left, right) {
  return canonicalSha256(left) === canonicalSha256(right);
}

async function recordEntry(tx, runId, businessId, action, row, sourceItemId = null) {
  const hash = canonicalSha256(row);
  await tx`
    insert into pac.ingest_entries (
      ingest_run_id, source_item_id, business_id, action,
      expected_sha256, actual_sha256, detail
    ) values (
      ${runId}, ${sourceItemId}, ${businessId}, ${action},
      ${hash}, ${hash}, ${tx.json({ rowType: businessId.split(":", 1)[0] })}
    )
  `;
}

async function loadCarriers(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select carrier_id, logical_key, media_type, original_name, byte_count::double precision as byte_count,
        raw_blob_sha256, storage_key, external_locator
      from pac.source_carriers
      where carrier_id = ${row.carrier_id} or logical_key = ${row.logical_key}
    `;
    const comparable = {
      carrier_id: row.carrier_id,
      logical_key: row.logical_key,
      media_type: row.media_type,
      original_name: row.original_name,
      byte_count: row.byte_count,
      raw_blob_sha256: row.raw_blob_sha256,
      storage_key: row.storage_key,
      external_locator: row.external_locator,
    };
    if (existing.length) {
      if (existing.length !== 1 || !same(comparable, existing[0])) {
        throw new HardConflict(`carrier:${row.logical_key}`, "the same carrier identity has different metadata or bytes");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `carrier:${row.logical_key}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.source_carriers (
        carrier_id, logical_key, media_type, original_name, byte_count,
        raw_blob_sha256, storage_key, external_locator, captured_at, captured_by
      ) values (
        ${row.carrier_id}, ${row.logical_key}, ${row.media_type}, ${row.original_name}, ${row.byte_count},
        ${row.raw_blob_sha256}, ${row.storage_key}, ${tx.json(row.external_locator)}, ${row.captured_at}, ${row.captured_by}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `carrier:${row.logical_key}`, "inserted", row);
  }
}

async function loadSourceItems(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select source_item_id, source_business_id, carrier_id, source_version, source_pointer,
        title, normalized_payload, normalized_item_sha256, hash_algorithm,
        hash_algorithm_version, owner_approval_status, accounting_status, access_scope
      from pac.source_items
      where source_item_id = ${row.source_item_id}
         or (source_business_id = ${row.source_business_id} and source_version = ${row.source_version})
    `;
    const comparable = {
      source_item_id: row.source_item_id,
      source_business_id: row.source_business_id,
      carrier_id: row.carrier_id,
      source_version: row.source_version,
      source_pointer: row.source_pointer,
      title: row.title,
      normalized_payload: row.normalized_payload,
      normalized_item_sha256: row.normalized_item_sha256,
      hash_algorithm: row.hash_algorithm,
      hash_algorithm_version: row.hash_algorithm_version,
      owner_approval_status: row.owner_approval_status,
      accounting_status: row.accounting_status,
      access_scope: row.access_scope,
    };
    if (existing.length) {
      if (existing.length !== 1 || !same(comparable, existing[0])) {
        throw new HardConflict(`source-item:${row.source_item_id}`, "the same source ID or business version has different content");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `source-item:${row.source_item_id}`, "exact_replay", row, row.source_item_id);
      continue;
    }
    await tx`
      insert into pac.source_items (
        source_item_id, source_business_id, carrier_id, source_version, source_pointer,
        title, normalized_payload, normalized_item_sha256, hash_algorithm,
        hash_algorithm_version, owner_approval_status, accounting_status, access_scope,
        import_batch_id
      ) values (
        ${row.source_item_id}, ${row.source_business_id}, ${row.carrier_id}, ${row.source_version}, ${row.source_pointer},
        ${row.title}, ${tx.json(row.normalized_payload)}, ${row.normalized_item_sha256}, ${row.hash_algorithm},
        ${row.hash_algorithm_version}, ${row.owner_approval_status}, ${row.accounting_status}, ${row.access_scope},
        ${runId}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `source-item:${row.source_item_id}`, "inserted", row, row.source_item_id);
  }
}

async function loadSourceReceipts(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select receipt_id, source_item_id, disposition, canonical_family_id,
        canonical_item_id, decision_payload, decision_sha256, decided_at,
        decided_by, release_commit, release_manifest_sha256
      from pac.source_receipts
      where receipt_id = ${row.receipt_id} or source_item_id = ${row.source_item_id}
    `;
    const comparable = {
      receipt_id: row.receipt_id,
      source_item_id: row.source_item_id,
      disposition: row.disposition,
      canonical_family_id: row.canonical_family_id,
      canonical_item_id: row.canonical_item_id,
      decision_payload: row.decision_payload,
      decision_sha256: row.decision_sha256,
      decided_at: row.decided_at,
      decided_by: row.decided_by,
      release_commit: row.release_commit,
      release_manifest_sha256: row.release_manifest_sha256,
    };
    if (existing.length) {
      if (existing.length !== 1 || !same(comparable, existing[0])) {
        throw new HardConflict(
          `source-receipt:${row.receipt_id}`,
          "the same receipt or source has a different disposition",
        );
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `source-receipt:${row.receipt_id}`, "exact_replay", row, row.source_item_id);
      continue;
    }
    await tx`
      insert into pac.source_receipts (
        receipt_id, source_item_id, disposition, canonical_family_id,
        canonical_item_id, decision_payload, decision_sha256, decided_at,
        decided_by, release_commit, release_manifest_sha256
      ) values (
        ${row.receipt_id}, ${row.source_item_id}, ${row.disposition}, ${row.canonical_family_id},
        ${row.canonical_item_id}, ${tx.json(row.decision_payload)}, ${row.decision_sha256}, ${row.decided_at},
        ${row.decided_by}, ${row.release_commit}, ${row.release_manifest_sha256}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `source-receipt:${row.receipt_id}`, "inserted", row, row.source_item_id);
  }
}

async function loadSourceReviews(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select source_review_id, source_item_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_source_review_id
      from pac.source_review_records where source_review_id = ${row.source_review_id}
    `;
    const comparable = {
      source_review_id: row.source_review_id,
      source_item_id: row.source_item_id,
      dimension: row.dimension,
      status: row.status,
      reviewer_role: row.reviewer_role,
      reviewer_id: row.reviewer_id,
      findings: row.findings,
      recorded_at: row.recorded_at,
      supersedes_source_review_id: row.supersedes_source_review_id,
    };
    if (existing.length) {
      if (!same(comparable, existing[0])) {
        throw new HardConflict(`source-review:${row.source_review_id}`, "the same review ID has different findings");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `source-review:${row.source_review_id}`, "exact_replay", row, row.source_item_id);
      continue;
    }
    await tx`
      insert into pac.source_review_records (
        source_review_id, source_item_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_source_review_id, import_batch_id
      ) values (
        ${row.source_review_id}, ${row.source_item_id}, ${row.dimension}, ${row.status}, ${row.reviewer_role},
        ${row.reviewer_id}, ${tx.json(row.findings)}, ${row.recorded_at}, ${row.supersedes_source_review_id}, ${runId}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `source-review:${row.source_review_id}`, "inserted", row, row.source_item_id);
  }
}

async function loadCollections(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select collection_id, name, purpose, preservation_rule, created_at, created_by
      from pac.content_collections where collection_id = ${row.collection_id}
    `;
    if (existing.length) {
      if (!same(row, existing[0])) {
        throw new HardConflict(`collection:${row.collection_id}`, "the same collection ID has different content");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `collection:${row.collection_id}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.content_collections (
        collection_id, name, purpose, preservation_rule, created_at, created_by
      ) values (
        ${row.collection_id}, ${row.name}, ${row.purpose}, ${row.preservation_rule}, ${row.created_at}, ${row.created_by}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `collection:${row.collection_id}`, "inserted", row);
  }
}

async function loadContentItems(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select content_item_id, content_kind, default_scope_id, staff_label, restricted,
        created_at, created_by, retired_at, retired_by
      from pac.content_items where content_item_id = ${row.content_item_id}
    `;
    if (existing.length) {
      if (!same(row, existing[0])) {
        throw new HardConflict(`content-item:${row.content_item_id}`, "the same content ID has different identity metadata");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `content-item:${row.content_item_id}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.content_items (
        content_item_id, content_kind, default_scope_id, staff_label, restricted,
        created_at, created_by, retired_at, retired_by
      ) values (
        ${row.content_item_id}, ${row.content_kind}, ${row.default_scope_id}, ${row.staff_label}, ${row.restricted},
        ${row.created_at}, ${row.created_by}, ${row.retired_at}, ${row.retired_by}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `content-item:${row.content_item_id}`, "inserted", row);
  }
}

async function loadContentRevisions(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select revision_id, content_item_id, revision_number, canonical_payload,
        change_summary, required_review_dimensions, created_at, created_by, based_on_revision_id
      from pac.content_revisions
      where revision_id = ${row.revision_id}
         or (content_item_id = ${row.content_item_id} and revision_number = ${row.revision_number})
    `;
    const comparable = {
      revision_id: row.revision_id,
      content_item_id: row.content_item_id,
      revision_number: row.revision_number,
      canonical_payload: row.canonical_payload,
      change_summary: row.change_summary,
      required_review_dimensions: row.required_review_dimensions,
      created_at: row.created_at,
      created_by: row.created_by,
      based_on_revision_id: row.based_on_revision_id,
    };
    if (existing.length) {
      if (existing.length !== 1 || !same(comparable, existing[0])) {
        throw new HardConflict(
          `content-revision:${row.content_item_id}@${row.revision_number}`,
          "the same revision ID or number has different content",
        );
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `content-revision:${row.content_item_id}@${row.revision_number}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.content_revisions (
        revision_id, content_item_id, revision_number, canonical_payload,
        change_summary, required_review_dimensions, created_at, created_by,
        based_on_revision_id, import_batch_id
      ) values (
        ${row.revision_id}, ${row.content_item_id}, ${row.revision_number}, ${tx.json(row.canonical_payload)},
        ${row.change_summary}, ${`{${row.required_review_dimensions.join(",")}}`}::text[], ${row.created_at}, ${row.created_by},
        ${row.based_on_revision_id}, ${runId}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `content-revision:${row.content_item_id}@${row.revision_number}`, "inserted", row);
  }
}

async function loadRevisionSources(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select revision_id, source_item_id, relationship, note
      from pac.revision_sources
      where revision_id = ${row.revision_id}
        and source_item_id = ${row.source_item_id}
        and relationship = ${row.relationship}
    `;
    if (existing.length) {
      if (!same(row, existing[0])) {
        throw new HardConflict(`revision-source:${row.revision_id}:${row.source_item_id}`, "the same link has a different note");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `revision-source:${row.revision_id}:${row.source_item_id}`, "exact_replay", row, row.source_item_id);
      continue;
    }
    await tx`
      insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
      values (${row.revision_id}, ${row.source_item_id}, ${row.relationship}, ${row.note})
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `revision-source:${row.revision_id}:${row.source_item_id}`, "linked", row, row.source_item_id);
  }
}

async function loadContentReviews(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select review_id, revision_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_review_id
      from pac.review_records where review_id = ${row.review_id}
    `;
    if (existing.length) {
      if (!same(row, existing[0])) {
        throw new HardConflict(`content-review:${row.review_id}`, "the same review ID has different findings");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `content-review:${row.review_id}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.review_records (
        review_id, revision_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_review_id
      ) values (
        ${row.review_id}, ${row.revision_id}, ${row.dimension}, ${row.status}, ${row.reviewer_role},
        ${row.reviewer_id}, ${tx.json(row.findings)}, ${row.recorded_at}, ${row.supersedes_review_id}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `content-review:${row.review_id}`, "inserted", row);
  }
}

async function loadMemberships(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select collection_id, content_item_id, action, decided_at, decided_by, reason
      from pac.collection_membership_decisions
      where collection_id = ${row.collection_id} and content_item_id = ${row.content_item_id}
      order by decision_id desc
      limit 1
    `;
    if (existing.length) {
      if (!same(row, existing[0])) {
        throw new HardConflict(
          `membership:${row.collection_id}:${row.content_item_id}`,
          "the latest collection decision has different content",
        );
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `membership:${row.collection_id}:${row.content_item_id}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.collection_membership_decisions (
        collection_id, content_item_id, action, decided_at, decided_by, reason, ingest_run_id
      ) values (
        ${row.collection_id}, ${row.content_item_id}, ${row.action}, ${row.decided_at},
        ${row.decided_by}, ${row.reason}, ${runId}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `membership:${row.collection_id}:${row.content_item_id}`, "linked", row);
  }
}

function loadRows(stageDirectory, manifest) {
  const hasFile = (name) => manifest.files.some((entry) => entry.name === name);
  return {
    sourceCarriers: readStageJsonLines(stageDirectory, "source_carriers.jsonl"),
    sourceItems: readStageJsonLines(stageDirectory, "source_items.jsonl"),
    sourceReceipts: hasFile("source_receipts.jsonl")
      ? readStageJsonLines(stageDirectory, "source_receipts.jsonl")
      : [],
    sourceReviews: readStageJsonLines(stageDirectory, "source_review_records.jsonl"),
    collections: readStageJsonLines(stageDirectory, "content_collections.jsonl"),
    contentItems: readStageJsonLines(stageDirectory, "content_items.jsonl"),
    contentRevisions: readStageJsonLines(stageDirectory, "content_revisions.jsonl"),
    revisionSources: readStageJsonLines(stageDirectory, "revision_sources.jsonl"),
    contentReviews: readStageJsonLines(stageDirectory, "review_records.jsonl"),
    memberships: readStageJsonLines(stageDirectory, "collection_membership_decisions.jsonl"),
    publications: readStageJsonLines(stageDirectory, "publication_decisions.jsonl"),
  };
}

async function connect() {
  const url = process.env.PAC_DATABASE_URL;
  if (!url) throw new Error("Set the server-only PAC_DATABASE_URL before using --apply or --promote-run.");
  const { default: postgres } = await import("postgres");
  return postgres(url, { max: 1, prepare: false, ...databaseOptions(url) });
}

async function promoteRun(runId) {
  const sql = await connect();
  try {
    const rows = await sql`
      select ingest_run_id, status, expected_counts, actual_counts
      from pac.ingest_runs where ingest_run_id = ${runId}
    `;
    if (rows.length !== 1) throw new Error(`Ingest run ${runId} does not exist.`);
    if (rows[0].status !== "validated") throw new Error(`Ingest run ${runId} is ${rows[0].status}, not validated.`);
    const [entryCount] = await sql`
      select count(*)::integer as count from pac.ingest_entries where ingest_run_id = ${runId}
    `;
    if (!entryCount.count) throw new Error(`Ingest run ${runId} has no accounting entries.`);
    const stagedRows = Number(rows[0].actual_counts?.stageRows ?? 0);
    if (!stagedRows || entryCount.count !== stagedRows) {
      throw new Error(
        `Ingest run ${runId} has ${entryCount.count} accounting entries but reports ${stagedRows} staged rows.`,
      );
    }
    await sql`
      update pac.ingest_runs
      set status = 'promoted', finished_at = now()
      where ingest_run_id = ${runId} and status = 'validated'
    `;
    console.log(JSON.stringify({ ok: true, promotedRunId: runId, staffPublicationDecisionsCreated: 0 }, null, 2));
  } finally {
    await sql.end();
  }
}

async function applyStage(stageDirectory, manifest) {
  const rows = loadRows(stageDirectory, manifest);
  if (rows.publications.length !== 0) throw new Error("Corpus stage contains publication decisions and cannot be applied.");
  const expectedStageRows = manifest.files.reduce((sum, file) => sum + file.records, 0);
  const actualStageRows = Object.values(rows).reduce((sum, list) => sum + list.length, 0);
  if (actualStageRows !== expectedStageRows) {
    throw new Error(`Loaded ${actualStageRows} stage rows; manifest requires ${expectedStageRows}.`);
  }
  const sql = await connect();
  let runId;
  const counts = { inserted: 0, exactReplay: 0, stageRows: actualStageRows };
  const importerVersion = manifest.mode === "canonical_projection_held"
    ? "canonical-projection-v1"
    : "shadow-import-v1";
  try {
    const readiness = await sql`select to_regclass('pac.source_items') as source_items`;
    if (!readiness[0]?.source_items) throw new Error("PAC database migration 0001 has not been applied.");
    const [run] = await sql`
      insert into pac.ingest_runs (
        source_set_id, source_manifest_sha256, importer_version,
        expected_counts, status, initiated_by
      ) values (
        ${manifest.stageId}, ${manifest.stageSetSha256}, ${importerVersion},
        ${sql.json(manifest.counts)}, 'started', ${process.env.PAC_IMPORT_ACTOR ?? "program_owner_corpus_import"}
      ) returning ingest_run_id
    `;
    runId = run.ingest_run_id;

    await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtextextended(${manifest.stageId}, 0))`;
      await loadCarriers(tx, runId, rows.sourceCarriers, counts);
      await loadSourceItems(tx, runId, rows.sourceItems, counts);
      await loadSourceReceipts(tx, runId, rows.sourceReceipts, counts);
      await loadSourceReviews(tx, runId, rows.sourceReviews, counts);
      await loadCollections(tx, runId, rows.collections, counts);
      await loadContentItems(tx, runId, rows.contentItems, counts);
      await loadContentRevisions(tx, runId, rows.contentRevisions, counts);
      await loadRevisionSources(tx, runId, rows.revisionSources, counts);
      await loadContentReviews(tx, runId, rows.contentReviews, counts);
      await loadMemberships(tx, runId, rows.memberships, counts);
      if (counts.inserted + counts.exactReplay !== counts.stageRows) {
        throw new Error(
          `Import accounting recorded ${counts.inserted + counts.exactReplay} rows; the validated stage contains ${counts.stageRows}.`,
        );
      }
    });

    await sql`
      update pac.ingest_runs
      set status = 'validated', actual_counts = ${sql.json(counts)}, finished_at = now()
      where ingest_run_id = ${runId}
    `;
    console.log(JSON.stringify({
      ok: true,
      ingestRunId: runId,
      status: "validated",
      counts,
      currentMembershipsChanged: false,
      staffPublicationDecisionsCreated: 0,
      nextStep: `Review the validated run, then explicitly use --promote-run ${runId} to make its collection memberships current.`,
    }, null, 2));
  } catch (error) {
    if (runId) {
      await sql`
        update pac.ingest_runs
        set status = 'failed', failure_detail = ${String(error.message).slice(0, 4000)}, finished_at = now()
        where ingest_run_id = ${runId}
      `.catch(() => undefined);
      if (error instanceof HardConflict) {
        await sql`
          insert into pac.ingest_entries (
            ingest_run_id, business_id, action, detail
          ) values (
            ${runId}, ${error.businessId}, 'conflict', ${sql.json({ message: error.message })}
          )
        `.catch(() => undefined);
      }
    }
    throw error;
  } finally {
    await sql.end();
  }
}

async function main() {
  const stageDirectory = option("--stage")
    ? resolve(process.cwd(), option("--stage"))
    : DEFAULT_STAGE_DIRECTORY;
  const promoteRunId = option("--promote-run");
  if (promoteRunId) {
    await promoteRun(promoteRunId);
    return;
  }

  const manifest = validateShadowImportDirectory(stageDirectory);
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({
      ok: true,
      mode: "validated_only",
      stageDirectory,
      stageSetSha256: manifest.stageSetSha256,
      counts: manifest.counts,
      databaseChanged: false,
      staffPublicationDecisions: 0,
    }, null, 2));
    return;
  }
  await applyStage(stageDirectory, manifest);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
