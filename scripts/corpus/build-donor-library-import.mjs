#!/usr/bin/env node

import { resolve } from "node:path";

import {
  buildDonorLibraryImport,
  DEFAULT_DONOR_STAGE_DIRECTORY,
  writeDonorLibraryImport,
} from "./donor-library-import-lib.mjs";
import { validateStageDirectoryStreaming } from "./batched-import-lib.mjs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`Usage:
  node scripts/corpus/build-donor-library-import.mjs --check [--source PATH]
  node scripts/corpus/build-donor-library-import.mjs --write [--source PATH] [--out .pac-import-staging/NAME]

The default is --check. This command recovers governed candidates and always emits zero publication decisions.`);
  process.exit(0);
}

try {
  const mode = process.argv.includes("--write") ? "write" : "check";
  const outputDirectory = option("--out")
    ? resolve(process.cwd(), option("--out"))
    : DEFAULT_DONOR_STAGE_DIRECTORY;
  const stage = buildDonorLibraryImport({ snapshotDirectory: option("--source") });
  if (mode === "write") {
    writeDonorLibraryImport(stage, outputDirectory);
    await validateStageDirectoryStreaming(outputDirectory);
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
