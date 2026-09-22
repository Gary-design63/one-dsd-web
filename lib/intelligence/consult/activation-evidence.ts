import activationRegister from "@/config/protected-feature-activation.json";

export const CONSULTATION_EVIDENCE_REQUIREMENTS = [
  "approved_policy",
  "deletion_process",
  "correction_process",
  "backup_process",
  "restore_process",
  "recovery_process",
  "incident_process",
  "delivery_process",
] as const;

export type ConsultationEvidenceRequirement = (typeof CONSULTATION_EVIDENCE_REQUIREMENTS)[number];

type ConsultationEvidence = {
  evidenceId?: string;
  approvalState: "approved" | "blocked_pending_evidence" | "invalid";
  policyVersion?: string;
  retentionDays?: number;
  missing: ConsultationEvidenceRequirement[];
  valid: boolean;
};

const EVIDENCE_ID = /^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$/;
const POLICY_VERSION = /^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/;

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

/**
 * Parse the committed evidence register. Invalid or incomplete material stays
 * fail closed; environment variables cannot turn pending evidence into approval.
 */
export function consultationActivationEvidence(
  candidate: unknown = activationRegister,
): ConsultationEvidence {
  const root = objectValue(candidate);
  const features = objectValue(root?.features);
  const feature = objectValue(features?.dsd_consultation);
  const requirements = objectValue(feature?.requirements);
  const missing: ConsultationEvidenceRequirement[] = [];
  let valid = root?.schema_version === "1.0.0" && Boolean(feature && requirements);

  for (const requirement of CONSULTATION_EVIDENCE_REQUIREMENTS) {
    const entry = objectValue(requirements?.[requirement]);
    const state = entry?.state;
    const evidenceId = entry?.evidence_id;
    if (!entry || !new Set(["verified", "pending"]).has(String(state))) valid = false;
    if (state !== "verified" || typeof evidenceId !== "string" || !EVIDENCE_ID.test(evidenceId)) {
      missing.push(requirement);
    }
  }

  const approvalState = feature?.approval_state;
  if (!new Set(["approved", "blocked_pending_evidence"]).has(String(approvalState))) valid = false;
  const evidenceId = typeof feature?.evidence_id === "string" && EVIDENCE_ID.test(feature.evidence_id)
    ? feature.evidence_id
    : undefined;
  if (!evidenceId) valid = false;
  const policyVersion = typeof feature?.policy_version === "string" && POLICY_VERSION.test(feature.policy_version)
    ? feature.policy_version
    : undefined;
  const retentionDays = Number.isSafeInteger(feature?.retention_days)
    && Number(feature?.retention_days) >= 1
    && Number(feature?.retention_days) <= 3650
    ? Number(feature?.retention_days)
    : undefined;

  const approved = valid
    && approvalState === "approved"
    && missing.length === 0
    && Boolean(policyVersion)
    && retentionDays !== undefined;

  return {
    evidenceId,
    approvalState: valid
      ? approvalState as "approved" | "blocked_pending_evidence"
      : "invalid",
    policyVersion,
    retentionDays,
    missing,
    valid: approved,
  };
}
