import "server-only";

import { cache } from "react";
import { z } from "zod";
import { leaseRuntimeSql } from "@/lib/db/runtime-client";
import {
  validatedEditableSurfaceDefaults,
  editableSurfaceReviewDimensions,
  EDITABLE_SURFACE_REVIEW_DIMENSIONS,
  EDITABLE_SURFACE_REVIEW_STATUSES,
  parseEditableSurfaceDocument,
  parseEditableSurfaceMutation,
  surfaceMayBeEditedInScope,
  surfaceMayBeReadInScope,
  type EditableSurfaceDefinition,
  type EditableSurfaceDocument,
  type EditableSurfaceMutation,
  type EditableSurfaceReviewDimension,
  type EditableSurfaceReviewStatus,
  type EditableSurfaceValues,
} from "./editable-surface-contract";
import {
  getEditableSurfaceDefinition,
} from "./staff-surface-registry";
import { CODE_APPROVED_SURFACE_IDS } from "./courses/definitions";
import {
  staffContentSource,
  staffProgramScope,
  type StaffContentSource,
  type StaffProgramScope,
} from "./staff-publications";

type Row = Record<string, unknown>;

type PublishedRow = {
  surface_id: string;
  revision_id: string;
  scope_id: StaffProgramScope;
  document: unknown;
  publication_decision_id: string | number;
  decided_at: Date | string;
};

type StateRow = { state: unknown };

export interface EditableSurfaceDatabase {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
  close(): Promise<void>;
}

export type EditableSurfaceDatabaseFactory = (configuration: {
  databaseUrl: string;
  ssl: false | "require";
}) => EditableSurfaceDatabase;

export type EditableSurfaceStoreOptions = {
  databaseUrl: string;
  sslMode?: string;
  databaseFactory?: EditableSurfaceDatabaseFactory;
};

export type PublishedEditableSurface = {
  source: StaffContentSource;
  surfaceId: string;
  requestedScope: StaffProgramScope;
  sourceScope: StaffProgramScope;
  revisionId: string | null;
  publicationDecisionId: string | null;
  decidedAt: string | null;
  isInherited: boolean;
  document: EditableSurfaceDocument;
  values: EditableSurfaceValues;
};

export type EditableSurfaceReview = {
  reviewId: string;
  dimension: EditableSurfaceReviewDimension;
  status: "pending" | EditableSurfaceReviewStatus;
  note: string | null;
  recordedAt: string;
};

export type EditableSurfaceDraft = {
  revisionId: string;
  revisionNumber: number;
  basedOnRevisionId: string | null;
  document: EditableSurfaceDocument;
  changeNote: string;
  createdAt: string;
  reviews: EditableSurfaceReview[];
  canPublish: boolean;
};

export type EditableSurfaceDecision = {
  publicationDecisionId: string;
  decision: "publish" | "withdraw" | "inherit";
  revisionId: string | null;
  reason: string;
  decidedAt: string;
};

export type EditableSurfaceHistoryEntry = {
  revisionId: string;
  revisionNumber: number;
  scope: StaffProgramScope;
  changeNote: string;
  createdAt: string;
  wasPublished: boolean;
  isEffective: boolean;
  isDraft: boolean;
  canRestore: boolean;
};

export type EditableSurfaceEditingState = {
  surfaceId: string;
  scope: StaffProgramScope;
  definition: EditableSurfaceDefinition;
  expectedRevisionId: string | null;
  effective: PublishedEditableSurface | null;
  draft: EditableSurfaceDraft | null;
  latestDecision: EditableSurfaceDecision | null;
  inheritedFrom: "one-dhs" | null;
  hasUnpublishedChanges: boolean;
  history: EditableSurfaceHistoryEntry[];
};

const READ_PUBLISHED = `/* pac-editable-surface:read-published */
  select surface_id, revision_id, scope_id, document,
    publication_decision_id, decided_at
  from pac.read_surface_publication($1, $2)`;

const READ_STATE = `/* pac-editable-surface:read-editing-state */
  select pac.read_surface_editing_state($1, $2) as state`;

const CREATE_DRAFT = `/* pac-editable-surface:create-draft */
  select pac.create_surface_draft($1, $2, $3::uuid, $4::jsonb, $5) as state`;

const SAVE_CHANGES = `/* pac-editable-surface:save-owner-approved-changes */
  select pac.save_owner_approved_surface($1, $2, $3::uuid, $4::bigint, $5::jsonb, $6) as state`;

