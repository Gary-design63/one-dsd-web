/**
 * Consultation Intake & Queue Agent (mindset workflow (c)). A0 to A2.
 * Humans own scheduling outcomes; no invitation is ever sent.
 */
import { createHash } from "node:crypto";
import { z } from "zod";
import { getStore, isIsolatedMemoryStore } from "../memory/store";
import type { ConsultationCasResult } from "../memory/consultation-cas";
import { externalResearchGate, runSafetyGates, tribalGate } from "../safety";
import { runTool, auditRefusal } from "../tools/runtime";
import type { SafetyResult, ToolContext } from "../types";
import { consultationRetention } from "../consult/availability";
import {
  hashTrackingSecret,
  issueTrackingSecret,
  verifyTrackingSecret,
} from "../consult/tracking";
import {
  OWNER_NOTE_TEMPLATES,
  OWNER_STATUS_REASON_TEMPLATES,
  ownerQueueContainsNamedPerson,
  ownerQueueTextIsApprovedTemplate,
} from "@/lib/trust/owner-queue-text";
import {
  ConsultInputSchema,
  RequesterCorrectionSchema,
  STATUSES,
  buildHeadsUpPacket,
  canTransition,
  consultationStateIsValid,
  isConsultRequest,
  isConsultRequestTombstone,
  prioritySignals,
  rankSuggest,
  requesterCanCorrect,
  requesterCanWithdraw,
  type ConsultationRecord,
  type ConsultInput,
  type ConsultRequest,
  type ConsultRequestTombstone,
  type RequesterCorrectableField,
  type RequesterCorrection,
  type Status,
} from "../consult/schema";

export type IntakeResult =
  | { kind: "invalid"; issues: Array<{ path: string; message: string }> }
  | { kind: "refusal"; safety: SafetyResult; field: string }
  | { kind: "conflict"; message: string }
  | { kind: "created"; request: ConsultRequest; tracking_secret: string; duplicate: boolean };

type IntakeValidationFailure = Extract<IntakeResult, { kind: "invalid" | "refusal" }>;

export type IntakeCorrectionResult =
  | { kind: "updated"; request: ReturnType<typeof requesterView> }
  | { kind: "invalid"; issues: Array<{ path: string; message: string }> }
  | { kind: "refusal"; safety: SafetyResult; field: string }
  | { kind: "conflict"; message: string }
  | { kind: "not_found" }
  | { kind: "not_correctable"; message: string };

export type IntakeCredentialRotationResult =
  | { kind: "rotated"; request: ReturnType<typeof requesterView>; access_key: string }
  | { kind: "not_found" }
  | { kind: "conflict"; message: string }
  | { kind: "not_rotatable"; message: string };

const FREE_TEXT_FIELDS: Array<keyof ConsultInput> = ["work_name", "goals", "equity_questions_considered", "situation", "attachment_notes", "populations_note", "access_note", "support_other_note"];

/** intake.form_assist: validate structure and run prohibited-content gates on free text (dry-run preview or commit). */
export async function validateIntake(raw: unknown, ctx: ToolContext): Promise<{ ok: true; input: ConsultInput } | IntakeValidationFailure> {
  const parsed = await runTool(ctx, "intake.form_assist", () => ConsultInputSchema.safeParse(raw));
  if (!parsed.success) {
    return { kind: "invalid", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) };
  }
  return screenValidatedIntake(parsed.data, ctx);
}

