/**
 * The source register: every source the program cites, correlated to the resources that rely on it,
 * with the verification each source actually has. The register is built by
 * scripts/content/build-source-register.ts; receipts come from the source verification runner.
 * Nothing here fetches or verifies anything at request time.
 */
import register from "@/data/source-register/source-register.json";
import receiptsFile from "@/data/source-register/verification-receipts.json";

export type SourceKind = "external" | "program_route" | "program_document" | "legal_citation" | "placeholder";
export type ResourceType = "authored_course" | "recovered_course" | "community_brief" | "corpus_item" | "domain_corpus_item" | "equity_framework" | "dhs_reference" | "practice_path" | "editable_surface";
export type Citation = { resourceType: ResourceType; resourceId: string; resourceTitle: string; route: string; note: string; role: string };
export type RegisterSource = { sourceId: string; title: string; href: string | null; host: string | null; kind: SourceKind; verification: string; checkedOn?: string; citations: Citation[] };
export type RegisterResource = { resourceType: ResourceType; resourceId: string; title: string; route: string; sourceIds: string[]; externalCount: number; programDocumentCount: number; programRouteCount: number; placeholderCount: number; links: string[] };
export type Receipt = { sourceId: string; href: string; status: number | null; ok: boolean; finalUrl: string | null; redirected: boolean; contentType: string | null; title: string | null; bytes: number | null; checkedAt: string; error: string | null };

export type VerificationState = "reached" | "reached_moved" | "not_reached" | "checked_on_date" | "not_yet_checked" | "program_document" | "legal_citation" | "named_only" | "program_page";
export type Verification = { state: VerificationState; label: string; detail: string; checkedAt?: string; finalUrl?: string | null };

/** Authority groups for outside hosts, used to organize the staff-facing register. */
export type AuthorityGroup = "government" | "standards" | "disability_and_civil_rights" | "research_and_data" | "organizations_and_media" | "program";
export const AUTHORITY_GROUP_LABEL: Record<AuthorityGroup, string> = {
  government: "Government and official sources",
  standards: "Accessibility standards",
  disability_and_civil_rights: "Disability and civil-rights organizations",
  research_and_data: "Research, data and universities",
  organizations_and_media: "Other organizations, books and media",
  program: "Program documents and citations without an address",
};
const GROUP_ORDER: AuthorityGroup[] = ["government", "standards", "disability_and_civil_rights", "research_and_data", "organizations_and_media", "program"];

const STANDARDS_HOSTS = ["www.w3.org", "www.section508.gov", "www.access-board.gov"];
const DISABILITY_HOSTS = ["adata.org", "askjan.org", "www.disability.state.mn.us", "disabilityhubmn.org", "www.braininjurymn.org", "archrespite.org", "mn.db101.org", "www.racialequityalliance.org", "www.raceforward.org", "www.sentencingproject.org", "mnpsp.org", "www.lifecoursetools.com", "www.ucare.org"];
const RESEARCH_HOSTS = ["www.mncompass.org", "nccc.georgetown.edu", "www.hbs.edu", "www.nber.org", "www.chcs.org", "ncwwi.org", "implicit.harvard.edu", "www.umn.edu", "unesdoc.unesco.org", "www.mnhs.org", "www.cdc.gov"];

export function authorityGroupFor(source: Pick<RegisterSource, "host" | "kind">): AuthorityGroup {
  if (source.kind !== "external" || !source.host) return "program";
  const host = source.host.toLowerCase();
  if (STANDARDS_HOSTS.includes(host)) return "standards";
  if (DISABILITY_HOSTS.includes(host)) return "disability_and_civil_rights";
  if (RESEARCH_HOSTS.includes(host)) return "research_and_data";
  if (host.endsWith(".gov") || host.endsWith(".mn.us") || host.endsWith(".state.mn.us") || host.includes(".gov.")) return "government";
  return "organizations_and_media";
}

export function normalizeSourceHref(href: string | undefined | null): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    url.hash = "";
    let path = url.pathname.replace(/\/+$/, "");
    if (path === "") path = "/";
    return `${url.protocol}//${url.hostname.toLowerCase()}${path}${url.search}`;
  } catch { return null; }
}

export const SOURCE_REGISTER = register as unknown as {
  builtAt: string; totals: Record<string, number>; byResourceType: Record<string, { resources: number; withExternal: number; withNone: number }>;
  hosts: Array<{ host: string; sources: number; citations: number }>; sources: RegisterSource[]; resources: RegisterResource[];
};
export const VERIFICATION_RECEIPTS = receiptsFile as unknown as { summary: Record<string, unknown> | null; receipts: Receipt[] };

const SOURCE_BY_ID = new Map(SOURCE_REGISTER.sources.map(source => [source.sourceId, source]));
const RECEIPT_BY_ID = new Map(VERIFICATION_RECEIPTS.receipts.map(receipt => [receipt.sourceId, receipt]));
const RESOURCE_BY_KEY = new Map(SOURCE_REGISTER.resources.map(resource => [`${resource.resourceType}:${resource.resourceId}`, resource]));

