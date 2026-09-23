begin;
-- Local named-contributor adaptation, owner authorized 2026-09-08.
-- Selective donor identity lineage0021/0022/0023; existing owner functions and grants remain intact.
-- Hosted PostgreSQL may grant its creator administrative control without INHERIT or SET.
-- Only that unusable migration-owner membership is permitted; runtime role paths remain denied.
do $role$ begin
if not exists(select 1 from pg_roles where rolname='pac_contributor_runtime') then
create role pac_contributor_runtime login noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls connection limit 20; end if;
if not exists(select 1 from pg_roles where rolname='pac_contributor_runtime' and rolcanlogin and not rolinherit and not rolsuper and not rolcreatedb and not rolcreaterole and not rolreplication and not rolbypassrls and rolconnlimit between 1 and 20)
or exists(select 1 from pg_auth_members m join pg_roles r on r.oid=m.member join pg_roles g on g.oid=m.roleid where (r.rolname='pac_contributor_runtime' or g.rolname='pac_contributor_runtime')
  and not (g.rolname='pac_contributor_runtime' and r.rolname=current_user
    and m.admin_option and not m.inherit_option and not m.set_option)) then raise exception 'Unsafe existing pac_contributor_runtime role' using errcode='42501'; end if;
execute format('grant connect on database %I to pac_contributor_runtime',current_database()); end $role$;
alter role pac_contributor_runtime set statement_timeout='10s';
alter role pac_contributor_runtime set lock_timeout='5s';
alter role pac_contributor_runtime set idle_in_transaction_session_timeout='10s';
grant usage on schema pac to pac_contributor_runtime;


-- DEC-021 through DEC-023 require a named, revocable program identity and an
-- exact role/scope grant at the instant of every protected action. The shared
-- consultant key is intentionally not represented here and cannot satisfy any
-- of these functions.

create table if not exists pac.program_accounts (
  account_id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('local', 'preview', 'production')),
  sign_in_id text not null check (
    sign_in_id = lower(sign_in_id)
    and sign_in_id ~ '^[a-z0-9][a-z0-9._-]{2,63}$'
  ),
  display_name text not null check (
    char_length(display_name) between 2 and 120
    and display_name = btrim(display_name)
    and display_name !~ '[[:cntrl:]]'
  ),
  created_at timestamptz not null default clock_timestamp(),
  identity_contract_version text not null default 'program-identity-v1'
    check (identity_contract_version = 'program-identity-v1'),
  unique (environment, sign_in_id)
);

create table if not exists pac.program_account_state_events (
  account_state_event_id bigint generated always as identity primary key,
  account_id uuid not null references pac.program_accounts(account_id),
  state text not null check (state in ('active', 'suspended', 'revoked')),
  reason text not null check (
    char_length(reason) between 3 and 500
    and reason = btrim(reason)
    and reason !~ '[[:cntrl:]]'
  ),
  recorded_at timestamptz not null default clock_timestamp(),
  recorded_by_account_id uuid references pac.program_accounts(account_id),
  recorded_by_session_id uuid,
  activation_invitation_id uuid,
  supersedes_account_state_event_id bigint unique
    references pac.program_account_state_events(account_state_event_id),
  check (
    (recorded_by_account_id is not null and recorded_by_session_id is not null and activation_invitation_id is null)
    or (recorded_by_account_id is null and recorded_by_session_id is null and activation_invitation_id is not null)
  )
);

create unique index if not exists program_account_initial_state_idx
  on pac.program_account_state_events(account_id)
  where supersedes_account_state_event_id is null;

