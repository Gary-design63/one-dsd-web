const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");

const KOTTER=[
 ["1. Establish the case","The evidence is in hand: 172 findings, a central conclusion already accepted, and a Program well advanced and nearing the point where it can open.","Complete before this plan begins"],
 ["2. Secure leadership commitment","Sponsorship from Heidi Hamilton and Leigh Ann Ahmad; the Executive Council and Division DEIA Council chartered.","Year 1, first half"],
 ["3. Define what success requires","The multi-year plan and the working-group charters (Workstream 5).","Year 1, first half"],
 ["4. Communicate it to staff","The communication plan prepared in December; office hours; a consistent message platform.","Year 1, first half, then continuous"],
 ["5. Enable staff to act","Every staff member using the Program directly — downloads, ASK, courses — without the consultant as intermediary.","Year 1, from launch"],
 ["6. Produce early results","The first completed work item; the first leadership cohort; the baseline survey fielded.","Year 1, second half"],
 ["7. Consolidate and extend","Quarterly disparity reporting; the first legislative briefs in use; competency language entering performance plans.","Year 2"],
 ["8. Establish it as standard practice","Equity analysis before a decision becomes a standing, audited requirement; the 2029 assessment measured against the original baseline.","Year 3"],
];

const GAPS=[
 ["Leadership competencies and the Intercultural Development Inventory","The 38-module curriculum is built and orientation material exists. The assessment instrument itself, the development maps, and the link to performance plans are proposed rather than adopted.","Secure a qualified administrator and a license budget. Complete the first supervisor cohort with individual development plans on file. Introduce competency language into performance plans for one pilot unit.","Every supervisor and manager assessed at least once. Competency language standard in performance plans division-wide. A second cohort extending to directors.","Requires a decision and a budget from Heidi Hamilton and the Administration. Until that decision is made this gap cannot close in any year of this plan; it is constrained by a decision, not by capacity."],
 ["Staff engagement, through Amplify Equity","The One DSD Team and Amplify Equity are scheduled to begin in January 2027. Membership of the employee resource groups remains unverified.","Confirm rosters and joining arrangements. Establish regular Amplify Equity programming. Conduct a pulse check establishing whether most staff can name two Program priorities.","Amplify Equity operating under rotating staff leadership rather than consultant facilitation, with engagement evident in the aggregate usage measures Workstream 1 now records.","Sustained engagement is the outcome in this plan least amenable to scheduling. It is measured rather than mandated, and the Year 2 target is deliberately framed as sustaining rather than starting."],
 ["Self-directed learning beyond the Program","Nothing exists today. The Program directs staff only to its own material.","A curated, optional reading and listening list published on the Program, organized by the topics the courses already cover, explicitly marked as voluntary and never evaluated.","The list reviewed annually and expanded through staff nominations, once the suggestion channel in Workstream 1 is available to collect them.","This is new work proposed by this plan. It appears nowhere in the Program or the operational workplan before this document."],
 ["Data and accountability — the largest gap","No baseline measurement. No disaggregated reporting. No means for a team to observe conditions in its own area.","A baseline climate survey achieving at least sixty-five percent response. Data standards ratified. The first disparity report produced.","A second consecutive year of quarterly disparity reporting, with a correction protocol in active use rather than merely defined.","Every partly-built goal in the crosswalk traces to this gap. Closing it is what converts an established practice into demonstrated effect."],
 ["The legislative dimension","No legislative content exists. The scope of the work has not been agreed.","Scope agreed with the Department\u2019s legislative and government relations office. The first plain-language brief on a statute affecting the Division published.","A full legislative session in which the Division conducts equity analysis on a proposal before adopting a position rather than after.","This sits outside the Administration\u2019s six goals, as the crosswalk establishes. It remains real work. The Year 1 target is deliberately modest: agree the scope before committing to a result."],
 ["Governance, working groups and communications","Charters are drafted but no body has convened. No working group has begun.","Seat the Executive Council and the Division DEIA Council and convene both. Charter and convene all four working groups: Recruitment and Onboarding; Workplace Climate and Accessibility; Service Delivery and Community Engagement; and Metrics and Learning.","These bodies operating on their own cadence without consultant facilitation of every meeting, and the multi-year plan published and in its second annual review.","Nearly every other gap in this table depends on this one closing first, as the dependency map in the project-management version makes explicit."],
 ["Community engagement and service delivery","The Minnesota Communities briefs and the engagement planner exist as content. Neither has been applied to a live project.","Apply the planner to at least one real project and document how community input altered the outcome.","Sustained rather than episodic engagement documented across multiple projects, with community partners recognizing the change.","Depends on the communications capacity in Workstream 5 existing first. Engagement without a channel for response reproduces the 2023 finding that feedback goes nowhere."],
];

