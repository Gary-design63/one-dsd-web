import styles from "./learning-family.module.css";
import { LearningJourneyLink } from "@/components/learning-journey-link";
import { learningStageHref } from "@/lib/content/learning-journey";
import { DhsReferenceLink } from "@/components/dhs-reference-link";
import { publishedCourses, courseContentItem, courseSummary, courseHref } from "@/lib/content/courses/published";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthorityPill } from "@/components/ui";
import { PublishedPodcast } from "@/components/published-podcast";
import { PODCASTS, podcastMatches } from "@/lib/content/podcasts";
import { LearningTile } from "@/components/learning-tile";
import { ResourceRemove } from "@/components/resource-tools";
import { editingModeFromCookies } from "@/lib/auth/request";
import { getLearningTilePresentation } from "@/lib/content/learning-catalog";
import { HUB_THEMES, selectHubItems } from "@/lib/content/learning-hub";
import { CONTENT_TYPE_LABEL, type ContentType } from "@/lib/content/types";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { ProgramContextNote } from "@/components/program-context";
import { ParticipationNotice } from "@/components/participation-notice";
import { LEARNING_STAGES } from "@/lib/product";
import { requestedContentScope } from "@/lib/product/request-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { applyGraduationPathValues, graduationPathSurfaceId, learningStageFieldKey, linkListValue, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: "Learning and resources" };
export const dynamic = "force-dynamic";

