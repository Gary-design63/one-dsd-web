import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 13: Coaching and supervising direct support.
// Program-authored for supervisors, leads and coordinators who direct, coach or depend on direct support professionals.
const pack: CoursePack = {
  course: {
    id: "dsd-13-coaching-direct-support",
    indexNumber: 1193,
    seriesLabel: "DSD Service System · Practice",
    title: "Coaching and Supervising Direct Support",
    subtitle: "Who direct support professionals are and what the work actually asks of them, why turnover is the central quality problem in the service system, what coaching does that directing does not, and how to supervise in a way people stay for.",
    scope: "For supervisors and team leads of direct support staff, care coordinators and case managers who depend on direct support, program and quality staff, and leaders who set workforce expectations. Five short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Five short lessons with practice examples, a sort separating coaching from directing, scenarios, a supervision conversation structure, and a retention review you can run on one team",
    duration: "50–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-coaching-direct-support.jpg",
    coverAlt: "A supervisor and a direct support professional talk in a break room doorway, the supervisor listening with a coffee in hand and a notebook closed on the counter.",
    introTranscript: "Almost everything the Division funds is delivered by a direct support professional: the person who is there at six in the morning, who knows how someone likes their coffee, who notices the change nobody else sees. The work is skilled, poorly paid, and turned over at rates that make continuity of support the exception. This module is for the people who supervise that workforce. It covers what the work actually asks, why turnover is the central quality problem, what coaching does that directing does not, how to hold a supervision conversation that develops rather than checks, and how to review one team for the things that make people stay. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe what direct support work actually asks of the people who do it, and explain why it is skilled work.",
        "Explain why turnover is the central quality problem in the service system and name three causes a supervisor can affect.",
        "Distinguish coaching from directing and identify when each is appropriate.",
        "Hold a supervision conversation that develops judgment rather than checking compliance.",
        "Run a retention review on one team and produce one change with an owner.",
      ],
      evidence: [
        "A sort separating coaching from directing.",
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed retention review with one change.",
      ],
      appliedNextStep: "Ask one direct support professional on your team what would make them stay another year, and do one thing about the answer.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Minnesota direct support workforce standards, training requirements or rates", "Change in provider licensing requirements for supervision", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific employee's performance, conduct or employment go through the employer's human resources process; questions about licensing requirements go to the licensing authority. This course builds practice, it does not decide a case.",
      toolkitQuestion: "What did the last person who left this team say on the way out, and what changed because of it?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-coaching-direct-support-1",
        number: 1,
        title: "What the work asks",
        summary: "See direct support as the skilled work it is, and what that means for how it is supervised.",
        minutes: 10,
        learning: {
          objective: "Describe four kinds of judgment direct support work requires and explain why supervision that treats it as task completion misses the work.",
          takeaways: [
            "Direct support requires continuous judgment: reading a person's state, deciding when to step in and when to wait, managing risk without removing choice, and noticing change before anyone else.",
            "The work is skilled in the way nursing and teaching are skilled, and it is paid and supervised as though it were not.",
            "Supervision that checks tasks — was the medication given, was the log filled in — is necessary and misses everything that makes the work good or bad.",
          ],
          evidence: "A flashcard set on the judgments, a statement, a scenario decision and a knowledge check.",
          appliedNextStep: "Shadow one direct support professional for an hour and write down every judgment call you see them make.",
        },
        scenario: {
          context: "A supervisor's weekly check-in with direct support staff covers medication logs, incident reports, timesheets and the cleaning rota. A worker mentions that a man she supports has seemed low for two weeks and she has been sitting with him longer in the evenings. The supervisor notes it and moves to the next item.",
          prompt: "What did the supervisor miss?",
          options: [
            { label: "Nothing; the concern was noted and can be followed up.", response: "The worker described a change she noticed, a judgment she made, and an action she took. All three are the work. The check-in treated them as an aside." },
            { label: "The most important thing said in the meeting: a skilled observation, a judgment about what to do, and a decision to act; the supervisor should have stopped, asked what she was seeing, what she thought it meant, and what she needed, and considered whether a medical or other question follows.", response: "This treats the worker as the skilled observer she is and the supervision as the place where her judgment gets developed. It also catches a possible change from baseline that needs following.", recommended: true },
            { label: "The supervisor should have told her to document it in the log.", response: "Documentation matters and it is the least of what this deserved. The judgment is the thing to engage with." },
          ],
        },
        transfer: {
          prompt: "What judgment did a direct support professional on your team make this week that nobody discussed?",
          options: ["Ask one worker about a decision they made this week", "Ask what they saw, what they thought it meant, and what they did", "Tell them what you learned from the answer"],
        },
        blocks: [
          { type: "text", heading: "Skilled work, treated as tasks", body: "<p>A direct support professional's shift looks, from the outside, like a list of tasks: personal care, meals, medication, transport, logs. Inside the shift is something else. Reading whether a person's silence is contentment or distress. Deciding whether to prompt or wait. Managing a risk the person has chosen to take without taking the choice away. Noticing that something has changed before there is anything to write down. Handling a moment of aggression without escalating it and without making the person smaller. Every one of these is a judgment, made alone, dozens of times a shift.</p><p>This is skilled work in the same sense that nursing and teaching are skilled. It is paid and supervised as though it were not. Supervision that checks tasks — the log, the medication, the rota — is necessary, and it does not touch the part of the work that determines whether the person's life is good.</p>" },
          { type: "flashcards", heading: "Four kinds of judgment, every shift", cards: [
            { front: "Reading the person", back: "<p>Is this silence content or distressed? Is this refusal a preference or pain? Is this the same as yesterday? The most important skill in the work, and the least often discussed in supervision.</p>" },
            { front: "Stepping in or waiting", back: "<p>Prompt or let them try. Help or let them struggle. Intervene or let the moment pass. Every choice has a cost in either direction, and the right one depends on the person and the day.</p>" },
            { front: "Risk without control", back: "<p>The person wants to do something that might not go well. Supporting the choice while reducing the risk they did not choose. Neither refusing nor abandoning.</p>" },
            { front: "Noticing change", back: "<p>Before it is an incident, before it is in the record. The worker who knows a person well is the early warning the whole system depends on.</p>" },
          ] },
          { type: "statement", body: "Supervision that checks tasks is necessary and touches nothing that makes the work good or bad. The work is the judgment, and the judgment is what supervision has to engage." },
          { type: "leaderMove", heading: "Ask about a judgment, every time", control: "You control what supervision is about. Adding one question — tell me about a decision you made this week — changes what the meeting engages.", failure: "Do not let the check-in be entirely about compliance. Compliance is the floor. The work happens above it.", next: "Add the judgment question to every supervision meeting this month." },
          { type: "knowledgeCheck", id: "dsd-coaching-direct-support-1-check", question: "Why does supervision that focuses on task completion miss the substance of direct support work?", options: [
            { text: "Because tasks are not important.", correct: false },
            { text: "Because the work's quality lies in judgments made alone throughout a shift — reading the person, choosing when to act, managing risk, noticing change — and a task check does not engage any of them.", correct: true },
            { text: "Because workers dislike being checked.", correct: false },
          ], feedbackCorrect: "Yes. Tasks are necessary and are the floor. The work is the judgment above it.", feedbackIncorrect: "Tasks matter and checking them is not the issue. The issue is what a task check cannot reach." },
        ],
      },
      {
        id: "dsd-coaching-direct-support-2",
        number: 2,
        title: "Turnover is the quality problem",
        summary: "Understand why turnover in direct support is the central quality problem, and which causes a supervisor can affect.",
        minutes: 10,
        learning: {
          objective: "Explain how turnover degrades the quality of support and name three causes of turnover within a supervisor's influence.",
          takeaways: [
            "Every time a worker leaves, the person they supported loses the relationship, the knowledge, and the early-warning system that came with it; the next worker starts from nothing.",
            "Pay is the largest cause and is mostly outside a supervisor's control; supervision quality, schedule predictability, respect, and whether the worker's judgment is valued are inside it.",
            "People leave supervisors more than they leave jobs, and they stay for the same reason.",
          ],
          evidence: "An accordion on causes, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "Find out why the last three people who left your team said they left, and whether anyone asked.",
        },
        scenario: {
          context: "A team has lost four of nine direct support staff in a year. The manager attributes it to pay and the labor market and says there is nothing to be done until rates change. Exit conversations were not held. Two of the four had said, in the months before leaving, that their schedules changed without notice and that nobody asked their view about the people they supported.",
          prompt: "What is the most useful reading?",
          options: [
            { label: "The manager is right; pay drives turnover and rates are set elsewhere.", response: "Pay is the largest cause. Two of the four named causes that were entirely within the team's control, and nobody asked the other two. Waiting for rates is a way of not acting on what is actionable." },
            { label: "Pay is real and outside reach; schedule instability and unvalued judgment are real and inside it, and the team has evidence of both; the response is to fix what can be fixed and to start asking people why they leave.", response: "This separates what can be changed from what cannot and acts on the first. It also makes the next departure a source of information rather than a shrug.", recommended: true },
            { label: "Hire more people faster to keep up with the losses.", response: "Faster hiring into the same conditions produces faster leaving. The conditions are the problem." },
          ],
        },
        transfer: {
          prompt: "Which cause of turnover on your team is within your control, and what will you do?",
          options: ["List why the last three people left, or find out", "Mark which causes are inside your control", "Change one of them this month"],
        },
        blocks: [
          { type: "text", heading: "What leaves when a worker leaves", body: "<p>When a direct support professional leaves, the person they supported loses more than a staff member. They lose the one who knew how they liked things done, who could tell a good day from a bad one, who had learned their communication, who noticed changes before anyone else. All of that knowledge was in the worker's head and none of it transfers. The next worker starts from a file, and a file does not know anything.</p><p>Multiply this by turnover rates that in many places exceed half the workforce a year and the effect is that continuity of support — the thing that makes support good — is the exception. Every quality problem in the service system runs through this one. Pay is the largest cause and is set far from any supervisor. The other causes are closer.</p>" },
          { type: "accordion", heading: "Causes, and where they sit", items: [
            { title: "Pay and benefits", body: "<p>The largest single cause. Mostly set by rates and outside a supervisor's control. Worth advocating for, not worth waiting for.</p>" },
            { title: "Schedule instability", body: "<p>Shifts changed without notice, mandatory overtime, being called in on days off. Inside a supervisor's control, and among the most common reasons given for leaving.</p>" },
            { title: "Supervision quality", body: "<p>Whether the supervisor is reachable, listens, follows through, and treats the worker as a skilled adult. People leave supervisors. Entirely inside a supervisor's control.</p>" },
            { title: "Whether judgment is valued", body: "<p>Whether the worker's knowledge of the person is asked for, used in planning, and credited. Workers who are treated as task-doers leave; workers whose expertise is recognized stay longer.</p>" },
            { title: "Safety and support after hard events", body: "<p>Whether the worker is supported after an assault, an injury, a death, or a difficult incident, or expected to carry on. Inside a supervisor's control.</p>" },
            { title: "A path forward", body: "<p>Whether there is any way to grow in the role without leaving it. Partly inside, partly organizational.</p>" },
          ] },
          { type: "quote", text: "The file does not know anything. Everything that made the support good was in the worker's head, and it left with them." },
          { type: "leaderMove", heading: "Ask everyone who leaves, and act on one thing", control: "You control whether departures produce information. A twenty-minute exit conversation, held every time, with one thing changed as a result, is the cheapest retention measure available.", failure: "Do not attribute all turnover to pay. It is true enough to be an excuse and it hides the causes you could fix.", next: "Hold an exit conversation with the next person who leaves and change one thing they name." },
          { type: "knowledgeCheck", id: "dsd-coaching-direct-support-2-check", question: "Why is turnover in direct support described as the central quality problem rather than a staffing problem?", options: [
            { text: "Because it is expensive to recruit.", correct: false },
            { text: "Because every departure removes the relationship, knowledge and early-warning capacity that made the person's support good, and none of it transfers to the next worker.", correct: true },
            { text: "Because it makes scheduling difficult.", correct: false },
          ], feedbackCorrect: "Yes. The cost is to the person supported. Recruitment and scheduling are the service's costs; continuity is the person's.", feedbackIncorrect: "Cost and scheduling are real and are the service's problem. The quality problem is what the person loses." },
        ],
      },
      {
        id: "dsd-coaching-direct-support-3",
        number: 3,
        title: "Coaching, not directing",
        summary: "Learn what coaching does that directing does not, and when each is the right tool.",
        minutes: 12,
        learning: {
          objective: "Distinguish coaching from directing, explain what each produces, and identify the situations in which each is appropriate.",
          takeaways: [
            "Directing tells a worker what to do; coaching asks what they see, what they think, and what they would do, and develops the judgment the work depends on.",
            "Directing is right when there is one correct answer, a safety issue, or a rule; coaching is right for everything else, which is most of the work.",
            "A team that is only directed learns to wait for instructions; a team that is coached learns to think, and thinks when the supervisor is not there, which is always.",
          ],
          evidence: "A sort separating coaching from directing, a tabs comparison, a scenario decision and a knowledge check.",
          appliedNextStep: "In your next conversation about a difficult situation, ask three questions before you give one instruction.",
        },
        scenario: {
          context: "A worker calls her supervisor: a woman she supports is refusing to go to a medical appointment that took two months to arrange. The supervisor has handled this before and knows what usually works.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Tell the worker what usually works and have her do it.", response: "It may work today. The worker has learned that when something is hard, she calls, and next time she will call again. Her own judgment about this person, whom she knows better than the supervisor, has not been engaged." },
            { label: "Ask what the worker is seeing, what she thinks is behind the refusal, what she has tried, and what she thinks would work; offer what has worked before as one option; and let her decide, unless there is a safety reason to direct.", response: "This develops the worker's judgment on a real problem, uses her knowledge of the person, and leaves her more capable next time. The supervisor's experience is offered, not imposed.", recommended: true },
            { label: "Tell her to reschedule and move on.", response: "Two months of waiting lost, and a worker who has learned that difficulty is resolved by avoidance." },
          ],
        },
        transfer: {
          prompt: "Which of your habitual instructions could become a question?",
          options: ["Recall the last three times you told a worker what to do", "For each, decide whether there was one right answer or several", "For the ones with several, write the question you could have asked instead"],
        },
        blocks: [
          { type: "text", heading: "Two tools, different products", body: "<p>Directing and coaching are both legitimate. They produce different things. Directing produces an action: the worker does what they were told. Coaching produces judgment: the worker thinks the situation through, decides, and is more able to do so next time. Because direct support happens almost entirely when no supervisor is present, judgment is what the work runs on, and coaching is how it is built.</p><p>Directing is the right tool when there is one correct answer, when safety requires immediate action, or when a rule applies. Those situations exist and are a small share of the work. The rest — the daily judgments about reading a person, stepping in, managing risk — has no single answer, and a worker who is told what to do in those situations learns only to ask.</p>" },
          { type: "sorting", id: "dsd-coaching-direct-support-3-sort", heading: "Coaching or directing?", categories: ["Coaching", "Directing"], items: [
            { text: "\"What do you think is behind the refusal?\"", category: "Coaching" },
            { text: "\"Give the medication at eight as prescribed; do not adjust the time.\"", category: "Directing" },
            { text: "\"What have you tried, and what happened?\"", category: "Coaching" },
            { text: "\"Call emergency services now and stay with him.\"", category: "Directing" },
            { text: "\"If you had to guess what she needs right now, what would it be?\"", category: "Coaching" },
            { text: "\"The incident report must be filed before the end of shift.\"", category: "Directing" },
          ] },
          { type: "tabs", heading: "When to use which", tabs: [
            { label: "Direct", body: "<p>One correct answer. A safety issue needing action now. A rule or a legal requirement. A new worker in their first days who needs the basics. In each case, say what to do, say why, and move on.</p>" },
            { label: "Coach", body: "<p>A judgment about a person. A situation with several reasonable responses. A worker who knows the person better than you do. Anything that will recur when you are not there. Ask before you tell, and tell as an option.</p>" },
            { label: "The default", body: "<p>Coach, unless one of the reasons to direct applies. Most supervisors default the other way, because directing is faster in the moment. It is slower over a year.</p>" },
          ] },
          { type: "leaderMove", heading: "Three questions before one instruction", control: "You control the ratio of questions to instructions in your conversations. Shifting it is the whole of the move from directing to coaching.", failure: "Do not coach a safety issue. Direct it, then coach the reflection afterwards.", next: "In your next difficult-situation call, ask what the worker sees, thinks and would do before you say anything." },
          { type: "knowledgeCheck", id: "dsd-coaching-direct-support-3-check", question: "Why is coaching, rather than directing, the default for most direct support situations?", options: [
            { text: "Because workers prefer to be asked.", correct: false },
            { text: "Because the work happens when no supervisor is present, so it runs on the worker's judgment, and coaching is what builds judgment while directing builds only the habit of asking.", correct: true },
            { text: "Because directing is disrespectful.", correct: false },
          ], feedbackCorrect: "Yes. The product of coaching is judgment, and judgment is what the work needs when the supervisor is not there, which is always.", feedbackIncorrect: "Preference and respect are secondary. The reason is what each tool produces and what the work runs on." },
        ],
      },
      {
        id: "dsd-coaching-direct-support-4",
        number: 4,
        title: "A supervision conversation that develops",
        summary: "Hold a supervision conversation structured to develop judgment rather than check compliance.",
        minutes: 12,
        learning: {
          objective: "Hold a supervision conversation using a structure that engages the worker's observations, judgments and needs, and ends with one thing the supervisor will do.",
          takeaways: [
            "The structure has four parts: what have you noticed about the people you support, what decision did you make that you are unsure about, what do you need from me, and what will I do by when.",
            "Compliance items belong at the end, briefly, not at the start where they set the tone.",
            "The conversation ends with an action by the supervisor, because supervision that only produces actions for the worker teaches that supervision is where work is assigned.",
          ],
          evidence: "A list of the structure, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Use the structure for your next three supervision conversations and note what comes up that did not before.",
        },
        scenario: {
          context: "A supervisor tries the new structure. The worker, asked what she has noticed, says nothing much. Asked about a decision she was unsure of, she says she just does her job. The supervisor is tempted to return to the compliance list.",
          prompt: "What is the most useful move?",
          options: [
            { label: "Return to the compliance list; the worker is not interested in this kind of conversation.", response: "The worker has had years of supervision that was a compliance list. She is finding out whether the question is real. Returning to the list answers that it was not." },
            { label: "Stay with it, make the question smaller and specific — one person, one shift, one moment where she was not sure — and wait; then, whatever she says, treat it as the skilled observation it is.", response: "This is how a worker learns that the question is real. It may take several conversations. The first specific answer is the start.", recommended: true },
            { label: "Explain the purpose of the new structure and ask her to prepare answers next time.", response: "Preparation turns it into homework. The point is a conversation, and the first one may be short." },
          ],
        },
        transfer: {
          prompt: "What will you do differently in your next supervision conversation?",
          options: ["Put the four questions in order at the top of your notes", "Move the compliance items to the end", "End with one thing you will do, and a date"],
        },
        blocks: [
          { type: "text", heading: "Structure decides what gets said", body: "<p>Most supervision conversations open with compliance: logs, reports, the rota. This sets the tone. The worker learns that supervision is where they are checked, and the observations and judgments that make up the real work never come up because nothing invited them. Reversing the order — observations first, judgments second, needs third, compliance last and briefly — changes what the conversation is for. And ending with an action by the supervisor, rather than only actions for the worker, makes supervision something that gives as well as asks.</p>" },
          { type: "list", heading: "The structure", ordered: true, items: ["What have you noticed about the people you support since we last spoke? Anything different, anything that worried you, anything good.", "Tell me about a decision you made that you were not sure about. What did you see, what did you think, what did you do?", "What do you need from me? A schedule change, a resource, a conversation with someone, backing on a decision.", "Compliance, briefly: anything outstanding, anything due.", "What I will do, and by when. One thing, written down, checked at the next conversation."] },
          { type: "artifact", kind: "plain-language-flyer", label: "Conversation record", title: "Supervision conversation", summary: "One page that records the worker's observations, a judgment they made, what they need, and the one thing the supervisor will do.", fields: [
            { label: "Noticed", value: "About the people they support" },
            { label: "A judgment", value: "What they saw, thought and did; what you discussed" },
            { label: "What they need", value: "From you, specifically" },
            { label: "Compliance", value: "Briefly" },
            { label: "What I will do, by when", value: "One thing; checked next time" },
          ], action: "Use it for the next three conversations and note what changes." },
          { type: "leaderMove", heading: "End with your action", control: "You control whether supervision produces a task for you. A conversation that always ends with your commitment, kept, is the one workers come to prepared.", failure: "Do not let supervision be a place where work flows only one way. If the worker leaves with three tasks and you leave with none, it was an assignment meeting.", next: "Write your own action at the bottom of every supervision note this month, and check it at the next one." },
          { type: "knowledgeCheck", id: "dsd-coaching-direct-support-4-check", question: "Why does the supervision structure put compliance items at the end?", options: [
            { text: "Because they are unimportant.", correct: false },
            { text: "Because opening with compliance sets the tone that supervision is checking, and the observations and judgments that make up the real work are never invited.", correct: true },
            { text: "Because workers find them boring.", correct: false },
          ], feedbackCorrect: "Yes. Order sets tone, and tone decides what gets said.", feedbackIncorrect: "Compliance matters and is not boring. Its position decides what the conversation is for." },
        ],
      },
      {
        id: "dsd-coaching-direct-support-5",
        number: 5,
        title: "A retention review you can run",
        summary: "Review one team for the things that make people stay, and change one of them.",
        minutes: 10,
        learning: {
          objective: "Complete a retention review of one team and produce one change with a named owner and a review point.",
          takeaways: [
            "The review asks about schedule predictability, supervision reachability, whether judgment is asked for and used, support after hard events, whether exits are asked about, and whether there is any path forward.",
            "Most teams fail on two or three of these, and any one of them changed affects whether the next person stays.",
            "One change made and kept is worth more than a retention strategy nobody implements.",
          ],
          evidence: "A list of the review's questions, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Run the review on your team this month and change one thing.",
        },
        scenario: {
          context: "Your review finds that schedules change with less than a day's notice about once a week, that workers cannot reach a supervisor after hours, that nobody has asked a departing worker why in two years, and that a worker who was assaulted last month returned to the same shift the next day without a conversation.",
          prompt: "Where do you start?",
          options: [
            { label: "With schedule stability, since it affects everyone every week.", response: "Schedule stability matters and is the largest structural item. A worker who was assaulted and not spoken to is an immediate matter, and the conversation should happen this week." },
            { label: "With the assaulted worker: a conversation this week about what happened and what they need; then schedule notice as the structural change; then exit conversations as standing practice.", response: "This sequences by urgency, then by reach. The first item is a person who needs something now; the second affects everyone; the third makes future departures informative.", recommended: true },
            { label: "With after-hours supervisor access, since safety depends on it.", response: "Important and it is a resourcing question that takes longer. The assault conversation and the schedule notice can happen this week." },
          ],
        },
        transfer: {
          prompt: "Which item will you change on your team, and by when?",
          options: ["Run the six questions on your own team honestly", "Pick the most urgent, then the widest-reaching", "Change one this month and write down the date you will look again"],
        },
        blocks: [
          { type: "text", heading: "Things a supervisor can change", body: "<p>Retention strategies tend to be written at the organizational level and address pay, which is right and slow. The retention review is written at the team level and addresses what a supervisor can change this month. It is short, it is honest, and its measure is one thing changed.</p>" },
          { type: "list", heading: "The six questions", ordered: true, items: ["Schedule: how often do shifts change with less than a week's notice? How often is someone called in on a day off?", "Reachability: can a worker reach a supervisor when something goes wrong, including nights and weekends? How long does it take?", "Judgment: when was a worker's view of a person they support last asked for in planning, and used?", "Hard events: after an assault, an injury, a death or a serious incident, what happens for the worker, and how soon?", "Exits: does anyone ask people why they leave, and has anything changed as a result in the last year?", "Path: is there any way to grow in the role without leaving it?"] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Retention review", summary: "One page that answers the six questions for one team and names one change.", fields: [
            { label: "Schedule and reachability", value: "Honest answers; frequency" },
            { label: "Judgment and hard events", value: "Last time asked; what happens after" },
            { label: "Exits and path", value: "Who asks; what changed; what growth exists" },
            { label: "Most urgent; widest-reaching", value: "One of each" },
            { label: "One change, one owner, one date", value: "This month" },
          ], action: "Run it on your team and change one thing." },
          { type: "leaderMove", heading: "Change one thing and keep it", control: "You control whether the review becomes a strategy document or a change. A single item changed and sustained is the retention measure workers notice.", failure: "Do not let the review produce a list of everything wrong that nobody acts on. Workers have seen those lists before.", next: "Run the review this month and change the one item you can keep." },
          { type: "flashcards", heading: "What workers say makes them stay", cards: [
            { front: "\"My supervisor answers.\"", back: "<p>Reachability, especially when something has gone wrong. The single most cited reason in the research on direct support retention.</p>" },
            { front: "\"They asked what I thought.\"", back: "<p>Judgment valued. Workers whose knowledge of the person is used in planning stay longer.</p>" },
            { front: "\"I know my schedule.\"", back: "<p>Predictability. A worker who can plan their life stays; one who cannot leaves for a job where they can.</p>" },
            { front: "\"Someone talked to me after.\"", back: "<p>Support following a hard event. Its absence is among the most common reasons for leaving soon after an incident.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-coaching-direct-support-5-check", question: "Why does the retention review focus on team-level changes rather than pay?", options: [
            { text: "Because pay does not affect retention.", correct: false },
            { text: "Because pay is the largest cause and is set outside the team, while schedule, reachability, judgment, support after hard events, exit conversations and growth are within a supervisor's control this month.", correct: true },
            { text: "Because workers care more about supervision than pay.", correct: false },
          ], feedbackCorrect: "Yes. The review addresses what a supervisor can change now. Pay is worth advocating for and is not within the review's reach.", feedbackIncorrect: "Pay matters most. The review focuses on what is actionable at the team level, which is a different question." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Supervising direct support",
    subtitle: "A one-page reference for anyone who supervises, coaches or depends on direct support professionals",
    quote: "The file does not know anything. Everything that made the support good was in the worker's head, and it left with them.",
    use: {
      purpose: "Supervise direct support as the skilled work it is, coach the judgment it runs on, and change the things within your control that decide whether people stay.",
      remember: ["The work is judgment made alone, dozens of times a shift.", "Turnover is the quality problem; continuity is what the person loses.", "Coach by default; direct for safety, rules and single right answers.", "End supervision with your own action."],
      doNext: "Run the retention review on your team and change one thing this month.",
    },
    sections: [
      { heading: "In every supervision conversation", items: ["Observations first: what have you noticed?", "A judgment: what did you see, think and do?", "What do you need from me?", "Compliance last, briefly. Then what I will do, by when."] },
      { heading: "When a worker calls with a hard situation", items: ["Ask what they see, think and would do before you say anything.", "Offer what has worked before as one option.", "Direct only for safety, a rule, or a single right answer.", "Afterwards, coach the reflection."] },
      { heading: "To keep people", items: ["A week's notice on schedules. Nobody called in on a day off without asking.", "Be reachable, especially when something goes wrong.", "Ask for and use the worker's knowledge of the person.", "Talk to anyone who has had a hard event, within a day.", "Ask everyone who leaves why, and change one thing."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, direct care and support workforce", href: "https://mn.gov/dhs/partners-and-providers/news-initiatives-reports-workgroups/long-term-services-and-supports/workforce/", note: "State information on the direct support workforce, including initiatives and standards." },
    { title: "National Alliance for Direct Support Professionals", href: "https://nadsp.org/", note: "Competency standards, code of ethics and resources for direct support professionals and those who supervise them." },
    { title: "Institute on Community Integration, University of Minnesota", href: "https://ici.umn.edu/", note: "Research on the direct support workforce, turnover, and supervision practice." },
    { title: "PHI, direct care workforce research", href: "https://www.phinational.org/", note: "National research and policy work on the direct care workforce, including retention, supervision and job quality." },
    { title: "Administration for Community Living", href: "https://acl.gov/", note: "Federal agency supporting community living, including work on strengthening the direct care workforce." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
