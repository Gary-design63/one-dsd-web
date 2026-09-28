import Link from "next/link";
import { ResourceDownloads } from "@/components/resource-downloads";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import type { DownloadScope } from "@/lib/downloads/catalog";

const SHELF = [
  { href: "/equity-framework", title: "Equity Strategic Framework", kind: "equity-framework" as const, id: "framework", noun: "framework" },
  { href: "/operationalizing-equity", title: "Operationalizing equity", kind: "operationalizing-equity" as const, id: "program", noun: "page" },
  { href: "/practice/measurement", title: "Measurement worksheet", kind: "measurement" as const, id: "worksheet", noun: "worksheet" },
  { href: "/support/directory", title: "DHS offices and guidance", kind: "support-directory" as const, id: "dhs", noun: "directory" },
];

/** My Work under the staff lock: published downloads, not uploads or saved notes. */
export function StaffWorkBrowse({ scope }: { scope?: DownloadScope }) {
  return (
    <section className="space-y-4" aria-labelledby="published-tools-title">
      <h2 id="published-tools-title" className="text-xl font-extrabold">Published tools for your work</h2>
      <p>Read or download a tool when it fits your next step. This page does not accept uploads or save staff writing.</p>
      <details className="rounded-xl border border-line bg-white px-5 py-2">
        <summary className="min-h-11 text-lg font-semibold">Program copies</summary>
        <ul className="mt-4 list-none space-y-4 p-0">
          {SHELF.map((item) => (
            <li key={item.href} className="border-t border-line pt-3">
              <Link href={item.href} className="font-bold">{item.title}</Link>
              <ResourceDownloads kind={item.kind} id={item.id} noun={item.noun} scope={scope} />
            </li>
          ))}
        </ul>
      </details>
      <details className="rounded-xl border border-line bg-white px-5 py-2">
        <summary className="min-h-11 text-lg font-semibold">Practice checklists</summary>
        <p className="text-sm">Each path has a published checklist you can read and download.</p>
        <ul className="mt-4 list-none space-y-4 p-0">
          {GRADUATION_PATHS.map((path) => (
            <li key={path.id} className="border-t border-line pt-3">
              <Link href={`/practice/${path.id}`} className="font-bold">{path.artifactTitle}</Link>
              <p className="m-0 text-sm">{path.title}</p>
              <ResourceDownloads kind="path" id={path.id} noun="checklist" scope={scope} compact />
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
