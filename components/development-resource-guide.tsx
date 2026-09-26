import Link from "next/link";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { getPublishedStaffContent } from "@/lib/content/staff-publications";
import { prepareEditableSurface } from "@/components/editable-surface";
import { journeyHref } from "@/lib/program/development";
import { resourceJourneys, resourceDevelopment } from "@/lib/program/development-membership";

export async function DevelopmentResourceGuide({ resourceId, scope = "one-dhs" }: { resourceId: string; scope?: StaffProgramScope }) {
  // The containing course/resource page already checks its own publication. Load only
  // the hub and this resource here, rather than every course pack for a small signpost.
  const isCourse = resourceId.startsWith("course-");
  const [hub, resource] = await Promise.all([
    prepareEditableSurface("learn.hub", { scope, includeOwner: false }),
    isCourse ? Promise.resolve(undefined) : getPublishedStaffContent(resourceId, { scope }),
  ]);
  if (!isCourse && (!resource || resource.status !== "approved")) return null;
  const journeys = resourceJourneys(resourceId, hub.available ? hub.values : {});
  const mapped = resourceDevelopment(resourceId);
  const contribution = mapped?.purpose ?? (isCourse || resource?.type === "learning_module"
    ? "Explore the ideas and practice in this learning, consider what they change in your understanding, and choose a meaningful next step."
    : resource && ["tool", "checklist", "job_aid", "question_bank"].includes(resource.type)
      ? "Use this resource to examine a situation, prepare an action, and consider whose experience can help you check your approach."
      : "Use this source to examine evidence and context before deciding what to do. Consider its authority, what it establishes, and what remains uncertain.");
  return <aside className="development-resource" aria-label="Carry this resource into practice">
    <h2>Carry this into practice</h2>
    <p>{contribution}</p>
    {mapped?.contextHref ? <p><Link href={mapped.contextHref}>Connect this reference with your starting point →</Link></p> : null}
    {journeys.length ? <ul>{journeys.map(journey => <li key={journey.id}><Link href={journeyHref(journey.id)}><strong>{journey.title}</strong></Link><p>{journey.question}</p><Link href={journeyHref(journey.id, "practice")}>Explore a practice opportunity →</Link></li>)}</ul> : <p>Choose the question this resource helps you explore, compare it with another relevant perspective, and identify what it changes in your understanding. <Link href="/journeys">Find a pathway for that question →</Link></p>}
    <p><strong>Return to the experience:</strong> What did you notice or try, whose perspective informed it, and what would you keep or adjust?</p>
  </aside>;
}