const READING=[
 ["Everyday equity habits at work","“The Person You Mean to Be: How Good People Fight Bias,” by Dolly Chugh (2018)","A plain-spoken, practical starting point for staff who want the how, not just the why."],
 ["Working across cultures, the same topic our own course covers","“The Culture Map,” by Erin Meyer (2014)","Written for the workplace, not for travel or theory — matches how our own course talks about working across cultures."],
 ["Belonging and feeling safe at work","“Belonging: The Science of Creating Connection and Bridging Divides,” by Geoffrey L. Cohen (2022)","Speaks straight to the belonging and safety theme staff raised in the interviews."],
 ["Disability rights and self-determination","“Disability Visibility: First-Person Stories from the Twenty-First Century,” edited by Alice Wong (2020)","First-person stories, in the same voice our own evidence record is written in."],
 ["Disability rights, in plain terms","“Demystifying Disability,” by Emily Ladau (2021)","A practical, easy-to-use companion to the book above."],
 ["Bias and decision-making, tied to our Equity Pause habit","“Biased: Uncovering the Hidden Prejudice That Shapes What We See, Think, and Do,” by Jennifer L. Eberhardt (2019)","Backs up our “check before you decide” rule with the research behind it."],
 ["Podcasts to listen to","“Code Switch” (NPR)","Short episodes on race, culture, and identity at work — easy to fit into a commute."],
 ["Podcasts to listen to","“Hidden Brain” (NPR)","Episodes on bias, belonging, and workplace culture, in plain language."],
];

const RISKS=[
 ["Declaring completion prematurely","The most common failure in change efforts is treating an early result as if it were an established practice. This plan names its Year 1 milestones as early results deliberately, not as the finish.","Keep the biennial assessment on the calendar regardless of how Year 1 appears, so the 2029 measurement occurs whether or not Year 1 felt conclusive."],
 ["Governance that exists only on paper","A charter without meetings is not governance. The dependency map shows most of Year 2 and Year 3 waiting on this single workstream.","Track the Executive Council and the DEIA Council by meetings convened and decisions recorded, not by the existence of a charter document."],
 ["A single person carrying the load","Capacity is named as a cross-cutting constraint throughout the operational workplan. A three-year plan magnifies that risk rather than resolving it.","The plan already requires a named decision owner and a sponsoring manager for the first work item. No work is added here without also naming who beyond the consultant carries it."],
 ["A reading list mistaken for a requirement","A suggested list can drift toward appearing mandatory, which contradicts the voluntary-participation principle applied everywhere else in this Program.","State plainly on the Program page that the list is optional and never evaluated, using the same language already applied to course completion and leadership coaching."],
];

