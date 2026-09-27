#!/usr/bin/env node
/**
 * Build a single-file HTML edition of the program from a running copy.
 *   node offline/build-html-edition.mjs <baseUrl> "<output folder>"
 * Crawls every staff page, keeps each page's main content, and writes one
 * HTML file with a built-in page switcher, click-to-edit, and "Save edited
 * copy". Images, audio and fonts are copied to an assets folder beside it.
 */
import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { resolveStream } from "./html-stream.mjs";
import path from "node:path";

const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const OUT = path.resolve(process.argv[3] || "html-edition");
const PUBLIC = path.resolve(import.meta.dirname, "..", "public");
const LIVE = "https://people-access-culture.up.railway.app";
if (existsSync(OUT)) { console.error(`Output exists: ${OUT}`); process.exit(1); }
mkdirSync(path.join(OUT, "assets"), { recursive: true });

const SKIP = /^\/(api|consultant|contribute|_next|share)(\/|$)|logout|login|editing/;
const pages = new Map();
const assets = new Set();
const failed = [];
const queue = ["/"];
const seen = new Set(queue);


async function get(url, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(90000) });
      return { status: r.status, text: await r.text(), type: r.headers.get("content-type") || "" };
    } catch (e) { if (i === tries - 1) throw e; await new Promise(r => setTimeout(r, 1500)); }
  }
}

function localAsset(p) {
  const clean = decodeURIComponent(p.split("?")[0].split("#")[0]);
  const file = path.join(PUBLIC, clean);
  if (!clean.startsWith("/") || clean.includes("..") || !existsSync(file) || !statSync(file).isFile()) return null;
  assets.add(clean);
  return "assets" + clean;
}

