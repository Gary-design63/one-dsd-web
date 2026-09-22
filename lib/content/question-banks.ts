/**
 * Program Embed Advisor content: launch-type question banks, equity-impact questions,
 * journey/burden prompts, and approved involvement roles.
 * The owner-approved template set is an open question (Ask contract §10.4); these are the
 * proposed standard launch types, marked for owner sign-off in docs/DECISIONS.md.
 */

export type LaunchType =
  | "digital_application"
  | "program_service"
  | "policy_rule"
  | "form_notice"
  | "procurement_contract"
  | "engagement_effort"
  | "technology_data"
  | "budget_decision"
  | "facilitation_session"
  | "climate_effort";

export const LAUNCH_TYPE_LABEL: Record<LaunchType, string> = {
  digital_application: "Digital application or online service",
  program_service: "New program or service concept",
  policy_rule: "Policy or rule change",
  form_notice: "Form, notice, or letter change",
  procurement_contract: "Procurement or contract",
  engagement_effort: "Community engagement or co-design",
  technology_data: "Technology or data change",
  budget_decision: "Budget decision",
  facilitation_session: "Learning or facilitation session",
  climate_effort: "Team climate effort",
};

export type Stage = "conceptual" | "designing" | "launching" | "live_change";

export const STAGE_LABEL: Record<Stage, string> = {
  conceptual: "Early idea",
  designing: "In design",
  launching: "Preparing to launch",
  live_change: "Updating existing work",
};

export type QuestionCategory =
  | "purpose_and_people"
  | "access"
  | "language"
  | "process_burden"
  | "data_evidence"
  | "partners"
  | "decision_owner"
  | "review";

export const CATEGORY_LABEL: Record<QuestionCategory, string> = {
  purpose_and_people: "Purpose and who is affected",
  access: "Disability and communication access",
  language: "Language access",
  process_burden: "Steps, time, and effort",
  data_evidence: "Data and evidence",
  partners: "Partners and lived experience",
  decision_owner: "Decision owner and authority",
  review: "Review and follow-through",
};

export type EmbedQuestion = {
  id: string;
  category: QuestionCategory;
  text: string;
  stages: Stage[];
  launchTypes: LaunchType[] | "all";
};

const ALL_STAGES: Stage[] = ["conceptual", "designing", "launching", "live_change"];
const EARLY: Stage[] = ["conceptual", "designing"];
const LATE: Stage[] = ["designing", "launching", "live_change"];