const RECORD_REVIEW = `/* pac-editable-surface:record-review */
  select pac.record_surface_review($1, $2, $3::uuid, $4, $5, $6::uuid, $7) as state`;

const PUBLISH = `/* pac-editable-surface:publish */
  select pac.publish_surface_draft($1, $2, $3::uuid, $4::bigint, $5) as state`;

const WITHDRAW = `/* pac-editable-surface:withdraw */
  select pac.withdraw_surface_publication($1, $2, $3::uuid, $4::bigint, $5) as state`;

const RESUME_INHERITANCE = `/* pac-editable-surface:resume-inheritance */
  select pac.resume_surface_inheritance($1, $2, $3::bigint, $4) as state`;

const RESTORE = `/* pac-editable-surface:restore */
  select pac.restore_surface_revision($1, $2, $3::uuid, $4::bigint, $5) as state`;

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
}): EditableSurfaceDatabase {
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

function jsonValue(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new Error("Editable wording returned malformed data.");
  }
}

function isoDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) throw new Error("Editable wording returned an invalid date.");
  return date.toISOString();
}

function decisionId(value: string | number): string {
  const text = String(value);
  if (!/^\d+$/.test(text)) throw new Error("Editable wording returned an invalid publishing decision.");
  return text;
}

function parsePublishedRow(
  definition: EditableSurfaceDefinition,
  requestedScope: StaffProgramScope,
  row: PublishedRow,
): PublishedEditableSurface {
  if (row.surface_id !== definition.surfaceId) throw new Error("Editable wording returned a mismatched page area.");
  if (row.scope_id !== "one-dhs" && row.scope_id !== "dsd") {
    throw new Error("Editable wording returned a mismatched program scope.");
  }
  const document = parseEditableSurfaceDocument(definition, jsonValue(row.document));
  if (document.scope !== row.scope_id) throw new Error("Editable wording returned a mismatched document scope.");
  return {
    source: "postgres",
    surfaceId: definition.surfaceId,
    requestedScope,
    sourceScope: row.scope_id,
    revisionId: z.string().uuid().parse(row.revision_id),
    publicationDecisionId: decisionId(row.publication_decision_id),
    decidedAt: isoDate(row.decided_at),
    isInherited: requestedScope !== row.scope_id,
    document,
    values: document.values,
  };
}

const RawStateSchema = z.object({
  surfaceId: z.string(),
  scope: z.enum(["one-dhs", "dsd"]),
  expectedRevisionId: z.string().uuid().nullable(),
  effective: z.object({
    revisionId: z.string().uuid(),
    sourceScope: z.enum(["one-dhs", "dsd"]),
    publicationDecisionId: z.string().regex(/^\d+$/),
    decidedAt: z.string().min(1),
    document: z.unknown(),
  }).strict().nullable(),
  draft: z.object({
    revisionId: z.string().uuid(),
    revisionNumber: z.number().int().positive(),
    basedOnRevisionId: z.string().uuid().nullable(),
    document: z.unknown(),
    changeNote: z.string(),
    createdAt: z.string().min(1),
    reviews: z.array(z.object({
      reviewId: z.string().uuid(),
      dimension: z.enum(EDITABLE_SURFACE_REVIEW_DIMENSIONS),
      status: z.enum(["pending", ...EDITABLE_SURFACE_REVIEW_STATUSES]),
      note: z.string().nullable(),
      recordedAt: z.string().min(1),
    }).strict()),
    canPublish: z.boolean(),
  }).strict().nullable(),
  latestDecision: z.object({
    publicationDecisionId: z.string().regex(/^\d+$/),
    decision: z.enum(["publish", "withdraw", "inherit"]),
    revisionId: z.string().uuid().nullable(),
    reason: z.string(),
    decidedAt: z.string().min(1),
  }).strict().nullable(),
  inheritedFrom: z.literal("one-dhs").nullable(),
  hasUnpublishedChanges: z.boolean(),
  history: z.array(z.object({
    revisionId: z.string().uuid(),
    revisionNumber: z.number().int().positive(),
    scope: z.enum(["one-dhs", "dsd"]),
    changeNote: z.string(),
    createdAt: z.string().min(1),
    wasPublished: z.boolean(),
    isEffective: z.boolean(),
    isDraft: z.boolean(),
    canRestore: z.boolean(),
  }).strict()),
}).strict();

