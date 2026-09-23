import { describe, expect, it, vi } from "vitest";
import { WORKFORCE_SURFACES } from "@/lib/content/workforce-editor";
import { parseEditableSurfaceValues, surfaceMayBeEditedInScope } from "@/lib/content/editable-surface-contract";
import { ORGANIZATIONAL_AREAS } from "@/lib/product/workforce-map";

vi.mock("@/lib/auth/owner-page", () => ({ ownerPageGuard: vi.fn(async () => false) }));
vi.mock("@/components/editable-surface", () => ({ prepareEditableSurface: vi.fn(), EditableSurfaceRegion: vi.fn() }));
import IndexPage from "@/app/consultant/workforce/page";
import AreaPage from "@/app/consultant/workforce/[areaId]/page";
import { prepareEditableSurface } from "@/components/editable-surface";

describe("consultant workforce map", () => {
  it("registers every baseline area with valid editable content", () => {
    expect(WORKFORCE_SURFACES).toHaveLength(ORGANIZATIONAL_AREAS.length);
    for (const surface of WORKFORCE_SURFACES) {
      expect(parseEditableSurfaceValues(surface, surface.approvedValues)).toEqual(surface.approvedValues);
      expect(surfaceMayBeEditedInScope(surface, "dsd")).toBe(false);
    }
  });
  it("allows adding role descriptions and keeping change notes", () => {
    const surface = WORKFORCE_SURFACES.find(s => s.surfaceId === "workforce.dsd")!;
    const revised = parseEditableSurfaceValues(surface, { ...surface.approvedValues,
      roles: [{ type: "heading", level: 3, text: "Program review" }, { type: "paragraph", text: "Responsibilities await local confirmation." }],
      changes: ["September 2026: responsibilities awaiting confirmation."],
    });
    expect(revised.roles).toHaveLength(2);
    expect(surface.approvedValues.changes).toEqual([]);
  });
  it("does not read or render protected area data without owner access", async () => {
    expect(await IndexPage()).toBeNull();
    expect(await AreaPage({ params: Promise.resolve({ areaId: "dsd" }) })).toBeNull();
    expect(prepareEditableSurface).not.toHaveBeenCalled();
  });
});
