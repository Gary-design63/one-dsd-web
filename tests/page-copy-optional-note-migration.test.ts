import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "..");
const migration = readFileSync(
  path.join(root, "db", "migrations", "0021_pac_optional_home_note.sql"),
  "utf8",
);

describe("optional Home supporting-note migration", () => {
  it("permits only an exactly blank Home heroNote before the ordinary checks", () => {
    const blankException = migration.indexOf("and candidate_key = 'heroNote'");
    const lengthCheck = migration.indexOf("if length(btrim(candidate_value)) not between 1 and maximum_length then");
    const plainTextCheck = migration.indexOf("perform pac.assert_plain_page_text(candidate_value)");

    expect(migration).toContain("create or replace function pac.assert_valid_page_block_copy");
    expect(migration).toMatch(
      /requested_content_item_id = 'page-home'\s+and candidate_key = 'heroNote'\s+and candidate_value = '' then\s+continue;/,
    );
    expect(migration.match(/\bcontinue;/g)).toHaveLength(1);
    expect(migration).toContain("if length(btrim(candidate_value)) not between 1 and maximum_length then");
    expect(migration).toContain("perform pac.assert_safe_page_link(candidate_value)");
    expect(migration).toContain("perform pac.assert_plain_page_text(candidate_value)");
    expect(blankException).toBeGreaterThan(-1);
    expect(blankException).toBeLessThan(lengthCheck);
    expect(lengthCheck).toBeLessThan(plainTextCheck);
  });

  it("keeps heroNote present and preserves the complete Home and footer contracts", () => {
    expect(migration).toContain("'heroLede', 'heroNote', 'heroImageAlt'");
    expect(migration).toContain("requested_content_item_id = 'site-footer'");
    expect(migration).toContain("where not requested_copy ? expected.name");
    expect(migration).toContain("where actual.name <> all(expected_keys)");
    expect(migration).toContain("jsonb_typeof(requested_copy -> candidate_key) <> 'string'");
  });

  it("changes validation only and never writes or publishes content", () => {
    expect(migration).toMatch(/^begin;[\s\S]*commit;\s*$/);
    expect(migration).not.toMatch(/\b(?:insert\s+into|update|delete\s+from|truncate|alter\s+table|drop)\b/i);
    expect(migration).not.toContain("publication_decisions");
    expect(migration).not.toContain("content_revisions");
  });
});
