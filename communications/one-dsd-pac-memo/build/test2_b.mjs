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
const ctx=await b.newContext(); const pg=await ctx.newPage();
const errors=[],ext=[];
pg.on("pageerror",e=>errors.push(String(e)));
pg.on("request",r=>{if(!r.url().startsWith("file://")&&!r.url().startsWith("data:"))ext.push(r.url())});
await pg.goto("file://"+(process.argv[2]||path.join(DELIVERABLES,"One-DSD-PAC-Program-Package-Version-B.html")),{waitUntil:"load"});

const r={errors:[],ext:[],jumps:[],docs:[],toc:0,dangling:[]};
// 1. every jump link and toc row resolves to a real anchor
const targets = await pg.evaluate(()=>{
  const out=[];
  document.querySelectorAll("[data-open]").forEach(el=>{
    out.push({doc:el.getAttribute("data-open"), anchor:el.getAttribute("data-anchor"),
              label:(el.textContent||"").trim().slice(0,46)});
  });
  return out;
});
r.toc = await pg.evaluate(()=>document.querySelectorAll(".toc-row").length);
for(const t of targets){
  const ok = await pg.evaluate(([d,a])=>{
    const doc=document.getElementById(d); if(!doc) return "no-doc";
    if(a && !document.getElementById(a)) return "no-anchor";
    return "ok";
  },[t.doc,t.anchor]);
  if(ok!=="ok") r.dangling.push({...t,why:ok});
}
// 2. click each jump on the landing page, confirm the full memo opens scrolled to that section
// A person opens a fold before following a link inside it; do the same, so every jump is exercised.
await pg.evaluate(()=>document.querySelectorAll("details.fold").forEach(d=>{d.open=true}));
const jumpEls = await pg.$$("a.jump");
for(let i=0;i<jumpEls.length;i++){
  await pg.evaluate(()=>window.scrollTo(0,0));
  const el=(await pg.$$("a.jump"))[i];
  const anchor=await el.getAttribute("data-anchor");
  await el.click();
  const st=await pg.evaluate((a)=>{
    const doc=document.getElementById("doc-memofull");
    const sec=document.getElementById(a);
    const rect=sec?sec.getBoundingClientRect():null;
    return {docOpen:doc&&!doc.hidden, memoHidden:document.getElementById("memo").hidden,
            near: rect? Math.abs(rect.top)<140 : false, hash:location.hash};
  },anchor);
  r.jumps.push({anchor,...st});
  await pg.evaluate(()=>{document.querySelector("[data-back]").click()});
}
// 3. every library document still opens
const cards=await pg.$$(".card");
for(let i=0;i<cards.length;i++){
  const c=(await pg.$$(".card"))[i];
  const id=await c.getAttribute("data-open");
  await c.click();
  const vis=await pg.evaluate(id=>{const e=document.getElementById(id);return !!e&&!e.hidden},id);
  const words=await pg.evaluate(id=>(document.getElementById(id).innerText||"").trim().split(/\s+/).length,id);
  r.docs.push({id,vis,words});
  await pg.evaluate(()=>{document.querySelector("[data-back]:not([hidden])").click()});
}
r.errors=errors; r.ext=ext;
console.log(JSON.stringify(r,null,1));
await b.close();
