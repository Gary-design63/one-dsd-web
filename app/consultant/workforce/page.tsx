import Link from "next/link";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { ORGANIZATIONAL_AREAS, CLASSIFICATION_REFERENCES } from "@/lib/product/workforce-map";
import { prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workforce map" };
export default async function Page() {
  if (!(await ownerPageGuard())) return null;
  const surfaces = await Promise.all(ORGANIZATIONAL_AREAS.map(area => prepareEditableSurface(`workforce.${area.id}`, { scope: "one-dhs", includeOwner: false })));
  return <div className="wrap max-w-6xl space-y-8 py-10">
    <h1 className="text-3xl font-semibold">Workforce map</h1>
    <p>Organizational areas, working responsibilities, and connections to learning. This is a research and review space, not a staff roster or a complete position inventory.</p>
    <p>Open an area to maintain its working roles, leadership responsibilities, supporting sources, and resource links. Saved versions retain the editing history. Changes here do not grant access or change an official reporting relationship.</p>
    <ul className="grid gap-5 md:grid-cols-2">{ORGANIZATIONAL_AREAS.map((area, i) => <li key={area.id} className="border-t border-line pt-4"><Link href={`/consultant/workforce/${area.id}`}>{surfaces[i].available ? stringValue(surfaces[i].values, "name") : area.name}</Link><p className="text-sm">{surfaces[i].available ? stringValue(surfaces[i].values, "status") : "No released work map yet."}</p></li>)}</ul>
    <section><h2 className="text-2xl font-semibold">Classification references</h2><p>Verified titles and codes are a starting point. They are not confirmed assignments to a particular area.</p><ul className="mt-4 space-y-2">{CLASSIFICATION_REFERENCES.map(c => <li key={c.code}>{c.title} — {c.code}</li>)}</ul></section>
  </div>;
}
