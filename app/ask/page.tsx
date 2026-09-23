import type { Metadata } from "next";
import styles from "./ask.module.css";
import { PageIntro } from "@/components/ui";
import { StaffAskBrowse } from "@/components/staff-ask-browse";
import { ROUTES } from "@/lib/constants";
import { matchStaffAskTopic, staffAskTopics } from "@/lib/content/staff-ask-topics";
import { ParticipationNotice } from "@/components/participation-notice";
import { ProgramContextNote } from "@/components/program-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";

export const metadata: Metadata = { title: ROUTES.ask.label };

export default async function AskPage({ searchParams }: { searchParams: Promise<{ path?: string; q?: string; mode?: string; topic?: string; facet?: string }> }) {
  const sp = await searchParams;
  const scope = await requestedContentScope();
  const surface = await prepareEditableSurface("ask.page");
  const copy = surface.values;
  const topics = staffAskTopics();
  const initial = matchStaffAskTopic(sp.topic) ?? matchStaffAskTopic(sp.path) ?? matchStaffAskTopic(sp.q);
  return (
    <EditableSurfaceRegion surface={surface} className={styles.page}>
      <PageIntro kicker={stringValue(copy, "introKicker")} title={stringValue(copy, "introTitle")} lede={stringValue(copy, "introLede")} />
      <div className={`wrap space-y-6 ${styles.body}`}>
        <StaffAskBrowse topics={topics} initialTopicId={initial?.id} facet={sp.facet} scope={scope} />
        <details className={styles.details}>
          <summary>Your privacy and program view</summary>
          <div className={styles.detailsBody}>
            <ProgramContextNote />
            <ParticipationNotice surface="ask" />
          </div>
        </details>
      </div>
    </EditableSurfaceRegion>
  );
}
