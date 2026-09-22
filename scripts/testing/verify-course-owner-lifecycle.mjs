import postgres from 'postgres';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const databaseUrl=process.env.PAC_RUNTIME_DATABASE_URL;
if(!databaseUrl) throw new Error('Set PAC_RUNTIME_DATABASE_URL to a disposable local test database.');
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(databaseUrl).hostname)) throw new Error('This verification requires a disposable local database.');
const sql=postgres(databaseUrl,{max:1,prepare:false});
const receipt={checkedAt:new Date().toISOString(),environment:'local runtime database role; transaction rolled back',checks:[],failures:[]};
const values=state=>state.effective.values??state.effective.document.values;
try{await sql.begin(async tx=>{
 const id='course.anti-racism-resource';
 const state=async(scope)=> (await tx`select pac.read_surface_editing_state(${scope},${id}) as state`)[0].state;
 const original=await state('one-dhs');const source=original.effective.document??{schemaVersion:1,surfaceId:id,scope:'one-dhs',values:original.effective.values};
 const changed=structuredClone(source);changed.values.pack.course.subtitle='A verified owner edit for this local test.';
 const saved=(await tx`select pac.save_owner_approved_surface('one-dhs',${id},${original.expectedRevisionId}::uuid,${original.latestDecision.publicationDecisionId}::bigint,${tx.json(changed)},'Verify owner course editing.') as state`)[0].state;
 assert.equal(values(await state('one-dhs')).pack.course.subtitle,changed.values.pack.course.subtitle);receipt.checks.push('Owner save and reload exact edited content');
 assert.equal(values(await state('dsd')).pack.course.subtitle,changed.values.pack.course.subtitle);receipt.checks.push('DSD inherits current One DHS revision');
 let conflict=false;try{await tx.savepoint(async sp=>{await sp`select pac.save_owner_approved_surface('one-dhs',${id},${original.expectedRevisionId}::uuid,${original.latestDecision.publicationDecisionId}::bigint,${sp.json(changed)},'Verify stale edit protection.')`;});}catch(e){conflict=e.code==='40001';}assert.ok(conflict);receipt.checks.push('Stale concurrent save rejected without overwriting');
 const masked=(await tx`select pac.withdraw_surface_publication('dsd',${id},${saved.expectedRevisionId}::uuid,null::bigint,'Verify scoped course withdrawal.') as state`)[0].state;
 assert.equal((await tx`select * from pac.read_surface_publication('dsd',${id})`).length,0);assert.equal((await tx`select * from pac.read_surface_publication('one-dhs',${id})`).length,1);receipt.checks.push('DSD withdrawal hides only its scope');
 await tx`select pac.resume_surface_inheritance('dsd',${id},${masked.latestDecision.publicationDecisionId}::bigint,'Restore inherited course access.')`;
 assert.equal((await tx`select * from pac.read_surface_publication('dsd',${id})`).length,1);receipt.checks.push('Resume inheritance restores access');
 await tx`select pac.restore_surface_revision('one-dhs',${id},${original.expectedRevisionId}::uuid,${saved.latestDecision.publicationDecisionId}::bigint,'Restore the original course revision.')`;
 assert.deepEqual(values(await state('one-dhs')),source.values);receipt.checks.push('Restore exact original content');
 let invalid=false;const bad=structuredClone(changed);bad.values.pack.course.lessons[0].blocks[0].type='unsupported';const current=await state('one-dhs');
 try{await tx.savepoint(async sp=>{await sp`select pac.save_owner_approved_surface('one-dhs',${id},${current.expectedRevisionId}::uuid,${current.latestDecision.publicationDecisionId}::bigint,${sp.json(bad)},'Verify structured course validation.')`;});}catch(e){invalid=e.code==='22023';}assert.ok(invalid);receipt.checks.push('Unknown block rejected at database boundary');
 throw new Error('ROLLBACK_VERIFIED_TEST');
});}catch(e){if(e.message!=='ROLLBACK_VERIFIED_TEST'){receipt.failures.push(e.message);process.exitCode=1;}}
finally{await sql.end();writeFileSync('evidence/next-pass-2026-09-08/course-owner-lifecycle.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));}
