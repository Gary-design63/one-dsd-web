-- Owner release functions also use the text overload. Keep pgcrypto in its
-- existing schema and preserve all existing owner function definitions/grants.
begin;
do $$
declare extension_schema text;
begin
  select n.nspname into extension_schema from pg_extension e
    join pg_namespace n on n.oid=e.extnamespace where e.extname='pgcrypto';
  if to_regprocedure('public.digest(text,text)') is not null then
    if not exists(select 1 from pg_depend d join pg_extension e on e.oid=d.refobjid
      where d.classid='pg_proc'::regclass and d.objid='public.digest(text,text)'::regprocedure
        and d.refclassid='pg_extension'::regclass and e.extname='pgcrypto' and d.deptype='e') then
      raise exception 'An unrecognized public text digest already exists; preserve it for operator review' using errcode='55000';
    end if;
    return;
  end if;
  if extension_schema is distinct from 'extensions' or to_regprocedure('extensions.digest(text,text)') is null then
    raise exception 'The existing pgcrypto text digest is unavailable in the expected extension schema' using errcode='55000';
  end if;
  execute $function$
    create function public.digest(text,text) returns bytea
    language sql immutable strict parallel safe
    set search_path=pg_catalog,extensions
    as 'select extensions.digest($1,$2)'
  $function$;
  revoke all on function public.digest(text,text) from public;
end;
$$;
commit;
