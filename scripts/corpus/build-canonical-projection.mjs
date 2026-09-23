#!/usr/bin/env node

import { resolve } from "node:path";
import {
  buildCanonicalProjection,
  DEFAULT_CANONICAL_STAGE_DIRECTORY,
  writeCanonicalProjection,
} from "./canonical-projection-lib.mjs";
import { validateShadowImportDirectory } from "./shadow-import-lib.mjs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`Usage:
  node scripts/corpus/build-canonical-projection.mjs --check [--catalog PATH] [--source PATH]
  node scripts/corpus/build-canonical-projection.mjs --write [--catalog PATH] [--source PATH] [--out .pac-import-staging/NAME]

The default is --check. The projection is held for review and always contains zero staff publication decisions.`);
  process.exit(0);
}

try {
  const mode = process.argv.includes("--write") ? "write" : "check";
  const outputDirectory = option("--out")
    ? resolve(process.cwd(), option("--out"))
    : DEFAULT_CANONICAL_STAGE_DIRECTORY;
  const stage = buildCanonicalProjection({
    catalogPath: option("--catalog"),
    sourceDirectory: option("--source"),
  });
  if (mode === "write") {
    writeCanonicalProjection(stage, outputDirectory);
    validateShadowImportDirectory(outputDirectory);
  }
  console.log(JSON.stringify({
    ok: true,
    mode,
    stageId: stage.manifest.stageId,
    stageSetSha256: stage.manifest.stageSetSha256,
    outputDirectory: mode === "write" ? outputDirectory : null,
    counts: stage.manifest.counts,
    noOmissionChecks: stage.manifest.noOmissionChecks,
    heldFromStaffRelease: stage.manifest.heldFromStaffRelease,
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}

