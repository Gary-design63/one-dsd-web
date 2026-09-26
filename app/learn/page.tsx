import styles from "./learning-family.module.css";
import { EquityGoalOverview } from "@/components/equity-goal-overview";
import { DevelopmentPathways } from "@/components/development-pathways";
import preview from "./learning-preview.module.css";
import { getLearningJourney } from "@/lib/content/learning-journey";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
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

export default async function LearnPage({ searchParams }: { searchParams?: Promise<{ q?: string | string[]; theme?: string | string[]; type?: string | string[]; browse?: string | string[] }> }) {
  const rawQuery = await searchParams ?? {};
  const query = { q: typeof rawQuery.q === "string" ? rawQuery.q : "", theme: typeof rawQuery.theme === "string" ? rawQuery.theme : "", type: typeof rawQuery.type === "string" ? rawQuery.type : "" };
  const scope = await requestedContentScope();
  const owner = await editingModeFromCookies();
  const [{ items: baseItems }, surface, catalog, hub, toolkit, journey, podcastSurfaces, ...pathSurfaces] = await Promise.all([
    loadStaffContentSnapshot({ scope }),
    prepareEditableSurface("learn.page", { scope }),
    prepareEditableSurface("learn.catalog", { scope }),
    prepareEditableSurface("learn.hub", { scope }),
    prepareEditableSurface("equity-toolkit.home", { scope, includeOwner: false }),
    prepareEditableSurface("learn.intercultural", { scope, includeOwner: false }),
    Promise.all(PODCASTS.map(podcast => prepareEditableSurface(podcast.surfaceId, { scope }))),
    ...GRADUATION_PATHS.map((path) => prepareEditableSurface(graduationPathSurfaceId(path.id), { scope, includeOwner: false })),
  ]);
  const courses = await publishedCourses(scope);
  const courseById = new Map(courses.map(({pack})=>[`course-${pack.course.id}`,pack]));
  const items = [...baseItems,...courses.map(({pack})=>courseContentItem(pack, { includeLessonBody: Boolean(query.q.trim()) }))];
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
  const expanded = filtered || rawQuery.browse === "all";
  // Foundations come from the published, owner-editable intercultural journey.
  const foundations = getLearningJourney(journey.values)[0];
  const startingIds = new Set(journey.available ? foundations.resourceIds.slice(0, 2) : []);
  const startingLearning = learning.filter(item => startingIds.has(item.id));
  const remainingLearning = learning.filter(item => !startingIds.has(item.id));
  const accessResource = items.find(item => item.id === "ja-language-access-checklist");
  const topicFirst = learning[0] ?? resources[0];
  const renderLearning = (collection: typeof learning) => <ul className={styles.courseGrid}>{collection.map((item) => <li key={item.id}><LearningTile item={item} owner={owner} href={courseById.has(item.id) ? courseHref(courseById.get(item.id)!.course.id) : undefined} presentation={courseById.has(item.id) ? {imageSrc:courseById.get(item.id)!.course.coverImage,imageAlt:courseById.get(item.id)!.course.coverAlt,summary:shortSummary(courseSummary(courseById.get(item.id)!))} : catalog.available ? getLearningTilePresentation(item.id, catalog.values) : undefined} /></li>)}</ul>;
  const staffGuide = items.find((c) => c.id === "lm-how-this-program-works");
  const practice = items.filter((c) => c.type === "practice_note");
  return (
    <EditableSurfaceRegion surface={surface} className={`${styles.page} ${preview.page}`}>
      <header className={`${styles.hero} ${preview.hero}`}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{stringValue(copy, "introKicker")}</p>
          <h1>{hub.available ? hubText("title") : stringValue(copy, "introTitle")}</h1>{owner ? <p className="m-0 mt-2"><Link href="/consultant/resources/new" className="btn btn--primary">+ Add a resource</Link></p> : null}
          <p className={styles.intro}>{hub.available ? hubText("intro") : stringValue(copy, "introLede")}</p>
          <div className={styles.heroLinks}><Link href={filtered && !selectedTheme ? "/learn#start-here" : "#start-here"}>Start here</Link><Link href="#catalog">Browse the collection</Link></div>
        </div>
      </header>
      <div className={styles.content}>
        {!filtered ? <><EquityGoalOverview /><DevelopmentPathways compact /></> : null}
        {!filtered ? <section id="start-here" className={preview.startHere} aria-labelledby="start-title">
          <p className={styles.eyebrow}>Recommended foundations</p>
          <h2 id="start-title">Start here</h2>
          <p>Build understanding, make participation more accessible, and bring equity into everyday decisions. Choose the starting point that fits your question.</p>
          <div className={preview.startGrid}>
            {journey.available ? <article><h3><Link href="/learn/intercultural#foundations">{foundations.title}</Link></h3><p>Notice your own assumptions and make room for another person’s experience.</p><Link href="/learn/intercultural#foundations">Explore the foundations →</Link></article> : null}
            {accessResource ? <article><h3><Link href={"/library/" + accessResource.id}>Make communication accessible</Link></h3><p>Consider language needs and qualified support before a conversation begins.</p><Link href={"/library/" + accessResource.id}>Use the language access checklist →</Link></article> : null}
            {toolkit.available ? <article><h3><Link href="/learn/equity-toolkit">Carry learning into a decision</Link></h3><p>Examine barriers, compare options, and involve the people affected by a decision.</p><Link href="/learn/equity-toolkit">Explore equity analysis →</Link></article> : null}
          </div>
          <p className={preview.voluntary}>Learning here is voluntary. These are recommendations, not required training.</p>
          <details className={preview.credit}><summary>About DHS training credit</summary><p>{TRAINING_CREDIT_NOTICE}</p></details>
        </section> : null}
        {selectedTheme ? <section id="start-here" className={preview.startHere} aria-labelledby="topic-start-title">
          <p className={styles.eyebrow}>Explore a topic</p><h2 id="topic-start-title">{hubText(selectedTheme.id + "Title")}</h2><p>{hubText(selectedTheme.id + "Intro")}</p>
          {topicFirst ? <div className={preview.topicFirst}><h3>Start here</h3><Link href={courseById.has(topicFirst.id) ? courseHref(courseById.get(topicFirst.id)!.course.id) : "/library/" + topicFirst.id}>{topicFirst.title}</Link><p>{shortSummary(topicFirst.whyItMatters || topicFirst.summary, 220)}</p></div> : null}
          <details className={preview.credit}><summary>{hubText(selectedTheme.id + "NoteTitle")}</summary><p>{hubText(selectedTheme.id + "Note")}</p></details>
        </section> : null}
        <h2 className={preview.collectionTitle}>Browse the collection</h2>
        <div id="catalog" className={styles.catalog}>
          <EditableSurfaceRegion surface={hub}>
            <form key={`${query.q}:${query.theme}:${query.type}`} action="/learn" method="get" role="search" className={styles.search}>
              <label htmlFor="hub-q">{hubText("searchLabel")}</label>
              <div className={styles.query}><input id="hub-q" name="q" type="search" defaultValue={query.q ?? ""} /><button type="submit">{hubText("searchButton")}</button></div>
              <details className={preview.filterOptions} open={Boolean(query.theme || query.type)}>
                <summary>Choose a topic or format</summary>
                <div className={styles.filters}>
                  <label>{hubText("themeLabel")}<select name="theme" defaultValue={selectedTheme?.id ?? ""}><option value="">{hubText("allLabel")}</option>{HUB_THEMES.map((theme) => <option key={theme.id} value={theme.id}>{hubText(`${theme.id}Title`)}</option>)}</select></label>
                  <label>{hubText("formatLabel")}<select name="type" defaultValue={types.includes(query.type as ContentType) || (query.type === "podcast" && podcastAvailable) ? query.type : ""}><option value="">{hubText("allFormats")}</option>{types.map((type) => <option key={type} value={type}>{CONTENT_TYPE_LABEL[type]}</option>)}{podcastAvailable ? <option value="podcast">Podcast</option> : null}</select></label>
                </div>
              </details>
              {query.q || query.theme || query.type ? <Link className={preview.clearFilters} href="/learn">{hubText("clearLabel")}</Link> : null}
            </form>
            {selectedTheme?.id === "structural" ? <aside className={styles.readingLinks}><h2>{hubText("readingTitle")}</h2><ul>{linkListValue(hub.values, "readingLinks").map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul><p>{hubText("readingNote")}</p></aside> : null}
            {expanded ? <p role="status" className={styles.resultCount}>{totalFound} {hubText(totalFound === 1 ? "countSingular" : "countLabel")}</p> : null}
            {!totalFound ? <div><h2>{hubText("emptyTitle")}</h2><p>{hubText("emptyBody")}</p></div> : null}
          </EditableSurfaceRegion>
          <EditableSurfaceRegion surface={catalog}>{null}</EditableSurfaceRegion>
          {!filtered && courses.some(({pack}) => /^div-[fia]/.test(pack.course.id)) ? <p><Link href="/learn/diversity">Explore diversity courses: Foundation, Intermediate, and Advanced</Link></p> : null}
          {learning.length ? <section className={styles.section} aria-labelledby="modules-title">
            <div className={styles.sectionHeading}><h2 id="modules-title">{hub.available ? hubText("coursesTitle") : stringValue(copy, "modulesTitle")}</h2><span>{learning.length} to explore</span></div>
            {expanded ? renderLearning(learning) : <>
              {startingLearning.length ? <><p className={preview.collectionIntro}>Build a foundation in cultural humility and intercultural practice.</p>{renderLearning(startingLearning)}</> : null}
              {remainingLearning.length ? <p className={preview.browseAll}><Link href="/learn?browse=all#modules-title">Browse all {learning.length} courses and learning resources →</Link></p> : null}
            </>}
          </section> : null}
          {hub.available && resources.length ? <section className={styles.section} aria-labelledby="hub-resources-title"><div className={styles.sectionHeading}><h2 id="hub-resources-title">{hubText("resourcesTitle")}</h2><span>{resources.length} resources</span></div><details className={preview.disclosure} open={filtered}><summary>Browse tools, guidance, and further reading</summary><ul className={styles.resourceList}>{resources.map((item) => <li key={item.id} data-hub-resource={item.id}><span className={styles.resourceKind}>{CONTENT_TYPE_LABEL[item.type]}</span><h3><Link href={`/library/${item.id}`}>{item.title}</Link></h3><p>{shortSummary(item.summary)}</p><AuthorityPill authority={item.authority} />{owner ? <> <ResourceRemove contentItemId={item.id} title={item.title} compact /></> : null}</li>)}</ul></details></section> : null}
          {podcasts.length ? <section className={styles.section} aria-labelledby="podcasts-title"><div className={styles.sectionHeading}><h2 id="podcasts-title">Podcasts</h2></div><details className={preview.disclosure} open={filtered}><summary>Explore podcasts</summary><div className={styles.podcastGrid}>{podcasts.map(({ podcast, surface: podcastSurface }) => <PublishedPodcast key={podcast.id} podcast={podcast} surface={podcastSurface} />)}</div></details></section> : null}
        </div>
        {staffGuide && (!filtered || selected.some((item) => item.id === staffGuide.id)) ? <aside className={styles.guide} aria-labelledby="learning-guide-title"><div><h2 id="learning-guide-title">{catalog.available ? stringValue(catalog.values, "staffGuideTitle") : staffGuide.title}</h2>{catalog.available ? <p>{stringValue(catalog.values, "staffGuideIntro")}</p> : null}</div><Link href={`/library/${staffGuide.id}`}>{staffGuide.title}</Link></aside> : null}
        {!filtered ? <>
          <section className={styles.section} aria-labelledby="more-learning-title">
            <h2 id="more-learning-title">More ways to learn</h2>
            <details className={preview.disclosure}>
              <summary id="stages-title">{stringValue(copy, "stagesTitle")}</summary>
              <p className={styles.eyebrow}>{stringValue(copy, "stagesKicker")}</p>
              <p className={styles.intro}>{stringValue(copy, "stagesIntro")}</p>
              <ol className={styles.stages}>{stages.map((stage) => <li id={stage.id} key={stage.id}><div><span className={styles.stageNumber}>{stringValue(copy, "stageLabel")} {stage.stage}</span><h3>{stage.label}</h3></div><div><p>{stage.purpose}</p><ul>{stage.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul><p><Link href={learningStageHref(stage.id)}>{stringValue(copy, "stageLinkLabel")}</Link></p></div></li>)}</ol>
            </details>
            <details className={preview.disclosure}>
              <summary id="paths-title">{stringValue(copy, "pathsTitle")}</summary>
              <p className={styles.intro}>{stringValue(copy, "pathsIntro")}</p>
              <ul className={styles.pathList}>{graduationPaths.map((p) => <li key={p.id}><Link href={`/practice/${p.id}`}>{p.title}</Link><p>{p.startingCompetence}</p></li>)}</ul>
            </details>
          </section>
          {!hub.available ? <section className={styles.section} aria-labelledby="notes-title"><h2 id="notes-title">{stringValue(copy, "notesTitle")}</h2><ul className={styles.pathList}>{practice.map((c) => <li key={c.id}><Link href={`/library/${c.id}`}>{c.title}</Link>{owner ? <> <ResourceRemove contentItemId={c.id} title={c.title} compact /></> : null}<p>{shortSummary(c.summary)}</p></li>)}</ul></section> : null}
        </> : null}
        <div className={styles.context}><p><Link href="/learn/sources">Research and sources</Link> · <Link href="/ask">Common questions</Link> · <Link href="/toolkit-studio">Toolkit Studio</Link></p><details className={preview.disclosure}><summary>About these learning resources</summary><DhsReferenceLink /><ProgramContextNote /></details></div>
        {catalog.available ? <details className={styles.participation}><summary>{stringValue(catalog.values, "participationDetailsLabel")}</summary><ParticipationNotice surface="learning" /></details> : <ParticipationNotice surface="learning" />}
      </div>
    </EditableSurfaceRegion>
  );
}
