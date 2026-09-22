import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  ownerPageGuard: vi.fn(),
  ownerFromCookies: vi.fn(),
  getStore: vi.fn(),
  generativeStatus: vi.fn(),
  getPolicy: vi.fn(),
  queue: vi.fn(),
  readOneDsdTeamWorkspace: vi.fn(),
  getMicrosoftBridgeState: vi.fn(),
  listAskResponseRecords: vi.fn(),
  listProgramWork: vi.fn(),
}));

vi.mock("@/lib/auth/owner-page", () => ({ ownerPageGuard: mocks.ownerPageGuard }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/consultant",
  useSearchParams: () => new URLSearchParams(),
  notFound: () => { throw new Error("NEXT_HTTP_ERROR_FALLBACK;404"); },
  redirect: (url: string) => { throw Object.assign(new Error("NEXT_REDIRECT"), { digest: url }); },
}));
vi.mock("@/lib/auth/request", () => ({ ownerFromCookies: mocks.ownerFromCookies, editingModeFromCookies: mocks.ownerFromCookies }));
vi.mock("@/lib/auth/owner", () => ({
  ownerConfigured: () => true,
  ownerKeyIsDevDefault: () => false,
}));
vi.mock("@/lib/intelligence/memory/store", () => ({
  getStore: mocks.getStore,
  storeIsPersistent: () => false,
}));
vi.mock("@/lib/intelligence/providers", () => ({ generativeStatus: mocks.generativeStatus }));
vi.mock("@/lib/intelligence/policy", () => ({ getPolicy: mocks.getPolicy }));
vi.mock("@/lib/intelligence/orchestrator", () => ({ queue: mocks.queue }));
vi.mock("@/lib/collaboration/store", () => ({ readOneDsdTeamWorkspace: mocks.readOneDsdTeamWorkspace }));
vi.mock("@/lib/collaboration/microsoft-boundary", () => ({ getMicrosoftBridgeState: mocks.getMicrosoftBridgeState }));

vi.mock("@/lib/intelligence/observability/ask-records", () => ({ listAskResponseRecords: mocks.listAskResponseRecords }));

vi.mock("@/lib/program/work", () => ({ listProgramWork: mocks.listProgramWork, summarizeProgramWork: vi.fn() }));
import ProgramWorkPage from "@/app/consultant/program/page";

import AskRecordsPage from "@/app/consultant/ask-records/page";
import OneDsdTeamPage from "@/app/consultant/one-dsd-team/page";
import PracticeLayout from "@/app/consultant/layout";
import QueuePage from "@/app/consultant/page";
import RetiredStudioPage from "@/app/consultant/studio/page";

const ROOT = path.resolve(import.meta.dirname, "..");
const REMOVED_PAGES = ["studio/page.tsx"];
// The One DSD Team space now lives on the public side of the program: this leaf redirects
// there outright rather than gating a private child behind the owner guard.
const REDIRECTED_PAGES = ["one-dsd-team/page.tsx"];

function practicePages(directory = path.join(ROOT, "app", "consultant")): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return practicePages(absolute);
    if (entry.name !== "page.tsx") return [];
    return [path.relative(path.join(ROOT, "app", "consultant"), absolute).replaceAll("\\", "/")];
  });
}

const PRACTICE_PAGE_FIRST_WORK: Record<string, string> = {
  "program/page.tsx": "let items:Awaited<ReturnType<typeof listProgramWork>>;",
  "page.tsx": "const [pendingEligibility, items] = await Promise.all",
  "activation/page.tsx": "const intake = consultationActivationStatus();",
  "ask-records/page.tsx": "let initialData = null;",
  "audit/page.tsx": "const events = await getStore().listAudit(200);",
  "evals/page.tsx": "const past = (await getStore().list<EvalReport>",
  "library/page.tsx": "const params = await searchParams;",
  "library/[id]/page.tsx": "const { id } = await params;",
  "orchestrator/page.tsx": "const [policy, cycles, proposals] = await Promise.all",
  "queue/[id]/page.tsx": "const { id } = await params;",
  "registry/page.tsx": "const models = registryModelList();",
  "research/page.tsx": "const [policy, summary, usage] = await Promise.all",
  "resources/page.tsx": "const connected = resourceReleaseAvailable();",
  "resources/[id]/page.tsx": "const { id } = await params;",
  "resources/new/page.tsx": "const today = new Date().toISOString().slice(0, 10);",
  "review/page.tsx": "const flags = await stale();",
  "workforce/page.tsx": "const surfaces = await Promise.all",
  "workforce/[areaId]/page.tsx": "const { areaId } = await params;",
};