create table if not exists pac.program_account_invitations (
  invitation_id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('local', 'preview', 'production')),
  activation_evidence_id text not null check (
    activation_evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
  ),
  activation_bundle_sha256 text not null check (activation_bundle_sha256 ~ '^[a-f0-9]{64}$'),
  invitation_type text not null check (
    invitation_type in ('bootstrap_owner', 'new_account', 'credential_reset', 'owner_recovery')
  ),
  sign_in_id text not null check (
    sign_in_id = lower(sign_in_id)
    and sign_in_id ~ '^[a-z0-9][a-z0-9._-]{2,63}$'
  ),
  display_name text not null check (
    char_length(display_name) between 2 and 120
    and display_name = btrim(display_name)
    and display_name !~ '[[:cntrl:]]'
  ),
  target_account_id uuid references pac.program_accounts(account_id),
  issued_at timestamptz not null default clock_timestamp(),
  issued_by_authorization_id uuid,
  bootstrap_evidence_id text,
  check (
    (invitation_type = 'bootstrap_owner'
      and target_account_id is null
      and issued_by_authorization_id is null
      and bootstrap_evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$')
    or (invitation_type = 'new_account'
      and target_account_id is null
      and issued_by_authorization_id is not null
      and bootstrap_evidence_id is null)
    or (invitation_type = 'credential_reset'
      and target_account_id is not null
      and issued_by_authorization_id is not null
      and bootstrap_evidence_id is null)
    or (invitation_type = 'owner_recovery'
      and target_account_id is not null
      and issued_by_authorization_id is null
      and bootstrap_evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$')
  )
);

create table if not exists pac.program_account_invitation_secrets (
  invitation_id uuid primary key references pac.program_account_invitations(invitation_id),
  token_digest text not null unique check (token_digest ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null
);

create table if not exists pac.program_account_invitation_closures (
  invitation_id uuid primary key references pac.program_account_invitations(invitation_id),
  outcome text not null check (outcome in ('accepted', 'revoked', 'expired', 'superseded')),
  account_id uuid references pac.program_accounts(account_id),
  closed_at timestamptz not null default clock_timestamp(),
  closed_by_account_id uuid references pac.program_accounts(account_id),
  closed_by_session_id uuid,
  recovery_evidence_id text check (
    recovery_evidence_id is null
    or recovery_evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
  ),
  reason text not null check (
    char_length(reason) between 3 and 500
    and reason = btrim(reason)
    and reason !~ '[[:cntrl:]]'
  ),
  check (
    (outcome = 'accepted' and account_id is not null and closed_by_account_id is null and closed_by_session_id is null and recovery_evidence_id is null)
    or (outcome = 'revoked' and account_id is null and closed_by_account_id is not null and closed_by_session_id is not null and recovery_evidence_id is null)
    or (outcome = 'expired' and account_id is null and closed_by_account_id is null and closed_by_session_id is null and recovery_evidence_id is null)
    or (outcome = 'superseded' and account_id is null and closed_by_account_id is null and closed_by_session_id is null and recovery_evidence_id is not null)
  )
);

create table if not exists pac.program_account_credentials (
  credential_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references pac.program_accounts(account_id),
  credential_version integer not null check (credential_version > 0),
  invitation_id uuid not null unique references pac.program_account_invitations(invitation_id),
  issued_at timestamptz not null default clock_timestamp(),
  credential_contract_version text not null default 'pac-scrypt-v1'
    check (credential_contract_version = 'pac-scrypt-v1'),
  unique (account_id, credential_version)
);

create table if not exists pac.program_account_credential_secrets (
  credential_id uuid primary key references pac.program_account_credentials(credential_id) on delete cascade,
  credential_hash text not null check (
    credential_hash ~ E'^\\$pac-scrypt\\$v=1\\$ln=17\\$r=8\\$p=1\\$[A-Za-z0-9_-]{22}\\$[A-Za-z0-9_-]{43}$'
  )
);

create table if not exists pac.program_account_sessions (
  session_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references pac.program_accounts(account_id),
  credential_id uuid not null references pac.program_account_credentials(credential_id),
  token_digest text not null unique check (token_digest ~ '^[a-f0-9]{64}$'),
  audience text not null check (audience = 'pac-protected-workspace'),
  environment text not null check (environment in ('local', 'preview', 'production')),
  activation_evidence_id text not null check (
    activation_evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
  ),
  activation_bundle_sha256 text not null check (activation_bundle_sha256 ~ '^[a-f0-9]{64}$'),
  issued_at timestamptz not null default clock_timestamp(),
  expires_at timestamptz not null,
  check (expires_at > issued_at and expires_at <= issued_at + interval '8 hours 1 minute')
);

create index if not exists program_account_sessions_expiry_idx
  on pac.program_account_sessions(expires_at, session_id);

create table if not exists pac.program_account_session_revocations (
  session_id uuid primary key references pac.program_account_sessions(session_id) on delete cascade,
  revoked_at timestamptz not null default clock_timestamp(),
  reason text not null check (
    char_length(reason) between 3 and 240
    and reason = btrim(reason)
    and reason !~ '[[:cntrl:]]'
  ),
  revoked_by_account_id uuid references pac.program_accounts(account_id),
  revoked_by_session_id uuid,
  check (
    (revoked_by_account_id is null and revoked_by_session_id is null)
    or (revoked_by_account_id is not null and revoked_by_session_id is not null)
  )
);

-- Preserve historical access grants without fabricating protected identity
-- evidence. Every protected-v1 grant must bind an exact account and the named
-- owner session that issued it. Historical rows remain visibly legacy.
alter table pac.access_grants
  add column if not exists account_id uuid references pac.program_accounts(account_id),
  add column if not exists environment text,
  add column if not exists expires_at timestamptz,
  add column if not exists issued_by_account_id uuid references pac.program_accounts(account_id),
  add column if not exists issued_by_session_id uuid,
  add column if not exists grant_reason text,
  add column if not exists grant_contract_version text,
  add column if not exists revoked_by_account_id uuid references pac.program_accounts(account_id),
  add column if not exists revoked_by_session_id uuid,
  add column if not exists revocation_reason text;

alter table pac.access_grants
  drop constraint if exists access_grants_role_key_check;
alter table pac.access_grants
  add constraint access_grants_role_key_check check (
    role_key in (
      'staff_user', 'content_contributor', 'program_steward',
      'publishing_approver', 'equity_director', 'one_dsd_team_member', 'owner'
    )
  ) not valid;
alter table pac.access_grants validate constraint access_grants_role_key_check;

alter table pac.access_grants
  add constraint access_grants_protected_v1_contract check (
    grant_contract_version is null
    or (
      grant_contract_version = 'protected-v1'
      and account_id is not null
      and environment in ('local', 'preview', 'production')
      and principal_id = account_id::text
      and issued_by_account_id is not null
      and issued_by_session_id is not null
      and granted_by = issued_by_account_id::text
      and grant_reason is not null
      and char_length(grant_reason) between 3 and 500
      and grant_reason = btrim(grant_reason)
      and grant_reason !~ '[[:cntrl:]]'
      and (expires_at is null or expires_at > granted_at)
      and (
        (role_key = 'owner' and scope_id = 'one-dhs-pac')
        or (
          role_key in ('content_contributor', 'program_steward', 'publishing_approver')
          and scope_id in ('one-dhs', 'dsd')
        )
        or (role_key = 'one_dsd_team_member' and scope_id = 'one-dsd-team')
      )
      and (
        revoked_at is null
        or (
          revoked_by is not null
          and revoked_by_account_id is not null
          and revoked_by_session_id is not null
          and revoked_by = revoked_by_account_id::text
          and revocation_reason is not null
          and char_length(revocation_reason) between 3 and 500
          and revocation_reason = btrim(revocation_reason)
          and revocation_reason !~ '[[:cntrl:]]'
        )
      )
    )
  ) not valid;
alter table pac.access_grants validate constraint access_grants_protected_v1_contract;

create table if not exists pac.protected_action_authorizations (
  authorization_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references pac.program_accounts(account_id),
  session_id uuid not null,
  credential_id uuid not null,
  environment text not null check (environment in ('local', 'preview', 'production')),
  activation_evidence_id text not null check (
    activation_evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
  ),
  activation_bundle_sha256 text not null check (activation_bundle_sha256 ~ '^[a-f0-9]{64}$'),
  session_issued_at timestamptz not null,
  session_expires_at timestamptz not null,
  grant_id uuid not null references pac.access_grants(grant_id),
  requested_scope_id text not null references pac.program_scopes(scope_id),
  effective_grant_scope_id text not null references pac.program_scopes(scope_id),
  required_role_key text not null check (
    required_role_key in (
      'content_contributor', 'program_steward', 'publishing_approver',
      'equity_director', 'one_dsd_team_member', 'owner'
    )
  ),
  effective_grant_role_key text not null,
  action_kind text not null check (
    action_kind in (
      'account_invite', 'credential_reset_invite', 'invitation_revoke',
      'account_suspend', 'account_reactivate', 'account_revoke',
      'grant_issue', 'grant_revoke', 'contribution_submit',
      'specialist_review', 'approval_record', 'publication_publish',
      'publication_withdraw', 'publication_republish', 'correction_record',
      'protected_upload', 'formal_compliance_record', 'owner_transfer'
    )
  ),
  target_type text not null check (
    target_type in ('account', 'invitation', 'grant', 'content_item', 'content_revision', 'review', 'publication', 'source_object', 'compliance_record')
  ),
  target_id text not null check (
    char_length(target_id) between 1 and 160
    and target_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$'
  ),
  request_fingerprint text not null check (request_fingerprint ~ '^[a-f0-9]{64}$'),
  authorized_at timestamptz not null default clock_timestamp(),
  authorization_contract_version text not null default 'protected-action-v1'
    check (authorization_contract_version = 'protected-action-v1'),
  check (required_role_key = effective_grant_role_key),
  check (session_expires_at > session_issued_at)
);

create table if not exists pac.protected_action_consumptions (
  authorization_id uuid primary key references pac.protected_action_authorizations(authorization_id),
  action_kind text not null,
  result_record_type text not null check (
    result_record_type in (
      'account_state_event', 'owner_transfer', 'invitation', 'grant',
      'content_revision', 'review', 'publication', 'source_object', 'compliance_record'
    )
  ),
  requested_target_id text not null check (
    char_length(requested_target_id) between 1 and 160
    and requested_target_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$'
  ),
  action_record_id text not null check (
    char_length(action_record_id) between 1 and 160
    and action_record_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$'
  ),
  consumed_at timestamptz not null default clock_timestamp(),
  unique (action_kind, result_record_type, action_record_id)
);

alter table pac.program_account_invitations
  add constraint program_account_invitations_authorization_fk
  foreign key (issued_by_authorization_id)
  references pac.protected_action_authorizations(authorization_id)
  not valid;
alter table pac.program_account_invitations
  validate constraint program_account_invitations_authorization_fk;

alter table pac.program_account_state_events
  add constraint program_account_state_activation_invitation_fk
  foreign key (activation_invitation_id)
  references pac.program_account_invitations(invitation_id)
  not valid;
alter table pac.program_account_state_events
  validate constraint program_account_state_activation_invitation_fk;

-- All identity, credential metadata, grant/action evidence, and invitation
-- history is append-only. Short-lived bearer-secret tables are removed only by
-- their narrowly scoped lifecycle functions.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'program_accounts',
    'program_account_state_events',
    'program_account_invitations',
    'program_account_invitation_closures',
    'program_account_credentials',
    'protected_action_authorizations',
    'protected_action_consumptions'
  ]
  loop
    execute format('drop trigger if exists immutable_guard on pac.%I', table_name);
    execute format(
      'create trigger immutable_guard before update or delete on pac.%I for each row execute function pac.prevent_immutable_change()',
      table_name
    );
  end loop;
end;
$$;

create or replace function pac.prevent_protected_access_grant_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Access grants are retained; revoke a grant instead' using errcode = '55000';
  end if;
  if old.grant_contract_version = 'protected-v1' then
    if old.revoked_at is not null
      or new.revoked_at is null
      or (to_jsonb(new) - array[
        'revoked_at', 'revoked_by', 'revoked_by_account_id',
        'revoked_by_session_id', 'revocation_reason'
      ]) is distinct from (to_jsonb(old) - array[
        'revoked_at', 'revoked_by', 'revoked_by_account_id',
        'revoked_by_session_id', 'revocation_reason'
      ]) then
      raise exception 'A protected access grant permits only one attributed revocation' using errcode = '55000';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protected_access_grant_mutation_guard on pac.access_grants;
create trigger protected_access_grant_mutation_guard
before update or delete on pac.access_grants
for each row execute function pac.prevent_protected_access_grant_mutation();

create unique index if not exists access_grants_one_protected_owner_idx
  on pac.access_grants(environment, role_key)
  where role_key = 'owner'
    and grant_contract_version = 'protected-v1'
    and revoked_at is null;

create or replace function pac.assert_program_account_invitation_secret()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  issued timestamptz;
begin
  select invitation.issued_at into issued
  from pac.program_account_invitations invitation
  where invitation.invitation_id = new.invitation_id;
  if issued is null
    or new.expires_at <= issued + interval '5 minutes'
    or new.expires_at > issued + interval '7 days' then
    raise exception 'Invitation expiry is outside the approved window' using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists program_account_invitation_secret_guard
  on pac.program_account_invitation_secrets;
create trigger program_account_invitation_secret_guard
before insert or update on pac.program_account_invitation_secrets
for each row execute function pac.assert_program_account_invitation_secret();

create or replace function pac.assert_program_account_state_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_event pac.program_account_state_events%rowtype;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || new.account_id::text, 0)
  );
  select state_event.* into current_event
  from pac.program_account_state_events state_event
  where state_event.account_id = new.account_id
    and not exists (
      select 1 from pac.program_account_state_events child
      where child.supersedes_account_state_event_id = state_event.account_state_event_id
    )
  order by state_event.account_state_event_id desc
  limit 1;

  if current_event.account_state_event_id is null then
    if new.supersedes_account_state_event_id is not null
      or new.activation_invitation_id is null
      or new.state <> 'active' then
      raise exception 'An account must begin active through its accepted invitation' using errcode = '40001';
    end if;
  else
    if new.supersedes_account_state_event_id is distinct from current_event.account_state_event_id
      or new.activation_invitation_id is not null
      or new.recorded_by_account_id is null
      or new.recorded_by_session_id is null then
      raise exception 'An account-state change must supersede the exact current state' using errcode = '40001';
    end if;
    if current_event.state = 'revoked' then
      raise exception 'A revoked account cannot be reactivated' using errcode = '42501';
    end if;
    if new.state = current_event.state then
      raise exception 'An account-state change must change the current state' using errcode = '22023';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists program_account_state_event_guard on pac.program_account_state_events;
