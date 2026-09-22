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
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-extrabold">Published program copies</h2>
        <p className="text-sm">Download what the program already publishes. This page does not accept uploads or save staff writing.</p>
        <ul className="mt-4 list-none space-y-4 p-0">
          {SHELF.map((item) => (
            <li key={item.href} className="border-t border-line pt-3">
              <Link href={item.href} className="font-bold">{item.title}</Link>
              <ResourceDownloads kind={item.kind} id={item.id} noun={item.noun} scope={scope} />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-extrabold">Practice checklists</h2>
        <p className="text-sm">Each path has a published checklist you can read and download. Nothing you type is stored here.</p>
        <ul className="mt-4 list-none space-y-4 p-0">
          {GRADUATION_PATHS.map((path) => (
            <li key={path.id} className="border-t border-line pt-3">
              <Link href={`/practice/${path.id}`} className="font-bold">{path.artifactTitle}</Link>
              <p className="m-0 text-sm">{path.title}</p>
              <ResourceDownloads kind="path" id={path.id} noun="checklist" scope={scope} compact />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
