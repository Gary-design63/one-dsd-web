begin;

-- Extend registered decision families while preserving all earlier contracts.
alter function pac.assert_runtime_work_object_contract(text,text,jsonb) rename to assert_runtime_work_object_contract_pre_program_v1;
alter function pac.assert_runtime_idempotency_receipt_contract(text,text,text,jsonb) rename to assert_runtime_idempotency_receipt_contract_pre_program_v1;
alter function pac.assert_runtime_rate_limit_request(text,text,integer,integer) rename to assert_runtime_rate_limit_request_pre_program_v1;

create function pac.assert_program_string(payload jsonb, field_name text, minimum_length integer, maximum_length integer, required boolean default true)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  if not (payload ? field_name) and not required then return; end if;
  if jsonb_typeof(payload->field_name) is distinct from 'string'
    or length(payload->>field_name) not between minimum_length and maximum_length then
    raise exception 'Invalid program string field: %', field_name using errcode='22023';
  end if;
end $$;

create function pac.assert_program_instant(payload jsonb, field_name text, required boolean default true)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  if not (payload ? field_name) and not required then return; end if;
  if pac.jsonb_is_instant(payload->field_name) is distinct from true
    or (payload->>field_name) !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?Z$' then
    raise exception 'Invalid program timestamp' using errcode='22023';
  end if;
end $$;

