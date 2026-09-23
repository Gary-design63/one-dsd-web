import { describe, expect, it } from "vitest";
import {
  DEGRADED_COPY,
  PARTNERSHIP_SPINE,
  PRIVACY_NOTICE,
  PROGRAM,
  SIX_GOALS,
  TOOLKIT_FAMILIES,
} from "@/lib/constants";
import { BRIEFS } from "@/lib/content/briefs";
import { briefReleasedToStaff } from "@/lib/content/brief-visibility";
import { CORPUS } from "@/lib/content/corpus";
import { GRADUATION_PATHS, ROUTING_SIGNALS } from "@/lib/content/paths";
import { clarifyPracticePath } from "@/lib/content/practice-path-clarifications";
import {
  CATEGORY_LABEL,
  EMBED_QUESTIONS,
  EQUITY_IMPACT_QUESTIONS,
  INVOLVEMENT_ROLES,
  JOURNEY_BURDEN_PROMPTS,
  LAUNCH_TYPE_LABEL,
  STAGE_LABEL,
} from "@/lib/content/question-banks";
import { AUTHORITY, CONTENT_TYPE_LABEL, LAYER_LABEL } from "@/lib/content/types";
import { lintStaffCopy } from "@/lib/brand/lint";
import { ONE_DSD_TEAM_SEED } from "@/lib/collaboration/seed";
import { toOneDsdTeamWorkspaceView } from "@/lib/collaboration/view";
import { EXTERNAL_EVIDENCE_NOTE } from "@/lib/intelligence/research";

function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(stringsIn);
  }
  return [];
}

function staffContent(): string[] {
  const values: unknown[] = [
    PROGRAM,
    PRIVACY_NOTICE,
    DEGRADED_COPY,
    SIX_GOALS,
    TOOLKIT_FAMILIES,
    PARTNERSHIP_SPINE,
    AUTHORITY,
    CONTENT_TYPE_LABEL,
    LAYER_LABEL,
    LAUNCH_TYPE_LABEL,
    STAGE_LABEL,
    CATEGORY_LABEL,
    EMBED_QUESTIONS,
    EQUITY_IMPACT_QUESTIONS,
    JOURNEY_BURDEN_PROMPTS,
    INVOLVEMENT_ROLES,
    ROUTING_SIGNALS,
    EXTERNAL_EVIDENCE_NOTE,
    toOneDsdTeamWorkspaceView(ONE_DSD_TEAM_SEED),
  ];

  for (const item of CORPUS) {
    values.push({
      title: item.title,
      summary: item.summary,
      whyItMatters: item.whyItMatters,
      body: item.body,
      nextActions: item.nextActions.map((action) => action.label),
      tags: item.tags,
      owner: item.owner,
      sourceName: item.sourceName,
    });
  }

  for (const brief of BRIEFS.filter(briefReleasedToStaff)) {
    values.push({
      title: brief.title,
      kicker: brief.kicker,
      languages: brief.languages,
      level0: brief.level0,
      names: brief.names,
      level1: brief.level1,
      level2: brief.level2,
      sources: brief.sources.map(({ label, note }) => ({ label, note })),
      observances: brief.observances,
      tags: brief.tags,
    });
  }

  // Staff read the clarified wording; the recovered path sources stay byte-for-byte.
  for (const path of GRADUATION_PATHS.map(clarifyPracticePath)) {
    values.push({
      title: path.title,
      staffLabel: path.staffLabel,
      signals: path.signals,
      startingCompetence: path.startingCompetence,
      graduatedLooksLike: path.graduatedLooksLike,
      askStarters: path.askStarters,
      steps: path.steps,
      artifactTitle: path.artifactTitle,
      artifactFields: path.artifactFields,
      rubric: path.rubric,
      antiPerformative: path.antiPerformative,
      privacy: path.privacy,
    });
  }

  return stringsIn(values).filter(Boolean);
}

describe("staff voice release gate", () => {
  it("keeps structured staff content free of internal and vendor language", () => {
    const problems = staffContent().flatMap((value) =>
      lintStaffCopy(value).map((finding) => `${finding.code} '${finding.match}' in '${value.slice(0, 100)}'`),
    );
    expect(problems).toEqual([]);
  });

  it("does not place Markdown syntax in structured staff content", () => {
    const markdown = staffContent().filter((value) =>
      /```|^\s{0,3}#{1,6}\s|\[[^\]]+]\(https?:\/\/|\*\*[^*]+\*\*/m.test(value),
    );
    expect(markdown).toEqual([]);
  });

  it("keeps every held community draft explicit and outside the staff-release copy set", () => {
    const held = BRIEFS.filter((brief) => !briefReleasedToStaff(brief));
    expect(held.length).toBeGreaterThan(0);
    for (const brief of held) {
      expect(brief.status, brief.id).toBe("under_review");
      expect(brief.representationReview, brief.id).toBe("pending");
      expect(brief.owner.trim().length, brief.id).toBeGreaterThan(0);
      expect(brief.reviewDate, brief.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(brief.sources.length, brief.id).toBeGreaterThan(0);
    }
  });
});
