/**
 * Plain-Language & Accessibility Reviewer (mindset workflow (b)). A2 review drafts.
 * Never claims a WCAG pass; every review carries an evidence note.
 */
import { lintStaffCopy, readingLevelEstimate } from "@/lib/brand/lint";
import { runTool } from "../tools/runtime";
import type { ToolContext } from "../types";

export type A11yFinding = {
  code: string;
  severity: "blocker" | "should_fix" | "note";
  message: string;
  remediation: string;
  evidence?: string;
};

export type A11yReviewDraft = {
  findings: A11yFinding[];
  readingLevel: ReturnType<typeof readingLevelEstimate>;
  evidenceNote: string;
  disposition: "draft_only";
};

export async function a11yScan(input: { text: string; html?: string; artifactType: "notice" | "web" | "slides" | "document" | "learning" }, ctx: ToolContext): Promise<A11yReviewDraft> {
  return runTool(ctx, "a11y.scan_draft", () => scan(input));
}

export function scan(input: { text: string; html?: string; artifactType: string }): A11yReviewDraft {
  const findings: A11yFinding[] = [];
  const text = input.text ?? "";
  const html = input.html ?? "";

  // Structure
  if (html) {
    const headings = Array.from(html.matchAll(/<h([1-6])\b/gi)).map((m) => Number(m[1]));
    if (!headings.length && html.length > 800) findings.push({ code: "no_headings", severity: "should_fix", message: "No headings found in a long document.", remediation: "Add real heading elements in order (h1, then h2, then h3)." });
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) {
        findings.push({ code: "heading_skip", severity: "should_fix", message: `Heading level jumps from h${headings[i - 1]} to h${headings[i]}.`, remediation: "Do not skip heading levels." });
        break;
      }
    }
    const imgs = Array.from(html.matchAll(/<img\b[^>]*>/gi)).map((m) => m[0]);
    for (const img of imgs) {
      if (!/\balt\s*=/.test(img)) findings.push({ code: "img_no_alt", severity: "blocker", message: "An image has no alt attribute.", remediation: "Add alt text that says what matters, or alt=\"\" for decorative images.", evidence: img.slice(0, 80) });
      else if (/\balt\s*=\s*["'](?:image|photo|picture|graphic|icon)["']/i.test(img)) findings.push({ code: "img_generic_alt", severity: "should_fix", message: "Alt text is generic.", remediation: "Describe what the image conveys in context.", evidence: img.slice(0, 80) });
    }
    if (/<(video|audio)\b/i.test(html) && !/<track\b/i.test(html) && !/transcript/i.test(html)) findings.push({ code: "media_no_captions", severity: "blocker", message: "Media without captions or a transcript.", remediation: "Add captions (track element) and a transcript." });
    if (/autoplay/i.test(html)) findings.push({ code: "autoplay", severity: "blocker", message: "Media is set to autoplay.", remediation: "Remove autoplay." });
    if (/<table\b/i.test(html) && !/<th\b/i.test(html)) findings.push({ code: "table_no_headers", severity: "should_fix", message: "Table without header cells.", remediation: "Mark header cells with th and scope." });
    if (/draggable|ondrag|dragstart/i.test(html)) findings.push({ code: "drag_only", severity: "should_fix", message: "Drag interaction detected.", remediation: "Provide a non-drag alternative (buttons or select)." });
    if (/onmouseover|:hover\s*\{[^}]*display/i.test(html)) findings.push({ code: "hover_only", severity: "should_fix", message: "Content may appear only on hover.", remediation: "Make it reachable by keyboard and focus." });
    if (/color\s*:\s*#(?:ccc|ddd|eee|aaa|bbb)\b|#9\w{2}\b/i.test(html)) findings.push({ code: "low_contrast_hint", severity: "note", message: "Light gray text colors found.", remediation: "Check body text contrast reaches 4.5:1; this scan cannot measure contrast." });
    if (/<a\b[^>]*>\s*(?:click here|here|read more|link)\s*<\/a>/i.test(html)) findings.push({ code: "link_text", severity: "should_fix", message: "Non-descriptive link text.", remediation: "Describe the destination in the link text." });
    if (/tabindex\s*=\s*["']?[1-9]/i.test(html)) findings.push({ code: "tabindex_positive", severity: "should_fix", message: "Positive tabindex changes tab order.", remediation: "Use DOM order; tabindex 0 or -1 only." });
  } else if (text.length > 1200 && !/\n\s*\n/.test(text)) {
    findings.push({ code: "wall_of_text", severity: "should_fix", message: "Long text with no paragraph breaks or headings.", remediation: "Add headings and one idea per paragraph." });
  }

  // Plain language
  const rl = readingLevelEstimate(text);
  for (const f of rl.flags) findings.push({ code: "reading_level", severity: "should_fix", message: f, remediation: "Shorter sentences; everyday words; one idea per sentence." });
  if (/\b(?:pursuant to|heretofore|aforementioned|in accordance with|utilize|facilitate the|shall be deemed)\b/i.test(text)) findings.push({ code: "jargon", severity: "should_fix", message: "Legal or bureaucratic phrasing found.", remediation: "Use everyday words: 'under', 'use', 'is'." });
  if (/\b(?:click here|see below|as stated above)\b/i.test(text)) findings.push({ code: "vague_reference", severity: "note", message: "Vague reference found.", remediation: "Name the thing you refer to." });
  if (/[A-Z]{2,}(?:\s+[A-Z]{2,}){4,}/.test(text)) findings.push({ code: "all_caps_block", severity: "should_fix", message: "Block of all-caps text.", remediation: "Use sentence case; emphasize with structure, not caps." });
  if (/\b(?:red|green) (?:means|indicates|shows)\b/i.test(text) || /\b(?:in red|in green|highlighted in)\b/i.test(text)) findings.push({ code: "color_only", severity: "should_fix", message: "Meaning conveyed by color alone.", remediation: "Add a text label as well as color." });

  // Brand and no-icons
  for (const l of lintStaffCopy(text)) {
    findings.push({ code: l.code, severity: l.code === "icon_only" ? "blocker" : "should_fix", message: `${l.message} (${l.match})`, remediation: l.code === "icon_only" ? "Replace the symbol with a text label." : "Remove model, vendor, or internal terms from staff-facing copy." });
  }

  return {
    findings,
    readingLevel: rl,
    evidenceNote:
      "Draft review only. This scan checks structure, text patterns, and copy rules. It does not measure color contrast, test with assistive technology, or verify keyboard operation. It is not evidence of WCAG 2.2 AA conformance; a human owns the release disposition.",
    disposition: "draft_only",
  };
}

export function altTextSuggest(context: { subject: string; purpose: "informative" | "decorative" | "functional"; surroundingText?: string }): { candidates: string[]; note: string } {
  if (context.purpose === "decorative") return { candidates: ['alt=""'], note: "Decorative images get empty alt text. A human confirms it is truly decorative." };
  const s = context.subject.trim();
  return {
    candidates: context.purpose === "functional" ? [`${s} (opens ${context.surroundingText ?? "the destination"})`, `Go to ${s}`] : [s, `${s}, shown to ${context.surroundingText ?? "support the surrounding text"}`],
    note: "Alt text candidates for a human to verify, including representation. Synthetic or illustrative imagery must not be described as documentary evidence of real people or communities.",
  };
}

export const KEYBOARD_CHECKLIST = [
  "Every control is reachable with Tab and operable with Enter or Space.",
  "Focus is visible on every control (3:1 contrast, not removed).",
  "Tab order follows reading order; no positive tabindex.",
  "No content appears only on hover; anything on hover is also on focus.",
  "Drag-and-drop tasks have a non-drag alternative.",
  "Timed activities can be extended or turned off.",
  "Skip link to main content exists and works.",
  "Dialogs trap and return focus; Escape closes them.",
  "Media has captions and transcripts; nothing autoplays; no flashing between 2 and 55 Hz.",
  "Every control, status, and navigation item has a visible text label; no icon-only cues.",
];
