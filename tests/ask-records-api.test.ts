import { NextRequest } from "next/server";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ owner: vi.fn() }));
vi.mock("@/lib/auth/request", () => ({ ownerFromRequest: mocks.owner }));
import { POST } from "@/app/api/ask/route";
import { GET, DELETE } from "@/app/api/consultant/ask-records/route";
import { getAskRecordsStore, listAskResponseRecords, saveAskResponseRecord } from "@/lib/intelligence/observability/ask-records";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { STAFF_WRITE_CLOSED_CODE } from "@/lib/product/staff-lock";
import { randomUUID } from "node:crypto";

function request(method: string, pathname: string, body?: unknown, origin = "http://localhost:3115") {
  return new NextRequest("http://localhost:3115" + pathname, {
    method, headers: { origin, "content-type": "application/json", "x-forwarded-for": "192.0.2.55", "user-agent": "Should not be recorded" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

function result() {
  return { kind: "answer" as const, answer: {
    shortAnswer: "Complete answer.", whyItMatters: "", sources: [], limits: [], nextActions: [],
  } };
}

async function seedOwnerRecord() {
  await saveAskResponseRecord({
    traceId: randomUUID(),
    programScope: "one-dhs",
    researchMode: "auto",
    status: "answered",
    httpStatus: 200,
    question: "Help me.",
    response: result(),
    researchStatus: "not_requested",
  });
}

beforeEach(() => {
  resetStoreForTests();
  delete process.env.PAC_ASK_RECORD_RETENTION_DAYS;
  mocks.owner.mockReset().mockResolvedValue(false);
});
afterEach(() => vi.restoreAllMocks());

describe("ASK answer recording API", () => {
  it("does not record staff Ask posts under the browse-and-download lock", async () => {
    const response = await POST(request("POST", "/api/ask", { question: "Explain it." }));
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: STAFF_WRITE_CLOSED_CODE });
    expect((await listAskResponseRecords()).records).toEqual([]);
  });

  it("rejects staff reads and deletes, then allows owner review and deletion", async () => {
    await seedOwnerRecord();
    const [record] = (await listAskResponseRecords()).records;
    expect((await GET(request("GET", "/api/consultant/ask-records"))).status).toBe(401);
    expect((await DELETE(request("DELETE", "/api/consultant/ask-records", { ids: [record.id] }))).status).toBe(401);
    mocks.owner.mockResolvedValue(true);
    const response = await GET(request("GET", "/api/consultant/ask-records"));
    expect((await response.json()).records).toHaveLength(1);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await DELETE(request("DELETE", "/api/consultant/ask-records", { ids: [record.id] }, "https://outside.example"))).status).toBe(403);
    expect(await (await DELETE(request("DELETE", "/api/consultant/ask-records", { ids: [record.id] }))).json()).toEqual({ deleted: 1 });
    expect((await listAskResponseRecords()).records).toEqual([]);
  });

  it("reports a broken records backend and rejects invalid pagination", async () => {
    mocks.owner.mockResolvedValue(true);
    expect((await GET(request("GET", "/api/consultant/ask-records?before=bad-cursor"))).status).toBe(400);
    expect((await GET(request("GET", "/api/consultant/ask-records?limit=1000"))).status).toBe(400);
    vi.spyOn(getAskRecordsStore(), "list").mockRejectedValue(new Error("private backend detail"));
    const response = await GET(request("GET", "/api/consultant/ask-records"));
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain("private backend detail");
  });
});
