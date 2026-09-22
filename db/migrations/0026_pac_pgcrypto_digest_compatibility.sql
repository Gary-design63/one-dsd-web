-- Some existing release functions explicitly address public.digest. Supabase
-- installs pgcrypto in extensions. Keep the extension in its existing schema.
BEGIN;
DO $$
DECLARE extension_schema text;
BEGIN
  IF to_regprocedure('public.digest(bytea,text)') IS NOT NULL THEN
    RETURN;
  END IF;
  SELECT namespace.nspname INTO extension_schema
  FROM pg_extension extension JOIN pg_namespace namespace ON namespace.oid=extension.extnamespace
  WHERE extension.extname='pgcrypto';
  IF extension_schema IS DISTINCT FROM 'extensions'
    OR to_regprocedure('extensions.digest(bytea,text)') IS NULL THEN
    RAISE EXCEPTION 'The existing pgcrypto digest function is not available in the expected extension schema';
  END IF;
  EXECUTE $function$
    CREATE FUNCTION public.digest(bytea,text) RETURNS bytea
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    SET search_path=pg_catalog,extensions
    AS 'SELECT extensions.digest($1,$2)'
  $function$;
  REVOKE ALL ON FUNCTION public.digest(bytea,text) FROM PUBLIC;
END;
$$;
COMMIT;
