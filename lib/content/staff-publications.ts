import { rememberContentEvidence } from "./ask-evidence";
import "server-only";

import { cache } from "react";
import { z } from "zod";
import { leaseRuntimeSql } from "@/lib/db/runtime-client";
import { staffCorpus } from "./staff-corpus";
import { staffReleaseValidationIssues } from "./resource-release-contract";
import { hasFormattedOrSerializedText } from "./resource-editor-contract";
import { lintStaffCopy } from "@/lib/brand/lint";
import type { ContentItem } from "./types";
import { canonicalStaffHref } from "@/lib/product/routes";

export type StaffProgramScope = "one-dhs" | "dsd";
export type StaffContentSource = "static" | "postgres";

type PublicationRow = {
  content_item_id: string;
  revision_id: string;
  scope_id: string;
  canonical_payload: unknown;
  payload_sha256: string;
  decided_at: Date | string;
};

type Row = Record<string, unknown>;

export interface StaffPublicationDatabase {
  query<T extends Row = Row>(statement: string, parameters?: readonly unknown[]): Promise<T[]>;
  close(): Promise<void>;
}

export type StaffPublicationDatabaseFactory = (configuration: {
  databaseUrl: string;
  ssl: false | "require";
}) => StaffPublicationDatabase;

export type PostgresStaffPublicationReaderOptions = {
  databaseUrl: string;
  sslMode?: string;
  databaseFactory?: StaffPublicationDatabaseFactory;
};

export type StaffContentSnapshot = {
  source: StaffContentSource;
  requestedScope: StaffProgramScope;
  items: ContentItem[];
};

export type StaffContentLoadOptions = {
  source?: StaffContentSource;
  scope?: StaffProgramScope;
  postgresReader?: Pick<PostgresStaffPublicationReader, "list" | "get">;
};

const StaffContentSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    type: z.enum([
      "policy",
      "job_aid",
      "tool",
      "checklist",
      "practice_note",
      "learning_module",
      "scenario",
      "question_bank",
      "external_reference",
    ]),
    authority: z.enum([
      "official",
      "guidance",
      "practice_note",
      "learning",
      "community_brief",
      "partner_informed",
      "local",
      "under_review",
      "external_verify",
    ]),
    layer: z.enum(["L1", "L2", "L3", "L4"]),
    summary: z.string(),
    whyItMatters: z.string().optional(),
    body: z.array(z.string()),
    nextActions: z.array(z.object({ label: z.string(), href: z.string() })),
    tags: z.array(z.string()),
    intents: z.array(
      z.enum([
        "policy_orientation",
        "practice_method",
        "launch_embed",
        "access_barriers",
        "workplace_culture",
        "intercultural",
        "uncertainty_authority",
        "escalation",
        "next_actions",
        "facilitation",
        "boundary_refusal",
      ]),
    ),
    pathIds: z.array(z.string()).optional(),
    owner: z.string().min(1),
    reviewDate: z.string(),
    status: z.literal("approved"),
    scope: z.enum(["agencywide", "dsd"]),
    accessibility: z.enum(["reviewed", "pending"]),
    href: z.string().optional(),
    sourceName: z.string().optional(),
    provenance: z.string().optional(),
    version: z.string(),
  });
// Not strict: imported publications may carry extra bookkeeping keys such as canonicalOriginal. Unknown keys are dropped, never served.