function rewrite(html) {
  // next/image URLs -> original file
  html = html.replace(/\/_next\/image\?url=([^&"']+)[^"'\s]*/g, (m, u) => localAsset(decodeURIComponent(u)) || m);
  html = html.replace(/\s(srcset|imagesizes)="[^"]*"/g, "");
  return html.replace(/(href|src|poster|action)="(\/[^"]*)"/g, (m, attr, url) => {
    const pathOnly = url.split(/[?#]/)[0];
    if (/^\/api\/downloads\//.test(url)) return `${attr}="${LIVE}${url.replace(/&amp;/g, "&")}" target="_blank"`;
    const asset = /\.[a-z0-9]{2,5}$/i.test(pathOnly) ? localAsset(url) : null;
    if (asset) return `${attr}="${asset}"`;
    if (attr === "href" && !SKIP.test(pathOnly)) {
      const norm = pathOnly.replace(/\/+$/, "") || "/";
      if (!seen.has(norm)) { seen.add(norm); queue.push(norm); }
      const hash = url.includes("#") ? "::" + url.split("#")[1] : "";
      return `href="#${norm}${hash}"`;
    }
    if (attr === "href") return `href="${LIVE}${url}" target="_blank"`;
    return m;
  });
}

function between(html, open, close) {
  const s = html.indexOf(open); if (s < 0) return "";
  const e = html.lastIndexOf(close); return e > s ? html.slice(s, e + close.length) : "";
}

let header = "", footer = "", css = "";
while (queue.length) {
  const batch = queue.splice(0, 4);
  await Promise.all(batch.map(async (route) => {
    try {
      const head = await get(BASE + route);
      if (head.status !== 200 || !head.type.includes("html")) return failed.push(`${route} (${head.status})`);
      const r = { text: resolveStream(head.text) };
      const m = r.text.match(/<main[^>]*>([\s\S]*)<\/main>/);
      if (!m || /data-dgst=|Something did not load|We could not find that page|Opening your page…/.test(m[1])) return failed.push(`${route} (error or not found)`);
      const body = m[1].replace(/<template[\s\S]*?<\/template>/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
      const title = (r.text.match(/<title>([^<]*)<\/title>/) || [])[1] || route;
      pages.set(route, { title, html: rewrite(body) });
      if (route === "/") {
        header = rewrite(between(r.text, "<header", "</header>").replace(/<script[\s\S]*?<\/script>/g, ""));
        footer = rewrite((r.text.match(/<\/main>([\s\S]*?<footer[\s\S]*?<\/footer>)/) || [])[1] || "");
        for (const href of [...r.text.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(x => x[1])) {
          let text = (await get(BASE + href)).text;
          const matches = [...text.matchAll(/url\((\/_next\/static\/media\/[^)]+)\)/g)];
          for (const [, font] of matches) {
            const name = path.basename(font);
            const buf = Buffer.from(await (await fetch(BASE + font)).arrayBuffer());
            mkdirSync(path.join(OUT, "assets", "fonts"), { recursive: true });
            writeFileSync(path.join(OUT, "assets", "fonts", name), buf);
            text = text.split(font).join(`assets/fonts/${name}`);
          }
          css += text + "\n";
        }
      }
    } catch (e) { failed.push(`${route} (${e.message})`); }
  }));
  process.stdout.write(`\r${pages.size} pages, ${queue.length} queued   `);
}

const IMAGE = /\.(jpe?g|png|webp|gif)$/i;
const embedded = new Map();
for (const a of assets) {
  if (!IMAGE.test(a)) continue;
  const buf = await sharp(path.join(PUBLIC, a)).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  embedded.set("assets" + a, `data:image/webp;base64,${buf.toString("base64")}`);
}
function embed(html) { return html.replace(/assets\/[^"')\s]+\.(?:jpe?g|png|webp|gif)/gi, (m) => embedded.get(m) || m); }
for (const page of pages.values()) page.html = embed(page.html);
header = embed(header); footer = embed(footer);
for (const a of assets) {
  if (IMAGE.test(a)) continue;
  const dest = path.join(OUT, "assets", a);
  mkdirSync(path.dirname(dest), { recursive: true });
  copyFileSync(path.join(PUBLIC, a), dest);
}

const data = JSON.stringify(Object.fromEntries(pages)).replace(/</g, "\\u003c");
const doc = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>One DHS People, Access and Culture</title>
<style>${css}
#pac-bar{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
#pac-bar button{min-height:44px;padding:8px 16px;border-radius:6px;border:1px solid #173d59;background:#fff;color:#173d59;font:600 15px system-ui;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.15)}
#pac-bar button.on{background:#173d59;color:#fff}
body.pac-editing main [contenteditable]{outline:2px dashed #7aa7c7;outline-offset:2px}
#pac-note{position:fixed;left:16px;bottom:16px;z-index:9999;background:#173d59;color:#fff;padding:10px 14px;border-radius:6px;font:14px system-ui;display:none;max-width:340px}
</style></head>
<body class="program-design flex min-h-full flex-col">
${header}
<main id="main" tabindex="-1" class="flex-1"></main>
${footer}
<div id="pac-note" role="status"></div>
<div id="pac-bar"><button id="pac-edit" type="button">Edit this page</button><button id="pac-save" type="button">Save edited copy</button></div>
<script id="pac-pages" type="application/json">${data}</script>
<script>
(function(){
  var pages = JSON.parse(document.getElementById('pac-pages').textContent);
  var main = document.getElementById('main'), editing = false, current = '/';
  function note(t){var n=document.getElementById('pac-note');n.textContent=t;n.style.display='block';clearTimeout(note.t);note.t=setTimeout(function(){n.style.display='none'},4000);}
  function capture(){ if(pages[current]) pages[current].html = main.innerHTML.replace(/ contenteditable="true"/g,''); }
  function setEditing(on){
    editing=on; document.body.classList.toggle('pac-editing',on);
    var b=document.getElementById('pac-edit'); b.textContent=on?'Done editing':'Edit this page'; b.classList.toggle('on',on);
    main.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,th,dt,dd,blockquote,figcaption,summary,span,a,strong,em,label').forEach(function(el){ if(el.children.length===0||/^(p|li|h[1-6]|td|th|dd|blockquote|figcaption)$/i.test(el.tagName)){ if(on) el.setAttribute('contenteditable','true'); else el.removeAttribute('contenteditable'); }});
    if(!on){ capture(); try{localStorage.setItem('pac-edit:'+current,pages[current].html);}catch(e){} note('Changes kept. Use "Save edited copy" to save them into a new file.'); }
  }
  function show(){
    if(editing) setEditing(false);
    var h = decodeURIComponent(location.hash.slice(1)) || '/', parts = h.split('::'), route = parts[0] || '/';
    var page = pages[route];
    current = route;
    if(!page){ main.innerHTML = '<div class="wrap py-10"><h1 class="text-3xl">This page is not in the file</h1><p>It needs the full program. <a href="${LIVE}'+route+'" target="_blank">Open it on the live site</a>, or go <a href="#/">home</a>.</p></div>'; document.title='Not in this file'; return; }
    var saved; try{ saved = localStorage.getItem('pac-edit:'+route); }catch(e){}
    main.innerHTML = saved || page.html; document.title = page.title;
    main.querySelectorAll('details').forEach(function(d){ d.open = d.open; });
    if(parts[1]){ var t=document.getElementById(parts[1]); if(t){ t.scrollIntoView(); return; } }
    window.scrollTo(0,0);
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a');
    if(editing && a && main.contains(a)){ e.preventDefault(); return; }
    var btn = e.target.closest && e.target.closest('button');
    if(btn && !btn.closest('#pac-bar') && /menu/i.test(btn.textContent)){ var nav=document.querySelector('header nav'); if(nav) nav.hidden=!nav.hidden; }
  });
  document.getElementById('pac-edit').onclick = function(){ setEditing(!editing); if(editing) note('Click any text to change it. Choose "Done editing" when finished.'); };
  document.getElementById('pac-save').onclick = function(){
    if(editing) setEditing(false);
    for (var k in pages){ try{ var s=localStorage.getItem('pac-edit:'+k); if(s) pages[k].html=s; }catch(e){} }
    var clone = document.documentElement.cloneNode(true);
    clone.querySelector('#main').innerHTML=''; clone.querySelector('#pac-pages').textContent = JSON.stringify(pages).replace(/</g,'\\\\u003c');
    var blob = new Blob(['<!doctype html>\\n'+clone.outerHTML], {type:'text/html'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'One-DHS-PAC-edited.html'; document.body.appendChild(a); a.click(); a.remove();
    note('Saved. Put the new file in this same folder so images and audio still work.');
  };
  window.addEventListener('hashchange', show);
  show();
})();
</script></body></html>`;
writeFileSync(path.join(OUT, "One-DHS-PAC.html"), doc);
writeFileSync(path.join(OUT, "pages-not-included.txt"), failed.sort().join("\n") + "\n");
const mb = (statSync(path.join(OUT, "One-DHS-PAC.html")).size / 1048576).toFixed(1);
console.log(`\nDone: ${pages.size} pages, ${assets.size} asset files, ${failed.length} not included, HTML ${mb} MB`);
