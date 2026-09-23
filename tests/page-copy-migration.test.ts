import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FOOTER_COPY_FIELD_GROUPS, HOME_COPY_FIELD_GROUPS } from "@/components/page-copy-editor";
import {
  FOOTER_COPY_KEYS,
  FooterCopySchema,
  HOME_COPY_KEYS,
  HomePageCopySchema,
  STATIC_FOOTER_COPY,
  STATIC_HOME_COPY,
} from "@/lib/content/page-copy-contract";

const ROOT = path.resolve(__dirname, "..");
const historicalMigration = readFileSync(
  path.join(ROOT, "db", "migrations", "0007_pac_home_footer_content.sql"),
  "utf8",
);
const trustedReleaseMigration = readFileSync(
  path.join(ROOT, "db", "migrations", "0016_pac_trusted_home_footer_release.sql"),
  "utf8",
);
const migration = trustedReleaseMigration;

const historicalS1HomeCopy = {
  ...STATIC_HOME_COPY,
  // The September 5 introduction remains historical after the owner's homepage revision.
  aboutLabel: "What this program is.",
  aboutText: "This is an independently managed, internal-purpose resource for DHS staff. It is not connected to DHS information technology, case, or personnel systems. Its guidance supports knowledge work and does not replace policy, legal advice, formal processes, or decisions made by responsible DHS offices. Authority labels show what each item can and cannot establish.",
  guidedIntro: "Choose the area closest to your work. Each area connects learning, practical questions, reviewed material, a useful work product, and the people who hold the relevant responsibility.",
  applyLabel: "Practice: build a useful work product",
  heroLede: "Practical support for workplace culture and equitable workforce, policy, program, and service decisions.",
  heroNote: "Bring the work in front of you. Ask a question, find reviewed guidance, practice with a useful work product, or identify the right person to involve. Ordinary learning and practice are voluntary. Notes you choose to save stay in the web browser you are using.",
  // The September 8 hero photograph replaced the office-table image; the S1 release described the earlier one.
  heroImageAlt: "Colleagues in conversation around a table with papers and a laptop.",
  // The plain-language home wording came after the S1 release; the release text stays historical.
  guidedFallbackNote: "Answer three short questions about your role, task, and timing. Start will suggest a useful route and explain why.",
  askDescription: "Ask a work question and get a clear answer with its sources, scope, and limits. No meeting is needed.",
  privacyText: "Please do not enter case, medical, personnel, complaint, or identifying details anywhere in this program. Guidance shows its sources, scope, and limits. It does not replace official policy, legal advice, Human Resources, civil-rights processes, Tribal consultation, or another responsible office.",
};

const historicalS1FooterCopy = {
  ...STATIC_FOOTER_COPY,
  // The plain-language footer wording came after the S1 release; the release text stays historical.
  identityText: "This independently managed, internal-purpose resource is built for DHS staff. It is not connected to DHS information technology, case, or personnel systems. Its guidance supports knowledge work and does not replace policy, legal advice, formal processes, or decisions made by responsible DHS offices. Authority labels show what each item can and cannot establish.",
  privacyText: "Please do not enter case, medical, personnel, complaint, or identifying details anywhere in this program. Working notes stay in the web browser you are using, where another person using the same browser may be able to see them. If any part of the program is difficult to use with assistive technology, Support explains how to report the barrier.",
};

function embeddedCopy(source: string, tag: "home" | "footer") {
  const match = source.match(new RegExp(`\\$${tag}\\$([\\s\\S]*?)\\$${tag}\\$::jsonb`));
  if (!match) throw new Error(`Missing ${tag} seed copy.`);
  return JSON.parse(match[1]) as unknown;
}

