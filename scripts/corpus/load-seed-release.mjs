#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DEFAULT_SEED_RELEASE_STAGE,
  SEED_RELEASE_REPOSITORY_ROOT,
  SEED_RELEASE_TRUST_DECISION,
  canonicalSha256,
  validateSeedReleaseDirectory,
} from "./seed-release-lib.mjs";

const LEGACY_PRE_TRUST_SEED_STAGE_SHA256 =
  "55AFAAFBF76525AB6C6AF73D1B5B24D38D7ED0270B1B8D3E34DE67FB81B0BC60";

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

async function connect() {
  const url = process.env.PAC_DATABASE_URL;
  if (!url) throw new Error("Set PAC_DATABASE_URL before applying a release.");
  const { default: postgres } = await import("postgres");
  return postgres(url, { max: 1, prepare: false, ...databaseOptions(url) });
}

async function recordEntry(tx, runId, businessId, action, row) {
  const hash = canonicalSha256(row);
  await tx`
    insert into pac.ingest_entries (
      ingest_run_id, business_id, action, expected_sha256, actual_sha256, detail
    ) values (
      ${runId}, ${businessId}, ${action}, ${hash}, ${hash},
      ${tx.json({ releaseRow: businessId.split(":", 1)[0] })}
    )
  `;
}

async function ensurePrerequisites(sql, stage) {
  const seedSource = await sql`
    select source_item_id, owner_approval_status, accounting_status
    from pac.source_items
    where source_item_id = 'owner:current-seed-collection-2026-09-04:v1'
  `;
  if (seedSource.length !== 1) throw new Error("The permanent seed source has not been imported.");
  if (
    seedSource[0].owner_approval_status !== "owner_approved_for_ingestion"
    || seedSource[0].accounting_status !== "accounted"
  ) {
    throw new Error("The permanent seed source is not approved and accounted for.");
  }

  const memberships = await sql`
    select content_item_id
    from pac.current_collection_memberships
    where collection_id = ${stage.manifest.collectionId}
  `;
  const membershipIds = new Set(memberships.map((row) => row.content_item_id));
  const expectedIds = new Set(stage.releaseManifest.items.map((item) => item.id));
  if (membershipIds.size !== 25 || [...expectedIds].some((id) => !membershipIds.has(id))) {
    throw new Error("The promoted permanent seed collection does not contain all 25 required items.");
  }

  for (const item of stage.releaseManifest.items) {
    const contentItems = await sql`
      select content_item_id, default_scope_id, restricted, retired_at
      from pac.content_items where content_item_id = ${item.id}
    `;
    if (contentItems.length !== 1) throw new Error(`Permanent seed content item ${item.id} is missing.`);
    if (contentItems[0].default_scope_id !== item.scopeId) {
      throw new HardConflict(`scope:${item.id}`, "the imported content scope differs from the reviewed release scope");
    }
    if (contentItems[0].restricted || contentItems[0].retired_at) {
      throw new Error(`Permanent seed content item ${item.id} is restricted or retired.`);
    }
    const baselineRevisionId = stage.records.reviews
      .find((review) => review.revision_id === stage.records.publications.find((row) => row.content_item_id === item.id)?.revision_id)
      ?.supersedes_review_id;
    if (!baselineRevisionId) throw new Error(`Permanent seed review lineage is missing for ${item.id}.`);
    const baselineRevisions = await sql`
      select revision_id, canonical_payload
      from pac.content_revisions
      where content_item_id = ${item.id} and revision_number = ${item.baselineRevision}
    `;
    if (baselineRevisions.length !== 1 || canonicalSha256(baselineRevisions[0].canonical_payload) !== item.baselinePayloadSha256) {
      throw new HardConflict(`baseline:${item.id}`, "the preserved revision-one payload is missing or different");
    }
  }

  for (const scopeId of new Set(stage.records.publications.map((row) => row.scope_id))) {
    const scopes = await sql`select scope_id, active from pac.program_scopes where scope_id = ${scopeId}`;
    if (scopes.length !== 1 || !scopes[0].active) throw new Error(`Publication scope ${scopeId} is missing or inactive.`);
  }
}

