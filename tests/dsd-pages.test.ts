import { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "@/lib/dsd";
import { DSD_SURFACES } from "@/lib/dsd/surfaces";
import { loadDsdDestinations } from "@/lib/dsd/published";
const state = vi.hoisted(() => ({ hidden: new Set<string>(), edited: {} as Record<string, Record<string, unknown>> }));
vi.mock("@/components/program-context", () => ({ OneDsdContextPanel: () => null }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string) => {
    const definition = getEditableSurfaceDefinition(id)!;
    return { definition, values: { ...definition.approvedValues, ...state.edited[id] }, available: !state.hidden.has(id), canEdit: false };
  },
  EditableSurfaceRegion: ({ children, surface }: { children: ReactNode; surface: { available: boolean } }) => surface.available ? children : null,
}));
vi.mock("@/lib/dsd/published", async importOriginal => {
  const original = await importOriginal<typeof import("@/lib/dsd/published")>();
  return { ...original,
    loadDsdInventory: async () => DSD_SURFACES.filter(surface => !state.hidden.has(surface.surfaceId)).map(surface => ({ surfaceId: surface.surfaceId, values: { ...surface.approvedValues, ...state.edited[surface.surfaceId] } })),
    loadDsdDestinations: vi.fn(async () => new Map(DSD_SURFACES.filter(surface => !state.hidden.has(surface.surfaceId)).map(surface => [surface.route, String(state.edited[surface.surfaceId]?.title ?? ("title" in surface.approvedValues ? surface.approvedValues.title : ""))]))),
  };
});
import ScenarioPage, { generateMetadata as scenarioMetadata } from "@/app/one-dsd/scenarios/[id]/page";
import ProgramPage from "@/app/one-dsd/programs/[id]/page";
import OneDsdPage from "@/app/one-dsd/page";
const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
beforeEach(() => { state.hidden.clear(); state.edited = {}; vi.mocked(loadDsdDestinations).mockClear(); });
describe("DSD complete page presentation", () => {
  it.each(DSD_SCENARIOS)("shows every original section for $id", async scenario => {
    const html = renderToStaticMarkup(await ScenarioPage({ params: Promise.resolve({ id: scenario.id }) }));
    for (const text of [scenario.title, scenario.situation, ...scenario.whatToNotice, ...scenario.questions, ...scenario.moves.map(move => move.label), scenario.handoff]) expect(html).toContain(escape(text));
  });
  it.each(DSD_PROGRAMS)("shows the complete function and all entry points for $id", async program => {
    const html = renderToStaticMarkup(await ProgramPage({ params: Promise.resolve({ id: program.id }) }));
    for (const text of [program.name, program.whatItDoes, ...program.equityEntryPoints]) expect(html).toContain(escape(text));
  });
  it("lists every current program and scenario on the hub and preserves edited titles", async () => {
    state.edited["dsd-scenario.dsd-hiring-panel"] = { title: "Our hiring process" };
    const html = renderToStaticMarkup(await OneDsdPage());
    for (const program of DSD_PROGRAMS) expect(html).toContain('href="/one-dsd/programs/' + program.id + '"');
    for (const scenario of DSD_SCENARIOS) expect(html).toContain('href="/one-dsd/scenarios/' + scenario.id + '"');
    expect(html).toContain("Our hiring process");
    expect((await scenarioMetadata({ params: Promise.resolve({ id: "dsd-hiring-panel" }) })).title).toBe("Our hiring process");
  });
  it("does not expose withdrawn pages on the hub, details, or metadata", async () => {
    state.hidden.add("dsd-scenario.dsd-hiring-panel");
    state.hidden.add("dsd-program.hcbs-policy");
    const html = renderToStaticMarkup(await OneDsdPage());
    expect(html).not.toContain('href="/one-dsd/scenarios/dsd-hiring-panel"');
    expect(html).not.toContain('href="/one-dsd/programs/hcbs-policy"');
    expect((await scenarioMetadata({ params: Promise.resolve({ id: "dsd-hiring-panel" }) })).title).toBe("One DSD");
    await expect(ScenarioPage({ params: Promise.resolve({ id: "dsd-hiring-panel" }) })).rejects.toThrow();
    await expect(ProgramPage({ params: Promise.resolve({ id: "hcbs-policy" }) })).rejects.toThrow();
  });
  it("preserves next-step text but removes withdrawn destination links", async () => {
    const html = renderToStaticMarkup(await ScenarioPage({ params: Promise.resolve({ id: "dsd-hiring-panel" }) }));
    expect(html).toContain("Is this requirement job related?");
    expect(html).not.toContain('href="/resources/ja-job-relatedness-check"');
  });
  it("rejects unknown scenario and program ids", async () => {
    await expect(ScenarioPage({ params: Promise.resolve({ id: "unknown" }) })).rejects.toThrow();
    await expect(ProgramPage({ params: Promise.resolve({ id: "unknown" }) })).rejects.toThrow();
  });
});
