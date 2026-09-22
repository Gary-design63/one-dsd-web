import styles from "./engagement-diagrams.module.css";
import Image from "next/image";

type Example = {
  title: string;
  intro: string;
  columns?: readonly [string, string];
  rows?: readonly (readonly [string, string])[];
  dialogue?: readonly (readonly [string, string])[];
  prompt: string;
};
const examples: Record<string, Example> = {
  mentoring: {
    title: "Advice and an opening to practice",
    intro: "A colleague wants to become more comfortable facilitating a conversation across teams. These replies offer different kinds of support.",
    columns: ["Part of the conversation", "A possible reply"],
    rows: [
      ["The colleague’s interest", "“I would like to practice making room for different perspectives in a cross-team conversation.”"],
      ["Mentoring: offer perspective", "“We could review an agenda together and think about questions, written contributions, and ways to invite quieter voices.”"],
      ["Sponsorship: explore an opportunity", "“With your agreement, I could ask a host whether co-facilitating would be useful. We would still need to agree the role, preparation time, access needs, and feedback.”"],
    ],
    prompt: "What would make the conversation useful, and what support would make a practice opportunity workable? An introduction does not promise selection or an assignment.",
  },
  "well-being": {
    title: "A pause and a working condition",
    intro: "In this fictional day, a short break may help someone recharge. Clearer work arrangements address a different part of the experience.",
    columns: ["What makes the day harder", "A change to discuss"],
    rows: [
      ["Several requests all arrive as the top priority.", "Agree which piece of work comes first and what can wait."],
      ["A handoff arrives without its question or next step.", "Include the question, the relevant context, and who will confirm the next step."],
      ["Time set aside for focused work repeatedly disappears.", "Discuss what protected time is practical and how urgent exceptions will be handled."],
    ],
    prompt: "A quiet pause, conversation, or another break remains a personal choice. A recurring work condition can be discussed without sharing health information.",
  },
  "co-leads": {
    title: "Pause a claim and make room for repair",
    intro: "A co-lead can bring the conversation back to a specific event without deciding someone’s motives or investigating a workplace concern.",
    dialogue: [
      ["Participant", "“People from that office never listen.”"],
      ["Co-lead", "“Let’s pause. What happened in this exchange? We can examine the interaction without deciding what everyone in an office is like.”"],
      ["Participant", "“We sent a question and did not know whether anyone had received it.”"],
      ["Co-lead", "“Would it help to explore how a response comes back? We can also consider whether a different support conversation is needed. What, if anything, do we agree to carry forward?”"],
    ],
    prompt: "A useful cue: pause, name the specific concern, invite clarification, and agree what may be shared. Leave room to pass or seek support privately.",
  },
  materials: {
    title: "A question and an honest update",
    intro: "These examples adapt the existing question and update templates. The recipient and next check-in would still need to be agreed before anyone sends them.",
    columns: ["Template", "Fictional wording"],
    rows: [
      ["A question to carry forward", "“Could our meeting notes make the next decision and open questions easier to find? We would like the responsible team to consider a small change to the notes format.”"],
      ["Sharing boundaries", "“Share the question and a blank example. Leave out participants’ names, private stories, and any notes we have not agreed to share.”"],
      ["An update while a response is pending", "“Our question is awaiting a response. We have no decision to report yet. We will return to the agreed check-in and share what is known then.”"],
    ],
    prompt: "Replace placeholders only with confirmed arrangements. Raising the question does not assign its implementation to the contributor.",
  },
  lab: {
    title: "An example to explore together",
    intro: "In a fictional meeting, a verbal discussion reaches a conclusion before the group reads questions colleagues added in writing.",
    dialogue: [
      ["Colleague", "“There are two questions in the shared notes that we have not read yet.”"],
      ["Facilitator", "“Let’s make room for those before we settle the next step. You can add a thought in writing, speak, listen, or pass.”"],
    ],
    columns: ["Part of the conversation", "A prompt to use"],
    rows: [
      ["Begin with a question", "What would help us understand whose contributions are being considered?"],
      ["Look at the example", "What did we observe? Which explanations are still assumptions?"],
      ["Invite other perspectives", "What would we need to ask or learn before changing the meeting?"],
      ["Close in a useful way", "What insight, optional next step, or question would we like to keep?"],
    ],
    prompt: "The scene can be read silently or aloud. Nobody needs to role-play or speak, and a useful insight can be enough.",
  },
  idea: {
    title: "An unfinished observation becomes a brief",
    intro: "A confusing service handoff can be enough to start a conversation. This fictional brief leaves room for the people responsible to examine it.",
    columns: ["Brief field", "Fictional example"],
    rows: [
      ["What are you noticing?", "“A notice points to one contact, while the staff handoff instructions point to another. We do not yet know which instruction needs to change.”"],
      ["Who could benefit, and what difference could it make?", "“People asking about the notice and the staff receiving questions could have a clearer next step.”"],
      ["What would you like considered?", "“Could the service owner compare the two instructions with the people who use them and consider a clearer first contact and fallback?”"],
    ],
    prompt: "Before sharing, agree the wording and recipient, what must stay private, and how a response will return. You can raise the question without taking on the change yourself.",
  },
  borrow: {
    title: "Borrow the clarity, adapt the details",
    intro: "Two fictional handoff notes show a small practice another team could adapt.",
    columns: ["Starting note", "A more useful handoff"],
    rows: [["“Sent to the service team.”", "“Question: which contact should answer queries about this notice? Next decision: service owner to confirm the contact. Still open: when an update can be shared.”"]],
    prompt: "Which part would help in another team’s setting? Confirm its actual roles, communication needs, and response arrangements before adapting the wording.",
  },
  question: {
    title: "One handoff, two perspectives",
    intro: "A shared question can look different depending on where someone meets the work.",
    columns: ["Perspective in this fictional example", "What would help"],
    rows: [
      ["The team sending the question", "Know whether it has reached the right place and how an update will return."],
      ["The team receiving it", "Understand the question, the context needed, and what decision is being requested."],
    ],
    prompt: "What is shared, and what depends on each team’s work? A further conversation is optional; agreement on a new project is not required.",
  },
  window: {
    title: "A window into a handoff",
    intro: "This fictional outline shows the work behind a team name without opening a live case or a staff record.",
    columns: ["Part of the work", "What another team could learn"],
    rows: [
      ["Receive the question", "Separate the unclear notice from assumptions about why someone asked for help."],
      ["Find the relationship", "Identify who owns the notice, who receives the questions, and who can confirm the next step."],
      ["Return what is known", "Explain what has been clarified and what remains open, using the agreed communication route."],
    ],
    prompt: "Where does this connect with your work, and what would you want to ask the team? The outline is a conversation starter, not an account of an actual service process.",
  },
};

