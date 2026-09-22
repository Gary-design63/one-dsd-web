import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import postgres from 'postgres';

// Deliberately limited to the editing migration; does not activate other stores.
const name = '0018_pac_editable_surfaces.sql';
const directory = resolve(import.meta.dirname, '../../db/migrations');
const source = readFileSync(resolve(directory, name), 'utf8');
const hash = (text) => createHash('sha256').update(text).digest('hex').toUpperCase();
const apply = process.argv.includes('--apply');
if (!process.env.PAC_DATABASE_URL) throw new Error('Database setup credentials are required.');
const sql = postgres(process.env.PAC_DATABASE_URL, { ssl: 'require', max: 1, prepare: false, connect_timeout: 10, onnotice: () => {} });
const dryRun = new Error('verified rollback');
let result;
try {
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtextextended('one-dhs-pac-schema-migrations', 0))`;
    const applied = await tx`select migration_name, migration_sha256 from pac.schema_migrations`;
    for (const row of applied) {
      if (hash(readFileSync(resolve(directory, row.migration_name), 'utf8')) !== row.migration_sha256.toUpperCase()) {
        throw new Error(`Migration history differs: ${row.migration_name}`);
      }
    }
    if (applied.some((row) => row.migration_name === name)) {
      result = { status: 'already_applied', migration: name };
      return;
    }
    const existing = await tx`select to_regclass('pac.surface_definitions')::text as existing`;
    if (existing[0].existing) throw new Error('Unregistered editing tables exist; reconcile before proceeding.');
    const body = source.replace(/^begin;\s*/i, '').replace(/commit;\s*$/i, '');
    await tx.unsafe(body);
    const counts = await tx`select count(*)::int as count from pac.surface_definitions`;
    await tx`insert into pac.schema_migrations (migration_name, migration_sha256, applied_by)
      values (${name}, ${hash(source)}, 'owner-authorized-editing-setup')`;
    result = { status: apply ? 'applied' : 'validated_and_rolled_back', migration: name, registeredAreas: counts[0].count };
    if (!apply) throw dryRun;
  });
  console.log(JSON.stringify(result));
} catch (error) {
  if (error === dryRun) console.log(JSON.stringify(result));
  else {
    // Never print database connection details, source queries, or credentials.
    console.error(JSON.stringify({ status: 'failed_verify_ledger_before_retry', code: error.code ?? error.name, message: error.message }));
    process.exitCode = 1;
  }
} finally { await sql.end({ timeout: 2 }); }
