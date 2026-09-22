import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { ResourceDownloads } from "@/components/resource-downloads";
import { OPERATIONALIZING_EQUITY } from "@/lib/program/equity";
import { OpportunityPathway } from "@/components/multimedia/opportunity-pathway";
import { FormJourneyExample, MeetingReflectionExample } from "@/components/multimedia/worked-practice-examples";
export const metadata: Metadata = { title: "Operationalizing equity", description: "Connect equity to everyday decisions, workplace practices, policies and services through shared inquiry, practical examples and useful resources." };
const examples = [
  { title: "Participation in meetings", situation: "A team is considering how its meetings support participation and shared work.", questions: "Who can help shape the agenda? What formats make it easier to contribute? How do contributions influence the decisions that follow?", practice: "Explore accessible materials and ways to contribute before, during and after a meeting. Agree on how people will hear what happened to their input.", href: "/practice", label: "Explore guided practice" },
  { title: "Forms and service processes", situation: "A workgroup is reviewing a form or the steps people follow to use a service.", questions: "What must a person understand, provide or do? Where might language, disability access, technology or documentation requirements create different burdens?", practice: "Examine the process with people who use it. Consider alternatives that preserve necessary requirements while improving access, and learn whether people can complete the intended task.", href: "/learn/equity-toolkit", label: "Explore the Equity Analysis Toolkit companion" },
  { title: "Workplace opportunities", situation: "Colleagues are exploring how people learn about and participate in developmental opportunities.", questions: "How are opportunities communicated? Which criteria shape access? What support would help people participate, and whose experience would help explain the options?", practice: "Bring relevant experience and available information into the discussion. Examine how communication, selection practices and support can strengthen access to opportunity.", href: "/areas", label: "Explore areas of work" },
];
const questions = [
  ["Clarify the work", "What decision, process or practice is open to change? What is already established, and who can influence the choices?"],
  ["Understand experiences", "Who may experience the benefits, burdens and barriers differently? What do evidence and lived experience help us understand?"],
  ["Make room for contribution", "Whose knowledge would help shape the options? What would make meaningful participation possible while choices remain open?"],
  ["Consider alternatives", "Which approaches could address a barrier or strengthen access to opportunity, resources and influence? What tradeoffs need attention?"],
  ["Support the work", "What skills, resources, accessibility measures and agreed responsibilities would help carry the approach forward?"],
  ["Learn and adapt", "How will people hear what happened to their input? What would help them assess the effects and decide whether to retain, revise or stop an approach?"],
];
export default function OperationalizingEquityPage() {
  return <><PageIntro kicker="People, Access and Culture" title="Operationalizing equity" lede="Connecting equity to everyday decisions, workplace practices, policies and services." />
    <div className="wrap max-w-6xl py-10 [&_p]:my-3">
      <ResourceDownloads kind="operationalizing-equity" id="program" noun="page" />
      <section aria-labelledby="shared-understanding" className="mt-8 max-w-4xl">
        <h2 id="shared-understanding" className="mt-0 text-3xl font-bold">A shared understanding</h2>
        <p className="text-lg leading-relaxed">{OPERATIONALIZING_EQUITY.definition}</p>
        <p className="text-sm text-muted">This program definition draws on DHS equity policy, Minnesota’s equity-analysis guidance and the GARE approach. The original sources are linked below.</p>
      </section>
      <section aria-labelledby="connected-practice" className="mt-10 max-w-4xl">
        <h2 id="connected-practice" className="text-3xl font-bold">Knowledge, relationships and practical action</h2>
        <p>Cultural awareness, intercultural learning, relationship-building, social justice, restorative practice and structural analysis offer connected ways to understand and advance equity. Each can contribute useful perspectives to the work people share.</p>
        <p>Operationalizing equity brings attention to how that understanding informs a particular decision or practice. It invites people to examine who can participate, how resources and opportunities are distributed, and what helps an approach work well in its setting.</p>
        <p>Structural inequities concern patterns in policies, processes and institutions that create or sustain unequal access and opportunity. Examining those patterns helps people identify practical points for change. The focus is on understanding how the work functions and considering its effects.</p>
        <p>Different situations call for different knowledge and support. Professional experience, community knowledge, respectful inquiry and evidence all have a place. Racial equity, disability access, language access and other dimensions may intersect; learning directly from people helps clarify what matters in a particular situation.</p>
      </section>
      <section aria-labelledby="everyday-examples" className="mt-12">
        <h2 id="everyday-examples" className="text-3xl font-bold">What it can look like</h2>
        <p className="max-w-3xl">These examples offer starting points for discussion. Consider how the questions might apply in your own setting.</p>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">{examples.map(example=><article key={example.title} className="rounded-xl border border-line bg-white p-6"><h3 className="mt-0 text-xl font-bold">{example.title}</h3><p>{example.situation}</p><p>{example.questions}</p><p>{example.practice}</p><Link href={example.href}>{example.label}</Link></article>)}</div>
      </section>
      <MeetingReflectionExample />
      <FormJourneyExample />
      <OpportunityPathway />
      <section aria-labelledby="useful-questions" className="mt-12">
        <h2 id="useful-questions" className="text-3xl font-bold">Questions that help move the work forward</h2>
        <p className="max-w-3xl">Use the questions that fit your work. They can support individual reflection, a conversation with colleagues or a shared examination of a decision.</p>
        <dl className="mt-6 grid gap-6 md:grid-cols-2">{questions.map(([title,question])=><div key={title} className="border-t border-line pt-4"><dt className="text-xl font-bold">{title}</dt><dd className="ml-0 mt-2 leading-relaxed">{question}</dd></div>)}</dl>
      </section>
      <section aria-labelledby="choose-support" className="mt-12 rounded-xl border border-line bg-white p-6 md:p-8">
        <h2 id="choose-support" className="mt-0 text-3xl font-bold">Connect it to your work</h2>
        <p>Explore at your own pace and choose what is useful. Participation in the People, Access and Culture Program is voluntary.</p>
        <ul className="grid gap-4 pl-5 md:grid-cols-2">
          <li><Link href="/ask">Browse common questions</Link> to read a published answer and download a copy.</li>
          <li><Link href="/learn/equity-toolkit">Use the Equity Analysis Toolkit companion</Link> to explore decisions, participation and practical application.</li>
          <li><Link href="/equity-policy">Read the DHS equity policy</Link> and run the guided toolkit walkthrough on your own work; what staff add is counted there.</li>
          <li><Link href="/equity-framework">Read the Equity Strategic Framework</Link>, the operational spine that every part of the program is mapped to.</li>
          <li><Link href="/practice">Explore guided practice</Link> to develop a checklist, plan, or other useful piece of work.</li>
          <li><Link href="/learn">Browse learning and resources</Link> for courses, podcasts and tools connected to your interests.</li>
          <li><Link href="/minnesota-communities">Explore Minnesota Communities</Link> for context and questions that support informed engagement.</li>
          <li><Link href="/understanding-dhs">Explore Understanding DHS</Link> to see how responsibilities and partnerships connect.</li>
        </ul>
      </section>
      <section aria-labelledby="foundation-sources" className="mt-12 border-t border-line pt-6">
        <h2 id="foundation-sources" className="text-2xl font-bold">Sources and further reading</h2>
        <ul className="space-y-3 pl-5">{OPERATIONALIZING_EQUITY.sources.map(source=><li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul>
        <p className="text-sm text-muted">Sources reviewed September 8, 2026. This page offers a program interpretation and illustrative examples. Refer to original guidance for applicable responsibilities and requirements.</p>
        <p><Link href="/">Return to the program home</Link></p>
      </section>
    </div></>;
}
