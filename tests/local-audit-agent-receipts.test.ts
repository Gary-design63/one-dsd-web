import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
// This suite verifies real agent workflows, evaluation cases and durable audit
// records. Native embedding cold/warm behavior has separate real-model tests.
// Keep actual keyword retrieval and every evaluation case; only the optional
// semantic hit list is a deterministic empty fixture in this receipt suite.
vi.mock("@/lib/intelligence/retrieval/local-semantic", async importOriginal => ({
  ...await importOriginal<typeof import("@/lib/intelligence/retrieval/local-semantic")>(),
  semanticRetrieveForAgent: vi.fn(async () => []),
}));
import * as O from "@/lib/intelligence/orchestrator";
import { AGENTS } from "@/lib/intelligence/registry/agents";
import { resolveBinding } from "@/lib/intelligence/providers";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache, setPolicy } from "@/lib/intelligence/policy";
import { runTool } from "@/lib/intelligence/tools/runtime";
import { runCycle } from "@/lib/intelligence/agents/cycle";
import { CASES, runCases } from "@/lib/intelligence/eval/runner";
import { semanticRetrieveForAgent } from "@/lib/intelligence/retrieval/local-semantic";
import { pathRecommend, embedQuestionBank } from "@/lib/intelligence/agents/graduation";
import { ROUTING_SIGNALS } from "@/lib/content/paths";
import { staleDetect } from "@/lib/intelligence/agents/librarian";
import * as organization from "@/lib/intelligence/memory/organization";

const receipts: unknown[] = [];
const intake = {
  program_context: "one_dsd", dsd_eligibility_attestation: true,
  work_name: "Synthetic accessible meeting planning task", stage: "conceptual",
  goals: "Plan accessible meeting materials and meaningful participation before making a program decision.",
  desired_support_type: ["scoping_goals"], timing_urgency: "exploratory",
  situation: "A synthetic local audit scenario for planning an inclusive meeting with accessible materials and clear decision ownership.",
  participation_notice_id: "dsd_consultation_request", participation_notice_version: "1.0.0", share_confirmation: true,
};

describe("local agent task receipts", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    resetStoreForTests();
    invalidatePolicyCache();
    await setPolicy({ max_autonomy: "A5", flags: { "agent.content_sentinel": true, "autonomy.a3_stale_flag": true } }, "owner");
  });

  it.each(AGENTS)("executes a substantive task for $agent_id", async (agent) => {
    const started = performance.now();
    const context = O.contextFor(agent.agent_id, "owner");
    let result: unknown;
    switch (agent.agent_id) {
      case "program_orchestrator": {
        // The cycle also reports the weekly DHS source review; pin that check inside its review window so this test stays about the cycle.
        const maintenance = organization.organizationalMaintenance;
        const pinned = vi.spyOn(organization, "organizationalMaintenance").mockImplementation(() => maintenance(new Date("2026-09-08T18:00:00Z")));
        const cycle = await runCycle("owner");
        pinned.mockRestore();
        expect(cycle.exceptions).toEqual([]);
        expect(cycle.steps.some((step) => step.outcome === "done")).toBe(true);
        result = cycle;
        break;
      }
      case "ask_concierge": {
        const answer = await O.ask({ question: "How can I make a staff meeting more accessible?" }, "owner", context.trace_id);
        expect(answer.kind).toBe("answer");
        if (answer.kind === "answer") expect(answer.answer.sources.length).toBeGreaterThan(0);
        result = answer;
        break;
      }
      case "ci_guide": {
        result = await O.communityQuery("Hmong language access", "owner");
        expect(result).toBeDefined();
        break;
      }
      case "librarian": {
        const classification = await O.classify({ title: "Accessible meeting checklist", text: "Before you meet, confirm captions, accessible documents, and language access.", declaredAuthority: "practice_note" });
        expect(classification.type).toBe("checklist");
        result = classification;
        break;
      }
      case "a11y_reviewer": {
        const review = await O.accessibilityReview({ text: "Meeting information", html: '<h1>Meeting</h1><h3>Details</h3><img src="meeting.jpg">', artifactType: "web" }, "owner");
        expect(review.findings.length).toBeGreaterThan(0);
        result = review;
        break;
      }
      case "consult_intake": {
        const created = await O.intakeSubmit(intake);
        expect(created.kind).toBe("created");
        if (created.kind !== "created") throw new Error("Synthetic consultation was not created");
        const stored = await getStore().get("consult_request", created.request.request_id);
        expect(stored).toBeTruthy();
        result = { kind: created.kind, request_id: created.request.request_id, persisted: true };
        break;
      }
      case "graduation_coach": {
        const recommendations = await runTool(context, "learn.path_recommend", () => pathRecommend(ROUTING_SIGNALS.map((signal) => signal.id)));
        expect(recommendations.length).toBeGreaterThan(0);
        result = recommendations;
        break;
      }
      case "embed_advisor": {
        const questions = await runTool(context, "embed.question_bank", () => embedQuestionBank("program_service", "conceptual"));
        expect(questions.length).toBeGreaterThan(0);
        result = questions;
        break;
      }
      case "content_sentinel": {
        result = await staleDetect(context);
        expect(Array.isArray(result)).toBe(true);
        break;
      }
      case "eval_steward": {
        const evaluation = await runTool(context, "eval.run_cases", () => runCases());
        expect(evaluation.fail).toBe(0);
        expect(evaluation.results).toHaveLength(CASES.length);
        expect(semanticRetrieveForAgent).toHaveBeenCalled();
        expect(await getStore().get("eval_result", evaluation.id)).toBeTruthy();
        result = evaluation;
        break;
      }
    }
    const audit = await getStore().listAudit(10000);
    const events = audit.filter((event) => event.agent_id === agent.agent_id);
    expect(events.some((event) => event.ok)).toBe(true);
    const binding = resolveBinding(agent);
    receipts.push({ agent: agent.agent_id, status: "passed", execution: binding.generative ? "connected provider" : "deterministic program logic; no provider call", duration_ms: Math.round(performance.now() - started), result, events });
  });

  it("completes 100 concurrent Ask tasks without losing answers or task receipts", async () => {
    const started = performance.now();
    const results = await Promise.all(Array.from({ length: 100 }, () => O.ask({ question: "How can I make a staff meeting more accessible?" })));
    expect(results.every((result) => result.kind === "answer")).toBe(true);
    const events = await getStore().listAudit(10000);
    const traceIds = new Set(events.filter((event) => event.agent_id === "ask_concierge").map((event) => event.trace_id));
    expect(traceIds.size).toBe(100);
    receipts.push({ task: "concurrent Ask stress check", requests: 100, answers: results.length, distinct_task_traces: traceIds.size, duration_ms: Math.round(performance.now() - started), boundary: "in-process memory backend; HTTP/database load is verified separately" });
  // A correctness stress check (no lost answers or receipts), not a speed limit; duration is recorded above.
  }, 30_000);
});

afterAll(() => {
  const directory = path.resolve("evidence/local-audit-2026-09-07");
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "agent-task-receipts.json"), JSON.stringify({ at: new Date().toISOString(), expected_agents: AGENTS.map((agent) => agent.agent_id), semanticBoundary: "Deterministic empty semantic-hit fixture in this test suite only; real keyword retrieval, agent workflows, all evaluation cases, persistence and audit remain exercised. This receipt does not verify native embedding inference; separate semantic and native-runtime tests cover it.", receipts }, null, 2));
});
