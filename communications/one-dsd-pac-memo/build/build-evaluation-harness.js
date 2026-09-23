const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");

const CHANGELOG=[["1.0","September 18, 2026","Gary Banks","First version. Turns the ten habits in the Research and Evaluation Standard into real tests, with steps, pass-or-fail rules, a schedule, and an owner."]];

const T=(id,name,proc,thresh,cad,owner)=>[id,name,proc,thresh,cad,owner];
const COLS=["ID","Test","How we do it","Pass or fail","How often","Who does it"];
const WIDTHS=[600,1750,3400,2400,1000,1210];

const A=[
 T("A1","A second person checks the coding","A second, separate person codes a random one-fifth sample of each new round of findings, on their own.","If the two readers agree closely (a standard score of 0.70 or higher), it passes. A middling score means the two readers talk it through and write down what they agreed on. A low score means we re-code the whole round.","Every check-in","The consultant plus a second, separate reader"),
 T("A2","Check who we actually reached","Compare the list of people invited and the people who showed up against the Division's full staff list.","Any team with zero people represented gets named plainly in the published record — it doesn't get quietly folded into an overall number.","Every check-in","The consultant, double-checked by the staff equity group"),
 T("A3","Check that our questions stayed the same","Compare this round's list of themes, word for word, against the list from the round before it.","Any theme that's added, dropped, or reworded needs a written reason, on record, before we publish anything.","Every check-in after the first","The consultant"),
];
const B=[
 T("B1","American-English word check","Scan every page, course, job aid, and document the Program publishes for British spelling. Check each hit: is it inside a quoted title from an outside source? If so, we leave it and note why. If not, we fix it.","Zero unfixed hits, outside of quoted titles from outside sources.","Before every update; a full check at each major version","The consultant"),
 T("B2","Plain-language check","Run a standard reading-level score on every published page.","Staff-facing pages score at an eighth-grade reading level or easier, matching our own Division rule on plain language.","Before every update","The consultant"),
 T("B3","Access check, for people with disabilities","An automatic scan of every page against the standard accessibility rules for websites (called WCAG, at the common government level called AA), plus a hands-on check with a screen reader on a rotating one-tenth sample of pages.","Zero failures on the automatic scan. Any hands-on finding gets fixed within 30 days.","Automatic scan: every month. Hands-on check: every three months","The consultant"),
 T("B4","Link and source check","An automatic check of every outside link the Program cites, to see if it still works.","No broken or unverified outside link at any update.","Every month, alongside the monthly update note","The consultant"),
 T("B5","Staff-voice check","A person reads a rotating one-tenth sample of pages and checks: does this sound like it's written for staff, in plain, direct language — not like an academic paper or a government memo?","Any page that fails gets added to the list of content to fix.","Every three months","The consultant"),
];
const C=[
 T("C1","Small-group privacy check","Every number broken down by group is checked before it's published: is any single group smaller than five people?","Zero published numbers for a group smaller than five.","Every report on gaps","Data and Analytics"),
 T("C2","Fair-hiring check","For hiring, promotion, and selection numbers, compare each group's selection rate to the highest one. This follows a well-known federal rule: if one group is chosen less than 80 percent as often as the top group, that's a warning sign worth a closer look.","A ratio under 80 percent opens our fix-it process.","Every three months, once we have baseline numbers (2027 on)","Data and Analytics"),
 T("C3","Outside comparison check","Compare our own workforce to the population of the area we serve — not just to our own past numbers.","Any real difference is stated plainly in the quarterly report, not left unsaid.","Once a year","Data and Analytics"),
 T("C4","Follow-through check","For every gap flagged in the report three months before, check: is there a dated fix-it plan on file, with someone's name on it?","Zero gaps that carry over for two check-ins in a row with nothing done about them.","Every three months","Leadership group"),
];
const D=[
 T("D1","Fair-use check","Compare how much each part of the Division actually uses the Program — course completions, downloads, ASK questions.","No team goes silently unused for a whole quarter without someone following up.","Every three months","The consultant"),
 T("D2","Where-people-quit check","For every course, check the finish rate at each lesson.","Any lesson where more than 30 percent of people quit, compared to the lesson before it, gets added to the content fix-it list.","Every three months","The consultant"),
 T("D3","Privacy check on usage numbers","Try to filter or sort a usage report down to one identifiable person, and confirm it can't be done.","It must be impossible to identify one person from any usage report.","Any time the reporting tool changes, and once a year regardless","Data and Analytics"),
];
const E=[
 T("E1","Two-source check","Before we publish any claim that something “worked,” someone other than the person making the claim checks: is it backed up by at least two separate kinds of evidence?","A claim that fails gets published as “a sign worth watching,” not as a finished finding.","Every time we claim a result","Someone other than the person making the claim"),
 T("E2","Timing check","Compare the date we wrote down how we'd measure success against the date we found out the actual result.","If we wrote the measure after we already knew the result, we say so plainly — we don't present it as if it came first.","Every check-in","The consultant"),
];
const F=[
 T("F1","Job-title, not name, check","Read every governance rule and confirm it names a job title — never a person's name — for every duty.","Zero rules that name a specific person instead of a job title.","Once a year, and right after any rule is written or changed","Staff equity group"),
 T("F2","Policy-still-applies check","Confirm, in writing, that the Program's basis in official policy — the One Minnesota Plan, the Olmstead Plan, the DHS Equity Policy, ADSA's equity plan — hasn't changed.","Any change gets stated plainly. Nothing gets quietly assumed to still apply.","Once a year, and right after any change in leadership","Staff equity group"),
 T("F3","Ready-for-handoff check","Confirm the standard set of background material — this plan, the Standard, the logic model, the crosswalk, the current rules — is put together and current, ready to hand to a new leader.","That packet is no more than 12 months old.","Once a year","Chair of the staff equity group"),
 T("F4","Outside-recognition check","Confirm the Program is named, by title, in at least one official Division or Administration planning document that exists on its own — not only in documents this consultant wrote.","At least one outside mention exists.","Once a year","Staff equity group"),
];

