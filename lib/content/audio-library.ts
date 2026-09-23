import "server-only";

import { closeSync, openSync, readFileSync, readSync, readdirSync, statSync, type Dirent } from "node:fs";
import path from "node:path";
import { LEARNING_DIALOGUES, LEARNING_MOMENT_AUDIO } from "@/components/multimedia/learning-dialogue";
import { PODCASTS } from "./podcasts";

/**
 * Audio library: the recordings the hosted app actually ships.
 *
 * Learning examples are read from disk on every request: `public/audio/learning-examples`
 * is scanned recursively and only files that exist are listed, so nothing that the hosted
 * build leaves out (see .vercelignore) can appear. The directory path is spelled out in full
 * so the build's file tracer copies that folder (about 9 MB) into the server output.
 *
 * Podcasts come from PODCASTS. Their MP3s are the only top-level files under `public/audio`
 * that the hosted build keeps (they are allow-listed by name in .vercelignore because the
 * podcast players reference them), and they are deliberately not read here: tracing a read of
 * two 30+ MB files would copy them into the server output as well.
 */

export type AudioFormat = "MP3" | "WAV" | "M4A";

export type AudioLibraryEntry = {
  /** Stable identifier, safe to use in element ids after slugging. */
  id: string;
  title: string;
  /** Site-relative URL of the recording. */
  src: string;
  format: AudioFormat;
  sizeBytes: number | null;
  /** Known length in seconds, or null when it is only discoverable by loading the file. */
  durationSeconds: number | null;
  /** The complete spoken text, when it ships beside the recording. */
  transcript: string | null;
  /** Where the recording is used, with chapters or a transcript when available. */
  related: { label: string; href: string } | null;
};

export type AudioLibraryShelf = {
  id: "podcasts" | "learning-examples";
  title: string;
  intro: string;
  entries: AudioLibraryEntry[];
};

// Only this folder is named as a path on purpose: naming public/audio itself would make the build
// tracer copy every file under it (including the podcast MP3s) into the server output.
const LEARNING_EXAMPLES_DIR = path.join(process.cwd(), "public", "audio", "learning-examples");
const LEARNING_EXAMPLES_URL = "/audio/learning-examples";

const AUDIO_FORMATS: Readonly<Record<string, AudioFormat>> = { ".mp3": "MP3", ".wav": "WAV", ".m4a": "M4A" };

type KnownRecording = { title: string; transcript: string | null; related: { label: string; href: string } };

/** Titles, spoken text, and lesson links for the recordings the courses use. Order is course order. */
function knownLearningExamples(): Map<string, KnownRecording> {
  const known = new Map<string, KnownRecording>();
  for (const dialogue of LEARNING_DIALOGUES) {
    // Same shape as courseHref() in lib/content/courses/published.ts, without importing its loaders.
    const related = {
      label: `Open the lesson: ${dialogue.title}`,
      href: `/courses/${encodeURIComponent(dialogue.courseId)}/${encodeURIComponent(dialogue.lessonId)}`,
    };
    for (const clip of dialogue.audio ?? []) known.set(clip.file, { title: clip.label, transcript: clip.transcript, related });
    LEARNING_MOMENT_AUDIO[dialogue.courseId]?.forEach((file, index) => {
      const moment = dialogue.moments[index];
      if (moment && !known.has(file)) known.set(file, { title: moment.title, transcript: moment.dialogue, related });
    });
  }
  // Narrated in components/multimedia/dsd-first-contact-audio.tsx; the spoken text ships as .txt beside each file.
  const firstContact = { label: "Open the scenario: First contact happens in English only", href: "/one-dsd/scenarios/dsd-interpreter-first-contact" };
  known.set("first-contact-dead-end.wav", { title: "When support comes after the barrier", transcript: null, related: firstContact });
  known.set("first-contact-supported.wav", { title: "Connect support with the first contact", transcript: null, related: firstContact });
  return known;
}

function humanizeFileName(fileName: string): string {
  const stem = fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return stem ? stem.charAt(0).toUpperCase() + stem.slice(1) : fileName;
}

