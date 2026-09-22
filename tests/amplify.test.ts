import { describe, expect, it } from "vitest";
import { AMPLIFY_PAGES, AMPLIFY_SURFACES } from "@/lib/content/amplify";
import { parseEditableSurfaceValues, surfaceMayBeEditedInScope } from "@/lib/content/editable-surface-contract";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";

describe("Amplify Equity", () => {
  it("registers every page with DSD-only editing and valid plain-language copy", () => {
    for (const surface of AMPLIFY_SURFACES) {
      expect(getEditableSurfaceDefinition(surface.surfaceId)).toBe(surface);
      expect(surface.scopePolicy).toBe("dsd");
      expect(surfaceMayBeEditedInScope(surface, "one-dhs")).toBe(false);
      expect(surfaceMayBeEditedInScope(surface, "dsd")).toBe(true);
      expect(parseEditableSurfaceValues(surface, surface.approvedValues)).toEqual(surface.approvedValues);
    }
  });
  it("keeps every heading and body in the editable definition", () => {
    AMPLIFY_PAGES.forEach((page, p) => page.sections.forEach((_, i) => {
      expect(AMPLIFY_SURFACES[p].approvedValues[`section${i}Title`]).toBeTruthy();
      expect(AMPLIFY_SURFACES[p].approvedValues[`section${i}Body`]).toBeTruthy();
    }));
  });
  it("excludes private history and internal assessment details", () => {
    const copy = JSON.stringify(AMPLIFY_SURFACES.map(s => s.approvedValues));
    expect(copy).not.toMatch(/termination|terminated|2023|axial|project manager|orchestration|digital brain/i);
    expect(copy).toContain("Routine planning and hosting remain with the co-leads");
  });
  it("allows owner revisions without changing the other pages", () => {
    const s = AMPLIFY_SURFACES.find(s => s.surfaceId === "amplify.home")!;
    expect(parseEditableSurfaceValues(s, { ...s.approvedValues, title: "Amplify Equity together" }).title).toBe("Amplify Equity together");
    expect(AMPLIFY_SURFACES.find(s => s.surfaceId === "amplify.gatherings")!.approvedValues.title).toBe("Ideas for gathering");
  });
});
