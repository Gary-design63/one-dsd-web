begin;

-- Content-free deletion evidence. No question, answer, author, address or staff
-- identifier is retained here. This receipt alone is not an external backup journal.
create table pac.ask_response_deletions (
  record_id uuid primary key,
  deleted_at timestamptz not null default clock_timestamp(),
  reason text not null check(reason in ('owner_delete','retention_expired','restore_excluded'))
);
alter table pac.ask_response_deletions enable row level security;
revoke all on pac.ask_response_deletions from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
create trigger ask_response_deletions_immutable before update or delete on pac.ask_response_deletions
for each row execute function pac.prevent_immutable_change();

create or replace function pac.append_ask_response_record(p_record jsonb) returns void
language plpgsql security definer set search_path=pg_catalog,pac as $$
declare existing jsonb; requested_id uuid := (p_record->>'id')::uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended('pac-ask-record:'||requested_id::text,0));
  if exists(select 1 from pac.ask_response_deletions where record_id=requested_id) then
    raise exception 'ASK record was deleted and cannot be restored by append.' using errcode='55000';
  end if;
  insert into pac.ask_response_records(record_id,created_at,expires_at,record)
  values(requested_id,(p_record->>'createdAt')::timestamptz,(p_record->>'expiresAt')::timestamptz,p_record)
  on conflict(record_id) do nothing;
  select record into existing from pac.ask_response_records where record_id=requested_id;
  if existing is distinct from p_record then raise exception 'ASK record is immutable'; end if;
end $$;

create or replace function pac.list_ask_response_records(p_limit integer,p_before_at timestamptz,p_before_id uuid,p_now timestamptz)
returns table(record jsonb) language plpgsql security definer set search_path=pg_catalog,pac as $$
begin
  if p_limit is null or p_limit<1 or p_limit>101 or p_now is null or ((p_before_at is null)<>(p_before_id is null)) then raise exception 'Invalid record page'; end if;
  return query select r.record from pac.ask_response_records r
  where not exists(select 1 from pac.ask_response_deletions d where d.record_id=r.record_id)
    and (r.expires_at is null or r.expires_at>p_now)
    and (p_before_at is null or (r.created_at,r.record_id)<(p_before_at,p_before_id))
  order by r.created_at desc,r.record_id desc limit p_limit;
end $$;

create or replace function pac.delete_ask_response_records(p_ids jsonb) returns integer
language plpgsql security definer set search_path=pg_catalog,pac as $$
declare deleted integer; requested_id uuid;
begin
  if p_ids is null or jsonb_typeof(p_ids)<>'array' or jsonb_array_length(p_ids)<1 or jsonb_array_length(p_ids)>100
    or exists(select 1 from jsonb_array_elements(p_ids) v where jsonb_typeof(v)<>'string') then raise exception 'Invalid record selection'; end if;
  for requested_id in select distinct value::uuid from jsonb_array_elements_text(p_ids) order by value::uuid loop
    perform pg_advisory_xact_lock(hashtextextended('pac-ask-record:'||requested_id::text,0));
    insert into pac.ask_response_deletions(record_id,reason) values(requested_id,'owner_delete') on conflict(record_id) do nothing;
  end loop;
  delete from pac.ask_response_records where record_id in(select value::uuid from jsonb_array_elements_text(p_ids));
  get diagnostics deleted=row_count; return deleted;
end $$;

create or replace function pac.purge_expired_ask_response_records(p_now timestamptz) returns integer
language plpgsql security definer set search_path=pg_catalog,pac as $$
declare requested_id uuid; deleted integer := 0; removed integer;
begin
  if p_now is null then raise exception 'Invalid record cleanup time'; end if;
  for requested_id in select record_id from pac.ask_response_records where expires_at<=p_now order by record_id limit 1000 loop
    perform pg_advisory_xact_lock(hashtextextended('pac-ask-record:'||requested_id::text,0));
    insert into pac.ask_response_deletions(record_id,reason) values(requested_id,'retention_expired') on conflict(record_id) do nothing;
    delete from pac.ask_response_records where record_id=requested_id and expires_at<=p_now;
    get diagnostics removed=row_count; deleted:=deleted+removed;
  end loop;
  return deleted;
end $$;

create table pac.program_recovery_preparations (
  recovery_id uuid primary key,
  environment text not null check(environment in ('local','preview','production')),
  prepared_at timestamptz not null default clock_timestamp(),
  ask_records_excluded integer not null check(ask_records_excluded>=0),
  named_sessions_revoked integer not null check(named_sessions_revoked>=0),
  invitation_secrets_removed integer not null check(invitation_secrets_removed>=0),
  credential_secrets_removed integer not null check(credential_secrets_removed>=0)
);
alter table pac.program_recovery_preparations enable row level security;
revoke all on pac.program_recovery_preparations from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
create trigger program_recovery_preparations_immutable before update or delete on pac.program_recovery_preparations
for each row execute function pac.prevent_immutable_change();

