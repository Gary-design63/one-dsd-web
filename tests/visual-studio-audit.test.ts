import { beforeEach, expect, it, vi } from "vitest";
import { TOOL_CATALOG } from "@/lib/intelligence/tools/catalog";
import { AGENTS } from "@/lib/intelligence/registry/agents";
import { runTool } from "@/lib/intelligence/tools/runtime";
import { contextFor } from "@/lib/intelligence/orchestrator";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { authorVisualStudioScene } from "@/lib/intelligence/agents/visual-studio";
beforeEach(() => resetStoreForTests());
it("has no active studio registration or agent allowlist", () => {
  expect(TOOL_CATALOG.some(tool => tool.tool_name === "studio.scene_create" || tool.family === "visual_studio")).toBe(false);
  expect(AGENTS.some(agent => agent.tools_allowlist.includes("studio.scene_create"))).toBe(false);
});
it.each([ ["program_orchestrator", "owner", false], ["program_orchestrator", "staff", false], ["ask_concierge", "owner", false], ["program_orchestrator", "owner", true] ] as const)("rejects legacy calls before execution and records bounded denial: %s %s %s", async (agent, role, dry_run) => {
  const context = contextFor(agent, role, { dry_run }), execute = vi.fn();
  await expect(runTool(context, "studio.scene_create", execute)).rejects.toMatchObject({ reason: "tool not registered" });
  expect(execute).not.toHaveBeenCalled();
  const audit = await getStore().listAudit();
  expect(audit).toHaveLength(1);
  expect(audit[0]).toMatchObject({ ok: false, tool_name: "runtime.unknown_tool_refusal", error_code: "tool_unknown" });
  await expect(authorVisualStudioScene({ title: "A test", learningObjective: "Observe the process.", setting: "meeting", dialogue: [] }, context)).rejects.toMatchObject({ code: "integration_removed", status: 410 });
});
