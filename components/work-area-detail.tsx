import { taskPracticeHref } from "@/lib/product/task-practice";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { withWorkOrigin, workAreaStartingPoint } from "@/lib/product/work-origin";
import { notFound } from "next/navigation";
import Image from "next/image";
import { WORK_AREA_PHOTOS } from "@/lib/product/work-area-presentation";
import styles from "@/components/workspace-presentation.module.css";
import Link from "next/link";
import { ProgramContextNote } from "@/components/program-context";
import { libraryHref } from "@/lib/content/work-index";
import { DOMAIN_SURFACES, WORK_AREA_DOMAINS } from "@/lib/domains/surfaces";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { PageIntro } from "@/components/ui";
import { WORK_AREAS } from "@/lib/product";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { areaFieldKey, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";



export async function WorkAreaDetail({ areaId }: { areaId: string }) {
  if (!WORK_AREAS.some(area => area.id === areaId)) notFound();
  const surface = await prepareEditableSurface("areas.page");
  const copy = surface.values;
  const domainPublications = new Map((await loadPublishedEditableSurfaces(["practice.measurement", "practice.page", ...DOMAIN_SURFACES.map(definition => definition.surfaceId), ...WORK_AREAS.flatMap(area => { const path = workAreaStartingPoint(area.id)?.task.pathId; return path ? [`graduation-path.${path}`] : []; })], surface.scope)).map(publication => [publication.surfaceId,publication]));
  const resourceIds = new Set((await loadStaffContentSnapshot({ scope: surface.scope })).items.map(item => item.id));
  const publishedSurfaceIds = new Set(domainPublications.keys());
  const areas = WORK_AREAS.map((area) => ({
    ...area,
    label: stringValue(copy, areaFieldKey(area.id, "label")),
    summary: stringValue(copy, areaFieldKey(area.id, "summary")),
    tasks: stringListValue(copy, areaFieldKey(area.id, "tasks")),
    start: workAreaStartingPoint(area.id),
  }));
  const selectedArea = areas.find(area => area.id === areaId)!;
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker="Areas of work"
        title={selectedArea.label}
        lede={selectedArea.summary}
      />
      <div className="wrap space-y-8 py-8">
        <Link href="/areas" className={styles.backToAreas}>← All nine areas of work</Link>
        <ProgramContextNote />

        <div className={styles.atlas}>
        <nav className={styles.atlasNav} aria-labelledby="areas-index-title">
          <p className="kicker">{stringValue(copy, "indexKicker")}</p>
          <h2 id="areas-index-title" className="text-xl font-extrabold">{stringValue(copy, "indexTitle")}</h2>
          <ul>
            {areas.map((area) => <li key={area.id}><Link href={`/areas/work/${area.id}`} aria-current={area.id === areaId ? "page" : undefined}>{area.label}</Link></li>)}
          </ul>
        </nav>

        <div className={styles.areaList}>
          {areas.filter(area => area.id === areaId).map((area) => (
            <section id={area.id} key={area.id} className={styles.areaSection} aria-labelledby={`${area.id}-title`}>
              <Image className={styles.areaDetailPhoto} src={WORK_AREA_PHOTOS[area.id].src} alt={WORK_AREA_PHOTOS[area.id].alt} width={640} height={360} sizes="(max-width:950px) 85vw, 640px" />
              <p className="kicker">{stringValue(copy, "areaCountLabel")} {areas.findIndex(item => item.id === areaId) + 1} of {areas.length}</p>
              <h2 id={`${area.id}-title`} className="text-2xl font-extrabold">{area.label}</h2>
              <p>{area.summary}</p>
              <h3 className="text-lg font-bold">{stringValue(copy, "tasksHeading")}</h3>
              <ul className="mt-2 list-disc pl-6">
                {area.tasks.map((task) => <li key={task}>{task}</li>)}
              </ul>
              <ul className="mt-4 list-none space-y-2 p-0 font-bold">{WORK_AREA_DOMAINS[area.id].flatMap(id => {
                const publication = domainPublications.get(`domain.${id}`);
                return publication ? [<li key={id}><Link href={withWorkOrigin(`/areas/${id}`, { originArea: area.id, area: id })}>{stringValue(publication.values,"title")}</Link></li>] : [];
              })}</ul>
              <div className={styles.areaActions}>
                <Link href={`/ask?q=${encodeURIComponent(`Help me think through ${area.label.toLowerCase()} for my work.`)}`}>{stringValue(copy, "askLabel")}</Link>
                <Link href={area.start ? libraryHref(area.start.origin) : libraryHref({ originArea: area.id })}>{stringValue(copy, "libraryLabel")}</Link>
                <Link href={withWorkOrigin(taskPracticeHref(area.start?.origin.area ?? "", area.start?.task, publishedSurfaceIds, resourceIds) ?? "/practice", area.start?.origin ?? { originArea: area.id })}>{stringValue(copy, "practiceLabel")}</Link>
                <Link href={`/support/right-person?area=${area.id}`}>{stringValue(copy, "supportLabel")}</Link>
              </div>
            </section>
          ))}
        </div>

        </div>



        <aside className="notice" aria-label="Work across more than one area">
          <strong>{stringValue(copy, "boundaryLead")} </strong>
          {stringValue(copy, "boundaryBeforeStart")} <Link href="/start">{stringValue(copy, "startLinkLabel")}</Link> {stringValue(copy, "boundaryAfterStart")}
        </aside>
      </div>
    </EditableSurfaceRegion>
  );
}
