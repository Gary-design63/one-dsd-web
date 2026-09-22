import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import type { Lesson } from "@/lib/content/courses/source-types";
import { RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { sanitizedLesson } from "@/lib/content/courses/published";
import * as publications from "@/lib/content/editable-surfaces";

const state = vi.hoisted(() => ({ scope: "one-dhs" as "one-dhs" | "dsd", lessons: [] as { courseId: string; lesson: Lesson }[] }));
vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => state.scope }));
vi.mock("@/lib/auth/request", () => ({ ownerFromCookies: async () => false, editingModeFromCookies: async () => false }));
vi.mock("@/components/learning-journey-link", () => ({ LearningJourneyLink: () => null }));
vi.mock("@/components/course-lesson", () => ({
  CourseLesson: ({ courseId, lesson, companion }: { courseId: string; lesson: Lesson; companion?: ReactNode }) => {
    state.lessons.push({ courseId, lesson });
    return <section data-original-lesson={lesson.id}>{lesson.title}{companion}</section>;
  },
}));
import LessonPage from "@/app/courses/[courseId]/[lessonId]/page";

const course = RECOVERED_COURSES.find(pack => pack.course.id === "plain-language-in-human-services")!.course;
const source = course.lessons.find(lesson => lesson.id === "pl-how")!;
afterEach(() => { vi.restoreAllMocks(); state.scope = "one-dhs"; state.lessons.length = 0; });

it.each(["one-dhs", "dsd"] as const)("passes a separate companion slot in %s without changing source blocks or their order", async scope => {
  state.scope = scope;
  const before = JSON.stringify(source);
  const html = renderToStaticMarkup(await LessonPage({ params: Promise.resolve({ courseId: course.id, lessonId: source.id }) }));
  expect(html).toContain("Make the next action easy to find");
  expect(html.indexOf('data-original-lesson="pl-how"')).toBeLessThan(html.indexOf("Make the next action easy to find"));
  expect(state.lessons).toHaveLength(1);
  expect(state.lessons[0].lesson.blocks).toEqual(sanitizedLesson(source).blocks);
  expect(state.lessons[0].lesson.blocks).toHaveLength(3);
  expect(JSON.stringify(source)).toBe(before);
});

it("does not show the companion on a neighboring lesson or another course", async () => {
  const neighbor = course.lessons.find(lesson => lesson.id !== "pl-how")!;
  const other = RECOVERED_COURSES.find(pack => pack.course.id !== course.id)!.course;
  for (const params of [{ courseId: course.id, lessonId: neighbor.id }, { courseId: other.id, lessonId: other.lessons[0].id }]) {
    const html = renderToStaticMarkup(await LessonPage({ params: Promise.resolve(params) }));
    expect(html).not.toContain("Make the next action easy to find");
  }
});

it("keeps the lesson and companion unavailable when its course publication is withheld", async () => {
  vi.spyOn(publications, "editableSurfaceSource").mockReturnValue("postgres");
  vi.spyOn(publications, "loadPublishedEditableSurface").mockResolvedValue(undefined);
  await expect(LessonPage({ params: Promise.resolve({ courseId: course.id, lessonId: source.id }) })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  expect(state.lessons).toHaveLength(0);
});


