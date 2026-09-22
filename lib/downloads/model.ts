export type InlineRun = { text: string; bold?: boolean; italic?: boolean };

export type DocumentBlock =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; runs: InlineRun[] }
  | { kind: "list"; ordered?: boolean; items: InlineRun[][] }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "quote"; text: string; cite?: string }
  | { kind: "callout"; label?: string; text: string }
  | { kind: "fields"; rows: { label: string; value: string }[] };

export type DocumentSection = { heading?: string; blocks: DocumentBlock[] };

export type DocumentSource = { title: string; href?: string; note?: string };

export type ResourceDocument = {
  kicker?: string;
  title: string;
  subtitle?: string;
  meta: { label: string; value: string }[];
  sections: DocumentSection[];
  sources?: DocumentSource[];
  attribution: string;
};

export const DOWNLOAD_FORMATS = ["docx", "xlsx", "pptx", "pdf"] as const;
export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

/** Always-available copies when a binary renderer fails (D1). */
export const FALLBACK_DOWNLOAD_FORMATS = ["html", "txt"] as const;
export type FallbackDownloadFormat = (typeof FALLBACK_DOWNLOAD_FORMATS)[number];
export type AnyDownloadFormat = DownloadFormat | FallbackDownloadFormat;

export const DOWNLOAD_FORMAT_DETAILS: Record<
  DownloadFormat,
  { label: string; application: string; contentType: string }
> = {
  docx: {
    label: "Word",
    application: "Microsoft Word",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  xlsx: {
    label: "Excel",
    application: "Microsoft Excel",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  pptx: {
    label: "PowerPoint",
    application: "Microsoft PowerPoint",
    contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  pdf: { label: "PDF", application: "PDF", contentType: "application/pdf" },
};

export const FALLBACK_DOWNLOAD_FORMAT_DETAILS: Record<
  FallbackDownloadFormat,
  { label: string; application: string; contentType: string }
> = {
  html: { label: "Web page", application: "Web page", contentType: "text/html; charset=utf-8" },
  txt: { label: "Plain text", application: "Plain text", contentType: "text/plain; charset=utf-8" },
};

export function isDownloadFormat(value: string): value is DownloadFormat {
  return (DOWNLOAD_FORMATS as readonly string[]).includes(value);
}

export function isAnyDownloadFormat(value: string): value is AnyDownloadFormat {
  return isDownloadFormat(value) || (FALLBACK_DOWNLOAD_FORMATS as readonly string[]).includes(value);
}

export function downloadFormatDetails(format: AnyDownloadFormat): { label: string; application: string; contentType: string } {
  return isDownloadFormat(format) ? DOWNLOAD_FORMAT_DETAILS[format] : FALLBACK_DOWNLOAD_FORMAT_DETAILS[format];
}

export function downloadFileName(title: string, format: AnyDownloadFormat): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${slug || "resource"}.${format}`;
}

export function runs(text: string): InlineRun[] {
  const trimmed = text.trim();
  return trimmed ? [{ text: trimmed }] : [];
}

export function runsToText(value: InlineRun[]): string {
  return value.map((run) => run.text).join("");
}

export function heading(text: string, level: 2 | 3 = 3): DocumentBlock {
  return { kind: "heading", level, text };
}

export function paragraph(value: string | InlineRun[]): DocumentBlock {
  return { kind: "paragraph", runs: typeof value === "string" ? runs(value) : value };
}

export function bullets(items: ReadonlyArray<string | InlineRun[]>, ordered = false): DocumentBlock {
  return {
    kind: "list",
    ordered,
    items: items.map((item) => (typeof item === "string" ? runs(item) : item)).filter((item) => item.length > 0),
  };
}

export function numbered(items: ReadonlyArray<string | InlineRun[]>): DocumentBlock {
  return bullets(items, true);
}

export function table(headers: ReadonlyArray<string>, rows: ReadonlyArray<ReadonlyArray<string>>): DocumentBlock {
  return { kind: "table", headers: [...headers], rows: rows.map((row) => [...row]) };
}

export function quote(text: string, cite?: string): DocumentBlock {
  return { kind: "quote", text, cite };
}

export function callout(text: string, label?: string): DocumentBlock {
  return { kind: "callout", text, label };
}

export function fields(rows: { label: string; value: string }[]): DocumentBlock {
  return { kind: "fields", rows: rows.filter((row) => row.value.trim().length > 0) };
}

export function section(heading: string | undefined, blocks: Array<DocumentBlock | null | undefined | false>): DocumentSection {
  return { heading, blocks: blocks.filter((block): block is DocumentBlock => Boolean(block)) };
}

export function compactSections(sections: DocumentSection[]): DocumentSection[] {
  return sections.filter((entry) => entry.blocks.length > 0);
}
