import type { Metadata } from "next";
import Link from "next/link";
import { EngagementReferenceMap } from "@/components/multimedia/engagement-reference-map";
import { PageIntro } from "@/components/ui";
import { ResourceDownloads } from "@/components/resource-downloads";
import reference from "@/data/organization/minnesota-dhs.json";
import { DHS_REFERENCE_GROUPS, dhsTopicAnchor } from "@/lib/content/dhs-reference";
export const metadata: Metadata = {title:"Understanding DHS",description:"People, programs and partnerships across Minnesota DHS, including Disability Services, county and Tribal relationships, and original sources."};
export default function UnderstandingDhsPage() {
  const checked = new Date(reference.checkedOn+"T12:00:00Z").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"});
  return <><PageIntro kicker="People, Access and Culture" title="Understanding DHS" lede="People, programs and partnerships across Minnesota DHS, with a closer look at Disability Services and the work we share." />
    <div className="wrap max-w-6xl py-10">
      <p className="mt-0 max-w-3xl">Good work connects people across teams and organizations. This reference brings together their responsibilities, services and relationships so it is easier to see how your work fits into the wider picture.</p>
      <ResourceDownloads kind="understanding-dhs" id="reference" noun="reference" />
      <nav aria-label="On this page" className="my-8 flex flex-wrap gap-3">{DHS_REFERENCE_GROUPS.map(group=><a key={group.id} href={"#"+group.id} className="rounded-full border border-line px-4 py-3 font-semibold">{group.title}</a>)}</nav>
      <div className="space-y-14">{DHS_REFERENCE_GROUPS.map(group=><section key={group.id} id={group.id} aria-labelledby={group.id+"-title"} className="scroll-mt-28"><h2 id={group.id+"-title"} className="mb-6 text-3xl font-bold">{group.title}</h2><div className="grid items-start gap-6 md:grid-cols-2">{group.entries.map(entry=><article key={entry.id} id={dhsTopicAnchor(entry.id)} aria-labelledby={dhsTopicAnchor(entry.id)+"-title"} className="scroll-mt-28 rounded-xl border border-line bg-white p-6"><h3 id={dhsTopicAnchor(entry.id)+"-title"} className="m-0 text-xl font-bold">{entry.title}</h3><p className="leading-relaxed">{entry.facts}</p><EngagementReferenceMap topicId={entry.id} application={entry.application} /><p className="text-sm"><strong>Related teams and partners:</strong> {entry.units.join("; ")}</p><ul className="mb-0 space-y-2 pl-5 text-sm">{entry.sourceIds.map(id=>{const source=reference.sources.find(s=>s.id===id)!;return <li key={id}><a href={source.url}>{source.title}</a></li>;})}</ul></article>)}</div></section>)}</div>
      <footer className="mt-12 border-t border-line pt-6"><p className="text-sm text-muted">Sources reviewed <time dateTime={reference.checkedOn}>{checked}</time>. Program summaries accompany the original sources, which carry current policy and contact information.</p><p><Link href="/ask">Browse common questions</Link> <span aria-hidden="true"> · </span> <Link href="/learn">Learning and resources</Link></p></footer>
    </div></>;
}
