import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Private local databases, temporary audit harnesses, and their generated output.
    ".data/**",
    "evidence/**",
    "work/**",
    "work-*/**",
    // Local Vercel metadata and transport scratch files are not application source.
    ".vercel/**",
    // Standalone document generators for the leadership communication. These run by
    // hand under Node to produce Word and HTML files; they are not shipped with the
    // application and deliberately use CommonJS, which this config forbids in app code.
    "communications/**",
  ]),
]);

export default eslintConfig;
