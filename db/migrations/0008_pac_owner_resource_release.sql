begin;

create or replace function pac.resource_scope_id(candidate_payload jsonb)
returns text
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  if candidate_payload ->> 'scope' = 'agencywide' then return 'one-dhs'; end if;
  if candidate_payload ->> 'scope' = 'dsd' then return 'dsd'; end if;
  raise exception 'The resource scope is not available for publication' using errcode = '22023';
end;
$$;

create or replace function pac.resource_management_allowed(
  requested_scope_id text,
  requested_content_item_id text
)
returns boolean
language sql
stable
set search_path = pg_catalog, pac
as $$
  with recursive visible_scopes as (
    select scope.scope_id, scope.parent_scope_id
    from pac.program_scopes scope
    where scope.scope_id = requested_scope_id
      and scope.active = true
      and scope.scope_id <> 'one-dhs-pac'
    union all
    select parent.scope_id, parent.parent_scope_id
    from pac.program_scopes parent
    join visible_scopes child on child.parent_scope_id = parent.scope_id
    where parent.active = true and parent.scope_id <> 'one-dhs-pac'
  )
  select exists (
    select 1
    from pac.content_items item
    where item.content_item_id = requested_content_item_id
      and item.content_kind = 'resource'
      and item.retired_at is null
      and exists (
        select 1
        from pac.publication_decisions publication
        where publication.content_item_id = item.content_item_id
          and publication.scope_id in (select visible.scope_id from visible_scopes visible)
      )
  );
$$;

create or replace function pac.assert_exact_resource_scope(
  requested_scope_id text,
  candidate_payload jsonb
)
returns void
language plpgsql
stable
set search_path = pg_catalog, pac
as $$
begin
  if requested_scope_id not in ('one-dhs', 'dsd')
    or not exists (
      select 1 from pac.program_scopes scope
      where scope.scope_id = requested_scope_id and scope.active = true
    ) then
    raise exception 'This program scope is not available for resource changes' using errcode = '22023';
  end if;
  if pac.resource_scope_id(candidate_payload) is distinct from requested_scope_id then
    raise exception 'Resource changes must stay within this program scope' using errcode = '22023';
  end if;
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
  if candidate is null then return; end if;
  if candidate ~ '(^|[\n\r])[[:space:]]{0,3}(#{1,6}|[-+*]|[0-9]+[.)]|>)[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}(```|~~~)'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}([-*_][[:space:]]*){3,}([\n\r]|$)'
    or candidate ~ '(^|[\n\r])[[:space:]]*\|[^\n\r]*\|[[:space:]]*([\n\r]|$)'
    or candidate ~ '(^|[\n\r])[^\n\r]*[[:space:]]\|[[:space:]][^\n\r]*([\n\r]|$)'
    or candidate ~ '\*\*[^*\n\r]+\*\*'
    or candidate ~ '(^|[[:space:](])\*[^*\n\r]+\*([[:space:]).,;:!?]|$)'
    or candidate ~ '(^|[[:space:](])_[^_\n\r]+_([[:space:]).,;:!?]|$)'
    or candidate ~ '`[^`\n\r]+`'
    or candidate ~ '\[[^]\n\r]+\]\([^()\n\r]+\)' then
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
  if not pac.resource_management_allowed(requested_scope_id, requested_content_item_id) then
    raise exception 'Resource is not available for editing' using errcode = 'P0002';
  end if;

  return query
  with recursive visible_scopes as (
    select scope.scope_id, scope.parent_scope_id, 0 as distance
    from pac.program_scopes scope
    where scope.scope_id = requested_scope_id and scope.active = true
    union all
    select parent.scope_id, parent.parent_scope_id, child.distance + 1
    from pac.program_scopes parent
    join visible_scopes child on child.parent_scope_id = parent.scope_id
    where parent.active = true and parent.scope_id <> 'one-dhs-pac'
  ),
  latest_scope_decisions as (
    select ranked.*
    from (
      select decision.*,
        row_number() over (
          partition by decision.content_item_id, decision.scope_id
          order by decision.publication_decision_id desc
        ) as decision_rank
      from pac.publication_decisions decision
      where decision.content_item_id = requested_content_item_id
        and decision.scope_id in (select visible.scope_id from visible_scopes visible)
    ) ranked
    where ranked.decision_rank = 1
  ),
  current_publication as (
    select decision.revision_id, decision.scope_id, visible.distance
    from latest_scope_decisions decision
    join visible_scopes visible on visible.scope_id = decision.scope_id
    join pac.content_revisions revision on revision.revision_id = decision.revision_id
    join pac.content_items item on item.content_item_id = decision.content_item_id
    where decision.decision = 'publish'
      and revision.canonical_payload ->> 'status' = 'approved'
      and item.content_kind = 'resource'
      and item.restricted = false
      and item.retired_at is null
    order by visible.distance, decision.publication_decision_id desc
    limit 1
  ),
  local_draft as (
    select revision.*
    from pac.content_revisions revision
    where revision.content_item_id = requested_content_item_id
      and revision.canonical_payload ->> 'status' = 'under_review'
      and pac.resource_scope_id(revision.canonical_payload) = requested_scope_id
      and not exists (
        select 1
        from pac.content_revisions release
        where release.based_on_revision_id = revision.revision_id
          and release.canonical_payload ->> 'status' = 'approved'
      )
    order by revision.revision_number desc, revision.revision_id desc
    limit 1
  ),
  base_revision as (
    select revision.*
    from pac.content_revisions revision
    where revision.revision_id = coalesce(
      (select draft.revision_id from local_draft draft),
      (select publication.revision_id from current_publication publication)
    )
  )
  select requested_content_item_id,
    publication.revision_id,
    base.revision_id,
    jsonb_build_object(
      'title', base.canonical_payload -> 'title',
      'type', base.canonical_payload -> 'type',
      'authority', base.canonical_payload -> 'authority',
      'layer', base.canonical_payload -> 'layer',
      'summary', base.canonical_payload -> 'summary',
      'whyItMatters', coalesce(base.canonical_payload -> 'whyItMatters', 'null'::jsonb),
      'body', base.canonical_payload -> 'body',
      'nextActions', base.canonical_payload -> 'nextActions',
      'tags', base.canonical_payload -> 'tags',
      'intents', base.canonical_payload -> 'intents',
      'pathIds', coalesce(base.canonical_payload -> 'pathIds', '[]'::jsonb),
      'owner', base.canonical_payload -> 'owner',
      'reviewDate', base.canonical_payload -> 'reviewDate',
      'scope', to_jsonb(case when requested_scope_id = 'one-dhs' then 'agencywide' else 'dsd' end),
      'href', coalesce(base.canonical_payload -> 'href', 'null'::jsonb),
      'sourceName', coalesce(base.canonical_payload -> 'sourceName', 'null'::jsonb)
    ),
    draft.revision_id is not null
  from current_publication publication
  cross join base_revision base
  left join local_draft draft on true;
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
  editing_state record;
  base_revision pac.content_revisions%rowtype;
  next_revision_id uuid;
  next_payload jsonb;
  next_revision_number integer;
  next_change_summary text;
  required_reviews text[];
  changed_fields jsonb;
