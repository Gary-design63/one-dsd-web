import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, Notice } from "@/components/ui";
import { ResourceReleaseClient } from "@/components/resource-release-client";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { requestedContentScope } from "@/lib/product/request-context";
import { getPublishedStaffContent } from "@/lib/content/staff-publications";
import { CONTENT_TYPE_LABEL } from "@/lib/content/types";
import {
  loadResourceReleaseState,
  resourceReleaseAvailable,
} from "@/lib/content/resource-release";

export const metadata: Metadata = { title: "Review resource changes" };
export const dynamic = "force-dynamic";

export default async function ResourceReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await ownerPageGuard())) return null;
  const { id } = await params;
  if (!resourceReleaseAvailable()) {
    return (
      <>
      <PageIntro kicker="Consultant Workspace" title="Review resource changes" />
        <div className="wrap py-8">
          <Notice tone="warn">Resource review is not connected in this copy of the program.</Notice>
        </div>
      </>
    );
  }
  const scope = await requestedContentScope();
  let release: Awaited<ReturnType<typeof loadResourceReleaseState>>;
  try { release = await loadResourceReleaseState(id, { scope }); } catch { release = undefined; }
  if (!release) {
    // Learning modules and question banks have no release workflow here. Show them
    // read-only with a link to their public page instead of a 404.
    let item: Awaited<ReturnType<typeof getPublishedStaffContent>>;
    try { item = await getPublishedStaffContent(id, { scope }); } catch { item = undefined; }
    if (!item) notFound();
    const kindLabel = CONTENT_TYPE_LABEL[item.type].toLowerCase();
    return (
      <>
        <PageIntro kicker="Consultant Workspace" title={item.title} lede={item.summary} />
        <div className="wrap py-8">
          <Notice tone="warn">
            This item is a {kindLabel}; it is edited in its {item.type === "learning_module" ? "course" : "source collection"}, not here. It has no separate release review in this workspace.
          </Notice>
          <p className="mt-4"><Link href={`/library/${encodeURIComponent(item.id)}`}>Open the public page for this {kindLabel}</Link></p>
          <p><Link href="/consultant/resources">Back to resource review</Link></p>
        </div>
      </>
    );
  }
  const title = release.draft?.payload.title ?? release.published?.payload.title ?? release.history[0]?.title ?? "Resource";

  return (
    <>
      <PageIntro
      kicker="Consultant Workspace"
        title={title}
        lede="Review changes and make a separate, explicit decision about staff availability."
      />
      <ResourceReleaseClient initial={release} />
    </>
  );
}
