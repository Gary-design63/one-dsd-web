"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { SharePage } from "@/components/share-page";
import { podcastShareHref } from "@/lib/product/share-link";
import type { PodcastReadingSupport, PodcastTranscript } from "./podcast-transcript-data";

type PodcastPlayerProps = PodcastReadingSupport & {
  headingLevel?: 1 | 2 | 3;
  /** True when the player is on the podcast's own page, so it does not link to itself. */
  ownPage?: boolean;
  id: string;
  src: string;
  title: string;
  intro: string;
  downloadLabel: string;
  retryLabel: string;
  errorMessage: string;
};

function timestamp(seconds: number) {
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor(whole / 60) % 60;
  const rest = String(whole % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
}
function usableTime(seconds: number) { return Number.isFinite(seconds) && seconds >= 0; }

function readTranscript(value: unknown): PodcastTranscript {
  if (!value || typeof value !== "object" || !("segments" in value) || !Array.isArray(value.segments)) throw new Error("Transcript format is unavailable");
  const segments = value.segments.map((segment: unknown) => {
    if (!segment || typeof segment !== "object" || !("text" in segment) || typeof segment.text !== "string" || !("start" in segment) || typeof segment.start !== "number" || !("end" in segment) || typeof segment.end !== "number") throw new Error("Transcript passage is incomplete");
    return { text: segment.text, start: segment.start, end: segment.end };
  });
  if (!segments.length) throw new Error("Transcript has no passages");
  return { status: "status" in value && value.status === "reviewed" ? "reviewed" : "machine-generated", segments };
}

export function PodcastPlayer({ headingLevel = 3, ownPage = false, id, src, title, intro, downloadLabel, retryLabel, errorMessage, transcript, transcriptUrl, chapters }: PodcastPlayerProps) {
  const Heading = headingLevel === 1 ? "h1" : headingLevel === 2 ? "h2" : "h3";
  const player = useRef<HTMLAudioElement>(null);
  const [failed, setFailed] = useState(false);
  const pendingSeek = useRef<number | null>(null);
  const [loadedTranscript, setLoadedTranscript] = useState<PodcastTranscript | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptFailed, setTranscriptFailed] = useState(false);
  const [transcriptQuery, setTranscriptQuery] = useState("");
  const titleId = `podcast-${id}-title`;
  const detailsId = `podcast-${id}-details`;
  const errorId = `podcast-${id}-error`;
  const playerId = `podcast-${id}-audio`;
  const reading = transcript ?? loadedTranscript;
  const query = transcriptQuery.trim().toLocaleLowerCase();
  const passages = reading?.segments.filter(segment => !query || segment.text.toLocaleLowerCase().includes(query)) ?? [];

  async function loadTranscript() {
    if (!transcriptUrl || reading || transcriptLoading) return;
    setTranscriptLoading(true);
    setTranscriptFailed(false);
    try {
      if (!transcriptUrl.startsWith("/") || transcriptUrl.startsWith("//")) throw new Error("A local transcript is required");
      const response = await fetch(transcriptUrl);
      if (!response.ok) throw new Error("Transcript could not be loaded");
      setLoadedTranscript(readTranscript(await response.json()));
    } catch { setTranscriptFailed(true); }
    finally { setTranscriptLoading(false); }
  }

  function applyPendingSeek() {
    const audio = player.current;
    const seconds = pendingSeek.current;
    if (!audio || seconds === null) return true;
    try {
      if (Number.isFinite(audio.duration) && seconds > audio.duration) throw new Error("Time is outside the recording");
      audio.currentTime = seconds;
      pendingSeek.current = null;
      return true;
    } catch { setFailed(true); return false; }
  }

  async function playFrom(seconds: number) {
    const audio = player.current;
    if (!audio || !usableTime(seconds)) return;
    setFailed(false);
    pendingSeek.current = seconds;
    try {
      if (audio.readyState >= 1 && !applyPendingSeek()) return;
      if (audio.readyState < 1) audio.load();
      await audio.play();
    } catch { setFailed(true); }
  }

  async function retry() {
    setFailed(false);
    const audio = player.current;
    if (!audio) return;
    audio.load();
    try { await audio.play(); } catch { setFailed(true); }
  }

  return <section id={`podcast-${id}`} className="space-y-3 border-t border-line pt-6 print:hidden" aria-labelledby={titleId}>
    <Heading id={titleId} className={headingLevel === 1 ? "text-4xl font-semibold" : "text-2xl font-semibold"}>{title}</Heading>
    <p id={detailsId}>{intro}</p>
    <audio id={playerId} ref={player} src={src} controls preload="none" className="w-full max-w-2xl" aria-labelledby={titleId} aria-describedby={`${detailsId}${failed ? ` ${errorId}` : ""}`} onLoadedMetadata={applyPendingSeek} onError={() => setFailed(true)} onCanPlay={() => { if (pendingSeek.current === null) setFailed(false); }}>
      <a href={src} download>{downloadLabel}</a>
    </audio>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <SharePage title={title} href={podcastShareHref(id)} noun="podcast" compact />
      {ownPage ? null : <Link href={podcastShareHref(id)} className="text-sm underline underline-offset-4">Open the podcast page</Link>}
    </div>
    {failed ? <div><p id={errorId} role="alert" className="error">{errorMessage}</p><button className="btn btn--light" type="button" onClick={() => void retry()}>{retryLabel}</button></div> : null}
    {chapters?.length ? <nav aria-label={`${title} chapters`} className="rounded-xl border border-line p-4">
      <p className="font-semibold">Choose a chapter</p>
      <ol className="mt-3 space-y-2">{chapters.map((chapter, index) => <li key={`${chapter.start}-${index}`}>
        <button type="button" className="inline-flex min-h-11 items-center text-left underline underline-offset-4" disabled={!usableTime(chapter.start)} aria-controls={playerId} onClick={() => void playFrom(chapter.start)}>
          {usableTime(chapter.start) ? `Play from ${timestamp(chapter.start)} · ` : ""}{chapter.title}
        </button>
      </li>)}</ol>
    </nav> : null}
    {transcript?.segments.length || transcriptUrl ? <div className="rounded-xl border border-line p-4">
      <p className="text-sm leading-6">{reading?.status === "reviewed" ? "Transcript reviewed against the recording." : "This transcript has not been checked word for word against the recording. Listen to the recording before quoting it."}</p>
      <details className="mt-3" onToggle={event => { if (event.currentTarget.open) void loadTranscript(); }}>
        <summary className="cursor-pointer font-semibold">Read the complete transcript</summary>
        <p className="mt-3 text-sm leading-6">Read at your own pace. Each time stamp starts the recording at that passage. The text stays here even if the recording will not play.</p>
        {transcriptLoading ? <p role="status" className="mt-3">Loading the transcript…</p> : null}
        {transcriptFailed ? <div className="mt-3"><p role="alert">The transcript could not be loaded. The recording remains available above.</p><button type="button" className="btn btn--light mt-2" onClick={() => void loadTranscript()}>Try loading the transcript again</button></div> : null}
        {reading ? <div className="mt-4"><label className="block font-semibold" htmlFor={`podcast-${id}-transcript-search`}>Find words in this transcript</label><input id={`podcast-${id}-transcript-search`} type="search" value={transcriptQuery} onChange={event => setTranscriptQuery(event.target.value)} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2" />
          {query ? <p role="status" className="mt-2 text-sm">{passages.length} matching {passages.length === 1 ? "passage" : "passages"}. <button type="button" className="underline" onClick={() => setTranscriptQuery("")}>Show the complete transcript</button></p> : null}
        </div> : null}
        <ol className="mt-4 list-none space-y-5 p-0">{passages.map((segment, index) => <li key={`${segment.start}-${index}`}>
          {usableTime(segment.start) ? <button type="button" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4" aria-controls={playerId} onClick={() => void playFrom(segment.start)}>Play from {timestamp(segment.start)}</button> : null}
          <p className="mt-2 whitespace-pre-line leading-7">{segment.text}</p>
        </li>)}</ol>
      </details>
    </div> : null}
  </section>;
}