begin
  perform pac.assert_valid_resource_edit_fields(requested_editable_fields);
  perform pac.assert_exact_resource_scope(requested_scope_id, requested_editable_fields);
  if requested_change_note is not null and length(btrim(requested_change_note)) > 500 then
    raise exception 'The change note is too long' using errcode = '22023';
  end if;
  perform pac.assert_plain_resource_text(requested_change_note);
  next_change_summary := coalesce(nullif(btrim(requested_change_note), ''), 'Resource content updated in the Practice Workspace.');

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.content_kind = 'resource'
    and item.retired_at is null
  for update;
  if not found then
    raise exception 'Resource is not available for editing' using errcode = 'P0002';
  end if;

  select state.* into editing_state
  from pac.read_resource_editing_state(requested_scope_id, requested_content_item_id) state;
  if not found then
    raise exception 'Resource is not available for editing' using errcode = 'P0002';
  end if;
  if editing_state.base_revision_id is distinct from expected_base_revision_id then
    raise exception 'Resource changed after it was opened' using errcode = '40001';
  end if;

  select revision.* into base_revision
  from pac.content_revisions revision
  where revision.revision_id = editing_state.base_revision_id;
  if base_revision.canonical_payload ->> 'id' is distinct from requested_content_item_id
    or coalesce(length(base_revision.canonical_payload ->> 'version'), 0) = 0 then
    raise exception 'The current resource cannot be edited safely' using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(field.name order by field.name), '[]'::jsonb)
  into changed_fields
  from jsonb_object_keys(requested_editable_fields) field(name)
  where (
    case when field.name = 'scope'
      then to_jsonb(case when pac.resource_scope_id(base_revision.canonical_payload) = requested_scope_id
        then base_revision.canonical_payload ->> 'scope' else null end)
      else base_revision.canonical_payload -> field.name
    end
  ) is distinct from requested_editable_fields -> field.name;
  if jsonb_array_length(changed_fields) = 0 then
    raise exception 'No resource changes were provided' using errcode = '22000';
  end if;

  required_reviews := base_revision.required_review_dimensions;
  if coalesce(array_length(required_reviews, 1), 0) = 0 then
    required_reviews := array['language_alignment','factual_currentness','accessibility','scope','placement']::text[];
  end if;
  next_payload := jsonb_strip_nulls(
    base_revision.canonical_payload
      || requested_editable_fields
      || jsonb_build_object('id', requested_content_item_id, 'status', 'under_review', 'accessibility', 'pending')
  );
  select coalesce(max(revision.revision_number), 0) + 1 into next_revision_number
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id;

  insert into pac.content_revisions (
    content_item_id, revision_number, canonical_payload, change_summary,
    required_review_dimensions, created_by, based_on_revision_id
  ) values (
    requested_content_item_id, next_revision_number, next_payload, next_change_summary,
    required_reviews, 'practice-workspace-owner', base_revision.revision_id
  ) returning revision_id into next_revision_id;

  insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
  select next_revision_id, source.source_item_id, source.relationship, source.note
  from pac.revision_sources source where source.revision_id = base_revision.revision_id;
  insert into pac.revision_assets (revision_id, asset_id, purpose, staff_label, sort_order)
  select next_revision_id, asset.asset_id, asset.purpose, asset.staff_label, asset.sort_order
  from pac.revision_assets asset where asset.revision_id = base_revision.revision_id;
  insert into pac.review_records (revision_id, dimension, status, reviewer_role, findings)
  select next_revision_id, required.dimension, 'pending', 'program_steward',
    jsonb_build_object('reason', 'Content changed; review is required before publication.')
  from unnest(required_reviews) required(dimension);

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'practice-workspace-owner', 'owner', requested_scope_id, 'content_item',
    requested_content_item_id, 'draft_created',
    jsonb_build_object(
      'based_on_revision_id', base_revision.revision_id,
      'draft_revision_id', next_revision_id,
      'revision_number', next_revision_number,
      'changed_fields', changed_fields,
      'reviews_reset_to_pending', to_jsonb(required_reviews),
      'staff_publication_unchanged', true
    )
  );

  return query select state.* from pac.read_resource_editing_state(
    requested_scope_id, requested_content_item_id
  ) state;
