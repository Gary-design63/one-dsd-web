import { spawnSync } from "node:child_process";
import { ensureHostedSemanticModel } from "./ensure-hosted-semantic-model.mjs";
import { verifyDownloadTrace } from "./verify-download-trace.mjs";
import { verifySemanticTrace } from "./verify-semantic-trace.mjs";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function run(script, args = []) {
  const result = spawnSync(npm, ["run", script, ...args], {
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const vercelEnvironment = process.env.VERCEL_ENV?.trim();
const knownVercelEnvironments = new Set(["development", "preview", "production"]);

if (process.env.VERCEL === "1" && (!vercelEnvironment || !knownVercelEnvironments.has(vercelEnvironment))) {
  throw new Error("Vercel did not provide a recognized VERCEL_ENV; refusing to select a weaker build gate.");
}

if (vercelEnvironment === "production") {
  run("verify:environment:production");
} else if (vercelEnvironment === "preview") {
  const result = spawnSync(process.execPath, ["scripts/verify-environment.mjs", "--mode", "preview"], {
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const semanticModel = await ensureHostedSemanticModel();
console.log(`Pinned local search model: ${semanticModel.status}; SHA-256 verified.`);

// Hosted validation complements the separately recorded full local/CI suite.
// In particular, this builder does not claim to run local PostgreSQL servers.
for (const script of ["verify:environment", "verify:sources", "typecheck", "lint"]) run(script);
console.log("Hosted validation: local PostgreSQL suites are verified in the separate full local/CI stage; see vitest.hosted.config.mts for the exact list.");
run("test", ["--", "--config", "vitest.hosted.config.mts"]);
run("build");
// Confirms the owner evals function, not closed staff Ask, still packages local-semantic.
console.log(JSON.stringify(await verifySemanticTrace(), null, 2));
console.log(JSON.stringify(await verifyDownloadTrace(), null, 2));
