import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Public-service practice · Module 17: Responding to concerns and feedback.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-17-responding-to-feedback",
    indexNumber: 1159,
    seriesLabel: "Intercultural Practice and Equity · Public-service practice",
    title: "Responding to Concerns and Feedback",
    subtitle: "Concerns rarely arrive labeled as concerns. Four lessons on receiving one without defending the process, reading a single account as evidence, repairing what you can, and running the conversation you did not schedule.",
    scope: "For internal DHS and DSD staff who receive concerns, complaints and critical feedback about the division's programs, processes, communications and decisions: quality, compliance and performance staff; supervisors and managers; administrative and support staff; policy, program and operations staff; and communications, training and engagement staff. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and card practice, private reflection prompts, and a feedback-response conversation guide you can copy and run",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/intercultural-conflict-styles.jpg",
    coverAlt: "Two colleagues sit across a table with papers between them, in a serious conversation.",
    introTranscript: "Almost nobody in public administration is trained to be criticized. We are trained to document, justify and defend decisions, which is a reasonable thing to ask of people who spend public money — and it is also the exact reflex that makes a concern disappear. This module is about the few minutes after a concern lands, before anyone knows whether it is accurate. It covers the moves that end the conversation early, what one account can honestly tell you about a process that ran the same way for everyone else, the difference between explaining and repairing, and what you can promise without overstepping. It ends with a conversation guide you fill in before the meeting and finish after it.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Recognize the defensive first moves that end a conversation about a concern early, and receive an account fully before deciding whether it is accurate.",
        "Use a single concern as evidence about a step in a process — who else met that step, and what the division already counts about them.",
        "Distinguish acknowledgment, explanation, repair and change in a response, and say what you can promise and who decides the rest.",
        "Name the formal routes that exist alongside an informal conversation, plainly and without steering a person toward or away from them.",
        "Run one real feedback-response conversation using a written guide, and send the follow-up contact on a date you set before the conversation began.",
      ],
      evidence: [
        "Four worked scenarios drawn from communications, quality oversight, supervision and community engagement, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates four kinds of concern, and that separates acknowledgment, repair, change and routing.",
        "A completed feedback-response conversation guide for one real conversation, with a follow-up date already in your calendar.",
      ],
      appliedNextStep: "Take one concern your unit received in the last quarter that never got a second contact. Find out what actually happened to it, and send that second contact — including if the honest answer is that nothing changed.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in DHS appeal, grievance or complaint-handling procedures, or in which offices receive them",
        "A change in ADA Title II grievance-procedure or effective-communication requirements, or in Title VI language-access obligations that affect how a concern must be received and answered",
        "Feedback from community organizations, families or division staff that a scenario does not match how concerns actually reach and move through this work",
      ],
      relatedDoor: "Formal complaints, appeals and hearings, discrimination charges, licensing concerns and personnel determinations belong to the responsible DHS appeals, civil rights, licensing and human resources offices and to the independent state offices named in this module; this course prepares the conversation, it does not decide a case.",
      toolkitQuestion: "If harm or exclusion occurred here, what would accountability and repair actually require — and which part of that is mine to do?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-17-1",
        number: 1,
        title: "What happens when the concern arrives",
        summary: "The first few minutes, the five moves that end the conversation early, and why receiving an account is not the same as agreeing with it.",
        minutes: 11,
        learning: {
          objective: "Recognize the defensive first moves that commonly end a conversation about a concern, and describe what receiving a concern requires before deciding whether it is accurate.",
          takeaways: [
            "Most concerns arrive informally — a listening-session comment, a survey line, a partner email, a colleague's remark — and reach a formal route only after they have already been said somewhere easier to ignore.",
            "Receiving is not agreeing. Taking an account fully, in the person's own words, is a separate act from deciding whether the process ran the way they describe.",
            "Five first moves end the conversation early: correcting the facts, explaining the constraint, citing the policy, calling it unusual, and explaining the person. Each can be perfectly true and still cost you the information.",
            "The defensive reflex is a system behavior inside an agency built to justify decisions, not a character flaw. Naming it that way makes it possible to interrupt.",
          ],
          evidence: "A scenario about replying to a community organization, a knowledge check on first responses in a unit meeting, and practice cards for the four parts of receiving.",
          appliedNextStep: "The next time a concern reaches you in any form, write the person's own words down before you write any of your own, and reply with what you will do next and when — not with an explanation.",
        },
        scenario: {
          context: "A DSD communications lead receives an email from a culturally specific community organization two weeks after a program bulletin went out. The organization writes that the bulletin was confusing, that it arrived too late for the families it works with to act on, and that they learned about it only after it was published. The lead has drafted a reply explaining the clearance process and the timeline it required.",
          prompt: "What should the reply do first?",
          options: [
            {
              label: "Send the explanation. The clearance timeline is real, it is accurate, and the organization should understand the constraints the division works under.",
              response: "The explanation is true and it answers a question nobody asked. The organization said three things — the bulletin was unclear, it was late for their families, and they were told after the fact. A paragraph about clearance responds to none of them, and teaches them that the division's first concern was being understood rather than understanding.",
            },
            {
              label: "Reply with their three points restated in their own terms, two questions — what families needed to do, and what timing would have worked — what happens next and by when, and hold the explanation until later.",
              response: "This is the recommended move. It confirms that the concern was actually heard rather than processed, keeps the information coming, and commits to something specific without promising an outcome the lead cannot control.",
              recommended: true,
            },
            {
              label: "Apologize broadly and promise that the next bulletin will be earlier and clearer.",
              response: "Warm, and thin. It promises timing the lead may not control, skips the question of why the organization was not part of the drafting, and learns nothing about what actually made the bulletin unusable. A promise that vague is the kind people have heard before.",
            },
          ],
        },
        transfer: {
          prompt: "Think about the last concern that reached you about something your unit produces.",
          options: [
            "Write the concern again in the words the person actually used, not your summary of them",
            "Name which of the five first moves you reached for, and write the question you would ask instead",
            "Write the one sentence you will keep ready for the next time you feel an explanation rising",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A concern rarely arrives labeled as a concern",
            body: "<p>Some concerns arrive as a formal complaint with a number attached. Most do not. They arrive as a sentence at the end of a listening session, a line in a survey comment box, a message from a county partner who has given up on a form, a legislative inquiry that began as a phone call from a constituent, a provider association letter, or a colleague saying the notice does not make sense. By the time something reaches a formal route, it has usually been said three or four times in places that were easier to ignore.</p><p>That matters because the informal version is the cheap version. It arrives early, from someone still willing to talk to you, about a process that has not yet run the same way for a thousand more people. The formal version arrives late, in writing, with the relationship already strained and the record already set. A division that hears concerns only through formal routes is not a division with fewer problems. It is a division that has taught people not to bother.</p><p>The skill this module builds is narrow and specific: what you do in the first few minutes, before anyone knows whether the concern is accurate. Receiving is not agreeing. You can take someone's account completely, write it down in their words, and still not know whether the process worked the way they describe. The trouble starts when you settle that question in the first thirty seconds, because everything you do afterward is defending a conclusion instead of examining one.</p>",
          },
          {
            type: "tabs",
            heading: "Five first moves that end the conversation early",
            tabs: [
              { label: "Correct the facts", body: "<p>“That is not quite how the process works.” Often true. It also tells the person that the first thing you cared about was the accuracy of their account rather than what happened to them. If a factual correction is needed, it is needed later, after you understand what they experienced — and it lands very differently once they can see you were listening.</p>" },
              { label: "Explain the constraint", body: "<p>“The timing is set by the clearance process.” This explains why the division behaved as it did. It answers a question the person did not ask. They asked what happens to them now, and whether anything will be different for the next family.</p>" },
              { label: "Cite the policy", body: "<p>“The policy requires the verification.” A citation turns a conversation into a ruling. It is the right move when someone asks what the requirement is. It is the wrong move when someone is telling you that the requirement is unreachable from where they live.</p>" },
              { label: "Call it unusual", body: "<p>“That is not typical.” Perhaps not — but you cannot know that from one account, and saying it early makes the person argue about frequency instead of describing what happened. Frequency is your question to answer with evidence you already hold. It is not theirs to prove.</p>" },
              { label: "Explain the person", body: "<p>“They were already upset when they called.” This is the move that costs the most. It shifts the subject of the sentence from the process to the person, and once it has been said out loud in a unit, everyone else quietly stops bringing concerns forward.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "Why the reflex is so strong, and where this program is trying to move",
            items: [
              { title: "It is a system behavior, not a character flaw", body: "<p>Public agencies are built to be accountable for correctness. Staff are asked to document, justify and defend decisions, and are almost never rewarded for saying out loud that a process produced a bad result. The defensive reflex is what that training feels like from the inside. Naming it as a system behavior makes it far easier to interrupt than treating it as a personal failing — including your own.</p>" },
              { title: "Polarization: defending, or agreeing much too fast", body: "<p>This program uses the intercultural development continuum as its theory of change. In the polarization range, a criticism of the division feels like a criticism of us, and the response is defense. Its mirror form is just as unhelpful: agreeing instantly, apologizing for everything, and examining nothing. Both end the inquiry. These describe a moment in a conversation — never a label, a score or a record about any person.</p>" },
              { title: "Minimization: the two sentences to watch for", body: "<p>“We treat everyone the same” and “this is one person's experience” are the two most common minimization moves in a public agency. The first treats identical process as identical effect. The second treats a sample as a defect in the sample. Both are sincere, both sound reasonable in a meeting, and both make the concern disappear without anyone deciding to dismiss it.</p>" },
              { title: "Acceptance and adaptation: what actually changes", body: "<p>Further along the continuum, a concern becomes interesting rather than threatening. Acceptance sounds like genuine curiosity about what the person experienced and why it made sense from where they stood. Adaptation is the step after: changing the process, the format, the timing or the channel — not just the explanation of it. Integration shows up when this is simply how a unit works, and nobody has to push for it.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Receive first, decide second",
            control: "You control the order of your own moves: whether you take the account before you evaluate it.",
            failure: "Do not answer a concern in the same breath you hear it. A reply assembled in thirty seconds becomes a position you will spend the next month defending.",
            next: "The next time a concern reaches you, write it down in the person's own words before you write anything of your own, then read it back to them and ask what you got wrong.",
          },
          {
            type: "flashcards",
            heading: "Receiving, in four parts",
            cards: [
              { front: "Their words first", back: "<p>Write what the person said before you summarize it. Your summary is already an interpretation, and the words you replace are usually the ones carrying the point.</p>" },
              { front: "Two questions, not ten", back: "<p>What happened, step by step? What did you need to happen? Ten questions is an interview, and an interview tells the person they are being tested rather than heard.</p>" },
              { front: "Say what is next", back: "<p>Name what you will do, what you cannot decide, who does decide it, and when they will hear from you. Uncertainty is tolerable. Silence is not.</p>" },
              { front: "Put it where it survives", back: "<p>A concern that lives only in your memory disappears at your next vacation. Record it where the unit will still see it next quarter, with the date and what was promised.</p>" },
            ],
          },
          {
            type: "quote",
            text: "I did not want anyone punished. I wanted somebody to write down what happened, so the next family would not spend four weeks on it.",
            cite: "Composite family-member perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-17-1-check",
            question: "A staff member brings a concern to a unit meeting: a community partner says the new renewal notice is unreadable. Which first response keeps the most information in the room?",
            options: [
              { text: "Explain that the notice wording was cleared by several offices and cannot be changed quickly.", correct: false },
              { text: "Ask for the partner's exact words, what a reader was supposed to do with the notice, and whether anyone else has raised it — before deciding whether the notice is the problem.", correct: true },
              { text: "Note that the notice read well to staff, so this is probably one partner's preference.", correct: false },
              { text: "Ask the staff member to have the partner submit the concern in writing so it can be tracked properly.", correct: false },
            ],
            feedbackCorrect: "Yes. The account, the intended action and the pattern question all stay available, and nothing has been decided. That is the point.",
            feedbackIncorrect: "Each of the other replies settles the question before the information arrives. Notice how little is left to learn once the sentence ends — and, in the last one, how much work the partner has to do before anyone will listen.",
          },
        ],
      },
      {
        id: "ipe-17-2",
        number: 2,
        title: "One account, and what it says about the process",
        summary: "Who complains and who never does, why a single concern is the visible edge of a population, and the four questions that turn an account into evidence.",
        minutes: 11,
        learning: {
          objective: "Use a single concern as evidence about a process — naming the step involved, who else met that step, and what the division already counts — rather than treating it as an isolated incident.",
          takeaways: [
            "The people who raise concerns are the ones who had the time, the language, the connection and the belief that it would matter. A single concern is not the size of the problem; it is the visible edge of it.",
            "Four questions turn an account into evidence: which step of the process was involved, who else met that same step, what would have to be true for this to be a genuine one-off, and what the division already counts that would show it.",
            "Concerns come in different kinds — one interaction, a process working exactly as designed, a requirement set above the unit, or something that belongs to another office. Each kind has a different owner and a different fix.",
            "A high completion rate and a real barrier are not in conflict. The question is always who is in the remainder, and whether it is the same people every quarter.",
          ],
          evidence: "A quality-and-performance scenario reading three concerns against the unit's own numbers, a sorting exercise separating four kinds of concern, and a knowledge check on what one account can and cannot establish.",
          appliedNextStep: "Take one concern your unit has received and write the four evidence questions underneath it, then find out which of them the division can already answer from what it counts today.",
        },
        scenario: {
          context: "A DSD quality and performance unit has received three concerns in a quarter about a program renewal process: two from county partners, one from a family who missed a deadline. The unit's own count shows 94 percent of renewals completed on time, and that number has held steady for six quarters.",
          prompt: "How should the unit read these three concerns against its own numbers?",
          options: [
            {
              label: "Treat the three as normal variation. A 94 percent completion rate is strong, and three accounts cannot outweigh it.",
              response: "The rate describes how many renewals were completed, not what completion cost or who was left out. Three concerns is a count of people who spoke up, not a count of people affected — and in a program of any size, the remaining six percent is not three households.",
            },
            {
              label: "Find out who is in the remaining six percent — by county, by language, by whether the person had help, by whether the notice went out by mail only — and check whether the three concerns all describe the same step.",
              response: "This is the recommended move. It treats the three accounts as directions to look in rather than as a verdict, and it answers the question they raise using evidence the division already holds.",
              recommended: true,
            },
            {
              label: "Review the three cases individually, correct any errors found, and reply to each person.",
              response: "Necessary, and not sufficient. Correcting three cases repairs three situations and leaves the step that produced them running exactly as it did — which means the next three are already on their way.",
            },
          ],
        },
        transfer: {
          prompt: "Pick one concern your unit received in the last few months.",
          options: [
            "Name the exact step of the process it involves, not the program it involves",
            "Write down what the division already counts that would tell you who else met that step",
            "Name the person who would have to look, and what you will ask them for",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Who complains, and what that does to the evidence",
            body: "<p>Only some people complain. Complaining takes time, a phone that works, a language you share with the agency, some belief that speaking up will change something, and the confidence that it will not cost you the service you are already receiving. Every one of those is unevenly distributed. The people most affected by a barrier are frequently the least able to report it — which means the concerns that reach you are a biased sample, biased toward people with more resources and more trust, not fewer.</p><p>This inverts the usual instinct. When one person raises a concern, the instinct is to treat the number one as the size of the problem. The more accurate reading is that one person got through a filter most people do not get through. Ask what the filter was, and a single account starts pointing at a population.</p><p>The second instinct worth interrupting is the one that treats a concern as being about a program. Concerns are almost always about a step: the notice that went out by mail only, the deadline counted from a date nobody explained, the phone line that answers during the hours people are at work, the form field with no correct answer for a family like theirs. Naming the step gets you to an owner. Naming the program gets you to a meeting.</p>",
          },
          {
            type: "list",
            heading: "Four questions that turn an account into evidence",
            ordered: true,
            items: [
              "Which step of the process was this person actually standing in when it happened?",
              "Who else met that same step this month, and what do they have in common — county, language, transportation, whether anyone was helping them?",
              "What would have to be true for this to be a genuine one-off, and is it true?",
              "What does the division already count that would show this — completion dates, repeat calls, interpreter requests, appeals filed, applications started and abandoned?",
              "Who owns that step, and do they know this happened?",
            ],
          },
          {
            type: "sorting",
            id: "ipe-17-2-sort",
            heading: "What kind of concern is this?",
            categories: ["One interaction", "The process itself", "A requirement set above the unit", "Belongs to another office"],
            items: [
              { text: "A staff member gave a family the wrong deadline during one phone call.", category: "One interaction" },
              { text: "The renewal notice goes out by mail only, and there is no way to ask for it in another format.", category: "The process itself" },
              { text: "Everyone who calls after four in the afternoon reaches a recording with no callback option.", category: "The process itself" },
              { text: "The online form cannot be completed with the screen reader a person uses.", category: "The process itself" },
              { text: "The verification requirement comes from the program's governing rule and cannot be waived by the unit.", category: "A requirement set above the unit" },
              { text: "A person wants the eligibility decision itself reviewed and overturned.", category: "Belongs to another office" },
              { text: "A person says staff at a licensed provider treated them poorly during a visit.", category: "Belongs to another office" },
              { text: "A colleague listened carefully to a concern, apologized, and recorded it nowhere.", category: "One interaction" },
            ],
          },
          {
            type: "accordion",
            heading: "What the numbers can and cannot tell you",
            items: [
              { title: "A completion rate is not an experience", body: "<p>Ninety-four percent completed does not mean ninety-four percent found it workable. That figure includes the person who completed it after three calls, a day of lost pay and help from a neighbor. Completion measures the outcome the division needs. It does not measure what the person paid to produce it.</p>" },
              { title: "The remainder is a population, not an error rate", body: "<p>Six percent of a large program is not a rounding difference. Before deciding that a remainder is acceptable, find out who is in it. If the same counties, the same languages or the same living situations show up in the remainder every quarter, the rate is stable because the exclusion is stable.</p>" },
              { title: "Silence is the hardest evidence to read", body: "<p>A process with no complaints may be working well, or may have taught people that complaining is pointless or risky. Where a program serves people who depend on it, the absence of concerns is weak evidence of anything. Look instead at applications started and abandoned, repeat contacts, and the points where people drop out between steps.</p>" },
              { title: "Counting is not the same as asking", body: "<p>Some questions cannot be answered from records at all. What a notice made someone believe they had to do, why they stopped, what they thought would happen if they complained — those come from asking. Asking well usually means community organizations and advocates doing real work, with a scope and compensation, as advisors and co-designers rather than as a favor.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Name the step, not the program",
            control: "You control whether your write-up of a concern names a step with an owner, or a program with a committee.",
            failure: "Do not summarize a concern as “issues with the renewal process.” That sentence cannot be acted on, and it will survive three meetings without changing anything.",
            next: "Rewrite one open concern so it names the exact step, the people it stops, who owns that step, and the first thing that could change.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-17-2-check",
            question: "A program area receives one written concern about a new verification requirement. Which conclusion is best supported by that single account?",
            options: [
              { text: "One concern across thousands of transactions indicates the requirement is working as intended.", correct: false },
              { text: "The account identifies a step worth examining; the division should check who else met that step and what its own records already show about them.", correct: true },
              { text: "The requirement should be suspended until the concern is resolved.", correct: false },
              { text: "The concern reflects one person's preference and should be recorded without further review.", correct: false },
            ],
            feedbackCorrect: "Yes. A single account is a direction to look, not a verdict in either direction — and the evidence that settles it is usually evidence the division already holds.",
            feedbackIncorrect: "One account cannot prove a requirement is fine, and cannot by itself justify suspending it. What it can do is tell you exactly where to look, and what to look at.",
          },
        ],
      },
      {
        id: "ipe-17-3",
        number: 3,
        title: "Acknowledgment, repair and change are three different things",
        summary: "Why most responses stop at explanation, what you can honestly promise, and the second message that almost never gets sent.",
        minutes: 11,
        learning: {
          objective: "Distinguish acknowledgment, explanation, repair and change in a response to a concern, and state what you can promise, what you cannot, and who decides the rest.",
          takeaways: [
            "“We responded” usually means one of four different things. Acknowledgment names what happened. Explanation says why the process ran that way. Repair addresses this person's situation. Change alters the step so the next person does not arrive there.",
            "Most public-agency replies stop at explanation, because explanation is the easiest thing for a careful writer to produce. Explanation without repair reads as a defense, however well it is written.",
            "You can say plainly what is confirmed and that it should not have worked that way, without making a determination that belongs to a formal review. Findings about rights, discrimination, eligibility and licensing belong to the offices that make them.",
            "A promise is worth making only if it sits inside your own authority and carries a date. For everything else, name who decides, what they will consider, and when the person will hear.",
            "Most concerns die in the silence after the first reply. The second contact — what changed, or why nothing did — is the part that builds any trust at all.",
          ],
          evidence: "A supervisory scenario about a missed callback and a disputed account, a sorting exercise separating acknowledgment, repair, change and routing, and a knowledge check on what can honestly be promised.",
          appliedNextStep: "Take one concern your unit answered last quarter, find the reply that was actually sent, and mark which of the four it did. Then send the second contact that was never sent.",
        },
        scenario: {
          context: "A DSD supervisor learns that a family member told a program contact two things: that a staff member was dismissive on a call, and that the family was promised a callback that never came. The supervisor checks the record and finds no callback was made. The staff member remembers the tone of the call very differently.",
          prompt: "What is the most accountable response to the family?",
          options: [
            {
              label: "Explain that accounts of the call differ, that the staff member recalls it differently, and that the division cannot substantiate the concern about tone.",
              response: "Accurate and useless. It asks the family to prove their own experience, says nothing about the missed callback — which is not in dispute at all — and answers none of the questions they still have about their case.",
            },
            {
              label: "Say plainly what the record confirms about the missed callback and that it should not have worked that way, make the call today with the answer they were waiting for, handle the concern about tone through supervision without announcing a verdict, and tell the family what changes and by when.",
              response: "This is the recommended response. The confirmed part is acknowledged and repaired immediately, the disputed part goes where it belongs rather than being settled in front of the family, and the family leaves the conversation knowing what happens next.",
              recommended: true,
            },
            {
              label: "Apologize for the staff member's tone and tell the family that the staff member will receive additional training.",
              response: "It makes a determination the supervisor has not actually made, offers a person as the repair, and still leaves the family without the answer they were waiting for. It also teaches staff that raising a concern about a process will land on a colleague.",
            },
          ],
        },
        transfer: {
          prompt: "Find one reply your unit sent in response to a concern in the last quarter.",
          options: [
            "Mark which of the four it did: acknowledged, explained, repaired, changed",
            "Write the acknowledgment sentence it was missing, in plain words, naming what the process did",
            "Decide what the second contact should say, and send it this week",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Four things that all get called responding",
            body: "<p>When a unit says it responded to a concern, it can mean four quite different things, and the difference decides whether anything improves. <strong>Acknowledgment</strong> names what happened and says that it should not have worked that way. <strong>Explanation</strong> describes why the process ran as it did. <strong>Repair</strong> does something about this particular person's situation: reopening the application, extending the deadline, sending the document in a format they can use, arranging the interpreter that was never arranged. <strong>Change</strong> alters the step so the next person does not arrive at the same place.</p><p>Most replies stop at explanation, because explanation is the thing a careful public servant is most comfortable producing. It is defensible, it is accurate, and it requires nobody's approval. It also reads, on the other end, as a document about why the division was right. A person harmed by a process who receives three paragraphs about clearance timelines has learned something true about the agency's priorities, and it is not what the writer meant to teach.</p><p>The four are not a sequence you always complete. Some concerns need acknowledgment and repair and no process change at all. Some need a change and cannot be repaired for the person who raised it, because the deadline has passed and the requirement is set in law. What is not acceptable is a response that reaches only explanation and stops there, or one that promises a change nobody involved has the authority to make.</p>",
          },
          {
            type: "tabs",
            heading: "The four, and what each one asks of you",
            tabs: [
              { label: "Acknowledgment", body: "<p>Say what is confirmed, in plain terms, and say that it should not have worked that way. This does not require you to assign fault, and it is not a legal finding — those belong to formal review. It does require you to stop hedging. “We are sorry you had that experience” acknowledges nothing, because it makes the person's experience the subject of the sentence instead of the process.</p>" },
              { label: "Explanation", body: "<p>Useful when someone asks why, or when understanding a constraint genuinely helps them get what they need. Nearly always harmful as the first thing you say. Hold it until after acknowledgment and repair, and then ask yourself honestly whether anyone wants it.</p>" },
              { label: "Repair", body: "<p>Do something about this person's situation now, with the authority you already have: reopen, extend, redo, re-send in a usable format, arrange the interpreter, make the call yourself today. Repair is where most staff have far more room than they believe. Find out what your room actually is before you assume there is none.</p>" },
              { label: "Change", body: "<p>Alter the step so the next person does not arrive at the same place. This is the only one of the four that reduces the number of future concerns, and the only one that requires an owner, a date and a way of checking. Without it, the same concern returns later with a different name on it.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-17-3-sort",
            heading: "Which move is this sentence?",
            categories: ["Acknowledgment", "Repair", "Change", "Route to the office that decides"],
            items: [
              { text: "“The callback we promised on the sixth did not happen. That is not how this is supposed to work.”", category: "Acknowledgment" },
              { text: "“What you have described is what our record shows, and I am not going to ask you to prove it again.”", category: "Acknowledgment" },
              { text: "“I am calling you today with the answer you were waiting for, and I will send it in large print as you asked.”", category: "Repair" },
              { text: "“I have extended your deadline by two weeks so the missed call does not cost you the service.”", category: "Repair" },
              { text: "“We are putting promised callbacks in the same record as the request, so one cannot be promised without being tracked.”", category: "Change" },
              { text: "“We are rewriting the notice so the deadline says what date it is counted from.”", category: "Change" },
              { text: "“If you want the eligibility decision itself reviewed, here is how to request an appeal, and I can send you the form.”", category: "Route to the office that decides" },
              { text: "“A concern about how a licensed provider treated you goes to the licensing office. Here is their contact, and I will stay available to you.”", category: "Route to the office that decides" },
            ],
          },
          {
            type: "list",
            heading: "What you can promise, and what you cannot",
            items: [
              "Promise what is inside your own authority, with a date: a call back by Thursday, a notice re-sent in a format they use, a deadline you can actually extend.",
              "Promise the routing, not the outcome: that a question will reach the office that decides it, by when, and that you will tell them what came back.",
              "Do not promise a policy change, a rule change, or a decision that belongs to a review body. Say who decides, what they will consider, and when the person will hear.",
              "Do not promise that a particular employee will be disciplined or retrained. Supervision happens, and it is not a bargaining chip or a public commitment.",
              "Say plainly when you do not know. “I do not know yet, I will know by Friday, and I will tell you either way” is a far better promise than a confident guess.",
              "Name the formal routes that exist — appeal and hearing rights, the grievance route and its coordinator, the independent ombudsman office, the state human rights process — without steering the person toward or away from them. Some of those notices are required by law; a good conversation with you does not replace any of them.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Send the second message",
            control: "You control whether the person ever hears what happened after your first reply.",
            failure: "Do not let a concern end in silence because the answer is unimpressive. “We looked at this, here is what we found, and here is why we are not changing it” is a real answer. Nothing is not.",
            next: "Pick one concern from the last quarter that never received a second contact, find out what actually happened to it, and send that message this week.",
          },
          {
            type: "quote",
            text: "The apology was fine. What I remember is that four months later somebody emailed to say the form had been fixed. Nobody made them do that.",
            cite: "Composite community-partner perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-17-3-check",
            question: "A supervisor has confirmed that a promised callback never happened, and a family also says the earlier call was dismissive. The staff member remembers that call differently. Which response is both honest and accountable?",
            options: [
              { text: "Tell the family that accounts differ and the division cannot substantiate the concern about tone.", correct: false },
              { text: "Confirm plainly what the record shows about the missed callback, repair it now, address the concern about tone through supervision without announcing a verdict, and tell the family what changes and by when.", correct: true },
              { text: "Apologize for the staff member's tone and tell the family the staff member will receive additional training.", correct: false },
              { text: "Ask the family to put both concerns in writing so they can be reviewed formally.", correct: false },
            ],
            feedbackCorrect: "Yes. The confirmed part is acknowledged and repaired, the disputed part is handled where it belongs, and the family leaves knowing what happens next.",
            feedbackIncorrect: "Look for the response that separates what is confirmed from what is disputed, repairs the confirmed part immediately, and does not announce a finding in either direction in front of the family.",
          },
        ],
      },
      {
        id: "ipe-17-4",
        number: 4,
        title: "A conversation guide you can run",
        summary: "The practical tool: six things to settle before a difficult conversation, the sentences that keep it open, and the follow-up date you write down first.",
        minutes: 11,
        learning: {
          objective: "Prepare and run a feedback-response conversation using a written guide that covers preparation, access, receiving, the limits of your authority, and the follow-up contact.",
          takeaways: [
            "A conversation guide is not a script. It holds the practical things people forget under pressure: how the person wants to take part, what you are actually allowed to decide, and when they will hear from you again.",
            "Access and language belong in the preparation, not in the recovery. Offer interpreting, a format and a choice of setting before the person has to ask for any of it.",
            "Have one sentence ready for the moment an explanation starts to rise: a question that returns the conversation to what happened.",
            "Do not hand the design work to the people who did the unpaid work of noticing the problem. Asking someone to propose the fix is reasonable only if they want to, with a scope and compensation as advisory work.",
            "The guide ends where most responses end too early: the second contact, on a date written in your calendar before the first conversation began.",
          ],
          evidence: "A conversation guide you can copy and adapt, a scenario about preparing to meet a community organization, a knowledge check on preparation, and private reflection prompts that are never collected.",
          appliedNextStep: "Copy the guide, fill it in for one real conversation you have coming up, and put the second-contact date in your calendar before the first conversation happens.",
        },
        scenario: {
          context: "A DSD program manager has agreed to meet a culturally specific community organization that wrote to say a new service application is unusable for the families it works with — and that it raised this during an engagement session months earlier and never heard back. The manager has ninety minutes, a colleague who would like to attend, and a draft explanation of the application's design constraints.",
          prompt: "What should the manager settle before the meeting?",
          options: [
            {
              label: "The explanation: a clear, well-organized account of why the application is built the way it is, so the meeting can start from shared facts.",
              response: "The explanation will be needed at some point, and leading with it announces that the purpose of the meeting is to be understood rather than to understand. It also skips what the organization is most likely to raise first, which is the silence after the earlier session.",
            },
            {
              label: "How the organization wants to meet — setting, interpreting, who attends on each side, what will be shared afterward — what the manager can decide alone, and what actually happened to the earlier feedback, including a plain account if the answer is that it was lost.",
              response: "This is the recommended preparation. It settles access before the conversation rather than after, keeps the numbers of people from becoming lopsided, and brings an honest answer to the question that is certain to come first.",
              recommended: true,
            },
            {
              label: "A list of the changes the organization should propose, so the meeting produces concrete recommendations.",
              response: "This hands the design work to people who have already done the unpaid work of noticing the problem. If the organization is going to shape the redesign, that is advisory work with a scope and compensation, agreed separately — not an expectation dropped on them inside a ninety-minute meeting.",
            },
          ],
        },
        transfer: {
          prompt: "Think about one conversation about a concern that you have coming up, or one you have been avoiding.",
          options: [
            "Write down what you can decide alone, what needs someone else, and exactly who that someone is",
            "Write the one question you will ask when you feel an explanation rising",
            "Put the follow-up date in your calendar now, before the first conversation happens",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What the guide is for",
            body: "<p>Under pressure, people do not forget their values. They forget the practical things: to ask how someone wants to meet, to find out beforehand what they are allowed to offer, to say when the person will hear from them again. A conversation guide is a short written answer to those questions, prepared while you are calm, so the version of you being criticized does not have to invent one.</p><p>It is not a script and should not be read aloud. A script makes a conversation sound procedural at exactly the moment a person needs it to sound like someone is listening. What the guide holds is the six things that get lost: what you know and do not know going in, how the person wants to take part, how you will open, how you will receive without interviewing, what you can and cannot decide, and the date of the second contact.</p><p>The guide below is built for a conversation with someone outside the division — a family member, a community organization, a county or provider partner. Nearly all of it works for a concern raised by a colleague, a supervisor or another division too, with one adjustment: internal conversations tend to skip acknowledgment entirely and jump to the fix, and the acknowledgment line is the part worth keeping.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A feedback-response conversation guide",
            summary: "One page to fill in before a conversation about a concern, and to finish after it.",
            fields: [
              { label: "Before the conversation", value: "What I know, and where it came from. What I do not know. What has already been promised to this person, by whom, and whether it happened. What went wrong the last time we talked, if there was a last time — and a plain account of it, including if the answer is that their feedback was not carried forward." },
              { label: "How the person wants to take part", value: "Asked in advance, not waited for: setting and time; phone, video or in person; interpreting or other language support; materials in a format they use; who they want with them; whether they want a written summary afterward and in what form." },
              { label: "What you will say first", value: "Purpose in one sentence. How long we have. Who is here and why. What I can decide today. What I will do with what I hear. Then the acknowledgment line, if something is already confirmed: what happened, and that it should not have worked that way." },
              { label: "How you will receive it", value: "Two questions: what happened, step by step, and what did you need to happen. Their words written down before I summarize. Reflect back and check — have I got this right, what did I miss? No interview, and no asking them to produce documentation to justify the concern." },
              { label: "What you can decide, and what you cannot", value: "Inside my authority, with a date. Outside it: who decides, what they will consider, when the person will hear. The formal routes that exist, named plainly and without steering — appeal and hearing rights, the grievance route and its coordinator, the independent ombudsman office, the state human rights process." },
              { label: "The second contact", value: "The date I will come back to them, written in my calendar before this conversation starts and said out loud during it. What I will report: what changed, what did not, and why. Sent even when the honest answer is that nothing changed." },
            ],
            action: "Copy the six fields into a one-page note. Fill the first three before your next difficult conversation and the rest during it, and put the second-contact date in your calendar before you start.",
          },
          {
            type: "list",
            heading: "Sentences worth having ready",
            items: [
              "“Tell me more about what happened at that point.” Use it the moment you feel an explanation rising.",
              "“Let me read back what I have, and you tell me what I got wrong.”",
              "“I can decide this part today. This other part is not mine, and here is who decides it.”",
              "“I do not know yet. I will know by Friday, and I will tell you either way.”",
              "“That should not have worked that way.” When something is confirmed, say it in plain words and stop hedging.",
              "“What would have made this work for you?” Asked as a real question, with the understanding that designing the fix is separate, scoped, compensated work.",
              "Worth avoiding: “I am sorry you feel that way,” “that is not typical,” “the policy requires it,” and anything that opens by correcting their account.",
            ],
          },
          {
            type: "accordion",
            heading: "Preparing yourself, not only the meeting",
            items: [
              { title: "Settle your own authority before anyone asks", body: "<p>Most of the pressure in these conversations comes from not knowing what you are allowed to offer. Find out beforehand what you can extend, waive, reopen, re-send or arrange without approval. Staff routinely have more room here than they assume, and the moment to discover it is not while a person is sitting in front of you waiting for an answer.</p>" },
              { title: "Bring the right number of people", body: "<p>Three staff and one family member is not a conversation; it is a panel. Match the numbers roughly, tell the person in advance who will be there and why, and ask whether they want anyone with them. If an interpreter is working, plan for the extra time that good interpreting takes and speak to the person, not to the interpreter.</p>" },
              { title: "Separate the person from the process, out loud", body: "<p>If an employee's conduct is part of the concern, that part is supervision and will not be settled in this meeting. Say so plainly: “I am not going to discuss a personnel matter with you, and I am going to take what you told me seriously.” Then keep both halves of that sentence.</p>" },
              { title: "Expect the first question to be about the silence", body: "<p>If this concern has been raised before and nothing visibly happened, that is what will come up first. Have a true answer ready, including “it was not carried forward, and here is how I know.” An honest account of a failure is recoverable. A vague one confirms everything the person already suspected.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Write the follow-up date before the conversation",
            control: "You control one thing completely: whether a date for the second contact exists in your calendar before you walk in.",
            failure: "Do not end a difficult conversation with “I will be in touch.” It is the sentence people have heard before, and it is a large part of why they stopped raising things.",
            next: "Before your next conversation about a concern, put the follow-up date in your calendar and say the date out loud during the meeting.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone. Nothing here is collected, scored or seen by anyone. Bring one recent concern to mind and sit with these: How might my role, authority or language have shaped how that conversation went? Who could have been helped, burdened, excluded or misunderstood by the way we responded? Whose expertise was missing from the room? And if harm or exclusion did occur, what would accountability and repair actually require — which part of that is mine to do, and which part have I been waiting for someone else to start?",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-17-4-check",
            question: "You are preparing to meet a family who raised a concern about a service decision. Which preparation step does the most to make the conversation useful?",
            options: [
              { text: "Drafting a clear written explanation of the policy, so the family understands the constraints from the start.", correct: false },
              { text: "Finding out in advance how the family wants to meet, what language support they need, and what you are able to decide without approval.", correct: true },
              { text: "Inviting two colleagues who know the program well, so every question can be answered on the spot.", correct: false },
              { text: "Asking the family to send their concerns in writing first, so the meeting can be efficient.", correct: false },
            ],
            feedbackCorrect: "Yes. Access, setting and the limits of your own authority are the three things that decide whether the conversation can go anywhere, and all three have to be settled beforehand.",
            feedbackIncorrect: "Each of the others prepares the division's side of the meeting. Only one of them prepares the conditions the family needs in order to take part at all.",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Responding to concerns and feedback",
    subtitle: "One page for the conversation you did not schedule",
    quote: "Receive first. Repair what you can. Say what changed, even when the answer is that nothing did.",
    use: {
      purpose: "Keep the order of moves in view when a concern reaches you: what to do in the first few minutes, what a single account is evidence of, what you can honestly promise, and when the person hears from you again.",
      remember: [
        "Receiving is not agreeing. Take the account in the person's own words before deciding whether it is accurate.",
        "Five moves end the conversation early: correcting the facts, explaining the constraint, citing the policy, calling it unusual, explaining the person.",
        "One concern is the visible edge of a population, not the size of the problem. Name the step, then find out who else met it.",
        "Acknowledgment, explanation, repair and change are four different things. Most replies stop at the second one.",
        "Promise only what sits inside your authority, with a date. For the rest, name who decides and when the person will hear.",
        "The second contact is the part that builds trust. Send it even when nothing changed.",
      ],
      doNext: "Take one concern from the last quarter that never got a second contact, find out what actually happened to it, and send that message this week.",
    },
    sections: [
      {
        heading: "In the first few minutes",
        items: [
          "Write their words before you write yours, then read them back and ask what you got wrong.",
          "Ask two questions, not ten: what happened, step by step, and what did you need to happen.",
          "Say what you will do, what you cannot decide, who does decide it, and when they will hear.",
          "Record it where the unit will still see it next quarter, with the date and what was promised.",
          "Hold the explanation. It answers a question almost nobody has asked yet.",
        ],
      },
      {
        heading: "The conversation guide, in short",
        items: [
          "Before: what I know and where it came from, what I do not know, what was already promised, and what happened the last time we talked.",
          "Access: setting, time, interpreting, format, who attends on each side, what is shared afterward — offered in advance, not waited for.",
          "Open: purpose in one sentence, time available, who is here and why, what I can decide today, and the acknowledgment line if something is already confirmed.",
          "Receive: two questions, their words written down, reflect back and check. No interview, no request for documentation to justify the concern.",
          "Decide: what is inside my authority with a date; for the rest, who decides, what they will consider, and the formal routes that exist, named without steering.",
          "Close: the second-contact date, written in my calendar before the conversation and said out loud during it.",
        ],
      },
      {
        heading: "What you can honestly promise",
        items: [
          "A specific action inside your own authority, with a date on it.",
          "The routing: that a question reaches the office that decides it, by when, and that you will report back what came of it.",
          "An honest “I do not know yet, and here is when I will.”",
          "Not a policy or rule change, and not a decision that belongs to a review body — say who decides instead.",
          "Not that a particular employee will be disciplined or retrained. Supervision is not a bargaining chip.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Quality, compliance and performance staff, who see concerns as evidence about a process rather than as cases to close — a useful place to start.",
          "Supervisors and managers, who decide what a unit does with a complaint and whether staff keep bringing them forward — a useful place to start.",
          "Administrative and support staff, who receive the first version of most concerns, at the front desk and on the phone — a useful place to start.",
          "Policy, program and operations staff, who own the steps that concerns are usually about.",
          "Communications, training and engagement staff, who write the replies and hold the relationships that a poor response costs.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Accessible public communications",
          "Language access in state programs",
          "Inclusive meetings and engagement",
          "Equitable stakeholder partnership",
          "Cross-division coordination",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Content and writing guidelines", href: "https://mn.gov/dhs/digital-showcase/content-guidelines/", note: "The department's own editorial guidance on first-read understanding, familiar terms and writing suited to the reader — the standard a written reply to a concern is held to." },
    { title: "Minnesota Department of Human Services, Appeals", href: "https://mn.gov/dhs/general-public/appeals/", note: "Public information on the department's appeals and hearing process — the formal route that exists alongside an informal conversation, and that a conversation never replaces." },
    { title: "Minnesota Ombudsman for Mental Health and Developmental Disabilities", href: "https://mn.gov/omhdd/", note: "The independent state office that assists people receiving services for mental illness, developmental disabilities and related conditions, and that reviews complaints about services." },
    { title: "Minnesota Department of Human Rights", href: "https://mn.gov/mdhr/", note: "The state agency that enforces the Minnesota Human Rights Act and receives discrimination charges — one of the formal routes worth naming plainly when a concern involves discrimination." },
    { title: "ADA.gov, State and local governments (Title II)", href: "https://www.ada.gov/topics/title-ii/", note: "U.S. Department of Justice guidance on what a state or local government program must provide, including grievance procedures, effective communication and accessible programs and services." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the standard on conflict and grievance resolution processes designed to identify and resolve concerns across cultures and languages." },
    { title: "PlainLanguage.gov, Federal plain language guidelines", href: "https://www.plainlanguage.gov/guidelines/", note: "Guidance on audience, organization, useful headings and sentence structure — applied here to the reply a person receives after raising a concern." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
