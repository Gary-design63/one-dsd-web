import { createHash } from "node:crypto";

export const GRAPH_VERSION = "source-relationships-v1";
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}
export function graphHash(value) {
  return createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}
const identifier = (kind, id) => `${GRAPH_VERSION}:${kind}:${graphHash(id)}`;

/**
 * Structural relationships from recorded evidence; no inferred person profiles.
 * @param {{sources?: Record<string, any>[], items?: Record<string, any>[], revisions?: Record<string, any>[], links?: Record<string, any>[], receipts?: Record<string, any>[], memberships?: Record<string, any>[], collections?: Record<string, any>[]}} input
 */
export function buildKnowledgeGraph({ sources = [], items = [], revisions = [], links = [], receipts = [], memberships = [], collections = [] }) {
  const nodes = new Map();
  const edges = new Map();
  const evidence = new Map();
  const sourceNodes = new Map();
  const itemNodes = new Map();
  const revisionNodes = new Map();
  let excludedSources = 0;
  let excludedItems = 0;

  function addNode(kind, identity, label, extra = {}) {
    const node = {
      node_id: identifier(kind, identity), node_type: kind, label,
      scope_id: null, content_item_id: null, source_item_id: null,
      properties: {}, review_status: "candidate", trust_score: null,
      created_by: GRAPH_VERSION, ...extra,
    };
    const previous = nodes.get(node.node_id);
    if (previous && graphHash(previous) !== graphHash(node)) throw new Error("A graph node identity has conflicting values.");
    nodes.set(node.node_id, node);
    return node.node_id;
  }
  function addEdge(from, to, type, properties = {}, sourceId, revisionId) {
    if (!from || !to || from === to) return;
    const edge = {
      edge_id: identifier("edge", { from, to, type, properties }),
      from_node_id: from, to_node_id: to, edge_type: type, direction: "directed",
      confidence: null, review_status: "candidate", properties, created_by: GRAPH_VERSION,
    };
    edges.set(edge.edge_id, edge);
    if (sourceId) {
      const row = { edge_id: edge.edge_id, source_item_id: sourceId, revision_id: revisionId ?? null, evidence_note: "Relationship retained from the recorded source or content link." };
      evidence.set(graphHash(row), row);
    }
  }
  function subject(type, label) {
    const text = String(label).trim();
    if (!text || text.length > 240) return undefined;
    return addNode(type, text, text);
  }
  for (const source of sources) {
    if (source.sensitivity_class === "S4") { excludedSources++; continue; }
    sourceNodes.set(source.source_item_id, addNode("source", [source.source_item_id, source.normalized_item_sha256], source.title, {
      source_item_id: source.source_item_id,
      properties: { sourceHash: source.normalized_item_sha256, accountingStatus: source.accounting_status },
    }));
  }
  for (const item of items) {
    if (item.sensitivity_class === "S4") { excludedItems++; continue; }
    itemNodes.set(item.content_item_id, addNode("content", item.content_item_id, item.staff_label, {
      content_item_id: item.content_item_id, scope_id: item.default_scope_id,
      properties: { kind: item.content_kind, restricted: item.restricted },
    }));
  }
  for (const revision of revisions) {
    const itemNode = itemNodes.get(revision.content_item_id);
    if (!itemNode || revision.sensitivity_class === "S4") continue;
    const payload = revision.canonical_payload ?? {};
    const revisionNode = addNode("revision", revision.revision_id, payload.title ?? nodes.get(itemNode).label, {
      content_item_id: revision.content_item_id, scope_id: nodes.get(itemNode).scope_id,
      properties: { revisionId: revision.revision_id, payloadHash: revision.payload_sha256, revisionNumber: revision.revision_number },
    });
    revisionNodes.set(revision.revision_id, revisionNode);
    addEdge(revisionNode, itemNode, "version_of");
    for (const [key, kind] of [["tags", "topic"], ["intents", "task"], ["pathIds", "practice_path"]]) {
      for (const value of Array.isArray(payload[key]) ? payload[key] : []) {
        if (typeof value === "string") addEdge(revisionNode, subject(kind, value), "applies_to");
      }
    }
  }
  for (const revision of revisions) addEdge(revisionNodes.get(revision.revision_id), revisionNodes.get(revision.based_on_revision_id), "based_on");
  for (const link of links) {
    addEdge(sourceNodes.get(link.source_item_id), revisionNodes.get(link.revision_id), "supports", { relationship: link.relationship }, link.source_item_id, link.revision_id);
  }
  const collectionNodes = new Map(collections.map((collection) => [collection.collection_id, addNode("collection", collection.collection_id, collection.name)]));
  for (const membership of memberships) addEdge(itemNodes.get(membership.content_item_id), collectionNodes.get(membership.collection_id), "part_of");
  for (const receipt of receipts) {
    const from = sourceNodes.get(receipt.source_item_id);
    if (!from) continue;
    const payload = receipt.decision_payload ?? {};
    if (receipt.canonical_family_id) {
      addEdge(from, subject("family", receipt.canonical_family_id), "classified_with", { receiptId: receipt.receipt_id, disposition: receipt.disposition }, receipt.source_item_id);
    }
    for (const [key, type] of [["roles", "role"], ["tasks", "task"]]) {
      for (const value of Array.isArray(payload[key]) ? payload[key] : []) {
        if (typeof value === "string") addEdge(from, subject(type, value), "applies_to", { receiptId: receipt.receipt_id }, receipt.source_item_id);
      }
    }
  }
  const rows = {
    nodes: [...nodes.values()].sort((a, b) => a.node_id.localeCompare(b.node_id)),
    edges: [...edges.values()].sort((a, b) => a.edge_id.localeCompare(b.edge_id)),
    evidence: [...evidence.values()].sort((a, b) => graphHash(a).localeCompare(graphHash(b))),
  };
  return { ...rows, hash: graphHash(rows), counts: { nodes: rows.nodes.length, edges: rows.edges.length, evidence: rows.evidence.length, excludedSources, excludedItems } };
}

export function batchGraphRows(rows, size = 500) {
  if (!Number.isSafeInteger(size) || size < 1 || size > 2000) throw new Error("Graph batch size must be between 1 and 2000.");
  return Array.from({ length: Math.ceil(rows.length / size) }, (_, index) => rows.slice(index * size, (index + 1) * size));
}
