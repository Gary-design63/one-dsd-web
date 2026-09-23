import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import postgres from 'postgres';

// Applies only the new toolkit area, never other pending migrations.
const name = '0022_pac_equity_toolkit_surface.sql';
const directory = resolve(import.meta.dirname, '../../db/migrations');
const source = readFileSync(resolve(directory, name), 'utf8');
const hash = text => createHash('sha256').update(text).digest('hex').toUpperCase();
const apply = process.argv.includes('--apply');
if (!process.env.PAC_DATABASE_URL) throw new Error('Database setup credentials are required.');
const sql = postgres(process.env.PAC_DATABASE_URL, { ssl: 'require', max: 1, prepare: false, connect_timeout: 10, onnotice: () => {} });
const rollback = new Error('validation rollback');
let result;
try {
  await sql.begin(async tx => {
    await tx`select pg_advisory_xact_lock(hashtextextended('one-dhs-pac-schema-migrations', 0))`;
    const applied = await tx`select migration_name, migration_sha256 from pac.schema_migrations`;
    for (const row of applied) {
      if (hash(readFileSync(resolve(directory, row.migration_name), 'utf8')) !== row.migration_sha256.toUpperCase()) throw new Error('Migration history differs.');
    }
    if (applied.some(row => row.migration_name === name)) { result = { status: 'already_applied' }; return; }
    await tx.unsafe(source.replace(/^begin;\s*/im, '').replace(/commit;\s*$/i, ''));
    await tx`insert into pac.schema_migrations (migration_name, migration_sha256, applied_by) values (${name}, ${hash(source)}, 'owner-authorized-toolkit-setup')`;
    result = { status: apply ? 'applied' : 'validated_and_rolled_back', migration: name };
    if (!apply) throw rollback;
  });
  console.log(JSON.stringify(result));
} catch (error) {
  if (error === rollback) console.log(JSON.stringify(result));
  else { console.error(JSON.stringify({ status: 'failed', code: error.code ?? error.name })); process.exitCode = 1; }
} finally { await sql.end({ timeout: 2 }); }
