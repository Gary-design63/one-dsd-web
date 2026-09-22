import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = process.cwd();
const origin = 'http://127.0.0.1:3115';
process.loadEnvFile(path.join(root, '.env.local'));
const key = process.env.PAC_OWNER_KEY;
if (!key) throw new Error('Local owner key is unavailable');
const login = await fetch(origin + '/api/consultant/login', {method:'POST',redirect:'manual',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({key,returnTo:'/consultant/studio'})});
const rawCookie = login.headers.getSetCookie().find(value => value.startsWith('pac_owner='));
if (login.status !== 303 || !rawCookie || (login.headers.get('location') ?? '').includes('denied')) throw new Error('Local owner sign-in did not succeed');
const cookie = rawCookie.split(';')[0];
const headers = {Origin:origin,Cookie:cookie};
const statusResponse = await fetch(origin + '/api/consultant/studio',{headers});
const snapshot = await statusResponse.json();
if (statusResponse.status !== 200 || !snapshot.status?.available) throw new Error('Local studio is unavailable');
let project = snapshot.projects.find(item => item.status === 'ready');
let createStatus;
let traceId;
if (process.argv.includes('--create')) {
  const result = await fetch(origin + '/api/consultant/studio',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({action:'create',actor:'chief_of_staff',brief:{title:'Evidence before impressions — verified example',learningObjective:'Identify the job-related evidence in a fictional interview answer.',setting:'interview',dialogue:[{participant:'Interviewer',text:'What helped you understand whether your explanation was useful?'},{participant:'Candidate',text:'I asked the person to describe their next step and revised the part that was unclear.'}]}})});
  createStatus=result.status;
  const created=await result.json();
  if(result.status!==200 || created.project?.status!=='ready') throw new Error('Chief of Staff scene creation or activity recording did not complete');
  project=created.project;traceId=created.traceId;
}
if(!project) throw new Error('No saved scene is available');
const assets=[];
for(const kind of ['preview','project','receipt']) {
  const response=await fetch(origin+'/api/consultant/studio/'+project.id+'/'+kind,{headers});
  const bytes=Buffer.from(await response.arrayBuffer());
  if(response.status!==200) throw new Error('Protected scene output could not be retrieved');
  if (kind === 'receipt' && createStatus) { const saved = JSON.parse(bytes.toString('utf8')); if (!saved.toolAudit?.ok || saved.toolAudit.dryRun || saved.toolAudit.traceId !== traceId) throw new Error('The Chief of Staff activity receipt is missing or inconsistent'); }
  const expected=project.receipt.outputs.find(item=>item.kind===kind);
  const digest=createHash('sha256').update(bytes).digest('hex');
  if(expected && (expected.sha256!==digest || expected.bytes!==bytes.length)) throw new Error('A scene output differs from its saved receipt');
  assets.push({kind,status:response.status,bytes:bytes.length,sha256:digest,contentType:response.headers.get('content-type'),cacheControl:response.headers.get('cache-control')});
}
const denied=await fetch(origin+'/api/consultant/studio/'+project.id+'/project');
if(denied.status!==401) throw new Error('A signed-out request could access a project');
const receipt={checkedAt:new Date().toISOString(),environment:'local',origin,ownerLoginStatus:login.status,studioAvailable:true,createStatus,traceId,projectId:project.id,projectStatus:project.status,actor:project.actor,assets,signedOutAssetStatus:denied.status,noDeployment:true};
const directory=path.join(root,'evidence','visual-studio-2026-09-09');
await mkdir(directory,{recursive:true});
await writeFile(path.join(directory,'local-verification.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({environment:'local',scene:project.title,createStatus,assetsVerified:assets.length,signedOutAssetStatus:denied.status,receiptSaved:true}));