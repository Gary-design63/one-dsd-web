import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { CORPUS } from "@/lib/content/corpus";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import {
  FooterCopySchema,
  HomePageCopySchema,
  PAGE_REVIEW_DIMENSIONS,
  STATIC_FOOTER_COPY,
  STATIC_HOME_COPY,
} from "@/lib/content/page-copy-contract";

const ROOT = path.resolve(__dirname, "..");
const RELEASE_ID = "page-copy-reconciled-s1-2026-09-05";
const reconciledMigration = readFileSync(path.join(ROOT, "db/migrations/0016_pac_trusted_home_footer_release.sql"), "utf8");
const reconciledHomeMatch = reconciledMigration.match(/\$home\$([\s\S]*?)\$home\$::jsonb/);
if (!reconciledHomeMatch) throw new Error("Migration 0016 is missing its fixed Home publication.");
const historicalS1HomeCopy = HomePageCopySchema.parse(JSON.parse(reconciledHomeMatch[1]));
const reconciledFooterMatch = reconciledMigration.match(/\$footer\$([\s\S]*?)\$footer\$::jsonb/);
if (!reconciledFooterMatch) throw new Error("Migration 0016 is missing its fixed footer publication.");
const historicalS1FooterCopy = FooterCopySchema.parse(JSON.parse(reconciledFooterMatch[1]));

function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    process.env.PAC_TEST_POSTGRES_BIN
      ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable)
      : "",
    process.platform === "win32"
      ? path.join(
          process.env.ProgramFiles ?? "C:\\Program Files",
          "PostgreSQL",
          "16",
          "bin",
          executable,
        )
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

type PageState = {
  expectedRevisionId: string;
  publishedRevisionId: string | null;
  publicationDecisionId: string;
  isPublished: boolean;
  hasUnpublishedChanges: boolean;
  canPublish: boolean;
  reviews: Array<{
    reviewId: string | null;
    dimension: string;
    status: string;
  }>;
};

