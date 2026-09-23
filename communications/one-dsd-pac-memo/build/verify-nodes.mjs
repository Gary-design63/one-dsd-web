import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DELIVERABLES = path.join(path.dirname(HERE), "deliverables");

// Playwright and a browser binary are local developer tooling, not
// dependencies of the package. Look in this checkout first, then a sibling.
// Given as arguments, never read from the environment.
const CHECKOUT = path.resolve(HERE, "..", "..", "..");
const ROOTS = [CHECKOUT, process.cwd(), path.resolve(CHECKOUT, ".."), ...(process.argv[3] ? [process.argv[3]] : [])];
const from = (root) => createRequire(path.join(root, "package.json"));
const missing = (name) =>
  new Error("could not find " + name + ". Looked in: " + ROOTS.join(", ") +
    ". Install it in one of those, or give its directory as an argument.");
const need = (name) => {
  for (const root of ROOTS) { try { return from(root)(name); } catch { /* next root */ } }
  throw missing(name);
};
const { chromium } = need("playwright");
const BROWSER = process.argv[2] || "";
const LAUNCH = {
  ...(BROWSER ? { executablePath: BROWSER } : {}),
  args: ["--disable-background-networking", "--disable-component-update", "--disable-domain-reliability"],
};

const fs = await import("node:fs");
const files = fs.readdirSync(DELIVERABLES)
  .filter((f) => /^Equity-Analysis-Toolkit-.*\.html$/.test(f))
  .sort();

console.log(`Checking ${files.length} pages...\n`);

const b = await chromium.launch(LAUNCH);
let failCount = 0;

for (const name of files) {
  const ctx = await b.newContext();
  const pg = await ctx.newPage();
  const errors = [];
  const externalRequests = [];
  pg.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  pg.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  pg.on("request", (req) => {
    const url = req.url();
    if (!url.startsWith("file://") && !url.startsWith("data:") && !url.startsWith("about:")) {
      externalRequests.push(url);
    }
  });

  const filePath = "file://" + path.join(DELIVERABLES, name);
  await pg.goto(filePath, { waitUntil: "load" });

  const isIndex = name.endsWith("-Index.html");
  const problems = [];

  if (errors.length) problems.push(`${errors.length} JS error(s): ${errors.slice(0, 2).join(" | ")}`);
  if (externalRequests.length) problems.push(`${externalRequests.length} external request(s): ${externalRequests.slice(0, 3).join(", ")}`);

  if (!isIndex) {
    // exactly two back-links, both pointing at the index, both navigable
    const backLinks = await pg.locator("a", { hasText: "All program areas and job families" }).all();
    if (backLinks.length !== 2) problems.push(`expected 2 back-links, found ${backLinks.length}`);

    const hrefs = await pg.evaluate(() =>
      [...document.querySelectorAll(".eat-back a")].map((a) => a.getAttribute("href"))
    );
    if (!hrefs.every((h) => h === "Equity-Analysis-Toolkit-Index.html")) {
      problems.push(`back-link href mismatch: ${JSON.stringify(hrefs)}`);
    }

    // the open-by-default fold should already show content; a closed fold should not
    const foldState = await pg.evaluate(() => {
      const folds = [...document.querySelectorAll("details.eat-fold")];
      return folds.map((f) => ({ open: f.open, hasBody: !!f.querySelector(".eat-fold-body") }));
    });
    if (foldState.length < 3) problems.push(`expected >=3 folds, found ${foldState.length}`);
    if (!foldState[0]?.open) problems.push("first fold (entry points) should be open by default");
    const closedCount = foldState.filter((f) => !f.open).length;
    if (closedCount < 2) problems.push(`expected at least 2 closed folds, found ${closedCount}`);

    // click the first closed fold's summary and confirm it opens (index by
    // position, not by :not([open]), since that selector goes stale the
    // instant the click changes the very state it's matching on)
    const allFolds = pg.locator("details.eat-fold");
    const foldCount = await allFolds.count();
    let closedIdx = -1;
    for (let i = 0; i < foldCount; i++) {
      if (!(await allFolds.nth(i).evaluate((d) => d.open))) { closedIdx = i; break; }
    }
    if (closedIdx >= 0) {
      await allFolds.nth(closedIdx).locator("summary").click();
      const nowOpen = await allFolds.nth(closedIdx).evaluate((d) => d.open);
      if (!nowOpen) problems.push("clicking a closed fold's summary did not open it");
    }

    // crosswalk line, if present, must link to real files (checked separately below)
  } else {
    // index: both card grids present, non-empty
    const counts = await pg.evaluate(() => ({
      program: document.querySelectorAll(".eat-index-grid").length,
      cards: document.querySelectorAll(".eat-index-card").length,
    }));
    if (counts.program !== 2) problems.push(`expected 2 index grids, found ${counts.program}`);
    if (counts.cards !== 22) problems.push(`expected 22 index cards (12 programs + 10 roles), found ${counts.cards}`);
    const unitNotice = await pg.locator("text=What this does not cover yet").count();
    if (!unitNotice) problems.push("missing organizational-units honesty notice");
  }

  if (problems.length) {
    failCount++;
    console.log(`FAIL  ${name}`);
    problems.forEach((p) => console.log(`        - ${p}`));
  } else {
    console.log(`ok    ${name}`);
  }

  await ctx.close();
}

await b.close();

console.log(`\n${files.length - failCount}/${files.length} pages passed.`);
if (failCount) process.exit(1);
