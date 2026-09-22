begin;

-- A staff-facing release is an explicit data-trust decision. The release API may
-- never rely on the S2/false defaults added by migration 0009.
create or replace function pac.assert_explicit_resource_staff_exposure(
  requested_sensitivity_class text,
  requested_unauthenticated_exposure_permitted boolean,
  requested_exposure_reason text
)
returns void
language plpgsql
set search_path = pg_catalog, pac
as $$
begin
  if requested_sensitivity_class is null
    or requested_sensitivity_class not in ('S0', 'S1') then
    raise exception 'A reviewed S0 or S1 classification is required' using errcode = '22023';
  end if;
  if requested_unauthenticated_exposure_permitted is distinct from true then
    raise exception 'Staff-facing exposure without sign-in must be approved explicitly' using errcode = '22023';
  end if;
  if requested_exposure_reason is null
    or length(btrim(requested_exposure_reason)) not between 1 and 500 then
    raise exception 'A short staff exposure reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_resource_text(requested_exposure_reason);
end;
$$;

create or replace function pac.publish_resource_draft(
  requested_scope_id text,
  requested_content_item_id text,
  expected_draft_revision_id uuid,
  expected_scope_decision_id bigint,
  requested_reason text,
  requested_sensitivity_class text,
  requested_unauthenticated_exposure_permitted boolean,
  requested_exposure_reason text
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
  perform pac.assert_explicit_resource_staff_exposure(
    requested_sensitivity_class,
    requested_unauthenticated_exposure_permitted,
    requested_exposure_reason
  );

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

  update pac.content_items
  set sensitivity_class = requested_sensitivity_class
  where content_item_id = requested_content_item_id;

  insert into pac.content_revisions (
    content_item_id, revision_number, canonical_payload, change_summary,
    required_review_dimensions, created_by, based_on_revision_id,
    sensitivity_class, ordinary_indexing_allowed, model_context_allowed,
    limitations
  ) values (
    requested_content_item_id, release_revision_number, release_payload,
    'Reviewed and approved for staff use.',
    draft_revision.required_review_dimensions,
    'practice-workspace-owner', draft_revision.revision_id,
    requested_sensitivity_class, true, false,
    array['Approved only for ordinary retrieval at the staff-facing web address; model context requires a separate decision.']::text[]
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
    gate_snapshot, decided_by, reason, sensitivity_class,
    unauthenticated_exposure_permitted, exposure_reason
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
      'icons_checked', true,
      'sensitivity_class', requested_sensitivity_class,
      'ordinary_indexing_allowed', true,
      'model_context_allowed', false,
      'unauthenticated_exposure_permitted', true,
      'exposure_reason_recorded', true
    ),
    'practice-workspace-owner',
    btrim(requested_reason),
    requested_sensitivity_class,
    requested_unauthenticated_exposure_permitted,
    btrim(requested_exposure_reason)
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
      'staff_release_explicit', true,
      'sensitivity_class', requested_sensitivity_class,
      'unauthenticated_exposure_permitted', true,
      'model_context_allowed', false
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
  requested_reason text,
  requested_sensitivity_class text,
  requested_unauthenticated_exposure_permitted boolean,
  requested_exposure_reason text
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
  perform pac.assert_explicit_resource_staff_exposure(
    requested_sensitivity_class,
    requested_unauthenticated_exposure_permitted,
    requested_exposure_reason
  );

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
  if requested_revision.sensitivity_class is distinct from requested_sensitivity_class
    or requested_revision.sensitivity_class not in ('S0', 'S1')
    or requested_revision.ordinary_indexing_allowed is distinct from true then
    raise exception 'Only a previously classified S0 or S1 staff version can be restored' using errcode = '22023';
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

  update pac.content_items
  set sensitivity_class = requested_sensitivity_class
  where content_item_id = requested_content_item_id;

  insert into pac.publication_decisions (
    content_item_id, revision_id, scope_id, decision,
    gate_snapshot, decided_by, reason, sensitivity_class,
    unauthenticated_exposure_permitted, exposure_reason
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
      'icons_checked', true,
      'sensitivity_class', requested_sensitivity_class,
      'ordinary_indexing_allowed', true,
      'unauthenticated_exposure_permitted', true,
      'exposure_reason_recorded', true
    ),
    'practice-workspace-owner',
    btrim(requested_reason),
    requested_sensitivity_class,
    requested_unauthenticated_exposure_permitted,
    btrim(requested_exposure_reason)
  ) returning publication_decision_id into new_publication_decision_id;

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'practice-workspace-owner', 'owner', requested_scope_id, 'content_item',
    requested_content_item_id, 'resource_restored',
    jsonb_build_object(
      'restored_revision_id', requested_revision_id,
      'publication_decision_id', new_publication_decision_id,
      'staff_release_explicit', true,
      'sensitivity_class', requested_sensitivity_class,
      'unauthenticated_exposure_permitted', true
    )
  );

  return pac.read_resource_release_state(
    requested_scope_id, requested_content_item_id
  );
