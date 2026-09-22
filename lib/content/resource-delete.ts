import "server-only";

import { pageTextEditingAvailable, runtimeDatabase } from "@/lib/content/page-text";

/**
 * Outright deletion for the consultant. The item is retired in the database,
 * which removes it from every page and both program views at once.
 */
export type DeleteResult = { contentItemId: string; deleted: boolean; alreadyDeleted: boolean };

export function resourceDeletionAvailable(): boolean {
  return pageTextEditingAvailable();
}

export async function deleteResourceOutright(contentItemId: string, reason: string): Promise<DeleteResult> {
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ r: DeleteResult }>>`
    select pac.delete_content_item_outright(${contentItemId}, ${reason}) as r`;
  return rows[0].r;
}

export async function restoreResource(contentItemId: string): Promise<{ contentItemId: string; restored: boolean }> {
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ r: { contentItemId: string; restored: boolean } }>>`
    select pac.restore_content_item(${contentItemId}) as r`;
  return rows[0].r;
}
