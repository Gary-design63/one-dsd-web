import { z } from "zod";
import { piiDetect, surveillanceRefuse } from "@/lib/intelligence/safety";

export type WorkspaceRole =
  | "owner"
  | "steward"
  | "member"
  | "contributor"
  | "reviewer"
  | "moderator"
  | "automation_operator"
  | "technical_operator";

export type ProgramWorkspace = {
  id: string;
  name: string;
  programName: string;
  scopeLabel: string;
  summary: string;
  status: "preview" | "pilot" | "active" | "archived";
  sample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMembership = {
  id: string;
  workspaceId: string;
  displayLabel: string;
  role: WorkspaceRole;
  status: "invited" | "active" | "suspended" | "expired" | "revoked";
  sample: boolean;
};

export type CollaborationChannel = {
  id: string;
  workspaceId: string;
  name: string;
  purpose: string;
  access: "workspace" | "private";
  position: number;
  sample: boolean;
  updatedAt: string;
};

export type ChannelMembership = {
  id: string;
  channelId: string;
  workspaceMembershipId: string;
  sample: boolean;
};

export type DiscussionThread = {
  id: string;
  channelId: string;
  title: string;
  createdByLabel: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  sample: boolean;
};

export type Post = {
  id: string;
  threadId: string;
  parentPostId: string | null;
  body: string;
  authorLabel: string;
  createdAt: string;
  updatedAt: string;
  moderationStatus: "visible" | "held" | "removed";
  sample: boolean;
};

export type PostReaction = {
  id: string;
  postId: string;
  memberId: string;
  label: "Helpful" | "Support" | "Question";
  sample: boolean;
};

export type CollaborationAttachment = {
  id: string;
  postId: string;
  fileName: string;
  mediaType: string;
  byteSize: number;
  checksum: string;
  status: "quarantined" | "approved" | "rejected";
  accessibilityStatus: "pending" | "reviewed" | "needs_work";
  sample: boolean;
};

export type MeetingSeries = {
  id: string;
  workspaceId: string;
  name: string;
  purpose: string;
  cadence: "monthly";
  scheduleNote: string;
  sample: boolean;
};

export type MeetingOccurrence = {
  id: string;
  seriesId: string;
  title: string;
  scheduleNote: string;
  accessNote: string;
  status: "planning" | "scheduled" | "completed" | "cancelled";
  sample: boolean;
  updatedAt: string;
};

export type AgendaItem = {
  id: string;
  meetingOccurrenceId: string;
  title: string;
  ownerLabel: string;
  minutes: number;
  position: number;
  sample: boolean;
};

export type Decision = {
  id: string;
  workspaceId: string;
  title: string;
  summary: string;
  status: "proposed" | "confirmed" | "superseded";
  confirmedByLabel?: string;
  confirmedAt?: string;
  sourceThreadId?: string;
  sample: boolean;
};

export type Poll = {
  id: string;
  channelId: string;
  question: string;
  options: Array<{ id: string; label: string }>;
  status: "draft" | "open" | "closed";
  sample: boolean;
};

export type PollResponse = {
  id: string;
  pollId: string;
  memberId: string;
  optionId: string;
  sample: boolean;
};

export type StructuredFeedback = {
  id: string;
  channelId: string;
  prompt: string;
  status: "draft" | "open" | "closed";
  sample: boolean;
};

export type StructuredFeedbackResponse = {
  id: string;
  feedbackId: string;
  authorLabel: string;
  response: string;
  createdAt: string;
  sample: boolean;
};

export type LearningActivity = {
  id: string;
  channelId: string;
  title: string;
  description: string;
  reflectionPrompt: string;
  status: "planned" | "open" | "complete";
  sample: boolean;
};

export type NotificationPreference = {
  id: string;
  memberId: string;
  channelId?: string;
  mode: "off" | "immediate" | "digest";
  quietHoursNote?: string;
  sample: boolean;
};

export type NotificationDelivery = {
  id: string;
  preferenceId: string;
  destinationClass: "native" | "email" | "microsoft";
  status: "pending" | "delivered" | "failed" | "cancelled";
  attemptCount: number;
  sample: boolean;
};

export type ActionItem = {
  id: string;
  workspaceId: string;
  title: string;
  ownerLabel: string;
  dueNote: string;
  status: "planned" | "in_progress" | "blocked" | "complete";
  sourceThreadId?: string;
  sample: boolean;
  updatedAt: string;
};

export type ContentProposal = {
  id: string;
  workspaceId: string;
  title: string;
  sourceThreadId?: string;
  status: "draft" | "submitted" | "accepted" | "rejected";
  sample: boolean;
};

export type AutomationPolicy = {
  id: string;
  workspaceId: string;
  name: string;
  status: "draft" | "approved" | "stopped" | "expired";
  exactDestination?: string;
  allowedAction: string;
  expiresAt?: string;
  sample: boolean;
};

export type AutomationRun = {
  id: string;
  policyId: string;
  status: "proposed" | "approved" | "running" | "completed" | "stopped" | "failed";
  resultNote: string;
  createdAt: string;
  sample: boolean;
};

export type OneDsdTeamWorkspaceState = {
  workspace: ProgramWorkspace;
  memberships: WorkspaceMembership[];
  channels: CollaborationChannel[];
  channelMemberships: ChannelMembership[];
  threads: DiscussionThread[];
  posts: Post[];
  reactions: PostReaction[];
  attachments: CollaborationAttachment[];
  meetingSeries: MeetingSeries[];
  meetingOccurrences: MeetingOccurrence[];
  agendaItems: AgendaItem[];
  decisions: Decision[];
  polls: Poll[];
  pollResponses: PollResponse[];
  feedback: StructuredFeedback[];
  feedbackResponses: StructuredFeedbackResponse[];
  learningActivities: LearningActivity[];
  notificationPreferences: NotificationPreference[];
  notificationDeliveries: NotificationDelivery[];
  actionItems: ActionItem[];
  contentProposals: ContentProposal[];
  automationPolicies: AutomationPolicy[];
  automationRuns: AutomationRun[];
  processedKeys: string[];
  revision: number;
};

const Id = z.string().trim().min(1).max(80).regex(/^[A-Za-z0-9_-]+$/);
const IdempotencyKey = z.string().trim().min(8).max(100).regex(/^[A-Za-z0-9_-]+$/);

export type CollaborationTextFinding = {
  code:
    | "hidden_text"
    | "private_information"
    | "presentation_syntax"
    | "decorative_symbol"
    | "tool_voice"
    | "technical_wording"
    | "pasted_data"
    | "unsafe_link"
    | "surveillance";
  message: string;
};

const HIDDEN_OR_CONTROL_TEXT =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060\u2066-\u2069\ufeff]/u;

