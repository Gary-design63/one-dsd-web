import Link from "next/link";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue, stringListValue, linkListValue, EDITABLE_SURFACE_REGISTRY } from "@/lib/content/staff-surface-registry";
import { OPERATIONALIZING_EQUITY, PRACTICE_PILLARS } from "@/lib/product/equity-practice-source";
import type { StaffProgramScope } from "@/lib/content/staff-publications";

export async function EquityPractice({ scope }: { scope: StaffProgramScope }) {
  const surface = await prepareEditableSurface("equity.practice", { scope });
  const copy = surface.values;
  const links = PRACTICE_PILLARS.pillars.flatMap(pillar => linkListValue(copy,`${pillar.id}Links`));
  const destinations = [...new Set(links.map(link => link.href))];
  const resources = await loadStaffContentSnapshot({ scope });
  const available = new Set<string>();
  await Promise.all(destinations.map(async href => {
    if (href.startsWith("https://")) { available.add(href); return; }
    const path = href.split(/[?#]/,1)[0];
    if (path.startsWith("/library/")) { if (resources.items.some(item => path === `/library/${item.id}`)) available.add(href); return; }
    const parents = EDITABLE_SURFACE_REGISTRY.filter(definition => definition.route === path);
    const parent = parents.find(definition => definition.surfaceId.endsWith(".page")) ?? parents[0];
    const anchor = EDITABLE_SURFACE_REGISTRY.find(definition => definition.route === href && href.includes("#"));
    const ids = [...new Set([parent?.surfaceId,anchor?.surfaceId].filter((id): id is string => Boolean(id)))];
    if (!ids.length) return;
    const publications = await Promise.all(ids.map(id => prepareEditableSurface(id,{ scope, includeOwner:false })));
    if (publications.every(publication => publication.available)) available.add(href);
  }));
  return <EditableSurfaceRegion surface={surface}>
    <section id="equity-in-practice" aria-labelledby="equity-practice-title" className="space-y-6 border-t border-line pt-6">
      <div><h2 id="equity-practice-title" className="text-3xl font-extrabold">{stringValue(copy,"title")}</h2><p className="max-w-4xl text-lg">{stringValue(copy,"definition")}</p></div>
      <div className="grid gap-x-10 gap-y-5 md:grid-cols-2">{OPERATIONALIZING_EQUITY.characteristics.map((_,i) => <section key={i}><h3 className="text-lg font-bold">{stringValue(copy,`characteristic${i}Title`)}</h3><p>{stringValue(copy,`characteristic${i}Detail`)}</p></section>)}</div>
      <h2 className="text-3xl font-extrabold">{stringValue(copy,"pillarsTitle")}</h2>
      <p className="max-w-4xl">{stringValue(copy,"throughLine")}</p>
      <div className="space-y-6">{PRACTICE_PILLARS.pillars.map(pillar => <section key={pillar.id} id={`pillar-${pillar.id}`} className="border-t border-line pt-4"><h3 className="text-2xl font-extrabold">{stringValue(copy,`${pillar.id}Title`)}</h3><ul className="list-disc space-y-2 pl-6">{stringListValue(copy,`${pillar.id}Points`).map((point,i) => <li key={i}>{point}</li>)}</ul><nav aria-label={stringValue(copy,`${pillar.id}Title`)} className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-bold">{linkListValue(copy,`${pillar.id}Links`).filter(link => available.has(link.href)).map((link,i) => <Link href={link.href} key={`${link.href}-${i}`}>{link.label}</Link>)}</nav></section>)}</div>
    </section>
  </EditableSurfaceRegion>;
}
