import styles from "./resource-design.module.css";
import { matchesLibraryFacets } from "@/lib/content/library-facets";
import { normalizeWorkOrigin, withWorkOrigin } from "@/lib/product/work-origin";
import { WorkOriginLinks } from "@/components/work-origin-links";
import { publishedCourses, courseContentItem, courseHref } from "@/lib/content/courses/published";
import { DhsReferenceLink } from "@/components/dhs-reference-link";
import type { Metadata } from "next";
import { hasResourceMediaPreview, ResourceMediaPreview } from "@/components/multimedia/resource-media-preview";
import Link from "next/link";
import { editingModeFromCookies } from "@/lib/auth/request";
import { ResourceRemove } from "@/components/resource-tools";
import { AuthorityPill } from "@/components/ui";
import { PROGRAM } from "@/lib/constants";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { AUTHORITY, CONTENT_TYPE_LABEL, LAYER_LABEL, type AuthorityLabel, type ContentType } from "@/lib/content/types";
import { docsFromStaffContent, scoreDoc } from "@/lib/intelligence/retrieval/search";
import { requestedContentScope } from "@/lib/product/request-context";
import { ProgramContextNote } from "@/components/program-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { DOMAINS, ROLE_FAMILY_LABEL } from "@/lib/domains";
import { applyDomainValues, domainSurfaceId } from "@/lib/domains/surfaces";
import { libraryHref, libraryQueryValue, LIBRARY_FILTER_KEYS, matchesLibraryFilters, normalizeLibraryFilters } from "@/lib/content/work-index";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: "Library" };
export const dynamic = "force-dynamic";

