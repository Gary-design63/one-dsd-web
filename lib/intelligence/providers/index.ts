/**
 * Agents select an opaque model binding; providers resolve its current registry record.
 * Hosted generation requires a callable model and a server-side credential. The local
 * embedding provider only supports retrieval. If generation is unavailable, the caller
 * reports and uses its configured fallback; a fixture does not establish live generation.
 */
import type { ZodType } from "zod";
import { flagEnabled } from "../registry/flags";
import { getModel, isCallableInProduction, STAFF_GENERATION_MODEL_ID } from "../registry/models";
import type { AgentDefinition, ModelRecord } from "../types";
import { OpenAIAdapter } from "./openai";
import { errorStatus, logProviderFailure, providerErrorExcerpt } from "./log";
import { isIsolatedMemoryStore } from "../memory/store";

export type CompleteRequest = {
  model_id: string;
  system: string;
  user: string;
  schema: ZodType;
  maxTokens?: number;
  timeoutMs?: number;
  trace_id: string;
};

export type CompleteResult = {
  parsed: unknown;
  model_id: string;
  provider_trace_id?: string;
  usage?: { input_tokens: number; output_tokens: number };
};

export interface ProviderAdapter {
  readonly id: ModelRecord["provider_id"];
  readonly generative: boolean;
  complete(req: CompleteRequest, record: ModelRecord): Promise<CompleteResult>;
  health(): Promise<{ ok: boolean; latency_ms: number }>;
}

class FixtureProvider implements ProviderAdapter {
  readonly id = "fixture" as const;
  readonly generative = false;
  async complete(req: CompleteRequest): Promise<CompleteResult> {
    // The fixture never generates prose; agents compose from the corpus when bound here.
    return { parsed: null, model_id: req.model_id };
  }
  async health() {
    return { ok: true, latency_ms: 0 };
  }
}

export class AnthropicProvider implements ProviderAdapter {
  readonly id = "anthropic" as const;
  readonly generative = true;
  async complete(req: CompleteRequest, record: ModelRecord): Promise<CompleteResult> {
    const [{ default: Anthropic }, { zodOutputFormat }] = await Promise.all([
      import("@anthropic-ai/sdk"),
      import("@anthropic-ai/sdk/helpers/zod"),
    ]);
    const client = new Anthropic({ timeout: record.purpose === "eval_judge" ? 120_000 : Math.min(req.timeoutMs ?? 30_000, 90_000), maxRetries: 0 });
    const model = record.provider_model_ref;
    const response = await client.messages.parse({
      model,
      max_tokens: req.maxTokens ?? 4000,
      system: req.system,
      messages: [{ role: "user", content: req.user }],
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: zodOutputFormat(req.schema) },
    }).catch((error: unknown) => {
      // The SDK error message carries the vendor's error body (type and message), never the key.
      const status = errorStatus(error);
      logProviderFailure({ provider: "anthropic", model, reason: status ? `anthropic_http_${status}` : "anthropic_request_error", status, body: providerErrorExcerpt(error), trace_id: req.trace_id });
      throw error;
    });
    if (response.stop_reason === "refusal") {
      logProviderFailure({ provider: "anthropic", model, reason: "provider_refusal", trace_id: req.trace_id });
      throw new Error("provider_refusal");
    }
    if (response.stop_reason !== "end_turn") {
      logProviderFailure({ provider: "anthropic", model, reason: "provider_incomplete", trace_id: req.trace_id, detail: { stop_reason: response.stop_reason } });
      throw new Error("provider_incomplete");
    }
    return {
      parsed: response.parsed_output ?? null,
      model_id: req.model_id,
      provider_trace_id: response.id,
      usage: { input_tokens: response.usage.input_tokens, output_tokens: response.usage.output_tokens },
    };
  }
  async health() {
    return { ok: Boolean(process.env.ANTHROPIC_API_KEY), latency_ms: 0 };
  }
}

