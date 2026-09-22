"use client";

import { useId, useState } from "react";
import styles from "./dsd-media.module.css";

const proposed = [
  { title: "Receive the notice", actor: "Person or family", body: "Find the new request, its purpose, the reply date and a way to ask for help.", question: "Which languages and formats will make the request usable?" },
  { title: "Find and return a copy", actor: "Person or family", body: "Locate a document and send another copy, even if the agency may already hold relevant information.", question: "What happens when a copy, printer or return channel is unavailable?" },
  { title: "Review the information", actor: "Responsible staff", body: "Check the evidence and explain what remains missing or what happens next.", question: "Does the additional copy address a demonstrated verification gap?" },
];
const alternative = [
  { title: "Check the evidence already held", actor: "Responsible staff", body: "Identify the verification gap and ask the policy owner which existing information can be reused.", question: "Is reuse permitted, current and sufficient for the purpose?" },
  { title: "Request only what is still needed", actor: "Staff and person or family", body: "Explain the specific missing information and offer a usable way to respond or get help.", question: "Who will provide language and communication support at first contact?" },
  { title: "Review and learn from the result", actor: "Decision and implementation owners", body: "Check both verification quality and the burden of responding, then explain the next step.", question: "What evidence would lead the team to revise this option?" },
];

/** A hypothetical extension of the four-week policy scenario, not a waiver procedure. */
export function DsdPolicyBurdenMap() {
  const uid = useId(); const [showAlternative, setShowAlternative] = useState(false);
  const steps = showAlternative ? alternative : proposed;
  return <section id="dsd-policy-burden-map" className={styles.example} aria-labelledby={uid + "-title"}>
    <div className={styles.header}><p className={styles.eyebrow}>Fictional documentation example</p><h2 id={uid + "-title"} className={styles.title}>Follow the request from the family&apos;s side</h2><p className={styles.intro}>To examine the scenario, imagine the new requirement asks for another document copy. Follow where the work falls, then compare an option that first checks information already held. Both still need review against the actual verification purpose.</p></div>
    <div className={styles.controls} role="group" aria-label="Documentation journey"><button type="button" className={styles.control} aria-pressed={!showAlternative} aria-controls={uid + "-flow"} onClick={() => setShowAlternative(false)}>New-copy proposal</button><button type="button" className={styles.control} aria-pressed={showAlternative} aria-controls={uid + "-flow"} onClick={() => setShowAlternative(true)}>Alternative to examine</button></div>
    <p className="sr-only" aria-live="polite">{showAlternative ? "Showing an alternative that checks existing evidence first." : "Showing the proposed additional-copy journey."}</p>
    <ol id={uid + "-flow"} className={styles.flow}>{steps.map(step => <li className={styles.step} key={step.title}><h3>{step.title}</h3><p>{step.body}</p><span className={styles.actor}>{step.actor}</span><p className={styles.question}>{step.question}</p></li>)}</ol>
    <div className={styles.view}><div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Documentation options comparison"><table className={styles.table}><caption>Three options to take to the decision owner</caption><thead><tr><th scope="col">Option</th><th scope="col">Burden to examine</th><th scope="col">What remains to verify</th></tr></thead><tbody>
      <tr><th scope="row">Ask everyone for another copy</th><td>Finding, producing and returning a document; delays when a channel or support is missing.</td><td>Whether the additional request addresses the identified fraud risk, and who would struggle to meet it.</td></tr>
      <tr><th scope="row">Reuse existing evidence where permitted</th><td>Staff effort to locate and check current information; less duplicate collection only if it is usable.</td><td>Permission, evidence quality, staff capacity and how unresolved gaps would be handled.</td></tr>
      <tr><th scope="row">Rework the proposal before approval</th><td>Time needed to compare options and involve people affected while the decision is still open.</td><td>Who can adjust the decision timetable, which analysis is required and what evidence leadership needs.</td></tr>
    </tbody></table></div><p className={styles.note}>No option here establishes fraud prevention, eligibility, a policy exception or a change to a real requirement. The policy owner determines the required analysis and keeps the official record.</p></div>
    <p className={styles.carry}><strong>Carry one question into the analysis:</strong> Which step could be removed, combined or handled by the agency while still meeting the verified purpose? Name the role that can examine it before the four-week decision point.</p>
  </section>;
}

