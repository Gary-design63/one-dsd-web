#!/usr/bin/env node

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  HardConflict,
  IMPORTER_LOCK_KEY,
  importBatchOptions,
  importerVersionFor,
  loadStageRowsBatched,
  queryCountComparison,
  validateStageDirectoryStreaming,
} from "./batched-import-lib.mjs";
import { DEFAULT_STAGE_DIRECTORY } from "./shadow-import-lib.mjs";

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

async function connect() {
  const url = process.env.PAC_DATABASE_URL;
  if (!url) throw new Error("Set the server-only PAC_DATABASE_URL before using --apply or --promote-run.");
  const { default: postgres } = await import("postgres");
  return postgres(url, { max: 1, prepare: false, ...databaseOptions(url) });
}

function stageRows(manifest) {
  return manifest.files.reduce((sum, file) => sum + file.records, 0);
}

function countsFromEntrySummary(summary, expectedRows) {
  const inserted = Number(summary.inserted ?? 0) + Number(summary.linked ?? 0);
  const exactReplay = Number(summary.exact_replay ?? 0);
  return { inserted, exactReplay, stageRows: expectedRows };
}

export function interruptedRunResolution(summary, expectedRows) {
  const receiptCount = Object.values(summary).reduce((sum, count) => sum + Number(count), 0);
  const acceptedCount = Number(summary.inserted ?? 0) + Number(summary.linked ?? 0) + Number(summary.exact_replay ?? 0);
  if (receiptCount === expectedRows && acceptedCount === expectedRows) {
    return {
      action: "recover",
      receiptCount,
      counts: countsFromEntrySummary(summary, expectedRows),
    };
  }
  return { action: "fail_and_retry", receiptCount, counts: null };
}

async function summarizeEntries(tx, runId, metrics) {
  metrics.queryCount += 1;
  const rows = await tx`
    select action, count(*)::integer as count
    from pac.ingest_entries
    where ingest_run_id = ${runId}
    group by action
  `;
  return Object.fromEntries(rows.map((row) => [row.action, Number(row.count)]));
}

async function resolvePreviousRuns(tx, manifest, metrics) {
  metrics.queryCount += 1;
  const priorRuns = await tx`
    select ingest_run_id, source_manifest_sha256, importer_version, expected_counts,
      actual_counts, status, started_at, finished_at, failure_detail
    from pac.ingest_runs
    where source_set_id = ${manifest.stageId}
    order by started_at, ingest_run_id
    for update
  `;

  const authoritative = priorRuns.filter((row) => row.status !== "failed");
  const conflicting = authoritative.find(
    (row) => row.source_manifest_sha256 && row.source_manifest_sha256 !== manifest.stageSetSha256,
  );
  if (conflicting) {
    throw new HardConflict(
      `stage:${manifest.stageId}`,
      "the stage ID was previously used with a different validated manifest hash",
    );
  }

  const expectedRows = stageRows(manifest);
  const completed = authoritative.find(
    (row) => ["validated", "promoted"].includes(row.status)
      && row.source_manifest_sha256 === manifest.stageSetSha256,
  );
  if (completed) {
    const summary = await summarizeEntries(tx, completed.ingest_run_id, metrics);
    const resolution = interruptedRunResolution(summary, expectedRows);
    const storedStageRows = Number(completed.actual_counts?.stageRows ?? 0);
    if (resolution.action !== "recover" || storedStageRows !== expectedRows) {
      throw new HardConflict(
        `stage:${manifest.stageId}`,
        "the completed ingest receipt set does not match the validated stage",
      );
    }
    return {
      kind: "completed",
      runId: completed.ingest_run_id,
      status: completed.status,
      counts: completed.actual_counts ?? resolution.counts,
      importerVersion: completed.importer_version,
    };
  }
  for (const interrupted of authoritative.filter(
    (row) => row.status === "started" && row.source_manifest_sha256 === manifest.stageSetSha256,
  )) {
    const summary = await summarizeEntries(tx, interrupted.ingest_run_id, metrics);
    const resolution = interruptedRunResolution(summary, expectedRows);

    if (resolution.action === "recover") {
      const counts = resolution.counts;
      metrics.queryCount += 1;
      await tx`
        update pac.ingest_runs
        set status = 'validated', actual_counts = ${tx.json(counts)},
          finished_at = coalesce(finished_at, now()),
          failure_detail = null
        where ingest_run_id = ${interrupted.ingest_run_id} and status = 'started'
      `;
      return {
        kind: "recovered",
        runId: interrupted.ingest_run_id,
        status: "validated",
        counts,
        importerVersion: interrupted.importer_version,
      };
    }

    metrics.queryCount += 1;
    await tx`
      update pac.ingest_runs
      set status = 'failed', finished_at = now(),
        failure_detail = ${`Recovered interrupted import with ${resolution.receiptCount} of ${expectedRows} required receipts; its staged decisions remain inactive.`}
      where ingest_run_id = ${interrupted.ingest_run_id} and status = 'started'
    `;
  }
  return { kind: "new" };
}

