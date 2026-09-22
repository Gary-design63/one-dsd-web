import { LEARNING_STAGES } from "@/lib/product/learning";
import type { DomainId } from "./index";

/** Original stage/domain relationships from 5680911:lib/learning/index.ts.
 * The current six-stage vocabulary changes names and orders, not these subject connections. */
export const ORIGINAL_TO_CURRENT_STAGE = {
  introduction: "orientation", foundation: "foundations", intercultural: "intercultural-practice",
  application: "application", leadership: "leadership-continuity", systems: "systems-practice",
} as const;
const DOMAIN_STAGE_IDS: Record<DomainId, readonly (keyof typeof ORIGINAL_TO_CURRENT_STAGE)[]> = {
  workforce: ["application", "leadership"],
  "policy-program-service": ["introduction", "application"],
  "community-engagement": ["intercultural", "application"],
  "access-language": ["foundation"],
  "culture-trust": ["introduction", "intercultural", "leadership"],
  "leadership-systems": ["systems"], measurement: ["systems"],
};
export function learningStagesForDomain(id: DomainId) {
  const mapped = new Set(DOMAIN_STAGE_IDS[id].map(stage => ORIGINAL_TO_CURRENT_STAGE[stage]));
  return LEARNING_STAGES.filter(stage => mapped.has(stage.id));
}
export function currentLearningStage(id: string) {
  const current = ORIGINAL_TO_CURRENT_STAGE[id as keyof typeof ORIGINAL_TO_CURRENT_STAGE] ?? id;
  return LEARNING_STAGES.find(stage => stage.id === current);
}
