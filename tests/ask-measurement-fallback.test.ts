import { createHash } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { askConcierge, classifyIntent } from "@/lib/intelligence/agents/ask";
import { isMeasurementPlanningQuestion } from "@/lib/intelligence/measurement-guidance";
import * as programResources from "@/lib/intelligence/retrieval/program-resources";
import * as staffSearch from "@/lib/intelligence/retrieval/staff-search";
import * as semantic from "@/lib/intelligence/retrieval/local-semantic";
import type { Doc } from "@/lib/intelligence/retrieval/search";
import * as providers from "@/lib/intelligence/providers";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { getModel } from "@/lib/intelligence/registry/models";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { testTraceId } from "./helpers/opaque-identifiers";

const question = "Create a practical measurement worksheet for reviewing whether translated letters improve access to disability services. Include an outcome, an indicator, and a small-group privacy check.";
const href = "/practice/measurement";
function doc(id: string, title: string, target: string, text: string, tags: string[] = []): Doc {
  return { id, title, href: target, text, summary: text, tags, kind: "content", authority: "learning", type: "program_destination", status: "approved", reviewDate: "", scope: "agencywide", intents: [] };
}
const note = doc("pn-measurement-without-surveillance", "Measurement without surveillance", "/library/pn-measurement-without-surveillance", "Build an evaluation plan with outcomes, indicators, baseline, mixed methods, and small-group protection.");
const worksheet = doc("asset-program-" + createHash("sha256").update(href).digest("hex").slice(0,24), "Plan how to learn from results", href, "Current published measurement worksheet: agree a baseline and protect identifiable small groups.");
const language = doc("ja-language-access-checklist", "Language access checklist", "/library/ja-language-access-checklist", "Identify languages and translate vital letters and documents with qualified interpreters.", ["language", "translation", "letters"]);
let current: Doc[];
let complete: ReturnType<typeof vi.fn<providers.ProviderAdapter["complete"]>>;
const context = () => ({ trace_id: testTraceId("ask-measurement-fallback"), agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const });
const input = () => ({ question, contextPreference: "one_dsd" as const, researchMode: "program_only" as const });
beforeEach(() => {
  resetStoreForTests(); invalidatePolicyCache();
  current = [language, note, worksheet];
  vi.spyOn(programResources, "indexedProgramResources").mockImplementation(async scope => ({ communityDocs: [], destinations: scope === "dsd" ? current : [language, note, worksheet] }));
  vi.spyOn(staffSearch, "indexedStaffDocs").mockResolvedValue([]);
  vi.spyOn(semantic, "semanticRetrieveForAgent").mockRejectedValue(new semantic.SemanticSearchUnavailable("inference_failed"));
  complete = vi.fn<providers.ProviderAdapter["complete"]>().mockRejectedValue(new Error("synthetic provider timeout"));
  vi.spyOn(providers, "resolveBinding").mockReturnValue({ model: getModel("mdl_claude_staff_primary")!, generative: true, reason: "synthetic timeout regression", adapter: { id: "anthropic", generative: true, health: async () => ({ ok: true, latency_ms: 0 }), complete } });
});
afterEach(() => vi.restoreAllMocks());

it("prioritizes the requested evaluation over the translation subject without redirecting ordinary access or science questions", () => {
  expect(classifyIntent(question).primary).toBe("practice_method");
  expect(isMeasurementPlanningQuestion("We want to know whether a service change reduced disparities. How do we set that up honestly?")).toBe(true);
  expect(classifyIntent("Families receive letters only in English and cannot understand what to do next. What should our team plan?").primary).toBe("access_barriers");
  for (const unrelated of ["How should I assess wheelchair access to our office?", "What is a measurement in quantum mechanics?", "How do I measure the distance to Saturn?", "Explain prime numbers."]) expect(isMeasurementPlanningQuestion(unrelated)).toBe(false);
});

it("answers the exact live timeout regression with an honest framework and current measurement destination even when semantic retrieval also fails", async () => {
  const result = await askConcierge(input(), context());
  if (result.kind !== "answer") throw Error("Expected answer");
  const answer = result.answer;
  expect(answer.generative).toBe(false); expect(answer.degraded).toBe(true);
  expect(answer.shortAnswer).toContain("A tailored worksheet draft is not available");
  expect(answer.shortAnswer).toContain("suggestions, not findings or established targets");
  expect(answer.shortAnswer).toMatch(/Outcome[\s\S]*understand the letter/);
  expect(answer.shortAnswer).toMatch(/Indicator[\s\S]*denominator/);
  expect(answer.shortAnswer).toMatch(/Small-group privacy check[\s\S]*data owner[\s\S]*withhold/);
  expect(answer.shortAnswer).toContain("Do not invent a baseline");
  expect(answer.shortAnswer).not.toMatch(/This comes from|Identify languages|qualified interpreter|climate action/i);
  expect(answer.nextActions[0]).toEqual({ label: "Open " + worksheet.title, href });
  expect(answer.nextActions.some(link => link.href === note.href)).toBe(true);
  expect(answer.nextActions.some(link => link.href === "/practice/gp-2")).toBe(false);
  expect(answer.pathSuggestion).toBeUndefined(); expect(answer.sources).toEqual([]);
  expect(answer.evidenceClaims).toBeUndefined(); expect(answer.grounding).toBe("none");
  expect(answer.practiceArtifact).toBeUndefined();
  const audit = await getStore().listAudit(100);
  expect(audit.some(row => row.tool_name === "answer.structured_draft" && !row.ok)).toBe(true);
  expect(audit.some(row => row.tool_name === "corpus.semantic_retrieve" && !row.ok)).toBe(true);
  expect(audit.some(row => row.tool_name === "corpus.search" && row.ok)).toBe(true);
});

