import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Doc } from "@/lib/intelligence/retrieval/search";
const { loadModel } = vi.hoisted(() => ({ loadModel: vi.fn() }));
vi.mock("@huggingface/transformers", () => ({ pipeline: loadModel, env: {} }));
const doc: Doc = { kind: "content", id: "synthetic", title: "Accessible meetings", summary: "Help colleagues participate.", text: "Offer accessible formats.", scope: "agencywide", href: "/library/synthetic", authority: "guidance", type: "guidance", status: "approved", reviewDate: "2026-09-08", tags: [], intents: [] };
function infer(input: string | string[]) {
  const count = Array.isArray(input) ? input.length : 1;
  const data = new Float32Array(count * 384);
  for (let i = 0; i < count; i++) data[i * 384] = 1;
  return Promise.resolve({ dims: [count, 384], data });
}
beforeEach(() => { vi.resetModules(); loadModel.mockReset(); });
afterEach(() => { vi.restoreAllMocks(); });

describe("one finite diagnostic across every semantic failure boundary", () => {
  it("logs an initialization failure once when the outer retrieval catch receives it", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    loadModel.mockRejectedValue(Object.assign(new Error("Cannot initialize onnxruntime-node; private request"), { code: "ERR_DLOPEN_FAILED" }));
    const { localSemanticRetrieve } = await import("@/lib/intelligence/retrieval/local-semantic");
    await expect(localSemanticRetrieve("private question", [], [doc])).rejects.toMatchObject({ reason: "inference_failed" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({ stage: "model_session", dependency: "onnxruntime-node", code: "ERR_DLOPEN_FAILED" });
    expect(JSON.stringify(warn.mock.calls)).not.toContain("private");
  });

  it("logs actual embedding errors after successful initialization", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    loadModel.mockResolvedValue(async () => { throw Object.assign(new Error("private inference details"), { code: "ENOMEM" }); });
    const { localSemanticRetrieve } = await import("@/lib/intelligence/retrieval/local-semantic");
    await expect(localSemanticRetrieve("private question", [], [doc])).rejects.toMatchObject({ reason: "inference_failed" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({ stage: "embedding", code: "ENOMEM", reason: "inference_failed" });
    expect(JSON.stringify(warn.mock.calls)).not.toContain("private");
  });

  it("records index warming distinctly when the preparation budget is exceeded", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    let now = 0;
    vi.spyOn(Date, "now").mockImplementation(() => now);
    loadModel.mockImplementation(async () => { now = 7001; return infer; });
    const { localSemanticRetrieve } = await import("@/lib/intelligence/retrieval/local-semantic");
    await expect(localSemanticRetrieve("meeting", [], [doc])).rejects.toMatchObject({ reason: "index_warming" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({ stage: "index_preparation", reason: "index_warming" });
  });

  it("records corpus capacity refusal before loading the model", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { localSemanticRetrieve } = await import("@/lib/intelligence/retrieval/local-semantic");
    await expect(localSemanticRetrieve("meeting", [], Array.from({ length: 4097 }, () => doc))).rejects.toMatchObject({ reason: "capacity" });
    expect(loadModel).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({ stage: "admission", reason: "capacity" });
  });

  it("records concurrency refusal without disturbing the two admitted requests", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    let release!: (value: typeof infer) => void;
    loadModel.mockReturnValue(new Promise<typeof infer>(resolve => { release = resolve; }));
    const { localSemanticRetrieve } = await import("@/lib/intelligence/retrieval/local-semantic");
    const first = localSemanticRetrieve("meeting", [], [doc]);
    const second = localSemanticRetrieve("meeting", [], [doc]);
    await expect(localSemanticRetrieve("meeting", [], [doc])).rejects.toMatchObject({ reason: "busy" });
    release(infer);
    await Promise.all([first, second]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({ stage: "admission", reason: "busy" });
  });

  it("records registry binding refusal before loading the model", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { semanticRetrieveForAgent } = await import("@/lib/intelligence/retrieval/local-semantic");
    const { getAgent } = await import("@/lib/intelligence/registry/agents");
    const agent = structuredClone(getAgent("ask_concierge"));
    delete agent.model_setting.embed_model_id;
    await expect(semanticRetrieveForAgent("meeting", [], [doc], agent)).rejects.toMatchObject({ reason: "model_binding" });
    expect(loadModel).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({ stage: "binding", reason: "model_binding" });
  });
});
