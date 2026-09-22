import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as login } from "@/app/api/consultant/login/route";
import { POST as logout } from "@/app/api/consultant/logout/route";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import {
  isOwnerSession,
  issueSessionCookieValue,
  OWNER_COOKIE,
  OWNER_SESSION_SECONDS,
} from "@/lib/auth/owner";
import { ownerSessionIsActive, revokeOwnerSession } from "@/lib/auth/owner-session";
import { ownerFromRequest } from "@/lib/auth/request";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";

const ORIGINAL_OWNER_KEY = process.env.PAC_OWNER_KEY;
const ORIGINAL_RATE_LIMIT_SECRET = process.env.PAC_RATE_LIMIT_SECRET;
const ORIGINAL_DATA_ENV = process.env.PAC_DATA_ENV;
const ORIGINAL_VERCEL = process.env.VERCEL;
const NOW = Date.UTC(2026, 8, 5, 12, 0, 0);

function mutationRequest(
  url: string,
  headers: Record<string, string> = {},
): Pick<Request, "headers" | "url"> {
  return new Request(url, { method: "POST", headers });
}

beforeEach(() => {
  resetStoreForTests();
  process.env.PAC_OWNER_KEY = "owner-session-test-key-with-32-bytes-minimum";
  process.env.PAC_RATE_LIMIT_SECRET = "owner-rate-limit-test-secret-with-32-bytes-minimum";
  process.env.PAC_DATA_ENV = "local";
  delete process.env.VERCEL;
});

