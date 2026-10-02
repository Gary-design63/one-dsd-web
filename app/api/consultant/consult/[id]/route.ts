import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { UpdateRequestSchema } from "@/lib/consult/types";
import { applyConsultantUpdate } from "@/lib/consult/service";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "no-store" };

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, headers: NO_STORE });
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Please open this request from the program, then try again." }, { status: 403, headers: NO_STORE });
  const { id } = await params;
  const body = await readBoundedJson(request, 8_192);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, headers: NO_STORE });
  const parsed = UpdateRequestSchema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "That change could not be understood. Please check it and try again." }, { status: 400, headers: NO_STORE });
  try {
    const result = await applyConsultantUpdate(id, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.message, reason: result.reason }, { status: result.reason === "not_found" ? 404 : 409, headers: NO_STORE });
    return NextResponse.json({ ok: true, status: result.request.status }, { headers: NO_STORE });
  } catch (error) {
    console.error("consult update failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "This request could not be updated right now. Please try again in a few minutes." }, { status: 503, headers: NO_STORE });
  }
}
