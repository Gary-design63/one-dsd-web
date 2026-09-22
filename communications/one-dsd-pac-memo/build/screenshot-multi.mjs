import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const ROOTS = ["/home/user/pac-app", process.cwd(), "/home/user/one-dhs-equity-resource"];
const from = (root) => createRequire(path.join(root, "package.json"));
let chromium;
for (const root of ROOTS) { try { ({ chromium } = from(root)("playwright")); break; } catch {} }
const DIR = process.argv[2];
const pairs = process.argv.slice(3);
const b = await chromium.launch({ executablePath: process.env.CLONE_BROWSER });
const page = await (await b.newContext()).newPage();
for (let i = 0; i < pairs.length; i += 2) {
  await page.goto("file://" + path.resolve(DIR, pairs[i]), { waitUntil: "load" });
  await page.screenshot({ path: pairs[i+1], fullPage: true });
  console.log("shot", pairs[i], "->", pairs[i+1]);
}
await b.close();
