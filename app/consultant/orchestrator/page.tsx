import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { OrchestratorClient } from "@/components/orchestrator-client";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { listCycles, listProposals } from "@/lib/intelligence/agents/cycle";
import { getPolicy } from "@/lib/intelligence/policy";
import { AGENTS } from "@/lib/intelligence/registry/agents";
import { flagList } from "@/lib/intelligence/registry/flags";
import { generativeStatus } from "@/lib/intelligence/providers";

export const metadata: Metadata = { title: "Program reviews" };
export const dynamic = "force-dynamic";

export default async function OrchestratorPage() {
  if (!(await ownerPageGuard())) return null;
  const [policy, cycles, proposals] = await Promise.all([getPolicy(), listCycles(10), listProposals()]);
  const agents = AGENTS.map((a) => ({ agent_id: a.agent_id, staff_label: a.staff_label, ceiling: a.autonomy_ceiling, enabled: a.enabled, purpose: a.purpose }));
  const flags = flagList().map((f) => ({ key: f.key, description: f.description, value: f.value, source: f.source }));
  const gen = generativeStatus();
  const scheduleReady = Boolean(process.env.CRON_SECRET?.trim());
  return (
    <>
      <PageIntro kicker="You set the boundaries" title="Program reviews" lede="A program review can organize consultation requests, update heads-up packets, point out content that may be out of date, check accessibility, and prepare changes for your decision. You can reverse changes from a review. Use Stop program reviews for an immediate pause, or choose a lower work level to narrow what may happen." />
      <div className="wrap py-8">
        <OrchestratorClient policy={policy} cycles={cycles} proposals={proposals} agents={agents} flags={flags} generative={gen} scheduleReady={scheduleReady} />
      </div>
    </>
  );
}
