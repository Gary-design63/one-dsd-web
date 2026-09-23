/**
 * Staff copy and brand lint (plain.reading_level_check + a11y.no_icons_lint).
 * Source: Staff Copy & Brand Pass v0.1 §3 banned terms; PRD §12 no-icons rule (KPI-04).
 * Used at build time (scripts/brand-check.mjs) and at runtime on every string
 * destined for a staff-facing response.
 */

export type LintFinding = {
  code: "model_brand" | "internal_term" | "persona" | "ranking" | "icon_only" | "ruled_out";
  match: string;
  index: number;
  message: string;
};

/** Model, vendor, and AI brand words are never staff-facing product identity. */
const MODEL_BRAND = [
  /\b(?:an?\s+)?AI\b/g,
  /\bartificial intelligence\b/gi,
  /\bLLM\b/g,
  /\bGPT(?:-?\d+[a-z]*)?\b/gi,
  /\bChatGPT\b/gi,
  // The Harlem Renaissance writer is subject matter, not product branding.
  /\bClaude\b(?!\s+McKay\b)/g,
  /\bAnthropic\b/g,
  /\bOpenAI\b/gi,
  /\bGemini\b/g,
  /\bCopilot\b/g,
  /\bPerplexity\b/gi,
  /\bVercel\b/gi,
  /\bchatbot\b/gi,
  /\bAI assistant\b/gi,
  /\bdigital twin\b/gi,
];

/** Internal control-plane vocabulary stays in engineering docs and the Consultant Workspace. */
const INTERNAL_TERM = [
  /\bmulti-?agent\b/gi,
  /\borchestrator\b/gi,
  /\bdispatcher\b/gi,
  /\bspecialist agent\b/gi,
  /\bmindset twin\b/gi,
  /\bsystem prompt\b/gi,
  /\bembeddings\b|\b(?:vector|text) embeddings?\b/gi,
  /\bvector(?:s| search| store)\b/gi,
  /\bRAG\b/g,
  /\binference\b/gi,
  /\btemperature\b/gi,
  /\bmodel registry\b/gi,
  /\bprovider adapter\b/gi,
  /\bprovider route\b/gi,
  /\bautonomy level\b/gi,
  /\bagentic\b/gi,
  /\bAPI\b/g,
  /\bendpoint\b/gi,
  /\b(?:local|session) storage\b/gi,
  /\bbrowser tab\b/gi,
  /\benvironment variables?\b/gi,
  /\bdeployment\b/gi,
  /\bruntime\b/gi,
  /\bserver-side\b/gi,
  /\bbackend\b/gi,
  /\bfrontend\b/gi,
  /\bserialized\b/gi,
  /\bpayload\b/gi,
  /\bmetadata\b/gi,
  /\bfixture\b/gi,
  /\bdebug(?:ging)?\b/gi,
  /\bbuild pipeline\b/gi,
  /\bprovenance\b/gi,
  /\bhallucinat(?:e|ed|ion|ions)\b/gi,
];

/** System-sounding phrasing the owner ruled out of staff copy on September 12, 2026. */
const RULED_OUT = [
  /\bhuman (?:support|advice|judgment|escalation|guidance)\b/gi,
  /\bprotected work\b/gi,
  /\bdoes not grant access\b/gi,
  /\bweb browser you are using\b/gi,
  /\btailored answer\b/gi,
  /\brefresh(?:es|ing)? (?:it|the page|this page)\b/gi,
];

const PERSONA = [/\bGary'?s (?:AI|bot|twin|assistant|tool)\b/gi];

const RANKING = [/\bmaturity score\b/gi, /\bequity scorecard\b/gi, /\bleaderboard\b/gi];

/** Emoji and symbol ranges that would be icon-only cues. */
const ICON_ONLY =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F2FF}]|(?:^|\s)[✓✔✗✘★☆●▶►▲▼◆■□]+(?:\s|$)/gu;

function collect(
  text: string,
  patterns: RegExp[],
  code: LintFinding["code"],
  message: string,
): LintFinding[] {
  const out: LintFinding[] = [];
  for (const p of patterns) {
    p.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = p.exec(text)) !== null) {
      out.push({ code, match: m[0], index: m.index, message });
      if (!p.global) break;
    }
  }
  return out;
}

