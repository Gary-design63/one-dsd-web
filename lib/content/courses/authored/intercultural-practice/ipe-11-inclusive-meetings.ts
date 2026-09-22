import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Public-service practice · Module 11: Inclusive meetings and engagement.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-11-inclusive-meetings",
    indexNumber: 1153,
    seriesLabel: "Intercultural Practice and Equity · Public-service practice",
    title: "Inclusive Meetings and Engagement",
    subtitle: "Most of what decides who can take part in a meeting is settled before anyone walks in. Four lessons on design, access, facilitation and follow-up, ending with a checklist you fill in for one real meeting.",
    scope: "For internal DHS and DSD staff who schedule, facilitate, support or sit in meetings: supervisors and managers, communications and training staff, administrative and support staff, policy and program staff, and anyone who runs a workgroup, a coordination meeting or a community engagement session. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and an inclusive-meeting planning checklist you can copy into your own work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-04.jpg",
    coverAlt: "Colleagues meeting around a table, including a colleague using a wheelchair.",
    introTranscript: "A meeting is a design. It has a length, a pace, a way items reach the agenda, a way turns get taken and a way decisions get made, and almost none of that was chosen on purpose. This module takes that design apart. It looks at who the standard hour was built for, at the access arrangements that have to exist before the invitation goes out rather than after someone asks, at the facilitation choices that decide whether contributing depends on speaking first, and at the follow-up that decides whether anyone comes back. It ends with a planning checklist you fill in for one real meeting you own.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Identify the design choices a standing meeting has already made, and name who those choices quietly filter out.",
        "Plan interpretation, captioning, materials, room, timing and cost before an invitation goes out, rather than in response to a late request.",
        "Write an invitation that says what is arranged, what else can be arranged, who to contact and by when.",
        "Facilitate so that contributing does not depend on speed, volume or comfort with one cultural style, using stated turn-taking and decision methods.",
        "Complete an inclusive-meeting planning checklist for one real meeting, including who owns each line and what the access arrangements cost.",
      ],
      evidence: [
        "Four worked scenarios drawn from policy, engagement, cross-division coordination and session planning, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates a design choice the meeting owns from a personal preference and from an assumption worth checking.",
        "A completed planning checklist for one real meeting, kept with the agenda rather than in a personal file.",
      ],
      appliedNextStep: "Choose one meeting you already own. Fill the planning checklist in before the next invitation goes out, keep it with the agenda, and send one line to the people who attend saying what changed and why.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in ADA Title II effective-communication requirements, or in U.S. Department of Justice guidance on access to state and local government meetings",
        "A change in Minnesota's accessibility standard for state digital content and events, or in DHS language-access direction under Title VI",
        "Feedback from disabled staff, paid community advisors or interpreters that an arrangement described here does not match how the work actually goes",
      ],
      relatedDoor: "Formal decisions about an accommodation request, an interpreter contract, a vital-document translation or a required public notice belong to the responsible DHS accommodation, language-access, communications and contracting offices; this module prepares the plan, it does not approve or fund it.",
      toolkitQuestion: "Who could take part in this meeting only at a cost they did not choose, and what in the design would change that?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-11-1",
        number: 1,
        title: "Who the meeting was built for",
        summary: "A standing meeting has a design nobody chose. What that design assumes, who it filters out, and why counting attendance proves almost nothing.",
        minutes: 11,
        learning: {
          objective: "Identify the five design choices a standing meeting has already made, and name at least three kinds of participation that design quietly filters out.",
          takeaways: [
            "Every meeting already has a design: a length, a pace, a way items reach the agenda, a way turns are taken, a decision method and a follow-up habit. Most of it was inherited rather than chosen.",
            "The inherited design assumes a fairly specific person: someone who processes spoken information at speed, is comfortable interrupting, is free in the middle of a weekday, knows the institutional shorthand, and will say so in front of a group if they need something else.",
            "Presence is not participation. An attendance count says nothing about whether people could follow the material, contribute in a way that worked for them, influence the outcome, or would choose to come back.",
            "Treating everyone identically is not neutral. It hands the hour to whoever the format already fits, which is why noticing the default is where this work starts.",
          ],
          evidence: "A scenario about a workgroup lead who wonders why some members never speak, sorting practice that separates a design choice from a personal preference, and a knowledge check on what an attendance report actually shows.",
          appliedNextStep: "Take one recurring meeting you attend or run and write down its five inherited choices: length, how items reach the agenda, how materials arrive, how decisions get made, and what happens afterward.",
        },
        scenario: {
          context: "A DSD policy workgroup meets for sixty minutes every other Tuesday at ten in the morning. Slides are shared on screen during the call; there is no agenda in advance. Discussion is open, and the facilitator summarizes the direction once a few people have spoken. Two members who joined the division recently, and one paid community advisor, almost never speak.",
          prompt: "The workgroup lead asks you why those three are so quiet. What is the most useful place to start?",
          options: [
            {
              label: "Suggest calling on them by name during the meeting so their perspectives are on the record.",
              response: "This asks three people to perform on demand, with no preparation time, in the format that was already hardest for them. It also makes their silence look like the problem to be corrected.",
            },
            {
              label: "Look at the meeting's design first — when the agenda arrives, whether materials come in advance, how a turn is taken, how decisions are made — and change the parts the workgroup controls.",
              response: "This is where the evidence points. Three people behaving the same way in the same meeting is usually a fact about the meeting. Every one of those design choices belongs to the workgroup and can be changed without anyone's permission.",
              recommended: true,
            },
            {
              label: "Note in the minutes that all members had an equal opportunity to contribute, since the floor is open to everyone.",
              response: "An open floor is an equal opportunity only for people the format already fits. Recording it as fairness closes the question without examining anything, and the record then says the meeting worked.",
            },
          ],
        },
        transfer: {
          prompt: "Which standing meeting in your own work would change most if you redesigned one thing about it?",
          options: [
            "Name the meeting and the one design choice you would change first",
            "Write down who that change would help, and what it would cost the people it does not help",
            "Decide whether the change is yours to make, and if it is not, name the person it belongs to",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The meeting you inherited",
            body: "<p>Almost nobody designs a meeting. A meeting gets scheduled, and then it keeps its shape: the same hour, the same agenda pattern, the same handful of people who talk, the same way things get decided. The design is real. It simply arrived without a decision. And like any design, it fits some people well and others badly.</p><p>Consider what a standard hour already assumes. It assumes you can take in spoken information at speed, for some colleagues in a second or third language, with nothing written in front of you. It assumes you are comfortable interrupting, because that is how a turn gets taken when several people want one. It assumes the middle of a weekday works, that an unbroken hour of attention is possible, and that the shorthand in the room — program names, statute references, division abbreviations — means something to you. It assumes that if you need something different, you will say so, out loud, to a group, in the moment.</p><p>None of those assumptions is unreasonable by itself. Together they describe a fairly specific person. Everyone else is taking part at a cost, and the cost is invisible to the people the design already fits.</p>",
          },
          {
            type: "list",
            heading: "Five choices your meeting has already made",
            items: [
              "Time and length: when it meets, how long it runs, whether there is a break, and how far ahead it is set.",
              "Agenda: who can put an item on it, when it is published, and whether the purpose of each item is written down anywhere.",
              "Materials: what gets sent, in what format, how early, and whether anything essential exists only on a screen shared during the call.",
              "Turn-taking: whether contributing means speaking up, being called on, writing something, or more than one of those at once.",
              "Decision and follow-up: how a decision actually gets made, who records it, and whether people ever hear what happened to what they said.",
            ],
          },
          {
            type: "tabs",
            heading: "One hour, four experiences",
            tabs: [
              { label: "A policy analyst who thinks in writing", body: "<p>She has the strongest read on the rule change of anyone in the room. In open discussion she is three sentences behind, because she is composing while other people are talking. Her contribution arrives by email at four in the afternoon, after the direction was set. The meeting recorded her as quiet.</p>" },
              { label: "A colleague who is hard of hearing", body: "<p>He joins by phone from a field office. Two people share one microphone, one of them turns away from it, and the automatic captions on the call turn program names into nonsense. He gets about two-thirds of the hour and rebuilds the rest afterward, which takes longer than the meeting did.</p>" },
              { label: "An administrative specialist taking notes", body: "<p>She is present for every decision and is not treated as being in the meeting. She can see which commitments never get written down and which ones quietly disappear between sessions. Nobody has asked her, because the agenda has no line for it and her role has no seat at the table.</p>" },
              { label: "A paid community advisor", body: "<p>She was brought in to carry what families in a rural county are experiencing. The agenda reached her that morning, as slides. The group used shorthand for four programs she has never had reason to name. She spoke once, was thanked warmly, and never learned whether anything changed.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-11-1-sort",
            heading: "A design choice, a preference, or an assumption?",
            categories: ["A design choice the meeting owns", "A personal preference to respect", "An assumption worth checking"],
            items: [
              { text: "The agenda is published on the morning of the meeting.", category: "A design choice the meeting owns" },
              { text: "One member asks for the questions in advance so she can think them through.", category: "A personal preference to respect" },
              { text: "The quieter people would speak up if they had something worth adding.", category: "An assumption worth checking" },
              { text: "Decisions are taken by whoever states a clear position first.", category: "A design choice the meeting owns" },
              { text: "A colleague keeps his camera off and contributes in the written comments.", category: "A personal preference to respect" },
              { text: "Everyone in the room understands the program abbreviations being used.", category: "An assumption worth checking" },
              { text: "The standing meeting runs sixty minutes with no break.", category: "A design choice the meeting owns" },
              { text: "Anyone with something important to say will find a way to say it.", category: "An assumption worth checking" },
            ],
          },
          {
            type: "text",
            heading: "Where this sits in the program's map of change",
            body: "<p>This program uses a familiar map of intercultural development — Denial, Polarization, Minimization, Acceptance, Adaptation and Integration — to describe how organizations and the people in them change over time. It is a map for the work, not a label or a record about any individual. Nothing you do in this module is assessed, scored or kept.</p><p>Meetings are where Minimization is easiest to see. Minimization is the sincere belief that differences between people are mostly surface, that treating everyone the same is what fairness means, and that a good process is one that does not single anybody out. It sounds even-handed, and the people who hold it are usually trying hard to be fair. In a meeting it produces one format, one pace, one way of taking a turn, and a quiet confidence that this is neutral ground. It is not neutral ground. It is home ground for whoever the format already fits.</p><p>Moving toward Acceptance and Adaptation in a meeting is concrete and unglamorous. Acceptance is recognizing that the differences in the room are real and have consequences for who gets heard. Adaptation is changing what you do about it: more than one way to contribute, materials early enough to be useful, a decision method that does not reward speed. That is the whole shift, and it lives entirely in the details.</p>",
          },
          {
            type: "leaderMove",
            heading: "Change the design, not the people",
            control: "You control the design choices in any meeting you schedule: the hour, the agenda, the materials, the turn-taking and the decision method.",
            failure: "Do not hand the problem back to the quiet participant by calling on them in the moment or encouraging them to speak up more. That asks a person to compensate for a design they did not choose and cannot change.",
            next: "Before your next standing meeting, write down its five inherited choices and change the one that costs least and helps most.",
          },
          {
            type: "quote",
            text: "I sat on a workgroup for a year. I planned to read every agenda the night before, except there was no night before — it came at eight in the morning. So I stopped preparing. Then I stopped coming. Nobody asked me why, and I would have told them.",
            cite: "Composite advisory group member perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-11-1-check",
            question: "A division workgroup reports that its engagement session was inclusive because attendance was high and every attendee had the chance to speak. What is the strongest assessment of that report?",
            options: [
              { text: "The report is sound. Attendance and an open floor are the two things a facilitator can genuinely control.", correct: false },
              { text: "Attendance and an open floor describe presence. The report says nothing about whether people could follow the material, contribute in a way that worked for them, change anything, or learn afterward what happened.", correct: true },
              { text: "The report is incomplete only because it does not record which attendees asked for accommodations.", correct: false },
            ],
            feedbackCorrect: "Yes. Counting heads and leaving the floor open are the easiest things to report and the weakest evidence of participation. Ask instead what people could do, what changed, and what they heard back.",
            feedbackIncorrect: "Ask what an attendance count actually proves. Then ask the harder questions: could people follow it, could they contribute in a way that worked for them, did anything change, and did anyone tell them?",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think of a meeting where you said less than you knew. What about the design made staying quiet the easier choice, and who else in that room was probably running the same calculation?",
          },
        ],
      },
      {
        id: "ipe-11-2",
        number: 2,
        title: "Access is arranged, not requested",
        summary: "Why access requests always arrive late, what has to be decided before the invitation goes out, and how to write an invitation that does the work instead of passing it on.",
        minutes: 11,
        learning: {
          objective: "Plan the access parts of a meeting — interpretation, captioning, materials, room, timing and cost — before the invitation goes out, and write an invitation that names what is arranged, what else can be arranged, who to contact and by when.",
          takeaways: [
            "A request that arrives late is usually a symptom of a late invitation. Nobody can ask for something before the meeting becomes real to them, and the meeting becomes real when the invitation lands.",
            "Interpreting, real-time captioning, translated materials, an accessible room and a budget line all need lead time. The useful question is which of them should simply be in place by default, not how to get requests sooner.",
            "An invitation that says only when and where hands the whole access job to the person with the least information and the least power in the situation.",
            "Effective-communication obligations for state and local government meetings set a floor, and the person's own expressed preference carries primary consideration. The floor only helps someone who knows it exists and is willing to ask, which is why planning matters more than the rule.",
          ],
          evidence: "A scenario about a listening session with no interpreters booked, an accordion of the decisions that precede an invitation, flashcards on what lead time buys, and a knowledge check on the strongest response to a late gap.",
          appliedNextStep: "Rewrite one standing invitation template so it names what is already arranged, what else can be arranged, a person to contact with a direct way to reach them, and the date after which some arrangements become hard.",
        },
        scenario: {
          context: "A DSD program team is holding a listening session on a change to service standards. The invitation went out with one line at the bottom: contact us if you require accommodations. Nine days before the session, a community advisor the division pays to review the change writes to ask whether American Sign Language interpreters will be there. None were booked. The room has one small screen at the far end, and the handouts are still in draft.",
          prompt: "You are the staff member organizing the session. What do you do?",
          options: [
            {
              label: "Reply that the division will reimburse her if she brings an interpreter she knows and trusts, since she is the best judge of who works well for her.",
              response: "It moves both the arranging and the risk onto the person who asked, and a reimbursement is a promise rather than an arrangement. Communication access for a session the division convenes is the division's to provide, and her preference about which interpreter should be asked for, not substituted for the booking.",
            },
            {
              label: "Book qualified interpreters and real-time captioning now, confirm with her which arrangement works best, brief the interpreters with the agenda and the program names, move to a room that works, and fix the invitation template before the next session.",
              response: "This repairs the session and the step that produced the gap. It asks her rather than assuming, gives the interpreters what they need to be accurate on technical material, and makes sure the next invitation starts from a different place.",
              recommended: true,
            },
            {
              label: "Move the session online, where automatic captions are available at no cost and the room problem disappears.",
              response: "Automatic captions are a convenience, not an equivalent, and they fail hardest on exactly the program names a policy session depends on. The move also answers a request for interpreters with something else entirely, and it may exclude people who were counting on being in the room.",
            },
          ],
        },
        transfer: {
          prompt: "Which invitation or meeting notice that you send would change most if access were arranged before it went out?",
          options: [
            "Name the notice and the one arrangement that should become the default for it",
            "Find out who holds the budget for interpreting, captioning and translation in your unit, and write the name down",
            "Rewrite the accommodation line so it names what is arranged, who to contact and by when",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Why the request always arrives late",
            body: "<p>Most access arrangements at DHS are set in motion by a request, and most requests arrive later than anyone would like. It is tempting to read that as poor planning by the person asking. It almost never is. A person asks once the meeting has become real to them: when the invitation arrives, when the date is fixed, when they have decided the meeting is worth the effort of asking at all. If the invitation goes out ten days ahead, no request can arrive earlier than that.</p><p>The stretch between the invitation and the meeting is the entire planning window, and it belongs to the organizer. American Sign Language interpreters for a specialized policy discussion get booked well ahead. Real-time captioning has to be scheduled and tested on the actual setup. A translated handout has to be written, translated, reviewed and produced. A room has to be checked in person, not assumed from a floor plan. A budget line has to exist before anyone can spend against it.</p><p>So the useful question is not how to make requests come sooner. It is which arrangements should be in place before anyone asks, and which genuinely depend on who is coming. The first list turns out to be longer than most teams expect.</p>",
          },
          {
            type: "accordion",
            heading: "Decide these before the invitation goes out",
            items: [
              { title: "Interpretation and captioning", body: "<p>Decide whether American Sign Language interpreters, spoken-language interpreters and real-time captioning are booked by default for this kind of session or arranged on request, and be explicit about which. For anything public or stakeholder-facing, default is usually the right answer. Qualified interpreters need lead time, the agenda and any technical vocabulary in advance, and a realistic break schedule; long sessions are normally covered by a team of two, because one interpreter cannot sustain accuracy alone.</p>" },
              { title: "Materials and formats", body: "<p>The agenda with the purpose of each item, any document that will be discussed, and any slide carrying real content. Sent as text people can enlarge, listen to, translate or print, and early enough that doing any of those is possible. Nothing essential should exist only on a screen shared during the meeting.</p>" },
              { title: "Room, seating and the online setup", body: "<p>A step-free route from the parking area, and a restroom people can use on the same floor. Clear sightlines to whoever is speaking and to the interpreters. Microphones that are genuinely used rather than sitting on the table. Space to sit that was planned, not made by pulling a chair away at the last minute. Online: captions turned on and tested, a written way to contribute, and nothing important buried in a document or a poll that some people cannot reach.</p>" },
              { title: "Timing, length and breaks", body: "<p>The hour, the day and the length are access decisions. A ninety-minute block with no break excludes people who cannot sit that long, people with medication or care routines, and anyone whose energy is finite. Sessions held only in the middle of a weekday exclude people who work, who provide care at home, or who are driving in from outside the metro area.</p>" },
              { title: "Cost, compensation and who pays", body: "<p>Interpreting, captioning, translation, travel and childcare cost money, and so does the time of community advisors who are not on the payroll. If the budget is not named before the invitation, the arrangement becomes an argument afterward, and the person who asked will feel that argument even if nobody intends it. Settle whose budget carries each line while the session is still being planned.</p>" },
              { title: "The ask-back line", body: "<p>The sentence that invites anything else: what is already arranged, what else can be arranged, who to contact by name with a direct way to reach them, and the date after which some arrangements stop being possible. One honest line does more than a paragraph of policy language.</p>" },
            ],
          },
          {
            type: "flashcards",
            heading: "What lead time buys",
            cards: [
              { front: "The invitation", back: "<p>Sent early, it is the request window. Sent late, it guarantees that every request will be described as last-minute.</p>" },
              { front: "Interpreters", back: "<p>Booked well ahead, briefed with the agenda and the program vocabulary, and scheduled with breaks. Confirm the language and the arrangement with the person rather than deciding on their behalf.</p>" },
              { front: "Real-time captioning", back: "<p>Scheduled, tested on the actual setup, and given the program names in advance. Automatic captions are a convenience, not an equivalent, and they fail hardest on the exact words a policy discussion turns on.</p>" },
              { front: "Translated materials", back: "<p>Written plainly first, then translated, then reviewed by someone who speaks the language and knows the subject. Vital documents carry their own review requirements under civil rights law; leave room in the schedule for them.</p>" },
              { front: "The room", back: "<p>Visited, not assumed. Someone walks the route from the parking area to the seat, checks the restroom on that floor, looks at the sightlines, and tries the microphone.</p>" },
              { front: "Your budget line", back: "<p>Named before the invitation. An arrangement nobody has funded turns into a debate at the worst possible moment, while a person waits for an answer.</p>" },
            ],
          },
          {
            type: "text",
            heading: "The invitation is the first accessibility feature",
            body: "<p>An invitation that gives only a time and a place hands the entire access job to the person with the least information. A useful invitation does five things in a short space: it says what the meeting is for and what will be decided, lists what is already arranged, says what else can be arranged, names a person and a direct way to reach them, and gives the date by which some arrangements stop being possible.</p><p>That last part gets left out most often, because naming a deadline feels unwelcoming. It is the opposite. Telling someone to contact Maria by the fifteenth so interpreters can be booked is honest and actionable. Telling them to contact us if you require accommodations gives no contact, no date and no examples, and it signals accurately that nothing has been arranged yet.</p><p>Under the Americans with Disabilities Act, meetings held by state and local government carry an effective-communication obligation, and the person's own expressed preference for how to communicate carries primary consideration. That is the floor, and it is worth knowing. It also only helps someone who already knows the floor exists and is willing to stand on it, which is why the planning matters more than the rule does.</p>",
          },
          {
            type: "leaderMove",
            heading: "Arrange it, then invite",
            control: "You control the order of operations: what is arranged before the invitation goes out, and what the invitation actually says.",
            failure: "Do not send an invitation with a bare accommodation sentence and then treat the silence that follows as evidence that nothing was needed. Silence usually means the window had already closed, or that asking felt like requesting a favor.",
            next: "Rewrite one standing invitation template this month so it names what is arranged, what else can be arranged, a person, and a date.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-11-2-check",
            question: "A stakeholder session is nine days out. A paid community advisor who is Deaf asks whether interpreters will be provided. None were booked. Which response is strongest?",
            options: [
              { text: "Ask the advisor to arrange an interpreter she trusts and submit the cost for reimbursement afterward.", correct: false },
              { text: "Book qualified interpreters and real-time captioning now, confirm with the advisor which arrangement works for her, brief the interpreters with the agenda and program names, and change the invitation template so the next session starts with this already arranged.", correct: true },
              { text: "Move the session online, where automatic captions are available at no cost.", correct: false },
              { text: "Offer to meet with the advisor separately afterward and carry her input back to the group.", correct: false },
            ],
            feedbackCorrect: "Yes. It arranges communication access for this session, asks the person instead of assuming, prepares the interpreters to work accurately on technical material, and repairs the step that produced the gap.",
            feedbackIncorrect: "Check three things: does the response arrange communication access for this meeting, does it ask the person what actually works, and does it fix the step that caused the problem? A separate conversation later is not the same meeting, and automatic captions are not an equivalent to an interpreter.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think of the last meeting you organized. If someone had needed an interpreter, captions or a translated handout, when would they have found out that you had not arranged it — and what would that have cost them?",
          },
        ],
      },
      {
        id: "ipe-11-3",
        number: 3,
        title: "How the hour actually runs",
        summary: "Open discussion is a style, not a neutral default. Turn-taking, pace, decision method and report-back, and what each one decides about who is heard.",
        minutes: 10,
        learning: {
          objective: "Facilitate a meeting so that contributing does not depend on speed, volume or comfort with one cultural style, using at least four stated choices about turn-taking, pace, decision method and report-back.",
          takeaways: [
            "Fast open discussion is a style, not a neutral baseline. It rewards people who think aloud, who interrupt comfortably, and who share the room's first language and institutional shorthand.",
            "Offering more than one channel — spoken, written before, written during, or sent within a few days afterward and treated as equal — does more for participation than any amount of encouragement to speak up.",
            "The decision method is what people remember. Deciding by who spoke first or most confidently is a choice; so is deciding after a written round, or naming who decides and on what basis.",
            "Report-back is part of the meeting, not an administrative afterthought. Someone who never learns what happened to their contribution has been given a seat, not a say.",
          ],
          evidence: "A scenario about a cross-division coordination meeting where careful thinking arrives by email afterward, sorting practice on facilitation choices, and a knowledge check on deciding by informal consensus.",
          appliedNextStep: "In the next meeting you facilitate, name the contribution channels out loud at the start, state the decision method before the discussion opens, and send a short note afterward saying what happened to each contribution.",
        },
        scenario: {
          context: "A cross-division coordination meeting brings together policy, fiscal, data and county-relations staff, along with two program managers who joined the division in the last few months. The meeting moves fast. Positions get stated quickly, the facilitator summarizes the direction the discussion seems to be heading, and the group moves on. Afterward, both new managers send long, careful emails raising a problem nobody named in the room.",
          prompt: "What is the most useful change to make before the next meeting?",
          options: [
            {
              label: "Ask the two managers to raise concerns during the meeting next time, since email after the fact slows the whole group down.",
              response: "This reads their contribution as a process failure and asks them to adopt the room's style. The emails were careful and useful. It is the meeting that failed to collect them, at the point where it still could have mattered.",
            },
            {
              label: "Change the meeting: send the questions with the agenda, take a written round before discussing anything that will be decided, state the decision method before the debate opens, and report back what happened to each contribution.",
              response: "Four small changes, all inside the facilitator's control. They collect thinking that is already happening, stop rewarding whoever speaks first, and tell everyone what their contribution is actually for.",
              recommended: true,
            },
            {
              label: "Keep the format and add a standing item at the end of the agenda for anyone who has not yet spoken.",
              response: "Better than nothing, and it still puts the least-supported moment at the end of a long hour, after the direction has already been set. The problem is where the decision happens, not whether a few minutes are left over.",
            },
          ],
        },
        transfer: {
          prompt: "What would change in your next meeting if contributing did not require speaking first?",
          options: [
            "Choose one meeting and add a written round before the item that will be decided",
            "Write the decision method into the agenda and say it out loud at the start",
            "Send a short note afterward saying what happened to each contribution, including the ones that did not change the outcome",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Discussion styles are not neutral ground",
            body: "<p>A meeting that runs on open discussion is running on a particular set of habits: state your position early, defend it briskly, jump in when you have something, treat silence as agreement or as nothing at all. Those habits are familiar in a great many American professional settings and they are genuinely useful for some kinds of work. They are not a baseline, and they are not the only way capable people think.</p><p>People differ in how directly they voice disagreement, especially with a supervisor in the room. They differ in how long a pause has to run before it counts as an invitation rather than an interruption; a two-second gap is an opening in some conversational cultures and a rudeness in others. They differ in whether a view is offered individually or only after a group has talked it through. They differ in whether a newer colleague names a problem in front of the person whose work it touches. None of this maps neatly onto anybody's background, and treating it as a rule about a group is its own mistake. What it means in practice is narrower and more useful: the room's default rewards one pattern and reads every other pattern as having nothing to say.</p><p>The repair is not to ask people to change their pattern. It is to run a meeting that collects contributions through more than one channel, and to stop treating speed as a proxy for conviction.</p>",
          },
          {
            type: "accordion",
            heading: "Four choices that decide who takes part",
            items: [
              { title: "Turn-taking", body: "<p>Decide it rather than letting the fastest voice set it. A round where everyone is asked in turn, with a genuine option to pass, collects far more than an open floor. So does a written minute before discussion: two minutes of silence while everyone writes, then read them in. The colleague you read as quiet is often the one with the sharpest read on the problem; the format, not the person, decided you never heard it.</p>" },
              { title: "Pace and processing time", body: "<p>Send the questions with the agenda, not just the topic headings. Leave a beat after asking something — longer than is comfortable for you. Say at the start that contributions sent within a couple of days afterward carry the same weight as what was said in the room, and then actually treat them that way when the note goes out.</p>" },
              { title: "Decision method", body: "<p>Name it before the discussion, not after. Who decides, on what basis, and when. A stated method — the program director decides after hearing everyone, or the group decides by written round a day later — protects the people who need time and tells everyone what their contribution is for. An unstated method defaults to whoever sounds most certain.</p>" },
              { title: "Report-back", body: "<p>Within a few days, say what was decided and what happened to each contribution, including the ones that did not change the outcome and why they did not. This is the most underrated part of a meeting and the part that community partners and newer staff notice most. It is also the only proof that listening was real.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-11-3-sort",
            heading: "Does this open participation or narrow it?",
            categories: ["Opens participation", "Narrows it to one style", "Depends on how it is used"],
            items: [
              { text: "Two minutes of silent writing before any discussion of a decision item.", category: "Opens participation" },
              { text: "Questions, not just topics, sent with the agenda three working days ahead.", category: "Opens participation" },
              { text: "A note afterward saying what happened to each contribution.", category: "Opens participation" },
              { text: "The facilitator summarizes the emerging direction after the first three speakers.", category: "Narrows it to one style" },
              { text: "Deciding by whoever states a position most confidently.", category: "Narrows it to one style" },
              { text: "Treating silence as agreement so the group can move on.", category: "Narrows it to one style" },
              { text: "Calling on the quietest person by name, without warning, to model inclusion.", category: "Narrows it to one style" },
              { text: "Going around the room to hear from everyone, announced only in the moment.", category: "Depends on how it is used" },
              { text: "A written comment channel that nobody reads aloud or records.", category: "Depends on how it is used" },
            ],
          },
          {
            type: "leaderMove",
            heading: "State the method before the discussion",
            control: "You control the turn-taking, the pace, the decision method and the report-back in any meeting you facilitate.",
            failure: "Do not summarize the emerging direction early. A facilitator's summary lands with authority, and it closes the question for everyone who was still forming a view.",
            next: "In your next meeting, state the decision method before the discussion opens, and hold your own summary until after the last contribution.",
          },
          {
            type: "quote",
            text: "In my first months I waited until I understood the whole picture before I said anything. By the time I did, the group had moved on twice. So I learned to write instead, and about half of what I wrote never reached the meeting.",
            cite: "Composite staff perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-11-3-check",
            question: "A workgroup decides by informal consensus: the facilitator states what the group seems to think, and the group moves on unless someone objects. What is the clearest problem with this method?",
            options: [
              { text: "It is too slow for a group that only meets monthly.", correct: false },
              { text: "It treats silence as agreement, which rewards speed and confidence and quietly excludes anyone still thinking, anyone reluctant to disagree with a supervisor present, and anyone who contributes in writing.", correct: true },
              { text: "It is acceptable as long as the facilitator remembers to ask whether anyone objects.", correct: false },
              { text: "It should be replaced with a majority vote in every case.", correct: false },
            ],
            feedbackCorrect: "Yes. Silence carries many meanings and agreement is only one of them. A stated method — a written round, a poll a day later, or a named decision maker deciding after hearing everyone — is fairer and much easier to explain.",
            feedbackIncorrect: "Ask what silence is being taken to mean here, and who is most likely to be silent. Then ask whether the method was stated before the discussion, so people knew what their contribution was for.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: in the meetings you attend, what does your own silence usually mean? Consider that the people you read as having nothing to add may be running exactly the same calculation.",
          },
        ],
      },
      {
        id: "ipe-11-4",
        number: 4,
        title: "Your inclusive-meeting plan",
        summary: "The planning checklist: eight lines filled in before the invitation goes out, kept with the agenda, and written so someone else could pick it up.",
        minutes: 10,
        learning: {
          objective: "Complete an inclusive-meeting planning checklist for one real meeting you own, naming the purpose, the access arranged in advance, materials and lead time, facilitation and decision method, cost, and who owns each line.",
          takeaways: [
            "A planning checklist is not paperwork. It is the memory of a meeting series, and filled in once and kept with the agenda it survives a staffing change.",
            "Most lines on it cost nothing and need nobody's permission: earlier materials, a named contact, a break, a written round, a report-back.",
            "The lines that cost money — interpreting, captioning, translation, travel, compensation for advisors who are not staff — need a budget named before the invitation, not a discussion afterward.",
            "Engagement is a series, not an event. What you learn from one session belongs in the plan for the next one, which is the only way a plan improves.",
          ],
          evidence: "A scenario about four regional engagement sessions with no money set aside for access, a planning checklist you fill in for one real meeting, a knowledge check on what makes a checklist line complete, and a private reflection.",
          appliedNextStep: "Fill the checklist in for the next meeting you own, keep it with the agenda rather than in your own files, and send one line to the people who attend saying what changed and why.",
        },
        scenario: {
          context: "Your unit is planning four regional engagement sessions on a program change, two in the metro area and two in greater Minnesota. The budget covers rooms, staff travel and light refreshments. Nothing is set aside for interpreting, real-time captioning, translated materials, or compensation for the community advisors who agreed to help shape the sessions. The first invitation is due to go out in three weeks.",
          prompt: "Where does the planning start?",
          options: [
            {
              label: "Send the invitations on schedule and handle access arrangements as requests come in, so money is spent only on what people actually need.",
              response: "This guarantees that every request arrives late, and that some arrive after the money is committed elsewhere. It also reads, accurately, as a decision to fund the room before the participation.",
            },
            {
              label: "Fill in the planning checklist for all four sessions first — purpose, who must be able to take part, the access arranged by default, materials and lead time, facilitation, cost and the owner of each line — then take the funding gap to the person who can decide it, with a number attached.",
              response: "This is the order that works. The checklist turns a vague worry into a specific request, names who owns each item, and gets the money question answered before the invitation rather than in the middle of a session.",
              recommended: true,
            },
            {
              label: "Cut from four sessions to two so the existing budget can cover interpreting and captioning at the two that remain.",
              response: "A real tradeoff worth considering, but not first and not alone. Dropping the greater-Minnesota sessions to fund access at the metro ones trades one group's participation for another's. Price the full plan, then let the person who owns the budget make that call with the numbers in front of them.",
            },
          ],
        },
        transfer: {
          prompt: "Which meeting will you fill the checklist in for, and who else needs a copy?",
          options: [
            "Name the meeting and the day you will fill the checklist in",
            "Name the one line you cannot complete on your own, and the person who owns it",
            "Decide where the filled checklist will live, so the next person who runs the meeting finds it",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A checklist is a memory, not a formality",
            body: "<p>Most of what goes wrong in a meeting went wrong before anyone walked in, and it is usually the same handful of things: materials too late, no break, nothing arranged in advance, a decision method nobody stated, no report-back. That repetition is the good news. A short written plan, filled in once and kept with the agenda, catches nearly all of it.</p><p>The checklist below is ordered the way the decisions actually happen. Purpose first, because who must be able to take part follows from what the meeting is for. Access before the invitation, because the invitation is the request window. Materials and lead time next, because they are the most common failure and the cheapest fix. Then facilitation and decision method, because that is where the hour is won or lost. Then cost, because an unfunded arrangement becomes an argument at the worst possible moment. Then follow-up, which is what determines whether anyone comes back.</p><p>Keep it with the meeting rather than in your own files. A standing meeting outlives whoever set it up, and the next person inherits the design either way. They may as well inherit the reasoning behind it.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A planning checklist for one real meeting",
            summary: "Eight lines to fill in before the invitation goes out, kept with the agenda for whoever runs the meeting next.",
            fields: [
              { label: "Purpose and who must be able to take part", value: "One sentence on what this meeting is for and what will be decided. Then the people whose participation it depends on: staff, partner organizations, paid community advisors, and anyone the decision will land on." },
              { label: "Access arranged before invitations go out", value: "Interpreting and real-time captioning booked by default or on request, and which of the two. Room checked in person for a step-free route, sightlines, planned seating space and a restroom on the same floor. Online: captions tested on the actual setup and a written way to contribute." },
              { label: "Materials, formats and lead time", value: "Agenda with the purpose of each item, any document to be discussed, and any slide carrying real content, sent as text at least three working days ahead. Nothing essential exists only on a screen shared during the meeting." },
              { label: "Timing, length and breaks", value: "Hour and day chosen with the people who must attend, not only around staff calendars. A break in anything over an hour. A second sitting, or a written way in, for people who cannot come in the middle of a weekday." },
              { label: "Facilitation and decision method", value: "Contribution channels named at the start: spoken, written before, written during, sent within a couple of days afterward. Turn-taking decided in advance. Decision method stated before the discussion, with the decision maker named." },
              { label: "Cost, compensation and the owner of each line", value: "What interpreting, captioning, translation, travel and advisor compensation will cost, whose budget carries each one, and who is responsible for booking it, by name." },
              { label: "Invitation wording", value: "What the meeting is for, what access is already arranged, what else can be arranged, a named contact with a direct way to reach them, and the date after which some arrangements become hard." },
              { label: "Follow-up and report-back", value: "Who sends what, and by when: the decision, what happened to each contribution including the ones that changed nothing and why, and one line asking what should be different next time." },
            ],
            action: "Copy the eight lines into the notes for the next meeting you own, fill them in before the invitation goes out, and keep them with the agenda so the next person to run it starts from the same place.",
          },
          {
            type: "list",
            heading: "Changes that need nobody's permission",
            ordered: false,
            items: [
              "Send the agenda and any document as real text three working days ahead, with the purpose of each item written down.",
              "Put a break in anything longer than an hour, and say up front when it will be.",
              "Name the contribution channels at the start, including at least one that is not speaking.",
              "State the decision method before the discussion rather than after it.",
              "Say what a program abbreviation means the first time it is used, every time, without apologizing for it.",
              "Send a short note afterward saying what was decided and what happened to each contribution.",
              "Put a real contact name and a real date into the access line of your invitation template.",
            ],
          },
          {
            type: "flashcards",
            heading: "The five failures that repeat",
            cards: [
              { front: "Materials arrived the morning of", back: "<p>Nobody could prepare, translate, listen to it or raise it with anyone first. The people who already knew the content become the only people who can contribute.</p>" },
              { front: "Nothing was arranged in advance", back: "<p>Every access need turns into a request, every request is late, and the person asking carries the awkwardness of having asked.</p>" },
              { front: "Speed decided the outcome", back: "<p>The first confident position set the direction. Careful thinking arrived by email afterward and got read as a process problem rather than as the contribution it was.</p>" },
              { front: "No break, and no end time held", back: "<p>People with finite energy, medication schedules, care responsibilities or a long drive home left early, and the record shows them as not engaged.</p>" },
              { front: "No report-back", back: "<p>Participants never learned what their contribution changed. Attendance at the next session dropped, and the drop was explained as a lack of community interest.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Fund the participation, not only the room",
            control: "You control what goes into the plan, and what number sits next to it, before the invitation is sent.",
            failure: "Do not carry an unfunded access arrangement quietly and hope it works out. The cost of that lands on the person who asked, at the moment they are waiting for an answer.",
            next: "Price interpreting, captioning, translation and advisor compensation for your next session, and take the number to the person who owns the budget before the invitation goes out.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-11-4-check",
            question: "Which checklist entry is complete enough for a colleague to pick up and act on?",
            options: [
              { text: "Access: arrange accommodations as needed.", correct: false },
              { text: "Access: American Sign Language interpreters and real-time captioning booked by default for all four sessions; Maria in the program unit books them by the agreed date; the division training budget carries the cost; interpreters briefed with the agenda and program names a week ahead.", correct: true },
              { text: "Access: check with the community advisors about what they need before the first session.", correct: false },
              { text: "Access: the room is accessible and captions are available for the online option.", correct: false },
            ],
            feedbackCorrect: "Yes. It names the arrangement, the person responsible, the deadline, the budget and the preparation the interpreters need. Someone else could pick it up and finish it.",
            feedbackIncorrect: "A complete line names what is arranged, who does it, by when, whose budget pays, and what the arrangement needs in order to work. Asking people what they need is good practice and is not, by itself, an arrangement.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think of one meeting you run that people attend because they have to. If coming were genuinely optional, what would have to change for them to choose it — and which of those things is already yours to change?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Inclusive meetings and engagement",
    subtitle: "One page for anyone who schedules, facilitates or supports a meeting",
    quote: "Attendance is the easiest thing to count and the weakest evidence of participation.",
    use: {
      purpose: "Keep the planning order and the eight checklist lines in view while you set up a standing meeting, a workgroup session or a community engagement event.",
      remember: [
        "Every meeting already has a design. It was inherited rather than chosen, and it fits some people much better than others.",
        "The invitation is the request window. Nothing can be asked for earlier than the day the invitation arrives.",
        "For anything public or stakeholder-facing, arrange communication access before the invitation goes out, and ask the person what works rather than deciding for them.",
        "Materials as real text, three working days ahead, with the purpose of each item written down.",
        "Name the contribution channels and the decision method before the discussion, not after.",
        "Report back what happened to each contribution. That is what decides whether anyone comes again.",
        "Price interpreting, captioning, translation and advisor compensation while you plan, and name whose budget carries each line.",
      ],
      doNext: "Fill the checklist in for the next meeting you own, and keep it with the agenda rather than in your own files.",
    },
    sections: [
      {
        heading: "The planning checklist, in short",
        items: [
          "Purpose: what the meeting is for, what will be decided, and whose participation it depends on.",
          "Access before the invitation: interpreting and captioning, the room walked in person, the online setup tested.",
          "Materials: agenda with the purpose of each item, documents and slide content as text, three working days ahead.",
          "Timing: an hour and a day chosen with the people who must attend, a break in anything over an hour, a way in for people who cannot come midweek.",
          "Facilitation: contribution channels named at the start, turn-taking decided, decision method stated before the discussion.",
          "Cost: interpreting, captioning, translation, travel and advisor compensation priced, with a named budget and a named booker for each.",
          "Invitation: purpose, what is arranged, what else can be arranged, a named contact, and a date.",
          "Follow-up: the decision, what happened to each contribution, and an invitation to say what should change next time.",
        ],
      },
      {
        heading: "In the hour itself",
        items: [
          "Say how people can contribute, including at least one channel that is not speaking.",
          "State the decision method before the discussion opens, and name who decides.",
          "Leave a longer pause after a question than feels comfortable to you.",
          "Hold your own summary until after the last contribution, not after the first three.",
          "Say what each program abbreviation means the first time it is used.",
          "Take the break you promised, on time.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Communications and training staff, who design the sessions, write the invitations and own the templates everyone else reuses — a useful place to start.",
          "Supervisors and managers, who set the standing meetings, hold the budget conversations and decide how decisions get made — a useful place to start.",
          "Administrative and support staff, who book the rooms, arrange the interpreters, send the materials and see every commitment that quietly disappears — a useful place to start.",
          "Policy, program, fiscal, contracts, data and engagement staff, whose workgroups and stakeholder sessions are where most of this either works or does not.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Accessible public communications",
          "Language access in state programs",
          "Equitable stakeholder partnership",
          "Responding to concerns and feedback",
          "Cross-division coordination",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, including guidance for state agencies on accessible public meetings and events." },
    { title: "ADA.gov, Effective communication", href: "https://www.ada.gov/resources/effective-communication/", note: "U.S. Department of Justice guidance on the Title II effective-communication obligation, auxiliary aids and services, and primary consideration of the person's expressed preference." },
    { title: "Minnesota IT Services, Accessibility", href: "https://mn.gov/mnit/about-mnit/accessibility/", note: "Minnesota's accessibility standard for state digital content, including the Web Content Accessibility Guidelines it follows and practical guidance for documents, presentations and online events." },
    { title: "W3C Web Accessibility Initiative, How to make your presentations accessible to all", href: "https://www.w3.org/WAI/teach-advocate/accessible-presentations/", note: "Practical checklists for accessible meetings, presentations and online events: the venue, the speakers, the slides and the recording." },
    { title: "W3C Web Accessibility Initiative, Involving users in web projects for better, easier accessibility", href: "https://www.w3.org/WAI/planning/involving-users/", note: "Why involving disabled people early produces better results than testing at the end, and how to plan that involvement." },
    { title: "Minnesota Department of Human Services, Deaf and Hard of Hearing Services", href: "https://mn.gov/deaf-hard-of-hearing/", note: "Minnesota's division serving Deaf, DeafBlind and hard of hearing residents, including information on interpreting and communication access." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including language assistance, community engagement and partnership practices." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
