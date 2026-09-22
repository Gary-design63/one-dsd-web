import {
  canTransition,
  type Status,
} from "@/lib/intelligence/consult/schema";
import { externalResearchGate, runSafetyGates } from "@/lib/intelligence/safety";
import {
  ownerQueueContainsNamedPerson,
  ownerQueueTextIsApprovedTemplate,
} from "./owner-queue-text";
import {
  CONSULTATION_PARTICIPATION_NOTICE_ID,
  CONSULTATION_PARTICIPATION_NOTICE_VERSION,
} from "@/lib/participation/consultation-notice";

type ObjectValue = Record<string, unknown>;

const ACTIVE_KEYS = [
  "record_type", "request_id", "access_key_hash", "access_key_version",
  "sensitivity_class", "participation_class", "official_record", "eligibility_status",
  "participation_acknowledged_at", "retention_policy_id", "retention_expires_at",
  "submission_fingerprint", "created_at", "updated_at", "version", "status",
  "status_reason", "scheduled_for", "owner_notes", "pinned_order", "priority_signals",
  "packet", "correction_history", "history", "program_context",
  "dsd_eligibility_attestation", "requester_role", "work_name", "stage", "goals",
  "equity_questions_considered", "desired_support_type", "support_other_note",
  "timing_urgency", "deadline_date", "affected_populations", "populations_note",
  "access_language_needs", "access_note", "preferred_meeting_mode", "links",
  "attachment_notes", "situation", "ask_context", "path_id",
  "participation_notice_id", "participation_notice_version", "share_confirmation",
] as const;

const OPTIONAL_ACTIVE_KEYS = new Set([
  "requester_role", "preferred_meeting_mode", "ask_context", "path_id", "status_reason",
  "scheduled_for", "owner_notes", "pinned_order", "correction_history",
]);

const TOMBSTONE_KEYS = [
  "record_type", "request_id", "status", "access_key_hash", "access_key_version",
  "retention_policy_id", "retention_expires_at", "redacted_at", "updated_at", "version",
] as const;

const STATUS = new Set([
  "pending_eligibility_review", "received", "under_review", "scheduled",
  "in_progress", "completed", "declined", "withdrawn",
]);
const STAGE = new Set(["conceptual", "designing", "launching", "live_change"]);
const SUPPORT = new Set(["scoping_goals", "equity_embed_review", "access_language_check", "stakeholder_partner_map", "facilitation_prep", "other"]);
const TIMING = new Set(["exploratory", "within_2_weeks", "hard_deadline", "live_urgent"]);
const ROLE = new Set(["program_ops", "supervisor", "equity_director_specialist", "analyst_tech", "communications", "procurement_contracts", "other"]);
const MODE = new Set(["in_person", "virtual", "either", "not_sure"]);
const POPULATION = new Set(["language_access_needs", "disability_access", "rural_greater_minnesota", "older_adults", "children_families", "immigrant_refugee_general", "specific_minnesota_community", "tribal_nation"]);
const ACCESS_NEED = new Set(["interpreter_for_consult", "captioning", "plain_language_materials", "timing_constraints", "other"]);
const AUTHORITY = new Set(["official", "guidance", "practice_note", "learning", "community_brief", "partner_informed", "local", "under_review", "external_verify"]);
const ACTOR = new Set(["system", "requester", "owner"]);
const CORRECTABLE_FIELD = new Set([
  "requester_role", "work_name", "stage", "goals", "equity_questions_considered",
  "desired_support_type", "support_other_note", "timing_urgency", "deadline_date",
  "affected_populations", "populations_note", "access_language_needs", "access_note",
  "preferred_meeting_mode", "links", "attachment_notes", "situation",
]);
const STATE_BY_ELIGIBILITY: Record<string, ReadonlySet<string>> = {
  pending: new Set(["pending_eligibility_review", "withdrawn"]),
  confirmed_dsd: new Set(["received", "under_review", "scheduled", "in_progress", "completed", "declined", "withdrawn"]),
  not_dsd: new Set(["declined"]),
};
const STATUS_LABEL: Record<string, string> = {
  pending_eligibility_review: "Eligibility review",
  received: "Received",
  under_review: "Under review",
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
  withdrawn: "Withdrawn",
};
const STAGE_LABEL: Record<string, string> = {
  conceptual: "Early idea",
  designing: "Planning or design",
  launching: "Preparing to begin",
  live_change: "Already in use and changing",
};

