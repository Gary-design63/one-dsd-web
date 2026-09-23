begin;
-- Local adaptation: latest identity activation is checked inside every named session operation.
create or replace function pac.program_identity_activation_is_current(requested_environment text,requested_evidence_id text,requested_bundle_sha256 text)
returns boolean language plpgsql volatile security definer set search_path=pg_catalog,pac set row_security=off as $$ begin
if requested_environment is null or requested_environment not in ('local','preview','production') or requested_evidence_id is null or requested_bundle_sha256 is null then return false; end if;
perform pg_advisory_xact_lock_shared(hashtextextended('pac-protected-feature:' || requested_environment || ':protected_identity',0));
return exists(select 1 from pac.protected_feature_activation_events a where a.environment=requested_environment and a.feature_key='protected_identity'
and a.activation_event_id=(select max(b.activation_event_id) from pac.protected_feature_activation_events b where b.environment=requested_environment and b.feature_key='protected_identity')
and a.state='active' and a.evidence_id=requested_evidence_id and a.activation_bundle_sha256=requested_bundle_sha256); end; $$;
revoke all privileges on function pac.program_identity_activation_is_current(text,text,text) from public,pac_contributor_runtime,pac_authentication_broker;


-- Identity details are a guarded current projection. Every correction is an
-- individually authorized, append-only event tied to the stable account UUID.
alter table pac.program_accounts
  add column if not exists identity_version integer not null default 1
    check (identity_version >= 1);

alter table pac.protected_action_authorizations
  drop constraint if exists protected_action_authorizations_action_kind_check;
alter table pac.protected_action_authorizations
  add constraint protected_action_authorizations_action_kind_check check (
    action_kind in (
      'account_invite', 'credential_reset_invite', 'invitation_revoke',
      'account_suspend', 'account_reactivate', 'account_revoke',
      'account_identity_correct', 'grant_issue', 'grant_revoke',
      'contribution_submit', 'specialist_review', 'approval_record',
      'publication_publish', 'publication_withdraw', 'publication_republish',
      'correction_record', 'protected_upload', 'formal_compliance_record',
      'owner_transfer'
    )
  ) not valid;
alter table pac.protected_action_authorizations
  validate constraint protected_action_authorizations_action_kind_check;

alter table pac.protected_action_consumptions
  drop constraint if exists protected_action_consumptions_result_record_type_check;
alter table pac.protected_action_consumptions
  add constraint protected_action_consumptions_result_record_type_check check (
    result_record_type in (
      'account_state_event', 'account_identity_correction', 'owner_transfer',
      'invitation', 'grant', 'content_revision', 'review', 'publication',
      'source_object', 'compliance_record'
    )
  ) not valid;
alter table pac.protected_action_consumptions
  validate constraint protected_action_consumptions_result_record_type_check;

create table if not exists pac.program_account_identity_corrections (
  correction_id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('local', 'preview', 'production')),
  account_id uuid not null references pac.program_accounts(account_id),
  authorization_id uuid not null unique
    references pac.protected_action_authorizations(authorization_id),
  supersedes_correction_id uuid unique
    references pac.program_account_identity_corrections(correction_id),
  from_identity_version integer not null check (from_identity_version >= 1),
  to_identity_version integer not null,
  previous_sign_in_id text not null check (
    previous_sign_in_id = lower(previous_sign_in_id)
    and previous_sign_in_id ~ '^[a-z0-9][a-z0-9._-]{2,63}$'
  ),
  corrected_sign_in_id text not null check (
    corrected_sign_in_id = lower(corrected_sign_in_id)
    and corrected_sign_in_id ~ '^[a-z0-9][a-z0-9._-]{2,63}$'
  ),
  previous_display_name text not null check (
    char_length(previous_display_name) between 2 and 120
    and previous_display_name = btrim(previous_display_name)
    and previous_display_name !~ '[[:cntrl:]]'
  ),
  corrected_display_name text not null check (
    char_length(corrected_display_name) between 2 and 120
    and corrected_display_name = btrim(corrected_display_name)
    and corrected_display_name !~ '[[:cntrl:]]'
  ),
  reason text not null check (
    char_length(reason) between 3 and 500
    and reason = btrim(reason)
    and reason !~ '[[:cntrl:]]'
  ),
  corrected_at timestamptz not null default clock_timestamp(),
  correction_contract_version text not null default 'program-identity-correction-v1'
    check (correction_contract_version = 'program-identity-correction-v1'),
  unique (account_id, to_identity_version),
  check (to_identity_version = from_identity_version + 1),
  check (
    previous_sign_in_id is distinct from corrected_sign_in_id
    or previous_display_name is distinct from corrected_display_name
  )
);

create index if not exists program_identity_corrections_previous_sign_in_idx
  on pac.program_account_identity_corrections(environment, previous_sign_in_id);
create index if not exists program_identity_corrections_corrected_sign_in_idx
  on pac.program_account_identity_corrections(environment, corrected_sign_in_id);
create index if not exists program_identity_corrections_account_version_idx
  on pac.program_account_identity_corrections(account_id, to_identity_version desc);

alter table pac.program_account_identity_corrections enable row level security;
revoke all privileges on table pac.program_account_identity_corrections
  from public, pac_contributor_runtime;

do $$
declare
  role_name text;
begin
  foreach role_name in array array['pac_authentication_broker', 'anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      execute format(
        'revoke all privileges on table pac.program_account_identity_corrections from %I',
        role_name
      );
    end if;
  end loop;
end;
$$;

create or replace function pac.assert_protected_action_authorization_shape()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if not (
    (new.required_role_key = 'owner'
      and new.action_kind in ('account_invite', 'credential_reset_invite', 'invitation_revoke')
      and new.target_type = 'invitation')
    or (new.required_role_key = 'owner'
      and new.action_kind in (
        'account_suspend', 'account_reactivate', 'account_revoke',
        'account_identity_correct', 'owner_transfer'
      )
      and new.target_type = 'account')
    or (new.required_role_key = 'owner'
      and new.action_kind in ('grant_issue', 'grant_revoke')
      and new.target_type = 'grant')
    or (new.required_role_key in ('content_contributor', 'one_dsd_team_member')
      and new.action_kind = 'contribution_submit'
      and new.target_type = 'content_item')
    or (new.required_role_key = 'program_steward'
      and new.action_kind in ('specialist_review', 'correction_record')
      and new.target_type = 'content_item')
    or (new.required_role_key = 'publishing_approver'
      and new.action_kind = 'approval_record'
      and new.target_type = 'content_item')
    or (new.required_role_key = 'publishing_approver'
      and new.action_kind in ('publication_publish', 'publication_withdraw', 'publication_republish')
      and new.target_type = 'content_item')
    or (new.required_role_key = 'equity_director'
      and new.action_kind = 'protected_upload'
      and new.target_type = 'source_object')
    or (new.required_role_key = 'equity_director'
      and new.action_kind = 'formal_compliance_record'
      and new.target_type = 'compliance_record')
  ) then
    raise exception 'Protected action role, action, and target do not match the approved matrix'
      using errcode = '22023';
  end if;
  return new;
end;
$$;

create or replace function pac.assert_protected_action_consumption()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_authorization pac.protected_action_authorizations%rowtype;
begin
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = new.authorization_id
  for update;
  if selected_authorization.authorization_id is null
    or new.action_kind is distinct from selected_authorization.action_kind
    or new.requested_target_id is distinct from selected_authorization.target_id
    or not (
      (new.action_kind in ('account_suspend', 'account_reactivate', 'account_revoke')
        and new.result_record_type = 'account_state_event')
      or (new.action_kind = 'account_identity_correct'
        and new.result_record_type = 'account_identity_correction')
      or (new.action_kind = 'owner_transfer' and new.result_record_type = 'owner_transfer')
      or (new.action_kind in ('account_invite', 'credential_reset_invite', 'invitation_revoke')
        and new.result_record_type = 'invitation')
      or (new.action_kind in ('grant_issue', 'grant_revoke') and new.result_record_type = 'grant')
      or (new.action_kind in ('contribution_submit', 'correction_record')
        and new.result_record_type = 'content_revision')
      or (new.action_kind in ('specialist_review', 'approval_record') and new.result_record_type = 'review')
      or (new.action_kind in ('publication_publish', 'publication_withdraw', 'publication_republish')
        and new.result_record_type = 'publication')
      or (new.action_kind = 'protected_upload' and new.result_record_type = 'source_object')
      or (new.action_kind = 'formal_compliance_record' and new.result_record_type = 'compliance_record')
    ) then
    raise exception 'Protected action consumption does not match its authorization' using errcode = '22023';
  end if;
  return new;
end;
$$;

create or replace function pac.authorize_protected_action(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_scope_id text,
  requested_role_key text,
  requested_action_kind text,
  requested_target_type text,
  requested_target_id text,
  requested_fingerprint text
)
returns uuid
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_session pac.program_account_sessions%rowtype;
  selected_credential pac.program_account_credentials%rowtype;
  selected_grant pac.access_grants%rowtype;
  selected_grant_id uuid;
  created_authorization_id uuid;
