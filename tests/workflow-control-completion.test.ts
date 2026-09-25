import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetStoreForTests, getStore } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache, setPolicy } from "@/lib/intelligence/policy";
import { runCycle, listProposals } from "@/lib/intelligence/agents/cycle";
import { runTool } from "@/lib/intelligence/tools/runtime";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { getModel } from "@/lib/intelligence/registry/models";
import * as providers from "@/lib/intelligence/providers";
import * as publications from "@/lib/content/staff-publications";
import { staffCorpus } from "@/lib/content/corpus";
import { ProhibitedProfileFieldError } from "@/lib/trust/data-classification";
import { assertIdempotencyReceiptPersistence, assertWorkObjectPersistence, WorkObjectContractError } from "@/lib/trust/work-object-contract";
import { testTraceId } from "@/tests/helpers/opaque-identifiers";

const context = (id: Parameters<typeof getAgent>[0]) => ({
  trace_id: testTraceId(`controls-${id}`), agent: getAgent(id), dry_run: false, role: "owner" as const,
});

describe("workflow controls apply to every cycle path", () => {
  beforeEach(async () => {
    resetStoreForTests();
    invalidatePolicyCache();
    await setPolicy({ killed: false, max_autonomy: "A5", flags: {}, agents: {} });
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); invalidatePolicyCache(); });

  it("does not run observations through a disabled orchestrator at a low ceiling", async () => {
    await setPolicy({ max_autonomy: "A0", agents: { program_orchestrator: { enabled: false } } });
    const report = await runCycle("owner");
    expect(report.steps.some(s => s.name === "read queue")).toBe(false);
    expect(report.steps.some(s => s.name === "check brief quality")).toBe(false);
    expect(report.steps.some(s => s.name === "apply consultation retention" && s.outcome === "done")).toBe(true);
    expect(report.proposals).toEqual([]);
  });

  it("honors specialist disablement for brief and accessibility checks", async () => {
    await setPolicy({ agents: { ci_guide: { enabled: false }, a11y_reviewer: { enabled: false } } });
    const report = await runCycle("owner");
    for (const name of ["check brief quality", "scan corpus accessibility"]) {
      expect(report.steps.find(s => s.name === name)?.outcome).toBe("denied");
    }
    expect(report.a11y).toEqual([]);
    expect(report.quality_problems).toEqual([]);
  });

  it("does not run an A2 accessibility scan at A0", async () => {
    await setPolicy({ max_autonomy: "A0" });
    const report = await runCycle("owner");
    expect(report.steps.find(s => s.name === "scan corpus accessibility")?.outcome).toBe("denied");
  });

  it("reviews the selected published collection rather than the seed definitions", async () => {
    vi.spyOn(publications, "loadStaffContentSnapshot").mockResolvedValue({
      source: "postgres", requestedScope: "dsd", items: [{
        ...staffCorpus()[0], id: "asset-reviewed-publication", title: "Published resource",
        reviewDate: "2020-01-01", accessibility: "reviewed",
      }],
    });
    const report = await runCycle("owner");
    expect(report.stale_flags.map(f => f.id)).toEqual(["asset-reviewed-publication"]);
    expect(report.steps.find(s => s.name === "scan corpus accessibility")?.detail).toContain("1 items scanned");
  });

  it("persists a scheduled cycle with UUID publication IDs without opening a profile bucket", async () => {
    const publicationId = "0b4b623f-ae8e-415c-be1b-865247a483cd";
    vi.spyOn(publications, "loadStaffContentSnapshot").mockResolvedValue({
      source: "postgres", requestedScope: "dsd", items: [{
        ...staffCorpus()[0], id: publicationId, title: "Published accessible meetings resource",
        reviewDate: "2020-01-01", accessibility: "pending",
        body: ["Pursuant to this rule, staff may request an accessible meeting."],
      }],
    });
    await setPolicy({ max_autonomy: "A3", flags: { "autonomy.a3_stale_flag": true } });

    const report = await runCycle("cron");
    expect(report.stale_flags.map(flag => flag.id)).toEqual([publicationId, publicationId]);
    expect(report.a11y.map(item => item.id)).toEqual([publicationId]);
    expect(report.steps.find(step => step.name === "flag stale content (reversible)")?.outcome).toBe("done");
    expect(report.exceptions.every(message => message.startsWith("DHS organizational reference:"))).toBe(true);
    expect(await getStore().get("decision", `cycle:${report.id}`)).toEqual(report);
    for (const flag of report.stale_flags) {
      expect(await getStore().get("decision", `stale_flag:${publicationId}:${flag.problem}`)).toMatchObject({ id: publicationId });
    }
    expect(() => assertIdempotencyReceiptPersistence(
      "decision", `stale_flag:${publicationId}:past_review_date`, `idem-${testTraceId("uuid-publication-replay")}`,
    )).not.toThrow();
    expect(() => assertIdempotencyReceiptPersistence(
      "decision", "stale_flag:arbitrary-resource:past_review_date", `idem-${testTraceId("invalid-publication-replay")}`,
    )).toThrow(WorkObjectContractError);

    const invalid = { ...report, a11y: [{ ...report.a11y[0], id: "arbitrary-resource" }] };
    expect(() => assertWorkObjectPersistence("decision", `cycle:${report.id}`, invalid))
      .toThrow(WorkObjectContractError);
    expect(() => assertWorkObjectPersistence("decision", `cycle:${report.id}`, {
      ...report, employeeProfile: { belief_profile: "must not persist" },
    })).toThrow(ProhibitedProfileFieldError);
  });

  it("requires the stale writing flag even at full autonomy", async () => {
    const write = vi.fn(() => "written");
    await expect(runTool(context("librarian"), "resource.stale_flag_state", write)).rejects.toThrow("disabled");
    expect(write).not.toHaveBeenCalled();
    await setPolicy({ flags: { "autonomy.a3_stale_flag": true } });
    await expect(runTool(context("librarian"), "resource.stale_flag_state", write)).resolves.toBe("written");
  });

  it("enforces agent feature flags and environment scope", async () => {
    const work = vi.fn(() => []);
    await expect(runTool(context("content_sentinel"), "resource.stale_detect", work)).rejects.toThrow("flag is off");
    await setPolicy({ flags: { "agent.content_sentinel": true } });
    await expect(runTool(context("content_sentinel"), "resource.stale_detect", work)).resolves.toEqual([]);
    vi.stubEnv("VERCEL_ENV", "production");
    await expect(runTool(context("content_sentinel"), "resource.stale_detect", work)).rejects.toThrow("environment outside");
  });

  it("enforces the registered role scope", async () => {
    await expect(runTool({ ...context("librarian"), role: "staff" }, "corpus.search", () => [])).rejects.toThrow("role outside");
  });

  function mockSummary(after?: () => Promise<unknown>) {
    vi.spyOn(providers, "resolveBinding").mockReturnValue({
      model: getModel("mdl_claude_staff_primary")!, generative: true, reason: "test only",
      adapter: {
        id: "anthropic", generative: true, health: async () => ({ ok: true, latency_ms: 0 }),
        complete: async () => {
          await after?.();
          return { model_id: "mdl_claude_staff_primary", parsed: {
            summary: "The review is ready.", proposals: [{ title: "Review the guidance", rationale: "Its review is due." }],
          } };
        },
      },
    });
  }

  it("keeps generated proposals from bypassing A5", async () => {
    await setPolicy({ max_autonomy: "A2" });
    mockSummary();
    const report = await runCycle("owner");
    expect(report.generative).toBe(true);
    expect(report.proposals).toEqual([]);
    expect(await listProposals()).toEqual([]);
    expect(report.steps.find(s => s.name === "write generated proposals")?.outcome).toBe("denied");
  });

  it("admits generated proposals at A5 without applying them", async () => {
    mockSummary();
    const report = await runCycle("owner");
    expect(report.proposals.some(p => p.kind === "other")).toBe(true);
    expect(report.proposals.every(p => p.status === "proposed")).toBe(true);
    const events = await getStore().listAudit();
    expect(events.some(e => e.tool_name === "proposal.write" && e.ok)).toBe(true);
  });

  it("rechecks stop after a provider returns before saving generated proposals", async () => {
    mockSummary(() => setPolicy({ killed: true }));
    const report = await runCycle("owner");
    expect(report.proposals.some(p => p.title === "Review the guidance")).toBe(false);
    expect(report.steps.find(s => s.name === "write generated proposals")?.outcome).toBe("denied");
  });

  it("does not call a held model active merely because its key and flag exist", async () => {
    vi.stubEnv("OPENAI_API_KEY", "synthetic-test-only");
    await setPolicy({ flags: { "model.generative_pilot": true } });
    const model = getModel("mdl_openai_staff_primary")!;
    const previous = model.approval_state;
    try {
      model.approval_state = "candidate";
      expect(providers.generativeStatus()).toEqual({ pilotFlag: true, credential: true, active: false });
    } finally { model.approval_state = previous; }
  });
});