function objectValue(value: unknown): ObjectValue | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ObjectValue
    : null;
}

function exactKeys(value: ObjectValue, required: readonly string[], optional: readonly string[] = []): boolean {
  const allowed = new Set([...required, ...optional]);
  return required.every((key) => Object.prototype.hasOwnProperty.call(value, key))
    && Object.keys(value).every((key) => allowed.has(key));
}

function text(value: unknown, min: number, max: number, trimmed = false): value is string {
  return typeof value === "string" && value.length >= min && value.length <= max
    && (!trimmed || value === value.trim());
}

function enumText(value: unknown, values: ReadonlySet<string>): value is string {
  return typeof value === "string" && values.has(value);
}

function integer(value: unknown, min: number, max: number): value is number {
  return Number.isSafeInteger(value) && Number(value) >= min && Number(value) <= max;
}

function canonicalInstant(value: unknown): value is string {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString() === value;
}

function zonedInstant(value: unknown): value is string {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    && Number.isFinite(Date.parse(value));
}

function isoDate(value: unknown): value is string {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(`${value}T00:00:00.000Z`))
    && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

function boundedStringArray(
  value: unknown,
  options: { min: number; max: number; maxItem: number; values?: ReadonlySet<string>; unique?: boolean },
): value is string[] {
  if (!Array.isArray(value) || value.length < options.min || value.length > options.max) return false;
  if (!value.every((item) => typeof item === "string" && item.length <= options.maxItem)) return false;
  if (options.values && !value.every((item) => options.values!.has(item))) return false;
  return !options.unique || new Set(value).size === value.length;
}

function objectArray(value: unknown): ObjectValue[] | null {
  return Array.isArray(value) && value.every((item) => objectValue(item) !== null)
    ? value as ObjectValue[]
    : null;
}

function requestIdDate(value: string): string | null {
  const match = /^CR-(\d{8})-(\d{4,16})$/.exec(value);
  if (!match || /^0+$/.test(match[2])) return null;
  const date = `${match[1].slice(0, 4)}-${match[1].slice(4, 6)}-${match[1].slice(6, 8)}`;
  return isoDate(date) ? date : null;
}

function publicReferenceUrl(value: unknown): value is string {
  if (!text(value, 1, 2048, true)) return false;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return false;
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
    if (!host || host === "localhost" || /\.(?:localhost|local|internal|intranet|corp)$/.test(host)) return false;
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
      const parts = host.split(".").map(Number);
      const [a, b, c] = parts;
      if (parts.some((part) => part > 255)
        || a === 0 || a === 10 || a === 127 || a >= 224
        || (a === 100 && b >= 64 && b <= 127)
        || (a === 169 && b === 254)
        || (a === 172 && b >= 16 && b <= 31)
        || (a === 192 && (b === 0 || b === 168))
        || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100)))
        || (a === 203 && b === 0 && c === 113)) return false;
    }
    if (host === "::" || host === "::1" || /^f[cd]/i.test(host) || /^fe[89ab]/i.test(host)) return false;
    return host.includes(".") || host.includes(":");
  } catch {
    return false;
  }
}

function askContextValid(value: unknown): value is ObjectValue {
  const context = objectValue(value);
  return Boolean(context
    && exactKeys(context, ["session_id", "intents_tried", "excerpt"])
    && text(context.session_id, 0, 64)
    && boundedStringArray(context.intents_tried, { min: 0, max: 10, maxItem: 40 })
    && text(context.excerpt, 0, 600));
}

function prioritySignalsValid(value: unknown, root: ObjectValue): boolean {
  const signals = objectValue(value);
  if (!signals || !exactKeys(signals, ["urgency_weight", "support_weight", "stage_weight", "total", "tribal_gate", "high_stakes"])) return false;
  const numbers = [signals.urgency_weight, signals.support_weight, signals.stage_weight, signals.total];
  if (!numbers.every((item) => typeof item === "number" && Number.isFinite(item))
    || typeof signals.tribal_gate !== "boolean" || typeof signals.high_stakes !== "boolean") return false;
  const support = root.desired_support_type as string[];
  const populations = root.affected_populations as string[];
  const expectedSupport = support.some((item) => item === "scoping_goals" || item === "equity_embed_review")
    ? 6 : support.includes("facilitation_prep") ? 3 : 4;
  const expectedStage = ({ conceptual: 5, designing: 5, launching: 4, live_change: 2 } as Record<string, number>)[String(root.stage)];
  const expectedUrgency = ({ exploratory: 10, within_2_weeks: 20, live_urgent: 40 } as Record<string, number>)[String(root.timing_urgency)];
  const highStakes = /\b(procurement|contract|vendor|RFP|budget|statute|rule change|technology|system replacement|data sharing|algorithm)\b/i
    .test(`${root.goals} ${root.situation}`);
  return signals.total === Number(signals.urgency_weight) + Number(signals.support_weight) + Number(signals.stage_weight)
    && signals.support_weight === expectedSupport
    && signals.stage_weight === expectedStage
    && (root.timing_urgency === "hard_deadline"
      ? Number(signals.urgency_weight) >= 30 && Number(signals.urgency_weight) <= 40
      : signals.urgency_weight === expectedUrgency)
    && signals.tribal_gate === populations.includes("tribal_nation")
    && signals.high_stakes === highStakes;
}

