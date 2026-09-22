import { downloadHref, type DownloadKind, type DownloadScope } from "@/lib/downloads/catalog";
import { DOWNLOAD_FORMATS, DOWNLOAD_FORMAT_DETAILS, FALLBACK_DOWNLOAD_FORMATS, FALLBACK_DOWNLOAD_FORMAT_DETAILS } from "@/lib/downloads/model";

type ResourceDownloadsProps = {
  kind: DownloadKind;
  id: string;
  /** What the control calls the thing being downloaded. */
  noun?: string;
  /** The program view the page is showing, so the file matches the page. */
  scope?: DownloadScope;
  compact?: boolean;
};

/**
 * Word, Excel, PowerPoint and PDF copies of a resource, built from the same published
 * wording the page shows. Available to everyone; nothing personal is attached.
 */
export function ResourceDownloads({ kind, id, noun = "resource", scope, compact = false }: ResourceDownloadsProps) {
  return (
    <div
      data-resource-download="true"
      role="group"
      aria-label={`Download this ${noun}`}
      className={compact ? "inline-flex flex-wrap items-center gap-2 print:hidden" : "mt-4 flex flex-wrap items-center gap-2 print:hidden"}
    >
      <span className="text-sm font-bold">Download this {noun}:</span>
      {DOWNLOAD_FORMATS.map((format) => (
        <a
          key={format}
          className="btn btn--light !min-h-0 !px-3 !py-1 !text-sm"
          href={downloadHref(kind, id, format, scope)}
          download
          aria-label={`Download this ${noun} as ${DOWNLOAD_FORMAT_DETAILS[format].label}`}
        >
          {DOWNLOAD_FORMAT_DETAILS[format].label}
        </a>
      ))}
      {FALLBACK_DOWNLOAD_FORMATS.map((format) => (
        <a
          key={format}
          className="btn btn--light !min-h-0 !px-3 !py-1 !text-sm"
          href={downloadHref(kind, id, format, scope)}
          download
          aria-label={`Download this ${noun} as ${FALLBACK_DOWNLOAD_FORMAT_DETAILS[format].label}`}
        >
          {FALLBACK_DOWNLOAD_FORMAT_DETAILS[format].label}
        </a>
      ))}
    </div>
  );
}
