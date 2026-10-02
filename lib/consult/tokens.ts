import "server-only";

import { createHash, createHmac, randomBytes } from "node:crypto";

/**
 * Private-link tokens are derived, not random, so a lost link can be sent
 * again without storing it. Only the SHA-256 hash of a token is stored; the
 * HMAC secret stays on the server (CONSULT_LINK_SECRET).
 */
let localSecret: Buffer | undefined;

function secret(): Buffer {
  const configured = process.env.CONSULT_LINK_SECRET?.trim();
  if (configured) {
    const value = Buffer.from(configured, "utf8");
    if (value.byteLength < 32) throw new Error("CONSULT_LINK_SECRET must be at least 32 bytes.");
    return value;
  }
  if (process.env.NODE_ENV === "production") throw new Error("CONSULT_LINK_SECRET is required in production.");
  localSecret ??= randomBytes(32);
  return localSecret;
}

function derive(label: string, subject: string): string {
  return createHmac("sha256", secret()).update(`one-dsd-consult-v1\0${label}\0${subject}`).digest("base64url");
}

export function requesterToken(requestId: string): string {
  return derive("requester", requestId);
}

export function leaderToken(email: string, issuedAtIso: string): string {
  return derive("leader", `${email.toLowerCase()}\0${issuedAtIso}`);
}

export function hashToken(token: string): string {
  return createHash("sha256").update(`one-dsd-consult-hash-v1\0${token}`).digest("hex");
}

export function validTokenShape(token: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}
