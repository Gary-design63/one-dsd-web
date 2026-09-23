begin;

-- Owner-session revocations are retained only through the lifetime of the signed
-- session they invalidate. Canonical UTC instants make expiry comparisons
-- unambiguous and let malformed records remain fail-closed instead of being
-- accidentally removed by housekeeping.
create or replace function pac.is_canonical_utc_instant(candidate text)
returns boolean
language plpgsql
stable
strict
set search_path = pg_catalog, pg_temp
as $$
declare
  parsed timestamptz;
begin
  if candidate !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$' then
    return false;
  end if;
  begin
    parsed := candidate::timestamptz;
  exception when others then
    return false;
  end;
  return to_char(parsed at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') = candidate;
end;
$$;

-- Housekeeping must never infer that an arbitrary decision is a research
-- usage record. This mirrors the application's narrow persisted shape closely
-- enough to make deletion authority explicit and fail closed on malformed data.
create or replace function pac.is_valid_research_usage_record(
  candidate_id text,
  candidate jsonb
)
returns boolean
language sql
immutable
strict
set search_path = pg_catalog, pg_temp
as $$
  select
    jsonb_typeof(candidate) = 'object'
    and candidate_id ~ '^research_usage:ru_[0-9]{14}_[a-f0-9]{6}_[a-f0-9]{4}$'
    and candidate_id = 'research_usage:' || (candidate ->> 'id')
    and (candidate - array[
      'id', 'at', 'provider', 'model', 'depth', 'query_hash', 'domains',
      'estimated_usd', 'reported_usd', 'input_tokens', 'output_tokens',
      'search_queries', 'web_search_calls', 'fetch_url_calls', 'tool_calls',
      'ok', 'error_code', 'latency_ms', 'trace_id', 'provider_trace_id'
    ]::text[]) = '{}'::jsonb
    and candidate ?& array[
      'id', 'at', 'provider', 'model', 'depth', 'query_hash', 'domains',
      'estimated_usd', 'ok', 'latency_ms', 'trace_id'
    ]::text[]
    and candidate ->> 'id' ~ '^ru_[0-9]{14}_[a-f0-9]{6}_[a-f0-9]{4}$'
    and pac.is_canonical_utc_instant(candidate ->> 'at')
    and candidate ->> 'provider' in ('perplexity_agent', 'fixture')
    and (
      candidate ->> 'model' in (
        'fixture/research-1', 'perplexity-search', 'fast', 'low', 'medium', 'high'
      )
      or candidate ->> 'model' ~ '^msh_[a-f0-9]{64}$'
    )
    and candidate ->> 'depth' in ('current_web', 'deep_research')
    and candidate ->> 'query_hash' ~ '^[a-f0-9]{16}$'
    and case
      when jsonb_typeof(candidate -> 'domains') = 'array' then
        jsonb_array_length(candidate -> 'domains') <= 20
        and (select count(*) from jsonb_array_elements_text(candidate -> 'domains'))
          = (select count(distinct domain) from jsonb_array_elements_text(candidate -> 'domains') domain)
        and not exists (
          select 1
          from jsonb_array_elements(candidate -> 'domains') as domain(value)
          where jsonb_typeof(domain.value) <> 'string'
            or domain.value #>> '{}' !~ '^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]([a-z0-9-]{0,61}[a-z0-9])?$'
        )
      else false
    end
    and jsonb_typeof(candidate -> 'estimated_usd') = 'number'
    and (candidate ->> 'estimated_usd')::numeric >= 0
    and (not (candidate ? 'reported_usd') or (
      jsonb_typeof(candidate -> 'reported_usd') = 'number'
      and (candidate ->> 'reported_usd')::numeric >= 0
    ))
    and (not (candidate ? 'input_tokens') or pac.jsonb_is_safe_integer(candidate -> 'input_tokens', 0))
    and (not (candidate ? 'output_tokens') or pac.jsonb_is_safe_integer(candidate -> 'output_tokens', 0))
    and (not (candidate ? 'search_queries') or pac.jsonb_is_safe_integer(candidate -> 'search_queries', 0))
    and (not (candidate ? 'web_search_calls') or pac.jsonb_is_safe_integer(candidate -> 'web_search_calls', 0))
    and (not (candidate ? 'fetch_url_calls') or pac.jsonb_is_safe_integer(candidate -> 'fetch_url_calls', 0))
    and (not (candidate ? 'tool_calls') or pac.jsonb_is_safe_integer(candidate -> 'tool_calls', 0))
    and jsonb_typeof(candidate -> 'ok') = 'boolean'
    and ((candidate -> 'ok' = 'true'::jsonb and not (candidate ? 'error_code')) or (
      candidate -> 'ok' = 'false'::jsonb
      and candidate ->> 'error_code' = 'research_execution_failed'
    ))
    and pac.jsonb_is_safe_integer(candidate -> 'latency_ms', 0)
    and jsonb_typeof(candidate -> 'trace_id') = 'string'
    and candidate ->> 'trace_id' ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and (not (candidate ? 'provider_trace_id') or (
      jsonb_typeof(candidate -> 'provider_trace_id') = 'string'
      and candidate ->> 'provider_trace_id' ~ '^pth_[a-f0-9]{64}$'
    ));
$$;

create or replace function pac.enforce_owner_session_revocation_contract()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
begin
  if new.work_kind = 'decision'
    and new.object_id ~ '^owner-session-revoked-[a-f0-9]{64}$'
    and (
      new.value ->> 'kind' is distinct from 'owner_session_revocation'
      or new.value ->> 'session_hash' !~ '^[a-f0-9]{64}$'
      or new.object_id is distinct from 'owner-session-revoked-' || (new.value ->> 'session_hash')
      or not pac.is_canonical_utc_instant(new.value ->> 'revoked_at')
      or not pac.is_canonical_utc_instant(new.value ->> 'expires_at')
      or new.value ->> 'revoked_at' > new.value ->> 'expires_at'
    ) then
    raise exception 'Invalid owner-session revocation lifecycle' using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists owner_session_revocation_contract on pac.runtime_work_objects;
create trigger owner_session_revocation_contract
before insert or update on pac.runtime_work_objects
for each row execute function pac.enforce_owner_session_revocation_contract();

create index if not exists runtime_rate_limits_expiry_idx
  on pac.runtime_rate_limits(reset_at);

create index if not exists runtime_audit_events_expiry_idx
  on pac.runtime_audit_events(occurred_at, audit_id);

create index if not exists runtime_research_usage_expiry_idx
  on pac.runtime_work_objects(((value ->> 'at')::text), object_id)
  where work_kind = 'decision' and object_id like 'research_usage:%';

-- The application role cannot delete either backing table directly. This
-- bounded definer operation may delete only already-expired, well-formed
-- revocation records and already-expired abuse-control buckets.
create or replace function pac.purge_expired_security_records()
returns table (
  owner_session_revocations_deleted integer,
  rate_limit_buckets_deleted integer,
  audit_events_deleted integer,
  research_usage_records_deleted integer
)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pg_temp
set row_security = off
as $$
declare
  revocation_cutoff text;
  removed_revocations integer;
  removed_buckets integer;
  operational_cutoff timestamptz;
  removed_audit_events integer;
  removed_research_usage integer;
begin
  revocation_cutoff := to_char(
    (clock_timestamp() - interval '10 minutes') at time zone 'UTC',
    'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
  );
  operational_cutoff := clock_timestamp() - interval '90 days';

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

  -- The append-only trigger accepts deletion only inside this narrowly scoped
  -- definer operation. A malformed or mismatched event is never deletion
  -- authority, even when its typed occurred_at column is old.
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

  return query select
    removed_revocations,
    removed_buckets,
    removed_audit_events,
    removed_research_usage;
end;
$$;

revoke all privileges on function pac.is_canonical_utc_instant(text) from public, pac_app_runtime;
revoke all privileges on function pac.is_valid_research_usage_record(text, jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.enforce_owner_session_revocation_contract() from public, pac_app_runtime;
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

comment on function pac.purge_expired_security_records() is
  'Bounded privacy housekeeping for expired owner-session revocations, HMAC rate-limit buckets, content-free audit events, and research-usage records; malformed records remain fail-closed.';

commit;