const READ_PUBLICATIONS = `/* pac-content:read-current-staff-publications */
  select content_item_id, revision_id, scope_id, canonical_payload,
    payload_sha256, decided_at
  from pac.read_staff_publications($1, $2)`;

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
}): StaffPublicationDatabase {
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

function canonicalizeStaffRoutes(item: ContentItem): ContentItem {
  return {
    ...item,
    nextActions: item.nextActions.map((action) => ({
      ...action,
      href: canonicalStaffHref(action.href),
    })),
  };
}

const notedPresentationIssues = new Map<string, "withheld" | "served">();
/** Content-free operational note: which published item needs repair, never what it says. */
function notePresentationIssue(contentItemId: string, scope: string, outcome: "withheld" | "served", issues: string[]): void {
  const key = `${scope}:${contentItemId}`;
  if (notedPresentationIssues.has(key)) return;
  notedPresentationIssues.set(key, outcome);
  console.warn(`[staff-publications] published item ${contentItemId} (${scope}) does not meet the current presentation rules and was ${outcome}: ${issues.join(" ")}`);
}
/** Published items that were withheld or served with a repair note, for repair reporting. */
export function publishedItemsNeedingRepair(): Array<{ key: string; outcome: "withheld" | "served" }> {
  return [...notedPresentationIssues].map(([key, outcome]) => ({ key, outcome })).sort((a, b) => a.key.localeCompare(b.key));
}

const SAFE_ACTION_LINK = /^\/(?!\/)[^\u0000-\u001f\u007f]*$|^https:\/\/[^\s]+$/i;
const INTERNAL_PATH = /^\/(?!\/)[^\u0000-\u001f\u007f\s]*$/;

/**
 * Presentation rules on an already published item. Formatting, pasted data, brand or internal
 * wording, and unsafe links are withheld one item at a time, so one bad row never takes down a
 * page for staff. Field-level rules from the release editor (an empty review date, a program
 * address in the source field, a long body part) do not hide approved content: the item is
 * served with a light repair and noted for follow-up.
 */
function presentationOutcome(payload: z.infer<typeof StaffContentSchema>, row: PublicationRow): { item: z.infer<typeof StaffContentSchema> | null; issues: string[] } {
  const issues = staffReleaseValidationIssues(payload as never);
  if (issues.length === 0) return { item: payload, issues };
  const staffText = [payload.title, payload.summary, payload.whyItMatters ?? "", ...payload.body, ...payload.nextActions.map((action) => action.label), ...payload.tags, payload.owner, payload.sourceName ?? ""];
  const unsafe = staffText.some(hasFormattedOrSerializedText)
    || lintStaffCopy(staffText.join("\n")).length > 0
    || payload.nextActions.some((action) => !SAFE_ACTION_LINK.test(action.href))
    || (payload.href != null && payload.href !== "" && !/^https:\/\/[^\s]+$/i.test(payload.href) && !INTERNAL_PATH.test(payload.href));
  if (unsafe) return { item: null, issues };
  const decidedDay = typeof row.decided_at === "string" ? row.decided_at.slice(0, 10) : new Date(row.decided_at as Date).toISOString().slice(0, 10);
  return {
    item: {
      ...payload,
      reviewDate: /^\d{4}-\d{2}-\d{2}$/.test(payload.reviewDate) ? payload.reviewDate : decidedDay,
      href: payload.href && /^https:\/\/[^\s]+$/i.test(payload.href) ? payload.href : undefined,
    },
    issues,
  };
}

function parsePayload(row: PublicationRow): ContentItem | null {
  let candidate = row.canonical_payload;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate) as unknown;
    } catch {
      throw new Error(`Published content ${row.content_item_id} has malformed JSON.`);
    }
  }

  const parsed = StaffContentSchema.safeParse(candidate);
  if (!parsed.success) {
    notePresentationIssue(row.content_item_id, row.scope_id, "withheld", ["The item does not match the staff content contract."]);
    return null;
  }
  const outcome = presentationOutcome(parsed.data, row);
  if (outcome.issues.length > 0) notePresentationIssue(row.content_item_id, row.scope_id, outcome.item ? "served" : "withheld", outcome.issues);
  if (!outcome.item) return null;
  parsed.data = outcome.item;
  if (parsed.data.id !== row.content_item_id) {
    throw new Error(`Published content ${row.content_item_id} has a mismatched canonical identifier.`);
  }
  const expectedPayloadScope = row.scope_id === "one-dhs" ? "agencywide" : row.scope_id === "dsd" ? "dsd" : null;
  if (!expectedPayloadScope || parsed.data.scope !== expectedPayloadScope) {
    throw new Error(`Published content ${row.content_item_id} has a mismatched publication scope.`);
  }
  const item = canonicalizeStaffRoutes(parsed.data);
  rememberContentEvidence(item, { sourceId: row.content_item_id, revisionId: row.revision_id, payloadHash: row.payload_sha256, scope: row.scope_id });
  return item;
}

function parseStaticPayload(item: ContentItem): ContentItem {
  const parsed = StaffContentSchema.safeParse(item);
  if (!parsed.success) {
    throw new Error(`Published content ${item.id} does not match the staff content contract.`);
  }
  if (staffReleaseValidationIssues(parsed.data).length > 0) {
    throw new Error(`Published content ${item.id} did not pass the staff presentation contract.`);
  }
  return canonicalizeStaffRoutes(parsed.data);
}

export function contentVisibleInScope(item: Pick<ContentItem, "scope">, requestedScope: StaffProgramScope): boolean {
  return item.scope === "agencywide" || (requestedScope === "dsd" && item.scope === "dsd");
}

