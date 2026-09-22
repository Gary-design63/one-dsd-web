import type { CoursePack } from "./source-types";

/** User-requested course groupings, never a learner assessment or access gate. */
export const DIVERSITY_LEVELS = [
  { id: "foundation", prefix: "div-f", title: "Foundation", description: "Explore the concepts that help us recognize difference, question assumptions, and understand experiences beyond our own." },
  { id: "intermediate", prefix: "div-i", title: "Intermediate", description: "Work through specific situations, consider competing interpretations, and practice responses to bias and exclusion." },
  { id: "advanced", prefix: "div-a", title: "Advanced", description: "Examine research, institutional patterns, and complex cases. Design a considered response and test what changes." },
] as const;

export function groupDiversityCourses(published: readonly CoursePack[]) {
  return DIVERSITY_LEVELS.map(level => ({
    ...level,
    courses: published.filter(pack => pack.course.id.startsWith(level.prefix))
      .sort((a, b) => a.course.indexNumber - b.course.indexNumber),
  }));
}
