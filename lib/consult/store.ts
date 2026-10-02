import "server-only";

import { runtimeDatabaseConfiguration, runtimeSql } from "@/lib/db/runtime-client";
import { hashToken, requesterToken } from "./tokens";
import type { ConsultEvent, ConsultNotice, ConsultPerson, ConsultRequest, ConsultStatus, LeaderRole } from "./types";

export type NewRequest = Omit<ConsultRequest, "id" | "createdAt" | "updatedAt" | "status" | "ownerName" | "acknowledgedAt" | "referredTo" | "outcome" | "closedAt"> ;
export type RequestPatch = Partial<Pick<ConsultRequest, "status" | "ownerName" | "acknowledgedAt" | "referredTo" | "outcome" | "closedAt">>;
export type NewEvent = Omit<ConsultEvent, "id" | "requestId" | "occurredAt">;
export type PersonScope = { role: LeaderRole; email: string };

export interface ConsultStore {
  readonly backend: "postgres" | "memory";
  createRequest(input: NewRequest, events: NewEvent[]): Promise<ConsultRequest>;
  getRequest(id: string): Promise<ConsultRequest | null>;
  getRequestByTokenHash(hash: string): Promise<ConsultRequest | null>;
  listRequests(scope?: PersonScope): Promise<ConsultRequest[]>;
  listEvents(requestId: string): Promise<ConsultEvent[]>;
  updateRequest(id: string, patch: RequestPatch, events: NewEvent[]): Promise<ConsultRequest | null>;
  upsertPerson(input: { email: string; displayName: string | null; role: LeaderRole; tokenHash: string; issuedAt: string; reissue: boolean }): Promise<ConsultPerson>;
  getPersonByTokenHash(hash: string): Promise<ConsultPerson | null>;
  getPerson(email: string): Promise<ConsultPerson | null>;
  listPeople(): Promise<ConsultPerson[]>;
  revokePerson(email: string): Promise<boolean>;
  addNotice(input: { requestId: string | null; toEmail: string; subject: string; body: string }): Promise<ConsultNotice>;
  listUnsentNotices(limit: number): Promise<ConsultNotice[]>;
  listNotices(requestId: string): Promise<ConsultNotice[]>;
  markNotice(id: number, result: { sent: boolean; error?: string }): Promise<void>;
  hasOverdueFlag(requestId: string): Promise<boolean>;
}

const ROLE_RANK: Record<LeaderRole, number> = { supervisor: 1, manager: 2, deputy_director: 3, division_director: 4 };

export function leaderCanSee(scope: PersonScope, request: Pick<ConsultRequest, "supervisorEmail" | "managerEmail">): boolean {
  if (scope.role === "deputy_director" || scope.role === "division_director") return true;
  const email = scope.email.toLowerCase();
  if (scope.role === "manager") return request.managerEmail?.toLowerCase() === email || request.supervisorEmail.toLowerCase() === email;
  return request.supervisorEmail.toLowerCase() === email;
}

function dayStamp(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  return parts.replaceAll("-", "");
}

/* ---------------------------------- memory --------------------------------- */

class MemoryStore implements ConsultStore {
  readonly backend = "memory" as const;
  private requests = new Map<string, ConsultRequest & { tokenHash: string }>();
  private events: ConsultEvent[] = [];
  private people = new Map<string, ConsultPerson & { tokenHash: string }>();
  private notices: ConsultNotice[] = [];
  private seq = 0;

  private strip(row: ConsultRequest & { tokenHash: string }): ConsultRequest {
    const { tokenHash: _unused, ...rest } = row;
    void _unused;
    return { ...rest };
  }

