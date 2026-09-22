#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(import.meta.dirname, "../..");
const FIRST = 39;
const LAST = 48;
const ACTOR = "owner-authorized-functional-release-2026-09-08";
const HISTORY_RECEIPT = "evidence/local-audit-2026-09-07/production-database-readiness.json";
const HISTORY_RECEIPT_SHA256 = "EA347BD857F0062B85B013726FAF32B39FFF782F91C408262362B52206297A68";
const HISTORY_RECEIPT_NORMALIZED_SHA256 = "EA347BD857F0062B85B013726FAF32B39FFF782F91C408262362B52206297A68";
export const HISTORICAL_LEDGER_VARIANTS = Object.freeze({
  "0001_pac_content_foundation.sql": {
    recordedSha256: "7C1C2BE6DE36A2611A9BDB9E3BD54B193FF8A2D94D0F0004E762AFBE7C692AE8",
    repositorySha256: "FF4E3CDD00C193544F7008000EFA78049CF082C68260599A02859C5097902C0D",
  },
  "0007_pac_home_footer_content.sql": {
    recordedSha256: "8B1FCE29CF8D0D69DA59088EF920CB1426E23F4427FD20FAD6273D08D5FE08C9",
    repositorySha256: "F26B0C9E10016BAED67D4B861F692A7636CB93DE11B33B0C76FDE3B309F5A100",
  },
});
const OWNER_FUNCTIONS = [
  "read_resource_editing_state", "create_resource_draft", "read_resource_release_state",
  "list_resource_release_queue", "record_resource_review", "publish_resource_draft",
  "withdraw_resource_publication", "republish_resource_revision", "enforce_publication_gate",
  "save_owner_approved_page_block", "save_owner_approved_surface", "read_page_block_publication",
  "read_page_block_editing_state", "create_page_block_draft", "record_page_block_review",
  "publish_page_block_draft", "read_surface_publication", "read_surface_editing_state",
];
const PRESERVED_TABLES = [
  "source_items", "content_items", "content_revisions", "review_records", "publication_decisions",
  "change_events", "resource_owner_approvals", "page_block_owner_approvals", "surface_owner_approvals",
  "surface_definitions", "surface_revisions", "surface_reviews", "surface_publication_decisions",
];
const REQUIRED_RUNTIME_FUNCTIONS = [
  "pac.append_program_event(text,text,jsonb)", "pac.append_ask_response_record(jsonb)",
  "pac.list_ask_response_records(integer,timestamptz,uuid,timestamptz)",
  "pac.delete_ask_response_records(jsonb)", "pac.purge_expired_ask_response_records(timestamptz)",
];
const REQUIRED_FUNCTIONS = [
  "pac.valid_ask_practice_artifact(jsonb)", "pac.valid_ask_source_evidence(jsonb)",
  "pac.valid_ask_evidence_claims(jsonb)", "pac.prepare_isolated_program_restore(text,uuid)",
  "pac.run_protected_content_mutation(text,text,text,text,text,text,text,text,text,jsonb)",
  "public.digest(text,text)",
];
const NAMED_TABLES = [
  "program_accounts", "program_account_invitations", "program_account_credentials",
  "program_account_sessions", "protected_action_authorizations", "program_recovery_preparations",
];

export class ReleaseCheckError extends Error {
  constructor(code, subject) {
    super(code);
    this.code = code;
    this.subject = subject;
  }
}
const fail = (code, subject) => { throw new ReleaseCheckError(code, subject); };
export const migrationHash = (source) => createHash("sha256").update(source).digest("hex").toUpperCase();

/** Remove only a migration's optional outer transaction, preserving every function body. */
export function migrationBody(source, name) {
  const opening = /^(\s*(?:(?:--[^\r\n]*(?:\r?\n|$))\s*)*)begin\s*;/i;
  const closing = /commit\s*;\s*$/i;
  const hasOpening = opening.test(source);
  const hasClosing = closing.test(source);
  if (hasOpening !== hasClosing) fail("unpaired_outer_transaction", name);
  return hasOpening ? source.replace(opening, (_match, comments) => comments).replace(closing, "") : source;
}

