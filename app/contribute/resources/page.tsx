import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Notice } from "@/components/ui";
import { contributorWorkspaceClosedPage } from "@/components/contributor-workspace";
import { loadContributorResourcePage, RESOURCE_WORK_CLOSED_DETAIL, ResourceWorkUnavailable } from "./context";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Resource work" };
export default async function ContributorResourcesPage() {
  const loaded = await loadContributorResourcePage((page, store) => store.queue(page.context, page.scope));
  if (loaded.state === "closed") return contributorWorkspaceClosedPage({ detail: RESOURCE_WORK_CLOSED_DETAIL });
  if (loaded.state !== "ready") return <ResourceWorkUnavailable failed={loaded.state === "failed"}/>;
  const { page, value: resources } = loaded;
    return <><PageIntro kicker="Contribute" title="Resource work" lede="Bring your experience to resources colleagues can use."/>
      <div className="wrap space-y-6 py-8">
        <p>Working in {page.scope === "dsd" ? "Disability Services Division" : "One DHS"} as {page.access.identity?.displayName}.</p>
        {!page.access.ordinaryActive && <Notice>New changes are paused. Resources can still be withdrawn when needed.</Notice>}
        <section className="card p-6" aria-labelledby="contributor-resources-heading"><h2 id="contributor-resources-heading" className="text-2xl font-semibold">Resources and current drafts</h2>
          {resources.length ? <ul className="mt-5 space-y-4">{resources.map(resource => <li key={resource.contentItemId} className="border-t pt-4">
            <Link className="font-bold" href={`/contribute/resources/${encodeURIComponent(resource.contentItemId)}`}>{resource.title}</Link>
            <p>{resource.hasDraft ? resource.readyToPublish ? "A reviewed draft is ready for you to decide whether staff see it." : "A draft is ready for review." : resource.isPublished ? "Available to staff." : "Withdrawn; its history remains available."}</p>
          </li>)}</ul> : <p className="mt-4">No resources are available for contribution in this program view yet.</p>}
        </section><p><Link href="/contribute">Your program workspace</Link></p>
      </div></>;
}
