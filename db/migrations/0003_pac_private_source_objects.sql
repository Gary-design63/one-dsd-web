begin;

-- A source carrier is immutable. Object-storage placement is recorded separately so
-- a carrier can gain verified original and derived representations without rewrite.
create table if not exists pac.source_carrier_locations (
  location_id uuid primary key,
  carrier_id uuid not null references pac.source_carriers(carrier_id),
  representation_kind text not null check (
    representation_kind in ('original', 'derived_snapshot', 'repository_source')
  ),
  storage_provider text not null check (storage_provider = 'supabase_storage'),
  bucket_name text not null,
  object_key text not null,
  media_type text not null,
  byte_count bigint not null check (byte_count >= 0),
  sha256 text not null check (sha256 ~ '^[0-9a-fA-F]{64}$'),
  verification_method text not null check (verification_method = 'download_sha256_and_byte_count'),
  verified_at timestamptz not null,
  recorded_at timestamptz not null,
  recorded_by text not null,
  unique (carrier_id, representation_kind, storage_provider, bucket_name, object_key),
  unique (carrier_id, representation_kind, storage_provider, bucket_name, sha256, byte_count)
);

create index if not exists source_carrier_locations_carrier_idx
  on pac.source_carrier_locations(carrier_id, representation_kind, recorded_at desc);
create index if not exists source_carrier_locations_object_idx
  on pac.source_carrier_locations(storage_provider, bucket_name, object_key);

-- Holds account for unavailable originals without manufacturing a storage
-- location. A hold can point to a known carrier or directly to a source item whose
-- original has not yet been recovered.
create table if not exists pac.source_binary_holds (
  hold_id uuid primary key,
  carrier_id uuid references pac.source_carriers(carrier_id),
  source_item_id text references pac.source_items(source_item_id),
  hold_kind text not null check (
    hold_kind in (
      'external_only',
      'missing_original',
      'directory_requires_manifest',
      'original_not_locally_available',
      'manual_extraction_required',
      'transcript_required',
      'quarantined_never_execute'
    )
  ),
  detail jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null,
  recorded_by text not null,
  check (carrier_id is not null or source_item_id is not null),
  unique (carrier_id, source_item_id, hold_kind)
);

create index if not exists source_binary_holds_carrier_idx
  on pac.source_binary_holds(carrier_id, recorded_at desc);
create index if not exists source_binary_holds_source_idx
  on pac.source_binary_holds(source_item_id, recorded_at desc);
create unique index if not exists source_binary_holds_identity_idx
  on pac.source_binary_holds(
    coalesce(carrier_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(source_item_id, ''),
    hold_kind
  );

drop trigger if exists immutable_guard on pac.source_carrier_locations;
create trigger immutable_guard
before update or delete on pac.source_carrier_locations
for each row execute function pac.prevent_immutable_change();

drop trigger if exists immutable_guard on pac.source_binary_holds;
create trigger immutable_guard
before update or delete on pac.source_binary_holds
for each row execute function pac.prevent_immutable_change();

alter table pac.source_carrier_locations enable row level security;
alter table pac.source_binary_holds enable row level security;

revoke all privileges on pac.source_carrier_locations from public;
revoke all privileges on pac.source_binary_holds from public;

do $$
declare
  role_name text;
begin
  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      execute format('revoke all privileges on pac.source_carrier_locations from %I', role_name);
      execute format('revoke all privileges on pac.source_binary_holds from %I', role_name);
    end if;
  end loop;
end;
$$;

comment on table pac.source_carrier_locations is
  'Append-only, server-only record of hash-verified private object representations for immutable source carriers.';
comment on table pac.source_binary_holds is
  'Append-only accounting for source originals that are external, missing, quarantined, or otherwise not yet stored.';

commit;
