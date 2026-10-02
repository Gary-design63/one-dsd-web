import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { sendWaitingNotices } from "@/lib/consult/email";
import { getConsultStore } from "@/lib/consult/store";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, headers: NO_STORE });
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Please open this page from the program, then try again." }, { status: 403, headers: NO_STORE });
  const result = await sendWaitingNotices(getConsultStore(), 50);
  return NextResponse.json(result, { headers: NO_STORE });
}
