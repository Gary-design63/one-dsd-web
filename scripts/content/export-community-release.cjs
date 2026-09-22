#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- This isolated export process uses CommonJS loader hooks to validate the TypeScript registry without a build. */

// Read-only export of the exact application definitions approved for publication.
// This helper never rewrites an applied migration or stores credentials.
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");
const projectRoot = path.resolve(__dirname, "../..");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function resolveProjectAlias(request, parent, isMain, options) {
  return originalResolve.call(this, request.startsWith("@/") ? path.join(projectRoot, request.slice(2)) : request, parent, isMain, options);
};
require.extensions[".ts"] = function loadTypeScript(module, filename) {
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.Node10, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const contract = require(path.join(projectRoot, "lib/content/editable-surface-contract.ts"));
const registry = require(path.join(projectRoot, "lib/content/staff-surface-registry.ts"));
const reading = require(path.join(projectRoot, "lib/content/community-reading-surface.ts"));
const recovered = require(path.join(projectRoot, "lib/content/community-design-data.json"));
const definitions = [
  ...recovered.map(item => reading.getCommunityReadingSurface(reading.communityReadingSurfaceId(item.id))),
  ...registry.EDITABLE_SURFACE_REGISTRY.filter(item => item.surfaceId.startsWith("community-brief.") || item.surfaceId === "community-connections.home"),
];
if (recovered.length !== 41 || definitions.length !== 56 || new Set(definitions.map(item => item?.surfaceId)).size !== 56) {
  throw new Error("The approved community publication inventory has changed; review its scope before publication.");
}
const surfaces = definitions.map(surface => {
  if (!surface || surface.scopePolicy !== "inheritable") throw new Error("A community publication definition is missing or has a different scope.");
  const document = contract.parseEditableSurfaceDocument(surface, { schemaVersion: 1, surfaceId: surface.surfaceId, scope: "one-dhs", values: surface.approvedValues });
  if (Buffer.byteLength(JSON.stringify(document), "utf8") > 1000000) throw new Error("A community reading exceeds the publication size limit.");
  return {
    surfaceId: surface.surfaceId, routePattern: surface.route, staffLabel: surface.label,
    scopePolicy: surface.scopePolicy, fieldContract: surface.fields, protectedFields: surface.protectedFields ?? [],
    requiredReviewDimensions: contract.editableSurfaceReviewDimensions(surface), document,
  };
});
process.stdout.write(JSON.stringify({ version: 1, scope: "one-dhs", surfaces }));
