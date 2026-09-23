import type { Metadata } from "next";
import { requestedContentScope } from "@/lib/product/request-context";
import { StaffWorkBrowse } from "@/components/staff-work-browse";
import { PageIntro } from "@/components/ui";
import { ParticipationNotice } from "@/components/participation-notice";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: "My Work" };

export default async function MyWorkPage() {
  const scope = await requestedContentScope();
  const surface = await prepareEditableSurface("my-work.page");
  const copy = surface.values;
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede="Download published checklists and program copies. This page does not accept uploads or save staff writing."
      />
      <div className="wrap space-y-6 py-8">
        <StaffWorkBrowse scope={scope} />
        <ParticipationNotice surface="my_work" />
      </div>
    </EditableSurfaceRegion>
  );
}