afterEach(() => {
  if (ORIGINAL_OWNER_KEY === undefined) delete process.env.PAC_OWNER_KEY;
  else process.env.PAC_OWNER_KEY = ORIGINAL_OWNER_KEY;
  if (ORIGINAL_RATE_LIMIT_SECRET === undefined) delete process.env.PAC_RATE_LIMIT_SECRET;
  else process.env.PAC_RATE_LIMIT_SECRET = ORIGINAL_RATE_LIMIT_SECRET;
  if (ORIGINAL_DATA_ENV === undefined) delete process.env.PAC_DATA_ENV;
  else process.env.PAC_DATA_ENV = ORIGINAL_DATA_ENV;
  if (ORIGINAL_VERCEL === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = ORIGINAL_VERCEL;
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

function signedSession(payload: Record<string, unknown>): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", process.env.PAC_OWNER_KEY!)
    .update(`pac-owner-session-v2.${encoded}`)
    .digest("base64url");
  return `v2.${encoded}.${signature}`;
}

describe("owner session envelope", () => {
  it("issues unique signed sessions that remain valid only inside the eight-hour window", () => {
    const first = issueSessionCookieValue(NOW);
    const second = issueSessionCookieValue(NOW);
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first).not.toBe(second);

    expect(isOwnerSession(first!, NOW)).toBe(true);
    expect(isOwnerSession(first!, NOW + OWNER_SESSION_SECONDS * 1000 - 1)).toBe(true);
    expect(isOwnerSession(first!, NOW + OWNER_SESSION_SECONDS * 1000)).toBe(false);
  });

  it("rejects a future-issued session even when its signature is valid", () => {
    const future = issueSessionCookieValue(NOW + 60_000);
    expect(future).toBeTruthy();
    expect(isOwnerSession(future!, NOW)).toBe(false);
    expect(isOwnerSession(future!, NOW + 60_000)).toBe(true);
  });

  it("rejects payload and signature tampering plus malformed legacy values", () => {
    const token = issueSessionCookieValue(NOW)!;
    const [version, payload, signature] = token.split(".");
    const alteredPayload = `${payload.slice(0, -1)}${payload.endsWith("A") ? "B" : "A"}`;
    const alteredSignature = `${signature.slice(0, -1)}${signature.endsWith("A") ? "B" : "A"}`;

    expect(isOwnerSession(`${version}.${alteredPayload}.${signature}`, NOW)).toBe(false);
    expect(isOwnerSession(`${version}.${payload}.${alteredSignature}`, NOW)).toBe(false);
    expect(isOwnerSession("pac-owner-session-v1", NOW)).toBe(false);
    expect(isOwnerSession("v2.not-json.short", NOW)).toBe(false);
    expect(isOwnerSession(undefined, NOW)).toBe(false);
  });

  it("rejects a non-canonical Base64URL signature even when it decodes to the same HMAC bytes", () => {
    const token = issueSessionCookieValue(NOW)!;
    const [version, payload, signature] = token.split(".");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    const finalIndex = alphabet.indexOf(signature.at(-1)!);
    expect(finalIndex % 4).toBe(0);
    const equivalentEncoding = `${signature.slice(0, -1)}${alphabet[finalIndex + 1]}`;
    expect(Buffer.from(equivalentEncoding, "base64url").equals(Buffer.from(signature, "base64url"))).toBe(true);
    expect(isOwnerSession(`${version}.${payload}.${equivalentEncoding}`, NOW)).toBe(false);
  });

  it("invalidates existing sessions when the owner key changes", () => {
    const token = issueSessionCookieValue(NOW)!;
    process.env.PAC_OWNER_KEY = "replacement-owner-session-key";
    expect(isOwnerSession(token, NOW)).toBe(false);
  });

  it("locks the deployed workspace when the owner key is too short", () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.PAC_OWNER_KEY = "too-short";
    expect(issueSessionCookieValue(NOW)).toBeNull();
    expect(isOwnerSession(signedSession({}), NOW)).toBe(false);
  });

  it("binds signed sessions to the Consultant Workspace audience", () => {
    const issuedAt = Math.floor(NOW / 1000);
    const wrongAudience = signedSession({
      iat: issuedAt,
      exp: issuedAt + OWNER_SESSION_SECONDS,
      sid: "A".repeat(32),
      aud: "another-application",
      environment: "local",
    });

    expect(isOwnerSession(wrongAudience, NOW)).toBe(false);
  });

  it("binds signed sessions to the data environment", () => {
    process.env.PAC_DATA_ENV = "preview";
    const token = issueSessionCookieValue(NOW)!;
    expect(isOwnerSession(token, NOW)).toBe(true);

    process.env.PAC_DATA_ENV = "production";
    expect(isOwnerSession(token, NOW)).toBe(false);

    process.env.PAC_DATA_ENV = "preview";
    expect(isOwnerSession(token, NOW)).toBe(true);
  });
});

describe("server-side owner session state", () => {
  it("rejects a cryptographically valid session when revocation lookup fails", async () => {
    const token = issueSessionCookieValue()!;
    expect(isOwnerSession(token)).toBe(true);
    const lookup = vi.spyOn(getStore(), "get").mockRejectedValueOnce(new Error("synthetic store outage"));

    expect(await ownerSessionIsActive(token)).toBe(false);
    lookup.mockRestore();
    expect(await ownerSessionIsActive(token)).toBe(true);
  });

  it("closes route access when the session is revoked", async () => {
    const token = issueSessionCookieValue()!;
    const independentToken = issueSessionCookieValue()!;
    const request = new NextRequest("https://program.example/api/consultant/review", {
      headers: { cookie: `${OWNER_COOKIE}=${token}` },
    });

    expect(await ownerFromRequest(request)).toBe(true);
    expect(await revokeOwnerSession(token)).toBe(true);
    expect(await ownerSessionIsActive(token)).toBe(false);
    expect(await ownerFromRequest(request)).toBe(false);
    expect(await ownerSessionIsActive(independentToken)).toBe(true);
  });

  it("rejects requests that do not carry a live owner session", async () => {
    expect(await ownerFromRequest(new NextRequest("https://program.example/api/consultant/review"))).toBe(false);
    expect(await ownerFromRequest(new NextRequest("https://program.example/api/consultant/review", {
      headers: { cookie: `${OWNER_COOKIE}=not-a-session` },
    }))).toBe(false);
  });
});

