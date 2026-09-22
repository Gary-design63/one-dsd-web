-- Qualify the course payload independently of JSON iterator value columns.
begin;
create or replace function pac.assert_course_schema(value jsonb, contract jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
declare payload alias for $1; expected text; entry record; candidate jsonb; matched integer:=0; number_value numeric;
begin
  if payload is null then raise exception 'A course payload is missing' using errcode='22023'; end if;
  if contract ? 'oneOf' then
    for candidate in select jsonb_array_elements(contract->'oneOf') loop
      begin perform pac.assert_course_schema(payload,candidate); matched:=matched+1;
      exception when sqlstate '22023' then null; end;
    end loop;
    if matched<>1 then raise exception 'Course interaction does not match its registered type' using errcode='22023';end if;
    return;
  end if;
  expected:=contract->>'type';
  if expected='integer' then
    if jsonb_typeof(payload)<>'number' or (payload#>>'{}')::numeric<>trunc((payload#>>'{}')::numeric) then raise exception 'Course integer required' using errcode='22023';end if;
  elsif expected is not null and jsonb_typeof(payload)<>expected then raise exception 'Course payload type does not match' using errcode='22023';end if;
  if contract ? 'const' and payload<>contract->'const' then raise exception 'Course fixed payload does not match' using errcode='22023';end if;
  if contract ? 'enum' and not exists(select 1 from jsonb_array_elements(contract->'enum') item where item=payload) then raise exception 'Course payload is not registered' using errcode='22023';end if;
  if expected='object' then
    if exists(select 1 from jsonb_array_elements_text(coalesce(contract->'required','[]')) key where not payload ? key) then raise exception 'Required course field is missing' using errcode='22023';end if;
    for entry in select * from jsonb_each(payload) loop
      if coalesce(contract->'properties','{}') ? entry.key then perform pac.assert_course_schema(entry.value,contract->'properties'->entry.key);
      elsif contract->'additionalProperties'='false'::jsonb then raise exception 'Course field is not registered' using errcode='22023';end if;
      if entry.key in ('href','src','coverImage','introAudio') and jsonb_typeof(entry.value)='string' and entry.value#>>'{}' not in ('','#') then
        perform pac.assert_safe_page_link(entry.value#>>'{}');
      end if;
    end loop;
  elsif expected='array' then
    if jsonb_array_length(payload)<coalesce((contract->>'minItems')::integer,0) or jsonb_array_length(payload)>coalesce((contract->>'maxItems')::integer,500) then raise exception 'Course list length does not match' using errcode='22023';end if;
    if contract ? 'items' then for candidate in select jsonb_array_elements(payload) loop perform pac.assert_course_schema(candidate,contract->'items');end loop;end if;
  elsif expected='string' then
    if length(payload#>>'{}')>coalesce((contract->>'maxLength')::integer,100000) then raise exception 'Course text is too long' using errcode='22023';end if;
    if contract ? 'pattern' and (payload#>>'{}')!~(contract->>'pattern') then raise exception 'Course identifier is not valid' using errcode='22023';end if;
  elsif expected in ('number','integer') then
    number_value:=(payload#>>'{}')::numeric;
    if (contract ? 'minimum' and number_value<(contract->>'minimum')::numeric) or (contract ? 'maximum' and number_value>(contract->>'maximum')::numeric) or (contract ? 'exclusiveMinimum' and number_value<=(contract->>'exclusiveMinimum')::numeric) then raise exception 'Course number is out of range' using errcode='22023';end if;
  end if;
end;$$;
commit;
