import Link from "next/link";

export function EquityPracticeOverview() {
  return <section aria-labelledby="equity-practice-overview" className="my-8 rounded-2xl border border-line bg-white p-6 md:p-8">
    <p className="kicker">Equity in everyday work</p>
    <h2 id="equity-practice-overview" className="text-2xl font-bold">Equity in practice</h2>
    <p className="mt-3 max-w-3xl">Connect learning to decisions, team practices, and public service. Explore relevant tools and plan changes you can use.</p>
    <Link className="btn btn--primary mt-5" href="/learn/equity-toolkit">Explore the Equity Analysis Toolkit</Link>
  </section>;
}
