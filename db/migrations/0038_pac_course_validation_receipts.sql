-- Record structured course validation without claiming its authored HTML is plain text.
begin;
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
          'plainTextFormat', case when new.surface_id like 'course.%' then null else true end,
          'structuredCourseFormat', case when new.surface_id like 'course.%' then true else null end, 'safeLinkSyntax', true),
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

commit;
