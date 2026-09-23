begin;

create index if not exists knowledge_nodes_revision_reference_idx
  on pac.knowledge_nodes ((properties->>'revisionId')) where node_type = 'revision';

create or replace function pac.read_owner_corpus_inventory(
  requested_scope text, requested_search text default '', requested_limit integer default 40, requested_offset integer default 0
)
returns jsonb language plpgsql stable security definer
set search_path = pg_catalog, pac set row_security = off
as $$
declare result jsonb;
begin
  if requested_scope not in ('one-dhs','dsd') or requested_scope is null
    or length(coalesce(requested_search,'')) > 200
    or requested_limit is null or requested_limit not between 1 and 100
    or requested_offset is null or requested_offset < 0 or requested_offset > 1000000 then
    raise exception 'Invalid collection request' using errcode='22023';
  end if;
  with eligible as (
    select i.* from pac.content_items i
    where (i.default_scope_id='one-dhs' or i.default_scope_id=requested_scope)
      and (coalesce(requested_search,'')='' or strpos(lower(i.staff_label),lower(requested_search))>0)
  ), entries as (
    select i.content_item_id, i.staff_label, i.content_kind, i.default_scope_id,
      r.revision_id, r.revision_number,
      exists(select 1 from pac.read_staff_publications(requested_scope,i.content_item_id)) as published
    from eligible i
    left join lateral (
      select cr.revision_id,cr.revision_number from pac.content_revisions cr
      where cr.content_item_id=i.content_item_id
      order by cr.revision_number desc limit 1
    ) r on true
    order by i.staff_label,i.content_item_id limit requested_limit offset requested_offset
  )
  select jsonb_build_object(
    'total', (select count(*) from eligible),
    'items', coalesce((select jsonb_agg(jsonb_build_object(
      'id',content_item_id,'title',staff_label,'kind',content_kind,'scope',default_scope_id,
      'revisionId',revision_id,'revisionNumber',revision_number,'published',published
    ) order by staff_label,content_item_id) from entries),'[]'::jsonb),
    'counts',jsonb_build_object(
      'sources',(select count(*) from pac.source_items),
      'unavailableSources',(select count(*) from pac.source_items where accounting_status='accounted_awaiting_source'),
      'receipts',(select count(*) from pac.source_receipts),
      'content',(select count(*) from pac.content_items),
      'revisions',(select count(*) from pac.content_revisions),
      'storedFiles',(select count(*) from pac.source_carrier_locations),
      'nodes',(select count(*) from pac.knowledge_nodes),
      'relationships',(select count(*) from pac.knowledge_edges)
    )
  ) into result;
  return result;
end;
$$;

-- Relationship hints only connect exact currently visible revisions. An older
-- graph snapshot cannot keep a corrected or withdrawn resource visible.
create or replace function pac.read_staff_graph_neighbors(requested_scope text, requested_item text, requested_limit integer default 4)
returns table(content_item_id text,title text,shared_topics bigint)
language plpgsql stable security definer
set search_path=pg_catalog,pac set row_security=off
as $$
begin
  if requested_scope not in ('one-dhs','dsd') or requested_scope is null
    or requested_limit is null or requested_limit not between 1 and 12 then
    raise exception 'Invalid related reading request' using errcode='22023';
  end if;
  return query
  with visible as materialized (select * from pac.read_staff_publications(requested_scope,null)),
  starting as (
    select edge.to_node_id
    from visible item
    join pac.knowledge_nodes node on node.properties->>'revisionId'=item.revision_id::text and node.node_type='revision'
    join pac.knowledge_edges edge on edge.from_node_id=node.node_id and edge.edge_type='applies_to'
    where item.content_item_id=requested_item
  )
  select candidate.content_item_id,candidate.canonical_payload->>'title',count(distinct edge.to_node_id)
  from visible candidate
  join pac.knowledge_nodes node on node.properties->>'revisionId'=candidate.revision_id::text and node.node_type='revision'
  join pac.knowledge_edges edge on edge.from_node_id=node.node_id and edge.edge_type='applies_to'
  join starting on starting.to_node_id=edge.to_node_id
  where candidate.content_item_id<>requested_item
  group by candidate.content_item_id,candidate.canonical_payload->>'title'
  order by count(distinct edge.to_node_id) desc,candidate.content_item_id
  limit requested_limit;
end;
$$;

revoke all on function pac.read_owner_corpus_inventory(text,text,integer,integer) from public;
revoke all on function pac.read_staff_graph_neighbors(text,text,integer) from public;
grant execute on function pac.read_owner_corpus_inventory(text,text,integer,integer) to pac_app_runtime;
grant execute on function pac.read_staff_graph_neighbors(text,text,integer) to pac_app_runtime;
comment on function pac.read_owner_corpus_inventory(text,text,integer,integer) is
  'Owner application boundary only: counts and paginated content labels; source bodies, private submissions, and secrets are excluded.';
commit;
