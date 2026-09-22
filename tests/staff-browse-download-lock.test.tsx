import { readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as postAsk } from "@/app/api/ask/route";
import { POST as postIntake } from "@/app/api/intake/route";
import { POST as postIntakeId } from "@/app/api/intake/[id]/route";
import { POST as postAnalysis } from "@/app/api/equity-analysis/route";
import { POST as postFollowUp } from "@/app/api/equity-analysis/follow-ups/route";
import { POST as postSurvey } from "@/app/api/equity-analysis/survey-waves/route";
import { POST as postOutcome } from "@/app/api/program/outcomes/route";
import { GET as download } from "@/app/api/downloads/[kind]/[id]/route";
import { GET as askRecordsGet } from "@/app/api/consultant/ask-records/route";
import { GET as spCloneGet, POST as spClonePost } from "@/app/api/sp-clone-request/route";
import { POST as pageTextPost } from "@/app/api/page-text/route";
import { POST as mediaPost } from "@/app/api/media/route";
import { POST as teamPost } from "@/app/api/one-dsd/team/route";
import { GET as researchGet, POST as researchPost } from "@/app/api/consultant/research/route";
import EquityPolicyPage from "@/app/equity-policy/page";
import RegisterPage from "@/app/equity-policy/register/page";
import AnalysisPage from "@/app/equity-policy/analysis/page";
import { PathBrowse } from "@/components/path-browse";
import { StaffAskBrowse } from "@/components/staff-ask-browse";
import { LearningPracticeNotebook } from "@/components/learning-practice-notebook";
import { getPath } from "@/lib/content/paths";
import { matchStaffAskTopic, staffAskTopics } from "@/lib/content/staff-ask-topics";
import { ownerFromRequest } from "@/lib/auth/request";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { STAFF_WRITE_CLOSED_CODE, STAFF_WRITE_CLOSED_MESSAGE, staffWritesAllowed } from "@/lib/product/staff-lock";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

const CLOSED = { error: STAFF_WRITE_CLOSED_MESSAGE, code: STAFF_WRITE_CLOSED_CODE };

describe("staff browse-and-download lock", () => {
  it("keeps staff writes fail-closed", () => {
    expect(staffWritesAllowed()).toBe(false);
  });

  it.each([
    ["ask", () => postAsk()],
    ["intake", () => postIntake()],
    ["intake-id", () => postIntakeId()],
    ["equity-analysis", () => postAnalysis()],
    ["follow-ups", () => postFollowUp()],
    ["survey-waves", () => postSurvey()],
    ["outcomes", () => postOutcome()],
  ])("refuses the staff %s write without reading a body", async (_name, send) => {
    const response = await send();
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual(CLOSED);
  });

  it("publishes curated Ask topics instead of a typed composer", () => {
    const topics = staffAskTopics();
    expect(topics.length).toBeGreaterThan(8);
    expect(matchStaffAskTopic("gp-1")?.download.kind).toBe("path");
    expect(matchStaffAskTopic("equity-framework")?.download.kind).toBe("equity-framework");
    const html = renderToStaticMarkup(<StaffAskBrowse topics={topics} initialTopicId="gp-1" />);
    expect(html).toContain("Browse by kind of work");
    expect(html).toContain("Published answer");
    expect(html).not.toContain("Get an answer");
    expect(html).not.toContain("<textarea");
  });

  it("shows a published practice checklist instead of fill-and-save", () => {
    const html = renderToStaticMarkup(<PathBrowse path={getPath("gp-1")!} />);
    expect(html).toContain("Browse and download only");
    expect(html).toContain("Program or service name");
    expect(html).not.toContain("Save these notes");
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain("<input");
  });

  it("fail-closes the staff register list/export and analysis walkthrough (F-01 / F-02)", () => {
    const register = renderToStaticMarkup(RegisterPage());
    const analysis = renderToStaticMarkup(AnalysisPage());
    expect(register).toContain("This register is closed to staff writes and exports.");
    expect(register).not.toContain("Open by design");
    expect(analysis).toContain("The fill-and-save walkthrough is closed.");
    expect(analysis).not.toContain("<textarea");
  });

  it("renders the Ask page without a free-text submit field", () => {
    const source = readFileSync(path.join(process.cwd(), "app/ask/page.tsx"), "utf8");
    expect(source).toContain("StaffAskBrowse");
    expect(source).not.toContain("AskClient");
    expect(source).not.toContain("<textarea");
    const html = renderToStaticMarkup(<StaffAskBrowse topics={staffAskTopics()} initialTopicId="gp-1" />);
    expect(html).toContain("Browse by kind of work");
    expect(html).not.toContain("Get an answer");
    expect(html).not.toContain("<textarea");
  });

  it("does not load stored equity analyses on the staff policy page (F-01)", () => {
    const source = readFileSync(path.join(process.cwd(), "app/equity-policy/page.tsx"), "utf8");
    expect(source).not.toContain("loadEquityWorkspace");
    expect(source).not.toContain("listEquityAnalyses");
    expect(source).not.toContain("EquityDashboard");
    const html = renderToStaticMarkup(EquityPolicyPage());
    expect(html).toContain("Stored analyses are not listed here");
    expect(html).not.toContain("Open to all DHS staff");
    expect(html).not.toContain("<textarea");
  });

  it("does not mount AskClient or question localStorage on staff Ask (F-04)", () => {
    const askPage = readFileSync(path.join(process.cwd(), "app/ask/page.tsx"), "utf8");
    expect(askPage).not.toContain("AskClient");
    expect(askPage).not.toContain("ask-client");
    expect(askPage).not.toContain("localStorage");
    expect(askPage).not.toContain("BROWSER_STORAGE_KEYS");
  });

  it("publishes intercultural practice prompts without typing (F-02)", () => {
    const html = renderToStaticMarkup(<LearningPracticeNotebook stops={[{ id: "foundations", title: "Begin with curiosity", practice: "Examine an observation.", reflection: "What did I assume?" }]} />);
    expect(html).toContain("Browse and download only");
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain("Save on this device");
  });
});

