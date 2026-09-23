import "server-only";
import { createHash } from "node:crypto";
import type { PublishedEditableSurface } from "@/lib/content/editable-surfaces";
import type { EvidenceRevision } from "@/lib/content/ask-evidence";
import { PODCASTS } from "@/lib/content/podcasts";
import { PODCAST_SUPPLEMENTS } from "@/lib/content/podcast-supplements";
import toolkitTranscript from "@/public/audio/transcripts/dhs-equity-policy-and-toolkit.json";
import antiRacismTranscript from "@/public/audio/transcripts/anti-racism-public-service.json";

type RecordingTranscript = Readonly<{
  status: string;
  source: string;
  segments: readonly { start: number; end: number; text: string }[];
}>;
// Only actual, public recording-derived JSON belongs here. No private notes,
// source archives, network lookups or speculative transcript fallbacks.
const RECORDING_TRANSCRIPTS: Partial<Record<string, RecordingTranscript>> = {
  "equity-toolkit": toolkitTranscript,
  "anti-racism-public-service": antiRacismTranscript,
};
export const MAX_PODCAST_READING_CHARACTERS = 64_000;
const TRANSCRIPT_LABEL = "Machine-generated transcript of the supplied recording; not an official transcript. Check the recording before quoting or relying on exact wording.";

export type PublishedPodcastReading = Readonly<{
  text: string;
  summary: string;
  tags: string[];
  fingerprint: string;
  evidence: EvidenceRevision;
}>;

/** The caller must supply the current scoped publication rows, before cache reuse. */
export function publishedPodcastReadings(rows: readonly PublishedEditableSurface[]): Map<string, PublishedPodcastReading> {
  const result = new Map<string, PublishedPodcastReading>();
  for (const row of rows) {
    const podcast = PODCASTS.find(podcast => podcast.surfaceId === row.surfaceId);
    if (!podcast) continue;
    const transcript = RECORDING_TRANSCRIPTS[podcast.id];
    const supplement = PODCAST_SUPPLEMENTS[podcast.id];
    if (!transcript || !supplement?.transcriptUrl || transcript.source !== podcast.src) continue;
    const chapterText = supplement.chapters?.map(chapter => chapter.title).join(". ") ?? "";
    const parts = [TRANSCRIPT_LABEL, chapterText];
    let length = parts.join("\n").length;
    let included = 0;
    for (const segment of transcript.segments) {
      if (!segment.text.trim()) continue;
      if (length + segment.text.length + 1 > MAX_PODCAST_READING_CHARACTERS) break;
      parts.push(segment.text);
      length += segment.text.length + 1;
      included += 1;
    }
    if (!included) continue;
    // The original published revision remains evidence in the parent destination.
    // This extra hash identifies the distinct transcript/chapter payload precisely.
    const payloadHash = createHash("sha256").update(JSON.stringify({ transcript, chapters: supplement.chapters ?? [], transcriptUrl: supplement.transcriptUrl })).digest("hex");
    result.set(row.surfaceId, {
      text: parts.filter(Boolean).join("\n"),
      summary: `Search includes a machine-generated recording transcript${included < transcript.segments.length ? " excerpt" : ""}; verify exact wording with playback.`,
      tags: ["podcast", "machine-generated transcript", ...(supplement.chapters?.map(chapter => chapter.title) ?? [])],
      fingerprint: `${row.surfaceId}:${payloadHash}`,
      evidence: { sourceId: `${row.surfaceId}.machine-transcript`, revisionId: null, payloadHash, scope: row.sourceScope },
    });
  }
  return result;
}
