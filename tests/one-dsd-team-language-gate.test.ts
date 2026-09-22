import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST as teamPost } from "@/app/api/consultant/one-dsd-team/route";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import {
  inspectCollaborationText,
  OneDsdTeamMutationSchema,
  type OneDsdTeamMutation,
} from "@/lib/collaboration/schema";
import { applyOneDsdTeamMutation, readOneDsdTeamWorkspace } from "@/lib/collaboration/store";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";

const priorOwnerKey = process.env.PAC_OWNER_KEY;

beforeEach(() => {
  resetStoreForTests();
  process.env.PAC_OWNER_KEY = "test-owner-key";
});

afterEach(() => {
  if (priorOwnerKey === undefined) delete process.env.PAC_OWNER_KEY;
  else process.env.PAC_OWNER_KEY = priorOwnerKey;
});

function reply(body: string): OneDsdTeamMutation {
  return {
    action: "reply",
    threadId: "thread_welcome",
    body,
    idempotencyKey: "reply_language_gate_12345",
  };
}

describe("One DSD Team language and presentation gate", () => {
  it.each([
    ["heading", "# Important update"],
    ["bulleted list", "- First item"],
    ["parenthesized list", "1) First item"],
    ["blockquote", "> Quoted guidance"],
    ["bold text", "This is **important** today."],
    ["italic text", "This is _important_ today."],
    ["struck text", "This is ~~obsolete~~ now."],
    ["inline code", "Enter `npm run build` here."],
    ["formatted link", "Read [this page](https://example.org)."],
    ["reference link", "Read [this page][guide]."],
    ["table", "| Topic | Next step |"],
    ["horizontal rule", "---"],
    ["emoji", "Thank you for helping 😊"],
    ["decorative arrow", "Learning → action"],
    ["serialized object", '{"title":"Pasted content"}'],
    ["structured data", "title: First item\nstatus: open"],
    ["markup", "<section>Private text</section>"],
    ["technical wording", "The API endpoint returns a JSON payload."],
    ["tool self-identification", "As an AI language model, I recommend this step."],
    ["direct tool self-identification", "I am an AI assistant."],
    ["provider as speaker", "According to ChatGPT, staff should do this."],
    ["embedded serialized data", 'Here is the record: {"title":"Pasted content"}'],
    ["hidden direction control", "A safe-looking entry\u202e"],
  ])("rejects %s", (_label, value) => {
    const parsed = OneDsdTeamMutationSchema.safeParse(reply(value));
    expect(parsed.success).toBe(false);
    expect(inspectCollaborationText(value)).not.toBeNull();
  });

  it.each([
    "Read more at http://example.org.",
    "Open javascript:alert(1).",
    "Open data:text/html,hello.",
    "Open file:///C:/private.txt.",
    "Visit www.example.org for details.",
    "Use //example.org/notes.",
    "Open https://name:password@example.org/private.",
    "Open https://127.0.0.1/private.",
    "Open https://192.168.1.5/private.",
  ])("rejects an unsafe or ambiguous link: %s", (value) => {
    expect(OneDsdTeamMutationSchema.safeParse(reply(value)).success).toBe(false);
    expect(inspectCollaborationText(value)?.code).toBe("unsafe_link");
  });

  it.each([
    "Contact jane.doe@example.org for help.",
    "Call 612-555-0199 for the details.",
    "The SSN is 123-45-6789.",
    "The client ID is ABC-12345.",
    "The employee number is 45321.",
    "The medical record number is MRN-77881.",
    "DOB 01/02/1990.",
    "My coworker Jane Doe will attend.",
    "My client received a medical diagnosis.",
    "My supervisor received a performance review.",
  ])("rejects private or identifying details: %s", (value) => {
    expect(OneDsdTeamMutationSchema.safeParse(reply(value)).success).toBe(false);
    expect(inspectCollaborationText(value)?.code).toBe("private_information");
  });

  it("rejects staff ranking or profiling and preserves the workspace when the store is called directly", async () => {
    const value = "Rank staff by equity maturity and participation.";
    expect(OneDsdTeamMutationSchema.safeParse(reply(value)).success).toBe(false);
    expect(inspectCollaborationText(value)?.code).toBe("surveillance");

    const before = await readOneDsdTeamWorkspace();
    await expect(applyOneDsdTeamMutation(reply(value))).rejects.toMatchObject({
      code: "unsafe_content",
    });
    const after = await readOneDsdTeamWorkspace();
    expect(after.revision).toBe(before.revision);
    expect(after.posts).toEqual(before.posts);
  });

  it.each([
    "We should discuss how AI could support accessible communication.",
    "The committee wants to study bias in artificial intelligence.",
    "Staff need clear guidance on responsible use of generative AI.",
    "We can compare published research from OpenAI and Anthropic.",
    "We should review AI-generated images for bias before using them.",
    "A secure public resource is available at https://www.microsoft.com/en-us/microsoft-teams/group-chat-software.",
    "A secure search is available at https://example.org/search?topic=access&format=plain.",
    "I was trained to lead accessible meetings.",
    "I am an AI policy lead, and I want to discuss responsible use.",
    "We may use this as AI policy guidance.",
  ])("allows legitimate discussion written in plain language: %s", (value) => {
    const parsed = OneDsdTeamMutationSchema.safeParse(reply(value));
    expect(parsed.success).toBe(true);
    expect(inspectCollaborationText(value)).toBeNull();
  });

  it("applies the gate to every free-text mutation field", () => {
    const unsafe = "As an AI language model, I wrote this.";
    const mutations: unknown[] = [
      { action: "update_workspace_summary", summary: unsafe },
      { action: "update_channel", channelId: "general", purpose: unsafe },
      { action: "create_thread", channelId: "general", title: unsafe, body: "Plain opening.", idempotencyKey: "thread_gate_title_123" },
      { action: "create_thread", channelId: "general", title: "Plain title", body: unsafe, idempotencyKey: "thread_gate_body_1234" },
      { action: "reply", threadId: "thread_welcome", body: unsafe, idempotencyKey: "reply_gate_body_12345" },
      { action: "edit_post", postId: "post_welcome", body: unsafe },
      { action: "update_meeting", occurrenceId: "meeting_general_next", title: unsafe, scheduleNote: "Monthly", accessNote: "Join in the agreed place.", status: "planning" },
      { action: "update_meeting", occurrenceId: "meeting_general_next", title: "Monthly meeting", scheduleNote: unsafe, accessNote: "Join in the agreed place.", status: "planning" },
      { action: "update_meeting", occurrenceId: "meeting_general_next", title: "Monthly meeting", scheduleNote: "Monthly", accessNote: unsafe, status: "planning" },
      { action: "update_action", actionItemId: "action_review_space", title: unsafe, ownerLabel: "Program steward", dueNote: "Before the next meeting", status: "planned" },
      { action: "update_action", actionItemId: "action_review_space", title: "Review the space", ownerLabel: unsafe, dueNote: "Before the next meeting", status: "planned" },
      { action: "update_action", actionItemId: "action_review_space", title: "Review the space", ownerLabel: "Program steward", dueNote: unsafe, status: "planned" },
      { action: "submit_feedback", feedbackId: "feedback_workspace", response: unsafe, idempotencyKey: "feedback_gate_12345" },
    ];

    for (const mutation of mutations) {
      expect(OneDsdTeamMutationSchema.safeParse(mutation).success).toBe(false);
    }
  });

  it("fails closed when the store is called directly and does not change the workspace", async () => {
    const before = await readOneDsdTeamWorkspace();
    await expect(applyOneDsdTeamMutation(reply("- Hidden formatted instruction"))).rejects.toMatchObject({
      code: "unsafe_content",
    });
    const after = await readOneDsdTeamWorkspace();
    expect(after.revision).toBe(before.revision);
    expect(after.posts).toEqual(before.posts);
  });

  it("returns a plain, useful error at the authenticated mutation boundary", async () => {
    const token = issueSessionCookieValue();
    expect(token).toBeTruthy();
    const response = await teamPost(
      new NextRequest("http://localhost/api/consultant/one-dsd-team", {
        method: "POST",
        body: JSON.stringify(reply("As an AI language model, I recommend this.")),
        headers: {
          "content-type": "application/json",
          origin: "http://localhost",
          cookie: `${OWNER_COOKIE}=${token}`,
        },
      }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Write in your own words rather than pasting text that speaks as a digital tool.",
    });
  });

  it("uses a warm practice explanation without build-status language", () => {
    const source = readFileSync(
      path.resolve(__dirname, "..", "components", "one-dsd-team-client.tsx"),
      "utf8",
    );
    expect(source).toContain("a place for the One DSD Team to learn and practice together");
    expect(source).toContain("Until the committee agrees to use this space for official work");
    expect(source).toContain("separate from Microsoft Teams");
    expect(source).toContain("separate from Minnesota Department of Human Services");
    expect(source).not.toMatch(/still being tested|sample entries|may be cleared|build status/i);
    expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
