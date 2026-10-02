import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { consumeRequestLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import { withdrawRequest } from "@/lib/consult/service";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "no-store" };

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Please open this request from its private link, then try again." }, { status: 403, headers: NO_STORE });
  const decision = await consumeRequestLimit(request, { scope: "consultation-tracking", limit: 20, windowSeconds: 600 }).catch(() => null);
  if (decision && !decision.allowed) return NextResponse.json({ error: "Too many attempts. Please try again in a little while." }, { status: 429, headers: rateLimitHeaders(decision) });
  const { token } = await params;
  const result = await withdrawRequest(token);
  return NextResponse.json({ message: result.message }, { status: result.ok ? 200 : 400, headers: NO_STORE });
}
