/**
 * ConsultRequest schema, queue model, priority signals, and heads-up packet builder
 * (Consultation Intake & Queue v0.1 §3, §5, §6).
 */
import { z } from "zod";
import { PROGRAM } from "@/lib/constants";
import { questionBank, type LaunchType, type Stage } from "@/lib/content/question-banks";
import { corpusSearch, citationAttach, type Citation } from "../retrieval/search";
import { getBrief } from "@/lib/content/briefs";
import { getPath } from "@/lib/content/paths";
import {
  CONSULTATION_PARTICIPATION_NOTICE_ID,
  CONSULTATION_PARTICIPATION_NOTICE_VERSION,
} from "@/lib/participation/consultation-notice";

export {
  CONSULTATION_PARTICIPATION_NOTICE_ID,
  CONSULTATION_PARTICIPATION_NOTICE_VERSION,
};

export const STAGES = ["conceptual", "designing", "launching", "live_change"] as const;
export const SUPPORT_TYPES = ["scoping_goals", "equity_embed_review", "access_language_check", "stakeholder_partner_map", "facilitation_prep", "other"] as const;
export const TIMING = ["exploratory", "within_2_weeks", "hard_deadline", "live_urgent"] as const;
export const ROLES = ["program_ops", "supervisor", "equity_director_specialist", "analyst_tech", "communications", "procurement_contracts", "other"] as const;
export const MEETING_MODES = ["in_person", "virtual", "either", "not_sure"] as const;
export const POPULATIONS = [
  "language_access_needs",
  "disability_access",
  "rural_greater_minnesota",
  "older_adults",
  "children_families",
  "immigrant_refugee_general",
  "specific_minnesota_community",
  "tribal_nation",
] as const;
export const ACCESS_NEEDS = ["interpreter_for_consult", "captioning", "plain_language_materials", "timing_constraints", "other"] as const;
export const STATUSES = ["pending_eligibility_review", "received", "under_review", "scheduled", "in_progress", "completed", "declined", "withdrawn"] as const;
export const ELIGIBILITY_STATUSES = ["pending", "confirmed_dsd", "not_dsd"] as const;

export type Status = (typeof STATUSES)[number];
export type EligibilityStatus = (typeof ELIGIBILITY_STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  pending_eligibility_review: "Eligibility review",
  received: "Received",
  under_review: "Under review",
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

export const SUPPORT_LABEL: Record<(typeof SUPPORT_TYPES)[number], string> = {
  scoping_goals: "Help clarifying scope and goals",
  equity_embed_review: "Review of equity questions in the work",
  access_language_check: "Access and language review",
  stakeholder_partner_map: "Planning who to involve and how",
  facilitation_prep: "Help preparing to facilitate a session",
  other: "Other",
};

export const TIMING_LABEL: Record<(typeof TIMING)[number], string> = {
  exploratory: "Exploring options; no deadline",
  within_2_weeks: "Within about two weeks",
  hard_deadline: "Firm deadline",
  live_urgent: "Already in use or needs an urgent change",
};

export const STAGE_LABEL_CR: Record<(typeof STAGES)[number], string> = {
  conceptual: "Early idea",
  designing: "Planning or design",
  launching: "Preparing to begin",
  live_change: "Already in use and changing",
};

export const ROLE_LABEL: Record<(typeof ROLES)[number], string> = {
  program_ops: "Program or operations",
  supervisor: "Supervisor",
  equity_director_specialist: "Equity Director or Specialist",
  analyst_tech: "Analyst or technology",
  communications: "Communications",
  procurement_contracts: "Procurement or contracts",
  other: "Other",
};

export const POPULATION_LABEL: Record<(typeof POPULATIONS)[number], string> = {
  language_access_needs: "Language access needs",
  disability_access: "Disability or communication access",
  rural_greater_minnesota: "Rural or Greater Minnesota",
  older_adults: "Older adults",
  children_families: "Children and families",
  immigrant_refugee_general: "Immigrant or refugee communities (general)",
  specific_minnesota_community: "A specific Minnesota community (name it in the note)",
  tribal_nation: "A Tribal Nation (Office of Indian Policy must be consulted first)",
};

export const ACCESS_LABEL: Record<(typeof ACCESS_NEEDS)[number], string> = {
  interpreter_for_consult: "Interpreter for the consultation",
  captioning: "Captioning",
  plain_language_materials: "Plain-language materials",
  timing_constraints: "Timing constraints",
  other: "Other",
};

const CASE_ID_PATTERN = /\b(?:case|claim|client|PMI|MA|MAXIS|MMIS)\s*(?:id|number|no\.?|#)?\s*[:#]?\s*\d{5,}\b/i;

export function isPublicReferenceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return false;

    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
    if (
      !hostname ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".intranet") ||
      hostname.endsWith(".corp")
    ) {
      return false;
    }

    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
      const parts = hostname.split(".").map(Number);
      if (parts.some((part) => part > 255)) return false;
      const [a, b, c] = parts;
      if (
        a === 0 ||
        a === 10 ||
        a === 127 ||
        a >= 224 ||
        (a === 100 && b >= 64 && b <= 127) ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && (b === 0 || b === 168)) ||
        (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
        (a === 203 && b === 0 && c === 113)
      ) {
        return false;
      }
    }

    if (hostname === "::" || hostname === "::1" || /^f[cd]/i.test(hostname) || /^fe[89ab]/i.test(hostname)) return false;
    return hostname.includes(".") || hostname.includes(":");
  } catch {
    return false;
  }
}

