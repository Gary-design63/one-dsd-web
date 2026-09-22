import { beforeEach,afterEach,it,expect,vi } from 'vitest';
import { semanticRetrieveForAgent,SemanticSearchUnavailable } from '@/lib/intelligence/retrieval/local-semantic';
import { getAgent } from '@/lib/intelligence/registry/agents';
import * as registry from '@/lib/intelligence/registry/models';
import type { ModelRecord } from '@/lib/intelligence/types';
const {loadModel}=vi.hoisted(()=>({loadModel:vi.fn()}));
vi.mock('@huggingface/transformers',()=>({pipeline:loadModel,env:{}}));
const real=registry.getModel('mdl_local_bge_v1')!;
beforeEach(()=>{vi.clearAllMocks();});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
it.each([
 ['unavailable',undefined],
 ['held',{...real,approval_state:'hold'}],
 ['unsupported adapter',{...real,provider_id:'openai'}],
 ['wrong purpose',{...real,purpose:'chat_reason'}],
 ['wrong revision',{...real,provider_model_ref:'Xenova/bge-small-en-v1.5/other'}],
 ['unassigned agent',{...real,allowed_agent_ids:[]}],
 ['wrong environment',{...real,scope:{...real.scope,environments:['preview']}}],
 ['wrong data class',{...real,scope:{...real.scope,data_classes:['practice_workspace']}}],
 ['disabled switch',{...real,feature_flag:'model.generative_pilot'}],
] as Array<[string,ModelRecord|undefined]>)('prevents inference for %s',async(_label,model)=>{
 vi.spyOn(registry,'getModel').mockReturnValue(model);
 await expect(semanticRetrieveForAgent('meeting',[],[],getAgent('ask_concierge'))).rejects.toBeInstanceOf(SemanticSearchUnavailable);
 expect(loadModel).not.toHaveBeenCalled();
});
it('honors a missing selected embedding setting',async()=>{
 const agent=structuredClone(getAgent('ask_concierge'));delete agent.model_setting.embed_model_id;
 await expect(semanticRetrieveForAgent('meeting',[],[],agent)).rejects.toMatchObject({reason:'model_binding'});
 expect(loadModel).not.toHaveBeenCalled();
});
