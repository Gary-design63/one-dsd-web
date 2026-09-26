import model from "./development.json";

export const developmentModel = model;
export type DevelopmentJourney = typeof model.journeys[number];
export type DevelopmentStage = typeof model.stages[number];
export const DEVELOPMENT_HREF = "/journeys";

export function developmentJourney(id: string): DevelopmentJourney | undefined {
  return model.journeys.find(journey => journey.id === id);
}

export function journeyHref(id: string, stage?: string): string {
  return `${DEVELOPMENT_HREF}/${encodeURIComponent(id)}${stage ? `#${encodeURIComponent(stage)}` : ""}`;
}

export function stageGuidance(journey: DevelopmentJourney, stage: string): string {
  switch (stage) {
    case "engage": return journey.question;
    case "recognize": return journey.assumption;
    case "examine": return `Consider the evidence and perspectives behind this question: ${journey.question} What remains uncertain, and what would change your interpretation?`;
    case "practice": return journey.practice;
    case "apply": return journey.application;
    case "reflect": return journey.reflection;
    default: return journey.summary;
  }
}

/** Public route context supplies guidance; no tracking or individual orientation is inferred. */
export function developmentContext(pathname: string): { title: string; body: string; journeyId?: string } | undefined {
  if (/^\/(?:api|consultant|contribute|share|journeys)(?:\/|$)/.test(pathname) || pathname === "/") return undefined;
  if (/^\/(?:courses|resources|library)\//.test(pathname)) return undefined;
  if (pathname.startsWith("/ask")) return { title: "Carry a useful answer forward", body: "When a question points to a change, explore whose perspective matters, rehearse an option, and choose a useful next step." };
  if (pathname.startsWith("/minnesota-communities")) return { title: "Let context open a conversation", body: "Use community knowledge to prepare respectful questions. Check the individual’s experience rather than treating a description as a prediction.", journeyId: "perspectives-and-culture" };
  if (pathname.startsWith("/one-dsd/leadership") || pathname === "/one-dsd/team/learning-lab" || pathname === "/one-dsd/amplify/mentoring") return { title: "Make room for practice", body: "Consider the time, support, feedback, and routines that let people use what they learn.", journeyId: "learning-and-leadership" };
  if (pathname.startsWith("/one-dsd") || pathname === "/employee-resource-groups") return { title: "Connect conversation with possibility", body: "Explore a perspective with willing colleagues, consider what it changes in your understanding, and choose a meaningful next step together.", journeyId: "workplace-culture" };
  if (pathname.startsWith("/areas/") && /access|language|communication|disability/.test(pathname)) return { title: "Turn an access question into a useful change", body: "Consider whose needs a routine approach misses, prepare an accessible alternative, and ask the people involved whether it helped.", journeyId: "access-and-communication" };
  if (pathname.startsWith("/areas/") && /leadership|management/.test(pathname)) return { title: "Support learning in everyday work", body: "Examine the expectations, time, and decision-making support that allow people to use a different approach.", journeyId: "learning-and-leadership" };
  if (pathname.startsWith("/areas/") && /culture|trust|workforce/.test(pathname)) return { title: "Examine participation and opportunity", body: "Explore whose experience a familiar practice overlooks, then prepare a change and check whether it improves access or influence.", journeyId: "workplace-culture" };
  if (pathname === "/practice/measurement") return { title: "Learn from what actually happened", body: "Distinguish a resource delivered from an approach used or an improvement observed. Consider other explanations and use the evidence to decide what to keep or adjust.", journeyId: "decisions-and-systems" };
  if (pathname.startsWith("/areas") || pathname.startsWith("/equity-policy") || pathname.startsWith("/practice") || pathname.startsWith("/paths") || pathname.startsWith("/toolkit")) return { title: "Move from a question to a change", body: "Examine the assumptions and barriers shaping this work, compare alternatives, and revisit what happens when an approach is tried.", journeyId: "decisions-and-systems" };
  if (pathname.startsWith("/support")) return { title: "Prepare for a useful conversation", body: "Bring the question, perspectives, evidence, and options you have explored. Identify what support or authority is needed to take the next step.", journeyId: "decisions-and-systems" };
  return { title: "Find a meaningful next step", body: "Connect what you discover with a question, a different perspective, a practice opportunity, or a change you can influence." };
}
