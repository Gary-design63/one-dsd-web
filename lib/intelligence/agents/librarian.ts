/**
 * Resource Classifier / Librarian (mindset workflow (a)). A2 drafts; human confirms before
 * publication impact. Never invents authority: a claim of Official status without an owner and
 * source is downgraded to 'under_review' with the uncertainty stated.
 */
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import type { AuthorityLabel, ContentLayer, ContentType } from "@/lib/content/types";
import { runTool } from "../tools/runtime";
import type { ToolContext } from "../types";

export type ClassifyInput = {
  title: string;
  text: string;
  declaredAuthority?: AuthorityLabel;
  owner?: string;
  sourceUrl?: string;
  reviewDate?: string;
};

export type ClassificationDraft = {
  type: ContentType;
  audience: Array<"staff" | "supervisors" | "equity_directors" | "content_owners">;
  authority: AuthorityLabel;
  currency: "current" | "review_due" | "stale" | "unknown";
  reviewNeed: "none" | "owner_review" | "representation_review" | "accessibility_review";
  layer: ContentLayer;
  uncertainty: string[];
  disposition: "draft_only";
};

export async function classifyDraft(input: ClassifyInput, ctx: ToolContext): Promise<ClassificationDraft> {
  return runTool(ctx, "resource.classify_draft", () => classify(input));
}

export function classify(input: ClassifyInput): ClassificationDraft {
  const text = `${input.title}\n${input.text}`;
  const lower = text.toLowerCase();
  const uncertainty: string[] = [];

  let type: ContentType = "practice_note";
  if (/checklist|check list|\[ \]|before you|step \d/.test(lower)) type = "checklist";
  else if (/job aid|how to|steps?:|template/.test(lower)) type = "job_aid";
  else if (/module|lesson|learning objective|scenario|course/.test(lower)) type = /scenario/.test(lower) ? "scenario" : "learning_module";
  else if (/question bank|questions to ask/.test(lower)) type = "question_bank";
  else if (/statute|bulletin|policy number|effective date|shall\b/.test(lower)) type = "policy";
  else if (/^https?:\/\//.test(input.text.trim()) || (input.sourceUrl && input.text.length < 400)) type = "external_reference";

  let authority: AuthorityLabel = input.declaredAuthority ?? "under_review";
  if (authority === "official") {
    if (!input.owner || !input.sourceUrl) {
      authority = "under_review";
      uncertainty.push("Declared Official, but no named owner and source location were supplied. Downgraded to Under review until a human confirms authority.");
    } else {
      uncertainty.push("Official status must be confirmed by the designated owner before publication impact.");
    }
  }
  if (!input.declaredAuthority) {
    if (type === "external_reference") authority = "external_verify";
    else if (type === "learning_module" || type === "scenario") authority = "learning";
    else uncertainty.push("No authority declared. Draft label is Under review; owner must choose Guidance, Practice note, or Learning.");
  }

  const audience: ClassificationDraft["audience"] = ["staff"];
  if (/supervisor|team lead|manager/.test(lower)) audience.push("supervisors");
  if (/equity director|administration|pilot/.test(lower)) audience.push("equity_directors");
  if (/publish|content owner|review date/.test(lower)) audience.push("content_owners");

  let currency: ClassificationDraft["currency"] = "unknown";
  if (input.reviewDate && /^\d{4}-\d{2}-\d{2}$/.test(input.reviewDate)) {
    const days = (new Date(input.reviewDate + "T00:00:00Z").getTime() - Date.now()) / 86400000;
    currency = days > 30 ? "current" : days >= 0 ? "review_due" : "stale";
  } else uncertainty.push("No review date; currency unknown.");

  let reviewNeed: ClassificationDraft["reviewNeed"] = "owner_review";
  if (/somali|hmong|karen|oromo|latino|community|tribal|nation|immigrant|refugee|black|african american|deaf/.test(lower)) reviewNeed = "representation_review";
  else if (/image|photo|video|audio|chart|pdf|slides/.test(lower)) reviewNeed = "accessibility_review";

  const words = text.split(/\s+/).length;
  const layer: ContentLayer = type === "external_reference" ? "L4" : words < 150 ? "L1" : words < 600 ? "L2" : words < 1500 ? "L3" : "L4";

  return { type, audience, authority, currency, reviewNeed, layer, uncertainty, disposition: "draft_only" };
}

export type StaleFlag = { id: string; title: string; owner: string; reviewDate: string; problem: "past_review_date" | "review_due_soon" | "missing_owner" | "accessibility_pending" };

/** resource.stale_detect: flags only; disposition is human. Missing context never auto-removes. */
export async function staleDetect(ctx: ToolContext, now = new Date()): Promise<StaleFlag[]> {
  return runTool(ctx, "resource.stale_detect", async () => {
    const out: StaleFlag[] = [];
    // Owner review covers both current scopes. The DSD publication view includes
    // shared agencywide items, and respects the selected source and release gate.
    const { items } = await loadStaffContentSnapshot({ scope: "dsd" });
    for (const c of items) {
      const days = (new Date(c.reviewDate + "T00:00:00Z").getTime() - now.getTime()) / 86400000;
      if (days < 0) out.push({ id: c.id, title: c.title, owner: c.owner, reviewDate: c.reviewDate, problem: "past_review_date" });
      else if (days < 45) out.push({ id: c.id, title: c.title, owner: c.owner, reviewDate: c.reviewDate, problem: "review_due_soon" });
      if (!c.owner) out.push({ id: c.id, title: c.title, owner: c.owner, reviewDate: c.reviewDate, problem: "missing_owner" });
      if (c.accessibility === "pending") out.push({ id: c.id, title: c.title, owner: c.owner, reviewDate: c.reviewDate, problem: "accessibility_pending" });
    }
    return out;
  });
}

export function tagLayerDraft(text: string): { layer: ContentLayer; why: string } {
  const words = text.split(/\s+/).length;
  const layer: ContentLayer = words < 150 ? "L1" : words < 600 ? "L2" : words < 1500 ? "L3" : "L4";
  return { layer, why: `About ${words} words; ${layer} is a draft suggestion for a human to confirm.` };
}
