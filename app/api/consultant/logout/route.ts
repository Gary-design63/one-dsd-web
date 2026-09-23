import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { OWNER_COOKIE } from "@/lib/auth/owner";
import { revokeOwnerSession } from "@/lib/auth/owner-session";

const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Open the Consultant Workspace before signing out." },
      { status: 403, headers: NO_STORE },
    );
  }

  try {
    await revokeOwnerSession(request.cookies.get(OWNER_COOKIE)?.value);
  } catch {
    // Do not report a successful sign-out or discard the browser's only retry token
    // unless the server-side revocation was durably recorded. Session validation also
    // fails closed while the revocation store is unavailable.
    return NextResponse.json(
      { error: "Workspace sign-out is not available just now. Please try again." },
      { status: 503, headers: NO_STORE },
    );
  }

  const res = NextResponse.redirect(new URL("/", request.headers.get("origin")!), { status: 303, headers: NO_STORE });
  res.cookies.set(OWNER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
