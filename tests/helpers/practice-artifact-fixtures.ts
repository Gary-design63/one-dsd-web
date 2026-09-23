import { getPath } from "@/lib/content/paths";
import { practiceContract } from "@/lib/intelligence/practice-artifact";
import type { PracticeArtifact } from "@/lib/content/practice-artifact";
import { testTraceId } from "./opaque-identifiers";
export const meetingPath = getPath("gp-8")!;
export function meetingArtifact(overrides: Partial<PracticeArtifact> = {}): PracticeArtifact {
  return {
    schemaVersion: 1, artifactId: testTraceId("meeting-artifact"), revisionId: testTraceId("meeting-first"),
    parentRevisionId: null, traceId: testTraceId("meeting-trace"), createdAt: "2026-09-08T18:00:00.000Z",
    context: "one_dsd", pathId: "gp-8", pathContract: practiceContract(meetingPath),
    title: meetingPath.artifactTitle,
    values: { work_name: "Thirty-minute DSD team discussion", ahead: "0–5: welcome and access check; 5–20: discuss options; 20–30: agree on next steps.", formats: ["Speak during the meeting", "Send written ideas ahead of time"], owners: ["Proposed facilitator: keep discussion on track; person to confirm", "Proposed note-taker: capture decisions; person to confirm"] },
    sources: [], ...overrides,
  };
}
