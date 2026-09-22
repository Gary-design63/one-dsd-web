import { createServer } from "node:net";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { EditableSurfaceConflictError, EditableSurfaceReviewRequiredError, EditableSurfaceStore } from "@/lib/content/editable-surfaces";
import type { EditableSurfaceEditingState } from "@/lib/content/editable-surfaces";

const ROOT = path.resolve(__dirname, "..");
function executable(name: string) {
  for (const candidate of [name, ...[18,17,16].map(version => `C:/Program Files/PostgreSQL/${version}/bin/${name}.exe`)]) {
    if (spawnSync(candidate, ["--version"], { stdio: "ignore", windowsHide: true, timeout: 5000 }).status === 0) return candidate;
  }
  return null;
}
const INITDB = executable("initdb");
const PG_CTL = executable("pg_ctl");
function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { stdio: "ignore", windowsHide: true, timeout: 60000 });
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed (${result.status}).`);
}
async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer(); server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") { server.close(); reject(new Error("No local port")); return; }
      server.close(error => error ? reject(error) : resolve(address.port));
    });
  });
}

describe.skipIf(!INITDB || !PG_CTL)("owner-approved page saves in real PostgreSQL", () => {
  let temporaryRoot = "";
  let dataDirectory = "";
  let admin: ReturnType<typeof postgres>;
  let runtime: ReturnType<typeof postgres>;
  let store: EditableSurfaceStore;
  const receipts: Array<{ check: string; passed: boolean }> = [];
  const checked = (check: string) => receipts.push({ check, passed: true });
  const save = (state: EditableSurfaceEditingState, text: string) => store.mutate("about.page", {
    action: "save_changes", scope: state.scope,
    expectedRevisionId: state.expectedRevisionId,
    expectedPublicationDecisionId: state.latestDecision?.publicationDecisionId ?? null,
    document: { schemaVersion: 1, surfaceId: "about.page", scope: state.scope,
      values: { ...(state.draft?.document.values ?? state.effective!.values), introLede: text } },
    changeNote: "Clarified the page introduction.",
  });
  const counts = async () => {
    const [row] = await admin`select
      (select count(*)::int from pac.surface_revisions) revisions,
      (select count(*)::int from pac.surface_owner_approvals) approvals,
      (select count(*)::int from pac.surface_publication_decisions) decisions,
      (select count(*)::int from pac.surface_change_events) events`;
    return row;
  };

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-owner-surface-test-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const port = await unusedPort();
    run(INITDB!, ["-D", dataDirectory, "--username=pac_test", "--auth=trust", "--encoding=UTF8", "--no-locale"]);
    run(PG_CTL!, ["-D", dataDirectory, "-l", path.join(temporaryRoot, "postgres.log"), "-o", localPostgresServerOptions(port, temporaryRoot), "-w", "start"]);
    const url = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    admin = postgres(url, { ssl: false, max: 1, prepare: false, onnotice: () => undefined });
    for (const file of ["0001_pac_content_foundation.sql", "0002_pac_runtime_store.sql", "0004_pac_scoped_staff_publications.sql", "0005_pac_owner_resource_drafts.sql", "0007_pac_home_footer_content.sql", "0018_pac_editable_surfaces.sql", "0023_pac_surface_review_chronology.sql", "0031_pac_owner_approved_surface_saves.sql"]) {
      await admin.unsafe(readFileSync(path.join(ROOT, "db/migrations", file), "utf8"));
    }
    const runtimeUrl = url.replace("pac_test@", "pac_app_runtime@");
    runtime = postgres(runtimeUrl, { ssl: false, max: 2, prepare: false });
    store = new EditableSurfaceStore({ databaseUrl: runtimeUrl, sslMode: "disable" });
  }, 90000);

  afterAll(async () => {
    writeFileSync(path.join(ROOT, "evidence/local-audit-2026-09-07/owner-approved-save-postgres.json"), JSON.stringify({ environment: "isolated_local_postgres", migration: "0031_pac_owner_approved_surface_saves.sql", checks: receipts }, null, 2));
    await store?.close().catch(() => undefined);
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], { stdio: "ignore", windowsHide: true, timeout: 30000 });
    if (temporaryRoot && path.dirname(temporaryRoot) === path.resolve(tmpdir()) && path.basename(temporaryRoot).startsWith("pac-owner-surface-test-")) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45000);

  it("grants only the named application function and protects approval/history rows", async () => {
    const [privileges] = await admin`select
      has_function_privilege('public','pac.save_owner_approved_surface(text,text,uuid,bigint,jsonb,text)','execute') public_execute,
      has_function_privilege('pac_app_runtime','pac.save_owner_approved_surface(text,text,uuid,bigint,jsonb,text)','execute') runtime_execute`;
    expect(privileges).toEqual({ public_execute: false, runtime_execute: true });
    await expect(runtime`select * from pac.surface_owner_approvals`).rejects.toMatchObject({ code: "42501" });
    await expect(runtime`insert into pac.surface_owner_approvals (revision_id) values (gen_random_uuid())`).rejects.toMatchObject({ code: "42501" });
    checked("Named function only; direct approval reads/writes denied");
  });

  it("makes owner wording available atomically with honest approval evidence", async () => {
    const initial = (await store.readEditingState("about.page", "one-dhs"))!;
    const result = await save(initial, "Practical resources for the work Minnesota staff do.");
    expect(result.draft).toBeNull(); expect(result.hasUnpublishedChanges).toBe(false);
    expect(result.effective?.values.introLede).toBe("Practical resources for the work Minnesota staff do.");
    expect(result.effective?.revisionId).not.toBe(initial.expectedRevisionId);
    const [record] = await admin`select a.approval_basis, a.document_sha256=r.document_sha256 as exact_document,
      (select count(*)::int from pac.surface_reviews where revision_id=r.revision_id) reviews,
      p.gate_snapshot from pac.surface_revisions r join pac.surface_owner_approvals a using(revision_id)
      join pac.surface_publication_decisions p using(revision_id) where r.revision_id=${result.effective!.revisionId}::uuid`;
    expect(record).toMatchObject({ approval_basis: "standing_owner_approval_on_input", exact_document: true, reviews: 0,
      gate_snapshot: { ownerApprovedSave: true, automaticValidation: { registeredFields: true, scope: true, safeLinkSyntax: true }, independentFactualReviewPerformed: false, independentAccessibilityAuditPerformed: false } });
    const [prior] = await admin`select document from pac.surface_revisions where revision_id=${initial.expectedRevisionId}::uuid`;
    expect(prior.document).toEqual(initial.effective!.document);
    await expect(admin`update pac.surface_owner_approvals set approved_by='changed' where revision_id=${result.effective!.revisionId}::uuid`).rejects.toMatchObject({ code: "55000" });
    checked("Atomic owner save with exact immutable approval; no fabricated review results");
  });

  it("keeps One DHS unchanged through DSD saves, withdrawal, restore, and inheritance", async () => {
    const original = (await store.readPublished("about.page", "one-dhs"))!;
    let dsd = (await store.readEditingState("about.page", "dsd"))!;
    dsd = await save(dsd, "Practical resources for Disability Services Division staff.");
    const firstDsdId = dsd.effective!.revisionId!;
    dsd = await save(dsd, "Resources for Disability Services Division staff and their current work.");
    const secondDsdId = dsd.effective!.revisionId!;
    dsd = await store.mutate("about.page", { action: "restore", scope: "dsd", targetRevisionId: firstDsdId, expectedPublicationDecisionId: dsd.latestDecision!.publicationDecisionId, reason: "Restore the earlier wording." });
    expect(dsd.effective!.revisionId).toBe(firstDsdId);
    dsd = await store.mutate("about.page", { action: "withdraw", scope: "dsd", expectedPublishedRevisionId: firstDsdId, expectedPublicationDecisionId: dsd.latestDecision!.publicationDecisionId, reason: "Withdraw this wording." });
    expect(await store.readPublished("about.page", "dsd")).toBeUndefined();
    dsd = await store.mutate("about.page", { action: "restore", scope: "dsd", targetRevisionId: secondDsdId, expectedPublicationDecisionId: dsd.latestDecision!.publicationDecisionId, reason: "Restore saved wording." });
    expect(dsd.effective!.revisionId).toBe(secondDsdId);
    dsd = await store.mutate("about.page", { action: "resume_inheritance", scope: "dsd", expectedPublicationDecisionId: dsd.latestDecision!.publicationDecisionId, reason: "Follow One DHS wording." });
    expect(dsd.effective!.revisionId).toBe(original.revisionId);
    expect(await store.readPublished("about.page", "one-dhs")).toEqual(original);
    checked("Exact DSD scope; two saved versions; withdraw/restore/resume inheritance; One DHS unchanged");
  });

  it("accepts one concurrent edit and rejects the stale edit", async () => {
    const initial = (await store.readEditingState("about.page", "one-dhs"))!;
    const results = await Promise.allSettled([save(initial, "First concurrent wording for staff."), save(initial, "Second concurrent wording for staff.")]);
    expect(results.filter(result => result.status === "fulfilled")).toHaveLength(1);
    const rejected = results.find(result => result.status === "rejected") as PromiseRejectedResult;
    expect(rejected.reason).toBeInstanceOf(EditableSurfaceConflictError);
    checked("Concurrent saves: one success, one stale conflict");
  });

  it("rejects changed availability even when the expected revision has not changed", async () => {
    const initial = (await store.readEditingState("about.page", "one-dhs"))!;
    const withdrawn = await store.mutate("about.page", { action: "withdraw", scope: "one-dhs", expectedPublishedRevisionId: initial.effective!.revisionId, expectedPublicationDecisionId: initial.latestDecision!.publicationDecisionId, reason: "Temporarily withdraw wording." });
    expect(withdrawn.expectedRevisionId).toBe(initial.expectedRevisionId);
    const before = await counts();
    await expect(save(initial, "Wording from an outdated page view.")).rejects.toBeInstanceOf(EditableSurfaceConflictError);
    expect(await counts()).toEqual(before);
    await store.mutate("about.page", { action: "restore", scope: "one-dhs", targetRevisionId: initial.effective!.revisionId, expectedPublicationDecisionId: withdrawn.latestDecision!.publicationDecisionId, reason: "Restore the saved wording." });
    checked("Availability token prevents a stale save from undoing withdrawal");
  });

  it("rejects invalid links, protected keys, and the wrong scope before creating records", async () => {
    const state = (await store.readEditingState("about.page", "one-dhs"))!;
    const values = state.effective!.values;
    const before = await counts();
    for (const document of [
      { schemaVersion: 1, surfaceId: "about.page", scope: "dsd", values },
      { schemaVersion: 1, surfaceId: "about.page", scope: "one-dhs", values: { ...values, dhsLogoAsset: "replacement" } },
      { schemaVersion: 1, surfaceId: "about.page", scope: "one-dhs", values: { ...values, introLede: "**Formatted wording**" } },
    ]) await expect(runtime`select pac.save_owner_approved_surface('one-dhs','about.page',${state.expectedRevisionId}::uuid,${state.latestDecision!.publicationDecisionId}::bigint,${runtime.json(document)},null)`).rejects.toBeTruthy();
    const header = (await store.readEditingState("site.header", "one-dhs"))!;
    const badLinks = { ...header.effective!.document, values: { ...header.effective!.values, primaryNavigation: [{ label: "Unsafe", href: "javascript:alert(1)" }] } };
    await expect(runtime`select pac.save_owner_approved_surface('one-dhs','site.header',${header.expectedRevisionId}::uuid,${header.latestDecision!.publicationDecisionId}::bigint,${runtime.json(badLinks)},null)`).rejects.toBeTruthy();
    expect(await counts()).toEqual(before);
    checked("SQL independently rejects unsafe links, protected fields, formatted text, and scope mismatch");
  });

  it("rolls back revision and approval records if publication fails", async () => {
    await admin.unsafe(`create function pac.test_fail_owner_publication() returns trigger language plpgsql as $$ begin if new.surface_id='about.page' then raise exception 'Simulated publication failure'; end if; return new; end $$;
      create trigger test_owner_publication_failure before insert on pac.surface_publication_decisions for each row execute function pac.test_fail_owner_publication();`);
    const state = (await store.readEditingState("about.page", "one-dhs"))!;
    const before = await counts();
    try {
      await expect(save(state, "This wording must not survive a failed publication.")).rejects.toBeTruthy();
      expect(await counts()).toEqual(before);
      expect((await store.readPublished("about.page", "one-dhs"))!.revisionId).toBe(state.effective!.revisionId);
    } finally {
      await admin.unsafe("drop trigger test_owner_publication_failure on pac.surface_publication_decisions; drop function pac.test_fail_owner_publication();");
    }
    checked("Forced publication failure rolls back revision, approval, decision, and event together");
  });

  it("preserves legacy draft behavior without treating a forged approval snapshot as approval", async () => {
    const state = (await store.readEditingState("about.page", "one-dhs"))!;
    const draft = await store.mutate("about.page", { action: "save_draft", scope: "one-dhs", expectedRevisionId: state.expectedRevisionId, document: { ...state.effective!.document, values: { ...state.effective!.values, introLede: "An optional unpublished draft for staff wording." } }, changeNote: null });
    expect(draft.draft!.reviews.every(review => review.status === "pending")).toBe(true);
    await expect(store.mutate("about.page", { action: "publish", scope: "one-dhs", revisionId: draft.draft!.revisionId, expectedPublicationDecisionId: draft.latestDecision!.publicationDecisionId, reason: "Try the legacy publication path." })).rejects.toBeInstanceOf(EditableSurfaceReviewRequiredError);
    await expect(admin`insert into pac.surface_publication_decisions (surface_id,scope_id,revision_id,decision,gate_snapshot,reason,decided_by) values ('about.page','one-dhs',${draft.draft!.revisionId}::uuid,'publish','{"approvalBasis":"standing_owner_approval_on_input","ownerApprovedSave":true}'::jsonb,'A forged approval claim.','pac-consultant-workspace-owner')`).rejects.toMatchObject({ code: "55000" });
    const saved = await save(draft, "The owner saves the final wording for staff.");
    expect(saved.draft).toBeNull();
    expect(saved.effective!.values.introLede).toBe("The owner saves the final wording for staff.");
    checked("Legacy draft stays unpublished; forged approval JSON rejected; owner save finalizes current work");
  });
});
