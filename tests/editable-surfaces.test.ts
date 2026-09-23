import { describe, expect, it, vi } from "vitest";
import {
  EditableSurfaceConflictError,
  EditableSurfaceStore,
  editableSurfaceSource,
  editableSurfaceEditingAvailable,
  loadPublishedEditableSurface,
  requiredEditableSurfaceReviews,
  type EditableSurfaceDatabase,
  type EditableSurfaceEditingState,
} from "@/lib/content/editable-surfaces";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import type { EditableSurfaceDocument, EditableSurfaceMutation } from "@/lib/content/editable-surface-contract";

const REVISION = "11111111-1111-4111-8111-111111111111";
const DRAFT = "22222222-2222-4222-8222-222222222222";
const REVIEW = "33333333-3333-4333-8333-333333333333";
const DECISION = "17";

describe("incremental database editing", () => {
  it("enables only selected areas without switching the resource source", () => {
    const env: NodeJS.ProcessEnv = { NODE_ENV: "test", PAC_DATABASE_EDITABLE_SURFACES: "workforce.dsd, amplify.home", PAC_RUNTIME_DATABASE_URL: "configured" };
    expect(editableSurfaceSource("workforce.dsd", env)).toBe("postgres");
    expect(editableSurfaceSource("amplify.home", env)).toBe("postgres");
    expect(editableSurfaceSource("community-brief.somali", env)).toBe("static");
    expect(editableSurfaceEditingAvailable(env, "workforce.dsd")).toBe(true);
    expect(editableSurfaceEditingAvailable(env, "community-brief.somali")).toBe(false);
    expect(editableSurfaceEditingAvailable({ NODE_ENV: "test", PAC_DATABASE_EDITABLE_SURFACES: "workforce.dsd" }, "workforce.dsd")).toBe(false);
  });
});

function definition() {
  const value = getEditableSurfaceDefinition("about.page");
  if (!value) throw new Error("Missing test surface.");
  return value;
}

function document(scope: "one-dhs" | "dsd" = "one-dhs"): EditableSurfaceDocument {
  return { schemaVersion: 1, surfaceId: "about.page", scope, values: definition().approvedValues };
}

function state(): EditableSurfaceEditingState {
  return {
    surfaceId: "about.page",
    scope: "one-dhs",
    definition: definition(),
    expectedRevisionId: DRAFT,
    effective: {
      source: "postgres",
      surfaceId: "about.page",
      requestedScope: "one-dhs",
      sourceScope: "one-dhs",
      revisionId: REVISION,
      publicationDecisionId: DECISION,
      decidedAt: "2026-09-05T12:00:00.000Z",
      isInherited: false,
      document: document(),
      values: document().values,
    },
    draft: {
      revisionId: DRAFT,
      revisionNumber: 2,
      basedOnRevisionId: REVISION,
      document: document(),
      changeNote: "Clarified the purpose.",
      createdAt: "2026-09-05T13:00:00.000Z",
      reviews: requiredEditableSurfaceReviews(definition()).map((dimension) => ({
        reviewId: REVIEW,
        dimension,
        status: "pending",
        note: null,
        recordedAt: "2026-09-05T13:00:00.000Z",
      })),
      canPublish: false,
    },
    latestDecision: {
      publicationDecisionId: DECISION,
      decision: "publish",
      revisionId: REVISION,
      reason: "Initial owner-approved staff wording.",
      decidedAt: "2026-09-05T12:00:00.000Z",
    },
    inheritedFrom: null,
    hasUnpublishedChanges: true,
    history: [],
  };
}

function databaseReturningState(statements: string[]) {
  const database: EditableSurfaceDatabase = {
    async query<T extends Record<string, unknown>>(statement: string, parameters: readonly unknown[] = []) {
      statements.push(statement);
      const scope = parameters[0] === "dsd" ? "dsd" : "one-dhs";
      return [{ state: {
        surfaceId: "about.page",
        scope,
        expectedRevisionId: DRAFT,
        effective: {
          revisionId: REVISION,
          sourceScope: "one-dhs",
          publicationDecisionId: DECISION,
          decidedAt: "2026-09-05T12:00:00.000Z",
          document: document(),
        },
        draft: { ...state().draft!, document: document(scope) },
        latestDecision: state().latestDecision,
        inheritedFrom: scope === "dsd" ? "one-dhs" : null,
        hasUnpublishedChanges: true,
        history: [],
      } }] as unknown as T[];
    },
    async close() {},
  };
  return database;
}

