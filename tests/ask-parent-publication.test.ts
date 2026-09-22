import { afterEach, expect, it, vi } from "vitest";
import * as publications from "@/lib/content/editable-surfaces";
import { indexedProgramResources, programResourceLinks } from "@/lib/intelligence/retrieval/program-resources";

afterEach(() => vi.restoreAllMocks());

it.each(["one-dhs", "dsd"] as const)("removes and restores the equity anchor with its current %s parent publication", async scope => {
  const ids = ["about.page", "equity.practice", "support.page"];
  const actual = new Map(await Promise.all((["one-dhs", "dsd"] as const).map(async requestedScope => [requestedScope, await publications.loadPublishedEditableSurfaces(ids, requestedScope)] as const)));
  const current = new Map(actual);
  for (const rows of actual.values()) expect(rows.map(row => row.surfaceId).sort()).toEqual([...ids].sort());
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (_ids, requestedScope) => current.get(requestedScope)!);
  const href = "/about#equity-in-practice";
  const original = await indexedProgramResources(scope);
  expect(original.destinations.some(doc => doc.href === href)).toBe(true);
  const support = original.destinations.find(doc => doc.href === "/support")!;

  current.set(scope, actual.get(scope)!.filter(row => row.surfaceId !== "about.page"));
  const withdrawn = await indexedProgramResources(scope);
  expect(withdrawn.destinations.some(doc => doc.href === href)).toBe(false);
  expect(programResourceLinks("Where can I find Operationalizing equity?", withdrawn.destinations).some(link => link.href === href)).toBe(false);
  expect(withdrawn.destinations.find(doc => doc.href === "/support")).toEqual(support);
  const otherScope = scope === "dsd" ? "one-dhs" : "dsd";
  expect((await indexedProgramResources(otherScope)).destinations.some(doc => doc.href === href)).toBe(true);

  current.set(scope, actual.get(scope)!);
  const restored = await indexedProgramResources(scope);
  expect(restored.destinations.find(doc => doc.href === href)).toEqual(original.destinations.find(doc => doc.href === href));
  expect(programResourceLinks("Where can I find Operationalizing equity?", restored.destinations).some(link => link.href === href)).toBe(true);
  expect(restored.destinations.find(doc => doc.href === "/support")).toEqual(support);
});
