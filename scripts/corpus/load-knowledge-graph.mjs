import postgres from "postgres";
import { buildKnowledgeGraph, batchGraphRows, GRAPH_VERSION } from "./knowledge-graph-lib.mjs";
import { safeOperationalError } from "./source-object-stage-lib.mjs";

const url = process.env.PAC_DATABASE_URL;
if (!url) throw new Error("PAC_DATABASE_URL is required for graph accounting.");
const sql = postgres(url, { max: 1, prepare: false, ssl: process.env.PAC_DATABASE_SSL === "disable" ? false : "require" });
try {
  const graph = await sql.begin("read only", async (tx) => {
    const sources = await tx`select source_item_id,title,normalized_item_sha256,accounting_status,to_jsonb(s)->>'sensitivity_class' as sensitivity_class from pac.source_items s`;
    const items = await tx`select content_item_id,staff_label,default_scope_id,content_kind,restricted,to_jsonb(i)->>'sensitivity_class' as sensitivity_class from pac.content_items i`;
    const revisions = await tx`select revision_id,content_item_id,revision_number,payload_sha256,canonical_payload,based_on_revision_id,to_jsonb(r)->>'sensitivity_class' as sensitivity_class from pac.content_revisions r`;
    const links = await tx`select revision_id,source_item_id,relationship from pac.revision_sources`;
    const receipts = await tx`select receipt_id,source_item_id,disposition,canonical_family_id,decision_payload from pac.source_receipts`;
    const memberships = await tx`select collection_id,content_item_id from pac.current_collection_memberships`;
    const collections = await tx`select collection_id,name from pac.content_collections`;
    return buildKnowledgeGraph({ sources, items, revisions, links, receipts, memberships, collections });
  });
  const apply = process.argv.includes("--apply");
  let result = { nodesInserted: 0, edgesInserted: 0, evidenceInserted: 0, snapshotInserted: false };
  if (apply) {
    result = await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtextextended(${GRAPH_VERSION},0))`;
      let nodesInserted = 0, edgesInserted = 0, evidenceInserted = 0;
      for (const batch of batchGraphRows(graph.nodes)) {
        const existing = await tx`select * from pac.knowledge_nodes where node_id in ${tx(batch.map(row => row.node_id))}`;
        const byId = new Map(existing.map(row => [row.node_id, row]));
        for (const row of batch) {
          const prior = byId.get(row.node_id);
          if (prior && (prior.label !== row.label || JSON.stringify(prior.properties) !== JSON.stringify(JSON.parse(JSON.stringify(row.properties))))) {
            // Compare JSON values in PostgreSQL, whose key order is canonicalized.
            const [same] = await tx`select properties = ${tx.json(row.properties)}::jsonb as equal from pac.knowledge_nodes where node_id=${row.node_id}`;
            if (prior.label !== row.label || !same.equal) throw new Error("Graph node collision; retained data was not changed.");
          }
        }
        const added = batch.filter(row => !byId.has(row.node_id));
        if (added.length) { await tx`insert into pac.knowledge_nodes ${tx(added.map(row => ({ ...row, properties: tx.json(row.properties) })))}`; nodesInserted += added.length; }
      }
      for (const batch of batchGraphRows(graph.edges)) {
        const added = await tx`insert into pac.knowledge_edges ${tx(batch.map(row => ({ ...row, properties: tx.json(row.properties) })))} on conflict (edge_id) do nothing returning edge_id`;
        edgesInserted += added.length;
      }
      for (const batch of batchGraphRows(graph.evidence)) {
        const added = await tx`insert into pac.knowledge_edge_evidence ${tx(batch)} on conflict do nothing returning evidence_id`;
        evidenceInserted += added.length;
      }
      const priorSnapshot = await tx`select snapshot_id from pac.graph_snapshots where source_manifest_sha256=${graph.hash} and snapshot_label=${GRAPH_VERSION}`;
      if (!priorSnapshot.length) await tx`insert into pac.graph_snapshots(snapshot_label,source_manifest_sha256,node_count,edge_count,trusted_node_count,created_by) values(${GRAPH_VERSION},${graph.hash},${graph.nodes.length},${graph.edges.length},0,${GRAPH_VERSION})`;
      return { nodesInserted, edgesInserted, evidenceInserted, snapshotInserted: !priorSnapshot.length };
    });
  }
  console.log(JSON.stringify({ ok: true, mode: apply ? "applied" : "read_only_check", hash: graph.hash, counts: graph.counts, result, staffPublicationDecisions: 0, modelContextActivation: false }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: safeOperationalError(error) }));
  process.exitCode = 1;
} finally { await sql.end(); }