export function EngagementWorkedExample({ kind }: { kind: string }) {
  const example = examples[kind];
  if (!example) return null;
  return <figure className={styles.example} aria-labelledby={`engagement-example-${kind}`}>
    <figcaption><p className={styles.eyebrow}>A fictional example</p><h3 id={`engagement-example-${kind}`} className={styles.title}>{example.title}</h3><p className={styles.intro}>{example.intro}</p></figcaption>
    {example.dialogue && <ol className={styles.dialogue}>{example.dialogue.map(([speaker, text], index) => <li key={`${speaker}-${index}`}><strong>{speaker}</strong>{text}</li>)}</ol>}
    {example.rows && <table className={styles.comparison}><caption className="sr-only">{example.title}</caption><thead><tr><th scope="col">{example.columns?.[0]}</th><th scope="col">{example.columns?.[1]}</th></tr></thead><tbody>{example.rows.map(([label, text]) => <tr key={label}><th scope="row">{label}</th><td>{text}</td></tr>)}</tbody></table>}
    <p className={styles.samplePrompt}>{example.prompt}</p>
  </figure>;
}

/** Selected activities reuse one worked example; others keep their existing choices. */
export function EngagementActivitySample({ activityId }: { activityId: string }) {
  if (activityId === "minnesota") return <details className={styles.sampleDetails}><summary>Explore a Minnesota place through a public source</summary><figure className="py-5">
    <Image src="/images/media-minnehaha-nps-dietzman.jpg" width={1000} height={666} sizes="(max-width: 768px) 90vw, 760px" className="h-auto w-full rounded-lg" alt="Water flows beneath a low stone bridge, with trees along the bank and rocks beside the stream." />
    <figcaption className="mt-3 text-sm leading-6">Minnehaha Falls Regional Park, as identified in the National Park Service collection. Photograph: NPS/Gordon Dietzman, 2016. Public domain. <a href="https://npgallery.nps.gov/AssetDetail/6D680AA3-1DD8-B71B-0B4788AB317C0219">View the original photograph and its record</a>.</figcaption>
    <p className="mt-4 leading-7">A photograph offers one view of a place. The park&apos;s history, relationships and accessibility require more context than the image alone provides.</p>
    <p className="mt-3 leading-7"><a href="https://www.minneapolisparks.org/parks-destinations/parks-lakes/minnehaha_regional_park/">Explore Minnehaha Regional Park&apos;s history and visitor information</a>. What would you like to understand about this place, and whose account would help you learn?</p>
  </figure></details>;
  const kind = ({ borrow: "borrow", question: "question", window: "window", friction: "idea" } as Record<string, string>)[activityId];
  if (!kind) return null;
  return <details className={styles.sampleDetails}><summary>Explore a fictional example</summary><div><EngagementWorkedExample kind={kind} /></div></details>;
}
