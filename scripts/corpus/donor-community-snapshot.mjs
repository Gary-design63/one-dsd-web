import { fileURLToPath } from "node:url";

import { loadPinnedGitTypescriptModules } from "./git-typescript-snapshot-lib.mjs";
import {
  assert,
  compactText,
  removeEmptySections,
  section,
  snapshotRecord,
  validateSnapshotRecords,
  writeSnapshotFile,
} from "./donor-snapshot-lib.mjs";

export const COMMUNITY_DONOR_COMMIT = "fac88a203c6323b61a687132bae65c05247c5474";
export const COMMUNITY_DONOR_REPOSITORY = "alphaequity123-afk/one-dhs-equity-resource";
export const STAFF_COMMUNITY_COUNT = 40;
export const RELIGION_BRIEF_COUNT = 8;
export const UNMATCHED_GUIDE_COUNT = 1;
export const GOVERNED_COMMUNITY_CANDIDATE_COUNT = 49;

const COMMUNITY_ENTRY_PATH = "src/lib/community/data.ts";
const BRIEF_BODY_ENTRY_PATH = "src/lib/community/briefs.ts";
const GUIDE_ENTRY_PATH = "src/lib/community/ci/registry.ts";
const RELIGION_ENTRY_PATH = "src/lib/community/ci/religion.ts";
const COMMUNITY_ROOTS = ["src/lib/community"];

function donor(entryPaths, ordinal) {
  return {
    repository: COMMUNITY_DONOR_REPOSITORY,
    commit: COMMUNITY_DONOR_COMMIT,
    entryPaths,
    registryOrdinal: ordinal,
    capturedFrom: "pinned_git_tree",
  };
}

function guideForCommunity(community, guidesById) {
  const guideId = community.id === "black" ? "african-american" : community.id;
  return guidesById.get(guideId) ?? null;
}

function briefBodyForCommunity(community, briefBodies) {
  return briefBodies[community.id] ?? null;
}

function communityRenderable(community, guide, briefBody) {
  const sections = [
    section("Begin here", [guide?.stand, community.stand, community.notThis]),
    section("Keep in mind", guide?.frame ?? []),
    ...(guide?.chapters ?? []).map((chapter) =>
      section(chapter.title, [chapter.evidence, chapter.practitioner, chapter.body]),
    ),
    section("Why this can be missed", [briefBody?.whyMinimizationMissesIt]),
    ...(briefBody?.critical ?? []).map((block) => section(block.heading, [block.body])),
    ...(briefBody?.values ?? []).map((block) => section(block.heading, [block.body])),
    ...(briefBody?.skills ?? []).map((block) => section(block.heading, [block.body])),
    section(
      "Minnesota context",
      (community.demographics ?? []).map(
        (item) => `${compactText([item.label, item.value]).join(": ")} Source: ${item.source}`,
      ),
    ),
    section(
      "Ways to connect",
      (community.orgs ?? []).map((item) => compactText([item.name, item.note, item.href]).join(" — ")),
    ),
    section(
      "In the work",
      (community.engagement ?? []).map((item) => `${item.who}: ${item.how}`),
    ),
  ];
  return {
    schemaVersion: "1.0.0",
    presentation: "plain_resource",
    title: community.title,
    summary: guide?.stand ?? community.stand ?? community.notThis,
    sections: removeEmptySections(sections),
    appliesTo: "agencywide",
  };
}

function religionRenderable(brief) {
  return {
    schemaVersion: "1.0.0",
    presentation: "plain_resource",
    title: brief.title,
    summary: brief.stand,
    sections: removeEmptySections(
      (brief.lessons ?? []).map((lesson) =>
        section(lesson.title, [lesson.body, lesson.gate?.evidence, lesson.gate?.practitioner]),
      ),
    ),
    appliesTo: "agencywide",
  };
}

function unmatchedGuideRenderable(guide) {
  return {
    schemaVersion: "1.0.0",
    presentation: "plain_resource",
    title: guide.title,
    summary: guide.stand,
    sections: removeEmptySections([
      section("Keep in mind", guide.frame ?? []),
      ...(guide.chapters ?? []).map((chapter) =>
        section(chapter.title, [chapter.evidence, chapter.practitioner, chapter.body]),
      ),
    ]),
    appliesTo: "agencywide",
  };
}

