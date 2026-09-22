import { describe, expect, it, vi } from "vitest";
import {
  loadPublishedPageCopy,
  PageCopyStore,
  type PageCopyDatabase,
} from "@/lib/content/page-copy";
import {
  PAGE_BLOCK_IDS,
  PAGE_REVIEW_DIMENSIONS,
  STATIC_HOME_COPY,
  type PageBlockEditingState,
  type HomePageCopy,
} from "@/lib/content/page-copy-contract";

const REVISION = "11111111-1111-4111-8111-111111111111";
const PRIOR = "22222222-2222-4222-8222-222222222222";
const REVIEW = "33333333-3333-4333-8333-333333333333";
const DECISION = "7";

function editingState(): PageBlockEditingState<HomePageCopy> {
  return {
    surface: "home",
    contentItemId: PAGE_BLOCK_IDS.home,
    expectedRevisionId: REVISION,
    publishedRevisionId: PRIOR,
    publicationDecisionId: DECISION,
    isPublished: true,
    hasUnpublishedChanges: true,
    copy: STATIC_HOME_COPY,
    reviews: PAGE_REVIEW_DIMENSIONS.map((dimension) => ({ reviewId: REVIEW, dimension, status: "pending", note: null })),
    canPublish: false,
    history: [{
      revisionId: PRIOR,
      label: "Version 1: One DHS People, Access and Culture Program",
      publishedAt: "2026-09-05T12:00:00Z",
      isCurrent: true,
    }],
  };
}

describe("page copy PostgreSQL service", () => {
  it("reads an approved page block through the fixed page function", async () => {
    const calls: Array<{ statement: string; parameters: readonly unknown[] }> = [];
    const database: PageCopyDatabase = {
      async query<T extends Record<string, unknown>>(statement: string, parameters: readonly unknown[] = []) {
        calls.push({ statement, parameters });
        return [{
          content_item_id: PAGE_BLOCK_IDS.home,
          revision_id: REVISION,
          canonical_payload: {
            id: PAGE_BLOCK_IDS.home,
            blockType: "home",
            status: "approved",
            accessibility: "reviewed",
            scope: "agencywide",
            version: "1",
            copy: STATIC_HOME_COPY,
          },
        }] as unknown as T[];
      },
      async close() {},
    };
    const store = new PageCopyStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test/postgres",
      databaseFactory: () => database,
    });

    await expect(store.readPublished("home", "one-dhs")).resolves.toEqual(STATIC_HOME_COPY);
    expect(calls).toHaveLength(1);
    expect(calls[0].statement).toContain("pac.read_page_block_publication");
    expect(calls[0].parameters).toEqual(["one-dhs", PAGE_BLOCK_IDS.home]);
  });

  it("uses only narrow functions for every owner action", async () => {
    const state = editingState();
    const statements: string[] = [];
    const database: PageCopyDatabase = {
      async query<T extends Record<string, unknown>>(statement: string) {
        statements.push(statement);
        return [{ state }] as unknown as T[];
      },
      async close() {},
    };
    const store = new PageCopyStore({
      databaseUrl: "postgresql://pac_app_runtime:secret@example.test/postgres",
      databaseFactory: () => database,
    });

    await store.readEditingState("home", "one-dhs");
    await store.mutate("home", "one-dhs", {
      action: "save_changes", expectedRevisionId: REVISION, expectedPublicationDecisionId: DECISION,
      copy: STATIC_HOME_COPY, changeNote: null,
    });
    await store.mutate("home", "one-dhs", {
      action: "save_draft", expectedRevisionId: REVISION, copy: STATIC_HOME_COPY, changeNote: null,
    });
    await store.mutate("home", "one-dhs", {
      action: "record_review", revisionId: REVISION, dimension: "accessibility", status: "pass", expectedReviewId: REVIEW, note: null,
    });
    await store.mutate("home", "one-dhs", { action: "publish", revisionId: REVISION, expectedPublicationDecisionId: DECISION, reason: "Approved after review." });
    await store.mutate("home", "one-dhs", {
      action: "withdraw", expectedPublishedRevisionId: PRIOR, expectedPublicationDecisionId: DECISION, reason: "Temporarily remove this wording.",
    });
    await store.mutate("home", "one-dhs", {
      action: "rollback", expectedPublishedRevisionId: PRIOR, targetRevisionId: REVISION, expectedPublicationDecisionId: DECISION,
      reason: "Restore the earlier approved wording.",
    });

    const combined = statements.join("\n");
    for (const functionName of [
      "read_page_block_editing_state",
      "save_owner_approved_page_block",
      "create_page_block_draft",
      "record_page_block_review",
      "publish_page_block_draft",
      "withdraw_page_block_publication",
      "rollback_page_block_publication",
    ]) expect(combined).toContain(`pac.${functionName}`);
    expect(combined).not.toMatch(
      /\b(?:from|join|insert into|update|delete from)\s+pac\.(?:source_|content_|revision_|review_|publication_|change_)/i,
    );
  });

  it("uses static wording only in explicit static mode", async () => {
    const readPublished = vi.fn(async () => undefined);
    await expect(loadPublishedPageCopy("home", { source: "static", store: { readPublished } })).resolves.toEqual(STATIC_HOME_COPY);
    expect(readPublished).not.toHaveBeenCalled();

    await expect(loadPublishedPageCopy("home", { source: "postgres", store: { readPublished } })).resolves.toBeUndefined();
    expect(readPublished).toHaveBeenCalledWith("home", "one-dhs");
  });
});
