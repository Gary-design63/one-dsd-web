import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM } from "@/lib/constants";
import {
  FOOTER_COPY_KEYS,
  FooterCopySchema,
  HOME_COPY_KEYS,
  HomePageCopySchema,
  STATIC_FOOTER_COPY,
  STATIC_HOME_COPY,
  isSafePageLink,
} from "@/lib/content/page-copy-contract";

const ROOT = path.resolve(__dirname, "..");

describe("Home and footer copy contracts", () => {
  it("accepts the complete approved static wording", () => {
    expect(HomePageCopySchema.parse(STATIC_HOME_COPY)).toEqual(STATIC_HOME_COPY);
    expect(FooterCopySchema.parse(STATIC_FOOTER_COPY)).toEqual(STATIC_FOOTER_COPY);
    expect(Object.keys(STATIC_HOME_COPY).sort()).toEqual([...HOME_COPY_KEYS].sort());
    expect(Object.keys(STATIC_FOOTER_COPY).sort()).toEqual([...FOOTER_COPY_KEYS].sort());
  });

  it("restores the earlier opening description without the procedural banner paragraph", () => {
    expect(STATIC_HOME_COPY.heroLede).toBe(PROGRAM.heroLede);
    expect(STATIC_HOME_COPY.heroNote).toBe("");
    expect(HomePageCopySchema.parse({ ...STATIC_HOME_COPY, heroNote: "   " }).heroNote).toBe("");
    expect(HomePageCopySchema.safeParse({ ...STATIC_HOME_COPY, heroLede: "" }).success).toBe(false);
    expect(HomePageCopySchema.safeParse({ ...STATIC_HOME_COPY, heroNote: "More about the program." }).success).toBe(true);
    expect(readFileSync(path.join(ROOT, "app", "page.tsx"), "utf8")).toMatch(/\{copy\.heroNote\s*\?\s*\(?\s*<p[^>]*>\{copy\.heroNote\}<\/p>/);
  });

  it.each([
    ["Markdown heading", "# Heading"],
    ["Markdown link", "[Read more](/library)"],
    ["Markdown blockquote", "> Quoted guidance"],
    ["Markdown italic text", "Use *careful judgment* here."],
    ["Markdown horizontal rule", "---"],
    ["Markdown pipe table", "| Topic | Guidance |"],
    ["Markdown parenthesized list", "1) Begin here"],
    ["serialized object", '{"label":"Pasted"}'],
    ["icon", "Choose a direction 🧭"],
    ["vendor wording", "Ask the OpenAI assistant"],
    ["technical product wording", "The runtime routes the payload"],
  ])("rejects %s from a staff-facing field", (_label, value) => {
    expect(HomePageCopySchema.safeParse({ ...STATIC_HOME_COPY, heroNote: value }).success).toBe(false);
    expect(FooterCopySchema.safeParse({ ...STATIC_FOOTER_COPY, identityText: value }).success).toBe(false);
  });

  it.each([
    "javascript:alert(1)",
    "http://example.com",
    "//example.com/path",
    "/../private",
    "https://name:password@example.com/path",
    "https://example.com/a path",
  ])("rejects unsafe link %s", (href) => {
    expect(isSafePageLink(href)).toBe(false);
    expect(HomePageCopySchema.safeParse({ ...STATIC_HOME_COPY, askHref: href }).success).toBe(false);
  });

  it.each(["/library", "/support/request?from=home", "https://example.org/program"])(
    "accepts safe link %s",
    (href) => expect(isSafePageLink(href)).toBe(true),
  );

  it("keeps current prose out of the rendering components", () => {
    const home = readFileSync(path.join(ROOT, "app", "page.tsx"), "utf8");
    const footer = readFileSync(path.join(ROOT, "components", "site-footer.tsx"), "utf8");
    expect(home).not.toContain("Begin with a question or explore the resources.");
    expect(home).not.toContain("Short briefs for Minnesota work:");
    expect(footer).not.toContain("Working notes are saved in the web browser");
    expect(home).toContain("loadPublishedPageCopy(\"home\")");
    expect(footer).toContain("loadPublishedPageCopy(\"footer\")");
  });

  it("uses the canonical RG-3 staff routes", () => {
    const homeLinks = [
      STATIC_HOME_COPY.primaryActionHref,
      STATIC_HOME_COPY.secondaryActionHref,
      STATIC_HOME_COPY.askHref,
      STATIC_HOME_COPY.communitiesHref,
      STATIC_HOME_COPY.resourcesHref,
      STATIC_HOME_COPY.supportHref,
      STATIC_HOME_COPY.foundationHref,
      STATIC_HOME_COPY.learnHref,
      STATIC_HOME_COPY.applyHref,
      STATIC_HOME_COPY.leadHref,
      STATIC_HOME_COPY.commitmentsLinkHref,
    ];

    expect(homeLinks).toEqual([
      "/start",
      "/ask",
      "/ask",
      "/minnesota-communities",
      "/library",
      "/support",
      "/areas",
      "/learn",
      "/practice",
      "/one-dsd",
      "/about",
    ]);
    expect(homeLinks.join("\n")).not.toMatch(/\/(?:guided-start|paths|resources|my-view)(?:\/|$)/);
    expect(STATIC_FOOTER_COPY.resourcesHref).toBe("/library");
    expect(STATIC_FOOTER_COPY.requestHref).toBe("/support");
    expect(STATIC_FOOTER_COPY.escalationHref).toBe("/support/right-person");
  });

  it("keeps the ownership and systems boundary in the footer", () => {
    for (const wording of [STATIC_FOOTER_COPY.identityText]) {
      expect(wording).toContain("run by the program");
      expect(wording).toContain("A resource for DHS staff");
      expect(wording).toContain("not connected to DHS information technology, case, or personnel systems");
      expect(wording).toContain("does not replace");
      expect(wording).not.toContain("consultant-owned");
    }
  });

  it("keeps legacy staff destinations out of Home rendering", () => {
    const home = readFileSync(path.join(ROOT, "app", "page.tsx"), "utf8");
    expect(STATIC_HOME_COPY.foundationHref).toBe("/areas");
    expect(home).toContain("href={copy.foundationHref}");
    expect(home).not.toMatch(/["'`]\/(?:guided-start|paths|resources|my-view)(?:[\/"'`?#]|$)/);
  });
});
