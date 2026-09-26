import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CoursePackSchema } from "@/lib/content/courses/contract";
import { AUTHORED_COURSES, COURSE_SURFACES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { courseText, lessonObjectives } from "@/lib/content/courses/published";
import { loadPublishedEditableSurface } from "@/lib/content/editable-surfaces";
import { lintStaffCopy } from "@/lib/brand/lint";
import originalPlan from "@/lib/content/courses/authored/disability-inclusion/plan.json";
import diversityPlan from "@/lib/content/courses/authored/diversity-plan.json";
import gapPlan from "@/lib/content/courses/authored/gap-plan.json";

const plan = [...originalPlan, ...diversityPlan, ...gapPlan];

const root = path.resolve(import.meta.dirname, "..");

describe("program-authored course packs", () => {
  it("serve their approved code values when the database holds no publication, while recovered courses still require one", async () => {
    const emptyStore = { readPublished: async () => undefined };
    const authored = await loadPublishedEditableSurface(`course.${AUTHORED_COURSES[0].course.id}`, { source: "postgres", scope: "one-dhs", store: emptyStore });
    expect(authored?.source).toBe("static");
    expect((authored?.values.pack as { course: { id: string } }).course.id).toBe(AUTHORED_COURSES[0].course.id);
    const recovered = await loadPublishedEditableSurface(`course.${RECOVERED_COURSES[0].course.id}`, { source: "postgres", scope: "one-dhs", store: emptyStore });
    expect(recovered).toBeUndefined();
    const stored = { readPublished: async () => authored };
    const fromDatabase = await loadPublishedEditableSurface(`course.${AUTHORED_COURSES[0].course.id}`, { source: "postgres", scope: "one-dhs", store: stored });
    expect(fromDatabase).toBe(authored);
  });

  it("validate against the course contract and stay apart from the recovered collection", () => {
    expect(AUTHORED_COURSES.length).toBe(plan.length);
    expect(AUTHORED_COURSES.map(pack => pack.course.id)).toEqual(plan.map(row => row.id));
    const recoveredIds = new Set(RECOVERED_COURSES.map(pack => pack.course.id));
    for (const pack of AUTHORED_COURSES) {
      expect(() => CoursePackSchema.parse(pack)).not.toThrow();
      expect(recoveredIds.has(pack.course.id)).toBe(false);
      expect(pack.course.indexNumber).toBeGreaterThan(1100);
      expect(pack.course.kind).toBe("course");
      expect(pack.course.governance?.status).toBeDefined();
    }
    expect(new Set(AUTHORED_COURSES.map(pack => pack.course.id)).size).toBe(AUTHORED_COURSES.length);
    expect(COURSE_SURFACES).toHaveLength(RECOVERED_COURSES.length);
  });

  it("follow the owner's shape: one course per module, four or five lessons, under one hour, matching the plan", () => {
    const byId = new Map(plan.map(row => [row.id, row]));
    for (const pack of AUTHORED_COURSES) {
      const row = byId.get(pack.course.id);
      expect(row, pack.course.id).toBeDefined();
      expect(pack.course.indexNumber).toBe(row!.indexNumber);
      expect(pack.course.seriesLabel).toBe(row!.seriesLabel);
      expect(pack.course.coverImage).toBe(row!.coverImage);
      expect(pack.course.coverAlt).toBe(row!.coverAlt);
      expect(pack.course.contentType).toBe(row!.contentType);
      expect(pack.course.lessons.length).toBeGreaterThanOrEqual(4);
      expect(pack.course.lessons.length).toBeLessThanOrEqual(5);
      const minutes = pack.course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
      expect(minutes, `${pack.course.id} total minutes`).toBeLessThan(60);
      expect(minutes).toBeGreaterThanOrEqual(36);
      expect(pack.course.duration).not.toMatch(/\b(?:6\d|[7-9]\d|\d{3,})\b/);
    }
  });

  it("give every lesson three to five observable objectives, a scenario with one recommended response, and a transfer prompt", () => {
    for (const pack of AUTHORED_COURSES) for (const lesson of pack.course.lessons) {
      const objectives = lessonObjectives(lesson);
      expect(new Set(objectives).size).toBeGreaterThanOrEqual(3);
      expect(new Set(objectives).size).toBeLessThanOrEqual(5);
      expect(objectives[0]).toBe(lesson.learning?.objective);
      expect(lesson.learning?.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(lesson.scenario?.options.filter(option => option.recommended)).toHaveLength(1);
      expect(lesson.transfer?.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.blocks.length).toBeGreaterThanOrEqual(5);
      expect(lesson.blocks.some(block => block.type === "knowledgeCheck")).toBe(true);
      expect(lesson.minutes).toBeGreaterThan(0);
    }
  });

  it("use existing cover photographs, unique interaction ids, secure sources, and staff voice", () => {
    const interactionIds = new Set<string>();
    for (const pack of AUTHORED_COURSES) {
      const cover = pack.course.coverImage.split("?")[0];
      expect(existsSync(path.join(root, "public", cover))).toBe(true);
      for (const source of pack.sources) expect(source.href).toMatch(/^https:\/\//);
      for (const lesson of pack.course.lessons) for (const block of lesson.blocks) {
        if (block.type === "knowledgeCheck" || block.type === "sorting") {
          expect(interactionIds.has(block.id)).toBe(false);
          interactionIds.add(block.id);
        }
        expect(["image", "video", "audio"]).not.toContain(block.type);
      }
      // Lesson and job-aid wording carries no years or retired terminology; governance dates are separate.
      const text = courseText({ lessons: pack.course.lessons, jobAid: pack.jobAid, subtitle: pack.course.subtitle, scope: pack.course.scope });
      expect(text).not.toMatch(/\bDEIA?\b/);
      expect(text).not.toMatch(/\b(?:19|20)\d{2}\b/);
      expect(lintStaffCopy(text).filter(finding => finding.code !== "ranking")).toEqual([]);
    }
  });
});
