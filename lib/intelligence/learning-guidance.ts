import type { Doc } from "./retrieval/search";

const JOURNEY_HREF = "/learn/intercultural";
const SECTIONS = [
  ["foundations", "Explore shared foundations"],
  ["perspectives", "Explore different perspectives"],
  ["communication", "Adapt communication"],
  ["decisions", "Apply learning to a decision"],
  ["reflection", "Reflect and continue learning"],
] as const;

/** Current published content only: a route in source code is not a publication. */
export function getLearningJourneyContext(docs: readonly Doc[]) {
  const journey = docs.find(doc => doc.href === JOURNEY_HREF);
  if (!journey) return undefined;
  return {
    sourceId: journey.id,
    title: journey.title,
    href: journey.href,
    guidance: journey.text.slice(0, 24_000),
    sections: SECTIONS.map(([id, label]) => ({ label, href: JOURNEY_HREF + "#" + id })),
  };
}

export type LearningJourneyContext = ReturnType<typeof getLearningJourneyContext>;

/** Only navigation fallback uses this signal; it never replaces a generated answer. */
export function isLearningNavigationQuestion(question: string): boolean {
  const subject = /\b(intercultural|IDI|DEIA|DEI|equity|cultural development|implicit bias|microaggressions?|white privilege)\b/i.test(question);
  const learning = /\b(learn(?:ing)?|courses?|modules?|lessons?|training|cultural development)\b/i.test(question);
  const idi = /\bIDI\b/i.test(question);
  const navigation = /\b(where|which|recommend|suggest|start|begin|learn(?:ing)?|explore|find|next)\b/i.test(question);
  return subject && (learning || idi) && navigation;
}

/** A question about this program's training recognition, not education credits generally. */
export function isProgramTrainingCreditQuestion(question: string): boolean {
  const credit = /\b(credits?|count(?:s|ing)? toward|satisf(?:y|ies)|fulfil\w*|substitut\w*|replace)\b/i.test(question);
  const training = /\b(training|courses?|learning|completion|completing)\b/i.test(question);
  const program = /\b(this program|this course|these courses|our program|One DHS|One DSD|People,? Access and Culture)\b/i.test(question);
  return credit && training && program;
}
