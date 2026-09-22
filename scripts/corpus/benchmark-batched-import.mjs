#!/usr/bin/env node

import { performance } from "node:perf_hooks";

import {
  DEFAULT_IMPORT_BATCH_SIZE,
  queryCountComparison,
} from "./batched-import-lib.mjs";

function numericOption(name, fallback, maximum) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? Number(process.argv[index + 1]) : fallback;
  if (!Number.isInteger(value) || value < 1 || value > maximum) {
    throw new Error(`${name} must be an integer from 1 through ${maximum}.`);
  }
  return value;
}

function batches(rows, size) {
  const result = [];
  for (let index = 0; index < rows.length; index += size) {
    result.push(rows.slice(index, index + size));
  }
  return result;
}

async function localDatabaseBenchmark(url, rowCount, batchSize) {
  const parsed = new URL(url);
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error("PAC_IMPORT_BENCHMARK_DATABASE_URL must point to a local PostgreSQL server.");
  }
  const { default: postgres } = await import("postgres");
  const sql = postgres(url, { max: 1, prepare: false, ssl: false });
  const rows = Array.from({ length: rowCount }, (_, index) => ({
    id: index + 1,
    payload: { title: `Synthetic resource ${index + 1}`, status: "held_for_review" },
  }));
  try {
    return await sql.begin(async (tx) => {
      await tx`
        create temporary table pac_import_batch_benchmark (
          id integer primary key,
          payload jsonb not null
        ) on commit drop
      `;

      const legacyStarted = performance.now();
      for (const row of rows) {
        await tx`
          insert into pac_import_batch_benchmark (id, payload)
          values (${row.id}, ${tx.json(row.payload)})
        `;
      }
      const legacyMilliseconds = performance.now() - legacyStarted;
      await tx`truncate pac_import_batch_benchmark`;

      const grouped = batches(rows, batchSize);
      const batchedStarted = performance.now();
      for (const batch of grouped) {
        await tx.unsafe(`
          with stage as (
            select * from jsonb_to_recordset($1::jsonb) as s(id integer, payload jsonb)
          )
          insert into pac_import_batch_benchmark (id, payload)
          select id, payload from stage
        `, [batch]);
      }
      const batchedMilliseconds = performance.now() - batchedStarted;
      return {
        rows: rowCount,
        batchSize,
        legacyQueries: rowCount,
        batchedQueries: grouped.length,
        legacyMilliseconds: Math.round(legacyMilliseconds),
        batchedMilliseconds: Math.round(batchedMilliseconds),
        elapsedTimeReduction: legacyMilliseconds
          ? 1 - batchedMilliseconds / legacyMilliseconds
          : null,
      };
    });
  } finally {
    await sql.end();
  }
}

async function main() {
  const projectedRows = numericOption("--projected-rows", 50_000, 1_000_000);
  const batchSize = numericOption("--batch-size", DEFAULT_IMPORT_BATCH_SIZE, 2000);
  const projectedBatches = Math.ceil(projectedRows / batchSize);
  const localUrl = process.env.PAC_IMPORT_BENCHMARK_DATABASE_URL;
  const localRows = numericOption("--local-rows", 5000, 50_000);
  const local = localUrl
    ? await localDatabaseBenchmark(localUrl, localRows, batchSize)
    : { status: "skipped", reason: "PAC_IMPORT_BENCHMARK_DATABASE_URL is not set to a local PostgreSQL database." };

  console.log(JSON.stringify({
    ok: true,
    projection: {
      rows: projectedRows,
      batchSize,
      batches: projectedBatches,
      ...queryCountComparison(projectedRows, projectedBatches),
    },
    localDatabaseBenchmark: local,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});

