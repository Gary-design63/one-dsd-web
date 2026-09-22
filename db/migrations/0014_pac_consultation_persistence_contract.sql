begin;

create or replace function pac.is_consultation_request_id(candidate text)
returns boolean
language plpgsql
stable
strict
set search_path = pg_catalog, pg_temp
as $$
declare
  compact_date text;
  parsed_date date;
begin
  if candidate !~ '^CR-[0-9]{8}-[0-9]{4,16}$'
    or split_part(candidate, '-', 3) ~ '^0+$' then
    return false;
  end if;
  compact_date := split_part(candidate, '-', 2);
  begin
    parsed_date := to_date(compact_date, 'YYYYMMDD');
  exception when others then
    return false;
  end;
  return to_char(parsed_date, 'YYYYMMDD') = compact_date;
end;
$$;

create or replace function pac.is_iso_calendar_date(candidate text)
returns boolean
language plpgsql
stable
strict
set search_path = pg_catalog, pg_temp
as $$
declare
  parsed_date date;
begin
  if candidate !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    return false;
  end if;
  begin
    parsed_date := candidate::date;
  exception when others then
    return false;
  end;
  return to_char(parsed_date, 'YYYY-MM-DD') = candidate;
end;
$$;

create or replace function pac.is_zoned_instant(candidate text)
returns boolean
language plpgsql
stable
strict
set search_path = pg_catalog, pg_temp
as $$
declare
  parsed timestamptz;
begin
  if candidate !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]{1,3})?)?(Z|[+-][0-9]{2}:[0-9]{2})$' then
    return false;
  end if;
  begin
    parsed := candidate::timestamptz;
  exception when others then
    return false;
  end;
  return parsed is not null;
end;
$$;