describe("Home and footer governed content migration", () => {
  it("preserves a schema-valid historical publication without treating it as current fallback copy", () => {
    expect(HomePageCopySchema.safeParse(embeddedCopy(historicalMigration, "home")).success).toBe(true);
    expect(FooterCopySchema.safeParse(embeddedCopy(historicalMigration, "footer")).success).toBe(true);
    expect(embeddedCopy(historicalMigration, "home")).not.toEqual(STATIC_HOME_COPY);
    expect(embeddedCopy(historicalMigration, "footer")).not.toEqual(STATIC_FOOTER_COPY);
    // Git stores this applied migration with LF; Windows may check it out as CRLF.
    expect(createHash("sha256").update(historicalMigration.replace(/\r\n/g, "\n")).digest("hex").toUpperCase()).toBe(
      "F26B0C9E10016BAED67D4B861F692A7636CB93DE11B33B0C76FDE3B309F5A100",
    );
    expect(historicalMigration).toContain("owner_approved_for_ingestion");
    expect(historicalMigration).toContain("accounted built-in wording".replace("accounted", "Accounted"));
    expect(historicalMigration).toContain("on conflict (logical_key) do nothing");
    expect(historicalMigration).toContain("on conflict (content_item_id) do nothing");
    expect(historicalMigration).toContain("where not exists");
  });

  it("keeps the September 5 S1 release as accurate history while preview defaults evolve", () => {
    expect(createHash("sha256").update(trustedReleaseMigration.replace(/\r\n/g, "\n")).digest("hex")).toBe("61a2b61e7b20dd4d9f27c374dce0a64376ede571d1e3ddda9885cb564eeb5a41");
    expect(embeddedCopy(trustedReleaseMigration, "home")).toEqual(historicalS1HomeCopy);
    expect(embeddedCopy(trustedReleaseMigration, "home")).not.toEqual(STATIC_HOME_COPY);
    expect(embeddedCopy(trustedReleaseMigration, "footer")).toEqual(historicalS1FooterCopy);
    expect(embeddedCopy(trustedReleaseMigration, "footer")).not.toEqual(STATIC_FOOTER_COPY);
    expect(trustedReleaseMigration).toContain("page-copy-reconciled-s1-2026-09-05");
    expect(trustedReleaseMigration).toContain("page_block_revision_is_staff_exposable");
    expect(trustedReleaseMigration).toContain("decision.sensitivity_class = 'S1'");
    expect(trustedReleaseMigration).toContain("decision.unauthenticated_exposure_permitted = true");
    expect(trustedReleaseMigration).toContain("decision.decision_rank = 1");
    expect(trustedReleaseMigration).not.toContain("pac.allow_immutable_change");
    for (const table of [
      "source_carriers",
      "source_items",
      "content_revisions",
      "revision_sources",
      "review_records",
      "publication_decisions",
      "change_events",
    ]) {
      expect(trustedReleaseMigration).not.toMatch(
        new RegExp(`(?:update\\s+pac\\.${table}|delete\\s+from\\s+pac\\.${table})`, "i"),
      );
    }
  });

  it("covers every editable field in a plain labeled form", () => {
    const homeFields = HOME_COPY_FIELD_GROUPS.flatMap((group) => group.fields.map((field) => field.key));
    const footerFields = FOOTER_COPY_FIELD_GROUPS.flatMap((group) => group.fields.map((field) => field.key));
    expect([...new Set(homeFields)].sort()).toEqual([...HOME_COPY_KEYS].sort());
    expect([...new Set(footerFields)].sort()).toEqual([...FOOTER_COPY_KEYS].sort());
  });

  it("keeps draft creation separate from publication", () => {
    const draftBody = migration.slice(
      migration.indexOf("create or replace function pac.create_page_block_draft"),
      migration.indexOf("create or replace function pac.record_page_block_review"),
    );
    expect(draftBody).toContain("insert into pac.content_revisions");
    expect(draftBody).toContain("insert into pac.review_records");
    expect(draftBody).toContain("'pending'");
    expect(draftBody).toContain("insert into pac.revision_sources");
    expect(draftBody).toContain("insert into pac.change_events");
    expect(draftBody).not.toContain("insert into pac.publication_decisions");
    expect(draftBody).not.toMatch(/\bupdate\s+pac\.|\bdelete\s+from\s+pac\./i);
  });

  it("requires reviews and a separate publishing decision", () => {
    const publishBody = migration.slice(
      migration.indexOf("create or replace function pac.publish_page_block_draft"),
      migration.indexOf("create or replace function pac.withdraw_page_block_publication"),
    );
    expect(publishBody).toContain("current_review.status not in ('pass', 'not_applicable')");
    expect(publishBody).toContain("'status', 'approved'");
    expect(publishBody).toContain("insert into pac.publication_decisions");
    expect(publishBody).toContain("'explicit_owner_decision', true");
    expect(migration).toContain("rollback_page_block_publication");
    expect(migration).toContain("withdraw_page_block_publication");
  });

  it("keeps inherited publications read-only and rejects stale review or publication decisions", () => {
    expect(migration).toContain("assert_page_block_mutation_allowed");
    expect(migration).toContain("item.default_scope_id = 'one-dhs'");
    expect(migration).toContain("item.restricted = true");
    expect(migration).toContain("previous_review_id is distinct from expected_previous_review_id");
    expect(migration.match(/current_publication_decision_id is distinct from expected_publication_decision_id/g)).toHaveLength(3);
    expect(migration).toContain("'reviewId', review.review_id");
    expect(migration).toContain("'publicationDecisionId', publication_decision_id::text");
    expect(migration).toContain("Unexpected Home or footer history must be reconciled");
  });

  it("gives the runtime role functions but no content-table privileges", () => {
    expect(migration.match(/security definer/g)).toHaveLength(8);
    for (const functionName of [
      "read_page_block_publication",
      "read_page_block_editing_state",
      "create_page_block_draft",
      "record_page_block_review",
      "publish_page_block_draft",
      "withdraw_page_block_publication",
      "rollback_page_block_publication",
    ]) expect(migration).toMatch(new RegExp(`grant execute on function pac\\.${functionName}`));
    expect(migration).not.toMatch(/grant\s+(select|insert|update|delete)\s+on\s+pac\./i);
    expect(migration).toContain("set row_security = off");
  });

  it("enforces staff language, plain text, icons, and safe links inside PostgreSQL", () => {
    expect(historicalMigration).toContain("Page wording must use plain text");
    expect(historicalMigration).toContain("Page wording must not contain serialized data");
    expect(historicalMigration).toContain("Page wording must not contain icons");
    expect(historicalMigration).toContain("technical product language that is not staff-facing");
    expect(historicalMigration).toContain("Page links must use a program path or secure web address");
  });
});
