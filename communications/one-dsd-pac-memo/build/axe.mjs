// Accessibility audit of the built package with axe-core (WCAG 2.0/2.1 A and AA),
// on the landing page as loaded and again with a document opened.
import path from "node:path";
import { fileURLToPath } from "node:url";
// The package resolves from this file, so a checkout is all a check needs.
// The browser and axe-core are local developer tooling, not part of the app.
const DELIVERABLES = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "deliverables");
import { createRequire } from "node:module";

// Playwright, a browser and axe-core are local developer tooling, not
// dependencies of the package. Look in this checkout first, then a sibling.
// Given as arguments, never read from the environment: this repository checks
// that every environment setting the source reads is documented.
const CHECKOUT = path.resolve(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "..", "..");
const ROOTS = [CHECKOUT, process.cwd(), path.resolve(CHECKOUT, ".."), ...(process.argv[3] ? [process.argv[3]] : [])];
const from = (root) => createRequire(path.join(root, "package.json"));
const missing = (name) =>
  new Error("could not find " + name + ". Looked in: " + ROOTS.join(", ") +
    ". Install it in one of those, or give its directory as the second argument.");
const need = (name) => {
  for (const root of ROOTS) { try { return from(root)(name); } catch { /* next root */ } }
  throw missing(name);
};
const needPath = (name) => {
  for (const root of ROOTS) { try { return from(root).resolve(name); } catch { /* next root */ } }
  throw missing(name);
};
const { chromium } = need("playwright");
// A browser binary to use instead of the one Playwright downloads.
const BROWSER = process.argv[4] || "";
const LAUNCH = BROWSER ? { executablePath: BROWSER } : {};
import fs from "fs";
const file = process.argv[2] || path.join(DELIVERABLES, "One-DSD-PAC-Program-Package.html");
const axeSrc = fs.readFileSync(needPath("axe-core/axe.min.js"), "utf8");
const b = await chromium.launch(LAUNCH);
const pg = await b.newPage();
await pg.goto("file://" + file, { waitUntil: "load" });
const run = async (label) => {
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","best-practice"] } }));
  const v = r.violations.map(x => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, help: x.help, sample: x.nodes[0]?.target?.[0], sampleHtml: (x.nodes[0]?.html||"").slice(0,140) }));
  console.log(`== ${label}: ${v.length} violation types, ${r.passes.length} rules passed ==`);
  for (const x of v) console.log(`  [${x.impact}] ${x.id} x${x.nodes}: ${x.help}\n      e.g. ${x.sample}  ${x.sampleHtml}`);
};
await run("landing page");
await pg.click('a.card[href="#doc-climate"]');
await pg.waitForTimeout(200);
await run("with a document open");
await b.close();
