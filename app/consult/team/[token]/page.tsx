import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import consult from "@/components/consult/consult.module.css";
import workspace from "@/components/workspace-presentation.module.css";
import { PageIntro } from "@/components/ui";
import { RequestList, SummaryDetails, SummarySentences } from "@/components/consult/consult-ui";
import { leaderView } from "@/lib/consult/service";
import { LEADER_ROLE_LABEL } from "@/lib/consult/types";

export const metadata: Metadata = { title: "One DSD Consult: requests from your team", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function TeamPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const view = await leaderView(token);
  if (!view) notFound();
  const { person, requests, summary } = view;
  const wide = person.role === "deputy_director" || person.role === "division_director";
  return (
    <>
      <PageIntro
        kicker={`${LEADER_ROLE_LABEL[person.role]}${person.displayName ? `, ${person.displayName}` : ""}`}
        title={wide ? "Requests for help across the division" : "Requests for help from your team"}
        lede={wide
          ? "Everyone who has asked the consultant for help, what the work is, who is taking it on, and where it stands."
          : "People who named you as their supervisor or manager have asked the consultant for help. Here is what the work is, who is taking it on, and where it stands."}
      />
      <div className="wrap">
        <div className={`${consult.pageBody} space-y-8`}>
          <section className={workspace.recommendation} aria-label="At a glance">
            <p className="kicker">At a glance</p>
            <SummarySentences summary={summary} />
          </section>
          <section aria-labelledby="requests">
            <div className={consult.sectionHead}><h2 id="requests">Requests</h2></div>
            <p className={consult.sectionIntro}>You can see who asked, the name of the work, the kind of help, who is taking it on, and where it stands. What each person wrote about the work stays with them and the consultant. Asking for help is never used to evaluate anyone.</p>
            <RequestList requests={requests} />
          </section>
          {wide ? (
            <section aria-labelledby="month">
              <div className={consult.sectionHead}><h2 id="month">The division over time</h2></div>
              <p className={consult.sectionIntro}>Counts only, with no details from any request.</p>
              <SummaryDetails summary={summary} />
            </section>
          ) : null}
          <p className={consult.quiet}>Please keep this link to yourself. <Link href="/consult">About One DSD Consult</Link></p>
        </div>
      </div>
    </>
  );
}
