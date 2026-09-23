import "server-only";

import { consultationTrackingConfigured } from "./tracking";
import {
  consultationActivationEvidence,
  type ConsultationEvidenceRequirement,
} from "./activation-evidence";

export const CONSULTATION_PREVIEW_MESSAGE =
  "Consultation requests are in preview. DSD staff can review the summary that would be shared, but the program will not submit or save a request yet.";

export const CONSULTATION_TRACKING_PREVIEW_MESSAGE =
  "Request tracking is temporarily unavailable because its protected storage, privacy policy, or security settings are not ready.";

export type ConsultationActivationRequirement =
  | "feature_switch"
  | "durable_store"
  | "runtime_database"
  | "tracking_secret"
  | "rate_limit_secret"
  | "approved_policy"
  | "approved_retention"
  | "activation_evidence"
  | ConsultationEvidenceRequirement
  | "correction_process"
  | "recovery_process"
  | "incident_process"
  | "delivery_process";

export type ConsultationActivationStatus = {
  enabled: boolean;
  ready: boolean;
  missing: ConsultationActivationRequirement[];
  policyVersion?: string;
  retentionDays?: number;
};

export type ConsultationTrackingStatus = Omit<ConsultationActivationStatus, "enabled">;

function on(name: string): boolean {
  return process.env[name]?.trim().toLowerCase() === "on";
}

function policyVersion(): string | undefined {
  const value = process.env.PAC_CONSULTATION_POLICY_VERSION?.trim();
  return value && /^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/.test(value) ? value : undefined;
}

function retentionDays(): number | undefined {
  const value = process.env.PAC_CONSULTATION_RETENTION_DAYS?.trim();
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= 3650 ? parsed : undefined;
}

function secretHasMinimumEntropy(name: string): boolean {
  const value = process.env[name]?.trim();
  return Boolean(value && Buffer.byteLength(value, "utf8") >= 32);
}

function consultationTrackingRequirements(): {
  missing: ConsultationActivationRequirement[];
  policyVersion?: string;
  retentionDays?: number;
} {
  const missing: ConsultationActivationRequirement[] = [];
  const version = policyVersion();
  const days = retentionDays();
  const evidence = consultationActivationEvidence();
  const selectedEvidence = process.env.PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID?.trim();
  if (process.env.PAC_STORE?.trim().toLowerCase() !== "postgres") missing.push("durable_store");
  if (!process.env.PAC_RUNTIME_DATABASE_URL?.trim()) missing.push("runtime_database");
  if (!consultationTrackingConfigured()) missing.push("tracking_secret");
  if (!secretHasMinimumEntropy("PAC_RATE_LIMIT_SECRET")) missing.push("rate_limit_secret");
  if (!evidence.valid || !selectedEvidence || selectedEvidence !== evidence.evidenceId) {
    missing.push("activation_evidence");
  }
  for (const requirement of evidence.missing) missing.push(requirement);
  if (!version || version !== evidence.policyVersion) missing.push("approved_policy");
  if (!days || days !== evidence.retentionDays) missing.push("approved_retention");
  if (!on("PAC_CONSULTATION_DELETION_READY")) missing.push("deletion_process");
  if (!on("PAC_CONSULTATION_BACKUP_READY")) missing.push("backup_process");
  if (!on("PAC_CONSULTATION_RESTORE_READY")) missing.push("restore_process");
  if (!on("PAC_CONSULTATION_RECOVERY_READY")) missing.push("recovery_process");
  if (!on("PAC_CONSULTATION_INCIDENT_READY")) missing.push("incident_process");
  return { missing: [...new Set(missing)], policyVersion: version, retentionDays: days };
}

/** Existing-request access is independent from whether new intake is accepting submissions. */
export function consultationTrackingActivationStatus(): ConsultationTrackingStatus {
  const requirements = consultationTrackingRequirements();
  return {
    ready: requirements.missing.length === 0,
    ...requirements,
  };
}

export function consultationTrackingEnabled(): boolean {
  return consultationTrackingActivationStatus().ready;
}

export function consultationCorrectionEnabled(): boolean {
  return consultationTrackingEnabled() && on("PAC_CONSULTATION_CORRECTION_READY");
}

/**
 * One switch can request activation, but it cannot make a protected feature
 * ready. Every dependency stays fail closed until its corresponding policy or
 * operating evidence has been approved and configured.
 */
export function consultationActivationStatus(): ConsultationActivationStatus {
  const enabled = on("PAC_CONSULTATION_INTAKE_ENABLED");
  const tracking = consultationTrackingRequirements();
  const missing: ConsultationActivationRequirement[] = [...tracking.missing];

  if (!enabled) missing.push("feature_switch");
  if (!on("PAC_CONSULTATION_CORRECTION_READY")) missing.push("correction_process");
  if (!on("PAC_CONSULTATION_DELIVERY_READY")) missing.push("delivery_process");

  return {
    enabled,
    ready: missing.length === 0,
    missing,
    policyVersion: tracking.policyVersion,
    retentionDays: tracking.retentionDays,
  };
}

/** Real consultation intake stays closed until every protected-feature dependency is ready. */
export function consultationIntakeEnabled(): boolean {
  return consultationActivationStatus().ready;
}

export function consultationRetention(): { policyVersion: string; retentionDays: number } {
  const status = consultationActivationStatus();
  if (!status.ready || !status.policyVersion || !status.retentionDays) {
    throw new Error("Consultation persistence is not ready.");
  }
  return { policyVersion: status.policyVersion, retentionDays: status.retentionDays };
}
