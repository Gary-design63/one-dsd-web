import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import originalStages from "./fixtures/learning-domain-links-5680911.json";
import { DOMAINS } from "@/lib/domains";
import { LEARNING_STAGES } from "@/lib/product/learning";
import { currentLearningStage, learningStagesForDomain, ORIGINAL_TO_CURRENT_STAGE } from "@/lib/domains/learning";
import { libraryHref, matchesLibraryFilters, normalizeLibraryFilters } from "@/lib/content/work-index";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import * as publications from "@/lib/content/editable-surfaces";
import { learningStageFieldKey } from "@/lib/content/staff-surface-registry";
const state = vi.hoisted(() => ({ scope: "one-dhs" as "one-dhs" | "dsd" }));
vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => state.scope }));
vi.mock("@/lib/auth/request", () => ({ ownerFromCookies: async () => false, editingModeFromCookies: async () => false }));
vi.mock("@/components/program-context", () => ({ ProgramContextNote: () => null }));
import DomainPage from "@/app/areas/[id]/page";
import ResourcesPage from "@/app/resources/page";
import StageAlias from "@/app/learn/[stage]/page";
const resourcesIn = (html: string) => [...new Set([...html.matchAll(/href="\/library\/([^"?#]+)(?:\?[^"#]*)?"/g)].map(match => match[1]))].sort();
afterEach(() => { vi.restoreAllMocks(); state.scope = "one-dhs"; });

it("maps every original domain-stage relationship to the existing six current stage anchors", async () => {
  for (const domain of DOMAINS) {
    const expected = originalStages.filter(stage => stage.domains.includes(domain.id)).map(stage => ORIGINAL_TO_CURRENT_STAGE[stage.id as keyof typeof ORIGINAL_TO_CURRENT_STAGE]).sort();
    const stages = learningStagesForDomain(domain.id);
    expect(stages.map(stage => stage.id).sort()).toEqual(expected);
    const html = renderToStaticMarkup(await DomainPage({ params: Promise.resolve({ id: domain.id }) }));
    for (const stage of stages) expect(html).toContain('href="/learn#' + stage.id + '"');
  }
  for (const id of [...Object.keys(ORIGINAL_TO_CURRENT_STAGE), ...LEARNING_STAGES.map(stage => stage.id)]) {
    const stage = currentLearningStage(id)!;
    expect(LEARNING_STAGES.some(candidate => candidate.id === stage.id)).toBe(true);
    await expect(StageAlias({ params: Promise.resolve({ stage: id }) })).rejects.toThrow("NEXT_REDIRECT");
  }
  expect(currentLearningStage("missing")).toBeUndefined();
  await expect(StageAlias({ params: Promise.resolve({ stage: "missing" }) })).rejects.toThrow();
});

it.each(["one-dhs", "dsd"] as const)("renders the actual scoped resources for every area and task in %s", async scope => {
  state.scope = scope;
  const snapshot = await loadStaffContentSnapshot({ scope });
  for (const domain of DOMAINS) {
    const domainPage = renderToStaticMarkup(await DomainPage({ params: Promise.resolve({ id: domain.id }) }));
    expect(domainPage).toContain('href="' + libraryHref({ area: domain.id }) + '"');
    for (const task of [undefined, ...domain.tasks]) {
      const filters = { area: domain.id, ...(task ? { task: task.id } : {}) };
      const expected = snapshot.items.filter(item => matchesLibraryFilters(item, filters)).map(item => item.id).sort();
      expect(expected.length, JSON.stringify(filters)).toBeGreaterThan(0);
      const html = renderToStaticMarkup(await ResourcesPage({ searchParams: Promise.resolve(filters) }));
      expect(resourcesIn(html)).toEqual(expected);
      if (task) expect(domainPage).toContain(libraryHref(filters).replaceAll("&", "&amp;"));
    }
  }
  if (scope === "one-dhs") expect(snapshot.items.every(item => item.scope !== "dsd")).toBe(true);
}, 30000);

it("combines query, format, source and task filters without dropping them on search or facet links", async () => {
  const input = { q: "degree", area: "workforce", task: "design-role", type: "job_aid", authority: "guidance" };
  const html = renderToStaticMarkup(await ResourcesPage({ searchParams: Promise.resolve(input) }));
  expect(resourcesIn(html)).toEqual(["ja-inclusive-hiring-lifecycle"]);
  for (const [key,value] of Object.entries(input).filter(([key]) => key !== "q")) expect(html).toContain('name="' + key + '" value="' + value + '"');
  for (const match of html.matchAll(/<a[^>]*href="(\/library\?[^"#]+)"[^>]*>/g)) {
    const query=new URL("http://local"+match[1].replaceAll("&amp;","&"));
    expect(query.searchParams.get("q")).toBe(input.q);
    const removesArea=match[0].includes('aria-label="Remove area filter"');
    const removesTask=match[0].includes('aria-label="Remove task filter"');
    if (query.searchParams.has("type") || query.searchParams.has("authority")) {
      expect(query.searchParams.get("area")).toBe(removesArea?null:input.area);
      expect(query.searchParams.get("task")).toBe(removesArea||removesTask?null:input.task);
    }
  }
  expect(normalizeLibraryFilters({ area: ["workforce"], task: ["design-role"], type: ["job_aid"], authority: ["guidance"] })).toEqual({ area: "workforce", task: "design-role", type: "job_aid", authority: "guidance" });
  expect(normalizeLibraryFilters({ area: "workforce", task: "not-a-workforce-task", type: "invented" })).toEqual({ area: "workforce" });
});

it("removes unavailable learning and Library destinations while retaining source content and owner-edited stage labels", async () => {
  const original = publications.loadPublishedEditableSurfaces;
  const hidden = new Set<string>();
  vi.spyOn(publications,"loadPublishedEditableSurfaces").mockImplementation(async (ids,scope) => (await original(ids,scope)).filter(row => !hidden.has(row.surfaceId)).map(row => row.surfaceId === "learn.page" ? { ...row, values: { ...row.values, [learningStageFieldKey("application","label")]: "Applied work with equity" } } : row));
  let html = renderToStaticMarkup(await DomainPage({ params: Promise.resolve({ id: "workforce" }) }));
  expect(html).toContain("Applied work with equity");
  hidden.add("learn.page"); hidden.add("library.page");
  html = renderToStaticMarkup(await DomainPage({ params: Promise.resolve({ id: "workforce" }) }));
  expect(html).not.toContain('href="/learn#'); expect(html).not.toContain('href="/library?area=');
  expect(html).toContain("Design a role and its qualifications");
});


it("keeps static community briefs in unfiltered search and excludes them when Library filters do not match", async () => {
  const briefHref = 'href="/minnesota-communities/tribal-nations"';
  const render = async (filters: Awaited<Parameters<typeof ResourcesPage>[0]["searchParams"]>) => renderToStaticMarkup(await ResourcesPage({ searchParams: Promise.resolve({ q: "Tribal Nations", ...filters }) }));
  expect(await render({})).toContain(briefHref);
  for (const filters of [{ area: "workforce", task: "design-role" }, { area: "workforce" }, { type: "job_aid" }, { authority: "guidance" }]) {
    expect(await render(filters), JSON.stringify(filters)).not.toContain(briefHref);
  }
  expect(await render({ authority: "under_review" })).toContain(briefHref);
});
