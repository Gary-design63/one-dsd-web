import { beforeAll, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import ownerContentApproval from "@/evidence/local-audit-2026-09-07/owner-content-approval.json";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { CASES, runCases } from "@/lib/intelligence/eval/runner";
import { buildTestConsultationRecord } from "@/tests/helpers/consultation-record";
import { testTraceId } from "@/tests/helpers/opaque-identifiers";

describe("must-pass evaluation suites (ASK, CI, CIQ, GP, mindset a-c)", () => {
  beforeAll(() => {
    resetStoreForTests();
  });

  it("keeps the recorded image approval attached to the reviewed asset", () => {
    const currentHash = createHash("sha256").update(readFileSync(path.resolve(process.cwd(), ownerContentApproval.asset.path))).digest("hex");
    expect(currentHash).toBe(ownerContentApproval.asset.sha256);
  });

  it("registers every contract case id", () => {
    const ids = CASES.map((c) => c.id);
    for (let i = 1; i <= 10; i++) expect(ids).toContain(`ASK-E${i}`);
    for (let i = 1; i <= 8; i++) expect(ids).toContain(`CI-E${i}`);
    for (let i = 1; i <= 10; i++) expect(ids).toContain(`CIQ-E${i}`);
    for (let i = 1; i <= 10; i++) expect(ids).toContain(`GP-E${i}`);
  });

  it("passes the automated checks and includes the recorded owner content approval", async () => {
    const report = await runCases();
    const failures = report.results.filter((r) => r.status === "fail");
    expect(failures.map((f) => `${f.id}: ${f.detail}`)).toEqual([]);
    expect(report.manual).toBe(0);
    expect(report.releaseBlocked).toBe(false);
    expect(report.results.find((result) => result.id === "CI-E7")?.detail).toContain("recorded owner approval");
    expect(report.pass).toBe(CASES.length - report.manual);
  }, 60_000);

  it("keeps sample evaluation records out of the active workspace", async () => {
    resetStoreForTests();
    const activeStore = getStore();
    const existing = buildTestConsultationRecord({ sequence: 9401 });
    const existingDecision = {
      id: "asset-real-workspace-resource",
      title: "Real workspace resource",
      owner: "Program steward",
      reviewDate: "2027-09-01",
      problem: "review_due_soon",
      cycle_id: `cycle-${testTraceId("must-pass-real-workspace")}`,
      flagged_at: "2026-09-05T00:00:00.000Z",
      disposition: "pending",
    };
    const existingDecisionKey = `stale_flag:${existingDecision.id}:${existingDecision.problem}`;
    await activeStore.put("consult_request", existing.request_id, existing);
    await activeStore.put("decision", existingDecisionKey, existingDecision);

    const report = await runCases(["ciq_mvp"]);

    expect(await activeStore.list("consult_request")).toEqual([existing]);
    expect(await activeStore.list("decision")).toEqual([existingDecision]);
    expect(await activeStore.listAudit()).toEqual([]);
    expect(await activeStore.get("eval_result", report.id)).toEqual(report);
  }, 60_000);
});
