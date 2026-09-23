// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { CourseLesson } from "@/components/course-lesson";
import type { Lesson } from "@/lib/content/courses/source-types";

afterEach(() => { cleanup(); localStorage.clear(); });

it("keeps saved block answers aligned when a companion is introduced before reflection", async () => {
  const lesson = { id: "fixture", title: "Verification lesson", minutes: 1, summary: "Example", blocks: [{ type: "knowledgeCheck", question: "Choose the evidence", options: [{ text: "Observation", correct: true }, { text: "Assumption", correct: false }], feedbackCorrect: "Evidence retained", feedbackIncorrect: "Reconsider" }] } as Lesson;
  const saved = { schemaVersion: 1, fields: { "block-0": "0" }, submitted: { "block-0": true }, completed: true };
  localStorage.setItem("pac-course:fixture:fixture", JSON.stringify(saved));
  const view = render(<CourseLesson courseId="fixture" lesson={lesson} objectives={["Consider evidence"]} companion={<section aria-label="Additional example">Companion content</section>} next="/courses/fixture/next" />);
  await act(async () => { await Promise.resolve(); });
  expect((view.getByRole("radio", { name: "Observation" }) as HTMLInputElement).checked).toBe(true);
  expect(view.getByText("Evidence retained")).toBeTruthy();
  expect(view.queryByRole("textbox", { name: "Notes to take with you" })).toBeNull();
  expect((view.getByRole("checkbox", { name: "Mark this lesson complete" }) as HTMLInputElement).checked).toBe(true);
  expect(view.container.querySelectorAll("[data-course-block]")).toHaveLength(1);
  const companion = view.getByRole("region", { name: "Additional example" });
  expect(companion.compareDocumentPosition(view.getByRole("navigation", { name: "Lesson navigation" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(view.getByText(/Course notes are not typed or saved/)).toBeTruthy();
});
