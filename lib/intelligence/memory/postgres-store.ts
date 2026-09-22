import type { ProgramAppendResult } from "@/lib/program/work-state";
import { ProgramEventSchema, type ProgramEvent } from "@/lib/program/work-schema";
import "server-only";
import type postgres from "postgres";
import { leaseRuntimeSql } from "@/lib/db/runtime-client";
import type { AuditEvent } from "../types";
import type {
  RateLimitDecision,
  SecurityHousekeepingResult,
  Store,
  WorkObjectKind,
} from "./store";
import {
  assertAuditEventPersistence,
  assertIdempotencyReceiptPersistence,
  assertWorkObjectPersistence,
} from "@/lib/trust/work-object-contract";
import {
  assertConsultationCasCommand,
  type ConsultationCasExpectation,
  type ConsultationCasFailureReason,
  type ConsultationCasResult,
} from "./consultation-cas";
import { assertCanonicalOperationalInstant } from "@/lib/privacy/operational-retention";
import { consultationInitialInsertIsValid } from "@/lib/trust/consultation-persistence-contract";

type Row = Record<string, unknown>;

export interface RuntimeQuery {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
}

export interface RuntimeDatabase extends RuntimeQuery {
  transaction<T>(work: (query: RuntimeQuery) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export type RuntimeDatabaseFactory = (configuration: {
  databaseUrl: string;
  ssl: false | "require";
}) => RuntimeDatabase;

export type PostgresStoreOptions = {
  databaseUrl: string;
  sslMode?: string;
  databaseFactory?: RuntimeDatabaseFactory;
};

const STATEMENTS = {
  get: `/* pac-runtime:get */
    select value::text as value_json
    from pac.runtime_work_objects
    where work_kind = $1 and object_id = $2`,
  put: `/* pac-runtime:put */
    insert into pac.runtime_work_objects (work_kind, object_id, value)
    values ($1, $2, $3::text::jsonb)
    on conflict (work_kind, object_id)
    do update set value = excluded.value, updated_at = now()`,
  claimIdempotency: `/* pac-runtime:claim-idempotency */
    insert into pac.runtime_idempotency (idempotency_key, work_kind, object_id, value)
    values ($1, $2, $3, $4::text::jsonb)
    on conflict (idempotency_key) do nothing
    returning value::text as value_json`,
  readIdempotency: `/* pac-runtime:read-idempotency */
    select value::text as value_json
    from pac.runtime_idempotency
    where idempotency_key = $1`,
  list: `/* pac-runtime:list */
    select value::text as value_json
    from pac.runtime_work_objects
    where work_kind = $1
    order by created_at, object_id`,
  appendAudit: `/* pac-runtime:append-audit */
    insert into pac.runtime_audit_events (event, occurred_at)
    values ($1::text::jsonb, $2::timestamptz)`,
  listAudit: `/* pac-runtime:list-audit */
    select event::text as event_json
    from pac.runtime_audit_events
    order by audit_id desc
    limit $1`,
  counter: `/* pac-runtime:counter */
    insert into pac.runtime_counters (scope, counter_value)
    values ($1, 1)
    on conflict (scope)
    do update set counter_value = pac.runtime_counters.counter_value + 1, updated_at = now()
    returning counter_value`,
  consumeRateLimit: `/* pac-runtime:consume-rate-limit */
    select allowed, remaining, reset_at
    from pac.consume_runtime_rate_limit($1, $2, $3, $4)`,
  purgeExpiredSecurityRecords: `/* pac-runtime:purge-expired-security-records */
    select owner_session_revocations_deleted, rate_limit_buckets_deleted,
      audit_events_deleted, research_usage_records_deleted,
      consultation_tombstones_deleted, idempotency_receipts_deleted
    from pac.purge_expired_security_records()`,
  compareAndSwapConsultation: `/* pac-runtime:compare-and-swap-consultation */
    select applied, reason, current_value::text as value_json
    from pac.compare_and_swap_consultation(
      $1, $2::integer, $3, $4, $5, $6::timestamptz, $7::text::jsonb
    )`,
} as const;

function databaseSsl(databaseUrl: string, configured?: string): false | "require" {
  let parsed: URL;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error("PAC_RUNTIME_DATABASE_URL must be a valid PostgreSQL connection string.");
  }
  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new Error("PAC_RUNTIME_DATABASE_URL must use the postgres or postgresql protocol.");
  }

