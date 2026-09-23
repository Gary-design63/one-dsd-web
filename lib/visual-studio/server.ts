import { randomUUID, createHash } from "node:crypto";
import { spawn, execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  StudioActorSchema, StudioBriefSchema, StudioIdSchema, StudioProjectSchema,
  type StudioActor, type StudioAsset, type StudioAssetKind, type StudioBrief,
  type StudioFailure, type StudioProject, type StudioStatus,
} from "./contract";

export class StudioError extends Error {
  constructor(public readonly code: string, message: string, public readonly status = 400) {
    super(message); this.name = "StudioError";
  }
}
type Environment = Record<string, string | undefined>;
export function localExecutionAllowed(environment: Environment, platform: string): boolean {
  // Owner direction excludes this integration in every environment. Historical
  // local-mode flags cannot restore it; retained files remain recoverable.
  void environment; void platform;
  return false;
}
function localFailure(): StudioError {
  return new StudioError("integration_removed", "This authoring integration has been removed from the program.", 410);
}
function safeFailure(error: unknown): StudioFailure {
  if (error instanceof StudioError) return { code: error.code, message: error.message };
  return { code: "render_failed", message: "The scene could not be rendered. Its project record is available; you can create a new attempt." };
}
function childEnvironment(environment: Environment): NodeJS.ProcessEnv {
  const allowed = new Set(["systemroot", "windir", "systemdrive", "temp", "tmp", "userprofile", "appdata", "localappdata", "programfiles", "programfiles(x86)", "path"]);
  return { NODE_ENV: environment.NODE_ENV === "production" ? "production" : environment.NODE_ENV === "test" ? "test" : "development", ...Object.fromEntries(Object.entries(environment).filter(([key, value]) => value !== undefined && allowed.has(key.toLowerCase()))) };
}
export async function discoverBlender(environment: Environment = process.env): Promise<string | undefined> {
  if (!localExecutionAllowed(environment, process.platform)) return undefined;
  const candidates: string[] = [];
  if (environment.PAC_BLENDER_PATH) candidates.push(environment.PAC_BLENDER_PATH);
  const foundation = path.join(environment.ProgramFiles ?? environment.PROGRAMFILES ?? "C:\\Program Files", "Blender Foundation");
  candidates.push(path.join(foundation, "Blender 5.2", "blender.exe"));
  try {
    const folders = (await fs.readdir(foundation, { withFileTypes: true }))
      .filter(entry => entry.isDirectory() && /^Blender [0-9]/.test(entry.name)).sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
    candidates.push(...folders.map(entry => path.join(foundation, entry.name, "blender.exe")));
  } catch { /* An unavailable install directory is reported as unavailable. */ }
  for (const candidate of candidates) {
    if (!path.isAbsolute(candidate) || path.basename(candidate).toLowerCase() !== "blender.exe") continue;
    try {
      const resolved = await fs.realpath(candidate);
      if (path.basename(resolved).toLowerCase() === "blender.exe" && (await fs.stat(resolved)).isFile()) return resolved;
    } catch { /* Continue to known installations without exposing local paths. */ }
  }
  return undefined;
}

