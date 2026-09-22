import type { CoursePack } from "../../source-types";

// Disability Inclusion curriculum, Strategic leadership, module 1:
// The Leadership Case for Disability Inclusion.
const pack: CoursePack = {
  course: {
    id: "di-leadership-case-for-inclusion",
    indexNumber: 1120,
    seriesLabel: "Disability Inclusion · Strategic leadership",
    title: "The Leadership Case for Disability Inclusion",
    subtitle: "Connect disability inclusion to mission delivery, civil rights, workforce equity, risk, innovation and public trust, and see why goodwill alone cannot carry it.",
    scope: "For executive leaders, board members, commissioners, senior directors, policy leaders, procurement leaders, finance leaders and enterprise equity or accessibility sponsors. Participation in this program is voluntary and does not replace required training.",
    treatment: "Four short lessons with executive scenarios, flashcards, a sorting exercise and knowledge checks",
    duration: "45–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/equity-centered-leadership.jpg",
    coverAlt: "A woman sits at the head of a conference table with a notebook.",
    introTranscript: "This course opens the strategic leadership level of the disability inclusion curriculum. It makes the case a leader has to be able to make in their own words: that disability inclusion is how the agency delivers its mission, meets its civil rights obligations, keeps and grows its workforce, manages risk and earns public trust. It also explains why the goodwill of individual staff, however real, cannot substitute for systems, resources and accountability. You will leave able to state the case for your own area and to name the cross-functional decisions that only leaders can make.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain, in terms specific to your own area, how disability inclusion connects to mission delivery, civil rights, workforce equity, community experience, risk management, innovation and public trust.",
        "Distinguish individual goodwill from organizational capacity and identify which of systems, resources and accountability is missing in a given failure.",
        "Identify the cross-functional decisions in a disability access problem and name the leader who owns each one.",
        "Apply the estimate that about one in four adults in the United States has a disability to a planning assumption in your own program or workforce.",
        "Draft a one-paragraph leadership case for disability inclusion that a board, commissioner or budget office could act on.",
      ],
      evidence: [
        "Four knowledge checks with explanations of why an answer strengthens or weakens the leadership case.",
        "A sort of goodwill, systems, resources and accountability failures drawn from realistic agency situations.",
        "A drafted one-paragraph leadership case for your own area, with the cross-functional owners named.",
      ],
      appliedNextStep: "Write the one-paragraph case for your own division, administration, board or program and read it aloud at your next leadership meeting. Ask one question afterward: which of the decisions in it can only we make?",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Legal interpretation of civil rights obligations belongs with the agency's legal counsel, ADA coordinator and civil rights office; this course prepares a leader to ask the right questions, not to give legal advice.",
      toolkitQuestion: "Which people are already being kept out by this decision, and which leader owns the system that keeps them out?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "leadership-case-for-inclusion-1",
        number: 1,
        title: "Goodwill is not a system",
        summary: "See why kind, capable individual staff cannot deliver disability inclusion on their own, and learn the three things only an organization can supply.",
        minutes: 11,
        learning: {
          objective: "Distinguish individual goodwill from organizational capacity and identify which of systems, resources or accountability is missing in a given access failure.",
          takeaways: [
            "Goodwill is real and necessary, and it is the most common reason leaders believe a problem is already handled.",
            "Every durable access failure traces to a missing system, a missing resource or a missing owner, and often to all three.",
            "A leader’s job is to supply the three things individuals cannot: a default process, a budget line and an accountable name.",
          ],
          evidence: "A completed sort of twelve-word failure descriptions into goodwill, systems, resources and accountability; one knowledge check.",
          appliedNextStep: "Pick the most recent access complaint or accommodation delay you heard about. Write which of the three organizational supplies was missing and who could have provided it.",
        },
        scenario: {
          context: "A county eligibility office has a reputation for treating disabled applicants well. Two staff there are known for staying late to read notices aloud over the phone and for walking people through the online application. One of them retires and the other transfers. Within a month, complaints about missed deadlines from blind and low-vision applicants start to arrive at the ombudsman.",
          prompt: "As the senior director, what is the accurate description of what happened?",
          options: [
            { label: "The office lost two exceptional employees and needs to hire people like them.", response: "Hiring for kindness restores the workaround, not the access. The notices were never readable and the application was never accessible; two people were quietly absorbing the cost." },
            { label: "The office was relying on individual goodwill to cover a system that produced inaccessible notices and an inaccessible application, and the system is what has to change.", response: "This is the description a leader can act on. It names the barrier, the missing default and the missing owner, and it does not depend on who happens to be on staff next month.", recommended: true },
            { label: "Complaints rose because applicants became less patient after a staffing change.", response: "This places the problem with applicants. The deadlines were missed because information arrived in a form people could not read, which was true before the staffing change too." },
          ],
        },
        transfer: {
          prompt: "Where in your area does access depend on a particular person rather than a process?",
          options: ["Name the person and the task they quietly cover", "Write the default process that would make the task unnecessary", "Decide who owns that default and by when it exists"],
        },
        blocks: [
          { type: "text", heading: "What individuals can and cannot supply", body: "<p>Most leaders inherit a workforce full of decent people who help when they see someone struggling. That goodwill matters, and this course never asks you to discount it. The problem is what goodwill hides. When a staff member reads a notice aloud, reformats a document on their own time, or remembers which participant needs an interpreter, the organization records a success. The notice is still unreadable. The document template is still inaccessible. The interpreter is still not in the scheduling system. The next person, or the next office, starts from zero.</p><p>Three things only the organization can supply. A <strong>system</strong> is a default that works without anyone remembering: an accessible notice template, a scheduling field for communication needs, a procurement clause. A <strong>resource</strong> is money, time or staff that exists before the request: a captioning contract, a document-remediation budget, protected hours for an accessibility lead. <strong>Accountability</strong> is a named person whose performance conversation includes whether the barrier came down. Remove any one and the work returns to whoever happens to care that day.</p><p>The leadership test is simple. If the most conscientious person in a unit left tomorrow, would disabled applicants, participants and employees still get what they need? If the honest answer is no, the unit has goodwill and no capacity, and the fix is yours to make.</p>" },
          { type: "leaderMove", heading: "Ask what breaks when the helper leaves", control: "You control whether a unit’s access record is treated as evidence of a working system or as evidence of a person covering for a missing one.", failure: "Do not accept “we have never had a complaint” from a unit where one or two people are known to handle everything. Ask what would happen in their absence.", next: "At your next operations review, ask each unit leader to name one access task that currently depends on a specific person and to propose the default that replaces it." },
          { type: "sorting", id: "leadership-case-for-inclusion-1-sort", heading: "Goodwill, system, resource or accountability?", categories: ["Goodwill covering a gap", "Missing system", "Missing resource", "Missing accountability"], items: [
            { text: "A licensing specialist keeps a personal list of providers who need materials in large print.", category: "Goodwill covering a gap" },
            { text: "The notice template has no heading structure and is exported as an image.", category: "Missing system" },
            { text: "Interpreter requests wait because there is no standing contract and each request needs a purchase approval.", category: "Missing resource" },
            { text: "Three units say the web form is someone else’s problem and none has been told it is theirs.", category: "Missing accountability" },
            { text: "A supervisor pays for captioning out of a discretionary line because there is no budget for it.", category: "Missing resource" },
            { text: "A call center worker stays late to walk a caller through an application that cannot be completed by keyboard.", category: "Goodwill covering a gap" },
          ] },
          { type: "flashcards", heading: "Three supplies only an organization can make", cards: [
            { front: "System", back: "<p>A default that works without memory or heroics: templates, fields, clauses, checklists, standards. It removes the barrier for the next hundred people, not one.</p>" },
            { front: "Resource", back: "<p>Money, time and staff that exist before anyone asks. Access that has to be purchased one request at a time is access that arrives late.</p>" },
            { front: "Accountability", back: "<p>A named owner whose review includes the barrier. Shared responsibility with no name attached is how access items stay on a list for years.</p>" },
            { front: "The helper-leaves test", back: "<p>If the most conscientious person in the unit left tomorrow, would disabled people still get what they need? If not, the unit has goodwill and no capacity.</p>" },
            { front: "Why goodwill hides the gap", back: "<p>Every workaround is recorded as a success. Leaders see satisfied people and never see the unreadable notice that made the workaround necessary.</p>" },
          ] },
          { type: "quote", text: "People kept telling me how helpful the worker was. She was. But I should not have needed her to read my own eligibility notice to me over the phone, and when she left, nobody did.", cite: "Composite participant perspective, illustrative" },
          { type: "knowledgeCheck", id: "leadership-case-for-inclusion-1-check", question: "A division reports no accessibility complaints in the last two review periods. Which follow-up question best tests whether that reflects organizational capacity?", options: [
            { text: "Which staff are especially good with disabled participants, so we can recognize them?", correct: false },
            { text: "If the staff who currently handle access requests were reassigned, which defaults, budgets and owners would still be in place?", correct: true },
            { text: "How many disabled participants does the division serve?", correct: false },
          ], feedbackCorrect: "Yes. The question separates a working system from people covering for the lack of one, which is the leadership distinction this lesson teaches.", feedbackIncorrect: "Recognition and headcounts do not tell you whether access survives a staffing change. Ask what would still work if the helpers were gone." },
        ],
      },
      {
        id: "leadership-case-for-inclusion-2",
        number: 2,
        title: "Mission, civil rights and risk",
        summary: "Connect disability inclusion to what the agency exists to do, to the civil rights obligations that already bind it, and to the risks leaders are paid to manage.",
        minutes: 13,
        learning: {
          objective: "Explain how disability inclusion connects to mission delivery, civil rights obligations and risk management, using the agency’s own services as the examples.",
          takeaways: [
            "In a human services agency, disabled people are not a special population; they are a large share of the people the mission is for.",
            "The ADA, Section 504 and Olmstead are existing obligations, not aspirations, and a leader does not need to be a lawyer to know what they require in outline.",
            "Access failures are program risk, legal risk, financial risk and reputational risk at once; treating them as customer-service issues understates all four.",
          ],
          evidence: "A knowledge check on the relationship between mission and civil rights; a written list of three risks an identified access barrier creates in your area.",
          appliedNextStep: "Take one current access barrier you know about and write the mission consequence, the civil rights exposure and the operational risk in three sentences. Share it with the responsible leader.",
        },
        scenario: {
          context: "An administration is redesigning how people apply for waiver services. The project charter lists cost, timeline and fraud prevention as success criteria. A commissioner’s office review notes that the population applying for waiver services is, by definition, largely people with disabilities, and asks why accessibility is not a success criterion.",
          prompt: "How should the executive sponsor respond?",
          options: [
            { label: "Add a line that the vendor will follow accessibility best practices, and keep the criteria as they are.", response: "A line in a charter with no measure, owner or acceptance test is a hope, not a criterion. The risk stays exactly where it was." },
            { label: "Make accessibility a named success criterion with an acceptance standard, an owner and testing by disabled applicants before launch, because the project cannot deliver the mission or meet the agency’s obligations without it.", response: "This treats access as what it is here: the core of whether the redesign works at all. It also gives the finance and risk conversations something concrete to hold.", recommended: true },
            { label: "Note that applicants who cannot use the new process can continue using the paper form.", response: "A separate, slower path for disabled applicants is the outcome civil rights law was written to prevent. It also guarantees the new system will be measured as a success while excluding the people it was built for." },
          ],
        },
        transfer: {
          prompt: "Which of your current initiatives names cost and timeline as success criteria but not access?",
          options: ["Name the initiative and its executive sponsor", "Draft the accessibility success criterion with an acceptance standard", "Ask who will test it with disabled participants or employees before launch"],
        },
        blocks: [
          { type: "text", heading: "The mission is already about disabled people", body: "<p>The Centers for Disease Control and Prevention estimates that about one in four adults in the United States has a disability. In a human services agency the share is higher among the people served, because disability is closely tied to the reasons people need income support, health care, long-term services, housing help and protection. When a leader treats accessibility as an add-on for a small group, the planning assumption is wrong from the first page.</p><p>Civil rights obligations already bind the agency. Title II of the Americans with Disabilities Act covers state and local government services, programs and activities; Section 504 of the Rehabilitation Act covers programs that receive federal financial assistance, which in practice includes most of what DHS does; Title I of the ADA governs employment. The Supreme Court’s Olmstead decision and Minnesota’s Olmstead Plan commit the state to serving people with disabilities in the most integrated setting appropriate to them. A leader does not need to interpret these; the agency’s legal counsel, ADA coordinator and civil rights office do that. A leader does need to know that they exist, that they apply to ordinary decisions like a form redesign or a meeting format, and that ignorance of them is not a defense the agency can offer.</p><p>Risk follows directly. An inaccessible application is program risk, because eligible people do not get served. It is legal risk, because it invites complaints and findings. It is financial risk, because retrofits cost several times what building it right would have, and because delayed benefits often become more expensive later. It is reputational risk, because the people excluded talk to advocates, legislators and reporters. Leaders who file access under customer service are managing one risk and ignoring three.</p>" },
          { type: "accordion", heading: "Obligations in outline, for leaders", items: [
            { title: "ADA Title II: services, programs and activities", body: "<p>State and local governments must give people with disabilities an equal opportunity to benefit from all programs, services and activities, including communication that is as effective as communication with others. Web content and mobile applications are within scope. The ADA coordinator and legal counsel advise on specifics.</p>" },
            { title: "Section 504: federally assisted programs", body: "<p>Programs receiving federal financial assistance may not exclude or discriminate on the basis of disability. Because so much of DHS is federally assisted, Section 504 travels with the agency’s funding. The U.S. Department of Health and Human Services Office for Civil Rights enforces it for health and human services programs.</p>" },
            { title: "ADA Title I: employment", body: "<p>Employers must provide reasonable accommodation to qualified employees and applicants with disabilities unless doing so would be an undue hardship, and may not discriminate in hiring, advancement or terms of employment. Human resources and the accommodation office own the process; leaders own the culture around it.</p>" },
            { title: "Olmstead: the most integrated setting", body: "<p>The Olmstead decision found that unjustified segregation of people with disabilities is discrimination. Minnesota’s Olmstead Plan turns that into agency commitments across housing, employment, transportation, education and community life. Program decisions about where and how services are delivered sit inside it.</p>" },
          ] },
          { type: "leaderMove", heading: "Put access in the success criteria", control: "You control what a project charter counts as success, and therefore what the project team optimizes for.", failure: "Do not approve a charter for any public-facing or workforce-facing system whose success criteria omit access. A best-practices clause with no measure is not a criterion.", next: "Review the charters currently awaiting your signature and add an accessibility criterion with an acceptance standard and an owner before signing." },
          { type: "list", heading: "Four risks in one barrier", items: ["Program risk: eligible people are not served, or are served late, and outcomes worsen.", "Legal risk: complaints, investigations, findings and required corrective action, often with public reporting.", "Financial risk: retrofits, duplicate paper processes, staff time spent on workarounds, and costs that shift to more expensive services later.", "Reputational risk: the people excluded are connected to advocates, legislators, tribal and county partners and the press, and the story writes itself."] },
          { type: "flashcards", heading: "Numbers and names a leader should carry", cards: [
            { front: "About one in four", back: "<p>The CDC’s estimate of the share of adults in the United States with a disability. In human services populations the share is typically higher. Use it as the planning floor, not a ceiling.</p>" },
            { front: "Effective communication", back: "<p>The ADA Title II standard: communication with people with disabilities must be as effective as communication with others. It governs notices, websites, meetings and calls, not just interpreters.</p>" },
            { front: "Most integrated setting", back: "<p>The Olmstead standard. Services should be delivered in the setting most integrated into community life that is appropriate to the person. Minnesota has a standing plan to carry this out.</p>" },
            { front: "Who interprets the law", back: "<p>Legal counsel, the ADA coordinator and the civil rights office. A leader’s role is to know the obligations exist, ask early and fund the answer.</p>" },
          ] },
          { type: "knowledgeCheck", id: "leadership-case-for-inclusion-2-check", question: "A finance leader asks why accessibility should be funded in the base budget for a new benefits portal rather than handled by exception when someone needs it. Which answer best reflects this lesson?", options: [
            { text: "Because a large share of the people the portal exists to serve have disabilities, the agency already has civil rights obligations to them, and building access in costs less than retrofitting and running a parallel paper process.", correct: true },
            { text: "Because accessibility is a value the agency has publicly committed to.", correct: false },
            { text: "Because disabled applicants will complain if it is not accessible.", correct: false },
          ], feedbackCorrect: "Yes. Mission, obligation and cost together make the case in the language a budget office uses.", feedbackIncorrect: "Values and complaints are true but weak on their own. The strong case rests on who the portal is for, what the agency already owes them and what retrofitting costs." },
        ],
      },
      {
        id: "leadership-case-for-inclusion-3",
        number: 3,
        title: "Workforce, community experience and public trust",
        summary: "See disability inclusion as a workforce strategy, a driver of better service for everyone, and the basis of trust between the agency and the communities it serves.",
        minutes: 12,
        learning: {
          objective: "Explain how disability inclusion strengthens workforce equity, community experience, innovation and public trust, with examples from hiring, service design and communications.",
          takeaways: [
            "Disabled employees are already on staff, mostly without disclosing; the question is whether the workplace lets them do their best work and advance.",
            "Designs built for access tend to serve everyone better, from captioned meetings to plain-language notices to flexible appointment options.",
            "Trust is earned in the ordinary moments: a readable letter, a reachable phone line, a meeting people can join. It is lost the same way.",
          ],
          evidence: "One knowledge check; a written example from your own area where an access improvement also improved service or working conditions for others.",
          appliedNextStep: "Ask human resources what the agency knows, in aggregate and without identifying anyone, about accommodation response times and about whether disabled employees advance at the same rate as others. If the answer is “we do not know,” that is your first finding.",
        },
        scenario: {
          context: "A hiring panel for a supervisor position is discussing a strong internal candidate who has disclosed a disability and asked for interview questions in advance as an accommodation. One panel member says, “If they need the questions ahead of time, how will they handle the pace of the job?”",
          prompt: "As the director who chairs the panel, what do you do?",
          options: [
            { label: "Let the comment pass and score the candidate on the interview itself.", response: "Silence lets an assumption about the accommodation shape the evaluation. The comment is exactly the kind of assumption drawn from a disability that the process is supposed to exclude." },
            { label: "Name it: the accommodation is granted, it is not evidence about job performance, and the panel will score the candidate on the same criteria as everyone else. Then follow up with human resources on panel training.", response: "This protects the candidate, corrects the panel in the moment and treats the comment as a system signal, not a one-off.", recommended: true },
            { label: "Ask the candidate during the interview how they would manage a fast-paced role given their disability.", response: "This turns an accommodation into an interrogation about disability and is the kind of question human resources and the accommodation office would tell you not to ask." },
          ],
        },
        transfer: {
          prompt: "Where do your hiring, advancement or service design practices quietly filter out disabled people?",
          options: ["Review one position description for requirements that are not actually essential", "Ask which service channels are unusable without a mouse, a car or a phone call", "Find one place where an access improvement would help everyone, and make it the default"],
        },
        blocks: [
          { type: "text", heading: "Workforce equity, community experience, innovation and trust", body: "<p>Disabled employees are already in every division, most of them without having told anyone. Workforce equity asks whether the agency’s practices let them do their best work and advance at the same rate as others. The evidence to look at is aggregate and system-level: how long accommodation requests take, whether managers know how to respond, whether position descriptions list requirements that are not actually essential, and whether advancement rates differ. The Job Accommodation Network’s long-running employer research reports that most workplace accommodations cost nothing or little; the barrier is rarely money and usually process, delay and attitude.</p><p>Community experience improves when access is designed in. A plain-language notice is read correctly by more people. A meeting with captions helps people in noisy rooms, people whose first language is not English and people who process written words better than spoken ones. Flexible appointment options help parents, shift workers and rural residents as well as people with disabilities. This is why accessibility is a source of innovation rather than a constraint: designing for people the default process excluded usually produces a better default.</p><p>Public trust is built or spent in ordinary transactions. People judge the agency by whether the letter made sense, whether the phone line was reachable, whether the meeting could be joined. Disabled people and their families are a large and well-connected constituency, and their experience of the agency travels quickly to advocates, county and tribal partners and legislators. Leaders who want trust with those communities earn it in the design of the everyday.</p>" },
          { type: "tabs", heading: "Four lines of the case, with examples", tabs: [
            { label: "Workforce", body: "<p>An accommodation process with a response-time target and trained managers keeps skilled people. A position description that lists only essential functions widens the applicant pool. Both are leadership decisions, not human resources paperwork.</p>" },
            { label: "Community", body: "<p>A redesigned intake that works by keyboard, screen reader and phone reaches more eligible people and produces fewer errors and appeals. The people who could not use the old process were never counted as unmet demand.</p>" },
            { label: "Innovation", body: "<p>Captions, plain language, flexible scheduling and multiple channels began as access measures and became better defaults for everyone. Ask disabled staff and participants what does not work; the answers are a product roadmap.</p>" },
            { label: "Trust", body: "<p>Communities remember whether the agency built the meeting so they could attend or told them afterward that they could have asked. Trust with disability communities is earned in defaults and lost in exceptions.</p>" },
          ] },
          { type: "leaderMove", heading: "Treat the disclosure as data about the system", control: "You control how a hiring panel, a leadership team or a budget review responds when a disability or an accommodation enters the conversation.", failure: "Do not let an accommodation request become evidence about capability, and do not let a comment that treats it that way pass without correction.", next: "Ask human resources for aggregate, non-identifying information on accommodation response times and advancement, and put the answer on your next leadership agenda." },
          { type: "list", heading: "Signals a leader can request without identifying anyone", items: ["Time from accommodation request to decision and to delivery, in aggregate.", "Share of supervisors who have completed accommodation-process training.", "Whether position descriptions have been reviewed for non-essential requirements.", "Barrier reports and access complaints by service channel, not by person.", "Participation in agency meetings, surveys and events by access feature offered, not by who used it."] },
          { type: "flashcards", heading: "Language for the case", cards: [
            { front: "“Most accommodations cost little or nothing”", back: "<p>Consistent with the Job Accommodation Network’s employer research. The cost that matters is delay: weeks without a working tool, or a skilled employee who leaves.</p>" },
            { front: "“Unmet demand you never counted”", back: "<p>People who cannot use a process do not appear as failed attempts. They appear nowhere. Low disabled participation is evidence of a barrier, not of low need.</p>" },
            { front: "“A better default for everyone”", back: "<p>Captions, plain language, flexibility and multiple channels serve far more people than the group they were designed for. Use this when someone calls access a niche cost.</p>" },
            { front: "“Trust is built in defaults”", back: "<p>Communities judge the agency by whether access was planned or granted after the fact. The difference is visible to them every time.</p>" },
          ] },
          { type: "knowledgeCheck", id: "leadership-case-for-inclusion-3-check", question: "A program reports that few disabled people attend its community input sessions and concludes that disability access is a low priority for that program. What is the better conclusion?", options: [
            { text: "The program should invite disability organizations so attendance improves.", correct: false },
            { text: "Low attendance is more likely evidence that the sessions have barriers, and the program should examine format, location, materials and notice before drawing any conclusion about priority.", correct: true },
            { text: "The conclusion is reasonable because people who need access would have asked.", correct: false },
          ], feedbackCorrect: "Right. Absence is the usual signature of a barrier, and people who expect barriers do not come or ask.", feedbackIncorrect: "Invitations do not remove barriers, and waiting for requests measures who was willing to fight for access, not who needed it." },
        ],
      },
      {
        id: "leadership-case-for-inclusion-4",
        number: 4,
        title: "A cross-functional leadership responsibility",
        summary: "See why disability inclusion cannot belong to one office, name the leaders who own each part of a typical barrier, and write the case for your own area.",
        minutes: 12,
        learning: {
          objective: "Identify the cross-functional decisions inside a disability access problem, name the leader who owns each, and draft a one-paragraph leadership case for your own area.",
          takeaways: [
            "Almost every barrier crosses at least three functions, which is why it stays unresolved when one office is told to own it.",
            "The executive role is to convene the owners, set the standard and hold the decision, not to do the technical work.",
            "A written leadership case that names owners, obligations and cost is a tool other leaders can act on; a general commitment is not.",
          ],
          evidence: "One knowledge check; a drafted one-paragraph leadership case with the cross-functional owners named.",
          appliedNextStep: "Bring your paragraph to the next meeting of the leaders it names and ask each to confirm or correct their part.",
        },
        scenario: {
          context: "A recurring hybrid public meeting run by an administration has been criticized for inaccessible slides, a platform where captions are disabled by policy, and a building entrance that is step-free only through a side door that is locked after five. The administration has told its communications team to fix it.",
          prompt: "As the deputy commissioner, what is your read?",
          options: [
            { label: "Communications owns public meetings, so the assignment is correct; check back in a month.", response: "Communications can fix the slides. It does not control the platform policy, the building or the meeting schedule. The assignment guarantees a partial fix and a repeat complaint." },
            { label: "The barrier crosses communications, information technology, facilities and program operations. Convene those four leaders, set the standard the meeting has to meet, assign each their part with a date, and review it together.", response: "This is the cross-functional move. The executive supplies the standard, the convening and the accountability; each function supplies its own fix.", recommended: true },
            { label: "Move the meeting fully online so the building is no longer a problem.", response: "This trades one set of barriers for another, leaves the captions policy and slides untouched, and removes an option that some participants depend on." },
          ],
        },
        transfer: {
          prompt: "Which leaders would have to be in the room to remove the barrier you identified in lesson two?",
          options: ["List the functions the barrier touches and the leader of each", "Write the standard the fixed process must meet in one sentence", "Set a date to bring them together and put it on the calendar"],
        },
        blocks: [
          { type: "text", heading: "Why one office cannot own it", body: "<p>Take an ordinary barrier: a benefits notice that blind applicants cannot read. The template belongs to communications or a program office. The system that generates it belongs to information technology. The vendor contract that constrains the format belongs to procurement. The staff who answer the resulting calls report to operations. The complaint lands with the civil rights office. The budget to fix any of it sits with finance. Told that “accessibility” owns the notice, each of these functions will reasonably wait for the accessibility office to act, and the accessibility office, with no authority over any of them, will write memos.</p><p>This is the structural reason disability inclusion is a leadership responsibility rather than a program. Only an executive can convene the owners, set the standard the result must meet, assign each function its part, and keep the item on the agenda until it is done. The accessibility office supplies expertise and testing; human resources supplies the accommodation process; legal counsel supplies interpretation. None of them can make the finance director fund a remediation line or the chief information officer change a platform default. You can.</p><p>The written leadership case is the instrument for this. One paragraph that names who is affected, what the agency owes them, what it costs to act and not to act, and which leader owns which decision gives every function something to respond to. General commitments produce agreement and no movement; a paragraph with names produces a meeting.</p>" },
          { type: "list", heading: "Who typically owns what in a single barrier", ordered: false, items: ["Program operations: the process design, the staff instructions, the participant experience.", "Information technology: platforms, defaults, testing tools and technical standards.", "Procurement: contract requirements, vendor evaluation and remediation clauses.", "Human resources: the accommodation process, manager training and hiring practice.", "Communications: templates, plain language, documents, meetings and public notices.", "Facilities: routes, entrances, rooms, signage and evacuation.", "Finance: base-budget lines for access, not exception-based spending.", "Legal counsel, the ADA coordinator and civil rights: obligations, complaints and corrective action."] },
          { type: "leaderMove", heading: "Convene, set the standard, hold the decision", control: "You control who is in the room, what standard the result must meet and whether the item stays on the agenda until it is done.", failure: "Do not assign a cross-functional barrier to a single office and call it delegated. Do not accept a status of “in progress” without a date and an owner for each function’s part.", next: "For the barrier you identified earlier in this course, schedule the cross-functional meeting and open it with the standard the result has to meet." },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A one-paragraph leadership case", summary: "The paragraph a board, commissioner or budget office can act on. Fill it with your own area’s facts; keep it to one paragraph.", fields: [
            { label: "Who is affected", value: "Name the group and the scale: for example, applicants for waiver services, most of whom have disabilities, and the roughly one in four adults in any workforce or public who has a disability." },
            { label: "What we owe them", value: "Name the obligations in outline: ADA Title II and Section 504 for services, ADA Title I for employment, Olmstead for integrated settings. Note that legal counsel and the ADA coordinator advise on specifics." },
            { label: "What it costs to act and not to act", value: "State the base-budget line required and the cost of retrofits, parallel processes, complaints and unserved eligible people if the agency waits." },
            { label: "Who owns which decision", value: "Name the leader for program, technology, procurement, human resources, communications, facilities and finance, and the date each will report." },
          ], action: "Read the paragraph aloud at your next leadership meeting and ask each named leader to confirm or correct their part." },
          { type: "flashcards", heading: "The executive’s three verbs", cards: [
            { front: "Convene", back: "<p>Bring every function the barrier touches into one conversation. Barriers survive when each owner is waiting for another.</p>" },
            { front: "Set the standard", back: "<p>Say what the fixed result must do: usable by keyboard and screen reader, captions on by default, a step-free route during all meeting hours. The standard is what each function builds toward.</p>" },
            { front: "Hold the decision", back: "<p>Keep the item on the agenda with a name and a date beside each part until the barrier is gone and someone has tested that it is.</p>" },
            { front: "What not to do", back: "<p>Do not do the technical work, and do not hand the whole thing to the one office with the least authority over the others.</p>" },
          ] },
          { type: "knowledgeCheck", id: "leadership-case-for-inclusion-4-check", question: "Which statement best describes the executive role in removing a barrier that spans several functions?", options: [
            { text: "Assign the barrier to the accessibility office, which has the expertise, and ask for a report at the agreed review point.", correct: false },
            { text: "Convene the leaders of every function the barrier touches, set the standard the result must meet, assign each their part with a date, and keep it on the agenda until it is tested and done.", correct: true },
            { text: "Ask the communications team to draft a public commitment to accessibility.", correct: false },
          ], feedbackCorrect: "Yes. Convene, set the standard, hold the decision. The expertise comes from the accessibility office; the authority comes from you.", feedbackIncorrect: "Expertise without authority produces memos, and commitments without owners produce agreement. The executive supplies the convening and the accountability." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Making the leadership case",
    subtitle: "A one-page reminder for executives, board members and senior directors",
    quote: "Goodwill is real. Systems, resources and accountability are what leaders add.",
    use: {
      purpose: "Keep the case for disability inclusion ready in the language of mission, obligation, risk and ownership, so it can be made in any budget, board or planning conversation.",
      remember: ["About one in four adults has a disability; in human services populations the share is higher. Plan from that floor.", "ADA Title II, Section 504, ADA Title I and Olmstead already apply to ordinary decisions; legal counsel and the ADA coordinator interpret them.", "A barrier is program, legal, financial and reputational risk at once.", "Nearly every barrier crosses several functions; the executive convenes, sets the standard and holds the decision."],
      doNext: "Write the one-paragraph case for your area, with owners named, and read it at your next leadership meeting.",
    },
    sections: [
      { heading: "Questions to ask in any review", items: ["If the most conscientious person in this unit left, would disabled people still get what they need?", "Does this project’s charter name access as a success criterion with an acceptance standard and an owner?", "Who is not appearing in our participation numbers, and what barrier explains it?", "Which functions does this barrier touch, and is each leader in the room?"] },
      { heading: "The case in four lines", items: ["Mission: a large share of the people we serve have disabilities.", "Obligation: the agency already owes them equal access and integrated settings.", "Cost: building access in costs less than retrofits, parallel processes and unserved eligible people.", "Ownership: program, technology, procurement, human resources, communications, facilities and finance each have a named part."] },
      { heading: "What to stop accepting", items: ["“We have never had a complaint” from a unit where one or two people handle everything.", "A best-practices clause in place of a measurable criterion.", "A cross-functional barrier assigned to a single office.", "Low disabled participation read as low need."] },
    ],
  },
  sources: [
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Definition of disability inclusion and the estimate that about one in four adults in the United States has a disability." },
    { title: "ADA.gov, U.S. Department of Justice", href: "https://www.ada.gov/", note: "Official information on the Americans with Disabilities Act, including state and local government obligations under Title II." },
    { title: "U.S. Department of Health and Human Services, Office for Civil Rights", href: "https://www.hhs.gov/civil-rights/", note: "Section 504 and related civil rights obligations for health and human services programs." },
    { title: "Minnesota Department of Human Services, Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota’s commitments to serving people with disabilities in the most integrated setting appropriate to them." },
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Employer guidance and research on workplace accommodations, including findings that most accommodations cost little or nothing." },
    { title: "U.S. Equal Employment Opportunity Commission", href: "https://www.eeoc.gov/", note: "Employment obligations under ADA Title I, including reasonable accommodation and hiring practice." },
  ],
};

export default pack;
