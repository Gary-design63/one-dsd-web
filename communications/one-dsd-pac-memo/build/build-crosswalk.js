const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");

const ECOSYSTEM=[
 ["DHS","DHS leaders; the Office of Employee Culture","The One Minnesota Plan; the DHS Equity Policy and its Equity Analysis Toolkit. These are the enterprise standards every administration and division builds against.","Examined, not adopted. In 2024 the Office of Employee Culture was studied to understand how an established administration shapes its equity work. That produced a practical indication of form for this Division \u2014 which is a different thing from a template."],
 ["ADSA","Aging and Disability Services Administration; Heidi Hamilton leads its equity work for our Division","The Administration's Equity and Inclusion Implementation Plan and its six goals, examined in section 3","The subject of section 3: every Program element traced to the goal it answers, or named plainly where no provision yet exists."],
 ["DSD","Leigh Ann Ahmad, Manager; the Division's own operational plan","Four non-negotiables: equity analysis before major changes; documented community engagement; accessibility and plain language; and disaggregated data","The Framework's ten steps and the Program's ten workstreams are the same plan in two forms. The Framework sets the sequence; the Program is what staff actually open and use."],
 ["The Program","Gary Banks, Equity and Inclusion Operations Consultant","The working application: courses, ASK, practice paths, job aids, the One DSD Team, Amplify Equity, and every non-course resource available as a downloadable file","The implementation layer. Nothing above this row is something a staff member touches; everything at this row is."],
];

const GOALS=[
 ["1","Eliminate disparities","Every division is expected to reduce measurable gaps in outcomes, not merely state an intention to.","The Equity Pause \u2014 the practice of conducting analysis before a decision rather than after (Workstream 7); a chartered equity team with named decision rights (Workstream 3).","Partly built","The disparities themselves remain unmeasured. Absent the Workstream 4 baseline, the Division has a practice but no instrument to demonstrate its effect."],
 ["2","Community engagement","Sustained engagement with the communities the Division serves, documented rather than incidental.","Minnesota Communities briefs and the community engagement planner (Workstream 8).","Partly built","The planner exists as content but has not been applied to a live project with documented outcomes. That application is a Workstream 8 target, not an accomplished fact."],
 ["3","Hiring and retention","A workforce reflecting the communities served, and conditions that retain people once hired.","The One DSD Team and Amplify Equity for engagement and belonging (Workstream 10); inclusive hiring and mentoring material (Workstream 1); the annual climate survey the goal itself specifies (Workstream 4).","Partly built","Retention is measured through turnover and exit data the Division does not directly control. The Program can establish the practice; it cannot by itself construct the workforce-data pipeline this goal presumes."],
 ["4","Learning and development","Staff and leaders develop the competence the work requires, along a documented arc.","The 38-module Intercultural Practice and Equity curriculum; Intercultural Development Inventory orientation material; research on leadership styles and its eleven-course series (Workstream 6).","Built, with one piece still planned","The curriculum is built. The competency framework it should feed — development maps and a funded coaching instrument — is proposed, not adopted. This is the best-served goal of the six, and still incomplete."],
 ["5","Contracts and procurement","Equity considered in contracting and procurement decisions before commitment, not after a contract is executed.","The Equity Pause practice (Workstream 7) addresses decisions generally but names no procurement instrument.","Not yet built","No content in the Program addresses a contract or a procurement decision directly. This is the weakest correlation of the six, and not marginally so."],
 ["6","Communication and accessibility","Communication that reaches everyone, with accessibility treated as a standard rather than an accommodation added afterward.","Accessibility checks, plain language in human services, language access planning, interpreter practice, and accessible-document practice (Workstream 1); the Program's own communications plan (Workstream 5).","Built","This is the one goal the Program satisfies as daily operating practice rather than instructional content \u2014 every resource is built to the accessibility and plain-language standard it teaches."],
];

const WSMAP=[
 ["1","Keep the Program current, accurate and ready for launch","4, 6","Non-negotiable 3 (accessibility and plain language)","Step Three"],
 ["2","Launch throughout the Division","cross-cutting — enables all six","Readiness to open","Year One to Year Two"],
 ["3","Governance and leadership accountability","1","—","Step One"],
 ["4","Assessment, data baseline and accountability","1, 3","Non-negotiable 4 (disaggregated data)","Step Two"],
 ["5","Vision, working groups and communications","6","—","Step Three"],
 ["6","Learning, leadership competencies and the IDI","4","—","One Minnesota Plan"],
 ["7","Equity analysis in everyday decisions","1, 5","Non-negotiable 1 (mandatory equity analysis)","Equity Lens Rubric"],
 ["8","Community engagement and service delivery","2","Non-negotiable 2 (documented engagement)","Step Seven"],
 ["9","The legislative dimension","no numbered goal — answers the One Minnesota and Olmstead commitments directly","—","—"],
 ["10","One DSD Team and Amplify Equity","3","—","DEIA Council pipeline"],
];

