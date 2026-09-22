-- Add structured course publication without altering original source content or history.
begin;
create or replace function pac.assert_course_schema(value jsonb, contract jsonb)
returns void language plpgsql immutable set search_path=pg_catalog,pac as $$
declare expected text; entry record; candidate jsonb; matched integer:=0; number_value numeric;
begin
  if value is null then raise exception 'A course value is missing' using errcode='22023'; end if;
  if contract ? 'oneOf' then
    for candidate in select jsonb_array_elements(contract->'oneOf') loop
      begin perform pac.assert_course_schema(value,candidate); matched:=matched+1;
      exception when sqlstate '22023' then null; end;
    end loop;
    if matched<>1 then raise exception 'Course interaction does not match its registered type' using errcode='22023';end if;
    return;
  end if;
  expected:=contract->>'type';
  if expected='integer' then
    if jsonb_typeof(value)<>'number' or (value#>>'{}')::numeric<>trunc((value#>>'{}')::numeric) then raise exception 'Course integer required' using errcode='22023';end if;
  elsif expected is not null and jsonb_typeof(value)<>expected then raise exception 'Course value type does not match' using errcode='22023';end if;
  if contract ? 'const' and value<>contract->'const' then raise exception 'Course fixed value does not match' using errcode='22023';end if;
  if contract ? 'enum' and not exists(select 1 from jsonb_array_elements(contract->'enum') item where item=value) then raise exception 'Course value is not registered' using errcode='22023';end if;
  if expected='object' then
    if exists(select 1 from jsonb_array_elements_text(coalesce(contract->'required','[]')) key where not value ? key) then raise exception 'Required course field is missing' using errcode='22023';end if;
    for entry in select * from jsonb_each(value) loop
      if coalesce(contract->'properties','{}') ? entry.key then perform pac.assert_course_schema(entry.value,contract->'properties'->entry.key);
      elsif contract->'additionalProperties'='false'::jsonb then raise exception 'Course field is not registered' using errcode='22023';end if;
      if entry.key in ('href','src','coverImage','introAudio') and jsonb_typeof(entry.value)='string' and entry.value#>>'{}' not in ('','#') then
        perform pac.assert_safe_page_link(entry.value#>>'{}');
      end if;
    end loop;
  elsif expected='array' then
    if jsonb_array_length(value)<coalesce((contract->>'minItems')::integer,0) or jsonb_array_length(value)>coalesce((contract->>'maxItems')::integer,500) then raise exception 'Course list length does not match' using errcode='22023';end if;
    if contract ? 'items' then for candidate in select jsonb_array_elements(value) loop perform pac.assert_course_schema(candidate,contract->'items');end loop;end if;
  elsif expected='string' then
    if length(value#>>'{}')>coalesce((contract->>'maxLength')::integer,100000) then raise exception 'Course text is too long' using errcode='22023';end if;
    if contract ? 'pattern' and (value#>>'{}')!~(contract->>'pattern') then raise exception 'Course identifier is not valid' using errcode='22023';end if;
  elsif expected in ('number','integer') then
    number_value:=(value#>>'{}')::numeric;
    if (contract ? 'minimum' and number_value<(contract->>'minimum')::numeric) or (contract ? 'maximum' and number_value>(contract->>'maximum')::numeric) or (contract ? 'exclusiveMinimum' and number_value<=(contract->>'exclusiveMinimum')::numeric) then raise exception 'Course number is out of range' using errcode='22023';end if;
  end if;
end;$$;
create or replace function pac.course_pack_schema() returns jsonb language sql immutable set search_path=pg_catalog as $$ select $course_schema${"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{"course":{"type":"object","properties":{"id":{"type":"string","pattern":"^[a-z0-9][a-z0-9-]{0,159}$"},"indexNumber":{"type":"integer","minimum":-9007199254740991,"maximum":9007199254740991},"seriesLabel":{"type":"string","maxLength":100000},"title":{"type":"string","maxLength":100000},"subtitle":{"type":"string","maxLength":100000},"scope":{"type":"string","maxLength":100000},"treatment":{"type":"string","maxLength":100000},"duration":{"type":"string","maxLength":100000},"author":{"type":"string","maxLength":100000},"coverImage":{"type":"string","maxLength":100000},"coverAlt":{"type":"string","maxLength":100000},"introAudio":{"type":"string","maxLength":100000},"introTranscript":{"type":"string","maxLength":100000},"hubFile":{"type":"string","maxLength":100000},"kind":{"type":"string","enum":["course","tutorial"]},"contentType":{"type":"string","enum":["foundation","practice","community-context","formal-support","shared-method"]},"learning":{"type":"object","properties":{"objectives":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}},"evidence":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}},"appliedNextStep":{"type":"string","maxLength":100000}},"required":["objectives","evidence","appliedNextStep"],"additionalProperties":false},"governance":{"type":"object","properties":{"contentOwner":{"type":"string","maxLength":100000},"reviewers":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}},"evidenceDate":{"type":"string","maxLength":100000},"lastReviewed":{"type":"string","maxLength":100000},"nextReview":{"type":"string","maxLength":100000},"updateTriggers":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}},"relatedDoor":{"type":"string","maxLength":100000},"toolkitQuestion":{"type":"string","maxLength":100000},"status":{"type":"string","enum":["draft","reviewed","current","archived"]}},"required":["contentOwner","reviewers","evidenceDate","lastReviewed","nextReview","updateTriggers","relatedDoor","toolkitQuestion","status"],"additionalProperties":false},"lessons":{"minItems":1,"maxItems":500,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","pattern":"^[a-z0-9][a-z0-9-]{0,159}$"},"number":{"type":"integer","exclusiveMinimum":0,"maximum":9007199254740991},"title":{"type":"string","maxLength":100000},"summary":{"type":"string","maxLength":100000},"minutes":{"type":"number","minimum":0},"blocks":{"maxItems":500,"type":"array","items":{"oneOf":[{"type":"object","properties":{"type":{"type":"string","const":"image"},"src":{"type":"string","maxLength":100000},"alt":{"type":"string","maxLength":100000},"caption":{"type":"string","maxLength":100000}},"required":["type","src","alt"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"text"},"heading":{"type":"string","maxLength":100000},"body":{"type":"string","maxLength":100000}},"required":["type","body"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"statement"},"body":{"type":"string","maxLength":100000}},"required":["type","body"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"quote"},"text":{"type":"string","maxLength":100000},"cite":{"type":"string","maxLength":100000}},"required":["type","text"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"list"},"heading":{"type":"string","maxLength":100000},"ordered":{"type":"boolean"},"items":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}}},"required":["type","items"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"leaderMove"},"heading":{"type":"string","maxLength":100000},"control":{"type":"string","maxLength":100000},"failure":{"type":"string","maxLength":100000},"next":{"type":"string","maxLength":100000}},"required":["type","control","failure","next"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"artifact"},"kind":{"type":"string","enum":["invitation","tagged-document","captioned-video","plain-language-flyer"]},"label":{"type":"string","maxLength":100000},"title":{"type":"string","maxLength":100000},"summary":{"type":"string","maxLength":100000},"fields":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"label":{"type":"string","maxLength":100000},"value":{"type":"string","maxLength":100000}},"required":["label","value"],"additionalProperties":false}},"action":{"type":"string","maxLength":100000}},"required":["type","kind","label","title","summary","fields","action"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"flashcards"},"heading":{"type":"string","maxLength":100000},"cards":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"front":{"type":"string","maxLength":100000},"back":{"type":"string","maxLength":100000}},"required":["front","back"],"additionalProperties":false}}},"required":["type","cards"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"accordion"},"heading":{"type":"string","maxLength":100000},"items":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"title":{"type":"string","maxLength":100000},"body":{"type":"string","maxLength":100000}},"required":["title","body"],"additionalProperties":false}}},"required":["type","items"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"tabs"},"heading":{"type":"string","maxLength":100000},"tabs":{"minItems":1,"maxItems":500,"type":"array","items":{"type":"object","properties":{"label":{"type":"string","maxLength":100000},"body":{"type":"string","maxLength":100000}},"required":["label","body"],"additionalProperties":false}}},"required":["type","tabs"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"timeline"},"heading":{"type":"string","maxLength":100000},"events":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"year":{"type":"string","maxLength":100000},"title":{"type":"string","maxLength":100000},"body":{"type":"string","maxLength":100000}},"required":["year","title","body"],"additionalProperties":false}}},"required":["type","events"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"knowledgeCheck"},"id":{"type":"string","pattern":"^[a-z0-9][a-z0-9-]{0,159}$"},"question":{"type":"string","maxLength":100000},"options":{"minItems":2,"maxItems":500,"type":"array","items":{"type":"object","properties":{"text":{"type":"string","maxLength":100000},"correct":{"type":"boolean"}},"required":["text","correct"],"additionalProperties":false}},"feedbackCorrect":{"type":"string","maxLength":100000},"feedbackIncorrect":{"type":"string","maxLength":100000}},"required":["type","id","question","options","feedbackCorrect","feedbackIncorrect"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","const":"sorting"},"id":{"type":"string","pattern":"^[a-z0-9][a-z0-9-]{0,159}$"},"heading":{"type":"string","maxLength":100000},"categories":{"minItems":1,"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}},"items":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"text":{"type":"string","maxLength":100000},"category":{"type":"string","maxLength":100000}},"required":["text","category"],"additionalProperties":false}}},"required":["type","id","categories","items"],"additionalProperties":false}]}},"learning":{"type":"object","properties":{"objective":{"type":"string","maxLength":100000},"takeaways":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}},"evidence":{"type":"string","maxLength":100000},"appliedNextStep":{"type":"string","maxLength":100000}},"required":["objective","takeaways","evidence","appliedNextStep"],"additionalProperties":false},"scenario":{"type":"object","properties":{"context":{"type":"string","maxLength":100000},"prompt":{"type":"string","maxLength":100000},"options":{"minItems":2,"maxItems":500,"type":"array","items":{"type":"object","properties":{"label":{"type":"string","maxLength":100000},"response":{"type":"string","maxLength":100000},"recommended":{"type":"boolean"}},"required":["label","response"],"additionalProperties":false}}},"required":["context","prompt","options"],"additionalProperties":false},"transfer":{"type":"object","properties":{"prompt":{"type":"string","maxLength":100000},"options":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}}},"required":["prompt","options"],"additionalProperties":false}},"required":["id","number","title","summary","minutes","blocks"],"additionalProperties":false}}},"required":["id","indexNumber","seriesLabel","title","subtitle","scope","treatment","duration","author","coverImage","coverAlt","lessons"],"additionalProperties":false},"jobAid":{"type":"object","properties":{"title":{"type":"string","maxLength":100000},"subtitle":{"type":"string","maxLength":100000},"quote":{"type":"string","maxLength":100000},"use":{"type":"object","properties":{"purpose":{"type":"string","maxLength":100000},"remember":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}},"doNext":{"type":"string","maxLength":100000}},"required":["purpose","remember","doNext"],"additionalProperties":false},"sections":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"heading":{"type":"string","maxLength":100000},"items":{"maxItems":500,"type":"array","items":{"type":"string","maxLength":100000}}},"required":["heading","items"],"additionalProperties":false}}},"required":["title","subtitle","sections"],"additionalProperties":false},"sources":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"title":{"type":"string","maxLength":100000},"href":{"type":"string","maxLength":100000},"note":{"type":"string","maxLength":100000}},"required":["title","href","note"],"additionalProperties":false}}},"required":["course","jobAid","sources"],"additionalProperties":false}$course_schema$::jsonb $$;

