import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { ResourceInlineEditor } from "@/components/resource-inline-editor";
import { contributorWorkspaceClosedPage } from "@/components/contributor-workspace";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { loadContributorResourcePage, RESOURCE_WORK_CLOSED_DETAIL, ResourceWorkUnavailable } from "../../context";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Prepare a resource draft" };
export default async function ContributorResourceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loaded = await loadContributorResourcePage((page, store) => page.access.canDraft ? store.editing(page.context, page.scope, id) : Promise.resolve(undefined));
  if (loaded.state === "closed") return contributorWorkspaceClosedPage({ detail: RESOURCE_WORK_CLOSED_DETAIL });
  if (loaded.state !== "ready") return <ResourceWorkUnavailable failed={loaded.state === "failed"}/>;
  const { value: draft } = loaded;
  if (!draft) return <ResourceWorkUnavailable/>;
    return <><PageIntro kicker="Contribute" title={draft.fields.title} lede="Prepare wording and practical guidance for colleagues."/>
      <div className="wrap py-8"><Link href={`/contribute/resources/${encodeURIComponent(id)}`}>Review this resource</Link>
        <ResourceInlineEditor initial={draft} workspaceLabel="Contribute"
          pathOptions={GRADUATION_PATHS.map(path => ({ id: path.id, label: path.staffLabel }))}
          endpoint={`/api/contribute/resources/${encodeURIComponent(id)}/draft`}
          reviewHref={`/contribute/resources/${encodeURIComponent(id)}`}/>
      </div></>;
}
