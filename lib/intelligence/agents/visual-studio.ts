import type { StudioBrief, StudioProject } from "@/lib/visual-studio/contract";
import { StudioError } from "@/lib/visual-studio/server";
import type { ToolContext } from "@/lib/intelligence/types";

/** Compatibility export for saved records; no registered or callable authoring adapter remains. */
export class StudioRenderFailed extends Error {
  constructor(public readonly project: StudioProject) {
    super(project.failure?.message ?? "The historical scene did not complete.");
  }
}
export async function authorVisualStudioScene(input: StudioBrief, ctx: ToolContext): Promise<StudioProject | undefined> {
  void input; void ctx;
  throw new StudioError("integration_removed", "This authoring integration has been removed from the program.", 410);
}
