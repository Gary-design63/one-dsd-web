import { describe, expect, it } from "vitest";
import { receiptBodyForDisplay } from "@/lib/program/receipt-display";

describe("saved program receipts", () => {
  it("hides past resource-review metadata dates while keeping findings", () => {
    const saved = "Published-resource review for Workforce\n\nChecked: 2026-09-24T11:22:33.000Z\n\n- Hiring guide [123]; guide; guidance; review 2027-03-01.\n\nFindings\n\nPlease review accessibility.";
    const visible = receiptBodyForDisplay(saved, "program_record_review");
    expect(visible).toContain("Hiring guide [123]; guide; guidance.");
    expect(visible).toContain("Please review accessibility.");
    expect(visible).not.toContain("2026-09-24");
    expect(visible).not.toContain("2027-03-01");
    expect(saved).toContain("2027-03-01");
  });

  it("hides a source-check timestamp without changing the saved receipt", () => {
    const saved = "Source access checked 2026-09-24T11:22:33.000Z. HTTP 200. The source was accessible. This receipt is an access check, not a factual recertification; the canonical source review date remains unchanged.";
    const visible = receiptBodyForDisplay(saved, "source_check");
    expect(visible).toContain("Source access checked. HTTP 200.");
    expect(visible).not.toContain("2026-09-24");
    expect(visible).not.toContain("canonical source review date");
    expect(saved).toContain("2026-09-24");
  });

  it("leaves unrelated work records alone", () => {
    const saved = "Policy published August 4, 2023.";
    expect(receiptBodyForDisplay(saved, "generated_artifact")).toBe(saved);
  });
});