create function pac.assert_program_receipt(payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
declare reference jsonb;
begin
  perform pac.assert_allowed_jsonb_keys(payload,array['title','body','evidenceLevel','method','references','contentHash']);
  if not (payload ?& array['title','body','evidenceLevel','method','references','contentHash']) then raise exception 'Incomplete program receipt' using errcode='22023'; end if;
  perform pac.assert_program_string(payload,'title',1,180);
  perform pac.assert_program_string(payload,'body',20,18000);
  perform pac.assert_program_string(payload,'evidenceLevel',1,30);
  perform pac.assert_program_string(payload,'method',1,40);
  perform pac.assert_program_string(payload,'contentHash',64,64);
  if payload->>'evidenceLevel' not in ('delivery','application','benefit')
    or payload->>'method' not in ('generated_artifact','program_record_review','source_check','owner_report')
    or payload->>'contentHash' !~ '^[a-f0-9]{64}$'
    or jsonb_typeof(payload->'references') is distinct from 'array' then raise exception 'Invalid program receipt' using errcode='22023'; end if;
  if jsonb_array_length(payload->'references') > 20 then raise exception 'Too many program references' using errcode='22023'; end if;
  for reference in select value from jsonb_array_elements(payload->'references') loop
    perform pac.assert_allowed_jsonb_keys(reference,array['label','href']);
    perform pac.assert_program_string(reference,'label',0,240);
    perform pac.assert_program_string(reference,'href',1,1500);
    if reference->>'href' !~ '^(/[^/]|/$|https://)' then raise exception 'Invalid program reference route' using errcode='22023'; end if;
  end loop;
end $$;

create function pac.assert_runtime_work_object_contract(requested_kind text, requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
declare field_name text; item jsonb;
begin
  perform pac.assert_no_prohibited_profile_fields(payload);
  if requested_kind is distinct from 'decision' or requested_object_id !~ '^program_(task|event|outcome):' then
    perform pac.assert_runtime_work_object_contract_pre_program_v1(requested_kind,requested_object_id,payload); return;
  end if;
  if payload is null or jsonb_typeof(payload) <> 'object' or requested_object_id is null or length(requested_object_id)>180 then raise exception 'Invalid program work object' using errcode='22023'; end if;
  if requested_object_id like 'program_task:%' then
    perform pac.assert_allowed_jsonb_keys(payload,array['recordType','id','createdAt','functionId','outcomeIds','kind','title','objective','agentId','sourceId','dueAt','eligible','exclusionReason','source','evidenceMode']);
    if not (payload ?& array['recordType','id','createdAt','functionId','outcomeIds','kind','title','objective','agentId','dueAt','eligible','source','evidenceMode']) then raise exception 'Incomplete program task' using errcode='22023'; end if;
    perform pac.assert_jsonb_scalar_types(payload,array['recordType','id','functionId','kind','agentId','source','evidenceMode'],array['eligible'],array[]::text[]);
    if payload->>'recordType' is distinct from 'program_task' or payload->>'id' !~ '^task-[a-f0-9]{32}$' or requested_object_id is distinct from 'program_task:'||(payload->>'id')
      or payload->>'kind' not in ('work_preparation','cadence_review','outcome_followup','source_review')
      or payload->>'agentId' not in ('program_orchestrator','ask_concierge','ci_guide','librarian','a11y_reviewer','consult_intake','graduation_coach','embed_advisor','content_sentinel','eval_steward')
      or payload->>'source' not in ('owner','cadence','staff_result','program_maintenance')
      or payload->>'evidenceMode' not in ('operational','verification')
      or (payload->>'eligible'='false' and coalesce(payload->>'exclusionReason','')='') then raise exception 'Invalid program task' using errcode='22023'; end if;
    perform pac.assert_program_string(payload,'functionId',1,60);
    perform pac.assert_program_string(payload,'title',5,180);
    perform pac.assert_program_string(payload,'objective',10,3000);
    perform pac.assert_program_string(payload,'sourceId',0,180,false);
    perform pac.assert_program_string(payload,'exclusionReason',0,300,false);
    perform pac.assert_program_instant(payload,'createdAt');
    perform pac.assert_program_instant(payload,'dueAt');
    perform pac.assert_jsonb_string_array(payload->'outcomeIds');
    if jsonb_array_length(payload->'outcomeIds')>7 then raise exception 'Too many program outcomes' using errcode='22023'; end if;
    for item in select value from jsonb_array_elements(payload->'outcomeIds') loop
      if length(item#>>'{}')>60 then raise exception 'Invalid program outcome identifier' using errcode='22023'; end if;
    end loop;
    return;
  end if;  if requested_object_id like 'program_event:%' then
    perform pac.assert_allowed_jsonb_keys(payload,array['recordType','id','taskId','at','phase','attempt','actor','note','receipt','disposition','followUpAt','humanMinutes']);
    if not (payload ?& array['recordType','id','taskId','at','phase','attempt','actor','note']) then raise exception 'Incomplete program event' using errcode='22023'; end if;
    perform pac.assert_jsonb_scalar_types(payload,array['recordType','id','taskId','phase','actor','disposition'],array[]::text[],array['attempt','humanMinutes']);
    if payload->>'recordType' is distinct from 'program_event'
      or payload->>'id' !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'
      or requested_object_id is distinct from 'program_event:'||(payload->>'id')
      or payload->>'taskId' !~ '^task-[a-f0-9]{32}$'
      or payload->>'phase' not in ('started','completed','failed','applied','reviewed','cancelled','retry_requested')
      or payload->>'actor' not in ('agent','owner')
      or pac.jsonb_is_safe_integer(payload->'attempt',0) is distinct from true
      or (payload->>'attempt')::numeric>10000
      or (payload->>'phase'='completed' and not (payload ? 'receipt'))
      or (payload->>'phase' in ('applied','reviewed','cancelled','retry_requested') and payload->>'actor'<>'owner')
      or (payload ? 'disposition' and payload->>'disposition' not in ('retain','revise','stop','not_yet_known'))
      or (payload ? 'humanMinutes' and (payload->>'humanMinutes')::numeric not between 0 and 100000) then raise exception 'Invalid program event' using errcode='22023'; end if;
    perform pac.assert_program_string(payload,'note',0,3000);
    perform pac.assert_program_instant(payload,'at');
    perform pac.assert_program_instant(payload,'followUpAt',false);
    if payload ? 'receipt' then perform pac.assert_program_receipt(payload->'receipt'); end if;
    return;
  end if;
  if requested_object_id like 'program_outcome:%' then
    perform pac.assert_allowed_jsonb_keys(payload,array['schemaVersion','id','createdAt','evidenceStatus','programScope','problem','action','adoptedChange','observedResult','evidenceUrl','followUp','reviewDate','decision','consent','sourceRoute','outcomeId']);
    if not (payload ?& array['schemaVersion','id','createdAt','evidenceStatus','programScope','problem','action','adoptedChange','observedResult','followUp','decision','consent']) then raise exception 'Incomplete program outcome' using errcode='22023'; end if;
    perform pac.assert_jsonb_scalar_types(payload,array['id','evidenceStatus','programScope','decision','reviewDate','sourceRoute','outcomeId'],array['consent'],array['schemaVersion']);
    if payload->'schemaVersion' is distinct from '1'::jsonb or payload->'consent' is distinct from 'true'::jsonb
      or payload->>'id' !~ '^program-outcome-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or requested_object_id is distinct from 'program_outcome:'||(payload->>'id')
      or payload->>'evidenceStatus' is distinct from 'self_reported'
      or payload->>'programScope' not in ('one-dhs','dsd')
      or payload->>'decision' not in ('retain','revise','stop','not_yet_known')
      or (payload ? 'outcomeId' and payload->>'outcomeId' not in ('staff_capability','capability_transfer','access','workplace_culture','institutional_application','organizational_memory','agency_coherence')) then raise exception 'Invalid program outcome' using errcode='22023'; end if;
    foreach field_name in array array['problem','action','adoptedChange','followUp'] loop
      perform pac.assert_program_string(payload,field_name,1,1500);
      if btrim(payload->>field_name)='' then raise exception 'Blank program outcome' using errcode='22023'; end if;
    end loop;
    perform pac.assert_program_string(payload,'observedResult',1,2000);
    if btrim(payload->>'observedResult')='' then raise exception 'Blank program outcome' using errcode='22023'; end if;
    perform pac.assert_program_instant(payload,'createdAt');
    perform pac.assert_program_string(payload,'evidenceUrl',1,1000,false);
    perform pac.assert_program_string(payload,'sourceRoute',1,200,false);
    if payload ? 'reviewDate' then
      if payload->>'reviewDate' !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' or ((payload->>'reviewDate')::date)::text <> payload->>'reviewDate' then raise exception 'Invalid outcome review date' using errcode='22023'; end if;
    end if;
    if payload ? 'sourceRoute' and payload->>'sourceRoute' !~ '^/(practice|courses|learn|areas|one-dsd|support)(/[a-z0-9-]+)*$' then raise exception 'Invalid outcome source route' using errcode='22023'; end if;
    if payload ? 'evidenceUrl' and (
      payload->>'evidenceUrl' !~ '^https://[^/@?#[:space:]]+(/[^?#[:space:]]*)?$'
      or payload->>'evidenceUrl' ~* '^https://(localhost([:/]|$)|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|\[|[^/]*\.(local|internal)([:/]|$))'
    ) then raise exception 'Invalid public outcome evidence link' using errcode='22023'; end if;
    return;
  end if;
  raise exception 'Unregistered program record' using errcode='22023';
end $$;
create function pac.assert_runtime_idempotency_receipt_contract(requested_idempotency_key text, requested_kind text, requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  if requested_kind is distinct from 'decision' or requested_object_id !~ '^program_(task|event|outcome):' then
    perform pac.assert_runtime_idempotency_receipt_contract_pre_program_v1(requested_idempotency_key,requested_kind,requested_object_id,payload); return;
  end if;
  perform pac.assert_no_prohibited_profile_fields(payload);
  perform pac.assert_allowed_jsonb_keys(payload,array['work_kind','object_id']);
  if not (payload ?& array['work_kind','object_id'])
    or payload->>'work_kind' is distinct from requested_kind or payload->>'object_id' is distinct from requested_object_id
    or jsonb_typeof(payload->'work_kind') is distinct from 'string' or jsonb_typeof(payload->'object_id') is distinct from 'string'
    or requested_idempotency_key is null or not (
      (requested_object_id ~ '^program_task:task-[a-f0-9]{32}$' and requested_idempotency_key ~ '^program-task:[a-f0-9]{64}$')
      or (requested_object_id ~ '^program_event:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$' and requested_idempotency_key ~ '^program-event:[a-f0-9]{64}$')
      or (requested_object_id ~ '^program_outcome:program-outcome-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        and requested_idempotency_key = 'program-outcome:'||substring(requested_object_id from length('program_outcome:program-outcome-')+1))
    ) then raise exception 'Invalid program idempotency contract' using errcode='22023'; end if;
end $$;

create function pac.assert_runtime_rate_limit_request(requested_scope text, requested_subject_hash text, requested_limit integer, requested_window_seconds integer)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  if requested_scope is distinct from 'staff-program-outcome' then
    perform pac.assert_runtime_rate_limit_request_pre_program_v1(requested_scope,requested_subject_hash,requested_limit,requested_window_seconds); return;
  end if;
  if requested_subject_hash is null or requested_subject_hash !~ '^[a-f0-9]{64}$'
    or requested_limit is distinct from 10 or requested_window_seconds is distinct from 600 then
    raise exception 'Invalid program outcome rate limit' using errcode='22023';
  end if;
end $$;
alter table pac.runtime_rate_limits drop constraint runtime_rate_limits_registered_identity;
alter table pac.runtime_rate_limits add constraint runtime_rate_limits_registered_identity check (
  scope in ('staff-ask','owner-login','consultation-intake','consultation-tracking','staff-program-outcome')
  and subject_hash ~ '^[a-f0-9]{64}$'
);

-- Validate the new tool using the unchanged audit envelope rules; the stored
-- event retains its actual program.work_execute name, never the comparison name.
alter function pac.assert_runtime_audit_event_contract(jsonb) rename to assert_runtime_audit_event_contract_pre_program_v1;
create function pac.assert_runtime_audit_event_contract(payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  perform pac.assert_no_prohibited_profile_fields(payload);
  if payload->>'tool_name'='program.work_execute' and jsonb_typeof(payload->'tool_name')='string' then
    perform pac.assert_runtime_audit_event_contract_pre_program_v1(jsonb_set(payload,'{tool_name}','"orchestrator.run_cycle"'::jsonb));
  else
    perform pac.assert_runtime_audit_event_contract_pre_program_v1(payload);
  end if;
end $$;

create function pac.prevent_program_record_rewrite()
returns trigger language plpgsql set search_path=pg_catalog,pac as $$
begin
  if (old.work_kind='decision' and old.object_id ~ '^program_(task|event|outcome):')
    or (new.work_kind='decision' and new.object_id ~ '^program_(task|event|outcome):') then
    if old.work_kind is distinct from new.work_kind or old.object_id is distinct from new.object_id
      or old.value is distinct from new.value or old.created_at is distinct from new.created_at then
      raise exception 'Program records are immutable; append a new event' using errcode='22023';
    end if;
  end if;
  return new;
end $$;
create trigger immutable_program_record before update on pac.runtime_work_objects
for each row execute function pac.prevent_program_record_rewrite();

revoke all on function pac.assert_program_string(jsonb,text,integer,integer,boolean) from public,pac_app_runtime;
revoke all on function pac.assert_program_instant(jsonb,text,boolean) from public,pac_app_runtime;
revoke all on function pac.assert_program_receipt(jsonb) from public,pac_app_runtime;
revoke all on function pac.assert_runtime_work_object_contract(text,text,jsonb) from public,pac_app_runtime;
revoke all on function pac.assert_runtime_idempotency_receipt_contract(text,text,text,jsonb) from public,pac_app_runtime;
revoke all on function pac.assert_runtime_rate_limit_request(text,text,integer,integer) from public,pac_app_runtime;
revoke all on function pac.assert_runtime_audit_event_contract(jsonb) from public,pac_app_runtime;
revoke all on function pac.prevent_program_record_rewrite() from public,pac_app_runtime;

commit;