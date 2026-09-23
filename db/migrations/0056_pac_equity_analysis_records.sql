begin;

-- Equity Analysis Toolkit records: analyses filed through the guided walkthrough,
-- follow-up completion events, and culture survey wave events. All three are
-- append-only decision families; later state is derived from later events, so
-- every change stays visible and reversible. Earlier contracts are preserved by
-- delegation. Roles and dates only: person-profile keys stay prohibited.

alter function pac.assert_runtime_work_object_contract(text,text,jsonb) rename to assert_runtime_work_object_contract_pre_equity_v1;
alter function pac.assert_runtime_idempotency_receipt_contract(text,text,text,jsonb) rename to assert_runtime_idempotency_receipt_contract_pre_equity_v1;
alter function pac.assert_runtime_rate_limit_request(text,text,integer,integer) rename to assert_runtime_rate_limit_request_pre_equity_v1;

create function pac.assert_equity_calendar_date(payload jsonb, field_name text, required boolean default true)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  if not (payload ? field_name) then
    if required then raise exception 'Missing equity date field: %', field_name using errcode='22023'; end if;
    return;
  end if;
  if jsonb_typeof(payload->field_name) is distinct from 'string'
    or payload->>field_name !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    or ((payload->>field_name)::date)::text <> payload->>field_name then
    raise exception 'Invalid equity date field: %', field_name using errcode='22023';
  end if;
end $$;