function day(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.valueOf()) ? iso : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function verificationFor(source: RegisterSource): Verification {
  if (source.kind === "program_route") return { state: "program_page", label: "Program page", detail: "Points to another page inside this program." };
  if (source.kind === "program_document") return { state: "program_document", label: "Program document", detail: "A program-authored or internal document." };
  if (source.kind === "legal_citation") return { state: "legal_citation", label: "Legal citation", detail: "A statute cited by name. Check the current text with the responsible office." };
  if (source.kind === "placeholder") return { state: "named_only", label: "Named without an address", detail: "The source is named but no address is on record yet." };
  const receipt = RECEIPT_BY_ID.get(source.sourceId);
  if (receipt) {
    if (receipt.ok && receipt.redirected) return { state: "reached_moved", label: `Reached on ${day(receipt.checkedAt)}, now at a new address`, detail: "The address answered and forwarded to a newer page.", checkedAt: receipt.checkedAt, finalUrl: receipt.finalUrl };
    if (receipt.ok) return { state: "reached", label: `Reached on ${day(receipt.checkedAt)}`, detail: "The address answered when the program checked it.", checkedAt: receipt.checkedAt, finalUrl: receipt.finalUrl };
    return { state: "not_reached", label: `Not reached on ${day(receipt.checkedAt)}`, detail: receipt.status ? `The address answered with an error (${receipt.status}). The page may have moved.` : "The address did not answer. It may have moved or be temporarily unavailable.", checkedAt: receipt.checkedAt, finalUrl: receipt.finalUrl };
  }
  if (source.checkedOn) return { state: "checked_on_date", label: `Checked on ${day(source.checkedOn)}`, detail: "The program checked this address on the date shown." };
  return { state: "not_yet_checked", label: "Not yet checked", detail: "Cited when the resource was written and not yet checked by the program." };
}

function shortHash(text: string): string {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  return hash.toString(36).padStart(6, "0").slice(-6);
}
/** A stable page anchor for a source: readable where the address allows, unique through a short suffix. */
export function sourceAnchor(source: Pick<RegisterSource, "sourceId">): string {
  const slug = source.sourceId.replace(/^(url|title|route):/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  return `source-${slug ? slug + "-" : ""}${shortHash(source.sourceId)}`;
}

export function getSource(sourceId: string): RegisterSource | undefined { return SOURCE_BY_ID.get(sourceId); }
export function findSourceByHref(href: string | undefined | null): RegisterSource | undefined {
  const normalized = normalizeSourceHref(href);
  return normalized ? SOURCE_BY_ID.get(`url:${normalized}`) : undefined;
}
export function sourcesForResource(resourceType: ResourceType, resourceId: string): RegisterSource[] {
  const resource = RESOURCE_BY_KEY.get(`${resourceType}:${resourceId}`);
  return resource ? resource.sourceIds.map(id => SOURCE_BY_ID.get(id)).filter((s): s is RegisterSource => Boolean(s)) : [];
}
/** Program-authored annotations already attached to a source: the distinct notes its citing resources wrote. */
export function annotationsFor(source: RegisterSource): string[] {
  const seen = new Set<string>();
  const notes: string[] = [];
  for (const citation of source.citations) {
    const note = citation.note.trim();
    if (!note || seen.has(note)) continue;
    seen.add(note); notes.push(note);
  }
  return notes;
}
/** Sources shown on the staff-facing register: everything except pointers to other program pages. */
export function registerSourcesForStaff(): Array<{ group: AuthorityGroup; sources: RegisterSource[] }> {
  const groups = new Map<AuthorityGroup, RegisterSource[]>();
  for (const source of SOURCE_REGISTER.sources) {
    if (source.kind === "program_route") continue;
    const group = authorityGroupFor(source);
    groups.set(group, [...(groups.get(group) ?? []), source]);
  }
  return GROUP_ORDER.filter(group => groups.has(group)).map(group => ({ group, sources: groups.get(group)!.slice().sort((a, b) => b.citations.length - a.citations.length || a.title.localeCompare(b.title)) }));
}
export function registerSummary() {
  const staff = SOURCE_REGISTER.sources.filter(s => s.kind !== "program_route");
  const states = new Map<VerificationState, number>();
  for (const source of staff) { const state = verificationFor(source).state; states.set(state, (states.get(state) ?? 0) + 1); }
  return {
    builtAt: SOURCE_REGISTER.builtAt,
    checkedAt: (VERIFICATION_RECEIPTS.summary?.checkedAt as string | undefined) ?? null,
    sources: staff.length,
    outside: staff.filter(s => s.kind === "external").length,
    resources: SOURCE_REGISTER.totals.resources,
    citations: staff.reduce((n, s) => n + s.citations.length, 0),
    states: Object.fromEntries(states) as Partial<Record<VerificationState, number>>,
  };
}
