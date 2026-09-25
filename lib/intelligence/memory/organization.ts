import "server-only";
import reference from "@/data/organization/minnesota-dhs.json";
import { tokens, type Doc } from "../retrieval/search";

export const DHS_REFERENCE = reference;
export type OrganizationalBrief = ReturnType<typeof organizationalBrief>;

export function sourceReviewDue(source: typeof reference.sources[number], now = new Date()): boolean {
  const checked = Date.parse(source.checkedOn + "T00:00:00Z");
  return !Number.isFinite(now.getTime()) || now.getTime() >= checked + source.reviewAfterDays * 86_400_000;
}

/** Public organizational evidence only. Owner conversations and staff records never enter this index. */
export function organizationalDocs(now = new Date()): Doc[] {
  return reference.entries.map(entry => {
    const sources = entry.sourceIds.map(id => reference.sources.find(source => source.id === id)!);
    const due = sources.some(source => sourceReviewDue(source, now));
    const summary = due
      ? `A source refresh is due. This reference does not establish that details are current. ${entry.facts}`
      : entry.facts;
    return {
      kind: "content", id: entry.id, title: entry.title,
      href: sources[0].url, authority: "external_verify", type: "organization_reference",
      status: due ? "refresh_due" : "published",
      reviewDate: reference.checkedOn, scope: "all",
      summary, text: [entry.title, summary, ...entry.aliases].join(" "),
      tags: entry.aliases, intents: [],
    };
  });
}

/** Relevance uses subject aliases, not generic DHS membership alone. */
export function organizationalBrief(question: string, now = new Date(), limit = 4) {
  const q = question.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ");
  const domain = /\b(dhs|dsd|dct|dcyf|mhcp|medicaid|mnchoices|cfss|pca|csg|cbsm|dwrs|e1mn|245d|maarc|minnesota|county|tribal|waiver|civil rights|language access|employment first|child care)\b/i.test(q);
  const ignored = new Set(["dhs", "minnesota", "program", "service"]);
  const terms = new Set(tokens(question).filter(term => !ignored.has(term)));
  const matches = reference.entries.map(entry => {
    const useful = entry.aliases.filter(alias => tokens(alias).some(term => !ignored.has(term)));
    const exact = useful.some(alias => (" " + q + " ").includes(" " + alias.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ") + " "));
    const overlap = new Set(useful.flatMap(tokens).filter(term => terms.has(term))).size;
    return { entry, score: (exact ? 8 : 0) + overlap };
  }).filter(match => domain && match.score >= 2).sort((a, b) => b.score - a.score).slice(0, limit);
  return {
    version: reference.version,
    checkedOn: reference.checkedOn,
    entries: matches.map(({ entry }) => {
      const sources = entry.sourceIds.map(id => reference.sources.find(source => source.id === id)!);
      const refreshDue = sources.some(source => sourceReviewDue(source, now));
      return {
        id: entry.id, title: entry.title, facts: entry.facts,
        application: entry.application, applicationBasis: "program synthesis, not an agency directive",
        units: entry.units, refreshDue,
        sources: sources.map(source => ({ id: source.id, title: source.title, url: source.url, checkedOn: source.checkedOn })),
      };
    }),
  };
}

export function organizationalMaintenance(now = new Date()) {
  return {
    version: reference.version,
    entries: reference.entries.length,
    sources: reference.sources.length,
    refreshDue: reference.sources.filter(source => sourceReviewDue(source, now)).map(source => ({ id: source.id, title: source.title, url: source.url })),
    gaps: reference.gaps,
  };
}
