import { type ReactNode } from "react";
import { renderServerPage } from "./helpers/render-server-page";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { PODCASTS } from "@/lib/content/podcasts";
import { podcastShareHref } from "@/lib/product/share-link";

const state = vi.hoisted(() => ({ scope: "one-dhs", unavailable: new Set<string>(), requested: [] as Array<{ id: string; scope?: string }> }));
vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => state.scope }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string, options: { scope?: string } = {}) => {
    state.requested.push({ id, scope: options.scope });
    const definition = getEditableSurfaceDefinition(id)!;
    return { definition, scope: state.scope, values: definition.approvedValues, available: !state.unavailable.has(id), canEdit: false };
  },
  EditableSurfaceRegion: ({ children, surface }: { children: ReactNode; surface: { available: boolean } }) => surface.available ? children : null,
}));
import PodcastPage, { generateMetadata } from "@/app/podcasts/[id]/page";

const params = (id: string) => ({ params: Promise.resolve({ id }) });
beforeEach(() => { state.scope = "one-dhs"; state.unavailable.clear(); state.requested = []; });

describe("each published podcast has its own page", () => {
  it.each(PODCASTS.map(podcast => [podcast.id, podcast] as const))("renders %s alone with its player, title and a way back to Learning", async (id, podcast) => {
    const html = await renderServerPage(await PodcastPage(params(id)));
    expect(html).toContain(`<h1 id="podcast-${id}-title"`);
    expect(html).toContain(`>${podcast.title}<`);
    expect(html).toContain(`<section id="podcast-${id}"`);
    expect(html).toContain(`src="${podcast.src}"`);
    expect(html.match(/<audio /g)).toHaveLength(1);
    expect(html).toContain('href="/learn"');
    expect(html).not.toContain("Open the podcast page");
    for (const other of PODCASTS) if (other.id !== id) expect(html).not.toContain(`podcast-${other.id}`);
    expect(state.requested).toContainEqual({ id: podcast.surfaceId, scope: "one-dhs" });
  });

  it("previews with the podcast's own title and introduction", async () => {
    const podcast = PODCASTS[1];
    expect(await generateMetadata(params(podcast.id))).toEqual({ title: podcast.title, description: podcast.intro });
    expect(await generateMetadata(params("not-a-podcast"))).toEqual({});
  });

  it("requests the podcast in the One DSD scope when that view is in effect", async () => {
    state.scope = "dsd";
    await renderServerPage(await PodcastPage(params(PODCASTS[0].id)));
    expect(state.requested).toContainEqual({ id: PODCASTS[0].surfaceId, scope: "dsd" });
  });

  it("is not found for an unknown or unpublished podcast", async () => {
    await expect(PodcastPage(params("not-a-podcast"))).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    state.unavailable.add(PODCASTS[0].surfaceId);
    await expect(PodcastPage(params(PODCASTS[0].id))).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(await generateMetadata(params(PODCASTS[0].id))).toEqual({});
  });

  it("links from a player elsewhere to the podcast page, which the share link also opens", async () => {
    const { PublishedPodcast } = await import("@/components/published-podcast");
    const podcast = PODCASTS[0];
    const definition = getEditableSurfaceDefinition(podcast.surfaceId)!;
    const surface = { definition, scope: "one-dhs", values: definition.approvedValues, available: true, canEdit: false };
    const html = await renderServerPage(<PublishedPodcast podcast={podcast} surface={surface as never} />);
    expect(podcastShareHref(podcast.id)).toBe(`/podcasts/${podcast.id}`);
    expect(html).toContain(`href="/podcasts/${podcast.id}"`);
    expect(html).toContain("Open the podcast page");
  });
});
