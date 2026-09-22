import { describe, expect, it } from "vitest";
import {
  defineEditableSurface,
  parseEditableSurfaceDocument,
  parseEditableSurfaceMutation,
  surfaceMayBeEditedInScope,
  surfaceMayBeReadInScope,
  type EditableSurfaceDefinition,
  type EditableSurfaceValues,
} from "@/lib/content/editable-surface-contract";

function definition(overrides: Partial<EditableSurfaceDefinition> = {}) {
  return defineEditableSurface({
    surfaceId: "example.page",
    route: "/example",
    label: "Example page",
    scopePolicy: "inheritable",
    fields: [
      { key: "title", label: "Title", kind: "short", maxLength: 200 },
      { key: "introduction", label: "Introduction", kind: "long", maxLength: 2_000 },
      { key: "links", label: "Useful links", kind: "link-list", required: false, maxItems: 5 },
      { key: "sections", label: "Page sections", kind: "rich-blocks", required: false, maxItems: 20 },
    ],
    protectedFields: ["dhsLogo"],
    approvedValues: {
      title: "Example page",
      introduction: "Clear help for the work in front of you.",
      links: [{ label: "Ask a question", href: "/ask" }],
      sections: [
        { type: "heading", level: 2, text: "Begin with your question" },
        { type: "paragraph", text: "Choose the closest area of work and take the next useful step." },
      ],
    },
    ...overrides,
  });
}

function document(values: unknown = definition().approvedValues) {
  return { schemaVersion: 1 as const, surfaceId: "example.page", scope: "one-dhs" as const, values };
}

function validValues(): EditableSurfaceValues {
  return definition().approvedValues;
}

describe("editable surface contract", () => {
  it("accepts a complete registered document and closed rich blocks", () => {
    const parsed = parseEditableSurfaceDocument(definition(), document());
    expect(parsed.values.sections).toEqual([
      { type: "heading", level: 2, text: "Begin with your question" },
      { type: "paragraph", text: "Choose the closest area of work and take the next useful step." },
    ]);
  });

  it.each([
    ["an unregistered field", { ...validValues(), componentName: "Alert" }],
    ["the protected DHS logo", { ...validValues(), dhsLogo: "replacement.svg" }],
    ["Markdown", { ...validValues(), introduction: "**Important**" }],
    ["an icon", { ...validValues(), introduction: "Start here 🧭" }],
    ["technical product language", { ...validValues(), introduction: "The API returns a payload." }],
    ["unsafe links", { ...validValues(), links: [{ label: "Continue", href: "javascript:alert(1)" }] }],
    ["arbitrary rich content", { ...validValues(), sections: [{ type: "html", text: "<script />" }] }],
  ] satisfies Array<[string, unknown]>) ("rejects %s", (_label, values) => {
    expect(() => parseEditableSurfaceDocument(definition(), document(values))).toThrow();
  });

  it("requires every registered key, including optional fields", () => {
    const incomplete = Object.fromEntries(Object.entries(validValues()).filter(([key]) => key !== "links"));
    expect(() => parseEditableSurfaceDocument(definition(), document(incomplete))).toThrow();
  });

  it("does not let the browser invent a review dimension or alter another scope", () => {
    expect(() => parseEditableSurfaceMutation(definition(), {
      action: "record_review",
      scope: "one-dhs",
      revisionId: "11111111-1111-4111-8111-111111111111",
      dimension: "security",
      status: "pass",
      expectedReviewId: "22222222-2222-4222-8222-222222222222",
      note: null,
    })).toThrow();

    const dsdOnly = definition({ scopePolicy: "dsd" });
    expect(() => parseEditableSurfaceMutation(dsdOnly, {
      action: "save_draft",
      scope: "one-dhs",
      expectedRevisionId: null,
      document: document(),
      changeNote: null,
    })).toThrow();
  });

  it("separates inherited reading from mutation authority", () => {
    const agencyOnly = definition({ scopePolicy: "one-dhs" });
    expect(surfaceMayBeReadInScope(agencyOnly, "dsd")).toBe(true);
    expect(surfaceMayBeEditedInScope(agencyOnly, "dsd")).toBe(false);
    expect(surfaceMayBeEditedInScope(agencyOnly, "one-dhs")).toBe(true);
  });

  it("permits DSD to resume inheritance only on an inheritable surface", () => {
    const action = {
      action: "resume_inheritance",
      scope: "dsd",
      expectedPublicationDecisionId: "12",
      reason: "Return to the current One DHS wording.",
    };
    expect(parseEditableSurfaceMutation(definition(), action)).toEqual(action);
    expect(() => parseEditableSurfaceMutation(definition({ scopePolicy: "dsd" }), action)).toThrow();
  });
});
