begin;

-- RG-3 forward publication for the reconciled Home page and footer. Migration
-- 0007 remains immutable historical evidence. This migration appends a new,
-- explicitly reviewed S1 release and repairs the page-copy lifecycle so an S2
-- default, unsafe source, or later withdrawal can never leak to staff.

create or replace function pac.page_block_revision_is_staff_exposable(
  requested_content_item_id text,
  requested_revision_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select exists (
    select 1
    from pac.content_items item
    join pac.content_revisions revision
      on revision.content_item_id = item.content_item_id
    where item.content_item_id = requested_content_item_id
      and revision.revision_id = requested_revision_id
      and requested_content_item_id = any(array['page-home', 'site-footer']::text[])
      and item.content_kind = 'internal'
      and item.default_scope_id = 'one-dhs'
      and item.restricted = true
      and item.retired_at is null
      and item.sensitivity_class = 'S1'
      and revision.sensitivity_class = 'S1'
      and revision.ordinary_indexing_allowed = true
      and revision.model_context_allowed = false
      and cardinality(revision.limitations) > 0
      and not exists (
        select 1 from unnest(revision.limitations) limitation(value)
        where nullif(btrim(limitation.value), '') is null
      )
      and revision.canonical_payload ->> 'id' = requested_content_item_id
      and revision.canonical_payload ->> 'status' = 'approved'
      and revision.canonical_payload ->> 'accessibility' = 'reviewed'
      and cardinality(revision.required_review_dimensions) > 0
      and not exists (
        select 1
        from unnest(revision.required_review_dimensions) required(dimension)
        left join lateral (
          select review.status
          from pac.review_records review
          where review.revision_id = revision.revision_id
            and review.dimension = required.dimension
          order by review.recorded_at desc, review.review_id desc
          limit 1
        ) current_review on true
        where current_review.status is null
          or current_review.status not in ('pass', 'not_applicable')
      )
      and exists (
        select 1 from pac.revision_sources source_link
        where source_link.revision_id = revision.revision_id
      )
      and not exists (
        select 1
        from pac.revision_sources source_link
        left join pac.source_items source
          on source.source_item_id = source_link.source_item_id
        left join pac.source_carriers carrier
          on carrier.carrier_id = source.carrier_id
        where source_link.revision_id = revision.revision_id
          and (
            source.source_item_id is null
            or source.carrier_id is null
            or carrier.carrier_id is null
            or carrier.sensitivity_class <> 'S1'
            or source.sensitivity_class <> 'S1'
            or source.deidentification_status not in ('not_needed', 'verified')
            or source.ordinary_indexing_allowed is distinct from true
            or source.model_context_allowed is distinct from false
            or source.owner_approval_status <> 'owner_approved_for_ingestion'
            or source.accounting_status <> 'accounted'
            or source.access_scope <> 'staff_candidate'
          )
      )
      and not exists (
        select 1
        from pac.revision_assets asset_link
        left join pac.assets asset on asset.asset_id = asset_link.asset_id
        where asset_link.revision_id = revision.revision_id
          and (
            asset.asset_id is null
            or asset.sensitivity_class not in ('S0', 'S1')
          )
      )
  );
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
    where scope_record.scope_id = requested_scope_id
      and scope_record.active = true
    union all
    select parent.scope_id, parent.parent_scope_id, child.distance + 1
    from pac.program_scopes parent
    join visible_scopes child on parent.scope_id = child.parent_scope_id
    where parent.active = true
      and parent.scope_id <> 'one-dhs-pac'
  ),
  latest_per_scope as (
    select decision.*,
      row_number() over (
        partition by decision.content_item_id, decision.scope_id
        order by decision.publication_decision_id desc
      ) as decision_rank
    from pac.publication_decisions decision
    join visible_scopes visible on visible.scope_id = decision.scope_id
    where decision.content_item_id = requested_content_item_id
  ),
  effective as (
    select decision.*,
      row_number() over (
        order by visible.distance asc, decision.publication_decision_id desc
      ) as scope_rank
    from latest_per_scope decision
    join visible_scopes visible on visible.scope_id = decision.scope_id
    where decision.decision_rank = 1
  )
  select item.content_item_id, revision.revision_id, revision.canonical_payload
  from effective decision
  join pac.content_items item
    on item.content_item_id = decision.content_item_id
  join pac.content_revisions revision
    on revision.revision_id = decision.revision_id
    and revision.content_item_id = decision.content_item_id
  where decision.scope_rank = 1
    and decision.decision = 'publish'
    and decision.sensitivity_class = 'S1'
    and decision.unauthenticated_exposure_permitted = true
    and nullif(btrim(decision.exposure_reason), '') is not null
    and pac.page_block_revision_is_staff_exposable(
      decision.content_item_id, decision.revision_id
    );
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
  latest_sensitivity_class text;
  latest_ordinary_indexing_allowed boolean;
  latest_model_context_allowed boolean;
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
    select 1
    from pac.content_items item
    where item.content_item_id = requested_content_item_id
      and item.default_scope_id = requested_scope_id
      and item.content_kind = 'internal'
      and item.restricted = true
      and item.retired_at is null
  ) then
    return null;
  end if;

  select revision.revision_id,
    revision.canonical_payload,
    revision.required_review_dimensions,
    revision.sensitivity_class,
    revision.ordinary_indexing_allowed,
    revision.model_context_allowed
  into latest_revision_id,
    latest_payload,
    latest_required_reviews,
    latest_sensitivity_class,
    latest_ordinary_indexing_allowed,
    latest_model_context_allowed
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id
    and (
      revision.canonical_payload ->> 'scope' = requested_payload_scope
      or (
        requested_scope_id = 'dsd'
        and revision.canonical_payload ->> 'scope' = 'agencywide'
      )
    )
  order by
    case when revision.canonical_payload ->> 'scope' = requested_payload_scope then 0 else 1 end,
    revision.revision_number desc,
    revision.revision_id desc
  limit 1;
  if latest_revision_id is null then
    return null;
  end if;

  select publication.revision_id into published_revision_id
  from pac.read_page_block_publication(
    requested_scope_id, requested_content_item_id
  ) publication;

  select decision.publication_decision_id into publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;

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
    and latest_sensitivity_class = 'S2'
    and latest_ordinary_indexing_allowed = false
    and latest_model_context_allowed = false
    and not exists (
      select 1
      from unnest(latest_required_reviews) required(dimension)
      left join lateral (
        select record.status
        from pac.review_records record
        where record.revision_id = latest_revision_id
          and record.dimension = required.dimension
        order by record.recorded_at desc, record.review_id desc
        limit 1
      ) review on true
      where review.status is null
        or review.status not in ('pass', 'not_applicable')
    );

  with recursive visible_scopes as (
    select scope_record.scope_id, scope_record.parent_scope_id
    from pac.program_scopes scope_record
    where scope_record.scope_id = requested_scope_id
      and scope_record.active = true
    union all
    select parent.scope_id, parent.parent_scope_id
    from pac.program_scopes parent
    join visible_scopes child on parent.scope_id = child.parent_scope_id
    where parent.active = true
      and parent.scope_id <> 'one-dhs-pac'
  ),
  published_revisions as (
    select decision.revision_id, max(decision.decided_at) as published_at
    from pac.publication_decisions decision
    join visible_scopes visible on visible.scope_id = decision.scope_id
    where decision.content_item_id = requested_content_item_id
      and decision.decision = 'publish'
      and decision.sensitivity_class = 'S1'
      and decision.unauthenticated_exposure_permitted = true
      and nullif(btrim(decision.exposure_reason), '') is not null
      and pac.page_block_revision_is_staff_exposable(
        decision.content_item_id, decision.revision_id
      )
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
        else
          'Version ' || revision.revision_number || ': '
          || (revision.canonical_payload #>> '{copy,identityKicker}')
      end,
      'publishedAt', published.published_at,
      'isCurrent', revision.revision_id = published_revision_id
    ) order by published.published_at desc), '[]'::jsonb)
  into history_summary
  from published_revisions published
  join pac.content_revisions revision
    on revision.revision_id = published.revision_id;

  return jsonb_build_object(
    'surface', requested_surface,
    'contentItemId', requested_content_item_id,
    'expectedRevisionId', latest_revision_id,
    'publishedRevisionId', published_revision_id,
    'publicationDecisionId', publication_decision_id::text,
    'isPublished', published_revision_id is not null,
    'hasUnpublishedChanges', published_revision_id is null
      or latest_revision_id <> published_revision_id,
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
  perform pac.assert_page_block_mutation_allowed(
    requested_scope_id, requested_content_item_id
  );
  perform pac.assert_valid_page_block_copy(
    requested_content_item_id, requested_copy
  );
  if requested_change_note is not null
    and length(btrim(requested_change_note)) > 1000 then
    raise exception 'The change note is too long' using errcode = '22023';
  end if;
  if requested_change_note is not null
    and length(btrim(requested_change_note)) > 0 then
    perform pac.assert_plain_page_text(requested_change_note);
  end if;

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.sensitivity_class = 'S1'
  for update;
  if not found then
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;

  current_state := pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
  if current_state is null then
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;
  latest_revision_id := (current_state ->> 'expectedRevisionId')::uuid;
  if latest_revision_id is distinct from expected_base_revision_id then
    raise exception 'Page wording changed after it was opened' using errcode = '40001';
  end if;

  select revision.canonical_payload into latest_payload
  from pac.content_revisions revision
  where revision.revision_id = latest_revision_id;
  if latest_payload -> 'copy' = requested_copy then
    raise exception 'No page wording changes were provided' using errcode = '22000';
  end if;

  select coalesce(max(revision.revision_number), 0) + 1
  into next_revision_number
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id;
  requested_surface := case
    when requested_content_item_id = 'page-home' then 'home'
    else 'footer'
  end;
  requested_payload_scope := case
    when requested_scope_id = 'dsd' then 'dsd'
    else 'agencywide'
  end;
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
    required_review_dimensions, created_by, based_on_revision_id,
    sensitivity_class, ordinary_indexing_allowed, model_context_allowed,
    limitations
  ) values (
    requested_content_item_id,
    next_revision_number,
    next_payload,
    coalesce(
      nullif(btrim(requested_change_note), ''),
      'Page wording updated in the consultant workspace.'
    ),
    array[
      'language_alignment', 'factual_currentness', 'accessibility',
      'scope', 'placement'
    ]::text[],
    'pac-consultant-workspace-owner',
    latest_revision_id,
    'S2',
    false,
    false,
    array[
      'Draft wording is protected review material and is not available to staff until a separate S1 publication decision.'
    ]::text[]
  ) returning revision_id into next_revision_id;

  insert into pac.revision_sources (
    revision_id, source_item_id, relationship, note
  )
  select next_revision_id, source.source_item_id, source.relationship, source.note
  from pac.revision_sources source
  where source.revision_id = latest_revision_id;

  insert into pac.revision_assets (
    revision_id, asset_id, purpose, staff_label, sort_order
  )
  select next_revision_id, asset.asset_id, asset.purpose,
    asset.staff_label, asset.sort_order
  from pac.revision_assets asset
  where asset.revision_id = latest_revision_id;

  insert into pac.review_records (
    revision_id, dimension, status, reviewer_role, findings
  )
  select next_revision_id,
    dimension,
    'pending',
    'program_steward',
    jsonb_build_object(
      'note', 'Review is required before this wording can be published.'
    )
  from unnest(array[
    'language_alignment', 'factual_currentness', 'accessibility',
    'scope', 'placement'
  ]::text[]) dimension;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'pac-consultant-workspace-owner',
    'owner',
    requested_scope_id,
    'page_block',
    requested_content_item_id,
    'draft_created',
    jsonb_build_object(
      'based_on_revision_id', latest_revision_id,
      'draft_revision_id', next_revision_id,
      'sensitivity_class', 'S2',
      'ordinary_indexing_allowed', false,
      'model_context_allowed', false,
      'staff_publication_unchanged', true
    )
  );
  return pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
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
  perform pac.assert_page_block_mutation_allowed(
    requested_scope_id, requested_content_item_id
  );
  if requested_status not in ('pass', 'revise', 'blocked', 'not_applicable') then
    raise exception 'Review result is not allowed' using errcode = '22023';
  end if;
  if requested_note is not null
    and length(btrim(requested_note)) > 1000 then
    raise exception 'The review note is too long' using errcode = '22023';
  end if;
  if requested_note is not null
    and length(btrim(requested_note)) > 0 then
    perform pac.assert_plain_page_text(requested_note);
  end if;

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.sensitivity_class = 'S1'
  for update;
  if not found then
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;

  current_state := pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
  if current_state is null
    or (current_state ->> 'expectedRevisionId')::uuid is distinct from requested_revision_id then
    raise exception 'Page wording changed after it was opened' using errcode = '40001';
  end if;

  select revision.required_review_dimensions into required_dimensions
  from pac.content_revisions revision
  where revision.revision_id = requested_revision_id
    and revision.content_item_id = requested_content_item_id
    and revision.canonical_payload ->> 'status' = 'under_review'
    and revision.sensitivity_class = 'S2'
    and revision.ordinary_indexing_allowed = false
    and revision.model_context_allowed = false;
  if not found then
    raise exception 'Only the current draft can be reviewed' using errcode = '55000';
  end if;
  if requested_dimension <> all(required_dimensions) then
    raise exception 'This review area is not required' using errcode = '22023';
  end if;

  select review.review_id into previous_review_id
  from pac.review_records review
  where review.revision_id = requested_revision_id
    and review.dimension = requested_dimension
  order by review.recorded_at desc, review.review_id desc
  limit 1;
  if previous_review_id is distinct from expected_previous_review_id then
    raise exception 'This review changed after it was opened' using errcode = '40001';
  end if;

  insert into pac.review_records (
    revision_id, dimension, status, reviewer_role, reviewer_id,
    findings, supersedes_review_id
  ) values (
    requested_revision_id,
    requested_dimension,
    requested_status,
    'program_steward',
    'pac-consultant-workspace-owner',
    jsonb_build_object('note', nullif(btrim(requested_note), '')),
    previous_review_id
  );

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'pac-consultant-workspace-owner',
    'owner',
    requested_scope_id,
    'page_block',
    requested_content_item_id,
    'review_recorded',
    jsonb_build_object(
      'revision_id', requested_revision_id,
      'dimension', requested_dimension,
      'status', requested_status
    )
  );
  return pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
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
  draft_revision pac.content_revisions%rowtype;
  release_revision_id uuid := gen_random_uuid();
  release_revision_number integer;
  release_payload jsonb;
  current_publication_decision_id bigint;
  release_carrier_id uuid;
  release_source_id text;
  release_source_payload jsonb;
  gate_reviews jsonb;
  new_publication_decision_id bigint;
