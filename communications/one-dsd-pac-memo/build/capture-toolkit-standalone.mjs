// Makes a standalone, self-contained copy of the Equity Analysis Toolkit.
//
// The page is not rebuilt by hand. It is taken from a local run of the Program
// at /share/equity-toolkit, with the Program's own stylesheets, fonts and
// images folded into the file, so the standalone copy looks exactly like the
// page staff meet rather than an approximation of it.
//
// The toolkit is a React component: it renders one stage at a time, and the
// scenario consequence appears only after a choice. A DOM snapshot would
// therefore capture one twentieth of it. So every state is photographed —
// five stages by four choice states — and the standalone file carries all
// twenty as markup, with a small script that swaps the visible one. The
// markup is the Program's; only the switching is rewritten, because the
// original switching is React and React is not coming with us.
//
//   node build/capture-toolkit-standalone.mjs [base-url] [output-file] [playwright-dir] [browser-binary]
//
// Defaults to http://localhost:3111 and deliverables/Equity-Analysis-Toolkit.html.
// Serve the Program locally first. Playwright and a browser are local
// developer tooling, named at the top of the file.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE = path.resolve(HERE, "..");
const CHECKOUT = path.resolve(PACKAGE, "..", "..");

const BASE = process.argv[2] || "http://localhost:3111";
const OUT = process.argv[3] || path.join(PACKAGE, "deliverables", "Equity-Analysis-Toolkit.html");

// Playwright and a browser are local developer tooling, not a dependency of the
// package. Look in this checkout first, then in a sibling one, then say plainly
// where to put it rather than failing with a module-resolution stack.
const roots = [CHECKOUT, process.cwd(), path.resolve(CHECKOUT, ".."), ...(process.argv[4] ? [process.argv[4]] : [])];
let chromium;
for (const root of roots) {
  try {
    ({ chromium } = createRequire(path.join(root, "package.json"))("playwright"));
    break;
  } catch { /* try the next root */ }
}
if (!chromium) {
  throw new Error(`playwright not found. Looked in:\n  ${roots.join("\n  ")}\n` +
    "Install it in one of those, or pass its directory as the third argument.");
}
// A browser binary to use instead of the one Playwright downloads. Passed as
// the fourth argument, never read from the environment: this repository
// checks that every environment setting the source reads is documented.
const BROWSER = process.argv[5] || "";
const ROUTE = "/share/equity-toolkit";
// Where a reference that cannot be carried in the file should point instead.
const SITE = "https://one-dhs-pac.vercel.app";
const CHOICES = ["", "a", "b", "c"];

const STAGE = 'section[id$="-stage"]';
const NAV = "#toolkit-practice nav button";

/** Fetch a same-origin asset from inside the page and return a data: URI. */
const asDataUri = (page, url) => page.evaluate(async (target) => {
  try {
    const response = await fetch(target);
    if (!response.ok) return null;
    const type = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    return `data:${type.split(";")[0]};base64,${btoa(binary)}`;
  } catch { return null; }
}, url);

