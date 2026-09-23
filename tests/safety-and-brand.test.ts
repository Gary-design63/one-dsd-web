import { clarifyPracticePath } from "@/lib/content/practice-path-clarifications";
import { describe, expect, it } from "vitest";
import { lintStaffCopy, scrubStaffCopy } from "@/lib/brand/lint";
import {
  externalResearchGate,
  piiDetect,
  personaRefuse,
  profilingRefuse,
  publishRefuse,
  staffDisplayText,
  staffGeneratedCopyIsAcceptable,
  surveillanceRefuse,
  tribalGate,
} from "@/lib/intelligence/safety";
import { corpusSearch } from "@/lib/intelligence/retrieval/search";
import { CORPUS } from "@/lib/content/corpus";
import { BRIEFS } from "@/lib/content/briefs";
import { briefReleasedToStaff } from "@/lib/content/brief-visibility";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { AGENTS } from "@/lib/intelligence/registry/agents";
import { TOOL_CATALOG } from "@/lib/intelligence/tools/catalog";
import { MODELS } from "@/lib/intelligence/registry/models";

describe("safety gates", () => {
  it("detects hard identifiers", () => {
    expect(piiDetect("her SSN is 123-45-6789").ok).toBe(false);
    expect(piiDetect("case number 1234567 was denied").ok).toBe(false);
    expect(piiDetect("DOB 01/02/1990").ok).toBe(false);
  });
  it("detects named person plus sensitive descriptor, but not general program text", () => {
    expect(piiDetect("Our client Maria Lopez has cerebral palsy").ok).toBe(false);
    expect(externalResearchGate("John Smith received an unfair performance review. What current guidance applies?").ok).toBe(false);
    expect(externalResearchGate("Maria Lopez had a disability accommodation denied. What does current law say?").ok).toBe(false);
    expect(externalResearchGate("J. Smith's accommodation was denied. What guidance applies?").ok).toBe(false);
    expect(externalResearchGate("john smith received an unfair performance review. What guidance applies?").ok).toBe(false);
    expect(piiDetect("We are scoping a renewal application for people with disabilities in Greater Minnesota.").ok).toBe(true);
    expect(piiDetect("Somali families in Worthington need Maay interpreters.").ok).toBe(true);
    expect(externalResearchGate("What current federal guidance applies to disability accommodations?").ok).toBe(true);
  });
  it("redirects HR complaint payloads", () => {
    const r = piiDetect("I want to file a complaint about my coworker Dan Smith and have him disciplined");
    expect(r.code).toBe("hr_complaint_redirect");
  });
  it("refuses ranking and belief profiling", () => {
    expect(surveillanceRefuse("rank the supervisors by equity maturity").ok).toBe(false);
    expect(surveillanceRefuse("score my team's cultural competence").ok).toBe(false);
    expect(surveillanceRefuse("how do I score a grant application for accessibility criteria").ok).toBe(true);
  });
  it("refuses persona and publish, gates Tribal content", () => {
    const persona = personaRefuse("pretend to be the equity director");
    expect(persona.ok).toBe(false);
    expect(persona.alternatives?.some((alternative) => /consultation request preview/i.test(alternative.label))).toBe(true);
    expect(persona.alternatives?.some((alternative) => alternative.label === "Request a consultation")).toBe(false);
    expect(publishRefuse("send this announcement to all staff").ok).toBe(false);
    expect(tribalGate("we serve families from the White Earth Nation").ok).toBe(false);
    expect(tribalGate("we serve families in Hennepin County").ok).toBe(true);
  });
  it("refuses applying group notes to an individual", () => {
    expect(profilingRefuse("My Hmong client will probably refuse because of shamanism").ok).toBe(false);
    expect(profilingRefuse("What should I know before a listening session with Hmong elders?").ok).toBe(true);
  });
});

