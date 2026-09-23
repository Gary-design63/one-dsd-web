/**
 * Adaptive Program Intelligence control-plane types (TRD v0.1 §3, §5, §7, §11).
 * Models and agents are product configuration, not code constants.
 */

export type Autonomy = "A0" | "A1" | "A2" | "A3" | "A4" | "A5";
export const AUTONOMY_ORDER: Autonomy[] = ["A0", "A1", "A2", "A3", "A4", "A5"];
export function autonomyRank(a: Autonomy): number {
  return AUTONOMY_ORDER.indexOf(a);
}

/**
 * Hard environment cap. The operating ceiling is the owner's autonomy policy
 * (lib/intelligence/policy.ts), which defaults to A0 and can be raised only by explicit configuration or stopped at runtime.
 */
export const ENVIRONMENT_MAX_AUTONOMY: Autonomy = "A5";

export type PermissionMode = "always" | "with_preview" | "human_approve" | "owner_only";

export type ModelPurpose = "chat_reason" | "embed" | "classify" | "summarize" | "eval_judge";
export type ApprovalState = "candidate" | "eval" | "sandbox" | "pilot" | "approved" | "production" | "hold" | "rejected";

export type ModelRecord = {
  model_id: string;
  provider_id: "fixture" | "anthropic" | "openai" | "local";
  /** Provider-native identifier. Server-side only; never sent to clients. */
  provider_model_ref: string;
  display_name_internal: string;
  purpose: ModelPurpose;
  allowed_agent_ids: string[];
  scope: { environments: Array<"local" | "preview" | "production">; data_classes: Array<"staff_public_corpus" | "practice_workspace"> };
  cost_class: "low" | "standard" | "high";
  risk_class: "low" | "elevated" | "restricted";
  context_window: number;
  supports_tools: boolean;
  supports_json_schema: boolean;
  region_policy: string;
  retention_notes: string;
  approval_state: ApprovalState;
  eval_suite_ids: string[];
  cost_risk_notes: string;
  approved_by?: string;
  version: string;
  created_at: string;
  updated_at: string;
  /** Feature flag required when approval_state is 'pilot'. */
  feature_flag?: string;
};

export type ReviewRule = "none_observe" | "user_chooses" | "preview_required" | "human_approve" | "owner_only";

export type AgentId =
  | "program_orchestrator"
  | "ask_concierge"
  | "ci_guide"
  | "librarian"
  | "a11y_reviewer"
  | "consult_intake"
  | "graduation_coach"
  | "embed_advisor"
  | "content_sentinel"
  | "eval_steward";

export type AgentDefinition = {
  agent_id: AgentId;
  version: string;
  purpose: string;
  /** Workflow label if shown; never a persona name. */
  staff_label: string;
  inputs_schema: string;
  outputs_schema: string;
  tools_allowlist: string[];
  model_setting: { primary_model_id: string; fallback_model_id?: string; embed_model_id?: string };
  autonomy_ceiling: Autonomy;
  review_rule: ReviewRule;
  eval_suite_id: string;
  enabled: boolean;
  feature_flag?: string;
  scope: { roles: Array<"staff" | "leadership" | "owner">; environments: Array<"local" | "preview" | "production"> };
  mindset_workflow?: "a_classify" | "b_a11y" | "c_intake";
  safety_profile: string[];
  created_at: string;
  updated_at: string;
  change_notes: string;
};

export type ToolDefinition = {
  tool_name: string;
  family: string;
  description: string;
  permission_mode: PermissionMode;
  min_autonomy: Autonomy;
  mvp: "mvp" | "near_term" | "later";
  enabled: boolean;
  side_effect: boolean;
  timeout_ms: number;
  safety_notes: string;
};

export type SafetyRefusalCode =
  | "pii_detected"
  | "hr_complaint_redirect"
  | "surveillance_refused"
  | "persona_refused"
  | "publish_refused"
  | "tribal_gate"
  | "legal_invention_refused";

export type SafetyResult = {
  ok: boolean;
  code?: SafetyRefusalCode;
  /** Field class that failed, never the raw secret. */
  fieldClass?: string;
  /** Plain-language staff message. */
  message?: string;
  /** Labeled redirect. */
  redirect?: { label: string; href: string };
  /** Alternatives that stay within bounds. */
  alternatives?: Array<{ label: string; href: string }>;
};

export type AuditEvent = {
  trace_id: string;
  span_id: string;
  at: string;
  agent_id: AgentId | "system";
  agent_version: string;
  tool_name: string;
  autonomy_level_used: Autonomy;
  permission_mode: PermissionMode;
  dry_run: boolean;
  content_ids_touched: string[];
  allowlist_hit: boolean;
  allowlist_miss_reason?: string;
  safety_refusal_code?: SafetyRefusalCode;
  human_disposition?: "approve" | "edit" | "reject" | "regenerate" | null;
  model_id?: string;
  latency_ms?: number;
  ok: boolean;
  error_code?: string;
};

export type ToolContext = {
  trace_id: string;
  agent: AgentDefinition;
  dry_run: boolean;
  idempotency_key?: string;
  role: "staff" | "owner";
};

export type ToolInvocationResult<T> = { ok: true; value: T; audit: AuditEvent } | { ok: false; error: string; audit: AuditEvent };
