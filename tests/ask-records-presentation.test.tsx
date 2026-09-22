import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AskRecordDetail, AskRecordsClient } from "@/components/ask-records-client";
import type { AskResponseRecord } from "@/lib/intelligence/observability/ask-records";

const record: AskResponseRecord = {
  id: "ed898706-a441-4b45-9c65-6cfa99aaf465", traceId: "caf567be-4ce3-4b73-9fa0-fb345c830217",
  createdAt: "2026-09-07T21:00:00.000Z", programScope: "one-dhs", researchMode: "auto",
  status: "answered", httpStatus: 200, question: "How can our team make a meeting more accessible?",
  questionOmittedReason: null, researchStatus: "not_requested", expiresAt: null,
  response: { kind: "answer", answer: {
    shortAnswer: "Ask participants what will help them take part.", whyItMatters: "People need different ways to contribute.",
    sources: [], limits: [], nextActions: [],
  } },
};

describe("owner ASK response presentation", () => {
  it("preserves complete answers and research sources while escaping generated markup", () => {
    const longAnswer = "Full response. ".repeat(400) + "Final sentence <script>alert(1)</script>";
    const html = renderToStaticMarkup(createElement(AskRecordDetail, { record: { ...record, response: { kind: "answer", answer: {
      shortAnswer: longAnswer, whyItMatters: "", limits: ["Check the current source."], nextActions: [], sources: [],
      publicResearch: { heading: "Public sources", note: "Research completed.", sources: [{ title: "Original source", url: "https://example.org/source" }] },
    } } } }));
    expect(html).toContain("Final sentence &lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).toContain('href="https://example.org/source"');
    expect(html).toContain("Check the current source.");
  });
  it("shows refusals and unavailable responses without inventing an answer or leaking an omitted question", () => {
    const refusal = renderToStaticMarkup(createElement(AskRecordDetail, { record: { ...record, question: null, questionOmittedReason: "private_information", status: "refused", response: { kind: "refusal", safety: { message: "Please remove private details.", redirect: { label: "Program resources", href: "/learn" } } } } }));
    expect(refusal).toContain("Question omitted");
    expect(refusal).toContain("Please remove private details.");
    expect(refusal).not.toContain(record.question!);
    const unavailable = renderToStaticMarkup(createElement(AskRecordDetail, { record: { ...record, status: "unavailable", response: { error: "The answer service is unavailable." } } }));
    expect(unavailable).toContain("The answer service is unavailable.");
    expect(unavailable).not.toContain("Ask participants");
  });
  it("keeps an unsafe stored link readable without making it executable", () => {
    const html = renderToStaticMarkup(createElement(AskRecordDetail, { record: { ...record, response: { kind: "refusal", safety: { message: "A link needs repair.", redirect: { label: "Referenced item", href: "javascript:alert(1)" } } } } }));
    expect(html).toContain("Referenced item");
    expect(html).not.toContain('href="javascript:');
  });
  it("distinguishes unavailable records, temporary storage, and a failed record write from a successful empty list", () => {
    const failedLoad = renderToStaticMarkup(createElement(AskRecordsClient, { initialData: null, initialError: "The record service could not be reached." }));
    expect(failedLoad).toContain("Records have not been loaded.");
    expect(failedLoad).not.toContain("No kept ASK response records were found.");
    const temporary = renderToStaticMarkup(createElement(AskRecordsClient, { initialData: { records: [record], nextCursor: null, recording: { backend: "memory", durable: false, retentionDays: null, lastWriteFailure: { at: "2026-09-07T20:59:00.000Z", code: "record_write_failed" } } } }));
    expect(temporary).toContain("can be lost when it restarts");
    expect(temporary).toContain("There is no automatic expiry");
    expect(temporary).toContain("may be missing that response");
  });
});