describe("editable surface PostgreSQL service", () => {
  it("reads inherited approved wording through the fixed publication function", async () => {
    const calls: Array<{ statement: string; parameters: readonly unknown[] }> = [];
    const database: EditableSurfaceDatabase = {
      async query<T extends Record<string, unknown>>(statement: string, parameters: readonly unknown[] = []) {
        calls.push({ statement, parameters });
        return [{
          surface_id: "about.page",
          revision_id: REVISION,
          scope_id: "one-dhs",
          document: document(),
          publication_decision_id: DECISION,
          decided_at: "2026-09-05T12:00:00.000Z",
        }] as unknown as T[];
      },
      async close() {},
    };
    const store = new EditableSurfaceStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test/postgres",
      databaseFactory: () => database,
    });

    const published = await store.readPublished("about.page", "dsd");
    expect(published).toMatchObject({
      sourceScope: "one-dhs",
      requestedScope: "dsd",
      isInherited: true,
      values: definition().approvedValues,
    });
    expect(calls[0].statement).toContain("pac.read_surface_publication");
    expect(calls[0].parameters).toEqual(["dsd", "about.page"]);
  });

  it("uses only narrow functions for every owner action", async () => {
    const statements: string[] = [];
    const store = new EditableSurfaceStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test/postgres",
      databaseFactory: () => databaseReturningState(statements),
    });
    const actions: EditableSurfaceMutation[] = [
      { action: "save_draft", scope: "one-dhs", expectedRevisionId: REVISION, document: document(), changeNote: null },
      { action: "record_review", scope: "one-dhs", revisionId: DRAFT, dimension: "accessibility", status: "pass", expectedReviewId: REVIEW, note: null },
      { action: "publish", scope: "one-dhs", revisionId: DRAFT, expectedPublicationDecisionId: DECISION, reason: "All required reviews are complete." },
      { action: "withdraw", scope: "one-dhs", expectedPublishedRevisionId: REVISION, expectedPublicationDecisionId: DECISION, reason: "Temporarily remove this wording." },
      { action: "resume_inheritance", scope: "dsd", expectedPublicationDecisionId: DECISION, reason: "Return to the current One DHS wording." },
      { action: "restore", scope: "one-dhs", targetRevisionId: REVISION, expectedPublicationDecisionId: DECISION, reason: "Restore the earlier approved wording." },
    ];
    for (const action of actions) await store.mutate("about.page", action);

    const combined = statements.join("\n");
    for (const functionName of [
      "create_surface_draft",
      "record_surface_review",
      "publish_surface_draft",
      "withdraw_surface_publication",
      "resume_surface_inheritance",
      "restore_surface_revision",
    ]) expect(combined).toContain(`pac.${functionName}`);
    expect(combined).not.toMatch(
      /\b(?:from|join|insert into|update|delete from)\s+pac\.surface_(?:definitions|revisions|reviews|publication_decisions|change_events)/i,
    );
  });

  it("does not query an administration-owned scope from a DSD-only or One-DHS-only editor", async () => {
    const database: EditableSurfaceDatabase = {
      query: vi.fn(async () => []),
      async close() {},
    };
    const store = new EditableSurfaceStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test/postgres",
      databaseFactory: () => database,
    });
    await expect(store.readEditingState("one-dsd.page", "one-dhs")).resolves.toBeUndefined();
    await expect(store.readEditingState("support.request.one-dhs", "dsd")).resolves.toBeUndefined();
    expect(database.query).not.toHaveBeenCalled();
  });

  it("maps a stale PostgreSQL compare-and-swap token to a conflict", async () => {
    const database: EditableSurfaceDatabase = {
      async query() {
        throw Object.assign(new Error("stale"), { code: "40001" });
      },
      async close() {},
    };
    const store = new EditableSurfaceStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test/postgres",
      databaseFactory: () => database,
    });
    await expect(store.mutate("about.page", {
      action: "save_draft",
      scope: "one-dhs",
      expectedRevisionId: REVISION,
      document: { ...document(), values: { ...document().values, introLede: "A clearer opening for DHS staff." } },
      changeNote: null,
    })).rejects.toBeInstanceOf(EditableSurfaceConflictError);
  });

  it("uses registry wording only in explicit static mode", async () => {
    const readPublished = vi.fn(async () => undefined);
    const published = await loadPublishedEditableSurface("about.page", {
      source: "static",
      scope: "dsd",
      store: { readPublished },
    });
    expect(published).toMatchObject({ source: "static", sourceScope: "one-dhs", isInherited: true });
    expect(published?.values).toEqual(definition().approvedValues);
    expect(readPublished).not.toHaveBeenCalled();

    await expect(loadPublishedEditableSurface("about.page", {
      source: "postgres",
      scope: "one-dhs",
      store: { readPublished },
    })).resolves.toBeUndefined();
    expect(readPublished).toHaveBeenCalledWith("about.page", "one-dhs");
  });
});


