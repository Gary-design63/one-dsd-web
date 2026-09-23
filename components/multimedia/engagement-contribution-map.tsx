import styles from "./engagement-diagrams.module.css";

const stages = [
  { title: "Notice the handoff", text: "A notice points to one contact. The staff instructions point to another. Name the mismatch without guessing why it happened." },
  { title: "Make a contribution", text: "The team compares the two instructions and drafts a clearer first contact, next step, and fallback for discussion." },
  { title: "Bring it to the decision owner", text: "The service owner considers the proposal with the people responsible for the handoff. Agree what can change and what needs more work." },
];

const workNote = [
  ["Question", "How can someone tell whom to contact next without being sent between offices?"],
  ["Evidence and gaps", "The notice and the staff instructions name different contacts. We have not yet heard from people who use this notice."],
  ["Team contribution", "Compare the instructions and prepare one proposed revision. Invite a colleague who handles the handoff to check it."],
  ["Next decision", "Ask the service owner to review the wording and confirm who is responsible for each contact and follow-up."],
  ["Agreed return", "Ask when a response can be shared, then bring it back to contributors. If a revision is agreed, ask willing staff and service users whether the next step is clearer."],
];

/** Worked example for dsd:dsd-team; the existing Team content remains the source. */
export function EngagementContributionMap() {
  return (
    <figure className={styles.example} aria-labelledby="team-handoff-example">
      <figcaption>
        <p className={styles.eyebrow}>A fictional example</p>
        <h3 id="team-handoff-example" className={styles.title}>Follow a confusing handoff through</h3>
        <p className={styles.intro}>A useful contribution connects a question with evidence, a person who can decide, and a response to the people who raised it.</p>
      </figcaption>
      <ol className={styles.flow}>
        {stages.map((stage, index) => (
          <li key={stage.title}>
            <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
            <h4>{stage.title}</h4>
            <p>{stage.text}</p>
            {index < stages.length - 1 && <span className={styles.connector} aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>
      <div className={styles.returnPath}>
        <span aria-hidden="true">↩</span>
        <div><h4>Return to the people who contributed</h4><p>Share the response, including what remains open. If something changes, return to whether it helped. If no change is agreed, explain that too.</p></div>
      </div>
      <details className={styles.workNote}>
        <summary>Read the example work note</summary>
        <dl>{workNote.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
      </details>
    </figure>
  );
}
