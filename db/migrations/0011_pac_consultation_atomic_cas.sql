begin;

-- The invalid-expiry recovery path must distinguish canonical operational
-- instants from permissive PostgreSQL timestamp inputs such as `9999`.
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

-- Consultation records contain S3 material. Once a record is redacted, no
-- ordinary table update may restore the full request over its tombstone.
create or replace function pac.enforce_consultation_cas_update()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
begin
  if old.work_kind = 'consult_request'
    and current_user = 'pac_app_runtime' then
    raise exception using
      errcode = '42501',
      message = 'Consultation records require the atomic lifecycle mutation function';
  end if;
  if new.work_kind is distinct from old.work_kind
    or new.object_id is distinct from old.object_id then
    raise exception using errcode = '22023', message = 'Runtime work-object identity is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists consultation_cas_update on pac.runtime_work_objects;
create trigger consultation_cas_update
before update on pac.runtime_work_objects
for each row execute function pac.enforce_consultation_cas_update();

create or replace function pac.jsonb_array_is_exact_prefix(
  current_value jsonb,
  replacement_value jsonb
)
returns boolean
language sql
immutable
set search_path = pg_catalog, pac
as $$
  with arrays as (
    select case when jsonb_typeof(current_value) = 'array' then current_value else '[]'::jsonb end as current_array,
      case when jsonb_typeof(replacement_value) = 'array' then replacement_value else '[]'::jsonb end as replacement_array
  )
  select jsonb_array_length(replacement_array) >= jsonb_array_length(current_array)
    and not exists (
      select 1
      from generate_series(0, jsonb_array_length(current_array) - 1) index_value
      where current_array -> index_value is distinct from replacement_array -> index_value
    )
  from arrays
$$;

create or replace function pac.jsonb_only_approved_keys_changed(
  current_value jsonb,
  replacement_value jsonb,
  approved_keys text[]
)
returns boolean
language sql
immutable
set search_path = pg_catalog, pac
as $$
  select jsonb_typeof(current_value) = 'object'
    and jsonb_typeof(replacement_value) = 'object'
    and not exists (
      select 1
      from (
        select key from jsonb_object_keys(current_value) current_keys(key)
        union
        select key from jsonb_object_keys(replacement_value) replacement_keys(key)
      ) keys
      where not (keys.key = any(approved_keys))
        and current_value -> keys.key is distinct from replacement_value -> keys.key
    )
$$;

create or replace function pac.consultation_packet_status_change_only(
  current_value jsonb,
  replacement_value jsonb
)
returns boolean
language sql
immutable
set search_path = pg_catalog, pac
as $$
  select current_value is not distinct from replacement_value
    or (
      jsonb_typeof(current_value) = 'object'
      and jsonb_typeof(replacement_value) = 'object'
      and jsonb_typeof(current_value -> 'snapshot') = 'object'
      and jsonb_typeof(replacement_value -> 'snapshot') = 'object'
      and current_value is not distinct from jsonb_set(
        replacement_value,
        '{snapshot,Status}',
        current_value #> '{snapshot,Status}',
        true
      )
    )
$$;

create or replace function pac.consultation_transition_is_valid(
  from_eligibility text,
  from_status text,
  to_eligibility text,
  to_status text
)
returns boolean
language sql
immutable
set search_path = pg_catalog, pac
as $$
  select row(from_eligibility, from_status) is not distinct from row(to_eligibility, to_status)
    or (
      from_eligibility = 'pending'
      and from_status = 'pending_eligibility_review'
      and (
        (to_eligibility = 'pending' and to_status = 'withdrawn')
        or (to_eligibility = 'not_dsd' and to_status = 'declined')
        or (to_eligibility = 'confirmed_dsd' and to_status in ('received', 'under_review', 'declined', 'withdrawn'))
      )
    )
    or (
      from_eligibility = 'confirmed_dsd'
      and to_eligibility = 'confirmed_dsd'
      and (
        (from_status = 'received' and to_status in ('under_review', 'declined', 'withdrawn'))
        or (from_status = 'under_review' and to_status in ('scheduled', 'declined', 'withdrawn', 'in_progress'))
        or (from_status = 'scheduled' and to_status in ('in_progress', 'completed', 'declined'))
        or (from_status = 'in_progress' and to_status in ('completed', 'declined'))
      )
    )
