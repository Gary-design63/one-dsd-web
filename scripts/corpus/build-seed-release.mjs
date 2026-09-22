#!/usr/bin/env node

import { resolve } from "node:path";
import {
  DEFAULT_SEED_RELEASE_STAGE,
  buildSeedReleaseStage,
  simulateSeedReleaseReplay,
  validateSeedReleaseDirectory,
  writeSeedReleaseStage,
} from "./seed-release-lib.mjs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function help() {
  console.log(`Usage:
  node scripts/corpus/build-seed-release.mjs --check
  node scripts/corpus/build-seed-release.mjs --write [--out .pac-import-staging/NAME]

The default is --check. The command creates a seed-only release stage and never connects to a database.`);
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  help();
  process.exit(0);
}

try {
  const mode = process.argv.includes("--write") ? "write" : "check";
  const outputDirectory = option("--out")
    ? resolve(process.cwd(), option("--out"))
    : DEFAULT_SEED_RELEASE_STAGE;
  const stage = buildSeedReleaseStage();
  const replay = simulateSeedReleaseReplay(stage);
  if (mode === "write") {
    writeSeedReleaseStage(stage, outputDirectory);
    validateSeedReleaseDirectory(outputDirectory);
  }
  console.log(JSON.stringify({
    ok: true,
    mode,
    stageId: stage.manifest.stageId,
    stageSetSha256: stage.manifest.stageSetSha256,
    outputDirectory: mode === "write" ? outputDirectory : null,
    counts: stage.manifest.counts,
    noOmissionChecks: stage.manifest.noOmissionChecks,
    releaseBoundaries: stage.manifest.releaseBoundaries,
    replay,
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
