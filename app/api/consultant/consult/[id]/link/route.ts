import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { resendRequesterLink } from "@/lib/consult/service";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "no-store" };

/** Send the requester their private link again. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, headers: NO_STORE });
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Please open this request from the program, then try again." }, { status: 403, headers: NO_STORE });
  const { id } = await params;
  try {
    const result = await resendRequesterLink(id);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 404, headers: NO_STORE });
    return NextResponse.json({ ok: true, emailed: result.emailed, link: result.emailed ? undefined : result.link }, { headers: NO_STORE });
  } catch (error) {
    console.error("consult link resend failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "The link could not be sent right now. Please try again in a few minutes." }, { status: 503, headers: NO_STORE });
  }
}
