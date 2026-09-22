/**
 * Safety micro-tools (Tools Catalog §4.2). Always-on hard stops. Fail closed.
 *
 * safety.pii_detect, safety.surveillance_refuse, safety.persona_refuse,
 * safety.publish_refuse, safety.tribal_gate, safety.privacy_notice.
 *
 * Rules: log refusal codes and field classes only, never the raw payload.
 */
import { PRIVACY_NOTICE, PROGRAM } from "@/lib/constants";
import type { SafetyResult } from "../types";
import { lintStaffCopy } from "@/lib/brand/lint";
import { plainText } from "../research/providers";

const ALT_SELF_DIRECTED = [
  { label: "Explore Resources", href: "/library" },
  { label: "Explore Minnesota Communities", href: "/minnesota-communities" },
  { label: "Review the consultation request preview", href: "/support/request" },
];

/* ---------- PII detection ---------- */

const HARD_IDENTIFIERS: Array<{ re: RegExp; cls: string }> = [
  { re: /\b\d{3}-\d{2}-\d{4}\b/, cls: "Social Security number" },
  { re: /\bSSN\b[:\s#]*\d/i, cls: "Social Security number" },
  { re: /\b(?:case|claim|client|PMI|MA|MAXIS|MMIS|MnCHOICES|recipient|member)\s*(?:id|number|no\.?|#)\s*[:#]?\s*[A-Z]?\d{4,}/i, cls: "Case or client identifier" },
  { re: /\b(?:date of birth|DOB)\b[:\s]*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/i, cls: "Date of birth" },
  { re: /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/, cls: "Phone number" },
  { re: /\b\d{1,5}\s+[A-Z][a-z]+\s+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Lane|Ln|Dr|Drive|Ct|Court)\b\.?/, cls: "Street address" },
];

/** Words that make a named person a prohibited payload when they co-occur. */
const SENSITIVE_DESCRIPTORS =
  /\b(?:diagnos(?:is|ed)|disabilit(?:y|ies)|accommodat(?:e|ed|ion|ions)|autis(?:m|tic)|cerebral palsy|schizophreni|bipolar|depression|dementia|HIV|medical|medication|hospitali[sz]ed|eligib(?:le|ility)|denied|waiver case|service authorization|assessment|MA (?:case|eligibility)|SNAP case|foster|CPS|child protection|substance|addiction|mental health|IEP|guardianship|SSI|SSDI|complaint|grievance|investigat(?:e|ion)|disciplin(?:e|ary)|terminat(?:e|ed|ion)|harass(?:ed|ment)|performance review|PIP)\b/i;

/** A named individual: honorific + name, or a relationship word followed by a capitalized name. */
const NAMED_INDIVIDUAL =
  /\b(?:Mr\.?|Ms\.?|Mrs\.?|Miss|Dr\.?)\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?(?:\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?)?|\b(?:client|patient|participant|recipient|resident|consumer|coworker|co-worker|colleague|employee|supervisor|manager|staff member|worker|my boss|caseworker)\s+(?:named\s+)?[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?(?:\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?)?|\b(?:named|called)\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?(?:\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?)?/;

/**
 * Names also arrive without an honorific or relationship word. This pattern is deliberately
 * limited to person-like two-part names (including an initial and possessives). It is used only
 * when sensitive case, health, disability, complaint, or personnel language is also present.
 */
const BARE_PERSON_EVENT =
  /\b(?:[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?|[A-Z]\.?)\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?(?:(?:['\u2019]s\s+(?:accommodation|assessment|case|complaint|diagnosis|disability|grievance|performance review))|\s+(?:received|requested|reported|filed|had|has|was|is)\b)/;

/** Lowercase names are ambiguous, so require a person-specific event verb as well. */
const LOWERCASE_PERSON_EVENT =
  /\b[a-z][a-z'-]{1,}\s+[a-z][a-z'-]{1,}(?:['\u2019]s)?\s+(?:received|requested|reported|filed|was denied|was diagnosed|had (?:an?\s+)?(?:accommodation|assessment|performance review|complaint|grievance))\b/;

const HR_PAYLOAD =
  /\b(?:file|filing|filed)\s+(?:a\s+)?(?:complaint|grievance)|\b(?:complaint|grievance)\s+(?:about|against)\b|\binvestigat(?:e|ion|ing)\s+(?:my|a|the|our)?\s*(?:coworker|co-worker|colleague|employee|supervisor|manager|staff)|\b(?:discipline|disciplin(?:e|ary action)|write[- ]up|fire|terminate|demote|suspend)\s+(?:my|a|the|this|our)?\s*(?:coworker|co-worker|colleague|employee|supervisor|manager|staff|person|him|her|them)\b/i;

export function piiDetect(text: string): SafetyResult {
  const t = text ?? "";
  for (const h of HARD_IDENTIFIERS) {
    if (h.re.test(t)) return refusePii(h.cls);
  }
  const hasNamed = NAMED_INDIVIDUAL.test(t) || BARE_PERSON_EVENT.test(t) || LOWERCASE_PERSON_EVENT.test(t);
  const hasSensitive = SENSITIVE_DESCRIPTORS.test(t);
  if (hasNamed && HR_PAYLOAD.test(t)) return hrRedirect();
  if (HR_PAYLOAD.test(t) && /\b(?:he|she|they|him|her|them|my (?:coworker|supervisor|manager|employee))\b/i.test(t)) return hrRedirect();
  if (hasNamed && hasSensitive) return refusePii("Named person with case, medical, disability, or personnel details");
  return { ok: true };
}

/** A stricter gate for questions that may leave this platform for public-source research. */
const OUTBOUND_IDENTIFIERS: Array<{ re: RegExp; cls: string }> = [
  { re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, cls: "Email address" },
  { re: /\b(?:employee|staff|worker|personnel)\s*(?:id|number|no\.?|#)\s*[:#]?\s*[A-Z0-9-]{3,}\b/i, cls: "Employee identifier" },
];

const SPECIFIC_PERSON_ROLE =
  /\b(?:my|our|this|the|a|an)\s+(?:client|patient|participant|recipient|resident|member|employee|coworker|co-worker|colleague|supervisor|manager|staff member|worker|caseworker)\b/i;

const NONPUBLIC_MATERIAL =
  /\b(?:confidential|privileged|nonpublic|not public|predecisional|internal draft|sensitive draft|do not share|not for distribution|personnel-only|attorney-client)\b/i;

export function externalResearchGate(text: string): SafetyResult {
  const first = piiDetect(text);
  if (!first.ok) return first;
  for (const item of OUTBOUND_IDENTIFIERS) {
    if (item.re.test(text)) return refusePii(item.cls);
  }
  if (SPECIFIC_PERSON_ROLE.test(text) && SENSITIVE_DESCRIPTORS.test(text)) {
    return refusePii("Case, medical, disability, complaint, eligibility, or personnel details about a specific person");
  }
  if (NONPUBLIC_MATERIAL.test(text)) return refusePii("Confidential or nonpublic material");
  if (HR_PAYLOAD.test(text)) return hrRedirect();
  return { ok: true };
}
export type StaffDisplayTextKind = "narrative" | "label" | "source_title";

const AI_SUBJECT =
  /\b(?:AI|artificial intelligence|large language model|LLM|GPT(?:-?\d+[a-z]*)?|ChatGPT|OpenAI|Claude|Anthropic|Gemini|Copilot|Perplexity|machine learning)\b/i;

const STAFF_PROCESS_PREAMBLE = [
  /^(?:based on|according to) (?:my|the) (?:web )?(?:search|research|analysis|review|retrieved (?:context|documents?)|provided (?:context|documents?)|search results?),?\s*/i,
  /^(?:after|while) (?:searching|reviewing|checking|analyzing) (?:the )?(?:web|sources|documents?),?\s*/i,
  /^I found that\s+/i,
];

const STAFF_PROCESS_SENTENCE = [
  /^(?:as (?:an? )?(?:AI|artificial(?: intelligence|-intelligence)|language[- ]model) (?:assistant|model|system)|I(?: am|'m) (?:an? )?(?:AI|artificial(?: intelligence|-intelligence)|language[- ]model) (?:assistant|model|system))\b/i,
  /^(?:generated|produced|written|prepared) by (?:an? )?(?:AI|language model|Perplexity|OpenAI|ChatGPT|Claude|Gemini|Copilot)\b/i,
  /^(?:this|the) (?:answer|response|output|message)\b[^.!?]{0,180}\b(?:generated|produced|written|prepared|created|uses?|used)\b/i,
  /^(?:I|we) (?:searched|browsed|queried|retrieved|reviewed|checked|analy[sz]ed|used|consulted|processed|looked through)\b/i,
  /^(?:the|this|my) (?:model|provider|assistant|chatbot|agent|system prompt|retrieval (?:pipeline|system)|API|tool)\b[^.!?]{0,180}\b(?:generated|produced|found|searched|retrieved|processed|used|returned|cannot|can't|failed)\b/i,
  /^(?:here(?:'s| is)|below is) (?:a |an |the |my )?(?:answer|response|summary|analysis)\b/i,
  /^(?:search|retrieval|processing|generation) (?:is )?(?:complete|completed|finished|failed|unavailable)\b/i,
  /^(?:I hope (?:this|that) helps|let me know if|would you like me to|as requested\b|sure[,.!]|certainly[,.!])/i,
  /^(?:\[?(?:system|assistant|developer|tool|provider|model)\]?(?:\s+(?:message|note|output|response))?\s*:)/i,
];

function splitNarrativeSentences(value: string): string[] {
  const sentences: string[] = [];
  let start = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (!".!?".includes(value[index] ?? "")) continue;
    let end = index + 1;
    while (end < value.length && ".!?".includes(value[end] ?? "")) end += 1;
    while (/^\[\d+]/.test(value.slice(end))) {
      const close = value.indexOf("]", end);
      if (close < 0) break;
      end = close + 1;
    }
    if (end < value.length && !/\s/.test(value[end] ?? "")) continue;
    const sentence = value.slice(start, end).trim();
    if (sentence) sentences.push(sentence);
    while (end < value.length && /\s/.test(value[end] ?? "")) end += 1;
    start = end;
    index = end - 1;
  }

  const remainder = value.slice(start).trim();
  if (remainder) sentences.push(remainder);
  return sentences;
}

function withoutProcessPreamble(value: string): string {
  let result = value.trim();
  for (const pattern of STAFF_PROCESS_PREAMBLE) result = result.replace(pattern, "");
  return result.trim();
}

function looksLikeSerializedResponse(value: string): boolean {
  return /^\s*[\[{]\s*["'](?:answer|assistant|content|message|model|provider|response|role|system)["']\s*:/i.test(value);
}

function isProcessCommentary(value: string): boolean {
  return STAFF_PROCESS_SENTENCE.some((pattern) => pattern.test(value));
}

/**
 * Final presentation gate for generated or outside-research text.
 *
 * Source titles use formatting cleanup only, because renaming a cited work would be misleading.
 * Narrative fields also lose provider identity and implementation commentary sentence by sentence.
 */
export function staffDisplayText(
  value: string,
  options: { kind?: StaffDisplayTextKind } = {},
): string {
  const cleaned = plainText(value ?? "");
  if (!cleaned || options.kind === "source_title") return cleaned;
  if (looksLikeSerializedResponse(cleaned)) return "";

  return cleaned
    .split(/\n{2,}/)
    .map((paragraph) =>
      splitNarrativeSentences(paragraph.replace(/[ \t]*\n[ \t]*/g, " "))
        .map(withoutProcessPreamble)
        .filter((sentence) => sentence && !isProcessCommentary(sentence))
        .join(" "),
    )
    .filter(Boolean)
    .join("\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function isAiSubjectQuestion(question: string): boolean {
  return AI_SUBJECT.test(question ?? "");
}

/**
 * Dynamic validation for generated narrative. AI and vendor names may remain when AI is the
 * user's subject; provider/process commentary and all other staff-language findings still fail.
 */
export function staffGeneratedCopyIsAcceptable(value: string, question: string): boolean {
  const cleaned = staffDisplayText(value);
  if (!cleaned) return false;
  const allowAiSubjectTerms = isAiSubjectQuestion(question);
  return lintStaffCopy(cleaned).every(
    (finding) => allowAiSubjectTerms && finding.code === "model_brand",
  );
}


function refusePii(fieldClass: string): SafetyResult {
  return {
    ok: false,
    code: "pii_detected",
    fieldClass,
    message:
      `This entry may include private information about a person (${fieldClass.toLowerCase()}). To protect their privacy, please remove names, identifiers, and any case, medical, or personnel details. Then describe the program or situation in general terms. ${PROGRAM.staffBrand} is not a place to share or keep private information about a person.`,
    alternatives: ALT_SELF_DIRECTED,
  };
}

function hrRedirect(): SafetyResult {
  return {
    ok: false,
    code: "hr_complaint_redirect",
    fieldClass: "Complaint, investigation, or discipline about a named person",
    message:
      "This matter needs a confidential channel. Complaints, investigations, grievances, or discipline involving a person should go to Employee Culture, Human Resources, or the civil-rights channel. This program does not investigate or keep those details. If you are working on general team climate without a complaint about a named person, the workplace culture path may help.",
    redirect: { label: "See who to contact", href: "/library/pn-when-to-escalate" },
    alternatives: [{ label: "Team climate path (not a complaint)", href: "/practice/gp-4" }],
  };
}

/* ---------- Surveillance / ranking ---------- */

const SURVEILLANCE =
  /\b(?:rank|ranking|score|scoring|scorecard|leaderboard|grade|rate)\b[^.]{0,60}\b(?:my |our |the )?(?:team|staff|supervisors?|employees?|unit|units|people|coworkers?|colleagues?|managers?|administrations?|divisions?|departments?|workers?|graduation progress|equity maturity|maturity)\b|\b(?:equity|cultural(?:ly)?(?: competence| competent)?)\s+(?:maturity\s+)?(?:score|scores|scorecard|ranking|rank|grade)\b|\b(?:who|which (?:staff|supervisor|team|employee))\b[^.]{0,40}\b(?:least|most)\s+(?:equitable|inclusive|competent|compliant|woke|biased)\b|\bbelief profil|\bideolog(?:y|ical)\s+(?:score|compliance|test)|\bcompliance scor/i;

const SURVEILLANCE_STRONG_ACTION =
  /\b(?:rank|ranking|score|scoring|scorecard|leaderboard|grade|rate|rating|profile|profiling|compare|classify|categorize|order|sort|arrange|assign|stratify|cluster|quartiles?|tiers?|buckets?|segments?|labels?)\b/i;
const SURVEILLANCE_OBSERVE_ACTION =
  /\b(?:chart|evaluate|assess|monitor|track|report|sequence|band|group|place|map|determine|identify|create|summarize|show|showing|display|list|listing|measure|analyze)\b/i;
const SURVEILLANCE_GENERATE_ACTION =
  /\b(?:develop|produce|build|provide|make|give|generate|create)\b/i;
const SURVEILLANCE_PROFILE_ARTIFACT =
  /\b(?:matrix|dashboards?|index|quartiles?|heat\s*maps?|rosters?|reports?)\b/i;
const SURVEILLANCE_PEOPLE =
  /\b(?:staff|staff members?|employees?|workers?|personnel|supervisors?|people|persons?|individuals?|members?|coworkers?|colleagues?|managers?)\b/i;
const SURVEILLANCE_MEASURE =
  /\b(?:equity|dei|inclusive|inclusion|maturity|readiness|bias|beliefs?|ideolog(?:y|ical)|participation|engagement|learning|training|course(?:-|\s+)completion|completion|activity|behavior|cultural(?:ly)?(?:\s+(?:competenc\w*|capab\w*))?)\b/i;
const PERSON_LEVEL_TARGET =
  /\b(?:each|every|individual|per|which)\b[^.]{0,30}\b(?:staff|staff members?|employees?|workers?|personnel|persons?|members?|supervisors?)\b|\b(?:staff|employees?|workers?|members?|supervisors?)(?:['’]s|s['’])\b|\b(?:employee-by-employee|staff-level|employee-level|worker-level|person-level)\b|\b(?:by|per)\s+(?:each\s+|individual\s+)?(?:staff|employee|worker|person|member|supervisor)\b|\bfor\s+(?:each\s+|every\s+|their\s+|the\s+)?(?:staff|employee|worker|person|member|supervisor)\b/i;
const SURVEILLANCE_COMPARATIVE =
  /\b(?:most|least|more|less|highest|lowest|furthest|farthest|best|worst|top|bottom)\b/i;
const SURVEILLANCE_DESTINATION =
  /\b(?:for|to|with)\s+(?:the\s+)?(?:supervisors?|managers?|management)\b/i;
const SURVEILLANCE_BASIS =
  /\b(?:based\s+on|on\s+the\s+basis\s+of|according\s+to)\b/i;

// A terminal, comma-separated negative modifier states a boundary, not an action.
// Remove only that modifier and still scan the whole remaining text. In particular,
// "Rank employees by equity, without scoring people" must continue to be refused.
const NEGATIVE_PEOPLE_SCORING_MODIFIER =
  /,\s*without\s+(?:scoring|ranking)\s+(?:people|staff|employees|supervisors)\s*(?=[.!?]?$)/gi;

export function surveillanceRefuse(text: string): SafetyResult {
  const candidate = (text ?? "").replace(NEGATIVE_PEOPLE_SCORING_MODIFIER, "");
  const semanticSurveillance = SURVEILLANCE_PEOPLE.test(candidate)
    && SURVEILLANCE_MEASURE.test(candidate)
    && (SURVEILLANCE_STRONG_ACTION.test(candidate)
      || SURVEILLANCE_COMPARATIVE.test(candidate)
      || SURVEILLANCE_BASIS.test(candidate)
      || (SURVEILLANCE_OBSERVE_ACTION.test(candidate) && PERSON_LEVEL_TARGET.test(candidate))
      || (SURVEILLANCE_PROFILE_ARTIFACT.test(candidate)
        && (PERSON_LEVEL_TARGET.test(candidate) || SURVEILLANCE_DESTINATION.test(candidate)))
      || (SURVEILLANCE_GENERATE_ACTION.test(candidate)
        && SURVEILLANCE_PROFILE_ARTIFACT.test(candidate)));
  if (!SURVEILLANCE.test(candidate) && !semanticSurveillance) return { ok: true };
  return {
    ok: false,
    code: "surveillance_refused",
    fieldClass: "Ranking, scoring, or profiling of people or units",
    message:
      "This program does not score or rank people, teams, or administrations, create profiles of anyone's beliefs, or use participation to evaluate employees. You can use its tools and learning paths to reflect on your own work, and your private learning activity is not reported to supervisors.",
    alternatives: [
      { label: "Team climate action plan focused on everyday practices", href: "/library/ja-climate-action-plan" },
      { label: "Learning paths", href: "/practice" },
    ],
  };
}

/* ---------- Persona ---------- */

const PERSONA =
  /\b(?:talk|speak|respond|answer|reply|act|write)\s+(?:to me\s+)?(?:as|like)\s+(?:if you (?:were|are)\s+)?(?:\[|Gary|the practice owner|a named|a person|(?:the |a |an )?\w+ (?:leader|director|consultant|manager|commissioner))|\bpretend (?:to be|you are)\b|\bimpersonate\b|\b(?:Gary'?s|the consultant'?s)\s+(?:AI|bot|twin|assistant|voice)\b|\b(?:AI|digital)\s+twin\b[^.]{0,40}\b(?:take|run|handle|attend)\b|\btake the meeting\b[^.]{0,30}\btwin\b/i;

export function personaRefuse(text: string): SafetyResult {
  if (!PERSONA.test(text ?? "")) return { ok: true };
  return {
    ok: false,
    code: "persona_refused",
    fieldClass: "Persona or impersonation request",
    message:
      `${PROGRAM.staffBrand} cannot speak for or impersonate a named leader, the Equity and Inclusion Operations Consultant, or anyone else. You can still use Ask and Resources for program guidance or review the consultation request preview when you need an answer from a person.`,
    alternatives: ALT_SELF_DIRECTED,
  };
}

/* ---------- Publish / send ---------- */

const PUBLISH =
  /\b(?:send|email|e-mail|post|publish|blast|broadcast|distribute|announce)\b[^.]{0,50}\b(?:to (?:all|every|the whole|everyone|staff|the team|the division|the agency|the public)|official|all-?staff|listserv|intranet|website|memo to|announcement)\b|\bemail blast\b|\bsend (?:the|an|this)\s+(?:official|final)\b/i;

export function publishRefuse(text: string): SafetyResult {
  if (!PUBLISH.test(text ?? "")) return { ok: true };
  return {
    ok: false,
    code: "publish_refused",
    fieldClass: "Publish or send official communication",
    message:
      "This program cannot publish material or send an official communication for you. It can help you prepare a draft, which the responsible person must review, approve, and send. The plain-language checklist can help with the draft.",
    alternatives: [
      { label: "Plain language and accessible documents checklist", href: "/library/ja-plain-language" },
      { label: "Form, notice, or letter change packet", href: "/library/ja-form-notice-change" },
    ],
  };
}

/* ---------- Tribal gate ---------- */

const TRIBAL =
  /\b(?:tribal|tribe|tribes|nation'?s?|Ojibwe|Anishinaabe|Dakota|Chippewa|Sioux|Red Lake|White Earth|Leech Lake|Mille Lacs|Fond du Lac|Bois Forte|Grand Portage|Lower Sioux|Upper Sioux|Prairie Island|Shakopee|Mdewakanton|ICWA|MIFPA|Indian (?:policy|child|country|affairs)|Native (?:American|children|child|families|family|people)|American Indian|Indigenous|enrolled member|reservation)\b/i;

export function tribalGate(text: string): SafetyResult {
  if (!TRIBAL.test(text ?? "")) return { ok: true };
  return {
    ok: false,
    code: "tribal_gate",
    fieldClass: "Tribal Nation or Native-specific content",
    message:
      "This work may involve a Tribal Nation, Native children, Tribal data, services, or land. Government-to-government consultation must come first. This program does not provide guidance for a specific Nation without documented authority or infer anyone's Tribal affiliation. Please contact the Office of Indian Policy or your Tribal liaison before continuing.",
    redirect: { label: "Guidance for work involving Tribal Nations", href: "/minnesota-communities/tribal-nations" },
    alternatives: [
      { label: "When a question needs a human", href: "/library/pn-when-to-escalate" },
      { label: "Review the consultation request preview", href: "/support/request" },
    ],
  };
}

/* ---------- Legal invention guard ---------- */

/** Detects a request for a specific statute or rule citation so the answer can refuse to invent one. */
export function wantsCitation(text: string): boolean {
  return /\b(?:statute|rule|regulation|citation|cite|section|chapter|CFR|USC|Minn\.?\s*Stat\.?|Minnesota Statutes|policy number|bulletin number|what (?:law|statute|rule) (?:says|requires|applies))\b/i.test(text ?? "");
}

/* ---------- Privacy notice ---------- */

export function privacyNotice(surface: keyof typeof PRIVACY_NOTICE): string {
  return PRIVACY_NOTICE[surface];
}

/* ---------- Combined pre-gate ---------- */

export type GateOptions = { tribal?: boolean };

/** Run all hard gates in priority order. First failure wins. */
export function runSafetyGates(text: string, opts: GateOptions = { tribal: true }): SafetyResult {
  const checks: Array<(t: string) => SafetyResult> = [piiDetect, surveillanceRefuse, personaRefuse, publishRefuse];
  if (opts.tribal !== false) checks.push(tribalGate);
  for (const check of checks) {
    const r = check(text);
    if (!r.ok) return r;
  }
  return { ok: true };
}

/**
 * ASK answers topics broadly. Information about publishing, Tribal history, or a
 * person's public work is not permission to act or impersonate them. Other tools
 * retain their stricter gates for carrying out governed program tasks.
 */
export function askSafetyGates(text: string): SafetyResult {
  const directPrivacy = piiDetect(text);
  if (!directPrivacy.ok) return directPrivacy;
  const privateInformation = externalResearchGate(text);
  const generalComplaintQuestion = !privateInformation.ok && privateInformation.code === "hr_complaint_redirect";
  const privacyDefinition = /^(?:what (?:is|are|does)|define|explain the term)\s+(?:confidential|nonpublic|privileged)(?:\s+(?:information|material|data|communications?))?(?:\s+mean)?\??$/i.test(text.trim());
  // A general process or definition question contains no private case to handle.
  if (!privateInformation.ok && !generalComplaintQuestion && !privacyDefinition) return privateInformation;
  const educational = /^(?:what (?:is|are|does)|why (?:is|are|do|does)|explain|define|tell me about)\b/i.test(text.trim());
  if (!educational) {
    const surveillance = surveillanceRefuse(text);
    if (!surveillance.ok) return surveillance;
  }
  return { ok: true };
}

/** Anti-profiling detector for CI: applying group membership to predict a named or specific individual. */
const PROFILING =
  /\b(?:my|this|the|a)\s+(?:somali|hmong|karen|oromo|latino|latina|hispanic|mexican|black|african american|vietnamese|cambodian|khmer|lao|russian|ukrainian|arab|arabic|deaf|native|indian|asian|african|muslim|immigrant|refugee)[- ]?(?:speaking\s+)?(?:client|patient|participant|family|parent|mother|father|coworker|employee|person|man|woman|kid|child|student)\b[^.]{0,80}\b(?:will|would|is going to|probably|likely|must|always|never|won'?t|doesn'?t|don'?t|can'?t|because (?:they|she|he|of their))\b|\bhow (?:do|should) i (?:handle|deal with|manage|treat)\s+(?:my|this|a)\s+(?:somali|hmong|karen|oromo|latino|latina|hispanic|mexican|black|african american|vietnamese|cambodian|khmer|lao|russian|ukrainian|arab|arabic|deaf|native|asian|african|muslim|immigrant|refugee)\b/i;

export function profilingRefuse(text: string): SafetyResult {
  if (!PROFILING.test(text ?? "")) return { ok: true };
  return {
    ok: false,
    code: "surveillance_refused",
    fieldClass: "Applying group notes to an individual",
    message:
      "A community brief can help you prepare for Minnesota work, but it cannot tell you what one person wants, believes, or will do. Please ask the person what they need and check language, disability and communication access, timing, and trust. Use the brief to notice assumptions, not to make predictions about a client or coworker.",
    alternatives: [
      { label: "Prepare for intercultural work without making assumptions", href: "/library/pn-intercultural-method" },
      { label: "Explore practical guidance in community briefs", href: "/minnesota-communities" },
      { label: "Access checks before a meeting", href: "/library/ja-access-checks" },
    ],
  };
}