/**
 * Lint a staff-facing string. Returns findings; empty means clean.
 * `allowInternal` is true only for Consultant Workspace / owner surfaces.
 */
export function lintStaffCopy(text: string, opts: { allowInternal?: boolean } = {}): LintFinding[] {
  const findings: LintFinding[] = [
    ...collect(text, MODEL_BRAND, "model_brand", "Model or vendor brand in staff-facing copy."),
    ...collect(text, PERSONA, "persona", "Personal-brand or persona language in staff-facing copy."),
    ...collect(text, RANKING, "ranking", "Ranking or scoring language about people or units."),
  ];
  if (!opts.allowInternal) {
    findings.push(
      ...collect(text, INTERNAL_TERM, "internal_term", "Internal implementation term in staff-facing copy."),
      ...collect(text, RULED_OUT, "ruled_out", "Phrasing the owner ruled out of staff-facing copy."),
    );
  }
  ICON_ONLY.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ICON_ONLY.exec(text)) !== null) {
    findings.push({
      code: "icon_only",
      match: m[0].trim(),
      index: m.index,
      message: "Icon or symbol-only cue in staff-facing copy.",
    });
  }
  return findings;
}

/**
 * Scrub a generated string so it never reaches staff with brand or internal terms.
 * Replacement is conservative: it substitutes an approved alternative rather than deleting meaning.
 */
export function scrubStaffCopy(text: string): string {
  let out = text;
  const swaps: Array<[RegExp, string]> = [
    [/\bhallucinat(?:e|ed|ion|ions)\b/gi, "uncertain"],
    [/\bchatbot\b/gi, "this program"],
    [/\bAI assistant\b/gi, "this program"],
    [/\bdigital twin\b/gi, "this program"],
    [/\bmindset twin\b/gi, "this program"],
    [/\b(?:the |an? )?orchestrator\b/gi, "this program"],
    [/\bspecialist agent\b/gi, "guided help"],
    [/\bmulti-?agent\b/gi, "guided"],
    [/\bsystem prompt\b/gi, "approved instructions"],
    [/\bembeddings\b|\b(?:vector|text) embeddings?\b/gi, "search"],
    [/\bClaude\b/g, "this program"],
    [/\bAnthropic\b/g, "this program"],
    [/\bOpenAI\b/gi, "this program"],
    [/\bChatGPT\b/gi, "this program"],
    [/\bGPT(?:-?\d+[a-z]*)?\b/gi, "this program"],
    [/\bGemini\b/g, "this program"],
    [/\bCopilot\b/g, "this program"],
    [/\bPerplexity\b/gi, "public-source research"],
    [/\bVercel\b/gi, "this program"],
    [/\bartificial intelligence\b/gi, "this program"],
    [/\bLLM\b/g, "this program"],
    [/\b(?:an?\s+)?AI\b/g, "this program"],
  ];
  for (const [re, rep] of swaps) out = out.replace(re, rep);
  return out.replace(ICON_ONLY, " ").replace(/\s{2,}/g, " ").trim();
}

/** Rough reading-difficulty estimate (sentences, words, long words). Not a compliance claim. */
export function readingLevelEstimate(text: string): {
  sentences: number;
  words: number;
  avgWordsPerSentence: number;
  longWordShare: number;
  flags: string[];
} {
  const sentences = Math.max(1, (text.match(/[.!?]+(\s|$)/g) ?? []).length);
  const wordsArr = text.split(/\s+/).filter(Boolean);
  const words = wordsArr.length;
  const longWords = wordsArr.filter((w) => w.replace(/[^a-z]/gi, "").length >= 10).length;
  const avg = words / sentences;
  const longShare = words ? longWords / words : 0;
  const flags: string[] = [];
  if (avg > 25) flags.push("Sentences average more than 25 words. Break them up.");
  if (longShare > 0.15) flags.push("Many long words. Prefer plain, shorter words.");
  return {
    sentences,
    words,
    avgWordsPerSentence: Math.round(avg * 10) / 10,
    longWordShare: Math.round(longShare * 100) / 100,
    flags,
  };
}
