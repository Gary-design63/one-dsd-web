import { getDomain, type DomainId } from "@/lib/domains";
import { WORK_AREA_DOMAINS } from "@/lib/domains/surfaces";
import { WORK_AREAS, type WorkAreaId } from "./work-areas";

export type WorkOrigin = { originArea?: WorkAreaId; area?: DomainId; task?: string };
export type WorkOriginInput = Record<string, string | string[] | undefined>;
const value = (input: string | string[] | undefined) => (Array.isArray(input) ? input[0] : input)?.trim() ?? "";
const WORK_AREA_STARTS: Record<WorkAreaId, readonly [DomainId, string]> = {
  workforce_equity: ["workforce", "design-role"],
  policy_program_service_design: ["policy-program-service", "equity-analysis"],
  community_engagement_co_design: ["community-engagement", "engagement-plan"],
  accessibility_language_access: ["access-language", "accessible-meeting"],
  culture_trust_repair: ["culture-trust", "team-climate"],
  leadership_systems_change: ["leadership-systems", "decision-record"],
  data_research_quality_measurement: ["measurement", "evaluation-plan"],
  fiscal_grants_procurement_contracts: ["leadership-systems", "procurement"],
  communications_public_information: ["access-language", "accessible-document"],
};
export function workAreaStartingPoint(id: WorkAreaId) {
  const [area, taskId] = WORK_AREA_STARTS[id];
  const task = getDomain(area)?.tasks.find(task => task.id === taskId);
  return task ? { origin: { originArea: id, area, task: task.id } satisfies WorkOrigin, task } : undefined;
}
/** Work area is the visitor's nine-area entry point; area remains the shared Library domain. */
export function normalizeWorkOrigin(input: WorkOriginInput, routeDomain?: string): WorkOrigin {
  const domain = getDomain(routeDomain ?? value(input.area));
  const origin = WORK_AREAS.find(item => item.id === value(input.originArea));
  const originArea = origin && (!domain || WORK_AREA_DOMAINS[origin.id].includes(domain.id)) ? origin.id : undefined;
  const task = domain?.tasks.find(item => item.id === value(input.task))?.id;
  return { ...(originArea ? { originArea } : {}), ...(domain ? { area: domain.id } : {}), ...(task ? { task } : {}) };
}
export function workOriginForPath(input: WorkOriginInput, pathId: string): WorkOrigin {
  const origin = normalizeWorkOrigin(input);
  if (!origin.area) return origin;
  const domain = getDomain(origin.area)!;
  if (!domain.tasks.some(task => task.pathId === pathId)) return origin.originArea ? { originArea: origin.originArea } : {};
  const task = domain.tasks.find(task => task.id === origin.task && task.pathId === pathId)?.id;
  return { ...origin, task };
}
/** Only approved local route families receive context; outside destinations remain unchanged. */
export function withWorkOrigin(href: string, candidate: WorkOrigin): string {
  if (!/^\/(?!\/)/.test(href)) return href;
  const url = new URL(href, "https://program.invalid");
  if (!/^\/(?:areas|library|resources|practice|paths|support|ask)(?:\/|$)/.test(url.pathname)) return href;
  const origin = normalizeWorkOrigin(candidate);
  if (origin.originArea) url.searchParams.set("originArea", origin.originArea);
  if (url.pathname.startsWith("/support")) {
    if (origin.originArea) url.searchParams.set("area", origin.originArea);
    if (origin.area) url.searchParams.set("domain", origin.area);
  } else if (origin.area) url.searchParams.set("area", origin.area);
  if (origin.task) url.searchParams.set("task", origin.task);
  return url.pathname + url.search + url.hash;
}
