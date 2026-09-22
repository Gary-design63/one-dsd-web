/**
 * Model registry (TRD §3). Models are product configuration.
 *
 * Production binding at MVP is the fixture provider: deterministic, corpus-grounded
 * composition that works with no external key and is fully evaluable. Vendor-backed
 * records are registered as candidates or pilot bindings behind a feature flag and
 * the upgrade pathway (candidate -> eval -> compare -> sandbox -> pilot -> owner promote).
 *
 * The project's routing matrix (CLAUDE.md §11) names the vendor models; they are
 * recorded here as configuration, not enabled by default. Staff UI never displays
 * provider_model_ref.
 */
import type { ModelRecord } from "../types";

const NOW = "2026-09-04T00:00:00Z";

export const STAFF_GENERATION_MODEL_ID = "mdl_openai_staff_primary";

export const MODELS: ModelRecord[] = [
  {
    model_id: STAFF_GENERATION_MODEL_ID, provider_id: "openai", provider_model_ref: "gpt-5.6-sol",
    display_name_internal: "OpenAI staff reasoning and coordination", purpose: "chat_reason",
    allowed_agent_ids: ["ask_concierge", "ci_guide", "consult_intake", "embed_advisor", "program_orchestrator"],
    scope: { environments: ["local", "preview", "production"], data_classes: ["staff_public_corpus"] },
    cost_class: "standard", risk_class: "elevated", context_window: 1050000,
    supports_tools: true, supports_json_schema: true, approval_state: "approved",
    feature_flag: "model.generative_pilot", eval_suite_ids: ["ask_mvp", "ci_mvp"],
    region_policy: "OpenAI Responses API; existing program-context scope is preserved.",
    retention_notes: "API response storage disabled with store:false. Program response records remain in its own database; provider monitoring terms still apply.",
    cost_risk_notes: "Owner-selected OpenAI primary. Medium reasoning with a bounded deadline. No automatic fallback to another vendor. A missing credential or failed request is recorded as unavailable or limited.",
    approved_by: "Owner explicitly authorized OpenAI for submitted questions, relevant conversation and program/task context on September 9, 2026",
    version: "1.0.0", created_at: "2026-09-09T00:00:00Z", updated_at: "2026-09-09T00:00:00Z",
  },
  {
    model_id: "mdl_local_bge_v1", provider_id: "local", provider_model_ref: "Xenova/bge-small-en-v1.5/ea104dacec62c0de699686887e3f920caeb4f3e3",
    display_name_internal: "Local semantic retrieval (BGE small, pinned q8)", purpose: "embed",
    allowed_agent_ids: ["ask_concierge", "ci_guide", "librarian", "embed_advisor", "program_orchestrator"],
    scope: { environments: ["local", "preview", "production"], data_classes: ["staff_public_corpus"] },
    cost_class: "low", risk_class: "low", context_window: 512, supports_tools: false, supports_json_schema: false,
    region_policy: "Runs inside the application server; remote model access disabled.",
    retention_notes: "Bounded in-memory document vectors only. Questions and query vectors are not cached by retrieval.",
    approval_state: "approved", eval_suite_ids: ["local_semantic_search"],
    cost_risk_notes: "Current eligible sources only. Meaning-based candidates supplement keyword search and reasoning; similarity is not proof of claim support. English model; multilingual coverage is limited. Missing or warming model records an unavailable tool result and keyword search continues.",
    approved_by: "Owner authorization for application workflow completion, September 8, 2026",
    version: "1.0.0", created_at: "2026-09-08T00:00:00Z", updated_at: "2026-09-08T00:00:00Z",
  },
  {
    model_id: "mdl_fixture_v1",
    provider_id: "fixture",
    provider_model_ref: "fixture/corpus-composer-1",
    display_name_internal: "Fixture composer (deterministic, corpus-grounded)",
    purpose: "chat_reason",
    allowed_agent_ids: ["ask_concierge", "ci_guide", "librarian", "a11y_reviewer", "consult_intake", "graduation_coach", "embed_advisor", "program_orchestrator"],
    scope: { environments: ["local", "preview", "production"], data_classes: ["staff_public_corpus", "practice_workspace"] },
    cost_class: "low",
    risk_class: "low",
    context_window: 0,
    supports_tools: false,
    supports_json_schema: true,
    region_policy: "In-process; no external egress.",
    retention_notes: "No retention; nothing leaves the application.",
    approval_state: "production",
    eval_suite_ids: ["ask_mvp", "ci_mvp", "ciq_mvp", "gp_mvp", "mindset_abc"],
    cost_risk_notes: "Zero cost, zero egress. Bounded by corpus coverage; says 'no approved source' when coverage is missing.",
    approved_by: "build default pending owner review",
    version: "1.0.0",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    model_id: "mdl_fixture_embed_v1",
    provider_id: "fixture",
    provider_model_ref: "fixture/lexical-overlap-1",
    display_name_internal: "Fixture retrieval scorer (lexical overlap)",
    purpose: "embed",
    allowed_agent_ids: ["ask_concierge", "ci_guide", "librarian", "embed_advisor", "program_orchestrator"],
    scope: { environments: ["local", "preview", "production"], data_classes: ["staff_public_corpus", "practice_workspace"] },
    cost_class: "low",
    risk_class: "low",
    context_window: 0,
    supports_tools: false,
    supports_json_schema: false,
    region_policy: "In-process.",
    retention_notes: "None.",
    approval_state: "production",
    eval_suite_ids: ["ask_mvp"],
    cost_risk_notes: "Keyword-quality matching; a hosted embedding model is the upgrade candidate.",
    approved_by: "build default pending owner review",
    version: "1.0.0",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    model_id: "mdl_claude_staff_primary",
    provider_id: "anthropic",
    provider_model_ref: "claude-sonnet-4-6",
    display_name_internal: "Staff conversations primary (routing matrix row 1)",
    purpose: "chat_reason",
    allowed_agent_ids: ["ask_concierge", "ci_guide", "consult_intake", "embed_advisor", "program_orchestrator"],
    scope: { environments: ["local", "preview", "production"], data_classes: ["staff_public_corpus"] },
    cost_class: "standard",
    risk_class: "elevated",
    context_window: 1000000,
    supports_tools: true,
    supports_json_schema: true,
    region_policy: "Vendor-hosted; region and retention to be documented before use with protected work (T-04).",
    retention_notes: "Vendor default retention; not cleared for Consultant Workspace payloads.",
    approval_state: "approved",
    feature_flag: "model.generative_pilot",
    eval_suite_ids: ["ask_mvp", "ci_mvp"],
    cost_risk_notes: "Owner directive Sept 4 2026: approved for staff-corpus drafting. Used whenever the flag is on and a server-side key is present; otherwise the fixture composer runs. Output is schema-constrained, grounded on retrieved corpus, and brand-scrubbed before display.",
    approved_by: "Practice owner directive (Gary Banks), 2026-09-04",
    version: "0.1.0",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    model_id: "mdl_claude_triage",
    provider_id: "anthropic",
    provider_model_ref: "claude-haiku-4-5",
    display_name_internal: "High-volume triage and classification (routing matrix row 2)",
    purpose: "classify",
    allowed_agent_ids: ["program_orchestrator", "librarian"],
    scope: { environments: ["local", "preview"], data_classes: ["staff_public_corpus"] },
    cost_class: "low",
    risk_class: "elevated",
    context_window: 200000,
    supports_tools: true,
    supports_json_schema: true,
    region_policy: "Vendor-hosted; see T-04.",
    retention_notes: "Vendor default retention.",
    approval_state: "candidate",
    eval_suite_ids: ["mindset_abc"],
    cost_risk_notes: "Candidate only. Rule-based classification is production at MVP.",
    version: "0.1.0",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    model_id: "mdl_claude_reasoning",
    provider_id: "anthropic",
    provider_model_ref: "claude-opus-4-6",
    display_name_internal: "Complex reasoning and evaluation scoring (routing matrix row 3)",
    purpose: "eval_judge",
    allowed_agent_ids: ["eval_steward"],
    scope: { environments: ["local"], data_classes: ["staff_public_corpus"] },
    cost_class: "high",
    risk_class: "elevated",
    context_window: 1000000,
    supports_tools: true,
    supports_json_schema: true,
    region_policy: "Vendor-hosted; see T-04.",
    retention_notes: "Vendor default retention.",
    approval_state: "candidate",
    eval_suite_ids: [],
    cost_risk_notes: "Candidate judge for eval compare; owner-only surface; not wired at MVP.",
    version: "0.1.0",
    created_at: NOW,
    updated_at: NOW,
  },
  {
    model_id: "mdl_openai_structured",
    provider_id: "openai",
    provider_model_ref: "gpt-4o",
    display_name_internal: "Structured data and forms fallback (routing matrix row 4)",
    purpose: "chat_reason",
    allowed_agent_ids: ["consult_intake", "embed_advisor"],
    scope: { environments: ["local"], data_classes: ["staff_public_corpus"] },
    cost_class: "standard",
    risk_class: "elevated",
    context_window: 128000,
    supports_tools: true,
    supports_json_schema: true,
    region_policy: "Vendor-hosted; see T-04.",
    retention_notes: "Vendor default retention.",
    approval_state: "candidate",
    eval_suite_ids: [],
    cost_risk_notes: "OpenAI adapter restored from the reconstruction and verified with a connected structured-output task on September 7, 2026. Candidate selection remains governed by the model registry.",
    version: "0.1.0",
    created_at: NOW,
    updated_at: NOW,
  },
];

export function getModel(id: string): ModelRecord | undefined {
  return MODELS.find((m) => m.model_id === id);
}

/** Registry list for owner UI: never expose provider_model_ref to staff routes. */
export function registryModelList(): Array<Omit<ModelRecord, "provider_model_ref">> {
  return MODELS.map((m) => {
    const copy: Partial<ModelRecord> = { ...m };
    delete copy.provider_model_ref;
    return copy as Omit<ModelRecord, "provider_model_ref">;
  });
}

export function isCallableInProduction(m: ModelRecord, flags: (flag: string) => boolean): boolean {
  if (m.approval_state === "approved" || m.approval_state === "production") return true;
  if (m.approval_state === "pilot") return Boolean(m.feature_flag && flags(m.feature_flag));
  return false;
}
