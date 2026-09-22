import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { CORPUS } from "@/lib/content/corpus";
import {
  contentVisibleInScope,
  getPublishedStaffContent,
  loadStaffContentSnapshot,
  PostgresStaffPublicationReader,
  staffContentSource,
  staffProgramScope,
  type StaffPublicationDatabase,
} from "@/lib/content/staff-publications";
import { docsFromStaffContent } from "@/lib/intelligence/retrieval/search";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";

function rowFor(
  item = CORPUS[0],
  overrides: Partial<{
    content_item_id: string;
    revision_id: string;
    scope_id: string;
    canonical_payload: unknown;
    payload_sha256: string;
    decided_at: string;
    staff_label: string;
  }> = {},
) {
  return {
    content_item_id: item.id,
    revision_id: "00000000-0000-4000-8000-000000000001",
    scope_id: item.scope === "agencywide" ? "one-dhs" : "dsd",
    canonical_payload: item,
    payload_sha256: "a".repeat(64),
    decided_at: "2026-09-05T00:00:00.000Z",
    ...overrides,
  };
}

function readerWithRows(rows: ReturnType<typeof rowFor>[]) {
  const queryCalls: Array<{ statement: string; parameters: readonly unknown[] }> = [];
  const close = vi.fn(async () => undefined);
  const database: StaffPublicationDatabase = {
    async query<T extends Record<string, unknown>>(
      statement: string,
      parameters: readonly unknown[] = [],
    ): Promise<T[]> {
      queryCalls.push({ statement, parameters });
      return rows as unknown as T[];
    },
    close,
  };
  const reader = new PostgresStaffPublicationReader({
    databaseUrl: "postgresql://runtime:secret@example.test:5432/postgres",
    databaseFactory: () => database,
  });
  return { reader, queryCalls, close };
}

