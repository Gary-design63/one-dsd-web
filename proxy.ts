import type { NextRequest } from "next/server";
import { applyRequestedView } from "@/lib/product/view-proxy";

/**
 * Runs before a page renders. Its only job is to honor a shared link's `?view=` choice on
 * the very first response; see lib/product/view-proxy.ts.
 */
export function proxy(request: NextRequest) {
  return applyRequestedView(request);
}

export const config = {
  matcher: [
    {
      // Pages only: never API routes, Next.js assets, or public files such as images and audio.
      // Only real file extensions are excluded, so a page id that contains a dot still matches.
      source: "/((?!api/|_next/|.*\\.(?:ico|png|jpe?g|webp|avif|gif|svg|mp3|m4a|wav|mp4|webm|vtt|pdf|txt|xml|json|js|css|map|woff2?|ttf)$).*)",
      // Only requests that carry a view choice reach the proxy at all.
      has: [{ type: "query", key: "view" }],
    },
  ],
};
