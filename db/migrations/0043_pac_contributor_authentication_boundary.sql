begin;
-- Local named-contributor adaptation, owner authorized 2026-09-08.
-- Selective donor identity lineage0021/0022/0023; existing owner functions and grants remain intact.
-- Hosted PostgreSQL may grant its creator administrative control without INHERIT or SET.
-- Only that unusable migration-owner membership is permitted; runtime role paths remain denied.
do $role$ begin
if not exists(select 1 from pg_roles where rolname='pac_authentication_broker') then
create role pac_authentication_broker login noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls connection limit 20; end if;
if not exists(select 1 from pg_roles where rolname='pac_authentication_broker' and rolcanlogin and not rolinherit and not rolsuper and not rolcreatedb and not rolcreaterole and not rolreplication and not rolbypassrls and rolconnlimit between 1 and 20)
or exists(select 1 from pg_auth_members m join pg_roles r on r.oid=m.member join pg_roles g on g.oid=m.roleid where (r.rolname='pac_authentication_broker' or g.rolname='pac_authentication_broker')
  and not (g.rolname='pac_authentication_broker' and r.rolname=current_user
    and m.admin_option and not m.inherit_option and not m.set_option)) then raise exception 'Unsafe existing pac_authentication_broker role' using errcode='42501'; end if;
execute format('grant connect on database %I to pac_authentication_broker',current_database()); end $role$;
alter role pac_authentication_broker set statement_timeout='10s';
alter role pac_authentication_broker set lock_timeout='5s';
alter role pac_authentication_broker set idle_in_transaction_session_timeout='10s';


-- Password verification is an intentionally separate trust boundary. The
-- ordinary application role must never be able to combine a verifier lookup
-- with session creation and thereby impersonate a named account. A dedicated
-- broker role receives only three functions in a schema the runtime cannot use.
create schema if not exists pac_auth;
revoke all privileges on schema pac_auth from public;
revoke all privileges on all tables in schema pac_auth from public;
revoke all privileges on all sequences in schema pac_auth from public;
revoke all privileges on all functions in schema pac_auth from public;
do $$
declare
  role_name text;
begin
  if not exists (
    select 1
    from pg_catalog.pg_namespace namespace
    where namespace.nspname = 'pac_auth'
      and namespace.nspowner = (select oid from pg_catalog.pg_roles where rolname = current_user)
  ) then
    raise exception 'The pac_auth schema must be owned by the approved migration role'
      using errcode = '42501';
  end if;
  if exists (
    select 1
    from pg_catalog.pg_class relation
    join pg_catalog.pg_namespace namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'pac_auth'
      and relation.relowner <> (select oid from pg_catalog.pg_roles where rolname = current_user)
    union all
    select 1
    from pg_catalog.pg_proc procedure
    join pg_catalog.pg_namespace namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'pac_auth'
      and procedure.proowner <> (select oid from pg_catalog.pg_roles where rolname = current_user)
  ) then
    raise exception 'Every pre-existing pac_auth object must be owned by the approved migration role'
      using errcode = '42501';
  end if;

  for role_name in
    select role_record.rolname
    from pg_catalog.pg_roles role_record
    where role_record.rolname <> current_user
  loop
    execute format('revoke all privileges on schema pac_auth from %I', role_name);
    execute format('revoke all privileges on all tables in schema pac_auth from %I', role_name);
    execute format('revoke all privileges on all sequences in schema pac_auth from %I', role_name);
    execute format('revoke all privileges on all functions in schema pac_auth from %I', role_name);
  end loop;
end;
$$;
alter default privileges in schema pac_auth revoke all privileges on tables from public;
alter default privileges in schema pac_auth revoke all privileges on sequences from public;
alter default privileges in schema pac_auth revoke all privileges on functions from public;

create table if not exists pac.database_installation_identity (
  singleton text primary key default 'primary' check (singleton = 'primary'),
  installation_id uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default clock_timestamp()
);
insert into pac.database_installation_identity (singleton)
values ('primary')
on conflict (singleton) do nothing;
alter table pac.database_installation_identity enable row level security;
revoke all privileges on table pac.database_installation_identity from public, pac_contributor_runtime;

