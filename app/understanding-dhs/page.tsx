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
      <section aria-labelledby="dhs-places-title" className="my-10">
        <h2 id="dhs-places-title" className="text-2xl font-bold">Two places in our DHS story</h2>
        <p className="max-w-3xl">These are real DHS buildings in St. Paul. The Lafayette photograph is an archival view from 1998; the buildings are shown here for orientation and connection to the department, not as a current visitor guide.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <figure className="m-0 overflow-hidden rounded-xl border border-line bg-white">
            <img src="/images/buildings/andersen.webp" alt="Elmer L. Andersen Human Services Building at the corner of Cedar and 11th Streets in St. Paul" className="aspect-[16/10] w-full object-cover" loading="lazy" />
            <figcaption className="p-5"><strong>Elmer L. Andersen Human Services Building</strong><br />540 Cedar Street, St. Paul. <a href="https://mn.gov/admin/citizen/buildings-grounds/buildings/andersen.jsp">Photo and building information: Minnesota Department of Administration</a>.</figcaption>
          </figure>
          <figure className="m-0 overflow-hidden rounded-xl border border-line bg-white">
            <img src="/images/buildings/lafayette-1998.webp" alt="Archival black-and-white photograph of the DHS building at 444 Lafayette Road North in 1998" className="aspect-[16/10] w-full object-cover" loading="lazy" />
            <figcaption className="p-5"><strong>DHS Lafayette Building, archival view (1998)</strong><br />444 Lafayette Road North, St. Paul. <a href="https://www.lrl.mn.gov/docs/pre2003/other/990473.pdf">Photo: DHS, <cite>Memories of our past</cite>, page 33, via the Minnesota Legislative Reference Library</a>.</figcaption>
          </figure>
        </div>
      </section>
      <ResourceDownloads kind="understanding-dhs" id="reference" noun="reference" />
      <nav aria-label="On this page" className="my-8 flex flex-wrap gap-3">{DHS_REFERENCE_GROUPS.map(group=><a key={group.id} href={"#"+group.id} className="rounded-full border border-line px-4 py-3 font-semibold">{group.title}</a>)}</nav>
      <div className="space-y-14">{DHS_REFERENCE_GROUPS.map(group=><section key={group.id} id={group.id} aria-labelledby={group.id+"-title"} className="scroll-mt-28"><h2 id={group.id+"-title"} className="mb-6 text-3xl font-bold">{group.title}</h2><div className="grid items-start gap-6 md:grid-cols-2">{group.entries.map(entry=><article key={entry.id} id={dhsTopicAnchor(entry.id)} aria-labelledby={dhsTopicAnchor(entry.id)+"-title"} className="scroll-mt-28 rounded-xl border border-line bg-white p-6"><h3 id={dhsTopicAnchor(entry.id)+"-title"} className="m-0 text-xl font-bold">{entry.title}</h3><p className="leading-relaxed">{entry.facts}</p><EngagementReferenceMap topicId={entry.id} application={entry.application} /><p className="text-sm"><strong>Related teams and partners:</strong> {entry.units.join("; ")}</p><ul className="mb-0 space-y-2 pl-5 text-sm">{entry.sourceIds.map(id=>{const source=reference.sources.find(s=>s.id===id)!;return <li key={id}><a href={source.url}>{source.title}</a></li>;})}</ul></article>)}</div></section>)}</div>
      <footer className="mt-12 border-t border-line pt-6"><p className="text-sm text-muted">Sources reviewed <time dateTime={reference.checkedOn}>{checked}</time>. Program summaries accompany the original sources, which carry current policy and contact information.</p><p><Link href="/ask">Browse common questions</Link> <span aria-hidden="true"> · </span> <Link href="/learn">Learning and resources</Link></p></footer>
    </div></>;
}
