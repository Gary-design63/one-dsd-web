"use client";
import { useState } from "react";
import Link from "next/link";
import { developmentModel, developmentJourney, journeyHref, stageGuidance } from "@/lib/program/development";

/** A chosen focus is held only in page memory; no staff writing, profiles, or scores are stored. */
export function DevelopmentFocus({ initialFocus = "" }: { initialFocus?: string }) {
  const [focus, setFocus] = useState(developmentJourney(initialFocus)?.id ?? "");
  const journey = developmentJourney(focus);
  function downloadGuide() {
    if (!journey) return;
    const text = [journey.title, journey.summary, "", ...developmentModel.stages.flatMap(stage => [stage.title, stageGuidance(journey, stage.id), "Something to carry forward: " + stage.evidence, ""]), "Learning with other people", journey.social, "", "Resources to explore", `${journey.title}: ${new URL(journeyHref(journey.id), window.location.origin).href}`, "", "Keep any personal notes in a location you choose. This guide does not submit information to the program."].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${journey.id}-practice-guide.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return <section className="development-focus" aria-labelledby="development-focus-title">
    <h2 id="development-focus-title" className="text-2xl font-semibold">Choose what you want to work on</h2>
    <p>Connect a question or learning interest with a practical pathway. Your selection stays on this page; it is not saved as a personal profile.</p>
    <label htmlFor="development-focus">What would you like to explore?</label>
    <select id="development-focus" value={focus} onChange={event => setFocus(event.target.value)}><option value="">Choose a focus</option>{developmentModel.journeys.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
    <div aria-live="polite">{journey ? <><h3 className="mt-5 text-xl font-semibold">{journey.question}</h3><p>{journey.summary}</p><Link className="development-action" href={journeyHref(journey.id)}>Open this pathway →</Link><p><button type="button" className="btn btn--secondary" onClick={downloadGuide}>Download this practice guide</button></p><h3 className="mt-5 text-xl font-semibold">When you return</h3><p>{journey.reflection}</p><Link href={journeyHref(journey.id, "reflect")}>Use the reflection step</Link></> : <p className="mt-4">You can also <Link href="/journeys">explore every pathway</Link> or use the published tools below.</p>}</div>
  </section>;
}
