import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";
import { parseProductContextView as sharedParser } from "@/lib/product/federation";
import { applyRequestedView, withViewCookie } from "@/lib/product/view-proxy";

const PAGE_VISIT = { "sec-fetch-dest": "document", "sec-fetch-mode": "navigate" };

function request(path: string, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:3100${path}`, { headers });
}

/** The cookie header the application will see for this request, as forwarded by Next.js. */
function forwardedCookie(response: Response): string | null {
  const overridden = (response.headers.get("x-middleware-override-headers") ?? "").split(",");
  return overridden.includes("cookie") ? response.headers.get("x-middleware-request-cookie") : null;
}

describe("proxy matcher", () => {
  const matches = (url: string) => unstable_doesMiddlewareMatch({ config, url });

  it("runs only for pages that carry a view choice", () => {
    for (const url of [
      "/?view=one_dsd",
      "/library/asset-cultural-humility?view=one_dsd",
      "/share/library/asset-cultural-humility?view=one_dsd",
      "/courses/anti-racism-resource/ar-whose-work?view=dsd",
      "/learn?theme=culture&view=one_dhs",
    ]) expect(matches(url), url).toBe(true);
  });

  it("never runs for pages without a view, API routes, Next.js assets, or files", () => {
    for (const url of [
      "/",
      "/library/asset-cultural-humility",
      "/api/downloads/library/x?format=pdf&view=one_dsd",
      "/api/page-text?route=/&view=one_dsd",
      "/_next/static/chunks/app.js?view=one_dsd",
      "/_next/image?url=%2Fimages%2Fa.jpg&view=one_dsd",
      "/audio/anti-racism-public-service.mp3?view=one_dsd",
      "/images/covers/a.webp?view=one_dsd",
      "/favicon.ico?view=one_dsd",
    ]) expect(matches(url), url).toBe(false);
  });
});

describe("requested view", () => {
  it("renders a first-time visitor's link in the requested view", () => {
    const response = proxy(request("/library/asset-cultural-humility?view=one_dsd"));
    expect(forwardedCookie(response)).toBe("pac_context=one_dsd");
  });

  it("replaces an existing view preference for this request and keeps every other cookie", () => {
    const response = applyRequestedView(request("/?view=one_dsd", { cookie: "pac_owner=abc; pac_context=one_dhs; theme=x=y" }));
    expect(forwardedCookie(response)).toBe("pac_owner=abc; theme=x=y; pac_context=one_dsd");
  });

  it("accepts the short names people type", () => {
    expect(forwardedCookie(applyRequestedView(request("/?view=DSD")))).toBe("pac_context=one_dsd");
    expect(forwardedCookie(applyRequestedView(request("/?view=one-dhs")))).toBe("pac_context=one_dhs");
  });

  it("changes nothing for an unknown or empty value", () => {
    for (const path of ["/?view=everyone", "/?view=", "/?view=one_dsd%3Bpac_owner%3Dx"]) {
      const response = applyRequestedView(request(path, PAGE_VISIT));
      expect(forwardedCookie(response), path).toBeNull();
      expect(response.headers.get("set-cookie"), path).toBeNull();
    }
  });

  it("stores the preference only on a real page visit, never on a background fetch", () => {
    expect(applyRequestedView(request("/?view=one_dsd")).headers.get("set-cookie")).toBeNull();
    expect(applyRequestedView(request("/?view=one_dsd", { "sec-fetch-dest": "empty", "sec-fetch-mode": "cors" })).headers.get("set-cookie")).toBeNull();
    const visit = applyRequestedView(request("/?view=one_dsd", PAGE_VISIT)).headers.get("set-cookie") ?? "";
    expect(visit).toMatch(/^pac_context=one_dsd;/);
    expect(visit).toMatch(/Path=\//);
    expect(visit).toMatch(/Max-Age=31536000/);
    expect(visit).toMatch(/SameSite=lax/i);
    expect(visit).not.toMatch(/HttpOnly/i);
  });

  it("sends a page visit to the same address without ?view, keeping other query values and the host", () => {
    const response = applyRequestedView(request("/learn?theme=culture&view=one_dsd&q=bias", PAGE_VISIT));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3100/learn?theme=culture&q=bias");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(forwardedCookie(response)).toBeNull();
    expect(applyRequestedView(request("/library/asset-cultural-humility?view=dsd", PAGE_VISIT)).headers.get("location")).toBe("http://localhost:3100/library/asset-cultural-humility");
  });

  it("treats speculative prefetch and prerender as background requests", () => {
    for (const [header, value] of [["sec-purpose", "prefetch"], ["sec-purpose", "prefetch;prerender"], ["purpose", "prefetch"]] as const) {
      const requestHeaders = { ...PAGE_VISIT, [header]: value };
      const response = applyRequestedView(request("/?view=one_dsd", requestHeaders));
      expect(response.status, JSON.stringify(requestHeaders)).toBe(200);
      expect(response.headers.get("set-cookie"), JSON.stringify(requestHeaders)).toBeNull();
      expect(forwardedCookie(response), JSON.stringify(requestHeaders)).toBe("pac_context=one_dsd");
    }
  });

  it("matches page ids that contain a dot, but still skips real files", () => {
    expect(unstable_doesMiddlewareMatch({ config, url: "/library/pn.partnership.spine?view=one_dsd" })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config, url: "/images/covers/a.webp?view=one_dsd" })).toBe(false);
  });

  it("builds the cookie header without duplicates", () => {
    expect(withViewCookie(null, "one_dsd")).toBe("pac_context=one_dsd");
    expect(withViewCookie("pac_context=one_dhs; pac_context=one_dsd", "one_dhs")).toBe("pac_context=one_dhs");
  });

  it("keeps one shared parser for the proxy and the pages", async () => {
    const { parseProductContextView } = await import("@/lib/product/request-context");
    expect(parseProductContextView).toBe(sharedParser);
  });
});