  async createRequest(input: NewRequest, events: NewEvent[]) {
    const now = new Date();
    const prefix = `DC-${dayStamp(now)}-`;
    const count = [...this.requests.keys()].filter((id) => id.startsWith(prefix)).length + 1;
    const id = `${prefix}${String(count).padStart(4, "0")}`;
    const rest = input;
    const row = { ...rest, id, createdAt: now.toISOString(), updatedAt: now.toISOString(), status: "received" as ConsultStatus, ownerName: null, acknowledgedAt: null, referredTo: null, outcome: null, closedAt: null, tokenHash: hashToken(requesterToken(id)) };
    this.requests.set(id, row);
    for (const event of events) this.events.push({ ...event, id: ++this.seq, requestId: id, occurredAt: now.toISOString() });
    return this.strip(row);
  }
  async getRequest(id: string) { const row = this.requests.get(id); return row ? this.strip(row) : null; }
  async getRequestByTokenHash(hash: string) {
    const row = [...this.requests.values()].find((entry) => entry.tokenHash === hash);
    return row ? this.strip(row) : null;
  }
  async listRequests(scope?: PersonScope) {
    return [...this.requests.values()].map((row) => this.strip(row)).filter((row) => !scope || leaderCanSee(scope, row)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async listEvents(requestId: string) { return this.events.filter((event) => event.requestId === requestId); }
  async updateRequest(id: string, patch: RequestPatch, events: NewEvent[]) {
    const row = this.requests.get(id);
    if (!row) return null;
    Object.assign(row, patch, { updatedAt: new Date().toISOString() });
    for (const event of events) this.events.push({ ...event, id: ++this.seq, requestId: id, occurredAt: new Date().toISOString() });
    return this.strip(row);
  }
  async upsertPerson(input: { email: string; displayName: string | null; role: LeaderRole; tokenHash: string; issuedAt: string; reissue: boolean }) {
    const existing = this.people.get(input.email);
    const now = new Date().toISOString();
    if (existing) {
      if (ROLE_RANK[input.role] > ROLE_RANK[existing.role]) existing.role = input.role;
      if (input.displayName && !existing.displayName) existing.displayName = input.displayName;
      if (input.reissue || existing.revokedAt) { existing.tokenHash = input.tokenHash; existing.tokenIssuedAt = input.issuedAt; existing.revokedAt = null; }
      const { tokenHash: _t, ...rest } = existing; void _t; return { ...rest };
    }
    const row = { email: input.email, displayName: input.displayName, role: input.role, createdAt: now, tokenIssuedAt: input.issuedAt, revokedAt: null, tokenHash: input.tokenHash };
    this.people.set(input.email, row);
    const { tokenHash: _t, ...rest } = row; void _t; return { ...rest };
  }
  async getPersonByTokenHash(hash: string) {
    const row = [...this.people.values()].find((entry) => entry.tokenHash === hash && !entry.revokedAt);
    if (!row) return null;
    const { tokenHash: _t, ...rest } = row; void _t; return { ...rest };
  }
  async getPerson(email: string) {
    const row = this.people.get(email);
    if (!row) return null;
    const { tokenHash: _t, ...rest } = row; void _t; return { ...rest };
  }
  async listPeople() { return [...this.people.values()].map(({ tokenHash: _t, ...rest }) => { void _t; return rest; }); }
  async revokePerson(email: string) {
    const row = this.people.get(email);
    if (!row) return false;
    row.revokedAt = new Date().toISOString();
    return true;
  }
  async addNotice(input: { requestId: string | null; toEmail: string; subject: string; body: string }) {
    const notice: ConsultNotice = { id: ++this.seq, ...input, createdAt: new Date().toISOString(), sentAt: null, attempts: 0, lastError: null };
    this.notices.push(notice);
    return notice;
  }
  async listUnsentNotices(limit: number) { return this.notices.filter((n) => !n.sentAt && n.attempts < 5).slice(0, limit); }
  async listNotices(requestId: string) { return this.notices.filter((n) => n.requestId === requestId); }
  async markNotice(id: number, result: { sent: boolean; error?: string }) {
    const notice = this.notices.find((n) => n.id === id);
    if (!notice) return;
    notice.attempts += 1;
    if (result.sent) notice.sentAt = new Date().toISOString();
    else notice.lastError = result.error?.slice(0, 500) ?? "Not sent";
  }
  async hasOverdueFlag(requestId: string) { return this.events.some((e) => e.requestId === requestId && e.kind === "overdue_flagged"); }
}

/* --------------------------------- postgres -------------------------------- */

type Row = Record<string, unknown>;
const iso = (value: unknown): string => (value instanceof Date ? value.toISOString() : String(value));
const isoOrNull = (value: unknown): string | null => (value === null || value === undefined ? null : iso(value));

function requestFromRow(row: Row): ConsultRequest {
  return {
    id: String(row.id),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    requesterName: String(row.requester_name),
    requesterEmail: String(row.requester_email),
    requesterUnit: (row.requester_unit as string | null) ?? null,
    supervisorName: String(row.supervisor_name),
    supervisorEmail: String(row.supervisor_email),
    managerEmail: (row.manager_email as string | null) ?? null,
    workTitle: String(row.work_title),
    supportType: row.support_type as ConsultRequest["supportType"],
    timing: row.timing as ConsultRequest["timing"],
    situation: String(row.situation),
    goals: String(row.goals),
    status: row.status as ConsultStatus,
    ownerName: (row.owner_name as string | null) ?? null,
    acknowledgmentDueAt: iso(row.acknowledgment_due_at),
    acknowledgedAt: isoOrNull(row.acknowledged_at),
    referredTo: (row.referred_to as string | null) ?? null,
    outcome: (row.outcome as string | null) ?? null,
    closedAt: isoOrNull(row.closed_at),
  };
}

function eventFromRow(row: Row): ConsultEvent {
  return {
    id: Number(row.event_id),
    requestId: String(row.request_id),
    occurredAt: iso(row.occurred_at),
    actor: row.actor as ConsultEvent["actor"],
    kind: row.kind as ConsultEvent["kind"],
    fromStatus: (row.from_status as ConsultStatus | null) ?? null,
    toStatus: (row.to_status as ConsultStatus | null) ?? null,
    note: (row.note as string | null) ?? null,
    visibleToRequester: Boolean(row.visible_to_requester),
  };
}

function personFromRow(row: Row): ConsultPerson {
  return {
    email: String(row.email),
    displayName: (row.display_name as string | null) ?? null,
    role: row.role as LeaderRole,
    createdAt: iso(row.created_at),
    tokenIssuedAt: iso(row.token_issued_at),
    revokedAt: isoOrNull(row.revoked_at),
  };
}

function noticeFromRow(row: Row): ConsultNotice {
  return {
    id: Number(row.notice_id),
    requestId: (row.request_id as string | null) ?? null,
    toEmail: String(row.to_email),
    subject: String(row.subject),
    body: String(row.body),
    createdAt: iso(row.created_at),
    sentAt: isoOrNull(row.sent_at),
    attempts: Number(row.attempts),
    lastError: (row.last_error as string | null) ?? null,
  };
}

class PostgresStore implements ConsultStore {
  readonly backend = "postgres" as const;
  private get sql() {
    const configuration = runtimeDatabaseConfiguration();
    if (!configuration) throw new Error("One DSD Consult needs PAC_RUNTIME_DATABASE_URL.");
    return runtimeSql(configuration);
  }

  async createRequest(input: NewRequest, events: NewEvent[]) {
    const sql = this.sql;
    const prefix = `DC-${dayStamp(new Date())}-`;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const created = await sql.begin(async (tx) => {
          const [next] = await tx`select coalesce(max(substr(id, 13)::int), 0) + 1 as n from pac.consult_requests where id like ${prefix + "%"}`;
          const id = `${prefix}${String(next.n).padStart(4, "0")}`;
          const [row] = await tx`
            insert into pac.consult_requests (id, requester_name, requester_email, requester_unit, supervisor_name, supervisor_email, manager_email, work_title, support_type, timing, situation, goals, acknowledgment_due_at, requester_token_hash)
            values (${id}, ${input.requesterName}, ${input.requesterEmail}, ${input.requesterUnit}, ${input.supervisorName}, ${input.supervisorEmail}, ${input.managerEmail}, ${input.workTitle}, ${input.supportType}, ${input.timing}, ${input.situation}, ${input.goals}, ${input.acknowledgmentDueAt}, ${hashToken(requesterToken(id))})
            returning *`;
          for (const event of events) {
            await tx`insert into pac.consult_events (request_id, actor, kind, from_status, to_status, note, visible_to_requester) values (${id}, ${event.actor}, ${event.kind}, ${event.fromStatus}, ${event.toStatus}, ${event.note}, ${event.visibleToRequester})`;
          }
          return row;
        });
        return requestFromRow(created as Row);
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === "23505" && attempt < 4) continue;
        throw error;
      }
    }
    throw new Error("Could not assign a request number.");
  }
  async getRequest(id: string) {
    const [row] = await this.sql`select * from pac.consult_requests where id = ${id}`;
    return row ? requestFromRow(row as Row) : null;
  }
  async getRequestByTokenHash(hash: string) {
    const [row] = await this.sql`select * from pac.consult_requests where requester_token_hash = ${hash}`;
    return row ? requestFromRow(row as Row) : null;
  }
  async listRequests(scope?: PersonScope) {
    const sql = this.sql;
    let rows;
    if (!scope || scope.role === "deputy_director" || scope.role === "division_director") {
      rows = await sql`select * from pac.consult_requests order by created_at desc limit 2000`;
    } else if (scope.role === "manager") {
      rows = await sql`select * from pac.consult_requests where lower(manager_email) = ${scope.email.toLowerCase()} or lower(supervisor_email) = ${scope.email.toLowerCase()} order by created_at desc limit 2000`;
    } else {
      rows = await sql`select * from pac.consult_requests where lower(supervisor_email) = ${scope.email.toLowerCase()} order by created_at desc limit 2000`;
    }
    return rows.map((row) => requestFromRow(row as Row));
  }
  async listEvents(requestId: string) {
    const rows = await this.sql`select * from pac.consult_events where request_id = ${requestId} order by event_id`;
    return rows.map((row) => eventFromRow(row as Row));
  }
  async updateRequest(id: string, patch: RequestPatch, events: NewEvent[]) {
    return this.sql.begin(async (tx) => {
      const [current] = await tx`select * from pac.consult_requests where id = ${id} for update`;
      if (!current) return null;
      const merged = {
        status: patch.status ?? current.status,
        owner_name: patch.ownerName === undefined ? current.owner_name : patch.ownerName,
        acknowledged_at: patch.acknowledgedAt === undefined ? current.acknowledged_at : patch.acknowledgedAt,
        referred_to: patch.referredTo === undefined ? current.referred_to : patch.referredTo,
        outcome: patch.outcome === undefined ? current.outcome : patch.outcome,
        closed_at: patch.closedAt === undefined ? current.closed_at : patch.closedAt,
      };
      const [row] = await tx`
        update pac.consult_requests set status = ${merged.status}, owner_name = ${merged.owner_name}, acknowledged_at = ${merged.acknowledged_at}, referred_to = ${merged.referred_to}, outcome = ${merged.outcome}, closed_at = ${merged.closed_at}, updated_at = now()
        where id = ${id} returning *`;
      for (const event of events) {
        await tx`insert into pac.consult_events (request_id, actor, kind, from_status, to_status, note, visible_to_requester) values (${id}, ${event.actor}, ${event.kind}, ${event.fromStatus}, ${event.toStatus}, ${event.note}, ${event.visibleToRequester})`;
      }
      return requestFromRow(row as Row);
    });
  }
  async upsertPerson(input: { email: string; displayName: string | null; role: LeaderRole; tokenHash: string; issuedAt: string; reissue: boolean }) {
    const [row] = await this.sql`
      insert into pac.consult_people (email, display_name, role, access_token_hash, token_issued_at)
      values (${input.email}, ${input.displayName}, ${input.role}, ${input.tokenHash}, ${input.issuedAt})
      on conflict (email) do update set
        role = case
          when array_position(array['supervisor','manager','deputy_director','division_director'], excluded.role) > array_position(array['supervisor','manager','deputy_director','division_director'], pac.consult_people.role) then excluded.role
          else pac.consult_people.role end,
        display_name = coalesce(pac.consult_people.display_name, excluded.display_name),
        access_token_hash = case when ${input.reissue} or pac.consult_people.revoked_at is not null then excluded.access_token_hash else pac.consult_people.access_token_hash end,
        token_issued_at = case when ${input.reissue} or pac.consult_people.revoked_at is not null then excluded.token_issued_at else pac.consult_people.token_issued_at end,
        revoked_at = case when ${input.reissue} or pac.consult_people.revoked_at is not null then null else pac.consult_people.revoked_at end
      returning *`;
    return personFromRow(row as Row);
  }
  async getPersonByTokenHash(hash: string) {
    const [row] = await this.sql`select * from pac.consult_people where access_token_hash = ${hash} and revoked_at is null`;
    return row ? personFromRow(row as Row) : null;
  }
  async getPerson(email: string) {
    const [row] = await this.sql`select * from pac.consult_people where email = ${email}`;
    return row ? personFromRow(row as Row) : null;
  }
  async listPeople() {
    const rows = await this.sql`select * from pac.consult_people order by role, email`;
    return rows.map((row) => personFromRow(row as Row));
  }
  async revokePerson(email: string) {
    const rows = await this.sql`update pac.consult_people set revoked_at = now() where email = ${email} and revoked_at is null returning email`;
    return rows.length > 0;
  }
  async addNotice(input: { requestId: string | null; toEmail: string; subject: string; body: string }) {
    const [row] = await this.sql`insert into pac.consult_notices (request_id, to_email, subject, body) values (${input.requestId}, ${input.toEmail}, ${input.subject}, ${input.body}) returning *`;
    return noticeFromRow(row as Row);
  }
  async listUnsentNotices(limit: number) {
    const rows = await this.sql`select * from pac.consult_notices where sent_at is null and attempts < 5 order by created_at limit ${limit}`;
    return rows.map((row) => noticeFromRow(row as Row));
  }
  async listNotices(requestId: string) {
    const rows = await this.sql`select * from pac.consult_notices where request_id = ${requestId} order by notice_id`;
    return rows.map((row) => noticeFromRow(row as Row));
  }
  async markNotice(id: number, result: { sent: boolean; error?: string }) {
    if (result.sent) await this.sql`update pac.consult_notices set sent_at = now(), attempts = attempts + 1, last_error = null where notice_id = ${id}`;
    else await this.sql`update pac.consult_notices set attempts = attempts + 1, last_error = ${(result.error ?? "Not sent").slice(0, 500)} where notice_id = ${id}`;
  }
  async hasOverdueFlag(requestId: string) {
    const [row] = await this.sql`select 1 as hit from pac.consult_events where request_id = ${requestId} and kind = 'overdue_flagged' limit 1`;
    return Boolean(row);
  }
}

type GlobalWithStore = typeof globalThis & { __oneDsdConsultMemory?: MemoryStore };

/** Postgres when the restricted runtime connection is configured; otherwise a temporary store for local use only. */
export function getConsultStore(): ConsultStore {
  if (runtimeDatabaseConfiguration()) return new PostgresStore();
  if (process.env.NODE_ENV === "production") throw new Error("One DSD Consult needs PAC_RUNTIME_DATABASE_URL in production.");
  const g = globalThis as GlobalWithStore;
  g.__oneDsdConsultMemory ??= new MemoryStore();
  return g.__oneDsdConsultMemory;
}

export function consultStorageIsDurable(): boolean {
  return Boolean(runtimeDatabaseConfiguration());
}

export function resetConsultMemoryStoreForTests(): void {
  (globalThis as GlobalWithStore).__oneDsdConsultMemory = new MemoryStore();
}
