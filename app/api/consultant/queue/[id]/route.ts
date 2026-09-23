import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { StatusUpdateSchema } from "@/lib/intelligence/agents/intake";
import { queueUpdate } from "@/lib/intelligence/orchestrator";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401 });
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open this request from the program before making changes." }, { status: 403, headers: { "cache-control": "no-store" } });
  }
  const { id } = await params;
  const body = await readBoundedJson(request, 8_192);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, headers: { "cache-control": "no-store" } });
  const parsed = StatusUpdateSchema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400, headers: { "cache-control": "no-store" } });
  try {
    const r = await queueUpdate(id, parsed.data);
    if (!r.ok) return NextResponse.json({ error: r.reason }, { status: r.reason === "not_found" ? 404 : 409, headers: { "cache-control": "no-store" } });
    return NextResponse.json({ ok: true, status: r.request?.status }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("consultant queue update failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "This request could not be updated right now. Try again in a few minutes." }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
