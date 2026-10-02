import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import consult from "@/components/consult/consult.module.css";
import { PageIntro } from "@/components/ui";
import { StatusPill, Timeline, formatDate, formatLongDate } from "@/components/consult/consult-ui";
import { SendLinkAgain, UpdateRequestPanel } from "@/components/consult/consultant-actions";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { isOverdue } from "@/lib/consult/business-days";
import { consultantName } from "@/lib/consult/service";
import { getConsultStore } from "@/lib/consult/store";
import { SUPPORT_LABEL, TIMING_LABEL } from "@/lib/consult/types";

export const metadata: Metadata = { title: "One DSD Consult request" };
export const dynamic = "force-dynamic";

export default async function ConsultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await ownerPageGuard())) return null;
  const { id } = await params;
  const store = getConsultStore();
  const request = await store.getRequest(id);
  if (!request) notFound();
  const events = await store.listEvents(id);
  const closed = request.status === "resolved" || request.status === "withdrawn";
  return (
    <>
      <PageIntro
        kicker="One DSD Consult"
        title={request.workTitle}
        lede={`${request.requesterName}${request.requesterUnit ? `, ${request.requesterUnit},` : ""} asked for help on ${formatLongDate(request.createdAt)}.`}
      />
      <div className="wrap">
        <div className={`${consult.pageBody} ${consult.detailGrid}`}>
          <div className={consult.stack}>
            <section className={consult.mainPanel} aria-labelledby="about">
              <p className="kicker">About this request</p>
              <h2 id="about" className="sr-only">About this request</h2>
              <StatusPill status={request.status} overdue={isOverdue(request)} />
              <dl className={consult.facts}>
                <dt>Asked by</dt><dd>{request.requesterName}, {request.requesterEmail}</dd>
                <dt>Supervisor</dt><dd>{request.supervisorName}, {request.supervisorEmail}</dd>
                {request.managerEmail ? <><dt>Manager</dt><dd>{request.managerEmail}</dd></> : null}
                <dt>Kind of help</dt><dd>{SUPPORT_LABEL[request.supportType]}</dd>
                <dt>Timing</dt><dd>{TIMING_LABEL[request.timing]}</dd>
                <dt>Acknowledgment</dt><dd>{request.acknowledgedAt ? `Acknowledged ${formatDate(request.acknowledgedAt)}` : `To be acknowledged by ${formatDate(request.acknowledgmentDueAt)}`}</dd>
                <dt>Taking it on</dt><dd>{request.ownerName ?? "Not named yet"}</dd>
                {request.referredTo ? <><dt>Passed to</dt><dd>{request.referredTo}</dd></> : null}
                {request.outcome ? <><dt>Outcome</dt><dd>{request.outcome}</dd></> : null}
              </dl>
            </section>
            <section className={consult.mainPanel} aria-labelledby="written">
              <p className="kicker">In their words</p>
              <h2 id="written" className="text-2xl font-extrabold">What {request.requesterName} shared</h2>
              <h3>About the work</h3>
              <p className="written">{request.situation}</p>
              <h3>What they would like to leave with</h3>
              <p className="written">{request.goals}</p>
            </section>
            <section aria-labelledby="history">
              <div className={consult.sectionHead}><h2 id="history">What has happened so far</h2></div>
              <Timeline events={events} withTime />
            </section>
          </div>
          <aside className={consult.stack} aria-label="Actions">
            <UpdateRequestPanel id={request.id} status={request.status} ownerName={request.ownerName ?? ""} referredTo={request.referredTo ?? ""} outcome={request.outcome ?? ""} closed={closed} defaultOwner={consultantName()} requesterName={request.requesterName} />
            <SendLinkAgain id={request.id} requesterName={request.requesterName} />
            <p className={consult.quiet}><Link href="/consultant/consult">Back to One DSD Consult</Link></p>
          </aside>
        </div>
      </div>
    </>
  );
}