create trigger program_account_state_event_guard
before insert on pac.program_account_state_events
for each row execute function pac.assert_program_account_state_event();

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
      and new.action_kind in ('account_suspend', 'account_reactivate', 'account_revoke', 'owner_transfer')
      and new.target_type = 'account')
    or (new.required_role_key = 'owner'
      and new.action_kind in ('grant_issue', 'grant_revoke')
      and new.target_type = 'grant')
    or (new.required_role_key in ('content_contributor', 'one_dsd_team_member')
      and new.action_kind = 'contribution_submit'
      and new.target_type = 'content_item')
    or (new.required_role_key = 'program_steward'
      and new.action_kind = 'specialist_review'
      and new.target_type = 'content_item')
    or (new.required_role_key = 'program_steward'
      and new.action_kind = 'correction_record'
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

drop trigger if exists protected_action_authorization_shape_guard
  on pac.protected_action_authorizations;
create trigger protected_action_authorization_shape_guard
before insert on pac.protected_action_authorizations
for each row execute function pac.assert_protected_action_authorization_shape();

create or replace function pac.protected_action_fingerprint(
  requested_action_kind text,
  requested_payload jsonb
)
returns text
language sql
immutable
security definer
set search_path = pg_catalog, pac
as $$
  select encode(public.digest(convert_to(
    jsonb_build_object(
      'domain', 'pac:protected-action-request:db-v2',
      'actionKind', requested_action_kind,
      'payload', requested_payload
    )::text,
    'UTF8'
  ), 'sha256'), 'hex');
$$;

drop trigger if exists protected_action_consumption_guard on pac.protected_action_consumptions;
create trigger protected_action_consumption_guard
before insert on pac.protected_action_consumptions
for each row execute function pac.assert_protected_action_consumption();

create or replace function pac.program_account_is_active(requested_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
  select coalesce((
    select state_event.state = 'active'
    from pac.program_account_state_events state_event
    where state_event.account_id = requested_account_id
    order by state_event.account_state_event_id desc
    limit 1
  ), false);
$$;

create or replace function pac.lookup_program_login_credential(
  requested_sign_in_id text,
  requested_environment text
)
returns table (
  account_id uuid,
  display_name text,
  credential_id uuid,
  credential_hash text
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
  select account.account_id, account.display_name, credential.credential_id, secret.credential_hash
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

create or replace function pac.start_program_account_session(
  requested_account_id uuid,
  requested_credential_id uuid,
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
  if requested_token_digest !~ '^[a-f0-9]{64}$'
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
  where account.account_id = requested_account_id;
  select * into selected_credential
  from pac.program_account_credentials credential
  where credential.account_id = requested_account_id
  order by credential.credential_version desc
  limit 1;
  if selected_account.account_id is null
    or selected_account.environment <> requested_environment
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
    requested_account_id,
    requested_credential_id,
    requested_token_digest,
    'pac-protected-workspace',
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    clock_timestamp() + interval '8 hours'
  ) returning * into created_session;
  return query select
    created_session.session_id,
    selected_account.account_id,
    selected_account.display_name,
    created_session.expires_at;
end;
$$;

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

create or replace function pac.end_program_account_session(
  requested_token_digest text,
  requested_environment text
)
returns boolean
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_session pac.program_account_sessions%rowtype;
begin
  if requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_environment not in ('local', 'preview', 'production') then
    return false;
  end if;
  select * into selected_session
  from pac.program_account_sessions session
  where session.token_digest = requested_token_digest
    and session.environment = requested_environment
  for update;
  if selected_session.session_id is null then return false; end if;
  insert into pac.program_account_session_revocations (
    session_id, reason, revoked_by_account_id, revoked_by_session_id
  ) values (
    selected_session.session_id,
    'Signed out by the account holder.',
    selected_session.account_id,
    selected_session.session_id
  ) on conflict (session_id) do nothing;
  return true;
end;
$$;

create or replace function pac.bootstrap_program_owner_invitation(
  requested_environment text,
  requested_sign_in_id text,
  requested_display_name text,
  requested_token_digest text,
  requested_expires_at timestamptz,
  requested_evidence_id text,
  requested_activation_bundle_sha256 text
)
returns table (invitation_id uuid, expires_at timestamptz)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_invitation_id uuid := gen_random_uuid();
begin
  if session_user in ('pac_contributor_runtime', 'anon', 'authenticated') then
    raise exception 'Owner bootstrap requires the migration-owner connection' using errcode = '42501';
  end if;
  if requested_sign_in_id is null
    or requested_sign_in_id <> lower(requested_sign_in_id)
    or requested_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    or requested_display_name is null
    or requested_display_name <> btrim(requested_display_name)
    or char_length(requested_display_name) not between 2 and 120
    or requested_display_name ~ '[[:cntrl:]]'
    or requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_environment not in ('local', 'preview', 'production')
    or requested_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_bundle_sha256 !~ '^[a-f0-9]{64}$'
    or requested_expires_at <= clock_timestamp() + interval '5 minutes'
    or requested_expires_at > clock_timestamp() + interval '7 days' then
    raise exception 'Invalid owner-bootstrap invitation' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-owner-bootstrap:' || requested_environment, 0)
  );
  if exists (
    select 1 from pac.access_grants grant_record
    where grant_record.role_key = 'owner'
      and grant_record.scope_id = 'one-dhs-pac'
      and grant_record.environment = requested_environment
      and grant_record.grant_contract_version = 'protected-v1'
  ) or exists (
    select 1
    from pac.program_account_invitations invitation
    left join pac.program_account_invitation_closures closure
      on closure.invitation_id = invitation.invitation_id
    where invitation.invitation_type = 'bootstrap_owner'
      and invitation.environment = requested_environment
      and closure.invitation_id is null
  ) then
    raise exception 'The one-time program-owner bootstrap is already claimed or pending' using errcode = '42501';
  end if;
  if exists (
    select 1 from pac.program_accounts account
    where account.sign_in_id = requested_sign_in_id
      and account.environment = requested_environment
  ) then
    raise exception 'The requested sign-in identifier is not available' using errcode = '23505';
  end if;
  insert into pac.program_account_invitations (
    invitation_id, environment, activation_evidence_id, activation_bundle_sha256,
    invitation_type, sign_in_id, display_name, bootstrap_evidence_id
  ) values (
    created_invitation_id,
    requested_environment,
    requested_evidence_id,
    requested_activation_bundle_sha256,
    'bootstrap_owner',
    requested_sign_in_id,
    requested_display_name,
    requested_evidence_id
  );
  insert into pac.program_account_invitation_secrets (
    invitation_id, token_digest, expires_at
  ) values (
    created_invitation_id, requested_token_digest, requested_expires_at
  );
  return query select created_invitation_id, requested_expires_at;
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
      'grant_issue', 'grant_revoke', 'contribution_submit',
      'specialist_review', 'approval_record', 'publication_publish',
      'publication_withdraw', 'publication_republish', 'correction_record',
      'protected_upload', 'formal_compliance_record', 'owner_transfer'
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
    session_issued_at, session_expires_at,
    grant_id, requested_scope_id,
    effective_grant_scope_id, required_role_key, effective_grant_role_key,
    action_kind, target_type, target_id, request_fingerprint
  ) values (
    selected_session.account_id,
    selected_session.session_id,
    selected_session.credential_id,
    selected_session.environment,
    selected_session.activation_evidence_id,
    selected_session.activation_bundle_sha256,
    selected_session.issued_at,
    selected_session.expires_at,
    selected_grant.grant_id,
    requested_scope_id,
    selected_grant.scope_id,
    requested_role_key,
    selected_grant.role_key,
    requested_action_kind,
    requested_target_type,
    requested_target_id,
    requested_fingerprint
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
      'account_state_event', 'owner_transfer', 'invitation', 'grant',
      'content_revision', 'review', 'publication', 'source_object', 'compliance_record'
    )
    or requested_action_record_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{0,159}$' then
    raise exception 'Invalid protected-action consumption' using errcode = '22023';
  end if;
  insert into pac.protected_action_consumptions (
    authorization_id, action_kind, result_record_type, requested_target_id, action_record_id
  ) values (
    selected_authorization.authorization_id,
    selected_authorization.action_kind,
    requested_result_record_type,
    selected_authorization.target_id,
    requested_action_record_id
  );
end;
$$;

create or replace function pac.create_program_account_invitation(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_sign_in_id text,
  requested_display_name text,
  requested_token_digest text,
  requested_expires_at timestamptz
)
returns table (invitation_id uuid, expires_at timestamptz)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_invitation_id uuid := gen_random_uuid();
  created_authorization_id uuid;
begin
  if requested_sign_in_id is null
    or requested_sign_in_id <> lower(requested_sign_in_id)
    or requested_sign_in_id !~ '^[a-z0-9][a-z0-9._-]{2,63}$'
    or requested_display_name is null
    or requested_display_name <> btrim(requested_display_name)
    or char_length(requested_display_name) not between 2 and 120
    or requested_display_name ~ '[[:cntrl:]]'
    or requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_expires_at <= clock_timestamp() + interval '5 minutes'
    or requested_expires_at > clock_timestamp() + interval '7 days' then
    raise exception 'Invalid account invitation' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'pac-program-sign-in:' || requested_environment || ':' || requested_sign_in_id,
      0
    )
  );
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'one-dhs-pac',
    'owner',
    'account_invite',
    'invitation',
    created_invitation_id::text,
    pac.protected_action_fingerprint(
      'account_invite',
      jsonb_build_object(
        'environment', requested_environment,
        'invitationId', created_invitation_id,
        'signInId', requested_sign_in_id,
        'displayName', requested_display_name,
        'expiresAt', requested_expires_at
      )
    )
  );
  if exists (
    select 1 from pac.program_accounts account
    where account.sign_in_id = requested_sign_in_id
      and account.environment = requested_environment
  ) or exists (
    select 1
    from pac.program_account_invitations invitation
    join pac.program_account_invitation_secrets secret
      on secret.invitation_id = invitation.invitation_id
    where invitation.sign_in_id = requested_sign_in_id
      and invitation.environment = requested_environment
      and secret.expires_at > clock_timestamp()
  ) then
    raise exception 'The requested sign-in identifier is not available' using errcode = '23505';
  end if;
  insert into pac.program_account_invitations (
    invitation_id, environment, activation_evidence_id, activation_bundle_sha256,
    invitation_type, sign_in_id, display_name,
    issued_by_authorization_id
  ) values (
    created_invitation_id,
    requested_environment,
    (select stored.activation_evidence_id from pac.protected_action_authorizations stored
      where stored.authorization_id = created_authorization_id),
    (select stored.activation_bundle_sha256 from pac.protected_action_authorizations stored
      where stored.authorization_id = created_authorization_id),
    'new_account',
    requested_sign_in_id,
    requested_display_name,
    created_authorization_id
  );
  insert into pac.program_account_invitation_secrets (
    invitation_id, token_digest, expires_at
  ) values (
    created_invitation_id, requested_token_digest, requested_expires_at
  );
  perform pac.consume_protected_action(created_authorization_id, 'invitation', created_invitation_id::text);
  return query select created_invitation_id, requested_expires_at;
