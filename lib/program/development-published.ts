import "server-only";
import { cache } from "react";
import { prepareEditableSurface } from "@/components/editable-surface";
import { publishedCourses, courseContentItem } from "@/lib/content/courses/published";
import { loadStaffContentSnapshot, type StaffProgramScope } from "@/lib/content/staff-publications";
import { developmentModel } from "./development";
import { resourceJourneys, resourceDevelopment } from "./development-membership";

export const publishedDevelopment = cache(async (scope: StaffProgramScope) => {
  const [hub, snapshot, courses] = await Promise.all([
    prepareEditableSurface("learn.hub", { scope, includeOwner: false }),
    loadStaffContentSnapshot({ scope }), publishedCourses(scope),
  ]);
  const unique = new Map(snapshot.items.filter(item => item.status === "approved").map(item => [item.id, item]));
  for (const { pack } of courses) unique.set(`course-${pack.course.id}`, courseContentItem(pack, { includeLessonBody: false }));
  const items = [...unique.values()];
  const records = items.map(item => ({
    id: item.id, title: item.title, summary: item.summary, type: item.type,
    href: item.id.startsWith("course-") ? `/courses/${encodeURIComponent(item.id.slice(7))}` : `/library/${encodeURIComponent(item.id)}`,
    journeyIds: resourceJourneys(item.id, hub.available ? hub.values : {}).map(journey => journey.id),
    contextHref: resourceDevelopment(item.id)?.contextHref,
    contribution: resourceDevelopment(item.id)?.purpose ?? (item.type === "learning_module" ? "Explore an idea, examine your interpretation, and use the learning in a practice opportunity."
      : ["tool", "checklist", "job_aid", "question_bank"].includes(item.type) ? "Use structured questions or a practical aid to examine a situation and prepare a next action."
      : item.type === "scenario" ? "Compare possible responses and explain what makes an approach more responsive to the people affected."
      : "Use this source to examine evidence and context before deciding what to do; check its authority and current applicability."),
  }));
  return { records, hubAvailable: hub.available, scope };
});

/** Only link to a content detail page if it exists in this scope's published collection. */
export function availableDevelopmentLink(href: string, records: Awaited<ReturnType<typeof publishedDevelopment>>["records"]): boolean {
  const path = href.split(/[?#]/)[0];
  if (/^\/(?:courses|library|resources)\//.test(path)) {
    return records.some(record => record.href === path || record.href.replace("/library/", "/resources/") === path);
  }
  return /^\/(?!\/)/.test(path);
}

export const developmentCoverage = (records: Awaited<ReturnType<typeof publishedDevelopment>>["records"]) => ({
  total: records.length,
  mappedToThemes: records.filter(record => record.journeyIds.length).length,
  referenceContext: records.filter(record => !record.journeyIds.length).length,
  journeys: developmentModel.journeys.map(journey => ({ id: journey.id, resources: records.filter(record => record.journeyIds.includes(journey.id)).length })),
});
