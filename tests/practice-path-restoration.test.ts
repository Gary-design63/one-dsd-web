import { clarifyPracticePath } from "@/lib/content/practice-path-clarifications";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { DOMAIN_PATHS } from "@/lib/content/paths-domain";
import { GRADUATION_PATHS, getPath, type GraduationPath } from "@/lib/content/paths";
import { selfCheck, pathRecommend, type ArtifactValues } from "@/lib/intelligence/agents/graduation";
import { getEditableSurfaceDefinition, graduationPathSurfaceId, applyGraduationPathValues } from "@/lib/content/staff-surface-registry";
import { PRIVATE_BROWSER_STORAGE_KEYS, BROWSER_STORAGE_KEYS } from "@/lib/client/storage-keys";
import { staffCorpus } from "@/lib/content/staff-corpus";
import { canonicalStaffHref } from "@/lib/product";

const ORIGINAL_SOURCES = {
  domains: { file: "tests/fixtures/paths-domain-5680911.ts.txt", sha256: "c6361d26cfb07124688d9573d88bbdc0c05efb91ebd3291abd8567cab904fc5d" },
  core: { file: "tests/fixtures/paths-core-b7536b5.ts.txt", sha256: "5a6155b8e0b3778cb25595212785295724a6366478cc0d9d4ad21d5383406288" },
} as const;

function historicalSource(snapshot: keyof typeof ORIGINAL_SOURCES): string {
  const pinned = ORIGINAL_SOURCES[snapshot];
  const source = readFileSync(pinned.file, "utf8").replaceAll("\r\n", "\n");
  expect(createHash("sha256").update(source).digest("hex")).toBe(pinned.sha256);
  return source;
}

function historicalExports(snapshot: keyof typeof ORIGINAL_SOURCES): Record<string, unknown> {
  const source = historicalSource(snapshot);
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const output = {};
  new Function("exports", js)(output);
  return output;
}

export function completedArtifact(path: GraduationPath): ArtifactValues {
  const values: ArtifactValues = {};
  for (const field of path.artifactFields) {
    values[field.id] = field.type === "list"
      ? ["First option: compare a documented alternative and its effects.", "Second option: compare not proceeding and its effects."]
      : field.type === "date" ? "2099-09-07"
        : "Documented accessible practice for this specific program and its participants.";
  }
  if (path.artifactFields.some(field => field.id === "sources")) values.sources = ["Outside source: https://example.org/evidence — verify with the responsible policy owner."];
  return values;
}

const TYPED_ASK_LINK = "Ask a question";
const BROWSE_ASK_LINK = "Browse common questions";

function withBrowseOnlyAskLabels<T>(value: T): T {
  return JSON.parse(JSON.stringify(value).replaceAll(TYPED_ASK_LINK, BROWSE_ASK_LINK)) as T;
}

describe("Original practice paths restored intact", () => {
  it("restores the original six-path blob except browse-only Ask labels, and preserves existing GP1–5 content", () => {
    const currentDomain = readFileSync("lib/content/paths-domain.ts", "utf8").replaceAll("\r\n", "\n");
    expect(currentDomain.replaceAll(BROWSE_ASK_LINK, TYPED_ASK_LINK)).toBe(historicalSource("domains"));
    expect(DOMAIN_PATHS).toEqual(withBrowseOnlyAskLabels(historicalExports("domains").DOMAIN_PATHS));
    expect(GRADUATION_PATHS.slice(0, 5)).toEqual(withBrowseOnlyAskLabels(historicalExports("core").GRADUATION_PATHS));
    expect(GRADUATION_PATHS.map(path => path.id)).toEqual(Array.from({ length: 13 }, (_, index) => "gp-" + (index + 1)));
    expect(DOMAIN_PATHS.map(path => path.artifactFields.length)).toEqual([9, 12, 9, 10, 11, 11]);
  });

  it.each(DOMAIN_PATHS)("keeps complete steps, editable authoring, private browser notes, and resources for $id", path => {
    expect(path.steps.map(step => step.key)).toEqual(["ask", "ci", "resources", "artifact", "selfcheck", "consult"]);
    expect(path.askStarters).toHaveLength(3);
    const definition = getEditableSurfaceDefinition(graduationPathSurfaceId(path.id))!;
    expect(definition).toBeDefined();
    expect(applyGraduationPathValues(path, definition.approvedValues)).toEqual(clarifyPracticePath(path));
    for (const [index] of path.artifactFields.entries()) {
      expect(definition.fields.some(row => row.key === "artifactField" + index + "Label")).toBe(true);
    }
    for (const key of [BROWSER_STORAGE_KEYS.pathArtifact(path.id), BROWSER_STORAGE_KEYS.pathProgress(path.id)]) {
      expect(PRIVATE_BROWSER_STORAGE_KEYS.some(row => row.area === "local" && row.key === key)).toBe(true);
    }
    for (const link of path.steps.flatMap(step => step.links).filter(link => link.href.startsWith("/resources/"))) {
      const id = link.href.slice("/resources/".length);
      expect(staffCorpus().some(resource => resource.id === id), id).toBe(true);
      expect(canonicalStaffHref(link.href)).toBe("/library/" + id);
    }
  });

  it.each(DOMAIN_PATHS)("never completes $id with any required worksheet field empty", path => {
    const values = completedArtifact(path);
    expect(selfCheck(path, values).passed).toBe(true);
    for (const field of path.artifactFields.filter(field => field.required)) {
      const result = selfCheck(path, { ...values, [field.id]: field.type === "list" ? [" "] : " " });
      expect(result.passed, path.id + ":" + field.id).toBe(false);
      expect(result.requiredFields.find(row => row.id === field.id)?.ok).toBe(false);
    }
  });

  it("requires two decision alternatives and retains the required-process/official-record distinction", () => {
    const path = getPath("gp-7")!;
    const values = completedArtifact(path);
    expect(path.participation).toBe("supports_required");
    expect(path.privacy).toContain("not the official record");
    expect(selfCheck(path, { ...values, alternatives: ["Proceed as proposed"] }).passed).toBe(false);
    expect(selfCheck(path, values).passed).toBe(true);
  });

  it("routes the six original Start signals and preserves meaningful completed core worksheets", () => {
    const signals = ["hiring", "decision", "meeting", "review", "procurement", "pathway"];
    expect(pathRecommend(signals).map(result => result.path?.id)).toEqual(["gp-6", "gp-7", "gp-8", "gp-9", "gp-10", "gp-11"]);
    for (const path of GRADUATION_PATHS.slice(0, 5)) expect(selfCheck(path, completedArtifact(path)).passed, path.id).toBe(true);
  });
});
