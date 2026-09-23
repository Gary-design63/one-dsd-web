-- Optional ASK-to-Practice drafts. Existing response records and narrow storage functions remain valid.
create function pac.valid_ask_practice_artifact(a jsonb) returns boolean
language plpgsql immutable set search_path=pg_catalog,pac as $$
declare item record; source jsonb; entry jsonb;
begin
  if jsonb_typeof(a) is distinct from 'object'
    or octet_length(a::text)>12000
    or not (a ?& array['schemaVersion','artifactId','revisionId','parentRevisionId','traceId','createdAt','context','pathId','pathContract','title','values','sources'])
    or (a - array['schemaVersion','artifactId','revisionId','parentRevisionId','traceId','createdAt','context','pathId','pathContract','title','values','sources']) <> '{}'::jsonb
    or a->'schemaVersion' <> '1'::jsonb
    or jsonb_typeof(a->'context') <> 'string'
    or jsonb_typeof(a->'pathId') <> 'string'
    or jsonb_typeof(a->'pathContract') <> 'string'
    or a->>'context' not in ('one_dhs','one_dsd')
    or a->>'pathId' !~ '^gp-([1-9]|10|11)$'
    or a->>'pathContract' !~ '^[a-f0-9]{64}$'
    or jsonb_typeof(a->'title') <> 'string' or length(a->>'title') not between 1 and 300
    or jsonb_typeof(a->'values') <> 'object'
    or jsonb_typeof(a->'sources') <> 'array'
  then return false; end if;
  if (select count(*) from jsonb_object_keys(a->'values')) not between 1 and 30 or jsonb_array_length(a->'sources')>10 then return false; end if;
  foreach source in array array[a->'artifactId',a->'revisionId',a->'traceId'] loop
    if jsonb_typeof(source) <> 'string' or (source#>>'{}') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then return false; end if;
  end loop;
  if a->'parentRevisionId' <> 'null'::jsonb and (jsonb_typeof(a->'parentRevisionId') <> 'string' or a->>'parentRevisionId' !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') then return false; end if;
  if jsonb_typeof(a->'createdAt') <> 'string' or a->>'createdAt' !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?Z$' then return false; end if;
  perform (a->>'createdAt')::timestamptz;
  for item in select key,value from jsonb_each(a->'values') loop
    if item.key !~ '^[a-z][a-z0-9_]{0,79}$' then return false; end if;
    if jsonb_typeof(item.value)='string' then
      if length(item.value#>>'{}')>3000 then return false; end if;
    elsif jsonb_typeof(item.value)='array' then
      if jsonb_array_length(item.value)>20 then return false; end if;
      for entry in select value from jsonb_array_elements(item.value) loop
        if jsonb_typeof(entry)<>'string' or length(entry#>>'{}')>500 then return false; end if;
      end loop;
    else return false;
    end if;
  end loop;
  for source in select value from jsonb_array_elements(a->'sources') loop
    if jsonb_typeof(source)<>'object' or not(source ?& array['id','title','href']) or (source-array['id','title','href'])<>'{}'::jsonb
      or jsonb_typeof(source->'id')<>'string' or length(source->>'id') not between 1 and 200
      or jsonb_typeof(source->'title')<>'string' or length(source->>'title') not between 1 and 300
      or jsonb_typeof(source->'href')<>'string' or length(source->>'href')>1000
      or source->>'href' ~ '[[:space:][:cntrl:]]' or position(chr(92) in source->>'href')>0
      or not (source->>'href' ~ '^/($|[^/])' or source->>'href' ~ '^https://')
    then return false; end if;
  end loop;
  return true;
exception when others then return false;
end $$;
revoke all on function pac.valid_ask_practice_artifact(jsonb) from public;

alter table pac.ask_response_records drop constraint ask_record_contract;
alter table pac.ask_response_records add constraint ask_record_contract check ((
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
        and ((record->'response'->'answer') - array['shortAnswer','whyItMatters','sources','limits','nextActions','questions','conflict','consultation','pathSuggestion','notice','publicResearch','practiceArtifact']) = '{}'::jsonb
        and (record->'response'->'answer') ?& array['shortAnswer','whyItMatters','sources','limits','nextActions']
        and jsonb_typeof(record->'response'->'answer'->'shortAnswer') = 'string'
        and jsonb_typeof(record->'response'->'answer'->'whyItMatters') = 'string'
        and jsonb_typeof(record->'response'->'answer'->'sources') = 'array'
        and jsonb_typeof(record->'response'->'answer'->'limits') = 'array'
        and jsonb_typeof(record->'response'->'answer'->'nextActions') = 'array'
        and (not ((record->'response'->'answer') ? 'practiceArtifact') or (pac.valid_ask_practice_artifact(record->'response'->'answer'->'practiceArtifact') is true and record->'response'->'answer'->'practiceArtifact'->>'traceId' = record->>'traceId' and record->'response'->'answer'->'practiceArtifact'->>'context' = case record->>'programScope' when 'dsd' then 'one_dsd' else 'one_dhs' end))
        and ((record->'response') - array['kind','answer']) = '{}'::jsonb)
      or (record->'response'->>'kind' = 'refusal' and jsonb_typeof(record->'response'->'safety') = 'object'
        and ((record->'response'->'safety') - array['message','redirect','alternatives']) = '{}'::jsonb
        and ((record->'response') - array['kind','safety']) = '{}'::jsonb)
    )
  ) is true);
