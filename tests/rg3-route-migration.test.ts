import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";
import { PRIMARY_NAV, ROUTES } from "@/lib/constants";
import { GRADUATION_PATHS } from "@/lib/content/paths";

const ROOT = path.resolve(import.meta.dirname, "..");

const CANONICAL_STAFF_ROUTES = {
  home: "/",
  start: "/start",
  ask: "/ask",
  areas: "/areas",
  learn: "/learn",
  practice: "/practice",
  library: "/library",
  communities: "/minnesota-communities",
  oneDsd: "/one-dsd",
  support: "/support",
  rightPerson: "/support/right-person",
  myWork: "/my-work",
  about: "/about",
} as const;

const LEGACY_REDIRECTS = [
  { source: "/blueprint", destination: "/about", permanent: true },
  { source: "/communities", destination: "/minnesota-communities", permanent: true },
  { source: "/communities/from-the-list", destination: "/minnesota-communities", permanent: true },
  { source: "/professional-support", destination: "/support", permanent: true },
  {source:"/library/course-:id",destination:"/courses/:id",permanent:true},
  {source:"/c/:id/:lesson",destination:"/courses/:id/:lesson",permanent:true},
  {source:"/c/:id",destination:"/courses/:id",permanent:true},
  {source:"/ci/:id",destination:"/courses/cultural-intelligence-:id",permanent:true},
  { source: "/guided-start", destination: "/start", permanent: true },
  { source: "/resources", destination: "/library", permanent: true },
  { source: "/resources/:path*", destination: "/library/:path*", permanent: true },
  { source: "/paths", destination: "/learn", permanent: true },
  { source: "/paths/:id", destination: "/practice/:id", permanent: true },
  { source: "/my-view", destination: "/my-work", permanent: true },
  { source: "/practice/audit", destination: "/consultant/audit", permanent: false },
  { source: "/practice/evals", destination: "/consultant/evals", permanent: false },
  { source: "/practice/orchestrator", destination: "/consultant/orchestrator", permanent: false },
  { source: "/practice/queue/:path*", destination: "/consultant/queue/:path*", permanent: false },
  { source: "/practice/registry", destination: "/consultant/registry", permanent: false },
  { source: "/practice/research", destination: "/consultant/research", permanent: false },
  { source: "/practice/resources", destination: "/consultant/resources", permanent: false },
  { source: "/practice/resources/:path*", destination: "/consultant/resources/:path*", permanent: false },
  { source: "/practice/review", destination: "/consultant/review", permanent: false },
  { source: "/one-dsd-team", destination: "/consultant/one-dsd-team", permanent: false },
] as const;

function pageForRoute(route: string): string {
  return route === "/"
    ? path.join(ROOT, "app", "page.tsx")
    : path.join(ROOT, "app", ...route.slice(1).split("/"), "page.tsx");
}

function consultantPages(directory = path.join(ROOT, "app", "consultant")): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return consultantPages(absolute);
    return entry.name === "page.tsx" ? [absolute] : [];
  });
}

