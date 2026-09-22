import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { ResourceDownloads } from "@/components/resource-downloads";
import { SUPPORT_SOURCES } from "@/lib/product/support-directory";

export const metadata: Metadata = { title: "DHS offices and guidance" };

export default function SupportDirectoryPage() {
  return <>
    <PageIntro kicker="Find support" title="DHS offices and guidance" lede="Find a useful starting point for your question, with separate guidance for workplace needs, public services and program responsibilities." />
    <div className="wrap max-w-5xl space-y-8 py-8">
      <p><Link href="/support/right-person">Find the right person for your work</Link></p>
      <p>These DHS pages can help you find an office or understand a process. Your team may have a specific contact for the next step.</p>
      <ResourceDownloads kind="support-directory" id="dhs" noun="directory" />
      <div className="space-y-6">{SUPPORT_SOURCES.map(source => <section key={source.id} id={source.id} className="border-t border-line pt-5">
        <h2 className="text-xl font-extrabold"><a href={source.href} rel="noreferrer">{source.label}</a></h2>
        <p className="text-sm text-muted">{source.audience}</p>
        <p>{source.purpose} {source.limitation}</p>
        <details className="text-sm text-muted"><summary>About this source</summary>
          <p>Published by {source.publisher}. Link and subject checked September 8, 2026.{source.sourceDate ? ` The source identifies its date as ${source.sourceDate}.` : " No publication date is stated here."} The source check does not establish a new policy date.</p>
        </details>
      </section>)}</div>
    </div>
  </>;
}
