begin;

-- A consultation tombstone is a short-lived replay and requester-status guard,
-- not permanent program memory. Only a record that passes the complete strict
-- consultation contract can authorize terminal deletion.
create or replace function pac.consultation_tombstone_terminal_delete_due(
  candidate_id text,
  candidate jsonb,
  cutoff timestamptz
)
returns boolean
language plpgsql
stable
strict
set search_path = pg_catalog, pac
as $$
begin
  begin
    perform pac.assert_consultation_persistence_contract(candidate_id, candidate);
  exception when others then
    return false;
  end;
  return candidate ->> 'record_type' = 'consultation_tombstone'
    and pac.is_canonical_utc_instant(candidate ->> 'redacted_at')
    and (candidate ->> 'redacted_at')::timestamptz <= cutoff;
end;
$$;

-- The previous function has four output columns. PostgreSQL requires a drop
-- before replacing it with the expanded, versioned lifecycle result.
drop function if exists pac.purge_expired_security_records();

create function pac.purge_expired_security_records()
returns table (
  owner_session_revocations_deleted integer,
  rate_limit_buckets_deleted integer,
  audit_events_deleted integer,
  research_usage_records_deleted integer,
  consultation_tombstones_deleted integer,
  idempotency_receipts_deleted integer
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pg_temp
set row_security = off
as $$
declare
  revocation_cutoff text;
  operational_cutoff timestamptz;
  tombstone_cutoff timestamptz;
  removed_revocations integer;
  removed_buckets integer;
  removed_audit_events integer;
  removed_research_usage integer;
  removed_tombstones integer;
  removed_receipts integer;
begin
  revocation_cutoff := to_char(
    (clock_timestamp() - interval '10 minutes') at time zone 'UTC',
    'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
  );
  operational_cutoff := clock_timestamp() - interval '90 days';
  tombstone_cutoff := clock_timestamp() - interval '30 days';

  with candidates as materialized (
    select work_kind, object_id
    from pac.runtime_work_objects
    where work_kind = 'decision'
      and object_id ~ '^owner-session-revoked-[a-f0-9]{64}$'
      and value ->> 'kind' = 'owner_session_revocation'
      and value ->> 'session_hash' ~ '^[a-f0-9]{64}$'
      and object_id = 'owner-session-revoked-' || (value ->> 'session_hash')
      and pac.is_canonical_utc_instant(value ->> 'revoked_at')
      and pac.is_canonical_utc_instant(value ->> 'expires_at')
      and value ->> 'revoked_at' <= value ->> 'expires_at'
      and value ->> 'expires_at' <= revocation_cutoff
    order by updated_at, object_id
    for update skip locked
    limit 10000
  ), removed as (
    delete from pac.runtime_work_objects stored
    using candidates
    where stored.work_kind = candidates.work_kind
      and stored.object_id = candidates.object_id
    returning 1
  )
  select count(*)::integer into removed_revocations from removed;

  with candidates as materialized (
    select scope, subject_hash
    from pac.runtime_rate_limits
    where reset_at <= clock_timestamp()
    order by reset_at, scope, subject_hash
    for update skip locked
    limit 10000
  ), removed as (
    delete from pac.runtime_rate_limits stored
    using candidates
    where stored.scope = candidates.scope
      and stored.subject_hash = candidates.subject_hash
    returning 1
  )
  select count(*)::integer into removed_buckets from removed;

  perform pg_catalog.set_config('pac.allow_immutable_change', 'on', true);
  with candidates as materialized (
    select audit_id
    from pac.runtime_audit_events
    where occurred_at <= operational_cutoff
      and pac.is_canonical_utc_instant(event ->> 'at')
      and (event ->> 'at')::timestamptz = occurred_at
    order by occurred_at, audit_id
    for update skip locked
    limit 10000
  ), removed as (
    delete from pac.runtime_audit_events stored
    using candidates
    where stored.audit_id = candidates.audit_id
    returning 1
  )
  select count(*)::integer into removed_audit_events from removed;
  perform pg_catalog.set_config('pac.allow_immutable_change', 'off', true);

  with candidates as materialized (
    select work_kind, object_id
    from pac.runtime_work_objects
    where work_kind = 'decision'
      and object_id like 'research_usage:%'
      and pac.is_valid_research_usage_record(object_id, value)
      and (value ->> 'at')::timestamptz <= operational_cutoff
    order by value ->> 'at', object_id
    for update skip locked
    limit 10000
  ), removed as (
    delete from pac.runtime_work_objects stored
    using candidates
    where stored.work_kind = candidates.work_kind
      and stored.object_id = candidates.object_id
    returning 1
  )
  select count(*)::integer into removed_research_usage from removed;

  -- Remove the immutable replay receipt before its terminal tombstone. If a
  -- batch leaves any receipt behind, the related tombstone remains until a
  -- later run so replay behavior never points at a missing object.
  perform pg_catalog.set_config('pac.allow_immutable_change', 'on', true);
  with candidates as materialized (
    select receipt.idempotency_key
    from pac.runtime_idempotency receipt
    join pac.runtime_work_objects work
      on work.work_kind = receipt.work_kind and work.object_id = receipt.object_id
    where receipt.work_kind = 'consult_request'
      and pac.consultation_tombstone_terminal_delete_due(
        work.object_id,
        work.value,
        tombstone_cutoff
      )
    order by receipt.created_at, receipt.idempotency_key
    for update of receipt skip locked
    limit 10000
  ), removed as (
    delete from pac.runtime_idempotency stored
    using candidates
    where stored.idempotency_key = candidates.idempotency_key
    returning 1
  )
  select count(*)::integer into removed_receipts from removed;
  perform pg_catalog.set_config('pac.allow_immutable_change', 'off', true);

  with candidates as materialized (
    select work.work_kind, work.object_id
    from pac.runtime_work_objects work
    where work.work_kind = 'consult_request'
      and pac.consultation_tombstone_terminal_delete_due(
        work.object_id,
        work.value,
        tombstone_cutoff
      )
      and not exists (
        select 1
        from pac.runtime_idempotency receipt
        where receipt.work_kind = work.work_kind
          and receipt.object_id = work.object_id
      )
    order by work.updated_at, work.object_id
    for update of work skip locked
    limit 10000
  ), removed as (
    delete from pac.runtime_work_objects stored
    using candidates
    where stored.work_kind = candidates.work_kind
      and stored.object_id = candidates.object_id
    returning 1
  )
  select count(*)::integer into removed_tombstones from removed;

  return query select
    removed_revocations,
    removed_buckets,
    removed_audit_events,
    removed_research_usage,
    removed_tombstones,
    removed_receipts;
end;
$$;

revoke all privileges on function pac.consultation_tombstone_terminal_delete_due(text, jsonb, timestamptz)
  from public, pac_app_runtime;
revoke all privileges on function pac.purge_expired_security_records() from public;
grant execute on function pac.purge_expired_security_records() to pac_app_runtime;

do $$
declare
  role_name text;
begin
  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      execute format(
        'revoke all privileges on function pac.purge_expired_security_records() from %I',
        role_name
      );
    end if;
  end loop;
end;
$$;

comment on function pac.consultation_tombstone_terminal_delete_due(text, jsonb, timestamptz) is
  'Fail-closed terminal lifecycle predicate for strict consultation tombstones.';
comment on function pac.purge_expired_security_records() is
  'Bounded privacy housekeeping for expired security records, 90-day operational records, and 30-day consultation tombstones with their replay receipts.';

commit;