describe.skipIf(!INITDB || !PG_CTL)("trusted Home and footer full migration chain", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtime: ReturnType<typeof postgres> | null = null;
  let initialHomeRevisionId = "";
  let initialHomeDecisionId = "";
  let legacyHomeRevisionId = "";

  const migrationPath = (name: string) => path.join(ROOT, "db", "migrations", name);

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-page-copy-full-chain-"));
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
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false, onnotice: () => {} });
    const migrations = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort();
    expect(migrations).toContain("0016_pac_trusted_home_footer_release.sql");
    for (const migration of migrations) {
      try {
        await admin.unsafe(readFileSync(migrationPath(migration), "utf8"));
      } catch (error) {
        throw new Error(`Fresh migration sequence failed at ${migration}.`, {
          cause: error,
        });
      }
    }

    runtime = postgres(adminUrl.replace("pac_test@", "pac_app_runtime@"), {
      ssl: false,
      max: 1,
      prepare: false,
    });
    const publication = await runtime.unsafe<{
      revision_id: string;
      canonical_payload: { copy: unknown };
    }[]>(
      "select revision_id, canonical_payload from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "page-home"],
    );
    initialHomeRevisionId = publication[0].revision_id;
    const state = await runtime.unsafe<{ state: PageState }[]>(
      "select pac.read_page_block_editing_state($1, $2) state",
      ["one-dhs", "page-home"],
    );
    initialHomeDecisionId = state[0].state.publicationDecisionId;
    const legacy = await admin.unsafe<{ revision_id: string }[]>(
      `select revision_id
       from pac.publication_decisions
       where content_item_id = 'page-home'
         and gate_snapshot ->> 'seeded_current_approved_wording' = 'true'
       order by publication_decision_id asc
       limit 1`,
    );
    legacyHomeRevisionId = legacy[0].revision_id;
  }, 120_000);

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
    if (
      temporaryRoot &&
      path.dirname(temporaryRoot) === path.resolve(tmpdir()) &&
      path.basename(temporaryRoot).startsWith("pac-page-copy-full-chain-")
    ) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 45_000);

  it("serves the reconciled copy through a complete S1 trust chain", async () => {
    const home = await runtime!.unsafe<{
      revision_id: string;
      canonical_payload: { copy: unknown };
    }[]>(
      "select revision_id, canonical_payload from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "page-home"],
    );
    const footer = await runtime!.unsafe<{
      revision_id: string;
      canonical_payload: { copy: unknown };
    }[]>(
      "select revision_id, canonical_payload from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "site-footer"],
    );
    expect(home).toHaveLength(1);
    expect(footer).toHaveLength(1);
    expect(home[0].canonical_payload.copy).toEqual(historicalS1HomeCopy);
    expect(home[0].canonical_payload.copy).not.toEqual(STATIC_HOME_COPY);
    // The S1 release publication is historical for the footer as well as Home:
    // the plain-language rewrite landed after it and lives in the static copy.
    expect(footer[0].canonical_payload.copy).toEqual(historicalS1FooterCopy);
    expect(footer[0].canonical_payload.copy).not.toEqual(STATIC_FOOTER_COPY);

    const trust = await admin!.unsafe<{
      content_item_id: string;
      item_class: string;
      revision_class: string;
      revision_indexing: boolean;
      revision_model_context: boolean;
      limitations: string[];
      decision_class: string;
      exposed: boolean;
      exposure_reason: string;
      source_class: string;
      source_business_id: string;
      source_version: string;
      deidentification_status: string;
      source_indexing: boolean;
      source_model_context: boolean;
      owner_approval_status: string;
      accounting_status: string;
      access_scope: string;
      carrier_class: string;
    }[]>(
      `select decision.content_item_id,
         item.sensitivity_class item_class,
         revision.sensitivity_class revision_class,
         revision.ordinary_indexing_allowed revision_indexing,
         revision.model_context_allowed revision_model_context,
         revision.limitations,
         decision.sensitivity_class decision_class,
         decision.unauthenticated_exposure_permitted exposed,
         decision.exposure_reason,
         source.sensitivity_class source_class,
         source.source_business_id,
         source.source_version,
         source.deidentification_status,
         source.ordinary_indexing_allowed source_indexing,
         source.model_context_allowed source_model_context,
         source.owner_approval_status,
         source.accounting_status,
         source.access_scope,
         carrier.sensitivity_class carrier_class
       from pac.publication_decisions decision
       join pac.content_items item using (content_item_id)
       join pac.content_revisions revision using (revision_id)
       join pac.revision_sources link using (revision_id)
       join pac.source_items source using (source_item_id)
       join pac.source_carriers carrier using (carrier_id)
       where decision.gate_snapshot ->> 'release_id' = $1
       order by decision.content_item_id`,
      [RELEASE_ID],
    );
    expect(trust).toHaveLength(2);
    for (const row of trust) {
      expect(row).toMatchObject({
        item_class: "S1",
        revision_class: "S1",
        revision_indexing: true,
        revision_model_context: false,
        decision_class: "S1",
        exposed: true,
        source_class: "S1",
        source_business_id:
          row.content_item_id === "page-home" ? "built-in-home-copy" : "built-in-footer-copy",
        source_version: "2026-09-05-reconciled",
        deidentification_status: "not_needed",
        source_indexing: true,
        source_model_context: false,
        owner_approval_status: "owner_approved_for_ingestion",
        accounting_status: "accounted",
        access_scope: "staff_candidate",
        carrier_class: "S1",
      });
      expect(row.limitations.length).toBeGreaterThan(0);
      expect(row.exposure_reason.trim().length).toBeGreaterThan(0);
    }

    const historical = await admin!.unsafe<{
      revision_class: string;
      decision_class: string;
      source_class: string;
      carrier_class: string;
    }[]>(
      `select revision.sensitivity_class revision_class,
         decision.sensitivity_class decision_class,
         source.sensitivity_class source_class,
         carrier.sensitivity_class carrier_class
       from pac.publication_decisions decision
       join pac.content_revisions revision using (revision_id)
       join pac.revision_sources link using (revision_id)
       join pac.source_items source using (source_item_id)
       join pac.source_carriers carrier using (carrier_id)
       where decision.content_item_id = 'page-home'
         and decision.gate_snapshot ->> 'seeded_current_approved_wording' = 'true'`,
    );
    expect(historical).toEqual([
      {
        revision_class: "S2",
        decision_class: "S2",
        source_class: "S2",
        carrier_class: "S2",
      },
    ]);

    await expect(runtime!.unsafe("select * from pac.content_revisions")).rejects.toMatchObject({
      code: "42501",
    });
    await expect(
      runtime!.unsafe(
        "select pac.page_block_revision_is_staff_exposable($1, $2::uuid)",
        ["page-home", initialHomeRevisionId],
      ),
    ).rejects.toMatchObject({ code: "42501" });

    const inherited = await runtime!.unsafe<{ revision_id: string }[]>(
      "select revision_id from pac.read_page_block_publication($1, $2)",
      ["dsd", "page-home"],
    );
    expect(inherited[0].revision_id).toBe(initialHomeRevisionId);
    await expect(
      runtime!.unsafe(
        "select pac.create_page_block_draft($1, $2, $3::uuid, $4::jsonb, $5)",
        ["dsd", "page-home", initialHomeRevisionId, STATIC_HOME_COPY, "Child edit."],
      ),
    ).rejects.toMatchObject({ code: "42501" });
  });

  it("opens unpublished candidates for the owner, isolates DSD drafts, and never publishes a save", async () => {
    const id = "test-unpublished-candidate";
    await admin!`insert into pac.content_items(content_item_id,content_kind,default_scope_id,staff_label,created_by) values(${id},'resource','one-dhs','Candidate meeting guide','test')`;
    const payload = { ...CORPUS[0], id, status: "under_review", accessibility: "pending", version: "1" };
    await admin!`insert into pac.content_revisions(content_item_id,revision_number,canonical_payload,change_summary,required_review_dimensions,created_by) values(${id},1,${admin!.json(payload)},'Recovered candidate',array['language_alignment','scope'],'test')`;
    const [agency] = await runtime!`select * from pac.read_resource_editing_state('one-dhs',${id})`;
    const [division] = await runtime!`select * from pac.read_resource_editing_state('dsd',${id})`;
    expect(agency.published_revision_id).toBeNull();
    expect(division.editable_fields.scope).toBe("dsd");
    const fields = { ...division.editable_fields, title: "DSD meeting guide" };
    const [saved] = await runtime!`select * from pac.create_resource_draft('dsd',${id},${division.base_revision_id}::uuid,${runtime!.json(fields)},'Adapted for DSD')`;
    expect(saved.editable_fields.title).toBe("DSD meeting guide");
    expect((await runtime!`select * from pac.read_resource_editing_state('one-dhs',${id})`)[0].base_revision_id).toBe(agency.base_revision_id);
    expect(await runtime!`select * from pac.read_staff_publications('dsd',${id})`).toHaveLength(0);
    await expect(runtime!`select * from pac.create_resource_draft('dsd',${id},${division.base_revision_id}::uuid,${runtime!.json(fields)},'Stale save')`).rejects.toMatchObject({ code: "40001" });
    await expect(runtime!`select * from pac.read_resource_editing_state('other',${id})`).rejects.toMatchObject({ code: "P0002" });
  });

  it("returns bounded owner inventory while keeping raw tables unavailable", async () => {
    const [row] = await runtime!`select pac.read_owner_corpus_inventory('one-dhs','',1,0) as value`;
    expect(row.value.items.length).toBeLessThanOrEqual(1);
    expect(row.value.counts).toHaveProperty("sources");
    await expect(runtime!`select * from pac.knowledge_nodes`).rejects.toMatchObject({ code: "42501" });
    await expect(runtime!`select pac.read_owner_corpus_inventory('one-dhs','',10001,0)`).rejects.toMatchObject({ code: "22023" });
    expect(await runtime!`select * from pac.read_staff_graph_neighbors('one-dhs','not-published',4)`).toHaveLength(0);
  });

  it("replays immediately without duplicating or changing the effective release", async () => {
    const before = await admin!.unsafe<{
      revisions: number;
      decisions: number;
      sources: number;
      release_events: number;
    }[]>(
      `select
        (select count(*)::int from pac.content_revisions
          where content_item_id in ('page-home', 'site-footer')) revisions,
        (select count(*)::int from pac.publication_decisions
          where content_item_id in ('page-home', 'site-footer')) decisions,
        (select count(*)::int from pac.source_items
          where source_item_id like 'built-in-%-copy-reconciled-2026-09-05') sources,
        (select count(*)::int from pac.change_events
          where object_id = $1) release_events`,
      [RELEASE_ID],
    );
    await admin!.unsafe(
      readFileSync(migrationPath("0016_pac_trusted_home_footer_release.sql"), "utf8"),
    );
    const after = await admin!.unsafe<typeof before[0][]>(
      `select
        (select count(*)::int from pac.content_revisions
          where content_item_id in ('page-home', 'site-footer')) revisions,
        (select count(*)::int from pac.publication_decisions
          where content_item_id in ('page-home', 'site-footer')) decisions,
        (select count(*)::int from pac.source_items
          where source_item_id like 'built-in-%-copy-reconciled-2026-09-05') sources,
        (select count(*)::int from pac.change_events
          where object_id = $1) release_events`,
      [RELEASE_ID],
    );
    expect(after[0]).toEqual(before[0]);
    const current = await runtime!.unsafe<{ revision_id: string }[]>(
      "select revision_id from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "page-home"],
    );
    expect(current[0].revision_id).toBe(initialHomeRevisionId);
  });

  it("rejects a replay when the governed release has an extra review dimension", async () => {
    await admin!.unsafe("begin");
    try {
      await admin!.unsafe(
        `insert into pac.review_records (
           revision_id, dimension, status, reviewer_role, reviewer_id, findings
         ) values (
           $1::uuid, 'legal_policy', 'pass', 'publishing_approver',
           'pac-home-footer-s1-migration',
           jsonb_build_object(
             'note', 'Unexpected extra review must invalidate exact replay.',
             'release_id', $2::text
           )
         )`,
        [initialHomeRevisionId, RELEASE_ID],
      );

      await expect(
        admin!.unsafe(
          readFileSync(migrationPath("0016_pac_trusted_home_footer_release.sql"), "utf8"),
        ),
      ).rejects.toThrow(/does not match its governed two-block boundary/i);
    } finally {
      await admin!.unsafe("rollback").catch(() => undefined);
    }

    const extraReviews = await admin!.unsafe<{ count: number }[]>(
      `select count(*)::int count
       from pac.review_records
       where revision_id = $1::uuid
         and dimension = 'legal_policy'`,
      [initialHomeRevisionId],
    );
    expect(extraReviews[0].count).toBe(0);
  });

  it("keeps drafts protected and governs publish, withdraw, and rollback", async () => {
    const changedCopy = {
      ...STATIC_HOME_COPY,
      heroLede: "Practical support for thoughtful decisions across DHS work.",
    };
    // The full chain includes 0021, so the newer optional note can be published
    // as a separate reviewed revision without changing the historical seed.
    expect(changedCopy.heroNote).toBe("");
    const draft = await runtime!.unsafe<{ state: PageState }[]>(
      "select pac.create_page_block_draft($1, $2, $3::uuid, $4::jsonb, $5) state",
      [
        "one-dhs",
        "page-home",
        initialHomeRevisionId,
        changedCopy,
        "Clarify the opening description.",
      ],
    );
    const draftState = draft[0].state;
    const draftRevisionId = draftState.expectedRevisionId;
    expect(draftState).toMatchObject({
      publishedRevisionId: initialHomeRevisionId,
      publicationDecisionId: initialHomeDecisionId,
      canPublish: false,
    });
    const draftTrust = await admin!.unsafe<{
      sensitivity_class: string;
      ordinary_indexing_allowed: boolean;
      model_context_allowed: boolean;
      limitations: string[];
    }[]>(
      `select sensitivity_class, ordinary_indexing_allowed,
         model_context_allowed, limitations
       from pac.content_revisions where revision_id = $1::uuid`,
      [draftRevisionId],
    );
    expect(draftTrust[0]).toMatchObject({
      sensitivity_class: "S2",
      ordinary_indexing_allowed: false,
      model_context_allowed: false,
    });
    expect(draftTrust[0].limitations.length).toBeGreaterThan(0);
    const unchanged = await runtime!.unsafe<{
      canonical_payload: { copy: unknown };
    }[]>(
      "select canonical_payload from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "page-home"],
    );
    expect(unchanged[0].canonical_payload.copy).toEqual(historicalS1HomeCopy);

    await expect(
      runtime!.unsafe(
        "select pac.publish_page_block_draft($1, $2, $3::uuid, $4::bigint, $5)",
        [
          "one-dhs",
          "page-home",
          draftRevisionId,
          initialHomeDecisionId,
          "Publish the reviewed wording.",
        ],
      ),
    ).rejects.toMatchObject({ code: "55000" });

    const initialReviewIds = new Map(
      draftState.reviews.map((review) => [review.dimension, review.reviewId]),
    );
    for (const [index, dimension] of PAGE_REVIEW_DIMENSIONS.entries()) {
      const reviewId = initialReviewIds.get(dimension);
      if (!reviewId) throw new Error(`Missing initial review token for ${dimension}.`);
      await runtime!.unsafe(
        "select pac.record_page_block_review($1, $2, $3::uuid, $4, $5, $6::uuid, $7)",
        [
          "one-dhs",
          "page-home",
          draftRevisionId,
          dimension,
          "pass",
          reviewId,
          "Review complete.",
        ],
      );
      if (index === 0) {
        await expect(
          runtime!.unsafe(
            "select pac.record_page_block_review($1, $2, $3::uuid, $4, $5, $6::uuid, $7)",
            [
              "one-dhs",
              "page-home",
              draftRevisionId,
              dimension,
              "pass",
              reviewId,
              "Stale repeat.",
            ],
          ),
        ).rejects.toMatchObject({ code: "40001" });
      }
    }

    const reviewed = await runtime!.unsafe<{ state: PageState }[]>(
      "select pac.read_page_block_editing_state($1, $2) state",
      ["one-dhs", "page-home"],
    );
    expect(reviewed[0].state.canPublish).toBe(true);
    const published = await runtime!.unsafe<{ state: PageState }[]>(
      "select pac.publish_page_block_draft($1, $2, $3::uuid, $4::bigint, $5) state",
      [
        "one-dhs",
        "page-home",
        draftRevisionId,
        initialHomeDecisionId,
        "All required reviews are complete.",
      ],
    );
    const releasedRevisionId = published[0].state.publishedRevisionId!;
    const releasedDecisionId = published[0].state.publicationDecisionId;
    expect(releasedRevisionId).not.toBe(draftRevisionId);
    expect(published[0].state.hasUnpublishedChanges).toBe(false);
    const released = await admin!.unsafe<{
      revision_class: string;
      decision_class: string;
      source_class: string;
      source_copy: unknown;
      source_scope: string;
      exposed: boolean;
      exposure_reason: string;
      gate_snapshot: Record<string, unknown>;
    }[]>(
      `select revision.sensitivity_class revision_class,
         decision.sensitivity_class decision_class,
         source.sensitivity_class source_class,
         source.normalized_payload -> 'copy' source_copy,
         source.access_scope source_scope,
         decision.unauthenticated_exposure_permitted exposed,
         decision.exposure_reason,
         decision.gate_snapshot
       from pac.publication_decisions decision
       join pac.content_revisions revision using (revision_id)
       join pac.revision_sources link using (revision_id)
       join pac.source_items source using (source_item_id)
       where decision.publication_decision_id = $1::bigint`,
      [releasedDecisionId],
    );
    expect(released[0]).toMatchObject({
      revision_class: "S1",
      decision_class: "S1",
      source_class: "S1",
      source_scope: "staff_candidate",
      exposed: true,
      source_copy: changedCopy,
      exposure_reason: "All required reviews are complete.",
    });
    expect(released[0].gate_snapshot).toMatchObject({
      required_reviews_complete: true,
      explicit_owner_decision: true,
      accessibility_reviewed: true,
      trust_decision_source: "governed_page_copy_release",
    });

    await expect(
      runtime!.unsafe(
        "select pac.publish_page_block_draft($1, $2, $3::uuid, $4::bigint, $5)",
        [
          "one-dhs",
          "page-home",
          draftRevisionId,
          initialHomeDecisionId,
          "Stale repeat publication.",
        ],
      ),
    ).rejects.toMatchObject({ code: "40001" });

    await admin!.unsafe(
      readFileSync(migrationPath("0016_pac_trusted_home_footer_release.sql"), "utf8"),
    );
    const afterLaterReplay = await runtime!.unsafe<{
      revision_id: string;
      canonical_payload: { copy: unknown };
    }[]>(
      "select revision_id, canonical_payload from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "page-home"],
    );
    expect(afterLaterReplay[0].revision_id).toBe(releasedRevisionId);
    expect(afterLaterReplay[0].canonical_payload.copy).toEqual(changedCopy);

    const withdrawn = await runtime!.unsafe<{ state: PageState }[]>(
      "select pac.withdraw_page_block_publication($1, $2, $3::uuid, $4::bigint, $5) state",
      [
        "one-dhs",
        "page-home",
        releasedRevisionId,
        releasedDecisionId,
        "Temporarily remove this wording.",
      ],
    );
    const withdrawalDecisionId = withdrawn[0].state.publicationDecisionId;
    expect(withdrawn[0].state).toMatchObject({
      publishedRevisionId: null,
      isPublished: false,
    });
    expect(
      await runtime!.unsafe(
        "select * from pac.read_page_block_publication($1, $2)",
        ["one-dhs", "page-home"],
      ),
    ).toHaveLength(0);
    await expect(
      runtime!.unsafe(
        "select pac.withdraw_page_block_publication($1, $2, $3::uuid, $4::bigint, $5)",
        [
          "one-dhs",
          "page-home",
          releasedRevisionId,
          releasedDecisionId,
          "Stale repeat withdrawal.",
        ],
      ),
    ).rejects.toMatchObject({ code: "40001" });

    const restored = await runtime!.unsafe<{ state: PageState }[]>(
      "select pac.rollback_page_block_publication($1, $2, $3::uuid, $4::uuid, $5::bigint, $6) state",
      [
        "one-dhs",
        "page-home",
        null,
        initialHomeRevisionId,
        withdrawalDecisionId,
        "Restore the reconciled release.",
      ],
    );
    expect(restored[0].state).toMatchObject({
      publishedRevisionId: initialHomeRevisionId,
      isPublished: true,
    });
    const rollbackDecision = await admin!.unsafe<{
      exposure_reason: string;
      gate_snapshot: Record<string, unknown>;
    }[]>(
      `select exposure_reason, gate_snapshot
       from pac.publication_decisions
       where publication_decision_id = $1::bigint`,
      [restored[0].state.publicationDecisionId],
    );
    expect(rollbackDecision[0].exposure_reason).toBe("Restore the reconciled release.");
    expect(rollbackDecision[0].gate_snapshot).toMatchObject({
      trust_decision_source: "governed_page_copy_rollback",
    });
    await expect(
      runtime!.unsafe(
        "select pac.rollback_page_block_publication($1, $2, $3::uuid, $4::uuid, $5::bigint, $6)",
        [
          "one-dhs",
          "page-home",
          initialHomeRevisionId,
          legacyHomeRevisionId,
          restored[0].state.publicationDecisionId,
          "Attempt to restore an untrusted historical release.",
        ],
      ),
    ).rejects.toMatchObject({ code: "55000" });
  }, 45_000);

  it("keeps immutable evidence intact and lets a nearest withdrawal suppress inheritance", async () => {
    for (const statement of [
      `update pac.source_items set title = title
       where source_item_id = 'built-in-home-copy-reconciled-2026-09-05'`,
      `update pac.content_revisions set change_summary = change_summary
       where revision_id = '${initialHomeRevisionId}'::uuid`,
      `update pac.publication_decisions set reason = reason
       where publication_decision_id = ${initialHomeDecisionId}::bigint`,
    ]) {
      await expect(admin!.unsafe(statement)).rejects.toThrow(/append-only/i);
    }

    const current = await runtime!.unsafe<{ revision_id: string }[]>(
      "select revision_id from pac.read_page_block_publication($1, $2)",
      ["one-dhs", "page-home"],
    );
    const dsdBefore = await runtime!.unsafe<{ revision_id: string }[]>(
      "select revision_id from pac.read_page_block_publication($1, $2)",
      ["dsd", "page-home"],
    );
    expect(dsdBefore[0].revision_id).toBe(current[0].revision_id);

    await admin!.unsafe(
      `insert into pac.publication_decisions (
         content_item_id, revision_id, scope_id, decision, gate_snapshot,
         decided_by, reason, sensitivity_class,
         unauthenticated_exposure_permitted, exposure_reason
       ) values (
         'page-home', $1::uuid, 'dsd', 'withdraw',
         '{"explicit_scope_withdrawal":true,"model_context_allowed":false}'::jsonb,
         'page-copy-full-chain-test', 'Suppress inherited wording in this scope.',
         'S1', false, null
       )`,
      [current[0].revision_id],
    );
    expect(
      await runtime!.unsafe(
        "select * from pac.read_page_block_publication($1, $2)",
        ["dsd", "page-home"],
      ),
    ).toHaveLength(0);
    expect(
      await runtime!.unsafe(
        "select * from pac.read_page_block_publication($1, $2)",
        ["one-dhs", "page-home"],
      ),
    ).toHaveLength(1);
  });
});

