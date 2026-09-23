import { PRACTICE_STORAGE_KEY } from "@/lib/content/learning-practice";
import { GRADUATION_PATHS } from "@/lib/content/paths";

export type PrivateBrowserStorageKey = {
  area: "local" | "session";
  key: string;
  purpose: "ask_history" | "practice_handoff" | "consultation_prefill" | "saved_request_reference" | "path_notes" | "path_progress" | "learning_notes" | "course_notes" | "course_progress" | "equity_analysis_draft";
};

export const BROWSER_STORAGE_KEYS = {
  askSession: "pac_ask_session_v2",
  equityAnalysisDraft: "pac_equity_analysis_draft_v1",
  askPracticeHandoff: "pac_ask_practice_handoff_v1",
  consultationPrefill: "pac_intake_prefill",
  recentConsultationReferences: "pac_requests_session",
  savedConsultationReferences: "pac_requests",
  learningPracticeNotes: PRACTICE_STORAGE_KEY,
  pathArtifact: (pathId: string) => `pac_artifact_${pathId}`,
  pathArtifactSource: (pathId: string) => `pac_artifact_source_${pathId}`,
  pathProgress: (pathId: string) => `pac_progress_${pathId}`,
} as const;

export const PRIVATE_BROWSER_STORAGE_KEYS: readonly PrivateBrowserStorageKey[] = [
  { area: "session", key: BROWSER_STORAGE_KEYS.askSession, purpose: "ask_history" },
  { area: "session", key: BROWSER_STORAGE_KEYS.askPracticeHandoff, purpose: "practice_handoff" },
  { area: "session", key: BROWSER_STORAGE_KEYS.consultationPrefill, purpose: "consultation_prefill" },
  { area: "session", key: BROWSER_STORAGE_KEYS.recentConsultationReferences, purpose: "saved_request_reference" },
  { area: "local", key: BROWSER_STORAGE_KEYS.savedConsultationReferences, purpose: "saved_request_reference" },
  { area: "local", key: BROWSER_STORAGE_KEYS.learningPracticeNotes, purpose: "learning_notes" },
  { area: "local", key: BROWSER_STORAGE_KEYS.equityAnalysisDraft, purpose: "equity_analysis_draft" },
  ...GRADUATION_PATHS.flatMap((path) => [
    { area: "local" as const, key: BROWSER_STORAGE_KEYS.pathArtifact(path.id), purpose: "path_notes" as const },
    { area: "local" as const, key: BROWSER_STORAGE_KEYS.pathArtifactSource(path.id), purpose: "path_notes" as const },
    { area: "local" as const, key: BROWSER_STORAGE_KEYS.pathProgress(path.id), purpose: "path_progress" as const },
  ]),
];

// Course IDs and lesson IDs share the CoursePackSchema slug grammar. Register
// the namespace rather than importing the complete course corpus into the client.
const COURSE_ID = "[a-z0-9][a-z0-9-]{0,159}";
export const PRIVATE_BROWSER_STORAGE_PATTERNS = [
  { area: "local", keyPattern: `^pac-course:${COURSE_ID}:${COURSE_ID}$`, purpose: "course_notes" },
  { area: "local", keyPattern: `^pac-course-resume:${COURSE_ID}$`, purpose: "course_progress" },
] as const;

export function isPrivateBrowserStorageKey(area: PrivateBrowserStorageKey["area"], key: string): boolean {
  return PRIVATE_BROWSER_STORAGE_KEYS.some(entry => entry.area === area && entry.key === key)
    || PRIVATE_BROWSER_STORAGE_PATTERNS.some(entry => entry.area === area && new RegExp(entry.keyPattern).test(key));
}

export function courseNoteIdentity(key: string): { courseId: string; lessonId: string } | undefined {
  if (!new RegExp(PRIVATE_BROWSER_STORAGE_PATTERNS[0].keyPattern).test(key)) return undefined;
  const [, courseId, lessonId] = key.split(":");
  return { courseId, lessonId };
}

type StorageArea = PrivateBrowserStorageKey["area"];
export type PrivateDataClearResult = { ok: boolean; failedKeys: string[]; discoveryFailed: boolean };

function browserKeys(area: StorageArea): string[] {
  if (typeof window === "undefined") return [];
  const storage = area === "local" ? window.localStorage : window.sessionStorage;
  return Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter((key): key is string => key !== null);
}

/** Snapshot dynamic keys before deletion; unrelated applications' keys remain untouched. */
export function clearRegisteredPrivateBrowserData(
  clear: (area: StorageArea, key: string, value: null) => boolean | void,
  keys: (area: StorageArea) => readonly string[] = browserKeys,
): PrivateDataClearResult {
  const entries = new Map(PRIVATE_BROWSER_STORAGE_KEYS.map(entry => [`${entry.area}:${entry.key}`, entry]));
  let discoveryFailed = false;
  // Only local storage currently has registered dynamic namespaces.
  try {
    for (const key of keys("local")) {
      const pattern = PRIVATE_BROWSER_STORAGE_PATTERNS.find(entry => new RegExp(entry.keyPattern).test(key));
      if (pattern) entries.set(`local:${key}`, { area: "local", key, purpose: pattern.purpose });
    }
  } catch { discoveryFailed = true; }
  const failedKeys: string[] = [];
  for (const entry of entries.values()) {
    try {
      if (clear(entry.area, entry.key, null) === false) failedKeys.push(`${entry.area}:${entry.key}`);
    } catch { failedKeys.push(`${entry.area}:${entry.key}`); }
  }
  return { ok: !discoveryFailed && failedKeys.length === 0, failedKeys, discoveryFailed };
}
