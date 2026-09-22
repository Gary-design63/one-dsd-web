/** Exact recording-derived text and timing, never a summary presented as a transcript. */
export type PodcastTranscriptSegment = Readonly<{ start: number; end: number; text: string }>;
export type PodcastTranscript = Readonly<{
  status: "machine-generated" | "reviewed";
  segments: readonly PodcastTranscriptSegment[];
}>;
export type PodcastChapter = Readonly<{ start: number; title: string }>;

export type PodcastReadingSupport = Readonly<{
  transcript?: PodcastTranscript;
  /** Same-origin JSON containing status and recording-derived segments; loaded on disclosure. */
  transcriptUrl?: string;
  chapters?: readonly PodcastChapter[];
}>;
