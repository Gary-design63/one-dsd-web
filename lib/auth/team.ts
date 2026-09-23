/**
 * One DSD Team shared access. The team working space lives on the public side of the
 * program. A shared team key (PAC_TEAM_KEY), given by the consultant to approved team
 * members, is exchanged for an httpOnly session cookie. In development without a key,
 * a labeled local default is used. In production without a key, the space is locked.
 * The consultant's own workspace session also opens the team space.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const TEAM_COOKIE = "pac_team";
export const TEAM_SESSION_SECONDS = 60 * 60 * 24 * 30;
const DEV_DEFAULT_KEY = "local-dev-team";
const SESSION_VERSION = "v1";
const SESSION_CONTEXT = "pac-team-session-v1";

type TeamSessionPayload = { iat: number; exp: number; sid: string; aud: "one-dsd-team" };

export function teamKey(): string | null {
  const k = process.env.PAC_TEAM_KEY?.trim();
  if (k) return k;
  if (process.env.NODE_ENV === "development") return DEV_DEFAULT_KEY;
  return null;
}

export function teamKeyIsDevDefault(): boolean {
  return !process.env.PAC_TEAM_KEY?.trim() && process.env.NODE_ENV === "development";
}

/** Team members type a simple phrase; capitals and extra spaces do not matter. */
function normalizeKey(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function verifyTeamKey(candidate: string): boolean {
  const key = teamKey();
  if (!key || !candidate) return false;
  const a = Buffer.from(normalizeKey(candidate));
  const b = Buffer.from(normalizeKey(key));
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(key: string, encodedPayload: string): Buffer {
  return createHmac("sha256", key).update(`${SESSION_CONTEXT}.${encodedPayload}`).digest();
}

export function issueTeamSessionCookieValue(now = Date.now()): string | null {
  const key = teamKey();
  if (!key) return null;
  const iat = Math.floor(now / 1000);
  const payload: TeamSessionPayload = {
    iat,
    exp: iat + TEAM_SESSION_SECONDS,
    sid: randomBytes(24).toString("base64url"),
    aud: "one-dsd-team",
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${SESSION_VERSION}.${encoded}.${signature(key, encoded).toString("base64url")}`;
}

export function isTeamSession(cookieValue: string | undefined, now = Date.now()): boolean {
  const key = teamKey();
  if (!key || !cookieValue) return false;
  const [version, encoded = "", sig = ""] = cookieValue.split(".");
  if (version !== SESSION_VERSION || !/^[A-Za-z0-9_-]+$/.test(encoded) || !/^[A-Za-z0-9_-]+$/.test(sig)) return false;
  const expected = signature(key, encoded);
  const supplied = Buffer.from(sig, "base64url");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<TeamSessionPayload>;
    if (payload.aud !== "one-dsd-team" || !Number.isSafeInteger(payload.iat) || !Number.isSafeInteger(payload.exp)) return false;
    const current = Math.floor(now / 1000);
    return (payload.iat as number) <= current && current < (payload.exp as number);
  } catch {
    return false;
  }
}