end;
$$;


create or replace function pac.assert_resource_staff_release(candidate_revision_id uuid)
returns void
language plpgsql
stable
set search_path = pg_catalog, pac
as $$
declare
  candidate_payload jsonb;
  candidate_item_id text;
  candidate_kind text;
  editable_fields jsonb;
  staff_text text;
  text_character text;
  unicode_point integer;
begin
  select revision.canonical_payload, revision.content_item_id, item.content_kind
  into candidate_payload, candidate_item_id, candidate_kind
  from pac.content_revisions revision
  join pac.content_items item on item.content_item_id = revision.content_item_id
  where revision.revision_id = candidate_revision_id;
  if candidate_payload is null or candidate_kind <> 'resource' then
    raise exception 'The resource version is not available' using errcode = 'P0002';
  end if;
  if candidate_payload ->> 'id' is distinct from candidate_item_id
    or coalesce(length(btrim(candidate_payload ->> 'version')), 0) = 0 then
    raise exception 'The resource version is incomplete' using errcode = '22023';
  end if;

  editable_fields := jsonb_build_object(
    'title', candidate_payload -> 'title',
    'type', candidate_payload -> 'type',
    'authority', candidate_payload -> 'authority',
    'layer', candidate_payload -> 'layer',
    'summary', candidate_payload -> 'summary',
    'whyItMatters', coalesce(candidate_payload -> 'whyItMatters', 'null'::jsonb),
    'body', candidate_payload -> 'body',
    'nextActions', candidate_payload -> 'nextActions',
    'tags', candidate_payload -> 'tags',
    'intents', candidate_payload -> 'intents',
    'pathIds', coalesce(candidate_payload -> 'pathIds', '[]'::jsonb),
    'owner', candidate_payload -> 'owner',
    'reviewDate', candidate_payload -> 'reviewDate',
    'scope', candidate_payload -> 'scope',
    'href', coalesce(candidate_payload -> 'href', 'null'::jsonb),
    'sourceName', coalesce(candidate_payload -> 'sourceName', 'null'::jsonb)
  );
  perform pac.assert_valid_resource_edit_fields(editable_fields);

  select concat_ws(E'\n',
    candidate_payload ->> 'title',
    candidate_payload ->> 'summary',
    candidate_payload ->> 'whyItMatters',
    candidate_payload ->> 'owner',
    candidate_payload ->> 'sourceName',
    (select string_agg(part.value, E'\n') from jsonb_array_elements_text(candidate_payload -> 'body') part(value)),
    (select string_agg(action.value ->> 'label', E'\n') from jsonb_array_elements(candidate_payload -> 'nextActions') action(value)),
    (select string_agg(tag.value, E'\n') from jsonb_array_elements_text(candidate_payload -> 'tags') tag(value))
  ) into staff_text;
  if staff_text ~* '\m(ai|artificial intelligence|llm|gpt|chatgpt|claude|anthropic|openai|gemini|copilot|perplexity|vercel|chatbot|digital twin)\M'
    or staff_text ~* '\m(multi-agent|multiagent|orchestrator|dispatcher|specialist agent|mindset twin|system prompt|embeddings|vector search|vector store|rag|inference|temperature|model registry|provider adapter|provider route|autonomy level|agentic|api|endpoint|local storage|session storage|browser tab|environment variable|deployment|runtime|server-side|backend|frontend|serialized|payload|metadata|fixture|debugging|build pipeline|provenance|hallucination)\M' then
    raise exception 'Revise wording that does not fit the program staff voice' using errcode = '22023';
  end if;
  for text_character in select regexp_split_to_table(staff_text, '')
  loop
    unicode_point := ascii(text_character);
    if unicode_point between 9728 and 10175
      or unicode_point between 11008 and 11263
      or unicode_point between 126976 and 129791 then
      raise exception 'Staff resource wording must not contain icons' using errcode = '22023';
    end if;
  end loop;
end;
$$;

