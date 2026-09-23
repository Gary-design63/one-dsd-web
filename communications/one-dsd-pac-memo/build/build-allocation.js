const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");
const pb=()=>new Paragraph({children:[new PageBreak()]});

// Goal · what it decomposes into · who must hold it · what the consultant supplies · owner (blank)
const ALLOC=[
 ["1. Eliminate disparities",
  "Equity analysis before a decision rather than after it; a chartered equity team with named decision rights; a quarterly read on where gaps are widening.",
  "Division leadership, for the charter and decision rights. Program managers, for running the analysis on their own proposals.",
  "The equity analysis instrument, the guidance for using it, and the governance templates.",
  ""],
 ["2. Community engagement",
  "Engagement planned rather than incidental, documented, and carried into a live project with a recorded outcome.",
  "The teams that hold community-facing work, with a named lead per project.",
  "Minnesota Communities briefs, the engagement planner, and consultation on applying them.",
  ""],
 ["3. Hiring and retention",
  "Inclusive recruitment design, pipelines of diverse talent for succession, consistent onboarding, and retention read against real data.",
  "Hiring managers and Human Resources. This goal cannot be held inside the Division alone.",
  "Inclusive hiring and mentoring material; the climate survey instrument the goal itself presumes.",
  ""],
 ["4. Learning and development",
  "A documented development arc for staff and for leaders, with the leadership pathway funded.",
  "Supervisors, for their own units. Division leadership, for the funded leadership pathway.",
  "The 38-module curriculum, IDI orientation material, practice paths, and the leadership series.",
  ""],
 ["5. Contracts and procurement",
  "Diversity and inclusion built into each phase of the contract cycle; common data elements in RFPs, scoring tools and quarterly reports.",
  "Contract managers and policy subject matter experts. Nothing here can be built without them.",
  "Consultation on the contract cycle, and the equity criteria for solicitations and scoring.",
  ""],
 ["6. Communication and accessibility",
  "Accessibility and plain language treated as a standard rather than an accommodation added afterward.",
  "Every unit that publishes anything, with communications support.",
  "Accessibility checks, plain-language guidance, language access and interpreter practice, accessible-document practice.",
  ""],
];

const REQ=[
 ["Establish benchmarks and targets; internal accountability mechanisms","The DSD data team; Fiscal Analysis and Results Management (FARM)","Without them, goal 1 cannot be measured and goals 2 and 3 cannot be demonstrated"],
 ["Diversity and inclusion through the contract cycle","Contract managers; policy subject matter experts","Without them, goal 5 has no provision at all"],
 ["Recruitment design, succession pipelines, onboarding","Hiring managers; Human Resources","Without them, goal 3 rests on instructional content alone"],
 ["Equity analyses in legislative proposals","DSD legislative staff","Visibility of proposals while they are still in draft"],
 ["Policies, standard operating procedures and manuals reviewed through a culturally responsive lens","Subject matter experts across the Division","Notice that a policy or manual is being written or revised"],
];

const kids=[
 ...title("GOAL ALLOCATION WORKSHEET",[
   "How the Administration's six equity goals divide across the Division",
   "A proposal for leadership to complete — the owner column is deliberately blank"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("PREPARED FOR","Heidi Hamilton, Division Director  —  Leigh Ann Ahmad, Manager"),
 line("DATE","September 18, 2026"),
 line("STATUS","Draft for completion by Division leadership"),
 rule(140,300),

 h1("1. What this document is for"),
 p("Deqa Sayid, the Administration's Equity Director, was unambiguous that this Division is responsible for the execution of all six equity goals, and equally clear that the Division retains latitude over how they are met. That settles the scope and opens a different question, which the accompanying memorandum names as genuinely open: how does the work divide across this Division, and who is responsible for what?"),
 p("This worksheet is my proposal for answering it. It is not a decision and it is not an assignment — neither is mine to make. It sets out what each goal actually decomposes into, the kind of owner each part requires, and what the Program supplies against it. The final column is intentionally empty, because naming the owner is leadership's to do."),
 quote("A goal without a named owner is an intention. A goal with a named owner is a plan. The difference is this column."),

 h1("2. The six goals, decomposed"),
 table([1560,2560,2200,2140,900],
   ["Goal","What it decomposes into","Who must hold it","What the Program supplies","Owner"],ALLOC),
 p("Two observations from the table. Goals 4 and 6 are the best served by what already exists, because both are substantially answered by instructional content and daily operating standards. Goals 3 and 5 are the least served, and for the same structural reason: neither can be discharged inside this Division alone. They require Human Resources and they require contract managers, and no amount of content substitutes for that."),

 h1("3. What the work requires from outside this role"),
 p("The agreed decomposition of the consultant's position names its counterparts directly. These are not requests for goodwill; they are the conditions under which the named duties can be performed at all."),
 table([3000,2800,3560],["The work","Who it requires","What fails without it"],REQ),

 h1("4. A suggested sequence"),
 nb([b("Name the owners. "),tx("Complete the final column of the table in section 2. Nothing else in this worksheet can proceed until that is done, and it is the one step only leadership can take.")]),
 nb([b("Open the two that are stalled. "),tx("Goals 3 and 5 need a conversation with Human Resources and with contract managers respectively. Both are outside the Division's sole control and both will take longest, which is the argument for starting them first rather than last.")]),
 nb([b("Run the pilot. "),tx("Home and Community-Based Services runs the Program for a defined interval, measured for behavioral and cognitive change. Other units continue as they are.")]),
 nb([b("Build the measurement. "),tx("The data team and FARM establish the baseline that goals 1, 2 and 3 all depend on. Until this exists the Division has practice without evidence.")]),
 nb([b("Review and redistribute. "),tx("At the close of the pilot, revisit this table against what was learned rather than against what was assumed.")]),

 h1("5. What I will do against each goal"),
 p("So that this worksheet is not read as work being handed outward, the consultant's own commitments are stated plainly. For every goal in section 2 I will supply the instruments named in the fourth column, keep them current and accessible, provide consultation and just-in-time training on their use, and report honestly on what is working and what is not — including where my own contribution has not been sufficient. What I will not do is execute the work in the third column. That is not reluctance; it is the design of the position, and it is set out in full in the accompanying record."),

 h1("6. Related documents"),
 bl([b("The memorandum"),tx(" — the communication this worksheet accompanies, and the case for the approach.")]),
 bl([b("The Position, Decomposed"),tx(" — the agreed decomposition of the consultant's role, which names the counterparts in section 3.")]),
 bl([b("Program Crosswalk"),tx(" — the Program examined goal by goal, with an honest status for each.")]),
 bl([b("Operational Workplan"),tx(" — the ten workstreams that carry this work, with dates.")]),
];

module.exports.doc=docShell({docTitle:"Goal Allocation Worksheet",footer:"Goal allocation worksheet  ·  Disability Services Division  ·  draft for completion",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Goal-Allocation-Worksheet.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
