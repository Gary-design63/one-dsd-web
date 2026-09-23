#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- This standalone registry export installs CommonJS TypeScript loader hooks without a build. */

const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "../..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveProjectAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    request = path.join(projectRoot, request.slice(2));
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function loadTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const contract = require(path.join(projectRoot, "lib/content/editable-surface-contract.ts"));
const registry = require(path.join(projectRoot, "lib/content/staff-surface-registry.ts"));

const seed = registry.EDITABLE_SURFACE_REGISTRY.map((surface) => ({
  surfaceId: surface.surfaceId,
  routePattern: surface.route,
  staffLabel: surface.label,
  scopePolicy: surface.scopePolicy,
  fieldContract: surface.fields,
  protectedFields: surface.protectedFields ?? [],
  requiredReviewDimensions: contract.editableSurfaceReviewDimensions(surface),
  approvedValues: surface.approvedValues,
}));

const serialized = JSON.stringify(seed);
const migrationLine = `  registry_seed constant jsonb := $pac_registry$${serialized}$pac_registry$::jsonb;`;

if (process.argv.includes("--sync-migration")) {
  const migrationPath = path.join(projectRoot, "db/migrations/0018_pac_editable_surfaces.sql");
  const previous = fs.readFileSync(migrationPath, "utf8");
  const marker = /^  registry_seed constant jsonb := \$pac_registry\$.*\$pac_registry\$::jsonb;$/m;
  if (!marker.test(previous)) throw new Error("Migration registry seed marker was not found exactly once.");
  const next = previous.replace(marker, migrationLine);
  if (next === previous) {
    process.stdout.write(`Editable surface seed already matches ${seed.length} registered areas.\n`);
  } else {
    fs.writeFileSync(migrationPath, next, "utf8");
    process.stdout.write(`Updated editable surface seed for ${seed.length} registered areas.\n`);
  }
} else if (process.argv.includes("--migration-line")) {
  process.stdout.write(migrationLine);
} else {
  process.stdout.write(serialized);
}
