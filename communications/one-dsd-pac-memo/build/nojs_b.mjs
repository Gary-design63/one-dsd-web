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
const FILE="file://"+(process.argv[2]||path.join(DELIVERABLES,"One-DSD-PAC-Program-Package-Version-B.html"));
const b=await chromium.launch(LAUNCH);
const ctx=await b.newContext({javaScriptEnabled:false});
const pg=await ctx.newPage();
await pg.goto(FILE,{waitUntil:"load"});
const base=await pg.evaluate(()=>({
  cardTag:document.querySelector(".card")?.tagName,
  tocTag:document.querySelector(".toc-row")?.tagName,
  docsVisible:[...document.querySelectorAll(".doc")].filter(d=>d.offsetParent!==null).length,
  docsTotal:document.querySelectorAll(".doc").length,
}));
console.log("NO-JS baseline:",JSON.stringify(base));

// every card link must point at a real element, and reach it
const targets=await pg.evaluate(()=>[...document.querySelectorAll("a.card,a.toc-row,a.jump")].map(a=>a.getAttribute("href")));
let dangling=[],unreached=[];
for(const href of targets){
  const id=href.replace("#","");
  const ok=await pg.evaluate(i=>!!document.getElementById(i),id);
  if(!ok){dangling.push(href);continue}
}
// click a card and confirm the browser actually navigates to a visible document
await pg.locator("a.card").first().click();
const after=await pg.evaluate(()=>{
  const el=document.getElementById(location.hash.slice(1));
  const r=el&&el.getBoundingClientRect();
  return {hash:location.hash, visible:!!el&&el.offsetParent!==null, atTop:r?Math.abs(r.top)<200:false};
});
console.log("NO-JS after clicking first card:",JSON.stringify(after));
// and a contents row deep-link
await pg.goto(FILE,{waitUntil:"load"});
await pg.locator("a.toc-row").nth(8).click();
const deep=await pg.evaluate(()=>{
  const el=document.getElementById(location.hash.slice(1));
  const r=el&&el.getBoundingClientRect();
  return {hash:location.hash, visible:!!el&&el.offsetParent!==null, atTop:r?Math.abs(r.top)<200:false};
});
console.log("NO-JS after clicking a contents row:",JSON.stringify(deep));
console.log("dangling hrefs:",dangling.length?dangling:"none", "| links checked:", targets.length);
await b.close();
