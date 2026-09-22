-- Consultant override for editing and deletion.
-- 1. Any page wording field may be cleared outright; the database no longer
--    refuses a blank field or an empty list.
-- 2. The consultant can delete a resource outright. The item is retired, which
--    removes it from every page and both program views at once. A restore
--    function exists so a mistaken deletion can be undone by the consultant.
begin;

do $$
begin
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_app_runtime') then
    raise exception 'Required least-privilege role pac_app_runtime is missing';
  end if;
end;
$$;

create or replace function pac.assert_valid_surface_document(
  requested_surface_id text,
  requested_scope_id text,
  requested_document jsonb
)
returns void
language plpgsql
stable
set search_path = pg_catalog, pac
as $$
declare
  definition pac.surface_definitions%rowtype;
  field_definition jsonb;
  field_key text;
  field_kind text;
  field_required boolean;
  field_maximum integer;
  item_maximum integer;
  field_value jsonb;
  text_value text;
  list_item jsonb;
  block_item jsonb;
  link_item jsonb;
  block_type text;
  expected_keys text[];
begin
  perform pac.assert_surface_request(requested_scope_id, requested_surface_id, true);
  select * into strict definition
  from pac.surface_definitions
  where surface_id = requested_surface_id and active = true;

  if requested_document is null or jsonb_typeof(requested_document) <> 'object'
    or octet_length(convert_to(requested_document::text, 'UTF8')) > 1000000 then
    raise exception 'Page wording must be a complete, reasonably sized document' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_object_keys(requested_document) actual(name)
    where actual.name <> all(array['schemaVersion', 'surfaceId', 'scope', 'values']::text[])
  ) or not requested_document ?& array['schemaVersion', 'surfaceId', 'scope', 'values']::text[] then
    raise exception 'Page wording document fields are not allowed' using errcode = '22023';
  end if;
  if jsonb_typeof(requested_document -> 'schemaVersion') <> 'number'
    or (requested_document ->> 'schemaVersion')::integer <> definition.schema_version
    or requested_document ->> 'surfaceId' <> requested_surface_id
    or requested_document ->> 'scope' <> requested_scope_id
    or jsonb_typeof(requested_document -> 'values') <> 'object' then
    raise exception 'Page wording document identity does not match this page area' using errcode = '22023';
  end if;

  select array_agg(field ->> 'key' order by ordinal)
  into expected_keys
  from jsonb_array_elements(definition.field_contract) with ordinality registered(field, ordinal);
  if expected_keys is null
    or not (requested_document -> 'values') ?& expected_keys
    or exists (
      select 1 from jsonb_object_keys(requested_document -> 'values') actual(name)
      where actual.name <> all(expected_keys)
    ) then
    raise exception 'Page wording fields do not match this page area' using errcode = '22023';
  end if;

  for field_definition in select value from jsonb_array_elements(definition.field_contract)
  loop
    field_key := field_definition ->> 'key';
    field_kind := field_definition ->> 'kind';
    -- Consultant override: any field may be cleared outright. Nothing is required.
    field_required := false;
    field_maximum := coalesce((field_definition ->> 'maxLength')::integer,
      case when field_kind = 'short' then 500 when field_kind = 'url' then 2000 else 10000 end);
    item_maximum := coalesce((field_definition ->> 'maxItems')::integer, 100);
    field_value := requested_document -> 'values' -> field_key;

    if field_kind = 'course-pack' then
      if requested_surface_id not like 'course.%' or field_value#>>'{course,id}' <> substring(requested_surface_id from 8) then
        raise exception 'Course identity does not match the publication' using errcode='22023';
      end if;
      perform pac.assert_course_schema(field_value, pac.course_pack_schema());
      if (select count(*) from jsonb_array_elements(field_value#>'{course,lessons}')) <>
         (select count(distinct lesson->>'id') from jsonb_array_elements(field_value#>'{course,lessons}') lesson) then
        raise exception 'Course lesson identifiers must be unique' using errcode='22023';
      end if;
      for block_item in select block from jsonb_array_elements(field_value#>'{course,lessons}') lesson cross join lateral jsonb_array_elements(lesson->'blocks') block loop
        if block_item->>'type'='knowledgeCheck' and not exists(select 1 from jsonb_array_elements(block_item->'options') option where option->'correct'='true'::jsonb) then
          raise exception 'Course knowledge check requires a correct answer' using errcode='22023';
        end if;
        if block_item->>'type'='sorting' and exists(select 1 from jsonb_array_elements(block_item->'items') item where not (block_item->'categories') @> jsonb_build_array(item->>'category')) then
          raise exception 'Course sorting category is not available' using errcode='22023';
        end if;
      end loop;
      continue;
    end if;

    if field_kind in ('short', 'long', 'url') then
      if jsonb_typeof(field_value) <> 'string' then
        raise exception 'A page wording field has the wrong kind of value' using errcode = '22023';
      end if;
      text_value := field_value #>> '{}';
      if length(text_value) > field_maximum or (field_required and length(btrim(text_value)) = 0) then
        raise exception 'A page wording field is blank or too long' using errcode = '22023';
      end if;
      if length(btrim(text_value)) > 0 then
        if field_kind = 'url' then
          perform pac.assert_safe_page_link(text_value);
        else
          perform pac.assert_plain_page_text(text_value);
        end if;
      end if;
      continue;
    end if;

    if jsonb_typeof(field_value) <> 'array'
      or jsonb_array_length(field_value) > item_maximum
      or (field_required and jsonb_array_length(field_value) = 0) then
      raise exception 'A page wording list is empty, too long, or has the wrong kind of value' using errcode = '22023';
    end if;

    if field_kind = 'string-list' then
      for list_item in select value from jsonb_array_elements(field_value)
      loop
        if jsonb_typeof(list_item) <> 'string' then
          raise exception 'A page wording list must contain text' using errcode = '22023';
        end if;
        text_value := list_item #>> '{}';
        if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
          raise exception 'A page wording list item is blank or too long' using errcode = '22023';
        end if;
        perform pac.assert_plain_page_text(text_value);
      end loop;
    elsif field_kind = 'link-list' then
      for link_item in select value from jsonb_array_elements(field_value)
      loop
        if jsonb_typeof(link_item) <> 'object'
          or not link_item ?& array['label', 'href']::text[]
          or exists (
            select 1 from jsonb_object_keys(link_item) actual(name)
            where actual.name <> all(array['label', 'href']::text[])
          ) or jsonb_typeof(link_item -> 'label') <> 'string'
          or jsonb_typeof(link_item -> 'href') <> 'string' then
          raise exception 'A page wording link has fields that are not allowed' using errcode = '22023';
        end if;
        text_value := link_item ->> 'label';
        if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
          raise exception 'A page wording link label is blank or too long' using errcode = '22023';
        end if;
        perform pac.assert_plain_page_text(text_value);
        perform pac.assert_safe_page_link(link_item ->> 'href');
      end loop;
    elsif field_kind = 'rich-blocks' then
      for block_item in select value from jsonb_array_elements(field_value)
      loop
        if jsonb_typeof(block_item) <> 'object' or jsonb_typeof(block_item -> 'type') <> 'string' then
          raise exception 'A structured page section has fields that are not allowed' using errcode = '22023';
        end if;
        block_type := block_item ->> 'type';
        if block_type = 'heading' then
          if not block_item ?& array['type', 'level', 'text']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'level', 'text']::text[])
            ) or jsonb_typeof(block_item -> 'level') <> 'number'
            or (block_item ->> 'level')::integer not in (2, 3)
            or jsonb_typeof(block_item -> 'text') <> 'string' then
            raise exception 'A structured heading has fields that are not allowed' using errcode = '22023';
          end if;
          text_value := block_item ->> 'text';
          if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
            raise exception 'A structured heading is blank or too long' using errcode = '22023';
          end if;
          perform pac.assert_plain_page_text(text_value);
        elsif block_type = 'paragraph' then
          if not block_item ?& array['type', 'text']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'text']::text[])
            ) or jsonb_typeof(block_item -> 'text') <> 'string' then
            raise exception 'A structured paragraph has fields that are not allowed' using errcode = '22023';
          end if;
          text_value := block_item ->> 'text';
          if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
            raise exception 'A structured paragraph is blank or too long' using errcode = '22023';
          end if;
          perform pac.assert_plain_page_text(text_value);
        elsif block_type in ('bullet-list', 'numbered-list') then
          if not block_item ?& array['type', 'items']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'items']::text[])
            ) or jsonb_typeof(block_item -> 'items') <> 'array'
            or jsonb_array_length(block_item -> 'items') not between 1 and item_maximum then
            raise exception 'A structured list has fields that are not allowed' using errcode = '22023';
          end if;
          for list_item in select value from jsonb_array_elements(block_item -> 'items')
          loop
            if jsonb_typeof(list_item) <> 'string' then
              raise exception 'A structured list must contain text' using errcode = '22023';
            end if;
            text_value := list_item #>> '{}';
            if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
              raise exception 'A structured list item is blank or too long' using errcode = '22023';
            end if;
            perform pac.assert_plain_page_text(text_value);
          end loop;
        elsif block_type = 'link-list' then
          if not block_item ?& array['type', 'items']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'items']::text[])
            ) or jsonb_typeof(block_item -> 'items') <> 'array'
            or jsonb_array_length(block_item -> 'items') not between 1 and item_maximum then
            raise exception 'A structured link list has fields that are not allowed' using errcode = '22023';
          end if;
          for link_item in select value from jsonb_array_elements(block_item -> 'items')
          loop
            if jsonb_typeof(link_item) <> 'object'
              or not link_item ?& array['label', 'href']::text[]
              or exists (
                select 1 from jsonb_object_keys(link_item) actual(name)
                where actual.name <> all(array['label', 'href']::text[])
              ) or jsonb_typeof(link_item -> 'label') <> 'string'
              or jsonb_typeof(link_item -> 'href') <> 'string' then
              raise exception 'A structured link has fields that are not allowed' using errcode = '22023';
            end if;
            text_value := link_item ->> 'label';
            if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
              raise exception 'A structured link label is blank or too long' using errcode = '22023';
            end if;
            perform pac.assert_plain_page_text(text_value);
            perform pac.assert_safe_page_link(link_item ->> 'href');
          end loop;
        else
          raise exception 'A structured page section is not allowed' using errcode = '22023';
        end if;
      end loop;
    else
      raise exception 'A registered page wording field kind is not supported' using errcode = '22023';
    end if;
  end loop;
