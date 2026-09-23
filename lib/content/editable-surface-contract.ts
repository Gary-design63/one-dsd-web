import { z } from "zod";
import { CoursePackSchema } from "./courses/contract";
import type { CoursePack } from "./courses/source-types";
import { lintStaffCopy } from "@/lib/brand/lint";

/** Ruled-out phrasing is enforced on current copy by the staff-voice tests; stored publications still parse. */
function publishedCopyFindings(value: string) {
  return lintStaffCopy(value).filter((finding) => finding.code !== "ruled_out");
}
import { hasFormattedOrSerializedText } from "./resource-editor-contract";
import { hasPagePresentationSyntax, isSafePageLink } from "./page-copy-contract";
import type { StaffProgramScope } from "./staff-publications";

export const EDITABLE_SURFACE_SCOPE_POLICIES = ["inheritable", "one-dhs", "dsd"] as const;
export type EditableSurfaceScopePolicy = (typeof EDITABLE_SURFACE_SCOPE_POLICIES)[number];

export const EDITABLE_SURFACE_FIELD_KINDS = [
  "short",
  "long",
  "url",
  "string-list",
  "link-list",
  "rich-blocks",
  "course-pack",
] as const;
export type EditableSurfaceFieldKind = (typeof EDITABLE_SURFACE_FIELD_KINDS)[number];

export const EDITABLE_SURFACE_REVIEW_DIMENSIONS = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
  "rights_and_consent",
  "community_representation",
  "legal_policy",
] as const;
export type EditableSurfaceReviewDimension = (typeof EDITABLE_SURFACE_REVIEW_DIMENSIONS)[number];

export const EDITABLE_SURFACE_REVIEW_STATUSES = ["pass", "revise", "blocked", "not_applicable"] as const;
export type EditableSurfaceReviewStatus = (typeof EDITABLE_SURFACE_REVIEW_STATUSES)[number];

export const DEFAULT_EDITABLE_SURFACE_REVIEWS = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
] as const satisfies readonly EditableSurfaceReviewDimension[];

export const COMMUNITY_EDITABLE_SURFACE_REVIEWS = [
  ...DEFAULT_EDITABLE_SURFACE_REVIEWS,
  "rights_and_consent",
  "community_representation",
] as const satisfies readonly EditableSurfaceReviewDimension[];

export type EditableSurfaceLink = {
  label: string;
  href: string;
};

export type EditableRichBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullet-list" | "numbered-list"; items: string[] }
  | { type: "link-list"; items: EditableSurfaceLink[] };

export type EditableSurfaceValue = string | string[] | EditableSurfaceLink[] | EditableRichBlock[] | CoursePack;
export type EditableSurfaceValues = Record<string, EditableSurfaceValue>;

export type EditableSurfaceFieldDefinition = {
  key: string;
  label: string;
  kind: EditableSurfaceFieldKind;
  required?: boolean;
  maxLength?: number;
  maxItems?: number;
  group?: string;
  helpText?: string;
};

export type EditableSurfaceDefinition = {
  surfaceId: string;
  route: string;
  label?: string;
  scopePolicy: EditableSurfaceScopePolicy;
  fields: readonly EditableSurfaceFieldDefinition[];
  protectedFields?: readonly string[];
  reviewDimensions?: readonly EditableSurfaceReviewDimension[];
  approvedValues: EditableSurfaceValues;
};

export type EditableSurfaceDocument = {
  schemaVersion: 1;
  surfaceId: string;
  scope: StaffProgramScope;
  values: EditableSurfaceValues;
};

const SurfaceIdSchema = z.string().trim().regex(/^[a-z0-9][a-z0-9.-]{0,159}$/);
const FieldKeySchema = z.string().trim().regex(/^[a-z][a-zA-Z0-9_]{0,99}$/);

