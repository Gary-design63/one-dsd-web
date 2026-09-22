#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";
const root = resolve(import.meta.dirname,"../..");
const apply = process.argv.includes("--apply");
const receiptPath = process.argv.slice(2).find(value => value.startsWith("--receipt="))?.slice(10);
if (process.argv.slice(2).some(value => value !== "--apply" && !value.startsWith("--receipt="))) throw new Error("Only --apply and --receipt=path are supported.");
const databaseUrl=process.env.PAC_DATABASE_URL, runtimeUrl=process.env.PAC_RUNTIME_DATABASE_URL;
if(!databaseUrl || !runtimeUrl) throw new Error("Setup and restricted application connections are required.");
const ssl=url => ["localhost","127.0.0.1","::1","[::1]"].includes(new URL(url).hostname) ? false : "require";
const bundle=JSON.parse(execFileSync(process.execPath,[resolve(root,"scripts/content/export-restored-depth.cjs")],{cwd:root,encoding:"utf8",windowsHide:true}));
const canonical=value => JSON.stringify(value,(_key,entry)=>entry && typeof entry==="object" && !Array.isArray(entry)?Object.fromEntries(Object.entries(entry).sort(([a],[b])=>a.localeCompare(b))):entry);
const sql=postgres(databaseUrl,{ssl:ssl(databaseUrl),max:1,prepare:false});
const runtime=postgres(runtimeUrl,{ssl:ssl(runtimeUrl),max:1,prepare:false});
const receipt={ checkedAt:new Date().toISOString(),mode:apply?"applied":"validated_and_rolled_back",reconstruction:bundle.reconstruction,registered:[],definitionExtensions:[],published:[],preserved:[],scopedReads:[], currentPublications:[], expectedPublications:[], databaseCommitted:false };
const rollback=new Error("Validated, then rolled back.");
let failure;
try {
 await sql.begin(async tx=>{
  await tx`select pg_advisory_xact_lock(hashtextextended('restore-program-depth-2026-09-07',0))`;
  for(const surface of bundle.surfaces){
   const [existing]=await tx`select * from pac.surface_definitions where surface_id=${surface.surfaceId}`;
   if(existing){
    if(existing.route_pattern!==surface.routePattern || existing.scope_policy!==surface.scopePolicy || !existing.active) throw new Error(`Definition identity differs: ${surface.surfaceId}`);
    const oldFields=new Map(existing.field_contract.map(field=>[field.key,field]));
    const newFields=new Map(surface.fieldContract.map(field=>[field.key,field]));
    for(const [key,value] of oldFields) if(canonical(newFields.get(key))!==canonical(value)) throw new Error(`Existing field would change: ${surface.surfaceId}.${key}`);
    if(existing.protected_fields.some(field=>!surface.protectedFields.includes(field))) throw new Error(`Existing protected field would be removed: ${surface.surfaceId}`);
    if(canonical(existing.field_contract)!==canonical(surface.fieldContract) || canonical(existing.protected_fields)!==canonical(surface.protectedFields)){
     await tx`update pac.surface_definitions set field_contract=${tx.json(surface.fieldContract)},protected_fields=${surface.protectedFields} where surface_id=${surface.surfaceId}`;
     receipt.definitionExtensions.push({surfaceId:surface.surfaceId,fields:surface.fieldContract.filter(field=>!oldFields.has(field.key)).map(field=>field.key),protectedFields:surface.protectedFields.filter(field=>!existing.protected_fields.includes(field))});
    }
   } else {
    await tx`insert into pac.surface_definitions(surface_id,route_pattern,staff_label,scope_policy,schema_version,field_contract,protected_fields,required_review_dimensions,active,registered_by) values(${surface.surfaceId},${surface.routePattern},${surface.staffLabel},${surface.scopePolicy},1,${tx.json(surface.fieldContract)},${surface.protectedFields},${surface.requiredReviewDimensions},true,'owner-directed-restoration-2026-09-07')`;
    receipt.registered.push(surface.surfaceId);
   }
   // Extend existing values only with missing new fields. Preserve all owner wording,
   // revisions, overrides, drafts, and withdrawal choices.
   for(const scope of (existing && surface.scopePolicy==="inheritable" ? ["one-dhs","dsd"] : [surface.scope])){
    const [row]=await tx`select pac.read_surface_editing_state(${scope},${surface.surfaceId}) state`;
    const state=row.state;
    if(state.effective?.sourceScope && state.effective.sourceScope !== scope) { receipt.preserved.push({surfaceId:surface.surfaceId,scope,reason:"inherited"}); continue; }
    if(!state.effective && (state.latestDecision || state.draft)) { receipt.preserved.push({surfaceId:surface.surfaceId,scope,reason:"existing availability or draft"}); continue; }
    if(!state.effective && existing && scope!==surface.scope) continue;
    const document=state.effective ? structuredClone(state.effective.document) : {...structuredClone(surface.document),scope};
    const missing=Object.keys(surface.document.values).filter(key=>!Object.hasOwn(document.values,key));
    const countCorrection = surface.surfaceId === "paths.index" && typeof document.values.introLede === "string" && document.values.introLede.startsWith("Choose from five paths for common work.");
    if (countCorrection) document.values.introLede = document.values.introLede.replace("Choose from five paths for common work.", "Choose from eleven paths for common work.");
    if(state.effective && !missing.length && !countCorrection){receipt.preserved.push({surfaceId:surface.surfaceId,scope,reason:"current wording"});continue;}
    if(state.draft && canonical(state.draft.document)!==canonical(state.effective?.document)) throw new Error(`An owner draft must be preserved before extending ${surface.surfaceId} in ${scope}.`);
    for(const key of missing) document.values[key]=surface.document.values[key];
    const [saved]=await tx`select pac.save_owner_approved_surface(${scope},${surface.surfaceId},${state.expectedRevisionId}::uuid,${state.latestDecision?.publicationDecisionId??null}::bigint,${tx.json(document)},'Restore the complete program material requested and already approved by the owner, preserving existing wording and source history.') state`;
    if(canonical(saved.state.effective?.document)!==canonical(document)) throw new Error(`Restored text differs: ${surface.surfaceId}`);
    receipt.published.push({surfaceId:surface.surfaceId,scope,revisionId:saved.state.effective.revisionId,publicationDecisionId:saved.state.effective.publicationDecisionId,addedFields:missing});
   }
  }
  // Availability after restoration is the intended result, including an owner's
  // withdrawal or unpublished draft. Capture it before committing so verification
  // does not confuse a permitted scope with a requirement to publish that scope.
  for(const surface of bundle.surfaces) for(const scope of ["one-dhs","dsd"]){
   const scopeAllowed=surface.scopePolicy!=="dsd" || scope==="dsd";
   const rows=scopeAllowed ? await tx`select * from pac.read_surface_publication(${scope},${surface.surfaceId})` : [];
   if(rows.length>1) throw new Error(`Multiple current publications in ${scope}: ${surface.surfaceId}`);
   receipt.expectedPublications.push({surfaceId:surface.surfaceId,scope,scopeAllowed,readable:rows.length===1,
    sourceScope:rows[0]?.scope_id??null,revisionId:rows[0]?.revision_id??null,publicationDecisionId:rows[0]?.publication_decision_id??null});
  }
  if(!apply) throw rollback;
 });
 receipt.databaseCommitted=true;
 for(const expected of receipt.expectedPublications){
  const {surfaceId,scope,scopeAllowed}=expected;
  let rows=[];
  try { rows=await runtime`select * from pac.read_surface_publication(${scope},${surfaceId})`; }
  catch(error) { if(scopeAllowed || error.code !== "42501") throw error; }
  if (rows.length) receipt.currentPublications.push({surfaceId,scope,sourceScope:rows[0].scope_id,revisionId:rows[0].revision_id,publicationDecisionId:rows[0].publication_decision_id});
  receipt.scopedReads.push({surfaceId,scope,readable:rows.length===1,expected:expected.readable});
  if(rows.length!==(expected.readable?1:0)) throw new Error(`Publication availability differs after commit in ${scope}: ${surfaceId}`);
  if(expected.readable && (rows[0].revision_id!==expected.revisionId || rows[0].scope_id!==expected.sourceScope || rows[0].publication_decision_id!==expected.publicationDecisionId)) throw new Error(`Published wording changed after commit in ${scope}: ${surfaceId}`);
 }
}catch(error){if(error!==rollback){failure=error;receipt.failure={message:error.message,code:error.code??null,databaseCommitted:receipt.databaseCommitted};}}
finally{await runtime.end({timeout:5});await sql.end({timeout:5});}
if(receiptPath)writeFileSync(receiptPath,JSON.stringify(receipt,null,2));
if(failure)throw failure;
process.stdout.write(JSON.stringify(receipt,null,2));