describe("Toolkit Studio shell", () => {
  it("locks the official eight steps and has no submit fields", async () => {
    const { default: Studio } = await import("@/app/toolkit-studio/page");
    const { default: Card } = await import("@/app/toolkit-studio/[card]/page");
    const home = renderToStaticMarkup(await Studio());
    expect(home).toContain("Desired results");
    expect(home).toContain("Sustainability");
    expect(home).toContain("Scan-first");
    expect(home).toContain("Reminder channel change");
    expect(home).not.toContain("<textarea");
    expect(home).not.toContain("Get an answer");
    const card = renderToStaticMarkup(await Card({ params: Promise.resolve({ card: "reminder-channel" }) }));
    expect(card).toContain("Before the eight steps");
    expect(card).toContain("Step 7 — Alignment");
    expect(card).toContain("Step 8 — Sustainability");
    expect(card).toContain("Formal doors (not a step number)");
    expect(card).toContain("Decision Insight Panel");
    expect(card).not.toContain("<textarea");
  });
});

describe("download P0s", () => {
  it.each([
    ["equity-framework", "framework"],
    ["equity-toolkit", "companion"],
    ["brief", "somali"],
    ["library", "ext-dhs-equity-toolkit"],
    ["toolkit-studio", "insights-checklist"],
  ] as const)("serves HTML for %s/%s even if a binary renderer fails", async (kind, id) => {
    const response = await download(new NextRequest(`http://localhost/api/downloads/${kind}/${id}?format=html`), {
      params: Promise.resolve({ kind, id }),
    });
    expect(response.status, `${kind}/${id}`).toBe(200);
    const body = Buffer.from(await response.arrayBuffer()).toString("utf8");
    expect(body).toContain("<html");
    expect(body.length).toBeGreaterThan(200);
  }, 60_000);
});

describe("owner session gates (F-01 / F-02 / F-03)", () => {
  const originalKey = process.env.PAC_OWNER_KEY;
  const originalEnv = process.env.PAC_DATA_ENV;

  beforeEach(() => {
    resetStoreForTests();
    process.env.PAC_OWNER_KEY = "staff-lock-owner-key-with-32-bytes-min";
    process.env.PAC_DATA_ENV = "local";
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.PAC_OWNER_KEY;
    else process.env.PAC_OWNER_KEY = originalKey;
    if (originalEnv === undefined) delete process.env.PAC_DATA_ENV;
    else process.env.PAC_DATA_ENV = originalEnv;
  });

  function anonymous(url: string, method = "GET", body?: unknown) {
    return new NextRequest(url, {
      method,
      headers: { origin: "http://localhost", "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  it("does not treat every request as owner", async () => {
    expect(await ownerFromRequest(anonymous("http://localhost/api/consultant/ask-records"))).toBe(false);
    const token = issueSessionCookieValue();
    expect(token).toBeTruthy();
    expect(await ownerFromRequest(new NextRequest("http://localhost/api/consultant/ask-records", {
      headers: { cookie: `${OWNER_COOKIE}=${token}` },
    }))).toBe(true);
  });

  it("locks ask-records GET without an owner session", async () => {
    const response = await askRecordsGet(anonymous("http://localhost/api/consultant/ask-records"));
    expect(response.status).toBe(401);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("locks sp-clone GET and does not send ACAO *", async () => {
    const response = await spCloneGet(anonymous("http://localhost/api/sp-clone-request?trackingId=ABC123"));
    expect(response.status).toBe(401);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    const source = readFileSync(path.join(process.cwd(), "app/api/sp-clone-request/route.ts"), "utf8");
    expect(source).not.toContain("access-control-allow-origin");
    expect(source).not.toContain('"*"');
    expect((await spClonePost()).status).toBe(403);
  });

  it("closes page-text, media, and public team writes without an owner session", async () => {
    expect((await pageTextPost(anonymous("http://localhost/api/page-text", "POST", { route: "/", entries: [] }))).status).toBe(401);
    expect((await mediaPost(anonymous("http://localhost/api/media", "POST", {}))).status).toBe(401);
    const team = await teamPost(anonymous("http://localhost/api/one-dsd/team", "POST", { action: "update_workspace_summary", summary: "Synthetic." }));
    expect(team.status).toBe(403);
    expect(await team.json()).toEqual(CLOSED);
  });

  it("does not expose consultant web research without an owner session (F-03)", async () => {
    expect((await researchGet(anonymous("http://localhost/api/consultant/research"))).status).toBe(401);
    expect((await researchPost(anonymous("http://localhost/api/consultant/research", "POST", { enabled: true, mode: "auto" }))).status).toBe(401);
  });
});
