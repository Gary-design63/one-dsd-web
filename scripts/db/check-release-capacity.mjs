import postgres from "postgres";

const sql = postgres(process.env.PAC_DATABASE_URL, { max: 1, prepare: false, ssl: "require", connect_timeout: 10 });
try {
  const capacity = await sql`select name, setting from pg_settings where name in ('max_connections', 'superuser_reserved_connections', 'reserved_connections')`;
  const activity = await sql`select usename, state, count(*)::int as connections from pg_stat_activity group by usename, state order by usename, state`;
  const role = await sql`select rolname, rolconnlimit, rolsuper, rolcreaterole, rolcreatedb, rolreplication, rolbypassrls from pg_roles where rolname = 'pac_app_runtime'`;
  console.log(JSON.stringify({ capacity, activity, role }));
} finally {
  await sql.end();
}