const ConsultInputBaseSchema = z.object({
    program_context: z.literal("one_dsd", {
      error: "Direct consultation is available only for work within the Disability Services Division.",
    }),
    dsd_eligibility_attestation: z.literal(true, {
      error: "Please confirm that this request concerns work within the Disability Services Division.",
    }),
    requester_role: z.enum(ROLES).optional(),
    work_name: z
      .string()
      .trim()
      .min(3, "Please enter at least 3 characters for the program or work name.")
      .max(120, "Please keep the name under 120 characters.")
      .refine((v) => !CASE_ID_PATTERN.test(v), "Please use a program or work name, not a case number or identifier."),
    stage: z.enum(STAGES),
    goals: z.string().trim().min(20, "Please add a little more about what you hope to accomplish.").max(2000),
    equity_questions_considered: z.string().trim().max(2000).optional().default(""),
    desired_support_type: z.array(z.enum(SUPPORT_TYPES)).min(1, "Choose at least one kind of support."),
    support_other_note: z.string().trim().max(200).optional().default(""),
    timing_urgency: z.enum(TIMING),
    deadline_date: z.string().optional().default(""),
    affected_populations: z.array(z.enum(POPULATIONS)).optional().default([]),
    populations_note: z.string().trim().max(300).optional().default(""),
    access_language_needs: z.array(z.enum(ACCESS_NEEDS)).optional().default([]),
    access_note: z.string().trim().max(300).optional().default(""),
    preferred_meeting_mode: z.enum(MEETING_MODES).optional(),
    links: z
      .array(
        z
          .string()
          .trim()
          .url("Please enter each link as a full web address.")
          .refine(isPublicReferenceUrl, "Please use a public http or https web address. Intranet and private-network links cannot be included."),
      )
      .max(5)
      .optional()
      .default([]),
    attachment_notes: z.string().trim().max(500).optional().default(""),
    situation: z.string().trim().min(40, "Please add a little more about the situation and the support you need.").max(4000),
    ask_context: z
      .object({
        session_id: z.string().max(64),
        intents_tried: z.array(z.string().max(40)).max(10),
        excerpt: z.string().max(600),
      })
      .optional(),
    path_id: z.string().max(10).optional(),
    participation_notice_id: z.literal(CONSULTATION_PARTICIPATION_NOTICE_ID),
    participation_notice_version: z.literal(CONSULTATION_PARTICIPATION_NOTICE_VERSION, {
      error: "Please review the current consultation participation notice before submitting.",
    }),
    share_confirmation: z.literal(true, { error: "Please confirm that you understand how the information will be used." }),
  });

