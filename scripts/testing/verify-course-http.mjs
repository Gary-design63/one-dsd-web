import {readFileSync,writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
const origin=process.argv[2]??'http://127.0.0.1:3115';
const packs=JSON.parse(readFileSync('lib/content/courses/recovered.json','utf8'));
const jobs=[];
for(const pack of packs){jobs.push({url:'/courses/'+pack.course.id,kind:'course',id:pack.course.id});for(const lesson of pack.course.lessons)jobs.push({url:'/courses/'+pack.course.id+'/'+lesson.id,kind:'lesson',id:lesson.id,blocks:lesson.blocks.length});}
const media=new Set(packs.flatMap(pack=>[pack.course.coverImage,pack.course.introAudio,...pack.course.lessons.flatMap(lesson=>lesson.blocks.filter(block=>block.type==='image').map(block=>block.src))]).filter(Boolean));
for(const url of media)jobs.push({url,kind:'media'});
const receipt={startedAt:new Date().toISOString(),origin,concurrency:4,scope:'All 86 course overviews, all 780 lesson routes, and every unique course media reference; bounded local HTTP run',checks:[],failures:[]};let cursor=0;
async function worker(){while(cursor<jobs.length){const job=jobs[cursor++],start=performance.now();try{const response=await fetch(origin+job.url,{headers:job.kind==='media'?{range:'bytes=0-1023'}:{},signal:AbortSignal.timeout(60000)});const bytes=new Uint8Array(await response.arrayBuffer());let passed;
if(job.kind==='media'){const expected=readFileSync('public'+job.url.split('?')[0]);passed=response.status===206&&Buffer.from(bytes).equals(expected.subarray(0,1024));}
else{const body=new TextDecoder().decode(bytes);passed=response.status===200&&(job.kind==='course'?body.includes('Explore the lessons'):(body.match(/data-course-block=/g)??[]).length===job.blocks);}
const row={...job,status:response.status,bytes:bytes.length,milliseconds:Math.round(performance.now()-start),passed};receipt.checks.push(row);if(!passed)receipt.failures.push(row);
}catch(error){receipt.failures.push({...job,error:error instanceof Error?error.name:'request_failed'});}if(receipt.checks.length%100===0)console.log(JSON.stringify({completed:receipt.checks.length,total:jobs.length,failures:receipt.failures.length}));}}
await Promise.all(Array.from({length:4},worker));receipt.finishedAt=new Date().toISOString();const times=receipt.checks.map(row=>row.milliseconds).sort((a,b)=>a-b);receipt.latency={median:times[Math.floor(times.length*.5)],p95:times[Math.floor(times.length*.95)],max:times.at(-1)};
writeFileSync('evidence/next-pass-2026-09-08/course-http-verification.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify({checked:receipt.checks.length,failures:receipt.failures.length,latency:receipt.latency}));if(receipt.failures.length)process.exitCode=1;
