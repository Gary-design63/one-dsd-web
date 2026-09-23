-- Restored source titles can explicitly prohibit scoring people.
-- Apply the same bounded negative-modifier handling used by surveillanceRefuse.
-- This replaces no table, grants no privilege, and retains the full recursive gate.

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
    -- Preserve negative guidance titles while continuing to scan every other word.
    -- The modifier must be terminal and comma-separated: double negations and
    -- positive ranking instructions elsewhere in the string are not exempt.
    text_value := regexp_replace(
      payload #>> '{}',
      ',[[:space:]]*without[[:space:]]+(scoring|ranking)[[:space:]]+(people|staff|employees|supervisors)[[:space:]]*([.!?]?)$',
      '\3',
      'gi'
    );
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
