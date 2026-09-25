import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { DSD_SCENARIOS } from "@/lib/dsd";
import { ResourceDownloads } from "@/components/resource-downloads";

const state = vi.hoisted(() => ({ editing: false, omitLearning: false }));
vi.mock("@/lib/auth/request", () => ({ ownerFromCookies: async () => true, editingModeFromCookies: async () => state.editing }));
vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => "one-dhs", requestedProductContext: async () => "one_dhs" }));
vi.mock("@/components/program-context", () => ({ ProgramContextNote: () => null, OneDsdContextPanel: () => null }));
vi.mock("@/components/learning-journey-link", () => ({ LearningJourneyLink: () => null }));
vi.mock("@/components/course-resume", () => ({ CourseResume: () => null }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string) => {
    const definition = getEditableSurfaceDefinition(id)!;
    const values = structuredClone(definition.approvedValues);
    if (state.omitLearning && id.startsWith("course.")) {
      const pack = values.pack as { course: { learning?: unknown } };
      delete pack.course.learning;
    }
    return { definition, values, published: null, available: true, canEdit: state.editing, scope: "one-dhs" };
  },
  EditableSurfaceRegion: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("@/lib/dsd/published", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/dsd/published")>()),
  loadDsdDestinations: async () => new Map<string, string>(),
}));

import CoursePage from "@/app/courses/[courseId]/page";
import ScenarioPage from "@/app/one-dsd/scenarios/[id]/page";
import SourcesPage from "@/app/learn/sources/page";

const course = RECOVERED_COURSES[0].course;
afterEach(() => { state.editing = false; state.omitLearning = false; });

describe("download control", () => {
  it("offers Word, Excel, PowerPoint and PDF with text labels and the page's own view", () => {
    const html = renderToStaticMarkup(<ResourceDownloads kind="scenario" id="dsd-hiring-panel" noun="scenario" scope="dsd" />);
    expect(html).toContain('data-resource-download="true"');
    expect(html).toContain('aria-label="Download this scenario"');
    expect(html).toContain("Download this scenario:");
    for (const [label, format] of [["Word", "docx"], ["Excel", "xlsx"], ["PowerPoint", "pptx"], ["PDF", "pdf"]]) {
      expect(html).toContain(`href="/api/downloads/scenario/dsd-hiring-panel?format=${format}&amp;view=one_dsd" download=""`);
      expect(html).toContain(`aria-label="Download this scenario as ${label}"`);
      expect(html).toContain(`>${label}</a>`);
    }
    expect(html.match(/<a /g)).toHaveLength(6);
    expect(html).toContain("Web page");
    expect(html).toContain("Plain text");
  });
});

describe("resource pages", () => {
  it("adds the download control to a One DSD scenario", async () => {
    const html = renderToStaticMarkup(await ScenarioPage({ params: Promise.resolve({ id: DSD_SCENARIOS[0].id }) }));
    expect(html).toContain('data-resource-download="true"');
    expect(html).toContain(`href="/api/downloads/scenario/${DSD_SCENARIOS[0].id}?format=docx&amp;view=one_dsd"`);
  });

  it("adds the download control to the research and sources register", async () => {
    const html = renderToStaticMarkup(await SourcesPage());
    expect(html).toContain('data-resource-download="true"');
    expect(html).toContain('href="/api/downloads/sources/register?format=pdf&amp;view=one_dhs"');
  });
});

describe("courses stay on the program", () => {
  it("omits optional outcomes while keeping the course outline visible", async () => {
    state.omitLearning = true;
    const html = renderToStaticMarkup(await CoursePage({ params: Promise.resolve({ courseId: course.id }) }));
    expect(html).not.toContain('href="#outcomes"');
    expect(html).not.toContain('id="outcomes"');
    expect(html).toContain('id="lessons"');
    expect(html).toContain("<h2>Course outline</h2>");
    expect(html).toContain(course.title);
  });

  it("shows every staff member a course with its share link and nothing to download", async () => {
    const html = renderToStaticMarkup(await CoursePage({ params: Promise.resolve({ courseId: course.id }) }));
    expect(html).toContain(course.title);
    expect(html).toContain('data-resource-share="true"');
    expect(html).toContain("Share this course");
    expect(html).not.toContain("data-resource-download");
    expect(html).not.toContain("/api/downloads/");
  });

  it("offers nothing to download on a course even in editing mode", async () => {
    state.editing = true;
    const html = renderToStaticMarkup(await CoursePage({ params: Promise.resolve({ courseId: course.id }) }));
    expect(html).toContain('data-resource-share="true"');
    expect(html).not.toContain("data-resource-download");
  });
});
