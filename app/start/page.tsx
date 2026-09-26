import { DevelopmentPathways } from "@/components/development-pathways";
import Link from "next/link";
import styles from "@/components/workspace-presentation.module.css";
import type { Metadata } from "next";
import { ParticipationNotice } from "@/components/participation-notice";
import { ProgramContextNote } from "@/components/program-context";
import { StartClient } from "@/components/start-client";
import { PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: "Start" };

export default async function StartPage() {
  const surface = await prepareEditableSurface("start.page");
  const copy = surface.values;
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede={stringValue(copy, "introLede")}
      />
      <div className="wrap space-y-6 py-8">
        <ProgramContextNote />
        <DevelopmentPathways />
        <StartClient copy={copy} />
        <section className={styles.orientationInvitation}><div><h2 className="text-2xl font-semibold">New here, or taking a fresh look?</h2><p className="my-3">See how the whole program fits together and discover a place to begin.</p></div><Link href="/orientation">Explore the program orientation →</Link></section>
        <ParticipationNotice surface="start_routing" />
      </div>
    </EditableSurfaceRegion>
  );
}
