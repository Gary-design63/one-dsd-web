-- Consultant media and new resources.
-- 1. Media files (images, infographics, video, documents) stored in the database.
-- 2. Page image replacements: any image on any page can be swapped per view.
-- 3. Resource media: images, video, and documents attached to a resource.
-- 4. New resources written by the consultant, published outright.
begin;

do $$
begin
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_app_runtime') then
    raise exception 'Required least-privilege role pac_app_runtime is missing';
  end if;
end;
$$;

create table if not exists pac.media_files (
  media_id uuid primary key default gen_random_uuid(),
  file_name text not null check (length(file_name) between 1 and 300),
  mime_type text not null check (length(mime_type) between 3 and 200),
  byte_size integer not null check (byte_size between 1 and 60000000),
  content bytea not null,
  alt_text text not null default '' check (length(alt_text) <= 2000),
  uploaded_by text not null default 'consultant',
  uploaded_at timestamptz not null default now()
);

create table if not exists pac.page_image_overrides (
  scope_id text not null check (scope_id in ('one-dhs', 'dsd')),
  route text not null check (route ~ '^/[A-Za-z0-9_./\-]*$' and length(route) <= 300),
  image_key text not null check (length(image_key) between 1 and 2000),
  media_id uuid not null references pac.media_files(media_id),
  alt_text text not null default '' check (length(alt_text) <= 2000),
  updated_at timestamptz not null default now(),
  primary key (scope_id, route, image_key)
);

create table if not exists pac.resource_media (
  resource_media_id uuid primary key default gen_random_uuid(),
  content_item_id text not null references pac.content_items(content_item_id),
  kind text not null check (kind in ('image', 'video', 'document')),
  media_id uuid references pac.media_files(media_id),
  external_url text check (external_url is null or (external_url ~ '^https://' and length(external_url) <= 2000)),
  title text not null default '' check (length(title) <= 300),
  alt_text text not null default '' check (length(alt_text) <= 2000),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (media_id is not null or external_url is not null)
);
create index if not exists resource_media_item_idx on pac.resource_media(content_item_id, sort_order, created_at);