  const mode = configured?.trim().toLowerCase();
  if (!mode) {
    return ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) ? false : "require";
  }
  if (["disable", "false", "off"].includes(mode)) return false;
  if (["require", "true", "on"].includes(mode)) return "require";
  throw new Error("PAC_RUNTIME_DATABASE_SSL must be require or disable.");
}

function defaultDatabaseFactory(configuration: {
  databaseUrl: string;
  ssl: false | "require";
}): RuntimeDatabase {
  const { sql: client, release } = leaseRuntimeSql(configuration);

  const wrap = (runner: postgres.Sql | postgres.TransactionSql): RuntimeQuery => ({
    async query<T extends Row>(statement: string, parameters: readonly unknown[] = []): Promise<T[]> {
      const result = await runner.unsafe<T[]>(statement, parameters as never[]);
      return Array.from(result);
    },
  });

  return {
    ...wrap(client),
    async transaction<T>(work: (query: RuntimeQuery) => Promise<T>): Promise<T> {
      return client.begin((transaction) => work(wrap(transaction))) as Promise<T>;
    },
    async close(): Promise<void> {
      await release();
    },
  };
}

function json(value: unknown): string {
  const encoded = JSON.stringify(value);
  if (encoded === undefined) {
    throw new Error("PostgreSQL store values must be JSON-serializable.");
  }
  return encoded;
}

function parseJson<T>(encoded: unknown): T {
  if (typeof encoded !== "string") {
    throw new Error("The PostgreSQL store returned an invalid JSON value.");
  }
  try {
    return JSON.parse(encoded) as T;
  } catch {
    throw new Error("The PostgreSQL store returned malformed JSON.");
  }
}

function positiveLimit(value: number): number {
  if (!Number.isFinite(value)) return 200;
  return Math.max(0, Math.min(10_000, Math.trunc(value)));
}

export class PostgresStore implements Store {
  readonly backend = "postgres" as const;
  private readonly configuration: { databaseUrl: string; ssl: false | "require" };
  private readonly factory: RuntimeDatabaseFactory;
  private activeDatabase: RuntimeDatabase | null = null;
  private closed = false;

  constructor(options: PostgresStoreOptions) {
    this.configuration = {
      databaseUrl: options.databaseUrl,
      ssl: databaseSsl(options.databaseUrl, options.sslMode),
    };
    this.factory = options.databaseFactory ?? defaultDatabaseFactory;
  }

  private database(): RuntimeDatabase {
    if (this.closed) throw new Error("The PostgreSQL store has been closed.");
    this.activeDatabase ??= this.factory(this.configuration);
    return this.activeDatabase;
  }

  async get<T>(kind: WorkObjectKind, id: string): Promise<T | null> {
    const rows = await this.database().query<{ value_json: string }>(STATEMENTS.get, [kind, id]);
    return rows[0] ? parseJson<T>(rows[0].value_json) : null;
  }

