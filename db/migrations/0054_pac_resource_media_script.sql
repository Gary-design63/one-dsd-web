-- A timed script for read-aloud audio, so the words follow the recording.
begin;
alter table pac.resource_media add column if not exists script jsonb;

create or replace function pac.set_resource_media_script(p_resource_media_id uuid, p_script jsonb)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if p_script is not null and (jsonb_typeof(p_script) <> 'array' or jsonb_array_length(p_script) > 5000) then
    raise exception 'Invalid script' using errcode = '22023';
  end if;
  update pac.resource_media set script = p_script where resource_media_id = p_resource_media_id;
  return found;
end;
$$;

drop function if exists pac.list_resource_media(text);
create or replace function pac.list_resource_media(p_content_item_id text)
returns table (resource_media_id uuid, kind text, media_id uuid, external_url text, title text, alt_text text, mime_type text, file_name text, script jsonb)
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select r.resource_media_id, r.kind, r.media_id, r.external_url, r.title, r.alt_text, m.mime_type, m.file_name, r.script
  from pac.resource_media r
  left join pac.media_files m on m.media_id = r.media_id
  where r.content_item_id = p_content_item_id
  order by r.sort_order, r.created_at;
$$;

revoke all on function pac.set_resource_media_script(uuid, jsonb) from public;
revoke all on function pac.list_resource_media(text) from public;
grant execute on function pac.set_resource_media_script(uuid, jsonb) to pac_app_runtime;
grant execute on function pac.list_resource_media(text) to pac_app_runtime;
commit;
