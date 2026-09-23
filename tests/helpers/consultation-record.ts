import {
  buildHeadsUpPacket,
  ConsultInputSchema,
  prioritySignals,
  type ConsultationRecord,
  type ConsultRequest,
  type ConsultRequestTombstone,
} from "@/lib/intelligence/consult/schema";

function requestId(createdAt: string, sequence: number): string {
  return `CR-${createdAt.slice(0, 10).replaceAll("-", "")}-${String(sequence).padStart(4, "0")}`;
}

export function buildTestConsultationRecord(options: {
  sequence?: number;
  createdAt?: string;
  retentionExpiresAt?: string;
} = {}): ConsultRequest {
  const createdAt = options.createdAt ?? new Date(Date.now() - 1000).toISOString();
  const id = requestId(createdAt, options.sequence ?? 9001);
  const input = ConsultInputSchema.parse({
    program_context: "one_dsd",
    dsd_eligibility_attestation: true,
    requester_role: "analyst_tech",
    work_name: "Protected consultation lifecycle test",
    stage: "designing",
    goals: "Verify the complete protected consultation persistence contract at every boundary.",
    equity_questions_considered: "We considered access, burden, community voice, and decision ownership.",
    desired_support_type: ["scoping_goals"],
    timing_urgency: "exploratory",
    affected_populations: ["disability_access"],
    access_language_needs: ["plain_language_materials"],
    preferred_meeting_mode: "virtual",
    links: ["https://mn.gov/dhs/"],
    attachment_notes: "General program materials will be available during the consultation.",
    situation: "The test verifies that only a complete, purpose-specific S3 consultation can cross the storage boundary.",
    participation_notice_id: "dsd_consultation_request",
    participation_notice_version: "1.0.0",
    share_confirmation: true,
  });
  const signals = prioritySignals(input);
  const status = "pending_eligibility_review" as const;
  return {
    ...input,
    record_type: "consultation_request",
    request_id: id,
    access_key_hash: "a".repeat(64),
    access_key_version: "sha256-v1",
    sensitivity_class: "S3",
    participation_class: "voluntary_shared",
    official_record: false,
    eligibility_status: "pending",
    participation_acknowledged_at: createdAt,
    retention_policy_id: "test-fixture-only",
    retention_expires_at: options.retentionExpiresAt ?? "2099-01-01T00:00:00.000Z",
    submission_fingerprint: "b".repeat(64),
    created_at: createdAt,
    updated_at: createdAt,
    version: 1,
    status,
    priority_signals: signals,
    packet: buildHeadsUpPacket(input, {
      request_id: id,
      created_at: createdAt,
      status,
      signals,
    }),
    history: [{ at: createdAt, status, by: "system" }],
  };
}

export function withConsultationStatus(
  record: ConsultRequest,
  status: ConsultRequest["status"],
  at: string,
  by: "requester" | "owner" = "owner",
): ConsultRequest {
  const eligibility = status === "pending_eligibility_review" || status === "withdrawn"
    ? record.eligibility_status
    : "confirmed_dsd";
  const labels: Record<ConsultRequest["status"], string> = {
    pending_eligibility_review: "Eligibility review",
    received: "Received",
    under_review: "Under review",
    scheduled: "Scheduled",
    in_progress: "In progress",
    completed: "Completed",
    declined: "Declined",
    withdrawn: "Withdrawn",
  };
  return {
    ...record,
    eligibility_status: eligibility,
    status,
    status_reason: status === "declined"
      ? "This request is outside One DSD consultation scope. Contact your administration Equity Director for consultation support."
      : record.status_reason,
    updated_at: at,
    version: record.version + 1,
    packet: { ...record.packet, snapshot: { ...record.packet.snapshot, Status: labels[status] } },
    history: [...record.history, { at, status, by }],
  };
}

export function buildTestConsultationTombstone(
  record: ConsultRequest,
  at: string,
  retentionExpiresAt = record.retention_expires_at,
): ConsultRequestTombstone {
  return {
    record_type: "consultation_tombstone",
    request_id: record.request_id,
    status: "expired",
    access_key_hash: record.access_key_hash,
    access_key_version: record.access_key_version,
    retention_policy_id: record.retention_policy_id,
    retention_expires_at: retentionExpiresAt,
    redacted_at: at,
    updated_at: at,
    version: record.version + 1,
  };
}

export type TestConsultationRecord = ConsultationRecord;
