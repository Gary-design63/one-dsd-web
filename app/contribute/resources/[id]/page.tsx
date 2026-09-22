import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Notice } from "@/components/ui";
import { ResourceReleaseClient } from "@/components/resource-release-client";
import { contributorWorkspaceClosedPage } from "@/components/contributor-workspace";
import { loadContributorResourcePage, RESOURCE_WORK_CLOSED_DETAIL, ResourceWorkUnavailable } from "../context";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Review resource work" };
export default async function ContributorResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loaded = await loadContributorResourcePage((page, store) => store.read(page.context, page.scope, id));
  if (loaded.state === "closed") return contributorWorkspaceClosedPage({ detail: RESOURCE_WORK_CLOSED_DETAIL });
  if (loaded.state !== "ready") return <ResourceWorkUnavailable failed={loaded.state === "failed"}/>;
  const { page, value: release } = loaded;
  if (!release) return <ResourceWorkUnavailable failed/>;
  const title = release.draft?.payload.title ?? release.published?.payload.title ?? release.history[0]?.title ?? "Resource";
    return <><PageIntro kicker="Contribute" title={title} lede="Develop the resource together, with each decision connected to its current version."/>
      <div className="wrap pt-6"><Link href="/contribute/resources">All resource work</Link>
        {!page.access.ordinaryActive && <Notice>New changes are paused. Withdrawal remains available with publishing access.</Notice>}</div>
      <ResourceReleaseClient initial={release} endpoint={`/api/contribute/resources/${encodeURIComponent(id)}/release`}
        canReview={page.access.canReview} canPublish={page.access.canPublish} canWithdraw={page.access.canWithdraw}
        editHref={page.access.canDraft ? `/contribute/resources/${encodeURIComponent(id)}/edit` : undefined}/>
    </>;
}
