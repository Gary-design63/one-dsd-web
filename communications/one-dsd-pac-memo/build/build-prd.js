const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");

const PURPOSE=[
 ["First","An operational instrument for the equity and inclusion operations work","This is the Program's primary function. The curriculum, the practice tools, the community briefs, the analysis instruments, and the reference material are what the consultant works from and works through. Before the Program existed, this work depended on one person being in the room. The Program is how it now gets carried out at the scale of a division."],
 ["Second","A voluntary learning resource for every member of staff and every leader","Any person in the Division, at any level, can open the Program and learn — about their own Division, about the Administration it belongs to, and about the Department as a whole. Nothing is required. Nothing is graded. Nothing is reported about any individual."],
];

const AUDIENCE=[
 ["Staff","A place to find a clear answer, work through a practical example, and take a resource into their own work. Every resource other than the eLearning courses can be downloaded as a Word, Excel, PowerPoint, or PDF file."],
 ["Supervisors and managers","Material ready to use with a team: job aids, practice paths, and short guides that can be adapted for a unit meeting without preparation time the supervisor does not have."],
 ["Directors and the Administration","A single, current source of what the Division is doing on equity, and a record that can be shown to the Administration and the Department without assembling it from scratch each time."],
 ["The communities the Division serves","Staff who have prepared before an engagement, rather than during it. Community briefs and an engagement planner exist so that understanding precedes contact."],
];

const BENEFITS=[
 ["The work stops depending on one person's availability","The consultant's knowledge, references, and practice tools are in one place, usable by anyone, at any hour, without an appointment."],
 ["Practice becomes consistent across teams","Staff described results that varied by who happened to be on a team. A shared set of tools, used the same way, is what makes practice consistent."],
 ["Supervisors get material they can use immediately","Short, adaptable, and downloadable, so that using it does not cost preparation time a supervisor cannot spare."],
 ["The Division can show its work","What was asked for, what was built in response, and what remains — all documented, all traceable back to what staff themselves said."],
 ["Learning connects the levels","A staff member does not learn about the Division in isolation. The Program shows how the Division sits inside the Administration, and how the Administration sits inside the Department."],
 ["Community engagement starts from preparation","Understanding a community before engaging it, rather than asking the same questions twice."],
];

const GOALS=[
 ["1","End disparities in outcomes","The practice of checking for equity before a decision is made, rather than after, and an equity team with a written charter.","Partly built"],
 ["2","Engage communities","Minnesota Communities briefs and a community engagement planner, so preparation happens before contact.","Partly built"],
 ["3","Hire and retain a representative workforce","The One DSD Team and Amplify Equity for belonging and engagement; inclusive hiring and mentoring material; a yearly staff survey.","Partly built"],
 ["4","Develop staff and leaders","A 38-module intercultural practice curriculum, leadership development across the employee life cycle, and research on leadership styles with an eleven-course series.","Built, with one element proposed"],
 ["5","Fair contracting and procurement","The practice of analysis before a decision reaches contracting, though no material names procurement directly.","Not yet built"],
 ["6","Communicate clearly and accessibly","Accessibility checks, plain language guidance, language access planning, interpreter practice, and accessible-document practice — and every page of the Program built to the same standard it teaches.","Built"],
];

const ECOSYSTEM=[
 ["The One Minnesota Plan","The State's commitment to closing disparities.","The Program is one of the instruments through which a division actually meets it."],
 ["The Olmstead Plan","Minnesota's obligations on community integration for people with disabilities.","Woven through the Division's program profiles and practice scenarios."],
 ["The DHS Equity Policy and its Equity Analysis Toolkit","What the Department requires of every administration and division.","The Program includes a companion and a guided walkthrough, so the toolkit can be applied to work beyond policy development."],
 ["The Administration's equity implementation plan","Six goals, set out in the previous section.","Traced goal by goal, with an honest status for each."],
 ["The Division's own operational plan","Four requirements: analysis before major changes, documented community engagement, accessibility and plain language, and data broken down by group.","The Program supports three of the four directly. The fourth, data broken down by group, is the requirement not yet met."],
];

const NOT=[
 "It is not a case management system, and holds no client records.",
 "It is not a personnel system. It does not evaluate, rank, score, or report on any employee.",
 "It is not a complaint or investigation channel.",
 "It is not a required training program. Participation is voluntary, and completion does not count toward required training credits unless leadership expressly approves an exception.",
 "It does not assign anyone a developmental level, a cultural identity, or a diagnosis.",
];

