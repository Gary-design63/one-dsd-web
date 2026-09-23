import {
  consultationTransitionIsValid,
  type EligibilityStatus,
  type Status,
} from "@/lib/intelligence/consult/schema";

export type ConsultationMutationKind =
  | "requester_correction"
  | "requester_withdrawal"
  | "owner_update"
  | "system_packet_refresh"
  | "system_triage"
  | "credential_rotation"
  | "expiry_tombstone"
  | "invalid_expiry_tombstone";

export type ConsultationCasExpectation = {
  version: number;
  recordType: "consultation_request";
  retentionExpiresAt: string;
  guardAt: string;
  mutation: ConsultationMutationKind;
};

export type ConsultationCasFailureReason =
  | "not_found"
  | "conflict"
  | "expired"
  | "tombstone";

export type ConsultationCasResult<T> =
  | { applied: true; value: T }
  | { applied: false; reason: ConsultationCasFailureReason; current: T | null };

const TOMBSTONE_KEYS = new Set([
  "record_type",
  "request_id",
  "status",
  "access_key_hash",
  "access_key_version",
  "retention_policy_id",
  "retention_expires_at",
  "redacted_at",
  "updated_at",
  "version",
]);

/** Accommodate ordinary server/database skew without granting caller time authority. */
export const CONSULTATION_CAS_MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function recordType(value: Record<string, unknown>): unknown {
  return value.record_type ?? "consultation_request";
}

function validInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function invalidInstant(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && !validInstant(value);
}

function immutableIdentityMatches(
  current: Record<string, unknown>,
  replacement: Record<string, unknown>,
  allowCredentialRotation = false,
) {
  return (allowCredentialRotation || replacement.access_key_hash === current.access_key_hash)
    && replacement.access_key_version === current.access_key_version
    && replacement.retention_policy_id === current.retention_policy_id;
}

function credentialRotationOnly(
  current: Record<string, unknown>,
  replacement: Record<string, unknown>,
  guardAt: string,
): boolean {
  if (
    replacement.access_key_hash === current.access_key_hash
    || replacement.updated_at !== guardAt
  ) return false;
  const mutable = new Set(["access_key_hash", "updated_at", "version"]);
  const keys = new Set([...Object.keys(current), ...Object.keys(replacement)]);
  for (const key of keys) {
    if (mutable.has(key)) continue;
    if (JSON.stringify(current[key]) !== JSON.stringify(replacement[key])) return false;
  }
  return true;
}

const CORRECTABLE_FIELDS = new Set([
  "requester_role", "work_name", "stage", "goals", "equity_questions_considered",
  "desired_support_type", "support_other_note", "timing_urgency", "deadline_date",
  "affected_populations", "populations_note", "access_language_needs", "access_note",
  "preferred_meeting_mode", "links", "attachment_notes", "situation",
]);

const REQUESTER_CORRECTION_CHANGES = new Set([
  ...CORRECTABLE_FIELDS,
  "priority_signals", "packet", "correction_history", "updated_at", "version",
]);
const REQUESTER_WITHDRAWAL_CHANGES = new Set([
  "status", "packet", "history", "updated_at", "version",
]);
const OWNER_UPDATE_CHANGES = new Set([
  "eligibility_status", "status", "status_reason", "scheduled_for", "owner_notes",
  "pinned_order", "packet", "history", "updated_at", "version",
]);
const SYSTEM_PACKET_REFRESH_CHANGES = new Set(["packet", "updated_at", "version"]);
const TRIAGE_CHANGES = new Set([
  "status", "pinned_order", "packet", "history", "updated_at", "version",
]);

function jsonEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function onlyApprovedKeysChanged(
  current: Record<string, unknown>,
  replacement: Record<string, unknown>,
  approved: ReadonlySet<string>,
): boolean {
  const keys = new Set([...Object.keys(current), ...Object.keys(replacement)]);
  for (const key of keys) {
    if (!approved.has(key) && !jsonEqual(current[key], replacement[key])) return false;
  }
  return true;
}

function exactArrayPrefix(currentValue: unknown, replacementValue: unknown): Record<string, unknown>[] | null {
  const current = Array.isArray(currentValue) ? currentValue : [];
  const replacement = Array.isArray(replacementValue) ? replacementValue : [];
  if (replacement.length < current.length) return null;
  if (!current.every((entry, index) => jsonEqual(entry, replacement[index]))) return null;
  const appended = replacement.slice(current.length);
  return appended.every((entry) => object(entry))
    ? appended as Record<string, unknown>[]
    : null;
}

