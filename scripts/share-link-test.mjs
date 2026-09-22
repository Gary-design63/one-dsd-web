// Share-link check against the live site: builds a share link for three resources from
// addresses carrying personal context, opens each link, and confirms it shows that resource
// only. With SEND=true the report is emailed to the owner through the app's Resend route.
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

// The share rule is read from the source the live site is built from (SHARE_CHECK_SOURCE_DIR, default: this checkout).
const SOURCE_DIR = path.resolve(process.env.SHARE_CHECK_SOURCE_DIR ?? ".");
const { shareLink } = await import(pathToFileURL(path.join(SOURCE_DIR, "lib/product/share-link.ts")).href);

const BASE = (process.env.SHARE_CHECK_BASE_URL ?? "https://one-dhs-pac.vercel.app").replace(/\/+$/, "");
const PERSONAL = /originArea|task=|q=|mode=/;

const CASES = [
  { kind: "course", title: "Accessibility Basics", context: "one_dhs",
    from: { pathname: "/courses/di-accessibility-basics", search: "?originArea=workforce_equity&task=design-role", hash: "" },
    mustNotContain: ["How to use this program", "DHS equity policy and toolkit"] },
  { kind: "library resource", title: "How to use this program", context: "one_dhs",
    from: { pathname: "/library/lm-how-this-program-works/", search: "?q=my%20supervisor%20said&originArea=workforce_equity", hash: "" },
    mustNotContain: ["Accessibility Basics", "DHS equity policy and toolkit"] },
  { kind: "podcast", title: "DHS equity policy and toolkit", context: "one_dsd",
    from: { pathname: "/learn", search: "?originArea=workforce_equity&task=design-role", hash: "#podcast-equity-toolkit" },
    anchorId: "podcast-equity-toolkit", mustNotContain: [] },
];

function text(html) { return html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " "); }

const results = [];
for (const item of CASES) {
  const startedFrom = `${BASE}${item.from.pathname}${item.from.search}${item.from.hash}`;
  const link = shareLink({ origin: BASE, ...item.from }, item.context);
  const response = await fetch(link.replace(/#.*$/, ""), { redirect: "follow" });
  const html = await response.text();
  const plain = text(html);
  const checks = {
    opens: response.status === 200,
    noPersonalContext: !PERSONAL.test(link),
    showsThisResource: plain.includes(item.title),
    anchorPresent: item.anchorId ? html.includes(`id="${item.anchorId}"`) : true,
    otherResourcesAbsent: item.mustNotContain.every(other => !plain.includes(other)),
    shareControlPresent: html.includes('data-share-page="true"'),
  };
  results.push({ kind: item.kind, title: item.title, startedFrom, shareLink: link, status: response.status, checks, pass: Object.values(checks).every(Boolean) });
}

const checkedAt = new Date().toISOString();
const allPass = results.every(result => result.pass);
const lines = [
  `Share-link check on ${BASE} at ${checkedAt}`,
  `Result: ${allPass ? "all three links open their own resource only" : "at least one check failed"}`,
  "",
  ...results.flatMap(result => [
    `${result.kind}: ${result.title}`,
    `  Started from: ${result.startedFrom}`,
    `  Share link:   ${result.shareLink}`,
    `  HTTP ${result.status}; ${Object.entries(result.checks).map(([name, ok]) => `${name}=${ok ? "yes" : "NO"}`).join(", ")}`,
    "",
  ]),
];
const report = lines.join("\n");
console.log(report);
writeFileSync("share-link-test-report.json", JSON.stringify({ base: BASE, checkedAt, allPass, results }, null, 2));

if (process.env.SHARE_CHECK_SEND === "true") {
  const response = await fetch(`${BASE}/api/sp-clone-request`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ requesterName: "Share-link check (GitHub runner)", topic: "Share-link test: three resources", details: report }),
  });
  const body = await response.text();
  console.log(`email request: HTTP ${response.status} ${body.slice(0, 300)}`);
  if (!response.ok) process.exitCode = 1;
}
if (!allPass) process.exitCode = 1;
