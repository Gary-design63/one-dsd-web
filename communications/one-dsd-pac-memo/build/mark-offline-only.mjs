// Adds a small, consistent notice to pages whose core feature needs the live
// program (a real backend, sign-in, or write access) and is therefore inert
// in this offline copy: ASK's question form, the interactive Equity Analysis
// Toolkit walkthrough, and the contributor workspace. Everything else on
// these pages (the descriptive content, the toolkit companion, the links)
// still works exactly as captured -- this only adds one explanatory banner.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
if (!OUT) { console.error("usage: node mark-offline-only.mjs <outDir>"); process.exit(1); }

const TARGETS = [
  { file: "ask.html", text: "The question form below needs the live program to answer. This offline copy can't send or receive questions." },
  { file: "equity-policy/analysis.html", text: "The step-by-step “Start” walkthrough below needs the live program to save your work. To read every step offline, use the toolkit companion linked at right." },
  { file: "contribute.html", text: "The contributor workspace needs the live program to sign in, save, and publish. This offline copy is read-only." },
  { file: "contribute/accept.html", text: "The contributor workspace needs the live program to sign in, save, and publish. This offline copy is read-only." },
  { file: "contribute/access.html", text: "The contributor workspace needs the live program to sign in, save, and publish. This offline copy is read-only." },
  { file: "contribute/resources.html", text: "The contributor workspace needs the live program to sign in, save, and publish. This offline copy is read-only." },
];

const banner = (text) =>
  `<div style="margin:0;padding:10px 16px;background:#F5F0E1;border-bottom:1px solid #D9CDA6;color:#5A4A1F;font:600 13px/1.4 system-ui,sans-serif;text-align:center">` +
  `Offline copy — ${text}</div>`;

let applied = 0;
for (const { file, text } of TARGETS) {
  const p = path.join(OUT, file);
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, "utf8");
  if (html.includes("Offline copy —")) continue; // already applied
  html = html.replace(/(<body[^>]*>)/, `$1${banner(text)}`);
  fs.writeFileSync(p, html);
  applied++;
}
console.log(`Applied offline-only banners to ${applied}/${TARGETS.length} matched pages.`);
