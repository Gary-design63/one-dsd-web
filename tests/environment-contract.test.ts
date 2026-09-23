import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const script = path.resolve(root, "scripts/verify-environment.mjs");
const contract = JSON.parse(readFileSync(path.resolve(root, "config/environment-contract.json"), "utf8")) as {
  settings: Array<{ name: string }>;
};
const contractNames = contract.settings.map((setting) => setting.name);

function run(
  overrides: Record<string, string | undefined> = {},
  mode: "clean-clone" | "preview" | "production" = "clean-clone",
) {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const name of contractNames) delete env[name];
  Object.assign(env, overrides);
  return spawnSync(process.execPath, [script, "--mode", mode], {
    cwd: root,
    encoding: "utf8",
    env,
  });
}

const STRONG_OWNER_SECRET = "owner-7RkP2vN9qL4sX8mC6dF3wH5jT1zB";
const STRONG_RATE_SECRET = "rate-2Ht8Lm4Qx9Vk6Ns1Jw5Bc7Pf3YrD";
const STRONG_CRON_SECRET = "cron-4Mz8Qp1Yt6Vn3Ks9Hd2Wc7Fx5JrL";

describe("environment activation contract", { timeout: 30_000 }, () => {
  it("accepts a secret-free clean clone", () => {
    const result = run({
      PAC_STORE: "memory",
      PAC_CONTENT_SOURCE: "static",
      PAC_STAFF_SCOPE: "one-dhs",
    });
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ ok: true, mode: "clean-clone" });
  });

  it("fails closed when protected combinations are incomplete", () => {
    expect(run({ PAC_STORE: "postgres", PAC_CONTENT_SOURCE: "static" }).status).not.toBe(0);
    expect(run({ PAC_STORE: "memory", PAC_CONSULTATION_INTAKE_ENABLED: "on" }).status).not.toBe(0);
    expect(run({ PAC_GENERATIVE_PILOT: "on" }).status).not.toBe(0);
    expect(run({
      PAC_RESEARCH_ENABLED: "on",
      PAC_RESEARCH_KILL_SWITCH: "off",
      PAC_RESEARCH_MONTHLY_USD_CAP: "0",
    }).status).not.toBe(0);
  });

  it("rejects malformed PostgreSQL settings before build or connection", () => {
    expect(run({
      PAC_STORE: "postgres",
      PAC_CONTENT_SOURCE: "static",
      PAC_RUNTIME_DATABASE_URL: "not-a-postgresql-url",
    }).status).not.toBe(0);
    expect(run({
      PAC_STORE: "postgres",
      PAC_CONTENT_SOURCE: "static",
      PAC_RUNTIME_DATABASE_URL: "https://database.example.test/pac",
    }).status).not.toBe(0);
    expect(run({
      PAC_STORE: "postgres",
      PAC_CONTENT_SOURCE: "static",
      PAC_RUNTIME_DATABASE_URL: "postgresql://runtime:secret@database.example.test/pac",
      PAC_RUNTIME_DATABASE_SSL: "sometimes",
    }).status).not.toBe(0);
  });

  it("rejects historical static content and local fixtures in production", () => {
    const base = {
      PAC_DATA_ENV: "production",
      PAC_OWNER_KEY: STRONG_OWNER_SECRET,
      PAC_RATE_LIMIT_SECRET: STRONG_RATE_SECRET,
      PAC_STORE: "postgres",
      PAC_RUNTIME_DATABASE_URL: "postgresql://runtime:test@example.test/pac",
      CRON_SECRET: STRONG_CRON_SECRET,
    };
    expect(run({ ...base, PAC_CONTENT_SOURCE: "static" }, "production").status).not.toBe(0);
    expect(run({
      ...base,
      PAC_CONTENT_SOURCE: "postgres",
      PAC_CATALOG_PATH: "C:\\private\\catalog.jsonl",
    }, "production").status).not.toBe(0);
  });

  it("accepts a complete production-safe configuration with protected features off", () => {
    const result = run({
      PAC_DATA_ENV: "production",
      PAC_OWNER_KEY: STRONG_OWNER_SECRET,
      PAC_RATE_LIMIT_SECRET: STRONG_RATE_SECRET,
      PAC_STORE: "postgres",
      PAC_RUNTIME_DATABASE_URL: "postgresql://runtime:test@example.test/pac",
      PAC_CONTENT_SOURCE: "postgres",
      PAC_STAFF_SCOPE: "one-dhs",
      PAC_CONSULTATION_INTAKE_ENABLED: "off",
      PAC_GENERATIVE_PILOT: "off",
      PAC_RESEARCH_ENABLED: "off",
      PAC_RESEARCH_KILL_SWITCH: "on",
      CRON_SECRET: STRONG_CRON_SECRET,
    }, "production");
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ ok: true, mode: "production" });
  });

  it("requires strong, distinct production secrets", () => {
    const base = {
      PAC_DATA_ENV: "production",
      PAC_STORE: "postgres",
      PAC_RUNTIME_DATABASE_URL: "postgresql://runtime:test@example.test/pac",
      PAC_CONTENT_SOURCE: "postgres",
      PAC_OWNER_KEY: STRONG_OWNER_SECRET,
      PAC_RATE_LIMIT_SECRET: STRONG_RATE_SECRET,
      CRON_SECRET: STRONG_CRON_SECRET,
    };
    expect(run({ ...base, PAC_OWNER_KEY: "short" }, "production").status).not.toBe(0);
    expect(run({ ...base, CRON_SECRET: STRONG_OWNER_SECRET }, "production").status).not.toBe(0);
    expect(run({ ...base, PAC_RATE_LIMIT_SECRET: STRONG_OWNER_SECRET }, "production").status).not.toBe(0);
  });

  it("rejects a weak tracking secret in production while new intake is off", () => {
    const base = {
      PAC_DATA_ENV: "production",
      PAC_STORE: "postgres",
      PAC_RUNTIME_DATABASE_URL: "postgresql://runtime:test@example.test/pac",
      PAC_CONTENT_SOURCE: "postgres",
      PAC_OWNER_KEY: STRONG_OWNER_SECRET,
      PAC_RATE_LIMIT_SECRET: STRONG_RATE_SECRET,
      CRON_SECRET: STRONG_CRON_SECRET,
      PAC_CONSULTATION_INTAKE_ENABLED: "off",
    };
    const weakConfigured = run({
      ...base,
      PAC_CONSULTATION_TRACKING_SECRET: "x".repeat(64),
    }, "production");
    expect(weakConfigured.status).not.toBe(0);
    expect(weakConfigured.stderr).toContain("does not have enough variation");

    const selectedWithoutSecret = run({
      ...base,
      PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID: "dsd-consultation-activation-pending-v1",
    }, "production");
    expect(selectedWithoutSecret.status).not.toBe(0);
    expect(selectedWithoutSecret.stderr).toContain("PAC_CONSULTATION_TRACKING_SECRET is required");
  });

  it("keeps Vercel Preview on a separately labeled data boundary", () => {
    const safe = run({
      PAC_DATA_ENV: "preview",
      PAC_RATE_LIMIT_SECRET: STRONG_RATE_SECRET,
      PAC_STORE: "memory",
      PAC_CONTENT_SOURCE: "static",
      PAC_STAFF_SCOPE: "one-dhs",
    }, "preview");
    expect(safe.status, safe.stderr).toBe(0);
    expect(JSON.parse(safe.stdout)).toMatchObject({ ok: true, mode: "preview" });
    expect(run({
      PAC_DATA_ENV: "production",
      PAC_STORE: "memory",
      PAC_CONTENT_SOURCE: "static",
    }, "preview").status).not.toBe(0);
  });

  it("makes the Vercel production build invoke the production environment gate", () => {
    const vercel = JSON.parse(readFileSync(path.resolve(root, "vercel.json"), "utf8"));
    const packageDocument = JSON.parse(readFileSync(path.resolve(root, "package.json"), "utf8"));
    const buildScript = readFileSync(path.resolve(root, "scripts/vercel-build.mjs"), "utf8");
    expect(vercel.installCommand).toBe("ONNXRUNTIME_NODE_INSTALL=skip npx --yes npm@11.9.0 ci");
    expect(vercel.buildCommand).toBe("npx --yes npm@11.9.0 run build:vercel");
    expect(packageDocument.scripts["build:vercel"]).toBe("node scripts/vercel-build.mjs");
    expect(buildScript).toContain('process.env.VERCEL === "1"');
    expect(buildScript).toContain('vercelEnvironment === "production"');
    expect(buildScript).toContain('run("verify:environment:production")');
    expect(buildScript).toContain('"--mode", "preview"');
    expect(buildScript).toContain('run("test", ["--", "--config", "vitest.hosted.config.mts"])');
    expect(buildScript).toContain('run("build")');
    expect(packageDocument.scripts["verify:ci"]).toContain("npm run test");
  });

  it("refuses to build on Vercel when its environment is missing", () => {
    const env: NodeJS.ProcessEnv = { ...process.env, VERCEL: "1" };
    delete env.VERCEL_ENV;
    const result = spawnSync(process.execPath, [path.resolve(root, "scripts/vercel-build.mjs")], {
      cwd: root,
      encoding: "utf8",
      env,
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("refusing to select a weaker build gate");
  });
});
