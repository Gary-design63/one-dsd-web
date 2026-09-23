import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { LEARNING_COMPANIONS } from "@/components/multimedia/learning-companion-data";
import { LEARNING_CHART_ROUTES } from "@/components/multimedia/learning-evidence-chart";
import { LEARNING_DIALOGUES, LEARNING_MOMENT_AUDIO } from "@/components/multimedia/learning-dialogue";
import { LEARNING_HISTORY_ROUTES } from "@/components/multimedia/learning-history";
import { LearningCompanion } from "@/components/multimedia/learning-companion";

const root = process.cwd();
const recommendationPath = "evidence/multimedia-review-2026-09-09/course-opportunities.json";
const recommendations = JSON.parse(fs.readFileSync(path.join(root, recommendationPath), "utf8")) as { id: string; placement: string; media: string; purpose: string; proposal: string; accessibleEquivalent: string; source: string }[];
const specialized = [
  { courseId: "plain-language-in-human-services", lessonId: "pl-how" },
  { courseId: "critical-incidents-in-the-work", lessonId: "ci-write" },
];
const additions = [...LEARNING_COMPANIONS, ...LEARNING_CHART_ROUTES, ...LEARNING_DIALOGUES, ...LEARNING_HISTORY_ROUTES, ...specialized];

it("accounts for all 58 selected recommendations through a real exact lesson and a single companion or explicit reuse", () => {
  expect(recommendations).toHaveLength(58);
  for (const row of recommendations) {
    const lessonId = row.placement.split("/").at(-1)!;
    const lesson = RECOVERED_COURSES.find(pack => pack.course.id === row.id)?.course.lessons.find(item => item.id === lessonId);
    expect(lesson, row.id).toBeDefined();
    expect(lesson!.blocks.length, row.id).toBeGreaterThan(0);
    const matching = additions.filter(item => item.courseId === row.id && item.lessonId === lessonId);
    expect(matching.length, row.id).toBe(row.media.startsWith("Reuse") ? 0 : 1);
    if (row.media.startsWith("Reuse")) {
      expect(row.proposal.length).toBeGreaterThan(60);
      expect(lesson!.blocks.some(block => ["text", "tabs", "list", "timeline", "accordion", "flashcards", "image"].includes(block.type)), row.id).toBe(true);
    }
  }
});

it("keeps all new dialogue/history companions scoped and provides text when media is unavailable", () => {
  for (const item of [...LEARNING_DIALOGUES, ...LEARNING_HISTORY_ROUTES]) {
    const html = renderToStaticMarkup(<LearningCompanion courseId={item.courseId} lessonId={item.lessonId} />);
    expect(html, item.courseId).toContain("<section");
    expect(html).toContain("lesson notes");
    expect(html).not.toMatch(/autoplay|<iframe|localStorage|data-track/);
    expect(renderToStaticMarkup(<LearningCompanion courseId={item.courseId} lessonId="not-this-lesson" />)).toBe("");
  }
  for (const item of LEARNING_DIALOGUES) {
    const html = renderToStaticMarkup(<LearningCompanion courseId={item.courseId} lessonId={item.lessonId} />);
    expect(html).toContain("Consider the response");
    for (const [index, fileName] of (LEARNING_MOMENT_AUDIO[item.courseId] ?? []).entries()) {
      const file = fs.readFileSync(path.join(root, "public/audio/learning-examples", fileName));
      expect(file.subarray(0, 4).toString()).toBe("RIFF");
      expect(file.length).toBeGreaterThan(10000);
      expect(fs.readFileSync(path.join(root, "public/audio/learning-examples", fileName.replace(".wav", ".txt")), "utf8").trim()).toBe(item.moments[index].dialogue);
      expect(html).toContain(fileName);
      expect(html).toContain("synthetic English narration");
    }
    for (const clip of item.audio ?? []) {
      const file = fs.readFileSync(path.join(root, "public/audio/learning-examples", clip.file));
      expect(file.subarray(0, 4).toString()).toBe("RIFF");
      expect(file.subarray(8, 12).toString()).toBe("WAVE");
      expect(file.length).toBeGreaterThan(10000);
      expect(html).toContain('preload="none"');
      expect(clip.transcript.length).toBeGreaterThan(30);
    }
  }
});

