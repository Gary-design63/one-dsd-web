import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Foundations · Module 7: Participation and voice.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-07-participation-and-voice",
    indexNumber: 1149,
    seriesLabel: "Intercultural Practice and Equity · Foundations",
    title: "Participation and Voice",
    subtitle: "Asking people what they think is not the same as letting them shape the decision. Four lessons on accessible engagement, the real difference between consultation, partnership and co-design, and one honest review of who is present and who is missing.",
    scope: "For internal DHS and DSD staff who plan, convene, approve or report on any process where people outside the division are asked for their views: policy and program staff, quality and performance staff, communications and training staff, engagement staff, fiscal and contracting staff, supervisors, senior leaders, and the administrative staff who actually build the invitation, the agenda and the room. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and a presence-and-absence review you can copy into a project you are working on now",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-09.jpg",
    coverAlt: "A large group of colleagues seated around a conference table for a meeting.",
    introTranscript: "Most public processes include a moment where people are asked what they think. Far fewer include a moment where what people said changed the outcome. This module is about the distance between those two things. It covers what meaningful participation actually requires, how the invitation, the timing, the format and the money decide who can take part at all, and the real differences between consulting people, partnering with them, and designing something together. It ends with a review you run on a decision you are working on now: who is present, who is missing, and what you can change while there is still something to change.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Distinguish informing, consulting, partnership and co-design by what each one actually gives people power over, rather than by what it is called.",
        "Plan an engagement so that the invitation, timing, format, access support, materials and compensation are decided while the design is still open.",
        "Match an engagement approach to what is genuinely still changeable in a project, and say plainly which approach you are running.",
        "Review a decision you own for who is present, who is missing, and whose expertise is being substituted for by staff assumption.",
        "Report back to the people who took part, and name what would be owed if a process excluded someone.",
      ],
      evidence: [
        "Four worked scenarios drawn from policy, engagement, contracting and quality work, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates invitations that open a door from invitations that quietly close one, and that tells consultation, partnership and co-design apart by their commitments.",
        "A completed presence-and-absence review for one real decision, with one change made inside your own authority.",
      ],
      appliedNextStep: "Choose one project or decision you are working on now. Run the presence-and-absence review on it, make the one change that is inside your own authority, and route the rest to the people who own it.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in how DHS or DSD convenes advisory bodies, public comment or community engagement, including any change in how members are appointed, supported or compensated",
        "A change in ADA Title II effective-communication requirements, in Minnesota's accessibility standard for state digital content, or in language-access direction under Title VI",
        "Feedback from disabled Minnesotans, families, community organizations or interpreters who serve as paid co-designers or reviewers that an example here reads as unrealistic, tokenizing or disrespectful",
      ],
      relatedDoor: "Formal decisions about convening an advisory body, appointing or compensating its members, issuing a public comment period, or engaging Tribal Nations belong to the responsible DHS offices, including the offices that handle appointments, contracts, civil rights and tribal matters; this module prepares your thinking and your draft, it does not authorize or clear an engagement.",
      toolkitQuestion: "Whose expertise is missing from this decision, and what would it take to have them shape it rather than react to it?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-07-1",
        number: 1,
        title: "Asking is not the same as sharing power",
        summary: "What meaningful participation requires, the five things an engagement can offer, and the honest test for which one you are actually running.",
        minutes: 10,
        learning: {
          objective: "Distinguish informing, consulting, involving, partnership and co-design by what each one actually gives people power over, and name which one a project you are working on is really doing.",
          takeaways: [
            "The useful question is not whether people were asked. It is what was still changeable when they were asked, and what changed afterward.",
            "There are five different offers, and they are often confused on purpose: telling people, asking people, working through an option with people, deciding alongside people, and building the thing together from the start.",
            "An engagement held after the decision is settled is not consultation. It is an announcement with a comment card, and people can tell.",
            "Participation is not a favor the division extends. People with disabilities, families and community organizations hold expertise about how a system actually lands that no amount of staff analysis produces.",
          ],
          evidence: "A scenario about a policy unit convening an input session late in a process, and a knowledge check that separates the volume of input from the influence it had.",
          appliedNextStep: "Take the last engagement your unit held. Write down what was genuinely still changeable that day, and what changed afterward because of what people said.",
        },
        scenario: {
          context: "A Disability Services Division policy unit has drafted a change to how a service is authorized. The approach has been approved internally, the manual language is written, the effective date is set, and the case system change is already in the work queue. The unit schedules a two-hour input session for people who use the service and for family members, sends the invitation eleven days out, and titles it “Community input on the new authorization process.”",
          prompt: "What should the unit do?",
          options: [
            {
              label: "Hold the session as planned. Input is valuable at any stage, and people will appreciate being asked.",
              response: "Holding it is better than not holding it, but the title makes a promise the schedule cannot keep. People will arrive believing the process is open, spend two hours describing what will not work, and later see a change that matches the draft they saw. That experience teaches people that being asked is a formality, and it costs the division something it will need later.",
            },
            {
              label: "Cancel the session. Nothing is changeable, so asking people would be dishonest.",
              response: "Honesty is right; cancellation is the wrong use of it. Plenty is still changeable even now — the notice wording, the timeline, the exceptions, what happens when a request is incomplete, how the change is explained, what gets watched afterward. Canceling treats the whole decision as a single locked object and gives up the parts that are genuinely open.",
            },
            {
              label: "Rename the session to match what is actually on the table, say in the invitation what has been decided and what has not, bring the specific open questions, and commit in writing to coming back with what changed and what did not.",
              response: "This is the recommended path. It gives people accurate information about where their time will land, which is a condition of informed participation. It also produces better input: when people know the authorization approach is settled but the notice, the timeline and the exceptions are open, they spend the two hours on the things they can move. And the commitment to report back is the part that makes the next invitation credible.",
              recommended: true,
            },
          ],
        },
        transfer: {
          prompt: "Think about the last time your unit asked people outside it for their views. What was actually still changeable that day?",
          options: [
            "Name the engagement and write one sentence describing what had already been decided before it started",
            "List what did change afterward because of what people said, and what did not",
            "Write the one sentence you would have put in the invitation if you had described the scope honestly",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The distance between input and influence",
            body: "<p>Public work has a standard move. A decision is developed internally, a draft is produced, and then people are invited to say what they think about it. The invitation is genuine, the staff who send it mean well, and the session often goes reasonably. Months later, the people who came look at what was published and cannot find themselves in it. Nothing dishonest happened at any single step. The outcome is still that a process was described as participatory and was not.</p><p>The gap is almost never caused by ill will. It is caused by sequence. By the time an engagement is convened, the approach has been chosen, the authority has been cited, the resources have been committed, and the effective date is on a calendar someone else controls. What is left to discuss is the wording. Asking people to weigh in at that point produces comments the division cannot use and a feeling the division cannot undo.</p><p>So the honest question is not how many people came or how many comments arrived. It is two plainer questions: what was still changeable when we asked, and what changed because of what we heard? A unit that can answer both, specifically, is doing participation. A unit that can only answer the first with a number is doing outreach.</p>",
          },
          {
            type: "tabs",
            heading: "Five different offers, often called the same thing",
            tabs: [
              { label: "Inform", body: "<p>You tell people what has been decided and what it means for them. Nothing is open. This is legitimate and often necessary — a settled statutory change has to be explained, not negotiated. It becomes a problem only when it is dressed as something else. If nothing is changeable, say so, explain it well, and do not call it input.</p>" },
              { label: "Consult", body: "<p>You ask people for their views on something you will decide. Their expertise informs the decision; the decision stays with you. This is honest and useful when the scope is named, the timing is early enough to matter, and you come back and say what you did with what you heard. Without that last part it is data collection, and people stop responding.</p>" },
              { label: "Involve", body: "<p>You work through options with people over more than one sitting. They see the constraints, the trade-offs and the drafts; you adjust as you go. The decision is still yours, but the reasoning has been shaped in the open. This costs more staff time than consultation and produces far better decisions, because the objections arrive while they can still be answered.</p>" },
              { label: "Partner", body: "<p>You and community organizations, disability-led groups, families or advisory members share responsibility for a piece of the work, with an agreed scope, agreed resources and named decision rights. Something real is jointly decided — which options go forward, how success is described, what the plan says. Partnership without a decision right attached to it is consultation with a warmer name.</p>" },
              { label: "Co-design", body: "<p>People affected by a system help build it from the point where the problem is still being defined. They are in the room when the question is written, not only when the draft is reviewed. This is the most demanding of the five and the only one that can change what a program is for rather than how it is worded. It requires compensation, time, and a genuine willingness to end up somewhere staff did not plan.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "Four ways a well-meant session goes wrong",
            items: [
              { title: "The decision was already made", body: "<p>The most common one. Everything downstream is affected: the agenda is about explaining rather than exploring, staff answer questions defensively because the answers are fixed, and people leave having spent an evening on something that was closed before they heard about it. The fix is not a better facilitator. It is moving the engagement earlier, or narrowing the invitation to what is genuinely open and saying so.</p>" },
              { title: "The same six people", body: "<p>Standing advisory relationships are valuable and they are not a substitute for range. When the same organizations and the same individuals are asked every time, a unit hears a consistent and partial account, and mistakes consistency for representativeness. People who work shifts, who do not use the systems the invitation travels through, who communicate in a language the invitation was not sent in, or who have had a bad experience with the division are systematically absent, and their absence leaves no trace in the record.</p>" },
              { title: "Input becomes a category, not a claim", body: "<p>Someone describes a specific, fixable failure — a form that cannot be completed by phone, a window too short to arrange a ride. In the summary it becomes “participants expressed concerns about accessibility,” which cannot be acted on by anyone. Summarizing is necessary; flattening is a choice. Keep at least one specific, quotable account attached to each theme so the finding still points at something.</p>" },
              { title: "Nobody came back", body: "<p>The session happened, the notes were taken, and the people who came never heard another word. Sometimes the input did change the outcome and nobody told them. This is the cheapest failure to fix and the most expensive to leave alone, because it is the one that decides whether anyone answers the next invitation.</p>" },
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-07-1-check",
            question: "A program manager reports: “We held two listening sessions and received forty-one comments, so people with disabilities were involved in this decision.” What is the most accurate response?",
            options: [
              { text: "Correct. Two sessions and forty-one comments is solid evidence of involvement.", correct: false },
              { text: "The count describes how much input arrived. Whether people were involved depends on what was still changeable when they were asked, what changed afterward, and whether anyone was told what changed.", correct: true },
              { text: "It depends mainly on whether the sessions were well attended and whether the room was accessible.", correct: false },
              { text: "Listening sessions are never meaningful involvement; only formal advisory bodies count.", correct: false },
            ],
            feedbackCorrect: "Yes. Volume of input and degree of influence are different measurements, and only one of them tells you whether participation happened.",
            feedbackIncorrect: "Ask the two questions that the comment count cannot answer: what was open when we asked, and what changed because of the answer?",
          },
          {
            type: "flashcards",
            heading: "Keep these in reach",
            cards: [
              { front: "What is the honest test for participation?", back: "<p>Two questions. What was still changeable when we asked? What changed afterward because of what people said? A number of attendees answers neither.</p>" },
              { front: "When is informing the right choice?", back: "<p>When the decision genuinely is settled — a statutory change, a court-ordered requirement, a budget already enacted. Explaining it clearly is good work. Calling it input is not.</p>" },
              { front: "What separates partnership from consultation?", back: "<p>A decision right. In partnership, something specific is jointly decided, with agreed scope and resources. Without that, it is consultation with a warmer name.</p>" },
              { front: "Why does the same advisory group need company?", back: "<p>Because a standing relationship gives you consistency, not range. Consistency from a partial set of voices reads as agreement and is not.</p>" },
              { front: "What is the cheapest failure to fix?", back: "<p>Never coming back. Telling people what changed, what did not, and why, costs an hour and decides whether anyone answers your next invitation.</p>" },
            ],
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: in the last process I helped plan, how might my role and my authority have shaped what I assumed was already settled?",
          },
        ],
      },
      {
        id: "ipe-07-2",
        number: 2,
        title: "Accessible engagement is a design decision",
        summary: "The invitation, the hour, the format, the materials and the money decide who can take part. Most of those are decided by default, weeks before anyone notices.",
        minutes: 11,
        learning: {
          objective: "Plan an engagement so that the invitation, timing, format, access support, materials and compensation are decided while the design is still open, and identify which of those currently happens by default in your unit.",
          takeaways: [
            "Access is not the accommodation you arrange after someone asks. It is the set of choices already made when the invitation went out, and most of those choices were made by habit.",
            "The invitation is the first filter. Where it is posted, what language it is in, whether it can be read aloud, and whether it names a real person to ask decide who ever learns the thing exists.",
            "Time, transportation, care responsibilities and unpaid hours exclude more people than an inaccessible room does, and they leave no record behind.",
            "Paying people for expertise is not a courtesy. Community members, disabled Minnesotans, families and interpreters who shape public work are doing work, and unpaid expertise systematically selects for people who can afford to give it away.",
          ],
          evidence: "A scenario about planning an advisory session, sorting practice on invitations that open a door and invitations that quietly close one, and a knowledge check on what an offer of accommodation on request actually covers.",
          appliedNextStep: "Take the next session, comment period or advisory meeting your unit is planning and mark which of the eight design decisions has already been made by default rather than on purpose.",
        },
        scenario: {
          context: "Administrative and program staff are setting up a series of three advisory sessions on a service redesign. The current plan: Tuesdays from ten to noon at a state office building in St. Paul, announced on a division web page and in a partner newsletter, with the discussion materials handed out at the door. The invitation says accommodations are available on request with two weeks' notice, and there is no budget line for participants.",
            prompt: "Which change would most widen who can genuinely take part?",
          options: [
            {
              label: "Add a virtual option and keep everything else as planned. That removes the travel problem, which is the biggest barrier.",
              response: "A virtual option helps and it is not sufficient on its own. It does nothing about a weekday-daytime hour, materials that arrive at the door, an invitation that traveled through two channels, or the unpaid hours. It also introduces its own exclusions for people without reliable service or a private place to talk. Keep it, and treat it as one change among several.",
            },
            {
              label: "Keep the design and strengthen the accommodation line — larger print on the invitation, a clearer request process, and a shorter notice period.",
              response: "This improves the backstop without changing the design. Accommodation on request assumes a person already knows about the session, can reach the request process, is willing to identify a need to a state agency, and can wait for an answer. Each of those assumptions removes people, and the ones removed never appear in the attendance record.",
            },
            {
              label: "Change the design before the invitation goes out: vary the days and hours across the three sessions, offer both in-person and remote, send materials in plain language at least a week ahead, arrange interpretation and captioning as standard rather than on request, budget participant compensation and travel, and route the invitation through organizations that already hold trust — while keeping the accommodation offer for what you could not anticipate.",
              response: "This is the recommended path. Every item on it is a decision the planning team already controls and would otherwise make by default. Building access in first does not remove the need for the accommodation offer; it stops the offer from carrying the entire weight of inclusion. The compensation line matters as much as the interpretation line, because unpaid expertise quietly selects for people who can afford to give it away.",
              recommended: true,
            },
          ],
        },
        transfer: {
          prompt: "Look at the next thing your unit is convening. Which access decisions have already been made without anyone deciding them?",
          options: [
            "List the eight decisions — invitation, channel, timing, location, format, materials, access support, compensation — and mark which were chosen on purpose",
            "Identify the one default that most likely removes people, and find out who can change it",
            "Write a single sentence asking a partner organization what would have made this reachable for the people they work with",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The room is the smallest part of access",
            body: "<p>When staff hear accessible engagement, most picture the room: a ramp, a clear path, a microphone, an interpreter at the front. Those matter. They are also the last stage of a long sequence, and by the time a room is booked, the decisions that determined who could come have mostly been made.</p><p>Consider what has already happened. Someone chose a day and an hour, which decided whether people who work shifts, use scheduled transportation, or have care responsibilities could attend at all. Someone chose where to announce it, which decided who ever learned it existed. Someone chose whether materials go out in advance, which decided whether a person who reads slowly, uses a screen reader, works with an interpreter, or wants to talk it over with someone first arrives able to participate rather than able to listen. Someone decided whether participants would be paid, which decided whether attending was a contribution or a cost. None of those people thought of themselves as making an access decision.</p><p>This is why access belongs in the planning meeting and not in the logistics email. A ramp fixes one barrier for the people who already got through the other seven. Design the sequence, and the room becomes what it should be — the easy part.</p>",
          },
          {
            type: "list",
            heading: "Eight decisions that decide who can take part",
            items: [
              "The invitation itself: whether it can be read aloud and translated, whether it says plainly what the session is for and what is still open, and whether it names a real person a hesitant reader can contact.",
              "The channel: a division web page and a partner newsletter reach people who already follow the division. Trusted community organizations, disability-led groups, service coordinators and places people already go reach people who do not.",
              "The timing: weekday daytime is the single most exclusionary default in public engagement. Vary it across a series, and give enough lead time to arrange a ride, a shift swap, a support person or an interpreter.",
              "The location and the way in: transit, parking cost, entrance signage, an accessible route that does not run through a loading dock, a quiet space available, and a clear description of the building sent in advance so arriving is not itself a test.",
              "The format: a two-hour open-floor discussion rewards people who are quick, verbal, and comfortable disagreeing with staff. Small groups, written options, one-to-one conversations and asynchronous comment all reach different people; run more than one.",
              "The materials: plain language, real text rather than an image of text, sent far enough ahead to read, and short enough that reading them is realistic for someone doing this on top of a full life.",
              "Communication and access support as standard: interpretation, captioning, materials in alternative formats, support people welcomed by default, and the person's own expressed preference given primary consideration rather than what is easiest to arrange.",
              "The money: compensation for participants' time, plus travel, care costs and any support a person needs to attend. If there is no budget line, that is a decision about who can afford to advise the state, not a neutral absence.",
            ],
          },
          {
            type: "sorting",
            id: "ipe-07-2-sort",
            heading: "Opens the door, or quietly closes it?",
            categories: ["Opens the door", "Quietly closes it"],
            items: [
              { text: "Materials sent in plain language a week ahead, as real text that can be read aloud.", category: "Opens the door" },
              { text: "One session, Tuesday from ten to noon, at a downtown state office.", category: "Quietly closes it" },
              { text: "Interpretation and captioning arranged as standard, with the person's stated preference carrying the most weight.", category: "Opens the door" },
              { text: "Announced only on the division web page and in one partner newsletter.", category: "Quietly closes it" },
              { text: "Participant time paid, with travel and care costs covered and a named person handling it.", category: "Opens the door" },
              { text: "A ten-page technical draft handed out at the door as the basis of the discussion.", category: "Quietly closes it" },
              { text: "Two ways to contribute: a small-group conversation and a written option open for two weeks afterward.", category: "Opens the door" },
              { text: "Accommodations available on request with two weeks' notice, and nothing else arranged.", category: "Quietly closes it" },
              { text: "Invitation routed through organizations people already trust, with a real person named to ask questions.", category: "Opens the door" },
            ],
          },
          {
            type: "quote",
            text: "I was invited to advise on a service I have used for eleven years. I took unpaid leave, paid for parking, and read a draft I received at the door. Three staff were paid to be in that room. I was the only person there who had lived the thing we were discussing, and I was the only one paying to attend.",
            cite: "Composite advisory member perspective, illustrative",
          },
          {
            type: "leaderMove",
            heading: "Put access in the planning meeting, not the logistics email",
            control: "You control the day, the hour, the channel, the format, the materials, the lead time and — through your own budget or the person who holds it — whether participants are paid.",
            failure: "Do not let the accommodation line carry the whole weight of inclusion. It is a backstop for what you could not anticipate, and it only reaches people who already got the invitation, understood it, and were willing to identify a need to a state agency.",
            next: "At the first planning meeting for your next engagement, put the eight decisions on the agenda before the venue is discussed, and assign an owner to the compensation question specifically.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-07-2-check",
            question: "An invitation states: “Reasonable accommodations are available on request. Please contact us two weeks in advance.” What does this line actually cover?",
            options: [
              { text: "It covers accessibility fully. Anyone who needs something can ask for it, which is the fairest approach.", correct: false },
              { text: "It covers people who received the invitation, could read it, knew what to ask for, were willing to identify a need to a state agency, and could wait two weeks for an answer. Everyone removed before that point is not covered by it at all.", correct: true },
              { text: "It covers physical access to the building but not communication access.", correct: false },
              { text: "It is unnecessary once the session is held in an accessible building.", correct: false },
            ],
            feedbackCorrect: "Yes. The line is a useful backstop with a narrow reach. Everyone excluded by the channel, the hour, the format, the materials or the cost never gets as far as making a request.",
            feedbackIncorrect: "Trace the path a person has to walk before that sentence can help them, and count how many people fall out at each step.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: who could be burdened, excluded or simply never reached by the way my unit usually invites people — and what would it take to find out rather than assume?",
          },
        ],
      },
      {
        id: "ipe-07-3",
        number: 3,
        title: "Consultation, partnership, co-design",
        summary: "The three approaches differ in when people enter, what is still changeable, who decides, what is paid for, and what is owed afterward. Naming the right one is most of the work.",
        minutes: 11,
        learning: {
          objective: "Match an engagement approach to what is genuinely still changeable in a project, and state plainly which approach you are running and what it gives people power over.",
          takeaways: [
            "The three approaches are separated by five commitments: when people enter, what is still open, who holds the decision, what is resourced, and what is reported back.",
            "None of the three is better than the others in the abstract. Choosing co-design for a settled statutory change wastes people's time; choosing consultation for a redesign you claim is community-led is dishonest.",
            "The most common error is a naming error. Calling a consultation a partnership costs nothing on the day and costs the division trust it cannot buy back.",
            "Treating everyone the same — one open meeting, same hour, same format, same materials for all — feels fair and is a form of minimizing difference. Moving toward acceptance and adaptation means designing differently on purpose because people's situations are genuinely different.",
          ],
          evidence: "A scenario about a redesign with a contracting deadline, sorting practice that tells the three approaches apart by their commitments, and a knowledge check on naming an approach honestly.",
          appliedNextStep: "Write one sentence for a current project that names the approach, what is still changeable, who decides, and when people will hear what changed. Put it in the invitation.",
        },
        scenario: {
          context: "A Disability Services Division unit is reshaping how a set of supports is described and purchased. The statutory authority and the budget are fixed. The service definitions, the quality expectations written into the agreements, and how outcomes will be described are all open. A contracting timeline requires a draft in about four months. Senior leadership has asked the unit to make this “community-led.”",
          prompt: "What should the unit commit to, and how should it describe that commitment?",
          options: [
            {
              label: "Accept the description. Convene a series of listening sessions, gather input on the service definitions, and present the result as community-led.",
              response: "This is the naming error, and it is the most expensive of the three options. People will read community-led as shared authorship and will discover, at publication, that staff wrote the definitions and chose which input to use. The sessions may have been genuinely useful. The description will be what people remember, and it will make the next invitation harder to answer.",
            },
            {
              label: "Tell leadership that community-led is not achievable in four months with fixed authority and budget, and run a well-designed consultation instead — with paid participants, materials in advance, named open questions, and a written report back on what changed and what did not.",
              response: "This is honest and it settles for less than the situation allows. Quality expectations and outcome descriptions are exactly the kind of content that people who use a service can genuinely co-author, and four months is enough for a small standing group to do real work on them if they are paid and supported. Consultation here leaves value on the table.",
            },
            {
              label: "Split the project by what is actually open. Inform people plainly about the fixed authority and budget. Consult broadly on the service definitions, with paid participation, advance materials and a report back. And convene a small, compensated co-design group with a named decision right over the quality expectations and the outcome descriptions — then describe each part in those words, including to leadership.",
              response: "This is the recommended path. It gives each piece of the project the approach its actual openness supports, and it replaces one inaccurate label with three accurate ones. Naming the fixed parts plainly is not a retreat; it is what makes the co-design offer believable. The conversation with leadership is part of the work, and it is easier when you arrive with a specific alternative rather than an objection.",
              recommended: true,
            },
          ],
        },
        transfer: {
          prompt: "Take one project you are working on and separate it by what is genuinely still open.",
          options: [
            "List the parts that are fixed by authority, budget or a deadline nobody in the room controls",
            "List the parts that are genuinely open, and choose consultation, partnership or co-design for each",
            "Draft the sentence you would put in the invitation naming the approach, the open questions and who decides",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Three honest offers, five commitments",
            body: "<p>Consultation, partnership and co-design are not three degrees of enthusiasm. They are three different arrangements, and what separates them is a set of commitments you either make or do not: when people enter the work, what is still changeable when they arrive, who holds the decision at the end, what the division pays for, and what is owed back afterward.</p><p>Written out that way, the choice becomes answerable. A unit facing a court-ordered change with a fixed timeline is not able to co-design it, and should not say it is. A unit describing what good quality looks like in a service it does not use can co-design that, and probably should. The approach follows what is actually open, not what sounds most generous in a memo.</p><p>What causes most of the damage is not choosing the smaller offer. It is choosing the smaller offer and describing the larger one. People who spend an evening on a process called community-led, and later read a document they did not shape, learn something about the division that no future invitation can unteach. Choosing consultation and calling it consultation costs nothing at all.</p>",
          },
          {
            type: "accordion",
            heading: "What each approach actually commits you to",
            items: [
              { title: "Consultation", body: "<p><strong>When people enter:</strong> after a question is framed, before the answer is settled. <strong>What is open:</strong> the content of the decision, within a scope you name. <strong>Who decides:</strong> you do. <strong>What you pay for:</strong> participants' time, access support, travel and materials. <strong>What is owed back:</strong> a written account of what you heard, what changed, what did not, and why. Consultation is honest, common and frequently the right choice. It goes wrong in two ways: when the scope is not named so people work on the wrong things, and when nobody reports back, which converts it into data collection.</p>" },
              { title: "Partnership", body: "<p><strong>When people enter:</strong> at the planning stage, with a role agreed before the work starts. <strong>What is open:</strong> a defined piece of the project, genuinely. <strong>Who decides:</strong> jointly, over that defined piece, with the boundary written down. <strong>What you pay for:</strong> time, access support, and often organizational capacity — a partner organization carrying part of this needs staffing, not just gratitude. <strong>What is owed back:</strong> shared visibility of how the joint decision was carried out. The test of a partnership is simple: name the thing that is jointly decided. If you cannot, this is consultation.</p>" },
              { title: "Co-design", body: "<p><strong>When people enter:</strong> while the problem is still being defined, before staff have written the question. <strong>What is open:</strong> what the work is for, not only how it is worded. <strong>Who decides:</strong> the group, within resources and legal limits stated honestly at the start. <strong>What you pay for:</strong> sustained compensation, access support, preparation time, facilitation, and the staff hours to do this properly. <strong>What is owed back:</strong> authorship — people can see their work in the result and are credited for it. Co-design requires a real willingness to end up somewhere staff did not plan. Without that willingness it becomes an expensive consultation with a disappointed group.</p>" },
              { title: "Where this module stops: Tribal Nations", body: "<p>Engagement with Tribal Nations is not a form of community engagement, and nothing in this module applies to it. It is a government-to-government relationship carried out through required consultation and through the department offices that handle tribal matters, including the Office of Indian Affairs. This program defers to those offices rather than authoring guidance of its own. If your project touches Tribal Nations or their citizens, route it there before you plan any engagement.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-07-3-sort",
            heading: "Which offer is this?",
            categories: ["Consultation", "Partnership", "Co-design"],
            items: [
              { text: "Paid participants review a draft service definition and tell staff what will not work; staff decide and report back what changed.", category: "Consultation" },
              { text: "A compensated group helps write the question before any draft exists, and their version of the problem is what the project addresses.", category: "Co-design" },
              { text: "A disability-led organization and the division jointly decide which three options move forward, with the boundary written into an agreement.", category: "Partnership" },
              { text: "A public comment period on a proposed change, followed by a published summary of what was received and what was revised.", category: "Consultation" },
              { text: "People who use a service hold the decision over how quality is described, within stated legal and budget limits.", category: "Co-design" },
              { text: "A community organization is resourced to carry part of the outreach and shares responsibility for how it is done.", category: "Partnership" },
              { text: "Staff bring two workable options and a set of named open questions to a paid advisory session, then choose.", category: "Consultation" },
              { text: "A family-led group and the division share authorship of the plan and are credited in the published document.", category: "Partnership" },
              { text: "Before staff frame anything, a compensated group spends four sessions defining what the actual problem is.", category: "Co-design" },
            ],
          },
          {
            type: "text",
            heading: "Why treating everyone the same is not the same as fairness",
            body: "<p>This program uses a well-established description of how people and organizations relate to cultural difference, running from denial and polarization through minimization, and on to acceptance, adaptation and integration. It is a way of describing patterns in how a system behaves. It is never a label, a score or a record about any individual staff member, and it is not used that way here.</p><p>Minimization is the stage that matters most in engagement work, because it is the one that feels like fairness. It sounds like this: one meeting, open to everyone, same hour, same format, same materials, no special treatment. The intent is even-handedness. The result is that the format rewards people who are verbal, quick, available on a weekday, fluent in the division's vocabulary and able to absorb an unpaid evening. Everyone was treated identically, and the outcome was not remotely equal.</p><p>Acceptance begins when a unit stops treating those differences as irregularities to be accommodated and starts treating them as real facts about the people the work is for. Adaptation is the next move, and it is a practical one: the design changes. Sessions vary in day, hour and format. Materials go out early. Interpretation is standard. Participation is paid. Nothing about this lowers a standard. It changes who can meet it.</p>",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-07-3-check",
            question: "Leadership asks a unit to describe an upcoming process as community-led. The authority, budget and deadline are fixed; the service definitions and quality expectations are open. What is the most useful response?",
            options: [
              { text: "Use the description. Leadership set the direction, and the sessions will be substantial.", correct: false },
              { text: "Refuse the description and hold no engagement, since the main parameters are already decided.", correct: false },
              { text: "Separate the project by what is actually open: inform plainly about the fixed parts, consult on the definitions, and give a compensated group a real decision right over the quality expectations — then describe each part accurately, including to leadership.", correct: true },
              { text: "Use the description now and quietly narrow the scope later if people push back.", correct: false },
            ],
            feedbackCorrect: "Yes. One inaccurate label is replaced by three accurate ones, and the honest naming of the fixed parts is what makes the genuine offer believable.",
            feedbackIncorrect: "Almost no project is uniformly open or uniformly closed. Split it by what is changeable, and name each part for what it is.",
          },
          {
            type: "flashcards",
            heading: "Keep these in reach",
            cards: [
              { front: "What five commitments separate the three approaches?", back: "<p>When people enter, what is still open, who holds the decision, what is resourced, and what is reported back. Answer those five and the right name is obvious.</p>" },
              { front: "What is the one-line test for partnership?", back: "<p>Name the thing that is jointly decided, and show where the boundary is written down. If you cannot, this is consultation.</p>" },
              { front: "When is consultation the right choice?", back: "<p>When the question is framed, the answer is genuinely open within a scope you can name, and you will come back with what changed. That is a good, honest offer.</p>" },
              { front: "What makes co-design real rather than expensive?", back: "<p>A willingness to end up somewhere staff did not plan, plus sustained compensation, preparation time and stated legal and budget limits from the start.</p>" },
              { front: "Why is “one meeting for everyone” not fairness?", back: "<p>Identical treatment rewards people who are verbal, quick, free on a weekday and fluent in the division's vocabulary. Same treatment, unequal result. Designing differently on purpose is the fix.</p>" },
            ],
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: on the project in front of me, whose expertise is missing — and am I describing what we are offering people accurately, or more generously than it is?",
          },
        ],
      },
      {
        id: "ipe-07-4",
        number: 4,
        title: "Who is present, who is missing",
        summary: "The practical tool: a one-page review of a decision you are working on now, what to do with what it shows you, and what is owed when a process left someone out.",
        minutes: 12,
        learning: {
          objective: "Complete a presence-and-absence review for a decision you are working on now, and take one action inside your own authority that changes who shapes it.",
          takeaways: [
            "Start from the decision, not from the invitation list. Ask who is affected by this, then ask who is in the room, and the gap becomes visible immediately.",
            "Staff assumption is the substitute that fills every empty seat. When nobody with a given experience is present, the work does not pause; someone guesses, and the guess enters the record as a finding.",
            "Reporting back is not a courtesy at the end. It is the part that makes the next invitation answerable, and it takes about an hour.",
            "When a process has excluded people, repair is more than fixing the process going forward. It means saying plainly what happened, to the people it happened to, and reopening what can still be reopened.",
          ],
          evidence: "A scenario about a review that surfaces an absence late in a project, a completed presence-and-absence review you can copy, and a knowledge check on what to do with what the review shows.",
          appliedNextStep: "Run the review on one decision that is still changeable, make the one change inside your own authority this week, and send the rest of the review to the people who own the parts you do not.",
        },
        scenario: {
          context: "A quality and performance unit has nearly finished a review of how a service is working. The advisory group that shaped the questions has been engaged throughout: three provider representatives, two family members, an advocacy organization and two county staff. Two weeks before the findings are due, a staff member notices that nobody who personally uses the service has been part of the group, and that one of the draft findings — that people “decline the service after initial contact” — has been explained entirely by a staff assumption about why.",
          prompt: "What should the unit do with two weeks left?",
          options: [
            {
              label: "Note the gap in the methods section as a limitation, publish on time, and plan to include people who use the service in the next review cycle.",
              response: "Naming a limitation is honest and it leaves the problem in place. The finding about people declining will be read as established, will shape decisions for the next cycle, and rests on a staff assumption that nobody with the actual experience has tested. A limitation note does not stop a guess from becoming a fact in the record.",
            },
            {
              label: "Remove the finding about people declining the service, since it cannot be supported without their perspective, and publish the rest on time.",
              response: "This avoids one unsupported claim and loses something real. People are in fact declining the service, which matters; the problem is the explanation, not the observation. Deleting it means the next cycle starts without the question and the pattern stays unexamined.",
            },
            {
              label: "Keep the observation and strip out the explanation, marking it plainly as not yet understood. Use the two weeks to talk with a small number of people who use the service and are paid for their time, with access support arranged. Publish with what they said, and commit in writing to bringing them into the next review from the question-setting stage.",
              response: "This is the recommended path. It keeps the honest observation, removes the staff guess dressed as a finding, and gets a first account from the people who actually know. Two weeks is not enough for real participation and it is enough to avoid publishing an assumption as a conclusion. The written commitment to the next cycle is what turns a late correction into an actual change in how the unit works.",
              recommended: true,
            },
          ],
        },
        transfer: {
          prompt: "Take one decision you are working on now and run the review on it before it is settled.",
          options: [
            "Write the decision in one sentence, then list who is affected by it and who is currently in the room",
            "Find the place where staff assumption is currently standing in for someone's actual experience, and mark it",
            "Name the one change inside your own authority and the one you need to route to somebody else",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Start with the decision, not the invitation list",
            body: "<p>Most attempts to check participation start from the wrong end. Staff look at who was invited, notice the list is reasonable, and conclude the process was sound. The list usually is reasonable. The people on it are engaged, informed and willing, which is precisely why their presence is not evidence about who is absent.</p><p>Turning the review around fixes this. Write the decision down in one sentence. Then ask who is actually affected by it — not who is a stakeholder in the abstract, but who will experience a different life because of how this goes. Then look at who is in the room. The gap between those two lists is the finding, and it takes about ten minutes to produce.</p><p>The gap matters because empty seats do not stay empty. When nobody present has a given experience, the work does not pause to wait for them; a staff member fills the space with a reasonable assumption, and that assumption travels into a finding, a definition or a requirement with no marker on it saying it was a guess. The review's real job is to find those places while they are still labeled as questions.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A presence and absence review",
            summary: "One page you run on a decision that is still changeable. Copy the six rows into your own document and fill them from a project you are working on now. The example below is filled in for a quality review, but the rows work for a policy change, a contract requirement, a communication or a redesign.",
            fields: [
              { label: "The decision, in one sentence", value: "We are deciding how quality will be described and measured for a service, and what the agreements will require providers to report. The description we write will shape what counts as good for the next several years." },
              { label: "Who is affected by it", value: "People who use the service and people who tried to and stopped. Family members and support people. Direct support workers. Providers of different sizes, including small and culturally specific organizations. Lead agency staff. People who were found ineligible. People who use interpreters or communicate in ways the current process does not accommodate well." },
              { label: "Who is actually in the room", value: "Three provider representatives, two family members, one advocacy organization, two county staff, five division staff. Nobody who personally uses the service. No direct support workers. No small or culturally specific provider. Nobody who stopped using the service." },
              { label: "Where staff assumption is standing in for someone", value: "The draft finding that people decline the service after initial contact is explained entirely by a staff assumption about motivation. The definition of a successful outcome was written by staff from the agreements rather than from anyone's account of a good result. Both are currently unmarked in the draft and will be read as established." },
              { label: "What it would take to change that, and what it costs", value: "Paid time for participants, access support including interpretation, materials in plain language a week ahead, sessions at more than one hour of the day, and a route to people who stopped using the service — most likely through organizations they already trust. Roughly three sessions and a named staff owner. The compensation is a budget question with an identified holder, not a blocker." },
              { label: "One change I will make, and what I will route", value: "Inside my authority this week: mark the two staff assumptions plainly as unexamined, and hold three paid conversations before the findings are final. Routed: the standing composition of the advisory group and the participant compensation line, sent to the manager who owns both, with this page attached and a date I will follow up." },
            ],
            action: "Copy the six rows, fill them for one decision that is still changeable, make the change inside your own authority now, send the rest to the people who own it, and put a follow-up date on your own calendar.",
          },
          {
            type: "list",
            heading: "Report back, or do not ask again",
            items: [
              "Come back to the people who took part, not only to the organizations that convened them, and do it whether or not the news is good.",
              "Say what changed because of what they said. Be specific enough that a person can recognize their own contribution in it.",
              "Say what did not change, and why. A clear constraint honestly explained is respected; silence is read as dismissal, and usually correctly.",
              "Say what is still undecided and when they will hear more, then actually send that second message. The follow-up nobody expects is the one that builds something.",
              "Use the format that works for the person, not the one that is easiest to produce. A plain email, a short call, or a page in the language they read all beat a published report nobody told them about.",
              "Credit the work. If people shaped something, name their contribution in the document rather than thanking a general public for its input.",
            ],
          },
          {
            type: "leaderMove",
            heading: "When a process left someone out",
            control: "You control whether an exclusion is named plainly, whether the people affected hear it from you, and whether anything still open is reopened.",
            failure: "Do not treat a quiet fix as repair. Correcting the process for next time, without telling the people the last round excluded, protects the unit's comfort and leaves those people with the same experience they already had.",
            next: "Say what happened and to whom, in plain words and without a defensive frame. Reopen what can still be reopened. Name what cannot, and why. Then change the design, and tell them what you changed.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-07-4-check",
            question: "A presence-and-absence review shows that nobody who uses the service is part of a group shaping a definition, and that one draft finding rests entirely on a staff assumption. The work is due in two weeks. What is the most useful response?",
            options: [
              { text: "Record the absence as a limitation in the methods section and publish as planned.", correct: false },
              { text: "Delay the whole product until a full participatory process can be run.", correct: false },
              { text: "Mark the assumption plainly as unexamined, use the remaining time for a small number of paid conversations with access support, publish with what those people said, and commit in writing to involving them from the question-setting stage next time.", correct: true },
              { text: "Ask the family members already in the group to speak for people who use the service.", correct: false },
            ],
            feedbackCorrect: "Yes. Two weeks cannot produce real participation, and it is enough to stop an assumption being published as a conclusion and to start the relationship that fixes the next cycle.",
            feedbackIncorrect: "Look for the option that does three things at once: stops the guess entering the record, gets a first real account, and changes what happens next time. Family members have their own distinct expertise and cannot be asked to substitute for someone else's.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: if this process has been excluding someone for a while, what would accountability and repair actually require of me — and how could the people most affected have shaped this work earlier?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Participation and voice",
    subtitle: "One page for anyone convening, approving or reporting on a process where people outside the division are asked for their views",
    quote: "The question is not whether people were asked. It is what was still changeable when we asked, and what changed afterward.",
    use: {
      purpose: "Keep the honest test, the access decisions and the presence-and-absence review in view while you plan an engagement or finish a decision.",
      remember: [
        "Two questions decide whether participation happened: what was still changeable when we asked, and what changed because of what we heard.",
        "There are five different offers — inform, consult, involve, partner, co-design. Pick the one the situation actually supports, and call it by its own name.",
        "The test for partnership is a decision right you can point at. Without one, it is consultation with a warmer name.",
        "Access is decided in the planning meeting: invitation, channel, timing, location, format, materials, communication support, money. The accommodation line is a backstop, not a plan.",
        "Pay people for expertise. Unpaid participation quietly selects for those who can afford to give their time away.",
        "One meeting for everyone, same hour and format, is not fairness. Designing differently on purpose is what makes the standard reachable.",
        "Report back every time, including what did not change and why. It costs about an hour and decides whether anyone answers the next invitation.",
      ],
      doNext: "Run the presence-and-absence review on one decision that is still changeable, make the one change inside your own authority, and route the rest with a follow-up date.",
    },
    sections: [
      {
        heading: "The presence and absence review, in short",
        items: [
          "The decision, in one sentence — what is actually being settled, and for how long.",
          "Who is affected by it — who will experience a different life because of how this goes, including people who tried the service and stopped.",
          "Who is actually in the room — names and roles, and the gap between this list and the one above.",
          "Where staff assumption is standing in for someone — the place a reasonable guess is about to be published as a finding.",
          "What it would take to change that, and what it costs — paid time, access support, materials in advance, varied hours, a trusted route in.",
          "One change I will make, and what I will route — with an owner and a follow-up date on your own calendar.",
        ],
      },
      {
        heading: "Before the invitation goes out",
        items: [
          "Name in the invitation what has been decided and what is still open. People will spend their time on the things they can move.",
          "Send materials in plain language, as real text, at least a week ahead — and keep them short enough to be read by someone doing this on top of a full life.",
          "Arrange interpretation, captioning and alternative formats as standard, giving the person's stated preference the most weight.",
          "Vary the day, the hour and the format across a series, and offer more than one way to contribute.",
          "Budget participant compensation, travel and care costs, and name who owns that line.",
          "Route the invitation through organizations people already trust, and name a real person to contact.",
          "Engagement with Tribal Nations is a distinct government-to-government relationship: route it to the responsible DHS offices, including the Office of Indian Affairs, rather than treating it as community engagement.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Communications and training staff, who write the invitation, the agenda and the account of what was heard — a useful place to start.",
          "Supervisors and managers, who decide how much time a team can give an engagement and whether participants are paid — a useful place to start.",
          "Executive and senior leaders, who name what a process will be called and who holds the decision at the end — a useful place to start.",
          "Administrative and support staff, who build the room, the schedule, the access support and the follow-up that make participation possible — a useful place to start.",
          "Policy, program, quality, fiscal, contracting and data staff, whose definitions and requirements carry whatever was or was not heard into the record.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Intercultural practice in public disability services",
          "Public power and institutional impact",
          "Person-centered thinking in state systems",
          "Accessible and respectful communication",
          "Choosing a learning focus",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Content and writing guidelines", href: "https://mn.gov/dhs/digital-showcase/content-guidelines/", note: "The department's own editorial guidance on first-read understanding, descriptive headings and writing suited to the reader — the basis for the invitation and report-back standards in this module." },
    { title: "Minnesota Department of Human Services, Disability services", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "The department's public entry point for disability services, used here for the general structures the examples refer to — service authorization, waivers, lead agencies and provider agreements." },
    { title: "Minnesota Governor's Council on Developmental Disabilities", href: "https://mn.gov/mnddc/", note: "A long-running Minnesota body whose members include people with developmental disabilities and family members, and whose public work illustrates community-directed advisory practice in this state." },
    { title: "Minnesota Department of Administration, Boards and councils", href: "https://mn.gov/admin/about/boards-councils/", note: "Minnesota's open appointments process for state boards, councils and task forces, including how vacancies are published and how member service and expenses are handled." },
    { title: "W3C Web Accessibility Initiative, Involving users in web projects", href: "https://www.w3.org/WAI/planning/involving-users/", note: "Practical guidance on involving people with disabilities early and throughout a project rather than only at review, including recruitment, compensation and avoiding tokenism." },
    { title: "ADA.gov, Effective communication", href: "https://www.ada.gov/resources/effective-communication/", note: "U.S. Department of Justice guidance on Title II effective communication, auxiliary aids and services, and primary consideration of the person's expressed preference." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the standards on partnering with the community and on collaborative planning, governance and evaluation." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