const browser = await chromium.launch(BROWSER ? { executablePath: BROWSER } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const problems = [];
page.on("pageerror", (error) => problems.push(String(error)));

await page.goto(BASE + ROUTE, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForSelector(STAGE, { timeout: 30000 });

// The page must be the toolkit, hydrated, or the capture is worthless.
const navCount = await page.locator(NAV).count();
if (navCount !== 5) {
  await browser.close();
  throw new Error(`expected 5 stage buttons, found ${navCount} — the page did not hydrate, or it is not the toolkit`);
}

// ---- every stage, in every choice state -------------------------------------
const stages = [];
for (let i = 0; i < 5; i += 1) {
  await page.locator(NAV).nth(i).click();
  await page.waitForTimeout(120);
  const byChoice = {};
  for (const choice of CHOICES) {
    if (choice) {
      const index = CHOICES.indexOf(choice) - 1;
      await page.locator(`${STAGE} div.grid button`).nth(index).click();
      await page.waitForTimeout(120);
    }
    byChoice[choice || "none"] = await page.$eval(STAGE, (node) => node.outerHTML);
  }
  stages.push(byChoice);
  // Back to no choice for the next stage: React keeps a choice per stage, so
  // reload rather than try to unpick it.
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector(STAGE);
}

// ---- the role note, and the clear-drafts confirmation ------------------------
await page.selectOption("#toolkit-practice select", { index: 1 });
await page.waitForTimeout(120);
const roleNote = await page.$eval('#toolkit-practice p[aria-live="polite"]', (n) => n.outerHTML);
const roleText = await page.$$eval("#toolkit-practice select option", (options) =>
  options.map((option) => option.value).filter(Boolean));
const roleContexts = {};
for (const value of roleText) {
  await page.selectOption("#toolkit-practice select", value);
  await page.waitForTimeout(80);
  roleContexts[value] = await page.$eval('#toolkit-practice p[aria-live="polite"]', (n) => n.textContent);
}
await page.selectOption("#toolkit-practice select", "");

await page.locator("#toolkit-draft button").nth(1).click();
await page.waitForTimeout(120);
const clearPanel = await page.$eval("#toolkit-draft div[id$='-clear']", (n) => n.outerHTML);
const clearedMessage = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll("#toolkit-draft p[role='status']")];
  return nodes.length ? "Your draft notes have been cleared." : "";
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector(STAGE);

// ---- inline the Program's own stylesheets, then its images -------------------
const sheets = await page.$$eval('link[rel="stylesheet"]', (links) => links.map((l) => l.href));
let css = "";
for (const href of sheets) {
  const text = await page.evaluate(async (target) => {
    const response = await fetch(target);
    return response.ok ? await response.text() : "";
  }, href);
  css += `\n/* ${new URL(href).pathname} */\n${text}`;
}
// Font and image references inside that CSS have to travel too.
const urls = [...new Set([...css.matchAll(/url\((['"]?)(\/[^)'"]+)\1\)/g)].map((m) => m[2]))];
for (const ref of urls) {
  const uri = await asDataUri(page, new URL(ref, BASE).href);
  if (uri) css = css.split(ref).join(uri);
}

await page.evaluate(() => {
  document.querySelectorAll("script, link[rel='preload'], link[rel='modulepreload'], link[rel='prefetch'], next-route-announcer").forEach((n) => n.remove());
  document.querySelectorAll("link[rel='stylesheet']").forEach((n) => n.remove());
});
const images = await page.$$eval("img", (nodes) => nodes.map((n) => n.currentSrc || n.src));
for (const src of images) {
  if (!src || src.startsWith("data:")) continue;
  const uri = await asDataUri(page, src);
  if (!uri) continue;
  await page.evaluate(([from, to]) => {
    document.querySelectorAll("img").forEach((img) => {
      if (img.currentSrc === from || img.src === from) { img.src = to; img.removeAttribute("srcset"); }
    });
  }, [src, uri]);
}

// Anything still pointing at a site path cannot be carried: the podcast audio
// alone is 34MB, well past what belongs in a single file. Those few references
// are pointed at the live Program instead, so the control works for a reader
// who is online rather than dangling for everyone. Nothing here is fetched on
// load — the audio has preload="none" — so the file still opens with no
// network of its own.
const left = await page.evaluate((site) => {
  const moved = [];
  document.querySelectorAll("[src^='/'], [href^='/']").forEach((node) => {
    for (const attribute of ["src", "href"]) {
      const value = node.getAttribute(attribute);
      if (value && value.startsWith("/")) { node.setAttribute(attribute, site + value); moved.push(value); }
    }
  });
  return moved;
}, SITE);

const body = await page.evaluate(() => document.body.innerHTML);
const title = await page.title();
await browser.close();

if (problems.length) throw new Error(`page errors during capture:\n${problems.join("\n")}`);

// ---- assemble ---------------------------------------------------------------
const data = JSON.stringify({ stages, roleContexts, roleNote, clearPanel, clearedMessage });

const runtime = `
const TOOLKIT = ${data};
const q = (s, r) => (r || document).querySelector(s);
const stageHost = () => q('section[id$="-stage"]');
const navButtons = () => [...document.querySelectorAll("#toolkit-practice nav button")];
const state = { stage: 0, choice: {} };

function paint(focus) {
  const wanted = TOOLKIT.stages[state.stage][state.choice[state.stage] || "none"];
  const host = stageHost();
  const holder = document.createElement("div");
  holder.innerHTML = wanted;
  host.replaceWith(holder.firstElementChild);
  navButtons().forEach((button, index) => {
    if (index === state.stage) {
      button.setAttribute("aria-current", "step");
      button.style.backgroundColor = "#173d59";
      button.style.color = "white";
    } else {
      button.removeAttribute("aria-current");
      button.style.backgroundColor = "";
      button.style.color = "";
    }
  });
  bindStage();
  if (focus) { const h = q("h2[tabindex]", stageHost()); if (h) h.focus(); }
}

function bindStage() {
  const host = stageHost();
  [...host.querySelectorAll("div.grid button")].forEach((button, index) => {
    button.addEventListener("click", () => {
      state.choice[state.stage] = ["a", "b", "c"][index];
      paint(false);
    });
  });
  const walk = [...host.querySelectorAll("div.flex button")];
  if (walk[0]) walk[0].addEventListener("click", () => { if (state.stage > 0) { state.stage -= 1; paint(true); } });
  if (walk[1]) walk[1].addEventListener("click", () => { if (state.stage < 4) { state.stage += 1; paint(true); } });
}

navButtons().forEach((button, index) => {
  button.addEventListener("click", () => { state.stage = index; paint(true); });
});
bindStage();

// area of work
const select = q("#toolkit-practice select");
if (select) select.addEventListener("change", () => {
  let note = q('#toolkit-practice p[aria-live="polite"]');
  if (!select.value) { if (note) note.remove(); return; }
  if (!note) {
    const holder = document.createElement("div");
    holder.innerHTML = TOOLKIT.roleNote;
    note = holder.firstElementChild;
    select.parentElement.append(note);
  }
  note.textContent = TOOLKIT.roleContexts[select.value] || "";
});

// working draft — nothing is stored, exactly as the Program promises
const draft = q("#toolkit-draft");
if (draft) {
  draft.querySelectorAll("textarea").forEach((area) => {
    const mirror = area.parentElement.querySelector("p.hidden");
    area.addEventListener("input", () => { if (mirror) mirror.textContent = area.value; say(""); });
  });
  const buttons = [...draft.querySelectorAll(":scope > div.space-y-4 > div.flex > button")];
  const [printButton, clearButton] = buttons;
  if (printButton) printButton.addEventListener("click", () => window.print());
  if (clearButton) clearButton.addEventListener("click", () => {
    if (draft.querySelector("div[id$='-clear']")) return;
    const holder = document.createElement("div");
    holder.innerHTML = TOOLKIT.clearPanel;
    const panel = holder.firstElementChild;
    clearButton.setAttribute("aria-expanded", "true");
    clearButton.parentElement.after(panel);
    const [yes, no] = [...panel.querySelectorAll("button")];
    yes.addEventListener("click", () => {
      draft.querySelectorAll("textarea").forEach((area) => {
        area.value = "";
        const mirror = area.parentElement.querySelector("p.hidden");
        if (mirror) mirror.textContent = "";
      });
      panel.remove();
      clearButton.setAttribute("aria-expanded", "false");
      say(TOOLKIT.clearedMessage);
      clearButton.focus();
    });
    no.addEventListener("click", () => {
      panel.remove();
      clearButton.setAttribute("aria-expanded", "false");
      clearButton.focus();
    });
  });
}
function say(message) {
  const status = document.querySelector("#toolkit-draft p[role='status']");
  if (status) status.textContent = message;
}
`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${css}</style>
</head>
<body>
${body}
<script>${runtime}<\/script>
</body>
</html>
`;

writeFileSync(OUT, html, "utf8");
console.log("wrote", OUT, Buffer.byteLength(html), "bytes",
  `| stages: ${stages.length} x ${Object.keys(stages[0]).length} states | css: ${Math.round(css.length / 1024)}kB | roles: ${Object.keys(roleContexts).length}`);
if (left.length) console.log("pointed at the live Program:", [...new Set(left)].join(", "));
