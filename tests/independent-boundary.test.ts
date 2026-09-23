import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { STATIC_FOOTER_COPY } from "@/lib/content/page-copy-contract";

describe("independent platform boundary", () => {
  it("keeps the current operating boundary in governed footer copy and preserves the historical seed", () => {
    const root = path.resolve(__dirname, "..");
    const header = readFileSync(path.join(root, "components", "site-header.tsx"), "utf8");
    const footer = readFileSync(path.join(root, "components", "site-footer.tsx"), "utf8");
    const migration = readFileSync(
      path.join(root, "db", "migrations", "0007_pac_home_footer_content.sql"),
      "utf8",
    );
    const seededFooter = migration.match(/\$footer\$([\s\S]*?)\$footer\$::jsonb/);

    // Owner direction (2026-09-04): the DHS logo and wordmark stay in the header.
    expect(header).toContain("dhs-logo");
    expect(header).toContain("program-wordmark");

    // Global chrome renders governed footer copy and does not make an ownership claim of its own.
    expect(footer).not.toContain("PROGRAM.agency");
    expect(footer).not.toContain("PROGRAM.ownership");
    expect(footer).toContain('loadPublishedPageCopy("footer")');
    expect(footer).toContain("copy.identityText");

    // Current fallback follows the reconciled owner direction without rewriting the historical publication.
    expect(STATIC_FOOTER_COPY.identityText).toContain("run by the program");
    expect(STATIC_FOOTER_COPY.identityText).toContain("A resource for DHS staff");
    expect(STATIC_FOOTER_COPY.identityText).toContain("not connected to DHS information technology, case, or personnel systems");
    expect(STATIC_FOOTER_COPY.identityText).toContain("does not replace");
    expect(STATIC_FOOTER_COPY.identityText).toContain("Authority labels");
    expect(STATIC_FOOTER_COPY.identityText).not.toContain("consultant-owned");
    expect(seededFooter).not.toBeNull();
    expect(JSON.parse(seededFooter![1]).identityText).toContain("consultant-owned");
    expect(JSON.parse(seededFooter![1]).identityText).not.toBe(STATIC_FOOTER_COPY.identityText);
  });
});
