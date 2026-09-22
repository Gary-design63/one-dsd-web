import {spawnSync} from "node:child_process";
import {mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {randomBytes} from "node:crypto";
import assert from "node:assert/strict";
import path from "node:path";
import postgres from "postgres";
const root=process.cwd(),bin='C:/Program Files/PostgreSQL/16/bin';
const databaseName=`pac_depth_test_${randomBytes(6).toString('hex')}`;
const auditUrl='postgres://pac_audit@127.0.0.1:55439/postgres';
const testUrl=`postgres://pac_audit@127.0.0.1:55439/${databaseName}`;
const runtimeUrl=testUrl.replace('pac_audit@','pac_app_runtime@');
const directory=path.join(root,'.data','restored-depth-verification',databaseName);mkdirSync(directory,{recursive:true});
const admin=postgres(auditUrl,{ssl:false,max:1,prepare:false});let test,runtime;
const receipt={checkedAt:new Date().toISOString(),environment:'Separate throwaway copy of local audit PostgreSQL; original audit state unchanged',checks:[]};
const run=(program,args,env)=>spawnSync(program,args,{cwd:root,windowsHide:true,encoding:'utf8',timeout:120000,maxBuffer:4000000,...(env?{env}:{})});
const requireSuccess=result=>{if(result.status!==0)throw new Error(result.stderr||result.stdout);};
const release=(label,apply=true)=>{
 const file=path.join(directory,label+'.json');
 const result=run(process.execPath,['scripts/db/release-restored-depth.mjs',...(apply?['--apply']:[]),'--receipt='+file],{...process.env,PAC_DATABASE_URL:testUrl,PAC_RUNTIME_DATABASE_URL:runtimeUrl});
 return {result,receipt:JSON.parse(readFileSync(file,'utf8'))};
};
try{
 requireSuccess(run(path.join(bin,'pg_dump.exe'),['--dbname',auditUrl,'--format=custom','--schema=pac','--no-owner','--file',path.join(directory,'baseline.dump')]));
 await admin.unsafe(`create database ${databaseName}`);
 test=postgres(testUrl,{ssl:false,max:1,prepare:false});await test`create extension if not exists pgcrypto`;
 requireSuccess(run(path.join(bin,'pg_restore.exe'),['--dbname',testUrl,'--no-owner','--exit-on-error',path.join(directory,'baseline.dump')]));
 runtime=postgres(runtimeUrl,{ssl:false,max:1,prepare:false});
 const baseline=release('baseline');requireSuccess(baseline.result);
 const state=async(scope,id)=>(await runtime`select pac.read_surface_editing_state(${scope},${id}) state`)[0].state;
 const withdraw=async(scope,id)=>{const current=await state(scope,id);assert.ok(current.effective);await runtime`select pac.withdraw_surface_publication(${scope},${id},${current.effective.revisionId}::uuid,${current.latestDecision?.publicationDecisionId??null}::bigint,'Synthetic withdrawal in an isolated release regression.')`;return current;};
 await withdraw('one-dhs','domain.workforce');
 await withdraw('dsd','domain.measurement');
 const culture=await withdraw('one-dhs','domain.culture-trust');
 const draft=async(id,document)=>{const current=await state('one-dhs',id);document.values.title+=' — isolated draft';await runtime`select pac.create_surface_draft('one-dhs',${id},${current.expectedRevisionId}::uuid,${runtime.json(document)},'Synthetic unpublished draft in an isolated release regression.')`;};
 await draft('domain.culture-trust',structuredClone(culture.effective.document));
 const engagement=await state('one-dhs','domain.community-engagement');
 await draft('domain.community-engagement',structuredClone(engagement.effective.document));
 const history=async()=>({revisions:await test`select * from pac.surface_revisions order by revision_id`,decisions:await test`select * from pac.surface_publication_decisions order by publication_decision_id`,approvals:await test`select * from pac.surface_owner_approvals order by revision_id`});
 const before=await history();
 const afterWithdrawal=release('preserved-choices');requireSuccess(afterWithdrawal.result);
 for(const [surfaceId,scope]of [['domain.workforce','one-dhs'],['domain.workforce','dsd'],['domain.measurement','dsd'],['domain.culture-trust','one-dhs'],['domain.culture-trust','dsd']]){
  const row=afterWithdrawal.receipt.scopedReads.find(row=>row.surfaceId===surfaceId&&row.scope===scope);
  assert.deepEqual(row,{surfaceId,scope,readable:false,expected:false});
 }
 assert.equal(afterWithdrawal.receipt.scopedReads.find(row=>row.surfaceId==='domain.measurement'&&row.scope==='one-dhs').readable,true);
 assert.ok((await state('one-dhs','domain.culture-trust')).draft);
 assert.ok((await state('one-dhs','domain.community-engagement')).draft);
 assert.deepEqual(await history(),before);
 receipt.checks.push({check:'Agency withdrawal remains hidden in both inherited scopes; DSD-only withdrawal leaves agency content visible; withdrawn and currently published drafts remain unchanged',passed:true});
 const repeated=release('idempotent');requireSuccess(repeated.result);assert.deepEqual(await history(),before);assert.equal(repeated.receipt.published.length,0);
 receipt.checks.push({check:'Repeated full release succeeds without reactivating withdrawn content, publishing drafts, or changing original history',passed:true});
 const dry=release('dry-run',false);requireSuccess(dry.result);assert.equal(dry.receipt.databaseCommitted,false);assert.equal(dry.receipt.mode,'validated_and_rolled_back');assert.deepEqual(await history(),before);
 receipt.checks.push({check:'Dry run captures expected availability but rolls back all changes',passed:true});
 await test`revoke execute on function pac.read_surface_publication(text,text) from pac_app_runtime`;
 const denied=release('runtime-denied');assert.notEqual(denied.result.status,0);assert.equal(denied.receipt.databaseCommitted,true);assert.equal(denied.receipt.failure.code,'42501');
 await test`grant execute on function pac.read_surface_publication(text,text) to pac_app_runtime`;
 assert.deepEqual(await history(),before);
 receipt.checks.push({check:'Unexpected runtime permission failure is not swallowed as intentional unavailability; failure receipt accurately reports commit state',passed:true});
 receipt.scopeChecks=afterWithdrawal.receipt.scopedReads.length;
 receipt.intentionallyUnavailableScopeChecks=5;
 writeFileSync(path.join(root,'evidence/local-audit-2026-09-07/restored-depth-release-postgres.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
}finally{
 await runtime?.end({timeout:5});await test?.end({timeout:5});
 if(/^pac_depth_test_[a-f0-9]{12}$/.test(databaseName))await admin.unsafe(`drop database if exists ${databaseName} with (force)`);
 await admin.end({timeout:5});
}
