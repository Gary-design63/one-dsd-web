/**
 * governedResearch: the only entry point Ask (or any agent) may use to reach current external
 * sources. Admission -> provider route -> call -> usage ledger -> typed external evidence.
 * Every call is a governed research tool invocation so the
 * allowlist, autonomy ceiling, owner stop, and audit apply.
 */
import { runTool } from "../tools/runtime";
import type { ToolContext } from "../types";
import { errorStatus, providerErrorExcerpt } from "../providers/log";
import { admitResearch, getResearchPolicy, hashQuery, recordUsage, type Admission } from "./governance";
import {
  resolveResearchProvider,
  searchWithPerplexity,
  type ExternalSource,
  type ResearchDepth,
  type ResearchOutput,
  type ResearchProviderId,
} from "./providers";

export type GovernedResearchResult =
  | { status: "used"; output: ResearchOutput; provider: ResearchProviderId; note: string }
  | { status: "not_admitted"; reason: Admission extends { ok: false } ? Admission["reason"] : string; message: string }
  | { status: "failed"; message: string; error_code: string };

/**
 * Providers throw finite codes (research_http_401, research_timeout, research_model_not_allowed, ...).
 * Keep that code for the usage ledger and the log; anything else collapses to the generic code.
 */
function researchFailure(error: unknown, context: { trace_id: string; provider: string; model: string; depth: string }): string {
  const message = error instanceof Error ? error.message : "";
  const code = /^[a-z][a-z0-9_]{0,79}$/.test(message) ? message
    : error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError") ? "research_timeout"
    : "research_execution_failed";
  const status = errorStatus(error);
  console.error("research_failed", {
    ...context, code,
    ...(status ? { status } : {}),
    ...(code === "research_execution_failed" ? { error: providerErrorExcerpt(error, 200) } : {}),
  });
  return code;
}

export const EXTERNAL_EVIDENCE_NOTE =
  "These sources come from the public web, not from this program. They are not DHS guidance. Check the original source and confirm anything important with the appropriate policy or content owner before you act.";

export type GovernedResearchAvailability = {
  configured: boolean;
  enabled: boolean;
  stopped: boolean;
  provider: ResearchProviderId | null;
  fastDepth: "current_web";
  deepDepth: "deep_research";
  rawSearchAvailable: boolean;
};

/** Server-only status summary. It never returns a credential or secret-bearing value. */
export async function governedResearchAvailability(role: "staff" | "owner" = "staff"): Promise<GovernedResearchAvailability> {
  const [policy, autonomy] = await Promise.all([getResearchPolicy(), (await import("../policy")).getPolicy()]);
  const provider = resolveResearchProvider(policy.provider_order);
  const stopped = autonomy.killed || process.env.PAC_RESEARCH_KILL_SWITCH === "on";
  const configured = Boolean(provider);
  // Owner directive: every staff member may use external research for any question; no audience gate.
  const audienceAllowed = true;
  void role;
  return {
    configured,
    enabled: configured && policy.enabled && policy.mode !== "off" && !stopped && audienceAllowed,
    stopped,
    provider: provider?.id ?? null,
    fastDepth: "current_web",
    deepDepth: "deep_research",
    rawSearchAvailable: configured && policy.enabled && policy.mode !== "off" && !stopped,
  };
}