begin
  perform pac.assert_page_block_mutation_allowed(
    requested_scope_id, requested_content_item_id
  );
  if requested_reason is null
    or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A brief publishing reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(requested_reason);

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
    and item.sensitivity_class = 'S1'
  for update;
  if not found then
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;

  select decision.publication_decision_id
  into current_publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_publication_decision_id is distinct from expected_publication_decision_id then
    raise exception 'The publication decision changed after it was opened' using errcode = '40001';
  end if;

  current_state := pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
  if current_state is null
    or (current_state ->> 'expectedRevisionId')::uuid is distinct from requested_revision_id then
    raise exception 'Page wording changed after it was opened' using errcode = '40001';
  end if;

  select revision.* into draft_revision
  from pac.content_revisions revision
  where revision.revision_id = requested_revision_id
    and revision.content_item_id = requested_content_item_id
    and revision.canonical_payload ->> 'status' = 'under_review'
    and revision.sensitivity_class = 'S2'
    and revision.ordinary_indexing_allowed = false
    and revision.model_context_allowed = false;
  if not found then
    raise exception 'Only a reviewed draft can be published' using errcode = '55000';
  end if;

  if exists (
    select 1
    from unnest(draft_revision.required_review_dimensions) required(dimension)
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
    raise exception 'Every required review must be complete before publishing' using errcode = '55000';
  end if;

  select coalesce(max(revision.revision_number), 0) + 1
  into release_revision_number
  from pac.content_revisions revision
  where revision.content_item_id = requested_content_item_id;
  release_payload := draft_revision.canonical_payload || jsonb_build_object(
    'status', 'approved',
    'accessibility', 'reviewed',
    'version', release_revision_number::text
  );
  release_source_id := 'page-copy-release-' || release_revision_id::text;
  release_source_payload := jsonb_build_object(
    'kind', 'reviewed_page_copy_release',
    'contentItemId', requested_content_item_id,
    'scopeId', requested_scope_id,
    'releaseRevisionId', release_revision_id,
    'copy', release_payload -> 'copy'
  );

  insert into pac.source_carriers (
    logical_key, media_type, original_name, byte_count, raw_blob_sha256,
    external_locator, captured_by, sensitivity_class
  ) values (
    'page-copy-release:' || release_revision_id::text,
    'application/json',
    requested_content_item_id || '-release.json',
    octet_length(convert_to(release_source_payload::text, 'UTF8')),
    encode(public.digest(convert_to(release_source_payload::text, 'UTF8'), 'sha256'), 'hex'),
    jsonb_build_object(
      'kind', 'governed_page_copy_release',
      'revisionId', release_revision_id
    ),
    'pac-consultant-workspace-owner',
    'S1'
  ) returning carrier_id into release_carrier_id;

  insert into pac.source_items (
    source_item_id, source_business_id, carrier_id, source_version,
    source_pointer, title, normalized_payload, normalized_item_sha256,
    hash_algorithm, hash_algorithm_version, owner_approval_status,
    accounting_status, access_scope, sensitivity_class,
    deidentification_status, ordinary_indexing_allowed,
    model_context_allowed
  ) values (
    release_source_id,
    release_source_id,
    release_carrier_id,
    '1',
    'release/' || release_revision_id::text,
    case
      when requested_content_item_id = 'page-home' then 'Reviewed Home page wording release'
      else 'Reviewed footer wording release'
    end,
    release_source_payload,
    encode(public.digest(convert_to(release_source_payload::text, 'UTF8'), 'sha256'), 'hex'),
    'sha256',
    '1',
    'owner_approved_for_ingestion',
    'accounted',
    'staff_candidate',
    'S1',
    'not_needed',
    true,
    false
  );

  insert into pac.content_revisions (
    revision_id, content_item_id, revision_number, canonical_payload,
    change_summary, required_review_dimensions, created_by,
    based_on_revision_id, sensitivity_class, ordinary_indexing_allowed,
    model_context_allowed, limitations
  ) values (
    release_revision_id,
    requested_content_item_id,
    release_revision_number,
    release_payload,
    'Reviewed page wording approved for staff.',
    draft_revision.required_review_dimensions,
    'pac-consultant-workspace-owner',
    requested_revision_id,
    'S1',
    true,
    false,
    array[
      'Approved for ordinary staff retrieval only; use as model context requires a separate item-level decision.'
    ]::text[]
  );

  insert into pac.revision_sources (
    revision_id, source_item_id, relationship, note
  ) values (
    release_revision_id,
    release_source_id,
    'primary',
    'Exact reviewed wording captured for this immutable staff release.'
  );

  insert into pac.revision_assets (
    revision_id, asset_id, purpose, staff_label, sort_order
  )
  select release_revision_id, asset.asset_id, asset.purpose,
    asset.staff_label, asset.sort_order
  from pac.revision_assets asset
  where asset.revision_id = requested_revision_id;

  insert into pac.review_records (
    revision_id, dimension, status, reviewer_role, reviewer_id, findings
  )
  select release_revision_id,
    required.dimension,
    current_review.status,
    'publishing_approver',
    'pac-consultant-workspace-owner',
    jsonb_build_object(
      'carried_forward_from_review_id', current_review.review_id,
      'reviewed_draft_revision_id', requested_revision_id,
      'release_validation', true
    )
  from unnest(draft_revision.required_review_dimensions) required(dimension)
  cross join lateral (
    select review.review_id, review.status
    from pac.review_records review
    where review.revision_id = requested_revision_id
      and review.dimension = required.dimension
    order by review.recorded_at desc, review.review_id desc
    limit 1
  ) current_review;

  if not pac.page_block_revision_is_staff_exposable(
    requested_content_item_id, release_revision_id
  ) then
    raise exception 'The reviewed wording did not pass the staff publication trust gate' using errcode = '55000';
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'dimension', review.dimension,
      'status', review.status
    ) order by array_position(
      draft_revision.required_review_dimensions, review.dimension
    )
  ) into gate_reviews
  from (
    select distinct on (record.dimension)
      record.dimension, record.status
    from pac.review_records record
    where record.revision_id = release_revision_id
    order by record.dimension, record.recorded_at desc, record.review_id desc
  ) review;

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision, gate_snapshot,
    decided_by, reason, sensitivity_class,
    unauthenticated_exposure_permitted, exposure_reason
  ) values (
    requested_content_item_id,
    release_revision_id,
    requested_scope_id,
    'publish',
    jsonb_build_object(
      'reviewed_draft_revision_id', requested_revision_id,
      'replaced_scope_decision_id', current_publication_decision_id,
      'required_reviews', coalesce(gate_reviews, '[]'::jsonb),
      'required_reviews_complete', true,
      'linked_source_item_id', release_source_id,
      'exact_release_copy_captured', true,
      'explicit_owner_decision', true,
      'staff_voice_checked', true,
      'plain_text_checked', true,
      'icons_checked', true,
      'accessibility_reviewed', true,
      'sensitivity_class', 'S1',
      'ordinary_indexing_allowed', true,
      'model_context_allowed', false,
      'unauthenticated_exposure_permitted', true,
      'exposure_reason_recorded', true,
      'trust_decision_source', 'governed_page_copy_release'
    ),
    'pac-consultant-workspace-owner',
    btrim(requested_reason),
    'S1',
    true,
    btrim(requested_reason)
  ) returning publication_decision_id into new_publication_decision_id;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'pac-consultant-workspace-owner',
    'owner',
    requested_scope_id,
    'page_block',
    requested_content_item_id,
    'published',
    jsonb_build_object(
      'reviewed_draft_revision_id', requested_revision_id,
      'release_revision_id', release_revision_id,
      'publication_decision_id', new_publication_decision_id,
      'sensitivity_class', 'S1',
      'ordinary_indexing_allowed', true,
      'model_context_allowed', false,
      'unauthenticated_exposure_permitted', true
    )
  );
  return pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
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
  perform pac.assert_page_block_mutation_allowed(
    requested_scope_id, requested_content_item_id
  );
  if requested_reason is null
    or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A brief withdrawal reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(requested_reason);

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
  for update;
  if not found then
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;

  select decision.publication_decision_id
  into current_publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_publication_decision_id is distinct from expected_publication_decision_id then
    raise exception 'The publication decision changed after it was opened' using errcode = '40001';
  end if;

  select publication.revision_id into current_revision_id
  from pac.read_page_block_publication(
    requested_scope_id, requested_content_item_id
  ) publication;
  if current_revision_id is null
    or current_revision_id is distinct from expected_published_revision_id then
    raise exception 'Published page wording changed after it was opened' using errcode = '40001';
  end if;

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision, gate_snapshot,
    decided_by, reason, sensitivity_class,
    unauthenticated_exposure_permitted, exposure_reason
  ) values (
    requested_content_item_id,
    current_revision_id,
    requested_scope_id,
    'withdraw',
    jsonb_build_object(
      'explicit_owner_decision', true,
      'replaced_scope_decision_id', current_publication_decision_id,
      'sensitivity_class', 'S1',
      'ordinary_indexing_allowed', false,
      'model_context_allowed', false,
      'unauthenticated_exposure_permitted', false,
      'exposure_reason_recorded', false
    ),
    'pac-consultant-workspace-owner',
    btrim(requested_reason),
    'S1',
    false,
    null
  );

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'pac-consultant-workspace-owner',
    'owner',
    requested_scope_id,
    'page_block',
    requested_content_item_id,
    'withdrawn',
    jsonb_build_object(
      'revision_id', current_revision_id,
      'unauthenticated_exposure_permitted', false
    )
  );
  return pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
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
  current_publication_decision_id bigint;
  previous_safe_publication_decision_id bigint;
