import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { PROGRAM } from "@/lib/constants";
import { STATUS_LABEL, SUPPORT_LABEL, TIMING_LABEL, STAGE_LABEL_CR } from "@/lib/intelligence/consult/schema";
import { eligibilityQueue, queue } from "@/lib/intelligence/orchestrator";

export const metadata: Metadata = { title: "Consultation queue" };
export const dynamic = "force-dynamic";

export default async function QueuePage() {
  if (!(await ownerPageGuard())) return null;
  const [pendingEligibility, items] = await Promise.all([eligibilityQueue(), queue()]);
  const open = items.filter((i) => !["completed", "declined", "withdrawn"].includes(i.status));
  const closed = items.filter((i) => ["completed", "declined", "withdrawn"].includes(i.status));
  return (
    <>
      <PageIntro kicker={PROGRAM.practiceOwnerRole} title="Consultation queue" lede="Review open consultation requests. The suggested order reflects urgency, support needed, and stage; it never ranks people. You can pin any request to change its place. Open a request to see its heads-up packet." />
      <div className="wrap py-8">
        <section aria-labelledby="eligibility-heading">
          <h2 id="eligibility-heading" className="text-xl font-extrabold">DSD eligibility review ({pendingEligibility.length})</h2>
          <p className="text-sm text-muted">These voluntary requests are held outside the active consultation queue until you confirm that they concern Disability Services Division work. Do not rank or begin consultation work from this list.</p>
          {pendingEligibility.length ? (
            <div className="overflow-x-auto">
              <table className="data mt-2">
                <thead>
                  <tr>
                    <th scope="col">Request</th>
                    <th scope="col">Stage</th>
                    <th scope="col">Support requested</th>
                    <th scope="col">Timing</th>
                    <th scope="col">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEligibility.map((r) => (
                    <tr key={r.request_id}>
                      <td>
                        <Link href={`/consultant/queue/${r.request_id}`}>{r.request_id}</Link>
                        <span className="block text-sm">{r.work_name}</span>
                      </td>
                      <td>{STAGE_LABEL_CR[r.stage]}</td>
                      <td>{r.desired_support_type.map((s) => SUPPORT_LABEL[s]).join("; ")}</td>
                      <td>{TIMING_LABEL[r.timing_urgency]}{r.deadline_date ? ` (${r.deadline_date})` : ""}</td>
                      <td>{new Date(r.created_at).toLocaleString("en-US", { timeZone: PROGRAM.displayTimeZone })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">There are no requests waiting for a DSD eligibility decision.</p>
          )}
        </section>
        <hr className="my-8" />
        <h2 className="text-xl font-extrabold">Open ({open.length})</h2>
        {open.length ? (
          <div className="overflow-x-auto">
            <table className="data mt-2">
              <thead>
                <tr>
                  <th scope="col">Suggested order</th>
                  <th scope="col">Request</th>
                  <th scope="col">Status</th>
                  <th scope="col">Stage</th>
                  <th scope="col">Support</th>
                  <th scope="col">Timing</th>
                  <th scope="col">Important notes</th>
                  <th scope="col">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {open.map((r, i) => (
                  <tr key={r.request_id}>
                    <td>{r.pinned_order !== undefined ? `Pinned ${r.pinned_order}` : i + 1}</td>
                    <td>
                      <Link href={`/consultant/queue/${r.request_id}`}>{r.request_id}</Link>
                      <span className="block text-sm">{r.work_name}</span>
                    </td>
                    <td>{STATUS_LABEL[r.status]}</td>
                    <td>{STAGE_LABEL_CR[r.stage]}</td>
                    <td>{r.desired_support_type.map((s) => SUPPORT_LABEL[s]).join("; ")}</td>
                    <td>
                      {TIMING_LABEL[r.timing_urgency]}
                      {r.deadline_date ? ` (${r.deadline_date})` : ""}
                    </td>
                    <td>
                      {r.priority_signals.tribal_gate ? "Tribal consultation review needed. " : ""}
                      {r.priority_signals.high_stakes ? "High-stakes request. " : ""}
                      {r.ask_context ? "Submitted through Ask. " : ""}
                    </td>
                    <td>{new Date(r.created_at).toLocaleString("en-US", { timeZone: PROGRAM.displayTimeZone })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">There are no active DSD consultation requests.</p>
        )}
        <h2 className="mt-8 text-xl font-extrabold">Closed ({closed.length})</h2>
        <ul className="list-disc pl-6 text-sm">
          {closed.map((r) => (
            <li key={r.request_id}>
              <Link href={`/consultant/queue/${r.request_id}`}>{r.request_id}</Link> {r.work_name}: {STATUS_LABEL[r.status]}
            </li>
          ))}
        </ul>
        <div className="panel mt-8 text-sm">
          <p className="kicker">DSD pilot response targets</p>
          <p className="m-0">Move a new request to Under review within 3 business days. For non-urgent work, move it from Under review to Scheduled or Declined within 10 business days; respond sooner when work is already underway or has a firm deadline. A declined request always includes another place to go for help. These targets guide workload planning and are not service guarantees.</p>
        </div>
      </div>
    </>
  );
}