function packetValid(value: unknown, root: ObjectValue): boolean {
  const packet = objectValue(value);
  const required = ["snapshot", "summary", "equity_questions_considered", "suggested_questions", "related_resources", "risks_unknowns", "agenda", "calendar_handoff"] as const;
  if (!packet || !exactKeys(packet, required, ["ask_context"])) return false;
  const snapshot = objectValue(packet.snapshot);
  const snapshotKeys = ["Reference ID", "Status", "Submitted", "Stage", "Work name", "Desired support", "Timing", "Preferred meeting mode", "Requester role"] as const;
  if (!snapshot || !exactKeys(snapshot, snapshotKeys)
    || !Object.values(snapshot).every((item) => text(item, 1, 4096))
    || snapshot["Reference ID"] !== root.request_id
    || snapshot.Status !== STATUS_LABEL[String(root.status)]
    || snapshot.Stage !== STAGE_LABEL[String(root.stage)]
    || snapshot["Work name"] !== root.work_name) return false;
  if (!boundedStringArray(packet.summary, { min: 1, max: 12, maxItem: 4096 })
    || !boundedStringArray(packet.equity_questions_considered, { min: 1, max: 1000, maxItem: 2000 })
    || !boundedStringArray(packet.risks_unknowns, { min: 1, max: 10, maxItem: 4096 })
    || !text(packet.calendar_handoff, 1, 12_000)) return false;

  const questions = objectArray(packet.suggested_questions);
  if (!questions || questions.length > 10 || !questions.every((entry) =>
    exactKeys(entry, ["id", "category", "text"])
    && text(entry.id, 1, 120) && text(entry.category, 1, 120) && text(entry.text, 1, 2000))) return false;
  const resources = objectArray(packet.related_resources);
  if (!resources || resources.length > 6 || !resources.every((entry) =>
    exactKeys(entry, ["id", "title", "href", "authority", "authorityLabel", "reviewDate", "excerpt", "citeable"])
    && text(entry.id, 1, 180) && text(entry.title, 1, 500) && text(entry.href, 1, 2048)
    && enumText(entry.authority, AUTHORITY) && text(entry.authorityLabel, 1, 120)
    && isoDate(entry.reviewDate) && text(entry.excerpt, 1, 2000) && typeof entry.citeable === "boolean")) return false;
  const agenda = objectArray(packet.agenda);
  if (!agenda || agenda.length < 1 || agenda.length > 10 || !agenda.every((entry) =>
    exactKeys(entry, ["minutes", "item", "owner"])
    && integer(entry.minutes, 1, 240) && text(entry.item, 1, 2000) && text(entry.owner, 1, 200))) return false;

  const rootContext = root.ask_context;
  if ((rootContext === undefined) !== (packet.ask_context === undefined)) return false;
  if (rootContext !== undefined) {
    const context = objectValue(packet.ask_context);
    const fullContext = objectValue(rootContext);
    if (!context || !fullContext || !exactKeys(context, ["intents_tried", "excerpt"])
      || !boundedStringArray(context.intents_tried, { min: 0, max: 10, maxItem: 40 })
      || !text(context.excerpt, 0, 600)
      || context.excerpt !== fullContext.excerpt
      || JSON.stringify(context.intents_tried) !== JSON.stringify(fullContext.intents_tried)) return false;
  }
  return true;
}

