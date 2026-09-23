import { describe, expect, it } from "vitest";
import { CORPUS } from "@/lib/content/corpus";
import { LEARNING_HUB_SURFACE, selectHubItems } from "@/lib/content/learning-hub";
import { parseEditableSurfaceValues } from "@/lib/content/editable-surface-contract";

const values = LEARNING_HUB_SURFACE.approvedValues;
describe("connected learning and resources", () => {
  it("keeps every supplied record when browsing all themes", () => {
    expect(selectHubItems(CORPUS, values)).toEqual(CORPUS);
  });
  it("uses the same resource object under multiple relevant themes", () => {
    const item = CORPUS.find((item) => item.id === "ext-clas");
    for (const theme of ["intercultural", "access"]) expect(selectHubItems(CORPUS, values, { theme })).toContain(item);
  });
  it("composes theme, text and format filters", () => {
    expect(selectHubItems(CORPUS, values, { theme: "access", q: "CLAS", type: "external_reference" }).map((item) => item.id)).toEqual(["ext-clas"]);
  });
  it("cannot manufacture a record from a theme's membership", () => {
    expect(selectHubItems([], values, { theme: "access" })).toEqual([]);
    expect(selectHubItems(CORPUS.filter((item) => item.id !== "ext-clas"), values, { theme: "access" }).some((item) => item.id === "ext-clas")).toBe(false);
  });
  it("honors owner edits including empty membership", () => {
    const revised = { ...values, accessIds: [] };
    expect(parseEditableSurfaceValues(LEARNING_HUB_SURFACE, revised)).toEqual(revised);
    expect(selectHubItems(CORPUS, revised, { theme: "access" })).toEqual([]);
  });
  it("keeps unclassified future content in the complete collection", () => {
    const future = { ...CORPUS[0], id: "new-resource" };
    expect(selectHubItems([future], values)).toEqual([future]);
    expect(selectHubItems([future], values, { theme: "unknown" })).toEqual([future]);
  });
});
