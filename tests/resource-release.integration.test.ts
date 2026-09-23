import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
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
const RESOURCE_ID = "resource-release-integration";
const STAFF_EXPOSURE_REASON =
  "Reviewed internal-purpose material approved for the staff-facing web address without sign-in.";
const GOVERNED_SEED_IDS = [
  "ext-ada", "ext-clas", "ext-dhs-equity-toolkit", "ext-mn-accessibility", "ext-title-vi-lep",
  "ja-access-checks", "ja-climate-action-plan", "ja-equity-impact-questions",
  "ja-facilitation-session-plan", "ja-form-notice-change", "ja-language-access-checklist",
  "ja-launch-embed-checklist", "ja-plain-language", "ja-process-burden", "ja-stakeholder-map",
  "lm-facilitation-application", "lm-how-this-program-works", "lm-interpreter",
  "lm-workplace-climate", "pn-embed-early", "pn-equity-in-practice", "pn-intercultural-method",
  "pn-partnership-spine", "pn-self-check", "pn-when-to-escalate",
] as const;

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
  title: "Approved access resource",
  type: "job_aid",
  authority: "guidance",
  layer: "L2",
  summary: "A practical resource for staff.",
  whyItMatters: "It supports consistent work.",
  body: ["Use the reviewed steps in your work."],
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

