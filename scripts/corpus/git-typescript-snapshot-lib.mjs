import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { createRequire } from "node:module";

import ts from "typescript";

import { REPOSITORY_ROOT } from "./shadow-import-lib.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: REPOSITORY_ROOT,
    encoding: options.encoding ?? "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
}

export function resolveGitCommit(commit) {
  assert(/^[0-9a-fA-F]{7,40}$/.test(String(commit ?? "")), `Invalid Git commit ${commit}.`);
  return git(["rev-parse", `${commit}^{commit}`]).trim();
}

export function readGitFile(commit, path) {
  const resolvedCommit = resolveGitCommit(commit);
  assert(path && !path.startsWith("/") && !path.includes(".."), `Unsafe Git path ${path}.`);
  return git(["show", `${resolvedCommit}:${path}`], { encoding: "buffer" });
}

export function listGitFiles(commit, roots) {
  const resolvedCommit = resolveGitCommit(commit);
  const safeRoots = roots.map((root) => {
    assert(root && !root.startsWith("/") && !root.includes(".."), `Unsafe Git root ${root}.`);
    return root.replaceAll("\\", "/").replace(/\/$/, "");
  });
  const output = git(["ls-tree", "-r", "--name-only", resolvedCommit, "--", ...safeRoots]);
  return output.split(/\r?\n/).filter(Boolean).sort();
}

function outputPathForSource(path) {
  return /\.tsx?$/.test(path) ? path.replace(/\.tsx?$/, ".js") : path;
}

function compileTypescript(source, fileName) {
  const sourceDirectory = dirname(fileName).replaceAll("\\", "/");
  const rewrittenSource = source.replace(/(["'])@\/([^"']+)\1/g, (_match, quote, aliasedPath) => {
    let path = relative(sourceDirectory, `src/${aliasedPath}`).replaceAll("\\", "/");
    if (!path.startsWith(".")) path = `./${path}`;
    return `${quote}${path}${quote}`;
  });
  const result = ts.transpileModule(rewrittenSource, {
    compilerOptions: {
      esModuleInterop: true,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      resolveJsonModule: true,
      target: ts.ScriptTarget.ES2022,
    },
    fileName,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  assert(
    errors.length === 0,
    `Cannot transpile ${fileName}: ${errors
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, " "))
      .join("; ")}`,
  );
  return result.outputText;
}

/**
 * Load a data-only TypeScript module directly from a pinned Git tree without
 * checking it out or changing the active worktree. The temporary directory is
 * created by mkdtemp and removed only after its absolute path is verified.
 */
export function loadPinnedGitTypescriptModules({ commit, entryPaths, roots }) {
  const resolvedCommit = resolveGitCommit(commit);
  const normalizedEntries = entryPaths.map((entryPath) => entryPath.replaceAll("\\", "/"));
  const files = listGitFiles(resolvedCommit, roots);
  for (const normalizedEntry of normalizedEntries) {
    assert(files.includes(normalizedEntry), `Pinned Git entry is missing: ${normalizedEntry}.`);
  }

  const prefix = resolve(tmpdir(), "one-dhs-pac-git-snapshot-");
  const temporaryRoot = mkdtempSync(prefix);
  assert(
    resolve(temporaryRoot).startsWith(`${resolve(tmpdir())}${sep}`),
    `Refusing to use an unverified temporary directory: ${temporaryRoot}.`,
  );

  try {
    for (const path of files) {
      const extension = extname(path).toLowerCase();
      if (![".ts", ".tsx", ".js", ".cjs", ".json"].includes(extension)) continue;
      const targetPath = resolve(temporaryRoot, outputPathForSource(path));
      const fromTemporaryRoot = relative(temporaryRoot, targetPath);
      assert(
        fromTemporaryRoot !== ".." && !fromTemporaryRoot.startsWith(`..${sep}`),
        `Git path escaped the temporary directory: ${path}.`,
      );
      mkdirSync(dirname(targetPath), { recursive: true });
      const contents = readGitFile(resolvedCommit, path);
      if (extension === ".ts" || extension === ".tsx") {
        writeFileSync(targetPath, compileTypescript(contents.toString("utf8"), path), "utf8");
      } else {
        writeFileSync(targetPath, contents);
      }
    }

    const require = createRequire(import.meta.url);
    return Object.fromEntries(
      normalizedEntries.map((normalizedEntry) => {
        const entry = resolve(temporaryRoot, outputPathForSource(normalizedEntry));
        return [normalizedEntry, require(entry)];
      }),
    );
  } finally {
    const verified = resolve(temporaryRoot);
    assert(
      verified.startsWith(`${resolve(tmpdir())}${sep}`) && verified.includes("one-dhs-pac-git-snapshot-"),
      `Refusing to remove an unverified temporary directory: ${verified}.`,
    );
    rmSync(verified, { recursive: true, force: true });
  }
}

export function loadPinnedGitTypescriptModule({ commit, entryPath, roots }) {
  return loadPinnedGitTypescriptModules({ commit, entryPaths: [entryPath], roots })[entryPath.replaceAll("\\", "/")];
}

export function readPinnedGitJson(commit, path) {
  try {
    return JSON.parse(readGitFile(commit, path).toString("utf8"));
  } catch (error) {
    throw new Error(`Cannot read pinned Git JSON ${commit}:${path}: ${error.message}`);
  }
}

export function readLocalJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}
