import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { Notice } from "./ui";
import { getBrief } from "@/lib/content/briefs";
import { getPath } from "@/lib/content/paths";
import { communityReading } from "@/lib/content/community-design";
import { COMMUNITY_QUESTIONS, NATIVE_DEFERENCE_COMMUNITY_IDS, communityReadingGroups } from "@/lib/content/community-presentation";
import { communityReadingSurfaceId } from "@/lib/content/community-reading-surface";
import type { EditableRichBlock } from "@/lib/content/editable-surface-contract";
import { applyCommunityBriefValues, communityBriefSurfaceId, stringValue } from "@/lib/content/staff-surface-registry";
import { EditableSurfaceRegion, prepareEditableSurface } from "./editable-surface";
import { ResourceDownloads } from "./resource-downloads";
import { CommunityExperience, CommunityPractice } from "./community-experience-controls";
import "./community-editorial.css";

function inlineText(text: string): ReactNode {
  // Render content as text/links, never as executable source HTML.
  return text.split(/(\[[^\]]+\]\(https:\/\/[^\s)]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
    const plain = part.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
    return link ? <a key={index} href={link[2]}>{link[1]}</a> : <Fragment key={index}>{plain}</Fragment>;
  });
}

function Reading({ body }: { body: string }) {
  return <>{body.split(/\n\s*\n/).map((part, index) => {
    const heading = part.match(/^#{1,6}\s+(.+)$/);
    if (heading) return <h3 key={index}>{inlineText(heading[1])}</h3>;
    const lines = part.split("\n");
    if (lines.every(line => /^\s*[-*]\s+/.test(line))) return <ul key={index}>{lines.map((line, n) => <li key={n}>{inlineText(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
    if (lines.every(line => /^\s*\d+[.)]\s+/.test(line))) return <ol key={index}>{lines.map((line, n) => <li key={n}>{inlineText(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>)}</ol>;
    return <p key={index}>{inlineText(part)}</p>;
  })}</>;
}

function chapterTitle(title: string) {
  if (title === "A Note on This Guide") return "People, place, and perspective";
  if (/^How it hits DHS gates/.test(title)) return "Connections to human services";
  return title;
}

function RichReading({ blocks }: { blocks: EditableRichBlock[] }) {
  return <>{blocks.map((block, i) => {
    if (block.type === "heading") return <h3 key={i}>{block.text}</h3>;
    if (block.type === "paragraph") return <p key={i}>{block.text}</p>;
    if (block.type === "link-list") return <ul key={i}>{block.items.map((link, n) => <li key={n}><a href={link.href}>{link.label}</a></li>)}</ul>;
    const List = block.type === "numbered-list" ? "ol" : "ul";
    return <List key={i}>{block.items.map((item, n) => <li key={n}>{item}</li>)}</List>;
  })}</>;
}

function Chapters({ chapters, openFirst = false }: { chapters: Array<{ heading: string; body: string; blocks?: EditableRichBlock[] }>; openFirst?: boolean }) {
  return <>{chapters.map((chapter, index) => <details key={`${chapter.heading}-${index}`} open={openFirst && index === 0}>
    <summary>{chapterTitle(chapter.heading)}</summary><div>{chapter.blocks ? <RichReading blocks={chapter.blocks} /> : <Reading body={chapter.body} />}</div>
  </details>)}</>;
}

export async function CommunityDesignPage({ id }: { id: string }) {
  const raw = getBrief(id);
  const recovered = communityReading(id);
  if (!raw && !recovered) notFound();
  const [surface, readingSurface] = await Promise.all([
    raw ? prepareEditableSurface(communityBriefSurfaceId(id)) : Promise.resolve(null),
    recovered ? prepareEditableSurface(communityReadingSurfaceId(id)) : Promise.resolve(null),
  ]);
  // Owners retain the existing editing controls for withdrawn areas, but staff
  // must receive a real unavailable result rather than an empty successful page.
  if ([surface, readingSurface].some(area => area && !area.available && !area.canEdit)) notFound();
  const b = raw && surface ? applyCommunityBriefValues(raw, surface.values) : null;
  const title = b && b.title !== raw?.title ? b.title : readingSurface ? stringValue(readingSurface.values, "title") : b!.title;
  const chapters: Array<{ heading: string; body: string; blocks?: EditableRichBlock[] }> = recovered && readingSurface ? recovered.sections.map((chapter, i) => ({
    ...chapter, heading: stringValue(readingSurface.values, `chapter${i}Title`), blocks: readingSurface.values[`chapter${i}Body`] as EditableRichBlock[],
  })) : b?.level2 ?? [];
  const readingGroups = communityReadingGroups(chapters);
  const firstParagraph = chapters.flatMap(chapter => chapter.blocks ?? []).find(block => block.type === "paragraph");
  const opening = b?.level0.whoAndWhere ?? (firstParagraph?.type === "paragraph" ? firstParagraph.text : undefined);
  const question = COMMUNITY_QUESTIONS[id] ?? {
    question: `A team is preparing an outreach meeting with people whose experiences are discussed in ${title}. Before choosing one format, what would you want to learn from the people who might attend?`,
    response: "Use the community context to prepare questions, not to decide the answers for participants. Ask about language, access, timing, and how people want to contribute. Explain what they can influence and how the team will respond to their input.",
  };
  const spotlight = surface ? stringValue(surface.values, "spotlightTitle") : "";
  const practice = b ? <section id="community-practice">
    <h2>{b.tribalGate ? "Government-to-government relationships" : "Practice considerations"}</h2>
    <p>{b.level0.whyItMattersForDhsWork}</p>
    {Object.entries({ "What to ask": b.level1.whatToAsk, "Access considerations": b.level1.accessChecks, "Who to involve": b.level1.whoToInvolve, "Assumptions to examine": b.level1.whatNotToAssume }).map(([heading, items]) => <details key={heading}><summary>{heading}</summary><div><ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul></div></details>)}
  </section> : null;
  const links = <section id="community-connections"><h2>Continue the connection</h2>
    <ul className="community-link-list">
      {b?.relatedPathIds.map(id => getPath(id)).filter(path => path !== undefined).map(path => <li key={path.id}><Link href={`/paths/${path.id}`}>{path.title}</Link></li>)}
      <li><Link href="/learn/equity-toolkit">Equity Analysis Toolkit</Link></li>
      <li><Link href="/learn/community-connections">Community engagement and connections</Link></li>
      <li><Link href="/learn">Learning and resources</Link></li>
      <li><Link href="/ask">Browse common questions</Link></li>
    </ul>
  </section>;
  const overview = <>
    <nav className="community-reading-contents" aria-label="In this brief"><a href="#community-history">History and culture</a>{b ? <a href="#community-practice">Practice considerations</a> : null}<a href="#community-connections">Related resources</a></nav>
    {b ? <section id="community-overview"><h2>Community overview</h2><p>{b.level0.withinGroupDiversity}</p><h3>Names and terms</h3><p>{b.names.preferred.join("; ")}</p>{b.names.alsoUsed.length ? <p>Also used: {b.names.alsoUsed.join("; ")}</p> : null}<p>{b.names.note}</p>{b.names.uncertainty ? <p>{b.names.uncertainty}</p> : null}</section> : null}
    <section id="community-history"><h2>History, culture, and life today</h2>{readingGroups.filter(group => group.chapters.length).map(group => <details className="community-reading-theme" key={group.title}><summary>{group.title}</summary><div><Chapters chapters={group.chapters} /></div></details>)}</section>
    {practice}
    {b?.level2?.length && recovered ? <section id="community-context"><h2>More context for your work</h2><Chapters chapters={b.level2} /></section> : null}
    {b?.observances?.length ? <section id="community-observances"><h2>Observances at work</h2><div className="community-table" role="region" aria-label="Observances at work" tabIndex={0}><table><thead><tr><th scope="col">Observance</th><th scope="col">When</th><th scope="col">At work</th></tr></thead><tbody>{b.observances.map((o, i) => <tr key={i}><th scope="row">{o.title}</th><td>{o.when}</td><td>{o.atWork}</td></tr>)}</tbody></table></div></section> : null}
    {b?.sources.length ? <section id="community-sources"><h2>Sources</h2><ul>{b.sources.map((source, index) => <li key={index}>{source.href ? <a href={source.href}>{source.label}</a> : source.label}</li>)}</ul></section> : null}
    {links}
  </>;
  // All recovered chapters remain available in the brief. Learning brings full
  // readings alongside three objectives and a reflection, rather than replacing
  // the source material with short question-only summaries.
  const learning = <>
    <section><h2>History and the decisions we make today</h2><h3>In this lesson</h3><ul>
      <li>Connect a historical condition described in the brief to a present-day service question.</li>
      <li>Distinguish community-level context from an individual’s circumstances.</li>
      <li>Identify evidence needed before changing a service requirement.</li>
    </ul><Chapters chapters={readingGroups[0].chapters} />
    {!b?.tribalGate ? <CommunityPractice {...question} /> : <p>Historical and cultural learning does not replace government-to-government consultation. Begin with the Tribal Relations guidance and the Nation’s own designated contacts.</p>}</section>
    <section><h2>Family, identity, and individual experience</h2><h3>In this lesson</h3><ul>
      <li>Recognize differences in identity, language, and experience within a community.</li>
      <li>Ask about a person’s relationships without prescribing who should be involved.</li>
      <li>Identify an assumption that could distort a service conversation.</li>
    </ul><Chapters chapters={readingGroups[1].chapters} />
    <CommunityPractice question="A person names a close friend as an important source of support. How would you learn what that relationship means for the decision being discussed?" response="Ask the person how they want their friend involved, and explain any relevant requirements. A community description cannot establish whom an individual trusts or what support they want." /></section>
    <section><h2>From understanding to an equity analysis</h2><h3>In this lesson</h3><ul>
      <li>Identify a specific access barrier in a proposed process.</li>
      <li>Name whose input would help evaluate the decision.</li>
      <li>Choose a way to check whether a revision improves access.</li>
    </ul><Chapters chapters={readingGroups[2].chapters} />
    <CommunityPractice question="A team has offered a listening session but has not explained what changed afterward. What would strengthen the work?" response="Explain what input affected the decision, what remains unresolved, and how participants can respond. Attendance is useful information, but it does not show that the decision became more responsive." />
    <p><Link href="/learn/equity-toolkit">Connect your reflection to the Equity Analysis Toolkit</Link></p></section>
  </>;
  const content = <div className="community-editorial">
    <div className="community-reading-layout">
      <aside><Link href="/minnesota-communities">Minnesota Communities</Link><p>History, everyday life, and the connections that shape our work.</p></aside>
      <article>
        <p className="community-eyebrow">Minnesota Communities</p><h1>{title}</h1>
        {(NATIVE_DEFERENCE_COMMUNITY_IDS as readonly string[]).includes(id) ? <Notice tone="info">This program defers to the Office of Indian Affairs and to the Department of Human Services offices that handle Tribal relations and consultation for anything concerning Native American individuals, communities, or Tribal Nations. That deference is standing, not a brief under construction — this program does not complete or expand this content on its own. For anything substantive, contact the Office of Indian Affairs or the Department of Human Services offices that handle Tribal relations and consultation directly.</Notice> : null}
        {[surface, readingSurface].every(area => !area || area.available) ? <ResourceDownloads kind="brief" id={id} noun="brief" /> : null}
        {opening ? <p className="community-opening">{opening}</p> : null}
        {spotlight && surface ? <section className="community-spotlight"><h2>{spotlight}</h2><p>{stringValue(surface.values, "spotlightBody")}</p><a href={stringValue(surface.values, "spotlightHref")}>{stringValue(surface.values, "spotlightLinkLabel")}</a></section> : null}
        {surface && stringValue(surface.values, "reflectionBody") ? <details className="community-opening-reflection"><summary>{stringValue(surface.values, "reflectionTitle")}</summary><div><p>{stringValue(surface.values, "reflectionBody")}</p></div></details> : null}
        <CommunityExperience title={title} brief={overview} learning={learning} />
      </article>
    </div>
  </div>;
  const readings = readingSurface ? <EditableSurfaceRegion surface={readingSurface}>{content}</EditableSurfaceRegion> : content;
  return surface ? <EditableSurfaceRegion surface={surface}>{readings}</EditableSurfaceRegion> : readings;
}
