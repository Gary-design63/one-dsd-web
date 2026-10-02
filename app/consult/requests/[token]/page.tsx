import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import consult from "@/components/consult/consult.module.css";
import workspace from "@/components/workspace-presentation.module.css";
import { PageIntro } from "@/components/ui";
import { StatusPill, Timeline, formatLongDate } from "@/components/consult/consult-ui";
import { WithdrawButton } from "@/components/consult/withdraw-button";
import { requesterView } from "@/lib/consult/service";
import { OPEN_STATUSES, SUPPORT_LABEL, SUPPORT_LOOKING_FOR, TIMING_LABEL, statusCopy } from "@/lib/consult/types";

export const metadata: Metadata = { title: "Your One DSD Consult request", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function RequestPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const view = await requesterView(token);
  if (!view) notFound();
  const { request, events, overdue } = view;
  const copy = statusCopy(request, overdue);
  const open = OPEN_STATUSES.includes(request.status);
  return (
    <>
      <PageIntro
        kicker="Your request"
        title={request.workTitle}
        lede={`You asked for ${SUPPORT_LOOKING_FOR[request.supportType]} on ${formatLongDate(request.createdAt)}.`}
      />
      <div className="wrap">
        <div className={consult.pageBody}>
          <div className={workspace.workGrid}>
            <div className={consult.stack}>
              <section className={consult.mainPanel} aria-labelledby="where-it-stands">
                <p className="kicker">Where things stand</p>
                <StatusPill status={request.status} overdue={overdue} />
                <h2 id="where-it-stands" className="text-2xl font-extrabold">{copy.headline}</h2>
                <p>{copy.detail}</p>
                <dl className={consult.facts}>
                  {request.ownerName ? <><dt>Taking it on</dt><dd>{request.ownerName}</dd></> : null}
                  <dt>Kind of help</dt><dd>{SUPPORT_LABEL[request.supportType]}</dd>
                  <dt>Timing</dt><dd>{TIMING_LABEL[request.timing]}</dd>
                  {request.referredTo ? <><dt>Passed to</dt><dd>{request.referredTo}</dd></> : null}
                  {request.outcome ? <><dt>Outcome</dt><dd>{request.outcome}</dd></> : null}
                </dl>
                {open ? <WithdrawButton token={token} /> : null}
              </section>
              <section aria-labelledby="history">
                <div className={consult.sectionHead}><h2 id="history">What has happened so far</h2></div>
                <Timeline events={events} />
              </section>
            </div>
            <aside className={workspace.recommendation} aria-label="About this page">
              <div className={consult.asideBlock}>
                <p className="kicker">Who can see this</p>
                <h2 className="text-2xl font-extrabold">You, the consultant, and the people you named</h2>
                <p>Your supervisor{request.managerEmail ? ", your manager," : ""} and the division’s directors can see that you asked for help, the kind of help, and where it stands. What you wrote about the work stays with you and the consultant.</p>
              </div>
              <div className={consult.asideBlock}>
                <h3>Please keep this page to yourself</h3>
                <p>Anyone who has this link can open your request, so please do not forward it. If you lose it, the consultant can send it to you again.</p>
              </div>
              <div className={consult.asideBlock}>
                <p><Link href="/consult">Back to One DSD Consult</Link></p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
