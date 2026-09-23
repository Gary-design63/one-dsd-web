begin;

create or replace function pac.resource_management_allowed(requested_scope_id text,requested_content_item_id text)
returns boolean language sql stable set search_path=pg_catalog,pac
as $$
  with recursive visible_scopes as (
    select scope_id,parent_scope_id from pac.program_scopes
    where scope_id=requested_scope_id and active and scope_id in ('one-dhs','dsd')
    union all
    select parent.scope_id,parent.parent_scope_id from pac.program_scopes parent
    join visible_scopes child on child.parent_scope_id=parent.scope_id
    where parent.active and parent.scope_id<>'one-dhs-pac'
  )
  select exists(select 1 from pac.content_items item
    where item.content_item_id=requested_content_item_id and item.content_kind='resource'
      and not item.restricted and item.retired_at is null
      and item.default_scope_id in (select scope_id from visible_scopes)
      and exists(select 1 from pac.content_revisions revision
        where revision.content_item_id=item.content_item_id
          and revision.canonical_payload->>'status' in ('under_review','approved')
          and revision.canonical_payload->>'id'=item.content_item_id));
$$;

create or replace function pac.read_resource_editing_state(requested_scope_id text,requested_content_item_id text)
returns table(content_item_id text,published_revision_id uuid,base_revision_id uuid,editable_fields jsonb,has_unpublished_changes boolean)
language plpgsql stable security definer set search_path=pg_catalog,pac set row_security=off
as $$
begin
  if not pac.resource_management_allowed(requested_scope_id,requested_content_item_id) then
    raise exception 'Resource is not available for editing' using errcode='P0002';
  end if;
  return query
  with visible as (select p.* from pac.read_staff_publications(requested_scope_id,requested_content_item_id) p),
  local_draft as (
    select r.* from pac.content_revisions r
    where r.content_item_id=requested_content_item_id and r.canonical_payload->>'status'='under_review'
      and pac.resource_scope_id(r.canonical_payload)=requested_scope_id
      and not exists(select 1 from pac.content_revisions released
        where released.based_on_revision_id=r.revision_id and released.canonical_payload->>'status'='approved')
    order by r.revision_number desc limit 1
  ), base as (
    select r.* from pac.content_revisions r
    join pac.content_items i on i.content_item_id=r.content_item_id
    where r.content_item_id=requested_content_item_id
      and r.canonical_payload->>'status' in ('under_review','approved')
      and pac.resource_scope_id(r.canonical_payload) in (requested_scope_id,i.default_scope_id)
    order by (r.revision_id=(select d.revision_id from local_draft d)) desc nulls last,
      (r.revision_id=(select v.revision_id from visible v)) desc nulls last,r.revision_number desc
    limit 1
  )
  select requested_content_item_id,(select v.revision_id from visible v),b.revision_id,
    jsonb_build_object(
      'title',b.canonical_payload->'title','type',b.canonical_payload->'type',
      'authority',b.canonical_payload->'authority','layer',b.canonical_payload->'layer',
      'summary',b.canonical_payload->'summary','whyItMatters',coalesce(b.canonical_payload->'whyItMatters','null'::jsonb),
      'body',b.canonical_payload->'body','nextActions',b.canonical_payload->'nextActions',
      'tags',b.canonical_payload->'tags','intents',b.canonical_payload->'intents',
      'pathIds',coalesce(b.canonical_payload->'pathIds','[]'::jsonb),
      'owner',b.canonical_payload->'owner','reviewDate',b.canonical_payload->'reviewDate',
      'scope',to_jsonb(case when requested_scope_id='one-dhs' then 'agencywide' else 'dsd' end),
      'href',coalesce(b.canonical_payload->'href','null'::jsonb),
      'sourceName',coalesce(b.canonical_payload->'sourceName','null'::jsonb)
    ),b.canonical_payload->>'status'='under_review'
  from base b;
end;
$$;
revoke all on function pac.resource_management_allowed(text,text) from public;
revoke all on function pac.read_resource_editing_state(text,text) from public;
grant execute on function pac.read_resource_editing_state(text,text) to pac_app_runtime;
comment on function pac.read_resource_editing_state(text,text) is
  'Owner authoring includes recovered unpublished resource candidates. The actual staff reader remains the only source of published_revision_id.';
commit;
