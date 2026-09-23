import { promises as fs } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { createStudioService, localExecutionAllowed, discoverBlender, runBlenderRender, trustedRenderArguments } from "@/lib/visual-studio/server";
import { StudioBriefSchema } from "@/lib/visual-studio/contract";
vi.mock("node:child_process", () => ({ spawn: vi.fn(), execFile: vi.fn() }));
import { spawn, execFile } from "node:child_process";
const brief = { title: "Observe the meeting", learningObjective: "Separate observation from interpretation.", setting: "meeting" as const, dialogue: [] };
afterEach(() => vi.restoreAllMocks());
it.each([
  [{ NODE_ENV: "development" }, "win32"], [{ NODE_ENV: "test", PAC_VISUAL_STUDIO_LOCAL: "1" }, "win32"],
  [{ NODE_ENV: "production", PAC_VISUAL_STUDIO_LOCAL: "1" }, "win32"], [{ VERCEL: "1", PAC_VISUAL_STUDIO_LOCAL: "1" }, "win32"],
  [{ NODE_ENV: "development", PAC_BLENDER_PATH: "C:/anything/blender.exe" }, "win32"], [{ NODE_ENV: "development" }, "linux"],
])("cannot restore execution with platform or historical flags: %j", async (environment, platform) => {
  expect(localExecutionAllowed(environment, platform)).toBe(false);
  const findExecutable = vi.fn(), render = vi.fn(), openEditor = vi.fn(), readVersion = vi.fn();
  const realpath = vi.spyOn(fs, "realpath"), readdir = vi.spyOn(fs, "readdir"), writeFile = vi.spyOn(fs, "writeFile");
  const service = createStudioService({ environment, platform, workspaceRoot: "Z:/never-touch", findExecutable, render, openEditor, readVersion });
  expect(await service.getStudioStatus()).toMatchObject({ available: false, busy: false });
  for (const operation of [() => service.createStudioProject(brief), () => service.launchStudio(), () => service.openStudioProject("../../outside"), () => service.getStudioAsset("../../outside", "project"), () => service.listStudioProjects(), () => service.appendStudioAudit({} as never)]) {
    await expect(operation()).rejects.toMatchObject({ code: "integration_removed", status: 410 });
  }
  expect(await discoverBlender(environment)).toBeUndefined();
  await expect(runBlenderRender({ executable: "C:/anything/blender.exe", args: ["--python-expr", "arbitrary"], cwd: "Z:/never-touch", environment, timeoutMs: 1 })).rejects.toMatchObject({ code: "integration_removed", status: 410 });
  for (const operation of [findExecutable, render, openEditor, readVersion, realpath, readdir, writeFile, spawn, execFile]) expect(operation).not.toHaveBeenCalled();
});
it("preserves bounded historical brief validation", () => {
  expect(StudioBriefSchema.safeParse(brief).success).toBe(true);
  for (const invalid of [{ ...brief, script: "import os" }, { ...brief, setting: "../../outside" }, { ...brief, title: "bad\u0000title" }, { ...brief, dialogue: Array(7).fill({ participant: "a", text: "b" }) }]) expect(StudioBriefSchema.safeParse(invalid).success).toBe(false);
});
it("retains the historical pure argument construction without allowing execution", () => {
  const args = trustedRenderArguments("script.py", "brief.json", "scene.blend", "preview.png");
  expect(args).toContain("--disable-autoexec");
  expect(args).toContain("--factory-startup");
  expect(args.slice(-4)).toEqual(["--", "brief.json", "scene.blend", "preview.png"]);
});
