import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PODCASTS } from "@/lib/content/podcasts";
import * as publications from "@/lib/content/editable-surfaces";
import { indexedProgramResources } from "@/lib/intelligence/retrieval/program-resources";
import { evidenceForDoc, validateEvidenceClaims } from "@/lib/intelligence/retrieval/evidence";
import type { Citation } from "@/lib/intelligence/retrieval/search";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

beforeEach(() => { resetStoreForTests(); invalidatePolicyCache(); });
afterEach(() => vi.restoreAllMocks());

it("does not send a typed staff Ask question through the podcast transcript", async () => {
  await expectStaffAskClosed();
});

it("keeps transcript-derived podcast evidence on the published recording, not a typed Ask answer", async () => {
  const podcast = PODCASTS.find((item) => item.id === "equity-toolkit")!;
  const rows = await publications.loadPublishedEditableSurfaces([podcast.surfaceId], "one-dhs");
  const published = vi.spyOn(publications, "loadPublishedEditableSurfaces").mockResolvedValue(rows);
  const index = await indexedProgramResources("one-dhs");
  const doc = index.destinations.find((item) => item.href === podcast.href)!;
  expect(doc.title).toBe(podcast.title);
  const evidence = evidenceForDoc(doc, "Step eight is sustainability.");
  const citedPassage: Citation = {
    id: doc.id,
    title: podcast.title,
    href: podcast.href,
    authority: "practice_note",
    authorityLabel: "Practice note",
    reviewDate: doc.reviewDate,
    excerpt: evidence.excerpt.quote,
    citeable: true,
    evidence,
  };
  const claim = { kind: "source_excerpt" as const, text: evidence.excerpt.quote, references: [{ evidenceId: evidence.evidenceId, ...evidence.excerpt }] };
  expect(validateEvidenceClaims([claim], [citedPassage], index.destinations)).toEqual([claim]);
  const changedHash = { ...doc, evidenceRevisions: doc.evidenceRevisions!.map((revision) => revision.sourceId.endsWith(".machine-transcript") ? { ...revision, payloadHash: "a".repeat(64) } : revision) };
  expect(() => validateEvidenceClaims([claim], [citedPassage], [changedHash])).toThrow("generated_evidence_rejected");
  published.mockResolvedValue([]);
  const withdrawn = await indexedProgramResources("one-dhs");
  expect(() => validateEvidenceClaims([claim], [citedPassage], withdrawn.destinations)).toThrow("generated_evidence_rejected");
});
