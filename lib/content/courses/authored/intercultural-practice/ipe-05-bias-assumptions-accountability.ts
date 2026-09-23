import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Foundations · Module 5: Bias, Assumptions and Accountability.
// Internal DHS/DSD public-administration learning. Voluntary, self-directed, no scores or records of reflection.
const pack: CoursePack = {
  course: {
    id: "ipe-05-bias-assumptions-accountability",
    indexNumber: 1147,
    seriesLabel: "Intercultural Practice and Equity · Foundations",
    title: "Bias, Assumptions and Accountability",
    subtitle: "How assumptions travel from a quick judgment into a routine, into a standard, and into the lives of people who never met you.",
    scope: "For internal DHS and DSD staff who make or shape decisions: quality, compliance and performance staff; data, research and evaluation staff; supervisors and managers; administrative and support staff; and anyone in policy, communications, contracts or program oversight. This is a useful starting module. Participation is voluntary and self-directed. There are no scores, badges, rankings or completion requirements, reflections are private and are not recorded, and nothing here is a required compliance program or a substitute for a formal decision by the responsible office.",
    treatment: "Four short lessons with Minnesota public-administration scenarios, sorting and tab exercises, knowledge checks, a pause-and-question routine you can copy, and optional private reflection",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-07.jpg",
    coverAlt: "A colleague considers a question thoughtfully during a meeting.",
    introTranscript: "Most bias training asks you to find the flaw in yourself. This module asks a different question: where do assumptions actually do their damage in a public system? Usually not in one person's head, but in a default nobody chose, a criterion nobody revisited, a number that measured only the people the process already worked for. You will practice locating an assumption in three places, walk a decision to find where assumptions enter it, test evidence that confirms what you already believe, and build a short pause-and-question routine you can use before your next consequential decision. Nothing you write here is collected.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Explain how an assumption operates in three places: a quick reading of a situation, a routine that repeats it, and a standard the organization treats as normal.",
        "Locate the points in a consequential decision where assumptions enter: the framing, the room, the evidence, the default, the criteria and the exception path.",
        "Separate what a rule actually requires from what habit has added to it.",
        "Test a number, a story or a finding for who is missing from it before it travels into a decision.",
        "Use a five-question pause before a consequential decision, and describe what accountability and repair require when a decision causes harm or exclusion.",
      ],
      evidence: [
        "A sorting exercise that separates built-in assumptions, real requirements and preferences dressed as standards.",
        "A knowledge check in every lesson with feedback that explains the reasoning, not just the answer.",
        "A completed pause-and-question routine written for one real decision in your own work.",
      ],
      appliedNextStep: "Choose one decision you will make or shape in the next few weeks that affects people outside this building. Write the five questions beside it before you decide, and keep the answers where a colleague can see them.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in DHS or DSD policy, delegation or review practice that changes who decides or how a decision is documented",
        "A change in federal or state civil-rights, accessibility or language-access guidance that affects what is required rather than optional",
        "Feedback from staff or from compensated community advisors that a scenario reads as blaming individuals rather than examining a decision",
      ],
      relatedDoor: "Formal determinations — complaints, discipline, accommodation requests, civil-rights findings, policy exceptions and contract awards — belong to the responsible DHS office, such as human resources, the equal opportunity or civil-rights office, the accessibility coordinator or your division's policy owner; this module prepares your thinking before those decisions and does not make them.",
      toolkitQuestion: "Who could be helped, burdened, excluded or misunderstood by this decision, and what in the design will change before it reaches them?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-05-1",
        number: 1,
        title: "Bias is a pattern, not a verdict",
        summary: "Assumptions live in three places: a quick reading, a routine that repeats it, and a standard nobody questions. Only one of those is about a person.",
        minutes: 10,
        learning: {
          objective: "Locate the same assumption in three places — a staff member's quick reading, a repeated routine, and an organizational standard — using one example from your own division's work.",
          takeaways: [
            "A quick reading is unavoidable; every person makes one. What turns it into a pattern is a routine that repeats it and a standard that rewards it.",
            "Treating bias as a private character flaw makes it unfixable and makes people defensive. Treating it as a property of decisions, defaults and criteria makes it work anyone can do.",
            "A policy that applies to everyone in the same words can still land differently on different people. Noticing that is analysis, not accusation; whether a difference is unlawful is a determination made by the responsible office, not in a learning module.",
            "Attention only to what people have in common — the Minimization stage on the intercultural development continuum this program uses — can feel like fairness while quietly setting one group's experience as the default.",
          ],
          evidence: "A scenario about uneven exception approvals across regional offices, and a knowledge check on where a pattern actually lives.",
          appliedNextStep: "Take one decision your unit made this month. Write the quick reading behind it, the routine that repeated it, and the standard that made it look correct.",
        },
        scenario: {
          context: "A DSD program oversight team reviews a year of requests for exceptions to a service policy. Approval rates differ sharply by which regional office submitted the request. The offices serve different communities. A manager says, “I know these reviewers. Nobody here is biased — the requests we approve are simply the ones that are better documented.”",
          prompt: "What is the most useful next step for the oversight team?",
          options: [
            {
              label: "Accept the explanation. Documentation quality is a legitimate reason, and questioning the reviewers' fairness without proof would damage the team.",
              response: "The explanation may be partly true and still leave the question unanswered. Nobody has asked what counts as good documentation, who has the time and templates to produce it, or whether the standard itself is the pattern.",
            },
            {
              label: "Ask what the review actually rewards: what counts as complete, which offices have templates and staff time, what happens to a request written by someone using an interpreter, and whether reviewers see the requester's office before deciding.",
              response: "This moves the question from the reviewers' character to the structure of the decision. Every item is observable, changeable, and belongs to the organization rather than to any individual.",
              recommended: true,
            },
            {
              label: "Send the reviewers to unconscious-bias training and re-run the analysis next year.",
              response: "Training alone leaves the criteria, templates, workloads and review order exactly as they were. If the standard is producing the pattern, the pattern returns as soon as the training ends.",
            },
          ],
        },
        transfer: {
          prompt: "Where in your own work does “we treat everyone the same” describe the rule rather than the result?",
          options: [
            "Name one process you own that uses identical wording for everyone",
            "Name one group for whom that identical wording takes more time, money, travel or explaining",
            "Write the one thing you could check to find out whether you are right",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Three places an assumption lives",
            body: "<p>Every person reads a situation quickly. You see a request, a name, an address, a sentence written in a second language, a file that arrived late, and you form an impression before you have thought about it. That is ordinary human cognition, and no amount of goodwill removes it. It is also the least interesting part of bias in a public system.</p><p>The interesting part is what happens next. A quick reading that stays in one person's head affects one decision. A quick reading that gets written into a routine — the order files are reviewed, the template that is considered complete, the address of the office that gets the site visit — affects thousands of decisions and keeps affecting them long after the person who first made it has retired. And a quick reading that becomes a standard, the thing the organization treats as obviously correct, stops being visible at all. Nobody argues with it, because nobody can see it.</p><p>This is why locating bias in individuals alone fails twice. It fails the people affected, because the routine keeps running. And it fails staff, because it turns a design problem into an accusation about character, which almost nobody can hear.</p>",
          },
          {
            type: "tabs",
            heading: "The same assumption, three places",
            tabs: [
              { label: "In the moment", body: "<p>A reviewer skims a request written in short, plain sentences by someone using an interpreter and reads it as thin. The decision takes eleven seconds and feels like expertise. It is not malice, and the reviewer could not tell you it happened.</p>" },
              { label: "In the routine", body: "<p>The unit's practice is to return anything under two pages for more detail. Nobody wrote that rule; it grew. It now converts that eleven-second reading into a standing outcome for every request written plainly, by anyone, forever.</p>" },
              { label: "In the standard", body: "<p>The quality measure the unit reports on is the completeness of documentation. Length has quietly become the proxy for care. Two offices with more staff time score well; the offices serving the most people score poorly; leadership reads the result as a performance difference.</p>" },
            ],
          },
          {
            type: "flashcards",
            heading: "Words worth keeping apart",
            cards: [
              { front: "Assumption", back: "<p>Something treated as true without being checked. Not always wrong — much of professional work runs on reasonable assumptions. The risk is the unchecked one carried into a decision that affects someone else.</p>" },
              { front: "Default", back: "<p>What happens when nobody makes a choice: the standard form, the usual channel, the automatic closure, the pre-checked box. Defaults decide more than debates do.</p>" },
              { front: "Standard", back: "<p>What the organization treats as obviously correct. It is the hardest layer to see, because questioning it sounds like questioning quality itself.</p>" },
              { front: "Different effect", back: "<p>A rule written the same for everyone that lands differently on different people. Naming it is analysis. Whether it crosses a legal line is decided by the responsible office, with the facts in front of them.</p>" },
              { front: "Accountability", back: "<p>Not confession. Finding out what a decision did, telling the people affected, changing the thing that produced it, and saying what changed.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Move the question from who to what",
            control: "You control whether a difference in outcomes is discussed as a claim about people's character or as a question about criteria, defaults, workload and review order.",
            failure: "Do not open with “are we biased?” The honest answer is yes, everyone is, and the conversation ends there in defensiveness. Do not close with training as the only remedy.",
            next: "The next time a pattern appears in your data, write three candidate explanations that are entirely structural before anyone offers one about individuals, and check each.",
          },
          {
            type: "quote",
            text: "I kept being told the reviewers were fair, and I believed it. Then I read the template. It asked for things only an office with a full-time coordinator could produce. Nobody was unfair. The form was.",
            cite: "Composite DHS program oversight perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-05-1-check",
            question: "A unit finds that requests from one regional office are approved far less often. Which line of inquiry is most likely to find something the unit can actually change?",
            options: [
              { text: "Ask each reviewer to reflect privately on whether they hold negative views about that region's communities.", correct: false },
              { text: "Examine what the review rewards — the template, what counts as complete, reviewer workload, review order and whether the requester's office is visible during review.", correct: true },
              { text: "Conclude that the analysis cannot show intent, so no finding is possible until someone reports unfair treatment.", correct: false },
              { text: "Set an approval target for each office so the rates match by the end of the year.", correct: false },
            ],
            feedbackCorrect: "Yes. Criteria, templates, workload and review order are observable and belong to the organization. Changing them changes outcomes; asking people to search their conscience does not.",
            feedbackIncorrect: "Ask which option produces something the unit can inspect and alter. Private reflection changes nothing structural, waiting for a complaint puts the burden on people already disadvantaged, and a quota changes the number without changing what produced it.",
          },
        ],
      },
      {
        id: "ipe-05-2",
        number: 2,
        title: "Where assumptions enter a decision",
        summary: "Six entry points, every one of them ordinary: how the question was framed, who was in the room, what counted as evidence, the default, the criteria, and the exception path.",
        minutes: 11,
        learning: {
          objective: "Walk one consequential decision through six entry points and name at least two places where an unchecked assumption is shaping the outcome.",
          takeaways: [
            "The framing of a question decides most of the answer. “How do we reduce errors in applications?” and “Why is our application hard to complete correctly?” send two different teams in two different directions.",
            "Criteria that reward familiarity with the agency — prior state contracting experience, knowing the right words, having a grants writer — measure proximity to the system as if it were capacity to do the work.",
            "Separating what a rule actually requires from what habit has added to it is one of the highest-value things a staff member can do, and it usually takes an afternoon with the policy text.",
            "An exception path that exists only for people who know it exists is not an exception path; it is a reward for insider knowledge.",
          ],
          evidence: "A contracting scenario about scoring criteria, and a sorting exercise separating built-in assumptions, real requirements and preferences dressed as standards.",
          appliedNextStep: "Take one decision currently in front of you and write one sentence for each of the six entry points. Mark the two you are least sure about, and find out.",
        },
        scenario: {
          context: "A DSD team is finalizing the scoring criteria for a grant that funds community outreach about disability services. Two criteria carry the most weight: prior experience administering a state contract, and a detailed workplan in a specified format. Staff notice that disability-led and culturally specific organizations — the ones closest to the people the grant is meant to reach — consistently score in the bottom half.",
          prompt: "What should the team do before the request goes out?",
          options: [
            {
              label: "Leave the criteria as they are. They are applied identically to every applicant, and prior contract experience is a reasonable proxy for the ability to manage public money.",
              response: "Identical application is not the issue. The criteria measure familiarity with state contracting rather than the ability to reach the people the grant exists for, and that choice was made by this team, not by the applicants.",
            },
            {
              label: "Separate what is legally or fiscally required from what is preference: keep the real financial-accountability requirements, replace “prior state contract” with demonstrated ability to manage funds at this scale, weight demonstrated reach into the communities the grant targets, offer the workplan in more than one format, and hold an open pre-application session.",
              response: "This keeps every genuine obligation, removes the proxies that measure proximity to the agency, and changes the design before it produces an outcome someone would have to appeal.",
              recommended: true,
            },
            {
              label: "Keep the criteria and add points for organizations that serve the target communities, so the scoring balances out.",
              response: "Adding weight on top of a flawed measure leaves the flawed measure in place and invites a fairness challenge. It also reads as a thumb on the scale rather than a correction to what is being measured.",
            },
          ],
        },
        transfer: {
          prompt: "Pick one decision your unit repeats often. Which of the six entry points has nobody looked at in years?",
          options: [
            "Name the decision and the entry point nobody has examined",
            "Find the policy or rule text and mark what it actually requires",
            "Bring the difference between the rule and the habit to the person who owns the process",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A decision is a sequence, and each step has a door",
            body: "<p>Consequential decisions in public administration rarely arrive as a single choice. They arrive as a sequence: someone frames a question, someone convenes a group, evidence is gathered, a default is inherited, criteria are set, and an exception path is written for the cases the criteria will fail. Every step is a door an assumption can walk through, and most of them are propped open by convenience rather than intent.</p><p>This matters because the later you notice, the more expensive the fix. An assumption caught in the framing costs a conversation. The same assumption caught after the request for proposals is published costs an amendment. Caught after the award, it costs a protest, a delay and the trust of organizations that will not apply next time.</p><p>The six entry points below are not a theory. They are where the work actually is, and staff in quality, contracts, data, communications and supervision touch several of them every week.</p>",
          },
          {
            type: "accordion",
            heading: "Six entry points, with the question that opens each",
            items: [
              { title: "The framing", body: "<p>Whoever writes the problem statement has already decided where to look. “How do we reduce incomplete applications?” points at applicants. “Why does our application produce incomplete submissions?” points at the form. Ask: whose behavior does this framing make the problem?</p>" },
              { title: "The room", body: "<p>Who was convened, and who was consulted only after the design was set? Ask: whose expertise is missing from this table, and would inviting them earlier have been cheaper than the revision we are about to make? Community members, people with disabilities, families and culturally specific organizations belong here as compensated advisors and co-designers, not as an audience for a finished plan.</p>" },
              { title: "The evidence", body: "<p>What counted as evidence, and what was dismissed as anecdote? Administrative data describes people the system already processed. Ask: who never appears in this data at all, and what would it take to hear from them?</p>" },
              { title: "The default", body: "<p>What happens when nobody chooses: the standard letter, the mail-only notice, the automatic closure, the business-hours-only channel. Ask: what does our default assume about a person's transportation, schedule, reading, language, energy and internet access?</p>" },
              { title: "The criteria", body: "<p>What is being measured, and is the measure the thing or a proxy for the thing? Ask: does this criterion measure capacity to do the work, or familiarity with how we write things?</p>" },
              { title: "The exception path", body: "<p>Every rule fails someone. Ask: is the exception route published in plain language where the affected person will see it, or does it depend on knowing whom to call?</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-05-2-sort",
            heading: "Built-in assumption, real requirement, or preference dressed as a standard?",
            categories: ["Assumption we built in", "Requirement we must meet", "Preference dressed as a standard"],
            items: [
              { text: "Applicants must document how funds will be tracked and reported.", category: "Requirement we must meet" },
              { text: "The workplan must use our template, in a spreadsheet, with one row per activity.", category: "Preference dressed as a standard" },
              { text: "Notices go out by mail only, because that is how the notice system was set up.", category: "Assumption we built in" },
              { text: "Public meeting materials must be provided in an accessible format on request.", category: "Requirement we must meet" },
              { text: "A request under two pages is returned for more detail.", category: "Preference dressed as a standard" },
              { text: "Applicants who have not held a state contract before are unlikely to manage this one well.", category: "Assumption we built in" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Read the rule before you defend the habit",
            control: "You control whether your unit can say, with the text in front of it, which parts of a process are required and which parts are custom.",
            failure: "Do not let “we have always required it” stand in for “the rule requires it.” The two get confused quietly, and staff end up defending a preference as if it were the law.",
            next: "Choose one requirement your unit enforces, find the policy or statute text behind it, and mark in writing what it requires and what your office added.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-05-2-check",
            question: "A team wants to know why so many renewal forms come back incomplete. Which framing is most likely to produce a fix the agency can own?",
            options: [
              { text: "Why do these households fail to complete the form correctly?", correct: false },
              { text: "What in our form, instructions, timeline and channels produces incomplete submissions, and for whom?", correct: true },
              { text: "Which staff are approving incomplete forms, and how do we hold them accountable?", correct: false },
            ],
            feedbackCorrect: "Right. The framing points at something the agency designed and can change, and it asks for whom — which is where the pattern will show.",
            feedbackIncorrect: "Notice whose behavior each framing makes the problem. Two of these send the team looking at people who cannot change the form; one sends it to the form.",
          },
        ],
      },
      {
        id: "ipe-05-3",
        number: 3,
        title: "Evidence that agrees with you",
        summary: "Four ordinary shortcuts — looking for what fits, remembering the vivid case, anchoring on the first number, and never noticing who is missing from the data.",
        minutes: 11,
        learning: {
          objective: "Test one number, finding or story you rely on by naming who is missing from it and what evidence would change your conclusion.",
          takeaways: [
            "Administrative data describes the people the system already processed. Everyone who gave up, never heard about the program, could not reach the channel, or was screened out at the door is missing from it, and their absence looks like satisfaction.",
            "The vivid case — the one difficult call everyone in the unit remembers — quietly becomes the design assumption for thousands of ordinary cases.",
            "The first number on the table anchors the discussion even when everyone knows it is rough. Say the limits of a number in the same breath as the number, before it travels.",
            "Naming what would change your mind, in advance, is the most practical protection against finding only what you expected to find.",
          ],
          evidence: "A scenario about a satisfaction survey that reached only people the process already worked for, and a knowledge check on reading a finding honestly.",
          appliedNextStep: "Take one measure your unit reports. Write one sentence naming who is not in it, and attach that sentence to the number the next time it is presented.",
        },
        scenario: {
          context: "An evaluation team reports that satisfaction with a DSD service is high. The survey was sent by email, in English, to people who completed enrollment, with a link that needed a computer or smartphone. A leadership briefing is being drafted, and the headline reads: participants are satisfied.",
          prompt: "What should the evaluation team do before this number goes into the briefing?",
          options: [
            {
              label: "Publish the result as it is. The response rate was acceptable and the survey was sent to everyone eligible under the method used.",
              response: "The method itself selected the respondents. Everyone who left before enrolling, who reads another language, who has no device or connection, and who found the process too hard to finish is absent — and their absence is what made the number look good.",
            },
            {
              label: "Report the result with the denominator named plainly — who could and could not be reached, and who left before enrollment — then propose a way to hear from people who are missing, with interpreting and non-digital options, before any decision rests on this number.",
              response: "This keeps the finding, states what it actually measures, and puts a correction in motion. It also stops a partial number from becoming the basis of a decision that affects the people it never reached.",
              recommended: true,
            },
            {
              label: "Drop the survey result from the briefing entirely, since it is flawed.",
              response: "Removing it loses real information about enrolled participants and hides the more useful finding: that the agency does not currently have a way to hear from people the process turned away.",
            },
          ],
        },
        transfer: {
          prompt: "Which number does your unit repeat most often in briefings, and who is not counted in it?",
          options: [
            "Name the measure and the population it actually covers",
            "Name one group systematically absent from it and why",
            "Draft the single sentence you will attach to the number from now on",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The data describes the people the system already worked for",
            body: "<p>Public systems generate enormous amounts of information about the people inside them: applications processed, calls answered, cases opened, services authorized, surveys returned. That information is real, and it is also systematically incomplete in one direction. It records the people who got far enough in to be recorded. The person who read the notice, could not understand it, and put it in a drawer produces no record at all — or produces one that says “did not respond,” which is a sentence about them rather than about the notice.</p><p>This is the most consequential measurement problem in public administration, and it does not require anyone to be careless. It is built into where the data comes from. A process that excludes people effectively will report high satisfaction among the people it did not exclude, and the number will be accurate.</p><p>The remedy is not to distrust data. It is to state, every time, what the data covers and who is outside it — and to spend some of the unit's effort deliberately reaching the people the usual channels miss, with interpreting, plain language, paper, phone and in-person options, and with community organizations compensated for the work of reaching them.</p>",
          },
          {
            type: "tabs",
            heading: "Four shortcuts, and what each looks like in a state agency",
            tabs: [
              { label: "Looking for what fits", body: "<p>You believe the new process is working, so the three success stories stick and the two complaints get explained away as unusual. In practice: a pilot report that quotes four positive comments and summarizes twenty critical ones as “mixed feedback.” The fix is to write down, before you look, what result would change your mind.</p>" },
              { label: "The vivid case", body: "<p>One difficult call two years ago becomes the reason for a verification step that costs every applicant twenty minutes. Rare, memorable events feel common because they are easy to recall. The fix is to ask how often this actually happens, and what the safeguard costs everyone else.</p>" },
              { label: "The first number", body: "<p>Someone offers a rough estimate early in a meeting. Every later discussion adjusts up or down from it, and nobody returns to whether it was sound. The fix is to say the basis and the limits of a number in the same breath as the number, and to ask for the basis when someone else offers one.</p>" },
              { label: "Who is missing", body: "<p>The measure covers people who completed the process. The people it failed are not in the denominator, so the failure appears as success. The fix is to name the population the measure actually covers every time it is reported, and to build one route that hears from people outside it.</p>" },
            ],
          },
          {
            type: "list",
            heading: "Five questions to ask of any finding before it travels",
            ordered: true,
            items: [
              "Who is counted here, and who could never have been counted?",
              "What would I expect to see if the opposite were true, and did I look for it?",
              "Is this measuring the thing, or something that correlates with being close to the agency?",
              "How was this collected — which language, which channel, which device, which hours?",
              "What sentence about the limits will travel with this number into the next meeting?",
            ],
          },
          {
            type: "quote",
            text: "Our completion rate looked excellent. Then someone asked how many people started and stopped. We had never collected it. The number we were proud of only counted the people who made it through.",
            cite: "Composite DHS evaluation staff perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-05-3-check",
            question: "A report shows that a redesigned online form has a high completion rate among people who start it. Which conclusion is best supported?",
            options: [
              { text: "The redesign works well for the public, since most people who start the form finish it.", correct: false },
              { text: "The redesign works for people who can reach and start the online form; the report says nothing about people who never reached it, and that group needs a separate way to be heard.", correct: true },
              { text: "The completion rate is meaningless because the sample is biased.", correct: false },
              { text: "The high rate suggests the form may now be too easy and verification should be strengthened.", correct: false },
            ],
            feedbackCorrect: "Yes. The finding is real and narrow. Stating what it covers keeps it useful and stops it from answering a question it never asked.",
            feedbackIncorrect: "Ask who could appear in this measure at all. The number is genuine for the people who started online; it is silent about everyone who did not get that far.",
          },
          {
            type: "statement",
            body: "Private reflection, not recorded and not shared: think of a finding you have repeated in the last month. Who was outside it, and would you have noticed if no one had asked?",
          },
        ],
      },
      {
        id: "ipe-05-4",
        number: 4,
        title: "The pause, and what accountability asks for",
        summary: "Five questions before a consequential decision, and the difference between reassuring people and repairing something.",
        minutes: 12,
        learning: {
          objective: "Write a five-question pause for one real decision in your own work, and distinguish repair from reassurance when a decision has caused harm or exclusion.",
          takeaways: [
            "A pause is only useful before the decision. The same five questions asked afterward produce an explanation rather than a different outcome.",
            "Written answers beat mental ones. A routine kept in your head disappears under deadline pressure; a routine written where a colleague can see it survives.",
            "Repair has four parts: find out what happened, tell the people affected in a form they can use, change what produced it, and say what changed. An apology without the third part is reassurance.",
            "Moving from noticing difference to changing how the work is designed is the step the intercultural development continuum calls adaptation. It is a property of practice and design, never a label or record attached to a person.",
          ],
          evidence: "A scenario about a notice that excluded people after it was sent, a sorting exercise separating repair from reassurance, and a pause-and-question routine written for one real decision.",
          appliedNextStep: "Name the next consequential decision you will make or shape. Write the five questions and your answers beside it before you decide, and tell one colleague you did.",
        },
        scenario: {
          context: "A notice went out to households telling them they must appear in person at a county office during business hours to keep a service. After it was mailed, staff learn that it was not offered in any other language, gave no phone or remote option, and reached people who cannot travel that distance. Some people have already lost the service. In the team meeting, one person says the notice met the policy requirement and a correction would make the division look bad.",
          prompt: "What does accountability actually require here?",
          options: [
            {
              label: "Note the problem internally, fix the template for next time, and avoid drawing attention to a notice that met the letter of the policy.",
              response: "This protects the division and leaves the harm in place. The people who lost the service are not restored, and nobody outside the room learns what happened or how to challenge it.",
            },
            {
              label: "Find out who was affected, contact them in accessible formats and needed languages with a real route back, restore what can be restored, name in writing what in the process allowed it — no accessibility or language review, no alternative channel, a short window — assign the fix with an owner, and report what changed.",
              response: "This is the full shape of repair: find out, tell, restore, change the cause, and say what changed. It also names the structural gap, which is what stops the same notice going out again next quarter.",
              recommended: true,
            },
            {
              label: "Issue a public apology acknowledging that the notice caused hardship and reaffirming the division's commitment to accessibility.",
              response: "An apology matters, but on its own it is reassurance. Without restoration for the people affected and a change to the review step that let it through, the same notice can go out again.",
            },
          ],
        },
        transfer: {
          prompt: "What is the next decision in front of you that will affect people who are not in the room?",
          options: [
            "Name the decision and the date you have to make it",
            "Write your answers to the five questions before that date, not after",
            "Name the colleague who will read your answers and push on the weakest one",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A pause is a design step, not a delay",
            body: "<p>Most of the assumptions in this module are invisible in the moment and obvious in hindsight. The practical countermeasure is not more self-examination; it is a short, repeatable routine attached to the decisions that matter, done in writing, before the decision is made. Five questions take about ten minutes. An amended request for proposals, a corrected notice, an appeal or a complaint takes considerably longer.</p><p>Use it for consequential decisions: anything that changes who gets a service, how people are contacted, what an organization must do to be funded, what a measure will count, what a policy requires, or how a staff member will be evaluated. Do not use it for everything; a routine applied to every email becomes a ritual nobody completes.</p><p>Two things make the difference between a routine that works and one that quietly stops. Write the answers down, in the record where the decision lives. And show them to one person who is willing to push on the weakest answer — not for approval, but because the question you skipped is the one you did not want to ask.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A pause-and-question routine for a consequential decision",
            summary: "Five questions, written beside one real decision, before it is made. Copy the fields into the record where the decision lives.",
            fields: [
              { label: "The decision and who it affects", value: "Renewal notice redesign for a home and community-based service. Affects every household in the program, including people who read another language, people who do not use computers, and people who rely on another person to open their mail." },
              { label: "Five questions to ask before you decide", value: "Who is affected, including who is not in this room? What am I treating as normal here, and where did it come from? What does the rule actually require, and what did we add out of habit? What evidence am I using, who is missing from it, and what would change my mind? If this causes harm or exclusion, how would we find out, and what would repair require?" },
              { label: "What the questions changed", value: "Added a phone and in-person route; extended the response window; sent the notice for plain-language and accessibility review before printing; removed a documentation step the policy does not require." },
              { label: "Whose expertise we paid for", value: "Two community organizations and one self-advocate reviewed the draft notice as compensated advisors before it was finalized, not after." },
              { label: "Who reviewed it, and when it gets revisited", value: "Reviewed with the process owner and the accessibility coordinator; revisited at the agreed review point with the count of people who used each route." },
            ],
            action: "Copy these fields into your own decision record, answer the five questions in writing before you decide, and give the answers to one colleague who will push on the weakest one.",
          },
          {
            type: "sorting",
            id: "ipe-05-4-sort",
            heading: "Repair or reassurance?",
            categories: ["Repair", "Reassurance"],
            items: [
              { text: "Contact the people who lost the service, in their language and in an accessible format, with a route back.", category: "Repair" },
              { text: "Restate the division's commitment to accessibility in the next newsletter.", category: "Reassurance" },
              { text: "Add an accessibility and language review step before any notice is printed, with a named owner.", category: "Repair" },
              { text: "Tell the team the mistake was understandable given the deadline.", category: "Reassurance" },
              { text: "Publish what changed, so people affected can see whether it was actually fixed.", category: "Repair" },
              { text: "Send the staff who drafted the notice to a training on inclusive communication and consider the matter closed.", category: "Reassurance" },
            ],
          },
          {
            type: "list",
            heading: "What repair asks for, in order",
            ordered: true,
            items: [
              "Find out: who was affected, how many, and how you know.",
              "Tell them: in the languages and formats they use, with a real route back and a named contact.",
              "Restore what can be restored, and say plainly what cannot.",
              "Change the thing that produced it — the criterion, the default, the missing review step, the timeline — with an owner and a date.",
              "Say what changed, where the people affected will actually see it.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Ask the question before the notice, not after the complaint",
            control: "You control whether the five questions are answered while the decision can still change, and whether the answers are written where someone else can read them.",
            failure: "Do not let the routine become a form filled in after the decision to document good intentions. And do not treat an apology as the fix when the step that produced the harm is still in place.",
            next: "Attach the five questions to one recurring decision your unit makes, answer them in writing this month, and see what changes.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-05-4-check",
            question: "A policy change excluded a group of people from a service for two months before anyone noticed. Which response contains all the parts of repair?",
            options: [
              { text: "Apologize publicly, commit to doing better, and add the issue to the division's improvement plan.", correct: false },
              { text: "Identify and contact the people affected in accessible formats, restore what can be restored, change the review step that let it through with a named owner, and publish what changed.", correct: true },
              { text: "Quietly correct the policy and monitor for complaints, since raising it may cause unnecessary alarm.", correct: false },
            ],
            feedbackCorrect: "Yes. Find out, tell, restore, change the cause, say what changed. Missing any one of those leaves either the people or the process unaddressed.",
            feedbackIncorrect: "Check each option against four things: do the affected people learn about it, is anything restored, does the thing that produced it change, and can anyone outside the room see the result?",
          },
          {
            type: "statement",
            body: "Private reflection, not recorded and not shared: think about the last consequential decision you shaped. If harm or exclusion had come from it, how would you have found out — and who would have had to speak up for you to know?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Pause before a consequential decision",
    subtitle: "One page for decisions that affect people who are not in the room",
    quote: "Bias in a public system is rarely a person's verdict. It is a default nobody chose, a criterion nobody revisited, and a number that counted only the people the process already worked for.",
    use: {
      purpose: "Keep the five questions and the shape of repair in reach while you set criteria, write a notice, design a measure, review a request or change a policy.",
      remember: [
        "An assumption lives in three places: a quick reading, a routine that repeats it, and a standard nobody questions. Only the first is about a person.",
        "Separate what the rule requires from what habit added. Most units can do this in an afternoon with the policy text.",
        "Data describes the people the system already processed. Say who is missing in the same breath as the number.",
        "Repair is find out, tell, restore, change the cause, say what changed. An apology without the fourth part is reassurance.",
      ],
      doNext: "Write the five questions beside your next consequential decision, before you make it, and give the answers to one colleague who will push on the weakest one.",
    },
    sections: [
      {
        heading: "The five questions",
        items: [
          "Who is affected by this, including who is not in this room?",
          "What am I treating as normal here, and where did that come from?",
          "What does the rule actually require, and what did we add out of habit?",
          "What evidence am I using, who is missing from it, and what would change my mind?",
          "If this causes harm or exclusion, how would we find out, and what would repair require?",
        ],
      },
      {
        heading: "Where assumptions enter a decision",
        items: [
          "The framing: whose behavior does this problem statement make the problem?",
          "The room: whose expertise is missing, and would paying for it earlier be cheaper than the revision ahead?",
          "The evidence: who never appears in this data at all?",
          "The default: what does it assume about transportation, schedule, language, reading, energy and connection?",
          "The criteria: is this measuring capacity to do the work, or familiarity with how we write things?",
          "The exception path: is it published where the affected person will see it, or does it depend on knowing whom to call?",
        ],
      },
      {
        heading: "When something has already gone wrong",
        items: [
          "Find out who was affected and how you know.",
          "Tell them in the languages and formats they use, with a named contact and a route back.",
          "Change the criterion, default, timeline or missing review step, with an owner and a date.",
          "Say what changed where the people affected will see it, and send formal determinations to the responsible office.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Quality, compliance and performance staff, as a useful starting module.",
          "Data, research and evaluation staff, as a useful starting module.",
          "Supervisors and managers, as a useful starting module.",
          "Administrative and support staff, as a useful starting module.",
          "Anyone in policy, communications, contracts or program oversight who sets criteria or writes what goes out the door.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Intercultural practice in public disability services",
          "Public power and institutional impact",
          "Person-centered thinking in state systems",
          "Accessible and respectful communication",
          "Participation and voice",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, plain language, learner choice and no forced disclosure." },
    { title: "Intercultural Development Inventory", href: "https://www.idiinventory.com/", note: "Source of the intercultural development continuum (denial, polarization, minimization, acceptance, adaptation, integration) named in this module. The assessment itself is licensed and administered by qualified administrators; this program uses the continuum as a framework for content, never as a score or record about any person." },
    { title: "Government Alliance on Race and Equity, Racial Equity Toolkit: An Opportunity to Operationalize Equity", href: "https://www.racialequityalliance.org/resources/racial-equity-toolkit-opportunity-operationalize-equity/", note: "A public-sector method for asking structured questions before a decision is made rather than after; the basis for the pause-and-question approach in Lesson 4." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards (Think Cultural Health)", href: "https://thinkculturalhealth.hhs.gov/clas/standards", note: "National standards for culturally and linguistically appropriate services, including governance, workforce, communication and accountability expectations for organizations." },
    { title: "Urban Institute, Principles for Advancing Equitable Data Practice", href: "https://www.urban.org/research/publication/principles-advancing-equitable-data-practice", note: "Guidance on who is represented in administrative data, what it leaves out, and how to report findings honestly — the basis for Lesson 3." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, accessibility and rights, and a public source for state accessibility expectations." },
    { title: "Minnesota Olmstead Implementation Office", href: "https://mn.gov/olmstead/", note: "Minnesota's plan and public reporting on integrated, self-determined lives for people with disabilities, including measurable commitments and accountability." },
    { title: "ADA.gov, U.S. Department of Justice", href: "https://www.ada.gov/", note: "Federal information on obligations under the Americans with Disabilities Act; used here to keep legal requirements clearly distinct from optional learning." },
  ],
};

export default pack;
