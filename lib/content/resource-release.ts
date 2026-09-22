import "server-only";

import { leaseRuntimeSql } from "@/lib/db/runtime-client";
import {
  ResourceReleaseQueueItemSchema,
  ResourceReleaseStateSchema,
  type ResourceReleaseQueueItem,
  type ResourceReleaseState,
} from "./resource-release-contract";
import {
  staffContentSource,
  staffProgramScope,
  type StaffProgramScope,
} from "./staff-publications";

type Row = Record<string, unknown>;
type StateRow = { release_state: unknown };
type QueueRow = {
  content_item_id: string;
  title: string;
  has_draft: boolean;
  ready_to_publish: boolean;
  is_published: boolean;
  changed_at: Date | string | null;
};

export interface ResourceReleaseDatabase {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
  close(): Promise<void>;
}

export type ResourceReleaseDatabaseFactory = (configuration: {
  databaseUrl: string;
  ssl: false | "require";
}) => ResourceReleaseDatabase;

export type PostgresResourceReleaseStoreOptions = {
  databaseUrl: string;
  sslMode?: string;
  databaseFactory?: ResourceReleaseDatabaseFactory;
};

const READ_STATE = `/* pac-content:read-resource-release-state */
  select pac.read_resource_release_state($1, $2) as release_state`;
const LIST_QUEUE = `/* pac-content:list-resource-release-queue */
  select content_item_id, title, has_draft, ready_to_publish, is_published, changed_at
  from pac.list_resource_release_queue($1)`;
const RECORD_REVIEW = `/* pac-content:record-resource-review */
  select pac.record_resource_review($1, $2, $3::uuid, $4, $5::uuid, $6, $7) as release_state`;
const PUBLISH_DRAFT = `/* pac-content:publish-resource-draft */
  select pac.publish_resource_draft(
    $1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8
  ) as release_state`;
const WITHDRAW_PUBLICATION = `/* pac-content:withdraw-resource-publication */
  select pac.withdraw_resource_publication($1, $2, $3::uuid, $4::bigint, $5) as release_state`;
const REPUBLISH_REVISION = `/* pac-content:republish-resource-revision */
  select pac.republish_resource_revision(
    $1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8
  ) as release_state`;

export class ResourceReleaseConflictError extends Error {
  constructor() {
    super("This resource changed after the page was opened.");
    this.name = "ResourceReleaseConflictError";
  }
}

export class ResourceReleaseNotFoundError extends Error {
  constructor() {
    super("This resource is not available for review.");
    this.name = "ResourceReleaseNotFoundError";
  }
}

export class ResourceReleaseGateError extends Error {
  constructor() {
    super("This resource is not ready for that step.");
    this.name = "ResourceReleaseGateError";
  }
}

export class ResourceReleaseValidationError extends Error {
  constructor() {
    super("Check the information provided and try again.");
    this.name = "ResourceReleaseValidationError";
  }
}

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
  if (!mode) return ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) ? false : "require";
  if (["disable", "false", "off"].includes(mode)) return false;
  if (["require", "true", "on"].includes(mode)) return "require";
  throw new Error("PAC_RUNTIME_DATABASE_SSL must be require or disable.");
}

function defaultDatabaseFactory(configuration: {
  databaseUrl: string;
  ssl: false | "require";
}): ResourceReleaseDatabase {
  const { sql: client, release } = leaseRuntimeSql(configuration);
  return {
    async query<T extends Row>(statement: string, parameters: readonly unknown[] = []): Promise<T[]> {
      const result = await client.unsafe<T[]>(statement, parameters as never[]);
      return Array.from(result);
    },
    async close(): Promise<void> {
      await release();
    },
  };
}

function parsedState(value: unknown): ResourceReleaseState {
  let candidate = value;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate) as unknown;
    } catch {
      throw new Error("The resource review record is malformed.");
    }
  }
  return ResourceReleaseStateSchema.parse(candidate);
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

function mappedError(error: unknown): Error {
  if (
    error instanceof ResourceReleaseConflictError ||
    error instanceof ResourceReleaseNotFoundError ||
    error instanceof ResourceReleaseGateError ||
    error instanceof ResourceReleaseValidationError
  ) {
    return error;
  }
  const code = errorCode(error);
  if (code === "40001" || code === "23505") return new ResourceReleaseConflictError();
  if (code === "P0002") return new ResourceReleaseNotFoundError();
  if (code === "55000" || code === "23514") return new ResourceReleaseGateError();
  if (code === "22000" || code === "22023") return new ResourceReleaseValidationError();
  return error instanceof Error ? error : new Error("Resource review failed.");
}

export class PostgresResourceReleaseStore {
  private readonly database: ResourceReleaseDatabase;

  constructor(options: PostgresResourceReleaseStoreOptions) {
    this.database = (options.databaseFactory ?? defaultDatabaseFactory)({
      databaseUrl: options.databaseUrl,
      ssl: databaseSsl(options.databaseUrl, options.sslMode),
    });
  }

