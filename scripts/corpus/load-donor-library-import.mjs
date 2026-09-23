#!/usr/bin/env node

import { DEFAULT_DONOR_STAGE_DIRECTORY } from "./donor-library-import-lib.mjs";

if (!process.argv.includes("--stage") && !process.argv.includes("--promote-run")) {
  process.argv.push("--stage", DEFAULT_DONOR_STAGE_DIRECTORY);
}

const { main } = await import("./load-shadow-import-v2.mjs");
await main();