create or replace function pac.save_media_file(p_file_name text, p_mime_type text, p_content bytea, p_alt_text text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  new_id uuid;
begin
  if p_content is null or length(p_content) = 0 then
    raise exception 'The file is empty' using errcode = '22023';
  end if;
  insert into pac.media_files (file_name, mime_type, byte_size, content, alt_text)
  values (left(coalesce(p_file_name, 'file'), 300), left(coalesce(p_mime_type, 'application/octet-stream'), 200), length(p_content), p_content, left(coalesce(p_alt_text, ''), 2000))
  returning media_id into new_id;
  return new_id;
end;
$$;

create or replace function pac.read_media_file(p_media_id uuid)
returns table (file_name text, mime_type text, byte_size integer, content bytea, alt_text text)
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select m.file_name, m.mime_type, m.byte_size, m.content, m.alt_text
  from pac.media_files m where m.media_id = p_media_id;
$$;

create or replace function pac.read_page_image_overrides(requested_scope_id text, requested_route text)
returns table (image_key text, media_id uuid, alt_text text)
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select o.image_key, o.media_id, o.alt_text
  from pac.page_image_overrides o
  where o.scope_id = requested_scope_id and o.route = requested_route
  order by o.image_key;
$$;

-- Replaces the full set of image replacements for one page and view.
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
  where entry ? 'key' and entry ? 'mediaId';
  get diagnostics saved = row_count;
  return saved;
end;
$$;

create or replace function pac.list_resource_media(p_content_item_id text)
returns table (resource_media_id uuid, kind text, media_id uuid, external_url text, title text, alt_text text, mime_type text, file_name text)
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select r.resource_media_id, r.kind, r.media_id, r.external_url, r.title, r.alt_text, m.mime_type, m.file_name
  from pac.resource_media r
  left join pac.media_files m on m.media_id = r.media_id
  where r.content_item_id = p_content_item_id
  order by r.sort_order, r.created_at;
$$;

create or replace function pac.add_resource_media(p_content_item_id text, p_kind text, p_media_id uuid, p_external_url text, p_title text, p_alt_text text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  new_id uuid;
  next_order integer;
begin
  if not exists (select 1 from pac.content_items i where i.content_item_id = p_content_item_id) then
    raise exception 'This resource is not available' using errcode = 'P0002';
  end if;
  select coalesce(max(sort_order), 0) + 1 into next_order from pac.resource_media where content_item_id = p_content_item_id;
  insert into pac.resource_media (content_item_id, kind, media_id, external_url, title, alt_text, sort_order)
  values (p_content_item_id, p_kind, p_media_id, nullif(btrim(coalesce(p_external_url, '')), ''), left(coalesce(p_title, ''), 300), left(coalesce(p_alt_text, ''), 2000), next_order)
  returning resource_media_id into new_id;
  return new_id;
end;
$$;

create or replace function pac.delete_resource_media(p_resource_media_id uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  removed_media uuid;
begin
  delete from pac.resource_media where resource_media_id = p_resource_media_id returning media_id into removed_media;
  if not found then return false; end if;
  if removed_media is not null
    and not exists (select 1 from pac.resource_media where media_id = removed_media)
    and not exists (select 1 from pac.page_image_overrides where media_id = removed_media) then
    delete from pac.media_files where media_id = removed_media;
  end if;
  return true;
end;
$$;

-- A resource written by the consultant. It is published outright with the
-- consultant's standing approval and appears immediately in the chosen view.
create or replace function pac.create_resource_outright(requested_scope_id text, payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  new_item_id text;
  new_source_id text;
  new_revision_id uuid;
  new_decision_id bigint;
begin
  if requested_scope_id not in ('one-dhs', 'dsd') then
    raise exception 'Unknown program scope' using errcode = '22023';
  end if;
  if pac.resource_scope_id(payload) <> requested_scope_id then
    raise exception 'The resource view does not match' using errcode = '22023';
  end if;
  new_item_id := payload ->> 'id';
  if new_item_id is null or new_item_id !~ '^[a-z0-9][a-z0-9-]{2,120}$' then
    raise exception 'The resource identifier is not valid' using errcode = '22023';
  end if;
  if exists (select 1 from pac.content_items i where i.content_item_id = new_item_id) then
    raise exception 'A resource with this identifier already exists' using errcode = '23505';
  end if;

  insert into pac.content_items (content_item_id, content_kind, default_scope_id, staff_label, restricted, created_by, sensitivity_class)
  values (new_item_id, 'resource', requested_scope_id, left(payload ->> 'title', 300), false, 'practice-workspace-owner', 'S0');

  new_source_id := 'consultant-authored:' || new_item_id;
  insert into pac.source_items (
    source_item_id, source_business_id, source_version, title, normalized_payload,
    normalized_item_sha256, hash_algorithm, hash_algorithm_version,
    owner_approval_status, accounting_status, access_scope,
    sensitivity_class, deidentification_status, ordinary_indexing_allowed, model_context_allowed
  ) values (
    new_source_id, new_source_id, '1', left(payload ->> 'title', 300), payload,
    encode(sha256(convert_to(payload::text, 'UTF8')), 'hex'), 'sha256', '1',
    'owner_approved_for_ingestion', 'accounted', 'consultant',
    'S0', 'not_needed', true, true
  );

  insert into pac.content_revisions (
    content_item_id, revision_number, canonical_payload, change_summary,
    required_review_dimensions, created_by, sensitivity_class, ordinary_indexing_allowed, model_context_allowed
  ) values (
    new_item_id, 1, payload, 'Resource added by the consultant.',
    '{}'::text[], 'practice-workspace-owner', 'S0', true, true
  ) returning revision_id into new_revision_id;

  insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
  values (new_revision_id, new_source_id, 'primary', 'Written by the consultant.');

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason,
    sensitivity_class, unauthenticated_exposure_permitted, exposure_reason
  ) values (
    new_item_id, new_revision_id, requested_scope_id, 'publish',
    jsonb_build_object('approvalBasis', 'consultant_authored', 'staff_release_explicit', true),
    'practice-workspace-owner', 'Added by the consultant.',
    'S0', true, 'Consultant-authored resource for staff.'
  ) returning publication_decision_id into new_decision_id;

  insert into pac.change_events (actor_id, actor_role, scope_id, object_type, object_id, action, detail)
  values ('practice-workspace-owner', 'owner', requested_scope_id, 'content_item', new_item_id, 'resource_created',
    jsonb_build_object('revision_id', new_revision_id, 'publication_decision_id', new_decision_id));

  return jsonb_build_object('contentItemId', new_item_id, 'revisionId', new_revision_id);
end;
$$;

revoke all privileges on pac.media_files, pac.page_image_overrides, pac.resource_media from public, pac_app_runtime;
revoke all on function pac.save_media_file(text, text, bytea, text) from public;
revoke all on function pac.read_media_file(uuid) from public;
revoke all on function pac.read_page_image_overrides(text, text) from public;
revoke all on function pac.save_page_image_overrides(text, text, jsonb) from public;
revoke all on function pac.list_resource_media(text) from public;
revoke all on function pac.add_resource_media(text, text, uuid, text, text, text) from public;
revoke all on function pac.delete_resource_media(uuid) from public;
revoke all on function pac.create_resource_outright(text, jsonb) from public;
grant execute on function pac.save_media_file(text, text, bytea, text) to pac_app_runtime;
grant execute on function pac.read_media_file(uuid) to pac_app_runtime;
grant execute on function pac.read_page_image_overrides(text, text) to pac_app_runtime;
grant execute on function pac.save_page_image_overrides(text, text, jsonb) to pac_app_runtime;
grant execute on function pac.list_resource_media(text) to pac_app_runtime;
grant execute on function pac.add_resource_media(text, text, uuid, text, text, text) to pac_app_runtime;
grant execute on function pac.delete_resource_media(uuid) to pac_app_runtime;
grant execute on function pac.create_resource_outright(text, jsonb) to pac_app_runtime;

commit;
