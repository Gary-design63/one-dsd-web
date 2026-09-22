import { it,expect } from 'vitest';
import { writeEvidenceReceipt } from "@/tests/helpers/evidence-receipts";
import { indexedProgramResources } from '@/lib/intelligence/retrieval/program-resources';
import { indexedStaffDocs } from '@/lib/intelligence/retrieval/staff-search';
import { localSemanticRetrieve,SemanticSearchUnavailable } from '@/lib/intelligence/retrieval/local-semantic';
it('measures complete public-corpus cold and warm retrieval',async()=>{
 const docs=[...await indexedStaffDocs('one-dhs'),...(await indexedProgramResources('one-dhs')).destinations];
 const attempts: Array<{elapsedMs:number,reason?:string,ids?:string[]}>=[];
 let hits: Awaited<ReturnType<typeof localSemanticRetrieve>> | undefined;const start=performance.now();
 for(let i=0;i<30;i++){
   const at=performance.now();
   try{hits=await localSemanticRetrieve('How can I make sure everyone can participate in a meeting?',[],docs); attempts.push({elapsedMs:Math.round(performance.now()-at),ids:hits.map(h=>h.id)});break;}
   catch(e){if(!(e instanceof SemanticSearchUnavailable))throw e;attempts.push({elapsedMs:Math.round(performance.now()-at),reason:e.reason}); if(e.reason!=='index_warming')throw e;}
 }
 expect(hits?.length).toBeGreaterThan(0);
 const at=performance.now();
 const warm=await localSemanticRetrieve('A family cannot understand our English letters.',[],docs,50);
 const report={model:'bge-small-en-v1.5',scope:'one-dhs',documents:docs.length,totalColdMs:Math.round(performance.now()-start),attempts,warmMs:Math.round(performance.now()-at),warmHits:warm.map(h=>({id:h.id,title:h.title,score:h.score}))};
 writeEvidenceReceipt('evidence/functional-completion-2026-09-08/semantic-corpus-latency.json',report);
 expect(report.warmMs).toBeLessThan(1500);
 expect(warm.slice(0,5).some(hit=>hit.title==="Language access checklist")).toBe(true);
 expect(warm.slice(0,5).some(hit=>/^Cultural intelligence:.*Family/.test(hit.title))).toBe(false);
},180000);
