import { NextRequest } from "next/server";
import { afterEach, expect, it, vi } from "vitest";
import { handleStudioGet, handleStudioPost, handleStudioAssetGet, isLocalStudioRequest } from "@/app/api/consultant/studio/handlers";
const backend = vi.hoisted(() => ({ discoverBlender: vi.fn(), createStudioProject: vi.fn(), getStudioAsset: vi.fn(), getStudioStatus: vi.fn(), launchStudio: vi.fn(), listStudioProjects: vi.fn(), openStudioProject: vi.fn() }));
vi.mock("@/lib/visual-studio/server", () => backend);
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
it.each([
  ["http://localhost:3115", ""], ["http://127.0.0.1:3115", "pac_owner=invalid"],
  ["https://one-dhs-pac.vercel.app", "pac_owner=former-session"], ["http://attacker.example", "pac_owner=invalid"],
])("removes every legacy action without body reads or backend calls: %s", async (origin, cookie) => {
  vi.stubEnv("PAC_VISUAL_STUDIO_LOCAL", "1");
  const request = new NextRequest(origin + "/api/consultant/studio", { method: "POST", headers: { origin, cookie, "x-forwarded-host": "localhost:3115" }, body: JSON.stringify({ action: "create", actor: "owner", script: "import os", path: "../../arbitrary.blend" }) });
  const read = vi.spyOn(request, "json");
  expect(isLocalStudioRequest(request)).toBe(false);
  for (const response of [await handleStudioGet(request), await handleStudioPost(request), await handleStudioAssetGet(request, "../../secret", "project")]) {
    expect(response.status).toBe(410);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ error: "This authoring integration has been removed from the program." });
  }
  expect(read).not.toHaveBeenCalled();
  for (const operation of Object.values(backend)) expect(operation).not.toHaveBeenCalled();
});
it.each(["{", "x".repeat(17000), JSON.stringify({ action: "launch" }), JSON.stringify({ action: "open", id: "../../../outside" })])("rejects malformed, oversized, launch and traversal requests before execution", async body => {
  const request = new NextRequest("http://localhost:3115/api/consultant/studio", { method: "POST", body });
  expect((await handleStudioPost(request)).status).toBe(410);
  for (const operation of Object.values(backend)) expect(operation).not.toHaveBeenCalled();
});
