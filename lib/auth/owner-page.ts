import "server-only";

import { ownerFromCookies } from "./request";

/**
 * Protect a leaf Server Component before it reads owner-only data.
 *
 * A layout cannot prevent its child page from beginning to render. Protected
 * pages return null when this check fails so the Practice layout can render
 * the existing sign-in experience without exposing or loading page data.
 */
export async function ownerPageGuard(): Promise<boolean> {
  return ownerFromCookies();
}
