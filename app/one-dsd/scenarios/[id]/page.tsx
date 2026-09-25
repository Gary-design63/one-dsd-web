import { DsdScenarioMedia } from "@/components/multimedia/dsd-scenario-media";
import styles from "@/components/dsd-experience.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui";
import { ResourceDownloads } from "@/components/resource-downloads";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { linkListValue, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { getScenario, scenariosForDomain } from "@/lib/dsd";
import { dsdLinkAvailable, loadDsdDestinations } from "@/lib/dsd/published";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!getScenario(id)) return { title: "One DSD" };
  const surface = await prepareEditableSurface("dsd-scenario." + id, { includeOwner: false });
  return { title: surface.available ? stringValue(surface.values, "title") : "One DSD" };
}

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) notFound();
  const surface = await prepareEditableSurface("dsd-scenario." + id);
  if (!surface.available && !surface.canEdit) notFound();
  const copy = surface.values;
  const destinations = await loadDsdDestinations(linkListValue(copy, "moves").map(move => move.href));
  const domainHref = "/areas/" + scenario.domain;
  const related = scenariosForDomain(scenario.domain).filter(candidate => candidate.id !== scenario.id && destinations.has("/one-dsd/scenarios/" + candidate.id));
  return <EditableSurfaceRegion surface={surface} className={styles.page}>
    <PageIntro kicker="One DSD" title={stringValue(copy, "title")} />
    <div className="wrap max-w-4xl space-y-8 py-8">
      <nav aria-label="Related pages" className={styles.sectionNav}>
        <Link href="/one-dsd#scenarios">{stringValue(copy, "backLabel")}</Link>
        {destinations.has(domainHref) ? <Link href={domainHref}>{destinations.get(domainHref)}</Link> : null}
      </nav>
      {surface.available ? <details className="border-t border-line pt-4"><summary className="cursor-pointer font-semibold text-[#123f60]">Download this scenario</summary><ResourceDownloads kind="scenario" id={id} noun="scenario" scope="dsd" /></details> : null}
      <article className={`${styles.scenarioStory} space-y-8`} aria-labelledby="situation-title">
        <section>
          <h2 id="situation-title" className="text-2xl font-semibold">{stringValue(copy, "situationTitle")}</h2>
          <p>{stringValue(copy, "situation")}</p>
        </section>
        <DsdScenarioMedia scenarioId={id} />
        <section>
          <h2 className="text-2xl font-semibold">{stringValue(copy, "noticeTitle")}</h2>
          <ul className="list-disc space-y-2 pl-6">{stringListValue(copy, "whatToNotice").map((item, index) => <li key={index}>{item}</li>)}</ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">{stringValue(copy, "questionsTitle")}</h2>
          <ol className="list-decimal space-y-2 pl-6">{stringListValue(copy, "questions").map((item, index) => <li key={index}>{item}</li>)}</ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">{stringValue(copy, "movesTitle")}</h2>
          <ul className="list-disc space-y-2 pl-6">{linkListValue(copy, "moves").map((move, index) => <li key={index}>{dsdLinkAvailable(move.href, destinations) ? <Link href={move.href}>{move.label}</Link> : move.label}</li>)}</ul>
        </section>
        <section className="border-t border-line pt-6">
          <h2 className="text-2xl font-semibold">{stringValue(copy, "handoffTitle")}</h2>
          <p>{stringValue(copy, "handoff")}</p>
        </section>
      </article>
      {related.length ? <section className="border-t border-line pt-6">
        <h2 className="text-2xl font-semibold">{stringValue(copy, "relatedTitle")}</h2>
        <ul className="list-disc space-y-2 pl-6">{related.map(candidate => <li key={candidate.id}><Link href={"/one-dsd/scenarios/" + candidate.id}>{destinations.get("/one-dsd/scenarios/" + candidate.id)}</Link></li>)}</ul>
      </section> : null}
    </div>
  </EditableSurfaceRegion>;
}