export const ConsultInputSchema = ConsultInputBaseSchema.superRefine((v, ctx) => {
    if (v.desired_support_type.includes("other") && !v.support_other_note) {
      ctx.addIssue({ code: "custom", path: ["support_other_note"], message: "Please describe the other support you need." });
    }
    if (v.timing_urgency === "hard_deadline") {
      if (!v.deadline_date || !/^\d{4}-\d{2}-\d{2}$/.test(v.deadline_date)) {
        ctx.addIssue({ code: "custom", path: ["deadline_date"], message: "Please enter the deadline date." });
      } else {
        const d = new Date(v.deadline_date + "T00:00:00Z").getTime();
        const weekAgo = Date.now() - 7 * 86400000;
        if (d < weekAgo) ctx.addIssue({ code: "custom", path: ["deadline_date"], message: "Please use a deadline in the future or within the past week." });
      }
    }
  });

export type ConsultInput = z.infer<typeof ConsultInputSchema>;

export const REQUESTER_CORRECTABLE_FIELDS = [
  "requester_role",
  "work_name",
  "stage",
  "goals",
  "equity_questions_considered",
  "desired_support_type",
  "support_other_note",
  "timing_urgency",
  "deadline_date",
  "affected_populations",
  "populations_note",
  "access_language_needs",
  "access_note",
  "preferred_meeting_mode",
  "links",
  "attachment_notes",
  "situation",
] as const;

export type RequesterCorrectableField = (typeof REQUESTER_CORRECTABLE_FIELDS)[number];

export const RequesterCorrectionSchema = ConsultInputBaseSchema.pick({
  requester_role: true,
  work_name: true,
  stage: true,
  goals: true,
  equity_questions_considered: true,
  desired_support_type: true,
  support_other_note: true,
  timing_urgency: true,
  deadline_date: true,
  affected_populations: true,
  populations_note: true,
  access_language_needs: true,
  access_note: true,
  preferred_meeting_mode: true,
  links: true,
  attachment_notes: true,
  situation: true,
})
  .partial()
  .strict()
  .refine((corrections) => Object.keys(corrections).length > 0, {
    message: "Change at least one field before saving.",
  });

export type RequesterCorrection = z.infer<typeof RequesterCorrectionSchema>;

export type ConsultRequest = ConsultInput & {
  record_type?: "consultation_request";
  request_id: string;
  access_key_hash: string;
  access_key_version: "sha256-v1";
  sensitivity_class: "S3";
  participation_class: "voluntary_shared";
  official_record: false;
  eligibility_status: EligibilityStatus;
  participation_acknowledged_at: string;
  retention_policy_id: string;
  retention_expires_at: string;
  submission_fingerprint: string;
  created_at: string;
  updated_at: string;
  version: number;
  status: Status;
  status_reason?: string;
  scheduled_for?: string;
  owner_notes?: string;
  pinned_order?: number;
  priority_signals: PrioritySignals;
  packet: HeadsUpPacket;
  correction_history?: Array<{
    at: string;
    fields: RequesterCorrectableField[];
    by: "requester";
  }>;
  history: Array<{ at: string; status: Status; by: "system" | "requester" | "owner"; note?: string }>;
};

/**
 * An expired consultation keeps only what is needed to prevent resurrection,
 * authenticate the requester's final status check, and prove the retention action.
 * All submitted text, packets, eligibility details, owner notes, and status history
 * are intentionally absent.
 */
export type ConsultRequestTombstone = {
  record_type: "consultation_tombstone";
  request_id: string;
  status: "expired";
  access_key_hash: string;
  access_key_version: "sha256-v1";
  retention_policy_id: string;
  retention_expires_at: string;
  redacted_at: string;
  updated_at: string;
  version: number;
};

export type ConsultationRecord = ConsultRequest | ConsultRequestTombstone;