function resourceSummary(text: string, max = 170): string {
  if (text.length <= max) return text;
  const shortened = text.slice(0, max + 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > max * 0.7 ? boundary : max).trimEnd()}…`;
}

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = libraryQueryValue(sp.q);
  const filters = normalizeLibraryFilters(sp);
  const origin = normalizeWorkOrigin(sp);
  const scope = await requestedContentScope();
  const owner = await editingModeFromCookies();
  const [snapshot, surface, domainPublications, courses] = await Promise.all([
    loadStaffContentSnapshot({ scope }),
    prepareEditableSurface("library.page", { scope }),
    loadPublishedEditableSurfaces(DOMAINS.map(domain=>domainSurfaceId(domain.id)), scope),
    publishedCourses(scope),
  ]);
  const copy = surface.values;
  const domains = domainPublications.flatMap(row=>{const source=DOMAINS.find(domain=>domainSurfaceId(domain.id)===row.surfaceId);return source?[applyDomainValues(source,row.values)]:[];});
  const published = [...snapshot.items, ...courses.map(({ pack }) => courseContentItem(pack))];
  const courseLinks = new Map(courses.map(({ pack }) => [`course-${pack.course.id}`, courseHref(pack.course.id)]));
  const items = published.filter(item => matchesLibraryFilters(item, filters) && matchesLibraryFacets(item, filters, domains));
  // Static mode also adds briefs, so apply the selected filters after building its documents.
  const searchDocuments = q ? docsFromStaffContent({ ...snapshot, items }).filter(doc =>
    (!(filters.area || filters.task || filters.role || filters.topic) || doc.kind === "content")
    && (!filters.type || doc.type === filters.type)
    && (!filters.authority || doc.authority === filters.authority),
  ).map(doc => ({ ...doc, href: courseLinks.get(doc.id) ?? doc.href })) : [];
  // Library browsing retains actual keyword matches; ASK keeps its separate answer-confidence floor.
  const hits = q ? searchDocuments.map(doc => ({ ...doc, score: scoreDoc(q, doc), excerpt: resourceSummary(doc.summary || doc.text, 260) }))
    .filter(hit => hit.score > 0).sort((a, b) => b.score - a.score) : [];
  const selectedDomain = domains.find(domain=>domain.id===filters.area);
  const selectedTask = selectedDomain?.tasks.find(task => task.id === filters.task);
  const topics = [...new Set(published.flatMap(item=>item.tags))].sort();
  const types = Array.from(new Set(published.map((c) => c.type))) as ContentType[];
  const authorities = Array.from(new Set(published.map((c) => c.authority))) as AuthorityLabel[];
  const hasActiveFilters = Object.keys(filters).some(key => key !== "originArea");
  const showAll = libraryQueryValue(sp.browse) === "all";
  const firstPageSize = 20;
  const visibleHits = showAll ? hits : hits.slice(0, firstPageSize);
  const visibleItems = showAll ? items : items.slice(0, firstPageSize);
  const remainingHits = showAll ? [] : hits.slice(firstPageSize);
  const remainingItems = showAll ? [] : items.slice(firstPageSize);
  const browseQuery = new URLSearchParams();
  if (q) browseQuery.set("q", q);
  for (const key of LIBRARY_FILTER_KEYS) if (filters[key]) browseQuery.set(key, filters[key]!);
  browseQuery.set("browse", "all");
  const browseAllHref = `/library?${browseQuery.toString()}#${q ? "results-title" : "all-title"}`;
  const renderHit = (h: (typeof hits)[number]) => (
    <li key={h.id} className={styles.resultRow}>
      <p className={styles.rowMeta}>
        {h.kind === "brief" ? stringValue(copy, "briefTypeLabel") : CONTENT_TYPE_LABEL[h.type as ContentType]}{h.layer ? ` · ${LAYER_LABEL[h.layer as keyof typeof LAYER_LABEL]}` : ""} · {h.scope === "dsd" ? PROGRAM.oneDsdProgramName : PROGRAM.fullName}
      </p>
      <div className={styles.rowTitle}><h3><Link href={withWorkOrigin(h.href,origin)}>{h.title}</Link></h3><AuthorityPill authority={h.authority} />{owner && h.kind !== "brief" ? <ResourceRemove contentItemId={h.id} title={h.title} compact /> : null}</div>
      <p className={styles.rowSummary}>{h.excerpt}</p>
      {hasResourceMediaPreview(h.id) ? <details className={styles.mediaDisclosure}><summary>Related example or recording</summary><ResourceMediaPreview resourceId={h.id} /></details> : null}
    </li>
  );
  const renderItem = (c: (typeof items)[number]) => (
    <li key={c.id} className={styles.directoryRow}>
      <p className={styles.rowMeta}>{CONTENT_TYPE_LABEL[c.type]} · {LAYER_LABEL[c.layer]}</p>
      <div className={styles.rowTitle}><h3><Link href={withWorkOrigin(courseLinks.get(c.id) ?? `/library/${c.id}`,origin)}>{c.title}</Link></h3><AuthorityPill authority={c.authority} />{owner ? <ResourceRemove contentItemId={c.id} title={c.title} compact /> : null}</div>
      <p className={styles.rowSummary}>{resourceSummary(c.summary, 140)}</p>
      {hasResourceMediaPreview(c.id) ? <details className={styles.mediaDisclosure}><summary>Related example or recording</summary><ResourceMediaPreview resourceId={c.id} /></details> : null}
    </li>
  );

  return (
    <EditableSurfaceRegion surface={surface} className={`${styles.page} ${styles.directoryPage}`}>
      <header className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>{stringValue(copy, "introKicker")}</p><h1>{stringValue(copy, "introTitle")}</h1><p className={styles.lede}>{stringValue(copy, "introLede").replace(/, and its review date\.?$/, ".")}</p><Link className={styles.back} href="/learn">Explore learning and resources →</Link></div></header>
      <div className={styles.content}>


        <WorkOriginLinks origin={origin} domainAvailable={Boolean(selectedDomain)} />
        {selectedDomain && !origin.task ? <p><Link href={withWorkOrigin("/areas/" + selectedDomain.id + (selectedTask ? "#task-" + selectedTask.id : ""),origin)}>{selectedTask?.label ?? selectedDomain.title}</Link></p> : null}
        <form action="/library" method="get" className={styles.search} role="search">
          {LIBRARY_FILTER_KEYS.filter(key=>!["role","topic"].includes(key)).map(key => filters[key] ? <input key={key} type="hidden" name={key} value={filters[key]} /> : null)}
          <label htmlFor="q" className="block text-lg font-bold">
            {stringValue(copy, "searchLabel")}
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input id="q" name="q" type="text" defaultValue={q} className="min-h-11 flex-1 rounded border border-gray-400 p-2" placeholder={stringValue(copy, "searchPlaceholder")} />
            <button type="submit" className="btn btn--primary">
              {stringValue(copy, "searchButton")}
            </button>
          </div>
          <details className={styles.filterDisclosure} open={hasActiveFilters}>
            <summary>Narrow results</summary>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label>Role<select name="role" defaultValue={filters.role??""} className="block w-full"><option value="">All roles</option>{Object.entries(ROLE_FAMILY_LABEL).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
              <label>Topic<select name="topic" defaultValue={filters.topic??""} className="block w-full"><option value="">All topics</option>{topics.map(topic=><option key={topic} value={topic}>{topic.replaceAll("_"," ")}</option>)}</select></label>
            </div>
            <button className="btn btn--light mt-3" type="submit">Apply choices</button>
            <div className={styles.filters}>
              <span>
              {stringValue(copy, "typeFilterLabel")}:{" "}
              {types.map((t) => (
                <span key={t}>
                  <Link href={libraryHref({ ...filters, type: t }, q)} aria-current={filters.type === t ? "page" : undefined}>{CONTENT_TYPE_LABEL[t]}</Link>{" "}
                </span>
              ))}
              </span>
              <span>
              {stringValue(copy, "authorityFilterLabel")}:{" "}
              {authorities.map((a) => (
                <span key={a}>
                  <Link href={libraryHref({ ...filters, authority: a }, q)} aria-current={filters.authority === a ? "page" : undefined}>{AUTHORITY[a].label}</Link>{" "}
                </span>
              ))}
              </span>
            </div>
          </details>
          {hasActiveFilters ? <div className={styles.activeFilters} aria-label="Selected filters">
            {LIBRARY_FILTER_KEYS.filter(key=>key!=="originArea"&&filters[key]).map(key=>{
              const retained={...filters}; delete retained[key]; if(key==="area")delete retained.task;
              const value=filters[key]!;
              const label=key==="type"?CONTENT_TYPE_LABEL[value as ContentType]:key==="authority"?AUTHORITY[value as AuthorityLabel].label:key==="role"?ROLE_FAMILY_LABEL[value as keyof typeof ROLE_FAMILY_LABEL]:key==="area"?selectedDomain?.title:key==="task"?selectedTask?.label:value;
              return <Link key={key} href={libraryHref(retained,q)} aria-label={"Remove "+key+" filter"}>Remove {label??key} ×</Link>;
            })}
            <Link href={libraryHref({originArea:filters.originArea}, q)}>{stringValue(copy, "clearFiltersLabel")}</Link>
          </div> : null}
        </form>

        {q ? (
          <section className={styles.collection} aria-live="polite" aria-labelledby="results-title">
            <h2 id="results-title" className="text-xl font-extrabold">
              {hits.length ? `${hits.length} ${hits.length === 1 ? stringValue(copy, "resultSingular") : stringValue(copy, "resultPlural")}` : stringValue(copy, "noResultsTitle")}
            </h2>
            {!hits.length ? <p className="text-muted">{stringValue(copy, "noResultsBody")}</p> : null}
            {hits.length > visibleHits.length ? <p className={styles.moreResults}>Showing the first {visibleHits.length} results. <Link href={browseAllHref}>Browse all {hits.length} results</Link></p> : null}
            <ul className={styles.results}>{visibleHits.map(renderHit)}</ul>
            {remainingHits.length ? <details className={styles.remaining}><summary>Show the remaining {remainingHits.length} results here</summary><ul className={styles.results}>{remainingHits.map(renderHit)}</ul></details> : null}
          </section>
        ) : null}

        {!q ? <section className={styles.collection} aria-labelledby="all-title">
          <h2 id="all-title" className="text-2xl font-extrabold">
            {filters.type ? CONTENT_TYPE_LABEL[filters.type as ContentType] : filters.authority ? AUTHORITY[filters.authority as AuthorityLabel]?.label : stringValue(copy, "allResourcesTitle")} ({items.length})
          </h2>
          {items.length > visibleItems.length ? <p className={styles.moreResults}>Showing the first {visibleItems.length} resources. <Link href={browseAllHref}>Browse all {items.length} resources</Link></p> : null}
          <ul className={styles.directory}>{visibleItems.map(renderItem)}</ul>
          {remainingItems.length ? <details className={styles.remaining}><summary>Show the remaining {remainingItems.length} resources here</summary><ul className={styles.directory}>{remainingItems.map(renderItem)}</ul></details> : null}
        </section> : null}
        <div className={styles.context}><DhsReferenceLink /><ProgramContextNote /></div>
      </div>
    </EditableSurfaceRegion>
  );
}
