import { clarifyPracticePath } from "@/lib/content/practice-path-clarifications";
import { renderServerPage } from "./helpers/render-server-page";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { domainForPath } from "@/lib/domains";
import { getEditableSurfaceDefinition, graduationPathSurfaceId } from "@/lib/content/staff-surface-registry";
import { canonicalStaffHref } from "@/lib/product";

const state = vi.hoisted(() => ({ scope: "one-dhs", hidden: new Set<string>() }));
vi.mock("@/lib/product/request-context", () => ({
  requestedContentScope: async () => state.scope,
  requestedProductContext: async () => state.scope === "dsd" ? "one_dsd" : "one_dhs",
}));
vi.mock("@/components/program-context", () => ({ ProgramContextNote: () => null, useProgramContext: () => ({ context: state.scope === "dsd" ? "one_dsd" : "one_dhs" }) }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string) => ({
    definition: getEditableSurfaceDefinition(id),
    values: getEditableSurfaceDefinition(id)!.approvedValues,
    available: !state.hidden.has(id), canEdit: false, scope: state.scope,
  }),
  EditableSurfaceRegion: ({ children, surface }: { children: ReactNode; surface: { available: boolean } }) => surface.available ? children : null,
}));
vi.mock("@/lib/auth/request", () => ({ ownerFromCookies: async () => null, editingModeFromCookies: async () => false }));
vi.mock("@/lib/intelligence/research", () => ({ governedResearchAvailability: async () => ({ enabled: false }) }));
import PathPage from "@/app/paths/[id]/page";
import PracticePage from "@/app/practice/page";
import AskPage from "@/app/ask/page";
const text = (value: string) => renderToStaticMarkup(createElement("span", null, value)).slice(6, -7);
beforeEach(() => { state.scope = "one-dhs"; state.hidden.clear(); });

describe("Complete practice page rendering", () => {
  it.each(GRADUATION_PATHS)("renders every worksheet control and complete step text for $id", async sourcePath => {
    const path = clarifyPracticePath(sourcePath);
    for (const scope of ["one-dhs", "dsd"]) {
      state.scope = scope;
      const html = await renderServerPage(await PathPage({ params: Promise.resolve({ id: path.id }) }));
      expect(html).toContain(text(path.title));
      expect(html).toContain(text(path.privacy));
      for (const step of path.steps) {
        expect(html).toContain(text(step.guidance));
        for (const link of step.links) {
          const href = scope === "one-dhs" && link.href.startsWith("/support/request") ? "/support/right-person" : canonicalStaffHref(link.href);
          expect(html).toContain(href.replaceAll("&", "&amp;"));
        }
      }
      for (const field of path.artifactFields) {
        expect(html).toContain(text(field.label));
        if (field.help) expect(html).toContain(text(field.help));
      }
      expect(html).toContain("Browse and download only");
      expect(html).not.toContain("Save these notes");
      expect(html).not.toContain("<textarea");
      const domain = domainForPath(path.id);
      if (domain) expect(html).toContain('href="/areas/' + domain.id + '"');
    }
  });

  it("lists all eleven paths and omits a withdrawn worksheet from both list and detail", async () => {
    let html = await renderServerPage(await PracticePage({}));
    for (const path of GRADUATION_PATHS) expect(html).toContain('href="/practice/' + path.id + '"');
    expect(html).toContain('href="/practice/measurement?');
    state.hidden.add("practice.measurement");
    state.hidden.add(graduationPathSurfaceId("gp-11"));
    html = await renderServerPage(await PracticePage({}));
    expect(html).not.toContain('href="/practice/gp-11"');
    expect(html).not.toContain('href="/practice/measurement');
    html = await renderServerPage(await PathPage({ params: Promise.resolve({ id: "gp-11" }) }));
    expect(html).not.toContain('id="f-gp-11-work_name"');
  });

  it("opens GP9 as a published topic card without a typed draft box", async () => {
    let html = await renderServerPage(await AskPage({ searchParams: Promise.resolve({ path: "gp-9", mode: "review" }) }));
    expect(html).toContain("Browse by kind of work");
    expect(html).toContain("Published answer");
    expect(html).not.toContain("Paste your draft here.");
    expect(html).not.toContain("<textarea");
    state.hidden.add(graduationPathSurfaceId("gp-9"));
    html = await renderServerPage(await AskPage({ searchParams: Promise.resolve({ path: "gp-9" }) }));
    expect(html).toContain("Browse by kind of work");
  });
});
