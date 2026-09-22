import { EvidenceClaimsSchema, SourceEvidenceSchema, evidenceReferencesMatch } from "@/lib/content/ask-evidence";
import "server-only";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { leaseRuntimeSql, runtimeDatabaseSsl, type RuntimeDatabaseLease } from "@/lib/db/runtime-client";
import { PracticeArtifactSchema } from "@/lib/content/practice-artifact";
import type { AskResearchMode, StaffAskResult } from "../agents/ask";
import { getStore, type Store, type StoreBackend } from "../memory/store";
import { askSafetyGates } from "../safety";

export type AskResponseRecord = {
  id: string;
  traceId: string;
  createdAt: string;
  programScope: "one-dhs" | "dsd";
  researchMode: AskResearchMode;
  status: "answered" | "limited" | "refused" | "unavailable" | "failed";
  httpStatus: number;
  question: string | null;
  questionOmittedReason: "private_information" | null;
  response: StaffAskResult | { error: string };
  researchStatus: "not_requested" | "used" | "not_connected" | "failed";
  expiresAt: string | null;
};
export type AskRecordingHealth = {
  backend: StoreBackend;
  durable: boolean;
  retentionDays: number | null;
  lastWriteFailure: { at: string; code: "record_write_failed" } | null;
};
export type AskRecordsListResult = {
  records: AskResponseRecord[];
  nextCursor: string | null;
  recording: AskRecordingHealth;
};
const Link = z.object({ label: z.string(), href: z.string() }).strict();
const Source = z.object({
  evidence: SourceEvidenceSchema.optional(),
  title: z.string(), href: z.string(), authorityLabel: z.string(),
  authorityDescription: z.string(), reviewLabel: z.string(),
}).strict();
const Response = z.union([
  z.object({ error: z.string() }).strict(),
  z.object({ kind: z.literal("refusal"), safety: z.object({
    message: z.string().optional(), redirect: Link.optional(), alternatives: z.array(Link).optional(),
  }).strict() }).strict(),
  z.object({ kind: z.literal("answer"), answer: z.object({
    practiceArtifact: PracticeArtifactSchema.optional(),
    evidenceClaims: EvidenceClaimsSchema.optional(),
    shortAnswer: z.string(), whyItMatters: z.string(), sources: z.array(Source),
    limits: z.array(z.string()), nextActions: z.array(Link),
    questions: z.array(z.object({ categoryLabel: z.string(), text: z.string() }).strict()).optional(),
    conflict: z.object({ message: z.string(), sources: z.array(Source) }).strict().optional(),
    consultation: z.object({ reason: z.string(), questionSummary: z.string() }).strict().optional(),
    pathSuggestion: z.object({ title: z.string(), why: z.string(), href: z.string() }).strict().optional(),
    notice: z.string().optional(),
    publicResearch: z.object({
      heading: z.string(), answer: z.string().optional(),
      sources: z.array(z.object({ title: z.string(), url: z.string(), date: z.string().optional() }).strict()),
      note: z.string(),
    }).strict().optional(),
  }).strict() }).strict(),
]);
const RecordSchema = z.object({
  id: z.string().uuid(), traceId: z.string().uuid(), createdAt: z.string().datetime(),
  programScope: z.enum(["one-dhs", "dsd"]),
  researchMode: z.enum(["auto", "program_only", "web_results", "current_web", "deep_research"]),
  status: z.enum(["answered", "limited", "refused", "unavailable", "failed"]),
  httpStatus: z.number().int().min(100).max(599),
  question: z.string().min(1).max(4000).nullable(),
  questionOmittedReason: z.literal("private_information").nullable(),
  response: Response,
  researchStatus: z.enum(["not_requested", "used", "not_connected", "failed"]),
  expiresAt: z.string().datetime().nullable(),
}).strict().refine(record => (record.question === null) === (record.questionOmittedReason !== null)).refine(record => {
  const artifact = "kind" in record.response && record.response.kind === "answer" ? record.response.answer.practiceArtifact : undefined;
  return !artifact || (artifact.traceId === record.traceId && artifact.context === (record.programScope === "dsd" ? "one_dsd" : "one_dhs"));
}, "Practice draft must belong to its response trace and program view.");

