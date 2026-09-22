import {
  contextLineage,
  resolveProductContext,
  type ProductContextId,
} from "./federation";
import { getWorkArea, WORK_AREAS, type WorkAreaDefinition, type WorkAreaId } from "./work-areas";

export type StartRoleDefinition = Readonly<{
  id: string;
  label: string;
  guidance: string;
}>;

export const START_ROLES = [
  {
    id: "staff_member",
    label: "Staff member",
    guidance: "Use the examples and tools closest to the work you are doing.",
  },
  {
    id: "supervisor_or_manager",
    label: "Supervisor or manager",
    guidance: "Consider both the decision and how staff and communities will experience it.",
  },
  {
    id: "policy_program_or_service_professional",
    label: "Policy, program, or service professional",
    guidance: "Bring equity and access into the work while there is still room to shape it.",
  },
  {
    id: "workforce_or_human_resources_professional",
    label: "Workforce or Human Resources professional",
    guidance: "Look across the employee experience, including barriers that may not be visible in one decision.",
  },
  {
    id: "community_engagement_professional",
    label: "Community engagement professional",
    guidance: "Clarify who can influence the work and how people will know what happened with their input.",
  },
  {
    id: "accessibility_or_language_access_professional",
    label: "Accessibility or language access professional",
    guidance: "Plan for access early enough to shape the experience, not only the final format.",
  },
  {
    id: "data_research_or_quality_professional",
    label: "Data, research, or quality professional",
    guidance: "Use evidence to answer a decision question while protecting people and small groups.",
  },
  {
    id: "fiscal_procurement_or_contracts_professional",
    label: "Fiscal, procurement, or contracts professional",
    guidance: "Consider who can meet the requirements, who carries the burden, and who benefits.",
  },
  {
    id: "communications_professional",
    label: "Communications professional",
    guidance: "Help people find, understand, and act on the information in the form they need.",
  },
  {
    id: "equity_director_or_specialist",
    label: "Equity Director or Equity Specialist",
    guidance: "Connect the immediate task to the wider program, responsible partners, and durable follow-through.",
  },
  {
    id: "another_role",
    label: "Another role",
    guidance: "Choose the area closest to your next decision; you can change direction as you learn more.",
  },
] as const satisfies readonly StartRoleDefinition[];

export type StartRoleId = (typeof START_ROLES)[number]["id"];

export type StartUrgencyDefinition = Readonly<{
  id: string;
  label: string;
  guidance: string;
}>;

export const START_URGENCIES = [
  {
    id: "exploratory",
    label: "I’m planning ahead",
    guidance: "You have room to review sources, involve people early, and shape the work before decisions harden.",
  },
  {
    id: "within_2_weeks",
    label: "I need support within two weeks",
    guidance: "Begin with the next decision and identify who needs to be involved before the two-week point.",
  },
  {
    id: "hard_deadline",
    label: "I have a firm deadline",
    guidance: "Name the deadline and the decision that must be made, and leave time for responsible review.",
  },
  {
    id: "live_urgent",
    label: "The work is already in use and needs prompt attention",
    guidance: "Focus first on the immediate effect, who may be affected, and the responsible person who can act.",
  },
] as const satisfies readonly StartUrgencyDefinition[];

export type StartUrgencyId = (typeof START_URGENCIES)[number]["id"];

export type StartIntake = Readonly<{
  contextPreference?: ProductContextId;
  role: StartRoleId;
  task: WorkAreaId;
  urgency: StartUrgencyId;
}>;

export type StartIntakeIssue = Readonly<{
  field: "contextPreference" | "role" | "task" | "urgency";
  message: string;
}>;

export type StartIntakeValidation =
  | Readonly<{ ok: true; value: StartIntake }>
  | Readonly<{ ok: false; issues: readonly StartIntakeIssue[] }>;

export type StartRecommendation = Readonly<{
  context: ProductContextId;
  lineage: readonly ProductContextId[];
  basis: Readonly<Pick<StartIntake, "role" | "task" | "urgency">>;
  role: StartRoleDefinition;
  workArea: WorkAreaDefinition;
  urgency: StartUrgencyDefinition;
  heading: string;
  guidance: string;
  nextStepLabel: string;
}>;

const ROLE_IDS = new Set<string>(START_ROLES.map((role) => role.id));
const TASK_IDS = new Set<string>(WORK_AREAS.map((area) => area.id));
const URGENCY_IDS = new Set<string>(START_URGENCIES.map((urgency) => urgency.id));

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function validateStartIntake(input: unknown): StartIntakeValidation {
  const candidate = record(input);
  if (!candidate) {
    return {
      ok: false,
      issues: [
        { field: "role", message: "Choose the role closest to your work." },
        { field: "task", message: "Choose the area closest to your task." },
        { field: "urgency", message: "Choose when you need to act." },
      ],
    };
  }

  const issues: StartIntakeIssue[] = [];
  if (candidate.contextPreference !== undefined
    && !["one_dhs", "one_dsd"].includes(String(candidate.contextPreference))) {
    issues.push({ field: "contextPreference", message: "Choose One DHS or One DSD." });
  }
  if (!ROLE_IDS.has(String(candidate.role))) {
    issues.push({ field: "role", message: "Choose the role closest to your work." });
  }
  if (!TASK_IDS.has(String(candidate.task))) {
    issues.push({ field: "task", message: "Choose the area closest to your task." });
  }
  if (!URGENCY_IDS.has(String(candidate.urgency))) {
    issues.push({ field: "urgency", message: "Choose when you need to act." });
  }
  if (issues.length > 0) return { ok: false, issues };

  return {
    ok: true,
    value: {
      contextPreference: resolveProductContext(candidate.contextPreference),
      role: candidate.role as StartRoleId,
      task: candidate.task as WorkAreaId,
      urgency: candidate.urgency as StartUrgencyId,
    },
  };
}

function getStartRole(id: StartRoleId): StartRoleDefinition {
  const role = START_ROLES.find((candidate) => candidate.id === id);
  if (!role) throw new Error("Choose the role closest to your work.");
  return role;
}

function getStartUrgency(id: StartUrgencyId): StartUrgencyDefinition {
  const urgency = START_URGENCIES.find((candidate) => candidate.id === id);
  if (!urgency) throw new Error("Choose when you need to act.");
  return urgency;
}

export function buildStartRecommendation(input: StartIntake): StartRecommendation {
  const validation = validateStartIntake(input);
  if (!validation.ok) {
    throw new Error(validation.issues.map((issue) => issue.message).join(" "));
  }

  const context = resolveProductContext(validation.value.contextPreference);
  const role = getStartRole(validation.value.role);
  const workArea = getWorkArea(validation.value.task);
  const urgency = getStartUrgency(validation.value.urgency);
  return Object.freeze({
    context,
    lineage: contextLineage(context),
    basis: {
      role: validation.value.role,
      task: validation.value.task,
      urgency: validation.value.urgency,
    },
    role,
    workArea,
    urgency,
    heading: `Start with ${workArea.label}.`,
    guidance: `${role.guidance} ${urgency.guidance}`,
    nextStepLabel: "Explore this area of work",
  });
}