export function isConsultRequestTombstone(value: unknown): value is ConsultRequestTombstone {
  return Boolean(
    value
      && typeof value === "object"
      && (value as Partial<ConsultRequestTombstone>).record_type === "consultation_tombstone",
  );
}

export function isConsultRequest(value: unknown): value is ConsultRequest {
  if (!value || typeof value !== "object" || isConsultRequestTombstone(value)) return false;
  const candidate = value as Partial<ConsultRequest>;
  return (
    typeof candidate.request_id === "string"
    && typeof candidate.retention_expires_at === "string"
    && typeof candidate.work_name === "string"
    && typeof candidate.access_key_hash === "string"
    && Array.isArray(candidate.history)
    && Boolean(candidate.packet)
  );
}

export type PrioritySignals = {
  urgency_weight: number;
  support_weight: number;
  stage_weight: number;
  total: number;
  tribal_gate: boolean;
  high_stakes: boolean;
};

export type HeadsUpPacket = {
  snapshot: Record<string, string>;
  summary: string[];
  equity_questions_considered: string[];
  suggested_questions: Array<{ id: string; category: string; text: string }>;
  related_resources: Citation[];
  risks_unknowns: string[];
  agenda: Array<{ minutes: number; item: string; owner: string }>;
  calendar_handoff: string;
  ask_context?: { intents_tried: string[]; excerpt: string };
};

/** Allowed transitions (§5). */
export const TRANSITIONS: Record<Status, Status[]> = {
  pending_eligibility_review: ["received", "declined", "withdrawn"],
  received: ["under_review", "declined", "withdrawn"],
  under_review: ["scheduled", "declined", "withdrawn", "in_progress"],
  scheduled: ["in_progress", "completed", "declined"],
  in_progress: ["completed", "declined"],
  completed: [],
  declined: [],
  withdrawn: [],
};

const VALID_STATUSES_BY_ELIGIBILITY: Record<EligibilityStatus, readonly Status[]> = {
  pending: ["pending_eligibility_review", "withdrawn"],
  confirmed_dsd: ["received", "under_review", "scheduled", "in_progress", "completed", "declined", "withdrawn"],
  not_dsd: ["declined"],
};

/** Keep eligibility and lifecycle status as one state machine, including combined owner updates. */
export function consultationStateIsValid(eligibility: EligibilityStatus, status: Status): boolean {
  return VALID_STATUSES_BY_ELIGIBILITY[eligibility].includes(status);
}

export function canTransition(from: Status, to: Status): boolean {
  return TRANSITIONS[from].includes(to);
}

/**
 * Validate one atomic change across the combined eligibility and lifecycle
 * state machine. Confirming DSD scope may also take one legal step from the
 * implicit `received` state in the same compare-and-swap operation.
 */
export function consultationTransitionIsValid(
  fromEligibility: EligibilityStatus,
  fromStatus: Status,
  toEligibility: EligibilityStatus,
  toStatus: Status,
): boolean {
  if (fromEligibility === toEligibility && fromStatus === toStatus) return true;
  if (fromEligibility === "pending" && fromStatus === "pending_eligibility_review") {
    if (toEligibility === "pending") return toStatus === "withdrawn";
    if (toEligibility === "not_dsd") return toStatus === "declined";
    if (toEligibility === "confirmed_dsd") {
      return toStatus === "received" || canTransition("received", toStatus);
    }
    return false;
  }
  return fromEligibility === "confirmed_dsd"
    && toEligibility === "confirmed_dsd"
    && canTransition(fromStatus, toStatus);
}

export function requesterCanWithdraw(status: Status): boolean {
  return status === "pending_eligibility_review" || status === "received" || status === "under_review";
}

export function requesterCanCorrect(status: Status): boolean {
  return status === "pending_eligibility_review" || status === "received" || status === "under_review";
}