describe.skipIf(!INITDB || !PG_CTL)("resource release PostgreSQL boundary", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let runtimeDatabaseUrl = "";
  let publishedRevisionId = "";
  let admin: ReturnType<typeof postgres> | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-resource-release-test-"));
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

    const databaseUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    runtimeDatabaseUrl = databaseUrl.replace("pac_test@", "pac_app_runtime@");
    admin = postgres(databaseUrl, { ssl: false, max: 1, prepare: false });
    const migrationNames = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort();
    for (const name of migrationNames.filter((candidate) => candidate < "0009_")) {
      await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", name), "utf8"));
    }

    await admin.unsafe(
      `insert into pac.source_carriers (logical_key, media_type, original_name, captured_by)
       values ($1, 'application/json', 'release-source.json', 'test')`,
      ["resource-release-source"],
    );
    await admin.unsafe(
      `insert into pac.source_items (
         source_item_id, source_business_id, carrier_id, title, normalized_payload,
         normalized_item_sha256, hash_algorithm, hash_algorithm_version,
         owner_approval_status, accounting_status, access_scope
       )
       select $1, $1, carrier_id, 'Resource release source', '{}'::jsonb, $2,
         'sha256', '1', 'owner_approved_for_ingestion', 'accounted', 'internal_source'
       from pac.source_carriers where logical_key = $3`,
      ["resource-release-source-item", "b".repeat(64), "resource-release-source"],
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
       values ($1::uuid, 'resource-release-source-item', 'primary')`,
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

    await admin.unsafe(
      `insert into pac.source_carriers (logical_key, media_type, original_name, captured_by)
       values ('governed-seed-source', 'application/json', 'governed-seed.json', 'test')`,
    );
    await admin.unsafe(
      `insert into pac.source_items (
         source_item_id, source_business_id, carrier_id, title, normalized_payload,
         normalized_item_sha256, hash_algorithm, hash_algorithm_version,
         owner_approval_status, accounting_status, access_scope
       )
       select 'owner:current-seed-collection-2026-09-04:v1',
         'owner:current-seed-collection-2026-09-04:v1', carrier_id,
         'Governed seed source', '{}'::jsonb, $1, 'sha256', '1',
         'owner_approved_for_ingestion', 'accounted', 'internal_source'
       from pac.source_carriers where logical_key = 'governed-seed-source'`,
      ["c".repeat(64)],
    );
    await admin.unsafe(
      `with seed_ids as (select unnest($1::text[]) as id)
       insert into pac.content_items (
         content_item_id, content_kind, default_scope_id, staff_label, created_by
       )
       select id, 'resource', 'one-dhs', id, 'test' from seed_ids`,
      [GOVERNED_SEED_IDS],
    );
    await admin.unsafe(
      `with seed_ids as (select unnest($1::text[]) as id)
       insert into pac.content_revisions (
         content_item_id, revision_number, canonical_payload, change_summary,
         required_review_dimensions, created_by
       )
       select id, 1,
         jsonb_build_object('id', id, 'title', id, 'status', 'approved', 'scope', 'agencywide'),
         'Governed seed test release', '{}'::text[], 'test'
       from seed_ids`,
      [GOVERNED_SEED_IDS],
    );
    await admin.unsafe(
      `insert into pac.revision_sources (revision_id, source_item_id, relationship)
       select revision_id, 'owner:current-seed-collection-2026-09-04:v1', 'primary'
       from pac.content_revisions where content_item_id = any($1::text[])`,
      [GOVERNED_SEED_IDS],
    );
    await admin.unsafe(
      `insert into pac.publication_decisions (
         content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason
       )
       select revision.content_item_id, revision.revision_id, 'one-dhs', 'publish',
         jsonb_build_object(
           'release_id', 'permanent-seed-staff-release-2026-09-05',
           'collection_id', 'current-seed-2026-09-04',
           'linked_source_item_id', 'owner:current-seed-collection-2026-09-04:v1',
           'staff_retrieval_eligible', true
         ),
         'Equity and Inclusion Operations Consultant', 'Governed seed test release'
       from pac.content_revisions revision
       where revision.content_item_id = any($1::text[])`,
      [GOVERNED_SEED_IDS],
    );

    for (const name of migrationNames.filter((candidate) => candidate >= "0009_")) {
      await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", name), "utf8"));
    }
    await admin.unsafe("select pg_catalog.set_config('pac.allow_immutable_change', 'on', false)");
    await admin.unsafe(
      `update pac.source_carriers
       set sensitivity_class = 'S1'
       where logical_key = 'resource-release-source'`,
    );
    await admin.unsafe(
      `update pac.source_items
       set sensitivity_class = 'S1', deidentification_status = 'not_needed',
         ordinary_indexing_allowed = true, model_context_allowed = false
       where source_item_id = 'resource-release-source-item'`,
    );
    await admin.unsafe(
      `update pac.content_revisions
       set sensitivity_class = 'S1', ordinary_indexing_allowed = true,
         model_context_allowed = false,
         limitations = array['Test fixture reviewed for ordinary staff retrieval.']::text[]
       where revision_id = $1::uuid`,
      [publishedRevisionId],
    );
    await admin.unsafe("select pg_catalog.set_config('pac.allow_immutable_change', 'off', false)");
    await admin.unsafe(
      "update pac.content_items set sensitivity_class = 'S1' where content_item_id = $1",
      [RESOURCE_ID],
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
      path.basename(temporaryRoot).startsWith("pac-resource-release-test-")
    ) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 45_000);

  it("keeps reviews, publications, and inherited resources bound to the exact scope", async () => {
    type ReviewRecord = {
      reviewId: string;
      dimension: string;
      status: string;
    };
    type ReleaseState = {
      scopeDecisionId: string | null;
      scopeDecision: "preview" | "publish" | "withdraw" | null;
      published: {
        publicationDecisionId: string;
        revisionId: string;
        scopeId: string;
        isInherited: boolean;
        payload: ContentItem;
      } | null;
      draft: {
        revisionId: string;
        reviews: ReviewRecord[];
        readyToPublish: boolean;
      } | null;
      withdrawn: boolean;
    };

    const runtime = postgres(runtimeDatabaseUrl, { ssl: false, max: 1, prepare: false });
    const seedTrust = await admin!.unsafe<{
      published_count: number;
      s1_count: number;
      exposed_count: number;
      model_context_count: number;
    }[]>(
      `select count(*)::int as published_count,
         count(*) filter (where sensitivity_class = 'S1')::int as s1_count,
         count(*) filter (where unauthenticated_exposure_permitted = true)::int as exposed_count,
         count(*) filter (where model_context_allowed = true)::int as model_context_count
       from pac.current_staff_publications
       where content_item_id = any($1::text[])`,
      [GOVERNED_SEED_IDS],
    );
    expect(seedTrust[0]).toEqual({
      published_count: 25,
      s1_count: 25,
      exposed_count: 25,
      model_context_count: 0,
    });
    const legacyTrust = await admin!.unsafe<{
      sensitivity_class: string;
      unauthenticated_exposure_permitted: boolean;
    }[]>(
      `select sensitivity_class, unauthenticated_exposure_permitted
       from pac.publication_decisions
       where content_item_id = $1
       order by publication_decision_id desc
       limit 1`,
      [RESOURCE_ID],
    );
    expect(legacyTrust[0]).toEqual({
      sensitivity_class: "S2",
      unauthenticated_exposure_permitted: false,
    });
    await expect(
      runtime.unsafe("select * from pac.read_staff_publications($1, $2)", ["one-dhs", RESOURCE_ID]),
    ).resolves.toHaveLength(0);
    await expect(
      runtime.unsafe(
        "select pac.publish_resource_draft($1, $2, $3::uuid, $4::bigint, $5)",
        ["one-dhs", RESOURCE_ID, publishedRevisionId, null, "Legacy signature must be unavailable."],
      ),
    ).rejects.toMatchObject({ code: "42501" });
    const readRelease = async (scope: "one-dhs" | "dsd") => {
      const rows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
        "select pac.read_resource_release_state($1, $2) as release_state",
        [scope, RESOURCE_ID],
      );
      return rows[0].release_state;
    };
    const recordReview = async (
      scope: "one-dhs" | "dsd",
      revisionId: string,
      dimension: string,
      expectedReviewId: string,
      decision: "pass" | "blocked" = "pass",
    ) => {
      const rows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
        "select pac.record_resource_review($1, $2, $3::uuid, $4, $5::uuid, $6, $7) as release_state",
        [scope, RESOURCE_ID, revisionId, dimension, expectedReviewId, decision, "Review complete."],
      );
      return rows[0].release_state;
    };

    const fields = {
      ...editableFieldsFromContent(APPROVED_RESOURCE),
      title: "Reviewed access resource",
    };
    const draftRows = await runtime.unsafe<{ base_revision_id: string }[]>(
      "select base_revision_id from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
      ["one-dhs", RESOURCE_ID, publishedRevisionId, fields, "Clarified the title."],
    );
    const draftRevisionId = draftRows[0].base_revision_id;
    let current = await readRelease("one-dhs");
    const initialScopeDecisionId = current.scopeDecisionId;
    expect(initialScopeDecisionId).not.toBeNull();

    await expect(
      runtime.unsafe(
        "select pac.publish_resource_draft($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8)",
        [
          "one-dhs",
          RESOURCE_ID,
          draftRevisionId,
          initialScopeDecisionId,
          "A protected classification must fail.",
          "S2",
          true,
          STAFF_EXPOSURE_REASON,
        ],
      ),
    ).rejects.toMatchObject({ code: "22023" });
    await expect(
      runtime.unsafe(
        "select pac.publish_resource_draft($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8)",
        [
          "one-dhs",
          RESOURCE_ID,
          draftRevisionId,
          initialScopeDecisionId,
          "An implicit exposure decision must fail.",
          "S1",
          false,
          STAFF_EXPOSURE_REASON,
        ],
      ),
    ).rejects.toMatchObject({ code: "22023" });

    await expect(
      runtime.unsafe(
        "select pac.publish_resource_draft($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8)",
        [
          "one-dhs",
          RESOURCE_ID,
          draftRevisionId,
          initialScopeDecisionId,
          "Approved after review.",
          "S1",
          true,
          STAFF_EXPOSURE_REASON,
        ],
      ),
    ).rejects.toMatchObject({ code: "55000" });

    const firstLanguageReview = current.draft!.reviews.find(
      (review) => review.dimension === "language_alignment",
    )!;
    current = await recordReview(
      "one-dhs",
      draftRevisionId,
      "language_alignment",
      firstLanguageReview.reviewId,
    );
    const passedLanguageReview = current.draft!.reviews.find(
      (review) => review.dimension === "language_alignment",
    )!;
    current = await recordReview(
      "one-dhs",
      draftRevisionId,
      "language_alignment",
      passedLanguageReview.reviewId,
      "blocked",
    );
    const blockedLanguageReview = current.draft!.reviews.find(
      (review) => review.dimension === "language_alignment",
    )!;
    await expect(
      recordReview(
        "one-dhs",
        draftRevisionId,
        "language_alignment",
        passedLanguageReview.reviewId,
      ),
    ).rejects.toMatchObject({ code: "40001" });
    current = await recordReview(
      "one-dhs",
      draftRevisionId,
      "language_alignment",
      blockedLanguageReview.reviewId,
    );

    for (const dimension of [
      "factual_currentness",
      "accessibility",
      "scope",
      "placement",
    ]) {
      const review = current.draft!.reviews.find((candidate) => candidate.dimension === dimension)!;
      current = await recordReview("one-dhs", draftRevisionId, dimension, review.reviewId);
    }
    expect(current.draft!.readyToPublish).toBe(true);

    const publishedRows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
      "select pac.publish_resource_draft($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8) as release_state",
      [
        "one-dhs",
        RESOURCE_ID,
        draftRevisionId,
        initialScopeDecisionId,
        "Approved after every required review.",
        "S1",
        true,
        STAFF_EXPOSURE_REASON,
      ],
    );
    const published = publishedRows[0].release_state;
    const releasedRevisionId = published.published!.revisionId;
    expect(published.published!.payload.title).toBe("Reviewed access resource");
    expect(published.draft).toBeNull();

    const publishedTrust = await admin!.unsafe<{
      item_class: string;
      revision_class: string;
      ordinary_indexing_allowed: boolean;
      model_context_allowed: boolean;
      decision_class: string;
      unauthenticated_exposure_permitted: boolean;
      exposure_reason: string;
    }[]>(
      `select item.sensitivity_class as item_class,
         revision.sensitivity_class as revision_class,
         revision.ordinary_indexing_allowed,
         revision.model_context_allowed,
         decision.sensitivity_class as decision_class,
         decision.unauthenticated_exposure_permitted,
         decision.exposure_reason
       from pac.publication_decisions decision
       join pac.content_revisions revision on revision.revision_id = decision.revision_id
       join pac.content_items item on item.content_item_id = decision.content_item_id
       where decision.publication_decision_id = $1::bigint`,
      [published.scopeDecisionId],
    );
    expect(publishedTrust[0]).toEqual({
      item_class: "S1",
      revision_class: "S1",
      ordinary_indexing_allowed: true,
      model_context_allowed: false,
      decision_class: "S1",
      unauthenticated_exposure_permitted: true,
      exposure_reason: STAFF_EXPOSURE_REASON,
    });

    const staff = await runtime.unsafe<{ canonical_payload: ContentItem }[]>(
      "select canonical_payload from pac.read_staff_publications($1, $2)",
      ["one-dhs", RESOURCE_ID],
    );
    expect(staff[0].canonical_payload.title).toBe("Reviewed access resource");
    await expect(runtime.unsafe("select * from pac.publication_decisions")).rejects.toMatchObject({ code: "42501" });

    const withdrawnRows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
      "select pac.withdraw_resource_publication($1, $2, $3::uuid, $4::bigint, $5) as release_state",
      [
        "one-dhs",
        RESOURCE_ID,
        releasedRevisionId,
        published.scopeDecisionId,
        "Temporarily removed while guidance is checked.",
      ],
    );
    const withdrawn = withdrawnRows[0].release_state;
    expect(withdrawn.published).toBeNull();
    expect(withdrawn.withdrawn).toBe(true);
    await expect(
      runtime.unsafe("select * from pac.read_staff_publications($1, $2)", ["one-dhs", RESOURCE_ID]),
    ).resolves.toHaveLength(0);

    const restoredRows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
      "select pac.republish_resource_revision($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8) as release_state",
      [
        "one-dhs",
        RESOURCE_ID,
        publishedRevisionId,
        withdrawn.scopeDecisionId,
        "Restore the earlier approved guidance.",
        "S1",
        true,
        STAFF_EXPOSURE_REASON,
      ],
    );
    const restored = restoredRows[0].release_state;
    expect(restored.published!.revisionId).toBe(publishedRevisionId);
    expect(restored.published!.payload.title).toBe(APPROVED_RESOURCE.title);

    await expect(
      runtime.unsafe(
        "select pac.withdraw_resource_publication($1, $2, $3::uuid, $4::bigint, $5)",
        [
          "one-dhs",
          RESOURCE_ID,
          publishedRevisionId,
          initialScopeDecisionId,
          "This stale request must not win.",
        ],
      ),
    ).rejects.toMatchObject({ code: "40001" });

    const latest = await runtime.unsafe<{ base_revision_id: string }[]>(
      "select base_revision_id from pac.read_resource_editing_state($1, $2)",
      ["one-dhs", RESOURCE_ID],
    );
    const unsafeFields = {
      ...editableFieldsFromContent(APPROVED_RESOURCE),
      title: "AI helper for staff",
    };
    const unsafeDraft = await runtime.unsafe<{ base_revision_id: string }[]>(
      "select base_revision_id from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
      ["one-dhs", RESOURCE_ID, latest[0].base_revision_id, unsafeFields, "Unsafe wording test."],
    );
    for (const title of [
      "> Quoted guidance",
      "*Italic guidance*",
      "_Italic guidance_",
      "---",
      "Topic | Use",
      "1) First step",
    ]) {
      await expect(
        runtime.unsafe(
          "select * from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
          [
            "one-dhs",
            RESOURCE_ID,
            unsafeDraft[0].base_revision_id,
            { ...unsafeFields, title },
            "Formatting rejection test.",
          ],
        ),
      ).rejects.toMatchObject({ code: "22023" });
    }

    current = await readRelease("one-dhs");
    for (const review of current.draft!.reviews) {
      current = await recordReview(
        "one-dhs",
        unsafeDraft[0].base_revision_id,
        review.dimension,
        review.reviewId,
      );
    }
    await expect(
      runtime.unsafe(
        "select pac.publish_resource_draft($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8)",
        [
          "one-dhs",
          RESOURCE_ID,
          unsafeDraft[0].base_revision_id,
          restored.scopeDecisionId,
          "This must fail the release check.",
          "S1",
          true,
          STAFF_EXPOSURE_REASON,
        ],
      ),
    ).rejects.toMatchObject({ code: "22023" });

    const inherited = await readRelease("dsd");
    expect(inherited.scopeDecisionId).toBeNull();
    expect(inherited.published).toMatchObject({
      revisionId: publishedRevisionId,
      scopeId: "one-dhs",
      isInherited: true,
    });
    await expect(
      runtime.unsafe(
        "select pac.withdraw_resource_publication($1, $2, $3::uuid, $4::bigint, $5)",
        [
          "dsd",
          RESOURCE_ID,
          publishedRevisionId,
          inherited.published!.publicationDecisionId,
          "A child scope cannot withdraw the agencywide version.",
        ],
      ),
    ).rejects.toMatchObject({ code: "40001" });

    const dsdEditing = await runtime.unsafe<{
      base_revision_id: string;
      editable_fields: ReturnType<typeof editableFieldsFromContent>;
    }[]>(
      "select base_revision_id, editable_fields from pac.read_resource_editing_state($1, $2)",
      ["dsd", RESOURCE_ID],
    );
    expect(dsdEditing[0].editable_fields.scope).toBe("dsd");
    await expect(
      runtime.unsafe(
        "select * from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
        [
          "dsd",
          RESOURCE_ID,
          dsdEditing[0].base_revision_id,
          { ...dsdEditing[0].editable_fields, scope: "agencywide" },
          "Cross-scope attempt.",
        ],
      ),
    ).rejects.toMatchObject({ code: "22023" });

    const dsdDraftRows = await runtime.unsafe<{ base_revision_id: string }[]>(
      "select base_revision_id from pac.create_resource_draft($1, $2, $3::uuid, $4::jsonb, $5)",
      [
        "dsd",
        RESOURCE_ID,
        dsdEditing[0].base_revision_id,
        { ...dsdEditing[0].editable_fields, title: "DSD access resource" },
        "Prepared the DSD version.",
      ],
    );
    const dsdDraftRevisionId = dsdDraftRows[0].base_revision_id;
    let dsdCurrent = await readRelease("dsd");
    for (const review of dsdCurrent.draft!.reviews) {
      dsdCurrent = await recordReview(
        "dsd",
        dsdDraftRevisionId,
        review.dimension,
        review.reviewId,
      );
    }
    const dsdPublishedRows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
      "select pac.publish_resource_draft($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8) as release_state",
      [
        "dsd",
        RESOURCE_ID,
        dsdDraftRevisionId,
        null,
        "Approved for DSD staff.",
        "S1",
        true,
        STAFF_EXPOSURE_REASON,
      ],
    );
    const dsdPublished = dsdPublishedRows[0].release_state;
    expect(dsdPublished.published).toMatchObject({ scopeId: "dsd", isInherited: false });
    expect(dsdPublished.published!.payload.title).toBe("DSD access resource");

    const oneDhsAfterDsdPublish = await readRelease("one-dhs");
    expect(oneDhsAfterDsdPublish.scopeDecisionId).toBe(restored.scopeDecisionId);
    expect(oneDhsAfterDsdPublish.published!.revisionId).toBe(publishedRevisionId);

    const dsdWithdrawnRows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
      "select pac.withdraw_resource_publication($1, $2, $3::uuid, $4::bigint, $5) as release_state",
      [
        "dsd",
        RESOURCE_ID,
        dsdPublished.published!.revisionId,
        dsdPublished.scopeDecisionId,
        "Return to the agencywide resource for now.",
      ],
    );
    const dsdWithdrawn = dsdWithdrawnRows[0].release_state;
    expect(dsdWithdrawn.withdrawn).toBe(true);
    expect(dsdWithdrawn.published).toMatchObject({
      revisionId: publishedRevisionId,
      scopeId: "one-dhs",
      isInherited: true,
    });

    const dsdRestoredRows = await runtime.unsafe<{ release_state: ReleaseState }[]>(
      "select pac.republish_resource_revision($1, $2, $3::uuid, $4::bigint, $5, $6, $7::boolean, $8) as release_state",
      [
        "dsd",
        RESOURCE_ID,
        dsdPublished.published!.revisionId,
        dsdWithdrawn.scopeDecisionId,
        "Restore the reviewed DSD version.",
        "S1",
        true,
        STAFF_EXPOSURE_REASON,
      ],
    );
    expect(dsdRestoredRows[0].release_state.published).toMatchObject({
      revisionId: dsdPublished.published!.revisionId,
      scopeId: "dsd",
      isInherited: false,
    });
    expect((await readRelease("one-dhs")).published!.revisionId).toBe(publishedRevisionId);

    await runtime.end({ timeout: 5 });

    const summary = await admin!.unsafe<{
      review_events: number;
      publish_events: number;
      withdraw_events: number;
      restore_events: number;
      latest_staff_title: string;
    }[]>(
      `select
        (select count(*)::int from pac.change_events where object_id = $1 and action = 'review_recorded') as review_events,
        (select count(*)::int from pac.change_events where object_id = $1 and action = 'resource_published') as publish_events,
        (select count(*)::int from pac.change_events where object_id = $1 and action = 'resource_withdrawn') as withdraw_events,
        (select count(*)::int from pac.change_events where object_id = $1 and action = 'resource_restored') as restore_events,
        (select canonical_payload ->> 'title' from pac.read_staff_publications('one-dhs', $1)) as latest_staff_title`,
      [RESOURCE_ID],
    );
    expect(summary[0]).toMatchObject({
      review_events: 17,
      publish_events: 2,
      withdraw_events: 2,
      restore_events: 2,
      latest_staff_title: APPROVED_RESOURCE.title,
    });
  }, 45_000);
});
