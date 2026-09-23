import "server-only";

import type { PreparedEditableSurface } from "@/lib/content/prepare-editable-surface";
import { prepareEditableSurface } from "@/lib/content/prepare-editable-surface";
import { EditableSurfaceEditor } from "./editable-surface-editor";

export type { PreparedEditableSurface };
export { prepareEditableSurface };

export function EditableSurfaceRegion({
  surface,
  children,
  className = "",
}: {
  surface: PreparedEditableSurface;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`editable-surface-region ${className}`.trim()} data-editable-surface={surface.definition.surfaceId}>
      {surface.canEdit ? (
        <EditableSurfaceEditor
          definition={surface.definition}
          scope={surface.scope}
          currentValues={surface.values}
          inherited={surface.published?.isInherited ?? false}
        />
      ) : null}
      {surface.available ? children : null}
    </div>
  );
}
