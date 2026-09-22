const NAMED_PERSON =
  /\b([A-Z][A-Za-z]+(?:[-'][A-Za-z]+)?(?:\s+[A-Z]\.)?\s+[A-Z][A-Za-z]+(?:[-'][A-Za-z]+)?)(?:['’]s)?\b/g;

const CONTEXTUAL_PERSON =
  /\b(?:reviewed\s+by|assigned\s+to|met\s+with|sent\s+to|forwarded\s+to|follow(?:ed)?\s+up\s+with|contact|email|call|ask)\s+(?:the\s+)?(?!your\b|our\b|a\b|an\b|this\b|that\b)([A-Za-z][A-Za-z'-]*,\s*[A-Za-z][A-Za-z'-]*|[A-Z]\.\s*[A-Za-z][A-Za-z'-]*|[A-Za-z][A-Za-z'-]*(?:\s+[A-Z]\.)?\s+[A-Za-z][A-Za-z'-]*)\b/gi;

const INITIAL_SURNAME = /\b[A-Z]\.\s*[A-Za-z][A-Za-z'-]*\b/g;
const SURNAME_GIVEN = /\b[A-Za-z][A-Za-z'-]*,\s*[A-Za-z][A-Za-z'-]*\b/g;
const PERSON_ACTION =
  /\b([A-Za-z][A-Za-z'-]*\s+[A-Za-z][A-Za-z'-]*)\s+(?:will\s+(?:review|contact|attend|follow|call|email|meet|send|join|lead|respond)|attended|requested|reported|said|met|sent|called|emailed|contacted)\b/gi;

const APPROVED_ROLE_LABELS = new Set([
  "One DSD",
  "Equity Director",
  "Equity Specialist",
  "Program Manager",
  "Human Resources",
  "Disability Services",
  "People Access",
  "Greater Minnesota",
  "Minnesota Department",
  "Tribal Nation",
  "Tribal Nations",
  "Indian Policy",
  "Employee Culture",
  "Opportunity Accommodation",
  "Emerging Leaders",
  "DSD Team",
].map((label) => label.toLocaleLowerCase("en-US")));

export const OWNER_STATUS_REASON_TEMPLATES = [
  "This request is outside One DSD consultation scope. Contact your administration Equity Director for consultation support.",
  "This request is outside One DSD consultation scope. Contact your administration Equity Specialist for consultation support.",
  "This request cannot proceed through One DSD consultation. Contact your supervisor or manager for the appropriate support route.",
  "More information is needed before this request can proceed. Use the consultation request form again when the general work details are ready.",
] as const;

export const OWNER_NOTE_TEMPLATES = [
  "General consultation planning note",
  "Access or language follow-up needed",
  "Scheduling follow-up needed",
  "Scope clarification needed",
  "Stakeholder or partner planning needed",
  "Community input planning needed",
  "Ready for the next workflow step",
] as const;

const OWNER_STATUS_REASON_SET = new Set<string>(OWNER_STATUS_REASON_TEMPLATES);
const OWNER_NOTE_SET = new Set<string>(OWNER_NOTE_TEMPLATES);

export function ownerQueueTextIsApprovedTemplate(
  field: "status_reason" | "owner_notes",
  value: string,
): boolean {
  return (field === "status_reason" ? OWNER_STATUS_REASON_SET : OWNER_NOTE_SET).has(value);
}

function candidateIsApprovedRole(candidate: string): boolean {
  return APPROVED_ROLE_LABELS.has(
    candidate.replace(/\s+/g, " ").trim().toLocaleLowerCase("en-US"),
  );
}

/** Owner queue text uses roles and offices, never a person's proper name. */
export function ownerQueueContainsNamedPerson(value: string): boolean {
  for (const pattern of [NAMED_PERSON, CONTEXTUAL_PERSON, INITIAL_SURNAME, SURNAME_GIVEN, PERSON_ACTION]) {
    pattern.lastIndex = 0;
    for (const match of value.matchAll(pattern)) {
      const candidate = match[1] ?? match[0];
      if (candidate && !candidateIsApprovedRole(candidate)) return true;
    }
  }
  return false;
}