create or replace function pac.assert_valid_surface_document(
  requested_surface_id text,
  requested_scope_id text,
  requested_document jsonb
)
returns void
language plpgsql
stable
set search_path = pg_catalog, pac
as $$
declare
  definition pac.surface_definitions%rowtype;
  field_definition jsonb;
  field_key text;
  field_kind text;
  field_required boolean;
  field_maximum integer;
  item_maximum integer;
  field_value jsonb;
  text_value text;
  list_item jsonb;
  block_item jsonb;
  link_item jsonb;
  block_type text;
  expected_keys text[];
begin
  perform pac.assert_surface_request(requested_scope_id, requested_surface_id, true);
  select * into strict definition
  from pac.surface_definitions
  where surface_id = requested_surface_id and active = true;

  if requested_document is null or jsonb_typeof(requested_document) <> 'object'
    or octet_length(convert_to(requested_document::text, 'UTF8')) > 1000000 then
    raise exception 'Page wording must be a complete, reasonably sized document' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_object_keys(requested_document) actual(name)
    where actual.name <> all(array['schemaVersion', 'surfaceId', 'scope', 'values']::text[])
  ) or not requested_document ?& array['schemaVersion', 'surfaceId', 'scope', 'values']::text[] then
    raise exception 'Page wording document fields are not allowed' using errcode = '22023';
  end if;
  if jsonb_typeof(requested_document -> 'schemaVersion') <> 'number'
    or (requested_document ->> 'schemaVersion')::integer <> definition.schema_version
    or requested_document ->> 'surfaceId' <> requested_surface_id
    or requested_document ->> 'scope' <> requested_scope_id
    or jsonb_typeof(requested_document -> 'values') <> 'object' then
    raise exception 'Page wording document identity does not match this page area' using errcode = '22023';
  end if;

  select array_agg(field ->> 'key' order by ordinal)
  into expected_keys
  from jsonb_array_elements(definition.field_contract) with ordinality registered(field, ordinal);
  if expected_keys is null
    or not (requested_document -> 'values') ?& expected_keys
    or exists (
      select 1 from jsonb_object_keys(requested_document -> 'values') actual(name)
      where actual.name <> all(expected_keys)
    ) then
    raise exception 'Page wording fields do not match this page area' using errcode = '22023';
  end if;

  for field_definition in select value from jsonb_array_elements(definition.field_contract)
  loop
    field_key := field_definition ->> 'key';
    field_kind := field_definition ->> 'kind';
    field_required := coalesce((field_definition ->> 'required')::boolean, true);
    field_maximum := coalesce((field_definition ->> 'maxLength')::integer,
      case when field_kind = 'short' then 500 when field_kind = 'url' then 2000 else 10000 end);
    item_maximum := coalesce((field_definition ->> 'maxItems')::integer, 100);
    field_value := requested_document -> 'values' -> field_key;

    if field_kind = 'course-pack' then
      if requested_surface_id not like 'course.%' or field_value#>>'{course,id}' <> substring(requested_surface_id from 8) then
        raise exception 'Course identity does not match the publication' using errcode='22023';
      end if;
      perform pac.assert_course_schema(field_value, pac.course_pack_schema());
      if (select count(*) from jsonb_array_elements(field_value#>'{course,lessons}')) <>
         (select count(distinct lesson->>'id') from jsonb_array_elements(field_value#>'{course,lessons}') lesson) then
        raise exception 'Course lesson identifiers must be unique' using errcode='22023';
      end if;
      for block_item in select block from jsonb_array_elements(field_value#>'{course,lessons}') lesson cross join lateral jsonb_array_elements(lesson->'blocks') block loop
        if block_item->>'type'='knowledgeCheck' and not exists(select 1 from jsonb_array_elements(block_item->'options') option where option->'correct'='true'::jsonb) then
          raise exception 'Course knowledge check requires a correct answer' using errcode='22023';
        end if;
        if block_item->>'type'='sorting' and exists(select 1 from jsonb_array_elements(block_item->'items') item where not (block_item->'categories') @> jsonb_build_array(item->>'category')) then
          raise exception 'Course sorting category is not available' using errcode='22023';
        end if;
      end loop;
      continue;
    end if;

    if field_kind in ('short', 'long', 'url') then
      if jsonb_typeof(field_value) <> 'string' then
        raise exception 'A page wording field has the wrong kind of value' using errcode = '22023';
      end if;
      text_value := field_value #>> '{}';
      if length(text_value) > field_maximum or (field_required and length(btrim(text_value)) = 0) then
        raise exception 'A page wording field is blank or too long' using errcode = '22023';
      end if;
      if length(btrim(text_value)) > 0 then
        if field_kind = 'url' then
          perform pac.assert_safe_page_link(text_value);
        else
          perform pac.assert_plain_page_text(text_value);
        end if;
      end if;
      continue;
    end if;

    if jsonb_typeof(field_value) <> 'array'
      or jsonb_array_length(field_value) > item_maximum
      or (field_required and jsonb_array_length(field_value) = 0) then
      raise exception 'A page wording list is empty, too long, or has the wrong kind of value' using errcode = '22023';
    end if;

    if field_kind = 'string-list' then
      for list_item in select value from jsonb_array_elements(field_value)
      loop
        if jsonb_typeof(list_item) <> 'string' then
          raise exception 'A page wording list must contain text' using errcode = '22023';
        end if;
        text_value := list_item #>> '{}';
        if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
          raise exception 'A page wording list item is blank or too long' using errcode = '22023';
        end if;
        perform pac.assert_plain_page_text(text_value);
      end loop;
    elsif field_kind = 'link-list' then
      for link_item in select value from jsonb_array_elements(field_value)
      loop
        if jsonb_typeof(link_item) <> 'object'
          or not link_item ?& array['label', 'href']::text[]
          or exists (
            select 1 from jsonb_object_keys(link_item) actual(name)
            where actual.name <> all(array['label', 'href']::text[])
          ) or jsonb_typeof(link_item -> 'label') <> 'string'
          or jsonb_typeof(link_item -> 'href') <> 'string' then
          raise exception 'A page wording link has fields that are not allowed' using errcode = '22023';
        end if;
        text_value := link_item ->> 'label';
        if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
          raise exception 'A page wording link label is blank or too long' using errcode = '22023';
        end if;
        perform pac.assert_plain_page_text(text_value);
        perform pac.assert_safe_page_link(link_item ->> 'href');
      end loop;
    elsif field_kind = 'rich-blocks' then
      for block_item in select value from jsonb_array_elements(field_value)
      loop
        if jsonb_typeof(block_item) <> 'object' or jsonb_typeof(block_item -> 'type') <> 'string' then
          raise exception 'A structured page section has fields that are not allowed' using errcode = '22023';
        end if;
        block_type := block_item ->> 'type';
        if block_type = 'heading' then
          if not block_item ?& array['type', 'level', 'text']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'level', 'text']::text[])
            ) or jsonb_typeof(block_item -> 'level') <> 'number'
            or (block_item ->> 'level')::integer not in (2, 3)
            or jsonb_typeof(block_item -> 'text') <> 'string' then
            raise exception 'A structured heading has fields that are not allowed' using errcode = '22023';
          end if;
          text_value := block_item ->> 'text';
          if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
            raise exception 'A structured heading is blank or too long' using errcode = '22023';
          end if;
          perform pac.assert_plain_page_text(text_value);
        elsif block_type = 'paragraph' then
          if not block_item ?& array['type', 'text']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'text']::text[])
            ) or jsonb_typeof(block_item -> 'text') <> 'string' then
            raise exception 'A structured paragraph has fields that are not allowed' using errcode = '22023';
          end if;
          text_value := block_item ->> 'text';
          if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
            raise exception 'A structured paragraph is blank or too long' using errcode = '22023';
          end if;
          perform pac.assert_plain_page_text(text_value);
        elsif block_type in ('bullet-list', 'numbered-list') then
          if not block_item ?& array['type', 'items']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'items']::text[])
            ) or jsonb_typeof(block_item -> 'items') <> 'array'
            or jsonb_array_length(block_item -> 'items') not between 1 and item_maximum then
            raise exception 'A structured list has fields that are not allowed' using errcode = '22023';
          end if;
          for list_item in select value from jsonb_array_elements(block_item -> 'items')
          loop
            if jsonb_typeof(list_item) <> 'string' then
              raise exception 'A structured list must contain text' using errcode = '22023';
            end if;
            text_value := list_item #>> '{}';
            if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
              raise exception 'A structured list item is blank or too long' using errcode = '22023';
            end if;
            perform pac.assert_plain_page_text(text_value);
          end loop;
        elsif block_type = 'link-list' then
          if not block_item ?& array['type', 'items']::text[]
            or exists (
              select 1 from jsonb_object_keys(block_item) actual(name)
              where actual.name <> all(array['type', 'items']::text[])
            ) or jsonb_typeof(block_item -> 'items') <> 'array'
            or jsonb_array_length(block_item -> 'items') not between 1 and item_maximum then
            raise exception 'A structured link list has fields that are not allowed' using errcode = '22023';
          end if;
          for link_item in select value from jsonb_array_elements(block_item -> 'items')
          loop
            if jsonb_typeof(link_item) <> 'object'
              or not link_item ?& array['label', 'href']::text[]
              or exists (
                select 1 from jsonb_object_keys(link_item) actual(name)
                where actual.name <> all(array['label', 'href']::text[])
              ) or jsonb_typeof(link_item -> 'label') <> 'string'
              or jsonb_typeof(link_item -> 'href') <> 'string' then
              raise exception 'A structured link has fields that are not allowed' using errcode = '22023';
            end if;
            text_value := link_item ->> 'label';
            if length(btrim(text_value)) = 0 or length(text_value) > field_maximum then
              raise exception 'A structured link label is blank or too long' using errcode = '22023';
            end if;
            perform pac.assert_plain_page_text(text_value);
            perform pac.assert_safe_page_link(link_item ->> 'href');
          end loop;
        else
          raise exception 'A structured page section is not allowed' using errcode = '22023';
        end if;
      end loop;
    else
      raise exception 'A registered page wording field kind is not supported' using errcode = '22023';
    end if;
  end loop;
