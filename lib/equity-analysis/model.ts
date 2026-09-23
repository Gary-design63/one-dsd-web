/**
 * The guided Equity Analysis Toolkit walkthrough: what each step teaches and
 * what it asks the staff member to write. Shared by the walkthrough (client),
 * the save routes (validation), the record page, and the register.
 *
 * Roles and dates only. No names, case details, or personal information are
 * requested, and the persistence contract rejects person-profile fields.
 */

export const ANALYSIS_KINDS = ["full", "scan", "pause"] as const;
export type AnalysisKind = (typeof ANALYSIS_KINDS)[number];

export const KIND_LABEL: Record<AnalysisKind, string> = {
  full: "Full analysis",
  scan: "Equity scan",
  pause: "Equity Pause",
};

export const ADMINISTRATIONS = [
  "Aging and Disability Services",
  "Behavioral Health",
  "Community Supports",
  "Health Care",
  "Operations",
  "Central Office",
] as const;
export type Administration = (typeof ADMINISTRATIONS)[number];

export const WORK_TYPES = [
  { id: "policy", label: "Policy, rule, or procedure" },
  { id: "budget", label: "Budget or funding decision" },
  { id: "hiring", label: "Hiring or workforce process" },
  { id: "it", label: "Technology system or digital channel" },
  { id: "contract", label: "Contract, grant, or request for proposals" },
  { id: "service", label: "Service delivery change" },
  { id: "engagement", label: "Community engagement plan" },
  { id: "other", label: "Other" },
] as const;
export type WorkType = (typeof WORK_TYPES)[number]["id"];
export const WORK_TYPE_IDS = WORK_TYPES.map((w) => w.id) as [WorkType, ...WorkType[]];

export const DISPOSITIONS = [
  { id: "approve", label: "Approve as written", note: "Benefits and burdens are named and the design already holds." },
  { id: "revise", label: "Revise before approval", note: "A design change is needed first. Say what and by when." },
  { id: "pause", label: "Pause", note: "Data or engagement is missing. Get it before the decision is final." },
  { id: "pilot", label: "Pilot", note: "Run it small, with the people who carry the burden, and set a review date." },
  { id: "reject", label: "Reject", note: "The burden cannot be reduced in this form." },
  { id: "escalate", label: "Escalate", note: "A formal path applies: civil rights, Tribal consultation, or labor relations." },
] as const;
export type Disposition = (typeof DISPOSITIONS)[number]["id"];
export const DISPOSITION_IDS = DISPOSITIONS.map((d) => d.id) as [Disposition, ...Disposition[]];

export type Field =
  | { id: string; type: "text"; label: string; hint?: string; required?: boolean; placeholder?: string }
  | { id: string; type: "textarea"; label: string; hint?: string; required?: boolean; placeholder?: string; rows?: number }
  | { id: string; type: "date"; label: string; hint?: string; required?: boolean }
  | { id: string; type: "choice"; label: string; hint?: string; required?: boolean; options: { value: string; label: string }[] };

export type Step = {
  id: string;
  /** Official toolkit step number; 0 for naming the work, 9 for the disposition. */
  number: number;
  title: string;
  kinds: AnalysisKind[];
  teach: {
    lead: string;
    points: string[];
    watchFor: string;
  };
  fields: Field[];
};

const YES_PARTLY_NO = [
  { value: "yes", label: "Yes" },
  { value: "partial", label: "Partly" },
  { value: "no", label: "No" },
];

/** The framing answers stored as their own fields on the record. */
export const FRAME_FIELD_IDS = ["work_title", "work_type", "administration", "approval_date"] as const;

