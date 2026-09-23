import { describe, expect, it } from "vitest";
import { ask } from "@/lib/intelligence/orchestrator";
import recovered from "./fixtures/dsd-reconstruction-5680911.json";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "@/lib/dsd";
import { DSD_PROGRAM_SURFACES, DSD_SCENARIO_SURFACES } from "@/lib/dsd/surfaces";
import { parseEditableSurfaceDocument, surfaceMayBeEditedInScope } from "@/lib/content/editable-surface-contract";
import { loadPublishedEditableSurface } from "@/lib/content/editable-surfaces";
import { indexedProgramResources, programResourceLinks } from "@/lib/intelligence/retrieval/program-resources";
import { dsdLinkAvailable, loadDsdDestinations } from "@/lib/dsd/published";

describe("complete original DSD restoration", () => {
  it("preserves all twelve programs and thirteen scenarios verbatim from reconstruction 5680911", () => {
    expect(DSD_PROGRAMS).toHaveLength(12);
    expect(DSD_SCENARIOS).toHaveLength(13);
    expect(DSD_PROGRAMS).toEqual(recovered.programs);
    expect(DSD_SCENARIOS).toEqual(recovered.scenarios);
  });
  it("validates every editable original without dropping fields or repeating approval", () => {
    for (const surface of [...DSD_PROGRAM_SURFACES, ...DSD_SCENARIO_SURFACES]) {
      const document = parseEditableSurfaceDocument(surface, { schemaVersion: 1, surfaceId: surface.surfaceId, scope: "dsd", values: surface.approvedValues });
      expect(document.values).toEqual(surface.approvedValues);
      expect(surfaceMayBeEditedInScope(surface, "dsd")).toBe(true);
      expect(surfaceMayBeEditedInScope(surface, "one-dhs")).toBe(false);
    }
    for (const scenario of DSD_SCENARIOS) {
      const values = DSD_SCENARIO_SURFACES.find(surface => surface.surfaceId === "dsd-scenario." + scenario.id)!.approvedValues;
      for (const key of ["title", "situation", "whatToNotice", "questions", "moves", "handoff"] as const) expect(values[key]).toEqual(scenario[key]);
    }
  });
  it("publishes each DSD resource only in its division scope and routes every exact name through ASK", async () => {
    const dsd = await indexedProgramResources("dsd");
    const shared = await indexedProgramResources("one-dhs");
    for (const surface of [...DSD_PROGRAM_SURFACES, ...DSD_SCENARIO_SURFACES]) {
      expect((await loadPublishedEditableSurface(surface.surfaceId, { scope: "dsd" }))?.values).toEqual(surface.approvedValues);
      expect(await loadPublishedEditableSurface(surface.surfaceId, { scope: "one-dhs" })).toBeUndefined();
      expect(shared.destinations.some(doc => doc.href === surface.route)).toBe(false);
      expect(dsd.destinations.some(doc => doc.href === surface.route)).toBe(true);
      expect(programResourceLinks("Where can I find " + surface.approvedValues.title + "?", dsd.destinations, 3).some(link => link.href === surface.route)).toBe(true);
    }
  }, 30000);
  it("carries every restored named destination through the complete ASK response", async () => {
    for (const surface of [...DSD_PROGRAM_SURFACES, ...DSD_SCENARIO_SURFACES]) {
      const result = await ask({ question: "Where can I find the program resource titled " + surface.approvedValues.title + "?", contextPreference: "one_dsd", researchMode: "program_only" });
      expect(result.kind, surface.surfaceId).toBe("answer");
      if (result.kind === "answer") expect(result.answer.nextActions.some(link => link.href === surface.route), surface.surfaceId).toBe(true);
    }
  }, 60000);
  it("connects every original practical next move to a current publication", async () => {
    const destinations = await loadDsdDestinations();
    const missing = DSD_SCENARIOS.flatMap(scenario => scenario.moves.filter(move => !dsdLinkAvailable(move.href, destinations)).map(move => ({ scenario: scenario.id, href: move.href })));
    expect(missing).toEqual([]);
  }, 30000);
});