create table if not exists pac.protected_feature_activation_events (
  activation_event_id bigint generated always as identity primary key,
  environment text not null check (environment in ('local', 'preview', 'production')),
  feature_key text not null check (feature_key in ('protected_identity', 'protected_contribution')),
  state text not null check (state in ('active', 'inactive')),
  evidence_id text not null check (evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'),
  activation_bundle_sha256 text not null check (activation_bundle_sha256 ~ '^[a-f0-9]{64}$'),
  reason text not null check (
    char_length(reason) between 3 and 500
    and reason = btrim(reason)
    and reason !~ '[[:cntrl:]]'
  ),
  recorded_at timestamptz not null default clock_timestamp()
);

create index if not exists protected_feature_activation_current_idx
  on pac.protected_feature_activation_events(
    environment, feature_key, activation_event_id desc
  );

create or replace function pac.record_protected_feature_activation(
  requested_environment text,
  requested_feature_key text,
  requested_state text,
  requested_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_reason text
)
returns bigint
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  created_event_id bigint;
begin
  if session_user in ('pac_contributor_runtime','pac_contributor_runtime','pac_authentication_broker')
    or requested_environment is null
    or requested_environment not in ('local', 'preview', 'production')
    or requested_feature_key not in ('protected_identity', 'protected_contribution')
    or requested_state not in ('active', 'inactive')
    or requested_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_bundle_sha256 !~ '^[a-f0-9]{64}$'
    or requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 500
    or requested_reason ~ '[[:cntrl:]]' then
    raise exception 'Invalid protected-feature activation event' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'pac-protected-feature:' || requested_environment || ':' || requested_feature_key,
      0
    )
  );
  insert into pac.protected_feature_activation_events (
    environment, feature_key, state, evidence_id,
    activation_bundle_sha256, reason
  ) values (
    requested_environment, requested_feature_key, requested_state,
    requested_evidence_id, requested_activation_bundle_sha256, requested_reason
  ) returning activation_event_id into created_event_id;
  return created_event_id;
end;
$$;

-- A protected content change carries both the named-session authorization from
-- 0021 and the exact dependent-feature evidence rechecked by the application
-- immediately before this transaction. The table is append-only and contains
-- no submitted content, bearer, passphrase, question, or learning activity.
create table if not exists pac.protected_mutation_feature_evidence (
  authorization_id uuid primary key
    references pac.protected_action_authorizations(authorization_id),
  activation_event_id bigint not null
    references pac.protected_feature_activation_events(activation_event_id),
  feature_key text not null check (feature_key = 'protected_contribution'),
  environment text not null check (environment in ('local', 'preview', 'production')),
  evidence_id text not null check (evidence_id ~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'),
  activation_bundle_sha256 text not null check (activation_bundle_sha256 ~ '^[a-f0-9]{64}$'),
  recorded_at timestamptz not null default clock_timestamp()
);

create table if not exists pac.program_owner_transfers (
  transfer_id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('local', 'preview', 'production')),
  authorization_id uuid not null unique
    references pac.protected_action_authorizations(authorization_id),
  from_account_id uuid not null references pac.program_accounts(account_id),
  to_account_id uuid not null references pac.program_accounts(account_id),
  from_grant_id uuid not null references pac.access_grants(grant_id),
  to_grant_id uuid not null unique references pac.access_grants(grant_id),
  reason text not null check (
    char_length(reason) between 3 and 500
    and reason = btrim(reason)
    and reason !~ '[[:cntrl:]]'
  ),
  transferred_at timestamptz not null default clock_timestamp(),
  check (from_account_id <> to_account_id)
);

create or replace function pac.prevent_named_protected_evidence_mutation()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
as $$
begin
  raise exception 'Named protected evidence is append-only' using errcode = '42501';