/** queue.rank_suggest: work-item signals only, never people. */
export function prioritySignals(input: ConsultInput): PrioritySignals {
  const urgency: Record<(typeof TIMING)[number], number> = { live_urgent: 40, hard_deadline: 30, within_2_weeks: 20, exploratory: 10 };
  let urgency_weight = urgency[input.timing_urgency];
  if (input.timing_urgency === "hard_deadline" && input.deadline_date) {
    const days = Math.max(0, (new Date(input.deadline_date + "T00:00:00Z").getTime() - Date.now()) / 86400000);
    urgency_weight += Math.max(0, 10 - Math.min(10, days / 3));
  }
  const support_weight = input.desired_support_type.includes("scoping_goals") || input.desired_support_type.includes("equity_embed_review") ? 6 : input.desired_support_type.includes("facilitation_prep") ? 3 : 4;
  const stage_weight = input.stage === "conceptual" || input.stage === "designing" ? 5 : input.stage === "launching" ? 4 : 2;
  const tribal_gate = input.affected_populations.includes("tribal_nation");
  const high_stakes = /\b(procurement|contract|vendor|RFP|budget|statute|rule change|technology|system replacement|data sharing|algorithm)\b/i.test(`${input.goals} ${input.situation}`);
  return { urgency_weight, support_weight, stage_weight, total: urgency_weight + support_weight + stage_weight, tribal_gate, high_stakes };
}

export function rankSuggest<T extends { priority_signals: PrioritySignals; pinned_order?: number; created_at: string; status: Status }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.pinned_order !== undefined || b.pinned_order !== undefined) {
      if (a.pinned_order === undefined) return 1;
      if (b.pinned_order === undefined) return -1;
      return a.pinned_order - b.pinned_order;
    }
    if (b.priority_signals.total !== a.priority_signals.total) return b.priority_signals.total - a.priority_signals.total;
    return a.created_at.localeCompare(b.created_at);
  });
}

function launchTypeFor(input: ConsultInput): LaunchType {
  if (input.path_id === "gp-2") return "form_notice";
  if (input.path_id === "gp-3") return "engagement_effort";
  if (input.path_id === "gp-4") return "climate_effort";
  if (input.path_id === "gp-5") return "facilitation_session";
  if (input.path_id && /^gp-(?:[6-9]|10|11)$/.test(input.path_id)) {
    const path = getPath(input.path_id);
    if (path) return path.launchType;
  }
  const text = `${input.work_name} ${input.goals} ${input.situation}`.toLowerCase();
  if (/procure|contract|rfp|vendor/.test(text)) return "procurement_contract";
  if (/notice|letter|form\b/.test(text)) return "form_notice";
  if (/policy|rule|statute/.test(text)) return "policy_rule";
  if (/engag|outreach|listening|co-design|advisory/.test(text)) return "engagement_effort";
  if (/facilitat|training|session|huddle/.test(text)) return "facilitation_session";
  if (/budget/.test(text)) return "budget_decision";
  if (/data|technology|system|platform|algorithm/.test(text)) return "technology_data";
  if (/online|digital|portal|app\b|application|website/.test(text)) return "digital_application";
  return "program_service";
}

function fmtChicago(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: PROGRAM.displayTimeZone }).format(new Date(iso));
}

