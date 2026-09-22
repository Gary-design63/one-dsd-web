import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";

const state = vi.hoisted(() => ({
  unavailable: new Set<string>(),
  owner: false,
  overrides: {} as Record<string, EditableSurfaceValues>,
}));

vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string, options?: { includeOwner?: boolean }) => {
    const definition = getEditableSurfaceDefinition(id)!;
    return {
      definition,
      values: { ...definition.approvedValues, ...state.overrides[id] },
      available: !state.unavailable.has(id),
      canEdit: state.owner && options?.includeOwner !== false,
    };
  },
  EditableSurfaceRegion: ({ children, surface }: {
    children: ReactNode;
    surface: { available: boolean; canEdit: boolean; definition: { surfaceId: string } };
  }) => surface.available ? children : surface.canEdit
    ? createElement("div", { "data-owner-editor": surface.definition.surfaceId }) : null,
}));

import { CommunityDesignIndex } from "@/components/community-design-index";
import { CommunityDesignPage } from "@/components/community-design-page";

describe("community publication visibility", () => {
  beforeEach(() => {
    state.unavailable.clear();
    state.owner = false;
    state.overrides = {};
  });

  it("keeps all 42 entries when their required publications are available", async () => {
    const html = renderToStaticMarkup(await CommunityDesignIndex({}));
    expect(html).toContain("42 community and place briefs");
    expect(html.match(/href="\/minnesota-communities\//g)).toHaveLength(42);
  }, 30_000);

  it.each(["community-reading.african-american", "community-brief.african-american"])(
    "omits a community from browse and search when %s is withdrawn",
    async surfaceId => {
      state.unavailable.add(surfaceId);
      state.overrides[surfaceId] = { title: "Unpublished private title" };
      const html = renderToStaticMarkup(await CommunityDesignIndex({}));
      expect(html).toContain("41 community and place briefs");
      expect(html).not.toContain('href="/minnesota-communities/african-american"');
      expect(html).not.toContain("Unpublished private title");
      const searched = renderToStaticMarkup(await CommunityDesignIndex({ query: "african-american" }));
      expect(searched).toContain("0 matching briefs");
      expect(searched).not.toContain("Unpublished private title");
    },
  );

  it.each(["community-reading.african-american", "community-brief.african-american"])(
    "does not return a blank successful detail page when %s is unavailable",
    async surfaceId => {
      state.unavailable.add(surfaceId);
      await expect(CommunityDesignPage({ id: "african-american" })).rejects.toThrow("NOT_FOUND");
    },
  );

  it("keeps owner editing access without revealing a withdrawn reading", async () => {
    state.owner = true;
    state.unavailable.add("community-reading.african-american");
    const html = renderToStaticMarkup(await CommunityDesignPage({ id: "african-american" }));
    expect(html).toContain('data-owner-editor="community-reading.african-american"');
    expect(html).not.toContain("History, culture, and life today");
    const directory = renderToStaticMarkup(await CommunityDesignIndex({}));
    expect(directory).not.toContain('href="/minnesota-communities/african-american"');
  });

  it("returns not found for a withdrawn directory while preserving owner controls", async () => {
    state.unavailable.add("communities.index");
    await expect(CommunityDesignIndex({})).rejects.toThrow("NOT_FOUND");
    state.owner = true;
    const html = renderToStaticMarkup(await CommunityDesignIndex({}));
    expect(html).toContain('data-owner-editor="communities.index"');
    expect(html).not.toContain('href="/minnesota-communities/african-american"');
  });

  it("keeps the approved new introduction instead of restoring legacy seeded wording", async () => {
    const html = renderToStaticMarkup(await CommunityDesignIndex({}));
    expect(html).toContain("Every community has a story.");
    expect(html).toContain("Find a community");
    expect(html).not.toContain("Short briefs to help you ask better questions");
    expect(html).not.toContain("Find a brief by community, language, or topic");
  });

  it("renders actual owner changes to the directory heading, introduction, and search wording", async () => {
    state.overrides["communities.index"] = {
      introTitle: "People and communities in Minnesota",
      introLede: "Histories and everyday experiences across our state.",
      searchLabel: "Search community names",
      searchExample: "For example: Hmong",
      searchButton: "Find a brief",
    };
    const html = renderToStaticMarkup(await CommunityDesignIndex({}));
    expect(html).toContain("<h1>People and communities in Minnesota</h1>");
    expect(html).toContain("Histories and everyday experiences across our state.");
    expect(html).toContain("Search community names</label>");
    expect(html).toContain('placeholder="For example: Hmong"');
    expect(html).toContain(">Find a brief</button>");
    expect(html).not.toContain("Every community has a story.");
  });
});
