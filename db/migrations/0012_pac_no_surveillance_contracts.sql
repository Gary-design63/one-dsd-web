begin;

-- Expand the semantic field-name backstop without treating ordinary content
-- quality or evaluation scores as employee measures. Keys are compacted first,
-- so snake case, camel case, punctuation, spaces, and acronym casing behave the
-- same way at the database boundary.
create or replace function pac.assert_no_prohibited_profile_fields(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  item record;
  normalized_key text;
begin
  if payload is null then
    return;
  end if;

  if jsonb_typeof(payload) = 'object' then
    for item in select key, value from jsonb_each(payload)
    loop
      normalized_key := lower(regexp_replace(item.key, '[^A-Za-z0-9]+', '', 'g'));
      if normalized_key = any(array[
        'beliefprofile',
        'beliefsbyworker',
        'completionbystaff',
        'compliancescore',
        'culturalcompetencescore',
        'deiscore',
        'employeeequityscore',
        'employeeequityreadiness',
        'employeeideology',
        'employeeprofile',
        'ideologybyemployee',
        'equitymaturityscore',
        'equityreadinessrating',
        'equityscore',
        'ideologyscore',
        'inferreddisability',
        'inferredethnicity',
        'inferredgenderidentity',
        'inferredprotectedclass',
        'inferredrace',
        'learningcompliancescore',
        'learningprogressbyemployee',
        'participationbyemployee',
        'participationleaderboard',
        'politicalbeliefs',
        'racialbiasscore',
        'staffinclusionranking',
        'supervisorparticipationdashboard',
        'supervisorparticipationscore',
        'workerinclusionmaturityscore'
      ])
      or normalized_key ~ '^(racialbias|equityreadiness|deireadiness|culturalcompetence|equitymaturity|inclusionmaturity)(score|rating|ranking|rank|profile)$'
      or normalized_key ~ '^(political|religious|ideological)(belief|beliefs|affiliation|affiliations|profile)$'
      or normalized_key ~ '^(belief|beliefs|ideology|ideologies|learningprogress|trainingprogress|learningcompletion|trainingcompletion|coursecompletion|completion|activity)(by|per)(employee|staff|worker|person|individual|member|user|supervisor)$'
      or normalized_key ~ '^(participation|engagement)(by|per)(employee|staff|worker|person|individual|member|user|supervisor)$'
      or normalized_key ~ '^(employee|staff|worker|personnel|supervisor)(equity|dei|ideology|inclusion|bias|participation|engagement|culturalcompetence)(score|rating|ranking|rank|profile|dashboard|leaderboard)$'
      or normalized_key ~ '^(employee|staff|worker|personnel|supervisor)(equityreadiness|inclusionmaturity|learningprogress|completion|activity)(score|rating|ranking|rank|profile|dashboard|leaderboard)?$'
      or normalized_key ~ '^(inferred|predicted|estimated|guessed)(race|ethnicity|genderidentity|disability|protectedclass|politicalbelief|politicalbeliefs|religion)$'
      then
        raise exception using
          errcode = '22023',
          message = 'Prohibited employee-profile field';
      end if;
      perform pac.assert_no_prohibited_profile_fields(item.value);
    end loop;
  elsif jsonb_typeof(payload) = 'array' then
    for item in select value from jsonb_array_elements(payload)
    loop
      perform pac.assert_no_prohibited_profile_fields(item.value);
    end loop;
  end if;
end;
$$;

-- Upgrade every JSON-bearing persistence carrier to the same DEC-014
-- backstop. Validate existing rows before installing the trigger so an older
-- unguarded metadata column cannot carry a hidden staff profile forward.
do $$
declare
  table_name text;
begin
  for table_name in
    select columns.table_name
    from information_schema.columns columns
    join information_schema.tables tables
      on tables.table_schema = columns.table_schema
      and tables.table_name = columns.table_name
    where columns.table_schema = 'pac'
      and columns.udt_name = 'jsonb'
      and tables.table_type = 'BASE TABLE'
    group by columns.table_name
  loop
    execute format(
      'select pac.assert_no_prohibited_profile_fields(to_jsonb(row_value)) from pac.%I row_value',
      table_name
    );
    execute format('drop trigger if exists no_prohibited_profile_fields on pac.%I', table_name);
    execute format(
      'create trigger no_prohibited_profile_fields before insert or update on pac.%I for each row execute function pac.reject_prohibited_profile_row()',
      table_name
    );
  end loop;
end;
$$;

create or replace function pac.assert_allowed_jsonb_keys(
  payload jsonb,
  allowed_keys text[]
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  if payload is null or jsonb_typeof(payload) <> 'object'
    or exists (
      select 1
      from jsonb_object_keys(payload) keys(key)
      where not (key = any(allowed_keys))
    ) then
    raise exception using
      errcode = '22023',
      message = 'Work object does not match an approved persistence contract';
  end if;
end;
$$;

-- Collaboration is open-ended human text, so key allowlists alone cannot stop
-- the workspace from becoming a staff-ranking request channel. Reject text
-- only when it combines a surveillance action, people, and a sensitive
-- learning/equity measure; ordinary invitations to participate remain valid.
create or replace function pac.assert_no_collaboration_surveillance_text(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  item record;
  text_value text;
begin
  if payload is null then
    return;
  end if;
  if jsonb_typeof(payload) = 'string' then
    text_value := payload #>> '{}';
    if text_value ~* '\m(staff|employee|employees|worker|workers|personnel|supervisor|supervisors|person|people|individual|individuals|member|members|coworker|coworkers|colleague|colleagues|manager|managers)\M'
      and text_value ~* '\m(equity|dei|inclusive|inclusion|maturity|readiness|bias|belief|beliefs|ideology|participation|engagement|learning|training|course[- ]completion|completion|activity|behavior|cultural|culturally|competence|competency|competent|capability|capable)\M'
      and (
        text_value ~* '\m(rank|ranking|score|scoring|scorecard|leaderboard|grade|rate|rating|profile|profiling|compare|classify|categorize|order|sort|arrange|assign|stratify|cluster|quartile|quartiles|tier|tiers|bucket|buckets|segment|segments|label|labels)\M'
        or text_value ~* '\m(most|least|more|less|highest|lowest|furthest|farthest|best|worst|top|bottom)\M'
        or text_value ~* '\m(based on|on the basis of|according to)\M'
        or (
          text_value ~* '\m(chart|evaluate|assess|monitor|track|report|sequence|band|group|place|map|determine|identify|create|summarize|show|showing|display|list|listing|measure|analyze)\M'
          and (
            text_value ~* '\m(each|every|individual|per|which)\M.{0,30}\m(staff|staff members|employee|employees|worker|workers|personnel|person|persons|member|members|supervisor|supervisors)\M'
            or text_value ~* '\m(staff|employees|workers|members|supervisors)\M([''’]s|s[''’])'
            or text_value ~* '\m(employee-by-employee|staff-level|employee-level|worker-level|person-level)\M'
            or text_value ~* '\m(by|per)\M[ ]+(each[ ]+|individual[ ]+)?\m(staff|employee|worker|person|member|supervisor)\M'
            or text_value ~* '\mfor\M[ ]+(each[ ]+|every[ ]+|their[ ]+|the[ ]+)?\m(staff|employee|worker|person|member|supervisor)\M'
          )
        )
        or (
          text_value ~* '\m(matrix|dashboard|dashboards|index|quartile|quartiles|heatmap|heat map|roster|rosters|report|reports)\M'
          and (
            text_value ~* '\m(each|every|individual|per|which)\M.{0,30}\m(staff|staff members|employee|employees|worker|workers|personnel|person|persons|member|members|supervisor|supervisors)\M'
            or text_value ~* '\m(staff|employees|workers|members|supervisors)\M([''’]s|s[''’])'
            or text_value ~* '\m(employee-by-employee|staff-level|employee-level|worker-level|person-level)\M'
            or text_value ~* '\m(by|per)\M[ ]+(each[ ]+|individual[ ]+)?\m(staff|employee|worker|person|member|supervisor)\M'
            or text_value ~* '\mfor\M[ ]+(each[ ]+|every[ ]+|their[ ]+|the[ ]+)?\m(staff|employee|worker|person|member|supervisor)\M'
            or text_value ~* '\m(for|to|with)\M[ ]+(the[ ]+)?\m(supervisor|supervisors|manager|managers|management)\M'
          )
        )
        or (
          text_value ~* '\m(develop|produce|build|provide|make|give|generate|create)\M'
          and text_value ~* '\m(matrix|dashboard|dashboards|index|quartile|quartiles|heatmap|heat map|roster|rosters|report|reports)\M'
        )
      ) then
      raise exception 'Collaboration text requests prohibited staff surveillance' using errcode = '22023';
    end if;
  elsif jsonb_typeof(payload) = 'object' then
    for item in select value from jsonb_each(payload)
    loop
      perform pac.assert_no_collaboration_surveillance_text(item.value);
    end loop;
  elsif jsonb_typeof(payload) = 'array' then
    for item in select value from jsonb_array_elements(payload)
    loop
      perform pac.assert_no_collaboration_surveillance_text(item.value);
    end loop;
  end if;
end;
$$;

create or replace function pac.assert_jsonb_string_array(
  payload jsonb,
  allowed_values text[] default null
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  item jsonb;
begin
  if payload is null or jsonb_typeof(payload) <> 'array' then
    raise exception 'Expected a JSON string array' using errcode = '22023';
  end if;
  for item in select value from jsonb_array_elements(payload)
  loop
    if jsonb_typeof(item) <> 'string'
      or (allowed_values is not null and not ((item #>> '{}') = any(allowed_values))) then
      raise exception 'Expected a JSON string array' using errcode = '22023';
    end if;
  end loop;
end;
$$;

-- JSON text extraction deliberately stringifies objects and arrays. Every
-- allowlisted scalar therefore receives an explicit JSON type check before it
-- can cross the generic persistence boundary.
create or replace function pac.assert_jsonb_scalar_types(
  payload jsonb,
  string_keys text[],
  boolean_keys text[],
  number_keys text[]
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  field_name text;
begin
  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'Expected a JSON object' using errcode = '22023';
  end if;
  foreach field_name in array string_keys
  loop
    if payload ? field_name and jsonb_typeof(payload -> field_name) <> 'string' then
      raise exception 'Expected a JSON string scalar' using errcode = '22023';
    end if;
  end loop;
  foreach field_name in array boolean_keys
  loop
    if payload ? field_name and jsonb_typeof(payload -> field_name) <> 'boolean' then
      raise exception 'Expected a JSON boolean scalar' using errcode = '22023';
    end if;
  end loop;
  foreach field_name in array number_keys
  loop
    if payload ? field_name and jsonb_typeof(payload -> field_name) <> 'number' then
      raise exception 'Expected a JSON number scalar' using errcode = '22023';
    end if;
  end loop;
end;
$$;

create or replace function pac.jsonb_is_safe_integer(payload jsonb, minimum_value numeric default null)
returns boolean
language sql
immutable
set search_path = pg_catalog, pac
as $$
  select jsonb_typeof(payload) = 'number'
    and (payload #>> '{}') ~ '^-?(0|[1-9][0-9]*)$'
    and abs((payload #>> '{}')::numeric) <= 9007199254740991
    and (minimum_value is null or (payload #>> '{}')::numeric >= minimum_value)
$$;

create or replace function pac.jsonb_is_instant(payload jsonb)
returns boolean
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  if jsonb_typeof(payload) <> 'string' or coalesce(payload #>> '{}', '') = '' then
    return false;
  end if;
  perform (payload #>> '{}')::timestamptz;
  return true;
exception when others then
  return false;
end;
$$;

create or replace function pac.jsonb_is_canonical_utc_instant(payload jsonb)
returns boolean
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  candidate text;
  parsed timestamptz;
begin
  if jsonb_typeof(payload) <> 'string' then
    return false;
  end if;
  candidate := payload #>> '{}';
  if candidate !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$' then
    return false;
  end if;
  parsed := candidate::timestamptz;
  return to_char(parsed at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') = candidate;
exception when others then
  return false;
end;
$$;

create or replace function pac.assert_agent_override_contract(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  entry record;
begin
  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'Invalid agent policy overrides' using errcode = '22023';
  end if;
  for entry in select key, value from jsonb_each(payload)
  loop
    if entry.key <> all(array[
      'program_orchestrator', 'ask_concierge', 'ci_guide', 'librarian',
      'a11y_reviewer', 'consult_intake', 'graduation_coach', 'embed_advisor',
      'content_sentinel', 'eval_steward'
    ]) or jsonb_typeof(entry.value) <> 'object' then
      raise exception 'Unknown or invalid agent policy override' using errcode = '22023';
    end if;
    perform pac.assert_allowed_jsonb_keys(entry.value, array['enabled', 'ceiling']);
    perform pac.assert_jsonb_scalar_types(entry.value, array['ceiling'], array['enabled'], array[]::text[]);
    if entry.value ? 'ceiling'
      and entry.value ->> 'ceiling' not in ('A0', 'A1', 'A2', 'A3', 'A4', 'A5') then
      raise exception 'Unknown or invalid agent policy override' using errcode = '22023';
    end if;
  end loop;
end;
$$;

create or replace function pac.assert_flag_override_contract(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  entry record;
begin
  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'Invalid feature flag overrides' using errcode = '22023';
  end if;
  for entry in select key, value from jsonb_each(payload)
  loop
    if entry.key <> all(array[
      'agent.content_sentinel', 'agent.eval_steward_write',
      'model.generative_pilot', 'autonomy.a3_calendar_schedule',
      'autonomy.a3_stale_flag', 'tool.browser_fetch_public',
      'tool.office_drafts', 'tool.publish_chain',
      'surface.ecosystem_intelligence'
    ]) or jsonb_typeof(entry.value) <> 'boolean' then
      raise exception 'Unknown or invalid feature flag override' using errcode = '22023';
    end if;
  end loop;
end;
$$;

create or replace function pac.assert_policy_patch_contract(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_allowed_jsonb_keys(payload, array['max_autonomy', 'flags', 'agents']);
  perform pac.assert_jsonb_scalar_types(payload, array['max_autonomy'], array[]::text[], array[]::text[]);
  if payload ? 'max_autonomy'
    and payload ->> 'max_autonomy' not in ('A0', 'A1', 'A2', 'A3', 'A4', 'A5') then
    raise exception 'Invalid policy patch' using errcode = '22023';
  end if;
  if payload ? 'flags' then
    perform pac.assert_flag_override_contract(payload -> 'flags');
  end if;
  if payload ? 'agents' then
    perform pac.assert_agent_override_contract(payload -> 'agents');
  end if;
end;
$$;

create or replace function pac.assert_proposal_contract(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_allowed_jsonb_keys(payload, array[
    'id', 'cycle_id', 'kind', 'title', 'rationale', 'apply', 'status',
    'created_at', 'decided_at', 'decision_note'
  ]);
  if not (payload ?& array['id', 'cycle_id', 'kind', 'title', 'rationale', 'status', 'created_at']) then
    raise exception 'Invalid proposal decision contract' using errcode = '22023';
  end if;
  perform pac.assert_jsonb_scalar_types(payload, array[
    'id', 'cycle_id', 'kind', 'title', 'rationale', 'status', 'created_at',
    'decided_at', 'decision_note'
  ], array[]::text[], array[]::text[]);
  if payload ->> 'id' !~ '^cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[pg][1-9][0-9]*$'
    or payload ->> 'cycle_id' !~ '^cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or payload ->> 'id' !~ ('^' || (payload ->> 'cycle_id') || '-[pg][1-9][0-9]*$')
    or payload ->> 'kind' not in (
      'enable_model', 'review_brief', 'retire_content', 'raise_autonomy',
      'lower_autonomy', 'content_gap', 'capacity', 'other'
    )
    or coalesce(payload ->> 'title', '') = ''
    or coalesce(payload ->> 'rationale', '') = ''
    or payload ->> 'status' not in ('proposed', 'accepted', 'rejected')
    or coalesce(payload ->> 'created_at', '') = '' then
    raise exception 'Invalid proposal decision contract' using errcode = '22023';
  end if;
  if payload ? 'apply' then
    perform pac.assert_policy_patch_contract(payload -> 'apply');
  end if;
end;
$$;

create or replace function pac.assert_consultation_owner_text_safe(candidate jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  value_text text;
  name_scan text;
begin
  if jsonb_typeof(candidate) <> 'string' then
    raise exception 'Invalid consultation owner text' using errcode = '22023';
  end if;
  perform pac.assert_no_collaboration_surveillance_text(candidate);
  value_text := candidate #>> '{}';
  name_scan := regexp_replace(
    value_text,
    '\m(Minnesota Department of Human Services|Aging and Disability Services Administration|Disability Services Division|Office of Indian Policy|Human Resources|Employee Culture|Civil Rights|Equity Director|Equity Specialist|Program Steward|Practice Owner|One DHS|One DSD)\M',
    ' ',
    'gi'
  );
  if value_text ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}'
    or value_text ~ '\m[0-9]{3}-[0-9]{2}-[0-9]{4}\M'
    or value_text ~ '\m[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}\M'
    or value_text ~* '\m(employee|staff|worker|personnel)[[:space:]]*(id|number|no\.?|#)[[:space:]#:]*[A-Z0-9-]{3,}\M'
    or value_text ~* '\m(case|claim|client|PMI|MA|MAXIS|MMIS|MnCHOICES|recipient|member)[[:space:]]*(id|number|no\.?|#)[[:space:]#:]*[A-Z]?[0-9]{4,}\M'
    or value_text ~* '\m(date of birth|DOB)[[:space:]:]*[0-9]{1,2}[/\-][0-9]{1,2}[/\-][0-9]{2,4}\M'
    or name_scan ~ '\m[A-Z][[:alpha:]''’-]{1,40}[[:space:]]+[A-Z][[:alpha:]''’-]{1,40}\M'
    or name_scan ~* '\m(by|with|from|contact|email|call|ask)[[:space:]]+[[:alpha:]''’-]{2,40}[[:space:]]+[[:alpha:]''’-]{2,40}\M'
    or name_scan ~* '\m(assigned[[:space:]]+to|reviewed[[:space:]]+by|prepared[[:space:]]+by|submitted[[:space:]]+by|approved[[:space:]]+by|written[[:space:]]+by|met[[:space:]]+with|sent[[:space:]]+to|forwarded[[:space:]]+to)[[:space:]]+[[:alpha:]''’-]{2,40}[[:space:]]+[[:alpha:]''’-]{2,40}\M'
    or name_scan ~* '\m[[:alpha:]][.][[:space:]]+[[:alpha:]''’-]{2,40}\M'
    or name_scan ~* '\m[[:alpha:]''’-]{2,40},[[:space:]]+[[:alpha:]''’-]{2,40}\M'
    or name_scan ~* '\m[[:alpha:]''’-]{1,40}[[:space:]]+[[:alpha:]''’-]{2,40}[[:space:]]+(will|can|should|must|is|was|has|had)[[:space:]]+(review|contact|call|email|prepare|submit|approve|write|meet|send|forward)\M'
    or name_scan ~* '\m(waiting[[:space:]]+for|coordinate[[:space:]]+through|escalate([[:space:]]+this|[[:space:]]+the)?([[:space:]]+matter|[[:space:]]+request)?[[:space:]]+to|reviewer[[:space:]]+is|reviewer:)[[:space:]]+[[:alpha:]''’-]{1,40}[[:space:]]+[[:alpha:]''’-]{2,40}\M'
    or name_scan ~* '(^|[.!?][[:space:]]+)[[:alpha:]''’-]{1,40}[[:space:]]+[[:alpha:]''’-]{2,40}[[:space:]]+(is|was|has|had|will|can|should|must|owns|holds|keeps|attended|reviewed|prepared|submitted|approved|wrote|met|sent|forwarded)[[:space:]]'
    or (
      value_text ~* '\m(my|our|this|the|a|an)[[:space:]]+(client|patient|participant|recipient|resident|member|employee|coworker|co-worker|colleague|supervisor|manager|staff member|worker|caseworker)\M'
      and value_text ~* '\m(diagnosis|diagnosed|medical|medication|hospitalized|disability|accommodation|eligibility|benefits|waiver|case|claim|assessment|complaint|grievance|investigation|discipline|termination|harassment|performance review|PIP)\M'
    )
    or value_text ~* '\m(complaint|grievance)[[:space:]]+(about|against)\M'
    or value_text ~* '\m(investigate|investigation|discipline|disciplinary action|write-up|terminate|demote|suspend)[[:space:]]+(my|a|the|this|our)?[[:space:]]*(coworker|co-worker|colleague|employee|supervisor|manager|staff|person)\M' then
    raise exception 'Consultation owner text contains private person details' using errcode = '22023';
  end if;
end;
$$;

create or replace function pac.assert_runtime_work_object_contract(
  requested_kind text,
  requested_object_id text,
  payload jsonb
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  entry record;
  nested_entry record;
  collection_name text;
  collection_keys text[];
begin
  perform pac.assert_no_prohibited_profile_fields(payload);
  if requested_object_id is null or btrim(requested_object_id) = ''
    or length(requested_object_id) > 180
    or payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'Work object does not match an approved persistence contract' using errcode = '22023';
  end if;

  if requested_kind = 'consult_request' then
    if payload ->> 'record_type' = 'consultation_tombstone' then
      perform pac.assert_allowed_jsonb_keys(payload, array[
        'record_type', 'request_id', 'status', 'access_key_hash',
        'access_key_version', 'retention_policy_id', 'retention_expires_at',
        'redacted_at', 'updated_at', 'version'
      ]);
      perform pac.assert_jsonb_scalar_types(
        payload,
        array[
          'record_type', 'request_id', 'status', 'access_key_hash',
          'access_key_version', 'retention_policy_id', 'retention_expires_at',
          'redacted_at', 'updated_at'
        ],
        array[]::text[],
        array['version']
      );
      if not (payload ?& array[
        'record_type', 'request_id', 'status', 'access_key_hash',
        'access_key_version', 'retention_policy_id', 'retention_expires_at',
        'redacted_at', 'updated_at', 'version'
      ])
        or payload ->> 'request_id' is distinct from requested_object_id
        or payload ->> 'status' <> 'expired'
        or payload ->> 'access_key_hash' !~ '^[a-f0-9]{64}$'
        or payload ->> 'access_key_version' <> 'sha256-v1'
        or coalesce(payload ->> 'retention_policy_id', '') = ''
        or not pac.jsonb_is_canonical_utc_instant(payload -> 'retention_expires_at')
        or not pac.jsonb_is_canonical_utc_instant(payload -> 'redacted_at')
        or not pac.jsonb_is_canonical_utc_instant(payload -> 'updated_at')
        or not pac.jsonb_is_safe_integer(payload -> 'version', 2) then
        raise exception 'Invalid consultation tombstone persistence contract' using errcode = '22023';
      end if;
      return;
    end if;

    perform pac.assert_no_collaboration_surveillance_text(payload);
    perform pac.assert_allowed_jsonb_keys(payload, array[
      'record_type', 'request_id', 'access_key_hash', 'access_key_version',
      'sensitivity_class', 'participation_class', 'official_record',
      'eligibility_status', 'participation_acknowledged_at',
      'retention_policy_id', 'retention_expires_at', 'submission_fingerprint',
      'created_at', 'updated_at', 'version', 'status', 'status_reason',
      'scheduled_for', 'owner_notes', 'pinned_order', 'priority_signals',
      'packet', 'correction_history', 'history', 'program_context',
      'dsd_eligibility_attestation', 'requester_role', 'work_name', 'stage',
      'goals', 'equity_questions_considered', 'desired_support_type',
      'support_other_note', 'timing_urgency', 'deadline_date',
      'affected_populations', 'populations_note', 'access_language_needs',
      'access_note', 'preferred_meeting_mode', 'links', 'attachment_notes',
      'situation', 'ask_context', 'path_id', 'participation_notice_id',
      'participation_notice_version', 'share_confirmation'
    ]);
    perform pac.assert_jsonb_scalar_types(
      payload,
      array[
        'record_type', 'request_id', 'access_key_hash', 'access_key_version',
        'sensitivity_class', 'participation_class', 'eligibility_status',
        'participation_acknowledged_at', 'retention_policy_id',
        'retention_expires_at', 'submission_fingerprint', 'created_at',
        'updated_at', 'status', 'status_reason', 'scheduled_for', 'owner_notes',
        'program_context', 'requester_role', 'work_name', 'stage', 'goals',
        'equity_questions_considered', 'support_other_note', 'timing_urgency',
        'deadline_date', 'populations_note', 'access_note',
        'preferred_meeting_mode', 'attachment_notes', 'situation', 'path_id',
        'participation_notice_id', 'participation_notice_version'
      ],
      array['official_record', 'dsd_eligibility_attestation', 'share_confirmation'],
      array['version', 'pinned_order']
    );
    if not (payload ?& array[
      'record_type', 'request_id', 'access_key_hash', 'access_key_version',
      'sensitivity_class', 'participation_class', 'official_record',
      'eligibility_status', 'participation_acknowledged_at',
      'retention_policy_id', 'retention_expires_at', 'submission_fingerprint',
      'created_at', 'updated_at', 'version', 'status', 'priority_signals',
      'packet', 'history', 'program_context', 'dsd_eligibility_attestation',
      'work_name', 'stage', 'goals', 'equity_questions_considered',
      'desired_support_type', 'support_other_note', 'timing_urgency',
      'deadline_date', 'affected_populations', 'populations_note',
      'access_language_needs', 'access_note', 'links', 'attachment_notes',
      'situation', 'participation_notice_id', 'participation_notice_version',
      'share_confirmation'
    ])
      or payload ->> 'record_type' <> 'consultation_request'
      or payload ->> 'request_id' is distinct from requested_object_id
      or requested_object_id !~ '^CR-[0-9]{8}-[0-9]{4,10}$'
      or payload ->> 'access_key_hash' !~ '^[a-f0-9]{64}$'
      or payload ->> 'access_key_version' <> 'sha256-v1'
      or payload ->> 'sensitivity_class' <> 'S3'
      or payload ->> 'participation_class' <> 'voluntary_shared'
      or payload -> 'official_record' <> 'false'::jsonb
      or payload ->> 'eligibility_status' not in ('pending', 'confirmed_dsd', 'not_dsd')
      or payload ->> 'status' not in (
        'pending_eligibility_review', 'received', 'under_review', 'scheduled',
        'in_progress', 'completed', 'declined', 'withdrawn'
      )
      or not (
        (payload ->> 'eligibility_status' = 'pending' and payload ->> 'status' in ('pending_eligibility_review', 'withdrawn'))
        or (payload ->> 'eligibility_status' = 'confirmed_dsd' and payload ->> 'status' in ('received', 'under_review', 'scheduled', 'in_progress', 'completed', 'declined', 'withdrawn'))
        or (payload ->> 'eligibility_status' = 'not_dsd' and payload ->> 'status' = 'declined')
      )
      or (payload ->> 'status' = 'scheduled' and not (
        payload ? 'scheduled_for' and pac.jsonb_is_instant(payload -> 'scheduled_for')
      ))
      or (payload ->> 'status' = 'declined' and btrim(coalesce(payload ->> 'status_reason', '')) = '')
      or not pac.jsonb_is_canonical_utc_instant(payload -> 'participation_acknowledged_at')
      or coalesce(payload ->> 'retention_policy_id', '') = ''
      or not pac.jsonb_is_canonical_utc_instant(payload -> 'retention_expires_at')
      or payload ->> 'submission_fingerprint' !~ '^[a-f0-9]{64}$'
      or not pac.jsonb_is_canonical_utc_instant(payload -> 'created_at')
      or not pac.jsonb_is_canonical_utc_instant(payload -> 'updated_at')
      or not pac.jsonb_is_safe_integer(payload -> 'version', 1)
      or payload ->> 'program_context' <> 'one_dsd'
      or payload -> 'dsd_eligibility_attestation' <> 'true'::jsonb
      or payload ->> 'stage' not in ('conceptual', 'designing', 'launching', 'live_change')
      or coalesce(payload ->> 'work_name', '') = ''
      or coalesce(payload ->> 'goals', '') = ''
      or jsonb_typeof(payload -> 'equity_questions_considered') <> 'string'
      or jsonb_typeof(payload -> 'support_other_note') <> 'string'
      or payload ->> 'timing_urgency' not in ('exploratory', 'within_2_weeks', 'hard_deadline', 'live_urgent')
      or jsonb_typeof(payload -> 'deadline_date') <> 'string'
      or jsonb_typeof(payload -> 'populations_note') <> 'string'
      or jsonb_typeof(payload -> 'access_note') <> 'string'
      or jsonb_typeof(payload -> 'attachment_notes') <> 'string'
      or coalesce(payload ->> 'situation', '') = ''
      or payload ->> 'participation_notice_id' <> 'dsd_consultation_request'
      or payload ->> 'participation_notice_version' <> '1.0.0'
      or payload -> 'share_confirmation' <> 'true'::jsonb
      or (payload ? 'requester_role' and payload ->> 'requester_role' not in ('program_ops', 'supervisor', 'equity_director_specialist', 'analyst_tech', 'communications', 'procurement_contracts', 'other'))
      or (payload ? 'preferred_meeting_mode' and payload ->> 'preferred_meeting_mode' not in ('in_person', 'virtual', 'either', 'not_sure'))
      or (payload ? 'scheduled_for' and not pac.jsonb_is_instant(payload -> 'scheduled_for'))
      or (payload ? 'pinned_order' and not pac.jsonb_is_safe_integer(payload -> 'pinned_order')) then
      raise exception 'Invalid consultation request persistence contract' using errcode = '22023';
    end if;

    perform pac.assert_jsonb_string_array(payload -> 'desired_support_type', array[
      'scoping_goals', 'equity_embed_review', 'access_language_check',
      'stakeholder_partner_map', 'facilitation_prep', 'other'
    ]);
    perform pac.assert_jsonb_string_array(payload -> 'affected_populations', array[
      'language_access_needs', 'disability_access', 'rural_greater_minnesota',
      'older_adults', 'children_families', 'immigrant_refugee_general',
      'specific_minnesota_community', 'tribal_nation'
    ]);
    perform pac.assert_jsonb_string_array(payload -> 'access_language_needs', array[
      'interpreter_for_consult', 'captioning', 'plain_language_materials',
      'timing_constraints', 'other'
    ]);
    perform pac.assert_jsonb_string_array(payload -> 'links');
    if payload ? 'status_reason' then
      perform pac.assert_consultation_owner_text_safe(payload -> 'status_reason');
    end if;
    if payload ? 'owner_notes' then
      perform pac.assert_consultation_owner_text_safe(payload -> 'owner_notes');
    end if;

    if payload ? 'ask_context' then
      perform pac.assert_allowed_jsonb_keys(payload -> 'ask_context', array['session_id', 'intents_tried', 'excerpt']);
      if not (payload -> 'ask_context' ?& array['session_id', 'intents_tried', 'excerpt'])
        or jsonb_typeof(payload -> 'ask_context' -> 'session_id') <> 'string'
        or coalesce(payload -> 'ask_context' ->> 'session_id', '') = ''
        or jsonb_typeof(payload -> 'ask_context' -> 'excerpt') <> 'string'
        or coalesce(payload -> 'ask_context' ->> 'excerpt', '') = '' then
        raise exception 'Invalid consultation Ask context contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_string_array(payload -> 'ask_context' -> 'intents_tried');
    end if;

    perform pac.assert_allowed_jsonb_keys(payload -> 'priority_signals', array[
      'urgency_weight', 'support_weight', 'stage_weight', 'total', 'tribal_gate', 'high_stakes'
    ]);
    if not (payload -> 'priority_signals' ?& array[
      'urgency_weight', 'support_weight', 'stage_weight', 'total', 'tribal_gate', 'high_stakes'
    ])
      or exists (
        select 1 from jsonb_each(payload -> 'priority_signals') signal
        where signal.key in ('urgency_weight', 'support_weight', 'stage_weight', 'total')
          and jsonb_typeof(signal.value) <> 'number'
      )
      or jsonb_typeof(payload -> 'priority_signals' -> 'tribal_gate') <> 'boolean'
      or jsonb_typeof(payload -> 'priority_signals' -> 'high_stakes') <> 'boolean' then
      raise exception 'Invalid consultation priority-signal contract' using errcode = '22023';
    end if;

    perform pac.assert_allowed_jsonb_keys(payload -> 'packet', array[
      'snapshot', 'summary', 'equity_questions_considered', 'suggested_questions',
      'related_resources', 'risks_unknowns', 'agenda', 'calendar_handoff', 'ask_context'
    ]);
    perform pac.assert_jsonb_scalar_types(
      payload -> 'packet', array['calendar_handoff'], array[]::text[], array[]::text[]
    );
    if not (payload -> 'packet' ?& array[
      'snapshot', 'summary', 'equity_questions_considered', 'suggested_questions',
      'related_resources', 'risks_unknowns', 'agenda', 'calendar_handoff'
    ])
      or jsonb_typeof(payload -> 'packet' -> 'snapshot') <> 'object'
      or coalesce(payload -> 'packet' ->> 'calendar_handoff', '') = '' then
      raise exception 'Invalid consultation packet contract' using errcode = '22023';
    end if;
    perform pac.assert_allowed_jsonb_keys(payload -> 'packet' -> 'snapshot', array[
      'Reference ID', 'Status', 'Submitted', 'Stage', 'Work name', 'Desired support',
      'Timing', 'Preferred meeting mode', 'Requester role'
    ]);
    if exists (
      select 1 from jsonb_each(payload -> 'packet' -> 'snapshot') snapshot_entry
      where jsonb_typeof(snapshot_entry.value) <> 'string'
    ) then
      raise exception 'Invalid consultation packet snapshot contract' using errcode = '22023';
    end if;
    perform pac.assert_jsonb_string_array(payload -> 'packet' -> 'summary');
    perform pac.assert_jsonb_string_array(payload -> 'packet' -> 'equity_questions_considered');
    perform pac.assert_jsonb_string_array(payload -> 'packet' -> 'risks_unknowns');

    if jsonb_typeof(payload -> 'packet' -> 'suggested_questions') <> 'array'
      or jsonb_typeof(payload -> 'packet' -> 'related_resources') <> 'array'
      or jsonb_typeof(payload -> 'packet' -> 'agenda') <> 'array' then
      raise exception 'Invalid consultation packet collection contract' using errcode = '22023';
    end if;
    for entry in select value from jsonb_array_elements(payload -> 'packet' -> 'suggested_questions')
    loop
      perform pac.assert_allowed_jsonb_keys(entry.value, array['id', 'category', 'text']);
      if not (entry.value ?& array['id', 'category', 'text'])
        or jsonb_typeof(entry.value -> 'id') <> 'string'
        or jsonb_typeof(entry.value -> 'category') <> 'string'
        or jsonb_typeof(entry.value -> 'text') <> 'string'
        or coalesce(entry.value ->> 'id', '') = ''
        or coalesce(entry.value ->> 'category', '') = ''
        or coalesce(entry.value ->> 'text', '') = '' then
        raise exception 'Invalid consultation suggested-question contract' using errcode = '22023';
      end if;
    end loop;
    for entry in select value from jsonb_array_elements(payload -> 'packet' -> 'related_resources')
    loop
      perform pac.assert_allowed_jsonb_keys(entry.value, array[
        'id', 'title', 'href', 'authority', 'authorityLabel', 'reviewDate', 'excerpt', 'citeable'
      ]);
      if not (entry.value ?& array['id', 'title', 'href', 'authority', 'authorityLabel', 'reviewDate', 'excerpt', 'citeable'])
        or exists (
          select 1 from jsonb_each(entry.value) resource_field
          where resource_field.key in ('id', 'title', 'href', 'authority', 'authorityLabel', 'reviewDate', 'excerpt')
            and jsonb_typeof(resource_field.value) <> 'string'
        )
        or exists (
          select 1 from jsonb_each(entry.value) resource_field
          where resource_field.key in ('id', 'title', 'href', 'authority', 'authorityLabel', 'reviewDate', 'excerpt')
            and coalesce(resource_field.value #>> '{}', '') = ''
        )
        or jsonb_typeof(entry.value -> 'citeable') <> 'boolean' then
        raise exception 'Invalid consultation related-resource contract' using errcode = '22023';
      end if;
    end loop;
    for entry in select value from jsonb_array_elements(payload -> 'packet' -> 'agenda')
    loop
      perform pac.assert_allowed_jsonb_keys(entry.value, array['minutes', 'item', 'owner']);
      if not (entry.value ?& array['minutes', 'item', 'owner'])
        or jsonb_typeof(entry.value -> 'minutes') <> 'number'
        or jsonb_typeof(entry.value -> 'item') <> 'string'
        or jsonb_typeof(entry.value -> 'owner') <> 'string'
        or coalesce(entry.value ->> 'item', '') = ''
        or coalesce(entry.value ->> 'owner', '') = '' then
        raise exception 'Invalid consultation agenda contract' using errcode = '22023';
      end if;
    end loop;
    if payload -> 'packet' ? 'ask_context' then
      perform pac.assert_allowed_jsonb_keys(payload -> 'packet' -> 'ask_context', array['intents_tried', 'excerpt']);
      if not (payload -> 'packet' -> 'ask_context' ?& array['intents_tried', 'excerpt'])
        or jsonb_typeof(payload -> 'packet' -> 'ask_context' -> 'excerpt') <> 'string'
        or coalesce(payload -> 'packet' -> 'ask_context' ->> 'excerpt', '') = '' then
        raise exception 'Invalid consultation packet Ask context contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_string_array(payload -> 'packet' -> 'ask_context' -> 'intents_tried');
    end if;

    if jsonb_typeof(payload -> 'history') <> 'array' or jsonb_array_length(payload -> 'history') = 0 then
      raise exception 'Invalid consultation history contract' using errcode = '22023';
    end if;
    for entry in select value from jsonb_array_elements(payload -> 'history')
    loop
      perform pac.assert_allowed_jsonb_keys(entry.value, array['at', 'status', 'by', 'note']);
      if not (entry.value ?& array['at', 'status', 'by'])
        or jsonb_typeof(entry.value -> 'at') <> 'string'
        or not pac.jsonb_is_canonical_utc_instant(entry.value -> 'at')
        or jsonb_typeof(entry.value -> 'status') <> 'string'
        or jsonb_typeof(entry.value -> 'by') <> 'string'
        or entry.value ->> 'status' not in (
          'pending_eligibility_review', 'received', 'under_review', 'scheduled',
          'in_progress', 'completed', 'declined', 'withdrawn'
        )
        or entry.value ->> 'by' not in ('system', 'requester', 'owner')
        or (entry.value ? 'note' and jsonb_typeof(entry.value -> 'note') <> 'string') then
        raise exception 'Invalid consultation history entry contract' using errcode = '22023';
      end if;
    end loop;
    if payload -> 'history' -> -1 ->> 'status' is distinct from payload ->> 'status' then
      raise exception 'Consultation history does not match current status' using errcode = '22023';
    end if;

    if payload ? 'correction_history' then
      if jsonb_typeof(payload -> 'correction_history') <> 'array' then
        raise exception 'Invalid consultation correction history contract' using errcode = '22023';
      end if;
      for entry in select value from jsonb_array_elements(payload -> 'correction_history')
      loop
        perform pac.assert_allowed_jsonb_keys(entry.value, array['at', 'fields', 'by']);
        if not (entry.value ?& array['at', 'fields', 'by'])
          or jsonb_typeof(entry.value -> 'at') <> 'string'
          or not pac.jsonb_is_canonical_utc_instant(entry.value -> 'at')
          or jsonb_typeof(entry.value -> 'by') <> 'string'
          or entry.value ->> 'by' <> 'requester' then
          raise exception 'Invalid consultation correction history entry' using errcode = '22023';
        end if;
        perform pac.assert_jsonb_string_array(entry.value -> 'fields', array[
          'requester_role', 'work_name', 'stage', 'goals',
          'equity_questions_considered', 'desired_support_type', 'support_other_note',
          'timing_urgency', 'deadline_date', 'affected_populations',
          'populations_note', 'access_language_needs', 'access_note',
          'preferred_meeting_mode', 'links', 'attachment_notes', 'situation'
        ]);
      end loop;
    end if;
    return;
  end if;

  if requested_kind = 'decision' then
    if requested_object_id = 'autonomy_policy' then
      perform pac.assert_allowed_jsonb_keys(payload, array[
        'killed', 'max_autonomy', 'agents', 'flags', 'updated_at', 'by', 'note'
      ]);
      if not (payload ?& array['killed', 'max_autonomy', 'agents', 'flags', 'updated_at', 'by']) then
        raise exception 'Invalid autonomy policy persistence contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        payload,
        array['max_autonomy', 'updated_at', 'by', 'note'],
        array['killed'],
        array[]::text[]
      );
      if jsonb_typeof(payload -> 'agents') <> 'object'
        or jsonb_typeof(payload -> 'flags') <> 'object'
        or payload ->> 'max_autonomy' not in ('A0', 'A1', 'A2', 'A3', 'A4', 'A5')
        or coalesce(payload ->> 'updated_at', '') = ''
        or payload ->> 'by' not in ('env_default', 'owner', 'system') then
        raise exception 'Invalid autonomy policy persistence contract' using errcode = '22023';
      end if;
      perform pac.assert_agent_override_contract(payload -> 'agents');
      perform pac.assert_flag_override_contract(payload -> 'flags');
    elsif requested_object_id = 'research_policy' then
      perform pac.assert_allowed_jsonb_keys(payload, array[
        'enabled', 'mode', 'provider_order', 'daily_request_cap',
        'monthly_usd_cap', 'allowed_domains', 'recency', 'deep_research_enabled'
      ]);
      if payload = '{}'::jsonb then
        raise exception 'Invalid research policy persistence contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        payload,
        array['mode', 'recency'],
        array['enabled', 'deep_research_enabled'],
        array['daily_request_cap', 'monthly_usd_cap']
      );
      if (payload ? 'mode' and payload ->> 'mode' not in ('auto', 'on_request', 'off'))
        or (payload ? 'recency' and payload ->> 'recency' not in ('any', 'year', 'month', 'week'))
        or (payload ? 'daily_request_cap' and (
          not pac.jsonb_is_safe_integer(payload -> 'daily_request_cap', 0)
          or (payload ->> 'daily_request_cap')::numeric > 100000
        ))
        or (payload ? 'monthly_usd_cap' and (
          (payload ->> 'monthly_usd_cap')::numeric < 0
          or (payload ->> 'monthly_usd_cap')::numeric > 100000
        )) then
        raise exception 'Invalid research policy persistence contract' using errcode = '22023';
      end if;
      if payload ? 'provider_order' then
        perform pac.assert_jsonb_string_array(payload -> 'provider_order', array[
          'perplexity_agent', 'fixture', 'perplexity_direct', 'vercel_gateway'
        ]);
      end if;
      if payload ? 'allowed_domains' then
        perform pac.assert_jsonb_string_array(payload -> 'allowed_domains');
        if jsonb_array_length(payload -> 'allowed_domains') > 20
          or (select count(*) from jsonb_array_elements_text(payload -> 'allowed_domains'))
            <> (select count(distinct domain) from jsonb_array_elements_text(payload -> 'allowed_domains') domain)
          or exists (
            select 1 from jsonb_array_elements_text(payload -> 'allowed_domains') domain
            where domain !~ '^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]([a-z0-9-]{0,61}[a-z0-9])?$'
          ) then
          raise exception 'Invalid research policy domain contract' using errcode = '22023';
        end if;
      end if;
    elsif requested_object_id like 'research_usage:%' then
      perform pac.assert_allowed_jsonb_keys(payload, array[
        'id', 'at', 'provider', 'model', 'depth', 'query_hash', 'domains',
        'estimated_usd', 'reported_usd', 'input_tokens', 'output_tokens',
        'search_queries', 'web_search_calls', 'fetch_url_calls', 'tool_calls',
        'ok', 'error_code', 'latency_ms', 'trace_id', 'provider_trace_id'
      ]);
      if not (payload ?& array[
        'id', 'at', 'provider', 'model', 'depth', 'query_hash', 'domains',
        'estimated_usd', 'ok', 'latency_ms', 'trace_id'
      ]) then
        raise exception 'Invalid research usage persistence contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        payload,
        array[
          'id', 'at', 'provider', 'model', 'depth', 'query_hash', 'error_code',
          'trace_id', 'provider_trace_id'
        ],
        array['ok'],
        array[
          'estimated_usd', 'reported_usd', 'input_tokens', 'output_tokens',
          'search_queries', 'web_search_calls', 'fetch_url_calls', 'tool_calls',
          'latency_ms'
        ]
      );
      if requested_object_id is distinct from 'research_usage:' || (payload ->> 'id')
        or payload ->> 'id' !~ '^ru_[0-9]{14}_[a-f0-9]{6}_[a-f0-9]{4}$'
        or not pac.jsonb_is_canonical_utc_instant(payload -> 'at')
        or payload ->> 'provider' not in ('perplexity_agent', 'fixture')
        or payload ->> 'depth' not in ('current_web', 'deep_research')
        or not (
          payload ->> 'model' in (
            'fixture/research-1', 'perplexity-search', 'fast', 'low', 'medium', 'high'
          )
          or payload ->> 'model' ~ '^msh_[a-f0-9]{64}$'
        )
        or payload ->> 'query_hash' !~ '^[a-f0-9]{16}$'
        or payload ->> 'trace_id' !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        or (payload ? 'provider_trace_id'
          and payload ->> 'provider_trace_id' !~ '^pth_[a-f0-9]{64}$')
        or (payload ? 'error_code'
          and payload ->> 'error_code' <> 'research_execution_failed')
        or (payload -> 'ok' = 'true'::jsonb and payload ? 'error_code')
        or (payload -> 'ok' = 'false'::jsonb
          and payload ->> 'error_code' is distinct from 'research_execution_failed')
        or (payload ->> 'estimated_usd')::numeric < 0
        or (payload ? 'reported_usd' and (payload ->> 'reported_usd')::numeric < 0)
        or not pac.jsonb_is_safe_integer(payload -> 'latency_ms', 0)
        or exists (
          select 1
          from unnest(array[
            'input_tokens', 'output_tokens', 'search_queries', 'web_search_calls',
            'fetch_url_calls', 'tool_calls'
          ]) counter_name
          where payload ? counter_name
            and not pac.jsonb_is_safe_integer(payload -> counter_name, 0)
        ) then
        raise exception 'Invalid research usage persistence contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_string_array(payload -> 'domains');
      if jsonb_array_length(payload -> 'domains') > 20
        or (select count(*) from jsonb_array_elements_text(payload -> 'domains'))
          <> (select count(distinct domain) from jsonb_array_elements_text(payload -> 'domains') domain)
        or exists (
          select 1 from jsonb_array_elements_text(payload -> 'domains') domain
          where domain !~ '^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]([a-z0-9-]{0,61}[a-z0-9])?$'
        ) then
        raise exception 'Invalid research usage domain contract' using errcode = '22023';
      end if;
    elsif requested_object_id ~ '^owner-session-revoked-[a-f0-9]{64}$' then
      perform pac.assert_allowed_jsonb_keys(payload, array['kind', 'session_hash', 'revoked_at', 'expires_at']);
      if payload ->> 'kind' <> 'owner_session_revocation'
        or payload ->> 'session_hash' !~ '^[a-f0-9]{64}$'
        or coalesce(payload ->> 'revoked_at', '') = ''
        or coalesce(payload ->> 'expires_at', '') = '' then
        raise exception 'Invalid owner-session revocation contract' using errcode = '22023';
      end if;
    elsif requested_object_id like 'cycle:%' then
      perform pac.assert_allowed_jsonb_keys(payload, array[
        'id', 'at', 'by', 'policy', 'effective_ceiling', 'generative', 'steps',
        'triaged', 'expired_consultations', 'refreshed_packets', 'stale_flags',
        'quality_problems', 'a11y', 'proposals', 'summary', 'exceptions', 'undone'
      ]);
      if not (payload ?& array[
        'id', 'at', 'by', 'policy', 'effective_ceiling', 'generative', 'steps',
        'triaged', 'expired_consultations', 'refreshed_packets', 'stale_flags',
        'quality_problems', 'a11y', 'proposals', 'summary', 'exceptions'
      ]) then
        raise exception 'Invalid cycle report persistence contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        payload,
        array['id', 'at', 'by', 'effective_ceiling', 'summary'],
        array['generative'],
        array[]::text[]
      );
      if requested_object_id is distinct from 'cycle:' || (payload ->> 'id')
        or payload ->> 'id' !~ '^cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        or coalesce(payload ->> 'at', '') = ''
        or payload ->> 'by' not in ('owner', 'cron')
        or payload ->> 'effective_ceiling' not in ('A0', 'A1', 'A2', 'A3', 'A4', 'A5')
        or coalesce(payload ->> 'summary', '') = ''
        or jsonb_typeof(payload -> 'policy') <> 'object' then
        raise exception 'Invalid cycle report persistence contract' using errcode = '22023';
      end if;
      perform pac.assert_allowed_jsonb_keys(payload -> 'policy', array['max_autonomy', 'killed']);
      if not (payload -> 'policy' ?& array['max_autonomy', 'killed']) then
        raise exception 'Invalid cycle policy contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        payload -> 'policy', array['max_autonomy'], array['killed'], array[]::text[]
      );
      if payload -> 'policy' ->> 'max_autonomy' not in ('A0', 'A1', 'A2', 'A3', 'A4', 'A5') then
        raise exception 'Invalid cycle policy contract' using errcode = '22023';
      end if;

      perform pac.assert_jsonb_string_array(payload -> 'expired_consultations');
      perform pac.assert_jsonb_string_array(payload -> 'refreshed_packets');
      perform pac.assert_jsonb_string_array(payload -> 'exceptions');
      if exists (
        select 1
        from jsonb_array_elements_text(
          (payload -> 'expired_consultations') || (payload -> 'refreshed_packets')
        ) request_id
        where request_id !~ '^CR-[0-9]{8}-[0-9]{4,10}$'
      ) then
        raise exception 'Invalid cycle consultation reference' using errcode = '22023';
      end if;

      if jsonb_typeof(payload -> 'steps') <> 'array'
        or jsonb_typeof(payload -> 'triaged') <> 'array'
        or jsonb_typeof(payload -> 'stale_flags') <> 'array'
        or jsonb_typeof(payload -> 'quality_problems') <> 'array'
        or jsonb_typeof(payload -> 'a11y') <> 'array'
        or jsonb_typeof(payload -> 'proposals') <> 'array' then
        raise exception 'Invalid cycle collection contract' using errcode = '22023';
      end if;

      for entry in select value from jsonb_array_elements(payload -> 'steps')
      loop
        perform pac.assert_allowed_jsonb_keys(entry.value, array['name', 'autonomy', 'outcome', 'detail']);
        if not (entry.value ?& array['name', 'autonomy', 'outcome', 'detail']) then
          raise exception 'Invalid cycle step contract' using errcode = '22023';
        end if;
        perform pac.assert_jsonb_scalar_types(
          entry.value, array['name', 'autonomy', 'outcome', 'detail'], array[]::text[], array[]::text[]
        );
        if coalesce(entry.value ->> 'name', '') = ''
          or entry.value ->> 'autonomy' not in ('A0', 'A1', 'A2', 'A3', 'A4', 'A5')
          or entry.value ->> 'outcome' not in ('done', 'skipped', 'denied') then
          raise exception 'Invalid cycle step contract' using errcode = '22023';
        end if;
      end loop;
      for entry in select value from jsonb_array_elements(payload -> 'triaged')
      loop
        perform pac.assert_allowed_jsonb_keys(entry.value, array['request_id', 'from', 'to']);
        if not (entry.value ?& array['request_id', 'from', 'to']) then
          raise exception 'Invalid cycle triage contract' using errcode = '22023';
        end if;
        perform pac.assert_jsonb_scalar_types(
          entry.value, array['request_id', 'from', 'to'], array[]::text[], array[]::text[]
        );
        if coalesce(entry.value ->> 'request_id', '') = ''
          or entry.value ->> 'request_id' !~ '^CR-[0-9]{8}-[0-9]{4,10}$'
          or coalesce(entry.value ->> 'from', '') = ''
          or coalesce(entry.value ->> 'to', '') = '' then
          raise exception 'Invalid cycle triage contract' using errcode = '22023';
        end if;
      end loop;
      for entry in select value from jsonb_array_elements(payload -> 'stale_flags')
      loop
        perform pac.assert_allowed_jsonb_keys(entry.value, array['id', 'title', 'owner', 'reviewDate', 'problem']);
        if not (entry.value ?& array['id', 'title', 'owner', 'reviewDate', 'problem']) then
          raise exception 'Invalid cycle stale flag contract' using errcode = '22023';
        end if;
        perform pac.assert_jsonb_scalar_types(
          entry.value, array['id', 'title', 'owner', 'reviewDate', 'problem'], array[]::text[], array[]::text[]
        );
        if entry.value ->> 'id' !~ '^((pn|ja|lm|ext|asset)-[a-z0-9][a-z0-9-]{0,119}|somali|hmong|karen|oromo|african-american|latino|vietnamese|khmer|lao|russian-speaking|arabic-speaking|deaf-deafblind-hard-of-hearing|rural|tribal-nations)$'
          or coalesce(entry.value ->> 'title', '') = ''
          or coalesce(entry.value ->> 'reviewDate', '') = ''
          or entry.value ->> 'problem' not in ('past_review_date', 'review_due_soon', 'missing_owner', 'accessibility_pending') then
          raise exception 'Invalid cycle stale flag contract' using errcode = '22023';
        end if;
      end loop;
      for entry in select value from jsonb_array_elements(payload -> 'quality_problems')
      loop
        perform pac.assert_allowed_jsonb_keys(entry.value, array['id', 'problems']);
        if not (entry.value ?& array['id', 'problems'])
          or jsonb_typeof(entry.value -> 'id') <> 'string'
          or entry.value ->> 'id' !~ '^((pn|ja|lm|ext|asset)-[a-z0-9][a-z0-9-]{0,119}|somali|hmong|karen|oromo|african-american|latino|vietnamese|khmer|lao|russian-speaking|arabic-speaking|deaf-deafblind-hard-of-hearing|rural|tribal-nations)$' then
          raise exception 'Invalid cycle quality problem contract' using errcode = '22023';
        end if;
        perform pac.assert_jsonb_string_array(entry.value -> 'problems');
      end loop;
      for entry in select value from jsonb_array_elements(payload -> 'a11y')
      loop
        perform pac.assert_allowed_jsonb_keys(entry.value, array['id', 'blockers', 'should_fix']);
        if not (entry.value ?& array['id', 'blockers', 'should_fix']) then
          raise exception 'Invalid cycle accessibility result contract' using errcode = '22023';
        end if;
        perform pac.assert_jsonb_scalar_types(
          entry.value, array['id'], array[]::text[], array['blockers', 'should_fix']
        );
        if entry.value ->> 'id' !~ '^((pn|ja|lm|ext|asset)-[a-z0-9][a-z0-9-]{0,119}|somali|hmong|karen|oromo|african-american|latino|vietnamese|khmer|lao|russian-speaking|arabic-speaking|deaf-deafblind-hard-of-hearing|rural|tribal-nations)$' then
          raise exception 'Invalid cycle accessibility result contract' using errcode = '22023';
        end if;
      end loop;
      for entry in select value from jsonb_array_elements(payload -> 'proposals')
      loop
        perform pac.assert_proposal_contract(entry.value);
        if entry.value ->> 'cycle_id' is distinct from payload ->> 'id' then
          raise exception 'Invalid cycle proposal reference' using errcode = '22023';
        end if;
      end loop;
      if payload ? 'undone' then
        perform pac.assert_allowed_jsonb_keys(payload -> 'undone', array['at', 'by']);
        if not (payload -> 'undone' ?& array['at', 'by']) then
          raise exception 'Invalid cycle undo contract' using errcode = '22023';
        end if;
        perform pac.assert_jsonb_scalar_types(
          payload -> 'undone', array['at', 'by'], array[]::text[], array[]::text[]
        );
        if coalesce(payload -> 'undone' ->> 'at', '') = ''
          or coalesce(payload -> 'undone' ->> 'by', '') = '' then
          raise exception 'Invalid cycle undo contract' using errcode = '22023';
        end if;
      end if;
    elsif requested_object_id like 'stale_flag:%' then
      perform pac.assert_allowed_jsonb_keys(payload, array[
        'id', 'title', 'owner', 'reviewDate', 'problem', 'cycle_id',
        'flagged_at', 'disposition', 'undone_at'
      ]);
      if not (payload ?& array[
        'id', 'title', 'owner', 'reviewDate', 'problem', 'cycle_id',
        'flagged_at', 'disposition'
      ]) then
        raise exception 'Invalid stale-content decision contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        payload,
        array[
          'id', 'title', 'owner', 'reviewDate', 'problem', 'cycle_id',
          'flagged_at', 'disposition', 'undone_at'
        ],
        array[]::text[],
        array[]::text[]
      );
      if payload ->> 'id' !~ '^((pn|ja|lm|ext|asset)-[a-z0-9][a-z0-9-]{0,119}|somali|hmong|karen|oromo|african-american|latino|vietnamese|khmer|lao|russian-speaking|arabic-speaking|deaf-deafblind-hard-of-hearing|rural|tribal-nations)$'
        or coalesce(payload ->> 'title', '') = ''
        or coalesce(payload ->> 'reviewDate', '') = ''
        or payload ->> 'problem' not in ('past_review_date', 'review_due_soon', 'missing_owner', 'accessibility_pending')
        or requested_object_id is distinct from 'stale_flag:' || (payload ->> 'id') || ':' || (payload ->> 'problem')
        or payload ->> 'cycle_id' !~ '^cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        or coalesce(payload ->> 'flagged_at', '') = ''
        or coalesce(payload ->> 'disposition', '') = '' then
        raise exception 'Invalid stale-content decision contract' using errcode = '22023';
      end if;
    elsif requested_object_id like 'proposal:%' then
      perform pac.assert_proposal_contract(payload);
      if requested_object_id is distinct from 'proposal:' || (payload ->> 'id')
        or requested_object_id !~ '^proposal:cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[pg][1-9][0-9]*$' then
        raise exception 'Invalid proposal decision contract' using errcode = '22023';
      end if;
    elsif requested_object_id like 'rejected_rec:%' then
      perform pac.assert_allowed_jsonb_keys(payload, array['id', 'at', 'title', 'note']);
      if not (payload ?& array['id', 'at', 'title']) then
        raise exception 'Invalid rejected recommendation contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        payload, array['id', 'at', 'title', 'note'], array[]::text[], array[]::text[]
      );
      if requested_object_id is distinct from 'rejected_rec:' || (payload ->> 'id')
        or payload ->> 'id' !~ '^cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[pg][1-9][0-9]*$'
        or coalesce(payload ->> 'at', '') = ''
        or coalesce(payload ->> 'title', '') = '' then
        raise exception 'Invalid rejected recommendation contract' using errcode = '22023';
      end if;
    else
      raise exception 'Unregistered decision persistence family' using errcode = '22023';
    end if;
    return;
  end if;

  if requested_kind = 'eval_result' then
    perform pac.assert_allowed_jsonb_keys(payload, array[
      'id', 'at', 'suites', 'results', 'pass', 'fail', 'manual', 'releaseBlocked'
    ]);
    if not (payload ?& array[
      'id', 'at', 'suites', 'results', 'pass', 'fail', 'manual', 'releaseBlocked'
    ]) then
      raise exception 'Invalid evaluation result persistence contract' using errcode = '22023';
    end if;
    perform pac.assert_jsonb_scalar_types(
      payload,
      array['id', 'at'],
      array['releaseBlocked'],
      array['pass', 'fail', 'manual']
    );
    if payload ->> 'id' is distinct from requested_object_id
      or requested_object_id !~ '^eval-[0-9]{10,16}$'
      or jsonb_typeof(payload -> 'results') <> 'array'
      or coalesce(payload ->> 'at', '') = '' then
      raise exception 'Invalid evaluation result persistence contract' using errcode = '22023';
    end if;
    perform pac.assert_jsonb_string_array(payload -> 'suites', array[
      'ask_mvp', 'ci_mvp', 'ciq_mvp', 'gp_mvp', 'mindset_abc'
    ]);
    for entry in select value from jsonb_array_elements(payload -> 'results')
    loop
      perform pac.assert_allowed_jsonb_keys(entry.value, array['id', 'suite', 'scenario', 'status', 'detail', 'ms']);
      if not (entry.value ?& array['id', 'suite', 'scenario', 'status', 'detail', 'ms']) then
        raise exception 'Invalid evaluation result entry contract' using errcode = '22023';
      end if;
      perform pac.assert_jsonb_scalar_types(
        entry.value,
        array['id', 'suite', 'scenario', 'status', 'detail'],
        array[]::text[],
        array['ms']
      );
      if entry.value ->> 'id' !~ '^(ASK-E[1-9][0-9]*|CI-E[1-9][0-9]*|CIQ-E[1-9][0-9]*|GP-E[1-9][0-9]*|MIND-[ABC][1-9][0-9]*|CP-[1-9][0-9]*)$'
        or entry.value ->> 'suite' not in ('ask_mvp', 'ci_mvp', 'ciq_mvp', 'gp_mvp', 'mindset_abc')
        or coalesce(entry.value ->> 'scenario', '') = ''
        or entry.value ->> 'status' not in ('pass', 'fail', 'manual') then
        raise exception 'Invalid evaluation result entry contract' using errcode = '22023';
      end if;
    end loop;
    return;
  end if;

  if requested_kind = 'collaboration_workspace' then
    perform pac.assert_no_collaboration_surveillance_text(payload);
    perform pac.assert_allowed_jsonb_keys(payload, array[
      'workspace', 'memberships', 'channels', 'channelMemberships', 'threads',
      'posts', 'reactions', 'attachments', 'meetingSeries', 'meetingOccurrences',
      'agendaItems', 'decisions', 'polls', 'pollResponses', 'feedback',
      'feedbackResponses', 'learningActivities', 'notificationPreferences',
      'notificationDeliveries', 'actionItems', 'contentProposals',
      'automationPolicies', 'automationRuns', 'processedKeys', 'revision'
    ]);
    if not (payload ?& array[
      'workspace', 'memberships', 'channels', 'channelMemberships', 'threads',
      'posts', 'reactions', 'attachments', 'meetingSeries', 'meetingOccurrences',
      'agendaItems', 'decisions', 'polls', 'pollResponses', 'feedback',
      'feedbackResponses', 'learningActivities', 'notificationPreferences',
      'notificationDeliveries', 'actionItems', 'contentProposals',
      'automationPolicies', 'automationRuns', 'processedKeys', 'revision'
    ])
      or requested_object_id <> 'one_dsd_team'
      or jsonb_typeof(payload -> 'workspace') <> 'object'
      or not pac.jsonb_is_safe_integer(payload -> 'revision', 1) then
      raise exception 'Invalid collaboration workspace persistence contract' using errcode = '22023';
    end if;
    perform pac.assert_allowed_jsonb_keys(payload -> 'workspace', array[
      'id', 'name', 'programName', 'scopeLabel', 'summary', 'status', 'sample',
      'createdAt', 'updatedAt'
    ]);
    if not (payload -> 'workspace' ?& array[
      'id', 'name', 'programName', 'scopeLabel', 'summary', 'status', 'sample',
      'createdAt', 'updatedAt'
    ]) then
      raise exception 'Invalid collaboration workspace persistence contract' using errcode = '22023';
    end if;
    perform pac.assert_jsonb_scalar_types(
      payload -> 'workspace',
      array['id', 'name', 'programName', 'scopeLabel', 'summary', 'status', 'createdAt', 'updatedAt'],
      array['sample'],
      array[]::text[]
    );
    if payload -> 'workspace' ->> 'id' <> requested_object_id
      or payload -> 'workspace' ->> 'status' not in ('preview', 'pilot', 'active', 'archived')
      or not pac.jsonb_is_instant(payload -> 'workspace' -> 'createdAt')
      or not pac.jsonb_is_instant(payload -> 'workspace' -> 'updatedAt') then
      raise exception 'Invalid collaboration workspace persistence contract' using errcode = '22023';
    end if;
    perform pac.assert_jsonb_string_array(payload -> 'processedKeys');
    if exists (
      select 1
      from jsonb_array_elements_text(payload -> 'processedKeys') key_value
      where key_value = ''
    )
      or (select count(*) from jsonb_array_elements_text(payload -> 'processedKeys'))
        <> (select count(distinct key_value) from jsonb_array_elements_text(payload -> 'processedKeys') key_value) then
      raise exception 'Invalid collaboration idempotency-key contract' using errcode = '22023';
    end if;

    for collection_name, collection_keys in
      select * from (values
        ('memberships', array['id','workspaceId','displayLabel','role','status','sample']),
        ('channels', array['id','workspaceId','name','purpose','access','position','sample','updatedAt']),
        ('channelMemberships', array['id','channelId','workspaceMembershipId','sample']),
        ('threads', array['id','channelId','title','createdByLabel','createdAt','updatedAt','pinned','sample']),
        ('posts', array['id','threadId','parentPostId','body','authorLabel','createdAt','updatedAt','moderationStatus','sample']),
        ('reactions', array['id','postId','memberId','label','sample']),
        ('attachments', array['id','postId','fileName','mediaType','byteSize','checksum','status','accessibilityStatus','sample']),
        ('meetingSeries', array['id','workspaceId','name','purpose','cadence','scheduleNote','sample']),
        ('meetingOccurrences', array['id','seriesId','title','scheduleNote','accessNote','status','sample','updatedAt']),
        ('agendaItems', array['id','meetingOccurrenceId','title','ownerLabel','minutes','position','sample']),
        ('decisions', array['id','workspaceId','title','summary','status','confirmedByLabel','confirmedAt','sourceThreadId','sample']),
        ('polls', array['id','channelId','question','options','status','sample']),
        ('pollResponses', array['id','pollId','memberId','optionId','sample']),
        ('feedback', array['id','channelId','prompt','status','sample']),
        ('feedbackResponses', array['id','feedbackId','authorLabel','response','createdAt','sample']),
        ('learningActivities', array['id','channelId','title','description','reflectionPrompt','status','sample']),
        ('notificationPreferences', array['id','memberId','channelId','mode','quietHoursNote','sample']),
        ('notificationDeliveries', array['id','preferenceId','destinationClass','status','attemptCount','sample']),
        ('actionItems', array['id','workspaceId','title','ownerLabel','dueNote','status','sourceThreadId','sample','updatedAt']),
        ('contentProposals', array['id','workspaceId','title','sourceThreadId','status','sample']),
        ('automationPolicies', array['id','workspaceId','name','status','exactDestination','allowedAction','expiresAt','sample']),
        ('automationRuns', array['id','policyId','status','resultNote','createdAt','sample'])
      ) as contract(collection_name, collection_keys)
    loop
      if jsonb_typeof(payload -> collection_name) <> 'array' then
        raise exception 'Invalid collaboration collection contract' using errcode = '22023';
      end if;
      for entry in select value from jsonb_array_elements(payload -> collection_name)
      loop
        perform pac.assert_allowed_jsonb_keys(entry.value, collection_keys);

        case collection_name
          when 'memberships' then
            if not (entry.value ?& array['id', 'workspaceId', 'displayLabel', 'role', 'status', 'sample']) then
              raise exception 'Invalid collaboration membership contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'workspaceId', 'displayLabel', 'role', 'status'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'workspaceId' <> requested_object_id
              or entry.value ->> 'role' not in (
                'owner', 'steward', 'member', 'contributor', 'reviewer', 'moderator',
                'automation_operator', 'technical_operator'
              )
              or entry.value ->> 'status' not in ('invited', 'active', 'suspended', 'expired', 'revoked') then
              raise exception 'Invalid collaboration membership contract' using errcode = '22023';
            end if;

          when 'channels' then
            if not (entry.value ?& array['id', 'workspaceId', 'name', 'purpose', 'access', 'position', 'sample', 'updatedAt']) then
              raise exception 'Invalid collaboration channel contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'workspaceId', 'name', 'purpose', 'access', 'updatedAt'], array['sample'], array['position']
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'workspaceId' <> requested_object_id
              or entry.value ->> 'access' not in ('workspace', 'private')
              or not pac.jsonb_is_safe_integer(entry.value -> 'position', 0)
              or not pac.jsonb_is_instant(entry.value -> 'updatedAt') then
              raise exception 'Invalid collaboration channel contract' using errcode = '22023';
            end if;

          when 'channelMemberships' then
            if not (entry.value ?& array['id', 'channelId', 'workspaceMembershipId', 'sample']) then
              raise exception 'Invalid collaboration channel membership contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'channelId', 'workspaceMembershipId'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'channels') target
                where target ->> 'id' = entry.value ->> 'channelId'
              )
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'memberships') target
                where target ->> 'id' = entry.value ->> 'workspaceMembershipId'
              ) then
              raise exception 'Invalid collaboration channel membership contract' using errcode = '22023';
            end if;

          when 'threads' then
            if not (entry.value ?& array['id', 'channelId', 'title', 'createdByLabel', 'createdAt', 'updatedAt', 'pinned', 'sample']) then
              raise exception 'Invalid collaboration thread contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'channelId', 'title', 'createdByLabel', 'createdAt', 'updatedAt'],
              array['pinned', 'sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'channels') target
                where target ->> 'id' = entry.value ->> 'channelId'
              )
              or not pac.jsonb_is_instant(entry.value -> 'createdAt')
              or not pac.jsonb_is_instant(entry.value -> 'updatedAt') then
              raise exception 'Invalid collaboration thread contract' using errcode = '22023';
            end if;

          when 'posts' then
            if not (entry.value ?& array[
              'id', 'threadId', 'parentPostId', 'body', 'authorLabel', 'createdAt',
              'updatedAt', 'moderationStatus', 'sample'
            ]) then
              raise exception 'Invalid collaboration post contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'threadId', 'body', 'authorLabel', 'createdAt', 'updatedAt', 'moderationStatus'],
              array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'threads') target
                where target ->> 'id' = entry.value ->> 'threadId'
              )
              or jsonb_typeof(entry.value -> 'parentPostId') not in ('null', 'string')
              or not pac.jsonb_is_instant(entry.value -> 'createdAt')
              or not pac.jsonb_is_instant(entry.value -> 'updatedAt')
              or entry.value ->> 'moderationStatus' not in ('visible', 'held', 'removed') then
              raise exception 'Invalid collaboration post contract' using errcode = '22023';
            end if;
            if jsonb_typeof(entry.value -> 'parentPostId') = 'string'
              and not exists (
                select 1 from jsonb_array_elements(payload -> 'posts') target
                where target ->> 'id' = entry.value ->> 'parentPostId'
                  and target ->> 'id' <> entry.value ->> 'id'
                  and target ->> 'threadId' = entry.value ->> 'threadId'
              ) then
              raise exception 'Invalid collaboration post parent contract' using errcode = '22023';
            end if;

          when 'reactions' then
            if not (entry.value ?& array['id', 'postId', 'memberId', 'label', 'sample']) then
              raise exception 'Invalid collaboration reaction contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'postId', 'memberId', 'label'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'label' not in ('Helpful', 'Support', 'Question')
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'posts') target
                where target ->> 'id' = entry.value ->> 'postId'
              )
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'memberships') target
                where target ->> 'id' = entry.value ->> 'memberId'
              ) then
              raise exception 'Invalid collaboration reaction contract' using errcode = '22023';
            end if;

          when 'attachments' then
            if not (entry.value ?& array[
              'id', 'postId', 'fileName', 'mediaType', 'byteSize', 'checksum',
              'status', 'accessibilityStatus', 'sample'
            ]) then
              raise exception 'Invalid collaboration attachment contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'postId', 'fileName', 'mediaType', 'checksum', 'status', 'accessibilityStatus'],
              array['sample'], array['byteSize']
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'posts') target
                where target ->> 'id' = entry.value ->> 'postId'
              )
              or not pac.jsonb_is_safe_integer(entry.value -> 'byteSize', 0)
              or entry.value ->> 'status' not in ('quarantined', 'approved', 'rejected')
              or entry.value ->> 'accessibilityStatus' not in ('pending', 'reviewed', 'needs_work') then
              raise exception 'Invalid collaboration attachment contract' using errcode = '22023';
            end if;

          when 'meetingSeries' then
            if not (entry.value ?& array['id', 'workspaceId', 'name', 'purpose', 'cadence', 'scheduleNote', 'sample']) then
              raise exception 'Invalid collaboration meeting series contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'workspaceId', 'name', 'purpose', 'cadence', 'scheduleNote'],
              array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'workspaceId' <> requested_object_id
              or entry.value ->> 'cadence' <> 'monthly' then
              raise exception 'Invalid collaboration meeting series contract' using errcode = '22023';
            end if;

          when 'meetingOccurrences' then
            if not (entry.value ?& array[
              'id', 'seriesId', 'title', 'scheduleNote', 'accessNote', 'status', 'sample', 'updatedAt'
            ]) then
              raise exception 'Invalid collaboration meeting occurrence contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'seriesId', 'title', 'scheduleNote', 'accessNote', 'status', 'updatedAt'],
              array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'meetingSeries') target
                where target ->> 'id' = entry.value ->> 'seriesId'
              )
              or entry.value ->> 'status' not in ('planning', 'scheduled', 'completed', 'cancelled')
              or not pac.jsonb_is_instant(entry.value -> 'updatedAt') then
              raise exception 'Invalid collaboration meeting occurrence contract' using errcode = '22023';
            end if;

          when 'agendaItems' then
            if not (entry.value ?& array[
              'id', 'meetingOccurrenceId', 'title', 'ownerLabel', 'minutes', 'position', 'sample'
            ]) then
              raise exception 'Invalid collaboration agenda item contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'meetingOccurrenceId', 'title', 'ownerLabel'],
              array['sample'], array['minutes', 'position']
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'meetingOccurrences') target
                where target ->> 'id' = entry.value ->> 'meetingOccurrenceId'
              )
              or not pac.jsonb_is_safe_integer(entry.value -> 'minutes', 0)
              or not pac.jsonb_is_safe_integer(entry.value -> 'position', 0) then
              raise exception 'Invalid collaboration agenda item contract' using errcode = '22023';
            end if;

          when 'decisions' then
            if not (entry.value ?& array['id', 'workspaceId', 'title', 'summary', 'status', 'sample']) then
              raise exception 'Invalid collaboration decision contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value,
              array['id', 'workspaceId', 'title', 'summary', 'status', 'confirmedByLabel', 'confirmedAt', 'sourceThreadId'],
              array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'workspaceId' <> requested_object_id
              or entry.value ->> 'status' not in ('proposed', 'confirmed', 'superseded')
              or (entry.value ? 'confirmedAt' and not pac.jsonb_is_instant(entry.value -> 'confirmedAt'))
              or (entry.value ? 'sourceThreadId' and not exists (
                select 1 from jsonb_array_elements(payload -> 'threads') target
                where target ->> 'id' = entry.value ->> 'sourceThreadId'
              )) then
              raise exception 'Invalid collaboration decision contract' using errcode = '22023';
            end if;

          when 'polls' then
            if not (entry.value ?& array['id', 'channelId', 'question', 'options', 'status', 'sample']) then
              raise exception 'Invalid collaboration poll contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'channelId', 'question', 'status'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'channels') target
                where target ->> 'id' = entry.value ->> 'channelId'
              )
              or entry.value ->> 'status' not in ('draft', 'open', 'closed')
              or jsonb_typeof(entry.value -> 'options') <> 'array' then
              raise exception 'Invalid collaboration poll contract' using errcode = '22023';
            end if;
            for nested_entry in select value from jsonb_array_elements(entry.value -> 'options')
            loop
              perform pac.assert_allowed_jsonb_keys(nested_entry.value, array['id', 'label']);
              if not (nested_entry.value ?& array['id', 'label']) then
                raise exception 'Invalid collaboration poll option contract' using errcode = '22023';
              end if;
              perform pac.assert_jsonb_scalar_types(
                nested_entry.value, array['id', 'label'], array[]::text[], array[]::text[]
              );
              if coalesce(nested_entry.value ->> 'id', '') = '' then
                raise exception 'Invalid collaboration poll option contract' using errcode = '22023';
              end if;
            end loop;
            if (select count(*) from jsonb_array_elements(entry.value -> 'options'))
              <> (select count(distinct option_value ->> 'id') from jsonb_array_elements(entry.value -> 'options') option_value) then
              raise exception 'Duplicate collaboration poll option id' using errcode = '22023';
            end if;

          when 'pollResponses' then
            if not (entry.value ?& array['id', 'pollId', 'memberId', 'optionId', 'sample']) then
              raise exception 'Invalid collaboration poll response contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'pollId', 'memberId', 'optionId'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'polls') target
                where target ->> 'id' = entry.value ->> 'pollId'
                  and exists (
                    select 1 from jsonb_array_elements(target -> 'options') option_value
                    where option_value ->> 'id' = entry.value ->> 'optionId'
                  )
              )
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'memberships') target
                where target ->> 'id' = entry.value ->> 'memberId'
              ) then
              raise exception 'Invalid collaboration poll response contract' using errcode = '22023';
            end if;

          when 'feedback' then
            if not (entry.value ?& array['id', 'channelId', 'prompt', 'status', 'sample']) then
              raise exception 'Invalid collaboration feedback contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'channelId', 'prompt', 'status'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'channels') target
                where target ->> 'id' = entry.value ->> 'channelId'
              )
              or entry.value ->> 'status' not in ('draft', 'open', 'closed') then
              raise exception 'Invalid collaboration feedback contract' using errcode = '22023';
            end if;

          when 'feedbackResponses' then
            if not (entry.value ?& array['id', 'feedbackId', 'authorLabel', 'response', 'createdAt', 'sample']) then
              raise exception 'Invalid collaboration feedback response contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'feedbackId', 'authorLabel', 'response', 'createdAt'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'feedback') target
                where target ->> 'id' = entry.value ->> 'feedbackId'
              )
              or not pac.jsonb_is_instant(entry.value -> 'createdAt') then
              raise exception 'Invalid collaboration feedback response contract' using errcode = '22023';
            end if;

          when 'learningActivities' then
            if not (entry.value ?& array['id', 'channelId', 'title', 'description', 'reflectionPrompt', 'status', 'sample']) then
              raise exception 'Invalid collaboration learning activity contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'channelId', 'title', 'description', 'reflectionPrompt', 'status'],
              array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'channels') target
                where target ->> 'id' = entry.value ->> 'channelId'
              )
              or entry.value ->> 'status' not in ('planned', 'open', 'complete') then
              raise exception 'Invalid collaboration learning activity contract' using errcode = '22023';
            end if;

          when 'notificationPreferences' then
            if not (entry.value ?& array['id', 'memberId', 'mode', 'sample']) then
              raise exception 'Invalid collaboration notification preference contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'memberId', 'channelId', 'mode', 'quietHoursNote'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'memberships') target
                where target ->> 'id' = entry.value ->> 'memberId'
              )
              or (entry.value ? 'channelId' and not exists (
                select 1 from jsonb_array_elements(payload -> 'channels') target
                where target ->> 'id' = entry.value ->> 'channelId'
              ))
              or entry.value ->> 'mode' not in ('off', 'immediate', 'digest') then
              raise exception 'Invalid collaboration notification preference contract' using errcode = '22023';
            end if;

          when 'notificationDeliveries' then
            if not (entry.value ?& array['id', 'preferenceId', 'destinationClass', 'status', 'attemptCount', 'sample']) then
              raise exception 'Invalid collaboration notification delivery contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'preferenceId', 'destinationClass', 'status'], array['sample'], array['attemptCount']
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'notificationPreferences') target
                where target ->> 'id' = entry.value ->> 'preferenceId'
              )
              or entry.value ->> 'destinationClass' not in ('native', 'email', 'microsoft')
              or entry.value ->> 'status' not in ('pending', 'delivered', 'failed', 'cancelled')
              or not pac.jsonb_is_safe_integer(entry.value -> 'attemptCount', 0) then
              raise exception 'Invalid collaboration notification delivery contract' using errcode = '22023';
            end if;

          when 'actionItems' then
            if not (entry.value ?& array['id', 'workspaceId', 'title', 'ownerLabel', 'dueNote', 'status', 'sample', 'updatedAt']) then
              raise exception 'Invalid collaboration action item contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value,
              array['id', 'workspaceId', 'title', 'ownerLabel', 'dueNote', 'status', 'sourceThreadId', 'updatedAt'],
              array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'workspaceId' <> requested_object_id
              or entry.value ->> 'status' not in ('planned', 'in_progress', 'blocked', 'complete')
              or (entry.value ? 'sourceThreadId' and not exists (
                select 1 from jsonb_array_elements(payload -> 'threads') target
                where target ->> 'id' = entry.value ->> 'sourceThreadId'
              ))
              or not pac.jsonb_is_instant(entry.value -> 'updatedAt') then
              raise exception 'Invalid collaboration action item contract' using errcode = '22023';
            end if;

          when 'contentProposals' then
            if not (entry.value ?& array['id', 'workspaceId', 'title', 'status', 'sample']) then
              raise exception 'Invalid collaboration content proposal contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'workspaceId', 'title', 'sourceThreadId', 'status'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'workspaceId' <> requested_object_id
              or (entry.value ? 'sourceThreadId' and not exists (
                select 1 from jsonb_array_elements(payload -> 'threads') target
                where target ->> 'id' = entry.value ->> 'sourceThreadId'
              ))
              or entry.value ->> 'status' not in ('draft', 'submitted', 'accepted', 'rejected') then
              raise exception 'Invalid collaboration content proposal contract' using errcode = '22023';
            end if;

          when 'automationPolicies' then
            if not (entry.value ?& array['id', 'workspaceId', 'name', 'status', 'allowedAction', 'sample']) then
              raise exception 'Invalid collaboration automation policy contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'workspaceId', 'name', 'status', 'exactDestination', 'allowedAction', 'expiresAt'],
              array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or entry.value ->> 'workspaceId' <> requested_object_id
              or entry.value ->> 'status' not in ('draft', 'approved', 'stopped', 'expired')
              or (entry.value ? 'expiresAt' and not pac.jsonb_is_instant(entry.value -> 'expiresAt')) then
              raise exception 'Invalid collaboration automation policy contract' using errcode = '22023';
            end if;

          when 'automationRuns' then
            if not (entry.value ?& array['id', 'policyId', 'status', 'resultNote', 'createdAt', 'sample']) then
              raise exception 'Invalid collaboration automation run contract' using errcode = '22023';
            end if;
            perform pac.assert_jsonb_scalar_types(
              entry.value, array['id', 'policyId', 'status', 'resultNote', 'createdAt'], array['sample'], array[]::text[]
            );
            if coalesce(entry.value ->> 'id', '') = ''
              or not exists (
                select 1 from jsonb_array_elements(payload -> 'automationPolicies') target
                where target ->> 'id' = entry.value ->> 'policyId'
              )
              or entry.value ->> 'status' not in ('proposed', 'approved', 'running', 'completed', 'stopped', 'failed')
              or not pac.jsonb_is_instant(entry.value -> 'createdAt') then
              raise exception 'Invalid collaboration automation run contract' using errcode = '22023';
            end if;
        end case;
      end loop;

      if (select count(*) from jsonb_array_elements(payload -> collection_name))
        <> (select count(distinct collection_entry ->> 'id') from jsonb_array_elements(payload -> collection_name) collection_entry) then
        raise exception 'Duplicate collaboration collection id' using errcode = '22023';
      end if;
    end loop;
    return;
  end if;

  raise exception 'Unregistered work-object kind' using errcode = '22023';
