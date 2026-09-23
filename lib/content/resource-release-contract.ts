import { z } from "zod";
import { lintStaffCopy } from "@/lib/brand/lint";
import {
  EditableResourceFieldsSchema,
  hasFormattedOrSerializedText,
} from "./resource-editor-contract";

export const RESOURCE_REVIEW_DIMENSIONS = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
  "rights_and_consent",
  "community_representation",
  "legal_policy",
] as const;

export const RESOURCE_REVIEW_LABELS: Record<(typeof RESOURCE_REVIEW_DIMENSIONS)[number], string> = {
  language_alignment: "Staff language",
  factual_currentness: "Current and accurate information",
  accessibility: "Accessibility",
  scope: "Where the resource applies",
  placement: "Where staff will find it",
  rights_and_consent: "Permission to use the material",
  community_representation: "Community representation",
  legal_policy: "Law and policy",
};

export const RESOURCE_REVIEW_DECISIONS = [
  "pass",
  "revise",
  "blocked",
  "not_applicable",
] as const;

export const RESOURCE_STAFF_SENSITIVITY_CLASSES = ["S0", "S1"] as const;

export const RESOURCE_STAFF_SENSITIVITY_LABELS: Record<
  (typeof RESOURCE_STAFF_SENSITIVITY_CLASSES)[number],
  string
> = {
  S0: "Public or openly reusable material",
  S1: "Internal-purpose material approved for the staff-facing web address",
};

export const RESOURCE_REVIEW_DECISION_LABELS: Record<(typeof RESOURCE_REVIEW_DECISIONS)[number], string> = {
  pass: "Review complete",
  revise: "Changes needed",
  blocked: "Do not publish yet",
  not_applicable: "Does not apply",
};

export const ResourceReviewDimensionSchema = z.enum(RESOURCE_REVIEW_DIMENSIONS);
export const ResourceReviewDecisionSchema = z.enum(RESOURCE_REVIEW_DECISIONS);

export const ReleaseResourcePayloadSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    type: z.string().min(1),
    authority: z.string().min(1),
    layer: z.string().min(1),
    summary: z.string().min(1),
    whyItMatters: z.string().nullable().optional(),
    body: z.array(z.string()),
    nextActions: z.array(z.object({ label: z.string(), href: z.string() })),
    tags: z.array(z.string()),
    intents: z.array(z.string()),
    pathIds: z.array(z.string()).optional(),
    owner: z.string().min(1),
    reviewDate: z.string(),
    scope: z.enum(["agencywide", "dsd"]),
    status: z.enum(["approved", "under_review"]),
    accessibility: z.enum(["reviewed", "pending"]),
    href: z.string().nullable().optional(),
    sourceName: z.string().nullable().optional(),
    version: z.string().min(1),
  })
  .passthrough();

const PublicationDecisionIdSchema = z.string().regex(/^[1-9]\d*$/);
const ReviewStateSchema = z.object({
  reviewId: z.string().uuid(),
  dimension: ResourceReviewDimensionSchema,
  status: z.enum(["pending", ...RESOURCE_REVIEW_DECISIONS]),
  note: z.string().nullable(),
  recordedAt: z.string(),
});

const PublishedVersionSchema = z.object({
  publicationDecisionId: PublicationDecisionIdSchema,
  revisionId: z.string().uuid(),
  revisionNumber: z.number().int().positive(),
  scopeId: z.string().min(1),
  isInherited: z.boolean(),
  payload: ReleaseResourcePayloadSchema,
  decidedAt: z.string(),
});

const DraftVersionSchema = z.object({
  revisionId: z.string().uuid(),
  revisionNumber: z.number().int().positive(),
  payload: ReleaseResourcePayloadSchema,
  changeSummary: z.string(),
  createdAt: z.string(),
  requiredReviewDimensions: z.array(ResourceReviewDimensionSchema),
  reviews: z.array(ReviewStateSchema),
  readyToPublish: z.boolean(),
});

const PublishedHistorySchema = z.object({
  publicationDecisionId: PublicationDecisionIdSchema,
  revisionId: z.string().uuid(),
  revisionNumber: z.number().int().positive(),
  scopeId: z.string().min(1),
  isInherited: z.boolean(),
  title: z.string().min(1),
  payload: ReleaseResourcePayloadSchema,
  decidedAt: z.string(),
  isCurrent: z.boolean(),
});

