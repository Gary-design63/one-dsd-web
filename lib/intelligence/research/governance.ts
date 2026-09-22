/**
 * Governed external research (Ask contract §5 "External, verify" class; CLAUDE.md §10 Perplexity
 * as a consultant-only integration; owner directive on autonomy).
 *
 * This module is the governor around any external research provider. It decides whether a
 * request may leave the application at all, through which provider, under which caps, and it
 * keeps the usage ledger the owner sees. Nothing here stores a credential: providers read
 * environment variables at call time and report only presence or absence.
 *
 * Data rules enforced here, independent of the provider:
 *  1. Never egress a question that failed a safety gate (PII, HR, surveillance, persona,
 *     publish, Tribal, profiling). Callers run the gates first; this module re-runs pii_detect.
 *  2. Query minimization: only the question text goes out. No session, no intake, no packet.
 *  3. Evidence class separation: results are typed as external evidence; they can never be
 *     attached as corpus citations or inherit an authority label above "external_verify".
 *  4. Caps: daily request cap and monthly USD cap, owner-set, counted before the call.
 *  5. Stop: the owner's global stop and a research-specific stop both block egress.
 */
import { getStore } from "../memory/store";
import { getPolicy } from "../policy";
import { externalResearchGate } from "../safety";
import type { ResearchProviderId } from "./providers";
import { assertCanonicalOperationalInstant } from "@/lib/privacy/operational-retention";
import {
  assertOpaqueTraceId,
  isDnsHostname,
  opaqueProviderTraceId,
  operationalResearchModel,
} from "@/lib/privacy/opaque-identifiers";

export type ResearchPolicy = {
  enabled: boolean;
  /** Automatic escalation when internal grounding is missing, or only on explicit request. */
  mode: "auto" | "on_request" | "off";
  provider_order: ResearchProviderId[];
  daily_request_cap: number;
  monthly_usd_cap: number;
  /** Domain preferences passed to the provider when supported. */
  allowed_domains: string[];
  /** Recency preference: "any" | "year" | "month" | "week". */
  recency: "any" | "year" | "month" | "week";
  deep_research_enabled: boolean;
};

type LegacyResearchProviderId = "perplexity_direct" | "vercel_gateway";
export type ResearchPolicyPatch = Partial<Omit<ResearchPolicy, "provider_order">> & {
  /** Legacy values are accepted only so an existing stored policy can migrate safely. */
  provider_order?: Array<ResearchProviderId | LegacyResearchProviderId>;
};

/**
 * Owner directive (Gary Banks, September 4, 2026): every staff member may use external research
 * for any question, with no restrictions except the consultant's enable/disable control.
 * Therefore: regular Perplexity first, no domain filter, no recency filter, deep research
 * available, and caps off (0 = no cap). The consultant may tighten any of these. The launch
 * default remains off until shared storage, abuse protection, and a live-connection review are
 * complete; this is the consultant's same enable/disable control, set to its safe position.
 * The only gate that stays on is the prohibited-information gate: nothing about a person leaves.
 */
export const DEFAULT_RESEARCH_POLICY: ResearchPolicy = {
  enabled: false,
  mode: "auto",
  provider_order: ["perplexity_agent"],
  daily_request_cap: 0,
  monthly_usd_cap: 0,
  allowed_domains: [],
  recency: "any",
  deep_research_enabled: true,
};

/** 0 means no cap. */
export const NO_CAP = 0;

const RESEARCH_POLICY_ID = "research_policy";

function normalizeProviderOrder(value: unknown): ResearchProviderId[] {
  if (!Array.isArray(value)) return [...DEFAULT_RESEARCH_POLICY.provider_order];
  const normalized: ResearchProviderId[] = [];
  for (const raw of value) {
    const id: ResearchProviderId | null =
      raw === "perplexity_agent" || raw === "perplexity_direct" || raw === "vercel_gateway"
        ? "perplexity_agent"
        : raw === "openai_web"
          ? "openai_web"
          : raw === "fixture"
          ? "fixture"
          : null;
    if (id && !normalized.includes(id)) normalized.push(id);
  }
  return normalized.length ? normalized : [...DEFAULT_RESEARCH_POLICY.provider_order];
}

