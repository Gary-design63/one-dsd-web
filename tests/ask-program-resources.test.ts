import { afterEach, expect, it, vi } from "vitest";
import { writeFileSync } from "node:fs";
import { indexedProgramResources, programResourceDefinitions, programResourceLinks } from "@/lib/intelligence/retrieval/program-resources";
import { indexedStaffDocs } from "@/lib/intelligence/retrieval/staff-search";
import * as surfaces from "@/lib/content/editable-surfaces";
import { communityDesignEntries } from "@/lib/content/community-design";

afterEach(() => vi.restoreAllMocks());

afterEach(() => vi.restoreAllMocks());

it("routes to every named published resource in both program scopes and writes the coverage receipt", async () => {
  const receipt = [];
  for (const scope of ["one-dhs", "dsd"] as const) {
    const index = await indexedProgramResources(scope);
    const docs = [...(await indexedStaffDocs(scope)).filter(doc => doc.kind !== "brief"), ...index.destinations];
    expect(index.communityDocs).toHaveLength(communityDesignEntries().length);
    for (const doc of docs) {
      const question = `Where can I find ${doc.title}?`;
      const links = programResourceLinks(question, docs, 3);
      receipt.push({ scope, title: doc.title, href: doc.href, question, passed: links.some(link => link.href === doc.href) });
    }
    expect(docs.every(doc => !doc.href.startsWith("/consultant"))).toBe(true);
  }
  writeFileSync("evidence/local-audit-2026-09-07/ask-resource-coverage.json", JSON.stringify({ checkedAt: new Date().toISOString(), mode: "static published definitions; route selection", checks: receipt }, null, 2));
  expect(receipt.filter(row => !row.passed)).toEqual([]);
}, 120000);

it("does not substitute archived defaults when publications are withdrawn", async () => {
  vi.spyOn(surfaces, "loadPublishedEditableSurfaces").mockResolvedValue([]);
  expect(await indexedProgramResources("one-dhs")).toEqual({ communityDocs: [], destinations: [] });
});

it("requires every publication used by a community page", async () => {
  const rows = await surfaces.loadPublishedEditableSurfaces(programResourceDefinitions().map(d => d.surfaceId), "one-dhs");
  vi.spyOn(surfaces, "loadPublishedEditableSurfaces").mockResolvedValue(rows.filter(row => row.surfaceId !== "community-reading.somali"));
  const index = await indexedProgramResources("one-dhs");
  expect(index.destinations.some(doc => doc.href === "/minnesota-communities/somali")).toBe(false);
});
