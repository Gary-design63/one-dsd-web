import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getResearchProvider,
  estimateUsd,
  plainText,
  searchWithPerplexity,
  sourcesFromAgent,
} from "@/lib/intelligence/research/providers";

const originalKey = process.env.PERPLEXITY_API_KEY;
const originalCurrentPreset = process.env.PAC_PERPLEXITY_CURRENT_PRESET;
const originalDeepPreset = process.env.PAC_PERPLEXITY_DEEP_PRESET;

afterEach(() => {
  if (originalKey === undefined) delete process.env.PERPLEXITY_API_KEY;
  else process.env.PERPLEXITY_API_KEY = originalKey;
  if (originalCurrentPreset === undefined) delete process.env.PAC_PERPLEXITY_CURRENT_PRESET;
  else process.env.PAC_PERPLEXITY_CURRENT_PRESET = originalCurrentPreset;
  if (originalDeepPreset === undefined) delete process.env.PAC_PERPLEXITY_DEEP_PRESET;
  else process.env.PAC_PERPLEXITY_DEEP_PRESET = originalDeepPreset;
});

function agentResponse(
  options: {
    firstUrl?: string;
    secondUrl?: string;
    status?: "completed" | "failed" | "incomplete" | "in_progress" | "queued" | "cancelled";
    answer?: string;
    toolCalls?: Record<string, { invocation: number }>;
  } = {},
) {
  const firstUrl = options.firstUrl ?? "https://primary.example.gov/report";
  const secondUrl = options.secondUrl ?? "https://university.example.edu/study";
  return new Response(
    JSON.stringify({
      id: "resp_agent_test",
      model: "openai/gpt-5.6-sol",
      status: options.status ?? "completed",
      output: [
        {
          type: "search_results",
          queries: ["federal language access guidance", "language access policy update"],
          results: [
            {
              id: 7,
              title: "Primary report",
              url: firstUrl,
              date: "2026-09-01",
            },
            {
              id: 9,
              title: "University study",
              url: secondUrl,
              date: "2026-08-01",
            },
          ],
        },
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: options.answer ?? "Current evidence supports this finding.[web:7][web:9]",
              annotations: [
                {
                  type: "url_citation",
                  url: firstUrl,
                  title: "Primary report",
                  start_index: 0,
                  end_index: 42,
                },
              ],
            },
          ],
        },
      ],
      usage: {
        input_tokens: 20,
        output_tokens: 40,
        cost: { currency: "USD", total_cost: 0.0123456789 },
        tool_calls_details: options.toolCalls ?? {
          search_web: { invocation: 2 },
          fetch_url: { invocation: 1 },
        },
      },
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

async function runAgentResponse(
  response: Response,
  request: Partial<{
    question: string;
    depth: "current_web" | "deep_research";
    allowed_domains: string[];
    recency: "any" | "year" | "month" | "week";
    trace_id: string;
  }> = {},
) {
  process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
  return getResearchProvider("perplexity_agent").run(
    {
      question: "Synthetic research question",
      depth: "current_web",
      allowed_domains: [],
      recency: "any",
      trace_id: "agent-hardening",
      ...request,
    },
    vi.fn(async () => response) as unknown as typeof fetch,
  );
}

describe("Perplexity Agent API provider", () => {
  it("uses the low dynamic preset for current answers and parses response identity, sources, and exact usage", async () => {
    process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
    const fetcher = vi.fn(async () => agentResponse()) as unknown as typeof fetch;
    const result = await getResearchProvider("perplexity_agent").run(
      {
        question: "What changed in current federal language-access guidance?",
        depth: "current_web",
        allowed_domains: [],
        recency: "any",
        trace_id: "agent-current",
      },
      fetcher,
    );

    expect(fetcher).toHaveBeenCalledOnce();
    const [url, init] = (fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.perplexity.ai/v1/agent");
    expect(init.method).toBe("POST");
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      preset: "low",
      model: "openai/gpt-5.6-luna",
      input: "What changed in current federal language-access guidance?",
      store: false,
      tools: [{ type: "web_search" }, { type: "fetch_url" }],
    });
    expect(body.model).toBe("openai/gpt-5.6-luna");
    expect(body).not.toHaveProperty("messages");
    expect(body.instructions).toMatch(/plain paragraphs/i);
    expect(body.instructions).toContain("exact source URLs, not numeric citations");
    expect(body.instructions).toMatch(/complete example in a fenced code block/i);
    expect(result.provider).toBe("perplexity_agent");
    expect(result.providerTraceId).toBe("resp_agent_test");
    expect(result.model).toBe("openai/gpt-5.6-sol");
    expect(result.answer).toBe("Current evidence supports this finding.[1][2]");
    expect(result.sources.map((source) => source.url)).toEqual([
      "https://primary.example.gov/report",
      "https://university.example.edu/study",
    ]);
    expect(result.usage).toMatchObject({
      input_tokens: 20,
      output_tokens: 40,
      search_queries: 2,
      web_search_calls: 2,
      fetch_url_calls: 1,
      tool_calls: 3,
      reported_usd: 0.0123456789,
    });
    expect(result.estimated_usd).toBe(0.0123456789);
  });

  it("uses a conservative estimate only when an exact provider total is absent", () => {
    expect(
      estimateUsd("current_web", {
        web_search_calls: 2,
        fetch_url_calls: 1,
        tool_calls: 3,
      }),
    ).toBe(0.0205);
  });

  it("uses the medium dynamic preset for deep research and nests domain and recency filters on web_search", async () => {
    process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
    const fetcher = vi.fn(async () =>
      agentResponse({
        firstUrl: "https://www.dol.gov/report",
        secondUrl: "https://research.eeoc.gov/study",
      }),
    ) as unknown as typeof fetch;
    await getResearchProvider("perplexity_agent").run(
      {
        question: "Conduct a comprehensive review of current equitable hiring evidence.",
        depth: "deep_research",
        allowed_domains: ["dol.gov", "eeoc.gov"],
        recency: "year",
        trace_id: "agent-deep",
      },
      fetcher,
    );

    const [, init] = (fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      preset: "medium",
      model: "openai/gpt-5.6-luna",
      store: false,
      tools: [
        {
          type: "web_search",
          filters: {
            search_domain_filter: ["dol.gov", "eeoc.gov"],
            search_recency_filter: "year",
          },
        },
        { type: "fetch_url" },
      ],
    });
  });

  it("honors configured preset names and rejects URL or model-shaped overrides", async () => {
    process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
    process.env.PAC_PERPLEXITY_CURRENT_PRESET = "fast";
    process.env.PAC_PERPLEXITY_DEEP_PRESET = "https://unexpected.example/model";
    const fetcher = vi.fn(async () => agentResponse()) as unknown as typeof fetch;
    const provider = getResearchProvider("perplexity_agent");

    await provider.run(
      { question: "Current question", depth: "current_web", allowed_domains: [], recency: "any", trace_id: "custom-current" },
      fetcher,
    );
    await provider.run(
      { question: "Deep question", depth: "deep_research", allowed_domains: [], recency: "any", trace_id: "custom-deep" },
      fetcher,
    );

    const currentBody = JSON.parse(String((fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body));
    const deepBody = JSON.parse(String((fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[1][1].body));
    expect(currentBody.preset).toBe("fast");
    expect(deepBody.preset).toBe("medium");
  });

  it("extracts citation annotations, keeps result numbering stable, and drops unsafe links", () => {
    const sources = sourcesFromAgent({
      id: "resp_sources",
      model: "provider/model",
      output: [
        {
          type: "search_results",
          results: [
            { id: 4, title: "Safe result", url: "https://safe.example.gov/report" },
            { id: 5, title: "Unsafe result", url: "javascript:alert(1)" },
          ],
        },
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: "Finding.[web:4]",
              annotations: [
                { type: "url_citation", title: "Annotation only", url: "https://annotation.example.org/source" },
                { type: "url_citation", title: "Unsafe", url: "data:text/plain,bad" },
              ],
            },
          ],
        },
      ],
    });

    expect(sources.map((source) => source.title)).toEqual(["Safe result", "Annotation only"]);
    expect(sources.every((source) => source.url.startsWith("https://"))).toBe(true);
  });

  it("enforces the returned-source allowlist using exact domains and subdomains", () => {
    const sources = sourcesFromAgent(
      {
        id: "resp_allowlist",
        model: "provider/model",
        output: [
          {
            type: "search_results",
            results: [
              { id: 1, title: "Exact", url: "https://agency.gov/report" },
              { id: 2, title: "Subdomain", url: "https://research.agency.gov/study" },
              { id: 3, title: "Lookalike", url: "https://agency.gov.attacker.org/page" },
              { id: 4, title: "Unrelated", url: "https://another.gov/page" },
            ],
          },
        ],
      },
      ["agency.gov"],
    );

    expect(sources.map((source) => source.title)).toEqual(["Exact", "Subdomain"]);
  });

  it("accepts only public HTTPS sources", () => {
    const sources = sourcesFromAgent({
      id: "resp_public_urls",
      model: "provider/model",
      output: [
        {
          type: "search_results",
          results: [
            { id: 1, title: "Public", url: "https://agency.gov/report#section" },
            { id: 2, title: "Plain HTTP", url: "http://agency.gov/report" },
            { id: 3, title: "Loopback", url: "https://127.0.0.1/report" },
            { id: 4, title: "Private", url: "https://10.0.0.8/report" },
            { id: 5, title: "Link local", url: "https://169.254.169.254/latest/meta-data" },
            { id: 6, title: "IPv6 loopback", url: "https://[::1]/report" },
            { id: 7, title: "Local name", url: "https://service.internal/report" },
          ],
        },
      ],
    });

    expect(sources.map((source) => source.url)).toEqual(["https://agency.gov/report"]);
  });

  it("fails when no web or URL-fetch tool use is evidenced", async () => {
    const payload = (await agentResponse({ toolCalls: {} }).json()) as Record<string, unknown>;
    payload.output = (payload.output as Array<{ type: string }>).filter((item) => item.type === "message");
    await expect(
      runAgentResponse(new Response(JSON.stringify(payload), { status: 200 })),
    ).rejects.toThrow("research_no_tool_evidence");
  });

  it("fails when tool output has no safe public source", async () => {
    await expect(
      runAgentResponse(
        agentResponse({
          firstUrl: "https://127.0.0.1/private",
          secondUrl: "http://agency.gov/insecure",
        }),
      ),
    ).rejects.toThrow("research_no_safe_sources");
  });

  it("rejects uncited answers and unresolved result markers", async () => {
    const uncitedPayload = (await agentResponse({ answer: "The sources support this finding." }).json()) as {
      output: Array<{ type: string; content?: Array<Record<string, unknown>> }>;
    };
    const message = uncitedPayload.output.find((item) => item.type === "message");
    if (message?.content?.[0]) message.content[0].annotations = [];
    await expect(
      runAgentResponse(new Response(JSON.stringify(uncitedPayload), { status: 200 })),
    ).rejects.toThrow("research_missing_citation");

    const unresolvedPayload = (await agentResponse({ answer: "Unsupported claim.[web:404]" }).json()) as {
      output: Array<{ type: string; content?: Array<Record<string, unknown>> }>;
    };
    const unresolvedMessage = unresolvedPayload.output.find((item) => item.type === "message");
    if (unresolvedMessage?.content?.[0]) unresolvedMessage.content[0].annotations = [];
    await expect(
      runAgentResponse(new Response(JSON.stringify(unresolvedPayload), { status: 200 })),
    ).rejects.toThrow("research_unresolved_citation");
  });

  it("rejects a citation whose returned source falls outside the configured allowlist", async () => {
    await expect(
      runAgentResponse(
        agentResponse({
          firstUrl: "https://agency.gov/report",
          secondUrl: "https://agency.gov.attacker.org/study",
        }),
        { allowed_domains: ["agency.gov"] },
      ),
    ).rejects.toThrow("research_unresolved_citation");
  });

  it("accepts fetch_url_results joined to a documented URL annotation", async () => {
    const text = "The fetched report supports this finding.";
    const result = await runAgentResponse(
      new Response(
        JSON.stringify({
          id: "resp_fetch",
          model: "provider/model",
          status: "completed",
          output: [
            {
              type: "fetch_url_results",
              contents: [
                {
                  title: "Fetched report",
                  url: "https://agency.gov/fetched-report",
                  snippet: "Public evidence.",
                },
              ],
            },
            {
              type: "message",
              content: [
                {
                  type: "output_text",
                  text,
                  annotations: [
                    {
                      type: "page_citation",
                      title: "Fetched report",
                      url: "https://agency.gov/fetched-report",
                      start_index: 0,
                      end_index: text.length,
                    },
                  ],
                },
              ],
            },
          ],
          usage: { tool_calls_details: { fetch_url: { invocation: 1 } } },
        }),
        { status: 200 },
      ),
    );

    expect(result.answer).toBe("The fetched report supports this finding. [1]");
    expect(result.sources.map((source) => source.url)).toEqual([
      "https://agency.gov/fetched-report",
    ]);
    expect(result.usage).toMatchObject({ fetch_url_calls: 1, tool_calls: 1 });
  });

  it("does not treat a documented fetch failure marker as usable evidence", async () => {
    const text = "The page was unavailable.";
    await expect(
      runAgentResponse(
        new Response(
          JSON.stringify({
            id: "resp_failed_fetch",
            model: "provider/model",
            status: "completed",
            output: [
              {
                type: "fetch_url_results",
                contents: [
                  {
                    title: "Unavailable report",
                    url: "https://agency.gov/unavailable",
                    snippet: "no_result_returned",
                  },
                ],
              },
              {
                type: "message",
                content: [
                  {
                    type: "output_text",
                    text,
                    annotations: [
                      {
                        type: "url_citation",
                        title: "Unavailable report",
                        url: "https://agency.gov/unavailable",
                        start_index: 0,
                        end_index: text.length,
                      },
                    ],
                  },
                ],
              },
            ],
            usage: { tool_calls_details: { fetch_url: { invocation: 1 } } },
          }),
          { status: 200 },
        ),
      ),
    ).rejects.toThrow("research_no_safe_sources");
  });

  it("rejects unexpected nonzero tools and unexpected tool-result output", async () => {
    await expect(
      runAgentResponse(
        agentResponse({
          toolCalls: { search_web: { invocation: 1 }, sandbox: { invocation: 1 } },
        }),
      ),
    ).rejects.toThrow("research_unexpected_tool");

    const payload = (await agentResponse().json()) as { output: Array<Record<string, unknown>> };
    payload.output.unshift({ type: "sandbox_results", output: "unexpected" });
    await expect(
      runAgentResponse(new Response(JSON.stringify(payload), { status: 200 })),
    ).rejects.toThrow("research_unexpected_tool");
  });

  it("rejects malformed and incomplete Agent API responses", async () => {
    process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
    const provider = getResearchProvider("perplexity_agent");
    const malformed = vi.fn(async () => new Response(JSON.stringify({ output: [] }), { status: 200 })) as unknown as typeof fetch;
    await expect(
      provider.run(
        { question: "Synthetic question", depth: "current_web", allowed_domains: [], recency: "any", trace_id: "bad" },
        malformed,
      ),
    ).rejects.toThrow("research_invalid_response");

    const incomplete = vi.fn(async () =>
      new Response(
        JSON.stringify({ id: "resp_incomplete", model: "provider/model", status: "incomplete", output: [] }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;
    await expect(
      provider.run(
        { question: "Synthetic question", depth: "current_web", allowed_domains: [], recency: "any", trace_id: "incomplete" },
        incomplete,
      ),
    ).rejects.toThrow("research_incomplete");

    await expect(
      runAgentResponse(agentResponse({ status: "queued" })),
    ).rejects.toThrow("research_queued");
    await expect(
      runAgentResponse(agentResponse({ status: "cancelled" })),
    ).rejects.toThrow("research_cancelled");
  });

  it("uses the separate ranked Search API contract and records its trace identifier", async () => {
    process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
    const fetcher = vi.fn(async () =>
      new Response(
        JSON.stringify({
          id: "search-trace-1",
          results: [
            {
              title: "Primary public source",
              url: "https://agency.example.gov/report",
              date: "2026-09-01",
              snippet: "A public result.",
            },
            { title: "Allowed subdomain", url: "https://research.example.gov/study" },
            { title: "Lookalike", url: "https://example.gov.attacker.org/report" },
            { title: "Private", url: "https://192.168.1.10/report" },
            { title: "Insecure", url: "http://agency.example.gov/report" },
            { title: "Unsafe", url: "javascript:alert(1)" },
          ],
        }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const result = await searchWithPerplexity(
      {
        question: "Find current language-access guidance",
        allowed_domains: ["example.gov"],
        recency: "year",
      },
      fetcher,
    );

    const [url, init] = (fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.perplexity.ai/search");
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      query: "Find current language-access guidance",
      max_results: 10,
      max_tokens_per_page: 1024,
      country: "US",
      search_domain_filter: ["example.gov"],
      search_recency_filter: "year",
    });
    expect(result.providerTraceId).toBe("search-trace-1");
    expect(result.sources.map((source) => source.url)).toEqual([
      "https://agency.example.gov/report",
      "https://research.example.gov/study",
    ]);
  });

  it("flattens formatting and tables while preserving factual AI and OpenAI references", () => {
    const result = plainText(
      "## Finding\n\n| Organization | Subject |\n| --- | --- |\n| OpenAI | AI safety research |",
    );
    expect(result).not.toMatch(/[#*_`|]/);
    expect(result).toContain("Organization: OpenAI; Subject: AI safety research");
  });

  it("suppresses provider self-description without changing subject-matter vendor names", () => {
    const result = plainText(
      "I am an AI assistant developed by Perplexity. OpenAI and Perplexity both publish AI research.",
    );
    expect(result).toBe("OpenAI and Perplexity both publish AI research.");
  });

  it("removes research-process preambles without changing the finding", () => {
    expect(plainText("Based on my web search, Minnesota guidance was updated in July.[1]")).toBe(
      "Minnesota guidance was updated in July.[1]",
    );
    expect(plainText("I checked the public sources for recent changes. The guidance remains current.[1]")).toBe(
      "The guidance remains current.[1]",
    );
  });

  it("removes image, rule, strikethrough, HTML, task-list, and footnote syntax", () => {
    const result = plainText(
      [
        "![A chart](https://agency.gov/chart.png)",
        "---",
        "~~Earlier wording~~ Current finding.",
        "<script>alert('unsafe')</script><p>Useful <strong>evidence</strong>.</p>",
        "Claim with a note.[^review]",
        "[^review]: https://agency.gov/footnote",
        "- [x] Reviewed",
      ].join("\n"),
    );

    expect(result).not.toContain("A chart");
    expect(result).toContain("Earlier wording Current finding.");
    expect(result).toContain("Useful evidence.");
    expect(result).toContain("Claim with a note.");
    expect(result).toContain("Reviewed");
    expect(result).not.toMatch(/chart\.png|footnote|alert|!\[|\]\(|\[\^|~~|<\/?[a-z]|^\s*---\s*$/m);
  });

  it("removes encoded HTML and decorative glyphs before presentation", () => {
    const result = plainText(
      "&lt;strong&gt;Finding&lt;/strong&gt; &#x2705; Access improved.[1] &amp; remained measurable.",
    );

    expect(result).toBe("Finding Access improved.[1] & remained measurable.");
    expect(result).not.toMatch(/&lt;|&gt;|2705|✅|<\/?strong>/i);
  });
});


it("rejects any Sonar result instead of accepting an unsupported replacement", async () => {
  const body = await agentResponse().json();
  body.model = "perplexity/sonar-pro";
  await expect(runAgentResponse(new Response(JSON.stringify(body), {status:200}))).rejects.toThrow("research_model_not_allowed");
});


it("joins a fetched newer standard by URL even when an older standard is search result 1", async () => {
  const response = new Response(JSON.stringify({
    id: "resp_wcag_regression", model: "openai/gpt-5.6-luna", status: "completed",
    output: [
      { type: "search_results", queries: ["W3C current WCAG"], results: [{ id: 1, title: "WCAG 2.1", url: "https://www.w3.org/TR/WCAG21/" }] },
      { type: "fetch_url_results", contents: [{ id: 1, title: "WCAG 2.2", url: "https://www.w3.org/TR/WCAG22/", snippet: "Web Content Accessibility Guidelines (WCAG) 2.2" }] },
      { type: "message", content: [{ type: "output_text", text: "The recommendation is WCAG 2.2. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)", annotations: [] }] },
    ], usage: { tool_calls_details: { search_web: { invocation: 1 }, fetch_url: { invocation: 1 } } },
  }));
  const result = await runAgentResponse(response);
  const marker = result.answer.match(/\[(\d+)\]/);
  expect(marker).not.toBeNull();
  expect(result.sources[Number(marker![1]) - 1].url).toBe("https://www.w3.org/TR/WCAG22/");
});

it("rejects ambiguous search IDs rather than silently choosing the first source", async () => {
  const response = new Response(JSON.stringify({
    id: "resp_ambiguous", model: "openai/gpt-5.6-luna", status: "completed",
    output: [
      { type: "search_results", queries: ["standards"], results: [{ id: 1, url: "https://www.w3.org/TR/WCAG21/" }, { id: 1, url: "https://www.w3.org/TR/WCAG22/" }] },
      { type: "message", content: [{ type: "output_text", text: "The current standard is 2.2. [1]" }] },
    ], usage: { tool_calls_details: { search_web: { invocation: 1 } } },
  }));
  await expect(runAgentResponse(response)).rejects.toThrow("research_ambiguous_citation_id");
});
