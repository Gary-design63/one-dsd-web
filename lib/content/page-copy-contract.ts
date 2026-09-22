import { z } from "zod";
import { lintStaffCopy } from "@/lib/brand/lint";
import { PROGRAM } from "@/lib/constants";
import { hasFormattedOrSerializedText } from "./resource-editor-contract";

export const PAGE_BLOCK_SURFACES = ["home", "footer"] as const;
export type PageBlockSurface = (typeof PAGE_BLOCK_SURFACES)[number];

export const PAGE_BLOCK_IDS: Record<PageBlockSurface, string> = {
  home: "page-home",
  footer: "site-footer",
};

export const PAGE_REVIEW_DIMENSIONS = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
] as const;
export type PageReviewDimension = (typeof PAGE_REVIEW_DIMENSIONS)[number];

export const PAGE_REVIEW_LABELS: Record<PageReviewDimension, string> = {
  language_alignment: "Staff language",
  factual_currentness: "Accuracy and currentness",
  accessibility: "Accessibility",
  scope: "Where it applies",
  placement: "Placement and wayfinding",
};

export const PAGE_REVIEW_STATUSES = ["pass", "revise", "blocked", "not_applicable"] as const;
export type PageReviewStatus = (typeof PAGE_REVIEW_STATUSES)[number];

export const PAGE_REVIEW_STATUS_LABELS: Record<PageReviewStatus, string> = {
  pass: "Ready",
  revise: "Needs changes",
  blocked: "Not ready",
  not_applicable: "Does not apply",
};

export function hasPagePresentationSyntax(value: string): boolean {
  return (
    /(^|[\r\n])\s{0,3}>\s+\S/.test(value) ||
    /(^|[\r\n])\s{0,3}\d+\)\s+\S/.test(value) ||
    /(^|[\r\n])\s{0,3}(?:-{3,}|_{3,}|\*{3,})\s*$/.test(value) ||
    /(^|[\r\n])\s*\|[^\r\n]+\|\s*$/.test(value) ||
    /(^|[\s(])(?:\*[^*\r\n]+\*|_[^_\r\n]+_)(?=$|[\s).,;:!?])/.test(value)
  );
}
/**
 * Schema-level lint keeps model brands, internal terms, personas, ranking and icon-only text out of
 * published copy. Phrasing the owner later ruled out ("ruled_out") is enforced by the staff-voice
 * tests on current copy, not here, so historical publications and migrations still parse.
 */
function publishedCopyFindings(value: string) {
  return lintStaffCopy(value).filter((finding) => finding.code !== "ruled_out");
}

function plainText(maximum: number, minimum = 1) {
  return z
    .string()
    .trim()
    .min(minimum)
    .max(maximum)
    .refine((value) => !hasFormattedOrSerializedText(value) && !hasPagePresentationSyntax(value), "Use plain text without formatting or pasted code.")
    .refine((value) => publishedCopyFindings(value).length === 0, "Use the program's plain staff language without icons or technical product wording.");
}

export function isSafePageLink(value: string): boolean {
  if (/^\/(?!\/)/.test(value)) {
    return !/[\u0000-\u001f\u007f\\<>"\s]/.test(value) && !/(?:^|\/)\.\.(?:\/|$)/.test(value);
  }
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password &&
      !/[\u0000-\u001f\u007f\s<>"\\]/.test(value)
    );
  } catch {
    return false;
  }
}

const safeLink = z.string().trim().min(1).max(2_000).refine(isSafePageLink, "Use a program path or a secure web address.");

export const HOME_COPY_KEYS = [
  "heroKicker",
  "headlineLine1",
  "headlineLine2",
  "headlineLine3",
  "heroLede",
  "heroNote",
  "heroImageAlt",
  "primaryActionLabel",
  "primaryActionHref",
  "secondaryActionLabel",
  "secondaryActionHref",
  "aboutLabel",
  "aboutText",
  "guidedKicker",
  "guidedTitle",
  "guidedIntro",
  "guidedFallbackLabel",
  "guidedFallbackNote",
  "helpKicker",
  "helpTitle",
  "askLabel",
  "askHref",
  "askDescription",
  "communitiesLabel",
  "communitiesHref",
  "communitiesDescription",
  "resourcesLabel",
  "resourcesHref",
  "resourcesDescription",
  "supportLabel",
  "supportHref",
  "supportAvailableDescription",
  "supportPreviewDescription",
  "goalsKicker",
  "goalsTitle",
  "foundationLabel",
  "foundationHref",
  "learnLabel",
  "learnHref",
  "applyLabel",
  "applyHref",
  "leadLabel",
  "leadHref",
  "commitmentsKicker",
  "commitmentsTitle",
  "commitmentsLinkLabel",
  "commitmentsLinkHref",
  "privacyLabel",
  "privacyText",
] as const;