it("supplies actual published measurement material to generation and preserves its successful response", async () => {
  complete.mockResolvedValue({ parsed: { shortAnswer: "Here is a draft evaluation plan tailored to your stated question.", whyItMatters: "", limits: [], resourceHrefs: [href] }, model_id: "mdl_claude_staff_primary" });
  const result = await askConcierge(input(), context());
  if (result.kind !== "answer") throw Error("Expected answer");
  const prompt = JSON.parse(complete.mock.calls[0][0].user);
  expect(prompt.programSources).toContainEqual(expect.objectContaining({ id: worksheet.id, href }));
  expect(prompt.programSources).toContainEqual(expect.objectContaining({ id: note.id }));
  expect(JSON.stringify(prompt.programSources)).toContain("Current published measurement worksheet");
  expect(result.answer.shortAnswer).toBe("Here is a draft evaluation plan tailored to your stated question.");
  expect(result.answer.generative).toBe(true); expect(result.answer.degraded).toBe(false);
  expect(result.answer.nextActions.some(link => link.href === href)).toBe(true);
});

it("does not resurrect a withheld worksheet and keeps publication scopes independent", async () => {
  current = [language, note];
  const hidden = await askConcierge(input(), context());
  if (hidden.kind !== "answer") throw Error("Expected answer");
  expect(hidden.answer.nextActions.some(link => link.href === href)).toBe(false);
  expect(hidden.answer.nextActions.some(link => link.href === note.href)).toBe(true);
  expect(hidden.answer.shortAnswer).toContain("starting framework");
  current = [language];
  const withdrawn = await askConcierge(input(), context());
  if (withdrawn.kind !== "answer") throw Error("Expected answer");
  expect(withdrawn.answer.nextActions.some(link => [href, note.href].includes(link.href))).toBe(false);
  expect(withdrawn.answer.sources).toEqual([]);
  const visible = await askConcierge({ ...input(), contextPreference: "one_dhs" }, context());
  if (visible.kind !== "answer") throw Error("Expected answer");
  expect(visible.answer.nextActions.some(link => link.href === href)).toBe(true);
});

it("does not substitute measurement advice for an ordinary language-access timeout", async () => {
  const result = await askConcierge({ ...input(), question: "How do we arrange language access for translated letters?" }, context());
  if (result.kind !== "answer") throw Error("Expected answer");
  expect(result.answer.intent).toBe("access_barriers");
  expect(result.answer.shortAnswer).toMatch(/language|translat/i);
  expect(result.answer.shortAnswer).not.toContain("starting framework");
  expect(result.answer.nextActions.some(link => link.href === href)).toBe(false);
});

it("keeps successful broad reasoning outside the program available", async () => {
  complete.mockResolvedValue({ parsed: { shortAnswer: "A prime number has exactly two positive divisors.", whyItMatters: "", limits: [], resourceHrefs: [] }, model_id: "mdl_claude_staff_primary" });
  const result = await askConcierge({ ...input(), question: "Explain prime numbers." }, context());
  if (result.kind !== "answer") throw Error("Expected answer");
  expect(result.answer.generative).toBe(true);
  expect(result.answer.shortAnswer).toBe("A prime number has exactly two positive divisors.");
  expect(result.answer.nextActions).toEqual([]);
});


// September 13, 2026 repair: fixed 45-second and 30-second limits cut reasoning answers off, so every
// draft now gets the remaining route window (maxDuration 120s), between 20 and 75 seconds.
it("gives ordinary and organizational drafts the remaining request window, capped at 75 seconds", async () => {
  await askConcierge(input(), context());
  expect(complete.mock.calls[0][0].timeoutMs).toBe(75_000);
  complete.mockClear();
  await askConcierge({ ...input(), question: "How does MnCHOICES support assessment and planning?" }, context());
  expect(complete.mock.calls[0][0].timeoutMs).toBe(75_000);
});

it("gives non-Anthropic drafts the same request window instead of an adapter default", async () => {
  const binding = providers.resolveBinding(context().agent);
  vi.mocked(providers.resolveBinding).mockReturnValue({ ...binding, adapter: { ...binding.adapter, id: "openai" } });
  await askConcierge(input(), context());
  expect(complete.mock.calls[0][0].timeoutMs).toBe(75_000);
});