export const STEPS: Step[] = [
  {
    id: "frame",
    number: 0,
    title: "Name the work",
    kinds: ["full", "scan", "pause"],
    teach: {
      lead: "If you cannot name the work in one sentence, the toolkit has nothing to hold yet. Start with the decision that is about to be made final.",
      points: [
        "A full analysis is expected when the effect lasts or needs leadership approval: policy, budget, hiring, technology, contracting, service delivery.",
        "An equity scan is the short form when time is short, or when you already did a full analysis and need a check. A scan is not a skip.",
        "The approval date is the deadline for the whole method. A form attached after the vote is not an analysis.",
      ],
      watchFor: "A blank toolkit added to the packet after the decision. That is decorating a choice.",
    },
    fields: [
      { id: "work_title", type: "text", label: "The work, in one sentence", placeholder: "Move county visit requests from phone to an online form.", required: true },
      { id: "work_type", type: "choice", label: "What kind of work is it?", required: true, options: WORK_TYPES.map((w) => ({ value: w.id, label: w.label })) },
      { id: "administration", type: "choice", label: "Administration", required: true, options: ADMINISTRATIONS.map((a) => ({ value: a, label: a })) },
      { id: "approval_date", type: "date", label: "Approval or launch date", hint: "The date the decision becomes final. The method has to finish before it." },
    ],
  },
  {
    id: "results",
    number: 1,
    title: "Desired results",
    kinds: ["full", "scan", "pause"],
    teach: {
      lead: "Write the action and the change you expect in twelve months. Then name who is affected differently, by race and the identities that intersect with it: language, disability, nationhood, geography, household.",
      points: [
        "“All Minnesotans will benefit” is not a group. If the packet cannot name a group, it cannot see a disparity.",
        "Which DHS areas does this touch: eligibility, notices, licensing, workforce, data?",
      ],
      watchFor: "A values paragraph where the outcome should be.",
    },
    fields: [
      { id: "action", type: "textarea", label: "The action and the change you expect within 12 months", required: true, rows: 3 },
      { id: "affected_groups", type: "textarea", label: "Who is affected differently", hint: "Name groups, not people. Race and the intersecting identities that apply to this work.", required: true, rows: 3 },
      { id: "dhs_areas", type: "text", label: "DHS areas this touches", placeholder: "Eligibility notices, county call centers, language access" },
    ],
  },
  {
    id: "data",
    number: 2,
    title: "Data",
    kinds: ["full", "scan"],
    teach: {
      lead: "Break the average apart. Who waits, who is removed, who is hired, who completes, by the groups you named in step 1.",
      points: [
        "Workforce and community data both count. So do complaints, appeals, and call-back rates.",
        "Missing data is a finding. Write what you do not have and how you will get it.",
      ],
      watchFor: "A blended statewide number that hides who the process was built for.",
    },
    fields: [
      { id: "data_shows", type: "textarea", label: "What the data shows, broken out by group", required: true, rows: 4 },
      { id: "data_missing", type: "textarea", label: "What is missing, and how you will get it", rows: 2 },
    ],
  },
  {
    id: "engagement",
    number: 3,
    title: "Engagement",
    kinds: ["full"],
    teach: {
      lead: "Who did you hear, how, and what did they say? Then name who is still missing, usually the people who carry the burden.",
      points: [
        "A comment period with empty follow-up is not engagement.",
        "Tribal consultation is government to government. It is not a stakeholder workshop, and it is not optional when a Nation is affected.",
      ],
      watchFor: "Asking one colleague to speak for a community.",
    },
    fields: [
      { id: "heard_from", type: "textarea", label: "Who you heard from, how, and what they said", hint: "Describe groups and roles, not individuals.", required: true, rows: 4 },
      { id: "still_missing", type: "textarea", label: "Who is still missing", required: true, rows: 2 },
      {
        id: "tribal_consultation",
        type: "choice",
        label: "Tribal consultation",
        required: true,
        options: [
          { value: "not_applicable", label: "No Tribal Nation is affected" },
          { value: "requested", label: "Requested through Tribal and Urban Indian Relations" },
          { value: "completed", label: "Completed" },
          { value: "needed", label: "Needed and not yet started" },
        ],
      },
    ],
  },
  {
    id: "burdens",
    number: 4,
    title: "Benefits, burdens, and the design change",
    kinds: ["full", "scan", "pause"],
    teach: {
      lead: "Who is better off. Who pays in time, money, access, dignity, or risk. Then the one thing you will change in the design before approval.",
      points: [
        "A safeguard that lives only in a “we will monitor” sentence is not a change.",
        "Does the design change still match the result you wrote in step 1?",
      ],
      watchFor: "Two benefits, no burdens, and a promise to keep an eye on it.",
    },
    fields: [
      { id: "benefits", type: "textarea", label: "Benefits, and for whom", required: true, rows: 3 },
      { id: "burdens", type: "textarea", label: "Burdens and unintended consequences, and for whom", required: true, rows: 3 },
      { id: "design_change", type: "textarea", label: "The design change you will make before approval", hint: "Something that changes the work, not a promise to watch it.", required: true, rows: 3 },
    ],
  },
  {
    id: "statement",
    number: 5,
    title: "Equity impact statement",
    kinds: ["full"],
    teach: {
      lead: "Six to ten sentences: the action, the groups, what data and engagement showed, the main benefit, the main burden, the design change, the remaining risk.",
      points: [
        "Read it out loud. If it could fit any other project, rewrite it.",
        "No slogan. Every sentence should be one only this proposal could wear.",
      ],
      watchFor: "“This initiative advances equity for all Minnesotans.”",
    },
    fields: [{ id: "impact_statement", type: "textarea", label: "Equity impact statement", required: true, rows: 8 }],
  },
  {
    id: "accountability",
    number: 6,
    title: "Accountability",
    kinds: ["full", "scan"],
    teach: {
      lead: "Three rows, each with a role and a date: who reviews the effect, who reviews the outcome, and who tells the people affected, including the ones who carry the burden.",
      points: [
        "Roles, not names. This record is open to DHS staff.",
        "A date is what turns a promise into a task.",
      ],
      watchFor: "“Leadership will review.” No one, no when.",
    },
    fields: [
      { id: "impact_owner", type: "text", label: "Impact review: role", required: true, placeholder: "Program manager, Health Care eligibility" },
      { id: "impact_date", type: "date", label: "Impact review: date", required: true },
      { id: "outcome_owner", type: "text", label: "Outcome review: role", required: true },
      { id: "outcome_date", type: "date", label: "Outcome review: date", required: true },
      { id: "communication", type: "textarea", label: "Communication: role, date, and audience", hint: "Who tells whom, and when. Include the people who carry the burden.", required: true, rows: 2 },
    ],
  },
  {
    id: "alignment",
    number: 7,
    title: "Alignment",
    kinds: ["full"],
    teach: {
      lead: "Sit with your administration’s equity director or committee before the decision is final. Match the equity policy and the strategic plan in a sentence you could defend.",
      points: [
        "A conversation before the freeze, not a copy sent after the packet is final.",
        "Formal paths stay formal: civil rights, Tribal consultation, labor relations. The toolkit does not replace them.",
      ],
      watchFor: "Equity staff copied on the approval email.",
    },
    fields: [
      {
        id: "equity_director",
        type: "choice",
        label: "Equity director or committee",
        required: true,
        options: [
          { value: "consulted", label: "Consulted before the approval date" },
          { value: "scheduled", label: "Meeting scheduled before the approval date" },
          { value: "not_yet", label: "Not yet contacted" },
        ],
      },
      { id: "policy_alignment", type: "textarea", label: "How this matches the equity policy and the strategic plan", required: true, rows: 3 },
    ],
  },
  {
    id: "sustainability",
    number: 8,
    title: "Sustainability",
    kinds: ["full"],
    teach: {
      lead: "Is the safeguard real? People, money, data collection, engagement. If the phone line in your design change has no staff, the burden has not moved.",
      points: [
        "An unfunded safeguard is not a safeguard. Write that it is unfunded, then change the work or change the date.",
        "Can you actually collect the data you promised in step 2?",
      ],
      watchFor: "A safeguard in “year two” and a launch this quarter.",
    },
    fields: [
      { id: "funded", type: "choice", label: "The design change is funded", required: true, options: YES_PARTLY_NO },
      { id: "staffed", type: "choice", label: "The design change is staffed", required: true, options: YES_PARTLY_NO },
      { id: "data_capacity", type: "choice", label: "You can collect the data you promised", required: true, options: YES_PARTLY_NO },
      { id: "sustainability_note", type: "textarea", label: "What is not yet real, and what you will do about it", rows: 2 },
    ],
  },
  {
    id: "disposition",
    number: 9,
    title: "Disposition",
    kinds: ["full", "scan", "pause"],
    teach: {
      lead: "A scan is not a decision. Write the disposition: approve, revise, pause, pilot, reject, or escalate, and the sentence that explains it.",
      points: [
        "The disposition is what the program counts. It is also what the next person reads first.",
        "Escalate when a formal path applies. That is the toolkit working, not failing.",
      ],
      watchFor: "An analysis that ends without saying what happens next.",
    },
    fields: [
      { id: "disposition", type: "choice", label: "Disposition", required: true, options: DISPOSITIONS.map((d) => ({ value: d.id, label: `${d.label}: ${d.note}` })) },
      { id: "rationale", type: "textarea", label: "Why", required: true, rows: 3 },
    ],
  },
];