begin
  perform pac.assert_page_block_mutation_allowed(
    requested_scope_id, requested_content_item_id
  );
  if requested_reason is null
    or length(btrim(requested_reason)) not between 1 and 500 then
    raise exception 'A brief restoration reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(requested_reason);

  perform 1
  from pac.content_items item
  where item.content_item_id = requested_content_item_id
  for update;
  if not found then
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;

  select decision.publication_decision_id
  into current_publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.scope_id = requested_scope_id
  order by decision.publication_decision_id desc
  limit 1;
  if current_publication_decision_id is distinct from expected_publication_decision_id then
    raise exception 'The publication decision changed after it was opened' using errcode = '40001';
  end if;

  select publication.revision_id into current_revision_id
  from pac.read_page_block_publication(
    requested_scope_id, requested_content_item_id
  ) publication;
  if current_revision_id is distinct from expected_published_revision_id then
    raise exception 'Published page wording changed after it was opened' using errcode = '40001';
  end if;
  if target_revision_id is not distinct from current_revision_id then
    raise exception 'The selected wording is already available to staff' using errcode = '22000';
  end if;

  select decision.publication_decision_id
  into previous_safe_publication_decision_id
  from pac.publication_decisions decision
  where decision.content_item_id = requested_content_item_id
    and decision.revision_id = target_revision_id
    and decision.scope_id = requested_scope_id
    and decision.decision = 'publish'
    and decision.sensitivity_class = 'S1'
    and decision.unauthenticated_exposure_permitted = true
    and nullif(btrim(decision.exposure_reason), '') is not null
  order by decision.publication_decision_id desc
  limit 1;
  if previous_safe_publication_decision_id is null
    or not pac.page_block_revision_is_staff_exposable(
      requested_content_item_id, target_revision_id
    ) then
    raise exception 'The selected reviewed wording cannot be restored' using errcode = '55000';
  end if;

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision, gate_snapshot,
    decided_by, reason, sensitivity_class,
    unauthenticated_exposure_permitted, exposure_reason
  ) values (
    requested_content_item_id,
    target_revision_id,
    requested_scope_id,
    'publish',
    jsonb_build_object(
      'explicit_owner_decision', true,
      'restored_approved_revision', true,
      'previous_safe_publication_decision_id', previous_safe_publication_decision_id,
      'replaced_scope_decision_id', current_publication_decision_id,
      'sensitivity_class', 'S1',
      'ordinary_indexing_allowed', true,
      'model_context_allowed', false,
      'unauthenticated_exposure_permitted', true,
      'exposure_reason_recorded', true,
      'trust_decision_source', 'governed_page_copy_rollback'
    ),
    'pac-consultant-workspace-owner',
    btrim(requested_reason),
    'S1',
    true,
    btrim(requested_reason)
  );

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'pac-consultant-workspace-owner',
    'owner',
    requested_scope_id,
    'page_block',
    requested_content_item_id,
    'approved_revision_restored',
    jsonb_build_object(
      'previous_revision_id', current_revision_id,
      'restored_revision_id', target_revision_id,
      'previous_safe_publication_decision_id', previous_safe_publication_decision_id
    )
  );
  return pac.read_page_block_editing_state(
    requested_scope_id, requested_content_item_id
  );
