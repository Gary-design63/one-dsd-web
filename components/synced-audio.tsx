"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A recording married to its script. As the audio plays, the sentence being
 * spoken is highlighted and kept in view. Clicking a sentence moves the audio
 * to that point.
 */
export type ScriptLine = { start: number; end: number; text: string; p?: number };

export function SyncedAudio({ src, title, script }: { src: string; title: string; script: ScriptLine[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState(-1);
  const [follow, setFollow] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const tick = () => {
      const t = audio.currentTime;
      let index = -1;
      for (let i = 0; i < script.length; i += 1) {
        if (t >= script[i].start - 0.15) index = i;
        else break;
      }
      setCurrent(index);
    };
    audio.addEventListener("timeupdate", tick);
    audio.addEventListener("seeked", tick);
    return () => {
      audio.removeEventListener("timeupdate", tick);
      audio.removeEventListener("seeked", tick);
    };
  }, [script]);

  useEffect(() => {
    if (!follow || current < 0) return;
    const el = document.querySelector<HTMLElement>(`[data-script-line="${current}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [current, follow]);

  const seekTo = (line: ScriptLine) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, line.start);
    void audio.play();
  };

  const paragraphs: ScriptLine[][] = [];
  script.forEach((line, index) => {
    const p = line.p ?? Math.floor(index / 6);
    if (!paragraphs[p]) paragraphs[p] = [];
    paragraphs[p].push({ ...line, p: index });
  });

  return (
    <div data-synced-audio="true">
      <audio ref={audioRef} controls preload="metadata" src={src} style={{ width: "100%" }} aria-label={title || "Read aloud"} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="text-sm"><input type="checkbox" checked={follow} onChange={(event) => setFollow(event.target.checked)} /> Follow along</label>
        <span className="text-sm text-muted">Click any sentence to hear it.</span>
      </div>
      <div className="mt-3" style={{ maxHeight: 420, overflowY: "auto", padding: "4px 8px", borderTop: "1px solid #d6dee6" }} aria-live="off">
        {paragraphs.map((lines, index) => (
          <p key={index} style={{ lineHeight: 1.7 }}>
            {lines.map((line) => {
              const active = line.p === current;
              return (
                <span
                  key={line.p}
                  data-script-line={line.p}
                  role="button"
                  tabIndex={0}
                  onClick={() => seekTo(line)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); seekTo(line); } }}
                  style={{
                    cursor: "pointer",
                    borderRadius: 4,
                    padding: "1px 2px",
                    background: active ? "#fff3c4" : "transparent",
                    boxShadow: active ? "0 0 0 2px #f2c94c" : "none",
                    fontWeight: active ? 600 : 400,
                    transition: "background 120ms",
                  }}
                >{line.text} </span>
              );
            })}
          </p>
        ))}
      </div>
    </div>
  );
}
