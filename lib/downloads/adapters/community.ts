import { prepareEditableSurface } from "@/lib/content/prepare-editable-surface";
import { getBrief } from "@/lib/content/briefs";
import { communityReading } from "@/lib/content/community-design";
import { NATIVE_DEFERENCE_COMMUNITY_IDS, communityReadingGroups } from "@/lib/content/community-presentation";
import { communityReadingSurfaceId } from "@/lib/content/community-reading-surface";
import type { EditableRichBlock } from "@/lib/content/editable-surface-contract";
import { getPath } from "@/lib/content/paths";
import { applyCommunityBriefValues, communityBriefSurfaceId, stringValue } from "@/lib/content/staff-surface-registry";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { bullets, callout, compactSections, paragraph, section, type DocumentBlock, type DocumentSection, type ResourceDocument } from "../model";
import { kicker, linkList, programName, richBlocks } from "./shared";

const DEFERENCE_NOTICE =
  "This program defers to the Office of Indian Affairs and to the Department of Human Services offices that handle Tribal relations and consultation for anything concerning Native American individuals, communities, or Tribal Nations. That deference is standing, not a brief under construction — this program does not complete or expand this content on its own. For anything substantive, contact the Office of Indian Affairs or the Department of Human Services offices that handle Tribal relations and consultation directly.";

type Chapter = { heading: string; body: string; blocks?: EditableRichBlock[] };

function chapterTitle(title: string): string {
  if (title === "A Note on This Guide") return "People, place, and perspective";
  if (/^How it hits DHS gates/.test(title)) return "Connections to human services";
  return title;
}

function chapterBlocks(chapter: Chapter): DocumentBlock[] {
  return [
    { kind: "heading", level: 3, text: chapterTitle(chapter.heading) },
    ...(chapter.blocks ? richBlocks(chapter.blocks) : chapter.body.split(/\n\s*\n/).filter((part) => part.trim()).map((part) => paragraph(part))),
  ];
}

/** Mirrors the community page: the same published wording, availability, and standing notices staff see. */
export async function briefDocument(id: string, scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const raw = getBrief(id);
  const recovered = communityReading(id);
  if (!raw && !recovered) return null;
  const [surface, readingSurface] = await Promise.all([
    raw ? prepareEditableSurface(communityBriefSurfaceId(id), { scope, includeOwner: false }) : Promise.resolve(null),
    recovered ? prepareEditableSurface(communityReadingSurfaceId(id), { scope, includeOwner: false }) : Promise.resolve(null),
  ]);
  if ([surface, readingSurface].some((area) => area && !area.available)) return null;

  const brief = raw && surface ? applyCommunityBriefValues(raw, surface.values) : null;
  const title = brief && brief.title !== raw?.title ? brief.title : readingSurface ? stringValue(readingSurface.values, "title") : brief!.title;
  const chapters: Chapter[] = recovered && readingSurface
    ? recovered.sections.map((chapter, index) => ({
        ...chapter,
        heading: stringValue(readingSurface.values, `chapter${index}Title`),
        blocks: readingSurface.values[`chapter${index}Body`] as EditableRichBlock[],
      }))
    : brief?.level2 ?? [];
  const readingGroups = communityReadingGroups(chapters);
  const firstParagraph = chapters.flatMap((chapter) => chapter.blocks ?? []).find((block) => block.type === "paragraph");
  const opening = brief?.level0.whoAndWhere ?? (firstParagraph?.type === "paragraph" ? firstParagraph.text : undefined);
  const deference = (NATIVE_DEFERENCE_COMMUNITY_IDS as readonly string[]).includes(id);

  const overview: DocumentSection[] = [];
  if (surface && stringValue(surface.values, "spotlightTitle")) {
    overview.push(
      section(stringValue(surface.values, "spotlightTitle"), [
        paragraph(stringValue(surface.values, "spotlightBody")),
        stringValue(surface.values, "spotlightHref")
          ? linkList([{ label: stringValue(surface.values, "spotlightLinkLabel"), href: stringValue(surface.values, "spotlightHref") }])
          : null,
        stringValue(surface.values, "reflectionBody")
          ? callout(stringValue(surface.values, "reflectionBody"), stringValue(surface.values, "reflectionTitle") || "A different starting point")
          : null,
      ]),
    );
  }
  if (brief) {
    overview.push(
      section("Community overview", [
        paragraph(brief.level0.withinGroupDiversity),
        { kind: "heading", level: 3, text: "Names and terms" },
        paragraph(brief.names.preferred.join("; ")),
        brief.names.alsoUsed.length ? paragraph(`Also used: ${brief.names.alsoUsed.join("; ")}`) : null,
        paragraph(brief.names.note),
        brief.names.uncertainty ? paragraph(brief.names.uncertainty) : null,
      ]),
    );
  }
  overview.push(
    ...readingGroups
      .filter((group) => group.chapters.length > 0)
      .map((group) => section(group.title, group.chapters.flatMap(chapterBlocks))),
  );
  if (brief) {
    overview.push(
      section(brief.tribalGate ? "Government-to-government relationships" : "Practice considerations", [
        paragraph(brief.level0.whyItMattersForDhsWork),
        { kind: "heading", level: 3, text: "What to ask" },
        bullets(brief.level1.whatToAsk),
        { kind: "heading", level: 3, text: "Access considerations" },
        bullets(brief.level1.accessChecks),
        { kind: "heading", level: 3, text: "Who to involve" },
        bullets(brief.level1.whoToInvolve),
        { kind: "heading", level: 3, text: "Assumptions to examine" },
        bullets(brief.level1.whatNotToAssume),
      ]),
    );
    if (brief.level2?.length && recovered) {
      overview.push(section("More context for your work", brief.level2.flatMap((chapter) => chapterBlocks(chapter))));
    }
    if (brief.observances?.length) {
      overview.push(
        section("Observances at work", [
          { kind: "table", headers: ["Observance", "When", "At work"], rows: brief.observances.map((entry) => [entry.title, entry.when, entry.atWork]) },
        ]),
      );
    }
  }
  const paths = (brief?.relatedPathIds ?? []).map((pathId) => getPath(pathId)).filter((path) => path !== undefined);
  overview.push(
    section("Continue the connection", [
      linkList([
        ...paths.map((path) => ({ label: path.title, href: `/paths/${path.id}` })),
        { label: "Equity Analysis Toolkit", href: "/learn/equity-toolkit" },
        { label: "Community engagement and connections", href: "/learn/community-connections" },
        { label: "Learning and resources", href: "/learn" },
      ]),
    ]),
  );

  return {
    kicker: kicker(scope, "Minnesota Communities"),
    title,
    subtitle: opening,
    meta: brief ? [{ label: "Maintained by", value: brief.owner }] : [],
    sections: compactSections([
      deference ? section(undefined, [callout(DEFERENCE_NOTICE, "Standing deference")]) : section(undefined, []),
      ...overview,
    ]),
    sources: brief?.sources.map((source) => ({ title: source.label, href: source.href, note: source.note })),
    attribution: programName(scope),
  };
}
