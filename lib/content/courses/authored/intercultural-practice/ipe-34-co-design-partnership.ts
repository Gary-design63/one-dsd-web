import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Internal leadership · Module 34: Co-design and compensated partnership.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-34-co-design-partnership",
    indexNumber: 1176,
    seriesLabel: "Intercultural Practice and Equity · Internal leadership",
    title: "Co-design and Compensated Partnership",
    subtitle: "Asking people what they think of a finished plan is not co-design, and unpaid expertise is not a partnership. Four lessons on opening a decision early, paying for the work, sharing decision rights, and writing an engagement plan people can hold you to.",
    scope: "For internal DHS and DSD staff who convene, fund, design or depend on work with people outside the division: policy and program staff; communications and training staff; data, research and evaluation staff; contracts, fiscal and procurement staff; supervisors and managers; and executive and senior leaders, for whom this is a useful place to start. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception. People with disabilities, families, interpreters and culturally specific organizations take part in this work as compensated co-designers, advisors and reviewers; they are partners in the division's work, not learners in this curriculum.",
    treatment: "Four short lessons with Minnesota DSD examples, scenarios, sorting and flashcard practice, private reflection prompts, and a one-page co-design engagement plan you can copy into a decision you own",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-08.jpg",
    coverAlt: "A colleague presents an idea to two others gathered around a table.",
    introTranscript: "Most divisions already talk with people outside them. Public comment, advisory councils, listening sessions, a standing meeting with advocacy organizations. The work is real, and almost none of it is co-design. Co-design means the people most affected by a decision help set what the question is, what the options are, and what a good result would look like, before the division's own preferences have hardened — and it means paying them for that work the way any other expertise is paid for. This module covers the four levels of partnership and the single question that separates them, how to price and route compensation so an invitation is not a request for free labor, how to state what authority a group actually holds and close the loop when the division goes a different way, and how to put all of it on one page you would be willing to send to the people you are inviting.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Tell the difference between informing, consulting, involving and co-designing a decision, and write down what is genuinely open and what is fixed before the first invitation goes out.",
        "Plan compensation as part of the design of the work: the hours, the rate, the payment route, the timing, and the participation costs the division carries rather than expecting people to absorb.",
        "State in writing what authority a co-design group holds — advises, recommends, or decides jointly on named points — and design the report-back that says what changed, what did not, and who decided.",
        "Name who is missing from a table and the specific design choices that keep them out, and identify what would have to change for them to take part.",
        "Draft a one-page co-design engagement plan for one real decision, including what is open, who shapes it, the terms of the work, decision rights and how you will know the engagement was real.",
      ],
      evidence: [
        "Four worked scenarios drawn from an advisory group invited after the framework was set, an invitation with no money behind it, a recommendation overtaken by a budget decision, and an engagement plan that cannot say what is open.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates the fee for the work, the participation costs the division carries, and the things a payment cannot substitute for.",
        "A completed one-page engagement plan with an open list, priced terms, decision rights, a report-back date and a test of whether the engagement was real.",
      ],
      appliedNextStep: "Choose one decision your team owns that has not been framed yet. Write two short lists — what is genuinely open, and what is fixed and why. Price the engagement, including preparation, review, travel, care, interpreting and formats. Then take the one-page plan to the person who owns the decision, before any invitation is drafted.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in state contracting, grant or payment rules that affects how the division may pay individuals and community organizations for advisory, review or design work",
        "A change in how DHS or DSD convenes advisory bodies, councils or community input processes, or in which offices are responsible for them",
        "Feedback from compensated co-designers that the terms, payment timing or report-back described here do not match what they actually experienced",
      ],
      relatedDoor: "Contracts, grant awards, payment routes, conflict-of-interest determinations and appointments to official advisory bodies are decided by the responsible DHS contracting, grants, fiscal and legal offices; this module helps you design the partnership you bring to them, not make those decisions yourself.",
      toolkitQuestion: "How could the people most affected by this decision have shaped it earlier, and what would they have had to be paid for that to be real?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-34-1",
        number: 1,
        title: "What co-design actually changes",
        summary: "Inform, consult, involve, co-design. One question separates them, and mislabeling the level costs more trust than telling people plainly what is fixed.",
        minutes: 11,
        learning: {
          objective: "Distinguish informing, consulting, involving and co-designing in a real DSD decision, and write down what is open, what is fixed and why, before the first invitation goes out.",
          takeaways: [
            "The level of partnership is set by what can still change, not by how the meeting feels or what it is called. If the problem statement, the options and the criteria arrived with the agenda, the engagement is consultation.",
            "Co-design gives people outside the division a hand in framing the problem and in writing the criteria a decision will be judged against, not only a chance to react to a draft someone else wrote.",
            "Naming what is fixed is part of respect. Legal requirements, appropriations and effective dates are real. Hiding them behind an impression of openness costs far more than stating them at the start would.",
            "A common starting point sounds like fairness: we ask everyone the same questions, so we are already even. Treating a uniform process as an even process is the Minimization stage of the intercultural development continuum, and movement toward Acceptance and Adaptation shows up as changes to the process itself, not as a better attitude toward it.",
          ],
          evidence: "A scenario about an advisory group invited after the framework was set, a four-way comparison of what is open at each level of partnership, and a knowledge check on what makes an engagement co-design rather than consultation.",
          appliedNextStep: "Take one decision your team is working on now and write two short lists: what is genuinely open, and what is fixed and why. Take both lists to the person who owns the decision before anyone outside the division is invited.",
        },
        scenario: {
          context: "A DSD program team is redesigning how a waiver service is authorized. The framework is drafted, the options have been narrowed to two, and the effective date is set in statute. A leader asks the team to bring in the community and suggests an advisory group that will meet three times over two months and give feedback on the two options.",
          prompt: "What is the most honest and useful way to set that group up?",
          options: [
            {
              label: "Run the group as planned and describe it as co-design, since community members will help choose which of the two options is adopted.",
              response: "The name will not survive the first meeting. People will ask why those two options are the only two, and the group will spend its short time on a question the team cannot reopen. Calling narrow consultation co-design is the thing that makes the next invitation harder to accept, and the next one after that.",
            },
            {
              label: "Run the group as planned, describe it accurately as consultation on two options, say plainly what is fixed and why, and name the next decision in this line of work that can be opened earlier.",
              response: "This is honest and it is usable. People can decide whether the work is worth their time, the team gets real reactions to real options, and the commitment to open the next decision earlier is something the group can hold you to. It also puts the fixed parts — the statutory date, the appropriation, the required content — on the table at the start instead of letting people find them one at a time.",
              recommended: true,
            },
            {
              label: "Postpone outside involvement until the redesign is finished, then hold listening sessions on how the new process is working.",
              response: "Listening afterward is worth doing and it is not a substitute. By then the authorization steps people describe are the ones they are living under, and any change is an amendment rather than an edit. It also asks people to describe a burden the division has already created, which is a costly thing to ask for and a hard thing to be asked.",
            },
          ],
        },
        transfer: {
          prompt: "Where in your own work does a decision get framed before anyone outside the division sees it?",
          options: [
            "Name one decision your team made recently that people outside the division learned about only after it was drafted.",
            "Write down who framed the question and who chose the options that were considered.",
            "Identify the earliest point at which an outside view would still have changed the framing.",
            "Name one decision coming up where that earlier point is still ahead of you.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Four levels, and the one question that separates them",
            body: "<p>Most divisions already do some version of this work. Public comment periods, advisory councils, listening sessions, surveys, a standing meeting with provider associations and advocacy organizations. All of it is real work, none of it is the same thing, and the differences matter more than the names anyone uses.</p><p>One question separates the levels: what can still change because of this conversation? At the first level the division has decided and is telling people. At the second it has framed a question and is asking for reactions to options it chose. At the third, people from outside sit on the working group, but the problem statement and the criteria arrived with the first agenda. At the fourth — co-design — the people most affected help decide what the problem is, what the options are, and what a good result would even look like, and that happens before the division's own preferences have set.</p><p>None of these is dishonest by itself. Telling people about a decision that has been made is necessary and often done badly. Consulting on two workable options is legitimate. The damage comes from mislabeling: running the second level and calling it partnership. People who have given their afternoons to something that turned out to be a reaction round do not come back, and the division loses the ability to do the harder work later, when it needs it most.</p>",
          },
          {
            type: "tabs",
            heading: "The same redesign, seen at four levels",
            tabs: [
              { label: "Inform", body: "<p>The division decides how the service will be authorized and publishes the change with a clear explanation, usable formats and a named contact for questions.</p><p>Open: nothing about the decision. The explanation, the formats, the reading level and the timing of the notice are still worth getting right, and often are not. What people get back: an accurate account of what is changing and when.</p>" },
              { label: "Consult", body: "<p>The division drafts two workable options and asks people which works better and what each would cost them.</p><p>Open: the choice between the two, and details inside them. Not open: the problem statement, the criteria, and whether a third option exists. What people get back: a summary of what was heard and which option was chosen. Done well, this is honest work. Described as partnership, it is not.</p>" },
              { label: "Involve", body: "<p>People from outside the division sit on the working group for the length of the project and see everything the group sees.</p><p>Open: most of the design, if the problem statement and the criteria are still being written. Usually not open: the framing that arrived with the first agenda. What people get back: a place in the room and, if the group is run well, an answer to every point they raise.</p>" },
              { label: "Co-design", body: "<p>The people most affected help set the problem statement, generate options and write the criteria the decision will be judged against, and they are paid for that work.</p><p>Open: the framing itself. Not open: legal requirements, the appropriation and any date fixed outside the division — all stated at the start, with the reason for each. What people get back: decision rights that are written down, and a report-back that says what changed.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "Three things co-design is often confused with",
            items: [
              { title: "A good listening session", body: "<p>A listening session collects experience. It is valuable, it is often the only way a division finds out that a process is failing, and it is not design work. The distinguishing feature is what people are asked to produce: a description of what happened to them, or a judgment about what the division should do next. Asking people to retell a difficult experience for the fourth time, with no decision attached to it, is extraction wearing the clothes of engagement.</p>" },
              { title: "A standing advisory council", body: "<p>A council that meets quarterly on an agenda the division sets is a durable relationship and a useful early warning. It becomes co-design only when specific decisions reach it while they are still open, with enough time to work on them, and with the council able to change the question rather than only answer it. A council used mainly to review completed work slowly fills with people who have stopped expecting to change anything, which is a loss that takes years to repair.</p>" },
              { title: "Hiring staff with lived experience", body: "<p>Hiring people with disabilities into policy, program and leadership roles is its own goal and it is overdue in most public organizations. It does not replace co-design. Treating one employee as the division's source of disability perspective is unfair to that employee and wrong as a method: their experience is their own, it is not a sample of the people a decision will reach, and nobody should have to offer their private life to do their job.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Write down what is open before you invite anyone",
            control: "You control the sentence that says what this engagement can change, and whether it is written before the invitation or discovered by participants in the third session.",
            failure: "Do not describe consultation as partnership because partnership sounds better. The people you are inviting have been in these rooms before and will identify the difference faster than you will.",
            next: "For your next engagement, write two lists — open, and fixed with the reason each item is fixed — and put the open list in the invitation itself.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-34-1-check",
            question: "A team invites people who use a service to three sessions on a new process. The problem statement, the two options and the criteria for choosing between them were written by the team before the first session. What is this engagement?",
            options: [
              { text: "Co-design, because participants will help choose which option is adopted.", correct: false },
              { text: "Consultation on options the team framed. It can still be good work, and it should be described that way, with the fixed parts and the reason for each stated at the start.", correct: true },
              { text: "Neither, because participants cannot usefully influence a decision this far along.", correct: false },
              { text: "Co-design, because people most affected are in the room for the whole process.", correct: false },
            ],
            feedbackCorrect: "Yes. The level is set by what is still open. Naming it accurately protects the work and the relationship at the same time.",
            feedbackIncorrect: "Ask what these sessions can change. If the problem, the options and the criteria arrived with the agenda, the engagement is consultation — which can be worth doing, and should be called what it is.",
          },
          {
            type: "quote",
            text: "I have been on four of these groups. The one I still talk about is the one where they told us on the first day which three things they could not change, and why. We spent the rest of the time on what was actually ours, and something we wrote is in the final version.",
            cite: "Composite community advisor perspective, illustrative",
          },
          {
            type: "statement",
            body: "A private reflection, for you only and never collected: think of one decision in your work that people outside the division learned about only after it was drafted. Who framed the question? What would a person most affected by it have asked first? Nothing here is recorded, and there is nothing to submit.",
          },
        ],
      },
      {
        id: "ipe-34-2",
        number: 2,
        title: "Paying for expertise, and what the payment has to survive",
        summary: "Budget before you invite. The fee covers preparation and review as well as the meeting, and participation costs are the division's to carry, not a test of who can afford to help.",
        minutes: 11,
        learning: {
          objective: "Price a co-design engagement before it is offered: the hours, the rate, the payment route and timing, and the participation costs the division carries rather than expecting people to absorb them.",
          takeaways: [
            "Budget before you invite. An invitation issued without a funded rate and a working payment route is a request for free work, whatever was intended by it.",
            "Pay for preparation and review, not only for the hour in the room. Reading the draft, talking with other families beforehand, traveling, and answering a follow-up question are all the work.",
            "Participation costs are separate from the fee and belong to the division: travel and parking, care for a family member, interpreting and captioning, usable formats, technology support, a room that works. Leaving them to participants sets a price on taking part, and the people who can pay it are not the people whose experience you most need.",
            "The payment route itself can be the barrier. Vendor setup, tax forms, a wait of several weeks, and payments that count as income for someone receiving income-tested benefits are all real, and all of them can be planned around if they are raised before the invitation rather than after the first session.",
          ],
          evidence: "A scenario about an engagement with no line in the budget, a sorting exercise separating the fee, participation costs and things a payment cannot substitute for, and a knowledge check on spending a limited engagement budget honestly.",
          appliedNextStep: "Take one engagement your team is planning and write the full cost on one line each: fee for session time, preparation and review time, travel, care, interpreting and captioning, formats and technology support. Take that number to whoever holds the budget before the invitation is drafted.",
        },
        scenario: {
          context: "A DSD team wants six people — three who use the service, two family members, and one staff member from a culturally specific community organization — to help redesign a set of notices over four sessions. The project has no engagement line in its budget. A manager suggests offering gift cards from an existing supply, and asking the community organization to take part as a partner.",
          prompt: "What should happen before the invitation goes out?",
          options: [
            {
              label: "Send the invitation with the gift-card offer, and be transparent that this is what the project can do right now.",
              response: "Transparency helps and it does not fix the arrangement. A gift card offered in place of a rate sets the value of the expertise, and everyone in the room knows it. Asking a community organization to contribute staff time without a contract moves a division cost onto an organization that is almost always funded more thinly than the division is.",
            },
            {
              label: "Ask the organization to take part without payment this round, with a commitment to pay for the next one.",
              response: "This is the most common version, and it is why many organizations now decline. A commitment to pay later is not a payment, and the organization carries the cost of the round that actually decided something. It also puts the organization in the position of explaining to its own community why it worked for free.",
            },
            {
              label: "Price the work first — hours, preparation, review, travel, care, interpreting and formats — find the route that can pay individuals and the organization, and move the first session rather than the payment.",
              response: "This treats compensation as part of the design rather than a courtesy. It surfaces the real choice: a smaller, properly paid engagement now, or a larger unpaid one that damages the relationship the division will need for the next decision. Pricing first also lets you put the right question to the contracting and fiscal offices early, while there is still time for an answer.",
              recommended: true,
            },
          ],
        },
        transfer: {
          prompt: "What would it cost to pay people properly for the next engagement you are part of?",
          options: [
            "Write the total hours you are actually asking for, including reading and review between sessions.",
            "Find out what the division pays a consultant for an hour of comparable expertise, and start there.",
            "List the participation costs — travel, parking, care, interpreting, captioning, formats — as separate budget lines.",
            "Find out the real payment timeline from the office that owns it, and decide what you will say about it in the invitation.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What you are actually buying",
            body: "<p>When a division asks someone who uses a service to help redesign it, it is buying expertise it does not have and cannot generate internally. That expertise was acquired at a cost the division did not pay: years of navigating the process, explaining the same situation to a new worker, finding out what a form meant by getting it wrong and living with the consequence. Treating it as a favor, or as a chance for the person to be heard, misprices it in a way everyone notices.</p><p>The fee is for time, and the time is more than the sessions. Reading a draft beforehand is work. So is talking with three other families first, because you were asked to bring more than your own view. So is the travel, and for a person whose energy is limited, so is the day afterward. An engagement priced at meeting hours alone becomes an engagement where preparation quietly does not happen — and then the division concludes that the group did not have much to add.</p><p>Participation costs are a separate matter and they belong to the division: travel and parking, care for a child or an adult family member during the session, interpreting and captioning, a document in a format the person can actually read, help with an unfamiliar meeting platform, a room with somewhere to sit and a way to hear. Leaving those to participants puts a price on taking part, and it is paid by exactly the people whose experience the division most needs.</p>",
          },
          {
            type: "list",
            heading: "The line items an engagement budget usually forgets",
            items: [
              "Preparation time: reading the draft, reviewing a summary of the data, talking with other people before the session.",
              "Review time between and after sessions: checking notes, responding to a revised draft, answering one more question.",
              "Travel, mileage and parking — and the extra hours a trip costs someone who does not drive.",
              "Care for a child or an adult family member, at the hours the sessions are actually held.",
              "Interpreting, captioning and translation of materials, with the lead time each of those genuinely requires.",
              "Usable formats produced before the meeting rather than after it, and the staff hours to produce them.",
              "A contract or grant for a community organization whose staff time, space or recruiting you are asking for, separate from payments to individuals.",
              "The report-back: writing it, translating it, and sending it in the formats people asked for.",
            ],
          },
          {
            type: "sorting",
            id: "ipe-34-2-sort",
            heading: "Fee, participation cost, or something a payment cannot substitute for?",
            categories: ["Fee for the work", "Participation cost the division carries", "Something a payment cannot substitute for"],
            items: [
              { text: "Two hours of session time and one hour of reading the draft beforehand.", category: "Fee for the work" },
              { text: "Mileage and parking for someone traveling in from outside the metro area.", category: "Participation cost the division carries" },
              { text: "A written answer explaining why the group's main recommendation was not adopted.", category: "Something a payment cannot substitute for" },
              { text: "An interpreter booked with enough lead time to be the same interpreter at every session.", category: "Participation cost the division carries" },
              { text: "Reviewing a revised draft between sessions and sending comments back.", category: "Fee for the work" },
              { text: "Decision rights stated in writing before the first session.", category: "Something a payment cannot substitute for" },
              { text: "Care for a family member during a session held at four in the afternoon.", category: "Participation cost the division carries" },
              { text: "A contract with a community organization for the hours of the staff member you asked to facilitate.", category: "Fee for the work" },
              { text: "Being told at the start which parts of the decision are fixed, and why.", category: "Something a payment cannot substitute for" },
            ],
          },
          {
            type: "accordion",
            heading: "Four practical problems with paying people, and how to plan around them",
            items: [
              { title: "Vendor setup and tax forms", body: "<p>Paying an individual who has never done business with the state usually means a registration step and a tax form, and for some people the request itself is alarming. Plan for it. Say in the invitation what will be asked for and why, offer help from someone who has done it before, and start the setup when the invitation goes out rather than after the first session. If the setup cannot be completed for a particular person, that is a question for the fiscal and contracting offices early — not a reason to quietly drop them from the group.</p>" },
              { title: "The wait", body: "<p>A payment that arrives six weeks after the session is a different offer than one that arrives in two, and for someone on a tight budget the difference can decide whether they take part at all. Find out the actual timeline before you promise one. Say it plainly in the invitation, in the worst case rather than the best. Then treat a long wait as a problem to raise with the offices that own the process, rather than a fact of life the participant absorbs on the division's behalf.</p>" },
              { title: "Income-tested benefits", body: "<p>For some people a payment counts as income and can affect benefits they rely on. The amount, the timing and the form of the payment can all matter. Do not guess on a person's behalf, and do not decide for them that they should be paid less. Say in the invitation that payment is offered, describe how and when it would be made, offer a choice about timing where the division can, and point people to the office or advocate who can answer questions about their own situation.</p>" },
              { title: "Organizations are not the same as individuals", body: "<p>Asking a culturally specific organization to bring staff time, recruit participants, translate materials or host a session is asking for work it would otherwise bill for. That needs a contract or a grant, not an invitation to partner. Recruiting is the item most often taken for free: the organization spends relationships it took years to build, and the division gets the participants. Price it, and say whose relationships are being spent.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Put the rate in the invitation",
            control: "You control whether the first message a person receives says what the work is, how many hours it involves, what it pays, and when the payment actually arrives.",
            failure: "Do not invite first and sort out payment later. The people most likely to accept an unpriced invitation are the ones who can afford to, and the ones who cannot will decline without telling you why.",
            next: "Before your next invitation is sent, price the full engagement — fee, preparation, review, travel, care, interpreting and formats — and take the number to whoever holds the budget.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-34-2-check",
            question: "A team has funding for a limited number of paid hours of community co-design work and wants six people across four sessions. Which plan is the most honest use of the money?",
            options: [
              { text: "Invite six people to all four sessions and describe the payment as a thank-you for their time, so the money reaches more people.", correct: false },
              { text: "Run fewer, longer sessions with a smaller group, pay the full rate including preparation and participation costs, and say in the invitation exactly what is funded.", correct: true },
              { text: "Invite all six, pay for session hours only, and ask people to do the reading on their own time.", correct: false },
              { text: "Invite all six, pay three of them at the full rate, and ask the other three to take part as volunteers.", correct: false },
            ],
            feedbackCorrect: "Yes. A smaller, properly paid engagement produces better work and a relationship you can use again. Spread thin as a thank-you, the same money prices the expertise at nothing.",
            feedbackIncorrect: "Ask which version you would accept if it were your expertise and your afternoon. Preparation and participation costs are part of the work, and a payment that is described as a gesture is read as one.",
          },
          {
            type: "statement",
            body: "A private reflection, for you only and never collected: think of the last time you asked someone outside the division for their time. What did it cost them to say yes — hours, travel, care, energy, the retelling of something difficult — and what did the division pay for? Write it down somewhere you will see it before the next invitation goes out.",
          },
        ],
      },
      {
        id: "ipe-34-3",
        number: 3,
        title: "Decision rights, who is missing, and the report-back",
        summary: "Ambiguity about authority is read as power and then felt as its absence. Write the authority sentence, notice who your design keeps out, and close the loop in writing with a date on it.",
        minutes: 11,
        learning: {
          objective: "State in writing what authority a co-design group holds, identify who is missing and what would have to change for them to take part, and design a report-back that says what changed, what did not, and who decided.",
          takeaways: [
            "Write the authority sentence before the first session: this group advises, or this group recommends and every recommendation receives a written answer, or this group decides jointly on these named points. Left unsaid, authority is assumed and then experienced as a broken promise.",
            "Absence is a design result, not a preference. Meeting times, locations, formats, notice periods, the language of the materials and the wording of the invitation decide who is able to be there.",
            "One person does not represent a community, and treating them as a representative is both a burden and an error. Say what you are asking of each person: their own experience, their organization's position, or their professional view on a specific question.",
            "The report-back is the part most often skipped and the part people remember. What was adopted, what was not and why, who decided, and what is still open — sent to everyone who took part, in the formats they use, by a stated date.",
          ],
          evidence: "A scenario about a recommendation overtaken by a budget decision, four authority sentences and what each commits the division to, and a knowledge check on what makes a report-back usable.",
          appliedNextStep: "Write one authority sentence for a group you convene or attend, and one report-back commitment with a date attached. Send both to the group before the next session, and to the person who owns the decision before that.",
        },
        scenario: {
          context: "A DSD co-design group of eight people has spent four sessions on how a quality review will ask people about their experience of a service. The group recommends a shorter set of questions, offered by phone and in person as well as on paper, with interpreters arranged in advance. Two weeks later a budget decision makes the phone and in-person options impossible this cycle. The team lead is about to send out the final design.",
          prompt: "What does the team owe the group, and what should the message say?",
          options: [
            {
              label: "Send the final design with a warm note thanking the group for its contribution.",
              response: "The thanks is not the problem; the silence about the change is. People will see that the recommendation they spent four sessions on is missing, and will not know whether it was rejected, overtaken, or never seriously considered. That uncertainty is the single most common reason people stop accepting invitations.",
            },
            {
              label: "Send the group the change before the design is final: what was adopted, what was not, the reason, who made the decision, and what the team will do to reopen it.",
              response: "This is the report-back doing its work. It also separates rejection from a constraint, which matters here: the group's recommendation was not judged wrong, it was outrun by a budget decision someone else made. Naming the decision maker and the next opportunity keeps the relationship usable, and gives the group something concrete to push on.",
              recommended: true,
            },
            {
              label: "Keep the group's recommendation in the published design, noting that parts of it will be implemented when funding allows.",
              response: "This reads better and it is not true for this cycle. A design that describes options people cannot actually get will be found out by the first person who asks for one, and the group will be publicly associated with a promise the division did not keep.",
            },
          ],
        },
        transfer: {
          prompt: "What do the people who gave you input recently know about what happened to it?",
          options: [
            "Name one group or set of participants who have not heard the result of work they contributed to.",
            "Write the three things they would most want to know: what was adopted, what was not and why, and who decided.",
            "Choose the format and the sender, and set a date for the message.",
            "Decide what you will say about the parts that are still open, including the honest answer that one of them is not moving.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Say what the group can decide",
            body: "<p>Ambiguity about authority is read as power. A group told it will help shape a decision will reasonably assume it can change that decision, and will discover otherwise at the moment when the discovery costs the most. The fix is a sentence, written before the first session and repeated at the top of every agenda.</p><p>There are only a few honest versions. This group advises; the division will bring questions while they are open and is not bound by the answers. This group recommends; every recommendation receives a written answer naming the decision maker and the reason. This group decides jointly on these specific points, listed here, and the division will not override them without coming back. Any of these can be right for a given piece of work. What is never right is leaving it unsaid and letting people infer.</p><p>The sentence does more than manage expectations. It tells you who should be in the group, how many hours are worth asking for, what the sessions should produce, and what the report-back will have to answer. A group with real authority over three narrow points is usually worth more to a division than a group with vague influence over everything, because the three points actually change.</p>",
          },
          {
            type: "flashcards",
            heading: "Four authority sentences, and what each commits you to",
            cards: [
              { front: "This group advises.", back: "<p>You will bring questions while they are still open, listen, and use what is useful. You are not bound by the advice. What you still owe: a written account of what was said and what you did with it.</p>" },
              { front: "This group recommends.", back: "<p>Recommendations are recorded, and each one receives a written answer naming the decision maker and the reason. You may decline a recommendation. You may not leave one unanswered.</p>" },
              { front: "This group decides jointly on these points.", back: "<p>A short, specific list: the wording of a notice, the questions in a review, the order of the steps. Inside the list the division does not override the group without returning to it. Outside the list, say so plainly and say where the line is.</p>" },
              { front: "This group can say not yet.", back: "<p>The strongest version, and the one to offer sparingly: the group can hold a release until a named condition is met. If you offer it, honor it the first time it is used, or you never offered it.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "Who is usually missing, and the design choice that keeps them out",
            items: [
              { title: "People who do not live near the office", body: "<p>Sessions held downtown during business hours select for people who live nearby and control their own schedule. A remote option helps and is not enough on its own: connection quality, device access and comfort with the format vary widely, and a person on a phone in a parking lot is not participating on equal terms. Ask what would work, budget for travel and for the hours travel takes, and hold some sessions where people already are.</p>" },
              { title: "People who use interpreters or communication supports", body: "<p>Interpreting booked late, a different interpreter at every session, or a fast discussion with no pauses produces participation on the attendance list and very little of it in the room. Book early, keep the same interpreters, send them the materials in advance, and run the meeting at a pace that makes interpreting possible. The same applies to captioning, and to people who use communication devices, who need time the agenda has to actually contain.</p>" },
              { title: "People working shifts, caring, or managing a health condition", body: "<p>Four consecutive weekly sessions at a fixed hour is a design that selects for stable schedules and predictable energy. Offer more than one way to contribute: a session, a phone conversation, written comments, a recorded response. Say clearly that missing one session does not remove someone from the work, and mean it.</p>" },
              { title: "People with a difficult history with the division", body: "<p>The people with the sharpest information are often the ones most tired of giving it. An invitation from the same division that denied a request or closed a case is not neutral mail. Sometimes the useful route is through an organization that already holds the relationship, with that organization paid for the work of holding it — and with the division prepared to hear something blunt without treating it as a complaint to be processed.</p>" },
              { title: "Where a decision reaches Tribal Nations", body: "<p>This is a distinct government-to-government relationship with its own requirements, and a division co-design group neither substitutes for it nor absorbs it. Bring it to the Office of Indian Affairs and to the Department of Human Services offices that handle tribal matters, and follow their direction on how and whether to proceed.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Close the loop in writing, with a date",
            control: "You control whether people who gave you their time find out what happened to it, and whether they hear it from you or discover it in a published document.",
            failure: "Do not let a change of course reach the group as a finished product. A recommendation overtaken by a budget or a legal requirement is a completely different message than a recommendation that was rejected, and only one of them damages the relationship.",
            next: "Pick one group you have taken input from recently and send the missing report-back: what changed, what did not, why, and who decided.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-34-3-check",
            question: "Which report-back is most likely to keep a co-design group willing to work with the division again?",
            options: [
              { text: "A thank-you message with a link to the published decision, sent once the decision is final.", correct: false },
              { text: "A short message before the decision is final: what was adopted, what was not, the reason, the name of the decision maker, and what is still open.", correct: true },
              { text: "A full summary of everything the group discussed, circulated for accuracy, with the decision to follow later.", correct: false },
              { text: "A standing invitation to the next engagement, sent as soon as this one finishes.", correct: false },
            ],
            feedbackCorrect: "Yes. What people want to know is the fate of their own contribution, in time to respond to it, with a person attached to the decision.",
            feedbackIncorrect: "Ask what a participant actually wants to know: did the thing I argued for happen, and if not, who decided and why. A link to a final document leaves them to hunt for that themselves.",
          },
          {
            type: "quote",
            text: "We told them the same thing three rounds running and never heard back. Then a new project asked us for a morning. Our board said no. It was not about the morning.",
            cite: "Composite community organization perspective, illustrative",
          },
          {
            type: "statement",
            body: "A private reflection, for you only and never collected: picture the last group you asked for input. Who was not in it, and which specific choice — the hour, the place, the format, the notice period, the wording of the invitation — kept them out? Nothing here is recorded.",
          },
        ],
      },
      {
        id: "ipe-34-4",
        number: 4,
        title: "Your co-design engagement plan",
        summary: "One page you would be willing to send to the people you are inviting: what is open, who shapes it, the terms, the decision rights, and how you will know it was real.",
        minutes: 11,
        learning: {
          objective: "Draft a one-page co-design engagement plan for one real decision, and test it against the question of whether you would be willing to send it to the people you intend to invite.",
          takeaways: [
            "A plan that fits on one page can be shown to the people you are inviting. That is the test: if you would not send it to them, it is not finished, and the reason it is not finished is usually specific.",
            "Three numbers make a plan honest: the hours you are asking for, the rate you will pay, and the date the report-back will be sent.",
            "A plan should name what would make you stop — the point at which you would postpone rather than run an engagement you cannot pay for or act on.",
            "How you will know it was real is a question about the final decision, not about satisfaction with the meetings. Point to something in the result that exists because of the group, and to people who would take another invitation.",
          ],
          evidence: "A scenario about an engagement plan that looks complete but cannot say what is open, a completed one-page plan with five lines, and a knowledge check on which missing line changes the engagement most.",
          appliedNextStep: "Fill in the one-page plan for a decision your team owns, take it to the person who owns that decision, and keep rewriting the first line — what is genuinely open — until it is true.",
        },
        scenario: {
          context: "A supervisor reviews a draft engagement plan from her team. It has a purpose (gather community perspectives on the new process), a schedule of four sessions, a list of six organizations to invite, and a communications approach for sharing results afterward. There is no line about what the sessions can change, no rate, and no report-back date.",
          prompt: "Which single change would do the most to make this plan usable?",
          options: [
            {
              label: "Add the payment rate and the route, since the plan cannot be sent to anyone without them.",
              response: "Close, and it is the second change rather than the first. Without a rate the invitation is a request for free work. But a well-funded engagement about a decision that has already been made is still an engagement people will regret accepting, and money does not fix that.",
            },
            {
              label: "Add one sentence naming what these four sessions can change and what is already fixed, then price and schedule the plan around that sentence.",
              response: "That sentence decides everything else: who should be invited, how many hours are worth asking for, what the sessions actually do, and what the report-back will have to answer. Written first, it also tends to shorten the plan, because a team forced to name what is open often finds that less is open than the purpose statement implied — which is exactly the thing worth discovering before the invitations go out.",
              recommended: true,
            },
            {
              label: "Add a fuller communications approach for sharing results publicly once the sessions are finished.",
              response: "Useful later. A public summary of an engagement whose effect on the decision was never defined tends to become a record that consultation happened, which is the thing people are most tired of seeing.",
            },
          ],
        },
        transfer: {
          prompt: "Which decision will you write the plan for, and who has to agree to the open list?",
          options: [
            "Name one decision your team owns that has not been framed yet.",
            "Write the open list and the fixed list, with a reason beside each fixed item.",
            "Name the person who owns the decision and can confirm that list in writing.",
            "Set the date you will send the plan to them, before any invitation is drafted.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "One page, because you are going to send it to them",
            body: "<p>The plan in this lesson is not an internal document that gets summarized for participants later. It is the document you send. That constraint does most of the work: a plan you would be uncomfortable showing to the people you are inviting is telling you something specific, and it is usually one of three things — what is open has not been settled, the payment has not been funded, or nobody has decided what happens to the group's advice.</p><p>Five lines carry it. What the decision is and what is genuinely open. Who shapes it and who is missing. The terms of the work, including hours, rate, route and the participation costs the division carries. What authority the group holds and when the report-back arrives. And how you will know the engagement was real, which is a question about the final decision rather than about how the meetings felt.</p><p>Write the first line last if you have to, but write it honestly. Teams that try to state what is open often find that less is open than the project description suggested. That is uncomfortable, and it is exactly the finding worth having before the invitations go out rather than after the second session.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A co-design engagement plan for one decision",
            summary: "One page you can send to the people you are inviting, and take to the person who owns the decision.",
            fields: [
              { label: "Decision and what is genuinely open", value: "Redesign of the notices sent when a service authorization changes. Open: what the notice says and in what order, the formats it comes in, how much time people get to respond, and how questions are answered. Fixed: the content the law requires in the notice, and the effective date set outside the division. One line beside each fixed item saying why it is fixed." },
              { label: "Who shapes it and who is missing", value: "Six people who have received these notices, two family members, one staff member from a culturally specific organization, and one interpreter who has read these notices aloud to people. Missing so far: anyone living far from the office, and anyone who uses a communication device. What would have to change: travel budget, at least one session outside business hours, and materials sent three weeks ahead." },
              { label: "Terms of the work and what the division pays", value: "Four sessions of ninety minutes, two hours of reading, and one written review of the revised draft: nine hours a person. The hourly rate, and the payment route for individuals and for the organization. The division carries mileage, parking, care costs, interpreting, captioning and usable formats. Payment timing stated in the invitation as it actually is, not at its best." },
              { label: "Decision rights and the report-back", value: "The group decides jointly on the wording, the order and the formats of the notice. The division decides the legally required content and the timing, and will say which is which each time. Every recommendation gets a written answer naming the decision maker. Report-back sent within three weeks of the final session, before the notice is published, in the formats people asked for." },
              { label: "How we will know it was real", value: "Name at least one change in the published notice that exists because of this group, and be able to point to it. Ask every participant whether they would take another invitation, and treat a no as information about the design rather than about the person. Record what the division could not do this time, and what it would take to do it next." },
            ],
            action: "Copy the five lines, fill them in for one decision your team owns, and take the page to the person who owns that decision before any invitation is drafted.",
          },
          {
            type: "accordion",
            heading: "When the answer is no",
            items: [
              { title: "There is no budget for this engagement", body: "<p>Then the choice is a smaller engagement that is properly paid, or none this round. The honest move is to say so and to name the next decision where the money can be planned in from the start. An unpaid engagement that happens to produce a good result is the most expensive kind, because it sets the price for everything that follows it.</p>" },
              { title: "The decision has already been made", body: "<p>Say that in the invitation, and describe accurately what the sessions can still affect: the wording, the formats, the timing of the notice, the way questions are answered. People can then decide whether that is worth their afternoon, and some will say yes. Then name the next decision in the same line of work, and open that one earlier.</p>" },
              { title: "The people you want to work with are exhausted", body: "<p>Take it as evidence rather than as an obstacle. Ask what the last engagements produced, and what those people never heard back about. Often the first useful action is a report-back on work already done, not a new invitation. Fewer engagements with a visible result rebuild the ability to ask; more engagements with no result destroy it.</p>" },
              { title: "Your timeline will not allow it", body: "<p>Timelines are usually more movable than they look, and occasionally they genuinely are not. If the date is truly fixed, do not stage a compressed engagement in order to be able to say that consultation happened. Do the smaller honest thing — a paid review of the draft by readers who know the process, with a written answer to every point — and record plainly what the timeline cost.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Take the plan to the decision owner first",
            control: "You control whether the person who owns the decision has agreed, in advance and in writing, to what the group is being told it can change.",
            failure: "Do not build an engagement on an assumption about someone else's flexibility. A group told it decides the wording, by someone who cannot commit that, finds out at publication — and so does everyone the group talked to.",
            next: "Send the one-page plan to the decision owner and ask for one thing: written confirmation of the open list and the decision rights.",
          },
          {
            type: "list",
            heading: "Six checks before the plan leaves your desk",
            ordered: true,
            items: [
              "The open list is true, and someone with authority over the decision has confirmed it.",
              "The hours, the rate and the payment route are funded, and the expected wait is stated as it really is.",
              "Participation costs are budgeted separately from the fee, and interpreting, captioning and formats have lead time in the schedule.",
              "The authority sentence is there, in one line, and it says what the group can decide rather than what it can influence.",
              "The report-back has a date, a format and a named sender.",
              "The plan names who is missing and what would have to change for them to take part.",
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-34-4-check",
            question: "An engagement plan lists a purpose, a session schedule, the organizations to invite, and a communications approach. Which missing line most changes what the engagement will actually be?",
            options: [
              { text: "A list of the staff who will attend each session.", correct: false },
              { text: "A sentence naming what these sessions can change and what is already fixed.", correct: true },
              { text: "A summary of previous engagements on this topic.", correct: false },
              { text: "A plan for recording and storing what is said in each session.", correct: false },
            ],
            feedbackCorrect: "Yes. That sentence decides who to invite, how many hours to ask for, what the sessions produce, and what the report-back has to answer.",
            feedbackIncorrect: "Ask which line the people you are inviting would want first. Nearly everything else in the plan follows from what is genuinely open.",
          },
          {
            type: "statement",
            body: "A private reflection and a commitment, for you only and never collected: one decision I could open earlier is... the people who should shape it are... what it would cost to pay them properly is... and the person who owns that decision is... Write it where you will see it. If the honest answer to the first line is that nothing is open, that is worth knowing now, and the next question is which decision after this one could be different.",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Co-design and compensated partnership",
    subtitle: "One page for anyone who convenes, funds or depends on work with people outside the division",
    quote: "If you would not send the engagement plan to the people you are inviting, it is not finished.",
    use: {
      purpose: "Keep the four levels, the true cost of participation and the authority sentence in view while you plan, price, defend or repair an engagement with people outside the division.",
      remember: [
        "The level of partnership is set by what can still change, not by what the engagement is called.",
        "Budget before you invite. An unpriced invitation is a request for free work, whatever was intended.",
        "Pay for preparation and review, and carry participation costs — travel, care, interpreting, captioning, formats — separately from the fee.",
        "Write the authority sentence: advises, recommends, or decides jointly on these named points.",
        "The report-back has a date, a named sender and an answer to every recommendation. It is the part people remember.",
        "Reflections in this module are private and are never collected, and taking part in this learning is voluntary.",
      ],
      doNext: "Fill in the one-page engagement plan for one decision your team owns, and take it to the person who owns that decision before any invitation is drafted.",
    },
    sections: [
      {
        heading: "Before you invite anyone",
        items: [
          "Write two lists: what is genuinely open, and what is fixed with the reason beside each item.",
          "Put the open list in the invitation itself, not in a briefing people receive at the first session.",
          "Choose the level deliberately — inform, consult, involve, co-design — and describe it accurately.",
          "Get written confirmation of the open list from the person who owns the decision.",
        ],
      },
      {
        heading: "Paying for the work",
        items: [
          "Price the hours you are actually asking for, including reading, preparation and review between sessions.",
          "Budget participation costs separately: travel and parking, care, interpreting and captioning, usable formats, technology support.",
          "Start vendor setup at the invitation, explain what will be asked for, and offer help with it.",
          "State the payment timing as it really is, and raise a long wait with the offices that own the process.",
          "Contract with a community organization for staff time, space, translation or recruiting; do not take those for free.",
        ],
      },
      {
        heading: "Authority, absence and the report-back",
        items: [
          "Write one authority sentence and repeat it at the top of every agenda.",
          "Say what you are asking of each person: their own experience, their organization's position, or a professional view on a specific question.",
          "Name who is missing and the design choice keeping them out — the hour, the place, the format, the notice period, the wording.",
          "Send the report-back before the decision is final: adopted, not adopted and why, who decided, what is still open.",
          "Separate a rejection from a constraint. They are different messages and only one damages the relationship.",
        ],
      },
      {
        heading: "When you cannot do it properly",
        items: [
          "No budget: run a smaller paid engagement, or none this round, and plan the money into the next decision.",
          "Decision already made: say so, describe honestly what can still change, and open the next one earlier.",
          "People are exhausted: send the report-back you owe them before you send another invitation.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, who frame most decisions and often decide, without noticing, how late anyone outside the division gets to see them.",
          "Communications and training staff, who write the invitation, the materials and the report-back, and whose formats and lead times decide who can take part at all.",
          "Data, research and evaluation staff, who hold much of the evidence about who is affected, and who can design the questions with people rather than about them.",
          "Contracts, fiscal and procurement staff, who own the routes that make payment possible or impossible, and whose early answer changes what an engagement can be.",
          "Supervisors and managers, who approve the hours, protect the timeline, and decide whether the report-back actually gets written.",
          "Executive and senior leaders, who set what is open, grant decision rights and fund the work — a useful place to start.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Leading a reflective DSD team",
          "Equitable policy and procedure governance",
          "Responsible data and evaluation",
          "Inclusive learning and knowledge design",
          "Resource allocation and equity",
        ],
      },
    ],
  },
  sources: [
    { title: "W3C Web Accessibility Initiative, Involving users in web projects for better, easier accessibility", href: "https://www.w3.org/WAI/planning/involving-users/", note: "Guidance on bringing people with disabilities into a project early rather than at review, why late involvement produces repairs instead of design, and how to arrange and compensate that participation." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the governance, leadership and community-engagement standards on partnering with communities to design, implement and evaluate services." },
    { title: "Minnesota Office of Grants Management, policies, statutes and forms", href: "https://mn.gov/admin/government/grants/policies-statutes-forms/", note: "The state's grants policies, statutes and forms — the practical route for paying a community organization for staff time, facilitation, translation or recruiting rather than asking for it unpaid." },
    { title: "Minnesota Management and Budget", href: "https://mn.gov/mmb/", note: "The state's financial management agency, whose statewide financial and payment policies shape how payments to individuals and organizations are set up, routed and timed." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, and a standing route for connecting with disability-led organizations across the state." },
    { title: "ADA.gov, State and local governments (Title II)", href: "https://www.ada.gov/topics/title-ii/", note: "U.S. Department of Justice guidance on what a state or local government must provide, including effective communication and accessible programs, services and activities — the floor an engagement has to meet before it can be called open." },
    { title: "PlainLanguage.gov, Federal plain language guidelines", href: "https://www.plainlanguage.gov/guidelines/", note: "Guidance on audience, organization and useful headings, applied here to invitations, session materials and the report-back that tells people what happened to their contribution." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials, and accessible instruction that does not depend on one format or one pace." },
  ],
};

export default pack;
