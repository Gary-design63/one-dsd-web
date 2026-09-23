"use client";

import { useId, useState } from "react";
import styles from "./dsd-media.module.css";

const groups = [
  { label: "Group A", total: 80, complete: 68 },
  { label: "Group B", total: 32, complete: 20 },
  { label: "Group C", total: 8, complete: 2 },
] as const;
type View = "overall" | "groups" | "protected";
const views: { id: View; label: string }[] = [{ id: "overall", label: "Overall result" }, { id: "groups", label: "Look at the groups" }, { id: "protected", label: "Protect small groups" }];
const responses = [
  { id: "complete", label: "Treat a completed record as evidence that the person received useful support.", feedback: "A completed record describes the system's activity. Ask what the person could do next, what remained difficult, and whether the record captures that experience." },
  { id: "detail", label: "Publish every small group so the differences are visible.", feedback: "Greater detail can reveal people, including through subtraction or another table. Work with the data owner and privacy lead on what can be reported and what other evidence can answer the question." },
  { id: "experience", label: "Compare the record pattern with people's accounts, while checking what can be reported safely.", feedback: "That gives the team two kinds of evidence to examine together. Ask whose accounts are missing, how they can contribute safely, and what decision this information can help change." },
] as const;

/** Invented demonstration data only. No data request, storage or learner score. */
export function DsdDataQualityExample({ privacyFocus = false }: { privacyFocus?: boolean }) {
  const uid = useId();
  const [view, setView] = useState<View>(privacyFocus ? "protected" : "overall");
  const [choice, setChoice] = useState("");
  const [revealed, setRevealed] = useState(false);
  const selected = responses.find(response => response.id === choice);
  const displayed = view === "overall" ? [{ label: "All records", total: 120, complete: 90 }] : groups;
  const headline = view === "overall" ? "90 of 120 records are marked complete: 75%." : view === "groups" ? "The same overall result contains different patterns." : "Withholding one small cell may leave it easy to calculate.";
  return <section id="dsd-data-example" className={styles.example} aria-labelledby={uid + "-heading"}>
    <div className={styles.header}>
      <p className={styles.eyebrow}>Fictional data example · no real participants</p>
      <h2 id={uid + "-heading"} className={styles.title}>{privacyFocus ? "What a small table can reveal" : "A complete record is the beginning of a question"}</h2>
      <p className={styles.intro}>A made-up service follow-up has 120 records. Explore what the overall count shows, what a grouped view adds, and what a safer reporting view must consider. Groups A, B and C are invented labels.</p>
    </div>
    <div className={styles.controls} role="group" aria-label="Fictional data views">{views.map(item => <button key={item.id} className={styles.control} type="button" aria-pressed={view === item.id} aria-controls={uid + "-view"} onClick={() => setView(item.id)}>{item.label}</button>)}</div>
    <div id={uid + "-view"} className={styles.view}>
      <p className={styles.headline} aria-live="polite">{headline}</p>
      <svg className={styles.chart} viewBox={view === "overall" ? "0 0 620 95" : "0 0 620 235"} aria-hidden="true">
        {displayed.map((group, index) => {
          const withheld = view === "protected" && group.label !== "Group A";
          const percent = group.complete / group.total * 100;
          return <g key={group.label}>
            <text x="0" y={24 + index * 70} fontSize="16" fill="#172f42">{group.label}</text>
            <rect x="115" y={8 + index * 70} width="410" height="25" rx="3" fill="#e0e7ec" />
            {!withheld && <rect x="115" y={8 + index * 70} width={410 * percent / 100} height="25" rx="3" fill="#456d8a" />}
            <text x="538" y={26 + index * 70} fontSize="15" fill="#172f42">{withheld ? "Withheld" : `${percent}%`}</text>
          </g>;
        })}
        <text x="115" y={view === "overall" ? 69 : 211} fontSize="13" fill="#4e6271">0%</text><text x="320" y={view === "overall" ? 69 : 211} textAnchor="middle" fontSize="13" fill="#4e6271">50%</text><text x="525" y={view === "overall" ? 69 : 211} textAnchor="end" fontSize="13" fill="#4e6271">100%</text>
      </svg>
      <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Fictional follow-up data"><table className={styles.table}>
        <caption>{view === "overall" ? "Overall fictional follow-up" : view === "groups" ? "Grouped fictional follow-up" : "Fictional reporting view with two rows withheld"}</caption>
        <thead><tr><th scope="col">Reporting group</th><th scope="col">Records</th><th scope="col">Marked complete</th><th scope="col">Share complete</th></tr></thead>
        <tbody>{displayed.map(group => { const withheld = view === "protected" && group.label !== "Group A"; return <tr key={group.label}><th scope="row">{group.label}</th><td>{withheld ? "Not reported" : group.total}</td><td>{withheld ? "Not reported" : group.complete}</td><td>{withheld ? "Not reported" : `${group.complete / group.total * 100}%`}</td></tr>; })}
          {view !== "overall" && <tr><th scope="row">All records</th><td>120</td><td>90</td><td>75%</td></tr>}
        </tbody>
      </table></div>
      <p className={styles.note}>{view === "overall" ? "Completion does not establish that the person understood the notice, obtained a service, or could use the next step." : view === "groups" ? "A difference invites examination. These figures do not explain its cause, describe any real community, or show whether the underlying records answer the equity question." : "For this example only, imagine a reporting rule that withholds groups smaller than ten. Hiding C alone would fail: 120 − 80 − 32 reveals eight records, and 90 − 68 − 20 reveals two complete. This view also withholds B so this table cannot identify C by that subtraction. A real reporting rule and review of other available information belong with the data owner and privacy lead."}</p>
    </div>
    <details className={styles.details}><summary>What could people&apos;s accounts add?</summary><p>In a fictional conversation, someone says, “The record says complete, but I still could not tell whom to contact.” That account suggests a question about the handoff. It does not establish how often the problem happens. Invite feedback through usable channels and examine it alongside the records without identifying people in small groups.</p></details>
    <div className={styles.options}><fieldset><legend className={styles.title}>What would you investigate next?</legend>{responses.map(response => <label key={response.id} className={styles.choice}><input type="radio" name={uid + "-choice"} value={response.id} checked={choice === response.id} onChange={() => { setChoice(response.id); setRevealed(false); }} /><span>{response.label}</span></label>)}</fieldset><button className="btn btn--primary mt-3 disabled:opacity-50" type="button" disabled={!selected} onClick={() => setRevealed(true)}>Consider this next step</button><div aria-live="polite">{revealed && selected && <p className={styles.response}>{selected.feedback}</p>}</div></div>
  </section>;
}
