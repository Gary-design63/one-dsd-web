begin;

-- RG-2 trust vocabulary. Unknown material remains protected (S2) until a
-- review and publication decision assigns a lower class explicitly.
create table if not exists pac.participation_classes (
  participation_class text primary key check (
    participation_class in ('voluntary_private', 'voluntary_shared', 'supports_required', 'required_record')
  ),
  description text not null,
  may_create_official_record boolean not null,
  created_at timestamptz not null default now()
);

insert into pac.participation_classes (
  participation_class, description, may_create_official_record
)
values
  ('voluntary_private', 'Self-directed activity that is private by default and does not become compliance evidence.', false),
  ('voluntary_shared', 'A person explicitly chooses to share a draft, feedback item, or support request with named recipients.', false),
  ('supports_required', 'The program supports a required process but is not the official system of record.', false),
  ('required_record', 'A separately authorized formal workflow with explicit identity, viewers, retention, and correction controls.', true)
on conflict (participation_class) do update
set description = excluded.description,
    may_create_official_record = excluded.may_create_official_record;

create table if not exists pac.retention_policies (
  retention_policy_id text primary key,
  record_class text not null,
  policy_version text not null,
  status text not null check (status in ('draft', 'approved', 'withdrawn', 'superseded')),
  retention_days integer check (retention_days is null or retention_days between 1 and 3650),
  correction_process text,
  deletion_process text,
  recovery_process text,
  incident_process text,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    status <> 'approved'
    or (
      retention_days is not null
      and correction_process is not null
      and deletion_process is not null
      and recovery_process is not null
      and incident_process is not null
      and approved_by is not null
      and approved_at is not null
    )
  )
);

alter table pac.source_carriers
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4'));

alter table pac.source_items
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4')),
  add column if not exists deidentification_status text not null default 'not_reviewed'
    check (deidentification_status in ('not_reviewed', 'not_needed', 'verified', 'failed')),
  add column if not exists ordinary_indexing_allowed boolean not null default false,
  add column if not exists model_context_allowed boolean not null default false;

alter table pac.content_items
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4'));

alter table pac.content_revisions
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4')),
  add column if not exists ordinary_indexing_allowed boolean not null default false,
  add column if not exists model_context_allowed boolean not null default false,
  add column if not exists limitations text[] not null default '{}'::text[];

alter table pac.publication_decisions
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4')),
  add column if not exists unauthenticated_exposure_permitted boolean not null default false,
  add column if not exists exposure_reason text;

alter table pac.assets
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4'));

alter table pac.search_chunks
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4')),
  add column if not exists model_context_allowed boolean not null default false;

alter table pac.search_embeddings
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4'));

alter table pac.knowledge_nodes
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4')),
  add column if not exists model_context_allowed boolean not null default false;

alter table pac.knowledge_edges
  add column if not exists sensitivity_class text not null default 'S2'
    check (sensitivity_class in ('S0', 'S1', 'S2', 'S3', 'S4')),
  add column if not exists model_context_allowed boolean not null default false;

comment on column pac.knowledge_nodes.trust_score is
  'Evidence quality for a knowledge object only. It must never describe a person, employee, team, belief, or participation.';

-- A database backstop rejects exact fields that would create ideology scoring,
-- inferred protected traits, supervisor surveillance, or hidden staff profiles.
create or replace function pac.assert_no_prohibited_profile_fields(payload jsonb)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pac
as $$
declare
  item record;
  normalized_key text;
