import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/downloads/[kind]/[id]/route";
import { PROGRAM } from "@/lib/constants";
import { AMPLIFY_PAGES } from "@/lib/content/amplify";
import { listBriefs } from "@/lib/content/briefs";
import { NATIVE_DEFERENCE_COMMUNITY_IDS } from "@/lib/content/community-presentation";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { DOMAINS } from "@/lib/domains";
import { DOWNLOAD_KINDS, downloadHref, isDownloadKind, type DownloadKind } from "@/lib/downloads/catalog";
import { DOWNLOAD_FORMATS, DOWNLOAD_FORMAT_DETAILS, type DownloadFormat } from "@/lib/downloads/model";
import { downloadContentType, downloadFileName, renderResourceDocument } from "@/lib/downloads/render";
import { resolveDownloadDocument, SINGLETON_IDS } from "@/lib/downloads/resolve";
import { DSD_PROGRAMS, DSD_SCENARIOS } from "@/lib/dsd";

/** A real, published id for each kind of resource the program offers to download. */
async function sampleId(kind: DownloadKind): Promise<string> {
  switch (kind) {
    case "library": {
      const snapshot = await loadStaffContentSnapshot({ scope: "one-dhs" });
      return snapshot.items.find((item) => item.status === "approved")!.id;
    }
    case "scenario":
      return DSD_SCENARIOS[0].id;
    case "program":
      return DSD_PROGRAMS[0].id;
    case "amplify":
      return AMPLIFY_PAGES[0].id;
    case "brief":
      return listBriefs().find((brief) => !(NATIVE_DEFERENCE_COMMUNITY_IDS as readonly string[]).includes(brief.id))!.id;
    case "path":
      return GRADUATION_PATHS[0].id;
    case "area":
      return DOMAINS[0].id;
    case "toolkit-studio":
      return "insights-checklist";
    default:
      return SINGLETON_IDS[kind];
  }
}

const MAGIC: Record<DownloadFormat, string> = { docx: "PK", xlsx: "PK", pptx: "PK", pdf: "%PDF-" };

function request(path: string): NextRequest {
  return new NextRequest(`http://localhost${path}`);
}

async function download(kind: string, id: string, query: string) {
  return GET(request(`/api/downloads/${kind}/${encodeURIComponent(id)}${query}`), { params: Promise.resolve({ kind, id }) });
}

describe("resource downloads", () => {
  it("never offers a course for download", () => {
    expect(isDownloadKind("course")).toBe(false);
    expect(isDownloadKind("lesson")).toBe(false);
    expect(DOWNLOAD_KINDS).not.toContain("course");
  });

  /** Pages that exist only in One DSD keep the One DSD program name whatever view the visitor chose. */
  const ONE_DSD_ONLY: readonly DownloadKind[] = ["scenario", "program", "amplify", "team", "leadership"];

  it.each(DOWNLOAD_KINDS)("builds a complete document from the published wording for %s", async (kind) => {
    const document = await resolveDownloadDocument(kind, await sampleId(kind), "one-dhs");
    expect(document, kind).not.toBeNull();
    expect(document!.title.trim().length).toBeGreaterThan(0);
    expect(document!.sections.length).toBeGreaterThan(0);
    expect(document!.sections.every((section) => section.blocks.length > 0)).toBe(true);
    expect(document!.attribution).toBe(ONE_DSD_ONLY.includes(kind) ? PROGRAM.oneDsdProgramName : PROGRAM.fullName);
  }, 20_000);

  it.each(DOWNLOAD_KINDS)("renders Word, Excel, PowerPoint and PDF files for %s", async (kind) => {
    const document = (await resolveDownloadDocument(kind, await sampleId(kind), "one-dhs"))!;
    for (const format of DOWNLOAD_FORMATS) {
      const file = await renderResourceDocument(document, format);
      expect(file.byteLength, `${kind} ${format}`).toBeGreaterThan(1000);
      expect(file.subarray(0, MAGIC[format].length).toString("latin1"), `${kind} ${format}`).toBe(MAGIC[format]);
    }
  }, 60_000);

  it("follows the program view the page is showing", async () => {
    const oneDsd = await resolveDownloadDocument("equity-toolkit", SINGLETON_IDS["equity-toolkit"], "dsd");
    const oneDhs = await resolveDownloadDocument("equity-toolkit", SINGLETON_IDS["equity-toolkit"], "one-dhs");
    expect(oneDsd!.attribution).toBe(PROGRAM.oneDsdProgramName);
    expect(oneDhs!.attribution).toBe(PROGRAM.fullName);
  });

  it("rejects ids that do not exist or do not match a single-page resource", async () => {
    expect(await resolveDownloadDocument("library", "not-a-resource", "one-dhs")).toBeNull();
    expect(await resolveDownloadDocument("scenario", "not-a-scenario", "one-dhs")).toBeNull();
    expect(await resolveDownloadDocument("brief", "not-a-community", "one-dhs")).toBeNull();
    expect(await resolveDownloadDocument("equity-framework", "something-else", "one-dhs")).toBeNull();
  });

  it("names files after the resource and the chosen format", () => {
    expect(downloadFileName("Equity Analysis Toolkit: a companion / for staff", "docx")).toBe("equity-analysis-toolkit-a-companion-for-staff.docx");
    expect(downloadFileName("   ", "pdf")).toMatch(/^[a-z0-9-]+\.pdf$/);
    for (const format of DOWNLOAD_FORMATS) expect(downloadContentType(format)).toBe(DOWNLOAD_FORMAT_DETAILS[format].contentType);
  });

  it("links each button to the download route in the page's own view", () => {
    expect(downloadHref("library", "ja access/checks", "docx")).toBe("/api/downloads/library/ja%20access%2Fchecks?format=docx");
    expect(downloadHref("scenario", "dsd-hiring-panel", "pdf", "dsd")).toBe("/api/downloads/scenario/dsd-hiring-panel?format=pdf&view=one_dsd");
    expect(downloadHref("path", "hiring", "xlsx", "one-dhs")).toBe("/api/downloads/path/hiring?format=xlsx&view=one_dhs");
  });
});

