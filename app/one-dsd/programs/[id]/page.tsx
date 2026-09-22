import { DsdProgramMedia } from "@/components/multimedia/dsd-program-media";
import styles from "@/components/dsd-experience.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui";
import { ResourceDownloads } from "@/components/resource-downloads";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { DSD_SCENARIOS, getDsdProgram } from "@/lib/dsd";
import { loadDsdDestinations } from "@/lib/dsd/published";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!getDsdProgram(id)) return { title: "One DSD" };
  const surface = await prepareEditableSurface("dsd-program." + id, { includeOwner: false });
  return { title: surface.available ? stringValue(surface.values, "title") : "One DSD" };
}

export default async function DsdProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = getDsdProgram(id);
  if (!program) notFound();
  const [surface, destinations] = await Promise.all([prepareEditableSurface("dsd-program." + id), loadDsdDestinations()]);
  if (!surface.available && !surface.canEdit) notFound();
  const copy = surface.values;
  const domains = program.domains.map(domain => "/areas/" + domain).filter(href => destinations.has(href));
  const related = DSD_SCENARIOS.filter(scenario => program.domains.includes(scenario.domain) && destinations.has("/one-dsd/scenarios/" + scenario.id));
  return <EditableSurfaceRegion surface={surface} className={styles.page}>
    <PageIntro kicker="One DSD" title={stringValue(copy, "title")} lede={stringValue(copy, "intro")} />
    <div className={`${styles.readingPage} wrap max-w-4xl space-y-8 py-8`}>
      <Link href="/one-dsd#programs">{stringValue(copy, "backLabel")}</Link>
      {surface.available ? <ResourceDownloads kind="program" id={id} noun="program page" scope="dsd" /> : null}
      <section>
        <h2 className="text-2xl font-semibold">{stringValue(copy, "entryPointsTitle")}</h2>
        <ul className="list-disc space-y-2 pl-6">{stringListValue(copy, "equityEntryPoints").map((point, index) => <li key={index}>{point}</li>)}</ul>
      </section>
      <DsdProgramMedia programId={id} />
      {domains.length ? <section className="border-t border-line pt-6">
        <h2 className="text-2xl font-semibold">{stringValue(copy, "areasTitle")}</h2>
        <ul className="list-disc space-y-2 pl-6">{domains.map(href => <li key={href}><Link href={href}>{destinations.get(href)}</Link></li>)}</ul>
      </section> : null}
      {related.length ? <section className="border-t border-line pt-6">
        <h2 className="text-2xl font-semibold">{stringValue(copy, "scenariosTitle")}</h2>
        <ul className="list-disc space-y-2 pl-6">{related.map(scenario => <li key={scenario.id}><Link href={"/one-dsd/scenarios/" + scenario.id}>{destinations.get("/one-dsd/scenarios/" + scenario.id)}</Link></li>)}</ul>
      </section> : null}
    </div>
  </EditableSurfaceRegion>;
}
