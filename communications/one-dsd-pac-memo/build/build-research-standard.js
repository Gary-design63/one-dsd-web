const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");

const CHANGELOG=[
 ["1.0","September 18, 2026","Gary Banks","First version. Follows the crosswalk, the three-year plan, and the method discussion behind both."],
 ["1.1","September 18, 2026","Gary Banks","Fixed section 1 and section 6. Version 1.0 talked about a future consultant taking over. But the real point is bigger than that: this Program has to stay steady through a change in Division Director, Manager, or Supervisor — a change in leadership, not just a change in staff. Section 6 now starts with that, and section 7 is a new, step-by-step plan for exactly that moment."],
];

const PRACTICES=[
 ["Have a second person check the coding","One person coded the 2023–2024 findings. Relying on just one reader is a known weak point in this kind of work.","Every time we code a new round of findings — a new check-in, a new set of sessions — a second, separate person checks a sample of it, and we report how closely the two of them agree, before we publish anything."],
 ["Say plainly who wore which hats","One person can be the interviewer, the person who read the findings, the one who built the Program, and later the one grading it — all at once. The 2023–2026 record never said this out loud.","Any report of findings says, in one short paragraph, every role its author played in producing what it's reporting on."],
 ["Write down who we talked to, and who we missed","We never wrote down who was invited to the original 23 sessions and who actually showed up, so we don't really know how far our findings stretch.","Before publishing any findings, say who was invited, who took part, and what we do and don't know about the people who weren't there."],
 ["Check a finding against more than one source","A single source of information can be wrong in a way its own method can't catch.","We don't publish a claim that something “worked” based on one source alone. We check it against at least one other kind of source — interviews against HR records, say, or either one against how much staff actually use the Program — before we call it a finding instead of just a hint."],
 ["Explain why, not just what","Our analysis already shows that some teams feel safe and support each other, and others don't — and says this matters more than any other single finding — without yet explaining why the difference exists.","When we find that something worked in some places and not others, we say why — what was different about those places — not just that a difference exists."],
 ["Test new things with real staff before rolling them out","Courses, ASK, and the download feature were all built and finished before we ever asked staff what they thought.","Any new lesson, tool, or feature gets tried out with a small group of volunteer staff before we call it finished — in a quick trial-and-fix round — not just reviewed by whoever built it."],
 ["Decide what success looks like before we know the result","The measures of success in the three-year plan were written in September 2026, after most of the Program already existed.","Before any new project starts, or any new check-in begins, we write down and date how we'll know it worked — first. A measure written after we already know the answer isn't really a measure. It's a description."],
 ["Ask the same questions the same way, every time","Four planned check-ins — 2023–2024, 2027, 2029, 2031 — could easily turn into four separate studies that just happen to ask similar things.","Every check-in after the first uses the exact same list of themes and questions as the one before it, so we're comparing like to like. We can add a theme if something genuinely new shows up. We don't quietly drop or redefine one."],
 ["Hold data to a fair standard","Data broken down by group can itself become a privacy problem, or a misleading comparison, if we're not careful.","Every new report using broken-down data compares against an outside benchmark, not only our own past numbers, and never publishes a group small enough that someone could be identified. No quiet exceptions."],
 ["Roll out big changes in stages, by default","The January 2027 launch happens for everyone at once. That's the one choice on this whole list that's already too late to change — and part of why this standard exists is to stop it from happening again.","Any future large rollout — a new course for the whole Division, or expanding to another division — starts with a small group first and adds more over time, by default, unless there's a stated reason not to. All-at-once becomes the exception we explain, not the plan we default to."],
];

const GATE=[
 "If this uses new interview or session data: did a second person check a sample of the coding, and did we say how well they agreed?",
 "If this reports findings: does it say who we talked to, who we didn't, and what that might mean?",
 "If this claims something worked: is that backed up by more than one kind of evidence?",
 "If this checks something new: did we write down how we'd know it worked, before we knew the answer?",
 "If this repeats an earlier check-in: does it use the same questions and themes as last time, with no quiet changes?",
 "If this publishes data broken down by group: does it follow our rules on comparison and privacy?",
 "If this rolls out something new at scale: did we consider starting small first — and if we didn't, do we say why?",
];

