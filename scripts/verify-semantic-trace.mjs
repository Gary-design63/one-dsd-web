import { createHash, randomUUID } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const modulePrefixes = ["node_modules/@huggingface/transformers/", "node_modules/onnxruntime-node/", "node_modules/onnxruntime-common/", "node_modules/sharp/", "node_modules/@img/", "node_modules/detect-libc/", "node_modules/semver/"];
// Staff POST /api/ask is fail-closed (browse/download only) and no longer imports the
// typed Ask pipeline, so its NFT does not contain @huggingface/transformers. Owner
// readiness checks still run askConcierge via eval.run_cases.
export const SEMANTIC_RUNTIME_TRACE = ".next/server/app/api/consultant/evals/route.js.nft.json";
export function isPackagedSemanticFile(name, platform = process.platform, arch = process.arch) {
  if (name.startsWith("models/bge-small-en-v1.5/")) return true;
  if (!modulePrefixes.some(prefix => name.startsWith(prefix))) return false;
  // CPU inference only. GPU provider libraries are unused on Vercel and exceed the budget.
  if (/onnxruntime_providers_(cuda|tensorrt)/i.test(name)) return false;
  if (name.includes("napi-v6/") && !name.includes(`napi-v6/${platform}/${arch}/`)) return false;
  if (/sharp-(?:libvips-)?(?:linuxmusl|darwin|win32|wasm32)/i.test(name)) return false;
  return true;
}
export function requiredSemanticTraceFiles(platform = process.platform, arch = process.arch) {
  const native = `node_modules/onnxruntime-node/bin/napi-v6/${platform}/${arch}/`;
  const shared = platform === "win32" ? "onnxruntime.dll" : platform === "darwin" ? "libonnxruntime.1.dylib" : "libonnxruntime.so.1";
  return ["models/bge-small-en-v1.5/manifest.json", "models/bge-small-en-v1.5/onnx/model_quantized.onnx", "models/bge-small-en-v1.5/public-document-vectors.json", "node_modules/@huggingface/transformers/package.json", "node_modules/@huggingface/transformers/dist/transformers.node.mjs", "node_modules/onnxruntime-node/package.json", "node_modules/onnxruntime-node/dist/index.js", "node_modules/onnxruntime-common/package.json", "node_modules/onnxruntime-common/dist/esm/index.js", "node_modules/onnxruntime-common/dist/cjs/index.js", "node_modules/sharp/package.json", "node_modules/sharp/dist/index.mjs", native + "onnxruntime_binding.node", native + shared];
}

export async function verifySemanticTrace({ root = rootDirectory, platform = process.platform, arch = process.arch, smoke = true } = {}) {
  const tracePath = path.join(root, SEMANTIC_RUNTIME_TRACE);
  const trace = JSON.parse(await readFile(tracePath, "utf8"));
  const files = new Map();
  for (const entry of trace.files) {
    const absolute = path.resolve(path.dirname(tracePath), entry);
    const relative = path.relative(root, absolute).replaceAll("\\", "/");
    if (!relative.startsWith("../") && !path.isAbsolute(relative)) files.set(relative, absolute);
  }
  const required = requiredSemanticTraceFiles(platform, arch);
  const missing = required.filter(file => !files.has(file));
  if (missing.length) throw new Error("Semantic function trace is incomplete: " + missing.join(", "));
  for (const file of required) if (!(await stat(files.get(file))).isFile()) throw new Error("Semantic trace entry is not a file: " + file);
  const selected = [...files].filter(([name]) => isPackagedSemanticFile(name, platform, arch));
  let bytes = 0;
  for (const [, file] of selected) bytes += (await stat(file)).size;
  if (bytes > 245 * 1024 * 1024) throw new Error("Semantic dependency closure exceeds its 245 MiB packaging budget.");
  const result = { ok: true, platform, arch, trace: SEMANTIC_RUNTIME_TRACE, requiredFiles: required.length, tracedDependencyFiles: selected.length, tracedDependencyBytes: bytes, isolatedInference: false };
  if (!smoke) return result;
  if (platform !== process.platform || arch !== process.arch) throw new Error("Isolated inference must run on the actual build platform.");
  const temporaryBase = path.resolve(tmpdir());
  const temporary = await mkdtemp(path.join(temporaryBase, "pac-semantic-trace-"));
  try {
    for (const [relative, source] of selected) {
      const destination = path.join(temporary, relative);
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(source, destination);
    }
    const model = path.join(temporary, "models/bge-small-en-v1.5");
    const manifest = JSON.parse(await readFile(path.join(model, "manifest.json"), "utf8"));
    for (const expected of [...manifest.files, manifest.vectorProjection]) {
      const contents = await readFile(path.join(model, expected.name));
      if ((expected.bytes !== undefined && contents.length !== expected.bytes) || createHash("sha256").update(contents).digest("hex") !== expected.sha256) throw new Error("Traced semantic model integrity failed.");
    }
    const probe = `import { env, pipeline } from './node_modules/@huggingface/transformers/dist/transformers.node.mjs';\nenv.allowRemoteModels=false; env.allowLocalModels=true; env.useFSCache=false;\nconst model=await pipeline('feature-extraction',process.cwd()+'/models/bge-small-en-v1.5',{local_files_only:true,dtype:'q8',device:'cpu',session_options:{intraOpNumThreads:2,interOpNumThreads:1}});\nconst value=await model('Make information accessible to colleagues.',{pooling:'cls',normalize:true});\nif(value.dims[1]!==384||!Array.from(value.data).every(Number.isFinite))throw new Error('invalid embedding');\nawait model.dispose();\nconsole.log('PAC_ISOLATED_SEMANTIC_OK');\n`;
    const probePath = path.join(temporary, `probe-${randomUUID()}.mjs`);
    await writeFile(probePath, probe);
    const childEnv = {};
    for (const key of ["PATH", "Path", "SystemRoot", "WINDIR", "TEMP", "TMP", "TMPDIR"]) if (process.env[key]) childEnv[key] = process.env[key];
    const run = spawnSync(process.execPath, [probePath], { cwd: temporary, env: childEnv, encoding: "utf8", windowsHide: true, timeout: 60_000 });
    if (run.status !== 0 || !run.stdout.includes("PAC_ISOLATED_SEMANTIC_OK")) {
      const code = run.error?.code || "inference_failed";
      // This child receives only OS paths and a fixed, public probe sentence.
      // Keep enough dependency diagnostics to repair an incomplete closure.
      const detail = String(run.stderr || run.stdout || "").replaceAll(temporary, "<isolated-trace>").slice(-4000);
      throw new Error("Isolated traced semantic inference failed: " + code + (detail ? "\n" + detail : ""));
    }
    result.isolatedInference = true;
    return result;
  } finally {
    const cleanupTarget = path.resolve(temporary);
    if (path.dirname(cleanupTarget) !== temporaryBase || !path.basename(cleanupTarget).startsWith("pac-semantic-trace-")) {
      throw new Error("Refusing cleanup outside the verified temporary trace directory.");
    }
    await rm(cleanupTarget, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await verifySemanticTrace(), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