create or replace function pac.is_bounded_json_string(
  candidate jsonb,
  minimum_length integer,
  maximum_length integer,
  require_trimmed boolean default false
)
returns boolean
language sql
immutable
strict
set search_path = pg_catalog, pg_temp
as $$
  select jsonb_typeof(candidate) = 'string'
    and length(candidate #>> '{}') between minimum_length and maximum_length
    and (not require_trimmed or candidate #>> '{}' = btrim(candidate #>> '{}'))
$$;

create or replace function pac.is_json_safe_integer(
  candidate jsonb,
  minimum_value numeric,
  maximum_value numeric
)
returns boolean
language sql
immutable
strict
set search_path = pg_catalog, pg_temp
as $$
  select jsonb_typeof(candidate) = 'number'
    and candidate::text ~ '^(0|[1-9][0-9]*)$'
    and (candidate #>> '{}')::numeric between minimum_value and maximum_value
$$;

create or replace function pac.assert_bounded_json_string_array(
  candidate jsonb,
  minimum_items integer,
  maximum_items integer,
  maximum_item_length integer,
  allowed_values text[] default null,
  require_unique boolean default false
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  if candidate is null or jsonb_typeof(candidate) <> 'array'
    or jsonb_array_length(candidate) not between minimum_items and maximum_items
    or exists (
      select 1
      from jsonb_array_elements(candidate) item(value)
      where jsonb_typeof(value) <> 'string'
        or length(value #>> '{}') > maximum_item_length
        or (allowed_values is not null and not ((value #>> '{}') = any(allowed_values)))
    )
    or (require_unique and (
      select count(*) from jsonb_array_elements_text(candidate)
    ) <> (
      select count(distinct value) from jsonb_array_elements_text(candidate) item(value)
    )) then
    raise exception 'Invalid bounded JSON string array' using errcode = '22023';
  end if;
end;
$$;

create or replace function pac.assert_consultation_persistence_contract(
  requested_object_id text,
  payload jsonb
)
returns void
language plpgsql
stable
set search_path = pg_catalog, pac
as $$
declare
  entry record;
  previous_at text := null;
  previous_status text := null;
  root_ask boolean;
  packet_ask boolean;
  expected_support numeric;
  expected_stage numeric;
  expected_urgency numeric;
  expected_tribal boolean;
  expected_high_stakes boolean;
begin
  perform pac.assert_runtime_work_object_contract('consult_request', requested_object_id, payload);
  if not pac.is_consultation_request_id(requested_object_id) then
    raise exception 'Invalid consultation request identifier' using errcode = '22023';
  end if;

  if payload ->> 'record_type' = 'consultation_tombstone' then
    if not pac.is_canonical_utc_instant(payload ->> 'retention_expires_at')
      or not pac.is_canonical_utc_instant(payload ->> 'redacted_at')
      or payload ->> 'updated_at' is distinct from payload ->> 'redacted_at'
      or not pac.is_json_safe_integer(payload -> 'version', 2, 9007199254740991)
      or payload ->> 'retention_policy_id' !~ '^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$' then
      raise exception 'Invalid strict consultation tombstone contract' using errcode = '22023';
    end if;
    return;
  end if;

  if payload ->> 'record_type' <> 'consultation_request'
    or substring(requested_object_id from 4 for 8)
       is distinct from replace(substring(payload ->> 'created_at' from 1 for 10), '-', '')
    or not pac.is_canonical_utc_instant(payload ->> 'created_at')
    or not pac.is_canonical_utc_instant(payload ->> 'participation_acknowledged_at')
    or payload ->> 'participation_acknowledged_at' is distinct from payload ->> 'created_at'
    or not pac.is_canonical_utc_instant(payload ->> 'updated_at')
    or not pac.is_canonical_utc_instant(payload ->> 'retention_expires_at')
    or payload ->> 'updated_at' < payload ->> 'created_at'
    or payload ->> 'retention_expires_at' <= payload ->> 'created_at'
    or payload ->> 'retention_policy_id' !~ '^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$'
    or not pac.is_json_safe_integer(payload -> 'version', 1, 9007199254740991)
    or not pac.is_bounded_json_string(payload -> 'work_name', 3, 120, true)
    or not pac.is_bounded_json_string(payload -> 'goals', 20, 2000, true)
    or not pac.is_bounded_json_string(payload -> 'equity_questions_considered', 0, 2000, true)
    or not pac.is_bounded_json_string(payload -> 'support_other_note', 0, 200, true)
    or not pac.is_bounded_json_string(payload -> 'populations_note', 0, 300, true)
    or not pac.is_bounded_json_string(payload -> 'access_note', 0, 300, true)
    or not pac.is_bounded_json_string(payload -> 'attachment_notes', 0, 500, true)
    or not pac.is_bounded_json_string(payload -> 'situation', 40, 4000, true)
    or (payload ? 'status_reason' and not pac.is_bounded_json_string(payload -> 'status_reason', 0, 1000, true))
    or (payload ->> 'status' = 'declined' and not coalesce(pac.is_bounded_json_string(payload -> 'status_reason', 1, 1000, true), false))
    or (payload ? 'owner_notes' and not pac.is_bounded_json_string(payload -> 'owner_notes', 0, 5000, true))
    or (payload ? 'path_id' and not pac.is_bounded_json_string(payload -> 'path_id', 0, 10, false))
    or (payload ? 'pinned_order' and not pac.is_json_safe_integer(payload -> 'pinned_order', 0, 999))
    or (payload ? 'scheduled_for' and not pac.is_zoned_instant(payload ->> 'scheduled_for'))
    or (payload ->> 'status' = 'scheduled' and not coalesce(pac.is_zoned_instant(payload ->> 'scheduled_for'), false))
    or not (
      payload ->> 'deadline_date' = ''
      or pac.is_iso_calendar_date(payload ->> 'deadline_date')
    )
    or (payload ->> 'timing_urgency' = 'hard_deadline' and not pac.is_iso_calendar_date(payload ->> 'deadline_date'))
    or (payload ? 'requester_role' and payload ->> 'requester_role' not in ('program_ops', 'supervisor', 'equity_director_specialist', 'analyst_tech', 'communications', 'procurement_contracts', 'other'))
    or (payload ? 'preferred_meeting_mode' and payload ->> 'preferred_meeting_mode' not in ('in_person', 'virtual', 'either', 'not_sure')) then
    raise exception 'Invalid strict consultation root contract' using errcode = '22023';
  end if;

  perform pac.assert_bounded_json_string_array(payload -> 'desired_support_type', 1, 6, 30, array[
    'scoping_goals', 'equity_embed_review', 'access_language_check',
    'stakeholder_partner_map', 'facilitation_prep', 'other'
  ], true);
  perform pac.assert_bounded_json_string_array(payload -> 'affected_populations', 0, 8, 40, array[
    'language_access_needs', 'disability_access', 'rural_greater_minnesota',
    'older_adults', 'children_families', 'immigrant_refugee_general',
    'specific_minnesota_community', 'tribal_nation'
  ], true);
  perform pac.assert_bounded_json_string_array(payload -> 'access_language_needs', 0, 5, 40, array[
    'interpreter_for_consult', 'captioning', 'plain_language_materials',
    'timing_constraints', 'other'
  ], true);
  perform pac.assert_bounded_json_string_array(payload -> 'links', 0, 5, 2048, null, true);
  if (payload -> 'desired_support_type') ? 'other'
    and not pac.is_bounded_json_string(payload -> 'support_other_note', 1, 200, true) then
    raise exception 'Other consultation support requires a note' using errcode = '22023';
  end if;
  for entry in select value from jsonb_array_elements(payload -> 'links')
  loop
    if entry.value #>> '{}' !~* '^https?://[^/@[:space:]]+([.:][^/@[:space:]]+)(/|$)'
      or entry.value #>> '{}' ~* '^https?://([^/]*@|localhost([:/]|$)|[^/]+\.(local|internal|intranet|corp)([:/]|$))' then
      raise exception 'Invalid public consultation link' using errcode = '22023';
    end if;
  end loop;

  if payload ? 'ask_context' then
    if not pac.is_bounded_json_string(payload -> 'ask_context' -> 'session_id', 0, 64, false)
      or not pac.is_bounded_json_string(payload -> 'ask_context' -> 'excerpt', 0, 600, false) then
      raise exception 'Invalid strict consultation Ask context' using errcode = '22023';
    end if;
    perform pac.assert_bounded_json_string_array(payload -> 'ask_context' -> 'intents_tried', 0, 10, 40, null, false);
  end if;

  expected_support := case
    when (payload -> 'desired_support_type') ?| array['scoping_goals', 'equity_embed_review'] then 6
    when (payload -> 'desired_support_type') ? 'facilitation_prep' then 3
    else 4
  end;
  expected_stage := case payload ->> 'stage'
    when 'conceptual' then 5 when 'designing' then 5 when 'launching' then 4 else 2
  end;
  expected_urgency := case payload ->> 'timing_urgency'
    when 'exploratory' then 10 when 'within_2_weeks' then 20 when 'live_urgent' then 40 else null
  end;
  expected_tribal := (payload -> 'affected_populations') ? 'tribal_nation';
  expected_high_stakes := ((payload ->> 'goals') || ' ' || (payload ->> 'situation'))
    ~* '\m(procurement|contract|vendor|RFP|budget|statute|rule change|technology|system replacement|data sharing|algorithm)\M';
  if not pac.is_json_safe_integer(payload -> 'priority_signals' -> 'support_weight', expected_support, expected_support)
    or not pac.is_json_safe_integer(payload -> 'priority_signals' -> 'stage_weight', expected_stage, expected_stage)
    or jsonb_typeof(payload -> 'priority_signals' -> 'total') <> 'number'
    or (payload -> 'priority_signals' ->> 'total')::numeric not between 0 and 100
    or jsonb_typeof(payload -> 'priority_signals' -> 'urgency_weight') <> 'number'
    or (payload ->> 'timing_urgency' = 'hard_deadline' and (payload -> 'priority_signals' ->> 'urgency_weight')::numeric not between 30 and 40)
    or (payload ->> 'timing_urgency' <> 'hard_deadline' and (payload -> 'priority_signals' ->> 'urgency_weight')::numeric <> expected_urgency)
    or (payload -> 'priority_signals' ->> 'total')::numeric <>
       (payload -> 'priority_signals' ->> 'urgency_weight')::numeric + expected_support + expected_stage
    or (payload -> 'priority_signals' ->> 'tribal_gate')::boolean is distinct from expected_tribal
    or (payload -> 'priority_signals' ->> 'high_stakes')::boolean is distinct from expected_high_stakes then
    raise exception 'Invalid strict consultation priority signals' using errcode = '22023';
  end if;

  perform pac.assert_allowed_jsonb_keys(payload -> 'packet' -> 'snapshot', array[
    'Reference ID', 'Status', 'Submitted', 'Stage', 'Work name', 'Desired support',
    'Timing', 'Preferred meeting mode', 'Requester role'
  ]);
  if not (payload -> 'packet' -> 'snapshot' ?& array[
      'Reference ID', 'Status', 'Submitted', 'Stage', 'Work name', 'Desired support',
      'Timing', 'Preferred meeting mode', 'Requester role'
    ])
    or exists (
      select 1 from jsonb_each(payload -> 'packet' -> 'snapshot') item
      where not pac.is_bounded_json_string(item.value, 1, 4096, false)
    )
    or payload -> 'packet' -> 'snapshot' ->> 'Reference ID' is distinct from requested_object_id
    or payload -> 'packet' -> 'snapshot' ->> 'Work name' is distinct from payload ->> 'work_name'
    or payload -> 'packet' -> 'snapshot' ->> 'Status' is distinct from (case payload ->> 'status'
      when 'pending_eligibility_review' then 'Eligibility review' when 'received' then 'Received'
      when 'under_review' then 'Under review' when 'scheduled' then 'Scheduled'
      when 'in_progress' then 'In progress' when 'completed' then 'Completed'
      when 'declined' then 'Declined' else 'Withdrawn' end)
    or payload -> 'packet' -> 'snapshot' ->> 'Stage' is distinct from (case payload ->> 'stage'
      when 'conceptual' then 'Early idea' when 'designing' then 'Planning or design'
      when 'launching' then 'Preparing to begin' else 'Already in use and changing' end)
    or not pac.is_bounded_json_string(payload -> 'packet' -> 'calendar_handoff', 1, 12000, false) then
    raise exception 'Invalid strict consultation packet snapshot' using errcode = '22023';
  end if;
  perform pac.assert_bounded_json_string_array(payload -> 'packet' -> 'summary', 1, 12, 4096, null, false);
  perform pac.assert_bounded_json_string_array(payload -> 'packet' -> 'equity_questions_considered', 1, 1000, 2000, null, false);
  perform pac.assert_bounded_json_string_array(payload -> 'packet' -> 'risks_unknowns', 1, 10, 4096, null, false);

  if jsonb_array_length(payload -> 'packet' -> 'suggested_questions') > 10 then
    raise exception 'Too many consultation suggested questions' using errcode = '22023';
  end if;
  for entry in select value from jsonb_array_elements(payload -> 'packet' -> 'suggested_questions')
  loop
    if not pac.is_bounded_json_string(entry.value -> 'id', 1, 120, false)
      or not pac.is_bounded_json_string(entry.value -> 'category', 1, 120, false)
      or not pac.is_bounded_json_string(entry.value -> 'text', 1, 2000, false) then
      raise exception 'Invalid strict consultation suggested question' using errcode = '22023';
    end if;
  end loop;
  if jsonb_array_length(payload -> 'packet' -> 'related_resources') > 6 then
    raise exception 'Too many consultation related resources' using errcode = '22023';
  end if;
  for entry in select value from jsonb_array_elements(payload -> 'packet' -> 'related_resources')
  loop
    if not pac.is_bounded_json_string(entry.value -> 'id', 1, 180, false)
      or not pac.is_bounded_json_string(entry.value -> 'title', 1, 500, false)
      or not pac.is_bounded_json_string(entry.value -> 'href', 1, 2048, false)
      or entry.value ->> 'authority' not in ('official', 'guidance', 'practice_note', 'learning', 'community_brief', 'partner_informed', 'local', 'under_review', 'external_verify')
      or not pac.is_bounded_json_string(entry.value -> 'authorityLabel', 1, 120, false)
      or not pac.is_iso_calendar_date(entry.value ->> 'reviewDate')
      or not pac.is_bounded_json_string(entry.value -> 'excerpt', 1, 2000, false)
      or jsonb_typeof(entry.value -> 'citeable') <> 'boolean' then
      raise exception 'Invalid strict consultation related resource' using errcode = '22023';
    end if;
  end loop;
  if jsonb_array_length(payload -> 'packet' -> 'agenda') not between 1 and 10 then
    raise exception 'Invalid consultation agenda size' using errcode = '22023';
  end if;
  for entry in select value from jsonb_array_elements(payload -> 'packet' -> 'agenda')
  loop
    if not pac.is_json_safe_integer(entry.value -> 'minutes', 1, 240)
      or not pac.is_bounded_json_string(entry.value -> 'item', 1, 2000, false)
      or not pac.is_bounded_json_string(entry.value -> 'owner', 1, 200, false) then
      raise exception 'Invalid strict consultation agenda item' using errcode = '22023';
    end if;
  end loop;

  root_ask := payload ? 'ask_context';
  packet_ask := payload -> 'packet' ? 'ask_context';
  if root_ask is distinct from packet_ask then
    raise exception 'Consultation packet Ask context mismatch' using errcode = '22023';
  end if;
  if root_ask then
    if payload -> 'packet' -> 'ask_context' -> 'intents_tried' is distinct from payload -> 'ask_context' -> 'intents_tried'
      or payload -> 'packet' -> 'ask_context' -> 'excerpt' is distinct from payload -> 'ask_context' -> 'excerpt'
      or not pac.is_bounded_json_string(payload -> 'packet' -> 'ask_context' -> 'excerpt', 0, 600, false) then
      raise exception 'Invalid consultation packet Ask context values' using errcode = '22023';
    end if;
    perform pac.assert_bounded_json_string_array(payload -> 'packet' -> 'ask_context' -> 'intents_tried', 0, 10, 40, null, false);
  end if;

  if jsonb_array_length(payload -> 'history') not between 1 and 100 then
    raise exception 'Invalid consultation history size' using errcode = '22023';
  end if;
  for entry in select value, ordinal from jsonb_array_elements(payload -> 'history') with ordinality history(value, ordinal)
  loop
    if not pac.is_canonical_utc_instant(entry.value ->> 'at')
      or entry.value ->> 'at' < payload ->> 'created_at'
      or entry.value ->> 'at' > payload ->> 'updated_at'
      or (previous_at is not null and entry.value ->> 'at' < previous_at)
      or (entry.value ? 'note' and not pac.is_bounded_json_string(entry.value -> 'note', 0, 1000, true)) then
      raise exception 'Invalid strict consultation history entry' using errcode = '22023';
    end if;
    if entry.ordinal = 1 and (
      entry.value ->> 'at' is distinct from payload ->> 'created_at'
      or entry.value ->> 'status' <> 'pending_eligibility_review'
      or entry.value ->> 'by' <> 'system'
    ) then
      raise exception 'Invalid initial consultation history entry' using errcode = '22023';
    end if;
    if entry.ordinal > 1 and not (
      (previous_status = 'pending_eligibility_review'
        and entry.value ->> 'status' in ('received', 'declined', 'withdrawn'))
      or (previous_status = 'received'
        and entry.value ->> 'status' in ('under_review', 'declined', 'withdrawn'))
      or (previous_status = 'under_review'
        and entry.value ->> 'status' in ('scheduled', 'declined', 'withdrawn', 'in_progress'))
      or (previous_status = 'scheduled'
        and entry.value ->> 'status' in ('in_progress', 'completed', 'declined'))
      or (previous_status = 'in_progress'
        and entry.value ->> 'status' in ('completed', 'declined'))
      or (previous_status = 'under_review'
        and entry.value ->> 'status' = 'received'
        and entry.value ->> 'by' = 'owner'
        and entry.value ->> 'note' ~ '^Undo of orchestrator cycle cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12} by owner\.$')
    ) then
      raise exception 'Invalid consultation history transition' using errcode = '22023';
    end if;
    if entry.ordinal > 1 and (
      (entry.value ->> 'by' = 'requester'
        and entry.value ->> 'status' <> 'withdrawn')
      or (entry.value ->> 'by' = 'system'
        and not (
          previous_status = 'received'
          and entry.value ->> 'status' = 'under_review'
        ))
    ) then
      raise exception 'Invalid consultation history actor' using errcode = '22023';
    end if;
    previous_at := entry.value ->> 'at';
    previous_status := entry.value ->> 'status';
  end loop;

  if payload ? 'correction_history' then
    if jsonb_array_length(payload -> 'correction_history') > 100 then
      raise exception 'Invalid consultation correction history size' using errcode = '22023';
    end if;
    for entry in select value from jsonb_array_elements(payload -> 'correction_history')
    loop
      if not pac.is_canonical_utc_instant(entry.value ->> 'at')
        or entry.value ->> 'at' < payload ->> 'created_at'
        or entry.value ->> 'at' > payload ->> 'updated_at' then
        raise exception 'Invalid strict consultation correction history entry' using errcode = '22023';
      end if;
      perform pac.assert_bounded_json_string_array(entry.value -> 'fields', 1, 17, 40, array[
        'requester_role', 'work_name', 'stage', 'goals', 'equity_questions_considered',
        'desired_support_type', 'support_other_note', 'timing_urgency', 'deadline_date',
        'affected_populations', 'populations_note', 'access_language_needs', 'access_note',
        'preferred_meeting_mode', 'links', 'attachment_notes', 'situation'
      ], true);
    end loop;
  end if;
end;
$$;

create or replace function pac.enforce_consultation_persistence_contract()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
as $$
begin
  if new.work_kind = 'consult_request' then
    perform pac.assert_consultation_persistence_contract(new.object_id, new.value);
    -- Runtime creation always begins at the acknowledged eligibility-review
    -- state. Historical terminal records are restored only through a separate
    -- administrative recovery procedure, never by a generic application put.
    if tg_op = 'INSERT'
      and new.value ->> 'record_type' = 'consultation_request'
      and (
        new.value ->> 'eligibility_status' <> 'pending'
        or new.value ->> 'status' <> 'pending_eligibility_review'
        or new.value ->> 'version' <> '1'
        or jsonb_array_length(new.value -> 'history') <> 1
        or coalesce(jsonb_array_length(new.value -> 'correction_history'), 0) <> 0
        or new.value ?| array['status_reason', 'scheduled_for', 'owner_notes', 'pinned_order']
      ) then
      raise exception 'New consultation must begin at the acknowledged eligibility-review state' using errcode = '22023';
    end if;
  end if;
  return new;
end;
$$;

-- Do not mark an upgraded database strict while a consultation row written
-- under the earlier, broader contract is still present. Remediation is an
-- explicit operator action; the migration never silently rewrites S3 records.
do $$
declare
  stored record;
begin
  for stored in
    select object_id, value
    from pac.runtime_work_objects
    where work_kind = 'consult_request'
  loop
    perform pac.assert_consultation_persistence_contract(
      stored.object_id,
      stored.value
    );
  end loop;
end;
$$;

drop trigger if exists consultation_persistence_contract on pac.runtime_work_objects;
create trigger consultation_persistence_contract
before insert or update on pac.runtime_work_objects
for each row execute function pac.enforce_consultation_persistence_contract();

revoke all privileges on function pac.is_consultation_request_id(text) from public, pac_app_runtime;
revoke all privileges on function pac.is_iso_calendar_date(text) from public, pac_app_runtime;
revoke all privileges on function pac.is_zoned_instant(text) from public, pac_app_runtime;
revoke all privileges on function pac.is_bounded_json_string(jsonb, integer, integer, boolean) from public, pac_app_runtime;
revoke all privileges on function pac.is_json_safe_integer(jsonb, numeric, numeric) from public, pac_app_runtime;
revoke all privileges on function pac.assert_bounded_json_string_array(jsonb, integer, integer, integer, text[], boolean) from public, pac_app_runtime;
revoke all privileges on function pac.assert_consultation_persistence_contract(text, jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.enforce_consultation_persistence_contract() from public, pac_app_runtime;

comment on function pac.assert_consultation_persistence_contract(text, jsonb) is
  'Strict full-request and exact ten-field tombstone contract for S3 consultation persistence.';

commit;
