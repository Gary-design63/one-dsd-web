begin;

create extension if not exists pgcrypto;
create schema if not exists pac;

create table if not exists pac.schema_migrations (
  migration_name text primary key,
  migration_sha256 text not null check (migration_sha256 ~ '^[0-9a-fA-F]{64}$'),
  applied_at timestamptz not null default now(),
  applied_by text not null
);

create table if not exists pac.program_scopes (
  scope_id text primary key,
  parent_scope_id text references pac.program_scopes(scope_id),
  scope_kind text not null check (scope_kind in ('program', 'agency', 'administration', 'division', 'team')),
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (parent_scope_id is null or parent_scope_id <> scope_id)
);

insert into pac.program_scopes (scope_id, parent_scope_id, scope_kind, name)
values
  ('one-dhs-pac', null, 'program', 'One DHS People, Access and Culture Program'),
  ('one-dhs', 'one-dhs-pac', 'agency', 'One DHS agencywide'),
  ('adsa', 'one-dhs', 'administration', 'Aging and Disability Services Administration'),
  ('dsd', 'adsa', 'division', 'Disability Services Division'),
  ('one-dsd-team', 'dsd', 'team', 'One DSD Team')
on conflict (scope_id) do nothing;

create table if not exists pac.ingest_runs (
  ingest_run_id uuid primary key default gen_random_uuid(),
  source_set_id text not null,
  source_manifest_sha256 text,
  importer_version text not null,
  expected_counts jsonb not null,
  actual_counts jsonb,
  status text not null check (status in ('started', 'validated', 'failed', 'promoted', 'rolled_back')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  initiated_by text not null,
  failure_detail text,
  constraint ingest_manifest_sha256 check (source_manifest_sha256 is null or source_manifest_sha256 ~ '^[0-9a-fA-F]{64}$')
);

create index if not exists ingest_runs_source_set_idx
  on pac.ingest_runs(source_set_id, started_at desc);

create table if not exists pac.source_carriers (
  carrier_id uuid primary key default gen_random_uuid(),
  logical_key text not null unique,
  media_type text not null,
  original_name text,
  byte_count bigint check (byte_count is null or byte_count >= 0),
  raw_blob_sha256 text,
  storage_key text,
  external_locator jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  captured_by text not null,
  constraint source_carrier_sha256 check (raw_blob_sha256 is null or raw_blob_sha256 ~ '^[0-9a-fA-F]{64}$')
);

create table if not exists pac.source_items (
  source_item_id text primary key,
  source_business_id text not null,
  carrier_id uuid references pac.source_carriers(carrier_id),
  source_version text not null default '1',
  source_pointer text,
  title text not null,
  normalized_payload jsonb not null,
  normalized_item_sha256 text not null,
  hash_algorithm text not null,
  hash_algorithm_version text not null,
  owner_approval_status text not null check (
    owner_approval_status in ('owner_approved_for_ingestion', 'owner_approved_for_ingestion_when_recovered')
  ),
  accounting_status text not null check (
    accounting_status in ('accounted', 'accounted_awaiting_source')
  ),
  access_scope text not null check (
    access_scope in ('internal_source', 'consultant', 'scope_controlled', 'staff_candidate')
  ),
  created_at timestamptz not null default now(),
  import_batch_id uuid references pac.ingest_runs(ingest_run_id),
  constraint source_item_sha256 check (normalized_item_sha256 ~ '^[0-9a-fA-F]{64}$'),
  unique (carrier_id, source_pointer, source_version),
  unique (source_business_id, source_version)
);

create table if not exists pac.ingest_entries (
  ingest_entry_id uuid primary key default gen_random_uuid(),
  ingest_run_id uuid not null references pac.ingest_runs(ingest_run_id),
  source_item_id text,
  business_id text not null,
  action text not null check (action in ('inserted', 'exact_replay', 'linked', 'skipped_missing', 'conflict', 'rejected')),
  expected_sha256 text,
  actual_sha256 text,
  detail jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  constraint ingest_expected_sha256 check (expected_sha256 is null or expected_sha256 ~ '^[0-9a-fA-F]{64}$'),
  constraint ingest_actual_sha256 check (actual_sha256 is null or actual_sha256 ~ '^[0-9a-fA-F]{64}$')
);

create index if not exists ingest_entries_run_idx on pac.ingest_entries(ingest_run_id);
create index if not exists ingest_entries_business_idx on pac.ingest_entries(business_id);

create table if not exists pac.source_receipts (
  receipt_id text primary key,
  source_item_id text not null references pac.source_items(source_item_id),
  disposition text not null check (
    disposition in ('active_retain', 'active_revise', 'component_merge', 'internal_reclassify', 'consultant_restrict')
  ),
  canonical_family_id text,
  canonical_item_id text,
  decision_payload jsonb not null,
  decision_sha256 text not null,
  decided_at timestamptz not null,
  decided_by text not null,
  release_commit text,
  release_manifest_sha256 text,
  constraint receipt_decision_sha256 check (decision_sha256 ~ '^[0-9a-fA-F]{64}$'),
  constraint receipt_manifest_sha256 check (release_manifest_sha256 is null or release_manifest_sha256 ~ '^[0-9a-fA-F]{64}$')
);

create index if not exists source_receipts_source_idx on pac.source_receipts(source_item_id);
create index if not exists source_receipts_family_idx on pac.source_receipts(canonical_family_id);

create table if not exists pac.source_review_records (
  source_review_id uuid primary key default gen_random_uuid(),
  source_item_id text not null references pac.source_items(source_item_id),
  dimension text not null check (
    dimension in ('language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement', 'rights_and_consent', 'community_representation', 'legal_policy')
  ),
  status text not null check (status in ('pending', 'pass', 'revise', 'blocked', 'not_applicable')),
  reviewer_role text not null,
  reviewer_id text,
  findings jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  supersedes_source_review_id uuid references pac.source_review_records(source_review_id),
  import_batch_id uuid references pac.ingest_runs(ingest_run_id)
);

create index if not exists source_review_records_lookup_idx
  on pac.source_review_records(source_item_id, dimension, recorded_at desc);

create or replace view pac.current_source_reviews
with (security_invoker = true) as
select source_item_id, dimension, status, reviewer_role, reviewer_id, findings, recorded_at
from (
  select r.*,
    row_number() over (partition by source_item_id, dimension order by recorded_at desc, source_review_id desc) as row_rank
  from pac.source_review_records r
) ranked
where row_rank = 1;

create table if not exists pac.content_collections (
  collection_id text primary key,
  name text not null,
  purpose text not null,
  preservation_rule text not null check (preservation_rule in ('append_only', 'replaceable_view')),
  created_at timestamptz not null default now(),
  created_by text not null
);

create table if not exists pac.content_items (
  content_item_id text primary key,
  content_kind text not null check (
    content_kind in ('resource', 'learning_module', 'course', 'lesson', 'community_brief', 'observance', 'path', 'question_bank', 'media', 'family', 'internal')
  ),
  default_scope_id text not null references pac.program_scopes(scope_id),
  staff_label text not null,
  restricted boolean not null default false,
  created_at timestamptz not null default now(),
  created_by text not null,
  retired_at timestamptz,
  retired_by text
);

create table if not exists pac.content_revisions (
  revision_id uuid primary key default gen_random_uuid(),
  content_item_id text not null references pac.content_items(content_item_id),
  revision_number integer not null check (revision_number > 0),
  canonical_payload jsonb not null,
  payload_sha256 text generated always as (
    encode(digest(canonical_payload::text, 'sha256'), 'hex')
  ) stored,
  change_summary text not null,
  required_review_dimensions text[] not null default array[
    'language_alignment',
    'factual_currentness',
    'accessibility',
    'scope',
    'placement'
  ]::text[],
  created_at timestamptz not null default now(),
  created_by text not null,
  based_on_revision_id uuid references pac.content_revisions(revision_id),
  import_batch_id uuid references pac.ingest_runs(ingest_run_id),
  unique (content_item_id, revision_number),
  unique (content_item_id, payload_sha256)
);

create index if not exists content_revisions_item_idx on pac.content_revisions(content_item_id, revision_number desc);

create table if not exists pac.revision_sources (
  revision_id uuid not null references pac.content_revisions(revision_id),
  source_item_id text not null references pac.source_items(source_item_id),
  relationship text not null check (relationship in ('primary', 'evidence', 'adapted_from', 'merged_component', 'supersedes')),
  note text,
  primary key (revision_id, source_item_id, relationship)
);

create table if not exists pac.content_aliases (
  alias_id uuid primary key default gen_random_uuid(),
  content_item_id text not null references pac.content_items(content_item_id),
  alias text not null,
  alias_kind text not null check (alias_kind in ('former_id', 'former_title', 'owner_phrase', 'search_term', 'source_id')),
  created_at timestamptz not null default now(),
  unique (content_item_id, alias, alias_kind)
);

create table if not exists pac.collection_membership_decisions (
  decision_id bigint generated always as identity primary key,
  collection_id text not null references pac.content_collections(collection_id),
  content_item_id text not null references pac.content_items(content_item_id),
  action text not null check (action in ('add', 'remove')),
  decided_at timestamptz not null default now(),
  decided_by text not null,
  reason text not null,
  ingest_run_id uuid references pac.ingest_runs(ingest_run_id)
);

create index if not exists collection_membership_lookup_idx
  on pac.collection_membership_decisions(collection_id, content_item_id, decision_id desc);

create or replace view pac.staged_collection_memberships
with (security_invoker = true) as
select collection_id, content_item_id, decided_at, decided_by, reason, ingest_run_id
from (
  select d.*,
    row_number() over (partition by collection_id, content_item_id order by decision_id desc) as row_rank
  from pac.collection_membership_decisions d
  join pac.ingest_runs r on r.ingest_run_id = d.ingest_run_id
  where r.status in ('started', 'validated')
) ranked
where row_rank = 1 and action = 'add';

create or replace view pac.current_collection_memberships
with (security_invoker = true) as
select collection_id, content_item_id, decided_at, decided_by, reason, ingest_run_id
from (
  select d.*,
    row_number() over (partition by collection_id, content_item_id order by decision_id desc) as row_rank
  from pac.collection_membership_decisions d
  left join pac.ingest_runs r on r.ingest_run_id = d.ingest_run_id
  where d.ingest_run_id is null or r.status = 'promoted'
) ranked
where row_rank = 1 and action = 'add';

create table if not exists pac.review_records (
  review_id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references pac.content_revisions(revision_id),
  dimension text not null check (
    dimension in ('language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement', 'rights_and_consent', 'community_representation', 'legal_policy')
  ),
  status text not null check (status in ('pending', 'pass', 'revise', 'blocked', 'not_applicable')),
  reviewer_role text not null,
  reviewer_id text,
  findings jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  supersedes_review_id uuid references pac.review_records(review_id)
);

create index if not exists review_records_revision_idx on pac.review_records(revision_id, dimension, recorded_at desc);

create or replace view pac.current_revision_reviews
with (security_invoker = true) as
select revision_id, dimension, status, reviewer_role, reviewer_id, findings, recorded_at
from (
  select r.*,
    row_number() over (partition by revision_id, dimension order by recorded_at desc, review_id desc) as row_rank
  from pac.review_records r
) ranked
where row_rank = 1;

create table if not exists pac.publication_decisions (
  publication_decision_id bigint generated always as identity primary key,
  content_item_id text not null references pac.content_items(content_item_id),
  revision_id uuid not null references pac.content_revisions(revision_id),
  scope_id text not null references pac.program_scopes(scope_id),
  decision text not null check (decision in ('preview', 'publish', 'withdraw')),
  gate_snapshot jsonb not null,
  decided_at timestamptz not null default now(),
  decided_by text not null,
  reason text not null
);

create index if not exists publication_decisions_lookup_idx
  on pac.publication_decisions(content_item_id, scope_id, publication_decision_id desc);

create or replace function pac.enforce_publication_gate()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
declare
  revision_item_id text;
  required_dimension text;
  latest_status text;
  linked_sources integer;
  unapproved_sources integer;
begin
  select content_item_id into revision_item_id
  from pac.content_revisions
  where revision_id = new.revision_id;

  if revision_item_id is distinct from new.content_item_id then
    raise exception 'Revision % does not belong to content item %', new.revision_id, new.content_item_id;
  end if;

  if new.decision <> 'publish' then
    return new;
  end if;

  for required_dimension in
    select unnest(required_review_dimensions)
    from pac.content_revisions
    where revision_id = new.revision_id
  loop
    select status into latest_status
    from pac.current_revision_reviews
    where revision_id = new.revision_id and dimension = required_dimension;

    if latest_status is null or latest_status not in ('pass', 'not_applicable') then
      raise exception 'Revision % cannot publish: % review is %',
        new.revision_id, required_dimension, coalesce(latest_status, 'missing');
    end if;
  end loop;

  select count(*) into linked_sources
  from pac.revision_sources
  where revision_id = new.revision_id;

  if linked_sources = 0 then
    raise exception 'Revision % cannot publish: no accounted source is linked', new.revision_id;
  end if;

  select count(*) into unapproved_sources
  from pac.revision_sources rs
  join pac.source_items si on si.source_item_id = rs.source_item_id
  where rs.revision_id = new.revision_id
    and (
      si.owner_approval_status <> 'owner_approved_for_ingestion'
      or si.accounting_status <> 'accounted'
    );

  if unapproved_sources > 0 then
    raise exception 'Revision % cannot publish: a linked source is missing or not approved for ingestion', new.revision_id;
  end if;

  return new;
end;
$$;

drop trigger if exists publication_gate on pac.publication_decisions;
create trigger publication_gate
before insert on pac.publication_decisions
for each row execute function pac.enforce_publication_gate();

create or replace view pac.current_publications
with (security_invoker = true) as
select content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_at, decided_by, reason
from (
  select d.*,
    row_number() over (partition by content_item_id, scope_id order by publication_decision_id desc) as row_rank
  from pac.publication_decisions d
) ranked
where row_rank = 1 and decision = 'publish';

create or replace view pac.current_staff_publications
with (security_invoker = true) as
select p.content_item_id, p.revision_id, p.scope_id, p.gate_snapshot, p.decided_at,
  i.content_kind, i.staff_label, r.canonical_payload, r.payload_sha256
from pac.current_publications p
join pac.content_items i on i.content_item_id = p.content_item_id
join pac.content_revisions r on r.revision_id = p.revision_id
where i.restricted = false and i.retired_at is null;

create table if not exists pac.assets (
  asset_id uuid primary key default gen_random_uuid(),
  logical_key text not null,
  revision_number integer not null check (revision_number > 0),
  object_key text not null unique,
  media_type text not null,
  byte_count bigint not null check (byte_count >= 0),
  sha256 text not null,
  rights_status text not null check (rights_status in ('pending', 'cleared', 'restricted', 'not_applicable')),
  accessibility_status text not null check (accessibility_status in ('pending', 'pass', 'revise', 'not_applicable')),
  created_at timestamptz not null default now(),
  created_by text not null,
  unique (logical_key, revision_number),
  unique (sha256, byte_count),
  constraint asset_sha256 check (sha256 ~ '^[0-9a-fA-F]{64}$')
);

create table if not exists pac.revision_assets (
  revision_id uuid not null references pac.content_revisions(revision_id),
  asset_id uuid not null references pac.assets(asset_id),
  purpose text not null check (purpose in ('primary', 'audio', 'transcript', 'caption', 'thumbnail', 'download', 'source', 'supplement')),
  staff_label text,
  sort_order integer not null default 0,
  primary key (revision_id, asset_id, purpose)
);

create table if not exists pac.content_relations (
  relation_id uuid primary key default gen_random_uuid(),
  from_content_item_id text not null references pac.content_items(content_item_id),
  to_content_item_id text not null references pac.content_items(content_item_id),
  relation_type text not null check (
    relation_type in ('part_of', 'supports', 'prerequisite_for', 'related_to', 'supersedes', 'applies_to', 'evidence_for')
  ),
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  review_status text not null check (review_status in ('candidate', 'reviewed', 'rejected')),
  created_at timestamptz not null default now(),
  created_by text not null,
  check (from_content_item_id <> to_content_item_id),
  unique (from_content_item_id, to_content_item_id, relation_type)
);

create table if not exists pac.search_chunks (
  chunk_id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references pac.content_revisions(revision_id),
  chunk_index integer not null check (chunk_index >= 0),
  text_content text not null,
  token_count integer check (token_count is null or token_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  text_sha256 text generated always as (
    encode(digest(text_content, 'sha256'), 'hex')
  ) stored,
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(text_content, ''))
  ) stored,
  unique (revision_id, chunk_index),
  unique (revision_id, text_sha256)
);

