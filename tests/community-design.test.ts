import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import recovered from "@/lib/content/community-design-data.json";
import { BRIEFS } from "@/lib/content/briefs";
import { communityDesignEnabled, communityDesignEntries } from "@/lib/content/community-design";
import { communityReadingGroups, FEATURED_COMMUNITY_IDS, orderCommunities } from "@/lib/content/community-presentation";
import { communityReadingSurfaceId, getCommunityReadingSurface } from "@/lib/content/community-reading-surface";
import { parseEditableSurfaceValues } from "@/lib/content/editable-surface-contract";
import { lintStaffCopy } from "@/lib/brand/lint";

describe("complete community design preview", () => {
  it("retains the writer Claude McKay without allowing product branding", () => {
    expect(lintStaffCopy("Claude McKay, Langston Hughes, and Zora Neale Hurston")).toEqual([]);
    expect(lintStaffCopy("Ask Claude about this brief").length).toBeGreaterThan(0);
  });
  it("accounts for every original community source without replacing the additional Deaf brief", () => {
    const rows = readFileSync("data/source-snapshots/donor-library/community-candidates.jsonl", "utf8").trim().split(/\r?\n/).map(line => JSON.parse(line));
    const sources = rows.filter(row => row.assetKind === "community_brief" || row.assetKind === "community_brief_unmatched_guide");
    expect(sources.filter(row => row.assetKind === "community_brief")).toHaveLength(40);
    expect(recovered.map(b => b.sourceId).sort()).toEqual(sources.map(b => b.assetId).sort());
    for (const source of sources) {
      const reading = recovered.find(b => b.sourceId === source.assetId)!;
      expect(reading.sections).toHaveLength(source.richOriginal.intelligenceGuide.chapters.length);
      for (const [i, chapter] of reading.sections.entries()) expect(chapter.body).toBe(source.richOriginal.intelligenceGuide.chapters[i].body);
    }
    expect(communityDesignEntries()).toHaveLength(42);
    expect(communityDesignEntries().some(b => b.id === "deaf-deafblind-hard-of-hearing")).toBe(true);
    for (const brief of BRIEFS) expect(communityDesignEntries().some(b => b.id === brief.id)).toBe(true);
  });
  it("keeps the owner's first six in order and all other entries reachable", () => {
    expect(communityDesignEntries().slice(0, 6).map(b => b.id)).toEqual(["african-american", "latino", "hmong", "somali", "karen", "oromo"]);
    expect(FEATURED_COMMUNITY_IDS).toHaveLength(13);
    const input = [{ id: "somali", title: "Somali" }, { id: "african-american", title: "African American" }];
    orderCommunities(input);
    expect(input[0].id).toBe("somali");
  });
  it("places each reading in exactly one thematic group without truncating it", () => {
    for (const brief of recovered) {
      const grouped = communityReadingGroups(brief.sections).flatMap(group => group.chapters);
      expect(grouped).toHaveLength(brief.sections.length);
      expect(new Set(grouped).size).toBe(brief.sections.length);
      for (const chapter of brief.sections) expect(grouped).toContain(chapter);
    }
  });
  it("enables the owner-approved presentation in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(communityDesignEnabled()).toBe(true);
    vi.unstubAllEnvs();
  });
  for (const brief of recovered) it(`keeps ${brief.id} full readings editable through the existing contract`, () => {
    const definition = getCommunityReadingSurface(communityReadingSurfaceId(brief.id))!;
    expect(definition.scopePolicy).toBe("inheritable");
    expect(parseEditableSurfaceValues(definition, definition.approvedValues)).toEqual(definition.approvedValues);
    expect(definition.fields).toHaveLength(brief.sections.length * 2 + 1);
  });
});