export async function getResearchPolicy(): Promise<ResearchPolicy> {
  const store = getStore();
  const stored = await store.get<Partial<Omit<ResearchPolicy, "provider_order">> & { provider_order?: unknown }>("decision", RESEARCH_POLICY_ID);
  const envEnabled = process.env.PAC_RESEARCH_ENABLED;
  const { provider_order: storedOrder, ...storedRest } = stored ?? {};
  const normalizedOrder = normalizeProviderOrder(storedOrder ?? DEFAULT_RESEARCH_POLICY.provider_order);
  const base: ResearchPolicy = {
    ...DEFAULT_RESEARCH_POLICY,
    ...storedRest,
    provider_order: normalizedOrder,
  };
  if (envEnabled !== undefined && stored?.enabled === undefined) base.enabled = ["1", "true", "on", "yes"].includes(envEnabled.toLowerCase());
  const cap = Number(process.env.PAC_RESEARCH_MONTHLY_USD_CAP);
  if (Number.isFinite(cap) && cap > 0 && stored?.monthly_usd_cap === undefined) base.monthly_usd_cap = cap;
  if (storedOrder !== undefined && JSON.stringify(storedOrder) !== JSON.stringify(normalizedOrder)) {
    await store.put("decision", RESEARCH_POLICY_ID, { ...stored, provider_order: normalizedOrder });
  }
  return base;
}

export async function setResearchPolicy(patch: ResearchPolicyPatch): Promise<ResearchPolicy> {
  const current = await getResearchPolicy();
  const next: ResearchPolicy = {
    ...current,
    ...patch,
    provider_order: patch.provider_order
      ? normalizeProviderOrder(patch.provider_order)
      : current.provider_order,
  };
  await getStore().put("decision", RESEARCH_POLICY_ID, next);
  return next;
}

/* ---------- Usage ledger ---------- */

export type ResearchUsageEvent = {
  id: string;
  at: string;
  provider: ResearchProviderId;
  model: string;
  depth: "current_web" | "deep_research";
  /** Hash of the query, never the query. */
  query_hash: string;
  domains: string[];
  estimated_usd: number;
  reported_usd?: number;
  input_tokens?: number;
  output_tokens?: number;
  search_queries?: number;
  web_search_calls?: number;
  fetch_url_calls?: number;
  tool_calls?: number;
  ok: boolean;
  error_code?: string;
  latency_ms: number;
  trace_id: string;
  provider_trace_id?: string;
};

export type UsageSummary = {
  today: { requests: number; usd: number };
  month: { requests: number; usd: number };
  caps: { daily_request_cap: number; monthly_usd_cap: number };
  remaining: { requests_today: number; usd_month: number };
};

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
function monthKey(d = new Date()): string {
  return d.toISOString().slice(0, 7);
}

export async function hashQuery(q: string): Promise<string> {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(q.trim().toLowerCase()).digest("hex").slice(0, 16);
}

export async function recordUsage(ev: Omit<ResearchUsageEvent, "id">): Promise<ResearchUsageEvent> {
  assertCanonicalOperationalInstant(ev.at);
  assertOpaqueTraceId(ev.trace_id);
  if (!/^[a-f0-9]{16}$/.test(ev.query_hash)) {
    throw new Error("Research usage requires a bounded query hash.");
  }
  const id = `ru_${ev.at.replace(/[^0-9]/g, "").slice(0, 14)}_${ev.query_hash.slice(0, 6)}_${ev.trace_id.slice(-4)}`;
  const full: ResearchUsageEvent = {
    id,
    ...ev,
    model: await operationalResearchModel(ev.model),
    domains: Array.from(new Set(ev.domains.map((domain) => domain.trim().toLowerCase())))
      .filter(isDnsHostname)
      .slice(0, 20),
  };
  if (ev.provider_trace_id) full.provider_trace_id = await opaqueProviderTraceId(ev.provider_trace_id);
  else delete full.provider_trace_id;
  if (ev.ok) delete full.error_code;
  else full.error_code = "research_execution_failed";
  await getStore().put("decision", `research_usage:${id}`, full);
  return full;
}

export async function listUsage(limit = 100): Promise<ResearchUsageEvent[]> {
  const all = await getStore().list<ResearchUsageEvent>("decision");
  return all
    .filter((d) => typeof d.id === "string" && d.id.startsWith("ru_") && "query_hash" in d)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}

