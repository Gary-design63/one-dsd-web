-- Dedicated owner-observability records; never reuse transcript-free work objects.
-- The trusted server enforces owner authorization for reads and deletion.
create table pac.ask_response_records (
  record_id uuid primary key,
  created_at timestamptz not null,
  expires_at timestamptz,
  record jsonb not null,
  constraint ask_record_contract check ((
    jsonb_typeof(record) = 'object'
    and octet_length(record::text) <= 1048576
    and record ?& array['id','traceId','createdAt','programScope','researchMode','status','httpStatus','question','questionOmittedReason','response','researchStatus','expiresAt']
    and (record - array['id','traceId','createdAt','programScope','researchMode','status','httpStatus','question','questionOmittedReason','response','researchStatus','expiresAt']) = '{}'::jsonb
    and (record->>'id')::uuid = record_id
    and (record->>'traceId') ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    and (record->>'createdAt')::timestamptz = created_at
    and ((record->>'expiresAt')::timestamptz is not distinct from expires_at)
    and record->>'programScope' in ('one-dhs','dsd')
    and record->>'researchMode' in ('auto','program_only','web_results','current_web','deep_research')
    and record->>'status' in ('answered','limited','refused','unavailable','failed')
    and record->>'researchStatus' in ('not_requested','used','not_connected','failed')
    and jsonb_typeof(record->'httpStatus') = 'number'
    and (record->>'httpStatus')::integer between 100 and 599
    and (
      (jsonb_typeof(record->'question') = 'string' and length(record->>'question') between 1 and 4000 and record->'questionOmittedReason' = 'null'::jsonb)
      or (record->'question' = 'null'::jsonb and record->>'questionOmittedReason' = 'private_information')
    )
    and jsonb_typeof(record->'response') = 'object'
    and (
      (jsonb_typeof(record->'response'->'error') = 'string' and ((record->'response') - 'error') = '{}'::jsonb)
      or (record->'response'->>'kind' = 'answer' and jsonb_typeof(record->'response'->'answer') = 'object'
        and ((record->'response'->'answer') - array['shortAnswer','whyItMatters','sources','limits','nextActions','questions','conflict','consultation','pathSuggestion','notice','publicResearch']) = '{}'::jsonb
        and (record->'response'->'answer') ?& array['shortAnswer','whyItMatters','sources','limits','nextActions']
        and jsonb_typeof(record->'response'->'answer'->'shortAnswer') = 'string'
        and jsonb_typeof(record->'response'->'answer'->'whyItMatters') = 'string'
        and jsonb_typeof(record->'response'->'answer'->'sources') = 'array'
        and jsonb_typeof(record->'response'->'answer'->'limits') = 'array'
        and jsonb_typeof(record->'response'->'answer'->'nextActions') = 'array'
        and ((record->'response') - array['kind','answer']) = '{}'::jsonb)
      or (record->'response'->>'kind' = 'refusal' and jsonb_typeof(record->'response'->'safety') = 'object'
        and ((record->'response'->'safety') - array['message','redirect','alternatives']) = '{}'::jsonb
        and ((record->'response') - array['kind','safety']) = '{}'::jsonb)
    )
  ) is true)
);
create index ask_response_records_page_idx on pac.ask_response_records(created_at desc,record_id desc);
create index ask_response_records_expiry_idx on pac.ask_response_records(expires_at) where expires_at is not null;
alter table pac.ask_response_records enable row level security;
revoke all on pac.ask_response_records from public,pac_app_runtime;

create function pac.append_ask_response_record(p_record jsonb) returns void
language plpgsql security definer set search_path=pg_catalog,pac as $$
declare existing jsonb;
begin
  insert into pac.ask_response_records(record_id,created_at,expires_at,record)
  values ((p_record->>'id')::uuid,(p_record->>'createdAt')::timestamptz,(p_record->>'expiresAt')::timestamptz,p_record)
  on conflict(record_id) do nothing;
  select record into existing from pac.ask_response_records where record_id=(p_record->>'id')::uuid;
  if existing is distinct from p_record then raise exception 'ASK record is immutable'; end if;
end $$;
create function pac.list_ask_response_records(p_limit integer,p_before_at timestamptz,p_before_id uuid,p_now timestamptz)
returns table(record jsonb) language plpgsql security definer set search_path=pg_catalog,pac as $$
begin
  if p_limit is null or p_limit < 1 or p_limit > 101 or p_now is null or ((p_before_at is null) <> (p_before_id is null)) then raise exception 'Invalid record page'; end if;
  return query select r.record from pac.ask_response_records r
    where (r.expires_at is null or r.expires_at > p_now)
      and (p_before_at is null or (r.created_at,r.record_id) < (p_before_at,p_before_id))
    order by r.created_at desc,r.record_id desc limit p_limit;
end $$;
create function pac.delete_ask_response_records(p_ids jsonb) returns integer
language plpgsql security definer set search_path=pg_catalog,pac as $$
declare deleted integer;
begin
  if p_ids is null or jsonb_typeof(p_ids) <> 'array' or jsonb_array_length(p_ids) < 1 or jsonb_array_length(p_ids)>100 then raise exception 'Invalid record selection'; end if;
  delete from pac.ask_response_records where record_id in (select value::uuid from jsonb_array_elements_text(p_ids));
  get diagnostics deleted=row_count;
  return deleted;
end $$;
create function pac.purge_expired_ask_response_records(p_now timestamptz) returns integer
language plpgsql security definer set search_path=pg_catalog,pac as $$
declare deleted integer;
begin
  if p_now is null then raise exception 'Invalid record cleanup time'; end if;
  delete from pac.ask_response_records where record_id in (
    select record_id from pac.ask_response_records where expires_at <= p_now order by expires_at limit 1000
  );
  get diagnostics deleted=row_count;
  return deleted;
end $$;
revoke all on function pac.append_ask_response_record(jsonb) from public;
revoke all on function pac.list_ask_response_records(integer,timestamptz,uuid,timestamptz) from public;
revoke all on function pac.delete_ask_response_records(jsonb) from public;
revoke all on function pac.purge_expired_ask_response_records(timestamptz) from public;
grant execute on function pac.append_ask_response_record(jsonb) to pac_app_runtime;
grant execute on function pac.list_ask_response_records(integer,timestamptz,uuid,timestamptz) to pac_app_runtime;
grant execute on function pac.delete_ask_response_records(jsonb) to pac_app_runtime;
grant execute on function pac.purge_expired_ask_response_records(timestamptz) to pac_app_runtime;
