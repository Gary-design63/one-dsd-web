import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { issueSessionCookieValue, OWNER_COOKIE, OWNER_SESSION_SECONDS } from "@/lib/auth/owner";
import { safeConsultantReturnPath } from "@/lib/auth/consultant-return";
import { isLoopbackHost, offlineHandoffToken } from "@/lib/offline/mode";

const NO_STORE = { "cache-control": "no-store" };

function tokenMatches(candidate: string, expected: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Offline edition only: the launcher opens this address with its per-launch
 * token so the owner arrives in the workspace without a separate sign-in.
 * Hosted deployments never set the token, so this route does not exist there.
 */
export async function GET(request: NextRequest) {
  const expected = offlineHandoffToken();
  if (!expected || !isLoopbackHost(request.headers.get("host"))) {
    return new NextResponse(null, { status: 404, headers: NO_STORE });
  }
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!tokenMatches(token, expected)) {
    return NextResponse.json({ error: "Open the program from its Start shortcut." }, { status: 403, headers: NO_STORE });
  }
  const value = issueSessionCookieValue();
  if (!value) {
    return NextResponse.json({ error: "The workspace is not available just now." }, { status: 503, headers: NO_STORE });
  }
  const next = safeConsultantReturnPath(request.nextUrl.searchParams.get("next") ?? "/consultant");
  // The host was verified as this computer above; keep the address the browser used.
  const res = NextResponse.redirect(new URL(next, `http://${request.headers.get("host")}`), { status: 303, headers: NO_STORE });
  res.cookies.set(OWNER_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OWNER_SESSION_SECONDS,
  });
  return res;
}
