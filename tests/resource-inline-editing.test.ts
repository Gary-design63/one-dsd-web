import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleResourceDraftPatch } from "@/app/api/consultant/resources/[id]/draft/handlers";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { CORPUS } from "@/lib/content/corpus";
import {
  editableFieldsFromContent,
  type EditableResourceState,
} from "@/lib/content/resource-editor-contract";
import {
  PostgresResourceDraftStore,
  ResourceDraftConflictError,
  ResourceDraftValidationError,
  type ResourceDraftDatabase,
} from "@/lib/content/resource-drafts";

const ROOT = path.resolve(__dirname, "..");
const ORIGINAL_OWNER_KEY = process.env.PAC_OWNER_KEY;
const RESOURCE = CORPUS[0];
const FIRST_REVISION = "00000000-0000-4000-8000-000000000001";
const SECOND_REVISION = "00000000-0000-4000-8000-000000000002";

function draftState(overrides: Partial<EditableResourceState> = {}): EditableResourceState {
  return {
    contentItemId: RESOURCE.id,
    expectedRevisionId: SECOND_REVISION,
    publishedRevisionId: FIRST_REVISION,
    hasUnpublishedChanges: true,
    fields: editableFieldsFromContent(RESOURCE),
    ...overrides,
  };
}

function request(body: unknown, owner: boolean) {
  const headers = new Headers({
    "content-type": "application/json",
    origin: "https://program.example",
  });
  if (owner) headers.set("cookie", `${OWNER_COOKIE}=${issueSessionCookieValue()}`);
  return new NextRequest(`https://program.example/api/consultant/resources/${RESOURCE.id}/draft`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
}

function validRequest() {
  return {
    expectedRevisionId: FIRST_REVISION,
    fields: editableFieldsFromContent(RESOURCE),
    changeNote: "Clarified the opening section.",
  };
}

beforeEach(() => {
  process.env.PAC_OWNER_KEY = "inline-edit-test-owner";
});

afterEach(() => {
  if (ORIGINAL_OWNER_KEY === undefined) delete process.env.PAC_OWNER_KEY;
  else process.env.PAC_OWNER_KEY = ORIGINAL_OWNER_KEY;
});

describe("owner-only resource draft route", () => {
  it("rejects a mutation when the owner is not signed in", async () => {
    const save = vi.fn(async () => draftState());

    const response = await handleResourceDraftPatch(request(validRequest(), false), RESOURCE.id, save);

    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(save).not.toHaveBeenCalled();
  });

  it("allows the signed-in owner to save a review draft", async () => {
    const saved = draftState();
    const save = vi.fn(async () => saved);

    const response = await handleResourceDraftPatch(request(validRequest(), true), RESOURCE.id, save);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(save).toHaveBeenCalledWith(RESOURCE.id, validRequest(), { scope: "one-dhs" });
    expect(result).toEqual({
      ok: true,
      draft: saved,
      message: "Draft saved for review. Staff still see the current approved version.",
    });
  });

  it("returns a clear conflict without retrying over a newer draft", async () => {
    const save = vi.fn(async () => {
      throw new ResourceDraftConflictError();
    });

    const response = await handleResourceDraftPatch(request(validRequest(), true), RESOURCE.id, save);

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "A newer draft was saved while you were working. Reload this page before saving again.",
    });
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("carries the owner's selected DSD context through to the scoped draft service", async () => {
    const save = vi.fn(async () => draftState());
    const scoped = request(validRequest(), true);
    scoped.cookies.set("pac_context", "one_dsd");
    const response = await handleResourceDraftPatch(scoped, RESOURCE.id, save);
    expect(response.status).toBe(200);
    expect(save).toHaveBeenCalledWith(RESOURCE.id, validRequest(), { scope: "dsd" });
  });

  it("keeps icon and system-sounding wording out of a saved staff draft", async () => {
    const save = vi.fn(async () => draftState());
    const body = validRequest();
    body.fields = { ...body.fields, title: "AI helper \u{1f916}" };

    const response = await handleResourceDraftPatch(request(body, true), RESOURCE.id, save);

    expect(response.status).toBe(422);
    expect(save).not.toHaveBeenCalled();
  });

  it.each([
    ["bold markers", "**Important**"],
    ["a block quote", "> Quoted guidance"],
    ["italic star markers", "*Important*"],
    ["italic underscore markers", "_Important_"],
    ["a horizontal rule", "---"],
    ["a pipe table", "Topic | Use"],
    ["a numbered parenthesis list", "1) First step"],
    ["a heading marker", "# Heading"],
    ["a pasted object", '{"title":"Pasted data"}'],
  ])("rejects %s instead of saving presentation syntax", async (_label, title) => {
    const save = vi.fn(async () => draftState());
    const body = validRequest();
    body.fields = { ...body.fields, title };

    const response = await handleResourceDraftPatch(request(body, true), RESOURCE.id, save);

    expect(response.status).toBe(400);
    expect(save).not.toHaveBeenCalled();
  });

  it("accepts ordinary punctuation in plain staff wording", async () => {
    const saved = draftState();
    const save = vi.fn(async () => saved);
    const body = validRequest();
    body.fields = {
      ...body.fields,
      title: "Important: access, timing, and follow-up (revised).",
    };

    const response = await handleResourceDraftPatch(request(body, true), RESOURCE.id, save);

    expect(response.status).toBe(200);
    expect(save).toHaveBeenCalledTimes(1);
  });
});

describe("least-privilege resource draft store", () => {
  it("uses only the two narrow database functions", async () => {
    const calls: Array<{ statement: string; parameters: readonly unknown[] }> = [];
    const state = draftState();
    const row = {
      content_item_id: state.contentItemId,
      published_revision_id: state.publishedRevisionId,
      base_revision_id: state.expectedRevisionId,
      editable_fields: state.fields,
      has_unpublished_changes: state.hasUnpublishedChanges,
    };
    const database: ResourceDraftDatabase = {
      async query<T extends Record<string, unknown>>(
        statement: string,
        parameters: readonly unknown[] = [],
      ): Promise<T[]> {
        calls.push({ statement, parameters });
        return [row] as unknown as T[];
      },
      async close() {},
    };
    const store = new PostgresResourceDraftStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test:5432/postgres",
      databaseFactory: () => database,
    });

    await expect(store.read(RESOURCE.id, "one-dhs")).resolves.toEqual(state);
    await expect(store.save(RESOURCE.id, "one-dhs", validRequest())).resolves.toEqual(state);

    expect(calls[0].statement).toContain("pac.read_resource_editing_state");
    expect(calls[1].statement).toContain("pac.create_resource_draft");
    expect(calls[1].parameters[3]).toEqual(validRequest().fields);
    expect(typeof calls[1].parameters[3]).toBe("object");
    expect(calls.map((call) => call.statement).join("\n")).not.toMatch(
      /\b(?:from|join|insert into|update|delete from)\s+pac\.(?:source_|content_|review_|publication_|change_)/i,
    );

    const wrongScope = validRequest();
    wrongScope.fields = { ...wrongScope.fields, scope: "agencywide" };
    await expect(store.save(RESOURCE.id, "dsd", wrongScope)).rejects.toBeInstanceOf(
      ResourceDraftValidationError,
    );
    expect(calls).toHaveLength(2);
  });
});