const REQUIRED=[
 ["Data and accountability","The Division needs a starting measurement, data broken down by group, and a way for a team to see how it is doing in its own area. None of that exists yet. This is the largest single gap, and every other unfinished goal traces back to it.","Requires authorization, and the cooperation of Human Resources and the data office."],
 ["Leadership competencies","A framework for the skills leaders are expected to build, connected to a recognized coaching instrument and to performance plans.","Requires a decision and a budget from the Division Director and the Administration."],
 ["State law and policy","Plain-language guidance connecting the Division's statutory obligations to its everyday practice, and equity analysis entering proposals before positions are set.","Requires an agreed scope with the Department's government relations office."],
];

const INTEGRITY=[
 ["What Fraud Enforcement Actually Costs","Real wrongdoing causes real harm, and so does a response that is not careful. The course holds both at once: how a publicly funded service can outgrow its safeguards, who else is affected when it does, and what a proportionate response looks like."],
 ["Public Perception, Misperception, and the Communities We Serve","How a story about one organization becomes a story about an entire community, and how to communicate accurately so that it does not."],
 ["Protecting the Program Without Becoming the Harm","Practical habits for staff whose work touches integrity review or communication: where bias risk hides, how to draft a notice, and a check a person can actually run."],
];

const kids=[
 ...title("PROGRAM REQUIREMENTS DOCUMENT",[
   "An executive brief on the One DHS / One DSD People, Access and Culture Program",
   "Disability Services Division · Aging and Disability Services Administration"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("PREPARED FOR","Heidi Hamilton, Division Director  —  Leigh Ann Ahmad, Manager"),
 line("DATE","September 19, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("1. What the Program is"),
 p("The One DHS / One DSD People, Access and Culture Program is a working resource being built for the Disability Services Division. It already holds 179 courses, all of them written for this Program: a 38-module curriculum on intercultural practice, a 13-module curriculum on the Minnesota disability service system, a three-module series on program integrity, and the disability inclusion, cultural intelligence and program integrity material alongside them. With the courses sit practice paths, job aids, community briefs, leadership development material, and the working spaces for the One DSD Team and Amplify Equity. Work on it continues."),
 p("It was designed from what staff across this Division said about their own work: 71 interviews, then 23 division-wide sessions producing 172 findings and 131 recommendations. Those findings were analyzed formally, and the analysis produced a single central conclusion that shaped everything built since — that equity in this Division is carried as individual effort, without an operational system behind it. The Program is that system."),
 p([b("The Program is still being built, and has not opened. "),tx("No member of staff is using it yet. The intention is to open it throughout the Division in January 2027, following the November election.")]),

 h1("2. What the Program is for"),
 p("The Program serves two purposes. They are listed in order, because the order matters."),
 table([1100,3000,5260],["Order","Purpose","What this means in practice"],PURPOSE),
 p("The second purpose depends on the first. The Program became a resource staff can use because it was first built as the instrument the work is carried out through. It was not designed as a library that happens to be useful; it is the working equipment of the Division's equity and inclusion operations, opened up so that everyone can use it."),

 h1("3. Who it serves, and what each gets from it"),
 table([2000,7360],["Audience","What the Program gives them"],AUDIENCE),

 h1("4. What the Division gains"),
 table([3200,6160],["Benefit","Why it follows"],BENEFITS),

 h1("5. How the three levels connect"),
 p("A staff member using this Program does not learn about the Division in isolation. The Program is built so that the connection between the levels is visible: how the Disability Services Division works, how the Division sits within the Aging and Disability Services Administration, and how the Administration sits within the Department of Human Services and the State's commitments."),
 p("That matters for a practical reason. Staff described a Division that felt disconnected from the Department around it, and described guidance arriving as an expectation without the means to meet it. When a person can see how their own work connects upward to an Administration goal and a State commitment, the requirement stops being an instruction from somewhere else and becomes something with a visible reason behind it."),

 h1("6. How the Program aligns with the Administration's six equity goals"),
 p("The Aging and Disability Services Administration sets six equity goals. The table below states each goal, what the Program offers against it, and an honest status. Three status words are used throughout: Built, Partly built, and Not yet built."),
 table([550,2300,5450,1060],["#","The Administration's goal","What the Program offers","Status"],GOALS),
 p("Two goals are substantially answered. Three are partly answered, and each one is missing the same thing: a way to measure whether the practice is changing anything. One goal, fair contracting and procurement, has almost nothing built against it. That uneven picture is the real state of the work, and it is more useful to state it plainly than to report that all six are in progress."),

 h1("7. How the Program fits the wider Department"),
 p("The Program is not a separate initiative running alongside the Department's commitments. It is an instrument for meeting commitments the Division has already accepted."),
 table([2500,3400,3460],["The commitment","What it requires","How the Program serves it"],ECOSYSTEM),

 h1("8. Program integrity, and the communities the Division serves"),
 p("Across the Department there have been indications of problems in program integrity, and the Department has made responding to them a priority. A complete response has two parts. One is the integrity work itself, which sits with the offices that hold it. The other is making sure that, as that work proceeds, the people the Division serves continue to be seen accurately, and that attention meant for specific conduct does not come to rest on a whole community."),
 p("All of us carry biases; that is part of being human. What matters is whether they travel into how a program is appraised, or how the people who receive its services are appraised. The purpose of this material is to help each of us recognize our own and set them aside long enough to consider a situation from another person's perspective."),
 p("This is subtler than it first sounds. The most familiar position in a public agency is that we treat everyone the same and do not see difference at all. It is sincerely meant. It can still produce unequal results, because it applies a single lens to people whose circumstances are not the same, and traditionally, at this Department, that lens has been the dominant cultural one. The aim is not to replace it. The aim is to make sure it is not the only lens available to us, and that is what becoming a multicultural organization means."),
 p("Three courses and the community briefs were developed together for this purpose, and their purposes stay distinct. The briefs exist so that staff understand the communities the Division serves. The courses exist so that a response stays proportionate to what actually happened."),
 table([3200,6160],["Course","What it does"],INTEGRITY),
 p("One boundary holds all of it together. Understanding a community informs practice; it never substitutes for the person in front of you. A brief describes a landscape, not an individual, and the decision always belongs with the person receiving the service. That is what keeps cultural knowledge from hardening into a new set of assumptions, and what keeps the Program person-centered rather than paternalistic."),
 p("No one wants to see the program harmed, and no one wants a person penalized for what someone else did. The same practice serves both."),

 h1("9. How the consultant's role works, and why the Program is shaped by it"),
 p("This section is included because the design of the Program follows directly from the design of the position, and the two are easy to confuse."),
 h2("The position"),
 p("The Equity and Inclusion Operations Consultant post is the only one of its kind in the Department of Human Services. It was created primarily to serve the Disability Services Division. There is no line of authority running from the Administration to the Division with respect to this role. The consultant collaborates, consults, and works with the Administration's Equity Director, Deqa Sayid, and the position's work direction sits within the Division. That was deliberate when the position was established, and it is why this Program is built to stand on its own."),
 p("The consultant's expectations are grounded in the Department's, the Department being the controlling authority for equity work across the agency, and in the position description itself, which Jason Flint, then the operations manager, helped to craft. Mr. Flint also co-created the agreed decomposition of the position in early 2023, the document that sets out the duties this Program is built to carry. He has since left the Department; the structure that work established is what set this Program in motion."),
 h2("What the role provides, and what it does not"),
 p([b("The consultant provides the means. "),tx("Resources, tools, curriculum, practical knowledge, and skills that any staff member or leader can pick up and apply in their own work.")]),
 p([b("The consultant does not do the equity work on anyone's behalf. "),tx("Building the resources and also performing the work they support are two different jobs, and only the first belongs to this role. Applying equity in the daily conduct of the Division's business belongs to everyone in it \u2014 that is what equity is. This is stated plainly because it has been misunderstood before, and because a Program that quietly assumed otherwise would relieve everyone else of accountability on the theory that the consultant is there to fix it.")]),
 p([b("The consultant does not impose a view of how equity must be executed. "),tx("No workgroup, initiative, or unit is told what its equity practice must look like. The Program makes the means available; what a team does with them is that team's judgment.")]),
 p([b("The consultant is not an enforcer. "),tx("Offering workshops and discussion that socialize the Equity Analysis Toolkit is squarely within this role. Holding divisions, leaders, and staff accountable for actually using the Toolkit sits with the Equity Director, across the Department. Asking one person to be both the teacher and the enforcer is inconsistent with the role, inconsistent with its purpose, and inconsistent with basic practice in this field. It would also make the consultant both the architect and the operator of the Program, which is precisely the arrangement that lets accountability dissolve.")]),
 h2("What this Program is: a guidance tool"),
 p("This Program is designed to support what is currently happening in the Division, and it leaves organizational structures and established practice where they are, with the people who own them."),
 p([b("It is a guidance tool. "),tx("It holds the knowledge and experience of the consultant, arranged so that other people can pick it up and use it, and it is consistent with the six goals the Administration's Equity Director has set out and with the Department's own goals. The Department is the body instituting change across the agency. This Program takes its cue from that direction and makes it usable at the level of a division.")]),
 h2("The developmental picture, and what it asks of us"),
 p("There is a reason this Program takes the shape it does rather than a more directive one, and it has to do with where the organization actually is."),
 p("The Department's Intercultural Development Inventory coordinator, Nicole Urbach, reported that DHS as a whole operates in Minimization \u2014 a stage at which difference tends to be smoothed over rather than genuinely engaged. That the Office of Employee Culture and the Innovation and Impact team are actively designing changes to practice is itself an acknowledgment that the organization is not where it intends to be. The agency's stated goal is to become an anti-racist, multicultural organization."),
 p("The most recent appraisal placed Disability Services Division leadership in Acceptance, a more developed position than the Department as a whole, and that is a real asset to this work. A shift of this kind asks something of everyone involved. Some of it is uncomfortable, because examining familiar practice usually is \u2014 and that discomfort is part of the work rather than a sign that something has gone wrong."),
 p("This work exists to move the Division toward a place where multiple cultural perspectives genuinely shape how decisions are made. That is how an organization grows, individually and collectively — and that includes the consultant, who learns alongside the Division. It is a collaborative approach by design."),
 p("Where visibility into planning at the Administration level is not available to this role, the Program is built to continue regardless. That is a statement about how the work is structured rather than a grievance. It is simply the reason the Program is designed to be self-sufficient, and to remain useful whatever is or is not shared from above."),

 h2("What this frees the role to do"),
 p("Because the Program carries the resources, the consultant is freed to work closely where a specific need exists: with a particular workgroup, or with Charles Young on the legislative work that reports to the Division Director. A consultant can be brought in to understand what is happening and to help shape an approach without being embedded in every initiative. That was the pattern that did not work before, and the Program is the structure that replaces it."),
 p("The Division Director has expressed a wish for closer work between this role and the legislative work Charles Young carries, and the Program is what makes that possible. When the resources no longer depend on the consultant being in the room, the consultant's time can go where it is worth most: sitting with the management team and the leadership team, learning what their priorities for the Division actually are, and offering advisory input on programs under consideration while the advantages and disadvantages can still be weighed. That kind of face to face advice is difficult to offer when one person is also the only route to every resource. It is also how the work stops being siloed."),
 h2("Why it cannot rest on one leader's view"),
 p("If the Program depended on the understanding or preference of whoever currently holds a leadership post, it would move whenever that post changed hands, and it would be unfair to ask the work to survive that. It is also a practical matter of where the organization is starting from: the Department's own Intercultural Development Inventory coordinator, Nicole Urbach, reported that DHS as a whole operates in Minimization, while the agency's stated goal is to become an anti-racist, multicultural organization. Closing that distance is a matter of sustained practice, not a matter of any single leader's tenure."),
 h2("Where responsibility sits"),
 p("The consultant surfaces what is needed and supplies the means; how the Program is put to use in each area is shaped by the leaders and staff who own that work. The DHS Equity Policy is explicit that responsibility for equity is shared, and the Program is built on that: leadership, staff and consultant each carry a part, and the work goes furthest when each part is held."),

 h1("10. Boundaries that protect staff"),
 p("These boundaries are stated plainly because they protect both staff and the Division."),
 ...NOT.map(t=>bl(t)),

 h1("11. What is required and not yet built"),
 p("Three requirements remain unmet. Each is named here so that the picture is complete."),
 table([2000,5100,2260],["Requirement","What is missing","What it depends on"],REQUIRED),

 h1("12. What is being asked of you"),
 p([b("Your reading of this, and your thoughts, by December 1, 2026. "),tx("Not approval \u2014 this is offered so that Division leadership understands what the Program is, who it helps, and where it is going. With your reflections in hand by December 1, there is time to prepare how staff are told about the Program, so that people hear what it is and what it offers them before it opens rather than at the same moment.")]),
 p("The work is well underway and moving toward the point where the Program is ready to open. What has been built so far is set out above. What remains is set out in section 11. The greater part of the benefit lies in what follows the opening, not in what has been assembled to reach it."),
];

module.exports.doc=docShell({docTitle:"Program Requirements Document",footer:"Program Requirements Document  ·  Disability Services Division  ·  draft",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Program-Requirements-Document.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
