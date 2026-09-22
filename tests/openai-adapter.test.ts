import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { OpenAIAdapter, jsonSchemaForOpenAI } from "@/lib/intelligence/providers/openai";
import { getModel } from "@/lib/intelligence/registry/models";
describe("second-provider adapter: request shape without a vendor library", () => {
  const Schema = z.object({ shortAnswer: z.string(), limits: z.array(z.string()) });
  const record = getModel("mdl_openai_structured")!;

  function reply(text: string, status = 200) {
    return new Response(JSON.stringify({ id: "resp_1", status: "completed", output: [{ type: "message", content: [{ type: "output_text", text }] }], usage: { input_tokens: 10, output_tokens: 5 } }), { status, headers: { "content-type": "application/json" } });
  }

  it("posts a strict schema-constrained request with storage off and parses the structured reply", async () => {
    const fetcher = vi.fn(async () => reply(JSON.stringify({ shortAnswer: "An answer.", limits: ["a limit"] })));
    const adapter = new OpenAIAdapter({ fetcher: fetcher as unknown as typeof fetch, credential: () => "test-key" });
    const out = await adapter.complete({ model_id: record.model_id, system: "system text", user: "user text", schema: Schema, trace_id: "t" }, record);
    expect(out.parsed).toEqual({ shortAnswer: "An answer.", limits: ["a limit"] });
    expect(out.usage).toEqual({ input_tokens: 10, output_tokens: 5 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/responses");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer test-key");
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe(record.provider_model_ref);
    expect(body.store).toBe(false);
    expect(body.input).toEqual([
      { role: "developer", content: "system text" },
      { role: "user", content: "user text" },
    ]);
    expect(body.text.format.type).toBe("json_schema");
    expect(body.text.format.strict).toBe(true);
    expect(body.text.format.schema.additionalProperties).toBe(false);
    expect(body.text.format.schema.required).toEqual(["shortAnswer", "limits"]);
    expect(body.text.format.schema.$schema).toBeUndefined();
  });

  it("reports errors as short codes and never as payload text", async () => {
    const adapter429 = new OpenAIAdapter({ fetcher: (async () => reply("secret body", 429)) as unknown as typeof fetch, credential: () => "k" });
    await expect(adapter429.complete({ model_id: record.model_id, system: "s", user: "u", schema: Schema, trace_id: "t" }, record)).rejects.toThrow("openai_http_429");
    const refusal = new OpenAIAdapter({
      fetcher: (async () => new Response(JSON.stringify({ id: "r", output: [{ type: "message", content: [{ type: "refusal", refusal: "no" }] }] }), { status: 200 })) as unknown as typeof fetch,
      credential: () => "k",
    });
    await expect(refusal.complete({ model_id: record.model_id, system: "s", user: "u", schema: Schema, trace_id: "t" }, record)).rejects.toThrow("provider_refusal");
    const noKey = new OpenAIAdapter({ fetcher: (async () => reply("{}")) as unknown as typeof fetch, credential: () => undefined });
    await expect(noKey.complete({ model_id: record.model_id, system: "s", user: "u", schema: Schema, trace_id: "t" }, record)).rejects.toThrow("openai_credential_missing");
    expect(await noKey.health()).toEqual({ ok: false, latency_ms: 0 });
  });

  it("emits a strict-mode schema for every property", () => {
    const schema = jsonSchemaForOpenAI(z.object({ a: z.string(), b: z.array(z.object({ c: z.boolean() })) }));
    expect(schema.type).toBe("object");
    expect(schema.additionalProperties).toBe(false);
    expect((schema.properties as Record<string, unknown>).b).toBeDefined();
  });
});

