import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import {
  issueSessionCookieValue,
  OWNER_COOKIE,
  OWNER_SESSION_SECONDS,
  verifyOwnerKey,
} from "@/lib/auth/owner";
import { consumeRequestLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import { readBoundedFormUrlEncoded } from "@/lib/http/request";
import { revokeOwnerSession } from "@/lib/auth/owner-session";
import { safeConsultantReturnPath } from "@/lib/auth/consultant-return";

const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Open the Consultant Workspace before signing in." },
      { status: 403, headers: NO_STORE },
    );
  }

  let limit;
  try {
    limit = await consumeRequestLimit(request, { scope: "owner-login", limit: 10, windowSeconds: 15 * 60 });
  } catch {
    return NextResponse.json({ error: "Workspace sign-in is not available just now." }, { status: 503, headers: NO_STORE });
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
      { error: form.status === 413 ? "That sign-in request is too large." : "Open the Consultant Workspace before signing in." },
      { status: form.status, headers: NO_STORE },
    );
  }
  if (form.value.getAll("key").length !== 1 || form.value.getAll("returnTo").length > 1) {
    return NextResponse.json({ error: "Open the Consultant Workspace before signing in." }, { status: 400, headers: NO_STORE });
  }
  const key = form.value.get("key") ?? "";
  const requested = form.value.get("returnTo") ?? "/consultant";
  const returnTo = safeConsultantReturnPath(requested);
  // The origin has passed the same-origin check. Next's internal URL may use
  // localhost even when the browser uses 127.0.0.1; return to the browser host.
  const url = new URL(returnTo, request.headers.get("origin")!);
  if (!verifyOwnerKey(key)) {
    url.searchParams.set("denied", "1");
    return NextResponse.redirect(url, { status: 303, headers: NO_STORE });
  }

  // Successful reauthentication rotates the presented session identifier.
  // Revoke first so a storage outage cannot leave two accepted sessions while
  // claiming that rotation succeeded.
  const priorSession = request.cookies.get(OWNER_COOKIE)?.value;
  if (priorSession) {
    try {
      await revokeOwnerSession(priorSession);
    } catch {
      return NextResponse.json(
        { error: "Workspace sign-in is not available just now." },
        { status: 503, headers: NO_STORE },
      );
    }
  }
  const value = issueSessionCookieValue();
  const res = NextResponse.redirect(url, { status: 303, headers: NO_STORE });
  if (value) {
    res.cookies.set(OWNER_COOKIE, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: OWNER_SESSION_SECONDS,
    });
  }
  return res;
}
