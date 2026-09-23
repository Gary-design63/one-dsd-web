import { expect, it } from "vitest";
import { courseLink, safeCourseMarkup, sanitizedLesson } from "@/lib/content/courses/published";
import type { Lesson } from "@/lib/content/courses/source-types";

it("repairs confirmed retired source destinations in both links and embedded lesson markup", () => {
  const oldAda = "https://www.ada.gov/topics/title-i/";
  const currentAda = "https://www.eeoc.gov/disability-discrimination-and-employment-decisions";
  expect(courseLink(oldAda)).toBe(currentAda);
  expect(safeCourseMarkup(`<p><a href="${oldAda}">ADA Title I</a></p>`)).toBe(`<p><a href="${currentAda}">ADA Title I</a></p>`);
  expect(courseLink("https://philanos.org/resources/Documents/Conference%202020/Pre-Read%20PDFs/Continuum_AntiRacist.pdf#page=1"))
    .toBe("https://www.cacgrants.org/assets/ce/Documents/continuum.pdf#page=1");
});

it("keeps source content unchanged while repairing the displayed copy", () => {
  const old = "https://one-dhs-equity-resource.vercel.app/equal-opportunity-access";
  const lesson = { id: "link-check", title: "A source", blocks: [{ type: "text", html: `<p><a href="${old}">Employment</a></p>` }] } as unknown as Lesson;
  const snapshot = JSON.stringify(lesson);
  expect(JSON.stringify(sanitizedLesson(lesson))).toContain("/courses/equal-opportunity-in-employment");
  expect(JSON.stringify(lesson)).toBe(snapshot);
  expect(courseLink("javascript:alert(1)")).toBeUndefined();
  expect(courseLink("//untrusted.example")).toBeUndefined();
});
