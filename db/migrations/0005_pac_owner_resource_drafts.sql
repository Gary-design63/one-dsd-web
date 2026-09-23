begin;

-- Replace the first staff-read function without changing its signature. A SECURITY
-- INVOKER view applies the caller's RLS policies even when selected inside a
-- SECURITY DEFINER function. Querying the same publication tables directly here
-- keeps the runtime role least-privileged while allowing the fixed definer boundary
-- to perform the approved read.
create or replace function pac.read_staff_publications(
  requested_scope_id text,
  requested_content_item_id text default null
)
returns table (
  content_item_id text,
  revision_id uuid,
  scope_id text,
  canonical_payload jsonb,
  payload_sha256 text,
  decided_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if not exists (
    select 1
    from pac.program_scopes scope_record
    where scope_record.scope_id = requested_scope_id
      and scope_record.active = true
      and scope_record.scope_id <> 'one-dhs-pac'
  ) then
    raise exception 'Unknown or inactive staff scope' using errcode = '22023';
  end if;

  return query
  with recursive visible_scopes as (
    select scope_record.scope_id, scope_record.parent_scope_id, 0 as distance
    from pac.program_scopes scope_record
    where scope_record.scope_id = requested_scope_id and scope_record.active = true

    union all

    select parent.scope_id, parent.parent_scope_id, child.distance + 1
    from pac.program_scopes parent
    join visible_scopes child on parent.scope_id = child.parent_scope_id
    where parent.active = true and parent.scope_id <> 'one-dhs-pac'
  ),
  decision_history as (
    select decision.*,
      row_number() over (
        partition by decision.content_item_id, decision.scope_id
        order by decision.publication_decision_id desc
      ) as decision_rank
    from pac.publication_decisions decision
  ),
  published as (
    select decision.content_item_id,
      decision.revision_id,
      decision.scope_id,
      decision.decided_at
    from decision_history decision
    where decision.decision_rank = 1 and decision.decision = 'publish'
  ),
  ranked as (
    select published.content_item_id,
      published.revision_id,
      published.scope_id,
      revision.canonical_payload,
      revision.payload_sha256,
      published.decided_at,
      row_number() over (
        partition by published.content_item_id
        order by visible.distance asc, published.decided_at desc, published.revision_id desc
      ) as publication_rank
    from published
    join visible_scopes visible on visible.scope_id = published.scope_id
    join pac.content_items item on item.content_item_id = published.content_item_id
    join pac.content_revisions revision
      on revision.revision_id = published.revision_id
      and revision.content_item_id = published.content_item_id
    where (requested_content_item_id is null or published.content_item_id = requested_content_item_id)
      and item.restricted = false
      and item.retired_at is null
      and revision.canonical_payload ->> 'status' = 'approved'
  )
  select ranked.content_item_id,
    ranked.revision_id,
    ranked.scope_id,
    ranked.canonical_payload,
    ranked.payload_sha256,
    ranked.decided_at
  from ranked
  where ranked.publication_rank = 1
  order by ranked.content_item_id;
end;
$$;

create or replace function pac.assert_plain_resource_text(candidate text)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  trimmed_candidate text;
  parsed_candidate jsonb;
begin
  if candidate is null then
    return;
  end if;
  if candidate ~ '(^|[\n\r])[[:space:]]{0,3}(#{1,6}|[-+*]|[0-9]+\.)[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}(```|~~~)'
    or candidate ~ '\*\*[^*\n\r]+\*\*'
    or candidate ~ '`[^`\n\r]+`'
    or candidate ~ '\[[^\n\r]+\]\([^()\n\r]+\)' then
    raise exception 'Staff resource fields must use plain text' using errcode = '22023';
  end if;

  trimmed_candidate := btrim(candidate);
  if (left(trimmed_candidate, 1) = '{' and right(trimmed_candidate, 1) = '}')
    or (left(trimmed_candidate, 1) = '[' and right(trimmed_candidate, 1) = ']') then
    begin
      parsed_candidate := trimmed_candidate::jsonb;
    exception when invalid_text_representation then
      parsed_candidate := null;
    end;
    if jsonb_typeof(parsed_candidate) in ('object', 'array') then
      raise exception 'Staff resource fields must not contain serialized data' using errcode = '22023';
    end if;
  end if;
end;
$$;

create or replace function pac.assert_valid_resource_edit_fields(editable_fields jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  field_name text;
  unexpected_field text;
  entry jsonb;
  parsed_review_date date;
begin
  if editable_fields is null or jsonb_typeof(editable_fields) <> 'object' then
    raise exception 'Editable resource fields must be a JSON object' using errcode = '22023';
  end if;

  select candidate.name into unexpected_field
  from jsonb_object_keys(editable_fields) candidate(name)
  where candidate.name <> all(array[
    'title', 'type', 'authority', 'layer', 'summary', 'whyItMatters', 'body',
    'nextActions', 'tags', 'intents', 'pathIds', 'owner', 'reviewDate', 'scope',
    'href', 'sourceName'
  ]::text[])
  limit 1;
  if unexpected_field is not null then
    raise exception 'Field % is not editable', unexpected_field using errcode = '22023';
  end if;

  foreach field_name in array array[
    'title', 'type', 'authority', 'layer', 'summary', 'whyItMatters', 'body',
    'nextActions', 'tags', 'intents', 'pathIds', 'owner', 'reviewDate', 'scope',
    'href', 'sourceName'
  ]::text[]
  loop
    if not editable_fields ? field_name then
      raise exception 'Required editable field % is missing', field_name using errcode = '22023';
    end if;
  end loop;

  foreach field_name in array array['title', 'type', 'authority', 'layer', 'summary', 'owner', 'reviewDate', 'scope']::text[]
  loop
    if jsonb_typeof(editable_fields -> field_name) <> 'string' then
      raise exception 'Field % must be text', field_name using errcode = '22023';
    end if;
  end loop;

  if length(btrim(editable_fields ->> 'title')) not between 1 and 300
    or length(btrim(editable_fields ->> 'summary')) not between 1 and 2000
    or length(btrim(editable_fields ->> 'owner')) not between 1 and 200 then
    raise exception 'A required text field is blank or too long' using errcode = '22023';
  end if;

  if editable_fields ->> 'type' <> all(array[
    'policy', 'job_aid', 'tool', 'checklist', 'practice_note', 'learning_module',
    'scenario', 'question_bank', 'external_reference'
  ]::text[]) then
    raise exception 'Resource type is not allowed' using errcode = '22023';
  end if;

  if editable_fields ->> 'authority' <> all(array[
    'official', 'guidance', 'practice_note', 'learning', 'community_brief',
    'partner_informed', 'local', 'under_review', 'external_verify'
  ]::text[]) then
    raise exception 'Authority value is not allowed' using errcode = '22023';
  end if;

  if editable_fields ->> 'layer' <> all(array['L1', 'L2', 'L3', 'L4']::text[]) then
    raise exception 'Resource depth is not allowed' using errcode = '22023';
  end if;

  if editable_fields ->> 'scope' <> all(array['agencywide', 'dsd']::text[]) then
    raise exception 'Resource scope is not allowed' using errcode = '22023';
  end if;

  if jsonb_typeof(editable_fields -> 'whyItMatters') not in ('string', 'null')
    or jsonb_typeof(editable_fields -> 'href') not in ('string', 'null')
    or jsonb_typeof(editable_fields -> 'sourceName') not in ('string', 'null') then
    raise exception 'An optional text field has the wrong type' using errcode = '22023';
  end if;
  if length(coalesce(editable_fields ->> 'whyItMatters', '')) > 3000
    or length(coalesce(editable_fields ->> 'href', '')) > 2000
    or length(coalesce(editable_fields ->> 'sourceName', '')) > 300 then
    raise exception 'An optional text field is too long' using errcode = '22023';
  end if;
  if editable_fields ->> 'href' is not null
    and editable_fields ->> 'href' !~* '^https://[^[:space:]]+$' then
    raise exception 'The source address must use HTTPS' using errcode = '22023';
  end if;

  if editable_fields ->> 'reviewDate' !~ '^\d{4}-\d{2}-\d{2}$' then
    raise exception 'Review date must use YYYY-MM-DD' using errcode = '22023';
  end if;
  begin
    parsed_review_date := (editable_fields ->> 'reviewDate')::date;
  exception when others then
    raise exception 'Review date is not a valid date' using errcode = '22023';
  end;
  if to_char(parsed_review_date, 'YYYY-MM-DD') <> editable_fields ->> 'reviewDate' then
    raise exception 'Review date is not a valid date' using errcode = '22023';
  end if;

  foreach field_name in array array['body', 'nextActions', 'tags', 'intents', 'pathIds']::text[]
  loop
    if jsonb_typeof(editable_fields -> field_name) <> 'array' then
      raise exception 'Field % must be a list', field_name using errcode = '22023';
    end if;
  end loop;

  if jsonb_array_length(editable_fields -> 'body') not between 1 and 200 then
    raise exception 'Resource content must include between 1 and 200 parts' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_array_elements(editable_fields -> 'body') part(value)
    where jsonb_typeof(part.value) <> 'string'
      or length(btrim(part.value #>> '{}')) not between 1 and 10000
  ) or (
    select coalesce(sum(length(part.value #>> '{}')), 0)
    from jsonb_array_elements(editable_fields -> 'body') part(value)
  ) > 100000 then
    raise exception 'Resource content contains a blank or oversized part' using errcode = '22023';
  end if;

  if jsonb_array_length(editable_fields -> 'nextActions') > 30 then
    raise exception 'Too many next steps were provided' using errcode = '22023';
  end if;
  for entry in select value from jsonb_array_elements(editable_fields -> 'nextActions') item(value)
  loop
    if jsonb_typeof(entry) <> 'object'
      or not (entry ? 'label' and entry ? 'href')
      or (select count(*) from jsonb_object_keys(entry)) <> 2
      or jsonb_typeof(entry -> 'label') <> 'string'
      or jsonb_typeof(entry -> 'href') <> 'string'
      or length(btrim(entry ->> 'label')) not between 1 and 200
      or length(entry ->> 'href') not between 1 and 2000
      or not (
        (entry ->> 'href' ~ '^/[^[:cntrl:]]*$' and entry ->> 'href' !~ '^//')
        or entry ->> 'href' ~* '^https://[^[:space:]]+$'
      ) then
      raise exception 'A next step is incomplete or has an unsafe address' using errcode = '22023';
    end if;
  end loop;

  if jsonb_array_length(editable_fields -> 'tags') > 50
    or exists (
      select 1 from jsonb_array_elements(editable_fields -> 'tags') tag(value)
      where jsonb_typeof(tag.value) <> 'string'
        or length(btrim(tag.value #>> '{}')) not between 1 and 100
    ) then
    raise exception 'Topics must be short, nonblank text' using errcode = '22023';
  end if;

  if jsonb_array_length(editable_fields -> 'intents') not between 1 and 11
    or exists (
      select 1 from jsonb_array_elements(editable_fields -> 'intents') intent(value)
      where jsonb_typeof(intent.value) <> 'string'
        or intent.value #>> '{}' <> all(array[
          'policy_orientation', 'practice_method', 'launch_embed', 'access_barriers',
          'workplace_culture', 'intercultural', 'uncertainty_authority', 'escalation',
          'next_actions', 'facilitation', 'boundary_refusal'
        ]::text[])
    ) then
    raise exception 'A resource purpose is not allowed' using errcode = '22023';
  end if;

  if jsonb_array_length(editable_fields -> 'pathIds') > 50
    or exists (
      select 1 from jsonb_array_elements(editable_fields -> 'pathIds') path_id(value)

      where jsonb_typeof(path_id.value) <> 'string'
        or path_id.value #>> '{}' !~ '^[a-z0-9][a-z0-9_-]{0,99}$'
    ) then
    raise exception 'A learning path selection is not allowed' using errcode = '22023';
  end if;

  perform pac.assert_plain_resource_text(editable_fields ->> 'title');
  perform pac.assert_plain_resource_text(editable_fields ->> 'summary');
  perform pac.assert_plain_resource_text(editable_fields ->> 'whyItMatters');
  perform pac.assert_plain_resource_text(editable_fields ->> 'owner');
  perform pac.assert_plain_resource_text(editable_fields ->> 'sourceName');
  for entry in select value from jsonb_array_elements(editable_fields -> 'body') item(value)
  loop
    perform pac.assert_plain_resource_text(entry #>> '{}');
  end loop;
  for entry in select value from jsonb_array_elements(editable_fields -> 'nextActions') item(value)
  loop
    perform pac.assert_plain_resource_text(entry ->> 'label');
  end loop;
  for entry in select value from jsonb_array_elements(editable_fields -> 'tags') item(value)
  loop
    perform pac.assert_plain_resource_text(entry #>> '{}');
  end loop;
end;
$$;

create or replace function pac.read_resource_editing_state(
  requested_scope_id text,
  requested_content_item_id text
)
returns table (
  content_item_id text,
  published_revision_id uuid,
  base_revision_id uuid,
  editable_fields jsonb,
  has_unpublished_changes boolean
)
language plpgsql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if requested_content_item_id is null
    or length(btrim(requested_content_item_id)) not between 1 and 200 then
    raise exception 'A resource identifier is required' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from pac.program_scopes scope_record
    where scope_record.scope_id = requested_scope_id
      and scope_record.active = true
      and scope_record.scope_id <> 'one-dhs-pac'
  ) then
    raise exception 'Unknown or inactive staff scope' using errcode = '22023';
  end if;

  return query
  select publication.content_item_id,
    publication.revision_id as published_revision_id,
    latest.revision_id as base_revision_id,
    jsonb_build_object(
      'title', latest.canonical_payload -> 'title',
      'type', latest.canonical_payload -> 'type',
      'authority', latest.canonical_payload -> 'authority',
      'layer', latest.canonical_payload -> 'layer',
      'summary', latest.canonical_payload -> 'summary',
      'whyItMatters', latest.canonical_payload -> 'whyItMatters',
      'body', latest.canonical_payload -> 'body',
      'nextActions', latest.canonical_payload -> 'nextActions',
      'tags', latest.canonical_payload -> 'tags',
      'intents', latest.canonical_payload -> 'intents',
      'pathIds', coalesce(latest.canonical_payload -> 'pathIds', '[]'::jsonb),
      'owner', latest.canonical_payload -> 'owner',
      'reviewDate', latest.canonical_payload -> 'reviewDate',
      'scope', latest.canonical_payload -> 'scope',
      'href', latest.canonical_payload -> 'href',
      'sourceName', latest.canonical_payload -> 'sourceName'
    ) as editable_fields,
    latest.revision_id <> publication.revision_id as has_unpublished_changes
  from pac.read_staff_publications(requested_scope_id, requested_content_item_id) publication
  cross join lateral (
    select revision.revision_id, revision.canonical_payload
    from pac.content_revisions revision
    where revision.content_item_id = publication.content_item_id
    order by revision.revision_number desc, revision.revision_id desc
    limit 1
  ) latest;
end;
$$;

create or replace function pac.create_resource_draft(
  requested_scope_id text,
  requested_content_item_id text,
  expected_base_revision_id uuid,
  requested_editable_fields jsonb,
  requested_change_note text default null
)
returns table (
  content_item_id text,
  published_revision_id uuid,
  base_revision_id uuid,
  editable_fields jsonb,
  has_unpublished_changes boolean
)
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  visible_publication_revision_id uuid;
  latest_revision_id uuid;
  latest_revision_number integer;
  latest_payload jsonb;
  latest_required_reviews text[];
  next_revision_id uuid;
  next_payload jsonb;
  next_revision_number integer;
  next_change_summary text;
  changed_fields jsonb;
begin
  perform pac.assert_valid_resource_edit_fields(requested_editable_fields);

  if requested_change_note is not null and length(btrim(requested_change_note)) > 500 then
    raise exception 'The change note is too long' using errcode = '22023';
  end if;
  next_change_summary := coalesce(
    nullif(btrim(requested_change_note), ''),
    'Resource content updated in the Practice Workspace.'
  );

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
  for update;
  if not found then
    raise exception 'Resource is not available for editing' using errcode = 'P0002';
  end if;

  select state.published_revision_id
  into visible_publication_revision_id
  from pac.read_resource_editing_state(requested_scope_id, requested_content_item_id) state;
  if not found then
    raise exception 'Resource is not available for editing' using errcode = 'P0002';
  end if;

  select revision.revision_id,
    revision.revision_number,
    revision.canonical_payload,
    revision.required_review_dimensions
  into latest_revision_id,
    latest_revision_number,
    latest_payload,
    latest_required_reviews
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id
  order by revision.revision_number desc, revision.revision_id desc
  limit 1;

  if latest_revision_id is distinct from expected_base_revision_id then
    raise exception 'Resource changed after it was opened' using errcode = '40001';
  end if;
  if latest_payload ->> 'id' is distinct from requested_content_item_id
    or coalesce(length(latest_payload ->> 'version'), 0) = 0 then
    raise exception 'The current resource cannot be edited safely' using errcode = '22023';
  end if;

  next_payload := jsonb_strip_nulls(
    latest_payload
      || requested_editable_fields
      || jsonb_build_object(
        'id', requested_content_item_id,
        'status', 'under_review',
        'accessibility', 'pending'
      )
  );
  if next_payload = latest_payload then
    raise exception 'No resource changes were provided' using errcode = '22000';
  end if;

  if coalesce(array_length(latest_required_reviews, 1), 0) = 0 then
    latest_required_reviews := array[
      'language_alignment',
      'factual_currentness',
      'accessibility',
      'scope',
      'placement'
    ]::text[];
  end if;
  if exists (
    select 1
    from unnest(latest_required_reviews) required_review(dimension)
    where required_review.dimension <> all(array[
      'language_alignment', 'factual_currentness', 'accessibility', 'scope',
      'placement', 'rights_and_consent', 'community_representation', 'legal_policy'
    ]::text[])
  ) then
    raise exception 'The required review list is not valid' using errcode = '22023';
  end if;

  next_revision_number := latest_revision_number + 1;
  insert into pac.content_revisions (
    content_item_id,
    revision_number,
    canonical_payload,
    change_summary,
    required_review_dimensions,
    created_by,
    based_on_revision_id
  ) values (
    requested_content_item_id,
    next_revision_number,
    next_payload,
    next_change_summary,
    latest_required_reviews,
    'practice-workspace-owner',
    latest_revision_id
  )
  returning revision_id into next_revision_id;

  insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
  select next_revision_id, source.source_item_id, source.relationship, source.note
  from pac.revision_sources source
  where source.revision_id = latest_revision_id;

  insert into pac.revision_assets (revision_id, asset_id, purpose, staff_label, sort_order)
  select next_revision_id, asset.asset_id, asset.purpose, asset.staff_label, asset.sort_order
  from pac.revision_assets asset
  where asset.revision_id = latest_revision_id;

  insert into pac.review_records (
    revision_id,
    dimension,
    status,
    reviewer_role,
    reviewer_id,
    findings
  )
  select next_revision_id,
    required_review.dimension,
    'pending',
    'program_steward',
    null,
    jsonb_build_object('reason', 'Content changed; review is required before publication.')
  from unnest(latest_required_reviews) required_review(dimension);

  select coalesce(jsonb_agg(field.name order by field.name), '[]'::jsonb)
  into changed_fields
  from jsonb_object_keys(requested_editable_fields) field(name)
  where latest_payload -> field.name is distinct from requested_editable_fields -> field.name;

  insert into pac.change_events (
    actor_id,
    actor_role,
    scope_id,
    object_type,
    object_id,
    action,
    detail
  ) values (
    'practice-workspace-owner',
    'owner',
    requested_scope_id,
    'content_item',
    requested_content_item_id,
    'draft_created',
    jsonb_build_object(
      'based_on_revision_id', latest_revision_id,
      'draft_revision_id', next_revision_id,
      'revision_number', next_revision_number,
      'changed_fields', changed_fields,
      'reviews_reset_to_pending', to_jsonb(latest_required_reviews),
      'staff_publication_unchanged', true
    )
  );

  return query
  select state.content_item_id,
    state.published_revision_id,
    state.base_revision_id,
    state.editable_fields,
    state.has_unpublished_changes
  from pac.read_resource_editing_state(requested_scope_id, requested_content_item_id) state;
end;
$$;

revoke all privileges on function pac.read_staff_publications(text, text) from public;
grant execute on function pac.read_staff_publications(text, text) to pac_app_runtime;
revoke all privileges on function pac.assert_valid_resource_edit_fields(jsonb) from public;
revoke all privileges on function pac.assert_plain_resource_text(text) from public;
revoke all privileges on function pac.read_resource_editing_state(text, text) from public;
revoke all privileges on function pac.create_resource_draft(text, text, uuid, jsonb, text) from public;

grant execute on function pac.read_resource_editing_state(text, text) to pac_app_runtime;
grant execute on function pac.create_resource_draft(text, text, uuid, jsonb, text) to pac_app_runtime;

revoke all privileges on pac.content_items from pac_app_runtime;
revoke all privileges on pac.content_revisions from pac_app_runtime;
revoke all privileges on pac.revision_sources from pac_app_runtime;
revoke all privileges on pac.revision_assets from pac_app_runtime;
revoke all privileges on pac.review_records from pac_app_runtime;
revoke all privileges on pac.publication_decisions from pac_app_runtime;
revoke all privileges on pac.change_events from pac_app_runtime;
revoke all privileges on pac.source_items from pac_app_runtime;
revoke all privileges on pac.source_carriers from pac_app_runtime;

comment on function pac.read_resource_editing_state(text, text) is
  'Owner editing boundary for a currently staff-visible resource. Returns editable fields only; source records and internal lineage are not exposed.';
comment on function pac.create_resource_draft(text, text, uuid, jsonb, text) is
  'Owner editing boundary that appends one draft, carries forward its source and asset links, resets required reviews to pending, records the change, and never publishes.';

commit;
