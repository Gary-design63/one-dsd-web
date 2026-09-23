import { afterEach, expect, it, vi } from "vitest";
import { PODCASTS } from "@/lib/content/podcasts";
import { indexedProgramResources, programResourceLinks } from "@/lib/intelligence/retrieval/program-resources";
import * as publications from "@/lib/content/editable-surfaces";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

afterEach(() => vi.restoreAllMocks());

it("does not accept a typed staff Ask question to find a podcast", async () => {
  await expectStaffAskClosed();
});

it.each(["one-dhs", "dsd"] as const)("indexes both published recordings for browse in %s", async (scope) => {
  const index = await indexedProgramResources(scope);
  for (const podcast of PODCASTS) {
    expect(index.destinations.some((doc) => doc.href === podcast.href && doc.title === podcast.title)).toBe(true);
    expect(programResourceLinks(`Where can I find the ${podcast.title} podcast?`, index.destinations, 3).some((link) => link.href === podcast.href)).toBe(true);
  }
});

it("removes a withdrawn recording from browse destinations while keeping the other available", async () => {
  const rows = await publications.loadPublishedEditableSurfaces(PODCASTS.map((podcast) => podcast.surfaceId), "one-dhs");
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockResolvedValue(rows.filter((row) => row.surfaceId !== PODCASTS[1].surfaceId));
  const index = await indexedProgramResources("one-dhs");
  expect(index.destinations.map((doc) => doc.href)).toEqual([PODCASTS[0].href]);
});
