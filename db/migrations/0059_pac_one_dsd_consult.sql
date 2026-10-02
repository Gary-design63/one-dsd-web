begin;

-- One DSD Consult: the consultant request queue.
-- Every request is a matter of record with an owner, a plain status, and a
-- visible history. Four tables: requests, an append-only event history, the
-- people who may follow requests (supervisors, managers, deputy director,
-- division director), and a notice outbox. Access tokens are stored only as
-- SHA-256 hashes. The restricted runtime role receives table grants only.

create table pac.consult_requests (
  id text primary key check (id ~ '^DC-[0-9]{8}-[0-9]{4,8}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  requester_name text not null check (length(btrim(requester_name)) between 1 and 120),
  requester_email text not null check (requester_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and length(requester_email) <= 254),
  requester_unit text check (requester_unit is null or length(requester_unit) <= 160),
  supervisor_name text not null check (length(btrim(supervisor_name)) between 1 and 120),
  supervisor_email text not null check (supervisor_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and length(supervisor_email) <= 254),
  manager_email text check (manager_email is null or (manager_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and length(manager_email) <= 254)),
  work_title text not null check (length(btrim(work_title)) between 1 and 200),
  support_type text not null check (support_type in ('scoping_goals','equity_embed_review','access_language_check','stakeholder_partner_map','facilitation_prep','policy_or_program_review','other')),
  timing text not null check (timing in ('exploratory','within_2_weeks','hard_deadline','live_urgent')),
  situation text not null check (length(btrim(situation)) between 1 and 4000),
  goals text not null check (length(btrim(goals)) between 1 and 2000),
  status text not null default 'received' check (status in ('received','acknowledged','in_progress','waiting_on_requester','referred','resolved','withdrawn')),
  owner_name text check (owner_name is null or length(owner_name) <= 120),
  acknowledgment_due_at timestamptz not null,
  acknowledged_at timestamptz,
  referred_to text check (referred_to is null or length(referred_to) <= 200),
  outcome text check (outcome is null or length(outcome) <= 1000),
  closed_at timestamptz,
  requester_token_hash text not null check (requester_token_hash ~ '^[0-9a-f]{64}$'),
  check ((status in ('resolved','withdrawn')) = (closed_at is not null)),
  check (status <> 'resolved' or outcome is not null),
  check (status <> 'referred' or referred_to is not null)
);

create index consult_requests_status_idx on pac.consult_requests(status, created_at desc);
create index consult_requests_supervisor_idx on pac.consult_requests(lower(supervisor_email));
create index consult_requests_manager_idx on pac.consult_requests(lower(manager_email));
create index consult_requests_token_idx on pac.consult_requests(requester_token_hash);

create table pac.consult_events (
  event_id bigint generated always as identity primary key,
  request_id text not null references pac.consult_requests(id),
  occurred_at timestamptz not null default now(),
  actor text not null check (actor in ('requester','consultant','system')),
  kind text not null check (kind in ('submitted','acknowledged','status_changed','owner_assigned','referred','outcome_recorded','note','withdrawn','overdue_flagged','notice_queued')),
  from_status text,
  to_status text,
  note text check (note is null or length(note) <= 1000),
  visible_to_requester boolean not null default true
);

create index consult_events_request_idx on pac.consult_events(request_id, event_id);

create table pac.consult_people (
  email text primary key check (email = lower(email) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and length(email) <= 254),
  display_name text check (display_name is null or length(display_name) <= 120),
  role text not null check (role in ('supervisor','manager','deputy_director','division_director')),
  access_token_hash text not null check (access_token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  token_issued_at timestamptz not null default now(),
  revoked_at timestamptz
);

create unique index consult_people_token_idx on pac.consult_people(access_token_hash);

create table pac.consult_notices (
  notice_id bigint generated always as identity primary key,
  request_id text references pac.consult_requests(id),
  to_email text not null check (length(to_email) <= 254),
  subject text not null check (length(subject) <= 300),
  body text not null check (length(body) <= 8000),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  attempts integer not null default 0 check (attempts >= 0),
  last_error text check (last_error is null or length(last_error) <= 500)
);

create index consult_notices_unsent_idx on pac.consult_notices(created_at) where sent_at is null;

create function pac.consult_events_append_only()
returns trigger language plpgsql set search_path = pg_catalog, pac as $$
begin
  raise exception 'Consult history is append-only' using errcode = '55000';
end $$;

create trigger consult_events_immutable
before update or delete on pac.consult_events
for each row execute function pac.consult_events_append_only();

alter table pac.consult_requests enable row level security;
alter table pac.consult_events enable row level security;
alter table pac.consult_people enable row level security;
alter table pac.consult_notices enable row level security;

revoke all privileges on pac.consult_requests from public;
revoke all privileges on pac.consult_events from public;
revoke all privileges on pac.consult_people from public;
revoke all privileges on pac.consult_notices from public;
revoke all privileges on sequence pac.consult_events_event_id_seq from public;
revoke all privileges on sequence pac.consult_notices_notice_id_seq from public;

grant select, insert, update on pac.consult_requests to pac_app_runtime;
grant select, insert on pac.consult_events to pac_app_runtime;
grant select, insert, update on pac.consult_people to pac_app_runtime;
grant select, insert, update on pac.consult_notices to pac_app_runtime;
grant usage, select on sequence pac.consult_events_event_id_seq to pac_app_runtime;
grant usage, select on sequence pac.consult_notices_notice_id_seq to pac_app_runtime;

create policy consult_requests_runtime on pac.consult_requests for all to pac_app_runtime using (true) with check (true);
create policy consult_events_runtime on pac.consult_events for all to pac_app_runtime using (true) with check (true);
create policy consult_people_runtime on pac.consult_people for all to pac_app_runtime using (true) with check (true);
create policy consult_notices_runtime on pac.consult_notices for all to pac_app_runtime using (true) with check (true);

commit;
