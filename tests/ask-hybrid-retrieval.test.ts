import { beforeEach,afterEach,it,expect,vi } from 'vitest';
import { writeEvidenceReceipt } from "@/tests/helpers/evidence-receipts";
import { askConcierge } from '@/lib/intelligence/agents/ask';
import * as providers from '@/lib/intelligence/providers';
import * as models from '@/lib/intelligence/registry/models';
import { getAgent } from '@/lib/intelligence/registry/agents';
import { resetStoreForTests,getStore } from '@/lib/intelligence/memory/store';
import { invalidatePolicyCache } from '@/lib/intelligence/policy';
import { testTraceId } from './helpers/opaque-identifiers';
let lastPrompt:Record<string,unknown> = {};
beforeEach(()=>{
 resetStoreForTests();invalidatePolicyCache();
 vi.spyOn(providers,'resolveBinding').mockReturnValue({model:models.getModel('mdl_claude_staff_primary')!,generative:true,reason:'synthetic answer to inspect real retrieval',adapter:{id:'anthropic',generative:true,health:async()=>({ok:true,latency_ms:0}),complete:async request=>{
 lastPrompt=JSON.parse(request.user);return {model_id:'mdl_claude_staff_primary',parsed:{shortAnswer:'Ask which language and format work best, then arrange appropriate language support.',whyItMatters:'',limits:[],sourceIds:[],resourceHrefs:[]}};
 }}});
});
afterEach(()=>{vi.restoreAllMocks();});
it('makes practical language-access guidance available to actual ASK reasoning over the full public collection',async()=>{
 const result=await askConcierge({question:'A family cannot understand our English letters from DHS. What should I do?',researchMode:'program_only'}, {trace_id:testTraceId('hybrid-language'),agent:getAgent('ask_concierge'),role:'staff',dry_run:false});
 expect(result.kind).toBe('answer');
 writeEvidenceReceipt('evidence/functional-completion-2026-09-08/ask-hybrid-source-selection.json',{at:new Date().toISOString(),syntheticGeneration:true,realPublicRetrieval:true,externalCalls:0,promptSources:lastPrompt.programSources});
 expect(JSON.stringify(lastPrompt.programSources)).toMatch(/language access|language support|interpreter/i);
 expect(JSON.stringify(lastPrompt.programSources)).not.toMatch(/Thai Minnesota|Filipino Minnesota|Lao Minnesotans/);
},15000);
it('continues keyword and answer paths with an unsupported embedding binding',async()=>{
 const agent=structuredClone(getAgent('ask_concierge'));agent.model_setting.embed_model_id='mdl_fixture_embed_v1';
 const result=await askConcierge({question:'How can I make a DHS team meeting accessible?',researchMode:'program_only'}, {trace_id:testTraceId('hybrid-fallback'),agent,role:'staff',dry_run:false});
 expect(result.kind).toBe('answer');
 const audit=await getStore().listAudit(100);
 expect(audit.some(event=>event.tool_name==='corpus.semantic_retrieve'&&!event.ok)).toBe(true);
 expect(audit.some(event=>event.tool_name==='corpus.search'&&event.ok)).toBe(true);
 expect(JSON.stringify(lastPrompt.programSources)).toMatch(/meeting/i);
},15000);
