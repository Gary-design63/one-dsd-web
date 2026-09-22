-- Owner-only preservation of the exact pre-contract connection-verification
-- record. This is not an application work-object carrier or a staff resource.
BEGIN;
CREATE TABLE IF NOT EXISTS pac.owner_release_legacy_archive (
  archive_key text PRIMARY KEY,
  source_table text NOT NULL,
  original_row jsonb NOT NULL,
  archived_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  archived_by text NOT NULL,
  reason text NOT NULL
);
ALTER TABLE pac.owner_release_legacy_archive ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON pac.owner_release_legacy_archive FROM PUBLIC,pac_app_runtime;
DO $$ DECLARE role_name text; BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
    IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname=role_name) THEN
      EXECUTE format('revoke all on pac.owner_release_legacy_archive from %I',role_name);
    END IF;
  END LOOP;
END $$;
COMMENT ON TABLE pac.owner_release_legacy_archive IS
  'Owner-only recovery archive for the exact named legacy verification record moved out of active runtime persistence during the approved production release.';
COMMIT;