  async read(id: string, scope: StaffProgramScope): Promise<ResourceReleaseState | undefined> {
    try {
      const rows = await this.database.query<StateRow>(READ_STATE, [scope, id]);
      if (rows.length > 1) throw new Error(`Resource review ${id} returned more than one record.`);
      return rows[0] ? parsedState(rows[0].release_state) : undefined;
    } catch (error) {
      if (errorCode(error) === "P0002") return undefined;
      throw mappedError(error);
    }
  }

  async list(scope: StaffProgramScope): Promise<ResourceReleaseQueueItem[]> {
    const rows = await this.database.query<QueueRow>(LIST_QUEUE, [scope]);
    return rows.map((row) =>
      ResourceReleaseQueueItemSchema.parse({
        contentItemId: row.content_item_id,
        title: row.title,
        hasDraft: row.has_draft,
        readyToPublish: row.ready_to_publish,
        isPublished: row.is_published,
        changedAt:
          row.changed_at instanceof Date
            ? row.changed_at.toISOString()
            : row.changed_at === null
              ? null
              : String(row.changed_at),
      }),
    );
  }

  private async mutate(statement: string, parameters: readonly unknown[]): Promise<ResourceReleaseState> {
    try {
      const rows = await this.database.query<StateRow>(statement, parameters);
      if (rows.length !== 1) throw new ResourceReleaseNotFoundError();
      return parsedState(rows[0].release_state);
    } catch (error) {
      throw mappedError(error);
    }
  }

  recordReview(
    id: string,
    scope: StaffProgramScope,
    revisionId: string,
    dimension: string,
    decision: string,
    expectedPriorReviewId: string,
    note: string | null,
  ) {
    return this.mutate(RECORD_REVIEW, [
      scope,
      id,
      revisionId,
      dimension,
      expectedPriorReviewId,
      decision,
      note,
    ]);
  }

  publish(
    id: string,
    scope: StaffProgramScope,
    revisionId: string,
    expectedScopeDecisionId: string | null,
    reason: string,
    sensitivityClass: "S0" | "S1",
    unauthenticatedExposurePermitted: true,
    exposureReason: string,
  ) {
    return this.mutate(PUBLISH_DRAFT, [
      scope,
      id,
      revisionId,
      expectedScopeDecisionId,
      reason,
      sensitivityClass,
      unauthenticatedExposurePermitted,
      exposureReason,
    ]);
  }

  withdraw(
    id: string,
    scope: StaffProgramScope,
    revisionId: string,
    expectedScopeDecisionId: string | null,
    reason: string,
  ) {
    return this.mutate(WITHDRAW_PUBLICATION, [scope, id, revisionId, expectedScopeDecisionId, reason]);
  }

  republish(
    id: string,
    scope: StaffProgramScope,
    revisionId: string,
    expectedScopeDecisionId: string | null,
    reason: string,
    sensitivityClass: "S0" | "S1",
    unauthenticatedExposurePermitted: true,
    exposureReason: string,
  ) {
    return this.mutate(REPUBLISH_REVISION, [
      scope,
      id,
      revisionId,
      expectedScopeDecisionId,
      reason,
      sensitivityClass,
      unauthenticatedExposurePermitted,
      exposureReason,
    ]);
  }

  async close(): Promise<void> {
    await this.database.close();
  }
}

let defaultStore: PostgresResourceReleaseStore | null = null;
let defaultStoreKey = "";

function runtimeStore(): PostgresResourceReleaseStore {
  const databaseUrl = process.env.PAC_RUNTIME_DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("PAC_RUNTIME_DATABASE_URL is required for resource review.");
  const key = `${databaseUrl}\u0000${process.env.PAC_RUNTIME_DATABASE_SSL ?? ""}`;
  if (!defaultStore || defaultStoreKey !== key) {
    defaultStore = new PostgresResourceReleaseStore({
      databaseUrl,
      sslMode: process.env.PAC_RUNTIME_DATABASE_SSL,
    });
    defaultStoreKey = key;
  }
  return defaultStore;
}

export function resourceReleaseAvailable(environment: NodeJS.ProcessEnv = process.env): boolean {
  return staffContentSource(environment) === "postgres" && Boolean(environment.PAC_RUNTIME_DATABASE_URL?.trim());
}

export async function loadResourceReleaseState(
  id: string,
  options: {
    scope?: StaffProgramScope;
    store?: Pick<PostgresResourceReleaseStore, "read">;
  } = {},
) {
  if (!options.store && !resourceReleaseAvailable()) return undefined;
  return (options.store ?? runtimeStore()).read(id, options.scope ?? staffProgramScope());
}

export async function listResourceReleaseQueue(
  options: {
    scope?: StaffProgramScope;
    store?: Pick<PostgresResourceReleaseStore, "list">;
  } = {},
) {
  if (!options.store && !resourceReleaseAvailable()) return [];
  return (options.store ?? runtimeStore()).list(options.scope ?? staffProgramScope());
}

export function resourceReleaseStore() {
  if (!resourceReleaseAvailable()) throw new Error("Resource review is not connected.");
  return runtimeStore();
}
