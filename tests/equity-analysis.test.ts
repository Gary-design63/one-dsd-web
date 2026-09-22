import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const owner = vi.hoisted(() => ({ allowed: true }));
vi.mock("@/lib/auth/request", () => ({
  ownerFromCookies: async () => owner.allowed,
  ownerFromRequest: async () => owner.allowed,
}));

import { EquityAnalysisInputSchema, EquityAnalysisRecordSchema } from "@/lib/equity-analysis/schema";
import { getEquityAnalysis, listEquityAnalyses, loadEquityWorkspace, saveEquityAnalysis, saveFollowUpEvent, saveSurveyWaveEvent } from "@/lib/equity-analysis/records";
import { buildDashboard, changeHistory, currentSurveyWaves } from "@/lib/equity-analysis/rollups";
import { analysesToCsv, followUpToIcs } from "@/lib/equity-analysis/export";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { POST as postAnalysis } from "@/app/api/equity-analysis/route";
import { POST as postFollowUp } from "@/app/api/equity-analysis/follow-ups/route";
import { POST as postSurvey } from "@/app/api/equity-analysis/survey-waves/route";

const scan = () => ({
  submissionId: randomUUID(),
  programScope: "one-dhs" as const,
  kind: "scan" as const,
  workTitle: "Move county visit requests from phone to an online form",
  workType: "service" as const,
  administration: "Health Care" as const,
  approvalDate: "2026-10-15",
  disposition: "revise" as const,
  answers: {
    action: "Move visit requests online and cut phone wait by a third within a year.",
    affected_groups: "Households with limited English, people who use screen readers, greater Minnesota households without reliable internet.",
    data_shows: "Phone requests are most of the contacts from households with limited English.",
    benefits: "Faster scheduling for households already comfortable online.",
    burdens: "Households that rely on the phone lose the channel they use.",
    design_change: "Keep a staffed phone line and an in-person path.",
    impact_owner: "Program manager, county access",
    impact_date: "2026-12-01",
    outcome_owner: "Director, eligibility operations",
    outcome_date: "2027-04-01",
    communication: "Communications lead, November, to counties and community partners.",
    rationale: "The phone line must be funded before launch.",
  },
  consent: true as const,
  sourceRoute: "/equity-policy/analysis" as const,
});

const request = (path: string, body: unknown, origin = "http://localhost:3000") =>
  new NextRequest(`http://localhost:3000${path}`, { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });

beforeEach(() => { resetStoreForTests(); owner.allowed = true; });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

it("does not list stored analyses without owner authorization", async () => {
  await saveEquityAnalysis(scan());
  owner.allowed = false;
  expect(await listEquityAnalyses()).toEqual([]);
  expect((await loadEquityWorkspace()).analyses).toEqual([]);
});

it("accepts only registered answers, the sharing choice, and calendar dates", () => {
  expect(EquityAnalysisInputSchema.safeParse(scan()).success).toBe(true);
  expect(EquityAnalysisInputSchema.safeParse({ ...scan(), consent: false }).success).toBe(false);
  expect(EquityAnalysisInputSchema.safeParse({ ...scan(), answers: { ...scan().answers, employeeId: "12345" } }).success).toBe(false);
  expect(EquityAnalysisInputSchema.safeParse({ ...scan(), answers: { ...scan().answers, impact_date: "2026-02-30" } }).success).toBe(false);
  expect(EquityAnalysisInputSchema.safeParse({ ...scan(), administration: "Somewhere else" }).success).toBe(false);
});

it("records an analysis once and returns the same record on retry", async () => {
  const input = scan();
  const first = await saveEquityAnalysis(input);
  const retry = await saveEquityAnalysis({ ...input, workTitle: "A changed retry should not overwrite the first record" });
  expect(retry).toEqual(first);
  expect(EquityAnalysisRecordSchema.safeParse(first).success).toBe(true);
  expect(await listEquityAnalyses()).toEqual([first]);
  expect(await getEquityAnalysis(first.id)).toEqual(first);
});

it("rejects a full analysis that skips its own steps", async () => {
  await expect(saveEquityAnalysis({ ...scan(), kind: "full" })).rejects.toThrow(/required answers/i);
});

it("refuses every staff analysis write, including same-origin posts", async () => {
  expect((await postAnalysis(request("/api/equity-analysis", scan(), "https://other.example"))).status).toBe(403);
  expect((await postAnalysis(request("/api/equity-analysis", scan()))).status).toBe(403);
  expect((await postAnalysis(request("/api/equity-analysis", { ...scan(), workTitle: "Case ID 123456 needs a new worker" }))).status).toBe(403);
  expect(await listEquityAnalyses()).toEqual([]);
});

