import { describe, expect, it } from "vitest";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";
import { staffAskTopics } from "@/lib/content/staff-ask-topics";

describe("ASK answers beyond program retrieval", () => {
  it("retires typed staff Ask breadth; staff Ask is browse-and-download only", async () => {
    await expectStaffAskClosed();
    expect(staffAskTopics().length).toBeGreaterThan(8);
    expect(staffAskTopics().every((topic) => topic.answer.length > 0 && topic.download.kind.length > 0)).toBe(true);
  });
});