export async function governedResearch(question: string, depth: ResearchDepth, explicit: boolean, ctx: ToolContext, fetcher?: typeof fetch): Promise<GovernedResearchResult> {
  const policy = await getResearchPolicy();
  const preview = resolveResearchProvider(policy.provider_order);
  if (ctx.dry_run) {
    return {
      status: "not_admitted",
      reason: "dry_run",
      message: "This check does not look at current public sources.",
    };
  }
  const admission = await admitResearch(question, depth, explicit, Boolean(preview), ctx.role);
  if (!admission.ok) return { status: "not_admitted", reason: admission.reason, message: admission.message };
  const provider = resolveResearchProvider(admission.policy.provider_order);
  if (!provider) return { status: "not_admitted", reason: "no_provider_configured", message: "Outside research is not available right now. You can still use the answer from program resources." };

  const started = Date.now();
  const query_hash = await hashQuery(question);
  const toolName = depth === "deep_research" ? "research.deep_search" : "research.current_answer";
  try {
    const output = await runTool(
      ctx,
      toolName,
      () => provider.run({ question, depth, allowed_domains: admission.policy.allowed_domains, recency: admission.policy.recency, trace_id: ctx.trace_id }, fetcher),
      { modelId: provider.modelFor(depth) },
    );
    await recordUsage({
      at: new Date().toISOString(),
      provider: provider.id,
      model: output.model,
      depth,
      query_hash,
      domains: Array.from(new Set(output.sources.map((s) => s.domain))).slice(0, 20),
      estimated_usd: output.estimated_usd,
      reported_usd: output.usage.reported_usd,
      input_tokens: output.usage.input_tokens,
      output_tokens: output.usage.output_tokens,
      search_queries: output.usage.search_queries,
      web_search_calls: output.usage.web_search_calls,
      fetch_url_calls: output.usage.fetch_url_calls,
      tool_calls: output.usage.tool_calls,
      ok: true,
      latency_ms: Date.now() - started,
      trace_id: ctx.trace_id,
      provider_trace_id: output.providerTraceId,
    });
    return { status: "used", output, provider: provider.id, note: EXTERNAL_EVIDENCE_NOTE };
  } catch (error) {
    const code = researchFailure(error, { trace_id: ctx.trace_id, provider: provider.id, model: provider.modelFor(depth), depth });
    await recordUsage({
      at: new Date().toISOString(),
      provider: provider.id,
      model: provider.modelFor(depth),
      depth,
      query_hash,
      domains: [],
      estimated_usd: 0,
      ok: false,
      error_code: code,
      latency_ms: Date.now() - started,
      trace_id: ctx.trace_id,
    });
    return { status: "failed", message: "We couldn't complete the outside research just now. You can still use the answer from program resources below, including its sources and limits.", error_code: code };
  }
}

export type GovernedSearchResult =
  | { status: "used"; sources: ExternalSource[]; note: string; providerTraceId?: string }
  | { status: "not_admitted"; reason: string; message: string }
  | { status: "failed"; message: string; error_code: string };

/** Governed raw ranked search for authorized reasoning workflows. */
export async function governedSearch(
  question: string,
  explicit: boolean,
  ctx: ToolContext,
  fetcher?: typeof fetch,
): Promise<GovernedSearchResult> {
  const policy = await getResearchPolicy();
  const selected = resolveResearchProvider(policy.provider_order);
  if (selected?.id !== "perplexity_agent") {
    const result = await governedResearch(question, "current_web", explicit, ctx, fetcher);
    return result.status === "used"
      ? { status: "used", sources: result.output.sources, note: result.note, providerTraceId: result.output.providerTraceId }
      : result;
  }
  if (ctx.dry_run) {
    return { status: "not_admitted", reason: "dry_run", message: "This check does not look at current public sources." };
  }
  const admission = await admitResearch(question, "current_web", explicit, Boolean(selected), ctx.role);
  if (!admission.ok) return { status: "not_admitted", reason: admission.reason, message: admission.message };
  const started = Date.now();
  const query_hash = await hashQuery(question);
  try {
    const output = await runTool(
      ctx,
      "research.web_search",
      () => searchWithPerplexity({ question, allowed_domains: admission.policy.allowed_domains, recency: admission.policy.recency }, fetcher),
      { modelId: "perplexity-search" },
    );
    await recordUsage({
      at: new Date().toISOString(),
      provider: "perplexity_agent",
      model: "perplexity-search",
      depth: "current_web",
      query_hash,
      domains: Array.from(new Set(output.sources.map((source) => source.domain))).slice(0, 20),
      estimated_usd: 0.005,
      search_queries: 1,
      ok: true,
      latency_ms: Date.now() - started,
      trace_id: ctx.trace_id,
      provider_trace_id: output.providerTraceId,
    });
    return {
      status: "used",
      sources: output.sources,
      note: EXTERNAL_EVIDENCE_NOTE,
      providerTraceId: output.providerTraceId,
    };
  } catch (error) {
    const code = researchFailure(error, { trace_id: ctx.trace_id, provider: "perplexity_agent", model: "perplexity-search", depth: "current_web" });
    await recordUsage({
      at: new Date().toISOString(),
      provider: "perplexity_agent",
      model: "perplexity-search",
      depth: "current_web",
      query_hash,
      domains: [],
      estimated_usd: 0,
      ok: false,
      error_code: code,
      latency_ms: Date.now() - started,
      trace_id: ctx.trace_id,
    });
    return { status: "failed", message: "We couldn't find current public sources just now. Please try again later or use the program resources.", error_code: code };
  }
}

export { plainText } from "./providers";
export type { ExternalSource, ResearchDepth, ResearchOutput, ResearchProviderId } from "./providers";