function plainStaffText(maximum: number, required: boolean) {
  // The consultant may clear any wording field. Emptying a field is a valid edit.
  const minimum = 0; void required;
  return z
    .string()
    .trim()
    .min(minimum)
    .max(maximum)
    .refine(
      (value) => value.length === 0 || (!hasFormattedOrSerializedText(value) && !hasPagePresentationSyntax(value)),
      "Use plain text without formatting or pasted code.",
    )
    .refine(
      (value) => value.length === 0 || publishedCopyFindings(value).length === 0,
      "Use the program's plain staff language without icons or technical product wording.",
    );
}

const safeLink = z.string().trim().min(1).max(2_000).refine(isSafePageLink, "Use a program path or a secure web address.");

function positiveLimit(value: number | undefined, fallback: number, ceiling: number, name: string): number {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < 1 || resolved > ceiling) {
    throw new Error(`${name} must be a whole number from 1 through ${ceiling}.`);
  }
  return resolved;
}

function valueSchema(field: EditableSurfaceFieldDefinition): z.ZodType<EditableSurfaceValue> {
  if (field.kind === "course-pack") return CoursePackSchema;
  // The consultant may clear any field outright. Nothing is required.
  const required = false; void field.required;
  const maxLength = positiveLimit(
    field.maxLength,
    field.kind === "short" ? 500 : field.kind === "url" ? 2_000 : 10_000,
    100_000,
    `${field.key} maxLength`,
  );
  const maxItems = positiveLimit(field.maxItems, 100, 500, `${field.key} maxItems`);

  if (field.kind === "short" || field.kind === "long") return plainStaffText(maxLength, required);
  if (field.kind === "url") return required ? safeLink : safeLink.or(z.literal(""));

  const itemText = plainStaffText(maxLength, true);
  const links = z.array(z.object({ label: itemText, href: safeLink }).strict()).min(required ? 1 : 0).max(maxItems);
  if (field.kind === "link-list") return links;
  if (field.kind === "string-list") return z.array(itemText).min(required ? 1 : 0).max(maxItems);

  const richBlock = z.discriminatedUnion("type", [
    z.object({ type: z.literal("heading"), level: z.union([z.literal(2), z.literal(3)]), text: itemText }).strict(),
    z.object({ type: z.literal("paragraph"), text: itemText }).strict(),
    z.object({
      type: z.union([z.literal("bullet-list"), z.literal("numbered-list")]),
      items: z.array(itemText).min(1).max(maxItems),
    }).strict(),
    z.object({ type: z.literal("link-list"), items: links.min(1) }).strict(),
  ]);
  return z.array(richBlock).min(required ? 1 : 0).max(maxItems);
}

