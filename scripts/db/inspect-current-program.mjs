#!/usr/bin/env node
import {writeFileSync} from 'node:fs';
import postgres from 'postgres';
import {exportBundle,hash,inspectMetadata,planRelease,ssl,targetIdentity} from './current-program-release-lib.mjs';
const output=process.argv[2];if(!output||process.argv.length!==3)throw Error('Use one local metadata receipt path.');
if(!process.env.PAC_DATABASE_URL)throw Error('Setup connection is required.');
const bundle=exportBundle();const sql=postgres(process.env.PAC_DATABASE_URL,{ssl:ssl(process.env.PAC_DATABASE_URL),max:1,prepare:false,onnotice:()=>{}});
try {const metadata=await inspectMetadata(sql,bundle);const baseline={version:1,capturedAt:new Date().toISOString(),targetSha256:targetIdentity(process.env.PAC_DATABASE_URL),bundleSha256:hash(bundle),contentExported:false,...metadata};writeFileSync(output,JSON.stringify(baseline,null,2)+'\n');const plan=planRelease(bundle,metadata);console.log(JSON.stringify({baselineSaved:true,contentExported:false,surfaceCount:bundle.surfaces.length,actions:plan.plans.reduce((a,p)=>(a[p.action]=(a[p.action]??0)+1,a),{}),conflicts:plan.conflicts}));}catch(error){console.error(JSON.stringify({failed:true,code:error.code??error.name,message:error.code==='42883'&&/^(function|operator) [a-zA-Z0-9_.,() :\[\]?]+ does not exist$/.test(error.message)?error.message:error.code?'Metadata comparison failed':error.message}));process.exitCode=1;}finally{await sql.end({timeout:5});}
