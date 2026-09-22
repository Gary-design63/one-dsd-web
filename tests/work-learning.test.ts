import { describe, expect, it } from "vitest";
import { WORK_LEARNING_SURFACE, selectWorkLearning } from "@/lib/content/work-learning";
import { DSD_TEAM_SURFACE } from "@/lib/content/dsd-team";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { parseEditableSurfaceValues } from "@/lib/content/editable-surface-contract";
import { ORGANIZATIONAL_AREAS, organizationLineage } from "@/lib/product/workforce-map";
import type { ContentItem } from "@/lib/content/types";

describe("work-connected learning", () => {
  it("registers editable areas with valid copy", () => {
    for (const s of [WORK_LEARNING_SURFACE, DSD_TEAM_SURFACE]) {
      expect(getEditableSurfaceDefinition(s.surfaceId)).toBe(s);
      expect(parseEditableSurfaceValues(s, s.approvedValues)).toEqual(s.approvedValues);
    }
  });
  it("prioritizes the task and never adds unpublished or out-of-scope items", () => {
    const published = [{ id: "meeting" }, { id: "policy" }] as ContentItem[];
    const values = { policyIds: ["policy", "missing"], taskmeetingIds: ["meeting", "policy", "private"] };
    expect(selectWorkLearning(published, values, "policy", "meeting").map(i => i.id)).toEqual(["meeting", "policy"]);
  });
  it("accepts neither invented role keys nor empty context as a profile", () => {
    expect(selectWorkLearning([], { arbitraryIds: ["x"] }, "arbitrary")).toEqual([]);
    expect(selectWorkLearning([], {}, "", "")).toEqual([]);
  });
  it("keeps DSD within ADSA without inventing access grants", () => {
    expect(organizationLineage("dsd")).toEqual(["dsd", "adsa", "dhs"]);
    expect(organizationLineage("unknown")).toEqual([]);
    expect(new Set(ORGANIZATIONAL_AREAS.map(a => a.id)).size).toBe(ORGANIZATIONAL_AREAS.length);
    expect(DSD_TEAM_SURFACE.scopePolicy).toBe("dsd");
    expect(WORK_LEARNING_SURFACE.scopePolicy).toBe("inheritable");
  });
});
