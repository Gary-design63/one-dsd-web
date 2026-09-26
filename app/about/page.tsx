import { ProgramCommitments } from "@/components/program-commitments";
import { DevelopmentPathways } from "@/components/development-pathways";
import { ProgramRelationshipMap } from "@/components/multimedia/worked-practice-examples";
import type { Metadata } from "next";
import Link from "next/link";
import { EquityPractice } from "@/components/equity-practice";
import { PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { linkListValue, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";
import { PROGRAM } from "@/lib/constants";
import { requestedProductContext } from "@/lib/product/request-context";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [surface, context] = await Promise.all([
    prepareEditableSurface("about.page"),
    requestedProductContext(),
  ]);
  const copy = surface.values;
  const supportLinks = linkListValue(copy, "supportLinks");
  const sourcesBody = stringValue(copy, "sourcesBody").replace(/\b(?:its\s+)?review date,\s*/gi, "");
  // The opening text follows the selected program view (One DHS or One DSD), like the header wordmark.
  const forView = (text: string) => context === "one_dsd"
    ? text.replaceAll(PROGRAM.staffBrand, PROGRAM.oneDsdProgramName)
    : text;
  return (
    <EditableSurfaceRegion surface={surface}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={forView(stringValue(copy, "introTitle"))}
        lede={forView(stringValue(copy, "introLede"))}
      />
      <div className="wrap max-w-5xl space-y-10 py-10">
        <section className="grid gap-x-12 gap-y-8 lg:grid-cols-2" aria-labelledby="purpose-title">
          <div>
            <p className="kicker">{stringValue(copy, "purposeKicker")}</p>
            <h2 id="purpose-title" className="text-2xl font-extrabold">
              {stringValue(copy, "purposeTitle")}
            </h2>
            <p>
              {stringValue(copy, "purposeBody")}
            </p>
            <p className="m-0">
              {stringValue(copy, "purposeBoundary")}
            </p>
          </div>
          <div>
            <p className="kicker">{stringValue(copy, "federationKicker")}</p>
            <h2 className="text-2xl font-extrabold">{stringValue(copy, "federationTitle")}</h2>
            <p>
              {stringValue(copy, "federationBody")}
            </p>
            <p className="m-0">
              {stringValue(copy, "federationBoundary")}
            </p>
          </div>
        </section>

        <section aria-labelledby="dhs-connection-title" className="border-t border-line pt-6"><h2 id="dhs-connection-title" className="text-2xl font-extrabold">Our connection to DHS</h2><p>People, Access and Culture supports the people doing the work across DHS. Understanding our programs, partners and shared responsibilities helps connect equity, accessibility and inclusion with everyday decisions.</p><Link href="/understanding-dhs" className="font-semibold">Explore Understanding DHS</Link></section>

        <ProgramRelationshipMap />
        <DevelopmentPathways compact />
        <EquityPractice scope={surface.scope} />
        <ProgramCommitments />

        <section aria-labelledby="participation-title">
          <p className="kicker">{stringValue(copy, "participationKicker")}</p>
          <h2 id="participation-title" className="text-2xl font-extrabold">
            {stringValue(copy, "participationTitle")}
          </h2>
          <div className="mt-4 grid gap-x-12 gap-y-6 md:grid-cols-2">
            <div className="border-t border-line pt-4">
              <h3 className="text-xl font-bold">{stringValue(copy, "voluntaryTitle")}</h3>
              <p className="m-0">
                {stringValue(copy, "voluntaryBody")}
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <h3 className="text-xl font-bold">{stringValue(copy, "requiredTitle")}</h3>
              <p className="m-0">
                {stringValue(copy, "requiredBody")}
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl border-t border-line pt-5" aria-labelledby="sources-title">
          <p className="kicker">{stringValue(copy, "sourcesKicker")}</p>
          <h2 id="sources-title" className="text-2xl font-extrabold">
            {stringValue(copy, "sourcesTitle")}
          </h2>
          <p>
            {sourcesBody}
          </p>
          <p className="m-0">
            {stringValue(copy, "sourcesBoundary")}
          </p>
        </section>

        <section className="grid gap-x-12 gap-y-8 border-t border-line pt-5 md:grid-cols-2" aria-labelledby="boundaries-title">
          <div>
            <p className="kicker">{stringValue(copy, "boundariesKicker")}</p>
            <h2 id="boundaries-title" className="text-2xl font-extrabold">
              {stringValue(copy, "boundariesTitle")}
            </h2>
            <ul className="mt-3 list-disc pl-6">
              {stringListValue(copy, "boundaries").map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="kicker">{stringValue(copy, "supportKicker")}</p>
            <h2 className="text-xl font-extrabold">{stringValue(copy, "supportTitle")}</h2>
            <p>
              {stringValue(copy, "supportBody")}
            </p>
            <div className="flex flex-wrap gap-3">
              {supportLinks.map((link, index) => <Link href={link.href} className={index === 0 ? "btn btn--primary" : "btn btn--light"} key={link.href}>{link.label}</Link>)}
            </div>
          </div>
        </section>
      </div>
    </EditableSurfaceRegion>
  );
}
