import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync} from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { writeEvidenceReceipt } from "@/tests/helpers/evidence-receipts";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { fixtureResource } from "./contributor-resource-fixtures";
import { createAskResponseRecord } from "@/lib/intelligence/observability/ask-records";
const ROOT=path.resolve(import.meta.dirname,"..");
const REVIEW_DIMENSIONS=["language_alignment","factual_currentness","accessibility","scope","placement","rights_and_consent","community_representation","legal_policy"];
type DB=ReturnType<typeof postgres>;
const E={identity:"recovery-identity-test",identityHash:"a".repeat(64),contribution:"recovery-contribution-test",contributionHash:"b".repeat(64)};
const RESOURCE={...fixtureResource,id:"contributor-resource-test",title:"Practical access guidance",summary:"A practical resource for colleagues.",body:["Use these steps to prepare an accessible meeting."],whyItMatters:"Clear preparation makes participation easier.",owner:"Program resources",tags:["access"],scope:"agencywide" as const,status:"approved" as const,accessibility:"reviewed" as const};
const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const digest=(label:string)=>hash("disposable-recovery-test:"+label);
const credential="$pac-scrypt$v=1$ln=17$r=8$p=1$"+"A".repeat(22)+"$"+"B".repeat(43);
function pgBinary(name:string){const executable=name+(process.platform==="win32"?".exe":"");return [process.env.PAC_TEST_POSTGRES_BIN?path.join(process.env.PAC_TEST_POSTGRES_BIN,executable):"",path.join(process.env.ProgramFiles??"C:/Program Files","PostgreSQL","16","bin",executable),"/usr/lib/postgresql/16/bin/"+executable].find(p=>p&&existsSync(p));}
function run(executable:string,args:string[]){const r=spawnSync(executable,args,{stdio:"ignore",windowsHide:true,timeout:60000});if(r.status!==0)throw new Error(path.basename(executable)+" failed");}
async function unusedPort():Promise<number>{return new Promise((resolve,reject)=>{const server=createServer();server.once("error",reject);server.listen(0,"127.0.0.1",()=>{const address=server.address();if(!address||typeof address==="string"){server.close();reject(new Error("Missing local port"));return;}server.close(e=>e?reject(e):resolve(address.port));});});}
describe("isolated PostgreSQL old-backup containment and authoritative withdrawal replay",()=>{
 let temporaryRoot="",dataDirectory="",adminUrl="";let admin:DB,runtime:DB,contributor:DB,restored:DB,restoredRuntime:DB,restoredContributor:DB,restoredBroker:DB;
 const ownerSession=digest("owner-session"), memberSession=digest("member-session");
 const identityParams=(token=ownerSession)=>[token,"local",E.identity,E.identityHash];
 async function activate(db:DB,feature:string,state="active"){return db.unsafe("select pac.record_protected_feature_activation($1,$2,$3,$4,$5,$6)",["local",feature,state,feature==="protected_identity"?E.identity:E.contribution,feature==="protected_identity"?E.identityHash:E.contributionHash,"Disposable recovery verification only."]);}
 async function askList(db:DB){return db.unsafe("select * from pac.list_ask_response_records(10,null,null,clock_timestamp())");}
 async function currentPublication(db:DB){const [r]=await db.unsafe<{state:{scopeDecisionId:number;published:{revisionId:string}|null;withdrawn:boolean}}[]>("select pac.read_resource_release_state('one-dhs',$1) as state",[RESOURCE.id]);return r.state;}
  async function seed(){
  const [carrier]=await admin.unsafe<{carrier_id:string}[]>("insert into pac.source_carriers(logical_key,media_type,original_name,captured_by) values('contributor-resource-fixture','application/json','resource-fixture.json','fixture-owner') returning carrier_id");
  await admin.unsafe("insert into pac.source_items(source_item_id,source_business_id,carrier_id,title,normalized_payload,normalized_item_sha256,hash_algorithm,hash_algorithm_version,owner_approval_status,accounting_status,access_scope,sensitivity_class,deidentification_status,ordinary_indexing_allowed,model_context_allowed) values('contributor-resource-source','contributor-resource-source',$1::uuid,'Approved fixture source',$2::text::jsonb,$3,'sha256','1','owner_approved_for_ingestion','accounted','internal_source','S1','not_needed',true,false)",[carrier.carrier_id,JSON.stringify(RESOURCE),hash(RESOURCE)]);
  await admin.unsafe("insert into pac.content_items(content_item_id,content_kind,default_scope_id,staff_label,created_by,sensitivity_class,restricted) values($1,'resource','one-dhs',$2,'fixture-owner','S1',false)",[RESOURCE.id,RESOURCE.title]);
  const [rev]=await admin.unsafe<{revision_id:string}[]>("insert into pac.content_revisions(content_item_id,revision_number,canonical_payload,change_summary,created_by,sensitivity_class,ordinary_indexing_allowed,model_context_allowed,required_review_dimensions) values($1,1,$2::text::jsonb,'Approved fixture original','fixture-owner','S1',true,false,$3::text[]) returning revision_id",[RESOURCE.id,JSON.stringify(RESOURCE),REVIEW_DIMENSIONS]);
  await admin.unsafe("insert into pac.revision_sources(revision_id,source_item_id,relationship) values($1::uuid,'contributor-resource-source','primary')",[rev.revision_id]);
  await admin.unsafe("insert into pac.review_records(revision_id,dimension,status,reviewer_role,reviewer_id) select $1::uuid,dimension,'pass','program_steward','fixture-original-reviewer' from unnest($2::text[]) dimension",[rev.revision_id,REVIEW_DIMENSIONS]);
  await admin.unsafe("insert into pac.publication_decisions(content_item_id,revision_id,scope_id,decision,gate_snapshot,decided_by,reason,sensitivity_class,unauthenticated_exposure_permitted,exposure_reason) values($1,$2::uuid,'one-dhs','publish','{}'::jsonb,'fixture-owner','Approved fixture original','S1',true,'Publicly suitable practice guidance.')",[RESOURCE.id,rev.revision_id]);
 }

 beforeAll(async()=>{
   for(const binary of ["initdb","pg_ctl","pg_dump","pg_restore"])if(!pgBinary(binary))throw new Error("Local PostgreSQL "+binary+" is required; this drill must not silently skip.");
   temporaryRoot=mkdtempSync(path.join(tmpdir(),"pac-program-recovery-"));dataDirectory=path.join(temporaryRoot,"data");const port=await unusedPort();
   run(pgBinary("initdb")!,["-D",dataDirectory,"--username=pac_test","--auth=trust","--encoding=UTF8","--no-locale"]);
   run(pgBinary("pg_ctl")!,["-D",dataDirectory,"-l",path.join(temporaryRoot,"postgres.log"),"-o",localPostgresServerOptions(port,temporaryRoot),"-w","start"]);
   adminUrl="postgresql://pac_test@127.0.0.1:"+port+"/postgres";admin=postgres(adminUrl,{ssl:false,max:1,prepare:false,onnotice:()=>undefined});
   const migrations=readdirSync(path.join(ROOT,"db/migrations")).filter(name=>/^\d{4}_.+\.sql$/.test(name)).sort();
   expect(migrations).toContain("0046_pac_ask_deletion_and_restore_preparation.sql");expect(migrations).toContain("0047_pac_ask_evidence_claims.sql");
   for(const name of migrations){try{await admin.unsafe(readFileSync(path.join(ROOT,"db/migrations",name),"utf8"));}catch(error){const e=error as {message?:string;code?:string};throw Error("Recovery migration failed "+name+": "+e.code+" "+e.message);}}
   runtime=postgres(adminUrl.replace("pac_test@","pac_app_runtime@"),{ssl:false,max:1,prepare:false});
   contributor=postgres(adminUrl.replace("pac_test@","pac_contributor_runtime@"),{ssl:false,max:1,prepare:false});
   await seed();await activate(admin,"protected_identity");await activate(admin,"protected_contribution");
 },120000);
 afterAll(async()=>{
   for(const db of [restoredBroker,restoredContributor,restoredRuntime,restored,contributor,runtime,admin])await db?.end({timeout:5}).catch(()=>undefined);
   const pgctl=pgBinary("pg_ctl");if(pgctl&&dataDirectory&&existsSync(dataDirectory))spawnSync(pgctl,["-D",dataDirectory,"-m","immediate","-w","stop"],{stdio:"ignore",windowsHide:true,timeout:30000});
   if(temporaryRoot&&path.dirname(temporaryRoot)===path.resolve(tmpdir())&&path.basename(temporaryRoot).startsWith("pac-program-recovery-"))rmSync(temporaryRoot,{recursive:true,force:true});
 },45000);
 it("restores an actual earlier dump without resurrecting deleted answers or named access",async()=>{
   const future=new Date(Date.now()+3600000).toISOString(),ownerInvite=digest("owner-invite");
   await admin.unsafe("select * from pac.bootstrap_program_owner_invitation($1,$2,$3,$4,$5::timestamptz,$6,$7)",["local","test.owner","Synthetic Recovery Owner",ownerInvite,future,E.identity,E.identityHash]);
   await contributor.unsafe("select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",[ownerInvite,credential,ownerSession,"local",E.identity,E.identityHash]);
   const memberInvite=digest("member-invite");
   await contributor.unsafe("select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",[...identityParams(),"test.member","Synthetic Recovery Member",memberInvite,future]);
   const [member]=await contributor.unsafe<{account_id:string;session_id:string}[]>("select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",[memberInvite,credential,memberSession,"local",E.identity,E.identityHash]);
   const [grant]=await contributor.unsafe<{grant_id:string}[]>("select * from pac.issue_program_access_grant($1,$2,$3,$4,$5::uuid,$6,$7,$8::timestamptz,$9)",[...identityParams(),member.account_id,"one-dhs","content_contributor",null,"Synthetic recovery permission."]);
   const pendingDigest=digest("pending-invite");
   const [pending]=await contributor.unsafe<{invitation_id:string}[]>("select * from pac.create_program_account_invitation($1,$2,$3,$4,$5,$6,$7,$8::timestamptz)",[...identityParams(),"test.pending","Synthetic Pending Member",pendingDigest,future]);
   const answer=createAskResponseRecord({traceId:randomUUID(),programScope:"one-dhs",researchMode:"program_only",status:"answered",httpStatus:200,question:"Synthetic old-backup question.",researchStatus:"not_requested",response:{kind:"answer",answer:{shortAnswer:"Synthetic answer to delete after backup.",whyItMatters:"",sources:[],limits:[],nextActions:[]}}});
   await runtime.unsafe("select pac.append_ask_response_record($1::text::jsonb)",[JSON.stringify(answer)]);
   expect(await askList(runtime)).toHaveLength(1);
   expect(await contributor.unsafe("select * from pac.read_program_account_session($1,$2,$3,$4)",identityParams(memberSession))).toHaveLength(1);
   const dump=path.join(temporaryRoot,"before-changes.dump");
   run(pgBinary("pg_dump")!,["--format=custom","--file",dump,"--dbname",adminUrl]);
   const dumpSha256=createHash("sha256").update(readFileSync(dump)).digest("hex");
   await runtime.unsafe("select pac.delete_ask_response_records($1::text::jsonb)",[JSON.stringify([answer.id])]);
   await expect(runtime.unsafe("select pac.append_ask_response_record($1::text::jsonb)",[JSON.stringify(answer)])).rejects.toMatchObject({code:"55000"});
   await contributor.unsafe("select pac.revoke_program_access_grant($1,$2,$3,$4,$5::uuid,$6)",[...identityParams(),grant.grant_id,"Authority ended after the backup."]);
   await contributor.unsafe("select pac.end_program_account_session($1,$2)",[memberSession,"local"]);
   await admin.unsafe("alter table pac.program_account_invitation_secrets disable trigger program_account_invitation_secret_guard");
   try{await admin.unsafe("update pac.program_account_invitation_secrets set expires_at=clock_timestamp()-interval '1 minute' where invitation_id=$1::uuid",[pending.invitation_id]);}
   finally{await admin.unsafe("alter table pac.program_account_invitation_secrets enable trigger program_account_invitation_secret_guard");}
   expect((await contributor.unsafe("select * from pac.purge_expired_program_security_records()"))[0].expired_invitations_closed).toBe(1);
   const publication=await currentPublication(runtime);
   await runtime.unsafe("select pac.withdraw_resource_publication($1,$2,$3::uuid,$4::bigint,$5)",["one-dhs",RESOURCE.id,publication.published!.revisionId,publication.scopeDecisionId,"Withdrawn after the backup; authoritative current decision."]);
   await activate(admin,"protected_contribution","inactive");await activate(admin,"protected_identity","inactive");
   expect(await askList(runtime)).toEqual([]);
   const current=await currentPublication(runtime);expect(current.withdrawn).toBe(true);
   expect(await runtime.unsafe("select * from pac.read_staff_publications('one-dhs',$1)",[RESOURCE.id])).toEqual([]);
   await admin.unsafe("create database pac_restore");
   const restoreUrl=adminUrl.replace("/postgres","/pac_restore");run(pgBinary("pg_restore")!,["--exit-on-error","--no-owner","--dbname",restoreUrl,dump]);
   restored=postgres(restoreUrl,{ssl:false,max:1,prepare:false,onnotice:()=>undefined});
   restoredRuntime=postgres(restoreUrl.replace("pac_test@","pac_app_runtime@"),{ssl:false,max:1,prepare:false});
   restoredContributor=postgres(restoreUrl.replace("pac_test@","pac_contributor_runtime@"),{ssl:false,max:1,prepare:false});
   restoredBroker=postgres(restoreUrl.replace("pac_test@","pac_authentication_broker@"),{ssl:false,max:1,prepare:false});
   // Administrative inspection only: this target has never been exposed to traffic.
   expect((await restored.unsafe("select count(*)::int count from pac.ask_response_records"))[0].count).toBe(1);
   expect((await restored.unsafe("select revoked_at from pac.access_grants where grant_id=$1::uuid",[grant.grant_id]))[0].revoked_at).toBeNull();
   const recoveryId=randomUUID();
   await expect(restoredRuntime.unsafe("select pac.prepare_isolated_program_restore('local',$1::uuid)",[recoveryId])).rejects.toMatchObject({code:"42501"});
   await expect(restoredContributor.unsafe("select pac.prepare_isolated_program_restore('local',$1::uuid)",[recoveryId])).rejects.toMatchObject({code:"42501"});
   const [prepared]=await restored.unsafe<{receipt:Record<string,unknown>}[]>("select pac.prepare_isolated_program_restore('local',$1::uuid) as receipt",[recoveryId]);
   expect(prepared.receipt).toMatchObject({ask_records_excluded:1,named_sessions_revoked:2,invitation_secrets_removed:1,credential_secrets_removed:2});
   expect((await restored.unsafe("select pac.prepare_isolated_program_restore('local',$1::uuid) as receipt",[recoveryId]))[0].receipt).toEqual(prepared.receipt);
   expect(await askList(restoredRuntime)).toEqual([]);
   await expect(restoredRuntime.unsafe("select pac.append_ask_response_record($1::text::jsonb)",[JSON.stringify(answer)])).rejects.toMatchObject({code:"55000"});
   expect(await restoredContributor.unsafe("select * from pac.read_program_account_session($1,$2,$3,$4)",identityParams(memberSession))).toEqual([]);
   expect(await restoredBroker.unsafe("select * from pac_auth.lookup_program_login_credential($1,$2)",["test.member","local"])).toEqual([]);
   await expect(restoredContributor.unsafe("select * from pac.accept_program_account_invitation($1,$2,$3,$4,$5,$6)",[pendingDigest,credential,digest("restored-new-session"),"local",E.identity,E.identityHash])).rejects.toBeDefined();
   for(const feature of ["protected_identity","protected_contribution"])await expect(activate(restored,feature)).rejects.toMatchObject({code:"55000"});
   expect((await restored.unsafe("select distinct on(feature_key) state from pac.protected_feature_activation_events where environment='local' order by feature_key,activation_event_id desc")).every(row=>row.state==="inactive")).toBe(true);
   // A surviving current authoritative database supplies the withdrawal; an old dump alone cannot.
   const restoredPublication=await currentPublication(restoredRuntime);
   expect(restoredPublication.published).not.toBeNull();
   await restoredRuntime.unsafe("select pac.withdraw_resource_publication($1,$2,$3::uuid,$4::bigint,$5)",["one-dhs",RESOURCE.id,restoredPublication.published!.revisionId,restoredPublication.scopeDecisionId,"Replay verified current authoritative withdrawal after isolated restore."]);
   expect(await restoredRuntime.unsafe("select * from pac.read_staff_publications('one-dhs',$1)",[RESOURCE.id])).toEqual([]);
   expect((await restored.unsafe("select count(*)::int count from pac.source_items where source_item_id='contributor-resource-source'"))[0].count).toBe(1);
   const deletion=await restored.unsafe("select * from pac.ask_response_deletions");expect(deletion).toHaveLength(1);expect(Object.keys(deletion[0]).sort()).toEqual(["deleted_at","reason","record_id"]);
   writeEvidenceReceipt(path.join(ROOT,"evidence/functional-completion-2026-09-08/program-recovery-drill.json"),{verifiedAt:new Date().toISOString(),scope:"Disposable local PostgreSQL dump and restore; no hosted or staff records",dumpSha256,migrationsThrough:"0047",actualOldBackupRestore:true,ownerDeletedAskUnavailable:true,restoredAskBodiesExcluded:1,contentFreeDeletionEvidence:true,expiredInvitationClosedInCurrentDatabase:true,restoredInvitationSecretRemoved:true,oldNamedSessionDenied:true,restoredCredentialVerifiersRemoved:true,oldGrantAuthority:"Quarantined; not claimed reconciled",featureReactivationDenied:true,currentWithdrawalReplayedFromSurvivingAuthority:true,staffPublicationProjectionExcluded:true,sourceEvidencePreserved:true,legacyOwnerKey:"Proved separately by synthetic-key unit test, not SQL rotation",fullOperationalRestoreReady:false,residual:"No automatic grant reconciliation or quarantine unlock; hosted operator recovery, RPO/RTO and independent release remain unproven.",preparation:prepared.receipt});
 },120000);
});
