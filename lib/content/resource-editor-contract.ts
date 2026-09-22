import { z } from "zod";
import type { ContentItem } from "./types";

export const EDITABLE_CONTENT_TYPES = [
  "policy",
  "job_aid",
  "tool",
  "checklist",
  "practice_note",
  "learning_module",
  "scenario",
  "question_bank",
  "external_reference",
] as const;

export const EDITABLE_AUTHORITIES = [
  "official",
  "guidance",
  "practice_note",
  "learning",
  "community_brief",
  "partner_informed",
  "local",
  "under_review",
  "external_verify",
] as const;

export const EDITABLE_LAYERS = ["L1", "L2", "L3", "L4"] as const;

export const EDITABLE_INTENTS = [
  "policy_orientation",
  "practice_method",
  "launch_embed",
  "access_barriers",
  "workplace_culture",
  "intercultural",
  "uncertainty_authority",
  "escalation",
  "next_actions",
  "facilitation",
  "boundary_refusal",
] as const;

export const INTENT_LABELS: Record<(typeof EDITABLE_INTENTS)[number], string> = {
  policy_orientation: "Understand a policy",
  practice_method: "Apply a practice",
  launch_embed: "Plan or carry out the work",
  access_barriers: "Address access barriers",
  workplace_culture: "Strengthen workplace culture",
  intercultural: "Build intercultural understanding",
  uncertainty_authority: "Check what guidance applies",
  escalation: "Know when to ask for help",
  next_actions: "Choose next steps",
  facilitation: "Prepare or lead a conversation",
  boundary_refusal: "Recognize limits and redirect safely",
};

const PlainText = (maximum: number) => z.string().trim().min(1).max(maximum);
const OptionalPlainText = (maximum: number) => z.string().trim().max(maximum).nullable();
const SafeLink = z
  .string()
  .trim()
  .min(1)
  .max(2_000)
  .refine(
    (value) => /^\/(?!\/)[^\u0000-\u001f\u007f]*$/.test(value) || /^https:\/\/[^\s]+$/i.test(value),
    "Use a program path or a secure web address.",
  );
export function hasFormattedOrSerializedText(value: string): boolean {
  const markdownPresentation =
    /(^|[\r\n])\s{0,3}(?:#{1,6}|[-+*]|\d+[.)]|>)\s+\S/.test(value) ||
    /(^|[\r\n])\s{0,3}(?:```|~~~)/.test(value) ||
    /(^|[\r\n])\s{0,3}(?:[-*_]\s*){3,}(?:[\r\n]|$)/.test(value) ||
    /(^|[\r\n])\s*\|[^\r\n]*\|\s*(?:[\r\n]|$)/.test(value) ||
    /(^|[\r\n])[^\r\n]*\s\|\s[^\r\n]*(?:[\r\n]|$)/.test(value) ||
    /\*\*[^*\r\n]+\*\*/.test(value) ||
    /(^|[\s(])\*[^*\r\n]+\*(?=[\s).,;:!?]|$)/.test(value) ||
    /(^|[\s(])_[^_\r\n]+_(?=[\s).,;:!?]|$)/.test(value) ||
    /`[^`\r\n]+`/.test(value) ||
    /\[[^\]\r\n]+\]\([^()\r\n]+\)/.test(value);
  if (markdownPresentation) return true;

  const trimmed = value.trim();
  if (!((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]")))) {
    return false;
  }
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return parsed !== null && typeof parsed === "object";
  } catch {
    return false;
  }
}

function plainTextIssue(context: z.RefinementCtx, value: string | null, path: Array<string | number>) {
  if (value !== null && hasFormattedOrSerializedText(value)) {
    context.addIssue({ code: "custom", message: "Use plain text without formatting or pasted code.", path });
  }
}


export const EditableResourceFieldsSchema = z
  .object({
    title: PlainText(300),
    type: z.enum(EDITABLE_CONTENT_TYPES),
    authority: z.enum(EDITABLE_AUTHORITIES),
    layer: z.enum(EDITABLE_LAYERS),
    summary: PlainText(2_000),
    whyItMatters: OptionalPlainText(3_000),
    body: z
      .array(PlainText(10_000))
      .min(1)
      .max(200)
      .refine((parts) => parts.reduce((total, part) => total + part.length, 0) <= 100_000),
    nextActions: z
      .array(z.object({ label: PlainText(200), href: SafeLink }).strict())
      .max(30),
    tags: z.array(PlainText(100)).max(50),
    intents: z.array(z.enum(EDITABLE_INTENTS)).min(1).max(EDITABLE_INTENTS.length),
    pathIds: z.array(z.string().trim().regex(/^[a-z0-9][a-z0-9_-]{0,99}$/)).max(50),
    owner: PlainText(200),
    reviewDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`))),
    scope: z.enum(["agencywide", "dsd"]),
    href: OptionalPlainText(2_000).refine(
      (value) => value === null || /^https:\/\/[^\s]+$/i.test(value),
      "Use a secure web address.",
    ),
    sourceName: OptionalPlainText(300),
  })
  .strict()
  .superRefine((fields, context) => {
    plainTextIssue(context, fields.title, ["title"]);
    plainTextIssue(context, fields.summary, ["summary"]);
    plainTextIssue(context, fields.whyItMatters, ["whyItMatters"]);
    plainTextIssue(context, fields.owner, ["owner"]);
    plainTextIssue(context, fields.sourceName, ["sourceName"]);
    fields.body.forEach((part, index) => plainTextIssue(context, part, ["body", index]));
    fields.nextActions.forEach((action, index) =>
      plainTextIssue(context, action.label, ["nextActions", index, "label"]),
    );
    fields.tags.forEach((tag, index) => plainTextIssue(context, tag, ["tags", index]));
  });

export const ResourceDraftRequestSchema = z
  .object({
    expectedRevisionId: z.string().uuid(),
    fields: EditableResourceFieldsSchema,
    changeNote: z.string().trim().max(500).nullable(),
  })
  .strict();

export type EditableResourceFields = z.infer<typeof EditableResourceFieldsSchema>;
export type ResourceDraftRequest = z.infer<typeof ResourceDraftRequestSchema>;

export type EditableResourceState = {
  contentItemId: string;
  expectedRevisionId: string;
  publishedRevisionId: string | null;
  hasUnpublishedChanges: boolean;
  fields: EditableResourceFields;
};

export function editableFieldsFromContent(item: ContentItem): EditableResourceFields {
  return EditableResourceFieldsSchema.parse({
    title: item.title,
    type: item.type,
    authority: item.authority,
    layer: item.layer,
    summary: item.summary,
    whyItMatters: item.whyItMatters ?? null,
    body: item.body,
    nextActions: item.nextActions,
    tags: item.tags,
    intents: item.intents,
    pathIds: item.pathIds ?? [],
    owner: item.owner,
    reviewDate: item.reviewDate,
    scope: item.scope,
    href: item.href ?? null,
    sourceName: item.sourceName ?? null,
  });
}
