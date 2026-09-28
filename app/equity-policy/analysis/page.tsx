import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageIntro } from "@/components/ui";

export const metadata: Metadata = {
  title: "Equity Analysis Toolkit",
  description: "Practice the equity analysis questions with a published example.",
};

/** F-02: staff analysis writes are fail-closed. The walkthrough form is not shown. */
export default function EquityAnalysisPage() {
  return (
    <>
      <PageIntro kicker="Equity Policy" title="Practice with the toolkit" lede="Use a published example to explore the equity analysis questions before applying the official toolkit to your own work." />
      <div className="wrap max-w-3xl space-y-6 py-8">
        <Notice>
          This practice does not submit an official equity analysis. Use Toolkit Studio to try the eight questions with a published example and download a copy.
        </Notice>
        <p><Link href="/toolkit-studio" className="btn btn--primary">Open Toolkit Studio</Link></p>
      </div>
    </>
  );
}
