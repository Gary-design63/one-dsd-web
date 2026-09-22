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

const assert = require("node:assert/strict");
const { PODCASTS } = require(path.join(projectRoot, "lib/content/podcasts.ts"));
const { indexedProgramResources, programResourceLinks } = require(path.join(projectRoot, "lib/intelligence/retrieval/program-resources.ts"));
if (process.env.PAC_CONTENT_SOURCE !== "postgres" || !["localhost", "127.0.0.1"].includes(new URL(process.env.PAC_RUNTIME_DATABASE_URL).hostname)) throw new Error("Requires the local PostgreSQL audit application connection.");
(async () => {
  const checks = [];
  for (const scope of ["one-dhs", "dsd"]) {
    const index = await indexedProgramResources(scope);
    for (const podcast of PODCASTS) {
      const doc = index.destinations.find(row => row.href === podcast.href);
      assert.ok(doc, `Missing published ${podcast.surfaceId} in ${scope}`);
      const question = `Where can I find the ${doc.title} podcast?`;
      const links = programResourceLinks(question, index.destinations, 3);
      assert.ok(links.some(link => link.href === podcast.href));
      checks.push({scope,surfaceId:podcast.surfaceId,title:doc.title,href:doc.href,question,publishedDatabaseIndex:true,routeSelected:true});
    }
  }
  fs.writeFileSync(path.join(projectRoot, "evidence/local-audit-2026-09-07/podcast-ask-database-verification.json"),JSON.stringify({checkedAt:new Date().toISOString(),mode:"Actual scoped PostgreSQL publications and ASK destination selection; no model or external provider request",checks},null,2));
  console.log(JSON.stringify({checks:checks.length,passed:true}));
})().catch(error=>{ console.error(error.message); process.exitCode=1; });
