import { taskPracticeHref } from "@/lib/product/task-practice";
import { WorkOriginLinks } from "@/components/work-origin-links";
import { normalizeWorkOrigin, withWorkOrigin, type WorkOriginInput } from "@/lib/product/work-origin";
import type { Metadata } from "next";
import styles from "@/components/workspace-presentation.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { ResourceDownloads } from "@/components/resource-downloads";
import { DOMAINS, getDomain, ROLE_FAMILY_LABEL } from "@/lib/domains";
import { applyDomainValues, domainSurfaceId } from "@/lib/domains/surfaces";
import { DSD_PROGRAMS } from "@/lib/dsd";
import { learningStagesForDomain } from "@/lib/domains/learning";
import { libraryHref, matchesLibraryFilters } from "@/lib/content/work-index";
import { learningStageFieldKey, stringValue } from "@/lib/content/staff-surface-registry";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { requestedContentScope } from "@/lib/product/request-context";

type Props = { params: Promise<{ id: string }>; searchParams?: Promise<WorkOriginInput> };
export function generateStaticParams() { return DOMAINS.map(domain => ({ id: domain.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const domain = getDomain((await params).id);
  if (!domain) return { title: "Areas of work" };
  const surface = await prepareEditableSurface(domainSurfaceId(domain.id), { includeOwner: false });
  return { title: surface.available ? stringValue(surface.values, "title") : "Areas of work" };
}
export default async function DomainPage({ params, searchParams }: Props) {
  const source = getDomain((await params).id); if (!source) notFound();
  const origin = normalizeWorkOrigin(await searchParams ?? {}, source.id);
  const scope = await requestedContentScope();
  const [surface, resources, related] = await Promise.all([
    prepareEditableSurface(domainSurfaceId(source.id), { scope }),
    loadStaffContentSnapshot({ scope }),
    loadPublishedEditableSurfaces([
      "learn.page", "library.page", "practice.measurement", "practice.page",
      ...source.tasks.flatMap(task => task.pathId ? [`graduation-path.${task.pathId}`] : []),
      ...(scope === "dsd" ? [...source.dsd.scenarioIds.map(id => `dsd-scenario.${id}`), ...DSD_PROGRAMS.filter(program => program.domains.includes(source.id)).map(program => `dsd-program.${program.id}`)] : []),
    ], scope),
  ]);
  const domain = applyDomainValues(source, surface.values); const copy = surface.values;
  const content = new Map(resources.items.map(item => [item.id,item]));
  const publications = new Map(related.map(item => [item.surfaceId,item]));
  const programs = scope === "dsd" ? DSD_PROGRAMS.filter(program => program.domains.includes(source.id) && publications.has(`dsd-program.${program.id}`)) : [];
  const scenarios = scope === "dsd" ? domain.dsd.scenarioIds.filter(id => publications.has(`dsd-scenario.${id}`)) : [];
  const learning = publications.get("learn.page");
  const stages = learning ? learningStagesForDomain(source.id) : [];
  const libraryAvailable = publications.has("library.page");
  const areaResources = resources.items.filter(item => matchesLibraryFilters(item, { area: source.id }));
  const tools = domain.toolIds.flatMap(id => content.has(id) ? [content.get(id)!] : []);
  return <EditableSurfaceRegion surface={surface}>
    <PageIntro kicker={domain.staffLabel} title={domain.title} lede={domain.summary} />
    <div className={`wrap space-y-8 py-8 ${styles.domainBody}`}>
      <Link href="/areas">{stringValue(copy,"backLabel")}</Link>
      <WorkOriginLinks origin={origin} domainAvailable={surface.available} />
      {surface.available ? <ResourceDownloads kind="area" id={source.id} noun="area of work" scope={scope} /> : null}
      {source.id === "leadership-systems" && <section className="rounded-xl bg-[#faf3e8] p-6"><h2 className="text-2xl font-semibold">DEIA leadership and growth in DSD</h2><p className="my-4 leading-7">Find a starting point as an aspiring or current leader. Build a development map and connect DEIA learning with DSD practice, feedback, and succession.</p><Link href="/one-dsd/leadership">Explore the One DSD leadership experience →</Link></section>}
      <div className={styles.goalTags}>{domain.goals.map(goal => <span key={goal}>{goal}</span>)}</div>
      <section><h2 className="text-2xl font-extrabold">{stringValue(copy,"whyTitle")}</h2><p>{domain.whyItMatters}</p></section>
      <section><h2 className="text-2xl font-extrabold">{stringValue(copy,"questionsTitle")}</h2><ul className="list-disc space-y-2 pl-6">{domain.firstQuestions.map(question => <li key={question}>{question}</li>)}</ul></section>
      <section aria-labelledby="work-tasks-title"><h2 id="work-tasks-title" className="text-3xl font-extrabold">{stringValue(copy,"tasksTitle")}</h2><div className="mt-6 space-y-8">{domain.tasks.map(task => {
        const path = task.pathId ? publications.get(`graduation-path.${task.pathId}`) : undefined;
        const practiceHref = taskPracticeHref(source.id, task, new Set(publications.keys()), new Set(content.keys()));
        const readings = task.contentIds.flatMap(id => content.has(id) ? [content.get(id)!] : []);
        return <article id={`task-${task.id}`} key={task.id} className={styles.domainTask}>
          <span id={task.id} aria-hidden="true" className="scroll-mt-6" />
          <h3 className="text-2xl font-bold">{task.label}</h3><p>{task.outcome}</p>
          <p className="text-sm text-muted">{task.roles.map(role => ROLE_FAMILY_LABEL[role]).join(" · ")}{task.supportsRequired ? ` · ${stringValue(copy,"requiredLabel")}` : ""}</p>
          {readings.length ? <ul className="list-disc pl-6">{readings.map(item => <li key={item.id}><Link href={withWorkOrigin(`/library/${item.id}`, { ...origin, task: task.id })}>{item.title}</Link></li>)}</ul> : null}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-bold">
            {libraryAvailable && readings.length ? <Link href={libraryHref({ ...origin, area: source.id, task: task.id })}>{stringValue(copy,"taskLibraryLabel")}</Link> : null}
            {practiceHref ? <Link href={withWorkOrigin(practiceHref, { ...origin, task: task.id })}>{path ? stringValue(path.values,"title") : stringValue(publications.get("practice.measurement")!.values,"title")}</Link> : null}
            <Link href={withWorkOrigin(`/ask?q=${encodeURIComponent(task.askStarter)}${path ? `&path=${task.pathId}` : ""}`, { ...origin, task: task.id })}>{stringValue(copy,"askLabel")}</Link>
          </div>
        </article>;
      })}</div></section>
      {tools.length ? <section className="border-t border-line pt-5"><h2 className="text-2xl font-extrabold">{stringValue(copy,"toolsTitle")}</h2><ul className="space-y-4">{tools.map(item => <li key={item.id}><Link href={withWorkOrigin(`/library/${item.id}`, origin)} className="font-bold">{item.title}</Link><p>{item.summary}</p>{item.sourceName ? <p className="text-sm text-muted">{item.sourceName}</p> : null}</li>)}</ul></section> : null}
      {stages.length || (libraryAvailable && areaResources.length) ? <section className="border-t border-line pt-5" aria-labelledby="area-learning-title">
        <h2 id="area-learning-title" className="text-2xl font-extrabold">{stringValue(copy,"learningTitle")}</h2>
        {stages.length ? <ul className="list-disc space-y-2 pl-6">{stages.map(stage => <li key={stage.id}><Link href={"/learn#" + stage.id}>{stringValue(learning!.values,learningStageFieldKey(stage.id,"label"))}</Link></li>)}</ul> : null}
        {libraryAvailable && areaResources.length ? <p><Link href={libraryHref({ ...origin, area: source.id })}>{stringValue(copy,"areaLibraryLabel")}</Link></p> : null}
      </section> : null}
      {scope === "dsd" ? <section className="border-t border-line pt-5"><h2 className="text-2xl font-extrabold">{stringValue(copy,"dsdTitle")}</h2><p>{domain.dsd.note}</p><ul className="list-disc pl-6">{domain.dsd.programs.map(program => <li key={program}>{program}</li>)}</ul>
        {programs.length ? <><h3 className="mt-5 text-xl font-bold">{stringValue(copy,"programsTitle")}</h3><ul className="list-disc pl-6">{programs.map(program => <li key={program.id}><Link href={`/one-dsd/programs/${program.id}`}>{stringValue(publications.get(`dsd-program.${program.id}`)!.values,"title")}</Link></li>)}</ul></> : null}
        {scenarios.length ? <><h3 className="mt-5 text-xl font-bold">{stringValue(copy,"scenariosTitle")}</h3><ul className="list-disc pl-6">{scenarios.map(id => <li key={id}><Link href={`/one-dsd/scenarios/${id}`}>{stringValue(publications.get(`dsd-scenario.${id}`)!.values,"title")}</Link></li>)}</ul></> : null}
      </section> : null}
      <div className="border-t border-line pt-5"><Link href={withWorkOrigin("/support/right-person", origin)}>{stringValue(copy,"supportLabel")}</Link></div>
    </div>
  </EditableSurfaceRegion>;
}
