-- Exact restoration of the owner's approved domain-resource originals.
-- Original candidate/source rows remain immutable and restricted. No new review is invented.
begin;
create table pac.resource_owner_approvals (
  revision_id uuid primary key references pac.content_revisions(revision_id),
  content_item_id text not null references pac.content_items(content_item_id),
  scope_id text not null references pac.program_scopes(scope_id) check(scope_id='one-dhs'),
  payload_sha256 text not null check(payload_sha256 ~ '^[a-f0-9]{64}$'),
  original_revision_id uuid not null references pac.content_revisions(revision_id),
  original_source_id text not null references pac.source_items(source_item_id),
  approval_basis text not null check(approval_basis='standing_owner_approval_on_input'),
  approved_by text not null,
  recorded_at timestamptz not null default clock_timestamp()
);
alter table pac.resource_owner_approvals enable row level security;
revoke all on pac.resource_owner_approvals from public,pac_app_runtime;
create trigger resource_owner_approvals_append_only before update or delete on pac.resource_owner_approvals
for each row execute function pac.prevent_immutable_change();
create function pac.resource_revision_has_owner_approval(item_id text, version_id uuid, requested_scope text)
returns boolean language sql stable security definer set search_path=pg_catalog,pac set row_security=off as $$
 select exists(select 1 from pac.resource_owner_approvals a
 join pac.content_revisions r on r.revision_id=a.revision_id and r.content_item_id=a.content_item_id
 join pac.content_revisions original on original.revision_id=a.original_revision_id and original.content_item_id=a.content_item_id
 join pac.source_items source on source.source_item_id=a.original_source_id
 where a.content_item_id=item_id and a.revision_id=version_id and a.scope_id=requested_scope
 and a.payload_sha256=r.payload_sha256 and a.approval_basis='standing_owner_approval_on_input'
 and r.canonical_payload=original.canonical_payload#>'{richOriginal,contentItem}'
 and r.canonical_payload=source.normalized_payload#>'{richOriginal,contentItem}'
 and original.canonical_payload->>'assetKind'='domain_resource'
 and original.canonical_payload#>>'{donor,commit}'='5680911e68dcf07414de5f003b18ac8e813a8cb1'
 and r.canonical_payload->>'status'='approved' and r.canonical_payload->>'scope'='agencywide');
$$;
revoke all on function pac.resource_revision_has_owner_approval(text,uuid,text) from public,pac_app_runtime;

create or replace function pac.enforce_publication_gate()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
declare
  revision_item_id text;
  required_dimension text;
  latest_status text;
  linked_sources integer;
  unapproved_sources integer;
begin
  select content_item_id into revision_item_id
  from pac.content_revisions
  where revision_id = new.revision_id;

  if revision_item_id is distinct from new.content_item_id then
    raise exception 'Revision % does not belong to content item %', new.revision_id, new.content_item_id;
  end if;

  if new.decision <> 'publish' then
    return new;
  end if;

  if pac.page_block_has_owner_approval(new.content_item_id, new.revision_id, new.scope_id) then
    perform pac.assert_valid_page_block_copy(
      new.content_item_id,
      (select canonical_payload -> 'copy' from pac.content_revisions where revision_id = new.revision_id)
    );
    if not pac.page_block_revision_is_staff_exposable(new.content_item_id, new.revision_id) then
      raise exception 'Owner wording does not meet the page publication contract' using errcode = '22023';
    end if;
    new.gate_snapshot := new.gate_snapshot || jsonb_build_object(
      'approvalBasis', 'standing_owner_approval_on_input',
      'ownerApprovalRevisionId', new.revision_id,
      'independentFactualReviewPerformed', false,
      'independentAccessibilityAuditPerformed', false
    );
  elsif pac.resource_revision_has_owner_approval(new.content_item_id,new.revision_id,new.scope_id) then
    perform pac.assert_resource_staff_release(new.revision_id);
    new.gate_snapshot := new.gate_snapshot || jsonb_build_object(
      'approvalBasis','standing_owner_approval_on_input',
      'ownerApprovalRevisionId',new.revision_id,
      'exactOriginalContentPreserved',true,
      'independentFactualReviewPerformed',false,
      'independentAccessibilityAuditPerformed',false);
  else
  for required_dimension in
    select unnest(required_review_dimensions)
    from pac.content_revisions
    where revision_id = new.revision_id
  loop
    select status into latest_status
    from pac.current_revision_reviews
    where revision_id = new.revision_id and dimension = required_dimension;

    if latest_status is null or latest_status not in ('pass', 'not_applicable') then
      raise exception 'Revision % cannot publish: % review is %',
        new.revision_id, required_dimension, coalesce(latest_status, 'missing');
    end if;
  end loop;

  end if;

  select count(*) into linked_sources
  from pac.revision_sources
  where revision_id = new.revision_id;

  if linked_sources = 0 then
    raise exception 'Revision % cannot publish: no accounted source is linked', new.revision_id;
  end if;

  select count(*) into unapproved_sources
  from pac.revision_sources rs
  join pac.source_items si on si.source_item_id = rs.source_item_id
  where rs.revision_id = new.revision_id
    and (
      si.owner_approval_status <> 'owner_approved_for_ingestion'
      or si.accounting_status <> 'accounted'
    );

  if unapproved_sources > 0 then
    raise exception 'Revision % cannot publish: a linked source is missing or not approved for ingestion', new.revision_id;
  end if;

  return new;
