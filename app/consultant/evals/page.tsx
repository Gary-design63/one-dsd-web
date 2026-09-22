import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { EvalsClient } from "@/components/evals-client";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { CASES, type EvalReport } from "@/lib/intelligence/eval/runner";
import { getStore } from "@/lib/intelligence/memory/store";

export const metadata: Metadata = { title: "Readiness checks" };
export const dynamic = "force-dynamic";

const CHECK_GROUP: Record<string, string> = {
  ask_mvp: "Ask",
  ci_mvp: "Minnesota Communities",
  ciq_mvp: "Consultation requests",
  gp_mvp: "Learning paths",
  mindset_abc: "Content and accessibility review",
};

export default async function EvalsPage() {
  if (!(await ownerPageGuard())) return null;
  const past = (await getStore().list<EvalReport>("eval_result")).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 10);
  const counts = CASES.reduce<Record<string, number>>((acc, c) => ((acc[c.suite] = (acc[c.suite] ?? 0) + 1), acc), {});
  return (
    <>
      <PageIntro kicker="Required before release" title="Readiness checks" lede="Check Ask, Minnesota Communities, consultation requests, learning paths, and content review with sample information. These checks do not change staff content or send anything. A failed check stops the release. When a check needs people to take part, it remains open until that review is complete." />
      <div className="wrap py-8">
        <p className="text-sm text-muted">Checks ready to run: {Object.entries(counts).map(([k, v]) => `${CHECK_GROUP[k] ?? k.replace(/_/g, " ")}: ${v}`).join(" · ")}.</p>
        <EvalsClient past={past} />
      </div>
    </>
  );
}