export const EMBED_QUESTIONS: EmbedQuestion[] = [
  { id: "q-purpose-1", category: "purpose_and_people", text: "Who is this for, and who will carry the burden if it goes wrong?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-purpose-2", category: "purpose_and_people", text: "Which communities are least likely to have been included in the design?", stages: EARLY, launchTypes: "all" },
  { id: "q-purpose-3", category: "purpose_and_people", text: "What result would show that this reduced a disparity instead of shifting it elsewhere?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-purpose-4", category: "purpose_and_people", text: "What happens to a person who cannot complete this path? Is there a staffed human alternative?", stages: ALL_STAGES, launchTypes: ["digital_application", "program_service", "form_notice", "technology_data"] },
  { id: "q-access-1", category: "access", text: "Can someone complete every step with a screen reader, keyboard only, or magnification?", stages: LATE, launchTypes: ["digital_application", "technology_data", "form_notice", "facilitation_session"] },
  { id: "q-access-2", category: "access", text: "Is there an equally effective way to take part by phone, in person, or on paper?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-access-3", category: "access", text: "Do the documents meet the accessible-document standard before anyone has to request an accessible version?", stages: LATE, launchTypes: "all" },
  { id: "q-access-4", category: "access", text: "What reading level is the text, and has someone outside the team read it?", stages: LATE, launchTypes: ["form_notice", "policy_rule", "digital_application", "program_service"] },
  { id: "q-access-5", category: "access", text: "How will captioning, interpreting, and alternate formats be arranged before the session rather than on request?", stages: ALL_STAGES, launchTypes: ["facilitation_session", "engagement_effort"] },
  { id: "q-lang-1", category: "language", text: "Which languages will people need, and which documents are vital enough to require translation and human review?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-lang-2", category: "language", text: "How does a person reach a qualified interpreter at the point of contact, not after a failed attempt?", stages: LATE, launchTypes: "all" },
  { id: "q-lang-3", category: "language", text: "Is the interpreter request specific enough: dialect, gender match when requested, and mode?", stages: ["launching", "live_change"], launchTypes: ["program_service", "engagement_effort", "facilitation_session"] },
  { id: "q-burden-1", category: "process_burden", text: "How many steps, documents, and visits does this take from the person's side? Which can be removed?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-burden-2", category: "process_burden", text: "Where does a deadline, a mailed notice, or an office-hours rule become the real eligibility rule?", stages: ALL_STAGES, launchTypes: ["policy_rule", "form_notice", "program_service", "digital_application"] },
  { id: "q-burden-3", category: "process_burden", text: "What does a person need to already have (broadband, a car, a printer, time off work) to comply?", stages: EARLY, launchTypes: "all" },
  { id: "q-data-1", category: "data_evidence", text: "What do we already know about who uses or is denied the current version, by community, language, disability, and place?", stages: EARLY, launchTypes: "all" },
  { id: "q-data-2", category: "data_evidence", text: "What community knowledge is missing, and how can we learn without asking people to relive trauma unnecessarily?", stages: EARLY, launchTypes: "all" },
  { id: "q-data-3", category: "data_evidence", text: "Which findings describe a pattern, which show a relationship, and which truly support cause and effect? Keep those claims separate.", stages: LATE, launchTypes: "all" },
  { id: "q-partners-1", category: "partners", text: "Who should be involved before the design is fixed, and what authority or compensation do they have?", stages: EARLY, launchTypes: "all" },
  { id: "q-partners-2", category: "partners", text: "Does this touch a Tribal Nation, Native children, Tribal data, services, or land? If yes, consultation is government-to-government and comes first.", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-partners-3", category: "partners", text: "Which Equity Director or administration steward should know about this now?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-partners-4", category: "partners", text: "How will people who took part hear back about what changed?", stages: ALL_STAGES, launchTypes: ["engagement_effort", "program_service", "policy_rule"] },
  { id: "q-owner-1", category: "decision_owner", text: "Who is responsible for the decision, and which rights, rules, and obligations set its limits?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-owner-2", category: "decision_owner", text: "What in this procurement or contract supports accessible, language-ready, community-informed work, and what creates barriers to it?", stages: ALL_STAGES, launchTypes: ["procurement_contract", "budget_decision"] },
  { id: "q-owner-3", category: "decision_owner", text: "If a rule or policy must stand, what can still change in the process around it?", stages: ALL_STAGES, launchTypes: ["policy_rule", "form_notice"] },
  { id: "q-review-1", category: "review", text: "Who owns each follow-up, and what is the next review date?", stages: ALL_STAGES, launchTypes: "all" },
  { id: "q-review-2", category: "review", text: "What would make us stop, redesign, or escalate after launch?", stages: ["launching", "live_change"], launchTypes: "all" },
  { id: "q-review-3", category: "review", text: "What is the application task participants leave with, and how will you know it was used?", stages: ALL_STAGES, launchTypes: ["facilitation_session"] },
  { id: "q-review-4", category: "review", text: "Which observable team practices change, who owns them, and when is the follow-up conversation?", stages: ALL_STAGES, launchTypes: ["climate_effort"] },
];

export function questionBank(opts: { launchType?: LaunchType; stage?: Stage; max?: number }): EmbedQuestion[] {
  const out = EMBED_QUESTIONS.filter((q) => {
    const typeOk = !opts.launchType || q.launchTypes === "all" || q.launchTypes.includes(opts.launchType);
    const stageOk = !opts.stage || q.stages.includes(opts.stage);
    return typeOk && stageOk;
  });
  return opts.max ? out.slice(0, opts.max) : out;
}

/** Equity impact questions for policy, budget, technology, and procurement framing (embed.equity_impact_qs). */
export const EQUITY_IMPACT_QUESTIONS: Array<{ frame: "policy" | "budget" | "technology" | "procurement"; text: string }> = [
  { frame: "policy", text: "What authority, rights, and obligations apply, and what is the enforceable floor?" },
  { frame: "policy", text: "Who benefits, who carries the burden, who faces risk, and who is missing from the table?" },
  { frame: "policy", text: "Which assumptions, rules, and routines shape who is affected?" },
  { frame: "policy", text: "What can we change, redesign, or escalate, and what must stay with the responsible official?" },
  { frame: "budget", text: "Which line items fund access (interpreting, translation, accessible formats, community compensation) and which assume it is free?" },
  { frame: "budget", text: "If this budget shrinks, whose service is cut first, and is that a stated choice?" },
  { frame: "technology", text: "Is accessibility a requirement in the specification, with testing by people who use assistive technology?" },
  { frame: "technology", text: "What data is collected, who can see it, and could it be used to rank or profile people? If so, pause the work and seek human review." },
  { frame: "procurement", text: "Do the evaluation criteria reward accessible, language-ready, community-informed delivery?" },
  { frame: "procurement", text: "Which vendors, community organizations, and small providers are structurally excluded by the process itself?" },
];

/** Journey and process-burden prompts (embed.journey_burden_prompts). */
export const JOURNEY_BURDEN_PROMPTS: string[] = [
  "Walk the path as a person, not a process: first contact, each document, each wait, each decision, each notice.",
  "Note every point where a person must already know something the instructions never explain.",
  "Mark every point where a mailed letter, a deadline, a login, or office hours becomes the real rule.",
  "Count the trips, the documents, the phone calls, and the hours off work. Name which could be removed.",
  "Ask what happens to a person who cannot read the notice, cannot use the website, or cannot reach a phone line.",
  "Ask who is left carrying the burden when the process breaks down: the person, a family member, a county worker, or a community organization.",
  "Name the human alternative at each step and whether it is available, staffed, and clearly explained.",
];

/** Approved involvement roles for stakeholder maps and community "who to involve" lists. Curated, not scraped. */
export type InvolvementRole = {
  id: string;
  label: string;
  when: string;
  gate?: "tribal" | "hr";
};

export const INVOLVEMENT_ROLES: InvolvementRole[] = [
  { id: "equity_director", label: "Equity Director or administration equity steward", when: "Any launch, policy, or engagement in their administration." },
  { id: "accessibility_coordinator", label: "Accessibility or ADA coordinator", when: "Anything with documents, technology, meetings, or physical space." },
  { id: "language_access", label: "Language access coordinator or interpreter services", when: "Any public-facing contact, notice, or vital document." },
  { id: "communications", label: "Communications and plain-language reviewer", when: "Notices, letters, web content, and campaigns." },
  { id: "policy_owner", label: "Policy, legal, or rules owner", when: "If Official sources conflict or a rule needs interpretation." },
  { id: "community_partner", label: "Community partner organization named in the relevant brief", when: "Engagement, outreach, and co-design; with purpose, authority, compensation, and report-back agreed." },
  { id: "lived_experience", label: "Established lived-experience advisory channel", when: "Design decisions that affect people's daily access; never to extract trauma." },
  { id: "procurement", label: "Procurement and contracts staff", when: "Contracts, grants, and vendor requirements." },
  { id: "county_provider", label: "County or provider partners", when: "Anything counties or providers will operate." },
  { id: "indian_policy", label: "Office of Indian Policy or Tribal liaison", when: "Any work touching a Tribal Nation, Native children, Tribal data, services, or land. Consultation is government-to-government and comes first.", gate: "tribal" },
  { id: "employee_culture", label: "Employee Culture, Human Resources, or civil-rights channel", when: "Complaints, investigations, accommodation, discipline, and personnel decisions belong in one of these formal channels rather than this program.", gate: "hr" },
  { id: "practice_owner", label: "Equity and Inclusion Operations Consultant", when: "When you would like to talk through an early program idea or a high-stakes equity question after using the available guidance." },
];

export function involvementRoles(ids: string[]): InvolvementRole[] {
  return ids.map((id) => INVOLVEMENT_ROLES.find((r) => r.id === id)).filter((r): r is InvolvementRole => Boolean(r));
}