describe("owner-only page boundaries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.ownerPageGuard.mockResolvedValue(false);
    mocks.ownerFromCookies.mockResolvedValue(false);
  });

  it("keeps the leaf guard server-only and places it before work on every Practice page", () => {
    const helper = readFileSync(path.join(ROOT, "lib", "auth", "owner-page.ts"), "utf8");
    expect(helper).toContain('import "server-only"');
    expect(helper).toContain("return ownerFromCookies();");
    expect(practicePages().sort()).toEqual([...Object.keys(PRACTICE_PAGE_FIRST_WORK), ...REMOVED_PAGES, ...REDIRECTED_PAGES].sort());

    for (const [relativePath, firstWork] of Object.entries(PRACTICE_PAGE_FIRST_WORK)) {
      const source = readFileSync(path.join(ROOT, "app", "consultant", ...relativePath.split("/")), "utf8");
      const guardPosition = source.indexOf("if (!(await ownerPageGuard())) return null;");
      const workPosition = source.indexOf(firstWork);

      expect(guardPosition, `${relativePath} must use the leaf owner guard`).toBeGreaterThan(-1);
      expect(workPosition, `${relativePath} test marker must match the page source`).toBeGreaterThan(-1);
      expect(guardPosition, `${relativePath} must authorize before reading or deriving owner data`).toBeLessThan(workPosition);
    }
    for (const relativePath of REMOVED_PAGES) {
      const source = readFileSync(path.join(ROOT, "app", "consultant", ...relativePath.split("/")), "utf8");
      expect(source, relativePath).toContain("notFound();");
      expect(source, relativePath).toContain("if (!(await ownerPageGuard())) return null;");
      expect(source, relativePath).not.toMatch(/VisualStudioPanel|<[^>]+>|getStudioStatus|createStudioProject/);
    }
    for (const relativePath of REDIRECTED_PAGES) {
      const source = readFileSync(path.join(ROOT, "app", "consultant", ...relativePath.split("/")), "utf8");
      expect(source, relativePath).toContain("redirect(");
      expect(source, relativePath).not.toContain("ownerPageGuard");
    }
  });

  it("keeps the removed studio page unavailable without reading any owner data", async () => {
    expect(await RetiredStudioPage()).toBeNull();
    mocks.ownerPageGuard.mockResolvedValue(true);
    await expect(RetiredStudioPage()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    for (const [name, operation] of Object.entries(mocks)) if (name !== "ownerPageGuard") expect(operation).not.toHaveBeenCalled();
    expect(readFileSync(path.join(ROOT, "app", "consultant", "layout.tsx"), "utf8")).not.toContain('href="/consultant/studio"');
  });

  it("does not read program work before owner authorization", async () => {
    expect(await ProgramWorkPage()).toBeNull();
    expect(mocks.listProgramWork).not.toHaveBeenCalled();
  });

  it("does not read ASK records before owner authorization", async () => {
    expect(await AskRecordsPage()).toBeNull();
    expect(mocks.listAskResponseRecords).not.toHaveBeenCalled();
  });

  it("returns a null Practice child before loading the consultation queue", async () => {
    const child = await QueuePage();

    expect(child).toBeNull();
    expect(mocks.queue).not.toHaveBeenCalled();
  });

  it("preserves the Practice layout sign-in screen without rendering the protected child", async () => {
    const tree = await PracticeLayout({ children: createElement("p", null, "PRIVATE PRACTICE CHILD") });
    const html = renderToStaticMarkup(tree);

    expect(html).toContain("Workspace access key");
    expect(html).not.toContain("PRIVATE PRACTICE CHILD");
    expect(mocks.getStore).not.toHaveBeenCalled();
    expect(mocks.generativeStatus).not.toHaveBeenCalled();
    expect(mocks.getPolicy).not.toHaveBeenCalled();
  });

  // The One DSD Team space now lives on the public side of the program: this leaf redirects
  // there outright rather than gating a private child on the owner guard.
  it("redirects the One DSD Team leaf to its public workspace without loading private data", async () => {
    let caught: unknown;
    try {
      await OneDsdTeamPage();
    } catch (error) {
      caught = error;
    }
    expect(caught, "OneDsdTeamPage must redirect rather than return").toBeDefined();
    expect(String((caught as { digest?: unknown } | undefined)?.digest ?? caught)).toContain("/one-dsd/team/workspace");
    expect(mocks.readOneDsdTeamWorkspace).not.toHaveBeenCalled();
    expect(mocks.getMicrosoftBridgeState).not.toHaveBeenCalled();
  });
});
