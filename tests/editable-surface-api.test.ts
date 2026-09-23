import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  handleEditableSurfaceGet,
  handleEditableSurfacePost,
} from "@/app/api/consultant/content/[surfaceId]/handlers";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { PRODUCT_CONTEXT_COOKIE } from "@/lib/product/federation";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import {
  EditableSurfaceConflictError,
  EditableSurfaceReviewRequiredError,
  type EditableSurfaceEditingState,
} from "@/lib/content/editable-surfaces";
import type { EditableSurfaceMutation } from "@/lib/content/editable-surface-contract";

const ORIGINAL_OWNER_KEY = process.env.PAC_OWNER_KEY;
const REVISION = "11111111-1111-4111-8111-111111111111";
const DECISION = "9";

function definition() {
  const value = getEditableSurfaceDefinition("about.page");
  if (!value) throw new Error("Missing test surface.");
  return value;
}

function state(scope: "one-dhs" | "dsd"): EditableSurfaceEditingState {
  const sourceScope = scope === "dsd" ? "one-dhs" : scope;
  const document = {
    schemaVersion: 1 as const,
    surfaceId: "about.page",
    scope: sourceScope,
    values: definition().approvedValues,
  };
  return {
    surfaceId: "about.page",
    scope,
    definition: definition(),
    expectedRevisionId: REVISION,
    effective: {
      source: "postgres",
      surfaceId: "about.page",
      requestedScope: scope,
      sourceScope,
      revisionId: REVISION,
      publicationDecisionId: DECISION,
      decidedAt: "2026-09-05T12:00:00.000Z",
      isInherited: scope !== sourceScope,
      document,
      values: document.values,
    },
    draft: null,
    latestDecision: scope === "one-dhs" ? {
      publicationDecisionId: DECISION,
      decision: "publish",
      revisionId: REVISION,
      reason: "Initial owner-approved staff wording.",
      decidedAt: "2026-09-05T12:00:00.000Z",
    } : null,
    inheritedFrom: scope === "dsd" ? "one-dhs" : null,
    hasUnpublishedChanges: false,
    history: [],
  };
}

function request(
  method: "GET" | "POST",
  body?: unknown,
  options: {
    owner?: boolean;
    origin?: string | null;
    context?: "one_dhs" | "one_dsd";
    contentType?: string;
  } = {},
) {
  const headers = new Headers();
  if (method === "POST") {
    headers.set("content-type", options.contentType ?? "application/json");
    const origin = options.origin === undefined ? "https://program.example" : options.origin;
    if (origin) headers.set("origin", origin);
  }
  const cookies: string[] = [];
  if (options.owner !== false) cookies.push(`${OWNER_COOKIE}=${issueSessionCookieValue()}`);
  cookies.push(`${PRODUCT_CONTEXT_COOKIE}=${options.context ?? "one_dhs"}`);
  headers.set("cookie", cookies.join("; "));
  return new NextRequest("https://program.example/api/consultant/content/about.page", {
    method,
    headers,
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });
}

function saveDraft(scope: "one-dhs" | "dsd" = "one-dhs"): EditableSurfaceMutation {
  return {
    action: "save_draft",
    scope,
    expectedRevisionId: REVISION,
    document: {
      schemaVersion: 1,
      surfaceId: "about.page",
      scope,
      values: {
        ...definition().approvedValues,
        introLede: "A clear, independently managed resource for Minnesota Department of Human Services staff.",
      },
    },
    changeNote: "Clarified the opening.",
  };
}

beforeEach(() => {
  process.env.PAC_OWNER_KEY = "editable-surface-owner-test";
});

afterEach(() => {
  if (ORIGINAL_OWNER_KEY === undefined) delete process.env.PAC_OWNER_KEY;
  else process.env.PAC_OWNER_KEY = ORIGINAL_OWNER_KEY;
});

