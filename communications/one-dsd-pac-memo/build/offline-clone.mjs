// Full-site offline clone. Two phases:
//   1. Crawl: visit every reachable same-scope page with JavaScript OFF (so
//      what's captured is the real server-rendered content, not a React tree
//      that will try and fail to re-hydrate once there's no server). Collect
//      every page's HTML and every same-origin asset URL it references
//      (images, audio, fonts, stylesheets).
//   2. Materialize: download each unique asset once, then rewrite every
//      page's internal <a href>, <audio src>, <img src>, <link href> to a
//      relative local path and write it to a mirrored file path. Native
//      <audio controls> and plain <a href> links need no JavaScript at all,
//      which is why turning JS off in the capture is safe rather than a loss.
//
// usage: node offline-clone.mjs <baseUrl> <outDir> <configFile.json> [playwrightRoot]
//   configFile: { seeds: string[], exclude: string[] (regex source),
//                 scopePrefix?: string, alwaysInclude?: string[] }
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHECKOUT = path.resolve(HERE, "..", "..", "..");
const ROOTS = [CHECKOUT, process.cwd(), path.resolve(CHECKOUT, ".."), ...(process.argv[5] ? [process.argv[5]] : [])];
const from = (root) => createRequire(path.join(root, "package.json"));
const need = (name) => {
  for (const root of ROOTS) { try { return from(root)(name); } catch { /* next */ } }
  throw new Error(`could not find ${name} in any of: ${ROOTS.join(", ")}`);
};
const { chromium } = need("playwright");

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3];
const CONFIG_FILE = process.argv[4];
const BROWSER = process.env.CLONE_BROWSER || "";
if (!OUT || !CONFIG_FILE) {
  console.error("usage: node offline-clone.mjs <baseUrl> <outDir> <configFile.json> [playwrightRoot]");
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
const EXCLUDE = (config.exclude || []).map((p) => new RegExp(p));
const isExcluded = (p) => EXCLUDE.some((re) => re.test(p));
const ALWAYS_EXACT = new Set(config.alwaysIncludeExact || []);
const inScope = (p) => {
  if (p.startsWith("/_next/")) return false;
  if (p.startsWith("/api/")) return false; // server endpoints, not pages -- e.g. live document exports that need a real backend
  if (isExcluded(p)) return false;
  if (!config.scopePrefix) return true;
  if (p.startsWith(config.scopePrefix)) return true;
  if (ALWAYS_EXACT.has(p)) return true;
  return (config.alwaysInclude || []).some((prefix) => p.startsWith(prefix));
};

fs.mkdirSync(OUT, { recursive: true });

function toLocalFile(pathname) {
  let p = pathname.split(/[?#]/)[0];
  if (p === "/" || p === "") return "index.html";
  if (p.endsWith("/")) p += "index";
  return p.replace(/^\//, "") + ".html";
}
function relLink(fromFile, toFile) {
  const rel = path.relative(path.dirname(fromFile), toFile);
  return (rel === "" ? path.basename(toFile) : rel).split(path.sep).join("/");
}
// Next.js's <Image> serves everything through /_next/image?url=<encoded original>&w=..&q=..,
// which needs a live server to resolve. Offline, we bypass the optimizer and fetch (and link to)
// the original file it names instead.
function realImagePath(rawPath) {
  if (!rawPath.startsWith("/_next/image?")) return rawPath;
  const params = new URLSearchParams(rawPath.slice("/_next/image?".length));
  const url = params.get("url");
  if (!url) return null;
  return url.startsWith("/") ? decodeURIComponent(url) : null; // ignore already-absolute (external) sources
}
// Resolves any src/srcset URL entry (plain asset or /_next/image optimizer URL) down to
// the real underlying same-origin path, stripped of query/hash, or null if unresolvable.
function resolveSrcPath(raw) {
  if (raw.startsWith("/_next/image?")) return realImagePath(raw);
  return raw.split(/[?#]/)[0];
}

// ---------------- Phase 1: crawl ----------------
const b = await chromium.launch(BROWSER ? { executablePath: BROWSER } : {});
const ctx = await b.newContext({ javaScriptEnabled: false });
const pages = new Map(); // pathname -> { html, localFile }
const assetUrls = new Set();
const queue = [...config.seeds];
const failures = [];

const MAX_PAGES = config.maxPages || Infinity;
while (queue.length) {
  if (pages.size >= MAX_PAGES) {
    console.log(`\nHit maxPages cap (${MAX_PAGES}); stopping crawl with ${queue.length} still queued.`);
    break;
  }
  const pathname = queue.shift().split(/[?#]/)[0];
  if (pages.has(pathname) || !inScope(pathname)) continue;
  const page = await ctx.newPage();
  const t0 = Date.now();
  try {
    const resp = await page.goto(BASE + pathname, { waitUntil: "load", timeout: 30000 });
    if (!resp || resp.status() >= 400) { failures.push({ pathname, status: resp?.status() }); await page.close(); continue; }
    const html = await page.content();
    const localFile = toLocalFile(pathname);
    pages.set(pathname, { html, localFile });

    for (const m of html.matchAll(/<a\b[^>]*?\bhref="([^"]+)"/gi)) {
      const href = m[1];
      if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next/")) {
        const clean = href.split(/[?#]/)[0];
        if (!pages.has(clean) && !queue.includes(clean)) queue.push(clean);
      }
    }
    for (const m of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:png|jpe?g|svg|webp|gif|mp3|wav|m4a|woff2?|ttf|css))"/g)) {
      assetUrls.add(m[1]);
    }
    for (const m of html.matchAll(/(?:src|srcset)="(\/_next\/image\?[^"\s]+)/g)) {
      const real = resolveSrcPath(m[1]);
      if (real) assetUrls.add(real);
    }
    console.log(`crawled [${pages.size}] ${pathname}  (${queue.length} queued, ${Date.now() - t0}ms)`);
  } catch (e) {
    failures.push({ pathname, error: String(e) });
    console.log(`FAILED ${pathname}: ${e}`);
  } finally {
    await page.close();
  }
}

// ---------------- Phase 2: materialize assets ----------------
const ASSET_DIR = path.join(OUT, "_assets");
fs.mkdirSync(ASSET_DIR, { recursive: true });
const assetLocal = new Map(); // absolute site path -> local file under _assets/
const assetPage = await ctx.newPage();
for (const assetPath of assetUrls) {
  try {
    const resp = await assetPage.request.get(BASE + assetPath, { timeout: 30000 });
    if (!resp.ok()) continue;
    const buf = await resp.body();
    const ext = path.extname(assetPath.split(/[?#]/)[0]) || ".bin";
    const name = Buffer.from(assetPath).toString("base64url").slice(0, 40) + ext;
    fs.writeFileSync(path.join(ASSET_DIR, name), buf);
    assetLocal.set(assetPath, "_assets/" + name);
  } catch (e) {
    console.log(`asset failed ${assetPath}: ${e}`);
  }
}
await assetPage.close();
await b.close();
console.log(`\nMaterialized ${assetLocal.size}/${assetUrls.size} assets.`);

// ---------------- Phase 3: rewrite + write pages ----------------
for (const [pathname, { html, localFile }] of pages) {
  let out = html;
  // Strip script tags entirely -- no server exists for them to hydrate against,
  // and every feature this demo needs (links, native audio) works without JS.
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<script\b[^>]*\/>/gi, "");
  out = out.replace(/<link\b[^>]*\brel="(?:preload|modulepreload)"[^>]*>/gi, "");
  // Rewrite internal links to the mirrored local file, or drop to plain text
  // (still visible, just not clickable) if that target was never captured.
  out = out.replace(/href="(\/[^"#?]*)((?:[?#][^"]*)?)"/g, (full, hrefPath, suffix) => {
    if (pages.has(hrefPath)) return `href="${relLink(localFile, pages.get(hrefPath).localFile)}${suffix.startsWith("#") ? suffix : ""}"`;
    const assetName = hrefPath.split(/[?#]/)[0];
    if (assetLocal.has(assetName)) return `href="${relLink(localFile, assetLocal.get(assetName))}"`;
    return full; // leave as-is (will 404 to a live URL if ever clicked; harmless dead link)
  });
  out = out.replace(/\bsrc="(\/[^"]+)"/g, (full, srcPath) => {
    const clean = resolveSrcPath(srcPath);
    if (clean && assetLocal.has(clean)) return `src="${relLink(localFile, assetLocal.get(clean))}"`;
    return full;
  });
  // srcset carries one or more "<url> <descriptor>" entries; rewrite each url in place.
  out = out.replace(/\bsrcset="([^"]+)"/g, (full, srcset) => {
    const rewritten = srcset.split(",").map((entry) => {
      const [rawUrl, descriptor] = entry.trim().split(/\s+/, 2);
      const clean = resolveSrcPath(rawUrl);
      const local = clean && assetLocal.has(clean) ? relLink(localFile, assetLocal.get(clean)) : rawUrl;
      return descriptor ? `${local} ${descriptor}` : local;
    }).join(", ");
    return `srcset="${rewritten}"`;
  });

  const outPath = path.join(OUT, localFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out);
}

fs.writeFileSync(
  path.join(OUT, "_manifest.json"),
  JSON.stringify({ pageCount: pages.size, failures, assetCount: assetLocal.size, pathnames: [...pages.keys()].sort() }, null, 2),
);
console.log(`\nWrote ${pages.size} pages to ${OUT} (${failures.length} failures). See _manifest.json.`);
