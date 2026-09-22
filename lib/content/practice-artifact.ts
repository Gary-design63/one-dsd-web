import { z } from "zod";
import type { GraduationPath } from "./paths";

const FieldValue = z.union([z.string().max(3000), z.array(z.string().max(500)).max(20)]);
export const PracticeDraftSchema = z.object({
  pathId: z.string().regex(/^gp-(?:[1-9]|10|11)$/),
  fields: z.array(z.object({ id: z.string().regex(/^[a-z][a-z0-9_]{0,79}$/), value: FieldValue }).strict()).min(1).max(30),
}).strict();
export const PracticeArtifactSchema = z.object({
  schemaVersion: z.literal(1),
  artifactId: z.string().uuid(),
  revisionId: z.string().uuid(),
  parentRevisionId: z.string().uuid().nullable(),
  traceId: z.string().uuid(),
  createdAt: z.string().datetime(),
  context: z.enum(["one_dhs", "one_dsd"]),
  pathId: z.string().regex(/^gp-(?:[1-9]|10|11)$/),
  pathContract: z.string().regex(/^[a-f0-9]{64}$/),
  title: z.string().min(1).max(300),
  values: z.record(z.string().regex(/^[a-z][a-z0-9_]{0,79}$/), FieldValue),
  sources: z.array(z.object({
    id: z.string().min(1).max(200), title: z.string().min(1).max(300),
    href: z.string().max(1000).regex(/^(?:\/(?!\/)|https:\/\/)/).refine(href => !/[\\\u0000-\u0020]/.test(href)),
  }).strict()).max(10),
}).strict().refine(value => Object.keys(value.values).length > 0 && Object.keys(value.values).length <= 30 && new TextEncoder().encode(JSON.stringify(value)).length <= 10000, "Practice draft exceeds its bounds.");
export type PracticeArtifact = z.infer<typeof PracticeArtifactSchema>;
export type PracticeValues = PracticeArtifact["values"];

export function validPracticeValues(path: GraduationPath, values: PracticeValues): boolean {
  return Object.entries(values).every(([id, value]) => {
    const field = path.artifactFields.find(item => item.id === id);
    if (!field) return false;
    if (field.type === "list") return Array.isArray(value);
    if (typeof value !== "string") return false;
    return field.type !== "date" || value === "" || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + "T00:00:00Z")) && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value);
  });
}

/** A handoff is a draft invitation. This pure merge never writes storage or marks work complete. */
export function mergePracticeArtifact(input: {
  incoming: unknown; path: GraduationPath; context: PracticeArtifact["context"];
  contract: string; current: PracticeValues; previous?: unknown;
}): { ok: true; values: PracticeValues; source: PracticeArtifact; preserved: string[] } | { ok: false; message: string } {
  const parsed = PracticeArtifactSchema.safeParse(input.incoming);
  if (!parsed.success) return { ok: false, message: "This draft could not be opened. Your existing notes are unchanged." };
  const incoming = parsed.data;
  if (incoming.context !== input.context || incoming.pathId !== input.path.id) return { ok: false, message: "Open this draft in its original program view and practice." };
  if (incoming.pathContract !== input.contract || !validPracticeValues(input.path, incoming.values)) return { ok: false, message: "This practice has changed since the draft was prepared. Ask for a fresh draft; your notes are unchanged." };
  const prior = PracticeArtifactSchema.safeParse(input.previous);
  const previous = prior.success && prior.data.context === input.context && prior.data.pathId === input.path.id && prior.data.pathContract === input.contract ? prior.data : undefined;
  if (previous?.artifactId === incoming.artifactId && (incoming.revisionId === previous.revisionId || incoming.parentRevisionId !== previous.revisionId)) {
    return { ok: false, message: "This draft is already open or belongs to an earlier revision. Your current notes are unchanged." };
  }
  const values = { ...input.current };
  const preserved: string[] = [];
  for (const [id, value] of Object.entries(incoming.values)) {
    const ownsField = Object.prototype.hasOwnProperty.call(input.current, id);
    const uneditedPrior = previous?.artifactId === incoming.artifactId && Object.prototype.hasOwnProperty.call(previous.values, id) && JSON.stringify(input.current[id]) === JSON.stringify(previous.values[id]);
    if (!ownsField || uneditedPrior) values[id] = value;
    else if (JSON.stringify(input.current[id]) !== JSON.stringify(value)) preserved.push(id);
  }
  return { ok: true, values, source: incoming, preserved };
}

export function startsNewPracticeTopic(question: string): boolean {
  return /\b(?:new|different|unrelated) (?:topic|question|subject|task)\b|\bstart (?:over|a new (?:draft|conversation))\b/i.test(question);
}

/** Keep the active draft through clarifying turns, bounded by an explicit topic reset or scope/path choice. */
export function activePracticeArtifact(turns: ReadonlyArray<{
  question: string; context?: string;
  result: { kind: string; answer?: { practiceArtifact?: unknown } };
}>, context: PracticeArtifact["context"], question: string, pathId?: string): PracticeArtifact | undefined {
  if (startsNewPracticeTopic(question)) return undefined;
  for (const turn of turns) {
    if (turn.context !== context) continue;
    const parsed = PracticeArtifactSchema.safeParse(turn.result.kind === "answer" ? turn.result.answer?.practiceArtifact : undefined);
    if (parsed.success && parsed.data.context === context) {
      return !pathId || parsed.data.pathId === pathId ? parsed.data : undefined;
    }
    if (startsNewPracticeTopic(turn.question)) return undefined;
  }
  return undefined;
}
