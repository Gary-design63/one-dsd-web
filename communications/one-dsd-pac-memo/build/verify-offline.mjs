import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHECKOUT = path.resolve(HERE, "..", "..", "..");
const ROOTS = [CHECKOUT, process.cwd(), path.resolve(CHECKOUT, ".."), ...(process.argv[3] ? [process.argv[3]] : [])];
const from = (root) => createRequire(path.join(root, "package.json"));
let chromium;
for (const root of ROOTS) { try { ({ chromium } = from(root)("playwright")); break; } catch { /* next */ } }
if (!chromium) throw new Error(`could not find playwright in any of: ${ROOTS.join(", ")}`);

const DIR = process.argv[2];
const BROWSER = process.env.CLONE_BROWSER;
const b = await chromium.launch({ executablePath: BROWSER });
const ctx = await b.newContext();
const page = await ctx.newPage();

const externalRequests = [];
page.on("request", (req) => {
  if (!req.url().startsWith("file://")) externalRequests.push(req.url());
});
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e)));

const fileUrl = "file://" + path.resolve(DIR, "podcasts/equity-toolkit.html");
await page.goto(fileUrl, { waitUntil: "load" });
await page.screenshot({ path: path.join(DIR, "_verify-podcast.png"), fullPage: true });

const audioInfo = await page.evaluate(() => {
  const audio = document.querySelector("audio");
  if (!audio) return null;
  return { src: audio.getAttribute("src"), readyState: audio.readyState, error: audio.error };
});

console.log("External (non-file://) requests made:", externalRequests.length, externalRequests.slice(0, 10));
console.log("Page errors:", consoleErrors);
console.log("Audio element:", audioInfo);

// Confirm the audio file itself is reachable and has real byte content via direct fetch of the local file.
const audioPage = await ctx.newPage();
const audioFileUrl = new URL(audioInfo.src, fileUrl).href;
const resp = await audioPage.goto(audioFileUrl);
console.log("Audio file direct load status:", resp?.status(), "content-length header:", resp?.headers()["content-length"]);

await b.close();
