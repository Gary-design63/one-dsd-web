import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import base from "./vitest.config.mjs";

/** These exact suites run in the separate full local/CI PostgreSQL verification stage.
 * A Vercel build does not contain PostgreSQL server/backup executables. Exclusion
 * is reported as a different build stage, never as those database tests passing.
 */
export const LOCAL_POSTGRES_SUITES = [
  "tests/ask-records-postgres.integration.test.ts",
  "tests/consultation-cas-postgres.integration.test.ts",
  "tests/contributor-resource-postgres.integration.test.ts",
  "tests/data-trust-postgres.integration.test.ts",
  "tests/editable-surface-postgres.integration.test.ts",
  "tests/equity-analysis-postgres.integration.test.ts",
  "tests/named-identity-postgres.integration.test.ts",
  "tests/no-surveillance-postgres.integration.test.ts",
  "tests/owner-approved-surfaces.postgres.integration.test.ts",
  "tests/page-copy-full-chain.integration.test.ts",
  "tests/page-copy-owner-save.postgres.integration.test.ts",
  "tests/page-copy-postgres.integration.test.ts",
  "tests/postgres-store.integration.test.ts",
  "tests/program-recovery-postgres.integration.test.ts",
  "tests/program-work-postgres.integration.test.ts",
  "tests/resource-inline-editing.integration.test.ts",
  "tests/resource-release.integration.test.ts",
  "tests/security-housekeeping-postgres.integration.test.ts"
] as const;

export default mergeConfig(base, defineConfig({
  test: {
    exclude: [...configDefaults.exclude, ...LOCAL_POSTGRES_SUITES],
    // Native CPU model cold-start on a shared Linux builder can exceed Vitest's
    // five-second default. Assertions and explicit performance limits stay intact.
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
}));
