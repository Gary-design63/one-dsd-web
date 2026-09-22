import {beforeEach,afterEach,expect,it,vi} from "vitest";
import { citationEvidenceFromDocs, evidenceForDoc, indexedEvidenceText, validateEvidenceClaims } from "@/lib/intelligence/retrieval/evidence";
import { docsFromStaffContent, type Doc, type Citation } from "@/lib/intelligence/retrieval/search";
import { contentEvidence, EvidenceClaimsSchema } from "@/lib/content/ask-evidence";
import { PostgresStaffPublicationReader } from "@/lib/content/staff-publications";
import { staffCorpus } from "@/lib/content/staff-corpus";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { getModel } from "@/lib/intelligence/registry/models";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import * as providers from "@/lib/intelligence/providers";
import * as program from "@/lib/intelligence/retrieval/program-resources";
import * as staff from "@/lib/intelligence/retrieval/staff-search";
import { askConcierge, toStaffAskResult } from "@/lib/intelligence/agents/ask";
import { createAskResponseRecord, validateAskRecord, MemoryAskRecordsStore } from "@/lib/intelligence/observability/ask-records";
import { testTraceId } from "./helpers/opaque-identifiers";
import { AUTHORITY } from "@/lib/content/types";
const id="asset-program-"+"a".repeat(24);
const doc:Doc={kind:"content",id,title:"Meeting participation",href:"/practice/gp-8",authority:"practice_note",type:"guide",status:"approved",reviewDate:"2026-09-08",scope:"agencywide",summary:"Offer written input before the meeting.",text:"Offer written input before the meeting. Follow up with decisions and proposed owners.",tags:["meeting"],intents:["workplace_culture"],evidenceRevisions:[{sourceId:"practice.gp-8",revisionId:"10000000-0000-4000-8000-000000000001",payloadHash:"a".repeat(64),scope:"one-dhs"}]};
function citation(d=doc):Citation {return citationEvidenceFromDocs([{...d,authorityLabel:AUTHORITY[d.authority].label,excerpt:d.summary,score:5}],[d])[0];}
function claim(c=citation()){return {kind:"source_excerpt" as const,text:c.evidence!.excerpt.quote,references:[{evidenceId:c.evidence!.evidenceId,...c.evidence!.excerpt}]};}
beforeEach(()=>{resetStoreForTests();invalidatePolicyCache();});
afterEach(()=>vi.restoreAllMocks());
it("carries actual publication revision and hash through the scoped staff document projection without changing canonical content",async()=>{
 const item=staffCorpus().find(item=>item.scope==="agencywide")!;
 const reader=new PostgresStaffPublicationReader({databaseUrl:"postgres://synthetic@localhost/test",databaseFactory:()=>({query:async()=>[{content_item_id:item.id,revision_id:doc.evidenceRevisions![0].revisionId,scope_id:"one-dhs",canonical_payload:item,payload_sha256:"b".repeat(64),decided_at:"2026-09-08T00:00:00.000Z"}] as never,close:async()=>{}})});
 const [loaded]=await reader.list("one-dhs");expect(contentEvidence(loaded)).toEqual({sourceId:item.id,revisionId:doc.evidenceRevisions![0].revisionId,payloadHash:"b".repeat(64),scope:"one-dhs"});
 const [indexed]=docsFromStaffContent({source:"postgres",items:[loaded]});expect(indexed.evidenceRevisions).toEqual([contentEvidence(loaded)]);expect(loaded).not.toHaveProperty("evidenceRevisions");
});
it("binds evidence to revision, text, scope, authority and destination instead of a reusable document ID",()=>{
 const original=evidenceForDoc(doc);
 for(const changed of [{...doc,text:doc.text+" Changed."},{...doc,scope:"dsd"},{...doc,href:"/changed"},{...doc,authority:"official" as const},{...doc,evidenceRevisions:[{...doc.evidenceRevisions![0],revisionId:"10000000-0000-4000-8000-000000000002"}]}])expect(evidenceForDoc(changed).evidenceId).not.toBe(original.evidenceId);
 const staticEvidence=evidenceForDoc({...doc,evidenceRevisions:undefined});expect(staticEvidence.revisions[0].revisionId).toBeNull();expect(staticEvidence.revisions[0].payloadHash).toMatch(/^[a-f0-9]{64}$/);
});
it("uses exact Unicode-code-point spans and validates a smaller verbatim passage",()=>{
 const unicode={...doc,summary:"An invitation 🤝 can offer written input.",text:"Access matters."};const c=citation(unicode);const evidence=c.evidence!;expect(Array.from(indexedEvidenceText(unicode)).slice(evidence.excerpt.start,evidence.excerpt.end).join("")).toBe(evidence.excerpt.quote);
 const quote="written input.";const start=evidence.excerpt.start+Array.from(evidence.excerpt.quote.split(quote)[0]).length;
 const value={kind:"source_excerpt",text:quote,references:[{evidenceId:evidence.evidenceId,start,end:start+Array.from(quote).length,quote}]};expect(validateEvidenceClaims([value],[c],[unicode])).toEqual([value]);
});
it.each(["unknown","stale","withdrawn","forged-quote","wrong-span","unsupported-paraphrase"])("rejects %s evidence without asserting semantic truth",kind=>{
 const c=citation();const value=claim(c);let current=[doc];
 if(kind==="unknown")value.references[0].evidenceId="f".repeat(64);
 if(kind==="stale")current=[{...doc,text:"A revised source."}];
 if(kind==="withdrawn")current=[];
 if(kind==="forged-quote"){value.references[0].quote="An invented claim.";value.references[0].end=value.references[0].start+value.references[0].quote.length;value.text=value.references[0].quote;}
 if(kind==="wrong-span"){value.references[0].start++;value.references[0].end++;}
 if(kind==="unsupported-paraphrase")value.text="DHS requires every meeting to have a remote transcript.";
 expect(()=>validateEvidenceClaims([value],[c],current)).toThrow();
});
it("allows an explicitly labeled inference with an exact basis passage, without equating it with proof",()=>{
 const inference={...claim(),kind:"inference" as const,text:"A short written prompt could help colleagues contribute."};expect(validateEvidenceClaims([inference],[citation()],[doc])).toEqual([inference]);expect(EvidenceClaimsSchema.parse([inference])[0].kind).toBe("inference");
});
function configure(make:(request:Parameters<providers.ProviderAdapter["complete"]>[0])=>unknown,currentDocs:()=>Doc[]=()=>[doc]){
 vi.spyOn(staff,"indexedStaffDocs").mockResolvedValue([]);
 vi.spyOn(program,"indexedProgramResources").mockImplementation(async()=>({communityDocs:[],destinations:currentDocs()}));
 const complete=vi.fn<providers.ProviderAdapter["complete"]>(async request=>({parsed:make(request),model_id:"mdl_claude_staff_primary"}));
 vi.spyOn(providers,"resolveBinding").mockReturnValue({model:getModel("mdl_claude_staff_primary")!,generative:true,reason:"Synthetic evidence test",adapter:{id:"anthropic",generative:true,health:async()=>({ok:true,latency_ms:0}),complete}});
 return complete;
}
const ctx=()=>({trace_id:testTraceId("exact-ask-evidence"),agent:getAgent("ask_concierge"),dry_run:false,role:"staff" as const});
const question={question:"How can I improve meeting participation?",researchMode:"program_only" as const};
it("keeps legacy source IDs as related navigation rather than attaching arbitrary generated prose to them",async()=>{
 configure(()=>({shortAnswer:"An ordinary explanation using general reasoning.",whyItMatters:"",limits:[],sourceIds:[id,"invented-source"],resourceHrefs:[]}));
 const result=await askConcierge(question,ctx());if(result.kind!=="answer")throw Error("Expected answer");
 expect(result.answer.generative).toBe(true);expect(result.answer.shortAnswer).toContain("general reasoning");expect(result.answer.sources).toEqual([]);expect(result.answer.grounding).toBe("none");expect(result.answer.nextActions).toContainEqual(expect.objectContaining({href:doc.href}));
});
it("retains exact evidence and labeled interpretation through the staff response and journal",async()=>{
 const complete=configure(request=>{const source=JSON.parse(request.user).programSources.find((source:{id:string})=>source.id===id);const exact={kind:"source_excerpt",text:source.evidence.excerpt.quote,references:[{evidenceId:source.evidence.evidenceId,...source.evidence.excerpt}]};return {shortAnswer:"Offer a written invitation, then consider what would make it useful for this team.",whyItMatters:"",limits:[],evidenceClaims:[exact,{...exact,kind:"inference",text:"A short prompt could support participation."}],sourceIds:[]};});
 const result=await askConcierge(question,ctx());if(result.kind!=="answer")throw Error("Expected answer");expect(result.answer.sources).toHaveLength(1);expect(result.answer.grounding).toBe("partial");expect(complete.mock.calls[0][0].system).toContain("not factual truth or semantic entailment");
 const record=createAskResponseRecord({traceId:ctx().trace_id,programScope:"one-dhs",researchMode:"program_only",status:"answered",httpStatus:200,question:question.question,response:toStaffAskResult(result),researchStatus:"not_requested"});
 const store=new MemoryAskRecordsStore();await store.append(record);expect((await store.list(10,null,new Date().toISOString()))[0]).toEqual(record);
 const corrupted=structuredClone(record);if(!("kind" in corrupted.response)||corrupted.response.kind!=="answer")throw Error("Expected answer");corrupted.response.answer.evidenceClaims![0].references[0].evidenceId="e".repeat(64);expect(()=>validateAskRecord(corrupted)).toThrow();
});
it("rejects a generated sourced draft when its source changes during generation",async()=>{
 let current=[doc];configure(request=>{const source=JSON.parse(request.user).programSources.find((source:{id:string})=>source.id===id);current=[{...doc,text:"Revised after retrieval."}];return {shortAnswer:"Unsupported generated policy claim.",whyItMatters:"",limits:[],evidenceClaims:[{kind:"source_excerpt",text:source.evidence.excerpt.quote,references:[{evidenceId:source.evidence.evidenceId,...source.evidence.excerpt}]}]};},()=>current);
 const result=await askConcierge(question,ctx());if(result.kind!=="answer")throw Error("Expected answer");expect(result.answer.generative).toBe(false);expect(result.answer.degraded).toBe(true);expect(result.answer.shortAnswer).not.toContain("Unsupported generated");expect(result.answer.evidenceClaims).toBeUndefined();expect(result.answer.sources).toEqual([]);expect(result.answer.shortAnswer).not.toContain(doc.summary);
});
it("does not infer a conflict or escalation from words in the question",async()=>{
 configure(()=>({shortAnswer:"The word conflict alone does not show that these sources disagree.",whyItMatters:"",limits:[],evidenceClaims:[]}));
 const result=await askConcierge({...question,question:"Two team guidance documents conflict. Which one is right?"},ctx());if(result.kind!=="answer")throw Error("Expected answer");expect(result.answer.conflict).toBeUndefined();expect(result.answer.escalate).toBeUndefined();
});