begin
  if not pac.program_identity_activation_is_current(requested_environment,requested_activation_evidence_id,requested_activation_bundle_sha256) then raise exception 'Named program identity is not active in this environment' using errcode='42501'; end if;
  if requested_session_token_digest !~ '^[a-f0-9]{64}$'
    or requested_environment not in ('local', 'preview', 'production')
    or requested_activation_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_bundle_sha256 !~ '^[a-f0-9]{64}$'
    or requested_role_key not in (
      'content_contributor', 'program_steward', 'publishing_approver',
      'equity_director', 'one_dsd_team_member', 'owner'
    )
    or requested_action_kind not in (
      'account_invite', 'credential_reset_invite', 'invitation_revoke',
      'account_suspend', 'account_reactivate', 'account_revoke',
      'account_identity_correct', 'grant_issue', 'grant_revoke',
      'contribution_submit', 'specialist_review', 'approval_record',
      'publication_publish', 'publication_withdraw', 'publication_republish',
      'correction_record', 'protected_upload', 'formal_compliance_record',
      'owner_transfer'
    )
    or requested_target_type not in (
      'account', 'invitation', 'grant', 'content_item', 'content_revision', 'review',
      'publication', 'source_object', 'compliance_record'
    )
    or requested_target_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$'
    or requested_fingerprint !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid protected-action authorization request' using errcode = '22023';
  end if;

  select * into selected_session
  from pac.program_account_sessions session
  where session.token_digest = requested_session_token_digest
    and session.environment = requested_environment
    and session.activation_evidence_id = requested_activation_evidence_id
    and session.activation_bundle_sha256 = requested_activation_bundle_sha256;
  if selected_session.session_id is null then
    raise exception 'A verified individual session is required' using errcode = 'PAI01';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || selected_session.account_id::text, 0)
  );
  select * into selected_session
  from pac.program_account_sessions session
  where session.session_id = selected_session.session_id
  for update;
  select * into selected_credential
  from pac.program_account_credentials credential
  where credential.account_id = selected_session.account_id
  order by credential.credential_version desc
  limit 1;
  if selected_session.expires_at <= clock_timestamp()
    or selected_session.audience <> 'pac-protected-workspace'
    or exists (
      select 1 from pac.program_account_session_revocations revoked
      where revoked.session_id = selected_session.session_id
    )
    or not pac.program_account_is_active(selected_session.account_id)
    or not exists (
      select 1 from pac.program_accounts account
      where account.account_id = selected_session.account_id
        and account.environment = requested_environment
    )
    or selected_credential.credential_id is distinct from selected_session.credential_id
    or not exists (
      select 1 from pac.program_account_credential_secrets secret
      where secret.credential_id = selected_session.credential_id
    ) then
    raise exception 'The individual session is expired or revoked' using errcode = 'PAI01';
  end if;

  with recursive ancestry as (
    select scope.scope_id, scope.parent_scope_id, 0 as depth
    from pac.program_scopes scope
    where scope.scope_id = requested_scope_id and scope.active = true
    union all
    select parent.scope_id, parent.parent_scope_id, child.depth + 1
    from pac.program_scopes parent
    join ancestry child on child.parent_scope_id = parent.scope_id
    where parent.active = true
  )
  select grant_record.grant_id into selected_grant_id
  from ancestry
  join pac.access_grants grant_record on grant_record.scope_id = ancestry.scope_id
  where grant_record.account_id = selected_session.account_id
    and grant_record.environment = requested_environment
    and grant_record.principal_id = selected_session.account_id::text
    and grant_record.role_key = requested_role_key
    and grant_record.grant_contract_version = 'protected-v1'
    and grant_record.revoked_at is null
    and (grant_record.expires_at is null or grant_record.expires_at > clock_timestamp())
  order by ancestry.depth, grant_record.granted_at desc, grant_record.grant_id
  limit 1;
  if selected_grant_id is null then
    raise exception 'The individual does not hold the required role for this scope' using errcode = 'PAA01';
  end if;
  select * into selected_grant
  from pac.access_grants grant_record
  where grant_record.grant_id = selected_grant_id
  for update;
  if selected_grant.revoked_at is not null
    or (selected_grant.expires_at is not null and selected_grant.expires_at <= clock_timestamp())
    or selected_grant.account_id is distinct from selected_session.account_id
    or selected_grant.environment is distinct from requested_environment
    or selected_grant.role_key is distinct from requested_role_key then
    raise exception 'The required grant is no longer active' using errcode = 'PAA01';
  end if;

  insert into pac.protected_action_authorizations (
    account_id, session_id, credential_id, environment,
    activation_evidence_id, activation_bundle_sha256,
    session_issued_at, session_expires_at, grant_id, requested_scope_id,
    effective_grant_scope_id, required_role_key, effective_grant_role_key,
    action_kind, target_type, target_id, request_fingerprint
  ) values (
    selected_session.account_id, selected_session.session_id, selected_session.credential_id,
    selected_session.environment, selected_session.activation_evidence_id,
    selected_session.activation_bundle_sha256, selected_session.issued_at,
    selected_session.expires_at, selected_grant.grant_id, requested_scope_id,
    selected_grant.scope_id, requested_role_key, selected_grant.role_key,
    requested_action_kind, requested_target_type, requested_target_id, requested_fingerprint
  ) returning authorization_id into created_authorization_id;
  return created_authorization_id;
end;
$$;

create or replace function pac.consume_protected_action(
  requested_authorization_id uuid,
  requested_result_record_type text,
  requested_action_record_id text
)
returns void
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_authorization pac.protected_action_authorizations%rowtype;
begin
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = requested_authorization_id
  for update;
  if selected_authorization.authorization_id is null
    or requested_result_record_type not in (
      'account_state_event', 'account_identity_correction', 'owner_transfer',
      'invitation', 'grant', 'content_revision', 'review', 'publication',
      'source_object', 'compliance_record'
    )
    or requested_action_record_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$' then
    raise exception 'Invalid protected-action consumption' using errcode = '22023';
  end if;
  insert into pac.protected_action_consumptions (
    authorization_id, action_kind, result_record_type, requested_target_id, action_record_id
  ) values (
    selected_authorization.authorization_id, selected_authorization.action_kind,
    requested_result_record_type, selected_authorization.target_id, requested_action_record_id
  );
end;
$$;

-- A sign-in ID remains attached to the same stable account for its entire
-- history. New-account invitations cannot reserve an ID formerly held by any
-- account; an existing account may deliberately return to one of its own IDs.
create or replace function pac.assert_program_account_sign_in_reservation()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if tg_op = 'UPDATE' and new.sign_in_id is not distinct from old.sign_in_id then
    return new;
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'pac-program-sign-in:' || new.environment || ':' || new.sign_in_id,
      0
    )
  );
  if exists (
    select 1
    from pac.program_account_identity_corrections correction
    where correction.environment = new.environment
      and correction.account_id <> new.account_id
      and new.sign_in_id in (
        correction.previous_sign_in_id,
        correction.corrected_sign_in_id
      )
  ) then
    raise exception 'The requested sign-in identifier belongs to another account history'
      using errcode = '23505';
  end if;
  return new;
end;
$$;

drop trigger if exists program_account_sign_in_reservation_guard on pac.program_accounts;
create trigger program_account_sign_in_reservation_guard
before insert or update of sign_in_id on pac.program_accounts
for each row execute function pac.assert_program_account_sign_in_reservation();

create or replace function pac.assert_program_invitation_sign_in_reservation()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if new.invitation_type not in ('bootstrap_owner', 'new_account') then
    return new;
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'pac-program-sign-in:' || new.environment || ':' || new.sign_in_id,
      0
    )
  );
  if exists (
    select 1
    from pac.program_account_identity_corrections correction
    where correction.environment = new.environment
      and new.sign_in_id in (
        correction.previous_sign_in_id,
        correction.corrected_sign_in_id
      )
  ) then
    raise exception 'The requested sign-in identifier is retained in account history'
      using errcode = '23505';
  end if;
  return new;
end;
$$;

drop trigger if exists program_invitation_sign_in_reservation_guard
  on pac.program_account_invitations;
create trigger program_invitation_sign_in_reservation_guard
before insert on pac.program_account_invitations
for each row execute function pac.assert_program_invitation_sign_in_reservation();

-- Replace the blanket account immutability rule with an exact correction-only
-- projection guard. Every other account mutation remains impossible.
drop trigger if exists immutable_guard on pac.program_accounts;

create or replace function pac.assert_program_account_identity_projection()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Program accounts are retained' using errcode = '55000';
  end if;
  if new.identity_version <> old.identity_version + 1
    or (to_jsonb(new) - array['sign_in_id', 'display_name', 'identity_version'])
      is distinct from
      (to_jsonb(old) - array['sign_in_id', 'display_name', 'identity_version'])
    or not exists (
      select 1
      from pac.program_account_identity_corrections correction
      where correction.account_id = old.account_id
        and correction.environment = old.environment
        and correction.from_identity_version = old.identity_version
        and correction.to_identity_version = new.identity_version
        and correction.previous_sign_in_id = old.sign_in_id
        and correction.corrected_sign_in_id = new.sign_in_id
        and correction.previous_display_name = old.display_name
        and correction.corrected_display_name = new.display_name
    ) then
    raise exception 'A program account permits only an authorized identity projection update'
      using errcode = '55000';
  end if;
  return new;
end;
$$;

create trigger immutable_guard
before update or delete on pac.program_accounts
for each row execute function pac.assert_program_account_identity_projection();

drop trigger if exists immutable_guard on pac.program_account_identity_corrections;
create trigger immutable_guard
before update or delete on pac.program_account_identity_corrections
for each row execute function pac.prevent_immutable_change();

create or replace function pac.validate_program_account_identity_correction()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  expected_previous_id uuid;
  expected_fingerprint text;
begin
  select correction.correction_id into expected_previous_id
  from pac.program_account_identity_corrections correction
  where correction.account_id = new.account_id
    and correction.to_identity_version = new.from_identity_version;

  expected_fingerprint := pac.protected_action_fingerprint(
    'account_identity_correct',
    jsonb_build_object(
      'environment', new.environment,
      'accountId', new.account_id,
      'expectedIdentityVersion', new.from_identity_version,
      'currentSignInId', new.previous_sign_in_id,
      'correctedSignInId', new.corrected_sign_in_id,
      'correctedDisplayName', new.corrected_display_name,
      'reason', new.reason
    )
  );

  if (new.from_identity_version = 1 and new.supersedes_correction_id is not null)
    or (new.from_identity_version > 1 and (
      expected_previous_id is null
      or new.supersedes_correction_id is distinct from expected_previous_id
    ))
    or not exists (
      select 1
      from pac.program_accounts account
      where account.account_id = new.account_id
        and account.environment = new.environment
        and account.identity_version = new.to_identity_version
        and account.sign_in_id = new.corrected_sign_in_id
        and account.display_name = new.corrected_display_name
    )
    or not exists (
      select 1
      from pac.protected_action_authorizations authorized
      join pac.protected_action_consumptions consumption
        on consumption.authorization_id = authorized.authorization_id
      where authorized.authorization_id = new.authorization_id
        and authorized.environment = new.environment
        and authorized.requested_scope_id = 'one-dhs-pac'
        and authorized.required_role_key = 'owner'
        and authorized.action_kind = 'account_identity_correct'
        and authorized.target_type = 'account'
        and authorized.target_id = new.account_id::text
        and authorized.request_fingerprint = expected_fingerprint
        and consumption.result_record_type = 'account_identity_correction'
        and consumption.action_record_id = new.correction_id::text
    ) then
    raise exception 'Identity correction evidence is incomplete or inconsistent'
      using errcode = '55000';
  end if;
  return null;
end;
$$;

drop trigger if exists program_identity_correction_commit_guard
  on pac.program_account_identity_corrections;
create constraint trigger program_identity_correction_commit_guard
after insert on pac.program_account_identity_corrections
deferrable initially deferred
for each row execute function pac.validate_program_account_identity_correction();

