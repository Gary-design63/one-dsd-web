import { z } from "zod";

const narrative = (max: number) => z.string().trim().min(1).max(max);
const outcomeIds = ["staff_capability", "capability_transfer", "access", "workplace_culture", "institutional_application", "organizational_memory", "agency_coherence"] as const;
const publicLink = z.string().trim().max(1000).url().refine(value => {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash && !/^(?:localhost|127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|\[|.*\.(?:local|internal)$)/i.test(url.hostname); }
  catch { return false; }
}, "Use a public HTTPS link without access keys or query details.");
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const parsed = new Date(value + "T00:00:00Z"); return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value; }, "Choose a valid date.");
export const ProgramOutcomeInputSchema = z.object({
  submissionId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/), programScope: z.enum(["one-dhs", "dsd"]),
  problem: narrative(1500), action: narrative(1500), adoptedChange: narrative(1500), observedResult: narrative(2000),
  evidenceUrl: publicLink.optional(), followUp: narrative(1500), reviewDate: date.optional(),
  decision: z.enum(["retain", "revise", "stop", "not_yet_known"]), consent: z.literal(true),
  sourceRoute: z.string().max(200).regex(/^\/(?:practice|courses|learn|areas|one-dsd|support)(?:\/[a-z0-9-]+)*$/).optional(),
  outcomeId: z.enum(outcomeIds).optional(),
}).strict();
export const ProgramOutcomeRecordSchema = ProgramOutcomeInputSchema.omit({ submissionId: true }).extend({
  schemaVersion: z.literal(1), id: z.string().regex(/^program-outcome-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
  createdAt: z.string().datetime(), evidenceStatus: z.literal("self_reported"),
}).strict();
export type ProgramOutcomeInput = z.infer<typeof ProgramOutcomeInputSchema>;
export type ProgramOutcomeRecord = z.infer<typeof ProgramOutcomeRecordSchema>;