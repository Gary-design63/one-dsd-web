import { beforeEach, describe, expect, it } from "vitest";
import { PracticeOrchestratorBodySchema } from "@/app/api/consultant/orchestrator/handlers";
import { ONE_DSD_TEAM_SEED } from "@/lib/collaboration/seed";
import { surveillanceRefuse } from "@/lib/intelligence/safety";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache, setPolicy } from "@/lib/intelligence/policy";
import {
  ProhibitedProfileFieldError,
  assertNoProhibitedProfileFields,
  mayEnterUnauthenticatedProjection,
} from "@/lib/trust/data-classification";
import {
  WorkObjectContractError,
  assertAuditEventPersistence,
  assertIdempotencyReceiptPersistence,
  assertWorkObjectPersistence,
} from "@/lib/trust/work-object-contract";
import {
  collaborationScalarObjectAttacks,
  completeCollaborationWorkspace,
} from "./no-surveillance-fixtures";
import {
  buildTestConsultationRecord,
  buildTestConsultationTombstone,
  withConsultationStatus,
} from "./helpers/consultation-record";
import { testSpanId, testTraceId } from "./helpers/opaque-identifiers";

describe("no-surveillance architecture", () => {
  beforeEach(() => {
    resetStoreForTests();
    invalidatePolicyCache();
  });

  it.each([
    "equity_score",
    "equityScore",
    "DEIScore",
    "employee ideology",
    "supervisor-participation-dashboard",
    "racialBiasScore",
    "participationByEmployee",
    "politicalBeliefs",
    "staffInclusionRanking",
    "equityReadinessRating",
    "predictedProtectedClass",
    "engagement-per-staff",
    "beliefs_by_worker",
    "ideology_by_employee",
    "learning_progress_by_employee",
    "completion_by_staff",
    "employee_equity_readiness",
    "worker_inclusion_maturity_score",
    "beliefs_by_supervisor",
    "participation_per_supervisor",
    "training_completion_by_employee",
    "inclusion_maturity_rating",
    "dei_readiness_score",
    "employee_bias_score",
  ])("rejects prohibited profile key form %s", (field) => {
    expect(() => assertNoProhibitedProfileFields({ nested: { [field]: "private-value-must-not-leak" } }))
      .toThrow(ProhibitedProfileFieldError);
    try {
      assertNoProhibitedProfileFields({ [field]: "private-value-must-not-leak" });
    } catch (error) {
      expect(String(error)).not.toContain("private-value-must-not-leak");
    }
  });

  it("preserves ordinary content and evaluation scores that do not describe people", () => {
    expect(() => assertNoProhibitedProfileFields({
      results: [{ score: 0.92, qualityScore: 4, detail: "Content quality evaluation" }],
      knowledgeNode: { trust_score: 0.8, sourceAuthorityRating: "primary" },
      accessibilityReview: { contrastScore: 1 },
    })).not.toThrow();
  });

  it("requires both safe classification and an explicit reasoned exposure decision", () => {
    expect(mayEnterUnauthenticatedProjection("S1", {
      unauthenticatedExposurePermitted: false,
      exposureReason: "Reviewed but held.",
    })).toBe(false);
    expect(mayEnterUnauthenticatedProjection("S1", {
      unauthenticatedExposurePermitted: true,
      exposureReason: "  ",
    })).toBe(false);
    expect(mayEnterUnauthenticatedProjection("S2", {
      unauthenticatedExposurePermitted: true,
      exposureReason: "A decision cannot lower a protected class.",
    })).toBe(false);
    expect(mayEnterUnauthenticatedProjection("S1", {
      unauthenticatedExposurePermitted: true,
      exposureReason: "Reviewed for staff-facing access without sign-in.",
    })).toBe(true);
  });

  it("accepts only finite registered orchestrator flag keys at request and policy boundaries", async () => {
    expect(PracticeOrchestratorBodySchema.safeParse({
      action: "flag",
      key: "model.generative_pilot",
      value: true,
    }).success).toBe(true);
    expect(PracticeOrchestratorBodySchema.safeParse({
      action: "flag",
      key: "surface.supervisor_employee_rankings",
      value: true,
    }).success).toBe(false);
    await expect(setPolicy({
      flags: { "surface.supervisor_employee_rankings": true } as never,
    })).rejects.toMatchObject({ code: "unknown_flag_key" });
  });

  it("blocks prohibited fields at the generic work-object persistence boundary", async () => {
    await expect(
      getStore().put("decision", "unsafe-profile", {
        kind: "proposal",
        employeeProfile: { belief_profile: "should never be stored" },
      }),
    ).rejects.toBeInstanceOf(ProhibitedProfileFieldError);
    await expect(getStore().get("decision", "unsafe-profile")).resolves.toBeNull();
  });

  it("purpose-limits generic decision, evaluation, and collaboration storage", async () => {
    expect(() => assertWorkObjectPersistence("consult_request", "CR-20260905-9999", {
      request_id: "CR-20260905-9999",
      beliefs_by_worker: { worker_17: "synthetic" },
    })).toThrow(ProhibitedProfileFieldError);

    expect(() => assertWorkObjectPersistence("decision", "anonymous-decision", {
      id: "anonymous-decision",
      title: "An unregistered generic bucket",
    })).toThrow(WorkObjectContractError);

    expect(() => assertWorkObjectPersistence("eval_result", "eval-arbitrary", {
      id: "eval-arbitrary",
      at: new Date().toISOString(),
      employee: "worker-17",
      result: "engaged",
    })).toThrow(WorkObjectContractError);

    const injectedWorkspace = structuredClone(ONE_DSD_TEAM_SEED) as typeof ONE_DSD_TEAM_SEED & {
      memberships: Array<Record<string, unknown>>;
    };
    injectedWorkspace.memberships[0].staffNotes = "Unapproved profile bucket";
    expect(() => assertWorkObjectPersistence(
      "collaboration_workspace",
      "one_dsd_team",
      injectedWorkspace,
    )).toThrow(WorkObjectContractError);

    await expect(getStore().put("decision", "anonymous-decision", {
      id: "anonymous-decision",
      title: "Not a registered decision family",
    })).rejects.toBeInstanceOf(WorkObjectContractError);
  });

  it("allows only opaque idempotency receipts for canonical work-object identities", () => {
    expect(() => assertIdempotencyReceiptPersistence(
      "consult_request",
      "CR-20260905-9912",
      `consult-submit-v2-${"a".repeat(64)}`,
    )).not.toThrow();
    expect(() => assertIdempotencyReceiptPersistence(
      "decision",
      `stale_flag:asset-${testTraceId("idempotency-resource")}:review_due_soon`,
      `idem-${testTraceId("idempotency-key")}`,
    )).not.toThrow();

    for (const [kind, objectId, key] of [
      ["decision", "worker-17-equity-readiness-low", `idem-${testTraceId("semantic-object")}`],
      ["decision", "autonomy_policy", "employee-17-equity-readiness-low"],
      ["consult_request", "CR-worker-17-equity-readiness-low", `idem-${testTraceId("bad-consult")}`],
    ] as const) {
      expect(() => assertIdempotencyReceiptPersistence(kind, objectId, key))
        .toThrow(WorkObjectContractError);
    }
  });

  it("preserves registered decision, evaluation, and collaboration object families", async () => {
    const staleDecision = {
      id: "asset-resource-1",
      title: "Resource one",
      owner: "Program steward",
      reviewDate: "2026-01-01",
      problem: "past_review_date",
      cycle_id: `cycle-${testTraceId("registered-stale-decision")}`,
      flagged_at: "2026-09-05T00:00:00.000Z",
      disposition: "pending",
    };
    await expect(getStore().put(
      "decision",
      "stale_flag:asset-resource-1:past_review_date",
      staleDecision,
    )).resolves.toMatchObject({ applied: true });

    const evalResult = {
      id: "eval-2026090501",
      at: "2026-09-05T00:00:00.000Z",
      suites: ["ask_mvp"],
      results: [{
        id: "ASK-E1",
        suite: "ask_mvp",
        scenario: "A source-aware answer",
        status: "pass",
        detail: "Grounded in a released source.",
        ms: 2,
      }],
      pass: 1,
      fail: 0,
      manual: 0,
      releaseBlocked: false,
    };
    await expect(getStore().put("eval_result", evalResult.id, evalResult))
      .resolves.toMatchObject({ applied: true });
    await expect(getStore().put(
      "collaboration_workspace",
      "one_dsd_team",
      structuredClone(ONE_DSD_TEAM_SEED),
    )).resolves.toMatchObject({ applied: true });
  });

  it("requires complete consultation status semantics, integer versions, and canonical retention instants", () => {
    const base = buildTestConsultationRecord({
      createdAt: "2026-09-05T00:00:00.000Z",
      sequence: 9911,
    });
    expect(() => assertWorkObjectPersistence("consult_request", base.request_id, base)).not.toThrow();

    const received = withConsultationStatus(base, "received", "2026-09-05T01:00:00.000Z");
    const underReview = withConsultationStatus(received, "under_review", "2026-09-05T02:00:00.000Z");
    const scheduled = withConsultationStatus(underReview, "scheduled", "2026-09-05T03:00:00.000Z");
    expect(() => assertWorkObjectPersistence("consult_request", scheduled.request_id, scheduled))
      .toThrow(WorkObjectContractError);
    scheduled.scheduled_for = "2026-09-10T14:00:00-05:00";
    expect(() => assertWorkObjectPersistence("consult_request", scheduled.request_id, scheduled)).not.toThrow();

    const declined = withConsultationStatus(base, "declined", "2026-09-05T01:00:00.000Z");
    declined.status_reason = "   ";
    expect(() => assertWorkObjectPersistence("consult_request", declined.request_id, declined))
      .toThrow(WorkObjectContractError);

    expect(() => assertWorkObjectPersistence("consult_request", base.request_id, {
      ...base,
      version: 1.5,
    })).toThrow(WorkObjectContractError);
    expect(() => assertWorkObjectPersistence("consult_request", base.request_id, {
      ...base,
      pinned_order: 1.5,
    })).toThrow(WorkObjectContractError);
    expect(() => assertWorkObjectPersistence("consult_request", base.request_id, {
      ...base,
      retention_expires_at: "9999",
    })).toThrow(WorkObjectContractError);

    const tombstone = buildTestConsultationTombstone(base, "2026-09-05T02:00:00.000Z");
    expect(() => assertWorkObjectPersistence("consult_request", base.request_id, {
      ...tombstone,
      redacted_at: { worker: "E17" },
    })).toThrow(WorkObjectContractError);
  });

  it("requires scalar values and valid references throughout every collaboration collection", () => {
    const complete = completeCollaborationWorkspace();
    expect(() => assertWorkObjectPersistence(
      "collaboration_workspace",
      "one_dsd_team",
      complete,
    )).not.toThrow();

    for (const attack of collaborationScalarObjectAttacks) {
      const injected = structuredClone(complete) as unknown as Record<string, unknown>;
      attack.mutate(injected);
      expect(
        () => assertWorkObjectPersistence("collaboration_workspace", "one_dsd_team", injected),
        attack.name,
      ).toThrow(WorkObjectContractError);
    }

    const brokenReference = structuredClone(complete);
    brokenReference.pollResponses[0].optionId = "not_an_option";
    expect(() => assertWorkObjectPersistence(
      "collaboration_workspace",
      "one_dsd_team",
      brokenReference,
    )).toThrow(WorkObjectContractError);
  });

  it("requires opaque identifiers and bounded metadata for research usage", () => {
    const id = "ru_20260905000000_abcdef_cdef";
    const valid = {
      id,
      at: "2026-09-05T00:00:00.000Z",
      provider: "fixture",
      model: "fixture/research-1",
      depth: "current_web",
      query_hash: "abcdef0123456789",
      domains: ["example.org"],
      estimated_usd: 0,
      input_tokens: 1,
      ok: true,
      latency_ms: 1,
      trace_id: testTraceId("research-usage-contract"),
      provider_trace_id: `pth_${"a".repeat(64)}`,
    };
    expect(() => assertWorkObjectPersistence("decision", `research_usage:${id}`, valid))
      .not.toThrow();

    for (const candidate of [
      { ...valid, trace_id: "worker-17-equity-readiness-low" },
      { ...valid, provider_trace_id: "worker-17-equity-readiness-low" },
      { ...valid, query_hash: "ABC123" },
      { ...valid, domains: ["https://example.org/private"] },
      { ...valid, model: "worker-17-equity-readiness-low" },
      { ...valid, input_tokens: 1.5 },
      { ...valid, latency_ms: -1 },
      { ...valid, ok: false },
      { ...valid, ok: false, error_code: "worker-17-equity-readiness-low" },
    ]) {
      expect(() => assertWorkObjectPersistence("decision", `research_usage:${id}`, candidate))
        .toThrow(WorkObjectContractError);
    }
  });

  it("bounds research policy caps and permits only canonical unique domain filters", () => {
    const validPolicy = {
      enabled: true,
      mode: "auto",
      provider_order: ["fixture"],
      daily_request_cap: 100_000,
      monthly_usd_cap: 100_000,
      allowed_domains: ["example.org"],
      recency: "any",
      deep_research_enabled: false,
    };
    expect(() => assertWorkObjectPersistence("decision", "research_policy", validPolicy))
      .not.toThrow();
    for (const candidate of [
      { ...validPolicy, daily_request_cap: -1 },
      { ...validPolicy, daily_request_cap: 1.5 },
      { ...validPolicy, daily_request_cap: 100_001 },
      { ...validPolicy, monthly_usd_cap: -0.01 },
      { ...validPolicy, monthly_usd_cap: 100_001 },
      { ...validPolicy, allowed_domains: ["employee-17-equity-readiness-low"] },
      { ...validPolicy, allowed_domains: ["example.org", "example.org"] },
    ]) {
      expect(() => assertWorkObjectPersistence("decision", "research_policy", candidate))
        .toThrow(WorkObjectContractError);
    }
  });

  it("does not permit audit logs to become a surveillance side channel", async () => {
    await expect(getStore().appendAudit({
      trace_id: testTraceId("unsafe-audit-object"),
      span_id: testSpanId("unsafe-audit-object"),
      at: "2026-09-05T00:00:00.000Z",
      agent_id: "system",
      agent_version: "0.1.0",
      tool_name: "corpus.search",
      autonomy_level_used: "A0",
      permission_mode: "owner_only",
      dry_run: false,
      content_ids_touched: [],
      allowlist_hit: true,
      ok: true,
      nested: { participationByEmployee: { employee_17: true } },
    } as never)).rejects.toBeInstanceOf(ProhibitedProfileFieldError);
    await expect(getStore().listAudit()).resolves.toEqual([]);

    await expect(getStore().appendAudit({
      trace_id: testTraceId("unsafe-audit-array"),
      span_id: testSpanId("unsafe-audit-array"),
      at: "2026-09-05T00:00:00.000Z",
      agent_id: "system",
      agent_version: "0.1.0",
      tool_name: "corpus.search",
      autonomy_level_used: "A0",
      permission_mode: "owner_only",
      dry_run: false,
      content_ids_touched: [{ worker: "E17", participated: true }],
      allowlist_hit: true,
      ok: true,
    } as never)).rejects.toBeInstanceOf(WorkObjectContractError);
  });

  it("allows only registered audit tools, canonical content references, and finite error codes", () => {
    const validAudit = {
      trace_id: testTraceId("no-surveillance-audit"),
      span_id: testSpanId("no-surveillance-audit"),
      at: "2026-09-05T00:00:00.000Z",
      agent_id: "system",
      agent_version: "0.1.0",
      tool_name: "corpus.search",
      autonomy_level_used: "A0",
      permission_mode: "always",
      dry_run: false,
      content_ids_touched: ["pn-partnership-spine"],
      allowlist_hit: true,
      ok: true,
      latency_ms: 1,
    };
    expect(() => assertAuditEventPersistence(validAudit)).not.toThrow();
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      model_id: "fixture/research-1",
    })).not.toThrow();
    for (const model_id of ["/research-1", "fixture/", "fixture//research-1", "a".repeat(81)]) {
      expect(() => assertAuditEventPersistence({ ...validAudit, model_id }))
        .toThrow(WorkObjectContractError);
    }
    expect(() => assertAuditEventPersistence({ ...validAudit, tool_name: "test.audit" }))
      .toThrow(WorkObjectContractError);
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      tool_name: "runtime.unknown_tool_refusal",
      allowlist_hit: false,
      allowlist_miss_reason: "tool not registered",
      ok: false,
      error_code: "tool_unknown",
    })).not.toThrow();
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      trace_id: "worker-17-equity-readiness-low",
    })).toThrow(WorkObjectContractError);
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      span_id: "worker17",
    })).toThrow(WorkObjectContractError);
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      agent_version: "worker-17-equity-readiness-low",
    })).toThrow(WorkObjectContractError);
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      content_ids_touched: ["worker-17:equity-readiness:low"],
    })).toThrow(WorkObjectContractError);
    for (const semanticId of [
      "staff-jane-doe-equity-readiness-low",
      "supervisor-a-inclusion-rating-low",
    ]) {
      expect(() => assertAuditEventPersistence({
        ...validAudit,
        content_ids_touched: [semanticId],
      })).toThrow(WorkObjectContractError);
    }
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      ok: false,
      error_code: "worker-17 believes synthetic",
    })).toThrow(WorkObjectContractError);
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      ok: false,
      error_code: "tool_execution_failed",
    })).not.toThrow();
    const sneakyDisposition = Object.create({
      toString: () => "approve",
    }) as unknown;
    expect(() => assertAuditEventPersistence({
      ...validAudit,
      human_disposition: sneakyDisposition,
    })).toThrow(WorkObjectContractError);
  });

  it("refuses people-ranking requests without claiming that participation telemetry exists", () => {
    const result = surveillanceRefuse("Rank my unit's staff by equity maturity and participation.");
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/does not score or rank people/i);
    expect(result.message).toMatch(/private learning activity is not reported to supervisors/i);
    expect(result.message).not.toMatch(/combined participation totals|evaluation looks/i);
  });

  it.each([
    "Order every employee from most to least inclusive.",
    "Assign each employee an inclusion tier.",
    "Chart each worker's course-completion behavior for their supervisor.",
    "Evaluate each staff member's inclusion maturity.",
    "Sort employees by equity readiness.",
    "Sequence every employee from most to least inclusive.",
    "Band each worker by inclusion maturity.",
    "Group each staff member by equity readiness.",
    "Place every employee into an inclusion category.",
    "Map each worker according to course completion for their supervisor.",
    "Determine which employees are furthest along in equity learning.",
    "Identify the least culturally capable staff members.",
    "Create a heat map of inclusion readiness by employee.",
    "Summarize each employee’s DEI engagement for managers.",
    "Develop an employee-by-employee inclusion readiness matrix for supervisors.",
    "Produce staff-level equity readiness reports for management.",
    "Build a participation dashboard for every worker.",
    "Stratify employees according to cultural competency.",
    "Cluster personnel on the basis of DEI readiness.",
    "Create quartiles of workers based on inclusion maturity.",
    "Give managers a roster showing each employee’s learning progress.",
    "Build an equity-readiness index for each member of staff.",
    "Make a heatmap of DEI participation per worker.",
    "Provide supervisors with an employee participation dashboard.",
  ])("refuses a person-level surveillance phrasing: %s", (request) => {
    expect(surveillanceRefuse(request).ok).toBe(false);
  });

  it("allows aggregate program evaluation while refusing direct-store surveillance text", async () => {
    expect(surveillanceRefuse(
      "Evaluate the employee inclusion program's overall reach and accessibility.",
    ).ok).toBe(true);

    const workspace = completeCollaborationWorkspace();
    workspace.posts[0].body = "Produce staff-level equity readiness reports for management.";
    await expect(getStore().put("collaboration_workspace", "one_dsd_team", workspace))
      .rejects.toBeInstanceOf(WorkObjectContractError);

    const consultation = buildTestConsultationRecord({ sequence: 9913 });
    consultation.work_name = "Rank staff by equity maturity";
    consultation.packet.snapshot["Work name"] = consultation.work_name;
    await expect(getStore().put("consult_request", consultation.request_id, consultation))
      .rejects.toBeInstanceOf(WorkObjectContractError);
  });
});
