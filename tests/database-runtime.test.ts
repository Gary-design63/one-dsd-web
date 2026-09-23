import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  clearStoreForTests,
  getStore,
  resetStoreForTests,
  storeIsPersistent,
} from "@/lib/intelligence/memory/store";

const ROOT = path.resolve(__dirname, "..");
const ORIGINAL = {
  PAC_STORE: process.env.PAC_STORE,
  PAC_DATABASE_URL: process.env.PAC_DATABASE_URL,
  PAC_RUNTIME_DATABASE_URL: process.env.PAC_RUNTIME_DATABASE_URL,
  PAC_DATABASE_SSL: process.env.PAC_DATABASE_SSL,
  PAC_RUNTIME_DATABASE_SSL: process.env.PAC_RUNTIME_DATABASE_SSL,
};

function restore(name: keyof typeof ORIGINAL): void {
  const value = ORIGINAL[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function walk(directory: string): string[] {
  const files: string[] = [];
  for (const name of readdirSync(directory)) {
    const candidate = path.join(directory, name);
    if (statSync(candidate).isDirectory()) files.push(...walk(candidate));
    else if (/\.[cm]?[jt]sx?$/.test(name)) files.push(candidate);
  }
  return files;
}

describe("runtime store selection", () => {
  beforeEach(async () => {
    await clearStoreForTests();
    delete process.env.PAC_DATABASE_URL;
    delete process.env.PAC_RUNTIME_DATABASE_URL;
    delete process.env.PAC_DATABASE_SSL;
    delete process.env.PAC_RUNTIME_DATABASE_SSL;
  });

  afterEach(async () => {
    await clearStoreForTests();
    restore("PAC_STORE");
    restore("PAC_DATABASE_URL");
    restore("PAC_RUNTIME_DATABASE_URL");
    restore("PAC_DATABASE_SSL");
    restore("PAC_RUNTIME_DATABASE_SSL");
    resetStoreForTests();
  });

  it("keeps the explicit memory store available for tests and temporary runs", () => {
    process.env.PAC_STORE = "memory";
    const store = getStore();
    expect(store.backend).toBe("memory");
    expect(storeIsPersistent(store)).toBe(false);
  });

  it("does not silently fall back when PostgreSQL is selected without its server setting", () => {
    process.env.PAC_STORE = "postgres";
    process.env.PAC_DATABASE_URL = "postgresql://database_owner@127.0.0.1:1/pac_test";
    expect(() => getStore()).toThrow("PAC_STORE=postgres requires the restricted, server-only PAC_RUNTIME_DATABASE_URL setting.");
  });

  it("rejects invalid PostgreSQL connection settings before opening a connection", () => {
    process.env.PAC_STORE = "postgres";
    process.env.PAC_RUNTIME_DATABASE_URL = "not-a-connection-string";
    expect(() => getStore()).toThrow("PAC_RUNTIME_DATABASE_URL must be a valid PostgreSQL connection string.");
  });

  it("selects durable PostgreSQL storage without connecting at module load or build time", async () => {
    process.env.PAC_STORE = "postgres";
    process.env.PAC_RUNTIME_DATABASE_URL = "postgresql://pac_app_runtime@127.0.0.1:1/pac_test";
    process.env.PAC_RUNTIME_DATABASE_SSL = "disable";
    const store = getStore();
    expect(store.backend).toBe("postgres");
    expect(storeIsPersistent(store)).toBe(true);
    await clearStoreForTests();
  });

  it("rejects unknown store modes instead of treating them as memory", () => {
    process.env.PAC_STORE = "temporary-maybe";
    expect(() => getStore()).toThrow("Unsupported PAC_STORE value");
  });
});

describe("database browser boundary", () => {
  it("keeps the database connection setting server-only", () => {
    const example = readFileSync(path.join(ROOT, ".env.example"), "utf8");
    const storeSource = readFileSync(path.join(ROOT, "lib", "intelligence", "memory", "store.ts"), "utf8");
    const postgresSource = readFileSync(path.join(ROOT, "lib", "intelligence", "memory", "postgres-store.ts"), "utf8");
    const nextConfig = readFileSync(path.join(ROOT, "next.config.ts"), "utf8");

    expect(example).toMatch(/^PAC_DATABASE_URL=\s*$/m);
    expect(example).toMatch(/^PAC_RUNTIME_DATABASE_URL=\s*$/m);
    expect(example).toMatch(/^PAC_RUNTIME_DATABASE_SSL=\s*$/m);
    expect(example).not.toContain("NEXT_PUBLIC_PAC_DATABASE_URL");
    expect(example).not.toContain("NEXT_PUBLIC_PAC_RUNTIME_DATABASE_URL");
    expect(example).not.toContain("NEXT_PUBLIC_PAC_RUNTIME_DATABASE_SSL");
    expect(storeSource).toContain('import "server-only"');
    expect(postgresSource).toContain('import "server-only"');
    expect(nextConfig).not.toContain("PAC_DATABASE_URL");
    expect(nextConfig).not.toContain("PAC_RUNTIME_DATABASE_URL");

    const browserDirectories = [path.join(ROOT, "app"), path.join(ROOT, "components")];
    const sourceFiles = browserDirectories.flatMap((directory) => (existsSync(directory) ? walk(directory) : []));
    // Server-only files that mention the setting name as human-readable help or log wording
    // (not as env access). Neither carries "use client": app/api/page-text/route.ts is a
    // route handler and app/consultant/activation/page.tsx is a server component, so the
    // string never reaches a browser bundle. Any env read of the setting is still forbidden
    // below, in every app/ and components/ file, allowlisted or not.
    const wordingOnlyAllowlist = new Set([
      path.join("app", "api", "page-text", "route.ts"),
      path.join("app", "consultant", "activation", "page.tsx"),
    ]);
    const directReferences = sourceFiles
      .filter((file) => readFileSync(file, "utf8").match(/PAC_(?:RUNTIME_)?DATABASE_URL/))
      .map((file) => path.relative(ROOT, file))
      .filter((file) => !wordingOnlyAllowlist.has(file));
    expect(directReferences).toEqual([]);

    const envReads = sourceFiles
      .filter((file) => /process\.env(?:\.|\[\s*["'])PAC_(?:RUNTIME_)?DATABASE_URL/.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(ROOT, file));
    expect(envReads).toEqual([]);

    const allowlistedClientFiles = [...wordingOnlyAllowlist]
      .filter((file) => existsSync(path.join(ROOT, file)))
      .filter((file) => /^\s*["']use client["'];/m.test(readFileSync(path.join(ROOT, file), "utf8")));
    expect(allowlistedClientFiles).toEqual([]);

    const clientImports = sourceFiles
      .filter((file) => /^\s*["']use client["'];/m.test(readFileSync(file, "utf8")))
      .filter((file) => /memory\/store|postgres-store/.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(ROOT, file));
    expect(clientImports).toEqual([]);
  });
});
describe("Supabase-compatible runtime role migration", () => {
  it("creates immutable privileges once and permits only role-setting alterations", () => {
    const migration = readFileSync(
      path.join(ROOT, "db", "migrations", "0002_pac_runtime_store.sql"),
      "utf8",
    );
    expect(migration).toMatch(/create role pac_app_runtime[\s\S]*?connection limit 20;/i);
    expect(migration).toContain("rolconnlimit between 1 and 20");
    expect(migration).toContain("pg_catalog.pg_auth_members");

    const alterations = [...migration.matchAll(/alter role pac_app_runtime\s+([^;]+);/gi)].map(
      (match) => match[1].trim().toLowerCase(),
    );
    expect(alterations.length).toBeGreaterThan(0);
    expect(alterations.every((statement) => statement.startsWith("set "))).toBe(true);
  });
});