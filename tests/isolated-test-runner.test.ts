import { readFileSync } from "node:fs";
import type { SpawnSyncOptions } from "node:child_process";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { isolatedTestEnvironment, runTests } from "../scripts/testing/run-tests.mjs";

const root = path.resolve(import.meta.dirname, "..");
const contract = JSON.parse(readFileSync(path.join(root, "config/environment-contract.json"), "utf8")) as {
  settings: Array<{ name: string }>;
  forbidden_client_settings: string[];
};

describe("isolated test runner", () => {
  it("removes every deployment contract setting and secret alias from the child", () => {
    const parent: Record<string, string | undefined> = {
      ...Object.fromEntries(contract.settings.map(({ name }) => [name, "synthetic-only"])),
      ...Object.fromEntries(contract.forbidden_client_settings.map(name => [name, "synthetic-only"])),
      VERCEL: "1", VERCEL_ENV: "production", VERCEL_OIDC_TOKEN: "synthetic-only",
      PAC_UNREGISTERED_SWITCH: "on", PAC_UNREGISTERED_DATABASE_URL: "postgresql://invalid.example/test",
      OPENAI_ORG_ID: "synthetic-only", AI_GATEWAY_API_KEY: "synthetic-only",
      DATABASE_URL: "postgresql://invalid.example/test", SUPABASE_SERVICE_ROLE_KEY: "synthetic-only",
      GITHUB_TOKEN: "synthetic-only", AUTH_SECRET: "synthetic-only", NODE_OPTIONS: "--require ./deployment-preload.cjs",
      PATH: "/test/node", SystemRoot: "C:\\Windows", TEMP: "C:\\Temp", CI: "1",
    };
    const original = { ...parent };
    expect(isolatedTestEnvironment(parent)).toEqual({ PATH: "/test/node", SystemRoot: "C:\\Windows", TEMP: "C:\\Temp", CI: "1", NODE_ENV: "test" });
    expect(parent).toEqual(original);
  });

  it("retains only the three explicit local test paths and flags outside deployment", () => {
    const parent = {
      PAC_TEST_POSTGRES_BIN: "C:\\PostgreSQL\\bin",
      PAC_REQUIRE_LOCAL_CORPUS: "1",
      PAC_CATALOG_PATH: "C:\\fixtures\\catalog.jsonl",
      PAC_STORE: "postgres",
      PAC_RUNTIME_DATABASE_URL: "postgresql://invalid.example/test",
      PAC_RESEARCH_FIXTURE: "on",
    };
    expect(isolatedTestEnvironment(parent)).toEqual({
      PAC_TEST_POSTGRES_BIN: parent.PAC_TEST_POSTGRES_BIN,
      PAC_REQUIRE_LOCAL_CORPUS: "1", PAC_CATALOG_PATH: parent.PAC_CATALOG_PATH, NODE_ENV: "test",
    });
    expect(isolatedTestEnvironment({ ...parent, VERCEL: "1" })).toEqual({ NODE_ENV: "test" });
    expect(isolatedTestEnvironment({ ...parent, VERCEL_ENV: "preview" })).toEqual({ NODE_ENV: "test" });
  });

  it("matches environment names without case-based escapes on Windows", () => {
    expect(isolatedTestEnvironment({ vercel: "1", pac_owner_key: "synthetic-only", openai_api_key: "synthetic-only", Node_Env: "production", Path: "C:\\Node" })).toEqual({ Path: "C:\\Node", NODE_ENV: "test" });
  });

  it("spawns the Node vitest entry directly without a shell and forwards test arguments", () => {
    const spawn = vi.fn<(executable: string, args: string[], options: SpawnSyncOptions) => { status: number; error: undefined }>(() => ({ status: 7, error: undefined }));
    const parent = { VERCEL: "1", PAC_OWNER_KEY: "synthetic-only", PATH: "/test/node" };
    expect(runTests(["tests/owner-auth-security.test.ts", "--silent"], parent, spawn)).toBe(7);
    const [executable, args, options] = spawn.mock.calls[0];
    expect(executable).toBe(process.execPath);
    expect(args).toEqual([path.join(root, "node_modules/vitest/vitest.mjs"), "run", "tests/owner-auth-security.test.ts", "--silent"]);
    expect(options).toMatchObject({ cwd: root + path.sep, shell: false, windowsHide: true, stdio: "inherit", env: { PATH: "/test/node", NODE_ENV: "test" } });
    expect(parent.PAC_OWNER_KEY).toBe("synthetic-only");
  });

  it("keeps the production environment gate and build command separate from test isolation", () => {
    const packageDocument = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    const build = readFileSync(path.join(root, "scripts/vercel-build.mjs"), "utf8");
    expect(packageDocument.scripts.test).toBe("node scripts/testing/run-tests.mjs");
    expect(build).toContain('run("verify:environment:production")');
    expect(build).toContain('run("test", ["--", "--config", "vitest.hosted.config.mts"])');
    expect(build).toContain('run("build")');
    expect(packageDocument.scripts["verify:ci"]).toContain("npm run test");
    expect(build).toContain("env: process.env");
    expect(build).not.toContain("isolatedTestEnvironment");
  });
});
