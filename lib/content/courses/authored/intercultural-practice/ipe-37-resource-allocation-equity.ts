import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Internal leadership · Module 37: Resource allocation and equity.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-37-resource-allocation-equity",
    indexNumber: 1179,
    seriesLabel: "Intercultural Practice and Equity · Internal leadership",
    title: "Resource Allocation and Equity",
    subtitle: "Funding, positions, timelines, contracts and the order items appear on a work plan decide who the division actually reaches, long before anyone writes a word about equity. Four lessons on reading an allocation as a distribution of opportunity and burden, ending with a short equity-impact page you can add to a project budget or procurement plan your unit already writes.",
    scope: "A starting module for contracts, fiscal and procurement staff and for executive and senior leaders, and a closer look for policy and program staff, quality, compliance and performance staff, data, research and evaluation staff, and supervisors and managers. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. This module never asks you to disclose a diagnosis, a belief, a background or a private experience. It is not a spending authority, a procurement procedure, a grants policy or an audit; those belong to the responsible offices and run on their own authority. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota DSD examples, scenarios, sorting and flashcard practice, private reflection prompts, and a short equity-impact page you can copy straight into a project budget or procurement plan",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-08.jpg",
    coverAlt: "A colleague presents an idea to two others gathered around a table.",
    introTranscript: "A division states its priorities in plans and memos. It decides them in budgets, position counts, timelines, solicitations and the order in which work gets done. Those decisions distribute two things at once: opportunity, which usually goes to whoever is already easy to reach, and burden, which usually goes to whoever is already carrying the most. This module looks at what a flat split actually distributes, how the design of a solicitation decides the field before any proposal is scored, how to read a spending or staffing distribution without letting the average hide the uneven part, and how to attach a few answerable equity questions to a budget or procurement document your unit already produces. It ends with the page itself, written so you can paste it into a template that already exists.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain how a funding, staffing, timeline or sequencing decision distributes opportunity and burden, and name allocation choices in your own program area that decide who gets reached.",
        "Identify the design choices in a solicitation, grant announcement or contract that decide which organizations can realistically take part, and say which of them your role can change.",
        "Read a spending, staffing or caseload distribution with the overall figure set aside, and name what the record cannot see.",
        "Tell an equity question that changes a number apart from one that only adds a paragraph to a document.",
        "Attach a short equity-impact page to a project budget or procurement plan your unit already writes, with an owner for each answer and a date when the addition itself is checked.",
      ],
      evidence: [
        "Four worked scenarios from internal division work — a one-time outreach amount spent on a single statewide mailing, a community engagement solicitation whose terms decide the field before scoring, a year-end underspend on an access line, and a fixed planning cycle with no room for a new step — each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates choices which widen the field from choices which narrow it, and separates what a spending record can show from what only a person can tell you.",
        "A short equity-impact page attached to an existing budget or procurement template, with an owner, a place the answer is recorded, and a date the addition is reviewed.",
      ],
      appliedNextStep: "Take the next budget worksheet, procurement plan or grant announcement your unit produces. Attach one question to each section that already exists, name who answers it and where the answer is written down, and set the date when you will check whether any answer changed a number.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in Minnesota state budget instructions, statewide procurement requirements or grants management policy that alters how the division plans, solicits, awards or amends money",
        "A change in state or federal accessibility, language access or civil rights requirements that affects what a solicitation, contract or grant announcement must include or make usable",
        "Feedback from paid community advisors or contracted partners that a barrier described here no longer matches the terms applicants actually meet",
      ],
      relatedDoor: "Spending authority, budget requests, solicitations, grant awards and contract execution are decided by the department's fiscal and contracting offices with Minnesota Management and Budget and the Department of Administration's Office of State Procurement; this module prepares the questions you bring to them and decides nothing on its own.",
      toolkitQuestion: "Who carries the cost of the way we chose to spend this, and who was in the room before the number was set?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-37-1",
        number: 1,
        title: "What the money already decided",
        summary: "A plan states an intention. A budget, a position count and a timeline state a decision about who gets reached first, who gets reached later, and who does not get reached at all.",
        minutes: 11,
        learning: {
          objective: "Explain how a funding, staffing or timeline decision distributes opportunity and burden, and name two allocation choices in your own program area that decide who the division reaches.",
          takeaways: [
            "Every allocation is a distribution. Money, positions, staff hours, timelines and the order items appear on a work plan all decide who is reached first, who is reached later, and who is never reached.",
            "Equal division is not equal reach. The same dollar buys a very different amount of access in a county with three interpreters available than in a county with none.",
            "The costs that make participation possible — interpreting, translation, accessible formats, travel, plain-language rewriting, paying community advisors for their time — are usually the first items moved into contingency and the first items cut.",
            "A written commitment with no line, no owner and no date behind it is an intention. It will lose to every item in the same plan that has all three.",
          ],
          evidence: "A scenario about one-time outreach funding in a division program area, and a knowledge check on what a commitment without a line actually commits.",
          appliedNextStep: "Take one budget, staffing plan or work plan you contribute to. Write down three things it already decided about who gets reached, and mark the one of the three you could still change this cycle.",
        },
        scenario: {
          context: "A division program area has a one-time amount to tell people about a change in how a home and community-based service is authorized. The draft plan spends the whole amount on a single statewide mailing, printed in English, using the wording from the policy bulletin. The lead describes it as the fairest use of the money because every household on the list gets exactly the same notice.",
          prompt: "You are in the review meeting. What is the most useful thing to say?",
          options: [
            {
              label: "Support the plan. A single statewide mailing treats every household identically, which is the most defensible use of a one-time amount.",
              response: "Identical treatment distributes the envelope, not the information. A notice in policy wording, in one language, in print only, is already usable by the households closest to the system and already unusable by the ones furthest from it. Sameness here is a choice about who understands, not a neutral default.",
            },
            {
              label: "Ask what the mailing reaches and what it misses, then hold back part of the amount for translated and accessible versions and for paid partners who already reach the households a mailing does not.",
              response: "This is the move. It keeps the mailing, names what it cannot do, and spends the difference on the reach the mailing was never going to buy. It also puts the partner payment in the plan rather than asking organizations to carry the work unpaid.",
              recommended: true,
            },
            {
              label: "Approve the mailing now and add a line saying that translation and accessible formats will be arranged later for anyone who asks.",
              response: "On request is a real option, but on its own it moves the cost onto the person: they have to know the notice exists, understand enough of it to know they need it in another form, find the route to ask, and wait. By then the change has usually taken effect.",
            },
          ],
        },
        transfer: {
          prompt: "Where in your own work does a flat split get called fair?",
          options: [
            "Name one amount, position count or timeline in your area that is divided evenly and write what that even division actually distributes",
            "Name one group the even division reaches least well, and what it would cost to change that",
            "Name the person who would have to agree to the change, and when you will ask them",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A plan states an intention. A budget states a decision.",
            body: "<p>Division plans are written in the language of priorities: strengthen, improve, expand, center. Budgets are written in the language of amounts, positions, months and line numbers. Only one of those two documents decides anything. When the plan and the budget disagree, the budget wins, quietly, without a meeting.</p><p>This is not a criticism of budgets. It is a description of how public administration works, and it is useful precisely because it is so concrete. You cannot audit an intention. You can look at a spreadsheet and see, in about ten minutes, which parts of the state the division is set up to reach this year, which parts it is set up to reach on request, and which parts it is not set up to reach at all.</p><p>The same is true of things that are not money. A position left vacant for a year is an allocation. A timeline that puts community review after the decision point is an allocation. A work plan where three of nine items are sequenced for the last quarter is an allocation, and everyone in the room already knows which three will slip. Opportunity goes to whoever is easiest to reach with what was funded. Burden goes to whoever has to make up the difference, and that is usually the person the service is for.</p>",
          },
          {
            type: "list",
            heading: "Five allocations that decide who gets reached",
            items: [
              "Money: what the line pays for, what it does not pay for, and what sits in contingency waiting for a request that may never be made.",
              "Positions and staff hours: how many people, where they sit, which languages they work in, and how much of their week is already committed.",
              "Timeline and sequence: what happens in the first quarter, what is scheduled last, and whether community input arrives before or after the decision point.",
              "Authority: who can approve a change without escalating, and how far from the work that person sits.",
              "Scope: what the project counts as in and out, which is the quietest allocation of all, because nothing outside the scope ever appears as a cost.",
            ],
          },
          {
            type: "tabs",
            heading: "The same one-time amount, four ways",
            tabs: [
              {
                label: "Split evenly",
                body: "<p>Every region gets the same share. Simple to defend and simple to administer. It distributes the amount evenly and the reach unevenly, because the regions do not start from the same place: different distances, different numbers of providers, different languages spoken at home, different levels of trust in state contact.</p>",
              },
              {
                label: "Split by population",
                body: "<p>Larger regions get more. More defensible than an even split and still blind to two things: how many of the people in each region are actually eligible for the service, and how much it costs to reach one person in a rural county compared with one person in a metropolitan one.</p>",
              },
              {
                label: "Split by where reach is thinnest",
                body: "<p>More goes where the gap between who is eligible and who is enrolled is largest. This is harder to explain and much harder to hold to, because it means some regions receive less than last cycle. It is also the only one of the four splits that is likely to change an outcome rather than restate the existing pattern.</p>",
              },
              {
                label: "What no split buys",
                body: "<p>None of the four buys a notice people can read, an interpreter on the day, a form that works with a screen reader, or an organization willing to vouch for the division to households that have reason to be careful. Those are separate lines. If they are not written in, no method of dividing the total will produce them.</p>",
              },
            ],
          },
          {
            type: "accordion",
            heading: "Where this sits in the program's map of change",
            items: [
              {
                title: "Treating sameness as fairness (Minimization)",
                body: "<p>The most common position in a budget meeting is that identical treatment is automatically fair treatment: one notice, one deadline, one method, applied to everyone. It feels even-handed and it is administratively cheap. It also assumes that everyone starts in the same place, which is the assumption the whole continuum turns on. Most division allocation practice sits here, and it is not a character flaw — it is what a system optimized for consistency produces.</p>",
              },
              {
                title: "Seeing what the split actually distributes (Acceptance)",
                body: "<p>The shift is not to abandon consistency. It is to notice that an even split distributes the money evenly and the result unevenly, and to be able to say so out loud in a review without it sounding like an accusation. Acceptance here looks like a straightforward sentence: this method reaches these households well and those households poorly, and here is how we know.</p>",
              },
              {
                title: "Changing the method, not only the amount (Adaptation)",
                body: "<p>Adaptation shows up in how the decision is made, not just in what gets funded. It looks like a line for interpreting written into the base rather than the contingency, a regional award structure chosen because a statewide one does not reach, payment terms set so a small organization can afford to say yes, and community advisors paid from the project budget because their time is a real cost of doing the work well.</p>",
              },
              {
                title: "A note about how this is used here",
                body: "<p>These stages describe the program's theory of change and the patterns in its content. They are never a label, a score or a record about any individual staff member, and nothing in this module assesses where any person sits. Licensed intercultural assessment is a separate, professionally administered matter and this program does not replace or shortcut it.</p>",
              },
            ],
          },
          {
            type: "leaderMove",
            heading: "Put access in the line, not in the contingency",
            control: "You control where interpreting, translation, accessible formats and paid community time appear in a budget you draft or review: as a named line with an amount, or as something handled from contingency if a request arrives.",
            failure: "Do not let the access costs be the flexible part of the plan. Contingency has no owner, and an unowned amount is the easiest thing in any budget to reallocate in the third quarter.",
            next: "In the next budget you touch, move one access cost out of contingency into a named line with an amount and an owner, and say plainly in the meeting why you moved it.",
          },
          {
            type: "quote",
            text: "We had the commitment in the plan for two cycles. What changed it was somebody putting a number and a name next to it on the worksheet. After that it stopped being a value and started being a line that someone had to explain if it disappeared.",
            cite: "Composite division program manager perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-37-1-check",
            question: "A division work plan commits to improved outreach to communities the service currently reaches least well. No amount, no position and no date are attached. What is the most accurate reading?",
            options: [
              { text: "It is a sound statement of direction; the operational detail belongs in the next planning round.", correct: false },
              { text: "It is an intention, not a decision. Without a line, an owner and a date it will lose to every item in the same plan that has all three.", correct: true },
              { text: "It is a commitment, because the division has now stated the priority publicly, and stated priorities shape behavior.", correct: false },
            ],
            feedbackCorrect: "Yes. The test is not how the sentence is worded. It is whether anything in the budget, the staffing chart or the calendar changed because the sentence exists.",
            feedbackIncorrect: "Ask what would have to disappear for this commitment to fail quietly. If the answer is nothing — because nothing was ever attached to it — the commitment has not been made yet.",
          },
        ],
      },
      {
        id: "ipe-37-2",
        number: 2,
        title: "Where the burden lands",
        summary: "Nothing in a solicitation says who may not apply. The window, the payment terms, the thresholds and the document itself say it instead, and they say it before a single proposal is scored.",
        minutes: 11,
        learning: {
          objective: "Identify the design choices in a solicitation, grant announcement or contract — window, payment terms, thresholds, award shape, and the usability of the document itself — that decide which organizations can realistically respond, and name which of them your role can change.",
          takeaways: [
            "The field is decided at drafting, not at scoring. By the time proposals are evaluated, most of the organizations the work needed have already been filtered out by terms nobody argued about.",
            "Reimbursement after the fact is a loan the organization makes to the state. The smallest, newest and most community-rooted organizations are the least able to make it, and they are frequently the ones with the reach the project was buying.",
            "One large statewide award and several smaller regional awards buy different things. The first buys administrative simplicity for the division; the second buys reach into places a statewide contractor does not go.",
            "Interpreting, translation, accessible formats and paying people for their expertise are allowable costs when the announcement says so. They are almost never added afterwards, because the price is already fixed.",
          ],
          evidence: "A scenario about a community engagement solicitation with a short window and heavy thresholds, and sorting practice separating terms that widen the field from terms that narrow it.",
          appliedNextStep: "Take the next solicitation, grant announcement or contract amendment you touch. Write one sentence naming who could realistically respond to it as written, and change one of the five design choices before it goes out.",
        },
        scenario: {
          context: "The division is contracting for community engagement on an upcoming service change. The draft package has a fourteen-day response window that includes a holiday week, payment only as reimbursement sixty days after an approved invoice, a general liability requirement carried over from a construction template, a forty-page technical proposal in English, and an electronic submission form nobody has checked for use with a screen reader. Culturally specific organizations and disability-led organizations are exactly the responders the project needs.",
          prompt: "You have one meeting and can realistically change two or three things. Which set of changes does the most?",
          options: [
            {
              label: "Extend the response window to thirty days and leave the rest of the package as drafted.",
              response: "A longer window helps, and it is the cheapest change to make. It does not help an organization that cannot float sixty days of payroll, cannot carry construction-scale liability coverage, or cannot get its proposal into a submission form it cannot use.",
            },
            {
              label: "Extend the window, scale the insurance requirement to the actual size and risk of this work, allow milestone or partial advance payments, confirm the package and the submission form can be used with a screen reader, and state in the announcement that interpreting, translation and accessible formats are allowable costs.",
              response: "This is the set. Each change removes a filter that had nothing to do with whether an organization can do the work well, and the last one puts money behind the access the project will need anyway. None of it lowers the standard for the work itself.",
              recommended: true,
            },
            {
              label: "Keep the package as drafted and add a well-publicized bidders' conference with help sessions for smaller organizations.",
              response: "Help with an application is genuinely useful, and it does not change what the application requires. Coaching an organization through a requirement it cannot meet uses everyone's time and produces the same field.",
            },
          ],
        },
        transfer: {
          prompt: "Take a solicitation, grant announcement or contract you have worked on recently. Which term would have stopped a small, community-rooted organization from responding?",
          options: [
            "Name the term, and name the risk it was actually protecting against",
            "Write what a proportionate version of that term would look like for this size of work",
            "Name who has to approve the change, and when the next package goes out",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Nobody is excluded on paper",
            body: "<p>Public procurement is designed to be open. Solicitations are posted, criteria are published, evaluations are documented, and nothing anywhere says which organizations are unwelcome. That openness is real, and it is also why the filtering that does happen is so easy to miss: it is done by terms that look purely technical and that no one in the drafting meeting has any reason to argue about.</p><p>Consider a fourteen-day window. For an organization with a proposal writer on staff and a shelf of boilerplate, fourteen days is tight but workable. For a six-person culturally specific organization whose director is also the program lead and the interpreter, fourteen days across a holiday week is a decision that it will not respond. Nobody made that decision on purpose. The calendar made it.</p><p>The pattern repeats across the package. Payment terms decide who can afford to start. Insurance and audit thresholds decide who can clear the gate. The size and shape of the award decide whether a regional organization sees itself in the work at all. And the accessibility of the solicitation itself decides whether a disability-led organization — often the single most useful responder for this division's work — can read the thing they are being invited to bid on.</p>",
          },
          {
            type: "accordion",
            heading: "Five design choices, and what each one decides",
            items: [
              {
                title: "The response window",
                body: "<p>Decides whether responding requires dedicated proposal capacity. A short window is not neutral speed; it is a preference for organizations that keep a proposal function on payroll. Ask what the deadline is actually driven by, and whether the real constraint is a fiscal date or a meeting someone would rather not move.</p>",
              },
              {
                title: "Payment terms",
                body: "<p>Decides who can afford to say yes. Cost reimbursement paid well after the work asks the organization to carry payroll, rent and mileage in the meantime. Milestone payments, a partial advance, or a shorter approval cycle change who can participate without changing what the state ultimately pays.</p>",
              },
              {
                title: "Thresholds — insurance, audited financials, bonding",
                body: "<p>Decides who clears the gate before anything about quality is considered. These requirements exist for good reasons and are frequently copied forward from templates built for far larger and riskier work. The question is not whether to have them but whether this one is proportionate to this contract.</p>",
              },
              {
                title: "The size and shape of the award",
                body: "<p>Decides the kind of organization the work is aimed at. One statewide award is simpler for the division to manage and concentrates the relationship in whoever can staff a statewide footprint. Several regional awards cost more administrative time and reach into places a statewide contractor does not have standing.</p>",
              },
              {
                title: "The document itself",
                body: "<p>Decides who can read the invitation. A solicitation in dense legal English, delivered as an untagged file, submitted through a form that has never been checked with a screen reader, has already answered the question of whether disability-led and language-specific organizations are meant to respond. Plain language and an accessible, tested submission route are part of the procurement, not a courtesy added to it.</p>",
              },
            ],
          },
          {
            type: "sorting",
            id: "ipe-37-2-sort",
            heading: "As written, who can respond to this?",
            categories: ["Widens who can respond", "Narrows who can respond", "Depends on how it is written"],
            items: [
              { text: "A fourteen-day response window that includes a holiday week.", category: "Narrows who can respond" },
              { text: "Payment only as reimbursement, sixty days after an approved invoice.", category: "Narrows who can respond" },
              { text: "Interpreting, translation and accessible formats named in the announcement as allowable costs.", category: "Widens who can respond" },
              { text: "A general liability requirement carried over from a construction contract template.", category: "Narrows who can respond" },
              { text: "The solicitation, its attachments and its submission form checked so they can be used with a screen reader.", category: "Widens who can respond" },
              { text: "A requirement for three years of audited financial statements.", category: "Narrows who can respond" },
              { text: "Several regional awards instead of one statewide award.", category: "Depends on how it is written" },
              { text: "A scoring criterion for existing relationships with the communities the work is meant to reach.", category: "Depends on how it is written" },
              { text: "A question period with written answers published to every potential responder at once.", category: "Widens who can respond" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Write the allowable cost into the announcement",
            control: "You control whether the announcement says, in plain words, that interpreting, translation, accessible formats and paying community members for their time are allowable and expected costs under this award.",
            failure: "Do not leave it to be worked out after award. Once a price is submitted and accepted, adding these costs means an amendment, and most of the time the work simply goes unfunded and the organization absorbs it.",
            next: "In the next announcement you draft or review, add one sentence naming these as allowable costs, and check that the budget template has a line where a responder can actually put them.",
          },
          {
            type: "quote",
            text: "We wanted that contract and we knew the households. We could not front three months of payroll to get paid at the end, and the coverage they asked for cost more than the award. So we did not bid, and later somebody said there had been no interest from organizations like ours.",
            cite: "Composite contracted community partner perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-37-2-check",
            question: "A grant announcement pays only by reimbursement, sixty days after an approved invoice. Which statement best describes what that term distributes?",
            options: [
              { text: "It distributes risk evenly, because every applicant faces the same payment terms.", correct: false },
              { text: "It asks every applicant to fund the work first, which the smallest and newest organizations are least able to do, so it narrows the field before a single proposal is scored.", correct: true },
              { text: "It is a standard financial control and has no bearing on who applies.", correct: false },
            ],
            feedbackCorrect: "Yes. The term is identical for everyone and its effect is not, because organizations do not have identical reserves. That gap is the whole point of looking at allocation as distribution.",
            feedbackIncorrect: "Ask who has to hold three months of payroll to take this award, and which organizations in your program area could do that today.",
          },
        ],
      },
      {
        id: "ipe-37-3",
        number: 3,
        title: "Reading the distribution",
        summary: "An average is a summary, not a finding. Underspending is a question, not a saving. Some of what you most need to know about an allocation is not in any record the division holds.",
        minutes: 11,
        learning: {
          objective: "Read a spending, staffing or caseload distribution with the overall figure set aside, name at least two things the record cannot see, and say who you would have to ask to learn them.",
          takeaways: [
            "Break the figure out before you trust it. Two regions with the same amount per person can be reaching very different shares of the people who are eligible.",
            "Low spending on an access line is a question, not a saving. It usually means requests were not made, not known about, refused, or never routed to that line in the first place.",
            "Cost is not only the invoice. Staff hours, travel, waiting, and the unpaid work families and organizations do to make a process function are all real costs, and only some of them appear anywhere.",
            "Naming what the record cannot see, before the decision is made, is far more useful than explaining it afterwards.",
          ],
          evidence: "A scenario about a year-end underspend on an interpreting and accessible formats line, and sorting practice separating what the spending record shows from what only a person can tell you.",
          appliedNextStep: "Take one figure you report regularly. Break it out by region, program, language or another grouping that matters for the decision it feeds, and write down one thing you now want to ask a person about.",
        },
        scenario: {
          context: "A year-end summary shows that the division spent roughly a third of the amount budgeted for interpreting, translation and accessible formats. A manager proposes reducing the line next cycle to match actual use, and points out, reasonably, that carrying an amount nobody spends invites questions from the department's fiscal staff.",
          prompt: "What do you say before that reduction is written in?",
          options: [
            {
              label: "Support the reduction. Matching a budget line to actual use is ordinary stewardship, and the amount can be restored if demand appears.",
              response: "It is ordinary stewardship only if the spending reflects the need. Restoring a cut line mid-cycle is far harder than holding it, and the households affected by an unavailable translation will not be the ones raising it with fiscal staff.",
            },
            {
              label: "Ask why the line went unused before the amount moves: were requests made and turned down, was the route to request unclear, did staff know the line existed, were materials produced in English by default. Hold the amount until someone answers, and name who answers and by when.",
              response: "This is the move. Low use of an access line has at least four ordinary explanations, three of which are problems the division created and can fix. Naming an owner and a date turns the question into work rather than a point made in a meeting.",
              recommended: true,
            },
            {
              label: "Move the unspent amount into general contingency so the money stays available without sitting on a line that draws attention.",
              response: "This keeps the money and loses the commitment. An amount in contingency has no owner and no purpose attached, which makes it the easiest thing in the budget to spend on something else in the third quarter.",
            },
          ],
        },
        transfer: {
          prompt: "Pick one distribution you look at regularly — spending, caseload, staffing, wait times, award amounts.",
          options: [
            "Break it out one level further than you normally do, and write what changed in the picture",
            "Name one thing the record cannot see about this distribution, and the person who could tell you",
            "Write what you would have to stop reporting as an average for this to stay visible",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Set the total aside",
            body: "<p>Totals and averages are built to summarize, which means they are built to hide variation. That is useful when you need one number for a briefing and actively misleading when you are deciding where money should go next. A division-wide amount per person can look steady for years while the spread underneath it moves a long way.</p><p>The first habit worth building is simple: before you trust a figure, break it out one level further than you normally would. By region. By program. By preferred language. By whether the person reached the service through a provider, a county, a family member or on their own. You are not looking for a finding at this stage. You are looking for whether the overall number is describing one pattern or several averaged together.</p><p>The second habit is to keep the denominator honest. Spending per enrolled person tells you about the people who got in. Spending per eligible person tells you about the people the service was meant for. Those two figures often point in opposite directions, and the gap between them is usually the most interesting thing on the page.</p>",
          },
          {
            type: "sorting",
            id: "ipe-37-3-sort",
            heading: "Where would you find this out?",
            categories: ["The spending record shows it", "Only a conversation shows it", "Nothing we hold shows it"],
            items: [
              { text: "How much of the interpreting and accessible formats line was spent.", category: "The spending record shows it" },
              { text: "Why one regional office stopped submitting requests against that line.", category: "Only a conversation shows it" },
              { text: "How many people needed a translated notice and never asked for one.", category: "Nothing we hold shows it" },
              { text: "Which contracts were amended mid-term, and by how much.", category: "The spending record shows it" },
              { text: "What an organization decided not to bid on, and why.", category: "Only a conversation shows it" },
              { text: "The average award size by region.", category: "The spending record shows it" },
              { text: "How many hours a family spent making an inaccessible process work.", category: "Nothing we hold shows it" },
              { text: "Whether staff knew the access line existed and how to draw on it.", category: "Only a conversation shows it" },
            ],
          },
          {
            type: "accordion",
            heading: "Four costs that rarely appear on a line",
            items: [
              {
                title: "Staff hours spent working around a design",
                body: "<p>When a form is unusable, someone walks people through it by phone. That time is real, it is paid, and it appears nowhere as the cost of the form. A design problem that consumes a few hours a week across a unit will outspend the fix many times over and never show up as a comparison.</p>",
              },
              {
                title: "Waiting and travel carried by the person",
                body: "<p>A process that requires an in-person visit during business hours moves cost onto whoever has to take unpaid leave, arrange transport, or find support for the trip. The division's budget is unaffected. The household's is not, and the people for whom that cost is highest are the ones most likely to drop out of the process.</p>",
              },
              {
                title: "Unpaid work by partner organizations",
                body: "<p>Community organizations routinely translate, explain, accompany and vouch for state processes without being paid for any of it. It is generous and it is not free: it is a subsidy running from small organizations to the state. Paying for that work is not a favor; it is recognizing a cost that already exists.</p>",
              },
              {
                title: "The cost of the process failing",
                body: "<p>A missed renewal, a wrongly closed case, an appeal, a complaint, a re-application: each of these has staff time behind it and appears in the record as workload rather than as the price of the original design. Very few budgets put the fix and the failure on the same page where anyone can compare them.</p>",
              },
            ],
          },
          {
            type: "leaderMove",
            heading: "Ask before you cut the line",
            control: "You control whether an unspent access line is treated as a saving to be harvested or as a finding to be explained before anything moves.",
            failure: "Do not reduce a line because it went unused without first asking why. A quiet line is at least as likely to mean a broken route as an absent need, and cutting it makes the route permanent.",
            next: "The next time you see an underspend on a line meant to remove a barrier, write the four ordinary explanations next to it and name who will check which one is true.",
          },
          {
            type: "flashcards",
            heading: "Five questions to put to any distribution",
            cards: [
              { front: "Compared with what?", back: "<p>A figure alone means little. Compared with last cycle, with another region, with the eligible population, or with what the same money bought somewhere else, it starts to mean something.</p>" },
              { front: "Per what?", back: "<p>Per enrolled person, per eligible person, per household, per staff hour. Changing the denominator often reverses which region looks well served.</p>" },
              { front: "Who is missing from the denominator?", back: "<p>People who were never enrolled, never applied, or never learned the service existed do not appear in a rate built from enrollment. They are the group most allocation decisions are meant to reach.</p>" },
              { front: "What did we count as a cost?", back: "<p>Invoices are counted. Staff workaround hours, waiting, travel and unpaid partner work usually are not, which makes an inaccessible design look cheaper than it is.</p>" },
              { front: "What would only a person tell us?", back: "<p>Why a request was never made, why an organization did not bid, what a family did instead. If the answer matters to the decision, budget the time to go and ask, and pay people for their expertise when you do.</p>" },
            ],
          },
          {
            type: "statement",
            body: "A private pause, for you only and recorded nowhere: looking at the last distribution you signed off on, whose expertise was missing from the room when the number was set, and what might they have seen that the record could not?",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-37-3-check",
            question: "A line for interpreting and accessible formats was a third spent at year end. Which conclusion is best supported before anything changes?",
            options: [
              { text: "The budgeted amount was too high and should be reduced to match actual use.", correct: false },
              { text: "Low use of an access line is a question, not an answer: requests may not have been made, not known about, turned down, or never routed to the line.", correct: true },
              { text: "The unspent amount should move to general contingency so it stays available.", correct: false },
            ],
            feedbackCorrect: "Yes. Three of the four ordinary explanations are problems the division created, which means the underspend is more likely a finding about the route than a fact about the need.",
            feedbackIncorrect: "Before treating an unspent access line as evidence of low need, ask whether anyone could have used it: did staff know, was the route clear, were requests refused, were materials produced in English by default.",
          },
        ],
      },
      {
        id: "ipe-37-4",
        number: 4,
        title: "Equity questions in the plan you already write",
        summary: "A question that changes a number is attached to a line, has an owner and has a date. This lesson turns that into one page you can paste into the budget or procurement template your unit already uses.",
        minutes: 10,
        learning: {
          objective: "Attach a short equity-impact page to a project budget or procurement plan your unit already writes, naming who answers each question, where the answer is recorded, and when the addition itself is reviewed.",
          takeaways: [
            "Put the questions in the document that already exists. A separate equity attachment becomes a separate, optional process, and optional processes lose to deadlines.",
            "Two questions asked at drafting beat twelve asked at signature. After a solicitation is posted or a price is accepted, most answers cost money to act on.",
            "Write down what you are choosing not to fund. A budget is as much a record of what was declined as of what was approved, and the declined list is where the pattern usually shows.",
            "An answerable question names a line, a person and a date. A question that only invites a paragraph will get one, and nothing else will change.",
          ],
          evidence: "A scenario about adding questions to a fixed planning cycle with no spare meeting time, a one-page equity-impact tool you can copy, and a private reflection.",
          appliedNextStep: "Copy the page into the budget or procurement template your unit already uses, fill it in for the next item you plan, and set a date to check whether any answer changed a number or only lengthened the document.",
        },
        scenario: {
          context: "Your unit's project budget template is set by a shared planning cycle, and the cycle is tight. There is no appetite for a new step, no one is going to open a second document, and you have roughly twenty minutes inside a planning meeting that already exists.",
          prompt: "How do you add equity questions so that they survive the cycle?",
          options: [
            {
              label: "Draft a separate equity impact form to be completed and attached to every project budget.",
              response: "A second document creates a second process, and a second process is the first thing dropped when the cycle compresses. It also lets the budget conversation continue exactly as before while the form is completed afterwards by whoever has time.",
            },
            {
              label: "Attach one question to each section of the template that already exists, name the person who answers it in that meeting, record the answer in the same worksheet, and set one date to check whether an answer ever changed a number.",
              response: "This is the move. The questions ride on a document people already open, get answered by people already in the room, and are reviewed against the only test that matters — whether anything in the plan was different because they were asked.",
              recommended: true,
            },
            {
              label: "Raise the questions out loud at the review meeting when the budget is presented for approval.",
              response: "By review, the numbers are allocated and the package is built. Questions at that point either get deferred to next cycle or get an answer that costs nothing, and both outcomes teach the room that the questions are decorative.",
            },
          ],
        },
        transfer: {
          prompt: "Choose the next budget, procurement plan or grant announcement your unit will produce.",
          options: [
            "Name the section of the existing template each question will attach to",
            "Name the person who answers each question and where the answer gets written down",
            "Set the date you will check whether any answer changed a number, and who checks it with you",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Where the questions have to live",
            body: "<p>Most equity questions fail for the same unremarkable reason: they are asked in a document nobody has to open, at a point in the calendar when nothing can be changed, by a person with no standing in the decision. Fixing that is less about writing better questions than about placing ordinary ones properly.</p><p>Placement has three parts. The question attaches to a section of a document that is already required — the line-item sheet, the sourcing plan, the announcement draft — so that answering it is part of finishing the work rather than an addition to it. A named person answers it, preferably the person who already owns that section, so that the answer arrives with the authority to change the number. And the answer is written in the same place as the rest of the plan, so that the next person who opens the worksheet reads it whether they were looking for it or not.</p><p>One more thing separates a question that works from one that does not: it has to be answerable with information someone in the room either has or can get before the decision. Asking whether a plan supports the division's commitments produces a yes. Asking which of these four lines reaches people the service is currently reaching least well, who knows that, and by what date produces either an answer or an admission that nobody knows — and the admission is itself useful, early, and cheap.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A short equity-impact page for a project budget or procurement plan",
            summary: "Six fields that attach to a budget worksheet, sourcing plan or grant announcement your unit already produces. Filled example shown; copy the field labels and answer them for your own item.",
            fields: [
              { label: "Decision and what it moves", value: "Contract for community engagement on an upcoming service change. Moves a one-time amount, about four months of one staff member's time, and the sequence of the engagement relative to the decision point." },
              { label: "Who gains reach and who carries the cost", value: "Gains: households already connected to a provider, who will hear through existing channels. Carries the cost: households with no provider relationship, who speak a language the notice is not written in, and the community organizations who will be asked to explain the change whether or not we pay them." },
              { label: "What we are choosing not to fund", value: "Regional awards, in favor of one statewide award; a plain-language rewrite of the notice; a second round of engagement after the decision. Recorded here so the pattern is visible across items rather than only inside this one." },
              { label: "Access and language written into the line", value: "Interpreting and translated notices budgeted as named lines, not contingency. Accessible formats and a screen-reader check of the solicitation and submission form included in the sourcing plan. Payment for community advisors budgeted at a stated rate." },
              { label: "Whose expertise shaped this and what we paid for it", value: "Two disability-led organizations and one culturally specific organization reviewed the draft scope before the amount was set, compensated at the stated rate. Their two changes to the award structure are noted in the sourcing plan." },
              { label: "Owner, date and the check", value: "Each field answered by the section owner in the planning meeting and recorded in the same worksheet. Reviewed at the agreed point with one question: did any answer here change a number, a term or a date? If not, the questions are rewritten or dropped." },
            ],
            action: "Copy the six field labels into the budget worksheet, sourcing plan or announcement template your unit already uses, answer them for the next item you plan, and set the date for the check.",
          },
          {
            type: "list",
            heading: "Answerable, and not",
            ordered: false,
            items: [
              "Not answerable: Have equity considerations been taken into account? Answerable: Which of these lines reaches people the service currently reaches least well, and who knows that?",
              "Not answerable: Is this procurement inclusive? Answerable: Which organizations could respond to these terms as drafted, and which term would stop the three we most want to hear from?",
              "Not answerable: Are we being accessible? Answerable: Which line pays for interpreting, translated notices and accessible formats, and who checked that the submission route can be used with a screen reader?",
              "Not answerable: Did we engage the community? Answerable: Who reviewed this before the amount was set, what were they paid, and what changed because of them?",
              "Not answerable: Will this reduce disparities? Answerable: What would we expect to look different in a year if this works, and which figure would show it?",
            ],
          },
          {
            type: "leaderMove",
            heading: "Write down what you are not funding",
            control: "You control whether the plan records only what was approved, or also the short list of what was requested, considered and declined this cycle.",
            failure: "Do not let the declined list live only in people's memory. Nothing that is never written down can be looked at across items, and a pattern that cannot be looked at cannot be changed.",
            next: "Add three lines to the next plan: what we chose not to fund, why, and what would have to be true next cycle for that to change.",
          },
          {
            type: "list",
            heading: "Related modules in this area",
            items: [
              "Leading a reflective DSD team",
              "Equitable policy and procedure governance",
              "Responsible data and evaluation",
              "Co-design and compensated partnership",
              "Quality, complaints, and incident learning",
            ],
          },
          {
            type: "statement",
            body: "A private pause, for you only and recorded nowhere: think of one amount, timeline or contract term you have set or approved. How did your role, authority or working assumptions shape it — and if it turned out to have excluded someone, what would accountability and repair actually require of the division, not of them?",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-37-4-check",
            question: "Which version of an equity question is most likely to change a budget decision?",
            options: [
              { text: "Have equity considerations been taken into account in this plan? Asked at final review.", correct: false },
              { text: "Which of these four lines reaches people the service currently reaches least well, who answers that, and by what date? Attached to the line-item section of the template.", correct: true },
              { text: "Does this project support the division's equity commitments? Answered yes or no in a separate attachment.", correct: false },
            ],
            feedbackCorrect: "Yes. It attaches to a line, it is answerable with information the room has or can get, it names an owner and a date, and it is asked while the numbers can still move.",
            feedbackIncorrect: "Test each one against four things: is it attached to a line, can someone in the room answer it, does it name an owner and a date, and is it asked early enough for the answer to change anything?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Resource allocation and equity",
    subtitle: "One page for a budget, a solicitation or a work plan",
    quote: "The plan says what we meant. The budget says what will happen.",
    use: {
      purpose: "Keep the distribution question in view while you build a budget, draft a solicitation, plan a grant announcement or read a spending report.",
      remember: [
        "Every allocation distributes two things: opportunity, which goes to whoever is easiest to reach, and burden, which goes to whoever has to make up the difference.",
        "Equal division is not equal reach. The same amount buys different access in different places.",
        "The field is decided at drafting, not at scoring: window, payment terms, thresholds, award shape and the usability of the document itself.",
        "Low spending on an access line is a question, not a saving. Ask before you cut it.",
        "A question that changes a number is attached to a line, has an owner and has a date.",
      ],
      doNext: "Attach the six-field equity-impact page to the next budget worksheet or sourcing plan your unit produces, and set the date to check whether any answer changed a number.",
    },
    sections: [
      {
        heading: "Before the numbers are set",
        items: [
          "Name what the split distributes, not just how it divides: even, by population, or by where reach is thinnest.",
          "Move interpreting, translation, accessible formats and paid community time out of contingency into named lines with owners.",
          "Write down what you are choosing not to fund, and what would have to be true next cycle for that to change.",
          "Bring the people most affected in before the amount is set, and pay them for the time.",
        ],
      },
      {
        heading: "When you write a solicitation, grant announcement or contract",
        items: [
          "Check the window against the capacity of the organizations you actually need to hear from.",
          "Offer milestone or partial advance payment where reimbursement alone would decide the field.",
          "Scale insurance, audit and bonding requirements to the size and risk of this work, not to the template they came from.",
          "State that interpreting, translation, accessible formats and paying community members are allowable costs, and give the budget form a line for them.",
          "Confirm the package, its attachments and the submission route can be read and used with a screen reader and in plain language.",
        ],
      },
      {
        heading: "When you read a spending or staffing report",
        items: [
          "Break the figure out one level further than usual before you trust it.",
          "Check the denominator: per enrolled person and per eligible person usually tell different stories.",
          "Count the costs that never reach an invoice — staff workaround hours, waiting and travel, unpaid partner work, the price of the process failing.",
          "Write down what the record cannot see, and name the person who could tell you.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Contracts, fiscal and procurement staff — a good place to start, because the design choices in this module are mostly in your drafting hands.",
          "Executive and senior leaders — a good place to start, because the sequencing, scope and declined-list decisions sit at your level.",
          "Policy and program staff, whose plan commitments live or die on whether a line, an owner and a date were attached.",
          "Quality, compliance and performance staff, who see the cost of a design failing long before it appears in a budget comparison.",
          "Data, research and evaluation staff, who decide which breakdowns get made and whether an average is allowed to stand alone.",
          "Supervisors and managers, who allocate the most flexible resource in the division — staff hours — and usually without calling it a budget.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Leading a reflective DSD team",
          "Equitable policy and procedure governance",
          "Responsible data and evaluation",
          "Co-design and compensated partnership",
          "Quality, complaints, and incident learning",
        ],
      },
    ],
  },
  sources: [
    {
      title: "Minnesota Management and Budget",
      href: "https://mn.gov/mmb/",
      note: "The state agency responsible for budget, accounting and financial management across Minnesota's executive branch, including the budget instructions and processes state agencies work within.",
    },
    {
      title: "Minnesota Department of Administration, Office of State Procurement",
      href: "https://mn.gov/admin/osp/",
      note: "Statewide purchasing and contracting authority, policies and vendor information, including the certification programs and solicitation processes that shape who can compete for state work.",
    },
    {
      title: "Minnesota Office of Grants Management",
      href: "https://mn.gov/admin/government/grants/",
      note: "Statewide grants policies and templates governing how Minnesota agencies announce, award, monitor and pay state grants.",
    },
    {
      title: "Minnesota Department of Human Services, services for people with disabilities",
      href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/",
      note: "The department's public information on disability services, used here for the program structures the division funds, contracts for and oversees.",
    },
    {
      title: "Minnesota Council on Disability",
      href: "https://www.disability.state.mn.us/",
      note: "Minnesota's council on disability policy, accessibility and rights, which advises state leaders and provides accessibility information and resources.",
    },
    {
      title: "Section508.gov, U.S. General Services Administration",
      href: "https://www.section508.gov/",
      note: "Federal guidance on buying accessible information and communication technology, including how to write accessibility requirements into a solicitation and check them before award.",
    },
    {
      title: "National CLAS Standards, Think Cultural Health, U.S. Department of Health and Human Services",
      href: "https://thinkculturalhealth.hhs.gov/clas",
      note: "The national standards for culturally and linguistically appropriate services, including the standard calling for governance and leadership that promote those services through policy, practices and allocated resources, and the standards on partnering with communities.",
    },
    {
      title: "Minnesota Framework for Universal Multicultural Instructional Design",
      href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf",
      note: "The design reference for this curriculum. Built on universal design for learning, universal instructional design and integrated multicultural instructional design, it is organized around four foundations — what we learn, how we learn, how learning is supported, and how learning is shown — and calls for diverse ways to engage learners.",
    },
  ],
};

export default pack;