function packetStatusChangeOnly(currentValue: unknown, replacementValue: unknown): boolean {
  if (jsonEqual(currentValue, replacementValue)) return true;
  const current = object(currentValue);
  const replacement = object(replacementValue);
  const currentSnapshot = object(current?.snapshot);
  const replacementSnapshot = object(replacement?.snapshot);
  if (!current || !replacement || !currentSnapshot || !replacementSnapshot) return false;
  return jsonEqual(current, {
    ...replacement,
    snapshot: { ...replacementSnapshot, Status: currentSnapshot.Status },
  });
}

function activeMutationAuthorized(
  current: Record<string, unknown>,
  replacement: Record<string, unknown>,
  expected: ConsultationCasExpectation,
): boolean {
  if (replacement.updated_at !== expected.guardAt) return false;

  if (expected.mutation === "requester_correction") {
    if (!onlyApprovedKeysChanged(current, replacement, REQUESTER_CORRECTION_CHANGES)) return false;
    if (!jsonEqual(current.history, replacement.history)) return false;
    const appended = exactArrayPrefix(current.correction_history, replacement.correction_history);
    if (appended?.length !== 1) return false;
    const entry = appended[0];
    const fields = entry && Array.isArray(entry.fields) ? entry.fields : [];
    if (!entry || entry.at !== expected.guardAt || entry.by !== "requester") return false;
    for (const field of CORRECTABLE_FIELDS) {
      if (!jsonEqual(current[field], replacement[field]) && !fields.includes(field)) return false;
    }
    return true;
  }

  if (expected.mutation === "requester_withdrawal") {
    if (!onlyApprovedKeysChanged(current, replacement, REQUESTER_WITHDRAWAL_CHANGES)) return false;
    if (!jsonEqual(current.correction_history, replacement.correction_history)) return false;
    const appended = exactArrayPrefix(current.history, replacement.history);
    const entry = appended?.[0];
    return appended?.length === 1
      && Boolean(entry)
      && Object.keys(entry!).sort().join(",") === "at,by,status"
      && entry!.at === expected.guardAt
      && entry!.by === "requester"
      && entry!.status === "withdrawn"
      && replacement.eligibility_status === current.eligibility_status
      && consultationTransitionIsValid(
        current.eligibility_status as EligibilityStatus,
        current.status as Status,
        replacement.eligibility_status as EligibilityStatus,
        replacement.status as Status,
      )
      && packetStatusChangeOnly(current.packet, replacement.packet);
  }

  if (expected.mutation === "owner_update") {
    if (!onlyApprovedKeysChanged(current, replacement, OWNER_UPDATE_CHANGES)) return false;
    if (!jsonEqual(current.correction_history, replacement.correction_history)) return false;
    const appended = exactArrayPrefix(current.history, replacement.history);
    if (!appended || appended.length > 2) return false;
    const stateChanged = current.eligibility_status !== replacement.eligibility_status
      || current.status !== replacement.status;
    if ((stateChanged && appended.length < 1) || (!stateChanged && appended.length > 0)) return false;
    if (!appended.every((entry) => entry.at === expected.guardAt && entry.by === "owner")) return false;
    return consultationTransitionIsValid(
      current.eligibility_status as EligibilityStatus,
      current.status as Status,
      replacement.eligibility_status as EligibilityStatus,
      replacement.status as Status,
    ) && packetStatusChangeOnly(current.packet, replacement.packet);
  }

  if (expected.mutation === "system_packet_refresh") {
    return onlyApprovedKeysChanged(current, replacement, SYSTEM_PACKET_REFRESH_CHANGES)
      && jsonEqual(current.history, replacement.history)
      && jsonEqual(current.correction_history, replacement.correction_history);
  }

  if (expected.mutation === "system_triage") {
    if (!onlyApprovedKeysChanged(current, replacement, TRIAGE_CHANGES)) return false;
    if (!jsonEqual(current.correction_history, replacement.correction_history)) return false;
    const appended = exactArrayPrefix(current.history, replacement.history);
    const entry = appended?.[0];
    return appended?.length === 1
      && Boolean(entry)
      && entry!.at === expected.guardAt
      && entry!.by === "system"
      && current.eligibility_status === "confirmed_dsd"
      && replacement.eligibility_status === "confirmed_dsd"
      && current.status === "received"
      && replacement.status === "under_review"
      && packetStatusChangeOnly(current.packet, replacement.packet);
  }

  return false;
}

