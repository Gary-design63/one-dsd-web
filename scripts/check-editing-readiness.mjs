import postgres from 'postgres';

if (!process.env.PAC_RUNTIME_DATABASE_URL) {
  console.log(JSON.stringify({ connectionConfigured: false }));
  process.exit(1);
}
const url = process.argv.includes('--admin') ? process.env.PAC_DATABASE_URL : process.env.PAC_RUNTIME_DATABASE_URL;
const sql = postgres(url, { ssl: 'require', max: 1, connect_timeout: 10 });
try {
  const tables = await sql`select to_regclass('pac.surface_definitions')::text as definitions,
    to_regclass('pac.surface_revisions')::text as revisions,
    to_regclass('pac.surface_publication_decisions')::text as decisions`;
  console.log(JSON.stringify({ tables }));
  const ledger = await sql`select to_regclass('pac.schema_migrations')::text as ledger`;
  if (process.argv.includes('--admin') && ledger[0].ledger) console.log(JSON.stringify({ migrations: await sql`select migration_name, migration_sha256 from pac.schema_migrations order by migration_name` }));
  console.log(JSON.stringify({ prerequisites: await sql`select
    to_regclass('pac.content_items')::text as content_items,
    to_regclass('pac.program_scopes')::text as scopes,
    to_regprocedure('pac.assert_plain_page_text(text)')::text as text_validation,
    to_regprocedure('pac.assert_safe_page_link(text)')::text as link_validation,
    exists(select 1 from pg_roles where rolname='pac_app_runtime') as runtime_role` }));
  if (tables[0].definitions && process.argv.includes('--admin')) {
    const counts = await sql`select count(*)::int as definitions from pac.surface_definitions`;
    console.log(JSON.stringify({ counts }));
  }
  if (tables[0].definitions && !process.argv.includes('--admin')) {
    const reads = await sql`select surface_id from pac.read_surface_publication('one-dhs', 'workforce.dsd')`;
    console.log(JSON.stringify({ runtimeRead: reads.length === 1 }));
  }
} catch (error) {
  console.log(JSON.stringify({ error: error.code ?? error.name }));
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 2 });
}
