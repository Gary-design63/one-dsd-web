import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { askConcierge, toStaffAskResult } from "@/lib/intelligence/agents/ask";
import { getLearningJourneyContext, isLearningNavigationQuestion, isProgramTrainingCreditQuestion } from "@/lib/intelligence/learning-guidance";
import * as programResources from "@/lib/intelligence/retrieval/program-resources";
import * as staffSearch from "@/lib/intelligence/retrieval/staff-search";
import type { Doc } from "@/lib/intelligence/retrieval/search";
import * as providers from "@/lib/intelligence/providers";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { getModel } from "@/lib/intelligence/registry/models";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { createAskResponseRecord, validateAskRecord } from "@/lib/intelligence/observability/ask-records";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import { testTraceId } from "./helpers/opaque-identifiers";

const href = "/learn/intercultural";
const guideId = "asset-program-" + createHash("sha256").update(href).digest("hex").slice(0, 24);
function doc(id: string, title: string, target: string, text = title): Doc {
  return { id, title, href: target, text, summary: title, kind: "content", authority: "learning", type: "program_destination", status: "approved", reviewDate: "", scope: "agencywide", tags: [], intents: [] };
}
const guide = () => doc(guideId, "Learning across difference", href,
  "Foundations: distinguish observation from interpretation. Perspectives: ask about meaning. Communication: adapt a question. Decisions: use the Equity Analysis Toolkit. Reflection: return to what happened and revise the next action.");
const languageTool = () => doc("ja-language-access-checklist", "Language access checklist", "/library/ja-language-access-checklist");
let current: Doc[];
let otherScope: Doc[];
let complete: ReturnType<typeof vi.fn<providers.ProviderAdapter["complete"]>>;
const context = () => ({ trace_id: testTraceId("ask-learning-guidance"), agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const });

beforeEach(() => {
  resetStoreForTests();
  invalidatePolicyCache();
  current = [guide(), languageTool()];
  otherScope = [...current];
  vi.spyOn(programResources, "indexedProgramResources").mockImplementation(async scope => ({ communityDocs: [], destinations: scope === "dsd" ? current : otherScope }));
  vi.spyOn(staffSearch, "indexedStaffDocs").mockResolvedValue([]);
  complete = vi.fn<providers.ProviderAdapter["complete"]>(async () => ({ parsed: { shortAnswer: "Consider the decision you want to improve and choose a practice that fits it.", whyItMatters: "", limits: [], sourceIds: [], resourceHrefs: [] }, model_id: "mdl_claude_staff_primary" }));
  vi.spyOn(providers, "resolveBinding").mockReturnValue({
    model: getModel("mdl_claude_staff_primary")!, generative: true, reason: "synthetic learning test",
    adapter: { id: "anthropic", generative: true, health: async () => ({ ok: true, latency_ms: 0 }), complete },
  });
});
afterEach(() => vi.restoreAllMocks());

it("uses current published text and exposes all five sections only with the journey publication", () => {
  const original = getLearningJourneyContext([guide()]);
  expect(original?.guidance).toContain("distinguish observation from interpretation");
  expect(original?.sections.map(section => section.href)).toEqual(["foundations", "perspectives", "communication", "decisions", "reflection"].map(id => href + "#" + id));
  expect(getLearningJourneyContext([doc("recovered", "Recovered course", "/courses/recovered")])).toBeUndefined();
  const changed = { ...guide(), text: "Revised published guidance." };
  expect(getLearningJourneyContext([changed])?.guidance).toBe("Revised published guidance.");
});

it("supplies substantive learning guidance, open access, and the credit rule without narrowing broad reasoning", async () => {
  await askConcierge({ question: "I have IDI feedback. What intercultural learning could help me apply it at work?", contextPreference: "one_dsd", researchMode: "program_only" }, context());
  const request = complete.mock.calls[0][0];
  const prompt = JSON.parse(request.user);
  expect(prompt.learningJourney.guidance).toContain("return to what happened");
  expect(prompt.learningJourney.sourceId).toBe(guideId);
  expect(prompt.programSources).toContainEqual(expect.objectContaining({ id: guideId, href }));
  expect(prompt.learningParticipation).toContain(TRAINING_CREDIT_NOTICE);
  expect(request.system).toContain("Do not diagnose or infer an IDI orientation");
  expect(request.system).toContain("do not require course completion or an IDI assessment before access");
  expect(request.system).toContain("Use your general knowledge and reasoning");
  expect(prompt.availableProgramDestinations).toContainEqual(expect.objectContaining({ href: href + "#reflection" }));
});

