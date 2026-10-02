import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ConsultPage from "@/app/consult/page";
import RequesterPage from "@/app/consult/requests/[token]/page";
import TeamPage from "@/app/consult/team/[token]/page";
import ConsultDashboardPage from "@/app/consultant/consult/page";
import ConsultDetailPage from "@/app/consultant/consult/[id]/page";
import { getConsultStore, resetConsultMemoryStoreForTests } from "@/lib/consult/store";
import { applyConsultantUpdate, leaderLinkFor, submitRequest } from "@/lib/consult/service";
import { requesterToken } from "@/lib/consult/tokens";
import { CreateRequestSchema } from "@/lib/consult/types";

vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); }, useRouter: () => ({ refresh: () => undefined }) }));
vi.mock("@/lib/auth/owner-page", () => ({ ownerPageGuard: async () => true }));

const INPUT = CreateRequestSchema.parse({
  requesterName: "Pat Rivera", requesterEmail: "pat@example.state.mn.us", requesterUnit: "Policy Unit",
  supervisorName: "Sam Lee", supervisorEmail: "sam@example.state.mn.us", workTitle: "Waiver notice redesign",
  supportType: "access_language_check", timing: "hard_deadline", situation: "A private description of the work.", goals: "Questions to ask.", confirmsGeneralWork: true,
});

const REQUEST_CODE = /DC-\d{8}-\d{4}/;

/** What a person reads: the words on the page, without the markup, scripts, or link addresses. */
function visibleText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}

beforeEach(() => resetConsultMemoryStoreForTests());
afterEach(() => vi.unstubAllEnvs());

describe("One DSD Consult pages", () => {
  it("welcomes the person, says what happens next, and shows the form", () => {
    const html = renderToStaticMarkup(<ConsultPage />);
    const text = visibleText(html);
    expect(text).toContain("One DSD Consult");
    expect(text).toContain("within two business days");
    expect(text).toContain("voluntary");
    expect(text).toContain("Send my request");
    expect(text).toContain("What happens next");
    expect(text).toContain("When another team is the better place");
    expect(text).not.toContain("How it works");
    expect(text).not.toContain("Not what this is for");
    expect(text).not.toMatch(/queue/i);
  });

  it("shows a requester their own status and history in plain words, and a leader the status but never the description", async () => {
    const result = await submitRequest(INPUT);
    if (!result.ok) throw new Error("expected ok");
    const mine = renderToStaticMarkup(await RequesterPage({ params: Promise.resolve({ token: requesterToken(result.request.id) }) }));
    const myText = visibleText(mine);
    expect(myText).toContain("Waiver notice redesign");
    expect(myText).toContain("Received");
    expect(myText).toContain("The consultant has your request");
    expect(myText).toContain("Withdraw this request");
    expect(myText).not.toMatch(REQUEST_CODE);

    const { link } = await leaderLinkFor(getConsultStore(), "sam@example.state.mn.us", "Sam Lee", "supervisor");
    const team = renderToStaticMarkup(await TeamPage({ params: Promise.resolve({ token: link.split("/").pop()! }) }));
    const teamText = visibleText(team);
    expect(teamText).toContain("Pat Rivera");
    expect(teamText).toContain("Waiver notice redesign");
    expect(teamText).toContain("Received");
    expect(teamText).not.toContain("A private description of the work.");
    expect(teamText).not.toMatch(REQUEST_CODE);
  });

  it("tells the requester when someone has taken their request on", async () => {
    const result = await submitRequest(INPUT);
    if (!result.ok) throw new Error("expected ok");
    await applyConsultantUpdate(result.request.id, { status: "acknowledged", ownerName: "Gary Banks", noteVisibleToRequester: true });
    const text = visibleText(renderToStaticMarkup(await RequesterPage({ params: Promise.resolve({ token: requesterToken(result.request.id) }) })));
    expect(text).toContain("The consultant has acknowledged your request");
    expect(text).toContain("Gary Banks");
    expect(text).not.toMatch(REQUEST_CODE);
  });

  it("gives the consultant a dashboard and a request page named by the person and the work, not by a code", async () => {
    const result = await submitRequest(INPUT);
    if (!result.ok) throw new Error("expected ok");
    const dashboardHtml = renderToStaticMarkup(await ConsultDashboardPage({ searchParams: Promise.resolve({}) }));
    const dashboard = visibleText(dashboardHtml);
    expect(dashboard).toContain("Waiver notice redesign");
    expect(dashboard).toContain("Pat Rivera");
    expect(dashboard).toContain("Open requests");
    expect(dashboard).not.toMatch(REQUEST_CODE);
    expect(dashboard).not.toMatch(/queue/i);
    // The link to the request still works; the code lives only in the address.
    expect(dashboardHtml).toContain(`/consultant/consult/${result.request.id}`);

    const detailHtml = renderToStaticMarkup(await ConsultDetailPage({ params: Promise.resolve({ id: result.request.id }) }));
    const detail = visibleText(detailHtml);
    expect(detail).toContain("Waiver notice redesign");
    expect(detail).toContain("Pat Rivera");
    expect(detail).toContain("A private description of the work.");
    expect(detail).toContain("Send their link again");
    expect(detail).not.toMatch(REQUEST_CODE);
  });

  it("answers an unknown link with not found", async () => {
    await expect(RequesterPage({ params: Promise.resolve({ token: "z".repeat(43) }) })).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(TeamPage({ params: Promise.resolve({ token: "short" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
