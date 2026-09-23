import { afterEach, expect, it, vi } from "vitest";
import * as publications from "@/lib/content/editable-surfaces";
import { dsdLinkAvailable, loadDsdDestinations } from "@/lib/dsd/published";
vi.mock("@/lib/intelligence/retrieval/program-resources", () => ({ indexedProgramResources: () => { throw new Error("Full text indexing must not run for DSD page navigation."); } }));
afterEach(() => vi.restoreAllMocks());

it("reads only DSD navigation publications and honors owner titles and withdrawals", async () => {
  const original = publications.loadPublishedEditableSurfaces;
  const calls: Array<{ ids: string[]; scope: string }> = [];
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (ids, scope) => {
    calls.push({ ids, scope });
    return (await original(ids, scope)).filter(row => row.surfaceId !== "dsd-scenario.dsd-hiring-panel").map(row => row.surfaceId === "domain.workforce" ? { ...row, values: { ...row.values, title: "Owner's workforce wording" } } : row);
  });
  const links = await loadDsdDestinations();
  expect(links.get("/areas/workforce")).toBe("Owner's workforce wording");
  expect(links.has("/one-dsd/scenarios/dsd-hiring-panel")).toBe(false);
  expect(links.has("/one-dsd/scenarios/dsd-advancement-conversation")).toBe(true);
  expect(calls).toHaveLength(1);
  expect(calls[0].scope).toBe("dsd");
  expect(calls[0].ids.length).toBeLessThan(50);
  expect(calls[0].ids.some(id => id.startsWith("community-reading."))).toBe(false);
});

it("resolves owner-added ASK and shared page links using their current scoped publication", async () => {
  let links = await loadDsdDestinations(["/ask?question=Meeting", "/support/right-person?matter=accessibility_barrier"]);
  expect(dsdLinkAvailable("/ask?question=Meeting", links)).toBe(true);
  expect(dsdLinkAvailable("/support/right-person?matter=accessibility_barrier", links)).toBe(true);
  const original = publications.loadPublishedEditableSurfaces;
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (ids, scope) => (await original(ids, scope)).filter(row => row.surfaceId !== "ask.page"));
  links = await loadDsdDestinations(["/ask?question=Meeting"]);
  expect(dsdLinkAvailable("/ask?question=Meeting", links)).toBe(false);
});

it("requires both current community publications for an owner-added community link", async () => {
  const original = publications.loadPublishedEditableSurfaces;
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (ids, scope) => (await original(ids, scope)).filter(row => row.surfaceId !== "community-reading.somali"));
  expect(dsdLinkAvailable("/minnesota-communities/somali", await loadDsdDestinations(["/minnesota-communities/somali"]))).toBe(false);
});
