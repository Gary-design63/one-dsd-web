// Photographs the walk-through pages from a local run of the Program.
//
// Routes, viewport and scale come from walkthrough/shots.json, so the record
// and the images cannot drift apart. Every page is taken whole, from its top
// to its foot, however long it runs. Lazy images are forced by scrolling the
// page end to end before the shutter, and the One DSD view is chosen the way
// a person chooses it, with the switcher, so the choice carries to every page.
//
// Two figures are exceptions. Learning and resources is one 35,600-pixel page
// by design, and a photograph of the whole of it is a ribbon, not a figure.
// Each is cut at a real boundary in the page rather than through anything:
// 04 stops exactly where the module list begins, and 05 shows whole course
// tiles only. The captions for both already describe a part of that page.
//
//   node build/capture-walkthrough.mjs [base-url] [output-dir] [playwright-dir] [browser-binary]
//
// Defaults to http://localhost:8080 and walkthrough/shots/. Serve the Program
// from a local build first. Playwright and a browser are local developer
// tooling, named at the top of the file.
import path from "node:path";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const PACKAGE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CHECKOUT = path.resolve(PACKAGE, "..", "..");

// Playwright and a browser are local developer tooling, not a dependency of the
// package. Look in this checkout first, then a sibling, then say where to put it.
// Passed as arguments, never read from the environment: this repository checks
// that every environment setting the source reads is documented.
const roots = [CHECKOUT, process.cwd(), path.resolve(CHECKOUT, ".."), ...(process.argv[4] ? [process.argv[4]] : [])];
let chromium;
for (const root of roots) {
  try { ({ chromium } = createRequire(path.join(root, "package.json"))("playwright")); break; }
  catch { /* try the next root */ }
}
if (!chromium) {
  throw new Error(`playwright not found. Looked in:\n  ${roots.join("\n  ")}\n` +
    "Install it in one of those, or pass its directory as the third argument.");
}
const BROWSER = process.argv[5] || "";

const plan = JSON.parse(readFileSync(path.join(PACKAGE, "walkthrough", "shots.json"), "utf8"));
const { width, height, deviceScaleFactor } = plan.viewport;
const BASE = process.argv[2] || "http://localhost:8080";
const OUT = process.argv[3] || path.join(PACKAGE, "walkthrough", "shots");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(BROWSER ? { executablePath: BROWSER } : {});
const page = await (await browser.newContext({ viewport: { width, height }, deviceScaleFactor })).newPage();

const settle = async () => {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  try { await page.waitForLoadState("networkidle", { timeout: 8000 }); } catch { /* settled enough */ }
};

const inOneDsdView = () =>
  page.evaluate(() => {
    const a = [...document.querySelectorAll("a.context-switcher__button")]
      .find((e) => e.textContent.trim() === "One DSD");
    return a ? /--active/.test(a.className) : null;  // null: this page has no switcher
  });

const moduleListTop = () =>
  page.evaluate(() => {
    const s = [...document.querySelectorAll("section")]
      .find((x) => /Learning modules/.test(x.querySelector("h2,h3")?.textContent || ""));
    return Math.round(s.getBoundingClientRect().top + window.scrollY);
  });

const disabilityTileBand = () =>
  page.evaluate(() => {
    const s = [...document.querySelectorAll("section")]
      .find((x) => /Learning modules/.test(x.querySelector("h2,h3")?.textContent || ""));
    const tiles = [...s.querySelectorAll("a")]
      .filter((e) => e.querySelector("img") && e.getBoundingClientRect().height > 140);
    const first = tiles.find((t) => /Disability, Diversity and Belonging/i.test(t.textContent || ""));
    if (!first) return null;
    const top = Math.round(first.getBoundingClientRect().top + window.scrollY);
    const rowTops = [...new Set(tiles.map((t) => Math.round(t.getBoundingClientRect().top + window.scrollY)))]
      .sort((a, b) => a - b).filter((y) => y >= top);
    const lastRow = rowTops[Math.min(3, rowTops.length - 1)];
    const bottom = Math.max(...tiles
      .filter((t) => Math.round(t.getBoundingClientRect().top + window.scrollY) === lastRow)
      .map((t) => Math.round(t.getBoundingClientRect().bottom + window.scrollY)));
    return { top: top - 26, height: bottom + 26 - (top - 26) };
  });

// Choose the One DSD view once; it is carried from here on.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.locator("a.context-switcher__button").filter({ hasText: "One DSD" }).first().click();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(600);
if ((await inOneDsdView()) !== true) throw new Error("Could not select the One DSD view.");

let failures = 0;
for (const shot of plan.stages.flatMap((s) => s.shots)) {
  const response = await page.goto(BASE + shot.route, { waitUntil: "networkidle", timeout: 45000 });
  await settle();
  const status = response?.status();
  const view = await inOneDsdView();
  if (status !== 200) { failures += 1; console.error(`${shot.file}: ${shot.route} answered ${status}`); }
  if (view === false) { failures += 1; console.error(`${shot.file}: not in the One DSD view`); }

  const file = path.join(OUT, shot.file);
  let kind, pixels;
  if (shot.file === "04-learn-hub.png") {
    pixels = (await moduleListTop()) + 18;
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width, height: pixels }, fullPage: true });
    kind = "cut where the module list begins";
  } else if (shot.file === "05-course-tiles.png") {
    const band = await disabilityTileBand();
    if (!band) { failures += 1; console.error(`${shot.file}: the disability tile band was not found`); continue; }
    pixels = band.height;
    await page.screenshot({ path: file, clip: { x: 0, y: band.top, width, height: band.height }, fullPage: true });
    kind = "whole course tiles only";
  } else {
    pixels = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: file, fullPage: true });
    kind = "the whole page";
  }
  console.log(JSON.stringify({ file: shot.file, route: shot.route, status, oneDsdView: view, kind, pixels }));
}
await browser.close();
if (failures) { console.error(`${failures} problem(s); the images were still written.`); process.exit(1); }
