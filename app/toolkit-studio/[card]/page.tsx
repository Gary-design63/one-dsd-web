import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceDownloads } from "@/components/resource-downloads";
import { PageIntro } from "@/components/ui";
import { getToolkitStudioCard, TOOLKIT_INSIGHT_CHROME, TOOLKIT_STEPS } from "@/lib/content/toolkit-studio";
import { requestedContentScope } from "@/lib/product/request-context";

type Props = { params: Promise<{ card: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { card: id } = await params;
  const card = getToolkitStudioCard(id);
  return { title: card ? `${card.title} · Toolkit Studio` : "Toolkit Studio" };
}

export default async function ToolkitStudioCardPage({ params }: Props) {
  const { card: id } = await params;
  const card = getToolkitStudioCard(id);
  if (!card) notFound();
  const scope = await requestedContentScope();
  return (
    <>
      <PageIntro kicker={card.kicker} title={card.title} lede={card.lede}>
        <p className="mt-3 text-sm">~8–12 minutes · Browse only · Fictional people with stated preferences only. Practice illustration — not Official policy; not a filed analysis.</p>
        {card.leaveAbleTo ? <p className="mt-2 text-sm">You’ll leave able to {card.leaveAbleTo.charAt(0).toLowerCase() + card.leaveAbleTo.slice(1)}.</p> : null}
        <p className="mt-3 text-sm"><Link href="/toolkit-studio">Back to Toolkit Studio</Link></p>
      </PageIntro>
      <div className="wrap max-w-4xl space-y-8 py-8">
        <section className="card">
          <p className="kicker">Before the eight steps</p>
          <h2 className="text-xl font-extrabold">Decision brief</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div><dt className="font-bold">Decision object</dt><dd>{card.brief.decision}</dd></div>
            <div><dt className="font-bold">Owner (fiction)</dt><dd>{card.brief.owner}</dd></div>
            <div><dt className="font-bold">Lock date</dt><dd>{card.brief.lockDate}</dd></div>
            <div><dt className="font-bold">Stated goal</dt><dd>{card.brief.goal}</dd></div>
            <div><dt className="font-bold">People in the fiction</dt><dd>{card.brief.people}</dd></div>
            <div><dt className="font-bold">Institutional-self beat</dt><dd>{card.brief.institutionalSelf}</dd></div>
          </dl>
        </section>

        {card.steps.map((step) => {
          const official = TOOLKIT_STEPS[step.number - 1];
          return (
            <details key={step.number} className="rounded-xl border border-line bg-white p-4" open={step.number === 1}>
              <summary className="cursor-pointer font-bold text-[#003865]">Step {step.number} — {official.title}</summary>
              <p className="mt-3">{step.walked}</p>
              <aside className="notice mt-4">
                <p className="kicker m-0">Decision Insight Panel</p>
                <p>{step.insight}</p>
                {step.antiStereotype ? <p className="mt-2"><strong>Anti-stereotype: </strong>{step.antiStereotype}</p> : null}
                {step.designChange ? <p className="mt-2"><strong>Design change (required): </strong>{step.designChange}</p> : null}
                {step.checkboxFail ? <p className="mt-2"><strong>Checkbox fail: </strong>{step.checkboxFail}</p> : null}
                {step.coverSheetFail ? <p className="mt-2"><strong>Cover-sheet (fail): </strong>{step.coverSheetFail}</p> : null}
                {step.walkedPass ? <p className="mt-2"><strong>Walked (pass): </strong>{step.walkedPass}</p> : null}
                <ul className="mt-3 list-disc pl-5 text-sm">
                  {TOOLKIT_INSIGHT_CHROME.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </aside>
              {step.number === 3 ? (
                <p className="notice mt-3"><strong>Formal doors callout. </strong>Tribal consultation is a formal door when Nation-impacted — not a stakeholder workshop. Escalate via Office of Indian Policy / Tribal liaison. Do not invent Nation guidance.</p>
              ) : null}
            </details>
          );
        })}

        <section className="notice">
          <h2 className="text-xl font-extrabold">Formal doors (not a step number)</h2>
          <p>The toolkit does not replace these paths.</p>
          <ul className="mt-2 list-disc pl-6">
            {card.formalDoors.map((door) => <li key={door}>{door}</li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Culture briefs and practice</h2>
          <p className="text-sm">Briefs help you ask better questions. They do not tell you what an individual believes, needs, or prefers.</p>
          <ul className="mt-2 list-disc pl-6">
            {card.briefs.map((brief) => (
              <li key={brief.href}><Link href={brief.href}>{brief.label}</Link> — {brief.use}</li>
            ))}
          </ul>
          <p className="mt-3"><Link href={card.practice.href}>{card.practice.label}</Link>. {card.practice.body}</p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Download this walk</h2>
          <p>{card.downloadBlurb}</p>
          <ResourceDownloads kind="toolkit-studio" id="insights-checklist" noun="insights checklist" scope={scope} />
          <p className="mt-3 text-sm"><Link href="/toolkit-studio#pack-title">Open the full download pack</Link></p>
        </section>
      </div>
    </>
  );
}
