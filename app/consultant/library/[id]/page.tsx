import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Notice } from "@/components/ui";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { requestedContentScope } from "@/lib/product/request-context";
import { loadEditableResourceState } from "@/lib/content/resource-drafts";
import { getPublishedStaffContent } from "@/lib/content/staff-publications";
import { CONTENT_TYPE_LABEL } from "@/lib/content/types";
import { ResourceInlineEditor } from "@/components/resource-inline-editor";
import { GRADUATION_PATHS } from "@/lib/content/paths";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Prepare a resource" };
export default async function PrepareResourcePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await ownerPageGuard())) return null;
  const { id } = await params;
  const scope = await requestedContentScope();
  let editable: Awaited<ReturnType<typeof loadEditableResourceState>> | undefined;
  try { editable = await loadEditableResourceState(id, { scope }); } catch { editable = undefined; }
  if (!editable) {
    // Learning modules and question banks are library items that are not draft-editable
    // here. Show them read-only with a link to their public page instead of a 404.
    let item: Awaited<ReturnType<typeof getPublishedStaffContent>>;
    try { item = await getPublishedStaffContent(id, { scope }); } catch { item = undefined; }
    if (!item) notFound();
    const kindLabel = CONTENT_TYPE_LABEL[item.type].toLowerCase();
    const publicHref = `/library/${encodeURIComponent(item.id)}`;
    return <div className="wrap py-8">
      <Link href="/consultant/library">Back to the collection</Link>
      <h1 className="mt-4 text-3xl font-bold">{item.title}</h1>
      <Notice tone="warn">
        This item is a {kindLabel}; it is edited in its {item.type === "learning_module" ? "course" : "source collection"}, not here. It is shown read-only in this workspace.
      </Notice>
      <p>{item.summary}</p>
      <p><Link href={publicHref}>Open the public page for this {kindLabel}</Link></p>
    </div>;
  }
  return <div className="wrap py-8">
    <Link href="/consultant/library">Back to the collection</Link>
    <h1 className="mt-4 text-3xl font-bold">{editable.fields.title}</h1>
    <p>Prepare this resource here. Staff will see it after its reviewed version is published.</p>
    <ResourceInlineEditor initial={editable} pathOptions={GRADUATION_PATHS.map(path => ({ id: path.id, label: path.staffLabel }))} />
  </div>;
}
