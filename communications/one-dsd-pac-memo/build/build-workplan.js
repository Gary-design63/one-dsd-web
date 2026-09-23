const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,table,line,rule,title,docShell}=require("./design.js");
const W=[
 {n:"1",target:"Continuous; first quarterly summary January 2027",t:"Keep the Program current, accurate and ready for launch",st:"Built",
  al:"ADSA Goals 4 and 6 · DSD non-negotiable 3 (accessibility and plain language) · Framework Step Three · Analysis categories 1, 5 and 6",
  now:["Maintain the Program as the Division's working resource: publish and review content in place, keep the staff voice standard on every page, and re-verify the register of outside sources before each release.",
   "Keep every resource downloadable as Word, Excel, PowerPoint or PDF (completed September 18) and every eLearning course on the Program.",
   "Add a short, voluntary suggestion prompt to the end of every course and practice path \u2014 what would have made this more useful, what is missing \u2014 answered or skipped in one click, never scored and never attributed to a person. It routes straight into the content log below, so the person who does not ask ASK a question is heard too.",
   "Answer what ASK cannot, log gaps as content work, and turn recurring questions and module suggestions into resources.",
   "Instrument the Program itself, in aggregate only: course and practice-path completion, downloads by resource and format, the questions most often put to ASK, and where in a lesson people most often stop. Nothing here is tied to a person; the count is the unit, not the individual.",
   "Send a short release note each month: what changed, what was withdrawn, what is waiting."],
  out:["The Program is the Division's single, current source for equity resources: the system of record the DSD operational plan calls for, or its companion if a SharePoint site is chosen.","No broken or unverified outside source at any release.","A quarterly summary of program use, drawn from the module suggestion prompts and the usage counts above, about program support only and never about individuals (first: January 2027)."],
  tl:"Continuous. Monthly release note; quarterly summary.",
  bar:["One person carries publication, verification and support; the tooling multiplies reach but does not replace review time.","Anything concerning Native American communities or Tribal Nations defers to the Office of Indian Affairs and the Department offices that handle Tribal relations."],
  sup:["A decision on whether the Program serves as the DSD system of record for equity tools and decision logs, alongside or instead of a dedicated SharePoint site.","A division-wide channel to announce downloads and new curricula to all staff."]},
 {n:"2",target:"Decision to open, December 2026; opening January 2027",t:"Launch the Program throughout the Division from January 2027",st:"In progress · decisions needed",
  al:"Program launch standard and readiness checklist · Framework transition from Year One to Year Two · the January 2027, post-election launch timing shared among DHS equity professionals",
  now:["Closing the remaining readiness items: a complete DSD organizational map confirmed locally; the ERG roster and joining arrangements verified; one real accepted work item run through the One DSD Team workspace with a decision owner and outcome; the retention decision for consultation and staff-result records made before intake opens; deployment evidence recorded for the launch head.",
   "Preparing the launch evaluation: moderated task success on Home, One DSD entry and ASK; voluntary participant accounts; escalation paths visible; recorded dispositions with owners and review dates; work-item outcomes with delivery, application and benefit kept distinct."],
  out:["A confirmed division-wide launch date in January 2027, agreed with colleagues before it appears on any staff page.","Every readiness item closed, or carrying an agreed exception with a date to resolve it.","The evaluation standard in operation from day one: it examines program support and practice, never employee beliefs or performance."],
  tl:"Readiness items October–November 2026 · the decision to open, December 2026 · division-wide opening from January 2027, after the election.",
  bar:["The organizational map cannot be completed from public sources; it needs each unit's confirmation.","The ERG roster is unverified.","The first real work item needs a sponsoring manager and a decision owner.","The records-retention decision needs policy and records input I do not hold."],
  sup:["Each manager: thirty minutes to confirm their unit's map.","One manager to sponsor the first Team work item.","You and Heidi Hamilton: the decision on whether to open, and the date.","Records or legal input on retention before intake opens."]},
 {n:"3",target:"Councils seated Q1 2027",t:"Governance and leadership accountability",st:"Needs decision",
  al:"Framework Step One · ADSA Goal 1 (an equity team in each division) · DSD operational plan: named owners, a charter, a decision tracker · Analysis intervening condition: empowerment, not direction",
  now:["Preparing, from the Framework, the Executive Council charter (decision rights, monthly meetings in year one, quorum, documentation, annual review) and the Division DEIA Council criteria (eight to ten members from at least four units, two-year staggered terms, four protected hours a month) for the Director's decision.",
   "Drafting DEIA performance-plan goal language by role, and the decision log and tracker the councils would use."],
  out:["Executive Council chartered and meeting.","Division DEIA Council seated, with its chair connected to the ADSA Equity Committee.","DEIA goals in the performance plans of council members; protected time documented.","Framework gate checks One-A, One-B and One-C met."],
  tl:"Charter decision Q4 2026 · councils seated Q1 2027 · gate checks by end of Q1 2027.",
  bar:["Supervisors described a top-down approach in which even senior leaders may not feel empowered to push back. Direction without authority produces compliance, not practice.","Protected time and performance-plan integration need HR and supervisors, not only goodwill."],
  sup:["Heidi Hamilton, as Director: to charter and chair the Executive Council.","Managers: to nominate council members and protect four hours a month.","HR: performance-plan integration.","You: to broker the decision meeting with Heidi Hamilton."]},
 {n:"4",target:"Survey Q1 2027; analysis Q2 2027; next assessment 2027",t:"Assessment, data baseline and accountability measures",st:"Proposed · largest gap",
  al:"Framework Step Two · ADSA Goal 1 (data-driven) and Goal 3 (yearly climate survey) · DSD non-negotiable 4 and the quarterly correction loop · Analysis category 4, the largest gap between what staff asked for and what exists",
  now:["Turning the baseline data collection planning template into a plan: inventory of existing HR and survey data; climate survey design (psychological safety, fairness, accommodation, belonging, leadership commitment) on an accessible platform; data standards (EEOC-aligned categories, voluntary self-identification, validation, minimum cell size of five).",
   "Preparing the next general division-wide equity assessment on a two-year cycle. The last concluded in 2024; on that cadence the next was due in 2026, and the findings the Program rests on are now three years old.",
   "Using the Equity Outcome Map as the outcome frame the measures report against."],
  out:["Baseline climate survey with at least a sixty-five percent response.","Barrier analysis across recruitment, retention, advancement, accommodation and pay, presented to the Executive Council with priority areas approved.","Data standards ratified; a quarterly disparities report and the correction-plan protocol in operation.","A general division-wide qualitative assessment repeated every two years, giving the Division a comparable read on its own culture and the Program its own feedback loop."],
  tl:"Plan Q4 2026 · survey Q1 2027 · next general assessment alongside the launch, 2027 · analysis and Executive Council presentation Q2 2027 · assessments thereafter 2029, 2031.",
  bar:["Seven of twenty-three sessions described data they cannot reach: restricted data sets, no access to HR statistics, no training in qualitative analysis.","Needs workforce data from HR, Data and Analytics capacity, privacy and legal review, and Executive Council authorization.","Response rates depend on managers encouraging participation and on staff trusting how results are used."],
  sup:["You: to broker data access with HR and Data and Analytics.","Heidi Hamilton: to authorize baseline collection and the biennial assessment cycle.","Managers: to encourage survey participation in their units."]},
 {n:"5",target:"Charters Q1 2027; plan Q2 2027",t:"Vision, working-group charters and communications",st:"Proposed",
  al:"Framework Step Three · ADSA Goal 6 · Analysis category 6: silos and broken feedback loops",
  now:["Drafting the working-group charter template (purpose, scope, deliverables, success criteria, membership, cadence, reporting line) and the outline of a plain-language multi-year DEIA plan that passes the Equity Lens Rubric.",
   "Drafting the message platform all communicators use; holding office hours weekly for the first six months after the launch.",
   "Returning the evidence record and the analysis to the staff who contributed them — the most direct answer to the feedback-loop finding."],
  out:["Four working groups chartered: Recruitment and Onboarding; Workplace Climate and Accessibility; Service Delivery and Community Engagement; Metrics and Learning.","The multi-year plan approved by the Executive Council and published on the Program.","Communications campaign launched with a feedback channel; a pulse check showing most staff can name two priorities and know where the resources are."],
  tl:"Charters Q1 2027 · plan Q2 2027 (after the baseline) · campaign from Q2 2027.",
  bar:["Depends on Workstreams 3 and 4.","Needs Communications capacity and unit directors' quarterly discussions."],
  sup:["You and Heidi Hamilton: approval of the message platform and the plan.","Managers: to host unit-level discussions each quarter.","A named Communications partner."]},
 {n:"6",target:"Framework draft Q4 2026; first cohort Q2 2027",t:"Learning, leadership competencies and intercultural development",st:"Built · competencies proposed",
  al:"ADSA Goal 4 (intercultural competence; the IDI Implementation Plan; leadership development) · One Minnesota Plan · Analysis categories 1 and 9",
  now:["Built into the Program: the Intercultural Practice and Equity curriculum (38 modules), the learning journey, the Equity Analysis Toolkit companion, IDI orientation tutorials, and DEIA leadership and growth for One DSD; authored this month: the research analysis of leadership styles and their equity impact and its eleven-course series.",
   "Drafting a leadership competency framework tied to the Intercultural Development Continuum and to general equity practice, for supervisors, managers and directors."],
  out:["Leadership competency framework adopted, with development maps and feedback practices on the Program.","IDI arrangements decided: a qualified administrator, group profiles, individual debriefs and development plans, voluntary and never recorded as an assessment of anyone.","First supervisor and manager cohort completed."],
  tl:"Competency framework draft Q4 2026 · IDI decision Q1 2027 · first cohort Q2 2027.",
  bar:["IDI administration needs a qualified administrator and license budget.","Participation is voluntary; Program completion does not count toward required training unless leadership approves an exception.","Cohort time competes with caseload."],
  sup:["Heidi Hamilton and ADSA: the IDI administration decision and budget.","Managers: cohort time for their supervisors.","You: whether to seek a training-credit exception."]},
 {n:"7",target:"Core workflows Q4 2026 to Q1 2027",t:"Equity analysis in everyday decisions",st:"In progress",
  al:"DSD non-negotiable 1 (mandatory equity analysis) · ADSA Goals 1 and 5 · Framework Equity Lens Rubric · Analysis category 3: the finding that assessments follow decisions",
  now:["Built: the Equity Analysis Toolkit companion and the guided walkthrough that records an analysis on the Program.",
   "Building the practice infrastructure in sequence: Equity Pause; Equity Lens Rubric self-check; Standard and Impact Review; co-creation cycle and commitment register; the Team work-item cycle with its problem-solving protocol; the leadership decision brief and condition-based roadmap; job aids attached to courses; learning-pathway logic."],
  out:["Every major policy, funding or program change routed through an equity analysis with a record, before the decision rather than after.","The Rubric applied to division materials before release.","Procurement and contracting practices analyzed with the toolkit."],
  tl:"Equity Pause, Rubric self-check and Impact Review Q4 2026 · co-creation, work-item cycle and decision brief Q1 2027 · procurement review Q2 2027.",
  bar:["Staff described equity assessments conducted after decisions are made and experienced as a check-the-box exercise. No tooling repairs that; it is a sequencing rule leadership sets.","The system-of-record decision determines where records are kept."],
  sup:["Heidi Hamilton: to make equity analysis before the decision a standing requirement.","Managers: to route their unit's decisions through the tools.","You: to set that expectation with managers."]},
 {n:"8",target:"First engagements Q2 2027",t:"Community engagement and service delivery",st:"Proposed for 2027",
  al:"ADSA Goal 2 · Framework Step Seven · DSD non-negotiable 2 · Analysis category 8, raised in twelve of twenty-three sessions",
  now:["Built: Minnesota Communities briefs and community connections on the Program; the Community Engagement Planner protocol drafted in the Framework.",
   "Identifying projects that affect communities and the advisory councils to consult, including the Cultural and Ethnic Communities Leadership Council; anything concerning Tribal Nations routes through the Department offices that handle Tribal relations and consultation."],
  out:["The engagement planner in use on real projects, with documentation of how feedback was used.","First co-creation sessions with community partners.","Tribal consultation training completed by staff whose work requires it."],
  tl:"Preparation Q1 2027 · first engagements Q2 2027, after the baseline.",
  bar:["Staff described distrust that must be addressed before engagement works, and engagement that is not sustained.","Depends on Framework Steps Two, Three and Six.","Consultation protocol and boundaries must be respected exactly."],
  sup:["Managers: to identify their projects that affect communities.","Heidi Hamilton: sponsorship for advisory council consultation."]},
 {n:"9",target:"Scope Q4 2026; briefs Q1 to Q2 2027",t:"The legislative dimension",st:"Scope to agree · gap",
  al:"One Minnesota and Olmstead commitments · statutory obligations behind DSD practice · Analysis category 10, and the second of the two gaps the analysis names",
  now:["Not yet started. Proposed scope: follow the 2027 session for bills that affect DSD services, accessibility, workforce and Olmstead obligations; produce plain-language briefs on the Program; connect statutory obligations to the practice tools; support equity analysis entering legislative proposals before positions are set, as several sessions asked."],
  out:["A legislative brief series staff can use.","A statutory crosswalk in the Program linking obligations to tools and resources."],
  tl:"Scope agreed Q4 2026 · briefs during the session, Q1–Q2 2027.",
  bar:["Positions on legislation belong to DHS Government Relations; my scope is to inform practice, not to advocate.","Capacity."],
  sup:["You: to agree the scope.","A connection to DHS Legislative and Government Relations."]},
 {n:"10",target:"First meeting January 2027",t:"One DSD Team and Amplify Equity",st:"Planned start January 2027",
  al:"ADSA Goal 3 (ERGs; Employee Engagement) · Framework DEIA Council pipeline · Analysis categories 6 and 9",
  now:["Built: the Team page, workspace and Learning Lab, and the Amplify pages (gatherings, mentoring, ideas, well-being, co-leads, materials).",
   "Recruiting voluntary members; planning the monthly rhythm from January 2027, alternating practical team work with Learning Labs or open hours."],
  out:["The Team convened with its first accepted work items.","Learning Labs running; the contribution map filled.","A pool of prepared candidates for the DEIA Council and working groups."],
  tl:"Recruitment Q4 2026 · first meeting January 2027 · quarterly review.",
  bar:["Voluntary participation needs protected time to be real.","Risk that the Team becomes an Amplify referral desk rather than doing bounded divisional work.","No dates are published to staff until confirmed."],
  sup:["Managers: to permit and protect participation.","You: to confirm the rhythm.","Heidi Hamilton: visible endorsement at an all-staff meeting."]},
];
const DEC=[
 ["Charter and chair the Executive Council","Heidi Hamilton (Director)","Q4 2026","3"],
 ["Nominate DEIA Council members; protect four hours a month","Managers","Q4 2026","3"],
 ["Authorize baseline data collection and the biennial assessment cycle","Heidi Hamilton / Leigh Ann","Q4 2026","4"],
 ["Confirm each unit's organizational map","Managers","November 2026","2"],
 ["Sponsor the first One DSD Team work item","One manager","November 2026","2"],
 ["Read the Program, the analysis and this plan, and share thoughts","Leigh Ann Ahmad and Heidi Hamilton","December 1, 2026","all"],
 ["Whether to open the Program, and the January 2027 date","Leigh Ann Ahmad and Heidi Hamilton","December 2026","2"],
 ["System of record: the Program, a SharePoint site, or both","Leigh Ann","Q4 2026","1, 7"],
 ["Make equity analysis before the decision a standing requirement","Heidi Hamilton","Q4 2026","7"],
 ["Legislative scope","Leigh Ann","Q4 2026","9"],
 ["Records retention for consultation and staff-result records","Leigh Ann with records / legal","Before intake opens","2"],
 ["IDI administration and budget","Heidi Hamilton / ADSA","Q1 2027","6"],
 ["Approve the message platform and the multi-year DEIA plan","Leigh Ann and Heidi Hamilton","Q1–Q2 2027","5"],
];
const kids=[
 ...title("OPERATIONAL WORKPLAN",["October 2026 through June 2027","Equity and Inclusion Operations Consultant, Disability Services Division"]),
 rule(0,240),
 line("TO","Leigh Ann Ahmad, Manager, Disability Services Division"),
 line("CC","Heidi Hamilton, Division Director, Disability Services Division"),
 line("FROM","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("DATE","September 18, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),
 p("Following our conversation, this is the operational workplan you asked for. It is built to be used, not filed. Each workstream sets out what I am doing day to day, the outcome it is meant to produce, the timeline I am working to, the barriers I am meeting, and the specific support that would move it — including where the managers or Heidi Hamilton as Director would need to be brought in. I will bring an updated copy to each check-in with the status column current."),
 p("The Program is built and has not launched: no member of staff is using it yet. The plan is to open it throughout the Division beginning in January 2027, after the November election, which is the common understanding among equity professionals across DHS, though I cannot speak for everyone. Every timeline below is set to that launch, and to your thoughts on this plan by December 1, 2026."),
 p([b("Where the work stands. "),tx("The work is well underway and moving toward the point where the Program is ready to open. Discovery, the research behind it, and the design and build of the Program are largely done, which is Workstream 1 below. What remains \u2014 opening it to the Division, governance, the data baseline, the working groups and communications, and the legislative dimension \u2014 is Workstreams 2 through 10, and is the greater share of what is still ahead.")]),
 h1("What informs this plan"),
 p("The priorities of the broader modular DSD equity workplan run through it. Five sources set those priorities:"),
 bl([b("The Division's own account of itself. "),tx("The analysis “What the Division Said” codes 172 findings from 23 division-wide sessions held in 2023 and 2024. Its central finding — that equity is carried as individual effort without an operational system — is what this workplan exists to answer. Each workstream below names the analysis categories it addresses.")]),
 bl([b("The DSD DEIA Integration Framework "),tx("(January 2026): ten sequential steps over three years. Year One, 2026, is Foundation — governance, a data baseline, communications. Year Two, 2027, is Implementation. Gate checks decide when a step may proceed.")]),
 bl([b("The ADSA Equity and Inclusion Implementation Plan: "),tx("six goals — eliminate disparities; community engagement; hiring and retention; learning and development; contracts and procurement; communication and accessibility.")]),
 bl([b("The DSD Equity and Inclusion Operational Plan: "),tx("four non-negotiables — mandatory equity analysis before major changes; documented community engagement; accessibility and plain language; disaggregated data — with a quarterly correction loop.")]),
 bl([b("The Program's launch standard: "),tx("a division-wide opening from January 2027, a readiness checklist, and an evaluation that examines program support and practice, never employee beliefs or individual performance.")]),
 p("Behind all five stand the commitments in the One Minnesota Plan, the Olmstead Plan and the DHS Equity Policy. Status values: Built · In progress · Proposed · Needs decision. “Built” means complete in the Program and ready for staff at launch, not in use today."),
 h1("At a glance"),
 table([2900,1750,2000,2710],["Workstream","Status","Target","First support needed"],W.map(w=>[w.n+". "+w.t,w.st,w.target,w.sup[0]])),
 new Paragraph({children:[new PageBreak()]}),
 h1("Workstreams"),
];
for(const w of W){
 kids.push(h2(w.n+". "+w.t));
 kids.push(new Paragraph({spacing:{after:60},children:[tx("Status: ",{bold:true,size:19}),tx(w.st,{size:19})]}));
 kids.push(new Paragraph({spacing:{after:140},children:[tx("Aligned to: ",{bold:true,size:19}),tx(w.al,{size:19,italics:true})]}));
 kids.push(label("What I am doing now")); w.now.forEach(x=>kids.push(bl(x)));
 kids.push(label("Planned outcomes")); w.out.forEach(x=>kids.push(bl(x)));
 kids.push(label("Timeline")); kids.push(p(w.tl));
 kids.push(label("Challenges and barriers")); w.bar.forEach(x=>kids.push(bl(x)));
 kids.push(label("Support I need")); w.sup.forEach(x=>kids.push(bl(x)));
}
kids.push(h1("Barriers that cut across the plan"));
[["Capacity. ","One consultant against a ten-step framework. The Program multiplies my reach; governance, data collection and working groups still need named people with protected time."],
 ["Decision rights. ","Until the Executive Council and DEIA Council are chartered, every step after Workstream 3 rests on goodwill."],
 ["Data access. ","The baseline cannot be built without workforce data and Data and Analytics time."],
 ["Protected time. ","The most frequently named constraint in the assessment, and the one every other recommendation depends on. Equity work is not declined in this Division; it is displaced."],
 ["Funding. ","IDI administration and an accessible survey platform have costs that need a home."],
 ["Dates. ","Nothing is published to staff as a schedule until confirmed."]].forEach(([h,t])=>kids.push(bl([b(h),tx(t)])));
kids.push(h1("Decisions and support, by owner and date"));
kids.push(table([4300,2100,1500,1460],["Decision or support","From","By","Workstream"],DEC));
kids.push(h1("How we use this"));
kids.push(bl("A thirty-minute check-in every two weeks, working from this document, with the status column and the decisions table updated beforehand."));
kids.push(bl("A short written update each month, and a quarterly review with the managers so the support they are asked for is visible to them."));
kids.push(bl("Barriers are raised at the check-in where they appear, with what I have tried and what would unblock them, so nothing waits for a quarter."));
kids.push(p("This is a draft for our meeting next week. I would like to agree the workstreams, the targets and the decisions table with you, and then keep it current from there."));
const doc=docShell({docTitle:"Operational workplan, October 2026 through June 2027",footer:"Operational workplan  ·  Equity and Inclusion Operations Consultant  ·  draft",children:kids});
const out=path.join(__dirname,"Operational-Workplan-Oct-2026-Jun-2027.docx");
Packer.toBuffer(doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
