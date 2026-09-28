import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Equity analysis register" };

/** F-01: staff register list/export is fail-closed. No analyses are loaded or downloaded here. */
export default function RegisterPage() {
  return (
    <>
      <PageIntro kicker="Equity Policy" title="Equity analysis records" lede="Completed analyses are not available on this page. For an example you can work through, use Toolkit Studio." />
      <div className="wrap max-w-3xl space-y-6 py-8">
        <Notice>
          This page does not provide completed analyses. Toolkit Studio lets you practice with a published decision and download the example.
        </Notice>
        <p><Link href="/toolkit-studio" className="btn btn--primary">Open Toolkit Studio</Link></p>
        <p className="text-sm"><Link href="/equity-policy">Equity Policy page</Link> · <Link href="/learn/equity-toolkit">Toolkit companion</Link></p>
      </div>
    </>
  );
}
