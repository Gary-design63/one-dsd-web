begin;

create or replace function pac.assert_page_block_request(
  requested_scope_id text,
  requested_content_item_id text
)
returns void
language plpgsql
stable
set search_path = pg_catalog, pac
as $$
begin
  if requested_content_item_id <> all(array['page-home', 'site-footer']::text[]) then
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;
  if not exists (
    select 1 from pac.program_scopes scope_record
    where scope_record.scope_id = requested_scope_id
      and scope_record.active = true
      and scope_record.scope_id in ('one-dhs', 'dsd')
  ) then
    raise exception 'Unknown or inactive page scope' using errcode = '22023';
  end if;
end;
$$;

create or replace function pac.assert_page_block_mutation_allowed(
  requested_scope_id text,
  requested_content_item_id text
)
returns void
language plpgsql
stable
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_page_block_request(requested_scope_id, requested_content_item_id);
  if not exists (
    select 1 from pac.content_items item
    where item.content_item_id = requested_content_item_id
      and item.default_scope_id = requested_scope_id
      and item.content_kind = 'internal'
      and item.restricted = true
      and item.retired_at is null
  ) then
    raise exception 'This page area belongs to another program scope' using errcode = '42501';
  end if;
end;
$$;

create or replace function pac.assert_plain_page_text(candidate text)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  trimmed_candidate text;
  parsed_candidate jsonb;
  icon_pattern text;
begin
  if candidate is null or length(btrim(candidate)) = 0 then
    raise exception 'Page wording cannot be blank' using errcode = '22023';
  end if;
  if candidate ~ '(^|[\n\r])[[:space:]]{0,3}(#{1,6}|[-+*]|[0-9]+\.)[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}(```|~~~)'
    or candidate ~ '\*\*[^*\n\r]+\*\*'
    or candidate ~ '`[^`\n\r]+`'
    or candidate ~ '\[[^]\n\r]+\]\([^()\n\r]+\)'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}>[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}[0-9]+\)[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}(-{3,}|_{3,}|\*{3,})[[:space:]]*($|[\n\r])'
    or candidate ~ '(^|[\n\r])[[:space:]]*\|[^\n\r]+\|[[:space:]]*($|[\n\r])'
    or candidate ~ '(^|[[:space:](])(\*[^*\n\r]+\*|_[^_\n\r]+_)($|[[:space:]).,;:!?])' then
    raise exception 'Page wording must use plain text' using errcode = '22023';
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
      raise exception 'Page wording must not contain serialized data' using errcode = '22023';
    end if;
  end if;

  if candidate ~* '(\mAI\M|\martificial intelligence\M|\mLLM\M|\mGPT([ -]?[0-9A-Za-z]+)?\M|\mChatGPT\M|\mClaude\M|\mAnthropic\M|\mOpenAI\M|\mGemini\M|\mCopilot\M|\mPerplexity\M|\mVercel\M|\mchatbot\M|\mAI assistant\M|\mdigital twin\M|\mmulti-?agent\M|\morchestrator\M|\mdispatcher\M|\mspecialist agent\M|\mmindset twin\M|\msystem prompt\M|\membeddings?\M|\mvector (search|store)\M|\mRAG\M|\minference\M|\mtemperature\M|\mmodel registry\M|\mprovider (adapter|route)\M|\mautonomy level\M|\magentic\M|\mAPI\M|\mendpoint\M|\m(local|session) storage\M|\mbrowser tab\M|\menvironment variables?\M|\mdeployment\M|\mruntime\M|\mserver-side\M|\mbackend\M|\mfrontend\M|\mserialized\M|\mpayload\M|\mmetadata\M|\mfixture\M|\mdebug(ging)?\M|\mbuild pipeline\M|\mprovenance\M|\mhallucinat(e|ed|ion|ions)\M)' then
    raise exception 'Page wording includes technical product language that is not staff-facing' using errcode = '22023';
  end if;

  icon_pattern := '[' || chr(9728) || '-' || chr(10175)
    || chr(11008) || '-' || chr(11263)
    || chr(126976) || '-' || chr(129791) || ']';
  if candidate ~ icon_pattern then
    raise exception 'Page wording must not contain icons' using errcode = '22023';
  end if;
end;
$$;

create or replace function pac.assert_safe_page_link(candidate text)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  if candidate is null or length(candidate) not between 1 and 2000
    or candidate ~ '[[:space:][:cntrl:]<>"\\]' then
    raise exception 'Page links must use a program path or secure web address' using errcode = '22023';
  end if;
  if left(candidate, 1) = '/' then
    if left(candidate, 2) = '//' or candidate ~ '(^|/)\.\.(/|$)' then
      raise exception 'Page links must use a safe program path' using errcode = '22023';
    end if;
    return;
  end if;
  if candidate !~* '^https://[^/[:space:]]+(?:/[^[:space:]]*)?$'
    or candidate ~* '^https://[^/]*@' then
    raise exception 'Page links must use a program path or secure web address' using errcode = '22023';
  end if;
end;
$$;

