import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { CORPUS } from "@/lib/content/corpus";

const root = path.resolve(import.meta.dirname, "..");
const testRoot = path.resolve(root, ".pac-import-staging/vitest-seed-release");
const firstStage = path.resolve(testRoot, "first");
const secondStage = path.resolve(testRoot, "second");
const releaseManifestPath = path.resolve(
  root,
  "data/release-manifests/permanent-seed-staff-release-2026-09-05.json",
);

function runJson(script: string, args: string[]) {
  const output = execFileSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  return JSON.parse(output);
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(record).sort()
      .filter((key) => record[key] !== undefined)
      .map((key) => [key, canonicalize(record[key])]));
  }
  return value;
}

function canonicalSha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex").toUpperCase();
}

function readJsonLines(stageDirectory: string, name: string) {
  return readFileSync(path.resolve(stageDirectory, name), "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

afterAll(() => {
  rmSync(testRoot, { recursive: true, force: true });
});

describe("governed permanent seed release", () => {
  it("preserves the historical 25-item reviewed release and every frozen payload", () => {
    const manifest = JSON.parse(readFileSync(releaseManifestPath, "utf8"));
    const { releaseSetSha256, ...releaseSet } = manifest;
    expect(canonicalSha256(releaseSet)).toBe(releaseSetSha256);
    expect(manifest).toMatchObject({
      releaseId: "permanent-seed-staff-release-2026-09-05",
      releaseSetSha256: "BCFFAE0854885F50D3F923BBA7FCBB7A2F5EBFFD760DF65B12CE9ED7D0A2DEDE",
      counts: {
        permanentSeedItems: 25,
        changedRevisions: 24,
        unchangedRevisions: 1,
        agencywidePublications: 25,
        dsdPublications: 0,
        completedReviews: 150,
        publicationDecisions: 25,
      },
    });
    expect(new Set(manifest.items.map((item: { id: string }) => item.id)).size).toBe(25);
    expect(manifest.items.filter((item: { changedFromBaseline: boolean }) => item.changedFromBaseline)).toHaveLength(24);
    expect(manifest.items.filter((item: { changedFromBaseline: boolean }) => !item.changedFromBaseline)).toHaveLength(1);
    for (const item of manifest.items) {
      expect(canonicalSha256(item.payload), item.id).toBe(item.payloadSha256);
    }
  });

  it("retains the exact owner-directed orientation update without relabeling it as the historical release", () => {
    const manifest = JSON.parse(readFileSync(releaseManifestPath, "utf8"));
    expect(CORPUS).toHaveLength(25);
    const currentById = new Map(CORPUS.map((item) => [item.id, item]));
    expect(currentById.size).toBe(25);
    for (const frozen of manifest.items) {
      const expected = frozen.id === "lm-how-this-program-works"
        ? {
          ...frozen.payload,
          body: [
            "Begin at your own pace with program orientation. Explore the wider DHS context, One DSD, learning, practice, and opportunities to connect through Amplify Equity, the One DSD Team, and employee resource groups. Bring your experience and follow the questions that matter to your work.",
            ...frozen.payload.body.slice(1),
            // September 11, 2026: the share control moved into the header of every page and the staff guide gained its sharing rule.
            "Sharing: the Share control at the top of every page copies a link that opens that page or resource only, in the program view you are using. If you share from the One DSD view, the person who opens the link sees the One DSD view. Nothing from My Work or from your own questions travels with the link.",
          ],
          nextActions: [
            { label: "Explore program orientation", href: "/orientation" },
            ...frozen.payload.nextActions,
          ],
        }
        : frozen.id === "pn-intercultural-method"
        ? {
          ...frozen.payload,
          // September 14, 2026: the owner's IDI-as-theory-of-change directive added a personal-growth
          // tag lane across the resource corpus so introspective, own-culture content is as discoverable
          // as service-delivery content. This item's tags gained the lane; its guidance text is unchanged.
          tags: [...frozen.payload.tags, "personal growth", "own culture"],
        }
        : frozen.payload;
      expect(currentById.get(frozen.id), frozen.id).toEqual(expected);
    }
    // A historical capture comparison must still disclose this known later edit.
    const comparison = spawnSync(process.execPath,
      ["scripts/corpus/capture-seed-release.mjs", "--check"],
      { cwd: root, encoding: "utf8", env: process.env });
    expect(comparison.status).toBe(1);
    expect(JSON.parse(comparison.stderr)).toEqual({
      ok: false,
      error: "The current TypeScript seed differs from the frozen reviewed release.",
    });
  });

  it("builds the same complete release stage every time", () => {
    const check = runJson("scripts/corpus/build-seed-release.mjs", ["--check"]);
    expect(check).toMatchObject({
      ok: true,
      stageSetSha256: "8F3C156EB422BD0F6E9A8FAC65C20E6D5B3C31E936DD766D007B721DE2F86E66",
      counts: {
        permanentSeedItems: 25,
        changedRevisions: 24,
        unchangedRevisions: 1,
        revisionSourceLinks: 24,
        completedReviews: 150,
        agencywidePublicationDecisions: 25,
        dsdPublicationDecisions: 0,
        staffPublicationDecisions: 25,
        nonSeedPublicationDecisions: 0,
        stagedRows: 223,
      },
      replay: {
        firstInserted: 223,
        secondExactReplay: 223,
        conflicts: 0,
      },
    });

    runJson("scripts/corpus/build-seed-release.mjs", ["--write", "--out", firstStage]);
    runJson("scripts/corpus/build-seed-release.mjs", ["--write", "--out", secondStage]);
    const first = JSON.parse(readFileSync(path.resolve(firstStage, "manifest.json"), "utf8"));
    const second = JSON.parse(readFileSync(path.resolve(secondStage, "manifest.json"), "utf8"));
    expect(first.stageSetSha256).toBe(second.stageSetSha256);
    expect(first.files).toEqual(second.files);
  });

  it("publishes only the 25 seeds at their declared scope after six completed reviews", () => {
    runJson("scripts/corpus/build-seed-release.mjs", ["--write", "--out", firstStage]);
    const release = JSON.parse(readFileSync(releaseManifestPath, "utf8"));
    const seedIds = new Set(release.items.map((item: { id: string }) => item.id));
    const revisions = readJsonLines(firstStage, "content_revisions.jsonl");
    const sources = readJsonLines(firstStage, "revision_sources.jsonl");
    const reviews = readJsonLines(firstStage, "review_records.jsonl");
    const publications = readJsonLines(firstStage, "publication_decisions.jsonl");

    expect(revisions).toHaveLength(24);
    expect(revisions.every((row) => row.revision_number === 2)).toBe(true);
    expect(revisions.every((row) =>
      row.sensitivity_class === "S1"
      && row.ordinary_indexing_allowed === true
      && row.model_context_allowed === false
    )).toBe(true);
    expect(sources).toHaveLength(24);
    expect(reviews).toHaveLength(150);
    expect(reviews.every((row) => row.status === "pass")).toBe(true);
    expect(publications).toHaveLength(25);
    expect(new Set(publications.map((row) => row.content_item_id))).toEqual(seedIds);
    expect(publications.every((row) => row.scope_id === "one-dhs" && row.decision === "publish")).toBe(true);
    expect(publications.every((row) => row.gate_snapshot.staff_retrieval_eligible === true)).toBe(true);
    expect(publications.every((row) =>
      row.sensitivity_class === "S1"
      && row.unauthenticated_exposure_permitted === true
      && typeof row.exposure_reason === "string"
      && row.exposure_reason.length > 0
      && row.gate_snapshot.model_context_allowed === false
      && row.gate_snapshot.trust_decision_source === "governed_seed_release"
    )).toBe(true);

    const reviewsByRevision = new Map<string, Set<string>>();
    for (const review of reviews) {
      const dimensions = reviewsByRevision.get(review.revision_id) ?? new Set<string>();
      dimensions.add(review.dimension);
      reviewsByRevision.set(review.revision_id, dimensions);
    }
    for (const publication of publications) {
      expect(reviewsByRevision.get(publication.revision_id)?.size).toBe(6);
    }
  });

  it("keeps outside-site accessibility claims honest", () => {
    runJson("scripts/corpus/build-seed-release.mjs", ["--write", "--out", firstStage]);
    const release = JSON.parse(readFileSync(releaseManifestPath, "utf8"));
    const outsideItems = release.items.filter(
      (item: { payload: { authority: string } }) => item.payload.authority === "external_verify",
    );
    expect(outsideItems).toHaveLength(5);
    expect(outsideItems.every((item: { payload: { accessibility: string } }) => item.payload.accessibility === "pending")).toBe(true);
    const outsideRevisionIds = new Set(outsideItems.map((item: { id: string }) =>
      readJsonLines(firstStage, "publication_decisions.jsonl")
        .find((row) => row.content_item_id === item.id).revision_id));
    const accessibilityReviews = readJsonLines(firstStage, "review_records.jsonl")
      .filter((row) => outsideRevisionIds.has(row.revision_id) && row.dimension === "accessibility");
    expect(accessibilityReviews).toHaveLength(5);
    expect(accessibilityReviews.every((row) =>
      row.findings.external_destination_accessibility === "not represented as reviewed"
      && row.findings.local_staff_content_accessibility === "pass")).toBe(true);
  });

  it("validates without a database and requires an exact release confirmation before any apply", () => {
    runJson("scripts/corpus/build-seed-release.mjs", ["--write", "--out", firstStage]);
    const validation = runJson("scripts/corpus/load-seed-release.mjs", ["--stage", firstStage]);
    expect(validation).toMatchObject({
      ok: true,
      mode: "validated_only",
      databaseChanged: false,
      staffPublicationDecisions: 25,
    });

    const unconfirmed = spawnSync(
      process.execPath,
      ["scripts/corpus/load-seed-release.mjs", "--stage", firstStage, "--apply"],
      { cwd: root, encoding: "utf8", env: process.env },
    );
    expect(unconfirmed.status).toBe(1);
    expect(JSON.parse(unconfirmed.stderr)).toMatchObject({
      ok: false,
      error: "Applying this release requires --confirm-release permanent-seed-staff-release-2026-09-05.",
    });
  });
});
