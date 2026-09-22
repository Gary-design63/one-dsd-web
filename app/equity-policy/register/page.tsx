import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Equity analysis register" };

/** F-01: staff register list/export is fail-closed. No analyses are loaded or downloaded here. */
export default function RegisterPage() {
  return (
    <>
      <PageIntro kicker="Browse and download only" title="Equity analysis register" lede="Staff pages do not list, export, or update analysis records." />
      <div className="wrap max-w-3xl space-y-6 py-8">
        <Notice>
          <strong>This register is closed to staff writes and exports. </strong>
          Analyses are not listed or downloaded from this page. Use the Toolkit Studio to walk a published decision and download the pack.
        </Notice>
        <p><Link href="/toolkit-studio" className="btn btn--primary">Open Toolkit Studio</Link></p>
        <p className="text-sm"><Link href="/equity-policy">Equity Policy page</Link> · <Link href="/learn/equity-toolkit">Toolkit companion</Link></p>
      </div>
    </>
  );
}
