import { WORK_AREAS, type WorkAreaId } from "./work-areas";
const LEGACY_SUPPORT_AREAS: Readonly<Record<string, WorkAreaId>> = {
  hiring_or_workforce: "workforce_equity",
  policy_or_program_decision: "policy_program_service_design",
  accessibility_barrier: "accessibility_language_access",
  procurement_or_contract: "fiscal_grants_procurement_contracts",
  advancement_or_leadership_pathway: "leadership_systems_change",
};
/** Preserve the subject of the original practice and resource handoffs. */
export function supportAreaFromQuery(area?: string, matter?: string): WorkAreaId | undefined {
  if (WORK_AREAS.some(candidate => candidate.id === area)) return area as WorkAreaId;
  return matter && Object.hasOwn(LEGACY_SUPPORT_AREAS,matter) ? LEGACY_SUPPORT_AREAS[matter] : undefined;
}