end;
$$;
create or replace function pac.enforce_surface_definition_contract()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
declare
  field_definition jsonb;
  field_key text;
  field_kind text;
  keys text[] := '{}'::text[];
  protected_key text;
begin
  if new.route_pattern <> '*' and new.route_pattern !~ '^/[^[:space:][:cntrl:]<>"\\]*$' then
    raise exception 'Registered page route is not safe' using errcode = '22023';
  end if;
  perform pac.assert_plain_page_text(new.staff_label);
  if cardinality(new.required_review_dimensions) <>
    (select count(distinct dimension) from unnest(new.required_review_dimensions) dimension) then
    raise exception 'Registered reviews must be unique' using errcode = '22023';
  end if;

  for field_definition in select value from jsonb_array_elements(new.field_contract)
  loop
    if jsonb_typeof(field_definition) <> 'object'
      or not field_definition ?& array['key', 'label', 'kind']::text[]
      or exists (
        select 1 from jsonb_object_keys(field_definition) actual(name)
        where actual.name <> all(array[
          'key', 'label', 'kind', 'required', 'maxLength', 'maxItems', 'group', 'helpText'
        ]::text[])
      ) then
      raise exception 'Registered page field contract is not allowed' using errcode = '22023';
    end if;
    field_key := field_definition ->> 'key';
    field_kind := field_definition ->> 'kind';
    if field_key !~ '^[a-z][a-zA-Z0-9_]{0,99}$'
      or field_kind not in ('short', 'long', 'url', 'string-list', 'link-list', 'rich-blocks', 'course-pack')
      or jsonb_typeof(field_definition -> 'label') <> 'string'
      or (field_definition ? 'required' and jsonb_typeof(field_definition -> 'required') <> 'boolean')
      or (field_definition ? 'maxLength' and (
        jsonb_typeof(field_definition -> 'maxLength') <> 'number'
        or (field_definition ->> 'maxLength')::integer not between 1 and 100000
      ))
      or (
        field_definition ? 'maxItems' and (
          jsonb_typeof(field_definition -> 'maxItems') <> 'number'
          or (field_definition ->> 'maxItems')::integer not between 1 and 500
        )
      ) then
      raise exception 'Registered page field contract is not allowed' using errcode = '22023';
    end if;
    if field_key = any(keys) then
      raise exception 'Registered page field keys must be unique' using errcode = '22023';
    end if;
    keys := array_append(keys, field_key);
    perform pac.assert_plain_page_text(field_definition ->> 'label');
    if field_definition ? 'group' then perform pac.assert_plain_page_text(field_definition ->> 'group'); end if;
    if field_definition ? 'helpText' then perform pac.assert_plain_page_text(field_definition ->> 'helpText'); end if;
  end loop;

  foreach protected_key in array new.protected_fields
  loop
    if protected_key !~ '^[a-z][a-zA-Z0-9_]{0,99}$' or protected_key = any(keys) then
      raise exception 'Protected fields cannot be editable' using errcode = '22023';
    end if;
  end loop;
  if cardinality(new.protected_fields) <>
    (select count(distinct protected) from unnest(new.protected_fields) protected) then
    raise exception 'Protected page fields must be unique' using errcode = '22023';
  end if;
  return new;
end;
$$;
revoke all on function pac.assert_course_schema(jsonb,jsonb) from public,pac_app_runtime;
revoke all on function pac.course_pack_schema() from public,pac_app_runtime;
commit;
