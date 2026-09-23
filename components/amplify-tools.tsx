"use client";

import { useState } from "react";
import Link from "next/link";
import { EngagementActivitySample } from "./multimedia/engagement-worked-examples";
import { AMPLIFY_ACTIVITIES } from "@/lib/content/amplify-experiences";

const field = "mt-2 w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800";
const button = "rounded-full bg-[#123f60] px-6 py-3 font-semibold text-white hover:bg-[#092b44] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800";

export function DraftResult({ text, name }: { text: string; name: string }) {
  const [notice, setNotice] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(text); setNotice("Copied."); }
    catch { setNotice("Copy is unavailable here. You can select the draft text and copy it, or download it."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = name + ".txt"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Download requested.");
  }
  return <div className="mt-6 rounded-xl border border-slate-300 bg-white p-5">
    <h3 className="text-xl font-semibold">Your draft</h3>
    <pre className="mt-4 whitespace-pre-wrap break-words font-sans text-base leading-7">{text}</pre>
    <div className="mt-5 flex flex-wrap gap-3"><button className={button} type="button" onClick={copy}>Copy draft</button><button className="rounded-full border border-slate-500 px-5 py-3 font-semibold" type="button" onClick={download}>Download draft</button></div>
    <p role="status" className="mt-3 text-sm">{notice}</p>
  </div>;
}

export function AmplifyActivityStudio() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string>(AMPLIFY_ACTIVITIES[0].id);
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState("");
  const activity = AMPLIFY_ACTIVITIES.find(item => item.id === selected)!;
  const categories = ["All", ...new Set(AMPLIFY_ACTIVITIES.map(item => item.category))];
  return <section aria-labelledby="activity-studio" className="mt-10 rounded-2xl bg-[#f6f3ed] p-5 sm:p-8">
    <h2 id="activity-studio" className="text-3xl font-semibold">Find something to enjoy together</h2>
    <p className="mt-3 max-w-2xl">Choose an idea that fits the people and the moment. These are starting points you can adapt.</p>
    <div role="group" aria-label="Activity interests" className="my-6 flex flex-wrap gap-2">{categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 ${category === item ? "border-[#123f60] bg-[#123f60] text-white" : "border-slate-400 bg-white"}`}>{item}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{AMPLIFY_ACTIVITIES.filter(item => category === "All" || category === item.category).map(item => <article key={item.id} className="flex flex-col rounded-xl border border-slate-300 bg-white p-5">
      <p className="text-sm font-semibold text-[#71502f]">{item.category} · {item.time}</p><h3 className="mt-2 text-xl font-semibold">{item.title}</h3><p className="my-3 grow leading-7">{item.intro}</p>
      <button type="button" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setDraft(""); document.getElementById("gathering-plan")?.scrollIntoView({ block: "start", behavior: "instant" }); document.getElementById("gathering-plan")?.focus(); }} className="mt-2 self-start rounded-md border border-slate-400 px-4 py-2 text-left font-semibold">Explore {item.title.toLowerCase()}</button>
    </article>)}</div>
    <div id="gathering-plan" tabIndex={-1} className="mt-8 scroll-mt-6 rounded-xl border border-[#d3c7b5] bg-white p-5 sm:p-7">
      <p className="text-sm font-semibold text-[#71502f]">A starting point for your gathering</p><h3 className="mt-2 text-2xl font-semibold">{activity.title}</h3>
      <p className="my-4 text-lg">{activity.question}</p><ol className="list-decimal space-y-3 pl-5">{activity.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="mt-4 text-sm leading-6">{activity.access}</p>
      <EngagementActivitySample key={activity.id} activityId={activity.id} />
      <Link className="mt-4 inline-block font-semibold underline" href={activity.href}>{activity.link} →</Link>
      <form className="mt-6 border-t border-slate-200 pt-5" onSubmit={event => { event.preventDefault(); setDraft(`You're invited: ${activity.title}\n\n${activity.intro}\n\n${details.trim() || "Time and joining details: to be arranged."}\n\nCome to share, listen, or enjoy the conversation. No preparation is needed.\n\nA question to begin\n${activity.question}\n\nA simple plan\n${activity.steps.map((step,index) => `${index+1}. ${step}`).join("\n")}\n\nMaking room\n${activity.access}`); }}>
        <label className="block font-semibold" htmlFor="gathering-details">Time, place, and anything you would like to add <span className="font-normal">(optional)</span></label><textarea id="gathering-details" className={field} rows={3} maxLength={2000} value={details} onChange={event => {setDetails(event.target.value);setDraft("");}} />
        <p className="my-3 text-sm">Your draft stays on this page until you copy or download it. Nothing is sent.</p><button className={button}>Create invitation and plan</button>
      </form>
      {draft && <DraftResult key={draft} text={draft} name="amplify-gathering" />}
    </div>
  </section>;
}