it("retains the public-history attribution and date correction without modifying source blocks", () => {
  const rondo = renderToStaticMarkup(<LearningCompanion courseId="cultural-intelligence-african-american" lessonId="ci-african-american-place-5" />);
  expect(rondo).toContain("listed as public domain");
  expect(rondo).toContain("schematic, not a parcel or route-alignment map");
  expect(rondo).toContain("da3af29276dc4d54a571e587fc972948");
  expect(fs.statSync(path.join(root, "public/images/learning-history/rondo-avenue-c1900.jpg")).size).toBeGreaterThan(10000);
  const hmong = renderToStaticMarkup(<LearningCompanion courseId="cultural-intelligence-hmong" lessonId="ci-hmong-orientation-2" />);
  expect(hmong).toContain("November 1975");
  expect(hmong).toContain("lesson above says December 1975");
  const original = RECOVERED_COURSES.find(pack => pack.course.id === "cultural-intelligence-hmong")!.course.lessons.find(lesson => lesson.id === "ci-hmong-orientation-2")!;
  expect(JSON.stringify(original.blocks)).toContain("December 1975");
});

it("writes an exact local integration receipt that does not claim browser or whole-corpus completion", () => {
  const resources = recommendations.map(row => {
    const lessonId = row.placement.split("/").at(-1)!;
    const reuse = row.media.startsWith("Reuse");
    const type = reuse ? "reuse-existing" : LEARNING_COMPANIONS.some(x => x.courseId === row.id) ? "native-annotated-example" : LEARNING_CHART_ROUTES.some(x => x.courseId === row.id) ? "chart-and-full-data-table" : LEARNING_DIALOGUES.some(x => x.courseId === row.id) ? "dialogue-with-transcript-and-response" : LEARNING_HISTORY_ROUTES.some(x => x.courseId === row.id) ? "sourced-history-or-data-context" : row.id === "critical-incidents-in-the-work" ? "photographic-manual-scene" : "interactive-document-comparison";
    return { courseId: row.id, lessonId, route: `/courses/${row.id}/${lessonId}`, purpose: row.purpose, proposedMedium: row.media, implementedMedium: type, originalProposal: row.proposal, placement: reuse ? "Existing lesson blocks retained" : "Separate CourseLesson companion slot before final reflection; indexed source blocks retained", provenance: reuse ? row.source : "Original program-authored fictional example; history sources and photograph rights cited in component", accessibility: reuse ? row.accessibleEquivalent : "Native headings and complete readable text; keyboard details; charts have data tables; audio has full transcript and no autoplay; photograph has alt text", state: reuse ? "reuse-source-verified" : "integrated-component-tested", browserVerified: false };
  });
  const receipt = {
    generatedAt: new Date().toISOString(), scope: "58 selected exact lesson recommendations only; not all 780 lessons or the whole resource corpus",
    counts: { recommendations: recommendations.length, additions: additions.length, reuse: resources.filter(x => x.state === "reuse-source-verified").length, nativeExamples: LEARNING_COMPANIONS.length, chartLessons: LEARNING_CHART_ROUTES.length, dialogueLessons: LEARNING_DIALOGUES.length, sourcedContextLessons: LEARNING_HISTORY_ROUTES.length, previouslyIntegratedSpecializedLessons: specialized.length },
    check: "Selected-route resolution, no duplicate companions, native rendering, source-block preservation, local WAV/image presence and transcript availability; actual browser verification recorded separately by root",
    sourceSha256: createHash("sha256").update(fs.readFileSync(path.join(root, "lib/content/courses/recovered.json"))).digest("hex"),
    limitations: ["This receipt is local component evidence, not production publication or participant benefit.", "Manual described conversations adapt proposed videos; no claim of filmed actors or full-motion video.", "Historical timelines are selected dates, not complete migration histories.", "Rondo local orientation is an explicitly schematic diagram; archival parcel map opens at the MnDOT-linked source.", "MNHS November 1975 arrival date differs from preserved December wording in the Hmong source lesson.", "Audio is synthetic English narration; no claimed interpreter translation or cultural accent."], resources,
  };
  fs.writeFileSync(path.join(root, "evidence/multimedia-review-2026-09-09/learning-media-status.json"), JSON.stringify(receipt, null, 2) + "\n");
  expect(receipt.counts.additions + receipt.counts.reuse).toBe(58);
});
