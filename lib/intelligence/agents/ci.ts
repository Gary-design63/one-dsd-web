/**
 * Community Intelligence Guide (CI MVP Contract v0.1). A0 to A2.
 * community.brief_get / brief_list, intent triage (orient vs profile-risk), gap report,
 * anti-profiling refusal, Tribal gate, brief quality checks (CI-E4, CI-E8).
 */
import { BRIEFS, getBrief, type CommunityBrief } from "@/lib/content/briefs";
import { briefVisibleToStaff } from "@/lib/content/brief-visibility";
import { profilingRefuse, runSafetyGates } from "../safety";
import { corpusSearch } from "../retrieval/search";
import { runTool, auditRefusal } from "../tools/runtime";
import type { SafetyResult, ToolContext } from "../types";

export type BriefLevel = 0 | 1 | 2;

export type BriefView = {
  id: string;
  title: string;
  kicker: string;
  status: CommunityBrief["status"];
  draftBanner?: string;
  owner: string;
  reviewDate: string;
  representationReview: string;
  languages: string[];
  level0: CommunityBrief["level0"];
  names: CommunityBrief["names"];
  level1: CommunityBrief["level1"];
  level2?: CommunityBrief["level2"];
  sources: CommunityBrief["sources"];
  observances?: CommunityBrief["observances"];
  relatedPathIds: string[];
  tribalGate: boolean;
};

export type CiResult =
  | { kind: "refusal"; safety: SafetyResult }
  | { kind: "brief"; brief: BriefView }
  | { kind: "gap"; gap: GapReport }
  | { kind: "list"; briefs: Array<Pick<BriefView, "id" | "title" | "kicker" | "status" | "reviewDate" | "languages" | "tribalGate"> & { whoAndWhere: string }> };

export type GapReport = {
  query: string;
  message: string;
  nearest: Array<{ id: string; title: string; href: string }>;
  nextActions: Array<{ label: string; href: string }>;
};

export function briefVisible(b: CommunityBrief): boolean {
  return briefVisibleToStaff(b);
}

export function toView(b: CommunityBrief, level: BriefLevel): BriefView {
  return {
    id: b.id,
    title: b.title,
    kicker: b.kicker,
    status: b.status,
    draftBanner:
      b.status === "under_review"
        ? "This brief is still being reviewed with community representatives. Confirm important details before using it in a decision."
        : b.status === "gated"
          ? "This page is a referral, not Nation-specific guidance. Contact the designated Tribal relations office or liaison before planning consultation or engagement."
          : undefined,
    owner: b.owner,
    reviewDate: b.reviewDate,
    representationReview:
      b.status === "gated"
        ? "Nation-specific guidance is not included on this referral page"
        : b.representationReview === "reviewed"
          ? "Community review is complete"
          : "Community review is still in progress",
    languages: b.languages,
    level0: b.level0,
    names: b.names,
    level1: b.level1,
    level2: level >= 2 ? b.level2 : undefined,
    sources: b.sources,
    observances: b.observances,
    relatedPathIds: b.relatedPathIds,
    tribalGate: Boolean(b.tribalGate),
  };
}

export async function ciList(ctx: ToolContext): Promise<CiResult> {
  const briefs = await runTool(ctx, "community.brief_list", () => BRIEFS.filter(briefVisible));
  return {
    kind: "list",
    briefs: briefs.map((b) => ({ id: b.id, title: b.title, kicker: b.kicker, status: b.status, reviewDate: b.reviewDate, languages: b.languages, tribalGate: Boolean(b.tribalGate), whoAndWhere: b.level0.whoAndWhere })),
  };
}

export async function ciGet(id: string, level: BriefLevel, ctx: ToolContext): Promise<CiResult> {
  const b = getBrief(id);
  if (!b || !briefVisible(b)) return { kind: "gap", gap: gapReport(id) };
  const brief = await runTool(ctx, "community.brief_get", () => toView(b, level), { contentIds: [b.id] });
  return { kind: "brief", brief };
}

/** Free-text entry: triage orient vs profile-risk, then find a brief or report a gap. */
export async function ciQuery(query: string, ctx: ToolContext): Promise<CiResult> {
  const q = (query ?? "").trim();
  const profiling = profilingRefuse(q);
  if (!profiling.ok) {
    await auditRefusal(ctx, "safety.surveillance_refuse", profiling.code!);
    return { kind: "refusal", safety: profiling };
  }
  const gate = runSafetyGates(q, { tribal: false });
  if (!gate.ok) {
    await auditRefusal(ctx, "safety.pii_detect", gate.code!);
    return { kind: "refusal", safety: gate };
  }
  const hits = await runTool(ctx, "corpus.search", () => corpusSearch(q, { limit: 3, kinds: ["brief"] }));
  const top = hits[0];
  if (top) {
    const b = getBrief(top.id);
    if (b && briefVisible(b)) return { kind: "brief", brief: toView(b, 1) };
  }
  return { kind: "gap", gap: gapReport(q) };
}

function gapReport(query: string): GapReport {
  const nearest = corpusSearch(query, { limit: 3, kinds: ["brief"] }).map((h) => ({ id: h.id, title: h.title, href: h.href }));
  return {
    query,
    message:
      "No matching brief is available for that community or topic yet. To avoid making assumptions, use the intercultural practice note, explore Resources, or ask your Equity Director. Support also shows the consultation preview and other ways to get help.",
    nearest,
    nextActions: [
      { label: "Prepare for intercultural work without making assumptions", href: "/library/pn-intercultural-method" },
      { label: "Explore Resources", href: "/library" },
      { label: "Visit Support about the missing guidance", href: "/support" },
    ],
  };
}

/** CI-E4 / CI-E8 quality criteria: required sections non-empty; depth may vary. */
export function briefQualityCheck(b: CommunityBrief): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  if (!b.level0.whoAndWhere || !b.level0.whyItMattersForDhsWork || !b.level0.withinGroupDiversity) problems.push("Level 0 incomplete");
  for (const k of ["whatToAsk", "accessChecks", "whoToInvolve", "whatNotToAssume"] as const) {
    if (!b.level1[k].length || b.level1[k].some((s) => s.trim().length < 12)) problems.push(`Work panel section empty or not actionable: ${k}`);
  }
  if (!b.names.preferred.length || !b.names.note) problems.push("Name variation missing");
  if (!b.owner || !b.reviewDate) problems.push("Owner or review date missing");
  if (!b.sources.length) problems.push("No sources or provenance listed");
  if (b.tribalGate && (b.level2?.length ?? 0) > 0) problems.push("Tribal gate must not carry Nation-specific guidance");
  return { ok: problems.length === 0, problems };
}
