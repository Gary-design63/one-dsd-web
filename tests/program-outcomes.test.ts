import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { ProgramOutcomeInputSchema, ProgramOutcomeRecordSchema } from "@/lib/program/outcome-schema";
import { listProgramOutcomes, saveProgramOutcome } from "@/lib/program/outcomes";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { POST } from "@/app/api/program/outcomes/route";

const example = () => ({ submissionId: randomUUID(), programScope: "dsd" as const, problem: "Meeting materials arrived too late to prepare.", action: "We shared an accessible agenda three days earlier.", adoptedChange: "The team now sends its agenda ahead of time.", observedResult: "Participants brought questions about the proposals.", followUp: "Revisit the approach after the next two meetings.", decision: "retain" as const, consent: true as const });
const request = (body: unknown, origin = "http://localhost:3000") => new NextRequest("http://localhost:3000/api/program/outcomes", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });
beforeEach(() => { resetStoreForTests(); vi.stubEnv("PAC_PROGRAM_OUTCOME_COLLECTION_ENABLED", "on"); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
it("requires the staff sharing choice and rejects invented verification or personal profile fields", () => {
  expect(ProgramOutcomeInputSchema.safeParse({ ...example(), consent: false }).success).toBe(false);
  expect(ProgramOutcomeInputSchema.safeParse({ ...example(), evidenceStatus: "verified" }).success).toBe(false);
  expect(ProgramOutcomeInputSchema.safeParse({ ...example(), employeeId: "12345" }).success).toBe(false);
  expect(ProgramOutcomeInputSchema.safeParse({ ...example(), evidenceUrl: "https://example.org/doc?token=private" }).success).toBe(false);
  expect(ProgramOutcomeInputSchema.safeParse({ ...example(), reviewDate: "2026-02-30" }).success).toBe(false);
});
it("persists a self-reported result and returns the same immutable receipt on retry", async () => {
  const input = example(); const first = await saveProgramOutcome(input);
  const retry = await saveProgramOutcome({ ...input, observedResult: "A changed retry should not overwrite the first account." });
  expect(retry).toEqual(first);
  expect(first.evidenceStatus).toBe("self_reported");
  expect(ProgramOutcomeRecordSchema.safeParse(first).success).toBe(true);
  expect(await listProgramOutcomes()).toEqual([first]);
});
it("rejects staff result sharing from every origin", async () => {
  expect((await POST(request(example(), "https://other.example"))).status).toBe(403);
  expect((await POST(request({ ...example(), problem: "Client ID 123456 needs help." }))).status).toBe(403);
  expect((await POST(request(example()))).status).toBe(403);
  expect(await listProgramOutcomes()).toEqual([]);
});
it("keeps staff collection closed even when the former operating switch is on", async () => { vi.stubEnv("PAC_PROGRAM_OUTCOME_COLLECTION_ENABLED", "on"); const response=await POST(request(example())); expect(response.status).toBe(403); expect(await listProgramOutcomes()).toEqual([]); });
