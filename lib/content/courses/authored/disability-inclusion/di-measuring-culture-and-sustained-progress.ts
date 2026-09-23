import type { CoursePack } from "../../source-types";

// Disability Inclusion curriculum, Strategic leadership, module 4:
// Measuring Culture and Sustained Progress.
const pack: CoursePack = {
  course: {
    id: "di-measuring-culture-and-sustained-progress",
    indexNumber: 1123,
    seriesLabel: "Disability Inclusion · Strategic leadership",
    title: "Measuring Culture and Sustained Progress",
    subtitle: "Choose leading and outcome measures, treat feedback from disabled people as a core input, and run review points that produce decisions rather than presentations.",
    scope: "For executive leaders, board members, commissioners, senior directors, policy leaders, procurement leaders, finance leaders and enterprise equity or accessibility sponsors. Participation in this program is voluntary and does not replace required training.",
    treatment: "Four short lessons with an executive progress summary, measurement scenarios, a sorting exercise, flashcards and knowledge checks",
    duration: "44–52 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/viewpoint-wellbeing-surveys.jpg",
    coverAlt: "A man fills a survey on a laptop in a cubicle.",
    introTranscript: "This course is about knowing whether disability inclusion is working, in a way that changes what the agency does next. It separates activity from outcome, leading indicators from lagging ones, and system measures from anything that scores an individual. It treats the experience of disabled employees, service users and partners as a core performance input rather than a survey appendix, and it ends with a review cycle whose purpose is decisions and corrective action. You will leave with a small progress summary for your own area and the questions each review point must answer.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Distinguish activity measures from outcome measures and rewrite an activity measure as an outcome.",
        "Select leading and lagging indicators for digital accessibility, workplace accommodations, service access, culture and governance, at the level of systems and aggregates rather than individuals.",
        "Design feedback from disabled employees, service users and partners as a core performance input, with privacy, voluntariness and compensation built in.",
        "Establish a review cycle at agreed review points that ends in documented decisions and corrective action.",
        "Explain why measuring or ranking individual employees on disability inclusion undermines the system the measures are meant to improve.",
      ],
      evidence: [
        "Four knowledge checks tied to measurement decisions.",
        "A sort of measures into activity, leading, outcome and inappropriate.",
        "A drafted progress summary for your area with no more than two leading and two outcome indicators per category, and the decision each review point must produce.",
      ],
      appliedNextStep: "Draft the progress summary for your own area using the five categories in lesson two. Take it to the accessibility lead and the steering committee, ask what is missing and what would be misread, and bring the revised version to your next review point.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Survey design, data privacy and any collection of disability-related information follow the agency’s data practices, human resources and research review requirements; this course describes what to measure and why, and those offices confirm how to do it lawfully here.",
      toolkitQuestion: "Does this measure tell us whether a barrier came down for the people affected, and could it be read as a judgment about any one person?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "measuring-culture-and-sustained-progress-1",
        number: 1,
        title: "Activity is not outcome",
        summary: "Learn to tell what the agency did from what changed for people, and rewrite the measures that confuse the two.",
        minutes: 11,
        learning: {
          objective: "Distinguish activity measures from outcome measures and rewrite an activity measure as an outcome that a disabled person would recognize.",
          takeaways: [
            "An activity measure counts what the agency did; an outcome measure describes what changed for people. Most inclusion progress summaries are all activity.",
            "Activity measures are useful as leading indicators only when the link to an outcome has been checked.",
            "The test of an outcome measure is whether a disabled employee or participant would recognize it as a change in their experience.",
          ],
          evidence: "A completed sort of measures; one knowledge check; three activity measures from your area rewritten as outcomes.",
          appliedNextStep: "Take the three measures your area reports most often on disability inclusion and write, for each, what changed for people if the number moved. If you cannot, the measure is activity.",
        },
        scenario: {
          context: "A division reports strong disability inclusion results: training completion is high, an accessibility policy has been adopted, an employee resource group has been launched and an awareness month was observed. In the same period, accommodation requests still take eight weeks, the intake form remains inaccessible, and disabled employees in the engagement survey report the lowest sense of belonging of any group.",
          prompt: "As the assistant commissioner receiving this report, what do you conclude?",
          options: [
            { label: "The division is making progress and the outcomes will follow with time.", response: "Nothing in the report is an outcome. Completion, adoption, launch and observance are things the division did. The three facts that describe people’s experience all say the barriers are unchanged." },
            { label: "The report measures activity, not outcomes; the outcomes available say barriers are unchanged, and the progress summary needs to be rebuilt around what changed for disabled employees and participants.", response: "This separates what was done from what changed, and it treats the engagement result and the accommodation timeline as the real performance data.", recommended: true },
            { label: "The engagement result reflects a few dissatisfied employees and should be weighed against the completed activities.", response: "Discounting the only outcome measure in favor of activity counts is how organizations stay convinced they are succeeding while the people they serve know otherwise." },
          ],
        },
        transfer: {
          prompt: "Which measures on your current progress summary would a disabled employee or participant recognize as a change in their experience?",
          options: ["Mark each measure as activity or outcome", "For each activity measure, write the outcome it is supposed to produce", "Decide which outcome you will start measuring at the next review point"],
        },
        blocks: [
          { type: "text", heading: "What was done, and what changed", body: "<p>Most reporting on disability inclusion counts what the organization did: trainings delivered, policies adopted, groups formed, events held, audits completed. These are activities. They are easy to count, they are within the organization’s control, and they feel like progress. None of them tells you whether a blind applicant can now complete the form, whether an employee got an accommodation before the project she needed it for ended, or whether a Deaf resident could follow the hearing about her services.</p><p>An outcome measure describes what changed for people. Accommodation time from request to delivery fell from eight weeks to two. The share of intake forms completed online without staff assistance rose among screen-reader users. Barrier reports about the benefits portal dropped after the redesign and stayed down. Disabled employees’ reported sense of belonging moved toward the agency average. These are harder to get, and they are the only measures that tell a leader whether the activities were worth doing.</p><p>Activities are not worthless. They become leading indicators when the link to an outcome has been checked: if testing before release reliably reduces barrier reports, then the testing rate is a leading indicator worth watching. The failure is reporting activities as if they were results. A simple test catches it: if this number moved, what changed for a disabled person? If the answer is “nothing yet,” you are looking at activity.</p>" },
          { type: "sorting", id: "measuring-culture-and-sustained-progress-1-sort", heading: "Activity, leading indicator, outcome, or not appropriate?", categories: ["Activity", "Leading indicator", "Outcome", "Not appropriate"], items: [
            { text: "Number of accessibility awareness sessions held.", category: "Activity" },
            { text: "Share of new public content tested with assistive technology before release.", category: "Leading indicator" },
            { text: "Median days from accommodation request to delivery, in aggregate.", category: "Outcome" },
            { text: "Each employee’s individual score on an inclusion behavior rating.", category: "Not appropriate" },
            { text: "Barrier reports about the benefits portal per thousand applications, before and after redesign.", category: "Outcome" },
            { text: "Share of supervisors who have completed accommodation-process training.", category: "Leading indicator" },
          ] },
          { type: "leaderMove", heading: "Ask what changed for people", control: "You control whether a report of activities is accepted as a report of results.", failure: "Do not praise a progress summary of completions and launches. Do not let the one outcome measure in the room be discounted because it is uncomfortable.", next: "At your next review, ask of each measure: if this moved, what changed for a disabled employee or participant? Keep the measures that have an answer." },
          { type: "flashcards", heading: "Rewriting activity as outcome", cards: [
            { front: "“Accommodation policy adopted”", back: "<p>Outcome: median days from request to delivery, in aggregate, against a target; share of requests with interim access provided while open.</p>" },
            { front: "“Website audit completed”", back: "<p>Outcome: blocking defects found by the audit that are now closed and retested; barrier reports about the site before and after.</p>" },
            { front: "“Manager training delivered”", back: "<p>Leading indicator: share of supervisors trained. Outcome: accommodation timelines and disabled employees’ reported experience of their manager, in aggregate.</p>" },
            { front: "“Accessible meeting standard issued”", back: "<p>Outcome: share of public meetings with captions on and materials sent in advance, and participation and satisfaction among disabled attendees.</p>" },
            { front: "“Employee resource group launched”", back: "<p>Outcome: the recommendations the group made, what happened to each, and whether belonging among disabled employees moved toward the agency average.</p>" },
          ] },
          { type: "quote", text: "Every year the report said the division had trained everyone and adopted a policy. Every year my accommodation still took two months. I could not tell you which of those two facts leadership was looking at, but it was not mine.", cite: "Composite staff perspective, illustrative" },
          { type: "knowledgeCheck", id: "measuring-culture-and-sustained-progress-1-check", question: "Which of the following is an outcome measure for workplace accommodation?", options: [
            { text: "The accommodation policy was revised and published.", correct: false },
            { text: "Median days from accommodation request to delivery, in aggregate, fell from eight weeks to two.", correct: true },
            { text: "All supervisors received an email about the accommodation process.", correct: false },
          ], feedbackCorrect: "Yes. A disabled employee would recognize that change in their own experience. The other two are things the agency did.", feedbackIncorrect: "Ask what changed for a person. A revised policy and an email are activities; a shorter wait is an outcome." },
        ],
      },
      {
        id: "measuring-culture-and-sustained-progress-2",
        number: 2,
        title: "Leading and outcome indicators, by area",
        summary: "Build a small executive progress summary across digital accessibility, workplace accommodations, service access, culture and governance, with indicators that predict and indicators that confirm.",
        minutes: 13,
        learning: {
          objective: "Select leading and outcome indicators for digital accessibility, workplace accommodations, service access, culture and governance, at the level of systems and aggregates.",
          takeaways: [
            "A leading indicator tells you whether the conditions for an outcome are in place; an outcome indicator tells you whether it happened. A progress summary needs both.",
            "Two of each per category is enough; a progress summary nobody can read in five minutes will not be read.",
            "Every indicator is about a system, a product, a process or an aggregate group. None is about a named or identifiable person.",
          ],
          evidence: "One knowledge check; a drafted progress summary for your area with no more than two leading and two outcome indicators per category.",
          appliedNextStep: "Draft the progress summary and ask the accessibility lead and the steering committee two questions: what is missing, and what could be misread.",
        },
        scenario: {
          context: "A leadership team is building its first disability inclusion progress summary. The draft has thirty-one indicators, including the number of employees who have disclosed a disability, the number of accessibility complaints by unit, and a proposal to include an inclusion rating for each manager drawn from their team’s survey responses.",
          prompt: "What do you change?",
          options: [
            { label: "Keep the full set; more data gives a fuller picture.", response: "Thirty-one indicators will not be read. Disclosure counts measure trust in the process more than anything else, and a rating for each manager turns a progress summary about systems into a scoring tool that will change how people answer surveys." },
            { label: "Cut to two leading and two outcome indicators per category, report complaints by service and channel rather than as a league table of units, and remove anything that rates or identifies an individual, including per-manager scores.", response: "Small, system-level and safe to be honest about. This is the progress summary that will be read and that people will keep feeding with truthful information.", recommended: true },
            { label: "Keep the manager ratings but make them confidential to the executive team.", response: "Confidential scoring is still scoring. Once a survey is known to produce a rating of a named manager, responses shift toward protecting or punishing that person, and the measure stops describing the culture." },
          ],
        },
        transfer: {
          prompt: "Which two indicators in each category would you put on a single page for your area?",
          options: ["Choose two leading and two outcome indicators per category", "Check that none describes an identifiable person", "Name the source of each number and who owns it"],
        },
        blocks: [
          { type: "text", heading: "Predict and confirm", body: "<p>A leading indicator tells you whether the conditions that produce an outcome are in place: content is being tested before release, supervisors know the accommodation process, meeting standards have been adopted, budget and owners exist. A lagging or outcome indicator tells you whether the result arrived: fewer barriers reported, faster accommodations, higher participation, stronger belonging, priority improvements completed and still working. Leading indicators let you act before the outcome fails; outcome indicators keep you honest about whether the leading ones actually lead.</p><p>Keep the progress summary small. Two leading and two outcome indicators in each of five categories is twenty numbers, which a sponsor can read in five minutes and a steering committee can discuss in one meeting. Every indicator should name its source and its owner, and every indicator should be about a system, a process, a product or an aggregate group. The moment a progress summary begins to describe identifiable individuals, whether through per-manager scores, disclosure counts in small units or complaint tallies that point at a person, it stops measuring the culture and starts shaping what people are willing to say.</p><p>The five categories below follow the executive progress summary structure recommended for this level. Adapt the indicators to what your area can actually source; do not invent a number you cannot get.</p>" },
          { type: "tabs", heading: "Executive progress summary categories", tabs: [
            { label: "Digital accessibility", body: "<h4>Leading indicators</h4><ul><li>Share of new public and staff-facing content and systems tested with assistive technology before release.</li><li>Share of high-use templates and authoring tools confirmed accessible at the source.</li></ul><h4>Outcome indicators</h4><ul><li>Barrier reports and access-related support requests per volume of use, by system, before and after changes.</li><li>Blocking defects open past their remediation date, by system and vendor.</li></ul>" },
            { label: "Workplace accommodations", body: "<h4>Leading indicators</h4><ul><li>Response-time target adopted, with median and longest time from request to decision and to delivery, in aggregate.</li><li>Share of supervisors who have completed accommodation-process training.</li></ul><h4>Outcome indicators</h4><ul><li>Retention, engagement and advancement of disabled employees compared with the agency average, reported in aggregate and only where group sizes protect anonymity.</li><li>Share of requests with interim access provided while open.</li></ul>" },
            { label: "Service access", body: "<h4>Leading indicators</h4><ul><li>Accessible intake, event and communication standards adopted and in use, by service.</li><li>Share of services offering more than one way to apply, attend and be heard.</li></ul><h4>Outcome indicators</h4><ul><li>Participation and completion by disabled applicants and attendees where it can be measured in aggregate, and satisfaction reported through accessible feedback channels.</li><li>Equitable outcomes across services: approvals, timeliness and appeals compared across groups, in aggregate.</li></ul>" },
            { label: "Culture", body: "<h4>Leading indicators</h4><ul><li>Leader behavior visible in systems: access criteria in charters signed, accommodation and access items on standing agendas, steering committee recommendations answered.</li><li>Staff confidence, from voluntary and anonymous surveys, that they know how to arrange access and raise a barrier, and that it is safe to do so.</li></ul><h4>Outcome indicators</h4><ul><li>Reports of exclusion, in aggregate and by type, trending down over time.</li><li>Sense of belonging among disabled employees moving toward the agency average, from voluntary and anonymous surveys with group sizes that protect anonymity.</li></ul>" },
            { label: "Governance", body: "<h4>Leading indicators</h4><ul><li>Base-budget lines for access in place and in use; standing contracts for captioning, interpretation and remediation drawn on.</li><li>Every priority barrier has an assigned owner and a date, and reviews occur at the agreed review points.</li></ul><h4>Outcome indicators</h4><ul><li>Priority improvements completed on time and confirmed by testing.</li><li>Improvements still operating as designed at later review points, not quietly reverted.</li></ul>" },
          ] },
          { type: "leaderMove", heading: "Keep it small and keep it about systems", control: "You control how many indicators the progress summary carries and whether any of them describes a person.", failure: "Do not approve a progress summary with per-manager or per-employee scores, disclosure counts in small units, or complaint tallies that point at individuals. Do not let the progress summary grow past what can be read in five minutes.", next: "Cut your draft to two leading and two outcome indicators per category and write the owner beside each." },
          { type: "list", heading: "Checks before an indicator goes on the progress summary", ordered: true, items: ["Is it about a system, process, product or aggregate group, never an identifiable person?", "Can we actually source the number, and who owns it?", "If it moved, would a disabled employee or participant recognize the change?", "For a leading indicator, has the link to an outcome been checked or at least stated?", "Are group sizes large enough that no one can be identified, and if not, is the indicator suppressed or combined?", "Will reporting it change what people are willing to say in surveys or barrier reports?"] },
          { type: "flashcards", heading: "Pairs that belong together", cards: [
            { front: "Testing rate and barrier reports", back: "<p>Leading: share of content tested before release. Outcome: barrier reports per volume of use. If testing rises and reports do not fall, the testing is not finding what users find.</p>" },
            { front: "Manager training and accommodation time", back: "<p>Leading: supervisors trained. Outcome: median days from request to delivery. If training rises and time does not fall, the delay is in the process, not the managers.</p>" },
            { front: "Standards adopted and participation", back: "<p>Leading: accessible meeting and intake standards in use. Outcome: disabled participation and satisfaction. If standards exist and participation does not change, check whether they are actually followed.</p>" },
            { front: "Owners assigned and improvements sustained", back: "<p>Leading: every priority barrier has an owner and date. Outcome: improvements complete and still operating later. If owners exist and improvements revert, the ownership ends too early.</p>" },
          ] },
          { type: "knowledgeCheck", id: "measuring-culture-and-sustained-progress-2-check", question: "A draft progress summary proposes reporting each manager’s inclusion rating from their team’s survey responses. Why does this course exclude it?", options: [
            { text: "Because managers would object to being measured.", correct: false },
            { text: "Because it turns a system measure into a score of an individual, which changes how people answer and stops the measure from describing the culture; leader behavior is measured instead through systems such as signed criteria, agenda items and answered recommendations.", correct: true },
            { text: "Because survey data is not reliable enough to report at all.", correct: false },
          ], feedbackCorrect: "Yes. The progress summary measures systems and aggregates. Individual scoring corrupts the feedback the whole approach depends on.", feedbackIncorrect: "The objection is not managers’ comfort or survey reliability. Scoring individuals changes what people say and turns a learning tool into a judging tool." },
        ],
      },
      {
        id: "measuring-culture-and-sustained-progress-3",
        number: 3,
        title: "Feedback from disabled people as a core input",
        summary: "Design feedback from disabled employees, service users and partners so it is voluntary, safe, compensated where appropriate and treated as performance data rather than testimony.",
        minutes: 12,
        learning: {
          objective: "Design feedback from disabled employees, service users and partners as a core performance input, with privacy, voluntariness and compensation built in and with a visible response to what is heard.",
          takeaways: [
            "The people who meet the barriers know where they are; their feedback is the most accurate performance data the agency has, if it is safe to give.",
            "Feedback is voluntary, never requires disclosure of a diagnosis, is reported only in aggregate, and is compensated when it is asked of people outside the agency.",
            "Feedback that produces no visible response teaches people to stop giving it; close the loop publicly.",
          ],
          evidence: "One knowledge check; a written description of the feedback channels in your area and what happened to the last three things heard through them.",
          appliedNextStep: "Find out what happened to the last three barrier reports or steering committee recommendations in your area, and publish the answer where the people who raised them can see it.",
        },
        scenario: {
          context: "A division wants better data on disabled employees’ experience. It proposes a survey that asks employees to identify their disability type and their manager so responses can be analyzed by team, and it plans to share team-level results with each manager.",
          prompt: "As the sponsor, what do you require before the survey goes out?",
          options: [
            { label: "Approve it; the detail will make the results actionable.", response: "The detail will make the results dangerous. Identifying disability type and manager in small teams identifies people, and sharing results with the manager named in them ensures the next survey gets careful, protective answers or none." },
            { label: "Make the survey voluntary and anonymous, drop the diagnosis question, report only at group sizes that protect anonymity, route it through the data practices and human resources review, and publish what the division will do in response.", response: "This keeps the survey honest and safe, and it treats the results as system data. The response, published, is what makes people willing to answer next time.", recommended: true },
            { label: "Skip the survey and rely on the accommodation request data instead.", response: "Request data shows only people who asked. The survey exists to hear from people who did not, and it can be run safely." },
          ],
        },
        transfer: {
          prompt: "How would a disabled employee, participant or partner in your area tell you about a barrier today, and what would happen next?",
          options: ["Trace the route from report to response and name where it stalls", "Check whether any step requires disclosure or identifies a person", "Decide how and where the response will be published"],
        },
        blocks: [
          { type: "text", heading: "The most accurate data you have, if it is safe to give", body: "<p>Testing and audits find the barriers experts look for. Disabled employees, service users and partners find the ones that actually stop them, which are often different: the phone tree that times out, the form that technically passes and still cannot be completed, the meeting where captions are on and the slides are never described. Their feedback is the most accurate performance data the agency has. It is also the easiest to lose, because people stop giving feedback the moment it feels unsafe or pointless.</p><p>Safe means voluntary, anonymous where the person wants it to be, never requiring a diagnosis or a disclosure to be heard, and reported only at group sizes that protect anonymity. In small units that means suppressing or combining results rather than reporting them. It means routing any collection of disability-related information through the agency’s data practices, human resources and, where applicable, research review requirements. It means never linking a response to a named manager or employee in a way that could become a judgment about either. And when the agency asks people outside it, service users, self-advocates and community partners, for their time and expertise, it pays for it, as it would pay any consultant.</p><p>Pointless is the other way feedback dies. A steering committee that never learns what happened to its recommendations, a barrier-report form that produces a form-letter acknowledgment and nothing else, a survey whose results appear in an executive deck and nowhere else: each teaches people that speaking is wasted effort. Close the loop where the people who spoke can see it: this is what we heard, this is what we did, this is what we decided not to do and why.</p>" },
          { type: "accordion", heading: "Channels, and what each is good for", items: [
            { title: "Barrier reports", body: "<p>A standing route, printed on documents and web pages and available by phone, for anyone to report a barrier. Good for specific, fixable defects. Needs an owner, a response time and a public tally of what was fixed. Never requires the reporter to explain their disability.</p>" },
            { title: "Voluntary anonymous surveys", body: "<p>Good for hearing from people who never report or request. Must be voluntary, anonymous, free of diagnosis questions, reported at safe group sizes and followed by a published response.</p>" },
            { title: "Steering committee and advisory groups", body: "<p>Good for judgment on priorities, design review and reading patterns across channels. Members compensated or given protected time; recommendations and responses recorded and published.</p>" },
            { title: "Testing with disabled users", body: "<p>Good for finding what a product does in real use before and after launch. Participants are paid, tasks are real work, and findings go into the defect list with normal priority.</p>" },
            { title: "Partner and community feedback", body: "<p>Good for how the agency’s services land in communities: county and tribal partners, disability organizations, self-advocates. Sought on their terms, compensated where appropriate, and answered.</p>" },
          ] },
          { type: "leaderMove", heading: "Close the loop where people can see it", control: "You control whether the people who raised a barrier or made a recommendation ever learn what happened to it.", failure: "Do not let feedback end in an executive deck. Do not approve any survey or channel that requires a diagnosis, identifies a person or feeds a rating of a named manager.", next: "Publish, this month, what happened to the last three barrier reports and the last three steering committee recommendations in your area." },
          { type: "quote", text: "I filled out the accessibility feedback form twice. Both times I got a thank-you message. I have no idea if anyone read it, so the third time I did not bother, and I told my colleagues not to either.", cite: "Composite participant perspective, illustrative" },
          { type: "flashcards", heading: "Rules for safe feedback", cards: [
            { front: "Voluntary", back: "<p>No one is required to respond, disclose or participate, and nonparticipation is never noted or followed up on an individual.</p>" },
            { front: "No diagnosis required", back: "<p>Ask about barriers and needs, not conditions. A person can describe what does not work without saying why it does not work for them.</p>" },
            { front: "Safe group sizes", back: "<p>Report only where the group is large enough that no one can be identified; otherwise suppress or combine. Small-unit breakdowns identify people.</p>" },
            { front: "Never a rating of a person", back: "<p>Results describe systems and aggregate experience. They are never linked to a named manager or employee as a score or a judgment.</p>" },
            { front: "Compensated", back: "<p>Service users, self-advocates and community partners are paid for their time and expertise, through a mechanism finance confirms, with alternatives where payment could affect benefits.</p>" },
            { front: "Answered", back: "<p>What we heard, what we did, what we decided not to do and why, published where the people who spoke can see it.</p>" },
          ] },
          { type: "knowledgeCheck", id: "measuring-culture-and-sustained-progress-3-check", question: "Which practice most reliably keeps disabled employees and participants willing to give feedback over time?", options: [
            { text: "Sending a thank-you acknowledgment for every submission.", correct: false },
            { text: "Keeping feedback voluntary and anonymous, never requiring disclosure or identifying a person, and publishing what was heard and what changed in response.", correct: true },
            { text: "Requiring every unit to reach a minimum survey response rate.", correct: false },
          ], feedbackCorrect: "Yes. Safety and a visible response are what sustain feedback. Acknowledgments and quotas do not.", feedbackIncorrect: "A thank-you message is not a response, and a response-rate quota pressures people rather than protecting them. Make it safe and show what changed." },
        ],
      },
      {
        id: "measuring-culture-and-sustained-progress-4",
        number: 4,
        title: "A review cycle that leads to decisions",
        summary: "Run review points that end in documented decisions and corrective action, sustain improvements after the project ends, and report progress honestly.",
        minutes: 11,
        learning: {
          objective: "Establish a review cycle at agreed review points that produces documented decisions and corrective action, and design for improvements to be sustained after the project that created them ends.",
          takeaways: [
            "A review point has a purpose: decisions. Fund, stop, reassign, escalate or close, recorded with an owner and a date.",
            "The first item at every review is whether the decisions from the last one were carried out.",
            "Improvements revert when ownership ends with the project; assign an operating owner before the project closes.",
          ],
          evidence: "One knowledge check; a written agenda for your next review point with the decision questions and the check on last time’s decisions.",
          appliedNextStep: "Write the agenda for your next review point: last time’s decisions first, then each red indicator as a decision question, then the public-facing report’s open items.",
        },
        scenario: {
          context: "Two review points ago, the sponsor decided to fund remediation of the twenty highest-use forms and assigned an owner. The progress summary now shows the forms were remediated, but barrier reports about them have started rising again because three units have gone back to their old templates, and the project team that did the work has been disbanded.",
          prompt: "What does this review need to decide?",
          options: [
            { label: "Fund a second remediation of the forms.", response: "This repeats the fix and not the lesson. The forms reverted because ownership ended with the project. Without an operating owner and a locked template, a second remediation will revert too." },
            { label: "Assign an operating owner for the templates in communications, remove the old templates from circulation, add template status to the progress summary, and record the decision with a date to check it at the next review.", response: "This addresses the reversion at its cause and makes the improvement someone’s job. The progress summary addition means the next reversion is seen early.", recommended: true },
            { label: "Ask the three units to explain why they reverted.", response: "Worth asking, and not a decision. Units revert because old templates are still available and nobody owns the new ones. Decide the ownership and the removal, then ask." },
          ],
        },
        transfer: {
          prompt: "Which improvement in your area is one reorganization away from reverting?",
          options: ["Name it and who owns it after the project", "Add a sustainment indicator for it to the progress summary", "Decide at the next review who the operating owner is"],
        },
        blocks: [
          { type: "text", heading: "Decide, check, sustain, report", body: "<p>A review point exists to produce decisions. The progress summary is the input; the output is a short record of what was decided, by whom, with an owner and a date. The five verbs from the governance course apply: fund, stop, reassign, escalate or close. The first item on every review agenda is the list of decisions from the last review and whether each was carried out. A review that does not begin there is a fresh presentation each time, and nothing accumulates.</p><p>Corrective action is what the decisions produce when an indicator is red: a barrier reassigned to someone with authority, a launch held, a budget line increased, a vendor put on notice, a template locked. Record it in plain terms so the steering committee and the next review can see it. Where the review decides not to act, record that too, with the reason, so the decision can be revisited rather than forgotten.</p><p>Sustainment is where most accessibility improvements fail. A project remediates the forms, trains the staff, fixes the platform, and then closes; a year later a reorganization, a software update or a new template quietly undoes it. Before any improvement project closes, name the operating owner who will maintain the change as part of their ordinary work, remove the old way from circulation where possible, and put a sustainment indicator on the progress summary: is the improvement still operating as designed? The governance category in your progress summary exists for exactly this.</p><p>Report progress honestly. The public-facing progress report, where appropriate, tells communities what changed, what is still open and what was decided. Its credibility rests on naming the open items. A report that only lists successes is read as marketing by the people who still meet the barriers every day.</p>" },
          { type: "list", heading: "A review point agenda that produces decisions", ordered: true, items: ["Decisions from the last review: carried out, not carried out, and why.", "Each red or stalled indicator, framed as a decision question: fund, stop, reassign, escalate or close?", "Steering committee recommendations awaiting a response, and the response.", "Improvements at risk of reverting: who is the operating owner, and is the sustainment indicator green?", "What the public-facing progress report will say about open items.", "Decisions recorded, with owner and date, and circulated within the week."] },
          { type: "leaderMove", heading: "Start with last time’s decisions", control: "You control whether a review begins with accountability for the last one or with a new slide deck.", failure: "Do not close a review without a written decision for every red item. Do not let an improvement project close without an operating owner and a sustainment indicator.", next: "Open your next review with the list of decisions from the last one and ask, for each, whether it happened." },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "The review decision record", summary: "The half-page that turns a review point into accountability. Completed in the meeting, circulated within the week, read first at the next review.", fields: [
            { label: "Last time", value: "Each decision from the previous review, with whether it was carried out and, if not, why and what changes." },
            { label: "Decisions now", value: "For each red or stalled item: the verb chosen, fund, stop, reassign, escalate or close; the owner by role; the date; and the indicator that will show it worked." },
            { label: "Not acting, and why", value: "Items the review decided not to act on, with the reason, so they can be revisited rather than lost." },
            { label: "Sustainment and public account", value: "Improvements checked as still operating, the operating owner for each, and the open items the public-facing progress report will name." },
          ], action: "Use this record at your next review point and read it aloud as the first item at the one after." },
          { type: "flashcards", heading: "Why improvements revert, and the fix", cards: [
            { front: "Ownership ended with the project", back: "<p>Fix: name an operating owner in the function that lives with the change before the project closes, and put it in their performance plan.</p>" },
            { front: "The old way was still available", back: "<p>Fix: remove old templates, settings and processes from circulation. People revert to what is easiest to find.</p>" },
            { front: "Nobody was watching", back: "<p>Fix: a sustainment indicator on the progress summary, is the improvement still operating as designed, checked at every review point.</p>" },
            { front: "An update undid it", back: "<p>Fix: accessibility acceptance testing for updates as well as new systems, written into the contract and the change process.</p>" },
          ] },
          { type: "knowledgeCheck", id: "measuring-culture-and-sustained-progress-4-check", question: "What is the first item on a review agenda that is designed to produce decisions?", options: [
            { text: "A presentation of the current progress summary.", correct: false },
            { text: "The decisions from the previous review and whether each was carried out.", correct: true },
            { text: "An update from each unit on its accessibility activities.", correct: false },
          ], feedbackCorrect: "Yes. Beginning with last time’s decisions is what makes reviews accumulate instead of restarting.", feedbackIncorrect: "Presentations and activity updates restart the conversation each time. Accountability begins with checking what was decided last time." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Measuring what changed",
    subtitle: "A one-page reminder for sponsors, senior directors and steering committees",
    quote: "If this number moved, what changed for a disabled person?",
    use: {
      purpose: "Keep the progress summary small, honest and about systems, and keep review points producing decisions.",
      remember: ["Activity counts what the agency did; outcome describes what changed for people.", "Two leading and two outcome indicators per category; every one about a system or an aggregate, never an identifiable person.", "Feedback is voluntary, safe, compensated where appropriate and answered where people can see it.", "Every review starts with last time’s decisions and ends with new ones recorded."],
      doNext: "Draft your area’s progress summary, ask the steering committee what is missing and what could be misread, and bring it to your next review point.",
    },
    sections: [
      { heading: "Before an indicator goes on the progress summary", items: ["Is it about a system, process, product or aggregate group?", "Can we source it, and who owns the number?", "Would a disabled employee or participant recognize the change if it moved?", "Are group sizes safe, and will reporting it change what people say?"] },
      { heading: "Feedback that stays alive", items: ["No diagnosis required; no link to a named manager or employee.", "Voluntary and anonymous where the person wants it; safe group sizes or suppression.", "Pay service users, self-advocates and community partners for their time.", "Publish what was heard, what was done, and what was not done and why."] },
      { heading: "At every review point", items: ["Last time’s decisions first.", "Each red item as a question: fund, stop, reassign, escalate or close?", "An operating owner and a sustainment indicator for every improvement.", "Open items named in the public-facing progress report, where appropriate."] },
    ],
  },
  sources: [
    { title: "W3C Web Accessibility Initiative, Planning and Managing Web Accessibility", href: "https://www.w3.org/WAI/planning-and-managing/", note: "Guidance on monitoring, reviewing and sustaining accessibility, including involving users with disabilities and tracking progress." },
    { title: "Section508.gov, Manage Accessibility Programs", href: "https://www.section508.gov/manage/", note: "Program management and maturity guidance, including measurement and reporting practices for accessibility programs." },
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "The framing of inclusion as participation supported by policies and practices, which outcome measures should reflect." },
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Employer guidance on accommodation processes and response practices that workplace accommodation indicators draw on." },
    { title: "U.S. Equal Employment Opportunity Commission", href: "https://www.eeoc.gov/", note: "Employment obligations, including limits on disability-related inquiries, relevant to how workforce feedback and data are collected." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota guidance and technical assistance for public bodies on accessibility and disability policy." },
  ],
};

export default pack;