describe("owner sign-in and sign-out routes", () => {
  function loginRequest(origin?: string, currentSession?: string, returnTo = "/consultant") {
    const headers = new Headers({ "content-type": "application/x-www-form-urlencoded" });
    if (origin) headers.set("origin", origin);
    if (currentSession) headers.set("cookie", `${OWNER_COOKIE}=${currentSession}`);
    return new NextRequest("https://program.example/api/consultant/login", {
      method: "POST",
      headers,
      body: new URLSearchParams({ key: "owner-session-test-key-with-32-bytes-minimum", returnTo }),
    });
  }

  it("rejects sign-in without same-origin provenance and does not set a cookie", async () => {
    const response = await login(loginRequest());
    expect(response.status).toBe(403);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("sets and clears a secure, bounded owner cookie", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const signedIn = await login(loginRequest("https://program.example"));
    expect(signedIn.status).toBe(303);
    const setCookie = signedIn.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    const normalized = setCookie!.toLowerCase();
    expect(normalized).toContain("httponly");
    expect(normalized).toContain("secure");
    expect(normalized).toContain("samesite=lax");
    expect(normalized).toContain("path=/");
    expect(normalized).toContain(`max-age=${OWNER_SESSION_SECONDS}`);
    const token = /pac_owner=([^;]+)/.exec(setCookie!)?.[1];
    expect(token).toBeTruthy();
    expect(isOwnerSession(token, Date.now())).toBe(true);

    expect(await ownerSessionIsActive(token)).toBe(true);
    const signedOut = await logout(new NextRequest("https://program.example/api/consultant/logout", {
      method: "POST",
      headers: {
        origin: "https://program.example",
        cookie: `${OWNER_COOKIE}=${token}`,
      },
    }));
    expect(signedOut.status).toBe(303);
    const cleared = signedOut.headers.get("set-cookie")!.toLowerCase();
    expect(cleared).toContain("pac_owner=");
    expect(cleared).toContain("max-age=0");
    expect(cleared).toContain("httponly");
    expect(cleared).toContain("secure");
    expect(cleared).toContain("samesite=lax");
    expect(cleared).toContain("path=/");
    expect(isOwnerSession(token)).toBe(true);
    expect(await ownerSessionIsActive(token)).toBe(false);
    expect(await ownerFromRequest(new NextRequest("https://program.example/consultant", {
      headers: { cookie: `${OWNER_COOKIE}=${token}` },
    }))).toBe(false);
  });

  it("returns only to registered consultant workspace destinations", async () => {
    const team = await login(loginRequest(
      "https://program.example",
      undefined,
      "/consultant/one-dsd-team",
    ));
    expect(team.headers.get("location")).toBe("https://program.example/consultant/one-dsd-team");

    const deepQueue = await login(loginRequest(
      "https://program.example",
      undefined,
      "/consultant/queue/cr_20260905_example",
    ));
    expect(deepQueue.headers.get("location")).toBe("https://program.example/consultant/queue/cr_20260905_example");

    const nestedEscape = await login(loginRequest(
      "https://program.example",
      undefined,
      "/consultant/queue/valid/../../collect",
    ));
    expect(nestedEscape.headers.get("location")).toBe("https://program.example/consultant");

    const untrusted = await login(loginRequest(
      "https://program.example",
      undefined,
      "https://other.example/collect",
    ));
    expect(untrusted.headers.get("location")).toBe("https://program.example/consultant");
  });

  it("keeps local sign-in and sign-out on the validated browser host", async () => {
    const origin = "http://127.0.0.1:3222";
    const response = await login(new NextRequest("http://localhost:3222/api/consultant/login", {
      method: "POST",
      headers: { origin, host: "127.0.0.1:3222", "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ key: process.env.PAC_OWNER_KEY!, returnTo: "/consultant/workforce" }),
    }));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`${origin}/consultant/workforce`);
    const signedOut = await logout(new NextRequest("http://localhost:3222/api/consultant/logout", {
      method: "POST", headers: { origin, host: "127.0.0.1:3222" },
    }));
    expect(signedOut.headers.get("location")).toBe(`${origin}/`);
  });

  it("rotates and revokes the presented session on successful reauthentication", async () => {
    const previous = issueSessionCookieValue()!;
    expect(await ownerSessionIsActive(previous)).toBe(true);

    const response = await login(loginRequest("https://program.example", previous));
    expect(response.status).toBe(303);
    const replacement = /pac_owner=([^;]+)/.exec(response.headers.get("set-cookie") ?? "")?.[1];
    expect(replacement).toBeTruthy();
    expect(replacement).not.toBe(previous);
    expect(await ownerSessionIsActive(previous)).toBe(false);
    expect(await ownerSessionIsActive(replacement)).toBe(true);
  });

  it("does not report success or discard the retry cookie when revocation cannot be stored", async () => {
    const token = issueSessionCookieValue()!;
    vi.spyOn(getStore(), "put").mockRejectedValueOnce(new Error("synthetic store outage"));
    const request = () => new NextRequest("https://program.example/api/consultant/logout", {
      method: "POST",
      headers: {
        origin: "https://program.example",
        cookie: `${OWNER_COOKIE}=${token}`,
      },
    });

    const unavailable = await logout(request());
    expect(unavailable.status).toBe(503);
    expect(unavailable.headers.get("cache-control")).toBe("no-store");
    expect(unavailable.headers.get("set-cookie")).toBeNull();
    expect(await ownerSessionIsActive(token)).toBe(true);

    const retried = await logout(request());
    expect(retried.status).toBe(303);
    expect(await ownerSessionIsActive(token)).toBe(false);
  });
});

describe("same-origin mutation guard", () => {
  it("rejects missing, opaque, malformed, and cross-origin provenance", () => {
    expect(isSameOriginMutation(mutationRequest("https://program.example/change"))).toBe(false);
    expect(isSameOriginMutation(mutationRequest("https://program.example/change", { origin: "null" }))).toBe(false);
    expect(isSameOriginMutation(mutationRequest("https://program.example/change", { origin: "not a url" }))).toBe(false);
    expect(isSameOriginMutation(mutationRequest("https://program.example/change", { origin: "https://other.example" }))).toBe(false);
    expect(isSameOriginMutation(mutationRequest("https://program.example/change", { origin: "https://program.example/path" }))).toBe(false);
  });

  it("accepts an exact same-origin request and a routing-controlled Host match", () => {
    expect(isSameOriginMutation(mutationRequest("https://program.example/change", {
      origin: "https://program.example",
    }))).toBe(true);
    expect(isSameOriginMutation(mutationRequest("https://internal.invalid/change", {
      origin: "https://program.example",
      host: "program.example",
    }))).toBe(true);
  });

  it("accepts valid Vercel forwarding only in a Vercel runtime", () => {
    const headers = {
      origin: "https://pac-preview.vercel.app",
      host: "internal.invalid",
      "x-forwarded-host": "pac-preview.vercel.app",
      "x-forwarded-proto": "https",
    };
    expect(isSameOriginMutation(mutationRequest("http://internal.invalid/change", headers))).toBe(false);

    process.env.VERCEL = "1";
    expect(isSameOriginMutation(mutationRequest("http://internal.invalid/change", headers))).toBe(true);
    expect(isSameOriginMutation(mutationRequest("http://internal.invalid/change", {
      ...headers,
      "x-forwarded-host": "pac-preview.vercel.app, attacker.example",
    }))).toBe(false);
    expect(isSameOriginMutation(mutationRequest("http://internal.invalid/change", {
      ...headers,
      "x-forwarded-proto": "javascript",
    }))).toBe(false);
  });
});
