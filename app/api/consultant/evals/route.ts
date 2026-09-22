import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { runCases } from "@/lib/intelligence/eval/runner";
import { contextFor } from "@/lib/intelligence/orchestrator";
import { runTool } from "@/lib/intelligence/tools/runtime";

export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401 });
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open this page from the program before running checks." }, { status: 403, headers: { "cache-control": "no-store" } });
  }
  try {
    const ctx = contextFor("eval_steward", "owner");
    const report = await runTool(ctx, "eval.run_cases", () => runCases());
    return NextResponse.json(report, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not run." }, { status: 500 });
  }
}
