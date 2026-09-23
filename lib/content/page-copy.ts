import "server-only";

import { cache } from "react";
import { z } from "zod";
import { leaseRuntimeSql } from "@/lib/db/runtime-client";
import {
  FooterCopySchema,
  HomePageCopySchema,
  PAGE_BLOCK_IDS,
  PAGE_BLOCK_SURFACES,
  PAGE_REVIEW_DIMENSIONS,
  PAGE_REVIEW_STATUSES,
  PageBlockPayloadSchema,
  type FooterCopy,
  type HomePageCopy,
  type PageBlockCopy,
  type PageBlockEditingState,
  type PageBlockPayload,
  type PageBlockSurface,
  type PageCopyAction,
  staticPageCopy,
} from "./page-copy-contract";
import {
  staffContentSource,
  staffProgramScope,
  type StaffContentSource,
  type StaffProgramScope,
} from "./staff-publications";

type Row = Record<string, unknown>;

type PublishedRow = {
  content_item_id: string;
  revision_id: string;
  canonical_payload: unknown;
};

type StateRow = { state: unknown };

export interface PageCopyDatabase {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
  close(): Promise<void>;
}

export type PageCopyDatabaseFactory = (configuration: {
  databaseUrl: string;
  ssl: false | "require";
}) => PageCopyDatabase;

export type PageCopyStoreOptions = {
  databaseUrl: string;
  sslMode?: string;
  databaseFactory?: PageCopyDatabaseFactory;
};

export type PageCopyLoadOptions = {
  source?: StaffContentSource;
  scope?: StaffProgramScope;
  store?: Pick<PageCopyStore, "readPublished">;
};

const READ_PUBLISHED = `/* pac-page-copy:read-published */
  select content_item_id, revision_id, canonical_payload
  from pac.read_page_block_publication($1, $2)`;

const READ_STATE = `/* pac-page-copy:read-editing-state */
  select pac.read_page_block_editing_state($1, $2) as state`;

const SAVE_CHANGES = "/* pac-page-copy:save-owner-approved */ select pac.save_owner_approved_page_block($1, $2, $3::uuid, $4::bigint, $5::jsonb, $6) as state";

const CREATE_DRAFT = `/* pac-page-copy:create-draft */
  select pac.create_page_block_draft($1, $2, $3::uuid, $4::jsonb, $5) as state`;

const RECORD_REVIEW = `/* pac-page-copy:record-review */
  select pac.record_page_block_review($1, $2, $3::uuid, $4, $5, $6::uuid, $7) as state`;

const PUBLISH = `/* pac-page-copy:publish */
  select pac.publish_page_block_draft($1, $2, $3::uuid, $4::bigint, $5) as state`;

const WITHDRAW = `/* pac-page-copy:withdraw */
  select pac.withdraw_page_block_publication($1, $2, $3::uuid, $4::bigint, $5) as state`;

const ROLLBACK = `/* pac-page-copy:rollback */
  select pac.rollback_page_block_publication($1, $2, $3::uuid, $4::uuid, $5::bigint, $6) as state`;

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
}): PageCopyDatabase {
  const { sql: client, release } = leaseRuntimeSql(configuration);
  return {
    async query<T extends Row>(statement: string, parameters: readonly unknown[] = []): Promise<T[]> {
      const result = await client.unsafe<T[]>(statement, parameters as never[]);
      return Array.from(result);
    },
    async close() {
      await release();
    },
  };
}

const EditingStateBaseSchema = z
  .object({
    surface: z.enum(PAGE_BLOCK_SURFACES),
    contentItemId: z.enum([PAGE_BLOCK_IDS.home, PAGE_BLOCK_IDS.footer]),
    expectedRevisionId: z.string().uuid(),
    publishedRevisionId: z.string().uuid().nullable(),
    publicationDecisionId: z.string().regex(/^\d+$/).nullable(),
    isPublished: z.boolean(),
    hasUnpublishedChanges: z.boolean(),
    copy: z.unknown(),
    reviews: z.array(
      z.object({
        reviewId: z.string().uuid().nullable(),
        dimension: z.enum(PAGE_REVIEW_DIMENSIONS),
        status: z.enum(["pending", ...PAGE_REVIEW_STATUSES]),
        note: z.string().nullable(),
      }).strict(),
    ),
    canPublish: z.boolean(),
    history: z.array(
      z.object({
        revisionId: z.string().uuid(),
        label: z.string().min(1),
        publishedAt: z.string().min(1),
        isCurrent: z.boolean(),
      }).strict(),
    ),
  })
  .strict();

function jsonValue(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new Error("Page wording returned malformed data.");
  }
}

