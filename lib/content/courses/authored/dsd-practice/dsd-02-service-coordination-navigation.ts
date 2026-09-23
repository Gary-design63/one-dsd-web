import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 2: Service coordination and navigation.
// Program-authored for staff who coordinate, refer, hand off or design the paths people travel between services.
const pack: CoursePack = {
  course: {
    id: "dsd-02-service-coordination-navigation",
    indexNumber: 1182,
    seriesLabel: "DSD Service System · Foundations",
    title: "Service Coordination and Navigation",
    subtitle: "What coordination actually costs the person being coordinated, where handoffs drop people, and how to design a path that holds together when nobody is watching it.",
    scope: "For care coordinators, case managers, intake and referral staff, program staff who design service paths, and supervisors who set expectations about follow-through. Four short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, a handoff sort, scenarios, flashcards, and a navigation-load review you can run on a path you own",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-service-coordination.jpg",
    coverAlt: "Two staff members and a woman using a laptop work through a referral together at a shared table.",
    introTranscript: "Coordination is usually described from the coordinator's side: the calls made, the referrals sent, the plan written. This module looks at it from the other side — what the person has to carry between one service and the next. Most of what gets called disengagement is navigation load that finally exceeded what someone had. The four lessons cover what coordination is for, where handoffs break, how waiting is experienced and recorded, and how to run a navigation-load review on a path you own. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Distinguish coordination that reduces what a person carries from coordination that adds to it.",
        "Identify the four points where handoffs most often drop people, and name the repair for each.",
        "Describe what waiting does to a person's engagement and how records can misattribute it.",
        "Run a navigation-load review on one service path and name a single change with an owner.",
      ],
      evidence: [
        "A sort separating coordination that carries load from coordination that transfers it.",
        "Four scenario decisions and four knowledge checks with explanations.",
        "A completed navigation-load review naming one drop point, one cause and one owner.",
      ],
      appliedNextStep: "Take one path a person travels between two services you touch, count every action the person must take, and remove or absorb one of them.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in lead agency roles or case management structure", "Change in assessment or reassessment process", "Change in how referrals or waiting are recorded", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's coordinator, plan or services go to the responsible lead agency or program office; this course builds practice, it does not decide a case.",
      toolkitQuestion: "Between these two services, who is carrying the connection — the system, or the person?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-service-coordination-1",
        number: 1,
        title: "What coordination is for",
        summary: "Separate the coordination that lifts load off a person from the coordination that quietly hands it back.",
        minutes: 12,
        learning: {
          objective: "Explain the purpose of coordination in terms of what the person no longer has to carry, and identify three routine practices that transfer load rather than absorb it.",
          takeaways: [
            "Coordination exists so that the person does not have to be the integration point between services that do not talk to each other.",
            "A referral that ends with the person holding a phone number has moved work, not done it.",
            "The measure of coordination is not how many contacts were made but how many actions the person still has to take.",
          ],
          evidence: "A sort separating absorbed load from transferred load, a scenario and a knowledge check.",
          appliedNextStep: "Look at the last three referrals you made and count how many actions each left with the person.",
        },
        scenario: {
          context: "A coordinator finishes a planning visit and tells the person: \"I've written down three places that can help with transportation. Give them a call and let me know how it goes.\" The person agrees and nothing happens.",
          prompt: "What is the most accurate reading of what occurred?",
          options: [
            { label: "The person was not ready to act, and the coordinator should follow up in a month.", response: "This explains nothing and delays finding out. Readiness is not usually what is missing; a phone call to an unknown office, during business hours, with an uncertain script, is a substantial ask." },
            { label: "Three unfamiliar calls were handed to the person as homework, each one a chance to stop; coordination would have meant one call made together, or one made on their behalf with permission.", response: "This names the actual mechanism. Every action transferred is a point where the path can end, and the person most likely to stop is the one with the least slack in their week.", recommended: true },
            { label: "The information was accurate and complete, so the coordination was sound.", response: "Accuracy is necessary and not sufficient. A correct list of three numbers can still be the reason nothing happens." },
          ],
        },
        transfer: {
          prompt: "Which of your routine practices hands actions back to the person?",
          options: ["Count the actions left with the person in your last three referrals", "Pick the one that would be easiest for you to absorb and absorb it next time", "Ask one person you work with what the hardest step was"],
        },
        blocks: [
          { type: "text", heading: "The integration point", body: "<p>Services are organized by funding, authority and program, and a person's life is not. Somewhere the two have to meet. Coordination is the decision that the meeting point will be a role inside the system rather than the person themselves.</p><p>When coordination is working, the person experiences fewer separate relationships than the number of services they receive. When it is not working, the person experiences more: they become the one who remembers what each office needs, repeats their story, notices when something has not happened, and calls to ask why. That is a job. It is usually unpaid, usually invisible in any record, and falls hardest on people who have the least capacity to hold it.</p>" },
          { type: "list", heading: "Signs the person has become the integration point", items: ["They can describe the process better than the staff who administer parts of it.", "They are the only one who knows what every involved office is waiting for.", "They repeat the same personal history to four people in a month.", "They are the one who notices that a step was missed.", "A change in one service reaches the others only because the person mentioned it.", "When they stop making calls, the whole arrangement stops."] },
          { type: "sorting", id: "dsd-service-coordination-1-sort", heading: "Absorbed load or transferred load?", categories: ["Absorbed", "Transferred"], items: [
            { text: "The coordinator places the call while the person is present and hands over once the other office is on the line.", category: "Absorbed" },
            { text: "The person is given a list of three agencies to contact.", category: "Transferred" },
            { text: "The coordinator sends the assessment already on file so the person is not asked for it again.", category: "Absorbed" },
            { text: "The person is asked to bring the same documents they provided at intake.", category: "Transferred" },
            { text: "The coordinator confirms the appointment was made and tells the person the date.", category: "Absorbed" },
            { text: "The person is told to follow up if they do not hear anything within two weeks.", category: "Transferred" },
          ] },
          { type: "leaderMove", heading: "Count the asks, not the contacts", control: "You control what your team counts as a completed referral. Counting contacts made rewards volume; counting actions left with the person rewards coordination.", failure: "Do not treat a list of resources as a service delivered. It is a service offered, and the difference shows up entirely in outcomes you do not see.", next: "At your next team meeting, ask everyone to bring one referral and count the actions it left with the person." },
          { type: "knowledgeCheck", id: "dsd-service-coordination-1-check", question: "A team's referral numbers are strong and its connection numbers are weak. What is the most likely explanation?", options: [
            { text: "The receiving agencies are not responsive enough.", correct: false },
            { text: "The referral process ends at the point of handing over information, so every referral becomes a set of actions for the person, and each action is a place to stop.", correct: true },
            { text: "The people referred are not motivated to follow through.", correct: false },
          ], feedbackCorrect: "Yes. A gap between referrals made and connections completed almost always sits in what happens between them, and what happens between them is usually the person alone.", feedbackIncorrect: "Both other answers place the cause outside the process, which is where it is least likely to be and hardest to fix." },
        ],
      },
      {
        id: "dsd-service-coordination-2",
        number: 2,
        title: "Where handoffs drop people",
        summary: "Learn the four recurring failure points in a handoff, and the specific repair for each.",
        minutes: 12,
        learning: {
          objective: "Name the four common handoff failures and state the repair for each in terms a receiving office could act on.",
          takeaways: [
            "A handoff fails at four predictable points: nobody owns the gap, the receiving office does not know it is receiving, the person is not told what to expect, and no one checks whether it landed.",
            "Ownership of the gap is the single highest-value repair, because it converts a silence into somebody's work.",
            "A handoff is complete when the receiving service has confirmed contact, not when the sending service has sent something.",
          ],
          evidence: "A tabs walk through the four failure points, a scenario decision and a knowledge check.",
          appliedNextStep: "Choose one handoff you are part of and define, in writing, who owns the gap and what confirms arrival.",
        },
        scenario: {
          context: "A person is discharged from a hospital stay with a recommendation for home care supports. The referral is faxed to the county. Six weeks later the person's condition has worsened and no service has started. Each office can show that it did its part.",
          prompt: "Where does the repair belong?",
          options: [
            { label: "With the hospital, which should have confirmed receipt.", response: "Confirmation would have helped, and naming one office as the cause tends to end the inquiry before it reaches the design problem underneath." },
            { label: "In the gap itself: define who holds the person between send and start, what counts as arrival, and by when someone must notice that arrival has not happened.", response: "This is the repair that survives staff turnover and works regardless of which two offices are involved. The failure was not an error by either party; it was an unowned interval.", recommended: true },
            { label: "With the county, which should have processed the referral faster.", response: "Speed is a real issue and is downstream of the same problem. If nobody owns the interval, nobody is accountable for its length either." },
          ],
        },
        transfer: {
          prompt: "Pick one handoff you are part of. Who owns the gap?",
          options: ["Write down the name or role that holds the person between send and start", "Define what counts as arrival and who confirms it", "Set the interval after which someone must notice nothing happened"],
        },
        blocks: [
          { type: "text", heading: "The interval nobody owns", body: "<p>Most handoff failures are not errors. Each office does its part correctly and the person still falls through, because the interval between the parts belongs to no one. The sending office's responsibility ends at sending. The receiving office's begins at receiving. Between those two points there is a space, and people disappear into it without any record of having done so.</p><p>This is a design property, not a performance problem, which is why it is not fixed by asking staff to try harder. It is fixed by naming an owner for the interval and defining what ends it.</p>" },
          { type: "tabs", heading: "Four failure points and their repairs", tabs: [
            { label: "Nobody owns the gap", body: "<p><strong>What happens:</strong> The referral is sent and the person is between systems. Neither office has a task open. Time passes with no one accountable for it.</p><p><strong>Repair:</strong> Name a role that holds the person until arrival is confirmed. One name, written down, with a defined end to their responsibility.</p>" },
            { label: "The receiver does not know", body: "<p><strong>What happens:</strong> The referral arrives in a queue, an inbox or a fax tray that is checked on an uncertain rhythm. No person has been assigned. The referral is not lost; it is simply unaddressed.</p><p><strong>Repair:</strong> Require acknowledgement within a stated window, and treat a missing acknowledgement as an event someone acts on rather than a silence.</p>" },
            { label: "The person is not told what to expect", body: "<p><strong>What happens:</strong> The person leaves the conversation without knowing who will contact them, from what number, within what time, or what to do if nothing comes. An unexpected call from an unknown number goes unanswered.</p><p><strong>Repair:</strong> Tell the person the name of the service, the likely caller, the window, and one number they can call if the window passes. Put it in writing in whatever form they can use.</p>" },
            { label: "Nobody checks whether it landed", body: "<p><strong>What happens:</strong> The absence of a complaint is treated as success. People who fall out rarely complain; they are the least likely to have the capacity to.</p><p><strong>Repair:</strong> Make the check a scheduled task rather than a courtesy. A short call at a fixed interval finds more than any report will.</p>" },
          ] },
          { type: "statement", body: "A handoff is complete when the receiving service has made contact with the person, not when the sending service has sent something." },
          { type: "leaderMove", heading: "Make silence an event", control: "You control whether a missing acknowledgement generates a task or generates nothing. Most systems are built so that silence is the cheapest possible outcome.", failure: "Do not rely on the person to report that nothing happened. The people least able to do that are the ones this most often happens to.", next: "Pick one handoff and set a date by which a missing confirmation becomes somebody's task." },
          { type: "knowledgeCheck", id: "dsd-service-coordination-2-check", question: "A team wants to reduce people lost between referral and service start. Which single change is likely to do the most?", options: [
            { text: "Add a reminder to the referral form telling the person to follow up.", correct: false },
            { text: "Assign a named owner for the interval between send and confirmed arrival, and make a missing confirmation generate a task.", correct: true },
            { text: "Increase the detail in the information sent with the referral.", correct: false },
          ], feedbackCorrect: "Yes. Unowned intervals are where people are lost, and the only reliable repair is to make the interval belong to someone.", feedbackIncorrect: "Both other answers improve the message without changing who is responsible when nothing happens, which is the actual failure." },
        ],
      },
      {
        id: "dsd-service-coordination-3",
        number: 3,
        title: "Waiting, and what the record says about it",
        summary: "Understand what a long wait does to a person's engagement, and how records convert a system fact into a personal one.",
        minutes: 12,
        learning: {
          objective: "Explain how waiting changes what a person does, and identify record categories that describe the person when they should describe the process.",
          takeaways: [
            "A long wait is not neutral time: arrangements are made, other paths are taken, hope is spent, and by the time the offer arrives the person's situation has changed.",
            "Categories such as declined, withdrawn or not engaged attribute to the person an outcome the wait produced.",
            "Recording what was waited for and how long makes a capacity problem visible; recording only the person's response makes it invisible.",
          ],
          evidence: "A sort distinguishing process facts from person attributions, a scenario and a knowledge check.",
          appliedNextStep: "Look at one closure category you use and ask whether it leaves the question open or closes it.",
        },
        scenario: {
          context: "A person contacted about an opening says they no longer need the service. The worker records it as declined. Reviewing the file, you see the request was made fourteen months earlier, when the person's mother was still providing daily support.",
          prompt: "What should the record show?",
          options: [
            { label: "Declined is accurate; the person said no.", response: "It is literally accurate and it will be read as a statement about the person's need. Fourteen months later the offer no longer matched a situation that had changed, and that is the finding worth keeping." },
            { label: "Record that the offer came after a fourteen-month wait and that circumstances had changed, so the wait and the mismatch stay visible alongside the person's answer.", response: "This keeps the fact that matters. Aggregate enough of these and you have evidence about capacity; keep only the word declined and you have a story about people not wanting services.", recommended: true },
            { label: "Record it as no longer eligible.", response: "This is less accurate than declined and has the same effect of ending the inquiry, with an added error in it." },
          ],
        },
        transfer: {
          prompt: "What do your closure categories make it impossible to see?",
          options: ["List the categories used to close a request in your area", "Mark which ones describe the person and which describe the process", "Propose one category change that keeps the wait visible"],
        },
        blocks: [
          { type: "text", heading: "What a wait actually does", body: "<p>Waiting is usually recorded as an interval, as though nothing happens inside it. A great deal happens inside it. A family member takes on support they cannot sustain. A person moves in with a relative, or does not move at all. A job is turned down because the support to hold it is not there. Savings go. Health changes. Someone who could have used a small amount of help early needs a large amount later.</p><p>There is also what repeated waiting teaches. A person who has asked before and waited learns something about whether asking is worth the effort, and that learning is durable. When they do not ask the next time, the system records nothing at all.</p>" },
          { type: "sorting", id: "dsd-service-coordination-3-sort", heading: "Process fact or attribution to the person?", categories: ["Process fact", "Attribution to the person"], items: [
            { text: "Offer made fourteen months after request.", category: "Process fact" },
            { text: "Client declined services.", category: "Attribution to the person" },
            { text: "Three contact attempts made to a number disconnected between request and offer.", category: "Process fact" },
            { text: "Family not engaged.", category: "Attribution to the person" },
            { text: "Circumstances changed during the wait; support previously provided by a parent no longer available.", category: "Process fact" },
            { text: "Not motivated to pursue services.", category: "Attribution to the person" },
          ] },
          { type: "accordion", heading: "Three questions worth asking about any wait", items: [
            { title: "What is being waited for, exactly?", body: "<p>An assessment, an eligibility decision, an opening, a provider with capacity, and a worker assignment are different waits with different causes and different owners. A single number that combines them cannot be acted on by anyone.</p>" },
            { title: "What is the person doing during the wait?", body: "<p>If the answer is nothing, the arrangement is more fragile than it looks. Something is holding the situation together, and it is usually a person whose own capacity is finite.</p>" },
            { title: "Who finds out when the wait becomes harmful?", body: "<p>In most designs, nobody. Adding one check partway through a long wait is among the cheapest changes available and among the most likely to find something.</p>" },
          ] },
          { type: "quote", text: "The wait is part of the service. It is experienced, it has effects, and it is almost never described in the record of what the person received." },
          { type: "knowledgeCheck", id: "dsd-service-coordination-3-check", question: "Why is a closure category such as \"not engaged\" a problem even when nothing untrue was recorded?", options: [
            { text: "It is unkind language and should be softened.", correct: false },
            { text: "It states a conclusion about the person that stops anyone asking what the process required of them, so the same cause keeps producing the same closures.", correct: true },
            { text: "It is too vague to be useful for reporting.", correct: false },
          ], feedbackCorrect: "Yes. The harm is that the category ends inquiry. What is lost is the pattern that would have shown up across many files.", feedbackIncorrect: "The issue is not tone or precision, it is that the category answers the question before anyone asks it." },
        ],
      },
      {
        id: "dsd-service-coordination-4",
        number: 4,
        title: "A navigation-load review you can run",
        summary: "Run a short structured review of one path a person travels, and leave with one change, one owner and one review point.",
        minutes: 12,
        learning: {
          objective: "Complete a five-question navigation-load review on a real path and produce one change with a named owner and a review point.",
          takeaways: [
            "Counting the actions required of the person is the fastest way to find where a path loses people.",
            "The step that asks the most is rarely the step that looks hardest from inside the process.",
            "A review produces nothing unless it ends with one change, one name and one date.",
          ],
          evidence: "A completed review of one path, naming actions required, the heaviest step, one change and one owner.",
          appliedNextStep: "Run the review on one path this month and send the finding to whoever owns that path.",
        },
        scenario: {
          context: "You run the review on an intake path and find eleven separate actions required of the person before any service begins. Your manager asks which one to change first.",
          prompt: "How do you choose?",
          options: [
            { label: "Start with the action that generates the most staff work, since that is the clearest saving.", response: "Staff effort is worth reducing and it is a different question. The path is losing people, and the step that costs staff most is not usually the step that costs the person most." },
            { label: "Start with the step where people most often stop, and among those, the one whose assumed capability the fewest people have.", response: "This targets the loss directly. A step that requires a printer, a weekday morning free, or an uninterrupted phone call fails specific people predictably, and that is where the change pays.", recommended: true },
            { label: "Start with the first action, since removing it helps everyone who enters.", response: "Sometimes right, often not. The first step is frequently the easiest one; the loss usually concentrates later, where the process has already spent the person's patience." },
          ],
        },
        transfer: {
          prompt: "Which path will you review, and who owns it?",
          options: ["Name the path and the two services it connects", "Count every action required of the person from first contact to service start", "Send the finding to the owner with one proposed change and a date to look again"],
        },
        blocks: [
          { type: "text", heading: "Walk it as the person, not as the process", body: "<p>Process maps are drawn from the inside: boxes for the work the organization does, arrows for what moves between them. A navigation-load review is drawn from the outside. Every action the person must take is a box. Everything the organization does is an arrow. The picture that results is usually unfamiliar to the people who run the process, which is the point.</p>" },
          { type: "list", heading: "The five questions", ordered: true, items: ["How many separate actions must the person take between first contact and service start? Count each call, form, document, appointment and trip.", "Which action requires the most of them — the most time, the most organization, the most confidence, the most privacy given up?", "What capability does each action quietly assume, and who does not have it?", "Where do people most often stop, and how would you know?", "What is one change, who owns it, and when will you look again?"] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Navigation-load review", summary: "One page that turns a walk-through into a change with an owner. Keep it short enough that running it again is easy.", fields: [
            { label: "Path reviewed", value: "From first contact with ___ to start of ___" },
            { label: "Actions required of the person", value: "Count, then list the three heaviest" },
            { label: "Heaviest step and why", value: "What it assumes; who does not have it" },
            { label: "Where people stop", value: "What tells you, and what would tell you better" },
            { label: "One change, one owner, one date", value: "Named person; a date to look again" },
          ], action: "Run it on one path, then send the page to whoever owns that path." },
          { type: "leaderMove", heading: "Make the finding somebody's", control: "You control whether the review ends in a document or in an assignment. A finding without an owner is an observation, and observations do not change paths.", failure: "Do not let the review become a standing agenda item. One change, made and checked, is worth more than a complete inventory nobody acts on.", next: "Send this week's finding to one named person with one proposed change and one date." },
          { type: "flashcards", heading: "What you are looking for", cards: [
            { front: "An assumed capability", back: "<p>Something the step quietly requires: a printer, a weekday morning, a phone with minutes, a quiet room, reading English, a stable address. Usually the cheapest thing to fix once it is named.</p>" },
            { front: "A transferred action", back: "<p>Work the organization could do that the person is asked to do instead. Each one is a place where the path can end.</p>" },
            { front: "An unowned interval", back: "<p>Time between two services during which no role holds the person. The most common place people are lost and the least likely to appear in any record.</p>" },
            { front: "A silence treated as consent", back: "<p>No response read as no need. The people least able to respond are the ones this reading fails.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-service-coordination-4-check", question: "Your review finds that a required in-person appointment loses people, but the appointment exists because an identity check must happen. What follows?", options: [
            { text: "Remove the appointment; losing people is the greater harm.", correct: false },
            { text: "Keep what the appointment protects and change how it is done — a different channel, a wider window, or verification from information already held — then check whether the loss falls.", correct: true },
            { text: "Keep the appointment as it is, since the check is required.", correct: false },
          ], feedbackCorrect: "Yes. The useful question is whether the protection can be delivered another way, which it usually can.", feedbackIncorrect: "Both other answers skip the middle option, which is nearly always available: keep the protection, change the method." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Coordination and handoffs",
    subtitle: "A one-page reference for anyone who sends, receives or designs a handoff",
    quote: "A handoff is complete when the receiving service has reached the person, not when the sending service has sent something.",
    use: {
      purpose: "Reduce what the person has to carry between services, and make the interval between services belong to someone.",
      remember: ["Count the actions left with the person, not the contacts you made.", "Name who holds the person between send and confirmed arrival.", "Treat a missing confirmation as an event, not a silence.", "Record what was waited for and how long, alongside whatever the person answered."],
      doNext: "Run the five-question navigation-load review on one path and send the finding to its owner.",
    },
    sections: [
      { heading: "Before you make a referral", items: ["Ask what you can do now that would otherwise be the person's next action.", "Send information already on file rather than asking for it again.", "Tell the person who will call, from where, and within what window.", "Give one number to use if the window passes."] },
      { heading: "After you make a referral", items: ["Set the date on which a missing confirmation becomes your task.", "Confirm arrival with the receiving service, not with the absence of a complaint.", "If contact failed, record what was tried rather than that the person did not respond."] },
      { heading: "When you record an outcome", items: ["Separate what the process did from what the person decided.", "Keep the length of the wait in the record.", "Choose a category that leaves the question open rather than one that ends it."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities, including case management and coordination roles." },
    { title: "Minnesota Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota's plan for supporting people with disabilities to live, learn, work and participate in the most integrated setting." },
    { title: "Medicaid home and community-based services, Centers for Medicare and Medicaid Services", href: "https://www.medicaid.gov/medicaid/home-community-based-services", note: "Federal description of home and community-based services authorities, including person-centered planning requirements." },
    { title: "Administration for Community Living", href: "https://acl.gov/", note: "Federal agency supporting community living, including no-wrong-door approaches to access and navigation." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
    { title: "Agency for Healthcare Research and Quality, care transitions", href: "https://www.ahrq.gov/", note: "Public research on transitions between settings of care and the points at which people are most often lost." },
  ],
};

export default pack;
