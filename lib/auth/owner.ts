/**
 * Consultant Workspace owner session. Strong authentication for the protected workspace is
 * a decision-log item (D-08). MVP posture: a server-side owner key (PAC_OWNER_KEY) exchanged
 * for an httpOnly session cookie. In development without a key, a local default is used and
 * labeled. In production without a key, the workspace is locked.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const OWNER_COOKIE = "pac_owner";
export const OWNER_SESSION_SECONDS = 60 * 60 * 8;
const DEV_DEFAULT_KEY = "local-dev-owner";
const SESSION_VERSION = "v2";
const SESSION_CONTEXT = "pac-owner-session-v2";
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{32}$/;

type OwnerSessionPayload = {
  iat: number;
  exp: number;
  sid: string;
  aud: "practice-workspace";
  environment: string;
};

function sessionEnvironment(): string {
  return (
    process.env.PAC_DATA_ENV?.trim()
    || process.env.VERCEL_ENV?.trim()
    || process.env.NODE_ENV?.trim()
    || "unknown"
  );
}

export function ownerKey(): string | null {
  const k = process.env.PAC_OWNER_KEY?.trim();
  if (k) {
    if ((process.env.NODE_ENV === "production" || process.env.VERCEL === "1") && Buffer.byteLength(k, "utf8") < 32) {
      return null;
    }
    return k;
  }
  if (process.env.NODE_ENV === "development") return DEV_DEFAULT_KEY;
  return null;
}

export function ownerKeyIsDevDefault(): boolean {
  return !process.env.PAC_OWNER_KEY?.trim() && process.env.NODE_ENV === "development";
}

export function ownerConfigured(): boolean {
  return ownerKey() !== null;
}

function sessionSignature(key: string, encodedPayload: string): Buffer {
  return createHmac("sha256", key)
    .update(`${SESSION_CONTEXT}.${encodedPayload}`)
    .digest();
}

function signatureMatches(key: string, encodedPayload: string, encodedSignature: string): boolean {
  const expected = sessionSignature(key, encodedPayload);
  let supplied = Buffer.alloc(expected.length);
  let validLength = false;

  try {
    if (/^[A-Za-z0-9_-]+$/.test(encodedSignature)) {
      const decoded = Buffer.from(encodedSignature, "base64url");
      const canonicalEncoding = decoded.toString("base64url") === encodedSignature;
      validLength = decoded.length === expected.length && canonicalEncoding;
      if (validLength) supplied = decoded;
    }
  } catch {
    validLength = false;
  }

  const equal = timingSafeEqual(supplied, expected);
  return validLength && equal;
}

function parseSessionPayload(encodedPayload: string): OwnerSessionPayload | null {
  if (!encodedPayload || encodedPayload.length > 512 || !/^[A-Za-z0-9_-]+$/.test(encodedPayload)) {
    return null;
  }
  try {
    const raw = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const payload = value as Partial<OwnerSessionPayload>;
    if (!Number.isSafeInteger(payload.iat) || !Number.isSafeInteger(payload.exp)) return null;
    if (typeof payload.sid !== "string" || !SESSION_ID_PATTERN.test(payload.sid)) return null;
    if (payload.aud !== "practice-workspace") return null;
    if (typeof payload.environment !== "string" || payload.environment !== sessionEnvironment()) return null;
    return payload as OwnerSessionPayload;
  } catch {
    return null;
  }
}

export function verifyOwnerKey(candidate: string): boolean {
  const key = ownerKey();
  if (!key || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function issueSessionCookieValue(now = Date.now()): string | null {
  const key = ownerKey();
  if (!key || !Number.isFinite(now)) return null;
  const issuedAt = Math.floor(now / 1000);
  const payload: OwnerSessionPayload = {
    iat: issuedAt,
    exp: issuedAt + OWNER_SESSION_SECONDS,
    sid: randomBytes(24).toString("base64url"),
    aud: "practice-workspace",
    environment: sessionEnvironment(),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = sessionSignature(key, encodedPayload).toString("base64url");
  return `${SESSION_VERSION}.${encodedPayload}.${signature}`;
}

export function isOwnerSession(cookieValue: string | undefined, now = Date.now()): boolean {
  const key = ownerKey();
  if (!key || !cookieValue || !Number.isFinite(now)) return false;

  const segments = cookieValue.split(".");
  const encodedPayload = segments[1] ?? "";
  const signatureValid = signatureMatches(key, encodedPayload, segments[2] ?? "");
  if (segments.length !== 3 || segments[0] !== SESSION_VERSION || !signatureValid) return false;

  const payload = parseSessionPayload(encodedPayload);
  if (!payload || payload.exp - payload.iat !== OWNER_SESSION_SECONDS) return false;
  const currentTime = Math.floor(now / 1000);
  if (payload.iat > currentTime) return false;
  return currentTime < payload.exp;
}

export function verifiedOwnerSession(
  cookieValue: string | undefined,
  now = Date.now(),
): Readonly<OwnerSessionPayload> | null {
  if (!isOwnerSession(cookieValue, now)) return null;
  const encodedPayload = cookieValue!.split(".")[1] ?? "";
  return parseSessionPayload(encodedPayload);
}
