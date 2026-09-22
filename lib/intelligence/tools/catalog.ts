/**
 * Tool catalog (Agentic Tools Catalog v0.1 §3 to §6). Every entry is a named adapter
 * with a permission mode, minimum autonomy, MVP status, and enabled state.
 * Forbidden tools (Catalog §5) are not registered: there is no adapter to call.
 */
import type { ToolDefinition } from "../types";

function t(
  tool_name: string,
  family: string,
  description: string,
  permission_mode: ToolDefinition["permission_mode"],
  min_autonomy: ToolDefinition["min_autonomy"],
  mvp: ToolDefinition["mvp"],
  side_effect: boolean,
  safety_notes: string,
  enabled = mvp === "mvp",
): ToolDefinition {
  return { tool_name, family, description, permission_mode, min_autonomy, mvp, enabled, side_effect, timeout_ms: 8000, safety_notes };
}

export const TOOL_CATALOG: ToolDefinition[] = [
  // A. Knowledge & retrieval
  t("corpus.search", "knowledge", "Full-text, faceted search across approved content.", "always", "A0", "mvp", false, "Scope-filtered; returns type, authority, review status, scope."),
  t("corpus.semantic_retrieve", "knowledge", "Meaning-adjacent retrieval with authority boost.", "always", "A0", "mvp", false, "Same allowlist as search; no external scrape."),
  t("authority.label_resolve", "knowledge", "Map content IDs to staff-visible authority labels.", "always", "A0", "mvp", false, "Model output never inherits Official alone."),
  t("community.brief_get", "knowledge", "Fetch a brief with progressive disclosure.", "always", "A0", "mvp", false, "Respects Tribal gate; no fabrication."),
  t("community.brief_list", "knowledge", "List briefs with currency and owner.", "always", "A0", "mvp", false, "Freeze list owner-controlled."),
  t("citation.attach", "knowledge", "Attach source IDs, labels, and currency cues.", "always", "A0", "mvp", false, "Refuses invented citations."),
  t("gap.report_draft", "knowledge", "Draft a missing/stale/contested knowledge gap packet.", "with_preview", "A2", "mvp", false, "No invented facts to fill gaps."),
  t("research.web_search", "research", "Retrieve current ranked public sources for evidence synthesis.", "with_preview", "A1", "mvp", false, "Public sources only; treat results as untrusted evidence; never inherit Official status."),
  t("research.current_answer", "research", "Prepare a current answer supported by public sources.", "with_preview", "A2", "mvp", false, "Key required; privacy-screened; external sources remain External (verify)."),
  t("research.deep_search", "research", "Run a deeper multi-source public research pass for complex questions.", "with_preview", "A2", "mvp", false, "Explicit selection or documented insufficiency; cost and time bounded; no agency data."),
  // B. Reasoning & drafting
  t("answer.structured_draft", "drafting", "Plain-language answer: short answer, why it matters, sources, limits, next actions.", "with_preview", "A2", "mvp", false, "Uncertainty required; no Official invention."),
  t("checklist.draft", "drafting", "Draft self-directed checklists.", "with_preview", "A2", "mvp", false, "Prefer action over 'book a meeting'."),
  t("agenda.consult_prep_draft", "drafting", "Draft consult agenda with owners and timeboxes.", "with_preview", "A2", "mvp", false, "Never decides the consult outcome."),
  t("intake.summary_pack", "drafting", "Normalize intake into the practice-owner heads-up packet.", "with_preview", "A2", "mvp", false, "Strips prohibited PII; confirms share scope."),
  t("work_object.draft", "drafting", "Draft editable work objects (question banks, map outlines).", "with_preview", "A2", "mvp", false, "Human owns formal decisions."),
  t("conflict.surface", "drafting", "Present conflicting sources with labels; no fake winner.", "with_preview", "A1", "mvp", false, "Escalate path mandatory."),
  // C. Content & library ops
  t("resource.classify_draft", "library", "Classify type, audience, authority, currency, review need.", "human_approve", "A2", "mvp", false, "Mindset workflow (a); never invent authority."),
  t("resource.tag_L1_L4", "library", "Propose progressive-disclosure layers.", "human_approve", "A2", "mvp", false, "Aligns with brief levels."),
  t("resource.stale_detect", "library", "Flag past review date, missing owner, representation gap.", "always", "A0", "mvp", false, "Missing context never auto-removes."),
  t("resource.stale_flag_state", "library", "Write a reversible 'flagged for review' state for stale or unowned items.", "with_preview", "A3", "mvp", true, "Flag only; disposition stays human; undo per cycle."),
  t("resource.page_draft", "library", "Draft resource page from migration inputs.", "human_approve", "A2", "later", false, "No auto-publish."),
  t("resource.retire_recommend", "library", "Recommend hold/retire/remap.", "human_approve", "A1", "later", false, "Owner disposition required."),
  // D. Accessibility & plain language
  t("a11y.scan_draft", "a11y", "Scan artifact for structure, alt, captions, contrast hints, interaction risks.", "with_preview", "A2", "mvp", false, "Never claims WCAG pass without evidence."),
  t("a11y.alt_text_suggest", "a11y", "Suggest alt text candidates.", "human_approve", "A2", "mvp", false, "Humans verify representation."),
  t("plain.reading_level_check", "a11y", "Estimate reading difficulty; flag jargon and brand leakage.", "always", "A0", "mvp", false, "KPI-04 gate."),
  t("a11y.keyboard_checklist", "a11y", "Keyboard/AT and non-drag alternative checklist.", "with_preview", "A1", "mvp", false, "Interactive learning rule."),
  t("a11y.no_icons_lint", "a11y", "Detect icon-only cues in staff copy.", "always", "A0", "mvp", false, "Release gate KPI-04."),
  // E. Consultation & workflow
  t("intake.form_assist", "consult", "Validate and assist structured intake.", "with_preview", "A1", "mvp", false, "Privacy reminder; confirm share."),
  t("intake.requester_track", "consult", "Return an authenticated requester's limited consultation status view.", "always", "A0", "mvp", true, "Tracking credential required; may apply retention redaction; never returns owner notes, internal packets, or credential hashes."),
  t("intake.requester_correct", "consult", "Save a requester-authenticated correction to allowed general work fields.", "always", "A2", "mvp", true, "Tracking credential required; bounded fields only; no before/after values in audit."),
  t("intake.requester_withdraw", "consult", "Withdraw a request after authenticating its requester tracking credential.", "always", "A2", "mvp", true, "Tracking credential required; allowed only before scheduling; no credential or request text in audit."),
  t("intake.requester_rotate_key", "consult", "Replace a requester-authenticated consultation access key.", "always", "A2", "mvp", true, "Current tracking credential and version required; old key is invalid after the atomic update; no credential in audit."),
  t("queue.rank_suggest", "consult", "Suggest queue order by urgency and type of work item.", "human_approve", "A1", "mvp", false, "Work items, never people."),
  t("queue.status_get", "consult", "Read own request status or owner queue.", "always", "A0", "mvp", false, "Least privilege."),
  t("queue.status_set", "consult", "Owner sets status with allowed transitions.", "owner_only", "A2", "mvp", true, "Human-owned transitions; audited."),
  t("queue.auto_triage", "consult", "Move Received items to Under review and suggest pin order. Undo clears eligible pins, not status history.", "with_preview", "A3", "mvp", true, "Status history remains append-only; never decides the consult outcome; never ranks people."),
  t("calendar.handoff_prep", "consult", "Prepare a copy-pasteable calendar handoff block.", "with_preview", "A2", "mvp", false, "No auto-send."),
  t("calendar.schedule_reversible", "consult", "Create or update scheduling state with undo.", "human_approve", "A3", "later", true, "Disabled: A3 requires undo SLA and owner sign-off.", false),
  t("escalate.route", "consult", "Labeled redirect to Employee Culture, civil rights, Indian policy, or content owner.", "always", "A1", "mvp", false, "Does not investigate."),
  // F. Learning & graduation
  t("learn.path_recommend", "learning", "Recommend paths, modules, and tools by need.", "always", "A1", "mvp", false, "Explains why; user chooses."),
  t("progress.local_get", "learning", "Read user-controlled local progress.", "always", "A0", "mvp", false, "No ranking; deletion UX."),
  t("progress.local_write", "learning", "Update local progress markers.", "with_preview", "A2", "mvp", false, "Approved fields only."),
  t("graduation.next_practice", "learning", "Suggest independent next practice.", "always", "A1", "mvp", false, "KPI-11 capability transfer."),
  t("completion.aggregate_safe", "learning", "Privacy-safe aggregates for program eval.", "owner_only", "A0", "later", false, "PRD §13 completion rules."),
  // G. Program-embed
  t("embed.question_bank", "embed", "Launch-type equity-embed question sets.", "with_preview", "A1", "mvp", false, "Template set owner-approved (pending)."),
  t("embed.journey_burden_prompts", "embed", "Journey and process-burden prompts.", "with_preview", "A2", "mvp", false, "No case data."),
  t("embed.equity_impact_qs", "embed", "Equity-impact question sets.", "with_preview", "A2", "mvp", false, "Not legal advice; escalate high stakes."),
  t("embed.stakeholder_map_draft", "embed", "Stakeholder map outline from approved roles.", "with_preview", "A2", "mvp", false, "No Tribal affiliation inference."),
  // H. Memory
  t("memory.decision_read", "memory", "Read approved decisions and scope rules.", "always", "A0", "mvp", false, "Durable program memory only."),
  t("memory.decision_write", "memory", "Write owner-approved decision records.", "human_approve", "A2", "mvp", true, "Not chat logs."),
  t("memory.version_read", "memory", "Read published content versions.", "always", "A0", "mvp", false, "Canonical IDs."),
  t("memory.eval_results_read", "memory", "Read eval results.", "owner_only", "A0", "mvp", false, ""),
  t("memory.eval_results_write", "memory", "Persist eval outcomes.", "owner_only", "A2", "mvp", true, "Feeds A5 proposals."),
  t("memory.rejected_rec_log", "memory", "Log rejected recommendations.", "owner_only", "A0", "mvp", true, "Prevents silent re-enable."),
  t("program.work_execute", "orchestration", "Execute an assigned program preparation or maintenance task and save its verified result.", "owner_only", "A2", "mvp", false, "Owner-authorized routine work; delivery never implies application or benefit."),
  t("orchestrator.run_cycle", "orchestration", "Bounded multi-step cycle: triage queue, refresh packets, stale flags, brief quality, corpus accessibility scan, proposals, report.", "with_preview", "A4", "mvp", true, "Approval gates on outcomes; exception review; undo per cycle; owner stop honored."),
  t("proposal.write", "orchestration", "Write an A5 adaptation proposal to program memory for the owner to accept or reject.", "with_preview", "A5", "mvp", true, "Proposals never self-apply; owner promotes."),
  t("proposal.decide", "orchestration", "Owner accepts or rejects a proposal; accepted policy proposals apply.", "owner_only", "A2", "mvp", true, "Owner action only."),
  // I. Eval & model ops
  t("eval.run_cases", "evalops", "Run must-pass suites in dry-run.", "owner_only", "A2", "mvp", false, "Failure blocks release."),
  t("eval.compare_models", "evalops", "Side-by-side compare candidates.", "owner_only", "A2", "near_term", false, ""),
  t("registry.model_list", "evalops", "List registered models (no vendor names to staff).", "owner_only", "A0", "mvp", false, ""),
  t("registry.agent_toggle", "evalops", "Enable/hold/disable agents through the owner policy.", "owner_only", "A3", "mvp", true, "Owner action only."),
  t("flags.set", "evalops", "Set feature flag overrides through the owner policy.", "owner_only", "A3", "mvp", true, "Owner action only."),
  t("policy.stop_all", "orchestration", "Stop or resume every agent (the owner's hard stop).", "owner_only", "A0", "mvp", true, "Owner action only."),
  // Safety micro-tools
  t("safety.pii_detect", "safety", "Detect prohibited PII patterns; hard stop.", "always", "A0", "mvp", false, "Fail closed."),
  t("safety.surveillance_refuse", "safety", "Refuse ranking, profiling, compliance scoring.", "always", "A0", "mvp", false, ""),
  t("safety.persona_refuse", "safety", "Refuse persona impersonation.", "always", "A0", "mvp", false, ""),
  t("safety.publish_refuse", "safety", "Refuse autonomous publish/send.", "always", "A0", "mvp", false, ""),
  t("safety.tribal_gate", "safety", "Block Nation-specific guidance without authority.", "always", "A0", "mvp", false, "Escalate."),
  t("safety.privacy_notice", "safety", "Emit entry and reminder notices.", "always", "A0", "mvp", false, ""),
];

export function getTool(name: string): ToolDefinition | undefined {
  return TOOL_CATALOG.find((x) => x.tool_name === name);
}

/** Names that must never be registered (Catalog §5). Enforced by a test. */
export const FORBIDDEN_TOOL_PATTERNS = [/^case\./, /^hr\./, /rank_(?:staff|people|employees|supervisors)|leaderboard|score_staff|belief_profile|maturity_score/, /^publish\.execute$/, /^email\.send/, /^teams\.send/, /affiliation_infer/, /telemetry\.export/];