end;
$$;

create or replace function pac.create_program_credential_reset_invitation(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_account_id uuid,
  requested_token_digest text,
  requested_expires_at timestamptz
)
returns table (invitation_id uuid, expires_at timestamptz)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_invitation_id uuid := gen_random_uuid();
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
  selected_account pac.program_accounts%rowtype;
begin
  if requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_expires_at <= clock_timestamp() + interval '5 minutes'
    or requested_expires_at > clock_timestamp() + interval '24 hours' then
    raise exception 'Invalid credential-reset invitation' using errcode = '22023';
  end if;
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'one-dhs-pac',
    'owner',
    'credential_reset_invite',
    'invitation',
    created_invitation_id::text,
    pac.protected_action_fingerprint(
      'credential_reset_invite',
      jsonb_build_object(
        'environment', requested_environment,
        'invitationId', created_invitation_id,
        'accountId', requested_account_id,
        'expiresAt', requested_expires_at
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_account_id::text, 0)
  );
  select * into selected_account
  from pac.program_accounts account
  where account.account_id = requested_account_id
    and account.environment = requested_environment;
  if selected_account.account_id is null or not pac.program_account_is_active(requested_account_id) then
    raise exception 'The account is not available for credential reset' using errcode = '42501';
  end if;
  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, closed_by_account_id, closed_by_session_id, reason
  )
  select prior.invitation_id,
    'revoked',
    selected_authorization.account_id,
    selected_authorization.session_id,
    'A newer credential-reset invitation replaced this code.'
  from pac.program_account_invitations prior
  join pac.program_account_invitation_secrets prior_secret
    on prior_secret.invitation_id = prior.invitation_id
  where prior.invitation_type in ('credential_reset', 'owner_recovery')
    and prior.target_account_id = requested_account_id
    and prior.environment = requested_environment
    and not exists (
      select 1 from pac.program_account_invitation_closures closure
      where closure.invitation_id = prior.invitation_id
    )
  on conflict on constraint program_account_invitation_closures_pkey do nothing;
  delete from pac.program_account_invitation_secrets prior_secret
  using pac.program_account_invitations prior,
    pac.program_account_invitation_closures closure
  where prior_secret.invitation_id = prior.invitation_id
    and closure.invitation_id = prior.invitation_id
    and prior.invitation_type in ('credential_reset', 'owner_recovery')
    and prior.target_account_id = requested_account_id
    and prior.environment = requested_environment;
  insert into pac.program_account_invitations (
    invitation_id, environment, activation_evidence_id, activation_bundle_sha256,
    invitation_type, sign_in_id, display_name,
    target_account_id, issued_by_authorization_id
  ) values (
    created_invitation_id,
    requested_environment,
    (select stored.activation_evidence_id from pac.protected_action_authorizations stored
      where stored.authorization_id = created_authorization_id),
    (select stored.activation_bundle_sha256 from pac.protected_action_authorizations stored
      where stored.authorization_id = created_authorization_id),
    'credential_reset',
    selected_account.sign_in_id,
    selected_account.display_name,
    selected_account.account_id,
    created_authorization_id
  );
  insert into pac.program_account_invitation_secrets (
    invitation_id, token_digest, expires_at
  ) values (
    created_invitation_id, requested_token_digest, requested_expires_at
  );
  perform pac.consume_protected_action(created_authorization_id, 'invitation', created_invitation_id::text);
  return query select created_invitation_id, requested_expires_at;