export function releaseMigrations(directory = resolve(ROOT, "db/migrations")) {
  const files = readdirSync(directory).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
  const numbers = new Set();
  return files.map((name) => {
    const number = Number(name.split("_")[0]);
    if (numbers.has(number)) fail("duplicate_migration_number", String(number));
    numbers.add(number);
    const source = readFileSync(resolve(directory, name), "utf8");
    return { name, number, sha256: migrationHash(source), crlfSha256: migrationHash(source.replaceAll("\r\n", "\n").replaceAll("\n", "\r\n")), body: migrationBody(source, name) };
  });
}

/** Two exact pairs were independently verified in the prior production receipt; no general mismatch bypass exists. */
export function appliedMigrationVariant(file, storedHash) {
  const hash = String(storedHash).toUpperCase();
  if (hash === file.sha256) return "exact_bytes";
  const approved = HISTORICAL_LEDGER_VARIANTS[file.name];
  if (approved && hash === approved.recordedSha256 && file.sha256 === approved.repositorySha256) return "verified_prior_line_ending_receipt";
  fail("migration_history_hash_mismatch", file.name);
}

function verifyHistoricalReceipt() {
  const bytes = readFileSync(resolve(ROOT, HISTORY_RECEIPT));
  if (migrationHash(bytes.toString("utf8").replaceAll("\r\n", "\n")) !== HISTORY_RECEIPT_NORMALIZED_SHA256) fail("historical_receipt_changed", HISTORY_RECEIPT);
  const receipt = JSON.parse(bytes.toString("utf8"));
  for (const [name, expected] of Object.entries(HISTORICAL_LEDGER_VARIANTS)) {
    const row = receipt.ledger?.find((item) => item.name === name);
    if (!row || row.normalizedEqual !== true || row.storedHash.toUpperCase() !== expected.recordedSha256
      || row.originalHash.toUpperCase() !== expected.recordedSha256 || row.currentHash.toUpperCase() !== expected.repositorySha256) {
      fail("historical_receipt_provenance_mismatch", name);
    }
  }
}

/** Exact history is checked for every applied row, not just this release's range. */
export function pendingReleaseMigrations(files, ledger) {
  const byName = new Map(files.map((file) => [file.name, file]));
  const applied = new Set();
  for (const row of ledger) {
    const file = byName.get(row.migration_name);
    if (!file) fail("unknown_applied_migration", "schema_migrations");
    if (applied.has(file.name)) fail("duplicate_applied_migration", file.name);
    appliedMigrationVariant(file, row.migration_sha256);
    applied.add(file.name);
  }
  for (const file of files) {
    if (file.number < FIRST && !applied.has(file.name)) fail("older_migration_missing", file.name);
    if (file.number > LAST && !applied.has(file.name)) fail("newer_pending_migration_outside_release", file.name);
  }
  for (let number = FIRST; number <= LAST; number += 1) {
    if (!files.some((file) => file.number === number)) fail("release_migration_missing", String(number));
  }
  return files.filter((file) => file.number >= FIRST && file.number <= LAST && !applied.has(file.name));
}

export function parseReleaseArguments(args, root = ROOT) {
  let apply = false;
  let receiptPath;
  for (const argument of args) {
    if (argument === "--apply" && !apply) apply = true;
    else if (argument.startsWith("--receipt=") && !receiptPath) {
      receiptPath = resolve(root, argument.slice("--receipt=".length));
      const evidenceRoot = resolve(root, "evidence") + "/";
      if (!receiptPath.replaceAll("\\", "/").toLowerCase().startsWith(evidenceRoot.replaceAll("\\", "/").toLowerCase()) || !receiptPath.endsWith(".json")) {
        fail("receipt_must_be_json_under_repository_evidence", "receipt");
      }
    } else fail("unsupported_argument", "arguments");
  }
  return { apply, receiptPath };
}

