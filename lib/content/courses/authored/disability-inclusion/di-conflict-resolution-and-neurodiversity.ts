import type { CoursePack } from "../../source-types";

// Disability Inclusion curriculum, Level 2 module 7: Conflict Resolution That Works for Neurodivergent Staff.
// Program-authored from the owner's internal briefing note of the same name. Part one of the note becomes lessons
// one to three; part two, on neurodiversity-affirming mediation, becomes lessons four and five.
const pack: CoursePack = {
  course: {
    id: "di-conflict-resolution-and-neurodiversity",
    indexNumber: 1125,
    seriesLabel: "Disability Inclusion · Applied inclusion",
    title: "Conflict Resolution That Works for Neurodivergent Staff",
    subtitle: "Notice where standard conflict resolution assumes one kind of communicator, adjust the process so more than one kind of brain can use it, and run mediation that stays neutral by making participation possible for everyone.",
    scope: "For supervisors, managers, human-resources partners, mediators, facilitators, employee resource group leads and any staff member who takes part in workplace conflict conversations. Five short lessons adapted from the program's briefing note, Conflict Resolution That Works for Neurodivergent Staff. Participation is voluntary. This course does not replace your program's grievance, complaint, accommodation or mediation procedures, and it does not qualify anyone to diagnose a colleague.",
    treatment: "Five short lessons with scenarios drawn from ordinary office conflict, a sorting exercise, a before-the-meeting note, an agreement template, a partner briefing, flashcards and knowledge checks",
    duration: "45–52 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/intercultural-conflict-styles.jpg",
    coverAlt: "Two colleagues sit across a table with papers between them, in a serious conversation.",
    introTranscript: "A session on conflict resolution can be useful and still leave a gap. Many standard methods assume one kind of communicator: someone who reads faces in the moment, answers quickly out loud, catches hints, shows emotion in a familiar way and keeps eye contact while talking. Those habits feel natural to many people. They are harder, or draining, for many neurodivergent people. When the process only rewards the first style, it can look like one person is good at conflict and the other is difficult. Often it is just a mismatch. This course is about making the process usable for more than one kind of brain. It is not about lowering standards or avoiding hard conversations. Conflict resolution should still address harm, set limits and reach decisions. It should also be designed so disabled and neurodivergent staff can take part without having to perform a neurotypical version of good communication first. That is not special treatment. That is a fairer process.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain, in plain terms, what neurodivergent and neurotypical mean and why a conflict process built around one communication style is an accessibility issue rather than a personality clash.",
        "Recognize five common ways a standard conflict conversation misreads neurodivergent participants, and separate a difference in style from harm that must still be addressed.",
        "Apply seven adjustments to a conflict conversation, including a written agenda, written options, a pause that is not treated as walking out, direct questions and one access question asked of everyone.",
        "Describe neurodiversity-affirming mediation, state its seven principles and run the before, during and after steps of a session in a way that keeps the mediator neutral.",
        "Name the limits of affirming practice, protect confidentiality when someone discloses a need, and brief a conflict-resolution partner in one paragraph.",
      ],
      evidence: [
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed sort of observed behaviors into processing differences and matters that still need a direct response.",
        "A before-the-meeting note, a written agreement and a partner briefing adapted to your own setting.",
      ],
      appliedNextStep: "Before your next difficult conversation, send the agenda in writing, ask everyone the one access question, and agree on a pause signal. Afterward, put the agreement in specific language and offer a short written follow-up.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Program briefing note and public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in the agency's grievance, mediation or reasonable-accommodation procedures", "Change in ADA or state guidance on effective communication or neurodiversity at work", "Feedback from neurodivergent staff that a scenario or a term reads as inaccurate or stigmatizing"],
      relatedDoor: "Formal complaints, accommodation requests and disciplinary matters follow your program's procedures and Human Resources; this course prepares you for the conversation, it does not replace those routes or decide any case.",
      toolkitQuestion: "Does this process reward one communication style, and what would let someone who thinks, senses or communicates differently take part on equal footing?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "conflict-resolution-and-neurodiversity-1",
        number: 1,
        title: "One style is not the standard",
        summary: "Understand what neurodivergent and neurotypical mean, what a typical conflict process quietly expects, and why a mismatch of styles is an accessibility issue rather than a character flaw.",
        minutes: 10,
        learning: {
          objective: "Explain what neurodivergent and neurotypical mean, list five things a standard conflict conversation expects of participants, and state why a mismatch is an accessibility issue.",
          takeaways: [
            "Neurodivergent means a person's brain processes information, emotion, sensory input or social cues differently from what many workplaces treat as typical; neurotypical means the more common pattern standard methods were built around.",
            "Typical conflict resolution expects people to read faces and tone in the moment, answer quickly out loud, catch hints, show emotion in a familiar way, and keep eye contact while sitting still.",
            "Researchers describe a two-way misunderstanding: one person misses an implied message, the other reads a pause or a flat expression as rudeness. Both feel unheard, and neither is the difficult one.",
          ],
          evidence: "A scenario decision and a knowledge check.",
          appliedNextStep: "Think of the last tense conversation you were part of. Write down which of the five expectations it relied on, and who that favored.",
        },
        scenario: {
          context: "A supervisor meets two team members to work through a dispute about who dropped a deadline. One of them answers each question after a long pause, looks at the table and speaks in a flat voice. The other answers immediately, makes eye contact and becomes tearful. Afterward the supervisor writes that the first person was evasive and unengaged and the second was open and taking responsibility.",
          prompt: "What has most likely happened?",
          options: [
            { label: "The supervisor read the meeting accurately. Pauses and avoiding eye contact usually mean someone has something to hide.", response: "This treats one communication style as the honest one. A pause is often the time it takes to turn speech into meaning and find words. Looking away often helps a person concentrate. Nothing in the account shows evasion." },
            { label: "The supervisor judged manners rather than the problem. The process rewarded quick, expressive answers, and the person who needed time looked worse for reasons that have nothing to do with the deadline.", response: "Yes. Both people may have been telling the truth. When a process only rewards one style, it can look like one person is good at conflict and the other is difficult. The deadline question is still unanswered.", recommended: true },
            { label: "The first person should have been asked to make eye contact and speak up so the supervisor could read them properly.", response: "Demanding eye contact and quick speech asks the person to perform a style, not to answer the question. It usually makes the answers worse, not clearer." },
          ],
        },
        transfer: {
          prompt: "Which of the five expectations does your team lean on most in a disagreement?",
          options: ["Name one recent conversation where a pause or a flat tone was read as attitude", "Ask a colleague which of the five they find hardest under stress", "Write one sentence you could say to open a meeting that takes the pressure off quick spoken answers"],
        },
        blocks: [
          { type: "text", heading: "A useful session can still leave a gap", body: "<p>A session on conflict resolution can be useful and still leave a gap. Many standard methods assume one kind of communicator. That can leave neurodivergent staff, and other disabled staff, at a disadvantage.</p><p><strong>Neurodivergent</strong> means a person's brain processes information, emotion, sensory input or social cues differently from what many workplaces treat as typical. This can include autism, ADHD, dyslexia, dyspraxia and related differences. Many people are undiagnosed, and many will not disclose. <strong>Neurotypical</strong> means the more common pattern those standard methods were built around.</p><p>This is not about lowering standards or avoiding hard conversations. It is about making the process usable for more than one kind of brain.</p>" },
          { type: "list", heading: "What a typical conflict process expects people to do", items: ["Read faces and tone in the moment.", "Answer quickly, out loud.", "Catch hints instead of direct requests.", "Show emotion in a familiar way.", "Keep eye contact and sit still while talking."] },
          { type: "text", heading: "Often it is just a mismatch", body: "<p>Those habits feel natural to many neurotypical people. They are harder, or even draining, for many neurodivergent people. When the process only rewards the first style, it can look like one person is good at conflict and the other is difficult. Often it is just a mismatch.</p><p>Researchers sometimes call this a two-way misunderstanding. The neurodivergent person may miss an implied message. The neurotypical person may read a pause, a flat expression or a blunt sentence as rudeness or shutdown. Both people can feel unheard.</p><p>That is an accessibility issue, not just a personality clash.</p>" },
          { type: "tabs", heading: "Four words, spelled out", tabs: [
            { label: "Diversity", body: "<p>People do not all communicate the same way. That difference is part of who is in the room, not a problem that arrived with one person.</p>" },
            { label: "Equity", body: "<p>Giving everyone the same rapid, face-to-face conversation is not the same as giving everyone a fair chance to be understood.</p>" },
            { label: "Inclusion", body: "<p>People need to stay respected during disagreement, not only when things are calm. If looking away or asking a direct question gets treated as disrespect, people hide who they are.</p>" },
            { label: "Accessibility", body: "<p>A conflict process is a service. If the only way in is fast spoken nuance, the process is not fully accessible.</p>" },
          ] },
          { type: "leaderMove", heading: "Judge the problem, not the manners", control: "You control whether a meeting becomes a judgment of communication style or a search for what actually happened.", failure: "Do not write up a pause as evasion, a still face as coldness or a blunt sentence as aggression. Once the record says that, the real issue is lost and the person carries the label.", next: "Before your next difficult conversation, decide how you will make room for a slow answer, a written answer and a direct question, and say so at the start." },
          { type: "knowledgeCheck", id: "conflict-resolution-and-neurodiversity-1-check", question: "During a tense meeting a colleague goes quiet for several seconds before each answer and looks at the table. What is the most accurate reading?", options: [
            { text: "They are stonewalling and should be asked to engage properly.", correct: false },
            { text: "They may need a few seconds to turn speech into meaning and find words, and looking away may help them concentrate. The silence is not evidence about the dispute.", correct: true },
            { text: "They are clearly upset, so the meeting should end.", correct: false },
          ], feedbackCorrect: "Yes. A pause is processing time, not a verdict. Give the silence room and the answer usually arrives.", feedbackIncorrect: "Both other readings treat a communication style as proof of attitude or state. Nothing in the moment tells you either. Allow the pause and keep the question on the table." },
        ],
      },
      {
        id: "conflict-resolution-and-neurodiversity-2",
        number: 2,
        title: "Where standard methods go wrong",
        summary: "Recognize five common misreadings, in pauses, hints, feelings, body language and fairness, and keep the difference between a processing style and harm that still has to be addressed.",
        minutes: 10,
        learning: {
          objective: "Identify the five most common ways a standard conflict conversation misreads a neurodivergent participant and separate each from behavior that causes harm.",
          takeaways: [
            "Pauses get misread as stonewalling, hints get missed, feelings are hard to name on the spot, body language gets treated as proof of attitude, and a refusal to paper over a fact gets read as stubbornness.",
            "Asking for the exact request is usually a search for clarity, not an attempt to argue; a mild critique can also land harder than intended because of processing and nervous-system differences, not overreaction.",
            "None of this makes harmful behavior fine. It means one communication style should not be treated as the only honest style.",
          ],
          evidence: "A completed sort, a scenario decision and a knowledge check.",
          appliedNextStep: "Choose one of the five misreadings you recognize in yourself and decide what you will do differently the next time you notice it.",
        },
        scenario: {
          context: "Near the end of a long meeting about a shared project, a manager says, \"Well, it's getting late.\" A team member replies, \"Yes, it is 4:40,\" and continues explaining a data problem. Later the manager describes the team member as unable to read the room and unwilling to wrap up.",
          prompt: "What is the fairest account of what happened?",
          options: [
            { label: "The team member ignored a clear signal and should have stopped.", response: "\"It's getting late\" was a hint, not a request. Hearing it as a time check is a reasonable reading of the words that were said. The signal was not clear; it was implied." },
            { label: "The manager relied on a hint instead of saying the request, and the team member answered the words that were spoken. The fix is to say what is wanted: \"Please stop here; we will pick this up in writing tomorrow.\"", response: "Yes. Say the request out loud. Do not rely on hints. That costs the speaker one sentence and spares the listener a reputation.", recommended: true },
            { label: "Both people were at fault equally and the manager should raise the team member's social skills at their next review.", response: "Turning a missed hint into a performance issue treats one communication style as a job requirement. The problem is solved by a direct sentence, not a review note." },
          ],
        },
        transfer: {
          prompt: "Where does your team communicate by hint, and who pays for that?",
          options: ["List three hints your team uses to end meetings, decline requests or signal disagreement, and write the direct version of each", "Notice the next time you interpret body language as attitude and check it with a question instead", "Ask a neurodivergent colleague, if they have offered to be asked, which workplace hints are easiest to miss"],
        },
        blocks: [
          { type: "accordion", heading: "Five places the process misreads people", items: [
            { title: "Pauses get misread", body: "<p>Some people need a few seconds to turn speech into meaning and then find words. In a tense meeting, that silence can look like ignoring or stonewalling. If the other person talks faster to fill the gap, it gets worse.</p>" },
            { title: "Hints get missed", body: "<p>\"It's getting late\" may be heard as a time check, not \"please wrap this up.\" \"Let's agree to disagree\" can sound like skipping the real issue. Asking for the exact request is often a search for clarity, not an attempt to argue.</p>" },
            { title: "Feelings are hard to name on the spot", body: "<p>Some people can tell they feel overwhelmed but cannot quickly label the emotion. A mild critique can also hit harder than intended. That can look like overreaction or withholding. It is often a processing and nervous-system issue.</p>" },
            { title: "Body language is treated as proof of attitude", body: "<p>Looking away, fidgeting or speaking in a flat tone can help someone stay focused. Many people read those same signs as guilt, boredom or hostility.</p>" },
            { title: "Fairness can look like stubbornness", body: "<p>Some people will not paper over a fact that feels wrong just to end the meeting smoothly. That can be a strong sense of consistency, not a need to win.</p>" },
          ] },
          { type: "statement", body: "None of this means harmful behavior is fine. It means we should not treat one communication style as the only honest style." },
          { type: "sorting", id: "conflict-resolution-and-neurodiversity-2-sort", heading: "Style, or something that still needs a direct response?", categories: ["Likely a processing or communication difference", "Harm or a limit that must still be addressed"], items: [
            { text: "A colleague answers each question after a long silence and does not look up.", category: "Likely a processing or communication difference" },
            { text: "A colleague asks, \"What exactly are you asking me to do?\" after a manager says, \"We should all try harder.\"", category: "Likely a processing or communication difference" },
            { text: "A colleague repeatedly interrupts a co-worker and calls their work worthless in front of the team.", category: "Harm or a limit that must still be addressed" },
            { text: "A colleague keeps saying the reported figure is wrong when everyone else wants to move on, and it is wrong.", category: "Likely a processing or communication difference" },
            { text: "A colleague sends messages to a co-worker's personal phone late at night after being asked to stop.", category: "Harm or a limit that must still be addressed" },
            { text: "A colleague fidgets with a pen and speaks in a flat tone while describing what upset them.", category: "Likely a processing or communication difference" },
          ] },
          { type: "flashcards", heading: "Read it the other way", cards: [
            { front: "A pause", back: "<p>Time to process and find words. Give it room. Do not fill it with a worse story.</p>" },
            { front: "\"What exactly do you want?\"", back: "<p>A search for clarity. Answer it plainly. It is not a challenge.</p>" },
            { front: "\"I don't know how I feel\"", back: "<p>Often true in the moment. Offer choices: fairness, workload, respect or safety.</p>" },
            { front: "Looking away", back: "<p>Often a way to concentrate. It tells you nothing about honesty or interest.</p>" },
            { front: "Refusing to let a fact slide", back: "<p>Consistency, not stubbornness. Check the fact before you check the person.</p>" },
          ] },
          { type: "leaderMove", heading: "Separate meaning from landing", control: "You control whether a conversation stays about what was meant and what happened, or slides into what someone's face or tone supposedly proved.", failure: "Do not let \"the way you said it\" replace \"what you said\" when the content was accurate and no one was demeaned. Address real harm directly and by name.", next: "The next time a colleague's delivery bothers you, ask one question about their meaning before you conclude anything about their intent." },
          { type: "knowledgeCheck", id: "conflict-resolution-and-neurodiversity-2-check", question: "A team member keeps insisting that a number in a report is wrong while the rest of the group wants to close the meeting. What should the facilitator do first?", options: [
            { text: "Ask them to let it go so the group can finish on time.", correct: false },
            { text: "Check the number. A refusal to paper over a fact is often consistency, not stubbornness, and if the figure is wrong the group needs to know.", correct: true },
            { text: "Note the behavior as an inability to compromise.", correct: false },
          ], feedbackCorrect: "Yes. Check the fact before you judge the person. Accuracy is the point of the meeting, not an obstacle to it.", feedbackIncorrect: "Both other responses treat a strong sense of consistency as a social failure. Verify the number first; then decide how to close." },
        ],
      },
      {
        id: "conflict-resolution-and-neurodiversity-3",
        number: 3,
        title: "Changing the process",
        summary: "Build seven adjustments into every conflict conversation, from a written agenda to one access question asked of everyone, and notice how they help people who are not neurodivergent too.",
        minutes: 10,
        learning: {
          objective: "Apply seven adjustments to a conflict conversation and explain why each one helps neurodivergent staff and often everyone else.",
          takeaways: [
            "Send the agenda and main issues in writing ahead of time, allow written options alongside live discussion, and let either person call a short break without it being treated as walking out.",
            "Ask clear, choice-based questions, say the request out loud, and separate what someone meant from how it landed.",
            "Ask every participant, \"Is there anything that would make this conversation easier to take part in?\" Do not wait for a diagnosis.",
          ],
          evidence: "A scenario decision, a knowledge check and a before-the-meeting note adapted for your team.",
          appliedNextStep: "Use the before-the-meeting note for your next difficult conversation, and keep the one access question in every invitation from now on.",
        },
        scenario: {
          context: "A team member asks their supervisor to send the main points in writing before a meeting about a complaint between two colleagues, and asks whether they can respond partly in writing afterward. The supervisor's first thought is that this is not how these conversations are done, and that a written exchange will feel formal and cold.",
          prompt: "What is the best response?",
          options: [
            { label: "Explain that these conversations need to happen face to face so everyone can read each other, and decline the written option.", response: "This keeps the process built around one style. Reading each other is exactly what goes wrong for many people. A request for writing is a request for access." },
            { label: "Agree to the written agenda, offer the written option to both people, and ask everyone involved whether anything else would make the conversation easier to take part in.", response: "Yes. Writing ahead reduces surprise, gives people time to process, and helps everyone, including people who are simply better on paper than in a live argument.", recommended: true },
            { label: "Agree, but only for this person and only because they asked, and mention that it is an exception.", response: "Offering the adjustment as a personal exception singles the person out and makes them the difficult one. Offer it to everyone. It is a better process, not a favor." },
          ],
        },
        transfer: {
          prompt: "Which of the seven adjustments would be easiest to make standard on your team this month?",
          options: ["Add the one access question to your next meeting invitation", "Agree with your team on a pause signal that is never treated as walking out", "Rewrite one open-ended emotion question you tend to ask into a choice-based question"],
        },
        blocks: [
          { type: "text", heading: "Adjustments that help everyone", body: "<p>These adjustments help neurodivergent staff and often help everyone else too. Being tired, anxious, new to English, dealing with trauma or simply better on paper than in a live argument all make the same design useful. Build the ramp, and more than one group uses it.</p>" },
          { type: "list", heading: "What to change in the process", ordered: true, items: [
            "Send the agenda and main issues in writing ahead of time.",
            "Allow written options, not only live debate: email, chat or a shared document.",
            "Let either person call a short break without it being treated as walking out.",
            "Ask clear questions. Instead of \"How does that make you feel?\" try \"Is this about fairness, workload, respect or safety?\"",
            "Say the request out loud. Do not rely on hints.",
            "Separate what someone meant from how it landed.",
            "Ask every participant, \"Is there anything that would make this conversation easier to take part in?\" Do not wait for a diagnosis.",
          ] },
          { type: "quote", text: "I am listening. I need a minute to find the right words.", cite: "A line anyone can use in the moment. It stops the other person from filling the silence with a worse story." },
          { type: "artifact", kind: "plain-language-flyer", label: "Practical artifact", title: "Before we meet", summary: "A short note to send with any invitation to a difficult conversation. It gives people the information and control that make participation possible.", fields: [
            { label: "What we will talk about", value: "The main issues, listed plainly, in the order we will take them. Nothing new will be raised in the meeting without agreement." },
            { label: "How you can take part", value: "In the meeting, in writing beforehand, in writing afterward, or a mix. All three count the same." },
            { label: "Pausing", value: "Either of us can ask for a short break at any time. A break is not walking out, and we will pick up where we stopped." },
            { label: "One question for everyone", value: "Is there anything that would make this conversation easier to take part in? Lighting, sound, timing, written prompts, a support person, anything else. You do not need to give a reason." },
            { label: "Afterward", value: "I will send a short written summary of what we agreed, with who does what by when, and you can correct anything you could not say in the room." },
          ], action: "Adapt this for your setting and attach it to your next meeting invitation. Then make sure every line is true." },
          { type: "leaderMove", heading: "Make the adjustments the default, not the exception", control: "You control whether access is something a person has to ask for, and explain, or something the process already offers to everyone.", failure: "Do not grant a written agenda or a break as a personal favor to the one person who asked. It marks them, and it leaves everyone who did not ask without it.", next: "Put the seven adjustments in the way your team runs every difficult conversation, and say so in the invitation." },
          { type: "knowledgeCheck", id: "conflict-resolution-and-neurodiversity-3-check", question: "Which question is most likely to help a participant who cannot label their emotion on the spot?", options: [
            { text: "\"How does that make you feel?\"", correct: false },
            { text: "\"Is this about fairness, workload, respect or safety?\"", correct: true },
            { text: "\"Can you tell me what's really going on for you?\"", correct: false },
          ], feedbackCorrect: "Yes. A choice-based question gives a person something to sort with, instead of asking them to generate a label under pressure.", feedbackIncorrect: "Open emotion questions stall for many people in a tense moment. Offer choices; the person can still add their own." },
        ],
      },
      {
        id: "conflict-resolution-and-neurodiversity-4",
        number: 4,
        title: "Neurodiversity-affirming mediation",
        summary: "Learn what affirming mediation is, how it differs from the classic format, its seven principles, and the before, during and after steps that keep a mediator neutral by making the process usable.",
        minutes: 12,
        learning: {
          objective: "Describe neurodiversity-affirming mediation, state its seven principles, and run the before, during and after steps of a session without taking sides.",
          takeaways: [
            "Affirming mediation treats different brains as normal, not as problems to fix. The mediator still stays impartial and still helps people reach their own agreement; what changes is the design of the process.",
            "If someone cannot use the process, the process is not neutral. It is tilted. Adjusting the format is how neutrality is kept, not how it is broken.",
            "Structure reduces anxiety, the nervous system comes first, clarity is kinder than politeness by hint, strengths count, and safety still matters.",
          ],
          evidence: "A scenario decision, a knowledge check and an agreement written in specific language.",
          appliedNextStep: "Take the last agreement you wrote or witnessed and rewrite it so every line says who does what, by when, in a way both people could check.",
        },
        scenario: {
          context: "A mediator is halfway through a joint session between two colleagues. One of them has stopped speaking, is rocking slightly and has covered their ears. The room is small, the lights hum, and the other colleague has been talking quickly for several minutes.",
          prompt: "What should the mediator do?",
          options: [
            { label: "Ask the quiet colleague to stay with the process because everyone needs to hear the same thing at the same time.", response: "People cannot problem-solve when they are overloaded. Insisting on the joint room favors the person who can tolerate it and shuts the other out. That is not neutral." },
            { label: "Pause the session, reduce the noise and light where possible, and offer to continue by meeting each person separately, with the same issues and the same standing.", response: "Yes. Shuttle mediation, where the mediator meets each person separately, keeps both people in the process. The nervous system comes first; the agreement can still be reached.", recommended: true },
            { label: "End the mediation and refer the matter for a formal decision, since one party cannot participate.", response: "The person can participate; the room cannot be tolerated. Changing the format is the accessible response. Ending the process punishes someone for how their brain works." },
          ],
        },
        transfer: {
          prompt: "Which of the seven principles is weakest in the way conflict is mediated where you work?",
          options: ["Check whether your intake asks everyone the access question, or only the person someone assumed was different", "Find out whether shuttle mediation is an option in your setting and who can arrange it", "Review a recent written agreement for mood language and rewrite it in specific terms"],
        },
        blocks: [
          { type: "text", heading: "What affirming means here", body: "<p>Neurodiversity-affirming mediation is a way of running mediation that treats different brains as normal, not as problems to fix. The mediator still stays impartial and still helps people reach their own agreement. What changes is the design of the process, so people who think, sense and communicate differently can take part on equal footing.</p><p>Affirming means difference is expected; direct speech, pauses, looking away, stimming or needing writing are not automatically treated as bad faith; and the process bends toward the people, instead of forcing people to mask their way through a neurotypical script. It is close to disability-accessible mediation and trauma-informed mediation. The shared idea is simple: if someone cannot use the process, the process is not neutral. It is tilted.</p>" },
          { type: "text", heading: "How this differs from standard mediation", body: "<p>Classic mediation often assumes people can sit face to face for a long stretch, read faces and tone, answer in real time, catch hints, show engagement through eye contact and a warm voice, and stay regulated while talking about hard things. Those assumptions work for many people. They shut others out.</p><p>Affirming mediation starts from the idea of a two-way misunderstanding. The mediator's job is to slow that misfire down and translate, not to coach one party to act more normal. Adjusting the process is not taking sides. Helping both people participate fully is how neutrality is kept, not how it is broken.</p>" },
          { type: "accordion", heading: "Seven principles", items: [
            { title: "1. Fair process is part of justice", body: "<p>If one person can think out loud at speed and the other needs ten minutes and a written prompt, a same-rules-for-both session is not equal. Access is part of procedural fairness.</p>" },
            { title: "2. Ask everyone, not only the person you think is different", body: "<p>A useful intake question is: \"Is there anything that would make this process more comfortable or easier to take part in?\" That covers sensory needs, written options, breaks, support people and timing. Diagnosis is optional.</p>" },
            { title: "3. Structure reduces anxiety", body: "<p>Surprise is expensive for many neurodivergent people. A clear agenda, time markers and a written summary of what happens next help people stay in the conversation instead of spending their energy guessing the rules.</p>" },
            { title: "4. The nervous system comes first", body: "<p>People cannot problem-solve well when they are overloaded. Lighting, noise, length of session, movement and permission to pause are not extras. They are the conditions for thinking.</p>" },
            { title: "5. Clarity is kinder than politeness by hint", body: "<p>Say what you mean. Check what the other person heard. Do not treat \"I need you to say the request in plain words\" as combative.</p>" },
            { title: "6. Strengths count", body: "<p>Some neurodivergent people are strong on detail, consistency, pattern-spotting or naming the actual issue. Affirming practice uses those strengths instead of treating them as obstacles to a smooth social ending.</p>" },
            { title: "7. Safety still matters", body: "<p>Affirming practice does not ignore abuse, coercion or capacity limits. If someone cannot take part safely, mediation may need a shuttle format, extra screening or a different process. Being inclusive is not the same as forcing a joint room.</p>" },
          ] },
          { type: "tabs", heading: "What it looks like in practice", tabs: [
            { label: "Before the session", body: "<ul><li>Explain the process in plain language: purpose, who will be there, how long, how people can pause.</li><li>Send the agenda and key issues in writing, ideally a day ahead.</li><li>Offer format choices: in person, video, phone, written exchange or a mix.</li><li>Ask about lighting, sound, movement, written input and whether a support person would help.</li><li>Agree on ground rules that include a pause signal that is not treated as walking out.</li></ul>" },
            { label: "During the session", body: "<ul><li>Keep language concrete. Avoid idioms and vague closers like \"we should just move on.\"</li><li>Allow silence. Name it if needed: \"I am giving space to think. You do not have to fill it.\"</li><li>Offer choice-based questions when open emotion questions stall.</li><li>Do not treat missing eye contact or fidgeting as proof of attitude.</li><li>Use shorter segments and scheduled breaks.</li><li>Repeat and write down key points. Nodding is not the same as understanding.</li><li>If being in the same room is too much, switch to shuttle mediation: the mediator meets each person separately.</li></ul>" },
            { label: "After the session", body: "<ul><li>Put agreements in writing, with who does what by when.</li><li>Use specific language, not mood language. \"We will review the schedule every Monday by email\" is stronger than \"we will communicate better.\"</li><li>Offer a short follow-up in writing so people can correct anything they could not say in the room.</li></ul>" },
          ] },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "An agreement in specific language", summary: "A written agreement both people can check, with no mood language. Adapt the fields; keep the specificity.", fields: [
            { label: "What we agreed", value: "Handoffs between the two roles will go through the shared tracker, not by hallway conversation. Each handoff will name the task, the date needed and the person responsible." },
            { label: "Who does what, by when", value: "One colleague sets up the tracker columns by the end of next week. The other adds the three open items by the following Monday. The supervisor confirms the tracker is in use at the next team meeting." },
            { label: "How we will check", value: "The two colleagues review the tracker together for ten minutes every Monday morning, by video or in writing, whichever the person who needs it prefers that week." },
            { label: "If something is not working", value: "Either person can raise it in writing to the supervisor. Raising it is not a complaint about the other person; it is part of the agreement." },
            { label: "Your correction", value: "Within three working days, either person can send a written note adding or correcting anything they could not say in the room. The note becomes part of this agreement." },
          ], action: "Use this shape for your next agreement. Read each line and ask whether both people could tell, a month from now, if it was kept." },
          { type: "knowledgeCheck", id: "conflict-resolution-and-neurodiversity-4-check", question: "A mediator offers one party a written agenda a day ahead and permission to pause, and the other party objects that this gives their colleague an advantage. What is the accurate reply?", options: [
            { text: "The adjustments are offered to both parties. Making the process usable for everyone is how neutrality is kept, not how it is broken.", correct: true },
            { text: "The adjustments will be withdrawn so both parties face the same conditions.", correct: false },
            { text: "The adjustments stay, but only because the colleague has a diagnosis.", correct: false },
          ], feedbackCorrect: "Yes. Offer every adjustment to everyone. A same-rules-for-both session that only one person can use is the tilted one.", feedbackIncorrect: "Withdrawing access to look even-handed tilts the process toward the person who can tolerate the classic format, and tying it to a diagnosis singles someone out. Offer it to both." },
        ],
      },
      {
        id: "conflict-resolution-and-neurodiversity-5",
        number: 5,
        title: "Limits, confidentiality and briefing a partner",
        summary: "Know where affirming practice stops, keep a disclosed need confidential, and brief a mediator, facilitator or human-resources partner in one paragraph they can act on.",
        minutes: 8,
        learning: {
          objective: "State five limits of affirming practice, protect confidentiality when a colleague discloses a need, and write a one-paragraph briefing for a conflict-resolution partner.",
          takeaways: [
            "The mediator is not a diagnostician and should not guess labels out loud. Not every difficult behavior is neurodivergence; some conflict is still about power, values or harm.",
            "One party's access needs cannot erase the other party's safety, and affirming does not mean every demand is reasonable. It means the process should not punish people for how their brain works.",
            "Confidentiality still applies when someone discloses a need. Share only what they permit.",
          ],
          evidence: "A scenario decision, a knowledge check and a partner briefing adapted for your setting.",
          appliedNextStep: "Send the one-paragraph briefing to the next person who will mediate or facilitate a conflict conversation for your team, and ask them to confirm what they will change.",
        },
        scenario: {
          context: "After a session, a mediator tells a supervisor: \"I think he might be autistic, which would explain a lot. You may want to keep that in mind.\" The colleague in question has never said anything about a diagnosis.",
          prompt: "What should the supervisor do with this?",
          options: [
            { label: "Keep it in mind as helpful context and adjust how they manage the colleague.", response: "A guessed label is not context; it is a diagnosis made out loud by someone without the role or the information to make one, and it now follows the colleague. Managing someone according to a guess is the opposite of asking them what would help." },
            { label: "Decline the label, say that guessing diagnoses is outside both of their roles, and keep offering the same adjustments to everyone without waiting for a reason.", response: "Yes. The adjustments do not depend on a label, and the label was never the colleague's to lose. Good practice does not wait for a diagnosis, and it does not invent one.", recommended: true },
            { label: "Ask the colleague directly whether they are autistic so the right supports can be put in place.", response: "Asking a person to disclose a diagnosis in order to receive a fair process puts the burden on them. Offer the access question to everyone; they can share what they choose." },
          ],
        },
        transfer: {
          prompt: "Who mediates or facilitates conflict where you work, and what do they currently assume about eye contact and quick answers?",
          options: ["Send the partner briefing to that person and ask for one change they will make", "Check what your team does when a colleague discloses a need in a conflict process, and who else hears about it", "Name one situation where an access request and another person's safety could pull in different directions, and decide who would resolve it"],
        },
        blocks: [
          { type: "list", heading: "Limits and cautions", items: [
            "The mediator is not a diagnostician and should not guess labels out loud.",
            "Not every difficult behavior is neurodivergence. Some conflict is still about power, values or harm.",
            "One party's access needs cannot erase the other party's safety.",
            "Affirming does not mean every demand is reasonable. It means the process should not punish people for how their brain works.",
            "Confidentiality still applies when someone discloses a need. Share only what they permit.",
          ] },
          { type: "text", heading: "Why this belongs in ordinary conflict practice", body: "<p>Good mediation already says: check meaning, manage power, watch capacity, and do not confuse style with intent. Affirming work makes those rules visible in places standard training often leaves implicit. A strong presentation on how people resolve conflict can still miss the mark if it treats one social style as the definition of readiness, honesty or respect.</p><p>Conflict resolution should still address harm, set limits and reach decisions. It should also be designed so disabled and neurodivergent staff can participate without having to perform a neurotypical version of good communication first. That is not special treatment. That is a fairer process.</p>" },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A one-paragraph briefing for a conflict-resolution partner", summary: "Hand this to a mediator, facilitator or human-resources partner before they run a session for your team. It says what you want and why, in a form they can act on.", fields: [
            { label: "What we want", value: "Mediation that works for neurodivergent staff as well as neurotypical staff." },
            { label: "What that means in practice", value: "Advance agendas, written options, permission to pause, clear language instead of hints, and no assumption that eye contact or quick verbal answers equal good faith." },
            { label: "The one question", value: "Please ask every participant, not only one, whether anything would make the process easier to take part in. No diagnosis is needed." },
            { label: "Neutrality", value: "Adjusting the format is part of fairness, not a departure from neutrality. Offer every adjustment to both people." },
            { label: "Limits", value: "Please do not guess labels out loud, keep anything a person discloses confidential, and tell us if a safety concern means a different format or process is needed." },
          ], action: "Send this before the session, and ask the partner to tell you which of these they will do and which they cannot." },
          { type: "flashcards", heading: "Keep these apart", cards: [
            { front: "Affirming", back: "<p>The process bends toward the people. Difference is expected. No one has to mask to be seen as acting in good faith.</p>" },
            { front: "Not affirming", back: "<p>Coaching one party to act more normal, reading a flat face as contempt, or granting access as a favor to the one person who asked.</p>" },
            { front: "Still required", back: "<p>Address harm, set limits, reach a decision, keep everyone safe, follow your program's procedures.</p>" },
            { front: "Never yours to do", back: "<p>Diagnose a colleague, guess a label out loud, or share a disclosed need beyond what the person permitted.</p>" },
          ] },
          { type: "leaderMove", heading: "Offer access without demanding a reason", control: "You control whether people receive a usable process because they are people in the room, or only after they hand over a diagnosis.", failure: "Do not make disclosure the price of a fair conversation, and do not repeat a disclosure to anyone the person did not name.", next: "Add the access question to every conflict invitation, and decide now who is the only person a disclosed need will be shared with." },
          { type: "knowledgeCheck", id: "conflict-resolution-and-neurodiversity-5-check", question: "During a mediation, one participant discloses that they have ADHD and asks for written prompts. Who should be told?", options: [
            { text: "The participant's whole team, so everyone can adjust.", correct: false },
            { text: "Only the people the participant permits. The written prompts can be offered to everyone in the process without explaining why.", correct: true },
            { text: "Human Resources, automatically, so it is on record.", correct: false },
          ], feedbackCorrect: "Yes. Share only what the person permits. The adjustment itself needs no explanation because it is available to everyone.", feedbackIncorrect: "A disclosed need is the person's to share. Offer the adjustment to everyone and keep the reason where the person put it." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Conflict resolution that works for neurodivergent staff",
    subtitle: "A one-page reminder for supervisors, mediators and anyone who runs a difficult conversation",
    quote: "If a pause is treated as evasion, a still face as coldness and blunt speech as aggression, the meeting becomes a judgment of manners. Treat them as different processing styles and the meeting can get back to the actual problem.",
    use: {
      purpose: "Keep the seven adjustments, the seven principles and the limits in view before, during and after any conflict conversation.",
      remember: ["A conflict process is a service. If the only way in is fast spoken nuance, it is not accessible.", "Ask everyone the one access question. Do not wait for a diagnosis, and never guess one out loud.", "Say the request. Do not rely on hints. Separate what was meant from how it landed.", "Adjusting the format for both people is how neutrality is kept, not how it is broken."],
      doNext: "Attach the before-we-meet note to your next difficult conversation and write the agreement in specific language afterward.",
    },
    sections: [
      { heading: "Before", items: ["Send the agenda and main issues in writing, ideally a day ahead.", "Offer format choices: in person, video, phone, written exchange or a mix.", "Ask everyone: \"Is there anything that would make this easier to take part in?\"", "Agree on a pause signal that is never treated as walking out."] },
      { heading: "During", items: ["Keep language concrete. Say the request out loud.", "Allow silence. \"I am giving space to think. You do not have to fill it.\"", "Ask choice-based questions: fairness, workload, respect or safety?", "Do not treat missing eye contact, fidgeting or a flat tone as proof of attitude.", "Use shorter segments, scheduled breaks, and shuttle mediation if a shared room is too much."] },
      { heading: "After", items: ["Put agreements in writing: who does what, by when.", "Use specific language, not mood language.", "Offer a short written follow-up so people can correct what they could not say in the room."] },
      { heading: "Limits", items: ["Not every difficult behavior is neurodivergence; power, values and harm still exist.", "One person's access needs cannot erase another's safety.", "Keep a disclosed need confidential. Share only what the person permits."] },
    ],
  },
  sources: [
    { title: "Job Accommodation Network (JAN)", href: "https://askjan.org/", note: "Public guidance on workplace accommodations, including for autism, ADHD and other neurodivergent conditions, and on the interactive process." },
    { title: "U.S. Department of Labor, Office of Disability Employment Policy", href: "https://www.dol.gov/agencies/odep", note: "Federal resources on neurodiversity in the workplace and inclusive employment practices." },
    { title: "ADA National Network", href: "https://adata.org/", note: "Plain-language guidance on effective communication and reasonable accommodation under the Americans with Disabilities Act." },
    { title: "Minnesota Management and Budget, Office of Collaboration and Dispute Resolution", href: "https://mn.gov/mmb/ocdr/", note: "The state office that supports collaborative processes and dispute resolution for Minnesota public bodies." },
  ],
};

export default pack;
