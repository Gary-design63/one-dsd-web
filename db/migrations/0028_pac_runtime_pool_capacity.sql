-- Local session pooling and hosted transaction pooling can each retain up to
-- fifteen backend connections. Keep a bounded allowance for both during a
-- release without changing the runtime role's data or administration rights.
begin;
do $$
declare
  available_connections integer;
begin
  available_connections := current_setting('max_connections')::integer
    - current_setting('superuser_reserved_connections')::integer
    - coalesce(nullif(current_setting('reserved_connections', true), ''), '0')::integer;
  if available_connections - 32 < 20 then
    raise exception 'Runtime pooling requires at least twenty connections to remain outside the application allowance.';
  end if;
  if not exists (
    select 1 from pg_roles where rolname = 'pac_app_runtime'
      and not rolsuper and not rolcreaterole and not rolcreatedb
      and not rolreplication and not rolbypassrls
      and rolconnlimit between 1 and 32
  ) then
    raise exception 'The restricted runtime role does not match the expected bounded configuration.';
  end if;
  alter role pac_app_runtime connection limit 32;
end $$;
commit;
