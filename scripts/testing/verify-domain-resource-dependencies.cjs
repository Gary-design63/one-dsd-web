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
const {execFileSync} = require("node:child_process");
const sourceCommit="5680911e68dcf07414de5f003b18ac8e813a8cb1";
const originals=new Map();
function originalModule(file){
 if(originals.has(file))return originals.get(file);
 const source=execFileSync("git",["show",`${sourceCommit}:${file}`],{cwd:projectRoot,encoding:"utf8",windowsHide:true});
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},fileName:file}).outputText;
 const output={exports:{}};
 new Function("exports","module","require",compiled)(output.exports,output,request=>{
  if(request==="@/lib/constants")return originalModule("lib/constants.ts");
  throw new Error(`Unexpected original source dependency: ${request}`);
 });
 originals.set(file,output.exports);return output.exports;
}
const source={
 paths:originalModule("lib/content/paths-domain.ts").DOMAIN_PATHS,
 domains:originalModule("lib/domains/index.ts").DOMAINS,
 programs:originalModule("lib/dsd/index.ts").DSD_PROGRAMS,
 scenarios:originalModule("lib/dsd/index.ts").DSD_SCENARIOS,
 resources:originalModule("lib/content/corpus-domains.ts").DOMAIN_CORPUS,
};
const current={
 paths:require(path.join(projectRoot,"lib/content/paths-domain.ts")).DOMAIN_PATHS,
 domains:require(path.join(projectRoot,"lib/domains/index.ts")).DOMAINS,
 programs:require(path.join(projectRoot,"lib/dsd/index.ts")).DSD_PROGRAMS,
 scenarios:require(path.join(projectRoot,"lib/dsd/index.ts")).DSD_SCENARIOS,
 resources:require(path.join(projectRoot,"lib/content/corpus-domains.ts")).DOMAIN_CORPUS,
};
function references(value,resources=new Set(),links=new Set()){
 if(Array.isArray(value))for(const child of value)references(child,resources,links);
 else if(value&&typeof value==='object')for(const [key,child]of Object.entries(value)){
  if(['contentIds','toolIds','linkedContent'].includes(key))for(const id of child)resources.add(id);
  if(key==='href'&&typeof child==='string'&&child.startsWith('/')){
   links.add(child);const match=child.match(/^\/(?:resources|library)\/([^?#/]+)/);if(match)resources.add(match[1]);
  }
  references(child,resources,links);
 }
 return {resources:[...resources].sort(),links:[...links].sort()};
}
const originalRefs=references(source),currentRefs=references(current);
assert.deepEqual(currentRefs.resources,originalRefs.resources,'Restored workflow resource references must match original depth');
assert.equal(originalRefs.resources.length,53);
assert.deepEqual(Object.fromEntries(Object.entries(source).map(([name,rows])=>[name,rows.length])),{paths:6,domains:7,programs:12,scenarios:13,resources:34});
assert.equal(source.domains.reduce((n,domain)=>n+domain.tasks.length,0),23);
const {DOMAIN_CORPUS}=require(path.join(projectRoot,"lib/content/corpus-domains.ts"));
for(const item of DOMAIN_CORPUS)assert.ok(originalRefs.resources.includes(item.id),`Unaccounted donor resource: ${item.id}`);
const {loadStaffContentSnapshot}=require(path.join(projectRoot,"lib/content/staff-publications.ts"));
const {docsFromStaffContent,searchDocs}=require(path.join(projectRoot,"lib/intelligence/retrieval/search.ts"));
if(process.env.PAC_CONTENT_SOURCE!=='postgres'||!["localhost","127.0.0.1"].includes(new URL(process.env.PAC_RUNTIME_DATABASE_URL).hostname))throw new Error('Requires local PostgreSQL scoped application reader');
const origin='http://127.0.0.1:3115';
const receipt={checkedAt:new Date().toISOString(),environment:'Local running application and restricted PostgreSQL reader; no external provider calls',sourceCommit,originalCounts:{additionalPaths:6,domains:7,domainTasks:23,dsdPrograms:12,dsdScenarios:13,requiredResources:53,originalSeedDependencies:19,restoredDomainDependencies:34},scopes:[],failures:[]};
const decode=text=>text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const textOnly=html=>decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).trim();
async function page(href,scope){const response=await fetch(origin+href,{headers:{Cookie:`pac_context=${scope==='dsd'?'one_dsd':'one_dhs'}`},signal:AbortSignal.timeout(60000)});return{status:response.status,url:response.url,html:await response.text()};}
(async()=>{
 for(const scope of ['one-dhs','dsd']){
  const snapshot=await loadStaffContentSnapshot({source:'postgres',scope});assert.equal(snapshot.items.length,59);
  const docs=docsFromStaffContent(snapshot),checks=[];
  const learn=await page('/learn',scope),library=await page('/library',scope);
  assert.equal(learn.status,200);assert.equal(library.status,200);
  for(const id of originalRefs.resources){
   const item=snapshot.items.find(row=>row.id===id);assert.ok(item,`Missing scoped resource ${scope}:${id}`);
   const hits=searchDocs(`Where can I find ${item.title}?`,docs,{limit:5});
   const routes=[];
   for(const prefix of ['/library/','/resources/']){
    const result=await page(prefix+id,scope);
    const content=result.html.match(/<section[^>]*aria-label="Content"[^>]*>([\s\S]*?)<\/section>/)?.[1]??'';
    const rendered=textOnly(content);
    const completeBody=item.body.every(paragraph=>rendered.includes(paragraph.replace(/\s+/g,' ').trim()));
    const title=decode(result.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]??'');
    routes.push({href:prefix+id,status:result.status,titleCorrect:title===item.title,completeBody});
   }
   const href=`/library/${id}`;
   const check={id,paragraphs:item.body.length,scopedRead:true,askIndex:docs.some(doc=>doc.id===id),namedAskSearch:hits.some(hit=>hit.id===id),learnListed:learn.html.includes(`href="${href}"`),libraryListed:library.html.includes(`href="${href}"`),routes};
   checks.push(check);
   if(!check.namedAskSearch||!check.learnListed||!check.libraryListed||routes.some(route=>route.status!==200||!route.titleCorrect||!route.completeBody))receipt.failures.push({scope,...check});
  }
  receipt.scopes.push({scope,publishedResources:snapshot.items.length,dependencyChecks:checks});
  console.log(JSON.stringify({scope,checkedResources:checks.length,failed:receipt.failures.length}));
 }
 fs.writeFileSync(path.join(projectRoot,'evidence/local-audit-2026-09-07/domain-resource-dependency-verification.json'),JSON.stringify(receipt,null,2));
 assert.deepEqual(receipt.failures,[],'See dependency receipt for failures');
 console.log(JSON.stringify({passed:true,resourceScopeChecks:106,resourceHttpRoutes:212}));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
