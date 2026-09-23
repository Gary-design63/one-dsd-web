import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { findRequestByTrackingId } from "@/lib/sp-clone/request-store";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";

/**
 * Backs the SharePoint-style clone's "Request support" workflow. Fully isolated from the
 * live One DHS PAC application: its own database schema (sp_clone) reached only through
 * lib/sp-clone/request-store.ts, no relation to pac.* tables or any DHS/agency system.
 *
 * F-01: GET is owner-session gated and does not send Access-Control-Allow-Origin *.
 * Staff POSTs stay fail-closed.
 */

const NO_STORE = { headers: { "cache-control": "no-store" } };

export async function POST(request: NextRequest) {
  void request;
  return staffWriteClosedResponse();
}

export async function GET(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, ...NO_STORE });
  }
  const trackingId = request.nextUrl.searchParams.get("trackingId")?.trim().toUpperCase();
  if (!trackingId) return NextResponse.json({ error: "trackingId is required." }, { status: 400, ...NO_STORE });
  try {
    const found = await findRequestByTrackingId(trackingId);
    if (!found) return NextResponse.json({ found: false }, NO_STORE);
    return NextResponse.json({ found: true, ...found }, NO_STORE);
  } catch (error) {
    console.error("sp-clone-request lookup failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500, ...NO_STORE });
  }
}