end;
$$;

-- Existing deployments may already contain the one frozen 25-resource seed
-- release. This narrow, named migration decision restores only that reviewed
-- release after migration 0009 deliberately classified legacy rows as S2.
do $$
declare
  release_id constant text := 'permanent-seed-staff-release-2026-09-05';
  seed_source_id constant text := 'owner:current-seed-collection-2026-09-04:v1';
  seed_collection_id constant text := 'current-seed-2026-09-04';
  expected_item_ids constant text[] := array[
    'ext-ada',
    'ext-clas',
    'ext-dhs-equity-toolkit',
    'ext-mn-accessibility',
    'ext-title-vi-lep',
    'ja-access-checks',
    'ja-climate-action-plan',
    'ja-equity-impact-questions',
    'ja-facilitation-session-plan',
    'ja-form-notice-change',
    'ja-language-access-checklist',
    'ja-launch-embed-checklist',
    'ja-plain-language',
    'ja-process-burden',
    'ja-stakeholder-map',
    'lm-facilitation-application',
    'lm-how-this-program-works',
    'lm-interpreter',
    'lm-workplace-climate',
    'pn-embed-early',
    'pn-equity-in-practice',
    'pn-intercultural-method',
    'pn-partnership-spine',
    'pn-self-check',
    'pn-when-to-escalate'
  ]::text[];
  seed_exposure_reason constant text := 'The consultant-approved permanent seed release contains reviewed internal-purpose resources and is intentionally available at the staff-facing web address without sign-in.';
  release_rows integer;
  release_items integer;
  release_item_ids text[];
