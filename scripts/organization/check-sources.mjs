import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const data=JSON.parse(await readFile(new URL("../../data/organization/minnesota-dhs.json",import.meta.url),"utf8"));
const output=new URL("../../evidence/organization-2026-09-08/source-http-check.json",import.meta.url);
const results=[];
let cursor=0;
await Promise.all(Array.from({length:4},async()=>{
  while(cursor<data.sources.length){
    const source=data.sources[cursor++];
    try{
      const response=await fetch(source.url,{signal:AbortSignal.timeout(25000),headers:{"user-agent":"One-DHS-PAC-organizational-reference-check/1.0"}});
      const bytes=new Uint8Array(await response.arrayBuffer());
      const blockedByChallenge=/perfdrive\.com|shieldsquare\.com/.test(new URL(response.url).hostname)||/verify (?:that )?you are human|access to this page has been denied/i.test(new TextDecoder().decode(bytes).slice(0,30000));
      const final=new URL(response.url); if(blockedByChallenge)final.search="";
      results.push({id:source.id,url:source.url,blockedByChallenge,finalUrl:final.href,status:response.status,contentType:response.headers.get("content-type"),bytes:bytes.length,sha256:createHash("sha256").update(bytes).digest("hex"),retrievable:response.ok&&bytes.length>100&&!blockedByChallenge});
    }catch(error){results.push({id:source.id,url:source.url,retrievable:false,error:error instanceof Error?error.name:"request_failed"});}
  }
}));
results.sort((a,b)=>a.id.localeCompare(b.id));
await mkdir(new URL("../../evidence/organization-2026-09-08/",import.meta.url),{recursive:true});
await writeFile(output,JSON.stringify({at:new Date().toISOString(),referenceVersion:data.version,meaning:"HTTP retrieval and byte identity only; this does not reverify facts or reset their checkedOn dates.",results},null,2)+"\n");
console.log(JSON.stringify({sources:results.length,retrievable:results.filter(r=>r.retrievable).length,failed:results.filter(r=>!r.retrievable).map(r=>({id:r.id,status:r.status,error:r.error}))}));
process.exitCode=results.every(r=>r.retrievable)?0:1;
