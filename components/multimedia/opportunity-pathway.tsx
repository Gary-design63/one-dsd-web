import Link from "next/link";

const stages = [
  { title: "Hear about it", question: "Can everyone find the opportunity?", example: "A stretch assignment is mentioned to a few colleagues during a meeting.", change: "Share the same description and response date through channels colleagues can access." },
  { title: "Consider taking part", question: "Can people judge whether participation is workable?", example: "The description asks for enthusiasm but says little about time, support or the work itself.", change: "Explain the work, relevant criteria, time involved and available support. Make room for questions." },
  { title: "Be considered fairly", question: "What evidence shapes the choice?", example: "The team relies on who comes to mind first.", change: "Use relevant, explicit criteria and consider the evidence consistently. Explain how the decision was reached." },
] as const;

/** Fictional process example; it creates no selection procedure or participant record. */
export function OpportunityPathway() {
  return <details className="mt-6 rounded-xl border border-[#b9cbd7] bg-[#f5f8fa] p-5 md:p-7">
    <summary className="cursor-pointer text-xl font-bold text-[#123f60]">Follow an opportunity from invitation to decision</summary>
    <p className="mt-4 max-w-3xl leading-7">In this fictional example, colleagues examine access to a stretch assignment. Each step offers a different opportunity to make participation more workable.</p>
    <ol className="mt-5 grid list-none gap-4 p-0 lg:grid-cols-3" aria-label="Three places to examine access to an opportunity">
      {stages.map((stage, index) => <li key={stage.title} className="rounded-xl border border-[#cbd8e0] bg-white p-5">
        <p className="m-0 text-sm font-semibold text-[#49657a]">{index + 1} of 3</p>
        <h3 className="mt-2 text-lg font-bold">{stage.title}</h3>
        <p className="font-semibold leading-6">{stage.question}</p>
        <p className="leading-7"><strong>What the team notices:</strong> {stage.example}</p>
        <p className="leading-7"><strong>A change to explore:</strong> {stage.change}</p>
      </li>)}
    </ol>
    <div className="mt-5 border-t border-[#b9cbd7] pt-4">
      <h3 className="text-lg font-bold">Return to the people affected</h3>
      <p className="max-w-3xl leading-7">Did the invitation reach people? What made participation possible or difficult? Could people see how their questions influenced the process? Use those experiences to decide what to keep or change.</p>
      <p><Link href="/one-dsd/leadership?stage=develop#life-cycle">Explore development and opportunity in the leadership pathway</Link></p>
    </div>
  </details>;
}
