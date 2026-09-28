import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { EQUITY_POLICY } from "@/lib/equity-analysis/policy";

export const metadata: Metadata = { title: "DHS Equity Policy", description: "The DHS equity policy, what it asks of staff, and how it is being used across the department." };
export const dynamic = "force-dynamic";


/** F-01: staff do not load stored analysis records on this page. */
export default function EquityPolicyPage() {
  return (
    <>
      <PageIntro kicker="People, Access and Culture" title={EQUITY_POLICY.title} lede={EQUITY_POLICY.lede}>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div><dt className="text-muted">Official text</dt><dd className="ml-0"><a href={EQUITY_POLICY.href} target="_blank" rel="noreferrer">Read the policy (PDF)</a></dd></div>
          <div><dt className="text-muted">Method</dt><dd className="ml-0"><a href={EQUITY_POLICY.toolkitHref} target="_blank" rel="noreferrer">Minnesota Equity Analysis Tool</a></dd></div>
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href="/toolkit-studio" className="btn btn--primary">Open Toolkit Studio</Link>
          <Link href="/learn/equity-toolkit">Toolkit companion</Link>
        </div>
      </PageIntro>

      <div className="wrap max-w-6xl space-y-12 py-10">
        <section aria-labelledby="names-title">
          <h2 id="names-title" className="mt-0 text-2xl font-bold">What the policy names</h2>
          <ul className="m-0 mt-4 grid list-none gap-4 p-0 md:grid-cols-3">
            {EQUITY_POLICY.commitments.map((c) => (
              <li key={c.name} className="card"><h3 className="m-0 text-xl font-bold">{c.name}</h3><p className="m-0 mt-2">{c.body}</p></li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl font-bold">What it asks of staff</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            {EQUITY_POLICY.asks.map((a) => <li key={a}>{a}</li>)}
          </ol>
        </section>

        <section aria-labelledby="loop-title">
          <h2 id="loop-title" className="mt-0 text-2xl font-bold">Learn it, use it, see it</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">The <Link href="/equity-framework">Equity Strategic Framework</Link> connects this policy to everyday decisions and follow-through.</p>
          <ol className="m-0 mt-4 grid list-none gap-4 p-0 md:grid-cols-3">
            <li className="card">
              <p className="kicker m-0">1. Learn</p>
              <h3 className="m-0 mt-1 text-xl font-bold">The toolkit companion</h3>
              <p className="mt-2 text-sm">Five learning stages and a fictional example, with the official toolkit and related resources.</p>
              <Link href="/learn/equity-toolkit">Open the companion</Link>
            </li>
            <li className="card">
              <p className="kicker m-0">2. Use</p>
              <h3 className="m-0 mt-1 text-xl font-bold">Toolkit Studio</h3>
              <p className="mt-2 text-sm">Try the eight practice questions with a published example, then download a copy for your own work.</p>
              <Link href="/toolkit-studio">Open Toolkit Studio</Link>
            </li>
            <li className="card">
              <p className="kicker m-0">3. See</p>
              <h3 className="m-0 mt-1 text-xl font-bold">Return to the policy</h3>
              <p className="mt-2 text-sm">Use the official policy and Equity Analysis Tool when you need to check the requirements or method.</p>
              <a href={EQUITY_POLICY.href} target="_blank" rel="noreferrer">Read the policy (PDF)</a>
            </li>
          </ol>
        </section>

      </div>
    </>
  );
}
