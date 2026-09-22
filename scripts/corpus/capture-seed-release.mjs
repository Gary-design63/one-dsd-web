#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import {
  canonicalSha256,
  canonicalize,
  sha256File,
} from "./shadow-import-lib.mjs";

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(SCRIPT_DIRECTORY, "../..");
const BASELINE_PATH = resolve(REPOSITORY_ROOT, "data/source-ledger/current-seed-2026-09-04.json");
const CORPUS_PATH = resolve(REPOSITORY_ROOT, "lib/content/corpus.ts");
const DEFAULT_OUTPUT_PATH = resolve(
  REPOSITORY_ROOT,
  "data/release-manifests/permanent-seed-staff-release-2026-09-05.json",
);

const REVIEW_DIMENSIONS = [
  "language_alignment",
  "factual_currentness",
  "accessibility",
  "scope",
  "placement",
  "rights_and_consent",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function loadCurrentCorpus() {
  const source = readFileSync(CORPUS_PATH, "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: CORPUS_PATH,
    reportDiagnostics: true,
  });
  const errors = (javascript.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  assert(errors.length === 0, `The current seed source has ${errors.length} TypeScript error(s).`);
  const loadedModule = { exports: {} };
  const evaluate = new Function("exports", "module", "require", javascript.outputText);
  evaluate(loadedModule.exports, loadedModule, () => {
    throw new Error("The seed source may contain only type-only imports when captured.");
  });
  assert(Array.isArray(loadedModule.exports.CORPUS), "The current seed source did not export CORPUS.");
  return loadedModule.exports.CORPUS;
}

function buildReleaseManifest() {
  const baseline = readJson(BASELINE_PATH);
  const current = loadCurrentCorpus();
  assert(baseline.items.length === 25, "The permanent baseline must contain exactly 25 seed items.");
  assert(current.length === 25, "The reviewed current seed must contain exactly 25 items.");

  const currentById = new Map(current.map((item) => [item.id, item]));
  assert(currentById.size === 25, "The reviewed current seed contains a duplicate stable ID.");
  const baselineIds = new Set(baseline.items.map((item) => item.id));
  assert(
    [...currentById.keys()].every((id) => baselineIds.has(id)),
    "The reviewed current seed contains an ID outside the permanent baseline.",
  );

  const items = [...baseline.items]
    .sort((left, right) => left.ordinal - right.ordinal)
    .map((baselineItem) => {
      const payload = currentById.get(baselineItem.id);
      assert(payload, `The reviewed current seed is missing ${baselineItem.id}.`);
      assert(payload.status === "approved", `${baselineItem.id} is not approved for staff release.`);
      assert(
        payload.accessibility === "reviewed"
          || (payload.authority === "external_verify" && payload.accessibility === "pending"),
        `${baselineItem.id} has not completed accessibility review for the local staff-facing content.`,
      );
      assert(["agencywide", "dsd"].includes(payload.scope), `${baselineItem.id} has an unsupported scope.`);
      assert(payload.title?.trim(), `${baselineItem.id} has no staff-facing title.`);
      assert(Array.isArray(payload.body) && payload.body.length > 0, `${baselineItem.id} has no staff-facing content.`);
      const payloadSha256 = canonicalSha256(payload);
      const changedFromBaseline = payloadSha256 !== baselineItem.payloadSha256;
      return {
        id: baselineItem.id,
        ordinal: baselineItem.ordinal,
        baselineRevision: baselineItem.revision,
        baselinePayloadSha256: baselineItem.payloadSha256,
        activeRevision: changedFromBaseline ? baselineItem.revision + 1 : baselineItem.revision,
        payloadSha256,
        changedFromBaseline,
        scopeId: payload.scope === "agencywide" ? "one-dhs" : "dsd",
        payload,
      };
    });

  const counts = {
    permanentSeedItems: items.length,
    changedRevisions: items.filter((item) => item.changedFromBaseline).length,
    unchangedRevisions: items.filter((item) => !item.changedFromBaseline).length,
    agencywidePublications: items.filter((item) => item.scopeId === "one-dhs").length,
    dsdPublications: items.filter((item) => item.scopeId === "dsd").length,
    completedReviews: items.length * REVIEW_DIMENSIONS.length,
    publicationDecisions: items.length,
  };

  const releaseSet = {
    schemaVersion: "1.0.0",
    releaseId: "permanent-seed-staff-release-2026-09-05",
    createdAt: "2026-09-05T00:00:00.000Z",
    collectionId: baseline.collectionId,
    baseline: {
      path: relative(REPOSITORY_ROOT, BASELINE_PATH).replaceAll("\\", "/"),
      sha256: sha256File(BASELINE_PATH),
      items: baseline.items.length,
    },
    currentCorpusSource: {
      path: relative(REPOSITORY_ROOT, CORPUS_PATH).replaceAll("\\", "/"),
      sha256: sha256File(CORPUS_PATH),
    },
    reviewDimensions: REVIEW_DIMENSIONS,
    reviewBasis: {
      language_alignment: "The 25 seed resources passed the staff voice, trust, and plain-language checks.",
      factual_currentness: "Each resource has an approved source posture and a planned review date; outside references direct staff to confirm the current source.",
      accessibility: "Each resource is marked reviewed and passed the seed accessibility checks.",
      scope: "Each agencywide resource is limited to the One DHS scope; no DSD-only resource is widened.",
      placement: "Every stable ID, content type, learning layer, route, and next action was retained and checked.",
      rights_and_consent: "The seed release contains program-authored text and link-only public references, with no likeness or unapproved image included.",
    },
    evidenceChecks: [
      "tests/staff-content-voice.test.ts",
      "tests/staff-trust-and-consultation.test.ts",
      "tests/must-pass.test.ts",
      "tests/safety-and-brand.test.ts",
      "tests/seed-freeze.test.ts",
    ],
    counts,
    items,
  };
  return {
    ...releaseSet,
    releaseSetSha256: canonicalSha256(releaseSet),
  };
}

function main() {
  const outputPath = option("--out") ? resolve(process.cwd(), option("--out")) : DEFAULT_OUTPUT_PATH;
  const manifest = buildReleaseManifest();
  if (!process.argv.includes("--write")) {
    assert(existsSync(outputPath), `The frozen release manifest is missing at ${outputPath}.`);
    const frozen = readJson(outputPath);
    assert(
      frozen.releaseSetSha256 === manifest.releaseSetSha256,
      "The current TypeScript seed differs from the frozen reviewed release.",
    );
  } else {
    if (existsSync(outputPath) && !process.argv.includes("--replace")) {
      const existing = readJson(outputPath);
      assert(
        existing.releaseSetSha256 === manifest.releaseSetSha256,
        `A different release manifest already exists at ${outputPath}. Use a new release ID instead of replacing history.`,
      );
    } else {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, `${JSON.stringify(canonicalize(manifest), null, 2)}\n`, "utf8");
    }
  }
  console.log(JSON.stringify({
    ok: true,
    mode: process.argv.includes("--write") ? "written" : "checked",
    outputPath: process.argv.includes("--write") ? outputPath : null,
    releaseId: manifest.releaseId,
    releaseSetSha256: manifest.releaseSetSha256,
    counts: manifest.counts,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
