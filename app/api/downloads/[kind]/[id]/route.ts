import type { NextRequest } from "next/server";
import { isDownloadKind } from "@/lib/downloads/catalog";
import {
  downloadFileName,
  isAnyDownloadFormat,
  isDownloadFormat,
  type AnyDownloadFormat,
  type DownloadFormat,
  type ResourceDocument,
} from "@/lib/downloads/model";
import { downloadFormatDetails } from "@/lib/downloads/model";
import { PRODUCT_CONTEXT_COOKIE, resolveProductContext } from "@/lib/product/federation";
import { contentScopeForContext, parseProductContextView } from "@/lib/product/request-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function problem(status: number, message: string): Response {
  return Response.json({ error: message }, { status, headers: { "cache-control": "no-store" } });
}

function attachment(file: Buffer, format: AnyDownloadFormat, title: string, fallback = false): Response {
  const fileName = downloadFileName(title, format);
  const body = new ArrayBuffer(file.byteLength);
  new Uint8Array(body).set(file);
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": downloadFormatDetails(format).contentType,
      "content-disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "content-length": String(file.byteLength),
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      ...(fallback ? { "x-download-fallback": format } : {}),
    },
  });
}

function renderErrorDetail(error: unknown): { name: string; message: string } {
  if (error instanceof Error) {
    return { name: error.name.slice(0, 80), message: error.message.slice(0, 400) };
  }
  return { name: "UnknownError", message: String(error).slice(0, 400) };
}

/** One exporter per request so a missing office/pdfkit file cannot take down the other formats. */
const BINARY_EXPORTERS: Record<DownloadFormat, () => Promise<(document: ResourceDocument) => Promise<Buffer>>> = {
  docx: () => import("@/lib/downloads/exporters/docx").then((mod) => mod.renderDocx),
  xlsx: () => import("@/lib/downloads/exporters/xlsx").then((mod) => mod.renderXlsx),
  pptx: () => import("@/lib/downloads/exporters/pptx").then((mod) => mod.renderPptx),
  pdf: () => import("@/lib/downloads/exporters/pdf").then((mod) => mod.renderPdf),
};

async function fallbackFile(document: ResourceDocument, prefer: "html" | "txt" = "html"): Promise<{ file: Buffer; format: "html" | "txt" }> {
  const { renderHtml, renderText } = await import("@/lib/downloads/exporters/text");
  try {
    return { file: prefer === "txt" ? renderText(document) : renderHtml(document), format: prefer };
  } catch {
    return { file: renderText(document), format: "txt" };
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  const format = request.nextUrl.searchParams.get("format") ?? "";
  if (!isAnyDownloadFormat(format)) return problem(400, "Choose Word, Excel, PowerPoint, PDF, a web page, or plain text.");
  if (!isDownloadKind(kind)) return problem(404, "This resource is not available to download.");

  const context = parseProductContextView(request.nextUrl.searchParams.get("view"))
    ?? resolveProductContext(request.cookies.get(PRODUCT_CONTEXT_COOKIE)?.value);

  let document;
  try {
    const { resolveDownloadDocument } = await import("@/lib/downloads/resolve");
    document = await resolveDownloadDocument(kind, id, contentScopeForContext(context));
  } catch (error) {
    console.error("download_resolve_failed", { kind, format, ...renderErrorDetail(error) });
    return problem(503, "This resource could not be prepared for download.");
  }
  if (!document) return problem(404, "This resource is not available to download.");

  if (format === "html" || format === "txt") {
    try {
      const { renderHtml, renderText } = await import("@/lib/downloads/exporters/text");
      return attachment(format === "txt" ? renderText(document) : renderHtml(document), format, document.title);
    } catch (error) {
      console.error("download_fallback_failed", { kind, format, ...renderErrorDetail(error) });
      return problem(503, "This resource could not be prepared for download.");
    }
  }

  try {
    const render = await BINARY_EXPORTERS[format]();
    const file = await render(document);
    return attachment(file, format, document.title);
  } catch (error) {
    console.error("download_render_failed", { kind, format, ...renderErrorDetail(error) });
    if (!isDownloadFormat(format)) return problem(503, "This resource could not be prepared for download.");
    const fallback = await fallbackFile(document, "html");
    return attachment(fallback.file, fallback.format, document.title, true);
  }
}
