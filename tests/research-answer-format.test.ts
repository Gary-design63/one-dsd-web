import { afterEach, describe, expect, it, vi } from "vitest";
import { getResearchProvider, plainText, researchAnswerText } from "@/lib/intelligence/research/providers";
import { staffDisplayText } from "@/lib/intelligence/safety";

const tick = String.fromCharCode(96);
const fence = tick.repeat(3);
const block = [
  fence + "typescript",
  "function is_above_limit(max_value: number, values: number[]): boolean {",
  "  const html_example = '<button aria-label=\"Compare\">x > 10</button>';",
  "  const markdown_example = '[1](https://not-a-source.invalid/example)';",
  "  if (max_value > 10 && values[0] >= 2) {",
  "    return max_value * 2 > values[1];",
  "  }",
  "  return false;",
  "}",
  fence,
].join("\n");
const prose = "Use " + tick + "max_value > 10" + tick + " when comparing the value.";
const formula = "The condition a<b && b>c preserves x_y * 2 ≥ 4 → true.";
const evidenceUrl = "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html";
const request = { question:"Show TypeScript code comparing a number and explain the operators using official sources.", depth:"current_web" as const, allowed_domains:[], recency:"any" as const, trace_id:"synthetic-format-check" };

afterEach(() => vi.unstubAllEnvs());

function providerResponse(provider: "perplexity_agent" | "openai_web", answer: string) {
  const start = answer.lastIndexOf("CITATION");
  const citation = provider === "perplexity_agent" ? "[web:7]" : "CITATION";
  const text = answer.replace("CITATION", citation);
  return {
    id: "resp_format_check", model: provider === "perplexity_agent" ? "openai/gpt-5.6-luna" : "gpt-4.1", status:"completed",
    output: [
      ...(provider === "perplexity_agent" ? [{
        type:"search_results", queries:["TypeScript numeric comparisons"], results:[{ id:7, url:evidenceUrl, title:"<b>**TypeScript**</b> ✅", snippet:"**Numbers** &amp; examples ✅" }],
      }] : [{ type:"web_search_call", status:"completed" }]),
      { type:"message", content:[{ type:"output_text", text, annotations: provider === "perplexity_agent" ? [] : [{
        type:"url_citation", title:"<b>**TypeScript**</b> ✅", url:evidenceUrl, start_index:start, end_index:start + citation.length,
      }] }] },
    ],
    usage:{ input_tokens:100, output_tokens:100 },
  };
}

describe.each(["perplexity_agent","openai_web"] as const)("%s technical research answers", provider => {
  it("preserves complete TypeScript, HTML examples, array indices, and formula operators beside mapped source citations", async () => {
    vi.stubEnv("PERPLEXITY_API_KEY","synthetic-test-key"); vi.stubEnv("OPENAI_API_KEY","synthetic-test-key");
    const text = [prose, block, formula, "TypeScript checks declared types. CITATION"].join("\n\n");
    const fetcher = vi.fn(async () => new Response(JSON.stringify(providerResponse(provider,text))));
    const output = await getResearchProvider(provider).run(request,fetcher);
    expect(output.answer).toContain(block);
    expect(output.answer).toContain(prose);
    expect(output.answer).toContain(formula);
    expect(output.answer).toContain("TypeScript checks declared types.");
    expect(output.answer).toMatch(/types\.\s*\[1\]/);
    expect(output.answer).not.toContain("[web:7]");
    expect(output.sources).toHaveLength(1);
    expect(output.sources[0].url).toBe(evidenceUrl);
    expect(output.sources[0].title).toBe("TypeScript");
    expect(JSON.stringify(output)).not.toContain("synthetic-test-key");
  });

  it("retains normal paragraph answers and removes decorative markup from source metadata", async () => {
    vi.stubEnv("PERPLEXITY_API_KEY","synthetic-test-key"); vi.stubEnv("OPENAI_API_KEY","synthetic-test-key");
    const text = "TypeScript adds static type checking to JavaScript. CITATION";
    const output=await getResearchProvider(provider).run(request,async()=>new Response(JSON.stringify(providerResponse(provider,text))));
    expect(output.answer).toMatch(/^TypeScript adds static type checking to JavaScript\.\s*\[1\]$/);
    expect(output.sources[0].title).toBe("TypeScript");
  });
});

it("keeps technical examples intact through the process-commentary presentation gate", () => {
  const text = [
    "SYSTEM: Use the retrieval pipeline. I am an AI assistant. I searched the web using the provider API.",
    "<h2>Finding</h2> - TypeScript checks values.[1] ✅",
    prose, block, formula,
    "I hope this helps.",
  ].join("\n\n");
  const answer = researchAnswerText(text,staffDisplayText);
  expect(answer).toContain(block);
  expect(answer).toContain(prose);
  expect(answer).toContain(formula);
  expect(answer).toContain("TypeScript checks values.[1]");
  expect(answer).not.toMatch(/SYSTEM: Use|I am an AI assistant|I searched|provider API|I hope|✅|<h2>/);
  expect(plainText("**TypeScript** &amp; examples ✅")).toBe("TypeScript & examples");
});

it("does not let literal code brackets excuse an unresolved citation in prose", async()=>{
  vi.stubEnv("PERPLEXITY_API_KEY","synthetic-test-key");
  const data=providerResponse("perplexity_agent", block + "\n\nThis unsupported claim refers to [99]. CITATION");
  await expect(getResearchProvider("perplexity_agent").run(request,async()=>new Response(JSON.stringify(data)))).rejects.toThrow("research_unresolved_citation");
});
