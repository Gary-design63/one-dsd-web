import { prepareEditableSurface } from "@/lib/content/prepare-editable-surface";
import { CONNECTION_TOPICS } from "@/lib/content/community-connections";
import { courseContentItem, publishedCourses } from "@/lib/content/courses/published";
import { EAT_CHOICES, EAT_STAGES } from "@/lib/content/equity-toolkit";
import { getLearningJourney, journeyText, selectJourneyResources } from "@/lib/content/learning-journey";
import {
  AUTHORITY_GROUP_LABEL,
  annotationsFor,
  registerSourcesForStaff,
  registerSummary,
  verificationFor,
} from "@/lib/content/source-register";
import { loadStaffContentSnapshot, type StaffProgramScope } from "@/lib/content/staff-publications";
import { linkListValue, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { WORK_PROFILES } from "@/lib/content/work-learning";
import { bullets, callout, compactSections, numbered, paragraph, section, type ResourceDocument } from "../model";
import { kicker, linkList, programName } from "./shared";

export async function equityToolkitDocument(scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const surface = await prepareEditableSurface("equity-toolkit.home", { scope, includeOwner: false });
  if (!surface.available) return null;
  const copy = surface.values;
  const text = (key: string) => stringValue(copy, key);
  return {
    kicker: kicker(scope, "Learning companion"),
    title: text("title"),
    subtitle: text("intro"),
    meta: [],
    sections: compactSections([
      section(undefined, [callout(text("companionNote"), "About this companion"), callout(text("scenarioNote"), "About the example")]),
      ...EAT_STAGES.map(({ id }, index) =>
        section(`Stage ${index + 1}: ${text(`${id}Title`)}`, [
          paragraph(text(`${id}Intro`)),
          { kind: "heading", level: 3, text: text("objectivesTitle") },
          bullets(stringListValue(copy, `${id}Objectives`)),
          { kind: "heading", level: 3, text: text("scenarioTitle") },
          paragraph(text(`${id}Scenario`)),
          {
            kind: "table",
            headers: ["Choice", text("consequenceTitle")],
            rows: EAT_CHOICES.map((choice) => [text(`${id}Choice${choice}`), text(`${id}Consequence${choice}`)]),
          },
          { kind: "heading", level: 3, text: text(`${id}DraftLabel`) },
          paragraph(text(`${id}DraftHelp`)),
        ]),
      ),
      section(text("roleLabel"), [
        paragraph(text("roleIntro")),
        {
          kind: "table",
          headers: ["Area of work", "How the example connects to your work"],
          rows: WORK_PROFILES.map(([id]) => [text(`${id}Label`), text(`${id}Context`)]),
        },
      ]),
      section(text("draftTitle"), [paragraph(text("draftIntro")), callout(text("draftPrivacy"), "Privacy"), paragraph(text("culturalContext")), paragraph(text("authorityNote"))]),
      section(text("resourcesTitle"), [paragraph(text("resourcesIntro")), paragraph(text("resourceIntro")), linkList(linkListValue(copy, "supportingResources"))]),
    ]),
    attribution: programName(scope),
  };
}

export async function communityConnectionsDocument(scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const surface = await prepareEditableSurface("community-connections.home", { scope, includeOwner: false });
  if (!surface.available) return null;
  const copy = surface.values;
  const text = (key: string) => stringValue(copy, key);
  return {
    kicker: kicker(scope, "Community engagement"),
    title: text("title"),
    subtitle: text("intro"),
    meta: [],
    sections: compactSections([
      section(undefined, [paragraph(text("sourceNote"))]),
      section(text("planningTitle"), [paragraph(text("planningIntro")), numbered(stringListValue(copy, "questions"))]),
      section(text("exampleTitle"), [
        paragraph(text("exampleIntro")),
        { kind: "heading", level: 3, text: text("objectivesTitle") },
        bullets(stringListValue(copy, "objectives")),
        ...(["activity", "influence", "result", "return"] as const).flatMap((id) => [
          { kind: "heading" as const, level: 3 as const, text: text(`${id}Title`) },
          paragraph(text(id)),
        ]),
      ]),
      section("Relationships and resources", [
        paragraph(text("relationshipNote")),
        ...CONNECTION_TOPICS.flatMap((topic) => [
          { kind: "heading" as const, level: 3 as const, text: text(`${topic}Title`) },
          linkList(linkListValue(copy, `${topic}Links`)),
        ]),
        paragraph(text("evidenceNote")),
        callout(text("tribalNote"), "Tribal consultation"),
      ]),
    ]),
    attribution: programName(scope),
  };
}

export async function learningJourneyDocument(scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const [surface, snapshot, courses] = await Promise.all([
    prepareEditableSurface("learn.intercultural", { scope, includeOwner: false }),
    loadStaffContentSnapshot({ scope }),
    publishedCourses(scope),
  ]);
  if (!surface.available) return null;
  const text = (key: string) => journeyText(surface.values, key);
  const stops = getLearningJourney(surface.values);
  const items = [...snapshot.items, ...courses.map(({ pack }) => courseContentItem(pack))];
  return {
    kicker: kicker(scope, "Learning for everyday work"),
    title: text("title"),
    subtitle: text("intro"),
    meta: [],
    sections: compactSections([
      section(undefined, [paragraph(text("choice")), callout(text("idiBody"), text("idiTitle"))]),
      ...stops.map((stop) => {
        const resources = selectJourneyResources(stop, items);
        return section(stop.title, [
          paragraph(stop.purpose),
          { kind: "heading", level: 3, text: "What you can practice" },
          bullets(stop.objectives),
          callout(stop.example, "An everyday example"),
          { kind: "heading", level: 3, text: "Try it in your work" },
          paragraph(stop.practice),
          paragraph([{ text: "Reflect: ", bold: true }, { text: stop.reflection }]),
          paragraph([{ text: "Something to carry forward: ", bold: true }, { text: stop.evidence }]),
          resources.length ? { kind: "heading", level: 3, text: "Learning and tools to explore" } : null,
          resources.length ? bullets(resources.map((item) => [{ text: item.title, bold: true }, { text: ` — ${item.summary}` }])) : null,
          paragraph(stop.nextStep),
        ]);
      }),
      section(text("connectionsTitle"), [paragraph(text("connectionsIntro")), linkList(linkListValue(surface.values, "relatedLinks"))]),
    ]),
    attribution: programName(scope),
  };
}

export async function sourcesDocument(scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const surface = await prepareEditableSurface("sources.page", { scope, includeOwner: false });
  if (!surface.available) return null;
  const text = (key: string) => stringValue(surface.values, key);
  const groups = registerSourcesForStaff();
  const summary = registerSummary();
  return {
    kicker: kicker(scope, text("introKicker")),
    title: text("introTitle"),
    subtitle: text("introLede"),
    meta: [
      { label: text("countLabel") || "Sources", value: String(summary.sources) },
      { label: "Outside sources", value: String(summary.outside) },
      { label: "Resources correlated", value: String(summary.resources) },
      { label: "Citations", value: String(summary.citations) },
    ],
    sections: compactSections([
      section(text("readTitle"), [paragraph(text("readBody"))]),
      section(text("statesTitle"), [paragraph(text("statesBody"))]),
      ...groups.map(({ group, sources }) =>
        section(`${AUTHORITY_GROUP_LABEL[group]} (${sources.length})`, [
          {
            kind: "table",
            headers: ["Source", "Address", "Verification", "Notes", text("usedInLabel") || "Used in"],
            rows: sources.map((source) => [
              source.title,
              source.href ?? "",
              verificationFor(source).label,
              annotationsFor(source).join(" "),
              source.citations.map((citation) => citation.resourceTitle).join("; "),
            ]),
          },
        ]),
      ),
    ]),
    attribution: programName(scope),
  };
}