function parseEditingState(
  definition: EditableSurfaceDefinition,
  requestedScope: StaffProgramScope,
  value: unknown,
): EditableSurfaceEditingState {
  const parsed = RawStateSchema.parse(jsonValue(value));
  if (parsed.surfaceId !== definition.surfaceId || parsed.scope !== requestedScope) {
    throw new Error("Editable wording returned a mismatched page area.");
  }
  const effective = parsed.effective === null ? null : (() => {
    const document = parseEditableSurfaceDocument(definition, parsed.effective.document);
    if (document.scope !== parsed.effective.sourceScope) {
      throw new Error("Editable wording returned a mismatched document scope.");
    }
    return {
      source: "postgres" as const,
      surfaceId: definition.surfaceId,
      requestedScope,
      sourceScope: parsed.effective.sourceScope,
      revisionId: parsed.effective.revisionId,
      publicationDecisionId: parsed.effective.publicationDecisionId,
      decidedAt: isoDate(parsed.effective.decidedAt),
      isInherited: requestedScope !== parsed.effective.sourceScope,
      document,
      values: document.values,
    };
  })();
  const draft = parsed.draft === null ? null : {
    ...parsed.draft,
    createdAt: isoDate(parsed.draft.createdAt),
    document: parseEditableSurfaceDocument(definition, parsed.draft.document),
    reviews: parsed.draft.reviews.map((review) => ({ ...review, recordedAt: isoDate(review.recordedAt) })),
  };
  return {
    ...parsed,
    definition,
    effective,
    draft,
    latestDecision: parsed.latestDecision === null
      ? null
      : { ...parsed.latestDecision, decidedAt: isoDate(parsed.latestDecision.decidedAt) },
    history: parsed.history.map((entry) => ({ ...entry, createdAt: isoDate(entry.createdAt) })),
  };
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  return typeof (error as { code?: unknown }).code === "string" ? (error as { code: string }).code : undefined;
}

export class EditableSurfaceConflictError extends Error {
  constructor() {
    super("This wording changed after it was opened.");
    this.name = "EditableSurfaceConflictError";
  }
}

export class EditableSurfaceNotFoundError extends Error {
  constructor() {
    super("This page area is not available for editing.");
    this.name = "EditableSurfaceNotFoundError";
  }
}

export class EditableSurfaceValidationError extends Error {
  constructor() {
    super("The wording did not pass validation.");
    this.name = "EditableSurfaceValidationError";
  }
}

export class EditableSurfaceReviewRequiredError extends Error {
  constructor() {
    super("Required reviews are not complete.");
    this.name = "EditableSurfaceReviewRequiredError";
  }
}

export class EditableSurfaceStore {
  private readonly database: EditableSurfaceDatabase;

  constructor(options: EditableSurfaceStoreOptions) {
    this.database = (options.databaseFactory ?? defaultDatabaseFactory)({
      databaseUrl: options.databaseUrl,
      ssl: databaseSsl(options.databaseUrl, options.sslMode),
    });
  }

  async readPublished(
    surfaceId: string,
    scope: StaffProgramScope,
  ): Promise<PublishedEditableSurface | undefined> {
    const definition = getEditableSurfaceDefinition(surfaceId);
    if (!definition || !surfaceMayBeReadInScope(definition, scope)) return undefined;
    let rows: PublishedRow[];
    try {
      rows = await this.database.query<PublishedRow>(READ_PUBLISHED, [scope, surfaceId]);
    } catch (error) {
      // Newly registered optional areas may reach code before their database definition.
      // No default content is substituted; outages and permission failures still surface.
      if (error && typeof error === "object" && "code" in error && error.code === "P0002") return undefined;
      throw error;
    }
    if (rows.length > 1) {
      // A single surface's publication data should never take a whole page down for every
      // reader. Log it for repair and treat the surface as unavailable, the same way a
      // malformed staff publication is skipped rather than crashing the collection.
      console.error("editable_surface_ambiguous_publication", { surfaceId, scope, rowCount: rows.length });
      return undefined;
    }
    return rows[0] ? parsePublishedRow(definition, scope, rows[0]) : undefined;
  }

