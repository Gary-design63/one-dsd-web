import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as teamGet, POST as teamPost } from "@/app/api/consultant/one-dsd-team/route";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { getMicrosoftBridgeState } from "@/lib/collaboration/microsoft-boundary";
import { ONE_DSD_TEAM_SEED } from "@/lib/collaboration/seed";
import { applyOneDsdTeamMutation, readOneDsdTeamWorkspace } from "@/lib/collaboration/store";
import { PRIMARY_NAV, PROGRAM, ROUTES } from "@/lib/constants";
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

describe("One DSD Team Stage Zero workspace", () => {
  it("uses the exact program, committee, division, and administration names", () => {
    expect(ONE_DSD_TEAM_SEED.workspace.name).toBe("One DSD Team");
    expect(ONE_DSD_TEAM_SEED.workspace.programName).toBe("One DSD People, Access and Culture Program");
    expect(ONE_DSD_TEAM_SEED.workspace.scopeLabel).toContain("Disability Services Division");
    expect(ONE_DSD_TEAM_SEED.workspace.scopeLabel).toContain("Aging and Disability Services Administration");
    expect(PROGRAM.fullName).toBe("One DHS People, Access and Culture Program");
    expect(ONE_DSD_TEAM_SEED.workspace.status).toBe("preview");
    expect(PRIMARY_NAV.map((item) => String(item.href))).not.toContain(ROUTES.oneDsdTeam.href);
  });

  it("contains the required working areas and both monthly meeting series", () => {
    expect(ONE_DSD_TEAM_SEED.channels.map((item) => item.name)).toEqual([
      "General",
      "Monthly meetings",
      "Open Hours",
      "Learning together",
      "Staff engagement",
      "Work in progress",
    ]);
    expect(ONE_DSD_TEAM_SEED.meetingSeries).toHaveLength(2);
    expect(ONE_DSD_TEAM_SEED.meetingSeries.every((item) => item.cadence === "monthly")).toBe(true);
  });

  it("marks every seeded record as sample content", () => {
    const collections = Object.values(ONE_DSD_TEAM_SEED).filter(Array.isArray) as Array<Array<{ sample?: boolean }>>;
    const records = collections.flat().filter((item) => item && typeof item === "object" && "sample" in item);
    expect(records.length).toBeGreaterThan(10);
    expect(records.every((item) => item.sample === true)).toBe(true);
  });

  it("keeps the Microsoft route disconnected and the native workspace authoritative", () => {
    expect(getMicrosoftBridgeState()).toMatchObject({
      status: "off",
      connected: false,
      readsExternalData: false,
      writesExternalData: false,
      nativeWorkspaceIsAuthoritative: true,
    });
  });

  it("creates a discussion once when the same request is repeated", async () => {
    const mutation = {
      action: "create_thread" as const,
      channelId: "general",
      title: "Test discussion",
      body: "This is general synthetic test content.",
      idempotencyKey: "thread_test_12345",
    };
    await applyOneDsdTeamMutation(mutation);
    await applyOneDsdTeamMutation(mutation);
    const state = await readOneDsdTeamWorkspace();
    expect(state.threads.filter((item) => item.title === "Test discussion")).toHaveLength(1);
  });

  it("rejects private identifying information", async () => {
    await expect(
      applyOneDsdTeamMutation({
        action: "reply",
        threadId: "thread_welcome",
        body: "The SSN is 123-45-6789.",
        idempotencyKey: "reply_test_12345",
      }),
    ).rejects.toMatchObject({ code: "unsafe_content" });
  });

  it("rejects a mutation without an owner session", async () => {
    const request = new NextRequest("http://localhost/api/consultant/one-dsd-team", {
      method: "POST",
      body: JSON.stringify({ action: "update_workspace_summary", summary: "A valid test summary." }),
      headers: { "content-type": "application/json", origin: "http://localhost" },
    });
    expect((await teamPost(request)).status).toBe(401);
  });

  it("rejects an owner mutation without same-origin browser provenance", async () => {
    const token = issueSessionCookieValue();
    expect(token).toBeTruthy();
    const body = JSON.stringify({ action: "update_workspace_summary", summary: "A valid test summary." });
    const missing = new NextRequest("http://localhost/api/consultant/one-dsd-team", {
      method: "POST",
      body,
      headers: { "content-type": "application/json", cookie: `${OWNER_COOKIE}=${token}` },
    });
    const crossOrigin = new NextRequest("http://localhost/api/consultant/one-dsd-team", {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        origin: "https://other.example",
        cookie: `${OWNER_COOKIE}=${token}`,
      },
    });
    expect((await teamPost(missing)).status).toBe(403);
    expect((await teamPost(crossOrigin)).status).toBe(403);
  });

  it("keeps reads returning only the information the page uses", async () => {
    const noCookie = await teamGet(new NextRequest("http://localhost/api/consultant/one-dsd-team"));
    expect(noCookie.status).toBe(401);
    expect(noCookie.headers.get("cache-control")).toBe("no-store");

    const token = issueSessionCookieValue();
    expect(token).toBeTruthy();
    const allowed = await teamGet(
      new NextRequest("http://localhost/api/consultant/one-dsd-team", {
        headers: { cookie: `${OWNER_COOKIE}=${token}` },
      }),
    );
    expect(allowed.status).toBe(200);
    expect(allowed.headers.get("cache-control")).toBe("no-store");
    const payload = await allowed.json();
    expect(Object.keys(payload.workspace).sort()).toEqual([
      "actionItems",
      "channels",
      "feedback",
      "meetingOccurrences",
      "posts",
      "threads",
      "workspace",
    ]);
    expect(JSON.stringify(payload)).not.toMatch(
      /adapter|automationPolicies|automationRuns|environment|notificationDeliveries|processedKeys/i,
    );
  });

  it("accepts an owner mutation and returns the revised workspace", async () => {
    const token = issueSessionCookieValue();
    expect(token).toBeTruthy();
    const request = new NextRequest("http://localhost/api/consultant/one-dsd-team", {
      method: "POST",
      body: JSON.stringify({ action: "update_workspace_summary", summary: "A revised synthetic purpose." }),
      headers: {
        "content-type": "application/json",
        origin: "http://localhost",
        cookie: `${OWNER_COOKIE}=${token}`,
      },
    });
    const response = await teamPost(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const payload = await response.json();
    expect(payload.workspace.workspace.summary).toBe("A revised synthetic purpose.");
    expect(payload.workspace.workspace.sample).toBeUndefined();
  });
});
