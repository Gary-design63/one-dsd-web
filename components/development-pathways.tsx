import Link from "next/link";
import { developmentModel, journeyHref } from "@/lib/program/development";

export function DevelopmentPathways({ compact = false }: { compact?: boolean }) {
  return <section className="development-pathways" aria-label="Guided pathways into practice">
    <p className="development-eyebrow">A question. A perspective. A meaningful change.</p>
    <h2>From learning to equity in practice</h2>
    <p>{developmentModel.intro}</p>
    {compact ? <Link className="development-action" href="/journeys">Find a pathway for your question →</Link> : <ul className="development-grid">
      {developmentModel.journeys.map(journey => <li key={journey.id}><h3><Link href={journeyHref(journey.id)}>{journey.title} →</Link></h3><p>{journey.summary}</p><p className="development-question">{journey.question}</p></li>)}
    </ul>}
  </section>;
}
