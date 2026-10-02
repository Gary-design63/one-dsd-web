import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageIntro } from "@/components/ui";
import { OneDsdContextPanel, ProgramContextNote } from "@/components/program-context";
import { ROUTES } from "@/lib/constants";
import { requestedProductContext } from "@/lib/product/request-context";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: ROUTES.requestConsult.label };

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

  redirect(ROUTES.consult.href);
}
