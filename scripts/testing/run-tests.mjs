import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const contract = JSON.parse(readFileSync(new URL("../../config/environment-contract.json", import.meta.url), "utf8"));
const contractNames = new Set([
  ...contract.settings.map(setting => setting.name.toUpperCase()),
  ...contract.forbidden_client_settings.map(name => name.toUpperCase()),
]);
const localTestSettings = new Set(["PAC_TEST_POSTGRES_BIN", "PAC_REQUIRE_LOCAL_CORPUS", "PAC_CATALOG_PATH"]);
// These operating-system paths are needed by child processes, even when a
// feature's environment contract also documents them. They are not switches.
const childProcessPaths = new Set(["PATH", "SYSTEMROOT", "TEMP"]);
const externalConfiguration = /^(?:OPENAI_|ANTHROPIC_|PERPLEXITY_|AZURE_OPENAI_|SUPABASE_|NEXT_PUBLIC_SUPABASE_|POSTGRES_|REDIS_|UPSTASH_|AI_GATEWAY_)/;
const externalCredentials = /(?:_API_KEY|_SECRET|_TOKEN|_PASSWORD)$/;

/**
 * Keep deployment credentials and feature switches out of unit-test workers.
 * @param {Record<string, string | undefined>} parent
 */
export function isolatedTestEnvironment(parent = process.env) {
  const entries = Object.entries(parent);
  const normalizedParent = new Map(entries.map(([name, value]) => [name.toUpperCase(), value]));
  const deployed = normalizedParent.get("VERCEL") === "1"
    || ["preview", "production"].includes(normalizedParent.get("VERCEL_ENV"));
  const environment = {};
  for (const [name, value] of entries) {
    const key = name.toUpperCase();
    if (value === undefined) continue;
    if (childProcessPaths.has(key)) {
      for (const retained of Object.keys(environment)) {
        if (retained.toUpperCase() === key) delete environment[retained];
      }
      environment[name] = value;
      continue;
    }
    if (contractNames.has(key) || key.startsWith("PAC_") || key.startsWith("VERCEL")
      || key.startsWith("NEXT_PUBLIC_PAC_") || externalConfiguration.test(key)
      || externalCredentials.test(key) || key === "DATABASE_URL" || key === "NODE_OPTIONS") continue;
    environment[name] = value;
  }
  if (!deployed) {
    for (const name of localTestSettings) {
      const value = normalizedParent.get(name);
      if (value !== undefined) environment[name] = value;
    }
  }
  environment.NODE_ENV = "test";
  return environment;
}

/**
 * This child process cannot mutate the environment of the build that starts it.
 * @param {string[]} args
 * @param {Record<string, string | undefined>} parent
 * @param {(executable: string, args: string[], options: import("node:child_process").SpawnSyncOptions) => { status: number | null, error?: Error }} spawn
 */
export function runTests(args = process.argv.slice(2), parent = process.env, spawn = spawnSync) {
  const result = spawn(process.execPath, [path.join(root, "node_modules/vitest/vitest.mjs"), "run", ...args], {
    cwd: root,
    env: isolatedTestEnvironment(parent),
    stdio: "inherit",
    windowsHide: true,
    shell: false,
  });
  if (result.error) {
    console.error("The isolated test runner could not start.");
    return 1;
  }
  return result.status ?? 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runTests();
}
