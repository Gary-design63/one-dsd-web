import "server-only";
import { getStore } from "@/lib/intelligence/memory/store";
import { piiDetect } from "@/lib/intelligence/safety";
import { ProgramOutcomeInputSchema, ProgramOutcomeRecordSchema, type ProgramOutcomeInput, type ProgramOutcomeRecord } from "./outcome-schema";
export { ProgramOutcomeInputSchema, ProgramOutcomeRecordSchema } from "./outcome-schema";
export type { ProgramOutcomeInput, ProgramOutcomeRecord } from "./outcome-schema";

export function outcomeSharingProblem(input: ProgramOutcomeInput): string | null {
  const text = [input.problem, input.action, input.adoptedChange, input.observedResult, input.followUp, input.evidenceUrl ?? ""].join("\n");
  if (!piiDetect(text).ok || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text) || /\b(?:employee|staff|personnel)\s*(?:id|number|#)\s*[:#]?\s*[A-Z0-9-]{3,}/i.test(text)) return "Please remove personal or case details before sharing. Keep the focus on the work and the change.";
  return null;
}
export async function saveProgramOutcome(input: ProgramOutcomeInput): Promise<ProgramOutcomeRecord> {
  const parsed = ProgramOutcomeInputSchema.parse(input);
  const issue = outcomeSharingProblem(parsed);
  if (issue) throw new Error(issue);
  const { submissionId, ...details } = parsed;
  const record = ProgramOutcomeRecordSchema.parse({ ...details, schemaVersion: 1, id: `program-outcome-${submissionId}`, createdAt: new Date().toISOString(), evidenceStatus: "self_reported" });
  const store = getStore();
  if ((process.env.NODE_ENV === "production" || process.env.VERCEL === "1") && store.backend !== "postgres") throw new Error("Durable result sharing is unavailable.");
  const result = await store.put("decision", `program_outcome:${record.id}`, record, `program-outcome:${submissionId}`);
  return ProgramOutcomeRecordSchema.parse(result.value);
}
/** Owner/authorized program coordination only; never expose the collection to staff. */
export async function listProgramOutcomes(): Promise<ProgramOutcomeRecord[]> {
  const rows = await getStore().list<unknown>("decision");
  return rows.flatMap(row => { const parsed = ProgramOutcomeRecordSchema.safeParse(row); return parsed.success ? [parsed.data] : []; }).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
}