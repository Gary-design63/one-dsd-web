import type { ProductContextId } from "./federation";
import {
  buildStartRecommendation,
  type StartIntake,
  type StartRoleId,
  type StartUrgencyDefinition,
} from "./start";
import {
  type ResponsibleDestinationId,
  type WorkAreaDefinition,
} from "./work-areas";

export type SupportDestination = Readonly<{
  id: ResponsibleDestinationId;
  label: string;
  description: string;
  category: "supervisor" | "equity_director" | "equity_specialist" | "office_or_lead" | "formal_channel";
}>;

export const SUPPORT_DESTINATIONS = [
  {
    id: "supervisor_or_manager",
    label: "Your supervisor or manager",
    description: "Start here when the next step depends on your team, role, workload, or decision authority.",
    category: "supervisor",
  },
  {
    id: "administration_equity_director",
    label: "Your administration Equity Director",
    description: "Contact the Equity Director responsible for the administration where the work sits.",
    category: "equity_director",
  },
  {
    id: "equity_specialist",
    label: "An Equity Specialist supporting your area",
    description: "Ask for practical equity support connected to the program, service, or decision.",
    category: "equity_specialist",
  },
  {
    id: "policy_or_program_owner",
    label: "The responsible policy or program owner",
    description: "Use the person or team with authority for the policy, program, service, or implementation decision.",
    category: "office_or_lead",
  },
  {
    id: "human_resources",
    label: "Human Resources",
    description: "Use the responsible Human Resources contact for workforce processes and official employment guidance.",
    category: "office_or_lead",
  },
  {
    id: "accessibility_or_language_access_lead",
    label: "The responsible accessibility or language access lead",
    description: "Use the lead or office responsible for access requirements, interpretation, translation, or accessible formats.",
    category: "office_or_lead",
  },
  {
    id: "procurement_or_contract_office",
    label: "The responsible procurement or contract office",
    description: "Use the office with authority for grant, procurement, contract, or fiscal requirements.",
    category: "office_or_lead",
  },
  {
    id: "data_or_quality_lead",
    label: "The responsible data or quality lead",
    description: "Use the lead who can confirm data definitions, protections, quality, and appropriate interpretation.",
    category: "office_or_lead",
  },
  {
    id: "community_engagement_lead",
    label: "The responsible community engagement lead",
    description: "Use the lead or office responsible for community relationships, participation, and follow-through.",
    category: "office_or_lead",
  },
  {
    id: "civil_rights_channel",
    label: "The appropriate civil-rights channel",
    description: "Use the formal channel for a complaint, investigation, discrimination concern, or protected process.",
    category: "formal_channel",
  },
  {
    id: "office_of_indian_policy_or_tribal_liaison",
    label: "The Office of Indian Policy or the responsible Tribal liaison",
    description: "Use the separate government-to-government or Tribal relations process when it applies.",
    category: "office_or_lead",
  },
  {
    id: "communications_or_public_information_office",
    label: "The responsible communications or public information office",
    description: "Use the office responsible for the message, its release, the channel, and the public response.",
    category: "office_or_lead",
  },
] as const satisfies readonly SupportDestination[];

const SUPPORT_DESTINATION_BY_ID = new Map<ResponsibleDestinationId, SupportDestination>(
  SUPPORT_DESTINATIONS.map((destination) => [destination.id, destination]),
);

export const DSD_ELIGIBILITY_OPTIONS = [
  {
    id: "not_checked",
    label: "I’m not sure whether this work is within One DSD",
    description: "Find the right person now, or confirm which division owns the work.",
  },
  {
    id: "self_attested_dsd",
    label: "This work is within the Disability Services Division",
    description: "See the people and offices responsible for this DSD work.",
  },
  {
    id: "not_dsd",
    label: "This work is outside the Disability Services Division",
    description: "You will see the responsible person or office for your area.",
  },
] as const;

export type DsdEligibilityId = (typeof DSD_ELIGIBILITY_OPTIONS)[number]["id"];

export type SupportRoutingRequest = StartIntake & Readonly<{
  dsdEligibility: DsdEligibilityId;
}>;

type SupportRouteBase = Readonly<{
  context: ProductContextId;
  contextPreferenceGrantsAccess: false;
  basis: Readonly<{
    role: StartRoleId;
    task: StartIntake["task"];
    urgency: StartIntake["urgency"];
  }>;
  workArea: WorkAreaDefinition;
  urgency: StartUrgencyDefinition;
  selfServiceLabel: string;
  timingGuidance: string;
}>;

