import { describe, expect, it } from "vitest";
import { getLearningTilePresentation, LEARNING_TILE_DEFAULTS } from "@/lib/content/learning-catalog";
import {
  DEFAULT_EDITABLE_SURFACE_REVIEWS,
  parseEditableSurfaceValues,
  surfaceMayBeEditedInScope,
  surfaceMayBeReadInScope,
} from "@/lib/content/editable-surface-contract";
import { getEditableSurfaceDefinition, learningStageFieldKey } from "@/lib/content/staff-surface-registry";
import { LEARNING_STAGES } from "@/lib/product/learning";

const catalog = getEditableSurfaceDefinition("learn.catalog")!;

describe("Learning catalog presentation", () => {
  it.each(Object.entries(LEARNING_TILE_DEFAULTS))("maps %s to its own registered cover and description", (id, expected) => {
    expect(getLearningTilePresentation(id, catalog.approvedValues)).toEqual(expected);
  });

  it("uses edits without falling back to a default image, alt, or summary", () => {
    expect(getLearningTilePresentation("lm-workplace-climate", {
      climateImage: "/images/covers/new-climate.webp",
      climateImageAlt: "A team sharing ideas around a table.",
      climateSummary: "A revised introduction to team climate.",
    })).toEqual({
      imageSrc: "/images/covers/new-climate.webp",
      imageAlt: "A team sharing ideas around a table.",
      summary: "A revised introduction to team climate.",
    });
    expect(getLearningTilePresentation("lm-workplace-climate", {})).toBeUndefined();
    expect(getLearningTilePresentation("lm-workplace-climate", { climateImage: LEARNING_TILE_DEFAULTS["lm-workplace-climate"].imageSrc })).toBeUndefined();
    expect(getLearningTilePresentation("lm-workplace-climate", { ...catalog.approvedValues, climateImageAlt: "", climateSummary: "" })).toMatchObject({ imageAlt: "", summary: "" });
  });

  it("allows an editor to remove an image without resurrecting the default", () => {
    const values = parseEditableSurfaceValues(catalog, { ...catalog.approvedValues, climateImage: "", climateSummary: "An independently edited introduction to team climate." });
    expect(getLearningTilePresentation("lm-workplace-climate", values)).toEqual({
      imageSrc: "",
      imageAlt: catalog.approvedValues.climateImageAlt,
      summary: "An independently edited introduction to team climate.",
    });
  });

  it.each([
    "https://example.org/image.jpg", "//example.org/image.jpg", "javascript:alert(1)",
    "data:image/png;base64,AAAA", "/images/../private.jpg", "/images/%2e%2e/private.jpg",
    "/images/covers/photo.svg", "/images/covers/photo.jpg?redirect=https://example.org",
    "/images/covers/photo.jpg#fragment", "/images\\photo.jpg", "/images/photo.jpg\n",
    "/images/covers/<script>.jpg", "/api/photo.jpg",
  ])("never returns an unsafe or remote image: %s", (image) => {
    expect(getLearningTilePresentation("lm-workplace-climate", { ...catalog.approvedValues, climateImage: image })).toBeUndefined();
  });

  it.each(["gp-1", "orientation", "lm-how-this-program-works", "not-a-course", "toString", "__proto__"])("does not invent a thumbnail for %s", (id) => {
    expect(getLearningTilePresentation(id, catalog.approvedValues)).toBeUndefined();
  });

  it("registers a separate inheritable surface with the existing review rules", () => {
    expect(catalog.route).toBe("/learn");
    expect(catalog.scopePolicy).toBe("inheritable");
    expect(catalog.reviewDimensions).toEqual([...DEFAULT_EDITABLE_SURFACE_REVIEWS, "rights_and_consent", "community_representation"]);
    expect(parseEditableSurfaceValues(catalog, catalog.approvedValues)).toEqual(catalog.approvedValues);
    for (const scope of ["one-dhs", "dsd"] as const) {
      expect(surfaceMayBeReadInScope(catalog, scope)).toBe(true);
      expect(surfaceMayBeEditedInScope(catalog, scope)).toBe(true);
    }
    expect(catalog.approvedValues.staffGuideTitle).toBe("Staff guide");
    expect(() => parseEditableSurfaceValues(catalog, { ...catalog.approvedValues, published: true })).toThrow();
  });

  it("preserves the complete existing learn.page field schema and curriculum values", () => {
    const page = getEditableSurfaceDefinition("learn.page")!;
    expect(page.fields.map(({ key }) => key)).toEqual([
      "introKicker", "introTitle", "introLede", "stagesKicker", "stagesTitle", "stagesIntro", "stageLabel", "stageLinkLabel",
      "pathsTitle", "pathsIntro", "modulesTitle", "notesTitle",
      ...LEARNING_STAGES.flatMap((stage) => [learningStageFieldKey(stage.id, "label"), learningStageFieldKey(stage.id, "purpose"), learningStageFieldKey(stage.id, "outcomes")]),
    ]);
    expect(page.approvedValues.introTitle).toBe("Learning");
    expect(page.approvedValues.modulesTitle).toBe("Learning modules");
    for (const stage of LEARNING_STAGES) {
      expect(page.approvedValues[learningStageFieldKey(stage.id, "label")]).toBe(stage.label);
      expect(page.approvedValues[learningStageFieldKey(stage.id, "outcomes")]).toEqual([...stage.outcomes]);
    }
  });
});