async function screenValidatedIntake(
  input: ConsultInput,
  ctx: ToolContext,
): Promise<{ ok: true; input: ConsultInput } | IntakeValidationFailure> {
  for (const f of FREE_TEXT_FIELDS) {
    const v = input[f];
    if (typeof v !== "string" || !v) continue;
    // Tribal mentions in intake route through the tribal_nation population flag, not a hard stop.
    const first = runSafetyGates(v, { tribal: false });
    const r = first.ok ? externalResearchGate(v) : first;
    if (!r.ok) {
      await auditRefusal(ctx, "safety.pii_detect", r.code!);
      return { kind: "refusal", safety: r, field: f };
    }
  }
  if (input.ask_context) {
    const first = runSafetyGates(input.ask_context.excerpt, { tribal: false });
    const r = first.ok ? externalResearchGate(input.ask_context.excerpt) : first;
    if (!r.ok) {
      await auditRefusal(ctx, "safety.pii_detect", r.code!);
      return { kind: "refusal", safety: r, field: "ask_context" };
    }
  }
  if (input.affected_populations.includes("tribal_nation")) {
    const result = tribalGate("Tribal Nation");
    await auditRefusal(ctx, "safety.tribal_gate", result.code!);
    return { kind: "refusal", safety: result, field: "affected_populations" };
  }
  return { ok: true, input };
}

export async function previewPacket(input: ConsultInput, ctx: ToolContext) {
  const created_at = new Date().toISOString();
  const signals = prioritySignals(input);
  return runTool(ctx, "intake.summary_pack", () => buildHeadsUpPacket(input, { request_id: "CR-preview", created_at, status: "received", signals, preview: true }));
}

export async function submitIntake(raw: unknown, ctx: ToolContext, idempotencyKey?: string): Promise<IntakeResult> {
  const v = await validateIntake(raw, ctx);
  if (!("ok" in v)) return v;
  const input = v.input;
  const store = getStore();
  const created_at = new Date().toISOString();
  const day = created_at.slice(0, 10).replace(/-/g, "");
  const n = await store.counter(`cr:${day}`);
  const request_id = `CR-${day}-${String(n).padStart(4, "0")}`;
  const trackingSecret = issueTrackingSecret(
    idempotencyKey ? { idempotencyKey, requestId: request_id } : undefined,
  );
  const submissionFingerprint = createHash("sha256")
    .update(JSON.stringify(input), "utf8")
    .digest("hex");
  const retention = retentionForPersistence(store.backend);
  const retention_expires_at = new Date(
    Date.parse(created_at) + retention.retentionDays * 86_400_000,
  ).toISOString();
  const signals = await runTool(ctx, "queue.rank_suggest", () => prioritySignals(input));
  const packet = await runTool(ctx, "intake.summary_pack", () => buildHeadsUpPacket(input, { request_id, created_at, status: "pending_eligibility_review", signals }), { contentIds: [request_id] });
  await runTool(ctx, "agenda.consult_prep_draft", () => packet.agenda, { contentIds: [request_id] });
  await runTool(ctx, "calendar.handoff_prep", () => packet.calendar_handoff, { contentIds: [request_id] });

  const request: ConsultRequest = {
    ...input,
    record_type: "consultation_request",
    request_id,
    access_key_hash: hashTrackingSecret(trackingSecret),
    access_key_version: "sha256-v1",
    sensitivity_class: "S3",
    participation_class: "voluntary_shared",
    official_record: false,
    eligibility_status: "pending",
    participation_acknowledged_at: created_at,
    retention_policy_id: retention.policyVersion,
    retention_expires_at,
    created_at,
    updated_at: created_at,
    version: 1,
    status: "pending_eligibility_review",
    submission_fingerprint: submissionFingerprint,
    priority_signals: signals,
    packet,
    history: [{ at: created_at, status: "pending_eligibility_review", by: "system" }],
  };
  const dedupeKey = idempotencyKey
    ? `consult-submit-v2-${createHash("sha256").update(idempotencyKey, "utf8").digest("hex")}`
    : undefined;
  const put = await store.put("consult_request", request_id, request, dedupeKey);
  if (put.value.submission_fingerprint !== submissionFingerprint) {
    return {
      kind: "conflict",
      message: "This submission key was already used for different information. Review the form and submit again.",
    };
  }
  const responseSecret = idempotencyKey
    ? issueTrackingSecret({ idempotencyKey, requestId: put.value.request_id })
    : trackingSecret;
  return { kind: "created", request: put.value, tracking_secret: responseSecret, duplicate: !put.applied };
}

