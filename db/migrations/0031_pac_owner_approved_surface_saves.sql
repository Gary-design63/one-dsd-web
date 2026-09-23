-- Owner-authenticated input carries the program owner's standing content approval.
-- Structural validation remains mandatory and is recorded separately from human
-- factual/accessibility review. This migration fabricates no review outcomes.
begin;

create table if not exists pac.surface_owner_approvals (
  revision_id uuid primary key,
  surface_id text not null,
  scope_id text not null check (scope_id in ('one-dhs', 'dsd')),
  document_sha256 text not null check (document_sha256 ~ '^[a-f0-9]{64}$'),
  approval_basis text not null check (approval_basis = 'standing_owner_approval_on_input'),
  approved_by text not null,
  recorded_at timestamptz not null default clock_timestamp(),
  foreign key (revision_id, surface_id, scope_id)
    references pac.surface_revisions(revision_id, surface_id, scope_id)
);

alter table pac.surface_owner_approvals enable row level security;
revoke all privileges on pac.surface_owner_approvals from public, pac_app_runtime;
drop trigger if exists surface_owner_approvals_append_only on pac.surface_owner_approvals;
create trigger surface_owner_approvals_append_only
before update or delete on pac.surface_owner_approvals
for each row execute function pac.prevent_surface_history_change();

comment on table pac.surface_owner_approvals is
  'Immutable approval basis for exact wording saved through the authenticated owner application boundary; this is not an independent factual or accessibility review.';

create or replace function pac.enforce_surface_publication_gate()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
declare
  definition pac.surface_definitions%rowtype;
  revision pac.surface_revisions%rowtype;
begin
  select * into strict definition from pac.surface_definitions
  where surface_id = new.surface_id and active = true;
  if new.decision = 'inherit' and definition.scope_policy <> 'inheritable' then
    raise exception 'This page area does not permit inherited wording' using errcode = '42501';
  end if;
  if new.revision_id is not null then
    select * into revision from pac.surface_revisions where revision_id = new.revision_id;
    if not found or revision.surface_id <> new.surface_id then
      raise exception 'Publishing decision revision does not belong to this page area' using errcode = '22023';
    end if;
    if new.decision = 'publish' and revision.scope_id <> new.scope_id then
      raise exception 'Published wording must belong to the exact program scope' using errcode = '22023';
    end if;
    if new.decision = 'withdraw' and revision.scope_id <> new.scope_id
      and not (definition.scope_policy = 'inheritable' and new.scope_id = 'dsd' and revision.scope_id = 'one-dhs') then
      raise exception 'Withdrawn wording must be visible in the requested program scope' using errcode = '22023';
    end if;
  end if;
  if new.decision = 'publish' then
    perform pac.assert_valid_surface_document(new.surface_id, new.scope_id, revision.document);
    if exists (
      select 1 from pac.surface_owner_approvals approval
      where approval.revision_id = revision.revision_id
        and approval.surface_id = new.surface_id and approval.scope_id = new.scope_id
        and approval.document_sha256 = revision.document_sha256
        and approval.approval_basis = 'standing_owner_approval_on_input'
    ) then
      new.gate_snapshot := new.gate_snapshot || jsonb_build_object(
        'approvalBasis', 'standing_owner_approval_on_input',
        'ownerApprovalRevisionId', revision.revision_id,
        'automaticValidation', jsonb_build_object(
          'registeredFields', true, 'scope', true, 'protectedFields', true,
          'plainTextFormat', true, 'safeLinkSyntax', true),
        'independentFactualReviewPerformed', false,
        'independentAccessibilityAuditPerformed', false
      );
    elsif exists (
    select 1 from unnest(revision.required_review_dimensions) required(dimension)
    left join lateral (
      select review.status from pac.surface_reviews review
      where review.revision_id = revision.revision_id and review.dimension = required.dimension
      order by review.recorded_at desc, review.review_id desc limit 1
    ) current_review on true
    where current_review.status is null or current_review.status not in ('pass', 'not_applicable')
  ) then
    raise exception 'Every required review must be complete before publishing' using errcode = '55000';
    end if;
  end if;
  if length(btrim(new.reason)) = 0 or length(new.reason) > 1000 then
    raise exception 'A brief publishing reason is required' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(new.reason);
  return new;
end;
$$;

