import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { publishedDevelopment, availableDevelopmentLink } from "@/lib/program/development-published";
import { DevelopmentResourceGuide } from "@/components/development-resource-guide";
import { DevelopmentFocus } from "@/components/development-focus";
import { developmentContext } from "@/lib/program/development";

const state = vi.hoisted(() => ({ resources: [] as Array<{ id: string; title: string; summary: string; status: string; type: string }>, courses: [] as Array<{ pack: { course: { id: string; title: string } } }> }));
vi.mock("@/components/editable-surface", () => ({ prepareEditableSurface: async () => ({ available: true, values: { accessIds: ["ja-language-access-checklist", "withdrawn-resource"] } }) }));
vi.mock("@/lib/content/staff-publications", () => ({
  loadStaffContentSnapshot: async ({ scope }: { scope: string }) => ({ items: state.resources.filter(item => scope === "dsd" || !item.id.startsWith("dsd-")) }),
  getPublishedStaffContent: async (id: string, { scope }: { scope: string }) => state.resources.find(item => item.id === id && (scope === "dsd" || !id.startsWith("dsd-"))),
}));
vi.mock("@/lib/content/courses/published", () => ({
  publishedCourses: async () => state.courses,
  courseContentItem: (pack: { course: { id: string; title: string } }) => ({ id: `course-${pack.course.id}`, title: pack.course.title, summary: "Published learning", status: "approved", type: "learning_module" }),
}));

beforeEach(() => {
  state.resources = [
    { id: "ja-language-access-checklist", title: "Language access checklist", summary: "Prepare language support", status: "approved", type: "checklist" },
    { id: "dsd-context-reference", title: "Division reference", summary: "Division context", status: "approved", type: "reference" },
    { id: "draft-resource", title: "Unpublished", summary: "Not staff content", status: "draft", type: "reference" },
  ];
  state.courses = [{ pack: { course: { id: "test-course", title: "A published course" } } }];
});
afterEach(() => vi.clearAllMocks());

describe("developmental guidance respects publication and scope", () => {
  it("uses only current publications, including after withdrawal, regardless of theme references", async () => {
    const first = await publishedDevelopment("one-dhs");
    expect(first.records.map(item => item.id)).toEqual(["ja-language-access-checklist", "course-test-course"]);
    expect(availableDevelopmentLink("/library/withdrawn-resource", first.records)).toBe(false);
    expect(availableDevelopmentLink("/courses/test-course", first.records)).toBe(true);
    state.courses = [];
    state.resources = [];
    const withdrawn = await publishedDevelopment("one-dhs");
    expect(withdrawn.records).toEqual([]);
    expect(availableDevelopmentLink("/courses/test-course", withdrawn.records)).toBe(false);
  });
  it("does not expose division resources through the shared collection or direct guide", async () => {
    const agency = await publishedDevelopment("one-dhs");
    const division = await publishedDevelopment("dsd");
    expect(agency.records.some(item => item.id === "dsd-context-reference")).toBe(false);
    expect(division.records.some(item => item.id === "dsd-context-reference")).toBe(true);
    expect(await DevelopmentResourceGuide({ resourceId: "dsd-context-reference", scope: "one-dhs" })).toBeNull();
    expect(await DevelopmentResourceGuide({ resourceId: "draft-resource" })).toBeNull();
  });
  it("provides a relevant onward route for an available practical tool", async () => {
    const html = renderToStaticMarkup(await DevelopmentResourceGuide({ resourceId: "ja-language-access-checklist" }));
    expect(html).toContain("/journeys/access-and-communication");
    expect(html).toContain("#practice");
    expect(html).not.toContain("withdrawn-resource");
  });
  it("does not invent a participant orientation from a focus or private route", () => {
    const html = renderToStaticMarkup(<DevelopmentFocus initialFocus="access-and-communication" />);
    expect(html).toContain("/journeys/access-and-communication");
    expect(html).not.toContain("<textarea");
    expect(renderToStaticMarkup(<DevelopmentFocus initialFocus="made-up-profile" />)).toContain("Choose a focus");
    expect(developmentContext("/consultant/program")).toBeUndefined();
    expect(developmentContext("/api/ask")).toBeUndefined();
    expect(developmentContext("/minnesota-communities/somali")?.journeyId).toBe("perspectives-and-culture");
  });
});
