import { evidenceForDoc } from "@/lib/intelligence/retrieval/evidence";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { askConcierge, toStaffAskResult } from "@/lib/intelligence/agents/ask";
import * as programResources from "@/lib/intelligence/retrieval/program-resources";
import * as staffSearch from "@/lib/intelligence/retrieval/staff-search";
import * as editableSurfaces from "@/lib/content/editable-surfaces";
import * as providers from "@/lib/intelligence/providers";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { getModel } from "@/lib/intelligence/registry/models";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { createAskResponseRecord, FileAskRecordsStore, validateAskRecord } from "@/lib/intelligence/observability/ask-records";
import { meetingArtifact } from "./helpers/practice-artifact-fixtures";
import { testTraceId } from "./helpers/opaque-identifiers";
import type { Doc } from "@/lib/intelligence/retrieval/search";
const sourceId = "asset-program-" + createHash("sha256").update("/practice/gp-8").digest("hex").slice(0, 24);
const meetingDoc: Doc = { id: sourceId, title: "Accessible meeting practice", href: "/practice/gp-8", text: "Share an agenda. Offer remote and written participation. Confirm owners and share decisions.", summary: "Plan accessible meetings.", kind: "content", authority: "learning", type: "program_destination", status: "approved", reviewDate: "", scope: "agencywide", tags: ["meeting"], intents: ["workplace_culture"] };
let docs: Doc[];
let complete: ReturnType<typeof vi.fn<providers.ProviderAdapter["complete"]>>;
const ctx = (turn: string) => ({ trace_id: testTraceId(turn), agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const });
const fixture = (fields = Object.entries(meetingArtifact().values).map(([id, value]) => ({ id, value }))) => ({
  parsed: { shortAnswer: "Here is a thirty-minute meeting agenda. Welcome and access check: five minutes; discuss options: fifteen minutes; next steps: ten minutes.", whyItMatters: "Participants can prepare and contribute in several ways.", limits: [], evidenceClaims: [{ kind: "source_excerpt", text: evidenceForDoc(meetingDoc).excerpt.quote, references: [{ evidenceId:evidenceForDoc(meetingDoc).evidenceId, ...evidenceForDoc(meetingDoc).excerpt }] }], sourceIds: [sourceId], resourceHrefs: ["/practice/gp-8"], practiceDraft: { pathId: "gp-8", fields } }, model_id: "mdl_claude_staff_primary"
});
beforeEach(() => {
  resetStoreForTests(); invalidatePolicyCache(); docs = [meetingDoc];
  vi.spyOn(programResources, "indexedProgramResources").mockImplementation(async () => ({ communityDocs: [], destinations: docs }));
  vi.spyOn(staffSearch, "indexedStaffDocs").mockResolvedValue([]);
  complete = vi.fn<providers.ProviderAdapter["complete"]>(async () => fixture());
  vi.spyOn(providers, "resolveBinding").mockReturnValue({ model: getModel("mdl_claude_staff_primary")!, generative: true, reason: "Synthetic draft test", adapter: { id: "anthropic", generative: true, health: async () => ({ ok: true, latency_ms: 0 }), complete } });
});
afterEach(() => vi.restoreAllMocks());
it("carries a real two-turn agenda task into typed revisions and durably reopens both complete answers", async () => {
  const firstQuestion = "Create a thirty-minute accessible DSD team meeting agenda.";
  const first = await askConcierge({ question: firstQuestion, contextPreference: "one_dsd", researchMode: "program_only" }, ctx("draft-turn-one"));
  if (first.kind !== "answer" || !first.answer.practiceArtifact) throw Error("Missing first draft");
  const original = first.answer.practiceArtifact;
  expect(original.values.ahead).toContain("0–5");
  expect(original.sources).toContainEqual({ id: sourceId, title: meetingDoc.title, href: meetingDoc.href });
  complete.mockResolvedValueOnce(fixture([
    { id: "formats", value: ["Remote chat during the meeting", "Written input ahead or afterward", "Spoken input"] },
    { id: "owners", value: ["Proposed facilitator: invite and read remote input; person to confirm", "Proposed note-taker: record contributions and next steps; person to confirm"] },
  ]));
  const second = await askConcierge({ question: "Add remote contributions and clarify the facilitator and note-taker roles.", contextPreference: "one_dsd", researchMode: "program_only", priorArtifact: original, history: [{ question: firstQuestion, answer: first.answer.shortAnswer }] }, ctx("draft-turn-two"));
  if (second.kind !== "answer" || !second.answer.practiceArtifact) throw Error("Missing revised draft");
  const revised = second.answer.practiceArtifact;
  expect(revised).toMatchObject({ artifactId: original.artifactId, parentRevisionId: original.revisionId, traceId: ctx("draft-turn-two").trace_id });
  expect(revised.revisionId).not.toBe(original.revisionId);
  expect(revised.values.ahead).toBe(original.values.ahead);
  expect(revised.values.formats).toContain("Remote chat during the meeting");
  expect(revised.values.owners).toEqual(expect.arrayContaining([expect.stringContaining("facilitator"), expect.stringContaining("note-taker")]));
  const prompt = JSON.parse(complete.mock.calls[1][0].user);
  expect(prompt.practiceDraft.previousDraft.values).toEqual(original.values);
  expect(prompt.practiceDraft.instructions).toContain("Never invent people's commitments");
  expect(prompt.conversation[0].answer).toBe(first.answer.shortAnswer);
  const folder = await mkdtemp(path.join(tmpdir(), "pac-typed-draft-"));
  try {
    const store = new FileAskRecordsStore(folder);
    const records = [first, second].map((result, i) => createAskResponseRecord({ traceId: ctx(i ? "draft-turn-two" : "draft-turn-one").trace_id, programScope: "dsd", researchMode: "program_only", status: "answered", httpStatus: 200, question: i ? "Add remote contributions and roles." : firstQuestion, response: toStaffAskResult(result), researchStatus: "not_requested" }));
    for (const record of records) await store.append(record);
    const reopened = await new FileAskRecordsStore(folder).list(10, null, new Date().toISOString());
    for (const record of records) expect(reopened.find(row => row.id === record.id)).toEqual(record);
    expect(() => validateAskRecord({ ...records[0], programScope: "one-dhs" })).toThrow();
    expect(() => validateAskRecord({ ...records[0], traceId: testTraceId("unrelated") })).toThrow();
  } finally { if (path.dirname(path.resolve(folder)) !== path.resolve(tmpdir()) || !path.basename(folder).startsWith("pac-typed-draft-")) throw Error("Unexpected test directory."); await rm(folder, { recursive: true, force: true }); }
  expect(complete).toHaveBeenCalledTimes(2);
});
it("does not offer an unpublished or other-scope draft even when the model proposes one", async () => {
  docs = [];
  const result = await askConcierge({ question: "Create an accessible meeting agenda.", contextPreference: "one_dsd", researchMode: "program_only" }, ctx("hidden-draft"));
  if (result.kind !== "answer") throw Error("Expected answer");
  expect(result.answer.practiceArtifact).toBeUndefined();
  expect(JSON.parse(complete.mock.calls[0][0].user).practiceDraft).toBeUndefined();
});
it("does not use a withdrawn worksheet shell or stale prior field contract", async () => {
  const originalLoad = editableSurfaces.loadPublishedEditableSurface;
  vi.spyOn(editableSurfaces, "loadPublishedEditableSurface").mockImplementation((id, options) => id === "practice.path-shell" ? Promise.resolve(undefined) : originalLoad(id, options));
  const result = await askConcierge({ question: "Add remote input to this meeting.", contextPreference: "one_dsd", priorArtifact: meetingArtifact(), researchMode: "program_only" }, ctx("hidden-shell"));
  if (result.kind !== "answer") throw Error("Expected answer");
  expect(result.answer.practiceArtifact).toBeUndefined();
  expect(JSON.parse(complete.mock.calls[0][0].user).practiceDraft).toBeUndefined();
});
it.each(["scope", "contract"])("excludes incompatible prior %s values from model context", async reason => {
  const priorArtifact = meetingArtifact(reason === "scope" ? { context: "one_dhs", values: { ahead: "Other scope private draft." } } : { pathContract: "f".repeat(64), values: { ahead: "Stale private draft." } });
  await askConcierge({ question: "Add remote participation to an accessible meeting.", contextPreference: "one_dsd", priorArtifact, researchMode: "program_only" }, ctx("wrong-" + reason));
  const prompt = JSON.parse(complete.mock.calls[0][0].user);
  expect(prompt.practiceDraft?.previousDraft).toBeUndefined();
  expect(complete.mock.calls[0][0].user).not.toMatch(/Other scope private draft|Stale private draft/);
});
it("keeps the answer when its optional worksheet is malformed and never manufactures a draft after failure", async () => {
  complete.mockResolvedValueOnce(fixture([{ id: "invented", value: "no real field" }]));
  const first = await askConcierge({ question: "Create an accessible meeting agenda.", researchMode: "program_only" }, ctx("bad-draft"));
  if (first.kind !== "answer") throw Error("Expected answer");
  expect(first.answer.generative).toBe(true);
  expect(first.answer.shortAnswer).toContain("thirty-minute");
  expect(first.answer.practiceArtifact).toBeUndefined();
  expect(first.answer.limits.join(" ")).toContain("draft could not be prepared");
  complete.mockRejectedValueOnce(Error("synthetic unavailable"));
  const failed = await askConcierge({ question: "Create an accessible meeting agenda.", researchMode: "program_only" }, ctx("no-draft"));
  if (failed.kind !== "answer") throw Error("Expected answer");
  expect(failed.answer.practiceArtifact).toBeUndefined();
  expect(failed.answer.degraded).toBe(true);
});

