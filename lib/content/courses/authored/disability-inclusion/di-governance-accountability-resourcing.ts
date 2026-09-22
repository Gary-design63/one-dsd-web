import type { CoursePack } from "../../source-types";

// Disability Inclusion curriculum, Strategic leadership, module 2:
// Governance, Accountability and Resourcing.
const pack: CoursePack = {
  course: {
    id: "di-governance-accountability-resourcing",
    indexNumber: 1121,
    seriesLabel: "Disability Inclusion · Strategic leadership",
    title: "Governance, Accountability and Resourcing",
    subtitle: "Set up the sponsorship, structure, funding and unit-level expectations that let disability inclusion outlast any one leader.",
    scope: "For executive leaders, board members, commissioners, senior directors, policy leaders, procurement leaders, finance leaders and enterprise equity or accessibility sponsors. Participation in this program is voluntary and does not replace required training.",
    treatment: "Five short lessons with governance scenarios, a sorting exercise, a practical charter and knowledge checks",
    duration: "48–56 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/equity-inclusion-leadership-systems.jpg",
    coverAlt: "A mixed leadership table reviews printed charts.",
    introTranscript: "This course is about the machinery of disability inclusion: who sponsors it, who decides, who is paid to do the work, and how every business unit knows what is expected. It describes a governance structure that has an executive sponsor with real authority, a steering committee whose disabled members are compensated, an accessibility lead with a budget, and unit champions with time in their workload. It closes with reporting at agreed review points that leads to decisions. You will leave with a draft charter for your own area.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe what an executive sponsor for disability inclusion must have authority over, and distinguish sponsorship from endorsement.",
        "Design a governance structure with a steering committee, an accessibility lead and unit champions, and explain the authority, compensation and workload each requires.",
        "Build accessibility into base budgets as a core operating expectation and identify where exception-based spending is currently hiding it.",
        "Set specific, checkable expectations for procurement, information technology, human resources, communications, facilities and program operations.",
        "Specify what an executive progress summary and a public-facing progress report should contain at agreed review points and what decision each review must produce.",
      ],
      evidence: [
        "Five knowledge checks with explanations tied to authority, funding and accountability.",
        "A sort of governance elements into sponsorship, structure, resourcing and unit expectations.",
        "A drafted governance charter for your own area naming the sponsor, the committee, the lead, the champions and the review points.",
      ],
      appliedNextStep: "Complete the charter artifact in lesson two for your own area and take it to the leaders it names. Ask each to confirm the authority, budget and time it assigns them, and record what they change.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Budget authority, position classification and compensation for advisory members follow the agency’s finance, human resources and procurement rules; this course describes what good governance needs, and those offices confirm how to do it here.",
      toolkitQuestion: "Who has the authority, the money and the time to remove this barrier, and is each of those written down with a name?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "governance-accountability-resourcing-1",
        number: 1,
        title: "Executive sponsorship and clear accountability",
        summary: "Understand what a sponsor must actually hold, why endorsement is not sponsorship, and how accountability is written so it survives turnover.",
        minutes: 10,
        learning: {
          objective: "Describe the authority an executive sponsor for disability inclusion must hold and write an accountability statement that survives a change in leadership.",
          takeaways: [
            "A sponsor holds authority over the cross-functional barriers; an endorser lends a name to a memo.",
            "Accountability is written into position descriptions, performance conversations and standing agendas, not into speeches.",
            "The sponsor’s most important power is the ability to make another executive’s priority list change.",
          ],
          evidence: "One knowledge check; a written accountability statement for the sponsor role in your area.",
          appliedNextStep: "Find the current sponsor for disability inclusion in your area, if one exists, and check whether the role appears in any position description, performance plan or standing agenda. If it does not, that is the first item to fix.",
        },
        scenario: {
          context: "An administration names its communications director as the executive sponsor for disability inclusion because she cares deeply about it. Six months in, the largest barriers are a case-management system that cannot be used with a screen reader and an accommodation process that takes ten weeks. Both belong to other executives who outrank her.",
          prompt: "What is wrong with this sponsorship arrangement?",
          options: [
            { label: "Nothing; commitment is the most important qualification for a sponsor.", response: "Commitment without authority produces persuasion and memos. The two largest barriers sit in functions the sponsor cannot direct." },
            { label: "The sponsor has commitment but no authority over the functions where the barriers live; either the role moves to someone who has that authority or it is given the authority explicitly by the commissioner.", response: "Sponsorship is a question of who can change another executive’s priorities. Care is necessary, authority is decisive.", recommended: true },
            { label: "The sponsor should escalate each barrier to the commissioner as it arises.", response: "Escalation one barrier at a time is a symptom of a sponsor without authority. It also makes the commissioner the actual sponsor without saying so." },
          ],
        },
        transfer: {
          prompt: "Who in your area can change the priorities of information technology, procurement, human resources and program operations at once?",
          options: ["Name that person and whether they currently sponsor disability inclusion", "Write the sentence that would appear in their performance plan", "Identify the standing agenda where their sponsorship would be visible"],
        },
        blocks: [
          { type: "text", heading: "Sponsorship is authority, not affection", body: "<p>Organizations often choose a sponsor for disability inclusion the way they choose a speaker for an event: someone who cares and speaks well. Then the barriers turn out to live in information technology, procurement and human resources, and the sponsor discovers that caring is not a lever. The guidance from W3C’s Web Accessibility Initiative on planning and managing accessibility is consistent on this point: the sponsor must be senior enough to set priorities across the functions where the work happens, and must be visibly responsible for the result.</p><p>A useful test of sponsorship: can this person cause an item to move up another executive’s list without asking a favor? If the answer is no, the person is an advocate, which is valuable, but the organization still has no sponsor. In an agency of DHS’s size the sponsor for enterprise disability inclusion is normally a deputy commissioner or an assistant commissioner with cross-administration reach, and each administration or division needs its own sponsor at a level that can direct its functions.</p><p>Accountability has to be written where turnover cannot erase it. Put the sponsorship in the position description, so the next person inherits it. Put the outcomes in the performance plan, so the conversation happens. Put the review on a standing agenda, so the item cannot quietly fall off. A speech at an all-staff meeting is welcome; it is not one of these three.</p>" },
          { type: "list", heading: "What the sponsor must be able to do", items: ["Direct or formally require action from information technology, procurement, human resources, communications, facilities and program operations.", "Approve or shape budget requests so access is funded in the base, not by exception.", "Receive barrier reports and accommodation timelines directly, in aggregate, without filtering.", "Convene the steering committee and act on its recommendations or explain publicly why not.", "Stop a launch, contract or policy that fails the accessibility standard.", "Report progress to the commissioner, the board and, where appropriate, the public."] },
          { type: "leaderMove", heading: "Write the accountability where it cannot be lost", control: "You control whether disability inclusion appears in position descriptions, performance plans and standing agendas, or only in speeches.", failure: "Do not name a sponsor by announcement alone. Do not accept a sponsor who cannot direct the functions where the barriers live.", next: "Draft the one sentence that will appear in the sponsor’s position description and performance plan, and send it to human resources this week." },
          { type: "flashcards", heading: "Sponsor, advocate, endorser", cards: [
            { front: "Sponsor", back: "<p>Holds authority over the cross-functional barriers, owns the outcome in a performance plan, can stop a noncompliant launch, and reports up and out.</p>" },
            { front: "Advocate", back: "<p>Cares, persuades, raises issues and builds support. Essential, and not a substitute for a sponsor with authority.</p>" },
            { front: "Endorser", back: "<p>Lends a name to a memo or opens a meeting. Useful for visibility. Produces nothing on its own.</p>" },
            { front: "The priority-list test", back: "<p>Can this person move an item up another executive’s list without asking a favor? If yes, they can sponsor. If no, keep looking.</p>" },
          ] },
          { type: "statement", body: "A sponsor is the person who can make another executive’s priority list change without asking a favor. Everything else in this course depends on that person existing, in writing, in a role that outlasts them." },
          { type: "knowledgeCheck", id: "governance-accountability-resourcing-1-check", question: "Which arrangement most reliably keeps disability inclusion accountable through a change in leadership?", options: [
            { text: "A commissioner’s memo announcing the priority and naming a sponsor.", correct: false },
            { text: "Sponsorship written into a position description, outcomes in the performance plan, and a review item on a standing executive agenda.", correct: true },
            { text: "A volunteer committee of committed staff who meet monthly.", correct: false },
          ], feedbackCorrect: "Yes. Position description, performance plan and standing agenda are the three places turnover cannot erase.", feedbackIncorrect: "Memos and volunteers depend on the people who wrote or joined them. Accountability that survives turnover is written into roles, reviews and agendas." },
        ],
      },
      {
        id: "governance-accountability-resourcing-2",
        number: 2,
        title: "A governance structure that can move barriers",
        summary: "Design the steering committee, the accessibility lead and the unit champions, with the authority, compensation and workload each needs to do more than advise.",
        minutes: 12,
        learning: {
          objective: "Design a disability inclusion governance structure with a compensated steering committee, an accessibility lead with defined authority and budget, and unit champions with formal workload allocation.",
          takeaways: [
            "Disabled staff, service users and community members on the steering committee are doing skilled work and should be compensated or given protected time for it.",
            "An accessibility lead without budget or authority becomes a help desk; the role needs both.",
            "A champion whose accessibility work is on top of a full workload is a volunteer, and volunteers burn out.",
          ],
          evidence: "A completed sort of governance elements; a drafted governance charter for your own area.",
          appliedNextStep: "Ask finance and human resources how advisory members from outside the agency can be compensated and how internal members’ time can be protected, and record the answer in your charter.",
        },
        scenario: {
          context: "A division forms a disability inclusion steering committee. It invites three disabled employees and two people who receive services to join. Meetings are monthly, unpaid for the external members, and on top of regular duties for the employees. The agenda is set by the division director’s office. After four months, two of the five have stopped attending.",
          prompt: "What most needs to change?",
          options: [
            { label: "Meet less often so attendance is easier.", response: "Frequency is not the problem. The members are being asked to do skilled work for free, without influence over the agenda, and they have concluded that their time is not valued." },
            { label: "Compensate external members, give employee members protected time in their workload, and let the committee set part of its own agenda and see what happened to its recommendations.", response: "Compensation, time and influence are what distinguish a committee from a focus group. People stay when their work is paid for and visibly matters.", recommended: true },
            { label: "Replace the members who left with people who are more committed.", response: "This reads a structural failure as a personal one. The next members will leave for the same reasons unless the structure changes." },
          ],
        },
        transfer: {
          prompt: "Which part of the structure is weakest in your area: the committee, the lead or the champions?",
          options: ["Name what the weakest role is missing: authority, budget, compensation or time", "Identify which leader can supply it", "Put the fix in the charter and date it"],
        },
        blocks: [
          { type: "text", heading: "Four roles, and what each needs to be real", body: "<p>A recommended structure for an agency of this size has four parts. The <strong>executive sponsor</strong>, covered in lesson one, holds authority over the cross-functional barriers. A <strong>steering committee</strong> includes disabled staff, people who receive services and community representatives, and it needs three things to be more than an advisory audience: compensation or protected time for its members, influence over its own agenda, and a visible record of what happened to each recommendation. An <strong>accessibility lead or office</strong> provides expertise, sets technical standards, tests, trains and reviews, and needs defined authority to stop a launch or contract that fails the standard, plus a budget for testing tools, remediation and specialist help. <strong>Department-level champions</strong> carry the standards into daily work in each unit, and need a formal share of their workload assigned to it, with their supervisor’s agreement, or they are volunteers on borrowed time.</p><p>Compensating committee members is not a courtesy. Disabled people are routinely asked to explain barriers, review designs and relive bad experiences for free, and then thanked for their passion. Advisory work is skilled labor. External members should be paid at a rate the agency would pay any consultant, through whatever mechanism finance and procurement confirm is available; employee members should have the hours recognized in their workload and their performance plan. Where a person receives benefits that could be affected by payment, offer alternatives and let the person choose.</p><p>Authority for the accessibility lead is the piece most often left out. An office that can advise but not require becomes a help desk that is consulted after decisions are made. Write down what the lead can stop, what the lead must be consulted on before approval, and who hears an appeal when a program disagrees. Then fund it: a lead with a standard and no budget for testing and remediation can only write findings.</p>" },
          { type: "leaderMove", heading: "Pay for the advice you ask for", control: "You control whether disabled advisers are compensated and whether employees’ advisory hours are recognized in their workload.", failure: "Do not build a committee on unpaid labor from the people already most affected by the barriers. Do not accept a champion assignment that a supervisor has not agreed to protect.", next: "Confirm with finance and human resources this month how external advisers can be paid and how internal hours will be protected, and write both into the charter." },
          { type: "sorting", id: "governance-accountability-resourcing-2-sort", heading: "Which part of the structure is this?", categories: ["Executive sponsor", "Steering committee", "Accessibility lead", "Unit champion"], items: [
            { text: "Can require information technology to delay a launch that fails keyboard testing.", category: "Executive sponsor" },
            { text: "Sets the agency’s document and web accessibility standard and runs testing before release.", category: "Accessibility lead" },
            { text: "Includes people who receive services, paid for their time, who see what happened to each recommendation.", category: "Steering committee" },
            { text: "Has four hours a week in their workload to review their unit’s templates and answer colleagues’ questions.", category: "Unit champion" },
            { text: "Owns the outcome in a performance plan and reports to the commissioner and the board.", category: "Executive sponsor" },
            { text: "Holds the budget for remediation of high-use documents and specialist audits.", category: "Accessibility lead" },
          ] },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A one-page governance charter", summary: "The minimum a charter must state for the structure to function. Fill it for your own administration, division or board.", fields: [
            { label: "Sponsor", value: "Name and title; the functions the sponsor can direct; where the role appears in the position description and performance plan; the standing agenda where progress is reviewed." },
            { label: "Steering committee", value: "Membership including disabled staff, service users and community representatives; how external members are compensated and internal hours protected; who sets the agenda; how each recommendation and its outcome are recorded and published." },
            { label: "Accessibility lead", value: "The standards the lead maintains; what the lead can stop and must be consulted on; who hears an appeal; the budget for testing, remediation and specialist help." },
            { label: "Unit champions and review points", value: "One named champion per unit with the hours allocated and the supervisor’s agreement; the agreed review points at which the sponsor receives the progress summary and the committee reviews outcomes." },
          ], action: "Take the completed charter to each named person and record what they confirm or change before it is adopted." },
          { type: "flashcards", heading: "What makes each role real", cards: [
            { front: "Committee: compensation", back: "<p>External members paid at a consultant rate through a mechanism finance confirms; employee members with hours in their workload. Offer alternatives where payment could affect benefits.</p>" },
            { front: "Committee: influence", back: "<p>The committee sets part of its own agenda and sees, in writing, what happened to each recommendation and why. Without this it is a focus group.</p>" },
            { front: "Lead: authority", back: "<p>Written power to stop a noncompliant launch or contract, a required consultation point before approval, and a named appeal route.</p>" },
            { front: "Lead: budget", back: "<p>Testing tools, remediation of high-use documents, specialist audits and training. A standard with no money produces findings, not fixes.</p>" },
            { front: "Champion: workload", back: "<p>A formal share of hours, agreed by the supervisor and reflected in the performance plan. Otherwise the role is voluntary and ends when the volunteer is tired.</p>" },
          ] },
          { type: "knowledgeCheck", id: "governance-accountability-resourcing-2-check", question: "An accessibility office reports that programs consult it only after a system is built and that its findings are usually deferred. Which structural change addresses this most directly?", options: [
            { text: "Give the office a required consultation point before project approval and written authority to stop a launch that fails the standard, with an appeal route to the sponsor.", correct: true },
            { text: "Ask the office to send more reminders to project managers.", correct: false },
            { text: "Add the office’s findings to the public progress report so programs are embarrassed into acting.", correct: false },
          ], feedbackCorrect: "Yes. Authority placed early in the process, with a clear appeal route, changes when the office is consulted and what happens with its findings.", feedbackIncorrect: "Reminders and embarrassment are workarounds for missing authority. Write the consultation point and the stop power into the governance charter." },
        ],
      },
      {
        id: "governance-accountability-resourcing-3",
        number: 3,
        title: "Fund accessibility as a core operating expectation",
        summary: "Move access from exception-based spending into base budgets, and learn where the hidden costs of not doing so are already being paid.",
        minutes: 11,
        learning: {
          objective: "Build accessibility into base budgets as a core operating expectation and identify where exception-based spending currently hides the cost of access.",
          takeaways: [
            "Exception-based funding makes every access need a negotiation, which delays it and teaches people not to ask.",
            "The agency already pays for inaccessibility, in workarounds, parallel processes, retrofits and staff time; base funding moves that cost to where it can be managed.",
            "Finance leaders can see access in a budget only if it has lines: captioning and interpretation, remediation, testing, training and adviser compensation.",
          ],
          evidence: "One knowledge check; a list of the access costs currently paid by exception in your area.",
          appliedNextStep: "Ask finance for every access-related purchase in your area over the last review period that was approved by exception or from a discretionary line. Total it. That number is the start of your base-budget request.",
        },
        scenario: {
          context: "A finance director reviewing budget requests sees a new line for document remediation and live captioning in a division’s base budget. She asks why this should not stay as it has been: approved case by case when a specific need arises, which has kept costs low.",
          prompt: "As the division’s assistant commissioner, what is the strongest response?",
          options: [
            { label: "Agree to keep it case by case, since the current approach has been affordable.", response: "It looks affordable because the real costs are scattered: staff time on workarounds, delayed meetings, retrofits and the people who stopped asking. None of those appear on the line she is looking at." },
            { label: "Explain that case-by-case approval delays access by weeks, discourages requests, and hides costs the division is already paying in staff time, retrofits and parallel processes; a base line makes the cost visible and lower per use through standing contracts.", response: "This answers a finance question in finance terms: visibility, unit cost, predictability and avoided retrofit spend.", recommended: true },
            { label: "Say that accessibility is a legal requirement and the line is not negotiable.", response: "True and insufficient. It closes the conversation without helping the finance director see why the base line is the better financial decision, and it treats a partner as an obstacle." },
          ],
        },
        transfer: {
          prompt: "Which access costs in your area are paid by exception today?",
          options: ["List the purchases: captioning, interpretation, remediation, testing, adviser time", "Estimate the staff time spent on workarounds that a base line would remove", "Draft the base-budget lines and the standing contracts they would fund"],
        },
        blocks: [
          { type: "text", heading: "Exception funding is delay by design", body: "<p>When access is funded by exception, every request becomes a small negotiation: a manager has to find money, justify it and wait for approval. The captioning arrives after the meeting has been rescheduled. The remediated document arrives after the comment period closes. People learn that asking is slow and slightly embarrassing, so they stop, and the low volume of requests is then cited as evidence that a base line is unnecessary.</p><p>The agency is already paying for inaccessibility; the payments are simply scattered where finance cannot see them. Staff time spent reading notices aloud, maintaining parallel paper processes and answering calls that an accessible form would have prevented is a cost. Retrofitting a system after launch is a cost several times larger than building access in. Complaints, corrective action and delayed benefits are costs. A base budget for access does not create these costs; it collects them into lines that can be managed, contracted and reduced.</p><p>Finance leaders need lines, not principles. Standing contracts for captioning, interpretation and document remediation lower the unit cost and remove the approval delay. A testing and remediation line for information technology, a training line for human resources and communications, and a compensation line for advisers give each function money that already exists when the need arrives. That is what “core operating expectation” means in a budget: the money is there before anyone asks.</p>" },
          { type: "accordion", heading: "Base-budget lines to establish", items: [
            { title: "Communication access", body: "<p>Standing contracts for live captioning, sign language interpretation and alternative formats, drawn on without per-event approval. Owned by communications or the accessibility lead, available to every unit.</p>" },
            { title: "Digital testing and remediation", body: "<p>Testing tools, testing by disabled users, remediation of high-use documents and systems, and specialist audits. Owned by information technology and the accessibility lead.</p>" },
            { title: "Workplace accommodation", body: "<p>A central fund so an accommodation does not compete with a unit’s supply budget, with a response-time target attached. Owned by human resources.</p>" },
            { title: "Training and champions", body: "<p>Training for managers, content creators and procurement staff, and the workload hours allocated to unit champions. Owned by human resources and each unit leader.</p>" },
            { title: "Adviser compensation", body: "<p>Payment for external steering committee members and other disabled advisers at a professional rate, through a mechanism confirmed by finance and procurement.</p>" },
          ] },
          { type: "leaderMove", heading: "Put the money where the need arrives", control: "You control whether access is a line in the base budget with a standing contract behind it, or a request someone has to win each time.", failure: "Do not cite low request volume as evidence that a base line is unnecessary; low volume is what exception funding produces.", next: "Total the exception-approved access spending in your area from the last review period and submit it as the floor for a base line in the next budget cycle." },
          { type: "quote", text: "I stopped asking for captions for our unit meetings because every time it meant a form, a wait and a conversation about cost. So now the meetings are just inaccessible and nobody has to fill out a form.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "Answering the finance question", cards: [
            { front: "“Case by case has kept costs low”", back: "<p>It has kept one line low by moving costs into staff time, retrofits, parallel processes and unmet need. Ask for the whole picture, not the line.</p>" },
            { front: "“We get few requests”", back: "<p>Exception funding suppresses requests. Volume will rise when access is easy, and that rise is the unmet need becoming visible.</p>" },
            { front: "“Why a standing contract?”", back: "<p>Lower unit cost, no approval delay, predictable spend and one vendor relationship the accessibility lead can hold to a standard.</p>" },
            { front: "“Why central accommodation funding?”", back: "<p>So a manager never has to choose between an employee’s accommodation and the unit’s supplies, and so response time can be measured against a target.</p>" },
          ] },
          { type: "knowledgeCheck", id: "governance-accountability-resourcing-3-check", question: "Which statement best explains why accessibility belongs in base budgets rather than exception-based spending?", options: [
            { text: "Because exception funding is more expensive per request than base funding.", correct: false },
            { text: "Because exception funding delays access, discourages requests and scatters costs the agency is already paying into places finance cannot see or manage.", correct: true },
            { text: "Because auditors prefer base lines to discretionary spending.", correct: false },
          ], feedbackCorrect: "Yes. Delay, suppressed demand and hidden cost are the three reasons, and each is a finance argument as well as an access one.", feedbackIncorrect: "Per-request cost and auditor preference are side points. The core reasons are delay, suppressed requests and costs already being paid where nobody can manage them." },
        ],
      },
      {
        id: "governance-accountability-resourcing-4",
        number: 4,
        title: "Expectations for every business unit",
        summary: "Set specific, checkable expectations for procurement, information technology, human resources, communications, facilities and program operations, and know what each looks like when met.",
        minutes: 11,
        learning: {
          objective: "Set specific, checkable expectations for procurement, information technology, human resources, communications, facilities and program operations, and identify the evidence that each has been met.",
          takeaways: [
            "An expectation is checkable when it names a standard, an owner and the evidence that will show it was met.",
            "Each function has a small number of decisions that determine most of its access impact; expectations should target those.",
            "Unit expectations without a sponsor who reviews them become guidance, and guidance is optional.",
          ],
          evidence: "One knowledge check; a set of six unit expectations for your area, each with the evidence that will show it is met.",
          appliedNextStep: "Choose the function in your area with the largest access impact and write its expectation, owner and evidence. Put it on the next review agenda.",
        },
        scenario: {
          context: "A senior director issues a memo stating that all units are expected to “prioritize accessibility in their work.” At the next review, every unit reports compliance. The same review shows that a new intake form launched without testing, an accommodation request took nine weeks, and the newsletter is still an image-only file.",
          prompt: "What went wrong with the expectation?",
          options: [
            { label: "Units are not taking the memo seriously and need a stronger message.", response: "The units did what the memo asked, because the memo asked for nothing checkable. A stronger version of an unmeasurable expectation is still unmeasurable." },
            { label: "The expectation named no standard, owner or evidence, so every unit could report compliance truthfully while barriers continued; each function needs an expectation it can be checked against.", response: "This is the diagnosis. Specific expectations produce specific evidence, and specific evidence is what a review can act on.", recommended: true },
            { label: "Accessibility should be assigned to the accessibility office instead of to units.", response: "The accessibility office sets standards and tests; it cannot design the intake form, run the accommodation process or write the newsletter. The work lives in the units." },
          ],
        },
        transfer: {
          prompt: "Which of your unit expectations could a unit truthfully report as met while the barrier continued?",
          options: ["Rewrite it with a standard, an owner and the evidence", "Check whether the evidence can be produced without measuring any individual employee", "Add it to the progress summary for the next review point"],
        },
        blocks: [
          { type: "text", heading: "Checkable, not aspirational", body: "<p>An expectation is a promise the organization can verify. “Prioritize accessibility” cannot be verified, which is why every unit can report meeting it. “No public-facing form is launched until it passes keyboard and screen-reader testing, with the test record kept by the accessibility lead” can be verified, and the verification does not require judging anyone; it requires looking for a test record.</p><p>Each function has a few decisions that carry most of its access impact. For procurement it is what the solicitation requires and what the contract lets the agency enforce. For information technology it is what gets tested before release and what defaults are set. For human resources it is how long accommodation takes and whether managers know what to do. For communications it is whether templates are accessible at the source. For facilities it is the path of travel and the emergency plan. For program operations it is whether there is more than one way to apply, attend and be heard. Expectations aimed at these decisions change more than expectations aimed at everything.</p><p>Expectations also need a reader. A sponsor who reviews the evidence at agreed review points, asks about gaps and follows up is what turns an expectation into an operating norm. Without that, the most carefully written expectation becomes guidance, and guidance is what busy units set aside.</p>" },
          { type: "tabs", heading: "One checkable expectation per function", tabs: [
            { label: "Procurement", body: "<p><strong>Expectation:</strong> Every solicitation for technology, content or services that people will use names the accessibility standard, requires evidence of conformance, and includes remediation timelines and remedies in the contract.</p><p><strong>Evidence:</strong> The clause in the solicitation template and a record of conformance evidence reviewed before award.</p>" },
            { label: "Information technology", body: "<p><strong>Expectation:</strong> No system or major update reaches the public or staff until it passes keyboard, screen-reader and contrast testing, and captions and other access features are on by default.</p><p><strong>Evidence:</strong> A test record per release and the platform default settings, reviewed by the accessibility lead.</p>" },
            { label: "Human resources", body: "<p><strong>Expectation:</strong> Accommodation requests receive a decision within an agreed target, interim access is provided while a request is open, and every supervisor completes accommodation-process training.</p><p><strong>Evidence:</strong> Aggregate response times and training completion by role, never by named employee.</p>" },
            { label: "Communications", body: "<p><strong>Expectation:</strong> Templates for notices, newsletters, slides and forms are accessible at the source, and public documents are published as real text with headings, alt text and descriptive links.</p><p><strong>Evidence:</strong> Template review by the accessibility lead and a sample check of published documents at each review point.</p>" },
            { label: "Facilities", body: "<p><strong>Expectation:</strong> Every public meeting room and service location has a step-free route during all hours of use, an accessible restroom on the same floor, and an evacuation plan that accounts for people who cannot hear an alarm or use stairs.</p><p><strong>Evidence:</strong> A current access survey per location and the written evacuation plan.</p>" },
            { label: "Program operations", body: "<p><strong>Expectation:</strong> Every service offers more than one way to apply, attend and be heard, and staff scripts and instructions include how to offer and arrange access without requiring disclosure of a diagnosis.</p><p><strong>Evidence:</strong> The channel list per service and the current staff instructions.</p>" },
          ] },
          { type: "leaderMove", heading: "Demand evidence you can look at", control: "You control whether a unit reports compliance in a sentence or shows a test record, a template, a response time or a plan.", failure: "Do not accept “we prioritize accessibility” as a report. Do not let evidence requirements slide into measuring individual employees; the unit of evidence is the process.", next: "Rewrite the weakest unit expectation in your area so a stranger could check it, and ask for the evidence at the next review." },
          { type: "list", heading: "Signs an expectation is checkable", ordered: true, items: ["It names a standard, such as keyboard and screen-reader operability or accessible templates at the source.", "It names an owner by role, not by committee.", "It names the evidence that shows it was met, and that evidence is about a process or product, not a person.", "It states when the evidence is reviewed and by whom.", "A unit could fail it, and would know it had."] },
          { type: "flashcards", heading: "Vague expectation, checkable expectation", cards: [
            { front: "“Procurement will consider accessibility”", back: "<p>Checkable: every solicitation names the standard, requires conformance evidence and includes remediation remedies; the template and the pre-award review record are the evidence.</p>" },
            { front: "“Managers will support accommodations”", back: "<p>Checkable: decisions within an agreed target, interim access while open, all supervisors trained; aggregate response times and training completion by role are the evidence.</p>" },
            { front: "“Communications will be accessible”", back: "<p>Checkable: templates accessible at the source and public documents published as real text; template review and a sample check at each review point are the evidence.</p>" },
            { front: "“Facilities will be welcoming”", back: "<p>Checkable: step-free route during all hours of use, accessible restroom on the same floor, an evacuation plan for people who cannot hear an alarm or use stairs; the access survey and the plan are the evidence.</p>" },
          ] },
          { type: "knowledgeCheck", id: "governance-accountability-resourcing-4-check", question: "Which of these is a checkable expectation for a program operations unit?", options: [
            { text: "Staff will be welcoming to people with disabilities.", correct: false },
            { text: "Every service offers at least two ways to apply and to attend, and staff instructions describe how to arrange access without asking for a diagnosis; the channel list and instructions are reviewed at each review point.", correct: true },
            { text: "The unit will consider accessibility in all decisions.", correct: false },
          ], feedbackCorrect: "Yes. Standard, owner, evidence and review point are all present, and none of it measures an individual.", feedbackIncorrect: "Look for a standard, an owner, evidence and a review point. Welcome and consideration are hopes; channels and instructions can be checked." },
        ],
      },
      {
        id: "governance-accountability-resourcing-5",
        number: 5,
        title: "Reporting that leads to decisions",
        summary: "Specify the executive progress summary and the public-facing progress report, and make sure each review point ends in a decision rather than a presentation.",
        minutes: 8,
        learning: {
          objective: "Specify what an executive progress summary and a public-facing progress report should contain at agreed review points, and define the decision each review must produce.",
          takeaways: [
            "A progress summary exists to prompt decisions: fund, stop, reassign, escalate or close. A review that ends without one was a presentation.",
            "Report on processes, products and aggregate outcomes; never on individual employees or identifiable participants.",
            "A public-facing progress report, where appropriate, is how the agency shows communities what changed and what it still owes them.",
          ],
          evidence: "One knowledge check; a written list of the decisions your next review will be asked to make.",
          appliedNextStep: "Before your next review point, write the two or three decisions the progress summary should force and send them to the participants with the material.",
        },
        scenario: {
          context: "At an executive review, the accessibility lead presents a progress summary: percentage of new content tested before release is up, accommodation response time is flat at eight weeks, and three priority barriers from the last review remain open. The meeting runs long, the presentation is praised, and the group moves to the next topic.",
          prompt: "What should the sponsor have done?",
          options: [
            { label: "Thank the lead and ask for an updated progress summary at the next review point.", response: "This is what happened, and it is why the three barriers will still be open next time. The review consumed the information and produced nothing." },
            { label: "Turn each red item into a decision in the room: who owns the accommodation timeline and what changes by the next review, and for each open barrier, fund it, reassign it, escalate it or close it with a reason.", response: "A review point is a decision point. The progress summary’s job is to force those five verbs, and the sponsor’s job is to make sure they are used.", recommended: true },
            { label: "Ask human resources to explain why accommodation response time is flat.", response: "An explanation is a start, and it is not a decision. Ask for the explanation and then decide what changes, by when, and who owns it." },
          ],
        },
        transfer: {
          prompt: "What decisions did your last review point actually produce?",
          options: ["List them; if the list is empty, name what should have been decided", "Draft the decision questions for the next review and send them with the material", "Decide what the public-facing report will say about the items that stayed open"],
        },
        blocks: [
          { type: "text", heading: "Five verbs and a public account", body: "<p>An executive progress summary for disability inclusion should be small enough to read in a few minutes and pointed enough to force a decision. Each item should end in one of five verbs: fund, stop, reassign, escalate or close. If the sponsor leaves a review without having used at least one of them, the review was a presentation. The measurement course in this level goes into the indicators; here the point is what the reporting is for.</p><p>Report on processes, products and aggregate outcomes: test records, response times, template status, open barriers and their owners, participation and satisfaction by service. Never report on individual employees or identifiable participants. The purpose is to change systems, and reporting that could be read as scoring people will poison the feedback the system depends on.</p><p>Where appropriate, a recurring public-facing progress report tells communities what changed, what is still open and what the agency has committed to next. It is not a marketing document; its credibility comes from naming what is not yet fixed. Communities of disabled people, county and tribal partners and advocates read these closely, and a report that admits open items earns more trust than one that does not.</p>" },
          { type: "list", heading: "What the sponsor’s progress summary should show at each review point", items: ["Each priority barrier, its owner, its status and the decision requested.", "Accommodation response time against target, in aggregate.", "Share of new content and systems tested before release.", "Open recommendations from the steering committee and the response to each.", "Budget lines for access and how much of each has been used.", "The decisions made at the last review and whether they were carried out."] },
          { type: "leaderMove", heading: "End every review with a verb", control: "You control whether a review point closes with decisions recorded or with thanks for the presentation.", failure: "Do not let a red item carry over without a named owner and a change by the next review. Do not let the progress summary drift toward individual performance.", next: "Write the decision questions for your next review point now, and open the meeting with them." },
          { type: "flashcards", heading: "Fund, stop, reassign, escalate, close", cards: [
            { front: "Fund", back: "<p>The barrier is understood and the fix is costed; the decision is to pay for it from a named line by a named date.</p>" },
            { front: "Stop", back: "<p>A launch, contract or process fails the standard and will not proceed until it passes. The sponsor’s stop power exists for this moment.</p>" },
            { front: "Reassign", back: "<p>The barrier has an owner who lacks the authority or capacity to remove it. Move it to someone who has both and say so in the record.</p>" },
            { front: "Escalate", back: "<p>The barrier crosses a line the sponsor cannot direct. Take it to the commissioner with a specific request, not a status.</p>" },
            { front: "Close", back: "<p>The barrier is gone and someone has tested that it is, or the agency has decided with reasons not to act. Either way, write the reason down.</p>" },
          ] },
          { type: "statement", body: "A review point is a decision point. If the sponsor leaves without having funded, stopped, reassigned, escalated or closed something, the meeting was a presentation, and the barriers on the progress summary will be there next time." },
          { type: "knowledgeCheck", id: "governance-accountability-resourcing-5-check", question: "A steering committee member asks why the public-facing progress report lists three barriers as still open rather than presenting only what was fixed. Which answer reflects this course?", options: [
            { text: "Naming open items is how the report earns trust with the communities affected; a report that shows only successes is read as marketing.", correct: true },
            { text: "The open items are listed so the public can identify which staff are responsible.", correct: false },
            { text: "Open items are included because the agency is required to publish them.", correct: false },
          ], feedbackCorrect: "Yes. Credibility comes from honesty about what is not yet done, and the report never identifies individuals.", feedbackIncorrect: "The report exists to give communities an honest account of systems, not to name people or to satisfy a requirement. Open items are what make it believable." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Governance that can move a barrier",
    subtitle: "A one-page reminder for sponsors, finance leaders and senior directors",
    quote: "Authority, money and time, each written down with a name.",
    use: {
      purpose: "Check whether the structure around disability inclusion in your area can actually remove barriers, and see what is missing when it cannot.",
      remember: ["A sponsor can change another executive’s priorities; an endorser cannot.", "Committee members are doing skilled work: compensate external members and protect employees’ hours.", "Access belongs in base budgets with standing contracts; exception funding is delay by design.", "Every review point ends with a verb: fund, stop, reassign, escalate or close."],
      doNext: "Complete the one-page governance charter for your area and take it to each person it names.",
    },
    sections: [
      { heading: "The structure, checked", items: ["Sponsor: in the position description, the performance plan and a standing agenda; can direct information technology, procurement, human resources, communications, facilities and program operations.", "Steering committee: disabled staff, service users and community members; compensated or protected time; sets part of its agenda; sees what happened to each recommendation.", "Accessibility lead: written stop power and a required consultation point; a budget for testing, remediation and specialists.", "Unit champions: hours allocated with the supervisor’s agreement."] },
      { heading: "The budget, checked", items: ["Standing contracts for captioning, interpretation and alternative formats.", "A testing and remediation line for information technology.", "A central accommodation fund with a response-time target.", "Training hours and adviser compensation lines."] },
      { heading: "The review, checked", items: ["Each priority barrier has an owner, a status and a decision requested.", "Evidence is about processes and products, never individuals.", "Decisions from the last review are checked first.", "The public-facing progress report, where appropriate, names what is still open."] },
    ],
  },
  sources: [
    { title: "W3C Web Accessibility Initiative, Planning and Managing Web Accessibility", href: "https://www.w3.org/WAI/planning-and-managing/", note: "Guidance on sponsorship, responsibility, policy, budget and review for sustaining accessibility in an organization." },
    { title: "Section508.gov, Manage Accessibility Programs", href: "https://www.section508.gov/manage/", note: "Federal guidance on building and maturing an accessibility program with roles, policy and measurement." },
    { title: "ADA.gov, U.S. Department of Justice", href: "https://www.ada.gov/", note: "Obligations of state and local governments that a governance structure exists to meet." },
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Employer guidance on accommodation processes, including centralized funding and response practices." },
    { title: "U.S. Department of Labor, Office of Disability Employment Policy", href: "https://www.dol.gov/agencies/odep", note: "Policy resources on disability-inclusive workplaces, including organizational practices and leadership roles." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota guidance and technical assistance on accessibility and disability policy for public bodies." },
  ],
};

export default pack;