export type RightPersonSupportRoute = SupportRouteBase & Readonly<{
  kind: "right_person";
  scope: "one_dhs";
  label: string;
  description: string;
  destinations: readonly SupportDestination[];
  dsdConsultation: null;
}>;

export type DsdConsultationSupportRoute = SupportRouteBase & Readonly<{
  kind: "dsd_consultation";
  scope: "one_dsd";
  label: string;
  description: string;
  destinations: readonly SupportDestination[];
  dsdConsultation: Readonly<{
    destination: "one_dsd_consultation_intake";
    entryStatus: "pending_eligibility_review";
    activeQueueAdmission: false;
    label: string;
  }>;
}>;

export type SupportRouteDecision = RightPersonSupportRoute | DsdConsultationSupportRoute;

export const DSD_CONSULTATION_PATH = "/support/request";
/** Staff consultation intake remains closed on the published request page. */
export const STAFF_CONSULTATION_REQUESTS_OPEN = false;

export function contextualizeSupportAction(
  action: Readonly<{ label: string; href: string }>,
  context: ProductContextId,
  intakeEnabled: boolean,
): { label: string; href: string } {
  if (!action.href.startsWith(DSD_CONSULTATION_PATH)) return { ...action };
  // Keep every staff handoff aligned with the published, closed request page.
  if (!STAFF_CONSULTATION_REQUESTS_OPEN) {
    return { label: "Find the right person or office", href: "/support/right-person" };
  }
  if (context !== "one_dsd") {
    return {
      label: "Find the right person or office",
      href: "/support/right-person",
    };
  }
  return intakeEnabled
    ? { ...action }
    : { ...action, label: "Preview a DSD consultation request" };
}

const ROLE_DESTINATION_PREFERENCE: Partial<Record<StartRoleId, ResponsibleDestinationId>> = {
  staff_member: "supervisor_or_manager",
  supervisor_or_manager: "administration_equity_director",
  policy_program_or_service_professional: "policy_or_program_owner",
  workforce_or_human_resources_professional: "human_resources",
  community_engagement_professional: "community_engagement_lead",
  accessibility_or_language_access_professional: "accessibility_or_language_access_lead",
  data_research_or_quality_professional: "data_or_quality_lead",
  fiscal_procurement_or_contracts_professional: "procurement_or_contract_office",
  communications_professional: "communications_or_public_information_office",
  another_role: "supervisor_or_manager",
};

function getSupportDestination(id: ResponsibleDestinationId): SupportDestination {
  const destination = SUPPORT_DESTINATION_BY_ID.get(id);
  if (!destination) throw new Error("Choose an available kind of support.");
  return destination;
}

function orderedDestinations(
  workArea: WorkAreaDefinition,
  role: StartRoleId,
): readonly SupportDestination[] {
  const preferred = ROLE_DESTINATION_PREFERENCE[role];
  const ids = [...workArea.responsibleDestinations];
  if (preferred && ids.includes(preferred)) {
    ids.splice(ids.indexOf(preferred), 1);
    ids.unshift(preferred);
  }
  return ids.map(getSupportDestination);
}

export function routeSupport(request: SupportRoutingRequest): SupportRouteDecision {
  if (!["not_checked", "self_attested_dsd", "not_dsd"].includes(request.dsdEligibility)) {
    throw new Error("Choose whether this work is within the Disability Services Division.");
  }

  const start = buildStartRecommendation(request);
  const destinations = orderedDestinations(start.workArea, start.basis.role);
  const base: SupportRouteBase = {
    context: start.context,
    contextPreferenceGrantsAccess: false,
    basis: start.basis,
    workArea: start.workArea,
    urgency: start.urgency,
    selfServiceLabel: "Review the guidance and tools for this area",
    timingGuidance: start.urgency.guidance,
  };

  if (start.context === "one_dsd" && request.dsdEligibility === "self_attested_dsd") {
    return Object.freeze({
      ...base,
      kind: "dsd_consultation",
      scope: "one_dsd",
      label: "Request a One DSD consultation",
      description: "Share a general request for DSD eligibility review after using the support that fits your work.",
      destinations,
      dsdConsultation: {
        destination: "one_dsd_consultation_intake",
        entryStatus: "pending_eligibility_review",
        activeQueueAdmission: false,
        label: "Send for DSD eligibility review",
      } as const,
    });
  }

  return Object.freeze({
    ...base,
    kind: "right_person",
    scope: "one_dhs",
    label: "Connect with the right person",
    description: "Start with reviewed guidance, then contact the responsible person or office when a decision needs someone with the authority to make it.",
    destinations,
    dsdConsultation: null,
  });
}