function historiesValid(root: ObjectValue): boolean {
  const history = objectArray(root.history);
  if (!history || history.length < 1 || history.length > 100) return false;
  const created = String(root.created_at);
  const updated = String(root.updated_at);
  if (!history.every((entry, index) => exactKeys(entry, ["at", "status", "by"], ["note"])
    && canonicalInstant(entry.at) && String(entry.at) >= created && String(entry.at) <= updated
    && (index === 0 || String(entry.at) >= String(history[index - 1].at))
    && enumText(entry.status, STATUS) && enumText(entry.by, ACTOR)
    && (entry.note === undefined || text(entry.note, 0, 1000, true)))) return false;
  if (history[0].at !== root.created_at || history[0].status !== "pending_eligibility_review" || history[0].by !== "system") return false;
  if (!history.slice(1).every((entry, index) => {
    const prior = history[index];
    if (!prior) return false;
    const triageUndo = prior.status === "under_review"
      && entry.status === "received"
      && entry.by === "owner"
      && typeof entry.note === "string"
      && /^Undo of orchestrator cycle cycle-[a-f0-9-]{36} by owner\.$/.test(entry.note);
    if (!canTransition(prior.status as Status, entry.status as Status) && !triageUndo) return false;
    if (entry.by === "requester") return entry.status === "withdrawn";
    if (entry.by === "system") return prior.status === "received" && entry.status === "under_review";
    return entry.by === "owner";
  })) return false;
  if (history.at(-1)?.status !== root.status) return false;

  if (root.correction_history === undefined) return true;
  const corrections = objectArray(root.correction_history);
  return Boolean(corrections && corrections.length <= 100 && corrections.every((entry) =>
    exactKeys(entry, ["at", "fields", "by"])
    && canonicalInstant(entry.at) && String(entry.at) >= created && String(entry.at) <= updated
    && entry.by === "requester"
    && boundedStringArray(entry.fields, { min: 1, max: CORRECTABLE_FIELD.size, maxItem: 40, values: CORRECTABLE_FIELD, unique: true })));
}

function consultationTextValid(root: ObjectValue): boolean {
  const submittedFields = [
    "work_name", "goals", "equity_questions_considered", "support_other_note",
    "populations_note", "access_note", "attachment_notes", "situation",
  ];
  const submitted = submittedFields
    .map((field) => root[field])
    .filter((value): value is string => typeof value === "string");
  const askContext = objectValue(root.ask_context);
  if (typeof askContext?.excerpt === "string") submitted.push(askContext.excerpt);
  if (submitted.some((value) => !runSafetyGates(value, { tribal: false }).ok || !externalResearchGate(value).ok)) {
    return false;
  }
  for (const field of ["status_reason", "owner_notes"] as const) {
    const value = root[field];
    if (typeof value !== "string") continue;
    if (!ownerQueueTextIsApprovedTemplate(field, value)
      || ownerQueueContainsNamedPerson(value)
      || !runSafetyGates(value, { tribal: false }).ok
      || !externalResearchGate(value).ok) return false;
  }
  return true;
}

