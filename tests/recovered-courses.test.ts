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

  // These two staff-facing sentences were editorially updated to remove
  // encyclopedia references. Keep the donor snapshot unchanged for provenance.
  const approvedCopyEdit = (courseId: string, lessonIndex: number, blockIndex: number, before: string, after: string) => {
    const pack = snapshot.find((item: { course: { id: string } }) => item.course.id === courseId);
    const block = pack.course.lessons[lessonIndex].blocks[blockIndex];
    expect(block.body).toContain(before);
    block.body = block.body.replace(before, after);
  };
  approvedCopyEdit(
    "cultural-intelligence-african-american", 0, 0,
    "Wikipedia lines were not allowed to be the voice.",
    "Claims in the brief should be grounded in cited evidence.",
  );
  approvedCopyEdit(
    "cultural-intelligence-karen", 12, 0,
    "Community and media estimates have been cited near 20,000 Karen in Minnesota (including Wikipedia-style round numbers and local news). Date them as estimates. They are not Compass.",
    "Community estimates vary and should not be treated as a Minnesota Compass count. Verify the source and date before using a figure.",
  );

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
