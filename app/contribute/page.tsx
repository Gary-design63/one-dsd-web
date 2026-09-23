import type { Metadata } from "next";
import { ContributorWorkspace } from "@/components/contributor-workspace";
import { PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: "Contributor workspace", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ContributePage({ searchParams = Promise.resolve({}) }: { searchParams?: Promise<{ denied?: string; ownership?: string; identity?: string; signout?: string }> }) {
  const surface = await prepareEditableSurface("contribute.page");
  const copy = surface.values;
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede={stringValue(copy, "introLede")}
      />
      <ContributorWorkspace searchParams={searchParams} copy={copy} />
    </EditableSurfaceRegion>
  );
}
