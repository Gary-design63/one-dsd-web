import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";
import { POST as submitConsultation } from "@/app/api/intake/route";
import { AuthorityPill, Field } from "@/components/ui";
import { staffAskTopicLabel } from "@/components/packet-view";
import { reviewDateText } from "@/lib/content/types";
import {
  buildHeadsUpPacket,
  ConsultInputSchema,
  isPublicReferenceUrl,
  prioritySignals,
} from "@/lib/intelligence/consult/schema";
import {
  consultationActivationStatus,
  consultationCorrectionEnabled,
  consultationIntakeEnabled,
  consultationTrackingEnabled,
} from "@/lib/intelligence/consult/availability";

const CONSULTATION_ENV = [
  "PAC_CONSULTATION_INTAKE_ENABLED",
  "PAC_STORE",
  "PAC_RUNTIME_DATABASE_URL",
  "PAC_CONSULTATION_TRACKING_SECRET",
  "PAC_RATE_LIMIT_SECRET",
  "PAC_CONSULTATION_POLICY_VERSION",
  "PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID",
  "PAC_CONSULTATION_RETENTION_DAYS",
  "PAC_CONSULTATION_CORRECTION_READY",
  "PAC_CONSULTATION_DELETION_READY",
  "PAC_CONSULTATION_BACKUP_READY",
  "PAC_CONSULTATION_RESTORE_READY",
  "PAC_CONSULTATION_RECOVERY_READY",
  "PAC_CONSULTATION_INCIDENT_READY",
  "PAC_CONSULTATION_DELIVERY_READY",
] as const;
const originalConsultationEnv = Object.fromEntries(
  CONSULTATION_ENV.map((name) => [name, process.env[name]]),
);

const CONSULT_INPUT = {
  program_context: "one_dsd" as const,
  dsd_eligibility_attestation: true as const,
  participation_notice_id: "dsd_consultation_request" as const,
  participation_notice_version: "1.0.0",
  work_name: "Public benefits notice",
  stage: "designing" as const,
  goals: "Make the notice easier to understand and use for everyone who receives it.",
  desired_support_type: ["access_language_check" as const],
  timing_urgency: "within_2_weeks" as const,
  situation: "We are revising a public notice and want help reviewing language and access before release.",
  share_confirmation: true as const,
};

