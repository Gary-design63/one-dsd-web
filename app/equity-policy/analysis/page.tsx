import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageIntro } from "@/components/ui";

export const metadata: Metadata = {
  title: "Equity Analysis Toolkit",
  description: "Walk a published decision in Toolkit Studio. Staff pages do not collect typed analyses.",
};

/** F-02: staff analysis writes are fail-closed. The walkthrough form is not shown. */
export default function EquityAnalysisPage() {
  return (
    <>
      <PageIntro kicker="Browse and download only" title="Walk the toolkit" lede="Staff pages do not collect typed analyses or add them to a program record." />
      <div className="wrap max-w-3xl space-y-6 py-8">
        <Notice>
          <strong>The fill-and-save walkthrough is closed. </strong>
          Use Toolkit Studio to walk the eight companion practice questions on a published example and download the pack.
        </Notice>
        <p><Link href="/toolkit-studio" className="btn btn--primary">Open Toolkit Studio</Link></p>
      </div>
    </>
  );
}
