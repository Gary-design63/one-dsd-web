/**
 * One DSD Consult: the words staff, leaders and the consultant all see.
 * Written in the program's own voice: warm, steady, plain, and specific.
 */
import { z } from "zod";

export const CONSULT_NAME = "One DSD Consult";

export const STATUSES = ["received", "acknowledged", "in_progress", "waiting_on_requester", "referred", "resolved", "withdrawn"] as const;
export type ConsultStatus = (typeof STATUSES)[number];
export const OPEN_STATUSES: readonly ConsultStatus[] = ["received", "acknowledged", "in_progress", "waiting_on_requester", "referred"];

export const STATUS_LABEL: Record<ConsultStatus, string> = {
  received: "Received",
  acknowledged: "Acknowledged",
  in_progress: "In progress",
  waiting_on_requester: "Waiting for more information",
  referred: "Passed to another office",
  resolved: "Resolved",
  withdrawn: "Withdrawn",
};

type StatusFacts = { status: ConsultStatus; ownerName: string | null; referredTo: string | null; acknowledgmentDueAt: string };

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "long", month: "long", day: "numeric" });
}

/** What the requester reads at the top of their request page: a headline and one supporting sentence. */
export function statusCopy(request: StatusFacts, overdue = false): { headline: string; detail: string } {
  const owner = request.ownerName ?? "The consultant";
  if (overdue && request.status === "received") {
    return {
      headline: "Your request is taking longer than expected",
      detail: "It has been more than two business days, so it has been flagged for the consultant and the Deputy Director to follow up. We are sorry for the wait.",
    };
  }
  switch (request.status) {
    case "received":
      return { headline: "The consultant has your request", detail: `You will hear back by ${longDate(request.acknowledgmentDueAt)}, with the name of the person who is taking it on.` };
    case "acknowledged":
      return { headline: "The consultant has acknowledged your request", detail: `${owner} is taking it on. You will see updates here as the work moves along.` };
    case "in_progress":
      return { headline: "The consultant is working on this with you", detail: `${owner} is taking it on. You will see updates here as the work moves along.` };
    case "waiting_on_requester":
      return { headline: "The consultant needs a little more from you", detail: `${owner} is waiting for more information before going further. Please check the history below for a note.` };
    case "referred":
      return { headline: "Your request has been passed to another office", detail: `This belongs with ${request.referredTo ?? "another office"}, which is better placed to help.` };
    case "resolved":
      return { headline: "This request is resolved", detail: "The outcome is recorded below." };
    case "withdrawn":
      return { headline: "You withdrew this request", detail: "Nothing more will happen unless you send a new request." };
  }
}

export const SUPPORT_TYPES = [
  "scoping_goals",
  "equity_embed_review",
  "access_language_check",
  "stakeholder_partner_map",
  "facilitation_prep",
  "policy_or_program_review",
  "other",
] as const;
export type SupportType = (typeof SUPPORT_TYPES)[number];

export const SUPPORT_LABEL: Record<SupportType, string> = {
  scoping_goals: "Help clarifying scope and goals",
  equity_embed_review: "Review of equity questions in the work",
  access_language_check: "Access and language review",
  stakeholder_partner_map: "Planning who to involve and how",
  facilitation_prep: "Help preparing to facilitate a session",
  policy_or_program_review: "Review of a policy or program decision",
  other: "Something else",
};

/** Used inside a sentence, after "looking for". */
export const SUPPORT_LOOKING_FOR: Record<SupportType, string> = {
  scoping_goals: "help clarifying scope and goals",
  equity_embed_review: "a review of the equity questions in the work",
  access_language_check: "an access and language review",
  stakeholder_partner_map: "help planning who to involve and how",
  facilitation_prep: "help preparing to facilitate a session",
  policy_or_program_review: "a review of a policy or program decision",
  other: "help of another kind",
};

export const TIMINGS = ["exploratory", "within_2_weeks", "hard_deadline", "live_urgent"] as const;
export type Timing = (typeof TIMINGS)[number];
/** How leaders and the consultant read it. */
export const TIMING_LABEL: Record<Timing, string> = {
  exploratory: "Planning ahead",
  within_2_weeks: "Needs support within two weeks",
  hard_deadline: "Has a firm deadline",
  live_urgent: "Already in use and needs prompt attention",
};

/** Whole sentences about timing, for messages written about the person rather than to them. */
export const TIMING_SENTENCE: Record<Timing, string> = {
  exploratory: "They are planning ahead.",
  within_2_weeks: "They would like support within two weeks.",
  hard_deadline: "They have a firm deadline.",
  live_urgent: "The work is already in use and needs prompt attention.",
};

/** How the requester says it. These are the same choices the Start page offers. */
export const TIMING_CHOICE: Record<Timing, string> = {
  exploratory: "I’m planning ahead",
  within_2_weeks: "I need support within two weeks",
  hard_deadline: "I have a firm deadline",
  live_urgent: "The work is already in use and needs prompt attention",
};

export const LEADER_ROLES = ["supervisor", "manager", "deputy_director", "division_director"] as const;
export type LeaderRole = (typeof LEADER_ROLES)[number];
export const LEADER_ROLE_LABEL: Record<LeaderRole, string> = {
  supervisor: "Supervisor",
  manager: "Manager",
  deputy_director: "Deputy Director",
  division_director: "Division Director",
};

/** Where matters that One DSD Consult does not handle belong. Matches the wording on the Support page. */
export const OTHER_OFFICES_NOTE =
  "Complaints, investigations, grievances, accommodation decisions, and discipline about a named person go to Employee Culture, Human Resources, or the civil-rights channel. Legal interpretation goes to the policy or legal owner. Anything touching a Tribal Nation goes to the Office of Indian Policy or your Tribal liaison first.";

