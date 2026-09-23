import { CORPUS } from "@/lib/content/corpus";
import { editableFieldsFromContent } from "@/lib/content/resource-editor-contract";
import type { ResourceReleaseState } from "@/lib/content/resource-release-contract";
export const fixtureResource = CORPUS[0];
export const revisionId = "00000000-0000-4000-8000-000000000001";
export const draftId = "00000000-0000-4000-8000-000000000002";
export const reviewId = "00000000-0000-4000-8000-000000000003";
export const fixtureContext = { sessionTokenDigest: "a".repeat(64), environment: "local" as const, identityEvidenceId: "test-identity", identityBundleSha256: "b".repeat(64), contributionEvidenceId: "test-contribution", contributionBundleSha256: "c".repeat(64) };
export const draftInput = { expectedRevisionId: revisionId, fields: editableFieldsFromContent({ ...fixtureResource, scope: "agencywide" }), changeNote: "Clarified practical guidance." };
export const editingRow = { content_item_id: fixtureResource.id, published_revision_id: revisionId, base_revision_id: draftId, editable_fields: draftInput.fields, has_unpublished_changes: true };
export function releaseFixture(): ResourceReleaseState {
  const payload = { ...fixtureResource, scope: "agencywide" as const, status: "approved" as const, accessibility: "reviewed" as const };
  return { contentItemId: fixtureResource.id, requestedScopeId: "one-dhs", scopeDecisionId: "1", scopeDecision: "publish", withdrawn: false,
    published: { publicationDecisionId: "1", revisionId, revisionNumber: 1, scopeId: "one-dhs", isInherited: false, payload, decidedAt: "2026-09-08T12:00:00.000Z" },
    draft: { revisionId: draftId, revisionNumber: 2, payload: { ...payload, title: "Useful resource draft", status: "under_review", accessibility: "pending" }, changeSummary: "Clarified guidance.", createdAt: "2026-09-08T13:00:00.000Z", requiredReviewDimensions: ["accessibility"], reviews: [{ reviewId, dimension: "accessibility", status: "pending", note: null, recordedAt: "2026-09-08T13:00:00.000Z" }], readyToPublish: false },
    history: [{ publicationDecisionId: "1", revisionId, revisionNumber: 1, scopeId: "one-dhs", isInherited: false, title: payload.title, payload, decidedAt: "2026-09-08T12:00:00.000Z", isCurrent: true }],
  };
}