describe.skipIf(!INITDB || !PG_CTL)("trusted page-copy pre-seed history guard", () => {
  it("rejects an unexpected review set and refuses to bury an unresolved owner draft", async () => {
    const guardRoot = mkdtempSync(path.join(tmpdir(), "pac-page-copy-guard-"));
    const guardData = path.join(guardRoot, "data");
    const guardLog = path.join(guardRoot, "postgres.log");
    const guardPort = await unusedPort();
    let guardAdmin: ReturnType<typeof postgres> | null = null;
    let guardRuntime: ReturnType<typeof postgres> | null = null;
    try {
      run(INITDB!, [
        "-D",
        guardData,
        "--username=pac_test",
        "--auth=trust",
        "--encoding=UTF8",
        "--no-locale",
      ]);
      run(PG_CTL!, [
        "-D",
        guardData,
        "-l",
        guardLog,
        "-o",
        localPostgresServerOptions(guardPort, guardRoot),
        "-w",
        "start",
      ]);
      const guardUrl = `postgresql://pac_test@127.0.0.1:${guardPort}/postgres`;
      guardAdmin = postgres(guardUrl, { ssl: false, max: 1, prepare: false });
      const migrations = readdirSync(path.join(ROOT, "db", "migrations"))
        .filter((name) => /^\d{4}_.+\.sql$/.test(name) && name < "0016_")
        .sort();
      for (const migration of migrations) {
        await guardAdmin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", migration), "utf8"));
      }
      guardRuntime = postgres(guardUrl.replace("pac_test@", "pac_app_runtime@"), {
        ssl: false,
        max: 1,
        prepare: false,
      });
      const baseline = await guardRuntime.unsafe<{ revision_id: string; canonical_payload: { copy: unknown } }[]>(
        "select revision_id, canonical_payload from pac.read_page_block_publication($1, $2)",
        ["one-dhs", "page-home"],
      );
      const historicalGuardCopy = HomePageCopySchema.parse(baseline[0].canonical_payload.copy);

      await guardAdmin.unsafe("begin");
      try {
        await guardAdmin.unsafe(
          `insert into pac.review_records (
             revision_id, dimension, status, reviewer_role, reviewer_id, findings
           ) values (
             $1::uuid, 'legal_policy', 'pass', 'program_steward',
             'pac-home-footer-content-migration',
             jsonb_build_object(
               'note', 'Current approved wording retained without alteration.'
             )
           )`,
          [baseline[0].revision_id],
        );
        await expect(
          guardAdmin.unsafe(
            readFileSync(
              path.join(ROOT, "db", "migrations", "0016_pac_trusted_home_footer_release.sql"),
              "utf8",
            ),
          ),
        ).rejects.toThrow(/Unexpected Home or footer history must be reconciled/i);
      } finally {
        await guardAdmin.unsafe("rollback").catch(() => undefined);
      }

      const extraReviews = await guardAdmin.unsafe<{ count: number }[]>(
        `select count(*)::int count
         from pac.review_records
         where revision_id = $1::uuid
           and dimension = 'legal_policy'`,
        [baseline[0].revision_id],
      );
      expect(extraReviews[0].count).toBe(0);

      await guardRuntime.unsafe(
        "select pac.create_page_block_draft($1, $2, $3::uuid, $4::jsonb, $5)",
        [
          "one-dhs",
          "page-home",
          baseline[0].revision_id,
          { ...historicalGuardCopy, heroLede: "Unresolved owner wording." },
          "Keep this draft for review.",
        ],
      );

      await expect(
        guardAdmin.unsafe(
          readFileSync(
            path.join(ROOT, "db", "migrations", "0016_pac_trusted_home_footer_release.sql"),
            "utf8",
          ),
        ),
      ).rejects.toThrow(/Unexpected Home or footer history must be reconciled/i);
      await guardAdmin.unsafe("rollback");
      const retained = await guardAdmin.unsafe<{
        revisions: number;
        trusted_release_decisions: number;
        drafts: number;
      }[]>(
        `select
          (select count(*)::int from pac.content_revisions
            where content_item_id = 'page-home') revisions,
          (select count(*)::int from pac.publication_decisions
            where gate_snapshot ->> 'release_id' = $1) trusted_release_decisions,
          (select count(*)::int from pac.content_revisions
            where content_item_id = 'page-home'
              and canonical_payload ->> 'status' = 'under_review') drafts`,
        [RELEASE_ID],
      );
      expect(retained[0]).toEqual({
        revisions: 2,
        trusted_release_decisions: 0,
        drafts: 1,
      });
    } finally {
      await guardRuntime?.end({ timeout: 5 }).catch(() => undefined);
      await guardAdmin?.end({ timeout: 5 }).catch(() => undefined);
      if (PG_CTL && existsSync(guardData)) {
        spawnSync(PG_CTL, ["-D", guardData, "-m", "immediate", "-w", "stop"], {
          stdio: "ignore",
          windowsHide: true,
          timeout: 30_000,
        });
      }
      if (
        path.dirname(guardRoot) === path.resolve(tmpdir()) &&
        path.basename(guardRoot).startsWith("pac-page-copy-guard-")
      ) {
        rmSync(guardRoot, { recursive: true, force: true });
      }
    }
  }, 120_000);
});
