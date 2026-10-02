import { NextResponse, type NextRequest } from "next/server";
import { sweepOverdue } from "@/lib/consult/service";

export const dynamic = "force-dynamic";

/** Daily check for requests not acknowledged in time. Requires `Authorization: Bearer <CRON_SECRET>`. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const result = await sweepOverdue();
  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
