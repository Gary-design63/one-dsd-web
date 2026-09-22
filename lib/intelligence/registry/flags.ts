/**
 * Feature flags (TRD §10.1). Owner-controlled; changes audited.
 * Defaults: only the MVP roster on; near-term agents and tools off; A3 experiments off.
 * Environment overrides are read at runtime so a preview can enable the generative
 * pilot without a code change (still owner-controlled through env configuration).
 */

import { AsyncLocalStorage } from "node:async_hooks";

export type FlagClass = "agent" | "tool" | "model" | "autonomy" | "surface";

export type Flag = {
  key: string;
  cls: FlagClass;
  description: string;
  defaultValue: boolean;
  /** Environment variable that can override the default. */
  env?: string;
};

export const FLAGS = [
  { key: "agent.content_sentinel", cls: "agent", description: "Content Lifecycle / Stale-content Sentinel", defaultValue: false },
  { key: "agent.eval_steward_write", cls: "agent", description: "Evaluation & Model Registry Steward write paths (proposals, eval memory)", defaultValue: false },
  { key: "model.generative_pilot", cls: "model", description: "Bind an approved provider for drafting when a server-side key and release decision exist. Falls back to the deterministic composer when unavailable.", defaultValue: false, env: "PAC_GENERATIVE_PILOT" },
  { key: "autonomy.a3_calendar_schedule", cls: "autonomy", description: "calendar.schedule_reversible (A3). Off: no calendar integration adapter exists yet (DHS integration is a separate decision).", defaultValue: false },
  { key: "autonomy.a3_stale_flag", cls: "autonomy", description: "Auto-flag stale content state (A3, reversible).", defaultValue: false },
  { key: "tool.browser_fetch_public", cls: "tool", description: "browser.fetch_public with domain allowlist (later)", defaultValue: false },
  { key: "tool.office_drafts", cls: "tool", description: "office.draft_* (later)", defaultValue: false },
  { key: "tool.publish_chain", cls: "tool", description: "publish.* human-approve chain (later)", defaultValue: false },
  { key: "surface.ecosystem_intelligence", cls: "surface", description: "Ecosystem intelligence pilot-ready views (deferred).", defaultValue: false },
] as const satisfies readonly Flag[];

export type FlagKey = (typeof FLAGS)[number]["key"];
export const FLAG_KEYS = FLAGS.map((flag) => flag.key) as [FlagKey, ...FlagKey[]];

export function isFlagKey(value: string): value is FlagKey {
  return FLAGS.some((flag) => flag.key === value);
}

export class UnknownFlagKeyError extends Error {
  readonly code = "unknown_flag_key";

  constructor(readonly key: string) {
    super(`The feature flag is not registered: ${key}.`);
    this.name = "UnknownFlagKeyError";
  }
}

export function assertKnownFlagOverrides(overrides: Readonly<Record<string, boolean>>): void {
  for (const key of Object.keys(overrides)) {
    if (!isFlagKey(key)) throw new UnknownFlagKeyError(key);
  }
}

function envBool(name: string | undefined): boolean | undefined {
  if (!name) return undefined;
  const v = process.env[name];
  if (v === undefined) return undefined;
  return ["1", "true", "on", "yes"].includes(v.toLowerCase());
}

/** Runtime overrides set by the owner's autonomy policy (lib/intelligence/policy.ts). */
let runtimeOverrides: Partial<Record<FlagKey, boolean>> = {};
const scopedOverrides = new AsyncLocalStorage<{ values: Partial<Record<FlagKey, boolean>> }>();

export function withIsolatedFlagOverrides<T>(work: () => Promise<T>): Promise<T> {
  return scopedOverrides.run({ values: {} }, work);
}

function currentOverrides() {
  return scopedOverrides.getStore()?.values ?? runtimeOverrides;
}

export function setFlagOverrides(overrides: Record<string, boolean>) {
  // Stored legacy keys are ignored here so a removed flag cannot re-enable a
  // surface or make reads unavailable. New mutations are rejected by
  // setPolicy and the request schema before they reach this compatibility path.
  const next: Partial<Record<FlagKey, boolean>> = {};
  for (const [key, value] of Object.entries(overrides)) {
    if (isFlagKey(key)) next[key] = value;
  }
  const scoped = scopedOverrides.getStore();
  if (scoped) scoped.values = next;
  else runtimeOverrides = next;
}

export function flagEnabled(key: string): boolean {
  const f = FLAGS.find((x) => x.key === key);
  if (!f) return false;
  const overrides = currentOverrides();
  if (isFlagKey(key) && key in overrides) return overrides[key] ?? false;
  const override = envBool("env" in f ? f.env : undefined);
  return override ?? f.defaultValue;
}

export function flagList(): Array<Flag & { value: boolean; source: "default" | "env" | "owner" }> {
  const overrides = currentOverrides();
  return FLAGS.map((f) => {
    if (f.key in overrides) return { ...f, value: overrides[f.key] ?? false, source: "owner" };
    const override = envBool("env" in f ? f.env : undefined);
    return { ...f, value: override ?? f.defaultValue, source: override === undefined ? "default" : "env" };
  });
}