export function validateAskRecord(value: unknown): AskResponseRecord {
  const record = RecordSchema.parse(value);
  if (Buffer.byteLength(JSON.stringify(record), "utf8") > 1_048_576) throw new Error("ASK record exceeds its storage limit.");
  if ("kind" in record.response && record.response.kind === "answer") {
    const answer=record.response.answer;
    if (!evidenceReferencesMatch(answer.evidenceClaims ?? [], answer.sources.flatMap(source => source.evidence ? [source.evidence] : []))) throw Error("ASK evidence references do not match the retained sources.");
  }
  return record;
}
type Cursor = { createdAt: string; id: string };
const CursorSchema = z.object({ createdAt: z.string().datetime(), id: z.string().uuid() }).strict();
function decodeCursor(value?: string): Cursor | null {
  if (!value) return null;
  if (value.length > 300 || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("Invalid ASK record cursor.");
  return CursorSchema.parse(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
}
const encodeCursor = (record: AskResponseRecord) => Buffer.from(JSON.stringify({ createdAt: record.createdAt, id: record.id })).toString("base64url");
const compare = (a: AskResponseRecord, b: AskResponseRecord) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id);
const beforeCursor = (record: AskResponseRecord, cursor: Cursor | null) => !cursor || record.createdAt < cursor.createdAt || (record.createdAt === cursor.createdAt && record.id < cursor.id);

export interface AskRecordsStore {
  readonly backend: StoreBackend;
  append(record: AskResponseRecord): Promise<void>;
  list(limit: number, before: Cursor | null, now: string): Promise<AskResponseRecord[]>;
  delete(ids: string[]): Promise<number>;
  purgeExpired(now: string): Promise<number>;
  close?(): Promise<void>;
}
type AskDeletionReason = "owner_delete" | "retention_expired" | "restore_excluded";
const DeletionReceiptSchema = z.object({
  id: z.string().uuid(), deletedAt: z.string().datetime(),
  reason: z.enum(["owner_delete", "retention_expired", "restore_excluded"]),
}).strict();

export class MemoryAskRecordsStore implements AskRecordsStore {
  readonly backend = "memory" as const;
  private records = new Map<string, AskResponseRecord>();
  private deletedIds = new Set<string>();
  async append(value: AskResponseRecord) {
    const record = validateAskRecord(value);
    if (this.deletedIds.has(record.id.toLowerCase())) throw new Error("ASK record was deleted and cannot be restored by append.");
    const prior = this.records.get(record.id.toLowerCase());
    if (prior && JSON.stringify(prior) !== JSON.stringify(record)) throw new Error("ASK record is immutable.");
    this.records.set(record.id.toLowerCase(), structuredClone(record));
  }
  async list(limit: number, before: Cursor | null, now: string) {
    return structuredClone([...this.records.values()].filter(record => !this.deletedIds.has(record.id.toLowerCase()) && (!record.expiresAt || record.expiresAt > now) && beforeCursor(record, before)).sort(compare).slice(0, limit));
  }
  async delete(ids: string[]) {
    let deleted = 0;
    for (const value of ids) { const id = z.string().uuid().parse(value).toLowerCase(); this.deletedIds.add(id); if (this.records.delete(id)) deleted++; }
    return deleted;
  }
  async purgeExpired(now: string) { return this.delete([...this.records.values()].filter(record => record.expiresAt && record.expiresAt <= now).slice(0, 1000).map(record => record.id)); }
}
export class FileAskRecordsStore implements AskRecordsStore {
  readonly backend = "file" as const;
  constructor(private readonly directory: string) {}
  private filename(id: string) { return path.join(this.directory, z.string().uuid().parse(id).toLowerCase() + ".json"); }
  private deletionFilename(id: string) { return path.join(this.directory, ".deletions", z.string().uuid().parse(id).toLowerCase() + ".json"); }
  private async wasDeleted(id: string) {
    try {
      const receipt = DeletionReceiptSchema.parse(JSON.parse(await fs.readFile(this.deletionFilename(id), "utf8")));
      if (receipt.id.toLowerCase() !== id.toLowerCase()) throw new Error("ASK deletion receipt does not match its identifier.");
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
      throw error;
    }
  }
  private async writeDeletion(id: string, reason: AskDeletionReason) {
    await fs.mkdir(path.join(this.directory, ".deletions"), { recursive: true, mode: 0o700 });
    const receipt = DeletionReceiptSchema.parse({ id: z.string().uuid().parse(id).toLowerCase(), deletedAt: new Date().toISOString(), reason });
    let handle: Awaited<ReturnType<typeof fs.open>> | undefined;
    try {
      handle = await fs.open(this.deletionFilename(id), "wx", 0o600);
      await handle.writeFile(JSON.stringify(receipt));
      await handle.sync();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (!await this.wasDeleted(id)) throw new Error("ASK deletion receipt is unavailable.");
    } finally { await handle?.close(); }
  }
  async append(value: AskResponseRecord) {
    const record = validateAskRecord(value);
    if (await this.wasDeleted(record.id)) throw new Error("ASK record was deleted and cannot be restored by append.");
    await fs.mkdir(this.directory, { recursive: true, mode: 0o700 });
    const temporary = path.join(this.directory, "." + randomUUID() + ".tmp");
    await fs.writeFile(temporary, JSON.stringify(record), { flag: "wx", mode: 0o600 });
    try {
      try { await fs.link(temporary, this.filename(record.id)); }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        const prior = JSON.parse(await fs.readFile(this.filename(record.id), "utf8"));
        if (JSON.stringify(prior) !== JSON.stringify(record)) throw new Error("ASK record is immutable.");
      }
      if (await this.wasDeleted(record.id)) {
        await fs.unlink(this.filename(record.id)).catch((error: NodeJS.ErrnoException) => { if (error.code !== "ENOENT") throw error; });
        throw new Error("ASK record was deleted and cannot be restored by append.");
      }
    } finally { await fs.unlink(temporary); }
  }
  private async recordIds() {
    let names: string[];
    try { names = await fs.readdir(this.directory); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
    return names.filter(name => name.endsWith(".json")).map(name => z.string().uuid().parse(name.slice(0,-5)));
  }
  private async all() {
    const records = await Promise.all((await this.recordIds()).map(async id => {
      if (await this.wasDeleted(id)) return null;
      try {
        const record = validateAskRecord(JSON.parse(await fs.readFile(this.filename(id), "utf8")));
        return await this.wasDeleted(id) ? null : record;
      } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT" && await this.wasDeleted(id)) return null; throw error; }
    }));
    return records.filter((record): record is AskResponseRecord => record !== null);
  }
  async list(limit: number, before: Cursor | null, now: string) {
    return (await this.all()).filter(record => (!record.expiresAt || record.expiresAt > now) && beforeCursor(record, before)).sort(compare).slice(0, limit);
  }
  async delete(ids: string[], reason: AskDeletionReason = "owner_delete") {
    let deleted = 0;
    for (const id of ids) {
      await this.writeDeletion(id, reason);
      try { await fs.unlink(this.filename(id)); deleted++; }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    }
    return deleted;
  }
  async purgeExpired(now: string) { return this.delete((await this.all()).filter(record => record.expiresAt && record.expiresAt <= now).slice(0, 1000).map(record => record.id), "retention_expired"); }
  /** An old backup cannot establish the current deletion set. Exclude recovered
   * bodies before opening it; do not claim this is authoritative-journal replay. */
  async excludeRecoveredRecords() { return this.delete(await this.recordIds(), "restore_excluded"); }
}

export async function prepareFileAskRecordRestore(directory: string): Promise<{ excludedRecords: number }> {
  return { excludedRecords: await new FileAskRecordsStore(directory).excludeRecoveredRecords() };
}

export class PostgresAskRecordsStore implements AskRecordsStore {
  readonly backend = "postgres" as const;
  private readonly lease: RuntimeDatabaseLease;
  private get sql() { return this.lease.sql; }
  constructor(databaseUrl: string, sslMode?: string) {
    this.lease = leaseRuntimeSql({ databaseUrl, ssl: runtimeDatabaseSsl(databaseUrl, sslMode) });
  }
  async append(value: AskResponseRecord) {
    const record = validateAskRecord(value);
    await this.sql.unsafe("select pac.append_ask_response_record($1::text::jsonb)", [JSON.stringify(record)]);
  }
  async list(limit: number, before: Cursor | null, now: string) {
    const rows = await this.sql.unsafe<{ record: unknown }[]>("select record from pac.list_ask_response_records($1::integer,$2::timestamptz,$3::uuid,$4::timestamptz)", [limit, before?.createdAt ?? null, before?.id ?? null, now]);
    return rows.map(row => validateAskRecord(row.record));
  }
  async delete(ids: string[]) {
    const valid = ids.map(id => z.string().uuid().parse(id));
    const rows = await this.sql.unsafe<{ deleted: number }[]>("select pac.delete_ask_response_records($1::text::jsonb) as deleted", [JSON.stringify(valid)]);
    return Number(rows[0]?.deleted ?? 0);
  }
  async purgeExpired(now: string) {
    const rows = await this.sql.unsafe<{ deleted: number }[]>("select pac.purge_expired_ask_response_records($1::timestamptz) as deleted", [now]);
    return Number(rows[0]?.deleted ?? 0);
  }
  async close() { await this.lease.release(); }
}
const stores = new WeakMap<Store, AskRecordsStore>();
let lastWriteFailure: AskRecordingHealth["lastWriteFailure"] = null;
export function getAskRecordsStore(): AskRecordsStore {
  const active = getStore();
  const existing = stores.get(active);
  if (existing) return existing;
  let records: AskRecordsStore;
  if (active.backend === "memory") records = new MemoryAskRecordsStore();
  else if (active.backend === "file") records = new FileAskRecordsStore(path.join(process.cwd(), ".data", "ask-response-records"));
  else {
    const url = process.env.PAC_RUNTIME_DATABASE_URL?.trim();
    if (!url) throw new Error("ASK response database is unavailable.");
    records = new PostgresAskRecordsStore(url, process.env.PAC_RUNTIME_DATABASE_SSL);
  }
  stores.set(active, records);
  return records;
}
export function askRecordRetentionDays(): number | null {
  const value = process.env.PAC_ASK_RECORD_RETENTION_DAYS?.trim();
  if (!value) return null;
  if (!/^[1-9][0-9]{0,4}$/.test(value) || Number(value) > 36500) throw new Error("ASK record retention is invalid.");
  return Number(value);
}
export function askRecordingHealth(): AskRecordingHealth {
  const backend = getStore().backend;
  return { backend, durable: backend !== "memory", retentionDays: askRecordRetentionDays(), lastWriteFailure };
}
export function createAskResponseRecord(
  input: Omit<AskResponseRecord, "id" | "createdAt" | "questionOmittedReason" | "expiresAt"> & { question: string },
  now = new Date(),
): AskResponseRecord {
  const safeQuestion = askSafetyGates(input.question).ok;
  const days = askRecordRetentionDays();
  return validateAskRecord({
    ...input, id: randomUUID(), createdAt: now.toISOString(),
    question: safeQuestion ? input.question : null,
    questionOmittedReason: safeQuestion ? null : "private_information",
    expiresAt: days === null ? null : new Date(now.getTime() + days * 86_400_000).toISOString(),
  });
}
/** Answer delivery remains available when the separate owner journal fails. */
export async function saveAskResponseRecord(input: Parameters<typeof createAskResponseRecord>[0]): Promise<boolean> {
  try {
    const record = createAskResponseRecord(input);
    await getAskRecordsStore().append(record);
    return true;
  } catch {
    lastWriteFailure = { at: new Date().toISOString(), code: "record_write_failed" };
    const safeTrace = z.string().uuid().safeParse(input.traceId);
    console.warn(JSON.stringify({ event: "ask_record_write_failed", ...(safeTrace.success ? { traceId: safeTrace.data } : {}), ...lastWriteFailure }));
    return false;
  }
}
export async function listAskResponseRecords(options: { limit?: number; before?: string } = {}): Promise<AskRecordsListResult> {
  const limit = z.number().int().min(1).max(100).parse(options.limit ?? 50);
  const cursor = decodeCursor(options.before);
  const store = getAskRecordsStore();
  const now = new Date().toISOString();
  await store.purgeExpired(now);
  const records = await store.list(limit + 1, cursor, now);
  const hasMore = records.length > limit;
  const page = records.slice(0, limit);
  return { records: page, nextCursor: hasMore ? encodeCursor(page[page.length - 1]) : null, recording: askRecordingHealth() };
}
export async function deleteAskResponseRecords(ids: string[]): Promise<number> {
  return getAskRecordsStore().delete(z.array(z.string().uuid()).min(1).max(100).parse(ids));
}
export async function purgeExpiredAskResponseRecords(now = new Date()): Promise<number> {
  return getAskRecordsStore().purgeExpired(now.toISOString());
}
export function validateAskRecordCursor(value: string): boolean {
  try { decodeCursor(value); return true; } catch { return false; }
}
