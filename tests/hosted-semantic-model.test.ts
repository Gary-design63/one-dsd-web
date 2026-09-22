import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ensureHostedSemanticModel } from "../scripts/ensure-hosted-semantic-model.mjs";

const root = path.resolve(import.meta.dirname, "..");
const modelRoot = path.join(root, "models/bge-small-en-v1.5");
const manifest = JSON.parse(await readFile(path.join(modelRoot, "manifest.json"), "utf8"));
const approved = await readFile(path.join(modelRoot, "onnx/model_quantized.onnx"));
const expected = manifest.files.find((file: { name: string }) => file.name === "onnx/model_quantized.onnx");
const hosted: NodeJS.ProcessEnv = { NODE_ENV: "test", VERCEL: "1", VERCEL_ENV: "production" };
const directories: string[] = [];
async function fixture() {
  const directory = await mkdtemp(path.join(tmpdir(), "pac-hosted-model-"));
  directories.push(directory);
  const model = path.join(directory, "models/bge-small-en-v1.5");
  await mkdir(path.join(model, "onnx"), { recursive: true });
  await writeFile(path.join(model, "manifest.json"), JSON.stringify(manifest));
  return { directory, model, target: path.join(model, "onnx/model_quantized.onnx") };
}
afterEach(async () => { await Promise.all(directories.splice(0).map(directory => rm(directory, { recursive: true, force: true }))); });

describe("pinned semantic model hosted-build preparation", () => {
  it("retains the exact existing approved model without any download", async () => {
    const f = await fixture();
    await writeFile(f.target, approved);
    const fetchImpl = vi.fn<typeof fetch>();
    expect(await ensureHostedSemanticModel({ root: f.directory, env: { NODE_ENV: "test" }, fetchImpl })).toEqual({ status: "already-present", bytes: expected.bytes, sha256: expected.sha256 });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("downloads only the pinned public revision, verifies it, and places identical bytes", async () => {
    const f = await fixture();
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(new Uint8Array(approved), { headers: { "content-length": String(expected.bytes) } }));
    expect(await ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).toEqual({ status: "downloaded-and-verified", bytes: expected.bytes, sha256: expected.sha256 });
    expect(fetchImpl).toHaveBeenCalledWith(`https://huggingface.co/${manifest.modelId}/resolve/${manifest.revision}/onnx/model_quantized.onnx`, expect.objectContaining({ signal: expect.any(AbortSignal) }));
    const restored = await readFile(f.target);
    expect(createHash("sha256").update(restored).digest("hex")).toBe(expected.sha256);
    expect(restored.equals(approved)).toBe(true);
    expect(await readdir(path.dirname(f.target))).toEqual(["model_quantized.onnx"]);
  });

  it("refuses to overwrite an existing corrupt model with a new download", async () => {
    const f = await fixture();
    await writeFile(f.target, "corrupt");
    const fetchImpl = vi.fn<typeof fetch>();
    await expect(ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).rejects.toThrow("verification");
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(await readFile(f.target, "utf8")).toBe("corrupt");
  });

  it.each([{}, { VERCEL: "1", VERCEL_ENV: "development" }, { VERCEL: "0", VERCEL_ENV: "production" }])("refuses automatic retrieval outside a hosted release build: %j", async env => {
    const f = await fixture();
    const fetchImpl = vi.fn<typeof fetch>();
    await expect(ensureHostedSemanticModel({ root: f.directory, env: { NODE_ENV: "test", ...env }, fetchImpl })).rejects.toThrow("limited to Vercel");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("fails on an HTTP error without leaving a model or partial file", async () => {
    const f = await fixture();
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response("unavailable", { status: 503 }));
    await expect(ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).rejects.toThrow("HTTP 503");
    expect(await readdir(path.dirname(f.target))).toEqual([]);
  });

  it("rejects an unexpected declared byte length before writing", async () => {
    const f = await fixture();
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response("wrong", { headers: { "content-length": "5" } }));
    await expect(ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).rejects.toThrow("unexpected byte length");
    expect(await readdir(path.dirname(f.target))).toEqual([]);
  });

  it("rejects same-size altered bytes and removes the temporary download", async () => {
    const f = await fixture();
    const changed = new Uint8Array(approved);
    changed[100] ^= 1;
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(changed));
    await expect(ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).rejects.toThrow("SHA-256 verification");
    expect(await readdir(path.dirname(f.target))).toEqual([]);
  });

  it("rejects a truncated body and removes the partial file", async () => {
    const f = await fixture();
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response("truncated"));
    await expect(ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).rejects.toThrow("byte-length");
    expect(await readdir(path.dirname(f.target))).toEqual([]);
  });

  it("rejects an oversized body and removes the partial file", async () => {
    const f = await fixture();
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(new Uint8Array(expected.bytes + 1)));
    await expect(ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).rejects.toThrow("exceeds");
    expect(await readdir(path.dirname(f.target))).toEqual([]);
  });

  it("will not follow an altered manifest pin", async () => {
    const f = await fixture();
    await writeFile(path.join(f.model, "manifest.json"), JSON.stringify({ ...manifest, revision: "main" }));
    const fetchImpl = vi.fn<typeof fetch>();
    await expect(ensureHostedSemanticModel({ root: f.directory, env: hosted, fetchImpl })).rejects.toThrow("approved build-download pin");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("prepares the model after the strict environment gate and before hosted checks", async () => {
    const build = await readFile(path.join(root, "scripts/vercel-build.mjs"), "utf8");
    expect(build.indexOf('run("verify:environment:production")')).toBeLessThan(build.indexOf("await ensureHostedSemanticModel()"));
    expect(build.indexOf("await ensureHostedSemanticModel()")).toBeLessThan(build.indexOf('for (const script of ["verify:environment"'));
    const ignore = (await readFile(path.join(root, ".vercelignore"), "utf8")).split(/\r?\n/).filter(line => line.startsWith("models"));
    expect(ignore).toEqual(["models/bge-small-en-v1.5/onnx/model_quantized.onnx"]);
    const runtime = await readFile(path.join(root, "lib/intelligence/retrieval/local-semantic.ts"), "utf8");
    expect(runtime).toContain("env.allowRemoteModels = false");
    expect(runtime).not.toContain("ensureHostedSemanticModel");
  });
});