const kids=[
 ...title("THREE-YEAR PLAN AND BLUEPRINT",[
   "January 2027 through December 2029",
   "One DSD People, Access and Culture Program · Disability Services Division"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager  —  Heidi Hamilton, Division Director"),
 line("DATE","September 18, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("1. The approach this plan takes"),
 p("This plan doesn't treat the remaining sixty percent of this work as a simple to-do list. It treats it as a change effort, because that's really what our main finding describes. “Equity is carried as individual effort, without a system behind it” means, in plain terms, that staff do this work on their own, and the Division has never built it into how things officially get done. The next three years are about turning a habit some people practice into a habit the whole Division practices — a way of working that doesn't depend on which person happens to be doing it."),
 p("The sequence below follows an established pattern of organizational change: establish the case, secure leadership commitment, define what success requires, communicate it, enable people to act, produce early results, consolidate those results into broader change, and finally establish the new practice as standard. No step can be skipped without weakening the ones that follow. Underlying the whole sequence is a simple test: a way of working becomes permanent only when it survives the person who introduced it, is documented well enough that someone else can carry it, and is reinforced by the Division's own decisions. Every gap named in section 6 is a practice that has not yet met that test."),
 table([2400,4360,2600],["Step","What it looks like here","When"],KOTTER),
 p("Read against the operational workplan: step 1 is complete, which is why the work now turns to opening the Program rather than to further research. Steps 2 through 5 fall in Year 1. Step 6, the early result, is genuine and worth marking — but it is not completion. Treating an early result as the finish is the most common way change efforts stall, and section 8 names it as the first risk in this plan."),

 h1("2. The logic model, extended forward"),
 p("The logic model that already comes with this package (Attachment E) reads from what we put in, to what we get out, as a story about the past: what we invested, all the way to what changes once the Program opens. This plan is that same story, run forward instead of backward. Year 1 is where real change for staff begins. Year 2 is where that change starts to add up. Year 3 is where we actually measure it, against the 2023–2024 numbers, at the 2029 check-in."),

 h1("3. Year 1 — 2027: opening the Program"),
 p("Year 1 covers steps 2 through 6. The division-wide launch occurs in January, following the November 2026 election. Governance is chartered in the same quarter. By year end, the Program should be able to demonstrate one completed piece of work, not a plan for one."),
 bl([b("First quarter: "),tx("Launch. Leadership group and staff equity group set up. Work-group charters drafted. A decision made on the leader-coaching tool.")]),
 bl([b("Second quarter: "),tx("The first supervisor and manager cohort completes leadership coaching. The baseline climate survey is fielded. The One DSD Team and Amplify Equity convene for the first time.")]),
 bl([b("Third quarter: "),tx("Baseline results analyzed and presented to the Executive Council. The scope of the legislative workstream agreed with the Department's legislative and government relations office.")]),
 bl([b("Fourth quarter: "),tx("Year 1 review: the first completed work item, the first disparity reading, and a candid account of what did not proceed on schedule, carried into Year 2 rather than set aside.")]),

 h1("4. Year 2 — 2028: consolidating early results"),
 p("Nothing in Year 2 is a new initiative. Each item is a Year 1 result, repeated until it no longer depends on Year 1 having been exceptional."),
 bl([b("Data: "),tx("A second and third quarter of disparity reporting, so the correction protocol is exercised rather than merely defined. The first legislative brief published and applied in an actual session.")]),
 bl([b("Learning: "),tx("Competency language enters performance plans for a pilot unit. A second leadership cohort, extending to directors.")]),
 bl([b("Community and engagement: "),tx("The engagement planner applied to a live project with a documented outcome. Amplify Equity operating under rotating staff leadership rather than consultant facilitation.")]),
 bl([b("Self-directed learning: "),tx("The reading list in section 7 published, reviewed once, and opened to staff nominations through the suggestion channel.")]),

 h1("5. Year 3 — 2029: establishing standard practice"),
 p("Year 3 is step 8, and the year this plan's central claim is tested against measurement rather than intention."),
 bl([b("The 2029 division-wide assessment, "),tx("conducted on the biennial cycle the consultant's recommendations established, measured against the 2023–2024 baseline this Program was built from. This is the first point at which the Division can state, on evidence rather than impression, whether conditions have changed.")]),
 bl([b("Equity analysis before a decision "),tx("operating as a standing, audited requirement rather than a practice some teams observe — established by Heidi Hamilton's Year 1 decision, and by Year 3 simply how decisions are made.")]),
 bl([b("A leadership competency framework "),tx("standard in performance plans division-wide rather than confined to a pilot unit.")]),
 bl([b("A practice other divisions could adopt, "),tx("which is the extension the analysis recommended from the outset: not inventing something new in Year 3, but demonstrating that what several Division teams already practiced in 2023 has become how the Division works.")]),

 new Paragraph({children:[new PageBreak()]}),
 h1("6. Gap analysis: the remaining sixty percent"),
 p("Seven gaps, each stated the same way: what exists today, what Year 1 must produce, what three years must produce, and the one condition this plan cannot satisfy on its own."),
 table([2100,2380,2380,2380,1720],["Gap","Today","Year 1 goal","Three-year goal","The honest limit"],GAPS),

 h1("7. Self-directed learning: a proposed reading and listening list"),
 p("This is new. Nothing in the Program currently directs staff toward learning beyond it. The list below is a starting point intended to grow, organized by the same topics the Program's courses already cover. Every item is optional and none is evaluated, for the same reason course completion and leadership coaching are not."),
 table([2500,3200,4260],["Program topic","Suggested title","Why it fits here"],READING),

 h1("8. Risks and mitigations"),
 table([2200,3800,3960],["Risk","Why it happens","How this plan answers it"],RISKS),

 h1("9. How success will be measured"),
 p("Four measures, each established elsewhere in this document set and carried through three years rather than one:"),
 bl("The quarterly disparity report demonstrates movement, not merely existence, by the close of Year 2."),
 bl("The 2029 assessment is directly comparable to the 2023–2024 baseline on the same categories, so the question of effect has an evidenced answer."),
 bl("Aggregate usage — course completions, downloads, ASK queries, staff suggestions — shows adoption across the whole Division rather than concentration in one office."),
 bl("By the close of Year 3, at least four of the Administration's six equity goals move from Partly built to Built when the crosswalk is repeated."),
 p([b("The thinking behind these checks. "),tx("Our evidence so far comes from one round of interviews and sessions — the right way to find our main finding, but one snapshot in time can't show whether anything changed. Three fixes make it stronger going forward. First, the 2023–2024, 2027, 2029, and 2031 check-ins all use the exact same list of themes, so they work as one long-running study instead of four separate ones — tracking change against our own starting point, which is the strongest kind of proof a single division without a comparison group can realistically get. Second, the 2027 survey tests our interview themes against real numbers, and a short follow-up round of interviews explains why the numbers look the way they do — numbers first, then stories to explain the numbers, rather than just repeating interviews on a schedule. Third, no single number is trusted alone: interview and survey data, HR data, and the Program's own usage numbers are checked against each other, so a finding has to show up in more than one place before we call it real.")]),

 h1("10. Related documents"),
 bl([b("Program crosswalk"),tx(" — the goal-by-goal finding this gap list is built from.")]),
 bl([b("Program logic model"),tx(" (Attachment E) — the same story this plan runs forward.")]),
 bl([b("Operational workplan"),tx(" — the ten-month detail behind Year 1 of this plan.")]),
 bl([b("The project-management version"),tx(" — this same plan drawn as a timeline, a workflow, and a map of what has to happen before what.")]),
];

module.exports.doc=docShell({docTitle:"Three-Year Plan and Blueprint",footer:"Three-year plan and blueprint  ·  Disability Services Division  ·  draft",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Three-Year-Roadmap-and-Blueprint.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