end;
$$;

create or replace function pac.enforce_runtime_work_object_contract()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_runtime_work_object_contract(new.work_kind, new.object_id, new.value);
  return new;
end;
$$;

-- A new trigger protects future writes only. Refuse the upgrade when an older
-- deployment already contains a work object that the strict contract would not
-- permit, so an invalid legacy row cannot remain trusted after this migration.
do $$
declare
  stored record;
begin
  for stored in
    select work_kind, object_id, value
    from pac.runtime_work_objects
  loop
    perform pac.assert_runtime_work_object_contract(
      stored.work_kind,
      stored.object_id,
      stored.value
    );
  end loop;
end;
$$;

drop trigger if exists runtime_work_object_contract on pac.runtime_work_objects;
create trigger runtime_work_object_contract
before insert or update on pac.runtime_work_objects
for each row execute function pac.enforce_runtime_work_object_contract();

create or replace function pac.assert_runtime_idempotency_receipt_contract(
  requested_idempotency_key text,
  requested_kind text,
  requested_object_id text,
  payload jsonb
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_allowed_jsonb_keys(payload, array['work_kind', 'object_id']);
  if not (payload ?& array['work_kind', 'object_id']) then
    raise exception 'Invalid idempotency receipt contract' using errcode = '22023';
  end if;
  perform pac.assert_jsonb_scalar_types(
    payload,
    array['work_kind', 'object_id'],
    array[]::text[],
    array[]::text[]
  );
  if requested_idempotency_key !~ '^((consult-submit-v2-[a-f0-9]{64})|(idem-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}))$'
    or requested_kind not in ('consult_request', 'decision', 'eval_result', 'collaboration_workspace')
    or payload ->> 'work_kind' is distinct from requested_kind
    or payload ->> 'object_id' is distinct from requested_object_id
    or requested_object_id ~* '((employee|worker|personnel)[-_]?[0-9]{1,12}.*(belief|ideolog|equity|readiness|bias|inclusion|participation|engagement))|((belief|ideolog|equity|readiness|bias|inclusion|participation|engagement).*(employee|worker|personnel)[-_]?[0-9]{1,12})'
    or not (
      (requested_kind = 'consult_request'
        and requested_object_id ~ '^CR-[0-9]{8}-[0-9]{4,10}$')
      or (requested_kind = 'decision' and (
        requested_object_id in ('autonomy_policy', 'research_policy')
        or requested_object_id ~ '^research_usage:ru_[0-9]{14}_[a-f0-9]{6}_[a-f0-9]{4}$'
        or requested_object_id ~ '^owner-session-revoked-[a-f0-9]{64}$'
        or requested_object_id ~ '^cycle:cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        or requested_object_id ~ '^stale_flag:[A-Za-z0-9][A-Za-z0-9_-]{0,127}:(past_review_date|review_due_soon|missing_owner|accessibility_pending)$'
        or requested_object_id ~ '^(proposal|rejected_rec):cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[pg][1-9][0-9]*$'
      ))
      or (requested_kind = 'eval_result'
        and requested_object_id ~ '^eval-[0-9]{10,16}$')
      or (requested_kind = 'collaboration_workspace'
        and requested_object_id = 'one_dsd_team')
    ) then
    raise exception 'Invalid idempotency receipt contract' using errcode = '22023';
  end if;
end;
$$;

create or replace function pac.enforce_runtime_idempotency_receipt_contract()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_runtime_idempotency_receipt_contract(
    new.idempotency_key,
    new.work_kind,
    new.object_id,
    new.value
  );
  return new;
end;
$$;

create or replace function pac.enforce_runtime_idempotency_reference_contract()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if not exists (
    select 1
    from pac.runtime_work_objects work
    where work.work_kind = new.work_kind
      and work.object_id = new.object_id
  ) then
    raise exception 'Idempotency receipt references a missing work object' using errcode = '22023';
  end if;
  return null;
end;
$$;

-- Do not bless legacy replay receipts merely because the stricter triggers did
-- not exist when they were written. Every existing receipt must be opaque,
-- canonical, and point at a purpose-limited work object before this upgrade can
-- complete.
do $$
declare
  stored record;
begin
  for stored in
    select idempotency_key, work_kind, object_id, value
    from pac.runtime_idempotency
  loop
    perform pac.assert_runtime_idempotency_receipt_contract(
      stored.idempotency_key,
      stored.work_kind,
      stored.object_id,
      stored.value
    );
    if not exists (
      select 1
      from pac.runtime_work_objects work
      where work.work_kind = stored.work_kind
        and work.object_id = stored.object_id
    ) then
      raise exception 'Legacy idempotency receipt references a missing work object' using errcode = '22023';
    end if;
  end loop;
end;
$$;

drop trigger if exists runtime_idempotency_receipt_contract on pac.runtime_idempotency;
create trigger runtime_idempotency_receipt_contract
before insert on pac.runtime_idempotency
for each row execute function pac.enforce_runtime_idempotency_receipt_contract();

drop trigger if exists runtime_idempotency_reference_contract on pac.runtime_idempotency;
create constraint trigger runtime_idempotency_reference_contract
after insert on pac.runtime_idempotency
deferrable initially deferred
for each row execute function pac.enforce_runtime_idempotency_reference_contract();

-- Durable counters are reserved for opaque consultation reference-number
-- allocation. A semantic free-text scope would otherwise create an unbounded,
-- non-JSON profile carrier outside the DEC-014 scanner.
alter table pac.runtime_counters
  drop constraint if exists runtime_counters_registered_scope;
alter table pac.runtime_counters
  add constraint runtime_counters_registered_scope
  check (scope ~ '^cr:[0-9]{8}$') not valid;
alter table pac.runtime_counters
  validate constraint runtime_counters_registered_scope;

-- Rate-limit rows retain only one of four registered purposes and an opaque
-- HMAC. Revalidate legacy rows before trusting the upgraded database.
alter table pac.runtime_rate_limits
  drop constraint if exists runtime_rate_limits_registered_identity;
alter table pac.runtime_rate_limits
  add constraint runtime_rate_limits_registered_identity
  check (
    scope in ('staff-ask', 'owner-login', 'consultation-intake', 'consultation-tracking')
    and subject_hash ~ '^[a-f0-9]{64}$'
  ) not valid;
alter table pac.runtime_rate_limits
  validate constraint runtime_rate_limits_registered_identity;

create or replace function pac.assert_runtime_rate_limit_request(
  requested_scope text,
  requested_subject_hash text,
  requested_limit integer,
  requested_window_seconds integer
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  if requested_subject_hash !~ '^[a-f0-9]{64}$'
    or not (
      (requested_scope = 'staff-ask' and requested_limit = 30 and requested_window_seconds = 600)
      or (requested_scope = 'owner-login' and requested_limit = 10 and requested_window_seconds = 900)
      or (requested_scope = 'consultation-intake' and requested_limit = 20 and requested_window_seconds = 3600)
      or (requested_scope = 'consultation-tracking' and requested_limit = 20 and requested_window_seconds = 600)
    ) then
    raise exception 'Invalid rate-limit request' using errcode = '22023';
  end if;
end;
$$;

-- Replace the security-definer entry point as part of the upgrade too; an
-- already-deployed 0009 may still contain the former generic scope grammar.
create or replace function pac.consume_runtime_rate_limit(
  requested_scope text,
  requested_subject_hash text,
  requested_limit integer,
  requested_window_seconds integer
)
returns table (allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_count integer;
  current_reset timestamptz;
begin
  perform pac.assert_runtime_rate_limit_request(
    requested_scope,
    requested_subject_hash,
    requested_limit,
    requested_window_seconds
  );

  insert into pac.runtime_rate_limits (scope, subject_hash, request_count, reset_at)
  values (
    requested_scope,
    requested_subject_hash,
    1,
    clock_timestamp() + make_interval(secs => requested_window_seconds)
  )
  on conflict (scope, subject_hash) do update
  set request_count = case
        when pac.runtime_rate_limits.reset_at <= clock_timestamp() then 1
        else pac.runtime_rate_limits.request_count + 1
      end,
      reset_at = case
        when pac.runtime_rate_limits.reset_at <= clock_timestamp()
          then clock_timestamp() + make_interval(secs => requested_window_seconds)
        else pac.runtime_rate_limits.reset_at
      end,
      updated_at = clock_timestamp()
  returning request_count, pac.runtime_rate_limits.reset_at
  into current_count, current_reset;

  allowed := current_count <= requested_limit;
  remaining := greatest(0, requested_limit - current_count);
  reset_at := current_reset;
  return next;
end;
$$;

revoke all privileges on function pac.assert_runtime_rate_limit_request(text, text, integer, integer) from public, pac_app_runtime;
revoke all privileges on function pac.consume_runtime_rate_limit(text, text, integer, integer) from public;
grant execute on function pac.consume_runtime_rate_limit(text, text, integer, integer) to pac_app_runtime;

create or replace function pac.assert_runtime_audit_event_contract(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_no_prohibited_profile_fields(payload);
  perform pac.assert_allowed_jsonb_keys(payload, array[
    'trace_id', 'span_id', 'at', 'agent_id', 'agent_version', 'tool_name',
    'autonomy_level_used', 'permission_mode', 'dry_run', 'content_ids_touched',
    'allowlist_hit', 'allowlist_miss_reason', 'safety_refusal_code',
    'human_disposition', 'model_id', 'latency_ms', 'ok', 'error_code'
  ]);
  if not (payload ?& array[
    'trace_id', 'span_id', 'at', 'agent_id', 'agent_version', 'tool_name',
    'autonomy_level_used', 'permission_mode', 'dry_run', 'content_ids_touched',
    'allowlist_hit', 'ok'
  ]) then
    raise exception 'Invalid runtime audit-event persistence contract' using errcode = '22023';
  end if;
  perform pac.assert_jsonb_scalar_types(
    payload,
    array[
      'trace_id', 'span_id', 'at', 'agent_id', 'agent_version', 'tool_name',
      'autonomy_level_used', 'permission_mode', 'allowlist_miss_reason',
      'safety_refusal_code', 'model_id', 'error_code'
    ],
    array['dry_run', 'allowlist_hit', 'ok'],
    array['latency_ms']
  );
  if payload ->> 'trace_id' !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or payload ->> 'span_id' !~ '^[0-9a-f]{8}$'
    or not pac.jsonb_is_canonical_utc_instant(payload -> 'at')
    or payload ->> 'agent_id' not in (
      'program_orchestrator', 'ask_concierge', 'ci_guide', 'librarian',
      'a11y_reviewer', 'consult_intake', 'graduation_coach', 'embed_advisor',
      'content_sentinel', 'eval_steward', 'system'
    )
    or payload ->> 'agent_version' not in ('0.1.0', 'collaboration-owner-v1')
    or not (payload ->> 'tool_name' = any(array[
      'corpus.search', 'corpus.semantic_retrieve', 'authority.label_resolve',
      'community.brief_get', 'community.brief_list', 'citation.attach',
      'gap.report_draft', 'research.web_search', 'research.current_answer',
      'research.deep_search', 'answer.structured_draft', 'checklist.draft',
      'agenda.consult_prep_draft', 'intake.summary_pack', 'work_object.draft',
      'conflict.surface', 'resource.classify_draft', 'resource.tag_L1_L4',
      'resource.stale_detect', 'resource.stale_flag_state', 'resource.page_draft',
      'resource.retire_recommend', 'a11y.scan_draft', 'a11y.alt_text_suggest',
      'plain.reading_level_check', 'a11y.keyboard_checklist', 'a11y.no_icons_lint',
      'intake.form_assist', 'intake.requester_track', 'intake.requester_correct',
      'intake.requester_withdraw', 'intake.requester_rotate_key',
      'queue.rank_suggest', 'queue.status_get',
      'queue.status_set', 'queue.auto_triage', 'calendar.handoff_prep',
      'calendar.schedule_reversible', 'escalate.route', 'learn.path_recommend',
      'progress.local_get', 'progress.local_write', 'graduation.next_practice',
      'completion.aggregate_safe', 'embed.question_bank',
      'embed.journey_burden_prompts', 'embed.equity_impact_qs',
      'embed.stakeholder_map_draft', 'memory.decision_read',
      'memory.decision_write', 'memory.version_read', 'memory.eval_results_read',
      'memory.eval_results_write', 'memory.rejected_rec_log',
      'orchestrator.run_cycle', 'proposal.write', 'proposal.decide',
      'eval.run_cases', 'eval.compare_models', 'registry.model_list',
      'registry.agent_toggle', 'flags.set', 'policy.stop_all',
      'safety.pii_detect', 'safety.surveillance_refuse', 'safety.persona_refuse',
      'safety.publish_refuse', 'safety.tribal_gate', 'safety.privacy_notice',
      'runtime.unknown_tool_refusal',
      'collaboration.update_workspace_summary', 'collaboration.update_channel',
      'collaboration.create_thread', 'collaboration.reply',
      'collaboration.edit_post', 'collaboration.update_meeting',
      'collaboration.update_action', 'collaboration.submit_feedback'
    ]))
    or payload ->> 'autonomy_level_used' not in ('A0', 'A1', 'A2', 'A3', 'A4', 'A5')
    or payload ->> 'permission_mode' not in ('always', 'with_preview', 'human_approve', 'owner_only')
    or jsonb_typeof(payload -> 'content_ids_touched') <> 'array'
    or (payload ? 'allowlist_miss_reason' and not (
      payload ->> 'allowlist_miss_reason' = any(array[
        'tool not registered', 'tool disabled by flag or phase',
        'tool not in agent allowlist',
        'paused by the Equity and Inclusion Operations Consultant',
        'agent disabled by owner policy', 'agent disabled in its definition',
        'owner-only tool'
      ])
      or payload ->> 'allowlist_miss_reason' ~ '^tool requires A[0-5]; effective ceiling A[0-5]$'
    ))
    or (payload -> 'allowlist_hit' = 'true'::jsonb and payload ? 'allowlist_miss_reason')
    or (payload ? 'safety_refusal_code' and payload ->> 'safety_refusal_code' not in (
      'pii_detected', 'hr_complaint_redirect', 'surveillance_refused',
      'persona_refused', 'publish_refused', 'tribal_gate', 'legal_invention_refused'
    ))
    or (payload ? 'human_disposition' and jsonb_typeof(payload -> 'human_disposition') not in ('null', 'string'))
    or (payload ? 'human_disposition' and jsonb_typeof(payload -> 'human_disposition') = 'string'
      and payload ->> 'human_disposition' not in ('approve', 'edit', 'reject', 'regenerate'))
    or (payload ? 'model_id' and (
      length(payload ->> 'model_id') > 80
      or payload ->> 'model_id' !~ '^[A-Za-z0-9][A-Za-z0-9._-]*(/[A-Za-z0-9][A-Za-z0-9._-]*)*$'
    ))
    or (payload ? 'latency_ms' and (payload ->> 'latency_ms')::numeric < 0)
    or (payload ? 'error_code' and payload ->> 'error_code' not in (
      'tool_unknown', 'tool_disabled', 'allowlist_miss', 'kill_switch',
      'agent_disabled', 'autonomy_ceiling', 'owner_only', 'tool_execution_failed'
    )) then
    raise exception 'Invalid runtime audit-event persistence contract' using errcode = '22023';
  end if;
  perform pac.assert_jsonb_string_array(payload -> 'content_ids_touched');
  if jsonb_array_length(payload -> 'content_ids_touched') > 100
    or (select count(*) from jsonb_array_elements_text(payload -> 'content_ids_touched'))
      <> (select count(distinct content_id) from jsonb_array_elements_text(payload -> 'content_ids_touched') content_id)
    or exists (
      select 1 from jsonb_array_elements_text(payload -> 'content_ids_touched') content_id
      where content_id !~ '^(CR-[0-9]{8}-[0-9]{4,10}|one_dsd_team|(pn|ja|lm|ext|asset)-[a-z0-9][a-z0-9-]{0,119}|somali|hmong|karen|oromo|african-american|latino|vietnamese|khmer|lao|russian-speaking|arabic-speaking|deaf-deafblind-hard-of-hearing|rural|tribal-nations|cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(-[pg][1-9][0-9]*)?)$'
        or content_id ~* '(employee|worker|personnel)[-_]?[0-9]{1,12}.*(belief|ideolog|equity|readiness|bias|inclusion|participation|engagement)|(belief|ideolog|equity|readiness|bias|inclusion|participation|engagement).*(employee|worker|personnel)[-_]?[0-9]{1,12}'
    ) then
    raise exception 'Invalid runtime audit content identifier' using errcode = '22023';
  end if;
end;
$$;

create or replace function pac.enforce_runtime_audit_event_contract()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_runtime_audit_event_contract(new.event);
  if new.occurred_at is distinct from (new.event ->> 'at')::timestamptz then
    raise exception 'Audit timestamp does not match the canonical event instant' using errcode = '22023';
  end if;
  return new;
end;
$$;

-- Apply the same fail-closed upgrade rule to audit rows written before this
-- contract existed. Operators must explicitly remove or quarantine rejected
-- legacy data before retrying the migration.
do $$
declare
  stored record;
begin
  for stored in
    select event, occurred_at
    from pac.runtime_audit_events
  loop
    perform pac.assert_runtime_audit_event_contract(stored.event);
    if stored.occurred_at is distinct from (stored.event ->> 'at')::timestamptz then
      raise exception 'Legacy audit timestamp does not match the canonical event instant' using errcode = '22023';
    end if;
  end loop;
end;
$$;

drop trigger if exists runtime_audit_event_contract on pac.runtime_audit_events;
create trigger runtime_audit_event_contract
before insert on pac.runtime_audit_events
for each row execute function pac.enforce_runtime_audit_event_contract();

revoke all privileges on function pac.assert_no_prohibited_profile_fields(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_allowed_jsonb_keys(jsonb, text[]) from public, pac_app_runtime;
revoke all privileges on function pac.assert_no_collaboration_surveillance_text(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_jsonb_string_array(jsonb, text[]) from public, pac_app_runtime;
revoke all privileges on function pac.assert_jsonb_scalar_types(jsonb, text[], text[], text[]) from public, pac_app_runtime;
revoke all privileges on function pac.jsonb_is_safe_integer(jsonb, numeric) from public, pac_app_runtime;
revoke all privileges on function pac.jsonb_is_instant(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.jsonb_is_canonical_utc_instant(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_agent_override_contract(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_flag_override_contract(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_policy_patch_contract(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_proposal_contract(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_consultation_owner_text_safe(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.assert_runtime_work_object_contract(text, text, jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.enforce_runtime_work_object_contract() from public, pac_app_runtime;
revoke all privileges on function pac.assert_runtime_idempotency_receipt_contract(text, text, text, jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.enforce_runtime_idempotency_receipt_contract() from public, pac_app_runtime;
revoke all privileges on function pac.enforce_runtime_idempotency_reference_contract() from public, pac_app_runtime;
revoke all privileges on function pac.assert_runtime_audit_event_contract(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.enforce_runtime_audit_event_contract() from public, pac_app_runtime;

comment on function pac.assert_runtime_work_object_contract(text, text, jsonb) is
  'Purpose-limits generic runtime storage to registered consultation, decision, evaluation, and collaboration object families.';

commit;