async function recordFailedAttempt(sql, manifest, importerVersion, error) {
  try {
    return await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtextextended(${IMPORTER_LOCK_KEY}, 0))`;
      await tx`
        update pac.ingest_runs
        set status = 'failed', finished_at = now(),
          failure_detail = ${`Interrupted run closed before retry: ${String(error.message).slice(0, 3800)}`}
        where source_set_id = ${manifest.stageId}
          and source_manifest_sha256 = ${manifest.stageSetSha256}
          and status = 'started'
      `;
      const [failed] = await tx`
        insert into pac.ingest_runs (
          source_set_id, source_manifest_sha256, importer_version,
          expected_counts, actual_counts, status, initiated_by,
          finished_at, failure_detail
        ) values (
          ${manifest.stageId}, ${manifest.stageSetSha256}, ${importerVersion},
          ${tx.json(manifest.counts)}, ${tx.json({ inserted: 0, exactReplay: 0, stageRows: stageRows(manifest) })},
          'failed', ${process.env.PAC_IMPORT_ACTOR ?? "program_owner_corpus_import"},
          now(), ${String(error.message).slice(0, 4000)}
        )
        returning ingest_run_id
      `;
      if (error instanceof HardConflict) {
        await tx`
          insert into pac.ingest_entries (ingest_run_id, business_id, action, detail)
          values (
            ${failed.ingest_run_id}, ${error.businessId}, 'conflict',
            ${tx.json({ message: error.message, importerVersion })}
          )
        `;
      }
      return failed.ingest_run_id;
    });
  } catch {
    return null;
  }
}

export async function applyStageV2(stageDirectory, manifest, providedSql = null) {
  const sql = providedSql ?? await connect();
  const ownsConnection = !providedSql;
  const importerVersion = importerVersionFor(manifest);
  const batchOptions = importBatchOptions();
  const controlMetrics = { queryCount: 0 };

  try {
    controlMetrics.queryCount += 1;
    const readiness = await sql`select to_regclass('pac.source_items') as source_items`;
    if (!readiness[0]?.source_items) throw new Error("PAC database migration 0001 has not been applied.");

    const result = await sql.begin(async (tx) => {
      controlMetrics.queryCount += 1;
      await tx`select pg_advisory_xact_lock(hashtextextended(${IMPORTER_LOCK_KEY}, 0))`;

      const previous = await resolvePreviousRuns(tx, manifest, controlMetrics);
      if (previous.kind !== "new") {
        return {
          ok: true,
          ingestRunId: previous.runId,
          status: previous.status,
          counts: previous.counts,
          stageExactReplay: previous.kind === "completed",
          interruptedRunRecovered: previous.kind === "recovered",
          importerVersion: previous.importerVersion,
          batch: { ...batchOptions, batches: 0, queryCount: 0, maxBatchRows: 0, maxBatchBytes: 0 },
        };
      }

      controlMetrics.queryCount += 1;
      const [run] = await tx`
        insert into pac.ingest_runs (
          source_set_id, source_manifest_sha256, importer_version,
          expected_counts, status, initiated_by
        ) values (
          ${manifest.stageId}, ${manifest.stageSetSha256}, ${importerVersion},
          ${tx.json(manifest.counts)}, 'started',
          ${process.env.PAC_IMPORT_ACTOR ?? "program_owner_corpus_import"}
        ) returning ingest_run_id
      `;

      const loaded = await loadStageRowsBatched({
        tx,
        runId: run.ingest_run_id,
        stageDirectory,
        manifest,
        batchOptions,
      });

      controlMetrics.queryCount += 1;
      const [receiptCount] = await tx`
        select count(*)::integer as count
        from pac.ingest_entries
        where ingest_run_id = ${run.ingest_run_id}
      `;
      if (Number(receiptCount.count) !== loaded.counts.stageRows) {
        throw new Error(
          `Import run has ${receiptCount.count} accounting entries; ${loaded.counts.stageRows} were required.`,
        );
      }

      controlMetrics.queryCount += 1;
      await tx`
        update pac.ingest_runs
        set status = 'validated', actual_counts = ${tx.json({
          ...loaded.counts,
          batches: loaded.metrics.batches,
          databaseQueries: loaded.metrics.queryCount + controlMetrics.queryCount,
        })}, finished_at = now()
        where ingest_run_id = ${run.ingest_run_id} and status = 'started'
      `;

      return {
        ok: true,
        ingestRunId: run.ingest_run_id,
        status: "validated",
        counts: loaded.counts,
        stageExactReplay: false,
        interruptedRunRecovered: false,
        importerVersion,
        batch: { ...batchOptions, ...loaded.metrics },
      };
    });

    const comparison = queryCountComparison(
      result.counts?.stageRows ?? stageRows(manifest),
      result.batch.batches,
      controlMetrics.queryCount,
    );
    return {
      ...result,
      databaseQueries: controlMetrics.queryCount + result.batch.queryCount,
      queryCountComparison: comparison,
      currentMembershipsChanged: false,
      staffPublicationDecisionsCreated: 0,
      nextStep: result.status === "validated"
        ? `Review the validated run, then explicitly use --promote-run ${result.ingestRunId} to make its collection memberships current.`
        : null,
    };
  } catch (error) {
    if (!providedSql) await recordFailedAttempt(sql, manifest, importerVersion, error);
    throw error;
  } finally {
    if (ownsConnection) await sql.end();
  }
}

export async function promoteRunV2(runId, providedSql = null) {
  const sql = providedSql ?? await connect();
  const ownsConnection = !providedSql;
  try {
    return await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtextextended(${IMPORTER_LOCK_KEY}, 0))`;
      const rows = await tx`
        select ingest_run_id, source_set_id, status, expected_counts, actual_counts
        from pac.ingest_runs where ingest_run_id = ${runId}
        for update
      `;
      if (rows.length !== 1) throw new Error(`Ingest run ${runId} does not exist.`);
      if (rows[0].status !== "validated") throw new Error(`Ingest run ${runId} is ${rows[0].status}, not validated.`);
      const [entryCount] = await tx`
        select count(*)::integer as count from pac.ingest_entries where ingest_run_id = ${runId}
      `;
      const stagedRows = Number(rows[0].actual_counts?.stageRows ?? 0);
      if (!stagedRows || Number(entryCount.count) !== stagedRows) {
        throw new Error(
          `Ingest run ${runId} has ${entryCount.count} accounting entries but reports ${stagedRows} staged rows.`,
        );
      }
      const updated = await tx`
        update pac.ingest_runs
        set status = 'promoted', finished_at = now()
        where ingest_run_id = ${runId} and status = 'validated'
      `;
      if (Number(updated.count) !== 1) throw new Error(`Ingest run ${runId} could not be promoted.`);
      return { ok: true, promotedRunId: runId, staffPublicationDecisionsCreated: 0 };
    });
  } finally {
    if (ownsConnection) await sql.end();
  }
}

export async function main() {
  const stageDirectory = option("--stage")
    ? resolve(process.cwd(), option("--stage"))
    : DEFAULT_STAGE_DIRECTORY;
  const promoteRunId = option("--promote-run");
  if (promoteRunId) {
    console.log(JSON.stringify(await promoteRunV2(promoteRunId), null, 2));
    return;
  }

  const manifest = await validateStageDirectoryStreaming(stageDirectory);
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({
      ok: true,
      mode: "validated_only",
      stageDirectory,
      stageSetSha256: manifest.stageSetSha256,
      counts: manifest.counts,
      importerVersion: importerVersionFor(manifest),
      batch: importBatchOptions(),
      databaseChanged: false,
      staffPublicationDecisions: 0,
    }, null, 2));
    return;
  }
  console.log(JSON.stringify(await applyStageV2(stageDirectory, manifest), null, 2));
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main().catch((error) => {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exit(1);
  });
}

