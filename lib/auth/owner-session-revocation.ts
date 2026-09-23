import { createHash } from "node:crypto";

export type OwnerSessionRevocation = {
  kind: "owner_session_revocation";
  session_hash: string;
  revoked_at: string;
  expires_at: string;
};

const REVOCATION_ID_PATTERN = /^owner-session-revoked-([a-f0-9]{64})$/;
export const OWNER_SESSION_REVOCATION_CLEANUP_GRACE_MS = 10 * 60 * 1000;

function canonicalInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return false;
  try {
    return new Date(timestamp).toISOString() === value;
  } catch {
    return false;
  }
}

export function ownerSessionRevocationId(sessionId: string): string {
  return `owner-session-revoked-${createHash("sha256").update(sessionId, "utf8").digest("hex")}`;
}

export function isOwnerSessionRevocation(
  objectId: string,
  value: unknown,
): value is OwnerSessionRevocation {
  const idMatch = REVOCATION_ID_PATTERN.exec(objectId);
  if (!idMatch || !value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (
    Object.keys(record).some((key) => !["kind", "session_hash", "revoked_at", "expires_at"].includes(key))
    || record.kind !== "owner_session_revocation"
    || typeof record.session_hash !== "string"
    || !/^[a-f0-9]{64}$/.test(record.session_hash)
    || record.session_hash !== idMatch[1]
    || !canonicalInstant(record.revoked_at)
    || !canonicalInstant(record.expires_at)
  ) {
    return false;
  }
  return Date.parse(record.revoked_at) <= Date.parse(record.expires_at);
}

export function ownerSessionRevocationIsExpired(
  objectId: string,
  value: unknown,
  now = Date.now(),
): value is OwnerSessionRevocation {
  return Number.isFinite(now)
    && isOwnerSessionRevocation(objectId, value)
    && Date.parse(value.expires_at) <= now - OWNER_SESSION_REVOCATION_CLEANUP_GRACE_MS;
}
