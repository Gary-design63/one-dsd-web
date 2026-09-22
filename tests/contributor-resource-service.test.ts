import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/auth/program-identity", () => ({ programContributorDatabase: vi.fn() }));
import { ContributorResourceStore } from "@/lib/content/contributor-resources";
import { fixtureContext, draftInput, editingRow, fixtureResource, releaseFixture, draftId, reviewId } from "./contributor-resource-fixtures";

describe("named contributor resource service", () => {
  it("uses only named read wrappers with server-held activation and current scope", async () => {
    const query = vi.fn().mockResolvedValueOnce([editingRow]).mockResolvedValueOnce([{ state: releaseFixture() }]).mockResolvedValueOnce([]);
    const store = new ContributorResourceStore({ query, close: vi.fn() });
    expect((await store.editing(fixtureContext, "one-dhs", fixtureResource.id))?.expectedRevisionId).toBe(editingRow.base_revision_id);
    await store.read(fixtureContext, "one-dhs", fixtureResource.id);
    await store.queue(fixtureContext, "dsd");
    expect(query.mock.calls.map(call => call[0])).toEqual([
      expect.stringContaining("pac.read_contributor_resource_editing_state("),
      expect.stringContaining("pac.read_contributor_resource_release_state("),
      expect.stringContaining("pac.list_contributor_resource_release_queue("),
    ]);
    expect(query.mock.calls[0][1]).toEqual(Object.values(fixtureContext).concat(["one-dhs", fixtureResource.id]));
    expect(query.mock.calls[2][1].at(-1)).toBe("dsd");
  });
  it("submits the exact draft revision and fields without a browser-supplied actor", async () => {
    const query = vi.fn().mockResolvedValue([{ result: editingRow }]);
    const store = new ContributorResourceStore({ query, close: vi.fn() });
    await store.save(fixtureContext, "one-dhs", fixtureResource.id, draftInput);
    expect(query.mock.calls[0][0]).toContain("pac.run_protected_content_mutation(");
    const params = query.mock.calls[0][1];
    expect(params.slice(6,9)).toEqual(["one-dhs","resource_draft_save",fixtureResource.id]);
    expect(JSON.parse(params[9])).toEqual(draftInput);
  });
  it("blocks a draft scope change before writing", async () => {
    const query = vi.fn(); const store = new ContributorResourceStore({ query, close: vi.fn() });
    await expect(store.save(fixtureContext, "dsd", fixtureResource.id, draftInput)).rejects.toMatchObject({ status: 422 });
    expect(query).not.toHaveBeenCalled();
  });
  it("carries review CAS to the named mutation wrapper", async () => {
    const query = vi.fn().mockResolvedValue([{ result: releaseFixture() }]);
    const store = new ContributorResourceStore({ query, close: vi.fn() });
    await store.act(fixtureContext, "one-dhs", fixtureResource.id, { action: "review", revisionId: draftId, dimension: "accessibility", expectedPriorReviewId: reviewId, decision: "pass", note: "Checked keyboard access." });
    const params = query.mock.calls[0][1];
    expect(params[7]).toBe("resource_review_record");
    expect(JSON.parse(params[9])).toMatchObject({ revisionId: draftId, expectedPriorReviewId: reviewId });
    expect(JSON.parse(params[9])).not.toHaveProperty("action");
  });
  it.each([["40001",409],["PAI01",401],["PAA01",403],["PAF01",503],["P0002",404],["23514",422]])("maps %s without exposing database messages", async (code,status) => {
    const query = vi.fn().mockRejectedValue({ code, message: "PRIVATE_DATABASE_DETAIL" });
    const store = new ContributorResourceStore({ query, close: vi.fn() });
    await expect(store.read(fixtureContext, "one-dhs", fixtureResource.id)).rejects.toMatchObject({ status });
    await expect(store.read(fixtureContext, "one-dhs", fixtureResource.id)).rejects.not.toThrow("PRIVATE_DATABASE_DETAIL");
  });
  it("does not publish a stale requested revision", async () => {
    const query = vi.fn().mockResolvedValue([{ state: releaseFixture() }]);
    const store = new ContributorResourceStore({ query, close: vi.fn() });
    await expect(store.act(fixtureContext, "one-dhs", fixtureResource.id, { action: "publish", revisionId: reviewId, expectedScopeDecisionId: "1", reason: "Clear practical guidance.", sensitivityClass: "S0", unauthenticatedExposurePermitted: true, exposureReason: "Public guidance." })).rejects.toMatchObject({ status: 409 });
    expect(query).toHaveBeenCalledTimes(1);
  });
});