export type Answers = Record<string, string>;

/** Every answer field that lives inside the record's `answers` object. */
export const ANSWER_FIELD_IDS = STEPS.flatMap((s) => s.fields.map((f) => f.id)).filter(
  (id) => !(FRAME_FIELD_IDS as readonly string[]).includes(id) && id !== "disposition",
);

export const ANSWER_DATE_FIELD_IDS = ["impact_date", "outcome_date"] as const;

export function stepsFor(kind: AnalysisKind): Step[] {
  return STEPS.filter((s) => s.kinds.includes(kind));
}

export function fieldsFor(kind: AnalysisKind): Field[] {
  return stepsFor(kind).flatMap((s) => s.fields);
}

/** Field ids left blank that the kind requires. */
export function missingRequired(kind: AnalysisKind, answers: Answers, step?: Step): string[] {
  const fields = step ? step.fields : fieldsFor(kind);
  return fields.filter((f) => f.required && !(answers[f.id] ?? "").trim()).map((f) => f.id);
}

export const MAX_ANSWER_LENGTH = 4000;

export function workTypeLabel(id: string): string {
  return WORK_TYPES.find((w) => w.id === id)?.label ?? id;
}

export function dispositionLabel(id: string): string {
  return DISPOSITIONS.find((d) => d.id === id)?.label ?? id;
}

