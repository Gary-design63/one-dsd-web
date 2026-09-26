import Link from "next/link";
import { developmentModel } from "@/lib/program/development";
import { DevelopmentPathways } from "@/components/development-pathways";
export const metadata = { title: "From learning to equity in practice" };

export default function JourneysPage() {
  return <div className="development-page">
    <Link href="/start">← Find your starting point</Link>
    <header><p className="development-eyebrow">Understanding. Relationships. Action.</p><h1>{developmentModel.title}</h1><p>{developmentModel.direction}</p><p>Begin with a question that matters to you. Explore at your own pace, move between resources, and return when another perspective or a practice opportunity would help.</p></header>
    <DevelopmentPathways />
    <section aria-labelledby="development-sequence"><h2 id="development-sequence">How learning becomes practice</h2><ol className="development-grid">{developmentModel.stages.map(stage => <li key={stage.id}><h3>{stage.title}</h3><p>{stage.purpose}</p><p><strong>Consider:</strong> {stage.prompt}</p></li>)}</ol></section>
    <section className="development-logic"><h2>How the program contributes to change</h2><ol>{developmentModel.logicModel.map(item => <li key={item.title}><strong>{item.title}:</strong> {item.text}</li>)}</ol><p>A resource delivered, an approach used, and an improvement observed are different kinds of evidence. Time, access, support, decision-making authority, and people’s willingness to participate affect what becomes possible.</p></section>
    <section><h2>Learning with other people</h2><p>A willing colleague can help you examine an assumption, rehearse a conversation, or reflect on an experience. Leaders can make time for practice, respond constructively to questions, and change routines that prevent people from using what they learn.</p><ul className="development-step-links"><li><Link href="/employee-resource-groups">Employee resource groups</Link></li><li><Link href="/one-dsd/amplify">Amplify Equity</Link></li><li><Link href="/one-dsd/team">One DSD Team</Link></li><li><Link href="/support">Find support</Link></li></ul></section>
    <details className="development-related"><summary>Research informing this approach</summary><ul>{developmentModel.sources.map(source => <li key={source.href}><a href={source.href}>{source.title}</a><p>{source.application}</p></li>)}</ul><p>{developmentModel.evidenceNote}</p></details>
    <p><Link href="/my-work">Choose a focus in My Work →</Link> · <Link href="/learn?browse=all">Explore all learning and resources</Link></p>
  </div>;
}
