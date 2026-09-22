import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Complex systems · Module 20: Tribal sovereignty and state responsibilities.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
// Engagement with Tribal Nations is led by the DHS Office of Indian Policy and the DHS offices that handle
// tribal relations and consultation. This module prepares staff to notice and route; it does not speak for any Nation.
const pack: CoursePack = {
  course: {
    id: "ipe-20-tribal-sovereignty",
    indexNumber: 1162,
    seriesLabel: "Intercultural Practice and Equity · Complex systems",
    title: "Tribal Sovereignty and State Responsibilities",
    subtitle: "Tribal Nations are sovereign governments, and the state's relationship with them is government to government. Four lessons on what that means for a state employee, why consultation is a duty that DHS offices lead, how to notice Tribal implications early in a project, and where to take them.",
    scope: "For internal DHS and DSD staff whose work shapes policy, programs, oversight, communications, contracts, data and evaluation. Policy and program staff and data, research and evaluation staff will find the deeper material here; executive and senior leaders can use it as a starting point. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception. This module is not the state's Tribal-state relations training and does not stand in for it, and it is not a substitute for formal consultation. It does not speak for any Tribal Nation and does not describe any Nation's culture, beliefs or internal affairs. Engagement with Tribal Nations is led by the DHS Office of Indian Policy and the DHS offices that handle tribal relations and consultation.",
    treatment: "Four short lessons with Minnesota public-administration examples, scenarios, sorting and flashcard practice, private reflection prompts, and a first-look check for Tribal implications you can copy into your own project work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/teams-in-minimization.jpg",
    coverAlt: "A government team sits around a conference table.",
    introTranscript: "Minnesota is home to eleven federally recognized Tribal Nations, each with its own elected government, and the state's relationship with them is government to government. This module is about what that means for a state employee doing ordinary public-administration work: writing a policy, redesigning a program, letting a contract, planning an evaluation. It covers why a Tribal Nation belongs in a different category than a community partner, what consultation actually requires of an agency, why late engagement fails no matter how well it is written, and how to run a short first-look check on your own project and hand the question to the DHS offices that lead this work. It does not speak for any Tribal Nation, does not describe any Nation's culture or internal affairs, and does not stand in for formal consultation or for the state's Tribal-state relations training. Nothing here is scored, ranked or collected, and the reflection prompts are yours alone.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain why a Tribal Nation is a sovereign government rather than a cultural community, a service population or a stakeholder group, and name what the state's relationship with Tribal governments rests on.",
        "Describe what consultation requires of a state agency, what it is not, and which DHS offices lead it.",
        "State plainly where your own responsibility begins and ends, including what no staff member should do alone.",
        "Identify the point in a project's life after which engagement can no longer change the outcome, and at least four signals that a project may have Tribal implications.",
        "Complete a first-look check for Tribal implications on one real project and route it before the open decision closes.",
      ],
      evidence: [
        "A sorting exercise that separates government-to-government work from staff learning, individual service and public communication.",
        "A knowledge check in every lesson with feedback that explains the accurate answer.",
        "A completed first-look check naming the open decision, its closing date, the signals and the route.",
      ],
      appliedNextStep: "Take one live project, write down the last date its outcome can still change, run the first-look check, and send it to the DHS office that leads tribal relations before that date.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "Change in Minnesota statute or executive direction on state agency consultation with Tribal governments",
        "Change in DHS tribal consultation policy, in the designated Tribal liaison role, or in which DHS offices lead tribal relations",
        "Direction from the DHS Office of Indian Policy or the DHS offices that handle tribal relations that any framing, example or routing step in this module is wrong or out of date",
      ],
      relatedDoor: "Formal consultation and any contact with a Tribal Nation are led by the DHS Office of Indian Policy and the DHS offices that handle tribal relations and consultation; this module prepares you to recognize and route the question, it does not authorize you to carry it.",
      toolkitQuestion: "At what point in this project could a Tribal government still change the outcome, and have we reached the office that leads that conversation before that point passes?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-20-1",
        number: 1,
        title: "Sovereignty is a legal relationship, not a cultural category",
        summary: "Why Tribal Nations belong in a different category than community partners, what the relationship rests on, and the four ideas state staff most often blend together.",
        minutes: 11,
        learning: {
          objective: "Explain in a work conversation why a Tribal Nation is a government rather than a cultural community, and name what the state's relationship with Tribal governments rests on.",
          takeaways: [
            "Minnesota is home to eleven federally recognized Tribal Nations with their own elected governments. State law directs agencies to accord Tribal governments the same respect accorded to other governments, and it names the Department of Human Services among those agencies.",
            "The relationship rests on the Constitution of the United States, treaties, statutes, case law and agreements between governments. It is legal and political, not a matter of culture, demographics or outreach preference.",
            "Four ideas get blended together: sovereignty, culture, the Native American Minnesotans a program serves, and general public outreach. Only the first is government-to-government work, and at DHS it is led by the Office of Indian Policy and the offices that handle tribal relations and consultation.",
            "This module does not speak for any Tribal Nation and does not describe any Nation's culture, beliefs or internal affairs. Those belong to the Nations themselves.",
          ],
          evidence: "A scenario about how a policy team classifies Tribal Nations in a stakeholder plan, a sorting exercise that separates four kinds of work, and a knowledge check on what the relationship rests on.",
          appliedNextStep: "Open the stakeholder or engagement section of one live project document and check whether a Tribal government appears there at all, and in what category.",
        },
        scenario: {
          context: "A DSD policy team is building the stakeholder plan for a revision to provider standards. The draft lists “Tribal communities” in the same section as advocacy organizations, county associations and family councils, with a note to “include cultural perspectives during the comment period.”",
          prompt: "What is the accurate correction to make before this plan goes any further?",
          options: [
            { label: "Leave the section as it is and add a short cultural-competence paragraph so the plan shows respect for Tribal culture.", response: "Respect is not the problem; classification is. Placing Tribal Nations among advocacy and association groups treats governments as interest groups, and a paragraph about culture does not change where the plan puts them, when they are reached, or how much of the decision is still open when they are." },
            { label: "Move Tribal Nations out of the stakeholder list, record in the project file that the revision may have Tribal implications, and take that question to the DHS offices that lead tribal relations before the comment period is designed.", response: "Correct. Tribal Nations are governments, and the state's relationship with them is government to government, led at DHS by the Office of Indian Policy and the offices that handle tribal relations and consultation. Your job is to notice early and route it, not to design the engagement yourself.", recommended: true },
            { label: "Ask a colleague who is a member of a Tribal Nation to review the plan and speak for the Tribal perspective.", response: "No individual employee speaks for a Tribal Nation, and asking a colleague to try puts an unfair and inaccurate load on them. A Nation speaks through its own government, in a process the responsible DHS offices lead." },
          ],
        },
        transfer: {
          prompt: "Where in your own work is a Tribal Nation currently listed as a community, a population or an audience rather than as a government?",
          options: [
            "Find one plan, template or distribution list where the classification is wrong and write down the correct one",
            "Note the decision that list feeds, and how early a Nation would have to be reached to affect it",
            "Write the question you would take to the DHS offices that lead tribal relations, in one sentence",
          ],
        },
        blocks: [
          { type: "text", heading: "Governments, not a line on a stakeholder list", body: "<p>Tribal Nations are sovereign governments. That sentence is not a courtesy and it is not a cultural observation. It describes a legal and political relationship between the United States, the state of Minnesota and each Tribal government, built from the Constitution of the United States, treaties, statutes, case law and agreements between governments.</p><p>Minnesota is home to eleven federally recognized Tribal Nations, each with its own elected officials. Minnesota law says the state acknowledges and supports their unique status and their right to existence, self-governance and self-determination, and it directs state agencies to accord Tribal governments the same respect accorded to other governments. The Department of Human Services is one of the agencies that law names.</p><p>For a state employee the practical effect is a change in category, not a change in tone. A Tribal Nation is not an advocacy organization, a cultural community, a service population or an audience for a communications plan. It is a government with its own laws, its own programs and its own authority over what happens on its own lands. When a DHS project reaches that authority, the right move is not a warmer invitation. It is to reach the DHS offices that lead government-to-government work before the shape of the project is set.</p>" },
          { type: "statement", body: "This module is about state-employee responsibilities: noticing when a Tribal government has a stake in what you are doing, and getting that question to the right DHS office early enough to matter. It does not speak for any Tribal Nation, does not describe any Nation's culture, beliefs or internal affairs, and does not stand in for formal consultation or for the state's Tribal-state relations training." },
          { type: "tabs", heading: "Four ideas that get blended together", tabs: [
            { label: "Sovereignty", body: "<p>A Tribal Nation governs itself. It makes and enforces its own laws, runs its own programs, and decides what happens on its lands. The state's relationship with that government is government to government, and at DHS it is led by the Office of Indian Policy and the offices that handle tribal relations and consultation.</p>" },
            { label: "Culture", body: "<p>Culture, language and practice belong to each Nation and to its members. This program does not describe them, and neither should your project documents. If cultural learning is part of your own development, take it from the Nations and from the offices that offer it, not from a summary written by a state work group.</p>" },
            { label: "The people a program serves", body: "<p>Native American Minnesotans are members of the public and are owed the same accurate, timely, accessible service as anyone else. Minnesota law is explicit that nothing about the consultation duty reduces the state's duties to individual Minnesotans, including those of Native American descent. Serving a person well is not consultation, and consultation is not a substitute for serving a person well.</p>" },
            { label: "Outreach", body: "<p>Outreach is what an agency does to reach the general public: notices, meetings, plain-language materials, comment periods. A Tribal government may take part in a public process, and that participation never replaces consultation. Sending a Nation the same survey link you sent to everyone is communication, not government-to-government work.</p>" },
          ] },
          { type: "leaderMove", heading: "Fix the category before you plan anything else", control: "You control how your own project documents classify a Tribal Nation: as a government, or as one more line in a stakeholder table.", failure: "Do not solve a misclassification by adding warmer language to the same list. The list itself is the problem, because it drives timing, invitations and who is asked what.", next: "Before your next planning meeting, read the engagement section of one live project document and say out loud which category it puts a Tribal government in." },
          { type: "sorting", id: "ipe-20-1-sort", heading: "Which kind of work is this?", categories: ["Government-to-government work, led by the responsible DHS office", "Staff learning, through approved training", "Service to an individual Minnesotan", "General public communication"], items: [
            { text: "A proposed DSD policy change would apply to services delivered on Tribal lands.", category: "Government-to-government work, led by the responsible DHS office" },
            { text: "A new reporting requirement would apply to programs a Tribal Nation operates.", category: "Government-to-government work, led by the responsible DHS office" },
            { text: "A grant program is being redesigned and one funding route runs to Tribal governments.", category: "Government-to-government work, led by the responsible DHS office" },
            { text: "A person who is an enrolled member of a Tribal Nation applies for a waiver and needs the same accurate, timely eligibility decision as anyone else.", category: "Service to an individual Minnesotan" },
            { text: "You want to complete the state's Tribal-state relations training before your next project begins.", category: "Staff learning, through approved training" },
            { text: "A program is drafting a plain-language notice for every household in a county.", category: "General public communication" },
          ] },
          { type: "flashcards", heading: "Foundations to keep in reach", cards: [
            { front: "What is a Tribal Nation, for work purposes?", back: "<p>A sovereign government with its own laws, programs, lands and elected officials. Not a cultural community, not an advocacy group, not a service population, not an audience.</p>" },
            { front: "What does the relationship rest on?", back: "<p>The Constitution of the United States, treaties, statutes, case law and agreements between governments. Legal and political, not discretionary and not a matter of goodwill.</p>" },
            { front: "How many Tribal Nations are in Minnesota?", back: "<p>Eleven federally recognized Nations, each with its own elected government. They are separate governments and do not speak for one another.</p>" },
            { front: "Who leads this work at DHS?", back: "<p>The Office of Indian Policy and the DHS offices that handle tribal relations and consultation. Staff notice and route; those offices lead.</p>" },
            { front: "Can a colleague speak for a Nation?", back: "<p>No. No employee, work group or advisory body speaks for a Tribal government. A Nation speaks through its own government.</p>" },
          ] },
          { type: "knowledgeCheck", id: "ipe-20-1-check", question: "A program manager asks why a Tribal Nation cannot simply be added to the project's community advisory group like any other partner. Which answer is accurate?", options: [
            { text: "An advisory seat is fine as long as the Nation is invited early and the seat is compensated.", correct: false },
            { text: "A Tribal Nation is a government, and the state's relationship with it is government to government; an advisory seat is not consultation, and the process is led by the DHS offices responsible for tribal relations.", correct: true },
            { text: "It depends on the size of the project; small projects can use an advisory seat and large ones need consultation.", correct: false },
          ], feedbackCorrect: "Yes. The category decides the process. A Nation may take part in many things and still not have been consulted, and the route runs through the offices that lead this work.", feedbackIncorrect: "Start with what a Tribal Nation is rather than with how big the project is. A government's participation is arranged government to government, through the DHS offices that lead it." },
          { type: "statement", body: "A private reflection, for you alone and never collected: how might my role, my authority and my assumptions be shaping the category I have put a Tribal Nation in, and what would change in this project if I had that category right from the start?" },
        ],
      },
      {
        id: "ipe-20-2",
        number: 2,
        title: "Consultation is a duty, and it is led",
        summary: "What government-to-government consultation requires of a state agency, what it is not, who at DHS leads it, and what an ordinary staff member is actually responsible for.",
        minutes: 11,
        learning: {
          objective: "Describe what consultation with a Tribal government requires in state practice, and state plainly what your own part is and where it stops.",
          takeaways: [
            "Minnesota law directs agencies to build Tribal consultation policies in consultation with Tribal governments, to consult the governing body of each Nation on matters with Tribal implications, and to carry what they hear into the decision itself.",
            "Coordinating with a body that represents several Nations is encouraged and does not satisfy the duty. Each Nation is its own government and is consulted on matters that affect it.",
            "A notice is not input, input is not consultation, and a public comment period is not consultation. Consultation is government to government, and at DHS it is led by the Office of Indian Policy and the offices that handle tribal relations.",
            "Each agency designates a Tribal liaison as the principal point of contact, and state law directs staff whose work is likely to include matters with Tribal implications to complete Tribal-state relations training. This voluntary module is not that training.",
          ],
          evidence: "A scenario about a project team that sends a notice and records it as consultation, an accordion separating five things people call consultation, and a knowledge check on whose duty it is.",
          appliedNextStep: "Write the sentence you would send to the DHS office that leads tribal relations for one project you are on: what the project is, what decision is still open, and when it closes.",
        },
        scenario: {
          context: "A DSD program team is changing how a service is authorized. Three weeks before the change takes effect, a project coordinator emails a summary to every partner list she has, including addresses she found for Tribal health and human services programs, and writes in the project file: “Tribal consultation complete.”",
          prompt: "What is wrong here, and what should happen next?",
          options: [
            { label: "Nothing is wrong. Every affected party received the same information at the same time, which is consistent and fair.", response: "Consistency across partner lists is the wrong measure. A mass email is notification, not consultation; it reached program employees rather than a Tribal government; and it arrived after the decision was effectively closed. The project file now records something that did not happen." },
            { label: "Correct the project file, tell the DHS office that leads tribal relations what went out and when the change takes effect, and ask what this change requires and whether the timeline can still move.", response: "Right. Fix the record first, because an inaccurate record is its own harm and it will be believed later. Then bring the timing problem to the office that leads this work while something can still change. You are not repairing the relationship yourself; you are giving the people who hold it accurate facts early enough to act.", recommended: true },
            { label: "Send a second, warmer email directly to Tribal chairs, apologizing and inviting comment within the three weeks.", response: "Direct contact with Tribal officials is not an individual staff member's to start, and a short deadline attached to an apology is still a closed decision. Route it instead." },
          ],
        },
        transfer: {
          prompt: "Think about the last time your team recorded that a group was consulted or engaged. What actually happened?",
          options: [
            "Find one project record that uses the word consultation and check what it describes",
            "Name who was contacted, at what level of government, and how much of the decision was still open that day",
            "Correct the record if it overstates what happened, and tell the people who rely on it that you did",
          ],
        },
        blocks: [
          { type: "text", heading: "What the duty actually asks of an agency", body: "<p>In state administration, consultation is a specific thing with a specific shape. Minnesota law directs each named agency, including the Department of Human Services, to build Tribal consultation policies in consultation with Minnesota Tribal governments, to keep those policies current, and to designate a Tribal liaison who can meet directly and regularly with the commissioner. The duty runs to the governing body of each individual Nation, and the law says plainly that coordinating with a body that has representation from several Nations is encouraged but does not satisfy it.</p><p>The law also addresses timing. Agencies consult with each Nation at least annually, and as often as matters with Tribal implications require. On legislative and fiscal matters, consultation is meant to happen early enough for a Nation's priorities to shape what the agency proposes, rather than after the proposal is written. Agencies are directed to consider what they hear in their decisions, with the goal of reaching solutions that work for both governments.</p><p>None of that is a single staff member's job, and reading about it here does not make it yours. At DHS this work is led by the Office of Indian Policy and the offices that handle tribal relations and consultation. Your part is smaller and still important: notice that a matter may have Tribal implications, say so in writing while the decision is open, and hand it to the people who lead it. Doing that early, and doing it accurately, is most of what the rest of this module teaches.</p>" },
          { type: "accordion", heading: "Five things people call consultation", items: [
            { title: "Sending a notice", body: "<p>Telling a Nation what has been decided. Often necessary, sometimes required, and not consultation. If the only thing a Nation can do with your message is read it, you have notified.</p>" },
            { title: "Opening a public comment period", body: "<p>A public process open to everyone. A Tribal government may take part, and that participation does not replace the government-to-government process. Two things can be true at once: the comment period was fair, and consultation did not happen.</p>" },
            { title: "Talking with Tribal program staff", body: "<p>Working conversations between program people are ordinary and often useful. They are not consultation with a Tribal government, and it is not fair to treat a program employee's comments as though they bind their Nation.</p>" },
            { title: "Briefing a body that several Nations sit on", body: "<p>Minnesota law encourages coordination with bodies such as the Minnesota Indian Affairs Council or the Minnesota Chippewa Tribe, and states directly that this does not satisfy an agency's duty to consult individual Tribal governments on matters with Tribal implications.</p>" },
            { title: "Consultation", body: "<p>A government-to-government process between the agency and the governing body of a Nation, on a matter with Tribal implications, early enough to shape the outcome, with what is heard carried into the decision and the result recorded. At DHS it is led by the Office of Indian Policy and the offices that handle tribal relations.</p>" },
          ] },
          { type: "list", heading: "Your part, in five lines", items: [
            "Notice early. The moment a project could reach a Nation's lands, members, programs, funding, data or authority, write that down.",
            "Put it where the decision is documented, in the project record, not only in a hallway conversation.",
            "Route it to the DHS office that leads tribal relations, with what the project is, what is still open and when it closes.",
            "Do not open contact with a Tribal government yourself, and do not ask a colleague to stand in for a Nation.",
            "Hold the timeline open while the question is answered, and tell your own leadership that is why.",
          ] },
          { type: "quote", text: "I sent the notice, typed consulted into the project file and moved on. Someone more senior pointed out that what I had really recorded was a claim that something happened when it had not. Correcting the file turned out to be more useful than the notice ever was.", cite: "Composite state-agency staff perspective, illustrative" },
          { type: "leaderMove", heading: "Keep the words consultation and engaged honest", control: "You control the accuracy of those two words in every record your project leaves behind.", failure: "Do not let a project file say consultation occurred because a message went out. A false record travels further than the message did, and it blocks the real process later.", next: "Check one project record this month for the word consultation and make it describe exactly what happened, at what level of government, and when." },
          { type: "knowledgeCheck", id: "ipe-20-2-check", question: "A division plans to brief the Minnesota Indian Affairs Council on a policy change affecting programs operated by several Tribal Nations. Which statement is accurate?", options: [
            { text: "The briefing satisfies the agency's consultation duty for all affected Nations, because the council includes Tribal representation.", correct: false },
            { text: "Coordination with such a body is encouraged, and the agency still owes consultation to the governing body of each affected Nation; the DHS offices that lead tribal relations arrange that.", correct: true },
            { text: "The briefing replaces consultation only if the council agrees to pass the information along to each Nation.", correct: false },
          ], feedbackCorrect: "Yes. Encouraged coordination and the duty to consult each Nation are two different things, and the second one is not transferable.", feedbackIncorrect: "Ask who holds the authority. A Nation's government speaks for that Nation, and no other body can carry the agency's duty on its behalf." },
          { type: "statement", body: "A private reflection, for you alone and never collected: who could be helped, burdened, excluded or misunderstood by the way this project has recorded its engagement so far, and whose expertise is missing from the decision as it currently stands?" },
        ],
      },
      {
        id: "ipe-20-3",
        number: 3,
        title: "Timing, trust and the cost of asking late",
        summary: "Why late engagement fails however well it is written, what history and unequal power have to do with a project schedule, and the signals that a project has Tribal implications while there is still room to change it.",
        minutes: 11,
        learning: {
          objective: "Identify the point in a project's life after which engagement can no longer change the outcome, and name at least four signals that a project may have Tribal implications.",
          takeaways: [
            "Engagement that arrives after the design is set can only produce comment. The question that matters is whether another government could still change the outcome on the day you ask.",
            "Trust is a record, not a mood. Decisions made about Tribal Nations without them, and commitments that were not kept, are part of the working conditions any new request walks into, whatever this project intends.",
            "Signals are visible in ordinary project documents: lands, members, programs, funding routes, eligibility, licensing, data, reporting, and anything that changes who decides.",
            "Data, research and evaluation work carries its own signals. Who is counted, how people are classified, who holds a data set and who may publish from it are governance questions, not technical ones.",
          ],
          evidence: "A sorting exercise separating early signals from ordinary internal work, a scenario about an evaluation design, and a knowledge check on timing.",
          appliedNextStep: "Take one project on your desk and write down the last date on which a Tribal government's position could still change the result, then compare it to the date engagement is currently planned.",
        },
        scenario: {
          context: "A DSD evaluation team is designing a study of waiver outcomes. The plan pulls records statewide, breaks results out by race and by county, includes a category for American Indian residents, and schedules a public report. The analyst notes that some records come from programs operated by Tribal Nations. The engagement plan has one line: “share findings when published.”",
          prompt: "What should change, and when?",
          options: [
            { label: "Keep the design and strengthen the limitations section so the report explains what small numbers can and cannot show.", response: "A careful limitations section is good practice and it is not the issue here. This plan decides who is counted, how they are classified, who holds the results and who may publish them, and those decisions are being made without the governments whose programs and members are in the data." },
            { label: "Pause the design work, record that the study may have Tribal implications because it uses records from Tribally operated programs and reports on Tribal members, and take it to the DHS offices that lead tribal relations before the measures, categories and publication plan are fixed.", response: "Right, and the timing is the whole point. Measures, categories, who holds the data and who may publish are exactly the decisions another government would want to shape, and they close early. Sharing findings at the end is notification about a study that is already finished.", recommended: true },
            { label: "Remove the American Indian category from the breakout so the study raises no concerns.", response: "Dropping a category does not remove Tribal implications; the records still come from Tribally operated programs. Erasing people from a public report is its own harm. The question is who decides how this study is built, not whether the category appears in it." },
          ],
        },
        transfer: {
          prompt: "For one piece of work you are doing now, when does the last real decision close?",
          options: [
            "Write the date the design, the measures or the funding route becomes fixed",
            "Write the date engagement is currently planned, and put the two dates side by side",
            "If the second date is later than the first, say so in writing to whoever owns the schedule",
          ],
        },
        blocks: [
          { type: "text", heading: "Late is a decision too", body: "<p>Most engagement failures are not failures of wording. They are failures of date. A project decides its scope, then its design, then its measures or its funding route, and each of those decisions closes a door. By the time a polished invitation goes out, the only thing still open is often the announcement. An invitation sent at that point asks another government to comment on something that cannot change, and it will be read that way.</p><p>So the useful question is not whether engagement is planned. It is what is still changeable on the day you ask. Write down the last date the outcome can move. If your engagement date falls after it, you do not have an engagement problem to solve with better outreach; you have a schedule to move, and moving it is usually the most substantive thing a project team can offer.</p><p>This is where the wider theme of this learning area shows up in a calendar. History, power and trust are not abstractions in a project plan. They arrive as the assumption that a state schedule is fixed and everyone else fits into it, and that assumption is itself a statement about whose time and authority count.</p>" },
          { type: "sorting", id: "ipe-20-3-sort", heading: "Signal, or ordinary internal work?", categories: ["Signal: route it before the design is fixed", "Ordinary internal work"], items: [
            { text: "The project would change how services are authorized on Tribal lands.", category: "Signal: route it before the design is fixed" },
            { text: "The evaluation uses records from programs operated by a Tribal Nation.", category: "Signal: route it before the design is fixed" },
            { text: "A funding route in the redesign moves money to or through Tribal governments.", category: "Signal: route it before the design is fixed" },
            { text: "A new reporting requirement would apply to Tribally operated programs.", category: "Signal: route it before the design is fixed" },
            { text: "A licensing or oversight rule would reach facilities located on Tribal lands.", category: "Signal: route it before the design is fixed" },
            { text: "The team is choosing between two naming conventions for its own internal working files.", category: "Ordinary internal work" },
            { text: "A supervisor is rewriting a position description for a vacancy on the team.", category: "Ordinary internal work" },
            { text: "The division is setting its own staff meeting calendar for the coming quarter.", category: "Ordinary internal work" },
          ] },
          { type: "accordion", heading: "Why timing is the trust question", items: [
            { title: "History is part of the working conditions", body: "<p>Public institutions in this country, including state agencies, have a long record of making decisions about Tribal Nations without them, and of commitments that were not kept. You did not create that record and you cannot set it aside by intending well. It is part of what any new request walks into, and it is one reason this work is led by offices that hold the relationship over time rather than by whoever happens to own this project.</p>" },
            { title: "Power shows up as a calendar", body: "<p>The government that sets the deadline holds most of the power in the exchange. When a state schedule is built first and engagement is fitted into whatever room is left, the state has already decided how much influence another government can have. Moving a date is often worth more than anything you could put in the invitation.</p>" },
            { title: "People are not only one thing", body: "<p>A person can be a citizen of a Tribal Nation, a person with a disability, a parent, an older adult and a rural resident at the same time. A program that handles each of those through a separate process, with separate deadlines and separate offices, pushes the work of holding it all together onto the person. Ask what your project asks someone to carry.</p>" },
            { title: "Where the program's continuum shows", body: "<p>Treating a Tribal government as one more community to include is a minimization move: it assumes one process fits everyone and that the difference is mostly a matter of tone. Acceptance begins when a team can say plainly that this is a different kind of relationship with a different process. Adaptation is when the schedule, the authority and the record actually change to fit it. None of this is a label about any person, and nothing here is scored, ranked or recorded.</p>" },
          ] },
          { type: "flashcards", heading: "Signals hiding in ordinary project documents", cards: [
            { front: "Lands", back: "<p>Anything that applies on Tribal lands, or that changes which office covers which area. Geography is one of the clearest signals and one of the easiest to miss in a statewide plan.</p>" },
            { front: "Members and citizens", back: "<p>Anything that changes eligibility, classification, reporting or rights for people who are citizens of a Tribal Nation, including how they are counted in a study or a public report.</p>" },
            { front: "Programs and funding", back: "<p>Anything that reaches a program a Nation operates, or any funding route that moves money to or through a Tribal government, including the conditions attached to it.</p>" },
            { front: "Data and reporting", back: "<p>Whose records are used, how people are classified, who holds a data set, who may analyze it, who may publish from it, and who sees the result first.</p>" },
            { front: "Authority", back: "<p>Any change in who decides, who approves, who may appeal, and whose determination is final. Changes in decision rights are the signal most often left out of an engagement plan.</p>" },
          ] },
          { type: "leaderMove", heading: "Move the date before you write the invitation", control: "You control when in a project's life the Tribal implications question gets asked, and you often control whether the schedule can still move.", failure: "Do not carry an unchangeable timeline into a conversation with another government and call it engagement. If nothing can move, say so honestly and expect it to be heard as exactly what it is.", next: "Name the last date your project's outcome can still change, put that date in the project record, and raise the routing question well before it." },
          { type: "knowledgeCheck", id: "ipe-20-3-check", question: "A project team plans to reach out about a service change after the design is approved but before the launch date, reasoning that there is still time to adjust the communications. Which assessment is most accurate?", options: [
            { text: "This is reasonable timing, because the change has not taken effect yet and the materials can still be revised.", correct: false },
            { text: "The design is the decision; once it is approved, engagement can shape the announcement but not the outcome, so the question should have gone to the responsible DHS office while the design was still open.", correct: true },
            { text: "Timing does not matter much, as long as the team documents that it reached out before launch.", correct: false },
          ], feedbackCorrect: "Yes. Ask what is still changeable on the day you ask. If only the wording is open, the outcome is closed.", feedbackIncorrect: "Separate the decision from the announcement. Being able to adjust materials is not the same as being able to change what was decided." },
          { type: "statement", body: "A private reflection, for you alone and never collected: if this project went ahead on its current schedule and later turned out to have caused harm or exclusion, what would accountability and repair actually require of my office, and how could the people most affected have shaped this work earlier?" },
        ],
      },
      {
        id: "ipe-20-4",
        number: 4,
        title: "A first look, and where it goes",
        summary: "The practical tool: a short check you run yourself, early, on one project, and the route that hands the question to the offices who lead it.",
        minutes: 11,
        learning: {
          objective: "Complete a first-look check for Tribal implications on one real project, naming the open decision and its closing date, the signals you noticed, the route and what your team will not decide alone.",
          takeaways: [
            "A first look is not an assessment and not a determination. It records what you noticed, while the decision is still open, and hands the question to the office that leads the work.",
            "A usable entry names the project, the decision still open and when it closes, the specific signals, who it went to and when, and what the team will not decide on its own.",
            "Writing that you noticed nothing is a real answer, and it belongs in the record with your reasoning, so the next person can check the reasoning rather than repeat the work.",
            "The route is the point. The DHS Office of Indian Policy and the DHS offices that handle tribal relations and consultation lead this work; the check exists to reach them early, not to replace them.",
          ],
          evidence: "A completed first-look check, a scenario about an entry too vague to act on, and a knowledge check on what a usable entry contains.",
          appliedNextStep: "Fill the check in for one live project this week and send it to the DHS office that leads tribal relations, with the open decision and its closing date in the first two lines.",
        },
        scenario: {
          context: "A colleague sends you her first-look check for a contracting redesign. It reads, in full: “May have Tribal implications. Will reach out to the appropriate office at some point in the project.”",
          prompt: "What do you send back?",
          options: [
            { label: "Approve it. She has flagged the issue, which is the important part, and the detail can be filled in later.", response: "The flag is the easy half. Without the open decision, its closing date and the specific signals, the office receiving it cannot tell whether it has weeks or days, and “at some point” in practice means after the design is fixed." },
            { label: "Ask for four additions: the decision still open and when it closes, the specific signals she noticed, who she is sending it to and when, and what the team will not decide on its own.", response: "Right. Those four turn a worry into something another office can act on, and the closing date is the line that decides whether early engagement is still possible at all.", recommended: true },
            { label: "Rewrite it yourself as a formal assessment of whether the redesign has Tribal implications, so the record is authoritative.", response: "That determination is not a project team's to make, and a confident-sounding answer from the wrong office does more damage than a vague note. The check records what you noticed and routes it; the offices that lead this work decide what it means." },
          ],
        },
        transfer: {
          prompt: "Which project will you run the check on first, and what closing date goes in line two?",
          options: [
            "Name the project and the decision that is still genuinely open",
            "Write the date that decision closes, not the date the work goes live",
            "Name the person on your team who will ask you next week what came back",
          ],
        },
        blocks: [
          { type: "text", heading: "What a first look is, and what it is not", body: "<p>The check on this page is short on purpose. It is not an assessment, it determines nothing, and it carries no authority. It is a note you write early, in the project record, saying what you noticed and handing the question to the people who lead this work while there is still room to act on the answer.</p><p>That modesty is the point. A project team that writes a confident finding about whether a matter has Tribal implications has stepped into a decision that is not its own, and a well-written wrong answer is harder to correct than an honest question. The most useful thing a team can produce is an accurate, specific, early question.</p><p>Two lines carry most of the weight. The first is the decision that is still open and the date it closes, because that tells the office receiving it whether early engagement is still possible or whether the project is asking for comment on something already settled. The second is what your team will not decide on its own, because writing that down is what keeps a helpful project team from quietly becoming the agency's answer.</p>" },
          { type: "artifact", kind: "tagged-document", label: "Practical tool", title: "A first-look check for Tribal implications in one project", summary: "Five lines you fill in yourself, early, so the offices that lead this work receive an accurate question while the decision is still open.", fields: [
            { label: "Project and the decision still open", value: "Redesign of the contracting route for a DSD-funded service. Open decision: which entities may hold the contract and how funds move. It closes when the solicitation language is approved." },
            { label: "Signals you noticed", value: "One funding route currently runs to Tribal governments; the eligibility language would change who may hold a contract; the reporting requirement attached to the contract would apply to programs operated by Tribal Nations." },
            { label: "Who leads from here", value: "Sent to the DHS office that leads tribal relations and consultation, addressed to the agency's designated Tribal liaison. Asking: does this require consultation, with which Nations, and by when must our schedule hold?" },
            { label: "What this team will not decide on its own", value: "Whether the change has Tribal implications; whether consultation is required; which Nations are affected; who is contacted and how; any direct approach to a Tribal government or official." },
            { label: "Record, timing and the review point", value: "Date sent and date the open decision closes, both written in the project file. If no reply arrives before the closing date, raise it to our own leadership and ask to hold the date rather than proceed. Revisit this entry whenever the design changes." },
          ], action: "Copy the five lines into your project record, fill them in from one live project, and send the first three to the DHS office that leads tribal relations before the open decision closes." },
          { type: "list", heading: "Where the signals usually hide", items: [
            "Eligibility language: who may hold a contract, run a program, be licensed, or count as a provider.",
            "Funding routes: any line that moves money to or through a Tribal government, and the conditions attached.",
            "Geography: anything that applies on Tribal lands, or that changes which office covers which area.",
            "Data and reporting: whose records are used, how people are classified, who holds a data set, who may publish from it.",
            "Authority: any change in who decides, who approves, who may appeal, or whose determination is final.",
            "Timelines: any deadline too short for another government to respond within it, which is a signal about your schedule.",
          ] },
          { type: "accordion", heading: "Four ways a good check still goes wrong", items: [
            { title: "It arrives late", body: "<p>The signals were real and the note was accurate, and it was written the week before launch. Late notice turns a government-to-government question into a communications problem. Write the check when design work starts, not when it ends.</p>" },
            { title: "It is too vague to act on", body: "<p>“May have Tribal implications” gives the receiving office nothing to work with. Name the specific signal, the open decision and its closing date, and that office can usually tell you in one reply how urgent this is.</p>" },
            { title: "The team answers its own question", body: "<p>A project team that concludes there are no Tribal implications, and records that as a finding, has taken a determination that belongs elsewhere. Record what you noticed and why you read it that way, and let the answer come from the office that leads this work.</p>" },
            { title: "Someone goes around the route", body: "<p>A direct call to a Tribal official, an invitation sent from a project inbox, or a request that a Native colleague weigh in on behalf of a Nation. All three feel helpful, and all three cut across a relationship the agency holds as a whole. Send it through the route.</p>" },
          ] },
          { type: "leaderMove", heading: "Be honest about the closing date", control: "You control how early the check is written and how accurately the open decision's closing date is stated.", failure: "Do not move a closing date on paper to make the routing look timely. The office receiving your note is planning real work against that date.", next: "Run the check on one live project this week, and put the reply, or the absence of one, back into the project record." },
          { type: "knowledgeCheck", id: "ipe-20-4-check", question: "Which first-look entry can the receiving office actually act on?", options: [
            { text: "“Project may affect Tribal Nations. Engagement planned.”", correct: false },
            { text: "“Reporting rule would apply to Tribally operated programs. Open decision: the measure set, approved on the date in line five. Sent to the office that leads tribal relations on the date noted. This team will not decide whether consultation is required.”", correct: true },
            { text: "“Reviewed for Tribal implications; none found; no action needed.”", correct: false },
            { text: "“Tribal Nations will be included in the public comment period along with our other partners.”", correct: false },
          ], feedbackCorrect: "Yes. A specific signal, an open decision with a date, a route with a date, and a clear statement of what the team is not deciding.", feedbackIncorrect: "Look for four things: what you noticed, what is still open and when it closes, who it went to and when, and what the team will not decide. A finding of none without reasoning, and an entry that treats a Nation as one more commenter, both fall short." },
          { type: "statement", body: "A private reflection, for you alone and never collected: does the way I have described this project make sense to someone who does not already know how DHS works, and what would accessibility mean here beyond a legal minimum? Nothing you write is collected, scored or shown to anyone." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Tribal sovereignty and state responsibilities",
    subtitle: "One page for any DHS or DSD project, before the design is set",
    quote: "Governments, not stakeholders. Notice early, route it, and do not answer it yourself.",
    use: {
      purpose: "Keep the category, the route and the timing in view while you plan a policy change, a program redesign, a contract, an evaluation or a public report.",
      remember: [
        "Tribal Nations are sovereign governments. Minnesota is home to eleven federally recognized Nations, each with its own elected government, and they do not speak for one another.",
        "Consultation is owed to each Nation's governing body. A notice, a public comment period, a conversation with program staff, or a briefing to a body several Nations sit on does not satisfy it.",
        "At DHS this work is led by the Office of Indian Policy and the offices that handle tribal relations and consultation. Staff notice and route.",
        "Ask what is still changeable on the day you ask. If only the wording is open, the outcome is closed.",
        "No employee speaks for a Tribal Nation, and no project team decides whether a matter has Tribal implications.",
      ],
      doNext: "Run the first-look check on one live project and send it before the open decision closes.",
    },
    sections: [
      {
        heading: "The first-look check, in short",
        items: [
          "Project, and the decision that is still genuinely open.",
          "The date that decision closes, not the date the work goes live.",
          "The specific signals you noticed, in plain words.",
          "Who you sent it to and when: the DHS office that leads tribal relations.",
          "What your team will not decide on its own, written out.",
        ],
      },
      {
        heading: "Signals to look for",
        items: [
          "Anything that applies on Tribal lands or changes which office covers which area.",
          "Any funding route that moves money to or through a Tribal government.",
          "Any change to eligibility, licensing, reporting or who may hold a contract.",
          "Any study, data set or public report that uses records from Tribally operated programs or reports on Tribal members.",
          "Any change in who decides, who approves, who may appeal, or whose determination is final.",
        ],
      },
      {
        heading: "What stays out of your hands",
        items: [
          "Deciding whether a matter has Tribal implications, or which Nations are affected.",
          "Opening contact with a Tribal government, an official, or a Nation's staff about an agency matter.",
          "Asking a colleague who is a member of a Tribal Nation to speak for that Nation.",
          "Describing a Nation's culture, beliefs or internal affairs in a program document.",
          "Recording that consultation happened when what happened was a notice, a briefing or a comment period.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, whose drafting decisions set scope, eligibility and timing before anyone outside the division sees them, and who have the most to gain from going deeper here.",
          "Data, research and evaluation staff, who decide who is counted, how people are classified, who holds a data set and who may publish from it, and who will find the deeper material directly useful.",
          "Executive and senior leaders, for whom this is a useful starting module: it names the category, the duty, the route and the one question worth asking in any project review.",
          "Contracts, fiscal, grants and communications staff, who hold the funding routes, deadlines and notices where signals most often appear first.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "History, disability and public institutions",
          "Race, disability and unequal outcomes",
          "Power, conflict and repair",
          "Ethical decision-making",
          "Trauma-responsive public administration",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Statutes, section 10.65, Government-to-government relationship with Tribal governments", href: "https://www.revisor.mn.gov/statutes/cite/10.65", note: "Minnesota's statute recognizing the unique status of the state's eleven federally recognized Tribes, directing state agencies including the Department of Human Services to adopt Tribal consultation policies, to consult the governing body of each Nation on matters with Tribal implications, to designate a Tribal liaison, and to direct relevant staff to Tribal-state relations training." },
    { title: "Minnesota Statutes, section 3.922, Minnesota Indian Affairs Council", href: "https://www.revisor.mn.gov/statutes/cite/3.922", note: "The statute establishing the Minnesota Indian Affairs Council, useful for understanding what that body is and, read alongside section 10.65, what it does not replace." },
    { title: "Minnesota Indian Affairs Council", href: "https://mn.gov/indianaffairs/", note: "The state body that works on relationships between Minnesota state government and the Tribal Nations in Minnesota, including Tribal-state relations training for state employees." },
    { title: "Minnesota Department of Human Services", href: "https://mn.gov/dhs/", note: "The department's public site. The DHS Office of Indian Policy and the DHS offices that handle tribal relations and consultation are reached through the department and through your own division's directory; they lead this work." },
    { title: "USAGov, Federally recognized Indian tribes and resources for Native Americans", href: "https://www.usa.gov/tribes", note: "Plain-language federal overview of what federal recognition means and where the official list of federally recognized Tribes is published." },
    { title: "U.S. Department of the Interior, Indian Affairs, Frequently Asked Questions", href: "https://www.bia.gov/frequently-asked-questions", note: "Federal answers on Tribal sovereignty, the government-to-government relationship, the trust responsibility, and terminology used in federal and state practice." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the standards on governance, partnership and engaging the communities a program serves." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