export function choiceLabel(field: Field, value: string): string {
  if (field.type !== "choice") return value;
  return field.options.find((o) => o.value === value)?.label ?? value;
}

export const FOLLOW_UP_KINDS = [
  { key: "approval", label: "Approval or launch", roleField: null, dateField: "approval_date" },
  { key: "impact", label: "Impact review", roleField: "impact_owner", dateField: "impact_date" },
  { key: "outcome", label: "Outcome review", roleField: "outcome_owner", dateField: "outcome_date" },
] as const;
export type FollowUpKey = (typeof FOLLOW_UP_KINDS)[number]["key"];
export const FOLLOW_UP_KEYS = FOLLOW_UP_KINDS.map((k) => k.key) as [FollowUpKey, ...FollowUpKey[]];

export type FollowUpStatus = "overdue" | "soon" | "later" | "done";

export function followUpStatus(daysOut: number, done: boolean, soonDays = 30): FollowUpStatus {
  if (done) return "done";
  if (daysOut < 0) return "overdue";
  if (daysOut <= soonDays) return "soon";
  return "later";
}

const DAY = 86_400_000;

export function daysBetween(fromIso: string, toDate: string): number {
  const from = new Date(fromIso.slice(0, 10) + "T00:00:00Z").getTime();
  const to = new Date(toDate + "T00:00:00Z").getTime();
  return Math.round((to - from) / DAY);
}

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
