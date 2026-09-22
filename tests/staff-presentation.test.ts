import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PageIntro } from "@/components/ui";
import { STATIC_HOME_COPY, STATIC_FOOTER_COPY } from "@/lib/content/page-copy-contract";

vi.mock("@/lib/auth/request", () => ({ ownerFromCookies: async () => null, editingModeFromCookies: async () => false }));
vi.mock("@/lib/content/page-copy", () => ({
  loadPublishedPageCopy: async (surface: string) => surface === "home" ? STATIC_HOME_COPY : STATIC_FOOTER_COPY,
  loadPageBlockEditingState: async () => undefined,
}));
// This test renders the Server Component directly with react-dom/server, outside a real
// Next.js request lifecycle, so next/headers has no request store to read from. Mock it to
// behave as an unset cookie jar (resolveProductContext then falls back to the default
// context) — this exercises the same HTML-shape assertions below without needing a live
// request context.
vi.mock("next/headers", () => ({ cookies: async () => new Map<string, { value: string }>() }));
import HomePage from "@/app/page";
import { ProgramCommitments } from "@/components/program-commitments";
import { SiteFooter } from "@/components/site-footer";
import { PARTNERSHIP_SPINE } from "@/lib/constants";

const root = path.resolve(__dirname, "..");
const file = (name: string) => readFileSync(path.join(root, name), "utf8");

describe("owner-authorized program design", () => {
  it("preserves the approved DHS logo", () => {
    const hash = createHash("sha256").update(readFileSync(path.join(root, "public/images/dhs-logo.png"))).digest("hex");
    expect(hash.toUpperCase()).toBe("E9D767446EC871A7FBE829C2A978CF0CB47886AAD31A4FFCFF59A78AE89ADD74");
  });

  it("keeps one named page introduction without an imposed navy panel", () => {
    const html = renderToStaticMarkup(createElement(PageIntro, { title: "Learning", kicker: "Grow together" }));
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Grow together");
    expect(html).not.toContain("bg-navy-deep");
  });

  it("opens with the approved purpose and keeps every primary destination accessible", async () => {
    const html = renderToStaticMarkup(await HomePage());
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(STATIC_HOME_COPY.heroLede);
    for (const href of ["/ask", "/start", "/learn", "/practice", "/one-dsd", "/areas", "/minnesota-communities", "/library", "/support", "/orientation", "/operationalizing-equity"]) {
      expect(html).toContain('href="' + href + '"');
    }
    expect(html.match(/<main/g)).toBeNull();
    expect(html).not.toContain("WORK_AREAS");
  });

  it("preserves the still approved photo, descriptive alternative text, and whole-image rendering", async () => {
    const html = renderToStaticMarkup(await HomePage());
    const heroImage = html.match(/<img\b[^>]*\bsrc="([^"]+)"/);
    expect(heroImage).not.toBeNull();
    const imageUrl = new URL(heroImage![1].replaceAll("&amp;", "&"), "https://local-program.test");
    expect(imageUrl.origin).toBe("https://local-program.test");
    expect(imageUrl.pathname).toBe("/images/minnesota-communities-group-v2.png");
    expect(imageUrl.hash).toBe("");
    expect([...imageUrl.searchParams.keys()].every(key => key === "dpl")).toBe(true);
    expect(imageUrl.searchParams.getAll("dpl").length).toBeLessThanOrEqual(1);
    if (imageUrl.searchParams.has("dpl")) {
      expect(imageUrl.searchParams.get("dpl")).toBe(process.env.NEXT_DEPLOYMENT_ID);
    }
    expect(html).toContain('alt="' + STATIC_HOME_COPY.heroImageAlt + '"');
    expect(html).toContain("object-fit:contain");
    expect(file("app/page.tsx")).not.toContain("HeroDepthPhoto");
    expect(file("app/home.module.css")).toContain("transform:none!important;animation:none!important;transition:none!important");
    const { default: sharp } = await import("sharp");
    const metadata = await sharp(path.join(root, "public/images/minnesota-communities-group-v2.png")).metadata();
    expect([metadata.width, metadata.height]).toEqual([1774, 887]);
  });

  it("retains commitments and the supporting explanation on About", async () => {
    const html = renderToStaticMarkup(await ProgramCommitments());
    for (const commitment of PARTNERSHIP_SPINE) {
      expect(html).toContain(commitment.replaceAll("'", "&#x27;"));
    }
    expect(html).toContain(STATIC_HOME_COPY.aboutText);
    expect(html).toContain(STATIC_HOME_COPY.privacyText);
    expect(file("app/about/page.tsx")).toContain("<ProgramCommitments");
  });

  it("retains the complete footer identity and privacy copy", async () => {
    const html = renderToStaticMarkup(await SiteFooter());
    const text = html.replace(/<[^>]*>/g, " ");
    expect(text).toContain(STATIC_FOOTER_COPY.privacyText);
    expect(html).toContain("A resource for DHS staff, run by the program.");
    expect(html).toContain("Authority labels show what each item can and cannot establish.");
    expect(html).toContain('href="/about"');
  });

  it("preserves owner editing at each shared surface", () => {
    expect(file("app/page.tsx")).toContain("<PageCopyEditor");
    expect(file("components/site-header.tsx")).toContain("<EditableSurfaceEditor");
    expect(file("components/site-footer.tsx")).toContain("<PageCopyEditor");
    expect(file("next.config.ts")).toContain("devIndicators: false");
  });
});
