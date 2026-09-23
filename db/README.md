# PAC database boundary

The foundation requires PostgreSQL 15 or newer. The `pac` schema is private, server-side storage. It contains raw source bodies, held drafts, review findings, ingest history, audit events, search material, and candidate graph data. It must not be added to Supabase's exposed API schemas or queried from browser code.

Migration `0001_pac_content_foundation.sql` revokes access from `PUBLIC`, `anon`, and `authenticated`, enables row-level security without client policies, and creates security-invoker views. The database owner performs migrations, imports, and restricted-role provisioning. The running application uses the dedicated `pac_app_runtime` login and never uses the owner connection. That runtime login receives only the grants and row policies required by the server-side store and approved publication interface. No browser role receives a database grant.

Commands are safe by default:

The npm command definitions load the ignored `.env.local` file with Node's `--env-file-if-exists` option. They do not display connection values. When invoking a script directly, use the same option before the script path.

- `npm run db:migrate` only lists and hashes migrations.
- `npm run db:migrate -- --apply` requires the owner-only `PAC_DATABASE_URL` and applies migrations.
- `npm run db:provision-runtime` is a no-change readiness check.
- `npm run db:provision-runtime -- --apply` rotates a generated password for `pac_app_runtime`, verifies the restricted boundary, and writes `PAC_RUNTIME_DATABASE_URL` to the ignored `.env.local` file without displaying the password or either connection string.
- `npm run corpus:stage` validates inputs and writes deterministic files under `.pac-import-staging/`.
- `npm run corpus:load` validates a staged import without connecting to a database.
- `npm run corpus:benchmark` reports the query-count envelope for 50,000 staged rows. If `PAC_IMPORT_BENCHMARK_DATABASE_URL` points to a local PostgreSQL server, it also runs an isolated temporary-table timing comparison.
- `npm run corpus:load -- --apply` requires `PAC_DATABASE_URL` and creates a validated shadow run. It creates no staff publication decisions.
- `npm run corpus:load -- --promote-run RUN_ID` makes that run's collection memberships current after review. It still creates no staff publication decisions.

The v2 importer validates hashes and JSONL records as streams, then loads at most 500 rows or 1 MiB per batch by default. `PAC_IMPORT_BATCH_SIZE` may be set from 25 through 2,000, and `PAC_IMPORT_BATCH_BYTES` from 262,144 through 8,388,608. Keep the byte boundary conservative when normalized source payloads are large.

One transaction covers the advisory lock, run receipt, every set-based write, receipt-count validation, and the final validated status. A process interruption therefore leaves either no new run or a complete validated run. The recovery check can finalize a complete legacy `started` run from its receipts; partial legacy runs are marked failed and their membership decisions remain inactive before a clean retry. A validated stage ID cannot be reused with a different manifest hash.

The importer keeps only one batch plus identity keys for the current file in memory. At 50,000 rows and the default row boundary, the all-insert query envelope is approximately 307 database round trips rather than at least 100,007 row-oriented round trips. Actual batch count may be higher when the 1 MiB boundary is reached first. The remaining practical limits are the size of one JSONL record, database transaction duration, available database storage, and the time required for review, enrichment, embedding, and object upload; those later activities must remain separate resumable stages rather than expanding this transaction.

`PAC_DATABASE_URL`, `PAC_RUNTIME_DATABASE_URL`, `PAC_DATABASE_SSL`, `PAC_RUNTIME_DATABASE_SSL`, local resolver paths, and object-storage credentials must remain server-only. Do not prefix them with `NEXT_PUBLIC_`. The owner connection is never a runtime fallback.

## Private source objects

Migration `0003_pac_private_source_objects.sql` keeps immutable source carriers unchanged. Verified private-bucket placements are appended to `pac.source_carrier_locations`; unavailable originals are retained in `pac.source_binary_holds`. Both tables use row-level security, have no browser-role policy, and are append-only.

- `npm run corpus:objects:check` resolves available originals and all repository snapshots, verifies their SHA-256 and byte counts, and reports explicit holds. It makes no external changes.
- `npm run corpus:objects:stage` writes a deterministic, path-safe stage under `.pac-object-staging/`.
- `npm run corpus:objects:load` validates that stage locally without connecting anywhere.
- `npm run corpus:objects:load -- --apply` requires `PAC_SUPABASE_URL`, `PAC_SUPABASE_BUCKET`, `PAC_SUPABASE_SECRET_KEY`, and `PAC_DATABASE_URL`. It refuses a public bucket, verifies local bytes, verifies every stored object by downloading it, and records a database location only after successful upload verification.

Object keys are content-addressed and contain no original file names or local paths. Exact replay is accepted only when SHA-256 and byte count both match. Any mismatch is a hard conflict. Quarantined HTML is read as inert bytes for hashing and storage; it is never executed.

Before setting `PAC_STORE=postgres`, apply every migration, run the restricted-role provisioner, and verify the runtime tables. Set `PAC_RUNTIME_DATABASE_URL` and `PAC_RUNTIME_DATABASE_SSL` only on the server. Use `PAC_CONTENT_SOURCE=postgres` only after approved publications have been loaded; use `PAC_STAFF_SCOPE=one-dhs` for the agencywide view or `PAC_STAFF_SCOPE=dsd` for the DSD view. Once PostgreSQL is explicitly selected, a missing or unreachable restricted connection is an error; the application never falls back to the owner connection or temporary storage.
