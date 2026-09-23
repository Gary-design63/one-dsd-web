import Link from "next/link";
import { notFound } from "next/navigation";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { ORGANIZATIONAL_AREAS } from "@/lib/product/workforce-map";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue, stringListValue, linkListValue } from "@/lib/content/staff-surface-registry";
import type { EditableRichBlock } from "@/lib/content/editable-surface-contract";
import { editableSurfaceEditingAvailable } from "@/lib/content/editable-surfaces";

export const dynamic = "force-dynamic";
export const metadata = { title: "Area work map" };
export default async function Page({ params }: { params: Promise<{ areaId: string }> }) {
  if (!(await ownerPageGuard())) return null;
  const { areaId } = await params;
  if (!ORGANIZATIONAL_AREAS.some(a => a.id === areaId)) notFound();
  const surface = await prepareEditableSurface(`workforce.${areaId}`);
  const savingAvailable = editableSurfaceEditingAvailable();
  const copy = surface.values;
  const blocks = Array.isArray(copy.roles) ? copy.roles as EditableRichBlock[] : [];
  return <div className="wrap max-w-5xl space-y-8 py-10">
    <Link href="/consultant/workforce">Workforce map</Link>
    {!surface.canEdit ? <p>Choose the One DHS view at the top of the page to edit this shared map.</p> : null}
    {!savingAvailable ? <p>Saving is not switched on in this preview. You can still read the current map, but nothing you enter here would be kept.</p> : null}
    <p>Keep official classifications separate from working titles. Add a heading for each working role, followed by its responsibilities, tasks, and what still needs confirmation. Retain changes rather than silently replacing the past.</p>
    <EditableSurfaceRegion surface={{ ...surface, canEdit: surface.canEdit && savingAvailable }}>
      <h1 className="text-3xl font-semibold">{stringValue(copy, "name")}</h1>
      <p>{stringValue(copy, "relationship")}</p><p>{stringValue(copy, "status")}</p>
      <section className="my-8"><h2 className="text-2xl font-semibold">Leadership and decisions</h2><ul className="mt-4 list-disc pl-5">{stringListValue(copy, "leadership").map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="my-8 space-y-4"><h2 className="text-2xl font-semibold">Working roles</h2>{blocks.map((block, i) => {
        if (block.type === "heading") return <h3 className="text-xl font-semibold" key={i}>{block.text}</h3>;
        if (block.type === "paragraph") return <p key={i}>{block.text}</p>;
        if (block.type === "link-list") return <ul key={i}>{block.items.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>;
        return <ul className="list-disc pl-5" key={i}>{block.items.map((item,j) => <li key={j}>{item}</li>)}</ul>;
      })}</section>
      <section className="my-8"><h2 className="text-2xl font-semibold">Changes retained</h2><ul>{stringListValue(copy, "changes").map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="my-8"><h2 className="text-2xl font-semibold">Supporting information</h2><ul>{linkListValue(copy, "sources").map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></section>
      <section><h2 className="text-2xl font-semibold">Related learning</h2><ul>{linkListValue(copy, "resources").map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></section>
    </EditableSurfaceRegion>
  </div>;
}
