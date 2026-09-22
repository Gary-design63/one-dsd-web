"use client";

import { useId, useRef, useState } from "react";
import styles from "./dsd-media.module.css";

/** A fictional task, deliberately unrelated to an actual service application. */
export function DsdAccessibleFormDemo() {
  const id = useId();
  const select = useRef<HTMLSelectElement>(null);
  const [choice, setChoice] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [done, setDone] = useState(false);
  const invalid = attempted && !choice;
  return <details className={styles.details}>
    <summary>Try the repaired part of a fictional form</summary>
    <p>A picture of a form cannot provide working field labels or an error that explains what to correct. This example lets you try those features using the keyboard. It makes no appointment and asks for no personal information.</p>
    <form className={styles.view} noValidate onSubmit={event => {
      event.preventDefault(); setAttempted(true); setDone(Boolean(choice));
      if (!choice) select.current?.focus();
    }}>
      <label htmlFor={id + "-choice"} className="block font-semibold">Choose a fictional meeting format</label>
      <p id={id + "-help"}>Required. Choose the format to include in the example confirmation.</p>
      <select ref={select} id={id + "-choice"} value={choice} required aria-invalid={invalid} aria-describedby={id + "-help" + (invalid ? " " + id + "-error" : "")} className="my-3 block w-full rounded-lg border border-slate-500 bg-white p-3" onChange={event => { setChoice(event.target.value); setDone(false); }}>
        <option value="">Choose a format</option><option value="phone">Phone conversation</option><option value="video">Video conversation</option><option value="in-person">In-person conversation</option>
      </select>
      {invalid && <p id={id + "-error"} role="alert">Choose a meeting format, then try again.</p>}
      <button type="submit" className={styles.control}>Preview example confirmation</button>
      <div role="status">{done && <p className={styles.response}>Example confirmation: your {choice === "in-person" ? "in-person" : choice} conversation choice is clear. In a real service, the responsible team would confirm availability, access arrangements and a way to change the choice.</p>}</div>
    </form>
    <p><strong>What to check:</strong> The label names the choice, the instructions explain it, the error names the correction, and confirmation describes what follows. A complete form also needs testing with the people and assistive technology that will use it.</p>
  </details>;
}

const routes = {
  online: { title: "Online", steps: ["Find a labeled, usable form", "Ask for help without losing the request", "Receive a confirmation and follow-up contact"], gap: "If the form fails, the person needs another working route without repeating information unnecessarily." },
  phone: { title: "Phone", steps: ["Reach a staffed number and requested language support", "Discuss the same request with a staff member", "Receive the next step in a usable format"], gap: "A voicemail alone does not demonstrate that language support or timely follow-up is available." },
  supported: { title: "With chosen support", steps: ["Ask who the person wants involved", "Explain the choices in a way the person can use", "Confirm the person's choice and who will follow up"], gap: "Support should help the person understand and express a choice. It does not establish someone else's decision-making authority." },
} as const;

export function DsdServiceRouteExplorer() {
  const [selected, setSelected] = useState<keyof typeof routes>("online");
  const route = routes[selected];
  return <details className={styles.details}>
    <summary>Follow one contact route to the same next step</summary>
    <p>Fictional request: a person wants to understand the next planning conversation. Choose a route to examine the arrangements it needs.</p>
    <div className={styles.controls} role="group" aria-label="Fictional contact routes">{Object.entries(routes).map(([key, value]) => <button key={key} type="button" className={styles.control} aria-pressed={selected === key} onClick={() => setSelected(key as keyof typeof routes)}>{value.title}</button>)}</div>
    <div aria-live="polite"><ol className={styles.flow}>{route.steps.map(step => <li key={step} className={styles.step}>{step}</li>)}</ol><p className={styles.carry}>{route.gap}</p></div>
    <p><strong>Across every route:</strong> Agree the next action, requested access arrangements and responsibility for unanswered questions. Ask people who use each route where the handoff breaks down.</p>
  </details>;
}
