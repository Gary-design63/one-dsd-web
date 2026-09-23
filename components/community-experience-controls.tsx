"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export function CommunityExperience({ brief, learning, title }: { brief: ReactNode; learning: ReactNode; title: string }) {
  const [mode, setMode] = useState<"brief" | "learning">("brief");
  const key = useId();
  const briefButton = useRef<HTMLButtonElement>(null);
  return <>
    <div className="community-experience-nav" role="group" aria-label={`Explore ${title}`}>
      <button ref={briefButton} type="button" aria-pressed={mode === "brief"} aria-controls={`${key}-brief`} onClick={() => setMode("brief")}>Community brief</button>
      <button type="button" aria-pressed={mode === "learning"} aria-controls={`${key}-learning`} onClick={() => setMode("learning")}>Learning and reflection</button>
    </div>
    <div id={`${key}-brief`} hidden={mode !== "brief"}>{brief}</div>
    <div id={`${key}-learning`} hidden={mode !== "learning"}>
      {learning}
      <button type="button" onClick={() => { setMode("brief"); briefButton.current?.focus(); }}>Return to the community brief</button>
    </div>
  </>;
}

export function CommunityPractice({ question, response }: { question: string; response: string }) {
  const [open, setOpen] = useState(false);
  const key = useId();
  return <div className="community-practice">
    <h3>Consider this fictional situation</h3>
    <p>{question}</p>
    <button type="button" aria-expanded={open} aria-controls={key} onClick={() => setOpen(value => !value)}>{open ? "Close the reflection" : "Explore the reasoning"}</button>
    <div id={key} hidden={!open}><p>{response}</p></div>
  </div>;
}
