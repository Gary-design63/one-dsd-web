/** The nine launch-critical work areas in BUILD_EXECUTION.md section 6. */

export const RESPONSIBLE_DESTINATION_IDS = [
  "supervisor_or_manager",
  "administration_equity_director",
  "equity_specialist",
  "policy_or_program_owner",
  "human_resources",
  "accessibility_or_language_access_lead",
  "procurement_or_contract_office",
  "data_or_quality_lead",
  "community_engagement_lead",
  "civil_rights_channel",
  "office_of_indian_policy_or_tribal_liaison",
  "communications_or_public_information_office",
] as const;

export type ResponsibleDestinationId = (typeof RESPONSIBLE_DESTINATION_IDS)[number];

export type WorkAreaDefinition = Readonly<{
  id: string;
  label: string;
  summary: string;
  tasks: readonly string[];
  responsibleDestinations: readonly ResponsibleDestinationId[];
}>;

export const WORK_AREAS = [
  {
    id: "workforce_equity",
    label: "Workforce equity",
    summary: "Build fair opportunities and working conditions across the employee experience.",
    tasks: [
      "Design a position and its qualifications",
      "Review recruitment, selection, onboarding, pay, or classification",
      "Plan advancement, sponsorship, stay conversations, retention, or exit learning",
    ],
    responsibleDestinations: [
      "supervisor_or_manager",
      "human_resources",
      "administration_equity_director",
      "equity_specialist",
    ],
  },
  {
    id: "policy_program_service_design",
    label: "Policy, program, and service design",
    summary: "Shape decisions and services with attention to access, burden, resources, and real-world effects.",
    tasks: [
      "Complete an equity scan or analysis",
      "Review a policy, form, notice, budget, or service design",
      "Plan implementation and a useful review cycle",
    ],
    responsibleDestinations: [
      "policy_or_program_owner",
      "supervisor_or_manager",
      "administration_equity_director",
      "equity_specialist",
    ],
  },
  {
    id: "community_engagement_co_design",
    label: "Community engagement and co-design",
    summary: "Plan respectful participation, shared influence, access, feedback, and lasting relationships.",
    tasks: [
      "Plan engagement, listening, outreach, or co-design",
      "Consider compensation, language, access, and feedback loops",
      "Follow the separate Tribal consultation process when it applies",
    ],
    responsibleDestinations: [
      "community_engagement_lead",
      "office_of_indian_policy_or_tribal_liaison",
      "administration_equity_director",
      "equity_specialist",
      "supervisor_or_manager",
    ],
  },
  {
    id: "accessibility_language_access",
    label: "Accessibility and language access",
    summary: "Make information, services, meetings, and media usable across disability and language needs.",
    tasks: [
      "Review a document, digital service, meeting, or multimedia item",
      "Plan interpretation, translation, or vital-document access",
      "Identify when an accommodation decision needs its formal channel",
    ],
    responsibleDestinations: [
      "accessibility_or_language_access_lead",
      "human_resources",
      "civil_rights_channel",
      "supervisor_or_manager",
      "administration_equity_director",
      "equity_specialist",
    ],
  },
  {
    id: "culture_trust_repair",
    label: "Culture, trust, and repair",
    summary: "Strengthen belonging, psychological safety, intercultural practice, and accountable repair.",
    tasks: [
      "Improve a meeting, team norm, or participation practice",
      "Work through power, conflict, harm, or repair",
      "Know when a concern belongs in a formal civil-rights or personnel channel",
    ],
    responsibleDestinations: [
      "supervisor_or_manager",
      "administration_equity_director",
      "equity_specialist",
      "civil_rights_channel",
    ],
  },
  {
    id: "leadership_systems_change",
    label: "Leadership and systems change",
    summary: "Connect everyday leadership choices to accountability, resources, governance, and durable change.",
    tasks: [
      "Plan supervision, sponsorship, or team accountability",
      "Analyze a structural barrier or change effort",
      "Build governance, resources, and continuity into the work",
    ],
    responsibleDestinations: [
      "supervisor_or_manager",
      "administration_equity_director",
      "equity_specialist",
      "policy_or_program_owner",
    ],
  },
  {
    id: "data_research_quality_measurement",
    label: "Data, research, quality, and measurement",
    summary: "Ask useful questions and learn from evidence without exposing small groups or measuring people as ideology.",
    tasks: [
      "Choose a useful question, denominator, and disaggregation",
      "Combine quantitative, qualitative, and community-informed evidence",
      "Protect small groups and design a practical learning loop",
    ],
    responsibleDestinations: [
      "data_or_quality_lead",
      "policy_or_program_owner",
      "administration_equity_director",
      "equity_specialist",
      "supervisor_or_manager",
    ],
  },
  {
    id: "fiscal_grants_procurement_contracts",
    label: "Fiscal, grants, procurement, and contracts",
    summary: "Design requirements and oversight that reduce unnecessary burden and widen fair access and benefit.",
    tasks: [
      "Review a grant, solicitation, requirement, or contract",
      "Consider vendor access, community benefit, and administrative burden",
      "Plan monitoring and equitable implementation",
    ],
    responsibleDestinations: [
      "procurement_or_contract_office",
      "policy_or_program_owner",
      "administration_equity_director",
      "equity_specialist",
      "supervisor_or_manager",
    ],
  },
  {
    id: "communications_public_information",
    label: "Communications and public information",
    summary: "Help people find, understand, and use information through the right language, format, and channel.",
    tasks: [
      "Write or review public information in plain language",
      "Plan accessibility, language access, cultural context, and channel fit",
      "Create a way for people to respond and improve the communication",
    ],
    responsibleDestinations: [
      "communications_or_public_information_office",
      "accessibility_or_language_access_lead",
      "administration_equity_director",
      "equity_specialist",
      "supervisor_or_manager",
    ],
  },
] as const satisfies readonly WorkAreaDefinition[];

export type WorkAreaId = (typeof WORK_AREAS)[number]["id"];

const WORK_AREA_BY_ID = new Map<WorkAreaId, WorkAreaDefinition>(
  WORK_AREAS.map((area) => [area.id, area]),
);

export function getWorkArea(id: WorkAreaId): WorkAreaDefinition {
  const area = WORK_AREA_BY_ID.get(id);
  if (!area) throw new Error("Choose an available area of work.");
  return area;
}
