/**
 * Source register: every evidence citation the program carries, correlated to the resources that rely on it.
 * Explicit maintenance build, run through scripts/content/source-register.config.mts. Reads only program
 * content in code and data; writes data/source-register/source-register.json and a summary under evidence/.
 * It records citations as they stand. It does not fetch or verify any source.
 */
import { it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { AUTHORED_COURSES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { BRIEFS } from "@/lib/content/briefs";
import { CORPUS } from "@/lib/content/corpus";
import { DOMAIN_CORPUS } from "@/lib/content/corpus-domains";
import { EQUITY_FRAMEWORK } from "@/lib/program/equity-framework";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { clarifyPracticePath } from "@/lib/content/practice-path-clarifications";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import dhsReference from "@/data/organization/minnesota-dhs.json";
import { normalizeSourceHref as normalizeHref } from "@/lib/content/source-register";

type ResourceType = "authored_course" | "recovered_course" | "community_brief" | "corpus_item" | "domain_corpus_item" | "equity_framework" | "dhs_reference" | "practice_path" | "editable_surface";
type SourceKind = "external" | "program_route" | "program_document" | "legal_citation" | "placeholder";
type Citation = { resourceType: ResourceType; resourceId: string; resourceTitle: string; route: string; note: string; role: string };
type SourceEntry = {
  sourceId: string; title: string; href: string | null; host: string | null; kind: SourceKind;
  verification: "cited_unverified" | "program_document" | "program_route" | "legal_citation" | "checked_on_date" | "placeholder"; checkedOn?: string;
  citations: Citation[];
};
type ResourceEntry = { resourceType: ResourceType; resourceId: string; title: string; route: string; sourceIds: string[]; externalCount: number; programDocumentCount: number; programRouteCount: number; placeholderCount: number; links: string[] };

const sources = new Map<string, SourceEntry>();
const resources = new Map<string, ResourceEntry>();

function slug(text: string): string { return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120); }
function resourceKey(type: ResourceType, id: string) { return `${type}:${id}`; }

function resource(entry: Omit<ResourceEntry, "sourceIds" | "externalCount" | "programDocumentCount" | "programRouteCount" | "placeholderCount" | "links"> & { links?: string[] }): ResourceEntry {
  const key = resourceKey(entry.resourceType, entry.resourceId);
  let row = resources.get(key);
  if (!row) { row = { ...entry, sourceIds: [], externalCount: 0, programDocumentCount: 0, programRouteCount: 0, placeholderCount: 0, links: entry.links ?? [] }; resources.set(key, row); }
  return row;
}

function cite(input: { title: string; href?: string | null; note?: string; role: string; checkedOn?: string; programDocument?: boolean }, at: ResourceEntry) {
  const href = normalizeHref(input.href);
  const rawHref = (input.href ?? "").trim();
  const isRoute = /^\/(?!\/)/.test(rawHref);
  const isLegal = /\b(Pub\. L\.|U\.S\.C\.|Stat\.|Minn\. Stat\.|Minnesota Statutes|C\.F\.R\.|Act of \d{4})\b/.test(input.title);
  const placeholder = !href && !isRoute && (rawHref === "" || rawHref === "#") && !input.programDocument && !isLegal;
  const kind: SourceKind = href ? "external" : isRoute ? "program_route" : isLegal ? "legal_citation" : placeholder ? "placeholder" : "program_document";
  const sourceId = href ? `url:${href}` : isRoute ? `route:${rawHref}` : `title:${slug(input.title)}`;
  let entry = sources.get(sourceId);
  if (!entry) {
    entry = {
      // Keep the address as the resource wrote it (the runner checks that exact address); the normalized form is only the key.
      sourceId, title: input.title.trim(), href: href ? rawHref : (isRoute ? rawHref : null), host: href ? new URL(href).hostname : null, kind,
      verification: input.checkedOn ? "checked_on_date" : kind === "external" ? "cited_unverified" : kind,
      ...(input.checkedOn ? { checkedOn: input.checkedOn } : {}), citations: [],
    };
    sources.set(sourceId, entry);
  } else if (input.checkedOn && !entry.checkedOn) { entry.checkedOn = input.checkedOn; entry.verification = "checked_on_date"; }
  const already = entry.citations.some(c => c.resourceType === at.resourceType && c.resourceId === at.resourceId && c.role === input.role);
  if (!already) entry.citations.push({ resourceType: at.resourceType, resourceId: at.resourceId, resourceTitle: at.title, route: at.route, note: (input.note ?? "").trim(), role: input.role });
  if (!at.sourceIds.includes(sourceId)) {
    at.sourceIds.push(sourceId);
    if (entry.kind === "external") at.externalCount += 1; else if (entry.kind === "placeholder") at.placeholderCount += 1; else if (entry.kind === "program_route") at.programRouteCount += 1; else at.programDocumentCount += 1;
  }
}

it("builds the source register from every citation the program carries", () => {
  for (const [type, packs] of [["authored_course", AUTHORED_COURSES], ["recovered_course", RECOVERED_COURSES]] as const) {
    for (const pack of packs) {
      const at = resource({ resourceType: type, resourceId: pack.course.id, title: pack.course.title, route: `/courses/${pack.course.id}` });
      for (const source of pack.sources) cite({ title: source.title, href: source.href, note: source.note, role: "course source" }, at);
    }
  }
  for (const brief of BRIEFS) {
    const at = resource({ resourceType: "community_brief", resourceId: brief.id, title: brief.title, route: `/minnesota-communities/${brief.id}` });
    for (const source of brief.sources) cite({ title: source.label, href: source.href, note: source.note, role: "brief source" }, at);
  }
  for (const [type, items] of [["corpus_item", CORPUS], ["domain_corpus_item", DOMAIN_CORPUS]] as const) {
    for (const item of items) {
      const at = resource({ resourceType: type, resourceId: item.id, title: item.title, route: `/library/${item.id}` });
      if (item.href && normalizeHref(item.href)) cite({ title: item.sourceName ? `${item.sourceName}: ${item.title}` : item.title, href: item.href, note: item.summary, role: "item is a tool card or external resource" }, at);
      if (item.provenance) cite({ title: item.provenance.length > 140 ? item.provenance.slice(0, 137) + "..." : item.provenance, note: item.provenance, role: "provenance", programDocument: true }, at);
      for (const action of item.nextActions ?? []) if (normalizeHref(action.href)) cite({ title: action.label, href: action.href, role: "next action link" }, at);
    }
  }
  const framework = resource({ resourceType: "equity_framework", resourceId: "equity-framework", title: "Equity Framework", route: "/equity-framework" });
  for (const line of EQUITY_FRAMEWORK.bibliography) {
    const url = line.match(/https?:\/\/[^\s]+?(?=\.?\s*$|\.$)/)?.[0] ?? null;
    cite({ title: line.replace(/\s*https?:\/\/[^\s]+\.?$/, "").trim(), href: url, note: line, role: "bibliography", programDocument: /^One DHS People, Access and Culture Program/.test(line) }, framework);
  }
  for (const source of dhsReference.sources as Array<{ id: string; title: string; url: string; checkedOn: string }>) {
    const users = (dhsReference.entries as Array<{ id: string; title: string; sourceIds: string[] }>).filter(entry => entry.sourceIds.includes(source.id));
    for (const entry of users) {
      const at = resource({ resourceType: "dhs_reference", resourceId: entry.id, title: entry.title, route: `/understanding-dhs#${entry.id.replace(/^ext-dhs-org-/, "")}` });
      cite({ title: source.title, href: source.url, role: "reference source", checkedOn: source.checkedOn }, at);
    }
  }
  for (const path of GRADUATION_PATHS.map(clarifyPracticePath)) {
    const links = path.steps.flatMap(step => step.links.map(link => link.href));
    resource({ resourceType: "practice_path", resourceId: path.id, title: path.title, route: `/practice/${path.id}`, links });
  }
  for (const surfaceId of ["learn.hub", "equity-toolkit.home"]) {
    const definition = getEditableSurfaceDefinition(surfaceId);
    if (!definition) continue;
    const at = resource({ resourceType: "editable_surface", resourceId: surfaceId, title: definition.label ?? surfaceId, route: definition.route ?? `/consultant/content/${surfaceId}` });
    for (const [key, value] of Object.entries(definition.approvedValues)) {
      if (!Array.isArray(value)) continue;
      for (const item of value as unknown[]) {
        if (item && typeof item === "object" && "href" in item && "label" in item && normalizeHref(String((item as { href: string }).href))) cite({ title: String((item as { label: string }).label), href: String((item as { href: string }).href), role: `link list (${key})` }, at);
      }
    }
  }

  const sourceRows = [...sources.values()].sort((a, b) => b.citations.length - a.citations.length || a.title.localeCompare(b.title));
  const resourceRows = [...resources.values()].sort((a, b) => a.resourceType.localeCompare(b.resourceType) || a.title.localeCompare(b.title));
  const hosts = new Map<string, { host: string; sources: number; citations: number }>();
  for (const row of sourceRows) if (row.host) { const h = hosts.get(row.host) ?? { host: row.host, sources: 0, citations: 0 }; h.sources += 1; h.citations += row.citations.length; hosts.set(row.host, h); }
  const byType = new Map<string, { resources: number; withExternal: number; withNone: number }>();
  for (const row of resourceRows) { const t = byType.get(row.resourceType) ?? { resources: 0, withExternal: 0, withNone: 0 }; t.resources += 1; if (row.externalCount > 0) t.withExternal += 1; if (row.sourceIds.length === 0) t.withNone += 1; byType.set(row.resourceType, t); }
  const register = {
    builtAt: new Date().toISOString(),
    scope: "Citations as they stand in program code and data on the build date. Nothing here was fetched or verified during the build.",
    verificationStates: { cited_unverified: "An outside address cited at authoring and not yet checked by the program.", checked_on_date: "An outside address the program checked on the recorded date (Understanding DHS reference).", program_document: "A program-authored or internal document, or a provenance note.", program_route: "A citation that points to another page inside the program.", legal_citation: "A statute or regulation cited by name without an address.", placeholder: "A citation with no address, kept as the source text left it." },
    totals: { sources: sourceRows.length, external: sourceRows.filter(s => s.kind === "external").length, programDocuments: sourceRows.filter(s => s.kind === "program_document").length, programRoutes: sourceRows.filter(s => s.kind === "program_route").length, legalCitations: sourceRows.filter(s => s.kind === "legal_citation").length, placeholders: sourceRows.filter(s => s.kind === "placeholder").length, citations: sourceRows.reduce((n, s) => n + s.citations.length, 0), resources: resourceRows.length, resourcesWithoutSources: resourceRows.filter(r => r.sourceIds.length === 0).length, hosts: hosts.size },
    byResourceType: Object.fromEntries(byType),
    hosts: [...hosts.values()].sort((a, b) => b.citations - a.citations),
    sources: sourceRows,
    resources: resourceRows,
  };
  mkdirSync("data/source-register", { recursive: true });
  writeFileSync("data/source-register/source-register.json", JSON.stringify(register, null, 1) + "\n");
  expect(sourceRows.length).toBeGreaterThan(200);
  expect(resourceRows.length).toBeGreaterThan(100);
});
