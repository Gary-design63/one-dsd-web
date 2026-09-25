/** Original area/task membership semantics restored from 5680911:lib/content/work-index.ts. */
import { normalizeWorkOrigin } from "@/lib/product/work-origin";
import { DOMAINS } from "@/lib/domains";
import { AUTHORITY, CONTENT_TYPE_LABEL, type ContentItem } from "./types";

export type LibraryFilters = { originArea?: string; area?: string; task?: string; type?: string; authority?: string; role?: string; topic?: string };
export const LIBRARY_FILTER_KEYS = ["area", "task", "type", "authority", "originArea", "role", "topic"] as const;
export function libraryQueryValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}
export function normalizeLibraryFilters(input: Record<string, string | string[] | undefined>): LibraryFilters {
  const area = libraryQueryValue(input.area); const task = libraryQueryValue(input.task);
  const type = libraryQueryValue(input.type); const authority = libraryQueryValue(input.authority);
  const domain = DOMAINS.find(candidate => candidate.id === area);
  const origin = normalizeWorkOrigin(input);
  const role = libraryQueryValue(input.role); const topic = libraryQueryValue(input.topic);
  return {
    ...(origin.originArea ? { originArea: origin.originArea } : {}),
    ...(role && role.length <= 100 ? { role } : {}),
    ...(topic && topic.length <= 100 ? { topic } : {}),
    ...(domain ? { area: domain.id } : {}),
    ...(domain?.tasks.some(candidate => candidate.id === task) ? { task } : {}),
    ...(Object.hasOwn(CONTENT_TYPE_LABEL, type) ? { type } : {}),
    ...(Object.hasOwn(AUTHORITY, authority) ? { authority } : {}),
  };
}
export function matchesLibraryFilters(item: ContentItem, filters: LibraryFilters): boolean {
  if (item.status !== "approved") return false;
  if (filters.type && item.type !== filters.type) return false;
  if (filters.authority && item.authority !== filters.authority) return false;
  if (filters.area) {
    const domain = DOMAINS.find(candidate => candidate.id === filters.area);
    if (!domain) return false;
    if (filters.task) {
      if (!domain.tasks.find(candidate => candidate.id === filters.task)?.contentIds.includes(item.id)) return false;
    } else if (!domain.toolIds.includes(item.id) && !domain.tasks.some(task => task.contentIds.includes(item.id))) return false;
  } else if (filters.task) return false;
  return true;
}
export function libraryHref(filters: LibraryFilters, query?: string): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  for (const key of LIBRARY_FILTER_KEYS) if (filters[key]) params.set(key, filters[key]!);
  return params.size ? "/library?" + params.toString() : "/library";
}
