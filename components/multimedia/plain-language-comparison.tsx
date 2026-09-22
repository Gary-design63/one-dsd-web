"use client";

import { useId, useState } from "react";

const checks = [
  { id: "contact", label: "A working way to contact the workshop team.",
    response: "Yes. The reader still needs a real reply method. In a working notice, add and check the contact details, then ask someone to find the action, date and way to get help." },
  { id: "formal", label: "A more formal heading.",
    response: "A more formal heading would not help someone send a reply. The sample still needs a working way to contact the workshop team." },
  { id: "process", label: "An explanation of the team's internal scheduling process.",
    response: "The scheduling process is not needed to make this choice. The reader does need a working way to send a reply or ask for support." },
] as const;

/** Original fictional companion. It never changes course blocks or saves learner activity. */
export function PlainLanguageComparison() {
  const uid = useId();
  const [showChanges, setShowChanges] = useState(false);
  const [choice, setChoice] = useState("");
  const [considered, setConsidered] = useState(false);
  const selected = checks.find(check => check.id === choice);
  const highlight = showChanges ? "rounded-sm bg-[#f7e2a9] px-0.5 font-semibold underline decoration-[#71502f] underline-offset-4" : "";

  return <section aria-labelledby={uid + "-heading"} className="my-8 overflow-hidden rounded-2xl border border-[#dcd5c8] bg-[#faf7f1]">
    <div className="p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#71502f]">Fictional writing example</p>
      <h2 id={uid + "-heading"} className="mt-3 text-2xl font-bold text-[#123f60] sm:text-3xl">Make the next action easy to find</h2>
      <p className="mt-4 leading-7">Compare two versions of a made-up workshop notice. The revision keeps the choices, reply date and offer of support while changing how a reader finds them.</p>
      <button type="button" className="btn btn--light mt-4" aria-pressed={showChanges} aria-controls={uid + "-comparison"} onClick={() => setShowChanges(current => !current)}>Highlight the writing moves</button>
      <div id={uid + "-comparison"} className="mt-5 grid gap-5 lg:grid-cols-2">
        <article aria-labelledby={uid + "-original"} className="rounded-xl border border-[#dcd5c8] bg-white p-5">
          <h3 id={uid + "-original"} className="text-lg font-bold">First draft</h3>
          <p className="mt-4 leading-8"><span className={highlight}>In order to facilitate the finalization of arrangements for the forthcoming workshop,</span> participants are requested to <span className={highlight}>communicate their preferred session</span> (morning or afternoon) to the workshop team by October 18. Requests for language or access support may be included with the reply. The team can answer questions.</p>
        </article>
        <article aria-labelledby={uid + "-revised"} className="rounded-xl border border-[#b7c8d5] bg-white p-5">
          <h3 id={uid + "-revised"} className="text-lg font-bold text-[#123f60]">Revised draft</h3>
          <p className="mt-4 text-xl font-bold leading-8"><span className={highlight}>Choose a workshop time. Reply by October 18.</span></p>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-7">
            <li><span className={highlight}>Tell the workshop team whether you prefer morning or afternoon.</span></li>
            <li>You can ask for language or access support when you reply.</li>
          </ul>
          <p className="mt-4 leading-7">Ask the workshop team if you have questions.</p>
        </article>
      </div>
      <div className="mt-5 rounded-xl border border-[#dcd5c8] bg-white p-5">
        <h3 className="text-lg font-bold">Three moves to try</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7">
          <li><strong>Put the action first.</strong> The heading gives the choice and reply date before the background.</li>
          <li><strong>Use familiar words.</strong> “Tell the team” replaces “communicate their preferred session.”</li>
          <li><strong>Separate the ideas.</strong> The choice, support and questions each have room to be read.</li>
        </ol>
        <p className="mb-0 mt-3 text-sm leading-6">The highlighted phrases are also underlined. Both drafts and the explanation remain available with highlighting turned off.</p>
      </div>
      <fieldset className="mt-7 space-y-3">
        <legend className="mb-3 text-xl font-bold">What does this sample still need before someone could use it?</legend>
        {checks.map(check => <label key={check.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dcd5c8] bg-white p-4 leading-6">
          <input type="radio" className="mt-1 h-4 w-4 shrink-0 accent-[#123f60]" name={uid + "-check"} value={check.id} checked={choice === check.id} onChange={() => { setChoice(check.id); setConsidered(false); }} />
          <span>{check.label}</span>
        </label>)}
      </fieldset>
      <button type="button" className="btn btn--primary mt-4 disabled:opacity-50" disabled={!selected} onClick={() => setConsidered(true)}>Consider the missing detail</button>
      <div aria-live="polite">{considered && selected ? <p className="mt-4 rounded-xl border-l-4 border-[#123f60] bg-white p-4 leading-7">{selected.response}</p> : null}</div>
      <div className="mt-6 border-t border-[#dcd5c8] pt-5">
        <h3 className="text-lg font-bold">Try it with one sentence you use</h3>
        <p className="mb-0 mt-3 leading-7">Rewrite the action first. Keep the original facts and any required wording. Ask a colleague to point to what to do, when to do it and how to get help. Use what they find to revise the draft.</p>
      </div>
    </div>
  </section>;
}

