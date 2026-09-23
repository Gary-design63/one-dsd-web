begin;

-- The application login can retrieve only current, staff-published revisions.
-- Source intake, held drafts, review working records, and publication history stay
-- outside the runtime role's privileges.
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
    select 1
    from pac.program_scopes s
    where s.scope_id = requested_scope_id
      and s.active = true
      and s.scope_id <> 'one-dhs-pac'
  ) then
    raise exception 'Unknown or inactive staff scope: %', requested_scope_id
      using errcode = '22023';
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

revoke all privileges on function pac.read_staff_publications(text, text) from public;

do $$
begin
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'pac_app_runtime') then
    raise exception 'Required least-privilege role pac_app_runtime is missing; apply the runtime-store migration first';
  end if;
end;
$$;

grant usage on schema pac to pac_app_runtime;
grant execute on function pac.read_staff_publications(text, text) to pac_app_runtime;

revoke all privileges on pac.current_staff_publications from pac_app_runtime;
revoke all privileges on pac.current_publications from pac_app_runtime;
revoke all privileges on pac.content_items from pac_app_runtime;
revoke all privileges on pac.content_revisions from pac_app_runtime;
revoke all privileges on pac.publication_decisions from pac_app_runtime;
revoke all privileges on pac.source_carriers from pac_app_runtime;
revoke all privileges on pac.source_items from pac_app_runtime;

comment on function pac.read_staff_publications(text, text) is
  'Least-privilege staff read boundary. Applies scope inheritance and returns only current approved staff publications.';

commit;
