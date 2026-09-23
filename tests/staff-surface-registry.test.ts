import { clarifyPracticePath } from "@/lib/content/practice-path-clarifications";
import { describe, expect, it } from "vitest";
import { BRIEFS } from "@/lib/content/briefs";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import {
  EDITABLE_SURFACE_REGISTRY,
  applyCommunityBriefValues,
  applyGraduationPathValues,
  communityBriefSurfaceId,
  graduationPathSurfaceId,
  getEditableSurfaceDefinition,
} from "@/lib/content/staff-surface-registry";

describe("staff surface registry", () => {
  it("registers each page area once and includes every community brief", () => {
    const ids = EDITABLE_SURFACE_REGISTRY.map((surface) => surface.surfaceId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const brief of BRIEFS) {
      expect(getEditableSurfaceDefinition(communityBriefSurfaceId(brief.id))).toBeDefined();
    }
    for (const path of GRADUATION_PATHS) {
      expect(getEditableSurfaceDefinition(graduationPathSurfaceId(path.id))).toBeDefined();
    }
  });

  it("preserves complete paths and the explicit GP11 role/office presentation clarification", () => {
    for (const path of GRADUATION_PATHS) {
      const definition = getEditableSurfaceDefinition(graduationPathSurfaceId(path.id));
      expect(definition).toBeDefined();
      const original = structuredClone(path);
      expect(applyGraduationPathValues(path, definition!.approvedValues)).toEqual(clarifyPracticePath(path));
      expect(path).toEqual(original);
    }
  });

  it("preserves a complete community brief when approved wording is applied", () => {
    for (const brief of BRIEFS) {
      const definition = getEditableSurfaceDefinition(communityBriefSurfaceId(brief.id));
      expect(definition).toBeDefined();
      expect(applyCommunityBriefValues(brief, definition!.approvedValues)).toEqual(brief);
    }
  });

  it("keeps protected operational and review fields outside editable fields", () => {
    for (const brief of BRIEFS) {
      const definition = getEditableSurfaceDefinition(communityBriefSurfaceId(brief.id))!;
      const editable = new Set(definition.fields.map((field) => field.key));
      for (const protectedField of definition.protectedFields ?? []) {
        expect(editable.has(protectedField)).toBe(false);
      }
    }
  });
});
