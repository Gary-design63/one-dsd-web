import { expect, it } from "vitest";
import { RECOVERED_COURSES, COURSE_SURFACES } from "@/lib/content/courses/definitions";
import {readFileSync} from "node:fs";
const original = readFileSync("data/source-snapshots/donor-library/course-candidates.jsonl", "utf8").trim().split(/\r?\n/).map(line => JSON.parse(line).richOriginal.releasePack);

it("retains all original course packs, 780 lessons, and 5334 blocks without flattening", () => {
  // RECOVERED_COURSES comes back through CoursePackSchema.parse, so compare serialized
  // content (what this test actually guards — nothing lost or flattened), not object shape.
  const recovered = JSON.parse(JSON.stringify(RECOVERED_COURSES));
  const snapshot = JSON.parse(JSON.stringify(original));
  expect(recovered).toHaveLength(snapshot.length);

  // The community course titles were deliberately shortened after this snapshot was taken
  // (the "Cultural intelligence: " prefix was dropped). That is an editorial change, not a
  // loss: every current title must still be the tail of its snapshot title, and everything
  // else in each pack must match the snapshot exactly.
  for (let i = 0; i < snapshot.length; i += 1) {
    const { course: currentCourse, ...currentRest } = recovered[i];
    const { course: snapshotCourse, ...snapshotRest } = snapshot[i];
    const { title: currentTitle, ...currentCourseRest } = currentCourse;
    const { title: snapshotTitle, ...snapshotCourseRest } = snapshotCourse;
    expect(currentTitle, `${snapshotCourse.id} title`).toBeTruthy();
    expect(snapshotTitle.endsWith(currentTitle), `${snapshotCourse.id}: "${currentTitle}" must be the tail of "${snapshotTitle}"`).toBe(true);
    expect(currentCourseRest, `${snapshotCourse.id} course`).toEqual(snapshotCourseRest);
    expect(currentRest, `${snapshotCourse.id} pack`).toEqual(snapshotRest);
  }

  expect(COURSE_SURFACES).toHaveLength(86);
  expect(RECOVERED_COURSES.flatMap(pack=>pack.course.lessons)).toHaveLength(780);
  expect(RECOVERED_COURSES.flatMap(pack=>pack.course.lessons.flatMap(lesson=>lesson.blocks))).toHaveLength(5334);
});
