import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { lintStaffCopy } from "@/lib/brand/lint";

/**
 * KPI-04: no model brands, internal terms, or icon-only cues in staff routes.
 * Scans JSX string content of staff-facing routes and components. Owner controls are excluded.
 */
const OWNER_COMPONENTS = new Set([
  "evals-client.tsx",
  "orchestrator-client.tsx",
  "queue-item-client.tsx",
  "research-controls-client.tsx",
  "review-client.tsx",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (p.includes(`${path.sep}consultant`)) continue;
      walk(p, out);
    } else if (/\.tsx$/.test(name) && !OWNER_COMPONENTS.has(name)) out.push(p);
  }
  return out;
}

function jsxText(src: string): string {
  // Parse JSX instead of interpreting TypeScript's generic brackets as visible text.
  const source = ts.createSourceFile("copy.tsx", src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const strings: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) strings.push(node.text);
    ts.forEachChild(node, visit);
  }
  visit(source);
  return strings.filter((s) => s.trim().length > 2 && !/^[\w\-./@:?=&%]+$/.test(s.trim())).join("\n");
}

describe("staff routes copy gate (KPI-04)", () => {
  it("separates generic type syntax from visible copy without hiding technical wording", () => {
    const source = 'async function page(): Promise<React.ReactNode> { const title = release.draft?.payload.title ?? "Resource"; return <p title="The runtime is ready">Useful guidance</p>; }';
    expect(jsxText(source)).not.toContain("payload");
    expect(jsxText(source)).toContain("Useful guidance");
    expect(lintStaffCopy(jsxText(source))).toEqual(expect.arrayContaining([expect.objectContaining({ match: "runtime" })]));
  });
  it("has no banned terms, emoji, or icon-only cues in staff-facing routes and components", () => {
    const root = path.resolve(__dirname, "..");
    const files = [...walk(path.join(root, "app")), ...walk(path.join(root, "components"))];
    const problems: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      for (const finding of lintStaffCopy(jsxText(src))) problems.push(`${path.relative(root, f)}: ${finding.code} '${finding.match}'`);
    }
    expect(problems).toEqual([]);
    expect(files.length).toBeGreaterThan(10);
  });
});
