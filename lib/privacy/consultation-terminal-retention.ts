import { consultationPersistenceContractIsValid } from "@/lib/trust/consultation-persistence-contract";

/**
 * A minimal consultation tombstone exists only long enough to make late retries
 * and requester lookups fail consistently after the S3 request body is removed.
 * It is not permanent program memory.
 */
export const CONSULTATION_TOMBSTONE_RETENTION_DAYS = 30;

export const CONSULTATION_TOMBSTONE_RETENTION_MS =
  CONSULTATION_TOMBSTONE_RETENTION_DAYS * 24 * 60 * 60 * 1000;

/** Malformed or non-tombstone records never become deletion authority. */
export function consultationTombstoneTerminalDeletionDue(
  objectId: string,
  value: unknown,
  now = Date.now(),
): boolean {
  if (!Number.isFinite(now) || !consultationPersistenceContractIsValid(objectId, value)) return false;
  const tombstone = value as { record_type?: unknown; redacted_at?: unknown };
  if (tombstone.record_type !== "consultation_tombstone" || typeof tombstone.redacted_at !== "string") return false;
  return Date.parse(tombstone.redacted_at) <= now - CONSULTATION_TOMBSTONE_RETENTION_MS;
}
