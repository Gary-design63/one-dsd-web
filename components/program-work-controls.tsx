"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { programFunctions } from "@/lib/program/model";
import type { ProgramWorkView } from "@/lib/program/work";
export function ProgramWorkControls(){
  const router=useRouter(),requestId=useRef<string|null>(null);
  const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
  async function send(body:unknown){
    setBusy(true);setMessage("");
    try{
      const response=await fetch("/api/consultant/program",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error??"The change could not be saved.");
      setMessage(result.result?result.result.completed.length+" completed; "+result.result.failed.length+" unfinished; "+result.result.skipped.length+" paused or already assigned.":result.prepared?"Program-area resource reviews are ready.":"Work saved.");
      router.refresh();return true;
    }catch(error){setMessage(error instanceof Error?error.message:"Please try again.");return false;}
    finally{setBusy(false);}
  }
  async function create(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget,data=new FormData(form),date=String(data.get("due")??"");
    requestId.current??=crypto.randomUUID();
    if(await send({action:"create",requestId:requestId.current,functionId:data.get("area"),kind:data.get("kind"),title:data.get("title"),objective:data.get("objective"),dueAt:date?new Date(date+"T12:00:00Z").toISOString():new Date().toISOString()})){form.reset();requestId.current=null;}
  }
  return <section className="card p-6"><h2 className="text-2xl font-semibold">Carry the work forward</h2><p className="mt-2">Assign a concrete piece of work. The Chief of Staff sees it through and keeps the result here for you.</p>
    <div className="my-4 flex flex-wrap gap-3"><button className="btn btn-primary" disabled={busy} onClick={()=>void send({action:"run",limit:2})}>{busy?"Working…":"Run assigned work"}</button><button className="btn" disabled={busy} onClick={()=>void send({action:"prepare"})}>Prepare program-area resource reviews</button><a className="btn" href="/consultant/orchestrator">Review or pause program activity</a></div>
    <details><summary className="cursor-pointer font-semibold">Add a work item</summary>
      <form onSubmit={create} onChange={()=>{requestId.current=null;}} className="mt-4 grid gap-4">
        <label>Program area<select name="area" className="input block w-full">{programFunctions.map(fn=><option key={fn.id} value={fn.id}>{fn.title}</option>)}</select></label>
        <label>Type of work<select name="kind" className="input block w-full"><option value="work_preparation">Prepare a work product</option><option value="resource_review">Review published resources in this area</option></select></label>
        <label>Work item<input className="input block w-full" name="title" minLength={5} maxLength={180} required/></label>
        <label>What should this accomplish?<textarea className="input block w-full" name="objective" minLength={10} maxLength={3000} rows={4} required/></label>
        <label>Ready to begin on <input className="input" type="date" name="due"/></label><button className="btn btn-primary" disabled={busy}>Assign work</button>
      </form>
    </details><p role="status" className="mt-3">{message}</p>
  </section>;
}
export function ProgramObservationForm({task}:{task:Pick<ProgramWorkView,"id"|"status"|"receipt"|"lastEventId">}){
  const router=useRouter(),requestId=useRef<string|null>(null);
  const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
  async function save(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget,data=new FormData(form);setBusy(true);setMessage("");
    try{
      const date=String(data.get("followUp")??""),minutes=String(data.get("minutes")??"");
      requestId.current??=crypto.randomUUID();
      const response=await fetch("/api/consultant/program",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"observe",requestId:requestId.current,taskId:task.id,expectedEventId:task.lastEventId,phase:data.get("phase"),note:data.get("note"),disposition:data.get("disposition"),followUpAt:date?new Date(date+"T12:00:00Z").toISOString():undefined,humanMinutes:minutes?Number(minutes):undefined})});
      const result=await response.json();
      if(!response.ok){if(response.status===409)router.refresh();throw new Error(result.error??"The observation could not be saved.");}
      setMessage("Saved. Your follow-through is recorded.");form.reset();requestId.current=null;router.refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Please try again.");}finally{setBusy(false);}
  }
  return <details className="mt-4"><summary className="cursor-pointer font-semibold">Record follow-through or redirect this work</summary>
    <form onSubmit={save} onChange={()=>{requestId.current=null;}} className="mt-3 grid gap-3">
      <label>What happened?<select className="input block" name="phase" key={task.status}>
        {task.receipt&&<><option value="applied">Applied in work</option><option value="reviewed">Reviewed the result</option></>}
        {["failed","cancelled","completed"].includes(task.status)&&<option value="retry_requested">Try this work again</option>}
        {task.status!=="cancelled"&&<option value="cancelled">Stop this work</option>}
      </select></label>
      <label>Observation and evidence<textarea className="input block w-full" rows={3} minLength={10} maxLength={3000} name="note" required/></label>
      <label>Next direction<select className="input block" name="disposition"><option value="not_yet_known">Still learning</option><option value="retain">Retain</option><option value="revise">Revise</option><option value="stop">Stop</option></select></label>
      <label>Next review <input className="input" name="followUp" type="date"/></label>
      <label>Your time spent, if known (minutes) <input className="input" name="minutes" type="number" min={0} max={100000}/></label>
      <button className="btn" disabled={busy}>{busy?"Saving…":"Save follow-through"}</button><p role="status">{message}</p>
    </form>
  </details>;
}
