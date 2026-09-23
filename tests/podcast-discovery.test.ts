import { type ReactNode } from "react";
import { renderServerPage } from "./helpers/render-server-page";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CORPUS } from "@/lib/content/corpus";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { PODCASTS, podcastMatches } from "@/lib/content/podcasts";
import { LEARNING_HUB_SURFACE } from "@/lib/content/learning-hub";
const state = vi.hoisted(() => ({ scope: "one-dhs", unavailable: new Set<string>(), requested: [] as Array<{ id: string; scope?: string }>, structuralIds: null as null | string[] }));
// ResourceRemove (in the tile grid this file renders) calls useRouter(); these pages are
// rendered directly with react-dom/server here, outside a mounted app router.
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: () => {}, refresh: () => {} }) }));
vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => state.scope }));
vi.mock("@/lib/content/staff-publications", () => ({ staffContentSource: () => "static", loadStaffContentSnapshot: async () => ({ items: CORPUS.filter(item => item.status === "approved") }) }));
vi.mock("@/components/program-context", () => ({ ProgramContextNote: () => null }));
vi.mock("@/components/participation-notice", () => ({ ParticipationNotice: () => null }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string, options: { scope?: string } = {}) => {
    state.requested.push({ id, scope: options.scope });
    const definition = getEditableSurfaceDefinition(id)!;
    return { definition, scope: state.scope, values: id === "learn.hub" && state.structuralIds !== null ? { ...definition.approvedValues, structuralIds: state.structuralIds } : definition.approvedValues, available: !state.unavailable.has(id), canEdit: false };
  },
  EditableSurfaceRegion: ({ children, surface }: { children: ReactNode; surface: { available: boolean } }) => surface.available ? children : null,
}));
import LearnPage from "@/app/learn/page";
const render = async (query: { theme?: string; q?: string; type?: string } = {}) => renderServerPage(await LearnPage({ searchParams: Promise.resolve(query) }));
beforeEach(() => { state.scope = "one-dhs"; state.unavailable.clear(); state.requested = []; state.structuralIds = null; });
describe("published podcast discovery", () => {
  it.each(["one-dhs", "dsd"])("renders published native playback in the requested %s scope", async scope => {
    state.scope = scope;
    const html = await render({ theme: "structural", type: "podcast" });
    for (const podcast of PODCASTS) {
      expect(html).toContain(`src="${podcast.src}"`);
      expect(html).toContain(`aria-labelledby="podcast-${podcast.id}-title"`);
      expect(state.requested).toContainEqual({ id: podcast.surfaceId, scope });
    }
    expect(html.match(/<audio /g)).toHaveLength(2);
    expect(html).toContain("2 resources found");
    expect(html).not.toMatch(/Upload|Manage podcast|Create podcast|transcript unavailable|implementation/i);
  });
  it("does not expose unavailable recordings or substitute approved defaults", async () => {
    state.unavailable.add(PODCASTS[1].surfaceId);
    let html = await render({ theme: "structural", type: "podcast" });
    expect(html).toContain(PODCASTS[0].src); expect(html).not.toContain(PODCASTS[1].src);
    state.unavailable.add(PODCASTS[0].surfaceId);
    html = await render();
    expect(html).not.toContain("<audio"); expect(html).toContain('href="/library/ext-clas"');
  });
  it("uses the same recording under relevant editable themes and honors owner removals", async () => {
    expect(await render({ theme: "culture", type: "podcast" })).toContain(PODCASTS[1].src);
    expect(await render({ theme: "partnership", type: "podcast" })).toContain(PODCASTS[0].src);
    expect(await render({ theme: "intercultural" })).not.toContain("<audio");
    state.structuralIds = (LEARNING_HUB_SURFACE.approvedValues.structuralIds as string[]).filter(id => id !== PODCASTS[1].surfaceId);
    const html = await render({ theme: "structural", type: "podcast" });
    expect(html).toContain(PODCASTS[0].src); expect(html).not.toContain(PODCASTS[1].src);
  });
  it("combines text and format filters without replacing complete learning resources", async () => {
    const html = await render({ q: "anti-racism", type: "podcast" });
    expect(html).toContain(PODCASTS[1].src); expect(html).not.toContain(PODCASTS[0].src);
    expect(await render({ type: "learning_module" })).not.toContain("<audio");
    expect(podcastMatches(PODCASTS[0], { q: "revised explanation" }, "A revised explanation", "Owner wording")).toBe(true);
  });
});
