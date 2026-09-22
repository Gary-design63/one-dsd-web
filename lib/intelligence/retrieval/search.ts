import { contentEvidence, type EvidenceRevision, type SourceEvidence } from "@/lib/content/ask-evidence";
/** Current-publication keyword retrieval and citation projection. Semantic inference is loaded on the server. */
import { staffCorpus } from "@/lib/content/staff-corpus";
import { BRIEFS } from "@/lib/content/briefs";
import { briefVisibilityKey, briefVisibleToStaff } from "@/lib/content/brief-visibility";
import { AUTHORITY, type AskIntent, type AuthorityLabel, type ContentItem } from "@/lib/content/types";

const STOP = new Set(
  "a an the of to for and or in on at by with from that this those these is are was were be been being it as if then than not no yes you we they i our your their what who whom which how why when where into over after before also can may must should would could about such same just do does did have has had my me us them his her its there here up out so very more most some any all each other another".split(
    " ",
  ),
);

export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^'+|'+$/g, ""))
    .filter((t) => t.length > 2 && !STOP.has(t))
    .map(stem);
}

function stem(w: string): string {
  if (/^accessib(?:le|ility|ilities)$/.test(w)) return "accessible";
  return w
    .replace(/(ies)$/, "y")
    .replace(/(sses)$/, "ss")
    .replace(/(ing|ed|es|s)$/, (m, _p, offset, full) => (full.length - m.length >= 3 ? "" : m));
}

function termFreq(text: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens(text)) m.set(t, (m.get(t) ?? 0) + 1);
  return m;
}

function cosine(a: Map<string, number>, b: Map<string, number>, normB?: number): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  a.forEach((v, k) => {
    na += v * v;
    const w = b.get(k);
    if (w) dot += v * w;
  });
  if (normB !== undefined) nb = normB;
  else b.forEach((v) => { nb += v * v; });
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export type SearchHit = {
  kind: "content" | "brief";
  id: string;
  title: string;
  href: string;
  authority: AuthorityLabel;
  authorityLabel: string;
  type: string;
  layer?: string;
  status: string;
  reviewDate: string;
  scope: string;
  excerpt: string;
  score: number;
};

export type Doc = {
  evidenceRevisions?: EvidenceRevision[];
  kind: "content" | "brief";
  id: string;
  title: string;
  href: string;
  authority: AuthorityLabel;
  type: string;
  layer?: string;
  status: string;
  reviewDate: string;
  scope: string;
  summary: string;
  text: string;
  tags: string[];
  intents: AskIntent[];
};

let DOCS: Doc[] | null = null;
let DOCS_VISIBILITY_KEY: string | null = null;

export function indexedDocs(): Doc[] {
  const visibilityKey = briefVisibilityKey();
  if (DOCS && DOCS_VISIBILITY_KEY === visibilityKey) return DOCS;
  const content: Doc[] = staffCorpus().map((c: ContentItem) => ({
    kind: "content",
    evidenceRevisions: contentEvidence(c) ? [contentEvidence(c)!] : undefined,
    id: c.id,
    title: c.title,
    href: `/library/${c.id}`,
    authority: c.authority,
    type: c.type,
    layer: c.layer,
    status: c.status,
    reviewDate: c.reviewDate,
    scope: c.scope,
    summary: c.summary,
    text: [c.title, c.summary, c.whyItMatters ?? "", ...c.body, c.tags.join(" ")].join(" "),
    tags: c.tags,
    intents: c.intents,
  }));
  const briefs: Doc[] = BRIEFS.filter(briefVisibleToStaff).map((b) => ({
    kind: "brief",
    id: b.id,
    title: b.title,
    href: `/minnesota-communities/${b.id}`,
    authority: b.status === "gated" ? "under_review" : b.status === "approved" ? "community_brief" : "under_review",
    type: "community_brief",
    status: b.status,
    reviewDate: b.reviewDate,
    scope: "agencywide",
    summary: b.level0.whoAndWhere,
    text: [b.title, b.level0.whoAndWhere, b.level0.whyItMattersForDhsWork, ...b.level1.whatToAsk, ...b.level1.accessChecks, b.tags.join(" "), b.languages.join(" ")].join(" "),
    tags: b.tags,
    intents: ["intercultural", "access_barriers"],
  }));
  DOCS = [...content, ...briefs];
  DOCS_VISIBILITY_KEY = visibilityKey;
  return DOCS;
}

export function resetSearchIndexForTests(): void {
  DOCS = null;
  DOCS_VISIBILITY_KEY = null;
}

/**
 * Build a request-local staff index. PostgreSQL mode deliberately adds nothing
 * from static brief or intake collections: every returned document came through
 * the scoped current-publication boundary.
 */
