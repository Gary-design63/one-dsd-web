import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { decideProposal, runCycle, undoCycle } from "@/lib/intelligence/agents/cycle";
import { contextFor } from "@/lib/intelligence/orchestrator";
import { getPolicy, setPolicy } from "@/lib/intelligence/policy";
import { runTool } from "@/lib/intelligence/tools/runtime";
import { AUTONOMY_ORDER } from "@/lib/intelligence/types";
import { AGENTS } from "@/lib/intelligence/registry/agents";
import { FLAG_KEYS } from "@/lib/intelligence/registry/flags";

const AgentIds = AGENTS.map((a) => a.agent_id) as [string, ...string[]];

export const PracticeOrchestratorBodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("run") }),
  z.object({ action: z.literal("undo"), cycle_id: z.string().max(60) }),
  z.object({ action: z.literal("kill"), killed: z.boolean(), note: z.string().max(500).optional() }),
  z.object({ action: z.literal("ceiling"), max_autonomy: z.enum(AUTONOMY_ORDER as unknown as [string, ...string[]]) }),
  z.object({ action: z.literal("agent"), agent_id: z.enum(AgentIds), enabled: z.boolean().optional(), ceiling: z.enum(AUTONOMY_ORDER as unknown as [string, ...string[]]).nullable().optional() }),
  z.object({ action: z.literal("flag"), key: z.enum(FLAG_KEYS), value: z.boolean().nullable() }),
  z.object({ action: z.literal("decide"), proposal_id: z.string().max(80), decision: z.enum(["accepted", "rejected"]), note: z.string().max(500).optional() }),
]);

const NO_STORE = { headers: { "cache-control": "no-store" } };

export async function handlePracticeOrchestratorPost(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401 });
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open this page from the program before making changes." }, { status: 403, ...NO_STORE });
  }
  const body = await readBoundedJson(request, 8_192);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = PracticeOrchestratorBodySchema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400, ...NO_STORE });
  const b = parsed.data;
  try {
    if (b.action === "run") {
      const report = await runCycle("owner");
      return NextResponse.json({ ok: true, report }, NO_STORE);
    }
    if (b.action === "undo") {
      const r = await undoCycle(b.cycle_id, "owner");
      return NextResponse.json(r, { status: r.ok ? 200 : 404, ...NO_STORE });
    }
    // Policy changes run as the Eval Steward under owner role so they are audited as tool calls.
    const ctx = contextFor("eval_steward", "owner");
    if (b.action === "kill") {
      // The hard stop must work even when every agent is already stopped, so it bypasses the agent gate.
      const policy = await setPolicy({ killed: b.killed, note: b.note }, "owner");
      return NextResponse.json({ ok: true, policy }, NO_STORE);
    }
    if (b.action === "ceiling") {
      const policy = await runTool(ctx, "flags.set", () => setPolicy({ max_autonomy: b.max_autonomy as (typeof AUTONOMY_ORDER)[number] }, "owner"));
      return NextResponse.json({ ok: true, policy }, NO_STORE);
    }
    if (b.action === "agent") {
      const current = await getPolicy();
      const entry = { ...(current.agents[b.agent_id as keyof typeof current.agents] ?? {}) };
      if (b.enabled !== undefined) entry.enabled = b.enabled;
      if (b.ceiling !== undefined) entry.ceiling = (b.ceiling ?? undefined) as (typeof AUTONOMY_ORDER)[number] | undefined;
      const policy = await runTool(ctx, "registry.agent_toggle", () => setPolicy({ agents: { [b.agent_id]: entry } }, "owner"));
      return NextResponse.json({ ok: true, policy }, NO_STORE);
    }
    if (b.action === "flag") {
      const current = await getPolicy();
      const flags = { ...current.flags };
      if (b.value === null) delete flags[b.key];
      else flags[b.key] = b.value;
      const policy = await runTool(ctx, "flags.set", () => setPolicy({ flags }, "owner"));
      return NextResponse.json({ ok: true, policy }, NO_STORE);
    }
    if (b.action === "decide") {
      const p = await decideProposal(b.proposal_id, b.decision, b.note, ctx);
      if (!p) return NextResponse.json({ error: "Proposal not found." }, { status: 404, ...NO_STORE });
      return NextResponse.json({ ok: true, proposal: p }, NO_STORE);
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not apply." }, { status: 500, ...NO_STORE });
  }
}
