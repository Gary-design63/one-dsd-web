import { describe, expect, it } from "vitest";
import { AUTHORED_COURSES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { CoursePackSchema } from "@/lib/content/courses/contract";
import { courseText, lessonObjectives } from "@/lib/content/courses/published";
import { groupDiversityCourses } from "@/lib/content/courses/diversity-series";
import { loadPublishedEditableSurface } from "@/lib/content/editable-surfaces";

const packs = AUTHORED_COURSES.filter(pack => /^div-[fia]/.test(pack.course.id));
describe("the diversity courses", () => {
  it("contains ten foundation, ten intermediate, and eleven advanced courses while preserving existing courses", () => {
    expect(packs).toHaveLength(31);
    expect(groupDiversityCourses(packs).map(group => group.courses.length)).toEqual([10, 10, 11]);
    expect(new Set(packs.map(pack => pack.course.title)).size).toBe(packs.length);
    const originalTitles = new Set([...RECOVERED_COURSES, ...AUTHORED_COURSES.filter(pack => !packs.includes(pack))].map(pack => pack.course.title));
    for (const pack of packs) expect(originalTitles.has(pack.course.title)).toBe(false);
    expect(RECOVERED_COURSES).toHaveLength(86);
  });

  it("supplies complete distinct teaching, objectives, practice, feedback, and tools", () => {
    const bodies = new Set<string>();
    for (const pack of packs) {
      expect(CoursePackSchema.safeParse(pack).success, pack.course.id).toBe(true);
      expect(pack.course.lessons).toHaveLength(4);
      expect(pack.sources.length).toBeGreaterThanOrEqual(2);
      expect(pack.jobAid.sections.length).toBeGreaterThanOrEqual(3);
      expect(courseText(pack.jobAid).split(/\s+/).length).toBeGreaterThanOrEqual(150);
      expect(pack.course.lessons.some(lesson => lesson.blocks.some(block => block.type === "sorting" || block.type === "flashcards"))).toBe(true);
      for (const lesson of pack.course.lessons) {
        const objectives = lessonObjectives(lesson);
        expect(objectives).toEqual(lesson.learning?.objectives);
        expect(objectives.length).toBeGreaterThanOrEqual(3);
        expect(objectives.length).toBeLessThanOrEqual(5);
        expect(new Set(objectives).size).toBe(objectives.length);
        const teaching = lesson.blocks.filter(block => block.type === "text").map(block => block.body).join(" ");
        expect(courseText(teaching).split(/\s+/).filter(Boolean).length, `${lesson.id}: teaching depth`).toBeGreaterThanOrEqual(300);
        expect(bodies.has(teaching), `${lesson.id}: duplicate lesson`).toBe(false);
        bodies.add(teaching);
        expect(lesson.scenario?.options.filter(option => option.recommended)).toHaveLength(1);
        expect(lesson.scenario?.options.every(option => option.response.length > 40)).toBe(true);
        expect(lesson.transfer?.options.length).toBeGreaterThanOrEqual(3);
        const checks = lesson.blocks.filter(block => block.type === "knowledgeCheck");
        expect(checks.length).toBeGreaterThanOrEqual(1);
        const scenarioAnswers = lesson.scenario?.options.map(option => option.label) ?? [];
        for (const check of checks) {
          expect(check.options.map(option => option.text), `${lesson.id}: independent knowledge check`).not.toEqual(scenarioAnswers);
        }
      }
    }
    expect(bodies.size).toBe(packs.length * 4);
  });

  it("resolves every course for both program scopes without a database publication", async () => {
    for (const scope of ["one-dhs", "dsd"] as const) {
      for (const pack of packs) {
        const publication = await loadPublishedEditableSurface(`course.${pack.course.id}`, {
          source: "postgres", scope, store: { readPublished: async () => undefined },
        });
        expect(publication, `${scope}:${pack.course.id}`).toBeDefined();
        expect(publication?.source).toBe("static");
      }
    }
  });

  it("never restores an absent course through the series grouping", () => {
    const allowed = packs.filter((_, index) => index % 2 === 0);
    expect(groupDiversityCourses(allowed).flatMap(group => group.courses)).toHaveLength(allowed.length);
    expect(groupDiversityCourses([]).every(group => group.courses.length === 0)).toBe(true);
  });
});