  async readPublishedMany(surfaceIds: string[], scope: StaffProgramScope): Promise<PublishedEditableSurface[]> {
    const definitions = new Map(surfaceIds.map(id => [id, getEditableSurfaceDefinition(id)]));
    const allowed = [...definitions].filter(([, definition]) => definition && surfaceMayBeReadInScope(definition, scope)).map(([id]) => id);
    if (!allowed.length) return [];
    let rows: PublishedRow[];
    try {
      rows = await this.database.query<PublishedRow>(
      `/* pac-editable-surface:read-published-many */
       select surface_id, revision_id, scope_id, document, publication_decision_id, decided_at
       from pac.read_surface_publications($1, $2::text[])`,
      [scope, allowed],
      );
    } catch (error) {
      // Before migration 0057 the batch function does not exist (42883), and an older
      // batch aborts on an unregistered area (P0002). Read one area at a time, in
      // order: a failed set-returning query must never share a connection with
      // in-flight reads, or its stray rows surface in the next result.
      const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
      if (code !== "42883" && code !== "P0002") throw error;
      const publications: PublishedEditableSurface[] = [];
      for (const id of allowed) {
        const publication = await this.readPublished(id, scope);
        if (publication) publications.push(publication);
      }
      return publications;
    }
    // Count rows per surface first so a duplicate is treated as an error for that surface
    // (matching readPublished, which treats an ambiguous publication as unavailable) instead
    // of the batch silently keeping whichever duplicate row happened to come first.
    const rowCounts = new Map<string, number>();
    for (const row of rows) rowCounts.set(row.surface_id, (rowCounts.get(row.surface_id) ?? 0) + 1);
    const reportedDuplicates = new Set<string>();
    return rows.flatMap(row => {
      const definition = definitions.get(row.surface_id);
      if (!definition || !allowed.includes(row.surface_id)) {
        // A stray row for an unregistered or disallowed surface should not take the whole
        // batch, and therefore every page reading it, down. Log it for repair and drop it.
        console.error("editable_surface_unexpected_publication_row", { surfaceId: row.surface_id, scope });
        return [];
      }
      if ((rowCounts.get(row.surface_id) ?? 0) > 1) {
        // A single surface's publication data should never take a whole page down for every
        // reader, and it must not resolve to an arbitrary one of its duplicate rows either.
        // Log it for repair once and treat the surface as unavailable, the same way
        // readPublished treats an ambiguous publication.
        if (!reportedDuplicates.has(row.surface_id)) {
          console.error("editable_surface_ambiguous_publication", { surfaceId: row.surface_id, scope, rowCount: rowCounts.get(row.surface_id) });
          reportedDuplicates.add(row.surface_id);
        }
        return [];
      }
      return [parsePublishedRow(definition, scope, row)];
    });
  }

  async readEditingState(
    surfaceId: string,
    scope: StaffProgramScope,
  ): Promise<EditableSurfaceEditingState | undefined> {
    const definition = getEditableSurfaceDefinition(surfaceId);
    if (!definition || !surfaceMayBeEditedInScope(definition, scope)) return undefined;
    const rows = await this.database.query<StateRow>(READ_STATE, [scope, surfaceId]);
    if (rows.length > 1) throw new Error("Editable wording returned more than one editing state.");
    return rows[0]?.state == null ? undefined : parseEditingState(definition, scope, rows[0].state);
  }

  async mutate(
    surfaceId: string,
    input: unknown,
  ): Promise<EditableSurfaceEditingState> {
    const definition = getEditableSurfaceDefinition(surfaceId);
    if (!definition) throw new EditableSurfaceNotFoundError();
    let action: EditableSurfaceMutation;
    try {
      action = parseEditableSurfaceMutation(definition, input);
    } catch {
      throw new EditableSurfaceValidationError();
    }

    try {
      let rows: StateRow[];
      if (action.action === "save_draft") {
        rows = await this.database.query<StateRow>(CREATE_DRAFT, [
          action.scope,
          surfaceId,
          action.expectedRevisionId,
          action.document,
          action.changeNote,
        ]);
      } else if (action.action === "save_changes") {
        rows = await this.database.query<StateRow>(SAVE_CHANGES, [
          action.scope,
          surfaceId,
          action.expectedRevisionId,
          action.expectedPublicationDecisionId,
          action.document,
          action.changeNote,
        ]);
      } else if (action.action === "record_review") {
        rows = await this.database.query<StateRow>(RECORD_REVIEW, [
          action.scope,
          surfaceId,
          action.revisionId,
          action.dimension,
          action.status,
          action.expectedReviewId,
          action.note,
        ]);
      } else if (action.action === "publish") {
        rows = await this.database.query<StateRow>(PUBLISH, [
          action.scope,
          surfaceId,
          action.revisionId,
          action.expectedPublicationDecisionId,
          action.reason,
        ]);
      } else if (action.action === "withdraw") {
        rows = await this.database.query<StateRow>(WITHDRAW, [
          action.scope,
          surfaceId,
          action.expectedPublishedRevisionId,
          action.expectedPublicationDecisionId,
          action.reason,
        ]);
      } else if (action.action === "resume_inheritance") {
        rows = await this.database.query<StateRow>(RESUME_INHERITANCE, [
          action.scope,
          surfaceId,
          action.expectedPublicationDecisionId,
          action.reason,
        ]);
      } else {
        rows = await this.database.query<StateRow>(RESTORE, [
          action.scope,
          surfaceId,
          action.targetRevisionId,
          action.expectedPublicationDecisionId,
          action.reason,
        ]);
      }
      if (rows.length !== 1 || rows[0].state == null) throw new EditableSurfaceNotFoundError();
      return parseEditingState(definition, action.scope, rows[0].state);
    } catch (error) {
      if (
        error instanceof EditableSurfaceConflictError ||
        error instanceof EditableSurfaceNotFoundError ||
        error instanceof EditableSurfaceValidationError ||
        error instanceof EditableSurfaceReviewRequiredError
      ) throw error;
      const code = errorCode(error);
      if (code === "40001" || code === "23505") throw new EditableSurfaceConflictError();
      if (code === "P0002" || code === "42501") throw new EditableSurfaceNotFoundError();
      if (["22000", "22023", "23502", "23503", "23514"].includes(code ?? "")) {
        throw new EditableSurfaceValidationError();
      }
      if (code === "55000") throw new EditableSurfaceReviewRequiredError();
      throw error;
    }
  }

