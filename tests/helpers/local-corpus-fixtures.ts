import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
const resolverPath = path.resolve(root, "data/source-ledger/local-resolver.local.json");
const frozenStageRoot = path.resolve(root, ".pac-import-staging");
const required = process.env.PAC_REQUIRE_LOCAL_CORPUS === "1";

type Resolver = {
  paths?: Record<string, string | string[]>;
};

function readResolver(): Resolver | null {
  if (!existsSync(resolverPath)) return null;
  try {
    return JSON.parse(readFileSync(resolverPath, "utf8")) as Resolver;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown parse error";
    throw new Error(`The present local corpus resolver is malformed: ${detail}`);
  }
}

const resolver = readResolver();
const configuredCatalog = process.env.PAC_CATALOG_PATH?.trim();
const resolverCatalog = resolver?.paths?.["complete-normalized-catalog-578"];
const resolverCatalogPath = Array.isArray(resolverCatalog) ? resolverCatalog[0] : resolverCatalog;

export const localCatalogAvailable = [configuredCatalog, resolverCatalogPath]
  .some((candidate) => Boolean(candidate && existsSync(candidate)));

export const localSourceObjectsAvailable = localCatalogAvailable && resolver !== null;

export const localFrozenStagesAvailable = [
  "pac-corpus-import-2026-09-04",
  "pac-canonical-projection-2026-09-05",
].every((name) => existsSync(path.resolve(frozenStageRoot, name, "manifest.json")));

export const localCatalogIt = localCatalogAvailable || required ? it : it.skip;
export const localSourceObjectsIt = localSourceObjectsAvailable || required ? it : it.skip;
export const localFrozenStagesIt = localFrozenStagesAvailable || required ? it : it.skip;

function missingFixtureMessage(kind: string): string {
  return [
    `The ${kind} owner-machine fixture is required for this test.`,
    "Run npm run corpus:fixtures:bootstrap -- --from <trusted-source-repository>,",
    "or provide the documented local resolver and catalog without committing them.",
  ].join(" ");
}

export function requireLocalCatalog(): void {
  if (!localCatalogAvailable) throw new Error(missingFixtureMessage("578-record catalog"));
}

export function requireLocalSourceObjects(): void {
  if (!localSourceObjectsAvailable) throw new Error(missingFixtureMessage("private source-object"));
}

export function requireLocalFrozenStages(): void {
  if (!localFrozenStagesAvailable) throw new Error(missingFixtureMessage("frozen import-stage"));
}
