import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const pinned = Object.freeze({
  modelId: "Xenova/bge-small-en-v1.5",
  revision: "ea104dacec62c0de699686887e3f920caeb4f3e3",
  name: "onnx/model_quantized.onnx",
  bytes: 34014426,
  sha256: "6c9c6101a956d62dfb5e7190c538226c0c5bb9cb27b651234b6df063ee7dbfe4",
});

function assertIntegrity(bytes) {
  if (bytes.length !== pinned.bytes || createHash("sha256").update(bytes).digest("hex") !== pinned.sha256) {
    throw new Error("The pinned semantic model failed its byte-length or SHA-256 verification.");
  }
}

// Build preparation only. The application never calls this module or downloads models.
export async function ensureHostedSemanticModel({ root = projectRoot, env = process.env, fetchImpl = fetch } = {}) {
  const directory = path.join(root, "models", "bge-small-en-v1.5");
  const manifest = JSON.parse(await readFile(path.join(directory, "manifest.json"), "utf8"));
  const file = manifest.files.find(entry => entry.name === pinned.name);
  if (manifest.modelId !== pinned.modelId || manifest.revision !== pinned.revision ||
      file?.bytes !== pinned.bytes || file?.sha256 !== pinned.sha256) {
    throw new Error("The semantic-model manifest differs from the approved build-download pin.");
  }
  const target = path.join(directory, pinned.name);
  let existing;
  try { existing = await readFile(target); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (existing) {
    assertIntegrity(existing);
    return { status: "already-present", bytes: pinned.bytes, sha256: pinned.sha256 };
  }
  if (env.VERCEL !== "1" || !["preview", "production"].includes(env.VERCEL_ENV)) {
    throw new Error("The pinned semantic model is missing. Automatic retrieval is limited to Vercel preview and production builds.");
  }
  const url = `https://huggingface.co/${pinned.modelId}/resolve/${pinned.revision}/${pinned.name}`;
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok || !response.body) throw new Error(`Pinned semantic-model download failed (HTTP ${response.status}).`);
  const declaredLength = response.headers.get("content-length");
  if (declaredLength !== null && Number(declaredLength) !== pinned.bytes) {
    await response.body.cancel();
    throw new Error("Pinned semantic-model download has an unexpected byte length.");
  }
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.${randomUUID()}.download`;
  let handle;
  let bytes = 0;
  const hash = createHash("sha256");
  try {
    handle = await open(temporary, "wx");
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > pinned.bytes) throw new Error("Pinned semantic-model download exceeds its expected byte length.");
      hash.update(chunk);
      await handle.writeFile(chunk);
    }
    await handle.close();
    handle = undefined;
    if (bytes !== pinned.bytes || hash.digest("hex") !== pinned.sha256) {
      throw new Error("The downloaded semantic model failed its byte-length or SHA-256 verification.");
    }
    await rename(temporary, target);
  } finally {
    await handle?.close();
    await rm(temporary, { force: true });
  }
  return { status: "downloaded-and-verified", bytes, sha256: pinned.sha256 };
}
