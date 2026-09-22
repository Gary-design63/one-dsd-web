-- Named contributor resources. Existing owner functions and approval evidence remain intact.
-- No accounts, role memberships, invitations or activation evidence are created here.
begin;
alter table pac.content_revisions add column protected_authorization_id uuid references pac.protected_action_authorizations(authorization_id);
create index content_revisions_contributor_authorization_idx on pac.content_revisions(protected_authorization_id) where protected_authorization_id is not null;
alter table pac.review_records add column protected_authorization_id uuid references pac.protected_action_authorizations(authorization_id);
create index review_records_contributor_authorization_idx on pac.review_records(protected_authorization_id) where protected_authorization_id is not null;
alter table pac.publication_decisions add column protected_authorization_id uuid references pac.protected_action_authorizations(authorization_id);
create index publication_decisions_contributor_authorization_idx on pac.publication_decisions(protected_authorization_id) where protected_authorization_id is not null;
alter table pac.change_events add column protected_authorization_id uuid references pac.protected_action_authorizations(authorization_id);
create index change_events_contributor_authorization_idx on pac.change_events(protected_authorization_id) where protected_authorization_id is not null;

create or replace function pac.apply_contributor_resource_actor()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_authorization pac.protected_action_authorizations%rowtype;
  authorization_setting text;
  linked_content_item_id text;
  carried_review pac.review_records%rowtype;
begin
  authorization_setting := current_setting('pac.protected_authorization_id', true);
  if authorization_setting is null or authorization_setting = '' then
    return new;
  end if;
  if authorization_setting !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    raise exception 'Invalid transaction-local protected authorization'
      using errcode = '22023';
  end if;
  select stored_authorization.* into selected_authorization
  from pac.protected_action_authorizations stored_authorization
  join pac.protected_mutation_feature_evidence feature_evidence
    on feature_evidence.authorization_id = stored_authorization.authorization_id
  where stored_authorization.authorization_id = authorization_setting::uuid
    and feature_evidence.feature_key = 'protected_contribution'
    and feature_evidence.environment = stored_authorization.environment
    and stored_authorization.target_type = 'content_item'
    and stored_authorization.session_expires_at > clock_timestamp()
    and not exists (
      select 1 from pac.protected_action_consumptions consumption
      where consumption.authorization_id = stored_authorization.authorization_id
    );
  if selected_authorization.authorization_id is null then
    raise exception 'Named protected authorization is unavailable for attribution'
      using errcode = '42501';
  end if;

  if tg_table_name = 'content_revisions' then
    if selected_authorization.action_kind not in (
      'contribution_submit', 'publication_publish', 'publication_republish'
    ) or new.content_item_id <> selected_authorization.target_id then
      raise exception 'Named authorization does not match the content revision'
        using errcode = '42501';
    end if;
    perform pac.assert_exact_resource_scope(selected_authorization.requested_scope_id, new.canonical_payload);
    new.created_by := selected_authorization.account_id::text;
    new.protected_authorization_id := selected_authorization.authorization_id;
  elsif tg_table_name = 'review_records' then
    select revision.content_item_id into linked_content_item_id
    from pac.content_revisions revision
    where revision.revision_id = new.revision_id;
    if linked_content_item_id is distinct from selected_authorization.target_id
      or (
        new.status = 'pending'
        and (
          selected_authorization.action_kind <> 'contribution_submit'
          or new.reviewer_id is not null
        )
      )
      or (
        new.status <> 'pending'
        and selected_authorization.action_kind not in (
          'specialist_review', 'publication_publish', 'publication_republish'
        )
      ) then
      raise exception 'Named authorization does not match the review record'
        using errcode = '42501';
    end if;
    -- A pending row is an unassigned review requirement, not a completed act
    -- by the contributor who created the draft. Preserve that distinction.
    if new.status <> 'pending' then
      if selected_authorization.action_kind in ('publication_publish', 'publication_republish') then
        select source.* into carried_review from pac.review_records source
        join pac.content_revisions source_revision on source_revision.revision_id=source.revision_id
        join pac.content_revisions release_revision on release_revision.revision_id=new.revision_id
        where source.review_id=(new.findings->>'carried_forward_from_review_id')::uuid
          and source_revision.content_item_id=selected_authorization.target_id
          and release_revision.based_on_revision_id=source.revision_id
          and source.dimension=new.dimension and source.status=new.status;
        if carried_review.review_id is null then
          raise exception 'The carried review must identify its original decision' using errcode='42501';
        end if;
        new.reviewer_id := carried_review.reviewer_id;
        new.reviewer_role := carried_review.reviewer_role;
        new.findings := new.findings || jsonb_build_object('carried_forward_by', selected_authorization.account_id::text);
      else
        new.reviewer_id := selected_authorization.account_id::text;
        new.reviewer_role := selected_authorization.required_role_key;
      end if;
    end if;
    new.protected_authorization_id := selected_authorization.authorization_id;
  elsif tg_table_name = 'publication_decisions' then
    if selected_authorization.action_kind not in (
      'publication_publish', 'publication_withdraw', 'publication_republish'
    ) or new.content_item_id <> selected_authorization.target_id
      or new.scope_id <> selected_authorization.requested_scope_id then
      raise exception 'Named authorization does not match the publication decision'
        using errcode = '42501';
    end if;
    new.decided_by := selected_authorization.account_id::text;
    new.gate_snapshot := (
      new.gate_snapshot - 'explicit_owner_decision'
    ) || jsonb_build_object(
      'explicit_publishing_approval', true,
      'authorized_role', selected_authorization.required_role_key
    );
    new.protected_authorization_id := selected_authorization.authorization_id;
  elsif tg_table_name = 'change_events' then
    if new.object_id <> selected_authorization.target_id or new.scope_id <> selected_authorization.requested_scope_id then
      raise exception 'Named authorization does not match the change record'
        using errcode = '42501';
    end if;
    new.actor_id := selected_authorization.account_id::text;
    new.actor_role := selected_authorization.required_role_key;
    new.protected_authorization_id := selected_authorization.authorization_id;
  else
    raise exception 'Named actor trigger is attached to an unregistered table'
      using errcode = '55000';
  end if;
  return new;