$$;

create or replace function pac.consultation_active_mutation_authorized(
  current_value jsonb,
  replacement_value jsonb,
  mutation_kind text,
  guard_text text
)
returns boolean
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  correction_current jsonb := case when jsonb_typeof(current_value -> 'correction_history') = 'array'
    then current_value -> 'correction_history' else '[]'::jsonb end;
  correction_next jsonb := case when jsonb_typeof(replacement_value -> 'correction_history') = 'array'
    then replacement_value -> 'correction_history' else '[]'::jsonb end;
  history_current jsonb := case when jsonb_typeof(current_value -> 'history') = 'array'
    then current_value -> 'history' else '[]'::jsonb end;
  history_next jsonb := case when jsonb_typeof(replacement_value -> 'history') = 'array'
    then replacement_value -> 'history' else '[]'::jsonb end;
  appended jsonb;
  appended_count integer;
  state_changed boolean;
  field_name text;
  entry_keys text[];
  correctable_fields constant text[] := array[
    'requester_role', 'work_name', 'stage', 'goals', 'equity_questions_considered',
    'desired_support_type', 'support_other_note', 'timing_urgency', 'deadline_date',
    'affected_populations', 'populations_note', 'access_language_needs', 'access_note',
    'preferred_meeting_mode', 'links', 'attachment_notes', 'situation'
  ];
