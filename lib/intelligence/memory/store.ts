import { evaluateProgramAppend, type ProgramAppendResult } from "@/lib/program/work-state";
import type { ProgramEvent } from "@/lib/program/work-schema";
import { setTimeout as pause } from "node:timers/promises";
/**
 * Governed program memory (TRD Â§8). Work objects over chat: ConsultRequest, decisions,
 * eval results, audit events. Chat transcripts are not stored; Ask sessions remain in
 * the browser only.
 *
 * Backends:
 *  - memory: process-local storage for tests and explicitly selected temporary runs.
 *  - file:   JSON under .data/ for local development (PAC_STORE=file, or NODE_ENV=development).
 *  - postgres: durable shared storage selected explicitly with PAC_STORE=postgres.
 */
import "server-only";
import { promises as fs } from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
import { withIsolatedFlagOverrides } from "../registry/flags";
import path from "node:path";
import { PostgresStore } from "./postgres-store";
import type { AuditEvent } from "../types";
import {
  assertAuditEventPersistence,
  assertIdempotencyReceiptPersistence,
  assertWorkObjectPersistence,
} from "@/lib/trust/work-object-contract";
import {
  evaluateConsultationCas,
  type ConsultationCasExpectation,
  type ConsultationCasResult,
} from "./consultation-cas";
import { ownerSessionRevocationIsExpired } from "@/lib/auth/owner-session-revocation";
import {
  assertCanonicalOperationalInstant,
  canonicalOperationalInstant,
  OPERATIONAL_RETENTION_BATCH_LIMIT,
  operationalRecordIsExpired,
} from "@/lib/privacy/operational-retention";
import { consultationTombstoneTerminalDeletionDue } from "@/lib/privacy/consultation-terminal-retention";
import { consultationInitialInsertIsValid } from "@/lib/trust/consultation-persistence-contract";

export type {
  ConsultationCasExpectation,
  ConsultationCasFailureReason,
  ConsultationCasResult,
  ConsultationMutationKind,
} from "./consultation-cas";

export type WorkObjectKind = "consult_request" | "decision" | "eval_result" | "collaboration_workspace";
export type StoreBackend = "memory" | "file" | "postgres";

export type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  resetAt: string;
};

export type SecurityHousekeepingResult = {
  ownerSessionRevocations: number;
  rateLimitBuckets: number;
  auditEvents: number;
  researchUsageRecords: number;
  consultationTombstones: number;
  idempotencyReceipts: number;
};

function expiredResearchUsageRecord(
  objectId: string,
  value: unknown,
  now: number,
): boolean {
  if (!objectId.startsWith("research_usage:")) return false;
  try {
    assertWorkObjectPersistence("decision", objectId, value);
  } catch {
    return false;
  }
  const at = (value as { at?: unknown }).at;
  return canonicalOperationalInstant(at) && operationalRecordIsExpired(at, now);
}

export interface Store {
  readonly backend: StoreBackend;
  get<T>(kind: WorkObjectKind, id: string): Promise<T | null>;
  put<T>(kind: WorkObjectKind, id: string, value: T, idempotencyKey?: string): Promise<{ applied: boolean; value: T }>;
  compareAndSwapConsultation<T>(
    id: string,
    expected: ConsultationCasExpectation,
    replacement: T,
  ): Promise<ConsultationCasResult<T>>;
  appendProgramEvent(taskId: string, expectedEventId: string | null, event: ProgramEvent): Promise<ProgramAppendResult>;
  list<T>(kind: WorkObjectKind): Promise<T[]>;
  appendAudit(event: AuditEvent): Promise<void>;
  listAudit(limit?: number): Promise<AuditEvent[]>;
  counter(scope: string): Promise<number>;
  consumeRateLimit(scope: string, subjectHash: string, limit: number, windowSeconds: number): Promise<RateLimitDecision>;
  purgeExpiredSecurityRecords(): Promise<SecurityHousekeepingResult>;
  close?(): Promise<void>;
}

