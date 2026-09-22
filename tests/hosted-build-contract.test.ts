import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const hosted = readFileSync(path.join(root, "vitest.hosted.config.mts"), "utf8");
const excluded = JSON.parse(hosted.match(/LOCAL_POSTGRES_SUITES = (\[[\s\S]*?\]) as const;/)![1]) as string[];

describe("explicit hosted and local verification stages", () => {
  it("excludes exactly the suites that start or restore a local PostgreSQL server", () => {
    const actual = readdirSync(path.join(root, "tests"))
      .filter(name => /\.test\.tsx?$/.test(name) && name !== "hosted-build-contract.test.ts")
      .filter(name => /\b(?:initdb|pg_ctl|pg_dump|pg_restore)\b/.test(readFileSync(path.join(root, "tests", name), "utf8")))
      .map(name => "tests/" + name).sort();
    expect(excluded).toHaveLength(18);
    expect([...excluded].sort()).toEqual(actual);
    expect(new Set(excluded).size).toBe(excluded.length);
    expect(excluded.every(name => !name.includes("*"))).toBe(true);
    expect(readFileSync(path.join(root, "vitest.config.mts"), "utf8")).not.toContain("LOCAL_POSTGRES_SUITES");
    const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    expect(pkg.scripts["verify:ci"]).toContain("npm run test");
    expect(pkg.scripts.test).toBe("node scripts/testing/run-tests.mjs");
  });

  it("retains normal tests and gives native CPU cold-start time without relaxing assertions", () => {
    expect(hosted).toContain('import base from "./vitest.config.mjs"');
    expect(hosted).toContain("...configDefaults.exclude, ...LOCAL_POSTGRES_SUITES");
    expect(hosted).toContain("testTimeout: 30_000");
    expect(hosted).toContain("hookTimeout: 30_000");
    for (const name of ["tests/local-semantic-search.test.ts", "tests/ask-hybrid-retrieval.test.ts", "tests/semantic-corpus-latency.test.ts"])
      expect(excluded).not.toContain(name);
  });

  it("skips only the optional ONNX install download through the installed supported flag", () => {
    const config = JSON.parse(readFileSync(path.join(root, "vercel.json"), "utf8"));
    expect(config.installCommand).toBe("ONNXRUNTIME_NODE_INSTALL=skip npx --yes npm@11.9.0 ci");
    const result = spawnSync(process.execPath,
      ["-e", "console.log(require('./node_modules/onnxruntime-node/script/install-utils.js').parseInstallFlag())"],
      { cwd: root, encoding: "utf8", env: { ...process.env, ONNXRUNTIME_NODE_INSTALL: "skip" } });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.trim()).toBe("false");
    const localRuntime = readFileSync(path.join(root, "lib/intelligence/retrieval/local-semantic.ts"), "utf8");
    expect(localRuntime).toContain('device: "cpu"');
    expect(localRuntime).toContain("env.allowRemoteModels = false");
  });
});
