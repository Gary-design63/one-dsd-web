/**
 * Privacy-minimized operational records are useful for reliability, security,
 * and cost review, but they are not permanent program memory.
 */
export const OPERATIONAL_RECORD_RETENTION_DAYS = 90;

/** One cleanup call stays small enough for a scheduled serverless run. */
export const OPERATIONAL_RETENTION_BATCH_LIMIT = 10_000;

export const OPERATIONAL_RECORD_RETENTION_MS =
  OPERATIONAL_RECORD_RETENTION_DAYS * 24 * 60 * 60 * 1000;

const CANONICAL_UTC_INSTANT =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/** Accept only the exact UTC format emitted by Date#toISOString. */
export function canonicalOperationalInstant(value: unknown): value is string {
  if (typeof value !== "string" || !CANONICAL_UTC_INSTANT.test(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

export function assertCanonicalOperationalInstant(value: unknown): asserts value is string {
  if (!canonicalOperationalInstant(value)) {
    throw new Error("Operational records require a canonical UTC timestamp.");
  }
}

export function operationalRetentionCutoff(now = Date.now()): number {
  if (!Number.isFinite(now)) throw new Error("A valid operational-retention time is required.");
  return now - OPERATIONAL_RECORD_RETENTION_MS;
}

/** Malformed timestamps are not deletion authority; housekeeping fails closed. */
export function operationalRecordIsExpired(value: unknown, now = Date.now()): boolean {
  return canonicalOperationalInstant(value)
    && Date.parse(value) <= operationalRetentionCutoff(now);
}
