import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
describe("bounded runtime pool capacity", () => {
  it("adds a capacity-checked allowance without rewriting the original runtime role", () => {
    const original = readFileSync(path.join(root, "db/migrations/0002_pac_runtime_store.sql"), "utf8");
    const forward = readFileSync(path.join(root, "db/migrations/0028_pac_runtime_pool_capacity.sql"), "utf8");
    expect(original).toMatch(/connection limit 20/i);
    expect(forward).toContain("available_connections - 32 < 20");
    expect(forward).toContain("superuser_reserved_connections");
    expect(forward).toContain("alter role pac_app_runtime connection limit 32");
    expect(forward).toContain("not rolbypassrls");
    expect(forward).not.toMatch(/\bgrant\b|connection limit -1|disable row level security/i);
  });

  it("uses transaction pooling for the hosted runtime without changing the migration endpoint", () => {
    const settings = readFileSync(path.join(root, "scripts/deploy-production-settings.mjs"), "utf8");
    expect(settings).toContain('productionRuntimeUrl.port = "6543"');
    expect(settings).toContain('process.argv.includes("--transaction-pooler")');
    expect(settings).toContain("PAC_RUNTIME_DATABASE_URL: productionRuntimeUrl.toString()");
    expect(settings).not.toContain("PAC_DATABASE_URL:");
  });
});