end;
$$;

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

create or replace function pac.revoke_program_access_grant(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_grant_id uuid,
  requested_reason text
)
returns boolean
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  selected_grant pac.access_grants%rowtype;
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
begin
  if requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 500
    or requested_reason ~ '[[:cntrl:]]' then
    raise exception 'Invalid grant-revocation reason' using errcode = '22023';
  end if;
  select * into selected_grant
  from pac.access_grants grant_record
  where grant_record.grant_id = requested_grant_id;
  if selected_grant.grant_id is null
    or selected_grant.grant_contract_version <> 'protected-v1'
    or selected_grant.environment <> requested_environment
    or selected_grant.role_key = 'owner' then
    raise exception 'The protected grant is not revocable through this operation' using errcode = '42501';
  end if;
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    selected_grant.scope_id,
    'owner',
    'grant_revoke',
    'grant',
    requested_grant_id::text,
    pac.protected_action_fingerprint(
      'grant_revoke',
      jsonb_build_object(
        'environment', requested_environment,
        'grantId', requested_grant_id,
        'reason', requested_reason
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || selected_grant.account_id::text, 0)
  );
  select * into selected_grant
  from pac.access_grants grant_record
  where grant_record.grant_id = requested_grant_id
  for update;
  if selected_grant.revoked_at is not null then
    raise exception 'The grant has already been revoked' using errcode = '40001';
  end if;
  update pac.access_grants
  set revoked_at = clock_timestamp(),
      revoked_by = selected_authorization.account_id::text,
      revoked_by_account_id = selected_authorization.account_id,
      revoked_by_session_id = selected_authorization.session_id,
      revocation_reason = requested_reason
  where grant_id = requested_grant_id;
  perform pac.consume_protected_action(created_authorization_id, 'grant', requested_grant_id::text);
  return true;
