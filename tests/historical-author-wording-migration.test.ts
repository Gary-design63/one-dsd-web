import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lintStaffCopy } from "@/lib/brand/lint";

const root = path.resolve(__dirname, "..");
const migration = readFileSync(path.join(root, "db/migrations/0024_pac_historical_author_wording.sql"), "utf8");
const baseline = readFileSync(path.join(root, "db/migrations/0007_pac_home_footer_content.sql"), "utf8");
const functionPattern = /create or replace function pac\.assert_plain_page_text\(candidate text\)[\s\S]*?\n\$\$;/;
const originalFunction = baseline.replace(/\r\n/g, "\n").match(functionPattern)![0];
const revisedFunction = migration.replace(/\r\n/g, "\n").match(functionPattern)![0];
const historicalNameCheck = "regexp_replace(candidate, '\\mClaude[[:space:]]+McKay\\M', 'historical author', 'g')";

// These cases exercise the migration's extracted brand expression with its
// word-boundary notation mapped to JavaScript for Latin-script names. The
// deployment dry run also validates the actual PostgreSQL function.
const brandPattern = originalFunction.match(/if candidate ~\* '([^']+)' then/)![1];
const brandExpression = new RegExp(brandPattern.replace(/\\[mM]/g, "\\b"), "i");
function sqlBrandCheck(text: string) {
  return brandExpression.test(text.replace(/\bClaude\s+McKay\b/g, "historical author"));
}

describe("historical author wording forward migration", () => {
  it("changes only the input to the existing technical-language check", () => {
    expect(revisedFunction).toBe(originalFunction.replace(
      "if candidate ~* '(\\mAI",
      `if ${historicalNameCheck} ~* '(\\mAI`,
    ));
    expect(migration.match(/regexp_replace\(/g)).toHaveLength(1);
    expect(migration).toContain("immutable");
    expect(migration).toContain("set search_path = pg_catalog, pac");
  });

  it.each([
    "Claude McKay, Langston Hughes, and Zora Neale Hurston",
    "Read Claude McKay’s poetry in its historical context.",
    "Claude  McKay contributed to the Harlem Renaissance.",
    "Claude\nMcKay and other writers shaped American literature.",
  ])("accepts the historical writer without changing his name: %s", text => {
    expect(lintStaffCopy(text)).toEqual([]);
    expect(sqlBrandCheck(text)).toBe(false);
  });

  it.each([
    "Ask Claude about this brief.",
    "Claude McKay and a Claude chatbot",
    "Claude McKay and OpenAI",
    "Claude McKay and an API endpoint",
    "Claude McKayston is not the exempt author name.",
    "Claude McKay2 is not the exempt author name.",
    "Claude mckay is not the exact historical name.",
  ])("retains product and implementation checks: %s", text => {
    expect(lintStaffCopy(text).length).toBeGreaterThan(0);
    expect(sqlBrandCheck(text)).toBe(true);
  });

  it("does not widen the exemption by making its historical name case-insensitive", () => {
    expect(sqlBrandCheck("CLAUDE MCKAY")).toBe(true);
    expect(sqlBrandCheck("claude mckay")).toBe(true);
    expect(migration).not.toContain("'gi'");
  });

  it("has no content writes, publishing decisions, or privilege changes", () => {
    expect(migration).toMatch(/^begin;[\s\S]*commit;\s*$/);
    expect(migration).not.toMatch(/\b(?:insert\s+into|update|delete\s+from|truncate|alter\s+table|drop|grant|revoke)\b/i);
    expect(migration).not.toContain("publication_decisions");
    expect(migration).not.toContain("surface_revisions");
  });
});
