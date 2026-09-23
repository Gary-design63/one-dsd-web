import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { contextFor } from "@/lib/intelligence/orchestrator";
import { getResearchPolicy, listUsage, setResearchPolicy, usageSummary } from "@/lib/intelligence/research/governance";
import { providerStatus } from "@/lib/intelligence/research/providers";
import { runTool } from "@/lib/intelligence/tools/runtime";

const Body = z.object({
  enabled: z.boolean().optional(),
  mode: z.enum(["auto", "on_request", "off"]).optional(),
  deep_research_enabled: z.boolean().optional(),
  provider_order: z.array(z.enum(["perplexity_agent", "openai_web", "fixture"])).min(1).max(3).optional(),
  daily_request_cap: z.number().int().min(0).max(100000).optional(),
  monthly_usd_cap: z.number().min(0).max(100000).optional(),
  allowed_domains: z.array(z.string().trim().toLowerCase().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/)).max(20).optional(),
  recency: z.enum(["any", "year", "month", "week"]).optional(),
});

const NO_STORE = { headers: { "cache-control": "no-store" } };

export async function GET(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401 });
  try {
    const [policy, summary, usage] = await Promise.all([getResearchPolicy(), usageSummary(), listUsage(50)]);
    return NextResponse.json({ policy, summary, usage, providers: providerStatus(), research_stop_env: process.env.PAC_RESEARCH_KILL_SWITCH === "on" }, NO_STORE);
  } catch (error) {
    console.error("consultant research settings read failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Research settings could not be opened right now. Try again in a few minutes." }, { status: 503, ...NO_STORE });
  }
}

export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401 });
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open this page from the program before changing research settings." }, { status: 403, ...NO_STORE });
  }
  const body = await readBoundedJson(request, 8_192);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = Body.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Invalid research policy update." }, { status: 400, ...NO_STORE });
  try {
    // Audited as an owner policy change through the Eval Steward's flags.set tool.
    const ctx = contextFor("eval_steward", "owner");
    const policy = await runTool(ctx, "flags.set", () => setResearchPolicy(parsed.data));
    const summary = await usageSummary();
    return NextResponse.json({ ok: true, policy, summary }, NO_STORE);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not apply." }, { status: 500, ...NO_STORE });
  }
}
