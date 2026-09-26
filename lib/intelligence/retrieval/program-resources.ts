import "server-only";
import type { CoursePack } from "@/lib/content/courses/source-types";
import { createHash } from "node:crypto";
import { communityDesignEntries, communityReading } from "@/lib/content/community-design";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { EDITABLE_SURFACE_REGISTRY, getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { loadStaffContentSnapshot, type StaffProgramScope } from "@/lib/content/staff-publications";
import { MEASUREMENT_RESOURCE_ID } from "@/lib/content/measurement-practice";
import type { Doc } from "./search";
import { searchDocs, tokens } from "./search";
import { publishedPodcastReadings } from "./podcast-reading";
import { developmentModel, journeyHref } from "@/lib/program/development";

/** Public page definitions only. No owner workspace, draft, intake, or source archive. */
export function programResourceDefinitions() {
  const readings = communityDesignEntries().flatMap(entry => {
    const definition = getEditableSurfaceDefinition(`community-reading.${entry.id}`);
    return definition ? [definition] : [];
  });
  return [...EDITABLE_SURFACE_REGISTRY, ...readings].filter(definition =>
    definition.route.startsWith("/") && !definition.route.includes("[") &&
    !definition.route.startsWith("/consultant") &&
    !["site.header", "site.context", "ask.page"].includes(definition.surfaceId));
}

function visibleText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(visibleText).join(" ");
  if (value && typeof value === "object") return Object.entries(value)
    .filter(([key]) => !["href", "type", "level"].includes(key)).map(([, child]) => visibleText(child)).join(" ");
  return "";
}

type ProgramIndex = { communityDocs: Doc[]; destinations: Doc[] };
const currentIndexes = new Map<StaffProgramScope, { key: string; index: ProgramIndex }>();