async function ownerAccessSnapshot(tx) {
  const [functions] = await tx.unsafe(`select count(*)::int as count,array_agg(distinct p.proname order by p.proname) as names,
    encode(sha256(convert_to(coalesce(string_agg(
      p.oid::regprocedure::text || ':' || pg_get_functiondef(p.oid) || ':' || coalesce(p.proacl::text,'') || ':' || p.proowner::text,
      E'\\n' order by p.oid::regprocedure::text),''),'UTF8')),'hex') as sha256
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='pac' and p.proname=any($1::text[])`, [OWNER_FUNCTIONS]);
  if (OWNER_FUNCTIONS.some((name) => !functions.names?.includes(name))) fail("owner_function_baseline_incomplete", "owner_functions");
  const roles = await tx.unsafe(`select rolname,rolcanlogin,rolinherit,rolsuper,rolcreatedb,rolcreaterole,rolreplication,rolbypassrls,rolconnlimit,rolconfig
    from pg_roles where rolname='pac_app_runtime' or rolname=current_user order by rolname`);
  if (!roles.some((role) => role.rolname === "pac_app_runtime")) fail("existing_runtime_role_missing", "pac_app_runtime");
  const memberships = await tx.unsafe(`select member.rolname as member, parent.rolname as parent,m.admin_option
    from pg_auth_members m join pg_roles member on member.oid=m.member join pg_roles parent on parent.oid=m.roleid
    where member.rolname='pac_app_runtime' or parent.rolname='pac_app_runtime' order by member.rolname,parent.rolname`);
  const privileges = await tx.unsafe(`select c.relname,c.relacl::text as privileges,c.relrowsecurity,c.relforcerowsecurity
    from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='pac' and c.relname=any($1::text[]) order by c.relname`, [PRESERVED_TABLES]);
  return { functions, roleCount: roles.length, rolesSha256: migrationHash(JSON.stringify(roles)),
    membershipsSha256: migrationHash(JSON.stringify(memberships)), tablePrivilegesSha256: migrationHash(JSON.stringify(privileges)) };
}

/** Canonical rows are hashed inside PostgreSQL; bodies never leave this query. */
async function contentSnapshot(tx) {
  const result = {};
  for (const table of PRESERVED_TABLES) {
    const [exists] = await tx.unsafe("select to_regclass($1::text) is not null as present", ["pac." + table]);
    if (!exists.present) fail("preservation_table_missing", table);
    const [fingerprint] = await tx.unsafe(`select count(*)::int as count,
      encode(sha256(convert_to(coalesce(string_agg(row_hash,E'\\n' order by row_hash),''),'UTF8')),'hex') as sha256
      from (select encode(sha256(convert_to((to_jsonb(r)-'protected_authorization_id')::text,'UTF8')),'hex') as row_hash
      from pac.${table} r) hashes`);
    result[table] = fingerprint;
  }
  const [askCount] = await tx.unsafe("select count(*)::int as count from pac.ask_response_records");
  result.askResponseRecordCount = askCount.count;
  return result;
}

async function namedInactiveSnapshot(tx) {
  const result = {};
  for (const table of NAMED_TABLES) {
    const [exists] = await tx.unsafe("select to_regclass($1::text) is not null as present", ["pac." + table]);
    if (!exists.present) { result[table] = 0; continue; }
    const [row] = await tx.unsafe(`select count(*)::int as count from pac.${table}`);
    result[table] = row.count;
    if (row.count !== 0) fail("named_access_or_recovery_already_used", table);
  }
  const [events] = await tx.unsafe("select to_regclass('pac.protected_feature_activation_events') is not null as present");
  if (events.present) {
    const [row] = await tx.unsafe(`select count(*)::int as count from (
      select distinct on(environment,feature_key) state from pac.protected_feature_activation_events
      order by environment,feature_key,activation_event_id desc) latest where state='active'`);
    result.activeFeatures = row.count;
    if (row.count !== 0) fail("named_features_already_active", "protected_feature_activation_events");
  } else result.activeFeatures = 0;
  return result;
}

