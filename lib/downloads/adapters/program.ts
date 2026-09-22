import { prepareEditableSurface } from "@/lib/content/prepare-editable-surface";
import reference from "@/data/organization/minnesota-dhs.json";
import { DHS_REFERENCE_GROUPS } from "@/lib/content/dhs-reference";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { loadStaffContentSnapshot, type StaffProgramScope } from "@/lib/content/staff-publications";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { getDomain, ROLE_FAMILY_LABEL } from "@/lib/domains";
import { applyDomainValues, domainSurfaceId } from "@/lib/domains/surfaces";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "@/lib/dsd";
import { EQUITY_FRAMEWORK as F, TOOL_STATUS_LABEL } from "@/lib/program/equity-framework";
import { OPERATIONALIZING_EQUITY } from "@/lib/program/equity";
import { programFunctions } from "@/lib/program/model";
import { SUPPORT_SOURCES } from "@/lib/product/support-directory";
import { bullets, callout, compactSections, numbered, paragraph, section, type DocumentBlock, type ResourceDocument } from "../model";
import { kicker, linkList, linkRuns, programName } from "./shared";

export async function areaDocument(id: string, scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const source = getDomain(id);
  if (!source) return null;
  const [surface, resources, related] = await Promise.all([
    prepareEditableSurface(domainSurfaceId(source.id), { scope, includeOwner: false }),
    loadStaffContentSnapshot({ scope }),
    loadPublishedEditableSurfaces(
      scope === "dsd"
        ? [...source.dsd.scenarioIds.map((scenarioId) => `dsd-scenario.${scenarioId}`), ...DSD_PROGRAMS.filter((program) => program.domains.includes(source.id)).map((program) => `dsd-program.${program.id}`)]
        : [],
      scope,
    ),
  ]);
  if (!surface.available) return null;
  const domain = applyDomainValues(source, surface.values);
  const copy = surface.values;
  const content = new Map(resources.items.map((item) => [item.id, item]));
  const publications = new Map(related.map((item) => [item.surfaceId, item]));
  const programs = scope === "dsd" ? DSD_PROGRAMS.filter((program) => program.domains.includes(source.id) && publications.has(`dsd-program.${program.id}`)) : [];
  const scenarios = scope === "dsd" ? DSD_SCENARIOS.filter((scenario) => domain.dsd.scenarioIds.includes(scenario.id) && publications.has(`dsd-scenario.${scenario.id}`)) : [];
  const tools = domain.toolIds.flatMap((toolId) => (content.has(toolId) ? [content.get(toolId)!] : []));

  return {
    kicker: kicker(scope, `Area of work · ${domain.staffLabel}`),
    title: domain.title,
    subtitle: domain.summary,
    meta: [{ label: "Goals", value: domain.goals.join("; ") }],
    sections: compactSections([
      section(stringValue(copy, "whyTitle"), [paragraph(domain.whyItMatters)]),
      section(stringValue(copy, "questionsTitle"), [bullets(domain.firstQuestions)]),
      section(
        stringValue(copy, "tasksTitle"),
        domain.tasks.flatMap((task): DocumentBlock[] => {
          const readings = task.contentIds.flatMap((contentId) => (content.has(contentId) ? [content.get(contentId)!] : []));
          return [
            { kind: "heading", level: 3, text: task.label },
            paragraph(task.outcome),
            paragraph(`${task.roles.map((role) => ROLE_FAMILY_LABEL[role]).join(" · ")}${task.supportsRequired ? ` · ${stringValue(copy, "requiredLabel")}` : ""}`),
            ...(readings.length ? [bullets(readings.map((item) => [{ text: item.title, bold: true }, { text: ` — program page /library/${item.id}` }]))] : []),
            paragraph([{ text: "Ask: ", bold: true }, { text: task.askStarter }]),
          ];
        }),
      ),
      section(stringValue(copy, "toolsTitle"), [tools.length ? bullets(tools.map((item) => [{ text: item.title, bold: true }, { text: ` — ${item.summary}` }])) : null]),
      section(stringValue(copy, "dsdTitle"), [
        scope === "dsd" ? paragraph(domain.dsd.note) : null,
        scope === "dsd" ? bullets(domain.dsd.programs) : null,
        programs.length ? { kind: "heading", level: 3, text: stringValue(copy, "programsTitle") } : null,
        programs.length ? bullets(programs.map((program) => stringValue(publications.get(`dsd-program.${program.id}`)!.values, "title"))) : null,
        scenarios.length ? { kind: "heading", level: 3, text: stringValue(copy, "scenariosTitle") } : null,
        scenarios.length ? bullets(scenarios.map((scenario) => stringValue(publications.get(`dsd-scenario.${scenario.id}`)!.values, "title"))) : null,
      ]),
    ]),
    attribution: programName(scope),
  };
}