create or replace function pac.save_owner_approved_surface(
  requested_scope_id text,
  requested_surface_id text,
  expected_base_revision_id uuid,
  expected_publication_decision_id bigint,
  requested_document jsonb,
  requested_change_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  definition pac.surface_definitions%rowtype;
  current_state jsonb;
  current_base_revision_id uuid;
  current_decision_id bigint;
  next_revision_id uuid;
  next_revision_number integer;
  next_decision_id bigint;
  saved_document_hash text;
begin
  perform pac.assert_surface_request(requested_scope_id, requested_surface_id, true);
  perform pac.assert_valid_surface_document(requested_surface_id, requested_scope_id, requested_document);
  if requested_change_note is not null and length(btrim(requested_change_note)) > 1000 then
    raise exception 'The change note is too long' using errcode = '22023';
  end if;
  if length(btrim(coalesce(requested_change_note, ''))) > 0 then
    perform pac.assert_plain_page_text(requested_change_note);
  end if;

  perform pg_advisory_xact_lock(hashtextextended(requested_surface_id || ':' || requested_scope_id, 0));
  select * into strict definition from pac.surface_definitions
  where surface_id = requested_surface_id and active = true;
  current_state := pac.read_surface_editing_state(requested_scope_id, requested_surface_id);
  current_base_revision_id := nullif(current_state ->> 'expectedRevisionId', '')::uuid;
  current_decision_id := nullif(current_state #>> '{latestDecision,publicationDecisionId}', '')::bigint;
  if current_base_revision_id is distinct from expected_base_revision_id
    or current_decision_id is distinct from expected_publication_decision_id then
    raise exception 'Page wording or availability changed after it was opened' using errcode = '40001';
  end if;

  select coalesce(max(revision.revision_number), 0) + 1 into next_revision_number
  from pac.surface_revisions revision
  where revision.surface_id = requested_surface_id and revision.scope_id = requested_scope_id;
  insert into pac.surface_revisions (
    surface_id, scope_id, revision_number, document, change_note,
    required_review_dimensions, created_by, based_on_revision_id
  ) values (
    requested_surface_id, requested_scope_id, next_revision_number, requested_document,
    coalesce(nullif(btrim(requested_change_note), ''), 'Wording saved by the program owner.'),
    definition.required_review_dimensions, 'pac-consultant-workspace-owner', current_base_revision_id
  ) returning revision_id, document_sha256 into next_revision_id, saved_document_hash;

  insert into pac.surface_owner_approvals (
    revision_id, surface_id, scope_id, document_sha256, approval_basis, approved_by
  ) values (
    next_revision_id, requested_surface_id, requested_scope_id, saved_document_hash,
    'standing_owner_approval_on_input', 'pac-consultant-workspace-owner'
  );
  insert into pac.surface_publication_decisions (
    surface_id, scope_id, revision_id, decision, gate_snapshot, reason, decided_by
  ) values (
    requested_surface_id, requested_scope_id, next_revision_id, 'publish',
    jsonb_build_object(
      'ownerApprovedSave', true, 'explicitOwnerDecision', true,
      'replacedScopeDecisionId', current_decision_id,
      'basedOnRevisionId', current_base_revision_id
    ), 'Wording saved with the program owner''s standing approval.', 'pac-consultant-workspace-owner'
  ) returning publication_decision_id into next_decision_id;
  insert into pac.surface_change_events (
    surface_id, scope_id, revision_id, publication_decision_id, action, detail, actor_id, actor_role
  ) values (
    requested_surface_id, requested_scope_id, next_revision_id, next_decision_id, 'published',
    jsonb_build_object(
      'staffCopyChanged', true, 'ownerApprovedSave', true,
      'approvalBasis', 'standing_owner_approval_on_input',
      'automaticValidationCompleted', true,
      'independentFactualReviewPerformed', false,
      'independentAccessibilityAuditPerformed', false
    ), 'pac-consultant-workspace-owner', 'owner'
  );
  return pac.read_surface_editing_state(requested_scope_id, requested_surface_id);
end;
$$;

revoke all privileges on function pac.save_owner_approved_surface(text,text,uuid,bigint,jsonb,text) from public;
grant execute on function pac.save_owner_approved_surface(text,text,uuid,bigint,jsonb,text) to pac_app_runtime;
comment on function pac.save_owner_approved_surface(text,text,uuid,bigint,jsonb,text) is
  'Owner API only: validate and atomically save/publish exact scoped wording using standing owner approval, preserving immutable history and optimistic concurrency.';
commit;
