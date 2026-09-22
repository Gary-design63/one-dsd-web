import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Foundations · Module 8: Choosing a Learning Focus.
// Internal DHS/DSD public-administration learning. Voluntary, self-directed, no scores, no self-rating,
// no records of reflection. The practical tool is a private learning intention the staff member keeps.
const pack: CoursePack = {
  course: {
    id: "ipe-08-choosing-a-learning-focus",
    indexNumber: 1150,
    seriesLabel: "Intercultural Practice and Equity · Foundations",
    title: "Choosing a Learning Focus",
    subtitle: "How to pick something worth learning from the work already in front of you, without rating yourself or anyone else.",
    scope: "For every internal DHS and DSD staff member: leaders and managers; policy, program and operations staff; quality and performance staff; training, communications and learning-design staff; fiscal, contracts, grants and procurement staff; data, research and analytics staff; community engagement staff; and administrative and support staff. Four short lessons that help you choose where to start in this curriculum. Participation is voluntary and self-directed. There are no scores, badges, rankings, quizzes about you or completion requirements; reflections are private and are not recorded; and nothing here is a required compliance program, a credential, or a substitute for a formal decision by the responsible office.",
    treatment: "Four short lessons with Minnesota public-administration scenarios, sorting and tab exercises, knowledge checks, a private learning intention you write and keep, and optional private reflection",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-11.jpg",
    coverAlt: "A man reviews a document on his laptop at an office desk.",
    introTranscript: "Most learning programs start by asking you to rate yourself. This one does not, and this module explains why. A rating gives you a number on somebody else's scale. A focus gives you a piece of work to look at, a question with an answer in it, and a first step inside your own authority. You will practice finding a focus through four doorways into work you already do, narrowing it until it fits an actual month, and writing a private learning intention in five lines. Nothing you write is collected, counted, compared or reported. You can start anywhere in this curriculum, take modules out of order, change your mind, and come back.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Explain why a self-rating is a weak basis for choosing intercultural learning, and name what a learning focus has that a rating does not.",
        "Find candidate learning focuses through four doorways into your current work: a decision you shape, a moment that did not land, a question you keep deferring, and a group your process rarely hears from.",
        "Narrow a broad interest until it names one document, decision, process or meeting you can reach within your own authority.",
        "Separate a workable focus from a self-diagnosis, a verdict about a colleague, and a system no one person can move alone.",
        "Write a private learning intention in five lines: the work, the question, the first step, the expertise you are missing and how it will be paid for, and the date you will look at it again.",
      ],
      evidence: [
        "A sorting exercise that separates focuses you can act on, formal decisions that belong to the responsible office, and ratings or judgments about people.",
        "A knowledge check in every lesson with feedback that explains the reasoning, not just the answer.",
        "A private learning intention written for one real piece of your own work, kept by you and collected by no one.",
      ],
      appliedNextStep: "Walk the four doorways once, narrow the strongest candidate until it names one document, decision or meeting, and write your intention in five lines with a date to look at it again.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in DHS or DSD direction on staff learning, required training, or what may be recorded about an employee's development",
        "A change in state or federal civil-rights, accessibility or language-access guidance that changes what is required rather than optional",
        "Feedback from staff or from compensated community advisors that the choosing method reads as an assessment, a ranking, or a judgment about individuals",
      ],
      relatedDoor: "Formal decisions — required training assignments, position descriptions, development plans that go into a personnel file, accommodation requests, and civil-rights or complaint determinations — belong to the responsible DHS office, such as human resources, your division's learning and development staff, the accessibility coordinator or the equal opportunity office; this module helps you choose what to learn and makes none of those decisions.",
      toolkitQuestion: "What in my own work keeps affecting people I rarely hear from, and what would I need to understand before I decide about it again?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-08-1",
        number: 1,
        title: "A focus, not a score",
        summary: "Why choosing what to learn from a self-rating produces a number instead of a next step, and what this curriculum asks you to use instead.",
        minutes: 10,
        learning: {
          objective: "Explain why a self-rating is a weak basis for choosing intercultural learning, and name the three things a learning focus contains that a rating does not.",
          takeaways: [
            "A rating tells you where you placed yourself on somebody else's scale. A focus tells you what you will look at, in which piece of work, and when you will look at it.",
            "Confidence and understanding move separately in this work. People often feel most settled about the differences they notice least, which is exactly why a self-rating tends to point away from the useful question.",
            "This program uses the intercultural development continuum — denial, polarization, minimization, acceptance, adaptation and integration — to design content and to describe how an organization moves. It is never a label, a score, a gate or a record about you or anyone you supervise.",
            "Nothing you choose here is collected, counted or compared. You can start anywhere, take modules out of order, stop, change your mind, and come back later.",
          ],
          evidence: "A scenario about a division that wants to assign modules by survey score, and a knowledge check on what makes a starting point usable.",
          appliedNextStep: "Before you look at any module list, write down in one plain sentence the last thing at work you wished you understood better.",
        },
        scenario: {
          context: "A division leadership team wants staff to start this curriculum “in the right place.” A manager proposes a short survey asking each person to rate their own cultural competence from one to five, with results kept in a spreadsheet so supervisors can assign the matching modules and watch who moves up.",
          prompt: "What is the most useful response to the proposal?",
          options: [
            {
              label: "Support it. A starting number gives people direction, and it gives the division a way to see whether the learning is working.",
              response: "The wish behind it is reasonable: people do want direction. The design creates two problems. It turns a person's self-description into a record that a supervisor reads and revisits, and the direction it produces is generic — a three out of five points at no notice, no contract, no meeting and no decision.",
            },
            {
              label: "Suggest dropping the rating and asking two different questions instead: what decisions does each unit actually make that reach people outside this building, and where does that work keep running into something staff do not yet understand? Point to modules from those answers, and keep each person's own choice private.",
              response: "This keeps the useful part — direction — and removes the part that turns learning into a personnel record. It also produces what a rating never does: a specific piece of work to look at, which is where a real question lives.",
              recommended: true,
            },
            {
              label: "Keep the survey but make it anonymous, so no one's number is attached to them.",
              response: "Anonymity solves the record problem and leaves the rest standing. An average still does not tell anyone which notice, contract, form or meeting to examine, and it still asks people to grade themselves in an area where confidence is an unreliable guide.",
            },
          ],
        },
        transfer: {
          prompt: "If no one handed you a score, where would you start?",
          options: [
            "Name one decision you make or shape that reaches people you rarely meet.",
            "Name one moment in the last month when something you sent, said or approved did not land the way you meant it.",
            "Name one question about this work you keep putting off because there is never a good hour for it.",
            "Name one group your process produces results for and almost never hears from directly.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What a rating gives you, and what it leaves out",
            body: "<p>Almost every workplace learning menu opens the same way: rate your current level, and we will tell you where to begin. It feels orderly. It is also the weakest available method for this particular subject, for three reasons that have nothing to do with anyone's sincerity.</p><p>First, a rating is a description of yourself, and this curriculum is about public administration — about notices, criteria, timelines, contracts, measures, meetings and the people on the other end of them. A number about you does not point at any of that. Second, confidence and understanding do not rise together here. The parts of a culture you were raised inside are the parts you are least likely to notice as choices, which means the areas where a person feels most settled are often the areas with the most left to see. That is not a character flaw; it is how being at home in something works. Third, a number invites comparison. The moment a self-description is written down and read by someone who writes your review, it stops being a private thought and becomes a thing to manage.</p><p>A focus does the job a rating was supposed to do, and does it better. A usable focus contains three things: a piece of work you can actually reach, a question that has an answer somewhere, and a first step you can take without anyone's permission. Everything else in this module is a way of finding those three things in work you are already doing.</p>",
          },
          {
            type: "accordion",
            heading: "What this module is not",
            items: [
              {
                title: "Not an assessment",
                body: "<p>There is no instrument here, no placement, no level and no result. You are not being measured, and neither is your unit. If you finish this module and decide none of the curriculum is for you right now, that is a legitimate outcome and no one is told.</p>",
              },
              {
                title: "Not a record",
                body: "<p>The reflections and the intention you write in this module stay with you. They are not collected, stored against your name, reported to a supervisor, counted toward anything, or used in a performance conversation. If you want to share what you wrote, that is entirely your choice and your timing.</p>",
              },
              {
                title: "Not a required program, and not a credential",
                body: "<p>Participation is voluntary. Finishing a module produces no badge, certificate, score or standing, and it does not count toward DHS-required training credits. Where a legal or policy obligation exists — accessibility standards, language access, civil-rights requirements — that obligation is named plainly and stands on its own, separate from anything optional you choose to learn.</p>",
              },
              {
                title: "Not a place where the continuum becomes a label",
                body: "<p>This program is explicit that the intercultural development continuum — denial, polarization, minimization, acceptance, adaptation, integration — describes how content and organizations move, and shapes how these modules are built. A licensed assessment of an individual is a separate professional matter, administered by qualified administrators outside this program. Nothing here places you, your colleague or your unit anywhere on that continuum, and no such placement may become a record, a gate or a comparison.</p>",
              },
            ],
          },
          {
            type: "leaderMove",
            heading: "Point at the work, not at the person",
            control: "If you lead a unit, you control whether people are pointed toward a number about themselves or toward a piece of work your unit actually produces.",
            failure: "Do not ask staff to rate their own cultural competence, and do not collect or compare what individuals choose to learn. A private choice that is read by a supervisor becomes a performance signal within a week, whatever anyone intended.",
            next: "At your next unit meeting, name two or three decisions your unit makes that reach people outside this building, and ask what about those decisions is least understood. Let people take it from there on their own.",
          },
          {
            type: "flashcards",
            heading: "Rating, or focus?",
            cards: [
              { front: "What a rating gives you", back: "<p>A position on somebody else's scale, a comparison you did not ask for, and a sentence about yourself. No document, no decision, no next step.</p>" },
              { front: "What a focus gives you", back: "<p>A piece of work you can reach, a question that has an answer somewhere, and a first step inside your own authority.</p>" },
              { front: "Why confidence misleads here", back: "<p>The parts of a culture you were raised inside feel like plain common sense rather than choices. Feeling settled about a difference is often a sign you have not yet had to see it, not a sign you have already understood it.</p>" },
              { front: "What happens to a collected self-rating", back: "<p>It becomes a record. Records get compared, remembered and repeated in review conversations, so people write them to look right rather than to be accurate. The learning value drains out immediately.</p>" },
              { front: "Where the continuum belongs", back: "<p>In the design of the content and in how the program describes organizational movement — not on a person. It is not a score, a stage you are assigned, or anything that may be written down about a colleague.</p>" },
            ],
          },
          {
            type: "quote",
            text: "The first time someone asked me to rate my cultural competence, I gave myself a four because a two felt like an admission. The number told me nothing. What finally taught me something was the renewal letter I had written, and the twelve people who never answered it.",
            cite: "Composite DHS staff perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-08-1-check",
            question: "A colleague asks how she should decide where to begin in this curriculum. Which answer fits how this program is designed?",
            options: [
              { text: "Take a short self-assessment first, so the modules are matched to her current level and she does not waste time on material she has already mastered.", correct: false },
              { text: "Start from a piece of her own work — a decision she shapes, something that did not land, a question she keeps deferring, or a group she rarely hears from — because that is what produces a question with an answer and a first step.", correct: true },
              { text: "Start at module one and work through in order, since the sequence was built to move people along the continuum in the right progression.", correct: false },
              { text: "Ask her supervisor which area needs the most improvement, so her learning lines up with her next performance conversation.", correct: false },
            ],
            feedbackCorrect: "Yes. A starting point built from real work gives her the three things a rating cannot: a document or decision to look at, a question, and a step she can take herself.",
            feedbackIncorrect: "Check each option for three things: does it name a piece of work, does it contain a question with an answer, and does it leave the choice with her? Only one option has all three. Order is optional here, and nothing she chooses is meant to reach a performance conversation.",
          },
          {
            type: "statement",
            body: "Private reflection, not recorded and not shared: think of the last time something you sent, approved or decided reached someone it did not work for. What did you assume about that person first, before you looked at the process?",
          },
        ],
      },
      {
        id: "ipe-08-2",
        number: 2,
        title: "Four doorways into your own work",
        summary: "Decisions you shape, moments that did not land, questions you keep deferring, and people your process rarely hears from. Any one of them beats a quiz.",
        minutes: 11,
        learning: {
          objective: "Identify at least two candidate learning focuses drawn from your current work using the four doorways, without describing yourself or judging a colleague.",
          takeaways: [
            "Doorway one, the decision: something you make, draft, approve, score, fund, schedule or route that reaches people outside this building.",
            "Doorway two, the friction: a moment when what you sent, said or approved did not land, and the first explanation you reached for was about the other person.",
            "Doorway three, the deferred question: the thing you have wondered about for months and have never had a clean hour to answer.",
            "Doorway four, the absent voice: the group your process produces results for and almost never hears from directly.",
            "A doorway is not a diagnosis. It points at a piece of work, names no one, and can be walked away from without explaining yourself.",
          ],
          evidence: "A sorting exercise separating focuses you can act on, formal decisions that belong to the responsible office, and ratings or judgments about people, plus a scenario set in grants and contracting.",
          appliedNextStep: "Walk all four doorways once and write down every candidate that comes up. Do not choose yet, and do not narrow yet.",
        },
        scenario: {
          context: "A grants coordinator in the division notices a pattern across several cycles: the same three culturally specific organizations apply every time, while several others open an application and never finish it. She wants to learn something useful from that, but is not sure the topic is hers, since procurement policy and thresholds are set outside her unit.",
          prompt: "Which starting point is most likely to lead somewhere she can actually act?",
          options: [
            {
              label: "Study state contracting law and procurement policy thoroughly first, so she understands the whole system before forming an opinion about any part of it.",
              response: "It is honest and it is far too big to start. Months of reading would still not tell her why an organization opens an application and stops at the fourth question. If the obstacle turns out to sit in policy, she will have a much better reason to read it later — and a specific question to read it with.",
            },
            {
              label: "Start at the doorway nearest her hands: the application materials, questions, deadlines and notices her unit sends, and what actually happens to an organization that begins one and stops. Learn what she needs in order to understand that.",
              response: "This is a focus. It names a piece of work she touches, a group affected, a question with a findable answer, and a first step no one has to approve. It may still lead to procurement policy, but it starts where she can change something and where she can pay someone who knows to tell her what the process is like from the other side.",
              recommended: true,
            },
            {
              label: "Treat the unfinished applications as a sign that those organizations are not ready to hold a state contract, and focus her learning on how to help them become ready.",
              response: "That conclusion arrived before the question did. It explains the pattern by what the organizations lack and leaves the materials, deadlines, formats and requirements her unit controls unexamined. Readiness support may well matter — but only after someone has looked at what stops people at step four, and asked the people who stopped.",
            },
          ],
        },
        transfer: {
          prompt: "Walk your own four doorways. Which one produced the most candidates, and what does that tell you?",
          options: [
            "List every decision you make or shape that reaches someone outside this building, however small.",
            "Write down one moment in the last month when your work did not land, without naming anyone.",
            "Write the question you keep deferring, in the words you would use to a colleague over coffee.",
            "Name one group your work produces results for that you have never heard from directly.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The doorways are already in your week",
            body: "<p>You do not need a new activity to find a learning focus. The material is in the work you did last week: the letter you drafted, the criteria you set, the survey your team sent, the meeting you ran, the exception you granted, the number you reported. Four doorways lead into that material, and most people find something behind each one.</p><p>The <strong>decision</strong> doorway asks what you make, draft, approve, score, fund, schedule or route that reaches people outside this building. Almost every internal role has one, including roles that feel entirely administrative — a calendar, a form field and a mailing list all decide something. The <strong>friction</strong> doorway asks where your work did not land, and it comes with a test attached: when you explained that moment to yourself, was the explanation about the other person? That is not a sign of bad character. It is the ordinary shape of a first explanation, and it is a reliable marker that there is something underneath worth looking at.</p><p>The <strong>deferred question</strong> doorway asks what you have wondered about for months without ever having a clean hour for it. Deferral is information: the question survived that long because it matters to you. The <strong>absent voice</strong> doorway asks who your process produces results for and almost never hears from. If you cannot name a single conversation with someone on the receiving end of a process you run, that gap is itself a focus — and the people who could close it are advisors with professional expertise, to be invited and paid, not volunteers to be thanked.</p>",
          },
          {
            type: "tabs",
            heading: "The four doorways, in one division's week",
            tabs: [
              {
                label: "The decision",
                body: "<p>A program staff member sets the response window on a notice that goes to several thousand households. Ten working days has been the standard for as long as anyone remembers, and no one currently in the unit knows where the number came from. <strong>Candidate focus:</strong> what a ten-day window assumes about mail, housing stability, reading, translation time and the energy of someone who is unwell — and what the policy actually requires, as distinct from what habit added.</p>",
              },
              {
                label: "The friction",
                body: "<p>A quality staff member runs a feedback session for community partners. Two organizations that confirmed did not attend, and a third sent someone who said almost nothing. The first explanation that came to mind was that partners are stretched thin and hard to engage. <strong>Candidate focus:</strong> what the invitation, the hour, the format, the location, the interpretation arrangements and the absence of payment communicated before anyone decided whether to come.</p>",
              },
              {
                label: "The deferred question",
                body: "<p>A data analyst has wondered for two years what happens to the people who appear once in a dataset and never again. They are counted as closed, and the closure reason is a single code with no room for detail. <strong>Candidate focus:</strong> what that code hides, who is disproportionately inside it, and what it would take to find out — starting with a conversation with the staff who enter it.</p>",
              },
              {
                label: "The absent voice",
                body: "<p>A policy staff member realizes that in four years of drafting guidance about a service, he has never spoken with someone who uses it. Every account has come through providers, county partners and internal reports. <strong>Candidate focus:</strong> what the guidance assumes about daily life, and how to arrange paid advisory conversations with people who use the service before the next revision, rather than circulating a draft for comment after it is written.</p>",
              },
            ],
          },
          {
            type: "sorting",
            id: "ipe-08-2-sort",
            heading: "Sort each starting point",
            categories: ["A focus you can act on", "A formal decision for the responsible office", "A rating or judgment about people"],
            items: [
              { text: "The renewal notice my unit mails, and what happens to the people who never respond to it.", category: "A focus you can act on" },
              { text: "Whether one employee's accommodation request must be approved.", category: "A formal decision for the responsible office" },
              { text: "Working out which of my colleagues still need to examine their assumptions.", category: "A rating or judgment about people" },
              { text: "The questions on the survey my team sends to partners, and who never answers them.", category: "A focus you can act on" },
              { text: "Whether a complaint about how a supervisor spoke to an employee is substantiated.", category: "A formal decision for the responsible office" },
              { text: "Placing my unit somewhere on a cultural competence scale so we can watch it improve.", category: "A rating or judgment about people" },
              { text: "The two-week response window in a letter I drafted, and whether anyone has tested it with people who move often.", category: "A focus you can act on" },
              { text: "Deciding whether a program's eligibility policy should be changed agencywide.", category: "A formal decision for the responsible office" },
            ],
          },
          {
            type: "list",
            heading: "Questions that open a doorway",
            ordered: false,
            items: [
              "What did I send out last month that someone had to act on within a deadline?",
              "Which step in a process I touch do people most often fail to complete, and what have we assumed about why?",
              "What do I explain to people over and over, and what does the repetition say about the material?",
              "Whose expertise have I never paid for, in work that is entirely about them?",
              "What would I want to know if I were on the receiving end of the process I run?",
              "What question would I ask if I knew no one would think less of me for not already knowing it?",
            ],
          },
          {
            type: "text",
            heading: "One boundary to know before you choose",
            body: "<p>If a candidate focus involves Tribal Nations, tribal members or government-to-government relationships, that work is coordinated through the Office of Indian Affairs and the DHS offices that handle tribal matters. This is a standing deference, not a gap this program is waiting to fill on its own. Bring the question to those offices rather than building your own understanding from general material, and let their direction shape what you read, whom you talk to, and what you do next.</p>",
          },
          {
            type: "leaderMove",
            heading: "Take the doorway nearest your hands",
            control: "You control which of your own work products you look at first, and you can start with the smallest one without announcing anything.",
            failure: "Do not choose the doorway that leads somewhere flattering, and do not choose the one that points at another unit's work. A focus that is really a critique of a colleague has no first step in it for you.",
            next: "Walk all four doorways this week and write down every candidate, including the ones that feel too small. Choosing comes next; collecting comes first.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-08-2-check",
            question: "A staff member says: “My focus is that our county partners do not take accessibility seriously.” Which response best redirects this into a workable starting point?",
            options: [
              { text: "It is a fair observation and a good focus; understanding partner attitudes is a legitimate subject for learning.", correct: false },
              { text: "Ask what his own unit sends partners — the templates, guidance, timelines, review steps and examples — and what in that material makes accessibility easy or hard to act on, because that is the part he can examine and change.", correct: true },
              { text: "Suggest he raise it with his supervisor so partner performance can be addressed through the contract.", correct: false },
              { text: "Recommend he survey partners about their accessibility practices so the problem can be measured before anything is decided.", correct: false },
            ],
            feedbackCorrect: "Yes. The original statement is a verdict about other people with no first step inside it. The redirect keeps the concern and moves it onto work he touches.",
            feedbackIncorrect: "Ask which option gives him something to look at tomorrow without anyone's approval. A verdict about partners, a referral upward and a survey all keep the subject outside his reach; only one option names material his own unit produces.",
          },
          {
            type: "statement",
            body: "Private reflection, not recorded and not shared: of the four doorways, which one did you find hardest to answer honestly — and what does that difficulty tell you about where your attention usually goes?",
          },
        ],
      },
      {
        id: "ipe-08-3",
        number: 3,
        title: "Narrow it until you can act on it",
        summary: "A focus that is too big never starts. Four tests that turn an interest into something reachable, and three kinds of focus worth setting aside.",
        minutes: 10,
        learning: {
          objective: "Narrow a broad interest until it names one document, decision, process or meeting you can reach within your own authority, and explain why the narrowed version teaches more than the broad one.",
          takeaways: [
            "Four tests: is it attached to work you actually touch; is it small enough to start this month; does it name who is affected; and does it point at a document, decision or practice rather than at a person?",
            "Three kinds of focus are worth setting aside: a self-diagnosis, a verdict about a colleague, and a system you cannot move alone. None of the three contains a first step you can take.",
            "Depth is a choice, not a level. Reading one thing carefully, changing one form, and paying an advisor whose expertise you are missing are all legitimate, and none of them ranks above the others.",
            "A focus is allowed to be wrong. Changing it in two weeks because the real question turned out to be somewhere else is the method working, not a failure of commitment.",
          ],
          evidence: "A tabs exercise that narrows one broad interest in four steps, a sorting exercise separating focuses that are ready to start from focuses that still need narrowing, and a knowledge check.",
          appliedNextStep: "Take the widest candidate you wrote down and run it through the four tests until it names one document, decision, process or meeting.",
        },
        scenario: {
          context: "A communications staff member has said for three months that her learning focus is language access. It has stayed exactly that size the whole time. Her actual assignment this quarter is a redesign of the division's public program pages and the notices that link from them.",
          prompt: "How should she narrow it?",
          options: [
            {
              label: "Keep it broad. Language access is a large and serious subject, and she should understand it properly before she touches anything.",
              response: "The proper understanding never arrives on its own, and the pages go out on the quarter's schedule either way. General reading has no end point until a piece of real work gives it one. Keep the reading; attach it to the pages.",
            },
            {
              label: "Narrow to the material in front of her: which pages and notices exist in which languages, who decides that and on what basis, what a person who reads Somali or Hmong actually meets when they arrive at the page, and which parts of that path her unit controls.",
              response: "This names the work, the people affected, and a first step inside her authority. It also teaches her more about language access in one month than three months of general reading would, because every answer arrives attached to a decision someone has to make.",
              recommended: true,
            },
            {
              label: "Swap it for something smaller and unrelated that can be finished quickly, such as adding alternative text to the images on the pages.",
              response: "Alternative text matters and the instinct to finish something is not wrong. But a focus chosen because it closes quickly rarely changes a decision, and she would still be carrying the original question. Narrow the question she actually has rather than replacing it with an easier one.",
            },
          ],
        },
        transfer: {
          prompt: "Take your widest candidate. What is the smallest piece of it that touches work you will do in the next month?",
          options: [
            "Name the single document, decision, process or meeting the focus attaches to.",
            "Name the people affected, specifically enough that you could describe who would be helped and who would be burdened.",
            "Name the first step you can take without anyone's approval, and the week you will take it.",
            "Name the part you would have to hand to another office, and stop carrying that part yourself.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Too big to start, too small to matter",
            body: "<p>Broad focuses feel serious. “Equity in our programs,” “cultural responsiveness,” “language access,” “accessibility” — each is a real subject, and each is also a container large enough to hold a career. Held at that size, they produce reading lists and good intentions, and they rarely change a document. The narrowing is not a retreat from the subject. It is how you get close enough to it to learn anything specific.</p><p>Four tests do most of the work. <strong>Attached:</strong> does it connect to work you actually touch, or to work you only have opinions about? <strong>Small enough:</strong> could you make a start this month, in the hours you really have, without a new project? <strong>Named:</strong> can you say who is affected, specifically enough to describe who is helped and who is burdened? <strong>Pointed at the work:</strong> is the subject a document, a criterion, a timeline, a meeting or a decision — rather than a person, including yourself?</p><p>There is a floor as well as a ceiling. A focus can be narrowed until nothing is left: fixing a typo, renaming a field, adding one line to a template that no one reads. The test for the floor is simple. Ask who would notice if it went well. If the honest answer is no one outside your own screen, narrow a different way — take the same document but ask a harder question about it, rather than taking a smaller piece of it.</p>",
          },
          {
            type: "tabs",
            heading: "One interest, narrowed in four steps",
            tabs: [
              {
                label: "As it first arrives",
                body: "<p><em>“I want to work on accessibility.”</em> True, serious, and unusable. It names no document, no decision and no person. In this form it produces a reading list and a vague sense of obligation, and three months later it is still exactly the same sentence.</p>",
              },
              {
                label: "Attached to real work",
                body: "<p><em>“I want to work on accessibility in the materials my unit sends out.”</em> Better: it now touches work she actually produces. It is still too large to start — her unit sends out dozens of things — but the subject has moved from the abstract into her own hands, which is where every useful version begins.</p>",
              },
              {
                label: "Small enough to start",
                body: "<p><em>“The eligibility packet we mail, and whether a person using a screen reader, a person with low vision, or a person who processes slowly can actually complete it.”</em> Now it fits a month. One document, a specific path through it, and a set of real experiences to test it against rather than a standard to cite.</p>",
              },
              {
                label: "Named and owned",
                body: "<p><em>“The eligibility packet, tested with three people who use it and paid for their time, with the results going to the packet's owner and the accessibility coordinator, and a first change I can make myself in the cover letter.”</em> This names the people, the expertise being paid for, the offices that decide, and a step she takes without permission. It is a focus.</p>",
              },
            ],
          },
          {
            type: "accordion",
            heading: "Three focuses worth setting aside",
            items: [
              {
                title: "A self-diagnosis",
                body: "<p><em>“I need to work on my own bias.”</em> The intention is decent and the form is unusable. It has no document, no decision, no other person's experience in it and no way to tell whether anything changed. It also quietly makes you the subject of work that is supposed to be about the people your decisions reach. Keep the seriousness; move the subject. Ask instead which of your recurring decisions has the most room for an assumption to operate, and start there.</p>",
              },
              {
                title: "A verdict about a colleague",
                body: "<p><em>“My focus is that my supervisor does not understand this.”</em> Sometimes the observation is accurate. It is still not a learning focus, because every step it suggests belongs to someone else, and because a concern about a specific person's conduct belongs to a different route entirely — a conversation, a supervisor, human resources, or the equal opportunity office, depending on what happened. Choose a focus that gives you something to do on Monday.</p>",
              },
              {
                title: "A system you cannot move alone",
                body: "<p><em>“State procurement rules disadvantage small culturally specific organizations.”</em> This may well be true and worth someone's serious attention. As a personal learning focus it stalls, because the first step sits several offices away. Take the piece your own unit holds — the application, the timeline, the notice, the outreach list, the scoring sheet — and learn there. What you find is also the most useful thing you could ever bring to the people who do set the rules.</p>",
              },
            ],
          },
          {
            type: "sorting",
            id: "ipe-08-3-sort",
            heading: "Ready to start, or still needs narrowing?",
            categories: ["Ready to start", "Needs narrowing"],
            items: [
              { text: "Understanding cultural responsiveness in human services.", category: "Needs narrowing" },
              { text: "The five questions on our intake form that people most often leave blank, and why.", category: "Ready to start" },
              { text: "Becoming a more inclusive person.", category: "Needs narrowing" },
              { text: "How our division decides which materials get translated, and who is never asked.", category: "Ready to start" },
              { text: "Fixing inequity in state government.", category: "Needs narrowing" },
              { text: "The hour and format of the quarterly partner meeting, and who has stopped attending it.", category: "Ready to start" },
              { text: "The closure code on records that appear once and never again, and what it hides.", category: "Ready to start" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Choose the version with a first step in it",
            control: "You control the size of your own question, and you can rewrite it as many times as you need before anyone hears about it.",
            failure: "Do not keep a focus at a size that lets you feel serious without starting, and do not shrink it until nothing outside your own screen would change. Both sizes are comfortable, and neither one teaches you anything.",
            next: "Rewrite your candidate until the sentence contains a document or decision, the people affected, and a step you can take this month. If you cannot write that sentence, the focus is not narrow enough yet.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-08-3-check",
            question: "Which of these is narrow enough to act on while still mattering to someone outside the building?",
            options: [
              { text: "Learning more about disability culture so that her work becomes more respectful over time.", correct: false },
              { text: "Reviewing the two-page instruction sheet her unit mails with every application, with three people who have used it and are paid for their time, and rewriting the section on deadlines that she owns.", correct: true },
              { text: "Correcting the inconsistent heading styles in her unit's internal templates so the documents look more professional.", correct: false },
              { text: "Understanding why the division's overall participation rates differ across communities across the whole state.", correct: false },
            ],
            feedbackCorrect: "Yes. One document, real people whose expertise is paid for, a clear effect on someone outside the building, and a first step she can take herself.",
            feedbackIncorrect: "Run each option through the four tests: attached to work she touches, small enough to start this month, names who is affected, and points at a document or decision rather than at a person or an entire system. Only one option passes all four — and one of the others changes nothing for anyone outside her own screen.",
          },
          {
            type: "statement",
            body: "Private reflection, not recorded and not shared: which is more comfortable for you — a focus so large that no one can say you have not started, or one so small that nothing much is at stake? Notice which way you drift, and narrow or widen once against that habit.",
          },
        ],
      },
      {
        id: "ipe-08-4",
        number: 4,
        title: "Your private learning intention",
        summary: "Five lines you write for yourself: the work, the question, the first step, the expertise you are missing and how it is paid for, and the date you will look again.",
        minutes: 11,
        learning: {
          objective: "Write a private learning intention that names the work, the question, a first step inside your own authority, the expertise you are missing and how it will be paid for, and the date you will revisit it.",
          takeaways: [
            "An intention is not a goal in a performance plan. There is no rating attached to it, no deadline anyone else enforces, and no audience but you.",
            "Five lines make it real: the work it is attached to, the question underneath it, the first step inside your own authority, whose expertise is missing and how they will be paid, and when you will look at it again.",
            "People with disabilities, families, community organizations and interpreters who help you understand something are advisors giving professional expertise. Arrange payment before you ask, not after, and say what changed because of what they told you.",
            "The revisit date is part of the tool. Most intentions are half wrong at the start, and the date is what turns that from a failure into an ordinary correction.",
            "Keeping it private is a design choice, not secrecy. A note that a supervisor will read becomes a note written to be read, and stops telling you the truth.",
          ],
          evidence: "A private learning intention written for one real piece of your own work, kept by you, plus a knowledge check on what makes an intention actionable rather than aspirational.",
          appliedNextStep: "Write your five lines, keep them somewhere you will actually see them, and put the revisit date in your own calendar rather than anyone else's.",
        },
        scenario: {
          context: "A supervisor writes her own learning intention, finds it genuinely useful, and wants her staff to have the same thing. At the next unit meeting she asks everyone to write one and send it to her, so she can support their development and refer to it in their next check-in.",
          prompt: "What should happen next?",
          options: [
            {
              label: "Collect them. A supervisor who knows what her staff are working on can protect time, find materials and remove obstacles they would never raise on their own.",
              response: "The offer is real and the obstacles are real. The collection is what changes the nature of the thing. Once an intention is read by the person who writes your review, people write it to look right, and the honest version — the part where you admit you have never spoken to anyone who uses the service — quietly disappears.",
            },
            {
              label: "Keep the intentions private and offer the support separately: tell the unit what time, materials, advisor budget and meeting access are available, and let anyone who wants help ask for it by name.",
              response: "This delivers the two things she was actually offering — time and resources — without turning a private note into something read, remembered and repeated back in a check-in. Anyone who wants to share theirs still can, on their own terms.",
              recommended: true,
            },
            {
              label: "Collect them but promise they will never be mentioned in a performance conversation.",
              response: "A promise cannot un-know something, and staff know that. The promise also puts the supervisor in an impossible position the first time an intention is relevant to a real decision. The safer design is not to collect them: ask the unit what would help, rather than asking to see what each person wrote.",
            },
          ],
        },
        transfer: {
          prompt: "What would make your own intention easy to keep, and what would quietly kill it?",
          options: [
            "Name where you will keep it so you will actually see it again.",
            "Name the first step small enough that a busy week cannot defeat it.",
            "Name the date you will look again, and put it in your own calendar today.",
            "Name the one obstacle most likely to stop you, and what you would do about it.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Five lines, kept by you",
            body: "<p>A learning intention is a short private note you write to yourself after you have found and narrowed a focus. It is not a development goal, and it is deliberately not built like one: no rating, no reporting line, no due date anyone else enforces, no audience. Its whole purpose is to survive the six weeks between deciding something matters and having any time for it.</p><p>Five lines do the work. The <strong>work</strong> it is attached to, named specifically enough that you could put your hand on the document. The <strong>question</strong> underneath it, written in the words you would use with a colleague rather than the words you would use in a memo. The <strong>first step</strong> inside your own authority, small enough that a bad week cannot defeat it. <strong>Whose expertise is missing</strong>, and how they will be paid for it. And the <strong>date</strong> you will look at this again.</p><p>The fourth line is the one people skip, and it is the one that most often separates learning from circling. If your focus concerns people with disabilities, families, interpreters or a community organization, the people who can answer your question are not a resource to be consulted for free. They are advisors with professional expertise, invited and compensated as co-designers, reviewers or advisors — and told afterward what changed because of what they said. Arranging that takes lead time, which is exactly why it belongs in the note at the start rather than in an apology at the end.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A private learning intention",
            summary: "Five lines you write for yourself and keep. Nothing here is collected, counted, compared or reported. Replace the example wording with your own, keep it where you will see it, and change it whenever the work changes.",
            fields: [
              { label: "The work this is attached to", value: "The eligibility instruction sheet my unit mails with every application, and the two-week response window printed on it." },
              { label: "The question underneath it", value: "What does that sheet assume about reading, translation time, housing stability and energy — and which of those assumptions did policy actually require, rather than habit adding them?" },
              { label: "The first step inside my own authority", value: "Read the policy text beside the sheet and mark every requirement the sheet adds that the policy does not require. Two hours, this month, no approval needed." },
              { label: "Whose expertise is missing, and how they will be paid", value: "Three people who have used the sheet, and one community organization that helps people complete it. Arrange advisor payment through the unit's existing budget before asking, allow lead time for scheduling and interpretation, and tell them afterward what changed." },
              { label: "When I will look at this again", value: "Six weeks from today, in my own calendar. If the question has moved somewhere else by then, follow it there and rewrite these lines." },
            ],
            action: "Replace each line with your own, keep the note where you will see it, and put the revisit date in your own calendar. Do not send it to your supervisor, and if you lead a unit, do not ask to see anyone else's — offer the time, the budget and the access instead.",
          },
          {
            type: "list",
            heading: "What makes an intention real rather than aspirational",
            ordered: true,
            items: [
              "It names a document, decision, process or meeting you could put your hand on today.",
              "Its first step fits in the hours you actually have, not the hours you wish you had.",
              "It names someone outside this building who would notice if it went well.",
              "It names the expertise you are missing and how that person will be paid, before you ask for their time.",
              "It has a date on it, in your own calendar, and permission built in to change the whole thing on that date.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Offer the time, not the paperwork",
            control: "If you lead people, you control whether learning here comes with hours, a small advisor budget and access to the right meetings — or with a form to fill in.",
            failure: "Do not collect, review or ask about individual intentions, and do not build them into check-ins or development plans. The moment they are read by someone who evaluates the writer, they become documents written to be read, and the honest lines drop out.",
            next: "Tell your unit plainly what is available — protected hours, materials, payment for advisors, access to the meeting where the decision is made — and let people come to you by name if they want it.",
          },
          {
            type: "flashcards",
            heading: "The five lines, in short",
            cards: [
              { front: "The work", back: "<p>A document, decision, process or meeting specific enough that you could put your hand on it today. Not a subject area.</p>" },
              { front: "The question", back: "<p>In the words you would use with a colleague. If it does not have an answer somewhere, it is still a topic rather than a question.</p>" },
              { front: "The first step", back: "<p>Inside your own authority, small enough that a bad week cannot defeat it, and scheduled rather than intended.</p>" },
              { front: "The missing expertise", back: "<p>Who could answer this who is not in the room, and how they will be paid. Arrange it before you ask, and say afterward what changed because of what they told you.</p>" },
              { front: "The date", back: "<p>In your own calendar. The point is not to check whether you complied. The point is to ask whether the question is still the right one.</p>" },
            ],
          },
          {
            type: "quote",
            text: "I wrote six weeks on the line because it felt arbitrary. When the date came, the question had moved — the deadline was not the problem at all, the mailing list was. Having somewhere to write that down is what kept it from becoming one more thing I meant to look at.",
            cite: "Composite DHS staff perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-08-4-check",
            question: "Which learning intention is written so that something is likely to happen?",
            options: [
              { text: "I will build my understanding of culturally responsive practice over the coming year and apply it across my work.", correct: false },
              { text: "The partner survey my team sends each quarter: what do the open questions assume about literacy and time, who never responds, and what do the people who stopped responding say about it? First step is to read the last two rounds of responses against the distribution list, this month. I will arrange paid advisory time with two organizations that stopped answering. I will look at this again in eight weeks.", correct: true },
              { text: "I will identify my own blind spots in intercultural work and track my progress against the continuum over the next two quarters.", correct: false },
              { text: "I will ask my supervisor to assign me to the accessibility workgroup so that I can learn from the people already doing this work.", correct: false },
            ],
            feedbackCorrect: "Yes. Work, question, first step inside her own authority, paid expertise, and a date. Every line has something in it that can actually happen.",
            feedbackIncorrect: "Look for five things: a document or process you could point at, a question with an answer, a step the writer can take without permission, the missing expertise and how it is paid, and a date. One option has all five; the others are a subject area, a self-assessment, and a request that depends entirely on someone else saying yes.",
          },
          {
            type: "statement",
            body: "Private reflection, not recorded and not shared: read your five lines once more. If the first step never happens, what will the real reason have been — and is that reason something you can change, something to ask for, or something to design around?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Choose a learning focus, and write it down",
    subtitle: "One page for picking what to learn from the work already in front of you",
    quote: "A rating tells you where you placed yourself on somebody else's scale. A focus tells you what you will look at, in which piece of work, and when.",
    use: {
      purpose: "Keep the four doorways, the four tests and the five lines in reach while you decide where to start in this curriculum, or where to go next after a module.",
      remember: [
        "A usable focus has three things a rating never has: a piece of work you can reach, a question with an answer somewhere, and a first step inside your own authority.",
        "Set aside a self-diagnosis, a verdict about a colleague, and a system you cannot move alone. None of the three has a first step in it for you.",
        "People with disabilities, families, community organizations and interpreters are advisors with professional expertise. Arrange payment before you ask, and say what changed afterward.",
        "Nothing you choose, write or reflect on here is collected, counted, compared or reported, and none of it counts toward DHS-required training credits.",
      ],
      doNext: "Walk the four doorways, narrow the strongest candidate until it names one document or decision, and write your five lines with a date to look at them again.",
    },
    sections: [
      {
        heading: "The four doorways into a focus",
        items: [
          "The decision: what you make, draft, approve, score, fund, schedule or route that reaches people outside this building.",
          "The friction: a moment your work did not land, where the first explanation you reached for was about the other person.",
          "The deferred question: the thing you have wondered about for months without a clean hour to answer it.",
          "The absent voice: the group your process produces results for and almost never hears from directly.",
        ],
      },
      {
        heading: "Four tests before you commit",
        items: [
          "Attached: does it connect to work you actually touch, or only to work you have opinions about?",
          "Small enough: could you start this month, in the hours you really have?",
          "Named: can you say who is affected, specifically enough to describe who is helped and who is burdened?",
          "Pointed at the work: is the subject a document, criterion, timeline, meeting or decision — rather than a person, including yourself?",
          "And a floor test: would anyone outside your own screen notice if this went well?",
        ],
      },
      {
        heading: "Your private learning intention, in five lines",
        items: [
          "The work this is attached to, named specifically enough that you could put your hand on it.",
          "The question underneath it, in the words you would use with a colleague.",
          "The first step inside your own authority, small enough that a bad week cannot defeat it.",
          "Whose expertise is missing, and how they will be paid for it — arranged before you ask.",
          "When you will look at this again, in your own calendar, with permission built in to change all of it.",
        ],
      },
      {
        heading: "What stays out of it",
        items: [
          "No self-rating, placement, level or score — for you, a colleague or your unit.",
          "No collecting of other people's intentions, and no use of them in check-ins or development plans.",
          "No placement of anyone on the intercultural development continuum; the continuum shapes the content, never a record about a person.",
          "Formal determinations — accommodation requests, complaints, discipline, required training, policy exceptions — go to the responsible DHS office, not into a learning note.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Leaders and managers, who can offer hours, advisor budget and meeting access instead of collecting paperwork.",
          "Policy, program and operations staff, whose decisions reach people they rarely meet.",
          "Quality, performance, data, research and analytics staff, who can start from what a measure or a code hides.",
          "Training, communications and learning-design staff, who write what goes out the door.",
          "Fiscal, contracts, grants and procurement staff, and administrative and support staff, whose forms, timelines and mailing lists decide more than they appear to.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Intercultural practice in public disability services",
          "Public power and institutional impact",
          "Bias, assumptions, and accountability",
          "Accessible and respectful communication",
          "Participation and voice",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: learner choice, multiple ways to engage, plain language, and no forced disclosure or self-rating. It is the basis for letting staff enter anywhere and choose their own focus." },
    { title: "Intercultural Development Inventory", href: "https://www.idiinventory.com/", note: "Source of the intercultural development continuum named in Lesson 1 — denial, polarization, minimization, acceptance, adaptation, integration. The assessment itself is licensed and administered by qualified administrators; this program uses the continuum to design content and describe organizational movement, never as a score, label or record about any person." },
    { title: "Minnesota Department of Human Services, Content and writing guidelines", href: "https://mn.gov/dhs/digital-showcase/content-guidelines/", note: "The department's own guidance on first-read understanding, familiar terms and writing suited to the reader; used here as the standard a staff member can test a notice or instruction sheet against once a focus attaches to one." },
    { title: "plainlanguage.gov", href: "https://www.plainlanguage.gov/", note: "Federal plain-language guidelines and techniques, including testing documents with the people who have to use them — the practical method behind the narrowing examples in Lesson 3." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, accessibility and rights, and a public starting point for staff whose focus turns out to concern accessibility obligations rather than optional practice." },
    { title: "Minnesota Department of Human Services, People with disabilities", href: "https://mn.gov/dhs/people-with-disabilities/", note: "The department's public overview of disability services and supports; useful for locating which program, notice or process a candidate focus actually belongs to." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards (Think Cultural Health)", href: "https://thinkculturalhealth.hhs.gov/clas/standards", note: "National standards for culturally and linguistically appropriate services, including the expectation that organizations partner with the communities they serve in designing and evaluating services — the basis for paying advisors rather than consulting them for free." },
    { title: "W3C Web Accessibility Initiative", href: "https://www.w3.org/WAI/", note: "International accessibility standards and introductions, including guidance on involving people with disabilities early in design rather than reviewing a finished draft." },
  ],
};

export default pack;