/** queue.status_get (own): requester view with the access key; no owner notes. */
export async function trackRequest(requestId: string, accessKey: string, ctx: ToolContext) {
  const stored = await getStore().get<ConsultationRecord>("consult_request", requestId);
  if (!stored) return null;
  const record = await redactIfExpired(stored);
  if (!verifyTrackingSecret(accessKey, record.access_key_hash)) return null;
  return runTool(
    ctx,
    "intake.requester_track",
    () => isConsultRequestTombstone(record) ? expiredRequesterView(record) : requesterView(record),
    { contentIds: [requestId], operationalRight: "verified_consultation_requester" },
  );
}

export function requesterView(req: ConsultRequest) {
  return {
    request_id: req.request_id,
    status: req.status,
    status_reason: req.status === "declined" ? req.status_reason : undefined,
    scheduled_for: req.scheduled_for,
    updated_at: req.updated_at,
    version: req.version,
    work_name: req.work_name,
    stage: req.stage,
    can_withdraw: requesterCanWithdraw(req.status),
    can_correct: requesterCanCorrect(req.status),
    can_rotate_key: true,
    editable: requesterEditableFields(req),
    history: req.history.filter((h) => h.by !== "owner" || !h.note).map((h) => ({ at: h.at, status: h.status })),
  };
}

function requesterEditableFields(req: ConsultRequest): RequesterCorrection {
  return {
    requester_role: req.requester_role,
    work_name: req.work_name,
    stage: req.stage,
    goals: req.goals,
    equity_questions_considered: req.equity_questions_considered,
    desired_support_type: req.desired_support_type,
    support_other_note: req.support_other_note,
    timing_urgency: req.timing_urgency,
    deadline_date: req.deadline_date,
    affected_populations: req.affected_populations,
    populations_note: req.populations_note,
    access_language_needs: req.access_language_needs,
    access_note: req.access_note,
    preferred_meeting_mode: req.preferred_meeting_mode,
    links: req.links,
    attachment_notes: req.attachment_notes,
    situation: req.situation,
  };
}

function expiredRequesterView(record: ConsultRequestTombstone) {
  return {
    request_id: record.request_id,
    status: "expired" as const,
    updated_at: record.redacted_at,
    version: record.version,
    can_withdraw: false,
    can_correct: false,
    can_rotate_key: false,
    history: [{ at: record.redacted_at, status: "expired" as const }],
  };
}