end;
$$;

create or replace function pac.revoke_program_account_invitation(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_invitation_id uuid,
  requested_reason text
)
returns boolean
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
begin
  if requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 500
    or requested_reason ~ '[[:cntrl:]]' then
    raise exception 'Invalid invitation-revocation reason' using errcode = '22023';
  end if;
  if not exists (
    select 1 from pac.program_account_invitations invitation
    where invitation.invitation_id = requested_invitation_id
      and invitation.environment = requested_environment
  ) then
    raise exception 'The invitation is not available in this environment' using errcode = '42501';
  end if;
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'one-dhs-pac',
    'owner',
    'invitation_revoke',
    'invitation',
    requested_invitation_id::text,
    pac.protected_action_fingerprint(
      'invitation_revoke',
      jsonb_build_object(
        'environment', requested_environment,
        'invitationId', requested_invitation_id,
        'reason', requested_reason
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  perform 1 from pac.program_account_invitation_secrets secret
  where secret.invitation_id = requested_invitation_id
  for update;
  if not found or exists (
    select 1 from pac.program_account_invitation_closures closure
    where closure.invitation_id = requested_invitation_id
  ) then
    raise exception 'The invitation is already closed or unavailable' using errcode = '40001';
  end if;
  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, closed_by_account_id, closed_by_session_id, reason
  ) values (
    requested_invitation_id,
    'revoked',
    selected_authorization.account_id,
    selected_authorization.session_id,
    requested_reason
  );
  delete from pac.program_account_invitation_secrets
  where invitation_id = requested_invitation_id;
  perform pac.consume_protected_action(created_authorization_id, 'invitation', requested_invitation_id::text);
  return true;
end;
$$;

create or replace function pac.change_program_account_state(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_account_id uuid,
  requested_state text,
  requested_reason text
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
    or requested_reason ~ '[[:cntrl:]]' then
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
        'reason', requested_reason
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  if requested_account_id = selected_authorization.account_id then
    raise exception 'The global owner cannot change the state of the active owner account from its own session' using errcode = '42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_account_id::text, 0)
  );
  if not exists (
    select 1 from pac.program_accounts account
    where account.account_id = requested_account_id
      and account.environment = requested_environment
  ) then
    raise exception 'The account is not available in this environment' using errcode = '42501';
  end if;
  select * into current_event
  from pac.program_account_state_events state_event
  where state_event.account_id = requested_account_id
  order by state_event.account_state_event_id desc
  limit 1;
  if current_event.account_state_event_id is null then
    raise exception 'The account does not exist' using errcode = 'P0002';
  end if;
  insert into pac.program_account_state_events (
    account_id, state, reason, recorded_by_account_id, recorded_by_session_id,
    supersedes_account_state_event_id
  ) values (
    requested_account_id,
    requested_state,
    requested_reason,
    selected_authorization.account_id,
    selected_authorization.session_id,
    current_event.account_state_event_id
  ) returning * into created_event;
  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, closed_by_account_id, closed_by_session_id, reason
  )
  select reset_invitation.invitation_id,
    'revoked',
    selected_authorization.account_id,
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

create or replace function pac.relinquish_program_owner(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_reason text,
  requested_fingerprint text
)
returns boolean
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_authorization_id uuid;
  selected_authorization pac.protected_action_authorizations%rowtype;
  selected_account_id uuid;
  current_event pac.program_account_state_events%rowtype;
  owner_grant pac.access_grants%rowtype;
begin
  if requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 500
    or requested_reason ~ '[[:cntrl:]]' then
    raise exception 'Invalid owner-revocation reason' using errcode = '22023';
  end if;
  select session.account_id into selected_account_id
  from pac.program_account_sessions session
  where session.token_digest = requested_session_token_digest
    and session.environment = requested_environment;
  if selected_account_id is null then
    raise exception 'A verified owner session is required' using errcode = '42501';
  end if;
  created_authorization_id := pac.authorize_protected_action(
    requested_session_token_digest,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'one-dhs-pac',
    'owner',
    'account_revoke',
    'account',
    selected_account_id::text,
    pac.protected_action_fingerprint(
      'account_revoke',
      jsonb_build_object(
        'environment', requested_environment,
        'accountId', selected_account_id,
        'reason', requested_reason,
        'operation', 'owner_relinquishment'
      )
    )
  );
  select * into selected_authorization
  from pac.protected_action_authorizations stored
  where stored.authorization_id = created_authorization_id;
  select * into current_event
  from pac.program_account_state_events state_event
  where state_event.account_id = selected_authorization.account_id
  order by state_event.account_state_event_id desc
  limit 1;
  select * into owner_grant
  from pac.access_grants grant_record
  where grant_record.account_id = selected_authorization.account_id
    and grant_record.scope_id = 'one-dhs-pac'
    and grant_record.environment = requested_environment
    and grant_record.role_key = 'owner'
    and grant_record.grant_contract_version = 'protected-v1'
    and grant_record.revoked_at is null
  for update;
  if current_event.account_state_event_id is null or owner_grant.grant_id is null then
    raise exception 'The global owner authority is not active' using errcode = '42501';
  end if;
  insert into pac.program_account_state_events (
    account_id, state, reason, recorded_by_account_id, recorded_by_session_id,
    supersedes_account_state_event_id
  ) values (
    selected_authorization.account_id,
    'revoked',
    requested_reason,
    selected_authorization.account_id,
    selected_authorization.session_id,
    current_event.account_state_event_id
  );
  update pac.access_grants
  set revoked_at = clock_timestamp(),
      revoked_by = selected_authorization.account_id::text,
      revoked_by_account_id = selected_authorization.account_id,
      revoked_by_session_id = selected_authorization.session_id,
      revocation_reason = requested_reason
  where account_id = selected_authorization.account_id
    and grant_contract_version = 'protected-v1'
    and revoked_at is null;
  insert into pac.program_account_session_revocations (
    session_id, reason, revoked_by_account_id, revoked_by_session_id
  )
  select session.session_id,
    'Global owner authority was revoked.',
    selected_authorization.account_id,
    selected_authorization.session_id
  from pac.program_account_sessions session
  where session.account_id = selected_authorization.account_id
    and not exists (
      select 1 from pac.program_account_session_revocations revoked
      where revoked.session_id = session.session_id
    );
  perform pac.consume_protected_action(
    created_authorization_id,
    'account_state_event',
    current_event.account_state_event_id::text
  );
  return true;