describe("RG-3 route migration contract", () => {
  it("keeps the canonical 13-route staff inventory configured and implemented", () => {
    const configured = Object.fromEntries(
      Object.keys(CANONICAL_STAFF_ROUTES).map((key) => [
        key,
        ROUTES[key as keyof typeof CANONICAL_STAFF_ROUTES].href,
      ]),
    );

    expect(configured).toEqual(CANONICAL_STAFF_ROUTES);
    expect(Object.values(CANONICAL_STAFF_ROUTES)).toHaveLength(13);
    for (const route of Object.values(CANONICAL_STAFF_ROUTES)) {
      expect(existsSync(pageForRoute(route)), `${route} must have an App Router page`).toBe(true);
    }
  });

  it("keeps consultant pages out of primary navigation and owner-guarded at each leaf", () => {
    expect(PRIMARY_NAV.some(({ href }) => String(href) === "/consultant" || String(href).startsWith("/consultant/"))).toBe(false);

    // The One DSD Team leaf now redirects to its public workspace rather than gating a
    // private child behind the owner guard; every other consultant leaf keeps the guard.
    const pages = consultantPages().filter((page) => !page.endsWith(path.join("one-dsd-team", "page.tsx")));
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const source = readFileSync(page, "utf8");
      expect(source, `${path.relative(ROOT, page)} must import the owner page guard`).toContain(
        'from "@/lib/auth/owner-page"',
      );
      expect(source, `${path.relative(ROOT, page)} must deny work before rendering`).toContain(
        "if (!(await ownerPageGuard())) return null;",
      );
    }
  });

  it("uses only the exact legacy redirect map", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual(LEGACY_REDIRECTS);

    expect(redirects).toContainEqual({
      source: "/paths",
      destination: "/learn",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/paths/:id",
      destination: "/practice/:id",
      permanent: true,
    });
  });

  it("does not redirect the staff Practice root or its full subtree", async () => {
    const redirects = await nextConfig.redirects?.() ?? [];

    expect(redirects.some(({ source }) => source === "/practice")).toBe(false);
    expect(redirects.some(({ source }) => /^\/practice\/:[^/]+\*$/.test(source))).toBe(false);
  });

  it("keeps graduation paths clear of slugs reserved by consultant compatibility routes", () => {
    const reservedConsultantSlugs = new Set(
      LEGACY_REDIRECTS.flatMap(({ source, destination }) => {
        if (!source.startsWith("/practice/") || !destination.startsWith("/consultant/")) return [];
        return [source.split("/")[2]];
      }),
    );

    expect([...reservedConsultantSlugs].sort()).toEqual([
      "audit",
      "evals",
      "orchestrator",
      "queue",
      "registry",
      "research",
      "resources",
      "review",
    ]);
    expect(GRADUATION_PATHS.map(({ id }) => id).filter((id) => reservedConsultantSlugs.has(id))).toEqual([]);
  });

  it("keeps canonical Practice staff-facing and free of an owner-auth boundary", () => {
    const practicePage = pageForRoute(CANONICAL_STAFF_ROUTES.practice);
    expect(existsSync(practicePage)).toBe(true);

    const files = [practicePage, path.join(ROOT, "app", "practice", "layout.tsx")].filter(existsSync);
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toContain("ownerPageGuard");
      expect(source).not.toContain("ownerFromCookies");
      expect(source).not.toContain("PAC_OWNER_KEY");
    }
  });

  it("rechecks context before showing a DSD consultation route", () => {
    for (const file of [
      "app/paths/[id]/page.tsx",
      "app/resources/[id]/page.tsx",
      "app/minnesota-communities/page.tsx",
      "app/minnesota-communities/[id]/page.tsx",
      "components/path-client.tsx",
    ]) {
      expect(readFileSync(path.join(ROOT, file), "utf8"), file).toContain(
        "contextualizeSupportAction",
      );
    }

    const ask = readFileSync(path.join(ROOT, "components", "ask-client.tsx"), "utf8");
    expect(ask).toContain(
      'dsdContext={context === "one_dsd" && (t.context ?? context) === "one_dsd"}',
    );

    const rightPerson = readFileSync(path.join(ROOT, "components", "right-person-client.tsx"), "utf8");
    expect(rightPerson).toContain("decisionContext === context");
    expect(rightPerson).toContain("decisionEligibility === currentDsdEligibility");
    expect(rightPerson).toContain("decision?.basis.role === role");

    const requestPage = readFileSync(path.join(ROOT, "app", "support", "request", "page.tsx"), "utf8");
    expect(requestPage).toContain("await requestedProductContext()");
    expect(requestPage).toContain('if (context !== "one_dsd")');
    expect(requestPage).not.toContain("<IntakeClient");
    expect(requestPage).toContain("Consultation requests are not accepted from staff");

    const contextProvider = readFileSync(path.join(ROOT, "components", "program-context.tsx"), "utf8");
    expect(contextProvider).toContain("resolveProductContext(cookieValue)");
    expect(contextProvider).not.toContain("localStorage");

    expect(existsSync(path.join(ROOT, "components", "consultant-sign-in.tsx"))).toBe(true);
    expect(readFileSync(path.join(ROOT, "app", "consultant", "layout.tsx"), "utf8")).toContain("ConsultantSignIn");
  });
});
