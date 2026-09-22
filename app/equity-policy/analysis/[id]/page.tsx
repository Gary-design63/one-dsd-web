import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageIntro } from "@/components/ui";

export const metadata: Metadata = { title: "Equity analysis record" };

/** F-01: staff record get/export is fail-closed. The page does not load a stored analysis. */
export default function AnalysisRecordPage() {
  return (
    <>
      <PageIntro kicker="Browse and download only" title="Analysis records are not shown here" />
      <div className="wrap max-w-3xl space-y-6 py-8">
        <Notice>
          <strong>Staff cannot open stored analysis records. </strong>
          Walk a published example in Toolkit Studio instead.
        </Notice>
        <p><Link href="/toolkit-studio" className="btn btn--primary">Open Toolkit Studio</Link></p>
      </div>
    </>
  );
}
