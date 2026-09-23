import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GRADUATION_PATHS, ROUTING_SIGNALS, getPath, type GraduationPath } from "@/lib/content/paths";
import { pathRecommend, selfCheck, type ArtifactValues } from "@/lib/intelligence/agents/graduation";
import { getEditableSurfaceDefinition, graduationPathSurfaceId } from "@/lib/content/staff-surface-registry";
import { askConcierge } from "@/lib/intelligence/agents/ask";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { testTraceId } from "./helpers/opaque-identifiers";
import { ANALYSIS_KINDS, KIND_LABEL, stepsFor, missingRequired } from "@/lib/equity-analysis/model";
import { EquityAnalysisInputSchema } from "@/lib/equity-analysis/schema";
import { saveEquityAnalysis } from "@/lib/equity-analysis/records";
import { buildDashboard } from "@/lib/equity-analysis/rollups";
import { loadPublishedEditableSurface } from "@/lib/content/editable-surfaces";

beforeEach(() => { resetStoreForTests(); invalidatePolicyCache(); vi.stubEnv("PAC_GENERATIVE_PILOT", "off"); });
afterEach(() => vi.unstubAllEnvs());

function completedArtifact(path: GraduationPath): ArtifactValues {
  const values: ArtifactValues = {};
  for (const field of path.artifactFields) {
    values[field.id] = field.type === "list"
      ? ["Offer a written way to respond: communications lead.", "Add the interpreter line to the notice: program manager."]
      : field.type === "date" ? "2099-09-07"
        : "Documented accessible practice for this specific decision and the people it affects.";
  }
  return values;
}

async function suggestedPath(question: string) {
  const result = await askConcierge({ question, researchMode: "program_only" }, { trace_id: testTraceId("stage-one-" + question.slice(0, 24)), agent: getAgent("ask_concierge"), role: "staff", dry_run: false });
  return result.kind === "answer" ? result.answer.pathSuggestion?.id ?? null : null;
}

describe("stage one: Equity Pause and the three-pass material check are practice paths", () => {
  it("adds gp-12 and gp-13 with the shared path contract", () => {
    expect(GRADUATION_PATHS).toHaveLength(13);
    for (const id of ["gp-12", "gp-13"] as const) {
      const path = getPath(id)!;
      expect(path).toBeDefined();
      expect(path.steps.map(step => step.key)).toEqual(["ask", "ci", "resources", "artifact", "selfcheck", "consult"]);
      expect(path.artifactFields.some(field => field.rubric === "specific_work")).toBe(true);
      expect(path.artifactFields.some(field => field.rubric === "access")).toBe(true);
      expect(path.rubric.some(rule => rule.key === "no_named_parties")).toBe(true);
      expect(getEditableSurfaceDefinition(graduationPathSurfaceId(id))).toBeDefined();
      const check = selfCheck(path, completedArtifact(path));
      expect(check.passed).toBe(true);
    }
  });

  it("serves both paths from their approved code values until a database publication exists", async () => {
    const emptyStore = { readPublished: async () => undefined };
    for (const id of ["gp-12", "gp-13"]) {
      const published = await loadPublishedEditableSurface(graduationPathSurfaceId(id), { source: "postgres", scope: "one-dhs", store: emptyStore });
      expect(published?.source, id).toBe("static");
    }
    expect(await loadPublishedEditableSurface(graduationPathSurfaceId("gp-11"), { source: "postgres", scope: "one-dhs", store: emptyStore })).toBeUndefined();
  });

  it("keeps the pause honest: an empty pause fails on the specific decision, access, and next step", () => {
    const path = getPath("gp-12")!;
    const check = selfCheck(path, {});
    expect(check.passed).toBe(false);
    const failed = check.results.filter(r => !r.ok).map(r => r.key);
    expect(failed).toEqual(expect.arrayContaining(["specific_work", "access", "owners", "review_date"]));
  });

  it("routes the pause to the toolkit when reach grows, and the material check to a colleague review", () => {
    const pause = getPath("gp-12")!;
    expect(pause.steps.find(step => step.key === "selfcheck")!.links.map(link => link.href)).toContain("/practice/gp-7");
    expect(pause.steps.find(step => step.key === "resources")!.links.map(link => link.href)).toContain("/equity-policy/analysis?kind=pause");
    const material = getPath("gp-13")!;
    expect(material.steps.find(step => step.key === "consult")!.links.map(link => link.href)).toContain("/practice/gp-9");
  });

  it("adds Guided Start signals for both paths", () => {
    expect(ROUTING_SIGNALS.find(signal => signal.id === "pause")?.route).toEqual({ kind: "path", id: "gp-12" });
    expect(ROUTING_SIGNALS.find(signal => signal.id === "material")?.route).toEqual({ kind: "path", id: "gp-13" });
    expect(pathRecommend(["pause"]).map(item => item.path?.id)).toContain("gp-12");
    expect(pathRecommend(["material"]).map(item => item.path?.id)).toContain("gp-13");
  });

  it("ASK suggests the new paths for their own starters and leaves the existing paths' starters alone", async () => {
    for (const starter of getPath("gp-12")!.askStarters) expect(await suggestedPath(starter), starter).toBe("gp-12");
    for (const starter of getPath("gp-13")!.askStarters) expect(await suggestedPath(starter), starter).toBe("gp-13");
    expect(await suggestedPath(getPath("gp-9")!.askStarters[0])).toBe("gp-9");
    expect(await suggestedPath(getPath("gp-7")!.askStarters[0])).toBe("gp-7");
  }, 60_000);
});

