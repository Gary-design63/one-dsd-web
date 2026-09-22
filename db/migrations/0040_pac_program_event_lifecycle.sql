begin;

-- Add an explicitly bounded, deterministic published-resource review task.
alter function pac.assert_runtime_work_object_contract(text,text,jsonb) rename to assert_runtime_work_object_contract_pre_program_cas_v1;
create function pac.assert_runtime_work_object_contract(requested_kind text, requested_object_id text, payload jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
begin
  if requested_kind='decision' and requested_object_id like 'program_task:%' and payload->>'kind'='resource_review' then
    perform pac.assert_runtime_work_object_contract_pre_program_cas_v1(requested_kind,requested_object_id,jsonb_set(payload,'{kind}','"source_review"'::jsonb));
  else
    perform pac.assert_runtime_work_object_contract_pre_program_cas_v1(requested_kind,requested_object_id,payload);
  end if;
end $$;

create function pac.program_event_transition_valid(payload jsonb)
returns boolean language plpgsql volatile security definer set search_path=pg_catalog,pac as $$
declare task jsonb; latest jsonb; execution jsonb; current_status text; current_attempt integer; phase text; actor text; attempted integer;
begin
  perform pac.assert_runtime_work_object_contract('decision','program_event:'||(payload->>'id'),payload);
  select value into task from pac.runtime_work_objects
    where work_kind='decision' and object_id='program_task:'||(payload->>'taskId') for update;
  if task is null then return false; end if;
  select value into latest from pac.runtime_work_objects
    where work_kind='decision' and object_id like 'program_event:%' and value->>'taskId'=payload->>'taskId'
    order by value->>'at' desc, (value->>'attempt')::integer desc, value->>'id' desc limit 1;
  select value into execution from pac.runtime_work_objects
    where work_kind='decision' and object_id like 'program_event:%' and value->>'taskId'=payload->>'taskId'
      and value->>'phase' in ('started','completed','failed','cancelled','retry_requested')
    order by value->>'at' desc, (value->>'attempt')::integer desc, value->>'id' desc limit 1;
  select coalesce(max((value->>'attempt')::integer),0) into current_attempt from pac.runtime_work_objects
    where work_kind='decision' and object_id like 'program_event:%' and value->>'taskId'=payload->>'taskId';
  if latest is not null and payload->>'at'<=latest->>'at' then return false; end if;
  current_status:=coalesce(execution->>'phase','queued');
  phase:=payload->>'phase';actor:=payload->>'actor';attempted:=(payload->>'attempt')::integer;
  if payload ? 'receipt' and payload->'receipt'->>'contentHash' is distinct from encode(sha256(convert_to(payload->'receipt'->>'body','UTF8')),'hex') then return false; end if;
  if phase='started' then
    return actor='agent' and attempted=current_attempt+1 and (
      current_status in ('queued','retry_requested') or (current_status='failed' and current_attempt<3) or
      (current_status='started' and (payload->>'at')::timestamptz-(execution->>'at')::timestamptz>=interval '10 minutes'));
  end if;
  if phase in ('completed','failed') then
    return actor='agent' and current_status='started' and attempted=current_attempt and
      (phase<>'completed' or payload->'receipt'->>'evidenceLevel'='delivery');
  end if;
  if actor<>'owner' or attempted<>current_attempt or payload ? 'receipt' then return false; end if;
  if phase='cancelled' then return current_status<>'cancelled'; end if;
  if phase='retry_requested' then return current_status in ('failed','cancelled','completed'); end if;
  return phase in ('applied','reviewed') and current_status='completed' and execution ? 'receipt';
end $$;

create function pac.enforce_program_event_insert()
returns trigger language plpgsql security definer set search_path=pg_catalog,pac as $$
begin
  if new.work_kind='decision' and new.object_id like 'program_event:%' then
    if pac.program_event_transition_valid(new.value) is distinct from true then
      raise exception 'Invalid program event transition' using errcode='22023';
    end if;
  end if;
  return new;
end $$;
create trigger program_event_lifecycle before insert on pac.runtime_work_objects
for each row execute function pac.enforce_program_event_insert();

create function pac.append_program_event(requested_task_id text, expected_event_id text, payload jsonb)
returns table(applied boolean, reason text, event_value jsonb)
language plpgsql volatile security definer set search_path=pg_catalog,pac as $$
declare task jsonb; prior jsonb; latest jsonb;
begin
  perform pac.assert_runtime_work_object_contract('decision','program_event:'||(payload->>'id'),payload);
  if requested_task_id is distinct from payload->>'taskId' then
    return query select false,'invalid_transition'::text,null::jsonb;return;
  end if;
  select value into task from pac.runtime_work_objects
    where work_kind='decision' and object_id='program_task:'||requested_task_id for update;
  if task is null then return query select false,'not_found'::text,null::jsonb;return;end if;
  select value into prior from pac.runtime_work_objects where work_kind='decision' and object_id='program_event:'||(payload->>'id');
  if prior is not null then
    if prior=payload then return query select true,'replayed'::text,prior;
    else return query select false,'conflict'::text,prior;end if;
    return;
  end if;
  select value into latest from pac.runtime_work_objects
    where work_kind='decision' and object_id like 'program_event:%' and value->>'taskId'=requested_task_id
    order by value->>'at' desc, (value->>'attempt')::integer desc, value->>'id' desc limit 1;
  if (latest->>'id') is distinct from expected_event_id then return query select false,'conflict'::text,latest;return;end if;
  if pac.program_event_transition_valid(payload) is distinct from true then
    return query select false,'invalid_transition'::text,latest;return;
  end if;
  insert into pac.runtime_work_objects(work_kind,object_id,value) values('decision','program_event:'||(payload->>'id'),payload);
  return query select true,'applied'::text,payload;
end $$;

revoke all on function pac.assert_runtime_work_object_contract(text,text,jsonb) from public,pac_app_runtime;
revoke all on function pac.program_event_transition_valid(jsonb) from public,pac_app_runtime;
revoke all on function pac.enforce_program_event_insert() from public,pac_app_runtime;
revoke all on function pac.append_program_event(text,text,jsonb) from public;
grant execute on function pac.append_program_event(text,text,jsonb) to pac_app_runtime;
commit;