function assertDefinition(definition: EditableSurfaceDefinition): void {
  SurfaceIdSchema.parse(definition.surfaceId);
  if (definition.route !== "*" && !/^\/(?!\/)[^\u0000-\u001f\u007f\\<>"\s]*$/.test(definition.route)) {
    throw new Error(`Editable surface ${definition.surfaceId} has an unsafe route.`);
  }
  if (definition.label !== undefined) plainStaffText(300, true).parse(definition.label);
  z.enum(EDITABLE_SURFACE_SCOPE_POLICIES).parse(definition.scopePolicy);
  if (definition.fields.length === 0 || definition.fields.length > 500) {
    throw new Error(`Editable surface ${definition.surfaceId} must register from 1 through 500 fields.`);
  }

  const editableKeys = new Set<string>();
  for (const field of definition.fields) {
    FieldKeySchema.parse(field.key);
    z.enum(EDITABLE_SURFACE_FIELD_KINDS).parse(field.kind);
    plainStaffText(300, true).parse(field.label);
    if (field.group !== undefined) plainStaffText(300, true).parse(field.group);
    if (field.helpText !== undefined) plainStaffText(1_000, true).parse(field.helpText);
    if (editableKeys.has(field.key)) throw new Error(`Editable surface ${definition.surfaceId} repeats field ${field.key}.`);
    editableKeys.add(field.key);
    valueSchema(field);
  }

  const protectedKeys = new Set<string>();
  for (const key of definition.protectedFields ?? []) {
    FieldKeySchema.parse(key);
    if (editableKeys.has(key)) throw new Error(`Protected field ${key} cannot also be editable.`);
    if (protectedKeys.has(key)) throw new Error(`Editable surface ${definition.surfaceId} repeats protected field ${key}.`);
    protectedKeys.add(key);
  }

  const dimensions = editableSurfaceReviewDimensions(definition);
  if (dimensions.length === 0 || new Set(dimensions).size !== dimensions.length) {
    throw new Error(`Editable surface ${definition.surfaceId} must have unique required reviews.`);
  }
  for (const dimension of dimensions) z.enum(EDITABLE_SURFACE_REVIEW_DIMENSIONS).parse(dimension);
}

const validatedDefaults = new WeakMap<EditableSurfaceDefinition, EditableSurfaceValues>();

/** Reuse the parsed copy of bundled defaults, never unvalidated owner or database input. */
export function validatedEditableSurfaceDefaults(definition: EditableSurfaceDefinition): EditableSurfaceValues {
  return validatedDefaults.get(definition) ?? parseEditableSurfaceValues(definition, definition.approvedValues);
}

export function defineEditableSurface<TDefinition extends EditableSurfaceDefinition>(
  definition: TDefinition,
): TDefinition {
  assertDefinition(definition);
  validatedDefaults.set(definition, parseEditableSurfaceValues(definition, definition.approvedValues));
  return definition;
}

export function editableSurfaceReviewDimensions(
  definition: Pick<EditableSurfaceDefinition, "surfaceId" | "reviewDimensions">,
): readonly EditableSurfaceReviewDimension[] {
  if (definition.reviewDimensions) return definition.reviewDimensions;
  return definition.surfaceId === "communities.brief-shell" || definition.surfaceId.startsWith("community-brief.")
    ? COMMUNITY_EDITABLE_SURFACE_REVIEWS
    : DEFAULT_EDITABLE_SURFACE_REVIEWS;
}

export function parseEditableSurfaceValues(
  definition: EditableSurfaceDefinition,
  input: unknown,
): EditableSurfaceValues {
  assertDefinition(definition);
  const shape: Record<string, z.ZodType<EditableSurfaceValue>> = {};
  for (const field of definition.fields) shape[field.key] = valueSchema(field);
  const parsed = z.object(shape).strict().parse(input) as EditableSurfaceValues;
  if (definition.surfaceId.startsWith("course.")) {
    // The registered course-pack field was validated by the object schema above.
    const pack = parsed.pack as CoursePack;
    if (definition.surfaceId !== `course.${pack.course.id}`) throw new Error("The course identity cannot change.");
  }
  return parsed;
}

export function parseEditableSurfaceDocument(
  definition: EditableSurfaceDefinition,
  input: unknown,
): EditableSurfaceDocument {
  const envelope = z.object({
    schemaVersion: z.literal(1),
    surfaceId: z.literal(definition.surfaceId),
    scope: z.enum(["one-dhs", "dsd"]),
    values: z.unknown(),
  }).strict().parse(input);
  if (!surfaceMayBeEditedInScope(definition, envelope.scope)) {
    throw new Error("This wording belongs to another program scope.");
  }
  return { ...envelope, values: parseEditableSurfaceValues(definition, envelope.values) };
}

export function surfaceMayBeReadInScope(
  definition: Pick<EditableSurfaceDefinition, "scopePolicy">,
  scope: StaffProgramScope,
): boolean {
  return definition.scopePolicy === "inheritable" || definition.scopePolicy === scope ||
    (definition.scopePolicy === "one-dhs" && scope === "dsd");
}

export function surfaceMayBeEditedInScope(
  definition: Pick<EditableSurfaceDefinition, "scopePolicy">,
  scope: StaffProgramScope,
): boolean {
  return definition.scopePolicy === "inheritable" || definition.scopePolicy === scope;
}

const plainNote = z
  .string()
  .trim()
  .max(1_000)
  .nullable()
  .refine(
    (value) => value === null || value.length === 0 ||
      (!hasFormattedOrSerializedText(value) && !hasPagePresentationSyntax(value) && publishedCopyFindings(value).length === 0),
    "Use a plain note without icons or technical product wording.",
  );
const reason = plainStaffText(1_000, true);
const revisionId = z.string().uuid();
const decisionId = z.string().regex(/^\d+$/).nullable();

const SaveDraftMutationSchema = z.object({
  action: z.literal("save_draft"),
  scope: z.enum(["one-dhs", "dsd"]),
  expectedRevisionId: revisionId.nullable(),
  document: z.unknown(),
  changeNote: plainNote,
}).strict();

const SaveChangesMutationSchema = SaveDraftMutationSchema.extend({
  action: z.literal("save_changes"),
  expectedPublicationDecisionId: decisionId,
}).strict();

const RecordReviewMutationSchema = z.object({
  action: z.literal("record_review"),
  scope: z.enum(["one-dhs", "dsd"]),
  revisionId,
  dimension: z.enum(EDITABLE_SURFACE_REVIEW_DIMENSIONS),
  status: z.enum(EDITABLE_SURFACE_REVIEW_STATUSES),
  expectedReviewId: revisionId,
  note: plainNote,
}).strict();

const PublishMutationSchema = z.object({
  action: z.literal("publish"),
  scope: z.enum(["one-dhs", "dsd"]),
  revisionId,
  expectedPublicationDecisionId: decisionId,
  reason,
}).strict();

const WithdrawMutationSchema = z.object({
  action: z.literal("withdraw"),
  scope: z.enum(["one-dhs", "dsd"]),
  expectedPublishedRevisionId: revisionId,
  expectedPublicationDecisionId: decisionId,
  reason,
}).strict();

const ResumeInheritanceMutationSchema = z.object({
  action: z.literal("resume_inheritance"),
  scope: z.literal("dsd"),
  expectedPublicationDecisionId: decisionId,
  reason,
}).strict();

const RestoreMutationSchema = z.object({
  action: z.literal("restore"),
  scope: z.enum(["one-dhs", "dsd"]),
  targetRevisionId: revisionId,
  expectedPublicationDecisionId: decisionId,
  reason,
}).strict();

const EditableSurfaceMutationEnvelopeSchema = z.discriminatedUnion("action", [
  SaveDraftMutationSchema,
  SaveChangesMutationSchema,
  RecordReviewMutationSchema,
  PublishMutationSchema,
  WithdrawMutationSchema,
  ResumeInheritanceMutationSchema,
  RestoreMutationSchema,
]);

export type SaveEditableSurfaceDraftAction = z.infer<typeof SaveDraftMutationSchema> & {
  document: EditableSurfaceDocument;
};
export type SaveEditableSurfaceChangesAction = z.infer<typeof SaveChangesMutationSchema> & {
  document: EditableSurfaceDocument;
};
export type EditableSurfaceMutation =
  | SaveEditableSurfaceDraftAction
  | SaveEditableSurfaceChangesAction
  | z.infer<typeof RecordReviewMutationSchema>
  | z.infer<typeof PublishMutationSchema>
  | z.infer<typeof WithdrawMutationSchema>
  | z.infer<typeof ResumeInheritanceMutationSchema>
  | z.infer<typeof RestoreMutationSchema>;

export function parseEditableSurfaceMutation(
  definition: EditableSurfaceDefinition,
  input: unknown,
): EditableSurfaceMutation {
  const parsed = EditableSurfaceMutationEnvelopeSchema.parse(input);
  if (!surfaceMayBeEditedInScope(definition, parsed.scope)) {
    throw new Error("This wording belongs to another program scope.");
  }
  if (parsed.action === "resume_inheritance" && definition.scopePolicy !== "inheritable") {
    throw new Error("This page area does not inherit wording from One DHS.");
  }
  if (parsed.action === "record_review") {
    const required = editableSurfaceReviewDimensions(definition);
    if (!required.includes(parsed.dimension)) throw new Error("This review does not apply to this page area.");
  }
  if (parsed.action !== "save_draft" && parsed.action !== "save_changes") return parsed;
  const document = parseEditableSurfaceDocument(definition, parsed.document);
  if (document.scope !== parsed.scope) throw new Error("The draft scope does not match the requested program scope.");
  return { ...parsed, document };
}
