import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as runScheduledCycle } from "@/app/api/cron/orchestrate/route";
import { PATCH as updateQueueRoute } from "@/app/api/consultant/queue/[id]/route";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import * as O from "@/lib/intelligence/orchestrator";
import { sweepExpiredConsultations } from "@/lib/intelligence/agents/intake";
import { invalidatePolicyCache, setPolicy } from "@/lib/intelligence/policy";
import { runTool, ToolDenied } from "@/lib/intelligence/tools/runtime";
import { OWNER_STATUS_REASON_TEMPLATES } from "@/lib/trust/owner-queue-text";
import type {
  ConsultationRecord,
  ConsultRequest,
  ConsultRequestTombstone,
} from "@/lib/intelligence/consult/schema";

const INPUT = {
  program_context: "one_dsd" as const,
  dsd_eligibility_attestation: true as const,
  participation_notice_id: "dsd_consultation_request" as const,
  participation_notice_version: "1.0.0",
  work_name: "Accessible service notice",
  stage: "designing" as const,
  goals: "Make a service notice understandable and usable before the wording is finalized.",
  desired_support_type: ["access_language_check" as const],
  timing_urgency: "within_2_weeks" as const,
  situation: "The DSD team wants a second perspective on access, language, and community input before release.",
  share_confirmation: true as const,
};

const IDEMPOTENCY_KEY = "consultation-test-idempotency-key-0001";
const ORIGINAL_TRACKING_SECRET = process.env.PAC_CONSULTATION_TRACKING_SECRET;
const ORIGINAL_CRON_SECRET = process.env.CRON_SECRET;
const ORIGINAL_OWNER_KEY = process.env.PAC_OWNER_KEY;
const OUTSIDE_DSD_REDIRECT = OWNER_STATUS_REASON_TEMPLATES[0];
async function createRequest(input: typeof INPUT = INPUT) {
  const result = await O.intakeSubmit(input, IDEMPOTENCY_KEY);
  if (result.kind !== "created") throw new Error(`Expected created, received ${result.kind}.`);
  return result;
}