export function assertConsultationCasCommand(
  id: string,
  expected: ConsultationCasExpectation,
  replacementValue: unknown,
): void {
  const replacement = object(replacementValue);
  if (!id || !replacement) throw new Error("A consultation CAS replacement must be a JSON object.");
  if (
    !Number.isSafeInteger(expected.version)
    || expected.version < 1
    || expected.recordType !== "consultation_request"
    || (expected.mutation === "invalid_expiry_tombstone"
      ? !invalidInstant(expected.retentionExpiresAt)
      : !validInstant(expected.retentionExpiresAt))
    || !validInstant(expected.guardAt)
    || ![
      "requester_correction", "requester_withdrawal", "owner_update",
      "system_packet_refresh", "system_triage",
      "credential_rotation", "expiry_tombstone", "invalid_expiry_tombstone",
    ].includes(expected.mutation)
  ) {
    throw new Error("The consultation CAS expectation is invalid.");
  }
  if (
    replacement.request_id !== id
    || replacement.version !== expected.version + 1
    || replacement.retention_expires_at !== (
      expected.mutation === "invalid_expiry_tombstone"
        ? expected.guardAt
        : expected.retentionExpiresAt
    )
  ) {
    throw new Error("The consultation CAS replacement changes guarded identity or version fields.");
  }

  if (!["expiry_tombstone", "invalid_expiry_tombstone"].includes(expected.mutation)) {
    if (
      recordType(replacement) !== "consultation_request"
      || replacement.status === "expired"
      || replacement.sensitivity_class !== "S3"
      || "redacted_at" in replacement
    ) {
      throw new Error("An active consultation update must remain a full S3 consultation request.");
    }
    return;
  }

  if (
    replacement.record_type !== "consultation_tombstone"
    || replacement.status !== "expired"
    || replacement.redacted_at !== expected.guardAt
    || replacement.updated_at !== expected.guardAt
    || Object.keys(replacement).length !== TOMBSTONE_KEYS.size
    || Object.keys(replacement).some((key) => !TOMBSTONE_KEYS.has(key))
  ) {
    throw new Error("An expiry mutation must write only the approved consultation tombstone.");
  }
}

export function evaluateConsultationCas<T>(
  id: string,
  currentValue: T | null,
  expected: ConsultationCasExpectation,
  replacementValue: T,
  currentTime = Date.now(),
): ConsultationCasResult<T> {
  assertConsultationCasCommand(id, expected, replacementValue);
  if (currentValue === null) return { applied: false, reason: "not_found", current: null };
  const current = object(currentValue);
  const replacement = object(replacementValue)!;
  if (!current) return { applied: false, reason: "conflict", current: currentValue };
  if (recordType(current) === "consultation_tombstone") {
    return { applied: false, reason: "tombstone", current: currentValue };
  }
  if (
    recordType(current) !== expected.recordType
    || current.request_id !== id
    || current.version !== expected.version
    || current.retention_expires_at !== expected.retentionExpiresAt
    || (expected.mutation === "invalid_expiry_tombstone"
      ? !invalidInstant(current.retention_expires_at)
      : !validInstant(current.retention_expires_at))
    || !immutableIdentityMatches(current, replacement, expected.mutation === "credential_rotation")
  ) {
    return { applied: false, reason: "conflict", current: currentValue };
  }

  const requestedGuard = Date.parse(expected.guardAt);
  if (
    !Number.isFinite(requestedGuard)
    || Math.abs(requestedGuard - currentTime) > CONSULTATION_CAS_MAX_CLOCK_SKEW_MS
  ) {
    return { applied: false, reason: "conflict", current: currentValue };
  }
  const effectiveGuard = Math.max(currentTime, requestedGuard);
  const expiresAt = Date.parse(current.retention_expires_at);
  if (
    expected.mutation === "credential_rotation"
    && !credentialRotationOnly(current, replacement, expected.guardAt)
  ) {
    return { applied: false, reason: "conflict", current: currentValue };
  }
  if (expected.mutation === "invalid_expiry_tombstone") {
    if (validInstant(current.retention_expires_at)) {
      return { applied: false, reason: "conflict", current: currentValue };
    }
    return { applied: true, value: replacementValue };
  }
  if (
    expected.mutation !== "credential_rotation"
    && !["expiry_tombstone", "invalid_expiry_tombstone"].includes(expected.mutation)
    && !activeMutationAuthorized(current, replacement, expected)
  ) {
    return { applied: false, reason: "conflict", current: currentValue };
  }
  if (!["expiry_tombstone", "invalid_expiry_tombstone"].includes(expected.mutation) && expiresAt <= effectiveGuard) {
    return { applied: false, reason: "expired", current: currentValue };
  }
  if (expected.mutation === "expiry_tombstone" && expiresAt > effectiveGuard) {
    return { applied: false, reason: "conflict", current: currentValue };
  }
  return { applied: true, value: replacementValue };
}
