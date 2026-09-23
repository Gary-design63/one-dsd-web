import { afterEach, describe, expect, it } from "vitest";
import { BRIEFS } from "@/lib/content/briefs";
import { corpusSearch, indexedDocs, resetSearchIndexForTests } from "@/lib/intelligence/retrieval/search";
import { setFlagOverrides } from "@/lib/intelligence/registry/flags";
import { communityBrief } from "@/lib/intelligence/orchestrator";
import { generateMetadata as briefMetadata } from "@/app/minnesota-communities/[id]/page";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

afterEach(() => {
  setFlagOverrides({});
  resetSearchIndexForTests();
});

describe("community brief visibility", () => {
  it("keeps the archived under-review brief projection out of its legacy browse and retrieval paths", async () => {
    setFlagOverrides({ "surface.ci_show_under_review": false });
    resetSearchIndexForTests();

    expect(indexedDocs().filter((doc) => doc.kind === "brief").every((doc) => doc.status !== "under_review")).toBe(true);
    expect(corpusSearch("Somali interpreter", { kinds: ["brief"] }).some((hit) => hit.id === "somali")).toBe(false);
    expect((await communityBrief("somali", 1)).kind).toBe("gap");
    expect((await briefMetadata({ params: Promise.resolve({ id: "somali" }) })).title).toBe("Minnesota Communities");

  });

  it("keeps community reading on its published page, not through typed Ask", async () => {
    await expectStaffAskClosed();
    expect(BRIEFS.some((brief) => brief.id === "somali")).toBe(true);
    expect((await briefMetadata({ params: Promise.resolve({ id: "somali" }) })).title).toBeTruthy();
  });

  it("does not let a stale runtime switch expose an under-review brief to staff", async () => {
    const underReview = BRIEFS.find((brief) => brief.status === "under_review");
    expect(underReview).toBeDefined();
    try {
      setFlagOverrides({ "surface.ci_show_under_review": true });
      resetSearchIndexForTests();
      expect(indexedDocs().some((doc) => doc.id === underReview?.id)).toBe(false);
      expect((await communityBrief(underReview!.id, 1)).kind).toBe("gap");
      expect((await briefMetadata({ params: Promise.resolve({ id: underReview!.id }) })).title).toBe("Minnesota Communities");
    } finally {
      setFlagOverrides({});
      resetSearchIndexForTests();
    }
  });

  it("keeps the released search projection stable when an unknown old flag is toggled", () => {
    setFlagOverrides({ "surface.ci_show_under_review": true });
    expect(indexedDocs().some((doc) => doc.status === "under_review")).toBe(false);

    setFlagOverrides({ "surface.ci_show_under_review": false });
    expect(indexedDocs().some((doc) => doc.status === "under_review")).toBe(false);
  });
});