begin
  if payload is null then
    return;
  end if;

  if jsonb_typeof(payload) = 'object' then
    for item in select key, value from jsonb_each(payload)
    loop
      -- Removing separators makes this check independent of snake case,
      -- camel case, spaces, punctuation, and capitalized acronyms.
      normalized_key := lower(regexp_replace(item.key, '[^A-Za-z0-9]+', '', 'g'));
      if normalized_key = any(array[
        'beliefprofile',
        'beliefsbyworker',
        'completionbystaff',
        'compliancescore',
        'culturalcompetencescore',
        'deiscore',
        'employeeequityscore',
        'employeeequityreadiness',
        'employeeideology',
        'employeeprofile',
        'ideologybyemployee',
        'equitymaturityscore',
        'equityscore',
        'ideologyscore',
        'inferreddisability',
        'inferredethnicity',
        'inferredgenderidentity',
        'inferredprotectedclass',
        'inferredrace',
        'learningcompliancescore',
        'learningprogressbyemployee',
        'participationleaderboard',
        'supervisorparticipationdashboard',
        'supervisorparticipationscore',
        'workerinclusionmaturityscore'
      ])
      or normalized_key ~ '^(racialbias|equityreadiness|deireadiness|culturalcompetence|equitymaturity|inclusionmaturity)(score|rating|ranking|rank|profile)$'
      or normalized_key ~ '^(political|religious|ideological)(belief|beliefs|affiliation|affiliations|profile)$'
      or normalized_key ~ '^(belief|beliefs|ideology|ideologies|learningprogress|trainingprogress|learningcompletion|trainingcompletion|coursecompletion|completion|activity)(by|per)(employee|staff|worker|person|individual|member|user|supervisor)$'
      or normalized_key ~ '^(participation|engagement)(by|per)(employee|staff|worker|person|individual|member|user|supervisor)$'
      or normalized_key ~ '^(employee|staff|worker|personnel|supervisor)(equity|dei|ideology|inclusion|bias|participation|engagement|culturalcompetence)(score|rating|ranking|rank|profile|dashboard|leaderboard)$'
      or normalized_key ~ '^(employee|staff|worker|personnel|supervisor)(equityreadiness|inclusionmaturity|learningprogress|completion|activity)(score|rating|ranking|rank|profile|dashboard|leaderboard)?$'
      or normalized_key ~ '^(inferred|predicted|estimated|guessed)(race|ethnicity|genderidentity|disability|protectedclass|politicalbelief|politicalbeliefs|religion)$'
      then
        raise exception using
          errcode = '22023',
          message = 'Prohibited employee-profile field';
      end if;
      perform pac.assert_no_prohibited_profile_fields(item.value);
    end loop;
  elsif jsonb_typeof(payload) = 'array' then
    for item in select value from jsonb_array_elements(payload)
    loop
      perform pac.assert_no_prohibited_profile_fields(item.value);
    end loop;
  end if;
end;
$$;

create or replace function pac.reject_prohibited_profile_row()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pac
as $$
begin
  perform pac.assert_no_prohibited_profile_fields(to_jsonb(new));
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  for table_name in
    select columns.table_name
    from information_schema.columns columns
    join information_schema.tables tables
      on tables.table_schema = columns.table_schema
      and tables.table_name = columns.table_name
    where columns.table_schema = 'pac'
      and columns.udt_name = 'jsonb'
      and tables.table_type = 'BASE TABLE'
    group by columns.table_name
  loop
    execute format('drop trigger if exists no_prohibited_profile_fields on pac.%I', table_name);
    execute format(
      'create trigger no_prohibited_profile_fields before insert or update on pac.%I for each row execute function pac.reject_prohibited_profile_row()',
      table_name
    );
  end loop;
end;
$$;

-- A staff publication is safe for an unauthenticated request only when the
-- publication decision explicitly permits exposure and every projected layer
-- is S0 or S1. Scope inheritance can narrow, but never broaden, this decision.
create or replace function pac.enforce_data_trust_publication_gate()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
declare
  revision_class text;
  revision_indexing boolean;
  item_class text;
  protected_sources integer;
  protected_assets integer;
begin
  if new.decision <> 'publish' then
    return new;
  end if;

  select r.sensitivity_class, r.ordinary_indexing_allowed, i.sensitivity_class
  into revision_class, revision_indexing, item_class
  from pac.content_revisions r
  join pac.content_items i on i.content_item_id = r.content_item_id
  where r.revision_id = new.revision_id
    and i.content_item_id = new.content_item_id;

  if revision_class is null then
    raise exception 'Publication revision and content item do not match';
  end if;
  if revision_class not in ('S0', 'S1') or item_class not in ('S0', 'S1') then
    raise exception 'Protected or unreviewed content cannot be published to a staff projection';
  end if;
  if new.sensitivity_class is distinct from revision_class then
    raise exception 'Publication sensitivity must match the reviewed revision';
  end if;
  if new.unauthenticated_exposure_permitted and not revision_indexing then
    raise exception 'Unauthenticated exposure requires an explicitly indexable staff revision';
  end if;
  if new.unauthenticated_exposure_permitted and nullif(trim(new.exposure_reason), '') is null then
    raise exception 'Unauthenticated exposure requires a recorded reason';
  end if;

  select count(*) into protected_sources
  from pac.revision_sources rs
  join pac.source_items source on source.source_item_id = rs.source_item_id
  where rs.revision_id = new.revision_id
    and (
      source.sensitivity_class not in ('S0', 'S1')
      or source.ordinary_indexing_allowed is distinct from true
      or source.deidentification_status not in ('not_needed', 'verified')
    );
  if protected_sources > 0 then
    raise exception 'A protected or unreviewed source cannot enter a staff publication';
  end if;

  select count(*) into protected_assets
  from pac.revision_assets ra
  join pac.assets asset on asset.asset_id = ra.asset_id
  where ra.revision_id = new.revision_id
    and asset.sensitivity_class not in ('S0', 'S1');
  if protected_assets > 0 then
    raise exception 'A protected or unreviewed asset cannot enter a staff publication';
  end if;

  return new;
