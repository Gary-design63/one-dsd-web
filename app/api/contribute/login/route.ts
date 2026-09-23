import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { programSessionCookieOptions } from "@/lib/auth/program-cookie";
import { protectedFeatureActivation } from "@/lib/auth/protected-feature-activation";
import { PROGRAM_SESSION_COOKIE, programIdentityStore } from "@/lib/auth/program-identity";
import { withProgramCredentialWork } from "@/lib/auth/program-credentials";
import { readBoundedFormUrlEncoded } from "@/lib/http/request";
import {
  consumePseudonymousLimit,
  consumeRequestLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Open the contributor workspace before signing in." },
      { status: 403, headers: NO_STORE },
    );
  }
  if (!protectedFeatureActivation("protected_identity").active) {
    return NextResponse.json(
      { error: "Contributor sign-in is not available yet." },
      { status: 503, headers: NO_STORE },
    );
  }

  let limit;
  try {
    limit = await consumeRequestLimit(request, {
      scope: "program-login-network",
      limit: 40,
      windowSeconds: 15 * 60,
    });
  } catch {
    return NextResponse.json(
      { error: "Contributor sign-in is not available just now." },
      { status: 503, headers: NO_STORE },
    );
  }
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Please wait before trying to sign in again." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  const form = await readBoundedFormUrlEncoded(request, 4_096);
  if (!form.ok) {
    return NextResponse.json(
      { error: form.status === 413 ? "That sign-in request is too large." : "Open the contributor workspace before signing in." },
      { status: form.status, headers: NO_STORE },
    );
  }
  if (form.value.getAll("signInId").length !== 1 || form.value.getAll("passphrase").length !== 1) {
    return NextResponse.json(
      { error: "Enter your sign-in ID and passphrase." },
      { status: 400, headers: NO_STORE },
    );
  }

  const suppliedSignInId = form.value.get("signInId") ?? "";
  const accountSubject = suppliedSignInId.length <= 128
    ? suppliedSignInId.trim().toLocaleLowerCase("en-US") || "invalid-sign-in"
    : "invalid-sign-in";
  let accountLimit;
  try {
    accountLimit = await consumePseudonymousLimit(accountSubject, {
      scope: "program-login-account",
      limit: 10,
      windowSeconds: 15 * 60,
    });
  } catch {
    return NextResponse.json(
      { error: "Contributor sign-in is not available just now." },
      { status: 503, headers: NO_STORE },
    );
  }
  if (!accountLimit.allowed) {
    return NextResponse.json(
      { error: "Please wait before trying to sign in again." },
      { status: 429, headers: rateLimitHeaders(accountLimit) },
    );
  }

  try {
    const signedIn = await withProgramCredentialWork(() => programIdentityStore().signIn(
      suppliedSignInId,
      form.value.get("passphrase") ?? "",
    ));
    const destination = new URL("/contribute", request.url);
    if (!signedIn) {
      destination.searchParams.set("denied", "1");
      return NextResponse.redirect(destination, { status: 303, headers: NO_STORE });
    }
    const response = NextResponse.redirect(destination, { status: 303, headers: NO_STORE });
    response.cookies.set(PROGRAM_SESSION_COOKIE, signedIn.token, programSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      { error: "Contributor sign-in is not available just now." },
      { status: 503, headers: NO_STORE },
    );
  }
}