export const HomePageCopySchema = z
  .object({
    heroKicker: plainText(200),
    headlineLine1: plainText(200),
    headlineLine2: plainText(200),
    headlineLine3: plainText(200),
    heroLede: plainText(1_000),
    heroNote: plainText(2_000, 0),
    heroImageAlt: plainText(500),
    primaryActionLabel: plainText(200),
    primaryActionHref: safeLink,
    secondaryActionLabel: plainText(200),
    secondaryActionHref: safeLink,
    aboutLabel: plainText(200),
    aboutText: plainText(3_000),
    guidedKicker: plainText(200),
    guidedTitle: plainText(300),
    guidedIntro: plainText(3_000),
    guidedFallbackLabel: plainText(300),
    guidedFallbackNote: plainText(1_000),
    helpKicker: plainText(200),
    helpTitle: plainText(500),
    askLabel: plainText(200),
    askHref: safeLink,
    askDescription: plainText(2_000),
    communitiesLabel: plainText(200),
    communitiesHref: safeLink,
    communitiesDescription: plainText(2_000),
    resourcesLabel: plainText(200),
    resourcesHref: safeLink,
    resourcesDescription: plainText(2_000),
    supportLabel: plainText(200),
    supportHref: safeLink,
    supportAvailableDescription: plainText(2_000),
    supportPreviewDescription: plainText(2_000),
    goalsKicker: plainText(200),
    goalsTitle: plainText(500),
    foundationLabel: plainText(500),
    foundationHref: safeLink,
    learnLabel: plainText(500),
    learnHref: safeLink,
    applyLabel: plainText(500),
    applyHref: safeLink,
    leadLabel: plainText(500),
    leadHref: safeLink,
    commitmentsKicker: plainText(200),
    commitmentsTitle: plainText(500),
    commitmentsLinkLabel: plainText(300),
    commitmentsLinkHref: safeLink,
    privacyLabel: plainText(200),
    privacyText: plainText(3_000),
  })
  .strict();

export type HomePageCopy = z.infer<typeof HomePageCopySchema>;

export const FOOTER_COPY_KEYS = [
  "identityKicker",
  "identityText",
  "helpHeading",
  "askLabel",
  "askHref",
  "resourcesLabel",
  "resourcesHref",
  "communitiesLabel",
  "communitiesHref",
  "requestAvailableLabel",
  "requestPreviewLabel",
  "requestHref",
  "trackLabel",
  "trackHref",
  "escalationLabel",
  "escalationHref",
  "privacyHeading",
  "privacyText",
] as const;

export const FooterCopySchema = z
  .object({
    identityKicker: plainText(200),
    identityText: plainText(4_000),
    helpHeading: plainText(200),
    askLabel: plainText(200),
    askHref: safeLink,
    resourcesLabel: plainText(200),
    resourcesHref: safeLink,
    communitiesLabel: plainText(200),
    communitiesHref: safeLink,
    requestAvailableLabel: plainText(300),
    requestPreviewLabel: plainText(300),
    requestHref: safeLink,
    trackLabel: plainText(300),
    trackHref: safeLink,
    escalationLabel: plainText(500),
    escalationHref: safeLink,
    privacyHeading: plainText(200),
    privacyText: plainText(4_000),
  })
  .strict();

export type FooterCopy = z.infer<typeof FooterCopySchema>;
export type PageBlockCopy = HomePageCopy | FooterCopy;

const pageCanonicalBase = {
  id: z.enum([PAGE_BLOCK_IDS.home, PAGE_BLOCK_IDS.footer]),
  blockType: z.enum(PAGE_BLOCK_SURFACES),
  status: z.enum(["approved", "under_review"]),
  accessibility: z.enum(["reviewed", "pending"]),
  scope: z.enum(["agencywide", "dsd"]),
  version: z.string().trim().min(1).max(40),
};

export const HomePageBlockPayloadSchema = z
  .object({ ...pageCanonicalBase, id: z.literal(PAGE_BLOCK_IDS.home), blockType: z.literal("home"), copy: HomePageCopySchema })
  .strict();
