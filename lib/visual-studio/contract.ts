import { z } from "zod";

const plain = (maximum: number) => z.string().trim().min(1).max(maximum)
  .refine(value => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value), "Use ordinary text.");
export const StudioBriefSchema = z.object({
  title: plain(120),
  learningObjective: plain(1000),
  setting: z.enum(["meeting", "interview", "service"]),
  dialogue: z.array(z.object({ participant: plain(60), text: plain(400) }).strict()).max(6),
}).strict();
export type StudioBrief = z.infer<typeof StudioBriefSchema>;
export const StudioIdSchema = z.string().uuid();
export const StudioActorSchema = z.enum(["owner", "chief_of_staff"]);
export type StudioActor = z.infer<typeof StudioActorSchema>;
export const StudioFailureSchema = z.object({ code: z.string(), message: z.string() }).strict();
export type StudioFailure = z.infer<typeof StudioFailureSchema>;
const OutputSchema = z.object({
  kind: z.enum(["preview", "project"]), fileName: z.string(),
  bytes: z.number().int().nonnegative(), sha256: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();
export const StudioReceiptSchema = z.object({
  id: z.string().uuid(), projectId: StudioIdSchema, actor: StudioActorSchema,
  status: z.enum(["rendering", "ready", "failed"]), renderer: z.literal("Blender"),
  startedAt: z.string().datetime(), finishedAt: z.string().datetime().optional(),
  outputs: z.array(OutputSchema), failure: StudioFailureSchema.optional(),
  toolAudit: z.object({
    traceId: z.string().uuid(), spanId: z.string().regex(/^[a-f0-9]{8}$/),
    recordedAt: z.string().datetime(), toolName: z.literal("studio.scene_create"),
    ok: z.boolean(), dryRun: z.boolean(), receiptName: z.string().regex(/^audit-[a-f0-9-]+\.json$/),
  }).strict().optional(),
}).strict();
export type StudioReceipt = z.infer<typeof StudioReceiptSchema>;
export const StudioProjectSchema = z.object({
  id: StudioIdSchema, title: z.string(), brief: StudioBriefSchema, actor: StudioActorSchema,
  status: z.enum(["rendering", "ready", "failed"]), createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(), previewAvailable: z.boolean(), projectAvailable: z.boolean(),
  failure: StudioFailureSchema.optional(), receipt: StudioReceiptSchema,
}).strict();
export type StudioProject = z.infer<typeof StudioProjectSchema>;
export type StudioStatus = { available: boolean; localOnly: true; reason: string; busy: boolean; blenderVersion?: string };
export type StudioAsset = { path: string; contentType: string; fileName: string };
export type StudioAssetKind = "preview" | "project" | "receipt";
