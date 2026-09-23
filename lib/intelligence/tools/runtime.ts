/**
 * Tool adapter runtime (TRD §7, §11). Every tool call passes through here:
 *  1. tool exists and is enabled (near-term/later tools are off by default)
 *  2. tool is in the agent's allowlist
 *  3. tool min_autonomy <= agent ceiling <= environment max (A2 at MVP)
 *  4. permission mode: owner_only requires owner role; side-effect tools honor dry_run
 *  5. a redacted audit event is emitted, success or failure
 */
import { randomUUID } from "node:crypto";
import { getStore } from "../memory/store";
import { agentAllowed, effectiveCeiling, getPolicy } from "../policy";
import { autonomyRank, type AuditEvent, type SafetyRefusalCode, type ToolContext } from "../types";
import { getTool } from "./catalog";
import { flagEnabled } from "../registry/flags";

export class ToolDenied extends Error {
  constructor(
    public readonly tool: string,
    public readonly reason: string,
  ) {
    super(`${tool}: ${reason}`);
  }
}

export function newTraceId(): string {
  return randomUUID();
}

type RunOptions = {
  contentIds?: string[];
  safetyRefusalCode?: SafetyRefusalCode;
  modelId?: string;
  humanDisposition?: AuditEvent["human_disposition"];
  operationalRight?: "verified_consultation_requester";
};

const REQUESTER_LIFECYCLE_TOOLS = new Set([
  "intake.requester_track",
  "intake.requester_correct",
  "intake.requester_withdraw",
  "intake.requester_rotate_key",
]);

function isRequesterLifecycleRight(ctx: ToolContext, toolName: string, opts: RunOptions): boolean {
  return opts.operationalRight === "verified_consultation_requester"
    && ctx.role === "staff"
    && ctx.agent.agent_id === "consult_intake"
    && REQUESTER_LIFECYCLE_TOOLS.has(toolName);
}

/** Run a named tool under the agent's authority. `fn` performs the work. */
export async function runTool<T>(ctx: ToolContext, toolName: string, fn: () => T | Promise<T>, opts: RunOptions = {}): Promise<T> {
  const appendAudit = (event: AuditEvent) => getStore().appendAudit(event);
  const def = getTool(toolName);
  const started = Date.now();
  const base: Omit<AuditEvent, "ok" | "latency_ms"> = {
    trace_id: ctx.trace_id,
    span_id: randomUUID().slice(0, 8),
    at: new Date().toISOString(),
    agent_id: ctx.agent.agent_id,
    agent_version: ctx.agent.version,
    // Never persist an attacker-controlled or otherwise unregistered tool name.
    // The finite sentinel preserves denial evidence without turning audit storage
    // into a free-text side channel.
    tool_name: def ? toolName : "runtime.unknown_tool_refusal",
    autonomy_level_used: def?.min_autonomy ?? "A0",
    permission_mode: def?.permission_mode ?? "always",
    dry_run: ctx.dry_run,
    content_ids_touched: opts.contentIds ?? [],
    allowlist_hit: true,
    safety_refusal_code: opts.safetyRefusalCode,
    human_disposition: opts.humanDisposition ?? null,
    model_id: opts.modelId,
  };

  const deny = async (reason: string, code: string, auditReason = reason) => {
    // Keep persisted categories compatible with the deployed finite audit
    // contract. More specific diagnostics stay in the returned denial.
    await appendAudit({ ...base, allowlist_hit: false, allowlist_miss_reason: auditReason, ok: false, error_code: code, latency_ms: Date.now() - started });
    throw new ToolDenied(toolName, reason);
  };

  if (!def) return deny("tool not registered", "tool_unknown");
  if (!def.enabled) return deny("tool disabled by flag or phase", "tool_disabled");
  if (!ctx.agent.tools_allowlist.includes(toolName)) return deny("tool not in agent allowlist", "allowlist_miss");

  const policy = await getPolicy();
  const requesterLifecycleRight = isRequesterLifecycleRight(ctx, toolName, opts);
  const allowed = agentAllowed(ctx.agent, policy);
  // Autonomy policy governs agent-authored work. It cannot strand a requester
  // exercising an authenticated lifecycle right on an existing record. The
  // exception remains behind registration, enablement, exact allowlisting,
  // staff context, tracking credential, domain state, safety, and storage CAS.
  if (!allowed.ok && !requesterLifecycleRight) {
    const reason = allowed.reason ?? "agent disabled in its definition";
    return deny(reason, policy.killed ? "kill_switch" : "agent_disabled",
      reason === "agent feature flag is off" ? "agent disabled in its definition" : reason);
  }

  if (!ctx.agent.scope.roles.includes(ctx.role)) return deny("role outside agent scope", "agent_disabled", "agent disabled in its definition");
  const environment = process.env.VERCEL_ENV === "preview" ? "preview"
    : process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production" ? "production" : "local";
  if (!ctx.agent.scope.environments.includes(environment)) return deny("environment outside agent scope", "agent_disabled", "agent disabled in its definition");
  if (toolName === "resource.stale_flag_state" && !flagEnabled("autonomy.a3_stale_flag")) {
    return deny("stale flag writing is disabled", "tool_disabled", "tool disabled by flag or phase");
  }

  const ceiling = effectiveCeiling(ctx.agent, policy);
  if (!requesterLifecycleRight && autonomyRank(def.min_autonomy) > autonomyRank(ceiling)) {
    return deny(`tool requires ${def.min_autonomy}; effective ceiling ${ceiling}`, "autonomy_ceiling");
  }
  if (def.permission_mode === "owner_only" && ctx.role !== "owner") return deny("owner-only tool", "owner_only");
  if (def.side_effect && ctx.dry_run) {
    await appendAudit({ ...base, ok: true, latency_ms: Date.now() - started });
    return undefined as T;
  }

  try {
    const value = await fn();
    await appendAudit({ ...base, ok: true, latency_ms: Date.now() - started });
    return value;
  } catch (err) {
    // Exception messages may contain request content, identifiers, or other
    // ungoverned text. Audit records keep only a finite operational code.
    await appendAudit({ ...base, ok: false, error_code: "tool_execution_failed", latency_ms: Date.now() - started });
    throw err;
  }
}

/** Audit a safety refusal (no payload). */
export async function auditRefusal(ctx: ToolContext, toolName: string, code: SafetyRefusalCode): Promise<void> {
  await getStore().appendAudit({
    trace_id: ctx.trace_id,
    span_id: randomUUID().slice(0, 8),
    at: new Date().toISOString(),
    agent_id: ctx.agent.agent_id,
    agent_version: ctx.agent.version,
    tool_name: toolName,
    autonomy_level_used: "A0",
    permission_mode: "always",
    dry_run: ctx.dry_run,
    content_ids_touched: [],
    allowlist_hit: true,
    safety_refusal_code: code,
    human_disposition: null,
    ok: true,
    latency_ms: 0,
  });
}