end;
$$;

drop trigger if exists data_trust_publication_gate on pac.publication_decisions;
create trigger data_trust_publication_gate
before insert on pac.publication_decisions
for each row execute function pac.enforce_data_trust_publication_gate();

create or replace view pac.current_publications
with (security_invoker = true) as
select content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_at, decided_by, reason,
  sensitivity_class, unauthenticated_exposure_permitted, exposure_reason
from (
  select d.*,
    row_number() over (partition by content_item_id, scope_id order by publication_decision_id desc) as row_rank
  from pac.publication_decisions d
) ranked
where row_rank = 1 and decision = 'publish';

create or replace view pac.current_staff_publications
with (security_invoker = true) as
select p.content_item_id, p.revision_id, p.scope_id, p.gate_snapshot, p.decided_at,
  i.content_kind, i.staff_label, r.canonical_payload, r.payload_sha256,
  p.sensitivity_class, p.unauthenticated_exposure_permitted, p.exposure_reason,
  r.model_context_allowed
from pac.current_publications p
join pac.content_items i on i.content_item_id = p.content_item_id
join pac.content_revisions r on r.revision_id = p.revision_id
where i.restricted = false
  and i.retired_at is null
  and i.sensitivity_class in ('S0', 'S1')
  and r.sensitivity_class in ('S0', 'S1')
  and p.sensitivity_class in ('S0', 'S1')
  and not exists (
    select 1
    from pac.revision_sources source_link
    join pac.source_items source on source.source_item_id = source_link.source_item_id
    where source_link.revision_id = r.revision_id
      and (
        source.sensitivity_class not in ('S0', 'S1')
        or source.ordinary_indexing_allowed is distinct from true
        or source.deidentification_status not in ('not_needed', 'verified')
      )
  )
  and not exists (
    select 1
    from pac.revision_assets asset_link
    join pac.assets asset on asset.asset_id = asset_link.asset_id
    where asset_link.revision_id = r.revision_id
      and asset.sensitivity_class not in ('S0', 'S1')
  );

