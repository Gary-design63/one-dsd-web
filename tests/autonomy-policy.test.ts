import { beforeEach, describe, expect, it, vi } from "vitest";
import * as organization from "@/lib/intelligence/memory/organization";
import { resetStoreForTests, getStore } from "@/lib/intelligence/memory/store";
import { defaultPolicy, invalidatePolicyCache, setPolicy, getPolicy } from "@/lib/intelligence/policy";
import { runCycle, undoCycle, listProposals, decideProposal } from "@/lib/intelligence/agents/cycle";
import * as O from "@/lib/intelligence/orchestrator";
import { runTool, ToolDenied } from "@/lib/intelligence/tools/runtime";
import { getAgent } from "@/lib/intelligence/registry/agents";
import type { ConsultRequest } from "@/lib/intelligence/consult/schema";
import { testTraceId } from "@/tests/helpers/opaque-identifiers";

const INTAKE = {
  program_context: "one_dsd" as const,
  dsd_eligibility_attestation: true as const,
  participation_notice_id: "dsd_consultation_request" as const,
  participation_notice_version: "1.0.0",
  work_name: "Benefits renewal online application",
  stage: "conceptual",
  goals: "Let people renew benefits online without a paper form, and reduce churn caused by missed mail.",
  desired_support_type: ["scoping_goals"],
  timing_urgency: "within_2_weeks",
  situation: "We are at the concept stage for a digital renewal application. We want to embed equity and access before design is fixed and are not sure what questions to work through first.",
  share_confirmation: true as const,
};

