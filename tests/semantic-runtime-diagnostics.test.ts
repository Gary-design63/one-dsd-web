import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { semanticFailureDiagnostic } from "@/lib/intelligence/retrieval/semantic-diagnostics";
import { isPackagedSemanticFile, requiredSemanticTraceFiles, SEMANTIC_RUNTIME_TRACE, verifySemanticTrace } from "../scripts/verify-semantic-trace.mjs";

const temporaryBase = path.resolve(tmpdir());
const directories: string[] = [];
afterEach(async () => {
  for (const directory of directories.splice(0)) {
    const target = path.resolve(directory);
    if (path.dirname(target) !== temporaryBase || !path.basename(target).startsWith("pac-semantic-guard-test-")) throw new Error("Unsafe test cleanup target");
    await rm(target, { recursive: true, force: true });
  }
});

async function fixture(omit?: string) {
  const root = await mkdtemp(path.join(temporaryBase, "pac-semantic-guard-test-"));
  directories.push(root);
  const files = requiredSemanticTraceFiles("linux", "x64").filter(file => file !== omit);
  for (const file of files) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), "synthetic trace fixture");
  }
  const trace = path.join(root, SEMANTIC_RUNTIME_TRACE);
  await mkdir(path.dirname(trace), { recursive: true });
  await writeFile(trace, JSON.stringify({ version: 1, files: files.map(file => path.relative(path.dirname(trace), path.join(root, file))) }));
  return root;
}

describe("finite semantic runtime diagnostics and trace guard", () => {
  it("identifies a missing dependency without exposing messages, paths or request text", () => {
    const error = Object.assign(new Error("Cannot find package 'sharp' in /private/path; private staff request"), { code: "ERR_MODULE_NOT_FOUND" });
    const value = semanticFailureDiagnostic("dependency_import", error);
    expect(value).toEqual({ event: "pac_local_semantic_unavailable", stage: "dependency_import", dependency: "sharp", reason: "inference_failed", code: "ERR_MODULE_NOT_FOUND" });
    expect(JSON.stringify(value)).not.toContain("private");
  });

  it("keeps only allowlisted reasons and nested error codes", () => {
    expect(semanticFailureDiagnostic("model_session", { reason: "model_integrity", cause: { code: "ERR_DLOPEN_FAILED" }, message: "libvips cannot load: private detail" })).toMatchObject({ reason: "model_integrity", code: "ERR_DLOPEN_FAILED", dependency: "libvips" });
    const value = semanticFailureDiagnostic("model_files", { reason: "private reason", code: "private code", message: "private question", stack: "private stack" });
    expect(value).toMatchObject({ reason: "inference_failed", code: "unclassified", dependency: "undetermined" });
    expect(JSON.stringify(value)).not.toContain("private");
  });

  it("requires the correct platform binding and companion shared library", () => {
    expect(requiredSemanticTraceFiles("linux", "x64")).toContain("node_modules/onnxruntime-node/bin/napi-v6/linux/x64/libonnxruntime.so.1");
    expect(requiredSemanticTraceFiles("win32", "x64")).toContain("node_modules/onnxruntime-node/bin/napi-v6/win32/x64/onnxruntime.dll");
    expect(requiredSemanticTraceFiles("darwin", "arm64")).toContain("node_modules/onnxruntime-node/bin/napi-v6/darwin/arm64/libonnxruntime.1.dylib");
  });

  it("keeps GPU ONNX providers and unused sharp platform trees out of the packaging budget", () => {
    expect(isPackagedSemanticFile("node_modules/onnxruntime-node/bin/napi-v6/linux/x64/libonnxruntime.so.1", "linux", "x64")).toBe(true);
    expect(isPackagedSemanticFile("node_modules/onnxruntime-node/bin/napi-v6/linux/x64/libonnxruntime_providers_cuda.so", "linux", "x64")).toBe(false);
    expect(isPackagedSemanticFile("node_modules/@img/sharp-libvips-linuxmusl-x64/lib/libvips-cpp.so.42", "linux", "x64")).toBe(false);
    expect(isPackagedSemanticFile("node_modules/@huggingface/transformers/dist/transformers.node.mjs", "linux", "x64")).toBe(true);
  });

  it.each([
    "models/bge-small-en-v1.5/onnx/model_quantized.onnx",
    "node_modules/@huggingface/transformers/dist/transformers.node.mjs",
    "node_modules/onnxruntime-node/bin/napi-v6/linux/x64/onnxruntime_binding.node",
    "node_modules/onnxruntime-node/bin/napi-v6/linux/x64/libonnxruntime.so.1",
    "node_modules/sharp/dist/index.mjs",
  ])("fails when the trace omits required runtime file %s", async missing => {
    const root = await fixture(missing);
    await expect(verifySemanticTrace({ root, platform: "linux", arch: "x64", smoke: false })).rejects.toThrow(missing);
  });

  it("distinguishes file-list validation from actually executing inference", async () => {
    const root = await fixture();
    expect(await verifySemanticTrace({ root, platform: "linux", arch: "x64", smoke: false })).toMatchObject({
      ok: true,
      isolatedInference: false,
      requiredFiles: 14,
      trace: SEMANTIC_RUNTIME_TRACE,
    });
  });

  it("packages local-semantic onto owner evals rather than closed staff Ask", async () => {
    expect(SEMANTIC_RUNTIME_TRACE).toBe(".next/server/app/api/consultant/evals/route.js.nft.json");
    const ask = await readFile(path.join(import.meta.dirname, "../app/api/ask/route.ts"), "utf8");
    expect(ask).toContain("staffWriteClosedResponse");
    expect(ask).not.toContain("@huggingface/transformers");
    expect(ask).not.toContain("askConcierge");
    expect(ask).not.toContain("@/lib/intelligence/orchestrator");
    const config = await readFile(path.join(import.meta.dirname, "../next.config.ts"), "utf8");
    expect(config).toContain('"/api/consultant/**"');
    expect(config).toContain("./node_modules/@huggingface/transformers/dist/transformers.node.mjs");
    const includes = config.match(/outputFileTracingIncludes:\s*\{[\s\S]*?\n  \},/);
    expect(includes?.[0]).toBeDefined();
    expect(includes?.[0]).not.toContain('"/*"');
    expect(includes?.[0]).not.toContain('"/api/ask"');
    expect(includes?.[0]).toContain('"/api/downloads/**"');
    expect(includes?.[0]).toContain("downloadRuntimeIncludes");
    expect(config).toContain("./node_modules/pdfkit/js/data/**/*");
    expect(config).toContain("./node_modules/jszip/**/*");
    expect(config).not.toContain("./node_modules/pdfkit/**/*");
    expect(config).not.toContain("./node_modules/docx/**/*");
    expect(config).not.toContain("./node_modules/exceljs/**/*");
    expect(config).not.toContain("./node_modules/pptxgenjs/**/*");
    expect(includes?.[0]).not.toContain("linux/x64/**/*");
    expect(config).toContain("libonnxruntime_providers_cuda.so");
    expect(config).toContain("outputFileTracingExcludes");
  });
});