begin
  if replacement_value ->> 'updated_at' is distinct from guard_text then
    return false;
  end if;

  if mutation_kind = 'requester_correction' then
    if not pac.jsonb_only_approved_keys_changed(current_value, replacement_value, array[
      'requester_role', 'work_name', 'stage', 'goals', 'equity_questions_considered',
      'desired_support_type', 'support_other_note', 'timing_urgency', 'deadline_date',
      'affected_populations', 'populations_note', 'access_language_needs', 'access_note',
      'preferred_meeting_mode', 'links', 'attachment_notes', 'situation',
      'priority_signals', 'packet', 'correction_history', 'updated_at', 'version'
    ])
      or current_value -> 'history' is distinct from replacement_value -> 'history'
      or not pac.jsonb_array_is_exact_prefix(correction_current, correction_next)
      or jsonb_array_length(correction_next) <> jsonb_array_length(correction_current) + 1 then
      return false;
    end if;
    appended := correction_next -> jsonb_array_length(correction_current);
    if appended ->> 'at' is distinct from guard_text
      or appended ->> 'by' <> 'requester' then
      return false;
    end if;
    foreach field_name in array correctable_fields
    loop
      if current_value -> field_name is distinct from replacement_value -> field_name
        and not (appended -> 'fields' ? field_name) then
        return false;
      end if;
    end loop;
    return true;
  end if;

  if mutation_kind = 'requester_withdrawal' then
    if not pac.jsonb_only_approved_keys_changed(current_value, replacement_value, array[
      'status', 'packet', 'history', 'updated_at', 'version'
    ])
      or current_value -> 'correction_history' is distinct from replacement_value -> 'correction_history'
      or not pac.jsonb_array_is_exact_prefix(history_current, history_next)
      or jsonb_array_length(history_next) <> jsonb_array_length(history_current) + 1
      or replacement_value ->> 'eligibility_status' is distinct from current_value ->> 'eligibility_status'
      or not pac.consultation_transition_is_valid(
        current_value ->> 'eligibility_status', current_value ->> 'status',
        replacement_value ->> 'eligibility_status', replacement_value ->> 'status'
      )
      or not pac.consultation_packet_status_change_only(current_value -> 'packet', replacement_value -> 'packet') then
      return false;
    end if;
    appended := history_next -> jsonb_array_length(history_current);
    select array_agg(key order by key) into entry_keys from jsonb_object_keys(appended) keys(key);
    return entry_keys is not distinct from array['at', 'by', 'status']::text[]
      and appended ->> 'at' is not distinct from guard_text
      and appended ->> 'by' = 'requester'
      and appended ->> 'status' = 'withdrawn';
  end if;

  if mutation_kind = 'owner_update' then
    if not pac.jsonb_only_approved_keys_changed(current_value, replacement_value, array[
      'eligibility_status', 'status', 'status_reason', 'scheduled_for', 'owner_notes',
      'pinned_order', 'packet', 'history', 'updated_at', 'version'
    ])
      or current_value -> 'correction_history' is distinct from replacement_value -> 'correction_history'
      or not pac.jsonb_array_is_exact_prefix(history_current, history_next)
      or not pac.consultation_transition_is_valid(
        current_value ->> 'eligibility_status', current_value ->> 'status',
        replacement_value ->> 'eligibility_status', replacement_value ->> 'status'
      )
      or not pac.consultation_packet_status_change_only(current_value -> 'packet', replacement_value -> 'packet') then
      return false;
    end if;
    appended_count := jsonb_array_length(history_next) - jsonb_array_length(history_current);
    state_changed := row(current_value ->> 'eligibility_status', current_value ->> 'status')
      is distinct from row(replacement_value ->> 'eligibility_status', replacement_value ->> 'status');
    if appended_count < 0 or appended_count > 2
      or (state_changed and appended_count < 1)
      or (not state_changed and appended_count <> 0) then
      return false;
    end if;
    for appended in
      select value from jsonb_array_elements(history_next) with ordinality entries(value, ordinal)
      where ordinal > jsonb_array_length(history_current)
    loop
      if appended ->> 'at' is distinct from guard_text or appended ->> 'by' <> 'owner' then
        return false;
      end if;
    end loop;
    return true;
  end if;

  if mutation_kind = 'system_packet_refresh' then
    return pac.jsonb_only_approved_keys_changed(current_value, replacement_value, array[
      'packet', 'updated_at', 'version'
    ])
      and current_value -> 'history' is not distinct from replacement_value -> 'history'
      and current_value -> 'correction_history' is not distinct from replacement_value -> 'correction_history';
  end if;

  if mutation_kind = 'system_triage' then
    if not pac.jsonb_only_approved_keys_changed(current_value, replacement_value, array[
      'status', 'pinned_order', 'packet', 'history', 'updated_at', 'version'
    ])
      or current_value -> 'correction_history' is distinct from replacement_value -> 'correction_history'
      or not pac.jsonb_array_is_exact_prefix(history_current, history_next)
      or jsonb_array_length(history_next) <> jsonb_array_length(history_current) + 1
      or current_value ->> 'eligibility_status' <> 'confirmed_dsd'
      or replacement_value ->> 'eligibility_status' <> 'confirmed_dsd'
      or not pac.consultation_packet_status_change_only(current_value -> 'packet', replacement_value -> 'packet') then
      return false;
    end if;
    appended := history_next -> jsonb_array_length(history_current);
    if appended ->> 'at' is distinct from guard_text then
      return false;
    end if;
    return current_value ->> 'status' = 'received'
      and replacement_value ->> 'status' = 'under_review'
      and appended ->> 'by' = 'system'
      and appended ->> 'status' = 'under_review';
  end if;

  return false;
end;
$$;

create or replace function pac.compare_and_swap_consultation(
  requested_object_id text,
  expected_version integer,
  expected_record_type text,
  expected_retention_expires_at text,
  mutation_kind text,
  guard_at timestamptz,
  replacement jsonb
)
returns table (applied boolean, reason text, current_value jsonb)
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  stored jsonb;
  stored_type text;
  stored_version integer;
  stored_expiry timestamptz;
  effective_guard timestamptz;
  server_now timestamptz;
  replacement_keys text[];
