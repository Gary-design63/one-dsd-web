import { fileURLToPath } from "node:url";

import { loadPinnedGitTypescriptModule, readPinnedGitJson } from "./git-typescript-snapshot-lib.mjs";
import {
  assert,
  removeEmptySections,
  section,
  snapshotRecord,
  validateSnapshotRecords,
  writeSnapshotFile,
} from "./donor-snapshot-lib.mjs";

export const DOMAIN_DONOR_COMMIT = "5680911e68dcf07414de5f003b18ac8e813a8cb1";
export const DOMAIN_DONOR_REPOSITORY = "alphaequity123-afk/one-dhs-equity-resource";
export const DOMAIN_CANDIDATE_COUNT = 34;

const DOMAIN_ENTRY_PATH = "lib/content/corpus-domains.ts";
const DOMAIN_MANIFEST_PATH = "data/release-manifests/domain-collection-2026-09-05.json";

function itemRenderable(item) {
  return {
    schemaVersion: "1.0.0",
    presentation: "plain_resource",
    title: item.title,
    summary: item.summary ?? item.whyItMatters ?? "",
    sections: removeEmptySections([
      section("Why this matters", [item.whyItMatters]),
      section("What to know", item.body ?? []),
      section(
        "Where to go next",
        (item.nextActions ?? []).map((action) => `${action.label}${action.href ? ` — ${action.href}` : ""}`),
      ),
    ]),
    appliesTo: item.scope ?? "agencywide",
    resourceType: item.type ?? "resource",
  };
}

export function recoverDomainCandidates() {
  const domainModule = loadPinnedGitTypescriptModule({
    commit: DOMAIN_DONOR_COMMIT,
    entryPath: DOMAIN_ENTRY_PATH,
    roots: ["lib/content"],
  });
  const manifest = readPinnedGitJson(DOMAIN_DONOR_COMMIT, DOMAIN_MANIFEST_PATH);
  const items = domainModule.DOMAIN_CORPUS;
  assert(Array.isArray(items) && items.length === DOMAIN_CANDIDATE_COUNT, `Pinned domain collection contains ${items?.length ?? 0}, not ${DOMAIN_CANDIDATE_COUNT}, resources.`);
  assert(manifest.count === DOMAIN_CANDIDATE_COUNT && manifest.items?.length === DOMAIN_CANDIDATE_COUNT, "Pinned domain release manifest count does not match its item list.");
  const manifestById = new Map(manifest.items.map((item) => [item.id, item]));
  assert(manifestById.size === DOMAIN_CANDIDATE_COUNT, "Pinned domain release manifest contains duplicate IDs.");

  const records = items.map((item, ordinal) => {
    const releaseRecord = manifestById.get(item.id);
    assert(releaseRecord, `Domain resource ${item.id} is absent from its pinned release manifest.`);
    assert(releaseRecord.title === item.title, `Domain resource ${item.id} title differs from its release manifest.`);
    return snapshotRecord({
      assetKind: "domain_resource",
      assetId: item.id,
      contentItemId: item.id,
      contentKind: "resource",
      title: item.title,
      donor: {
        repository: DOMAIN_DONOR_REPOSITORY,
        commit: DOMAIN_DONOR_COMMIT,
        entryPaths: [DOMAIN_ENTRY_PATH, DOMAIN_MANIFEST_PATH],
        registryOrdinal: ordinal,
        capturedFrom: "pinned_git_tree",
      },
      richOriginal: {
        contentItem: item,
        releaseRecord,
      },
      renderable: itemRenderable(item),
    });
  });
  assert(
    items.every((item) => manifestById.has(item.id)) && manifest.items.every((item) => items.some((candidate) => candidate.id === item.id)),
    "Pinned domain collection and release manifest do not have the same IDs.",
  );
  return validateSnapshotRecords(records, { count: DOMAIN_CANDIDATE_COUNT });
}

export function writeDomainSnapshot() {
  return writeSnapshotFile(recoverDomainCandidates(), "domain-candidates.jsonl");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const receipt = writeDomainSnapshot();
  console.log(JSON.stringify(receipt, null, 2));
}
