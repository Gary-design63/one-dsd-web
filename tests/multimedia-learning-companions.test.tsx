import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { LearningCompanion } from "@/components/multimedia/learning-companion";
import { LEARNING_COMPANIONS, getLearningCompanion } from "@/components/multimedia/learning-companion-data";

it("resolves every companion to a real exact lesson with a practical work product", () => {
  const keys = new Set<string>();
  for (const example of LEARNING_COMPANIONS) {
    const key = example.courseId + "/" + example.lessonId;
    expect(keys.has(key), key).toBe(false);
    keys.add(key);
    const course = RECOVERED_COURSES.find(pack => pack.course.id === example.courseId)!.course;
    expect(course.lessons.some(lesson => lesson.id === example.lessonId), key).toBe(true);
    expect(example.practice.trim().length).toBeGreaterThan(30);
    expect(example.workProduct).toMatch(/notes|draft|record|write/i);
    expect(example.panels.length).toBeGreaterThanOrEqual(2);
  }
});

it("renders the process or comparison with complete native text annotations and no tracking controls", () => {
  for (const example of LEARNING_COMPANIONS) {
    const html = renderToStaticMarkup(<LearningCompanion courseId={example.courseId} lessonId={example.lessonId} />);
    expect(html).toContain("Fictional working example");
    expect(html).toContain('aria-labelledby="companion-' + example.courseId + "-" + example.lessonId + '"');
    expect((html.match(/<details/g) ?? []).length).toBe(example.panels.length);
    expect(html).toContain("Try it with the work");
    expect(html).not.toMatch(/<script|<iframe|<video|<audio|localStorage|data-track/);
  }
});

it("does not leak a companion to another lesson or an unknown course", () => {
  const example = LEARNING_COMPANIONS[0];
  expect(getLearningCompanion(example.courseId, "unrelated-lesson")).toBeUndefined();
  expect(renderToStaticMarkup(<LearningCompanion courseId="unrelated-course" lessonId={example.lessonId} />)).toBe("");
});

