import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));

const FORBIDDEN_PREFIXES = [
  "models/bge-small-en-v1.5/",
  "node_modules/onnxruntime-node/",
  "node_modules/onnxruntime-common/",
  "node_modules/@huggingface/transformers/",
];

const REQUIRED_PDFKIT_AFM = "node_modules/pdfkit/js/data/Helvetica.afm";
const REQUIRED_PDFKIT_STD = "node_modules/pdfkit/js/standard-fonts/Helvetica.cjs";

/**
 * AFM must be present (force-included data). Office JS must be reachable in
 * the NFT via import tracing — package.json / entry files, not full trees.
 * pptxgenjs loads jszip at import time; keep the jszip graph in the NFT.
 * Do not raise BYTE_BUDGET unless a slim trace still exceeds 80 MiB.
 */
export const REQUIRED_DOWNLOAD_PACKAGES = {
  pdfkit: [REQUIRED_PDFKIT_AFM, REQUIRED_PDFKIT_STD, "node_modules/pdfkit/package.json"],
  docx: ["node_modules/docx/package.json"],
  exceljs: ["node_modules/exceljs/package.json"],
  pptxgenjs: ["node_modules/pptxgenjs/package.json"],
  jszip: ["node_modules/jszip/package.json", "node_modules/jszip/lib/index.js"],
  pako: ["node_modules/pako/package.json"],
  fontkit: ["node_modules/fontkit/package.json"],
  linebreak: ["node_modules/linebreak/package.json"],
};

const BYTE_BUDGET = 80 * 1024 * 1024;

export function downloadTracePath(root = rootDirectory) {
  return path.join(root, ".next/server/app/api/downloads/[kind]/[id]/route.js.nft.json");
}

function findTraced(files, expected) {
  return [...files.keys()].find((name) => name === expected || name.endsWith(`/${expected}`));
}

export async function verifyDownloadTrace({ root = rootDirectory } = {}) {
  const tracePath = downloadTracePath(root);
  const trace = JSON.parse(await readFile(tracePath, "utf8"));
  const files = new Map();
  for (const entry of trace.files) {
    const absolute = path.resolve(path.dirname(tracePath), entry);
    const relative = path.relative(root, absolute).replaceAll("\\", "/");
    if (!relative.startsWith("../") && !path.isAbsolute(relative)) files.set(relative, absolute);
  }

  const forbidden = [...files.keys()].filter((name) => FORBIDDEN_PREFIXES.some((prefix) => name.startsWith(prefix)));
  if (forbidden.length) {
    throw new Error("Download function trace includes the ASK/ONNX graph: " + forbidden.slice(0, 8).join(", "));
  }

  const packages = {};
  const missing = [];
  for (const [pkg, candidates] of Object.entries(REQUIRED_DOWNLOAD_PACKAGES)) {
    const found = [];
    for (const file of candidates) {
      const hit = findTraced(files, file);
      if (hit) found.push(hit);
    }
    if (found.length < candidates.length) missing.push(pkg);
    else packages[pkg] = found[0];
  }
  if (missing.length) {
    throw new Error("Download function trace is missing binary packages: " + missing.join(", "));
  }

  const pdfkit = findTraced(files, REQUIRED_PDFKIT_AFM) || packages.pdfkit;
  if (!pdfkit) throw new Error("Download function trace is missing pdfkit AFM data.");
  if (!findTraced(files, REQUIRED_PDFKIT_STD)) {
    throw new Error("Download function trace is missing pdfkit standard-fonts (Helvetica.cjs).");
  }

  let bytes = 0;
  for (const file of files.values()) bytes += (await stat(file)).size;
  if (bytes > BYTE_BUDGET) throw new Error("Download function trace exceeds its 80 MiB packaging budget.");

  return { ok: true, tracedFiles: files.size, tracedBytes: bytes, pdfkit, packages };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await verifyDownloadTrace(), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
