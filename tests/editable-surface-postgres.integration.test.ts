import { createServer } from "node:net";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import {
  EditableSurfaceConflictError,
  EditableSurfaceReviewRequiredError,
  EditableSurfaceStore,
} from "@/lib/content/editable-surfaces";
import {
  getEditableSurfaceDefinition,
} from "@/lib/content/staff-surface-registry";
import { editableSurfaceReviewDimensions } from "@/lib/content/editable-surface-contract";

const ROOT = path.resolve(__dirname, "..");
const historicalMigration = readFileSync(path.join(ROOT, "db/migrations/0018_pac_editable_surfaces.sql"), "utf8");
const historicalRegistryMatch = historicalMigration.match(/\$pac_registry\$(\[[\s\S]*?\])\$pac_registry\$::jsonb/);
if (!historicalRegistryMatch) throw new Error("Migration 0018 is missing its fixed registry seed.");
const historicalRegistry = JSON.parse(historicalRegistryMatch[1]) as Array<{
  surfaceId: string;
  requiredReviewDimensions: string[];
  approvedValues: Record<string, unknown>;
}>;

function postgresExecutable(name: "initdb" | "pg_ctl"): string | null {
  const candidates = [
    name,
    `C:\\Program Files\\PostgreSQL\\18\\bin\\${name}.exe`,
    `C:\\Program Files\\PostgreSQL\\17\\bin\\${name}.exe`,
    `C:\\Program Files\\PostgreSQL\\16\\bin\\${name}.exe`,
  ];
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ["--version"], { stdio: "ignore", windowsHide: true, timeout: 5_000 });
    if (result.status === 0) return candidate;
  }
  return null;
}

const INITDB = postgresExecutable("initdb");
const PG_CTL = postgresExecutable("pg_ctl");

function run(executable: string, args: string[]) {
  const result = spawnSync(executable, args, { stdio: "ignore", windowsHide: true, timeout: 60_000 });
  if (result.status !== 0) throw new Error(`${path.basename(executable)} failed with status ${result.status}.`);
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
      server.close((error) => error ? reject(error) : resolve(address.port));
    });
  });
}

