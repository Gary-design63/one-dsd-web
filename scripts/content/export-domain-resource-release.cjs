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

const { DOMAIN_CORPUS } = require(path.join(projectRoot,"lib/content/corpus-domains.ts"));
const { ReleaseResourcePayloadSchema, staffReleaseValidationIssues } = require(path.join(projectRoot,"lib/content/resource-release-contract.ts"));
const candidates = fs.readFileSync(path.join(projectRoot,"data/source-snapshots/donor-library/domain-candidates.jsonl"),"utf8").trim().split(/\r?\n/).map(JSON.parse);
const canonical = value => JSON.stringify(value, (_key, entry) => entry && typeof entry === "object" && !Array.isArray(entry) ? Object.fromEntries(Object.entries(entry).sort(([a],[b])=>a.localeCompare(b))) : entry);
if(DOMAIN_CORPUS.length!==34 || candidates.length!==34 || new Set(DOMAIN_CORPUS.map(item=>item.id)).size!==34) throw new Error("Expected the exact34 domain originals.");
for(const item of DOMAIN_CORPUS) {
 const original = candidates.find(candidate=>candidate.contentItemId===item.id);
 if(!original || canonical(original.richOriginal.contentItem)!==canonical(item)) throw new Error(`Original content changed: ${item.id}`);
 if(!ReleaseResourcePayloadSchema.safeParse(item).success || staffReleaseValidationIssues(item).length) throw new Error(`Invalid resource contract: ${item.id}`);
}
process.stdout.write(JSON.stringify({sourceCommit:"5680911e68dcf07414de5f003b18ac8e813a8cb1",items:DOMAIN_CORPUS}));