begin
  if requested_object_id is null or btrim(requested_object_id) = ''
    or expected_version is null or expected_version < 1
    or expected_record_type is null or expected_record_type <> 'consultation_request'
    or expected_retention_expires_at is null
    or mutation_kind is null or mutation_kind not in (
      'requester_correction', 'requester_withdrawal', 'owner_update',
      'system_packet_refresh', 'system_triage',
      'credential_rotation', 'expiry_tombstone', 'invalid_expiry_tombstone'
    )
    or guard_at is null
    or replacement is null or jsonb_typeof(replacement) <> 'object' then
    raise exception 'Invalid consultation CAS command' using errcode = '22023';
  end if;

  select work.value into stored
  from pac.runtime_work_objects work
  where work.work_kind = 'consult_request'
    and work.object_id = requested_object_id
  for update;
  if not found then
    return query select false, 'not_found'::text, null::jsonb;
    return;
  end if;

  stored_type := coalesce(stored ->> 'record_type', 'consultation_request');
  if stored_type = 'consultation_tombstone' then
    return query select false, 'tombstone'::text, stored;
    return;
  end if;

  begin
    stored_version := (stored ->> 'version')::integer;
  exception when others then
    return query select false, 'conflict'::text, stored;
    return;
  end;
  if mutation_kind = 'invalid_expiry_tombstone' then
    if pac.is_canonical_utc_instant(stored ->> 'retention_expires_at') then
      stored_expiry := (stored ->> 'retention_expires_at')::timestamptz;
      return query select false, 'conflict'::text, stored;
      return;
    else
      stored_expiry := null;
    end if;
  else
    if pac.is_canonical_utc_instant(stored ->> 'retention_expires_at') then
      stored_expiry := (stored ->> 'retention_expires_at')::timestamptz;
    else
      return query select false, 'conflict'::text, stored;
      return;
    end if;
  end if;
  server_now := clock_timestamp();
  if abs(extract(epoch from (guard_at - server_now))) > 300 then
    raise exception 'Consultation mutation timestamp is outside the server-authorized window' using errcode = '22023';
  end if;
  -- Expiry authority comes from the database clock, never the caller-provided
  -- display/audit instant. This prevents future-dated premature redaction and
  -- backdated tombstones that would immediately qualify for terminal cleanup.
  effective_guard := server_now;

  if stored_type <> expected_record_type
    or stored ->> 'request_id' is distinct from requested_object_id
    or stored_version is distinct from expected_version
    or stored ->> 'retention_expires_at' is distinct from expected_retention_expires_at
    or replacement ->> 'request_id' is distinct from requested_object_id
    or (replacement ->> 'version')::integer is distinct from expected_version + 1
    or (
      mutation_kind = 'invalid_expiry_tombstone'
      and (replacement ->> 'retention_expires_at')::timestamptz is distinct from guard_at
    )
    or (
      mutation_kind <> 'invalid_expiry_tombstone'
      and replacement ->> 'retention_expires_at' is distinct from expected_retention_expires_at
    )
    or (
      mutation_kind <> 'credential_rotation'
      and replacement ->> 'access_key_hash' is distinct from stored ->> 'access_key_hash'
    )
    or replacement ->> 'access_key_version' is distinct from stored ->> 'access_key_version'
    or replacement ->> 'retention_policy_id' is distinct from stored ->> 'retention_policy_id' then
    return query select false, 'conflict'::text, stored;
    return;
  end if;

  if mutation_kind in (
    'requester_correction', 'requester_withdrawal', 'owner_update',
    'system_packet_refresh', 'system_triage',
    'credential_rotation'
  ) then
    if stored_expiry <= effective_guard then
      return query select false, 'expired'::text, stored;
      return;
    end if;
    if coalesce(replacement ->> 'record_type', 'consultation_request') <> 'consultation_request'
      or replacement ->> 'status' = 'expired'
      or replacement ->> 'sensitivity_class' <> 'S3'
      or replacement ? 'redacted_at' then
      raise exception 'Invalid active consultation replacement' using errcode = '22023';
    end if;
    if mutation_kind = 'credential_rotation' then
      if replacement ->> 'access_key_hash' = stored ->> 'access_key_hash'
        or replacement ->> 'access_key_hash' !~ '^[a-f0-9]{64}$'
        or not pac.is_canonical_utc_instant(replacement ->> 'updated_at')
        or replacement ->> 'updated_at' is distinct from
          to_char(guard_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
        or (replacement - 'access_key_hash' - 'updated_at' - 'version')
          is distinct from (stored - 'access_key_hash' - 'updated_at' - 'version') then
        raise exception 'Invalid consultation credential rotation' using errcode = '22023';
      end if;
    elsif not pac.consultation_active_mutation_authorized(
      stored,
      replacement,
      mutation_kind,
      to_char(guard_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
    ) then
      raise exception 'Consultation mutation exceeds its authority' using errcode = '22023';
    end if;
  else
    if mutation_kind = 'expiry_tombstone' and stored_expiry > effective_guard then
      return query select false, 'conflict'::text, stored;
      return;
    end if;
    select array_agg(key order by key) into replacement_keys
    from jsonb_object_keys(replacement) keys(key);
    if replacement ->> 'record_type' <> 'consultation_tombstone'
      or replacement ->> 'status' <> 'expired'
      or (replacement ->> 'redacted_at')::timestamptz is distinct from guard_at
      or (replacement ->> 'updated_at')::timestamptz is distinct from guard_at
      or (
        mutation_kind = 'invalid_expiry_tombstone'
        and (replacement ->> 'retention_expires_at')::timestamptz is distinct from guard_at
      )
      or replacement_keys is distinct from array[
        'access_key_hash', 'access_key_version', 'record_type', 'redacted_at',
        'request_id', 'retention_expires_at', 'retention_policy_id', 'status',
        'updated_at', 'version'
      ]::text[] then
      raise exception 'Invalid consultation tombstone replacement' using errcode = '22023';
    end if;
  end if;

  perform pac.assert_no_prohibited_profile_fields(replacement);
  update pac.runtime_work_objects work
  set value = replacement,
      updated_at = clock_timestamp()
  where work.work_kind = 'consult_request'
    and work.object_id = requested_object_id
    and coalesce(work.value ->> 'record_type', 'consultation_request') = expected_record_type
    and (work.value ->> 'version')::integer = expected_version
    and work.value ->> 'retention_expires_at' = expected_retention_expires_at
  returning work.value into stored;

  if not found then
    return query select false, 'conflict'::text, null::jsonb;
    return;
  end if;
  return query select true, 'applied'::text, stored;
end;
$$;

revoke all privileges on function pac.enforce_consultation_cas_update() from public, pac_app_runtime;
revoke all privileges on function pac.is_canonical_utc_instant(text) from public, pac_app_runtime;
revoke all privileges on function pac.jsonb_array_is_exact_prefix(jsonb, jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.jsonb_only_approved_keys_changed(jsonb, jsonb, text[]) from public, pac_app_runtime;
revoke all privileges on function pac.consultation_packet_status_change_only(jsonb, jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.consultation_transition_is_valid(text, text, text, text) from public, pac_app_runtime;
revoke all privileges on function pac.consultation_active_mutation_authorized(jsonb, jsonb, text, text) from public, pac_app_runtime;
revoke all privileges on function pac.compare_and_swap_consultation(text, integer, text, text, text, timestamptz, jsonb) from public;
grant execute on function pac.compare_and_swap_consultation(text, integer, text, text, text, timestamptz, jsonb) to pac_app_runtime;

comment on function pac.compare_and_swap_consultation(text, integer, text, text, text, timestamptz, jsonb) is
  'Atomic consultation lifecycle mutation with version, record-type, retention-expiry, immutable identity, and tombstone-shape guards.';

commit;