  async close() {
    await this.database.close();
  }
}

let defaultStore: EditableSurfaceStore | null = null;
let defaultStoreKey = "";

function runtimeStore(): EditableSurfaceStore {
  const databaseUrl = process.env.PAC_RUNTIME_DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("PAC_RUNTIME_DATABASE_URL is required for editable wording stored in PostgreSQL.");
  const key = `${databaseUrl}\u0000${process.env.PAC_RUNTIME_DATABASE_SSL ?? ""}`;
  if (!defaultStore || defaultStoreKey !== key) {
    defaultStore = new EditableSurfaceStore({ databaseUrl, sslMode: process.env.PAC_RUNTIME_DATABASE_SSL });
    defaultStoreKey = key;
  }
  return defaultStore;
}

/** Memoized within one request: pages that read the same area twice run one query. */
const runtimeReadPublished = cache((surfaceId: string, scope: StaffProgramScope) =>
  runtimeStore().readPublished(surfaceId, scope));
const runtimeReadPublishedMany = cache((scope: StaffProgramScope, surfaceIdsJson: string) =>
  runtimeStore().readPublishedMany(JSON.parse(surfaceIdsJson) as string[], scope));

const staticPublications = new WeakMap<EditableSurfaceDefinition, Map<StaffProgramScope, PublishedEditableSurface>>();

function staticPublication(
  definition: EditableSurfaceDefinition,
  requestedScope: StaffProgramScope,
): PublishedEditableSurface | undefined {
  if (!surfaceMayBeReadInScope(definition, requestedScope)) return undefined;
  const cached = staticPublications.get(definition)?.get(requestedScope);
  if (cached) return cached;
  const sourceScope: StaffProgramScope = definition.scopePolicy === "dsd" ? "dsd" : "one-dhs";
  const document: EditableSurfaceDocument = {
    schemaVersion: 1,
    surfaceId: definition.surfaceId,
    scope: sourceScope,
    values: validatedEditableSurfaceDefaults(definition),
  };
  const publication: PublishedEditableSurface = {
    source: "static",
    surfaceId: definition.surfaceId,
    requestedScope,
    sourceScope,
    revisionId: null,
    publicationDecisionId: null,
    decidedAt: null,
    isInherited: requestedScope !== sourceScope,
    document,
    values: document.values,
  };
  const scopes = staticPublications.get(definition) ?? new Map();
  scopes.set(requestedScope, publication);
  staticPublications.set(definition, scopes);
  return publication;
}

/**
 * Registry defaults for one area, shaped like a prepared page surface, for use when the
 * database cannot be reached. Marked unavailable so callers can tell it apart from live content.
 */
export function fallbackEditableSurface(surfaceId: string, scope: StaffProgramScope = "one-dhs"): {
  definition: EditableSurfaceDefinition;
  scope: StaffProgramScope;
  values: EditableSurfaceValues;
  published: null;
  available: false;
  canEdit: false;
} {
  const definition = getEditableSurfaceDefinition(surfaceId);
  if (!definition) throw new Error(`Editable page area ${surfaceId} is not registered.`);
  const readingScope: StaffProgramScope = definition.scopePolicy === "dsd"
    ? "dsd"
    : definition.scopePolicy === "one-dhs"
      ? "one-dhs"
      : scope;
  return {
    definition,
    scope: readingScope,
    values: validatedEditableSurfaceDefaults(definition),
    published: null,
    available: false,
    canEdit: false,
  };
}

