import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { programSessionCookieOptions } from "@/lib/auth/program-cookie";
import {
  PROGRAM_SESSION_COOKIE,
  programIdentityConfigured,
  programIdentityStore,
} from "@/lib/auth/program-identity";

const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Open the contributor workspace before signing out." },
      { status: 403, headers: NO_STORE },
    );
  }

  const token = request.cookies.get(PROGRAM_SESSION_COOKIE)?.value;
  let revocationUnavailable = Boolean(token && !programIdentityConfigured());
  if (token && programIdentityConfigured()) {
    try {
      await programIdentityStore().signOut(token);
    } catch {
      revocationUnavailable = true;
    }
  }

  const destination = new URL("/contribute", request.url);
  if (revocationUnavailable) destination.searchParams.set("signout", "local_only");
  const response = NextResponse.redirect(destination, {
    status: 303,
    headers: NO_STORE,
  });
  response.cookies.set(PROGRAM_SESSION_COOKIE, "", programSessionCookieOptions(0));
  return response;
}