create function pac.assert_equity_analysis_record(requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
declare answers jsonb; answer_key text; answer_value jsonb; required_key text;
begin
  perform pac.assert_allowed_jsonb_keys(payload,array['schemaVersion','recordType','id','createdAt','programScope','kind','workTitle','workType','administration','approvalDate','disposition','answers','consent','sourceRoute']);
  if not (payload ?& array['schemaVersion','recordType','id','createdAt','programScope','kind','workTitle','workType','administration','disposition','answers','consent','sourceRoute']) then
    raise exception 'Incomplete equity analysis' using errcode='22023';
  end if;
  perform pac.assert_jsonb_scalar_types(payload,array['recordType','id','createdAt','programScope','kind','workTitle','workType','administration','approvalDate','disposition','sourceRoute'],array['consent'],array['schemaVersion']);
  if payload->'schemaVersion' is distinct from '1'::jsonb or payload->'consent' is distinct from 'true'::jsonb
    or payload->>'recordType' is distinct from 'equity_analysis'
    or payload->>'id' !~ '^equity-analysis-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or requested_object_id is distinct from 'equity_analysis:'||(payload->>'id')
    or payload->>'programScope' not in ('one-dhs','dsd')
    or payload->>'kind' not in ('full','scan')
    or payload->>'workType' not in ('policy','budget','hiring','it','contract','service','engagement','other')
    or payload->>'administration' not in ('Aging and Disability Services','Behavioral Health','Community Supports','Health Care','Operations','Central Office')
    or payload->>'disposition' not in ('approve','revise','pause','pilot','reject','escalate')
    or payload->>'sourceRoute' is distinct from '/equity-policy/analysis' then
    raise exception 'Invalid equity analysis' using errcode='22023';
  end if;
  perform pac.assert_program_string(payload,'workTitle',1,200);
  if btrim(payload->>'workTitle')='' then raise exception 'Blank equity analysis title' using errcode='22023'; end if;
  perform pac.assert_program_instant(payload,'createdAt');
  perform pac.assert_equity_calendar_date(payload,'approvalDate',false);

  answers := payload->'answers';
  perform pac.assert_allowed_jsonb_keys(answers,array['action','affected_groups','dhs_areas','data_shows','data_missing','heard_from','still_missing','tribal_consultation','benefits','burdens','design_change','impact_statement','impact_owner','impact_date','outcome_owner','outcome_date','communication','equity_director','policy_alignment','funded','staffed','data_capacity','sustainability_note','rationale']);
  for answer_key, answer_value in select key, value from jsonb_each(answers) loop
    if jsonb_typeof(answer_value) <> 'string' or length(answer_value #>> '{}') not between 1 and 4000 then
      raise exception 'Invalid equity analysis answer: %', answer_key using errcode='22023';
    end if;
  end loop;
  perform pac.assert_equity_calendar_date(answers,'impact_date',false);
  perform pac.assert_equity_calendar_date(answers,'outcome_date',false);
  if answers ? 'tribal_consultation' and answers->>'tribal_consultation' not in ('not_applicable','requested','completed','needed') then raise exception 'Invalid equity analysis answer: tribal_consultation' using errcode='22023'; end if;
  if answers ? 'equity_director' and answers->>'equity_director' not in ('consulted','scheduled','not_yet') then raise exception 'Invalid equity analysis answer: equity_director' using errcode='22023'; end if;
  foreach answer_key in array array['funded','staffed','data_capacity'] loop
    if answers ? answer_key and answers->>answer_key not in ('yes','partial','no') then raise exception 'Invalid equity analysis answer: %', answer_key using errcode='22023'; end if;
  end loop;
  -- Both forms require these; the full analysis also requires its own steps.
  foreach required_key in array array['action','affected_groups','data_shows','benefits','burdens','design_change','impact_owner','impact_date','outcome_owner','outcome_date','communication','rationale'] loop
    if not (answers ? required_key) then raise exception 'Incomplete equity analysis answer: %', required_key using errcode='22023'; end if;
  end loop;
  if payload->>'kind'='full' then
    foreach required_key in array array['heard_from','still_missing','tribal_consultation','impact_statement','equity_director','policy_alignment','funded','staffed','data_capacity'] loop
      if not (answers ? required_key) then raise exception 'Incomplete full equity analysis answer: %', required_key using errcode='22023'; end if;
    end loop;
  end if;
end $$;

create function pac.assert_equity_followup_event(requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  perform pac.assert_allowed_jsonb_keys(payload,array['schemaVersion','recordType','id','createdAt','analysisId','followUp','done','reverts']);
  if not (payload ?& array['schemaVersion','recordType','id','createdAt','analysisId','followUp','done']) then raise exception 'Incomplete equity follow-up event' using errcode='22023'; end if;
  perform pac.assert_jsonb_scalar_types(payload,array['recordType','id','createdAt','analysisId','followUp','reverts'],array['done'],array['schemaVersion']);
  if payload->'schemaVersion' is distinct from '1'::jsonb
    or payload->>'recordType' is distinct from 'equity_analysis_followup'
    or payload->>'id' !~ '^equity-followup-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or requested_object_id is distinct from 'equity_followup:'||(payload->>'id')
    or payload->>'analysisId' !~ '^equity-analysis-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or payload->>'followUp' not in ('approval','impact','outcome')
    or (payload ? 'reverts' and payload->>'reverts' !~ '^equity-followup-[0-9a-f-]{36}$') then
    raise exception 'Invalid equity follow-up event' using errcode='22023';
  end if;
  perform pac.assert_program_instant(payload,'createdAt');
end $$;

create function pac.assert_equity_survey_event(requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
declare v jsonb; pct_key text;
begin
  perform pac.assert_allowed_jsonb_keys(payload,array['schemaVersion','recordType','id','createdAt','wave','action','values','reverts']);
  if not (payload ?& array['schemaVersion','recordType','id','createdAt','wave','action']) then raise exception 'Incomplete equity survey event' using errcode='22023'; end if;
  perform pac.assert_jsonb_scalar_types(payload,array['recordType','id','createdAt','wave','action','reverts'],array[]::text[],array['schemaVersion']);
  if payload->'schemaVersion' is distinct from '1'::jsonb
    or payload->>'recordType' is distinct from 'equity_survey_wave'
    or payload->>'id' !~ '^equity-survey-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or requested_object_id is distinct from 'equity_survey:'||(payload->>'id')
    or payload->>'wave' !~ '^[0-9]{4}([- ][A-Za-z0-9]{1,12})?$'
    or payload->>'action' not in ('set','remove')
    or (payload->>'action'='set') <> (payload ? 'values')
    or (payload ? 'reverts' and payload->>'reverts' !~ '^equity-survey-[0-9a-f-]{36}$') then
    raise exception 'Invalid equity survey event' using errcode='22023';
  end if;
  perform pac.assert_program_instant(payload,'createdAt');
  if payload ? 'values' then
    v := payload->'values';
    perform pac.assert_allowed_jsonb_keys(v,array['fielded','respondents','responseRate','belonging','inclusion','engagement']);
    if not (v ?& array['fielded','respondents','responseRate','belonging','inclusion','engagement']) then raise exception 'Incomplete equity survey values' using errcode='22023'; end if;
    perform pac.assert_jsonb_scalar_types(v,array['fielded'],array[]::text[],array['respondents','responseRate','belonging','inclusion','engagement']);
    if v->>'fielded' !~ '^[0-9]{4}-[0-9]{2}$'
      or pac.jsonb_is_safe_integer(v->'respondents',0) is distinct from true or (v->>'respondents')::numeric > 1000000
      or (v->>'responseRate')::numeric not between 0 and 1 then
      raise exception 'Invalid equity survey values' using errcode='22023';
    end if;
    foreach pct_key in array array['belonging','inclusion','engagement'] loop
      if pac.jsonb_is_safe_integer(v->pct_key,0) is distinct from true or (v->>pct_key)::numeric > 100 then raise exception 'Invalid equity survey percent: %', pct_key using errcode='22023'; end if;
    end loop;
  end if;
end $$;

create function pac.assert_runtime_work_object_contract(requested_kind text, requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  perform pac.assert_no_prohibited_profile_fields(payload);
  if requested_kind is distinct from 'decision' or requested_object_id !~ '^equity_(analysis|followup|survey):' then
    perform pac.assert_runtime_work_object_contract_pre_equity_v1(requested_kind,requested_object_id,payload); return;
  end if;
  if payload is null or jsonb_typeof(payload) <> 'object' or requested_object_id is null or length(requested_object_id)>180 then raise exception 'Invalid equity work object' using errcode='22023'; end if;
  if requested_object_id like 'equity_analysis:%' then perform pac.assert_equity_analysis_record(requested_object_id,payload); return; end if;
  if requested_object_id like 'equity_followup:%' then perform pac.assert_equity_followup_event(requested_object_id,payload); return; end if;
  perform pac.assert_equity_survey_event(requested_object_id,payload);
end $$;

create function pac.assert_runtime_idempotency_receipt_contract(requested_idempotency_key text, requested_kind text, requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
declare family text; suffix text;
begin
  if requested_kind is distinct from 'decision' or requested_object_id !~ '^equity_(analysis|followup|survey):' then
    perform pac.assert_runtime_idempotency_receipt_contract_pre_equity_v1(requested_idempotency_key,requested_kind,requested_object_id,payload); return;
  end if;
  perform pac.assert_no_prohibited_profile_fields(payload);
  perform pac.assert_allowed_jsonb_keys(payload,array['work_kind','object_id']);
  family := split_part(requested_object_id,':',1);           -- equity_analysis | equity_followup | equity_survey
  suffix := substring(requested_object_id from '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$');
  if not (payload ?& array['work_kind','object_id'])
    or payload->>'work_kind' is distinct from requested_kind or payload->>'object_id' is distinct from requested_object_id
    or jsonb_typeof(payload->'work_kind') is distinct from 'string' or jsonb_typeof(payload->'object_id') is distinct from 'string'
    or suffix is null
    or requested_idempotency_key is distinct from replace(family,'_','-')||':'||suffix then
    raise exception 'Invalid equity idempotency contract' using errcode='22023';
  end if;
end $$;

create function pac.assert_runtime_rate_limit_request(requested_scope text, requested_subject_hash text, requested_limit integer, requested_window_seconds integer)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  if requested_scope not in ('staff-equity-analysis','staff-equity-register') then
    perform pac.assert_runtime_rate_limit_request_pre_equity_v1(requested_scope,requested_subject_hash,requested_limit,requested_window_seconds); return;
  end if;
  if requested_subject_hash is null or requested_subject_hash !~ '^[a-f0-9]{64}$'
    or requested_window_seconds is distinct from 600
    or requested_limit is distinct from (case requested_scope when 'staff-equity-analysis' then 10 else 60 end) then
    raise exception 'Invalid equity analysis rate limit' using errcode='22023';
  end if;
end $$;
-- The original column check from 0009 lists only the first four purposes and was
-- never widened when later purposes were registered; the registered_identity
-- constraint below is the single, complete allowlist.
alter table pac.runtime_rate_limits drop constraint if exists runtime_rate_limits_scope_check;
alter table pac.runtime_rate_limits drop constraint runtime_rate_limits_registered_identity;
alter table pac.runtime_rate_limits add constraint runtime_rate_limits_registered_identity check(
  scope in ('staff-ask','owner-login','consultation-intake','consultation-tracking','staff-program-outcome','program-login-network','program-login-account','program-invitation-network','program-invitation-code','staff-equity-analysis','staff-equity-register')
  and subject_hash ~ '^[a-f0-9]{64}$'
);

create function pac.prevent_equity_record_rewrite()
returns trigger language plpgsql set search_path=pg_catalog,pac as $$
begin
  if (old.work_kind='decision' and old.object_id ~ '^equity_(analysis|followup|survey):')
    or (new.work_kind='decision' and new.object_id ~ '^equity_(analysis|followup|survey):') then
    if old.work_kind is distinct from new.work_kind or old.object_id is distinct from new.object_id
      or old.value is distinct from new.value or old.created_at is distinct from new.created_at then
      raise exception 'Equity analysis records are append-only; add a new event' using errcode='22023';
    end if;
  end if;
  return new;
end $$;
create trigger immutable_equity_record before update on pac.runtime_work_objects
for each row execute function pac.prevent_equity_record_rewrite();

revoke all on function pac.assert_equity_calendar_date(jsonb,text,boolean) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.assert_equity_analysis_record(text,jsonb) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.assert_equity_followup_event(text,jsonb) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.assert_equity_survey_event(text,jsonb) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.assert_runtime_work_object_contract(text,text,jsonb) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.assert_runtime_idempotency_receipt_contract(text,text,text,jsonb) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.assert_runtime_rate_limit_request(text,text,integer,integer) from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;
revoke all on function pac.prevent_equity_record_rewrite() from public,pac_app_runtime,pac_contributor_runtime,pac_authentication_broker;

comment on function pac.assert_equity_analysis_record(text,jsonb) is 'Purpose limitation: an equity analysis names work, groups, roles, and dates. It never carries a person''s name, case, or profile.';
comment on function pac.prevent_equity_record_rewrite() is 'Equity analysis records and their follow-up and survey events are append-only so every change stays visible and reversible.';

commit;