create or replace function pac.read_resource_release_state(
  requested_scope_id text,
  requested_content_item_id text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  release_state jsonb;
begin
  if not pac.resource_management_allowed(requested_scope_id, requested_content_item_id) then
    raise exception 'This resource is not available for review' using errcode = 'P0002';
  end if;

  with recursive visible_scopes as (
    select scope.scope_id, scope.parent_scope_id, 0 as distance
    from pac.program_scopes scope
    where scope.scope_id = requested_scope_id and scope.active = true
    union all
    select parent.scope_id, parent.parent_scope_id, child.distance + 1
    from pac.program_scopes parent
    join visible_scopes child on child.parent_scope_id = parent.scope_id
    where parent.active = true and parent.scope_id <> 'one-dhs-pac'
  ),
  latest_scope_decisions as (
    select ranked.*
    from (
      select decision.*,
        row_number() over (
          partition by decision.content_item_id, decision.scope_id
          order by decision.publication_decision_id desc
        ) as decision_rank
      from pac.publication_decisions decision
      where decision.content_item_id = requested_content_item_id
        and decision.scope_id in (select visible.scope_id from visible_scopes visible)
    ) ranked
    where ranked.decision_rank = 1
  ),
  exact_scope_decision as (
    select decision.*
    from pac.publication_decisions decision
    where decision.content_item_id = requested_content_item_id
      and decision.scope_id = requested_scope_id
    order by decision.publication_decision_id desc
    limit 1
  ),
  current_publication as (
    select decision.*, visible.distance
    from latest_scope_decisions decision
    join visible_scopes visible on visible.scope_id = decision.scope_id
    join pac.content_revisions revision on revision.revision_id = decision.revision_id
    join pac.content_items item on item.content_item_id = decision.content_item_id
    where decision.decision = 'publish'
      and revision.canonical_payload ->> 'status' = 'approved'
      and item.content_kind = 'resource'
      and item.restricted = false
      and item.retired_at is null
    order by visible.distance, decision.publication_decision_id desc
    limit 1
  ),
  local_draft as (
    select revision.*
    from pac.content_revisions revision
    where revision.content_item_id = requested_content_item_id
      and revision.canonical_payload ->> 'status' = 'under_review'
      and pac.resource_scope_id(revision.canonical_payload) = requested_scope_id
      and not exists (
        select 1 from pac.content_revisions release
        where release.based_on_revision_id = revision.revision_id
          and release.canonical_payload ->> 'status' = 'approved'
      )
    order by revision.revision_number desc, revision.revision_id desc
    limit 1
  ),
  draft_reviews as (
    select distinct on (review.dimension)
      review.review_id, review.dimension, review.status, review.findings, review.recorded_at
    from pac.review_records review
    join local_draft draft on draft.revision_id = review.revision_id
    order by review.dimension, review.recorded_at desc, review.review_id desc
  ),
  published_history as (
    select distinct on (decision.revision_id, decision.scope_id)
      decision.revision_id, decision.scope_id, decision.decided_at,
      decision.publication_decision_id
    from pac.publication_decisions decision
    where decision.content_item_id = requested_content_item_id
      and decision.decision = 'publish'
      and decision.scope_id in (select visible.scope_id from visible_scopes visible)
    order by decision.revision_id, decision.scope_id, decision.publication_decision_id desc
  )
  select jsonb_build_object(
    'contentItemId', item.content_item_id,
    'requestedScopeId', requested_scope_id,
    'scopeDecisionId', exact_decision.publication_decision_id::text,
    'scopeDecision', exact_decision.decision,
    'published', case when publication.revision_id is null then null else jsonb_build_object(
      'publicationDecisionId', publication.publication_decision_id::text,
      'revisionId', publication.revision_id,
      'revisionNumber', published_revision.revision_number,
      'scopeId', publication.scope_id,
      'isInherited', publication.scope_id <> requested_scope_id,
      'payload', published_revision.canonical_payload,
      'decidedAt', publication.decided_at
    ) end,
    'draft', case when draft.revision_id is null then null else jsonb_build_object(
      'revisionId', draft.revision_id,
      'revisionNumber', draft.revision_number,
      'payload', draft.canonical_payload,
      'changeSummary', draft.change_summary,
      'createdAt', draft.created_at,
      'requiredReviewDimensions', to_jsonb(draft.required_review_dimensions),
      'reviews', coalesce((
        select jsonb_agg(jsonb_build_object(
          'reviewId', review.review_id,
          'dimension', review.dimension,
          'status', review.status,
          'note', coalesce(review.findings ->> 'note', review.findings ->> 'reason'),
          'recordedAt', review.recorded_at
        ) order by array_position(draft.required_review_dimensions, review.dimension))
        from draft_reviews review
      ), '[]'::jsonb),
      'readyToPublish', not exists (
        select 1
        from unnest(draft.required_review_dimensions) required(dimension)
        left join draft_reviews review on review.dimension = required.dimension
        where review.status is null or review.status not in ('pass', 'not_applicable')
      )
    ) end,
    'withdrawn', coalesce(exact_decision.decision = 'withdraw', false),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'publicationDecisionId', history.publication_decision_id::text,
        'revisionId', history.revision_id,
        'revisionNumber', revision.revision_number,
        'scopeId', history.scope_id,
        'isInherited', history.scope_id <> requested_scope_id,
        'title', revision.canonical_payload ->> 'title',
        'payload', revision.canonical_payload,
        'decidedAt', history.decided_at,
        'isCurrent', history.revision_id = publication.revision_id
          and history.scope_id = publication.scope_id
      ) order by history.decided_at desc, revision.revision_number desc)
      from published_history history
      join pac.content_revisions revision on revision.revision_id = history.revision_id
    ), '[]'::jsonb)
  ) into release_state
  from pac.content_items item
  left join local_draft draft on true
  left join exact_scope_decision exact_decision on true
  left join current_publication publication on true
  left join pac.content_revisions published_revision on published_revision.revision_id = publication.revision_id
  where item.content_item_id = requested_content_item_id
    and item.content_kind = 'resource';
  return release_state;
