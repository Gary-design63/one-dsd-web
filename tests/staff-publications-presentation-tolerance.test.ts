import { afterEach, describe, expect, it, vi } from "vitest";
import { PostgresStaffPublicationReader, publishedItemsNeedingRepair } from "@/lib/content/staff-publications";

// Mirrors the One DSD resources published on September 9, 2026: an empty review date, a program
// address instead of an outside address, and one long body part. They are approved publications.
function legacyRow(id: string) {
  return {
    content_item_id: id,
    revision_id: "6d5a6a7e-1c1a-4a7b-9a7d-3b9c2d1e0f11",
    scope_id: "dsd",
    canonical_payload: {
      id, title: "Accessible Meetings Checklist", type: "practice_note", authority: "guidance", layer: "L3",
      summary: "A checklist for planning meetings that people with disabilities can take part in fully.",
      body: ["Send the agenda ahead of time.", "x".repeat(12_000)],
      nextActions: [], tags: ["accessibility", "meetings"], intents: ["access_barriers"], pathIds: [],
      owner: "One DSD People, Access and Culture", reviewDate: "", scope: "dsd", href: `/one-dsd/resources/${id}`, status: "approved", accessibility: "pending", version: "2",
      canonicalOriginal: { imported: true },
    },
    payload_sha256: "b".repeat(64),
    decided_at: "2026-09-09T22:50:34.872Z",
  };
}

afterEach(() => vi.restoreAllMocks());

describe("published items that no longer meet the release editor's presentation rules", () => {
  it("are still listed for staff instead of failing every page that lists content", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const reader = new PostgresStaffPublicationReader({
      databaseUrl: "postgres://synthetic@localhost/test",
      databaseFactory: () => ({ query: async () => [legacyRow("0b4b623f-ae8e-415c-be1b-865247a483cd")] as never, close: async () => {} }),
    });
    const items = await reader.list("dsd");
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Accessible Meetings Checklist");
    // Field-level repairs: the review date falls back to the publication date and the program address is not shown as an outside source.
    expect(items[0].reviewDate).toBe("2026-09-09");
    expect(items[0].href).toBeUndefined();
    expect(await reader.get("0b4b623f-ae8e-415c-be1b-865247a483cd", "dsd")).toBeDefined();
    expect(publishedItemsNeedingRepair()).toContainEqual({ key: "dsd:0b4b623f-ae8e-415c-be1b-865247a483cd", outcome: "served" });
    // The note is content-free: it names the item, not its wording.
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).not.toContain("Accessible Meetings");
  });

  it("keeps approved numbered steps and physical-temperature guidance visible", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const steps = legacyRow("legacy-numbered-steps");
    steps.canonical_payload.body = ["Plan the visit.\n1. Ask about access needs.\n2. Check the space."];
    const sensory = legacyRow("legacy-sensory-temperature");
    sensory.canonical_payload.body = ["Ask whether the room temperature is comfortable."];
    const reader = new PostgresStaffPublicationReader({
      databaseUrl: "postgres://synthetic@localhost/test",
      databaseFactory: () => ({ query: async () => [steps, sensory] as never, close: async () => {} }),
    });
    expect((await reader.list("dsd")).map((item) => item.id)).toEqual([
      "legacy-numbered-steps", "legacy-sensory-temperature",
    ]);
    expect(publishedItemsNeedingRepair()).toContainEqual({ key: "dsd:legacy-numbered-steps", outcome: "served" });
    expect(publishedItemsNeedingRepair()).toContainEqual({ key: "dsd:legacy-sensory-temperature", outcome: "served" });
  });

  it("keeps explained accessibility symbols and document terms visible", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const row = legacyRow("legacy-accessibility-examples");
    row.canonical_payload.body = [
      "1. Use text alternatives: ✓ On track, ✗ Delayed. Check the PDF metadata and the title shown in the browser tab. Review the end of the service journey, not just its endpoint.",
    ];
    const reader = new PostgresStaffPublicationReader({
      databaseUrl: "postgres://synthetic@localhost/test",
      databaseFactory: () => ({ query: async () => [row] as never, close: async () => {} }),
    });
    expect((await reader.list("dsd")).map((item) => item.id)).toEqual(["legacy-accessibility-examples"]);
  });

  it("still withholds pasted markup from an approved legacy row", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const row = legacyRow("legacy-pasted-markup");
    row.canonical_payload.body = ["1. Check access.\n**Internal instruction**"];
    const reader = new PostgresStaffPublicationReader({
      databaseUrl: "postgres://synthetic@localhost/test",
      databaseFactory: () => ({ query: async () => [row] as never, close: async () => {} }),
    });
    expect(await reader.list("dsd")).toEqual([]);
    expect(publishedItemsNeedingRepair()).toContainEqual({ key: "dsd:legacy-pasted-markup", outcome: "withheld" });
  });
});