it("keeps a reasoned answer intact and filters invented, private, or unknown-section suggestions", async () => {
  const answer = "You can begin with noticing assumptions, then try a different question in your next conversation. Your stated goal is a useful starting point.";
  complete.mockResolvedValue({ parsed: { shortAnswer: answer, whyItMatters: "", limits: [], sourceIds: [], resourceHrefs: [href + "#perspectives", href + "#invented", "/consultant", "/unpublished", href + "#perspectives"] }, model_id: "mdl_claude_staff_primary" });
  const result = await askConcierge({ question: "Which intercultural course should I explore?", contextPreference: "one_dsd", researchMode: "program_only" }, context());
  expect(result.kind).toBe("answer");
  if (result.kind !== "answer") throw new Error("Expected an answer");
  expect(result.answer.shortAnswer).toBe(answer);
  expect(result.answer.nextActions.filter(action => action.href.startsWith(href))).toEqual([{ label: "Explore different perspectives", href: href + "#perspectives" }]);
  expect(result.answer.nextActions.some(action => ["/consultant", "/unpublished"].includes(action.href))).toBe(false);
  expect(result.answer.limits).toContain(TRAINING_CREDIT_NOTICE);
});

it("removes withdrawn journey guidance and anchors in one scope while preserving another", async () => {
  current = [languageTool()];
  complete.mockResolvedValue({ parsed: { shortAnswer: "Choose from the resources available to you.", whyItMatters: "", limits: [], resourceHrefs: [href, href + "#foundations"] }, model_id: "mdl_claude_staff_primary" });
  const hidden = await askConcierge({ question: "Where can I start intercultural learning?", contextPreference: "one_dsd", researchMode: "program_only" }, context());
  expect(JSON.parse(complete.mock.calls[0][0].user).learningJourney).toBeUndefined();
  if (hidden.kind !== "answer") throw new Error("Expected an answer");
  expect(hidden.answer.nextActions.some(action => action.href.startsWith(href))).toBe(false);
  const visible = await askConcierge({ question: "Where can I start intercultural learning?", contextPreference: "one_dhs", researchMode: "program_only" }, context());
  if (visible.kind !== "answer") throw new Error("Expected an answer");
  expect(visible.answer.nextActions.some(action => action.href === href + "#foundations")).toBe(true);
});