function parsePublished(surface: PageBlockSurface, row: PublishedRow): PageBlockPayload {
  if (row.content_item_id !== PAGE_BLOCK_IDS[surface]) {
    throw new Error("Page wording returned a mismatched identifier.");
  }
  const payload = PageBlockPayloadSchema.parse(jsonValue(row.canonical_payload));
  if (payload.blockType !== surface || payload.status !== "approved") {
    throw new Error("Published page wording is not an approved version of this page block.");
  }
  return payload;
}

function parseEditingState<TSurface extends PageBlockSurface>(
  surface: TSurface,
  value: unknown,
): PageBlockEditingState<TSurface extends "home" ? HomePageCopy : FooterCopy> {
  const parsed = EditingStateBaseSchema.parse(jsonValue(value));
  if (parsed.surface !== surface || parsed.contentItemId !== PAGE_BLOCK_IDS[surface]) {
    throw new Error("Page editing state returned a mismatched block.");
  }
  const copy = surface === "home"
    ? HomePageCopySchema.parse(parsed.copy)
    : FooterCopySchema.parse(parsed.copy);
  return { ...parsed, copy } as PageBlockEditingState<TSurface extends "home" ? HomePageCopy : FooterCopy>;
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  return typeof (error as { code?: unknown }).code === "string"
    ? (error as { code: string }).code
    : undefined;
}

export class PageCopyConflictError extends Error {
  constructor() {
    super("This page wording changed after it was opened.");
    this.name = "PageCopyConflictError";
  }
}

export class PageCopyNotFoundError extends Error {
  constructor() {
    super("This page wording is not available.");
    this.name = "PageCopyNotFoundError";
  }
}

export class PageCopyValidationError extends Error {
  constructor() {
    super("The page wording did not pass validation.");
    this.name = "PageCopyValidationError";
  }
}

export class PageCopyReviewRequiredError extends Error {
  constructor() {
    super("Required reviews are not complete.");
    this.name = "PageCopyReviewRequiredError";
  }
}

export class PageCopyStore {
  private readonly database: PageCopyDatabase;

  constructor(options: PageCopyStoreOptions) {
    this.database = (options.databaseFactory ?? defaultDatabaseFactory)({
      databaseUrl: options.databaseUrl,
      ssl: databaseSsl(options.databaseUrl, options.sslMode),
    });
  }

  async readPublished<TSurface extends PageBlockSurface>(
    surface: TSurface,
    scope: StaffProgramScope,
  ): Promise<(TSurface extends "home" ? HomePageCopy : FooterCopy) | undefined> {
    const rows = await this.database.query<PublishedRow>(READ_PUBLISHED, [scope, PAGE_BLOCK_IDS[surface]]);
    if (rows.length > 1) throw new Error("Page wording returned more than one published version.");
    if (!rows[0]) return undefined;
    return parsePublished(surface, rows[0]).copy as TSurface extends "home" ? HomePageCopy : FooterCopy;
  }

  async readEditingState<TSurface extends PageBlockSurface>(
    surface: TSurface,
    scope: StaffProgramScope,
  ): Promise<PageBlockEditingState<TSurface extends "home" ? HomePageCopy : FooterCopy> | undefined> {
    const rows = await this.database.query<StateRow>(READ_STATE, [scope, PAGE_BLOCK_IDS[surface]]);
    if (rows.length > 1) throw new Error("Page wording returned more than one editing state.");
    return rows[0]?.state == null ? undefined : parseEditingState(surface, rows[0].state);
  }

