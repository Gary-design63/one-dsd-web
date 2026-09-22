import "server-only";
import recovered from "./recovered.json";
import { CoursePackSchema } from "./contract";
import { defineEditableSurface, type EditableSurfaceDefinition } from "../editable-surface-contract";
import type { CoursePack } from "./source-types";
import { AUTHORED_COURSE_PACKS } from "./authored";
import { PRACTICE_INFRASTRUCTURE_PATHS } from "../paths-practice-infrastructure";

export const RECOVERED_COURSES: readonly CoursePack[] = recovered.map(pack => CoursePackSchema.parse(pack));
function courseSurface(pack: CoursePack): EditableSurfaceDefinition {
  return defineEditableSurface({
    surfaceId: `course.${pack.course.id}`, label: pack.course.title, route: `/courses/${pack.course.id}`, scopePolicy: "inheritable",
    fields: [{key:"pack",label:"Course content",kind:"course-pack",required:true}], approvedValues:{pack},
  });
}
/** Surfaces for the preserved recovered collection only; counts and hashes are pinned by tests. */
export const COURSE_SURFACES: readonly EditableSurfaceDefinition[] = RECOVERED_COURSES.map(courseSurface);
/** Program-authored courses, validated by the same contract and kept apart from the recovered bytes. */
export const AUTHORED_COURSES: readonly CoursePack[] = AUTHORED_COURSE_PACKS.map(pack => CoursePackSchema.parse(pack));
export const AUTHORED_COURSE_SURFACES: readonly EditableSurfaceDefinition[] = AUTHORED_COURSES.map(courseSurface);
/** Every course the program publishes. */
export const ALL_COURSE_SURFACES: readonly EditableSurfaceDefinition[] = [...COURSE_SURFACES, ...AUTHORED_COURSE_SURFACES];
/** Surfaces whose approved values in code serve staff until a database publication exists; a publication takes precedence. */
export const CODE_APPROVED_SURFACE_IDS: ReadonlySet<string> = new Set([
  ...AUTHORED_COURSE_SURFACES.map(surface => surface.surfaceId),
  ...PRACTICE_INFRASTRUCTURE_PATHS.map(path => `graduation-path.${path.id}`),
  // The Research and sources page wording is approved in code until the owner publishes a database revision.
  "sources.page",
]);