async function applySeedTrustDecision(tx, stage) {
  const trust = stage.manifest.trustDecision;
  if (!same(trust, SEED_RELEASE_TRUST_DECISION)) {
    throw new Error("The governed permanent seed trust decision is missing or changed.");
  }

  await tx`select pg_catalog.set_config('pac.allow_immutable_change', 'on', true)`;
  const sources = await tx`
    update pac.source_items
    set sensitivity_class = ${trust.sensitivityClass},
        deidentification_status = 'not_needed',
        ordinary_indexing_allowed = ${trust.ordinaryIndexingAllowed},
        model_context_allowed = ${trust.modelContextAllowed}
    where source_item_id = 'owner:current-seed-collection-2026-09-04:v1'
    returning carrier_id
  `;
  if (sources.length !== 1) {
    throw new Error("The governed permanent seed source could not be classified.");
  }
  if (sources[0].carrier_id) {
    const carriers = await tx`
      update pac.source_carriers
      set sensitivity_class = ${trust.sensitivityClass}
      where carrier_id = ${sources[0].carrier_id}
      returning carrier_id
    `;
    if (carriers.length !== 1) {
      throw new Error("The governed permanent seed carrier could not be classified.");
    }
  }

  for (const publication of stage.records.publications) {
    const items = await tx`
      update pac.content_items
      set sensitivity_class = ${trust.sensitivityClass}
      where content_item_id = ${publication.content_item_id}
      returning content_item_id
    `;
    if (items.length !== 1) {
      throw new Error(`Permanent seed content item ${publication.content_item_id} could not be classified.`);
    }
    await tx`
      update pac.content_revisions
      set sensitivity_class = ${trust.sensitivityClass},
          ordinary_indexing_allowed = ${trust.ordinaryIndexingAllowed},
          model_context_allowed = ${trust.modelContextAllowed},
          limitations = ${`{${trust.limitations.join(",")}}`}::text[]
      where revision_id = ${publication.revision_id}
        and content_item_id = ${publication.content_item_id}
    `;
  }
  await tx`select pg_catalog.set_config('pac.allow_immutable_change', 'off', true)`;
}

async function ensureTrustedSeedPublications(sql, stage) {
  for (const publication of stage.records.publications) {
    const rows = await sql`
      select sensitivity_class, unauthenticated_exposure_permitted,
        exposure_reason, model_context_allowed
      from pac.current_staff_publications
      where content_item_id = ${publication.content_item_id}
        and revision_id = ${publication.revision_id}
        and scope_id = ${publication.scope_id}
    `;
    if (
      rows.length !== 1
      || rows[0].sensitivity_class !== publication.sensitivity_class
      || rows[0].unauthenticated_exposure_permitted !== true
      || rows[0].exposure_reason !== publication.exposure_reason
      || rows[0].model_context_allowed !== false
    ) {
      throw new Error(
        `Permanent seed resource ${publication.content_item_id} is not available through its explicit trusted staff publication.`,
      );
    }
  }
}

async function loadRevisions(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select revision_id, content_item_id, revision_number, canonical_payload,
        change_summary, required_review_dimensions, created_at, created_by, based_on_revision_id,
        sensitivity_class, ordinary_indexing_allowed, model_context_allowed, limitations
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
      sensitivity_class: row.sensitivity_class,
      ordinary_indexing_allowed: row.ordinary_indexing_allowed,
      model_context_allowed: row.model_context_allowed,
      limitations: row.limitations,
    };
    if (existing.length) {
      if (existing.length !== 1 || !same(comparable, existing[0])) {
        throw new HardConflict(`${row.content_item_id}@${row.revision_number}`, "the same revision identity has different content");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `seed-revision:${row.content_item_id}@${row.revision_number}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.content_revisions (
        revision_id, content_item_id, revision_number, canonical_payload, change_summary,
        required_review_dimensions, created_at, created_by, based_on_revision_id, import_batch_id,
        sensitivity_class, ordinary_indexing_allowed, model_context_allowed, limitations
      ) values (
        ${row.revision_id}, ${row.content_item_id}, ${row.revision_number}, ${tx.json(row.canonical_payload)},
        ${row.change_summary}, ${`{${row.required_review_dimensions.join(",")}}`}::text[],
        ${row.created_at}, ${row.created_by}, ${row.based_on_revision_id}, ${runId},
        ${row.sensitivity_class}, ${row.ordinary_indexing_allowed}, ${row.model_context_allowed},
        ${`{${row.limitations.join(",")}}`}::text[]
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `seed-revision:${row.content_item_id}@${row.revision_number}`, "inserted", row);
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
      if (existing.length !== 1 || !same(row, existing[0])) {
        throw new HardConflict(`revision-source:${row.revision_id}`, "the same source link has a different note");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `seed-source:${row.revision_id}`, "exact_replay", row);
      continue;
    }
    await tx`
      insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
      values (${row.revision_id}, ${row.source_item_id}, ${row.relationship}, ${row.note})
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `seed-source:${row.revision_id}`, "linked", row);
  }
}