/** intake.summary_pack + agenda.consult_prep_draft + calendar.handoff_prep. Assistive; owner owns the outcome. */
export function buildHeadsUpPacket(input: ConsultInput, meta: { request_id: string; created_at: string; status: Status; signals: PrioritySignals; preview?: boolean }): HeadsUpPacket {
  const stage: Stage = input.stage;
  const launchType = launchTypeFor(input);
  const supports = input.desired_support_type.map((s) => SUPPORT_LABEL[s]).join("; ");

  const snapshot: Record<string, string> = {
    ...(meta.preview
      ? {}
      : {
          "Reference ID": meta.request_id,
          Status: STATUS_LABEL[meta.status],
          Submitted: fmtChicago(meta.created_at) + " (Central)",
        }),
    Stage: STAGE_LABEL_CR[input.stage],
    "Work name": input.work_name,
    "Desired support": supports + (input.support_other_note ? ` (${input.support_other_note})` : ""),
    "Timing": TIMING_LABEL[input.timing_urgency] + (input.deadline_date ? ` (${input.deadline_date})` : ""),
    "Preferred meeting mode": input.preferred_meeting_mode ? { in_person: "In person", virtual: "Virtual", either: "Either", not_sure: "Not sure yet" }[input.preferred_meeting_mode] : "Not stated",
    "Requester role": input.requester_role ? ROLE_LABEL[input.requester_role] : "Not stated",
  };

  const summary: string[] = [];
  summary.push(
    meta.preview
      ? `This preview is for "${input.work_name}." You described the work as ${STAGE_LABEL_CR[input.stage].toLowerCase()}.`
      : `This request concerns "${input.work_name}." The requester describes the work as ${STAGE_LABEL_CR[input.stage].toLowerCase()}.`,
  );
  summary.push(`${meta.preview ? "Your" : "Their"} goal: ${sentenceCase(input.goals)}`);
  summary.push(`${meta.preview ? "What you would" : "What they would"} like help with: ${sentenceCase(input.situation)}`);
  summary.push(`${meta.preview ? "You selected" : "They are asking for"} ${supports.toLowerCase()}.`);
  if (input.affected_populations.length) {
    summary.push(`Communities or populations named in general terms: ${input.affected_populations.map((p) => POPULATION_LABEL[p]).join(", ")}${input.populations_note ? ` (${input.populations_note})` : ""}.`);
  }
  if (input.access_language_needs.length) {
    summary.push(`Access and language needs for the consultation: ${input.access_language_needs.map((a) => ACCESS_LABEL[a]).join(", ")}${input.access_note ? ` (${input.access_note})` : ""}.`);
  }
  if (input.links.length) summary.push(`${meta.preview ? "Links you entered" : "Links provided"}: ${input.links.join(", ")}.`);
  if (input.attachment_notes) summary.push(`${meta.preview ? "Documents you plan to bring" : "Documents they will bring"}: ${input.attachment_notes}`);

  const considered = input.equity_questions_considered
    ? input.equity_questions_considered.split(/\n|;|\. /).map((s) => s.trim()).filter(Boolean)
    : ["No earlier steps were listed. Ask what the requester has already tried, then use the relevant checklist or questions to avoid repeating work."];

  const suggested = questionBank({ launchType, stage, max: 10 }).map((q) => ({ id: q.id, category: q.category, text: q.text }));

  const hits = corpusSearch(`${input.work_name} ${input.goals} ${input.situation} ${supports}`, { limit: 5 });
  const related = citationAttach(hits);
  if (input.affected_populations.includes("specific_minnesota_community") && input.populations_note) {
    const slug = input.populations_note.toLowerCase().replace(/[^a-z-]+/g, "-").replace(/^-+|-+$/g, "");
    const brief = getBrief(slug);
    if (brief) related.unshift({ id: brief.id, title: brief.title, href: `/minnesota-communities/${brief.id}`, authority: "under_review", authorityLabel: "Under review", reviewDate: brief.reviewDate, excerpt: brief.level0.whyItMattersForDhsWork.slice(0, 200), citeable: false });
  }

  const risks: string[] = [];
  risks.push("The program resources do not yet include a finalized set of official sources. Confirm any policy question with the person responsible for that policy; this consultation summary is not official guidance.");
  if (meta.signals.tribal_gate) risks.push("This request involves a Tribal Nation. Contact the Office of Indian Policy or the appropriate Tribal liaison before planning engagement. This summary does not include guidance specific to any Nation.");
  if (meta.signals.high_stakes) risks.push("This request involves a procurement, contract, budget, statute, technology, or data decision. Focus the consultation on the equity effects while leaving the decision with the responsible official.");
  if (input.affected_populations.includes("specific_minnesota_community") && !related.some((r) => r.href.startsWith("/minnesota-communities/"))) risks.push("A specific Minnesota community was named, but no matching brief was found. Ask the community or knowledgeable partners rather than filling the gap with assumptions.");
  if (!input.equity_questions_considered) risks.push("No earlier self-guided steps were listed. Offer the relevant checklist and questions before or during the consultation.");
  if (input.timing_urgency === "live_urgent") risks.push("The work is already in use or needs an urgent change. Keep the consultation focused on the immediate decision and agree on who will follow up.");
  if (related.length === 0) risks.push("The program resources did not include a close match. Note what is missing and confirm the next step with the appropriate person.");

  const agenda = agendaDraft(input);
  const calendar = calendarHandoff(input, meta.preview ? undefined : meta.request_id, agenda);

  return {
    snapshot,
    summary,
    equity_questions_considered: considered,
    suggested_questions: suggested,
    related_resources: related,
    risks_unknowns: risks,
    agenda,
    calendar_handoff: calendar,
    ask_context: input.ask_context ? { intents_tried: input.ask_context.intents_tried, excerpt: input.ask_context.excerpt } : undefined,
  };
}

