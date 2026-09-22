import { MEASUREMENT_HREF, MEASUREMENT_RESOURCE_ID } from "@/lib/content/measurement-practice";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { WorkOriginLinks } from "@/components/work-origin-links";
import { normalizeWorkOrigin, workOriginForPath, withWorkOrigin, type WorkOriginInput } from "@/lib/product/work-origin";
import { LearningJourneyLink } from "@/components/learning-journey-link";
import styles from "@/components/workspace-presentation.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ProgramContextNote } from "@/components/program-context";
import { ParticipationNotice } from "@/components/participation-notice";
import { PageIntro } from "@/components/ui";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { applyGraduationPathValues, graduationPathSurfaceId, linkListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";

export const metadata: Metadata = { title: "Practice" };

export default async function PracticePage({ searchParams }: { searchParams?: Promise<WorkOriginInput> }) {
  const origin = normalizeWorkOrigin(await searchParams ?? {});
  const scope = await requestedContentScope();
  const [surface, ...pathSurfaces] = await Promise.all([
    prepareEditableSurface("practice.page", { scope }),
    ...GRADUATION_PATHS.map((path) => prepareEditableSurface(graduationPathSurfaceId(path.id), { scope, includeOwner: false })),
  ]);
  const [measurement, measurementSources] = await Promise.all([prepareEditableSurface("practice.measurement", { scope, includeOwner: false }), loadStaffContentSnapshot({ scope })]);
  const measurementAvailable = measurement.available && measurementSources.items.some(item => item.id === MEASUREMENT_RESOURCE_ID);
  const copy = surface.values;
  const moreLinks = linkListValue(copy, "moreLinks");
  const paths = GRADUATION_PATHS.flatMap((path, index) => pathSurfaces[index].available ? [applyGraduationPathValues(path, pathSurfaces[index].values)] : []);
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede={stringValue(copy, "introLede")}
      />
      <div className="wrap space-y-7 py-8">
        <ProgramContextNote />
        <WorkOriginLinks origin={origin} />
        <div className={styles.practiceConnections}>
          <LearningJourneyLink scope={scope} compact />
          <p><Link href="/operationalizing-equity">Explore how guided practice connects to operationalizing equity</Link></p>
        </div>

        <section aria-labelledby="practice-choices-title">
          <p className="kicker">{stringValue(copy, "choicesKicker")}</p>
          <h2 id="practice-choices-title" className="text-2xl font-extrabold">{stringValue(copy, "choicesTitle")}</h2>
          <p className="max-w-3xl text-muted">
            {stringValue(copy, "choicesIntro")}
          </p>
          <ul className={styles.practiceList}>
            {paths.map((path) => (
              <li key={path.id} className={styles.practiceRow}>
                <div><p className="kicker">{path.staffLabel}</p>
                <h3 className="text-xl font-extrabold">
                  <Link href={withWorkOrigin(`/practice/${path.id}`, workOriginForPath(origin, path.id))}>{path.title}</Link>
                </h3>
                <p>{path.startingCompetence}</p></div>
                <p className={styles.practiceArtifact}><strong>{stringValue(copy, "createsLabel")}</strong>{path.artifactTitle}</p>
              </li>
            ))}
          </ul>
        </section>

        {measurementAvailable ? <section className={styles.practiceMore}><h2 className="text-2xl font-bold"><Link href={withWorkOrigin(MEASUREMENT_HREF, normalizeWorkOrigin({ ...origin, area: "measurement", task: "evaluation-plan" }))}>{stringValue(measurement.values, "title")}</Link></h2><p>{stringValue(measurement.values, "intro")}</p></section> : null}

        <aside className={styles.practiceMore} aria-labelledby="practice-more-title">
          <p className="kicker">{stringValue(copy, "moreKicker")}</p>
          <h2 id="practice-more-title" className="text-xl font-extrabold">{stringValue(copy, "moreTitle")}</h2>
          <p>
            {stringValue(copy, "moreBody")}
          </p>
          <div className="flex flex-wrap gap-3">
            {moreLinks.map((link, index) => <Link href={withWorkOrigin(link.href, origin)} className={index === 0 ? "btn btn--primary" : "btn btn--light"} key={link.href}>{link.label}</Link>)}
          </div>
        </aside>
        <ParticipationNotice surface="path_practice" />
      </div>
    </EditableSurfaceRegion>
  );
}