const SCHEDULE=[
 ["Every update","B1, B2, B4","American English, plain language, broken links"],
 ["Every month","B3 (automatic part)","Access scan"],
 ["Every three months","B3 (hands-on part), B5, C2, C4, D1, D2","Access spot-check; staff-voice check; fair-hiring; follow-through; fair-use; where people quit"],
 ["Once a year","C3, D3, F1, F2, F3, F4","Outside comparison; privacy check; job-title check; policy check; ready-for-handoff; outside recognition"],
 ["Every check-in (every two years)","A1, A2, A3","Second-person coding check; who-we-reached check; same-questions check"],
 ["Whenever it happens","F1 (rule change), F2 (leadership change), D3 (tool change), E1 & E2 (any claim of a result)","Runs the moment it's needed, no matter what the calendar says"],
];

const ESCALATION=[
 ["Small","A broken link. A hard-to-read page. One access issue.","Added to the monthly to-fix list."],
 ["Medium","A fair-hiring ratio under 80 percent. A theme changed with no reason given. A team with zero use.","Named in the next quarterly report. The fix-it process opens."],
 ["Big","A rule that names a person instead of a job title. The Program found nowhere outside its own paperwork. A change in the policy this Program is built on.","Goes straight to the leadership group. It doesn't wait for the next quarterly report."],
];

const kids=[
 ...title("PROGRAM EVALUATION PLAN",[
   "Real tests, steps, and a schedule for checking the whole Program",
   "One DSD People, Access and Culture Program · Disability Services Division"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager  —  Heidi Hamilton, Division Director"),
 line("DATE","September 18, 2026"),
 line("VERSION","1.0"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("1. Why a checklist alone isn't enough"),
 p("The Research and Evaluation Standard lists ten habits. A habit is something a person is supposed to remember to do. This plan is different: it's a fixed list of tests, each with clear steps and a clear pass-or-fail rule, run on a set schedule that doesn't depend on anyone remembering. This document turns every habit in the Standard into one or more real tests below, each with its own ID, so a specific problem can be named and tracked instead of just described in general terms."),
 p("Six groups of tests. Twenty tests in all. Most of them are things a person does on a schedule with a simple checklist — not computer code. That's exactly why the schedule in section 3 matters just as much as the tests themselves."),

 h1("2. The six groups of tests"),
 h2("Group A — Are we coding the evidence carefully?"),
 table(WIDTHS,COLS,A),
 h2("Group B — Is our content clear, correct, and easy to use?"),
 p([b("B1 finishes something we already owed. "),tx("The American-English word check is the full language review that was talked about earlier and hadn't been run yet. It's now a permanent, scheduled test instead of a one-time cleanup.")]),
 table(WIDTHS,COLS,B),
 new Paragraph({children:[new PageBreak()]}),
 h2("Group C — Is our data fair and accurate?"),
 p("These tests turn on once Workstream 4 builds our data baseline. Until then, they're written down and ready — so the data system gets built to already pass them, instead of needing rework later."),
 table(WIDTHS,COLS,C),
 h2("Group D — Is the Program actually being used, and used fairly?"),
 p("These turn on once the usage-tracking feature is added to Workstream 1."),
 table(WIDTHS,COLS,D),
 h2("Group E — Can we back up what we claim?"),
 table(WIDTHS,COLS,E),
 h2("Group F — Would this Program survive a change in leadership?"),
 p([b("This group exists for one reason: "),tx("to test, in a real and repeatable way, whether the Program would actually keep running through a change in Division Director, Manager, or Supervisor — not just assume it would. Test F4 matters most of all: a program that's only ever mentioned in its own consultant's paperwork has no real footing beyond whoever currently likes it.")]),
 table(WIDTHS,COLS,F),

 new Paragraph({children:[new PageBreak()]}),
 h1("3. The full schedule"),
 p("What runs, and when, across all six groups at once."),
 table([1900,3300,5160],["How often","Tests","What it covers"],SCHEDULE),

 h1("4. What happens when something fails a test"),
 table([1400,4000,4960],["How serious","Example","What happens"],ESCALATION),
 p("No failed test gets fixed quietly and re-run until it passes without a record. Every failure, big or small, gets written down before it gets fixed. That written record is part of what makes our next long-term comparison (habit 8 in the Standard) something people can actually trust."),

 h1("5. How this connects to the Research and Evaluation Standard"),
 p("The Standard lists ten habits, in plain language, with the reason for each one. This plan is those same ten habits turned into action: every habit in the Standard matches at least one test above, and a change to one document should lead to a look at the other. If the two ever seem to disagree, the Standard sets the rule, and this plan sets the exact steps that prove the rule is actually being followed."),

 h1("6. Version history"),
 table([900,2200,1900,4360],["Version","Date","Author","What changed"],CHANGELOG),

 h1("7. Where each piece of this work lives"),
 bl([b("Research and Evaluation Standard"),tx(" — the ten habits, and the leadership-change plan this group F tests against.")]),
 bl([b("Program logic model"),tx(" and "),b("the crosswalk"),tx(" — part of the standard background packet that test F3 checks is current.")]),
 bl([b("Reporting process"),tx(" — where a medium or big failure from section 4 actually gets reported.")]),
];

module.exports.doc=docShell({docTitle:"Program Evaluation Plan",footer:"Program evaluation plan  ·  Disability Services Division  ·  v1.0  ·  draft",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Program-Evaluation-Harness.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