export async function correctRequest(
  requestId: string,
  accessKey: string,
  rawCorrections: unknown,
  expectedVersion: number,
  ctx: ToolContext,
): Promise<IntakeCorrectionResult> {
  const parsed = RequesterCorrectionSchema.safeParse(rawCorrections);
  if (!parsed.success) {
    return {
      kind: "invalid",
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }
  const fields = Object.keys(rawCorrections as Record<string, unknown>) as RequesterCorrectableField[];
  const corrections = Object.fromEntries(
    fields.map((field) => [field, parsed.data[field]]),
  ) as RequesterCorrection;

  const store = getStore();
  const stored = await store.get<ConsultationRecord>("consult_request", requestId);
  if (!stored) return { kind: "not_found" };
  const record = await redactIfExpired(stored);
  if (!verifyTrackingSecret(accessKey, record.access_key_hash)) return { kind: "not_found" };
  if (isConsultRequestTombstone(record) || !requesterCanCorrect(record.status)) {
    return {
      kind: "not_correctable",
      message: "This request can no longer be changed here.",
    };
  }
  if (record.version !== expectedVersion) {
    return {
      kind: "conflict",
      message: "This request changed after you opened it. Check the latest status and try again.",
    };
  }

  const correctedInput = ConsultInputSchema.safeParse({ ...record, ...corrections });
  if (!correctedInput.success) {
    return {
      kind: "invalid",
      issues: correctedInput.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }
  const validation = await screenValidatedIntake(correctedInput.data, ctx);
  if (!("ok" in validation)) return validation;
  const input = validation.input;
  const at = new Date().toISOString();
  const signals = prioritySignals(input);
  const packet = buildHeadsUpPacket(input, {
    request_id: record.request_id,
    created_at: record.created_at,
    status: record.status,
    signals,
  });
  const corrected: ConsultRequest = {
    ...record,
    ...input,
    priority_signals: signals,
    packet,
    updated_at: at,
    version: record.version + 1,
    correction_history: [
      ...(record.correction_history ?? []),
      { at, fields, by: "requester" },
    ],
  };
  const applied = await runTool(
    ctx,
    "intake.requester_correct",
    () => store.compareAndSwapConsultation<ConsultationRecord>(
      requestId,
      {
        version: record.version,
        recordType: "consultation_request",
        retentionExpiresAt: record.retention_expires_at,
        guardAt: at,
        mutation: "requester_correction",
      },
      corrected,
    ),
    {
      contentIds: [requestId],
      humanDisposition: "edit",
      operationalRight: "verified_consultation_requester",
    },
  );
  if (!applied.applied) {
    if (applied.reason === "expired" && isConsultRequest(applied.current)) {
      await redactIfExpired(applied.current);
      return { kind: "not_correctable", message: "This request can no longer be changed here." };
    }
    if (applied.reason === "tombstone") {
      return { kind: "not_correctable", message: "This request can no longer be changed here." };
    }
    if (applied.reason === "not_found") return { kind: "not_found" };
    return { kind: "conflict", message: "This request changed before the correction could be saved. Check the latest status and try again." };
  }
  if (!isConsultRequest(applied.value)) {
    return { kind: "conflict", message: "This request changed before the correction could be saved. Check the latest status and try again." };
  }
  return { kind: "updated", request: requesterView(applied.value) };
}

export async function withdrawRequest(requestId: string, accessKey: string, ctx: ToolContext): Promise<{ ok: boolean; reason?: string }> {
  const store = getStore();
  const stored = await store.get<ConsultationRecord>("consult_request", requestId);
  if (!stored) return { ok: false, reason: "not_found" };
  const record = await redactIfExpired(stored);
  if (!verifyTrackingSecret(accessKey, record.access_key_hash)) return { ok: false, reason: "not_found" };
  if (isConsultRequestTombstone(record)) return { ok: false, reason: "not_withdrawable" };
  const req = record;
  if (!requesterCanWithdraw(req.status)) return { ok: false, reason: "not_withdrawable" };
  const at = new Date().toISOString();
  const updated: ConsultRequest = {
    ...req,
    status: "withdrawn",
    updated_at: at,
    version: req.version + 1,
    packet: { ...req.packet, snapshot: { ...req.packet.snapshot, Status: statusLabel("withdrawn") } },
    history: [...req.history, { at, status: "withdrawn", by: "requester" }],
  };
  const applied = await runTool(
    ctx,
    "intake.requester_withdraw",
    () => store.compareAndSwapConsultation<ConsultationRecord>(
      requestId,
      {
        version: req.version,
        recordType: "consultation_request",
        retentionExpiresAt: req.retention_expires_at,
        guardAt: at,
        mutation: "requester_withdrawal",
      },
      updated,
    ),
    {
      contentIds: [requestId],
      humanDisposition: "edit",
      operationalRight: "verified_consultation_requester",
    },
  );
  if (!applied.applied) {
    if (applied.reason === "expired" && isConsultRequest(applied.current)) {
      await redactIfExpired(applied.current);
      return { ok: false, reason: "not_withdrawable" };
    }
    if (applied.reason === "tombstone") return { ok: false, reason: "not_withdrawable" };
    return { ok: false, reason: applied.reason === "not_found" ? "not_found" : "conflict" };
  }
  return { ok: true };
}

/** Replace one request's credential without retaining either plaintext key. */
export async function rotateRequestKey(
  requestId: string,
  accessKey: string,
  expectedVersion: number,
  ctx: ToolContext,
): Promise<IntakeCredentialRotationResult> {
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1) {
    return { kind: "conflict", message: "Check the latest request status and try again." };
  }
  const store = getStore();
  const stored = await store.get<ConsultationRecord>("consult_request", requestId);
  if (!stored) return { kind: "not_found" };
  const record = await redactIfExpired(stored);
  if (!verifyTrackingSecret(accessKey, record.access_key_hash)) return { kind: "not_found" };
  if (isConsultRequestTombstone(record)) {
    return { kind: "not_rotatable", message: "This request has expired, so its access key can no longer be replaced." };
  }
  if (record.version !== expectedVersion) {
    return { kind: "conflict", message: "This request changed after you opened it. Check the latest status and try again." };
  }

  const replacementSecret = issueTrackingSecret();
  const at = new Date().toISOString();
  const replacement: ConsultRequest = {
    ...record,
    access_key_hash: hashTrackingSecret(replacementSecret),
    updated_at: at,
    version: record.version + 1,
  };
  const applied = await runTool(
    ctx,
    "intake.requester_rotate_key",
    () => store.compareAndSwapConsultation<ConsultationRecord>(
      requestId,
      {
        version: record.version,
        recordType: "consultation_request",
        retentionExpiresAt: record.retention_expires_at,
        guardAt: at,
        mutation: "credential_rotation",
      },
      replacement,
    ),
    {
      contentIds: [requestId],
      humanDisposition: "edit",
      operationalRight: "verified_consultation_requester",
    },
  );
  if (!applied.applied) {
    if (applied.reason === "expired" || applied.reason === "tombstone") {
      return { kind: "not_rotatable", message: "This request has expired, so its access key can no longer be replaced." };
    }
    if (applied.reason === "not_found") return { kind: "not_found" };
    return { kind: "conflict", message: "This request changed before the access key could be replaced. Check the latest status and try again." };
  }
  if (!isConsultRequest(applied.value)) {
    return { kind: "conflict", message: "This request changed before the access key could be replaced. Check the latest status and try again." };
  }
  return { kind: "rotated", request: requesterView(applied.value), access_key: replacementSecret };
}

/* ---- Owner queue ---- */

export async function ownerQueue(ctx: ToolContext): Promise<ConsultRequest[]> {
  await sweepExpiredConsultations();
  const items = (await runTool(ctx, "queue.status_get", () => getStore().list<ConsultationRecord>("consult_request")))
    .filter(isConsultRequest)
    .filter((item) => !consultationRequestIsExpired(item))
    .filter((item) => item.eligibility_status === "confirmed_dsd");
  const open = items.filter((i) => !["completed", "declined", "withdrawn"].includes(i.status));
  const closed = items.filter((i) => ["completed", "declined", "withdrawn"].includes(i.status)).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return [...rankSuggest(open), ...closed];
}

export async function ownerEligibilityQueue(ctx: ToolContext): Promise<ConsultRequest[]> {
  await sweepExpiredConsultations();
  const items = (await runTool(ctx, "queue.status_get", () => getStore().list<ConsultationRecord>("consult_request")))
    .filter(isConsultRequest)
    .filter((item) => !consultationRequestIsExpired(item));
  return items
    .filter((item) => item.eligibility_status === "pending" && item.status === "pending_eligibility_review")
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function ownerGet(requestId: string, ctx: ToolContext): Promise<ConsultRequest | null> {
  const stored = await runTool(ctx, "queue.status_get", () => getStore().get<ConsultationRecord>("consult_request", requestId));
  if (!stored) return null;
  const record = await redactIfExpired(stored);
  return isConsultRequest(record) ? record : null;
}

const SCHEDULED_FOR_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

export const StatusUpdateSchema = z.object({
  status: z.enum(STATUSES).optional(),
  eligibility_decision: z.enum(["confirmed_dsd", "not_dsd"]).optional(),
  status_reason: z.enum(OWNER_STATUS_REASON_TEMPLATES).nullable().optional(),
  scheduled_for: z.string().trim().max(64).refine(
    (value) => value === "" || (SCHEDULED_FOR_PATTERN.test(value) && Number.isFinite(Date.parse(value))),
    "Use a complete date and time with a time zone.",
  ).optional(),
  owner_notes: z.enum(OWNER_NOTE_TEMPLATES).nullable().optional(),
  pinned_order: z.number().int().min(0).max(999).nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one change is required.",
});

export type StatusUpdate = z.infer<typeof StatusUpdateSchema>;

function safetyAuditTool(result: SafetyResult): string {
  if (result.code === "surveillance_refused") return "safety.surveillance_refuse";
  if (result.code === "persona_refused") return "safety.persona_refuse";
  if (result.code === "publish_refused") return "safety.publish_refuse";
  if (result.code === "tribal_gate") return "safety.tribal_gate";
  return "safety.pii_detect";
}

async function screenOwnerQueueText(
  field: "status_reason" | "owner_notes",
  value: string | undefined,
  ctx: ToolContext,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!value) return { ok: true };
  const checks: SafetyResult[] = [];
  const approvedTemplate = ownerQueueTextIsApprovedTemplate(field, value);
  if (!approvedTemplate && ownerQueueContainsNamedPerson(value)) {
    checks.push({
      ok: false,
      code: "pii_detected",
      fieldClass: "Named person",
      message: "Choose one of the approved role- and workflow-based options.",
    });
  }
  checks.push(runSafetyGates(value, { tribal: false }));
  // Both S3 owner-text fields exclude contact details, employee identifiers,
  // and nonpublic material. The requester-facing reason has the same boundary,
  // but private workspace notes do not become a side channel for those details.
  checks.push(externalResearchGate(value));
  const refusal = checks.find((result) => !result.ok);
  if (refusal && !refusal.ok) {
    await auditRefusal(ctx, safetyAuditTool(refusal), refusal.code!);
    return {
      ok: false,
      reason: field === "status_reason"
        ? "The requester-facing reason contains information that cannot be stored or shown here. Remove names, contact details, case, medical, personnel, complaint, or other private information."
        : "Private notes still cannot contain names, identifiers, case, medical, personnel, complaint, or other private information. Describe only the general consultation work.",
    };
  }
  if (!approvedTemplate) {
    return { ok: false, reason: "Choose one of the approved role- and workflow-based options." };
  }
  return { ok: true };
}

export async function ownerUpdate(requestId: string, update: unknown, ctx: ToolContext): Promise<{ ok: boolean; reason?: string; request?: ConsultRequest }> {
  if (update && typeof update === "object" && !Array.isArray(update)) {
    const candidate = update as Record<string, unknown>;
    for (const field of ["status_reason", "owner_notes"] as const) {
      if (typeof candidate[field] !== "string") continue;
      const screened = await screenOwnerQueueText(field, candidate[field], ctx);
      if (!screened.ok) return screened;
    }
  }
  const parsed = StatusUpdateSchema.safeParse(update);
  if (!parsed.success) return { ok: false, reason: "Invalid update. Check the status, date and time, and field lengths." };
  const change = parsed.data;
  const store = getStore();
  const stored = await store.get<ConsultationRecord>("consult_request", requestId);
  if (!stored) return { ok: false, reason: "not_found" };
  const record = await redactIfExpired(stored);
  if (!isConsultRequest(record)) return { ok: false, reason: "not_found" };
  const req = record;
  const at = new Date().toISOString();
  const next: ConsultRequest = { ...req, updated_at: at, history: [...req.history] };
  if (change.eligibility_decision) {
    if (req.eligibility_status !== "pending" || req.status !== "pending_eligibility_review") {
      return { ok: false, reason: "Eligibility has already been decided." };
    }
    if (change.eligibility_decision === "confirmed_dsd") {
      next.eligibility_status = "confirmed_dsd";
      next.status = "received";
      next.history.push({ at, status: "received", by: "owner", note: "DSD scope confirmed." });
    } else {
      if (!change.status_reason) return { ok: false, reason: "A redirect is required when a request is outside DSD." };
      next.eligibility_status = "not_dsd";
      next.status = "declined";
      next.status_reason = change.status_reason;
      next.history.push({ at, status: "declined", by: "owner", note: change.status_reason });
    }
  }
  if (change.status && change.status !== next.status) {
    if (!canTransition(next.status, change.status)) return { ok: false, reason: `Cannot move from ${next.status} to ${change.status}.` };
    if (change.status === "declined" && !change.status_reason) return { ok: false, reason: "A reason and redirect are required when declining." };
    next.status = change.status;
    next.history.push({ at, status: change.status, by: "owner", note: change.status_reason ?? undefined });
  }
  if (change.status_reason !== undefined) next.status_reason = change.status_reason ?? undefined;
  if (change.scheduled_for !== undefined) next.scheduled_for = change.scheduled_for || undefined;
  if (change.owner_notes !== undefined) next.owner_notes = change.owner_notes ?? undefined;
  if (change.pinned_order !== undefined) next.pinned_order = change.pinned_order === null ? undefined : change.pinned_order;
  if (!consultationStateIsValid(next.eligibility_status, next.status)) {
    return { ok: false, reason: "That eligibility and status combination is not allowed." };
  }
  if (next.status === "scheduled" && !next.scheduled_for) {
    return { ok: false, reason: "Add the agreed date, time, and time zone before marking this request Scheduled." };
  }
  const reasonScreen = await screenOwnerQueueText("status_reason", next.status_reason, ctx);
  if (!reasonScreen.ok) return reasonScreen;
  const notesScreen = await screenOwnerQueueText("owner_notes", next.owner_notes, ctx);
  if (!notesScreen.ok) return notesScreen;
  next.version = req.version + 1;
  next.packet = { ...next.packet, snapshot: { ...next.packet.snapshot, Status: statusLabel(next.status) } };
  const applied = await runTool(
    ctx,
    "queue.status_set",
    () => store.compareAndSwapConsultation<ConsultationRecord>(
      requestId,
      {
        version: req.version,
        recordType: "consultation_request",
        retentionExpiresAt: req.retention_expires_at,
        guardAt: at,
        mutation: "owner_update",
      },
      next,
    ),
    { contentIds: [requestId], humanDisposition: "edit" },
  );
  if (!applied.applied) {
    if (applied.reason === "expired" && isConsultRequest(applied.current)) {
      await redactIfExpired(applied.current);
      return { ok: false, reason: "not_found" };
    }
    return { ok: false, reason: applied.reason === "not_found" || applied.reason === "tombstone" ? "not_found" : "This request changed before the update could be saved." };
  }
  if (!isConsultRequest(applied.value)) return { ok: false, reason: "This request changed before the update could be saved." };
  return { ok: true, request: applied.value };
}

function statusLabel(s: Status): string {
  return { pending_eligibility_review: "Eligibility review", received: "Received", under_review: "Under review", scheduled: "Scheduled", in_progress: "In progress", completed: "Completed", declined: "Declined", withdrawn: "Withdrawn" }[s];
}

export function consultationRequestIsExpired(request: ConsultRequest, now = Date.now()): boolean {
  const deadline = Date.parse(request.retention_expires_at);
  // An invalid deadline is unsafe metadata on an S3 record. Treat it as due now so
  // corrupt data cannot evade the retention sweep or appear in either queue.
  // Date.parse accepts ambiguous and partial forms such as "9999"; only the
  // exact UTC instant format generated by Date#toISOString is trustworthy.
  return (
    !Number.isFinite(deadline)
    || new Date(deadline).toISOString() !== request.retention_expires_at
    || deadline <= now
  );
}

function consultationTombstone(request: ConsultRequest, redactedAt: string): ConsultRequestTombstone {
  const expiry = Date.parse(request.retention_expires_at);
  const expiryIsCanonical = Number.isFinite(expiry)
    && new Date(expiry).toISOString() === request.retention_expires_at;
  return {
    record_type: "consultation_tombstone",
    request_id: request.request_id,
    status: "expired",
    access_key_hash: request.access_key_hash,
    access_key_version: request.access_key_version,
    retention_policy_id: request.retention_policy_id,
    retention_expires_at: expiryIsCanonical ? request.retention_expires_at : redactedAt,
    redacted_at: redactedAt,
    updated_at: redactedAt,
    version: request.version + 1,
  };
}

async function enforceRetention(
  initial: ConsultationRecord,
  now = Date.now(),
): Promise<{ record: ConsultationRecord; redacted: boolean }> {
  if (isConsultRequestTombstone(initial)) return { record: initial, redacted: false };
  if (!consultationRequestIsExpired(initial, now)) return { record: initial, redacted: false };
  const store = getStore();
  const guardAt = new Date(now).toISOString();
  let current: ConsultationRecord = initial;

  // An active write that wins the first race increments the version but cannot
  // extend retention. Reload that winner and retry the tombstone mutation.
  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (isConsultRequestTombstone(current)) return { record: current, redacted: false };
    if (!consultationRequestIsExpired(current, now)) return { record: current, redacted: false };
    const parsedExpiry = Date.parse(current.retention_expires_at);
    const invalidExpiry: boolean = !Number.isFinite(parsedExpiry)
      || new Date(parsedExpiry).toISOString() !== current.retention_expires_at;
    const tombstone = consultationTombstone(current, guardAt);
    const applied: ConsultationCasResult<ConsultationRecord> =
      await store.compareAndSwapConsultation<ConsultationRecord>(
        current.request_id,
        {
          version: current.version,
          recordType: "consultation_request",
          retentionExpiresAt: current.retention_expires_at,
          guardAt,
          mutation: invalidExpiry ? "invalid_expiry_tombstone" : "expiry_tombstone",
        },
        tombstone,
      );
    if (applied.applied) return { record: applied.value, redacted: true };
    if (applied.reason === "tombstone" && isConsultRequestTombstone(applied.current)) {
      return { record: applied.current, redacted: false };
    }
    if (!applied.current || !isConsultRequest(applied.current)) {
      // Never return the stale S3 payload after a failed retention write.
      return { record: tombstone, redacted: false };
    }
    current = applied.current;
  }

  // Continuous conflict is treated as hidden/redacted for this caller. The next
  // queue read or scheduled sweep retries persistence from the newest version.
  return { record: consultationTombstone(current as ConsultRequest, guardAt), redacted: false };
}

