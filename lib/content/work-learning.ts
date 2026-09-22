import { defineEditableSurface, type EditableSurfaceValues } from "./editable-surface-contract";
import type { ContentItem } from "./types";

// Program work categories, not official classifications or access roles.
export const WORK_PROFILES = [
  ["leadership", "Executive and division leadership", "Examine the effects of a proposed direction, identify who can act, and plan how to check results.", ["ext-dhs-equity-toolkit", "ja-equity-impact-questions", "pn-embed-early"]],
  ["policy", "Policy and program analysis", "Examine who benefits from a rule, where it creates burden, and what evidence could support a better alternative.", ["ext-dhs-equity-toolkit", "ja-process-burden", "ja-equity-impact-questions"]],
  ["service", "Eligibility and service delivery", "Look at the steps people must navigate, communication needs, and opportunities to make access easier.", ["ja-process-burden", "ja-access-checks", "pn-intercultural-method"]],
  ["management", "Supervision and management", "Connect fair decisions with the conditions that help staff contribute, raise concerns, and do their work well.", ["lm-workplace-climate", "ja-climate-action-plan", "ja-access-checks"]],
  ["workforce", "Hiring and workforce development", "Examine requirements, access to opportunity, and the employee experience beyond the initial hiring decision.", ["ext-dhs-equity-toolkit", "ja-equity-impact-questions", "lm-workplace-climate"]],
  ["fiscal", "Budgets, grants, and contracts", "Consider who can meet the requirements, where costs and burdens fall, and how the decision will be reviewed.", ["ja-equity-impact-questions", "ja-process-burden", "pn-embed-early"]],
  ["data", "Data, research, and quality", "Define the decision question, examine what the evidence can show, and identify whose experience may be missing.", ["ja-equity-impact-questions", "ja-stakeholder-map", "pn-self-check"]],
  ["engagement", "Community engagement and partnership", "Consider who can influence a decision, what participation requires, and how people will hear what happened next.", ["pn-partnership-spine", "ja-stakeholder-map", "pn-intercultural-method"]],
  ["communication", "Communication and accessibility", "Examine whether people can find, understand, and use information in the form they need.", ["ja-access-checks", "ja-process-burden", "pn-intercultural-method"]],
  ["equity", "Equity practice and organizational change", "Connect a specific barrier with the wider process, responsible partners, and a change that can be sustained.", ["ext-dhs-equity-toolkit", "pn-embed-early", "ja-launch-embed-checklist"]],
] as const;

export const WORK_TASKS = [
  ["review", "Review a policy or process", ["ja-process-burden", "ext-dhs-equity-toolkit", "ja-equity-impact-questions"]],
  ["meeting", "Plan a meeting or learning session", ["ja-access-checks", "ja-facilitation-session-plan", "lm-facilitation-application"]],
  ["partnership", "Involve people in a decision", ["ja-stakeholder-map", "pn-partnership-spine", "pn-intercultural-method"]],
  ["change", "Put an improvement into practice", ["pn-embed-early", "ja-launch-embed-checklist", "ja-climate-action-plan"]],
] as const;

const wording = { title: "Learning for your work", intro: "Different responsibilities call for different examples and tools. Explore a starting point that fits what you are doing today.", roleLabel: "Your area of work", taskLabel: "What are you working on?", anyRole: "Explore without choosing a role", anyTask: "Explore this area", submit: "Explore", back: "My Work", all: "All learning and resources", purposeTitle: "A useful starting point", resultsTitle: "Related learning and tools", empty: "There are no published matches for this selection yet. The full learning collection remains available.", choice: "These choices are optional. They do not change your access, and you can explore any area.", taskNote: "The task you choose comes first; related material for your area of work follows." };
export const WORK_LEARNING_SURFACE = defineEditableSurface({
  surfaceId: "work-learning.home", route: "/my-work/explore", scopePolicy: "inheritable", label: "Learning for your work",
  fields: [
    ...Object.keys(wording).map(key => ({ key, label: key, kind: "long" as const, required: true })),
    ...WORK_PROFILES.flatMap(([id]) => [
      { key: `${id}Label`, label: `${id}: name`, kind: "short" as const, required: true },
      { key: `${id}Purpose`, label: `${id}: purpose`, kind: "long" as const, required: true },
      { key: `${id}Ids`, label: `${id}: resources`, kind: "string-list" as const, maxItems: 500 },
    ]),
    ...WORK_TASKS.flatMap(([id]) => [
      { key: `task${id}Label`, label: `${id}: task`, kind: "short" as const, required: true },
      { key: `task${id}Ids`, label: `${id}: resources`, kind: "string-list" as const, maxItems: 500 },
    ]),
  ],
  approvedValues: { ...wording,
    ...Object.fromEntries(WORK_PROFILES.flatMap(([id, label, purpose, ids]) => [[`${id}Label`, label], [`${id}Purpose`, purpose], [`${id}Ids`, [...ids]]])),
    ...Object.fromEntries(WORK_TASKS.flatMap(([id, label, ids]) => [[`task${id}Label`, label], [`task${id}Ids`, [...ids]]])),
  },
});

/** Only accepts a collection already resolved through publication and scope rules. */
export function selectWorkLearning(items: readonly ContentItem[], values: EditableSurfaceValues, role?: string, task?: string): ContentItem[] {
  const roleKey = WORK_PROFILES.some(([id]) => id === role) ? `${role}Ids` : "";
  const taskKey = WORK_TASKS.some(([id]) => id === task) ? `task${task}Ids` : "";
  const ids = [taskKey, roleKey].flatMap(key => Array.isArray(values[key]) ? (values[key] as unknown[]).filter((v): v is string => typeof v === "string") : []);
  const byId = new Map(items.map(item => [item.id, item]));
  return [...new Set(ids)].flatMap(id => byId.has(id) ? [byId.get(id)!] : []);
}