create or replace function pac.correct_program_account_identity(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_account_id uuid,
  requested_identity_version integer,
  requested_current_sign_in_id text,
  requested_corrected_sign_in_id text,
  requested_corrected_display_name text,
  requested_reason text
)
returns table (
  correction_id uuid,
  account_id uuid,
  identity_version integer,
  sign_in_id text,
  display_name text,
  corrected_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_correction_id uuid := gen_random_uuid();
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
  selected_account pac.program_accounts%rowtype;
  previous_correction_id uuid;
  correction_time timestamptz := clock_timestamp();
begin
  if requested_environment not in ('local', 'preview', 'production')
    or requested_identity_version is null
    or requested_identity_version < 1
    or requested_current_sign_in_id is null
    or requested_current_sign_in_id <> lower(requested_current_sign_in_id)
    or requested_current_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    or requested_corrected_sign_in_id is null
    or requested_corrected_sign_in_id <> lower(requested_corrected_sign_in_id)
    or requested_corrected_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    or requested_corrected_display_name is null
    or requested_corrected_display_name <> btrim(requested_corrected_display_name)
    or char_length(requested_corrected_display_name) not between 2 and 120
    or requested_corrected_display_name ~ '[[:cntrl:]]'
    or requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 500
    or requested_reason ~ '[[:cntrl:]]' then
    raise exception 'Invalid identity-correction request' using errcode = '22023';
  end if;

  if requested_current_sign_in_id <> requested_corrected_sign_in_id then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        'pac-program-sign-in:' || requested_environment || ':' || requested_corrected_sign_in_id,
        0
      )
    );
  end if;

  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'one-dhs-pac',
    'owner',
    'account_identity_correct',
    'account',
    requested_account_id::text,
    pac.protected_action_fingerprint(
      'account_identity_correct',
      jsonb_build_object(
        'environment', requested_environment,
        'accountId', requested_account_id,
        'expectedIdentityVersion', requested_identity_version,
        'currentSignInId', requested_current_sign_in_id,
        'correctedSignInId', requested_corrected_sign_in_id,
        'correctedDisplayName', requested_corrected_display_name,
        'reason', requested_reason
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations authorized
  where authorized.authorization_id = created_authorization_id;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_account_id::text, 0)
  );
  select * into selected_account
  from pac.program_accounts account
  where account.account_id = requested_account_id
  for update;
  if selected_account.account_id is null
    or selected_account.environment <> requested_environment then
    raise exception 'The account is not available in this environment' using errcode = 'P0002';
  end if;
  if selected_account.identity_version <> requested_identity_version
    or selected_account.sign_in_id <> requested_current_sign_in_id then
    raise exception 'The account identity changed while the correction was prepared'
      using errcode = '40001';
  end if;
  if selected_account.sign_in_id = requested_corrected_sign_in_id
    and selected_account.display_name = requested_corrected_display_name then
    raise exception 'An identity correction must change the sign-in ID or display name'
      using errcode = '22023';
  end if;

  if selected_account.sign_in_id <> requested_corrected_sign_in_id then
    if exists (
      select 1
      from pac.program_accounts account
      where account.environment = requested_environment
        and account.sign_in_id = requested_corrected_sign_in_id
        and account.account_id <> requested_account_id
    ) or exists (
      select 1
      from pac.program_account_identity_corrections prior
      where prior.environment = requested_environment
        and prior.account_id <> requested_account_id
        and requested_corrected_sign_in_id in (
          prior.previous_sign_in_id,
          prior.corrected_sign_in_id
        )
    ) or exists (
      select 1
      from pac.program_account_invitations invitation
      join pac.program_account_invitation_secrets secret
        on secret.invitation_id = invitation.invitation_id
      where invitation.environment = requested_environment
        and invitation.invitation_type in ('bootstrap_owner', 'new_account')
        and invitation.sign_in_id = requested_corrected_sign_in_id
        and secret.expires_at > clock_timestamp()
        and not exists (
          select 1 from pac.program_account_invitation_closures closure
          where closure.invitation_id = invitation.invitation_id
        )
    ) then
      raise exception 'The requested sign-in identifier is not available' using errcode = '23505';
    end if;
  end if;

  select prior.correction_id into previous_correction_id
  from pac.program_account_identity_corrections prior
  where prior.account_id = requested_account_id
    and prior.to_identity_version = requested_identity_version;

  insert into pac.program_account_identity_corrections (
    correction_id, environment, account_id, authorization_id,
    supersedes_correction_id, from_identity_version, to_identity_version,
    previous_sign_in_id, corrected_sign_in_id,
    previous_display_name, corrected_display_name, reason, corrected_at
  ) values (
    created_correction_id, requested_environment, requested_account_id,
    created_authorization_id, previous_correction_id, requested_identity_version,
    requested_identity_version + 1, selected_account.sign_in_id,
    requested_corrected_sign_in_id, selected_account.display_name,
    requested_corrected_display_name, requested_reason, correction_time
  );

  update pac.program_accounts account
  set sign_in_id = requested_corrected_sign_in_id,
      display_name = requested_corrected_display_name,
      identity_version = requested_identity_version + 1
  where account.account_id = requested_account_id;

  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, closed_by_account_id, closed_by_session_id, reason
  )
  select invitation.invitation_id, 'revoked', selected_authorization.account_id,
    selected_authorization.session_id,
    'Account identity was corrected; every earlier reset or recovery code was invalidated.'
  from pac.program_account_invitations invitation
  join pac.program_account_invitation_secrets secret
    on secret.invitation_id = invitation.invitation_id
  where invitation.invitation_type in ('credential_reset', 'owner_recovery')
    and invitation.target_account_id = requested_account_id
    and invitation.environment = requested_environment
    and not exists (
      select 1 from pac.program_account_invitation_closures closure
      where closure.invitation_id = invitation.invitation_id
    )
  on conflict on constraint program_account_invitation_closures_pkey do nothing;

  delete from pac.program_account_invitation_secrets secret
  using pac.program_account_invitations invitation,
    pac.program_account_invitation_closures closure
  where secret.invitation_id = invitation.invitation_id
    and closure.invitation_id = invitation.invitation_id
    and invitation.invitation_type in ('credential_reset', 'owner_recovery')
    and invitation.target_account_id = requested_account_id
    and invitation.environment = requested_environment;

  insert into pac.program_account_session_revocations (
    session_id, reason, revoked_by_account_id, revoked_by_session_id
  )
  select session.session_id,
    'Account identity was corrected; sign in again with the current sign-in ID.',
    selected_authorization.account_id,
    selected_authorization.session_id
  from pac.program_account_sessions session
  where session.account_id = requested_account_id
    and not exists (
      select 1 from pac.program_account_session_revocations revoked
      where revoked.session_id = session.session_id
    );

  perform pac.consume_protected_action(
    created_authorization_id,
    'account_identity_correction',
    created_correction_id::text
  );
  return query select
    created_correction_id,
    requested_account_id,
    requested_identity_version + 1,
    requested_corrected_sign_in_id,
    requested_corrected_display_name,
    correction_time;
end;
$$;

-- Ownership transfer binds the owner's typed successor identity to immutable
-- evidence and rechecks it while holding the successor account lock. An
-- identity correction racing the transfer therefore produces a retryable
-- refusal instead of transferring authority to a changed projection.
drop function if exists pac.transfer_program_owner(
  text, text, text, text, uuid, text
);
drop function if exists pac.transfer_program_owner(
  text, text, text, text, uuid, integer, text, text
);

create function pac.transfer_program_owner(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_successor_account_id uuid,
  requested_successor_identity_version integer,
  requested_confirm_sign_in_id text,
  requested_reason text
)
returns table (
  transfer_id uuid,
  from_account_id uuid,
  to_account_id uuid,
  transferred_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
  current_owner_grant pac.access_grants%rowtype;
  successor_account pac.program_accounts%rowtype;
  successor_grant_id uuid := gen_random_uuid();
  created_transfer pac.program_owner_transfers%rowtype;
begin
  if requested_environment is null
    or requested_environment not in ('local', 'preview', 'production')
    or requested_successor_account_id is null
    or requested_successor_identity_version is null
    or requested_successor_identity_version < 1
    or requested_confirm_sign_in_id is null
    or requested_confirm_sign_in_id <> lower(requested_confirm_sign_in_id)
    or requested_confirm_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    or requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 471
    or requested_reason ~ '[[:cntrl:]]' then
    raise exception 'Invalid owner-transfer request' using errcode = '22023';
  end if;
  -- Recovery uses this same first lock. Keeping one global ordering prevents a
  -- transfer/recovery advisory-lock and owner-grant row-lock deadlock.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-owner:' || requested_environment, 0)
  );
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'one-dhs-pac',
    'owner',
    'owner_transfer',
    'account',
    requested_successor_account_id::text,
    pac.protected_action_fingerprint(
      'owner_transfer',
      jsonb_build_object(
        'successorAccountId', requested_successor_account_id,
        'successorIdentityVersion', requested_successor_identity_version,
        'confirmSignInId', requested_confirm_sign_in_id,
        'reason', requested_reason,
        'environment', requested_environment
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  if requested_successor_account_id = selected_authorization.account_id then
    raise exception 'The successor must be a different named account' using errcode = '22023';
  end if;
  select * into current_owner_grant
  from pac.access_grants grant_record
  where grant_record.grant_id = selected_authorization.grant_id
    and grant_record.account_id = selected_authorization.account_id
    and grant_record.environment = requested_environment
    and grant_record.scope_id = 'one-dhs-pac'
    and grant_record.role_key = 'owner'
    and grant_record.grant_contract_version = 'protected-v1'
    and grant_record.revoked_at is null
  for update;
  if current_owner_grant.grant_id is null then
    raise exception 'The current owner authority is no longer active' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_successor_account_id::text, 0)
  );
  select * into successor_account
  from pac.program_accounts account
  where account.account_id = requested_successor_account_id
    and account.environment = requested_environment
  for update;
  if successor_account.account_id is null
    or not pac.program_account_is_active(requested_successor_account_id) then
    raise exception 'The successor account must be active in this environment' using errcode = '42501';
  end if;
  if successor_account.identity_version <> requested_successor_identity_version
    or successor_account.sign_in_id <> requested_confirm_sign_in_id then
    raise exception 'The successor identity changed while the transfer was prepared'
      using errcode = '40001';
  end if;

  update pac.access_grants
  set revoked_at = clock_timestamp(),
      revoked_by = selected_authorization.account_id::text,
      revoked_by_account_id = selected_authorization.account_id,
      revoked_by_session_id = selected_authorization.session_id,
      revocation_reason = 'Owner authority transferred: ' || requested_reason
  where grant_id = current_owner_grant.grant_id
    and revoked_at is null;
  if not found then
    raise exception 'The owner authority changed during transfer' using errcode = '40001';
  end if;

  insert into pac.access_grants (
    grant_id, principal_id, scope_id, role_key, granted_by, account_id,
    environment, issued_by_account_id, issued_by_session_id, grant_reason,
    grant_contract_version
  ) values (
    successor_grant_id,
    successor_account.account_id::text,
    'one-dhs-pac',
    'owner',
    selected_authorization.account_id::text,
    successor_account.account_id,
    requested_environment,
    selected_authorization.account_id,
    selected_authorization.session_id,
    'Owner authority transferred: ' || requested_reason,
    'protected-v1'
  );

  insert into pac.program_owner_transfers (
    environment, authorization_id, from_account_id, to_account_id,
    from_grant_id, to_grant_id, reason
  ) values (
    requested_environment,
    created_authorization_id,
    selected_authorization.account_id,
    successor_account.account_id,
    current_owner_grant.grant_id,
    successor_grant_id,
    requested_reason
  ) returning * into created_transfer;

  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, closed_by_account_id, closed_by_session_id, reason
  )
  select invitation.invitation_id,
    'revoked',
    selected_authorization.account_id,
    selected_authorization.session_id,
    'Owner authority transferred; every unaccepted code issued by the outgoing owner was invalidated.'
  from pac.program_account_invitations invitation
  join pac.program_account_invitation_secrets secret
    on secret.invitation_id = invitation.invitation_id
  left join pac.protected_action_authorizations issuer
    on issuer.authorization_id = invitation.issued_by_authorization_id
  where invitation.environment = requested_environment
    and (
      issuer.account_id = selected_authorization.account_id
      or invitation.invitation_type = 'owner_recovery'
    )
    and not exists (
      select 1 from pac.program_account_invitation_closures closure
      where closure.invitation_id = invitation.invitation_id
    )
  on conflict on constraint program_account_invitation_closures_pkey do nothing;
  delete from pac.program_account_invitation_secrets secret
  using pac.program_account_invitations invitation,
    pac.program_account_invitation_closures closure
  where secret.invitation_id = invitation.invitation_id
    and closure.invitation_id = invitation.invitation_id
    and invitation.environment = requested_environment
    and closure.outcome = 'revoked'
    and closure.closed_by_account_id = selected_authorization.account_id
    and closure.closed_by_session_id = selected_authorization.session_id;

  insert into pac.program_account_session_revocations (
    session_id, reason, revoked_by_account_id, revoked_by_session_id
  )
  select session.session_id,
    'Owner authority transferred; a fresh named sign-in is required.',
    selected_authorization.account_id,
    selected_authorization.session_id
  from pac.program_account_sessions session
  where session.account_id in (
      selected_authorization.account_id,
      successor_account.account_id
    )
    and not exists (
      select 1 from pac.program_account_session_revocations revoked
      where revoked.session_id = session.session_id
    );
  perform pac.consume_protected_action(
    created_authorization_id,
    'owner_transfer',
    created_transfer.transfer_id::text
  );
  return query select
    created_transfer.transfer_id,
    created_transfer.from_account_id,
    created_transfer.to_account_id,
    created_transfer.transferred_at;
