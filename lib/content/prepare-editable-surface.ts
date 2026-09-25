import "server-only";

import { editingModeFromCookies } from "@/lib/auth/request";
import {
  loadPublishedEditableSurface,
  editableSurfaceSource,
  type PublishedEditableSurface,
} from "@/lib/content/editable-surfaces";
import {
  surfaceMayBeEditedInScope,
  type EditableSurfaceDefinition,
  type EditableSurfaceValues,
} from "@/lib/content/editable-surface-contract";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { requestedContentScope } from "@/lib/product/request-context";
import { CoursePackSchema } from "@/lib/content/courses/contract";
import { coursePackWithoutWikipedia } from "@/lib/content/courses/source-cleanup";

export type PreparedEditableSurface = Readonly<{
  definition: EditableSurfaceDefinition;
  scope: StaffProgramScope;
  values: EditableSurfaceValues;
  published: PublishedEditableSurface | null;
  available: boolean;
  canEdit: boolean;
}>;

/** Server-only surface copy loader with no client editor import. Download adapters use this. */
export async function prepareEditableSurface(
  surfaceId: string,
  options: { scope?: StaffProgramScope; includeOwner?: boolean } = {},
): Promise<PreparedEditableSurface> {
  const definition = getEditableSurfaceDefinition(surfaceId);
  if (!definition) throw new Error(`Editable page area ${surfaceId} is not registered.`);
  const requestedScope = options.scope ?? await requestedContentScope();
  const source = editableSurfaceSource(surfaceId);
  const readingScope = definition.scopePolicy === "dsd"
    ? "dsd"
    : definition.scopePolicy === "one-dhs"
      ? "one-dhs"
      : requestedScope;
  const [published, owner] = await Promise.all([
    loadPublishedEditableSurface(surfaceId, { source, scope: readingScope }),
    options.includeOwner === false ? Promise.resolve(false) : editingModeFromCookies(),
  ]);

  const originalValues = published?.values ?? definition.approvedValues;
  const coursePack = surfaceId.startsWith("course.") ? CoursePackSchema.safeParse(originalValues.pack) : null;
  const values = coursePack?.success
    ? { ...originalValues, pack: coursePackWithoutWikipedia(coursePack.data) }
    : originalValues;

  return {
    definition,
    scope: readingScope,
    values,
    published: published ?? null,
    available: source === "static" || Boolean(published),
    canEdit: owner && surfaceMayBeEditedInScope(definition, requestedScope) && readingScope === requestedScope,
  };
}
