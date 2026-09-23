"use client";

import Image from "next/image";
import { useId, useState } from "react";

const moments = [
  { title: "The handout arrives", time: "Two minutes before the planned decision",
    description: "A facilitator passes around a revised two-page summary. This is the first time the group has received this version.",
    speaker: "Facilitator", dialogue: "Here is the revised summary. Let's choose an option at ten." },
  { title: "A request is made", time: "One minute before the planned decision",
    description: "A participant asks for the file and time to read it. The scenario does not tell us why they need either.",
    speaker: "Participant", dialogue: "Could you send me the file? I need more time to read this version." },
  { title: "The decision is still open", time: "At the planned decision time",
    description: "No option has been selected. The facilitator asks what is needed before the group decides.",
    speaker: "Facilitator", dialogue: "What do we need before we choose?" },
] as const;

const openingNotes = [
  { id: "observable", label: "The revised summary arrived two minutes before the planned decision. A participant asked for the file and more reading time.",
    response: "This records the timing and the request supplied by the scene. It gives the team a process to examine without claiming to know anyone's motive, ability or diagnosis." },
  { id: "motive", label: "The facilitator did not care whether everyone could take part.",
    response: "The timing may create a barrier, but the scene does not establish what the facilitator cared about. Record when the summary arrived and what the participant requested, then examine the process." },
  { id: "ability", label: "The participant was not able to keep up with the group.",
    response: "A request for a file and more time does not establish a person's ability. The scene gives us a format, a short reading period and a request. Start there and ask what would make participation workable." },
] as const;

/** One generated fictional still plus original text; no video, timing, tracking or course storage. */
export function CriticalIncidentScene() {
  const uid = useId();
  const [moment, setMoment] = useState(0);
  const [choice, setChoice] = useState("");
  const [considered, setConsidered] = useState(false);
  const current = moments[moment];
  const selected = openingNotes.find(note => note.id === choice);

  return <section aria-labelledby={uid + "-heading"} className="my-8 overflow-hidden rounded-2xl border border-[#dcd5c8] bg-[#faf7f1]">
    <div className="p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#71502f]">Fictional scene · optional practice</p>
      <h2 id={uid + "-heading"} className="mt-3 text-2xl font-bold text-[#123f60] sm:text-3xl">The papers arrive just before the decision</h2>
      <p className="mt-4 leading-7">Use the scene to practice the lesson’s four lines. Look for the timing, materials and requests that can be described. The dialogue below supplies the facts of this fictional event.</p>
    </div>
    <figure className="m-0">
      <Image src="/images/media-critical-incident-late-handout-v1.png" width={1672} height={941} sizes="(min-width: 1024px) 760px, 100vw" alt="Four colleagues sit around a meeting table as two pass a stack of printed pages between them; notebooks and a laptop are on the table." className="block h-auto w-full" />
      <figcaption className="px-5 py-3 text-sm leading-6 text-[#445868] sm:px-8">Computer-generated fictional image. The people and event are illustrative; the image does not document a DHS meeting.</figcaption>
    </figure>
    <div className="p-5 pt-2 sm:p-8 sm:pt-3">
      <div role="group" aria-label="Choose a moment in the fictional scene" className="flex flex-wrap gap-2">
        {moments.map((item, index) => <button key={item.title} type="button" aria-pressed={moment === index} aria-controls={uid + "-moment"} onClick={() => setMoment(index)} className={"rounded-lg border px-4 py-3 text-left font-semibold " + (moment === index ? "border-[#123f60] bg-[#123f60] text-white" : "border-[#b7c8d5] bg-white text-[#123f60]")}>{index + 1}. {item.title}</button>)}
      </div>
      <div id={uid + "-moment"} aria-live="polite" aria-atomic="true" className="mt-4 rounded-xl border border-[#dcd5c8] bg-white p-5">
        <p className="text-sm font-semibold text-[#71502f]">{current.time}</p>
        <h3 className="mt-2 text-xl font-bold">{current.title}</h3>
        <p className="mt-3 leading-7">{current.description}</p>
        <p className="mb-0 mt-4 border-l-4 border-[#b7c8d5] pl-4 leading-7"><strong>{current.speaker}:</strong> “{current.dialogue}”</p>
      </div>
      <details className="mt-4 rounded-xl border border-[#dcd5c8] bg-white p-5">
        <summary className="cursor-pointer font-semibold">Read the complete scene</summary>
        <ol className="mt-4 list-decimal space-y-5 pl-5">
          {moments.map(item => <li key={item.title}><h3 className="font-bold">{item.time}</h3><p className="mt-2 leading-7">{item.description}</p><p className="mt-2 leading-7"><strong>{item.speaker}:</strong> “{item.dialogue}”</p></li>)}
        </ol>
      </details>
      <fieldset className="mt-7 space-y-3">
        <legend className="mb-3 text-xl font-bold">Which opening line stays with what was observed?</legend>
        {openingNotes.map(note => <label key={note.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dcd5c8] bg-white p-4 leading-6">
          <input type="radio" className="mt-1 h-4 w-4 shrink-0 accent-[#123f60]" name={uid + "-opening"} value={note.id} checked={choice === note.id} onChange={() => { setChoice(note.id); setConsidered(false); }} />
          <span>{note.label}</span>
        </label>)}
      </fieldset>
      <button type="button" className="btn btn--primary mt-4 disabled:opacity-50" disabled={!selected} onClick={() => setConsidered(true)}>Consider this opening line</button>
      <div aria-live="polite">{considered && selected ? <p className="mt-4 rounded-xl border-l-4 border-[#123f60] bg-white p-4 leading-7">{selected.response}</p> : null}</div>
      <div className="mt-6 border-t border-[#dcd5c8] pt-5">
        <h3 className="text-xl font-bold">Write the four lines</h3>
        <p className="mt-3 leading-7">Use “Notes to take with you” below to draft your response. Separate what the scene tells you from what you would need to ask.</p>
        <ol className="mt-3 list-decimal space-y-3 pl-5 leading-7">
          <li><strong>What happened?</strong> Record the arrival time and request without assigning a motive.</li>
          <li><strong>Who did this process work for?</strong> Consider the expectation that people can read a revised paper summary immediately. Treat your explanation as something to check.</li>
          <li><strong>Who had a harder time?</strong> Describe the unmet request for a file and reading time. Ask what support would help; a person’s appearance does not answer that question.</li>
          <li><strong>What should happen next?</strong> Propose a change while the decision is open, name who would follow through and choose a review date. If a formal requirement is involved, use the appropriate office or process.</li>
        </ol>
        <p className="mb-0 mt-4 leading-7">You might test sharing a usable version earlier and agreeing on reading time before the decision. Ask participants whether that change would meet their needs.</p>
      </div>
    </div>
  </section>;
}