end;
$$;

do $$
declare
  release_id constant text := 'page-copy-reconciled-s1-2026-09-05';
  release_actor constant text := 'pac-home-footer-s1-migration';
  release_exposure_reason constant text := 'The reconciled Home page and footer are reviewed internal-purpose wording intentionally available to DHS staff at the staff-facing web address without sign-in.';
  home_copy jsonb := $home$
  {
    "heroKicker":"One DHS People, Access and Culture Program",
    "headlineLine1":"One DHS People,",
    "headlineLine2":"Access and Culture",
    "headlineLine3":"Program",
    "heroLede":"Practical support for workplace culture and equitable workforce, policy, program, and service decisions.",
    "heroNote":"Bring the work in front of you. Ask a question, find reviewed guidance, practice with a useful work product, or identify the right person to involve. Ordinary learning and practice are voluntary. Notes you choose to save stay in the web browser you are using.",
    "heroImageAlt":"Colleagues in conversation around a table with papers and a laptop.",
    "primaryActionLabel":"Start with your work",
    "primaryActionHref":"/start",
    "secondaryActionLabel":"Ask a question",
    "secondaryActionHref":"/ask",
    "aboutLabel":"What this program is.",
    "aboutText":"This is an independently managed, internal-purpose resource for DHS staff. It is not connected to DHS information technology, case, or personnel systems. Its guidance supports knowledge work and does not replace policy, legal advice, formal processes, or decisions made by responsible DHS offices. Authority labels show what each item can and cannot establish.",
    "guidedKicker":"Areas of work",
    "guidedTitle":"What are you responsible for today?",
    "guidedIntro":"Choose the area closest to your work. Each area connects learning, practical questions, reviewed material, a useful work product, and the people who hold the relevant responsibility.",
    "guidedFallbackLabel":"Not sure where your work fits?",
    "guidedFallbackNote":"Answer three short questions about your role, task, and timing. Start will suggest a useful route and explain why.",
    "helpKicker":"Choose a way to work",
    "helpTitle":"Ask, Minnesota Communities, Library, or Support",
    "askLabel":"Ask",
    "askHref":"/ask",
    "askDescription":"Ask a work question and get a clear answer with its sources, scope, and limits. No meeting is needed.",
    "communitiesLabel":"Minnesota Communities",
    "communitiesHref":"/minnesota-communities",
    "communitiesDescription":"Prepare for Minnesota work with questions about access, engagement, who to involve, and what not to assume. Community information is never a label for a person.",
    "resourcesLabel":"Library",
    "resourcesHref":"/library",
    "resourcesDescription":"Search reviewed checklists, job aids, question banks, learning materials, and source notes. Each item shows where it came from, who reviewed it, and its limits.",
    "supportLabel":"Support",
    "supportHref":"/support",
    "supportAvailableDescription":"Find the responsible DHS person or office. Eligible DSD work can also request direct consultation.",
    "supportPreviewDescription":"Find the responsible DHS person or office, and review how direct consultation works for eligible DSD work.",
    "goalsKicker":"Keep moving",
    "goalsTitle":"Explore, learn, practice, and see One DSD",
    "foundationLabel":"Areas of work: enter through a decision or responsibility",
    "foundationHref":"/areas",
    "learnLabel":"Learn: move through six stages at your own pace",
    "learnHref":"/learn",
    "applyLabel":"Practice: build a useful work product",
    "applyHref":"/practice",
    "leadLabel":"One DSD: explore the divisional reference program",
    "leadHref":"/one-dsd",
    "commitmentsKicker":"Core commitments",
    "commitmentsTitle":"Six commitments behind every decision",
    "commitmentsLinkLabel":"Learn how the program works",
    "commitmentsLinkHref":"/about",
    "privacyLabel":"Protect your privacy.",
    "privacyText":"Please do not enter case, medical, personnel, complaint, or identifying details anywhere in this program. Guidance shows its sources, scope, and limits. It does not replace official policy, legal advice, Human Resources, civil-rights processes, Tribal consultation, or another responsible office."
  }
  $home$::jsonb;
  footer_copy jsonb := $footer$
  {
    "identityKicker":"One DHS People, Access and Culture Program",
    "identityText":"This independently managed, internal-purpose resource is built for DHS staff. It is not connected to DHS information technology, case, or personnel systems. Its guidance supports knowledge work and does not replace policy, legal advice, formal processes, or decisions made by responsible DHS offices. Authority labels show what each item can and cannot establish.",
    "helpHeading":"Find your next step",
    "askLabel":"Ask a question",
    "askHref":"/ask",
    "resourcesLabel":"Library",
    "resourcesHref":"/library",
    "communitiesLabel":"Minnesota Communities",
    "communitiesHref":"/minnesota-communities",
    "requestAvailableLabel":"Support and DSD consultation",
    "requestPreviewLabel":"Support and DSD consultation guidance",
    "requestHref":"/support",
    "trackLabel":"Check a DSD consultation request",
    "trackHref":"/support/track",
    "escalationLabel":"Find the right person or office",
    "escalationHref":"/support/right-person",
    "privacyHeading":"Privacy and access",
    "privacyText":"Please do not enter case, medical, personnel, complaint, or identifying details anywhere in this program. Working notes stay in the web browser you are using, where another person using the same browser may be able to see them. If any part of the program is difficult to use with assistive technology, Support explains how to report the barrier."
  }
  $footer$::jsonb;
  release_rows integer;
  release_items integer;
  release_item_ids text[];
  partial_rows integer;
  block_record record;
  release_carrier_id uuid;
  release_source_payload jsonb;
  release_revision_id uuid;
  historical_revision_id uuid;
  release_revision_number integer;
  release_payload jsonb;
  required_dimension text;
