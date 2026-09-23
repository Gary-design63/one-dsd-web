import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const base = new URL(process.argv[2] ?? "https://one-dhs-pac.vercel.app");
if (base.protocol !== "https:" || !base.hostname.endsWith(".vercel.app")) throw new Error("Use the approved Vercel HTTPS deployment address.");
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const recovered = JSON.parse(readFileSync("lib/content/community-design-data.json", "utf8"));
const entries = [...recovered, { id: "deaf-deafblind-hard-of-hearing" }];
const results = [];
async function get(path) {
  const started = Date.now();
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60000) });
  const body = await response.text();
  if (response.status !== 200 || /Application error:|Internal Server Error/.test(body)) throw new Error(`Release check failed: ${path}, status ${response.status}.`);
  return { response, body, milliseconds: Date.now() - started };
}
for (const { id } of entries) {
  const { body, milliseconds } = await get(`/minnesota-communities/${id}`);
  const title = body.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
  if (!title || !body.includes("Learning and reflection") || !body.includes("History, culture, and life today")) throw new Error(`The complete experience is missing for ${id}.`);
  if (/Maintained by|Planned review January 15|Community review is still in progress/.test(body)) throw new Error(`Removed staff boilerplate returned for ${id}.`);
  results.push({ id, title, milliseconds, passed: true });
}
const directory = await get("/minnesota-communities");
if (!directory.body.includes("42 community and place briefs")) throw new Error("The directory does not account for all 42 pages.");
const featured = [...directory.body.matchAll(/<a[^>]+href="\/minnesota-communities\/([^"?]+)"/g)].map(match => match[1]);
if (JSON.stringify(featured.slice(0, 6)) !== JSON.stringify(["african-american", "latino", "hmong", "somali", "karen", "oromo"])) throw new Error("The approved community order changed.");
const navigation = [];
for (const path of ["/", "/learn", "/learn/equity-toolkit", "/learn/community-connections", "/one-dsd", "/one-dsd/team", "/one-dsd/amplify", "/ask", "/library", "/library/ja-access-checks", "/support", "/support/request", "/consultant"]) {
  const { body, milliseconds } = await get(path);
  if (path === "/" && !body.includes("Practical support for DHS staff across equity, accessibility, intercultural practice, leadership, and engagement.")) throw new Error("The approved Home wording is missing.");
  if (path === "/consultant" && !body.includes("Workspace access key")) throw new Error("The Consultant Workspace is not showing its sign-in boundary.");
  navigation.push({ path, milliseconds, passed: true });
}
const assets = [];
for (const name of ["dhs-logo.png", "staff-hero.jpg"]) {
  const response = await fetch(new URL(`/images/${name}`, base));
  const actual = sha(Buffer.from(await response.arrayBuffer()));
  const expected = sha(readFileSync(`public/images/${name}`));
  if (response.status !== 200 || actual !== expected) throw new Error(`The deployed ${name} differs from the approved asset.`);
  assets.push({ name, sha256: actual, unchanged: true });
}
const health = await get("/api/health");
if (JSON.parse(health.body).status !== "ok") throw new Error("The application health check failed.");
mkdirSync("evidence", { recursive: true });
writeFileSync("evidence/production-community-release.json", JSON.stringify({ checkedAt: new Date().toISOString(), base: base.origin, communities: results, navigation, assets, health: "ok" }, null, 2) + "\n");
console.log(JSON.stringify({ status: "passed", base: base.origin, communityPages: results.length, navigationChecks: navigation.length, assetsUnchanged: assets.length, health: "ok" }));