end;
$$;

create or replace function pac.list_resource_release_queue(requested_scope_id text)
returns table (
  content_item_id text,
  title text,
  has_draft boolean,
  ready_to_publish boolean,
  is_published boolean,
  changed_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if requested_scope_id not in ('one-dhs', 'dsd')
    or not exists (
      select 1 from pac.program_scopes scope
      where scope.scope_id = requested_scope_id and scope.active = true
    ) then
    raise exception 'Unknown or inactive staff scope' using errcode = '22023';
  end if;

  return query
  with recursive visible_scopes as (
    select scope.scope_id, scope.parent_scope_id
    from pac.program_scopes scope
    where scope.scope_id = requested_scope_id and scope.active = true
    union all
    select parent.scope_id, parent.parent_scope_id
    from pac.program_scopes parent
    join visible_scopes child on child.parent_scope_id = parent.scope_id
    where parent.active = true and parent.scope_id <> 'one-dhs-pac'
  ),
  candidates as (
    select item.content_item_id
    from pac.content_items item
    where item.content_kind = 'resource'
      and item.retired_at is null
      and exists (
        select 1 from pac.publication_decisions decision
        where decision.content_item_id = item.content_item_id
          and decision.scope_id in (select visible.scope_id from visible_scopes visible)
      )
  )
  select candidate.content_item_id,
    coalesce(
      state.release_state #>> '{draft,payload,title}',
      state.release_state #>> '{published,payload,title}',
      candidate.content_item_id
    ),
    state.release_state -> 'draft' <> 'null'::jsonb,
    coalesce((state.release_state #>> '{draft,readyToPublish}')::boolean, false),
    state.release_state -> 'published' <> 'null'::jsonb,
    coalesce(
      (state.release_state #>> '{draft,createdAt}')::timestamptz,
      (state.release_state #>> '{published,decidedAt}')::timestamptz
    )
  from candidates candidate
  cross join lateral (
    select pac.read_resource_release_state(
      requested_scope_id, candidate.content_item_id
    ) as release_state
  ) state
  order by (state.release_state -> 'draft' <> 'null'::jsonb) desc,
    coalesce(
      (state.release_state #>> '{draft,createdAt}')::timestamptz,
      (state.release_state #>> '{published,decidedAt}')::timestamptz
    ) desc nulls last,
    candidate.content_item_id;
end;
$$;

create or replace function pac.record_resource_review(
  requested_scope_id text,
  requested_content_item_id text,
  expected_revision_id uuid,
  requested_dimension text,
  expected_prior_review_id uuid,
  requested_status text,
  requested_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  draft_revision pac.content_revisions%rowtype;
  prior_review_id uuid;
begin
  if not pac.resource_management_allowed(
    requested_scope_id, requested_content_item_id
  ) then
    raise exception 'This resource is not available for review' using errcode = 'P0002';
  end if;
  if requested_status not in ('pass', 'revise', 'blocked', 'not_applicable') then
    raise exception 'Choose an available review decision' using errcode = '22023';
  end if;
  if requested_note is not null and length(btrim(requested_note)) > 2000 then
    raise exception 'The review note is too long' using errcode = '22023';
  end if;
  perform pac.assert_plain_resource_text(requested_note);

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.content_kind = 'resource'
    and item.retired_at is null
  for update;
  if not found then
    raise exception 'This resource is not available for review' using errcode = 'P0002';
  end if;

  select revision.* into draft_revision
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id
    and revision.canonical_payload ->> 'status' = 'under_review'
    and pac.resource_scope_id(revision.canonical_payload) = requested_scope_id
    and not exists (
      select 1 from pac.content_revisions release
      where release.based_on_revision_id = revision.revision_id
        and release.canonical_payload ->> 'status' = 'approved'
    )
  order by revision.revision_number desc, revision.revision_id desc
  limit 1;

  if draft_revision.revision_id is distinct from expected_revision_id then
    raise exception 'The resource changed after the review was opened' using errcode = '40001';
  end if;
  perform pac.assert_exact_resource_scope(
    requested_scope_id, draft_revision.canonical_payload
  );
  if requested_dimension <> all(draft_revision.required_review_dimensions) then
    raise exception 'This review is not available for the current draft' using errcode = '22023';
  end if;

  select review.review_id into prior_review_id
  from pac.review_records review
  where review.revision_id = draft_revision.revision_id
    and review.dimension = requested_dimension
  order by review.recorded_at desc, review.review_id desc
  limit 1;

  if prior_review_id is distinct from expected_prior_review_id then
    raise exception 'This review changed after it was opened' using errcode = '40001';
  end if;

  insert into pac.review_records (
    revision_id, dimension, status, reviewer_role, reviewer_id,
    findings, supersedes_review_id
  ) values (
    draft_revision.revision_id,
    requested_dimension,
    requested_status,
    'publishing_approver',
    'practice-workspace-owner',
    case when nullif(btrim(requested_note), '') is null
      then '{}'::jsonb
      else jsonb_build_object('note', btrim(requested_note))
    end,
    prior_review_id
  );

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'practice-workspace-owner', 'owner', requested_scope_id, 'content_item',
    requested_content_item_id, 'review_recorded',
    jsonb_build_object(
      'revision_id', draft_revision.revision_id,
      'superseded_review_id', prior_review_id,
      'dimension', requested_dimension,
      'decision', requested_status
    )
  );

  return pac.read_resource_release_state(
    requested_scope_id, requested_content_item_id
  );
end;
$$;

create or replace function pac.publish_resource_draft(
  requested_scope_id text,
  requested_content_item_id text,
  expected_draft_revision_id uuid,
  expected_scope_decision_id bigint,
  requested_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  draft_revision pac.content_revisions%rowtype;
  current_scope_decision_id bigint;
  release_revision_id uuid;
  release_payload jsonb;
  release_revision_number integer;
  gate_reviews jsonb;
  new_publication_decision_id bigint;
begin
  if not pac.resource_management_allowed(
    requested_scope_id, requested_content_item_id
  ) then
    raise exception 'This resource is not available for publication' using errcode = 'P0002';
  end if;
  if requested_reason is null or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A short publication note is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_resource_text(requested_reason);

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.content_kind = 'resource'
    and item.retired_at is null
  for update;
  if not found then
    raise exception 'This resource is not available for publication' using errcode = 'P0002';
  end if;

  select decision.publication_decision_id into current_scope_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_scope_decision_id is distinct from expected_scope_decision_id then
    raise exception 'The publication changed after this page was opened' using errcode = '40001';
  end if;

  select revision.* into draft_revision
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id
    and revision.canonical_payload ->> 'status' = 'under_review'
    and pac.resource_scope_id(revision.canonical_payload) = requested_scope_id
    and not exists (
      select 1 from pac.content_revisions release
      where release.based_on_revision_id = revision.revision_id
        and release.canonical_payload ->> 'status' = 'approved'
    )
  order by revision.revision_number desc, revision.revision_id desc
  limit 1;
  if draft_revision.revision_id is distinct from expected_draft_revision_id then
    raise exception 'The resource changed after the publication review was opened' using errcode = '40001';
  end if;
  perform pac.assert_exact_resource_scope(
    requested_scope_id, draft_revision.canonical_payload
  );

  if exists (
    select 1
    from unnest(draft_revision.required_review_dimensions) required(dimension)
    left join lateral (
      select review.status
      from pac.review_records review
      where review.revision_id = draft_revision.revision_id
        and review.dimension = required.dimension
      order by review.recorded_at desc, review.review_id desc
      limit 1
    ) current_review on true
    where current_review.status is null
      or current_review.status not in ('pass', 'not_applicable')
  ) then
    raise exception 'Complete every required review before publication' using errcode = '55000';
  end if;

  perform pac.assert_resource_staff_release(draft_revision.revision_id);
  release_payload := draft_revision.canonical_payload
    || jsonb_build_object('status', 'approved', 'accessibility', 'reviewed');
  perform pac.assert_exact_resource_scope(requested_scope_id, release_payload);
  select coalesce(max(revision.revision_number), 0) + 1
  into release_revision_number
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id;

  insert into pac.content_revisions (
    content_item_id, revision_number, canonical_payload, change_summary,
    required_review_dimensions, created_by, based_on_revision_id
  ) values (
    requested_content_item_id, release_revision_number, release_payload,
    'Reviewed and approved for staff use.',
    draft_revision.required_review_dimensions,
    'practice-workspace-owner', draft_revision.revision_id
  ) returning revision_id into release_revision_id;

  insert into pac.revision_sources (
    revision_id, source_item_id, relationship, note
  )
  select release_revision_id, source.source_item_id, source.relationship, source.note
  from pac.revision_sources source
  where source.revision_id = draft_revision.revision_id;

  insert into pac.revision_assets (
    revision_id, asset_id, purpose, staff_label, sort_order
  )
  select release_revision_id, asset.asset_id, asset.purpose,
    asset.staff_label, asset.sort_order
  from pac.revision_assets asset
  where asset.revision_id = draft_revision.revision_id;

  insert into pac.review_records (
    revision_id, dimension, status, reviewer_role, reviewer_id, findings
  )
  select release_revision_id,
    required.dimension,
    current_review.status,
    'publishing_approver',
    'practice-workspace-owner',
    jsonb_build_object(
      'carried_forward_from_review_id', current_review.review_id,
      'release_validation', true
    )
  from unnest(draft_revision.required_review_dimensions) required(dimension)
  cross join lateral (
    select review.review_id, review.status
    from pac.review_records review
    where review.revision_id = draft_revision.revision_id
      and review.dimension = required.dimension
    order by review.recorded_at desc, review.review_id desc
    limit 1
  ) current_review;

  perform pac.assert_resource_staff_release(release_revision_id);
  select jsonb_agg(
    jsonb_build_object('dimension', review.dimension, 'status', review.status)
    order by array_position(
      draft_revision.required_review_dimensions, review.dimension
    )
  ) into gate_reviews
  from (
    select distinct on (record.dimension) record.dimension, record.status
    from pac.review_records record
    where record.revision_id = release_revision_id
    order by record.dimension, record.recorded_at desc, record.review_id desc
  ) review;

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision,
    gate_snapshot, decided_by, reason
  ) values (
    requested_content_item_id,
    release_revision_id,
    requested_scope_id,
    'publish',
    jsonb_build_object(
      'reviewed_draft_revision_id', draft_revision.revision_id,
      'replaced_scope_decision_id', current_scope_decision_id,
      'required_reviews', coalesce(gate_reviews, '[]'::jsonb),
      'staff_voice_checked', true,
      'plain_text_checked', true,
      'icons_checked', true
    ),
    'practice-workspace-owner',
    btrim(requested_reason)
  ) returning publication_decision_id into new_publication_decision_id;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'practice-workspace-owner', 'owner', requested_scope_id, 'content_item',
    requested_content_item_id, 'resource_published',
    jsonb_build_object(
      'draft_revision_id', draft_revision.revision_id,
      'published_revision_id', release_revision_id,
      'publication_decision_id', new_publication_decision_id,
      'revision_number', release_revision_number,
      'staff_release_explicit', true
    )
  );

  return pac.read_resource_release_state(
    requested_scope_id, requested_content_item_id
  );
end;
$$;

create or replace function pac.withdraw_resource_publication(
  requested_scope_id text,
  requested_content_item_id text,
  expected_published_revision_id uuid,
  expected_scope_decision_id bigint,
  requested_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_decision pac.publication_decisions%rowtype;
  new_publication_decision_id bigint;
begin
  if not pac.resource_management_allowed(
    requested_scope_id, requested_content_item_id
  ) then
    raise exception 'This resource is not available for withdrawal' using errcode = 'P0002';
  end if;
  if requested_reason is null or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A short withdrawal note is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_resource_text(requested_reason);

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.content_kind = 'resource'
    and item.retired_at is null
  for update;
  if not found then
    raise exception 'This resource is not available for withdrawal' using errcode = 'P0002';
  end if;

  select decision.* into current_decision
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_decision.publication_decision_id
    is distinct from expected_scope_decision_id then
    raise exception 'The publication changed after this page was opened' using errcode = '40001';
  end if;
  if current_decision.decision is distinct from 'publish'
    or current_decision.revision_id is null then
    raise exception 'This scope does not have a published version to withdraw' using errcode = '55000';
  end if;
  if current_decision.revision_id is distinct from expected_published_revision_id then
    raise exception 'The published resource changed after this page was opened' using errcode = '40001';
  end if;

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision,
    gate_snapshot, decided_by, reason
  ) values (
    requested_content_item_id,
    current_decision.revision_id,
    requested_scope_id,
    'withdraw',
    jsonb_build_object(
      'withdrawal_explicit', true,
      'withdrawn_publication_decision_id', current_decision.publication_decision_id
    ),
    'practice-workspace-owner',
    btrim(requested_reason)
  ) returning publication_decision_id into new_publication_decision_id;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'practice-workspace-owner', 'owner', requested_scope_id, 'content_item',
    requested_content_item_id, 'resource_withdrawn',
    jsonb_build_object(
      'withdrawn_revision_id', current_decision.revision_id,
      'withdrawn_publication_decision_id', current_decision.publication_decision_id,
      'withdrawal_decision_id', new_publication_decision_id,
      'staff_release_explicit', true
    )
  );

  return pac.read_resource_release_state(
    requested_scope_id, requested_content_item_id
  );
end;
$$;

create or replace function pac.republish_resource_revision(
  requested_scope_id text,
  requested_content_item_id text,
  requested_revision_id uuid,
  expected_scope_decision_id bigint,
  requested_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  requested_revision pac.content_revisions%rowtype;
  current_decision pac.publication_decisions%rowtype;
  gate_reviews jsonb;
  new_publication_decision_id bigint;
begin
  if not pac.resource_management_allowed(
    requested_scope_id, requested_content_item_id
  ) then
    raise exception 'This resource is not available for restoration' using errcode = 'P0002';
  end if;
  if requested_reason is null or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A short restoration note is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_resource_text(requested_reason);

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.content_kind = 'resource'
    and item.retired_at is null
  for update;
  if not found then
    raise exception 'This resource is not available for restoration' using errcode = 'P0002';
  end if;

  select decision.* into current_decision
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_decision.publication_decision_id
    is distinct from expected_scope_decision_id then
    raise exception 'The publication changed after this page was opened' using errcode = '40001';
  end if;

  select revision.* into requested_revision
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id
    and revision.revision_id = requested_revision_id;
  if requested_revision.revision_id is null
    or requested_revision.canonical_payload ->> 'status' <> 'approved' then
    raise exception 'Only a previously approved version can be restored' using errcode = '22023';
  end if;
  perform pac.assert_exact_resource_scope(
    requested_scope_id, requested_revision.canonical_payload
  );

  if not exists (
    select 1
    from pac.publication_decisions decision
    where decision.content_item_id = requested_content_item_id
      and decision.revision_id = requested_revision_id
      and decision.scope_id = requested_scope_id
      and decision.decision = 'publish'
  ) then
    raise exception 'Only a version previously published in this scope can be restored' using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(requested_revision.required_review_dimensions) required(dimension)
    left join lateral (
      select review.status
      from pac.review_records review
      where review.revision_id = requested_revision_id
        and review.dimension = required.dimension
      order by review.recorded_at desc, review.review_id desc
      limit 1
    ) current_review on true
    where current_review.status is null
      or current_review.status not in ('pass', 'not_applicable')
  ) then
    raise exception 'Only a fully reviewed version can be restored' using errcode = '55000';
  end if;
  perform pac.assert_resource_staff_release(requested_revision_id);

  if current_decision.decision = 'publish'
    and current_decision.revision_id = requested_revision_id then
    raise exception 'That version is already published' using errcode = '55000';
  end if;

  select jsonb_agg(
    jsonb_build_object('dimension', review.dimension, 'status', review.status)
    order by array_position(
      requested_revision.required_review_dimensions, review.dimension
    )
  ) into gate_reviews
  from (
    select distinct on (record.dimension) record.dimension, record.status
    from pac.review_records record
    where record.revision_id = requested_revision_id
    order by record.dimension, record.recorded_at desc, record.review_id desc
  ) review;

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision,
    gate_snapshot, decided_by, reason
  ) values (
    requested_content_item_id,
    requested_revision_id,
    requested_scope_id,
    'publish',
    jsonb_build_object(
      'restored_previous_revision', true,
      'replaced_scope_decision_id', current_decision.publication_decision_id,
      'required_reviews', coalesce(gate_reviews, '[]'::jsonb),
      'staff_voice_checked', true,
      'plain_text_checked', true,
      'icons_checked', true
    ),
    'practice-workspace-owner',
    btrim(requested_reason)
  ) returning publication_decision_id into new_publication_decision_id;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'practice-workspace-owner', 'owner', requested_scope_id, 'content_item',
    requested_content_item_id, 'resource_restored',
    jsonb_build_object(
      'restored_revision_id', requested_revision_id,
      'publication_decision_id', new_publication_decision_id,
      'staff_release_explicit', true
    )
  );

  return pac.read_resource_release_state(
    requested_scope_id, requested_content_item_id
  );
end;
$$;

revoke all privileges on function pac.resource_scope_id(jsonb) from public;
revoke all privileges on function pac.resource_management_allowed(text, text) from public;
revoke all privileges on function pac.assert_exact_resource_scope(text, jsonb) from public;
revoke all privileges on function pac.assert_plain_resource_text(text) from public;
revoke all privileges on function pac.assert_resource_staff_release(uuid) from public;
revoke all privileges on function pac.read_resource_editing_state(text, text) from public;
revoke all privileges on function pac.create_resource_draft(text, text, uuid, jsonb, text) from public;
revoke all privileges on function pac.read_resource_release_state(text, text) from public;
revoke all privileges on function pac.list_resource_release_queue(text) from public;
revoke all privileges on function pac.record_resource_review(text, text, uuid, text, uuid, text, text) from public;
revoke all privileges on function pac.publish_resource_draft(text, text, uuid, bigint, text) from public;
revoke all privileges on function pac.withdraw_resource_publication(text, text, uuid, bigint, text) from public;
revoke all privileges on function pac.republish_resource_revision(text, text, uuid, bigint, text) from public;

grant execute on function pac.read_resource_editing_state(text, text) to pac_app_runtime;
grant execute on function pac.create_resource_draft(text, text, uuid, jsonb, text) to pac_app_runtime;
grant execute on function pac.read_resource_release_state(text, text) to pac_app_runtime;
grant execute on function pac.list_resource_release_queue(text) to pac_app_runtime;
grant execute on function pac.record_resource_review(text, text, uuid, text, uuid, text, text) to pac_app_runtime;
grant execute on function pac.publish_resource_draft(text, text, uuid, bigint, text) to pac_app_runtime;
grant execute on function pac.withdraw_resource_publication(text, text, uuid, bigint, text) to pac_app_runtime;
grant execute on function pac.republish_resource_revision(text, text, uuid, bigint, text) to pac_app_runtime;

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
  'Returns an exact-scope resource draft or a read-only inherited publication as the base for a new local draft.';
comment on function pac.create_resource_draft(text, text, uuid, jsonb, text) is
  'Creates an unpublished resource draft only in the requested program scope.';
comment on function pac.read_resource_release_state(text, text) is
  'Shows local release state and inherited staff visibility while keeping inherited publications read-only.';
comment on function pac.record_resource_review(text, text, uuid, text, uuid, text, text) is
  'Appends a review only when both the draft and prior review versions still match.';
comment on function pac.publish_resource_draft(text, text, uuid, bigint, text) is
  'Publishes a reviewed resource only in the requested scope and checks the latest scope decision under lock.';
comment on function pac.withdraw_resource_publication(text, text, uuid, bigint, text) is
  'Withdraws only the requested scope publication after checking its exact decision version.';
comment on function pac.republish_resource_revision(text, text, uuid, bigint, text) is
  'Restores only a previously published exact-scope resource after checking the current decision version.';

commit;