begin
  perform pg_advisory_xact_lock(hashtextextended(release_id, 0));
  perform pac.assert_valid_page_block_copy('page-home', home_copy);
  perform pac.assert_valid_page_block_copy('site-footer', footer_copy);

  -- Serialize migration replay with the owner lifecycle, which locks the same
  -- rows. The stable ordering avoids cross-surface lock inversion.
  perform item.content_item_id
  from pac.content_items item
  where item.content_item_id in ('page-home', 'site-footer')
  order by item.content_item_id
  for update;
  if (
    select count(*)
    from pac.content_items item
    where item.content_item_id in ('page-home', 'site-footer')
  ) <> 2 then
    raise exception 'The governed Home and footer content items are missing';
  end if;

  select count(*),
    count(distinct decision.content_item_id),
    array_agg(distinct decision.content_item_id order by decision.content_item_id)
  into release_rows, release_items, release_item_ids
  from pac.publication_decisions decision
  where decision.gate_snapshot ->> 'release_id' = release_id;

  if release_rows <> 0 then
    if release_rows <> 2
      or release_items <> 2
      or release_item_ids is distinct from array['page-home', 'site-footer']::text[]
      or exists (
        select 1
        from (values
          (
            'page-home'::text,
            'home'::text,
            'Home page wording'::text,
            'app/page.tsx'::text,
            'built-in:app/page.tsx@reconciled-2026-09-05'::text,
            'built-in-home-copy-reconciled-2026-09-05'::text,
            'built-in-home-copy'::text,
            home_copy
          ),
          (
            'site-footer'::text,
            'footer'::text,
            'Page footer wording'::text,
            'components/site-footer.tsx'::text,
            'built-in:components/site-footer.tsx@reconciled-2026-09-05'::text,
            'built-in-footer-copy-reconciled-2026-09-05'::text,
            'built-in-footer-copy'::text,
            footer_copy
          )
        ) expected(
          content_item_id, surface, staff_label, source_path,
          carrier_logical_key, source_item_id, source_business_id, copy
        )
        where not exists (
          select 1
          from pac.publication_decisions decision
          join pac.content_revisions revision
            on revision.revision_id = decision.revision_id
            and revision.content_item_id = decision.content_item_id
          join pac.revision_sources source_link
            on source_link.revision_id = revision.revision_id
          join pac.source_items source
            on source.source_item_id = source_link.source_item_id
          join pac.source_carriers carrier
            on carrier.carrier_id = source.carrier_id
          where decision.gate_snapshot ->> 'release_id' = release_id
            and decision.content_item_id = expected.content_item_id
            and decision.scope_id = 'one-dhs'
            and decision.decision = 'publish'
            and decision.decided_by = release_actor
            and decision.reason = 'Publish the reconciled Home and footer wording for the RG-3 staff experience.'
            and decision.sensitivity_class = 'S1'
            and decision.unauthenticated_exposure_permitted = true
            and decision.exposure_reason = release_exposure_reason
            and decision.gate_snapshot = jsonb_build_object(
              'release_id', release_id,
              'surface', expected.surface,
              'required_reviews_complete', true,
              'required_reviews', jsonb_build_array(
                jsonb_build_object('dimension', 'language_alignment', 'status', 'pass'),
                jsonb_build_object('dimension', 'factual_currentness', 'status', 'pass'),
                jsonb_build_object('dimension', 'accessibility', 'status', 'pass'),
                jsonb_build_object('dimension', 'scope', 'status', 'pass'),
                jsonb_build_object('dimension', 'placement', 'status', 'pass')
              ),
              'linked_source_item_id', expected.source_item_id,
              'exact_release_copy_captured', true,
              'explicit_owner_decision', true,
              'staff_voice_checked', true,
              'plain_text_checked', true,
              'icons_checked', true,
              'accessibility_reviewed', true,
              'sensitivity_class', 'S1',
              'ordinary_indexing_allowed', true,
              'model_context_allowed', false,
              'unauthenticated_exposure_permitted', true,
              'exposure_reason_recorded', true,
              'trust_decision_source', 'governed_page_copy_release'
            )
            and revision.revision_number = 2
            and revision.canonical_payload = jsonb_build_object(
              'id', expected.content_item_id,
              'blockType', expected.surface,
              'status', 'approved',
              'accessibility', 'reviewed',
              'scope', 'agencywide',
              'version', '2',
              'copy', expected.copy
            )
            and revision.created_by = release_actor
            and revision.sensitivity_class = 'S1'
            and revision.ordinary_indexing_allowed = true
            and revision.model_context_allowed = false
            and revision.limitations = array[
              'Approved for ordinary staff retrieval only; use as model context requires a separate item-level decision.'
            ]::text[]
            and revision.required_review_dimensions = array[
              'language_alignment', 'factual_currentness', 'accessibility',
              'scope', 'placement'
            ]::text[]
            and revision.based_on_revision_id = (
              select historical.revision_id
              from pac.publication_decisions historical
              where historical.content_item_id = expected.content_item_id
                and historical.gate_snapshot ->> 'seeded_current_approved_wording' = 'true'
              order by historical.publication_decision_id asc
              limit 1
            )
            and source_link.relationship = 'primary'
            and source_link.note = 'Exact reconciled built-in wording captured for this immutable release.'
            and source.source_item_id = expected.source_item_id
            and source.source_business_id = expected.source_business_id
            and source.source_version = '2026-09-05-reconciled'
            and source.source_pointer = expected.source_path
            and source.title = expected.staff_label || ' reconciled release source'
            and source.normalized_payload = jsonb_build_object(
              'kind', 'built_in_program_copy',
              'path', expected.source_path,
              'surface', expected.surface,
              'releaseId', release_id,
              'purpose', 'Reconciled wording approved for ordinary staff retrieval; not approved for model context.',
              'copy', expected.copy
            )
            and source.normalized_item_sha256 = encode(public.digest(convert_to(
              jsonb_build_object(
                'kind', 'built_in_program_copy',
                'path', expected.source_path,
                'surface', expected.surface,
                'releaseId', release_id,
                'purpose', 'Reconciled wording approved for ordinary staff retrieval; not approved for model context.',
                'copy', expected.copy
              )::text,
              'UTF8'
            ), 'sha256'), 'hex')
            and source.hash_algorithm = 'sha256'
            and source.hash_algorithm_version = '1'
            and source.owner_approval_status = 'owner_approved_for_ingestion'
            and source.accounting_status = 'accounted'
            and source.access_scope = 'staff_candidate'
            and source.sensitivity_class = 'S1'
            and source.deidentification_status = 'not_needed'
            and source.ordinary_indexing_allowed = true
            and source.model_context_allowed = false
            and carrier.logical_key = expected.carrier_logical_key
            and carrier.media_type = 'application/json'
            and carrier.original_name = expected.source_path
            and carrier.byte_count = octet_length(convert_to(
              source.normalized_payload::text, 'UTF8'
            ))
            and carrier.raw_blob_sha256 = source.normalized_item_sha256
            and carrier.external_locator = jsonb_build_object(
              'kind', 'built_in_program_copy',
              'path', expected.source_path,
              'releaseId', release_id
            )
            and carrier.captured_by = release_actor
            and carrier.sensitivity_class = 'S1'
            and (
              select count(*)
              from pac.revision_sources exact_links
              where exact_links.revision_id = revision.revision_id
            ) = 1
            and (
              select count(*)
              from pac.review_records exact_reviews
              where exact_reviews.revision_id = revision.revision_id
            ) = 5
            and (
              select count(*)
              from pac.review_records exact_reviews
              where exact_reviews.revision_id = revision.revision_id
                and exact_reviews.status = 'pass'
                and exact_reviews.dimension = any(array[
                  'language_alignment', 'factual_currentness', 'accessibility',
                  'scope', 'placement'
                ]::text[])
                and exact_reviews.reviewer_role = 'publishing_approver'
                and exact_reviews.reviewer_id = release_actor
                and exact_reviews.findings ->> 'release_id' = release_id
            ) = 5
            and (
              select count(distinct exact_reviews.dimension)
              from pac.review_records exact_reviews
              where exact_reviews.revision_id = revision.revision_id
                and exact_reviews.dimension = any(array[
                  'language_alignment', 'factual_currentness', 'accessibility',
                  'scope', 'placement'
                ]::text[])
            ) = 5
            and pac.page_block_revision_is_staff_exposable(
              decision.content_item_id, decision.revision_id
            )
        )
      )
    then
      raise exception 'The reconciled Home and footer release does not match its governed two-block boundary';
    end if;
    return;
  end if;

  -- A first application may advance only the exact 0007 baseline. Any draft,
  -- prior owner decision, or other unexpected history requires deliberate
  -- reconciliation instead of being silently buried by this migration.
  if exists (
    select 1
    from (values
      (
        'page-home'::text,
        'Home page wording'::text,
        'home'::text,
        'app/page.tsx'::text,
        'built-in:app/page.tsx'::text,
        'built-in-home-copy-2026-09-05'::text,
        'built-in-home-copy'::text,
        '891abcf3e52160bd6661d8649acd61514c5745fe0296760ddbd81f82c5fb31b2'::text,
        '8a57dbcb88c2e6a20596398c82bc2f5ffc1604cd6011e9e59ab209d2d9f60c34'::text
      ),
      (
        'site-footer'::text,
        'Page footer wording'::text,
        'footer'::text,
        'components/site-footer.tsx'::text,
        'built-in:components/site-footer.tsx'::text,
        'built-in-footer-copy-2026-09-05'::text,
        'built-in-footer-copy'::text,
        '9c1d5155684f88457df27cd352ff95a19e1a96fde6b3793f9a633611551aaf8b'::text,
        'ca2d20e695ff5e2cca7a0ba5ee22379999552efc700c9ecca1ec14b29334549c'::text
      )
    ) expected(
      content_item_id, staff_label, surface, source_path,
      carrier_logical_key, historical_source_item_id, source_business_id,
      revision_payload_sha256, source_payload_sha256
    )
    where (
      select count(*)
      from pac.content_revisions revision
      where revision.content_item_id = expected.content_item_id
    ) <> 1
      or (
        select count(*)
        from pac.publication_decisions decision
        where decision.content_item_id = expected.content_item_id
      ) <> 1
      or not exists (
        select 1
        from pac.content_items item
        join pac.publication_decisions decision
          on decision.content_item_id = item.content_item_id
        join pac.content_revisions revision
          on revision.revision_id = decision.revision_id
          and revision.content_item_id = decision.content_item_id
        join pac.revision_sources source_link
          on source_link.revision_id = revision.revision_id
        join pac.source_items source
          on source.source_item_id = source_link.source_item_id
        join pac.source_carriers carrier
          on carrier.carrier_id = source.carrier_id
        where item.content_item_id = expected.content_item_id
          and item.content_kind = 'internal'
          and item.default_scope_id = 'one-dhs'
          and item.staff_label = expected.staff_label
          and item.restricted = true
          and item.retired_at is null
          and item.sensitivity_class = 'S2'
          and item.created_by = 'pac-home-footer-content-migration'
          and decision.scope_id = 'one-dhs'
          and decision.decision = 'publish'
          and decision.gate_snapshot = jsonb_build_object(
            'seeded_current_approved_wording', true,
            'required_reviews_complete', true
          )
          and decision.decided_by = 'pac-home-footer-content-migration'
          and decision.reason = 'Current approved wording retained for staff.'
          and decision.sensitivity_class = 'S2'
          and decision.unauthenticated_exposure_permitted = false
          and decision.exposure_reason is null
          and revision.revision_number = 1
          and revision.payload_sha256 = expected.revision_payload_sha256
          and revision.canonical_payload ->> 'status' = 'approved'
          and revision.canonical_payload ->> 'accessibility' = 'reviewed'
          and revision.canonical_payload ->> 'id' = expected.content_item_id
          and revision.canonical_payload ->> 'blockType' = expected.surface
          and revision.canonical_payload ->> 'scope' = 'agencywide'
          and revision.canonical_payload ->> 'version' = '1'
          and revision.change_summary = 'Current approved wording captured for governed inline editing.'
          and revision.required_review_dimensions = array[
            'language_alignment', 'factual_currentness', 'accessibility',
            'scope', 'placement'
          ]::text[]
          and revision.created_by = 'pac-home-footer-content-migration'
          and revision.based_on_revision_id is null
          and revision.sensitivity_class = 'S2'
          and revision.ordinary_indexing_allowed = false
          and revision.model_context_allowed = false
          and revision.limitations = '{}'::text[]
          and source_link.relationship = 'primary'
          and source_link.note = 'Accounted built-in wording captured from the application.'
          and source.source_item_id = expected.historical_source_item_id
          and source.source_business_id = expected.source_business_id
          and source.source_version = '1'
          and source.source_pointer = expected.source_path
          and source.title = expected.staff_label
          and source.normalized_payload = jsonb_build_object(
            'kind', 'built_in_program_copy',
            'path', expected.source_path,
            'surface', expected.surface,
            'purpose', 'Approved wording captured before program-wide inline editing.'
          )
          and source.normalized_item_sha256 = expected.source_payload_sha256
          and source.hash_algorithm = 'sha256'
          and source.hash_algorithm_version = '1'
          and source.owner_approval_status = 'owner_approved_for_ingestion'
          and source.accounting_status = 'accounted'
          and source.access_scope = 'internal_source'
          and source.sensitivity_class = 'S2'
          and source.deidentification_status = 'not_reviewed'
          and source.ordinary_indexing_allowed = false
          and source.model_context_allowed = false
          and carrier.logical_key = expected.carrier_logical_key
          and carrier.media_type = 'application/json'
          and carrier.original_name = expected.source_path
          and carrier.byte_count = octet_length(convert_to(
            source.normalized_payload::text, 'UTF8'
          ))
          and carrier.raw_blob_sha256 = expected.source_payload_sha256
          and carrier.external_locator = jsonb_build_object(
            'kind', 'built_in_program_copy',
            'path', expected.source_path
          )
          and carrier.captured_by = 'pac-home-footer-content-migration'
          and carrier.sensitivity_class = 'S2'
          and (
            select count(*)
            from pac.revision_sources historical_links
            where historical_links.revision_id = revision.revision_id
          ) = 1
          and (
            select count(*)
            from pac.review_records historical_reviews
            where historical_reviews.revision_id = revision.revision_id
          ) = 5
          and (
            select count(*)
            from pac.review_records historical_reviews
            where historical_reviews.revision_id = revision.revision_id
              and historical_reviews.status = 'pass'
              and historical_reviews.dimension = any(array[
                'language_alignment', 'factual_currentness', 'accessibility',
                'scope', 'placement'
              ]::text[])
              and historical_reviews.reviewer_role = 'program_steward'
              and historical_reviews.reviewer_id = 'pac-home-footer-content-migration'
              and historical_reviews.findings = jsonb_build_object(
                'note', 'Current approved wording retained without alteration.'
              )
          ) = 5
          and (
            select count(distinct historical_reviews.dimension)
            from pac.review_records historical_reviews
            where historical_reviews.revision_id = revision.revision_id
              and historical_reviews.dimension = any(array[
                'language_alignment', 'factual_currentness', 'accessibility',
                'scope', 'placement'
              ]::text[])
          ) = 5
          and not exists (
            select 1
            from pac.revision_assets historical_assets
            where historical_assets.revision_id = revision.revision_id
          )
      )
  ) then
    raise exception 'Unexpected Home or footer history must be reconciled before the trusted release can be applied';
  end if;

  select count(*) into partial_rows
  from (
    select source.source_item_id
    from pac.source_items source
    where source.source_item_id in (
      'built-in-home-copy-reconciled-2026-09-05',
      'built-in-footer-copy-reconciled-2026-09-05'
    )
    union all
    select carrier.logical_key
    from pac.source_carriers carrier
    where carrier.logical_key in (
      'built-in:app/page.tsx@reconciled-2026-09-05',
      'built-in:components/site-footer.tsx@reconciled-2026-09-05'
    )
  ) partial;
  if partial_rows <> 0 then
    raise exception 'A partial reconciled Home and footer release already exists';
  end if;

  for block_record in
    select * from (values
      (
        'page-home'::text,
        'home'::text,
        'Home page wording'::text,
        'app/page.tsx'::text,
        'built-in:app/page.tsx@reconciled-2026-09-05'::text,
        'built-in-home-copy-reconciled-2026-09-05'::text,
        'built-in-home-copy'::text,
        home_copy
      ),
      (
        'site-footer'::text,
        'footer'::text,
        'Page footer wording'::text,
        'components/site-footer.tsx'::text,
        'built-in:components/site-footer.tsx@reconciled-2026-09-05'::text,
        'built-in-footer-copy-reconciled-2026-09-05'::text,
        'built-in-footer-copy'::text,
        footer_copy
      )
    ) block_values(
      content_item_id, surface, staff_label, source_path,
      carrier_logical_key, source_item_id, source_business_id, copy
    )
  loop
    if not exists (
      select 1
      from pac.content_items item
      where item.content_item_id = block_record.content_item_id
        and item.content_kind = 'internal'
        and item.default_scope_id = 'one-dhs'
        and item.staff_label = block_record.staff_label
        and item.restricted = true
        and item.retired_at is null
        and item.sensitivity_class in ('S1', 'S2')
    ) then
      raise exception 'Existing page block has incompatible content settings';
    end if;

    select revision.revision_id into historical_revision_id
    from pac.content_revisions revision
    where revision.content_item_id = block_record.content_item_id
    order by revision.revision_number desc, revision.revision_id desc
    limit 1;
    if historical_revision_id is null then
      raise exception 'The historical page block revision is missing';
    end if;

    update pac.content_items item
    set sensitivity_class = 'S1'
    where item.content_item_id = block_record.content_item_id
      and item.sensitivity_class = 'S2';

    release_revision_id := gen_random_uuid();
    release_source_payload := jsonb_build_object(
      'kind', 'built_in_program_copy',
      'path', block_record.source_path,
      'surface', block_record.surface,
      'releaseId', release_id,
      'purpose', 'Reconciled wording approved for ordinary staff retrieval; not approved for model context.',
      'copy', block_record.copy
    );

    insert into pac.source_carriers (
      logical_key, media_type, original_name, byte_count, raw_blob_sha256,
      external_locator, captured_by, sensitivity_class
    ) values (
      block_record.carrier_logical_key,
      'application/json',
      block_record.source_path,
      octet_length(convert_to(release_source_payload::text, 'UTF8')),
      encode(public.digest(convert_to(release_source_payload::text, 'UTF8'), 'sha256'), 'hex'),
      jsonb_build_object(
        'kind', 'built_in_program_copy',
        'path', block_record.source_path,
        'releaseId', release_id
      ),
      release_actor,
      'S1'
    ) returning carrier_id into release_carrier_id;

    insert into pac.source_items (
      source_item_id, source_business_id, carrier_id, source_version,
      source_pointer, title, normalized_payload, normalized_item_sha256,
      hash_algorithm, hash_algorithm_version, owner_approval_status,
      accounting_status, access_scope, sensitivity_class,
      deidentification_status, ordinary_indexing_allowed,
      model_context_allowed
    ) values (
      block_record.source_item_id,
      block_record.source_business_id,
      release_carrier_id,
      '2026-09-05-reconciled',
      block_record.source_path,
      block_record.staff_label || ' reconciled release source',
      release_source_payload,
      encode(public.digest(convert_to(release_source_payload::text, 'UTF8'), 'sha256'), 'hex'),
      'sha256',
      '1',
      'owner_approved_for_ingestion',
      'accounted',
      'staff_candidate',
      'S1',
      'not_needed',
      true,
      false
    );

    select coalesce(max(revision.revision_number), 0) + 1
    into release_revision_number
    from pac.content_revisions revision
    where revision.content_item_id = block_record.content_item_id;
    release_payload := jsonb_build_object(
      'id', block_record.content_item_id,
      'blockType', block_record.surface,
      'status', 'approved',
      'accessibility', 'reviewed',
      'scope', 'agencywide',
      'version', release_revision_number::text,
      'copy', block_record.copy
    );

    insert into pac.content_revisions (
      revision_id, content_item_id, revision_number, canonical_payload,
      change_summary, required_review_dimensions, created_by,
      based_on_revision_id, sensitivity_class, ordinary_indexing_allowed,
      model_context_allowed, limitations
    ) values (
      release_revision_id,
      block_record.content_item_id,
      release_revision_number,
      release_payload,
      'Reconciled RG-3 staff wording published through a forward S1 release.',
      array[
        'language_alignment', 'factual_currentness', 'accessibility',
        'scope', 'placement'
      ]::text[],
      release_actor,
      historical_revision_id,
      'S1',
      true,
      false,
      array[
        'Approved for ordinary staff retrieval only; use as model context requires a separate item-level decision.'
      ]::text[]
    );

    insert into pac.revision_sources (
      revision_id, source_item_id, relationship, note
    ) values (
      release_revision_id,
      block_record.source_item_id,
      'primary',
      'Exact reconciled built-in wording captured for this immutable release.'
    );

    foreach required_dimension in array array[
      'language_alignment', 'factual_currentness', 'accessibility',
      'scope', 'placement'
    ]::text[] loop
      insert into pac.review_records (
        revision_id, dimension, status, reviewer_role, reviewer_id, findings
      ) values (
        release_revision_id,
        required_dimension,
        'pass',
        'publishing_approver',
        release_actor,
        jsonb_build_object(
          'note', 'Reconciled owner-approved wording verified for the RG-3 staff release.',
          'release_id', release_id
        )
      );
    end loop;

    if not pac.page_block_revision_is_staff_exposable(
      block_record.content_item_id, release_revision_id
    ) then
      raise exception 'The reconciled page block did not pass the staff publication trust gate';
    end if;

    insert into pac.publication_decisions (
      content_item_id, revision_id, scope_id, decision, gate_snapshot,
      decided_by, reason, sensitivity_class,
      unauthenticated_exposure_permitted, exposure_reason
    ) values (
      block_record.content_item_id,
      release_revision_id,
      'one-dhs',
      'publish',
      jsonb_build_object(
        'release_id', release_id,
        'surface', block_record.surface,
        'required_reviews_complete', true,
        'required_reviews', jsonb_build_array(
          jsonb_build_object('dimension', 'language_alignment', 'status', 'pass'),
          jsonb_build_object('dimension', 'factual_currentness', 'status', 'pass'),
          jsonb_build_object('dimension', 'accessibility', 'status', 'pass'),
          jsonb_build_object('dimension', 'scope', 'status', 'pass'),
          jsonb_build_object('dimension', 'placement', 'status', 'pass')
        ),
        'linked_source_item_id', block_record.source_item_id,
        'exact_release_copy_captured', true,
        'explicit_owner_decision', true,
        'staff_voice_checked', true,
        'plain_text_checked', true,
        'icons_checked', true,
        'accessibility_reviewed', true,
        'sensitivity_class', 'S1',
        'ordinary_indexing_allowed', true,
        'model_context_allowed', false,
        'unauthenticated_exposure_permitted', true,
        'exposure_reason_recorded', true,
        'trust_decision_source', 'governed_page_copy_release'
      ),
      release_actor,
      'Publish the reconciled Home and footer wording for the RG-3 staff experience.',
      'S1',
      true,
      release_exposure_reason
    );
  end loop;

  select count(*) into release_rows
  from pac.publication_decisions decision
  where decision.gate_snapshot ->> 'release_id' = release_id;
  if release_rows <> 2 then
    raise exception 'The reconciled Home and footer release did not complete atomically';
  end if;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    release_actor,
    'owner',
    'one-dhs',
    'page_copy_release',
    release_id,
    'trusted_staff_release_published',
    jsonb_build_object(
      'content_item_ids', array['page-home', 'site-footer']::text[],
      'sensitivity_class', 'S1',
      'ordinary_indexing_allowed', true,
      'model_context_allowed', false,
      'unauthenticated_exposure_permitted', true,
      'historical_release_preserved', true
    )
  );