  async put<T>(
    kind: WorkObjectKind,
    id: string,
    value: T,
    idempotencyKey?: string,
  ): Promise<{ applied: boolean; value: T }> {
    assertWorkObjectPersistence(kind, id, value);
    if (kind === "consult_request" && !consultationInitialInsertIsValid(id, value)) {
      throw new Error("A new consultation must begin at the approved intake state.");
    }
    if (idempotencyKey) assertIdempotencyReceiptPersistence(kind, id, idempotencyKey);
    const encoded = json(value);
    if (!idempotencyKey) {
      await this.database().query(STATEMENTS.put, [kind, id, encoded]);
      return { applied: true, value };
    }

    return this.database().transaction(async (transaction) => {
      const receipt = json({ work_kind: kind, object_id: id });
      const claimed = await transaction.query<{ value_json: string }>(STATEMENTS.claimIdempotency, [
        idempotencyKey,
        kind,
        id,
        receipt,
      ]);
      if (claimed.length === 0) {
        const prior = await transaction.query<{ value_json: string }>(STATEMENTS.readIdempotency, [idempotencyKey]);
        if (!prior[0]) {
          throw new Error("The idempotency receipt could not be read after a concurrent write.");
        }
        const reference = parseJson<{ work_kind?: WorkObjectKind; object_id?: string }>(prior[0].value_json);
        if (!reference.work_kind || !reference.object_id) {
          throw new Error("The idempotency receipt uses an unsupported legacy format.");
        }
        const priorObject = await transaction.query<{ value_json: string }>(STATEMENTS.get, [
          reference.work_kind,
          reference.object_id,
        ]);
        if (!priorObject[0]) throw new Error("The idempotent work object is unavailable.");
        return { applied: false, value: parseJson<T>(priorObject[0].value_json) };
      }

      await transaction.query(STATEMENTS.put, [kind, id, encoded]);
      return { applied: true, value };
    });
  }

  async list<T>(kind: WorkObjectKind): Promise<T[]> {
    const rows = await this.database().query<{ value_json: string }>(STATEMENTS.list, [kind]);
    return rows.map((row) => parseJson<T>(row.value_json));
  }

  async appendProgramEvent(taskId:string,expectedEventId:string|null,event:ProgramEvent):Promise<ProgramAppendResult> {
    ProgramEventSchema.parse(event);
    if(taskId!==event.taskId)throw new Error("The task and event do not match.");
    const rows=await this.database().query<{applied:boolean;reason:string;event_json:string|null}>(
      "select applied, reason, event_value::text as event_json from pac.append_program_event($1,$2,$3::text::jsonb)",
      [taskId,expectedEventId,json(event)]);
    const row=rows[0];
    if(!row)throw new Error("The program event append returned no result.");
    if(row.applied && row.event_json) return {applied:true,event:ProgramEventSchema.parse(parseJson(row.event_json))};
    if(!["not_found","conflict","invalid_transition"].includes(row.reason))throw new Error("The program event append returned an invalid result.");
    return {applied:false,reason:row.reason as "not_found"|"conflict"|"invalid_transition",event:row.event_json?ProgramEventSchema.parse(parseJson(row.event_json)):null};
  }
  async compareAndSwapConsultation<T>(
    id: string,
    expected: ConsultationCasExpectation,
    replacement: T,
  ): Promise<ConsultationCasResult<T>> {
    assertConsultationCasCommand(id, expected, replacement);
    assertWorkObjectPersistence("consult_request", id, replacement);
    const rows = await this.database().query<{
      applied: boolean;
      reason: string;
      value_json: string | null;
    }>(STATEMENTS.compareAndSwapConsultation, [
      id,
      expected.version,
      expected.recordType,
      expected.retentionExpiresAt,
      expected.mutation,
      expected.guardAt,
      json(replacement),
    ]);
    const row = rows[0];
    if (!row) throw new Error("The consultation CAS function returned no decision.");
    if (row.applied) {
      if (row.reason !== "applied" || row.value_json === null) {
        throw new Error("The consultation CAS function returned an invalid applied decision.");
      }
      return { applied: true, value: parseJson<T>(row.value_json) };
    }
    const supported = new Set<ConsultationCasFailureReason>([
      "not_found",
      "conflict",
      "expired",
      "tombstone",
    ]);
    if (!supported.has(row.reason as ConsultationCasFailureReason)) {
      throw new Error("The consultation CAS function returned an invalid refusal reason.");
    }
    return {
      applied: false,
      reason: row.reason as ConsultationCasFailureReason,
      current: row.value_json === null ? null : parseJson<T>(row.value_json),
    };
  }

