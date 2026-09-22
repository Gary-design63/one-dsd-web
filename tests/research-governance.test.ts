import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache, setPolicy } from "@/lib/intelligence/policy";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { governedResearch, governedSearch } from "@/lib/intelligence/research";
import { getResearchPolicy, listUsage, recordUsage, setResearchPolicy, usageSummary } from "@/lib/intelligence/research/governance";
import { getResearchProvider, sourcesFromAgent } from "@/lib/intelligence/research/providers";
import type { ToolContext } from "@/lib/intelligence/types";
import { testTraceId } from "@/tests/helpers/opaque-identifiers";

const ctx = (): ToolContext => ({ trace_id: testTraceId("research-context"), agent: getAgent("ask_concierge"), dry_run: false, role: "staff" });
const originalResearchEnabled = process.env.PAC_RESEARCH_ENABLED;

afterEach(() => {
  if (originalResearchEnabled === undefined) delete process.env.PAC_RESEARCH_ENABLED;
  else process.env.PAC_RESEARCH_ENABLED = originalResearchEnabled;
});

describe("governed external research", () => {
  beforeEach(async () => {
    process.env.PAC_RESEARCH_ENABLED = "on";
    resetStoreForTests();
    invalidatePolicyCache();
    process.env.PAC_RESEARCH_FIXTURE = "on";
    delete process.env.PERPLEXITY_API_KEY;
    await setResearchPolicy({ provider_order: ["fixture"] });
  });

  it("uses the fixture provider, types the result as external evidence, and logs usage without the query text", async () => {
    const r = await governedResearch("What did the latest federal guidance say about language access plans?", "current_web", false, ctx());
    expect(r.status).toBe("used");
    if (r.status !== "used") return;
    expect(r.provider).toBe("fixture");
    expect(r.output.sources.every((s) => s.url.startsWith("https://") && s.domain.length > 0)).toBe(true);
    expect(r.note).toMatch(/public web.*not from this program/i);
    const s = await usageSummary();
    expect(s.today.requests).toBe(1);
    const events = JSON.stringify(await (await import("@/lib/intelligence/memory/store")).getStore().list("decision"));
    expect(events).not.toMatch(/federal guidance/);
    const audit = await (await import("@/lib/intelligence/memory/store")).getStore().listAudit();
    expect(audit[0]?.tool_name).toBe("research.current_answer");
  });

  it("never sends a question that fails the PII gate", async () => {
    let called = false;
    const spy: typeof fetch = async () => {
      called = true;
      return new Response("{}", { status: 200 });
    };
    const r = await governedResearch("Our client Ms. Johnson has a diagnosis of schizophrenia and her MA case was denied; what is the current appeal rule?", "current_web", true, ctx(), spy);
    expect(r.status).toBe("not_admitted");
    if (r.status === "not_admitted") expect(r.reason).toBe("safety_refused");
    expect(called).toBe(false);
  });

  it("honors owner stop, research off, on-request mode, and deep-research off", async () => {
    await setPolicy({ killed: true }, "owner");
    let r = await governedResearch("latest rule", "current_web", true, ctx());
    expect(r.status === "not_admitted" && r.reason).toBe("owner_stop");
    await setPolicy({ killed: false }, "owner");
    await setResearchPolicy({ enabled: false });
    r = await governedResearch("latest rule", "current_web", true, ctx());
    expect(r.status === "not_admitted" && r.reason).toBe("research_disabled");
    await setResearchPolicy({ enabled: true, mode: "on_request" });
    r = await governedResearch("latest rule", "current_web", false, ctx());
    expect(r.status === "not_admitted" && r.reason).toBe("mode_off");
    r = await governedResearch("latest rule", "current_web", true, ctx());
    expect(r.status).toBe("used");
    await setResearchPolicy({ mode: "auto", deep_research_enabled: false });
    r = await governedResearch("latest rule", "deep_research", true, ctx());
    expect(r.status === "not_admitted" && r.reason).toBe("deep_research_disabled");
  });

  it("has no caps by default (owner directive) and counts usage anyway", async () => {
    const before = await getResearchPolicy();
    expect(before.daily_request_cap).toBe(0);
    expect(before.monthly_usd_cap).toBe(0);
    expect(before.allowed_domains).toEqual([]);
    expect(before.recency).toBe("any");
    for (let i = 0; i < 3; i++) expect((await governedResearch(`question ${i}`, "current_web", false, ctx())).status).toBe("used");
    const s = await usageSummary();
    expect(s.today.requests).toBe(3);
    expect(s.remaining.requests_today).toBe(-1);
  });

  it("stops at the daily request cap and the monthly budget cap when the owner sets them", async () => {
    await setResearchPolicy({ daily_request_cap: 2, monthly_usd_cap: 100 });
    expect((await governedResearch("q one", "current_web", true, ctx())).status).toBe("used");
    expect((await governedResearch("q two", "current_web", true, ctx())).status).toBe("used");
    const third = await governedResearch("q three", "current_web", true, ctx());
    expect(third.status === "not_admitted" && third.reason).toBe("daily_cap_reached");
    await setResearchPolicy({ daily_request_cap: 1000, monthly_usd_cap: 0.01 });
    await recordUsage({ at: new Date().toISOString(), provider: "fixture", model: "fixture/research-1", depth: "current_web", query_hash: "a".repeat(16), domains: [], estimated_usd: 0.02, ok: true, latency_ms: 1, trace_id: testTraceId("manual-research-usage") });
    const capped = await governedResearch("q four", "current_web", true, ctx());
    expect(capped.status === "not_admitted" && capped.reason).toBe("monthly_cap_reached");
  });

  it("reports no provider when no credential exists and the fixture is off", async () => {
    delete process.env.PAC_RESEARCH_FIXTURE;
    const prev = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";
    try {
      const r = await governedResearch("latest rule", "current_web", true, ctx());
      expect(r.status === "not_admitted" && r.reason).toBe("no_provider_configured");
    } finally {
      (process.env as Record<string, string>).NODE_ENV = prev ?? "test";
    }
  });

  it("parses provider evidence fields, drops bad URLs, and preserves citation order", () => {
    const sources = sourcesFromAgent(
      {
        id: "resp_evidence",
        model: "provider/model",
        output: [
          {
            type: "search_results",
            results: [
              { id: 1, title: "MN Revisor", url: "https://www.revisor.mn.gov/statutes/cite/256B" },
              { id: 2, title: "MN DHS", url: "https://mn.gov/dhs/page", date: "2026-07-01" },
              { id: 3, title: "News", url: "https://news.example.com/a", date: "2026-08-01" },
              { id: 4, title: "bad", url: "javascript:alert(1)" },
            ],
          },
          {
            type: "message",
            content: [{ type: "output_text", text: "x[web:1][web:2]", annotations: [] }],
          },
        ],
      },
      ["mn.gov", "revisor.mn.gov"],
    );
    expect(sources.slice(0, 2).map((s) => s.domain).sort()).toEqual(["mn.gov", "revisor.mn.gov"]);
    expect(sources).toHaveLength(2);
    expect(sources.some((s) => s.domain === "news.example.com")).toBe(false);
    expect(sources.some((s) => s.url.startsWith("javascript:"))).toBe(false);
  });

  it("the Agent API provider reports unconfigured without a credential and exposes its pinned non-Sonar model", async () => {
    expect(getResearchProvider("perplexity_agent").configured()).toBe(false);
    expect(getResearchProvider("perplexity_agent").modelFor("current_web")).toBe("openai/gpt-5.6-luna");
    expect(getResearchProvider("perplexity_agent").modelFor("deep_research")).toBe("openai/gpt-5.6-luna");
    resetStoreForTests();
    delete process.env.PAC_RESEARCH_ENABLED;
    await expect(getResearchPolicy()).resolves.toMatchObject({ enabled: false, mode: "auto" });
  });

  it("normalizes and rewrites a stored legacy provider order", async () => {
    const store = (await import("@/lib/intelligence/memory/store")).getStore();
    await store.put("decision", "research_policy", {
      enabled: true,
      provider_order: ["perplexity_direct", "vercel_gateway", "fixture"],
    });
    const policy = await getResearchPolicy();
    expect(policy.provider_order).toEqual(["perplexity_agent", "fixture"]);
    const persisted = await store.get<{ provider_order: string[] }>("decision", "research_policy");
    expect(persisted?.provider_order).toEqual(["perplexity_agent", "fixture"]);
  });

  it("records each successful ranked Search API request at exactly half a cent", async () => {
    process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
    await setResearchPolicy({ provider_order: ["perplexity_agent"] });
    const fetcher: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          id: "search-ledger-trace",
          results: [{ title: "Public source", url: "https://agency.example.gov/report" }],
        }),
        { status: 200 },
      );
    const result = await governedSearch("current public guidance", true, ctx(), fetcher);
    expect(result.status).toBe("used");
    const [event] = await listUsage();
    expect(event).toMatchObject({
      provider: "perplexity_agent",
      model: "perplexity-search",
      estimated_usd: 0.005,
      provider_trace_id: expect.stringMatching(/^pth_[a-f0-9]{64}$/),
    });
  });


  it("ranked search never bypasses the configured provider order", async () => {
    process.env.PERPLEXITY_API_KEY = "synthetic-test-key";
    const originalOpenAI = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    let calls=0;
    const fetcher: typeof fetch = async () => {calls++; return new Response("{}");};
    try {
      await setResearchPolicy({provider_order:["openai_web"]});
      const unavailable=await governedSearch("current public guidance",true,ctx(),fetcher);
      expect(unavailable.status === "not_admitted" && unavailable.reason).toBe("no_provider_configured");
      expect(calls).toBe(0);
      await setResearchPolicy({provider_order:["fixture"]});
      const fixture=await governedSearch("current public guidance",true,ctx(),fetcher);
      expect(fixture.status).toBe("used");
      expect(calls).toBe(0);
      expect((await listUsage())[0].provider).toBe("fixture");
    } finally {
      if(originalOpenAI===undefined)delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY=originalOpenAI;
    }
  });

  it("orchestrator cycle and proposal lists stay separate even though proposal ids share the cycle prefix", async () => {
    const { runCycle, listCycles, listProposals } = await import("@/lib/intelligence/agents/cycle");
    const report = await runCycle("owner");
    expect(report.proposals.length).toBeGreaterThan(0);
    const cycles = await listCycles();
    expect(cycles.every((c) => Array.isArray(c.steps) && typeof c.at === "string")).toBe(true);
    expect(cycles.some((c) => c.id === report.id)).toBe(true);
    const proposals = await listProposals();
    expect(proposals.every((p) => typeof p.created_at === "string")).toBe(true);
  });
});