afterEach(() => {
  for (const name of CONSULTATION_ENV) {
    const value = originalConsultationEnv[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

describe("staff trust boundaries", () => {
  it("keeps consultation submission closed unless it is deliberately enabled", async () => {
    delete process.env.PAC_CONSULTATION_INTAKE_ENABLED;
    expect(consultationIntakeEnabled()).toBe(false);

    const response = await submitConsultation(
      new NextRequest("http://localhost/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost" },
        body: JSON.stringify({ mode: "submit", input: {}, idempotency_key: "test-preview-gate-0001" }),
      }),
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ code: "staff_browse_download_only" });

    process.env.PAC_CONSULTATION_INTAKE_ENABLED = "on";
    expect(consultationIntakeEnabled()).toBe(false);
    expect(consultationActivationStatus().missing).toContain("durable_store");

    process.env.PAC_STORE = "postgres";
    process.env.PAC_RUNTIME_DATABASE_URL = "postgres://runtime:test@db.example/pac";
    process.env.PAC_CONSULTATION_TRACKING_SECRET = "tracking-secret-with-at-least-thirty-two-characters";
    process.env.PAC_RATE_LIMIT_SECRET = "rate-limit-secret-with-at-least-thirty-two-characters";
    process.env.PAC_CONSULTATION_POLICY_VERSION = "consultation-v1";
    process.env.PAC_CONSULTATION_RETENTION_DAYS = "180";
    process.env.PAC_CONSULTATION_CORRECTION_READY = "on";
    process.env.PAC_CONSULTATION_DELETION_READY = "on";
    process.env.PAC_CONSULTATION_BACKUP_READY = "on";
    process.env.PAC_CONSULTATION_RESTORE_READY = "on";
    process.env.PAC_CONSULTATION_RECOVERY_READY = "on";
    process.env.PAC_CONSULTATION_INCIDENT_READY = "on";
    process.env.PAC_CONSULTATION_DELIVERY_READY = "on";
    process.env.PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID = "invented-evidence-id";
    expect(consultationIntakeEnabled()).toBe(false);
    expect(consultationActivationStatus().missing).toContain("activation_evidence");
    expect(consultationActivationStatus().missing).toContain("backup_process");

    delete process.env.PAC_CONSULTATION_INTAKE_ENABLED;
    expect(consultationIntakeEnabled()).toBe(false);
    expect(consultationTrackingEnabled()).toBe(false);
    expect(consultationCorrectionEnabled()).toBe(false);

    delete process.env.PAC_CONSULTATION_POLICY_VERSION;
    expect(consultationTrackingEnabled()).toBe(false);
  });

  it("accepts public references and rejects local, private-network, and intranet links", () => {
    expect(isPublicReferenceUrl("https://www.example.org/guidance")).toBe(true);
    expect(isPublicReferenceUrl("http://localhost:3000/draft")).toBe(false);
    expect(isPublicReferenceUrl("http://10.0.0.7/draft")).toBe(false);
    expect(isPublicReferenceUrl("https://policy.internal/draft")).toBe(false);

    const base = CONSULT_INPUT;
    expect(ConsultInputSchema.safeParse({ ...base, links: ["https://www.example.org/guidance"] }).success).toBe(true);
    expect(ConsultInputSchema.safeParse({ ...base, links: ["http://192.168.1.20/draft"] }).success).toBe(false);
  });

  it("accepts only the active consultation participation-notice version", () => {
    expect(ConsultInputSchema.safeParse(CONSULT_INPUT).success).toBe(true);
    expect(ConsultInputSchema.safeParse({
      ...CONSULT_INPUT,
      participation_notice_version: "999.0.0",
    }).success).toBe(false);
  });

  it("keeps consultation previews free of submission-only claims", () => {
    const input = ConsultInputSchema.parse({
      ...CONSULT_INPUT,
      goals: "Make the notice easier to understand and use.",
      situation: "We want help reviewing language and access before release.",
    });
    const packet = buildHeadsUpPacket(input, {
      request_id: "CR-preview",
      created_at: "2026-09-04T12:00:00.000Z",
      status: "received",
      signals: prioritySignals(input),
      preview: true,
    });

    expect(packet.snapshot).not.toHaveProperty("Reference ID");
    expect(packet.snapshot).not.toHaveProperty("Status");
    expect(packet.snapshot).not.toHaveProperty("Submitted");
    expect(packet.summary[0]).toContain("This preview is for");
    expect(packet.calendar_handoff).not.toContain("CR-preview");
  });

  it("describes future review dates as planned work", () => {
    const asOf = new Date("2026-09-04T12:00:00Z");
    expect(reviewDateText("2027-03-01", asOf)).toBe("Planned review March 1, 2027");
    expect(reviewDateText("2026-03-01", asOf)).toBe("Reviewed March 1, 2026");
  });

  it("associates field help and errors with the form control", () => {
    const html = renderToStaticMarkup(
      Field({
        id: "work-name",
        label: "Work name",
        help: "Use a general name.",
        error: "Please enter a name.",
        children: createElement("input", { id: "work-name" }),
      }),
    );
    expect(html).toContain('aria-describedby="work-name-help work-name-error"');
    expect(html).toContain('aria-invalid="true"');
  });

  it("makes authority explanations available without relying only on hover", () => {
    const html = renderToStaticMarkup(createElement(AuthorityPill, { authority: "under_review" }));
    expect(html).toContain('class="sr-only"');
    expect(html).toContain("This material is still being reviewed");
  });

  it("maps old Ask codes once, preserves approved labels, and drops unknown values", () => {
    expect(staffAskTopicLabel("workplace_culture")).toBe("Workplace culture");
    expect(staffAskTopicLabel("Workplace culture")).toBe("Workplace culture");
    expect(staffAskTopicLabel("unrecognized_internal_value")).toBeUndefined();
  });
});
