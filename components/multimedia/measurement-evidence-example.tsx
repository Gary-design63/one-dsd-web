"use client";

import { useId, useState } from "react";

const readings = [
  { label: "Earlier notice", foundAction: 60, total: 100, fill: "#526b81" },
  { label: "Revised notice", foundAction: 78, total: 100, fill: "#123f60" },
] as const;
const interpretations = [
  { id: "activity", label: "Holding more review sessions shows that the notice became easier to use.",
    response: "The session count tells us what happened. To understand whether the notice was easier to use, look at the reading task and ask people what still got in the way." },
  { id: "cause", label: "The revised wording caused the entire improvement.",
    response: "The later group did better on this task, but these are separate groups. Differences between groups, the setting or other support could also matter. The comparison does not establish the cause." },
  { id: "supported", label: "More readers found the next action in the later group; we should examine other explanations and whose experience is missing.",
    response: "That fits the evidence. The outcome rose from 60% to 78%, an 18 percentage-point difference. It does not tell us why the difference occurred, whether it would last, or whether everyone could use the notice." },
] as const;

/** Original fictional teaching example; no program or participant data is loaded. */
export function MeasurementEvidenceExample() {
  const uid = useId();
  const [choice, setChoice] = useState("");
  const [considered, setConsidered] = useState(false);
  const selected = interpretations.find(item => item.id === choice);
  return <section aria-labelledby={uid + "-heading"} className="mb-10 overflow-hidden rounded-2xl border border-[#dcd5c8] bg-[#faf7f1]">
    <div className="p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#71502f]">Fictional example · not DHS data</p>
      <h2 id={uid + "-heading"} className="mt-3 text-2xl font-bold text-[#123f60] sm:text-3xl">More activity. A better result?</h2>
      <p className="mt-4 max-w-3xl leading-7">A team revises a reminder letter and asks a separate group to find its next action. Each version is read by 100 people in this made-up example. What would help the team decide what to keep or change?</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <figure className="m-0 rounded-xl bg-white p-4 sm:p-5" aria-describedby={uid + "-chart-note"}>
          <figcaption className="text-lg font-bold">Readers who found the next action</figcaption>
          <svg viewBox="0 0 420 190" role="img" aria-labelledby={uid + "-chart-title " + uid + "-chart-desc"} className="mt-4 block h-auto w-full">
            <title id={uid + "-chart-title"}>Earlier notice: 60%. Revised notice: 78%.</title>
            <desc id={uid + "-chart-desc"}>Two separate fictional groups of 100 readers. Sixty found the action in the earlier notice and 78 in the revised notice. The percentage scale begins at zero and ends at 100. The same figures appear in the table below.</desc>
            {readings.map((item, index) => <g key={item.label}>
              <text x="20" y={26 + index * 70} fontSize="17" fill="#172b3a">{item.label}</text>
              <rect x="20" y={36 + index * 70} width="380" height="30" rx="4" fill="#e7edf2" />
              <rect x="20" y={36 + index * 70} width={380 * item.foundAction / item.total} height="30" rx="4" fill={item.fill} />
              <text x={12 + 380 * item.foundAction / item.total} y={57 + index * 70} textAnchor="end" fontSize="17" fontWeight="700" fill="white">{item.foundAction}%</text>
            </g>)}
            <text x="20" y="173" fontSize="15" fill="#445868">0%</text>
            <text x="210" y="173" textAnchor="middle" fontSize="15" fill="#445868">50%</text>
            <text x="400" y="173" textAnchor="end" fontSize="15" fill="#445868">100%</text>
          </svg>
          <p id={uid + "-chart-note"} className="mb-0 mt-2 text-sm leading-6">This is an outcome for one task. It does not establish what caused the difference or how well the notice works for everyone.</p>
        </figure>
        <div className="space-y-5 py-1">
          <div><h3 className="text-lg font-bold">Activity: what happened?</h3><p className="mt-2 leading-7">The team held four review sessions, compared with two in the earlier period. That shows more activity, not its effect.</p></div>
          <div><h3 className="text-lg font-bold">Outcome: what changed?</h3><p className="mt-2 leading-7">More readers identified the next action. The groups were different, so the result invites further questions about the comparison.</p></div>
          <div><h3 className="text-lg font-bold">Influence: what did input change?</h3><p className="mt-2 leading-7">The team documented two wording changes prompted by participants and explained its response to two other suggestions. The earlier period has no comparable record.</p></div>
        </div>
      </div>
      <div role="region" aria-label="Complete fictional evidence, scroll for all columns" tabIndex={0} className="mt-7 overflow-x-auto rounded-xl border border-[#dcd5c8] bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123f60]">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <caption className="p-4 text-left text-base font-bold">The complete fictional evidence</caption>
          <thead className="border-y border-[#dcd5c8] bg-[#edf2f6]"><tr><th scope="col" className="p-4">Evidence</th><th scope="col" className="p-4">Earlier period</th><th scope="col" className="p-4">Later period</th><th scope="col" className="p-4">What to ask next</th></tr></thead>
          <tbody>
            <tr className="border-b border-[#e4e0d8] align-top"><th scope="row" className="p-4 font-semibold">Activity: review sessions</th><td className="p-4">2 sessions</td><td className="p-4">4 sessions</td><td className="p-4">Who could take part, and what did the sessions help the team understand?</td></tr>
            <tr className="border-b border-[#e4e0d8] align-top"><th scope="row" className="p-4 font-semibold">Outcome: readers finding the action</th>{readings.map(item => <td key={item.label} className="p-4">{item.foundAction} of {item.total} readers ({item.foundAction}%)</td>)}<td className="p-4">Were the groups and reading conditions comparable? Whose access needs remain unexamined?</td></tr>
            <tr className="align-top"><th scope="row" className="p-4 font-semibold">Influence: input shaping the draft</th><td className="p-4">Not documented</td><td className="p-4">2 wording changes; reasons recorded for 2 other suggestions</td><td className="p-4">Did participants recognize their input in the response? What could they still influence?</td></tr>
          </tbody>
        </table>
      </div>
      <fieldset className="mt-7 space-y-3">
        <legend className="mb-3 text-xl font-bold">Which interpretation does the evidence support?</legend>
        {interpretations.map(item => <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dcd5c8] bg-white p-4 leading-6">
          <input type="radio" className="mt-1 h-4 w-4 shrink-0 accent-[#123f60]" name={uid + "-interpretation"} value={item.id} checked={choice === item.id} onChange={() => { setChoice(item.id); setConsidered(false); }} />
          <span>{item.label}</span>
        </label>)}
      </fieldset>
      <button type="button" className="btn btn--primary mt-4 disabled:opacity-50" disabled={!selected} onClick={() => setConsidered(true)}>Consider this interpretation</button>
      <div aria-live="polite">{considered && selected ? <p className="mt-4 rounded-xl border-l-4 border-[#123f60] bg-white p-4 leading-7">{selected.response}</p> : null}</div>
      <p className="mb-0 mt-6 border-t border-[#dcd5c8] pt-5 leading-7">For your evaluation plan, choose an outcome that matters to the people affected. Describe how their experience can shape the next decision, and record what the evidence cannot show.</p>
    </div>
  </section>;
}
