begin;

do $$
declare
  role_is_safe boolean;
begin
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_app_runtime') then
    create role pac_app_runtime
      login
      noinherit
      nosuperuser
      nocreatedb
      nocreaterole
      noreplication
      nobypassrls
      connection limit 20;
  end if;

  select
    rolcanlogin
    and not rolinherit
    and not rolsuper
    and not rolcreatedb
    and not rolcreaterole
    and not rolreplication
    and not rolbypassrls
    and rolconnlimit between 1 and 20
  into role_is_safe
  from pg_catalog.pg_roles
  where rolname = 'pac_app_runtime';

  if role_is_safe is distinct from true then
    raise exception using
      errcode = '42501',
      message = 'Existing pac_app_runtime role is not safe for application use';
  end if;

  if exists (
    select 1
    from pg_catalog.pg_auth_members memberships
    join pg_catalog.pg_roles member_role on member_role.oid = memberships.member
    where member_role.rolname = 'pac_app_runtime'
  ) then
    raise exception using
      errcode = '42501',
      message = 'Existing pac_app_runtime role has role memberships and is not safe for application use';
  end if;
end;
$$;

alter role pac_app_runtime set statement_timeout = '15s';
alter role pac_app_runtime set lock_timeout = '5s';
alter role pac_app_runtime set idle_in_transaction_session_timeout = '10s';
alter role pac_app_runtime set search_path = pac, pg_catalog;

-- Role attributes are intentionally fixed at creation time. Existing roles are
-- validated above rather than altered, which preserves Supabase's supautils boundary.
create table if not exists pac.runtime_work_objects (
  work_kind text not null check (
    work_kind in ('consult_request', 'decision', 'eval_result', 'collaboration_workspace')
  ),
  object_id text not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (work_kind, object_id)
);

create index if not exists runtime_work_objects_kind_created_idx
  on pac.runtime_work_objects(work_kind, created_at, object_id);

create table if not exists pac.runtime_idempotency (
  idempotency_key text primary key,
  work_kind text not null check (
    work_kind in ('consult_request', 'decision', 'eval_result', 'collaboration_workspace')
  ),
  object_id text not null,
  value jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists pac.runtime_audit_events (
  audit_id bigint generated always as identity primary key,
  event jsonb not null,
  occurred_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  check (jsonb_typeof(event) = 'object')
);

create index if not exists runtime_audit_events_order_idx
  on pac.runtime_audit_events(audit_id desc);

create table if not exists pac.runtime_counters (
  scope text primary key,
  counter_value bigint not null check (counter_value > 0),
  updated_at timestamptz not null default now()
);

drop trigger if exists immutable_guard on pac.runtime_idempotency;
create trigger immutable_guard
before update or delete on pac.runtime_idempotency
for each row execute function pac.prevent_immutable_change();

drop trigger if exists immutable_guard on pac.runtime_audit_events;
create trigger immutable_guard
before update or delete on pac.runtime_audit_events
for each row execute function pac.prevent_immutable_change();

alter table pac.runtime_work_objects enable row level security;
alter table pac.runtime_idempotency enable row level security;
alter table pac.runtime_audit_events enable row level security;
alter table pac.runtime_counters enable row level security;

revoke all privileges on pac.runtime_work_objects from public;
revoke all privileges on pac.runtime_idempotency from public;
revoke all privileges on pac.runtime_audit_events from public;
revoke all privileges on pac.runtime_counters from public;
revoke all privileges on sequence pac.runtime_audit_events_audit_id_seq from public;

revoke all privileges on schema pac from pac_app_runtime;
revoke all privileges on all tables in schema pac from pac_app_runtime;
revoke all privileges on all sequences in schema pac from pac_app_runtime;
revoke all privileges on all functions in schema pac from pac_app_runtime;

grant usage on schema pac to pac_app_runtime;
grant select, insert, update on pac.runtime_work_objects to pac_app_runtime;
grant select, insert on pac.runtime_idempotency to pac_app_runtime;
grant select, insert on pac.runtime_audit_events to pac_app_runtime;
grant select, insert, update on pac.runtime_counters to pac_app_runtime;
grant usage, select on sequence pac.runtime_audit_events_audit_id_seq to pac_app_runtime;

do $$
begin
  execute format('grant connect on database %I to pac_app_runtime', current_database());
end;
$$;

drop policy if exists pac_runtime_read on pac.runtime_work_objects;
create policy pac_runtime_read on pac.runtime_work_objects
  for select to pac_app_runtime using (true);
drop policy if exists pac_runtime_insert on pac.runtime_work_objects;
create policy pac_runtime_insert on pac.runtime_work_objects
  for insert to pac_app_runtime with check (true);
drop policy if exists pac_runtime_update on pac.runtime_work_objects;
create policy pac_runtime_update on pac.runtime_work_objects
  for update to pac_app_runtime using (true) with check (true);

drop policy if exists pac_runtime_read on pac.runtime_idempotency;
create policy pac_runtime_read on pac.runtime_idempotency
  for select to pac_app_runtime using (true);
drop policy if exists pac_runtime_insert on pac.runtime_idempotency;
create policy pac_runtime_insert on pac.runtime_idempotency
  for insert to pac_app_runtime with check (true);

drop policy if exists pac_runtime_read on pac.runtime_audit_events;
create policy pac_runtime_read on pac.runtime_audit_events
  for select to pac_app_runtime using (true);
drop policy if exists pac_runtime_insert on pac.runtime_audit_events;
create policy pac_runtime_insert on pac.runtime_audit_events
  for insert to pac_app_runtime with check (true);

drop policy if exists pac_runtime_read on pac.runtime_counters;
create policy pac_runtime_read on pac.runtime_counters
  for select to pac_app_runtime using (true);
drop policy if exists pac_runtime_insert on pac.runtime_counters;
create policy pac_runtime_insert on pac.runtime_counters
  for insert to pac_app_runtime with check (true);
drop policy if exists pac_runtime_update on pac.runtime_counters;
create policy pac_runtime_update on pac.runtime_counters
  for update to pac_app_runtime using (true) with check (true);

do $$
declare
  role_name text;
begin
  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_catalog.pg_roles where rolname = role_name) then
      execute format('revoke all privileges on pac.runtime_work_objects from %I', role_name);
      execute format('revoke all privileges on pac.runtime_idempotency from %I', role_name);
      execute format('revoke all privileges on pac.runtime_audit_events from %I', role_name);
      execute format('revoke all privileges on pac.runtime_counters from %I', role_name);
      execute format('revoke all privileges on sequence pac.runtime_audit_events_audit_id_seq from %I', role_name);
    end if;
  end loop;
end;
$$;

comment on table pac.runtime_work_objects is 'Server-side durable program work objects. Browser roles receive no access.';
comment on table pac.runtime_idempotency is 'Server-side immutable receipts for exactly-once work-object mutations.';
comment on table pac.runtime_audit_events is 'Server-side append-only activity records for governed program actions.';
comment on table pac.runtime_counters is 'Server-side atomic counters used for stable program identifiers.';

commit;