/** Length of a WAV file from its header (data bytes / byte rate); null when the header is unusable. */
function wavDurationSeconds(file: string, fileSize: number): number | null {
  let fd: number | null = null;
  try {
    fd = openSync(file, "r");
    const riff = Buffer.alloc(12);
    if (readSync(fd, riff, 0, 12, 0) !== 12) return null;
    if (riff.toString("ascii", 0, 4) !== "RIFF" || riff.toString("ascii", 8, 12) !== "WAVE") return null;
    const chunk = Buffer.alloc(8);
    let offset = 12;
    let byteRate = 0;
    for (let step = 0; step < 64 && offset + 8 <= fileSize; step += 1) {
      if (readSync(fd, chunk, 0, 8, offset) !== 8) return null;
      const id = chunk.toString("ascii", 0, 4);
      const length = chunk.readUInt32LE(4);
      if (id === "fmt ") {
        const fmt = Buffer.alloc(16);
        if (readSync(fd, fmt, 0, 16, offset + 8) !== 16) return null;
        byteRate = fmt.readUInt32LE(8);
      } else if (id === "data") {
        if (!byteRate) return null;
        // A header can claim more data than the file holds; trust the file size.
        const dataBytes = Math.min(length, fileSize - offset - 8);
        return dataBytes > 0 ? dataBytes / byteRate : null;
      }
      offset += 8 + length + (length % 2);
    }
    return null;
  } catch {
    return null;
  } finally {
    if (fd !== null) closeSync(fd);
  }
}

function transcriptBeside(file: string): string | null {
  try {
    const text = readFileSync(file.replace(/\.[^.]+$/, ".txt"), "utf8").trim();
    return text || null;
  } catch {
    return null;
  }
}

function shelfRelative(file: string): string[] {
  return path.relative(LEARNING_EXAMPLES_DIR, file).split(path.sep);
}

function publicSrc(file: string): string {
  return `${LEARNING_EXAMPLES_URL}/${shelfRelative(file).map(encodeURIComponent).join("/")}`;
}

/** Every audio file present under `directory`, recursively; an unreadable directory yields nothing. */
function scanDirectory(directory: string): { file: string; name: string; format: AudioFormat; sizeBytes: number }[] {
  let entries: Dirent[];
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  const found: { file: string; name: string; format: AudioFormat; sizeBytes: number }[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...scanDirectory(file));
      continue;
    }
    if (!entry.isFile()) continue;
    const format = AUDIO_FORMATS[path.extname(entry.name).toLowerCase()];
    if (!format) continue;
    try {
      found.push({ file, name: entry.name, format, sizeBytes: statSync(file).size });
    } catch {
      // A file that disappears between listing and stat is simply not available.
    }
  }
  return found;
}

function learningExampleEntries(): AudioLibraryEntry[] {
  const known = knownLearningExamples();
  const order = [...known.keys()];
  return scanDirectory(LEARNING_EXAMPLES_DIR)
    .map(found => {
      const details = known.get(found.name);
      return {
        rank: details ? order.indexOf(found.name) : order.length,
        entry: {
          id: `learning-examples/${shelfRelative(found.file).join("/")}`,
          title: details?.title ?? humanizeFileName(found.name),
          src: publicSrc(found.file),
          format: found.format,
          sizeBytes: found.sizeBytes,
          durationSeconds: found.format === "WAV" ? wavDurationSeconds(found.file, found.sizeBytes) : null,
          transcript: transcriptBeside(found.file) ?? details?.transcript ?? null,
          related: details?.related ?? null,
        } satisfies AudioLibraryEntry,
      };
    })
    .sort((a, b) => a.rank - b.rank || a.entry.title.localeCompare(b.entry.title))
    .map(item => item.entry);
}

function podcastEntries(): AudioLibraryEntry[] {
  return PODCASTS.map(podcast => ({
    id: `podcast/${podcast.id}`,
    title: podcast.title,
    src: podcast.src,
    format: "MP3",
    sizeBytes: podcast.bytes,
    durationSeconds: podcast.durationSeconds,
    transcript: null,
    related: { label: "Chapters and the complete transcript", href: podcast.href },
  }));
}

let cached: AudioLibraryShelf[] | null = null;

/** The library, grouped by shelf. Empty shelves are left out. Cached for the life of a production process. */
export function listAudioLibraryShelves(): AudioLibraryShelf[] {
  if (cached && process.env.NODE_ENV === "production") return cached;
  const all: AudioLibraryShelf[] = [
    {
      id: "podcasts",
      title: "Podcasts",
      intro: "Longer conversations to listen to in full. Each podcast also has its own page with chapters and a complete transcript.",
      entries: podcastEntries(),
    },
    {
      id: "learning-examples",
      title: "Learning examples",
      intro: "Short fictional scenes from the courses, narrated with a synthetic voice. The complete spoken text is included with each recording.",
      entries: learningExampleEntries(),
    },
  ];
  const shelves = all.filter(shelf => shelf.entries.length > 0);
  cached = shelves;
  return shelves;
}

/** Total number of recordings across all shelves. */
export function countAudioLibraryEntries(shelves: readonly AudioLibraryShelf[]): number {
  return shelves.reduce((total, shelf) => total + shelf.entries.length, 0);
}
