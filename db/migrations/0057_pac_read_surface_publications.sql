begin;

-- Batch read of current publications for many page areas in one round trip.
-- A page area that the application registers before its database definition
-- exists is skipped instead of aborting the whole batch: aborting a set-returning
-- query after rows were already streamed left the pooled connection with stray
-- rows that surfaced in the next query as "more than one effective publication".
create or replace function pac.read_surface_publications(
  requested_scope_id text,
  requested_surface_ids text[]
)
returns table(
  surface_id text,
  revision_id uuid,
  scope_id text,
  document jsonb,
  publication_decision_id bigint,
  decided_at timestamp with time zone
)
language plpgsql
stable
security definer
set search_path to 'pg_catalog', 'pac'
set row_security to 'off'
as $$
declare
  requested text;
begin
  foreach requested in array coalesce(requested_surface_ids, '{}'::text[]) loop
    begin
      return query select * from pac.read_surface_publication(requested_scope_id, requested);
    exception
      when no_data_found then
        null;
    end;
  end loop;
end;
$$;

revoke all privileges on function pac.read_surface_publications(text, text[]) from public;
grant execute on function pac.read_surface_publications(text, text[]) to pac_app_runtime;

commit;
