#!/usr/bin/env node

import { resolve } from "node:path";
import {
  buildSourceObjectStage,
  DEFAULT_SOURCE_OBJECT_STAGE_DIRECTORY,
  safeOperationalError,
  validateSourceObjectStage,
  writeSourceObjectStage,
} from "./source-object-stage-lib.mjs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`Usage:
  node scripts/corpus/build-source-objects.mjs --check [--catalog PATH]
  node scripts/corpus/build-source-objects.mjs --write [--catalog PATH] [--out .pac-object-staging/NAME]

The default is --check. This command never connects to object storage or a database.`);
  process.exit(0);
}

try {
  const mode = process.argv.includes("--write") ? "write" : "check";
  const stage = buildSourceObjectStage({ catalogPath: option("--catalog") });
  const outputDirectory = option("--out")
    ? resolve(process.cwd(), option("--out"))
    : DEFAULT_SOURCE_OBJECT_STAGE_DIRECTORY;
  if (mode === "write") {
    writeSourceObjectStage(stage, outputDirectory);
    validateSourceObjectStage(outputDirectory);
  }
  console.log(JSON.stringify({
    ok: true,
    mode,
    stageId: stage.manifest.stageId,
    stageSetSha256: stage.manifest.stageSetSha256,
    counts: stage.manifest.counts,
    safety: stage.manifest.safety,
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: safeOperationalError(error) }, null, 2));
  process.exit(1);
}
