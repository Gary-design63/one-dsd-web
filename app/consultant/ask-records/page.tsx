import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { AskRecordsClient } from "@/components/ask-records-client";
import { listAskResponseRecords } from "@/lib/intelligence/observability/ask-records";
import { ownerPageGuard } from "@/lib/auth/owner-page";

export const metadata: Metadata = { title: "ASK response records" };
export const dynamic = "force-dynamic";

export default async function AskRecordsPage() {
  if (!(await ownerPageGuard())) return null;
  let initialData = null;
  let initialError = "";
  try { initialData = await listAskResponseRecords({ limit: 50 }); }
  catch { initialError = "ASK response records could not be loaded. Refresh to try again."; }
  return <>
    <PageIntro kicker="For your review" title="ASK response records" lede="Read the questions, full answers, sources, and outcomes that ASK keeps. Use them to see what staff received and where ASK needs to improve." />
    <div className="wrap py-8"><AskRecordsClient initialData={initialData} initialError={initialError} /></div>
  </>;
}
