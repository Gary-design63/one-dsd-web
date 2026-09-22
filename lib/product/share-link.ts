import type { ProductContextId } from "./federation";

/**
 * A share link points at one specific page or resource and nothing else.
 * It keeps the path, the program view when it is One DSD (so the recipient sees
 * the same content), an in-page anchor, and only the list filters that define
 * what a page shows. Personal context such as work-area origin, tasks typed into
 * Ask, and any other parameter is left out.
 */
export const SHARE_VIEW_QUERY = "view";

/** Query parameters that define what a list page shows; everything else is dropped. */
const KEPT_QUERY: ReadonlyArray<readonly [RegExp, readonly string[]]> = [
  [/^\/learn$/, ["theme", "q", "type"]],
  [/^\/(?:library|resources)$/, ["q", "type", "authority", "area", "task", "role", "topic", "freshness"]],
];

const ANCHOR = /^#[A-Za-z0-9][A-Za-z0-9_.:-]{0,119}$/;

export type ShareLocation = { origin?: string; pathname: string; search?: string; hash?: string };

function cleanPathname(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const trimmed = path.replace(/\/+$/, "");
  return trimmed || "/";
}

/** Build the canonical share link for a location in the program. */
export function shareLink(location: ShareLocation, context: ProductContextId): string {
  const pathname = cleanPathname(location.pathname);
  const incoming = new URLSearchParams(location.search ?? "");
  const outgoing = new URLSearchParams();
  const kept = KEPT_QUERY.find(([pattern]) => pattern.test(pathname))?.[1] ?? [];
  for (const key of kept) {
    const value = incoming.get(key)?.trim();
    if (value) outgoing.set(key, value);
  }
  if (context === "one_dsd") outgoing.set(SHARE_VIEW_QUERY, "one_dsd");
  const search = outgoing.toString();
  const hash = location.hash && ANCHOR.test(location.hash) ? location.hash : "";
  const origin = location.origin ? location.origin.replace(/\/+$/, "") : "";
  return `${origin}${pathname}${search ? `?${search}` : ""}${hash}`;
}

/** Each published podcast has its own page with its player, chapters and transcript. */
export function podcastShareHref(podcastId: string): string {
  return `/podcasts/${encodeURIComponent(podcastId)}`;
}

/** Read the current browser location into the shape shareLink expects. */
export function currentShareLocation(): ShareLocation {
  const { origin, pathname, search, hash } = window.location;
  return { origin, pathname, search, hash };
}
