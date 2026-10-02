import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { consumeRequestLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import { CreateRequestSchema } from "@/lib/consult/types";
import { submitRequest } from "@/lib/consult/service";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Please open this form from the program, then try sending it again." }, { status: 403, headers: NO_STORE });
  }
  try {
    const decision = await consumeRequestLimit(request, { scope: "consultation-intake", limit: 20, windowSeconds: 3_600 });
    if (!decision.allowed) return NextResponse.json({ error: "Too many requests have come from this connection. Please try again in a little while." }, { status: 429, headers: rateLimitHeaders(decision) });
  } catch (error) {
    console.error("consult rate limit unavailable", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "This form is not available right now. Please try again in a little while." }, { status: 503, headers: NO_STORE });
  }
  const body = await readBoundedJson(request, 24_576);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, headers: NO_STORE });
  const parsed = CreateRequestSchema.safeParse(body.value);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: issue?.message ?? "Please check the form and try again.", field: issue?.path?.[0] ?? null }, { status: 400, headers: NO_STORE });
  }
  try {
    const result = await submitRequest(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.message, reason: result.reason }, { status: 422, headers: NO_STORE });
    return NextResponse.json({ id: result.request.id, link: result.link, dueAt: result.request.acknowledgmentDueAt, emailConfigured: result.delivery.requesterNotified }, { status: 201, headers: NO_STORE });
  } catch (error) {
    console.error("consult submit failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Your request could not be saved right now, and nothing was sent. Please try again in a few minutes." }, { status: 503, headers: NO_STORE });
  }
}
