import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui";
import { PacketView } from "@/components/packet-view";
import { QueueItemClient } from "@/components/queue-item-client";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { PROGRAM } from "@/lib/constants";
import { STATUS_LABEL } from "@/lib/intelligence/consult/schema";
import { queueItem } from "@/lib/intelligence/orchestrator";

export const metadata: Metadata = { title: "Heads-up packet" };
export const dynamic = "force-dynamic";

export default async function QueueItemPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await ownerPageGuard())) return null;
  const { id } = await params;
  const r = await queueItem(id);
  if (!r) notFound();
  return (
    <>
      <PageIntro kicker={`${r.request_id} · ${STATUS_LABEL[r.status]}`} title={r.work_name} lede={r.eligibility_status === "pending" ? "Confirm that this request concerns Disability Services Division work before it can enter the active consultation queue. An out-of-scope request must receive a useful redirect." : "Use this editable heads-up packet to prepare for the conversation. You decide what happens with the consultation request. Meeting invitations remain in your hands."}>
        <p className="mt-2 text-sm text-muted">
          Submitted {new Date(r.created_at).toLocaleString("en-US", { timeZone: PROGRAM.displayTimeZone })} (Central). Names are not shown in this workspace. Use the request reference for follow-up until the program has an approved, privacy-safe contact method.
        </p>
      </PageIntro>
      <div className="wrap grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="card">
          <PacketView packet={r.packet} />
          <h3 className="mt-6 text-lg font-bold">Request details as submitted</h3>
          <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[max-content_1fr]">
            <dt className="font-bold">Goals</dt>
            <dd className="m-0">{r.goals}</dd>
            <dt className="font-bold">Situation</dt>
            <dd className="m-0">{r.situation}</dd>
            <dt className="font-bold">Equity questions considered</dt>
            <dd className="m-0">{r.equity_questions_considered || "None recorded"}</dd>
            <dt className="font-bold">People or communities mentioned</dt>
            <dd className="m-0">{r.populations_note || "None"}</dd>
            <dt className="font-bold">Accessibility needs</dt>
            <dd className="m-0">{r.access_note || "None"}</dd>
            <dt className="font-bold">Links</dt>
            <dd className="m-0">{r.links.length ? r.links.join(", ") : "None"}</dd>
          </dl>
        </div>
        <aside>
          <QueueItemClient
            requestId={r.request_id}
            status={r.status}
            eligibilityStatus={r.eligibility_status}
            statusReason={r.status_reason ?? ""}
            scheduledFor={r.scheduled_for ?? ""}
            ownerNotes={r.owner_notes ?? ""}
            pinnedOrder={r.pinned_order ?? null}
            history={r.history}
          />
          <p className="mt-4 text-sm">
            <Link href="/consultant">Back to the queue</Link>
          </p>
        </aside>
      </div>
    </>
  );
}
