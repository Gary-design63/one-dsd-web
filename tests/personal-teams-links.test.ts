import { describe, it, expect } from "vitest";
import { DSD_TEAM_SURFACE } from "@/lib/content/dsd-team";
import { AMPLIFY_SURFACES } from "@/lib/content/amplify";
import { parseEditableSurfaceValues, type EditableSurfaceLink } from "@/lib/content/editable-surface-contract";

describe("personal collaboration links", () => {
  it("keeps the two communities distinct and owner-editable", () => {
    const team = DSD_TEAM_SURFACE.approvedValues.links as EditableSurfaceLink[];
    const teamLink = team.find(link => link.label === "Open the team space")!;
    expect(teamLink.href).toBe("https://teams.live.com/l/community/FAAZGnsBn1D-N8ExQ");
    for (const surface of AMPLIFY_SURFACES) {
      const links = surface.approvedValues.resources as EditableSurfaceLink[];
      const link = links.find(link => link.label === "Open the Amplify space")!;
      expect(link.href).toBe("https://teams.live.com/l/community/FAAzQ3B2126KM9zcQ");
      expect(link.href).not.toBe(teamLink.href);
      expect(parseEditableSurfaceValues(surface, surface.approvedValues)).toEqual(surface.approvedValues);
    }
    expect(parseEditableSurfaceValues(DSD_TEAM_SURFACE, DSD_TEAM_SURFACE.approvedValues)).toEqual(DSD_TEAM_SURFACE.approvedValues);
  });
});