function shortSummary(text: string, max = 160): string {
  if (text.length <= max) return text;
  const shortened = text.slice(0, max + 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > max * 0.7 ? boundary : max).trimEnd()}…`;
}

export default async function LearnPage({ searchParams }: { searchParams?: Promise<{ q?: string | string[]; theme?: string | string[]; type?: string | string[] }> }) {
  const rawQuery = await searchParams ?? {};
  const query = { q: typeof rawQuery.q === "string" ? rawQuery.q : "", theme: typeof rawQuery.theme === "string" ? rawQuery.theme : "", type: typeof rawQuery.type === "string" ? rawQuery.type : "" };
  const scope = await requestedContentScope();
  const owner = await editingModeFromCookies();
  const [{ items: baseItems }, surface, catalog, hub, toolkit, podcastSurfaces, ...pathSurfaces] = await Promise.all([
    loadStaffContentSnapshot({ scope }),
    prepareEditableSurface("learn.page", { scope }),
    prepareEditableSurface("learn.catalog", { scope }),
    prepareEditableSurface("learn.hub", { scope }),
    prepareEditableSurface("equity-toolkit.home", { scope, includeOwner: false }),
    Promise.all(PODCASTS.map(podcast => prepareEditableSurface(podcast.surfaceId, { scope }))),
    ...GRADUATION_PATHS.map((path) => prepareEditableSurface(graduationPathSurfaceId(path.id), { scope, includeOwner: false })),
  ]);
  const courses = await publishedCourses(scope);
  const courseById = new Map(courses.map(({pack})=>[`course-${pack.course.id}`,pack]));
  const items = [...baseItems,...courses.map(({pack})=>courseContentItem(pack))];
  const copy = surface.values;
  const stages = LEARNING_STAGES.map((stage) => ({
    ...stage,
    label: stringValue(copy, learningStageFieldKey(stage.id, "label")),
    purpose: stringValue(copy, learningStageFieldKey(stage.id, "purpose")),
    outcomes: stringListValue(copy, learningStageFieldKey(stage.id, "outcomes")),
  }));
  const graduationPaths = GRADUATION_PATHS.flatMap((path, index) => pathSurfaces[index].available ? [applyGraduationPathValues(path, pathSurfaces[index].values)] : []);
  const selected = hub.available ? selectHubItems(items, hub.values, query) : items;
  const learning = selected.filter((c) => (c.type === "learning_module" || c.type === "scenario") && c.id !== "lm-how-this-program-works");
  const resources = selected.filter((c) => c.type !== "learning_module" && c.type !== "scenario");
  const selectedTheme = HUB_THEMES.find((theme) => theme.id === query.theme);
  const podcastMembership = selectedTheme && hub.available ? stringListValue(hub.values, `${selectedTheme.id}Ids`) : undefined;
  const podcasts = PODCASTS.flatMap((podcast, index) => {
    const published = podcastSurfaces[index];
    return published.available && (!podcastMembership || podcastMembership.includes(podcast.surfaceId)) && podcastMatches(podcast, { ...query, theme: "" }, stringValue(published.values, "title"), stringValue(published.values, "intro")) ? [{ podcast, surface: published }] : [];
  });
  const totalFound = selected.length + podcasts.length;
  const podcastAvailable = podcastSurfaces.some(published => published.available);
  const types = [...new Set(items.map((item) => item.type))];
  const hubText = (key: string) => stringValue(hub.values, key);
  const filtered = hub.available && Boolean(query.q || query.theme || query.type);
  const staffGuide = items.find((c) => c.id === "lm-how-this-program-works");
  const practice = items.filter((c) => c.type === "practice_note");
  return (
    <EditableSurfaceRegion surface={surface} className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{stringValue(copy, "introKicker")}</p>
          <h1>{hub.available ? hubText("title") : stringValue(copy, "introTitle")}</h1>{owner ? <p className="m-0 mt-2"><Link href="/consultant/resources/new" className="btn btn--primary">+ Add a resource</Link></p> : null}
          <p className={styles.intro}>{hub.available ? hubText("intro") : stringValue(copy, "introLede")}</p>
          <div className={styles.heroLinks}><Link href="#catalog">Explore the collection <span aria-hidden="true">↓</span></Link><Link href="/toolkit-studio">Open Toolkit Studio <span aria-hidden="true">→</span></Link><Link href="/ask">Browse common questions <span aria-hidden="true">→</span></Link><Link href="/learn/sources">Research and sources <span aria-hidden="true">→</span></Link></div>
        </div>
      </header>
      <div className={styles.content}>
        {(!filtered || selectedTheme?.id === "intercultural" || selected.some(item => item.id === "ext-dhs-equity-toolkit")) ? <div className={styles.startingPoints}>
          {(!filtered || selectedTheme?.id === "intercultural") ? <div className={styles.journeyFeature}><LearningJourneyLink scope={scope} /></div> : null}
          {toolkit.available && (!filtered || selected.some(item => item.id === "ext-dhs-equity-toolkit")) ? <aside className={styles.toolkitFeature}>
            <p className={styles.eyebrow}>Put learning into practice</p>
            <h2><Link href="/toolkit-studio">Equity Analysis Toolkit Studio</Link></h2>
            <p>{stringValue(toolkit.values, "intro")}</p>
          </aside> : null}
        </div> : null}
        {(learning.length || (hub.available && resources.length) || podcasts.length || !filtered) ? <nav className={styles.sectionNav} aria-label="On this learning page">
          {learning.length ? <Link href="#modules-title">Courses and learning</Link> : null}
          {hub.available && resources.length ? <Link href="#hub-resources-title">Tools and resources</Link> : null}
          {podcasts.length ? <Link href="#podcasts-title">Podcasts</Link> : null}
          {!filtered ? <><Link href="#stages-title">Ways to grow</Link><Link href="#paths-title">Practice paths</Link></> : null}
        </nav> : null}
        <div id="catalog" className={styles.catalog}>
          <EditableSurfaceRegion surface={hub}>
            <form key={`${query.q}:${query.theme}:${query.type}`} action="/learn" method="get" role="search" className={styles.search}>
              <label htmlFor="hub-q">{hubText("searchLabel")}</label>
              <div className={styles.query}><input id="hub-q" name="q" type="search" defaultValue={query.q ?? ""} /><button type="submit">{hubText("searchButton")}</button></div>
              <div className={styles.filters}>
                <label>{hubText("themeLabel")}<select name="theme" defaultValue={selectedTheme?.id ?? ""}><option value="">{hubText("allLabel")}</option>{HUB_THEMES.map((theme) => <option key={theme.id} value={theme.id}>{hubText(`${theme.id}Title`)}</option>)}</select></label>
                <label>{hubText("formatLabel")}<select name="type" defaultValue={types.includes(query.type as ContentType) || (query.type === "podcast" && podcastAvailable) ? query.type : ""}><option value="">{hubText("allFormats")}</option>{types.map((type) => <option key={type} value={type}>{CONTENT_TYPE_LABEL[type]}</option>)}{podcastAvailable ? <option value="podcast">Podcast</option> : null}</select></label>
                {query.q || query.theme || query.type ? <Link href="/learn">{hubText("clearLabel")}</Link> : null}
              </div>
            </form>
            <nav aria-label={hubText("themeLabel")} className={styles.themes}>{HUB_THEMES.map((theme) => <Link key={theme.id} href={`/learn?${new URLSearchParams({ theme: theme.id, ...(query.q ? { q: query.q } : {}), ...(query.type ? { type: query.type } : {}) })}`} aria-current={selectedTheme?.id === theme.id ? "page" : undefined}>{hubText(`${theme.id}Title`)}</Link>)}</nav>
            {selectedTheme ? <aside className={styles.themeNote}><div><h2>{hubText(`${selectedTheme.id}Title`)}</h2><p>{hubText(`${selectedTheme.id}Intro`)}</p></div><div><h3>{hubText(`${selectedTheme.id}NoteTitle`)}</h3><p>{hubText(`${selectedTheme.id}Note`)}</p></div></aside> : null}
            {selectedTheme?.id === "structural" ? <aside className={styles.readingLinks}><h2>{hubText("readingTitle")}</h2><ul>{linkListValue(hub.values, "readingLinks").map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul><p>{hubText("readingNote")}</p></aside> : null}
            <p role="status" className={styles.resultCount}>{totalFound} {hubText(totalFound === 1 ? "countSingular" : "countLabel")}</p>
            {!totalFound ? <div><h2>{hubText("emptyTitle")}</h2><p>{hubText("emptyBody")}</p></div> : null}
          </EditableSurfaceRegion>
          <EditableSurfaceRegion surface={catalog}>{null}</EditableSurfaceRegion>
          {learning.length ? <section className={styles.section} aria-labelledby="modules-title">
            <div className={styles.sectionHeading}><h2 id="modules-title">{hub.available ? hubText("coursesTitle") : stringValue(copy, "modulesTitle")}</h2><span>{learning.length} to explore</span></div>
            <ul className={styles.courseGrid}>
              {learning.map((item) => <li key={item.id}><LearningTile item={item} owner={owner} href={courseById.has(item.id) ? courseHref(courseById.get(item.id)!.course.id) : undefined} presentation={courseById.has(item.id) ? {imageSrc:courseById.get(item.id)!.course.coverImage,imageAlt:courseById.get(item.id)!.course.coverAlt,summary:shortSummary(courseSummary(courseById.get(item.id)!))} : catalog.available ? getLearningTilePresentation(item.id, catalog.values) : undefined} /></li>)}
            </ul>
          </section> : null}
          {hub.available && resources.length ? <section className={styles.section} aria-labelledby="hub-resources-title"><div className={styles.sectionHeading}><h2 id="hub-resources-title">{hubText("resourcesTitle")}</h2><span>{resources.length} resources</span></div><ul className={styles.resourceList}>{resources.map((item) => <li key={item.id} data-hub-resource={item.id}><span className={styles.resourceKind}>{CONTENT_TYPE_LABEL[item.type]}</span><h3><Link href={`/library/${item.id}`}>{item.title}</Link></h3><p>{shortSummary(item.summary)}</p><AuthorityPill authority={item.authority} />{owner ? <> <ResourceRemove contentItemId={item.id} title={item.title} compact /></> : null}</li>)}</ul></section> : null}
          {podcasts.length ? <section className={styles.section} aria-labelledby="podcasts-title"><div className={styles.sectionHeading}><h2 id="podcasts-title">Podcasts</h2></div><div className={styles.podcastGrid}>{podcasts.map(({ podcast, surface: podcastSurface }) => <PublishedPodcast key={podcast.id} podcast={podcast} surface={podcastSurface} />)}</div></section> : null}
        </div>
        {staffGuide && (!filtered || selected.some((item) => item.id === staffGuide.id)) ? <aside className={styles.guide} aria-labelledby="learning-guide-title"><div><h2 id="learning-guide-title">{catalog.available ? stringValue(catalog.values, "staffGuideTitle") : staffGuide.title}</h2>{catalog.available ? <p>{stringValue(catalog.values, "staffGuideIntro")}</p> : null}</div><Link href={`/library/${staffGuide.id}`}>{staffGuide.title}</Link></aside> : null}
        {!filtered ? <>
          <section className={styles.section} aria-labelledby="stages-title">
            <p className={styles.eyebrow}>{stringValue(copy, "stagesKicker")}</p>
            <h2 id="stages-title">{stringValue(copy, "stagesTitle")}</h2>
            <p className={styles.intro}>{stringValue(copy, "stagesIntro")}</p>
            <ol className={styles.stages}>{stages.map((stage) => <li id={stage.id} key={stage.id}><div><span className={styles.stageNumber}>{stringValue(copy, "stageLabel")} {stage.stage}</span><h3>{stage.label}</h3></div><div><p>{stage.purpose}</p><ul>{stage.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul><p><Link href={learningStageHref(stage.id)}>{stringValue(copy, "stageLinkLabel")} <span aria-hidden="true">→</span></Link></p></div></li>)}</ol>
          </section>
          <section className={styles.section} aria-labelledby="paths-title"><h2 id="paths-title">{stringValue(copy, "pathsTitle")}</h2><p className={styles.intro}>{stringValue(copy, "pathsIntro")}</p><ul className={styles.pathList}>{graduationPaths.map((p) => <li key={p.id}><Link href={`/practice/${p.id}`}>{p.title}</Link><p>{p.startingCompetence}</p></li>)}</ul></section>
          {!hub.available ? <section className={styles.section} aria-labelledby="notes-title"><h2 id="notes-title">{stringValue(copy, "notesTitle")}</h2><ul className={styles.pathList}>{practice.map((c) => <li key={c.id}><Link href={`/library/${c.id}`}>{c.title}</Link>{owner ? <> <ResourceRemove contentItemId={c.id} title={c.title} compact /></> : null}<p>{shortSummary(c.summary)}</p></li>)}</ul></section> : null}
        </> : null}
        <div className={styles.context}><DhsReferenceLink /><ProgramContextNote /></div>
        {catalog.available ? <details className={styles.participation}><summary>{stringValue(catalog.values, "participationDetailsLabel")}</summary><ParticipationNotice surface="learning" /></details> : <ParticipationNotice surface="learning" />}
      </div>
    </EditableSurfaceRegion>
  );
}