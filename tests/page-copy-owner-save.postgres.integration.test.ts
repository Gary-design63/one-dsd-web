import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { PageCopyConflictError, PageCopyStore } from "@/lib/content/page-copy";
import { type PageBlockEditingState, type FooterCopy } from "@/lib/content/page-copy-contract";

function binary(name: string): string | null {
  const executable = name + (process.platform === "win32" ? ".exe" : "");
  return [
    process.env.PAC_TEST_POSTGRES_BIN ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable) : "",
    process.platform === "win32" ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable) : "",
    path.join("/usr/lib/postgresql/16/bin", executable), path.join("/usr/lib/postgresql/15/bin", executable),
  ].find(value => value && existsSync(value)) ?? null;
}
const INITDB = binary("initdb"), PG_CTL = binary("pg_ctl");
function run(executable: string, args: string[]) {
  const result = spawnSync(executable, args, { stdio: "ignore", windowsHide: true, timeout: 60_000 });
  if (result.status !== 0) throw new Error(path.basename(executable) + " test setup failed.");
}
async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") { server.close(); reject(new Error("Local test port unavailable.")); return; }
      server.close(error => error ? reject(error) : resolve(address.port));
    });
  });
}
describe.skipIf(!INITDB || !PG_CTL)("one-action owner Home/footer saves in PostgreSQL", () => {
  let temporaryRoot = "", dataDirectory = "";
  let admin: ReturnType<typeof postgres>;
  let runtime: ReturnType<typeof postgres>;
  let store: PageCopyStore;
  let initialFooter: PageBlockEditingState<FooterCopy>;
  const root = path.resolve(import.meta.dirname, "..");
  const counts = async () => (await admin.unsafe("select (select count(*)::int from pac.content_revisions) revisions, (select count(*)::int from pac.source_carriers) carriers, (select count(*)::int from pac.source_items) sources, (select count(*)::int from pac.page_block_owner_approvals) approvals, (select count(*)::int from pac.publication_decisions) publications, (select count(*)::int from pac.change_events) events"))[0];
  const footerState = async () => (await store.readEditingState("footer", "one-dhs"))!;
  const saveFooter = (state: PageBlockEditingState<FooterCopy>, helpHeading: string) => store.mutate("footer", "one-dhs", {
    action: "save_changes", expectedRevisionId: state.expectedRevisionId,
    expectedPublicationDecisionId: state.publicationDecisionId,
    copy: { ...state.copy, helpHeading }, changeNote: "Clarified the help heading.",
  });

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-page-owner-save-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const port = await unusedPort();
    run(INITDB!, ["-D", dataDirectory, "--username=pac_test", "--auth=trust", "--encoding=UTF8", "--no-locale"]);
    run(PG_CTL!, ["-D", dataDirectory, "-l", path.join(temporaryRoot, "postgres.log"), "-o", localPostgresServerOptions(port, temporaryRoot), "-w", "start"]);
    const adminUrl = "postgresql://pac_test@127.0.0.1:" + port + "/postgres";
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false, onnotice: () => undefined });
    const migrations = readdirSync(path.join(root, "db/migrations")).filter(name => /^\d{4}_.*\.sql$/.test(name)).sort();
    for (const migration of migrations.filter(name => name < "0032")) await admin.unsafe(readFileSync(path.join(root, "db/migrations", migration), "utf8"));
    const runtimeUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    runtime = postgres(runtimeUrl, { ssl: false, max: 2, prepare: false });
    store = new PageCopyStore({ databaseUrl: runtimeUrl, sslMode: "disable" });
    initialFooter = await footerState();
    await admin.unsafe(readFileSync(path.join(root, "db/migrations/0032_pac_owner_approved_page_copy_saves.sql"), "utf8"));
  }, 120_000);
  afterAll(async () => {
    await store?.close();
    await runtime?.end({ timeout: 2 });
    await admin?.end({ timeout: 2 });
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], { stdio: "ignore", windowsHide: true, timeout: 30_000 });
    if (temporaryRoot && path.dirname(path.resolve(temporaryRoot)) === path.resolve(tmpdir()) && path.basename(temporaryRoot).startsWith("pac-page-owner-save-")) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  it("leaves staff wording and historical revision unchanged when the migration is applied", async () => {
    expect(await footerState()).toEqual(initialFooter);
    expect(await store.readPublished("footer", "one-dhs")).toEqual(initialFooter.copy);
    const [row] = await admin.unsafe<{ count: number }[]>("select count(*)::int as count from pac.page_block_owner_approvals");
    expect(row.count).toBe(0);
  });
  it("saves exact owner content, approval, source snapshot and publication together without fabricated reviews", async () => {
    const next = await saveFooter(await footerState(), "Find practical support");
    expect(next.hasUnpublishedChanges).toBe(false);
    expect(next.publishedRevisionId).toBe(next.expectedRevisionId);
    expect(next.reviews.every(review => review.status === "pending")).toBe(true);
    expect((await store.readPublished("footer", "one-dhs"))?.helpHeading).toBe("Find practical support");
    expect(await store.readPublished("footer", "dsd")).toEqual(next.copy);
    const [proof] = await admin.unsafe<{ exact_revision: boolean; reviews: number; accessibility: string; approval_basis: string; gate_snapshot: Record<string, unknown>; source_copy: unknown }[]>(
      "select a.payload_sha256=r.payload_sha256 as exact_revision, (select count(*)::int from pac.review_records where revision_id=r.revision_id) reviews, r.canonical_payload->>'accessibility' accessibility, a.approval_basis, p.gate_snapshot, s.normalized_payload->'copy' source_copy from pac.page_block_owner_approvals a join pac.content_revisions r using(revision_id) join pac.publication_decisions p using(revision_id) join pac.revision_sources rs using(revision_id) join pac.source_items s using(source_item_id) where r.revision_id=$1::uuid", [next.expectedRevisionId]);
    expect(proof).toMatchObject({ exact_revision: true, reviews: 0, accessibility: "pending", approval_basis: "standing_owner_approval_on_input", source_copy: next.copy, gate_snapshot: { ownerApprovedSave: true, independentFactualReviewPerformed: false, independentAccessibilityAuditPerformed: false } });
    const [prior] = await admin.unsafe<{ copy: unknown }[]>("select canonical_payload->'copy' copy from pac.content_revisions where revision_id=$1::uuid", [initialFooter.expectedRevisionId]);
    expect(prior.copy).toEqual(initialFooter.copy);
    await expect(admin.unsafe("update pac.page_block_owner_approvals set approved_by='different' where revision_id=$1::uuid", [next.expectedRevisionId])).rejects.toMatchObject({ code: "55000" });
  });
  it("preserves a saved draft and publishes that exact draft content with one owner save", async () => {
    const previous = await footerState();
    const copy = { ...previous.copy, helpHeading: "Explore the support routes" };
    const draft = await store.mutate("footer", "one-dhs", { action: "save_draft", expectedRevisionId: previous.expectedRevisionId, copy, changeNote: "A retained draft." });
    expect(draft.hasUnpublishedChanges).toBe(true);
    const published = await store.mutate("footer", "one-dhs", { action: "save_changes", expectedRevisionId: draft.expectedRevisionId, expectedPublicationDecisionId: draft.publicationDecisionId, copy, changeNote: null });
    expect(await store.readPublished("footer", "one-dhs")).toEqual(copy);
    const [source] = await admin.unsafe<{ original_status: string; based_on_revision_id: string }[]>("select d.canonical_payload->>'status' original_status, r.based_on_revision_id from pac.content_revisions r join pac.content_revisions d on d.revision_id=r.based_on_revision_id where r.revision_id=$1::uuid", [published.expectedRevisionId]);
    expect(source).toEqual({ original_status: "under_review", based_on_revision_id: draft.expectedRevisionId });
  });
  it("allows an empty optional Home note and preserves scope and publication checks", async () => {
    const state = (await store.readEditingState("home", "one-dhs"))!;
    const copy = { ...state.copy, heroNote: "", heroLede: "Practical support for thoughtful work across DHS." };
    const saved = await store.mutate("home", "one-dhs", { action: "save_changes", expectedRevisionId: state.expectedRevisionId, expectedPublicationDecisionId: state.publicationDecisionId, copy, changeNote: null });
    expect(saved.copy).toEqual(copy);
    expect(await store.readPublished("home", "one-dhs")).toEqual(copy);
    await expect(store.mutate("home", "dsd", { action: "save_changes", expectedRevisionId: saved.expectedRevisionId, expectedPublicationDecisionId: saved.publicationDecisionId, copy, changeNote: null })).rejects.toThrow();
    await expect(runtime.unsafe("select * from pac.page_block_owner_approvals")).rejects.toMatchObject({ code: "42501" });
    await expect(runtime.unsafe("insert into pac.page_block_owner_approvals(revision_id) values(gen_random_uuid())")).rejects.toMatchObject({ code: "42501" });
  });
  it("rejects competing saves without leaving partial source, approval or publication records", async () => {
    const current = await footerState();
    const before = await counts();
    const results = await Promise.allSettled([saveFooter(current, "Choose a support route"), saveFooter(current, "Find helpful program links")]);
    expect(results.filter(result => result.status === "fulfilled")).toHaveLength(1);
    const failure = results.find(result => result.status === "rejected") as PromiseRejectedResult;
    expect(failure.reason).toBeInstanceOf(PageCopyConflictError);
    const after = await counts();
    for (const key of ["revisions", "carriers", "sources", "approvals", "publications", "events"]) expect(Number(after[key]) - Number(before[key]), key).toBe(1);
  });
  it("rejects unsafe submitted links before making any durable change", async () => {
    const current = await footerState();
    const before = await counts();
    await expect(runtime.unsafe("select pac.save_owner_approved_page_block($1,$2,$3::uuid,$4::bigint,$5::jsonb,$6)", ["one-dhs", "site-footer", current.expectedRevisionId, current.publicationDecisionId, { ...current.copy, askHref: "javascript:alert(1)" }, null])).rejects.toMatchObject({ code: "22023" });
    expect(await counts()).toEqual(before);
    expect(await footerState()).toEqual(current);
  });
  it("retains withdrawal, stale availability conflicts and restoration of owner-approved versions", async () => {
    const current = await footerState();
    const withdrawn = await store.mutate("footer", "one-dhs", { action: "withdraw", expectedPublishedRevisionId: current.publishedRevisionId!, expectedPublicationDecisionId: current.publicationDecisionId, reason: "Temporarily remove this wording." });
    expect(withdrawn.isPublished).toBe(false);
    expect(await store.readPublished("footer", "one-dhs")).toBeUndefined();
    await expect(saveFooter(current, "Stale wording must not return")).rejects.toBeInstanceOf(PageCopyConflictError);
    const restored = await store.mutate("footer", "one-dhs", { action: "rollback", expectedPublishedRevisionId: null, targetRevisionId: current.publishedRevisionId!, expectedPublicationDecisionId: withdrawn.publicationDecisionId, reason: "Restore the saved owner wording." });
    expect(restored.isPublished).toBe(true);
    expect(await store.readPublished("footer", "one-dhs")).toEqual(current.copy);
  });
  it("rolls back the entire save when a protected linked asset fails the late publication check", async () => {
    const state = (await store.readEditingState("home", "one-dhs"))!;
    const [asset] = await admin.unsafe<{ asset_id: string }[]>("insert into pac.assets(logical_key,revision_number,object_key,media_type,byte_count,sha256,rights_status,accessibility_status,created_by,sensitivity_class) values('protected-owner-save-test',1,'protected-owner-save-test','image/png',1,$1,'cleared','pass','test','S2') returning asset_id", ["a".repeat(64)]);
    await admin.unsafe("insert into pac.revision_assets(revision_id,asset_id,purpose) values($1::uuid,$2::uuid,'thumbnail')", [state.expectedRevisionId, asset.asset_id]);
    const before = await counts();
    await expect(store.mutate("home", "one-dhs", { action: "save_changes", expectedRevisionId: state.expectedRevisionId, expectedPublicationDecisionId: state.publicationDecisionId, copy: { ...state.copy, heroLede: "This attempt must not leave partial records." }, changeNote: null })).rejects.toThrow();
    expect(await counts()).toEqual(before);
  });
});
