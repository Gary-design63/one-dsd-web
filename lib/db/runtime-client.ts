import "server-only";

import postgres from "postgres";

/**
 * One shared PostgreSQL client for the restricted runtime connection
 * (PAC_RUNTIME_DATABASE_URL). Every runtime reader and store in lib/ borrows
 * this client instead of opening a pool of its own, so one warm server
 * instance holds at most MAX_CONNECTIONS pooler clients however many modules
 * touch the database during a request. Separate roles (contributor and
 * sign-in connections) keep their own clients; only runtime-URL users share.
 *
 * The client is created lazily on first use and lives on globalThis so that
 * bundling layers or development reloads never produce a second pool. Nothing
 * ends it per request: stores borrow it through a lease and the pool closes
 * only when the last lease is released, which runtime singletons never do.
 * Explicitly constructed stores (tests, scripts) still tear down cleanly.
 */
export type RuntimeSql = ReturnType<typeof postgres>;
export type RuntimeSslMode = false | "require";
export type RuntimeDatabaseConfiguration = { databaseUrl: string; ssl: RuntimeSslMode };
export type RuntimeDatabaseLease = { sql: RuntimeSql; release(): Promise<void> };

export const RUNTIME_POOL_OPTIONS = {
  max: 4,
  idle_timeout: 20,
  max_lifetime: 5 * 60,
  connect_timeout: 10,
} as const;

/** Same rules as the module-local helpers this replaces: local hosts default to plain TCP. */
export function runtimeDatabaseSsl(databaseUrl: string, configured?: string): RuntimeSslMode {
  let parsed: URL;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error("PAC_RUNTIME_DATABASE_URL must be a valid PostgreSQL connection string.");
  }
  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new Error("PAC_RUNTIME_DATABASE_URL must use the postgres or postgresql protocol.");
  }
  const mode = configured?.trim().toLowerCase();
  if (!mode) return ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) ? false : "require";
  if (["disable", "false", "off"].includes(mode)) return false;
  if (["require", "true", "on"].includes(mode)) return "require";
  throw new Error("PAC_RUNTIME_DATABASE_SSL must be require or disable.");
}

/**
 * A transaction-mode pooler (Supabase port 6543, or pgbouncer=true) hands each
 * statement to any backend, so prepared statements cannot be reused. Session
 * mode (port 5432) and direct connections keep them.
 */
export function runtimeDatabasePreparesStatements(databaseUrl: string): boolean {
  const parsed = new URL(databaseUrl);
  if (parsed.port === "6543") return false;
  const pgbouncer = parsed.searchParams.get("pgbouncer")?.trim().toLowerCase();
  return pgbouncer !== "true" && pgbouncer !== "1";
}

/** The runtime connection settings, or undefined when no runtime database is configured. */
export function runtimeDatabaseConfiguration(
  environment: NodeJS.ProcessEnv = process.env,
): RuntimeDatabaseConfiguration | undefined {
  const databaseUrl = environment.PAC_RUNTIME_DATABASE_URL?.trim();
  if (!databaseUrl) return undefined;
  return { databaseUrl, ssl: runtimeDatabaseSsl(databaseUrl, environment.PAC_RUNTIME_DATABASE_SSL) };
}

type RuntimeClientEntry = { sql: RuntimeSql; leases: number };
type GlobalWithRuntimeClients = typeof globalThis & { __pacRuntimeSqlClients?: Map<string, RuntimeClientEntry> };

function registry(): Map<string, RuntimeClientEntry> {
  const g = globalThis as GlobalWithRuntimeClients;
  g.__pacRuntimeSqlClients ??= new Map();
  return g.__pacRuntimeSqlClients;
}

function entryFor(configuration: RuntimeDatabaseConfiguration): { key: string; entry: RuntimeClientEntry } {
  const key = `${configuration.databaseUrl}\u0000${configuration.ssl}`;
  const clients = registry();
  let entry = clients.get(key);
  if (!entry) {
    entry = {
      sql: postgres(configuration.databaseUrl, {
        ssl: configuration.ssl,
        prepare: runtimeDatabasePreparesStatements(configuration.databaseUrl),
        ...RUNTIME_POOL_OPTIONS,
      }),
      leases: 0,
    };
    clients.set(key, entry);
  }
  return { key, entry };
}

/**
 * The shared client for direct tagged-template queries. Look it up on each use
 * rather than caching it, and never call `.end()` on it.
 */
export function runtimeSql(configuration: RuntimeDatabaseConfiguration): RuntimeSql {
  return entryFor(configuration).entry.sql;
}

/**
 * Borrow the shared client for a store or reader. `release()` is idempotent and
 * ends the pool only when no other lease remains, so a request-scoped store
 * never closes connections that the runtime singletons still use.
 */
export function leaseRuntimeSql(configuration: RuntimeDatabaseConfiguration): RuntimeDatabaseLease {
  const { key, entry } = entryFor(configuration);
  entry.leases += 1;
  let released = false;
  return {
    sql: entry.sql,
    async release(): Promise<void> {
      if (released) return;
      released = true;
      entry.leases -= 1;
      if (entry.leases > 0) return;
      const clients = registry();
      if (clients.get(key) === entry) clients.delete(key);
      await entry.sql.end({ timeout: 5 });
    },
  };
}
