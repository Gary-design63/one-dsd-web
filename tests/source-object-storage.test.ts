import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { ensureStoredObject } from "../scripts/corpus/load-source-objects.mjs";
import { buildSourceObjectStage, safeOperationalError } from "../scripts/corpus/source-object-stage-lib.mjs";
import { localSourceObjectsIt, requireLocalSourceObjects } from "./helpers/local-corpus-fixtures";

const root = path.resolve(import.meta.dirname, "..");
const testRoot = path.resolve(root, ".pac-object-staging/vitest-source-objects");
const firstStage = path.resolve(testRoot, "first");
const secondStage = path.resolve(testRoot, "second");

function runJson(script: string, args: string[]) {
  const output = execFileSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  return JSON.parse(output);
}

function sha256(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex").toUpperCase();
}

afterAll(() => {
  rmSync(testRoot, { recursive: true, force: true });
});

describe("private source-object accounting", () => {
  localSourceObjectsIt("accounts for all carriers, all 34 snapshots, and every unavailable original", () => {
    requireLocalSourceObjects();
    const result = runJson("scripts/corpus/build-source-objects.mjs", ["--check"]);
    expect(result).toMatchObject({
      ok: true,
      mode: "check",
      counts: {
        sourceCarriers: 44,
        carriersWithStorage: 38,
        carriersWithoutStorage: 6,
        storedRepresentations: 60,
        uniqueObjects: 60,
        originals: 24,
        derivedSnapshots: 34,
        repositorySources: 2,
        holds: 24,
        missingOriginalHolds: 3,
        externalOnlyHolds: 4,
        directoryManifestHolds: 2,
        originalUnavailableHolds: 12,
        manualExtractionHolds: 1,
        transcriptRequiredHolds: 1,
        quarantinedNeverExecuteHolds: 1,
        staffPublicationDecisions: 0,
      },
    });
    const stage = buildSourceObjectStage();
    // Original carriers/snapshots stay fixed; the two repository sources evolve.
    const repositorySources = stage.objects.filter(object => object.representation_kind === "repository_source");
    expect(repositorySources.map(object => object.local_locator.path).sort()).toEqual([
      "data/import-manifests/legacy-built-ins-2026-09-04.json",
      "lib/content/corpus.ts",
    ]);
    const retainedObjects = stage.objects.filter(object => object.representation_kind !== "repository_source");
    expect(retainedObjects).toHaveLength(58);
    const retainedBytes = retainedObjects.reduce((sum, object) => sum + object.byte_count, 0);
    expect(retainedBytes).toBe(46_556_925);
    let repositoryBytes = 0;
    for (const object of repositorySources) {
      const bytes = readFileSync(path.resolve(root, object.local_locator.path));
      expect(object.byte_count).toBe(bytes.byteLength);
      expect(object.sha256).toBe(sha256(bytes));
      repositoryBytes += bytes.byteLength;
    }
    expect(result.counts.totalBytes).toBe(retainedBytes + repositoryBytes);
    expect(result.safety.htmlHandling).toBe("hash_and_store_bytes_only_never_execute");
  }, 30_000);

  localSourceObjectsIt("writes a deterministic stage without absolute local paths", () => {
    requireLocalSourceObjects();
    runJson("scripts/corpus/build-source-objects.mjs", ["--write", "--out", firstStage]);
    runJson("scripts/corpus/build-source-objects.mjs", ["--write", "--out", secondStage]);
    const first = JSON.parse(readFileSync(path.resolve(firstStage, "manifest.json"), "utf8"));
    const second = JSON.parse(readFileSync(path.resolve(secondStage, "manifest.json"), "utf8"));
    expect(first.stageSetSha256).toBe(second.stageSetSha256);
    expect(first.files).toEqual(second.files);
    const stagedObjects = readFileSync(path.resolve(firstStage, "objects.jsonl"), "utf8");
    expect(stagedObjects).not.toMatch(/[A-Za-z]:\\\\/);
    expect(stagedObjects).toMatch(/source-carriers\/sha256\/[0-9a-f]{2}\/[0-9a-f]{64}\//);

    const validation = runJson("scripts/corpus/load-source-objects.mjs", ["--stage", firstStage]);
    expect(validation).toMatchObject({
      ok: true,
      mode: "validated_only",
      databaseChanged: false,
      objectStorageChanged: false,
      staffPublicationDecisions: 0,
    });
  }, 30_000);

  it("accepts only byte-identical object replay and verifies new uploads by download", async () => {
    const bytes = Buffer.from("verified source bytes", "utf8");
    const object = {
      object_key: `source-carriers/sha256/${sha256(bytes).slice(0, 2).toLowerCase()}/${sha256(bytes).toLowerCase()}/original.txt`,
      media_type: "text/plain",
      byte_count: bytes.byteLength,
      sha256: sha256(bytes),
    };

    const replayCalls: string[] = [];
    const replay = await ensureStoredObject({
      baseUrl: "https://example.supabase.co",
      bucket: "private",
      secretKey: "test-secret",
      object,
      bytes,
      fetchImpl: async (_url: URL | RequestInfo, init?: RequestInit) => {
        replayCalls.push(init?.method ?? "GET");
        return new Response(bytes, { status: 200 });
      },
    });
    expect(replay).toEqual({ action: "exact_replay", bytes: bytes.byteLength });
    expect(replayCalls).toEqual(["GET"]);

    const uploadResponses = [
      new Response(null, { status: 404 }),
      new Response("{}", { status: 200 }),
      new Response(bytes, { status: 200 }),
    ];
    const uploadCalls: string[] = [];
    const uploaded = await ensureStoredObject({
      baseUrl: "https://example.supabase.co",
      bucket: "private",
      secretKey: "test-secret",
      object,
      bytes,
      fetchImpl: async (_url: URL | RequestInfo, init?: RequestInit) => {
        uploadCalls.push(init?.method ?? "GET");
        return uploadResponses.shift()!;
      },
    });
    expect(uploaded).toEqual({ action: "uploaded", bytes: bytes.byteLength });
    expect(uploadCalls).toEqual(["GET", "POST", "GET"]);

    await expect(ensureStoredObject({
      baseUrl: "https://example.supabase.co",
      bucket: "private",
      secretKey: "test-secret",
      object,
      bytes,
      fetchImpl: async () => new Response(Buffer.from("different source bytes"), { status: 200 }),
    })).rejects.toThrow(/Hard conflict/);
  });

  it("redacts secrets, database connections, and absolute local paths from errors", () => {
    const previous = process.env.PAC_SUPABASE_SECRET_KEY;
    process.env.PAC_SUPABASE_SECRET_KEY = "private-test-key";
    const safe = safeOperationalError(new Error(
      "failed C:\\Users\\example\\source.docx using private-test-key and postgres://owner:password@example.test/db",
    ));
    if (previous === undefined) delete process.env.PAC_SUPABASE_SECRET_KEY;
    else process.env.PAC_SUPABASE_SECRET_KEY = previous;
    expect(safe).not.toContain("private-test-key");
    expect(safe).not.toContain("C:\\Users");
    expect(safe).not.toContain("owner:password");
  });

  it("handles Storage's explicit NoSuchKey envelope without accepting other HTTP 400 errors", async () => {
    const bytes = Buffer.from("a private source");
    const object = { object_key: "verified.txt", media_type: "text/plain", byte_count: bytes.length, sha256: sha256(bytes) };
    const replies = [
      Response.json({ statusCode: "404", error: "not_found", code: "NoSuchKey" }, { status: 400 }),
      Response.json({}),
      new Response(bytes),
    ];
    expect(await ensureStoredObject({
      baseUrl: "https://example.supabase.co", bucket: "private", secretKey: "test", object, bytes,
      fetchImpl: async () => replies.shift()!,
    })).toEqual({ action: "uploaded", bytes: bytes.length });
    for (const body of [{ statusCode: "403", code: "AccessDenied" }, { statusCode: "404", code: "NoSuchBucket" }]) {
      await expect(ensureStoredObject({
        baseUrl: "https://example.supabase.co", bucket: "private", secretKey: "test", object, bytes,
        fetchImpl: async () => Response.json(body, { status: 400 }),
      })).rejects.toThrow(/storage status 400/);
    }
  });

  it("keeps locations and holds append-only and unavailable to browser roles", () => {
    const migration = readFileSync(
      path.resolve(root, "db/migrations/0003_pac_private_source_objects.sql"),
      "utf8",
    );
    expect(migration).toContain("create table if not exists pac.source_carrier_locations");
    expect(migration).toContain("create table if not exists pac.source_binary_holds");
    expect(migration.match(/enable row level security/g)).toHaveLength(2);
    expect(migration).toContain("prevent_immutable_change");
    expect(migration).toContain("array['anon', 'authenticated']");
    expect(migration).not.toMatch(/grant\s+.+\s+to\s+(anon|authenticated)/i);
  });
});
