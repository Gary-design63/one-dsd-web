import { describe, expect, it } from "vitest";
import { podcastShareHref, shareLink } from "@/lib/product/share-link";

describe("share links point at one page or resource only", () => {
  it("keeps the path and drops personal context", () => {
    expect(shareLink({ origin: "https://one-dhs-pac.vercel.app", pathname: "/areas/workforce", search: "?originArea=workforce_equity&area=workforce&task=design-role", hash: "" }, "one_dhs"))
      .toBe("https://one-dhs-pac.vercel.app/areas/workforce");
    expect(shareLink({ pathname: "/ask", search: "?q=my%20supervisor%20said&mode=program" }, "one_dhs")).toBe("/ask");
    expect(shareLink({ pathname: "/courses/di-accessibility-basics/" }, "one_dhs")).toBe("/courses/di-accessibility-basics");
  });

  it("carries the One DSD view so the recipient sees the same content, and never an unknown view", () => {
    expect(shareLink({ pathname: "/one-dsd/team", search: "?view=one_dhs" }, "one_dsd")).toBe("/one-dsd/team?view=one_dsd");
    expect(shareLink({ pathname: "/learn", search: "?view=one_dsd" }, "one_dhs")).toBe("/learn");
  });

  it("keeps only the filters that define a list page, and in-page anchors", () => {
    expect(shareLink({ pathname: "/learn", search: "?theme=access&q=captions&originArea=workforce_equity&type=learning_module" }, "one_dhs"))
      .toBe("/learn?theme=access&q=captions&type=learning_module");
    expect(shareLink({ pathname: "/learn", hash: "#applied" }, "one_dhs")).toBe("/learn#applied");
    expect(shareLink({ pathname: "/equity-policy/register", hash: "#survey-title" }, "one_dsd")).toBe("/equity-policy/register?view=one_dsd#survey-title");
    expect(shareLink({ pathname: "/learn", hash: "#<script>" }, "one_dhs")).toBe("/learn");
  });

  it("gives each podcast its own page", () => {
    expect(podcastShareHref("equity-toolkit")).toBe("/podcasts/equity-toolkit");
    expect(shareLink({ pathname: "/podcasts/equity-toolkit", search: "?originArea=workforce_equity" }, "one_dhs")).toBe("/podcasts/equity-toolkit");
    expect(shareLink({ pathname: "/podcasts/equity-toolkit" }, "one_dsd")).toBe("/podcasts/equity-toolkit?view=one_dsd");
    expect(shareLink({ pathname: "/learn", search: "?originArea=workforce_equity", hash: "#podcast-equity-toolkit" }, "one_dhs")).toBe("/learn#podcast-equity-toolkit");
  });
});