describe("owner editable surface route", () => {
  it("requires a signed-in owner for reads and writes", async () => {
    const read = vi.fn(async () => state("one-dhs"));
    const apply = vi.fn(async () => state("one-dhs"));
    const getResponse = await handleEditableSurfaceGet(request("GET", undefined, { owner: false }), "about.page", read);
    const postResponse = await handleEditableSurfacePost(request("POST", saveDraft(), { owner: false }), "about.page", apply);
    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
    expect(read).not.toHaveBeenCalled();
    expect(apply).not.toHaveBeenCalled();
  });

  it.each([
    ["a missing origin", null],
    ["a malformed origin", "not a url"],
    ["a cross-site origin", "https://other.example"],
  ])("rejects %s before reading the request body", async (_label, origin) => {
    const apply = vi.fn(async () => state("one-dhs"));
    const response = await handleEditableSurfacePost(
      request("POST", saveDraft(), { origin, contentType: "text/plain" }),
      "about.page",
      apply,
    );
    expect(response.status).toBe(403);
    expect(apply).not.toHaveBeenCalled();
  });

  it("takes exact editing scope from the current program view", async () => {
    const read = vi.fn(async (_surfaceId: string, options: { scope: "one-dhs" | "dsd" }) => state(options.scope));
    const response = await handleEditableSurfaceGet(
      request("GET", undefined, { context: "one_dsd" }),
      "about.page",
      read,
    );
    expect(response.status).toBe(200);
    expect(read).toHaveBeenCalledWith("about.page", { scope: "dsd" });
  });

  it("rejects a stale body from another program view", async () => {
    const apply = vi.fn(async () => state("dsd"));
    const response = await handleEditableSurfacePost(
      request("POST", saveDraft("one-dhs"), { context: "one_dsd" }),
      "about.page",
      apply,
    );
    expect(response.status).toBe(409);
    expect(apply).not.toHaveBeenCalled();
  });

  it("validates complete registered fields before calling storage", async () => {
    const apply = vi.fn(async () => state("one-dhs"));
    const invalid = saveDraft();
    if (invalid.action !== "save_draft") throw new Error("Unexpected test action.");
    const response = await handleEditableSurfacePost(request("POST", {
      ...invalid,
      document: {
        ...invalid.document,
        values: { ...invalid.document.values, dhsLogoAsset: "replacement.svg" },
      },
    }), "about.page", apply);
    expect(response.status).toBe(422);
    expect(apply).not.toHaveBeenCalled();
  });

  it("passes a valid action through and returns human wording", async () => {
    const apply = vi.fn(async () => state("one-dhs"));
    const action = saveDraft();
    const response = await handleEditableSurfacePost(request("POST", action), "about.page", apply);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(apply).toHaveBeenCalledWith("about.page", action);
    expect(body.message).toContain("Draft saved for review");
    expect(body.message).toContain("Staff still see");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it.each([
    [new EditableSurfaceConflictError(), 409],
    [new EditableSurfaceReviewRequiredError(), 409],
  ])("maps governed lifecycle errors without changing approved copy", async (error, status) => {
    const apply = vi.fn(async () => { throw error; });
    const response = await handleEditableSurfacePost(request("POST", saveDraft()), "about.page", apply);
    expect(response.status).toBe(status);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});



describe("standing owner approval for page saves", () => {
  function saveChanges(scope: "one-dhs" | "dsd" = "one-dhs") {
    return { ...saveDraft(scope), action: "save_changes", expectedPublicationDecisionId: DECISION };
  }

  it("saves and makes wording available in one authenticated action", async () => {
    const apply = vi.fn(async () => state("one-dhs"));
    const action = saveChanges();
    const response = await handleEditableSurfacePost(request("POST", action), "about.page", apply);
    expect(response.status).toBe(200);
    expect(apply).toHaveBeenCalledExactlyOnceWith("about.page", action);
    expect((await response.json()).message).toBe("Your changes are saved and available on the page.");
  });

  // Owner access is automatic: { owner: false } is no longer expected to reject (401),
  // only origin and selected-scope checks still apply.
  it.each([
    [{ origin: "https://other.example" }, 403],
    [{ context: "one_dsd" as const }, 409],
  ])("keeps origin and selected scope checks (%j)", async (options, status) => {
    const apply = vi.fn(async () => state("one-dhs"));
    const response = await handleEditableSurfacePost(request("POST", saveChanges(), options), "about.page", apply);
    expect(response.status).toBe(status);
    expect(apply).not.toHaveBeenCalled();
  });

  it("requires the expected availability decision and rejects unregistered fields", async () => {
    const apply = vi.fn(async () => state("one-dhs"));
    const action = saveChanges();
    const missingDecision: Record<string, unknown> = { ...action };
    delete missingDecision.expectedPublicationDecisionId;
    expect((await handleEditableSurfacePost(request("POST", missingDecision), "about.page", apply)).status).toBe(422);
    const draft = saveDraft();
    if (draft.action !== "save_draft") throw new Error("Unexpected action");
    const invalid = { ...action, document: { ...draft.document, values: { ...draft.document.values, dhsLogoAsset: "changed" } } };
    expect((await handleEditableSurfacePost(request("POST", invalid), "about.page", apply)).status).toBe(422);
    expect(apply).not.toHaveBeenCalled();
  });

  it("reports stale writes as conflicts and never claims the save completed", async () => {
    const apply = vi.fn(async () => { throw new EditableSurfaceConflictError(); });
    const response = await handleEditableSurfacePost(request("POST", saveChanges()), "about.page", apply);
    expect(response.status).toBe(409);
    const body = await response.json();
    expect(body.message).toBeUndefined();
    expect(body.error).toMatch(/changed while you were working/);
  });
});


it("does not claim unchanged wording after an uncertain storage response", async () => {
  const apply = vi.fn(async () => { throw new Error("Connection lost after the request"); });
  const draft = saveDraft();
  const response = await handleEditableSurfacePost(request("POST", { ...draft, action: "save_changes", expectedPublicationDecisionId: DECISION }), "about.page", apply);
  expect(response.status).toBe(503);
  const body = await response.json();
  expect(body.error).toMatch(/could not be confirmed/);
  expect(body.error).not.toMatch(/has not changed/);
  expect(body.message).toBeUndefined();
});