async function redactIfExpired(record: ConsultationRecord, now = Date.now()): Promise<ConsultationRecord> {
  return (await enforceRetention(record, now)).record;
}

export type ConsultationRetentionSweep = {
  examined: number;
  redacted: string[];
  already_redacted: number;
};

/** Repeatable retention sweep. A second run observes tombstones and changes nothing. */
export async function sweepExpiredConsultations(now = new Date()): Promise<ConsultationRetentionSweep> {
  const at = now.getTime();
  if (!Number.isFinite(at)) throw new Error("A valid retention sweep time is required.");
  const store = getStore();
  const records = await store.list<ConsultationRecord>("consult_request");
  const result: ConsultationRetentionSweep = {
    examined: records.length,
    redacted: [],
    already_redacted: 0,
  };
  for (const record of records) {
    if (isConsultRequestTombstone(record)) {
      result.already_redacted += 1;
      continue;
    }
    if (!isConsultRequest(record) || !consultationRequestIsExpired(record, at)) continue;
    const enforced = await enforceRetention(record, at);
    if (enforced.redacted) result.redacted.push(record.request_id);
    else if (isConsultRequestTombstone(enforced.record)) result.already_redacted += 1;
  }
  return result;
}

function retentionForPersistence(backend: "memory" | "file" | "postgres") {
  if (process.env.NODE_ENV === "test" && backend === "memory") {
    return { policyVersion: "test-fixture-only", retentionDays: 1 };
  }
  if (backend === "memory" && isIsolatedMemoryStore()) {
    return { policyVersion: "evaluation-fixture-only", retentionDays: 1 };
  }
  return consultationRetention();
}
