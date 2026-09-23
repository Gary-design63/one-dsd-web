import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { writeEvidenceReceipt } from "@/tests/helpers/evidence-receipts";
import { WORK_AREAS } from "@/lib/product/work-areas";
import { workAreaStartingPoint } from "@/lib/product/work-origin";
import { getDomain } from "@/lib/domains";
import { applyDomainValues, domainSurfaceId } from "@/lib/domains/surfaces";
import { loadPublishedEditableSurfaces } from "@/lib/content/editable-surfaces";
import { askConcierge, toStaffAskResult } from "@/lib/intelligence/agents/ask";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { testTraceId } from "./helpers/opaque-identifiers";
import { runCases } from "@/lib/intelligence/eval/runner";
beforeEach(()=>{resetStoreForTests();invalidatePolicyCache();vi.stubEnv("PAC_GENERATIVE_PILOT","off");});
afterEach(()=>vi.unstubAllEnvs());
it("exports the nine current published task starters and verifies question-only routing",async()=>{
 const starts=WORK_AREAS.map(area=>({area,start:workAreaStartingPoint(area.id)!}));
 const rows=await loadPublishedEditableSurfaces([...new Set(starts.map(row=>domainSurfaceId(row.start.origin.area!)))],"one-dhs");
 const samples=starts.map(({area,start})=>{
  const source=getDomain(start.origin.area!)!,surface=rows.find(row=>row.surfaceId===domainSurfaceId(source.id))!;
  expect(surface).toBeDefined();
  const domain=applyDomainValues(source,surface.values),task=domain.tasks.find(task=>task.id===start.task.id)!;
  return {area:area.id,areaLabel:area.label,domain:domain.id,task:task.id,taskLabel:task.label,question:task.askStarter,expectedPath:task.pathId??null,expectedSourceIds:task.contentIds,request:{question:task.askStarter,researchMode:"program_only" as const,...(task.pathId?{pathId:task.pathId}:{})},publication:{surfaceId:surface.surfaceId,source:surface.source,revisionId:surface.revisionId}};
 });
 const languageQuestion="Families receive letters only in English and cannot understand what to do next. What should our team plan?";
 writeEvidenceReceipt("evidence/functional-completion-2026-09-08/compiled-routing-inputs.json",{generatedAt:new Date().toISOString(),scope:"Current local published domain copy, generated from WORK_AREAS and workAreaStartingPoint",sourceFiles:["lib/product/work-areas.ts","lib/product/work-origin.ts","lib/domains/index.ts","lib/domains/surfaces.ts"],note:"Task requests preserve pathId exactly as existing area-page ASK links do. The extra language question is the actual compiled failure input.",samples:[...samples,{area:"accessibility_language_access",domain:"access-language",task:"english-letters-regression",question:languageQuestion,expectedPath:"gp-2",expectedSourceIds:["ja-language-access-checklist"],request:{question:languageQuestion,researchMode:"program_only"}}]});
 const results=[];
 for(const sample of samples){
  const result=await askConcierge({question:sample.question,researchMode:"program_only"},{trace_id:testTraceId("workarea-"+sample.area),agent:getAgent("ask_concierge"),role:"staff",dry_run:false});
  const path=result.kind==="answer"?result.answer.pathSuggestion?.id:null;
  results.push({area:sample.area,question:sample.question,expectedPath:sample.expectedPath,actualPath:path??null,response:toStaffAskResult(result)});
 }
 writeEvidenceReceipt("evidence/functional-completion-2026-09-08/ask-nine-area-question-routing.json",{verifiedAt:new Date().toISOString(),localOnly:true,generation:false,externalCalls:0,results});
 expect(results.filter(r=>r.expectedPath&&r.actualPath!==r.expectedPath).map(r=>({area:r.area,expected:r.expectedPath,actual:r.actualPath}))).toEqual([]);
 for(const result of results)if(result.response.kind==="answer")expect(JSON.stringify(result.response.answer)).not.toMatch(/Cultural intelligence:|\/minnesota-communities\//);
},60000);
it("records the actual evaluation failure details without relaxing its assertions",async()=>{
 const report=await runCases();
 writeEvidenceReceipt("evidence/functional-completion-2026-09-08/ask-evaluation-diagnostic.json",report);
 expect(report.results.filter(result=>result.status==="fail").map(result=>({id:result.id,detail:result.detail}))).toEqual([]);
},60000);
