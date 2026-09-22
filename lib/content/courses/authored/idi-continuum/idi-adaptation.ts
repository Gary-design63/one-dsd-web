import type { CoursePack } from "../../source-types";

// Program intercultural development continuum, stage 5 of 6: Adaptation.
// The program's continuum draws on the five orientations the IDI measures (Hammer, M. R. (2011).
// The Intercultural Development Inventory. IDI, LLC.) plus Integration from Bennett, M. J. (1993).
// Developmental Model of Intercultural Sensitivity. A licensed IDI assessment does not measure Integration.
const pack: CoursePack = {
  course: {
    id: "idi-adaptation",
    indexNumber: 1141,
    seriesLabel: "Intercultural Development Continuum · Stage 5 of 6",
    title: "Adaptation: Genuinely Shifting Your Frame",
    subtitle: "Adaptation is where someone can deliberately shift their own perspective and behavior to bridge across a real cultural difference — not performing politeness, but actually seeing and communicating from more than one cultural frame.",
    scope: "For all DHS staff, whether or not they have taken the IDI, including staff ready to build the skill of shifting frames beyond treating sameness as fairness. This module is based on the Intercultural Development Continuum concept, not the licensed IDI instrument, and it does not assess anyone: no orientation, result, or stage is ever inferred about, recorded for, or attached to any person. This is a skill to practice, not a status to claim.",
    treatment: "Four short lessons with scenarios, personal reflection questions, suggestive practices, and knowledge checks",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-06.jpg",
    coverAlt: "A colleague presenting to two others at a whiteboard during a meeting.",
    introTranscript: "Adaptation is where cultural understanding turns into actual skill. Past Minimization's \"we're all the same underneath,\" and past Acceptance's genuine curiosity and respect for difference, Adaptation is being able to deliberately shift how you communicate, structure a meeting, or read a situation — based on the specific cultural frame of the person in front of you — without losing your own identity in the process. It is code-switching with intention, not just for one's own comfort but to actually meet someone else where they are.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe Adaptation as the deliberate ability to shift perspective and behavior across a real cultural frame.",
        "Distinguish genuine Adaptation from performed politeness or surface-level accommodation.",
        "Practice naming a specific frame-shift you could make in a real DHS scenario.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits this stage.",
        "One knowledge check on what separates Adaptation from earlier stages.",
      ],
      appliedNextStep: "Identify one upcoming interaction where you could deliberately adjust your communication style — pace, directness, formality — to fit the other person's frame rather than your own default, and try it.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.; Bennett, M. J. (1993). Developmental Model of Intercultural Sensitivity.",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Feedback that this module reads as endorsing code-switching that erases someone's own identity rather than adding a skill", "A revision to the licensed IDI framework's published stage descriptions"],
      relatedDoor: "This module describes a general developmental orientation from published intercultural-development research. It never assigns any specific person to a stage, and it is not a substitute for a licensed IDI assessment and a qualified debrief.",
      toolkitQuestion: "Am I actually shifting my frame to meet this person, or performing a gesture that costs me nothing?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "idi-adaptation-1",
        number: 1,
        title: "Adaptation",
        summary: "Genuinely Shifting Your Frame. Adaptation is where someone can deliberately shift their own perspective and behavior to bridge across a real cultural difference",
        minutes: 20,
        learning: {
          objective: "Describe Adaptation as a deliberate skill and practice naming a real frame-shift.",
          takeaways: [
            "Beyond respecting difference (Acceptance) to actually building skill in bridging it",
            "Deliberate shifts in communication style, pace, formality, or structure — not performance",
            "Requires holding your own identity while genuinely adopting another frame temporarily",
            "Different from code-switching for self-protection; this is code-switching to actually connect",
            "A practiced skill that improves with real, repeated cross-cultural interaction",
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one upcoming interaction and deliberately plan one frame-shift — pacing, directness, or formality — before you walk in.",
        },
        scenario: {
          context: "A supervisor, Priya, is preparing to deliver difficult feedback to two team members from different backgrounds — one who has told her directly that she prefers blunt, immediate feedback, and one who has told her that public or overly direct feedback feels disrespectful and prefers a private, relationship-first conversation. Priya has one feedback template she uses for everyone.",
          prompt: "How should Priya proceed?",
          options: [
            { label: "Use the same template and delivery for both, since consistency is fair.", response: "Consistent process is not the same as effective communication. Applying identical delivery regardless of stated preference ignores real information both employees have given her." },
            { label: "Deliver blunt, direct feedback to both, since that is Priya's own natural style and being direct is honest.", response: "This mistakes Priya's own comfort for a neutral default and overrides a clearly stated preference from one team member." },
            { label: "Keep the same substantive feedback for both, but deliver it directly and immediately to the first employee and privately, relationship-first, to the second — based on what each has told her works.", response: "This is Adaptation in practice: the content stays the same and stays honest, but the delivery deliberately shifts to fit each person's stated frame, not Priya's default.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think of a real relationship — at work or outside it — where you've deliberately adjusted how you communicate to fit the other person's style, without losing what you actually needed to say. What made that adjustment possible?",
          options: ["Adaptation requires holding two things at once: your own identity and someone else's frame. Where do you find that hardest to do?", "Have you ever mistaken a surface-level gesture (a phrase, a greeting) for real Adaptation, when the underlying approach never actually changed?", "What is one interaction, coming up soon, where a deliberate frame-shift on your part could actually change the outcome?"],
        },
        blocks: [
          { type: "text", heading: "Stage overview", body: "<p>Adaptation is where cultural understanding turns into actual skill. Past Minimization's \"we're all the same underneath,\" and past Acceptance's genuine curiosity and respect for difference, Adaptation is being able to deliberately shift how you communicate, structure a meeting, or read a situation — based on the specific cultural frame of the person in front of you — without losing your own identity in the process. It is code-switching with intention, not just for one's own comfort but to actually meet someone else where they are.</p><p><strong>Where it sits:</strong> Stage 5 of 6 on the continuum this program uses: Denial → Polarization → Minimization → Acceptance → Adaptation → Integration. The program's continuum draws on the five orientations the Intercultural Development Inventory measures — Denial through Adaptation — plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration.</p>" },
          { type: "list", heading: "Key markers of this stage", items: ["Beyond respecting difference to actually building skill in bridging it", "Deliberate shifts in communication style, pace, formality, or structure", "Holding your own identity while genuinely adopting another frame temporarily", "Different from code-switching for self-protection; this is code-switching to connect", "A practiced skill that improves with real, repeated cross-cultural interaction"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Think of a real relationship where you've deliberately adjusted how you communicate to fit the other person's style, without losing what you actually needed to say. What made that adjustment possible?", "Adaptation requires holding two things at once: your own identity and someone else's frame. Where do you find that hardest to do?", "Have you ever mistaken a surface-level gesture for real Adaptation, when the underlying approach never actually changed?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Ask, don't assume, the preferred frame", back: "<p>Adaptation starts with knowing what frame someone actually prefers, not guessing from their background. Ask directly when you can.</p>" },
            { front: "Change delivery, not substance", back: "<p>Adapting how you communicate something does not mean changing what is true or necessary. The content can stay honest while the delivery shifts.</p>" },
            { front: "Practice the shift before you need it", back: "<p>Like any skill, frame-shifting improves with deliberate practice, not just good intentions in the moment. Rehearse a difficult conversation from more than one angle beforehand.</p>" },
            { front: "Notice when you're performing instead of adapting", back: "<p>A borrowed phrase or gesture that costs you nothing is not the same as actually restructuring how you approach the interaction. Check whether the shift is real.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-adaptation-1-check", question: "What most distinguishes Adaptation from Acceptance, the stage before it?", options: [{ text: "Adaptation involves respecting difference; Acceptance does not", correct: false }, { text: "Adaptation adds the deliberate, practiced skill of shifting one's own frame and behavior; Acceptance is genuine respect without yet building that skill", correct: true }, { text: "Adaptation only applies to language, while Acceptance applies to all cultural differences", correct: false }, { text: "There is no meaningful difference between the two stages", correct: false }], feedbackCorrect: "Acceptance means genuinely valuing and being curious about cultural difference. Adaptation goes further: it is the practiced skill of actually shifting your own communication and behavior to bridge that difference in real interactions.", feedbackIncorrect: "Look again at the stage's key markers — Adaptation adds the practiced skill of actually shifting behavior and communication, beyond the genuine respect that defines Acceptance." },
        ],
      },
      {
        id: "idi-adaptation-2",
        number: 2,
        title: "Designing intake so Adaptation is real, not a script",
        summary: "A single learned greeting can look like Adaptation without changing anything else about how a meeting runs. How a team's process design either invites a genuine shift or settles for a surface gesture.",
        minutes: 9,
        learning: {
          objective: "Describe the difference between a genuine frame-shift and a surface gesture, and design a work practice that invites the real thing.",
          takeaways: [
            "A learned greeting or phrase is a fine starting point, but by itself it doesn't change the pace, structure, or formality of an interaction — the parts of Adaptation that actually meet the other person's frame.",
            "A process that stops at a scripted opening line trains a gesture; a process that also asks staff to check and use a person's stated preferences through the rest of the interaction supports genuine Adaptation.",
            "Building in a simple prompt — what did this person tell us about how they want to be approached, and did we use it after the opening? — helps a team build the skill instead of settling for the appearance of it.",
            "The goal of a design change is to make the deeper shift easier to practice, not to grade whether any one interaction \"counts.\"",
          ],
          evidence: "A workplace scenario about redesigning an intake protocol, and a knowledge check on what a design change should actually require.",
          appliedNextStep: "Look at one script, checklist, or intake protocol your team uses, and check whether it asks staff to do anything with a stated preference beyond the opening line. If not, propose one concrete addition.",
        },
        scenario: {
          context: "A unit's language-access protocol currently instructs caseworkers to open meetings with a greeting in the client's stated home language, then continue with the standard intake script. A team member points out that pace, question order, and formality never change after the greeting, regardless of what a client has said they prefer.",
          prompt: "What is the best next step for the protocol?",
          options: [
            { label: "Leave the protocol as it is — the greeting already shows real effort and respect.", response: "A greeting is a good first step, but a protocol that stops there only trains a gesture; it doesn't build the deeper shift in pace, structure, or formality that actually meets a client's stated frame." },
            { label: "Drop the greeting requirement, since it isn't producing a real shift on its own.", response: "This throws away a genuine first step instead of building on it. The greeting isn't the problem; a protocol that asks for nothing beyond it is." },
            { label: "Keep the greeting, and add one step: after reviewing what the client has said about their preferences, note one specific way the rest of the meeting — pace, order, formality — will reflect it.", response: "This builds the protocol toward a real shift instead of a scripted opening, and gives staff something concrete to practice beyond the first line.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think of a script, form, or checklist your team uses that asks for a cultural gesture — a greeting, a phrase — but nothing further. What would one added step look like that carried the shift past the opening?",
          options: ["Name the script, form, or checklist", "Identify what currently stops at the opening and doesn't carry through the rest of the interaction", "Write the one added step you would propose"],
        },
        blocks: [
          { type: "text", heading: "Telling the skill from the gesture", body: "<p>A greeting in someone's language is a fine place for a process to start. It is not, by itself, evidence that a design produces a real shift. The real difference shows up after the opening: does the pace change, does the structure of the conversation change, does the level of directness or formality change to fit the person, or does the script return to the office's own default the moment the opening line is finished?</p><p>Building a process that carries the shift past the opening works better than grading whether any one interaction \"counts.\" A simple added step — checking what a person has said about their preferences, and naming one specific way the rest of the meeting will reflect it — turns the opening gesture into part of a larger practice instead of the whole of it.</p>" },
          { type: "list", heading: "Signs a process still stops at the gesture", items: ["The script or protocol only specifies the opening line, not what happens afterward.", "Nothing in the design asks staff to record or use what a person has said about their own preferences.", "Pace, structure, and formality default to the same pattern regardless of who is in the room.", "There is no simple way for staff to check, afterward, whether the shift carried through."] },
          { type: "flashcards", heading: "Design moves that help", cards: [
            { front: "Ask what happens after the opening", back: "<p>A greeting is easy to specify. Whether pace, structure, or formality changes afterward is where a design needs an explicit step.</p>" },
            { front: "Build in a use-it step, not just a say-it step", back: "<p>Recording a person's stated preference is only useful if the design also asks staff to act on it through the rest of the interaction.</p>" },
            { front: "Design for practice, not for a grade", back: "<p>A process built to build the skill works better than one built to check whether an interaction \"counts\" as genuine.</p>" },
            { front: "Build on a good first step", back: "<p>A greeting or opening phrase is worth keeping. The fix is adding to it, not replacing it.</p>" },
          ] },
          { type: "leaderMove", heading: "Design the next step into the process", control: "You control whether a script or protocol on your team specifies only an opening gesture or also what happens after it.", failure: "Do not treat a scripted opening as evidence the design is complete.", next: "This week, check one script or protocol your team uses for whether it asks staff to do anything with a stated preference beyond the opening, and propose one addition if it doesn't." },
          { type: "knowledgeCheck", id: "idi-adaptation-2-check", question: "A unit's protocol asks staff to open meetings with a greeting in the client's language, then continue with the standard script. What is the most useful next step for the protocol itself?", options: [{ text: "Nothing — the greeting already fulfills the protocol's purpose.", correct: false }, { text: "Add a step asking staff to note one specific way the rest of the meeting will reflect what the client has said about their preferences.", correct: true }, { text: "Remove the greeting, since a protocol can't guarantee a deeper shift.", correct: false }], feedbackCorrect: "Right. Building in a specific step for what happens after the opening is what turns a scripted gesture into a design that supports a genuine shift.", feedbackIncorrect: "Consider what a protocol would need to specify, beyond the opening line, to actually support a shift in pace, structure, or formality." },
        ],
      },
      {
        id: "idi-adaptation-3",
        number: 3,
        title: "Finding where your own Adaptation is still a performance",
        summary: "A non-punitive look at where your own frame-shifting may be a learned gesture rather than a genuine change, and what to do once you notice it.",
        minutes: 9,
        learning: {
          objective: "Identify at least one instance where your own cross-cultural adjustment may be surface-level rather than a genuine shift, without treating the finding as a failure.",
          takeaways: [
            "Almost everyone practicing this skill has at least one area where the shift is still more gesture than substance; noticing it is part of building the skill, not a sign of dishonesty.",
            "The honest check is whether the underlying approach changes through the hard parts of an interaction, not just whether the opening sounds right.",
            "A genuine shift can still be new and imperfect; the standard is whether it is real, not whether it is polished.",
            "Naming your own surface-level habit precisely is more useful than a general resolution to \"do better.\"",
          ],
          evidence: "A first-person reflection scenario and a knowledge check on what an honest self-check for surface-level Adaptation looks like.",
          appliedNextStep: "Identify one specific interaction where you suspect your adjustment stopped at the opening, and plan one concrete change to carry through the rest of a similar interaction next time.",
        },
        scenario: {
          context: "You are reflecting on a recent meeting where you deliberately used a more formal, indirect opening with a colleague who you know prefers that style. Partway through, the conversation got difficult, and you noticed, only afterward, that you had reverted to your own usual blunt, fast style for the rest of the meeting.",
          prompt: "What is the more honest next step?",
          options: [
            { label: "Consider the meeting a success, since you made the effort at the start and that is what matters.", response: "The opening effort was real, but the reversion during the harder part of the conversation is exactly where the actual shift was needed and did not hold." },
            { label: "Decide that Adaptation is simply too hard to sustain under pressure and stop attempting it in difficult conversations.", response: "Reverting under pressure is common while a skill is new. It is a reason to practice the harder moments specifically, not a reason to give up on the skill." },
            { label: "Name specifically that the shift held for the opening but not for the harder middle of the conversation, and plan one concrete way to practice sustaining it under pressure next time.", response: "This treats the reflection honestly and produces something specific and practicable rather than either false credit or giving up.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think of a recent interaction where you intended to adjust your approach. Did the shift hold through the harder parts, or only the easier opening?",
          options: ["Name the specific interaction and where, exactly, the shift held or did not", "Identify what made the harder part difficult to sustain the shift through", "Write down one concrete way to practice sustaining it next time"],
        },
        blocks: [
          { type: "text", heading: "The honest version of this question", body: "<p>It is easy to credit yourself for the parts of Adaptation that are easiest to plan in advance: the greeting, the opening framing, the deliberate first few minutes. It is much harder to sustain a genuine shift once a conversation becomes difficult, moves faster than expected, or triggers your own usual instincts. That harder stretch is exactly where the real skill is being tested, and it is also the part most likely to revert to a default without anyone, including you, noticing at the time.</p><p>An honest self-check does not ask whether you generally try to adapt. It asks about one specific, recent interaction: did the shift hold through the hard part, or only the easy part? Naming the answer precisely, including when it is \"only the easy part,\" is what turns this into a skill you can actually practice further.</p>" },
          { type: "list", heading: "What an honest self-check for surface-level Adaptation looks like", items: ["A specific, recent interaction, not a general sense of how much effort you make.", "An honest account of whether the shift held through the harder or later parts of the interaction, not just the opening.", "Recognition that reverting under pressure is common while a skill is new, not evidence the skill is fake.", "One concrete practice for the specific moment where the shift tends to drop, rather than a general resolution to try harder."] },
          { type: "quote", text: "I was proud of how I opened that meeting. It wasn't until a colleague asked how the second half went that I realized I'd gone straight back to my own default the moment it got hard.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "Reframes that help this land honestly", cards: [
            { front: "The hard middle is the real test", back: "<p>An opening gesture is the easiest part to plan. Whether the shift holds once things get difficult is the actual measure of the skill.</p>" },
            { front: "Reverting under pressure is normal while learning", back: "<p>A skill this deliberate takes practice to sustain under stress. Noticing a lapse is part of building it, not evidence it isn't real.</p>" },
            { front: "Specific beats general", back: "<p>\"I try to adapt\" finds nothing to practice. \"The shift dropped when the conversation got difficult\" gives you an exact moment to work on.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-adaptation-3-check", question: "Which self-reflection is most likely to actually strengthen the skill of Adaptation?", options: [{ text: "\"I generally try to adjust my approach for different people.\"", correct: false }, { text: "\"My shift held through the opening of the meeting but dropped once the conversation got difficult, and I want to practice sustaining it under pressure.\"", correct: true }, { text: "\"I made the effort at the start, so the meeting counts as a success.\"", correct: false }], feedbackCorrect: "Right. The specific answer names exactly where the shift held and where it dropped, which gives you something concrete to practice. The general answers do not locate anything to actually work on.", feedbackIncorrect: "Look for the answer that names a specific moment where the shift held or dropped, rather than a general sense of effort." },
        ],
      },
      {
        id: "idi-adaptation-4",
        number: 4,
        title: "Practicing Adaptation deliberately, before it counts",
        summary: "Frame-shifting improves with rehearsal, not just good intentions in the moment. A practical look at building the skill before a real, high-stakes interaction.",
        minutes: 9,
        learning: {
          objective: "Plan and rehearse a specific frame-shift ahead of a real, upcoming interaction, rather than relying on adjusting in the moment.",
          takeaways: [
            "Rehearsing a specific shift before a difficult interaction is more reliable than intending to adjust in the moment, especially under pressure.",
            "A useful rehearsal names the specific frame you are shifting toward, based on what the person has actually told you or shown you, not a guess from their background.",
            "Practicing the harder middle of an interaction, not just the opening, is where rehearsal pays off most.",
            "Debriefing afterward — what held, what reverted — turns one interaction into practice for the next one.",
          ],
          evidence: "A scenario decision about preparing for a high-stakes conversation, and a knowledge check on what effective rehearsal for Adaptation looks like.",
          appliedNextStep: "Before your next high-stakes cross-cultural conversation, write out the specific frame-shift you intend to make and rehearse how you will sustain it if the conversation becomes difficult.",
        },
        scenario: {
          context: "A program coordinator has an upcoming meeting to deliver a denial decision to a family who has told the office, in a prior interaction, that they experience direct, immediate bad news as disrespectful and prefer time to build rapport before difficult information is shared. The coordinator is deciding how to prepare.",
          prompt: "Which preparation is most likely to help the shift actually hold?",
          options: [
            { label: "Plan to stay open to adjusting in the moment, based on how the conversation feels once it starts.", response: "Relying on in-the-moment adjustment, especially under the pressure of delivering bad news, is exactly when a default style tends to take over instead." },
            { label: "Write out the specific shift in advance — more time on rapport before the news, a slower pace, checking in before moving forward — and rehearse how to keep it up even if the family reacts with distress.", response: "This names the specific frame-shift in advance and specifically prepares for the harder moment, which is where a shift is most likely to revert without rehearsal.", recommended: true },
            { label: "Use the same delivery approach as always, since the substance of the decision will be the same regardless of delivery.", response: "The substance can stay the same while the delivery still needs to fit the frame the family has already described; defaulting to the usual style ignores information already given." },
          ],
        },
        transfer: {
          prompt: "What is one upcoming interaction where you could write out and rehearse a specific frame-shift in advance, rather than planning to adjust in the moment?",
          options: ["Name the interaction and the specific shift you intend to make", "Identify the point in the conversation where the shift is most likely to be hard to sustain", "Decide how you will debrief afterward to check whether the shift actually held"],
        },
        blocks: [
          { type: "text", heading: "Rehearsal beats good intentions", body: "<p>Intending to adjust in the moment sounds reasonable, but pressure reliably pulls people back toward their own default style, especially in a conversation that is already difficult. Writing out a specific frame-shift in advance, and rehearsing how to sustain it through the part of the conversation most likely to get hard, gives the shift something to hold onto besides good intentions.</p><p>The most useful rehearsal is specific: not \"be more sensitive,\" but \"spend the first several minutes on rapport before the decision, and if there is distress, pause and check in rather than continuing to the next point.\" A debrief afterward, asking honestly what held and what reverted, turns each real interaction into practice for the next one.</p>" },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A frame-shift rehearsal note", summary: "A short note used before a real cross-cultural interaction to plan and later check a specific shift.", fields: [
            { label: "The interaction and what the person has told or shown you", value: "A denial decision meeting; the family has said direct, immediate bad news feels disrespectful and they prefer rapport first." },
            { label: "The specific shift you will make", value: "More time on rapport before the decision; slower pace; check in before moving to the next point." },
            { label: "Where the shift is most likely to be hard to sustain", value: "If the family reacts with visible distress once the decision is shared." },
            { label: "Debrief after the interaction", value: "Note what held and what reverted, and what you would rehearse differently next time." },
          ], action: "Use the four fields before your next high-stakes cross-cultural interaction, and fill in the debrief field honestly afterward." },
          { type: "list", heading: "What effective rehearsal includes", items: ["A specific frame, based on what the person has actually told or shown you, not a guess from their background.", "Particular attention to the part of the interaction most likely to be difficult, not just the opening.", "A plan for what to do if the interaction does not go as expected, not only if it goes smoothly.", "A short, honest debrief afterward about what held and what reverted."] },
          { type: "leaderMove", heading: "Rehearse the hard part, not just the opening", control: "You control whether your preparation for a difficult interaction includes the part most likely to be hard to sustain.", failure: "Do not rely on adjusting in the moment for a high-stakes conversation. Write the specific shift down and rehearse the harder part in advance.", next: "Before your next high-stakes interaction, write out the specific shift and the plan for the hardest moment, and debrief honestly afterward." },
          { type: "knowledgeCheck", id: "idi-adaptation-4-check", question: "What most reliably helps a deliberate frame-shift actually hold during a difficult, high-stakes interaction?", options: [{ text: "Planning to adjust naturally once the conversation starts", correct: false }, { text: "Writing out the specific shift in advance and rehearsing how to sustain it through the hardest expected moment", correct: true }, { text: "Using the same approach as always, since the substance of the message will not change", correct: false }], feedbackCorrect: "Right. Specific advance planning, especially for the hardest part of the interaction, is more reliable than intending to adjust once pressure is already present.", feedbackIncorrect: "Consider which option specifically prepares for the moment a shift is most likely to revert under pressure." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Adaptation: quick reference",
    subtitle: "A one-page reminder for practicing deliberate frame-shifting in real interactions",
    quote: "Acceptance means genuinely valuing cultural difference. Adaptation goes further: it is the practiced skill of actually shifting your own communication and behavior to bridge that difference.",
    use: {
      purpose: "Keep this stage's markers and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Beyond respecting difference to actually building skill in bridging it", "Deliberate shifts in communication style, pace, formality, or structure", "Holding your own identity while genuinely adopting another frame temporarily", "A practiced skill that improves with real, repeated cross-cultural interaction"],
      doNext: "Identify one upcoming interaction where you could deliberately adjust your communication style to fit the other person's frame, and try it.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Ask, don't assume, the preferred frame \— ask directly when you can.", "Change delivery, not substance \— the content can stay honest while delivery shifts.", "Practice the shift before you need it, like any other skill.", "Notice when you're performing a gesture instead of actually adapting."] },
      { heading: "Before you assume", items: ["This describes a practiced skill, not a status someone either has or lacks.", "This program's continuum draws on the five orientations the IDI measures plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration.", "No one's placement on this continuum is ever a personnel record or a score.", "When in doubt, a licensed IDI assessment with a qualified debrief — not this module — is the actual assessment tool."] },
    ],
  },
  sources: [
    { title: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.", href: "https://www.idiinventory.com/", note: "Source for the five orientations a licensed IDI assessment measures — Denial, Polarization, Minimization, Acceptance, and Adaptation, including this module's stage — which this program's continuum draws on. The IDI does not measure Integration." },
    { title: "Bennett, M. J. (1993). Towards Ethnorelativism: A Developmental Model of Intercultural Sensitivity.", href: "https://en.wikipedia.org/wiki/Milton_J._Bennett", note: "Foundational developmental model the IDI grew from; source for Integration, the sixth stage of this program's continuum, which a licensed IDI assessment does not measure." },
  ],
};

export default pack;
