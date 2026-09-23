#!/usr/bin/env node

// Default: exercise the full release in one transaction, then roll it back.
// --apply is the only commit path. PostgreSQL sequence allocations can advance
// during a rolled-back rehearsal; no publication or archive rows are committed.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import Module, { createRequire } from "node:module";
import { resolve } from "node:path";
import postgres from "postgres";

const root = resolve(import.meta.dirname, "../..");
const directory = resolve(root, "db/migrations");
const apply = process.argv.includes("--apply");
if (process.argv.slice(2).some(arg => arg !== "--apply")) throw new Error("Only --apply is supported; no argument runs a rollback rehearsal.");
const actor = "owner-authorized-approved-production-release";
// 0026 is a verified platform prerequisite for the immutable 0016 migration.
const pendingNumbers = [27, 26, 9, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 23, 24, 25];
const hash = text => createHash("sha256").update(text).digest("hex").toUpperCase();
const canonical = value => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right))) : item);
const copyHash = value => hash(canonical(value));
const files = readdirSync(directory).filter(name => /^\d+.*\.sql$/.test(name)).sort();
const migrations = pendingNumbers.map(number => {
  const matches = files.filter(name => Number(name.split("_")[0]) === number);
  if (matches.length !== 1) throw new Error(`Expected exactly one migration numbered ${number}.`);
  const name = matches[0];
  const source = readFileSync(resolve(directory, name), "utf8");
  // Permit leading SQL comments, but remove only the outer transaction pair.
  const opening = /^(\s*(?:(?:--[^\r\n]*(?:\r?\n|$))\s*)*)BEGIN\s*;/i;
  const closing = /COMMIT\s*;\s*$/i;
  if (!opening.test(source) || !closing.test(source)) throw new Error(`Migration ${name} does not have the expected outer transaction.`);
  return { name, source, sha256: hash(source), body: source.replace(opening, "$1").replace(closing, "") };
});

