import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  runCases: vi.fn(async () => ({ id: "eval-test", results: [] })),
  runCycle: vi.fn(async () => ({ id: "cycle-test" })),
  undoCycle: vi.fn(async () => ({ ok: false, reverted: 0, reason: "not found" })),
  decideProposal: vi.fn(async () => null),
  getResearchPolicy: vi.fn(async () => ({
    enabled: false,
    mode: "off",
    provider_order: ["fixture"],
    daily_request_cap: 0,
    monthly_usd_cap: 0,
    allowed_domains: [],
    recency: "any",
    deep_research_enabled: false,
  })),
  listUsage: vi.fn(async () => []),
  usageSummary: vi.fn(async () => ({
    today: { requests: 0, usd: 0 },
    month: { requests: 0, usd: 0 },
    caps: { daily_request_cap: 0, monthly_usd_cap: 0 },
    remaining: { requests_today: -1, usd_month: -1 },
  })),
  setResearchPolicy: vi.fn(async (patch: unknown) => patch),
  queueUpdate: vi.fn(async () => ({ ok: false, reason: "not_found" })),
  accessibilityReview: vi.fn(async () => ({ ok: true })),
  classify: vi.fn(async () => ({ ok: true })),
}));

vi.mock("@/lib/intelligence/eval/runner", () => ({ runCases: mocks.runCases }));
vi.mock("@/lib/intelligence/agents/cycle", () => ({
  runCycle: mocks.runCycle,
  undoCycle: mocks.undoCycle,
  decideProposal: mocks.decideProposal,
}));
vi.mock("@/lib/intelligence/research/governance", () => ({
  getResearchPolicy: mocks.getResearchPolicy,
  listUsage: mocks.listUsage,
  usageSummary: mocks.usageSummary,
  setResearchPolicy: mocks.setResearchPolicy,
}));
vi.mock("@/lib/intelligence/research/providers", () => ({ providerStatus: () => [] }));
vi.mock("@/lib/intelligence/orchestrator", () => ({
  contextFor: () => ({}),
  queueUpdate: mocks.queueUpdate,
  accessibilityReview: mocks.accessibilityReview,
  classify: mocks.classify,
}));
vi.mock("@/lib/intelligence/tools/runtime", () => ({
  runTool: async (_context: unknown, _tool: string, work: () => unknown) => work(),
}));

import { POST as evalsPost } from "@/app/api/consultant/evals/route";
import { POST as orchestratorPost } from "@/app/api/consultant/orchestrator/route";
import { GET as contentGet, POST as contentPost } from "@/app/api/consultant/content/[surfaceId]/route";
import { POST as pageCopyPost } from "@/app/api/consultant/page-copy/[surface]/route";
import { PATCH as resourceDraftPatch } from "@/app/api/consultant/resources/[id]/draft/route";
import { GET as resourceReleaseGet, POST as resourceReleasePost } from "@/app/api/consultant/resources/[id]/release/route";
import { GET as askRecordsGet, DELETE as askRecordsDelete } from "@/app/api/consultant/ask-records/route";
import { GET as researchGet, POST as researchPost } from "@/app/api/consultant/research/route";
import { POST as reviewPost } from "@/app/api/consultant/review/route";
import { PATCH as queuePatch } from "@/app/api/consultant/queue/[id]/route";
import { GET as studioGet, POST as studioPost } from "@/app/api/consultant/studio/route";
import { GET as studioAssetGet } from "@/app/api/consultant/studio/[id]/[kind]/route";
import { issueSessionCookieValue, OWNER_COOKIE } from "@/lib/auth/owner";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";

const ROOT = path.resolve(import.meta.dirname, "..");
const OWNER_KEY = "protected-route-test-owner-key-1234567890";

type Method = "GET" | "POST" | "PATCH" | "DELETE";
type RouteCall = (request: NextRequest) => Promise<Response>;

function request(method: Method, pathname: string, options: {
  owner?: boolean;
  origin?: string;
  body?: unknown;
} = {}): NextRequest {
  const headers = new Headers();
  if (method !== "GET") headers.set("content-type", "application/json");
  if (options.origin) headers.set("origin", options.origin);
  if (options.owner) {
    const session = issueSessionCookieValue();
    if (!session) throw new Error("Owner test session was not created.");
    headers.set("cookie", `${OWNER_COOKIE}=${session}`);
  }
  return new NextRequest(`https://program.example${pathname}`, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify(options.body ?? {}),
  });
}

