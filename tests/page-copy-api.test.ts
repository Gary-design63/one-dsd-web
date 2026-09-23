import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PageCopyConflictError } from "@/lib/content/page-copy";
import { handlePageCopyPost } from "@/app/api/consultant/page-copy/[surface]/handlers";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import {
  PAGE_BLOCK_IDS,
  PAGE_REVIEW_DIMENSIONS,
  STATIC_HOME_COPY,
  type PageBlockEditingState,
  type HomePageCopy,
  type PageCopyAction,
} from "@/lib/content/page-copy-contract";

const ORIGINAL_OWNER_KEY = process.env.PAC_OWNER_KEY;
const REVISION = "11111111-1111-4111-8111-111111111111";
const REVIEW = "33333333-3333-4333-8333-333333333333";
const DECISION = "7";

function state(): PageBlockEditingState<HomePageCopy> {
  return {
    surface: "home",
    contentItemId: PAGE_BLOCK_IDS.home,
    expectedRevisionId: REVISION,
    publishedRevisionId: REVISION,
    publicationDecisionId: DECISION,
    isPublished: true,
    hasUnpublishedChanges: false,
    copy: STATIC_HOME_COPY,
    reviews: PAGE_REVIEW_DIMENSIONS.map((dimension) => ({ reviewId: REVIEW, dimension, status: "pass", note: null })),
    canPublish: false,
    history: [{
      revisionId: REVISION,
      label: "Version 1: One DHS People, Access and Culture Program",
      publishedAt: "2026-09-05T12:00:00Z",
      isCurrent: true,
    }],
  };
}

function request(body: unknown, options: { owner?: boolean; origin?: string | null } = {}) {
  const headers = new Headers({ "content-type": "application/json" });
  const origin = options.origin === undefined ? "https://program.example" : options.origin;
  if (origin) headers.set("origin", origin);
  if (options.owner !== false) headers.set("cookie", `${OWNER_COOKIE}=${issueSessionCookieValue()}`);
  return new NextRequest("https://program.example/api/consultant/page-copy/home", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

function draft(copy: HomePageCopy = STATIC_HOME_COPY): PageCopyAction {
  return { action: "save_draft", expectedRevisionId: REVISION, copy, changeNote: "Clarified the opening." };
}

beforeEach(() => {
  process.env.PAC_OWNER_KEY = "page-copy-owner-test";
});

afterEach(() => {
  if (ORIGINAL_OWNER_KEY === undefined) delete process.env.PAC_OWNER_KEY;
  else process.env.PAC_OWNER_KEY = ORIGINAL_OWNER_KEY;
});

describe("owner page copy route", () => {
  it("requires a signed-in owner", async () => {
    const apply = vi.fn(async () => state());
    const response = await handlePageCopyPost(request(draft(), { owner: false }), "home", apply);
    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(apply).not.toHaveBeenCalled();
  });

  it.each([
    ["a missing origin", null],
    ["a malformed origin", "not a url"],
    ["a cross-site origin", "https://other.example"],
  ])("rejects %s", async (_label, origin) => {
    const apply = vi.fn(async () => state());
    const response = await handlePageCopyPost(request(draft(), { origin }), "home", apply);
    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(apply).not.toHaveBeenCalled();
  });

  it("accepts one owner save with both concurrency tokens and returns its published revision", async () => {
    const apply = vi.fn(async () => state());
    const action: PageCopyAction = { action: "save_changes", expectedRevisionId: REVISION, expectedPublicationDecisionId: DECISION, copy: STATIC_HOME_COPY, changeNote: null };
    const response = await handlePageCopyPost(request(action), "home", apply);
    expect(response.status).toBe(200);
    expect(apply).toHaveBeenCalledExactlyOnceWith("home", action);
    expect((await response.json()).message).toContain("saved and now available");
    expect((await handlePageCopyPost(request({ ...action, expectedPublicationDecisionId: undefined }), "home", apply)).status).toBe(400);
  });
  // Owner access is automatic: only origin, safe-link, and stale-state checks remain.
  it("retains origin, safe-link and stale-state checks for one-action saves", async () => {
    const action: PageCopyAction = { action: "save_changes", expectedRevisionId: REVISION, expectedPublicationDecisionId: DECISION, copy: STATIC_HOME_COPY, changeNote: null };
    const apply = vi.fn(async () => state());
    expect((await handlePageCopyPost(request(action, { origin: "https://other.example" }), "home", apply)).status).toBe(403);
    expect((await handlePageCopyPost(request({ ...action, copy: { ...STATIC_HOME_COPY, askHref: "javascript:alert(1)" } }), "home", apply)).status).toBe(422);
    expect(apply).not.toHaveBeenCalled();
    apply.mockRejectedValue(new PageCopyConflictError());
    expect((await handlePageCopyPost(request(action), "home", apply)).status).toBe(409);
  });

  it("saves a valid draft without making a publishing decision", async () => {
    const next = { ...state(), hasUnpublishedChanges: true, canPublish: false };
    const apply = vi.fn(async () => next);
    const action = draft({ ...STATIC_HOME_COPY, heroLede: "Practical support for thoughtful work across DHS." });
    const response = await handlePageCopyPost(request(action), "home", apply);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(apply).toHaveBeenCalledWith("home", action);
    expect(body.message).toContain("Draft saved for review");
    expect(body.message).toContain("Staff still see");
  });

  it.each([
    ["Markdown", { ...STATIC_HOME_COPY, heroNote: "**Important**" }],
    ["serialized text", { ...STATIC_HOME_COPY, heroNote: '{"message":"Pasted"}' }],
    ["an icon", { ...STATIC_HOME_COPY, heroNote: "Start here 🧭" }],
    ["technical product language", { ...STATIC_HOME_COPY, heroNote: "The API returns a payload." }],
    ["an unsafe link", { ...STATIC_HOME_COPY, askHref: "javascript:alert(1)" }],
  ])("rejects %s before any database call", async (_label, copy) => {
    const apply = vi.fn(async () => state());
    const response = await handlePageCopyPost(request(draft(copy)), "home", apply);
    expect(response.status).toBe(422);
    expect(apply).not.toHaveBeenCalled();
  });

  it.each<PageCopyAction>([
    { action: "record_review", revisionId: REVISION, dimension: "accessibility", status: "pass", expectedReviewId: REVIEW, note: "Keyboard review complete." },
    { action: "publish", revisionId: REVISION, expectedPublicationDecisionId: DECISION, reason: "All required reviews are complete." },
    { action: "withdraw", expectedPublishedRevisionId: REVISION, expectedPublicationDecisionId: DECISION, reason: "Temporarily remove this wording." },
    { action: "rollback", expectedPublishedRevisionId: REVISION, targetRevisionId: REVISION, expectedPublicationDecisionId: DECISION, reason: "Restore approved wording." },
  ])("passes the explicit $action decision through the owner boundary", async (action) => {
    const apply = vi.fn(async () => state());
    const response = await handlePageCopyPost(request(action), "home", apply);
    expect(response.status).toBe(200);
    expect(apply).toHaveBeenCalledWith("home", action);
  });
});
