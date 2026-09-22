import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { REQUIRED_DOWNLOAD_PACKAGES, verifyDownloadTrace } from "../scripts/verify-download-trace.mjs";

const temporaryBase = path.resolve(tmpdir());
const directories: string[] = [];

afterEach(async () => {
  for (const directory of directories.splice(0)) {
    const target = path.resolve(directory);
    if (path.dirname(target) !== temporaryBase || !path.basename(target).startsWith("pac-download-guard-test-")) {
      throw new Error("Unsafe test cleanup target");
    }
    await rm(target, { recursive: true, force: true });
  }
});

const REQUIRED_TRACE_FILES = [
  ...new Set(Object.values(REQUIRED_DOWNLOAD_PACKAGES).flat()),
  "lib/downloads/catalog.js",
];

async function fixture(extra: string[] = [], omit: string[] = []) {
  const root = await mkdtemp(path.join(temporaryBase, "pac-download-guard-test-"));
  directories.push(root);
  const files = [...REQUIRED_TRACE_FILES.filter((file) => !omit.includes(file)), ...extra];
  for (const file of files) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), "synthetic download trace fixture");
  }
  const trace = path.join(root, ".next/server/app/api/downloads/[kind]/[id]/route.js.nft.json");
  await mkdir(path.dirname(trace), { recursive: true });
  await writeFile(trace, JSON.stringify({
    version: 1,
    files: files.map((file) => path.relative(path.dirname(trace), path.join(root, file))),
  }));
  return root;
}

describe("download function trace guard", () => {
  it("accepts a slim trace with AFM plus reachable office JS, not full package trees", async () => {
    const root = await fixture();
    const result = await verifyDownloadTrace({ root });
    expect(result).toMatchObject({
      ok: true,
      pdfkit: "node_modules/pdfkit/js/data/Helvetica.afm",
      packages: {
        pdfkit: "node_modules/pdfkit/js/data/Helvetica.afm",
        docx: "node_modules/docx/package.json",
        exceljs: "node_modules/exceljs/package.json",
        pptxgenjs: "node_modules/pptxgenjs/package.json",
        jszip: "node_modules/jszip/package.json",
        pako: "node_modules/pako/package.json",
        fontkit: "node_modules/fontkit/package.json",
        linebreak: "node_modules/linebreak/package.json",
      },
    });
  });

  it("fails when pdfkit standard-fonts are missing from the NFT", async () => {
    const root = await fixture([], ["node_modules/pdfkit/js/standard-fonts/Helvetica.cjs"]);
    await expect(verifyDownloadTrace({ root })).rejects.toThrow("missing binary packages: pdfkit");
  });

  it("fails when a binary exporter package is missing from the NFT", async () => {
    const root = await fixture([], ["node_modules/docx/package.json"]);
    await expect(verifyDownloadTrace({ root })).rejects.toThrow("missing binary packages: docx");
  });

  it("fails when the pptx jszip runtime graph is missing from the NFT", async () => {
    const root = await fixture([], ["node_modules/jszip/lib/index.js"]);
    await expect(verifyDownloadTrace({ root })).rejects.toThrow("missing binary packages: jszip");
  });

  it("fails when the ASK/ONNX graph is packaged with downloads", async () => {
    const root = await fixture(["models/bge-small-en-v1.5/onnx/model_quantized.onnx"]);
    await expect(verifyDownloadTrace({ root })).rejects.toThrow("ASK/ONNX");
  });

  it("keeps ONNX/ASK excludes from matching office or pdfkit trees", async () => {
    const { default: picomatch } = await import("next/dist/compiled/picomatch");
    const root = process.cwd();
    const pageDir = path.join(root, ".next/server/app/api/downloads/[kind]/[id]");
    const excludes = [
      "./models/bge-small-en-v1.5/**/*",
      "./node_modules/onnxruntime-node/**/*",
      "./node_modules/onnxruntime-common/**/*",
      "./node_modules/@huggingface/transformers/**/*",
    ].map((pattern) => path.join(root, pattern));
    const isExcluded = picomatch(excludes, { dot: true, contains: true });
    const keep = [
      "node_modules/pdfkit/js/data/Helvetica.afm",
      "node_modules/pdfkit/js/standard-fonts/Helvetica.cjs",
      "node_modules/pdfkit/package.json",
      "node_modules/fontkit/package.json",
      "node_modules/docx/package.json",
      "node_modules/exceljs/package.json",
      "node_modules/pptxgenjs/package.json",
      "node_modules/jszip/package.json",
      "node_modules/jszip/lib/index.js",
      "node_modules/pako/package.json",
    ];
    for (const file of keep) {
      const relative = path.relative(pageDir, path.join(root, file));
      expect(isExcluded(path.join(pageDir, relative)), file).toBe(false);
    }
    expect(isExcluded(path.join(root, "node_modules/onnxruntime-node/package.json"))).toBe(true);
    expect(isExcluded(path.join(root, "models/bge-small-en-v1.5/public-document-vectors.json"))).toBe(true);
  });

  it("keeps the 80 MiB packaging budget unless a measured slim trace still exceeds it", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(new URL("../scripts/verify-download-trace.mjs", import.meta.url), "utf8");
    expect(source).toContain("const BYTE_BUDGET = 80 * 1024 * 1024");
    expect(source).not.toMatch(/BYTE_BUDGET\s*=\s*(?!80 \* 1024 \* 1024)\d+/);
  });
});
