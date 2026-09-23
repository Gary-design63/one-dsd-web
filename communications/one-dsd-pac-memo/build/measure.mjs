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
const b=await chromium.launch(LAUNCH);
// 7in x 9.5in = the real printable box on Letter at 0.75in margins.
const pg=await (await b.newContext({viewport:{width:672,height:912}})).newPage();
await pg.goto("file://"+(process.argv[2]||path.join(DELIVERABLES,"One-DSD-PAC-Program-Package.html")),{waitUntil:"load"});
await pg.emulateMedia({media:"print"});
const h = await pg.evaluate(()=>document.body.scrollHeight/96);
console.log(JSON.stringify({inches:+h.toFixed(2), pages:+(h/9.5).toFixed(2), spareIn:+(19-h).toFixed(2)}));
await b.close();
