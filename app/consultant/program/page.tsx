import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { ProgramWorkControls, ProgramObservationForm } from "@/components/program-work-controls";
import { listProgramWork, summarizeProgramWork } from "@/lib/program/work";
import { receiptBodyForDisplay } from "@/lib/program/receipt-display";
import { programFunctions } from "@/lib/program/model";
import { getStore } from "@/lib/intelligence/memory/store";
export const metadata:Metadata={title:"Program work"};
export const dynamic="force-dynamic";
const labels:Record<string,string>={queued:"Ready to begin",started:"In progress",completed:"Completed",failed:"Unfinished",cancelled:"Stopped",retry_requested:"Ready to retry",applied:"Application reported",reviewed:"Reviewed"};
export default async function ProgramWorkPage(){
  if (!(await ownerPageGuard())) return null;
  let items:Awaited<ReturnType<typeof listProgramWork>>;
  try{items=await listProgramWork();}catch{return <div className="wrap py-10"><h1>Program work</h1><p role="alert">Program work could not be opened. Refresh this page to try again.</p></div>;}
  const summary=summarizeProgramWork(items);
  return <>
    <PageIntro kicker="Consultant Workspace" title="Program work" lede="Turn an idea into useful work, look over what was produced, and keep the next step in view."/>
    <div className="wrap space-y-8 py-8">
      <ProgramWorkControls/>
      <section className="card p-6" aria-labelledby="work-evidence-heading">
        <h2 id="work-evidence-heading" className="text-2xl font-semibold">What the work shows</h2>
        <p>{summary.completed} completed · {summary.failed} unfinished · {summary.queued} ready or in progress · {summary.cancelled} stopped.</p>
        <p>{summary.eligible} eligible work items; {summary.autonomousCompleted} completed without a recorded retry or stop intervention; {summary.assistedCompleted} completed with one.</p>
        <p>{summary.autonomousShare===null?"There is no eligible operational work in this record yet.":summary.autonomousShare+"% of the eligible work set was completed without a recorded intervention."} The program target remains 90–95%. A finished piece of work does not by itself show that staff used it or benefited from it.</p>
        <p className="text-sm text-muted">Period: {summary.period.since??"No start recorded"} to {summary.period.until}. Saved in: {getStore().backend}. Time people spent without recording it is not counted.</p>
        <p>{summary.applicationReports} work items have application reports; {summary.reviewed} have a recorded review.</p>
      </section>
      <section aria-labelledby="work-items-heading"><h2 id="work-items-heading" className="text-2xl font-semibold">Work and follow-through</h2>
        {!items.length&&<p className="mt-4">Add a work item, or prepare the program-area resource reviews, to begin.</p>}
        <div className="mt-5 space-y-6">{items.map(task=><article key={task.id} className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="kicker">{programFunctions.find(f=>f.id===task.functionId)?.title??task.functionId}</p><h3 className="text-xl font-semibold">{task.title}</h3></div><span className="tag">{labels[task.status]??task.status}</span></div>
          <p className="mt-3">{task.objective}</p>
          <p className="text-sm text-muted">Ready from {task.dueAt.slice(0,10)} · Attempt {task.attempts} · {task.evidenceMode==="verification"?"Verification work":"Operational preparation"}</p>
          {task.receipt&&<section className="mt-5 border-t pt-5" aria-label={"Result for "+task.title}>
            <h4 className="font-semibold">Saved result</h4><div className="mt-3 whitespace-pre-wrap">{receiptBodyForDisplay(task.receipt.body, task.receipt.method)}</div>
            <ul className="mt-4 list-disc pl-5">{task.receipt.references.map((reference,index)=><li key={reference.href+index}><Link href={reference.href}>{reference.label}</Link></li>)}</ul>
          </section>}
          <ProgramObservationForm task={task}/>
          <details className="mt-5"><summary className="cursor-pointer font-semibold">Attempts and receipts ({task.events.length})</summary>
            <ol className="mt-3 space-y-4">{task.events.map(event=><li key={event.id} className="border-t pt-3">
              <p><strong>{labels[event.phase]??event.phase}</strong> · {event.at} · {event.actor==="owner"?"You":"The program"}</p><p>{event.note}</p>
              {event.receipt&&<details><summary>See what this attempt produced</summary><div className="mt-3 whitespace-pre-wrap">{receiptBodyForDisplay(event.receipt.body, event.receipt.method)}</div><p className="break-all text-sm">Receipt {event.id} · {event.receipt.method} · content fingerprint {event.receipt.contentHash}</p></details>}
            </li>)}</ol>
          </details>
        </article>)}</div>
      </section>
    </div>
  </>;
}