const kids=[
 ...title("PROGRAM CROSSWALK",[
   "The Program examined against the Department's commitments, the Administration's six equity goals, and the Division's ten workstreams",
   "Disability Services Division, Aging and Disability Services Administration"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager  —  Heidi Hamilton, Division Director"),
 line("DATE","September 18, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("1. Purpose"),
 p("A general assurance of alignment establishes nothing. This document examines one goal at a time. For each of the six equity goals set by the Aging and Disability Services Administration, it states what the goal actually requires, what the Program has built against it, and where nothing has been built yet. The three-year plan carries every gap named here into a sequence of work; this document exists so that plan rests on specific findings rather than a general impression."),

 h1("2. Where the Program sits within the Department"),
 p("Four levels govern this work, and each sets something different. Conflating them — treating a Division instrument as an enterprise standard, or an Administration goal as a Program feature — is the most common way a crosswalk misleads."),
 table([1500,2600,3200,2060],["Level","Who's in charge","What it sets","Where the Program stands"],ECOSYSTEM),
 p("One clarification the record requires: the Office of Employee Culture, a separate administration within the Department, was examined in 2024 to understand how an established administration shapes its equity work. It was not adopted as a model. What that examination produced was a practical indication of form for this Division, which is a different thing from a template."),

 h1("3. Correlation to the Administration's six equity goals"),
 p("The Administration's Equity and Inclusion Implementation Plan sets six goals. The table states each one, what it requires in a division's daily operation, what the Program has built against it, an honest status, and what remains absent. Three status values are used consistently throughout this document set: Built, Partly built, and Not yet built."),
 table([550,1750,2650,2100,900,2410],["#","Goal","What it asks for","Built so far","Status","What's missing"],GOALS.map(r=>[r[0],r[1],r[2],r[3],r[4],r[5]])),
 p([b("Read honestly, the table shows this: "),tx("two goals, 4 and 6, are substantially answered. Three — 1, 2 and 3 — are partly answered, each with a specific and nameable missing element rather than a general shortfall. One, contracts and procurement, has essentially no provision. That unevenness is the actual state of the work, and it is more useful to Division leadership than a claim that all six are in progress.")]),

 h1("4. The implementation layer, workstream by workstream"),
 p("The operational workplan ties each of its ten workstreams to a governing reference. This table consolidates that mapping so the correlation can be read across the whole Program at once, rather than one workstream at a time."),
 table([500,3000,2600,1550,1710],["WS","Workstream","ADSA goal(s)","DSD rule","Framework step"],WSMAP),
 p("Two rows warrant comment. Workstream 2, the launch, is not tied to a single goal because it is the mechanism through which every other workstream reaches a staff member. It is cross-cutting by nature, not by omission. Workstream 9, the legislative dimension, carries no Administration goal number at all, and answers the One Minnesota Plan and the Olmstead Plan directly. That is not an error in this correlation. It is a finding: the Administration's goal structure names no legislative goal, while the Division's exposure to state law remains real. Where that work belongs organizationally is a decision for Heidi Hamilton and Leigh Ann Ahmad."),

 h1("5. What this correlation establishes"),
 nb([b("The Program is strongest where it operates as a daily standard rather than instructional content. "),tx("Goal 6 is satisfied because every resource is built to the standard it teaches. Where the Program supplies content alone — hiring practice, mentoring guidance — the correlation weakens, because instructional material does not by itself change who is hired.")]),
 nb([b("Every partly-built goal is missing the same element: measurement. "),tx("Goals 1, 2 and 3 each have an established practice and no means of demonstrating whether that practice has changed anything. This is the same gap staff themselves named — data and accountability — arriving here from the Administration's side rather than the Division's.")]),
 nb([b("Contracts and procurement, Goal 5, is the largest gap. "),tx("Nothing in the built Program addresses a contract or a procurement decision. Unlike the other gaps, this is not a matter of degree; it approaches zero, and should be named as such rather than absorbed into a general statement about work remaining.")]),
 nb([b("The legislative dimension sits outside the Administration's goal structure entirely. "),tx("It remains work the Division carries regardless of whether a goal names it, and should not be discounted because this correlation has no tidy place to record it.")]),

 h1("6. Where this leads"),
 p("Every finding in section 5 is carried forward by name into the three-year plan's gap analysis, including the two this correlation surfaced independently: contracts and procurement, and the goal structure's silence on legislative work. This document establishes the correlation. The three-year plan sets out what the Division does about it."),

 h1("7. Related documents"),
 bl([b("Operational workplan"),tx(" — the ten workstreams this document pulls its goal links from, with owners and dates.")]),
 bl([b("Program logic model"),tx(" — the chain from what we put in, to what changes because of it.")]),
 bl([b("Three-year plan and blueprint"),tx(" — what happens, in what order, to close the gaps named here.")]),
 bl([b("The project-management version"),tx(" — the same plan drawn as a timeline, a workflow, and a map of what has to happen before what.")]),
];

module.exports.doc=docShell({docTitle:"Program Crosswalk: How It Lines Up",footer:"Program crosswalk  ·  Disability Services Division  ·  draft",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Program-Crosswalk-and-Correlation-Analysis.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