class MemoryStore implements Store {
  readonly backend = "memory" as const;
  private data = new Map<string, unknown>();
  private idem = new Map<string, { kind: WorkObjectKind; id: string }>();
  private audit: AuditEvent[] = [];
  private counters = new Map<string, number>();
  private rateLimits = new Map<string, { count: number; resetAt: number }>();

  async get<T>(kind: WorkObjectKind, id: string): Promise<T | null> {
    return (this.data.get(`${kind}:${id}`) as T | undefined) ?? null;
  }
  async put<T>(kind: WorkObjectKind, id: string, value: T, idempotencyKey?: string) {
    assertWorkObjectPersistence(kind, id, value);
    if(kind==="decision" && id.startsWith("program_event:")) throw new Error("Program events must use atomic append.");
    if(kind==="decision" && /^program_(task|outcome):/.test(id)) {
      const prior=this.data.get(kind+":"+id);
      if(prior!==undefined && JSON.stringify(prior)!==JSON.stringify(value)) {
        if(!idempotencyKey || !this.idem.has(idempotencyKey)) throw new Error("Program records are immutable.");
      }
    }
    if (kind === "consult_request" && !consultationInitialInsertIsValid(id, value)) {
      throw new Error("A new consultation must begin at the approved intake state.");
    }
    if (idempotencyKey) assertIdempotencyReceiptPersistence(kind, id, idempotencyKey);
    if (idempotencyKey && this.idem.has(idempotencyKey)) {
      const receipt = this.idem.get(idempotencyKey)!;
      const prior = this.data.get(`${receipt.kind}:${receipt.id}`) as T | undefined;
      if (prior === undefined) throw new Error("The idempotent work object is unavailable.");
      return { applied: false, value: prior };
    }
    const key = `${kind}:${id}`;
    if (kind === "consult_request" && this.data.has(key)) {
      throw new Error("Existing consultation records can be changed only through compare-and-swap.");
    }
    this.data.set(key, value);
    if (idempotencyKey) this.idem.set(idempotencyKey, { kind, id });
    return { applied: true, value };
  }
  async appendProgramEvent(taskId:string, expectedEventId:string|null, event:ProgramEvent):Promise<ProgramAppendResult> {
    assertWorkObjectPersistence("decision", "program_event:"+event.id, event);
    if(event.taskId!==taskId) throw new Error("The task and event do not match.");
    const values=[...this.data.entries()].filter(([k])=>k.startsWith("decision:")).map(([,v])=>v);
    const result=evaluateProgramAppend(this.data.get("decision:program_task:"+taskId),values,expectedEventId,event);
    if(result.applied) this.data.set("decision:program_event:"+event.id,event);
    return result;
  }
  async compareAndSwapConsultation<T>(
    id: string,
    expected: ConsultationCasExpectation,
    replacement: T,
  ): Promise<ConsultationCasResult<T>> {
    assertWorkObjectPersistence("consult_request", id, replacement);
    const key = `consult_request:${id}`;
    const current = (this.data.get(key) as T | undefined) ?? null;
    const decision = evaluateConsultationCas(id, current, expected, replacement);
    if (!decision.applied) return decision;
    this.data.set(key, replacement);
    return decision;
  }
  async list<T>(kind: WorkObjectKind): Promise<T[]> {
    const out: T[] = [];
    for (const [k, v] of this.data) if (k.startsWith(`${kind}:`)) out.push(v as T);
    return out;
  }
  async appendAudit(event: AuditEvent) {
    assertCanonicalOperationalInstant(event.at);
    assertAuditEventPersistence(event);
    this.audit.push(event);
  }
  async listAudit(limit = 200) {
    return this.audit.slice(-limit).reverse();
  }
  async counter(scope: string) {
    const n = (this.counters.get(scope) ?? 0) + 1;
    this.counters.set(scope, n);
    return n;
  }
  async consumeRateLimit(scope: string, subjectHash: string, limit: number, windowSeconds: number) {
    const now = Date.now();
    const key = `${scope}:${subjectHash}`;
    const current = this.rateLimits.get(key);
    const resetAt = !current || current.resetAt <= now ? now + windowSeconds * 1000 : current.resetAt;
    const count = !current || current.resetAt <= now ? 1 : current.count + 1;
    this.rateLimits.set(key, { count, resetAt });
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt: new Date(resetAt).toISOString(),
    };
  }
  async purgeExpiredSecurityRecords(): Promise<SecurityHousekeepingResult> {
    const now = Date.now();
    let ownerSessionRevocations = 0;
    let researchUsageRecords = 0;
    for (const [key, value] of this.data) {
      if (!key.startsWith("decision:")) continue;
      const objectId = key.slice("decision:".length);
      if (objectId.startsWith("owner-session-revoked-") && ownerSessionRevocationIsExpired(objectId, value, now)) {
        if (ownerSessionRevocations >= OPERATIONAL_RETENTION_BATCH_LIMIT) continue;
        this.data.delete(key);
        ownerSessionRevocations += 1;
      } else if (expiredResearchUsageRecord(objectId, value, now)) {
        if (researchUsageRecords >= OPERATIONAL_RETENTION_BATCH_LIMIT) continue;
        this.data.delete(key);
        researchUsageRecords += 1;
      }
    }
    const retainedAudit: AuditEvent[] = [];
    let auditEvents = 0;
    for (const event of this.audit) {
      if (
        auditEvents < OPERATIONAL_RETENTION_BATCH_LIMIT
        && operationalRecordIsExpired(event.at, now)
      ) auditEvents += 1;
      else retainedAudit.push(event);
    }
    this.audit = retainedAudit;
    let rateLimitBuckets = 0;
    for (const [key, value] of this.rateLimits) {
      if (value.resetAt <= now) {
        if (rateLimitBuckets >= OPERATIONAL_RETENTION_BATCH_LIMIT) continue;
        this.rateLimits.delete(key);
        rateLimitBuckets += 1;
      }
    }
    let consultationTombstones = 0;
    let idempotencyReceipts = 0;
    for (const [key, value] of this.data) {
      if (!key.startsWith("consult_request:")) continue;
      const objectId = key.slice("consult_request:".length);
      if (!consultationTombstoneTerminalDeletionDue(objectId, value, now)) continue;
      const related = [...this.idem.entries()].filter(([, receipt]) =>
        receipt.kind === "consult_request" && receipt.id === objectId
      );
      if (
        consultationTombstones >= OPERATIONAL_RETENTION_BATCH_LIMIT
        || idempotencyReceipts + related.length > OPERATIONAL_RETENTION_BATCH_LIMIT
      ) continue;
      for (const [idempotencyKey] of related) {
        this.idem.delete(idempotencyKey);
        idempotencyReceipts += 1;
      }
      this.data.delete(key);
      consultationTombstones += 1;
    }
    return {
      ownerSessionRevocations,
      rateLimitBuckets,
      auditEvents,
      researchUsageRecords,
      consultationTombstones,
      idempotencyReceipts,
    };
  }
}

