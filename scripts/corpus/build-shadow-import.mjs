#!/usr/bin/env node

import { resolve } from "node:path";
import {
  buildShadowImport,
  DEFAULT_STAGE_DIRECTORY,
  validateShadowImportDirectory,
  writeShadowImport,
} from "./shadow-import-lib.mjs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function help() {
  console.log(`Usage:
  node scripts/corpus/build-shadow-import.mjs --check [--catalog PATH]
  node scripts/corpus/build-shadow-import.mjs --write [--catalog PATH] [--out .pac-import-staging/NAME]

The default is --check. This command never connects to a database and never creates publication decisions.`);
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  help();
  process.exit(0);
}

try {
  const mode = process.argv.includes("--write") ? "write" : "check";
  const catalogPath = option("--catalog");
  const outputDirectory = option("--out")
    ? resolve(process.cwd(), option("--out"))
    : DEFAULT_STAGE_DIRECTORY;
  const stage = buildShadowImport({ catalogPath });

  if (mode === "write") {
    writeShadowImport(stage, outputDirectory);
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
    sourceAliases: stage.manifest.sourceAliases,
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}

