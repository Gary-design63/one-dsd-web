import "server-only";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { EDITABLE_SURFACE_REGISTRY, getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { canonicalStaffHref } from "@/lib/product/routes";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "./index";
import { DSD_PROGRAM_SURFACES, DSD_SCENARIO_SURFACES } from "./surfaces";

export function dsdLinkKey(href: string): string {
  return canonicalStaffHref(href).split(/[?#]/, 1)[0];
}

export async function loadDsdInventory() {
  const ids = [...DSD_PROGRAM_SURFACES, ...DSD_SCENARIO_SURFACES].map(surface => surface.surfaceId);
  const published = new Map((await loadPublishedEditableSurfaces(ids, "dsd")).map(row => [row.surfaceId, row]));
  return ids.flatMap(id => { const row = published.get(id); return row ? [row] : []; });
}

/** Page navigation reads only needed publications; ASK's full text index stays out of rendering. */
export async function loadDsdDestinations(additionalHrefs: readonly string[] = []): Promise<Map<string, string>> {
  const wanted = new Set([
    ...DSD_PROGRAM_SURFACES.map(surface => surface.route),
    ...DSD_SCENARIO_SURFACES.map(surface => surface.route),
    ...DSD_PROGRAMS.flatMap(program => program.domains.map(domain => "/areas/" + domain)),
    ...DSD_SCENARIOS.flatMap(scenario => scenario.moves.map(move => move.href)),
    ...additionalHrefs,
  ].map(dsdLinkKey));
  const definitions = EDITABLE_SURFACE_REGISTRY.filter(surface => wanted.has(dsdLinkKey(surface.route)));
  // A community destination may have a second full-reading publication; both must remain current.
  for (const href of wanted) {
    if (!href.startsWith("/minnesota-communities/")) continue;
    const reading = getEditableSurfaceDefinition("community-reading." + href.split("/").pop());
    if (reading && !definitions.some(surface => surface.surfaceId === reading.surfaceId)) definitions.push(reading);
  }
  const [rows, resources] = await Promise.all([
    loadPublishedEditableSurfaces(definitions.map(surface => surface.surfaceId), "dsd"),
    loadStaffContentSnapshot({ scope: "dsd" }),
  ]);
  const current = new Map(rows.map(row => [row.surfaceId, row]));
  const destinations = new Map<string, string>();
  for (const definition of definitions) {
    const href = dsdLinkKey(definition.route);
    const row = current.get(definition.surfaceId);
    if (!row) continue;
    if (href.startsWith("/minnesota-communities/") && definitions.some(other => dsdLinkKey(other.route) === href && !current.has(other.surfaceId))) continue;
    const title = row.values.title ?? row.values.heading ?? row.values.introTitle ?? definition.label;
    if (typeof title === "string") destinations.set(href, title);
  }
  for (const item of resources.items) destinations.set("/library/" + item.id, item.title);
  return destinations;
}

export function dsdLinkAvailable(href: string, destinations: ReadonlyMap<string, string>): boolean {
  return href.startsWith("https://") || destinations.has(dsdLinkKey(href));
}