end;
$$;

-- A credential lookup carries the identity version into session creation.
-- Rechecking the sign-in ID and version under the account lock closes the
-- lookup-versus-correction race without exposing correction history.
drop function if exists pac.attest_program_identity_runtime_boundary();
drop function if exists pac_auth.attest_authentication_broker_boundary();
drop function if exists pac_auth.start_program_account_session(
  uuid, uuid, text, text, text, text
);
drop function if exists pac_auth.start_program_account_session(
  uuid, uuid, text, integer, text, text, text, text
);
drop function if exists pac_auth.lookup_program_login_credential(text, text);
drop function if exists pac.start_program_account_session(
  uuid, uuid, text, text, text, text
);
drop function if exists pac.start_program_account_session(
  uuid, uuid, text, integer, text, text, text, text
);
drop function if exists pac.lookup_program_login_credential(text, text);

create function pac.lookup_program_login_credential(
  requested_sign_in_id text,
  requested_environment text
)
returns table (
  account_id uuid,
  display_name text,
  credential_id uuid,
  credential_hash text,
  identity_version integer
)
language plpgsql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if requested_sign_in_id is null
    or requested_sign_in_id <> lower(requested_sign_in_id)
    or requested_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    or requested_environment not in ('local', 'preview', 'production') then
    return;
  end if;
  return query
  select account.account_id, account.display_name, credential.credential_id,
    secret.credential_hash, account.identity_version
  from pac.program_accounts account
  join lateral (
    select stored.*
    from pac.program_account_credentials stored
    where stored.account_id = account.account_id
    order by stored.credential_version desc
    limit 1
  ) credential on true
  join pac.program_account_credential_secrets secret
    on secret.credential_id = credential.credential_id
  where account.sign_in_id = requested_sign_in_id
    and account.environment = requested_environment
    and pac.program_account_is_active(account.account_id);
end;
$$;

create function pac.start_program_account_session(
  requested_account_id uuid,
  requested_credential_id uuid,
  requested_sign_in_id text,
  requested_identity_version integer,
  requested_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text
)
returns table (
  session_id uuid,
  account_id uuid,
  display_name text,
  expires_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_account pac.program_accounts%rowtype;
  selected_credential pac.program_account_credentials%rowtype;
  created_session pac.program_account_sessions%rowtype;
begin
  if not pac.program_identity_activation_is_current(requested_environment,requested_activation_evidence_id,requested_activation_bundle_sha256) then raise exception 'Named program identity is not active in this environment' using errcode='42501'; end if;
  if requested_sign_in_id is null
    or requested_sign_in_id <> lower(requested_sign_in_id)
    or requested_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    or requested_identity_version is null
    or requested_identity_version < 1
    or requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_environment not in ('local', 'preview', 'production')
    or requested_activation_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_bundle_sha256 !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid protected-session request' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_account_id::text, 0)
  );
  select * into selected_account
  from pac.program_accounts account
  where account.account_id = requested_account_id
  for update;
  select * into selected_credential
  from pac.program_account_credentials credential
  where credential.account_id = requested_account_id
  order by credential.credential_version desc
  limit 1;
  if selected_account.account_id is null
    or selected_account.environment <> requested_environment
    or selected_account.sign_in_id <> requested_sign_in_id
    or selected_account.identity_version <> requested_identity_version
    or not pac.program_account_is_active(requested_account_id)
    or selected_credential.credential_id is distinct from requested_credential_id
    or not exists (
      select 1 from pac.program_account_credential_secrets secret
      where secret.credential_id = requested_credential_id
    ) then
    raise exception 'Protected sign-in is not available' using errcode = '42501';
  end if;
  insert into pac.program_account_sessions (
    account_id, credential_id, token_digest, audience, environment,
    activation_evidence_id, activation_bundle_sha256, expires_at
  ) values (
    requested_account_id, requested_credential_id, requested_token_digest,
    'pac-protected-workspace', requested_environment,
    requested_activation_evidence_id, requested_activation_bundle_sha256,
    clock_timestamp() + interval '8 hours'
  ) returning * into created_session;
  return query select
    created_session.session_id,
    selected_account.account_id,
    selected_account.display_name,
    created_session.expires_at;
end;
$$;

create function pac_auth.lookup_program_login_credential(
  requested_sign_in_id text,
  requested_environment text
)
returns table (
  account_id uuid,
  display_name text,
  credential_id uuid,
  credential_hash text,
  identity_version integer
)
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select *
  from pac.lookup_program_login_credential(
    requested_sign_in_id,
    requested_environment
  );
$$;

create function pac_auth.start_program_account_session(
  requested_account_id uuid,
  requested_credential_id uuid,
  requested_sign_in_id text,
  requested_identity_version integer,
  requested_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text
)
returns table (
  session_id uuid,
  account_id uuid,
  display_name text,
  expires_at timestamptz
)
language sql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select *
  from pac.start_program_account_session(
    requested_account_id,
    requested_credential_id,
    requested_sign_in_id,
    requested_identity_version,
    requested_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256
  );
$$;

drop trigger if exists close_expired_program_grant_before_issue
  on pac.access_grants;
drop function if exists pac.close_expired_program_grant_before_issue();

