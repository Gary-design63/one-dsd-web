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
const { EDITABLE_SURFACE_REGISTRY } = require(path.join(projectRoot, "lib/content/staff-surface-registry.ts"));
const surfaces = EDITABLE_SURFACE_REGISTRY.filter(surface => /^(domain\.|dsd-program\.|dsd-scenario\.|graduation-path\.)/.test(surface.surfaceId) || ["one-dsd.inventory","equity.practice","ask.page","paths.index"].includes(surface.surfaceId)).map(surface => {
 const scope = surface.scopePolicy === "dsd" ? "dsd" : "one-dhs";
 return { surfaceId: surface.surfaceId, scope, routePattern: surface.route, staffLabel: surface.label, scopePolicy: surface.scopePolicy, fieldContract: surface.fields, protectedFields: surface.protectedFields ?? [], requiredReviewDimensions: contract.editableSurfaceReviewDimensions(surface), document: contract.parseEditableSurfaceDocument(surface, { schemaVersion: 1, surfaceId: surface.surfaceId, scope, values: surface.approvedValues }) };
});
process.stdout.write(JSON.stringify({ version: 1, reconstruction: "5680911", surfaces }));