function activeRecordValid(id: string, value: ObjectValue, idDate: string): boolean {
  const required = ACTIVE_KEYS.filter((key) => !OPTIONAL_ACTIVE_KEYS.has(key));
  const support = value.desired_support_type;
  const populations = value.affected_populations;
  const accessNeeds = value.access_language_needs;
  const created = typeof value.created_at === "string" ? value.created_at : "";
  const updated = typeof value.updated_at === "string" ? value.updated_at : "";
  return exactKeys(value, required, [...OPTIONAL_ACTIVE_KEYS])
    && value.record_type === "consultation_request" && value.request_id === id
    && /^[a-f0-9]{64}$/.test(String(value.access_key_hash)) && value.access_key_version === "sha256-v1"
    && value.sensitivity_class === "S3" && value.participation_class === "voluntary_shared"
    && value.official_record === false
    && enumText(value.eligibility_status, new Set(Object.keys(STATE_BY_ELIGIBILITY)))
    && enumText(value.status, STATUS)
    && Boolean(STATE_BY_ELIGIBILITY[String(value.eligibility_status)]?.has(String(value.status)))
    && canonicalInstant(value.created_at) && idDate === created.slice(0, 10)
    && canonicalInstant(value.participation_acknowledged_at) && value.participation_acknowledged_at === created
    && canonicalInstant(value.updated_at) && updated >= created
    && canonicalInstant(value.retention_expires_at) && String(value.retention_expires_at) > created
    && text(value.retention_policy_id, 3, 80) && /^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/.test(value.retention_policy_id)
    && /^[a-f0-9]{64}$/.test(String(value.submission_fingerprint))
    && integer(value.version, 1, Number.MAX_SAFE_INTEGER)
    && (value.status_reason === undefined || text(value.status_reason, 0, 1000, true))
    && (value.status !== "declined" || text(value.status_reason, 1, 1000, true))
    && (value.scheduled_for === undefined || zonedInstant(value.scheduled_for))
    && (value.status !== "scheduled" || zonedInstant(value.scheduled_for))
    && (value.owner_notes === undefined || text(value.owner_notes, 0, 5000, true))
    && (value.pinned_order === undefined || integer(value.pinned_order, 0, 999))
    && value.program_context === "one_dsd" && value.dsd_eligibility_attestation === true
    && (value.requester_role === undefined || enumText(value.requester_role, ROLE))
    && text(value.work_name, 3, 120, true) && enumText(value.stage, STAGE)
    && text(value.goals, 20, 2000, true) && text(value.equity_questions_considered, 0, 2000, true)
    && boundedStringArray(support, { min: 1, max: 6, maxItem: 30, values: SUPPORT, unique: true })
    && text(value.support_other_note, 0, 200, true)
    && (!(support as string[]).includes("other") || text(value.support_other_note, 1, 200, true))
    && enumText(value.timing_urgency, TIMING)
    && (value.deadline_date === "" || isoDate(value.deadline_date))
    && (value.timing_urgency !== "hard_deadline" || isoDate(value.deadline_date))
    && boundedStringArray(populations, { min: 0, max: 8, maxItem: 40, values: POPULATION, unique: true })
    && text(value.populations_note, 0, 300, true)
    && boundedStringArray(accessNeeds, { min: 0, max: 5, maxItem: 40, values: ACCESS_NEED, unique: true })
    && text(value.access_note, 0, 300, true)
    && (value.preferred_meeting_mode === undefined || enumText(value.preferred_meeting_mode, MODE))
    && boundedStringArray(value.links, { min: 0, max: 5, maxItem: 2048, unique: true })
    && (value.links as string[]).every(publicReferenceUrl)
    && text(value.attachment_notes, 0, 500, true) && text(value.situation, 40, 4000, true)
    && (value.ask_context === undefined || askContextValid(value.ask_context))
    && (value.path_id === undefined || text(value.path_id, 0, 10))
    && value.participation_notice_id === CONSULTATION_PARTICIPATION_NOTICE_ID
    && value.participation_notice_version === CONSULTATION_PARTICIPATION_NOTICE_VERSION
    && value.share_confirmation === true
    && prioritySignalsValid(value.priority_signals, value)
    && packetValid(value.packet, value)
    && historiesValid(value)
    && consultationTextValid(value);
}

/** Strict, purpose-specific contract for the only two consultation shapes stored at runtime. */
export function consultationPersistenceContractIsValid(id: string, candidate: unknown): boolean {
  const value = objectValue(candidate);
  const idDate = requestIdDate(id);
  if (!value || !idDate || value.request_id !== id) return false;
  if (value.record_type === "consultation_tombstone") {
    return exactKeys(value, TOMBSTONE_KEYS)
      && value.status === "expired"
      && /^[a-f0-9]{64}$/.test(String(value.access_key_hash))
      && value.access_key_version === "sha256-v1"
      && text(value.retention_policy_id, 3, 80)
      && /^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/.test(value.retention_policy_id)
      && canonicalInstant(value.retention_expires_at)
      && canonicalInstant(value.redacted_at)
      && value.updated_at === value.redacted_at
      && integer(value.version, 2, Number.MAX_SAFE_INTEGER);
  }
  return activeRecordValid(id, value, idDate);
}

/** Runtime creation always begins at the single auditable intake state. */
export function consultationInitialInsertIsValid(id: string, candidate: unknown): boolean {
  if (!consultationPersistenceContractIsValid(id, candidate)) return false;
  const value = objectValue(candidate);
  const history = value && Array.isArray(value.history) ? value.history : [];
  return Boolean(value
    && value.record_type === "consultation_request"
    && value.version === 1
    && value.eligibility_status === "pending"
    && value.status === "pending_eligibility_review"
    && value.updated_at === value.created_at
    && value.status_reason === undefined
    && value.scheduled_for === undefined
    && value.owner_notes === undefined
    && value.pinned_order === undefined
    && value.correction_history === undefined
    && history.length === 1
    && history[0]?.at === value.created_at
    && history[0]?.status === "pending_eligibility_review"
    && history[0]?.by === "system"
    && history[0]?.note === undefined);
}