export function recoverCommunityCandidates() {
  const modules = loadPinnedGitTypescriptModules({
    commit: COMMUNITY_DONOR_COMMIT,
    entryPaths: [COMMUNITY_ENTRY_PATH, BRIEF_BODY_ENTRY_PATH, GUIDE_ENTRY_PATH, RELIGION_ENTRY_PATH],
    roots: COMMUNITY_ROOTS,
  });
  const communityModule = modules[COMMUNITY_ENTRY_PATH];
  const briefModule = modules[BRIEF_BODY_ENTRY_PATH];
  const guideModule = modules[GUIDE_ENTRY_PATH];
  const religionModule = modules[RELIGION_ENTRY_PATH];

  const communities = communityModule.COMMUNITIES;
  const briefBodies = briefModule.BRIEF_BODIES;
  const guides = guideModule.CI_GUIDES;
  const religions = religionModule.RELIGION_BRIEFS;
  assert(Array.isArray(communities) && communities.length === STAFF_COMMUNITY_COUNT, `Pinned staff registry contains ${communities?.length ?? 0}, not ${STAFF_COMMUNITY_COUNT}, community briefs.`);
  assert(Array.isArray(guides) && guides.length === 41, `Pinned intelligence registry contains ${guides?.length ?? 0}, not 41, guides.`);
  assert(Array.isArray(religions) && religions.length === RELIGION_BRIEF_COUNT, `Pinned religion registry contains ${religions?.length ?? 0}, not ${RELIGION_BRIEF_COUNT}, briefs.`);

  const guidesById = new Map(guides.map((guide) => [guide.id, guide]));
  const usedGuideIds = new Set();
  const records = communities.map((community, ordinal) => {
    const guide = guideForCommunity(community, guidesById);
    assert(guide, `Community ${community.id} has no full intelligence guide.`);
    usedGuideIds.add(guide.id);
    const briefBody = briefBodyForCommunity(community, briefBodies);
    return snapshotRecord({
      assetKind: "community_brief",
      assetId: community.id,
      contentItemId: `community-${community.id}`,
      contentKind: "community_brief",
      title: community.title,
      donor: donor([COMMUNITY_ENTRY_PATH, BRIEF_BODY_ENTRY_PATH, GUIDE_ENTRY_PATH], ordinal),
      richOriginal: {
        community,
        briefBody,
        intelligenceGuide: guide,
      },
      renderable: communityRenderable(community, guide, briefBody),
    });
  });

  const unmatchedGuides = guides.filter((guide) => !usedGuideIds.has(guide.id));
  assert(unmatchedGuides.length === UNMATCHED_GUIDE_COUNT, `Expected ${UNMATCHED_GUIDE_COUNT} unmatched guide; found ${unmatchedGuides.length}.`);
  for (const [index, guide] of unmatchedGuides.entries()) {
    records.push(snapshotRecord({
      assetKind: "community_brief_unmatched_guide",
      assetId: guide.id,
      contentItemId: `community-${guide.id}`,
      contentKind: "community_brief",
      title: guide.title,
      donor: donor([GUIDE_ENTRY_PATH], STAFF_COMMUNITY_COUNT + index),
      richOriginal: { intelligenceGuide: guide },
      renderable: unmatchedGuideRenderable(guide),
    }));
  }

  for (const [index, brief] of religions.entries()) {
    records.push(snapshotRecord({
      assetKind: "religion_brief",
      assetId: brief.id,
      contentItemId: `religion-${brief.id}`,
      contentKind: "community_brief",
      title: brief.title,
      donor: donor([RELIGION_ENTRY_PATH], STAFF_COMMUNITY_COUNT + UNMATCHED_GUIDE_COUNT + index),
      richOriginal: {
        track: religionModule.RELIGION_TRACK,
        brief,
      },
      renderable: religionRenderable(brief),
    }));
  }

  return validateSnapshotRecords(records, { count: GOVERNED_COMMUNITY_CANDIDATE_COUNT });
}

export function writeCommunitySnapshot() {
  return writeSnapshotFile(recoverCommunityCandidates(), "community-candidates.jsonl");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const receipt = writeCommunitySnapshot();
  console.log(JSON.stringify(receipt, null, 2));
}