describe("DSD consultation trust boundaries", () => {
  beforeEach(() => {
    resetStoreForTests();
    invalidatePolicyCache();
    process.env.PAC_CONSULTATION_TRACKING_SECRET = "test-consultation-tracking-secret-at-least-32-chars";
    process.env.CRON_SECRET = "test-cron-secret-at-least-32-characters";
    process.env.PAC_OWNER_KEY = "test-owner-session-secret-at-least-32-characters";
  });

  afterEach(() => {
    vi.useRealTimers();
    if (ORIGINAL_TRACKING_SECRET === undefined) delete process.env.PAC_CONSULTATION_TRACKING_SECRET;
    else process.env.PAC_CONSULTATION_TRACKING_SECRET = ORIGINAL_TRACKING_SECRET;
    if (ORIGINAL_CRON_SECRET === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = ORIGINAL_CRON_SECRET;
    if (ORIGINAL_OWNER_KEY === undefined) delete process.env.PAC_OWNER_KEY;
    else process.env.PAC_OWNER_KEY = ORIGINAL_OWNER_KEY;
    invalidatePolicyCache();
  });

  it("returns a one-time 256-bit tracking credential but stores only its hash", async () => {
    const created = await createRequest();
    expect(created.tracking_secret).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const stored = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);
    expect(stored).not.toBeNull();
    expect(stored).not.toHaveProperty("access_key");
    expect(stored?.access_key_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(stored)).not.toContain(created.tracking_secret);

    await expect(O.intakeTrack(created.request.request_id, created.tracking_secret)).resolves.toMatchObject({
      request_id: created.request.request_id,
      status: "pending_eligibility_review",
    });
    await expect(O.intakeTrack(created.request.request_id, "A".repeat(43))).resolves.toBeNull();
  });

  it("rotates a requester credential once, rejects stale or incorrect authority, and never audits either secret", async () => {
    const created = await createRequest();

    await expect(O.intakeRotateKey(
      created.request.request_id,
      "A".repeat(43),
      created.request.version,
    )).resolves.toEqual({ kind: "not_found" });
    await expect(O.intakeRotateKey(
      created.request.request_id,
      created.tracking_secret,
      created.request.version + 1,
    )).resolves.toMatchObject({ kind: "conflict" });

    const rotated = await O.intakeRotateKey(
      created.request.request_id,
      created.tracking_secret,
      created.request.version,
    );
    expect(rotated).toMatchObject({
      kind: "rotated",
      request: {
        request_id: created.request.request_id,
        version: created.request.version + 1,
      },
    });
    if (rotated.kind !== "rotated") throw new Error(`Expected rotated, received ${rotated.kind}.`);

    await expect(O.intakeTrack(created.request.request_id, created.tracking_secret)).resolves.toBeNull();
    await expect(O.intakeTrack(created.request.request_id, rotated.access_key)).resolves.toMatchObject({
      request_id: created.request.request_id,
      version: created.request.version + 1,
    });

    const persisted = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);
    expect(persisted?.access_key_hash).toMatch(/^[a-f0-9]{64}$/);
    const audit = JSON.stringify(await getStore().listAudit());
    expect(audit).not.toContain(created.tracking_secret);
    expect(audit).not.toContain(rotated.access_key);
    expect(audit).not.toContain(persisted?.access_key_hash);
  });

  it("keeps a self-attested request outside the active queue until an owner confirms DSD scope", async () => {
    const created = await createRequest();
    await expect(O.eligibilityQueue()).resolves.toEqual([
      expect.objectContaining({ request_id: created.request.request_id, eligibility_status: "pending" }),
    ]);
    await expect(O.queue()).resolves.toEqual([]);

    const admitted = await O.queueUpdate(created.request.request_id, { eligibility_decision: "confirmed_dsd" });
    expect(admitted).toMatchObject({ ok: true, request: { status: "received", eligibility_status: "confirmed_dsd" } });
    await expect(O.eligibilityQueue()).resolves.toEqual([]);
    await expect(O.queue()).resolves.toEqual([
      expect.objectContaining({ request_id: created.request.request_id, status: "received" }),
    ]);
  });

  it("requires a useful redirect and never admits an outside-DSD request", async () => {
    const created = await createRequest();
    await expect(O.queueUpdate(created.request.request_id, { eligibility_decision: "not_dsd" })).resolves.toMatchObject({
      ok: false,
    });
    const redirected = await O.queueUpdate(created.request.request_id, {
      eligibility_decision: "not_dsd",
      status_reason: OUTSIDE_DSD_REDIRECT,
    });
    expect(redirected).toMatchObject({ ok: true, request: { status: "declined", eligibility_status: "not_dsd" } });
    await expect(O.queue()).resolves.toEqual([]);
  });

  it("makes retries idempotent without storing the raw credential and rejects changed payloads", async () => {
    const first = await createRequest();
    const retry = await createRequest();
    expect(retry.duplicate).toBe(true);
    expect(retry.request.request_id).toBe(first.request.request_id);
    expect(retry.tracking_secret).toBe(first.tracking_secret);

    const changed = await O.intakeSubmit({ ...INPUT, work_name: "A different DSD request" }, IDEMPOTENCY_KEY);
    expect(changed).toMatchObject({ kind: "conflict" });
    expect(await getStore().list<ConsultRequest>("consult_request")).toHaveLength(1);
  });

  it("rejects non-DSD and Tribal consultation submissions before persistence", async () => {
    const outside = await O.intakeSubmit({ ...INPUT, dsd_eligibility_attestation: false }, "outside-dsd-test-key-0000000001");
    expect(outside).toMatchObject({ kind: "invalid" });

    const tribal = await O.intakeSubmit(
      { ...INPUT, affected_populations: ["tribal_nation" as const] },
      "tribal-gate-test-key-0000000001",
    );
    expect(tribal).toMatchObject({ kind: "refusal", field: "affected_populations" });
    expect(await getStore().list<ConsultRequest>("consult_request")).toEqual([]);
  });

  it("redacts every expired S3 field to a minimal authenticated tombstone", async () => {
    const created = await createRequest();
    const noted = await O.queueUpdate(created.request.request_id, {
      owner_notes: "General consultation planning note",
    });
    expect(noted.ok).toBe(true);
    if (!noted.ok || !noted.request) throw new Error("Expected the owner note fixture to be saved.");
    const expired = noted.request;
    const sweepAt = new Date(Date.parse(expired.retention_expires_at) + 1_000);
    vi.useFakeTimers();
    vi.setSystemTime(sweepAt);

    const sweep = await sweepExpiredConsultations(sweepAt);
    expect(sweep).toMatchObject({
      examined: 1,
      redacted: [expired.request_id],
      already_redacted: 0,
    });
    const tombstone = await getStore().get<ConsultRequestTombstone>("consult_request", expired.request_id);
    expect(Object.keys(tombstone!).sort()).toEqual([
      "access_key_hash",
      "access_key_version",
      "record_type",
      "redacted_at",
      "request_id",
      "retention_expires_at",
      "retention_policy_id",
      "status",
      "updated_at",
      "version",
    ]);
    expect(tombstone).toMatchObject({
      record_type: "consultation_tombstone",
      request_id: expired.request_id,
      status: "expired",
      access_key_hash: expired.access_key_hash,
      redacted_at: sweepAt.toISOString(),
    });
    const serialized = JSON.stringify(tombstone);
    expect(serialized).not.toContain(INPUT.work_name);
    expect(serialized).not.toContain(INPUT.goals);
    expect(serialized).not.toContain(INPUT.situation);
    expect(serialized).not.toContain("PRIVATE OWNER NOTE");
    expect(serialized).not.toContain(created.tracking_secret);
  });

  it("returns only an authenticated expired status after redaction", async () => {
    const created = await createRequest();
    const sweepAt = new Date(Date.parse(created.request.retention_expires_at) + 1_000);
    vi.useFakeTimers();
    vi.setSystemTime(sweepAt);
    await sweepExpiredConsultations(sweepAt);

    const view = await O.intakeTrack(created.request.request_id, created.tracking_secret);
    expect(view).toEqual({
      request_id: created.request.request_id,
      status: "expired",
      updated_at: sweepAt.toISOString(),
      version: 2,
      can_withdraw: false,
      can_correct: false,
      can_rotate_key: false,
      history: [{ at: sweepAt.toISOString(), status: "expired" }],
    });
    expect(JSON.stringify(view)).not.toContain(INPUT.work_name);
    await expect(O.intakeTrack(created.request.request_id, "A".repeat(43))).resolves.toBeNull();
    await expect(O.intakeRotateKey(
      created.request.request_id,
      created.tracking_secret,
      2,
    )).resolves.toMatchObject({ kind: "not_rotatable" });
  });

  it("makes the retention sweep idempotent", async () => {
    const created = await createRequest();
    const now = new Date(Date.parse(created.request.retention_expires_at) + 1_000);
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const first = await sweepExpiredConsultations(now);
    const afterFirst = await getStore().get<ConsultationRecord>("consult_request", created.request.request_id);
    const second = await sweepExpiredConsultations(new Date(now.getTime() + 86_400_000));
    const afterSecond = await getStore().get<ConsultationRecord>("consult_request", created.request.request_id);

    expect(first.redacted).toEqual([created.request.request_id]);
    expect(second).toMatchObject({ redacted: [], already_redacted: 1 });
    expect(afterSecond).toEqual(afterFirst);
  });

  it("fails closed and redacts an S3 request whose retention deadline is noncanonical", async () => {
    const created = await createRequest();
    // Simulate legacy/corrupt storage beneath the normal persistence contract.
    // All current writes reject this value before it can reach the store.
    created.request.owner_notes = "PRIVATE TEXT ON A RECORD WITH BROKEN RETENTION METADATA";
    // Date.parse accepts this partial year as a far-future date. The lifecycle
    // contract must still treat it as corrupt rather than retaining S3 text.
    created.request.retention_expires_at = "9999";

    vi.useFakeTimers();
    vi.setSystemTime("2026-09-05T00:00:00.000Z");
    const sweep = await sweepExpiredConsultations(new Date("2026-09-05T00:00:00.000Z"));
    expect(sweep.redacted).toEqual([created.request.request_id]);
    const stored = await getStore().get<ConsultationRecord>("consult_request", created.request.request_id);
    expect(stored).toMatchObject({
      record_type: "consultation_tombstone",
      status: "expired",
      retention_expires_at: "2026-09-05T00:00:00.000Z",
      redacted_at: "2026-09-05T00:00:00.000Z",
    });
    expect(JSON.stringify(stored)).not.toContain(INPUT.work_name);
    expect(JSON.stringify(stored)).not.toContain("PRIVATE TEXT");
    await expect(O.queue()).resolves.toEqual([]);
  });

  it("hides an expired pending request even while its tombstone write keeps losing a race", async () => {
    const created = await createRequest();
    created.request.retention_expires_at = "2020-01-01T00:00:00.000Z";
    const store = getStore();
    const conflict = vi.spyOn(store, "compareAndSwapConsultation").mockResolvedValue({
      applied: false,
      reason: "conflict",
      current: created.request,
    });

    await expect(O.eligibilityQueue()).resolves.toEqual([]);
    expect(conflict).toHaveBeenCalledTimes(4);
  });

  it("hides an expired confirmed request even while its tombstone write keeps losing a race", async () => {
    const created = await createRequest();
    const admitted = await O.queueUpdate(created.request.request_id, { eligibility_decision: "confirmed_dsd" });
    expect(admitted.ok).toBe(true);
    if (!admitted.ok || !admitted.request) throw new Error("Expected a confirmed DSD fixture.");
    admitted.request.retention_expires_at = "2020-01-01T00:00:00.000Z";
    const store = getStore();
    const conflict = vi.spyOn(store, "compareAndSwapConsultation").mockResolvedValue({
      applied: false,
      reason: "conflict",
      current: admitted.request,
    });

    await expect(O.queue()).resolves.toEqual([]);
    expect(conflict).toHaveBeenCalledTimes(4);
  });

  it("runs retention from the authenticated scheduled orchestration path", async () => {
    const created = await createRequest();
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse(created.request.retention_expires_at) + 1_000);

    const denied = await runScheduledCycle(new NextRequest("https://program.example/api/cron/orchestrate", {
      headers: { authorization: "Bearer wrong-secret" },
    }));
    expect(denied.status).toBe(401);
    expect(await getStore().get<ConsultRequest>("consult_request", created.request.request_id)).toHaveProperty("work_name");

    const response = await runScheduledCycle(new NextRequest("https://program.example/api/cron/orchestrate", {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
    }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ expired_consultations: 1 });
    expect(await getStore().get<ConsultationRecord>("consult_request", created.request.request_id)).toMatchObject({
      record_type: "consultation_tombstone",
      status: "expired",
    });
  });

  it("still runs authenticated cron retention while the AI kill switch is engaged", async () => {
    const created = await createRequest();
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse(created.request.retention_expires_at) + 1_000);
    await setPolicy({ killed: true, note: "Synthetic killed-policy retention check." }, "owner");

    const response = await runScheduledCycle(new NextRequest("https://program.example/api/cron/orchestrate", {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
    }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      expired_consultations: 1,
      triaged: 0,
      proposals: 0,
    });
    expect(await getStore().get<ConsultationRecord>("consult_request", created.request.request_id)).toMatchObject({
      record_type: "consultation_tombstone",
      status: "expired",
    });
  });

  it("keeps authenticated requester lookup, correction, credential rotation, and withdrawal available when AI work is paused", async () => {
    const created = await createRequest();
    await setPolicy({
      killed: true,
      max_autonomy: "A0",
      agents: { consult_intake: { enabled: false, ceiling: "A0" } },
      note: "Pause AI work, not requester rights.",
    }, "owner");

    await expect(O.intakeTrack(created.request.request_id, created.tracking_secret)).resolves.toMatchObject({
      request_id: created.request.request_id,
      status: "pending_eligibility_review",
    });

    await expect(O.intakeCorrect(
      created.request.request_id,
      created.tracking_secret,
      { work_name: "Corrected while new intake is paused" },
      created.request.version,
    )).resolves.toMatchObject({
      kind: "updated",
      request: {
        work_name: "Corrected while new intake is paused",
        version: created.request.version + 1,
      },
    });

    const rotation = await O.intakeRotateKey(
      created.request.request_id,
      created.tracking_secret,
      created.request.version + 1,
    );
    expect(rotation).toMatchObject({
      kind: "rotated",
      request: { version: created.request.version + 2 },
    });
    if (rotation.kind !== "rotated") throw new Error(`Expected rotated, received ${rotation.kind}.`);
    expect(rotation.access_key).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(rotation.access_key).not.toBe(created.tracking_secret);
    await expect(O.intakeTrack(created.request.request_id, created.tracking_secret)).resolves.toBeNull();
    await expect(O.intakeTrack(created.request.request_id, rotation.access_key)).resolves.toMatchObject({
      request_id: created.request.request_id,
      version: created.request.version + 2,
    });

    await expect(O.intakeWithdraw(
      created.request.request_id,
      rotation.access_key,
    )).resolves.toEqual({ ok: true });
    expect(await getStore().get<ConsultRequest>("consult_request", created.request.request_id)).toMatchObject({
      status: "withdrawn",
      version: created.request.version + 3,
    });

    const lifecycleEvents = (await getStore().listAudit())
      .filter((event) => event.tool_name.startsWith("intake.requester_"));
    expect(lifecycleEvents.map((event) => event.tool_name)).toEqual(expect.arrayContaining([
      "intake.requester_track",
      "intake.requester_correct",
      "intake.requester_rotate_key",
      "intake.requester_withdraw",
    ]));

    const ownerContext = O.contextFor("consult_intake", "owner");
    await expect(runTool(
      ownerContext,
      "intake.requester_track",
      () => "must not run",
    )).rejects.toBeInstanceOf(ToolDenied);
    const staffContext = O.contextFor("consult_intake", "staff");
    await expect(runTool(
      staffContext,
      "intake.requester_track",
      () => "must not run without verified-requester authority",
    )).rejects.toBeInstanceOf(ToolDenied);
    await expect(runTool(
      staffContext,
      "queue.status_get",
      () => "must not run",
    )).rejects.toBeInstanceOf(ToolDenied);
  });

  it("reserves Expired for retention and rejects impossible combined owner states in domain and API", async () => {
    const created = await createRequest();
    const original = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);

    await expect(O.queueUpdate(
      created.request.request_id,
      { status: "expired" as never },
    )).resolves.toMatchObject({ ok: false });
    await expect(O.queueUpdate(
      created.request.request_id,
      { eligibility_decision: "not_dsd", status: "received", status_reason: OUTSIDE_DSD_REDIRECT },
    )).resolves.toMatchObject({ ok: false });
    expect(await getStore().get<ConsultRequest>("consult_request", created.request.request_id)).toEqual(original);

    const ownerSession = issueSessionCookieValue();
    expect(ownerSession).toBeTruthy();
    const request = new NextRequest(`https://program.example/api/consultant/queue/${created.request.request_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie: `${OWNER_COOKIE}=${ownerSession}`,
        origin: "https://program.example",
      },
      body: JSON.stringify({
        eligibility_decision: "not_dsd",
        status: "received",
        status_reason: OUTSIDE_DSD_REDIRECT,
      }),
    });
    const response = await updateQueueRoute(request, {
      params: Promise.resolve({ id: created.request.request_id }),
    });
    expect(response.status).toBe(409);
    expect(await getStore().get<ConsultRequest>("consult_request", created.request.request_id)).toEqual(original);

    const expiredRequest = new NextRequest(`https://program.example/api/consultant/queue/${created.request.request_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie: `${OWNER_COOKIE}=${ownerSession}`,
        origin: "https://program.example",
      },
      body: JSON.stringify({ status: "expired" }),
    });
    const expiredResponse = await updateQueueRoute(expiredRequest, {
      params: Promise.resolve({ id: created.request.request_id }),
    });
    expect(expiredResponse.status).toBe(400);
    expect(await getStore().get<ConsultRequest>("consult_request", created.request.request_id)).toEqual(original);
  });

  it("screens owner queue text and requires a complete scheduled time before persistence", async () => {
    const created = await createRequest();
    const original = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);

    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "The client SSN is 123-45-6789 and must not be stored.",
    })).resolves.toMatchObject({ ok: false });
    await expect(O.queueUpdate(created.request.request_id, {
      eligibility_decision: "not_dsd",
      status_reason: "Email a.named.person@example.org about this request.",
    })).resolves.toMatchObject({ ok: false });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Contact gary@example.com for details.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contact|identifier/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Follow up with Jane Doe about the general access questions.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Jane Doe's medical condition needs review.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Jane Doe will follow up tomorrow.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Reviewed by Jane Doe.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Reviewed by JANE DOE.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Reviewed by John Q. Smith.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "reviewed by gary banks",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Reviewed by J. Doe.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Reviewed by Doe, Jane.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "gary banks will review this consultation.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "X Li will review this consultation.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      owner_notes: "Jane Doe attended the meeting.",
    })).resolves.toMatchObject({ ok: false, reason: expect.stringMatching(/contain names/i) });
    await expect(O.queueUpdate(created.request.request_id, {
      eligibility_decision: "confirmed_dsd",
      status: "scheduled",
      scheduled_for: "Tuesday afternoon",
    })).resolves.toMatchObject({ ok: false });
    expect(await getStore().get<ConsultRequest>("consult_request", created.request.request_id)).toEqual(original);

    await expect(O.queueUpdate(created.request.request_id, {
      eligibility_decision: "confirmed_dsd",
      status: "under_review",
      owner_notes: "Access or language follow-up needed",
    })).resolves.toMatchObject({
      ok: true,
      request: { eligibility_status: "confirmed_dsd", status: "under_review" },
    });
    await expect(O.queueUpdate(created.request.request_id, {
      status: "scheduled",
      scheduled_for: "2026-09-15T14:00:00-05:00",
    })).resolves.toMatchObject({
      ok: true,
      request: { status: "scheduled", scheduled_for: "2026-09-15T14:00:00-05:00" },
    });
  });

  it("lets the requester correct allowed general work fields and rebuilds the packet", async () => {
    const created = await createRequest();
    const noted = await O.queueUpdate(created.request.request_id, {
      owner_notes: "General consultation planning note",
    });
    expect(noted.ok).toBe(true);
    if (!noted.ok || !noted.request) throw new Error("Expected the owner note fixture to be saved.");

    const corrected = await O.intakeCorrect(
      created.request.request_id,
      created.tracking_secret,
      {
        work_name: "Corrected accessible service notice",
        goals: "Correct the general work description and keep the notice usable before release.",
        situation: "The DSD team corrected the general project description and still wants an access review before release.",
      },
      noted.request.version,
    );

    expect(corrected).toMatchObject({
      kind: "updated",
      request: {
        work_name: "Corrected accessible service notice",
        version: noted.request.version + 1,
        can_correct: true,
      },
    });
    expect(JSON.stringify(corrected)).not.toContain("PRIVATE OWNER NOTE");
    expect(JSON.stringify(corrected)).not.toContain(created.tracking_secret);
    expect(JSON.stringify(corrected)).not.toContain(created.request.access_key_hash);

    const updated = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);
    expect(updated).toMatchObject({
      eligibility_status: "pending",
      status: "pending_eligibility_review",
    });
    expect(updated?.packet.snapshot["Work name"]).toBe("Corrected accessible service notice");
    expect(updated?.packet.summary.join(" ")).toContain("Correct the general work description");
    expect(updated?.correction_history?.at(-1)?.fields.sort()).toEqual([
      "goals",
      "situation",
      "work_name",
    ]);
    expect(updated?.owner_notes).toBe("General consultation planning note");

    const correctionAudit = (await getStore().listAudit()).find(
      (event) => event.tool_name === "intake.requester_correct",
    );
    expect(correctionAudit).toMatchObject({
      agent_id: "consult_intake",
      permission_mode: "always",
      autonomy_level_used: "A2",
      content_ids_touched: [created.request.request_id],
      allowlist_hit: true,
      human_disposition: "edit",
      ok: true,
    });
    const serializedAudit = JSON.stringify(correctionAudit);
    expect(serializedAudit).not.toContain("Corrected accessible service notice");
    expect(serializedAudit).not.toContain("PRIVATE OWNER NOTE");
    expect(serializedAudit).not.toContain(created.tracking_secret);
    expect(serializedAudit).not.toContain(created.request.access_key_hash);
  });

  it("attributes an authenticated withdrawal to requester authority without sensitive audit data", async () => {
    const created = await createRequest();

    await expect(
      O.intakeWithdraw(created.request.request_id, created.tracking_secret),
    ).resolves.toEqual({ ok: true });
    await expect(
      getStore().get<ConsultRequest>("consult_request", created.request.request_id),
    ).resolves.toMatchObject({ status: "withdrawn", version: created.request.version + 1 });

    const withdrawalAudit = (await getStore().listAudit()).find(
      (event) => event.tool_name === "intake.requester_withdraw",
    );
    expect(withdrawalAudit).toMatchObject({
      agent_id: "consult_intake",
      permission_mode: "always",
      autonomy_level_used: "A2",
      content_ids_touched: [created.request.request_id],
      allowlist_hit: true,
      human_disposition: "edit",
      ok: true,
    });
    const serializedAudit = JSON.stringify(withdrawalAudit);
    expect(serializedAudit).not.toContain(INPUT.work_name);
    expect(serializedAudit).not.toContain(INPUT.goals);
    expect(serializedAudit).not.toContain(created.tracking_secret);
    expect(serializedAudit).not.toContain(created.request.access_key_hash);
  });

  it("blocks unknown, unsafe, stale, and late corrections without changing the request", async () => {
    const created = await createRequest();
    const original = await getStore().get<ConsultRequest>("consult_request", created.request.request_id);

    await expect(O.intakeCorrect(
      created.request.request_id,
      created.tracking_secret,
      { owner_notes: "Requester must never set this." },
      created.request.version,
    )).resolves.toMatchObject({ kind: "invalid" });
    await expect(O.intakeCorrect(
      created.request.request_id,
      created.tracking_secret,
      { situation: "The client SSN is 123-45-6789 and this text must never be saved." },
      created.request.version,
    )).resolves.toMatchObject({ kind: "refusal" });
    await expect(O.intakeCorrect(
      created.request.request_id,
      created.tracking_secret,
      { work_name: "A safe but stale correction" },
      created.request.version + 1,
    )).resolves.toMatchObject({ kind: "conflict" });
    await expect(O.intakeCorrect(
      created.request.request_id,
      "A".repeat(43),
      { work_name: "A correction with the wrong credential" },
      created.request.version,
    )).resolves.toMatchObject({ kind: "not_found" });
    expect(await getStore().get<ConsultRequest>("consult_request", created.request.request_id)).toEqual(original);

    const reviewing = await O.queueUpdate(created.request.request_id, {
      eligibility_decision: "confirmed_dsd",
      status: "under_review",
    });
    expect(reviewing.ok).toBe(true);
    if (!reviewing.ok) throw new Error("Expected the request to enter review.");
    const scheduled = await O.queueUpdate(created.request.request_id, {
      status: "scheduled",
      scheduled_for: "2026-09-15T14:00:00-05:00",
    });
    expect(scheduled.ok).toBe(true);
    if (!scheduled.ok || !scheduled.request) throw new Error("Expected the request to be scheduled.");
    await expect(O.intakeCorrect(
      created.request.request_id,
      created.tracking_secret,
      { work_name: "A correction after scheduling" },
      scheduled.request.version,
    )).resolves.toMatchObject({ kind: "not_correctable" });
  });
});
