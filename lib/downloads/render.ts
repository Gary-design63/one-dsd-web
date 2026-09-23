import "server-only";
import { renderHtml, renderText } from "./exporters/text";
import { downloadFileName, downloadFormatDetails, type AnyDownloadFormat, type DownloadFormat, type ResourceDocument } from "./model";

export { downloadFileName };

/**
 * Load one binary exporter at a time. A static import of this module used to
 * pull pdfkit + docx + exceljs + pptxgenjs together, so one missing NFT file
 * made every binary format fall back to HTML.
 */
const BINARY_EXPORTERS: Record<DownloadFormat, () => Promise<(document: ResourceDocument) => Promise<Buffer>>> = {
  docx: () => import("./exporters/docx").then((mod) => mod.renderDocx),
  xlsx: () => import("./exporters/xlsx").then((mod) => mod.renderXlsx),
  pptx: () => import("./exporters/pptx").then((mod) => mod.renderPptx),
  pdf: () => import("./exporters/pdf").then((mod) => mod.renderPdf),
};

export async function renderResourceDocument(document: ResourceDocument, format: AnyDownloadFormat): Promise<Buffer> {
  switch (format) {
    case "docx":
    case "xlsx":
    case "pptx":
    case "pdf":
      return (await BINARY_EXPORTERS[format]())(document);
    case "html":
      return renderHtml(document);
    case "txt":
      return renderText(document);
  }
}

export function renderFallbackDocument(document: ResourceDocument, format: "html" | "txt" = "html"): Buffer {
  return format === "txt" ? renderText(document) : renderHtml(document);
}

export function downloadContentType(format: AnyDownloadFormat): string {
  return downloadFormatDetails(format).contentType;
}