describe.skipIf(!INITDB || !PG_CTL)("governed editable surfaces in PostgreSQL", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtime: ReturnType<typeof postgres> | null = null;
  let store: EditableSurfaceStore | null = null;
  let migration = "";

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-editable-surfaces-test-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const port = await unusedPort();
    run(INITDB!, ["-D", dataDirectory, "--username=pac_test", "--auth=trust", "--encoding=UTF8", "--no-locale"]);
    run(PG_CTL!, [
      "-D", dataDirectory,
      "-l", path.join(temporaryRoot, "postgres.log"),
      "-o", localPostgresServerOptions(port, temporaryRoot),
      "-w", "start",
    ]);
    const adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    const runtimeUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    for (const file of [
      "0001_pac_content_foundation.sql",
      "0002_pac_runtime_store.sql",
      "0004_pac_scoped_staff_publications.sql",
      "0005_pac_owner_resource_drafts.sql",
      "0007_pac_home_footer_content.sql",
    ]) await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", file), "utf8"));
    migration = readFileSync(path.join(ROOT, "db", "migrations", "0018_pac_editable_surfaces.sql"), "utf8");
    await admin.unsafe(migration);
    runtime = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false });
    store = new EditableSurfaceStore({ databaseUrl: runtimeUrl, sslMode: "disable" });
  }, 90_000);

  afterAll(async () => {
    await store?.close().catch(() => undefined);
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
      path.basename(temporaryRoot).startsWith("pac-editable-surfaces-test-")
    ) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  it("registers every fixed field and leaves community brief publication reviews pending", async () => {
    const counts = await admin!.unsafe<{ definitions: number; revisions: number; publications: number }[]>(`select
      (select count(*)::int from pac.surface_definitions) definitions,
      (select count(*)::int from pac.surface_revisions) revisions,
      (select count(*)::int from pac.surface_publication_decisions) publications`);
    // This suite applies 0018 only, not later registrations or reading releases.
    expect(historicalRegistry).toHaveLength(76);
    const pendingBriefs = historicalRegistry.filter(({ surfaceId }) => surfaceId.startsWith("community-brief."));
    expect(pendingBriefs).toHaveLength(14);
    expect(counts[0]).toEqual({
      definitions: historicalRegistry.length,
      revisions: historicalRegistry.length,
      publications: historicalRegistry.length - pendingBriefs.length,
    });

    const reviews = await admin!.unsafe<{ surface_id: string; statuses: string[]; dimensions: string[] }[]>(`select
      revision.surface_id,
      array_agg(review.status order by review.dimension) statuses,
      array_agg(review.dimension order by review.dimension) dimensions
    from pac.surface_revisions revision
    join pac.surface_reviews review using (revision_id)
    where revision.surface_id like 'community-brief.%'
    group by revision.surface_id
    order by revision.surface_id`);
    expect(reviews).toHaveLength(pendingBriefs.length);
    for (const row of reviews) {
      const definition = getEditableSurfaceDefinition(row.surface_id)!;
      expect(row.statuses.every((status) => status === "pending")).toBe(true);
      expect(row.dimensions.sort()).toEqual([...editableSurfaceReviewDimensions(definition)].sort());
    }
    await expect(store!.readPublished("community-brief.somali", "one-dhs")).resolves.toBeUndefined();
    // Read the historical database contract directly: today's typed brief has
    // six additional fields that are deliberately not backfilled into 0018.
    const rows = await runtime!.unsafe<{ state: { draft: {
      canPublish: boolean;
      document: { values: Record<string, unknown> };
      reviews: Array<{ status: string }>;
    } } }[]>("select pac.read_surface_editing_state($1, $2) state", ["one-dhs", "community-brief.somali"]);
    const pending = rows[0].state;
    const originalSomali = historicalRegistry.find(surface => surface.surfaceId === "community-brief.somali")!;
    expect(pending.draft.canPublish).toBe(false);
    expect(pending.draft.document.values).toEqual(originalSomali.approvedValues);
    expect(pending.draft.reviews.map(({ status }) => status)).toEqual(originalSomali.requiredReviewDimensions.map(() => "pending"));
  });

  it("denies table access and private helpers while permitting only named runtime functions", async () => {
    await expect(runtime!.unsafe("select * from pac.surface_revisions")).rejects.toMatchObject({ code: "42501" });
    const privileges = await admin!.unsafe<{
      public_read: boolean;
      runtime_read: boolean;
      runtime_mutate: boolean;
      runtime_private_helper: boolean;
    }[]>(`select
      has_function_privilege('public', 'pac.read_surface_publication(text,text)', 'execute') public_read,
      has_function_privilege('pac_app_runtime', 'pac.read_surface_publication(text,text)', 'execute') runtime_read,
      has_function_privilege('pac_app_runtime', 'pac.create_surface_draft(text,text,uuid,jsonb,text)', 'execute') runtime_mutate,
      has_function_privilege('pac_app_runtime', 'pac.assert_valid_surface_document(text,text,jsonb)', 'execute') runtime_private_helper`);
    expect(privileges[0]).toEqual({
      public_read: false,
      runtime_read: true,
      runtime_mutate: true,
      runtime_private_helper: false,
    });
  });

  it("preserves One DHS while DSD drafts, publishes, masks, resumes, and restores its own wording", async () => {
    const definition = getEditableSurfaceDefinition("about.page")!;
    // This suite intentionally installs migration 0018 only. Its published
    // baseline is immutable even when today's program copy changes.
    const historicalAbout = historicalRegistry.find(surface => surface.surfaceId === "about.page")!;
    const oneDhs = await store!.readPublished("about.page", "one-dhs");
    const inherited = await store!.readPublished("about.page", "dsd");
    expect(oneDhs?.revisionId).toBeTruthy();
    expect(inherited).toMatchObject({ revisionId: oneDhs?.revisionId, sourceScope: "one-dhs", isInherited: true });

    const initialState = await store!.readEditingState("about.page", "dsd");
    expect(initialState).toMatchObject({
      expectedRevisionId: oneDhs?.revisionId,
      draft: null,
      latestDecision: null,
      inheritedFrom: "one-dhs",
      hasUnpublishedChanges: false,
    });
    const changedLede = "A clear, independently managed resource for Minnesota Department of Human Services staff.";
    const document = {
      schemaVersion: 1 as const,
      surfaceId: "about.page",
      scope: "dsd" as const,
      values: { ...definition.approvedValues, introLede: changedLede },
    };
    let changed = await store!.mutate("about.page", {
      action: "save_draft",
      scope: "dsd",
      expectedRevisionId: oneDhs!.revisionId,
      document,
      changeNote: "Clarified the DSD opening.",
    });
    const draftRevisionId = changed.draft!.revisionId;
    expect(changed.draft?.basedOnRevisionId).toBe(oneDhs?.revisionId);
    expect(changed.draft?.reviews.every(({ status }) => status === "pending")).toBe(true);
    expect((await store!.readPublished("about.page", "dsd"))?.values.introLede).toBe(
      historicalAbout.approvedValues.introLede,
    );

    await expect(store!.mutate("about.page", {
      action: "save_draft", scope: "dsd", expectedRevisionId: oneDhs!.revisionId,
      document: { ...document, values: { ...document.values, introLede: `${changedLede} For current work.` } },
      changeNote: null,
    })).rejects.toBeInstanceOf(EditableSurfaceConflictError);
    await expect(store!.mutate("about.page", {
      action: "publish", scope: "dsd", revisionId: draftRevisionId,
      expectedPublicationDecisionId: null, reason: "Publish the reviewed DSD wording.",
    })).rejects.toBeInstanceOf(EditableSurfaceReviewRequiredError);

    for (const review of changed.draft!.reviews) {
      changed = await store!.mutate("about.page", {
        action: "record_review",
        scope: "dsd",
        revisionId: draftRevisionId,
        dimension: review.dimension,
        status: "pass",
        expectedReviewId: review.reviewId,
        note: "Review complete.",
      });
    }
    expect(changed.draft?.canPublish).toBe(true);

    changed = await store!.mutate("about.page", {
      action: "publish", scope: "dsd", revisionId: draftRevisionId,
      expectedPublicationDecisionId: null, reason: "All required reviews are complete.",
    });
    const publishDecision = changed.latestDecision!.publicationDecisionId;
    expect(changed).toMatchObject({ draft: null, inheritedFrom: null, hasUnpublishedChanges: false });
    expect(changed.effective?.values.introLede).toBe(changedLede);
    expect((await store!.readPublished("about.page", "one-dhs"))?.values.introLede).toBe(
      historicalAbout.approvedValues.introLede,
    );

    changed = await store!.mutate("about.page", {
      action: "withdraw", scope: "dsd", expectedPublishedRevisionId: draftRevisionId,
      expectedPublicationDecisionId: publishDecision, reason: "Temporarily remove the DSD wording.",
    });
    expect(changed.effective).toBeNull();
    await expect(store!.readPublished("about.page", "dsd")).resolves.toBeUndefined();

    changed = await store!.mutate("about.page", {
      action: "resume_inheritance", scope: "dsd",
      expectedPublicationDecisionId: changed.latestDecision!.publicationDecisionId,
      reason: "Return to the current One DHS wording.",
    });
    expect(changed).toMatchObject({ expectedRevisionId: oneDhs?.revisionId, inheritedFrom: "one-dhs", draft: null });
    expect(changed.effective?.revisionId).toBe(oneDhs?.revisionId);

    changed = await store!.mutate("about.page", {
      action: "restore", scope: "dsd", targetRevisionId: draftRevisionId,
      expectedPublicationDecisionId: changed.latestDecision!.publicationDecisionId,
      reason: "Restore the earlier approved DSD wording.",
    });
    expect(changed.effective).toMatchObject({ revisionId: draftRevisionId, sourceScope: "dsd", isInherited: false });
    expect(changed.effective?.values.introLede).toBe(changedLede);

    const secondLede = `${changedLede} It also supports current division work.`;
    let secondVersion = await store!.mutate("about.page", {
      action: "save_draft",
      scope: "dsd",
      expectedRevisionId: draftRevisionId,
      document: {
        ...document,
        values: { ...document.values, introLede: secondLede },
      },
      changeNote: "Added a second approved DSD version.",
    });
    const secondRevisionId = secondVersion.draft!.revisionId;
    for (const review of secondVersion.draft!.reviews) {
      secondVersion = await store!.mutate("about.page", {
        action: "record_review",
        scope: "dsd",
        revisionId: secondRevisionId,
        dimension: review.dimension,
        status: "pass",
        expectedReviewId: review.reviewId,
        note: "Review complete.",
      });
    }
    secondVersion = await store!.mutate("about.page", {
      action: "publish",
      scope: "dsd",
      revisionId: secondRevisionId,
      expectedPublicationDecisionId: changed.latestDecision!.publicationDecisionId,
      reason: "Publish the second reviewed DSD version.",
    });
    expect(secondVersion.expectedRevisionId).toBe(secondRevisionId);

    changed = await store!.mutate("about.page", {
      action: "restore",
      scope: "dsd",
      targetRevisionId: draftRevisionId,
      expectedPublicationDecisionId: secondVersion.latestDecision!.publicationDecisionId,
      reason: "Restore the first approved DSD version again.",
    });
    expect(changed.expectedRevisionId).toBe(draftRevisionId);
    await expect(store!.mutate("about.page", {
      action: "save_draft",
      scope: "dsd",
      expectedRevisionId: secondRevisionId,
      document: {
        ...document,
        values: { ...document.values, introLede: `${secondLede} Stale change.` },
      },
      changeNote: "This stale edit must not be accepted.",
    })).rejects.toBeInstanceOf(EditableSurfaceConflictError);

    await expect(admin!.unsafe(
      "update pac.surface_revisions set change_note = 'Changed' where revision_id = $1::uuid",
      [draftRevisionId],
    )).rejects.toMatchObject({ code: "55000" });
  }, 30_000);

  it("replays without duplicating the registered baseline or decision history", async () => {
    const before = await admin!.unsafe<{ definitions: number; revisions: number; reviews: number; decisions: number; events: number }[]>(`select
      (select count(*)::int from pac.surface_definitions) definitions,
      (select count(*)::int from pac.surface_revisions) revisions,
      (select count(*)::int from pac.surface_reviews) reviews,
      (select count(*)::int from pac.surface_publication_decisions) decisions,
      (select count(*)::int from pac.surface_change_events) events`);
    await admin!.unsafe(migration);
    const after = await admin!.unsafe<{ definitions: number; revisions: number; reviews: number; decisions: number; events: number }[]>(`select
      (select count(*)::int from pac.surface_definitions) definitions,
      (select count(*)::int from pac.surface_revisions) revisions,
      (select count(*)::int from pac.surface_reviews) reviews,
      (select count(*)::int from pac.surface_publication_decisions) decisions,
      (select count(*)::int from pac.surface_change_events) events`);
    expect(after[0]).toEqual(before[0]);
  });
});
