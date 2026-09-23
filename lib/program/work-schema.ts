import { z } from "zod";
export const ProgramTaskSchema = z.object({
  recordType: z.literal("program_task"), id: z.string().regex(/^task-[a-f0-9]{32}$/), createdAt: z.iso.datetime(),
  functionId: z.string().min(1).max(60), outcomeIds: z.array(z.string().max(60)).max(7),
  kind: z.enum(["work_preparation", "cadence_review", "outcome_followup", "source_review", "resource_review"]),
  title: z.string().min(5).max(180), objective: z.string().min(10).max(3000),
  agentId: z.enum(["program_orchestrator", "ask_concierge", "ci_guide", "librarian", "a11y_reviewer", "consult_intake", "graduation_coach", "embed_advisor", "content_sentinel", "eval_steward"]),
  sourceId: z.string().max(180).optional(), dueAt: z.iso.datetime(),
  eligible: z.boolean(), exclusionReason: z.string().max(300).optional(),
  source: z.enum(["owner", "cadence", "staff_result", "program_maintenance"]),
  evidenceMode: z.enum(["operational", "verification"]),
}).strict().refine(x => x.eligible || Boolean(x.exclusionReason), "An exclusion needs a reason.");
export type ProgramTask = z.infer<typeof ProgramTaskSchema>;
export const ProgramReceiptSchema = z.object({
  title: z.string().min(1).max(180), body: z.string().min(20).max(18000),
  evidenceLevel: z.enum(["delivery", "application", "benefit"]),
  method: z.enum(["generated_artifact", "program_record_review", "source_check", "owner_report"]),
  references: z.array(z.object({ label: z.string().max(240), href: z.string().max(1500).refine(v => /^\/(?!\/)/.test(v) || /^https:\/\//.test(v)) }).strict()).max(20),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();
export const ProgramEventSchema = z.object({
  recordType: z.literal("program_event"), id: z.string().uuid(), taskId: z.string().regex(/^task-[a-f0-9]{32}$/), at: z.iso.datetime(),
  phase: z.enum(["started", "completed", "failed", "applied", "reviewed", "cancelled", "retry_requested"]),
  attempt: z.number().int().min(0).max(10000), actor: z.enum(["agent", "owner"]),
  note: z.string().max(3000), receipt: ProgramReceiptSchema.optional(),
  disposition: z.enum(["retain", "revise", "stop", "not_yet_known"]).optional(),
  followUpAt: z.iso.datetime().optional(), humanMinutes: z.number().min(0).max(100000).optional(),
}).strict().refine(x => x.phase !== "completed" || Boolean(x.receipt), "Completion requires a receipt.")
.refine(x => !["applied", "reviewed", "cancelled", "retry_requested"].includes(x.phase) || x.actor === "owner", "Only the owner can record this decision.");
export type ProgramEvent = z.infer<typeof ProgramEventSchema>;

