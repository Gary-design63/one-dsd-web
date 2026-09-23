import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 7: Executive function, strengths and support design.
// Program-authored for staff who design processes, write plans, or support people whose difficulty is with organizing rather than understanding.
const pack: CoursePack = {
  course: {
    id: "dsd-07-executive-function-strengths",
    indexNumber: 1187,
    seriesLabel: "DSD Service System · Practice",
    title: "Executive Function, Strengths and Support Design",
    subtitle: "What executive function is, why a process that assumes it fails specific people predictably, how to read behavior as information about the demand rather than the person, and how to design support around what someone does well.",
    scope: "For care coordinators, case managers, direct support staff, program and policy staff who design forms and processes, and supervisors. Four short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Four short lessons with everyday examples, a sort separating capacity from executive demand, scenarios, flashcards on the functions, and a demand review you can run on one process",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-executive-function.jpg",
    coverAlt: "A man in his late twenties at a kitchen table uses a printed weekly checklist and a phone timer to work through a stack of mail.",
    introTranscript: "A great deal of what gets recorded as noncompliance, disengagement or poor motivation is executive function: the set of mental processes that let a person start a task, hold a plan in mind, manage time, switch between things and finish. Many disabilities affect these processes, and almost every service process assumes them. This module covers what executive function is, how to tell a capacity problem from an executive demand, how to read behavior as information about the demand rather than the person, and how to design support around what someone does well. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the main executive functions and explain how a disability can affect them while leaving understanding intact.",
        "Distinguish a capacity problem from an executive demand and identify the demand a given process step places on a person.",
        "Read a behavior commonly recorded as noncompliance as information about the demand, and name the support that would change it.",
        "Run a demand review on one process and redesign one step around the person's strengths.",
      ],
      evidence: [
        "A sort separating capacity from executive demand.",
        "Four scenario decisions and four knowledge checks with explanations.",
        "A completed demand review of one process with one redesigned step.",
      ],
      appliedNextStep: "Take one form or process you use and list every executive function it assumes; then redesign the step that assumes the most.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in the Division's planning tools or forms", "Change in assessment instruments", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's assessment, diagnosis or plan go to the responsible lead agency, clinician or program office; this course builds practice, it does not assess anyone.",
      toolkitQuestion: "What does this step require a person to start, hold, track or finish on their own, and what happens to the people who cannot?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-executive-function-1",
        number: 1,
        title: "What executive function is",
        summary: "Meet the mental processes that let a person start, plan, track and finish, and see how a disability can affect them without touching understanding.",
        minutes: 10,
        learning: {
          objective: "Name the main executive functions and give an example of how each can be affected by a disability while the person's understanding is intact.",
          takeaways: [
            "Executive functions include initiation, working memory, planning, time management, task switching, inhibition and self-monitoring; they are the management layer over what a person knows.",
            "Brain injury, attention differences, autism, some mental health conditions, chronic pain and fatigue all affect executive function; understanding can be entirely intact while the ability to act on it is not.",
            "A person who understands what to do and does not do it is showing an executive gap, not a motivational one, far more often than the record suggests.",
          ],
          evidence: "A flashcard set on the functions, a scenario decision and a knowledge check.",
          appliedNextStep: "Think of one person described as not following through and identify which function the follow-through requires.",
        },
        scenario: {
          context: "A woman in her thirties with a brain injury has been asked three times to submit a renewal form. Each time she agrees, says she understands, and the form does not arrive. Her worker writes that she is not prioritizing her benefits.",
          prompt: "What is the most accurate reading?",
          options: [
            { label: "She understands and is choosing not to act; the note is fair.", response: "She understands. Whether she can initiate an unstructured multi-step task, hold it in mind across days, and finish it without a prompt is a different question, and the injury affects exactly that." },
            { label: "Understanding and doing are separated by initiation, working memory and follow-through, and a brain injury can affect all three; the form has not arrived because the process assumes functions she does not currently have, not because she does not care.", response: "This reads the behavior as information about the demand. It also points to a fix: complete the form together, now, rather than asking a fourth time.", recommended: true },
            { label: "She may not have understood, so the worker should explain the form again.", response: "Explaining again addresses understanding, which is not the gap. She will agree a fourth time and the form will still not arrive." },
          ],
        },
        transfer: {
          prompt: "Which executive function does one person you support most often get recorded as lacking motivation for?",
          options: ["Name the person and the behavior the record describes", "Identify the function the behavior requires: starting, holding, planning, tracking, switching, finishing", "Write down one way the demand could be removed rather than repeated"],
        },
        blocks: [
          { type: "text", heading: "The management layer", body: "<p>Knowing what to do and doing it are different operations. Between them sits a set of mental processes that psychologists group as executive function: getting started, holding a plan in mind while acting on it, estimating and tracking time, shifting from one thing to another, stopping an impulse, and noticing whether the thing is done. These processes are the management layer over knowledge. They decide whether what a person knows turns into what a person does.</p><p>Many disabilities affect this layer directly. Brain injury is the clearest case, and it is far from the only one. The point for practice is that a person can understand a task perfectly, agree to it sincerely, and be unable to initiate it, hold it, or finish it without a structure someone else provides. When that person is recorded as unmotivated or noncompliant, the record is wrong about the mechanism, and everything built on it will be wrong too.</p>" },
          { type: "flashcards", heading: "The functions, and what a gap looks like", cards: [
            { front: "Initiation", back: "<p>Getting started without an external prompt. A gap looks like agreeing to a task and never beginning it. The person is not refusing; the start signal is not firing.</p>" },
            { front: "Working memory", back: "<p>Holding information in mind while using it. A gap looks like losing the thread of a multi-step instruction, or forgetting the purpose of a call halfway through.</p>" },
            { front: "Planning and sequencing", back: "<p>Breaking a goal into ordered steps. A gap looks like knowing the goal and being unable to say what to do first.</p>" },
            { front: "Time management", back: "<p>Estimating how long things take and tracking time as it passes. A gap looks like being consistently late, or believing a task will take ten minutes when it takes two hours.</p>" },
            { front: "Task switching", back: "<p>Moving attention from one thing to another. A gap looks like being stuck on a task, or being unable to return to it after an interruption.</p>" },
            { front: "Inhibition", back: "<p>Stopping an impulse or a habitual response. A gap looks like saying the first thing that comes to mind, or continuing an action after it should have stopped.</p>" },
            { front: "Self-monitoring", back: "<p>Noticing how it is going and whether it is done. A gap looks like a task left ninety percent complete, or a form submitted with a page missing.</p>" },
          ] },
          { type: "leaderMove", heading: "Ask which function, not whether they care", control: "You control the question a team asks when a person does not follow through. Which function does this require is answerable; whether they care is not.", failure: "Do not let motivational language into the record for a behavior that has an executive explanation. The label follows the person and shapes what every future worker expects.", next: "At the next case discussion where someone says a person is not following through, ask which function the follow-through requires." },
          { type: "statement", body: "Understanding and doing are separated by initiation, working memory and follow-through. A gap between them is information about a demand, not a verdict about a person." },
          { type: "knowledgeCheck", id: "dsd-executive-function-1-check", question: "A person can explain exactly what steps are needed to apply for housing and has not started any of them in four months. Which is the most likely explanation?", options: [
            { text: "They do not actually want housing.", correct: false },
            { text: "An executive gap, most likely in initiation or planning, between understanding the steps and beginning them; the support needed is a structure that starts the first step with them.", correct: true },
            { text: "They did not understand the steps as well as they seemed to.", correct: false },
          ], feedbackCorrect: "Yes. Being able to explain the steps rules out understanding as the gap. What remains is the management layer.", feedbackIncorrect: "Neither desire nor understanding is in question when a person can describe the steps accurately. The gap is between knowing and starting." },
        ],
      },
      {
        id: "dsd-executive-function-2",
        number: 2,
        title: "Capacity or demand?",
        summary: "Learn to tell whether a difficulty is in the person's capacity or in what the process demands, and why the answer changes the response.",
        minutes: 12,
        learning: {
          objective: "Distinguish a capacity limitation from an executive demand imposed by a process, and identify the demand a given step places on a person.",
          takeaways: [
            "A capacity limitation is something the person cannot currently do; an executive demand is something the process requires them to do on their own. The same difficulty can be either, depending on the step.",
            "Most service processes stack demands: initiate a call, hold a reference number, sequence documents, track a deadline, and notice when something is missing. Each one is a place to fail.",
            "Reducing the demand is almost always cheaper and faster than building the capacity, and it helps everyone who enters the process.",
          ],
          evidence: "A sort separating capacity from demand, a tabs walk through a common process, a scenario decision and a knowledge check.",
          appliedNextStep: "Take one process you use and list the executive demand of each step.",
        },
        scenario: {
          context: "A renewal process requires a person to notice a letter, read it, gather three documents from different places, call to schedule an appointment during business hours, attend it, and follow up if they do not hear back. A team meeting reviews why so many renewals lapse and concludes that people need more reminders.",
          prompt: "What is the most useful contribution?",
          options: [
            { label: "Agree; reminders will help people remember.", response: "Reminders address one function, working memory, and leave initiation, sequencing, time management and self-monitoring untouched. The people who lapse most will still lapse." },
            { label: "Name the six separate executive demands in the process and propose removing or absorbing the heaviest ones — for instance, scheduling the appointment for the person, sending the documents already on file, and making the follow-up the office's task rather than theirs.", response: "This treats the lapse rate as a property of the process. Each demand removed is a place where fewer people fail, and it costs the office less than chasing them afterward.", recommended: true },
            { label: "Suggest a skills class on managing paperwork.", response: "Building capacity is slow, reaches few people, and asks the person to change so that a process can stay the same. The process is the cheaper thing to change." },
          ],
        },
        transfer: {
          prompt: "Which step in one process you use stacks the most executive demands?",
          options: ["List the steps of one process and the function each requires of the person", "Circle the step that requires the most", "Propose how the office could absorb that demand"],
        },
        blocks: [
          { type: "text", heading: "The same difficulty, two readings", body: "<p>A person who cannot complete a renewal on their own may have a capacity limitation: their working memory or initiation is affected and no amount of process redesign changes that. Or they may be facing an executive demand: the process requires them to initiate, sequence, track and finish on their own, and it is the requirement, not the person, that can be changed. In practice it is almost always both, and the useful question is which one you can act on.</p><p>Capacity is slow to build and belongs to the person. Demand is fast to reduce and belongs to the process. A step that no longer requires the person to remember a reference number helps the person whose memory is affected, and everyone else, immediately. This is why demand review, rather than capacity building, is the first move.</p>" },
          { type: "sorting", id: "dsd-executive-function-2-sort", heading: "Capacity limitation or executive demand?", categories: ["Capacity limitation", "Executive demand"], items: [
            { text: "The person's working memory holds two items reliably and loses the third.", category: "Capacity limitation" },
            { text: "The process requires holding a reference number, a date and a phone extension across a call.", category: "Executive demand" },
            { text: "The person cannot initiate an unfamiliar task without a prompt.", category: "Capacity limitation" },
            { text: "The letter says to call to schedule, without a time, a name or a number to call.", category: "Executive demand" },
            { text: "The person cannot reliably estimate how long a task takes.", category: "Capacity limitation" },
            { text: "The deadline is thirty days from a date printed on page two.", category: "Executive demand" },
          ] },
          { type: "tabs", heading: "One process, six demands", tabs: [
            { label: "Notice and read", body: "<p><strong>Demand:</strong> Self-monitoring and initiation. The person must notice a letter among others, open it, and read to the action. <strong>Reduce it:</strong> A call or text that names the action in the first sentence.</p>" },
            { label: "Gather documents", body: "<p><strong>Demand:</strong> Planning, sequencing, working memory. Three documents from three places, remembered and assembled. <strong>Reduce it:</strong> Send what is already on file; ask only for what is new.</p>" },
            { label: "Call to schedule", body: "<p><strong>Demand:</strong> Initiation, time management, working memory. Choose a time in business hours, make the call, hold the outcome. <strong>Reduce it:</strong> Offer a time. Let the person confirm or change it.</p>" },
            { label: "Attend", body: "<p><strong>Demand:</strong> Time management, planning. Get there, on the day, with the documents. <strong>Reduce it:</strong> A reminder the day before, and a phone or home option.</p>" },
            { label: "Follow up if nothing happens", body: "<p><strong>Demand:</strong> Self-monitoring, initiation. Notice the absence of a response, decide it has been long enough, and start a call. <strong>Reduce it:</strong> Make the follow-up the office's task.</p>" },
            { label: "The stack", body: "<p>Each demand alone loses some people. Stacked, they lose the people with the most going on, and the lapse gets recorded as theirs.</p>" },
          ] },
          { type: "leaderMove", heading: "Change the demand before the person", control: "You control whether a lapse rate is treated as a training need for people or a design finding for the process. The second is faster, cheaper and reaches everyone.", failure: "Do not send people to skills classes so that a process can stay as it is. The class reaches a few; the redesign reaches all.", next: "Pick the heaviest step in one process and propose how the office absorbs it." },
          { type: "knowledgeCheck", id: "dsd-executive-function-2-check", question: "Why is reducing a process's executive demand usually a better first move than building the person's executive capacity?", options: [
            { text: "Because capacity cannot be built.", correct: false },
            { text: "Because demand belongs to the process and can be changed quickly for everyone, while capacity belongs to the person and changes slowly, one person at a time.", correct: true },
            { text: "Because processes are more important than people.", correct: false },
          ], feedbackCorrect: "Yes. Both matter; the order is about what you can act on fastest and for the most people.", feedbackIncorrect: "Capacity can often be built, and processes are not more important. The point is speed and reach." },
        ],
      },
      {
        id: "dsd-executive-function-3",
        number: 3,
        title: "Behavior as information",
        summary: "Learn to read the behaviors most often recorded as noncompliance as information about a demand, and to name the support that would change them.",
        minutes: 12,
        learning: {
          objective: "For a behavior commonly recorded as noncompliance, name the executive demand it most likely reflects and the support that would change it.",
          takeaways: [
            "Missed appointments, unreturned calls, incomplete forms, abrupt refusals and abandoned tasks each have a common executive reading, and the reading points at a specific support.",
            "The support is almost always external structure: a prompt, a sequence, a time anchor, a person who starts the step alongside them.",
            "Once the support is in place, the behavior usually changes, which is the evidence that the reading was right.",
          ],
          evidence: "An accordion reading five behaviors, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "Pick one behavior in one person's file, write the executive reading, and try the support it implies.",
        },
        scenario: {
          context: "A man in his forties with attention differences arrives forty minutes late to every appointment, apologizes sincerely, and the pattern continues. His file notes a history of lateness and suggests it reflects how much he values the service.",
          prompt: "What is the most useful reading?",
          options: [
            { label: "The file is probably right; a person who valued the service would arrive on time.", response: "Sincere apologies and a stable pattern are what time management gaps look like from the outside. Valuing something and being able to estimate travel time are different capacities." },
            { label: "Consistent lateness with sincere apology is the signature of a time-estimation gap; the support is an external anchor — a call thirty minutes before, a standing time, or a meeting that starts wherever he is — not a note about his values.", response: "This reads the behavior correctly and produces a change to try. If lateness drops with the anchor, the reading was right and the note was wrong.", recommended: true },
            { label: "Schedule his appointments forty minutes earlier than the real time.", response: "It may work and it treats him as a problem to be managed rather than a person to be told what is happening. An honest anchor does the same work without the deception." },
          ],
        },
        transfer: {
          prompt: "Which behavior in one file has an executive reading nobody has written down?",
          options: ["Pick one behavior recorded as noncompliance or disengagement", "Write the executive reading and the support it implies", "Try the support and note whether the behavior changed"],
        },
        blocks: [
          { type: "text", heading: "Read the demand, not the person", body: "<p>Every behavior that gets recorded as noncompliance is also a data point about what the process asked. A missed appointment says something about how the appointment was scheduled and reminded. An unreturned call says something about what returning it would require. An abrupt refusal often says that the person was asked to switch tasks without warning. The reading is not always executive; sometimes a person genuinely does not want the thing. The habit of trying the executive reading first is what keeps the record honest, because it is the reading that produces something to try.</p>" },
          { type: "accordion", heading: "Five behaviors, read as information", items: [
            { title: "Missed appointments", body: "<p><strong>Common reading:</strong> Time management or initiation. The date was known and the day did not arrive as expected, or the leaving-the-house step did not fire. <strong>Support:</strong> A call the morning of, a standing time, transport that arrives rather than transport to arrange.</p>" },
            { title: "Unreturned calls", body: "<p><strong>Common reading:</strong> Initiation and working memory. The voicemail was heard, the intention formed, and the call was not made, or its purpose was lost by the time it was possible. <strong>Support:</strong> Call at a fixed time and say so. Do not require a call back; make the next contact yours.</p>" },
            { title: "Incomplete forms", body: "<p><strong>Common reading:</strong> Sequencing and self-monitoring. Started, stalled at a question requiring another document, or finished with a section missed. <strong>Support:</strong> Complete it together. If not possible, one question per contact.</p>" },
            { title: "Abrupt refusal", body: "<p><strong>Common reading:</strong> Task switching or inhibition. Asked to stop one thing and start another without warning, the person said no before the request was processed. <strong>Support:</strong> Warning before a change; a visible schedule; asking again after a pause.</p>" },
            { title: "Abandoned tasks", body: "<p><strong>Common reading:</strong> Self-monitoring and working memory. The task was left at a point that felt finished, or the person lost track of what remained. <strong>Support:</strong> A checklist with the last step on it; a check-in at the point where people usually stop.</p>" },
          ] },
          { type: "quote", text: "A behavior recorded as noncompliance is also a measurement of what the process asked. Reading it that way is how you find out what to change." },
          { type: "leaderMove", heading: "Make the support the test", control: "You control whether a reading stays a theory or becomes an experiment. Putting the support in place and watching what happens settles it in a week.", failure: "Do not argue about whether a behavior is executive or motivational. Try the support. If the behavior changes, the argument is over.", next: "Pick one person, one behavior, one support, and look at the result in two weeks." },
          { type: "knowledgeCheck", id: "dsd-executive-function-3-check", question: "A person consistently starts forms and leaves them ninety percent complete. What is the most useful support to try first?", options: [
            { text: "A conversation about the importance of finishing what they start.", correct: false },
            { text: "A checklist that includes the final step explicitly, and a check-in timed to the point where they usually stop, since the reading is self-monitoring rather than motivation.", correct: true },
            { text: "Fewer forms.", correct: false },
          ], feedbackCorrect: "Yes. The pattern is the signature of a self-monitoring gap, and the support is external structure at the point of failure.", feedbackIncorrect: "A conversation addresses motivation, which is not the gap. Fewer forms may help and does not address why the ones that remain go unfinished." },
        ],
      },
      {
        id: "dsd-executive-function-4",
        number: 4,
        title: "Designing around strengths",
        summary: "Run a demand review on one process and redesign one step around what the person does well.",
        minutes: 12,
        learning: {
          objective: "Complete a demand review on one process, identify the person's relevant strengths, and redesign one step so that it draws on a strength rather than an affected function.",
          takeaways: [
            "Every person has functions that work well; design that routes around the affected ones and through the strong ones produces support that holds without constant staff effort.",
            "A strength-based redesign asks what the person already does reliably and builds the step out of that: a routine they keep, a person they trust, a tool they already use.",
            "One step redesigned and tested is worth more than a plan that lists every support the person could conceivably need.",
          ],
          evidence: "A list of the review's questions, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Run the demand review on one process for one person this month and test the redesigned step.",
        },
        scenario: {
          context: "Your review finds that a woman with a brain injury cannot initiate calls or track deadlines, and that she keeps a paper calendar religiously, reads everything that arrives by mail, and has a sister she speaks to every Sunday. Her renewal requires a call by a deadline.",
          prompt: "What is the strongest redesign?",
          options: [
            { label: "Assign a worker to call her weekly until the renewal is done.", response: "This works while the worker does it and stops when they stop. It routes through staff effort rather than through anything she does reliably." },
            { label: "Send the deadline by mail in a form she can put in her calendar, schedule the call for her at a set time rather than asking her to initiate it, and, with her permission, let her sister know the date so the Sunday conversation carries it.", response: "This routes the step through three things she already does: reads mail, keeps a calendar, talks to her sister. None of them requires the functions the injury affected, and none of them depends on a worker remembering.", recommended: true },
            { label: "Refer her for cognitive rehabilitation to rebuild initiation.", response: "Rehabilitation may help over time. The renewal is due now, and the redesign that uses what she already has works this month." },
          ],
        },
        transfer: {
          prompt: "Which process, which person, and which strength will the redesigned step run through?",
          options: ["Name the process and the step that fails most often", "List three things the person does reliably", "Redesign the step so it runs through one of them, and test it"],
        },
        blocks: [
          { type: "text", heading: "Route through what works", body: "<p>A person whose initiation is affected may keep a calendar without fail. A person whose working memory is affected may have a partner who remembers everything. A person who cannot track a deadline may read every piece of mail the day it arrives. Strength-based design starts from those facts. It asks what the person already does reliably and builds the step out of that material, so that the step runs through functions that work and around the ones that do not.</p><p>The alternative, routing the step through staff effort, works for exactly as long as the effort lasts. A support that depends on a worker remembering to call is a support that ends when the worker changes, gets busy, or leaves. A support that depends on the person's own Sunday phone call to their sister does not.</p>" },
          { type: "list", heading: "The five questions", ordered: true, items: ["Which step in this process fails most often for this person, and which function does it require?", "What does the person do reliably, without prompting, every day or every week?", "Who in the person's life do they already talk to on a rhythm?", "What tools do they already use: a calendar, a phone, a notebook, a place where things go?", "Redesign the step so it runs through one of those. Test it once. Look at the result."] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Demand review and strength redesign", summary: "One page that names the failing step, the function it requires, the person's reliable strengths, and the redesigned step.", fields: [
            { label: "Process and failing step", value: "Which step; which function it requires" },
            { label: "What the person does reliably", value: "Routines, people, tools" },
            { label: "Redesigned step", value: "The same outcome, routed through a strength" },
            { label: "Test", value: "Try it once; what happened" },
            { label: "One change, one owner, one date", value: "Named person; a date to look again" },
          ], action: "Run it on one process for one person and test the redesigned step." },
          { type: "leaderMove", heading: "Prefer supports that outlast staff", control: "You control whether a support depends on a worker's memory or on something in the person's own life. The second survives turnover; the first does not.", failure: "Do not build a plan that lists every conceivable support. Build one step that works and add the next.", next: "Redesign one step this month so that it runs through something the person already does." },
          { type: "knowledgeCheck", id: "dsd-executive-function-4-check", question: "Why is a support that runs through a person's existing routine preferable to one that runs through a worker's weekly call, if both work?", options: [
            { text: "Because it is less work for staff.", correct: false },
            { text: "Because it does not end when the worker changes, gets busy or leaves; it belongs to the person's life rather than to the service.", correct: true },
            { text: "Because people prefer not to be called.", correct: false },
          ], feedbackCorrect: "Yes. Durability is the reason. A support that belongs to the person's life holds without anyone remembering it.", feedbackIncorrect: "Staff effort and preference are secondary. The reason is that one support survives turnover and the other does not." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Executive function and support design",
    subtitle: "A one-page reference for anyone who designs a process or supports a person through one",
    quote: "Understanding and doing are separated by initiation, working memory and follow-through. A gap between them is information about a demand, not a verdict about a person.",
    use: {
      purpose: "Read follow-through problems as executive demands, reduce the demand before trying to build the capacity, and route support through what the person already does well.",
      remember: ["Initiation, working memory, planning, time, switching, inhibition, self-monitoring: the management layer over knowledge.", "Ask which function, not whether they care.", "Demand belongs to the process and changes fast; capacity belongs to the person and changes slowly.", "Route support through routines, people and tools the person already has."],
      doNext: "Run the demand review on one process for one person and test one redesigned step.",
    },
    sections: [
      { heading: "When a person does not follow through", items: ["Name the function the follow-through requires.", "Ask what the step assumed they could do on their own.", "Try the support the reading implies before writing anything about motivation.", "If the behavior changes, the reading was right."] },
      { heading: "When you design a step", items: ["List the executive demand of each step.", "Absorb the heaviest: schedule for them, send what is on file, make the follow-up yours.", "Warn before a change. Put the last step on the checklist.", "Offer a time rather than asking them to choose one."] },
      { heading: "When you build a support", items: ["Start from what the person does reliably.", "Route the step through a routine, a person or a tool they already use.", "Prefer supports that survive staff turnover.", "Build one step, test it, then add the next."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities." },
    { title: "Brain Injury Association of America, cognitive effects", href: "https://www.biausa.org/", note: "Public information on the cognitive effects of brain injury, including executive function." },
    { title: "Minnesota Brain Injury Alliance", href: "https://www.braininjurymn.org/", note: "Minnesota resource on brain injury, including effects on daily functioning and supports." },
    { title: "Center on the Developing Child, Harvard University, executive function", href: "https://developingchild.harvard.edu/science/key-concepts/executive-function/", note: "Accessible description of the executive functions and how they develop and are affected." },
    { title: "Job Accommodation Network, executive functioning", href: "https://askjan.org/", note: "Practical accommodations and supports for executive function difficulties in work and daily life." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