end;
$$;

revoke all privileges on function pac.page_block_revision_is_staff_exposable(text, uuid)
  from public, pac_app_runtime;
revoke all privileges on function pac.read_page_block_publication(text, text)
  from public;
revoke all privileges on function pac.read_page_block_editing_state(text, text)
  from public;
revoke all privileges on function pac.create_page_block_draft(text, text, uuid, jsonb, text)
  from public;
revoke all privileges on function pac.record_page_block_review(text, text, uuid, text, text, uuid, text)
  from public;
revoke all privileges on function pac.publish_page_block_draft(text, text, uuid, bigint, text)
  from public;
revoke all privileges on function pac.withdraw_page_block_publication(text, text, uuid, bigint, text)
  from public;
revoke all privileges on function pac.rollback_page_block_publication(text, text, uuid, uuid, bigint, text)
  from public;

grant execute on function pac.read_page_block_publication(text, text)
  to pac_app_runtime;
grant execute on function pac.read_page_block_editing_state(text, text)
  to pac_app_runtime;
grant execute on function pac.create_page_block_draft(text, text, uuid, jsonb, text)
  to pac_app_runtime;
grant execute on function pac.record_page_block_review(text, text, uuid, text, text, uuid, text)
  to pac_app_runtime;
grant execute on function pac.publish_page_block_draft(text, text, uuid, bigint, text)
  to pac_app_runtime;