end;
$$;

create or replace function pac.read_program_access_overview(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text
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
        'account_id', account.account_id,
        'sign_in_id', account.sign_in_id,
        'display_name', account.display_name,
        'state', current_state.state,
        'created_at', account.created_at
      ) order by account.display_name, account.account_id)
      from pac.program_accounts account
      join lateral (
        select state_event.state
        from pac.program_account_state_events state_event
        where state_event.account_id = account.account_id
        order by state_event.account_state_event_id desc
        limit 1
      ) current_state on true
      where account.environment = requested_environment
    ), '[]'::jsonb),
    'grants', coalesce((
      select jsonb_agg(jsonb_build_object(
        'grant_id', grant_record.grant_id,
        'account_id', grant_record.account_id,
        'scope_id', grant_record.scope_id,
        'role_key', grant_record.role_key,
        'granted_at', grant_record.granted_at,
        'expires_at', grant_record.expires_at,
        'revoked_at', grant_record.revoked_at
      ) order by grant_record.granted_at, grant_record.grant_id)
      from pac.access_grants grant_record
      where grant_record.grant_contract_version = 'protected-v1'
        and grant_record.environment = requested_environment
    ), '[]'::jsonb),
    'open_invitations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'invitation_id', invitation.invitation_id,
        'invitation_type', invitation.invitation_type,
        'sign_in_id', invitation.sign_in_id,
        'display_name', invitation.display_name,
        'issued_at', invitation.issued_at,
        'expires_at', secret.expires_at
      ) order by invitation.issued_at, invitation.invitation_id)
      from pac.program_account_invitations invitation
      join pac.program_account_invitation_secrets secret
        on secret.invitation_id = invitation.invitation_id
      where secret.expires_at > statement_timestamp()
        and invitation.environment = requested_environment
        and not exists (
          select 1 from pac.program_account_invitation_closures closure
          where closure.invitation_id = invitation.invitation_id
        )
    ), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

create or replace function pac.purge_expired_program_security_records()
returns table (expired_invitations_closed integer, expired_sessions_deleted integer)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  closed_count integer := 0;
  deleted_count integer := 0;
begin
  with candidates as materialized (
    select secret.invitation_id
    from pac.program_account_invitation_secrets secret
    where secret.expires_at <= clock_timestamp()
    order by secret.expires_at, secret.invitation_id
    for update skip locked
    limit 10000
  ), recorded as (
    insert into pac.program_account_invitation_closures (
      invitation_id, outcome, reason
    )
    select invitation_id, 'expired', 'Invitation expired before it was accepted.'
    from candidates
    on conflict on constraint program_account_invitation_closures_pkey do nothing
    returning invitation_id
  ), removed as (
    delete from pac.program_account_invitation_secrets secret
    using candidates
    where secret.invitation_id = candidates.invitation_id
    returning secret.invitation_id
  )
  select count(*)::integer into closed_count from recorded;

  with candidates as materialized (
    select session.session_id
    from pac.program_account_sessions session
    where session.expires_at <= clock_timestamp() - interval '10 minutes'
    order by session.expires_at, session.session_id
    for update skip locked
    limit 10000
  ), removed as (
    delete from pac.program_account_sessions session
    using candidates
    where session.session_id = candidates.session_id
    returning session.session_id
  )
  select count(*)::integer into deleted_count from removed;
  expired_invitations_closed := closed_count;
  expired_sessions_deleted := deleted_count;
  return next;
end;
$$;

create or replace function pac.attest_program_identity_runtime_boundary()
returns table (
  runtime_role text,
  session_role text,
  account_table_denied boolean,
  authorization_allocator_denied boolean,
  authorization_consumer_denied boolean,
  rate_limit_policy_denied boolean
)
language sql
stable
security invoker
set search_path = pg_catalog, pac
as $$
  select
    current_user::text,
    session_user::text,
    not pg_catalog.has_table_privilege(current_user, 'pac.program_accounts', 'select'),
    not pg_catalog.has_function_privilege(
      current_user,
      'pac.authorize_protected_action(text,text,text,text,text,text,text,text,text,text)',
      'execute'
    ),
    not pg_catalog.has_function_privilege(
      current_user,
      'pac.consume_protected_action(uuid,text,text)',
      'execute'
    ),
    not pg_catalog.has_function_privilege(
      current_user,
      'pac.assert_runtime_rate_limit_request(text,text,integer,integer)',
      'execute'
    );
$$;

-- The application role can reach only the finite, session-aware entry points.
-- It cannot inspect credential/token tables, manufacture actor identifiers, or
-- call the internal authorization allocator directly.
do $$
declare
  table_name text;
  role_name text;
begin
  foreach table_name in array array[
    'program_accounts',
    'program_account_state_events',
    'program_account_invitations',
    'program_account_invitation_secrets',
    'program_account_invitation_closures',
    'program_account_credentials',
    'program_account_credential_secrets',
    'program_account_sessions',
    'program_account_session_revocations',
    'protected_action_authorizations',
    'protected_action_consumptions'
  ]
  loop
    execute format('alter table pac.%I enable row level security', table_name);
    execute format('revoke all privileges on pac.%I from public', table_name);
    if exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_contributor_runtime') then
      execute format('revoke all privileges on pac.%I from pac_contributor_runtime', table_name);
    end if;
    foreach role_name in array array['anon', 'authenticated']
    loop
      if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
        execute format('revoke all privileges on pac.%I from %I', table_name, role_name);
      end if;
    end loop;
  end loop;
end;
$$;

