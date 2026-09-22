import { prepareEditableSurface } from "@/lib/content/prepare-editable-surface";
import { MEASUREMENT_FIELD_IDS, MEASUREMENT_RESOURCE_ID, measurementText } from "@/lib/content/measurement-practice";
import { getPath } from "@/lib/content/paths";
import { loadStaffContentSnapshot, type StaffProgramScope } from "@/lib/content/staff-publications";
import { applyGraduationPathValues, graduationPathSurfaceId, stringValue } from "@/lib/content/staff-surface-registry";
import { bullets, callout, compactSections, fields, paragraph, section, type InlineRun, type ResourceDocument } from "../model";
import { kicker, linkRuns, programName } from "./shared";

export async function pathDocument(id: string, scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const raw = getPath(id);
  if (!raw) return null;
  const [pathSurface, shellSurface] = await Promise.all([
    prepareEditableSurface(graduationPathSurfaceId(id), { scope, includeOwner: false }),
    prepareEditableSurface("practice.path-shell", { scope, includeOwner: false }),
  ]);
  if (!pathSurface.available || !shellSurface.available) return null;
  const path = applyGraduationPathValues(raw, pathSurface.values);
  const shell = shellSurface.values;
  const outcomeLead = /^By the end\b/i.test(path.graduatedLooksLike) ? "" : `${stringValue(shell, "outcomeLead")}: `;

  return {
    kicker: kicker(scope, `${stringValue(shell, "introKicker")} · ${path.staffLabel}`),
    title: path.title,
    subtitle: path.startingCompetence,
    meta: [{ label: "Outcome", value: `${outcomeLead}${path.graduatedLooksLike}` }],
    sections: compactSections([
      section("Situations that may fit this path", [bullets(path.signals)]),
      section(stringValue(shell, "stepsTitle"), [
        {
          kind: "list",
          ordered: true,
          items: path.steps.map((step): InlineRun[] => [
            { text: step.title, bold: true },
            ...(step.required ? [{ text: ` (${stringValue(shell, "requiredLabel")})` }] : step.optional ? [{ text: ` (${stringValue(shell, "optionalLabel")})` }] : []),
            { text: ` — ${step.guidance}` },
            ...step.links.flatMap((link) => [{ text: " · " }, ...linkRuns(link)]),
          ]),
        },
      ]),
      section(stringValue(shell, "meaningTitle"), [
        { kind: "heading", level: 3, text: stringValue(shell, "needsWorkLabel") },
        bullets(path.antiPerformative.fake),
        { kind: "heading", level: 3, text: stringValue(shell, "readyLabel") },
        bullets(path.antiPerformative.real),
        callout(path.privacy, stringValue(shell, "privacyLabel")),
        path.hrWall ? callout(stringValue(shell, "confidentialRouteNote")) : null,
      ]),
      section(path.artifactTitle, [
        callout(stringValue(shell, "artifactPrivacy"), "Privacy"),
        fields(path.artifactFields.map((field) => ({ label: `${field.label}${field.required ? " (required)" : ""}`, value: field.help || " " }))),
        { kind: "heading", level: 3, text: "Review your notes against" },
        bullets(path.rubric.map((rule) => rule.label)),
      ]),
      section("Questions to bring to Ask", [bullets(path.askStarters)]),
    ]),
    attribution: programName(scope),
  };
}

export async function measurementDocument(scope: StaffProgramScope): Promise<ResourceDocument | null> {
  const [surface, snapshot] = await Promise.all([
    prepareEditableSurface("practice.measurement", { scope, includeOwner: false }),
    loadStaffContentSnapshot({ scope }),
  ]);
  const source = snapshot.items.find((item) => item.id === MEASUREMENT_RESOURCE_ID);
  if (!surface.available || !source) return null;
  const copy = surface.values;
  return {
    kicker: kicker(scope, "Evaluation plan worksheet"),
    title: measurementText(copy, "title"),
    subtitle: measurementText(copy, "intro"),
    meta: [{ label: "Practice note", value: source.title }],
    sections: compactSections([
      section(measurementText(copy, "notesTitle"), [
        callout(measurementText(copy, "privacy"), "Privacy"),
        paragraph("Use the guidance under each heading to write your own plan. Keep program-level examples and responsible roles; leave out names and confidential details."),
        fields(MEASUREMENT_FIELD_IDS.map((id) => ({ label: measurementText(copy, `${id}Label`), value: measurementText(copy, `${id}Help`) }))),
      ]),
      section("Read the practice note", [paragraph([{ text: source.title, bold: true }, { text: ` — program page /library/${source.id}` }])]),
    ]),
    attribution: programName(scope),
  };
}
