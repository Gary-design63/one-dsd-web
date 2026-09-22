import { prepareEditableSurface } from "@/lib/content/prepare-editable-surface";
import { AMPLIFY_PAGES } from "@/lib/content/amplify";
import { TEAM_SECTIONS } from "@/lib/content/dsd-team";
import { DEVELOPMENT_CAPABILITIES, DEVELOPMENT_ENTRIES, DEVELOPMENT_MAP_FIELDS } from "@/lib/content/leadership-development";
import { LEADERSHIP_SOURCES, LEADERSHIP_STAGES } from "@/lib/content/leadership-lifecycle";
import { linkListValue, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { getDomain } from "@/lib/domains";
import { getDsdProgram, getScenario } from "@/lib/dsd";
import { bullets, callout, compactSections, fields, numbered, paragraph, quote, section, type DocumentSection, type ResourceDocument } from "../model";
import { kicker, linkList, linkRuns, programName } from "./shared";

export async function scenarioDocument(id: string): Promise<ResourceDocument | null> {
  if (!getScenario(id)) return null;
  const surface = await prepareEditableSurface(`dsd-scenario.${id}`, { scope: "dsd", includeOwner: false });
  if (!surface.available) return null;
  const copy = surface.values;
  const scenario = getScenario(id)!;
  const domain = getDomain(scenario.domain);
  return {
    kicker: kicker("dsd", "Practice situation"),
    title: stringValue(copy, "title"),
    subtitle: stringValue(copy, "situationTitle") ? undefined : undefined,
    meta: domain ? [{ label: "Area of work", value: domain.title }] : [],
    sections: compactSections([
      section(stringValue(copy, "situationTitle"), [paragraph(stringValue(copy, "situation"))]),
      section(stringValue(copy, "noticeTitle"), [bullets(stringListValue(copy, "whatToNotice"))]),
      section(stringValue(copy, "questionsTitle"), [numbered(stringListValue(copy, "questions"))]),
      section(stringValue(copy, "movesTitle"), [linkList(linkListValue(copy, "moves"))]),
      section(stringValue(copy, "handoffTitle"), [paragraph(stringValue(copy, "handoff"))]),
    ]),
    attribution: programName("dsd"),
  };
}

export async function programDocument(id: string): Promise<ResourceDocument | null> {
  const program = getDsdProgram(id);
  if (!program) return null;
  const surface = await prepareEditableSurface(`dsd-program.${id}`, { scope: "dsd", includeOwner: false });
  if (!surface.available) return null;
  const copy = surface.values;
  const areas = program.domains.map((domainId) => getDomain(domainId)).filter((domain) => domain !== undefined);
  return {
    kicker: kicker("dsd", "Program"),
    title: stringValue(copy, "title"),
    subtitle: stringValue(copy, "intro"),
    meta: [],
    sections: compactSections([
      section(stringValue(copy, "entryPointsTitle"), [bullets(stringListValue(copy, "equityEntryPoints"))]),
      section(stringValue(copy, "areasTitle"), [areas.length ? bullets(areas.map((area) => area.title)) : null]),
    ]),
    attribution: programName("dsd"),
  };
}

export async function amplifyDocument(id: string): Promise<ResourceDocument | null> {
  const page = AMPLIFY_PAGES.find((entry) => entry.id === id);
  if (!page) return null;
  const surface = await prepareEditableSurface(`amplify.${id}`, { scope: "dsd", includeOwner: false });
  if (!surface.available) return null;
  const copy = surface.values;
  const sections: DocumentSection[] = page.sections.map(([, body], index) =>
    section(stringValue(copy, `section${index}Title`), [
      typeof body === "string" ? paragraph(stringValue(copy, `section${index}Body`)) : bullets(stringListValue(copy, `section${index}Body`)),
    ]),
  );
  return {
    kicker: kicker("dsd", "Amplify Equity"),
    title: stringValue(copy, "title"),
    subtitle: stringValue(copy, "intro"),
    meta: [],
    sections: compactSections([
      ...sections,
      section(stringValue(copy, "resourcesTitle"), [linkList(linkListValue(copy, "resources"))]),
    ]),
    attribution: programName("dsd"),
  };
}

export async function teamDocument(): Promise<ResourceDocument | null> {
  const surface = await prepareEditableSurface("dsd-team.home", { scope: "dsd", includeOwner: false });
  if (!surface.available) return null;
  const copy = surface.values;
  return {
    kicker: kicker("dsd", "One DSD Team"),
    title: stringValue(copy, "title"),
    subtitle: stringValue(copy, "intro"),
    meta: [],
    sections: compactSections([
      ...TEAM_SECTIONS.map((_, index) => section(stringValue(copy, `heading${index}`), [paragraph(stringValue(copy, `body${index}`))])),
      section(stringValue(copy, "linksTitle"), [linkList(linkListValue(copy, "links"))]),
    ]),
    attribution: programName("dsd"),
  };
}

export function leadershipDocument(): ResourceDocument {
  return {
    kicker: kicker("dsd", "DEIA leadership and growth"),
    title: "Grow your DEIA leadership",
    subtitle:
      "Bring your experience, your curiosity, and the kind of leader you want to become. Develop a practice that makes equity, inclusion, and accessibility part of how DSD works.",
    meta: [],
    sections: compactSections([
      section("Learn. Reflect. Practice. Return.", [
        bullets([
          [{ text: "Learn: ", bold: true }, { text: "Explore a resource and the leadership decision it can inform." }],
          [{ text: "Reflect: ", bold: true }, { text: "Separate what you observed from what you assumed. Consider whose perspective is missing." }],
          [{ text: "Practice: ", bold: true }, { text: "Try a supported change or work through a realistic situation." }],
          [{ text: "Return: ", bold: true }, { text: "Seek feedback, examine what happened, and decide what to keep or change." }],
        ]),
      ]),
      ...DEVELOPMENT_ENTRIES.map((entry) =>
        section(entry.title, [
          paragraph(entry.invitation),
          ...entry.teaching.map((text) => paragraph(text)),
          { kind: "heading", level: 3, text: "After this, you can" },
          bullets(entry.objectives),
          callout(entry.example, "An example to try"),
          { kind: "heading", level: 3, text: "Steps" },
          numbered(entry.steps.map((step) => [{ text: `${step.title}: `, bold: true }, { text: `${step.body} ` }, ...linkRuns({ label: step.link, href: step.href })])),
        ]),
      ),
      section("Capabilities to practice", [
        {
          kind: "table",
          headers: ["Capability", "Practice", "Feedback to ask for", "What shows growth"],
          rows: DEVELOPMENT_CAPABILITIES.map((capability) => [capability.title, capability.practice, capability.feedback, capability.evidence]),
        },
      ]),
      section("Your development map", [
        fields(DEVELOPMENT_MAP_FIELDS.map((field) => ({ label: field.label, value: field.required ? "Required" : "Optional" }))),
      ]),
      section("Lead equity through the employee life cycle", [
        paragraph("From role design and recruitment to development, retention, and succession, each stage offers a practical way to grow."),
        ...LEADERSHIP_STAGES.flatMap((stage) => [
          { kind: "heading" as const, level: 3 as const, text: stage.title },
          quote(stage.question),
          paragraph(stage.learn),
          callout(stage.scenario, "A situation"),
          bullets(stage.practice),
          paragraph([{ text: "Reflect: ", bold: true }, { text: stage.reflect }]),
          paragraph([{ text: "Something to carry forward: ", bold: true }, { text: `${stage.evidence} ` }, ...linkRuns({ label: stage.resourceLabel, href: stage.resource })]),
        ]),
      ]),
      section("Feedback you can use", [
        bullets([
          "What did you observe me do, and what difference did it make?",
          "Whose perspective or access did the approach make room for?",
          "Where did an assumption or a working condition get in the way?",
          "What could I try differently next time?",
        ]),
      ]),
    ]),
    sources: LEADERSHIP_SOURCES.map((source) => ({ title: source.title, href: source.href, note: source.note })),
    attribution: programName("dsd"),
  };
}
