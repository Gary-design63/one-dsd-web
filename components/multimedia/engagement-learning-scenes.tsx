import styles from "./engagement-diagrams.module.css";
import Image from "next/image";

const scenes: Record<string, { title: string; columns: [string, string]; rows: [string, string][]; question: string }> = {
  foundations: { title: "The pause does not explain itself", columns: ["Moment", "A described conversation"], rows: [
    ["Observe", "A colleague pauses after a question. The pause is observable; its meaning is still unknown."],
    ["Keep explanations open", "They may be considering the question, need context, or prefer another way to contribute. None of these is established by the pause."],
    ["Ask", "“Would more context or a little time help? You can also add a thought in writing.”"],
  ], question: "Which part could an observer verify, and which part still needs a question?" },
  perspectives: { title: "A meeting can make room for a second perspective", columns: ["Before", "A change to examine"], rows: [
    ["The quickest spoken answer becomes the proposal.", "The facilitator reads written questions before inviting a decision."],
    ["Silence is described as agreement.", "“Is there a perspective we have not considered? You may speak, write, or pass.”"],
    ["The record names only the final choice.", "The record explains which contribution changed an option and what remains unresolved."],
  ], question: "What changed about influence, beyond the number of people speaking?" },
  communication: { title: "Check the explanation through the next action", columns: ["Conversation", "What it helps reveal"], rows: [
    ["Staff: “What would you like to understand about the next step?”", "Begins with the person's question instead of assuming which information they need."],
    ["Person: “I know what the letter says, but I do not know where to send the reply.”", "A specific process gap can remain even when the words are understood."],
    ["Staff: “Let's look at the reply route together. How would you like the instructions provided?”", "Makes the action usable and asks about communication preferences without inferring them."],
  ], question: "What would you check about the reply route before saying the explanation worked?" },
  decisions: { title: "Trace a renewal notice beyond its wording", columns: ["Part of the request", "A question for the responsible team"], rows: [
    ["Notice received → action understood", "Are the requested action, necessary information, date and help route easy to find?"],
    ["Information found → reply sent", "Is information being requested again, and which verified requirement makes it necessary?"],
    ["Reply received → next step confirmed", "Who confirms receipt and helps when the response route does not work?"],
  ], question: "Which step could be changed, and who has the authority to decide?" },
  reflection: { title: "Compare the evidence before claiming improvement", columns: ["What the team has", "What it can and cannot establish"], rows: [
    ["Written questions were invited before the meeting.", "A process change occurred. That alone does not establish whether colleagues could use the route."],
    ["A written question changed one proposed option.", "There is an example of influence. It does not show whose perspectives are still absent."],
    ["Participants can review the decision note.", "This offers a chance to correct the account. Ask whether it accurately describes their contribution."],
  ], question: "What additional perspective would help you decide whether to keep the change?" },
};

export function EngagementLearningScene({ focus }: { focus: string }) {
  const scene = scenes[focus];
  if (!scene) return null;
  return <details className={styles.referenceExample}><summary>Explore the example more closely</summary>
    <p className={styles.eyebrow}>Fictional worked example</p>
    {focus === "perspectives" && <figure className="my-5"><Image src="/images/media-meeting-contribution-pair-v1.png" width={1774} height={887} sizes="(max-width: 1024px) 90vw, 480px" alt="Two fictional meeting moments: on the left colleagues talk around a table; on the right the same colleagues write on response cards." className="h-auto w-full rounded-lg" /><figcaption className="mt-3 text-sm leading-6">Two ways to contribute: conversation and time to write. Neither photograph shows whether an idea influenced the decision. The facilitator still needs to bring the contributions into the discussion and explain what changed.</figcaption></figure>}
    <table className={styles.comparison}><caption>{scene.title}</caption><thead><tr>{scene.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{scene.rows.map(([label, text]) => <tr key={label}><th scope="row">{label}</th><td>{text}</td></tr>)}</tbody></table>
    <p className={styles.samplePrompt}>{scene.question}</p>
  </details>;
}

export function CommunityInfluenceMap() {
  return <figure className={styles.example} aria-labelledby="community-influence-map-title"><figcaption><p className={styles.eyebrow}>Fictional employment-planning example</p><h3 id="community-influence-map-title" className={styles.title}>Follow one contribution through the decision</h3></figcaption>
    <ol className="mt-5 grid list-none gap-4 p-0 sm:grid-cols-2">
      {[
        ["1. A barrier is named", "“The online form does not work with my connection.” This is a stated experience to understand, not evidence about everyone."],
        ["2. An open choice changes", "The team adds a phone response option. Confirm who will answer and what communication support is available."],
        ["3. A result is examined", "Ask whether the person could use the new route and identify their next step. Attendance cannot establish an employment outcome."],
        ["4. The account returns", "Share what changed and what remains open. Give contributors a way to correct how their input was represented."],
      ].map(([title, body]) => <li key={title} className="rounded-lg border border-slate-300 bg-white p-5"><h4 className="font-bold">{title}</h4><p className="mt-3 leading-7">{body}</p></li>)}
    </ol><p className={styles.samplePrompt}>If the phone route is proposed but has no confirmed owner, describe it as unresolved. A contribution becomes influence when an actual choice changes.</p>
  </figure>;
}
