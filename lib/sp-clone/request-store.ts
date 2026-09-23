import "server-only";
import { runtimeDatabaseConfiguration, runtimeSql } from "@/lib/db/runtime-client";

/**
 * Backs the SharePoint-style clone's "Request support" workflow. Isolated from the live
 * program's own data model: its own database schema (sp_clone), reached only through this
 * server-only module — never a direct environment reference from an app/ or components/
 * file — matching the program's existing database-boundary rule.
 */

export interface SpCloneRequestRecord {
  trackingId: string;
  requesterName: string | null;
  topic: string;
  details: string | null;
  status: string;
  createdAt: string;
}

/** The shared runtime client; it is never ended per request. */
function connection() {
  const configuration = runtimeDatabaseConfiguration();
  if (!configuration) throw new Error("Database is not configured.");
  return runtimeSql(configuration);
}

function newTrackingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreads
  let code = "";
  for (let i = 0; i < 6; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function saveRequest(requesterName: string, topic: string, details: string): Promise<string> {
  const trackingId = newTrackingId();
  const sql = connection();
  await sql`
    insert into sp_clone.requests (tracking_id, requester_name, topic, details, status)
    values (${trackingId}, ${requesterName || null}, ${topic}, ${details || null}, 'Submitted')
  `;
  return trackingId;
}

export async function findRequestByTrackingId(trackingId: string): Promise<SpCloneRequestRecord | undefined> {
  const sql = connection();
  const rows = await sql`
    select tracking_id, requester_name, topic, details, status, created_at
    from sp_clone.requests where tracking_id = ${trackingId} limit 1
  `;
  if (rows.length === 0) return undefined;
  const row = rows[0];
  return {
    trackingId: row.tracking_id,
    requesterName: row.requester_name,
    topic: row.topic,
    details: row.details,
    status: row.status,
    createdAt: row.created_at,
  };
}
