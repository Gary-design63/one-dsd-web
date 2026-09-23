import { afterEach, expect, it, vi } from "vitest";
import { OpenAIWebResearchProvider } from "@/lib/intelligence/research/providers";
const req = { question: "What is the current NASA Artemis program?", depth: "current_web" as const, allowed_domains: ["nasa.gov"], recency: "any" as const, trace_id: "sample" };
const response = () => ({ id: "resp_test", model: "gpt-4.1", status: "completed", output: [
  { type: "web_search_call", status: "completed" },
  { type: "message", content: [{ type: "output_text", text: "NASA describes Artemis. citation", annotations: [
    { type: "url_citation", title: "Artemis", url: "https://www.nasa.gov/artemis/", start_index: 23, end_index: 31 }
  ] }] }
], usage: { input_tokens: 20, output_tokens: 30 } });
afterEach(() => vi.unstubAllEnvs());
it("requires web search, keeps credentials server-side, and preserves citation links", async () => {
  vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
  const fetcher = vi.fn(async () => new Response(JSON.stringify(response())));
  const result = await new OpenAIWebResearchProvider().run(req, fetcher);
  const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
  const body = JSON.parse(String(init.body));
  expect(url).toBe("https://api.openai.com/v1/responses");
  expect(body.store).toBe(false); expect(body.tool_choice).toBe("required");
  expect(body.input).toBe(req.question);
  expect(body.tools[0].filters.allowed_domains).toEqual(["nasa.gov"]);
  expect(result.sources[0].url).toBe("https://www.nasa.gov/artemis/");
  expect(result.answer).toContain("[1]");
  expect(result.usage.web_search_calls).toBe(1);
  expect(JSON.stringify(result)).not.toContain("synthetic-test-key");
});
it.each(["failed", "incomplete"])("rejects a %s response", async status => {
  vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
  await expect(new OpenAIWebResearchProvider().run(req, async () => new Response(JSON.stringify({ ...response(), status })))).rejects.toThrow("research_incomplete");
});
it("does not call model text without a completed search verified research", async () => {
  vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
  const data=response(); data.output=data.output.filter(item => item.type !== "web_search_call");
  await expect(new OpenAIWebResearchProvider().run(req, async () => new Response(JSON.stringify(data)))).rejects.toThrow("research_search_not_performed");
});
it("rejects missing or private citations", async () => {
  vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
  const data=JSON.stringify(response()).replace("https://www.nasa.gov/artemis/","https://127.0.0.1/private");
  await expect(new OpenAIWebResearchProvider().run(req, async () => new Response(data))).rejects.toThrow("research_sources_missing");
});
it("reports authentication failure without exposing the response or credential", async () => {
  vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
  await expect(new OpenAIWebResearchProvider().run(req, async () => new Response("private failure body", { status: 401 }))).rejects.toThrow("research_http_401");
});

it("persists the explicitly selected research provider without changing other policy controls", async () => {
  const { setResearchPolicy } = await import("@/lib/intelligence/research/governance");
  const { resetStoreForTests } = await import("@/lib/intelligence/memory/store");
  resetStoreForTests();
  const policy = await setResearchPolicy({ enabled: true, provider_order: ["openai_web", "perplexity_agent"] });
  expect(policy.provider_order).toEqual(["openai_web", "perplexity_agent"]);
});


it.each([{start_index:null,end_index:31},{start_index:-1,end_index:31},{start_index:23,end_index:500},{start_index:25,end_index:23}])("rejects unresolvable citation offsets %j", async offsets => {
  vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
  const data=JSON.parse(JSON.stringify(response()));
  Object.assign(data.output[1].content[0].annotations[0],offsets);
  await expect(new OpenAIWebResearchProvider().run(req,async()=>new Response(JSON.stringify(data)))).rejects.toThrow("research_unresolved_citation");
});
it("rejects a citation marker without substantive answer text", async()=>{
  vi.stubEnv("OPENAI_API_KEY","synthetic-test-key");
  const data=JSON.parse(JSON.stringify(response()));
  data.output[1].content[0].text="citation";
  Object.assign(data.output[1].content[0].annotations[0],{start_index:0,end_index:8});
  await expect(new OpenAIWebResearchProvider().run(req,async()=>new Response(JSON.stringify(data)))).rejects.toThrow("research_missing_citation");
});