class FileStore implements Store {
  readonly backend = "file" as const;
  private rateLimits = new Map<string, { count: number; resetAt: number }>();
  private consultationLocks = new Map<string, Promise<void>>();
  private auditLock: Promise<void> = Promise.resolve();
  constructor(private root: string) {}
  private dir(kind: string) {
    return path.join(this.root, kind);
  }
  private file(kind: string, id: string) {
    return path.join(this.dir(kind), `${id.replace(/[^A-Za-z0-9_-]/g, "_")}.json`);
  }
  async get<T>(kind: WorkObjectKind, id: string): Promise<T | null> {
    try {
      return JSON.parse(await fs.readFile(this.file(kind, id), "utf8")) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      return null;
    }
  }
  private async withProgramLock<T>(work:()=>Promise<T>):Promise<T> {
    await fs.mkdir(this.root,{recursive:true});
    const lock=path.join(this.root,"program-ledger.lock");
    let handle: Awaited<ReturnType<typeof fs.open>> | undefined;
    const deadline=Date.now()+5000;
    while(!handle) {
      try {handle=await fs.open(lock,"wx");}
      catch(error) {if((error as NodeJS.ErrnoException).code!=="EEXIST")throw error;if(Date.now()>=deadline)throw new Error("Program work is busy. Retry after the current operation finishes.");await pause(10);}
    }
    try{return await work();} finally {await handle.close();await fs.unlink(lock);}
  }
  async put<T>(kind:WorkObjectKind,id:string,value:T,idempotencyKey?:string) {
    if(kind==="decision" && id.startsWith("program_event:")) throw new Error("Program events must use atomic append.");
    if(kind==="decision" && /^program_(task|outcome):/.test(id)) return this.withProgramLock(()=>this.putUnlocked(kind,id,value,idempotencyKey));
    return this.putUnlocked(kind,id,value,idempotencyKey);
  }
  private async putUnlocked<T>(kind: WorkObjectKind, id: string, value: T, idempotencyKey?: string) {
    assertWorkObjectPersistence(kind, id, value);
    if (kind === "consult_request" && !consultationInitialInsertIsValid(id, value)) {
      throw new Error("A new consultation must begin at the approved intake state.");
    }
    if (idempotencyKey) assertIdempotencyReceiptPersistence(kind, id, idempotencyKey);
    if (idempotencyKey) {
      const prior = await this.get<{ kind: WorkObjectKind; id: string }>("decision", `idem_${idempotencyKey}`);
      if (prior) {
        const priorValue = await this.get<T>(prior.kind, prior.id);
        if (priorValue === null) throw new Error("The idempotent work object is unavailable.");
        return { applied: false, value: priorValue };
      }
    }
    if(kind==="decision" && /^program_(task|outcome):/.test(id)) {
      const prior=await this.get(kind,id);
      if(prior!==null && JSON.stringify(prior)!==JSON.stringify(value)) throw new Error("Program records are immutable.");
    }
    await fs.mkdir(this.dir(kind), { recursive: true });
    if (kind === "consult_request") {
      try {
        await fs.writeFile(this.file(kind, id), JSON.stringify(value, null, 2), { encoding: "utf8", flag: "wx" });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "EEXIST") {
          throw new Error("Existing consultation records can be changed only through compare-and-swap.");
        }
        throw error;
      }
      if (idempotencyKey) {
        await fs.mkdir(this.dir("decision"), { recursive: true });
        await fs.writeFile(this.file("decision", `idem_${idempotencyKey}`), JSON.stringify({ kind, id }), "utf8");
      }
      return { applied: true, value };
    }
    const tmp = `${this.file(kind, id)}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
    await fs.rename(tmp, this.file(kind, id));
    if (idempotencyKey) {
      await fs.mkdir(this.dir("decision"), { recursive: true });
      await fs.writeFile(this.file("decision", `idem_${idempotencyKey}`), JSON.stringify({ kind, id }), "utf8");
    }
    return { applied: true, value };
  }
  async appendProgramEvent(taskId:string,expectedEventId:string|null,event:ProgramEvent):Promise<ProgramAppendResult> {
    assertWorkObjectPersistence("decision","program_event:"+event.id,event);
    if(taskId!==event.taskId)throw new Error("The task and event do not match.");
    return this.withProgramLock(async()=>{
      const result=evaluateProgramAppend(await this.get("decision","program_task:"+taskId),await this.list("decision"),expectedEventId,event);
      if(result.applied) {
        await fs.mkdir(this.dir("decision"),{recursive:true});
        const destination=this.file("decision","program_event:"+event.id),temporary=destination+".tmp";
        await fs.writeFile(temporary,JSON.stringify(result.event,null,2),"utf8");
        await fs.rename(temporary,destination);
      }
      return result;
    });
  }
  private async withConsultationLock<T>(id: string, work: () => Promise<T>): Promise<T> {
    const prior = this.consultationLocks.get(id) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const tail = prior.then(() => gate);
    this.consultationLocks.set(id, tail);
    await prior;
    try {
      return await work();
    } finally {
      release();
      if (this.consultationLocks.get(id) === tail) this.consultationLocks.delete(id);
    }
  }
  private async withAuditLock<T>(work: () => Promise<T>): Promise<T> {
    const prior = this.auditLock;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.auditLock = prior.then(() => gate);
    await prior;
    try {
      return await work();
    } finally {
      release();
    }
  }
  async compareAndSwapConsultation<T>(
    id: string,
    expected: ConsultationCasExpectation,
    replacement: T,
  ): Promise<ConsultationCasResult<T>> {
    assertWorkObjectPersistence("consult_request", id, replacement);
    return this.withConsultationLock(id, async () => {
      const current = await this.get<T>("consult_request", id);
      const decision = evaluateConsultationCas(id, current, expected, replacement);
      if (!decision.applied) return decision;
      await fs.mkdir(this.dir("consult_request"), { recursive: true });
      const destination = this.file("consult_request", id);
      const temporary = `${destination}.cas-${process.pid}-${Date.now()}.tmp`;
      await fs.writeFile(temporary, JSON.stringify(replacement, null, 2), "utf8");
      await fs.rename(temporary, destination);
      return decision;
    });
  }
  async list<T>(kind: WorkObjectKind): Promise<T[]> {
    try {
      const names = await fs.readdir(this.dir(kind));
      const out: T[] = [];
      for (const n of names) {
        if (!n.endsWith(".json") || n.startsWith("idem_")) continue;
        out.push(JSON.parse(await fs.readFile(path.join(this.dir(kind), n), "utf8")) as T);
      }
      return out;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      return [];
    }
  }
  async appendAudit(event: AuditEvent) {
    assertCanonicalOperationalInstant(event.at);
    assertAuditEventPersistence(event);
    await this.withAuditLock(async () => {
      await fs.mkdir(this.root, { recursive: true });
      await fs.appendFile(path.join(this.root, "audit.jsonl"), JSON.stringify(event) + "\n", "utf8");
    });
  }
  async listAudit(limit = 200) {
    try {
      const lines = (await fs.readFile(path.join(this.root, "audit.jsonl"), "utf8")).trim().split("\n").filter(Boolean);
      return lines
        .slice(-limit)
        .reverse()
        .map((line) => {
          const event: unknown = JSON.parse(line);
          assertAuditEventPersistence(event);
          return event as AuditEvent;
        });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      return [];
    }
  }
  async counter(scope: string) {
    await fs.mkdir(this.root, { recursive: true });
    const f = path.join(this.root, "counters.json");
    let counters: Record<string, number> = {};
    try {
      const parsed: unknown = JSON.parse(await fs.readFile(f, "utf8"));
      if (
        !parsed
        || typeof parsed !== "object"
        || Array.isArray(parsed)
        || !Object.values(parsed).every((value) => Number.isSafeInteger(value) && Number(value) >= 0)
      ) {
        throw new Error("Local counter storage is invalid.");
      }
      counters = parsed as Record<string, number>;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    counters[scope] = (counters[scope] ?? 0) + 1;
    await fs.writeFile(f, JSON.stringify(counters), "utf8");
    return counters[scope];
  }
  async consumeRateLimit(scope: string, subjectHash: string, limit: number, windowSeconds: number) {
    const now = Date.now();
    const key = `${scope}:${subjectHash}`;
    const current = this.rateLimits.get(key);
    const resetAt = !current || current.resetAt <= now ? now + windowSeconds * 1000 : current.resetAt;
    const count = !current || current.resetAt <= now ? 1 : current.count + 1;
    this.rateLimits.set(key, { count, resetAt });
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt: new Date(resetAt).toISOString(),
    };
  }
  async purgeExpiredSecurityRecords(): Promise<SecurityHousekeepingResult> {
    const now = Date.now();
    let ownerSessionRevocations = 0;
    let researchUsageRecords = 0;
    try {
      const names = await fs.readdir(this.dir("decision"));
      for (const name of names) {
        if (!name.endsWith(".json")) continue;
        const revocationMatch = /^(owner-session-revoked-[a-f0-9]{64})\.json$/.exec(name);
        const researchMatch = /^(research_usage_[A-Za-z0-9_-]+)\.json$/.exec(name);
        if (!revocationMatch && !researchMatch) continue;
        const filename = path.join(this.dir("decision"), name);
        const value: unknown = JSON.parse(await fs.readFile(filename, "utf8"));
        if (revocationMatch && ownerSessionRevocationIsExpired(revocationMatch[1], value, now)) {
          if (ownerSessionRevocations >= OPERATIONAL_RETENTION_BATCH_LIMIT) continue;
          await fs.unlink(filename);
          ownerSessionRevocations += 1;
          continue;
        }
        if (!researchMatch) continue;
        const objectId = researchMatch[1].replace("research_usage_", "research_usage:");
        if (expiredResearchUsageRecord(objectId, value, now)) {
          if (researchUsageRecords >= OPERATIONAL_RETENTION_BATCH_LIMIT) continue;
          await fs.unlink(filename);
          researchUsageRecords += 1;
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    const auditEvents = await this.withAuditLock(async () => {
      let removed = 0;
      const auditFile = path.join(this.root, "audit.jsonl");
      try {
        const source = await fs.readFile(auditFile, "utf8");
        const trailingNewline = source.endsWith("\n");
        const retained: string[] = [];
        for (const line of source.split("\n")) {
          if (!line) continue;
          const event: unknown = JSON.parse(line);
          assertAuditEventPersistence(event);
          if (
            removed < OPERATIONAL_RETENTION_BATCH_LIMIT
            && operationalRecordIsExpired((event as AuditEvent).at, now)
          ) removed += 1;
          else retained.push(line);
        }
        if (removed > 0) {
          const temporary = `${auditFile}.purge-${process.pid}-${Date.now()}.tmp`;
          const encoded = retained.length ? `${retained.join("\n")}${trailingNewline ? "\n" : ""}` : "";
          await fs.writeFile(temporary, encoded, "utf8");
          await fs.rename(temporary, auditFile);
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      return removed;
    });

    let rateLimitBuckets = 0;
    for (const [key, value] of this.rateLimits) {
      if (value.resetAt <= now) {
        if (rateLimitBuckets >= OPERATIONAL_RETENTION_BATCH_LIMIT) continue;
        this.rateLimits.delete(key);
        rateLimitBuckets += 1;
      }
    }
    let consultationTombstones = 0;
    let idempotencyReceipts = 0;
    try {
      const consultationNames = (await fs.readdir(this.dir("consult_request")))
        .filter((name) => name.endsWith(".json"));
      const receiptNames = await fs.readdir(this.dir("decision")).catch((error: NodeJS.ErrnoException) => {
        if (error.code === "ENOENT") return [];
        throw error;
      });
      const receipts: Array<{ name: string; kind: WorkObjectKind; id: string }> = [];
      for (const name of receiptNames) {
        if (!name.startsWith("idem_") || !name.endsWith(".json")) continue;
        const parsed: unknown = JSON.parse(await fs.readFile(path.join(this.dir("decision"), name), "utf8"));
        if (
          !parsed || typeof parsed !== "object" || Array.isArray(parsed)
          || Object.keys(parsed).length !== 2
          || !new Set<WorkObjectKind>(["consult_request", "decision", "eval_result", "collaboration_workspace"])
            .has((parsed as { kind?: WorkObjectKind }).kind as WorkObjectKind)
          || typeof (parsed as { id?: unknown }).id !== "string"
        ) {
          throw new Error("Local idempotency receipt storage is invalid.");
        }
        const receipt = { name, kind: (parsed as { kind: WorkObjectKind }).kind, id: (parsed as { id: string }).id };
        assertIdempotencyReceiptPersistence(receipt.kind, receipt.id, name.slice("idem_".length, -".json".length));
        receipts.push(receipt);
      }
      for (const name of consultationNames) {
        const filename = path.join(this.dir("consult_request"), name);
        const value: unknown = JSON.parse(await fs.readFile(filename, "utf8"));
        const objectId = typeof value === "object" && value !== null && !Array.isArray(value)
          ? String((value as { request_id?: unknown }).request_id ?? "")
          : "";
        if (!consultationTombstoneTerminalDeletionDue(objectId, value, now)) continue;
        const related = receipts.filter((receipt) => receipt.kind === "consult_request" && receipt.id === objectId);
        if (
          consultationTombstones >= OPERATIONAL_RETENTION_BATCH_LIMIT
          || idempotencyReceipts + related.length > OPERATIONAL_RETENTION_BATCH_LIMIT
        ) continue;
        for (const receipt of related) {
          await fs.unlink(path.join(this.dir("decision"), receipt.name));
          idempotencyReceipts += 1;
        }
        await fs.unlink(filename);
        consultationTombstones += 1;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    return {
      ownerSessionRevocations,
      rateLimitBuckets,
      auditEvents,
      researchUsageRecords,
      consultationTombstones,
      idempotencyReceipts,
    };
  }
}

/** Test helper for exercising the local persistent backend without using workspace data. */
export function createFileStoreForTests(root: string): Store {
  return new FileStore(root);
}

type GlobalWithStore = typeof globalThis & { __pacStore?: Store };

const scopedStore = new AsyncLocalStorage<Store>();

export function getStore(): Store {
  const isolated = scopedStore.getStore();
  if (isolated) return isolated;
  const g = globalThis as GlobalWithStore;
  if (g.__pacStore) return g.__pacStore;
  const configured = process.env.PAC_STORE?.trim().toLowerCase();
  const mode = configured || (process.env.NODE_ENV === "development" ? "file" : "memory");
  let store: Store;
  if (mode === "memory") {
    store = new MemoryStore();
  } else if (mode === "file") {
    store = new FileStore(path.join(process.cwd(), ".data"));
  } else if (mode === "postgres") {
    const databaseUrl = process.env.PAC_RUNTIME_DATABASE_URL?.trim();
    if (!databaseUrl) {
      throw new Error("PAC_STORE=postgres requires the restricted, server-only PAC_RUNTIME_DATABASE_URL setting.");
    }
    store = new PostgresStore({
      databaseUrl,
      sslMode: process.env.PAC_RUNTIME_DATABASE_SSL,
    });
  } else {
    throw new Error(`Unsupported PAC_STORE value: ${mode}. Use memory, file, or postgres.`);
  }
  g.__pacStore = store;
  return store;
}

/** Test helper: swap the singleton for an isolated memory store. */
export function resetStoreForTests(): Store {
  const g = globalThis as GlobalWithStore;
  const closing = g.__pacStore?.close?.();
  if (closing) void closing.catch(() => undefined);
  g.__pacStore = new MemoryStore();
  return g.__pacStore;
}

/** Run sample or evaluation work without reading from or writing to the active workspace store. */
export function withIsolatedMemoryStore<T>(work: () => Promise<T>): Promise<T> {
  return scopedStore.run(new MemoryStore(), () => withIsolatedFlagOverrides(work));
}

/** Internal evaluation context, never enabled by a request field or feature flag. */
export function isIsolatedMemoryStore(): boolean {
  return scopedStore.getStore()?.backend === "memory";
}

/** Test helper: release and forget the configured singleton before testing a fresh start. */
export async function clearStoreForTests(): Promise<void> {
  const g = globalThis as GlobalWithStore;
  const active = g.__pacStore;
  delete g.__pacStore;
  await active?.close?.();
}

export function storeIsPersistent(store: Store): boolean {
  return store.backend === "file" || store.backend === "postgres";
}
