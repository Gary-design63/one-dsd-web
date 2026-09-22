import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const TRACKING_SECRET_BYTES = 32;
export const TRACKING_SECRET_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function trackingPepper(): string | null {
  const value = process.env.PAC_CONSULTATION_TRACKING_SECRET?.trim();
  return value && Buffer.byteLength(value, "utf8") >= 32 ? value : null;
}

export function consultationTrackingConfigured(): boolean {
  return trackingPepper() !== null;
}

/**
 * Idempotent browser submissions derive the same opaque secret without storing
 * it. Direct internal/evaluation calls use a fresh 256-bit random secret.
 */
export function issueTrackingSecret(options?: { idempotencyKey?: string; requestId?: string }): string {
  const idempotencyKey = options?.idempotencyKey;
  const requestId = options?.requestId;
  if (idempotencyKey && requestId) {
    const pepper = trackingPepper();
    if (!pepper) throw new Error("Consultation tracking is not configured.");
    return createHmac("sha256", pepper)
      .update(`pac-consultation-tracking-v1\0${requestId}\0${idempotencyKey}`)
      .digest("base64url");
  }
  return randomBytes(TRACKING_SECRET_BYTES).toString("base64url");
}

export function hashTrackingSecret(secret: string): string {
  if (!TRACKING_SECRET_PATTERN.test(secret)) throw new Error("Invalid consultation tracking secret.");
  return createHash("sha256").update(secret, "utf8").digest("hex");
}

export function verifyTrackingSecret(secret: string, expectedHash: string): boolean {
  let supplied = Buffer.alloc(32);
  let expected = Buffer.alloc(32);
  let valid = false;

  try {
    if (TRACKING_SECRET_PATTERN.test(secret) && /^[a-f0-9]{64}$/i.test(expectedHash)) {
      supplied = Buffer.from(hashTrackingSecret(secret), "hex");
      expected = Buffer.from(expectedHash, "hex");
      valid = supplied.length === 32 && expected.length === 32;
    }
  } catch {
    valid = false;
  }

  const equal = timingSafeEqual(supplied, expected);
  return valid && equal;
}
