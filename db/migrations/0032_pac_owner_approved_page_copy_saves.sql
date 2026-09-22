-- Home/footer owner input carries the owner's standing content approval.
-- Preserve all earlier wording, source objects, drafts, reviews and decisions.
-- No factual review or accessibility audit is invented by this saving path.
begin;

create table pac.page_block_owner_approvals (
  revision_id uuid primary key references pac.content_revisions(revision_id),
  content_item_id text not null references pac.content_items(content_item_id),
  scope_id text not null references pac.program_scopes(scope_id),
  payload_sha256 text not null check(payload_sha256 ~ '^[a-f0-9]{64}$'),
  approval_basis text not null check(approval_basis='standing_owner_approval_on_input'),
  approved_by text not null,
  recorded_at timestamptz not null default clock_timestamp(),
  check(content_item_id in ('page-home','site-footer')),
  check(scope_id in ('one-dhs','dsd'))
);
alter table pac.page_block_owner_approvals enable row level security;
revoke all privileges on pac.page_block_owner_approvals from public,pac_app_runtime;
create trigger page_block_owner_approvals_append_only
before update or delete on pac.page_block_owner_approvals
for each row execute function pac.prevent_surface_history_change();
comment on table pac.page_block_owner_approvals is
  'Immutable owner approval for an exact Home/footer revision; not a factual or accessibility review.';

create function pac.page_block_has_owner_approval(
  requested_content_item_id text, requested_revision_id uuid, requested_scope_id text default null
) returns boolean language sql stable security definer
set search_path=pg_catalog,pac set row_security=off as $$
  select exists (
    select 1 from pac.page_block_owner_approvals approval
    join pac.content_revisions revision on revision.revision_id=approval.revision_id
      and revision.content_item_id=approval.content_item_id
    join pac.content_items item on item.content_item_id=approval.content_item_id
    where approval.revision_id=requested_revision_id
      and approval.content_item_id=requested_content_item_id
      and requested_content_item_id in ('page-home','site-footer')
      and approval.scope_id=item.default_scope_id
      and (requested_scope_id is null or approval.scope_id=requested_scope_id)
      and revision.canonical_payload->>'scope'=case when approval.scope_id='dsd' then 'dsd' else 'agencywide' end
      and revision.payload_sha256=approval.payload_sha256
      and approval.approval_basis='standing_owner_approval_on_input'
  );
$$;

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
      and (
        (revision.canonical_payload ->> 'accessibility' = 'reviewed'
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
      ))
        or (revision.canonical_payload ->> 'accessibility' = 'pending'
          and pac.page_block_has_owner_approval(requested_content_item_id, requested_revision_id))
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


create function pac.save_owner_approved_page_block(
  requested_scope_id text,
  requested_content_item_id text,
  expected_base_revision_id uuid,
  expected_publication_decision_id bigint,
  requested_copy jsonb,
  requested_change_note text default null
) returns jsonb language plpgsql security definer
set search_path=pg_catalog,pac set row_security=off as $$
declare
  current_state jsonb;
  current_revision_id uuid;
  current_decision_id bigint;
  release_revision_id uuid := gen_random_uuid();
  release_revision_number integer;
  release_payload jsonb;
  release_hash text;
  release_carrier_id uuid;
  release_source_id text;
  release_source_payload jsonb;
  new_decision_id bigint;
