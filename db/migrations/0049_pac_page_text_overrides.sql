-- Universal inline editing. The consultant can change any visible text on any
-- page, in place, separately for the One DHS and One DSD views. Each saved
-- change is keyed by page route, view scope, and a stable element key, and keeps
-- the original wording so a change can be reverted.
begin;

do $$
begin
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_app_runtime') then
    raise exception 'Required least-privilege role pac_app_runtime is missing';
  end if;
end;
$$;

create table if not exists pac.page_text_overrides (
  scope_id text not null check (scope_id in ('one-dhs', 'dsd')),
  route text not null check (route ~ '^/[A-Za-z0-9_./\-]*$' and length(route) <= 300),
  element_key text not null check (length(element_key) between 1 and 200),
  original_text text not null check (length(original_text) <= 20000),
  replacement_text text not null check (length(replacement_text) <= 20000),
  updated_at timestamptz not null default now(),
  updated_by text not null default 'consultant',
  primary key (scope_id, route, element_key)
);

create or replace function pac.read_page_text_overrides(requested_scope_id text, requested_route text)
returns table (element_key text, original_text text, replacement_text text)
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select o.element_key, o.original_text, o.replacement_text
  from pac.page_text_overrides o
  where o.scope_id = requested_scope_id and o.route = requested_route
  order by o.element_key;
$$;

-- Replaces the full set of overrides for one page and view. An entry whose
-- replacement equals its original is dropped, which is how a revert is saved.
create or replace function pac.save_page_text_overrides(
  requested_scope_id text,
  requested_route text,
  entries jsonb
)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  saved integer;
begin
  if requested_scope_id not in ('one-dhs', 'dsd') then
    raise exception 'Unknown program scope' using errcode = '22023';
  end if;
  if jsonb_typeof(entries) <> 'array' or jsonb_array_length(entries) > 2000 then
    raise exception 'Invalid page text entries' using errcode = '22023';
  end if;
  delete from pac.page_text_overrides o
  where o.scope_id = requested_scope_id and o.route = requested_route;
  insert into pac.page_text_overrides (scope_id, route, element_key, original_text, replacement_text)
  select requested_scope_id, requested_route,
    entry->>'key', entry->>'original', entry->>'text'
  from jsonb_array_elements(entries) as entry
  where entry ? 'key' and entry ? 'original' and entry ? 'text'
    and (entry->>'text') is distinct from (entry->>'original');
  get diagnostics saved = row_count;
  return saved;
end;
$$;

revoke all privileges on pac.page_text_overrides from public, pac_app_runtime;
revoke all on function pac.read_page_text_overrides(text, text) from public;
revoke all on function pac.save_page_text_overrides(text, text, jsonb) from public;
grant execute on function pac.read_page_text_overrides(text, text) to pac_app_runtime;
grant execute on function pac.save_page_text_overrides(text, text, jsonb) to pac_app_runtime;

commit;