describe("autonomy policy: kill switch, ceiling, cycles, undo, proposals", () => {
  beforeEach(async () => {
    resetStoreForTests();
    invalidatePolicyCache();
  });

  it("falls back to A0 when no environment ceiling is configured", () => {
    const configured = process.env.PAC_AUTONOMY_MAX;
    delete process.env.PAC_AUTONOMY_MAX;
    try {
      expect(defaultPolicy().max_autonomy).toBe("A0");
    } finally {
      if (configured === undefined) delete process.env.PAC_AUTONOMY_MAX;
      else process.env.PAC_AUTONOMY_MAX = configured;
    }
  });

  it("runs a full cycle at the test suite's explicitly configured A5 ceiling", async () => {
    const policy = await getPolicy();
    expect(policy.killed).toBe(false);
    expect(policy.max_autonomy).toBe("A5");
    const created = await O.intakeSubmit(INTAKE);
    expect(created.kind).toBe("created");
    if (created.kind !== "created") throw new Error("Expected a consultation request fixture.");
    const admitted = await O.queueUpdate(created.request.request_id, { eligibility_decision: "confirmed_dsd" });
    expect(admitted.ok).toBe(true);
    // The cycle also reports the weekly DHS source review; pin that check inside its review window so this test stays about the cycle.
    const maintenance = organization.organizationalMaintenance;
    const pinned = vi.spyOn(organization, "organizationalMaintenance").mockImplementation(() => maintenance(new Date("2026-09-08T18:00:00Z")));
    const report = await runCycle("owner");
    pinned.mockRestore();
    expect(report.effective_ceiling).toBe("A5");
    expect(report.triaged.length).toBe(1);
    const req = await getStore().get<ConsultRequest>("consult_request", report.triaged[0].request_id);
    expect(req?.status).toBe("under_review");
    expect(report.steps.some((s) => s.name === "write proposals" && s.outcome === "done")).toBe(true);
    expect(report.proposals.length).toBeGreaterThan(0);
    expect(report.exceptions).toEqual([]);
    expect(report.summary.length).toBeGreaterThan(20);
  });

  it("keeps pending eligibility requests outside every active orchestration step", async () => {
    const created = await O.intakeSubmit(INTAKE);
    expect(created.kind).toBe("created");
    if (created.kind !== "created") throw new Error("Expected a consultation request fixture.");
    const before = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);

    const report = await runCycle("owner");
    const after = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);

    expect(before?.eligibility_status).toBe("pending");
    expect(before?.status).toBe("pending_eligibility_review");
    expect(report.refreshed_packets).not.toContain(created.request.request_id);
    expect(report.triaged.map((item) => item.request_id)).not.toContain(created.request.request_id);
    expect(after).toEqual(before);
  });

  it("A5 proposals exist at ceiling A5 and never self-apply; accepting a policy proposal changes policy", async () => {
    await setPolicy({ max_autonomy: "A2" }, "owner");
    const report = await runCycle("owner");
    expect(report.triaged.length).toBe(0);
    expect(report.steps.find((s) => s.name === "triage queue (reversible)")?.outcome).toBe("skipped");
    expect(report.steps.find((s) => s.name === "bounded workflow")?.outcome).toBe("skipped");
    await setPolicy({ max_autonomy: "A5" }, "owner");
    const r2 = await runCycle("owner");
    expect(r2.proposals.length).toBeGreaterThan(0);
    const before = await getPolicy();
    expect(before.max_autonomy).toBe("A5");
    const proposals = await listProposals();
    expect(proposals.every((p) => p.status === "proposed")).toBe(true);
    const ctx = O.contextFor("eval_steward", "owner");
    const rejected = await decideProposal(proposals[0].id, "rejected", "not now", ctx);
    expect(rejected?.status).toBe("rejected");
    expect(await getStore().get("decision", `rejected_rec:${proposals[0].id}`)).not.toBeNull();
  });

  it("undo clears automation-owned priority metadata without regressing lifecycle history", async () => {
    const created = await O.intakeSubmit(INTAKE);
    if (created.kind !== "created") throw new Error("Expected a consultation request fixture.");
    const admitted = await O.queueUpdate(created.request.request_id, { eligibility_decision: "confirmed_dsd" });
    expect(admitted.ok).toBe(true);
    const report = await runCycle("owner");
    const beforeUndo = await getStore().get<ConsultRequest>("consult_request", report.triaged[0].request_id);
    expect(beforeUndo?.status).toBe("under_review");
    expect(beforeUndo?.pinned_order).toBeTypeOf("number");
    const historyBeforeUndo = structuredClone(beforeUndo?.history);
    const undo = await undoCycle(report.id, "owner");
    expect(undo.ok).toBe(true);
    expect(undo.reverted).toBeGreaterThanOrEqual(1);
    const req = await getStore().get<ConsultRequest>("consult_request", report.triaged[0].request_id);
    expect(req?.status).toBe("under_review");
    expect(req?.pinned_order).toBeUndefined();
    expect(req?.history).toEqual(historyBeforeUndo);
  });

  it("kill switch stops every agent immediately and the cycle does nothing", async () => {
    await setPolicy({ killed: true, note: "test" }, "owner");
    const report = await runCycle("cron");
    expect(report.steps[0].outcome).toBe("skipped");
    expect(report.triaged).toEqual([]);
    expect(await O.paused()).toBe(true);
    const askCtx = { trace_id: testTraceId("killed-ask"), agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const };
    await expect(runTool(askCtx, "answer.structured_draft", () => 1)).rejects.toBeInstanceOf(ToolDenied);
    await setPolicy({ killed: false }, "owner");
    expect(await O.paused()).toBe(false);
  });

  it("scaling back to A2 denies A3 tools for every agent; per-agent override lowers further", async () => {
    await setPolicy({ max_autonomy: "A2" }, "owner");
    const ctx = { trace_id: testTraceId("autonomy-consult"), agent: getAgent("consult_intake"), dry_run: false, role: "owner" as const };
    await expect(runTool(ctx, "queue.auto_triage", () => 1)).rejects.toBeInstanceOf(ToolDenied);
    await setPolicy({ max_autonomy: "A4", agents: { ask_concierge: { ceiling: "A1" } } }, "owner");
    const askCtx = { trace_id: testTraceId("autonomy-ask"), agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const };
    await expect(runTool(askCtx, "answer.structured_draft", () => 1)).rejects.toBeInstanceOf(ToolDenied);
    await expect(runTool(askCtx, "corpus.search", () => 1)).resolves.toBe(1);
  });

  it("normalizes tool failures instead of persisting arbitrary exception text", async () => {
    const traceId = testTraceId("normalized-failure");
    const ctx = { trace_id: traceId, agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const };
    const sensitiveMessage = "worker-17:equity-readiness:low";

    await expect(runTool(ctx, "corpus.search", () => {
      throw new Error(sensitiveMessage);
    })).rejects.toThrow(sensitiveMessage);

    const event = (await getStore().listAudit()).find((item) => item.trace_id === traceId);
    expect(event?.error_code).toBe("tool_execution_failed");
    expect(JSON.stringify(event)).not.toContain(sensitiveMessage);
  });

  it("audits an unregistered tool denial without persisting its supplied name", async () => {
    const traceId = testTraceId("unknown-tool-denial");
    const ctx = { trace_id: traceId, agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const };
    const suppliedName = "worker-17-equity-profile.attack";

    await expect(runTool(ctx, suppliedName, () => 1)).rejects.toBeInstanceOf(ToolDenied);

    const event = (await getStore().listAudit()).find((item) => item.trace_id === traceId);
    expect(event).toMatchObject({
      tool_name: "runtime.unknown_tool_refusal",
      allowlist_hit: false,
      allowlist_miss_reason: "tool not registered",
      error_code: "tool_unknown",
      ok: false,
    });
    expect(JSON.stringify(event)).not.toContain(suppliedName);
  });
});
