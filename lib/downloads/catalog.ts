import type { AnyDownloadFormat } from "./model";

/** Resource kinds staff can download. Courses are deliberately absent: they stay inside the program. */
export const DOWNLOAD_KINDS = [
  "library",
  "scenario",
  "program",
  "amplify",
  "team",
  "leadership",
  "brief",
  "path",
  "area",
  "equity-toolkit",
  "community-connections",
  "learning-journey",
  "measurement",
  "sources",
  "equity-framework",
  "operationalizing-equity",
  "understanding-dhs",
  "support-directory",
  "toolkit-studio",
] as const;
export type DownloadKind = (typeof DOWNLOAD_KINDS)[number];

export function isDownloadKind(value: string): value is DownloadKind {
  return (DOWNLOAD_KINDS as readonly string[]).includes(value);
}

export type DownloadScope = "one-dhs" | "dsd";

export function downloadHref(kind: DownloadKind, id: string, format: AnyDownloadFormat, scope?: DownloadScope): string {
  const query = new URLSearchParams({ format });
  if (scope) query.set("view", scope === "dsd" ? "one_dsd" : "one_dhs");
  return `/api/downloads/${kind}/${encodeURIComponent(id)}?${query.toString()}`;
}
