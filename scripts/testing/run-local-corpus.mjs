import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const vitest = resolve(root, "node_modules/vitest/vitest.mjs");
const result = spawnSync(process.execPath, [vitest, "run"], {
  cwd: root,
  env: {
    ...process.env,
    PAC_REQUIRE_LOCAL_CORPUS: "1",
  },
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
