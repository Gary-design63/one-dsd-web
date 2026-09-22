import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { publishedCourses } from "@/lib/content/courses/published";
import { AUTHORED_COURSES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";
const PUBLISHED_COURSE_COUNT = RECOVERED_COURSES.length + AUTHORED_COURSES.length;
import * as publications from "@/lib/content/editable-surfaces";
const state = vi.hoisted(() => ({ scope: "one-dhs" as "one-dhs" | "dsd" }));
vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => state.scope }));
vi.mock("@/lib/auth/request", () => ({ ownerFromCookies: async () => false, editingModeFromCookies: async () => false }));
vi.mock("@/components/program-context", () => ({ ProgramContextNote: () => null }));
import ResourcesPage from "@/app/resources/page";
const render = async (query: Record<string, string> = {}) => renderToStaticMarkup(await ResourcesPage({ searchParams: Promise.resolve(query) }));
const courseLinks = (html: string) => [...new Set([...html.matchAll(/href="\/courses\/([^/"?#]+)"/g)].map(match => match[1]))].sort();
afterEach(() => { vi.restoreAllMocks(); state.scope = "one-dhs"; });

it.each(["one-dhs", "dsd"] as const)("makes every currently published course, recovered and program-authored, browsable through Library in %s", async scope => {
  state.scope = scope;
  const courses = await publishedCourses(scope);
  expect(courses).toHaveLength(PUBLISHED_COURSE_COUNT);
  expect(courseLinks(await render())).toEqual(courses.map(({ pack }) => pack.course.id).sort());
});

it("shows one matching collection and no unrelated full catalog for a search with no results", async () => {
  const html = await render({ q: "xyznomatchingcourse99881", type: "learning_module" });
  expect(html).toContain('id="results-title"');
  expect(html).not.toContain('id="all-title"');
  expect(courseLinks(html)).toEqual([]);
  expect(html).not.toMatch(/href="\/library\/[^"?#]+"/);
});

it("finds a recovered course through a direct course route and respects format eligibility", async () => {
  const query = { q: "Outcomes, Not Intentions", type: "learning_module", authority: "learning" };
  const html = await render(query);
  expect(courseLinks(html)).toContain("outcomes-not-intentions");
  expect(html).not.toContain('id="all-title"');
  expect(html).not.toContain('href="/library/course-outcomes-not-intentions"');
  expect(html).toContain('name="type" value="learning_module"');
  expect(courseLinks(await render({ q: query.q, type: "job_aid" }))).toEqual([]);
});

it("removes withdrawn courses from both browsing and search without falling back to candidate source packs", async () => {
  const original = publications.loadPublishedEditableSurfaces;
  const hidden = "course.outcomes-not-intentions";
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (ids, scope) =>
    (await original(ids, scope)).filter(row => row.surfaceId !== hidden));
  expect(courseLinks(await render())).not.toContain("outcomes-not-intentions");
  expect(courseLinks(await render({ q: "Outcomes, Not Intentions" }))).not.toContain("outcomes-not-intentions");
  expect(courseLinks(await render())).toHaveLength(PUBLISHED_COURSE_COUNT - 1);
});

it.each([
  ["critical-incidents-in-the-work", "ci-write", "Critical Incidents"],
  ["plain-language-in-human-services", "pl-how", "Plain Language"],
])("also removes the exact media preview when %s is withdrawn", async (courseId, lessonId, query) => {
  expect(await render()).toContain(`href="/courses/${courseId}/${lessonId}"`);
  const original = publications.loadPublishedEditableSurfaces;
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (ids, scope) =>
    (await original(ids, scope)).filter(row => row.surfaceId !== "course." + courseId));
  for (const html of [await render(), await render({ q: query })]) {
    expect(courseLinks(html)).not.toContain(courseId);
    expect(html).not.toContain(`href="/courses/${courseId}/${lessonId}"`);
  }
  expect(courseLinks(await render())).toHaveLength(PUBLISHED_COURSE_COUNT - 1);
});
