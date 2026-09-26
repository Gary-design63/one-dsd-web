import { afterEach, expect, it, vi } from "vitest";
import * as publications from "@/lib/content/editable-surfaces";
import { indexedProgramResources } from "@/lib/intelligence/retrieval/program-resources";
import goals from "@/lib/program/equity-goals.json";

afterEach(() => vi.restoreAllMocks());

it("indexes the six-goal companion only with the toolkit publication in the requested scope", async () => {
  const rows = await publications.loadPublishedEditableSurfaces(["equity-toolkit.home"], "one-dhs");
  expect(rows).toHaveLength(1);
  const read = vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (_ids, scope) => scope === "one-dhs" ? rows : []);
  const page = (await indexedProgramResources("one-dhs")).destinations.find(doc => doc.href === "/learn/equity-toolkit");
  for (const goal of goals.goals) expect(page?.text).toContain(goal.title);
  expect(page?.text).toContain("three-goal work plan");
  expect((await indexedProgramResources("dsd")).destinations.some(doc => doc.href === "/learn/equity-toolkit")).toBe(false);
  read.mockResolvedValue([]);
  expect((await indexedProgramResources("one-dhs")).destinations.some(doc => doc.href === "/learn/equity-toolkit")).toBe(false);
});