it("does not reintroduce a withdrawn checklist through deterministic next-practice suggestions", async () => {
  const question = "Help with language access.";
  const before = await askConcierge({ question, contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (before.kind !== "answer") throw new Error("Expected an answer");
  expect(before.answer.nextActions.some(action => action.href === languageTool().href)).toBe(true);
  current = [guide()];
  const after = await askConcierge({ question, contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (after.kind !== "answer") throw new Error("Expected an answer");
  expect(after.answer.nextActions.some(action => action.href === languageTool().href)).toBe(false);
  const independent = await askConcierge({ question, contextPreference: "one_dhs", researchMode: "program_only" }, context());
  if (independent.kind !== "answer") throw new Error("Expected an answer");
  expect(independent.answer.nextActions.some(action => action.href === languageTool().href)).toBe(true);
});

it("offers honest learning navigation when generation fails without substituting team-climate advice", async () => {
  complete.mockRejectedValue(new Error("synthetic provider unavailable"));
  const result = await askConcierge({ question: "Which intercultural course can I start for my team?", contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (result.kind !== "answer") throw new Error("Expected an answer");
  expect(result.answer.degraded).toBe(true);
  expect(result.answer.generative).toBe(false);
  expect(result.answer.shortAnswer).toContain("A tailored recommendation is not available");
  expect(result.answer.shortAnswer).toContain("Learning across difference");
  expect(result.answer.shortAnswer).not.toMatch(/Climate improves|rotating who opens|agendas ahead/);
  expect(result.answer.sources).toEqual([]);
  expect(result.answer.nextActions[0].href).toBe(href);
  expect(result.answer.nextActions.some(action => action.href === "/library/ja-climate-action-plan")).toBe(false);
});

it("preserves the complete learning answer and section suggestions in the existing response record", async () => {
  complete.mockResolvedValue({ parsed: { shortAnswer: "Try adapting your question, then reflect on what changed.", whyItMatters: "", limits: [], resourceHrefs: [href + "#communication"] }, model_id: "mdl_claude_staff_primary" });
  const ctx = context();
  const result = toStaffAskResult(await askConcierge({ question: "Recommend intercultural learning.", contextPreference: "one_dsd", researchMode: "program_only" }, ctx));
  const record = createAskResponseRecord({ traceId: ctx.trace_id, programScope: "dsd", researchMode: "program_only", status: "answered", httpStatus: 200, question: "Recommend intercultural learning.", response: result, researchStatus: "not_requested" });
  expect(validateAskRecord(record).response).toEqual(result);
  expect(JSON.stringify(record.response)).toContain(href + "#communication");
});

it("does not turn an unrelated question into a learning pathway or a training-credit notice", async () => {
  expect(isLearningNavigationQuestion("Explain prime numbers.")).toBe(false);
  const result = await askConcierge({ question: "Explain prime numbers.", contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (result.kind !== "answer") throw new Error("Expected an answer");
  expect(result.answer.nextActions).toEqual([]);
  expect(result.answer.limits).toEqual([]);
  expect(result.answer.generative).toBe(true);
});

it("keeps a direct Equity Analysis Toolkit lookup separate from learning recommendations", async () => {
  const question = "Where can I find Equity Analysis Toolkit?";
  expect(isLearningNavigationQuestion(question)).toBe(false);
  const toolkit = doc("asset-program-" + createHash("sha256").update("/learn/equity-toolkit").digest("hex").slice(0, 24), "Equity Analysis Toolkit", "/learn/equity-toolkit");
  current = [guide(), toolkit];
  complete.mockRejectedValue(new Error("synthetic provider unavailable"));
  const result = await askConcierge({ question, contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (result.kind !== "answer") throw new Error("Expected an answer");
  expect(result.answer.nextActions.some(action => action.href === toolkit.href)).toBe(true);
  expect(result.answer.shortAnswer).not.toContain("A tailored learning recommendation");
});

it("preserves an exact named-course lookup even when its title contains learning language", async () => {
  const courseHref = "/courses/intercultural-learning";
  const course = doc("asset-program-" + createHash("sha256").update(courseHref).digest("hex").slice(0, 24), "Intercultural learning", courseHref);
  current = [guide(), course];
  complete.mockRejectedValue(new Error("synthetic provider unavailable"));
  const result = await askConcierge({ question: "Where can I find Intercultural learning?", contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (result.kind !== "answer") throw new Error("Expected an answer");
  expect(result.answer.nextActions.some(action => action.href === courseHref)).toBe(true);
  expect(result.answer.shortAnswer).toContain('open "Intercultural learning"');
  expect(result.answer.shortAnswer).not.toContain("community brief");
  expect(result.answer.shortAnswer).not.toContain("A tailored recommendation is not available");
});

it("answers the program training-credit question from the canonical rule when generation fails", async () => {
  complete.mockRejectedValue(new Error("synthetic provider unavailable"));
  const question = "Does completing this program count toward required DHS training credits?";
  expect(isProgramTrainingCreditQuestion(question)).toBe(true);
  const result = await askConcierge({ question, contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (result.kind !== "answer") throw new Error("Expected an answer");
  expect(result.answer.shortAnswer).toBe(TRAINING_CREDIT_NOTICE);
  expect(result.answer.shortAnswer).not.toContain("Start with what participants");
  expect(result.answer.generative).toBe(false);
  expect(result.answer.degraded).toBe(true);
  expect(result.answer.sources).toEqual([]);
});

it("does not apply the program credit fallback to general college or continuing-education questions", async () => {
  complete.mockRejectedValue(new Error("synthetic provider unavailable"));
  const question = "How many college credits does a university degree require?";
  expect(isProgramTrainingCreditQuestion(question)).toBe(false);
  const result = await askConcierge({ question, contextPreference: "one_dsd", researchMode: "program_only" }, context());
  if (result.kind !== "answer") throw new Error("Expected an answer");
  expect(result.answer.shortAnswer).not.toBe(TRAINING_CREDIT_NOTICE);
  expect(result.answer.limits).not.toContain(TRAINING_CREDIT_NOTICE);
});