async function loadReviews(tx, runId, rows, counts) {
  for (const row of rows) {
    const existing = await tx`
      select review_id, revision_id, dimension, status, reviewer_role,
        reviewer_id, findings, recorded_at, supersedes_review_id
      from pac.review_records where review_id = ${row.review_id}
    `;
    if (existing.length) {
      if (existing.length !== 1 || !same(row, existing[0])) {
        throw new HardConflict(`review:${row.review_id}`, "the same review identity has different findings");
      }
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `seed-review:${row.review_id}`, "exact_replay", row);
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
    await recordEntry(tx, runId, `seed-review:${row.review_id}`, "inserted", row);
  }
}

async function loadPublications(tx, runId, rows, counts) {
  for (const row of rows) {
    const latest = await tx`
      select content_item_id, revision_id, scope_id, decision, gate_snapshot,
        decided_at, decided_by, reason, sensitivity_class,
        unauthenticated_exposure_permitted, exposure_reason
      from pac.publication_decisions
      where content_item_id = ${row.content_item_id} and scope_id = ${row.scope_id}
      order by publication_decision_id desc
      limit 1
    `;
    if (latest.length && same(row, latest[0])) {
      counts.exactReplay += 1;
      await recordEntry(tx, runId, `seed-publication:${row.content_item_id}:${row.scope_id}`, "exact_replay", row);
      continue;
    }
    if (latest.length && new Date(latest[0].decided_at).getTime() >= new Date(row.decided_at).getTime()) {
      throw new HardConflict(
        `publication:${row.content_item_id}:${row.scope_id}`,
        "a different publication decision already exists at the same or a later time",
      );
    }
    await tx`
      insert into pac.publication_decisions (
        content_item_id, revision_id, scope_id, decision, gate_snapshot,
        decided_at, decided_by, reason, sensitivity_class,
        unauthenticated_exposure_permitted, exposure_reason
      ) values (
        ${row.content_item_id}, ${row.revision_id}, ${row.scope_id}, ${row.decision},
        ${tx.json(row.gate_snapshot)}, ${row.decided_at}, ${row.decided_by}, ${row.reason},
        ${row.sensitivity_class}, ${row.unauthenticated_exposure_permitted}, ${row.exposure_reason}
      )
    `;
    counts.inserted += 1;
    await recordEntry(tx, runId, `seed-publication:${row.content_item_id}:${row.scope_id}`, "inserted", row);
  }
}