it("derives follow-ups from promised dates and keeps every change reversible", async () => {
  const record = await saveEquityAnalysis(scan());
  const now = "2026-11-15T12:00:00.000Z";
  let workspace = await loadEquityWorkspace(now);
  expect(workspace.followUps.map((f) => [f.key, f.status])).toEqual([["approval", "overdue"], ["impact", "soon"], ["outcome", "later"]]);

  const done = await saveFollowUpEvent({ eventId: randomUUID(), analysisId: record.id, followUp: "approval", done: true });
  workspace = await loadEquityWorkspace(now);
  expect(workspace.followUps.find((f) => f.key === "approval")?.status).toBe("done");
  expect(workspace.history[0].summary).toContain("Approval or launch");

  await saveFollowUpEvent({ eventId: randomUUID(), analysisId: record.id, followUp: "approval", done: false, reverts: done.id });
  workspace = await loadEquityWorkspace(now);
  expect(workspace.followUps.find((f) => f.key === "approval")?.status).toBe("overdue");
  expect(workspace.history.find((h) => h.id === done.id)?.revertedBy).toMatch(/^equity-followup-/);

  await expect(saveFollowUpEvent({ eventId: randomUUID(), analysisId: "equity-analysis-" + randomUUID(), followUp: "impact", done: true })).rejects.toThrow(/not on the record/i);
});

it("keeps survey waves as append-only events with the latest one current", async () => {
  const values = { fielded: "2026-10", respondents: 2500, responseRate: 0.6, belonging: 70, inclusion: 68, engagement: 71 };
  const added = await saveSurveyWaveEvent({ eventId: randomUUID(), wave: "2026", action: "set", values });
  await saveSurveyWaveEvent({ eventId: randomUUID(), wave: "2026", action: "set", values: { ...values, belonging: 75 } });
  let workspace = await loadEquityWorkspace();
  expect(currentSurveyWaves(workspace.surveyEvents)).toEqual([{ wave: "2026", ...values, belonging: 75 }]);
  expect(workspace.history[0].summary).toBe("Survey wave 2026 updated: belonging 70 to 75");

  await saveSurveyWaveEvent({ eventId: randomUUID(), wave: "2026", action: "remove" });
  workspace = await loadEquityWorkspace();
  expect(workspace.waves).toEqual([]);
  expect(changeHistory([], [], workspace.surveyEvents)[0].summary).toBe("Survey wave 2026 removed");

  await saveSurveyWaveEvent({ eventId: randomUUID(), wave: "2026", action: "set", values, reverts: added.id });
  workspace = await loadEquityWorkspace();
  expect(workspace.waves).toEqual([{ wave: "2026", ...values }]);
  await expect(saveSurveyWaveEvent({ eventId: randomUUID(), wave: "2026", action: "remove", values })).rejects.toThrow();
});

it("refuses staff register writes from every origin", async () => {
  const record = await saveEquityAnalysis(scan());
  const event = { eventId: randomUUID(), analysisId: record.id, followUp: "impact", done: true };
  expect((await postFollowUp(request("/api/equity-analysis/follow-ups", event, "https://other.example"))).status).toBe(403);
  expect((await postFollowUp(request("/api/equity-analysis/follow-ups", event))).status).toBe(403);
  expect((await postSurvey(request("/api/equity-analysis/survey-waves", { eventId: randomUUID(), wave: "2026", action: "set", values: { fielded: "2026-10", respondents: 10, responseRate: 0.5, belonging: 60, inclusion: 61, engagement: 62 } }))).status).toBe(403);
});

it("computes program-level counts without any per-person measure", async () => {
  await saveEquityAnalysis(scan());
  await saveEquityAnalysis({ ...scan(), kind: "full", administration: "Operations", disposition: "approve", answers: { ...scan().answers, heard_from: "County partners and community organizations, in two listening sessions.", still_missing: "Households without internet.", tribal_consultation: "not_applicable", impact_statement: "Six sentences that only this proposal could wear. Two. Three. Four. Five. Six.", equity_director: "consulted", policy_alignment: "Matches the equity policy's lens on actions.", funded: "yes", staffed: "partial", data_capacity: "yes" } });
  const workspace = await loadEquityWorkspace();
  const dashboard = buildDashboard(workspace.analyses, workspace.followUpEvents, workspace.waves, workspace.now);
  expect(dashboard.allTime).toEqual({ full: 1, scan: 1, pause: 0, total: 2 });
  expect(dashboard.byAdministration.map((a) => a.administration).sort()).toEqual(["Health Care", "Operations"]);
  expect(dashboard.dispositions.find((d) => d.id === "revise")?.count).toBe(1);
  expect(JSON.stringify(dashboard)).not.toMatch(/employee|worker|personnel/i);
  const csv = analysesToCsv(workspace.analyses);
  expect(csv.split("\r\n")[0]).toContain("Administration");
  expect(csv).toContain("Health Care");
  const ics = followUpToIcs(workspace.followUps[0], "https://example.org/equity-policy/analysis/x");
  expect(ics).toContain("BEGIN:VEVENT");
});

it("blocks unregistered decision records that imitate the family", async () => {
  await expect(getStore().put("decision", "equity_analysis:not-a-real-id", { anything: true })).rejects.toThrow();
  await expect(getStore().put("decision", "equity_survey:equity-survey-" + randomUUID(), { schemaVersion: 1, recordType: "equity_survey_wave", id: "x", createdAt: new Date().toISOString(), wave: "2026", action: "set", values: { fielded: "2026-10", respondents: 1, responseRate: 0.5, belonging: 1, inclusion: 1, engagement: 1 }, participationByEmployee: {} })).rejects.toThrow();
});