export function docsFromStaffContent(snapshot: { source: "static" | "postgres"; items: ContentItem[] }): Doc[] {
  const content: Doc[] = snapshot.items.map((c) => ({
    kind: "content",
    evidenceRevisions: contentEvidence(c) ? [contentEvidence(c)!] : undefined,
    id: c.id,
    title: c.title,
    href: `/library/${c.id}`,
    authority: c.authority,
    type: c.type,
    layer: c.layer,
    status: c.status,
    reviewDate: c.reviewDate,
    scope: c.scope,
    summary: c.summary,
    text: [c.title, c.summary, c.whyItMatters ?? "", ...c.body, c.tags.join(" ")].join(" "),
    tags: c.tags,
    intents: c.intents,
  }));
  if (snapshot.source === "postgres") return content;

  const briefs: Doc[] = BRIEFS.filter(briefVisibleToStaff).map((b) => ({
    kind: "brief",
    id: b.id,
    title: b.title,
    href: `/minnesota-communities/${b.id}`,
    authority: b.status === "gated" ? "under_review" : b.status === "approved" ? "community_brief" : "under_review",
    type: "community_brief",
    status: b.status,
    reviewDate: b.reviewDate,
    scope: "agencywide",
    summary: b.level0.whoAndWhere,
    text: [b.title, b.level0.whoAndWhere, b.level0.whyItMattersForDhsWork, ...b.level1.whatToAsk, ...b.level1.accessChecks, b.tags.join(" "), b.languages.join(" ")].join(" "),
    tags: b.tags,
    intents: ["intercultural", "access_barriers"],
  }));
  return [...content, ...briefs];
}

const AUTHORITY_BOOST: Partial<Record<AuthorityLabel, number>> = {
  official: 1.2,
  guidance: 1.0,
  practice_note: 0.9,
  learning: 0.6,
  community_brief: 0.8,
  under_review: 0.3,
  external_verify: 0.2,
};

function excerpt(text: string, query: string): string {
  const q = tokens(query)[0];
  const lower = text.toLowerCase();
  const idx = q ? lower.indexOf(q) : -1;
  const start = Math.max(0, idx - 60);
  const normalized = text.slice(start).replace(/\s+/g, " ").trim();
  if (normalized.length <= 360) return `${start > 0 ? "..." : ""}${normalized}`;

  const window = normalized.slice(0, 361);
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
  const wordEnd = window.lastIndexOf(" ");
  const end = sentenceEnd >= 160 ? sentenceEnd + 1 : wordEnd >= 160 ? wordEnd : 360;
  return `${start > 0 ? "..." : ""}${window.slice(0, end).trim()}...`;
}

// Reuse token counts within a request. Documents are rebuilt from current publications,
// so this does not retain stale published text across requests or scope changes.
const frequencies = new WeakMap<Doc, { text: Map<string, number>; title: Map<string, number>; norm: number; length: number; titleWords: string[]; slugWords: string[] }>();

export function scoreDoc(query: string, doc: Doc, intents: AskIntent[] = []): number {
  return scoreDocWithTerms(termFreq(query), doc, intents);
}

function scoreDocWithTerms(q: Map<string, number>, doc: Doc, intents: AskIntent[] = []): number {
  let frequency = frequencies.get(doc);
  if (!frequency) {
    const text = termFreq(doc.text);
    frequency = { text, title: termFreq(doc.title + " " + doc.tags.join(" ")),
      norm: [...text.values()].reduce((sum, value) => sum + value * value, 0),
      length: [...text.values()].reduce((sum, value) => sum + value, 0),
      titleWords: tokens(doc.title), slugWords: doc.kind === "brief" ? tokens(doc.href.split("/").pop()!.replaceAll("-", " ")) : [],
    };
    frequencies.set(doc, frequency);
  }
  const h = frequency.text;
  const t = frequency.title;
  let overlap = 0;
  let titleOverlap = 0;
  q.forEach((_v, k) => {
    if (h.has(k)) overlap += 1;
    if (t.has(k)) titleOverlap += 1;
  });
  // A long source should not win solely by containing incidental question words.
  // Normalize body overlap by vocabulary size; keep focused title/tag matches strong.
  const bodyWeight = 1 / Math.sqrt(1 + frequency.length / 80);
  const base = overlap * bodyWeight + titleOverlap * 3 + cosine(q, h, frequency.norm) * 4;
  const intentBoost = intents.some((i) => doc.intents.includes(i)) ? 1.5 : 0;
  const auth = AUTHORITY_BOOST[doc.authority] ?? 0.5;
  const { titleWords, slugWords } = frequency;
  const named = (titleWords.length > 0 && titleWords.every(word => q.has(word)))
    || (slugWords.length > 0 && slugWords.every(word => q.has(word)));
  return base <= 0 ? 0 : base + intentBoost + auth + (named ? 20 : 0);
}

/** Below this we do not pretend the corpus had an answer. */
export const SILENCE_FLOOR = 2.2;

