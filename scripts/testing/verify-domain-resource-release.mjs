import { spawnSync } from "node:child_process";
import { mkdirSync,readFileSync,writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import path from "node:path";
import postgres from "postgres";
const root=process.cwd(),bin='C:/Program Files/PostgreSQL/16/bin';
const databaseName=`pac_domain_test_${randomBytes(6).toString('hex')}`;
const adminUrl='postgres://pac_audit@127.0.0.1:55439/postgres';
const testUrl=`postgres://pac_audit@127.0.0.1:55439/${databaseName}`;
const runtimeUrl=testUrl.replace('pac_audit@','pac_app_runtime@');
const directory=path.join(root,'.data','domain-release-verification'); mkdirSync(directory,{recursive:true});
const dumpOption=process.argv.slice(2).find(argument=>argument.startsWith("--source-dump="))?.slice(14);
if(process.argv.slice(2).some(argument=>!argument.startsWith("--source-dump=")))throw new Error("Only --source-dump=path is supported.");
const dump=dumpOption?path.resolve(root,dumpOption):path.join(directory,`${databaseName}.dump`);
const admin=postgres(adminUrl,{ssl:false,max:1,prepare:false});
let test,runtime;
const receipt={checkedAt:new Date().toISOString(),environment:'Separate throwaway database copied from the isolated local audit database',checks:[],sourceCommit:'5680911e68dcf07414de5f003b18ac8e813a8cb1'};
const run=(program,args)=>{const result=spawnSync(path.join(bin,program+'.exe'),args,{windowsHide:true,encoding:'utf8',timeout:120000,maxBuffer:4000000});if(result.status!==0)throw new Error(`${program}: ${result.stderr}`);};
try{
 if(!dumpOption)run('pg_dump',['--dbname',adminUrl,'--format=custom','--schema=pac','--no-owner','--file',dump]);
 await admin.unsafe(`create database ${databaseName}`);
 test=postgres(testUrl,{ssl:false,max:1,prepare:false,onnotice:()=>{}});
 await test`create extension if not exists pgcrypto`;
 run('pg_restore',['--dbname',testUrl,'--no-owner','--exit-on-error',dump]);
 const [baseline]=await test`select to_regclass('pac.resource_owner_approvals') present`;
 assert.equal(baseline.present,null,'Use --source-dump=path with a preserved pre-0033 audit backup to repeat this isolated migration test.');
 const [has32]=await test`select to_regclass('pac.page_block_owner_approvals') present`;
 if(!has32.present)await test.unsafe(readFileSync(path.join(root,'db/migrations/0032_pac_owner_approved_page_copy_saves.sql'),'utf8'));
 await test.unsafe(readFileSync(path.join(root,'db/migrations/0033_pac_owner_approved_domain_resources.sql'),'utf8'));
 await test.unsafe(readFileSync(path.join(root,'db/migrations/0034_pac_domain_tool_resource_receipts.sql'),'utf8'));
 runtime=postgres(runtimeUrl,{ssl:false,max:1,prepare:false});
 const audit={trace_id:'eb394c85-6216-422a-9727-b77275db43e6',span_id:'01234567',at:'2026-09-07T23:00:00.000Z',agent_id:'system',agent_version:'0.1.0',tool_name:'citation.attach',autonomy_level_used:'A0',permission_mode:'always',dry_run:false,content_ids_touched:['tool-mn-equity-toolkit'],allowlist_hit:true,ok:true};
 await runtime`insert into pac.runtime_audit_events(event,occurred_at) values(${runtime.json(audit)},${audit.at}::timestamptz)`;
 assert.equal((await runtime`select event from pac.runtime_audit_events where event->>'trace_id'=${audit.trace_id}`)[0].event.content_ids_touched[0],'tool-mn-equity-toolkit');
 await assert.rejects(runtime`insert into pac.runtime_audit_events(event,occurred_at) values(${runtime.json({...audit,content_ids_touched:['tool-employee-123-equity-readiness']})},${audit.at}::timestamptz)`,e=>e.code==='22023');
 receipt.checks.push({check:'Real PostgreSQL citation receipt accepts canonical tool resource IDs and rejects profile-like IDs',passed:true});
 const candidates=JSON.parse(readFileSync(path.join(root,'.data/domain-resource-release.json'),'utf8')).items;
 const [before]=await test`select (select count(*)::int from pac.content_revisions) revisions,(select count(*)::int from pac.review_records) reviews,(select count(*)::int from pac.read_staff_publications('one-dhs',null)) published`;
 const originals=await test`select revision_id,payload_sha256,canonical_payload,content_item_id from pac.content_revisions where canonical_payload->>'assetKind'='domain_resource'`;
 assert.equal(originals.length,34);
 const sourceBefore=await test`select source_item_id,normalized_item_sha256,sensitivity_class,deidentification_status,ordinary_indexing_allowed from pac.source_items where source_item_id like 'donor:domain_resource:%' order by source_item_id`;
 const recoveryCounts=async()=>{const [r]=await test`select (select count(*)::int from pac.content_revisions) revisions,(select count(*)::int from pac.source_items) sources,(select count(*)::int from pac.source_carriers) carriers,(select count(*)::int from pac.resource_owner_approvals) approvals,(select count(*)::int from pac.content_items where restricted) restricted`;return r;};
 const rollbackBefore=await recoveryCounts();
 await assert.rejects(test.begin(async tx=>{
  await tx.unsafe("create function pac.force_domain_test_failure() returns trigger language plpgsql as $$ begin raise exception 'Intentional local publication failure' using errcode='22023'; end $$; create trigger force_domain_test_failure before insert on pac.publication_decisions for each row execute function pac.force_domain_test_failure();");
  const first=originals[0];
  await tx`select pac.release_owner_approved_domain_resource(${first.content_item_id},${first.revision_id}::uuid,${first.payload_sha256})`;
 }),e=>e.code==='22023');
 assert.deepEqual(await recoveryCounts(),rollbackBefore);
 receipt.checks.push({check:'Forced publication failure rolls back revision, source, carrier, owner approval and item visibility changes together',passed:true});
 for(const row of originals){
  const [result]=await test`select pac.release_owner_approved_domain_resource(${row.content_item_id},${row.revision_id}::uuid,${row.payload_sha256}) receipt`;
  assert.equal(result.receipt.replayed,false);
 }
 receipt.checks.push({check:'Released 34 exact originals without fabricating review rows',passed:true});
 const [after]=await test`select (select count(*)::int from pac.content_revisions) revisions,(select count(*)::int from pac.review_records) reviews,(select count(*)::int from pac.resource_owner_approvals) approvals`;
 assert.equal(after.revisions,before.revisions+34);assert.equal(after.reviews,before.reviews);assert.equal(after.approvals,34);
 for(const scope of ['one-dhs','dsd']) {
  const rows=await runtime`select * from pac.read_staff_publications(${scope},null)`;
  assert.equal(rows.length,before.published+34);
  for(const original of candidates){const row=rows.find(r=>r.content_item_id===original.id);assert.ok(row);assert.deepEqual(row.canonical_payload,original);assert.equal(row.canonical_payload.accessibility,'pending');}
  receipt.checks.push({check:`All 59 resources readable in ${scope}; 34 originals exactly equal and accessibility pending`,passed:true});
 }
 const sourceAfter=await test`select source_item_id,normalized_item_sha256,sensitivity_class,deidentification_status,ordinary_indexing_allowed from pac.source_items where source_item_id like 'donor:domain_resource:%' order by source_item_id`;
 assert.deepEqual(sourceAfter,sourceBefore);
 const oldRows=await test`select revision_id,payload_sha256,canonical_payload,content_item_id from pac.content_revisions where canonical_payload->>'assetKind'='domain_resource'`;
 assert.deepEqual(oldRows,originals);
 receipt.checks.push({check:'All original donor revisions and source classifications remain unchanged',passed:true});
 const row=originals[0];
 const [replayed]=await test`select pac.release_owner_approved_domain_resource(${row.content_item_id},${row.revision_id}::uuid,${row.payload_sha256}) receipt`;
 assert.equal(replayed.receipt.replayed,true);
 await assert.rejects(runtime`select pac.release_owner_approved_domain_resource(${row.content_item_id},${row.revision_id}::uuid,${row.payload_sha256})`,e=>e.code==='42501');
 await assert.rejects(runtime`select * from pac.resource_owner_approvals`,e=>e.code==='42501');
 await assert.rejects(test`update pac.resource_owner_approvals set approved_by='changed' where content_item_id=${row.content_item_id}`);
 await assert.rejects(test`select pac.release_owner_approved_domain_resource(${row.content_item_id},${row.revision_id}::uuid,${'0'.repeat(64)})`,e=>e.code==='40001');
 const [course]=await test`select revision_id,payload_sha256,content_item_id from pac.content_revisions where canonical_payload->>'assetKind'='course' limit 1`;
 assert.ok(course,'A real preserved course candidate must be present for the negative check');
 await assert.rejects(test`select pac.release_owner_approved_domain_resource(${course.content_item_id},${course.revision_id}::uuid,${course.payload_sha256})`,e=>e.code==='22023');
 receipt.checks.push({check:'Idempotent replay; stale hash, course, runtime release and direct approval access denied; immutable approvals',passed:true});
 const [pub]=await runtime`select * from pac.read_staff_publications('one-dhs',${row.content_item_id})`;
 const [state]=await runtime`select pac.read_resource_release_state('one-dhs',${row.content_item_id}) state`;
 const [withdrawn]=await runtime`select pac.withdraw_resource_publication('one-dhs',${row.content_item_id},${pub.revision_id}::uuid,${state.state.scopeDecisionId}::bigint,'Temporary local verification withdrawal.') state`;
 assert.equal((await runtime`select * from pac.read_staff_publications('one-dhs',${row.content_item_id})`).length,0);
 assert.equal((await runtime`select * from pac.read_staff_publications('dsd',${row.content_item_id})`).length,0);
 await assert.rejects(test`select pac.release_owner_approved_domain_resource(${row.content_item_id},${row.revision_id}::uuid,${row.payload_sha256})`,e=>e.code==='40001');
 await runtime`select pac.republish_resource_revision('one-dhs',${row.content_item_id},${pub.revision_id}::uuid,${withdrawn.state.scopeDecisionId}::bigint,'Restore verified original after local check.','S1',true,'Owner-approved source restored for the staff web application.')`;
 assert.equal((await runtime`select * from pac.read_staff_publications('dsd',${row.content_item_id})`).length,1);
 receipt.checks.push({check:'Withdrawal hides the resource in both inherited scopes; release script does not reactivate it; existing owner restore works without new reviews',passed:true});
 receipt.counts={before,after};
 writeFileSync(path.join(root,'evidence/local-audit-2026-09-07/domain-resource-release-postgres.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify(receipt,null,2));
}finally{
 await runtime?.end({timeout:5});await test?.end({timeout:5});
 if(/^pac_domain_test_[a-f0-9]{12}$/.test(databaseName))await admin.unsafe(`drop database if exists ${databaseName} with (force)`);
 await admin.end({timeout:5});
}
