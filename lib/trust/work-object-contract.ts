import { ProgramTaskSchema, ProgramEventSchema } from "@/lib/program/work-schema";
import { ProgramOutcomeRecordSchema } from "@/lib/program/outcome-schema";
import {
  EquityAnalysisRecordSchema,
  FollowUpEventRecordSchema,
  SurveyWaveEventRecordSchema,
} from "@/lib/equity-analysis/schema";
import { assertNoProhibitedProfileFields } from "./data-classification";
import { assertKnownFlagOverrides } from "@/lib/intelligence/registry/flags";
import { isOwnerSessionRevocation } from "@/lib/auth/owner-session-revocation";
import { TOOL_CATALOG } from "@/lib/intelligence/tools/catalog";
import { surveillanceRefuse } from "@/lib/intelligence/safety";
import { consultationPersistenceContractIsValid } from "./consultation-persistence-contract";

export type PersistedWorkObjectKind =
  | "consult_request"
  | "decision"
  | "eval_result"
  | "collaboration_workspace";
type PersistenceContractKind = PersistedWorkObjectKind | "audit_event" | "idempotency_receipt" | "runtime_counter" | "runtime_rate_limit";

type ObjectValue = Record<string, unknown>;

export class WorkObjectContractError extends Error {
  readonly code = "invalid_work_object_contract";

  constructor(readonly workKind: PersistenceContractKind) {
    super(`The ${workKind} work object does not match an approved persistence contract.`);
    this.name = "WorkObjectContractError";
  }
}

function fail(kind: PersistenceContractKind): never {
  throw new WorkObjectContractError(kind);
}

function objectValue(value: unknown, kind: PersistenceContractKind): ObjectValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(kind);
  return value as ObjectValue;
}

