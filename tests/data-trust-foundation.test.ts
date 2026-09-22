import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  path.resolve(import.meta.dirname, "../db/migrations/0009_pac_data_trust_foundation.sql"),
  "utf8",
);

describe("RG-2 data trust migration contract", () => {
  it("defaults unreviewed source, content, retrieval, and graph layers to S2", () => {
    for (const table of [
      "source_carriers",
      "source_items",
      "content_items",
      "content_revisions",
      "publication_decisions",
      "assets",
      "search_chunks",
      "search_embeddings",
      "knowledge_nodes",
      "knowledge_edges",
    ]) {
      expect(migration).toMatch(
        new RegExp(`alter table pac\\.${table}[\\s\\S]*?sensitivity_class text not null default 'S2'`, "i"),
      );
    }
  });

  it("places prohibited-profile checks on every generic persisted JSON boundary", () => {
    expect(migration).toContain("create or replace function pac.assert_no_prohibited_profile_fields(payload jsonb)");
    expect(migration).toContain("where columns.table_schema = 'pac'");
    expect(migration).toContain("and columns.udt_name = 'jsonb'");
    expect(migration).toContain("and tables.table_type = 'BASE TABLE'");
    expect(migration).toContain(
      "create trigger no_prohibited_profile_fields before insert or update on pac.%I",
    );
  });

  it("requires explicit safe exposure and keeps unsafe classes out of staff retrieval", () => {
    expect(migration).toContain("new.sensitivity_class is distinct from revision_class");
    expect(migration).toContain("new.unauthenticated_exposure_permitted and nullif(trim(new.exposure_reason), '') is null");
    expect(migration).toContain("publication.unauthenticated_exposure_permitted = true");
    expect(migration).toContain("i.sensitivity_class in ('S0', 'S1')");
    expect(migration).toContain("r.sensitivity_class in ('S0', 'S1')");
    expect(migration).toContain("p.sensitivity_class in ('S0', 'S1')");
  });

  it("uses an atomic upsert without granting direct counter-table access", () => {
    expect(migration).toContain("on conflict (scope, subject_hash) do update");
    expect(migration).toContain("pac.runtime_rate_limits.request_count + 1");
    expect(migration).toContain("revoke all privileges on pac.runtime_rate_limits from pac_app_runtime");
    expect(migration).toContain(
      "grant execute on function pac.consume_runtime_rate_limit(text, text, integer, integer) to pac_app_runtime",
    );
    expect(migration).not.toMatch(/grant\s+(?:select|insert|update|delete)[^;]*runtime_rate_limits[^;]*pac_app_runtime/i);
  });
});
