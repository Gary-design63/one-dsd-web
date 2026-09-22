// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PodcastPlayer } from "@/components/podcast-player";
import type { PodcastReadingSupport } from "@/components/podcast-transcript-data";

const props = { id: "fixture", src: "/fictional-audio.mp3", title: "Fictional recording", intro: "A test-only recording.", downloadLabel: "Download", retryLabel: "Try again", errorMessage: "The recording could not be played." };
const support: PodcastReadingSupport = { transcript: { status: "machine-generated", segments: [
  { start: 0, end: 10, text: "This is the complete first fictional passage." },
  { start: 15.5, end: 24, text: "This is the complete second fictional passage." },
] }, chapters: [{ start: 15.5, title: "An agreed next step" }] };
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function openTranscript() {
  fireEvent.click(screen.getByText("Read the complete transcript"));
}

it("retains native playback without loading or playing before an explicit request", () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const { container } = render(<PodcastPlayer {...props} {...support} />);
  const audio = container.querySelector("audio")!;
  expect(audio.preload).toBe("none");
  expect(audio.autoplay).toBe(false);
  expect(audio.controls).toBe(true);
  expect(play).not.toHaveBeenCalled();
  expect(load).not.toHaveBeenCalled();
  expect(screen.getByText(/has not been checked word for word against the recording/)).toBeTruthy();
  expect(screen.queryByText("Transcript reviewed against the recording.")).toBeNull();
});

it("seeks to the selected transcript time and plays only on the user's request", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const { container } = render(<PodcastPlayer {...props} {...support} />);
  const audio = container.querySelector("audio")!;
  Object.defineProperty(audio, "readyState", { configurable: true, value: 1 });
  Object.defineProperty(audio, "duration", { configurable: true, value: 30 });
  openTranscript();
  fireEvent.click(screen.getByRole("button", { name: "Play from 0:15" }));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  expect(audio.currentTime).toBe(15.5);
  expect(screen.getByText("This is the complete second fictional passage.")).toBeTruthy();
});

it("waits for metadata before applying a chapter seek to a lazy recording", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const { container } = render(<PodcastPlayer {...props} {...support} />);
  const audio = container.querySelector("audio")!;
  fireEvent.click(screen.getByRole("button", { name: "Play from 0:15 · An agreed next step" }));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  expect(load).toHaveBeenCalledTimes(1);
  expect(audio.currentTime).toBe(0);
  Object.defineProperty(audio, "duration", { configurable: true, value: 30 });
  fireEvent.loadedMetadata(audio);
  expect(audio.currentTime).toBe(15.5);
});

it("keeps the exact transcript readable after playback rejection and supports retry", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValueOnce(new Error("unavailable")).mockResolvedValue();
  const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  render(<PodcastPlayer {...props} {...support} />);
  openTranscript();
  fireEvent.click(screen.getByRole("button", { name: "Play from 0:15" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain(props.errorMessage));
  expect(screen.getByText("This is the complete first fictional passage.")).toBeTruthy();
  expect(screen.getByText("This is the complete second fictional passage.")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  expect(load).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("alert")).toBeNull();
});

it("never invents a transcript or chapter when recording-derived data is absent", () => {
  render(<PodcastPlayer {...props} />);
  expect(screen.queryByText("Read the complete transcript")).toBeNull();
  expect(screen.queryByRole("navigation")).toBeNull();
  expect(screen.queryByText(/reviewed against/)).toBeNull();
});

it("retains text with invalid timing without creating an unusable seek control", () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  render(<PodcastPlayer {...props} transcript={{ status: "machine-generated", segments: [{ start: -1, end: 2, text: "A passage whose timing needs correction." }] }} />);
  expect(screen.getByText("A passage whose timing needs correction.")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Play from/ })).toBeNull();
  expect(play).not.toHaveBeenCalled();
});

it("loads a large transcript only when the reader opens it, then searches the actual passages", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(support.transcript)));
  render(<PodcastPlayer {...props} transcriptUrl="/transcripts/fixture.json" />);
  expect(fetch).not.toHaveBeenCalled();
  openTranscript();
  await waitFor(() => expect(screen.getByText("This is the complete second fictional passage.")).toBeTruthy());
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith("/transcripts/fixture.json");
  fireEvent.change(screen.getByLabelText("Find words in this transcript"), { target: { value: "second" } });
  expect(screen.queryByText("This is the complete first fictional passage.")).toBeNull();
  expect(screen.getByText("This is the complete second fictional passage.")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Show the complete transcript" }));
  expect(screen.getByText("This is the complete first fictional passage.")).toBeTruthy();
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("reports a transcript fetch failure independently and retries without playing audio", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("offline")).mockResolvedValue(new Response(JSON.stringify(support.transcript)));
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  render(<PodcastPlayer {...props} transcriptUrl="/transcripts/fixture.json" />);
  openTranscript();
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("transcript could not be loaded"));
  fireEvent.click(screen.getByRole("button", { name: "Try loading the transcript again" }));
  await waitFor(() => expect(screen.getByText("This is the complete first fictional passage.")).toBeTruthy());
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(play).not.toHaveBeenCalled();
});

it("rejects a summary object instead of presenting it as a transcript", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ summary: "Not the spoken words", status: "reviewed" })));
  render(<PodcastPlayer {...props} transcriptUrl="/transcripts/fixture.json" />);
  openTranscript();
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("transcript could not be loaded"));
  expect(screen.queryByText("Not the spoken words")).toBeNull();
  expect(screen.queryByText("Transcript reviewed against the recording.")).toBeNull();
});
