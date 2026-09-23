import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { ResearchControlsClient } from "@/components/research-controls-client";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { getResearchPolicy, listUsage, usageSummary } from "@/lib/intelligence/research/governance";
import { providerStatus } from "@/lib/intelligence/research/providers";

export const metadata: Metadata = { title: "External research" };
export const dynamic = "force-dynamic";

export default async function ResearchControlsPage() {
  if (!(await ownerPageGuard())) return null;
  const [policy, summary, usage] = await Promise.all([getResearchPolicy(), usageSummary(), listUsage(50)]);
  const providers = providerStatus();
  return (
    <>
      <PageIntro kicker="Current sources for staff questions" title="External research" lede="ASK can search public sources and research questions across subjects. Manage its connections, research options, and usage here. The settings below show what is available now; failed connections and searches are recorded so you can see what needs attention." />
      <div className="wrap py-8">
        <ResearchControlsClient policy={policy} summary={summary} usage={usage} providers={providers} researchStopEnv={process.env.PAC_RESEARCH_KILL_SWITCH === "on"} />
      </div>
    </>
  );
}