-- A replacement permission closes an expired predecessor through the ordinary
-- exact-target revocation operation. Both records therefore have their own
-- authorization, fingerprint, and consumption evidence inside one transaction.
create or replace function pac.issue_program_access_grant(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_account_id uuid,
  requested_scope_id text,
  requested_role_key text,
  requested_expires_at timestamptz,
  requested_reason text
)
returns table (
  grant_id uuid,
  account_id uuid,
  scope_id text,
  role_key text,
  granted_at timestamptz,
  expires_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_grant_id uuid := gen_random_uuid();
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
  created_grant pac.access_grants%rowtype;
  expired_predecessor_id uuid;
begin
  if requested_role_key not in (
      'content_contributor', 'program_steward', 'publishing_approver',
      'one_dsd_team_member'
    )
    or (
      requested_role_key in ('content_contributor', 'program_steward', 'publishing_approver')
      and requested_scope_id not in ('one-dhs', 'dsd')
    )
    or (requested_role_key = 'one_dsd_team_member' and requested_scope_id <> 'one-dsd-team')
    or requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 500
    or requested_reason ~ '[[:cntrl:]]'
    or (requested_expires_at is not null and requested_expires_at <= clock_timestamp()) then
    raise exception 'Invalid role/scope grant request' using errcode = '22023';
  end if;
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    requested_scope_id,
    'owner',
    'grant_issue',
    'grant',
    created_grant_id::text,
    pac.protected_action_fingerprint(
      'grant_issue',
      jsonb_build_object(
        'environment', requested_environment,
        'grantId', created_grant_id,
        'accountId', requested_account_id,
        'scopeId', requested_scope_id,
        'roleKey', requested_role_key,
        'expiresAt', requested_expires_at,
        'reason', requested_reason
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_account_id::text, 0)
  );
  if not exists (
    select 1 from pac.program_accounts account
    where account.account_id = requested_account_id
      and account.environment = requested_environment
  ) or not pac.program_account_is_active(requested_account_id) then
    raise exception 'The account is not active' using errcode = '42501';
  end if;

  select grant_record.grant_id into expired_predecessor_id
  from pac.access_grants grant_record
  where grant_record.account_id = requested_account_id
    and grant_record.environment = requested_environment
    and grant_record.scope_id = requested_scope_id
    and grant_record.role_key = requested_role_key
    and grant_record.grant_contract_version = 'protected-v1'
    and grant_record.revoked_at is null
    and grant_record.expires_at <= clock_timestamp()
  for update;
  if expired_predecessor_id is not null then
    perform pac.revoke_program_access_grant(
      requested_session_token_digest,
      requested_environment,
      requested_activation_evidence_id,
      requested_activation_bundle_sha256,
      expired_predecessor_id,
      'Expired permission closed atomically before its replacement was issued.'
    );
  end if;

  insert into pac.access_grants (
    grant_id, principal_id, scope_id, role_key, granted_by, account_id, environment,
    expires_at, issued_by_account_id, issued_by_session_id, grant_reason,
    grant_contract_version
  ) values (
    created_grant_id,
    requested_account_id::text,
    requested_scope_id,
    requested_role_key,
    selected_authorization.account_id::text,
    requested_account_id,
    requested_environment,
    requested_expires_at,
    selected_authorization.account_id,
    selected_authorization.session_id,
    requested_reason,
    'protected-v1'
  ) returning * into created_grant;
  perform pac.consume_protected_action(created_authorization_id, 'grant', created_grant_id::text);
  return query select
    created_grant.grant_id,
    created_grant.account_id,
    created_grant.scope_id,
    created_grant.role_key,
    created_grant.granted_at,
    created_grant.expires_at;
end;
$$;

-- Permanent revocation destroys the usable credential verifier. It therefore
-- requires a separately supplied, exact current sign-in ID and binds that
-- confirmation into the protected-action fingerprint.
drop function if exists pac.change_program_account_state(
  text, text, text, text, uuid, text, text
);
drop function if exists pac.change_program_account_state(
  text, text, text, text, uuid, text, text, text
);

create function pac.change_program_account_state(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_account_id uuid,
  requested_state text,
  requested_reason text,
  requested_confirm_sign_in_id text
)
returns table (account_state_event_id bigint, state text, recorded_at timestamptz)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  action_kind text;
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
  selected_account pac.program_accounts%rowtype;
  current_event pac.program_account_state_events%rowtype;
  created_event pac.program_account_state_events%rowtype;
begin
  action_kind := case requested_state
    when 'suspended' then 'account_suspend'
    when 'active' then 'account_reactivate'
    when 'revoked' then 'account_revoke'
    else null
  end;
  if action_kind is null
    or requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 500
    or (requested_state = 'revoked' and char_length(requested_reason) > 483)
    or requested_reason ~ '[[:cntrl:]]'
    or (requested_state = 'revoked' and (
      requested_confirm_sign_in_id is null
      or requested_confirm_sign_in_id <> lower(requested_confirm_sign_in_id)
      or requested_confirm_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    ))
    or (requested_state <> 'revoked' and requested_confirm_sign_in_id is not null) then
    raise exception 'Invalid account-state request' using errcode = '22023';
  end if;
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'one-dhs-pac',
    'owner',
    action_kind,
    'account',
    requested_account_id::text,
    pac.protected_action_fingerprint(
      action_kind,
      jsonb_build_object(
        'environment', requested_environment,
        'accountId', requested_account_id,
        'state', requested_state,
        'reason', requested_reason,
        'confirmSignInId', requested_confirm_sign_in_id
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  if requested_account_id = selected_authorization.account_id then
    raise exception 'The global owner cannot change the state of the active owner account from its own session'
      using errcode = '42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_account_id::text, 0)
  );
  select * into selected_account
  from pac.program_accounts account
  where account.account_id = requested_account_id
  for update;
  if selected_account.account_id is null
    or selected_account.environment <> requested_environment then
    raise exception 'The account is not available in this environment' using errcode = '42501';
  end if;
  if requested_state = 'revoked'
    and selected_account.sign_in_id <> requested_confirm_sign_in_id then
    raise exception 'The permanent-revocation confirmation does not match the current account'
      using errcode = '40001';
  end if;
  select * into current_event
  from pac.program_account_state_events state_event
  where state_event.account_id = requested_account_id
  order by state_event.account_state_event_id desc
  limit 1;
  if current_event.account_state_event_id is null then
    raise exception 'The account does not exist' using errcode = 'P0002';
  end if;
  if current_event.state = 'revoked' then
    raise exception 'A permanently revoked account cannot be restored or changed'
      using errcode = '42501';
  end if;
  if current_event.state = requested_state then
    raise exception 'The account is already in the requested state'
      using errcode = '22023';
  end if;
  insert into pac.program_account_state_events (
    account_id, state, reason, recorded_by_account_id, recorded_by_session_id,
    supersedes_account_state_event_id
  ) values (
    requested_account_id, requested_state, requested_reason,
    selected_authorization.account_id, selected_authorization.session_id,
    current_event.account_state_event_id
  ) returning * into created_event;

  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, closed_by_account_id, closed_by_session_id, reason
  )
  select reset_invitation.invitation_id, 'revoked', selected_authorization.account_id,
    selected_authorization.session_id,
    'The account state changed; every earlier credential-reset code was invalidated.'
  from pac.program_account_invitations reset_invitation
  join pac.program_account_invitation_secrets reset_secret
    on reset_secret.invitation_id = reset_invitation.invitation_id
  where reset_invitation.invitation_type in ('credential_reset', 'owner_recovery')
    and reset_invitation.target_account_id = requested_account_id
    and reset_invitation.environment = requested_environment
    and not exists (
      select 1 from pac.program_account_invitation_closures closure
      where closure.invitation_id = reset_invitation.invitation_id
    )
  on conflict on constraint program_account_invitation_closures_pkey do nothing;
  delete from pac.program_account_invitation_secrets reset_secret
  using pac.program_account_invitations reset_invitation,
    pac.program_account_invitation_closures closure
  where reset_secret.invitation_id = reset_invitation.invitation_id
    and closure.invitation_id = reset_invitation.invitation_id
    and reset_invitation.invitation_type in ('credential_reset', 'owner_recovery')
    and reset_invitation.target_account_id = requested_account_id
    and reset_invitation.environment = requested_environment;

  insert into pac.program_account_session_revocations (
    session_id, reason, revoked_by_account_id, revoked_by_session_id
  )
  select session.session_id,
    'Account state changed; a fresh sign-in is required.',
    selected_authorization.account_id,
    selected_authorization.session_id
  from pac.program_account_sessions session
  where session.account_id = requested_account_id
    and not exists (
      select 1 from pac.program_account_session_revocations revoked
      where revoked.session_id = session.session_id
    );

  if requested_state = 'revoked' then
    delete from pac.program_account_credential_secrets secret
    using pac.program_account_credentials credential
    where secret.credential_id = credential.credential_id
      and credential.account_id = requested_account_id;
    update pac.access_grants
    set revoked_at = clock_timestamp(),
        revoked_by = selected_authorization.account_id::text,
        revoked_by_account_id = selected_authorization.account_id,
        revoked_by_session_id = selected_authorization.session_id,
        revocation_reason = 'Account revoked: ' || requested_reason
    where account_id = requested_account_id
      and grant_contract_version = 'protected-v1'
      and revoked_at is null
      and role_key <> 'owner';
  end if;
  perform pac.consume_protected_action(
    created_authorization_id,
    'account_state_event',
    created_event.account_state_event_id::text
  );
  return query select
    created_event.account_state_event_id,
    created_event.state,
    created_event.recorded_at;
end;
$$;

-- Resolve mutation targets exactly so authorization decisions never depend on
-- the account page that happens to be visible in the browser.
drop function if exists pac.read_program_account_admin_target(
  text, text, text, text, uuid
);

create function pac.read_program_account_admin_target(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_account_id uuid
)
returns table (
  account_id uuid,
  sign_in_id text,
  display_name text,
  identity_version integer,
  state text,
  created_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  viewer_session_id uuid;
  viewer_account_id uuid;
begin
  select session.session_id, session.account_id
  into viewer_session_id, viewer_account_id
  from pac.read_program_account_session(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256
  ) session;
  if viewer_session_id is null or not exists (
    select 1
    from pac.access_grants grant_record
    where grant_record.account_id = viewer_account_id
      and grant_record.scope_id = 'one-dhs-pac'
      and grant_record.environment = requested_environment
      and grant_record.role_key = 'owner'
      and grant_record.grant_contract_version = 'protected-v1'
      and grant_record.revoked_at is null
      and (grant_record.expires_at is null or grant_record.expires_at > statement_timestamp())
  ) then
    raise exception 'Global owner access is required' using errcode = '42501';
  end if;
  return query
  select account.account_id, account.sign_in_id, account.display_name,
    account.identity_version, current_state.state, account.created_at
  from pac.program_accounts account
  join lateral (
    select state_event.state
    from pac.program_account_state_events state_event
    where state_event.account_id = account.account_id
    order by state_event.account_state_event_id desc
    limit 1
  ) current_state on true
  where account.environment = requested_environment
    and account.account_id = requested_account_id;
end;
$$;

-- Return independently paged current accounts and invitations. Grants are
-- complete for the account page; historical grants and correction events stay
-- as operational evidence and never enter the browser.
drop function if exists pac.read_program_access_overview(text, text, text, text);
drop function if exists pac.read_program_access_overview(
  text, text, text, text, integer, integer, integer, integer
);

create function pac.read_program_access_overview(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_account_offset integer,
  requested_account_limit integer,
  requested_invitation_offset integer,
  requested_invitation_limit integer
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  viewer_session_id uuid;
  viewer_account_id uuid;
  result jsonb;
begin
  if requested_account_offset is null
    or requested_account_offset not between 0 and 1000000
    or requested_account_limit is null
    or requested_account_limit not between 1 and 100
    or requested_invitation_offset is null
    or requested_invitation_offset not between 0 and 1000000
    or requested_invitation_limit is null
    or requested_invitation_limit not between 1 and 100 then
    raise exception 'Invalid program-access page request' using errcode = '22023';
  end if;
  select session.session_id, session.account_id
  into viewer_session_id, viewer_account_id
  from pac.read_program_account_session(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256
  ) session;
  if viewer_session_id is null or not exists (
    select 1
    from pac.access_grants grant_record
    where grant_record.account_id = viewer_account_id
      and grant_record.scope_id = 'one-dhs-pac'
      and grant_record.environment = requested_environment
      and grant_record.role_key = 'owner'
      and grant_record.grant_contract_version = 'protected-v1'
      and grant_record.revoked_at is null
      and (grant_record.expires_at is null or grant_record.expires_at > statement_timestamp())
  ) then
    raise exception 'Global owner access is required' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'accounts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'account_id', bounded.account_id,
        'sign_in_id', bounded.sign_in_id,
        'display_name', bounded.display_name,
        'identity_version', bounded.identity_version,
        'state', bounded.state,
        'created_at', bounded.created_at
      ) order by bounded.display_name, bounded.account_id)
      from (
        select account.account_id, account.sign_in_id, account.display_name,
          account.identity_version, current_state.state, account.created_at
        from pac.program_accounts account
        join lateral (
          select state_event.state
          from pac.program_account_state_events state_event
          where state_event.account_id = account.account_id
          order by state_event.account_state_event_id desc
          limit 1
        ) current_state on true
        where account.environment = requested_environment
        order by account.display_name, account.account_id
        offset requested_account_offset
        limit requested_account_limit
      ) bounded
    ), '[]'::jsonb),
    'grants', coalesce((
      select jsonb_agg(jsonb_build_object(
        'grant_id', bounded.grant_id,
        'account_id', bounded.account_id,
        'scope_id', bounded.scope_id,
        'role_key', bounded.role_key,
        'granted_at', bounded.granted_at,
        'expires_at', bounded.expires_at,
        'revoked_at', bounded.revoked_at
      ) order by bounded.granted_at, bounded.grant_id)
      from (
        select grant_record.grant_id, grant_record.account_id,
          grant_record.scope_id, grant_record.role_key,
          grant_record.granted_at, grant_record.expires_at,
          grant_record.revoked_at
        from pac.access_grants grant_record
        join (
          select account.account_id
          from pac.program_accounts account
          where account.environment = requested_environment
          order by account.display_name, account.account_id
          offset requested_account_offset
          limit requested_account_limit
        ) account_page on account_page.account_id = grant_record.account_id
        where grant_record.grant_contract_version = 'protected-v1'
          and grant_record.environment = requested_environment
          and grant_record.revoked_at is null
          and (grant_record.expires_at is null
            or grant_record.expires_at > statement_timestamp())
        order by grant_record.granted_at desc, grant_record.grant_id
      ) bounded
    ), '[]'::jsonb),
    'open_invitations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'invitation_id', bounded.invitation_id,
        'invitation_type', bounded.invitation_type,
        'sign_in_id', bounded.sign_in_id,
        'display_name', bounded.display_name,
        'issued_at', bounded.issued_at,
        'expires_at', bounded.expires_at
      ) order by bounded.issued_at, bounded.invitation_id)
      from (
        select invitation.invitation_id, invitation.invitation_type,
          invitation.sign_in_id, invitation.display_name,
          invitation.issued_at, secret.expires_at
        from pac.program_account_invitations invitation
        join pac.program_account_invitation_secrets secret
          on secret.invitation_id = invitation.invitation_id
        where secret.expires_at > statement_timestamp()
          and invitation.environment = requested_environment
          and not exists (
            select 1 from pac.program_account_invitation_closures closure
            where closure.invitation_id = invitation.invitation_id
          )
        order by invitation.issued_at, invitation.invitation_id
        offset requested_invitation_offset
        limit requested_invitation_limit
      ) bounded
    ), '[]'::jsonb),
    'pagination', jsonb_build_object(
      'account_offset', requested_account_offset,
      'account_limit', requested_account_limit,
      'account_total', (
        select count(*)
        from pac.program_accounts account
        where account.environment = requested_environment
      ),
      'invitation_offset', requested_invitation_offset,
      'invitation_limit', requested_invitation_limit,
      'invitation_total', (
        select count(*)
        from pac.program_account_invitations invitation
        join pac.program_account_invitation_secrets secret
          on secret.invitation_id = invitation.invitation_id
        where secret.expires_at > statement_timestamp()
          and invitation.environment = requested_environment
          and not exists (
            select 1 from pac.program_account_invitation_closures closure
            where closure.invitation_id = invitation.invitation_id
          )
      )
    )
  ) into result;
  return result;