const pairs = (rows: ReadonlyArray<readonly [string, string]>, head: [string, string]): DocumentBlock => ({
  kind: "table",
  headers: head,
  rows: rows.map(([a, b]) => [a, b]),
});

function frameworkLinks(links: ReadonlyArray<{ label: string; href: string }>): string {
  return links.length ? links.map((link) => `${link.label} (${link.href})`).join("; ") : "Not linked yet";
}

export function equityFrameworkDocument(scope: StaffProgramScope): ResourceDocument {
  const functionsByPillar = new Map<string, string[]>();
  for (const pillar of F.pillars) for (const fn of pillar.programFunctions) functionsByPillar.set(fn, [...(functionsByPillar.get(fn) ?? []), pillar.title]);
  return {
    kicker: F.kicker,
    title: F.title,
    subtitle: F.lede,
    meta: [{ label: "Version", value: F.version }],
    sections: compactSections([
      section("What this framework is for", [paragraph(F.summary), { kind: "heading", level: 3, text: "How to read this" }, bullets(F.howToRead)]),
      section("The improvement cycle as a workflow", [
        paragraph("The framework runs as a continuous cycle: assess, plan, implement, measure, learn, improve. Move to the next stage when the people involved agree, not on a date."),
        {
          kind: "table",
          headers: ["Stage", "Question the stage answers", "Program step", "In One DHS", "In One DSD"],
          rows: F.cycle.map((stage) => [stage.stage, stage.question, stage.programStep, frameworkLinks(stage.oneDhs), frameworkLinks(stage.oneDsd)]),
        },
      ]),
      section("Vision, mission and values", [
        paragraph([{ text: "Vision: ", bold: true }, { text: F.vision }]),
        paragraph([{ text: "Mission: ", bold: true }, { text: F.mission }]),
        paragraph(F.focus),
        { kind: "table", headers: ["Core value", "Strategic meaning", "In practice"], rows: F.values.map((value) => [value.value, value.meaning, value.practice]) },
      ]),
      section(
        "Six pillars",
        F.pillars.flatMap((pillar, index): DocumentBlock[] => [
          { kind: "heading", level: 3, text: `Pillar ${index + 1}: ${pillar.title}` },
          paragraph(pillar.purpose),
          paragraph([{ text: "Strategic objectives", bold: true }]),
          bullets(pillar.objectives),
          paragraph([{ text: "Key initiatives", bold: true }]),
          bullets(pillar.initiatives),
          paragraph([{ text: "Sample measures", bold: true }]),
          bullets(pillar.measures),
          paragraph([{ text: "Areas of work: ", bold: true }, { text: frameworkLinks(pillar.workAreas) }]),
          paragraph([{ text: "In One DHS: ", bold: true }, { text: frameworkLinks(pillar.oneDhs) }]),
          paragraph([{ text: "In One DSD: ", bold: true }, { text: frameworkLinks(pillar.oneDsd) }]),
        ]),
      ),
      section("Every part of the program on the spine", [
        {
          kind: "table",
          headers: ["Program function", "Purpose", "Main page", "Pillars served"],
          rows: programFunctions.map((fn) => [fn.title, fn.purpose, fn.primaryRoute, (functionsByPillar.get(fn.id) ?? ["Accountability and improvement"]).join("; ")]),
        },
      ]),
      section("How progress is measured", [
        { kind: "table", headers: ["Measure type", "Purpose", "Examples"], rows: F.indicatorTypes.map((type) => [type.type, type.purpose, type.examples]) },
        { kind: "heading", level: 3, text: "Measurement framework by domain" },
        { kind: "table", headers: ["Domain", "Example leading indicators", "Example outcome indicators"], rows: F.measurementDomains.map(([domain, leading, outcome]) => [domain, leading, outcome]) },
        { kind: "heading", level: 3, text: "Dashboard pages" },
        pairs(F.dashboardPages, ["Page", "What it shows"]),
        { kind: "heading", level: 3, text: "Early-warning thresholds" },
        bullets(F.earlyWarning),
      ]),
      section(
        "Three stages, no calendar",
        F.stages.flatMap((stage, index): DocumentBlock[] => [
          { kind: "heading", level: 3, text: `Stage ${index + 1}: ${stage.title}` },
          paragraph(stage.aim),
          paragraph(stage.enterWhen),
          ...stage.workstreams.flatMap((workstream): DocumentBlock[] => [paragraph([{ text: workstream.title, bold: true }]), bullets(workstream.items)]),
          paragraph([{ text: "Readiness conditions", bold: true }]),
          bullets(stage.readiness),
        ]),
      ),
      section(
        "Expected outcomes",
        F.outcomes.flatMap((outcome): DocumentBlock[] => [{ kind: "heading", level: 3, text: outcome.title }, bullets(outcome.items)]),
      ),
      section("Resource and tool suite", [
        {
          kind: "table",
          headers: ["Tool or resource", "Primary users", "What it does", "Format", "In this program"],
          rows: F.coreTools.map((tool) => [tool.name, tool.users, tool.does, tool.format, `${TOOL_STATUS_LABEL[tool.status]}${tool.where.length ? `. ${frameworkLinks(tool.where)}` : ""}${tool.note ? `. ${tool.note}` : ""}`]),
        },
      ]),
      section("Governance and planning tools", [
        { kind: "heading", level: 3, text: "Strategic plan scorecard" },
        pairs(F.scorecardFields, ["Field", "Purpose"]),
        pairs(F.scorecardExample, ["Field", "Example"]),
        { kind: "heading", level: 3, text: "Equity Activity Inventory" },
        paragraph([{ text: "Fields", bold: true }]),
        bullets(F.inventoryFields),
        paragraph([{ text: "Operating rules", bold: true }]),
        bullets(F.inventoryRules),
        { kind: "heading", level: 3, text: "Governance charter" },
        bullets(F.charterSections),
        pairs(F.governanceGroups, ["Group", "Core function"]),
      ]),
      section("Equity, accessibility and decision tools", [
        { kind: "heading", level: 3, text: "Equity Analysis Toolkit" },
        numbered(F.analysisQuestions),
        pairs(F.decisionCategories, ["Decision type", "Minimum review"]),
        { kind: "heading", level: 3, text: "Accessibility review checklist" },
        pairs(F.accessibilityDomains, ["Domain", "Example review questions"]),
        bullets(F.accessibilityMinimum),
        { kind: "heading", level: 3, text: "Inclusive hiring and workforce equity toolkit" },
        pairs(F.hiringTools, ["Tool", "Use"]),
      ]),
      section("Community, learning and culture tools", [
        { kind: "heading", level: 3, text: "Community engagement toolkit" },
        bullets(F.engagementComponents),
        pairs(F.engagementPlanning, ["Planning element", "Key question"]),
        { kind: "heading", level: 3, text: "Learning and development toolkit" },
        { kind: "table", headers: ["Level", "Audience", "Purpose", "Suggested topics"], rows: F.learningLevels.map(([level, audience, purpose, topics]) => [level, audience, purpose, topics]) },
        pairs(F.learningEvaluation, ["Part", "Question"]),
        bullets(F.applicationQuestions),
        { kind: "heading", level: 3, text: "Culture and inclusion survey" },
        paragraph(F.surveyRule),
        bullets(F.surveyDomains),
        bullets(F.surveyItems),
      ]),
      section("Reporting tools", [
        paragraph([{ text: "Progress report", bold: true }]),
        bullets(F.progressReport),
        paragraph([{ text: "Public accountability report", bold: true }]),
        bullets(F.publicReport),
      ]),
      section("Digital tools and professional safeguards", [
        paragraph(F.digitalToolsRule),
        { kind: "table", headers: ["Digital tool", "Use", "Who checks it"], rows: F.digitalTools.map(([tool, use, safeguard]) => [tool, use, safeguard]) },
      ]),
      section(
        "Resource library structure",
        F.library.flatMap(([group, items]): DocumentBlock[] => [{ kind: "heading", level: 3, text: group }, bullets([...items])]),
      ),
      section("Minimum launch package", [
        numbered(F.launchPackage.map((tool) => `${tool.name} (${TOOL_STATUS_LABEL[tool.status].toLowerCase()})`)),
        callout(F.designPrinciple),
      ]),
      section("Notes", [numbered([...F.notes])]),
      section("Bibliography", [bullets([...F.bibliography])]),
    ]),
    attribution: programName(scope),
  };
}