export function trustedRenderArguments(script: string, brief: string, project: string, preview: string): string[] {
  return ["--background", "--factory-startup", "--disable-autoexec", "--threads", "2", "--python-exit-code", "9",
    "--python", script, "--", brief, project, preview];
}
export type RenderInvocation = { executable: string; args: string[]; cwd: string; environment: Environment; timeoutMs: number };
export function runBlenderRender(invocation: RenderInvocation): Promise<void> {
  if (!localExecutionAllowed(invocation.environment, process.platform)) return Promise.reject(localFailure());
  return new Promise((resolve, reject) => {
    const child = spawn(invocation.executable, invocation.args, {
      cwd: invocation.cwd, env: childEnvironment(invocation.environment), shell: false,
      windowsHide: true, stdio: "ignore",
    });
    let settled = false;
    let timedOut = false;
    let killGuard: ReturnType<typeof setTimeout> | undefined;
    const finish = (error?: StudioError) => {
      if (settled) return;
      settled = true; clearTimeout(timer); if (killGuard) clearTimeout(killGuard);
      if (error) reject(error); else resolve();
    };
    const timer = setTimeout(() => {
      timedOut = true;
      const timeoutError = new StudioError("render_timeout", "The render exceeded its time limit. Create a new attempt or use Blender to continue editing.", 504);
      if (process.platform === "win32" && child.pid) {
        const taskkill = path.join(invocation.environment.SystemRoot ?? invocation.environment.SYSTEMROOT ?? "C:\\Windows", "System32", "taskkill.exe");
        execFile(taskkill, ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, shell: false, timeout: 5000 }, () => {
          if (!settled) { try { child.kill(); } catch { /* Process may have exited. */ } }
        });
      } else { try { child.kill("SIGKILL"); } catch { /* Process may have exited. */ } }
      // Do not start another render if the child failed to confirm termination.
      killGuard = setTimeout(() => finish(new StudioError("termination_unconfirmed", "Blender could not be confirmed stopped. The studio is paused for local recovery before another render.", 503)), 6500);
      child.once("close", () => finish(timeoutError));
    }, invocation.timeoutMs);
    child.once("error", () => finish(new StudioError("renderer_start_failed", "Blender could not start. Check its local installation and create a new attempt.", 503)));
    child.once("close", code => finish(timedOut
      ? new StudioError("render_timeout", "The render exceeded its time limit. Create a new attempt or use Blender to continue editing.", 504)
      : code === 0 ? undefined : new StudioError("render_failed", "Blender did not complete the render. Its project record is available; you can create a new attempt.", 500)));
  });
}
function launchBlender(executable: string, project: string | undefined, environment: Environment): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, project ? ["--disable-autoexec", project] : [], {
      shell: false, windowsHide: false, detached: true, stdio: "ignore", env: childEnvironment(environment),
    });
    child.once("error", () => reject(new StudioError("editor_start_failed", "The Blender editor could not be opened.", 503)));
    child.once("spawn", () => { child.unref(); resolve(); });
  });
}
type ServiceOptions = {
  workspaceRoot?: string; environment?: Environment; platform?: string;
  findExecutable?: () => Promise<string | undefined>;
  render?: (invocation: RenderInvocation) => Promise<void>;
  openEditor?: (executable: string, project: string | undefined, environment: Environment) => Promise<void>;
  readVersion?: (executable: string) => Promise<string | undefined>;
};
const ASSET_FILES = {
  preview: { name: "preview.png", contentType: "image/png" },
  project: { name: "scene.blend", contentType: "application/octet-stream" },
  receipt: { name: "receipt.json", contentType: "application/json" },
} as const;

