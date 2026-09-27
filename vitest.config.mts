import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
      "server-only": path.resolve(import.meta.dirname, "tests/helpers/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    // Fresh-PostgreSQL suites each reserve and start an isolated local server.
    // Running test files serially prevents the reserve-then-bind port race that
    // can otherwise make a green migration suite fail intermittently in CI.
    fileParallelism: false,
    // Several suites build the full retrieval index or render every scoped
    // route; on slower machines those exceed Vitest's 5 s default without
    // any functional failure. Tests that need longer still set their own.
    testTimeout: 30_000,
    env: {
      PAC_STORE: "memory",
      PAC_CONTENT_SOURCE: "static",
      PAC_STAFF_SCOPE: "one-dhs",
      PAC_AUTONOMY_MAX: "A5",
      NODE_ENV: "test",
    },
  },
});
