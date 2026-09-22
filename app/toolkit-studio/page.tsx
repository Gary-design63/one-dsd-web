import type { Metadata } from "next";
import Link from "next/link";
import { ResourceDownloads } from "@/components/resource-downloads";
import { PageIntro } from "@/components/ui";
import { TOOLKIT_CARDS, TOOLKIT_CATALOG, TOOLKIT_DOWNLOADS, TOOLKIT_STEPS, TOOLKIT_WHY } from "@/lib/content/toolkit-studio";
import { requestedContentScope } from "@/lib/product/request-context";

export const metadata: Metadata = { title: "Equity Analysis Toolkit Studio" };

export default async function ToolkitStudioPage() {
  const scope = await requestedContentScope();
  return (
    <>
      <PageIntro kicker="Required learning path" title={TOOLKIT_WHY.title} lede={TOOLKIT_WHY.authority}>
        <p className="mt-3 text-sm">{TOOLKIT_WHY.chrome}</p>
      </PageIntro>
      <div className="wrap max-w-5xl space-y-10 py-8">
        <section aria-labelledby="why-title">
          <h2 id="why-title" className="text-2xl font-extrabold">Why this tool (5 minutes)</h2>
          <ol className="mt-4 list-decimal space-y-4 pl-6">
            {TOOLKIT_WHY.beats.map((beat) => (
              <li key={beat.title}>
                <strong>{beat.title}. </strong>
                {beat.body}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm">Official steps: {TOOLKIT_STEPS.map((step) => `${step.number}. ${step.title}`).join(" · ")}</p>
        </section>

        <section aria-labelledby="picker-title">
          <h2 id="picker-title" className="text-2xl font-extrabold">Choose a work moment</h2>
          <p>Browse and download only. Featured cards walk a fictional decision. Catalog titles name more moments.</p>
          <ul className="mt-4 grid list-none gap-4 p-0 md:grid-cols-3">
            {TOOLKIT_CARDS.map((card) => (
              <li key={card.id} className="rounded-xl border border-line bg-white p-4">
                <p className="kicker">Featured</p>
                <h3 className="text-lg font-bold"><Link href={`/toolkit-studio/${card.id}`}>{card.title}</Link></h3>
                <p className="text-sm">{card.prompt}</p>
                <p className="mt-2 text-xs text-muted">{card.tags.join(" · ")} · ~8–12 min</p>
              </li>
            ))}
          </ul>
          <details className="mt-6">
            <summary>Catalog titles 4–12</summary>
            <ul className="mt-3 list-disc pl-6">
              {TOOLKIT_CATALOG.map((item, index) => (
                <li key={item.id}><strong>{index + 4}. {item.title}.</strong> {item.prompt}</li>
              ))}
            </ul>
          </details>
        </section>

        <section aria-labelledby="pack-title">
          <h2 id="pack-title" className="text-2xl font-extrabold">Download pack</h2>
          <p>Use these offline. Staff writing is not collected here.</p>
          <ul className="mt-4 list-none space-y-4 p-0">
            {TOOLKIT_DOWNLOADS.map((item) => (
              <li key={item.id} className="border-t border-line pt-3">
                <p className="font-bold">{item.title}</p>
                <ResourceDownloads kind="toolkit-studio" id={item.id} noun={item.noun} scope={scope} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold">Go further</h2>
          <ul className="list-disc pl-6">
            <li><Link href="/learn/equity-toolkit">Equity Analysis Toolkit companion</Link></li>
            <li><Link href="/practice">Published practice checklists</Link></li>
            <li><Link href="/library/ext-dhs-equity-toolkit">Official toolkit source (outside source; check before use)</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
