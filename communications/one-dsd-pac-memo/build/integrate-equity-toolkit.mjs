// Copies the 24 already-built, fully self-contained Equity Analysis Toolkit
// static pages into a DSD-specific offline clone's own output tree, rewrites
// the toolkit's two cross-links to the live app (which pointed at the real
// Vercel deployment) to local relative paths inside this same offline copy,
// and links the toolkit in from the clone's one-dsd hub page.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
const TOOLKIT_SRC = process.argv[3] || path.resolve(import.meta.dirname, "..", "deliverables");
if (!OUT) { console.error("usage: node integrate-equity-toolkit.mjs <outDir> [toolkitSrcDir]"); process.exit(1); }

const DEST = path.join(OUT, "equity-toolkit");
fs.mkdirSync(DEST, { recursive: true });

const files = fs.readdirSync(TOOLKIT_SRC).filter((f) => f.startsWith("Equity-Analysis-Toolkit") && f.endsWith(".html"));
if (!files.length) { console.error(`No toolkit HTML files found in ${TOOLKIT_SRC}`); process.exit(1); }

// The live-app cross-references the toolkit's job-family pages added (the "island" fix):
// rewrite each to the corresponding page this same offline copy already captured.
const REWRITES = [
  { from: "https://one-dhs-pac.vercel.app/library/tool-idi", to: "../library/tool-idi.html" },
  { from: "https://one-dhs-pac.vercel.app/one-dsd/amplify/mentoring", to: "../one-dsd/amplify/mentoring.html" },
];

let copied = 0;
for (const f of files) {
  let html = fs.readFileSync(path.join(TOOLKIT_SRC, f), "utf8");
  for (const { from, to } of REWRITES) html = html.split(from).join(fs.existsSync(path.join(OUT, to.replace(/^\.\.\//, ""))) ? to : from);
  if (f === "Equity-Analysis-Toolkit-Index.html" && fs.existsSync(path.join(OUT, "one-dsd.html"))) {
    const backLink = `<p style="margin:0;padding:10px 16px;background:#F5F5F3;border-bottom:1px solid #DDDDD9;font:600 13px system-ui,sans-serif"><a href="../one-dsd.html" style="color:#003865">&larr; Back to One DSD</a></p>`;
    html = html.replace(/<body>/, `<body>${backLink}`);
  }
  fs.writeFileSync(path.join(DEST, f), html);
  copied++;
}
console.log(`Copied ${copied} toolkit pages to ${DEST}`);

// Link the toolkit in from the one-dsd hub page, right after its primary nav, if not already present.
const hubFile = path.join(OUT, "one-dsd.html");
if (fs.existsSync(hubFile)) {
  let html = fs.readFileSync(hubFile, "utf8");
  if (!html.includes("equity-toolkit/Equity-Analysis-Toolkit-Index.html")) {
    const banner =
      `<div style="margin:0;padding:14px 16px;background:#F5F5F3;border-bottom:1px solid #DDDDD9;text-align:center;font:600 14px/1.4 system-ui,sans-serif;color:#002544">` +
      `The <a href="equity-toolkit/Equity-Analysis-Toolkit-Index.html" style="color:#003865;text-decoration:underline">Equity Analysis Toolkit</a> ` +
      `is fully built out, organized by program area and job family.</div>`;
    const bodyOpenEnd = html.indexOf(">", html.indexOf("<body")) + 1;
    html = html.slice(0, bodyOpenEnd) + banner + html.slice(bodyOpenEnd);
    fs.writeFileSync(hubFile, html);
    console.log("Linked the toolkit in from one-dsd.html.");
  }
} else {
  console.log("one-dsd.html not found in this clone -- toolkit copied but not yet linked in. Link manually.");
}
