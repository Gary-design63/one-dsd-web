import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { CORPUS } from "@/lib/content/corpus";
import {
  FooterCopySchema,
  HomePageCopySchema,
  PAGE_REVIEW_DIMENSIONS,
  STATIC_FOOTER_COPY,
  STATIC_HOME_COPY,
} from "@/lib/content/page-copy-contract";
import type { FooterCopy, HomePageCopy } from "@/lib/content/page-copy-contract";
import { PostgresStaffPublicationReader } from "@/lib/content/staff-publications";

const ROOT = path.resolve(__dirname, "..");

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
  const result = spawnSync(executable, args, { stdio: "ignore", windowsHide: true, timeout: 60_000 });
  if (result.status !== 0) throw new Error(`${path.basename(executable)} failed.`);
}

async function seedRegressionResources(database: ReturnType<typeof postgres>) {
  const sourceRows = await database.unsafe<{ carrier_id: string }[]>(`insert into pac.source_carriers (
      logical_key, media_type, original_name, external_locator, captured_by
    ) values (
      'page-copy-regression-corpus', 'application/json', 'corpus.ts', '{}'::jsonb, 'page-copy-regression-test'
    ) returning carrier_id`);
  await database.unsafe(`insert into pac.source_items (
      source_item_id, source_business_id, carrier_id, source_version, source_pointer, title,
      normalized_payload, normalized_item_sha256, hash_algorithm, hash_algorithm_version,
      owner_approval_status, accounting_status, access_scope
    ) values ($1, $2, $3::uuid, '1', $4, $5, $6::jsonb, $7, 'sha256', '1',
      'owner_approved_for_ingestion', 'accounted', 'internal_source')`, [
    'page-copy-regression-corpus-source', 'page-copy-regression-corpus-source', sourceRows[0].carrier_id,
    'lib/content/corpus.ts', 'Built-in resource regression corpus', { count: CORPUS.length }, 'a'.repeat(64),
  ]);

  for (const item of CORPUS) {
    await database.unsafe(`insert into pac.content_items (
        content_item_id, content_kind, default_scope_id, staff_label, restricted, created_by
      ) values ($1, 'resource', 'one-dhs', $2, false, 'page-copy-regression-test')`, [item.id, item.title]);
    const revisions = await database.unsafe<{ revision_id: string }[]>(`insert into pac.content_revisions (
        content_item_id, revision_number, canonical_payload, change_summary,
        required_review_dimensions, created_by
      ) values ($1, 1, $2::jsonb, 'Regression publication retained during page seed.',
        array[]::text[], 'page-copy-regression-test') returning revision_id`, [item.id, item]);
    await database.unsafe(`insert into pac.revision_sources (revision_id, source_item_id, relationship, note)
      values ($1::uuid, 'page-copy-regression-corpus-source', 'primary', 'Built-in resource regression corpus.')`, [
      revisions[0].revision_id,
    ]);
    await database.unsafe(`insert into pac.publication_decisions (
        content_item_id, revision_id, scope_id, decision, gate_snapshot, decided_by, reason
      ) values ($1, $2::uuid, 'one-dhs', 'publish', '{"regression_seed":true}'::jsonb,
        'page-copy-regression-test', 'Preserve staff resource regression coverage.')`, [
      item.id, revisions[0].revision_id,
    ]);
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

describe.skipIf(!INITDB || !PG_CTL)("Home and footer PostgreSQL lifecycle", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let runtime: ReturnType<typeof postgres> | null = null;
  let admin: ReturnType<typeof postgres> | null = null;
  let initialHomeRevisionId = "";
  let initialPublicationDecisionId = "";
  let historicalHomeCopy: HomePageCopy;
  let historicalFooterCopy: FooterCopy;
  let runtimeUrl = "";

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-page-copy-test-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const logFile = path.join(temporaryRoot, "postgres.log");
    const port = await unusedPort();
    run(INITDB!, ["-D", dataDirectory, "--username=pac_test", "--auth=trust", "--encoding=UTF8", "--no-locale"]);
    run(PG_CTL!, ["-D", dataDirectory, "-l", logFile, "-o", localPostgresServerOptions(port, temporaryRoot), "-w", "start"]);

    const adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    runtimeUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    for (const migration of [
      "0001_pac_content_foundation.sql",
      "0002_pac_runtime_store.sql",
      "0004_pac_scoped_staff_publications.sql",
      "0005_pac_owner_resource_drafts.sql",
    ]) await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", migration), "utf8"));
    await seedRegressionResources(admin);
    await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", "0007_pac_home_footer_content.sql"), "utf8"));
    runtime = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false });
    const initial = await runtime.unsafe<{
      revision_id: string;
      canonical_payload: { copy: unknown };
    }[]>(
      "select revision_id, canonical_payload from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "page-home"],
    );
    initialHomeRevisionId = initial[0].revision_id;
    historicalHomeCopy = HomePageCopySchema.parse(initial[0].canonical_payload.copy);
    const initialFooter = await runtime.unsafe<{ canonical_payload: { copy: unknown } }[]>(
      "select canonical_payload from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "site-footer"],
    );
    historicalFooterCopy = FooterCopySchema.parse(initialFooter[0].canonical_payload.copy);
    const initialState = await runtime.unsafe<{ state: { publicationDecisionId: string } }[]>(
      "select pac.read_page_block_editing_state($1, $2) state",
      ["one-dhs", "page-home"],
    );
    initialPublicationDecisionId = initialState[0].state.publicationDecisionId;
  }, 60_000);

  afterAll(async () => {
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore", windowsHide: true, timeout: 30_000,
      });
    }
    if (
      temporaryRoot &&
      path.dirname(temporaryRoot) === path.resolve(tmpdir()) &&
      path.basename(temporaryRoot).startsWith("pac-page-copy-test-")
    ) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  it("seeds both approved blocks with sources and required reviews", async () => {
    const home = await runtime!.unsafe<{ content_item_id: string; canonical_payload: { copy: unknown } }[]>(
      "select content_item_id, canonical_payload from pac.read_page_block_publication($1, $2)", ["one-dhs", "page-home"],
    );
    const footer = await runtime!.unsafe<{ content_item_id: string; canonical_payload: { copy: unknown } }[]>(
      "select content_item_id, canonical_payload from pac.read_page_block_publication($1, $2)", ["one-dhs", "site-footer"],
    );
    const rows = [...home, ...footer];
    const byId = new Map(rows.map((row) => [row.content_item_id, row.canonical_payload.copy]));
    expect(byId.get("page-home")).toEqual(historicalHomeCopy);
    expect(byId.get("site-footer")).toEqual(historicalFooterCopy);
    expect(historicalHomeCopy).not.toEqual(STATIC_HOME_COPY);
    expect(historicalFooterCopy).not.toEqual(STATIC_FOOTER_COPY);
    const genericResources = await runtime!.unsafe(
      "select * from pac.read_staff_publications($1, $2)", ["one-dhs", null],
    );
    expect(genericResources).toHaveLength(CORPUS.length);
    const resourceReader = new PostgresStaffPublicationReader({ databaseUrl: runtimeUrl, sslMode: "disable" });
    try {
      const parsedResources = await resourceReader.list("one-dhs");
      expect(parsedResources).toHaveLength(CORPUS.length);
      expect(parsedResources.map((item) => item.id).sort()).toEqual(CORPUS.map((item) => item.id).sort());
    } finally {
      await resourceReader.close();
    }

    const accounting = await admin!.unsafe<{
      sources: number; links: number; reviews: number; publications: number;
    }[]>(`select
      (select count(*)::int from pac.source_items where source_item_id like 'built-in-%-copy-2026-09-05') sources,
      (select count(*)::int from pac.revision_sources source join pac.content_revisions revision using (revision_id)
        where revision.content_item_id in ('page-home', 'site-footer')) links,
      (select count(*)::int from pac.review_records review join pac.content_revisions revision using (revision_id)
        where revision.content_item_id in ('page-home', 'site-footer')) reviews,
      (select count(*)::int from pac.publication_decisions
        where content_item_id in ('page-home', 'site-footer')) publications`);
    expect(accounting[0]).toEqual({ sources: 2, links: 2, reviews: 10, publications: 2 });
    await expect(runtime!.unsafe("select * from pac.content_revisions")).rejects.toMatchObject({ code: "42501" });
  });

  it("rejects presentation syntax, icons, product language, and unsafe links inside PostgreSQL", async () => {
    const invalidCopies = [
      { ...historicalHomeCopy, heroNote: "# Heading" },
      { ...historicalHomeCopy, heroNote: "> Quoted guidance" },
      { ...historicalHomeCopy, heroNote: "Use *careful judgment* here." },
      { ...historicalHomeCopy, heroNote: "---" },
      { ...historicalHomeCopy, heroNote: "| Topic | Guidance |" },
      { ...historicalHomeCopy, heroNote: "1) Begin here" },
      { ...historicalHomeCopy, heroNote: '{"message":"Pasted"}' },
      { ...historicalHomeCopy, heroNote: "Choose a direction 🧭" },
      { ...historicalHomeCopy, heroNote: "The API returns a payload." },
      { ...historicalHomeCopy, askHref: "javascript:alert(1)" },
    ];
    for (const copy of invalidCopies) {
      await expect(runtime!.unsafe(
        "select pac.create_page_block_draft($1, $2, $3::uuid, $4::jsonb, $5)",
        ["one-dhs", "page-home", initialHomeRevisionId, copy, "Review copy."],
      )).rejects.toMatchObject({ code: "22023" });
    }
  });

  it("keeps staff wording unchanged through drafting and requires every review before publishing", async () => {
    // This suite intentionally stops at 0007, before 0021 permits a blank heroNote.
    const changed = { ...historicalHomeCopy, heroLede: "Practical support for thoughtful work across DHS." };
    const draftRows = await runtime!.unsafe<{ state: {
      expectedRevisionId: string;
      publishedRevisionId: string;
      publicationDecisionId: string;
      canPublish: boolean;
      reviews: Array<{ reviewId: string | null; dimension: string }>;
    } }[]>(
      "select pac.create_page_block_draft($1, $2, $3::uuid, $4::jsonb, $5) state",
      ["one-dhs", "page-home", initialHomeRevisionId, changed, "Clarified the opening."],
    );
    const draftState = draftRows[0].state;
    const draftRevisionId = draftState.expectedRevisionId;
    expect(draftState.publishedRevisionId).toBe(initialHomeRevisionId);
    expect(draftState.publicationDecisionId).toBe(initialPublicationDecisionId);
    expect(draftState.canPublish).toBe(false);
    const expectedReviewIds = new Map(draftState.reviews.map((review) => [review.dimension, review.reviewId]));

    const beforePublish = await runtime!.unsafe<{ canonical_payload: { copy: typeof STATIC_HOME_COPY } }[]>(
      "select canonical_payload from pac.read_page_block_publication($1, $2)", ["one-dhs", "page-home"],
    );
    expect(beforePublish[0].canonical_payload.copy.heroLede).toBe(historicalHomeCopy.heroLede);
    await expect(runtime!.unsafe(
      "select pac.publish_page_block_draft($1, $2, $3::uuid, $4::bigint, $5)",
      ["one-dhs", "page-home", draftRevisionId, initialPublicationDecisionId, "Publish reviewed wording."],
    )).rejects.toMatchObject({ code: "55000" });

    let lastState: { canPublish: boolean } | undefined;
    for (const dimension of PAGE_REVIEW_DIMENSIONS) {
      const expectedReviewId = expectedReviewIds.get(dimension);
      if (!expectedReviewId) throw new Error(`Missing initial review token for ${dimension}.`);
      const review = await runtime!.unsafe<{ state: { canPublish: boolean } }[]>(
        "select pac.record_page_block_review($1, $2, $3::uuid, $4, $5, $6::uuid, $7) state",
        ["one-dhs", "page-home", draftRevisionId, dimension, "pass", expectedReviewId, "Review complete."],
      );
      lastState = review[0].state;
      if (dimension === PAGE_REVIEW_DIMENSIONS[0]) {
        await expect(runtime!.unsafe(
          "select pac.record_page_block_review($1, $2, $3::uuid, $4, $5, $6::uuid, $7) state",
          ["one-dhs", "page-home", draftRevisionId, dimension, "pass", expectedReviewId, "Repeat review."],
        )).rejects.toMatchObject({ code: "40001" });
      }
    }
    expect(lastState?.canPublish).toBe(true);

    const published = await runtime!.unsafe<{ state: {
      expectedRevisionId: string;
      publishedRevisionId: string;
      publicationDecisionId: string;
      hasUnpublishedChanges: boolean;
    } }[]>(
      "select pac.publish_page_block_draft($1, $2, $3::uuid, $4::bigint, $5) state",
      ["one-dhs", "page-home", draftRevisionId, initialPublicationDecisionId, "All required reviews are complete."],
    );
    const releasedRevisionId = published[0].state.publishedRevisionId;
    const releasedDecisionId = published[0].state.publicationDecisionId;
    expect(releasedRevisionId).not.toBe(draftRevisionId);
    expect(releasedDecisionId).not.toBe(initialPublicationDecisionId);
    expect(published[0].state.expectedRevisionId).toBe(releasedRevisionId);
    expect(published[0].state.hasUnpublishedChanges).toBe(false);
    await expect(runtime!.unsafe(
      "select pac.publish_page_block_draft($1, $2, $3::uuid, $4::bigint, $5) state",
      ["one-dhs", "page-home", draftRevisionId, initialPublicationDecisionId, "Repeat stale publish."],
    )).rejects.toMatchObject({ code: "40001" });

    const staff = await runtime!.unsafe<{ canonical_payload: { copy: typeof STATIC_HOME_COPY } }[]>(
      "select canonical_payload from pac.read_page_block_publication($1, $2)", ["one-dhs", "page-home"],
    );
    expect(staff[0].canonical_payload.copy.heroLede).toBe(changed.heroLede);

    const withdrawn = await runtime!.unsafe<{ state: {
      publishedRevisionId: null;
      publicationDecisionId: string;
      isPublished: boolean;
    } }[]>(
      "select pac.withdraw_page_block_publication($1, $2, $3::uuid, $4::bigint, $5) state",
      ["one-dhs", "page-home", releasedRevisionId, releasedDecisionId, "Temporarily remove this wording."],
    );
    const withdrawalDecisionId = withdrawn[0].state.publicationDecisionId;
    expect(withdrawn[0].state).toMatchObject({ publishedRevisionId: null, isPublished: false });
    await expect(runtime!.unsafe(
      "select pac.withdraw_page_block_publication($1, $2, $3::uuid, $4::bigint, $5) state",
      ["one-dhs", "page-home", releasedRevisionId, releasedDecisionId, "Repeat stale withdrawal."],
    )).rejects.toMatchObject({ code: "40001" });
    const noPublication = await runtime!.unsafe(
      "select * from pac.read_page_block_publication($1, $2)", ["one-dhs", "page-home"],
    );
    expect(noPublication).toHaveLength(0);

    const restored = await runtime!.unsafe<{ state: {
      publishedRevisionId: string;
      publicationDecisionId: string;
      isPublished: boolean;
    } }[]>(
      "select pac.rollback_page_block_publication($1, $2, $3::uuid, $4::uuid, $5::bigint, $6) state",
      ["one-dhs", "page-home", null, initialHomeRevisionId, withdrawalDecisionId, "Restore the earlier approved wording."],
    );
    expect(restored[0].state).toMatchObject({ publishedRevisionId: initialHomeRevisionId, isPublished: true });
    expect(restored[0].state.publicationDecisionId).not.toBe(withdrawalDecisionId);
    await expect(runtime!.unsafe(
      "select pac.rollback_page_block_publication($1, $2, $3::uuid, $4::uuid, $5::bigint, $6) state",
      ["one-dhs", "page-home", null, initialHomeRevisionId, withdrawalDecisionId, "Repeat stale restoration."],
    )).rejects.toMatchObject({ code: "40001" });
    const restoredStaff = await runtime!.unsafe<{ canonical_payload: { copy: typeof STATIC_HOME_COPY } }[]>(
      "select canonical_payload from pac.read_page_block_publication($1, $2)", ["one-dhs", "page-home"],
    );
    expect(restoredStaff[0].canonical_payload.copy).toEqual(historicalHomeCopy);
  }, 30_000);

  it("allows inherited staff reading but prevents a child scope from changing the parent page", async () => {
    const inherited = await runtime!.unsafe<{ revision_id: string; canonical_payload: { copy: unknown } }[]>(
      "select revision_id, canonical_payload from pac.read_page_block_publication($1, $2)",
      ["dsd", "page-home"],
    );
    expect(inherited).toHaveLength(1);
    expect(inherited[0].canonical_payload.copy).toEqual(historicalHomeCopy);
    await expect(runtime!.unsafe(
      "select pac.create_page_block_draft($1, $2, $3::uuid, $4::jsonb, $5)",
      ["dsd", "page-home", inherited[0].revision_id, historicalHomeCopy, "Attempt child-scope change."],
    )).rejects.toMatchObject({ code: "42501" });
    const childEditingState = await runtime!.unsafe<{ state: unknown }[]>(
      "select pac.read_page_block_editing_state($1, $2) state", ["dsd", "page-home"],
    );
    expect(childEditingState[0].state).toBeNull();
  });
  it("replays the migration without duplicating seeded records or lifecycle history", async () => {
    const before = await admin!.unsafe<{ revisions: number; decisions: number; sources: number }[]>(`select
      (select count(*)::int from pac.content_revisions where content_item_id in ('page-home','site-footer')) revisions,
      (select count(*)::int from pac.publication_decisions where content_item_id in ('page-home','site-footer')) decisions,
      (select count(*)::int from pac.source_items where source_item_id like 'built-in-%-copy-2026-09-05') sources`);
    await admin!.unsafe(readFileSync(path.join(ROOT, "db", "migrations", "0007_pac_home_footer_content.sql"), "utf8"));
    const after = await admin!.unsafe<{ revisions: number; decisions: number; sources: number }[]>(`select
      (select count(*)::int from pac.content_revisions where content_item_id in ('page-home','site-footer')) revisions,
      (select count(*)::int from pac.publication_decisions where content_item_id in ('page-home','site-footer')) decisions,
      (select count(*)::int from pac.source_items where source_item_id like 'built-in-%-copy-2026-09-05') sources`);
    expect(after[0]).toEqual(before[0]);
  });
});