grant execute on function pac.withdraw_page_block_publication(text, text, uuid, bigint, text)
  to pac_app_runtime;
grant execute on function pac.rollback_page_block_publication(text, text, uuid, uuid, bigint, text)
  to pac_app_runtime;

revoke all privileges on pac.source_carriers from pac_app_runtime;
revoke all privileges on pac.source_items from pac_app_runtime;
revoke all privileges on pac.content_items from pac_app_runtime;
revoke all privileges on pac.content_revisions from pac_app_runtime;
revoke all privileges on pac.revision_sources from pac_app_runtime;
revoke all privileges on pac.revision_assets from pac_app_runtime;
revoke all privileges on pac.review_records from pac_app_runtime;
revoke all privileges on pac.publication_decisions from pac_app_runtime;
revoke all privileges on pac.change_events from pac_app_runtime;

comment on function pac.page_block_revision_is_staff_exposable(text, uuid) is
  'Private fail-closed trust predicate for an S1 Home or footer revision. It is not executable by the runtime role.';
comment on function pac.read_page_block_publication(text, text) is
  'Fixed-path staff reader that honors the nearest latest scope decision and returns only an explicitly exposed S1 Home or footer release.';
comment on function pac.create_page_block_draft(text, text, uuid, jsonb, text) is
  'Owner boundary that appends an S2 page-copy draft and pending reviews without changing staff publication.';
comment on function pac.publish_page_block_draft(text, text, uuid, bigint, text) is
  'Owner boundary that captures exact reviewed copy in a new S1 source and revision before an explicit staff exposure decision.';
comment on function pac.rollback_page_block_publication(text, text, uuid, uuid, bigint, text) is
  'Owner boundary that restores only a previously exposed S1 page revision; historical S2 revisions are ineligible.';

commit;
