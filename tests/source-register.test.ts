import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup, renderToReadableStream } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lintStaffCopy } from "@/lib/brand/lint";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { AUTHORED_COURSES } from "@/lib/content/courses/definitions";
import { loadPublishedEditableSurface } from "@/lib/content/editable-surfaces";
import { SOURCE_REGISTER, VERIFICATION_RECEIPTS, annotationsFor, authorityGroupFor, findSourceByHref, registerSourcesForStaff, registerSummary, sourceAnchor, sourcesForResource, verificationFor } from "@/lib/content/source-register";

vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => "one-dhs", requestedProductContext: async () => "one_dhs" }));
vi.mock("@/components/program-context", () => ({ ProgramContextNote: () => null }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string) => ({ definition: getEditableSurfaceDefinition(id), values: getEditableSurfaceDefinition(id)!.approvedValues, available: true, canEdit: false, scope: "one-dhs" }),
  EditableSurfaceRegion: ({ children }: { children: ReactNode }) => children,
}));

import SourcesPage from "@/app/learn/sources/page";

async function renderAsync(element: ReactNode): Promise<string> {
  const stream = await renderToReadableStream(element);
  await stream.allReady;
  return new Response(stream).text();
}

describe("source register", () => {
  it("covers every authored course source and correlates each source with the resources that cite it", () => {
    expect(SOURCE_REGISTER.sources.length).toBeGreaterThan(200);
    for (const pack of AUTHORED_COURSES) {
      const sources = sourcesForResource("authored_course", pack.course.id);
      expect(sources.length, pack.course.id).toBe(pack.sources.length);
      for (const source of pack.sources) expect(findSourceByHref(source.href)?.citations.some(c => c.resourceId === pack.course.id), source.href).toBe(true);
    }
    for (const source of SOURCE_REGISTER.sources) {
      expect(source.citations.length).toBeGreaterThan(0);
      if (source.kind === "external") expect(source.host).toBeTruthy();
      expect(sourceAnchor(source)).toMatch(/^source-[a-z0-9-]+$/);
    }
    expect(new Set(SOURCE_REGISTER.sources.map(sourceAnchor)).size).toBe(SOURCE_REGISTER.sources.length);
  });

  it("carries a receipt for every outside source and reports each state truthfully", () => {
    const outside = SOURCE_REGISTER.sources.filter(source => source.kind === "external");
    const receiptIds = new Set(VERIFICATION_RECEIPTS.receipts.map(receipt => receipt.sourceId));
    expect(VERIFICATION_RECEIPTS.summary).not.toBeNull();
    expect(outside.every(source => receiptIds.has(source.sourceId))).toBe(true);
    const states = new Map<string, number>();
    for (const source of outside) { const state = verificationFor(source).state; states.set(state, (states.get(state) ?? 0) + 1); }
    expect((states.get("reached") ?? 0) + (states.get("reached_moved") ?? 0) + (states.get("not_reached") ?? 0)).toBe(outside.length);
    expect(states.get("not_yet_checked")).toBeUndefined();
    for (const source of outside) expect(verificationFor(source).label).not.toMatch(/\b(reached|checked) on\b/i);
  });

  it("groups outside sources by the authority they carry and keeps program pointers off the staff page", () => {
    const groups = registerSourcesForStaff();
    expect(groups.map(group => group.group)).toContain("government");
    expect(groups.flatMap(group => group.sources).some(source => source.kind === "program_route")).toBe(false);
    expect(authorityGroupFor({ host: "mn.gov", kind: "external" })).toBe("government");
    expect(authorityGroupFor({ host: "www.w3.org", kind: "external" })).toBe("standards");
    expect(authorityGroupFor({ host: "askjan.org", kind: "external" })).toBe("disability_and_civil_rights");
    expect(registerSummary().outside).toBe(SOURCE_REGISTER.sources.filter(source => source.kind === "external").length);
  });

  it("uses plain staff wording on the page and keeps the annotations as the program wrote them", () => {
    const definition = getEditableSurfaceDefinition("sources.page")!;
    for (const value of Object.values(definition.approvedValues)) if (typeof value === "string") expect(lintStaffCopy(value)).toEqual([]);
    const policy = findSourceByHref("https://mn.gov/dhs/assets/equity-policy_tcm1053-646921.pdf")!;
    expect(annotationsFor(policy).length).toBeGreaterThan(3);
    expect(policy.citations.length).toBeGreaterThan(10);
  });

  it("renders every staff-facing source with its state and where it is used", async () => {
    const html = await renderAsync(createElement(SourcesPage));
    expect(html).toContain("Research and sources");
    expect(html).toContain('id="group-government"');
    expect(html).not.toMatch(/\b(reached|checked) on\b/i);
    expect(html).toContain("Named without an address");
    const entries = html.match(/class="[^"]*entry[^"]*"/g) ?? [];
    expect(entries.length).toBe(registerSourcesForStaff().reduce((n, group) => n + group.sources.length, 0));
    expect(renderToStaticMarkup(createElement("div"))).toBe("<div></div>");
  });
});
