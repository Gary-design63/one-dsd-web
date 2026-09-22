/**
 * Autonomy policy: the owner's governor over the whole agent framework.
 *
 * Owner directive (Gary Banks, September 4, 2026): the framework must do real work at
 * full autonomy, with a kill switch and a scale-back control the owner holds. This module
 * is that control. It is read on every tool call and can be changed at runtime from the
 * Consultant Workspace without a deploy.
 *
 *  - killed: true stops every agent immediately; browse and search stay up.
 *  - max_autonomy: A0..A5 ceiling applied to every agent (scale back or up instantly).
 *  - agents: per-agent enable and ceiling overrides.
 *  - flags: runtime overrides for feature flags (for example enabling the generative model).
 */
import { PROGRAM } from "@/lib/constants";
import { getStore, type Store } from "./memory/store";
import { assertKnownFlagOverrides, flagEnabled, setFlagOverrides, type FlagKey } from "./registry/flags";
import { AUTONOMY_ORDER, autonomyRank, type AgentDefinition, type AgentId, type Autonomy } from "./types";

export type AutonomyPolicy = {
  killed: boolean;
  max_autonomy: Autonomy;
  agents: Partial<Record<AgentId, { enabled?: boolean; ceiling?: Autonomy }>>;
  flags: Partial<Record<FlagKey, boolean>>;
  updated_at: string;
  by: "env_default" | "owner" | "system";
  note?: string;
};

const POLICY_ID = "autonomy_policy";

function isAutonomy(v: string | undefined): v is Autonomy {
  return Boolean(v && (AUTONOMY_ORDER as string[]).includes(v));
}

export function defaultPolicy(): AutonomyPolicy {
  const envMax = process.env.PAC_AUTONOMY_MAX;
  const killed = ["1", "true", "on", "yes"].includes((process.env.PAC_KILL_SWITCH ?? "").toLowerCase());
  return {
    killed,
    max_autonomy: isAutonomy(envMax) ? envMax : "A0",
    agents: {},
    flags: {},
    updated_at: new Date(0).toISOString(),
    by: "env_default",
  };
}

let cache = new WeakMap<Store, { policy: AutonomyPolicy; at: number }>();

export async function getPolicy(): Promise<AutonomyPolicy> {
  const store = getStore();
  const cached = cache.get(store);
  if (cached && Date.now() - cached.at < 2000) return cached.policy;
  const stored = await store.get<AutonomyPolicy>("decision", POLICY_ID);
  const policy = stored ?? defaultPolicy();
  setFlagOverrides(policy.flags ?? {});
  cache.set(store, { policy, at: Date.now() });
  return policy;
}

export async function setPolicy(patch: Partial<Pick<AutonomyPolicy, "killed" | "max_autonomy" | "agents" | "flags" | "note">>, by: AutonomyPolicy["by"] = "owner"): Promise<AutonomyPolicy> {
  const current = await getPolicy();
  assertKnownFlagOverrides(patch.flags ?? current.flags);
  const next: AutonomyPolicy = {
    ...current,
    ...patch,
    agents: { ...current.agents, ...(patch.agents ?? {}) },
    flags: patch.flags ?? current.flags,
    updated_at: new Date().toISOString(),
    by,
  };
  await getStore().put("decision", POLICY_ID, next);
  setFlagOverrides(next.flags);
  cache.set(getStore(), { policy: next, at: Date.now() });
  return next;
}

export function invalidatePolicyCache() {
  cache = new WeakMap();
}

/** Hard environment cap. A5 (propose adaptation) is the top of the ladder. */
export const HARD_CAP: Autonomy = "A5";

export function effectiveCeiling(agent: AgentDefinition, policy: AutonomyPolicy): Autonomy {
  const candidates: Autonomy[] = [agent.autonomy_ceiling, policy.max_autonomy, policy.agents[agent.agent_id]?.ceiling ?? HARD_CAP, HARD_CAP];
  const min = Math.min(...candidates.map(autonomyRank));
  return AUTONOMY_ORDER[min];
}

export function agentAllowed(agent: AgentDefinition, policy: AutonomyPolicy): { ok: boolean; reason?: string } {
  if (policy.killed) return { ok: false, reason: `paused by the ${PROGRAM.practiceOwnerRole}` };
  const override = policy.agents[agent.agent_id]?.enabled;
  if (override === false) return { ok: false, reason: "agent disabled by owner policy" };
  if (override !== true && !agent.enabled) return { ok: false, reason: "agent disabled in its definition" };
  if (agent.feature_flag && !(policy.flags[agent.feature_flag as FlagKey] ?? flagEnabled(agent.feature_flag))) {
    return { ok: false, reason: "agent feature flag is off" };
  }
  return { ok: true };
}

/** Plain-language message for staff surfaces when the framework is paused. */
export const PAUSED_MESSAGE = `Guided support is paused by the ${PROGRAM.practiceOwnerRole}. Resources and Minnesota Communities are still available, and Support shows other ways to get help.`;
