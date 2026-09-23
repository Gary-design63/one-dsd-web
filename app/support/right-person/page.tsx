import { WorkOriginLinks } from "@/components/work-origin-links";
import { normalizeWorkOrigin, type WorkOriginInput } from "@/lib/product/work-origin";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { supportAreaFromQuery } from "@/lib/product/support-links";
import type { Metadata } from "next";
import { ParticipationNotice } from "@/components/participation-notice";
import { ProgramContextNote } from "@/components/program-context";
import { RightPersonClient } from "@/components/right-person-client";
import { PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { SupportQuestionMap } from "@/components/multimedia/worked-practice-examples";

export const metadata: Metadata = { title: "Find the right person" };

export default async function RightPersonPage({ searchParams }: { searchParams: Promise<WorkOriginInput> }) {
  const query = await searchParams;
  const value = (input: string | string[] | undefined) => Array.isArray(input) ? input[0] : input;
  const area = value(query.area); const matter = value(query.matter);
  const origin = normalizeWorkOrigin({ ...query, originArea: query.originArea ?? query.area, area: query.domain });
  const surface = await prepareEditableSurface("support.right-person");
  const copy = surface.values;
  const domainAvailable = origin.area ? (await loadPublishedEditableSurfaces([`domain.${origin.area}`], surface.scope)).length > 0 : false;
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede={stringValue(copy, "introLede")}
      />
      <div className="wrap space-y-6 py-8">
        <ProgramContextNote />
        <WorkOriginLinks origin={origin} domainAvailable={domainAvailable} />
        <RightPersonClient initialArea={supportAreaFromQuery(area, matter)} copy={copy} />
        <SupportQuestionMap />
        <ParticipationNotice surface="support_routing" />
      </div>
    </EditableSurfaceRegion>
  );
}