const PROVIDERS: Record<ModelRecord["provider_id"], ProviderAdapter> = {
  local: {
    id: "local", generative: false,
    async complete() { throw new Error("embedding_model_cannot_generate_answers"); },
    async health() {
      const { localSemanticRetrieve } = await import("../retrieval/local-semantic");
      const started = Date.now();
      try {
        await localSemanticRetrieve("Local search readiness", [], [{kind:"content",id:"model-readiness",title:"Local search readiness",summary:"Local search readiness",text:"Local search readiness",scope:"agencywide",href:"/",authority:"guidance",type:"guidance",status:"approved",reviewDate:"",tags:[],intents:[]}], 1);
        return {ok:true,latency_ms:Date.now()-started};
      } catch { return {ok:false,latency_ms:Date.now()-started}; }
    },
  },
  fixture: new FixtureProvider(),
  anthropic: new AnthropicProvider(),
  openai: new OpenAIAdapter(),
};

function credentialPresent(provider: ModelRecord["provider_id"]): boolean {
  if (provider === "fixture") return true;
  if (provider === "anthropic") return Boolean(process.env.ANTHROPIC_API_KEY);
  if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
  return false;
}

export type BindingReasonCode =
  | "generative_pilot"
  | "isolated_evaluation"
  | "pilot_flag_off"
  | "pilot_model_not_allowed"
  | "pilot_credential_missing"
  | "pilot_model_not_callable";

export type Binding = { model: ModelRecord; adapter: ProviderAdapter; generative: boolean; reason: string; reasonCode?: BindingReasonCode };

/**
 * Resolve the model binding for an agent. Prefers a callable generative pilot when the
 * flag is on and a credential exists; otherwise the agent's primary (fixture) binding.
 */
export function resolveBinding(agent: AgentDefinition): Binding {
  const primary = getModel(agent.model_setting.primary_model_id);
  if (!primary) throw new Error(`Agent ${agent.agent_id} has no registered primary model`);

  if (isIsolatedMemoryStore()) {
    const fixture = getModel("mdl_fixture_v1");
    if (!fixture) throw new Error("The evaluation model is not registered.");
    return { model: fixture, adapter: PROVIDERS.fixture, generative: false, reason: "isolated sample evaluation", reasonCode: "isolated_evaluation" };
  }

  let reasonCode: BindingReasonCode = "pilot_flag_off";
  if (flagEnabled("model.generative_pilot")) {
    const candidate = candidatePilotModel(agent);
    reasonCode = "pilot_model_not_allowed";
    if (candidate) {
      const adapter = PROVIDERS[candidate.provider_id];
      if (isCallableInProduction(candidate, flagEnabled) && credentialPresent(candidate.provider_id) && adapter.generative) {
        return { model: candidate, adapter, generative: true, reason: "generative pilot flag on; pilot model callable; credential present", reasonCode: "generative_pilot" };
      }
      reasonCode = credentialPresent(candidate.provider_id) ? "pilot_model_not_callable" : "pilot_credential_missing";
    }
  }
  return { model: primary, adapter: PROVIDERS[primary.provider_id], generative: false, reason: "primary binding (fixture composer)", reasonCode };
}

function candidatePilotModel(agent: AgentDefinition): ModelRecord | undefined {
  const pilot = getModel(STAFF_GENERATION_MODEL_ID);
  if (!pilot) return undefined;
  return pilot.allowed_agent_ids.includes(agent.agent_id) ? pilot : undefined;
}

export function generativeStatus(): { pilotFlag: boolean; credential: boolean; active: boolean } {
  const pilotFlag = flagEnabled("model.generative_pilot");
  const credential = credentialPresent("openai");
  const model = getModel(STAFF_GENERATION_MODEL_ID);
  const callable = Boolean(model && isCallableInProduction(model, flagEnabled)
    && PROVIDERS[model.provider_id].generative && credentialPresent(model.provider_id));
  return { pilotFlag, credential, active: pilotFlag && callable };
}
