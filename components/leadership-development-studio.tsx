"use client";
import { DsdDevelopmentMapExample } from "./multimedia/dsd-development-map-example";

import { useState } from "react";
import Link from "next/link";
import { DraftResult } from "./amplify-tools";
import { DEVELOPMENT_ENTRIES, DEVELOPMENT_CAPABILITIES, DEVELOPMENT_MAP_FIELDS, buildDevelopmentMap, type DevelopmentMapValues } from "@/lib/content/leadership-development";

const field = "mt-2 w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800";
const button = "rounded-full bg-[#123f60] px-6 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800";
type WorkingMap = { capability:string; values:DevelopmentMapValues; draft:string };
const emptyMap = ():WorkingMap => ({capability:DEVELOPMENT_CAPABILITIES[0].id,values:{},draft:""});
export function LeadershipDevelopmentStudio(){
 const [selected,setSelected]=useState(DEVELOPMENT_ENTRIES[0].id);
 const [maps,setMaps]=useState<Record<string,WorkingMap>>({});
 const entry=DEVELOPMENT_ENTRIES.find(e=>e.id===selected)!;
 const map=maps[selected]??emptyMap();
 const capability=DEVELOPMENT_CAPABILITIES.find(c=>c.id===map.capability)!;
 function update(key:keyof DevelopmentMapValues,value:string){setMaps(previous=>{const current=previous[selected]??emptyMap();return {...previous,[selected]:{...current,values:{...current.values,[key]:value},draft:""}};});}
 return <section id="starting-points" className="my-10 scroll-mt-8">
  <h2 className="text-3xl font-semibold">Your interest is a starting point</h2>
  <p className="mt-4 max-w-3xl leading-8">You can begin through your own curiosity, an encouraging conversation, or a desire to strengthen your current practice. No nomination or minimum service is needed to explore this learning experience.</p>
  <div className="mt-6 grid gap-4 md:grid-cols-3" role="group" aria-label="Leadership starting points">
   {DEVELOPMENT_ENTRIES.map(e=><button type="button" key={e.id} aria-pressed={selected===e.id} aria-controls="development-entry" onClick={()=>setSelected(e.id)} className={`rounded-xl border p-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800 ${selected===e.id?"border-[#123f60] bg-[#123f60] text-white":"border-[#dcd5c8] bg-[#faf7f1]"}`}><span className="block text-xl font-semibold">{e.title}</span><span className="mt-3 block leading-7">{e.invitation}</span></button>)}
  </div>
  <div key={selected} id="development-entry" className="mt-7 rounded-2xl border border-[#ded5c7] p-6 sm:p-9">
   <h3 className="text-2xl font-semibold">{entry.title}</h3>
   <div className="mt-4 max-w-3xl space-y-4 leading-8">{entry.teaching.map(p=><p key={p}>{p}</p>)}</div>
   <details className="mt-5 rounded-xl bg-[#eef3f8] p-5"><summary className="cursor-pointer text-lg font-semibold">What you can practice here</summary><ul className="mt-4 list-disc space-y-3 pl-5">{entry.objectives.map(o=><li key={o}>{o}</li>)}</ul></details>
   <div className="my-6 grid gap-5 md:grid-cols-3">{entry.steps.map(s=><article key={s.title} className="rounded-xl bg-[#faf3e8] p-5"><h4 className="text-xl font-semibold">{s.title}</h4><p className="my-3 leading-7">{s.body}</p><Link href={s.href} className="font-semibold">{s.link} →</Link></article>)}</div>
   <p className="rounded-xl bg-[#f2edf7] p-5 leading-8"><strong>A DSD possibility:</strong> {entry.example}</p>
   <form id="development-map" className="mt-8 scroll-mt-8 border-t border-line pt-7" onSubmit={event=>{event.preventDefault();const missing=DEVELOPMENT_MAP_FIELDS.find(f=>f.required&&!map.values[f.key]?.trim());if(missing){const control=event.currentTarget.elements.namedItem(missing.key) as HTMLTextAreaElement;control.setCustomValidity("Add a short response.");control.reportValidity();control.focus();return;}const draft=buildDevelopmentMap(selected,map.capability,map.values);if(draft)setMaps(previous=>({...previous,[selected]:{...map,draft}}));}}>
    <h4 className="text-2xl font-semibold">Make your development map</h4>
    <p className="mt-3 leading-7">Connect an aspiration with practice, support, and useful feedback. A small, well-supported opportunity can be a meaningful place to begin.</p>
    <label className="mt-5 block font-semibold" htmlFor="development-capability">A DEIA capability to focus on</label>
    <select id="development-capability" className={field} value={map.capability} onChange={event=>setMaps(previous=>({...previous,[selected]:{...map,capability:event.target.value,draft:""}}))}>{DEVELOPMENT_CAPABILITIES.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select>
    <div className="my-5 rounded-xl bg-[#eef3f8] p-5 leading-7"><p><strong>A practice possibility:</strong> {capability.practice}</p><p className="mt-3"><strong>A feedback question:</strong> {capability.feedback}</p><p className="mt-3"><strong>Possible evidence:</strong> {capability.evidence}</p></div>
    <DsdDevelopmentMapExample capabilityId={map.capability} />
    <div className="grid gap-5 md:grid-cols-2">{DEVELOPMENT_MAP_FIELDS.map(f=><label key={f.key} className="block font-semibold">{f.label}{!f.required&&<span className="font-normal"> (optional)</span>}<textarea className={field} name={f.key} rows={3} maxLength={2000} required={f.required} value={map.values[f.key]??""} onChange={event=>{if(f.required)event.target.setCustomValidity(event.target.value.trim()?"":"Add a short response.");update(f.key,event.target.value);}} /></label>)}</div>
    <details className="my-6 rounded-xl border border-line p-5"><summary className="cursor-pointer text-lg font-semibold">After you try it: return to the experience</summary><p className="mt-3 leading-7">A result may confirm your approach or show you something unexpected. Both can help you grow.</p><div className="mt-4 space-y-4">{[["happened","What happened, and what feedback did you receive?"],["learned","What changed in your understanding?"],["next","What will you keep, change, or try next?"]].map(([key,label])=><label key={key} className="block font-semibold">{label}<textarea className={field} rows={3} maxLength={2000} value={map.values[key as keyof DevelopmentMapValues]??""} onChange={event=>update(key as keyof DevelopmentMapValues,event.target.value)} /></label>)}</div></details>
    <p className="mb-5 text-sm leading-6">Keep names and private personnel details out of your notes. Your work stays here while you explore the starting points; copy or download it before leaving or reloading this page.</p>
    <button className={button} type="submit">Create my development map</button>
   </form>
   {map.draft&&<DraftResult key={selected+map.draft} text={map.draft} name={`dsd-development-${selected}`} />}
  </div>
 </section>;
}