end;
$$;

-- Setup-only recovery function. Staff and ordinary runtime requests cannot create
-- source projections or claim that a recovered item is approved.
create function pac.release_owner_approved_domain_resource(
  requested_item_id text, expected_original_revision_id uuid, expected_original_hash text
) returns jsonb language plpgsql security definer set search_path=pg_catalog,pac set row_security=off as $$
declare
 original pac.content_revisions%rowtype;
 original_source pac.source_items%rowtype;
 item pac.content_items%rowtype;
 prior pac.publication_decisions%rowtype;
 payload jsonb;
 release_id uuid := gen_random_uuid();
 release_number integer;
 release_hash text;
 source_id text;
 carrier_id uuid;
 decision_id bigint;
begin
 select * into item from pac.content_items where content_item_id=requested_item_id for update;
 if item.content_kind is distinct from 'resource' or item.default_scope_id is distinct from 'one-dhs' or item.retired_at is not null then
  raise exception 'An intact agencywide domain resource is required' using errcode='22023';
 end if;
 select * into original from pac.content_revisions where revision_id=expected_original_revision_id and content_item_id=requested_item_id;
 if original.revision_id is null or original.payload_sha256 is distinct from expected_original_hash then
  raise exception 'The recovered original changed' using errcode='40001';
 end if;
 if original.canonical_payload->>'assetKind' is distinct from 'domain_resource'
  or original.canonical_payload->>'sourceClass' is distinct from 'authored'
  or original.canonical_payload#>>'{donor,commit}' is distinct from '5680911e68dcf07414de5f003b18ac8e813a8cb1'
  or original.canonical_payload#>>'{richOriginal,releaseRecord,status}' is distinct from 'approved_static' then
  raise exception 'Only the pinned owner-approved domain originals may use this release' using errcode='22023';
 end if;
 payload := original.canonical_payload#>'{richOriginal,contentItem}';
 if payload->>'id' is distinct from requested_item_id or payload->>'scope' is distinct from 'agencywide'
  or payload->>'status' is distinct from 'approved' or payload->>'accessibility' is distinct from 'pending' then
  raise exception 'The original resource contract is incomplete' using errcode='22023';
 end if;
 select s.* into original_source from pac.source_items s join pac.revision_sources rs using(source_item_id)
 where rs.revision_id=original.revision_id and s.normalized_payload#>'{richOriginal,contentItem}'=payload
 and s.owner_approval_status='owner_approved_for_ingestion' and s.accounting_status='accounted'
 order by s.source_item_id limit 1;
 if original_source.source_item_id is null then raise exception 'The accounted original source is missing' using errcode='22023'; end if;
 select * into prior from pac.publication_decisions where content_item_id=requested_item_id and scope_id='one-dhs' order by publication_decision_id desc limit 1;
 if prior.publication_decision_id is not null then
  if prior.decision='publish' and pac.resource_revision_has_owner_approval(requested_item_id,prior.revision_id,'one-dhs') then
   return jsonb_build_object('contentItemId',requested_item_id,'revisionId',prior.revision_id,'publicationDecisionId',prior.publication_decision_id,'replayed',true);
  end if;
  raise exception 'Preserve the existing owner publication or withdrawal decision' using errcode='40001';
 end if;
 if exists(select 1 from pac.content_revisions r where r.content_item_id=requested_item_id and r.revision_number>original.revision_number) then
  raise exception 'Preserve the existing newer resource revision' using errcode='40001';
 end if;
 release_hash := encode(sha256(convert_to(payload::text,'UTF8')),'hex');
 source_id := 'owner-domain-release:'||requested_item_id||':'||release_hash;
 insert into pac.source_carriers(logical_key,media_type,original_name,byte_count,raw_blob_sha256,external_locator,captured_by,sensitivity_class)
 values(source_id,'application/json',requested_item_id||'.json',octet_length(convert_to(payload::text,'UTF8')),release_hash,
 jsonb_build_object('originalSourceId',original_source.source_item_id,'originalRevisionId',original.revision_id,'sourceCommit','5680911e68dcf07414de5f003b18ac8e813a8cb1'),
 'program-owner-authorized-domain-recovery','S1') returning source_carriers.carrier_id into carrier_id;
 insert into pac.source_items(source_item_id,source_business_id,carrier_id,source_version,source_pointer,title,normalized_payload,normalized_item_sha256,hash_algorithm,hash_algorithm_version,owner_approval_status,accounting_status,access_scope,sensitivity_class,deidentification_status,ordinary_indexing_allowed,model_context_allowed)
 values(source_id,'owner-domain-release:'||requested_item_id,carrier_id,'owner-approved-2026-09-07',original_source.source_pointer||'#exact-approved-resource',payload->>'title',payload,release_hash,'SHA-256','postgres-jsonb-text-utf8-v1','owner_approved_for_ingestion','accounted','staff_candidate','S1','not_needed',true,false);
 select coalesce(max(revision_number),0)+1 into release_number from pac.content_revisions where content_item_id=requested_item_id;
 insert into pac.content_revisions(revision_id,content_item_id,revision_number,canonical_payload,change_summary,required_review_dimensions,created_by,based_on_revision_id,sensitivity_class,ordinary_indexing_allowed,model_context_allowed,limitations)
 values(release_id,requested_item_id,release_number,payload,'Restored the exact owner-approved domain resource; original source and candidate retained.',original.required_review_dimensions,'program-owner-authorized-domain-recovery',original.revision_id,'S1',true,false,
 array['Owner-supplied program guidance approved for staff use. Original accessibility status remains pending; this release does not claim a new independent factual review or accessibility audit.']);
 perform pac.assert_resource_staff_release(release_id);
 insert into pac.revision_sources(revision_id,source_item_id,relationship,note)
 values(release_id,source_id,'primary','Exact flat resource from the preserved original; candidate lineage is recorded in based_on_revision_id and the owner approval receipt.');
 insert into pac.resource_owner_approvals(revision_id,content_item_id,scope_id,payload_sha256,original_revision_id,original_source_id,approval_basis,approved_by)
 values(release_id,requested_item_id,'one-dhs',release_hash,original.revision_id,original_source.source_item_id,'standing_owner_approval_on_input','Gary Banks, program owner; current task instructions');
 update pac.content_items set restricted=false,sensitivity_class='S1' where content_item_id=requested_item_id;
 insert into pac.publication_decisions(content_item_id,revision_id,scope_id,decision,gate_snapshot,decided_by,reason,sensitivity_class,unauthenticated_exposure_permitted,exposure_reason)
 values(requested_item_id,release_id,'one-dhs','publish',jsonb_build_object('approvalBasis','standing_owner_approval_on_input','automaticValidation',jsonb_build_object('flatResourceContract',true,'plainTextAndSafeLinks',true,'scope',true),'originalRevisionId',original.revision_id,'originalSourceId',original_source.source_item_id),
 'program-owner-authorized-domain-recovery','The owner curated and approved this original resource and authorized restoring its full staff availability.','S1',true,'The owner supplied this program-authored resource for the public staff application and authorized its restoration.')
 returning publication_decision_id into decision_id;
 insert into pac.change_events(actor_id,actor_role,scope_id,object_type,object_id,action,detail)
 values('program-owner-authorized-domain-recovery','owner','one-dhs','content_item',requested_item_id,'owner_approved_resource_restored',jsonb_build_object('originalRevisionId',original.revision_id,'revisionId',release_id,'publicationDecisionId',decision_id));
 return jsonb_build_object('contentItemId',requested_item_id,'revisionId',release_id,'publicationDecisionId',decision_id,'replayed',false);
end;
$$;
revoke all on function pac.release_owner_approved_domain_resource(text,uuid,text) from public,pac_app_runtime;

-- Restore exact owner-approved revisions without manufacturing review records.
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

  if not pac.resource_revision_has_owner_approval(requested_content_item_id,requested_revision_id,requested_scope_id) and exists (
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
commit;
