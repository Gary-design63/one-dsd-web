export const maxDuration = 300;
import { NextResponse, type NextRequest } from "next/server";
import { runCycle } from "@/lib/intelligence/agents/cycle";

/**
 * Scheduled orchestrator cycle (vercel.json crons). Vercel sends `Authorization: Bearer <CRON_SECRET>`.
 * Without a configured secret the endpoint refuses, so nothing runs unauthenticated.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const report = await runCycle("cron");
  return NextResponse.json({ id: report.id, effective_ceiling: report.effective_ceiling, expired_consultations: report.expired_consultations.length, triaged: report.triaged.length, proposals: report.proposals.length, exceptions: report.exceptions.length, summary: report.summary }, { headers: { "cache-control": "no-store" } });
}
