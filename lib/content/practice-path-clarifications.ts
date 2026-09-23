import type { GraduationPath } from "./paths";

/**
 * Plain-language wording for the recovered paths GP-1 to GP-11. The recovered path source stays
 * byte-for-byte intact; these replacements are applied when a path is shown. Each replacement is
 * idempotent: the new wording never contains the phrase it replaces.
 */
const PLAIN_WORDING: ReadonlyArray<readonly [string, string]> = [
  ["It is saved in the web browser you are using", "Your notes are saved only on this computer"],
  ["Your notes are saved in the web browser you are using", "Your notes are saved only on this computer"],
  ["Progress here is saved in the web browser you are using", "Your progress here is saved only on this computer"],
  ["Progress is saved in the web browser you are using", "Your progress is saved only on this computer"],
  ["seek human guidance for high-stakes questions or conflicting Official sources", "ask the policy owner or your Equity Director about high-stakes questions or conflicting Official sources"],
  ["an available human alternative", "a person people can reach instead"],
  ["which documents need translation and human review", "which documents need translation and review by a qualified translator"],
  ["Languages, formats, the human alternative, and burden you can remove.", "Languages, formats, a person people can reach, and burden you can remove."],
  ["Plain language, accessible format, human contact, and time to respond.", "Plain language, an accessible format, a person to contact, and time to respond."],
  ["Captions by default, materials in advance, flexible participation formats.", "Captions on every time, materials in advance, flexible participation formats."],
  ["accessible cohort events by default", "cohort events that are accessible every time"],
  ["cohort events are accessible by default", "cohort events are accessible every time"],
  ["how the program will see whether sponsorship leads to assignments", "how you will know whether sponsorship leads to assignments"],
];

function plain(value: string): string {
  return PLAIN_WORDING.reduce((text, [before, after]) => text.split(before).join(after), value);
}

function plainWording(path: GraduationPath): GraduationPath {
  return { ...path,
    startingCompetence: plain(path.startingCompetence),
    graduatedLooksLike: plain(path.graduatedLooksLike),
    steps: path.steps.map(step => ({ ...step, title: plain(step.title), guidance: plain(step.guidance) })),
    artifactFields: path.artifactFields.map(field => field.id === "access_checks" && field.label === "Accessible by default"
      ? { ...field, label: "Accessible every time", help: plain(field.help) }
      : { ...field, label: plain(field.label), help: plain(field.help) }),
    rubric: path.rubric.map(rule => ({ ...rule, label: plain(rule.label), failMessage: plain(rule.failMessage) })),
    antiPerformative: { fake: path.antiPerformative.fake.map(plain), real: path.antiPerformative.real.map(plain) },
    privacy: plain(path.privacy),
  };
}

/** September 8 clarification plus plain wording; the recovered path source remains unchanged. */
export function clarifyPracticePath(input: GraduationPath): GraduationPath {
  const path = input.id === "gp-12" || input.id === "gp-13" ? input : plainWording(input);
  if (path.id !== "gp-11") return path;
  const replace = (value: string, before: string, after: string) => value === before ? after : value;
  return { ...path,
    artifactFields: path.artifactFields.map(field => {
      if (field.id === "transitions") return { ...field,
        label: replace(field.label, "Transitions and the owner of accommodations at each", "Transitions and the responsible role or office at each"),
        help: replace(field.help, "Nomination, interview, acting assignment, cohort, new team, return from leave. A named person for each.", "Nomination, interview, acting assignment, cohort, new team, return from leave. Identify the responsible role or office at each; keep individual accommodation details in the confidential process.") };
      if (field.id === "owners") return { ...field,
        label: replace(field.label, "Who owns each follow-up", "Role or office responsible for each follow-up"),
        help: replace(field.help, "", "Use roles or offices, without names or personal accommodation details.") };
      if (field.id === "involved") return { ...field,
        label: replace(field.label, "Who reviewed this and with what authority", "Reviewing roles or offices and their authority"),
        help: replace(field.help, "Division leadership, the HR partner, the Equity Director, and the disability employee resource group if there is one.", "Identify the reviewing roles or offices, such as division leadership, HR, the Equity Director, or an employee resource group. Keep individual names out of these notes.") };
      return field;
    }),
    rubric: path.rubric.map(rule => {
      if (rule.key === "owners") return { ...rule,
        label: replace(rule.label, "Every follow-up has a named owner", "Every follow-up has a responsible role or office"),
        failMessage: replace(rule.failMessage, "Please name the person responsible for each follow-up.", "Identify the role or office responsible for each follow-up.") };
      if (rule.key === "involved") return { ...rule,
        label: replace(rule.label, "You named who was involved and the role they had", "You identified the reviewing roles or offices and their authority"),
        failMessage: replace(rule.failMessage, "Please list who was involved before the decision was settled and what role or authority they had.", "List the roles or offices involved before the decision was settled and their authority.") };
      return rule;
    }),
  };
}
