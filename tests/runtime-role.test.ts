import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  PAC_RUNTIME_ROLE,
  buildRuntimeDatabaseUrl,
  upsertEnvSetting,
  writeRuntimeDatabaseSetting,
} from "@/scripts/db/runtime-role-lib.mjs";

describe("restricted PostgreSQL runtime provisioning helpers", () => {
  it("derives the direct runtime login without retaining owner credentials", () => {
    const runtime = new URL(
      buildRuntimeDatabaseUrl(
        "postgresql://database_owner:owner-secret@database.example.test:5432/pac?sslmode=require",
        "generated-runtime-secret",
      ),
    );
    expect(runtime.username).toBe(PAC_RUNTIME_ROLE);
    expect(runtime.password).toBe("generated-runtime-secret");
    expect(runtime.password).not.toBe("owner-secret");
    expect(runtime.pathname).toBe("/pac");
    expect(runtime.searchParams.get("sslmode")).toBe("require");
  });

  it("preserves the project suffix required by a pooled Supabase connection", () => {
    const runtime = new URL(
      buildRuntimeDatabaseUrl(
        "postgresql://postgres.projectref:owner-secret@pooler.example.test:6543/postgres",
        "generated-runtime-secret",
      ),
    );
    expect(runtime.username).toBe(PAC_RUNTIME_ROLE + ".projectref");
  });

  it("replaces duplicate runtime settings without disturbing the rest of the ignored file", () => {
    const updated = upsertEnvSetting(
      "PAC_STORE=postgres\nPAC_RUNTIME_DATABASE_URL=old\nPAC_OWNER_KEY=kept\nPAC_RUNTIME_DATABASE_URL=duplicate\n",
      "PAC_RUNTIME_DATABASE_URL",
      "postgresql://restricted.example.test/pac",
    );
    expect(updated).toBe(
      "PAC_STORE=postgres\nPAC_RUNTIME_DATABASE_URL=postgresql://restricted.example.test/pac\nPAC_OWNER_KEY=kept\n",
    );
  });
  it("writes only the restricted setting to an ignored local environment file", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "pac-runtime-role-test-"));
    try {
      await writeFile(path.join(root, ".gitignore"), ".env*\n!.env.example\n", "utf8");
      await writeFile(
        path.join(root, ".env.local"),
        "PAC_DATABASE_URL=postgresql://owner:owner-secret@example.test/pac\nPAC_RUNTIME_DATABASE_URL=old\n",
        "utf8",
      );
      const runtimeUrl = "postgresql://pac_app_runtime:generated-runtime-secret@example.test/pac";
      const result = await writeRuntimeDatabaseSetting(root, runtimeUrl);
      const persisted = await readFile(path.join(root, ".env.local"), "utf8");

      expect(result).toBe(".env.local");
      expect(persisted).toContain("PAC_DATABASE_URL=postgresql://owner:owner-secret@example.test/pac");
      expect(persisted).toContain(`PAC_RUNTIME_DATABASE_URL=${runtimeUrl}`);
      expect(persisted.match(/^PAC_RUNTIME_DATABASE_URL=/gm)).toHaveLength(1);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});