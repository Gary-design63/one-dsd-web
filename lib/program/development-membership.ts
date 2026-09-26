import "server-only";
import membership from "./development-membership.json";
import { developmentModel, type DevelopmentJourney } from "./development";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";

type Membership = { id: string; journeyIds: string[]; purpose: string; contextHref?: string };
const byId = new Map<string, Membership>(membership.items.map(item => [item.id, item]));
export const resourceDevelopment = (id: string): Membership | undefined => byId.get(id);

/** Describes content, never a person. Callers resolve scoped publication before rendering. */
export function resourceJourneys(resourceId: string, values: EditableSurfaceValues): DevelopmentJourney[] {
  const explicit = byId.get(resourceId);
  if (explicit) return explicit.journeyIds.flatMap(id => developmentModel.journeys.filter(journey => journey.id === id));
  // Newly published material can still use the owner's editable thematic membership.
  return developmentModel.journeys.filter(journey => journey.themes.some(theme => {
    const members = values[`${theme}Ids`];
    return Array.isArray(members) && members.some(member => typeof member === "string" && member === resourceId);
  }));
}