/** Options are trusted application/test dependencies, never request fields. */
export function createStudioService(options: ServiceOptions = {}) {
  const root = path.resolve(options.workspaceRoot ?? process.cwd());
  const environment = options.environment ?? process.env;
  const platform = options.platform ?? process.platform;
  const findExecutable = options.findExecutable ?? (() => discoverBlender(environment));
  const render = options.render ?? runBlenderRender;
  const openEditor = options.openEditor ?? launchBlender;
  const readVersion = options.readVersion ?? ((executable: string) => new Promise<string | undefined>(resolve => {
    execFile(executable, ["--version"], { windowsHide: true, shell: false, timeout: 5000, maxBuffer: 8192, env: childEnvironment(environment) },
      (error, stdout) => resolve(error ? undefined : /^Blender ([0-9]+\.[0-9]+(?:\.[0-9]+)?)/m.exec(stdout)?.[1]));
  }));
  let versionCache: string | undefined;
  function assertLocal() { if (!localExecutionAllowed(environment, platform)) throw localFailure(); }
  const key = (value: string) => platform === "win32" ? value.toLowerCase() : value;
  async function storageDirectory(create = true): Promise<string> {
    const canonicalRoot = await fs.realpath(root);
    let directory = canonicalRoot;
    for (const name of [".data", "visual-studio"]) {
      directory = path.join(directory, name);
      if (create) { try { await fs.mkdir(directory); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error; } }
      const entry = await fs.lstat(directory);
      if (!entry.isDirectory() || entry.isSymbolicLink() || key(await fs.realpath(directory)) !== key(directory))
        throw new StudioError("unsafe_storage", "The studio storage location needs local repair.", 503);
    }
    return directory;
  }
  async function projectDirectory(id: string, create = false): Promise<string> {
    if (!StudioIdSchema.safeParse(id).success) throw new StudioError("invalid_project", "Choose a valid studio project.", 400);
    const directory = path.join(await storageDirectory(), id);
    if (create) await fs.mkdir(directory); // Exclusive: a new project can never replace another scene.
    let entry;
    try { entry = await fs.lstat(directory); }
    catch { throw new StudioError("project_not_found", "This studio project was not found.", 404); }
    if (!entry.isDirectory() || entry.isSymbolicLink() || key(await fs.realpath(directory)) !== key(directory))
      throw new StudioError("unsafe_storage", "The studio project location needs local repair.", 503);
    return directory;
  }
  async function checkedFile(directory: string, fileName: string): Promise<string> {
    const target = path.join(directory, fileName);
    let entry;
    try { entry = await fs.lstat(target); }
    catch { throw new StudioError("asset_not_found", "This studio file is not available.", 404); }
    if (!entry.isFile() || entry.isSymbolicLink() || key(await fs.realpath(target)) !== key(target))
      throw new StudioError("unsafe_storage", "The studio file location needs local repair.", 503);
    return target;
  }
  async function writeJson(directory: string, name: string, value: unknown) {
    try { await checkedFile(directory, name); }
    catch (error) { if (!(error instanceof StudioError) || error.code !== "asset_not_found") throw error; }
    const temporary = path.join(directory, "." + randomUUID() + ".tmp");
    await fs.writeFile(temporary, JSON.stringify(value, null, 2), { flag: "wx", encoding: "utf8" });
    try { await fs.rename(temporary, path.join(directory, name)); }
    finally { await fs.unlink(temporary).catch(() => undefined); }
  }
  async function saveProject(directory: string, project: StudioProject) {
    const valid = StudioProjectSchema.parse(project);
    await writeJson(directory, "receipt.json", valid.receipt);
    await writeJson(directory, "manifest.json", valid);
  }
  async function readProject(id: string): Promise<StudioProject> {
    const file = await checkedFile(await projectDirectory(id), "manifest.json");
    if ((await fs.stat(file)).size > 100_000) throw new StudioError("invalid_record", "This project record needs local repair.", 503);
    try {
      const record = StudioProjectSchema.parse(JSON.parse(await fs.readFile(file, "utf8")));
      if (record.id !== id || record.receipt.projectId !== id) throw new Error("Project mismatch");
      return record;
    } catch { throw new StudioError("invalid_record", "This project record needs local repair.", 503); }
  }
  async function lockInfo(directory: string): Promise<{ pid: number; token: string } | undefined> {
    try {
      const lock = await checkedFile(directory, ".render-lock");
      const value: unknown = JSON.parse(await fs.readFile(lock, "utf8"));
      if (!value || typeof value !== "object") throw new Error("Invalid lock");
      const record = value as { pid?: unknown; token?: unknown };
      if (!Number.isInteger(record.pid) || Number(record.pid) <= 0 || typeof record.token !== "string") throw new Error("Invalid lock");
      return { pid: Number(record.pid), token: record.token };
    } catch (error) {
      if (error instanceof StudioError && error.code === "asset_not_found") return undefined;
      throw new StudioError("studio_busy", "A previous render needs local attention before another can start.", 409);
    }
  }
  async function acquireLock(directory: string) {
    const token = randomUUID();
    const target = path.join(directory, ".render-lock");
    try { await fs.writeFile(target, JSON.stringify({ pid: process.pid, token }), { flag: "wx", encoding: "utf8" }); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new StudioError("studio_busy", "A scene is already rendering. Wait for it to finish before creating another.", 409);
      throw error;
    }
    return async () => {
      if ((await lockInfo(directory))?.token === token) await fs.unlink(target);
    };
  }
  async function getStudioStatus(): Promise<StudioStatus> {
    if (!localExecutionAllowed(environment, platform)) return { available: false, localOnly: true, reason: localFailure().message, busy: false };
    let busy = false;
    try {
      let storage: string | undefined;
      try { storage = await storageDirectory(false); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
      if (storage) busy = !!(await lockInfo(storage));
      const executable = await findExecutable();
      if (executable && !versionCache) versionCache = await readVersion(executable);
      return { available: !!executable, localOnly: true, busy, blenderVersion: versionCache,
        reason: executable ? (busy ? "A scene is rendering or needs local attention." : "Blender is available on this Windows computer.") : "Blender was not found on this Windows computer." };
    } catch { return { available: false, localOnly: true, busy, reason: "The local studio needs attention before it can be used." }; }
  }
  async function listStudioProjects(): Promise<StudioProject[]> {
    assertLocal();
    let directory: string;
    try { directory = await storageDirectory(false); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const projects: StudioProject[] = [];
    for (const entry of entries.filter(item => item.isDirectory() && StudioIdSchema.safeParse(item.name).success)) {
      projects.push(await readProject(entry.name));
    }
    return projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async function outputReceipt(directory: string, kind: "preview" | "project") {
    const file = await checkedFile(directory, ASSET_FILES[kind].name);
    const size = (await fs.stat(file)).size;
    if (size < 8 || size > (kind === "preview" ? 10_000_000 : 150_000_000)) throw new StudioError("invalid_output", "Blender did not produce a usable studio file.", 500);
    const bytes = await fs.readFile(file);
    const valid = kind === "preview" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : bytes.subarray(0, 7).toString() === "BLENDER";
    if (!valid) throw new StudioError("invalid_output", "Blender did not produce a usable studio file.", 500);
    return { kind, fileName: ASSET_FILES[kind].name, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
  }
  async function createStudioProject(input: StudioBrief, actor: StudioActor = "owner"): Promise<StudioProject> {
    assertLocal();
    const parsed = StudioBriefSchema.safeParse(input);
    if (!parsed.success || !StudioActorSchema.safeParse(actor).success) throw new StudioError("invalid_brief", "Add a title, learning objective, setting and up to six short dialogue lines.", 422);
    const storage = await storageDirectory();
    const releaseLock = await acquireLock(storage);
    let keepLock = false;
    const id = randomUUID(), now = new Date().toISOString();
    let project: StudioProject = { id, title: parsed.data.title, brief: parsed.data, actor, status: "rendering",
      createdAt: now, updatedAt: now, previewAvailable: false, projectAvailable: false,
      receipt: { id: randomUUID(), projectId: id, actor, status: "rendering", renderer: "Blender", startedAt: now, outputs: [] } };
    try {
      const directory = await projectDirectory(id, true);
      await saveProject(directory, project);
      try {
        const executable = await findExecutable();
        if (!executable) throw new StudioError("blender_missing", "Blender was not found on this Windows computer.", 503);
        const script = await fs.realpath(path.join(root, "scripts", "visual-studio", "render_scene.py"));
        const expected = path.join(await fs.realpath(root), "scripts", "visual-studio", "render_scene.py");
        if (key(script) !== key(expected)) throw new StudioError("unsafe_renderer", "The studio renderer needs local repair.", 503);
        await writeJson(directory, "brief.json", parsed.data);
        await render({ executable, args: trustedRenderArguments(script, path.join(directory, "brief.json"), path.join(directory, "scene.blend"), path.join(directory, "preview.png")),
          cwd: directory, environment, timeoutMs: 75_000 });
        const outputs = [await outputReceipt(directory, "project"), await outputReceipt(directory, "preview")];
        const finishedAt = new Date().toISOString();
        project = { ...project, status: "ready", updatedAt: finishedAt, previewAvailable: true, projectAvailable: true,
          receipt: { ...project.receipt, status: "ready", finishedAt, outputs } };
      } catch (error) {
        keepLock = error instanceof StudioError && error.code === "termination_unconfirmed";
        const failure = safeFailure(error), finishedAt = new Date().toISOString();
        // Preserve a successfully saved editable scene even if rendering later failed.
        const outputs: StudioProject["receipt"]["outputs"] = [];
        try { outputs.push(await outputReceipt(directory, "project")); } catch { /* No complete source file. */ }
        project = { ...project, status: "failed", updatedAt: finishedAt, failure, projectAvailable: outputs.length > 0,
          receipt: { ...project.receipt, status: "failed", finishedAt, outputs, failure } };
      }
      await saveProject(directory, project);
      return project;
    } finally { if (!keepLock) await releaseLock(); }
  }
  async function getStudioAsset(id: string, kind: StudioAssetKind): Promise<StudioAsset> {
    assertLocal();
    if (!Object.hasOwn(ASSET_FILES, kind)) throw new StudioError("invalid_asset", "Choose a valid studio file.", 400);
    const project = await readProject(id);
    if (kind === "preview" && !project.previewAvailable || kind === "project" && !project.projectAvailable)
      throw new StudioError("asset_not_found", "This studio file is not available.", 404);
    const asset = ASSET_FILES[kind];
    return { path: await checkedFile(await projectDirectory(id), asset.name), contentType: asset.contentType,
      fileName: id + "-" + asset.name };
  }
  async function openStudioProject(id: string): Promise<StudioProject> {
    assertLocal();
    const project = await readProject(id);
    const asset = await getStudioAsset(id, "project");
    const executable = await findExecutable();
    if (!executable) throw new StudioError("blender_missing", "Blender was not found on this Windows computer.", 503);
    const directory = await projectDirectory(id);
    const receipt = { id: randomUUID(), projectId: id, action: "open_editor", startedAt: new Date().toISOString(), status: "starting" as string };
    const name = "open-" + receipt.id + ".json";
    await writeJson(directory, name, receipt);
    try {
      await openEditor(executable, asset.path, environment);
      await writeJson(directory, name, { ...receipt, status: "opened", finishedAt: new Date().toISOString() });
      return project;
    } catch (error) {
      await writeJson(directory, name, { ...receipt, status: "failed", finishedAt: new Date().toISOString(), failure: safeFailure(error) });
      throw new StudioError("editor_start_failed", "The Blender editor could not be opened.", 503);
    }
  }
  async function launchStudio(): Promise<{ opened: true }> {
    assertLocal();
    const executable = await findExecutable();
    if (!executable) throw new StudioError("blender_missing", "Blender was not found on this Windows computer.", 503);
    const directory = await storageDirectory();
    const receipt = { id: randomUUID(), action: "launch_editor", startedAt: new Date().toISOString(), status: "starting" as string };
    const name = "launch-" + receipt.id + ".json";
    await writeJson(directory, name, receipt);
    try {
      await openEditor(executable, undefined, environment);
      await writeJson(directory, name, { ...receipt, status: "opened", finishedAt: new Date().toISOString() });
      return { opened: true };
    } catch (error) {
      await writeJson(directory, name, { ...receipt, status: "failed", finishedAt: new Date().toISOString(), failure: safeFailure(error) });
      throw new StudioError("editor_start_failed", "The Blender editor could not be opened.", 503);
    }
  }
  async function appendStudioAudit(event: import("../intelligence/types").AuditEvent): Promise<void> {
    assertLocal();
    const { assertAuditEventPersistence } = await import("../trust/work-object-contract");
    assertAuditEventPersistence(event);
    if (event.tool_name !== "studio.scene_create") throw new StudioError("invalid_audit", "This audit record does not belong to Visual Studio.", 400);
    const projectIds = event.content_ids_touched.map(id => id.startsWith("asset-studio-") ? id.slice("asset-studio-".length) : "");
    if (projectIds.length > 1 || projectIds.some(id => !StudioIdSchema.safeParse(id).success))
      throw new StudioError("invalid_audit", "This audit record contains an invalid studio project reference.", 400);
    const directory = await storageDirectory();
    const name = "audit-" + event.trace_id + "-" + event.span_id + ".json";
    const recordedAt = new Date().toISOString();
    try {
      // Exclusive create preserves the real tool name and prevents receipt rewriting.
      await fs.writeFile(path.join(directory, name), JSON.stringify(event, null, 2), { flag: "wx", encoding: "utf8", flush: true });
      for (const id of projectIds) {
        const project = await readProject(id);
        const toolAudit = { traceId: event.trace_id, spanId: event.span_id, recordedAt,
          toolName: "studio.scene_create" as const, ok: event.ok, dryRun: event.dry_run, receiptName: name };
        await saveProject(await projectDirectory(id), { ...project, receipt: { ...project.receipt, toolAudit } });
      }
    } catch {
      throw new StudioError("audit_write_failed", "The scene files may already be saved, but the Chief of Staff audit record could not be confirmed. Refresh the project list before trying again.", 503);
    }
  }

  return { getStudioStatus, listStudioProjects, createStudioProject, openStudioProject, getStudioAsset, launchStudio, appendStudioAudit };
}
const studio = createStudioService();
export const { getStudioStatus, listStudioProjects, createStudioProject, openStudioProject, getStudioAsset, launchStudio, appendStudioAudit } = studio;