begin
  perform pac.assert_page_block_mutation_allowed(requested_scope_id,requested_content_item_id);
  perform pac.assert_valid_page_block_copy(requested_content_item_id,requested_copy);
  if requested_change_note is not null and length(btrim(requested_change_note))>1000 then
    raise exception 'The change note is too long' using errcode='22023';
  end if;
  if length(btrim(coalesce(requested_change_note,'')))>0 then
    perform pac.assert_plain_page_text(requested_change_note);
  end if;

  -- Share the same row lock as draft, publication, restore and withdrawal.
  perform 1 from pac.content_items item
    where item.content_item_id=requested_content_item_id and item.sensitivity_class='S1'
    for update;
  if not found then raise exception 'This page area is not available' using errcode='P0002'; end if;
  current_state := pac.read_page_block_editing_state(requested_scope_id,requested_content_item_id);
  if current_state is null then raise exception 'This page area is not available' using errcode='P0002'; end if;
  current_revision_id := (current_state->>'expectedRevisionId')::uuid;
  current_decision_id := (current_state->>'publicationDecisionId')::bigint;
  if current_revision_id is distinct from expected_base_revision_id
    or current_decision_id is distinct from expected_publication_decision_id then
    raise exception 'Page wording or availability changed after it was opened' using errcode='40001';
  end if;

  select coalesce(max(revision_number),0)+1 into release_revision_number
    from pac.content_revisions where content_item_id=requested_content_item_id;
  release_payload := jsonb_build_object(
    'id',requested_content_item_id,
    'blockType',case when requested_content_item_id='page-home' then 'home' else 'footer' end,
    'status','approved','accessibility','pending',
    'scope',case when requested_scope_id='dsd' then 'dsd' else 'agencywide' end,
    'version',release_revision_number::text,'copy',requested_copy
  );
  release_source_id := 'page-owner-save-' || release_revision_id::text;
  release_source_payload := jsonb_build_object(
    'kind','owner_approved_page_copy','contentItemId',requested_content_item_id,
    'scopeId',requested_scope_id,'releaseRevisionId',release_revision_id,'copy',requested_copy
  );
  insert into pac.source_carriers(
    logical_key,media_type,original_name,byte_count,raw_blob_sha256,
    external_locator,captured_by,sensitivity_class
  ) values(
    'page-owner-save:' || release_revision_id::text,'application/json',requested_content_item_id || '-owner-save.json',
    octet_length(convert_to(release_source_payload::text,'UTF8')),
    encode(public.digest(convert_to(release_source_payload::text,'UTF8'),'sha256'),'hex'),
    jsonb_build_object('kind','owner_approved_page_copy','revisionId',release_revision_id),
    'pac-consultant-workspace-owner','S1'
  ) returning carrier_id into release_carrier_id;
  insert into pac.source_items(
    source_item_id,source_business_id,carrier_id,source_version,source_pointer,title,
    normalized_payload,normalized_item_sha256,hash_algorithm,hash_algorithm_version,
    owner_approval_status,accounting_status,access_scope,sensitivity_class,
    deidentification_status,ordinary_indexing_allowed,model_context_allowed
  ) values(
    release_source_id,release_source_id,release_carrier_id,'1','owner-save/' || release_revision_id::text,
    case when requested_content_item_id='page-home' then 'Owner-approved Home wording' else 'Owner-approved footer wording' end,
    release_source_payload,encode(public.digest(convert_to(release_source_payload::text,'UTF8'),'sha256'),'hex'),
    'sha256','1','owner_approved_for_ingestion','accounted','staff_candidate','S1','not_needed',true,false
  );
  insert into pac.content_revisions(
    revision_id,content_item_id,revision_number,canonical_payload,change_summary,
    required_review_dimensions,created_by,based_on_revision_id,sensitivity_class,
    ordinary_indexing_allowed,model_context_allowed,limitations
  ) values(
    release_revision_id,requested_content_item_id,release_revision_number,release_payload,
    coalesce(nullif(btrim(requested_change_note),''),'Wording saved by the program owner.'),
    array['language_alignment','factual_currentness','accessibility','scope','placement']::text[],
    'pac-consultant-workspace-owner',current_revision_id,'S1',true,false,
    array['Owner-approved page wording. An independent factual review and accessibility audit were not performed for this revision.']::text[]
  ) returning payload_sha256 into release_hash;
  insert into pac.revision_sources(revision_id,source_item_id,relationship,note)
    values(release_revision_id,release_source_id,'primary','Exact wording supplied through the authenticated owner editor.');
  insert into pac.revision_assets(revision_id,asset_id,purpose,staff_label,sort_order)
    select release_revision_id,asset_id,purpose,staff_label,sort_order
    from pac.revision_assets where revision_id=current_revision_id;
  insert into pac.page_block_owner_approvals(
    revision_id,content_item_id,scope_id,payload_sha256,approval_basis,approved_by
  ) values(
    release_revision_id,requested_content_item_id,requested_scope_id,release_hash,
    'standing_owner_approval_on_input','pac-consultant-workspace-owner'
  );
  if not pac.page_block_revision_is_staff_exposable(requested_content_item_id,release_revision_id) then
    raise exception 'The wording or a linked asset does not meet the page publication contract' using errcode='22023';
  end if;
  insert into pac.publication_decisions(
    content_item_id,revision_id,scope_id,decision,gate_snapshot,decided_by,reason,
    sensitivity_class,unauthenticated_exposure_permitted,exposure_reason
  ) values(
    requested_content_item_id,release_revision_id,requested_scope_id,'publish',
    jsonb_build_object(
      'ownerApprovedSave',true,'approvalBasis','standing_owner_approval_on_input',
      'basedOnRevisionId',current_revision_id,'replacedScopeDecisionId',current_decision_id,
      'linkedSourceItemId',release_source_id,'exactReleaseCopyCaptured',true,
      'automaticValidation',jsonb_build_object('registeredFields',true,'scope',true,'plainTextFormat',true,'safeLinkSyntax',true),
      'independentFactualReviewPerformed',false,'independentAccessibilityAuditPerformed',false
    ),
    'pac-consultant-workspace-owner','Wording saved with the program owner''s standing approval.',
    'S1',true,'Owner-approved page wording for ordinary staff access.'
  ) returning publication_decision_id into new_decision_id;
  insert into pac.change_events(actor_id,actor_role,scope_id,object_type,object_id,action,detail)
    values('pac-consultant-workspace-owner','owner',requested_scope_id,'page_block',requested_content_item_id,'published',
      jsonb_build_object(
        'ownerApprovedSave',true,'approvalBasis','standing_owner_approval_on_input',
        'basedOnRevisionId',current_revision_id,'releaseRevisionId',release_revision_id,
        'publicationDecisionId',new_decision_id,'automaticValidationCompleted',true,
        'independentFactualReviewPerformed',false,'independentAccessibilityAuditPerformed',false
      ));
  return pac.read_page_block_editing_state(requested_scope_id,requested_content_item_id);
end;
$$;
revoke all privileges on function pac.page_block_has_owner_approval(text,uuid,text) from public,pac_app_runtime;
revoke all privileges on function pac.save_owner_approved_page_block(text,text,uuid,bigint,jsonb,text) from public;
grant execute on function pac.save_owner_approved_page_block(text,text,uuid,bigint,jsonb,text) to pac_app_runtime;
comment on function pac.save_owner_approved_page_block(text,text,uuid,bigint,jsonb,text) is
  'Owner API only: atomically save and publish the exact Home/footer revision, with standing owner approval and no invented review results.';
-- A withdrawn block has no current revision; its history still needs a boolean.
do $page_history$
declare definition text; corrected text;
begin
  select pg_get_functiondef('pac.read_page_block_editing_state(text,text)'::regprocedure) into definition;
  corrected := replace(definition,
    '''isCurrent'', revision.revision_id = published_revision_id',
    '''isCurrent'', coalesce(revision.revision_id = published_revision_id, false)');
  if corrected = definition then raise exception 'Page history boolean anchor was not found'; end if;
  execute corrected;
end;
$page_history$;
commit;
