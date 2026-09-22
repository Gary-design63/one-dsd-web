import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";

describe("site-wide response security", () => {
  it("applies clickjacking, sniffing, referrer, permissions, and CSP controls to every route", async () => {
    const rules = await nextConfig.headers?.();
    expect(rules).toHaveLength(1);
    expect(rules?.[0]?.source).toBe("/(.*)");
    const headers = Object.fromEntries((rules?.[0]?.headers ?? []).map((header) => [header.key, header.value]));

    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Robots-Tag"]).toContain("noindex");
    expect(headers["Referrer-Policy"]).toBe("same-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["Permissions-Policy"]).toContain("microphone=()");
    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(headers["Content-Security-Policy"]).toContain("form-action 'self'");
  });

  it("keeps the staff Practice root free while forwarding only legacy consultant subpaths", async () => {
    const redirects = await nextConfig.redirects?.();
    const routes = redirects ?? [];

    expect(routes).not.toContainEqual(expect.objectContaining({ source: "/practice" }));
    expect(routes).toContainEqual({
      source: "/practice/queue/:path*",
      destination: "/consultant/queue/:path*",
      permanent: false,
    });
    expect(routes).toContainEqual({
      source: "/practice/orchestrator",
      destination: "/consultant/orchestrator",
      permanent: false,
    });
    expect(routes).toContainEqual({
      source: "/one-dsd-team",
      destination: "/consultant/one-dsd-team",
      permanent: false,
    });
    expect(routes).not.toContainEqual(expect.objectContaining({ source: "/api/practice/:path*" }));
  });
});
