"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SharePage } from "@/components/share-page";
import type { AudioLibraryEntry, AudioLibraryShelf } from "@/lib/content/audio-library";

const PLAYBACK_ERROR = "This recording could not be played. Please try again.";

function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor(whole / 60) % 60;
  const rest = String(whole % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function slug(id: string): string {
  return id.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

type RowProps = {
  entry: AudioLibraryEntry;
  active: boolean;
  playing: boolean;
  position: number;
  durationSeconds: number | null;
  error: string | null;
  onToggle: (entry: AudioLibraryEntry) => void;
  onSeek: (entry: AudioLibraryEntry, seconds: number) => void;
};

function EntryRow({ entry, active, playing, position, durationSeconds, error, onToggle, onSeek }: RowProps) {
  const key = slug(entry.id);
  const titleId = `recording-${key}-title`;
  const errorId = `recording-${key}-error`;
  const duration = durationSeconds && Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : null;
  const shown = active ? Math.min(position, duration ?? position) : 0;
  const lengthText = duration ? formatTime(duration) : "—";
  const canSeek = active && duration !== null;
  return (
    <li id={`recording-${key}`} className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2"><h3 id={titleId} className="text-lg font-semibold">{entry.title}</h3><SharePage title={entry.title} href={`/audio-library#recording-${key}`} noun="recording" compact /></div>
      <p className="mt-1 text-sm">
        {entry.format}
        {entry.sizeBytes ? ` · ${formatSize(entry.sizeBytes)}` : ""}
        {` · Length ${lengthText}`}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn--primary"
          aria-label={`${active && playing ? "Pause" : "Play"} ${entry.title}`}
          aria-describedby={error ? errorId : undefined}
          onClick={() => onToggle(entry)}
        >
          {active && playing ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          className="min-w-40 flex-1 cursor-pointer disabled:cursor-default"
          min={0}
          max={duration ? Math.ceil(duration) : 0}
          step={1}
          value={Math.floor(shown)}
          disabled={!canSeek}
          aria-label={`Playback position for ${entry.title}`}
          aria-valuetext={`${formatTime(shown)} of ${lengthText}`}
          onChange={event => onSeek(entry, Number(event.target.value))}
        />
        <span className="min-w-28 text-sm tabular-nums" aria-hidden="true">
          {formatTime(shown)} / {lengthText}
        </span>
        <a href={entry.src} download className="underline underline-offset-4" aria-label={`Download ${entry.title}`}>
          Download
        </a>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 font-semibold text-[var(--red-strong)]">
          {error}
        </p>
      ) : null}
      {entry.related ? (
        <p className="mt-2 text-sm">
          <Link href={entry.related.href} className="underline underline-offset-4">{entry.related.label}</Link>
        </p>
      ) : null}
      {entry.transcript ? (
        <details className="mt-3">
          <summary className="cursor-pointer font-semibold">Read the complete spoken text</summary>
          <p className="mt-2 leading-7">{entry.transcript}</p>
        </details>
      ) : null}
    </li>
  );
}

export function AudioLibraryPlayer({ shelves }: { shelves: AudioLibraryShelf[] }) {
  // One shared element plays at a time. Refs are only touched from event handlers and cleanup.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const boundIdRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [learnedDurations, setLearnedDurations] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(
    () => () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
    [],
  );

  function fail(id: string) {
    setErrors(previous => (previous[id] === PLAYBACK_ERROR ? previous : { ...previous, [id]: PLAYBACK_ERROR }));
    setPlaying(false);
  }

  function clearError(id: string) {
    setErrors(previous => {
      if (!(id in previous)) return previous;
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }

  function sharedAudio(): HTMLAudioElement | null {
    if (audioRef.current) return audioRef.current;
    if (typeof Audio === "undefined") return null;
    const audio = new Audio();
    audio.preload = "metadata";
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("ended", () => setPlaying(false));
    audio.addEventListener("timeupdate", () => setPosition(audio.currentTime));
    audio.addEventListener("durationchange", () => {
      const id = boundIdRef.current;
      const seconds = audio.duration;
      if (!id || !Number.isFinite(seconds) || seconds <= 0) return;
      setLearnedDurations(previous => (previous[id] === seconds ? previous : { ...previous, [id]: seconds }));
    });
    audio.addEventListener("error", () => {
      const id = boundIdRef.current;
      if (id) fail(id);
    });
    audioRef.current = audio;
    return audio;
  }

  async function play(audio: HTMLAudioElement, id: string) {
    clearError(id);
    try {
      await audio.play();
    } catch (error) {
      // Switching recordings interrupts the previous request; that is not a failure of the new one.
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (boundIdRef.current === id) fail(id);
    }
  }

  function toggle(entry: AudioLibraryEntry) {
    const audio = sharedAudio();
    if (!audio) {
      fail(entry.id);
      return;
    }
    if (boundIdRef.current === entry.id) {
      if (audio.paused) void play(audio, entry.id);
      else audio.pause();
      return;
    }
    audio.pause();
    boundIdRef.current = entry.id;
    setActiveId(entry.id);
    setPosition(0);
    audio.src = entry.src;
    void play(audio, entry.id);
  }

  function seek(entry: AudioLibraryEntry, seconds: number) {
    const audio = audioRef.current;
    if (!audio || boundIdRef.current !== entry.id || !Number.isFinite(seconds)) return;
    try {
      audio.currentTime = seconds;
      setPosition(seconds);
    } catch {
      fail(entry.id);
    }
  }

  return (
    <div className="space-y-10">
      {shelves.map(shelf => (
        <section key={shelf.id} aria-labelledby={`shelf-${shelf.id}`} className="space-y-4">
          <h2 id={`shelf-${shelf.id}`} className="text-2xl font-semibold">{shelf.title}</h2>
          <p className="max-w-3xl leading-7">{shelf.intro}</p>
          <ul className="list-none space-y-4 p-0">
            {shelf.entries.map(entry => (
              <EntryRow
                key={entry.id}
                entry={entry}
                active={activeId === entry.id}
                playing={activeId === entry.id && playing}
                position={activeId === entry.id ? position : 0}
                durationSeconds={entry.durationSeconds ?? learnedDurations[entry.id] ?? null}
                error={errors[entry.id] ?? null}
                onToggle={toggle}
                onSeek={seek}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
