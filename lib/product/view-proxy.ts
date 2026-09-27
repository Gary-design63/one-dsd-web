import { NextResponse, type NextRequest } from "next/server";
import { parseProductContextView, PRODUCT_CONTEXT_COOKIE, PRODUCT_CONTEXT_QUERY, type ProductContextId } from "./federation";

/** Same lifetime and attributes as the preference the in-page view switcher stores. */
const PREFERENCE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Replace (or add) the view preference in a raw Cookie request header, keeping every other cookie. */
export function withViewCookie(cookieHeader: string | null, context: ProductContextId): string {
  const others = (cookieHeader ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith(`${PRODUCT_CONTEXT_COOKIE}=`));
  return [...others, `${PRODUCT_CONTEXT_COOKIE}=${context}`].join("; ");
}

/**
 * A person opening a page: a top-level navigation that is not a speculative
 * prefetch or prerender. Background fetches never change a saved preference.
 */
function isPageVisit(request: NextRequest): boolean {
  return request.headers.get("sec-fetch-dest") === "document"
    && request.headers.get("sec-fetch-mode") === "navigate"
    && !request.headers.has("sec-purpose")
    && request.headers.get("purpose") !== "prefetch";
}

/**
 * A link can choose the program view with `?view=one_dsd` (or `one_dhs`). Pages decide the
 * view from the `pac_context` cookie, which a first-time visitor does not have yet, so the
 * link's view is applied here, before anything renders:
 *
 * - A page visit stores the preference and is sent straight to the same address without
 *   `?view=`. The address bar and the client router therefore never hold a stale view that
 *   could later override the person's own choice in the view switcher.
 * - Any other request (client navigation, prefetch) renders in the requested view by placing
 *   the preference in this request's cookies only; nothing is stored.
 * - An unknown value changes nothing. The view is a content preference, never an
 *   authorization decision (see lib/product/federation.ts).
 */
export function applyRequestedView(request: NextRequest): NextResponse {
  const context = parseProductContextView(request.nextUrl.searchParams.get(PRODUCT_CONTEXT_QUERY));
  if (!context) return NextResponse.next();

  if (isPageVisit(request)) {
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete(PRODUCT_CONTEXT_QUERY);
    const response = NextResponse.redirect(cleanUrl, 307);
    response.headers.set("cache-control", "no-store");
    response.cookies.set({
      name: PRODUCT_CONTEXT_COOKIE,
      value: context,
      path: "/",
      maxAge: PREFERENCE_MAX_AGE_SECONDS,
      sameSite: "lax",
      // The in-page switcher and Share button read this preference, so it stays script-readable.
      httpOnly: false,
    });
    return response;
  }

  const headers = new Headers(request.headers);
  headers.set("cookie", withViewCookie(request.headers.get("cookie"), context));
  return NextResponse.next({ request: { headers } });
}