async function releaseReadiness(tx) {
  const functions = [];
  for (const signature of [...REQUIRED_RUNTIME_FUNCTIONS, ...REQUIRED_FUNCTIONS]) {
    const [row] = await tx.unsafe("select to_regprocedure($1::text) is not null as present", [signature]);
    if (!row.present) fail("required_function_missing", signature);
    const [access] = await tx.unsafe("select has_function_privilege('pac_app_runtime',$1::text,'EXECUTE') as runtime_allowed", [signature]);
    if (REQUIRED_RUNTIME_FUNCTIONS.includes(signature) && !access.runtime_allowed) fail("runtime_function_not_granted", signature);
    if (signature === "pac.prepare_isolated_program_restore(text,uuid)" && access.runtime_allowed) fail("restore_preparation_exposed", signature);
    functions.push({ signature, present: true, runtimeAllowed: access.runtime_allowed });
  }
  const roles = await tx.unsafe(`select rolname,rolcanlogin,rolinherit,rolsuper,rolcreatedb,rolcreaterole,rolreplication,rolbypassrls,rolconnlimit
    from pg_roles where rolname in ('pac_contributor_runtime','pac_authentication_broker') order by rolname`);
  if (roles.length !== 2 || roles.some((role) => !role.rolcanlogin || role.rolinherit || role.rolsuper || role.rolcreatedb || role.rolcreaterole || role.rolreplication || role.rolbypassrls || role.rolconnlimit < 1 || role.rolconnlimit > 20)) {
    fail("named_database_role_boundary_invalid", "named_roles");
  }
  const [ownerAccess] = await tx.unsafe(`select count(*)::int as count from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='pac' and p.proname=any($1::text[]) and (
      has_function_privilege('pac_contributor_runtime',p.oid,'EXECUTE') or has_function_privilege('pac_authentication_broker',p.oid,'EXECUTE'))`, [OWNER_FUNCTIONS]);
  if (ownerAccess.count !== 0) fail("named_role_has_existing_owner_function_access", "owner_functions");
  const [constraint] = await tx.unsafe(`select exists(select 1 from pg_constraint
    where conrelid='pac.ask_response_records'::regclass and conname='ask_record_contract' and convalidated
      and pg_get_constraintdef(oid) like '%valid_ask_evidence_claims%'
      and pg_get_constraintdef(oid) like '%valid_ask_practice_artifact%') as ready`);
  if (!constraint.ready) fail("ask_optional_record_contract_missing", "ask_record_contract");
  return { functions, namedRoleCount: roles.length, namedOwnerFunctionAccess: ownerAccess.count, askRecordContract: "validated" };
}

function safeFailure(error, phase) {
  const approvedMessage = typeof error?.message === "string" && /^(?:Unsafe existing pac_(?:contributor_runtime|authentication_broker) role|permission denied (?:for|to) |must be (?:owner|superuser|able to SET ROLE)|The pac_auth schema must |Every pre-existing pac_auth object must )/.test(error.message)
    && error.message.length <= 300 && !/[\r\n]/.test(error.message) ? error.message : undefined;
  return { ok: false, phase, code: error instanceof ReleaseCheckError ? error.code : /^[A-Z0-9]{5}$/.test(error?.code ?? "") ? error.code : "migration_rehearsal_failed",
    ...(error instanceof ReleaseCheckError ? { subject: error.subject } : {}),
    ...(approvedMessage ? { databaseMessage: approvedMessage } : {}),
    ...(typeof error?.routine === "string" && /^[a-zA-Z0-9_]{1,80}$/.test(error.routine) ? { databaseRoutine: error.routine } : {}),
    ...(typeof error?.position === "string" && /^\d+$/.test(error.position) ? { sqlPosition: Number(error.position) } : {}) };
}