export function editableSurfaceSource(surfaceId: string, environment: NodeJS.ProcessEnv = process.env): StaffContentSource {
  const selected = environment.PAC_DATABASE_EDITABLE_SURFACES?.split(",").map((id) => id.trim()).filter(Boolean) ?? [];
  return selected.includes(surfaceId) ? "postgres" : staffContentSource(environment);
}

export function editableSurfaceEditingAvailable(environment: NodeJS.ProcessEnv = process.env, surfaceId?: string): boolean {
  const source = surfaceId ? editableSurfaceSource(surfaceId, environment) : staffContentSource(environment);
  return (source === "postgres" || (!surfaceId && Boolean(environment.PAC_DATABASE_EDITABLE_SURFACES?.trim())))
    && Boolean(environment.PAC_RUNTIME_DATABASE_URL?.trim());
}

export async function loadPublishedEditableSurface(
  surfaceId: string,
  options: {
    source?: StaffContentSource;
    scope?: StaffProgramScope;
    store?: Pick<EditableSurfaceStore, "readPublished">;
  } = {},
): Promise<PublishedEditableSurface | undefined> {
  const definition = getEditableSurfaceDefinition(surfaceId);
  if (!definition) return undefined;
  const source = options.source ?? editableSurfaceSource(surfaceId);
  const scope = options.scope ?? staffProgramScope();
  if (source === "static") return staticPublication(definition, scope);
  const published = await (options.store ? options.store.readPublished(surfaceId, scope) : runtimeReadPublished(surfaceId, scope));
  // Program-authored surfaces are approved in code; they serve until a database publication exists, which then takes precedence.
  return published ?? (CODE_APPROVED_SURFACE_IDS.has(surfaceId) ? staticPublication(definition, scope) : undefined);
}

/** Read the same current publications as pages, without one network round trip per area. */
export async function loadPublishedEditableSurfaces(surfaceIds: string[], scope: StaffProgramScope): Promise<PublishedEditableSurface[]> {
  const ids = [...new Set(surfaceIds)];
  const databaseIds = ids.filter(id => editableSurfaceSource(id) === "postgres");
  const staticIds = ids.filter(id => editableSurfaceSource(id) === "static");
  const staticRows = staticIds.flatMap(id => {
    const definition = getEditableSurfaceDefinition(id);
    const publication = definition && staticPublication(definition, scope);
    return publication ? [publication] : [];
  });
  const databaseRows = databaseIds.length ? await runtimeReadPublishedMany(scope, JSON.stringify(databaseIds)) : [];
  const published = new Set(databaseRows.map(row => row.surfaceId));
  const codeApprovedRows = databaseIds.filter(id => !published.has(id) && CODE_APPROVED_SURFACE_IDS.has(id)).flatMap(id => {
    const definition = getEditableSurfaceDefinition(id);
    const publication = definition && staticPublication(definition, scope);
    return publication ? [publication] : [];
  });
  return [...staticRows, ...databaseRows, ...codeApprovedRows];
}

export async function loadEditableSurfaceEditingState(
  surfaceId: string,
  options: {
    scope?: StaffProgramScope;
    store?: Pick<EditableSurfaceStore, "readEditingState">;
  } = {},
): Promise<EditableSurfaceEditingState | undefined> {
  if (!options.store && !editableSurfaceEditingAvailable(process.env, surfaceId)) return undefined;
  return (options.store ?? runtimeStore()).readEditingState(surfaceId, options.scope ?? staffProgramScope());
}

export async function applyEditableSurfaceMutation(
  surfaceId: string,
  action: unknown,
  options: { store?: Pick<EditableSurfaceStore, "mutate"> } = {},
): Promise<EditableSurfaceEditingState> {
  if (!options.store && !editableSurfaceEditingAvailable(process.env, surfaceId)) throw new Error("Editable wording is not connected.");
  return (options.store ?? runtimeStore()).mutate(surfaceId, action);
}

export function requiredEditableSurfaceReviews(definition: EditableSurfaceDefinition): readonly EditableSurfaceReviewDimension[] {
  return editableSurfaceReviewDimensions(definition);
}