revoke all privileges on function pac.prevent_protected_access_grant_mutation() from public, pac_contributor_runtime;
revoke all privileges on function pac.assert_program_account_invitation_secret() from public, pac_contributor_runtime;
revoke all privileges on function pac.assert_program_account_state_event() from public, pac_contributor_runtime;
revoke all privileges on function pac.assert_protected_action_consumption() from public, pac_contributor_runtime;
revoke all privileges on function pac.program_account_is_active(uuid) from public, pac_contributor_runtime;
revoke all privileges on function pac.lookup_program_login_credential(text, text) from public;
revoke all privileges on function pac.start_program_account_session(uuid, uuid, text, text, text, text) from public;
revoke all privileges on function pac.read_program_account_session(text, text, text, text) from public;
revoke all privileges on function pac.end_program_account_session(text, text) from public;
revoke all privileges on function pac.bootstrap_program_owner_invitation(text, text, text, text, timestamptz, text, text) from public, pac_contributor_runtime;
revoke all privileges on function pac.accept_program_account_invitation(text, text, text, text, text, text) from public;
revoke all privileges on function pac.authorize_protected_action(text, text, text, text, text, text, text, text, text, text) from public, pac_contributor_runtime;
revoke all privileges on function pac.consume_protected_action(uuid, text, text) from public, pac_contributor_runtime;
revoke all privileges on function pac.create_program_account_invitation(text, text, text, text, text, text, text, timestamptz) from public;
revoke all privileges on function pac.create_program_credential_reset_invitation(text, text, text, text, uuid, text, timestamptz) from public;
revoke all privileges on function pac.issue_program_access_grant(text, text, text, text, uuid, text, text, timestamptz, text) from public;
revoke all privileges on function pac.revoke_program_access_grant(text, text, text, text, uuid, text) from public;
revoke all privileges on function pac.revoke_program_account_invitation(text, text, text, text, uuid, text) from public;
revoke all privileges on function pac.change_program_account_state(text, text, text, text, uuid, text, text) from public;
revoke all privileges on function pac.relinquish_program_owner(text, text, text, text, text, text) from public;
revoke all privileges on function pac.read_program_access_overview(text, text, text, text) from public;
revoke all privileges on function pac.purge_expired_program_security_records() from public;
revoke all privileges on function pac.assert_runtime_rate_limit_request(text, text, integer, integer) from public, pac_contributor_runtime;
revoke all privileges on function pac.attest_program_identity_runtime_boundary() from public, pac_contributor_runtime;

do $$
begin
  if exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_contributor_runtime') then
    -- Credential lookup and session minting are intentionally withheld here.
    -- Migration 0022 installs a separately isolated authentication broker; no
    -- committed migration state may make the general runtime an authenticator.
    grant execute on function pac.read_program_account_session(text, text, text, text) to pac_contributor_runtime;
    grant execute on function pac.end_program_account_session(text, text) to pac_contributor_runtime;
    grant execute on function pac.accept_program_account_invitation(text, text, text, text, text, text) to pac_contributor_runtime;
grant execute on function pac.create_program_account_invitation(text, text, text, text, text, text, text, timestamptz) to pac_contributor_runtime;
grant execute on function pac.create_program_credential_reset_invitation(text, text, text, text, uuid, text, timestamptz) to pac_contributor_runtime;
grant execute on function pac.issue_program_access_grant(text, text, text, text, uuid, text, text, timestamptz, text) to pac_contributor_runtime;
grant execute on function pac.revoke_program_access_grant(text, text, text, text, uuid, text) to pac_contributor_runtime;
grant execute on function pac.revoke_program_account_invitation(text, text, text, text, uuid, text) to pac_contributor_runtime;
grant execute on function pac.change_program_account_state(text, text, text, text, uuid, text, text) to pac_contributor_runtime;
    grant execute on function pac.relinquish_program_owner(text, text, text, text, text, text) to pac_contributor_runtime;
    grant execute on function pac.read_program_access_overview(text, text, text, text) to pac_contributor_runtime;
    grant execute on function pac.purge_expired_program_security_records() to pac_contributor_runtime;
    grant execute on function pac.attest_program_identity_runtime_boundary() to pac_contributor_runtime;
  end if;
end;
$$;

do $$
declare
  role_name text;
  signature text;
begin
  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      foreach signature in array array[
        'pac.lookup_program_login_credential(text,text)',
        'pac.start_program_account_session(uuid,uuid,text,text,text,text)',
        'pac.read_program_account_session(text,text,text,text)',
        'pac.end_program_account_session(text,text)',
        'pac.bootstrap_program_owner_invitation(text,text,text,text,timestamptz,text,text)',
        'pac.accept_program_account_invitation(text,text,text,text,text,text)',
        'pac.authorize_protected_action(text,text,text,text,text,text,text,text,text,text)',
        'pac.consume_protected_action(uuid,text,text)',
    'pac.create_program_account_invitation(text,text,text,text,text,text,text,timestamptz)',
    'pac.create_program_credential_reset_invitation(text,text,text,text,uuid,text,timestamptz)',
    'pac.issue_program_access_grant(text,text,text,text,uuid,text,text,timestamptz,text)',
    'pac.revoke_program_access_grant(text,text,text,text,uuid,text)',
    'pac.revoke_program_account_invitation(text,text,text,text,uuid,text)',
    'pac.change_program_account_state(text,text,text,text,uuid,text,text)',
        'pac.relinquish_program_owner(text,text,text,text,text,text)',
        'pac.read_program_access_overview(text,text,text,text)',
        'pac.purge_expired_program_security_records()'
        ,'pac.attest_program_identity_runtime_boundary()'
      ]
      loop
        execute format('revoke all privileges on function %s from %I', signature, role_name);
      end loop;
    end if;
  end loop;
end;
$$;

comment on table pac.program_accounts is
  'Named protected-work identities only; no private learning, practice history, ideology, participation, or staff profile is attached.';
comment on table pac.program_account_invitations is
  'Owner-issued invitation metadata. The one-time bearer digest is isolated and destroyed on closure.';
comment on table pac.program_account_credentials is
  'Versioned credential metadata; only the current memory-hard verifier remains in the separately restricted secret table.';
comment on table pac.program_account_sessions is
  'Short-lived opaque individual protected-work sessions; browser tokens are never stored.';
comment on table pac.protected_action_authorizations is
  'Immutable action-time proof of the named account, exact session, exact credential, exact grant, role, and scope.';
comment on table pac.protected_action_consumptions is
  'One-use binding from an action-time authorization to the exact protected action record.';
comment on function pac.bootstrap_program_owner_invitation(text, text, text, text, timestamptz, text, text) is
  'One-time migration-owner bootstrap only; never callable by the application runtime role.';
comment on function pac.authorize_protected_action(text, text, text, text, text, text, text, text, text, text) is
  'Internal transaction-time authorization allocator; callers cannot supply actor, effective role, or effective grant.';

commit;