export async function indexedProgramResources(scope: StaffProgramScope): Promise<ProgramIndex> {
  const definitions = programResourceDefinitions();
  const publications = await loadPublishedEditableSurfaces(definitions.map(d => d.surfaceId), scope);
  const podcastReadings = publishedPodcastReadings(publications);
  const measurementAvailable = publications.some(row => row.surfaceId === "practice.measurement")
    && (await loadStaffContentSnapshot({ scope })).items.some(item => item.id === MEASUREMENT_RESOURCE_ID);
  // Always check current scoped publications first. Reuse text processing only while
  // the same immutable revisions remain published; withdrawals change this key.
  const key = publications.map(p => `${p.surfaceId}:${p.source}:${p.sourceScope}:${p.revisionId}`).sort().join("|") + "|measurement-source:" + measurementAvailable + "|podcast-readings:" + [...podcastReadings.values()].map(reading => reading.fingerprint).sort().join("|") + "|development:" + createHash("sha256").update(JSON.stringify(developmentModel)).digest("hex");
  const cached = currentIndexes.get(scope);
  if (cached?.key === key) return cached.index;
  const publishedIds = new Set(publications.map(p => p.surfaceId));
  const grouped = new Map<string, typeof publications>();
  for (const publication of publications) {
    const definition = getEditableSurfaceDefinition(publication.surfaceId)!;
    // About owns this anchor: the child publication cannot keep a withdrawn page link alive.
    if (publication.surfaceId === "equity.practice" && !publishedIds.has("about.page")) continue;
    if (publication.surfaceId === "practice.measurement" && (!measurementAvailable || !publishedIds.has("practice.page"))) continue;
    // Community pages require BOTH the brief and recovered reading where defined.
    if (definition.route.startsWith("/minnesota-communities/")) {
      const id = definition.route.split("/").pop()!;
      if (communityReading(id) && !publishedIds.has(`community-reading.${id}`)) continue;
      if (getEditableSurfaceDefinition(`community-brief.${id}`) && !publishedIds.has(`community-brief.${id}`)) continue;
    }
    grouped.set(definition.route, [...(grouped.get(definition.route) ?? []), publication]);
  }
  const destinations: Doc[] = [...grouped].map(([href, rows]) => {
    const first = rows.find(row => typeof row.values.title === "string") ?? rows[0];
    const definition = getEditableSurfaceDefinition(first.surfaceId)!;
    const community = href.startsWith("/minnesota-communities/");
    const coursePack = first.surfaceId.startsWith("course.") ? (first.values.pack as CoursePack) : undefined;
    const title = String(coursePack?.course.title ?? first.values.title ?? first.values.heading ?? definition.label);
    const summary = coursePack?.course.subtitle || rows.map(row => visibleText(row.values.intro ?? row.values.lede ?? row.values.summary ?? "")).filter(Boolean).join(" ") || title;
    // Lessons are separately searchable; avoid indexing the same full course twice.
    const text = coursePack ? visibleText({ ...coursePack, course: { ...coursePack.course, lessons: coursePack.course.lessons.map(lesson => ({ title: lesson.title, summary: lesson.summary })) } }) : rows.map(row => visibleText(row.values)).join(" ");
    const readingSupport = rows.flatMap(row => { const reading = podcastReadings.get(row.surfaceId); return reading ? [reading] : []; });
    return {
      kind: community ? "brief" : "content", id: community ? `asset-community-${href.split("/").pop()!}` : `asset-program-${createHash("sha256").update(href).digest("hex").slice(0, 24)}`,
      title, href, authority: coursePack ? "learning" : community ? "community_brief" : "practice_note", type: community ? "community_brief" : "program_destination",
      status: "approved", reviewDate: "", scope: scope === "dsd" ? "dsd" : "agencywide",
      evidenceRevisions: [...rows.map(row => ({ sourceId: row.surfaceId, revisionId: row.revisionId, payloadHash: createHash("sha256").update(JSON.stringify(row.document)).digest("hex"), scope: row.sourceScope })), ...readingSupport.map(reading => reading.evidence)],
      summary: [summary, ...readingSupport.map(reading => reading.summary)].join(" "), text: [`${title} ${text}`, ...readingSupport.map(reading => reading.text)].join("\n"), tags: [title, href.replaceAll("/", " "), ...readingSupport.flatMap(reading => reading.tags)], intents: community ? ["intercultural", "access_barriers"] : [],
    };
  });
  const lessonDocs: Doc[] = publications.flatMap(row => {
    if (!row.surfaceId.startsWith("course.")) return [];
    const pack = row.values.pack as CoursePack;
    return pack.course.lessons.map(lesson => ({
      kind:"content" as const,id:`asset-lesson-${createHash("sha256").update(pack.course.id+":"+lesson.id).digest("hex").slice(0,24)}`,
      title:`${pack.course.title}: ${lesson.title}`,href:`/courses/${pack.course.id}/${lesson.id}`,authority:"learning" as const,type:"course_lesson",
      evidenceRevisions:[{ sourceId:row.surfaceId,revisionId:row.revisionId,payloadHash:createHash("sha256").update(JSON.stringify(row.document)).digest("hex"),scope:row.sourceScope }],
      status:"approved",reviewDate:"",scope:scope === "dsd" ? "dsd":"agencywide",summary:lesson.summary,text:visibleText(lesson),tags:[pack.course.title,lesson.title],intents:[],
    }));
  });
  destinations.push(...lessonDocs);
  // These owner-approved public routes are code-defined and contain no participant data.
  destinations.push(...developmentModel.journeys.map(journey => ({
    kind: "content" as const, id: `program-development-${journey.id}`,
    title: journey.title, href: journeyHref(journey.id), authority: "learning" as const,
    type: "program_destination", status: "approved", reviewDate: "",
    scope: scope === "dsd" ? "dsd" : "agencywide", summary: journey.summary,
    text: [journey.title, journey.summary, journey.question, journey.assumption, journey.practice, journey.application, journey.reflection, journey.social].join("\n"),
    tags: ["guided pathway", "equity in practice", ...journey.themes], intents: ["practice_method" as const, "next_actions" as const],
    evidenceRevisions: [{ sourceId: `program-development-${journey.id}`, revisionId: developmentModel.version, payloadHash: createHash("sha256").update(JSON.stringify(journey)).digest("hex"), scope }],
  })));
  const index = { communityDocs: destinations.filter(d => d.kind === "brief"), destinations };
  currentIndexes.set(scope, { key, index });
  return index;
}

/** Exact named resources must not get crowded out by broad topical matches. */
export function programResourceLinks(question: string, docs: Doc[], limit = 5): Array<{ label: string; href: string }> {
  const query = new Set(tokens(question));
  const unique = docs.filter((doc, index) => docs.findIndex(other => other.href === doc.href) === index);
  const ranked = searchDocs(question, unique, { limit: unique.length });
  ranked.sort((a, b) => {
    const named = (title: string, href: string) => { const words = tokens(title); const slug = href.startsWith("/minnesota-communities/") ? tokens(href.split("/").pop()!.replaceAll("-", " ")) : []; return (words.length > 0 && words.every(word => query.has(word))) || (slug.length > 0 && slug.every(word => query.has(word))) ? 1 : 0; };
    return named(b.title, b.href) - named(a.title, a.href) || b.score - a.score;
  });
  return ranked.slice(0, limit).map(hit => ({ label: `Open ${hit.title}`, href: hit.href }));
}
