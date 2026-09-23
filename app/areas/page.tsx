import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { WORK_AREA_PHOTOS } from "@/lib/product/work-area-presentation";
import styles from "@/components/workspace-presentation.module.css";
import { PageIntro } from "@/components/ui";
import { EquityPractice } from "@/components/equity-practice";
import { ProgramContextNote } from "@/components/program-context";
import { AreaBookmarkRedirect } from "@/components/area-bookmark-redirect";
import { WORK_AREAS } from "@/lib/product";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { areaFieldKey, stringValue } from "@/lib/content/staff-surface-registry";
export const metadata: Metadata = {title:"Areas of work"};
export default async function AreasPage() {
  const surface=await prepareEditableSurface("areas.page");
  const copy=surface.values;
  return <EditableSurfaceRegion surface={surface}><div className={styles.areasOverview}>
    <PageIntro kicker={stringValue(copy,"introKicker")} title={stringValue(copy,"introTitle")} lede={stringValue(copy,"introLede")} />
    <div className="wrap space-y-8 py-8">
      <ProgramContextNote />
      <AreaBookmarkRedirect areaIds={WORK_AREAS.map(area=>area.id)}/>
      <nav className={styles.areaChooser} aria-labelledby="areas-index-title">
        <p className="kicker">Explore nine areas of work</p>
        <h2 id="areas-index-title">{stringValue(copy,"indexTitle")}</h2>
        <ul>{WORK_AREAS.map(area=><li key={area.id} id={area.id}><Link href={"/areas/work/"+area.id}>
          <Image className={styles.areaThumbnail} src={WORK_AREA_PHOTOS[area.id].src} alt={WORK_AREA_PHOTOS[area.id].alt} width={360} height={203} sizes="(max-width:640px) 85vw, (max-width:950px) 40vw, 340px" />
          <span className={styles.areaChoiceLabel}>{stringValue(copy,areaFieldKey(area.id,"label"))}<span aria-hidden="true">→</span></span>
        </Link></li>)}</ul>
      </nav>
      <details className={styles.areaContext}><summary>Applying equity across areas</summary><EquityPractice scope={surface.scope}/></details>
      <aside className="notice" aria-label="Work across more than one area"><strong>{stringValue(copy,"boundaryLead")} </strong>{stringValue(copy,"boundaryBeforeStart")} <Link href="/start">{stringValue(copy,"startLinkLabel")}</Link> {stringValue(copy,"boundaryAfterStart")}</aside>
    </div>
  </div></EditableSurfaceRegion>;
}