const MARKDOWN_PRESENTATION = [
  /(^|[\r\n])\s{0,3}(?:#{1,6}|[-+*]|\d+[.)]|>)\s+\S/,
  /(^|[\r\n])\s{0,3}(?:```|~~~)/,
  /(^|[\r\n])\s{0,3}(?:[-*_]\s*){3,}(?:[\r\n]|$)/,
  /(^|[\r\n])\s*\|[^\r\n]*\|\s*(?:[\r\n]|$)/,
  /(^|[\r\n])[^\r\n]*\s\|\s[^\r\n]*(?:[\r\n]|$)/,
  /!\[[^\]\r\n]*\]\([^()\r\n]+\)/,
  /\[[^\]\r\n]+\]\([^()\r\n]+\)/,
  /\[[^\]\r\n]+\]\[[^\]\r\n]*\]/,
  /(^|[\r\n])\s*\[[^\]\r\n]+\]:\s+\S/,
  /\*\*[^*\r\n]+\*\*/,
  /__[^_\r\n]+__/,
  /(^|[\s(])\*[^*\r\n]+\*(?=$|[\s).,;:!?])/,
  /(^|[\s(])_[^_\r\n]+_(?=$|[\s).,;:!?])/,
  /~~[^~\r\n]+~~/,
  /`[^`\r\n]+`/,
  /<https?:\/\/[^>\r\n]+>/i,
];

const DECORATIVE_SYMBOL =
  /[\p{Extended_Pictographic}\u{1f1e6}-\u{1f1ff}\u{1f000}-\u{1f2ff}\u20e3\ufe0f\u2022\u2190-\u21ff\u2300-\u23ff\u2460-\u24ff\u25a0-\u27bf\u2b00-\u2bff]/u;

const TOOL_SELF_IDENTIFICATION = [
  /\b(?:as|speaking as)\s+(?:an?\s+)?(?:AI(?=\s*[,.;:!?]|$)|AI\s+(?:language\s+)?(?:assistant|system|model|tool)\b|artificial intelligence|language model|chatbot|digital assistant|ChatGPT|Claude|Gemini|Copilot)\b/i,
  /\bI(?:'m| am)\s+(?:an?\s+)?(?:AI(?=\s*[,.;:!?]|$)|AI\s+(?:language\s+)?(?:assistant|system|model|tool)\b|artificial intelligence|language model|chatbot|digital assistant)\b/i,
  /\bI\s+(?:was|have been)\s+(?:generated|created|written|produced)\s+by\s+(?:AI|ChatGPT|Claude|OpenAI|Anthropic|Gemini|Copilot|Perplexity)\b/i,
  /\b(?:this|the)\s+(?:answer|response|message|content|text)\s+(?:was|is|has been)?\s*(?:generated|written|created|provided|produced)\s+by\s+(?:AI|ChatGPT|Claude|OpenAI|Anthropic|Gemini|Copilot|Perplexity)\b/i,
  /\baccording to\s+(?:ChatGPT|Claude|Gemini|Copilot|Perplexity)\s*[,;:]/i,
  /\b(?:according to\s+)?(?:ChatGPT|Claude|OpenAI|Anthropic|Gemini|Copilot|Perplexity)\s*[,;:]?\s+(?:says|said|writes|wrote|responded|answered|recommends|recommended|generated)\b/i,
];

const TECHNICAL_SHOP_TALK =
  /\b(?:API(?:\s+(?:endpoint|key|token))?|access token|secret key|environment variables?|system prompt|developer message|prompt injection|JSON payload|request payload|response payload|backend|frontend|runtime|deploy(?:ment|ed|ing)?|debug(?:ging)?|stack trace|source code|database schema|SQL quer(?:y|ies)|vector (?:database|store|search)|embeddings?|RAG|retrieval[- ]augmented generation|model (?:router|registry)|provider (?:adapter|route)|orchestrator|multi[- ]agent|agentic workflow|webhook|serverless function|build pipeline)\b/i;

const SERIALIZED_OR_CODE_TEXT = [
  /<\/?[A-Za-z][^>\r\n]*>/,
  /<\?xml\b/i,
  /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=/,
  /\b[A-Za-z_$][\w$]*\s*=>/,
  /(^|[\r\n])\s*[A-Za-z][\w -]{0,40}:\s+\S[^\r\n]*[\r\n]+\s*[A-Za-z][\w -]{0,40}:\s+\S/,
  /(?:^|\s)\{[^{}\r\n]*"[^"\r\n]+"\s*:/,
  /(^|[\r\n])\s*[A-Za-z][\w ]*,[A-Za-z][\w ]*(?:,[A-Za-z][\w ]*)?\s*[\r\n]+[^\r\n,]+,[^\r\n,]+/,
  /\b[A-Za-z][\w.-]*=[^\s&]+&[A-Za-z][\w.-]*=[^\s&]+/,
  /(?:[A-Za-z0-9+/]{100,}={0,2})/,
  /(?:[A-Za-z]:\\(?:Users|Windows|Program Files)\\|\/(?:Users|home|etc|var)\/)/i,
];

const DIRECT_PERSONAL_IDENTIFIERS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /(?:^|\s)@[A-Za-z0-9_][A-Za-z0-9_.-]{1,30}\b/,
  /\b(?:employee|staff|worker|personnel|case|claim|client|patient|member|recipient|participant|medical record|MRN|PMI|MA|MAXIS|MMIS|MnCHOICES)\s*(?:id|number|no\.?|#)\s*[:#]?\s*(?:is\s+)?[A-Z0-9-]{3,}\b/i,
  /\b(?:driver'?s? license|passport)\s*(?:id|number|no\.?|#)?\s*[:#]?\s*[A-Z0-9-]{4,}\b/i,
];

const NAMED_PRIVATE_PERSON =
  /\b(?:client|patient|participant|recipient|resident|consumer|coworker|co-worker|colleague|employee|supervisor|manager|staff member|worker|caseworker)\s+(?:named\s+)?[A-Z][A-Za-z'’.-]{1,40}\s+[A-Z][A-Za-z'’.-]{1,40}\b/;

const SPECIFIC_PERSON =
  /\b(?:my|our|this|that|the)\s+(?:client|patient|participant|recipient|resident|consumer|coworker|co-worker|colleague|employee|supervisor|manager|staff member|worker|caseworker)\b/i;

const PRIVATE_PERSON_DETAIL =
  /\b(?:diagnos(?:is|ed)|medical|medication|treatment|hospitali[sz]ed|health condition|mental health|disabilit(?:y|ies)|accommodat(?:e|ed|ion|ions)|autis(?:m|tic)|cerebral palsy|HIV|depression|dementia|eligib(?:le|ility)|benefits?|waiver|case|claim|assessment|complaint|grievance|investigat(?:e|ion)|disciplin(?:e|ary)|terminat(?:e|ed|ion)|harass(?:ed|ment)|performance review|PIP)\b/i;

const UNSAFE_LINK_SCHEME = /(?:^|[\s(])(?:javascript|data|vbscript|file|ftp|http|mailto|tel):/i;
const AMBIGUOUS_LINK = /(?:^|[\s(])(?:www\.|\/\/)[^\s]+/i;
const SECURE_LINK = /https:[^\s<>"']*/gi;

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".lan") ||
    host.endsWith(".home") ||
    host.endsWith(".corp")
  ) return true;
  if (host === "::1" || host === "0.0.0.0") return true;
  if (/^(?:f[cd]|fe[89ab])/i.test(host) || /^::ffff:(?:0|10|127|169\.254|172\.(?:1[6-9]|2\d|3[01])|192\.168)\./i.test(host)) return true;
  if (!host.includes(".") && !host.includes(":")) return true;
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!match) return false;
  const octets = match.slice(1).map(Number);
  if (octets.some((octet) => octet > 255)) return true;
  return (
    octets[0] === 0 ||
    octets[0] === 10 ||
    octets[0] === 127 ||
    (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
}

function hasUnsafeLink(value: string): boolean {
  if (UNSAFE_LINK_SCHEME.test(value) || AMBIGUOUS_LINK.test(value)) return true;
  SECURE_LINK.lastIndex = 0;
  for (const match of value.matchAll(SECURE_LINK)) {
    try {
      const parsed = new URL(match[0]);
      if (
        parsed.protocol !== "https:" ||
        !parsed.hostname ||
        parsed.username ||
        parsed.password ||
        isPrivateHost(parsed.hostname)
      ) {
        return true;
      }
    } catch {
      return true;
    }
  }
  return false;
}

function isSerializedObject(value: string): boolean {
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

export function inspectCollaborationText(value: string): CollaborationTextFinding | null {
  if (HIDDEN_OR_CONTROL_TEXT.test(value)) {
    return { code: "hidden_text", message: "Remove hidden or control characters and try again." };
  }

  if (hasUnsafeLink(value)) {
    return {
      code: "unsafe_link",
      message: "Use a complete secure web address that begins with https, or remove the link.",
    };
  }

  const privacy = piiDetect(value);
  if (
    !privacy.ok ||
    DIRECT_PERSONAL_IDENTIFIERS.some((pattern) => pattern.test(value)) ||
    NAMED_PRIVATE_PERSON.test(value) ||
    (SPECIFIC_PERSON.test(value) && PRIVATE_PERSON_DETAIL.test(value))
  ) {
    return {
      code: "private_information",
      message: "Please remove names, contact information, identifiers, and any case, medical, or personnel details. Describe the situation in general terms.",
    };
  }

  const surveillance = surveillanceRefuse(value);
  if (!surveillance.ok) {
    return {
      code: "surveillance",
      message: "This workspace cannot be used to rank, score, profile, or monitor staff. Describe the program work without evaluating people.",
    };
  }

  if (MARKDOWN_PRESENTATION.some((pattern) => pattern.test(value))) {
    return {
      code: "presentation_syntax",
      message: "Use plain sentences without formatting marks or code.",
    };
  }

  if (DECORATIVE_SYMBOL.test(value)) {
    return {
      code: "decorative_symbol",
      message: "Please use words instead of emoji or decorative symbols.",
    };
  }

  if (TOOL_SELF_IDENTIFICATION.some((pattern) => pattern.test(value))) {
    return {
      code: "tool_voice",
      message: "Write in your own words rather than pasting text that speaks as a digital tool.",
    };
  }

  if (TECHNICAL_SHOP_TALK.test(value)) {
    return {
      code: "technical_wording",
      message: "Please describe the work in everyday terms and leave out website-building details.",
    };
  }

  const textWithoutSecureLinks = value.replace(SECURE_LINK, " ");
  if (isSerializedObject(value) || SERIALIZED_OR_CODE_TEXT.some((pattern) => pattern.test(textWithoutSecureLinks))) {
    return {
      code: "pasted_data",
      message: "Use plain sentences instead of pasted code or structured data.",
    };
  }

  return null;
}

function visibleText(maximum: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(maximum)
    .transform((value) => value.normalize("NFC").replace(/\r\n?/g, "\n"))
    .superRefine((value, context) => {
      const finding = inspectCollaborationText(value);
      if (finding) context.addIssue({ code: "custom", message: finding.message });
    });
}

const Text = visibleText(4000);
const ShortText = visibleText(240);

export const OneDsdTeamMutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("update_workspace_summary"), summary: Text }).strict(),
  z.object({ action: z.literal("update_channel"), channelId: Id, purpose: Text }).strict(),
  z
    .object({
      action: z.literal("create_thread"),
      channelId: Id,
      title: ShortText,
      body: Text,
      idempotencyKey: IdempotencyKey,
    })
    .strict(),
  z
    .object({
      action: z.literal("reply"),
      threadId: Id,
      body: Text,
      idempotencyKey: IdempotencyKey,
    })
    .strict(),
  z.object({ action: z.literal("edit_post"), postId: Id, body: Text }).strict(),
  z
    .object({
      action: z.literal("update_meeting"),
      occurrenceId: Id,
      title: ShortText,
      scheduleNote: ShortText,
      accessNote: Text,
      status: z.enum(["planning", "scheduled", "completed", "cancelled"]),
    })
    .strict(),
  z
    .object({
      action: z.literal("update_action"),
      actionItemId: Id,
      title: ShortText,
      ownerLabel: ShortText,
      dueNote: ShortText,
      status: z.enum(["planned", "in_progress", "blocked", "complete"]),
    })
    .strict(),
  z
    .object({
      action: z.literal("submit_feedback"),
      feedbackId: Id,
      response: Text,
      idempotencyKey: IdempotencyKey,
    })
    .strict(),
]);

export type OneDsdTeamMutation = z.infer<typeof OneDsdTeamMutationSchema>;
