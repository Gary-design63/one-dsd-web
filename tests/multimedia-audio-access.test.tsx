// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { DsdFirstContactAudio } from "@/components/multimedia/dsd-first-contact-audio";
import { LearningDialogue, LEARNING_DIALOGUES } from "@/components/multimedia/learning-dialogue";

const manifest = JSON.parse(readFileSync("evidence/multimedia-review-2026-09-09/additional-audio-provenance.json", "utf8")) as {
  clips: { file: string; transcript: string; sha256: string; bytes: number; durationSeconds: number; courseId?: string; lessonId?: string }[];
};
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("keeps the DSD complete transcript and practice available after a playback failure", () => {
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const { container } = render(<DsdFirstContactAudio />);
  const players = Array.from(container.querySelectorAll("audio"));
  expect(players).toHaveLength(2);
  for (const player of players) {
    expect(player.controls).toBe(true);
    expect(player.preload).toBe("none");
    expect(player.autoplay).toBe(false);
    expect(player.getAttribute("aria-label")).toBeTruthy();
  }
  fireEvent.error(players[0]);
  expect(screen.getByRole("status").textContent).toContain("complete transcript");
  for (const clip of manifest.clips.filter(clip => !clip.courseId)) {
    const transcript = screen.getByText(clip.transcript);
    const details = transcript.closest("details")!;
    details.open = true;
    expect(details.open).toBe(true);
    expect(details.textContent).toContain(clip.transcript);
  }
  expect(screen.getByText(/neither performs translation or interpretation/)).toBeTruthy();
  expect(screen.getByText(/Identify who would verify it and own the follow-up/)).toBeTruthy();
  expect(storage).not.toHaveBeenCalled();
});

it.each([
  ["working-with-an-interpreter", "wi-time"],
  ["teams-in-minimization", "tm-lines"],
  ["brain-injury-and-complex-disability", "bi-pace-and-write-loop"],
])("retains each complete spoken moment when %s audio fails", (courseId, lessonId) => {
  const { container } = render(<LearningDialogue courseId={courseId} lessonId={lessonId} />);
  const players = Array.from(container.querySelectorAll("audio"));
  const clips = manifest.clips.filter(clip => clip.courseId === courseId);
  expect(players).toHaveLength(3);
  const example = LEARNING_DIALOGUES.find(example => example.courseId === courseId)!;
  players.forEach((player, index) => {
    expect(player.querySelector("source")!.getAttribute("src")).toBe("/audio/learning-examples/" + clips[index].file);
    expect(player.controls).toBe(true);
    expect(player.preload).toBe("none");
    expect(player.autoplay).toBe(false);
    fireEvent.error(player);
    expect(screen.getByText(clips[index].transcript).tagName).toBe("BLOCKQUOTE");
    expect(example.moments[index].dialogue).toBe(clips[index].transcript);
    expect(screen.getByText(example.moments[index].question)).toBeTruthy();
  });
});

it("ships the exact verified WAVs and readable transcript downloads", () => {
  expect(manifest.clips).toHaveLength(11);
  for (const clip of manifest.clips) {
    const bytes = readFileSync("public/audio/learning-examples/" + clip.file);
    expect(bytes.subarray(0, 4).toString()).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString()).toBe("WAVE");
    expect(bytes.length).toBe(clip.bytes);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(clip.sha256);
    expect(clip.durationSeconds).toBeGreaterThan(3);
    expect(clip.durationSeconds).toBeLessThan(45);
    expect(readFileSync("public/audio/learning-examples/" + clip.file.replace(".wav", ".txt"), "utf8").trim()).toBe(clip.transcript);
  }
});