export const FooterPageBlockPayloadSchema = z
  .object({ ...pageCanonicalBase, id: z.literal(PAGE_BLOCK_IDS.footer), blockType: z.literal("footer"), copy: FooterCopySchema })
  .strict();
export const PageBlockPayloadSchema = z.discriminatedUnion("blockType", [
  HomePageBlockPayloadSchema,
  FooterPageBlockPayloadSchema,
]);
export type PageBlockPayload = z.infer<typeof PageBlockPayloadSchema>;

export const STATIC_HOME_COPY: HomePageCopy = HomePageCopySchema.parse({
  heroKicker: "One DHS People, Access and Culture Program",
  headlineLine1: "One DHS People,",
  headlineLine2: "Access and Culture",
  headlineLine3: "Program",
  heroLede: PROGRAM.heroLede,
  heroNote: "",
  heroImageAlt: "Colleagues standing in a circle in a bright office, talking and smiling.",
  primaryActionLabel: "Start with your work",
  primaryActionHref: "/start",
  secondaryActionLabel: "Ask a question",
  secondaryActionHref: "/ask",
  aboutLabel: "Bring the work in front of you.",
  aboutText: "Ask a question, find reviewed guidance, practice with something you can use, or identify the right person to involve. Ordinary learning and practice are voluntary. Notes you choose to save stay on this computer.",
  guidedKicker: "Areas of work",
  guidedTitle: "What are you responsible for today?",
  guidedIntro: "Choose the area closest to your work. Each area connects learning, practical questions, reviewed material, something you can use, and the people who hold the relevant responsibility.",
  guidedFallbackLabel: "Not sure where your work fits?",
  guidedFallbackNote: "Answer three short questions about your role, task, and timing. Start will suggest a useful place to begin and explain why.",
  helpKicker: "Choose a way to work",
  helpTitle: "Ask, Minnesota Communities, Library, or Support",
  askLabel: "Ask",
  askHref: "/ask",
  askDescription: "Ask a work question and get a clear answer with its sources and limits. No meeting is needed.",
  communitiesLabel: "Minnesota Communities",
  communitiesHref: "/minnesota-communities",
  communitiesDescription: "Prepare for Minnesota work with questions about access, engagement, who to involve, and what not to assume. Community information is never a label for a person.",
  resourcesLabel: "Library",
  resourcesHref: "/library",
  resourcesDescription: "Search reviewed checklists, job aids, question banks, learning materials, and source notes. Each item shows where it came from, who reviewed it, and its limits.",
  supportLabel: "Support",
  supportHref: "/support",
  supportAvailableDescription: "Find the responsible DHS person or office. Eligible DSD work can also request direct consultation.",
  supportPreviewDescription: "Find the responsible DHS person or office, and review how direct consultation works for eligible DSD work.",
  goalsKicker: "Keep moving",
  goalsTitle: "Explore, learn, practice, and see One DSD",
  foundationLabel: "Areas of work: enter through a decision or responsibility",
  foundationHref: "/areas",
  learnLabel: "Learn: move through six stages at your own pace",
  learnHref: "/learn",
  applyLabel: "Practice: make something you can use",
  applyHref: "/practice",
  leadLabel: "One DSD: explore the divisional reference program",
  leadHref: "/one-dsd",
  commitmentsKicker: "Core commitments",
  commitmentsTitle: "Six commitments behind every decision",
  commitmentsLinkLabel: "Learn how the program works",
  commitmentsLinkHref: "/about",
  privacyLabel: "Protect your privacy.",
  privacyText: "Please do not enter case, medical, personnel, complaint, or identifying details anywhere in this program. Guidance shows its sources and limits. It does not replace official policy, legal advice, Human Resources, civil-rights processes, Tribal consultation, or another responsible office.",
});

export const STATIC_FOOTER_COPY: FooterCopy = FooterCopySchema.parse({
  identityKicker: "One DHS People, Access and Culture Program",
  identityText: "A resource for DHS staff, run by the program. It is not connected to DHS information technology, case, or personnel systems. Its guidance supports everyday work and does not replace policy, legal advice, formal processes, or decisions made by responsible DHS offices. Authority labels show what each item can and cannot establish.",
  helpHeading: "Find your next step",
  askLabel: "Ask a question",
  askHref: "/ask",
  resourcesLabel: "Library",
  resourcesHref: "/library",
  communitiesLabel: "Minnesota Communities",
  communitiesHref: "/minnesota-communities",
  requestAvailableLabel: "Support and DSD consultation",
  requestPreviewLabel: "Support and DSD consultation guidance",
  requestHref: "/support",
  trackLabel: "Check a DSD consultation request",
  trackHref: "/support/track",
  escalationLabel: "Find the right person or office",
  escalationHref: "/support/right-person",
  privacyHeading: "Privacy and access",
  privacyText: "Please leave out case, medical, personnel, complaint, and identifying details anywhere in this program. Notes you write are saved only on this computer, so another person who uses it could see them. If any part of the program is hard to use with assistive technology, Support explains how to tell us.",
});

