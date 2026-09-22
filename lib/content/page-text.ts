import "server-only";

import { cache } from "react";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { runtimeDatabaseConfiguration, runtimeSql } from "@/lib/db/runtime-client";

/**
 * Universal inline editing storage. Saved wording changes for any page, keyed by
 * view scope, page route, and a stable element key. Read with the restricted
 * runtime connection; the database functions enforce the shape.
 */
export type PageTextOverride = { key: string; original: string; text: string };

const ROUTE_PATTERN = /^\/[A-Za-z0-9_./-]*$/;

export function normalizePageRoute(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 300 || !ROUTE_PATTERN.test(value)) return null;
  const trimmed = value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value;
  return trimmed || "/";
}

export function pageTextEditingAvailable(environment: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(environment.PAC_RUNTIME_DATABASE_URL?.trim());
}

function database() {
  const configuration = runtimeDatabaseConfiguration();
  if (!configuration) throw new Error("Page text editing needs PAC_RUNTIME_DATABASE_URL.");
  return runtimeSql(configuration);
}

/** Shared restricted runtime connection for consultant actions. */
export function runtimeDatabase() {
  return database();
}

const readOverrides = cache(async (scope: StaffProgramScope, route: string): Promise<PageTextOverride[]> => {
  const rows = await database()<Array<{ element_key: string; original_text: string; replacement_text: string }>>`
    select element_key, original_text, replacement_text
    from pac.read_page_text_overrides(${scope}, ${route})`;
  return rows.map((row) => ({ key: row.element_key, original: row.original_text, text: row.replacement_text }));
});

/** Memoized within one request: reading the same route twice runs one query. */
export async function readPageTextOverrides(scope: StaffProgramScope, route: string): Promise<PageTextOverride[]> {
  if (!pageTextEditingAvailable()) return [];
  return readOverrides(scope, route);
}

export async function savePageTextOverrides(
  scope: StaffProgramScope,
  route: string,
  entries: PageTextOverride[],
): Promise<number> {
  const sql = database();
  const payload = entries.map((entry) => ({ key: entry.key, original: entry.original, text: entry.text }));
  const rows = await sql<Array<{ saved: number }>>`
    select pac.save_page_text_overrides(${scope}, ${route}, ${sql.json(payload)}) as saved`;
  return rows[0]?.saved ?? 0;
}

export type PageTextHistoryEntry = {
  elementKey: string;
  originalText: string;
  replacementText: string;
  updatedAt: string;
  updatedBy: string | null;
  supersededAt: string;
  supersededBy: string;
};

/** Every prior state a save has ever replaced for this route, most recent first. A save never
 * hard-deletes the wording it replaces — it archives it here first, in the same transaction. */
export async function readPageTextHistory(scope: StaffProgramScope, route: string): Promise<PageTextHistoryEntry[]> {
  if (!pageTextEditingAvailable()) return [];
  const rows = await database()<Array<{
    element_key: string; original_text: string; replacement_text: string;
    updated_at: string; updated_by: string | null; superseded_at: string; superseded_by: string;
  }>>`
    select element_key, original_text, replacement_text, updated_at, updated_by, superseded_at, superseded_by
    from pac.page_text_override_history
    where scope_id = ${scope} and route = ${route}
    order by superseded_at desc
    limit 200`;
  return rows.map((row) => ({
    elementKey: row.element_key, originalText: row.original_text, replacementText: row.replacement_text,
    updatedAt: row.updated_at, updatedBy: row.updated_by, supersededAt: row.superseded_at, supersededBy: row.superseded_by,
  }));
}

/** Restores the most recent archived wording for every element on this route, superseding
 * whatever is currently saved (which is itself archived first, so a restore can be undone too). */
export async function restorePageTextRoute(scope: StaffProgramScope, route: string): Promise<number> {
  const sql = database();
  const rows = await sql<Array<{ restored: number }>>`
    select pac.restore_page_text_route(${scope}, ${route}) as restored`;
  return rows[0]?.restored ?? 0;
}