async function applyRelease(stage) {
  const sql = await connect();
  let runId;
  try {
    const readiness = await sql`
      select to_regclass('pac.publication_decisions') as publications,
        to_regprocedure('pac.publish_resource_draft(text,text,uuid,bigint,text,text,boolean,text)') as trusted_release_function,
        exists (
          select 1 from information_schema.columns
          where table_schema = 'pac' and table_name = 'publication_decisions'
            and column_name = 'unauthenticated_exposure_permitted'
        ) as data_trust_ready
    `;
    if (!readiness[0]?.publications) throw new Error("PAC database migration 0001 has not been applied.");
    if (!readiness[0]?.data_trust_ready) throw new Error("PAC database migration 0009 has not been applied.");
    if (!readiness[0]?.trusted_release_function) throw new Error("PAC database migration 0010 has not been applied.");
    await ensurePrerequisites(sql, stage);

    const priorRuns = await sql`
      select ingest_run_id, source_manifest_sha256, status, actual_counts
      from pac.ingest_runs
      where source_set_id = ${stage.manifest.stageId}
      order by started_at desc
    `;
    const mismatched = priorRuns.find(
      (row) => row.source_manifest_sha256
        && row.source_manifest_sha256 !== stage.manifest.stageSetSha256
        && row.source_manifest_sha256 !== LEGACY_PRE_TRUST_SEED_STAGE_SHA256,
    );
    if (mismatched) throw new HardConflict(stage.manifest.stageId, "the release ID was previously used with a different stage hash");
    const completed = priorRuns.find(
      (row) => row.source_manifest_sha256 === stage.manifest.stageSetSha256 && row.status === "promoted",
    ) ?? priorRuns.find(
      (row) => row.source_manifest_sha256 === LEGACY_PRE_TRUST_SEED_STAGE_SHA256
        && row.status === "promoted",
    );
    if (completed) {
      await ensureTrustedSeedPublications(sql, stage);
      return {
        ok: true,
        mode: "exact_replay",
        databaseChanged: false,
        ingestRunId: completed.ingest_run_id,
        stageSetSha256: stage.manifest.stageSetSha256,
        migratedFromStageSetSha256:
          completed.source_manifest_sha256 === stage.manifest.stageSetSha256
            ? undefined
            : completed.source_manifest_sha256,
        staffPublicationDecisions: 25,
      };
    }

    const [run] = await sql`
      insert into pac.ingest_runs (
        source_set_id, source_manifest_sha256, importer_version,
        expected_counts, status, initiated_by
      ) values (
        ${stage.manifest.stageId}, ${stage.manifest.stageSetSha256}, 'seed-release-v1',
        ${sql.json(stage.manifest.counts)}, 'started',
        ${process.env.PAC_IMPORT_ACTOR ?? "Equity and Inclusion Operations Consultant"}
      ) returning ingest_run_id
    `;
    runId = run.ingest_run_id;
    const counts = {
      inserted: 0,
      exactReplay: 0,
      stageRows: stage.manifest.counts.stagedRows,
    };

    await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtextextended(${stage.manifest.stageId}, 0))`;
      await applySeedTrustDecision(tx, stage);
      await loadRevisions(tx, runId, stage.records.revisions, counts);
      await loadRevisionSources(tx, runId, stage.records.revisionSources, counts);
      await loadReviews(tx, runId, stage.records.reviews, counts);
      await loadPublications(tx, runId, stage.records.publications, counts);
      if (counts.inserted + counts.exactReplay !== counts.stageRows) {
        throw new Error(
          `Release accounting recorded ${counts.inserted + counts.exactReplay} rows; the validated stage contains ${counts.stageRows}.`,
        );
      }
      await tx`
        update pac.ingest_runs
        set status = 'promoted', actual_counts = ${tx.json(counts)}, finished_at = now()
        where ingest_run_id = ${runId} and status = 'started'
      `;
    });
    await ensureTrustedSeedPublications(sql, stage);

    return {
      ok: true,
      mode: "applied",
      databaseChanged: counts.inserted > 0,
      ingestRunId: runId,
      stageSetSha256: stage.manifest.stageSetSha256,
      counts,
      staffPublicationDecisions: 25,
    };
  } catch (error) {
    if (runId) {
      await sql`
        update pac.ingest_runs
        set status = 'failed', failure_detail = ${String(error.message).slice(0, 4000)}, finished_at = now()
        where ingest_run_id = ${runId} and status = 'started'
      `.catch(() => undefined);
      if (error instanceof HardConflict) {
        await sql`
          insert into pac.ingest_entries (ingest_run_id, business_id, action, detail)
          values (${runId}, ${error.businessId}, 'conflict', ${sql.json({ message: error.message })})
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
    : DEFAULT_SEED_RELEASE_STAGE;
  const validated = validateSeedReleaseDirectory(stageDirectory);
  const stage = {
    manifest: validated.manifest,
    records: validated.rows,
    releaseManifest: JSON.parse(readFileSync(
      resolve(SEED_RELEASE_REPOSITORY_ROOT, validated.manifest.inputs.releaseManifest.path),
      "utf8",
    )),
  };
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({
      ok: true,
      mode: "validated_only",
      stageDirectory,
      stageSetSha256: stage.manifest.stageSetSha256,
      counts: stage.manifest.counts,
      databaseChanged: false,
      staffPublicationDecisions: stage.manifest.counts.staffPublicationDecisions,
    }, null, 2));
    return;
  }
  const confirmation = option("--confirm-release");
  if (confirmation !== stage.manifest.stageId) {
    throw new Error(`Applying this release requires --confirm-release ${stage.manifest.stageId}.`);
  }
  console.log(JSON.stringify(await applyRelease(stage), null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