describe("stage one: the register accepts an Equity Pause", () => {
  const pause = () => ({
    submissionId: randomUUID(),
    programScope: "one-dhs" as const,
    kind: "pause" as const,
    workTitle: "Move the monthly all-staff meeting to 8:00 a.m.",
    workType: "other" as const,
    administration: "Aging and Disability Services" as const,
    approvalDate: "2026-10-01",
    disposition: "revise" as const,
    answers: {
      action: "Start the all-staff meeting an hour earlier so field staff can attend before visits.",
      affected_groups: "Staff with caregiving responsibilities in the morning, staff who rely on paratransit, staff who observe early prayer.",
      benefits: "Field staff can attend before the day's visits.",
      burdens: "Staff with morning care or transit constraints lose the option to attend live.",
      design_change: "Record the meeting, post notes the same day, and rotate the time each quarter.",
      rationale: "The change goes ahead with the recording and rotation in place.",
    },
    consent: true as const,
    sourceRoute: "/equity-policy/analysis" as const,
  });

  it("registers the pause as a third form with four short sections", () => {
    expect(ANALYSIS_KINDS).toContain("pause");
    expect(KIND_LABEL.pause).toBe("Equity Pause");
    expect(stepsFor("pause").map(step => step.id)).toEqual(["frame", "results", "burdens", "disposition"]);
    expect(stepsFor("pause").filter(step => step.id !== "frame").flatMap(step => missingRequired("pause", { ...pause().answers, disposition: "revise" }, step))).toEqual([]);
  });

  it("validates, saves, and counts a pause without asking for the full toolkit answers", async () => {
    expect(EquityAnalysisInputSchema.safeParse(pause()).success).toBe(true);
    const record = await saveEquityAnalysis(pause());
    expect(record.kind).toBe("pause");
    await expect(saveEquityAnalysis({ ...pause(), answers: { ...pause().answers, design_change: "" } })).rejects.toThrow(/required answers/i);
    const dashboard = buildDashboard([record], [], [], new Date().toISOString());
    expect(dashboard.allTime).toEqual({ full: 0, scan: 0, pause: 1, total: 1 });
    expect(dashboard.latest.pause).toBe(1);
  });
});
