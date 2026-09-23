import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { getStore, type RateLimitDecision } from "@/lib/intelligence/memory/store";
import { assertRuntimeRateLimitRequest } from "@/lib/trust/work-object-contract";

let localSecret: Buffer | undefined;

function configuredSecret(): Buffer {
  const configured = process.env.PAC_RATE_LIMIT_SECRET?.trim();
  if (configured) {
    const value = Buffer.from(configured, "utf8");
    if ((process.env.NODE_ENV === "production" || process.env.VERCEL === "1") && value.byteLength < 32) {
      throw new Error("PAC_RATE_LIMIT_SECRET must be at least 32 bytes when deployed.");
    }
    return value;
  }
  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    throw new Error("PAC_RATE_LIMIT_SECRET is required for deployed request limits.");
  }
  localSecret ??= randomBytes(32);
  return localSecret;
}

function trustedNetworkSubject(request: NextRequest): string {
  if (process.env.VERCEL === "1") {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
    if (forwarded && forwarded.length <= 64 && /^[0-9a-f:.]+$/i.test(forwarded)) return forwarded;
  }
  return "unidentified-local-request";
}

function subjectHash(request: NextRequest, scope: string): string {
  return createHmac("sha256", configuredSecret())
    .update(`pac-rate-limit-v1\0${scope}\0${trustedNetworkSubject(request)}`)
    .digest("hex");
}

export async function consumeRequestLimit(
  request: NextRequest,
  options: { scope: string; limit: number; windowSeconds: number },
): Promise<RateLimitDecision> {
  const hashedSubject = subjectHash(request, options.scope);
  assertRuntimeRateLimitRequest(
    options.scope,
    hashedSubject,
    options.limit,
    options.windowSeconds,
  );
  return getStore().consumeRateLimit(
    options.scope,
    hashedSubject,
    options.limit,
    options.windowSeconds,
  );
}

/**
 * Throttle a targeted account or one-time code without ever persisting its raw
 * value. Callers should pass a bounded canonical account identifier or the
 * exact bounded invitation token; only the HMAC reaches the store.
 */
export async function consumePseudonymousLimit(
  subject: string,
  options: { scope: string; limit: number; windowSeconds: number },
): Promise<RateLimitDecision> {
  if (!subject || Buffer.byteLength(subject, "utf8") > 512 || subject.includes("\0")) {
    throw new Error("Invalid rate-limit subject.");
  }
  const hashedSubject = createHmac("sha256", configuredSecret())
    .update("pac-rate-limit-v2\0" + options.scope + "\0account_or_token\0" + subject)
    .digest("hex");
  assertRuntimeRateLimitRequest(
    options.scope,
    hashedSubject,
    options.limit,
    options.windowSeconds,
  );
  return getStore().consumeRateLimit(
    options.scope,
    hashedSubject,
    options.limit,
    options.windowSeconds,
  );
}

export function rateLimitHeaders(decision: RateLimitDecision): Record<string, string> {
  const retryAfter = Math.max(1, Math.ceil((Date.parse(decision.resetAt) - Date.now()) / 1000));
  return {
    "cache-control": "no-store",
    "retry-after": String(retryAfter),
    "x-ratelimit-remaining": String(decision.remaining),
    "x-ratelimit-reset": decision.resetAt,
  };
}