export function staffContentSource(environment: NodeJS.ProcessEnv = process.env): StaffContentSource {
  const configured = environment.PAC_CONTENT_SOURCE?.trim().toLowerCase();
  if (!configured) return "static";
  if (configured === "static" || configured === "postgres") return configured;
  throw new Error("PAC_CONTENT_SOURCE must be static or postgres.");
}

export function staffProgramScope(environment: NodeJS.ProcessEnv = process.env): StaffProgramScope {
  const configured = environment.PAC_STAFF_SCOPE?.trim().toLowerCase();
  if (!configured || configured === "one-dhs") return "one-dhs";
  if (configured === "dsd") return "dsd";
  throw new Error("PAC_STAFF_SCOPE must be one-dhs or dsd.");
}

export class PostgresStaffPublicationReader {
  private readonly database: StaffPublicationDatabase;

  constructor(options: PostgresStaffPublicationReaderOptions) {
    const configuration = {
      databaseUrl: options.databaseUrl,
      ssl: databaseSsl(options.databaseUrl, options.sslMode),
    };
    this.database = (options.databaseFactory ?? defaultDatabaseFactory)(configuration);
  }

  async list(scope: StaffProgramScope): Promise<ContentItem[]> {
    const rows = await this.database.query<PublicationRow>(READ_PUBLICATIONS, [scope, null]);
    return rows.map(parsePayload).filter((item): item is ContentItem => item !== null);
  }

  async get(id: string, scope: StaffProgramScope): Promise<ContentItem | undefined> {
    const rows = await this.database.query<PublicationRow>(READ_PUBLICATIONS, [scope, id]);
    if (rows.length > 1) throw new Error(`Published content ${id} returned more than one current revision.`);
    return rows[0] ? parsePayload(rows[0]) ?? undefined : undefined;
  }

  async close(): Promise<void> {
    await this.database.close();
  }
}

let defaultReader: PostgresStaffPublicationReader | null = null;
let defaultReaderKey = "";

function runtimeReader(): PostgresStaffPublicationReader {
  const databaseUrl = process.env.PAC_RUNTIME_DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("PAC_RUNTIME_DATABASE_URL is required when PAC_CONTENT_SOURCE=postgres.");
  }
  const key = `${databaseUrl}\u0000${process.env.PAC_RUNTIME_DATABASE_SSL ?? ""}`;
  if (!defaultReader || defaultReaderKey !== key) {
    defaultReader = new PostgresStaffPublicationReader({
      databaseUrl,
      sslMode: process.env.PAC_RUNTIME_DATABASE_SSL,
    });
    defaultReaderKey = key;
  }
  return defaultReader;
}

/**
 * Memoized within one request: a page that loads the collection twice parses the
 * static corpus or queries the database once. Callers receive their own array.
 */
const staticItems = cache((requestedScope: StaffProgramScope): ContentItem[] =>
  staffCorpus()
    .filter((item) => contentVisibleInScope(item, requestedScope))
    .map(parseStaticPayload));
const staticItem = cache((id: string, requestedScope: StaffProgramScope): ContentItem | undefined => {
  const item = staffCorpus().find((candidate) => candidate.id === id && contentVisibleInScope(candidate, requestedScope));
  return item ? parseStaticPayload(item) : undefined;
});
const runtimeList = cache((requestedScope: StaffProgramScope) => runtimeReader().list(requestedScope));
const runtimeGet = cache((id: string, requestedScope: StaffProgramScope) => runtimeReader().get(id, requestedScope));

export async function loadStaffContentSnapshot(options: StaffContentLoadOptions = {}): Promise<StaffContentSnapshot> {
  const source = options.source ?? staffContentSource();
  const requestedScope = options.scope ?? staffProgramScope();
  if (source === "static") {
    return { source, requestedScope, items: [...staticItems(requestedScope)] };
  }

  const items = options.postgresReader
    ? await options.postgresReader.list(requestedScope)
    : [...await runtimeList(requestedScope)];
  return { source, requestedScope, items };
}

export async function getPublishedStaffContent(
  id: string,
  options: StaffContentLoadOptions = {},
): Promise<ContentItem | undefined> {
  const source = options.source ?? staffContentSource();
  const requestedScope = options.scope ?? staffProgramScope();
  if (source === "static") return staticItem(id, requestedScope);
  return options.postgresReader ? options.postgresReader.get(id, requestedScope) : runtimeGet(id, requestedScope);
}
