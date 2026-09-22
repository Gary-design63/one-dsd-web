/** Canonical program interpretation, sourced September 8, 2026; not quoted agency policy. */
export const OPERATIONALIZING_EQUITY = {
  version: "2026-09-08.1",
  definition: "Operationalizing equity is the ongoing, participatory practice of making equity a concrete part of how work is designed, decided, resourced, carried out and reviewed. It means identifying and changing policies, procedures, practices and power relationships that create avoidable barriers or unequal opportunities, and learning with the people affected whether those changes improve access, participation and outcomes.",
  basis: "Program synthesis of the published DHS Equity Policy, Minnesota Equity Analysis Tool and GARE approach; not a verbatim agency definition or a new agency requirement.",
  practiceQuestions: [
    "What decision, process or practice is open to change, and who can influence it?",
    "Who experiences its benefits, burdens and barriers differently, and what history or structural conditions help explain that?",
    "Whose knowledge is missing, and how can affected people shape the problem and options while choices remain open?",
    "What do available evidence and lived experience establish, and what remains unknown?",
    "Which alternatives change the underlying barrier or distribution of opportunity, resources and influence?",
    "What support, skills, accessibility measures and resources make the chosen approach workable?",
    "What will change in the actual work, and who has agreed responsibility for carrying it forward?",
    "How will people learn what happened to their input, examine effects and decide whether to retain, revise or stop the approach?",
  ],
  applicationRules: [
    "Participation in One DHS/One DSD People, Access and Culture remains voluntary. Published DHS policy requirements are separate from choosing this program as support.",
    "Learning and reflection can build capability; a course completion, an answer from Ask or a checklist alone does not establish an equitable outcome.",
    "Name racial and structural inequity explicitly where relevant; also examine disability, language and other context-specific barriers without inferring an individual's needs from identity.",
    "Program operating decisions are shaped with colleagues and affected people. Do not invent their agreement, assignments, deadlines or meeting schedules.",
    "Respect responsible decision-makers and Tribal sovereignty. Program guidance cannot confer official authority or replace direct participation.",
    "Use agreed review points or meaningful reconsideration conditions; no fixed duration is required by this program definition.",
  ],
  sources: [
    { title: "DHS Equity Policy, published version 2.0, August 4, 2023", url: "https://mn.gov/dhs/assets/equity-policy_tcm1053-646921.pdf", checkedOn: "2026-09-08" },
    { title: "State of Minnesota Equity Analysis Tool", url: "https://mn.gov/oeoa/resources/equity-analysis-toolkit/", checkedOn: "2026-09-08" },
    { title: "GARE approach", url: "https://www.racialequityalliance.org/who-we-are/our-approach", checkedOn: "2026-09-08" },
  ],
} as const;
export function operationalEquityContext(question: string) {
  return /operationali[sz]|equity|equitable|racial|inclusion|access barrier|disparit/i.test(question) ? OPERATIONALIZING_EQUITY : undefined;
}
