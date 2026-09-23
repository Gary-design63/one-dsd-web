import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageIntro } from "@/components/ui";
import { OneDsdContextPanel, ProgramContextNote } from "@/components/program-context";
import { PROGRAM, ROUTES } from "@/lib/constants";
import { requestedProductContext } from "@/lib/product/request-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: ROUTES.requestConsult.label };

const ALTERNATIVES = [
  { href: ROUTES.ask.href, label: ROUTES.ask.label, note: "Browse published answers and download a copy." },
  { href: ROUTES.library.href, label: ROUTES.library.label, note: "Find reviewed material for the work in front of you." },
  { href: ROUTES.rightPerson.href, label: ROUTES.rightPerson.label, note: "Find the role or office that decides." },
  { href: "/support/directory", label: "DHS offices and guidance", note: "Find the office or guidance that applies to your work." },
];

export default async function RequestPage() {
  const context = await requestedProductContext();
  const surface = await prepareEditableSurface(
    context === "one_dsd" ? "support.request.dsd" : "support.request.one-dhs",
    { scope: context === "one_dsd" ? "dsd" : "one-dhs" },
  );
  const copy = surface.values;

  if (context !== "one_dsd") {
    return (
      <EditableSurfaceRegion surface={surface}>
        <PageIntro
          kicker={stringValue(copy, "introKicker")}
          title={stringValue(copy, "introTitle")}
          lede={stringValue(copy, "introLede")}
        />
        <div className="wrap space-y-6 py-8">
          <ProgramContextNote />
          <OneDsdContextPanel />
          <section className="max-w-4xl border-t border-line pt-5" aria-labelledby="agency-support-title">
            <p className="kicker">{stringValue(copy, "supportKicker")}</p>
            <h2 id="agency-support-title" className="text-2xl font-extrabold">{stringValue(copy, "supportTitle")}</h2>
            <p>{stringValue(copy, "supportBody")}</p>
            <Link href="/support/right-person" className="btn btn--primary">{stringValue(copy, "supportLink")}</Link>
          </section>
        </div>
      </EditableSurfaceRegion>
    );
  }

  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker="Browse and download only"
        title={stringValue(copy, "openTitle")}
        lede="Staff consultation request forms are closed. This page does not collect anything."
      />
      <div className="wrap max-w-3xl space-y-6 py-8">
        <Notice>
          <strong>Consultation requests are not accepted from staff. </strong>
          There is no request form on this page. Nothing you prepare elsewhere is saved or sent from here. The {PROGRAM.practiceOwnerRole} keeps typed tools on authenticated consultant surfaces.
        </Notice>
        <section aria-labelledby="request-alternatives">
          <h2 id="request-alternatives" className="text-xl font-bold">Where to go now</h2>
          <ul className="mt-2 list-disc pl-6">
            {ALTERNATIVES.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link> <span>{item.note}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </EditableSurfaceRegion>
  );
}
