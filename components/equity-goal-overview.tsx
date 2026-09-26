import Link from "next/link";
import model from "@/lib/program/equity-goals.json";

export function EquityGoalOverview() {
  return <section aria-labelledby="equity-goals-overview" className="my-8 rounded-2xl border border-line bg-white p-6 md:p-8">
    <p className="kicker">Equity in everyday work</p>
    <h2 id="equity-goals-overview" className="text-2xl font-bold">Six goals for equity in practice</h2>
    <p className="mt-3 max-w-3xl">The Aging and Disability Services Administration (ADSA) goals connect learning to decisions, team practices, and public service. Explore all six, find relevant tools, and plan a change you can review.</p>
    <ol className="my-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {model.goals.map(goal => <li key={goal.id} className="rounded-lg border border-line p-4"><Link className="font-semibold underline" href={`/learn/equity-toolkit#equity-goal-${goal.number}`}><span aria-hidden="true">{goal.number}. </span>{goal.title}</Link><p className="mt-2 text-sm">{goal.focus}</p></li>)}
    </ol>
    <Link className="btn btn--primary" href="/learn/equity-toolkit#equity-goals">Connect the goals to your work</Link>
  </section>;
}
