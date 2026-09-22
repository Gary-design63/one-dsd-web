import type { Metadata } from "next";
import styles from "@/components/workspace-presentation.module.css";
import Link from "next/link";
import { ProgramContextNote } from "@/components/program-context";
import { SupportContextOptions } from "@/components/support-context-options";
import { PageIntro } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: ROUTES.support.label };

export default async function SupportPage() {
  const surface = await prepareEditableSurface("support.page");
  const copy = surface.values;
  const doors = [ROUTES.ask.href, ROUTES.library.href, ROUTES.rightPerson.href, ROUTES.areas.href].map((href, index) => ({
    href,
    title: stringValue(copy, `door${index}Title`),
    description: stringValue(copy, `door${index}Description`),
  }));
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro kicker={stringValue(copy, "introKicker")} title={stringValue(copy, "introTitle")} lede={stringValue(copy, "introLede")} />
      <div className="wrap space-y-8 py-8">
        <ProgramContextNote />
        <p><Link href="/support/directory">DHS offices and guidance</Link></p>
        <ul className={styles.supportDirectory}>
          {doors.map((door) => <li key={door.href}><Link href={door.href} className={styles.directoryLink}><strong>{door.title}</strong><span>{door.description}</span><span className={styles.directoryArrow} aria-hidden="true">→</span></Link></li>)}
        </ul>
        <div className={styles.supportLower}>
        <SupportContextOptions copy={copy} />
        <aside className={styles.supportNotes}>
        <div>
          <p className="kicker">{stringValue(copy, "boundaryKicker")}</p>
          <p className="m-0">{stringValue(copy, "boundaryBody")}</p>
          <p className="mt-2">
            <Link href="/support/right-person">{stringValue(copy, "boundaryLink")}</Link>
          </p>
        </div>
        <div>
          <p className="kicker">{stringValue(copy, "accessKicker")}</p>
          <p className="m-0 text-sm">{stringValue(copy, "accessBody")}</p>
        </div>
        </aside>
        </div>
        <section className={styles.resultInvitation}>
          <h2>Browse published support</h2>
          <p>Staff pages do not collect results or consultation requests. Use the Library, Ask topic cards, or Find the right person.</p>
        </section>
      </div>
    </EditableSurfaceRegion>
  );
}