end;
$$;


create or replace function pac.delete_content_item_outright(
  requested_content_item_id text,
  requested_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  item pac.content_items%rowtype;
begin
  select * into item
  from pac.content_items i
  where i.content_item_id = requested_content_item_id
  for update;
  if not found then
    raise exception 'This item is not available' using errcode = 'P0002';
  end if;
  if item.retired_at is not null then
    return jsonb_build_object('contentItemId', item.content_item_id, 'deleted', true, 'alreadyDeleted', true);
  end if;

  update pac.content_items
  set retired_at = now(), retired_by = 'practice-workspace-owner'
  where content_item_id = requested_content_item_id;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'practice-workspace-owner', 'owner', item.default_scope_id, 'content_item',
    requested_content_item_id, 'content_item_deleted',
    jsonb_build_object('reason', left(coalesce(btrim(requested_reason), ''), 500), 'outright', true)
  );

  return jsonb_build_object('contentItemId', item.content_item_id, 'deleted', true, 'alreadyDeleted', false);
end;
$$;

create or replace function pac.restore_content_item(requested_content_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  item pac.content_items%rowtype;
begin
  select * into item from pac.content_items i where i.content_item_id = requested_content_item_id for update;
  if not found then
    raise exception 'This item is not available' using errcode = 'P0002';
  end if;
  update pac.content_items set retired_at = null, retired_by = null where content_item_id = requested_content_item_id;
  insert into pac.change_events (actor_id, actor_role, scope_id, object_type, object_id, action, detail)
  values ('practice-workspace-owner', 'owner', item.default_scope_id, 'content_item', requested_content_item_id, 'content_item_restored', '{}'::jsonb);
  return jsonb_build_object('contentItemId', item.content_item_id, 'restored', true);
end;
$$;

create or replace function pac.read_deleted_content_items()
returns table (content_item_id text, staff_label text, content_kind text, retired_at timestamptz)
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select i.content_item_id, i.staff_label, i.content_kind, i.retired_at
  from pac.content_items i
  where i.retired_at is not null
  order by i.retired_at desc;
$$;

revoke all on function pac.delete_content_item_outright(text, text) from public;
revoke all on function pac.restore_content_item(text) from public;
revoke all on function pac.read_deleted_content_items() from public;
grant execute on function pac.delete_content_item_outright(text, text) to pac_app_runtime;
grant execute on function pac.restore_content_item(text) to pac_app_runtime;
grant execute on function pac.read_deleted_content_items() to pac_app_runtime;

commit;