  async appendAudit(event: AuditEvent): Promise<void> {
    assertCanonicalOperationalInstant(event.at);
    assertAuditEventPersistence(event);
    await this.database().query(STATEMENTS.appendAudit, [json(event), event.at]);
  }

  async listAudit(limit = 200): Promise<AuditEvent[]> {
    const rows = await this.database().query<{ event_json: string }>(STATEMENTS.listAudit, [positiveLimit(limit)]);
    return rows.map((row) => parseJson<AuditEvent>(row.event_json));
  }

  async counter(scope: string): Promise<number> {
    const rows = await this.database().query<{ counter_value: number | string }>(STATEMENTS.counter, [scope]);
    const value = Number(rows[0]?.counter_value);
    if (!Number.isSafeInteger(value) || value < 1) {
      throw new Error("The PostgreSQL counter returned an invalid value.");
    }
    return value;
  }

  async consumeRateLimit(
    scope: string,
    subjectHash: string,
    limit: number,
    windowSeconds: number,
  ): Promise<RateLimitDecision> {
    const rows = await this.database().query<{
      allowed: boolean;
      remaining: number | string;
      reset_at: string | Date;
    }>(STATEMENTS.consumeRateLimit, [scope, subjectHash, limit, windowSeconds]);
    const row = rows[0];
    const remaining = Number(row?.remaining);
    const resetAt = row?.reset_at instanceof Date ? row.reset_at.toISOString() : String(row?.reset_at ?? "");
    if (!row || !Number.isSafeInteger(remaining) || remaining < 0 || !Number.isFinite(Date.parse(resetAt))) {
      throw new Error("The PostgreSQL rate limiter returned an invalid decision.");
    }
    return { allowed: row.allowed === true, remaining, resetAt };
  }

  async purgeExpiredSecurityRecords(): Promise<SecurityHousekeepingResult> {
    const rows = await this.database().query<{
      owner_session_revocations_deleted: number | string;
      rate_limit_buckets_deleted: number | string;
      audit_events_deleted: number | string;
      research_usage_records_deleted: number | string;
      consultation_tombstones_deleted: number | string;
      idempotency_receipts_deleted: number | string;
    }>(STATEMENTS.purgeExpiredSecurityRecords);
    const ownerSessionRevocations = Number(rows[0]?.owner_session_revocations_deleted);
    const rateLimitBuckets = Number(rows[0]?.rate_limit_buckets_deleted);
    const auditEvents = Number(rows[0]?.audit_events_deleted);
    const researchUsageRecords = Number(rows[0]?.research_usage_records_deleted);
    const consultationTombstones = Number(rows[0]?.consultation_tombstones_deleted);
    const idempotencyReceipts = Number(rows[0]?.idempotency_receipts_deleted);
    if (
      rows.length !== 1
      || !Number.isSafeInteger(ownerSessionRevocations)
      || ownerSessionRevocations < 0
      || !Number.isSafeInteger(rateLimitBuckets)
      || rateLimitBuckets < 0
      || !Number.isSafeInteger(auditEvents)
      || auditEvents < 0
      || !Number.isSafeInteger(researchUsageRecords)
      || researchUsageRecords < 0
      || !Number.isSafeInteger(consultationTombstones)
      || consultationTombstones < 0
      || !Number.isSafeInteger(idempotencyReceipts)
      || idempotencyReceipts < 0
    ) {
      throw new Error("The PostgreSQL security-housekeeping function returned an invalid result.");
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

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    const database = this.activeDatabase;
    this.activeDatabase = null;
    await database?.close();
  }
}