end;
$$;
create trigger content_revisions_contributor_actor before insert on pac.content_revisions for each row execute function pac.apply_contributor_resource_actor();
create trigger review_records_contributor_actor before insert on pac.review_records for each row execute function pac.apply_contributor_resource_actor();
create trigger publication_decisions_contributor_actor before insert on pac.publication_decisions for each row execute function pac.apply_contributor_resource_actor();
create trigger change_events_contributor_actor before insert on pac.change_events for each row execute function pac.apply_contributor_resource_actor();

create or replace function pac.run_protected_content_mutation(
  requested_session_token_digest text,
  requested_environment text,
  requested_identity_evidence_id text,
  requested_identity_bundle_sha256 text,
  requested_feature_evidence_id text,
  requested_feature_bundle_sha256 text,
  requested_scope_id text,
  requested_operation text,
  requested_target_id text,
  requested_payload jsonb
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_authorization_id uuid;
  selected_activation_event_id bigint;
  required_role text;
  action_kind text;
  target_type text;
  result_record_type text;
  request_fingerprint text;
  result_payload jsonb;
  result_record_id text;
begin
  if requested_session_token_digest is null
    or requested_session_token_digest !~ '^[a-f0-9]{64}$'
    or requested_environment is null
    or requested_environment not in ('local', 'preview', 'production')
    or requested_identity_evidence_id is null
    or requested_identity_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_identity_bundle_sha256 is null
    or requested_identity_bundle_sha256 !~ '^[a-f0-9]{64}$'
    or requested_feature_evidence_id is null
    or requested_feature_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_feature_bundle_sha256 is null
    or requested_feature_bundle_sha256 !~ '^[a-f0-9]{64}$'
    or requested_scope_id is null
    or requested_scope_id not in ('one-dhs', 'dsd')
    or requested_operation is null
    or requested_target_id is null
    or requested_target_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$'
    or requested_payload is null
    or jsonb_typeof(requested_payload) is distinct from 'object' then
    raise exception 'Invalid protected content mutation boundary' using errcode = '22023';
  end if;

  case requested_operation
    when 'resource_draft_save' then
      perform pac.assert_exact_jsonb_keys(
        requested_payload,
        array['expectedRevisionId', 'fields', 'changeNote'],
        array['expectedRevisionId', 'fields', 'changeNote']
      );
      required_role := 'content_contributor';
      action_kind := 'contribution_submit';
      target_type := 'content_item';
      result_record_type := 'content_revision';
    when 'resource_review_record' then
      perform pac.assert_exact_jsonb_keys(
        requested_payload,
        array['revisionId', 'dimension', 'expectedPriorReviewId', 'decision', 'note'],
        array['revisionId', 'dimension', 'expectedPriorReviewId', 'decision', 'note']
      );
      required_role := 'program_steward';
      action_kind := 'specialist_review';
      target_type := 'content_item';
      result_record_type := 'review';
    when 'resource_publish', 'resource_withdraw', 'resource_republish' then
      if requested_operation = 'resource_withdraw' then
        perform pac.assert_exact_jsonb_keys(
          requested_payload,
          array['revisionId', 'expectedScopeDecisionId', 'reason'],
          array['revisionId', 'expectedScopeDecisionId', 'reason']
        );
        action_kind := 'publication_withdraw';
      else
        perform pac.assert_exact_jsonb_keys(
          requested_payload,
          array[
            'revisionId', 'expectedScopeDecisionId', 'reason', 'sensitivityClass',
            'unauthenticatedExposurePermitted', 'exposureReason'
          ],
          array[
            'revisionId', 'expectedScopeDecisionId', 'reason', 'sensitivityClass',
            'unauthenticatedExposurePermitted', 'exposureReason'
          ]
        );
        action_kind := case requested_operation
          when 'resource_publish' then 'publication_publish'
          else 'publication_republish'
        end;
      end if;
      required_role := 'publishing_approver';
      target_type := 'content_item';
      result_record_type := 'publication';
    else
      raise exception 'Protected content operation is not registered' using errcode = '22023';
  end case;

  if requested_operation = 'resource_draft_save'
    and (
      jsonb_typeof(requested_payload -> 'expectedRevisionId') is distinct from 'string'
      or requested_payload ->> 'expectedRevisionId'
        !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or jsonb_typeof(
        requested_payload -> 'fields'
      ) is distinct from 'object'
      or jsonb_typeof(requested_payload -> 'changeNote') not in ('string', 'null')
    ) then
    raise exception 'Protected draft payload has invalid value types' using errcode = '22023';
  end if;

  if requested_operation = 'resource_review_record'
    and (
      jsonb_typeof(requested_payload -> 'revisionId') is distinct from 'string'
      or requested_payload ->> 'revisionId'
        !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or jsonb_typeof(requested_payload -> 'dimension') is distinct from 'string'
      or requested_payload ->> 'dimension' not in (
        'language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement',
        'rights_and_consent', 'community_representation', 'legal_policy'
      )
      or jsonb_typeof(requested_payload -> 'expectedPriorReviewId') not in ('string', 'null')
      or (
        jsonb_typeof(requested_payload -> 'expectedPriorReviewId') = 'string'
        and requested_payload ->> 'expectedPriorReviewId'
          !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      )
      or jsonb_typeof(requested_payload -> 'decision') is distinct from 'string'
      or requested_payload ->> 'decision' not in ('pass', 'revise', 'blocked', 'not_applicable')
      or jsonb_typeof(requested_payload -> 'note') not in ('string', 'null')
    ) then
    raise exception 'Protected resource-review payload has invalid value types' using errcode = '22023';
  end if;

  if requested_operation in ('resource_publish', 'resource_republish')
    and (
      jsonb_typeof(requested_payload -> 'revisionId') is distinct from 'string'
      or requested_payload ->> 'revisionId'
        !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or jsonb_typeof(requested_payload -> 'expectedScopeDecisionId') not in ('string', 'null')
      or (
        jsonb_typeof(requested_payload -> 'expectedScopeDecisionId') = 'string'
        and requested_payload ->> 'expectedScopeDecisionId' !~ '^[0-9]{1,19}$'
      )
      or jsonb_typeof(requested_payload -> 'reason') is distinct from 'string'
      or jsonb_typeof(requested_payload -> 'sensitivityClass') is distinct from 'string'
      or requested_payload ->> 'sensitivityClass' not in ('S0', 'S1')
      or jsonb_typeof(requested_payload -> 'unauthenticatedExposurePermitted') is distinct from 'boolean'
      or requested_payload ->> 'unauthenticatedExposurePermitted' <> 'true'
      or jsonb_typeof(requested_payload -> 'exposureReason') is distinct from 'string'
    ) then
    raise exception 'Protected resource-publication payload has invalid value types' using errcode = '22023';
  end if;

  if requested_operation = 'resource_withdraw'
    and (
      jsonb_typeof(requested_payload -> 'revisionId') is distinct from 'string'
      or requested_payload ->> 'revisionId'
        !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or jsonb_typeof(requested_payload -> 'expectedScopeDecisionId') not in ('string', 'null')
      or (
        jsonb_typeof(requested_payload -> 'expectedScopeDecisionId') = 'string'
        and requested_payload ->> 'expectedScopeDecisionId' !~ '^[0-9]{1,19}$'
      )
      or jsonb_typeof(requested_payload -> 'reason') is distinct from 'string'
    ) then
    raise exception 'Protected resource-withdrawal payload has invalid value types' using errcode = '22023';
  end if;

  -- Hold a shared feature lock through authorization, mutation, attribution,
  -- and consumption. The activation recorder takes the matching exclusive
  -- lock, so an inactive event cannot return while an old-active widening
  -- publication is still able to commit behind it.
  perform pg_catalog.pg_advisory_xact_lock_shared(
    pg_catalog.hashtextextended(
      'pac-protected-feature:' || requested_environment || ':protected_contribution',
      0
    )
  );
  if not exists (
    select 1
    from pac.protected_feature_activation_events activation
    where activation.activation_event_id = (
      select max(current_event.activation_event_id)
      from pac.protected_feature_activation_events current_event
      where current_event.environment = requested_environment
        and current_event.feature_key = 'protected_contribution'
    )
      and (
        (
          activation.state = 'active'
          and activation.evidence_id = requested_feature_evidence_id
          and activation.activation_bundle_sha256 = requested_feature_bundle_sha256
        )
        or (
          -- An inactive control plane stops every exposure-widening mutation,
          -- but it must not strand an incident responder with harmful content
          -- still published. Containment remains limited to resource withdrawal
          -- operations, the publishing-approver grant checked below, and an
          -- evidence bundle that this environment previously activated.
          activation.state = 'inactive'
          and requested_operation = 'resource_withdraw'
          and exists (
            select 1
            from pac.protected_feature_activation_events prior_activation
            where prior_activation.environment = requested_environment
              and prior_activation.feature_key = 'protected_contribution'
              and prior_activation.state = 'active'
              and prior_activation.evidence_id = requested_feature_evidence_id
              and prior_activation.activation_bundle_sha256 = requested_feature_bundle_sha256
              and prior_activation.activation_event_id < activation.activation_event_id
          )
        )
      )
  ) then
    raise exception 'Protected contribution is not active under the database control plane'
      using errcode = 'PAF01';
  end if;
  select activation.activation_event_id into selected_activation_event_id
  from pac.protected_feature_activation_events activation
  where activation.activation_event_id = (
    select max(current_event.activation_event_id)
    from pac.protected_feature_activation_events current_event
    where current_event.environment = requested_environment
      and current_event.feature_key = 'protected_contribution'
  );

  request_fingerprint := pac.protected_action_fingerprint(
    action_kind,
    jsonb_build_object(
      'environment', requested_environment,
      'featureEvidenceId', requested_feature_evidence_id,
      'featureBundleSha256', requested_feature_bundle_sha256,
      'scopeId', requested_scope_id,
      'operation', requested_operation,
      'targetId', requested_target_id,
      'payload', requested_payload
    )
  );
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_identity_evidence_id,
    requested_identity_bundle_sha256,
    requested_scope_id,
    required_role,
    action_kind,
    target_type,
    requested_target_id,
    request_fingerprint
  );
  insert into pac.protected_mutation_feature_evidence (
    authorization_id, activation_event_id, feature_key, environment,
    evidence_id, activation_bundle_sha256
  ) values (
    created_authorization_id, selected_activation_event_id,
    'protected_contribution', requested_environment,
    requested_feature_evidence_id, requested_feature_bundle_sha256
  );
  perform pg_catalog.set_config(
    'pac.protected_authorization_id',
    created_authorization_id::text,
    true
  );

  if requested_operation = 'resource_draft_save' then
    select to_jsonb(created) into result_payload
    from pac.create_resource_draft(
      requested_scope_id,
      requested_target_id,
      (requested_payload ->> 'expectedRevisionId')::uuid,
      requested_payload -> 'fields',
      requested_payload ->> 'changeNote'
    ) created;
    result_record_id := result_payload ->> 'base_revision_id';
  elsif requested_operation = 'resource_review_record' then
    result_payload := pac.record_resource_review(
      requested_scope_id,
      requested_target_id,
      (requested_payload ->> 'revisionId')::uuid,
      requested_payload ->> 'dimension',
      (requested_payload ->> 'expectedPriorReviewId')::uuid,
      requested_payload ->> 'decision',
      requested_payload ->> 'note'
    );
    select review ->> 'reviewId' into result_record_id
    from jsonb_array_elements(coalesce(result_payload #> '{draft,reviews}', '[]'::jsonb)) review
    where review ->> 'dimension' = requested_payload ->> 'dimension'
    limit 1;
  elsif requested_operation = 'resource_publish' then
    result_payload := pac.publish_resource_draft(
      requested_scope_id,
      requested_target_id,
      (requested_payload ->> 'revisionId')::uuid,
      (requested_payload ->> 'expectedScopeDecisionId')::bigint,
      requested_payload ->> 'reason',
      requested_payload ->> 'sensitivityClass',
      (requested_payload ->> 'unauthenticatedExposurePermitted')::boolean,
      requested_payload ->> 'exposureReason'
    );
    result_record_id := result_payload ->> 'scopeDecisionId';
  elsif requested_operation = 'resource_withdraw' then
    result_payload := pac.withdraw_resource_publication(
      requested_scope_id,
      requested_target_id,
      (requested_payload ->> 'revisionId')::uuid,
      (requested_payload ->> 'expectedScopeDecisionId')::bigint,
      requested_payload ->> 'reason'
    );
    result_record_id := result_payload ->> 'scopeDecisionId';
  elsif requested_operation = 'resource_republish' then
    result_payload := pac.republish_resource_revision(
      requested_scope_id,
      requested_target_id,
      (requested_payload ->> 'revisionId')::uuid,
      (requested_payload ->> 'expectedScopeDecisionId')::bigint,
      requested_payload ->> 'reason',
      requested_payload ->> 'sensitivityClass',
      (requested_payload ->> 'unauthenticatedExposurePermitted')::boolean,
      requested_payload ->> 'exposureReason'
    );
    result_record_id := result_payload ->> 'scopeDecisionId';

  end if;

  if result_payload is null
    or result_record_id is null
    or result_record_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$' then
    raise exception 'Protected mutation did not produce a valid result record'
      using errcode = '40001';
  end if;
  if result_record_type = 'content_revision' then
    if result_record_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or not exists (
        select 1
        from pac.content_revisions revision
        where revision.revision_id = result_record_id::uuid
          and revision.content_item_id = requested_target_id
          and revision.protected_authorization_id = created_authorization_id
      ) then
      raise exception 'Protected revision result is not linked to its authorization'
        using errcode = '40001';
    end if;
  elsif result_record_type = 'review' then
    if result_record_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or not exists (
        select 1
        from pac.review_records review
        join pac.content_revisions revision on revision.revision_id = review.revision_id
        where review.review_id = result_record_id::uuid
          and revision.content_item_id = requested_target_id
          and review.protected_authorization_id = created_authorization_id
      ) then
      raise exception 'Protected review result is not linked to its authorization'
        using errcode = '40001';
    end if;
  elsif result_record_type = 'publication' then
    if result_record_id !~ '^[0-9]{1,19}$'
      or not exists (
        select 1
        from pac.publication_decisions decision
        where decision.publication_decision_id = result_record_id::bigint
          and decision.content_item_id = requested_target_id
          and decision.protected_authorization_id = created_authorization_id
      ) then
      raise exception 'Protected publication result is not linked to its authorization'
        using errcode = '40001';
    end if;
  else
    raise exception 'Protected mutation returned an unregistered result type'
      using errcode = '40001';
  end if;
  perform pac.consume_protected_action(
    created_authorization_id,
    result_record_type,
    result_record_id
  );
  perform pg_catalog.set_config('pac.protected_authorization_id', '', true);
  return result_payload;
end;
$$;

-- Reads do not allocate action authorizations. They require a current named session,
-- current scoped grant and matching committed identity/contribution activation.
create function pac.assert_contributor_resource_read(
  token_digest text, environment_name text, identity_evidence text, identity_hash text,
  contribution_evidence text, contribution_hash text, requested_scope text
) returns void language plpgsql volatile security definer
set search_path=pg_catalog,pac set row_security=off as $$
declare named_session record; activation pac.protected_feature_activation_events%rowtype; allowed boolean;
begin
  if requested_scope is null or requested_scope not in ('one-dhs','dsd')
    or contribution_evidence is null or contribution_evidence !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or contribution_hash is null or contribution_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid resource read boundary' using errcode='22023';
  end if;
  perform pg_advisory_xact_lock_shared(hashtextextended('pac-protected-feature:' || environment_name || ':protected_identity',0));
  perform pg_advisory_xact_lock_shared(hashtextextended('pac-protected-feature:' || environment_name || ':protected_contribution',0));
  if not exists (
    select 1 from pac.protected_feature_activation_events a
    where a.activation_event_id=(select max(b.activation_event_id) from pac.protected_feature_activation_events b
      where b.environment=environment_name and b.feature_key='protected_identity')
      and a.state='active' and a.evidence_id=identity_evidence and a.activation_bundle_sha256=identity_hash
  ) then raise exception 'Individual access is not active' using errcode='PAF01'; end if;
  select * into named_session from pac.read_program_account_session(token_digest,environment_name,identity_evidence,identity_hash);
  if named_session.session_id is null then raise exception 'A current individual session is required' using errcode='PAI01'; end if;
  select * into activation from pac.protected_feature_activation_events a
    where a.environment=environment_name and a.feature_key='protected_contribution'
    order by a.activation_event_id desc limit 1;
  if activation.activation_event_id is null or not (
    (activation.state='active' and activation.evidence_id=contribution_evidence and activation.activation_bundle_sha256=contribution_hash)
    or (activation.state='inactive' and exists(select 1 from pac.protected_feature_activation_events prior
      where prior.environment=environment_name and prior.feature_key='protected_contribution'
      and prior.state='active' and prior.evidence_id=contribution_evidence and prior.activation_bundle_sha256=contribution_hash
      and prior.activation_event_id<activation.activation_event_id))
  ) then raise exception 'Resource contributions are not active' using errcode='PAF01'; end if;
  with recursive ancestry as (
    select scope_id,parent_scope_id from pac.program_scopes where scope_id=requested_scope and active
    union all select p.scope_id,p.parent_scope_id from pac.program_scopes p join ancestry c on c.parent_scope_id=p.scope_id where p.active
  ) select exists(select 1 from ancestry a join pac.access_grants g on g.scope_id=a.scope_id
    where g.account_id=named_session.account_id and g.principal_id=named_session.account_id::text
    and g.environment=environment_name and g.grant_contract_version='protected-v1'
    and g.revoked_at is null and (g.expires_at is null or g.expires_at>clock_timestamp())
    and (g.role_key='publishing_approver' or (activation.state='active' and g.role_key in ('content_contributor','program_steward')))) into allowed;
  if not allowed then raise exception 'Current scoped contribution access is required' using errcode='PAA01'; end if;
end; $$;

create function pac.read_contributor_resource_editing_state(
  token_digest text, environment_name text, identity_evidence text, identity_hash text,
  contribution_evidence text, contribution_hash text, requested_scope text, requested_id text
) returns table(content_item_id text,published_revision_id uuid,base_revision_id uuid,editable_fields jsonb,has_unpublished_changes boolean)
language plpgsql volatile security definer set search_path=pg_catalog,pac set row_security=off as $$
begin
  perform pac.assert_contributor_resource_read(token_digest,environment_name,identity_evidence,identity_hash,contribution_evidence,contribution_hash,requested_scope);
  return query select * from pac.read_resource_editing_state(requested_scope,requested_id);
end; $$;
create function pac.read_contributor_resource_release_state(
  token_digest text, environment_name text, identity_evidence text, identity_hash text,
  contribution_evidence text, contribution_hash text, requested_scope text, requested_id text
) returns jsonb language plpgsql volatile security definer set search_path=pg_catalog,pac set row_security=off as $$
begin
  perform pac.assert_contributor_resource_read(token_digest,environment_name,identity_evidence,identity_hash,contribution_evidence,contribution_hash,requested_scope);
  return pac.read_resource_release_state(requested_scope,requested_id);
end; $$;
create function pac.list_contributor_resource_release_queue(
  token_digest text, environment_name text, identity_evidence text, identity_hash text,
  contribution_evidence text, contribution_hash text, requested_scope text
) returns table(content_item_id text,title text,has_draft boolean,ready_to_publish boolean,is_published boolean,changed_at timestamptz)
language plpgsql volatile security definer set search_path=pg_catalog,pac set row_security=off as $$
begin
  perform pac.assert_contributor_resource_read(token_digest,environment_name,identity_evidence,identity_hash,contribution_evidence,contribution_hash,requested_scope);
  return query select * from pac.list_resource_release_queue(requested_scope);
end; $$;

revoke all on function pac.apply_contributor_resource_actor() from public,pac_app_runtime,pac_contributor_runtime;
revoke all on function pac.assert_contributor_resource_read(text,text,text,text,text,text,text) from public,pac_app_runtime,pac_contributor_runtime;
revoke all on function pac.run_protected_content_mutation(text,text,text,text,text,text,text,text,text,jsonb) from public,pac_app_runtime;
revoke all on function pac.read_contributor_resource_editing_state(text,text,text,text,text,text,text,text) from public,pac_app_runtime;
revoke all on function pac.read_contributor_resource_release_state(text,text,text,text,text,text,text,text) from public,pac_app_runtime;
revoke all on function pac.list_contributor_resource_release_queue(text,text,text,text,text,text,text) from public,pac_app_runtime;
grant execute on function pac.run_protected_content_mutation(text,text,text,text,text,text,text,text,text,jsonb) to pac_contributor_runtime;
grant execute on function pac.read_contributor_resource_editing_state(text,text,text,text,text,text,text,text) to pac_contributor_runtime;
grant execute on function pac.read_contributor_resource_release_state(text,text,text,text,text,text,text,text) to pac_contributor_runtime;
grant execute on function pac.list_contributor_resource_release_queue(text,text,text,text,text,text,text) to pac_contributor_runtime;
commit;
