import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";

const ROOT = path.resolve(import.meta.dirname, "..");

function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    process.env.PAC_TEST_POSTGRES_BIN ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable) : "",
    process.platform === "win32"
      ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable)
      : "",
    `/usr/lib/postgresql/16/bin/${executable}`,
    `/usr/lib/postgresql/15/bin/${executable}`,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const INITDB = postgresBinary("initdb");
const PG_CTL = postgresBinary("pg_ctl");

function run(executable: string, args: string[]): void {
  const result = spawnSync(executable, args, {
    stdio: "ignore",
    windowsHide: true,
    timeout: 60_000,
  });
  if (result.status !== 0) {
    throw new Error(`${path.basename(executable)} failed with status ${result.status ?? "unknown"}.`);
  }
}

async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not allocate a local PostgreSQL test port."));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

type SafeClass = "S0" | "S1";

describe.skipIf(!INITDB || !PG_CTL)("RG-2 PostgreSQL data trust boundary", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtime: ReturnType<typeof postgres> | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-data-trust-test-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const logFile = path.join(temporaryRoot, "postgres.log");
    const port = await unusedPort();

    run(INITDB!, [
      "-D",
      dataDirectory,
      "--username=pac_test",
      "--auth=trust",
      "--encoding=UTF8",
      "--no-locale",
    ]);
    run(PG_CTL!, [
      "-D",
      dataDirectory,
      "-l",
      logFile,
      "-o",
      localPostgresServerOptions(port, temporaryRoot),
      "-w",
      "start",
    ]);

    const adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    const migrationNames = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^000[1-9]_.*\.sql$/.test(name))
      .sort();
    expect(migrationNames).toEqual([
      "0001_pac_content_foundation.sql",
      "0002_pac_runtime_store.sql",
      "0003_pac_private_source_objects.sql",
      "0004_pac_scoped_staff_publications.sql",
      "0005_pac_owner_resource_drafts.sql",
      "0006_pac_owner_resource_release.sql",
      "0007_pac_home_footer_content.sql",
      "0008_pac_owner_resource_release.sql",
      "0009_pac_data_trust_foundation.sql",
    ]);
    for (const name of migrationNames) {
      try {
        await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", name), "utf8"));
      } catch (error) {
        throw new Error(`Fresh migration sequence failed at ${name}.`, { cause: error });
      }
    }

    const runtimeUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    runtime = postgres(runtimeUrl, { ssl: false, max: 16, prepare: false });
  }, 90_000);

  afterAll(async () => {
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore",
        windowsHide: true,
        timeout: 30_000,
      });
    }
    const safeTemporaryRoot =
      temporaryRoot
      && path.dirname(temporaryRoot) === path.resolve(tmpdir())
      && path.basename(temporaryRoot).startsWith("pac-data-trust-test-");
    if (safeTemporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  async function seedDefaultS2(id: string): Promise<string> {
    await admin!.unsafe(
      `insert into pac.source_items (
         source_item_id, source_business_id, title, normalized_payload,
         normalized_item_sha256, hash_algorithm, hash_algorithm_version,
         owner_approval_status, accounting_status, access_scope
       ) values ($1, $1, $2, '{}'::jsonb, $3, 'sha256', '1',
         'owner_approved_for_ingestion', 'accounted', 'internal_source')`,
      [`${id}-source`, `${id} source`, "a".repeat(64)],
    );
    await admin!.unsafe(
      `insert into pac.content_items (
         content_item_id, content_kind, default_scope_id, staff_label, created_by
       ) values ($1, 'resource', 'one-dhs', $2, 'data-trust-test')`,
      [id, `${id} content`],
    );
    const revisions = await admin!.unsafe<{ revision_id: string }[]>(
      `insert into pac.content_revisions (
         content_item_id, revision_number, canonical_payload, change_summary,
         required_review_dimensions, created_by
       ) values ($1, 1, $2::jsonb, 'Default S2 test', array[]::text[], 'data-trust-test')
       returning revision_id`,
      [id, { status: "approved", title: `${id} content` }],
    );
    await admin!.unsafe(
      `insert into pac.revision_sources (revision_id, source_item_id, relationship)
       values ($1::uuid, $2, 'primary')`,
      [revisions[0].revision_id, `${id}-source`],
    );
    return revisions[0].revision_id;
  }

  async function seedSafe(id: string, sensitivity: SafeClass): Promise<{ revisionId: string; sourceId: string }> {
    const sourceId = `${id}-source`;
    await admin!.unsafe(
      `insert into pac.source_items (
         source_item_id, source_business_id, title, normalized_payload,
         normalized_item_sha256, hash_algorithm, hash_algorithm_version,
         owner_approval_status, accounting_status, access_scope,
         sensitivity_class, deidentification_status, ordinary_indexing_allowed, model_context_allowed
       ) values ($1, $1, $2, '{}'::jsonb, $3, 'sha256', '1',
         'owner_approved_for_ingestion', 'accounted', 'staff_candidate',
         $4, 'not_needed', true, true)`,
      [sourceId, `${id} source`, "b".repeat(64), sensitivity],
    );
    await admin!.unsafe(
      `insert into pac.content_items (
         content_item_id, content_kind, default_scope_id, staff_label, created_by, sensitivity_class
       ) values ($1, 'resource', 'one-dhs', $2, 'data-trust-test', $3)`,
      [id, `${id} content`, sensitivity],
    );
    const revisions = await admin!.unsafe<{ revision_id: string }[]>(
      `insert into pac.content_revisions (
         content_item_id, revision_number, canonical_payload, change_summary,
         required_review_dimensions, created_by, sensitivity_class,
         ordinary_indexing_allowed, model_context_allowed
       ) values ($1, 1, $2::jsonb, 'Explicit safe test', array[]::text[],
         'data-trust-test', $3, true, true)
       returning revision_id`,
      [id, { status: "approved", title: `${id} content` }, sensitivity],
    );
    await admin!.unsafe(
      `insert into pac.revision_sources (revision_id, source_item_id, relationship)
       values ($1::uuid, $2, 'primary')`,
      [revisions[0].revision_id, sourceId],
    );
    return { revisionId: revisions[0].revision_id, sourceId };
  }

  async function publish(
    id: string,
    revisionId: string,
    sensitivity: SafeClass | "S2",
    exposed: boolean,
    exposureReason?: string,
  ) {
    return admin!.unsafe(
      `insert into pac.publication_decisions (
         content_item_id, revision_id, scope_id, decision, gate_snapshot,
         decided_by, reason, sensitivity_class,
         unauthenticated_exposure_permitted, exposure_reason
       ) values ($1, $2::uuid, 'one-dhs', 'publish', '{}'::jsonb,
         'data-trust-test', 'Data trust integration test.', $3, $4, $5)`,
      [id, revisionId, sensitivity, exposed, exposureReason ?? null],
    );
  }

  it("applies 0001 through 0009 and rejects prohibited profile JSON without blocking safe runtime JSON", async () => {
    await runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', 'safe-json', '{"purpose":"program review"}'::jsonb)`,
    );
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', 'prohibited-json',
         '{"nested":{"employeeIdeology":"inferred"}}'::jsonb)`,
    )).rejects.toMatchObject({ code: "22023" });
    await expect(runtime!.unsafe(
      `insert into pac.runtime_work_objects (work_kind, object_id, value)
       values ('decision', 'prohibited-acronym-json',
         '{"nested":{"DEIScore":0.75}}'::jsonb)`,
    )).rejects.toMatchObject({ code: "22023" });
    const prohibited = await admin!.unsafe(
      "select object_id from pac.runtime_work_objects where object_id = 'prohibited-json'",
    );
    expect(prohibited).toHaveLength(0);
  });

  it("defaults unknown material to S2 and refuses staff publication", async () => {
    const id = "trust-default-s2";
    const revisionId = await seedDefaultS2(id);

    await expect(publish(id, revisionId, "S2", true, "Attempted exposure."))
      .rejects.toThrow(/Protected or unreviewed content cannot be published/i);
    const projected = await admin!.unsafe(
      "select content_item_id from pac.current_staff_publications where content_item_id = $1",
      [id],
    );
    expect(projected).toHaveLength(0);
  });

  it("requires an explicit reason for S0 and S1 exposure and releases only the explicit decision", async () => {
    for (const sensitivity of ["S0", "S1"] as const) {
      const id = `trust-explicit-${sensitivity.toLowerCase()}`;
      const { revisionId } = await seedSafe(id, sensitivity);

      await expect(publish(id, revisionId, sensitivity, true))
        .rejects.toThrow(/Unauthenticated exposure requires a recorded reason/i);
      await publish(id, revisionId, sensitivity, false);
      const held = await runtime!.unsafe(
        "select content_item_id from pac.read_staff_publications($1, $2)",
        ["one-dhs", id],
      );
      expect(held).toHaveLength(0);

      await publish(id, revisionId, sensitivity, true, `${sensitivity} exposure approved for the internal-purpose URL.`);
      const released = await runtime!.unsafe<{ content_item_id: string }[]>(
        "select content_item_id from pac.read_staff_publications($1, $2)",
        ["one-dhs", id],
      );
      expect(released.map((row) => row.content_item_id)).toEqual([id]);
    }
  });

  it("excludes pre-migration unknown publications and newly unsafe source projections", async () => {
    const preMigrationUnknown = await admin!.unsafe<{ count: number }[]>(
      `select count(*)::int as count
       from pac.current_publications
       where sensitivity_class = 'S2'`,
    );
    expect(preMigrationUnknown[0].count).toBeGreaterThan(0);
    const leakedUnknown = await admin!.unsafe(
      `select content_item_id from pac.current_staff_publications
       where sensitivity_class not in ('S0', 'S1')`,
    );
    expect(leakedUnknown).toHaveLength(0);

    const id = "trust-source-reclassified";
    const { revisionId } = await seedSafe(id, "S1");
    await publish(id, revisionId, "S1", true, "Reviewed S1 staff exposure.");
    const before = await admin!.unsafe(
      "select content_item_id from pac.current_staff_publications where content_item_id = $1",
      [id],
    );
    expect(before).toHaveLength(1);

    const unsafeSourceId = `${id}-new-unsafe-source`;
    await admin!.unsafe(
      `insert into pac.source_items (
         source_item_id, source_business_id, title, normalized_payload,
         normalized_item_sha256, hash_algorithm, hash_algorithm_version,
         owner_approval_status, accounting_status, access_scope
       ) values ($1, $1, 'New protected source', '{}'::jsonb, $2, 'sha256', '1',
         'owner_approved_for_ingestion', 'accounted', 'internal_source')`,
      [unsafeSourceId, "d".repeat(64)],
    );
    await admin!.unsafe(
      `insert into pac.revision_sources (revision_id, source_item_id, relationship)
       values ($1::uuid, $2, 'evidence')`,
      [revisionId, unsafeSourceId],
    );
    const after = await admin!.unsafe(
      "select content_item_id from pac.current_staff_publications where content_item_id = $1",
      [id],
    );
    expect(after).toHaveLength(0);
  });

  it("atomically consumes one fixed-window rate limit under concurrency", async () => {
    const subjectHash = "c".repeat(64);
    const attempts = await Promise.all(
      Array.from({ length: 32 }, () => runtime!.unsafe<{ allowed: boolean; remaining: number }[]>(
        "select allowed, remaining from pac.consume_runtime_rate_limit($1, $2, $3, $4)",
        ["owner-login", subjectHash, 10, 900],
      )),
    );
    const results = attempts.map((rows) => rows[0]);
    expect(results.filter((result) => result.allowed)).toHaveLength(10);
    expect(results.every((result) => result.remaining >= 0 && result.remaining <= 9)).toBe(true);

    const stored = await admin!.unsafe<{ request_count: number }[]>(
      "select request_count from pac.runtime_rate_limits where scope = $1 and subject_hash = $2",
      ["owner-login", subjectHash],
    );
    expect(stored).toEqual([{ request_count: 32 }]);
    await expect(runtime!.unsafe("select * from pac.runtime_rate_limits"))
      .rejects.toMatchObject({ code: "42501" });
  });
});
