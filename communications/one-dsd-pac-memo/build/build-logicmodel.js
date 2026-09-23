const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,table,line,rule,title,docShell}=require("./design.js");

const CHAIN=[
 ["Inputs","What was invested to get here","71 interviews · the Shepherd collaboration · 23 sessions, 172 findings · the governing plans · one consultant"],
 ["Activities","What was done with it","Coding and analysis · institutional and landscape research · curriculum and requirements design · the Program build"],
 ["Outputs","What exists because of it","The built Program · the evidence record · the analysis · the Framework · this document set"],
 ["Outcomes","What changes for staff and the Division","Shared tools reach every level · feedback loops close · governance seated · a data baseline exists"],
 ["Impact","What it means over years","Equity operational, not individual · hiring, advancement and trust measurably improved · the governing plans met in practice"],
];

const kids=[
 ...title("PROGRAM LOGIC MODEL",["How the evidence becomes the Program, and the Program becomes the outcomes the Division asked for","One DSD People, Access and Culture Program · Disability Services Division"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("IN COLLABORATION WITH","Sarah Shepherd, Project Manager, Disability Services Division"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager  —  Heidi Hamilton, Division Director"),
 line("DATE","September 18, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("1. What this document is"),
 p("A logic model is a single page that reads left to right: what was invested, what was done with it, what exists as a result, what changes because it exists, and what that means over years. It is the plainest way to show that the Program is not a collection of separate initiatives. It is one chain, running from the 2023 interviews to the outcomes the Division asked for, and every link in it is accounted for in the evidence record, the analysis, the operational workplan or this document."),
 p("It exists to answer one question directly: this work produces, and over what time. The table below is the chain in outline. The sections that follow it give each stage in full."),

 h1("2. The chain, in outline"),
 table([1500,2600,5260],["Stage","What it means","In this Program"],CHAIN),

 new Paragraph({children:[new PageBreak()]}),
 h1("3. Inputs — what was invested"),
 bl("71 interviews conducted independently across the Disability Services Division, January to July 2023."),
 bl([b("A project management collaboration with Sarah Shepherd, "),tx("Project Manager for the Disability Services Division, April 2023 until her departure from the agency at the end of 2024, which carried the division-wide equity assessment — concluded December 2023 — and the institutional examination.")]),
 bl("23 division-wide listening sessions, producing 172 findings and 131 recommendations, attributed to teams and de-identified."),
 bl("Enterprise relationships and equity expertise built across the Department since 2016."),
 bl("The governing commitments the Program has to serve: the One Minnesota Plan, the Olmstead Plan, the DHS Equity Policy and its Equity Analysis Toolkit, the Aging and Disability Services Administration's equity implementation plan, and the Disability Services Division's own operational non-negotiables."),
 bl("The DSD DEIA Integration Framework, version 1.0, completed January 2026: a three-year implementation manual with ten sequential steps, gate checks and RACI assignments."),
 bl("One equity and inclusion operations consultant, working largely alone, with project management support through the end of 2024; from January 2025 the build was carried by the consultant alone."),

 h1("4. Activities — what was done with it"),
 bl("Open coding assigned labels to each of the 172 findings; axial coding connected them into categories and relationships."),
 bl("A critical examination of the Office of Employee Culture, undertaken to understand how an established administration shapes its equity work, not as a candidate or a model to copy; alongside it, an examination of the DHS Equity Policy and its toolkit, and of the equity work of every Minnesota state agency and county."),
 bl("Synthesis of that research into an evidence- and practitioner-based approach, and the decision that the answer is an operational program rather than a training calendar or a committee."),
 bl("Design of the program requirements (version 2.0), a cross-cultural curriculum, and the 38-module Intercultural Practice and Equity curriculum."),
 bl("Build of the Program itself: the learning library, courses, ASK, practice paths, job aids, Minnesota Communities briefs, the One DSD Team, Amplify Equity, leadership development, and the ability to take away every non-course resource as a Word, Excel, PowerPoint or PDF file."),
 bl("Two activities added on your direction: a short, voluntary suggestion prompt at the end of every course and practice path, and aggregate, program-level usage instrumentation — neither one tied to an individual, both routed into the same monthly content review."),
 bl("Ongoing content stewardship: verifying outside sources, publishing a monthly release note, and logging what staff say is missing."),

 h1("5. Outputs — what exists because of it"),
 bl("The Program: a complete, built application, with functional completion reached September 8, 2026, and the download capability completed September 18, 2026."),
 bl("The evidence record: 23 sessions documented in full, de-identified, attributed to teams."),
 bl("The analysis, “What the Division Said”: the coding, the central finding, and seven consultant recommendations."),
 bl("The DSD DEIA Integration Framework, version 1.0."),
 bl("This document set: the memorandum, the operational workplan, the reporting process, and this logic model."),
 bl([b("Not yet produced, and named honestly as ahead: "),tx("a baseline climate survey and disaggregated workforce data; the Executive Council and Division DEIA Council charters; a legislative brief series. Each has an owner and a target date in the operational workplan.")]),

 h1("6. Outcomes — what changes for staff and the Division"),
 h2("Short-term, in the first two quarters after launch"),
 bl("Staff at every level can find, use and share equity resources without the consultant as the sole conduit."),
 bl("Recurring ASK questions and module suggestions are converted into content, closing a feedback loop eleven of twenty-three sessions described as broken."),
 bl("The One DSD Team runs its first accepted work item, with a named decision owner and a documented return."),
 bl("The Executive Council and the Division DEIA Council are chartered and seated."),
 h2("Medium-term, through 2027 and into 2028"),
 bl("A baseline climate survey and disaggregated data exist; a quarterly disparities report and a correction-plan protocol are in operation."),
 bl("The general division-wide equity assessment resumes on its two-year cycle, giving the Division its first comparable read against the 2023–2024 baseline."),
 bl("Equity analysis moves before the decision, in legislative proposals and contracting, rather than after."),
 bl("Community engagement becomes sustained rather than episodic, documented through the Minnesota Communities briefs and the engagement planner in use on real projects."),

 h1("7. Impact — what it means over years"),
 p("This is the central finding answered: equity carried as an operational capability of the Division, not as individual effort that depends on who happens to be in the room. Read against the 2023–2024 baseline at each future assessment — 2027 alongside launch, then 2029 and 2031 — the measure of impact is whether hiring, advancement, pay and community trust move, and whether the practice several DSD teams already show today becomes the Division's practice rather than the exception."),

 h1("8. Where the work stands"),
 p("The stages above are not equal in size or duration, and the work does not divide evenly among them. The table below states where each stands."),
 table([2400,2560,4400],["Stage","Status","What that means"],[
  ["Inputs","Complete","The evidence, the collaboration, the governing mandate and the Framework are all in hand."],
  ["Activities","Build activities complete; launch activities not started","Coding, research, curriculum and program build are done. Governance, data collection, working groups and communications begin at launch."],
  ["Outputs","Program, evidence and analysis built; governance, baseline and legislative outputs ahead","What can be produced before a decision to launch has been produced."],
  ["Outcomes","Not yet realized","Nothing opens to staff, and no outcome can occur, until the Division opens the Program."],
  ["Impact","Ahead, by design","Measured over years against the 2023–2024 baseline, at the 2027, 2029 and 2031 assessments."],
 ]),
 p("The inputs, the work done with them, and what that work produced are largely in place \u2014 the first three links in the chain. Outcomes and impact, which is where most of the value lies, cannot begin until the Division opens the Program to staff. The foundation is well advanced; the greater share of the work, and the greater share of the benefit, is still ahead."),

 h1("9. Assumptions this model depends on"),
 bl("Leigh Ann Ahmad and Heidi Hamilton share their thoughts by December 1, 2026, and the Division opens the Program division-wide in January 2027."),
 bl("Participation in surveys, courses and the suggestion prompts stays voluntary; nothing here evaluates a person."),
 bl("Leigh Ann Ahmad and Heidi Hamilton continue to support the work, and the Executive Council is chartered as planned."),
 bl("HR and Data and Analytics make time available to build the baseline described in Workstream 4."),

 h1("10. External factors outside this plan's control"),
 bl("The November 2026 election and the political environment it sets for a January 2027 launch."),
 bl("State budget and legislative session decisions, which affect funding and the legislative dimension of the work."),
 bl("Turnover among staff, managers or leadership sponsors."),
 bl("DHS enterprise equity priorities, which the Program is built to serve rather than replace, and which could shift."),

 h1("11. Where each piece lives"),
 bl([b("Evidence record"),tx(" — the 23 sessions in full, the source for every Input above.")]),
 bl([b("What the Division Said"),tx(" — the analysis and the central finding this whole chain answers.")]),
 bl([b("Operational workplan"),tx(" — the nine workstreams that carry each Activity and Output through to its Outcome, with owners and dates.")]),
 bl([b("Reporting process"),tx(" — how progress against this model is tracked and reported from October 2026 forward.")]),
];

module.exports.doc=docShell({docTitle:"Program Logic Model",footer:"Program logic model  ·  Disability Services Division  ·  draft",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Program-Logic-Model.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