create or replace function pac.read_staff_publications(
  requested_scope_id text,
  requested_content_item_id text default null
)
returns table (
  content_item_id text,
  revision_id uuid,
  scope_id text,
  canonical_payload jsonb,
  payload_sha256 text,
  decided_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
begin
  if not exists (
    select 1 from pac.program_scopes s
    where s.scope_id = requested_scope_id
      and s.active = true
      and s.scope_id <> 'one-dhs-pac'
  ) then
    raise exception 'Unknown or inactive staff scope: %', requested_scope_id using errcode = '22023';
  end if;

  return query
  with recursive visible_scopes as (
    select s.scope_id, s.parent_scope_id, 0 as distance
    from pac.program_scopes s
    where s.scope_id = requested_scope_id and s.active = true

    union all

    select parent.scope_id, parent.parent_scope_id, child.distance + 1
    from pac.program_scopes parent
    join visible_scopes child on parent.scope_id = child.parent_scope_id
    where parent.active = true and parent.scope_id <> 'one-dhs-pac'
  ),
  ranked as (
    select publication.content_item_id,
      publication.revision_id,
      publication.scope_id,
      publication.canonical_payload,
      publication.payload_sha256,
      publication.decided_at,
      row_number() over (
        partition by publication.content_item_id
        order by visible.distance asc, publication.decided_at desc, publication.revision_id desc
      ) as publication_rank
    from pac.current_staff_publications publication
    join visible_scopes visible on visible.scope_id = publication.scope_id
    where (requested_content_item_id is null or publication.content_item_id = requested_content_item_id)
      and publication.canonical_payload ->> 'status' = 'approved'
      and publication.sensitivity_class in ('S0', 'S1')
      and publication.unauthenticated_exposure_permitted = true
  )
  select ranked.content_item_id,
    ranked.revision_id,
    ranked.scope_id,
    ranked.canonical_payload,
    ranked.payload_sha256,
    ranked.decided_at
  from ranked
  where ranked.publication_rank = 1
  order by ranked.content_item_id;
end;
$$;

-- Distributed, privacy-minimized fixed-window rate limiter. The application
-- supplies only an HMAC subject hash; raw network identifiers are never stored.
create table if not exists pac.runtime_rate_limits (
  scope text not null check (
    scope in ('staff-ask', 'owner-login', 'consultation-intake', 'consultation-tracking')
  ),
  subject_hash text not null check (subject_hash ~ '^[a-f0-9]{64}$'),
  request_count integer not null check (request_count > 0),
  reset_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (scope, subject_hash)
);

alter table pac.runtime_rate_limits enable row level security;
revoke all privileges on pac.runtime_rate_limits from public;
revoke all privileges on pac.runtime_rate_limits from pac_app_runtime;

create or replace function pac.consume_runtime_rate_limit(
  requested_scope text,
  requested_subject_hash text,
  requested_limit integer,
  requested_window_seconds integer
)
returns table (allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
volatile
security definer
set search_path = pg_catalog, pac
set row_security = off
as $$
declare
  current_count integer;
  current_reset timestamptz;
begin
  if requested_subject_hash !~ '^[a-f0-9]{64}$'
    or not (
      (requested_scope = 'staff-ask' and requested_limit = 30 and requested_window_seconds = 600)
      or (requested_scope = 'owner-login' and requested_limit = 10 and requested_window_seconds = 900)
      or (requested_scope = 'consultation-intake' and requested_limit = 20 and requested_window_seconds = 3600)
      or (requested_scope = 'consultation-tracking' and requested_limit = 20 and requested_window_seconds = 600)
    )
  then
    raise exception 'Invalid rate-limit request' using errcode = '22023';
  end if;

  insert into pac.runtime_rate_limits (scope, subject_hash, request_count, reset_at)
  values (
    requested_scope,
    requested_subject_hash,
    1,
    clock_timestamp() + make_interval(secs => requested_window_seconds)
  )
  on conflict (scope, subject_hash) do update
  set request_count = case
        when pac.runtime_rate_limits.reset_at <= clock_timestamp() then 1
        else pac.runtime_rate_limits.request_count + 1
      end,
      reset_at = case
        when pac.runtime_rate_limits.reset_at <= clock_timestamp()
          then clock_timestamp() + make_interval(secs => requested_window_seconds)
        else pac.runtime_rate_limits.reset_at
      end,
      updated_at = clock_timestamp()
  returning request_count, pac.runtime_rate_limits.reset_at
  into current_count, current_reset;

  allowed := current_count <= requested_limit;
  remaining := greatest(0, requested_limit - current_count);
  reset_at := current_reset;
  return next;
end;
$$;

revoke all privileges on function pac.consume_runtime_rate_limit(text, text, integer, integer) from public;
grant execute on function pac.consume_runtime_rate_limit(text, text, integer, integer) to pac_app_runtime;

do $$
declare
  role_name text;
begin
  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      execute format('revoke all privileges on pac.participation_classes from %I', role_name);
      execute format('revoke all privileges on pac.retention_policies from %I', role_name);
      execute format('revoke all privileges on pac.runtime_rate_limits from %I', role_name);
    end if;
  end loop;
end;
$$;

revoke all privileges on pac.participation_classes from public, pac_app_runtime;
revoke all privileges on pac.retention_policies from public, pac_app_runtime;
revoke all privileges on function pac.assert_no_prohibited_profile_fields(jsonb) from public, pac_app_runtime;
revoke all privileges on function pac.reject_prohibited_profile_row() from public, pac_app_runtime;
revoke all privileges on function pac.enforce_data_trust_publication_gate() from public, pac_app_runtime;

comment on table pac.participation_classes is 'Canonical DEC-007 participation classes. Active experience notices are versioned in application contracts.';
comment on table pac.retention_policies is 'Protected-record lifecycles. A policy cannot become approved without retention, correction, deletion, recovery, incident, and approval evidence.';
comment on table pac.runtime_rate_limits is 'Short-lived abuse counters keyed by an application-generated HMAC; raw network identifiers are prohibited.';

commit;
