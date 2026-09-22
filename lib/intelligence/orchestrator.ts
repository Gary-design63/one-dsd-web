/**
 * Program Orchestrator / Dispatcher (TRD §2.3). Invisible control plane.
 *
 * request -> resolve agent definition (enabled? flag? scope?) -> autonomy ceiling check
 *         -> specialist runs with a ToolContext (every tool call is allowlisted and audited)
 * Specialists are never collapsed into one unbounded chat brain.
 */
import { flagEnabled } from "./registry/flags";
import { getAgent } from "./registry/agents";
import { newTraceId } from "./tools/runtime";
import { getPolicy, PAUSED_MESSAGE } from "./policy";
import type { AgentId, ToolContext } from "./types";
import { askConcierge, type AskInput, type AskResult } from "./agents/ask";
import { ciGet, ciList, ciQuery, type BriefLevel, type CiResult } from "./agents/ci";
import { correctRequest, ownerEligibilityQueue, ownerGet, ownerQueue, ownerUpdate, previewPacket, rotateRequestKey, submitIntake, trackRequest, validateIntake, withdrawRequest, type IntakeCorrectionResult, type IntakeCredentialRotationResult, type IntakeResult } from "./agents/intake";
import { classifyDraft, staleDetect, type ClassifyInput } from "./agents/librarian";
import { a11yScan } from "./agents/a11y";
import type { ConsultInput } from "./consult/schema";

export class AgentUnavailable extends Error {
  constructor(
    public readonly agentId: AgentId,
    public readonly reason: string,
  ) {
    super(`${agentId}: ${reason}`);
  }
}

export type Role = "staff" | "owner";

/**
 * Build a tool context. The owner policy (hard stop, per-agent enable, ceiling) is enforced
 * on every tool call inside the runtime; this only checks definition-level scope and flags.
 */
export function contextFor(agentId: AgentId, role: Role, opts: { dry_run?: boolean; trace_id?: string } = {}): ToolContext {
  const agent = getAgent(agentId);
  if (!agent.enabled) throw new AgentUnavailable(agentId, "agent disabled");
  if (agent.feature_flag && !flagEnabled(agent.feature_flag)) throw new AgentUnavailable(agentId, "feature flag off");
  if (!agent.scope.roles.includes(role)) throw new AgentUnavailable(agentId, "role not in scope");
  return { trace_id: opts.trace_id ?? newTraceId(), agent, dry_run: opts.dry_run ?? false, role };
}

/** True when the owner's hard stop is engaged. Staff surfaces degrade to browse and search. */
export async function paused(): Promise<boolean> {
  return (await getPolicy()).killed;
}

export { PAUSED_MESSAGE };

/* ---- Staff surfaces ---- */

export function ask(input: AskInput, role: Role = "staff", trace_id?: string): Promise<AskResult> {
  return askConcierge(input, contextFor("ask_concierge", role, { trace_id }));
}

export function communities(role: Role = "staff"): Promise<CiResult> {
  return ciList(contextFor("ci_guide", role));
}

export function communityBrief(id: string, level: BriefLevel, role: Role = "staff"): Promise<CiResult> {
  return ciGet(id, level, contextFor("ci_guide", role));
}

export function communityQuery(query: string, role: Role = "staff"): Promise<CiResult> {
  return ciQuery(query, contextFor("ci_guide", role));
}

export function intakeValidate(raw: unknown, role: Role = "staff") {
  return validateIntake(raw, contextFor("consult_intake", role, { dry_run: true }));
}

export function intakePreview(input: ConsultInput, role: Role = "staff") {
  return previewPacket(input, contextFor("consult_intake", role, { dry_run: true }));
}

export function intakeSubmit(raw: unknown, idempotencyKey?: string, role: Role = "staff"): Promise<IntakeResult> {
  return submitIntake(raw, contextFor("consult_intake", role), idempotencyKey);
}

export function intakeTrack(requestId: string, accessKey: string) {
  return trackRequest(requestId, accessKey, contextFor("consult_intake", "staff"));
}

export function intakeWithdraw(requestId: string, accessKey: string) {
  return withdrawRequest(requestId, accessKey, contextFor("consult_intake", "staff"));
}

export function intakeCorrect(
  requestId: string,
  accessKey: string,
  corrections: unknown,
  expectedVersion: number,
): Promise<IntakeCorrectionResult> {
  return correctRequest(
    requestId,
    accessKey,
    corrections,
    expectedVersion,
    contextFor("consult_intake", "staff"),
  );
}

export function intakeRotateKey(
  requestId: string,
  accessKey: string,
  expectedVersion: number,
): Promise<IntakeCredentialRotationResult> {
  return rotateRequestKey(
    requestId,
    accessKey,
    expectedVersion,
    contextFor("consult_intake", "staff"),
  );
}

/* ---- Owner surfaces (Consultant Workspace) ---- */

export function queue() {
  return ownerQueue(contextFor("consult_intake", "owner"));
}

export function eligibilityQueue() {
  return ownerEligibilityQueue(contextFor("consult_intake", "owner"));
}

export function queueItem(id: string) {
  return ownerGet(id, contextFor("consult_intake", "owner"));
}

export function queueUpdate(id: string, update: unknown) {
  return ownerUpdate(id, update, contextFor("consult_intake", "owner"));
}

export function classify(input: ClassifyInput) {
  return classifyDraft(input, contextFor("librarian", "owner"));
}

export function stale() {
  return staleDetect(contextFor("librarian", "owner"));
}

export function accessibilityReview(input: { text: string; html?: string; artifactType: "notice" | "web" | "slides" | "document" | "learning" }, role: Role = "staff") {
  return a11yScan(input, contextFor("a11y_reviewer", role));
}
