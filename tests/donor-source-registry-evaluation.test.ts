import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { COMMUNITY_DONOR_COMMIT, recoverCommunityCandidates } from "../scripts/corpus/donor-community-snapshot.mjs";
import { COURSE_BASE_COMMIT, COURSE_RELEASE_COMMIT, recoverCourseCandidates } from "../scripts/corpus/donor-course-snapshot.mjs";
import { DOMAIN_DONOR_COMMIT, recoverDomainCandidates } from "../scripts/corpus/donor-domain-snapshot.mjs";

type Candidate = { sourceClass?: string; assetKind?: string };

// This integration checks original historical Git trees, not the application's
// committed resource snapshots. Source-only deployment archives omit those trees.
const root = path.resolve(import.meta.dirname, "..");
const missingCommits = [...new Set([
  COURSE_BASE_COMMIT, COURSE_RELEASE_COMMIT, COMMUNITY_DONOR_COMMIT, DOMAIN_DONOR_COMMIT,
])].filter((commit) => spawnSync("git", ["cat-file", "-e", `${commit}^{commit}`], {
  cwd: root, stdio: "ignore", windowsHide: true, timeout: 10_000,
}).status !== 0);
const required = process.env.PAC_REQUIRE_LOCAL_CORPUS === "1";
const fixtureNotice = missingCommits.length
  ? ` (historical Git inputs unavailable: ${missingCommits.join(", ")})`
  : "";

describe("pinned donor registry evaluation — local historical-source integration", () => {
  it.skipIf(missingCommits.length > 0 && !required)(`reconstructs the exact governed candidate sets from their executable registries${fixtureNotice}`, () => {
    expect(missingCommits, "The required local corpus check needs all pinned donor Git commits in this checkout; use the trusted source repository with its original history.").toEqual([]);
    const courses = recoverCourseCandidates();
    const communities = recoverCommunityCandidates();
    const domains = recoverDomainCandidates();

    expect(courses).toHaveLength(86);
    expect(courses.filter((record: Candidate) => record.sourceClass === "authored")).toHaveLength(45);
    expect(courses.filter((record: Candidate) => record.sourceClass === "generated_curriculum")).toHaveLength(41);
    expect(communities).toHaveLength(49);
    expect(communities.filter((record: Candidate) => record.assetKind === "community_brief")).toHaveLength(40);
    expect(communities.filter((record: Candidate) => record.assetKind === "community_brief_unmatched_guide")).toHaveLength(1);
    expect(communities.filter((record: Candidate) => record.assetKind === "religion_brief")).toHaveLength(8);
    expect(domains).toHaveLength(34);
  }, 120_000);
});
