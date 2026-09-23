import { defineEditableSurface, type EditableSurfaceFieldDefinition } from "@/lib/content/editable-surface-contract";
import { canonicalStaffHref } from "./routes";
import { OPERATIONALIZING_EQUITY, PRACTICE_PILLARS } from "./equity-practice-source";

const field = (key: string, label: string, kind: "short" | "long" | "string-list" | "link-list" = "long"): EditableSurfaceFieldDefinition => ({ key, label, kind, required: true, maxLength: 10000, maxItems: 100 });
export const EQUITY_PRACTICE_SURFACE = defineEditableSurface({
  surfaceId: "equity.practice", route: "/about#equity-in-practice", label: "Operationalizing equity and the three pillars", scopePolicy: "inheritable",
  protectedFields: ["characteristicIds", "pillarIds"],
  fields: [field("title", "Definition heading", "short"), field("definition", "Definition"), field("pillarsTitle", "Pillars heading", "short"), field("throughLine", "Through-line"),
    ...OPERATIONALIZING_EQUITY.characteristics.flatMap((_,i) => [field(`characteristic${i}Title`, `Characteristic ${i+1}: title`, "short"), field(`characteristic${i}Detail`, `Characteristic ${i+1}: detail`)]),
    ...PRACTICE_PILLARS.pillars.flatMap(pillar => [field(`${pillar.id}Title`, `${pillar.title}: title`, "short"),field(`${pillar.id}Points`, `${pillar.title}: points`, "string-list"),field(`${pillar.id}Links`, `${pillar.title}: links`, "link-list")])],
  approvedValues: { title: "Operationalizing equity", definition: OPERATIONALIZING_EQUITY.definition, pillarsTitle: "The three pillars", throughLine: PRACTICE_PILLARS.throughLine,
    ...Object.fromEntries(OPERATIONALIZING_EQUITY.characteristics.flatMap((item,i) => [[`characteristic${i}Title`,item.title],[`characteristic${i}Detail`,item.detail]])),
    ...Object.fromEntries(PRACTICE_PILLARS.pillars.flatMap(pillar => [[`${pillar.id}Title`,pillar.title],[`${pillar.id}Points`, [...pillar.points]],[`${pillar.id}Links`, pillar.hrefs.map(link => ({ ...link, href: link.href === "/paths" ? "/practice" : canonicalStaffHref(link.href) }))]])) },
});
