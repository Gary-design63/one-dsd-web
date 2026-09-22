#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- This standalone export uses CommonJS TypeScript loader hooks, matching the existing read-only registry exporters. */
// Read-only export; never use --sync-migration for an applied migration.
const fs = require('node:fs');
if (!process.execArgv.includes('--conditions=react-server')) { process.stdout.write(require('node:child_process').execFileSync(process.execPath,['--conditions=react-server',__filename],{encoding:'utf8',maxBuffer:50000000,windowsHide:true})); process.exit(0); }
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const original = Module._resolveFilename;
Module._resolveFilename = function(request, parent, main, options) { return original.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, parent, main, options); };
require.extensions['.ts'] = function(module, filename) { module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.Node10, target: ts.ScriptTarget.ES2022 }, fileName: filename }).outputText, filename); };
const contract = require(path.join(root,'lib/content/editable-surface-contract.ts'));
const { EDITABLE_SURFACE_REGISTRY } = require(path.join(root,'lib/content/staff-surface-registry.ts'));
const page = require(path.join(root,'lib/content/page-copy-contract.ts'));
const surfaces=EDITABLE_SURFACE_REGISTRY.map(surface=>{ const scope=surface.scopePolicy==='dsd'?'dsd':'one-dhs'; return { surfaceId:surface.surfaceId,scope,routePattern:surface.route,staffLabel:surface.label,scopePolicy:surface.scopePolicy,fieldContract:surface.fields,protectedFields:surface.protectedFields??[],requiredReviewDimensions:contract.editableSurfaceReviewDimensions(surface),document:contract.parseEditableSurfaceDocument(surface,{schemaVersion:1,surfaceId:surface.surfaceId,scope,values:surface.approvedValues}) }; });
process.stdout.write(JSON.stringify({version:1,surfaces,pages:[{id:'page-home',scope:'one-dhs',copy:page.HomePageCopySchema.parse(page.STATIC_HOME_COPY)},{id:'site-footer',scope:'one-dhs',copy:page.FooterCopySchema.parse(page.STATIC_FOOTER_COPY)}]}));
