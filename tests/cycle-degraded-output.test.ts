import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { runCycle } from "@/lib/intelligence/agents/cycle";
import * as providers from "@/lib/intelligence/providers";
import { getModel } from "@/lib/intelligence/registry/models";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
beforeEach(() => { resetStoreForTests(); invalidatePolicyCache(); });
afterEach(() => { vi.restoreAllMocks(); });
it.each([null, {}, { summary: "Incomplete output" }])("records a rejected program summary in the persisted cycle receipt: %j", async (parsed) => {
  vi.spyOn(providers, "resolveBinding").mockReturnValue({
    model: getModel("mdl_claude_staff_primary")!, generative: true, reason: "synthetic output",
    adapter: { id: "anthropic", generative: true, health: async () => ({ ok: true, latency_ms: 0 }), complete: async () => ({ parsed, model_id: "mdl_claude_staff_primary" }) },
  });
  const report = await runCycle("owner");
  expect(report.generative).toBe(false);
  expect(report.summary.length).toBeGreaterThan(0);
  expect(report.exceptions).toContain("generative summary unavailable: generated_summary_rejected");
  expect(await getStore().get("decision", `cycle:${report.id}`)).toEqual(report);
});
