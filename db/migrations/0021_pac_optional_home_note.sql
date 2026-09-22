begin;

-- The Home page may omit its optional supporting note. Every other page-copy
-- field remains required, and a nonblank note still receives the same length,
-- plain-text, staff-language, icon, and safe-link validation as before.
create or replace function pac.assert_valid_page_block_copy(
  requested_content_item_id text,
  requested_copy jsonb
)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  expected_keys text[];
  link_keys text[];
  candidate_key text;
  maximum_length integer;
  candidate_value text;
begin
  if jsonb_typeof(requested_copy) <> 'object' then
    raise exception 'Page wording must be a complete set of labeled fields' using errcode = '22023';
  end if;

  if requested_content_item_id = 'page-home' then
    expected_keys := array[
      'heroKicker', 'headlineLine1', 'headlineLine2', 'headlineLine3',
      'heroLede', 'heroNote', 'heroImageAlt', 'primaryActionLabel',
      'primaryActionHref', 'secondaryActionLabel', 'secondaryActionHref',
      'aboutLabel', 'aboutText', 'guidedKicker', 'guidedTitle', 'guidedIntro',
      'guidedFallbackLabel', 'guidedFallbackNote', 'helpKicker', 'helpTitle',
      'askLabel', 'askHref', 'askDescription', 'communitiesLabel',
      'communitiesHref', 'communitiesDescription', 'resourcesLabel',
      'resourcesHref', 'resourcesDescription', 'supportLabel', 'supportHref',
      'supportAvailableDescription', 'supportPreviewDescription', 'goalsKicker',
      'goalsTitle', 'foundationLabel', 'foundationHref', 'learnLabel', 'learnHref',
      'applyLabel', 'applyHref', 'leadLabel', 'leadHref', 'commitmentsKicker',
      'commitmentsTitle', 'commitmentsLinkLabel', 'commitmentsLinkHref',
      'privacyLabel', 'privacyText'
    ]::text[];
    link_keys := array[
      'primaryActionHref', 'secondaryActionHref', 'askHref', 'communitiesHref',
      'resourcesHref', 'supportHref', 'foundationHref', 'learnHref', 'applyHref',
      'leadHref', 'commitmentsLinkHref'
    ]::text[];
  elsif requested_content_item_id = 'site-footer' then
    expected_keys := array[
      'identityKicker', 'identityText', 'helpHeading', 'askLabel', 'askHref',
      'resourcesLabel', 'resourcesHref', 'communitiesLabel', 'communitiesHref',
      'requestAvailableLabel', 'requestPreviewLabel', 'requestHref', 'trackLabel',
      'trackHref', 'escalationLabel', 'escalationHref', 'privacyHeading', 'privacyText'
    ]::text[];
    link_keys := array[
      'askHref', 'resourcesHref', 'communitiesHref', 'requestHref', 'trackHref',
      'escalationHref'
    ]::text[];
  else
    raise exception 'This page area is not available' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from unnest(expected_keys) expected(name)
    where not requested_copy ? expected.name
  ) or exists (
    select 1 from jsonb_object_keys(requested_copy) actual(name)
    where actual.name <> all(expected_keys)
  ) then
    raise exception 'Page wording fields do not match this page area' using errcode = '22023';
  end if;

  foreach candidate_key in array expected_keys loop
    if jsonb_typeof(requested_copy -> candidate_key) <> 'string' then
      raise exception 'Every page wording field must be text' using errcode = '22023';
    end if;
    candidate_value := requested_copy ->> candidate_key;
    maximum_length := case
      when candidate_key = any(link_keys) then 2000
      when candidate_key in ('identityText', 'privacyText') and requested_content_item_id = 'site-footer' then 4000
      when candidate_key in ('aboutText', 'guidedIntro', 'privacyText') then 3000
      when candidate_key in (
        'heroNote', 'askDescription', 'communitiesDescription', 'resourcesDescription',
        'supportAvailableDescription', 'supportPreviewDescription'
      ) then 2000
      when candidate_key in ('heroLede', 'guidedFallbackNote') then 1000
      when candidate_key in (
        'helpTitle', 'goalsTitle', 'foundationLabel', 'learnLabel', 'applyLabel',
        'leadLabel', 'commitmentsTitle', 'escalationLabel', 'heroImageAlt'
      ) then 500
      when candidate_key in ('guidedTitle', 'guidedFallbackLabel', 'commitmentsLinkLabel',
        'requestAvailableLabel', 'requestPreviewLabel', 'trackLabel') then 300
      else 200
    end;

    if requested_content_item_id = 'page-home'
      and candidate_key = 'heroNote'
      and candidate_value = '' then
      continue;
    end if;

    if length(btrim(candidate_value)) not between 1 and maximum_length then
      raise exception 'A page wording field is blank or too long' using errcode = '22023';
    end if;
    if candidate_key = any(link_keys) then
      perform pac.assert_safe_page_link(candidate_value);
    else
      perform pac.assert_plain_page_text(candidate_value);
    end if;
  end loop;
end;
$$;

commit;
