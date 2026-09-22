import { describe, expect, it } from "vitest";
import { activePracticeArtifact, mergePracticeArtifact, PracticeArtifactSchema, validPracticeValues, type PracticeValues } from "@/lib/content/practice-artifact";
import { buildPracticeArtifact, matchingPriorArtifact, practiceContract } from "@/lib/intelligence/practice-artifact";
import { meetingArtifact, meetingPath } from "./helpers/practice-artifact-fixtures";
import { testTraceId } from "./helpers/opaque-identifiers";
const first = meetingArtifact();
const second = meetingArtifact({ revisionId: testTraceId("meeting-second"), parentRevisionId: first.revisionId, values: { ...first.values, formats: ["Speak", "Use remote chat", "Contribute after the meeting"], owners: ["Proposed facilitator: read remote contributions; person to confirm", "Proposed note-taker: record decisions; person to confirm"] } });
const merge = (incoming: unknown, current = {}, previous?: unknown) => mergePracticeArtifact({ incoming, current, previous, path: meetingPath, context: "one_dsd", contract: practiceContract(meetingPath) });
describe("typed Practice draft transfer", () => {
  it("offers all draft fields without saving or declaring completion", () => {
    const result = merge(first);
    expect(result).toMatchObject({ ok: true, values: first.values, preserved: [] });
    expect(result).not.toHaveProperty("complete");
    expect(first.values).not.toHaveProperty("complete");
  });
  it("updates unedited fields while preserving staff changes, including a deliberately cleared field", () => {
    const current: PracticeValues = { ...first.values, ahead: "Keep my team's own agenda.", owners: [] };
    const result = merge(second, current, first);
    expect(result).toMatchObject({ ok: true, values: { ahead: current.ahead, owners: [], formats: second.values.formats }, preserved: ["ahead", "owners"] });
    expect(current.formats).toEqual(first.values.formats);
  });
  it("keeps notes from a different draft and reports only fields with different incoming values", () => {
    const result = merge(first, { ahead: "Existing notes." });
    expect(result).toMatchObject({ ok: true, values: { ahead: "Existing notes.", work_name: first.values.work_name }, preserved: ["ahead"] });
  });
  it.each([
    { ...first, context: "one_dhs" }, { ...first, pathId: "gp-9" },
    { ...first, pathContract: "a".repeat(64) }, { ...first, values: { nonexistent: "Invented field" } },
    { ...first, values: { formats: "Wrong field type" } },
    { ...first, values: { review_date: "2026-15-01" } },
    { ...first, values: { review_date: "2026-02-30" } },
    { ...first, hiddenTracking: "unsupported" },
    { ...first, values: { ahead: "x".repeat(3001) } },
  ])("rejects incompatible or malformed drafts without changing notes", incoming => {
    const current = { ahead: "My notes." };
    expect(merge(incoming, current)).toMatchObject({ ok: false });
    expect(current).toEqual({ ahead: "My notes." });
  });
  it("rejects duplicate, stale and out-of-order revisions", () => {
    expect(merge(first, first.values, first)).toMatchObject({ ok: false });
    expect(merge(first, second.values, second)).toMatchObject({ ok: false });
    expect(merge({ ...second, parentRevisionId: testTraceId("another-branch") }, first.values, first)).toMatchObject({ ok: false });
  });
  it("does not treat changed worksheet contracts as compatible prior context", () => {
    expect(matchingPriorArtifact(first, { ...meetingPath, artifactFields: meetingPath.artifactFields.map(f => f.id === "ahead" ? { ...f, help: "Revised guidance." } : f) }, "one_dsd")).toBeUndefined();
    expect(matchingPriorArtifact(first, meetingPath, "one_dhs")).toBeUndefined();
  });
  it("validates every field type and rejects unknown or duplicate generated IDs", () => {
    expect(validPracticeValues(meetingPath, { review_date: "2026-09-30" })).toBe(true);
    const build = (fields: unknown[]) => buildPracticeArtifact({ draft: { pathId: "gp-8", fields }, path: meetingPath, context: "one_dsd", traceId: first.traceId, sources: [] });
    expect(build([{ id: "invented", value: "not a worksheet field" }])).toBeUndefined();
    expect(build([{ id: "ahead", value: "one" }, { id: "ahead", value: "two" }])).toBeUndefined();
    expect(build([{ id: "formats", value: "not a list" }])).toBeUndefined();
  });
  it("rejects executable links, unrelated fields and oversized aggregate draft content", () => {
    expect(PracticeArtifactSchema.safeParse({ ...first, sources: [{ id: "source", title: "Source", href: "javascript:alert(1)" }] }).success).toBe(false);
    expect(PracticeArtifactSchema.safeParse({ ...first, sources: [{ id: "source", title: "Source", href: "//foreign.example" }] }).success).toBe(false);
    expect(PracticeArtifactSchema.safeParse({ ...first, sources: [{ id: "source", title: "Source", href: "/"+String.fromCharCode(92)+"foreign.example" }] }).success).toBe(false);
    expect(PracticeArtifactSchema.safeParse({ ...first, values: { first: "x".repeat(3000), second: "x".repeat(3000), third: "x".repeat(3000), fourth: "x".repeat(3000) } }).success).toBe(false);
  });
});

it("keeps the latest compatible active draft until a deliberate topic reset", () => {
  const draftTurn = { context: "one_dsd", question: "Make a meeting agenda.", result: { kind: "answer", answer: { practiceArtifact: first } } };
  const clarification = { context: "one_dsd", question: "Why provide another way to contribute?", result: { kind: "answer", answer: {} } };
  expect(activePracticeArtifact([clarification, draftTurn], "one_dsd", "Could this be more concise?")).toEqual(first);
  expect(activePracticeArtifact([clarification, draftTurn], "one_dsd", "Start over with a new draft.")).toBeUndefined();
  expect(activePracticeArtifact([{ ...clarification, question: "A different topic: mentoring." }, draftTurn], "one_dsd", "Can you simplify that?")).toBeUndefined();
  expect(activePracticeArtifact([draftTurn], "one_dhs", "Simplify it.")).toBeUndefined();
  expect(activePracticeArtifact([draftTurn], "one_dsd", "Simplify it.", "gp-6")).toBeUndefined();
});