begin
  select count(*), count(distinct decision.content_item_id),
    array_agg(distinct decision.content_item_id order by decision.content_item_id)
  into release_rows, release_items, release_item_ids
  from pac.publication_decisions decision
  where decision.gate_snapshot ->> 'release_id' = release_id;

  if release_rows = 0 then
    return;
  end if;
  if release_rows <> 25
    or release_items <> 25
    or release_item_ids is distinct from expected_item_ids
    or exists (
    select 1
    from pac.publication_decisions decision
    where decision.gate_snapshot ->> 'release_id' = release_id
      and (
        decision.decision <> 'publish'
        or decision.scope_id not in ('one-dhs', 'dsd')
        or decision.gate_snapshot ->> 'collection_id' <> seed_collection_id
        or decision.gate_snapshot ->> 'linked_source_item_id' <> seed_source_id
        or decision.gate_snapshot ->> 'staff_retrieval_eligible' <> 'true'
      )
  ) then
    raise exception 'The historical permanent seed release does not match its governed 25-resource boundary';
  end if;
  if not exists (
    select 1 from pac.source_items source where source.source_item_id = seed_source_id
  ) then
    raise exception 'The governed permanent seed source is missing';
  end if;

  perform pg_catalog.set_config('pac.allow_immutable_change', 'on', true);

  update pac.source_carriers carrier
  set sensitivity_class = 'S1'
  from pac.source_items source
  where source.source_item_id = seed_source_id
    and carrier.carrier_id = source.carrier_id;

  update pac.source_items
  set sensitivity_class = 'S1',
      deidentification_status = 'not_needed',
      ordinary_indexing_allowed = true,
      model_context_allowed = false
  where source_item_id = seed_source_id;

  update pac.content_items item
  set sensitivity_class = 'S1'
  where exists (
    select 1
    from pac.publication_decisions decision
    where decision.gate_snapshot ->> 'release_id' = release_id
      and decision.content_item_id = item.content_item_id
  );

  update pac.content_revisions revision
  set sensitivity_class = 'S1',
      ordinary_indexing_allowed = true,
      model_context_allowed = false,
      limitations = array['Internal-purpose staff resource; exposure approved by the governed permanent seed release.']::text[]
  where exists (
    select 1
    from pac.publication_decisions decision
    where decision.gate_snapshot ->> 'release_id' = release_id
      and decision.revision_id = revision.revision_id
  );

  if exists (
    select 1
    from pac.publication_decisions decision
    join pac.revision_sources link on link.revision_id = decision.revision_id
    join pac.source_items source on source.source_item_id = link.source_item_id
    where decision.gate_snapshot ->> 'release_id' = release_id
      and (
        source.sensitivity_class not in ('S0', 'S1')
        or source.ordinary_indexing_allowed is distinct from true
        or source.deidentification_status not in ('not_needed', 'verified')
      )
  ) or exists (
    select 1
    from pac.publication_decisions decision
    join pac.revision_assets link on link.revision_id = decision.revision_id
    join pac.assets asset on asset.asset_id = link.asset_id
    where decision.gate_snapshot ->> 'release_id' = release_id
      and asset.sensitivity_class not in ('S0', 'S1')
  ) then
    raise exception 'The governed permanent seed release contains an unclassified linked source or asset';
  end if;

  update pac.publication_decisions decision
  set sensitivity_class = 'S1',
      unauthenticated_exposure_permitted = true,
      exposure_reason = seed_exposure_reason,
      gate_snapshot = decision.gate_snapshot || jsonb_build_object(
        'sensitivity_class', 'S1',
        'ordinary_indexing_allowed', true,
        'model_context_allowed', false,
        'unauthenticated_exposure_permitted', true,
        'exposure_reason_recorded', true,
        'trust_decision_source', 'governed_seed_release'
      )
  where decision.gate_snapshot ->> 'release_id' = release_id;

  perform pg_catalog.set_config('pac.allow_immutable_change', 'off', true);

  insert into pac.change_events (
    actor_id, actor_role, scope_id, object_type, object_id, action, detail
  ) values (
    'Equity and Inclusion Operations Consultant', 'owner', 'one-dhs',
    'seed_release', release_id, 'data_trust_classified',
    jsonb_build_object(
      'resource_count', 25,
      'sensitivity_class', 'S1',
      'ordinary_indexing_allowed', true,
      'model_context_allowed', false,
      'unauthenticated_exposure_permitted', true,
      'exposure_reason', seed_exposure_reason
    )
  );
end;
$$;

revoke all privileges on function pac.assert_explicit_resource_staff_exposure(text, boolean, text) from public;
revoke execute on function pac.publish_resource_draft(text, text, uuid, bigint, text) from pac_app_runtime;
revoke execute on function pac.republish_resource_revision(text, text, uuid, bigint, text) from pac_app_runtime;
revoke all privileges on function pac.publish_resource_draft(text, text, uuid, bigint, text, text, boolean, text) from public;
revoke all privileges on function pac.republish_resource_revision(text, text, uuid, bigint, text, text, boolean, text) from public;

grant execute on function pac.publish_resource_draft(text, text, uuid, bigint, text, text, boolean, text) to pac_app_runtime;
grant execute on function pac.republish_resource_revision(text, text, uuid, bigint, text, text, boolean, text) to pac_app_runtime;

comment on function pac.assert_explicit_resource_staff_exposure(text, boolean, text) is
  'Rejects implicit/default data classification or exposure during a staff-facing resource release.';
comment on function pac.publish_resource_draft(text, text, uuid, bigint, text, text, boolean, text) is
  'Publishes a reviewed resource only with an explicit S0/S1 classification and recorded approval for staff-facing access without sign-in.';
comment on function pac.republish_resource_revision(text, text, uuid, bigint, text, text, boolean, text) is
  'Restores only a previously classified S0/S1 revision with a new explicit staff-facing exposure decision.';

commit;
