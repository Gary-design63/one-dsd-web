-- Exact ASK evidence references. Older records without these optional fields remain valid.
-- This checks reference integrity and retained passages; it does not prove factual truth.
create function pac.valid_ask_source_evidence(e jsonb) returns boolean
language plpgsql immutable set search_path=pg_catalog,pac as $$
declare r jsonb; span jsonb;
begin
 if jsonb_typeof(e) is distinct from 'object' or not(e ?& array['version','evidenceId','documentId','contentHash','revisions','excerpt'])
 or (e-array['version','evidenceId','documentId','contentHash','revisions','excerpt'])<>'{}'::jsonb
 or e->'version'<>'1'::jsonb or jsonb_typeof(e->'documentId')<>'string' or length(e->>'documentId') not between 1 and 200
 or jsonb_typeof(e->'evidenceId')<>'string' or e->>'evidenceId' !~ '^[a-f0-9]{64}$'
 or jsonb_typeof(e->'contentHash')<>'string' or e->>'contentHash' !~ '^[a-f0-9]{64}$'
 or jsonb_typeof(e->'revisions')<>'array' or jsonb_array_length(e->'revisions') not between 1 and 32 then return false;end if;
 for r in select value from jsonb_array_elements(e->'revisions') loop
  if jsonb_typeof(r)<>'object' or not(r ?& array['sourceId','revisionId','payloadHash','scope'])
   or (r-array['sourceId','revisionId','payloadHash','scope'])<>'{}'::jsonb
   or jsonb_typeof(r->'sourceId')<>'string' or length(r->>'sourceId') not between 1 and 200
   or jsonb_typeof(r->'scope')<>'string' or length(r->>'scope') not between 1 and 60
   or jsonb_typeof(r->'payloadHash')<>'string' or r->>'payloadHash' !~ '^[a-f0-9]{64}$'
   or (r->'revisionId'<>'null'::jsonb and (jsonb_typeof(r->'revisionId')<>'string' or r->>'revisionId' !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'))
   then return false;end if;
 end loop;
 span=e->'excerpt';
 if jsonb_typeof(span)<>'object' or not(span ?& array['start','end','quote']) or (span-array['start','end','quote'])<>'{}'::jsonb
  or jsonb_typeof(span->'quote')<>'string' or length(span->>'quote') not between 1 and 1500
  or jsonb_typeof(span->'start')<>'number' or span->>'start' !~ '^[0-9]+$'
  or jsonb_typeof(span->'end')<>'number' or span->>'end' !~ '^[0-9]+$'
  or (span->>'end')::bigint-(span->>'start')::bigint<>length(span->>'quote')
 then return false;end if;
 return true;
exception when others then return false;
end $$;
revoke all on function pac.valid_ask_source_evidence(jsonb) from public;

create function pac.valid_ask_evidence_claims(a jsonb) returns boolean
language plpgsql immutable set search_path=pg_catalog,pac as $$
declare source jsonb; claim jsonb; ref jsonb; e jsonb; span jsonb;
begin
 for source in select value from jsonb_array_elements(a->'sources') loop
  if source ? 'evidence' and pac.valid_ask_source_evidence(source->'evidence') is not true then return false;end if;
 end loop;
 if not(a ? 'evidenceClaims') then return true;end if;
 if jsonb_typeof(a->'evidenceClaims')<>'array' or jsonb_array_length(a->'evidenceClaims')>12 then return false;end if;
 for claim in select value from jsonb_array_elements(a->'evidenceClaims') loop
  if jsonb_typeof(claim)<>'object' or not(claim ?& array['kind','text','references']) or (claim-array['kind','text','references'])<>'{}'::jsonb
   or claim->>'kind' not in ('source_excerpt','inference') or jsonb_typeof(claim->'kind')<>'string'
   or jsonb_typeof(claim->'text')<>'string' or length(claim->>'text') not between 1 and 4000
   or jsonb_typeof(claim->'references')<>'array' or jsonb_array_length(claim->'references') not between 1 and 4 then return false;end if;
  if claim->>'kind'='source_excerpt' and (jsonb_array_length(claim->'references')<>1 or claim->>'text'<>claim->'references'->0->>'quote') then return false;end if;
  for ref in select value from jsonb_array_elements(claim->'references') loop
   if jsonb_typeof(ref)<>'object' or not(ref ?& array['evidenceId','start','end','quote']) or (ref-array['evidenceId','start','end','quote'])<>'{}'::jsonb
    or jsonb_typeof(ref->'evidenceId')<>'string' or ref->>'evidenceId' !~ '^[a-f0-9]{64}$'
    or jsonb_typeof(ref->'quote')<>'string' or length(ref->>'quote') not between 1 and 1500
    or jsonb_typeof(ref->'start')<>'number' or ref->>'start' !~ '^[0-9]+$'
    or jsonb_typeof(ref->'end')<>'number' or ref->>'end' !~ '^[0-9]+$'
    or (ref->>'end')::bigint-(ref->>'start')::bigint<>length(ref->>'quote') then return false;end if;
   select item->'evidence' into e from jsonb_array_elements(a->'sources') item where item->'evidence'->>'evidenceId'=ref->>'evidenceId' limit 1;
   if e is null then return false;end if;
   span=e->'excerpt';
   if (ref->>'start')::bigint<(span->>'start')::bigint or (ref->>'end')::bigint>(span->>'end')::bigint
    or substring(span->>'quote' from ((ref->>'start')::integer-(span->>'start')::integer+1) for length(ref->>'quote'))<>ref->>'quote'
   then return false;end if;
  end loop;
 end loop;
 return true;
exception when others then return false;
end $$;
revoke all on function pac.valid_ask_evidence_claims(jsonb) from public;

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
        and ((record->'response'->'answer') - array['shortAnswer','whyItMatters','sources','limits','nextActions','questions','conflict','consultation','pathSuggestion','notice','publicResearch','practiceArtifact','evidenceClaims']) = '{}'::jsonb
        and (record->'response'->'answer') ?& array['shortAnswer','whyItMatters','sources','limits','nextActions']
        and jsonb_typeof(record->'response'->'answer'->'shortAnswer') = 'string'
        and jsonb_typeof(record->'response'->'answer'->'whyItMatters') = 'string'
        and jsonb_typeof(record->'response'->'answer'->'sources') = 'array'
        and jsonb_typeof(record->'response'->'answer'->'limits') = 'array'
        and jsonb_typeof(record->'response'->'answer'->'nextActions') = 'array'
        and pac.valid_ask_evidence_claims(record->'response'->'answer') is true
        and (not ((record->'response'->'answer') ? 'practiceArtifact') or (pac.valid_ask_practice_artifact(record->'response'->'answer'->'practiceArtifact') is true and record->'response'->'answer'->'practiceArtifact'->>'traceId' = record->>'traceId' and record->'response'->'answer'->'practiceArtifact'->>'context' = case record->>'programScope' when 'dsd' then 'one_dsd' else 'one_dhs' end))
        and ((record->'response') - array['kind','answer']) = '{}'::jsonb)
      or (record->'response'->>'kind' = 'refusal' and jsonb_typeof(record->'response'->'safety') = 'object'
        and ((record->'response'->'safety') - array['message','redirect','alternatives']) = '{}'::jsonb
        and ((record->'response') - array['kind','safety']) = '{}'::jsonb)
    )
  ) is true);