-- Restored grants have no current authority merely because new credentials exist.
-- There is deliberately no application unlock. A later, independently verified
-- reconciliation is required before any named capability can be reactivated.
create function pac.enforce_restored_identity_quarantine() returns trigger
language plpgsql security definer set search_path=pg_catalog,pac as $$
begin
  if new.state='active' and exists(select 1 from pac.program_recovery_preparations where environment=new.environment) then
    raise exception 'Restored identity authority remains quarantined pending current grant reconciliation.' using errcode='55000';
  end if;
  return new;
end $$;
revoke all on function pac.enforce_restored_identity_quarantine() from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
create trigger restored_identity_quarantine before insert on pac.protected_feature_activation_events
for each row execute function pac.enforce_restored_identity_quarantine();

-- Migration-owner-only preparation, run while the restored target has no traffic.
-- Without a surviving current deletion journal, exclude ALL restored ASK bodies.
-- Credentials and invitation tokens in an old backup are not current authority.
create function pac.prepare_isolated_program_restore(p_environment text,p_recovery_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,pac set row_security=off as $$
declare prior pac.program_recovery_preparations%rowtype; activation pac.protected_feature_activation_events%rowtype;
  excluded integer; revoked integer; invitations integer; credentials integer;
begin
  if p_environment is null or p_environment not in ('local','preview','production') or p_recovery_id is null then
    raise exception 'Invalid isolated recovery preparation' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended('pac-isolated-program-restore',0));
  select * into prior from pac.program_recovery_preparations where recovery_id=p_recovery_id;
  if found then
    if prior.environment<>p_environment then raise exception 'Recovery boundary mismatch'; end if;
    return to_jsonb(prior);
  end if;
  if exists(select 1 from pac.program_accounts where environment<>p_environment) then
    raise exception 'Recovery target contains a different named identity environment' using errcode='42501'; end if;
  for activation in
    select distinct on(feature_key) * from pac.protected_feature_activation_events
    where environment=p_environment order by feature_key,activation_event_id desc
  loop
    perform pac.record_protected_feature_activation(p_environment,activation.feature_key,'inactive',activation.evidence_id,activation.activation_bundle_sha256,'Isolated restore: current authority must be reconciled before access.');
  end loop;
  insert into pac.program_account_session_revocations(session_id,reason)
    select session_id,'Old backup session invalidated during isolated restore.'
    from pac.program_account_sessions where environment=p_environment on conflict(session_id) do nothing;
  get diagnostics revoked=row_count;
  insert into pac.program_account_invitation_closures(invitation_id,outcome,recovery_evidence_id,reason)
    select i.invitation_id,'superseded','restore:'||p_recovery_id::text,'Old backup invitation invalidated during isolated restore.'
    from pac.program_account_invitations i join pac.program_account_invitation_secrets s using(invitation_id)
    where i.environment=p_environment on conflict(invitation_id) do nothing;
  delete from pac.program_account_invitation_secrets s using pac.program_account_invitations i where s.invitation_id=i.invitation_id and i.environment=p_environment;
  get diagnostics invitations=row_count;
  delete from pac.program_account_credential_secrets s using pac.program_account_credentials c,pac.program_accounts a
    where s.credential_id=c.credential_id and c.account_id=a.account_id and a.environment=p_environment;
  get diagnostics credentials=row_count;
  lock table pac.ask_response_records in access exclusive mode;
  insert into pac.ask_response_deletions(record_id,reason)
    select record_id,'restore_excluded' from pac.ask_response_records on conflict(record_id) do nothing;
  delete from pac.ask_response_records; get diagnostics excluded=row_count;
  insert into pac.program_recovery_preparations(recovery_id,environment,ask_records_excluded,named_sessions_revoked,invitation_secrets_removed,credential_secrets_removed)
    values(p_recovery_id,p_environment,excluded,revoked,invitations,credentials);
  select * into prior from pac.program_recovery_preparations where recovery_id=p_recovery_id;
  return to_jsonb(prior);
end $$;
revoke all on function pac.prepare_isolated_program_restore(text,uuid) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
-- Existing owner API functions keep their exact runtime execute grants.
revoke all on function pac.append_ask_response_record(jsonb) from public,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.list_ask_response_records(integer,timestamptz,uuid,timestamptz) from public,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.delete_ask_response_records(jsonb) from public,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.purge_expired_ask_response_records(timestamptz) from public,pac_contributor_runtime,pac_authentication_broker;
commit;
