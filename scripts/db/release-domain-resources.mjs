import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
const root=path.resolve(import.meta.dirname,"../..");
const apply=process.argv.includes("--apply");
const receiptPath=process.argv.slice(2).find(value=>value.startsWith("--receipt="))?.slice(10);
if(process.argv.slice(2).some(value=>value!=="--apply"&&!value.startsWith("--receipt="))) throw new Error("Only --apply and --receipt=path are supported.");
if(!process.env.PAC_DATABASE_URL||!process.env.PAC_RUNTIME_DATABASE_URL) throw new Error("Setup and restricted application connections are required.");
const bundle=JSON.parse(execFileSync(process.execPath,[path.join(root,"scripts/content/export-domain-resource-release.cjs")],{cwd:root,encoding:"utf8",windowsHide:true,maxBuffer:2000000}));
const ssl=url=>["localhost","127.0.0.1","::1","[::1]"].includes(new URL(url).hostname)?false:"require";
const sql=postgres(process.env.PAC_DATABASE_URL,{ssl:ssl(process.env.PAC_DATABASE_URL),max:1,prepare:false});
const runtime=postgres(process.env.PAC_RUNTIME_DATABASE_URL,{ssl:ssl(process.env.PAC_RUNTIME_DATABASE_URL),max:1,prepare:false});
const canonical=value=>JSON.stringify(value,(_key,entry)=>entry&&typeof entry==='object'&&!Array.isArray(entry)?Object.fromEntries(Object.entries(entry).sort(([a],[b])=>a.localeCompare(b))):entry);
const receipt={checkedAt:new Date().toISOString(),sourceCommit:bundle.sourceCommit,mode:apply?'applied':'validated_and_rolled_back',items:[],scopes:[]};
const rollback=new Error('Validation completed; changes rolled back.');
try {
 await sql.begin(async tx=>{
  await tx`select pg_advisory_xact_lock(hashtextextended('owner-domain-resource-release-2026-09-07',0))`;
  for(const item of bundle.items){
   const rows=await tx`select revision_id,payload_sha256,canonical_payload from pac.content_revisions where content_item_id=${item.id} and canonical_payload->>'assetKind'='domain_resource' and canonical_payload#>>'{donor,commit}'=${bundle.sourceCommit} order by revision_number`;
   if(rows.length!==1||canonical(rows[0].canonical_payload.richOriginal.contentItem)!==canonical(item)) throw new Error(`Intact original is missing or differs: ${item.id}`);
   const [released]=await tx`select pac.release_owner_approved_domain_resource(${item.id},${rows[0].revision_id}::uuid,${rows[0].payload_sha256}) receipt`;
   const visible=await tx`select * from pac.read_staff_publications('one-dhs',${item.id})`;
   if(visible.length!==1||canonical(visible[0].canonical_payload)!==canonical(item)) throw new Error(`Published content differs: ${item.id}`);
   receipt.items.push({...released.receipt,exactOriginal:true});
  }
  if(!apply)throw rollback;
 });
 for(const scope of ['one-dhs','dsd']){
  const rows=await runtime`select * from pac.read_staff_publications(${scope},null)`;
  for(const item of bundle.items)if(!rows.some(row=>row.content_item_id===item.id&&canonical(row.canonical_payload)===canonical(item)))throw new Error(`Restricted runtime cannot read ${item.id} in ${scope}`);
  receipt.scopes.push({scope,totalResources:rows.length,restoredResources:bundle.items.length,passed:true});
 }
}catch(error){if(error!==rollback)throw error;}finally{await runtime.end({timeout:5});await sql.end({timeout:5});}
if(receiptPath)writeFileSync(receiptPath,JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