it("does not let an earlier meeting draft override a newly requested hiring practice", async () => {
  docs.push({ ...meetingDoc, id: "asset-program-" + createHash("sha256").update("/practice/gp-6").digest("hex").slice(0, 24), title: "Hiring and selection", href: "/practice/gp-6" });
  await askConcierge({ question: "Add an interview rubric for hiring.", contextPreference: "one_dsd", priorArtifact: meetingArtifact(), researchMode: "program_only" }, ctx("new-practice"));
  const prompt = JSON.parse(complete.mock.calls[0][0].user);
  expect(prompt.practiceDraft.pathId).toBe("gp-6");
  expect(prompt.practiceDraft.previousDraft).toBeUndefined();
});

it.each(["Can you simplify the draft?", "Could this be more concise?"])("keeps typed revision context for natural follow-up: %s", async question => {
  const priorArtifact = meetingArtifact();
  await askConcierge({ question, contextPreference: "one_dsd", priorArtifact, researchMode: "program_only", history: [{ question: "Why offer written contributions?", answer: "They provide another way to contribute." }] }, ctx("natural-revision"));
  const prompt = JSON.parse(complete.mock.calls[0][0].user);
  expect(prompt.practiceDraft.previousDraft.values).toEqual(priorArtifact.values);
  expect(prompt.practiceDraft.pathId).toBe("gp-8");
});
it("leaves broad general-question routing intact while an optional earlier draft is available", async () => {
  complete.mockResolvedValueOnce({ parsed: { shortAnswer: "Four.", whyItMatters: "", limits: [], resourceHrefs: [], sourceIds: [] }, model_id: "mdl_claude_staff_primary" });
  const result = await askConcierge({ question: "What is two plus two?", contextPreference: "one_dsd", priorArtifact: meetingArtifact(), researchMode: "program_only" }, ctx("broad-with-draft"));
  if (result.kind !== "answer") throw Error("Expected answer");
  expect(result.answer.shortAnswer).toBe("Four.");
  expect(result.answer.practiceArtifact).toBeUndefined();
  expect(result.answer.pathSuggestion).toBeUndefined();
  expect(result.answer.sources).toEqual([]);
  expect(JSON.parse(complete.mock.calls[0][0].user).programSources).toEqual([]);
});