const DIRECTLY_VERIFIED_ROUTES: Array<{
  id: string;
  method: Method;
  pathname: string;
  call: RouteCall;
}> = [
  { id: "ask-records-read", method: "GET", pathname: "/api/consultant/ask-records", call: askRecordsGet },
  { id: "ask-records-delete", method: "DELETE", pathname: "/api/consultant/ask-records", call: askRecordsDelete },
  { id: "evals", method: "POST", pathname: "/api/consultant/evals", call: evalsPost },
  { id: "orchestrator", method: "POST", pathname: "/api/consultant/orchestrator", call: orchestratorPost },
  { id: "research-read", method: "GET", pathname: "/api/consultant/research", call: researchGet },
  { id: "research-write", method: "POST", pathname: "/api/consultant/research", call: researchPost },
  { id: "review", method: "POST", pathname: "/api/consultant/review", call: reviewPost },
  {
    id: "queue",
    method: "PATCH",
    pathname: "/api/consultant/queue/CR-test",
    call: (incoming) => queuePatch(incoming, { params: Promise.resolve({ id: "CR-test" }) }),
  },
];

// Exercise the thin Next route entry points too, without substituting their
// authorization or origin checks. All calls reject before reaching a store.
const DELEGATED_ACCESS_ROUTES: typeof DIRECTLY_VERIFIED_ROUTES = [
  { id: "content-read", method: "GET", pathname: "/api/consultant/content/about.page", call: incoming => contentGet(incoming, { params: Promise.resolve({ surfaceId: "about.page" }) }) },
  { id: "content-write", method: "POST", pathname: "/api/consultant/content/about.page", call: incoming => contentPost(incoming, { params: Promise.resolve({ surfaceId: "about.page" }) }) },
  { id: "page-copy", method: "POST", pathname: "/api/consultant/page-copy/home", call: incoming => pageCopyPost(incoming, { params: Promise.resolve({ surface: "home" }) }) },
  { id: "resource-draft", method: "PATCH", pathname: "/api/consultant/resources/R-test/draft", call: incoming => resourceDraftPatch(incoming, { params: Promise.resolve({ id: "R-test" }) }) },
  { id: "resource-release-read", method: "GET", pathname: "/api/consultant/resources/R-test/release", call: incoming => resourceReleaseGet(incoming, { params: Promise.resolve({ id: "R-test" }) }) },
  { id: "resource-release-write", method: "POST", pathname: "/api/consultant/resources/R-test/release", call: incoming => resourceReleasePost(incoming, { params: Promise.resolve({ id: "R-test" }) }) },
];
const ACCESS_VERIFIED_ROUTES = [...DIRECTLY_VERIFIED_ROUTES, ...DELEGATED_ACCESS_ROUTES];

const ROUTE_INVENTORY: Record<string, { methods: Method[]; access: "owner" | "authentication" | "session" | "removed"; evidence: string }> = {
  "app/api/consultant/studio/route.ts": { methods: ["GET", "POST"], access: "removed", evidence: "tests/visual-studio-api.test.ts" },
  "app/api/consultant/studio/[id]/[kind]/route.ts": { methods: ["GET"], access: "removed", evidence: "tests/visual-studio-api.test.ts" },
  "app/api/consultant/program/route.ts": { methods: ["GET", "POST"], access: "owner", evidence: "tests/program-work-api.test.ts" },
  "app/api/consultant/ask-records/route.ts": { methods: ["GET", "DELETE"], access: "owner", evidence: "tests/ask-records-api.test.ts" },
  "app/api/consultant/content/[surfaceId]/route.ts": { methods: ["GET", "POST"], access: "owner", evidence: "tests/editable-surface-api.test.ts" },
  "app/api/consultant/one-dsd-team/route.ts": { methods: ["GET", "POST"], access: "owner", evidence: "tests/one-dsd-team.test.ts" },
  "app/api/consultant/editing/route.ts": { methods: ["GET"], access: "session", evidence: "tests/editing-mode.test.ts" },
  "app/api/consultant/evals/route.ts": { methods: ["POST"], access: "owner", evidence: "tests/protected-owner-api-access.test.ts" },
  "app/api/consultant/login/route.ts": { methods: ["POST"], access: "authentication", evidence: "tests/owner-auth-security.test.ts" },
  "app/api/consultant/logout/route.ts": { methods: ["POST"], access: "session", evidence: "tests/owner-auth-security.test.ts" },
  "app/api/consultant/orchestrator/route.ts": { methods: ["POST"], access: "owner", evidence: "tests/protected-owner-api-access.test.ts" },
  "app/api/consultant/page-copy/[surface]/route.ts": { methods: ["POST"], access: "owner", evidence: "tests/page-copy-api.test.ts" },
  "app/api/consultant/queue/[id]/route.ts": { methods: ["PATCH"], access: "owner", evidence: "tests/protected-owner-api-access.test.ts" },
  "app/api/consultant/research/route.ts": { methods: ["GET", "POST"], access: "owner", evidence: "tests/protected-owner-api-access.test.ts" },
  "app/api/consultant/resources/[id]/delete/route.ts": { methods: ["POST"], access: "owner", evidence: "tests/resource-inline-editing.test.ts" },
  "app/api/consultant/resources/[id]/draft/route.ts": { methods: ["PATCH"], access: "owner", evidence: "tests/resource-inline-editing.test.ts" },
  "app/api/consultant/resources/[id]/media/route.ts": { methods: ["POST", "DELETE"], access: "owner", evidence: "tests/resource-inline-editing.test.ts" },
  "app/api/consultant/resources/[id]/media/script/route.ts": { methods: ["POST"], access: "owner", evidence: "tests/resource-inline-editing.test.ts" },
  "app/api/consultant/resources/[id]/release/route.ts": { methods: ["GET", "POST"], access: "owner", evidence: "tests/resource-release.test.ts" },
  "app/api/consultant/resources/new/route.ts": { methods: ["POST"], access: "owner", evidence: "tests/resource-inline-editing.test.ts" },
  "app/api/consultant/review/route.ts": { methods: ["POST"], access: "owner", evidence: "tests/protected-owner-api-access.test.ts" },
};

function routeFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return routeFiles(absolute);
    if (entry.name !== "route.ts") return [];
    return [path.relative(ROOT, absolute).replaceAll("\\", "/")];
  });
}

describe("protected owner API access", () => {
  beforeEach(() => {
    process.env.PAC_OWNER_KEY = OWNER_KEY;
    process.env.PAC_DATA_ENV = "local";
    resetStoreForTests();
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.PAC_OWNER_KEY;
    delete process.env.PAC_DATA_ENV;
  });

  it("keeps an exhaustive route-and-evidence inventory", () => {
    const discovered = routeFiles(path.join(ROOT, "app", "api", "consultant")).sort();
    expect(discovered).toEqual(Object.keys(ROUTE_INVENTORY).sort());

    for (const [relative, profile] of Object.entries(ROUTE_INVENTORY)) {
      const source = readFileSync(path.join(ROOT, ...relative.split("/")), "utf8");
      const exported = [...source.matchAll(/export (?:async function|const) (GET|POST|PATCH|PUT|DELETE)\b/g)]
        .map((match) => match[1])
        .sort();
      expect(exported, relative).toEqual([...profile.methods].sort());
      expect(readFileSync(path.join(ROOT, ...profile.evidence.split("/")), "utf8").length).toBeGreaterThan(0);
      let authorizationSource = source;
      const helperImports = [...source.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']((?:\.\.?\/)+handlers)["']/g)];
      if (helperImports.length) {
        for (const match of helperImports) {
          authorizationSource = readFileSync(path.resolve(path.dirname(path.join(ROOT, ...relative.split("/"))), match[2] + ".ts"), "utf8");
          for (const helper of match[1].split(",").map(name => name.trim()).filter(Boolean)) {
            expect(source.includes("return " + helper + "(") || new RegExp("export const (?:GET|POST|PATCH|DELETE) = " + helper + ";").test(source), relative).toBe(true);
            expect(authorizationSource, relative).toContain("export async function " + helper + "(");
          }
        }
      }
      if (profile.access === "owner") expect(authorizationSource, relative).toContain("ownerFromRequest");
      if (profile.access === "removed") {
        expect(authorizationSource, relative).toContain("status: 410");
        expect(authorizationSource, relative).not.toMatch(/from ["'](?:@\/lib|node:fs)|request\.(?:json|text|arrayBuffer)\(/);
        expect(authorizationSource, relative).toContain("return removed();");
      } else if (profile.methods.some((method) => method !== "GET")) expect(authorizationSource, relative).toContain("isSameOriginMutation");
    }
  });

  it.each([false, true])("retired studio route wrappers return410 with owner provenance=%s", async owner => {
    const getRequest = request("GET", "/api/consultant/studio", { owner });
    const postRequest = request("POST", "/api/consultant/studio", { owner, origin: "https://outside.example", body: { action: "launch" } });
    for (const response of [await studioGet(getRequest), await studioPost(postRequest), await studioAssetGet(getRequest, { params: Promise.resolve({ id: "../../outside", kind: "project" }) })]) {
      expect(response.status).toBe(410);
      expect(await response.json()).toEqual({ error: "This authoring integration has been removed from the program." });
    }
    for (const work of [mocks.runCases, mocks.runCycle, mocks.queueUpdate, mocks.accessibilityReview, mocks.classify]) expect(work).not.toHaveBeenCalled();
  });

  it.each(ACCESS_VERIFIED_ROUTES)("rejects unauthenticated $id before opening owner data", async ({ method, pathname, call }) => {
    expect((await call(request(method, pathname, { origin: "https://program.example" }))).status).toBe(401);
  });

  it.each(ACCESS_VERIFIED_ROUTES.filter((entry) => entry.method !== "GET"))(
    "rejects a cross-origin authenticated $id mutation",
    async ({ method, pathname, call }) => {
      expect((await call(request(method, pathname, {
        owner: true,
        origin: "https://outside.example",
      }))).status).toBe(403);
    },
  );

  it.each(DIRECTLY_VERIFIED_ROUTES)("accepts owner provenance for $id", async ({ method, pathname, call }) => {
    const response = await call(request(method, pathname, {
      owner: true,
      origin: "https://program.example",
    }));
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});
