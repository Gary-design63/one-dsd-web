import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Foundations · Module 3: Public power and institutional impact.
// Internal DHS and DSD staff: policy, program oversight, quality, data, contracts, communications and senior leaders.
const pack: CoursePack = {
  course: {
    id: "ipe-03-public-power",
    indexNumber: 1145,
    seriesLabel: "Intercultural Practice and Equity · Foundations",
    title: "Public power and institutional impact",
    subtitle: "A form, a definition, a deadline, a contract line: ordinary internal decisions arrive in someone’s life as help, delay, confusion or exclusion.",
    scope: "For internal DHS and DSD staff — policy and program, quality and performance, data and evaluation, contracts and fiscal, communications and learning design, community engagement, and senior leaders. Four short lessons on how a state decision travels and what it does when it lands. Voluntary and self-directed: start anywhere, take what fits the work in front of you, and come back when you need it. Nothing here is scored, ranked or recorded, reflections stay private, and finishing does not count toward required training credits.",
    treatment: "Four short lessons with internal scenarios, a sorting exercise, flashcards, a decision-travel map and knowledge checks",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/outcomes-not-intentions.jpg",
    coverAlt: "A woman reviews printed charts at a desk.",
    introTranscript: "Most of the power in a large public system is exercised quietly: in the wording of a question, the number of days in a response window, the definition of a data field, the documentation a contract requires. From the inside that work feels administrative. From the outside it arrives as a rule about someone’s life. This module follows a decision from the desk where it is made to the week it changes, shows where meaning and burden get added along the way, and gives you a map you can use before your next decision is final.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Identify the forms of public power inside routine internal work: definitions, forms, timelines, money, words, measures and silence.",
        "Trace the path a division decision takes from the office where it is made to the week of a person receiving services.",
        "Name the learning, compliance and psychological costs a decision adds, and who absorbs each one.",
        "Examine how eligibility criteria, data definitions, quality measures and contract terms decide who the system can see.",
        "Complete a decision-travel map for one decision you touch and make one change before it is final.",
      ],
      evidence: [
        "A sorting exercise that separates learning, compliance and psychological costs.",
        "A knowledge check in every lesson with feedback that explains the reasoning, not just the answer.",
        "A completed decision-travel map naming the stops, the people affected, the burden and the first change.",
      ],
      appliedNextStep: "Choose one decision in your own work that is still changeable, map the five stops it will travel through, and make the one change that is inside your own authority before it goes out.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in Minnesota disability services policy, waiver structure, assessment practice or rate framework that changes how a decision reaches lead agencies and providers",
        "A change in federal or state civil rights, accessibility or language access direction that affects notices and public communication",
        "Feedback from staff, community partners or compensated advisors that a scenario misstates how the work actually travels",
      ],
      relatedDoor: "Formal decisions about policy, eligibility, rates, contracts, appeals and corrective action belong to the responsible Disability Services Division program office and the department offices that handle legal, compliance, civil rights and appeals matters; this module prepares your thinking, it does not decide a case or change a policy.",
      toolkitQuestion: "When this decision lands, who does the extra work, and did we ask them before we decided?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-03-1",
        number: 1,
        title: "The power inside an ordinary decision",
        summary: "Definitions, forms, deadlines, rates and words are instructions that thousands of people follow. From the inside they feel administrative; from the outside they are rules about a life.",
        minutes: 11,
        learning: {
          objective: "Identify the specific forms of public power inside your own routine work and name who each one reaches.",
          takeaways: [
            "Most public power in a large system is technical and quiet: what a form asks, how many days a window allows, what a field means, what a contract requires, what triggers a review.",
            "The same requirement costs almost nothing to a person with a car, a printer, stable housing and an easy relationship with institutions, and a great deal to a person without those things.",
            "Intent and impact are different measurements. A decision meant to protect a program can still add a week of unpaid time off to someone’s month.",
            "Naming your own authority is not an accusation against you. It is the first working skill of public administration.",
          ],
          evidence: "A scenario decision about adding a verification step, and a knowledge check on where public power actually sits.",
          appliedNextStep: "List the last three changes your team made, and for each one write who followed the instruction, who explained it, and who did the extra work.",
        },
        scenario: {
          context: "A program team is closing a review finding about missing documentation. The proposed fix is a one-page verification form, signed by a licensed professional, filed before a service can continue. The team estimates it takes a minute to complete and says it protects the program.",
          prompt: "What should the team do before the change is final?",
          options: [
            {
              label: "Approve the form. It is one page, the requirement is defensible, and the review finding closes.",
              response: "The finding closes and the cost moves out of sight. A signature from a licensed professional is not a minute of work for the person who has to get an appointment, arrange a ride, take time off and mail the result inside a deadline.",
            },
            {
              label: "Write down who completes the form, who chases the signature, how long that actually takes for a person without a car or paid leave, and what happens when the deadline passes — then decide, with the least costly version that still closes the finding.",
              response: "This is the accurate method. The requirement may still be necessary; the point is to price it honestly, in someone else’s time, before choosing it, and to choose the version that carries the least burden.",
              recommended: true,
            },
            {
              label: "Approve the form and add a line to the notice telling people to call the office if they have trouble getting it completed.",
              response: "An offer of help placed after the burden is designed in shifts the work to the person who is already carrying the most, and it only reaches people who read the notice, understand it and feel safe calling.",
            },
          ],
        },
        transfer: {
          prompt: "Where does public power sit in the work you personally touch each week?",
          options: [
            "Name one definition, form field, deadline or contract term you can change without anyone’s approval",
            "Name the people who follow that instruction and the people who absorb the work it creates",
            "Write one sentence describing what the instruction costs someone who has no car, no printer and no paid leave",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Power does not feel like power from the inside",
            body: "<p>Most of the authority in a large public system is not exercised in a hearing room or over a commissioner’s signature. It is exercised in small technical acts: the wording of a question, the number of days in a response window, the definition of a data field, the documentation a contract requires, the threshold that triggers a review. Each act is an instruction that many people will follow, and most of them will never know who wrote it or why.</p><p>From the inside, this work feels administrative. You are closing a gap, answering a finding, tightening a definition, meeting a deadline someone else set. From the outside, the same act arrives as a rule about a life: whether a service starts this month or next, whether a parent asks for time off work again, whether an interpreter is in the room, whether anyone ever explains what happened to a request.</p><p>This is public power, and it is legitimate. It is also unevenly felt. The same requirement costs almost nothing to a person with a car, a printer, stable housing and an easy relationship with institutions, and costs a great deal to a person without those things. Noticing that difference is not a judgment about your motives. It is the first working skill of institutional practice.</p>",
          },
          {
            type: "list",
            heading: "Where public power actually sits in routine work",
            items: [
              "Definitions: who counts as eligible, what counts as a service, what counts as an unmet need, who counts as family.",
              "Forms: what is asked, in what order, in what language, at what reading level, with what proof attached.",
              "Timelines: how many days a person has to respond, and what happens automatically when they do not.",
              "Money: rates, contract terms and reporting requirements, and what a provider can afford to do with what it is paid.",
              "Words: notices, manuals, letters and web pages that either explain a decision or bury it.",
              "Measures: what the division counts, reports and reviews — and therefore what gets attention and staff time.",
              "Silence: the choice to change something without telling the people it will reach, or without saying why.",
            ],
          },
          {
            type: "tabs",
            heading: "One small requirement, four vantage points",
            tabs: [
              { label: "The program desk", body: "<p>A one-page verification form closes a documentation finding. It is defensible, it is consistent statewide, and it takes about a minute to complete. The team records the change as low impact and moves to the next item.</p>" },
              { label: "The lead agency", body: "<p>A worker adds the form to a visit that was already full. The explanation happens last, when everyone is tired. When the instruction is unclear, the worker chooses the most cautious reading, because a cautious reading is the one that survives a review.</p>" },
              { label: "The provider office", body: "<p>A small provider adds the form to its own checklist, chases the signature, and carries the gap between the service delivered and the payment received. The administrative minute is not a minute; it is a task with a follow-up, a phone call and a file.</p>" },
              { label: "The kitchen table", body: "<p>A person needs an appointment with a professional who is booked five weeks out, a ride to get there, and someone to mail the result inside the window. If any one of those fails, the service pauses. Nothing in the notice explains which office decided this or why.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Say what the decision will do, not only what it will fix",
            control: "You control whether a change is written up as a small administrative step or as a decision with a named effect on named people.",
            failure: "Do not let “it is just a form” end the discussion. That phrase describes the effort of writing the requirement, never the effort of meeting it.",
            next: "In your next change memo, add one sentence: this reaches these people, the added work lands here, and we chose the least costly version that still solves the problem.",
          },
          {
            type: "quote",
            text: "We got the bulletin on a Friday and the families got their letters the same week. They called us, not the people who wrote it. We spent a month explaining a decision we had to guess the reasons for.",
            cite: "Composite lead agency staff perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-03-1-check",
            question: "A division team describes a new documentation requirement as “administrative, not a policy change.” Which assessment is best supported?",
            options: [
              { text: "The description is accurate. Because no rule or statute changed, the effect on people is minimal.", correct: false },
              { text: "The description measures the effort of writing the requirement, not of meeting it. A documentation requirement is an instruction many people must follow, and its real cost is the time, travel, proof and risk it moves onto them.", correct: true },
              { text: "The description is accurate if the form is one page or less and the deadline is at least thirty days.", correct: false },
              { text: "The description is accurate as long as the change is announced before it takes effect.", correct: false },
            ],
            feedbackCorrect: "Yes. The label describes the work on our side. Public power is measured by what the instruction requires of the people who receive it.",
            feedbackIncorrect: "Ask who has to do something new because of this change, how long it will take them, and what happens if they cannot. That answer, not the size of the document, tells you whether it is minor.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone: How might my role, authority, language or assumptions shape this decision — and what would I have to know about someone’s week to price it honestly? Nothing you write is collected, shared or recorded anywhere in this program.",
          },
        ],
      },
      {
        id: "ipe-03-2",
        number: 2,
        title: "The trip a decision takes",
        summary: "A decision leaves as a sentence and arrives as a letter with a deadline. At every handoff, meaning is lost, caution is added, and someone new absorbs the work.",
        minutes: 11,
        learning: {
          objective: "Trace how an internal decision reaches a person, and name where meaning, delay and burden are added along the way.",
          takeaways: [
            "A decision travels as an instruction, a screen change, a local practice, a notice and finally a week in someone’s life. Each handoff is made by a person with less context than the one before.",
            "Where an instruction is ambiguous, the most cautious local reading usually becomes the practice, because a cautious reading is the one that survives a review.",
            "What a computer screen will not allow becomes policy in practice, whatever the written policy says.",
            "Burden arrives in three forms: learning costs (finding out and understanding), compliance costs (time, travel, proof, money) and psychological costs (stress, stigma, having to explain yourself again).",
          ],
          evidence: "A sorting exercise separating learning, compliance and psychological costs, and a scenario decision about how a change is communicated.",
          appliedNextStep: "Take one change your team made in the last six months and write the five stops it traveled through. Mark the stop where you know the least about what actually happened.",
        },
        scenario: {
          context: "A policy change takes effect in thirty days. The plan is a bulletin to lead agencies and providers, a manual update, a screen change, and a standard notice mailed to people receiving the service. The notice is written from the manual language. Nobody has asked whether it can be understood by a person who does not already know how the division works.",
          prompt: "What is the most useful thing to add to the plan?",
          options: [
            {
              label: "Add a frequently asked questions page on the website so people can look up what changed.",
              response: "Useful for people who know the change happened, read well online, and know which words to search. It does nothing for the person whose first and only contact is the letter.",
            },
            {
              label: "Read the notice as a person who has never heard of the division: does it say what changed, what they must do, by when, what happens if they do nothing, and who to ask — in plain language, in the languages people actually use, with a version tested by compensated community reviewers before it mails.",
              response: "This is the highest-value addition. The notice is the only stop on the trip that most people will ever see, and it is the stop we control completely.",
              recommended: true,
            },
            {
              label: "Give lead agency staff a training call so they can explain the change when people ask.",
              response: "Worth doing, and not sufficient. It relies on the person knowing enough to call, reaching someone, and getting a consistent explanation of an instruction that staff may also be reading cautiously.",
            },
          ],
        },
        transfer: {
          prompt: "Pick one change you helped make. Where did you stop being able to see it?",
          options: [
            "Name the last stop you have direct knowledge of, and the first stop you are only assuming about",
            "Find out what the notice actually said, and read it out loud",
            "Ask one person who had to carry out the change what it added to their week",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Nothing arrives the way it left",
            body: "<p>A decision made in a program office does not travel as a decision. It travels as a sentence in a bulletin, an edit in a manual, a new required field on a screen, a line in a contract, a slide in a training, a supervisor’s summary, a worker’s explanation at a kitchen table, and finally as a letter with a deadline in it. Each handoff is made by someone with less context than the person before, and each one adds something the original decision never said.</p><p>This is not a failure of anyone’s effort. It is how a statewide system with many separate organizations necessarily works. But it has a predictable consequence: the further a decision travels, the more caution it collects. An instruction that is clear in the room where it was written becomes, four stops later, a local rule that is stricter, slower and harder to question than anything the division intended.</p><p>The other predictable consequence is that burden accumulates in one direction. Nobody decides to add an appointment, a ride, a phone call, two weeks of waiting and an afternoon of worry. Those things are added by the trip itself, at the last stop, where the person has the least power to push back and the least information about who to ask.</p>",
          },
          {
            type: "accordion",
            heading: "Five stops, and what changes at each",
            items: [
              { title: "One: the decision", body: "<p>A problem is named and a fix is chosen. What usually goes unrecorded is the reasoning: what problem this solves, what other options were considered, who was consulted, and what the team expected it to cost people. When the reasoning is not written down, everyone downstream has to guess at it — and they will guess cautiously.</p>" },
              { title: "Two: the instruction", body: "<p>The decision becomes a bulletin, a manual change, a contract amendment or a form. Ambiguity here is not neutral. Where a sentence can be read two ways, the reading that survives a review is the restrictive one, and that reading quietly becomes statewide practice.</p>" },
              { title: "Three: the screen", body: "<p>The change reaches the systems people work in: required fields, attachments, drop-down choices, validation that will not let a record save. Whatever the software refuses to accept becomes the operative policy, regardless of what the written policy allows. Exceptions that exist on paper stop existing in practice.</p>" },
              { title: "Four: local practice", body: "<p>Lead agencies and providers translate the instruction into their own checklists, letters, local forms and habits. They add margin for safety, often a document or a signature the division never asked for, because the cost of being wrong in a review falls on them.</p>" },
              { title: "Five: the notice and the week", body: "<p>A person learns something changed, usually from a letter written out of manual language. Then comes the actual work: read it, understand it, figure out whether it applies, find the document, get the appointment, arrange the ride, take the time off, mail it, wait, and carry the worry about what happens if any part of that fails.</p>" },
              { title: "When a decision reaches Tribal Nations", body: "<p>Consultation with Tribal Nations is a separate government-to-government obligation, not a step in this map and not something this program completes on its own. Where a decision touches Tribal Nations, tribal members or tribal programs, this program defers to the Office of Indian Affairs and to the department offices that handle tribal matters. Bring the decision to them early, not after the instruction is written.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-03-2-sort",
            heading: "Which kind of cost is this?",
            categories: ["Learning cost", "Compliance cost", "Psychological cost"],
            items: [
              { text: "Finding out that a rule changed at all, from a letter that never says what to do next.", category: "Learning cost" },
              { text: "Reading three pages of manual language to work out which of four forms applies to you.", category: "Learning cost" },
              { text: "Getting a clinic signature, copying the documents and mailing them inside a ten-day window.", category: "Compliance cost" },
              { text: "Taking unpaid time off work for an appointment only offered during business hours.", category: "Compliance cost" },
              { text: "Explaining a diagnosis again to a new worker to keep a service that was already approved.", category: "Psychological cost" },
              { text: "Waiting weeks without knowing whether support will continue next month.", category: "Psychological cost" },
            ],
          },
          {
            type: "list",
            heading: "What the trip adds that nobody decided",
            ordered: true,
            items: [
              "Caution: each handoff resolves ambiguity in the direction that is safest for the person handing it off.",
              "Delay: every stop has a queue, and queues run in sequence, not in parallel.",
              "Local extras: a second signature, a local form, an in-person step added for safety and never removed.",
              "Loss of reasoning: by the last stop, nobody can explain why, so the answer becomes “that is the requirement.”",
              "Unequal weight: the same added step is a nuisance to one household and the end of a service for another.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Write the reasoning into the instruction",
            control: "You control whether the people carrying out a change receive only the requirement, or the requirement plus the problem it solves and the flexibility that exists.",
            failure: "Do not send a rule with no reasoning and then be surprised by strict local practice. An unexplained rule is read defensively, every time.",
            next: "Add three lines to your next instruction: what problem this solves, what it does not require, and who to ask when a situation does not fit.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-03-2-check",
            question: "A division policy allows an exception for people who cannot obtain a document in time, but the case system will not save a record without that document attached. What is the practical result?",
            options: [
              { text: "The exception still applies; staff can note it and process the case normally.", correct: false },
              { text: "The exception effectively does not exist. What the system will not accept becomes the operative rule, so the written flexibility never reaches the person it was written for.", correct: true },
              { text: "The result depends on whether the exception is mentioned in the bulletin.", correct: false },
            ],
            feedbackCorrect: "Yes. A flexibility that the working systems do not support is a flexibility only on paper. Fixing the field is part of making the policy real.",
            feedbackIncorrect: "Follow the trip to the desk where the work happens. If the screen refuses the record, the person doing the work has no route to the exception, whatever the policy says.",
          },
        ],
      },
      {
        id: "ipe-03-3",
        number: 3,
        title: "Who the system can see",
        summary: "Eligibility criteria, assessment questions, data definitions, quality measures and contract terms all decide the same thing: who is visible to the state, and who is not.",
        minutes: 11,
        learning: {
          objective: "Examine how criteria, definitions, measures and contract terms decide who the system can see, and identify one category in your own work that hides someone.",
          takeaways: [
            "Every category is a decision. What a definition excludes does not become smaller; it becomes invisible, and invisibility reads in our reports as absence of need.",
            "Measures count only what reached the channel we built. Low complaint numbers from a community can mean satisfaction, or can mean the complaint route is unusable, unsafe or unknown.",
            "Uniform treatment and equal access are not the same thing. Identical procedure across very different circumstances produces very different results.",
            "The program uses the intercultural development continuum — denial, polarization, minimization, acceptance, adaptation and integration — to describe how institutional practice matures. It is never a label, a score or a record about any individual person.",
          ],
          evidence: "A scenario decision about interpreting a regional difference in requests, and a knowledge check on what a measure can and cannot tell you.",
          appliedNextStep: "Pick one definition, field or measure you rely on and write down who fits it awkwardly, who falls outside it, and what you currently conclude about them.",
        },
        scenario: {
          context: "An evaluation shows that requests for a particular support are far lower in one part of the state than anywhere else, and lowest among households whose primary language is not English. A draft summary reads: “demand appears limited in this region; consider reallocating outreach funds.”",
          prompt: "How should the team handle the finding?",
          options: [
            {
              label: "Publish the finding as written. The data are accurate and the reallocation follows the evidence.",
              response: "The count is accurate and the conclusion is not. A request count measures the route to the request — its language, format, hours and trustworthiness — at least as much as it measures need.",
            },
            {
              label: "Hold the conclusion, state plainly what the measure counts and what it cannot see, and find out what the request route actually requires — language, format, hours, proof, who must be asked — including from compensated community reviewers and organizations in that region.",
              response: "This is the sound method. You keep the number, name its limits, and go find the missing information before a funding decision is built on a gap in visibility.",
              recommended: true,
            },
            {
              label: "Add a footnote noting possible cultural differences in help-seeking, then publish the reallocation as drafted.",
              response: "A footnote that attributes a gap to culture, without checking the route we built, converts our own design problem into a statement about a community — and the reallocation still goes ahead.",
            },
          ],
        },
        transfer: {
          prompt: "Which category in your work is doing more deciding than it appears to?",
          options: [
            "Name one field, criterion or measure and write who it fits badly",
            "Write what you currently conclude when the count is low, and one other explanation that fits the same number",
            "Identify whose expertise would settle the question, and what it would take to have them involved and paid before the next decision",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Categories are decisions wearing technical clothes",
            body: "<p>Eligibility criteria, assessment questions, data fields, quality measures and contract terms all do the same quiet thing: they decide what the state can see. A need that has no field is not recorded. A person who does not fit a category is recorded as something else, or not at all. What falls outside the definition does not get smaller; it gets invisible, and in a report invisibility looks exactly like absence of need.</p><p>Measures have the same property. A count of complaints counts only complaints that reached the channel we built, in the language that channel accepts, from people who believed the complaint was safe to make and would lead somewhere. Read one way, a low number is good news. Read accurately, it is a question: is this satisfaction, or is this a route nobody can use?</p><p>Culture, language and disability all sit inside this. A family that organizes care among relatives may answer “no need” to a question about unmet need, because the need is being met by people who are exhausted. A person who communicates without speech may be recorded as declining to answer. A question about “the head of household” may not describe how a family actually decides anything. None of this is a flaw in the people answering. It is a limit in what we built to listen with.</p>",
          },
          {
            type: "flashcards",
            heading: "Five quiet decisions inside a definition",
            cards: [
              { front: "What counts as a need?", back: "<p>If unmet need is defined as need not currently covered by a paid service, all the work being done by unpaid relatives disappears from the record — and from the case for funding it.</p>" },
              { front: "Who counts as family?", back: "<p>A form with rows for parent, spouse and legal guardian can leave out grandparents, adult siblings, chosen family and the neighbor who has provided support for a decade. Who is left out is who cannot be consulted, notified or paid.</p>" },
              { front: "What counts as a complaint?", back: "<p>Only what arrives in our channel, in our language, in our format, from someone who believed it was safe. Everything else is a conversation that happened somewhere we do not hear.</p>" },
              { front: "What counts as an outcome?", back: "<p>Measures pick the outcome that is easy to count. Hours authorized, days to decision and utilization are easy. Whether the person has the life they wanted is hard, and it is the reason the program exists.</p>" },
              { front: "What counts as evidence?", back: "<p>If only clinical documentation and audited data count as evidence, then the account of the person living the result is treated as opinion — and the people who know the most about the impact carry the least weight in the decision.</p>" },
            ],
          },
          {
            type: "tabs",
            heading: "Same rule, three ways of seeing it",
            tabs: [
              { label: "Minimization", body: "<p>“We apply the same procedure to everyone, so the process is fair.” The intent is real and the standard is sincerely held. What it misses is that identical procedure across very different circumstances produces very different results — the deadline that is routine for one household ends a service for another. Minimization is the most common place for a well-run public organization to sit, and it is comfortable, because from the inside it looks like integrity.</p>" },
              { label: "Acceptance", body: "<p>The difference is recognized as real and consequential, not as a preference or an excuse. The team can say out loud: this requirement is not the same requirement for a person who has no car, no printer, no paid leave, or no reason to trust a state letter. Nothing in the design has changed yet, but the conversation has stopped pretending the effect is uniform.</p>" },
              { label: "Adaptation", body: "<p>The design shifts so that the same policy produces comparable access: the deadline moves, the proof changes, the notice is written and tested in the languages people use, the route accepts more than one way in. Adaptation is a change in what we build, not a change in how tolerant we feel. The program uses this continuum to describe institutional practice, never to label, score or record a person.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "State what the number cannot see",
            control: "You control whether a finding is published with its limits attached, or travels as a clean fact into a funding decision.",
            failure: "Do not let a low count become “low demand” in a summary, a slide or a budget line. Once a number is quoted without its limits, the limits never catch up with it.",
            next: "In your next report, add one line under the headline number: this counts requests that reached this route; here is who that route is hardest for.",
          },
          {
            type: "quote",
            text: "People kept telling us there was no interest in our area. There was plenty of interest. There was no form anyone could read, and the only phone line closed at the hour our families finish work.",
            cite: "Composite community organization perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-03-3-check",
            question: "A quality measure shows very few appeals filed by households in one part of the state. Which reading is best supported before any further information is gathered?",
            options: [
              { text: "Decisions in that area are more accurate, since fewer people contest them.", correct: false },
              { text: "The measure shows how many appeals reached the appeal route. Whether that reflects accurate decisions, an unusable route, or people who did not know an appeal was possible is still an open question.", correct: true },
              { text: "The measure shows that people in that area are less likely to challenge authority.", correct: false },
              { text: "The measure is unusable and should be removed from the report.", correct: false },
            ],
            feedbackCorrect: "Yes. The count is real, and it counts the route. Naming that in the report is what keeps a visibility gap from becoming a conclusion about people.",
            feedbackIncorrect: "Ask what had to happen for a case to appear in this number: knowing the right exists, understanding the letter, meeting the deadline, trusting the process. Any one of those can explain the count.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone: Whose expertise is missing from the decisions I work on — and what would it take to have those people involved, and compensated, before the next one is drafted rather than after?",
          },
        ],
      },
      {
        id: "ipe-03-4",
        number: 4,
        title: "Map the trip before it starts",
        summary: "The practical tool for this module: take one decision that is still changeable, follow it to the week it will land in, and make the one change that is inside your own authority.",
        minutes: 11,
        learning: {
          objective: "Complete a decision-travel map for one decision in your work, naming each stop, who is affected, what it costs them, and the first change you will make.",
          takeaways: [
            "A map is only useful while the decision is still changeable. After it goes out, the same exercise is a review, and reviews rarely move anything.",
            "Most first changes are small and inside the authority of the person who notices them: a deadline, a word, a second route in, a reason written down.",
            "A change with no named owner and no review point is a good intention, not a plan.",
            "Accountability after harm is a separate obligation from good design: say what happened, fix the design, tell the people affected what changed, and do not ask them to relive it to be believed.",
          ],
          evidence: "A completed decision-travel map, a scenario decision about timing, and a knowledge check on what a complete map line contains.",
          appliedNextStep: "Map one decision this month, make the change you own before it goes out, and tell the people who carry out the instruction what you changed and why.",
        },
        scenario: {
          context: "You are three days from sending a change that adds a required attachment to a common request. A colleague suggests mapping how it will travel. The team is behind, the change has already been socialized, and someone says mapping it now will only slow things down.",
          prompt: "What is the most useful move?",
          options: [
            {
              label: "Send the change on schedule and map it afterwards, so the review can inform the next one.",
              response: "After it goes out, the map becomes a record of a decision nobody can change. The findings compete with the next deadline, and they usually lose.",
            },
            {
              label: "Spend one working hour on the map now: five stops, who absorbs the work at each, what it costs someone with no car and no paid leave, and the one change you can make before it goes out.",
              response: "An hour before is worth far more than a review after. The map is short by design, and its output is one change inside your own authority, not a new work plan.",
              recommended: true,
            },
            {
              label: "Send the change and add a monitoring item to watch for problems in the next quarterly report.",
              response: "Monitoring notices harm after people have absorbed it, and only the harm that shows up in what we already count. It is not a substitute for looking at the route first.",
            },
          ],
        },
        transfer: {
          prompt: "Which decision will you map this week, and who will ask you what you found?",
          options: [
            "Name the decision and the day you will map it, while it can still change",
            "Name the colleague or supervisor who will ask you about the result",
            "Write the first change you expect to make, then check whether the map agrees with you",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "An hour before is worth a quarter after",
            body: "<p>Mapping a decision is not an evaluation and it is not a formal review. It is a short, honest walk down the route the decision will take, done while there is still time to change it. One working hour is usually enough: five stops, a note at each about who absorbs the work, and one change you can make yourself.</p><p>Do it on a decision that is real and still open — a requirement being drafted, a notice being rewritten, a contract term being renewed, a measure being added, a field being redefined. A map of something already sent is a post-mortem, and post-mortems compete with next week’s deadline for attention. They lose.</p><p>The output is deliberately small. Not a new work plan, not a committee, not a report. One change inside your authority, one thing you will hand to the person who owns the stop you cannot change, and one sentence to the people carrying out the instruction telling them what changed and why. Small, specific and finished beats comprehensive and abandoned.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A decision-travel map",
            summary: "One page that follows an internal decision from the desk where it is made to the week it lands in. Copy the five rows into your own document and fill them from a decision you are working on now.",
            fields: [
              { label: "Decision and who decides", value: "New required attachment for a common service request. Decided by the program team; the finding it answers came from a documentation review. Reasoning recorded: yes, in one paragraph, and it will travel with the instruction." },
              { label: "How it is written and who reads it", value: "Bulletin plus a manual change. Two sentences are ambiguous about when the attachment is not required, so a cautious reader will require it always. Fix: name the exception explicitly and say who to ask when a case does not fit." },
              { label: "Where it lands and who absorbs the work", value: "Lead agency staff explain it in visits that are already full; providers chase signatures and carry the payment gap; the required field in the case system will not let a record save without the attachment, so the written exception does not exist in practice." },
              { label: "What it costs a person in time, money and worry", value: "An appointment booked weeks out, a ride to reach it, unpaid time off, postage and a ten-day window. For a household without a car or paid leave, this is the difference between a service continuing and a service pausing." },
              { label: "First change and who will ask you about it", value: "Lengthen the window, accept the attachment by phone or email as well as by mail, and fix the required field so the exception is usable. Owner for the field change named; review at the agreed point; supervisor will ask for the result." },
            ],
            action: "Copy the five rows, fill them in for one decision that is still changeable, make the change that is inside your own authority, and send the rest of the map to the people who own the stops you do not.",
          },
          {
            type: "list",
            heading: "Checks you can run before a decision is final",
            items: [
              "Read the notice out loud as someone who has never heard of the division. Does it say what changed, what to do, by when, what happens if they do nothing, and who to ask?",
              "Ask what this requires of a person with no car, no printer, no paid leave and no reliable mail.",
              "Check whether the flexibility in the policy is actually possible in the systems staff work in.",
              "Write the reasoning into the instruction so the people carrying it out do not have to guess and default to the strictest reading.",
              "Offer more than one way in: phone, email, mail, in person, and a person who can help complete it.",
              "Name the exception explicitly, and name the office to ask when a situation does not fit the rule.",
            ],
          },
          {
            type: "accordion",
            heading: "Four questions to sit with before it is final",
            items: [
              { title: "Who could be helped, burdened, excluded or misunderstood by this?", body: "<p>Answer with specific people and specific circumstances, not with categories. “Anyone without a car or paid leave in a county with one clinic” is usable. “Vulnerable populations” is not.</p>" },
              { title: "Whose expertise is missing from this room?", body: "<p>If the people who will carry the result are not represented, say so plainly in the record. Where community members, people with disabilities, families, interpreters or culturally specific organizations are brought in as advisors, reviewers or co-designers, they are doing professional work and are compensated for it.</p>" },
              { title: "Does this make sense to someone who does not know how the division works?", body: "<p>Plain language is not a lower standard; it is a harder one. If the instruction cannot be explained in a short sentence, the difficulty is usually in the decision, not in the reader.</p>" },
              { title: "If harm or exclusion has already happened, what would accountability require?", body: "<p>Ordinarily: saying what happened without hedging, fixing the design rather than the person, telling the people affected what changed, and not requiring anyone to relive an experience to be believed. Repair is a separate obligation from better design, and it belongs to the office responsible for the decision.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Change the stop you own",
            control: "You control the wording, the window, the field, the route and the reasoning at your own stop on the trip.",
            failure: "Do not send the whole map upward and wait for a decision. Waiting turns a one-hour improvement into a quarterly agenda item.",
            next: "Make the change you own before the decision goes out, then hand the rest of the map to the named owners with the burden line attached.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-03-4-check",
            question: "Which entry on a decision-travel map is complete enough to act on?",
            options: [
              { text: "“Notice may be hard to understand. Consider revising.”", correct: false },
              { text: "“Notice is written from manual language and does not say what to do or by when; it stops people who are new to the program and people reading in a second language. Owner: communications lead. First change: plain-language rewrite tested by compensated community reviewers before it mails. Reviewed at the agreed point.”", correct: true },
              { text: "“People do not respond to notices. First change: send a second notice.”", correct: false },
            ],
            feedbackCorrect: "Yes. The barrier is named as ours, the people stopped are named, there is an owner, one specific change and a review point.",
            feedbackIncorrect: "A complete line names the barrier as the organization’s, says who it stops, names an owner, states one specific change, and says when it will be checked.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone: Which stop on this trip do I have real authority over, and what is the one change I will make there before the decision goes out? If you use this map with a team, keep everyone’s reflections private and discuss the decision, never the person.",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Public power and institutional impact",
    subtitle: "One page for any decision that will reach someone’s week",
    quote: "Nothing arrives the way it left. Map the trip while the decision can still change.",
    use: {
      purpose: "Keep the route in view while you draft a requirement, rewrite a notice, redefine a field, set a measure or renew a contract term.",
      remember: [
        "Public power sits in definitions, forms, timelines, money, words, measures and silence.",
        "Each handoff adds caution, delay and local extras that nobody decided.",
        "Burden arrives as learning costs, compliance costs and psychological costs, and it lands unevenly.",
        "A measure counts what reached the route we built; a low number is a question, not an answer.",
        "Uniform procedure is not equal access. Comparable results usually require a change in the design.",
      ],
      doNext: "Spend one hour mapping a decision that is still open, then make the change that is inside your own authority.",
    },
    sections: [
      {
        heading: "Before the decision is final",
        items: [
          "Write the reasoning down: what problem this solves, what it does not require, who to ask when a case does not fit.",
          "Price the requirement in someone else’s time: appointments, rides, proof, postage, unpaid leave, waiting.",
          "Check that any flexibility in the policy is possible in the systems staff actually work in.",
          "Choose the least costly version that still solves the problem, and say why you chose it.",
        ],
      },
      {
        heading: "The decision-travel map, in short",
        items: [
          "Decision and who decides — including the reasoning that will travel with it.",
          "How it is written and who reads it — name the ambiguity a cautious reader will resolve strictly.",
          "Where it lands and who absorbs the work — lead agency staff, providers, the screens they work in.",
          "What it costs a person in time, money and worry — for a household with the least margin.",
          "First change and who will ask you about it — one change you own, plus an owner and a review point for the rest.",
        ],
      },
      {
        heading: "When you write the instruction or the notice",
        items: [
          "Say what changed, what to do, by when, what happens if the person does nothing, and who to ask.",
          "Name the exception explicitly; an unnamed exception is not available to anyone.",
          "Offer more than one way in, in the languages people actually use, tested by compensated community reviewers.",
          "Publish findings with their limits attached, so a visibility gap never travels as a fact about people.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, as a useful starting module.",
          "Quality, compliance and performance staff, as a useful starting module.",
          "Data, research and evaluation staff, as a useful starting module.",
          "Contracts, fiscal and procurement staff, as a useful starting module.",
          "Executive and senior leaders, as a useful starting module.",
        ],
      },
      {
        heading: "Related modules in Foundations",
        items: [
          "Intercultural practice in public disability services",
          "Person-centered thinking in state systems",
          "Bias, assumptions, and accountability",
          "Accessible and respectful communication",
          "Participation and voice",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services", href: "https://mn.gov/dhs/", note: "The department’s public site: how it is organized, the programs it administers, and the public-facing information that people receiving services are expected to find and use." },
    { title: "Minnesota DHS — disability services news, initiatives, reports and workgroups", href: "https://mn.gov/dhs/partners-and-providers/news-initiatives-reports-workgroups/disability-services/", note: "Where disability services policy changes, reports and workgroup activity are published for lead agencies and providers — the first stop after a division decision is made." },
    { title: "Minnesota Olmstead Plan and the Olmstead Implementation Office", href: "https://mn.gov/olmstead/", note: "Minnesota’s statewide commitment to integrated, self-determined lives for people with disabilities, and the reporting structure that tracks whether state decisions move toward it." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota’s policy, training and technical resource on disability access and rights, including guidance state staff can use when a decision affects accessibility." },
    { title: "Minnesota Office of Administrative Hearings", href: "https://mn.gov/oah/", note: "State rulemaking, public comment and administrative hearings — the formal route by which an agency decision becomes a rule and by which the public can respond to it." },
    { title: "Minnesota DHS — language access", href: "https://mn.gov/dhs/general-public/about-dhs/language-access/", note: "Interpreting, translation and language access information for people who use DHS services; relevant to every notice, form and deadline sent to households with limited English proficiency." },
    { title: "plainlanguage.gov", href: "https://www.plainlanguage.gov/", note: "Federal plain-language guidelines and techniques for writing public notices, letters and instructions people can act on the first time they read them." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials, and instruction that does not assume one default learner." },
  ],
};

export default pack;
