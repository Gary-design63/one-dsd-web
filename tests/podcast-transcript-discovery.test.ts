import { afterEach, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { PODCASTS } from "@/lib/content/podcasts";
import * as publications from "@/lib/content/editable-surfaces";
import { indexedProgramResources, programResourceLinks } from "@/lib/intelligence/retrieval/program-resources";
import { publishedPodcastReadings, MAX_PODCAST_READING_CHARACTERS } from "@/lib/intelligence/retrieval/podcast-reading";
import actualTranscript from "@/public/audio/transcripts/dhs-equity-policy-and-toolkit.json";
import antiRacismTranscript from "@/public/audio/transcripts/anti-racism-public-service.json";

afterEach(() => vi.restoreAllMocks());
const podcast = PODCASTS.find(podcast => podcast.id === "equity-toolkit")!;

it.each(["one-dhs", "dsd"] as const)("finds recording-derived sustainability content in the published podcast in %s", async scope => {
  const rows = await publications.loadPublishedEditableSurfaces([podcast.surfaceId], scope);
  expect(rows).toHaveLength(1);
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockResolvedValue(rows);
  const index = await indexedProgramResources(scope);
  expect(index.destinations).toHaveLength(1);
  const doc = index.destinations[0];
  expect(JSON.stringify(rows[0].values).toLowerCase()).not.toContain("sustainability");
  expect(actualTranscript.segments.some(segment => segment.text.toLowerCase().includes("sustainability"))).toBe(true);
  expect(doc.text).toContain("Step eight is sustainability.");
  expect(doc.text).toContain(actualTranscript.segments.at(-1)!.text);
  expect(programResourceLinks("sustainability", index.destinations)).toContainEqual({ label: `Open ${podcast.title}`, href: podcast.href });
  expect(doc.summary).toContain("machine-generated");
  expect(doc.text).toContain("not an official transcript");
  expect(doc.evidenceRevisions?.[0]).toEqual({ sourceId: rows[0].surfaceId, revisionId: rows[0].revisionId, payloadHash: createHash("sha256").update(JSON.stringify(rows[0].document)).digest("hex"), scope: rows[0].sourceScope });
  expect(doc.evidenceRevisions?.[1].sourceId).toBe(`${podcast.surfaceId}.machine-transcript`);
  expect(doc.evidenceRevisions?.[1].payloadHash).toMatch(/^[a-f0-9]{64}$/);
});

it("drops transcript terms immediately when the podcast is withdrawn, including after a cached read", async () => {
  const rows = await publications.loadPublishedEditableSurfaces([podcast.surfaceId], "one-dhs");
  const reader = vi.spyOn(publications, "loadPublishedEditableSurfaces").mockResolvedValue(rows);
  expect((await indexedProgramResources("one-dhs")).destinations[0].text).toContain("sustainability");
  reader.mockResolvedValue([]);
  const withdrawn = await indexedProgramResources("one-dhs");
  expect(withdrawn.destinations).toEqual([]);
  expect(programResourceLinks("sustainability", withdrawn.destinations)).toEqual([]);
  expect(publishedPodcastReadings([]).size).toBe(0);
});

it("does not carry a one-dhs recording into a scoped publication response that omits it", async () => {
  const rows = await publications.loadPublishedEditableSurfaces([podcast.surfaceId], "one-dhs");
  vi.spyOn(publications, "loadPublishedEditableSurfaces").mockImplementation(async (_ids, scope) => scope === "one-dhs" ? rows : []);
  expect((await indexedProgramResources("one-dhs")).destinations).toHaveLength(1);
  expect((await indexedProgramResources("dsd")).destinations).toEqual([]);
});

it("bounds a single reading supplement and includes no unscoped companion record", async () => {
  const rows = await publications.loadPublishedEditableSurfaces([podcast.surfaceId], "one-dhs");
  const readings = publishedPodcastReadings(rows);
  expect(readings.size).toBe(1);
  const reading = readings.get(podcast.surfaceId)!;
  expect(reading.text.length).toBeLessThanOrEqual(MAX_PODCAST_READING_CHARACTERS);
  expect(reading.text).toContain(actualTranscript.segments.at(-1)!.text);
  expect(reading.text.split(actualTranscript.segments[0].text)).toHaveLength(2);
});

it("indexes the second actual recording once and removes only its text when withdrawn", async () => {
  const antiRacism = PODCASTS.find(podcast => podcast.id === "anti-racism-public-service")!;
  const rows = await publications.loadPublishedEditableSurfaces(PODCASTS.map(podcast => podcast.surfaceId), "dsd");
  const reader = vi.spyOn(publications, "loadPublishedEditableSurfaces").mockResolvedValue(rows);
  const index = await indexedProgramResources("dsd");
  expect(index.destinations).toHaveLength(2);
  const recording = index.destinations.find(doc => doc.href === antiRacism.href)!;
  expect(recording.text).toContain(antiRacismTranscript.segments[0].text);
  expect(recording.text).toContain(antiRacismTranscript.segments.at(-1)!.text);
  expect(recording.text).toContain("Both positions are too simple.");
  expect(recording.text.split(antiRacismTranscript.segments[0].text)).toHaveLength(2);
  expect(recording.summary).toContain("machine-generated");
  reader.mockResolvedValue(rows.filter(row => row.surfaceId !== antiRacism.surfaceId));
  const withdrawn = await indexedProgramResources("dsd");
  expect(withdrawn.destinations).toHaveLength(1);
  expect(withdrawn.destinations[0].href).toBe(podcast.href);
  expect(withdrawn.destinations[0].text).not.toContain(antiRacismTranscript.segments[0].text);
});