end;
$$;
create or replace function pac.transfer_program_owner(
  requested_session_token_digest text,
  requested_environment text,
  requested_activation_evidence_id text,
  requested_activation_bundle_sha256 text,
  requested_successor_account_id uuid,
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
    or requested_reason is null
    or requested_reason <> btrim(requested_reason)
    or char_length(requested_reason) not between 3 and 471
    or requested_reason ~ '[[:cntrl:]]' then
    raise exception 'Invalid owner-transfer reason' using errcode = '22023';
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
    and account.environment = requested_environment;
  if successor_account.account_id is null
    or not pac.program_account_is_active(requested_successor_account_id) then
    raise exception 'The successor account must be active in this environment' using errcode = '42501';
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

-- Recovery rotates only the credential of the existing active owner. It does
-- not create an account or owner grant, and the application role cannot call it.
create or replace function pac.create_program_owner_recovery_invitation(
  requested_environment text,
  requested_owner_account_id uuid,
  requested_token_digest text,
  requested_expires_at timestamptz,
  requested_recovery_evidence_id text,
  requested_activation_evidence_id text,
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
  owner_account pac.program_accounts%rowtype;
  created_invitation_id uuid := gen_random_uuid();
begin
  if session_user = 'pac_contributor_runtime'
    or requested_environment not in ('local', 'preview', 'production')
    or requested_token_digest !~ '^[a-f0-9]{64}$'
    or requested_recovery_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_evidence_id !~ '^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$'
    or requested_activation_bundle_sha256 !~ '^[a-f0-9]{64}$'
    or requested_expires_at <= clock_timestamp() + interval '5 minutes'
    or requested_expires_at > clock_timestamp() + interval '7 days' then
    raise exception 'Invalid owner-recovery invitation request' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-owner:' || requested_environment, 0)
  );
  -- Match the account lock taken by ordinary authorization before touching
  -- credential, session, or grant rows. This makes recovery wait for an
  -- in-flight owner action and then prevents a session/grant FK deadlock while
  -- the incident-containment revocations are recorded.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('pac-program-account:' || requested_owner_account_id::text, 0)
  );
  select account.* into owner_account
  from pac.program_accounts account
  join pac.access_grants owner_grant
    on owner_grant.account_id = account.account_id
  where account.account_id = requested_owner_account_id
    and account.environment = requested_environment
    and owner_grant.environment = requested_environment
    and owner_grant.scope_id = 'one-dhs-pac'
    and owner_grant.role_key = 'owner'
    and owner_grant.grant_contract_version = 'protected-v1'
    and owner_grant.revoked_at is null
    and (owner_grant.expires_at is null or owner_grant.expires_at > clock_timestamp())
  for update of account, owner_grant;
  if owner_account.account_id is null
    or not pac.program_account_is_active(owner_account.account_id) then
    raise exception 'Recovery is limited to the existing active owner account'
      using errcode = '42501';
  end if;

  insert into pac.program_account_invitation_closures (
    invitation_id, outcome, recovery_evidence_id, reason
  )
  select distinct prior.invitation_id,
    'superseded',
    requested_recovery_evidence_id,
    'Migration-owner recovery invalidated this unaccepted code before issuing a fresh owner recovery code.'
  from pac.program_account_invitations prior
  join pac.program_account_invitation_secrets secret
    on secret.invitation_id = prior.invitation_id
  left join pac.protected_action_authorizations issuer
    on issuer.authorization_id = prior.issued_by_authorization_id
  where prior.environment = requested_environment
    and (
      prior.target_account_id = owner_account.account_id
      or issuer.account_id = owner_account.account_id
    )
    and not exists (
      select 1 from pac.program_account_invitation_closures closure
      where closure.invitation_id = prior.invitation_id
    )
  on conflict on constraint program_account_invitation_closures_pkey do nothing;
  delete from pac.program_account_invitation_secrets secret
  using pac.program_account_invitations prior,
    pac.program_account_invitation_closures closure
  where secret.invitation_id = prior.invitation_id
    and closure.invitation_id = prior.invitation_id
    and prior.environment = requested_environment
    and closure.outcome = 'superseded'
    and closure.recovery_evidence_id = requested_recovery_evidence_id;

  -- Recovery is also incident containment. Once the migration owner issues a
  -- code, the possibly compromised credential and every live owner session are
  -- unusable. Acceptance creates a new credential and session atomically.
  delete from pac.program_account_credential_secrets secret
  using pac.program_account_credentials credential
  where secret.credential_id = credential.credential_id
    and credential.account_id = owner_account.account_id;
  insert into pac.program_account_session_revocations (session_id, reason)
  select owner_session.session_id,
    'Owner recovery was initiated; a new credential is required.'
  from pac.program_account_sessions owner_session
  where owner_session.account_id = owner_account.account_id
    and owner_session.environment = requested_environment
    and not exists (
      select 1
      from pac.program_account_session_revocations revoked
      where revoked.session_id = owner_session.session_id
    );

  insert into pac.program_account_invitations (
    invitation_id, environment, activation_evidence_id,
    activation_bundle_sha256, invitation_type, sign_in_id, display_name,
    target_account_id, bootstrap_evidence_id
  ) values (
    created_invitation_id,
    requested_environment,
    requested_activation_evidence_id,
    requested_activation_bundle_sha256,
    'owner_recovery',
    owner_account.sign_in_id,
    owner_account.display_name,
    owner_account.account_id,
    requested_recovery_evidence_id
  );
  insert into pac.program_account_invitation_secrets (
    invitation_id, token_digest, expires_at
  ) values (
    created_invitation_id,
    requested_token_digest,
    requested_expires_at
  );
  return query select created_invitation_id, requested_expires_at;
