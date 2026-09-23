"use client";
import { useState } from "react";
import styles from "./dsd-media.module.css";

export function EngagementToolkitRoute() {
  const [route, setRoute] = useState<"wording" | "journey">("wording");
  const steps = route === "wording" ? ["Rewrite the reminder", "Send through the existing channel", "Count reminders sent"] : ["Ask how people receive and understand the reminder", "Check the reply route and requested support", "Ask whether people could act and what remains difficult"];
  return <details className={styles.details}><summary>Compare two ways to examine a reminder</summary><p>Fictional process comparison. A wording change and a review of the complete task answer different questions.</p>
    <div className={styles.controls} role="group" aria-label="Reminder review approaches"><button type="button" aria-pressed={route === "wording"} className={styles.control} onClick={() => setRoute("wording")}>Review the wording</button><button type="button" aria-pressed={route === "journey"} className={styles.control} onClick={() => setRoute("journey")}>Review the whole task</button></div>
    <div aria-live="polite"><ol className={styles.flow}>{steps.map(step => <li key={step} className={styles.step}>{step}</li>)}</ol><p className={styles.carry}>{route === "wording" ? "Clear wording can help. The number sent does not show whether people received, understood or could act on it." : "The wider review connects communication with a working response route and people's experience. Check missing perspectives before drawing conclusions."}</p></div>
  </details>;
}