export function operationalizingEquityDocument(scope: StaffProgramScope): ResourceDocument {
  return {
    kicker: kicker(scope, "Program foundation"),
    title: "Operationalizing equity",
    subtitle: "Connecting equity to everyday decisions, workplace practices, policies and services.",
    meta: [{ label: "Version", value: OPERATIONALIZING_EQUITY.version }],
    sections: compactSections([
      section("A shared understanding", [paragraph(OPERATIONALIZING_EQUITY.definition), paragraph(OPERATIONALIZING_EQUITY.basis)]),
      section("Questions that help move the work forward", [numbered([...OPERATIONALIZING_EQUITY.practiceQuestions])]),
      section("How the program applies this", [bullets([...OPERATIONALIZING_EQUITY.applicationRules])]),
    ]),
    sources: OPERATIONALIZING_EQUITY.sources.map((source) => ({ title: source.title, href: source.url, note: `Checked ${source.checkedOn}.` })),
    attribution: programName(scope),
  };
}

export function understandingDhsDocument(scope: StaffProgramScope): ResourceDocument {
  const sources = new Map(reference.sources.map((source) => [source.id, source]));
  return {
    kicker: kicker(scope, "Reference"),
    title: "Understanding DHS",
    subtitle: "People, programs and partnerships across Minnesota DHS, with a closer look at Disability Services and the work we share.",
    meta: [{ label: "Sources reviewed", value: reference.checkedOn }],
    sections: compactSections(
      DHS_REFERENCE_GROUPS.map((group) =>
        section(
          group.title,
          group.entries.flatMap((entry): DocumentBlock[] => [
            { kind: "heading", level: 3, text: entry.title },
            paragraph(entry.facts),
            paragraph([{ text: "Related teams and partners: ", bold: true }, { text: entry.units.join("; ") }]),
            linkList(entry.sourceIds.flatMap((sourceId) => (sources.has(sourceId) ? [{ label: sources.get(sourceId)!.title, href: sources.get(sourceId)!.url }] : []))) ?? paragraph(""),
          ]),
        ),
      ),
    ),
    attribution: programName(scope),
  };
}

export function supportDirectoryDocument(scope: StaffProgramScope): ResourceDocument {
  return {
    kicker: kicker(scope, "Find support"),
    title: "DHS offices and guidance",
    subtitle: "Find a useful starting point for your question, with separate guidance for workplace needs, public services and program responsibilities.",
    meta: [],
    sections: compactSections([
      section(undefined, [paragraph("These DHS pages can help you find an office or understand a process. Your team may have a specific contact for the next step.")]),
      ...SUPPORT_SOURCES.map((source) =>
        section(source.label, [
          paragraph(source.audience),
          paragraph(`${source.purpose} ${source.limitation}`),
          paragraph(linkRuns({ label: source.label, href: source.href })),
          paragraph(
            `Published by ${source.publisher}. Link and subject checked ${source.checkedOn}.${source.sourceDate ? ` The source identifies its date as ${source.sourceDate}.` : " No publication date is stated."}`,
          ),
        ]),
      ),
    ]),
    attribution: programName(scope),
  };
}
