import type { Metadata } from "next";
import Link from "next/link";
import consult from "@/components/consult/consult.module.css";
import workspace from "@/components/workspace-presentation.module.css";
import { PageIntro } from "@/components/ui";
import { RequestList, SummaryDetails, SummarySentences, capitalize, countWord } from "@/components/consult/consult-ui";
import { DeliverButton, LeadersPanel } from "@/components/consult/consultant-actions";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { emailConfigured } from "@/lib/consult/email";
import { summarize, toLeaderView } from "@/lib/consult/service";
import { consultStorageIsDurable, getConsultStore } from "@/lib/consult/store";
import { OPEN_STATUSES } from "@/lib/consult/types";

export const metadata: Metadata = { title: "One DSD Consult" };
export const dynamic = "force-dynamic";

export default async function ConsultDashboardPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  if (!(await ownerPageGuard())) return null;
  const { view } = await searchParams;
  const store = getConsultStore();
  const all = await store.listRequests();
  const people = await store.listPeople();
  const summary = summarize(all);
  const shown = (view === "all" ? all : all.filter((row) => OPEN_STATUSES.includes(row.status))).map((row) => toLeaderView(row));
  const durable = consultStorageIsDurable();
  const unsent = (await store.listUnsentNotices(100)).length;
  return (
    <>
      <PageIntro
        kicker="Consultant Workspace"
        title="One DSD Consult"
        lede="The requests people have brought to you: who asked, what the work is, who is taking it on, and where it stands. Any request still waiting after two business days is marked, so none is missed."
      />
      <div className="wrap">
        <div className={`${consult.pageBody} space-y-8`}>
          {!durable ? (
            <div className="notice notice--warn"><strong>Requests are not being saved permanently yet. </strong>The database for One DSD Consult is not connected, so anything entered now will be lost when the program restarts. Please connect it before colleagues begin using One DSD Consult.</div>
          ) : null}
          {!emailConfigured() ? (
            <div className="notice notice--warn"><strong>Email is not switched on yet. </strong>{unsent === 0 ? "Messages to requesters and leaders will be saved here until it is." : `${capitalize(countWord(unsent))} ${unsent === 1 ? "message is" : "messages are"} saved here, waiting to be sent.`} Once the email settings are added in the hosting dashboard, they will go out.</div>
          ) : null}
          <section className={workspace.recommendation} aria-label="At a glance">
            <p className="kicker">At a glance</p>
            <SummarySentences summary={summary} />
          </section>
          <section aria-labelledby="requests">
            <div className={consult.sectionHead}>
              <h2 id="requests">{view === "all" ? "All requests" : "Open requests"}</h2>
              <p className="m-0">{view === "all" ? <Link href="/consultant/consult">Show open requests only</Link> : <Link href="/consultant/consult?view=all">Include requests that are closed</Link>}</p>
            </div>
            <RequestList requests={shown} detailHref={(id) => `/consultant/consult/${id}`} />
          </section>
          <section aria-labelledby="monthly">
            <div className={consult.sectionHead}><h2 id="monthly">The month at a glance</h2></div>
            <p className={consult.sectionIntro}>Counts only, with no details from any request, so it can be shared with your manager and the Division Director.</p>
            <SummaryDetails summary={summary} />
          </section>
          <section aria-labelledby="leaders">
            <div className={consult.sectionHead}><h2 id="leaders">Who can follow requests</h2></div>
            <LeadersPanel people={people.map((person) => ({ email: person.email, displayName: person.displayName, role: person.role, revoked: Boolean(person.revokedAt) }))} />
          </section>
          <section aria-labelledby="messages">
            <div className={consult.sectionHead}><h2 id="messages">Email messages</h2></div>
            <p className={consult.sectionIntro}>{unsent === 0 ? "Nothing is waiting to be sent." : `${capitalize(countWord(unsent))} ${unsent === 1 ? "message is" : "messages are"} waiting to be sent.`}</p>
            <DeliverButton />
          </section>
        </div>
      </div>
    </>
  );
}
