import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addBusinessDays, isOverdue } from "@/lib/consult/business-days";
import { resetConsultMemoryStoreForTests, getConsultStore, leaderCanSee } from "@/lib/consult/store";
import {
  applyConsultantUpdate,
  leaderLinkFor,
  leaderView,
  requesterView,
  resendRequesterLink,
  submitRequest,
  summarize,
  sweepOverdue,
  withdrawRequest,
} from "@/lib/consult/service";
import { CreateRequestSchema, type CreateRequestInput } from "@/lib/consult/types";
import { requesterToken } from "@/lib/consult/tokens";
import { POST as submitRoute } from "@/app/api/consult/requests/route";
import { PATCH as updateRoute } from "@/app/api/consultant/consult/[id]/route";
import { POST as linkRoute } from "@/app/api/consultant/consult/[id]/link/route";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";

const BASE: CreateRequestInput = CreateRequestSchema.parse({
  requesterName: "Pat Rivera",
  requesterEmail: "Pat.Rivera@example.state.mn.us",
  requesterUnit: "Policy Unit",
  supervisorName: "Sam Lee",
  supervisorEmail: "sam.lee@example.state.mn.us",
  managerEmail: "morgan.cho@example.state.mn.us",
  workTitle: "Waiver notice redesign",
  supportType: "equity_embed_review",
  timing: "within_2_weeks",
  situation: "We are rewriting a notice that goes to participants and want to check it for access.",
  goals: "A short list of questions to ask before we finalize it.",
  confirmsGeneralWork: true,
});

