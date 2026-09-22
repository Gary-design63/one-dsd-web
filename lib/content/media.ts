import "server-only";

import { pageTextEditingAvailable, runtimeDatabase } from "@/lib/content/page-text";
import type { StaffProgramScope } from "@/lib/content/staff-publications";

/**
 * Consultant media: files stored in the database, page image replacements,
 * media attached to resources, and resources written by the consultant.
 */
export const MEDIA_MAX_BYTES = 4 * 1024 * 1024;

export type MediaFile = { fileName: string; mimeType: string; byteSize: number; content: Buffer; altText: string };
export type PageImageOverride = { key: string; mediaId: string; alt: string };
export type ResourceMediaItem = {
  id: string;
  kind: "audio" | "image" | "video" | "document";
  mediaId: string | null;
  externalUrl: string | null;
  title: string;
  alt: string;
  mimeType: string | null;
  fileName: string | null;
  script: ScriptLine[] | null;
};
export type ScriptLine = { start: number; end: number; text: string; p?: number };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function mediaAvailable(): boolean {
  return pageTextEditingAvailable();
}

export function isMediaId(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

export async function saveMediaFile(fileName: string, mimeType: string, content: Buffer, altText: string): Promise<string> {
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ id: string }>>`
    select pac.save_media_file(${fileName}, ${mimeType}, ${content}, ${altText}) as id`;
  return rows[0].id;
}

export async function readMediaFile(mediaId: string): Promise<MediaFile | null> {
  if (!isMediaId(mediaId)) return null;
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ file_name: string; mime_type: string; byte_size: number; content: Buffer; alt_text: string }>>`
    select file_name, mime_type, byte_size, content, alt_text from pac.read_media_file(${mediaId}::uuid)`;
  const row = rows[0];
  if (!row) return null;
  return { fileName: row.file_name, mimeType: row.mime_type, byteSize: row.byte_size, content: Buffer.from(row.content), altText: row.alt_text };
}

export async function readPageImageOverrides(scope: StaffProgramScope, route: string): Promise<PageImageOverride[]> {
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ image_key: string; media_id: string; alt_text: string }>>`
    select image_key, media_id, alt_text from pac.read_page_image_overrides(${scope}, ${route})`;
  return rows.map((row) => ({ key: row.image_key, mediaId: row.media_id, alt: row.alt_text }));
}

export async function savePageImageOverrides(scope: StaffProgramScope, route: string, entries: PageImageOverride[]): Promise<number> {
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ saved: number }>>`
    select pac.save_page_image_overrides(${scope}, ${route}, ${sql.json(entries)}) as saved`;
  return rows[0]?.saved ?? 0;
}

export async function listResourceMedia(contentItemId: string): Promise<ResourceMediaItem[]> {
  if (!mediaAvailable()) return [];
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ resource_media_id: string; kind: "audio" | "image" | "video" | "document"; media_id: string | null; external_url: string | null; title: string; alt_text: string; mime_type: string | null; file_name: string | null; script: ScriptLine[] | null }>>`
    select resource_media_id, kind, media_id, external_url, title, alt_text, mime_type, file_name, script
    from pac.list_resource_media(${contentItemId})`;
  return rows.map((row) => ({
    id: row.resource_media_id,
    kind: row.kind,
    mediaId: row.media_id,
    externalUrl: row.external_url,
    title: row.title,
    alt: row.alt_text,
    mimeType: row.mime_type,
    fileName: row.file_name,
    script: Array.isArray(row.script) ? row.script : null,
  }));
}

/** Attach a timed script to a recording so the words follow the audio. */
export async function setResourceMediaScript(resourceMediaId: string, script: ScriptLine[] | null): Promise<boolean> {
  if (!isMediaId(resourceMediaId)) return false;
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ ok: boolean }>>`
    select pac.set_resource_media_script(${resourceMediaId}::uuid, ${script === null ? null : sql.json(script as never)}) as ok`;
  return Boolean(rows[0]?.ok);
}

export async function addResourceMedia(input: {
  contentItemId: string;
  kind: "audio" | "image" | "video" | "document";
  mediaId: string | null;
  externalUrl: string | null;
  title: string;
  alt: string;
}): Promise<string> {
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ id: string }>>`
    select pac.add_resource_media(${input.contentItemId}, ${input.kind}, ${input.mediaId}::uuid, ${input.externalUrl}, ${input.title}, ${input.alt}) as id`;
  return rows[0].id;
}

export async function deleteResourceMedia(resourceMediaId: string): Promise<boolean> {
  if (!isMediaId(resourceMediaId)) return false;
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ removed: boolean }>>`
    select pac.delete_resource_media(${resourceMediaId}::uuid) as removed`;
  return Boolean(rows[0]?.removed);
}

export async function createResourceOutright(scope: StaffProgramScope, payload: Record<string, unknown>): Promise<{ contentItemId: string; revisionId: string }> {
  const sql = runtimeDatabase();
  const rows = await sql<Array<{ r: { contentItemId: string; revisionId: string } }>>`
    select pac.create_resource_outright(${scope}, ${sql.json(payload as never)}) as r`;
  return rows[0].r;
}

/** Turns a video page link into an embeddable player address, when the host supports it. */
export function videoEmbedUrl(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v") ?? (url.pathname.startsWith("/embed/") ? url.pathname.slice(7) : url.pathname.startsWith("/shorts/") ? url.pathname.slice(8) : null);
    return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).pop() ?? "";
    return /^\d{5,15}$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "player.vimeo.com") return url.pathname.startsWith("/video/") ? url.toString() : null;
  return null;
}
