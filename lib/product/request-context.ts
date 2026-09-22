import "server-only";

import { cookies } from "next/headers";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import {
  PRODUCT_CONTEXT_COOKIE,
  resolveProductContext,
  type ProductContextId,
} from "./federation";

/** Query parameter that lets a shared link select the program view: `?view=one_dsd` or `?view=one_dhs`. */
export const PRODUCT_CONTEXT_QUERY = "view";

/**
 * Reads a `?view=` value into a context id. Accepts the context ids plus the short names
 * people are likely to type (`dsd`, `one-dsd`, `dhs`, `one-dhs`). Returns undefined when
 * the value is absent or unknown so the caller can fall back to the cookie preference.
 */
export function parseProductContextView(value: unknown): ProductContextId | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return undefined;
  const normalized = raw.trim().toLowerCase().replace(/-/g, "_");
  if (normalized === "one_dsd" || normalized === "dsd") return "one_dsd";
  if (normalized === "one_dhs" || normalized === "dhs") return "one_dhs";
  return undefined;
}

export function contentScopeForContext(context: ProductContextId): StaffProgramScope {
  return context === "one_dsd" ? "dsd" : "one-dhs";
}

/**
 * The requested program view. An explicit `view` (from a page's searchParams) wins for that
 * request; otherwise the `pac_context` cookie preference applies, then the default.
 */
export async function requestedProductContext(view?: unknown): Promise<ProductContextId> {
  const explicit = parseProductContextView(view);
  if (explicit) return explicit;
  const store = await cookies();
  return resolveProductContext(store.get(PRODUCT_CONTEXT_COOKIE)?.value);
}

export async function requestedContentScope(view?: unknown): Promise<StaffProgramScope> {
  return contentScopeForContext(await requestedProductContext(view));
}
