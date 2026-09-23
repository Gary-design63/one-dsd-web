#!/usr/bin/env node
// Exact owner-approved local publication only. Default is one rollback transaction.
// Use inspect-current-program.mjs first; this script rejects changed baselines.
import {readFileSync,writeFileSync} from 'node:fs';
import postgres from 'postgres';
import {assertBaseline,exportBundle,hash,inspectMetadata,planRelease,ssl,targetIdentity} from './current-program-release-lib.mjs';
const args=process.argv.slice(2),apply=args.includes('--apply');
if(args.some(x=>x!=='--apply'&&!x.startsWith('--baseline=')&&!x.startsWith('--receipt=')))throw Error('Only --baseline=path, --receipt=path and --apply are supported.');
const baselinePath=args.find(x=>x.startsWith('--baseline='))?.slice(11),receiptPath=args.find(x=>x.startsWith('--receipt='))?.slice(10);
if(!baselinePath||!receiptPath)throw Error('An inspected metadata baseline and a receipt path are required.');
if(!process.env.PAC_DATABASE_URL||(apply&&!process.env.PAC_RUNTIME_DATABASE_URL))throw Error('Setup connection, and restricted runtime connection for apply, are required.');
const bundle=exportBundle(),baseline=JSON.parse(readFileSync(baselinePath,'utf8'));
if(baseline.version!==1||baseline.contentExported!==false||baseline.targetSha256!==targetIdentity(process.env.PAC_DATABASE_URL)||baseline.bundleSha256!==hash(bundle))throw Error('The inspected database or current approved bundle differs. Inspect the intended release again.');
const plan=planRelease(bundle,baseline);
if(plan.conflicts.length){writeFileSync(receiptPath,JSON.stringify({status:'conflicts_preserved',databaseCommitted:false,conflicts:plan.conflicts},null,2)+'\n');throw Error('Unpublished owner work or incompatible definitions require a specific merge before release.');}
const sql=postgres(process.env.PAC_DATABASE_URL,{ssl:ssl(process.env.PAC_DATABASE_URL),max:1,prepare:false,onnotice:()=>{}});
const receipt={startedAt:new Date().toISOString(),status:'pending',mode:apply?'apply':'rollback_rehearsal',baselineSha256:hash(baseline),bundleSha256:hash(bundle),databaseCommitted:false,plans:plan.plans,definitionChanges:[],publications:[],expectedPublications:[],runtimeReads:[],sourcePreservation:null,sequenceNote:'Rollback can advance sequence counters without committing publication rows.'};
const rollback=Error('Release verified and rolled back.');let stage='begin',failure;
async function originalHashes(tx){return {sources:await tx`select source_item_id id,encode(sha256(convert_to(to_jsonb(s)::text,'UTF8')),'hex') hash from pac.source_items s order by source_item_id`,revisions:await tx`select revision_id::text id,encode(sha256(convert_to(to_jsonb(r)::text,'UTF8')),'hex') hash from pac.content_revisions r order by revision_id`};}
async function publicationMetadata(tx){
 const eligible=bundle.surfaces.flatMap(s=>(s.scopePolicy==='inheritable'?['one-dhs','dsd']:[s.scope]).map(scope=>({surfaceId:s.surfaceId,scope})));
 const rows=await tx`select item->>'surfaceId' surface_id,item->>'scope' scope_id,coalesce((select jsonb_agg(jsonb_build_object('revisionId',p.revision_id,'sourceScope',p.scope_id,'decisionId',p.publication_decision_id::text,'documentHash',encode(sha256(convert_to(p.document::text,'UTF8')),'hex'))) from pac.read_surface_publication(item->>'scope',item->>'surfaceId') p),'[]'::jsonb) publications from jsonb_array_elements(${tx.json(eligible)}::jsonb) item order by item->>'surfaceId',item->>'scope'`;
 const pages=[];for(const page of bundle.pages)for(const scope of ['one-dhs','dsd'])pages.push({id:page.id,scope,publications:await tx`select revision_id::text "revisionId",encode(sha256(convert_to(canonical_payload::text,'UTF8')),'hex') "documentHash" from pac.read_page_block_publication(${scope},${page.id})`});
 return {surfaces:rows,pages};
}
try{
 await sql.begin(async tx=>{
  await tx`set local lock_timeout='10s'`;
  await tx`select pg_advisory_xact_lock(hashtextextended('one-dhs-pac-current-program-release',0))`;
  await tx`lock table pac.surface_definitions in share row exclusive mode`;
  const locks=baseline.surfaces.filter(r=>r.definitionExists&&r.stateHash).map(r=>r.surfaceId+':'+r.scope).sort();
  await tx`select pg_advisory_xact_lock(hashtextextended(k,0)) from unnest(${locks}::text[]) k`;
  await tx`select content_item_id from pac.content_items where content_item_id=any(${bundle.pages.map(p=>p.id)}) for update`;
  stage='compare_current_state';assertBaseline(baseline,await inspectMetadata(tx,bundle));
  const originals=await originalHashes(tx);
  stage='publish_surfaces';
  for(const item of plan.plans.filter(p=>p.kind==='surface')){
   if(item.action.startsWith('preserve'))continue;
   const surface=bundle.surfaces.find(s=>s.surfaceId===item.id);
   if(item.action==='register_publish'){
    await tx`insert into pac.surface_definitions(surface_id,route_pattern,staff_label,scope_policy,schema_version,field_contract,protected_fields,required_review_dimensions,active,registered_by) values(${surface.surfaceId},${surface.routePattern},${surface.staffLabel},${surface.scopePolicy},1,${tx.json(surface.fieldContract)},${surface.protectedFields},${surface.requiredReviewDimensions},true,'owner-authorized-current-program-release')`;
    receipt.definitionChanges.push({id:item.id,action:'registered',definitionHash:hash(surface)});
   }else if(item.definitionChanged){
    await tx`update pac.surface_definitions set field_contract=${tx.json(surface.fieldContract)},protected_fields=${surface.protectedFields},required_review_dimensions=${surface.requiredReviewDimensions} where surface_id=${item.id}`;
    receipt.definitionChanges.push({id:item.id,action:'compatible_extension',definitionHash:hash(surface)});
   }
   if(item.action==='already_current')continue;
   const [row]=await tx`select pac.save_owner_approved_surface(${item.scope},${item.id},${item.expectedRevisionId??null}::uuid,${item.publicationDecisionId??null}::bigint,${tx.json(surface.document)},'Publish the current program wording and resources already reviewed and approved by the program owner for this release.') state`;
   if(hash(row.state.effective?.document)!==hash(surface.document))throw Error('Published surface differs from current approved values: '+item.id);
   receipt.publications.push({kind:'surface',id:item.id,scope:item.scope,previousRevisionId:item.expectedRevisionId??null,revisionId:row.state.effective.revisionId,publicationDecisionId:row.state.effective.publicationDecisionId,approvedDocumentHash:hash(surface.document),changedFields:item.changedFields});
  }
  stage='publish_home_footer';
  for(const item of plan.plans.filter(p=>p.kind==='page'&&p.action==='publish_current')){
   const page=bundle.pages.find(p=>p.id===item.id);const [row]=await tx`select pac.save_owner_approved_page_block(${item.scope},${item.id},${item.expectedRevisionId}::uuid,${item.publicationDecisionId}::bigint,${tx.json(page.copy)},'Publish the current Home or footer wording already approved by the program owner for this release.') state`;
   if(hash(row.state.copy)!==hash(page.copy)||row.state.hasUnpublishedChanges||!row.state.isPublished)throw Error('Published page differs: '+item.id);
   receipt.publications.push({kind:'page',id:item.id,scope:item.scope,previousRevisionId:item.expectedRevisionId,revisionId:row.state.publishedRevisionId,publicationDecisionId:row.state.publicationDecisionId,approvedCopyHash:hash(page.copy),changedFields:item.changedFields});
  }
  stage='verify_preserved_sources';const after=await originalHashes(tx);
  for(const family of ['sources','revisions']){const values=new Map(after[family].map(r=>[r.id,r.hash]));if(originals[family].some(r=>values.get(r.id)!==r.hash))throw Error('An original source or canonical revision changed.');}
  receipt.sourcePreservation={originalSourceRows:originals.sources.length,originalCanonicalRevisions:originals.revisions.length,allOriginalRowsUnchanged:true,beforeHashes:{sources:hash(originals.sources),revisions:hash(originals.revisions)}};
  stage='verify_preserved_decisions_and_drafts';const afterMetadata=await inspectMetadata(tx,bundle);
  for(const item of plan.plans.filter(p=>p.action.startsWith('preserve'))){if(item.kind==='surface'){const old=baseline.surfaces.find(r=>r.surfaceId===item.id&&r.scope===item.scope);const current=afterMetadata.surfaces.find(r=>r.surfaceId===item.id&&r.scope===item.scope);if(old.stateHash!==current.stateHash)throw Error('Preserved surface state changed: '+item.id);}else{const old=baseline.pages.find(r=>r.id===item.id),current=afterMetadata.pages.find(r=>r.id===item.id);if(old.stateHash!==current.stateHash)throw Error('Preserved page state changed: '+item.id);}}
  for(const old of baseline.surfaces.filter(r=>r.hasDraft||r.decision==='withdraw')){const current=afterMetadata.surfaces.find(r=>r.surfaceId===old.surfaceId&&r.scope===old.scope);if(current.stateHash!==old.stateHash)throw Error('An owner draft or withdrawal changed.');}
  receipt.expectedPublications=await publicationMetadata(tx);
  receipt.status=apply?'ready_to_commit':'validated_and_rolled_back';if(!apply)throw rollback;
 });
 receipt.databaseCommitted=true;receipt.status='committed';stage='restricted_runtime_readback';
 const runtime=postgres(process.env.PAC_RUNTIME_DATABASE_URL,{ssl:ssl(process.env.PAC_RUNTIME_DATABASE_URL),max:1,prepare:false,onnotice:()=>{}});
 try{const current=await publicationMetadata(runtime);if(hash(current)!==hash(receipt.expectedPublications))throw Error('Restricted runtime publication readback differs.');receipt.runtimeReads={verified:true,surfaceScopeReads:current.surfaces.length,pageScopeReads:current.pages.length};receipt.status='committed_and_verified';}finally{await runtime.end({timeout:5});}
}catch(error){if(error!==rollback){failure=error;receipt.status=receipt.databaseCommitted?'committed_verification_failed':'rolled_back_error';receipt.failure={stage,code:error.code??error.name,message:error.code?'Database validation failed; no SQL values included.':error.message};}}
finally{receipt.finishedAt=new Date().toISOString();await sql.end({timeout:5});writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');}
console.log(JSON.stringify({status:receipt.status,databaseCommitted:receipt.databaseCommitted,publications:receipt.publications.length,definitions:receipt.definitionChanges.length,receipt:receiptPath,...(receipt.failure?{failure:receipt.failure}:{})}));if(failure)process.exitCode=1;
