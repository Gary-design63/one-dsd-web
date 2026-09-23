begin;

-- Preserve the Harlem Renaissance writer's name in source material.
-- Only the technical-wording check uses this validation-only copy. The exact,
-- case-sensitive whole name is exempt; other uses of Claude and all other
-- checks remain unchanged. This does not rewrite or publish any content.

create or replace function pac.assert_plain_page_text(candidate text)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  trimmed_candidate text;
  parsed_candidate jsonb;
  icon_pattern text;
begin
  if candidate is null or length(btrim(candidate)) = 0 then
    raise exception 'Page wording cannot be blank' using errcode = '22023';
  end if;
  if candidate ~ '(^|[\n\r])[[:space:]]{0,3}(#{1,6}|[-+*]|[0-9]+\.)[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}(```|~~~)'
    or candidate ~ '\*\*[^*\n\r]+\*\*'
    or candidate ~ '`[^`\n\r]+`'
    or candidate ~ '\[[^]\n\r]+\]\([^()\n\r]+\)'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}>[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}[0-9]+\)[[:space:]]+[^[:space:]]'
    or candidate ~ '(^|[\n\r])[[:space:]]{0,3}(-{3,}|_{3,}|\*{3,})[[:space:]]*($|[\n\r])'
    or candidate ~ '(^|[\n\r])[[:space:]]*\|[^\n\r]+\|[[:space:]]*($|[\n\r])'
    or candidate ~ '(^|[[:space:](])(\*[^*\n\r]+\*|_[^_\n\r]+_)($|[[:space:]).,;:!?])' then
    raise exception 'Page wording must use plain text' using errcode = '22023';
  end if;

  trimmed_candidate := btrim(candidate);
  if (left(trimmed_candidate, 1) = '{' and right(trimmed_candidate, 1) = '}')
    or (left(trimmed_candidate, 1) = '[' and right(trimmed_candidate, 1) = ']') then
    begin
      parsed_candidate := trimmed_candidate::jsonb;
    exception when invalid_text_representation then
      parsed_candidate := null;
    end;
    if jsonb_typeof(parsed_candidate) in ('object', 'array') then
      raise exception 'Page wording must not contain serialized data' using errcode = '22023';
    end if;
  end if;

  if regexp_replace(candidate, '\mClaude[[:space:]]+McKay\M', 'historical author', 'g') ~* '(\mAI\M|\martificial intelligence\M|\mLLM\M|\mGPT([ -]?[0-9A-Za-z]+)?\M|\mChatGPT\M|\mClaude\M|\mAnthropic\M|\mOpenAI\M|\mGemini\M|\mCopilot\M|\mPerplexity\M|\mVercel\M|\mchatbot\M|\mAI assistant\M|\mdigital twin\M|\mmulti-?agent\M|\morchestrator\M|\mdispatcher\M|\mspecialist agent\M|\mmindset twin\M|\msystem prompt\M|\membeddings?\M|\mvector (search|store)\M|\mRAG\M|\minference\M|\mtemperature\M|\mmodel registry\M|\mprovider (adapter|route)\M|\mautonomy level\M|\magentic\M|\mAPI\M|\mendpoint\M|\m(local|session) storage\M|\mbrowser tab\M|\menvironment variables?\M|\mdeployment\M|\mruntime\M|\mserver-side\M|\mbackend\M|\mfrontend\M|\mserialized\M|\mpayload\M|\mmetadata\M|\mfixture\M|\mdebug(ging)?\M|\mbuild pipeline\M|\mprovenance\M|\mhallucinat(e|ed|ion|ions)\M)' then
    raise exception 'Page wording includes technical product language that is not staff-facing' using errcode = '22023';
  end if;

  icon_pattern := '[' || chr(9728) || '-' || chr(10175)
    || chr(11008) || '-' || chr(11263)
    || chr(126976) || '-' || chr(129791) || ']';
  if candidate ~ icon_pattern then
    raise exception 'Page wording must not contain icons' using errcode = '22023';
  end if;
end;
$$;

commit;