describe("download route", () => {
  it("sends the file as an attachment with the right type and no caching", async () => {
    const id = await sampleId("library");
    const response = await download("library", id, "?format=pdf");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toMatch(/^attachment; filename="[a-z0-9-]+\.pdf"; filename\*=UTF-8''/);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    const body = Buffer.from(await response.arrayBuffer());
    expect(body.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(response.headers.get("content-length")).toBe(String(body.byteLength));
  });

  it.each(DOWNLOAD_FORMATS)("serves %s for a One DSD page when the page asks for that view", async (format) => {
    const response = await download("scenario", DSD_SCENARIOS[0].id, `?format=${format}&view=one_dsd`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(DOWNLOAD_FORMAT_DETAILS[format].contentType);
    const body = Buffer.from(await response.arrayBuffer());
    expect(body.subarray(0, MAGIC[format].length).toString("latin1")).toBe(MAGIC[format]);
  });

  it.each([
    ["equity-framework", "framework", ""],
    ["toolkit-studio", "insights-checklist", ""],
    ["amplify", "materials", "&view=one_dsd"],
  ] as const)("serves binary attachments for %s/%s without html fallback", async (kind, id, extra) => {
    for (const format of DOWNLOAD_FORMATS) {
      const response = await download(kind, id, `?format=${format}${extra}`);
      expect(response.status, `${kind} ${format}`).toBe(200);
      expect(response.headers.get("x-download-fallback"), `${kind} ${format}`).toBeNull();
      expect(response.headers.get("content-type"), `${kind} ${format}`).toBe(DOWNLOAD_FORMAT_DETAILS[format].contentType);
      const body = Buffer.from(await response.arrayBuffer());
      expect(body.subarray(0, MAGIC[format].length).toString("latin1"), `${kind} ${format}`).toBe(MAGIC[format]);
    }
  }, 60_000);

  it("asks for a supported format before doing any work", async () => {
    const id = await sampleId("library");
    for (const query of ["", "?format=", "?format=rtf", "?format=DOCX"]) {
      const response = await download("library", id, query);
      expect(response.status, query).toBe(400);
      expect(await response.json()).toEqual({ error: "Choose Word, Excel, PowerPoint, PDF, a web page, or plain text." });
    }
  });

  it("keeps courses and unknown resources off the download route", async () => {
    for (const [kind, id] of [["course", "plain-language-in-human-services"], ["lesson", "anything"], ["library", "not-a-resource"], ["team", "someone-else"], ["", ""]]) {
      const response = await download(kind, id, "?format=docx");
      expect(response.status, `${kind}/${id}`).toBe(404);
      expect(await response.json()).toEqual({ error: "This resource is not available to download." });
    }
  });

  /**
   * Prod prove after deploy (sitewide — not equity-framework only).
   * Do not treat x-download-fallback: html as success.
   *
   *   HOST=https://one-dhs-pac.vercel.app
   *   for spec in \
   *     equity-framework/framework \
   *     toolkit-studio/insights-checklist \
   *     amplify/materials \
   *     library/ext-dhs-equity-toolkit \
   *     path/gp-1; do
   *     for fmt in docx pdf pptx xlsx txt; do
   *       curl -sS -D - -o /tmp/dl.bin -w "%{http_code} %{size_download} %{content_type}\n" \
   *         "$HOST/api/downloads/$spec?format=$fmt"
   *     done
   *   done
   * Binaries: HTTP 200, no x-download-fallback, magic PK\\x03\\x04 or %PDF-
   * txt: text/plain, no fallback header.
   */
  it("serves HTML and plain text without loading a binary renderer", async () => {
    const response = await download("equity-framework", "framework", "?format=html");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/text\/html/);
    const html = Buffer.from(await response.arrayBuffer()).toString("utf8");
    expect(html).toContain("<html");
    expect(html.length).toBeGreaterThan(200);

    const text = await download("equity-framework", "framework", "?format=txt");
    expect(text.status).toBe(200);
    expect(Buffer.from(await text.arrayBuffer()).toString("utf8").length).toBeGreaterThan(50);
  });
});

describe("download function packaging", () => {
  it("does not attach the ASK/ONNX graph to every serverless function", async () => {
    const { readFileSync } = await import("node:fs");
    const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
    const includes = config.match(/outputFileTracingIncludes:\s*\{[\s\S]*?\n  \},/);
    expect(includes?.[0]).toBeDefined();
    expect(includes?.[0]).not.toContain('"/*"');
    expect(includes?.[0]).not.toContain('"/api/ask"');
    expect(includes?.[0]).toContain('"/api/consultant/**"');
    expect(includes?.[0]).toContain('"/api/downloads/**"');
    expect(includes?.[0]).not.toContain('"/api/downloads/[kind]/[id]"');
    expect(includes?.[0]).toContain("downloadRuntimeIncludes");
    expect(config).toContain("const downloadRuntimeIncludes");
    expect(config).toContain("./node_modules/pdfkit/js/data/**/*");
    // pptxgenjs requires jszip at load; keep the small zip graph, not office trees.
    expect(config).toContain("./node_modules/jszip/**/*");
    expect(config).toContain("./node_modules/pako/**/*");
    expect(config).toContain("./node_modules/lie/**/*");
    expect(config).toContain("./node_modules/immediate/**/*");
    expect(config).toContain("./node_modules/setimmediate/**/*");
    // Data/runtime assets only — whole-package trees blew the 80 MiB NFT budget.
    expect(config).not.toContain("./node_modules/pdfkit/**/*");
    expect(config).not.toContain("./node_modules/pdfkit/js/standard-fonts/**/*");
    expect(config).not.toContain("./node_modules/docx/**/*");
    expect(config).not.toContain("./node_modules/exceljs/**/*");
    expect(config).not.toContain("./node_modules/pptxgenjs/**/*");
    expect(config).not.toContain("./node_modules/fontkit/**/*");
    expect(config).not.toContain("./node_modules/linebreak/**/*");
    const excludes = config.match(/outputFileTracingExcludes:\s*\{[\s\S]*?\n  \},/);
    expect(excludes?.[0]).toBeDefined();
    expect(excludes?.[0]).toContain('"/api/downloads/**"');
    expect(excludes?.[0]).toContain("./models/bge-small-en-v1.5/**/*");
    expect(excludes?.[0]).toContain("./node_modules/onnxruntime-node/**/*");
    expect(excludes?.[0]).toContain("./node_modules/onnxruntime-common/**/*");
    expect(excludes?.[0]).toContain("./node_modules/@huggingface/transformers/**/*");
    // ONNX/ASK excludes stay; they must not name office/pdfkit trees.
    expect(excludes?.[0]).not.toMatch(/pdfkit|fontkit|linebreak|docx|exceljs|pptxgenjs|jszip/);
    expect(config).toContain('"pptxgenjs", "jszip", "pdfkit"');
  });

  it("loads one binary exporter per format and logs the render error message", async () => {
    const { readFileSync } = await import("node:fs");
    const route = readFileSync(new URL("../app/api/downloads/[kind]/[id]/route.ts", import.meta.url), "utf8");
    const render = readFileSync(new URL("../lib/downloads/render.ts", import.meta.url), "utf8");
    expect(route).toContain('import("@/lib/downloads/exporters/docx")');
    expect(route).toContain('import("@/lib/downloads/exporters/xlsx")');
    expect(route).toContain('import("@/lib/downloads/exporters/pptx")');
    expect(route).toContain('import("@/lib/downloads/exporters/pdf")');
    expect(route).not.toContain('import("@/lib/downloads/render")');
    expect(route).toContain("download_render_failed");
    expect(route).toContain("error.message");
    expect(render).not.toContain('from "./exporters/docx"');
    expect(render).not.toContain('from "./exporters/pdf"');
    expect(render).toContain('import("./exporters/docx")');
    expect(render).toContain('import("./exporters/pdf")');
  });

  it("keeps download adapters off the client editor module", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const adapters = ["community.ts", "learning.ts", "one-dsd.ts", "practice.ts", "program.ts"];
    for (const file of adapters) {
      const source = readFileSync(resolve(process.cwd(), "lib/downloads/adapters", file), "utf8");
      expect(source, file).toContain("@/lib/content/prepare-editable-surface");
      expect(source, file).not.toContain("@/components/editable-surface");
    }
  });
});