export function corpusSearch(query: string, opts: { limit?: number; intents?: AskIntent[]; includeBriefs?: boolean; kinds?: Array<"content" | "brief"> } = {}): SearchHit[] {
  const limit = opts.limit ?? 8;
  const q = (query ?? "").trim();
  if (!q) return [];
  const queryTerms = termFreq(q);
  return indexedDocs()
    .filter((d) => (opts.kinds ? opts.kinds.includes(d.kind) : opts.includeBriefs === false ? d.kind === "content" : true))
    .map((d) => ({ d, score: scoreDocWithTerms(queryTerms, d, opts.intents) }))
    .filter((r) => r.score >= SILENCE_FLOOR)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ d, score }) => ({
      kind: d.kind,
      id: d.id,
      title: d.title,
      href: d.href,
      authority: d.authority,
      authorityLabel: AUTHORITY[d.authority].label,
      type: d.type,
      layer: d.layer,
      status: d.status,
      reviewDate: d.reviewDate,
      scope: d.scope,
      excerpt: excerpt(d.summary || d.text, q),
      score: Math.round(score * 10) / 10,
    }));
}

export type SearchOptions = {
  limit?: number;
  intents?: AskIntent[];
  includeBriefs?: boolean;
  kinds?: Array<"content" | "brief">;
};

export function searchDocs(query: string, docs: Doc[], opts: SearchOptions = {}): SearchHit[] {
  const limit = opts.limit ?? 8;
  const q = (query ?? "").trim();
  if (!q) return [];
  const queryTerms = termFreq(q);
  return docs
    .filter((d) => (opts.kinds ? opts.kinds.includes(d.kind) : opts.includeBriefs === false ? d.kind === "content" : true))
    .map((d) => ({ d, score: scoreDocWithTerms(queryTerms, d, opts.intents) }))
    .filter((result) => result.score >= SILENCE_FLOOR)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ d, score }) => ({
      kind: d.kind,
      id: d.id,
      title: d.title,
      href: d.href,
      authority: d.authority,
      authorityLabel: AUTHORITY[d.authority].label,
      type: d.type,
      layer: d.layer,
      status: d.status,
      reviewDate: d.reviewDate,
      scope: d.scope,
      excerpt: excerpt(d.summary || d.text, q),
      score: Math.round(score * 10) / 10,
    }));
}

export function authorityLabelResolve(ids: string[]): Array<{ id: string; authority: AuthorityLabel; label: string; citeable: boolean; reviewDate?: string }> {
  const docs = indexedDocs();
  return ids.map((id) => {
    const d = docs.find((x) => x.id === id);
    const a = d?.authority ?? "under_review";
    return { id, authority: a, label: AUTHORITY[a].label, citeable: AUTHORITY[a].citeable, reviewDate: d?.reviewDate };
  });
}

export type Citation = {
  evidence?: SourceEvidence;
  id: string;
  title: string;
  href: string;
  authority: AuthorityLabel;
  authorityLabel: string;
  reviewDate: string;
  excerpt: string;
  citeable: boolean;
};

/** Citations are projected from the current eligible documents, never search-hit metadata. */
export function citationAttach(hits: SearchHit[]): Citation[] {
  return citationAttachFromDocs(hits, indexedDocs());
}

export function citationAttachFromDocs(hits: SearchHit[], docs: Doc[]): Citation[] {
  const eligible = new Map(docs.map(doc => [`${doc.kind}:${doc.id}`, doc]));
  const seen = new Set<string>();
  return hits.flatMap(hit => {
    const key = `${hit.kind}:${hit.id}`;
    const doc = eligible.get(key);
    if (!doc || seen.has(key)) return [];
    seen.add(key);
    const currentText = (doc.summary || doc.text).replace(/\s+/g, " ").trim();
    const suppliedExcerpt = hit.excerpt.replace(/\s+/g, " ").trim();
    // Retain a useful search excerpt only when it is an exact current-source span.
    const currentExcerpt = suppliedExcerpt && currentText.includes(suppliedExcerpt)
      ? suppliedExcerpt : excerpt(doc.summary || doc.text, "");
    return [{
      id: doc.id,
      title: doc.title,
      href: doc.href,
      authority: doc.authority,
      authorityLabel: AUTHORITY[doc.authority].label,
      reviewDate: doc.reviewDate,
      excerpt: currentExcerpt,
      citeable: AUTHORITY[doc.authority].citeable,
    }];
  });
}

/** Reciprocal-rank fusion keeps lexical matches available alongside semantic candidates. */
export function hybridSearchHits(semantic: SearchHit[], keyword: SearchHit[], limit = 5): SearchHit[] {
  const merged = new Map<string, { hit: SearchHit; rank: number; lexicalRank: number }>();
  for (const [group, hits] of [["semantic", semantic], ["keyword", keyword]] as const) {
    const seen = new Set<string>();
    hits.forEach((hit, index) => {
      const key = `${hit.kind}:${hit.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      const row = merged.get(key) ?? { hit, rank: 0, lexicalRank: Number.POSITIVE_INFINITY };
      row.rank += 1 / (10 + index);
      if (group === "keyword") row.lexicalRank = index;
      merged.set(key, row);
    });
  }
  return [...merged.values()].sort((a,b) => b.rank - a.rank || a.lexicalRank - b.lexicalRank)
    .slice(0,Math.max(0,limit)).map(row=>row.hit);
}