export async function usageSummary(): Promise<UsageSummary> {
  const policy = await getResearchPolicy();
  const all = await listUsage(5000);
  const today = all.filter((e) => e.at.slice(0, 10) === dayKey());
  const month = all.filter((e) => e.at.slice(0, 7) === monthKey());
  const usd = (xs: ResearchUsageEvent[]) => Math.round(xs.reduce((n, e) => n + (e.reported_usd ?? e.estimated_usd), 0) * 10000) / 10000;
  const t = { requests: today.length, usd: usd(today) };
  const m = { requests: month.length, usd: usd(month) };
  return {
    today: t,
    month: m,
    caps: { daily_request_cap: policy.daily_request_cap, monthly_usd_cap: policy.monthly_usd_cap },
    // -1 means no cap is set.
    remaining: {
      requests_today: policy.daily_request_cap > 0 ? Math.max(0, policy.daily_request_cap - t.requests) : -1,
      usd_month: policy.monthly_usd_cap > 0 ? Math.max(0, Math.round((policy.monthly_usd_cap - m.usd) * 10000) / 10000) : -1,
    },
  };
}

/* ---------- Admission decision ---------- */

export type AdmissionReason =
  | "owner_stop"
  | "research_stop"
  | "access_not_open"
  | "research_disabled"
  | "mode_off"
  | "deep_research_disabled"
  | "safety_refused"
  | "daily_cap_reached"
  | "monthly_cap_reached"
  | "no_provider_configured";

export type Admission = { ok: true; policy: ResearchPolicy; summary: UsageSummary } | { ok: false; reason: AdmissionReason; message: string; policy: ResearchPolicy; summary: UsageSummary };

/** Staff-facing messages: plain language, no vendor names. */
const MESSAGES: Record<AdmissionReason, string> = {
  owner_stop: "The Equity and Inclusion Operations Consultant has paused Ask, so no public sources were searched.",
  research_stop: "The Equity and Inclusion Operations Consultant has paused outside research. You can still use the answer from program resources below.",
  access_not_open: "Outside research is not available for general use yet. You can still use the answer from program resources below.",
  research_disabled: "The Equity and Inclusion Operations Consultant has turned off outside research for now. You can still use program resources.",
  mode_off: "Outside research is turned off for now.",
  deep_research_disabled: "In-depth research is turned off for now. You can still look for current public sources.",
  safety_refused: "This question cannot be sent outside the program as written. Keep the question general, remove names and private details, and try again.",
  daily_cap_reached: "Today's allowance for outside research has been used. Try again tomorrow or use the program resources.",
  monthly_cap_reached: "This month's budget for outside research has been used. You can still use the answer from program resources below.",
  no_provider_configured: "Outside research is not available right now. You can still use the answer from program resources below.",
};

export async function admitResearch(
  question: string,
  depth: "current_web" | "deep_research",
  explicit: boolean,
  providerConfigured: boolean,
  role: "staff" | "owner" = "staff",
): Promise<Admission> {
  const [autonomy, policy, summary] = await Promise.all([getPolicy(), getResearchPolicy(), usageSummary()]);
  const fail = (reason: AdmissionReason): Admission => ({ ok: false, reason, message: MESSAGES[reason], policy, summary });
  // Owner controls: the global stop, the research stop, and enable/disable. No staff-side access gate
  // (owner directive: all staff, any question). `role` is kept for audit symmetry only.
  void role;
  if (autonomy.killed) return fail("owner_stop");
  if (process.env.PAC_RESEARCH_KILL_SWITCH === "on") return fail("research_stop");
  if (!policy.enabled) return fail("research_disabled");
  if (policy.mode === "off") return fail("mode_off");
  if (policy.mode === "on_request" && !explicit) return fail("mode_off");
  if (depth === "deep_research" && !policy.deep_research_enabled) return fail("deep_research_disabled");
  // Non-negotiable: nothing about a person leaves the program.
  if (!externalResearchGate(question).ok) return fail("safety_refused");
  if (policy.daily_request_cap > 0 && summary.remaining.requests_today <= 0) return fail("daily_cap_reached");
  if (policy.monthly_usd_cap > 0 && summary.remaining.usd_month <= 0) return fail("monthly_cap_reached");
  if (!providerConfigured) return fail("no_provider_configured");
  return { ok: true, policy, summary };
}