const kids=[
 ...title("RESEARCH AND EVALUATION STANDARD",[
   "How future versions of this Program keep their evidence trustworthy",
   "One DSD People, Access and Culture Program · Disability Services Division"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager  —  Heidi Hamilton, Division Director"),
 line("DATE","September 18, 2026"),
 line("VERSION","1.1"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("1. Why this exists, and why it has to outlast any one leader"),
 p("Here's the main point, not a side note: this Program is built to stay steady even when leadership changes. A new Division Director, a new Manager, a new Supervisor, each with their own priorities — that's not some rare risk to plan for. It's just the normal reality of working inside a Division, inside a Department, inside a state government. A program that only keeps running because one particular Director happens to like it isn't really a program. It's that person's pet project, and it ends the day they leave. Everything in this document, and in the testing plan that goes with it, exists so that doesn't happen here."),
 p("This is a different, harder problem than a new consultant taking over, which section 6 also covers. A new consultant can pick up the existing evidence and keep going. But a new Director who was never told this Program is anything more than the last Director's personal choice has no reason to keep it running. That's why section 6 starts with leadership change, not staff change."),

 h1("2. Version history"),
 table([900,2200,1900,4360],["Version","Date","Author","What changed"],CHANGELOG),
 p("This table grows over time. Any future change to this standard — a rule added, a rule dropped, a number changed — gets a new row here. It doesn't get a quiet edit to the row above it."),

 h1("3. Ten habits we commit to going forward"),
 p("Each one exists because something specific already went wrong, or could have, in this Program's own history. None of these are borrowed ideas from somewhere else. All ten trace back to a real weak spot in the evidence this Program is actually built on."),
 table([2000,3200,4260],["Habit","What it fixes","When we do it, going forward"],PRACTICES),

 h1("4. Before we publish anything new: a short checklist"),
 p("Not every question below applies to every piece of work — a small content update doesn't need all of this; a new check-in needs most of it. But before we call something a finding, a result, or a success, whoever's reporting it answers these questions out loud, not just in their head:"),
 ...GATE.map((q)=>nb(q)),
 p("A fair “no, and here's why” is fine. Quietly skipping a question is not. This standard asks for honesty, not perfection — the same rule we already hold the Program itself to."),

 h1("5. Who's in charge of this, and how it gets checked"),
 p([b("Who follows it. "),tx("Whoever holds the Equity and Inclusion Operations Consultant role at the time — not tied to Gary Banks by name, because the whole point of this document is that it shouldn't depend on one person remembering.")]),
 p([b("Who checks it. "),tx("The Division's staff equity group, once it's set up, reviews this standard once a year, at the same time as the year-end check built into our reporting plan. If a review finds this standard wasn't followed, it goes to the leadership group — and, separately from any yearly schedule, section 7's leadership-change plan kicks in the moment a new Director, Manager, or Supervisor takes office, no matter what else is happening on the calendar.")]),
 p([b("How it changes. "),tx("A habit can be added, dropped, or changed at that same yearly review, and it gets written down as a new row in the table above. It can't quietly disappear just because a deadline made it inconvenient — if that decision gets made anyway, it gets written down too.")]),

 h1("6. Five real situations this Program will run into"),
 h2("A new Division Director, Manager, or Supervisor takes office"),
 p("This is the exact situation this document is built for. Section 7 spells it out in full, so it doesn't just live on this list: within a set number of days after any change at these levels, the new leader gets handed a fixed set of background material and a scheduled meeting with the staff equity group's chair. That way, the Program is handed over as something the Division has already committed to — not something a new leader has to discover on their own, and could just as easily choose to end."),
 h2("A new consultant takes over the role"),
 p("A smaller version of the same problem. They inherit this standard as their guide for how evidence gets produced here, along with a written record of how reliable our coding has been so far, and they're expected to keep that record going, not start over."),
 h2("The Program spreads to another division"),
 p("The new division does its early interviews and sessions using all ten habits from day one — a second coder, a written record of who was reached, a real starting survey collected at the same time as the interviews — instead of adding these habits years later, the way this Program did. This is the lesson from our own history, used on purpose this time, from the very start."),
 h2("A future check-in gets pushed back or skipped"),
 p("We say so, by name, in the very next quarterly report — rather than letting our long-running comparison quietly continue as if nothing changed. A missed 2029 or 2031 check-in, left unsaid, would break the whole point of comparing results over time, which is exactly what this standard is here to protect."),
 h2("A new lesson, tool, or course gets proposed"),
 p("It gets tried out with real staff first (habit 6) before we call it finished, and we check whether it's actually being used (habit 4), using at least our own usage numbers, before anyone claims it helped."),

 h1("7. The leadership-change plan, step by step"),
 p("This runs any time a new Division Director, Manager, or Supervisor takes office — triggered by the event itself, not by the calendar. It happens on its own, separate from the once-a-year review in section 5."),
 nb([b("Within 15 days: "),tx("the chair of the staff equity group — or the consultant, if that seat is empty — sends the new leader a standard set of background material: this document, the Program's logic model, the crosswalk to ADSA's six goals, and the governance rules currently in place.")]),
 nb([b("Within 30 days: "),tx("a written note goes in the decision log confirming that the Program's basis in official policy — the One Minnesota Plan, the Olmstead Plan, the DHS Equity Policy, and ADSA's own equity plan — hasn't changed. If it has, that gets said plainly, not assumed away.")]),
 nb([b("Within 60 days: "),tx("a scheduled, on-the-record meeting between the new leader and the staff equity group's chair, confirming the existing governance rules stay in force under the new leader, with no need to rewrite them from scratch.")]),
 nb([b("Within 90 days: "),tx("the new leader shows up in the regular quarterly report cycle for the first time — so their time in the role starts inside the same reporting rhythm every leader before them used, not outside it.")]),
 p([b("The one rule that makes all of this actually work: "),tx("every governance rule this Program depends on is written about a job title, never a person's name — “the Division Director leads the leadership group,” never “Heidi Hamilton leads the leadership group.” A rule written to a name stops working the day that name changes. A rule written to a job title doesn't. Checking that this was actually done is itself one of the tests in the evaluation plan that goes with this document.")]),

 h1("8. Where each piece of this work lives"),
 bl([b("Program crosswalk"),tx(" and "),b("the three-year plan and blueprint"),tx(" — the method note in each is this same thinking, turned into ongoing practice.")]),
 bl([b("What the Division Said: our analysis of what staff told us"),tx(" — the coding that habit 1 (a second checker) applies to first, on our existing sample.")]),
 bl([b("Reporting process"),tx(" — the schedule this standard's yearly review rides on.")]),
 bl([b("Evidence record: DSD equity sessions"),tx(" — where the “who we talked to” note (habit 3) and the “who wore which hats” note (habit 2) belong, once written.")]),
 bl([b("Program evaluation plan"),tx(" — the real, step-by-step tests these ten habits turn into, including the job-title check named just above.")]),
];

module.exports.doc=docShell({docTitle:"Research and Evaluation Standard",footer:"Research and evaluation standard  ·  Disability Services Division  ·  v1.1  ·  draft",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Research-and-Evaluation-Standard.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