create index if not exists search_chunks_vector_idx on pac.search_chunks using gin(search_vector);
create index if not exists search_chunks_revision_idx on pac.search_chunks(revision_id);

create table if not exists pac.search_embeddings (
  embedding_id uuid primary key default gen_random_uuid(),
  chunk_id uuid not null references pac.search_chunks(chunk_id),
  provider_key text not null,
  model_key text not null,
  dimensions integer not null check (dimensions > 0),
  embedding_values double precision[] not null,
  created_at timestamptz not null default now(),
  unique (chunk_id, provider_key, model_key),
  check (array_length(embedding_values, 1) = dimensions)
);

create table if not exists pac.knowledge_nodes (
  node_id text primary key,
  node_type text not null,
  label text not null,
  scope_id text references pac.program_scopes(scope_id),
  content_item_id text references pac.content_items(content_item_id),
  source_item_id text references pac.source_items(source_item_id),
  properties jsonb not null default '{}'::jsonb,
  review_status text not null check (review_status in ('candidate', 'reviewed', 'rejected')),
  trust_score numeric(5,4) check (trust_score is null or (trust_score >= 0 and trust_score <= 1)),
  created_at timestamptz not null default now(),
  created_by text not null
);

create index if not exists knowledge_nodes_type_idx on pac.knowledge_nodes(node_type);
create index if not exists knowledge_nodes_content_idx on pac.knowledge_nodes(content_item_id);

