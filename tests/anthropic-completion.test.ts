import { beforeEach, expect, it, vi } from "vitest";
import { z } from "zod";
import { AnthropicProvider } from "@/lib/intelligence/providers";
import { getModel } from "@/lib/intelligence/registry/models";
const state = vi.hoisted(() => ({ stopReason: "end_turn", options: {} as Record<string, unknown> }));
vi.mock("@anthropic-ai/sdk", () => ({default: class {
  constructor(options: Record<string, unknown>) {state.options=options;}
  messages={parse: async () => ({id:"synthetic-response",stop_reason:state.stopReason,parsed_output:{answer:"An answer"},usage:{input_tokens:10,output_tokens:10}})};
}}));
const request={model_id:"mdl_claude_staff_primary",system:"Test",user:"Test",schema:z.object({answer:z.string()}),trace_id:"synthetic"};
beforeEach(()=>{state.stopReason="end_turn";state.options={};});
it("returns a completed structured answer with bounded request attempts", async()=>{
  const result=await new AnthropicProvider().complete(request,getModel(request.model_id)!);
  expect(result.parsed).toEqual({answer:"An answer"});
  expect(state.options).toMatchObject({timeout:30000,maxRetries:0});
});
it.each(["max_tokens","pause_turn","tool_use"])("does not accept valid JSON from an incomplete %s response", async reason=>{
  state.stopReason=reason;
  await expect(new AnthropicProvider().complete(request,getModel(request.model_id)!)).rejects.toThrow("provider_incomplete");
});
it("preserves an explicit refusal failure", async()=>{
  state.stopReason="refusal";
  await expect(new AnthropicProvider().complete(request,getModel(request.model_id)!)).rejects.toThrow("provider_refusal");
});

it.each([45_000,60_000])("honors the caller's %ims draft allowance without adding retries", async timeoutMs=>{
  await new AnthropicProvider().complete({...request,timeoutMs},getModel(request.model_id)!);
  expect(state.options).toMatchObject({timeout:timeoutMs,maxRetries:0});
});
