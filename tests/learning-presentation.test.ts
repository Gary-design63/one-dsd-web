import { learningStageHref } from "@/lib/content/learning-journey";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup, renderToReadableStream } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CORPUS } from "@/lib/content/corpus";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { LEARNING_STAGES } from "@/lib/product/learning";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { LearningTile } from "@/components/learning-tile";
import { getLearningTilePresentation, LEARNING_TILE_DEFAULTS } from "@/lib/content/learning-catalog";

const state = vi.hoisted(() => ({ catalogAvailable: true, hubAvailable: true }));

// ResourceRemove (in the tile grid this file renders) calls useRouter(); these pages are
// rendered directly with react-dom/server here, outside a mounted app router.
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: () => {}, refresh: () => {} }) }));
vi.mock("@/lib/product/request-context", () => ({ requestedContentScope: async () => "one-dhs" }));
vi.mock("@/lib/content/staff-publications", () => ({ staffContentSource: () => "static", loadStaffContentSnapshot: async () => ({ items: CORPUS.filter((item) => item.status === "approved") }) }));
vi.mock("@/components/program-context", () => ({ ProgramContextNote: () => null }));
vi.mock("@/components/editable-surface", () => ({
  prepareEditableSurface: async (id: string) => ({
    definition: getEditableSurfaceDefinition(id),
    values: getEditableSurfaceDefinition(id)!.approvedValues,
    available: id === "learn.catalog" ? state.catalogAvailable : id === "learn.hub" ? state.hubAvailable : true,
    canEdit: false,
  }),
  EditableSurfaceRegion: ({ children, surface }: { children: ReactNode; surface: { available: boolean } }) => surface.available ? children : null,
}));

import LearnPage from "@/app/learn/page";

const root = path.resolve(import.meta.dirname, "..");

describe("Learning thumbnail presentation", () => {
  beforeEach(() => { state.catalogAvailable = true; state.hubAvailable = true; });

  it("combines resources without changing canonical links or exposing unavailable themes", async () => {
    let html = await renderAsync(await LearnPage({}));
    expect(html).toContain("Learning and resources");
    expect(html).toContain('href="/library/ext-dhs-equity-toolkit"');
    expect(html).toContain('href="/library/ext-clas"');
    state.hubAvailable = false;
    html = await renderAsync(await LearnPage({}));
    expect(html).not.toContain("learning-hub-search");
    expect(html).not.toContain("Amplify Equity");
    expect(html.match(/data-learning-id=/g)).toHaveLength(212);
  });

  it("keeps filtered results focused while retaining direct resource access", async () => {
    const html = await renderAsync(await LearnPage({ searchParams: Promise.resolve({ theme: "intercultural", q: "CLAS" }) }));
    expect(html).toContain('href="/library/ext-clas"');
    expect(html).not.toContain('id="stages-title"');
    expect(html).not.toContain('href="/library/ja-climate-action-plan"');
  });

  it("shows real modules first and keeps stages, practice paths, and the staff guide distinct", async () => {
    const html = await renderAsync(await LearnPage({}));
    expect(html.match(/data-learning-id=/g)).toHaveLength(212);
    expect(html).toContain('href="/library/lm-how-this-program-works"');
    expect(html).not.toContain('data-learning-id="lm-how-this-program-works"');
    expect(html.indexOf('id="modules-title"')).toBeLessThan(html.indexOf('id="stages-title"'));
    for (const stage of LEARNING_STAGES) {
      expect(html).toContain(`id="${stage.id}"`);
      expect(html).toContain(learningStageHref(stage.id));
    }
    for (const track of GRADUATION_PATHS) expect(html).toContain(`/practice/${track.id}`);
    for (const note of CORPUS.filter((item) => item.type === "practice_note" && item.status === "approved")) {
      expect(html).toContain(`/library/${note.id}`);
    }
    expect(html).toContain("Participation and privacy");
    expect(html).toContain("data-participation-class=");
  });

  it("does not expose unpublished images or hide the underlying learning resources", async () => {
    state.catalogAvailable = false;
    const html = await renderAsync(await LearnPage({}));
    expect(html.match(/data-learning-id=/g)).toHaveLength(212);
    const originalTile = html.match(/<a[^>]*data-learning-id="lm-interpreter"[\s\S]*?<\/a>/)?.[0] ?? html.match(/<a[^>]*href="\/library\/lm-interpreter"[\s\S]*?<\/a>/)?.[0];
    expect(originalTile).toBeDefined();
    expect(originalTile).not.toContain("<img");
    expect(html).toContain('href="/library/lm-interpreter"');
    expect(html).toContain("data-participation-class=");
  });

  it("keeps one named link per tile with the original resource title and a separate description", () => {
    const item = CORPUS.find(({ id }) => id === "lm-interpreter")!;
    const values = getEditableSurfaceDefinition("learn.catalog")!.approvedValues;
    const html = renderToStaticMarkup(createElement(LearningTile, { item, presentation: getLearningTilePresentation(item.id, values) }));
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('aria-labelledby="learning-title-lm-interpreter"');
    expect(html).toContain(item.title);
    expect(html).toContain('alt="Three people in conversation around a table."');
    expect(html).toContain(LEARNING_TILE_DEFAULTS["lm-interpreter"].summary);
    expect(html).not.toContain("opacity");
  });

  it("keeps an edited description when its thumbnail is removed", () => {
    const item = CORPUS.find(({ id }) => id === "lm-interpreter")!;
    const html = renderToStaticMarkup(createElement(LearningTile, {
      item,
      presentation: { imageSrc: "", imageAlt: "", summary: "A revised learning introduction." },
    }));
    expect(html).not.toContain("<img");
    expect(html).toContain("A revised learning introduction.");
    expect(html).toContain('href="/library/lm-interpreter"');
  });

  it("uses the recovered files at their actual dimensions, without claiming 4K", async () => {
    const { default: sharp } = await import("sharp");
    for (const item of Object.values(LEARNING_TILE_DEFAULTS)) {
      const metadata = await sharp(path.join(root, "public", item.imageSrc)).metadata();
      expect([metadata.width, metadata.height]).toEqual([1792, 1008]);
    }
  });

  it("scopes neutral styling to Learning and preserves the established editing connections", () => {
    const css = readFileSync(path.join(root, "app/globals.css"), "utf8");
    const learningCss = css.slice(css.indexOf(".learning-page {"), css.indexOf(".answer h2,"));
    expect(learningCss).not.toMatch(/var\(--green|#78be21|backdrop-filter/);
    expect(learningCss).toContain(".learning-course-tile:focus-visible");
    expect(learningCss).toContain("@media (max-width: 560px)");
    const page = readFileSync(path.join(root, "app/learn/page.tsx"), "utf8");
    expect(page).toContain('prepareEditableSurface("learn.page", { scope })');
    expect(page).toContain('prepareEditableSurface("learn.catalog", { scope })');
    expect(page).toContain("<EditableSurfaceRegion surface={surface}");
    expect(page).toContain("<EditableSurfaceRegion surface={catalog}");
  });
});

async function renderAsync(node: ReactNode) {
  const stream = await renderToReadableStream(node);
  await stream.allReady;
  return new Response(stream).text();
}