end;
$$;

create function pac.attest_program_identity_runtime_boundary()
returns table (
  runtime_role text,
  session_role text,
  installation_id uuid,
  identity_tables_denied boolean,
  authorization_allocator_denied boolean,
  authorization_consumer_denied boolean,
  rate_limit_policy_denied boolean,
  owner_recovery_allocator_denied boolean,
  feature_activation_allocator_denied boolean,
  legacy_content_mutations_denied boolean,
  login_credential_lookup_denied boolean,
  session_start_denied boolean,
  authentication_schema_denied boolean,
  authentication_functions_denied boolean,
  runtime_role_attributes_safe boolean,
  runtime_memberships_denied boolean
)
language sql
stable
security definer
set search_path = pg_catalog, pac
as $$
  select
    session_user::text,
    session_user::text,
    (select identity.installation_id
      from pac.database_installation_identity identity
      where identity.singleton = 'primary'),
    not exists (
      select 1
      from unnest(array[
        'program_accounts', 'program_account_state_events',
        'program_account_invitations', 'program_account_invitation_secrets',
        'program_account_invitation_closures', 'program_account_credentials',
        'program_account_credential_secrets', 'program_account_sessions',
        'program_account_session_revocations', 'protected_action_authorizations',
        'protected_action_consumptions', 'protected_mutation_feature_evidence',
        'program_owner_transfers', 'protected_feature_activation_events',
        'database_installation_identity', 'program_account_identity_corrections'
      ]::text[]) table_name
      cross join unnest(array[
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
      ]::text[]) privilege_name
      where pg_catalog.has_table_privilege(
        session_user,
        format('pac.%I', table_name),
        privilege_name
      )
    ),
    not pg_catalog.has_function_privilege(
      session_user,
      'pac.authorize_protected_action(text,text,text,text,text,text,text,text,text,text)',
      'execute'
    ),
    not pg_catalog.has_function_privilege(
      session_user,
      'pac.consume_protected_action(uuid,text,text)',
      'execute'
    ),
    not pg_catalog.has_function_privilege(
      session_user,
      'pac.assert_runtime_rate_limit_request(text,text,integer,integer)',
      'execute'
    ),
    not pg_catalog.has_function_privilege(
      session_user,
      'pac.create_program_owner_recovery_invitation(text,uuid,text,timestamp with time zone,text,text,text)',
      'execute'
    ),
    not pg_catalog.has_function_privilege(
      session_user,
      'pac.record_protected_feature_activation(text,text,text,text,text,text)',
      'execute'
    ),
    not exists (
      select 1
      from pg_catalog.pg_proc procedure
      join pg_catalog.pg_namespace namespace on namespace.oid = procedure.pronamespace
      where namespace.nspname = 'pac'
        and procedure.proname <> all(array['attest_program_identity_runtime_boundary','read_program_account_session','end_program_account_session','accept_program_account_invitation','create_program_account_invitation','create_program_credential_reset_invitation','issue_program_access_grant','revoke_program_access_grant','revoke_program_account_invitation','change_program_account_state','read_program_access_overview','purge_expired_program_security_records','correct_program_account_identity','transfer_program_owner','read_program_account_admin_target','run_protected_content_mutation','read_contributor_resource_editing_state','read_contributor_resource_release_state','list_contributor_resource_release_queue']::text[])
        and pg_catalog.has_function_privilege(session_user, procedure.oid, 'execute')
    ),
    not pg_catalog.has_function_privilege(
      session_user,
      'pac.lookup_program_login_credential(text,text)',
      'execute'
    ),
    not pg_catalog.has_function_privilege(
      session_user,
      'pac.start_program_account_session(uuid,uuid,text,integer,text,text,text,text)',
      'execute'
    ),
    not pg_catalog.has_schema_privilege(session_user, 'pac_auth', 'usage'),
    not exists (
      select 1
      from pg_catalog.pg_proc procedure
      join pg_catalog.pg_namespace namespace on namespace.oid = procedure.pronamespace
      where namespace.nspname = 'pac_auth'
        and pg_catalog.has_function_privilege(session_user, procedure.oid, 'execute')
    ),
    exists (
      select 1
      from pg_catalog.pg_roles role_record
      where role_record.rolname = session_user
        and role_record.rolcanlogin
        and not role_record.rolinherit
        and not role_record.rolsuper
        and not role_record.rolcreatedb
        and not role_record.rolcreaterole
        and not role_record.rolreplication
        and not role_record.rolbypassrls
        and role_record.rolconnlimit between 1 and 20
    ),
    not exists (
      select 1
      from pg_catalog.pg_auth_members membership
      join pg_catalog.pg_roles member_role on member_role.oid = membership.member
      join pg_catalog.pg_roles granted_role on granted_role.oid = membership.roleid
      where (member_role.rolname = session_user or granted_role.rolname = session_user)
        and not (
          granted_role.rolname = session_user
          and member_role.rolname = current_user
          and membership.admin_option
          and not membership.inherit_option
          and not membership.set_option
        )
    );
$$;

create function pac_auth.attest_authentication_broker_boundary()
returns table (
  broker_role text,
  session_role text,
  installation_id uuid,
  pac_schema_denied boolean,
  auth_schema_create_denied boolean,
  identity_tables_denied boolean,
  direct_login_functions_denied boolean,
  login_lookup_allowed boolean,
  session_start_allowed boolean,
  other_auth_functions_denied boolean,
  auth_objects_denied boolean,
  broker_role_attributes_safe boolean,
  broker_memberships_denied boolean
)
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    session_user::text,
    session_user::text,
    (select identity.installation_id
      from pac.database_installation_identity identity
      where identity.singleton = 'primary'),
    not pg_catalog.has_schema_privilege(session_user, 'pac', 'usage'),
    not pg_catalog.has_schema_privilege(session_user, 'pac_auth', 'create'),
    not exists (
      select 1
      from pg_catalog.pg_class relation
      join pg_catalog.pg_namespace namespace on namespace.oid = relation.relnamespace
      cross join unnest(array[
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
      ]::text[]) privilege_name
      where namespace.nspname = 'pac'
        and relation.relname = any(array[
          'program_accounts', 'program_account_state_events',
          'program_account_invitations', 'program_account_invitation_secrets',
          'program_account_invitation_closures', 'program_account_credentials',
          'program_account_credential_secrets', 'program_account_sessions',
          'program_account_session_revocations', 'protected_action_authorizations',
          'protected_action_consumptions', 'program_account_identity_corrections'
        ]::text[])
        and pg_catalog.has_table_privilege(session_user, relation.oid, privilege_name)
    ),
    not exists (
      select 1
      from pg_catalog.pg_proc procedure
      join pg_catalog.pg_namespace namespace on namespace.oid = procedure.pronamespace
      where namespace.nspname = 'pac'
        and procedure.proname in (
          'lookup_program_login_credential',
          'start_program_account_session'
        )
        and pg_catalog.has_function_privilege(session_user, procedure.oid, 'execute')
    ),
    pg_catalog.has_function_privilege(
      session_user,
      'pac_auth.lookup_program_login_credential(text,text)',
      'execute'
    ),
    pg_catalog.has_function_privilege(
      session_user,
      'pac_auth.start_program_account_session(uuid,uuid,text,integer,text,text,text,text)',
      'execute'
    ),
    not exists (
      select 1
      from pg_catalog.pg_proc procedure
      join pg_catalog.pg_namespace namespace on namespace.oid = procedure.pronamespace
      where namespace.nspname = 'pac_auth'
        and procedure.oid not in (
          'pac_auth.lookup_program_login_credential(text,text)'::regprocedure::oid,
          'pac_auth.start_program_account_session(uuid,uuid,text,integer,text,text,text,text)'::regprocedure::oid,
          'pac_auth.attest_authentication_broker_boundary()'::regprocedure::oid
        )
        and pg_catalog.has_function_privilege(session_user, procedure.oid, 'execute')
    ),
    not exists (
      select 1
      from pg_catalog.pg_class relation
      join pg_catalog.pg_namespace namespace on namespace.oid = relation.relnamespace
      cross join unnest(array[
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'
      ]::text[]) privilege_name
      where namespace.nspname = 'pac_auth'
        and relation.relkind in ('r', 'p', 'v', 'm', 'f')
        and pg_catalog.has_table_privilege(session_user, relation.oid, privilege_name)
    ) and not exists (
      select 1
      from pg_catalog.pg_class relation
      join pg_catalog.pg_namespace namespace on namespace.oid = relation.relnamespace
      cross join unnest(array['SELECT', 'UPDATE', 'USAGE']::text[]) privilege_name
      where namespace.nspname = 'pac_auth'
        and relation.relkind = 'S'
        and pg_catalog.has_sequence_privilege(session_user, relation.oid, privilege_name)
    ),
    exists (
      select 1
      from pg_catalog.pg_roles role_record
      where role_record.rolname = session_user
        and role_record.rolcanlogin
        and not role_record.rolinherit
        and not role_record.rolsuper
        and not role_record.rolcreatedb
        and not role_record.rolcreaterole
        and not role_record.rolreplication
        and not role_record.rolbypassrls
        and role_record.rolconnlimit between 1 and 20
    ),
    not exists (
      select 1
      from pg_catalog.pg_auth_members membership
      join pg_catalog.pg_roles member_role on member_role.oid = membership.member
      join pg_catalog.pg_roles granted_role on granted_role.oid = membership.roleid
      where (member_role.rolname = session_user or granted_role.rolname = session_user)
        and not (
          granted_role.rolname = session_user
          and member_role.rolname = current_user
          and membership.admin_option
          and not membership.inherit_option
          and not membership.set_option
        )
    );