create or replace function pac.assert_valid_page_block_copy(
  requested_content_item_id text,
  requested_copy jsonb
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  expected_keys text[];
  link_keys text[];
  candidate_key text;
  maximum_length integer;
  candidate_value text;
begin
  if jsonb_typeof(requested_copy) <> 'object' then
    raise exception 'Page wording must be a complete set of labeled fields' using errcode = '22023';
  end if;

  if requested_content_item_id = 'page-home' then
    expected_keys := array[
      'heroKicker', 'headlineLine1', 'headlineLine2', 'headlineLine3',
      'heroLede', 'heroNote', 'heroImageAlt', 'primaryActionLabel',
      'primaryActionHref', 'secondaryActionLabel', 'secondaryActionHref',
      'aboutLabel', 'aboutText', 'guidedKicker', 'guidedTitle', 'guidedIntro',
      'guidedFallbackLabel', 'guidedFallbackNote', 'helpKicker', 'helpTitle',
      'askLabel', 'askHref', 'askDescription', 'communitiesLabel',
      'communitiesHref', 'communitiesDescription', 'resourcesLabel',
      'resourcesHref', 'resourcesDescription', 'supportLabel', 'supportHref',
      'supportAvailableDescription', 'supportPreviewDescription', 'goalsKicker',
      'goalsTitle', 'foundationLabel', 'foundationHref', 'learnLabel', 'learnHref',
      'applyLabel', 'applyHref', 'leadLabel', 'leadHref', 'commitmentsKicker',
      'commitmentsTitle', 'commitmentsLinkLabel', 'commitmentsLinkHref',
      'privacyLabel', 'privacyText'
    ]::text[];
    link_keys := array[
      'primaryActionHref', 'secondaryActionHref', 'askHref', 'communitiesHref',
      'resourcesHref', 'supportHref', 'foundationHref', 'learnHref', 'applyHref',
      'leadHref', 'commitmentsLinkHref'
    ]::text[];
  elsif requested_content_item_id = 'site-footer' then
    expected_keys := array[
      'identityKicker', 'identityText', 'helpHeading', 'askLabel', 'askHref',
      'resourcesLabel', 'resourcesHref', 'communitiesLabel', 'communitiesHref',
      'requestAvailableLabel', 'requestPreviewLabel', 'requestHref', 'trackLabel',
      'trackHref', 'escalationLabel', 'escalationHref', 'privacyHeading', 'privacyText'
    ]::text[];
    link_keys := array[
      'askHref', 'resourcesHref', 'communitiesHref', 'requestHref', 'trackHref',
      'escalationHref'
    ]::text[];
  else
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from unnest(expected_keys) expected(name)
    where not requested_copy ? expected.name
  ) or exists (
    select 1 from jsonb_object_keys(requested_copy) actual(name)
    where actual.name <> all(expected_keys)
  ) then
    raise exception 'Page wording fields do not match this page area' using errcode = '22023';
  end if;

  foreach candidate_key in array expected_keys loop
    if jsonb_typeof(requested_copy -> candidate_key) <> 'string' then
      raise exception 'Every page wording field must be text' using errcode = '22023';
    end if;
    candidate_value := requested_copy ->> candidate_key;
    maximum_length := case
      when candidate_key = any(link_keys) then 2000
      when candidate_key in ('identityText', 'privacyText') and requested_content_item_id = 'site-footer' then 4000
      when candidate_key in ('aboutText', 'guidedIntro', 'privacyText') then 3000
      when candidate_key in (
        'heroNote', 'askDescription', 'communitiesDescription', 'resourcesDescription',
        'supportAvailableDescription', 'supportPreviewDescription'
      ) then 2000
      when candidate_key in ('heroLede', 'guidedFallbackNote') then 1000
      when candidate_key in (
        'helpTitle', 'goalsTitle', 'foundationLabel', 'learnLabel', 'applyLabel',
        'leadLabel', 'commitmentsTitle', 'escalationLabel', 'heroImageAlt'
      ) then 500
      when candidate_key in ('guidedTitle', 'guidedFallbackLabel', 'commitmentsLinkLabel',
        'requestAvailableLabel', 'requestPreviewLabel', 'trackLabel') then 300
      else 200
    end;
    if length(btrim(candidate_value)) not between 1 and maximum_length then
      raise exception 'A page wording field is blank or too long' using errcode = '22023';
    end if;
    if candidate_key = any(link_keys) then
      perform pac.assert_safe_page_link(candidate_value);
    else
      perform pac.assert_plain_page_text(candidate_value);
    end if;
  end loop;
end;
$$;

create or replace function pac.read_page_block_publication(
  requested_scope_id text,
  requested_content_item_id text
)
returns table (
  content_item_id text,
  revision_id uuid,
  canonical_payload jsonb
)
language plpgsql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  perform pac.assert_page_block_request(requested_scope_id, requested_content_item_id);
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
  latest_per_scope as (
    select decision.*,
      row_number() over (
        partition by decision.content_item_id, decision.scope_id
        order by decision.publication_decision_id desc
      ) as decision_rank
    from pac.publication_decisions decision
    where decision.content_item_id = requested_content_item_id
  ),
  effective as (
    select decision.content_item_id, decision.revision_id, decision.decision,
      row_number() over (order by visible.distance asc, decision.publication_decision_id desc) as scope_rank
    from latest_per_scope decision
    join visible_scopes visible on visible.scope_id = decision.scope_id
    where decision.decision_rank = 1
  )
  select item.content_item_id, revision.revision_id, revision.canonical_payload
  from effective decision
  join pac.content_items item on item.content_item_id = decision.content_item_id
  join pac.content_revisions revision
    on revision.revision_id = decision.revision_id
    and revision.content_item_id = decision.content_item_id
  where decision.scope_rank = 1
    and decision.decision = 'publish'
    and item.content_kind = 'internal'
    and item.restricted = true
    and item.retired_at is null
    and revision.canonical_payload ->> 'id' = requested_content_item_id
    and revision.canonical_payload ->> 'status' = 'approved'
    and revision.canonical_payload ->> 'accessibility' = 'reviewed';
end;
$$;