describe("incremental publication availability", () => {
  it("treats an unregistered database area as unavailable without substituting defaults", async () => {
    const store = new EditableSurfaceStore({ databaseUrl: "postgres://localhost/test", databaseFactory: () => ({ query: async () => { throw { code: "P0002" }; }, close: async () => {} }) });
    expect(await store.readPublished("podcast.equity-toolkit", "one-dhs")).toBeUndefined();
    expect(await store.readPublishedMany(["podcast.equity-toolkit"], "dsd")).toEqual([]);
  });
  it("preserves available destinations when one new definition is absent", async () => {
    const store = new EditableSurfaceStore({ databaseUrl: "postgres://localhost/test", databaseFactory: () => ({
      query: async <T extends Record<string, unknown>>(statement: string, parameters: readonly unknown[] = []) => {
        if (statement.includes("read-published-many") || parameters[1] === "podcast.equity-toolkit") throw { code: "P0002" };
        return [{ surface_id: "about.page", revision_id: REVISION, scope_id: "one-dhs", document: document(), publication_decision_id: DECISION, decided_at: "2026-09-07T12:00:00Z" }] as unknown as T[];
      }, close: async () => {},
    }) });
    expect((await store.readPublishedMany(["about.page", "podcast.equity-toolkit"], "dsd")).map(row => row.surfaceId)).toEqual(["about.page"]);
  });
  it("reads every registered area in one batch and leaves unregistered areas out", async () => {
    const statements: string[] = [];
    const store = new EditableSurfaceStore({ databaseUrl: "postgres://localhost/test", databaseFactory: () => ({
      query: async <T extends Record<string, unknown>>(statement: string) => {
        statements.push(statement);
        return [{ surface_id: "about.page", revision_id: REVISION, scope_id: "one-dhs", document: document(), publication_decision_id: DECISION, decided_at: "2026-09-07T12:00:00Z" }] as unknown as T[];
      }, close: async () => {},
    }) });
    expect((await store.readPublishedMany(["about.page", "podcast.equity-toolkit"], "dsd")).map(row => row.surfaceId)).toEqual(["about.page"]);
    expect(statements).toHaveLength(1);
    expect(statements[0]).toContain("pac.read_surface_publications(");
  });
  it.each(["42501", "08006"])("does not conceal access or database failure %s", async code => {
    const store = new EditableSurfaceStore({ databaseUrl: "postgres://localhost/test", databaseFactory: () => ({ query: async () => { throw { code }; }, close: async () => {} }) });
    await expect(store.readPublished("podcast.equity-toolkit", "one-dhs")).rejects.toMatchObject({ code });
    await expect(store.readPublishedMany(["podcast.equity-toolkit"], "one-dhs")).rejects.toMatchObject({ code });
  });
});
