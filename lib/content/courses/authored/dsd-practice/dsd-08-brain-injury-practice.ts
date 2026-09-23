import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 8: Brain injury practice.
// Program-authored for staff who assess, plan for, coordinate or support people living with brain injury.
const pack: CoursePack = {
  course: {
    id: "dsd-08-brain-injury-practice",
    indexNumber: 1188,
    seriesLabel: "DSD Service System · Practice",
    title: "Brain Injury: Practice Essentials",
    subtitle: "What brain injury does that nobody can see, why a person can seem fine and be struggling, how fatigue and awareness shape every interaction, and what practice looks like when it is built for the injury rather than around it.",
    scope: "For care coordinators, case managers, direct support staff, assessors, program and policy staff, and supervisors who work with people living with brain injury. Five short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Five short lessons with everyday examples, a sort separating visible from nonvisible effects, scenarios, flashcards on the common effects, and an interaction review you can run on your own practice",
    duration: "50–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-brain-injury-practice.jpg",
    coverAlt: "A man in his fifties sits in a quiet living room with the blinds half drawn, a notebook open on his knee, while a support worker listens across from him.",
    introTranscript: "Brain injury is the disability most often missed by the people whose job it is to notice. The person walks in, speaks well, and seems fine. What is not visible is the fatigue that arrives after forty minutes, the slowed processing that means a question answered quickly was not understood, the memory that will not hold this conversation until tomorrow, and the awareness that may not register any of it. This module covers what brain injury commonly does, why it is so often invisible, how fatigue and awareness shape every interaction, how behavior gets misread, and how to review your own practice so it works for the injury rather than around it. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the common cognitive, physical, emotional and behavioral effects of brain injury and explain why most are not visible.",
        "Explain how cognitive fatigue works and adjust the length, timing and structure of an interaction to account for it.",
        "Explain impaired self-awareness and respond to it without confrontation or collusion.",
        "Read behaviors commonly attributed to attitude or personality as effects of the injury, and name the support each implies.",
        "Run an interaction review on your own practice and change one thing about how you meet with people living with brain injury.",
      ],
      evidence: [
        "A sort separating visible from nonvisible effects.",
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed interaction review with one change.",
      ],
      appliedNextStep: "Shorten your next meeting with a person living with brain injury, put the most important thing first, and send a written summary afterwards.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Minnesota brain injury waiver eligibility or services", "Change in assessment instruments used with people living with brain injury", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's diagnosis, assessment, rehabilitation or services go to the responsible clinician, lead agency or program office; this course builds practice, it does not assess anyone.",
      toolkitQuestion: "How long into this interaction did the person stop being able to take it in, and did anyone notice?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-brain-injury-1",
        number: 1,
        title: "What nobody can see",
        summary: "Meet the common effects of brain injury and understand why most of them are invisible to the people trying to help.",
        minutes: 10,
        learning: {
          objective: "Name the common effects of brain injury across cognitive, physical, emotional and behavioral domains, and explain why the most consequential ones are not visible.",
          takeaways: [
            "Brain injury commonly affects memory, attention, processing speed, initiation, fatigue, emotional regulation, and awareness of one's own changes; it may also affect balance, vision, sleep and pain.",
            "Speech and social presentation are often preserved, which means the person seems fine in exactly the situations where staff form their impressions.",
            "The gap between how a person presents and what they can sustain is the central practice problem, and it is not the person's fault.",
          ],
          evidence: "A sort separating visible from nonvisible effects, a flashcard set, a scenario decision and a knowledge check.",
          appliedNextStep: "Recall one person living with brain injury you have met and list the effects you could see and the ones you could not.",
        },
        scenario: {
          context: "A man in his forties, three years after a car accident, attends an assessment. He is articulate, makes eye contact, jokes with the assessor, and answers every question. The assessor's notes describe him as high-functioning with minimal support needs. His wife later calls to say that he cannot manage his medication, has not paid a bill in two years, and slept for six hours after the meeting.",
          prompt: "What is the most accurate reading?",
          options: [
            { label: "The assessment was accurate and the wife is overstating his needs.", response: "The assessment captured his presentation over an hour of effort. It missed what that hour cost and what he cannot sustain outside it. The wife is describing the part that is invisible in a meeting." },
            { label: "Preserved speech and social skill masked memory, initiation and fatigue effects that only show over days; the assessment measured his best hour, and the support needs are in the other twenty-three.", response: "This is the pattern brain injury produces more than any other disability. The repair is to gather information across time and from people who see him daily, not to trust one good hour.", recommended: true },
            { label: "He should be reassessed by a different assessor.", response: "A second hour with a different person will produce the same result. What is needed is information from outside the hour." },
          ],
        },
        transfer: {
          prompt: "How does one assessment or meeting you conduct account for what it cannot see?",
          options: ["Note what your meeting can observe and what it cannot", "Add one source of information from outside the meeting: a family member, a daily record, a follow-up call the next day", "Change one thing about how the record describes what was seen"],
        },
        blocks: [
          { type: "text", heading: "Preserved surface, changed interior", body: "<p>Brain injury is unusual among disabilities in how often it leaves the surface intact. Speech, vocabulary, humor and social ease frequently survive, because the injury has affected other things: the speed at which information is processed, the ability to hold it, the drive to start, the endurance to continue, the regulation of mood, and the awareness that any of this has changed. A person with these effects can hold a conversation that leaves the other party convinced nothing is wrong.</p><p>Staff form impressions in meetings. Meetings are the setting where a person with brain injury looks best: structured, prompted, short, socially scaffolded. The consequence is a predictable pattern in which people are assessed as needing less than they need, plans are built on the assessment, and the plans fail at home for reasons the record does not contain.</p>" },
          { type: "sorting", id: "dsd-brain-injury-1-sort", heading: "Visible in a meeting, or not?", categories: ["Visible", "Not visible"], items: [
            { text: "Difficulty walking or a tremor.", category: "Visible" },
            { text: "Losing the content of this conversation by tomorrow.", category: "Not visible" },
            { text: "Slurred or slowed speech.", category: "Visible" },
            { text: "Needing six hours of sleep after an hour of concentration.", category: "Not visible" },
            { text: "Not initiating tasks at home without a prompt.", category: "Not visible" },
            { text: "Not being aware that anything has changed since the injury.", category: "Not visible" },
          ] },
          { type: "flashcards", heading: "Common effects, briefly", cards: [
            { front: "Memory", back: "<p>Especially new memory: the ability to retain what happened today. A person may recall their childhood in detail and not this morning's call. Written follow-up after every contact is the basic accommodation.</p>" },
            { front: "Processing speed", back: "<p>Information arrives faster than it can be handled. The person may answer quickly to keep up socially, without the answer reflecting understanding. Slow down, one idea at a time, and check.</p>" },
            { front: "Initiation", back: "<p>The drive to start does not fire. The person agrees, intends, and does not begin. Often mistaken for laziness or lack of interest. Start the task with them.</p>" },
            { front: "Cognitive fatigue", back: "<p>Mental effort depletes faster and recovers slower. After a threshold the person can no longer take anything in, and the threshold may be twenty minutes. Meetings are short and the important thing comes first.</p>" },
            { front: "Emotional regulation", back: "<p>Mood shifts faster and further. Irritability, tearfulness, or anger that arrives without the usual buildup. Often an effect of fatigue as much as of the injury directly.</p>" },
            { front: "Self-awareness", back: "<p>The person may not perceive their own changes. This is a neurological effect, not denial. It shapes everything about how a plan is discussed.</p>" },
          ] },
          { type: "leaderMove", heading: "Gather information across time", control: "You control whether an assessment relies on one meeting or draws on people who see the person across days. The second is where brain injury becomes visible.", failure: "Do not let one good hour set the support level. The hour is real and it is the best hour the person has.", next: "For your next assessment, add one source from outside the meeting before the support level is set." },
          { type: "knowledgeCheck", id: "dsd-brain-injury-1-check", question: "Why is a structured one-hour meeting a poor basis for judging the support needs of a person living with brain injury?", options: [
            { text: "Because people are nervous in meetings and underperform.", correct: false },
            { text: "Because the meeting is the setting in which the injury is least visible: short, structured, socially scaffolded, and over before fatigue and memory effects appear.", correct: true },
            { text: "Because assessors are not trained in brain injury.", correct: false },
          ], feedbackCorrect: "Yes. The meeting captures the person at their best, and the support needs live in the hours the meeting does not see.", feedbackIncorrect: "The issue is not nerves or training. It is that the setting itself hides the effects that matter." },
        ],
      },
      {
        id: "dsd-brain-injury-2",
        number: 2,
        title: "Fatigue, and the shape of an interaction",
        summary: "Understand cognitive fatigue and change the length, timing and order of your interactions to account for it.",
        minutes: 10,
        learning: {
          objective: "Explain how cognitive fatigue works after brain injury and restructure an interaction so the important content lands before the person's capacity runs out.",
          takeaways: [
            "Cognitive fatigue after brain injury is not tiredness; it is the depletion of the capacity to process, and past a threshold nothing further is taken in regardless of effort.",
            "The threshold varies by person and by day, is lower in the afternoon, after travel, in noise, and after any prior demand, and is often reached within twenty to forty minutes.",
            "An interaction built for fatigue is short, puts the most important thing first, has one topic, and ends with a written summary the person can read later.",
          ],
          evidence: "A tabs comparison of two meeting structures, a statement, a scenario decision and a knowledge check.",
          appliedNextStep: "Restructure your next meeting: most important thing first, one topic, under thirty minutes, written summary afterwards.",
        },
        scenario: {
          context: "A planning meeting for a woman living with brain injury is scheduled for ninety minutes at two in the afternoon, after she has taken two buses to reach the office. The agenda has six items. The most important, a housing decision, is item five.",
          prompt: "What is the most useful change?",
          options: [
            { label: "Keep the agenda and take a break halfway through.", response: "A break helps a little. By item five she will have been depleted for an hour, and the housing decision will be made by the people in the room who still have capacity." },
            { label: "Move the meeting to the morning, hold it by phone or at her home to remove the travel, put the housing decision first, drop or defer everything else, and send a written summary the same day.", response: "Each change removes a demand that would otherwise be spent before the important item. The meeting becomes shorter and the decision becomes hers.", recommended: true },
            { label: "Send her the agenda in advance so she can prepare.", response: "Useful, and it does not change the fact that the decision arrives at the point where she has nothing left to make it with." },
          ],
        },
        transfer: {
          prompt: "What does your next meeting with a person living with brain injury look like when it is built for fatigue?",
          options: ["Move the most important item to the start", "Cut the length in half and the topics to one", "Send a written summary within a day"],
        },
        blocks: [
          { type: "text", heading: "Not tired; depleted", body: "<p>Cognitive fatigue after brain injury is often described as tiredness, and it is not the same thing. Tiredness responds to effort; a tired person can push through. Depletion does not. After brain injury, the capacity to process information is a finite resource that is spent by concentration, by noise, by travel, by social demand, and by any prior task, and once it is gone, nothing further goes in. The person may continue to nod, to answer, to appear engaged, because social routines are automatic. The content is not landing.</p><p>This is why the structure of an interaction matters more than its content. A ninety-minute meeting with the important decision at the end is a meeting in which the decision is made by everyone except the person it concerns. The same decision, placed first in a thirty-minute meeting in the morning, is made with them.</p>" },
          { type: "tabs", heading: "Two structures for the same meeting", tabs: [
            { label: "Built without fatigue in mind", body: "<p>Afternoon. At the office after travel. Ninety minutes. Six items, updates first, decision fifth. Several people talking. No summary afterwards. The person leaves having agreed to things they will not remember and having missed the one that mattered.</p>" },
            { label: "Built for fatigue", body: "<p>Morning. At home or by phone. Thirty minutes. One topic: the decision. One or two voices. Pauses. A written summary the same day, in short sentences, with the decision and the next step at the top. A follow-up call two days later to check it landed.</p>" },
            { label: "What changed", body: "<p>Timing, location, length, order, number of voices, and the existence of a record the person can read when they have capacity again. None of it cost money. All of it moved the decision to the person.</p>" },
          ] },
          { type: "statement", body: "Past the fatigue threshold, a person can keep nodding and stop taking anything in. The structure of the meeting decides whether the important thing arrived before that point." },
          { type: "leaderMove", heading: "Put the important thing first", control: "You control the order of an agenda. Putting the most important item first, every time, is the single highest-value change available to anyone who meets with people living with brain injury.", failure: "Do not save the decision for the end because the updates come first by habit. The end is where the person has nothing left.", next: "Reorder your next agenda so the decision is the first item, and cut everything that can wait." },
          { type: "knowledgeCheck", id: "dsd-brain-injury-2-check", question: "A person living with brain injury continues to nod and answer throughout a long meeting. What does this tell you about whether the content is being taken in?", options: [
            { text: "That they are engaged and following.", correct: false },
            { text: "Very little; social responses are often automatic and continue after processing capacity is depleted, so the only reliable check is a written summary and a follow-up.", correct: true },
            { text: "That the meeting could go longer.", correct: false },
          ], feedbackCorrect: "Yes. Nodding is not evidence of retention after brain injury. The summary and the follow-up call are.", feedbackIncorrect: "Continued social responsiveness is exactly what makes depletion invisible. It is not a sign the content is landing." },
        ],
      },
      {
        id: "dsd-brain-injury-3",
        number: 3,
        title: "Awareness, and how to talk about it",
        summary: "Learn what impaired self-awareness is, why it is not denial, and how to plan with a person who does not perceive the changes you are planning for.",
        minutes: 12,
        learning: {
          objective: "Explain impaired self-awareness as a neurological effect, and describe a planning approach that neither confronts the person with their deficits nor colludes with an inaccurate picture.",
          takeaways: [
            "After brain injury, the part of the brain that monitors one's own functioning may itself be affected, so the person genuinely does not perceive changes that are obvious to others.",
            "Confronting the person with evidence tends to produce distress and disagreement, not insight; colluding with their picture produces a plan that fails.",
            "The workable approach anchors on the person's own goals, builds in experiences that let them discover what works, and keeps the relationship intact through the discovery.",
          ],
          evidence: "An accordion on three approaches, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "For one person whose self-assessment differs from others', find a goal they hold and plan one supported experience toward it.",
        },
        scenario: {
          context: "A man in his thirties, two years after a brain injury, wants to return to his previous job driving a delivery truck. His family, his rehabilitation team and his own recent driving evaluation all indicate he cannot safely do so. He does not believe them and says they are holding him back.",
          prompt: "What is the most useful approach?",
          options: [
            { label: "Present the evidence clearly and firmly until he accepts it.", response: "He has heard the evidence. Impaired awareness is not a shortage of evidence; it is an inability to perceive it as applying to himself. Firmness produces a fight and damages the relationship the plan needs." },
            { label: "Anchor on what he wants — work, income, being useful, driving — and plan supported experiences toward those goals in which he can discover for himself what is working, while the team keeps him safe and stays alongside him.", response: "This respects the goal, avoids the confrontation that awareness deficits make futile, and lets experience teach what argument cannot. It also keeps the door open to a different job that meets the same needs.", recommended: true },
            { label: "Agree that he should try to return to driving so he learns from the result.", response: "Dignity of risk has limits where others could be seriously harmed, and this is one of them. Colluding is not the alternative to confronting." },
          ],
        },
        transfer: {
          prompt: "Whose self-assessment differs most from what others see, and what goal do they hold?",
          options: ["Name the person and the goal in their words", "Plan one supported experience toward that goal that lets them discover what works", "Decide what the team will do to keep them safe during it"],
        },
        blocks: [
          { type: "text", heading: "Not denial", body: "<p>Denial is a psychological response: a person who could perceive something painful and does not let themselves. Impaired self-awareness after brain injury is different. The neurological system that monitors one's own functioning has itself been affected, and the person genuinely does not perceive the change. They are not refusing to see it. They cannot see it, in the same way a person with a visual field loss cannot see the left side of the room and is not lying when they say nothing is there.</p><p>This distinction changes practice completely. If it were denial, evidence and gentle confrontation might work. Because it is not, evidence produces disagreement and confrontation produces distress. The person concludes that the people around them are wrong, or hostile, and the relationship that any plan depends on is damaged. The workable approach starts somewhere else.</p>" },
          { type: "accordion", heading: "Three approaches, and what each produces", items: [
            { title: "Confrontation", body: "<p>Presenting evidence of deficits until the person accepts them. <strong>Produces:</strong> Argument, distress, and a person who now believes the team is against them. Insight does not arrive, because the mechanism that would receive it is what is affected.</p>" },
            { title: "Collusion", body: "<p>Accepting the person's picture and planning as though it were accurate. <strong>Produces:</strong> A plan that fails, sometimes dangerously, and a person who experiences the failure without a team alongside them.</p>" },
            { title: "Anchoring on goals, learning through experience", body: "<p>Starting from what the person wants, which is usually accurate, and building supported experiences toward it in which the person can discover what works and what does not, with the team staying alongside. <strong>Produces:</strong> Slower progress, an intact relationship, and awareness that arrives through experience rather than argument, where it can arrive at all.</p>" },
          ] },
          { type: "quote", text: "Impaired awareness is not a shortage of evidence. Giving the person more of it does not help, and it costs the relationship." },
          { type: "leaderMove", heading: "Start from the goal, not the deficit", control: "You control whether a planning conversation opens with what the person cannot do or with what they want. The second is usually accurate and is the only starting point that keeps them in the room.", failure: "Do not let the team's frustration turn into a campaign to make the person see. The campaign will fail and the person will leave.", next: "Take one plan built around a person's deficits and rewrite its first page around their goals." },
          { type: "knowledgeCheck", id: "dsd-brain-injury-3-check", question: "Why does presenting clear evidence rarely help a person with impaired self-awareness after brain injury?", options: [
            { text: "Because they are in denial and need time.", correct: false },
            { text: "Because the neurological system that would perceive the evidence as applying to themselves is what the injury affected; more evidence does not reach it and the confrontation damages the relationship.", correct: true },
            { text: "Because the evidence is usually not clear enough.", correct: false },
          ], feedbackCorrect: "Yes. The mechanism, not the amount of evidence, is the issue. That is why the approach has to route around it.", feedbackIncorrect: "This is not denial and it is not a quality-of-evidence problem. It is a perception effect of the injury." },
        ],
      },
      {
        id: "dsd-brain-injury-4",
        number: 4,
        title: "Behavior, read correctly",
        summary: "Read the behaviors most often attributed to attitude or personality as effects of the injury, and name the support each implies.",
        minutes: 12,
        learning: {
          objective: "For each of several behaviors commonly attributed to attitude, name the injury effect it most likely reflects and the support that would change it.",
          takeaways: [
            "Irritability, bluntness, apparent disinterest, repeated questions, and sudden refusal are among the behaviors most often read as personality after brain injury, and each has a common neurological reading.",
            "The reading points at a support: shorter interactions, warning before change, written records, and a team that adjusts the environment rather than the person.",
            "A file that describes a person living with brain injury as difficult is usually describing an environment that has not been adjusted.",
          ],
          evidence: "A tabs walk through five behaviors, a scenario decision and a knowledge check.",
          appliedNextStep: "Find one description of attitude or personality in a file and rewrite it as an injury effect with a support.",
        },
        scenario: {
          context: "A woman living with brain injury has been described in three consecutive notes as rude, uncooperative and difficult. Reading the notes closely, each incident occurred at the end of a long appointment, in a busy waiting area, when she was asked to do something unexpected.",
          prompt: "What is the most accurate reading?",
          options: [
            { label: "The notes describe a pattern of behavior that should be addressed with her directly.", response: "The notes describe a pattern of circumstances. Each one is a fatigue-plus-noise-plus-unexpected-demand situation, and the behavior is what those circumstances produce after brain injury." },
            { label: "Each incident is a predictable effect of depletion, sensory overload and an unplanned task switch; the support is shorter appointments, a quiet space, and warning before any change, and the notes should describe the circumstances rather than her character.", response: "This reads the behavior as information and produces three changes the office can make. It also corrects a record that would otherwise follow her.", recommended: true },
            { label: "She should be seen by a different worker who may get on with her better.", response: "The next worker will meet the same circumstances and write the same notes. The circumstances are what need to change." },
          ],
        },
        transfer: {
          prompt: "Which description of attitude in one file is actually a description of circumstances?",
          options: ["Find one note that describes a person living with brain injury in terms of character", "Identify the circumstances: time, noise, length, and what was asked", "Rewrite the note as an effect and a support"],
        },
        blocks: [
          { type: "text", heading: "The environment is what the behavior is about", body: "<p>After brain injury, emotional regulation is often affected directly, and it is affected indirectly by everything else: fatigue lowers the threshold for irritability, slowed processing makes an unexpected request feel like an ambush, and memory effects mean the same question gets asked several times. From the outside, these look like personality. The person seems rude, uncooperative, disinterested, or difficult. From the inside, the person is responding to an environment that is asking more than they have.</p><p>The test is circumstantial. When the behavior appears, what was the time of day, how long had the interaction been going, how noisy was the setting, and what had just been asked? If the behavior tracks those variables, it is the environment being described, and the environment is what can be changed.</p>" },
          { type: "tabs", heading: "Five behaviors, read as effects", tabs: [
            { label: "Irritability", body: "<p><strong>Often read as:</strong> Bad temper. <strong>Common effect:</strong> Fatigue plus regulation changes. <strong>Support:</strong> Shorter interactions, earlier in the day, in quiet. End before the threshold rather than after it.</p>" },
            { label: "Bluntness", body: "<p><strong>Often read as:</strong> Rudeness. <strong>Common effect:</strong> Inhibition changes; the filter between thought and speech is thinner. <strong>Support:</strong> Do not take it personally, do not correct it in the moment, and structure conversations so fewer snap responses are required.</p>" },
            { label: "Apparent disinterest", body: "<p><strong>Often read as:</strong> Not caring. <strong>Common effect:</strong> Initiation and fatigue. The person is not starting, or has nothing left. <strong>Support:</strong> Start the task with them; ask when they have capacity rather than when the schedule says.</p>" },
            { label: "Repeated questions", body: "<p><strong>Often read as:</strong> Not listening. <strong>Common effect:</strong> New memory is not holding. <strong>Support:</strong> Answer each time as though it were the first. Write it down. Do not say you already told them.</p>" },
            { label: "Sudden refusal", body: "<p><strong>Often read as:</strong> Uncooperative. <strong>Common effect:</strong> An unplanned task switch. The request arrived before the previous thing was closed. <strong>Support:</strong> Warn before a change. Ask again after a pause.</p>" },
          ] },
          { type: "leaderMove", heading: "Describe the circumstances, not the character", control: "You control what the note says. A note that records time, length, noise and the request made is useful to the next worker. A note that says difficult is a label they will inherit.", failure: "Do not let a character description into the record for a behavior that tracks circumstances. It will be read as fact by everyone who follows.", next: "Rewrite the last note that described a person living with brain injury in terms of attitude." },
          { type: "statement", body: "A file that calls a person living with brain injury difficult is usually a file describing an environment nobody adjusted." },
          { type: "knowledgeCheck", id: "dsd-brain-injury-4-check", question: "A person asks the same question four times in a meeting. What is the most useful response?", options: [
            { text: "Remind them gently that you have already answered it.", correct: false },
            { text: "Answer each time as though it were the first, write the answer down for them, and treat the repetition as information that new memory is not holding this conversation.", correct: true },
            { text: "Ask why they keep asking.", correct: false },
          ], feedbackCorrect: "Yes. Reminding them they asked before adds shame to a memory effect and does not help the answer stick. Writing it down does.", feedbackIncorrect: "Both other responses treat the repetition as a choice. It is a memory effect, and the support is a written record." },
        ],
      },
      {
        id: "dsd-brain-injury-5",
        number: 5,
        title: "An interaction review you can run",
        summary: "Review your own practice with people living with brain injury and change one thing about how you meet with them.",
        minutes: 10,
        learning: {
          objective: "Complete an interaction review of your own practice and make one concrete change to how you meet with people living with brain injury.",
          takeaways: [
            "The review asks about length, timing, setting, order, number of voices, written follow-up, and information from outside the meeting.",
            "Most practice fails on several of these at once, and any one of them changed improves what the person takes away.",
            "One change made consistently is worth more than a complete list applied once.",
          ],
          evidence: "A list of the review's questions, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Run the review on your own practice and make one change starting with your next meeting.",
        },
        scenario: {
          context: "You run the review and find that your meetings with people living with brain injury average an hour, are held in the afternoon at the office, cover several topics, and are not followed by a written summary. Your caseload is full and you are not sure what can change.",
          prompt: "What is the most useful first change?",
          options: [
            { label: "Add a written summary after every meeting.", response: "A strong change and it comes after the meeting; the person has already been depleted for most of it. Better to change what happens before depletion first." },
            { label: "Put the most important item first and end the meeting when it is settled, whatever else was planned; add the summary as the second change.", response: "This costs nothing, shortens the meeting by itself, and moves the decision to the part of the hour the person can use. The summary then records something the person actually took part in.", recommended: true },
            { label: "Move all meetings to the morning.", response: "Valuable and often not within your control. Reordering the agenda is always within your control." },
          ],
        },
        transfer: {
          prompt: "Which one thing will change about your next meeting?",
          options: ["Run the review on your own practice and mark what fails", "Choose the one change you can make without anyone's permission", "Make it at the next meeting and note what the person took away"],
        },
        blocks: [
          { type: "text", heading: "Your practice, reviewed", body: "<p>The changes that make interactions work after brain injury are not clinical. They are structural, they cost nothing, and they are almost all within the control of the person running the meeting. That is what makes the review useful: it is a list of things you can change tomorrow. Most practice fails on several of them at once, and a single change improves what the person leaves with.</p>" },
          { type: "list", heading: "The seven questions", ordered: true, items: ["How long are your meetings with people living with brain injury? Could the important part be done in twenty minutes?", "When are they held? Morning, before other demands, is best.", "Where? Could travel and noise be removed?", "What comes first? Is the most important thing before the fatigue threshold?", "How many people speak? Could it be one or two?", "What does the person receive afterwards in writing, and when?", "What information do you have from outside the meeting: family, daily records, a follow-up call?"] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Interaction review", summary: "One page that scores your own practice against the seven questions and names one change.", fields: [
            { label: "Length, timing, setting", value: "What they are now; what they could be" },
            { label: "Order and voices", value: "What comes first; how many people speak" },
            { label: "Written follow-up", value: "What the person receives, and when" },
            { label: "Information from outside the meeting", value: "Who else sees the person across days" },
            { label: "One change, starting when", value: "The one thing you will do differently, and from which meeting" },
          ], action: "Run it on your own practice and make one change at the next meeting." },
          { type: "leaderMove", heading: "Change the thing within your control", control: "You control the agenda order and the summary, whatever else you do not control. Start there.", failure: "Do not wait for a scheduling system or a quiet room to be provided. Reorder the agenda tomorrow.", next: "At your next meeting, put the decision first and send a summary the same day." },
          { type: "flashcards", heading: "What the summary looks like", cards: [
            { front: "First line", back: "<p>The decision or the most important thing, in one sentence. Not the date, not the attendees, not the purpose.</p>" },
            { front: "Second line", back: "<p>The next step, who does it, and by when. If it is the person's step, what exactly they do and who to call if stuck.</p>" },
            { front: "Length", back: "<p>Under a page. Short sentences. One idea each. The person may have capacity for five minutes of reading.</p>" },
            { front: "Follow-up", back: "<p>A call two days later, short, to check that the summary made sense and that the first step is possible.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-brain-injury-5-check", question: "What is the single change most within a worker's control that improves what a person living with brain injury takes from a meeting?", options: [
            { text: "Booking a quieter room.", correct: false },
            { text: "Putting the most important item first and ending when it is settled.", correct: true },
            { text: "Asking the person to bring a family member.", correct: false },
          ], feedbackCorrect: "Yes. Order is always within the worker's control and it moves the decision to the part of the meeting the person can use.", feedbackIncorrect: "Both other changes help and depend on things outside the worker's control. The agenda order does not." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Brain injury: what to change",
    subtitle: "A one-page reference for anyone who meets with, assesses or supports people living with brain injury",
    quote: "The meeting captures the person at their best, and the support needs live in the hours the meeting does not see.",
    use: {
      purpose: "Build interactions for the injury rather than around it: short, early, quiet, important thing first, written afterwards, informed by people who see the person across days.",
      remember: ["Preserved speech hides memory, initiation, fatigue and awareness effects.", "Past the fatigue threshold, nodding continues and nothing goes in.", "Impaired awareness is not denial; evidence does not fix it and confrontation costs the relationship.", "Behavior that tracks time, noise, length and surprise is describing the environment."],
      doNext: "Run the interaction review on your own practice and put the important thing first at your next meeting.",
    },
    sections: [
      { heading: "Before a meeting", items: ["Morning, if possible. Home or phone, if possible.", "One topic. The most important thing first.", "One or two voices.", "Gather information from someone who sees the person daily."] },
      { heading: "During a meeting", items: ["Slow down. One idea at a time. Check, do not ask if it was understood.", "Warn before any change of topic.", "Answer repeated questions as though for the first time.", "End when the important thing is settled, whatever else was planned."] },
      { heading: "After a meeting", items: ["Written summary the same day: decision first, next step second, under a page.", "A short call two days later.", "Record circumstances, not character.", "If a plan is failing at home, ask what the meeting could not see."] },
    ],
  },
  sources: [
    { title: "Minnesota Brain Injury Alliance", href: "https://www.braininjurymn.org/", note: "Minnesota resource on brain injury, including effects, supports and resource facilitation." },
    { title: "Brain Injury Association of America", href: "https://www.biausa.org/", note: "National information on brain injury, its effects and living with brain injury." },
    { title: "Minnesota Department of Human Services, brain injury waiver", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/services/home-community/programs-and-services/bi-waiver.jsp", note: "State information on the brain injury waiver and the services it funds." },
    { title: "Centers for Disease Control and Prevention, traumatic brain injury", href: "https://www.cdc.gov/traumatic-brain-injury/", note: "Federal public health information on traumatic brain injury, its effects and recovery." },
    { title: "Model Systems Knowledge Translation Center, traumatic brain injury", href: "https://msktc.org/tbi", note: "Research-based factsheets for people living with brain injury and those who support them, including fatigue, memory and awareness." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