export function pageCopySchema(surface: PageBlockSurface) {
  return surface === "home" ? HomePageCopySchema : FooterCopySchema;
}

export function parsePageBlockPayload(surface: PageBlockSurface, value: unknown): PageBlockPayload {
  return surface === "home"
    ? HomePageBlockPayloadSchema.parse(value)
    : FooterPageBlockPayloadSchema.parse(value);
}

export function staticPageCopy(surface: "home"): HomePageCopy;
export function staticPageCopy(surface: "footer"): FooterCopy;
export function staticPageCopy(surface: PageBlockSurface): PageBlockCopy {
  return surface === "home" ? STATIC_HOME_COPY : STATIC_FOOTER_COPY;
}

export type PageBlockReview = {
  reviewId: string | null;
  dimension: PageReviewDimension;
  status: "pending" | PageReviewStatus;
  note: string | null;
};

export type PageBlockHistoryEntry = {
  revisionId: string;
  label: string;
  publishedAt: string;
  isCurrent: boolean;
};

export type PageBlockEditingState<TCopy extends PageBlockCopy = PageBlockCopy> = {
  surface: PageBlockSurface;
  contentItemId: string;
  expectedRevisionId: string;
  publishedRevisionId: string | null;
  publicationDecisionId: string | null;
  isPublished: boolean;
  hasUnpublishedChanges: boolean;
  copy: TCopy;
  reviews: PageBlockReview[];
  canPublish: boolean;
  history: PageBlockHistoryEntry[];
};

const noteSchema = z
  .string()
  .trim()
  .max(1_000)
  .nullable()
  .refine((value) => value === null || (!hasFormattedOrSerializedText(value) && !hasPagePresentationSyntax(value) && publishedCopyFindings(value).length === 0), {
    message: "Use a plain note without icons or technical product wording.",
  });

export const PageSaveActionSchema = z.object({
  action: z.literal("save_changes"),
  expectedRevisionId: z.string().uuid(),
  expectedPublicationDecisionId: z.string().regex(/^\d+$/).nullable(),
  copy: z.unknown(),
  changeNote: noteSchema,
}).strict();

export const PageDraftActionSchema = z.object({
  action: z.literal("save_draft"),
  expectedRevisionId: z.string().uuid(),
  copy: z.unknown(),
  changeNote: noteSchema,
}).strict();

export const PageReviewActionSchema = z.object({
  action: z.literal("record_review"),
  revisionId: z.string().uuid(),
  dimension: z.enum(PAGE_REVIEW_DIMENSIONS),
  status: z.enum(PAGE_REVIEW_STATUSES),
  expectedReviewId: z.string().uuid().nullable(),
  note: noteSchema,
}).strict();

export const PagePublishActionSchema = z.object({
  action: z.literal("publish"),
  revisionId: z.string().uuid(),
  expectedPublicationDecisionId: z.string().regex(/^\d+$/).nullable(),
  reason: plainText(500),
}).strict();

export const PageWithdrawActionSchema = z.object({
  action: z.literal("withdraw"),
  expectedPublishedRevisionId: z.string().uuid(),
  expectedPublicationDecisionId: z.string().regex(/^\d+$/).nullable(),
  reason: plainText(500),
}).strict();

export const PageRollbackActionSchema = z.object({
  action: z.literal("rollback"),
  expectedPublishedRevisionId: z.string().uuid().nullable(),
  targetRevisionId: z.string().uuid(),
  expectedPublicationDecisionId: z.string().regex(/^\d+$/).nullable(),
  reason: plainText(500),
}).strict();

export const PageCopyActionSchema = z.discriminatedUnion("action", [
  PageSaveActionSchema,
  PageDraftActionSchema,
  PageReviewActionSchema,
  PagePublishActionSchema,
  PageWithdrawActionSchema,
  PageRollbackActionSchema,
]);
export type PageCopyAction = z.infer<typeof PageCopyActionSchema>;
