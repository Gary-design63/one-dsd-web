// Adds a generic, clearly-labeled, non-functional "connect your own tools" preview
// page to an offline clone, built from an already-captured page's own chrome
// (nav, header, footer, CSS links) so it matches the live look exactly with no
// separate stylesheet. Also adds one link to it from the "My View" page's
// primary navigation area, or the home page if "My View" wasn't captured.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
if (!OUT) { console.error("usage: node add-connect-tools-page.mjs <outDir>"); process.exit(1); }

const templateCandidates = ["my-view.html", "start.html", "index.html"];
const templateFile = templateCandidates.find((f) => fs.existsSync(path.join(OUT, f)));
if (!templateFile) { console.error("No template page found (tried my-view/start/index)."); process.exit(1); }
const templateHtml = fs.readFileSync(path.join(OUT, templateFile), "utf8");

const bodyOpen = templateHtml.indexOf("<body");
const bodyOpenEnd = templateHtml.indexOf(">", bodyOpen) + 1;
const head = templateHtml.slice(0, bodyOpenEnd);

// Find the primary navigation block so the new page keeps the same nav/header, then
// swap everything after it for placeholder content, keeping the same footer if we can
// find where the footer begins (look for the "One DHS People, Access and Culture Program"
// footer heading pattern used across the site).
const navEnd = templateHtml.indexOf("</nav>");
const chromeHead = navEnd >= 0 ? templateHtml.slice(0, navEnd + "</nav>".length) : head;
const footerStart = templateHtml.search(/<footer\b/);
const chromeFoot = footerStart >= 0 ? templateHtml.slice(footerStart) : "</body></html>";

const CONTENT = `
<div class="wrap max-w-5xl" style="padding:40px 16px">
  <p style="text-transform:uppercase;font-weight:700;font-size:12px;letter-spacing:.04em;color:#5A5A57;margin:0 0 8px">Coming later &middot; Preview only</p>
  <h1 style="font-size:2rem;font-weight:800;color:#002544;margin:0 0 16px">Connect your own tools</h1>
  <p style="font-size:1.05rem;max-width:60ch;margin:0 0 28px">
    A future, optional way to link everyday tools you already use &mdash; a calendar, a document workspace,
    an AI assistant &mdash; so parts of this program can work faster for you personally. Nothing is
    connected today, and nothing here does anything yet.
  </p>

  <div style="display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:32px">
    ${["Calendar and scheduling", "Document and notes workspace", "An AI assistant you already use"].map((title) => `
    <div style="border:1px solid #DDDDD9;border-radius:12px;padding:18px;background:#F5F5F3">
      <p style="font-weight:700;color:#002544;margin:0 0 6px">${title}</p>
      <p style="font-size:13px;color:#5A5A57;margin:0 0 14px">Preview only. No connection exists yet.</p>
      <span style="display:inline-block;font-size:12px;font-weight:700;color:#5A5A57;border:1px solid #C9C9C4;border-radius:999px;padding:4px 12px;cursor:default">Not yet available</span>
    </div>`).join("")}
  </div>

  <div style="border-left:3px solid #003865;padding:8px 0 8px 18px;margin-bottom:28px">
    <p style="font-weight:700;color:#002544;margin:0 0 6px">What this would be</p>
    <p style="margin:0 0 12px;max-width:60ch">Connecting a tool would always be your own choice, made by you, for your own account. No one else's access changes because of what you connect, and the program works fully today without connecting anything.</p>
    <p style="font-weight:700;color:#002544;margin:0 0 6px">What this is not</p>
    <p style="margin:0;max-width:60ch">Not a data pipeline to any DHS or state system, not required, and not active. This page previews an idea for later &mdash; it is not a working feature, in this offline copy or in the live program yet.</p>
  </div>

  <p style="font-size:14px;color:#5A5A57">Have a thought on what would help here? Share it through <a href="support.html">Support</a>.</p>
</div>
`;

const html = chromeHead + CONTENT + chromeFoot;
fs.writeFileSync(path.join(OUT, "connect-your-tools.html"), html);
console.log(`Wrote connect-your-tools.html (chrome borrowed from ${templateFile}).`);

// Link it from the template page's own footer "Find your next step" column if present,
// else leave it reachable only by direct file (still a valid, findable deliverable page).
for (const target of templateCandidates) {
  const p = path.join(OUT, target);
  if (!fs.existsSync(p)) continue;
  let html2 = fs.readFileSync(p, "utf8");
  if (html2.includes("connect-your-tools.html")) continue;
  const marker = /(<p class="kicker">Find your next step<\/p><ul[^>]*>)/;
  if (marker.test(html2)) {
    html2 = html2.replace(marker, `$1<li><a href="connect-your-tools.html">Connect your own tools (preview)</a></li>`);
    fs.writeFileSync(p, html2);
    console.log(`Linked connect-your-tools.html from ${target}.`);
  }
}