function agendaDraft(input: ConsultInput): HeadsUpPacket["agenda"] {
  const owner = PROGRAM.practiceOwnerRole;
  const items: HeadsUpPacket["agenda"] = [
    { minutes: 5, item: `Confirm what "${input.work_name}" is meant to accomplish and where the work stands now.`, owner: "Requester" },
    { minutes: 10, item: "Review what the requester has already considered and which questions remain open.", owner: "Requester" },
  ];
  if (input.desired_support_type.includes("scoping_goals") || input.desired_support_type.includes("equity_embed_review")) {
    items.push({ minutes: 15, item: "Use the early-planning questions to consider people, access, language, burden, evidence, partners, and the decision owner.", owner: owner });
  }
  if (input.desired_support_type.includes("access_language_check")) {
    items.push({ minutes: 10, item: "Review access and language needs with the relevant checklists, then name who will address each need.", owner: owner });
  }
  if (input.desired_support_type.includes("stakeholder_partner_map")) {
    items.push({ minutes: 10, item: "Plan who should be involved, why their participation matters, what authority they have, how they will be compensated, and how the team will report back. Include Tribal consultation when applicable.", owner: `Requester and ${owner}` });
  }
  if (input.desired_support_type.includes("facilitation_prep")) {
    items.push({ minutes: 10, item: "Agree on the session goal, activity, practical task, and access arrangements.", owner: `Requester and ${owner}` });
  }
  items.push({ minutes: 5, item: "Confirm which decisions stay with the responsible official, who owns each next step, when the work will be reviewed, and whether another conversation is needed.", owner: "Requester" });
  return items;
}

function calendarHandoff(input: ConsultInput, requestId: string | undefined, agenda: HeadsUpPacket["agenda"]): string {
  const total = agenda.reduce((n, a) => n + a.minutes, 0);
  const mode = input.preferred_meeting_mode === "in_person" ? "In person" : input.preferred_meeting_mode === "virtual" ? "Virtual" : "In person or virtual";
  const access = input.access_language_needs.length ? `Access arrangements: ${input.access_language_needs.map((a) => ACCESS_LABEL[a]).join(", ")}${input.access_note ? ` (${input.access_note})` : ""}.` : "No access arrangements were requested. Check with the requester before the meeting.";
  return [
    `Subject: Consultation, ${input.work_name}${requestId ? ` (${requestId})` : ""}`,
    `Length: about ${total} minutes. Mode: ${mode}.`,
    `Purpose: ${input.desired_support_type.map((s) => SUPPORT_LABEL[s]).join("; ")}. The requester describes the work as ${STAGE_LABEL_CR[input.stage].toLowerCase()}.`,
    access,
    "Before the meeting, ask the requester to bring any checklist or working notes they have started and list the equity questions they have already considered.",
    "Copy these details into the calendar invitation when scheduling. The program has not sent an invitation.",
  ].join("\n");
}

function sentenceCase(s: string): string {
  const t = s.trim().replace(/\s+/g, " ");
  if (!t) return t;
  const cap = t[0].toUpperCase() + t.slice(1);
  return /[.!?]$/.test(cap) ? cap : cap + ".";
}
