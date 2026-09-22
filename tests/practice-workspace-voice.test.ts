import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { researchAvailability } from "@/components/research-controls-client";

const ROOT = path.resolve(__dirname, "..");
const OWNER_FILES = [
  "app/consultant/layout.tsx",
  "app/consultant/page.tsx",
  "app/consultant/audit/page.tsx",
  "app/consultant/evals/page.tsx",
  "app/consultant/orchestrator/page.tsx",
  "app/consultant/registry/page.tsx",
  "app/consultant/research/page.tsx",
  "app/consultant/review/page.tsx",
  "components/evals-client.tsx",
  "components/orchestrator-client.tsx",
  "components/queue-item-client.tsx",
  "components/research-controls-client.tsx",
  "components/review-client.tsx",
];

function source(file: string) {
  return readFileSync(path.join(ROOT, file), "utf8");
}

describe("Consultant Workspace voice", () => {
  it("keeps superseded internal wording out of consultant-facing pages", () => {
    const combined = OWNER_FILES.map(source).join("\n");
    const superseded = [
      "Mindset workflows",
      "KPI-",
      "Highest autonomy allowed",
      "Program agents (",
      "Evaluation fixture",
      "Provider route",
      "External research is on for all staff",
      "No owner key is configured for this environment",
      "JSON.stringify(p.apply)",
    ];
    for (const phrase of superseded) expect(combined).not.toContain(phrase);
  });

  it("does not add icons or emoji to the Consultant Workspace", () => {
    const combined = OWNER_FILES.map(source).join("\n");
    expect(combined).not.toContain("<svg");
    expect(combined).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it("keeps internal check references and raw diagnostic text off the readiness page", () => {
    const evaluations = source("components/evals-client.tsx");
    expect(evaluations).not.toContain("Technical details");
    expect(evaluations).not.toContain("r.detail");
    expect(evaluations).not.toContain("Reference:");
  });

  it("shows research as available only when it is connected, enabled, and not paused", () => {
    expect(researchAvailability(true, false, false).active).toBe(false);
    expect(researchAvailability(true, false, false).heading).toContain("off until the connection is ready");
    expect(researchAvailability(false, true, false).active).toBe(false);
    expect(researchAvailability(true, true, true).active).toBe(false);
    expect(researchAvailability(true, true, false).active).toBe(true);
  });

  it("keeps vendor and connection names inside the setup details", () => {
    const research = source("components/research-controls-client.tsx");
    const detailsStart = research.indexOf("<summary>Connection details for setup or troubleshooting</summary>");
    const detailsEnd = research.indexOf("</details>", detailsStart);
    expect(detailsStart).toBeGreaterThan(0);
    expect(detailsEnd).toBeGreaterThan(detailsStart);
    for (const phrase of ["connect directly to Perplexity", "private Vercel settings"]) {
      const position = research.indexOf(phrase);
      expect(position).toBeGreaterThan(detailsStart);
      expect(position).toBeLessThan(detailsEnd);
    }
  });
});
