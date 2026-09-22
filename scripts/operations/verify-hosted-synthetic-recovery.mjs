import { randomUUID, createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
if (!process.argv.includes('--confirm-isolated-hosted-drill')) { console.error('This drill creates isolated hosted schemas. Supply the explicit drill flag only within an authorized recovery task.'); process.exit(2); }
if (!process.env.PAC_DATABASE_URL) { console.error('The recovery database credential is not configured.'); process.exit(2); }
const id = randomUUID().replaceAll('-','');
const schema = 'pac_recovery_' + id;
const restored = 'pac_restored_' + id;
const sql = postgres(process.env.PAC_DATABASE_URL, {ssl:'require',max:1,connect_timeout:15,onnotice:()=>{}});
const report={kind:'hosted-synthetic-recovery',at:new Date().toISOString(),schemas:[schema,restored],passed:false,productionDataRead:false,productionDataChanged:false,limit:'Synthetic expired consultation only in isolated schemas. This is not provider-managed backup, PITR, full production recovery, or a live intake submission.'};
const folder=path.resolve('evidence/program-activation-2026-09-08');mkdirSync(folder,{recursive:true});
const run = async (statement, parameters) => { report.phase = statement.split(" ").slice(0, 3).join(" "); return sql.unsafe(statement, parameters); };
try {
 const record={record_type:'consultation_tombstone',request_id:'CR-20260908-9998',status:'expired',access_key_hash:'a'.repeat(64),access_key_version:'sha256-v1',retention_policy_id:'synthetic-recovery-only',retention_expires_at:'2026-07-01T00:00:00.000Z',redacted_at:'2026-07-01T00:00:00.000Z',updated_at:'2026-07-01T00:00:00.000Z',version:2};
 await run('create schema '+schema);await run('create schema '+restored);
 await run('revoke all on schema '+schema+' from public');await run('revoke all on schema '+restored+' from public');
 await run('create table '+schema+'.runtime_work_objects (like pac.runtime_work_objects including all)');
 await run('create table '+restored+'.runtime_work_objects (like pac.runtime_work_objects including all)');
 await run('insert into '+schema+'.runtime_work_objects (work_kind,object_id,value) values ($1,$2,$3::text::jsonb)',['consult_request',record.request_id,JSON.stringify(record)]);
 const rows=await run('select work_kind,object_id,value from '+schema+'.runtime_work_objects');
 const file=path.join(folder,'synthetic-consultation-backup.json');writeFileSync(file,JSON.stringify(rows));
 const recovered=JSON.parse(readFileSync(file,'utf8'));
 for(const row of recovered)await run('insert into '+restored+'.runtime_work_objects (work_kind,object_id,value) values ($1,$2,$3::text::jsonb)',[row.work_kind,row.object_id,JSON.stringify(row.value)]);
 const [original]=await run('select md5(value::text) as digest from '+schema+'.runtime_work_objects');
 const [copy]=await run('select md5(value::text) as digest from '+restored+'.runtime_work_objects');
 if(original.digest!==copy.digest)throw new Error('digest_mismatch');
 const removed=await run('delete from '+restored+'.runtime_work_objects where work_kind=$1 and object_id=$2 and value->>\'record_type\'=$3 returning object_id',['consult_request',record.request_id,'consultation_tombstone']);
 report.passed=removed.length===1;report.restoredRecords=recovered.length;report.digestMatch=true;report.terminalSyntheticDeletion=removed.length;report.backupSha256=createHash('sha256').update(readFileSync(file)).digest('hex');report.schemasRetainedForReview=true;
} catch (error) {report.error='hosted_synthetic_recovery_failed'; report.databaseCode = /^[A-Z0-9]{5}$/.test(error?.code ?? '') ? error.code : 'unclassified'; report.constraint = error?.constraint_name ?? null; report.failureClass=error?.name; report.failedInvariant = error?.message === 'digest_mismatch' ? 'digest_mismatch' : null;process.exitCode=1;}
finally {await sql.end({timeout:3});writeFileSync(path.join(folder,'hosted-synthetic-recovery.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