create table if not exists pac.knowledge_edges (
  edge_id text primary key,
  from_node_id text not null references pac.knowledge_nodes(node_id),
  to_node_id text not null references pac.knowledge_nodes(node_id),
  edge_type text not null,
  direction text not null default 'directed' check (direction in ('directed', 'undirected')),
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  review_status text not null check (review_status in ('candidate', 'reviewed', 'rejected')),
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  created_by text not null,
  check (from_node_id <> to_node_id)
);

create index if not exists knowledge_edges_from_idx on pac.knowledge_edges(from_node_id, edge_type);
create index if not exists knowledge_edges_to_idx on pac.knowledge_edges(to_node_id, edge_type);

create table if not exists pac.knowledge_edge_evidence (
  evidence_id uuid primary key default gen_random_uuid(),
  edge_id text not null references pac.knowledge_edges(edge_id),
  source_item_id text not null references pac.source_items(source_item_id),
  revision_id uuid references pac.content_revisions(revision_id),
  evidence_note text not null
);

create index if not exists knowledge_edge_evidence_edge_idx on pac.knowledge_edge_evidence(edge_id);
create unique index if not exists knowledge_edge_evidence_unique_idx
  on pac.knowledge_edge_evidence(edge_id, source_item_id, coalesce(revision_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table if not exists pac.graph_snapshots (
  snapshot_id uuid primary key default gen_random_uuid(),
  snapshot_label text not null,
  source_manifest_sha256 text not null,
  node_count integer not null check (node_count >= 0),
  edge_count integer not null check (edge_count >= 0),
  trusted_node_count integer not null check (trusted_node_count >= 0 and trusted_node_count <= node_count),
  created_at timestamptz not null default now(),
  created_by text not null,
  constraint graph_snapshot_sha256 check (source_manifest_sha256 ~ '^[0-9a-fA-F]{64}$')
);

create table if not exists pac.access_grants (
  grant_id uuid primary key default gen_random_uuid(),
  principal_id text not null,
  scope_id text not null references pac.program_scopes(scope_id),
  role_key text not null check (role_key in ('staff_user', 'content_contributor', 'publishing_approver', 'program_steward', 'owner')),
  granted_at timestamptz not null default now(),
  granted_by text not null,
  revoked_at timestamptz,
  revoked_by text,
  unique (principal_id, scope_id, role_key, granted_at)
);

create unique index if not exists access_grants_one_active_role_idx
  on pac.access_grants(principal_id, scope_id, role_key)
  where revoked_at is null;

create table if not exists pac.change_events (
  event_id bigint generated always as identity primary key,
  actor_id text not null,
  actor_role text not null,
  scope_id text references pac.program_scopes(scope_id),
  object_type text not null,
  object_id text not null,
  action text not null,
  detail jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists change_events_object_idx on pac.change_events(object_type, object_id, occurred_at desc);

create or replace function pac.prevent_immutable_change()
returns trigger
language plpgsql
set search_path = pg_catalog, pac
as $$
begin
  if current_setting('pac.allow_immutable_change', true) = 'on' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;
  raise exception '% is append-only; create a new record instead', tg_table_name;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'source_carriers',
    'source_items',
    'source_receipts',
    'source_review_records',
    'ingest_entries',
    'content_revisions',
    'revision_sources',
    'content_aliases',
    'collection_membership_decisions',
    'review_records',
    'publication_decisions',
    'assets',
    'revision_assets',
    'content_relations',
    'search_chunks',
    'search_embeddings',
    'knowledge_nodes',
    'knowledge_edges',
    'knowledge_edge_evidence',
    'graph_snapshots',
    'change_events'
  ]
  loop
    execute format('drop trigger if exists immutable_guard on pac.%I', table_name);
    execute format(
      'create trigger immutable_guard before update or delete on pac.%I for each row execute function pac.prevent_immutable_change()',
      table_name
    );
  end loop;
end;
$$;

-- Defense in depth for Supabase/PostgREST deployments. The pac schema is
-- server-only and must not be added to the project's exposed API schemas.
-- RLS has no client policies by design. The migration owner (or a dedicated
-- server role with BYPASSRLS) performs controlled imports and app-server reads.
do $$
declare
  table_name text;
begin
  for table_name in
    select tablename from pg_catalog.pg_tables where schemaname = 'pac'
  loop
    execute format('alter table pac.%I enable row level security', table_name);
  end loop;
end;
$$;

revoke all privileges on schema pac from public;
revoke all privileges on all tables in schema pac from public;
revoke all privileges on all sequences in schema pac from public;
revoke all privileges on all functions in schema pac from public;

alter default privileges in schema pac revoke all privileges on tables from public;
alter default privileges in schema pac revoke all privileges on sequences from public;
alter default privileges in schema pac revoke all privileges on functions from public;
alter default privileges in schema pac revoke all privileges on types from public;

do $$
declare
  role_name text;
begin
  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      execute format('revoke all privileges on schema pac from %I', role_name);
      execute format('revoke all privileges on all tables in schema pac from %I', role_name);
      execute format('revoke all privileges on all sequences in schema pac from %I', role_name);
      execute format('revoke all privileges on all functions in schema pac from %I', role_name);
    end if;
  end loop;
end;
$$;

comment on schema pac is 'Internal durable content, review, publication, search, and graph foundation for the federated PAC program.';
comment on table pac.source_items is 'Internal source accounting. These rows are never staff publication records.';
comment on table pac.content_revisions is 'Immutable, editable-by-new-revision content payloads.';
comment on view pac.current_publications is 'Internal publication decision view. It is not granted to browser or Supabase client roles.';
comment on view pac.current_staff_publications is 'Server-side retrieval boundary. App code must still enforce the requesting staff member''s scope; never expose this schema through PostgREST.';

commit;
