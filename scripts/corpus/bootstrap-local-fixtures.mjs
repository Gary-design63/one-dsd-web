import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "../..");

function fail(message) {
  throw new Error(message);
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function assertSafeSource(sourceRoot) {
  if (!existsSync(sourceRoot) || !statSync(sourceRoot).isDirectory()) {
    fail(`The fixture source repository does not exist: ${sourceRoot}`);
  }
  if (relative(root, sourceRoot) === "") {
    fail("The fixture source repository must be different from this worktree.");
  }
  const packagePath = resolve(sourceRoot, "package.json");
  if (!existsSync(packagePath)) fail("The fixture source is not a recognizable repository.");
  const packageDocument = JSON.parse(readFileSync(packagePath, "utf8"));
  if (packageDocument.name !== "one-dhs-pac") {
    fail("The fixture source package must be one-dhs-pac.");
  }
}

export function copyExactFile(source, destination) {
  if (!existsSync(source) || !statSync(source).isFile()) fail(`Required fixture is missing: ${source}`);
  if (existsSync(destination)) {
    if (sha256(source) !== sha256(destination)) {
      fail(`Refusing to replace a different local fixture: ${destination}`);
    }
    return "exact_replay";
  }
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { errorOnExist: true, force: false });
  return "copied";
}

function stageInventory(directory) {
  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    fail(`Required fixture stage is not a directory: ${directory}`);
  }
  const files = [];
  function visit(current) {
    const metadata = lstatSync(current);
    if (metadata.isSymbolicLink()) fail(`Fixture stages cannot contain symbolic links: ${current}`);
    if (metadata.isDirectory()) {
      for (const entry of readdirSync(current).sort()) visit(resolve(current, entry));
      return;
    }
    if (!metadata.isFile()) fail(`Fixture stages may contain only regular files: ${current}`);
    files.push({
      path: relative(directory, current).replaceAll("\\", "/"),
      bytes: metadata.size,
      sha256: sha256(current),
    });
  }
  visit(directory);
  if (!files.length) fail(`Required fixture stage is empty: ${directory}`);
  return files;
}

function inventoriesMatch(source, destination) {
  return JSON.stringify(stageInventory(source)) === JSON.stringify(stageInventory(destination));
}

export function copyExactStage(source, destination) {
  const sourceManifest = resolve(source, "manifest.json");
  if (!existsSync(sourceManifest)) fail(`Required frozen-stage manifest is missing: ${sourceManifest}`);
  if (existsSync(destination)) {
    if (!inventoriesMatch(source, destination)) {
      fail(`Refusing to replace a different or incomplete frozen stage: ${destination}`);
    }
    return "exact_replay";
  }
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true, errorOnExist: true, force: false });
  if (!inventoriesMatch(source, destination)) {
    fail(`The copied frozen stage did not verify byte-for-byte: ${destination}`);
  }
  return "copied";
}

function main() {
  const from = option("--from");
  if (!from) {
    fail("Use --from <trusted-source-repository>. The source is read-only and copied only into ignored fixture paths.");
  }

  const sourceRoot = resolve(from);
  assertSafeSource(sourceRoot);

  const actions = [];
  actions.push({
    fixture: "local-resolver",
    action: copyExactFile(
      resolve(sourceRoot, "data/source-ledger/local-resolver.local.json"),
      resolve(root, "data/source-ledger/local-resolver.local.json"),
    ),
  });

  for (const stage of ["pac-corpus-import-2026-09-04", "pac-canonical-projection-2026-09-05"]) {
    actions.push({
      fixture: stage,
      action: copyExactStage(
        resolve(sourceRoot, ".pac-import-staging", stage),
        resolve(root, ".pac-import-staging", stage),
      ),
    });
  }

  console.log(JSON.stringify({
    ok: true,
    sourceReadOnly: true,
    destinationIgnored: true,
    actions,
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
