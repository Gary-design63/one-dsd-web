import "server-only";

import { leaseRuntimeSql } from "@/lib/db/runtime-client";
import {
  EditableResourceFieldsSchema,
  type EditableResourceState,
  type ResourceDraftRequest,
} from "./resource-editor-contract";
import {
  staffContentSource,
  staffProgramScope,
  type StaffProgramScope,
} from "./staff-publications";

type Row = Record<string, unknown>;

type EditableResourceRow = {
  content_item_id: string;
  published_revision_id: string | null;
  base_revision_id: string;
  editable_fields: unknown;
  has_unpublished_changes: boolean;
};

export interface ResourceDraftDatabase {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
  close(): Promise<void>;
}

export type ResourceDraftDatabaseFactory = (configuration: {
  databaseUrl: string;
  ssl: false | "require";
}) => ResourceDraftDatabase;

export type PostgresResourceDraftStoreOptions = {
  databaseUrl: string;
  sslMode?: string;
  databaseFactory?: ResourceDraftDatabaseFactory;
};

const READ_EDITABLE_RESOURCE = `/* pac-content:read-editable-resource */
  select content_item_id, published_revision_id, base_revision_id,
    editable_fields, has_unpublished_changes
  from pac.read_resource_editing_state($1, $2)`;

const SAVE_RESOURCE_DRAFT = `/* pac-content:save-resource-draft */
  select content_item_id, published_revision_id, base_revision_id,
    editable_fields, has_unpublished_changes
  from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)`;

export class ResourceDraftConflictError extends Error {
  constructor() {
    super("This resource changed after it was opened.");
    this.name = "ResourceDraftConflictError";
  }
}

export class ResourceDraftNotFoundError extends Error {
  constructor() {
    super("This resource is not available for editing.");
    this.name = "ResourceDraftNotFoundError";
  }
}

export class ResourceDraftValidationError extends Error {
  constructor() {
    super("The draft could not be saved with the information provided.");
    this.name = "ResourceDraftValidationError";
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
}): ResourceDraftDatabase {
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

function parseFields(value: unknown) {
  let candidate = value;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate) as unknown;
    } catch {
      throw new Error("The editable resource has malformed content.");
    }
  }
  return EditableResourceFieldsSchema.parse(candidate);
}

function parseRow(row: EditableResourceRow): EditableResourceState {
  return {
    contentItemId: row.content_item_id,
    expectedRevisionId: row.base_revision_id,
    publishedRevisionId: row.published_revision_id,
    hasUnpublishedChanges: row.has_unpublished_changes,
    fields: parseFields(row.editable_fields),
  };
}

function databaseErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

export class PostgresResourceDraftStore {
  private readonly database: ResourceDraftDatabase;

  constructor(options: PostgresResourceDraftStoreOptions) {
    const configuration = {
      databaseUrl: options.databaseUrl,
      ssl: databaseSsl(options.databaseUrl, options.sslMode),
    };
    this.database = (options.databaseFactory ?? defaultDatabaseFactory)(configuration);
  }

  async read(id: string, scope: StaffProgramScope): Promise<EditableResourceState | undefined> {
    const rows = await this.database.query<EditableResourceRow>(READ_EDITABLE_RESOURCE, [scope, id]);
    if (rows.length > 1) throw new Error(`Editable resource ${id} returned more than one current draft.`);
    return rows[0] ? parseRow(rows[0]) : undefined;
  }

  async save(
    id: string,
    scope: StaffProgramScope,
    input: ResourceDraftRequest,
  ): Promise<EditableResourceState> {
    const expectedContentScope = scope === "one-dhs" ? "agencywide" : "dsd";
    if (input.fields.scope !== expectedContentScope) {
      throw new ResourceDraftValidationError();
    }

    try {
      const rows = await this.database.query<EditableResourceRow>(SAVE_RESOURCE_DRAFT, [
        scope,
        id,
        input.expectedRevisionId,
        input.fields,
        input.changeNote,
      ]);
      if (rows.length !== 1) throw new ResourceDraftNotFoundError();
      return parseRow(rows[0]);
    } catch (error) {
      if (
        error instanceof ResourceDraftConflictError ||
        error instanceof ResourceDraftNotFoundError ||
        error instanceof ResourceDraftValidationError
      ) {
        throw error;
      }
      const code = databaseErrorCode(error);
      if (code === "40001" || code === "23505") throw new ResourceDraftConflictError();
      if (code === "P0002") throw new ResourceDraftNotFoundError();
      if (code === "22000" || code === "22023") throw new ResourceDraftValidationError();
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.database.close();
  }
}

let defaultStore: PostgresResourceDraftStore | null = null;
let defaultStoreKey = "";

function runtimeStore(): PostgresResourceDraftStore {
  const databaseUrl = process.env.PAC_RUNTIME_DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("PAC_RUNTIME_DATABASE_URL is required for resource editing.");
  }
  const key = `${databaseUrl}\u0000${process.env.PAC_RUNTIME_DATABASE_SSL ?? ""}`;
  if (!defaultStore || defaultStoreKey !== key) {
    defaultStore = new PostgresResourceDraftStore({
      databaseUrl,
      sslMode: process.env.PAC_RUNTIME_DATABASE_SSL,
    });
    defaultStoreKey = key;
  }
  return defaultStore;
}

export function resourceEditingAvailable(environment: NodeJS.ProcessEnv = process.env): boolean {
  return staffContentSource(environment) === "postgres" && Boolean(environment.PAC_RUNTIME_DATABASE_URL?.trim());
}

export async function loadEditableResourceState(
  id: string,
  options: {
    scope?: StaffProgramScope;
    store?: Pick<PostgresResourceDraftStore, "read">;
  } = {},
): Promise<EditableResourceState | undefined> {
  if (!options.store && !resourceEditingAvailable()) return undefined;
  return (options.store ?? runtimeStore()).read(id, options.scope ?? staffProgramScope());
}

export async function saveResourceDraft(
  id: string,
  input: ResourceDraftRequest,
  options: {
    scope?: StaffProgramScope;
    store?: Pick<PostgresResourceDraftStore, "save">;
  } = {},
): Promise<EditableResourceState> {
  if (!options.store && !resourceEditingAvailable()) {
    throw new Error("Resource editing is not connected.");
  }
  return (options.store ?? runtimeStore()).save(id, options.scope ?? staffProgramScope(), input);
}