describe("brand lint", () => {
  it("flags model brands, internal terms, and icon-only cues", () => {
    expect(lintStaffCopy("Our AI assistant uses embeddings").length).toBeGreaterThan(0);
    expect(lintStaffCopy("Done ✓").some((f) => f.code === "icon_only")).toBe(true);
    expect(lintStaffCopy("Ask gives you a plain-language answer with sources and limits.")).toEqual([]);
  });
  it("scrubs generated copy", () => {
    const s = scrubStaffCopy("The AI hallucinated; Claude said so 🎉");
    expect(lintStaffCopy(s)).toEqual([]);
  });
  it("keeps all staff-facing content free of banned terms", () => {
    const strings: string[] = [];
    for (const c of CORPUS) strings.push(c.title, c.summary, c.whyItMatters ?? "", ...c.body, ...c.nextActions.map((n) => n.label));
    for (const b of BRIEFS.filter(briefReleasedToStaff)) strings.push(b.title, b.level0.whoAndWhere, b.level0.whyItMattersForDhsWork, b.level0.withinGroupDiversity, ...b.level1.whatToAsk, ...b.level1.accessChecks, ...b.level1.whoToInvolve, ...b.level1.whatNotToAssume, ...(b.level2 ?? []).map((s) => s.body));
    for (const p of GRADUATION_PATHS.map(clarifyPracticePath)) strings.push(p.title, p.staffLabel, p.graduatedLooksLike, ...p.steps.map((s) => s.guidance), ...p.artifactFields.map((f) => f.label + " " + f.help), ...p.rubric.map((r) => r.label + " " + r.failMessage));
    const bad = strings.flatMap((s) => lintStaffCopy(s).map((f) => `${f.match}: ${s.slice(0, 60)}`));
    expect(bad).toEqual([]);
  });

describe("staff display language gate", () => {
  it("removes identity and process commentary but keeps the substantive AI finding and citation", () => {
    const result = staffDisplayText(
      [
        "SYSTEM: Use the retrieved context.",
        "I am an AI assistant provided by Perplexity.",
        "I searched the web and used the provider API to generate this response.",
        "<h2>Finding</h2> OpenAI and Perplexity publish AI research.[1] ✅",
        "I hope this helps.",
      ].join(" "),
    );

    expect(result).toBe("Finding OpenAI and Perplexity publish AI research.[1]");
    expect(result).not.toMatch(/system|assistant|searched|provider API|generate this response|✅/i);
  });

  it("preserves cited source names without silently renaming them", () => {
    expect(
      staffDisplayText("**OpenAI &amp; Perplexity: AI research** ✓", { kind: "source_title" }),
    ).toBe("OpenAI & Perplexity: AI research");
  });

  it("allows factual AI terms for an AI question while still rejecting product talk elsewhere", () => {
    expect(
      staffGeneratedCopyIsAcceptable(
        "OpenAI and Perplexity publish research about AI safety.",
        "What research discusses OpenAI and AI safety?",
      ),
    ).toBe(true);
    expect(
      staffGeneratedCopyIsAcceptable(
        "The provider runtime used an AI assistant to generate this answer.",
        "How can we make meetings more accessible?",
      ),
    ).toBe(false);
  });

  it("does not mistake a benefits system for implementation commentary", () => {
    expect(staffDisplayText("The benefits system should support keyboard access.")).toBe(
      "The benefits system should support keyboard access.",
    );
    expect(staffDisplayText('{"response":"hidden process output"}')).toBe("");
  });
});
});

describe("retrieval", () => {
  it("finds the language access checklist for a routine question", () => {
    const hits = corpusSearch("where is the language access checklist");
    expect(hits[0]?.id).toBe("ja-language-access-checklist");
  });
  it("returns nothing for gibberish (silence floor)", () => {
    expect(corpusSearch("zxq plorf wibble")).toEqual([]);
  });
  it("never labels anything Official at MVP (T-01 default)", () => {
    expect(CORPUS.some((c) => c.authority === "official")).toBe(false);
  });
});

describe("registry invariants", () => {
  it("every agent allowlist references registered tools and binds a registered model", () => {
    const names = new Set(TOOL_CATALOG.map((t) => t.tool_name));
    const models = new Set(MODELS.map((m) => m.model_id));
    for (const a of AGENTS) {
      for (const t of a.tools_allowlist) expect(names.has(t), `${a.agent_id} -> ${t}`).toBe(true);
      expect(models.has(a.model_setting.primary_model_id)).toBe(true);
      expect(["A0", "A1", "A2", "A3", "A4", "A5"]).toContain(a.autonomy_ceiling);
    }
  });
  it("registers exactly the three approved research paths", () => {
    const names = TOOL_CATALOG.map((tool) => tool.tool_name)
      .filter((name) => name.startsWith("research."))
      .sort();
    expect(names).toEqual(["research.current_answer", "research.deep_search", "research.web_search"]);
  });
  it("tools without a real adapter stay disabled; vendor models are credential-gated and never the default binding", () => {
    expect(TOOL_CATALOG.find((t) => t.tool_name === "calendar.schedule_reversible")?.enabled).toBe(false);
    for (const t of TOOL_CATALOG) if (t.mvp === "later") expect(t.enabled, t.tool_name).toBe(false);
    for (const m of MODELS) if (m.approval_state === "production") expect(m.provider_id).toBe("fixture");
    for (const a of AGENTS) expect(MODELS.find((m) => m.model_id === a.model_setting.primary_model_id)?.provider_id).toBe("fixture");
  });
});