beforeEach(() => {
  resetConsultMemoryStoreForTests();
  resetStoreForTests();
  vi.stubEnv("CONSULT_NOTIFY_EMAIL", "consultant@example.state.mn.us");
  vi.stubEnv("PAC_OWNER_KEY", "test-owner-session-secret-at-least-32-characters");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("business days", () => {
  it("skips weekends when counting two business days", () => {
    const friday = new Date("2026-10-02T15:00:00Z");
    expect(addBusinessDays(friday, 2).toISOString().slice(0, 10)).toBe("2026-10-06");
    const monday = new Date("2026-10-05T15:00:00Z");
    expect(addBusinessDays(monday, 2).toISOString().slice(0, 10)).toBe("2026-10-07");
  });
  it("flags only unacknowledged received requests past their time", () => {
    const base = { status: "received", acknowledgedAt: null, acknowledgmentDueAt: "2026-10-01T00:00:00Z" };
    expect(isOverdue(base, new Date("2026-10-02T00:00:00Z"))).toBe(true);
    expect(isOverdue({ ...base, acknowledgedAt: "2026-09-30T00:00:00Z" }, new Date("2026-10-02T00:00:00Z"))).toBe(false);
    expect(isOverdue({ ...base, status: "in_progress" }, new Date("2026-10-02T00:00:00Z"))).toBe(false);
  });
});

describe("submitting a request", () => {
  it("records the request, a private link, and notices to the requester, supervisor, manager and consultant", async () => {
    const result = await submitRequest(BASE);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.request.id).toMatch(/^DC-\d{8}-0001$/);
    expect(result.request.requesterEmail).toBe("pat.rivera@example.state.mn.us");
    expect(result.link).toContain("/consult/requests/");
    const store = getConsultStore();
    const notices = await store.listNotices(result.request.id);
    expect(notices.map((notice) => notice.toEmail).sort()).toEqual([
      "consultant@example.state.mn.us",
      "morgan.cho@example.state.mn.us",
      "pat.rivera@example.state.mn.us",
      "sam.lee@example.state.mn.us",
    ]);
    const supervisorNotice = notices.find((notice) => notice.toEmail === "sam.lee@example.state.mn.us")!;
    expect(supervisorNotice.body).toContain("/consult/team/");
    expect(supervisorNotice.body).not.toContain("rewriting a notice");
  });

  it("numbers requests in order", async () => {
    await submitRequest(BASE);
    const second = await submitRequest(BASE);
    expect(second.ok && second.request.id).toMatch(/-0002$/);
  });

  it("refuses case numbers and Social Security numbers", async () => {
    const result = await submitRequest({ ...BASE, situation: "Client ID 12345678 needs help." });
    expect(result).toMatchObject({ ok: false, reason: "private_identifier" });
  });

  it("redirects complaint-like requests unless the requester confirms it is about the work", async () => {
    const first = await submitRequest({ ...BASE, situation: "I want to file a grievance about my team." });
    expect(first).toMatchObject({ ok: false, reason: "redirect_notice" });
    const second = await submitRequest({ ...BASE, situation: "I want to file a grievance about my team.", keepAfterRedirectNotice: true });
    expect(second.ok).toBe(true);
  });

  it("requires the confirmation and rejects the honeypot", () => {
    expect(CreateRequestSchema.safeParse({ ...BASE, confirmsGeneralWork: false }).success).toBe(false);
    expect(CreateRequestSchema.safeParse({ ...BASE, website: "spam" }).success).toBe(false);
  });
});

describe("who can see what", () => {
  it("shows supervisors only their team, managers their line, and directors everything, without the free text", async () => {
    await submitRequest(BASE);
    await submitRequest({ ...BASE, supervisorEmail: "other.sup@example.state.mn.us", managerEmail: "", workTitle: "Hiring panel review" });
    const store = getConsultStore();
    const supervisor = await leaderLinkFor(store, "sam.lee@example.state.mn.us", "Sam Lee", "supervisor");
    const manager = await leaderLinkFor(store, "morgan.cho@example.state.mn.us", null, "manager");
    const director = await leaderLinkFor(store, "director@example.state.mn.us", "Dee Director", "division_director");
    const token = (link: string) => link.split("/").pop()!;

    const sup = await leaderView(token(supervisor.link));
    expect(sup?.requests.map((row) => row.workTitle)).toEqual(["Waiver notice redesign"]);
    expect(JSON.stringify(sup)).not.toContain("rewriting a notice");
    const mgr = await leaderView(token(manager.link));
    expect(mgr?.requests).toHaveLength(1);
    const dir = await leaderView(token(director.link));
    expect(dir?.requests).toHaveLength(2);
    expect(await leaderView("x".repeat(43))).toBeNull();
    expect(leaderCanSee({ role: "supervisor", email: "nobody@example.state.mn.us" }, { supervisorEmail: "sam.lee@example.state.mn.us", managerEmail: null })).toBe(false);
  });

  it("stops a link working when access is turned off, and a new link replaces the old one", async () => {
    const store = getConsultStore();
    const first = await leaderLinkFor(store, "dep@example.state.mn.us", null, "deputy_director");
    expect(await leaderView(first.link.split("/").pop()!)).not.toBeNull();
    const second = await leaderLinkFor(store, "dep@example.state.mn.us", null, "deputy_director", { reissue: true });
    expect(second.link).not.toBe(first.link);
    expect(await leaderView(first.link.split("/").pop()!)).toBeNull();
    await store.revokePerson("dep@example.state.mn.us");
    expect(await leaderView(second.link.split("/").pop()!)).toBeNull();
  });

  it("lets a requester see their own request and nothing else", async () => {
    const result = await submitRequest(BASE);
    if (!result.ok) throw new Error("expected ok");
    const view = await requesterView(requesterToken(result.request.id));
    expect(view?.request.id).toBe(result.request.id);
    expect(await requesterView(requesterToken("DC-20260101-0001"))).toBeNull();
  });
});

describe("the consultant's work on a request", () => {
  async function created() {
    const result = await submitRequest(BASE);
    if (!result.ok) throw new Error("expected ok");
    return result.request;
  }

  it("acknowledges with an owner, records every step, and tells the requester", async () => {
    const request = await created();
    const ack = await applyConsultantUpdate(request.id, { status: "acknowledged", ownerName: "Gary Banks", noteVisibleToRequester: true });
    expect(ack.ok && ack.request.status).toBe("acknowledged");
    expect(ack.ok && ack.request.acknowledgedAt).toBeTruthy();
    const progress = await applyConsultantUpdate(request.id, { status: "in_progress", noteVisibleToRequester: true });
    expect(progress.ok).toBe(true);
    const store = getConsultStore();
    const kinds = (await store.listEvents(request.id)).map((event) => event.kind);
    expect(kinds).toEqual(["submitted", "owner_assigned", "acknowledged", "status_changed"]);
    const notices = (await store.listNotices(request.id)).filter((notice) => notice.toEmail === "pat.rivera@example.state.mn.us");
    expect(notices.length).toBeGreaterThanOrEqual(3);
  });

  it("requires an owner, a referral office and an outcome where the status calls for them", async () => {
    const request = await created();
    expect(await applyConsultantUpdate(request.id, { status: "in_progress", noteVisibleToRequester: true })).toMatchObject({ ok: false, reason: "owner_required" });
    expect(await applyConsultantUpdate(request.id, { status: "referred", ownerName: "Gary Banks", noteVisibleToRequester: true })).toMatchObject({ ok: false, reason: "referral_required" });
    expect(await applyConsultantUpdate(request.id, { status: "resolved", ownerName: "Gary Banks", noteVisibleToRequester: true })).toMatchObject({ ok: false, reason: "outcome_required" });
    const done = await applyConsultantUpdate(request.id, { status: "resolved", ownerName: "Gary Banks", outcome: "Reviewed the notice and shared three questions.", noteVisibleToRequester: true });
    expect(done.ok && done.request.closedAt).toBeTruthy();
    expect(await applyConsultantUpdate(request.id, { status: "in_progress", noteVisibleToRequester: true })).toMatchObject({ ok: false, reason: "closed" });
  });

  it("keeps internal notes away from the requester", async () => {
    const request = await created();
    await applyConsultantUpdate(request.id, { ownerName: "Gary Banks", note: "Heads-up for leaders only.", noteVisibleToRequester: false });
    const view = await requesterView(requesterToken(request.id));
    expect(view?.events.some((event) => event.note === "Heads-up for leaders only.")).toBe(false);
  });

  it("lets a requester withdraw while open", async () => {
    const request = await created();
    const token = requesterToken(request.id);
    expect((await withdrawRequest(token)).ok).toBe(true);
    expect((await withdrawRequest(token)).ok).toBe(false);
  });
});

describe("accountability", () => {
  it("flags an unacknowledged request once and notifies the deputy director and consultant", async () => {
    const request = await submitRequest(BASE);
    if (!request.ok) throw new Error("expected ok");
    const store = getConsultStore();
    await leaderLinkFor(store, "dep@example.state.mn.us", null, "deputy_director");
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.parse(request.request.acknowledgmentDueAt) + 3_600_000));
    try {
      expect(await sweepOverdue()).toEqual({ flagged: 1 });
      expect(await sweepOverdue()).toEqual({ flagged: 0 });
      const notices = (await store.listNotices(request.request.id)).filter((notice) => notice.subject.includes("is still waiting to hear back"));
      expect(notices.map((notice) => notice.toEmail).sort()).toEqual(["consultant@example.state.mn.us", "dep@example.state.mn.us"]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("summarizes counts without personal detail", async () => {
    await submitRequest(BASE);
    const store = getConsultStore();
    const summary = summarize(await store.listRequests());
    expect(summary.total).toBe(1);
    expect(summary.open).toBe(1);
    expect(summary.byStatus.received).toBe(1);
    expect(JSON.stringify(summary)).not.toContain("Pat");
  });
});

describe("the messages people receive", () => {
  const CODE = /DC-\d{8}-\d{4}/;
  const withoutLinks = (text: string) => text.replace(/https?:\/\/\S+/g, "");

  it("never shows a request number and keeps to plain, warm wording through a request's whole life", async () => {
    const result = await submitRequest(BASE);
    if (!result.ok) throw new Error("expected ok");
    const id = result.request.id;
    const store = getConsultStore();
    await leaderLinkFor(store, "dep@example.state.mn.us", null, "deputy_director");
    for (const step of [
      { status: "acknowledged", ownerName: "Gary Banks" },
      { status: "in_progress" },
      { status: "waiting_on_requester" },
      { status: "referred", referredTo: "Employee Culture" },
      { status: "resolved", outcome: "Shared three questions to ask before the notice is final." },
    ] as const) {
      const done = await applyConsultantUpdate(id, { ...step, noteVisibleToRequester: true });
      expect(done.ok).toBe(true);
    }
    expect((await resendRequesterLink(id)).ok).toBe(true);
    const notices = await store.listNotices(id);
    expect(notices.length).toBeGreaterThan(8);
    for (const notice of notices) {
      const text = withoutLinks(`${notice.subject}\n${notice.body}`);
      expect(text, notice.subject).not.toMatch(CODE);
      expect(text, notice.subject).not.toMatch(/queue/i);
      expect(text, notice.subject).not.toMatch(/\b(Status|Owner|Request ID|Request number)\s*:/i);
    }
  });

  it("sends a requester their private link again, and only for a request that exists", async () => {
    const result = await submitRequest(BASE);
    if (!result.ok) throw new Error("expected ok");
    const sent = await resendRequesterLink(result.request.id);
    expect(sent.ok && sent.link).toContain("/consult/requests/");
    const again = (await getConsultStore().listNotices(result.request.id)).filter((notice) => notice.subject === "Your private One DSD Consult link");
    expect(again).toHaveLength(1);
    expect(again[0].toEmail).toBe("pat.rivera@example.state.mn.us");
    expect(again[0].body).toContain(result.link);
    expect(await resendRequesterLink("DC-20260101-0001")).toMatchObject({ ok: false });
  });
});

describe("the web routes", () => {
  const origin = "http://localhost:3000";
  function post(path: string, body: unknown, headers: Record<string, string> = {}, method = "POST") {
    return new NextRequest(`${origin}${path}`, { method, headers: { "content-type": "application/json", origin, ...headers }, body: JSON.stringify(body) });
  }

  it("accepts a good submission, rejects a foreign origin, and reports a plain error for a bad form", async () => {
    const ok = await submitRoute(post("/api/consult/requests", BASE));
    expect(ok.status).toBe(201);
    const foreign = await submitRoute(post("/api/consult/requests", BASE, { origin: "https://elsewhere.example" }));
    expect(foreign.status).toBe(403);
    const bad = await submitRoute(post("/api/consult/requests", { ...BASE, requesterEmail: "not-an-email" }));
    expect(bad.status).toBe(400);
    expect((await bad.json()).field).toBe("requesterEmail");
  });

  it("only lets the signed-in consultant change a request", async () => {
    const created = await (await submitRoute(post("/api/consult/requests", BASE))).json();
    const unsigned = await updateRoute(post(`/api/consultant/consult/${created.id}`, { status: "acknowledged", ownerName: "Gary Banks" }, {}, "PATCH"), { params: Promise.resolve({ id: created.id }) });
    expect(unsigned.status).toBe(401);
    const cookie = `${OWNER_COOKIE}=${issueSessionCookieValue()}`;
    const signed = await updateRoute(post(`/api/consultant/consult/${created.id}`, { status: "acknowledged", ownerName: "Gary Banks" }, { cookie }, "PATCH"), { params: Promise.resolve({ id: created.id }) });
    expect(signed.status).toBe(200);
  });

  it("only lets the signed-in consultant send a requester their link again", async () => {
    const created = await (await submitRoute(post("/api/consult/requests", BASE))).json();
    const unsigned = await linkRoute(post(`/api/consultant/consult/${created.id}/link`, {}), { params: Promise.resolve({ id: created.id }) });
    expect(unsigned.status).toBe(401);
    const cookie = `${OWNER_COOKIE}=${issueSessionCookieValue()}`;
    const signed = await linkRoute(post(`/api/consultant/consult/${created.id}/link`, {}, { cookie }), { params: Promise.resolve({ id: created.id }) });
    expect(signed.status).toBe(200);
    const body = await signed.json();
    expect(body.emailed).toBe(false);
    expect(body.link).toContain("/consult/requests/");
    const missing = await linkRoute(post("/api/consultant/consult/DC-20260101-0001/link", {}, { cookie }), { params: Promise.resolve({ id: "DC-20260101-0001" }) });
    expect(missing.status).toBe(404);
  });
});
