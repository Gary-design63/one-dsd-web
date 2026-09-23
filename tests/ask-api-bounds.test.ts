import { meetingArtifact } from "./helpers/practice-artifact-fixtures";
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const calls = vi.hoisted(() => ({ ask: vi.fn() }));
vi.mock("@/lib/intelligence/orchestrator", () => ({ ask: calls.ask, paused: async () => false, PAUSED_MESSAGE: "Paused." }));
vi.mock("@/lib/auth/request", () => ({ ownerFromRequest: async () => null }));
vi.mock("@/lib/security/rate-limit", () => ({ consumeRequestLimit: async () => ({ allowed: true }), rateLimitHeaders: () => ({}) }));
import { POST } from "@/app/api/ask/route";
import { STAFF_WRITE_CLOSED_CODE } from "@/lib/product/staff-lock";

function request(body: unknown) {
  return new NextRequest("http://localhost:3115/api/ask", {
    method: "POST", headers: { origin: "http://localhost:3115", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("ASK request boundaries", () => {
  it("refuses every staff Ask write without calling the typed pipeline", async () => {
    const response = await POST(request({ question: "Why?", history: [{ question: "What is two plus two?", answer: "4" }] }));
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: STAFF_WRITE_CLOSED_CODE });
    expect(calls.ask).not.toHaveBeenCalled();
  });

  it("does not accept a review draft from staff", async () => {
    const body = { question: "Draft: Send this form by Friday.", pathId: "gp-9", mode: "review", researchMode: "program_only" };
    expect((await POST(request(body))).status).toBe(403);
    expect(calls.ask).not.toHaveBeenCalled();
  });

  it("does not persist a prior practice draft from staff", async () => {
    expect((await POST(request({ question: "Add remote contributions.", priorArtifact: meetingArtifact() }))).status).toBe(403);
    expect(calls.ask).not.toHaveBeenCalled();
  });
});
