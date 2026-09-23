-- A page save must not fail because an image replacement points at a file
-- that no longer exists. Such entries are skipped; the wording still saves.
begin;

create or replace function pac.save_page_image_overrides(requested_scope_id text, requested_route text, entries jsonb)
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
  if jsonb_typeof(entries) <> 'array' or jsonb_array_length(entries) > 500 then
    raise exception 'Invalid page image entries' using errcode = '22023';
  end if;
  delete from pac.page_image_overrides o where o.scope_id = requested_scope_id and o.route = requested_route;
  insert into pac.page_image_overrides (scope_id, route, image_key, media_id, alt_text)
  select requested_scope_id, requested_route, entry->>'key', (entry->>'mediaId')::uuid, coalesce(entry->>'alt', '')
  from jsonb_array_elements(entries) as entry
  where entry ? 'key' and entry ? 'mediaId'
    and (entry->>'mediaId') ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    and exists (select 1 from pac.media_files m where m.media_id = (entry->>'mediaId')::uuid);
  get diagnostics saved = row_count;
  return saved;
end;
$$;

commit;