  async mutate<TSurface extends PageBlockSurface>(
    surface: TSurface,
    scope: StaffProgramScope,
    action: PageCopyAction,
  ): Promise<PageBlockEditingState<TSurface extends "home" ? HomePageCopy : FooterCopy>> {
    try {
      let rows: StateRow[];
      if (action.action === "save_changes") {
        const copy = (surface === "home" ? HomePageCopySchema : FooterCopySchema).parse(action.copy);
        rows = await this.database.query<StateRow>(SAVE_CHANGES, [
          scope, PAGE_BLOCK_IDS[surface], action.expectedRevisionId,
          action.expectedPublicationDecisionId, copy, action.changeNote,
        ]);
      } else if (action.action === "save_draft") {
        const copy = (surface === "home" ? HomePageCopySchema : FooterCopySchema).parse(action.copy);
        rows = await this.database.query<StateRow>(CREATE_DRAFT, [
          scope,
          PAGE_BLOCK_IDS[surface],
          action.expectedRevisionId,
          copy,
          action.changeNote,
        ]);
      } else if (action.action === "record_review") {
        rows = await this.database.query<StateRow>(RECORD_REVIEW, [
          scope,
          PAGE_BLOCK_IDS[surface],
          action.revisionId,
          action.dimension,
          action.status,
          action.expectedReviewId,
          action.note,
        ]);
      } else if (action.action === "publish") {
        rows = await this.database.query<StateRow>(PUBLISH, [
          scope,
          PAGE_BLOCK_IDS[surface],
          action.revisionId,
          action.expectedPublicationDecisionId,
          action.reason,
        ]);
      } else if (action.action === "withdraw") {
        rows = await this.database.query<StateRow>(WITHDRAW, [
          scope,
          PAGE_BLOCK_IDS[surface],
          action.expectedPublishedRevisionId,
          action.expectedPublicationDecisionId,
          action.reason,
        ]);
      } else {
        rows = await this.database.query<StateRow>(ROLLBACK, [
          scope,
          PAGE_BLOCK_IDS[surface],
          action.expectedPublishedRevisionId,
          action.targetRevisionId,
          action.expectedPublicationDecisionId,
          action.reason,
        ]);
      }
      if (rows.length !== 1 || rows[0].state == null) throw new PageCopyNotFoundError();
      return parseEditingState(surface, rows[0].state);
    } catch (error) {
      if (
        error instanceof PageCopyConflictError ||
        error instanceof PageCopyNotFoundError ||
        error instanceof PageCopyValidationError ||
        error instanceof PageCopyReviewRequiredError
      ) throw error;
      const code = errorCode(error);
      if (code === "40001" || code === "23505") throw new PageCopyConflictError();
      if (code === "P0002" || code === "42501") throw new PageCopyNotFoundError();
      if (code === "22000" || code === "22023") throw new PageCopyValidationError();
      if (code === "55000") throw new PageCopyReviewRequiredError();
      throw error;
    }
  }

  async close() {
    await this.database.close();
  }
}

let defaultStore: PageCopyStore | null = null;
let defaultStoreKey = "";

function runtimeStore(): PageCopyStore {
  const databaseUrl = process.env.PAC_RUNTIME_DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("PAC_RUNTIME_DATABASE_URL is required for page wording stored in PostgreSQL.");
  const key = `${databaseUrl}\u0000${process.env.PAC_RUNTIME_DATABASE_SSL ?? ""}`;
  if (!defaultStore || defaultStoreKey !== key) {
    defaultStore = new PageCopyStore({ databaseUrl, sslMode: process.env.PAC_RUNTIME_DATABASE_SSL });
    defaultStoreKey = key;
  }
  return defaultStore;
}

/** Memoized within one request: the page and its footer read each block once per render. */
const runtimeReadPublished = cache((surface: PageBlockSurface, scope: StaffProgramScope) =>
  runtimeStore().readPublished(surface, scope));

export function pageCopyEditingAvailable(environment: NodeJS.ProcessEnv = process.env): boolean {
  return staffContentSource(environment) === "postgres" && Boolean(environment.PAC_RUNTIME_DATABASE_URL?.trim());
}

export async function loadPublishedPageCopy(surface: "home", options?: PageCopyLoadOptions): Promise<HomePageCopy | undefined>;
export async function loadPublishedPageCopy(surface: "footer", options?: PageCopyLoadOptions): Promise<FooterCopy | undefined>;
export async function loadPublishedPageCopy(
  surface: PageBlockSurface,
  options: PageCopyLoadOptions = {},
): Promise<PageBlockCopy | undefined> {
  const source = options.source ?? staffContentSource();
  if (source === "static") return staticPageCopy(surface as "home") as PageBlockCopy;
  const scope = options.scope ?? staffProgramScope();
  return options.store ? options.store.readPublished(surface, scope) : runtimeReadPublished(surface, scope);
}

export async function loadPageBlockEditingState<TSurface extends PageBlockSurface>(
  surface: TSurface,
  options: {
    scope?: StaffProgramScope;
    store?: Pick<PageCopyStore, "readEditingState">;
  } = {},
): Promise<PageBlockEditingState<TSurface extends "home" ? HomePageCopy : FooterCopy> | undefined> {
  if (!options.store && !pageCopyEditingAvailable()) return undefined;
  return (options.store ?? runtimeStore()).readEditingState(surface, options.scope ?? staffProgramScope());
}

export async function applyPageCopyAction<TSurface extends PageBlockSurface>(
  surface: TSurface,
  action: PageCopyAction,
  options: {
    scope?: StaffProgramScope;
    store?: Pick<PageCopyStore, "mutate">;
  } = {},
): Promise<PageBlockEditingState<TSurface extends "home" ? HomePageCopy : FooterCopy>> {
  if (!options.store && !pageCopyEditingAvailable()) throw new Error("Page wording editing is not connected.");
  return (options.store ?? runtimeStore()).mutate(surface, options.scope ?? staffProgramScope(), action);
}