export function AmplifyConversationTool({ mode }: { mode: "idea" | "mentoring" }) {
  const [first, setFirst] = useState(""); const [second, setSecond] = useState(""); const [third, setThird] = useState(""); const [draft, setDraft] = useState("");
  const idea = mode === "idea";
  const labels = idea ? ["What are you noticing?", "Who could benefit, and what difference could it make?", "What would you like considered? (optional)"] : ["What would you like help exploring?", "What would make the conversation useful to you?", "How would you like to connect? (optional)"];
  const values = [first,second,third]; const setters = [setFirst,setSecond,setThird];
  return <section className="mt-10 rounded-2xl bg-[#eef3f8] p-5 sm:p-8" aria-labelledby={`${mode}-tool`}>
    <h2 id={`${mode}-tool`} className="text-2xl font-semibold">{idea ? "Shape an idea" : "Prepare a mentoring conversation"}</h2>
    <p className="mt-3">{idea ? "A few thoughts are enough to begin. You can refine the wording before sharing." : "Start with what matters to you. This creates a conversation outline you can take to a willing colleague."}</p>
    <form className="mt-5 space-y-5" onSubmit={event => {event.preventDefault(); if(!first.trim() || !second.trim()) { const input = event.currentTarget.querySelector<HTMLTextAreaElement>(!first.trim() ? `#${mode}-0` : `#${mode}-1`); input?.setCustomValidity("Please add a few words."); input?.reportValidity(); return; }setDraft(idea ? `An idea to explore\n\nWhat I am noticing\n${first.trim()}\n\nWho could benefit and why it matters\n${second.trim()}\n\nWhat I would like considered\n${third.trim() || "I would welcome help exploring possible approaches."}\n\nFor our conversation\nWho is best placed to consider this?\nWhat may be shared, and with whom?\nHow will a response come back to us?\nWhat involvement, if any, would I like?` : `A mentoring conversation\n\nWhat I would like to explore\n${first.trim()}\n\nWhat would make this useful\n${second.trim()}\n\nHow I would like to connect\n${third.trim() || "Let's find an approach that works for both of us."}\n\nQuestions we can explore\nWhat experience could each of us bring?\nWhich expectations are actual requirements, and which are familiar habits?\nWhat opportunities or other perspectives could help?\nWhat would be a manageable next step?`);}}>
      {labels.map((label,index) => <div key={label}><label className="block font-semibold" htmlFor={`${mode}-${index}`}>{label}</label><textarea id={`${mode}-${index}`} className={field} required={index<2} minLength={1} maxLength={2000} rows={3} value={values[index]} onChange={event=>{event.target.setCustomValidity("");setters[index](event.target.value);setDraft("");}} /></div>)}
      <p className="text-sm">Your draft stays on this page until you copy or download it. Nothing is sent. Leave out private case or personnel details.</p>
      <button className={button}>{idea ? "Create my brief" : "Create my conversation outline"}</button>
    </form>
    {draft && <DraftResult key={draft} text={draft} name={idea ? "amplify-idea" : "amplify-mentoring-conversation"} />}
  </section>;
}
