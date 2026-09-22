import type { Doc } from "./retrieval/search";

/** Identify the requested evaluation work, not merely the subject being evaluated. */
export function isMeasurementPlanningQuestion(question: string): boolean {
  const explicitPlan = /\b(?:measurement|evaluation)\s+(?:worksheet|plan|framework|approach)\b|\blogic model\b/i.test(question);
  const evaluate = /\b(?:measur\w*|evaluat\w*|indicator\w*|know whether|find out whether)\b/i.test(question);
  const programOutcome = /\b(?:equity|equitable|disparit\w*|service change|program|workplace|access|outcomes?|effectiveness|small.groups?|baseline)\b/i.test(question);
  return explicitPlan || (evaluate && programOutcome);
}

/** Inputs have already passed current publication and scope checks. */
export function isMeasurementResource(doc: Doc): boolean {
  return doc.id === "pn-measurement-without-surveillance" || doc.href === "/practice/measurement";
}

export function measurementStartingFramework(question: string): { shortAnswer: string; whyItMatters: string } {
  const letters = /\b(?:translat\w*|language)\b/i.test(question) && /\b(?:letters?|notices?)\b/i.test(question);
  return {
    shortAnswer: [
      "A tailored worksheet draft is not available just now. Here is a starting framework you can adapt; these are suggestions, not findings or established targets.",
      letters
        ? "1. Outcome — people can understand the letter and take the next service step."
        : "1. Outcome — describe the change you want to see in a service, decision, process, or workplace practice. Keep this distinct from counting activities completed.",
      letters
        ? "2. Indicator — consider the proportion of recipients who can explain the next step, alongside voluntary feedback on what remained unclear. Agree how to gather this information, the denominator, and the period before making comparisons."
        : "2. Indicator — choose an observable sign of that outcome, explain its denominator and period, and combine the pattern with voluntary feedback about people's experiences.",
      "3. Baseline and limits — record what is known before the change, what is missing, and other explanations for any difference. Do not invent a baseline, target, or claim that the change caused an improvement.",
      "4. Small-group privacy check — agree reporting groups and suppression with the data owner before sharing results. Combine or withhold small groups when someone could be identified; leave out names, confidential case details, and private learning records.",
      "5. Follow-through — identify responsible roles, invite affected people to help interpret the findings, and agree what decision the evidence will inform and when to revisit it.",
    ].join("\n\n"),
    whyItMatters: "A useful evaluation connects an intended outcome with evidence and a next decision while protecting the people represented in it. Any available program worksheet or practice note is linked below.",
  };
}