end;
$$;

-- The old self-relinquishment operation could strand administration. Remove it
-- entirely; runtime succession must use the atomic transfer above.
revoke all privileges on function pac.relinquish_program_owner(text, text, text, text, text, text)
  from public, pac_contributor_runtime;
drop function pac.relinquish_program_owner(text, text, text, text, text, text);

alter table pac.protected_mutation_feature_evidence enable row level security;
alter table pac.program_owner_transfers enable row level security;
alter table pac.protected_feature_activation_events enable row level security;
revoke all privileges on table pac.protected_mutation_feature_evidence from public, pac_contributor_runtime;
revoke all privileges on table pac.program_owner_transfers from public, pac_contributor_runtime;
revoke all privileges on table pac.protected_feature_activation_events from public, pac_contributor_runtime;

drop trigger if exists protected_mutation_feature_evidence_append_only
  on pac.protected_mutation_feature_evidence;
create trigger protected_mutation_feature_evidence_append_only
before update or delete on pac.protected_mutation_feature_evidence
for each row execute function pac.prevent_named_protected_evidence_mutation();

drop trigger if exists protected_feature_activation_events_append_only
  on pac.protected_feature_activation_events;
create trigger protected_feature_activation_events_append_only
before update or delete on pac.protected_feature_activation_events
for each row execute function pac.prevent_named_protected_evidence_mutation();

drop trigger if exists program_owner_transfers_append_only
  on pac.program_owner_transfers;
create trigger program_owner_transfers_append_only
before update or delete on pac.program_owner_transfers
for each row execute function pac.prevent_named_protected_evidence_mutation();

create or replace function pac.assert_exact_jsonb_keys(
  candidate jsonb,
  required_keys text[],
  allowed_keys text[]
)
returns void
language plpgsql
immutable
security definer
set search_path = pg_catalog, pac
as $$
begin
  if candidate is null
    or required_keys is null
    or allowed_keys is null
    or jsonb_typeof(candidate) is distinct from 'object'
    or exists (
      select 1 from jsonb_object_keys(candidate) supplied(key)
      where supplied.key <> all(allowed_keys)
    )
    or exists (
      select 1 from unnest(required_keys) required(key)
      where not candidate ? required.key
    ) then
    raise exception 'Protected mutation payload does not match its finite contract'
      using errcode = '22023';
  end if;
end;
$$;

revoke all privileges on function pac.record_protected_feature_activation(text,text,text,text,text,text) from public,pac_contributor_runtime,pac_authentication_broker;
revoke all privileges on function pac.create_program_owner_recovery_invitation(text,uuid,text,timestamptz,text,text,text) from public,pac_contributor_runtime,pac_authentication_broker;
revoke all privileges on function pac.assert_exact_jsonb_keys(jsonb,text[],text[]) from public,pac_contributor_runtime,pac_authentication_broker;
revoke all privileges on function pac.prevent_named_protected_evidence_mutation() from public,pac_contributor_runtime,pac_authentication_broker;
revoke all privileges on schema pac from pac_authentication_broker;
revoke all privileges on all tables in schema pac from pac_authentication_broker;
revoke all privileges on all sequences in schema pac from pac_authentication_broker;
revoke all privileges on all functions in schema pac from pac_authentication_broker;
alter role pac_authentication_broker set search_path=pac_auth,pg_catalog;
commit;
