import "server-only";

import { cookies } from "next/headers";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import {
  parseProductContextView,
  PRODUCT_CONTEXT_COOKIE,
  resolveProductContext,
  type ProductContextId,
} from "./federation";

// The parser lives with the shared federation contract so proxy.ts can use it too.
export { parseProductContextView, PRODUCT_CONTEXT_QUERY } from "./federation";

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
