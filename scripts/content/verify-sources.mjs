// Fetches every outside source in the source register and records a receipt per source:
// HTTP status, final address after redirects, content type, page title, and the time checked.
// Run on a GitHub runner (this repository's authoring environment cannot reach outside hosts).
// Usage: node scripts/content/verify-sources.mjs [register.json] [receipts.json]
import { readFileSync, writeFileSync } from "node:fs";

const registerPath = process.argv[2] ?? "data/source-register/source-register.json";
const outPath = process.argv[3] ?? "verification-receipts.json";
const register = JSON.parse(readFileSync(registerPath, "utf8"));
const targets = register.sources.filter((source) => source.kind === "external" && source.href);
const CONCURRENCY = 6;
const TIMEOUT_MS = 25_000;
const UA = "One-DHS-PAC-source-check/1.0 (+https://one-dhs-pac.vercel.app; program source verification)";

function titleOf(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, " ").trim().slice(0, 200) : null;
}

async function check(source) {
  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(source.href, { redirect: "follow", signal: controller.signal, headers: { "user-agent": UA, accept: "text/html,application/pdf,*/*;q=0.8" } });
    const contentType = response.headers.get("content-type") ?? null;
    let title = null;
    let bytes = null;
    if (contentType && /text\/html/i.test(contentType)) {
      const text = await response.text();
      bytes = text.length;
      title = titleOf(text);
    } else {
      const buffer = await response.arrayBuffer();
      bytes = buffer.byteLength;
    }
    return { sourceId: source.sourceId, href: source.href, status: response.status, ok: response.ok, finalUrl: response.url || source.href, redirected: response.redirected, contentType, title, bytes, checkedAt, error: null };
  } catch (error) {
    return { sourceId: source.sourceId, href: source.href, status: null, ok: false, finalUrl: null, redirected: false, contentType: null, title: null, bytes: null, checkedAt, error: error?.name === "AbortError" ? "timeout" : String(error?.message ?? error) };
  } finally {
    clearTimeout(timer);
  }
}

const receipts = [];
let index = 0;
async function worker() {
  while (index < targets.length) {
    const source = targets[index++];
    const receipt = await check(source);
    receipts.push(receipt);
    console.log("RECEIPT " + JSON.stringify(receipt));
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
receipts.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
const summary = {
  checkedAt: new Date().toISOString(),
  registerBuiltAt: register.builtAt,
  total: receipts.length,
  ok: receipts.filter((r) => r.ok).length,
  redirected: receipts.filter((r) => r.ok && r.redirected).length,
  clientErrors: receipts.filter((r) => r.status && r.status >= 400 && r.status < 500).length,
  serverErrors: receipts.filter((r) => r.status && r.status >= 500).length,
  unreachable: receipts.filter((r) => r.status === null).length,
};
writeFileSync(outPath, JSON.stringify({ summary, receipts }, null, 1) + "\n");
console.log("SUMMARY " + JSON.stringify(summary));
