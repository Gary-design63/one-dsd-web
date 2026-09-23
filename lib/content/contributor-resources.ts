import "server-only";
import { z } from "zod";
import { programContributorDatabase } from "@/lib/auth/program-identity";
import { type ProtectedMutationContext } from "@/lib/auth/protected-mutation";
import { ResourceDraftRequestSchema, EditableResourceFieldsSchema, type ResourceDraftRequest, type EditableResourceState } from "./resource-editor-contract";
import { ResourceReleaseActionSchema, ResourceReleaseQueueItemSchema, ResourceReleaseStateSchema, staffReleaseValidationIssues, type ResourceReleaseAction, type ResourceReleaseState } from "./resource-release-contract";
import type { StaffProgramScope } from "./staff-publications";

type Row = Record<string, unknown>;
export interface ContributorResourceDatabase {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
  close(): Promise<void>;
}
export class ContributorResourceError extends Error {
  constructor(public readonly status: number, message: string) { super(message); this.name = "ContributorResourceError"; }
}
const EditingRowSchema = z.object({
  content_item_id: z.string().min(1), published_revision_id: z.string().uuid().nullable(),
  base_revision_id: z.string().uuid(), editable_fields: EditableResourceFieldsSchema,
  has_unpublished_changes: z.boolean(),
});
function editingState(value: unknown): EditableResourceState {
  const row = EditingRowSchema.parse(value);
  return { contentItemId: row.content_item_id, expectedRevisionId: row.base_revision_id,
    publishedRevisionId: row.published_revision_id, hasUnpublishedChanges: row.has_unpublished_changes,
    fields: row.editable_fields };
}
function boundaryParameters(context: ProtectedMutationContext): readonly unknown[] {
  return [context.sessionTokenDigest, context.environment, context.identityEvidenceId, context.identityBundleSha256,
    context.contributionEvidenceId, context.contributionBundleSha256];
}
function mapFailure(error: unknown): never {
  if (error instanceof ContributorResourceError) throw error;
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (["40001", "23505"].includes(code)) throw new ContributorResourceError(409, "This resource changed. Reopen it before continuing; keep a copy of any unsaved wording.");
  if (code === "PAI01") throw new ContributorResourceError(401, "Please sign in again to continue.");
  if (["42501", "PAA01"].includes(code)) throw new ContributorResourceError(403, "This action is not available with your current access.");
  if (code === "PAF01") throw new ContributorResourceError(503, "Resource contributions are not available right now.");
  if (code === "P0002") throw new ContributorResourceError(404, "This resource is not available in this program view.");
  if (["55000", "23514"].includes(code)) throw new ContributorResourceError(422, "Complete the required resource checks before continuing.");
  if (["22000", "22023", "22P02", "22003"].includes(code)) throw new ContributorResourceError(422, "Check the information and try again.");
  throw error;
}
export class ContributorResourceStore {
  constructor(private readonly database: ContributorResourceDatabase) {}
  async queue(context: ProtectedMutationContext, scope: StaffProgramScope) {
    try {
      const rows = await this.database.query("select * from pac.list_contributor_resource_release_queue($1,$2,$3,$4,$5,$6,$7)", [...boundaryParameters(context), scope]);
      return rows.map((row) => ResourceReleaseQueueItemSchema.parse({
        contentItemId: row.content_item_id, title: row.title, hasDraft: row.has_draft,
        readyToPublish: row.ready_to_publish, isPublished: row.is_published,
        changedAt: row.changed_at instanceof Date ? row.changed_at.toISOString() : row.changed_at,
      }));
    } catch (error) { mapFailure(error); }
  }
  async editing(context: ProtectedMutationContext, scope: StaffProgramScope, id: string) {
    try {
      const rows = await this.database.query("select * from pac.read_contributor_resource_editing_state($1,$2,$3,$4,$5,$6,$7,$8)", [...boundaryParameters(context), scope, id]);
      if (rows.length > 1) throw new Error("Resource editing returned more than one current record.");
      return rows[0] ? editingState(rows[0]) : undefined;
    } catch (error) { mapFailure(error); }
  }
  async read(context: ProtectedMutationContext, scope: StaffProgramScope, id: string) {
    try {
      const rows = await this.database.query("select pac.read_contributor_resource_release_state($1,$2,$3,$4,$5,$6,$7,$8) as state", [...boundaryParameters(context), scope, id]);
      if (rows.length !== 1) throw new Error("Resource review returned an unexpected record count.");
      return rows[0].state == null ? undefined : ResourceReleaseStateSchema.parse(rows[0].state);
    } catch (error) { mapFailure(error); }
  }
  private async mutate(context: ProtectedMutationContext, scope: StaffProgramScope, id: string, operation: string, payload: unknown) {
    try {
      const rows = await this.database.query("select pac.run_protected_content_mutation($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::text::jsonb) as result",
        [...boundaryParameters(context), scope, operation, id, JSON.stringify(payload)]);
      if (rows.length !== 1 || rows[0].result == null) throw new Error("No resource mutation receipt was returned.");
      return rows[0].result;
    } catch (error) { mapFailure(error); }
  }
  async save(context: ProtectedMutationContext, scope: StaffProgramScope, id: string, input: ResourceDraftRequest) {
    const payload = ResourceDraftRequestSchema.parse(input);
    if (payload.fields.scope !== (scope === "dsd" ? "dsd" : "agencywide")) throw new ContributorResourceError(422, "Keep this draft in its current program view.");
    return editingState(await this.mutate(context, scope, id, "resource_draft_save", payload));
  }
  async act(context: ProtectedMutationContext, scope: StaffProgramScope, id: string, input: ResourceReleaseAction): Promise<ResourceReleaseState> {
    const parsed = ResourceReleaseActionSchema.parse(input);
    if (parsed.action === "publish" || parsed.action === "republish") {
      const current = await this.read(context, scope, id);
      if (!current) throw new ContributorResourceError(404, "This resource is not available.");
      const candidate = parsed.action === "publish"
        ? current.draft?.revisionId === parsed.revisionId ? current.draft.payload : undefined
        : current.history.find((version) => version.revisionId === parsed.revisionId)?.payload;
      if (!candidate) throw new ContributorResourceError(409, "The resource changed. Reopen it before continuing.");
      if (staffReleaseValidationIssues(candidate).length) throw new ContributorResourceError(422, "Revise the resource wording or formatting before publishing.");
    }
    const { action, ...payload } = parsed;
    const operation = action === "review" ? "resource_review_record" : `resource_${action}`;
    return ResourceReleaseStateSchema.parse(await this.mutate(context, scope, id, operation, payload));
  }
  close() { return this.database.close(); }
}
export function contributorResourceStore() {
  return new ContributorResourceStore(programContributorDatabase());
}