function hasOnlyKeys(value: ObjectValue, allowed: readonly string[]): boolean {
  const allowlist = new Set(allowed);
  return Object.keys(value).every((key) => allowlist.has(key));
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isObjectArray(value: unknown): value is ObjectValue[] {
  return Array.isArray(value) && value.every((item) => item !== null && typeof item === "object" && !Array.isArray(item));
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoInstant(value: unknown): value is string {
  return isString(value) && Number.isFinite(Date.parse(value));
}

function isCanonicalUtcInstant(value: unknown): value is string {
  if (!isString(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function isOptionalIsoInstant(value: unknown): boolean {
  return value === undefined || isIsoInstant(value);
}

const AUTONOMY = new Set(["A0", "A1", "A2", "A3", "A4", "A5"]);
const AGENT_IDS = new Set([
  "program_orchestrator",
  "ask_concierge",
  "ci_guide",
  "librarian",
  "a11y_reviewer",
  "consult_intake",
  "graduation_coach",
  "embed_advisor",
  "content_sentinel",
  "eval_steward",
]);

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const IDEMPOTENCY_KEY = /^(?:consult-submit-v2-[a-f0-9]{64}|idem-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/;
const RUNTIME_COUNTER_SCOPE = /^cr:[0-9]{8}$/;
const RUNTIME_RATE_LIMIT_REQUESTS = {
  "program-login-network": { limit: 40, windowSeconds: 900 },
  "program-login-account": { limit: 10, windowSeconds: 900 },
  "program-invitation-network": { limit: 20, windowSeconds: 900 },
  "program-invitation-code": { limit: 10, windowSeconds: 900 },
  "staff-ask": { limit: 30, windowSeconds: 600 },
  "staff-program-outcome": { limit: 10, windowSeconds: 600 },
  "staff-equity-analysis": { limit: 10, windowSeconds: 600 },
  "staff-equity-register": { limit: 60, windowSeconds: 600 },
  "owner-login": { limit: 10, windowSeconds: 900 },
  "team-login": { limit: 10, windowSeconds: 900 },
  "consultation-intake": { limit: 20, windowSeconds: 3_600 },
  "consultation-tracking": { limit: 20, windowSeconds: 600 },
} as const;
const RUNTIME_RATE_LIMIT_SCOPES = new Set(Object.keys(RUNTIME_RATE_LIMIT_REQUESTS));
const CONSULTATION_OBJECT_ID = /^CR-[0-9]{8}-[0-9]{4,10}$/;
const CYCLE_ID = /^cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const PROPOSAL_ID = /^cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[pg][1-9][0-9]*$/;
const RESOURCE_ID = /^(?:(?:pn|ja|lm|ext|asset|tool)-[a-z0-9][a-z0-9-]{0,119}|somali|hmong|karen|oromo|african-american|latino|vietnamese|khmer|lao|russian-speaking|arabic-speaking|deaf-deafblind-hard-of-hearing|rural|tribal-nations)$/;
const CYCLE_OBJECT_ID = /^cycle:cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const STALE_FLAG_OBJECT_ID = /^stale_flag:([^:]+):(past_review_date|review_due_soon|missing_owner|accessibility_pending)$/;
const PROPOSAL_OBJECT_ID = /^(?:proposal|rejected_rec):cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[pg][1-9][0-9]*$/;
const EVAL_OBJECT_ID = /^eval-[0-9]{10,16}$/;
const PROFILE_LIKE_PERSISTENCE_ID = /(?:employee|worker|personnel)[-_]?\d{1,12}.*(?:belief|ideolog|equity|readiness|bias|inclusion|participation|engagement)|(?:belief|ideolog|equity|readiness|bias|inclusion|participation|engagement).*(?:employee|worker|personnel)[-_]?\d{1,12}/i;
const AUDIT_SPAN_ID = /^[0-9a-f]{8}$/;
const AUDIT_AGENT_VERSIONS = new Set(["0.1.0", "collaboration-owner-v1"]);
const RESEARCH_USAGE_ID = /^ru_[0-9]{14}_[a-f0-9]{6}_[a-f0-9]{4}$/;
const RESEARCH_QUERY_HASH = /^[a-f0-9]{16}$/;
const RESEARCH_PROVIDER_TRACE_ID = /^pth_[a-f0-9]{64}$/;
const RESEARCH_MODEL_IDS = new Set([
  "fixture/research-1",
  "perplexity-search",
  "fast",
  "low",
  "medium",
  "high",
]);
const OPAQUE_RESEARCH_MODEL_ID = /^msh_[a-f0-9]{64}$/;
const RESEARCH_DOMAIN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

// Published staff content keeps its original ID. Older items use named IDs;
// approved database publications can instead use opaque UUIDs.
function isResourceId(value: unknown): value is string {
  return isString(value) && (RESOURCE_ID.test(value) || UUID_V4.test(value));
}

function isStaleFlagObjectId(id: string): boolean {
  const match = STALE_FLAG_OBJECT_ID.exec(id);
  return match !== null && isResourceId(match[1]);
}

function isResearchModelId(value: unknown): value is string {
  return isString(value)
    && (RESEARCH_MODEL_IDS.has(value) || OPAQUE_RESEARCH_MODEL_ID.test(value));
}

function isResearchDomainArray(value: unknown): value is string[] {
  return isStringArray(value)
    && value.length <= 20
    && new Set(value).size === value.length
    && value.every((domain) => RESEARCH_DOMAIN.test(domain));
}

const CONSULT_ACTIVE_KEYS = [
  "record_type", "request_id", "access_key_hash", "access_key_version",
  "sensitivity_class", "participation_class", "official_record",
  "eligibility_status", "participation_acknowledged_at", "retention_policy_id",
  "retention_expires_at", "submission_fingerprint", "created_at", "updated_at",
  "version", "status", "status_reason", "scheduled_for", "owner_notes",
  "pinned_order", "priority_signals", "packet", "correction_history", "history",
  "program_context", "dsd_eligibility_attestation", "requester_role", "work_name",
  "stage", "goals", "equity_questions_considered", "desired_support_type",
  "support_other_note", "timing_urgency", "deadline_date", "affected_populations",
  "populations_note", "access_language_needs", "access_note",
  "preferred_meeting_mode", "links", "attachment_notes", "situation",
  "ask_context", "path_id", "participation_notice_id",
  "participation_notice_version", "share_confirmation",
] as const;

const CONSULT_TOMBSTONE_KEYS = [
  "record_type", "request_id", "status", "access_key_hash", "access_key_version",
  "retention_policy_id", "retention_expires_at", "redacted_at", "updated_at", "version",
] as const;

const CONSULT_STATUSES = new Set([
  "pending_eligibility_review", "received", "under_review", "scheduled",
  "in_progress", "completed", "declined", "withdrawn",
]);
const CONSULT_STATE_BY_ELIGIBILITY: Record<string, ReadonlySet<string>> = {
  pending: new Set(["pending_eligibility_review", "withdrawn"]),
  confirmed_dsd: new Set(["received", "under_review", "scheduled", "in_progress", "completed", "declined", "withdrawn"]),
  not_dsd: new Set(["declined"]),
};

function isEnumString(value: unknown, allowed: ReadonlySet<string>): value is string {
  return isString(value) && allowed.has(value);
}

function isEnumStringArray(value: unknown, allowed: ReadonlySet<string>): value is string[] {
  return isStringArray(value) && value.every((item) => allowed.has(item));
}

function validConsultPacket(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const packet = value as ObjectValue;
  if (!hasOnlyKeys(packet, [
    "snapshot", "summary", "equity_questions_considered", "suggested_questions",
    "related_resources", "risks_unknowns", "agenda", "calendar_handoff", "ask_context",
  ])) return false;
  const snapshot = packet.snapshot && typeof packet.snapshot === "object" && !Array.isArray(packet.snapshot)
    ? packet.snapshot as ObjectValue
    : null;
  if (!snapshot || !hasOnlyKeys(snapshot, [
    "Reference ID", "Status", "Submitted", "Stage", "Work name", "Desired support",
    "Timing", "Preferred meeting mode", "Requester role",
  ]) || !Object.values(snapshot).every((item) => typeof item === "string")) return false;
  if (!isStringArray(packet.summary)
    || !isStringArray(packet.equity_questions_considered)
    || !isStringArray(packet.risks_unknowns)
    || !isString(packet.calendar_handoff)) return false;
  if (!isObjectArray(packet.suggested_questions)
    || !packet.suggested_questions.every((entry) =>
      hasOnlyKeys(entry, ["id", "category", "text"])
      && isString(entry.id) && isString(entry.category) && isString(entry.text))) return false;
  if (!isObjectArray(packet.related_resources)
    || !packet.related_resources.every((entry) =>
      hasOnlyKeys(entry, ["id", "title", "href", "authority", "authorityLabel", "reviewDate", "excerpt", "citeable"])
      && ["id", "title", "href", "authority", "authorityLabel", "reviewDate", "excerpt"].every((key) => isString(entry[key]))
      && isBoolean(entry.citeable))) return false;
  if (!isObjectArray(packet.agenda)
    || !packet.agenda.every((entry) =>
      hasOnlyKeys(entry, ["minutes", "item", "owner"])
      && isFiniteNumber(entry.minutes) && isString(entry.item) && isString(entry.owner))) return false;
  if (packet.ask_context !== undefined) {
    if (!packet.ask_context || typeof packet.ask_context !== "object" || Array.isArray(packet.ask_context)) return false;
    const ask = packet.ask_context as ObjectValue;
    if (!hasOnlyKeys(ask, ["intents_tried", "excerpt"])
      || !isStringArray(ask.intents_tried) || !isString(ask.excerpt)) return false;
  }
  return true;
}

function assertConsultation(id: string, value: ObjectValue): void {
  assertNoSurveillanceText(value, "consult_request");
  if (!consultationPersistenceContractIsValid(id, value)) fail("consult_request");

  if (value.record_type === "consultation_tombstone") {
    const validTombstone = hasOnlyKeys(value, CONSULT_TOMBSTONE_KEYS)
      && Object.keys(value).length === CONSULT_TOMBSTONE_KEYS.length
      && value.request_id === id
      && value.status === "expired"
      && isString(value.access_key_hash) && /^[a-f0-9]{64}$/.test(value.access_key_hash)
      && value.access_key_version === "sha256-v1"
      && isString(value.retention_policy_id)
      && isCanonicalUtcInstant(value.retention_expires_at)
      && isCanonicalUtcInstant(value.redacted_at)
      && isCanonicalUtcInstant(value.updated_at)
      && Number.isSafeInteger(value.version) && Number(value.version) >= 2;
    if (!validTombstone) fail("consult_request");
    return;
  }

  const askContext = value.ask_context === undefined
    ? null
    : value.ask_context && typeof value.ask_context === "object" && !Array.isArray(value.ask_context)
      ? value.ask_context as ObjectValue
      : undefined;
  const signals = value.priority_signals && typeof value.priority_signals === "object" && !Array.isArray(value.priority_signals)
    ? value.priority_signals as ObjectValue
    : null;
  const eligibility = typeof value.eligibility_status === "string" ? value.eligibility_status : "";
  const status = typeof value.status === "string" ? value.status : "";
  const valid = hasOnlyKeys(value, CONSULT_ACTIVE_KEYS)
    && (value.record_type === undefined || value.record_type === "consultation_request")
    && value.request_id === id && CONSULTATION_OBJECT_ID.test(id)
    && isString(value.access_key_hash) && /^[a-f0-9]{64}$/.test(value.access_key_hash)
    && value.access_key_version === "sha256-v1"
    && value.sensitivity_class === "S3"
    && value.participation_class === "voluntary_shared"
    && value.official_record === false
    && Boolean(CONSULT_STATE_BY_ELIGIBILITY[eligibility]?.has(status))
    && isCanonicalUtcInstant(value.participation_acknowledged_at)
    && isString(value.retention_policy_id)
    && isCanonicalUtcInstant(value.retention_expires_at)
    && isString(value.submission_fingerprint) && /^[a-f0-9]{64}$/.test(value.submission_fingerprint)
    && isCanonicalUtcInstant(value.created_at) && isCanonicalUtcInstant(value.updated_at)
    && Number.isSafeInteger(value.version) && Number(value.version) >= 1
    && isEnumString(value.status, CONSULT_STATUSES)
    && isOptionalString(value.status_reason)
    && isOptionalIsoInstant(value.scheduled_for)
    && (value.status !== "scheduled" || isIsoInstant(value.scheduled_for))
    && (value.status !== "declined" || isNonBlankString(value.status_reason))
    && isOptionalString(value.owner_notes)
    && (value.pinned_order === undefined || Number.isSafeInteger(value.pinned_order))
    && value.program_context === "one_dsd"
    && value.dsd_eligibility_attestation === true
    && (value.requester_role === undefined || isEnumString(value.requester_role, new Set(["program_ops", "supervisor", "equity_director_specialist", "analyst_tech", "communications", "procurement_contracts", "other"])))
    && isString(value.work_name)
    && isEnumString(value.stage, new Set(["conceptual", "designing", "launching", "live_change"]))
    && isString(value.goals) && typeof value.equity_questions_considered === "string"
    && isEnumStringArray(value.desired_support_type, new Set(["scoping_goals", "equity_embed_review", "access_language_check", "stakeholder_partner_map", "facilitation_prep", "other"]))
    && typeof value.support_other_note === "string"
    && isEnumString(value.timing_urgency, new Set(["exploratory", "within_2_weeks", "hard_deadline", "live_urgent"]))
    && typeof value.deadline_date === "string"
    && isEnumStringArray(value.affected_populations, new Set(["language_access_needs", "disability_access", "rural_greater_minnesota", "older_adults", "children_families", "immigrant_refugee_general", "specific_minnesota_community", "tribal_nation"]))
    && typeof value.populations_note === "string"
    && isEnumStringArray(value.access_language_needs, new Set(["interpreter_for_consult", "captioning", "plain_language_materials", "timing_constraints", "other"]))
    && typeof value.access_note === "string"
    && (value.preferred_meeting_mode === undefined || isEnumString(value.preferred_meeting_mode, new Set(["in_person", "virtual", "either", "not_sure"])))
    && isStringArray(value.links) && typeof value.attachment_notes === "string" && isString(value.situation)
    && askContext !== undefined
    && (askContext === null || (hasOnlyKeys(askContext, ["session_id", "intents_tried", "excerpt"])
      && isString(askContext.session_id) && isStringArray(askContext.intents_tried) && isString(askContext.excerpt)))
    && (value.path_id === undefined || isString(value.path_id))
    && value.participation_notice_id === "dsd_consultation_request"
    && value.participation_notice_version === "1.0.0"
    && value.share_confirmation === true
    && signals !== null && hasOnlyKeys(signals, ["urgency_weight", "support_weight", "stage_weight", "total", "tribal_gate", "high_stakes"])
    && ["urgency_weight", "support_weight", "stage_weight", "total"].every((key) => isFiniteNumber(signals[key]))
    && isBoolean(signals.tribal_gate) && isBoolean(signals.high_stakes)
    && validConsultPacket(value.packet)
    && isObjectArray(value.history) && value.history.length > 0
    && value.history.every((entry) => hasOnlyKeys(entry, ["at", "status", "by", "note"])
      && isCanonicalUtcInstant(entry.at) && isEnumString(entry.status, CONSULT_STATUSES)
      && isEnumString(entry.by, new Set(["system", "requester", "owner"])) && isOptionalString(entry.note))
    && (value.history.at(-1)?.status === value.status)
    && (value.correction_history === undefined || (isObjectArray(value.correction_history)
      && value.correction_history.every((entry) => hasOnlyKeys(entry, ["at", "fields", "by"])
        && isCanonicalUtcInstant(entry.at) && entry.by === "requester" && isStringArray(entry.fields))));
  if (!valid) fail("consult_request");
}

function validAgentOverrides(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  for (const [agentId, entry] of Object.entries(value as ObjectValue)) {
    if (!AGENT_IDS.has(agentId) || !entry || typeof entry !== "object" || Array.isArray(entry)) return false;
    const record = entry as ObjectValue;
    if (!hasOnlyKeys(record, ["enabled", "ceiling"])) return false;
    if (record.enabled !== undefined && !isBoolean(record.enabled)) return false;
    if (record.ceiling !== undefined && (!isString(record.ceiling) || !AUTONOMY.has(record.ceiling))) return false;
  }
  return true;
}

function validFlagOverrides(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const overrides = value as Record<string, unknown>;
  if (!Object.values(overrides).every(isBoolean)) return false;
  try {
    assertKnownFlagOverrides(overrides as Record<string, boolean>);
    return true;
  } catch {
    return false;
  }
}

function validPolicyPatch(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const patch = value as ObjectValue;
  if (!hasOnlyKeys(patch, ["max_autonomy", "flags", "agents"])) return false;
  if (patch.max_autonomy !== undefined && (!isString(patch.max_autonomy) || !AUTONOMY.has(patch.max_autonomy))) return false;
  if (patch.flags !== undefined && !validFlagOverrides(patch.flags)) return false;
  if (patch.agents !== undefined && !validAgentOverrides(patch.agents)) return false;
  return true;
}

function validProposal(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const proposal = value as ObjectValue;
  if (!hasOnlyKeys(proposal, [
    "id", "cycle_id", "kind", "title", "rationale", "apply", "status",
    "created_at", "decided_at", "decision_note",
  ])) return false;
  const proposalKinds = new Set([
    "enable_model", "review_brief", "retire_content", "raise_autonomy",
    "lower_autonomy", "content_gap", "capacity", "other",
  ]);
  return (
    isString(proposal.id) && PROPOSAL_ID.test(proposal.id)
    && isString(proposal.cycle_id) && CYCLE_ID.test(proposal.cycle_id)
    && proposal.id.startsWith(`${proposal.cycle_id}-`)
    && isString(proposal.kind)
    && proposalKinds.has(proposal.kind)
    && isString(proposal.title)
    && isString(proposal.rationale)
    && (proposal.apply === undefined || validPolicyPatch(proposal.apply))
    && isString(proposal.status)
    && new Set(["proposed", "accepted", "rejected"]).has(proposal.status)
    && isString(proposal.created_at)
    && isOptionalString(proposal.decided_at)
    && isOptionalString(proposal.decision_note)
  );
}

function validCycle(value: ObjectValue): boolean {
  if (!hasOnlyKeys(value, [
    "id", "at", "by", "policy", "effective_ceiling", "generative", "steps",
    "triaged", "expired_consultations", "refreshed_packets", "stale_flags",
    "quality_problems", "a11y", "proposals", "summary", "exceptions", "undone",
  ])) return false;
  const policy = value.policy && typeof value.policy === "object" && !Array.isArray(value.policy)
    ? value.policy as ObjectValue
    : null;
  const undone = value.undone === undefined
    ? null
    : value.undone && typeof value.undone === "object" && !Array.isArray(value.undone)
      ? value.undone as ObjectValue
      : undefined;
  if (
    !isString(value.id)
    || !CYCLE_ID.test(value.id)
    || !isString(value.at)
    || !isString(value.by)
    || !new Set(["owner", "cron"]).has(value.by)
    || !policy
    || !hasOnlyKeys(policy, ["max_autonomy", "killed"])
    || !isString(policy.max_autonomy)
    || !AUTONOMY.has(policy.max_autonomy)
    || !isBoolean(policy.killed)
    || !isString(value.effective_ceiling)
    || !AUTONOMY.has(value.effective_ceiling)
    || !isBoolean(value.generative)
    || !isStringArray(value.expired_consultations)
    || !value.expired_consultations.every((id) => CONSULTATION_OBJECT_ID.test(id))
    || !isStringArray(value.refreshed_packets)
    || !value.refreshed_packets.every((id) => CONSULTATION_OBJECT_ID.test(id))
    || !isString(value.summary)
    || !isStringArray(value.exceptions)
    || undone === undefined
    || (undone !== null && (!hasOnlyKeys(undone, ["at", "by"]) || !isString(undone.at) || !isString(undone.by)))
  ) return false;

  const collections: Array<[unknown, readonly string[], (entry: ObjectValue) => boolean]> = [
    [value.steps, ["name", "autonomy", "outcome", "detail"], (entry) =>
      isString(entry.name) && isString(entry.autonomy) && AUTONOMY.has(entry.autonomy)
      && isString(entry.outcome) && new Set(["done", "skipped", "denied"]).has(entry.outcome)
      && typeof entry.detail === "string"],
    [value.triaged, ["request_id", "from", "to"], (entry) =>
      isString(entry.request_id) && CONSULTATION_OBJECT_ID.test(entry.request_id)
      && isString(entry.from) && isString(entry.to)],
    [value.stale_flags, ["id", "title", "owner", "reviewDate", "problem"], (entry) =>
      isResourceId(entry.id)
      && isString(entry.title) && typeof entry.owner === "string"
      && isString(entry.reviewDate) && isString(entry.problem)
      && new Set(["past_review_date", "review_due_soon", "missing_owner", "accessibility_pending"]).has(entry.problem)],
    [value.quality_problems, ["id", "problems"], (entry) =>
      isResourceId(entry.id) && isStringArray(entry.problems)],
    [value.a11y, ["id", "blockers", "should_fix"], (entry) =>
      isResourceId(entry.id)
      && isFiniteNumber(entry.blockers) && isFiniteNumber(entry.should_fix)],
  ];
  for (const [raw, keys, validate] of collections) {
    if (!isObjectArray(raw) || !raw.every((entry) => hasOnlyKeys(entry, keys) && validate(entry))) return false;
  }
  return Array.isArray(value.proposals) && value.proposals.every(validProposal);
}

function validResearchPolicy(value: ObjectValue): boolean {
  return (
    Object.keys(value).length > 0
    &&
    hasOnlyKeys(value, [
      "enabled", "mode", "provider_order", "daily_request_cap", "monthly_usd_cap",
      "allowed_domains", "recency", "deep_research_enabled",
    ])
    && (value.enabled === undefined || isBoolean(value.enabled))
    && (value.mode === undefined || (isString(value.mode) && new Set(["auto", "on_request", "off"]).has(value.mode)))
    && (value.provider_order === undefined || (isStringArray(value.provider_order)
    && value.provider_order.every((provider) => new Set([
      "perplexity_agent", "openai_web", "fixture", "perplexity_direct", "vercel_gateway",
    ]).has(provider))))
    && (value.daily_request_cap === undefined
      || (Number.isSafeInteger(value.daily_request_cap)
        && Number(value.daily_request_cap) >= 0
        && Number(value.daily_request_cap) <= 100_000))
    && (value.monthly_usd_cap === undefined
      || (isFiniteNumber(value.monthly_usd_cap)
        && value.monthly_usd_cap >= 0
        && value.monthly_usd_cap <= 100_000))
    && (value.allowed_domains === undefined || isResearchDomainArray(value.allowed_domains))
    && (value.recency === undefined || (isString(value.recency) && new Set(["any", "year", "month", "week"]).has(value.recency)))
    && (value.deep_research_enabled === undefined || isBoolean(value.deep_research_enabled))
  );
}

function validResearchUsage(value: ObjectValue): boolean {
  if (!hasOnlyKeys(value, [
    "id", "at", "provider", "model", "depth", "query_hash", "domains",
    "estimated_usd", "reported_usd", "input_tokens", "output_tokens",
    "search_queries", "web_search_calls", "fetch_url_calls", "tool_calls", "ok",
    "error_code", "latency_ms", "trace_id", "provider_trace_id",
  ])) return false;
  const counters = [
    "input_tokens", "output_tokens", "search_queries", "web_search_calls",
    "fetch_url_calls", "tool_calls",
  ];
  return (
    isString(value.id) && RESEARCH_USAGE_ID.test(value.id)
    && isCanonicalUtcInstant(value.at)
    && isString(value.provider)
    && new Set(["perplexity_agent", "openai_web", "fixture"]).has(value.provider)
    && isResearchModelId(value.model)
    && isString(value.depth)
    && new Set(["current_web", "deep_research"]).has(value.depth)
    && isString(value.query_hash) && RESEARCH_QUERY_HASH.test(value.query_hash)
    && isResearchDomainArray(value.domains)
    && isFiniteNumber(value.estimated_usd) && value.estimated_usd >= 0
    && (value.reported_usd === undefined
      || (isFiniteNumber(value.reported_usd) && value.reported_usd >= 0))
    && counters.every((key) => value[key] === undefined
      || (Number.isSafeInteger(value[key]) && Number(value[key]) >= 0))
    && isBoolean(value.ok)
    && (value.error_code === undefined || value.error_code === "research_execution_failed")
    && (value.ok ? value.error_code === undefined : value.error_code === "research_execution_failed")
    && Number.isSafeInteger(value.latency_ms) && Number(value.latency_ms) >= 0
    && isString(value.trace_id) && UUID_V4.test(value.trace_id)
    && (value.provider_trace_id === undefined
      || (isString(value.provider_trace_id) && RESEARCH_PROVIDER_TRACE_ID.test(value.provider_trace_id)))
  );
}

function assertDecision(id: string, value: ObjectValue): void {
  let valid = false;
  if (id.startsWith("program_task:")) {
    valid = ProgramTaskSchema.safeParse(value).success && id === `program_task:${value.id}`;
  } else if (id.startsWith("program_event:")) {
    valid = ProgramEventSchema.safeParse(value).success && id === `program_event:${value.id}`;
  } else if (id.startsWith("program_outcome:")) {
    valid = ProgramOutcomeRecordSchema.safeParse(value).success && id === `program_outcome:${value.id}`;
  } else if (id.startsWith("equity_analysis:")) {
    valid = EquityAnalysisRecordSchema.safeParse(value).success && id === `equity_analysis:${value.id}`;
  } else if (id.startsWith("equity_followup:")) {
    valid = FollowUpEventRecordSchema.safeParse(value).success && id === `equity_followup:${value.id}`;
  } else if (id.startsWith("equity_survey:")) {
    valid = SurveyWaveEventRecordSchema.safeParse(value).success && id === `equity_survey:${value.id}`;
  } else if (id === "autonomy_policy") {
    valid = hasOnlyKeys(value, ["killed", "max_autonomy", "agents", "flags", "updated_at", "by", "note"])
      && isBoolean(value.killed)
      && isString(value.max_autonomy) && AUTONOMY.has(value.max_autonomy)
      && validAgentOverrides(value.agents)
      && validFlagOverrides(value.flags)
      && isString(value.updated_at)
      && isString(value.by) && new Set(["env_default", "owner", "system"]).has(value.by)
      && isOptionalString(value.note);
  } else if (id === "research_policy") {
    valid = validResearchPolicy(value);
  } else if (id.startsWith("research_usage:")) {
    valid = validResearchUsage(value) && id === `research_usage:${value.id}`;
  } else if (/^owner-session-revoked-[a-f0-9]{64}$/.test(id)) {
    valid = isOwnerSessionRevocation(id, value);
  } else if (id.startsWith("cycle:")) {
    valid = validCycle(value) && id === `cycle:${value.id}`;
  } else if (id.startsWith("stale_flag:")) {
    valid = hasOnlyKeys(value, ["id", "title", "owner", "reviewDate", "problem", "cycle_id", "flagged_at", "disposition", "undone_at"])
      && isResourceId(value.id)
      && isString(value.title) && typeof value.owner === "string"
      && isString(value.reviewDate) && isString(value.problem)
      && new Set(["past_review_date", "review_due_soon", "missing_owner", "accessibility_pending"]).has(value.problem)
      && isString(value.cycle_id) && CYCLE_ID.test(value.cycle_id)
      && isString(value.flagged_at) && isString(value.disposition)
      && isOptionalString(value.undone_at)
      && isStaleFlagObjectId(id)
      && id === `stale_flag:${value.id}:${value.problem}`;
  } else if (id.startsWith("proposal:")) {
    valid = validProposal(value) && id === `proposal:${value.id}`;
  } else if (id.startsWith("rejected_rec:")) {
    valid = hasOnlyKeys(value, ["id", "at", "title", "note"])
      && isString(value.id) && PROPOSAL_ID.test(value.id)
      && isString(value.at) && isString(value.title)
      && isOptionalString(value.note) && id === `rejected_rec:${value.id}`;
  }
  if (!valid) fail("decision");
}

function assertEvalResult(id: string, value: ObjectValue): void {
  const allowedSuites = new Set(["ask_mvp", "ci_mvp", "ciq_mvp", "gp_mvp", "mindset_abc"]);
  const results = value.results;
  const valid = hasOnlyKeys(value, ["id", "at", "suites", "results", "pass", "fail", "manual", "releaseBlocked"])
    && value.id === id
    && isString(value.id) && EVAL_OBJECT_ID.test(value.id)
    && isString(value.at)
    && isStringArray(value.suites) && value.suites.every((suite) => allowedSuites.has(suite))
    && isObjectArray(results)
    && results.every((result) =>
      hasOnlyKeys(result, ["id", "suite", "scenario", "status", "detail", "ms"])
      && isString(result.id)
      && /^(?:ASK-E[1-9][0-9]*|CI-E[1-9][0-9]*|CIQ-E[1-9][0-9]*|GP-E[1-9][0-9]*|MIND-[ABC][1-9][0-9]*|CP-[1-9][0-9]*)$/.test(result.id)
      && isString(result.suite) && allowedSuites.has(result.suite)
      && isString(result.scenario)
      && isString(result.status) && new Set(["pass", "fail", "manual"]).has(result.status)
      && typeof result.detail === "string"
      && isFiniteNumber(result.ms))
    && isFiniteNumber(value.pass)
    && isFiniteNumber(value.fail)
    && isFiniteNumber(value.manual)
    && isBoolean(value.releaseBlocked);
  if (!valid) fail("eval_result");
}

const COLLABORATION_ROOT_KEYS = [
  "workspace", "memberships", "channels", "channelMemberships", "threads", "posts",
  "reactions", "attachments", "meetingSeries", "meetingOccurrences", "agendaItems",
  "decisions", "polls", "pollResponses", "feedback", "feedbackResponses",
  "learningActivities", "notificationPreferences", "notificationDeliveries", "actionItems",
  "contentProposals", "automationPolicies", "automationRuns", "processedKeys", "revision",
] as const;

const COLLABORATION_COLLECTION_KEYS: Record<string, readonly string[]> = {
  memberships: ["id", "workspaceId", "displayLabel", "role", "status", "sample"],
  channels: ["id", "workspaceId", "name", "purpose", "access", "position", "sample", "updatedAt"],
  channelMemberships: ["id", "channelId", "workspaceMembershipId", "sample"],
  threads: ["id", "channelId", "title", "createdByLabel", "createdAt", "updatedAt", "pinned", "sample"],
  posts: ["id", "threadId", "parentPostId", "body", "authorLabel", "createdAt", "updatedAt", "moderationStatus", "sample"],
  reactions: ["id", "postId", "memberId", "label", "sample"],
  attachments: ["id", "postId", "fileName", "mediaType", "byteSize", "checksum", "status", "accessibilityStatus", "sample"],
  meetingSeries: ["id", "workspaceId", "name", "purpose", "cadence", "scheduleNote", "sample"],
  meetingOccurrences: ["id", "seriesId", "title", "scheduleNote", "accessNote", "status", "sample", "updatedAt"],
  agendaItems: ["id", "meetingOccurrenceId", "title", "ownerLabel", "minutes", "position", "sample"],
  decisions: ["id", "workspaceId", "title", "summary", "status", "confirmedByLabel", "confirmedAt", "sourceThreadId", "sample"],
  polls: ["id", "channelId", "question", "options", "status", "sample"],
  pollResponses: ["id", "pollId", "memberId", "optionId", "sample"],
  feedback: ["id", "channelId", "prompt", "status", "sample"],
  feedbackResponses: ["id", "feedbackId", "authorLabel", "response", "createdAt", "sample"],
  learningActivities: ["id", "channelId", "title", "description", "reflectionPrompt", "status", "sample"],
  notificationPreferences: ["id", "memberId", "channelId", "mode", "quietHoursNote", "sample"],
  notificationDeliveries: ["id", "preferenceId", "destinationClass", "status", "attemptCount", "sample"],
  actionItems: ["id", "workspaceId", "title", "ownerLabel", "dueNote", "status", "sourceThreadId", "sample", "updatedAt"],
  contentProposals: ["id", "workspaceId", "title", "sourceThreadId", "status", "sample"],
  automationPolicies: ["id", "workspaceId", "name", "status", "exactDestination", "allowedAction", "expiresAt", "sample"],
  automationRuns: ["id", "policyId", "status", "resultNote", "createdAt", "sample"],
};

const WORKSPACE_ROLES = new Set([
  "owner", "steward", "member", "contributor", "reviewer", "moderator",
  "automation_operator", "technical_operator",
]);

function isScalarString(value: unknown): value is string {
  return typeof value === "string";
}

function isOptionalScalarString(value: unknown): boolean {
  return value === undefined || isScalarString(value);
}

function isOptionalInstant(value: unknown): boolean {
  return value === undefined || isIsoInstant(value);
}

function isSafeIntegerAtLeast(value: unknown, minimum: number): value is number {
  return Number.isSafeInteger(value) && Number(value) >= minimum;
}

function uniqueIds(entries: ObjectValue[]): Set<string> | null {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (!isString(entry.id) || ids.has(entry.id)) return null;
    ids.add(entry.id);
  }
  return ids;
}

function references(value: unknown, ids: ReadonlySet<string>): value is string {
  return isString(value) && ids.has(value);
}

function optionalReference(value: unknown, ids: ReadonlySet<string>): boolean {
  return value === undefined || references(value, ids);
}

function allFields<T extends readonly string[]>(
  value: ObjectValue,
  fields: T,
  validate: (field: T[number]) => boolean,
): boolean {
  return fields.every((field) => Object.hasOwn(value, field) && validate(field));
}

function assertNoSurveillanceText(value: unknown, kind: PersistenceContractKind): void {
  if (typeof value === "string") {
    if (!surveillanceRefuse(value).ok) fail(kind);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => assertNoSurveillanceText(item, kind));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value as ObjectValue).forEach((item) => assertNoSurveillanceText(item, kind));
  }
}

function assertCollaborationWorkspace(id: string, value: ObjectValue): void {
  assertNoSurveillanceText(value, "collaboration_workspace");
  if (id !== "one_dsd_team" || !hasOnlyKeys(value, COLLABORATION_ROOT_KEYS)) fail("collaboration_workspace");
  const workspace = value.workspace && typeof value.workspace === "object" && !Array.isArray(value.workspace)
    ? value.workspace as ObjectValue
    : null;
  if (
    !workspace
    || !hasOnlyKeys(workspace, ["id", "name", "programName", "scopeLabel", "summary", "status", "sample", "createdAt", "updatedAt"])
    || workspace.id !== id
    || !allFields(workspace, ["id", "name", "programName", "scopeLabel", "summary"], (field) => isScalarString(workspace[field]))
    || !isEnumString(workspace.status, new Set(["preview", "pilot", "active", "archived"]))
    || !isBoolean(workspace.sample)
    || !isIsoInstant(workspace.createdAt)
    || !isIsoInstant(workspace.updatedAt)
    || !isStringArray(value.processedKeys) || !value.processedKeys.every(isString)
    || new Set(value.processedKeys).size !== value.processedKeys.length
    || !isSafeIntegerAtLeast(value.revision, 1)
  ) fail("collaboration_workspace");

  const collections: Record<string, ObjectValue[]> = {};
  for (const [collection, allowedKeys] of Object.entries(COLLABORATION_COLLECTION_KEYS)) {
    const entries = value[collection];
    if (!isObjectArray(entries) || !entries.every((entry) => hasOnlyKeys(entry, allowedKeys))) {
      fail("collaboration_workspace");
    }
    collections[collection] = entries;
  }

  const ids: Record<string, Set<string>> = {};
  for (const [collection, entries] of Object.entries(collections)) {
    const collectionIds = uniqueIds(entries);
    if (!collectionIds) fail("collaboration_workspace");
    ids[collection] = collectionIds;
  }

  const memberships = collections.memberships;
  const channels = collections.channels;
  const channelMemberships = collections.channelMemberships;
  const threads = collections.threads;
  const posts = collections.posts;
  const reactions = collections.reactions;
  const attachments = collections.attachments;
  const meetingSeries = collections.meetingSeries;
  const meetingOccurrences = collections.meetingOccurrences;
  const agendaItems = collections.agendaItems;
  const decisions = collections.decisions;
  const polls = collections.polls;
  const pollResponses = collections.pollResponses;
  const feedback = collections.feedback;
  const feedbackResponses = collections.feedbackResponses;
  const learningActivities = collections.learningActivities;
  const notificationPreferences = collections.notificationPreferences;
  const notificationDeliveries = collections.notificationDeliveries;
  const actionItems = collections.actionItems;
  const contentProposals = collections.contentProposals;
  const automationPolicies = collections.automationPolicies;
  const automationRuns = collections.automationRuns;

  const valid = memberships.every((entry) =>
    entry.workspaceId === id
    && isScalarString(entry.displayLabel)
    && isEnumString(entry.role, WORKSPACE_ROLES)
    && isEnumString(entry.status, new Set(["invited", "active", "suspended", "expired", "revoked"]))
    && isBoolean(entry.sample))
    && channels.every((entry) =>
      entry.workspaceId === id
      && isScalarString(entry.name) && isScalarString(entry.purpose)
      && isEnumString(entry.access, new Set(["workspace", "private"]))
      && isSafeIntegerAtLeast(entry.position, 0) && isBoolean(entry.sample)
      && isIsoInstant(entry.updatedAt))
    && channelMemberships.every((entry) =>
      references(entry.channelId, ids.channels)
      && references(entry.workspaceMembershipId, ids.memberships)
      && isBoolean(entry.sample))
    && threads.every((entry) =>
      references(entry.channelId, ids.channels)
      && isScalarString(entry.title) && isScalarString(entry.createdByLabel)
      && isIsoInstant(entry.createdAt) && isIsoInstant(entry.updatedAt)
      && isBoolean(entry.pinned) && isBoolean(entry.sample))
    && posts.every((entry) => {
      if (!references(entry.threadId, ids.threads)
        || !(entry.parentPostId === null || references(entry.parentPostId, ids.posts))
        || !isScalarString(entry.body) || !isScalarString(entry.authorLabel)
        || !isIsoInstant(entry.createdAt) || !isIsoInstant(entry.updatedAt)
        || !isEnumString(entry.moderationStatus, new Set(["visible", "held", "removed"]))
        || !isBoolean(entry.sample)) return false;
      if (typeof entry.parentPostId === "string") {
        const parent = posts.find((candidate) => candidate.id === entry.parentPostId);
        if (!parent || parent.id === entry.id || parent.threadId !== entry.threadId) return false;
      }
      return true;
    })
    && reactions.every((entry) =>
      references(entry.postId, ids.posts) && references(entry.memberId, ids.memberships)
      && isEnumString(entry.label, new Set(["Helpful", "Support", "Question"]))
      && isBoolean(entry.sample))
    && attachments.every((entry) =>
      references(entry.postId, ids.posts)
      && isScalarString(entry.fileName) && isScalarString(entry.mediaType)
      && isSafeIntegerAtLeast(entry.byteSize, 0) && isScalarString(entry.checksum)
      && isEnumString(entry.status, new Set(["quarantined", "approved", "rejected"]))
      && isEnumString(entry.accessibilityStatus, new Set(["pending", "reviewed", "needs_work"]))
      && isBoolean(entry.sample))
    && meetingSeries.every((entry) =>
      entry.workspaceId === id && isScalarString(entry.name) && isScalarString(entry.purpose)
      && entry.cadence === "monthly" && isScalarString(entry.scheduleNote) && isBoolean(entry.sample))
    && meetingOccurrences.every((entry) =>
      references(entry.seriesId, ids.meetingSeries)
      && isScalarString(entry.title) && isScalarString(entry.scheduleNote) && isScalarString(entry.accessNote)
      && isEnumString(entry.status, new Set(["planning", "scheduled", "completed", "cancelled"]))
      && isBoolean(entry.sample) && isIsoInstant(entry.updatedAt))
    && agendaItems.every((entry) =>
      references(entry.meetingOccurrenceId, ids.meetingOccurrences)
      && isScalarString(entry.title) && isScalarString(entry.ownerLabel)
      && isSafeIntegerAtLeast(entry.minutes, 0) && isSafeIntegerAtLeast(entry.position, 0)
      && isBoolean(entry.sample))
    && decisions.every((entry) =>
      entry.workspaceId === id && isScalarString(entry.title) && isScalarString(entry.summary)
      && isEnumString(entry.status, new Set(["proposed", "confirmed", "superseded"]))
      && isOptionalScalarString(entry.confirmedByLabel) && isOptionalInstant(entry.confirmedAt)
      && optionalReference(entry.sourceThreadId, ids.threads) && isBoolean(entry.sample))
    && polls.every((entry) => {
      if (!references(entry.channelId, ids.channels) || !isScalarString(entry.question)
        || !isEnumString(entry.status, new Set(["draft", "open", "closed"]))
        || !isBoolean(entry.sample) || !isObjectArray(entry.options)) return false;
      const optionIds = uniqueIds(entry.options);
      return Boolean(optionIds) && entry.options.every((option) =>
        hasOnlyKeys(option, ["id", "label"]) && isScalarString(option.label));
    })
    && pollResponses.every((entry) => {
      if (!references(entry.pollId, ids.polls) || !references(entry.memberId, ids.memberships)
        || !isString(entry.optionId) || !isBoolean(entry.sample)) return false;
      const poll = polls.find((candidate) => candidate.id === entry.pollId);
      return Boolean(poll && isObjectArray(poll.options)
        && poll.options.some((option) => option.id === entry.optionId));
    })
    && feedback.every((entry) =>
      references(entry.channelId, ids.channels) && isScalarString(entry.prompt)
      && isEnumString(entry.status, new Set(["draft", "open", "closed"])) && isBoolean(entry.sample))
    && feedbackResponses.every((entry) =>
      references(entry.feedbackId, ids.feedback) && isScalarString(entry.authorLabel)
      && isScalarString(entry.response) && isIsoInstant(entry.createdAt) && isBoolean(entry.sample))
    && learningActivities.every((entry) =>
      references(entry.channelId, ids.channels) && isScalarString(entry.title)
      && isScalarString(entry.description) && isScalarString(entry.reflectionPrompt)
      && isEnumString(entry.status, new Set(["planned", "open", "complete"])) && isBoolean(entry.sample))
    && notificationPreferences.every((entry) =>
      references(entry.memberId, ids.memberships) && optionalReference(entry.channelId, ids.channels)
      && isEnumString(entry.mode, new Set(["off", "immediate", "digest"]))
      && isOptionalScalarString(entry.quietHoursNote) && isBoolean(entry.sample))
    && notificationDeliveries.every((entry) =>
      references(entry.preferenceId, ids.notificationPreferences)
      && isEnumString(entry.destinationClass, new Set(["native", "email", "microsoft"]))
      && isEnumString(entry.status, new Set(["pending", "delivered", "failed", "cancelled"]))
      && isSafeIntegerAtLeast(entry.attemptCount, 0) && isBoolean(entry.sample))
    && actionItems.every((entry) =>
      entry.workspaceId === id && isScalarString(entry.title) && isScalarString(entry.ownerLabel)
      && isScalarString(entry.dueNote)
      && isEnumString(entry.status, new Set(["planned", "in_progress", "blocked", "complete"]))
      && optionalReference(entry.sourceThreadId, ids.threads) && isBoolean(entry.sample)
      && isIsoInstant(entry.updatedAt))
    && contentProposals.every((entry) =>
      entry.workspaceId === id && isScalarString(entry.title)
      && optionalReference(entry.sourceThreadId, ids.threads)
      && isEnumString(entry.status, new Set(["draft", "submitted", "accepted", "rejected"]))
      && isBoolean(entry.sample))
    && automationPolicies.every((entry) =>
      entry.workspaceId === id && isScalarString(entry.name)
      && isEnumString(entry.status, new Set(["draft", "approved", "stopped", "expired"]))
      && isOptionalScalarString(entry.exactDestination) && isScalarString(entry.allowedAction)
      && isOptionalInstant(entry.expiresAt) && isBoolean(entry.sample))
    && automationRuns.every((entry) =>
      references(entry.policyId, ids.automationPolicies)
      && isEnumString(entry.status, new Set(["proposed", "approved", "running", "completed", "stopped", "failed"]))
      && isScalarString(entry.resultNote) && isIsoInstant(entry.createdAt) && isBoolean(entry.sample));
  if (!valid) fail("collaboration_workspace");
}

/**
 * Last-line persistence contract. Domain schemas still validate richer content;
 * this boundary prevents callers from using a generic store kind as an
 * employee-profile or surveillance bucket.
 */
export function assertWorkObjectPersistence(
  kind: PersistedWorkObjectKind,
  id: string,
  value: unknown,
): void {
  assertNoProhibitedProfileFields(value);
  const object = objectValue(value, kind);
  if (!isString(id) || id.length > 180) fail(kind);
  if (kind === "consult_request") {
    assertConsultation(id, object);
    return;
  }
  if (kind === "decision") {
    assertDecision(id, object);
    return;
  }
  if (kind === "eval_result") {
    assertEvalResult(id, object);
    return;
  }
  assertCollaborationWorkspace(id, object);
}

function canonicalReceiptObjectId(kind: PersistedWorkObjectKind, id: string): boolean {
  if (PROFILE_LIKE_PERSISTENCE_ID.test(id)) return false;
  if (kind === "consult_request") return CONSULTATION_OBJECT_ID.test(id);
  if (kind === "eval_result") return EVAL_OBJECT_ID.test(id);
  if (kind === "collaboration_workspace") return id === "one_dsd_team";
  return id === "autonomy_policy"
    || id === "research_policy"
    || /^research_usage:ru_[0-9]{14}_[a-f0-9]{6}_[a-f0-9]{4}$/.test(id)
    || /^owner-session-revoked-[a-f0-9]{64}$/.test(id)
    || CYCLE_OBJECT_ID.test(id)
    || isStaleFlagObjectId(id)
    || PROPOSAL_OBJECT_ID.test(id)
    || /^program_task:task-[a-f0-9]{32}$/.test(id)
    || /^program_event:[a-f0-9-]{36}$/.test(id)
    || /^program_outcome:program-outcome-[a-f0-9-]{36}$/.test(id)
    || /^equity_analysis:equity-analysis-[a-f0-9-]{36}$/.test(id)
    || /^equity_followup:equity-followup-[a-f0-9-]{36}$/.test(id)
    || /^equity_survey:equity-survey-[a-f0-9-]{36}$/.test(id);
}

/**
 * Immutable replay receipts are identifiers, not a second generic text store.
 * Keep both the replay key and referenced identity opaque before any backend
 * claims a receipt; the SQL boundary additionally requires the object to exist
 * by transaction commit.
 */
export function assertIdempotencyReceiptPersistence(
  kind: PersistedWorkObjectKind,
  id: string,
  idempotencyKey: string,
): void {
  if (!isString(idempotencyKey)
    || !(IDEMPOTENCY_KEY.test(idempotencyKey) || /^program-(?:task|event):[a-f0-9]{64}$/.test(idempotencyKey) || /^program-outcome:[a-f0-9-]{36}$/.test(idempotencyKey) || /^equity-(?:analysis|followup|survey):[a-f0-9-]{36}$/.test(idempotencyKey))
    || !isString(id)
    || !canonicalReceiptObjectId(kind, id)) {
    fail("idempotency_receipt");
  }
}

/** Consultation reference-number allocation is the sole durable counter. */
export function assertRuntimeCounterScope(scope: string): void {
  if (!isString(scope) || !RUNTIME_COUNTER_SCOPE.test(scope)) {
    fail("runtime_counter");
  }
}

/** Fixed request-limit buckets have four registered, non-personal purposes. */
export function assertRuntimeRateLimitScope(scope: string): void {
  if (!isString(scope) || !RUNTIME_RATE_LIMIT_SCOPES.has(scope)) {
    fail("runtime_rate_limit");
  }
}

/** The bucket purpose fixes its ceiling/window; caller-supplied policy is not persisted. */
export function assertRuntimeRateLimitRequest(
  scope: string,
  subjectHash: string,
  limit: number,
  windowSeconds: number,
): void {
  assertRuntimeRateLimitScope(scope);
  const request = RUNTIME_RATE_LIMIT_REQUESTS[scope as keyof typeof RUNTIME_RATE_LIMIT_REQUESTS];
  if (!/^[a-f0-9]{64}$/.test(subjectHash)
    || limit !== request.limit
    || windowSeconds !== request.windowSeconds) {
    fail("runtime_rate_limit");
  }
}

const AUDIT_AGENT_IDS = new Set([...AGENT_IDS, "system"]);
const PERMISSION_MODES = new Set(["always", "with_preview", "human_approve", "owner_only"]);
const AUDIT_TOOL_NAMES = new Set([
  ...TOOL_CATALOG.map((tool) => tool.tool_name),
  "runtime.unknown_tool_refusal",
  "collaboration.update_workspace_summary",
  "collaboration.update_channel",
  "collaboration.create_thread",
  "collaboration.reply",
  "collaboration.edit_post",
  "collaboration.update_meeting",
  "collaboration.update_action",
  "collaboration.submit_feedback",
]);
const AUDIT_SAFETY_CODES = new Set([
  "pii_detected", "hr_complaint_redirect", "surveillance_refused",
  "persona_refused", "publish_refused", "tribal_gate", "legal_invention_refused",
]);
const AUDIT_ERROR_CODES = new Set([
  "tool_unknown", "tool_disabled", "allowlist_miss", "kill_switch",
  "agent_disabled", "autonomy_ceiling", "owner_only", "tool_execution_failed",
]);
const AUDIT_ALLOWLIST_REASONS = new Set([
  "tool not registered",
  "tool disabled by flag or phase",
  "tool not in agent allowlist",
  "paused by the Equity and Inclusion Operations Consultant",
  "agent disabled by owner policy",
  "agent disabled in its definition",
  "owner-only tool",
]);
const CANONICAL_AUDIT_CONTENT_ID = /^(?:CR-[0-9]{8}-[0-9]{4,10}|one_dsd_team|(?:pn|ja|lm|ext|asset|tool)-[a-z0-9][a-z0-9-]{0,119}|(?:somali|hmong|karen|oromo|african-american|latino|vietnamese|khmer|lao|russian-speaking|arabic-speaking|deaf-deafblind-hard-of-hearing|rural|tribal-nations)|cycle-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?:-[pg][1-9][0-9]*)?)$/;
const CANONICAL_AUDIT_MODEL_ID = /^(?=.{1,80}$)[A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9][A-Za-z0-9._-]*)*$/;
const PROFILE_LIKE_AUDIT_ID = PROFILE_LIKE_PERSISTENCE_ID;

function validAuditContentIds(value: unknown): value is string[] {
  return isStringArray(value)
    && value.length <= 100
    && new Set(value).size === value.length
    && value.every((id) => (CANONICAL_AUDIT_CONTENT_ID.test(id) || UUID_V4.test(id))
      && !PROFILE_LIKE_AUDIT_ID.test(id));
}

function validAllowlistReason(value: unknown): boolean {
  return value === undefined
    || (isString(value) && (
      AUDIT_ALLOWLIST_REASONS.has(value)
      || /^tool requires A[0-5]; effective ceiling A[0-5]$/.test(value)
    ));
}

/** Logs are purpose-limited too; a typed call site is not a runtime boundary. */
export function assertAuditEventPersistence(value: unknown): void {
  assertNoProhibitedProfileFields(value);
  const kind = "audit_event" as const;
  const event = objectValue(value, kind);
  const valid = hasOnlyKeys(event, [
    "trace_id", "span_id", "at", "agent_id", "agent_version", "tool_name",
    "autonomy_level_used", "permission_mode", "dry_run", "content_ids_touched",
    "allowlist_hit", "allowlist_miss_reason", "safety_refusal_code",
    "human_disposition", "model_id", "latency_ms", "ok", "error_code",
  ])
    && isString(event.trace_id) && UUID_V4.test(event.trace_id)
    && isString(event.span_id) && AUDIT_SPAN_ID.test(event.span_id)
    && isCanonicalUtcInstant(event.at)
    && isString(event.agent_id) && AUDIT_AGENT_IDS.has(event.agent_id)
    && isString(event.agent_version) && AUDIT_AGENT_VERSIONS.has(event.agent_version)
    && isString(event.tool_name) && AUDIT_TOOL_NAMES.has(event.tool_name)
    && isString(event.autonomy_level_used) && AUTONOMY.has(event.autonomy_level_used)
    && isString(event.permission_mode) && PERMISSION_MODES.has(event.permission_mode)
    && isBoolean(event.dry_run)
    && validAuditContentIds(event.content_ids_touched)
    && isBoolean(event.allowlist_hit)
    && validAllowlistReason(event.allowlist_miss_reason)
    && (event.allowlist_hit === false || event.allowlist_miss_reason === undefined)
    && (event.safety_refusal_code === undefined
      || (isString(event.safety_refusal_code) && AUDIT_SAFETY_CODES.has(event.safety_refusal_code)))
    && (event.human_disposition === undefined || event.human_disposition === null
      || (isString(event.human_disposition)
        && new Set(["approve", "edit", "reject", "regenerate"]).has(event.human_disposition)))
    && (event.model_id === undefined
      || (isString(event.model_id) && CANONICAL_AUDIT_MODEL_ID.test(event.model_id)))
    && (event.latency_ms === undefined || (isFiniteNumber(event.latency_ms) && event.latency_ms >= 0))
    && isBoolean(event.ok)
    && (event.error_code === undefined
      || (isString(event.error_code) && AUDIT_ERROR_CODES.has(event.error_code)));
  if (!valid) throw new WorkObjectContractError(kind);
}
