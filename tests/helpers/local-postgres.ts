/**
 * Server options shared by every suite that starts a disposable local
 * PostgreSQL server with `pg_ctl -o`.
 *
 * The socket directory matters: PostgreSQL still creates a Unix socket and its
 * lock file even when it only listens on 127.0.0.1, and Debian/Ubuntu builds
 * default that directory to /var/run/postgresql, which is owned by the
 * `postgres` user. A non-root CI user (GitHub's `runner`) cannot create the
 * lock file there, so the server exits with "could not create lock file ...
 * Permission denied" and pg_ctl reports status 1. Pointing
 * unix_socket_directories at the suite's own temporary directory keeps the
 * server self-contained on any account.
 */
export function localPostgresServerOptions(port: number, socketDirectory: string): string {
  const options = `-F -p ${port} -h 127.0.0.1`;
  // Windows builds do not use a Unix socket directory by default; keep them unchanged.
  return process.platform === "win32" ? options : `${options} -k ${socketDirectory}`;
}