$$;

-- Re-establish the two disjoint application boundaries after replacing the
-- login signatures. The broker receives login only; correction stays runtime
-- owner-only and neither role receives direct identity-table access.
revoke all privileges on function pac.lookup_program_login_credential(text, text)
  from public, pac_contributor_runtime;
revoke all privileges on function pac.start_program_account_session(
  uuid, uuid, text, integer, text, text, text, text
) from public, pac_contributor_runtime;
revoke all privileges on function pac.correct_program_account_identity(
  text, text, text, text, uuid, integer, text, text, text, text
) from public;
revoke all privileges on function pac.change_program_account_state(
  text, text, text, text, uuid, text, text, text
) from public;
revoke all privileges on function pac.transfer_program_owner(
  text, text, text, text, uuid, integer, text, text
) from public;
revoke all privileges on function pac.read_program_account_admin_target(
  text, text, text, text, uuid
) from public;
revoke all privileges on function pac.read_program_access_overview(
  text, text, text, text, integer, integer, integer, integer
) from public;
revoke all privileges on function pac.assert_program_account_sign_in_reservation()
  from public, pac_contributor_runtime;
revoke all privileges on function pac.assert_program_invitation_sign_in_reservation()
  from public, pac_contributor_runtime;
revoke all privileges on function pac.assert_program_account_identity_projection()
  from public, pac_contributor_runtime;
revoke all privileges on function pac.validate_program_account_identity_correction()
  from public, pac_contributor_runtime;
revoke all privileges on function pac.attest_program_identity_runtime_boundary()
  from public, pac_contributor_runtime;

do $$
declare
  role_name text;
begin
  if exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_authentication_broker') then
    revoke all privileges on function pac.lookup_program_login_credential(text, text)
      from pac_authentication_broker;
    revoke all privileges on function pac.start_program_account_session(
      uuid, uuid, text, integer, text, text, text, text
    ) from pac_authentication_broker;
    revoke all privileges on function pac.correct_program_account_identity(
      text, text, text, text, uuid, integer, text, text, text, text
    ) from pac_authentication_broker;
    revoke all privileges on function pac.transfer_program_owner(
      text, text, text, text, uuid, integer, text, text
    ) from pac_authentication_broker;
    revoke all privileges on function pac.read_program_account_admin_target(
      text, text, text, text, uuid
    ) from pac_authentication_broker;
    revoke all privileges on function pac.read_program_access_overview(
      text, text, text, text, integer, integer, integer, integer
    ) from pac_authentication_broker;
  end if;

  if exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_contributor_runtime') then
    grant execute on function pac.correct_program_account_identity(
      text, text, text, text, uuid, integer, text, text, text, text
    ) to pac_contributor_runtime;
    grant execute on function pac.change_program_account_state(
      text, text, text, text, uuid, text, text, text
    ) to pac_contributor_runtime;
    grant execute on function pac.transfer_program_owner(
      text, text, text, text, uuid, integer, text, text
    ) to pac_contributor_runtime;
    grant execute on function pac.read_program_account_admin_target(
      text, text, text, text, uuid
    ) to pac_contributor_runtime;
    grant execute on function pac.read_program_access_overview(
      text, text, text, text, integer, integer, integer, integer
    ) to pac_contributor_runtime;
    grant execute on function pac.attest_program_identity_runtime_boundary()
      to pac_contributor_runtime;
  end if;

  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      execute format(
        'revoke all privileges on function pac.correct_program_account_identity(text,text,text,text,uuid,integer,text,text,text,text) from %I',
        role_name
      );
      execute format(
        'revoke all privileges on function pac.change_program_account_state(text,text,text,text,uuid,text,text,text) from %I',
        role_name
      );
      execute format(
        'revoke all privileges on function pac.transfer_program_owner(text,text,text,text,uuid,integer,text,text) from %I',
        role_name
      );
      execute format(
        'revoke all privileges on function pac.read_program_account_admin_target(text,text,text,text,uuid) from %I',
        role_name
      );
      execute format(
        'revoke all privileges on function pac.read_program_access_overview(text,text,text,text,integer,integer,integer,integer) from %I',
        role_name
      );
      execute format(
        'revoke all privileges on function pac.attest_program_identity_runtime_boundary() from %I',
        role_name
      );
    end if;
  end loop;
end;
$$;

revoke all privileges on schema pac_auth from public, pac_contributor_runtime, pac_authentication_broker;
revoke all privileges on all tables in schema pac_auth
  from public, pac_contributor_runtime, pac_authentication_broker;
revoke all privileges on all sequences in schema pac_auth
  from public, pac_contributor_runtime, pac_authentication_broker;
revoke all privileges on all functions in schema pac_auth
  from public, pac_contributor_runtime, pac_authentication_broker;
grant usage on schema pac_auth to pac_authentication_broker;
grant execute on function pac_auth.lookup_program_login_credential(text, text)
  to pac_authentication_broker;
grant execute on function pac_auth.start_program_account_session(
  uuid, uuid, text, integer, text, text, text, text
) to pac_authentication_broker;
grant execute on function pac_auth.attest_authentication_broker_boundary()
  to pac_authentication_broker;

comment on table pac.program_account_identity_corrections is
  'Append-only identity correction evidence for a stable named program account; not a user profile or staff-facing history.';
comment on function pac.correct_program_account_identity(
  text, text, text, text, uuid, integer, text, text, text, text
) is
  'Owner-only atomic identity correction: versioned projection, immutable evidence, reset-code closure, and target-session revocation.';
comment on function pac.transfer_program_owner(
  text, text, text, text, uuid, integer, text, text
) is
  'Owner-only atomic succession with database-locked identity-version and exact-sign-in confirmation.';
comment on function pac.read_program_access_overview(
  text, text, text, text, integer, integer, integer, integer
) is
  'Owner-only independently paged account and invitation overview; active grants are complete for the returned account page.';

create or replace function pac.read_program_account_session(
  requested_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text
)
returns table (
  session_id uuid,
  account_id uuid,
  sign_in_id text,
  display_name text,
  credential_id uuid,
  issued_at timestamptz,
  expires_at timestamptz,
  grants jsonb
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if not pac.program_identity_activation_is_current(requested_environment,requested_activation_evidence_id,requested_activation_bundle_sha256) then return; end if;
  if requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_environment not in ('local', 'preview', 'production')
    or requested_activation_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_bundle_sha256 !~ '^[a-f0-9]{64}$' then
    return;
  end if;
  return query
  select
    session.session_id,
    account.account_id,
    account.sign_in_id,
    account.display_name,
    session.credential_id,
    session.issued_at,
    session.expires_at,
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'grant_id', grant_record.grant_id,
        'scope_id', grant_record.scope_id,
        'role_key', grant_record.role_key,
        'expires_at', grant_record.expires_at
      ) order by grant_record.scope_id, grant_record.role_key, grant_record.grant_id)
      from pac.access_grants grant_record
      where grant_record.account_id = account.account_id
        and grant_record.environment = requested_environment
        and grant_record.grant_contract_version = 'protected-v1'
        and grant_record.revoked_at is null
        and (grant_record.expires_at is null or grant_record.expires_at > statement_timestamp())
    ), '[]'::jsonb)
  from pac.program_account_sessions session
  join pac.program_accounts account on account.account_id = session.account_id
  join pac.program_account_credentials credential
    on credential.credential_id = session.credential_id
  where session.token_digest = requested_token_digest
    and session.environment = requested_environment
    and session.activation_evidence_id = requested_activation_evidence_id
    and session.activation_bundle_sha256 = requested_activation_bundle_sha256
    and account.environment = requested_environment
    and session.audience = 'pac-protected-workspace'
    and session.expires_at > statement_timestamp()
    and pac.program_account_is_active(account.account_id)
    and not exists (
      select 1 from pac.program_account_session_revocations revoked
      where revoked.session_id = session.session_id
    )
    and credential.credential_version = (
      select max(latest.credential_version)
      from pac.program_account_credentials latest
      where latest.account_id = account.account_id
    )
    and exists (
      select 1 from pac.program_account_credential_secrets secret
      where secret.credential_id = credential.credential_id
    );
end;
$$;

