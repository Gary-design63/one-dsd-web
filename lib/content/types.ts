/** Canonical content model (PRD §12): one content object governs all renditions. */

export type AuthorityLabel =
  | "official"
  | "guidance"
  | "practice_note"
  | "learning"
  | "community_brief"
  | "partner_informed"
  | "local"
  | "under_review"
  | "external_verify";

export const AUTHORITY: Record<AuthorityLabel, { label: string; staffNote: string; citeable: boolean }> = {
  official: {
    label: "Official",
    staffNote: "DHS policy or official guidance. Check the named source and current version before you rely on it.",
    citeable: true,
  },
  guidance: {
    label: "Guidance",
    staffNote: "A practical job aid or checklist from this program. Confirm policy questions with the person responsible for that policy.",
    citeable: true,
  },
  practice_note: {
    label: "Practice note",
    staffNote: "A practical approach from the Equity and Inclusion Operations Consultant. It is not policy.",
    citeable: true,
  },
  learning: {
    label: "Learning",
    staffNote: "A learning module or scenario for orientation and practice. Follow its named sources for details.",
    citeable: true,
  },
  community_brief: {
    label: "Community brief",
    staffNote: "A Minnesota community brief for preparation. It does not describe any one person; review it with appropriate community partners.",
    citeable: true,
  },
  partner_informed: {
    label: "Partner-informed",
    staffNote: "Material shaped with lived experience or partner knowledge. Check the item for its named contributors and review status.",
    citeable: true,
  },
  local: {
    label: "Local (administration)",
    staffNote: "Material for an administration-level pilot. It applies only to that administration.",
    citeable: true,
  },
  under_review: {
    label: "Review in progress",
    staffNote: "This material is still being reviewed. Confirm important details before relying on it.",
    citeable: false,
  },
  external_verify: {
    label: "Outside source; check before use",
    staffNote: "A public source outside this program. Check the current source before relying on it.",
    citeable: false,
  },
};

export type ContentType =
  | "policy"
  | "job_aid"
  | "tool"
  | "checklist"
  | "practice_note"
  | "learning_module"
  | "scenario"
  | "question_bank"
  | "external_reference";

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  policy: "Policy",
  job_aid: "Job aid",
  tool: "Tool",
  checklist: "Checklist",
  practice_note: "Practice note",
  learning_module: "Learning module",
  scenario: "Scenario",
  question_bank: "Question bank",
  external_reference: "External reference",
};

/** Progressive-disclosure layer: L1 orient, L2 do, L3 deeper method, L4 reference and evidence. */
export type ContentLayer = "L1" | "L2" | "L3" | "L4";

export const LAYER_LABEL: Record<ContentLayer, string> = {
  L1: "Quick orientation",
  L2: "How to do it",
  L3: "Deeper method",
  L4: "Reference and evidence",
};

/** Describe a review date without presenting a future date as completed work. */
export function reviewDateText(reviewDate: string, asOf = new Date()): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate)) return "Review date to be confirmed";
  const date = new Date(`${reviewDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "Review date to be confirmed";
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
  const today = asOf.toISOString().slice(0, 10);
  return reviewDate > today ? `Planned review ${formatted}` : `Reviewed ${formatted}`;
}

export type AskIntent =
  | "policy_orientation"
  | "practice_method"
  | "launch_embed"
  | "access_barriers"
  | "workplace_culture"
  | "intercultural"
  | "uncertainty_authority"
  | "escalation"
  | "next_actions"
  | "facilitation"
  | "boundary_refusal";

export type NextAction = { label: string; href: string };

export type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  authority: AuthorityLabel;
  layer: ContentLayer;
  /** One or two sentences: the short answer. */
  summary: string;
  /** Why this matters at the moment of work. */
  whyItMatters?: string;
  /** Body paragraphs or list items (plain text). */
  body: string[];
  /** Independent next actions offered before optional consult. */
  nextActions: NextAction[];
  tags: string[];
  intents: AskIntent[];
  /** Graduation paths this item supports. */
  pathIds?: string[];
  owner: string;
  reviewDate: string; // ISO date
  status: "approved" | "under_review" | "retired";
  scope: "agencywide" | "dsd";
  accessibility: "reviewed" | "pending";
  /** External link (only for external_verify items). */
  href?: string;
  sourceName?: string;
  /** Migration provenance when harvested from prior artifacts. */
  provenance?: string;
  version: string;
};