describe("staff publication boundary", () => {
  it("uses the current canonical payload title and calls only the scoped read function", async () => {
    const current = { ...CORPUS[0], title: "Current reviewed title" };
    const { reader, queryCalls } = readerWithRows([
      rowFor(current, { staff_label: "Old immutable label" }),
    ]);

    const items = await reader.list("dsd");

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Current reviewed title");
    expect(queryCalls).toEqual([{ statement: expect.stringContaining("pac.read_staff_publications"), parameters: ["dsd", null] }]);
    const statement = queryCalls[0].statement;
    expect(statement).not.toMatch(/source_items|source_carriers|content_revisions|publication_decisions/i);
  });

  it("passes both the requested scope and resource id through the server boundary", async () => {
    const { reader, queryCalls } = readerWithRows([rowFor()]);

    await reader.get(CORPUS[0].id, "one-dhs");

    expect(queryCalls[0].parameters).toEqual(["one-dhs", CORPUS[0].id]);
  });

  it("withholds a payload that is not approved even if a database adapter returns it", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const held = { ...CORPUS[0], status: "under_review" };
    const { reader } = readerWithRows([
      rowFor(CORPUS[0], { canonical_payload: held }),
    ]);

    await expect(reader.list("one-dhs")).resolves.toEqual([]);
    await expect(reader.get(CORPUS[0].id, "one-dhs")).resolves.toBeUndefined();
    warn.mockRestore();
  });

  it.each([
    ["a Markdown heading", { title: "# Hidden heading" }],
    ["a Markdown list", { body: ["- Hidden list item"] }],
    ["a Markdown link", { summary: "Read [this resource](https://example.org)." }],
    ["serialized data", { summary: '{"instruction":"hidden"}' }],
    ["a decorative icon", { title: "Approved resource ✅" }],
    ["model identity language", { summary: "An AI assistant prepared this resource." }],
    ["provider identity language", { body: ["Prepared with OpenAI for staff use."] }],
    ["technical shop talk", { whyItMatters: "The backend runtime uses a provider adapter." }],
    ["an unsafe action link", { nextActions: [{ label: "Open the resource", href: "javascript:alert(1)" }] }],
    ["an unsafe source link", { href: "http://example.org/source" }],
  ])("withholds published content containing %s", async (_label, change) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const unsafe = { ...CORPUS[0], ...change };
    const { reader } = readerWithRows([
      rowFor(CORPUS[0], { canonical_payload: unsafe }),
    ]);

    await expect(reader.list("one-dhs")).resolves.toEqual([]);
    await expect(reader.get(CORPUS[0].id, "one-dhs")).resolves.toBeUndefined();
    warn.mockRestore();
  });

  // September 12, 2026: one compromised row used to fail the whole list, which took every page that
  // lists content down with it. The row is now withheld on its own and the valid rows still serve.
  it("still returns the valid rows when one published row is withheld", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const unsafe = { ...CORPUS[1], title: "System prompt for staff" };
    const { reader } = readerWithRows([
      rowFor(CORPUS[0]),
      rowFor(CORPUS[1], { canonical_payload: unsafe }),
    ]);

    const items = await reader.list("one-dhs");
    expect(items.map((item) => item.id)).toEqual([CORPUS[0].id]);
    expect(String(warn.mock.calls[0]?.[0])).toContain(CORPUS[1].id);
    expect(String(warn.mock.calls[0]?.[0])).not.toContain("System prompt for staff");
    warn.mockRestore();
  });

  it("keeps all25 seed resources and34 restored domain resources readable through the same gate", async () => {
    const snapshot = await loadStaffContentSnapshot({ source: "static", scope: "one-dhs" });

    expect(snapshot.items).toHaveLength(59);
    expect(new Set(snapshot.items.map((item) => item.id)).size).toBe(59);
    for (const item of snapshot.items) {
      expect(item.nextActions.map(({ href }) => href).join("\n")).not.toMatch(
        /^\/(?:guided-start|resources|paths|my-view)(?:[/?#]|$)/m,
      );
      await expect(
        getPublishedStaffContent(item.id, { source: "static", scope: "one-dhs" }),
      ).resolves.toMatchObject({ id: item.id, status: "approved" });
    }
  });

  it("uses plain staff wording for resource-source labels", () => {
    const resourcesPage = fs.readFileSync(path.resolve("app/resources/page.tsx"), "utf8");
    const paths = fs.readFileSync(path.resolve("lib/content/paths.ts"), "utf8");

    expect(resourcesPage).toContain('stringValue(copy, "authorityFilterLabel")');
    expect(getEditableSurfaceDefinition("library.page")?.approvedValues.authorityFilterLabel)
      .toBe("Filter by where the guidance comes from");
    expect(resourcesPage).not.toContain("Filter by source label");
    expect(paths).toContain("Outside source; check before use");
    expect(paths).not.toContain("External (verify)");
  });

  it("does not fall back to static content when PostgreSQL fails", async () => {
    const failure = new Error("database unavailable");
    const postgresReader = {
      list: vi.fn(async () => {
        throw failure;
      }),
      get: vi.fn(async () => {
        throw failure;
      }),
    };

    await expect(
      loadStaffContentSnapshot({ source: "postgres", scope: "one-dhs", postgresReader }),
    ).rejects.toBe(failure);
    await expect(
      getPublishedStaffContent(CORPUS[0].id, { source: "postgres", scope: "one-dhs", postgresReader }),
    ).rejects.toBe(failure);
  });

  it("keeps DSD-only content out of the agencywide view and inherits agencywide content into DSD", () => {
    expect(contentVisibleInScope({ scope: "agencywide" }, "one-dhs")).toBe(true);
    expect(contentVisibleInScope({ scope: "dsd" }, "one-dhs")).toBe(false);
    expect(contentVisibleInScope({ scope: "agencywide" }, "dsd")).toBe(true);
    expect(contentVisibleInScope({ scope: "dsd" }, "dsd")).toBe(true);
  });

  it("adds no static community briefs to a PostgreSQL-backed search index", () => {
    const docs = docsFromStaffContent({
      source: "postgres",
      items: [CORPUS[0]],
    });

    expect(docs).toHaveLength(1);
    expect(docs.every((doc) => doc.kind === "content")).toBe(true);
  });

  it("rejects invalid source and scope configuration", () => {
    expect(() => staffContentSource({ ...process.env, PAC_CONTENT_SOURCE: "intake" })).toThrow(
      "PAC_CONTENT_SOURCE must be static or postgres.",
    );
    expect(() => staffProgramScope({ ...process.env, PAC_STAFF_SCOPE: "another-division" })).toThrow(
      "PAC_STAFF_SCOPE must be one-dhs or dsd.",
    );
  });

  it("grants the runtime role only a security-definer function over current staff publications", () => {
    const migration = fs.readFileSync(
      path.resolve("db/migrations/0004_pac_scoped_staff_publications.sql"),
      "utf8",
    );
    const functionBody = migration.slice(
      migration.indexOf("create or replace function"),
      migration.indexOf("revoke all privileges on function"),
    );

    expect(functionBody).toContain("security definer");
    expect(functionBody).toContain("set search_path = pg_catalog, pac");
    expect(functionBody).toContain("pac.current_staff_publications");
    expect(functionBody).toContain("canonical_payload ->> 'status' = 'approved'");
    expect(functionBody).not.toMatch(/pac\.(source_items|source_carriers|content_revisions|publication_decisions)/);
    expect(migration).toContain("grant execute on function pac.read_staff_publications(text, text) to pac_app_runtime");
    expect(migration).not.toMatch(/grant select .* to pac_app_runtime/i);
  });
});
