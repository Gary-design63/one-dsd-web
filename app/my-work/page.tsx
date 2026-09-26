import { DevelopmentFocus } from "@/components/development-focus";
import Link from "next/link";
import type { Metadata } from "next";
import { requestedContentScope } from "@/lib/product/request-context";
import { StaffWorkBrowse } from "@/components/staff-work-browse";
import { PageIntro } from "@/components/ui";
import { ParticipationNotice } from "@/components/participation-notice";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: "My Work" };

export default async function MyWorkPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const { focus } = await searchParams;
  const scope = await requestedContentScope();
  const surface = await prepareEditableSurface("my-work.page");
  const copy = surface.values;
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede="Choose a learning focus, find a useful next step, and return to the published tools that support your work."
      />
      <div className="wrap space-y-6 py-8">
        <section className="rounded-xl border border-line bg-white p-6" aria-labelledby="goal-work-plan-title">
          <h2 id="goal-work-plan-title" className="text-2xl font-bold">Connect your work to the six equity goals</h2>
          <p className="my-3">Supervisors and managers can choose three planning priorities, identify actions and support, and download a work plan for review. All six goals remain visible. Selecting priorities does not remove policy responsibilities.</p>
          <Link className="btn btn--primary" href="/learn/equity-toolkit#equity-work-plan">Prepare your three-goal work plan</Link>
        </section>
        <DevelopmentFocus initialFocus={focus} />
        <StaffWorkBrowse scope={scope} />
        <ParticipationNotice surface="my_work" />
      </div>
    </EditableSurfaceRegion>
  );
}
