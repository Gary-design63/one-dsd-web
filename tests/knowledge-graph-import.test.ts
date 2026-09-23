import { describe, expect, it } from "vitest";
import { buildKnowledgeGraph, batchGraphRows } from "../scripts/corpus/knowledge-graph-lib.mjs";

const source = { source_item_id: "original:1", title: "Accessible meetings", normalized_item_sha256: "ab", accounting_status: "accounted" };
const item = { content_item_id: "meeting", staff_label: "Plan a meeting", default_scope_id: "one-dhs", content_kind: "resource", restricted: false };
const revision = { revision_id: "revision-1", content_item_id: "meeting", payload_sha256: "cd", revision_number: 1, canonical_payload: { title: "Plan a meeting", tags: ["access"], intents: ["facilitation"] } };

describe("source-backed knowledge graph import", () => {
  it("retains source evidence, family disposition and revision identity without publishing or inventing trust", () => {
    const graph = buildKnowledgeGraph({ sources: [source], items: [item], revisions: [revision], links: [{ source_item_id: source.source_item_id, revision_id: revision.revision_id, relationship: "adapted_from" }], receipts: [{ receipt_id: "receipt-1", source_item_id: source.source_item_id, disposition: "component_merge", canonical_family_id: "accessibility", decision_payload: { roles: ["all-staff"], tasks: ["plan-meeting"] } }] });
    expect(graph.nodes.find((node: { node_type: string }) => node.node_type === "revision")?.properties.revisionId).toBe("revision-1");
    expect(graph.edges.some((edge: { properties: { disposition?: string } }) => edge.properties.disposition === "component_merge")).toBe(true);
    expect(graph.evidence.length).toBe(4);
    expect(graph.nodes.every((node: { review_status: string; trust_score: unknown }) => node.review_status === "candidate" && node.trust_score === null)).toBe(true);
    expect(graphHashOrder(graph)).toBe(true);
  });

  it("excludes prohibited material and prevents dangling edges", () => {
    const graph = buildKnowledgeGraph({ sources: [{ ...source, sensitivity_class: "S4" }], items: [{ ...item, sensitivity_class: "S4" }], revisions: [revision], links: [{ source_item_id: source.source_item_id, revision_id: revision.revision_id, relationship: "source" }] });
    expect(graph.nodes).toEqual([]);
    expect(graph.edges).toEqual([]);
    expect(graph.counts.excludedSources).toBe(1);
  });

  it("is repeatable despite input ordering and batches 50,000 records without omission", () => {
    const sources = [source, { ...source, source_item_id: "original:2" }];
    expect(buildKnowledgeGraph({ sources }).hash).toBe(buildKnowledgeGraph({ sources: [...sources].reverse() }).hash);
    const rows = Array.from({ length: 50_000 }, (_, index) => index);
    const batches = batchGraphRows(rows);
    expect(batches).toHaveLength(100);
    expect(batches.flat()).toEqual(rows);
    expect(() => batchGraphRows(rows, 0)).toThrow();
  });
});

function graphHashOrder(graph: ReturnType<typeof buildKnowledgeGraph>) {
  const ids = new Set(graph.nodes.map((node: { node_id: string }) => node.node_id));
  return graph.edges.every((edge: { from_node_id: string; to_node_id: string }) => ids.has(edge.from_node_id) && ids.has(edge.to_node_id));
}
