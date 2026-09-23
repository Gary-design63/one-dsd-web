import { describe, expect, it } from "vitest";
import { assertWorkObjectPersistence } from "@/lib/trust/work-object-contract";
import {
  buildTestConsultationRecord,
  buildTestConsultationTombstone,
  withConsultationStatus,
} from "@/tests/helpers/consultation-record";

function copy<T>(value: T): T {
  return structuredClone(value);
}

describe("consultation application persistence contract", () => {
  it("accepts complete requests and the exact ten-field retention tombstone", () => {
    const request = buildTestConsultationRecord({ sequence: 9201 });
    const at = new Date(Date.parse(request.created_at) + 60_000).toISOString();
    const tombstone = buildTestConsultationTombstone(request, at);

    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, request)).not.toThrow();
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, tombstone)).not.toThrow();
    expect(Object.keys(tombstone).sort()).toEqual([
      "access_key_hash", "access_key_version", "record_type", "redacted_at", "request_id",
      "retention_expires_at", "retention_policy_id", "status", "updated_at", "version",
    ]);
  });

  it.each([
    ["unknown root field", (record: Record<string, unknown>) => { record.favorite_color = "blue"; }],
    ["missing required field", (record: Record<string, unknown>) => { delete record.packet; }],
    ["invalid enum", (record: Record<string, unknown>) => { record.stage = "finished"; }],
    ["impossible eligibility/status", (record: Record<string, unknown>) => { record.status = "received"; }],
    ["mismatched request ID", (record: Record<string, unknown>) => { record.request_id = "CR-20260905-9999"; }],
    ["malformed access hash", (record: Record<string, unknown>) => { record.access_key_hash = "not-a-hash"; }],
    ["noncanonical timestamp", (record: Record<string, unknown>) => { record.updated_at = "2026-09-05 12:00:00Z"; }],
    ["fractional version", (record: Record<string, unknown>) => { record.version = 1.5; }],
    ["malformed nested packet", (record: Record<string, unknown>) => {
      (record.packet as { agenda: unknown }).agenda = [{ minutes: "five", item: "Review", owner: "Requester" }];
    }],
    ["profile-like data", (record: Record<string, unknown>) => {
      (record.packet as Record<string, unknown>).employee_equity_score = 97;
    }],
  ])("rejects %s", (_label, mutate) => {
    const request = buildTestConsultationRecord({ sequence: 9202 });
    const candidate = copy(request) as unknown as Record<string, unknown>;
    mutate(candidate);
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, candidate))
      .toThrow(/approved persistence contract|prohibited employee-profile field/i);
  });

  it("allows only requester-correctable field names in correction history", () => {
    const request = buildTestConsultationRecord({ sequence: 9203 });
    const at = new Date(Date.parse(request.created_at) + 60_000).toISOString();
    const legitimate = {
      ...request,
      updated_at: at,
      version: 2,
      correction_history: [{ at, fields: ["work_name"], by: "requester" as const }],
    };
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, legitimate)).not.toThrow();

    const adversarial = copy(legitimate) as unknown as Record<string, unknown>;
    adversarial.correction_history = [{ at, fields: ["owner_notes"], by: "requester" }];
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, adversarial))
      .toThrow(/approved persistence contract/i);
  });

  it("rejects impossible adjacent history changes and actor authority", () => {
    const request = buildTestConsultationRecord({ sequence: 9205 });
    const receivedAt = new Date(Date.parse(request.created_at) + 60_000).toISOString();
    const reviewAt = new Date(Date.parse(receivedAt) + 60_000).toISOString();
    const received = withConsultationStatus(request, "received", receivedAt, "owner");
    const underReview = withConsultationStatus(received, "under_review", reviewAt, "owner");
    expect(() => assertWorkObjectPersistence(
      "consult_request",
      request.request_id,
      underReview,
    )).not.toThrow();

    const impossible = copy(underReview);
    impossible.history = [
      request.history[0],
      { at: receivedAt, status: "completed", by: "owner" },
      { at: reviewAt, status: "under_review", by: "owner" },
    ];
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, impossible))
      .toThrow(/approved persistence contract/i);

    const unauthorized = copy(underReview);
    unauthorized.history[1] = { at: receivedAt, status: "received", by: "requester" };
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, unauthorized))
      .toThrow(/approved persistence contract/i);
  });

  it("rejects surveillance and prohibited personal material at the final persistence boundary", () => {
    const request = buildTestConsultationRecord({ sequence: 9206 });
    const surveillance = copy(request);
    surveillance.work_name = "Rank staff by equity maturity";
    surveillance.packet.snapshot["Work name"] = surveillance.work_name;
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, surveillance))
      .toThrow(/approved persistence contract/i);

    const personal = copy(request);
    personal.situation = "The consultation concerns client SSN 123-45-6789 and a general service-design review before release.";
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, personal))
      .toThrow(/approved persistence contract/i);

    const namedOwner = copy(request);
    namedOwner.owner_notes = "gary banks will review this consultation.";
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, namedOwner))
      .toThrow(/approved persistence contract/i);
  });

  it("rejects malformed IDs and tombstones with extra or inconsistent fields", () => {
    const request = buildTestConsultationRecord({ sequence: 9204 });
    const at = new Date(Date.parse(request.created_at) + 60_000).toISOString();
    const tombstone = buildTestConsultationTombstone(request, at);

    expect(() => assertWorkObjectPersistence("consult_request", "CR-free-form-id", {
      ...request,
      request_id: "CR-free-form-id",
    })).toThrow(/approved persistence contract/i);
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, {
      ...tombstone,
      situation: request.situation,
    })).toThrow(/approved persistence contract/i);
    expect(() => assertWorkObjectPersistence("consult_request", request.request_id, {
      ...tombstone,
      updated_at: new Date(Date.parse(at) + 1000).toISOString(),
    })).toThrow(/approved persistence contract/i);
  });
});
