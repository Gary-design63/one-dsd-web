import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { editableFieldsFromContent } from "@/lib/content/resource-editor-contract";
import type { ContentItem } from "@/lib/content/types";

const ROOT = path.resolve(__dirname, "..");
const RESOURCE_ID = "inline-edit-integration-resource";

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

function run(executable: string, args: string[]) {
  const result = spawnSync(executable, args, {
    stdio: "ignore",
    windowsHide: true,
    timeout: 60_000,
  });
  if (result.status !== 0) throw new Error(`${path.basename(executable)} failed.`);
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

const APPROVED_RESOURCE: ContentItem = {
  id: RESOURCE_ID,
  title: "Approved resource title",
  type: "job_aid",
  authority: "guidance",
  layer: "L2",
  summary: "A practical resource for staff.",
  whyItMatters: "It supports consistent work.",
  body: ["Use the approved steps in your work."],
  nextActions: [{ label: "Choose a learning path", href: "/paths" }],
  tags: ["access"],
  intents: ["practice_method"],
  pathIds: ["gp-1"],
  owner: "People, Access and Culture Program",
  reviewDate: "2027-01-15",
  status: "approved",
  scope: "agencywide",
  accessibility: "reviewed",
  version: "1.0",
};

describe.skipIf(!INITDB || !PG_CTL)("owner resource draft PostgreSQL boundary", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let databaseUrl = "";
  let runtimeDatabaseUrl = "";
  let publishedRevisionId = "";
  let admin: ReturnType<typeof postgres> | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-inline-edit-test-"));
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

    databaseUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    runtimeDatabaseUrl = databaseUrl.replace("pac_test@", "pac_app_runtime@");
    admin = postgres(databaseUrl, { ssl: false, max: 1, prepare: false });
    for (const name of [
      "0001_pac_content_foundation.sql",
      "0002_pac_runtime_store.sql",
      "0004_pac_scoped_staff_publications.sql",
      "0005_pac_owner_resource_drafts.sql",
    ]) {
      await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", name), "utf8"));
    }

    await admin.unsafe(
      `insert into pac.source_carriers (logical_key, media_type, original_name, captured_by)
       values ($1, 'application/json', 'inline-edit-source.json', 'test')`,
      ["inline-edit-integration-source"],
    );
    await admin.unsafe(
      `insert into pac.source_items (
         source_item_id, source_business_id, carrier_id, title, normalized_payload,
         normalized_item_sha256, hash_algorithm, hash_algorithm_version,
         owner_approval_status, accounting_status, access_scope
       )
       select $1, $1, carrier_id, 'Inline edit source', '{}'::jsonb, $2,
         'sha256', '1', 'owner_approved_for_ingestion', 'accounted', 'internal_source'
       from pac.source_carriers where logical_key = $3`,
      ["inline-edit-source-item", "a".repeat(64), "inline-edit-integration-source"],
    );
    await admin.unsafe(
      `insert into pac.content_items (
         content_item_id, content_kind, default_scope_id, staff_label, created_by
       ) values ($1, 'resource', 'one-dhs', $2, 'test')`,
      [RESOURCE_ID, APPROVED_RESOURCE.title],
    );
    const revisions = await admin.unsafe<{ revision_id: string }[]>(
      `insert into pac.content_revisions (
         content_item_id, revision_number, canonical_payload, change_summary, created_by
       ) values ($1, 1, $2::jsonb, 'Initial approved resource', 'test')
       returning revision_id`,
      [RESOURCE_ID, APPROVED_RESOURCE],
    );
    publishedRevisionId = revisions[0].revision_id;
    await admin.unsafe(
      `insert into pac.revision_sources (revision_id, source_item_id, relationship)
       values ($1::uuid, 'inline-edit-source-item', 'primary')`,
      [publishedRevisionId],
    );
    await admin.unsafe(
      `insert into pac.review_records (
         revision_id, dimension, status, reviewer_role, reviewer_id
       )
       select $1::uuid, dimension, 'pass', 'program_steward', 'test'
       from unnest(array[
         'language_alignment', 'factual_currentness', 'accessibility', 'scope', 'placement'
       ]::text[]) dimension`,
      [publishedRevisionId],
    );
    await admin.unsafe(
      `insert into pac.publication_decisions (
         content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason
       ) values ($1, $2::uuid, 'one-dhs', 'publish', '{}'::jsonb, 'test', 'Approved test resource')`,
      [RESOURCE_ID, publishedRevisionId],
    );
  }, 60_000);

  afterAll(async () => {
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore",
        windowsHide: true,
        timeout: 30_000,
      });
    }
    if (
      temporaryRoot &&
      path.dirname(temporaryRoot) === path.resolve(tmpdir()) &&
      path.basename(temporaryRoot).startsWith("pac-inline-edit-test-")
    ) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 45_000);

  it("appends a pending draft while the approved staff resource remains unchanged", async () => {
    const runtime = postgres(runtimeDatabaseUrl, { ssl: false, max: 1, prepare: false });
    const staffBaseline = await runtime.unsafe<{ revision_id: string }[]>(
      "select revision_id from pac.read_staff_publications($1, $2)",
      ["one-dhs", RESOURCE_ID],
    );
    expect(staffBaseline).toHaveLength(1);
    const ownerBaseline = await admin!.unsafe<{ base_revision_id: string }[]>(
      "select base_revision_id from pac.read_resource_editing_state($1, $2)",
      ["one-dhs", RESOURCE_ID],
    );
    expect(ownerBaseline).toHaveLength(1);
    const editingState = await runtime.unsafe<{ base_revision_id: string }[]>(
      "select base_revision_id from pac.read_resource_editing_state($1, $2)",
      ["one-dhs", RESOURCE_ID],
    );
    expect(editingState[0].base_revision_id).toBe(publishedRevisionId);

    const fields = {
      ...editableFieldsFromContent(APPROVED_RESOURCE),
      title: "Clearer draft resource title",
    };
    const draftRows = await runtime.unsafe<{ base_revision_id: string }[]>(
      "select base_revision_id from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
      ["one-dhs", RESOURCE_ID, publishedRevisionId, fields, "Clarified the title."],
    );
    const draftRevisionId = draftRows[0].base_revision_id;
    expect(draftRevisionId).not.toBe(publishedRevisionId);

    const staffRows = await runtime.unsafe<{ canonical_payload: ContentItem }[]>(
      "select canonical_payload from pac.read_staff_publications($1, $2)",
      ["one-dhs", RESOURCE_ID],
    );
    expect(staffRows[0].canonical_payload.title).toBe(APPROVED_RESOURCE.title);

    for (const title of ["# Heading", '{"title":"Pasted data"}']) {
      await expect(
        runtime.unsafe(
          "select * from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
          [
            "one-dhs",
            RESOURCE_ID,
            draftRevisionId,
            { ...fields, title },
            "Invalid plain-text save.",
          ],
        ),
      ).rejects.toMatchObject({ code: "22023" });
    }
    await expect(
      runtime.unsafe(
        "select * from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
        ["one-dhs", RESOURCE_ID, publishedRevisionId, fields, "Stale save."],
      ),
    ).rejects.toMatchObject({ code: "40001" });
    await expect(runtime.unsafe("select * from pac.content_revisions")).rejects.toMatchObject({ code: "42501" });
    await runtime.end({ timeout: 5 });

    const summary = await admin!.unsafe<{
      revision_count: number;
      pending_review_count: number;
      publication_count: number;
      change_count: number;
      source_link_count: number;
      draft_status: string;
      draft_accessibility: string;
      based_on_revision_id: string;
    }[]>(
      `select
         (select count(*)::int from pac.content_revisions where content_item_id = $1) as revision_count,
         (select count(*)::int from pac.review_records where revision_id = $2::uuid and status = 'pending') as pending_review_count,
         (select count(*)::int from pac.publication_decisions where content_item_id = $1) as publication_count,
         (select count(*)::int from pac.change_events where object_id = $1 and action = 'draft_created') as change_count,
         (select count(*)::int from pac.revision_sources where revision_id in ($2::uuid, $3::uuid)) as source_link_count,
         (select canonical_payload ->> 'status' from pac.content_revisions where revision_id = $2::uuid) as draft_status,
         (select canonical_payload ->> 'accessibility' from pac.content_revisions where revision_id = $2::uuid) as draft_accessibility,
         (select based_on_revision_id::text from pac.content_revisions where revision_id = $2::uuid) as based_on_revision_id`,
      [RESOURCE_ID, draftRevisionId, publishedRevisionId],
    );
    expect(summary[0]).toEqual({
      revision_count: 2,
      pending_review_count: 5,
      publication_count: 1,
      change_count: 1,
      source_link_count: 2,
      draft_status: "under_review",
      draft_accessibility: "pending",
      based_on_revision_id: publishedRevisionId,
    });

    await expect(
      admin!.unsafe(
        "update pac.content_revisions set change_summary = 'overwrite' where revision_id = $1::uuid",
        [draftRevisionId],
      ),
    ).rejects.toMatchObject({ code: "P0001" });
  }, 30_000);
});