// Use the same TypeScript loading convention as the existing read-only seed
// exporters. Export current validated defaults, never scrape rendered HTML or
// copy the obsolete historical migration's Home/footer wording.
function approvedPageCopy() {
  const require = createRequire(import.meta.url);
  const ts = require("typescript");
  const originalResolve = Module._resolveFilename;
  const originalTs = require.extensions[".ts"];
  Module._resolveFilename = function(request, parent, isMain, options) {
    return originalResolve.call(this, request.startsWith("@/") ? resolve(root, request.slice(2)) : request, parent, isMain, options);
  };
  require.extensions[".ts"] = function(module, filename) {
    const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.Node10, target: ts.ScriptTarget.ES2022 }, fileName: filename,
    });
    module._compile(compiled.outputText, filename);
  };
  try {
    const contract = require(resolve(root, "lib/content/page-copy-contract.ts"));
    return [
      { id: "page-home", copy: contract.HomePageCopySchema.parse(contract.STATIC_HOME_COPY) },
      { id: "site-footer", copy: contract.FooterCopySchema.parse(contract.STATIC_FOOTER_COPY) },
    ];
  } finally {
    Module._resolveFilename = originalResolve;
    if (originalTs) require.extensions[".ts"] = originalTs;
    else delete require.extensions[".ts"];
  }
}
const approved = approvedPageCopy();
if (!process.env.PAC_DATABASE_URL) throw new Error("Database setup credentials are required.");
const sql = postgres(process.env.PAC_DATABASE_URL, {
  ssl: process.env.PAC_DATABASE_SSL === "disable" ? false : "require",
  max: 1, prepare: false, connect_timeout: 15, onnotice: () => {},
});
const rehearsalRollback = new Error("approved-release-rehearsal-rollback");
let phase = "begin";
let report;
try {
  await sql.begin(async tx => {
    await tx`select pg_advisory_xact_lock(hashtextextended('one-dhs-pac-schema-migrations', 0))`;
    await tx`set local lock_timeout = '10s'`;
    phase = "validate-history";
    const ledger = await tx`select migration_name,migration_sha256 from pac.schema_migrations order by migration_name`;
    for (const row of ledger) {
      if (!files.includes(row.migration_name) || hash(readFileSync(resolve(directory, row.migration_name), "utf8")) !== row.migration_sha256.toUpperCase()) {
        throw new Error(`Migration history differs: ${row.migration_name}`);
      }
    }
    const already = new Set(ledger.map(row => row.migration_name));
    const actions = [];
    async function applyMigration(migration) {
      phase = `migration:${migration.name}`;
      if (already.has(migration.name)) { actions.push({ name: migration.name, action: "already_applied" }); return; }
      await tx.unsafe(migration.body);
      await tx`insert into pac.schema_migrations(migration_name,migration_sha256,applied_by)
        values(${migration.name},${migration.sha256},${actor})`;
      actions.push({ name: migration.name, action: "applied_in_transaction" });
    }
    const baseline = {};
    for (const scope of ["one-dhs", "dsd"]) {
      baseline[scope] = await tx`select content_item_id,payload_sha256 from pac.read_staff_publications(${scope},null) order by content_item_id`;
      if (baseline[scope].length !== 25) throw new Error(`Expected the approved 25-resource baseline in ${scope}.`);
    }
    await applyMigration(migrations[0]);
    phase = "quarantine-legacy-verification";
    const legacy = await tx`select * from pac.runtime_work_objects where work_kind='decision' and object_id='runtime-verification-2026-09-05' for update`;
    let quarantined = false;
    if (legacy.length) {
      const keys = Object.keys(legacy[0].value).sort();
      if (canonical(keys) !== canonical(["purpose", "status"])) throw new Error("The named legacy verification row changed; operator review is required.");
      await tx`insert into pac.owner_release_legacy_archive(archive_key,source_table,original_row,archived_by,reason)
        select 'runtime-verification-2026-09-05','pac.runtime_work_objects',to_jsonb(work),${actor},
          'Preserve the named legacy connection-verification record outside the registered operational record families.'
        from pac.runtime_work_objects work where work_kind='decision' and object_id='runtime-verification-2026-09-05'
        on conflict(archive_key) do nothing`;
      const [match] = await tx`select archive.original_row=to_jsonb(work) as identical
        from pac.owner_release_legacy_archive archive join pac.runtime_work_objects work
        on work.work_kind='decision' and work.object_id='runtime-verification-2026-09-05'
        where archive.archive_key='runtime-verification-2026-09-05'`;
      if (match?.identical !== true) throw new Error("Legacy archive does not match the full original record.");
      const moved = await tx`delete from pac.runtime_work_objects where work_kind='decision' and object_id='runtime-verification-2026-09-05' returning object_id`;
      if (moved.length !== 1) throw new Error("The exact legacy verification record was not moved.");
      quarantined = true;
    }
    for (const migration of migrations.slice(1)) await applyMigration(migration);
    phase = "publish-current-approved-home-footer";
    // Migration 0025 orders pending and completed page reviews chronologically.
    const pages = [];
    for (const page of approved) {
      const current = await tx`select canonical_payload from pac.read_page_block_publication('one-dhs',${page.id})`;
      if (current.length === 1 && copyHash(current[0].canonical_payload.copy) === copyHash(page.copy)) {
        pages.push({ id: page.id, action: "already_current", sha256: copyHash(page.copy) }); continue;
      }
      let [row] = await tx`select pac.read_page_block_editing_state('one-dhs',${page.id}) as state`;
      if (!row?.state || row.state.hasUnpublishedChanges) throw new Error(`Unpublished work exists for ${page.id}; preserve it for operator review.`);
      [row] = await tx`select pac.create_page_block_draft('one-dhs',${page.id},${row.state.expectedRevisionId}::uuid,
        ${tx.json(page.copy)},'Publish the current approved Home and footer wording with this release.') as state`;
      const revisionId = row.state.expectedRevisionId;
      for (const review of row.state.reviews) {
        [row] = await tx`select pac.record_page_block_review('one-dhs',${page.id},${revisionId}::uuid,
          ${review.dimension},'pass',${review.reviewId}::uuid,
          'Release the exact current wording accepted by the owner, with no additional content changes.') as state`;
      }
      if (!row.state.canPublish) throw new Error(`Required page review did not complete for ${page.id}.`);
      await tx`select pac.publish_page_block_draft('one-dhs',${page.id},${revisionId}::uuid,
        ${row.state.publicationDecisionId}::bigint,'Publish the current approved wording; preserve previous versions in history.')`;
      pages.push({ id: page.id, action: "published_current_approved_copy", sha256: copyHash(page.copy) });
    }
    phase = "verify-compatibility-functions";
    const signatures = [
      "pac.consume_runtime_rate_limit(text,text,integer,integer)",
      "pac.compare_and_swap_consultation(text,integer,text,text,text,timestamp with time zone,jsonb)",
      "pac.purge_expired_security_records()",
      "pac.read_staff_graph_neighbors(text,text,integer)",
      "pac.read_owner_corpus_inventory(text,text,integer,integer)",
      "pac.read_resource_editing_state(text,text)",
      "pac.read_surface_publication(text,text)",
    ];
    for (const signature of signatures) {
      const [functionRow] = await tx`select to_regprocedure(${signature}) is not null as present,
        has_function_privilege('pac_app_runtime',${signature},'EXECUTE') as allowed`;
      if (!functionRow.present || !functionRow.allowed) throw new Error(`Required runtime function unavailable: ${signature}`);
    }
    const [housekeeping] = await tx`select pg_get_function_result('pac.purge_expired_security_records()'::regprocedure) as result`;
    for (const column of ["owner_session_revocations_deleted", "rate_limit_buckets_deleted", "audit_events_deleted", "research_usage_records_deleted", "consultation_tombstones_deleted", "idempotency_receipts_deleted"]) {
      if (!housekeeping.result.includes(column)) throw new Error("Housekeeping return columns are incompatible.");
    }
    phase = "verify-owner-archive";
    if (quarantined) {
      const [archive] = await tx`select not has_table_privilege('pac_app_runtime','pac.owner_release_legacy_archive','SELECT') as private,
        (select count(*) from pac.owner_release_legacy_archive where archive_key='runtime-verification-2026-09-05')=1 as retained`;
      if (!archive.private || !archive.retained) throw new Error("Legacy archive preservation or access restriction failed.");
    }
    // This setup principal cannot SET ROLE on the managed database. Exercise
    // the same security-definer read functions without granting membership;
    // verify execution privileges separately and require true runtime reads
    // after commit, when a separate runtime connection can see the new schema.
    phase = "setup-role-read-smoke";
    for (const scope of ["one-dhs", "dsd"]) {
      phase = `setup-read:${scope}:resources`;
      const preserved = await tx`select content_item_id,payload_sha256 from pac.read_staff_publications(${scope},null) order by content_item_id`;
      if (canonical(preserved) !== canonical(baseline[scope])) throw new Error(`The approved resource payloads changed in ${scope}.`);
      for (const page of approved) {
        phase = `setup-read:${scope}:${page.id}`;
        const rows = await tx`select canonical_payload from pac.read_page_block_publication(${scope},${page.id})`;
        if (rows.length !== 1 || copyHash(rows[0].canonical_payload.copy) !== copyHash(page.copy)) throw new Error(`Effective ${scope} ${page.id} does not match current approved wording.`);
      }
      phase = `setup-read:${scope}:toolkit`;
      const toolkit = await tx`select * from pac.read_surface_publication(${scope},'equity-toolkit.home')`;
      if (toolkit.length !== 1) throw new Error(`The toolkit publication is missing in ${scope}.`);
      phase = `setup-read:${scope}:graph`;
      await tx`select * from pac.read_staff_graph_neighbors(${scope},'ext-dhs-equity-toolkit',4)`;
      phase = `setup-read:${scope}:inventory`;
      await tx`select pac.read_owner_corpus_inventory(${scope},'',40,0)`;
      phase = `setup-read:${scope}:resource-editing`;
      await tx`select * from pac.read_resource_editing_state(${scope},'ext-dhs-equity-toolkit')`;
    }
    report = { status: apply ? "committed" : "validated_and_rolled_back", migrations: actions, legacyRecordPreservedInOwnerArchive: quarantined,
      reviewOrdering: "clock_timestamp", pages, resourcesPreservedPerScope: 25, setupRoleReadsVerified: true,
      runtimeExecutionGrantsVerified: true, actualRuntimeCredentialSmokeRequiredAfterCommit: true,
      mutationFunctionsNotInvoked: ["rate_limit", "consultation_cas", "housekeeping"],
      sequenceNote: "Rollback rehearsals can advance sequence counters without committing rows." };
    if (!apply) throw rehearsalRollback;
  });
  console.log(JSON.stringify(report));
} catch (error) {
  if (error === rehearsalRollback) console.log(JSON.stringify(report));
  else {
    // SQL statements, connection strings, parameters, row values and error detail
    // are intentionally excluded from diagnostics.
    console.error(JSON.stringify({ status: "rolled_back", phase, code: error.code ?? error.name,
      message: (error.code === "42883" && /^function [a-zA-Z0-9_.]+\([a-zA-Z0-9_ ,\[\]]*\) does not exist$/.test(error.message))
        || (error.code === "42501" && /^permission denied to set role "[a-zA-Z0-9_]+"$/.test(error.message))
        ? error.message : error.code ? "Database validation failed; inspect the named phase with owner access." : error.message }));
    process.exitCode = 1;
  }
} finally { await sql.end({ timeout: 5 }); }