export async function runFunctionalMigrationRelease(args = process.argv.slice(2), environment = process.env) {
  const { apply, receiptPath } = parseReleaseArguments(args);
  const files = releaseMigrations();
  if (receiptPath && existsSync(receiptPath)) fail("receipt_already_exists", "receipt");
  const url = environment.PAC_DATABASE_URL;
  if (!url) fail("missing_migration_database_connection", "PAC_DATABASE_URL");
  let parsedUrl;
  try { parsedUrl = new URL(url); } catch { fail("invalid_migration_database_connection", "PAC_DATABASE_URL"); }
  if (!["postgres:", "postgresql:"].includes(parsedUrl.protocol)) fail("invalid_migration_database_connection", "PAC_DATABASE_URL");
  const local = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(parsedUrl.hostname);
  const ssl = local && ["disable", "false", "off"].includes(environment.PAC_DATABASE_SSL ?? "disable") ? false : "require";
  const { default: postgres } = await import("postgres");
  const sql = postgres(url, { ssl, max: 1, prepare: false, connect_timeout: 15, onnotice: () => {} });
  const rollback = new Error("verified_rehearsal_rollback");
  let phase = "begin";
  let receipt = { ok: false, checkedAt: new Date().toISOString(), mode: apply ? "apply" : "rehearsal", commitStatus: "not_confirmed" };
  try {
    await sql.begin(async (tx) => {
      await tx.unsafe("set transaction isolation level repeatable read");
      await tx.unsafe("set local lock_timeout='10s'");
      await tx.unsafe("set local statement_timeout='90s'");
      await tx.unsafe("select pg_advisory_xact_lock(hashtextextended('one-dhs-pac-schema-migrations',0))");
      phase = "validate_complete_history";
      const ledger = await tx.unsafe("select migration_name,migration_sha256 from pac.schema_migrations order by migration_name");
      const pending = pendingReleaseMigrations(files, ledger);
      const historicalVariants = ledger.flatMap((row) => {
        const file = files.find((candidate) => candidate.name === row.migration_name);
        const variant = appliedMigrationVariant(file, row.migration_sha256);
        return variant === "exact_bytes" ? [] : [{ name: file.name, matchedVariant: variant, recordedSha256: row.migration_sha256, repositorySha256: file.sha256, provenanceReceipt: HISTORY_RECEIPT, provenanceSha256: HISTORY_RECEIPT_SHA256, provenanceNormalizedSha256: HISTORY_RECEIPT_NORMALIZED_SHA256, ledgerChanged: false }];
      });
      if (historicalVariants.length) verifyHistoricalReceipt();
      phase = "capture_owner_and_content_preservation";
      const before = { ownerAccess: await ownerAccessSnapshot(tx), content: await contentSnapshot(tx), named: await namedInactiveSnapshot(tx) };
      const migrations = [];
      for (const migration of pending) {
        phase = "migration:" + migration.name;
        await tx.unsafe(migration.body);
        await tx.unsafe("insert into pac.schema_migrations(migration_name,migration_sha256,applied_by) values($1,$2,$3)", [migration.name, migration.sha256, ACTOR]);
        migrations.push({ name: migration.name, sha256: migration.sha256, action: "applied_in_transaction" });
      }
      phase = "verify_preservation_and_runtime_readiness";
      const after = { ownerAccess: await ownerAccessSnapshot(tx), content: await contentSnapshot(tx), named: await namedInactiveSnapshot(tx) };
      if (JSON.stringify(before.ownerAccess) !== JSON.stringify(after.ownerAccess)) fail("existing_owner_access_changed", "owner_access");
      if (JSON.stringify(before.content) !== JSON.stringify(after.content)) fail("existing_content_or_ask_count_changed", "preserved_content");
      const readiness = await releaseReadiness(tx);
      const finalLedger = await tx.unsafe("select migration_name,migration_sha256 from pac.schema_migrations order by migration_name");
      if (pendingReleaseMigrations(files, finalLedger).length !== 0) fail("pending_release_migrations_remain", "schema_migrations");
      receipt = { ...receipt, ok: true, existingLedgerCount: ledger.length, finalLedgerCount: finalLedger.length,
        migrations, historicalVariants, before, after, ownerAccessPreserved: true, canonicalContentPreserved: true,
        namedAccessInactive: true, restorePreparationExecuted: false, readiness };
      phase = apply ? "commit" : "rollback_rehearsal";
      if (!apply) throw rollback;
    });
    receipt.commitStatus = "committed";
  } catch (error) {
    if (error === rollback) receipt.commitStatus = "rolled_back";
    else receipt = { ...receipt, ...safeFailure(error, phase), commitStatus: apply && phase === "commit" ? "unknown_verify_ledger_before_retry" : "rolled_back_or_not_started" };
  } finally {
    await sql.end({ timeout: 5 }).catch(() => {});
  }
  if (receiptPath) {
    try { writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", { encoding: "utf8", flag: "wx" }); }
    catch { receipt = { ...receipt, receiptFileWritten: false, receiptFileError: "receipt_write_failed" }; }
  }
  console.log(JSON.stringify(receipt, null, 2));
  return receipt.ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = await runFunctionalMigrationRelease(); }
  catch (error) { console.error(JSON.stringify(safeFailure(error, "prepare"))); process.exitCode = 1; }
}