export const ResourceReleaseStateSchema = z.object({
  contentItemId: z.string().min(1),
  requestedScopeId: z.string().min(1),
  scopeDecisionId: PublicationDecisionIdSchema.nullable(),
  scopeDecision: z.enum(["preview", "publish", "withdraw"]).nullable(),
  published: PublishedVersionSchema.nullable(),
  draft: DraftVersionSchema.nullable(),
  withdrawn: z.boolean(),
  history: z.array(PublishedHistorySchema),
});

export const ResourceReleaseQueueItemSchema = z.object({
  contentItemId: z.string().min(1),
  title: z.string().min(1),
  hasDraft: z.boolean(),
  readyToPublish: z.boolean(),
  isPublished: z.boolean(),
  changedAt: z.string().nullable(),
});

const ShortNote = z.string().trim().min(1).max(500);
const ReviewNote = z.string().trim().max(2_000).nullable();
const StaffExposureDecision = {
  sensitivityClass: z.enum(RESOURCE_STAFF_SENSITIVITY_CLASSES),
  unauthenticatedExposurePermitted: z.literal(true),
  exposureReason: ShortNote,
};

export const ResourceReleaseActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("review"),
    revisionId: z.string().uuid(),
    dimension: ResourceReviewDimensionSchema,
    expectedPriorReviewId: z.string().uuid(),
    decision: ResourceReviewDecisionSchema,
    note: ReviewNote,
  }).strict(),
  z.object({
    action: z.literal("publish"),
    revisionId: z.string().uuid(),
    expectedScopeDecisionId: PublicationDecisionIdSchema.nullable(),
    reason: ShortNote,
    ...StaffExposureDecision,
  }).strict(),
  z.object({
    action: z.literal("withdraw"),
    revisionId: z.string().uuid(),
    expectedScopeDecisionId: PublicationDecisionIdSchema.nullable(),
    reason: ShortNote,
  }).strict(),
  z.object({
    action: z.literal("republish"),
    revisionId: z.string().uuid(),
    expectedScopeDecisionId: PublicationDecisionIdSchema.nullable(),
    reason: ShortNote,
    ...StaffExposureDecision,
  }).strict(),
]);

export type ReleaseResourcePayload = z.infer<typeof ReleaseResourcePayloadSchema>;
export type ResourceReleaseState = z.infer<typeof ResourceReleaseStateSchema>;
export type ResourceReleaseQueueItem = z.infer<typeof ResourceReleaseQueueItemSchema>;
export type ResourceReleaseAction = z.infer<typeof ResourceReleaseActionSchema>;

function editableFields(payload: ReleaseResourcePayload) {
  return {
    title: payload.title,
    type: payload.type,
    authority: payload.authority,
    layer: payload.layer,
    summary: payload.summary,
    whyItMatters: payload.whyItMatters ?? null,
    body: payload.body,
    nextActions: payload.nextActions,
    tags: payload.tags,
    intents: payload.intents,
    pathIds: payload.pathIds ?? [],
    owner: payload.owner,
    reviewDate: payload.reviewDate,
    scope: payload.scope,
    href: payload.href ?? null,
    sourceName: payload.sourceName ?? null,
  };
}

export function staffReleaseValidationIssues(payload: ReleaseResourcePayload): string[] {
  const fields = EditableResourceFieldsSchema.safeParse(editableFields(payload));
  if (!fields.success) {
    return ["The resource contains an incomplete field or presentation formatting."];
  }

  const staffText = [
    payload.title,
    payload.summary,
    payload.whyItMatters ?? "",
    ...payload.body,
    ...payload.nextActions.map((action) => action.label),
    ...payload.tags,
    payload.owner,
    payload.sourceName ?? "",
  ];
  if (staffText.some(hasFormattedOrSerializedText)) {
    return ["The resource contains presentation formatting or pasted data."];
  }
  if (lintStaffCopy(staffText.join("\n")).length > 0) {
    return ["The resource contains wording that does not fit the staff experience."];
  }
  return [];
}