create or replace function pac.accept_program_account_invitation(
  requested_token_digest text,
  requested_credential_hash text,
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text
)
returns table (
  session_id uuid,
  account_id uuid,
  sign_in_id text,
  display_name text,
  expires_at timestamptz,
  bootstrap_owner boolean
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_invitation pac.program_account_invitations%rowtype;
  selected_secret pac.program_account_invitation_secrets%rowtype;
  selected_account pac.program_accounts%rowtype;
  created_account_id uuid;
  created_credential_id uuid := gen_random_uuid();
  created_session_id uuid := gen_random_uuid();
  next_credential_version integer;
  session_expiry timestamptz := clock_timestamp() + interval '8 hours';
  is_bootstrap boolean := false;
begin
  if not pac.program_identity_activation_is_current(requested_environment,requested_activation_evidence_id,requested_activation_bundle_sha256) then raise exception 'Named program identity is not active in this environment' using errcode='42501'; end if;
  if requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_session_token_digest !~ '^[a-f0-9]{64}$'
    or requested_token_digest = requested_session_token_digest
    or requested_environment not in ('local', 'preview', 'production')
    or requested_activation_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_bundle_sha256 !~ '^[a-f0-9]{64}$'
    or requested_credential_hash !~ E'^\\$pac-scrypt\\$v=1\\$ln=17\\$r=8\\$p=1\\$[A-Za-z0-9_-]{22}\\$[A-Za-z0-9_-]{43}$' then
    raise exception 'Invalid invitation acceptance request' using errcode = '22023';
  end if;
  -- Discover only the immutable lock key before taking a row lock. Every path
  -- that invalidates an invitation takes its canonical advisory lock before it
  -- touches the bearer-secret row; acceptance must use the same order to avoid
  -- a secret-row/account-lock deadlock with reset, recovery, state, or transfer.
  select invitation.* into selected_invitation
  from pac.program_account_invitation_secrets secret
  join pac.program_account_invitations invitation
    on invitation.invitation_id = secret.invitation_id
  where secret.token_digest = requested_token_digest;
  if selected_invitation.invitation_id is null then
    raise exception 'Invitation is invalid or no longer available' using errcode = '42501';
  end if;

  if selected_invitation.invitation_type = 'bootstrap_owner' then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        'pac-program-owner-bootstrap:' || selected_invitation.environment,
        0
      )
    );
  elsif selected_invitation.invitation_type = 'new_account' then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        'pac-program-sign-in:' || selected_invitation.environment || ':' || selected_invitation.sign_in_id,
        0
      )
    );
  elsif selected_invitation.invitation_type in ('credential_reset', 'owner_recovery') then
    if selected_invitation.target_account_id is null then
      raise exception 'Invitation is invalid or no longer available' using errcode = '42501';
    end if;
    if selected_invitation.invitation_type = 'owner_recovery' then
      perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(
          'pac-program-owner:' || selected_invitation.environment,
          0
        )
      );
    end if;
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        'pac-program-account:' || selected_invitation.target_account_id::text,
        0
      )
    );
  else
    raise exception 'Invitation is invalid or no longer available' using errcode = '42501';
  end if;

  select secret.* into selected_secret
  from pac.program_account_invitation_secrets secret
  where secret.token_digest = requested_token_digest
  for update;
  if selected_secret.invitation_id is null then
    raise exception 'Invitation is invalid or no longer available' using errcode = '42501';
  end if;
  select invitation.* into selected_invitation
  from pac.program_account_invitations invitation
  where invitation.invitation_id = selected_secret.invitation_id;
  if selected_invitation.invitation_id is null
    or selected_invitation.environment <> requested_environment
    or selected_invitation.activation_evidence_id <> requested_activation_evidence_id
    or selected_invitation.activation_bundle_sha256 <> requested_activation_bundle_sha256
    or selected_secret.expires_at <= clock_timestamp()
    or exists (
      select 1 from pac.program_account_invitation_closures closure
      where closure.invitation_id = selected_invitation.invitation_id
    ) then
    raise exception 'Invitation is invalid or no longer available' using errcode = '42501';
  end if;

  if selected_invitation.invitation_type in ('bootstrap_owner', 'new_account') then
    if exists (
      select 1 from pac.program_accounts account
      where account.sign_in_id = selected_invitation.sign_in_id
        and account.environment = requested_environment
    ) then
      raise exception 'The invited sign-in identifier is no longer available' using errcode = '23505';
    end if;
    if selected_invitation.invitation_type = 'bootstrap_owner' and exists (
      select 1 from pac.access_grants grant_record
      where grant_record.role_key = 'owner'
        and grant_record.scope_id = 'one-dhs-pac'
        and grant_record.environment = requested_environment
        and grant_record.grant_contract_version = 'protected-v1'
    ) then
      raise exception 'The one-time owner bootstrap has already been completed' using errcode = '42501';
    end if;
    insert into pac.program_accounts (environment, sign_in_id, display_name)
    values (requested_environment, selected_invitation.sign_in_id, selected_invitation.display_name)
    returning * into selected_account;
    created_account_id := selected_account.account_id;
    insert into pac.program_account_state_events (
      account_id, state, reason, activation_invitation_id
    ) values (
      created_account_id,
      'active',
      'Account activated by accepting its one-time program invitation.',
      selected_invitation.invitation_id
    );
    next_credential_version := 1;
    is_bootstrap := selected_invitation.invitation_type = 'bootstrap_owner';
  else
    created_account_id := selected_invitation.target_account_id;
    select * into selected_account
    from pac.program_accounts account
    where account.account_id = created_account_id;
    if selected_account.account_id is null
      or selected_account.environment <> requested_environment
      or selected_account.sign_in_id is distinct from selected_invitation.sign_in_id
      or selected_account.display_name is distinct from selected_invitation.display_name
      or not pac.program_account_is_active(created_account_id) then
      raise exception 'The credential-reset invitation is no longer valid' using errcode = '42501';
    end if;
    if selected_invitation.invitation_type = 'owner_recovery'
      and not exists (
        select 1
        from pac.access_grants owner_grant
        where owner_grant.account_id = created_account_id
          and owner_grant.environment = requested_environment
          and owner_grant.scope_id = 'one-dhs-pac'
          and owner_grant.role_key = 'owner'
          and owner_grant.grant_contract_version = 'protected-v1'
          and owner_grant.revoked_at is null
          and (owner_grant.expires_at is null or owner_grant.expires_at > clock_timestamp())
          and owner_grant.granted_at <= selected_invitation.issued_at
      ) then
      raise exception 'The owner-recovery invitation is no longer valid' using errcode = '42501';
    end if;
    select coalesce(max(credential.credential_version), 0) + 1
    into next_credential_version
    from pac.program_account_credentials credential
    where credential.account_id = created_account_id;
  end if;

  insert into pac.program_account_credentials (
    credential_id, account_id, credential_version, invitation_id
  ) values (
    created_credential_id,
    created_account_id,
    next_credential_version,
    selected_invitation.invitation_id
  );
  delete from pac.program_account_credential_secrets secret
  using pac.program_account_credentials credential
  where secret.credential_id = credential.credential_id
    and credential.account_id = created_account_id;
  insert into pac.program_account_credential_secrets (credential_id, credential_hash)
  values (created_credential_id, requested_credential_hash);

  insert into pac.program_account_sessions (
    session_id, account_id, credential_id, token_digest, audience, environment,
    activation_evidence_id, activation_bundle_sha256, expires_at
  ) values (
    created_session_id,
    created_account_id,
    created_credential_id,
    requested_session_token_digest,
    'pac-protected-workspace',
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    session_expiry
  );

  if selected_invitation.invitation_type in ('credential_reset', 'owner_recovery') then
    insert into pac.program_account_invitation_closures (
      invitation_id, outcome, closed_by_account_id, closed_by_session_id, reason
    )
    select sibling.invitation_id,
      'revoked',
      created_account_id,
      created_session_id,
      'A newer credential reset was accepted; this earlier reset code was invalidated.'
    from pac.program_account_invitations sibling
    join pac.program_account_invitation_secrets sibling_secret
      on sibling_secret.invitation_id = sibling.invitation_id
    where sibling.invitation_type in ('credential_reset', 'owner_recovery')
      and sibling.target_account_id = created_account_id
      and sibling.environment = requested_environment
      and sibling.invitation_id <> selected_invitation.invitation_id
      and not exists (
        select 1 from pac.program_account_invitation_closures closure
        where closure.invitation_id = sibling.invitation_id
      )
    on conflict on constraint program_account_invitation_closures_pkey do nothing;
    delete from pac.program_account_invitation_secrets sibling_secret
    using pac.program_account_invitations sibling,
      pac.program_account_invitation_closures closure
    where sibling_secret.invitation_id = sibling.invitation_id
      and closure.invitation_id = sibling.invitation_id
      and sibling.invitation_type in ('credential_reset', 'owner_recovery')
      and sibling.target_account_id = created_account_id
      and sibling.environment = requested_environment
      and sibling.invitation_id <> selected_invitation.invitation_id;
  end if;

  if is_bootstrap then
    insert into pac.access_grants (
      principal_id, scope_id, role_key, granted_by, account_id, environment,
      issued_by_account_id, issued_by_session_id, grant_reason,
      grant_contract_version
    ) values (
      created_account_id::text,
      'one-dhs-pac',
      'owner',
      created_account_id::text,
      created_account_id,
      requested_environment,
      created_account_id,
      created_session_id,
      'One-time owner bootstrap accepted under the recorded activation evidence.',
      'protected-v1'
    );
  end if;

  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, account_id, reason
  ) values (
    selected_invitation.invitation_id,
    'accepted',
    created_account_id,
    'One-time invitation accepted and its bearer secret destroyed.'
  );
  delete from pac.program_account_invitation_secrets
  where invitation_id = selected_invitation.invitation_id;

  return query select
    created_session_id,
    selected_account.account_id,
    selected_account.sign_in_id,
    selected_account.display_name,
    session_expiry,
    is_bootstrap;
end;
$$;

-- Retain every existing policy by delegating older scopes to its unchanged function.
alter function pac.assert_runtime_rate_limit_request(text,text,integer,integer) rename to assert_runtime_rate_limit_request_pre_identity_v1;
create function pac.assert_runtime_rate_limit_request(requested_scope text,requested_subject_hash text,requested_limit integer,requested_window_seconds integer)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$ begin
if requested_scope is null or requested_subject_hash is null or requested_limit is null or requested_window_seconds is null then raise exception 'Invalid rate limit request' using errcode='22023'; end if;
if requested_scope not in ('program-login-network','program-login-account','program-invitation-network','program-invitation-code') then perform pac.assert_runtime_rate_limit_request_pre_identity_v1(requested_scope,requested_subject_hash,requested_limit,requested_window_seconds); return; end if;
if requested_subject_hash !~ '^[a-f0-9]{64}$' or requested_window_seconds<>900 or requested_limit<>(case requested_scope when 'program-login-network' then 40 when 'program-login-account' then 10 when 'program-invitation-network' then 20 else 10 end) then raise exception 'Invalid named sign-in rate limit' using errcode='22023'; end if; end; $$;
alter table pac.runtime_rate_limits drop constraint runtime_rate_limits_registered_identity;
alter table pac.runtime_rate_limits add constraint runtime_rate_limits_registered_identity check(scope in ('staff-ask','owner-login','consultation-intake','consultation-tracking','staff-program-outcome','program-login-network','program-login-account','program-invitation-network','program-invitation-code') and subject_hash ~ '^[a-f0-9]{64}$');
revoke all on function pac.assert_runtime_rate_limit_request(text,text,integer,integer) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.assert_runtime_rate_limit_request_pre_identity_v1(text,text,integer,integer) from public,pac_contributor_runtime,pac_authentication_broker;

commit;
