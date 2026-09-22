import { afterEach, expect, it, vi } from "vitest";
import { CASES } from "@/lib/intelligence/eval/runner";
import { getStore, resetStoreForTests, withIsolatedMemoryStore } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { consultationIntakeEnabled } from "@/lib/intelligence/consult/availability";
afterEach(() => { vi.unstubAllEnvs(); invalidatePolicyCache(); });
it("runs isolated consultation checks in the application environment without activating or writing real intake", async () => {
  resetStoreForTests(); invalidatePolicyCache();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("PAC_CONSULTATION_ENABLED", "false");
  vi.stubEnv("PAC_GENERATIVE_PILOT", "false");
  expect(consultationIntakeEnabled()).toBe(false);
  const consultationOnly = CASES.filter((entry) => entry.suite === "ciq_mvp" && entry.id !== "CIQ-E9" && entry.id !== "CIQ-E10");
  expect(consultationOnly.map((entry) => entry.id)).toEqual(["CIQ-E1", "CIQ-E2", "CIQ-E3", "CIQ-E4", "CIQ-E5", "CIQ-E6", "CIQ-E7", "CIQ-E8"]);
  const report = await withIsolatedMemoryStore(async () => {
    const results = [];
    for (const entry of consultationOnly) {
      const outcome = await entry.run();
      results.push({ id: entry.id, ok: "ok" in outcome && outcome.ok === true });
    }
    return { results, requests: await getStore().list("consult_request") };
  });
  expect(report.results.every((result) => result.ok)).toBe(true);
  expect(report.results).toHaveLength(8);
  expect(await getStore().list("consult_request")).toEqual([]);
  expect(consultationIntakeEnabled()).toBe(false);
}, 30_000);
import { resolveBinding } from "@/lib/intelligence/providers";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { setFlagOverrides } from "@/lib/intelligence/registry/flags";
it("keeps sample drafting in process while leaving the concurrent application binding connected", async () => {
  vi.stubEnv("PAC_GENERATIVE_PILOT", "true");
  vi.stubEnv("OPENAI_API_KEY", "synthetic-credential-for-binding-only");
  setFlagOverrides({});
  const agent = getAgent("ask_concierge");
  expect(resolveBinding(agent).generative).toBe(true);
  await withIsolatedMemoryStore(async () => {
    expect(resolveBinding(agent).generative).toBe(false);
    expect(resolveBinding(agent).adapter.id).toBe("fixture");
    await Promise.resolve();
    expect(resolveBinding(agent).generative).toBe(false);
  });
  expect(resolveBinding(agent).generative).toBe(true);
});
import { getPolicy, setPolicy } from "@/lib/intelligence/policy";
import { flagEnabled } from "@/lib/intelligence/registry/flags";
it("keeps a simultaneous workspace pause and drafting flag separate from evaluation settings", async () => {
  resetStoreForTests(); invalidatePolicyCache();
  await setPolicy({ killed: true, flags: { "model.generative_pilot": true } }, "owner");
  let enter!: () => void; let release!: () => void;
  const entered = new Promise<void>(resolve => { enter = resolve; });
  const released = new Promise<void>(resolve => { release = resolve; });
  const sample = withIsolatedMemoryStore(async () => {
    expect((await getPolicy()).killed).toBe(false);
    await setPolicy({ killed: false, flags: { "model.generative_pilot": false } }, "system");
    enter(); await released;
    expect((await getPolicy()).killed).toBe(false);
    expect(flagEnabled("model.generative_pilot")).toBe(false);
  });
  await entered;
  try {
    expect((await getPolicy()).killed).toBe(true);
    expect(flagEnabled("model.generative_pilot")).toBe(true);
  } finally { release(); }
  await sample;
  expect((await getPolicy()).killed).toBe(true);
  setFlagOverrides({});
});