/** Shown before sending when the wording suggests another office is the better place. */
export const REDIRECT_MESSAGE =
  "Some of the words in your request usually point to another office, such as Employee Culture, Human Resources, or the civil-rights channel. Those offices can act on these matters in ways the consultant cannot. If your question is about applying equity to the work itself, you are welcome to send it as written.";

/** Shown when a case, claim, or similar number is found. */
export const IDENTIFIER_MESSAGE =
  "This looks like it may include a case, claim, or other identifying number. Please describe the work in general terms and leave the number out. Everything else you typed is still here.";

export const ACK_BUSINESS_DAYS = 2;

export const REDIRECT_PATTERN = /\b(grievance|complain(?:t|ing)|harass(?:ment|ed|ing)|discriminat(?:ion|ed|ing)|retaliat(?:ion|ed|ing)|investigat(?:ion|e|ing)|disciplin(?:e|ary)|termination|fire[ds]?\b|lawsuit|union)\b/i;
const CASE_ID_PATTERN = /\b(?:case|claim|client|PMI|MA|MAXIS|MMIS)\s*(?:id|number|no\.?|#)?\s*[:#]?\s*\d{5,}\b|\b\d{3}-\d{2}-\d{4}\b/i;

const email = z.string().trim().toLowerCase().max(254).regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Please enter a work email address.");
const text = (min: number, max: number, ask: string, tooLong: string) =>
  z.string().trim().min(min, ask).max(max, `${tooLong} Please keep it to ${max} characters or fewer.`);

export const CreateRequestSchema = z.object({
  requesterName: text(1, 120, "Please add your name.", "That name is a little long."),
  requesterEmail: email,
  requesterUnit: z.string().trim().max(160).optional().default(""),
  supervisorName: text(1, 120, "Please add your supervisor's name.", "That name is a little long."),
  supervisorEmail: email,
  managerEmail: z.union([email, z.literal("")]).optional().default(""),
  workTitle: text(1, 200, "Please give the work a short name.", "That name is a little long."),
  supportType: z.enum(SUPPORT_TYPES),
  timing: z.enum(TIMINGS),
  situation: text(1, 4000, "Please describe the work in a few sentences.", "That description is a little long."),
  goals: text(1, 2000, "Please say what you would like to leave the consultation with.", "That answer is a little long."),
  /** The requester confirms this is not a complaint, grievance, investigation, accommodation or discipline matter. */
  confirmsGeneralWork: z.literal(true, { message: "Please confirm that you are asking about applying equity to your work." }),
  /** Set when the requester reviews the redirect notice and still wants the consultant to see it. */
  keepAfterRedirectNotice: z.boolean().optional().default(false),
  /** Honeypot. Real people leave it empty. */
  website: z.string().max(0).optional().default(""),
}).strict();
export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;

export function containsPrivateIdentifier(...fields: string[]): boolean {
  return fields.some((value) => CASE_ID_PATTERN.test(value));
}

export function needsRedirectNotice(...fields: string[]): boolean {
  return fields.some((value) => REDIRECT_PATTERN.test(value));
}

export const UpdateRequestSchema = z.object({
  status: z.enum(STATUSES).optional(),
  ownerName: z.string().trim().min(1).max(120).optional(),
  referredTo: z.string().trim().min(1).max(200).optional(),
  outcome: z.string().trim().min(1).max(1000).optional(),
  note: z.string().trim().min(1).max(1000).optional(),
  /** When false the note is for leaders and the consultant only. */
  noteVisibleToRequester: z.boolean().optional().default(true),
}).strict().refine((value) => Object.values(value).some((entry) => entry !== undefined && entry !== true), { message: "There is nothing to change yet." });
export type UpdateRequestInput = z.infer<typeof UpdateRequestSchema>;

export type ConsultRequest = {
  id: string;
  createdAt: string;
  updatedAt: string;
  requesterName: string;
  requesterEmail: string;
  requesterUnit: string | null;
  supervisorName: string;
  supervisorEmail: string;
  managerEmail: string | null;
  workTitle: string;
  supportType: SupportType;
  timing: Timing;
  situation: string;
  goals: string;
  status: ConsultStatus;
  ownerName: string | null;
  acknowledgmentDueAt: string;
  acknowledgedAt: string | null;
  referredTo: string | null;
  outcome: string | null;
  closedAt: string | null;
};

export type ConsultEvent = {
  id: number;
  requestId: string;
  occurredAt: string;
  actor: "requester" | "consultant" | "system";
  kind: "submitted" | "acknowledged" | "status_changed" | "owner_assigned" | "referred" | "outcome_recorded" | "note" | "withdrawn" | "overdue_flagged" | "notice_recorded";
  fromStatus: ConsultStatus | null;
  toStatus: ConsultStatus | null;
  note: string | null;
  visibleToRequester: boolean;
};

export type ConsultPerson = {
  email: string;
  displayName: string | null;
  role: LeaderRole;
  createdAt: string;
  tokenIssuedAt: string;
  revokedAt: string | null;
};

export type ConsultNotice = {
  id: number;
  requestId: string | null;
  toEmail: string;
  subject: string;
  body: string;
  createdAt: string;
  sentAt: string | null;
  attempts: number;
  lastError: string | null;
};

/** What a supervisor, manager, or director sees. No free-text situation or goals. */
export type LeaderRequestView = Pick<ConsultRequest,
  "id" | "createdAt" | "requesterName" | "requesterUnit" | "supervisorName" | "workTitle" | "supportType" | "timing" | "status" | "ownerName" | "acknowledgmentDueAt" | "acknowledgedAt" | "referredTo" | "outcome" | "closedAt" | "updatedAt"
> & { overdue: boolean };
