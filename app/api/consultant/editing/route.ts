import { NextResponse, type NextRequest } from "next/server";
import { EDITING_COOKIE, ownerFromRequest } from "@/lib/auth/request";

const NO_STORE = { "cache-control": "no-store" };

/** Turns inline page editing on or off for this browser, then returns to the page the owner came from. */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode") === "on" ? "on" : "off";
  if (mode === "on" && !(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, headers: NO_STORE });
  }
  const next = request.nextUrl.searchParams.get("next") ?? "/";
  const destination = /^\/(?!\/)/.test(next) ? next : "/";
  const response = NextResponse.redirect(new URL(destination, request.nextUrl.origin), { status: 303 });
  if (mode === "on") response.cookies.set(EDITING_COOKIE, "on", { path: "/", sameSite: "lax", maxAge: 60 * 60 * 12 });
  else response.cookies.set(EDITING_COOKIE, "", { path: "/", sameSite: "lax", maxAge: 0 });
  return response;
}