create or replace function pac.read_page_block_editing_state(
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
  requested_payload_scope text;
  requested_surface text;
  latest_revision_id uuid;
  latest_payload jsonb;
  latest_required_reviews text[];
  published_revision_id uuid;
  publication_decision_id bigint;
  review_summary jsonb;
  history_summary jsonb;
  ready_to_publish boolean;
begin
  perform pac.assert_page_block_request(requested_scope_id, requested_content_item_id);
  requested_payload_scope := case when requested_scope_id = 'dsd' then 'dsd' else 'agencywide' end;
  requested_surface := case when requested_content_item_id = 'page-home' then 'home' else 'footer' end;

  if not exists (
    select 1 from pac.content_items item
    where item.content_item_id = requested_content_item_id
      and item.default_scope_id = requested_scope_id
      and item.content_kind = 'internal'
      and item.restricted = true
      and item.retired_at is null
  ) then
    return null;
  end if;

  select revision.revision_id, revision.canonical_payload, revision.required_review_dimensions
  into latest_revision_id, latest_payload, latest_required_reviews
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id
    and (
      revision.canonical_payload ->> 'scope' = requested_payload_scope
      or (requested_scope_id = 'dsd' and revision.canonical_payload ->> 'scope' = 'agencywide')
    )
  order by
    case when revision.canonical_payload ->> 'scope' = requested_payload_scope then 0 else 1 end,
    revision.revision_number desc,
    revision.revision_id desc
  limit 1;
  if latest_revision_id is null then return null; end if;

  select publication.revision_id into published_revision_id
  from pac.read_page_block_publication(requested_scope_id, requested_content_item_id) publication;
  select decision.publication_decision_id into publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc limit 1;

  select coalesce(jsonb_agg(jsonb_build_object(
      'reviewId', review.review_id,
      'dimension', required.dimension,
      'status', coalesce(review.status, 'pending'),
      'note', review.findings ->> 'note'
    ) order by array_position(latest_required_reviews, required.dimension)), '[]'::jsonb)
  into review_summary
  from unnest(latest_required_reviews) required(dimension)
  left join lateral (
    select record.review_id, record.status, record.findings
    from pac.review_records record
    where record.revision_id = latest_revision_id
      and record.dimension = required.dimension
    order by record.recorded_at desc, record.review_id desc
    limit 1
  ) review on true;

  ready_to_publish := latest_payload ->> 'status' = 'under_review'
    and not exists (
      select 1 from unnest(latest_required_reviews) required(dimension)
      left join lateral (
        select record.status
        from pac.review_records record
        where record.revision_id = latest_revision_id
          and record.dimension = required.dimension
        order by record.recorded_at desc, record.review_id desc
        limit 1
      ) review on true
      where review.status is null or review.status not in ('pass', 'not_applicable')
    );

  with recursive visible_scopes as (
    select scope_record.scope_id, scope_record.parent_scope_id
    from pac.program_scopes scope_record
    where scope_record.scope_id = requested_scope_id and scope_record.active = true
    union all
    select parent.scope_id, parent.parent_scope_id
    from pac.program_scopes parent
    join visible_scopes child on parent.scope_id = child.parent_scope_id
    where parent.active = true and parent.scope_id <> 'one-dhs-pac'
  ),
  published_revisions as (
    select decision.revision_id, max(decision.decided_at) as published_at
    from pac.publication_decisions decision
    join visible_scopes visible on visible.scope_id = decision.scope_id
    where decision.content_item_id = requested_content_item_id
      and decision.decision = 'publish'
    group by decision.revision_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'revisionId', revision.revision_id,
      'label', case
        when requested_surface = 'home' then
          'Version ' || revision.revision_number || ': '
          || (revision.canonical_payload #>> '{copy,headlineLine1}') || ' '
          || (revision.canonical_payload #>> '{copy,headlineLine2}') || ' '
          || (revision.canonical_payload #>> '{copy,headlineLine3}')
        else 'Version ' || revision.revision_number || ': '
          || (revision.canonical_payload #>> '{copy,identityKicker}')
      end,
      'publishedAt', published.published_at,
      'isCurrent', revision.revision_id = published_revision_id
    ) order by published.published_at desc), '[]'::jsonb)
  into history_summary
  from published_revisions published
  join pac.content_revisions revision on revision.revision_id = published.revision_id
  where revision.canonical_payload ->> 'status' = 'approved';

  return jsonb_build_object(
    'surface', requested_surface,
    'contentItemId', requested_content_item_id,
    'expectedRevisionId', latest_revision_id,
    'publishedRevisionId', published_revision_id,
    'publicationDecisionId', publication_decision_id::text,
    'isPublished', published_revision_id is not null,
    'hasUnpublishedChanges', published_revision_id is null or latest_revision_id <> published_revision_id,
    'copy', latest_payload -> 'copy',
    'reviews', review_summary,
    'canPublish', ready_to_publish,
    'history', history_summary
  );
end;
$$;

create or replace function pac.create_page_block_draft(
  requested_scope_id text,
  requested_content_item_id text,
  expected_base_revision_id uuid,
  requested_copy jsonb,
  requested_change_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_state jsonb;
  latest_revision_id uuid;
  latest_payload jsonb;
  next_revision_id uuid;
  next_revision_number integer;
  next_payload jsonb;
  requested_surface text;
  requested_payload_scope text;
begin
  perform pac.assert_page_block_mutation_allowed(requested_scope_id, requested_content_item_id);
  perform pac.assert_valid_page_block_copy(requested_content_item_id, requested_copy);
  if requested_change_note is not null and length(btrim(requested_change_note)) > 1000 then
    raise exception 'The change note is too long' using errcode = '22023';
  end if;
  if requested_change_note is not null and length(btrim(requested_change_note)) > 0 then
    perform pac.assert_plain_page_text(requested_change_note);
  end if;

  perform 1 from pac.content_items item
  where item.content_item_id = requested_content_item_id for update;
  if not found then raise exception 'This page area is not available' using errcode = 'P0002'; end if;

  current_state := pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
  if current_state is null then raise exception 'This page area is not available' using errcode = 'P0002'; end if;
  latest_revision_id := (current_state ->> 'expectedRevisionId')::uuid;
  if latest_revision_id is distinct from expected_base_revision_id then
    raise exception 'Page wording changed after it was opened' using errcode = '40001';
  end if;
  select canonical_payload into latest_payload
  from pac.content_revisions where revision_id = latest_revision_id;
  if latest_payload -> 'copy' = requested_copy then
    raise exception 'No page wording changes were provided' using errcode = '22000';
  end if;

  select coalesce(max(revision_number), 0) + 1 into next_revision_number
  from pac.content_revisions where content_item_id = requested_content_item_id;
  requested_surface := case when requested_content_item_id = 'page-home' then 'home' else 'footer' end;
  requested_payload_scope := case when requested_scope_id = 'dsd' then 'dsd' else 'agencywide' end;
  next_payload := jsonb_build_object(
    'id', requested_content_item_id,
    'blockType', requested_surface,
    'status', 'under_review',
    'accessibility', 'pending',
    'scope', requested_payload_scope,
    'version', next_revision_number::text,
    'copy', requested_copy
  );

  insert into pac.content_revisions (
    content_item_id, revision_number, canonical_payload, change_summary,
    required_review_dimensions, created_by, based_on_revision_id
  ) values (
    requested_content_item_id, next_revision_number, next_payload,
    coalesce(nullif(btrim(requested_change_note), ''), 'Page wording updated in the Practice Workspace.'),
    array['language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement']::text[],
    'practice-workspace-owner', latest_revision_id
  ) returning revision_id into next_revision_id;

  insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
  select next_revision_id, source.source_item_id, source.relationship, source.note
  from pac.revision_sources source where source.revision_id = latest_revision_id;
  insert into pac.revision_assets (revision_id, asset_id, purpose, staff_label, sort_order)
  select next_revision_id, asset.asset_id, asset.purpose, asset.staff_label, asset.sort_order
  from pac.revision_assets asset where asset.revision_id = latest_revision_id;
  insert into pac.review_records (revision_id, dimension, status, reviewer_role, findings)
  select next_revision_id, dimension, 'pending', 'program_steward',
    jsonb_build_object('note', 'Review is required before this wording can be published.')
  from unnest(array['language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement']::text[]) dimension;
  insert into pac.change_events (actor_id, actor_role, scope_id, object_type, object_id, action, detail)
  values ('practice-workspace-owner', 'owner', requested_scope_id, 'page_block',
    requested_content_item_id, 'draft_created', jsonb_build_object(
      'based_on_revision_id', latest_revision_id,
      'draft_revision_id', next_revision_id,
      'staff_publication_unchanged', true
    ));
  return pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
end;
$$;

create or replace function pac.record_page_block_review(
  requested_scope_id text,
  requested_content_item_id text,
  requested_revision_id uuid,
  requested_dimension text,
  requested_status text,
  expected_previous_review_id uuid,
  requested_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_state jsonb;
  previous_review_id uuid;
  required_dimensions text[];
begin
  perform pac.assert_page_block_mutation_allowed(requested_scope_id, requested_content_item_id);
  if requested_status not in ('pass', 'revise', 'blocked', 'not_applicable') then
    raise exception 'Review result is not allowed' using errcode = '22023';
  end if;
  if requested_note is not null and length(btrim(requested_note)) > 1000 then
    raise exception 'The review note is too long' using errcode = '22023';
  end if;
  if requested_note is not null and length(btrim(requested_note)) > 0 then
    perform pac.assert_plain_page_text(requested_note);
  end if;
  perform 1 from pac.content_items item
  where item.content_item_id = requested_content_item_id for update;
  if not found then raise exception 'This page area is not available' using errcode = 'P0002'; end if;
  current_state := pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
  if current_state is null or (current_state ->> 'expectedRevisionId')::uuid is distinct from requested_revision_id then
    raise exception 'Page wording changed after it was opened' using errcode = '40001';
  end if;
  select required_review_dimensions into required_dimensions
  from pac.content_revisions
  where revision_id = requested_revision_id
    and content_item_id = requested_content_item_id
    and canonical_payload ->> 'status' = 'under_review';
  if not found then raise exception 'Only the current draft can be reviewed' using errcode = '55000'; end if;
  if requested_dimension <> all(required_dimensions) then
    raise exception 'This review area is not required' using errcode = '22023';
  end if;
  select review_id into previous_review_id
  from pac.review_records
  where revision_id = requested_revision_id and dimension = requested_dimension
  order by recorded_at desc, review_id desc limit 1;
  if previous_review_id is distinct from expected_previous_review_id then
    raise exception 'This review changed after it was opened' using errcode = '40001';
  end if;
  insert into pac.review_records (
    revision_id, dimension, status, reviewer_role, reviewer_id, findings, supersedes_review_id
  ) values (
    requested_revision_id, requested_dimension, requested_status, 'program_steward',
    'practice-workspace-owner', jsonb_build_object('note', nullif(btrim(requested_note), '')),
    previous_review_id
  );
  insert into pac.change_events (actor_id, actor_role, scope_id, object_type, object_id, action, detail)
  values ('practice-workspace-owner', 'owner', requested_scope_id, 'page_block',
    requested_content_item_id, 'review_recorded', jsonb_build_object(
      'revision_id', requested_revision_id, 'dimension', requested_dimension, 'status', requested_status
    ));
  return pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
end;
$$;

create or replace function pac.publish_page_block_draft(
  requested_scope_id text,
  requested_content_item_id text,
  requested_revision_id uuid,
  expected_publication_decision_id bigint,
  requested_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_state jsonb;
  draft_payload jsonb;
  required_dimensions text[];
  release_revision_id uuid;
  release_revision_number integer;
  release_payload jsonb;
  current_publication_decision_id bigint;
begin
  perform pac.assert_page_block_mutation_allowed(requested_scope_id, requested_content_item_id);
  if requested_reason is null or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A brief publishing reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(requested_reason);
  perform 1 from pac.content_items item
  where item.content_item_id = requested_content_item_id for update;
  if not found then raise exception 'This page area is not available' using errcode = 'P0002'; end if;
  select decision.publication_decision_id into current_publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_publication_decision_id is distinct from expected_publication_decision_id then
    raise exception 'The publication decision changed after it was opened' using errcode = '40001';
  end if;
  current_state := pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
  if current_state is null or (current_state ->> 'expectedRevisionId')::uuid is distinct from requested_revision_id then
    raise exception 'Page wording changed after it was opened' using errcode = '40001';
  end if;
  select canonical_payload, required_review_dimensions
  into draft_payload, required_dimensions
  from pac.content_revisions
  where revision_id = requested_revision_id
    and content_item_id = requested_content_item_id
    and canonical_payload ->> 'status' = 'under_review';
  if not found then raise exception 'Only a reviewed draft can be published' using errcode = '55000'; end if;
  if exists (
    select 1 from unnest(required_dimensions) required(dimension)
    left join lateral (
      select review.status from pac.review_records review
      where review.revision_id = requested_revision_id and review.dimension = required.dimension
      order by review.recorded_at desc, review.review_id desc limit 1
    ) current_review on true
    where current_review.status is null or current_review.status not in ('pass', 'not_applicable')
  ) then
    raise exception 'Every required review must be complete before publishing' using errcode = '55000';
  end if;

  select coalesce(max(revision_number), 0) + 1 into release_revision_number
  from pac.content_revisions where content_item_id = requested_content_item_id;
  release_payload := draft_payload || jsonb_build_object(
    'status', 'approved', 'accessibility', 'reviewed', 'version', release_revision_number::text
  );
  insert into pac.content_revisions (
    content_item_id, revision_number, canonical_payload, change_summary,
    required_review_dimensions, created_by, based_on_revision_id
  ) values (
    requested_content_item_id, release_revision_number, release_payload,
    'Reviewed page wording approved for staff.', required_dimensions,
    'practice-workspace-owner', requested_revision_id
  ) returning revision_id into release_revision_id;
  insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
  select release_revision_id, source.source_item_id, source.relationship, source.note
  from pac.revision_sources source where source.revision_id = requested_revision_id;
  insert into pac.revision_assets (revision_id, asset_id, purpose, staff_label, sort_order)
  select release_revision_id, asset.asset_id, asset.purpose, asset.staff_label, asset.sort_order
  from pac.revision_assets asset where asset.revision_id = requested_revision_id;
  insert into pac.review_records (
    revision_id, dimension, status, reviewer_role, reviewer_id, findings
  )
  select release_revision_id, required.dimension, current_review.status,
    'program_steward', 'practice-workspace-owner',
    jsonb_build_object('note', 'Carried forward from the reviewed draft.', 'reviewed_draft_revision_id', requested_revision_id)
  from unnest(required_dimensions) required(dimension)
  join lateral (
    select review.status from pac.review_records review
    where review.revision_id = requested_revision_id and review.dimension = required.dimension
    order by review.recorded_at desc, review.review_id desc limit 1
  ) current_review on true;
  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason
  ) values (
    requested_content_item_id, release_revision_id, requested_scope_id, 'publish',
    jsonb_build_object('required_reviews_complete', true, 'explicit_owner_decision', true,
      'reviewed_draft_revision_id', requested_revision_id),
    'practice-workspace-owner', btrim(requested_reason)
  );
  insert into pac.change_events (actor_id, actor_role, scope_id, object_type, object_id, action, detail)
  values ('practice-workspace-owner', 'owner', requested_scope_id, 'page_block',
    requested_content_item_id, 'published', jsonb_build_object(
      'reviewed_draft_revision_id', requested_revision_id, 'release_revision_id', release_revision_id
    ));
  return pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
end;
$$;

create or replace function pac.withdraw_page_block_publication(
  requested_scope_id text,
  requested_content_item_id text,
  expected_published_revision_id uuid,
  expected_publication_decision_id bigint,
  requested_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_revision_id uuid;
  current_publication_decision_id bigint;
begin
  perform pac.assert_page_block_mutation_allowed(requested_scope_id, requested_content_item_id);
  if requested_reason is null or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A brief withdrawal reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(requested_reason);
  perform 1 from pac.content_items item
  where item.content_item_id = requested_content_item_id for update;
  if not found then raise exception 'This page area is not available' using errcode = 'P0002'; end if;
  select decision.publication_decision_id into current_publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_publication_decision_id is distinct from expected_publication_decision_id then
    raise exception 'The publication decision changed after it was opened' using errcode = '40001';
  end if;
  select publication.revision_id into current_revision_id
  from pac.read_page_block_publication(requested_scope_id, requested_content_item_id) publication;
  if current_revision_id is null or current_revision_id is distinct from expected_published_revision_id then
    raise exception 'Published page wording changed after it was opened' using errcode = '40001';
  end if;
  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason
  ) values (
    requested_content_item_id, current_revision_id, requested_scope_id, 'withdraw',
    jsonb_build_object('explicit_owner_decision', true), 'practice-workspace-owner', btrim(requested_reason)
  );
  insert into pac.change_events (actor_id, actor_role, scope_id, object_type, object_id, action, detail)
  values ('practice-workspace-owner', 'owner', requested_scope_id, 'page_block',
    requested_content_item_id, 'withdrawn', jsonb_build_object('revision_id', current_revision_id));
  return pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
end;
$$;

create or replace function pac.rollback_page_block_publication(
  requested_scope_id text,
  requested_content_item_id text,
  expected_published_revision_id uuid,
  target_revision_id uuid,
  expected_publication_decision_id bigint,
  requested_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_revision_id uuid;
  target_payload jsonb;
  current_publication_decision_id bigint;
begin
  perform pac.assert_page_block_mutation_allowed(requested_scope_id, requested_content_item_id);
  if requested_reason is null or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A brief restoration reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(requested_reason);
  perform 1 from pac.content_items item
  where item.content_item_id = requested_content_item_id for update;
  if not found then raise exception 'This page area is not available' using errcode = 'P0002'; end if;
  select decision.publication_decision_id into current_publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_publication_decision_id is distinct from expected_publication_decision_id then
    raise exception 'The publication decision changed after it was opened' using errcode = '40001';
  end if;
  select publication.revision_id into current_revision_id
  from pac.read_page_block_publication(requested_scope_id, requested_content_item_id) publication;
  if current_revision_id is distinct from expected_published_revision_id then
    raise exception 'Published page wording changed after it was opened' using errcode = '40001';
  end if;
  select revision.canonical_payload into target_payload
  from pac.content_revisions revision
  where revision.revision_id = target_revision_id
    and revision.content_item_id = requested_content_item_id
    and revision.canonical_payload ->> 'status' = 'approved'
    and revision.canonical_payload ->> 'accessibility' = 'reviewed'
    and (
      revision.canonical_payload ->> 'scope' = case when requested_scope_id = 'dsd' then 'dsd' else 'agencywide' end
      or (requested_scope_id = 'dsd' and revision.canonical_payload ->> 'scope' = 'agencywide')
    );
  if not found or not exists (
    select 1 from pac.publication_decisions decision
    where decision.content_item_id = requested_content_item_id
      and decision.revision_id = target_revision_id
      and decision.decision = 'publish'
  ) then
    raise exception 'The selected approved wording cannot be restored' using errcode = '55000';
  end if;
  if target_revision_id is not distinct from current_revision_id then
    raise exception 'The selected wording is already available to staff' using errcode = '22000';
  end if;
  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason
  ) values (
    requested_content_item_id, target_revision_id, requested_scope_id, 'publish',
    jsonb_build_object('explicit_owner_decision', true, 'restored_approved_revision', true),
    'practice-workspace-owner', btrim(requested_reason)
  );
  insert into pac.change_events (actor_id, actor_role, scope_id, object_type, object_id, action, detail)
  values ('practice-workspace-owner', 'owner', requested_scope_id, 'page_block',
    requested_content_item_id, 'approved_revision_restored', jsonb_build_object(
      'previous_revision_id', current_revision_id, 'restored_revision_id', target_revision_id
    ));
  return pac.read_page_block_editing_state(requested_scope_id, requested_content_item_id);
end;
$$;

do $$
declare
  home_copy jsonb := $home$
  {
    "heroKicker":"One DHS People, Access and Culture Program",
    "headlineLine1":"One DHS People,",
    "headlineLine2":"Access and Culture",
    "headlineLine3":"Program",
    "heroLede":"Practical support for DHS staff across equity, accessibility, intercultural practice, leadership, and engagement.",
    "heroNote":"Begin with a question or explore the resources. The program does not score or rank you. Notes and progress you choose to save remain in the web browser you are using.",
    "heroImageAlt":"Colleagues in conversation around a table with papers and a laptop.",
    "primaryActionLabel":"Start here",
    "primaryActionHref":"/guided-start",
    "secondaryActionLabel":"Ask a question",
    "secondaryActionHref":"/ask",
    "aboutLabel":"About this program.",
    "aboutText":"This consultant-owned resource supports program design and learning. It does not connect to the Minnesota Department of Human Services, the Aging and Disability Services Administration, or the Disability Services Division, and does not represent itself as owned, sponsored, or approved by them.",
    "guidedKicker":"Guided Start",
    "guidedTitle":"What are you working on?",
    "guidedIntro":"Choose the situation closest to your work. You will find guidance, relevant community context, and practical tools for shaping notes and next steps you can keep. At the end, you can review your work and decide whether a consultation would help.",
    "guidedFallbackLabel":"Not sure, or several of these",
    "guidedFallbackNote":"Guided Start can help you choose where to begin.",
    "helpKicker":"Choose what would help",
    "helpTitle":"Ask, Minnesota Communities, Resources, Support",
    "askLabel":"Ask",
    "askHref":"/ask",
    "askDescription":"Ask a general work question and get a plain-language answer with its sources and limits. No meeting is needed.",
    "communitiesLabel":"Minnesota Communities",
    "communitiesHref":"/minnesota-communities",
    "communitiesDescription":"Short briefs for Minnesota work: what to ask, access checks, who to involve, and what not to assume. They are guides for preparing, not labels for people.",
    "resourcesLabel":"Resources",
    "resourcesHref":"/resources",
    "resourcesDescription":"Find checklists, job aids, question banks, and learning materials. Each resource tells you where its guidance comes from and its review date.",
    "supportLabel":"Support",
    "supportHref":"/support",
    "supportAvailableDescription":"Request a consultation, check on a request, or find the right person for complaints, legal questions, or Tribal matters.",
    "supportPreviewDescription":"Preview a consultation request or find the right person for complaints, legal questions, or Tribal matters. Request submission is not open yet.",
    "goalsKicker":"Explore by goal",
    "goalsTitle":"Foundation, Learn, Apply, Lead",
    "foundationLabel":"Foundation: how this program works and the commitments behind it",
    "foundationHref":"/resources/lm-how-this-program-works",
    "learnLabel":"Learn: modules, scenarios, and job aids",
    "learnHref":"/learn",
    "applyLabel":"Apply: tools for a meeting, a message, or a decision today",
    "applyHref":"/resources",
    "leadLabel":"Lead: Equity in Practice, six perspectives and seven questions",
    "leadHref":"/resources/pn-equity-in-practice",
    "commitmentsKicker":"Core commitments",
    "commitmentsTitle":"Six commitments behind every decision",
    "commitmentsLinkLabel":"Read the practice note",
    "commitmentsLinkHref":"/resources/pn-partnership-spine",
    "privacyLabel":"Protect your privacy.",
    "privacyText":"Please do not enter case, medical, personnel, or identifying details anywhere in this program. Answers show their sources and limits and never stand in for official policy, legal advice, Employee Culture, civil-rights processes, or Tribal consultation."
  }
  $home$::jsonb;
  footer_copy jsonb := $footer$
  {
    "identityKicker":"One DHS People, Access and Culture Program",
    "identityText":"This consultant-owned resource supports program design and learning. It does not connect to the Minnesota Department of Human Services, the Aging and Disability Services Administration, or the Disability Services Division, and does not represent itself as owned, sponsored, or approved by them. It does not accept case work or complaints, create an official record, or replace policy and decisions made by the appropriate people.",
    "helpHeading":"Find help",
    "askLabel":"Ask a question",
    "askHref":"/ask",
    "resourcesLabel":"Resources",
    "resourcesHref":"/resources",
    "communitiesLabel":"Minnesota Communities",
    "communitiesHref":"/minnesota-communities",
    "requestAvailableLabel":"Request a consultation",
    "requestPreviewLabel":"Preview a consultation request",
    "requestHref":"/support/request",
    "trackLabel":"Check a request",
    "trackHref":"/support/track",
    "escalationLabel":"Who to contact for complaints, Human Resources, legal, or Tribal matters",
    "escalationHref":"/resources/pn-when-to-escalate",
    "privacyHeading":"Privacy and access",
    "privacyText":"Please do not enter case, medical, personnel, or identifying details anywhere in this program. Working notes are saved in the web browser you are using, where another person using the same browser may be able to see them. If any part of the program is difficult to use with assistive technology, Support explains how to report the barrier."
  }
  $footer$::jsonb;
  block_record record;
  carrier_id_value uuid;
  source_payload jsonb;
  seed_payload jsonb;
  seed_revision_id uuid;
  required_dimension text;
begin
  perform pac.assert_valid_page_block_copy('page-home', home_copy);
  perform pac.assert_valid_page_block_copy('site-footer', footer_copy);

  for block_record in
    select * from (values
      ('page-home'::text, 'home'::text, 'Home page wording'::text, 'app/page.tsx'::text, home_copy),
      ('site-footer'::text, 'footer'::text, 'Page footer wording'::text, 'components/site-footer.tsx'::text, footer_copy)
    ) block_values(content_item_id, surface, staff_label, source_path, copy)
  loop
    source_payload := jsonb_build_object(
      'kind', 'built_in_program_copy',
      'path', block_record.source_path,
      'surface', block_record.surface,
      'purpose', 'Approved wording captured before program-wide inline editing.'
    );
    insert into pac.source_carriers (
      logical_key, media_type, original_name, byte_count, raw_blob_sha256,
      external_locator, captured_by
    ) values (
      'built-in:' || block_record.source_path,
      'application/json', block_record.source_path,
      octet_length(convert_to(source_payload::text, 'UTF8')),
      encode(digest(convert_to(source_payload::text, 'UTF8'), 'sha256'), 'hex'),
      jsonb_build_object('kind', 'built_in_program_copy', 'path', block_record.source_path),
      'pac-home-footer-content-migration'
    ) on conflict (logical_key) do nothing;
    select carrier_id into carrier_id_value from pac.source_carriers
    where logical_key = 'built-in:' || block_record.source_path;

    insert into pac.source_items (
      source_item_id, source_business_id, carrier_id, source_version, source_pointer,
      title, normalized_payload, normalized_item_sha256, hash_algorithm,
      hash_algorithm_version, owner_approval_status, accounting_status, access_scope
    ) values (
      'built-in-' || block_record.surface || '-copy-2026-09-05',
      'built-in-' || block_record.surface || '-copy',
      carrier_id_value, '1', block_record.source_path, block_record.staff_label,
      source_payload, encode(digest(convert_to(source_payload::text, 'UTF8'), 'sha256'), 'hex'),
      'sha256', '1', 'owner_approved_for_ingestion', 'accounted', 'internal_source'
    ) on conflict (source_item_id) do nothing;

    insert into pac.content_items (
      content_item_id, content_kind, default_scope_id, staff_label, restricted, created_by
    ) values (
      block_record.content_item_id, 'internal', 'one-dhs', block_record.staff_label, true,
      'pac-home-footer-content-migration'
    ) on conflict (content_item_id) do nothing;
    if not exists (
      select 1 from pac.content_items item
      where item.content_item_id = block_record.content_item_id
        and item.content_kind = 'internal' and item.restricted = true
    ) then
      raise exception 'Existing page block has incompatible content settings';
    end if;

    seed_payload := jsonb_build_object(
      'id', block_record.content_item_id,
      'blockType', block_record.surface,
      'status', 'approved',
      'accessibility', 'reviewed',
      'scope', 'agencywide',
      'version', '1',
      'copy', block_record.copy
    );
    insert into pac.content_revisions (
      content_item_id, revision_number, canonical_payload, change_summary,
      required_review_dimensions, created_by
    ) select
      block_record.content_item_id, 1, seed_payload,
      'Current approved wording captured for governed inline editing.',
      array['language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement']::text[],
      'pac-home-footer-content-migration'
    where not exists (
      select 1 from pac.content_revisions revision
      where revision.content_item_id = block_record.content_item_id
        and revision.canonical_payload = seed_payload
    );
    select revision_id into seed_revision_id
    from pac.content_revisions revision
    where revision.content_item_id = block_record.content_item_id
      and revision.canonical_payload = seed_payload
    order by revision.revision_number asc limit 1;
    if seed_revision_id is null then raise exception 'Page block seed revision was not created'; end if;

    insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
    select seed_revision_id, 'built-in-' || block_record.surface || '-copy-2026-09-05',
      'primary', 'Accounted built-in wording captured from the application.'
    where not exists (
      select 1 from pac.revision_sources source
      where source.revision_id = seed_revision_id
        and source.source_item_id = 'built-in-' || block_record.surface || '-copy-2026-09-05'
        and source.relationship = 'primary'
    );
    foreach required_dimension in array array[
      'language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement'
    ]::text[] loop
      insert into pac.review_records (
        revision_id, dimension, status, reviewer_role, reviewer_id, findings
      ) select seed_revision_id, required_dimension, 'pass', 'program_steward',
        'pac-home-footer-content-migration',
        jsonb_build_object('note', 'Current approved wording retained without alteration.')
      where not exists (
        select 1 from pac.review_records review
        where review.revision_id = seed_revision_id and review.dimension = required_dimension
      );
    end loop;
    insert into pac.publication_decisions (
      content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason
    ) select block_record.content_item_id, seed_revision_id, 'one-dhs', 'publish',
      jsonb_build_object('seeded_current_approved_wording', true, 'required_reviews_complete', true),
      'pac-home-footer-content-migration', 'Current approved wording retained for staff.'
    where not exists (
      select 1 from pac.publication_decisions decision
      where decision.content_item_id = block_record.content_item_id
        and decision.scope_id = 'one-dhs'
    );
  end loop;
end;
$$;

revoke all privileges on function pac.assert_page_block_request(text, text) from public;
revoke all privileges on function pac.assert_page_block_mutation_allowed(text, text) from public;
revoke all privileges on function pac.assert_plain_page_text(text) from public;
revoke all privileges on function pac.assert_safe_page_link(text) from public;
revoke all privileges on function pac.assert_valid_page_block_copy(text, jsonb) from public;
revoke all privileges on function pac.read_page_block_publication(text, text) from public;
revoke all privileges on function pac.read_page_block_editing_state(text, text) from public;
revoke all privileges on function pac.create_page_block_draft(text, text, uuid, jsonb, text) from public;
revoke all privileges on function pac.record_page_block_review(text, text, uuid, text, text, uuid, text) from public;
revoke all privileges on function pac.publish_page_block_draft(text, text, uuid, bigint, text) from public;
revoke all privileges on function pac.withdraw_page_block_publication(text, text, uuid, bigint, text) from public;
revoke all privileges on function pac.rollback_page_block_publication(text, text, uuid, uuid, bigint, text) from public;

grant execute on function pac.read_page_block_publication(text, text) to pac_app_runtime;
grant execute on function pac.read_page_block_editing_state(text, text) to pac_app_runtime;
grant execute on function pac.create_page_block_draft(text, text, uuid, jsonb, text) to pac_app_runtime;
grant execute on function pac.record_page_block_review(text, text, uuid, text, text, uuid, text) to pac_app_runtime;
grant execute on function pac.publish_page_block_draft(text, text, uuid, bigint, text) to pac_app_runtime;
grant execute on function pac.withdraw_page_block_publication(text, text, uuid, bigint, text) to pac_app_runtime;
grant execute on function pac.rollback_page_block_publication(text, text, uuid, uuid, bigint, text) to pac_app_runtime;

revoke all privileges on pac.source_carriers from pac_app_runtime;
revoke all privileges on pac.source_items from pac_app_runtime;
revoke all privileges on pac.content_items from pac_app_runtime;
revoke all privileges on pac.content_revisions from pac_app_runtime;
revoke all privileges on pac.revision_sources from pac_app_runtime;
revoke all privileges on pac.revision_assets from pac_app_runtime;
revoke all privileges on pac.review_records from pac_app_runtime;
revoke all privileges on pac.publication_decisions from pac_app_runtime;
revoke all privileges on pac.change_events from pac_app_runtime;

comment on function pac.read_page_block_publication(text, text) is
  'Fixed-path staff reader for the approved Home page and footer wording. It does not expose internal source or review records.';
comment on function pac.create_page_block_draft(text, text, uuid, jsonb, text) is
  'Owner boundary that appends page wording and pending reviews without changing staff publication.';
comment on function pac.publish_page_block_draft(text, text, uuid, bigint, text) is
  'Owner boundary that requires completed reviews, creates an immutable approved revision, and records a separate publication decision.';
comment on function pac.rollback_page_block_publication(text, text, uuid, uuid, bigint, text) is
  'Owner boundary that restores only a previously published, reviewed, approved page revision.';

commit;