describe("append-only draft boundary", () => {
  const migration = readFileSync(
    path.join(ROOT, "db", "migrations", "0005_pac_owner_resource_drafts.sql"),
    "utf8",
  );
  const createBody = migration.slice(
    migration.indexOf("create or replace function pac.create_resource_draft"),
    migration.indexOf("revoke all privileges on function pac.assert_valid_resource_edit_fields"),
  );
  const editor = readFileSync(path.join(ROOT, "components", "resource-inline-editor.tsx"), "utf8");
  const resourcePage = readFileSync(path.join(ROOT, "app", "resources", "[id]", "page.tsx"), "utf8");

  it("appends a new draft, pending reviews, source links, and a change record", () => {
    expect(createBody).toContain("insert into pac.content_revisions");
    expect(createBody).toContain("based_on_revision_id");
    expect(createBody).toContain("insert into pac.review_records");
    expect(createBody).toContain("'pending'");
    expect(createBody).toContain("insert into pac.revision_sources");
    expect(createBody).toContain("insert into pac.change_events");
    expect(createBody).not.toMatch(/\bupdate\s+pac\.|\bdelete\s+from\s+pac\./i);
  });

  it("rejects a stale base and never writes a publication decision", () => {
    expect(createBody).toContain("latest_revision_id is distinct from expected_base_revision_id");
    expect(createBody).toContain("using errcode = '40001'");
    expect(createBody).not.toContain("insert into pac.publication_decisions");
    expect(createBody).toContain("'staff_publication_unchanged', true");
  });

  it("limits the runtime login to fixed-path functions and staff-visible resources", () => {
    expect(migration.match(/security definer/g)).toHaveLength(3);
    expect(migration.match(/set search_path = pg_catalog, pac/g)).toHaveLength(5);
    expect(migration).toContain("from pac.publication_decisions decision");
    expect(migration).toContain("from pac.read_staff_publications(requested_scope_id, requested_content_item_id) publication");
    expect(migration).toContain("pac.assert_plain_resource_text");
    expect(migration).toContain("grant execute on function pac.read_resource_editing_state(text, text) to pac_app_runtime");
    expect(migration).toContain("grant execute on function pac.create_resource_draft(text, text, uuid, jsonb, text) to pac_app_runtime");
    expect(migration).not.toMatch(/grant\s+(?:select|insert|update|delete)\s+on\s+pac\./i);
    expect(migration).not.toContain("latest.canonical_payload -> 'provenance'");
    expect(migration).not.toMatch(/select\s+.*from\s+pac\.(?:source_items|source_carriers)/i);
  });

  it("shows controls only after the owner check and uses plain labeled fields without icons", () => {
    // Some library items (learning modules, question banks) are not draft-editable in the
    // database, so this now guards the call in a try/catch that falls back to the
    // read-only view instead of taking the page down — still gated on `owner` first.
    expect(resourcePage).toContain("if (owner) {");
    expect(resourcePage).toContain("editable = await loadEditableResourceState(id, { scope });");
    expect(resourcePage).toContain("{editable ? (");
    expect(editor).toContain("<input");
    expect(editor).toContain("<textarea");
    expect(editor).toContain("<select");
    expect(editor).not.toContain("contentEditable");
    expect(editor).not.toContain("<svg");
    expect(editor).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(editor).toContain("Staff still see the current approved version.");
    expect(editor).toMatch(/id="resource-scope"[\s\S]*?disabled/);
  });
});
