import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 1: Foundations of Disability Services in Minnesota.
// Program-authored for staff who administer, coordinate or design services in the Disability Services Division.
const pack: CoursePack = {
  course: {
    id: "dsd-01-minnesota-service-system",
    indexNumber: 1181,
    seriesLabel: "DSD Service System · Foundations",
    title: "Foundations of Disability Services in Minnesota",
    subtitle: "How the Division is organized, who it serves, what home and community-based services actually are, and what the most integrated setting requires of the people who administer them.",
    scope: "For staff in the Disability Services Division and colleagues who work alongside it: program and policy staff, care coordinators, case managers, quality and compliance staff, data and evaluation staff, and supervisors and leaders new to this service system. Five short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Five short lessons with Minnesota examples, a waiver comparison, scenarios, sorting and flashcard practice, and a service-path review you can run on your own work",
    duration: "50–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-minnesota-service-system.jpg",
    coverAlt: "A care coordinator and a man in his thirties review a services plan together at his kitchen table.",
    introTranscript: "Most people who join this Division already believe in supporting people with disabilities to live the lives they choose. What takes longer to learn is the machinery: what a waiver is and what it waives, which programs serve whom, what the most integrated setting obligates the state to do, and where in that machinery a person can quietly get stuck. This module is the map. It covers the populations the Division serves, how home and community-based services are funded and organized, what the most integrated setting means in practice, and the points in a service path where people most often fall out. It ends with a review you run on one process you touch. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Describe the groups of Minnesotans the Division supports and explain why the same service question can have different answers across them.",
        "Explain what home and community-based services are, what a waiver waives, and how the main Minnesota waivers differ in whom they serve.",
        "Explain the most integrated setting requirement and identify one place in a current process where a person's options are narrower than the requirement intends.",
        "Trace a person's path from first contact through assessment, eligibility, planning and services, and name the points where people most often drop out.",
        "Run a service-path review on one process you touch and name a single change with an owner and a review point.",
      ],
      evidence: [
        "A waiver sort matching descriptions of people to the programs built for them.",
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed service-path review naming one drop-out point, one cause and one owner.",
      ],
      appliedNextStep: "Choose one process you touch every week. Walk it as a person entering it for the first time, find the step where someone would stop, and change that step or hand the finding to whoever can.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Minnesota waiver structure, eligibility or assessment", "Change in the state's Olmstead commitments", "Change in federal home and community-based settings requirements", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's eligibility, waiver, assessment or services go to the responsible lead agency or program office; this course builds your understanding of the system, it does not decide a case.",
      toolkitQuestion: "At which step of this path does a person have to be at their most organized, and what happens to the people who are not?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-minnesota-service-system-1",
        number: 1,
        title: "Whom the Division serves",
        summary: "Meet the groups of Minnesotans the Division supports, and see why one service question rarely has one answer across them.",
        minutes: 10,
        learning: {
          objective: "Name the main groups the Division supports and explain, with one example, why a single process can work well for one group and poorly for another.",
          takeaways: [
            "The Division supports Minnesotans with developmental disabilities, physical disabilities, brain injuries, chronic medical conditions, and people living with HIV — groups whose needs, histories and service paths differ substantially.",
            "Disability is not a single experience: two people with the same diagnosis can need entirely different supports, and two people with different diagnoses can need the same one.",
            "A process designed around one group's typical path quietly penalizes everyone whose path is different.",
          ],
          evidence: "A sort separating population, support need and process assumption, and a knowledge check.",
          appliedNextStep: "Take one form or process you own and name which group's path it assumes. Then name who it would work least well for.",
        },
        scenario: {
          context: "A program redesigns its intake around a standard sequence: an online form, a scheduled phone assessment within ten business days, and a signed plan returned by post. The team tested it with several people who use developmental disability services and it worked well.",
          prompt: "What is the most useful next step before it goes live?",
          options: [
            { label: "Launch it; the sequence tested well with real participants.", response: "One group's successful test is real evidence, and it is evidence about one group. A person with a recent brain injury managing fatigue, or a person whose condition fluctuates week to week, may meet a ten-day window only on a good fortnight." },
            { label: "Test the same sequence with people whose disabilities make each step behave differently: fluctuating conditions, cognitive fatigue, no reliable postal address, no private place to take a call.", response: "This checks the sequence against the range the Division actually serves, which is what turns one good result into a process that holds.", recommended: true },
            { label: "Add a note offering an alternative to anyone who asks.", response: "An alternative available on request puts the burden on the person least able to carry it, and the people it is meant for are often the least likely to ask." },
          ],
        },
        transfer: {
          prompt: "Which group's path does your most-used process assume, and who does that leave out?",
          options: ["Write down the sequence your process expects and the capabilities each step quietly requires", "Name one group the Division serves for whom a step would be hard, and why", "Ask a colleague who works with that group whether you are right"],
        },
        blocks: [
          { type: "text", heading: "One division, several service histories", body: "<p>The Disability Services Division supports Minnesotans with developmental disabilities, physical disabilities, brain injuries, chronic medical conditions, and people living with HIV. Grouping them under one division makes administrative sense, and it can mislead anyone who assumes it also means one path, one set of needs or one relationship with public systems.</p><p>These groups arrive by different routes. A person with a developmental disability may have been known to public systems since childhood, with a school record, a family who has navigated services for years, and a long relationship with a county worker. A person with a brain injury after a car accident may be encountering all of this for the first time as an adult, mid-career, while also relearning how to manage a calendar. A person with a chronic medical condition may cycle in and out of needing support as their health changes. A person living with HIV may have had every reason to be careful about what gets written down about them.</p><p>The support each needs differs, but so does what the process itself costs them. That second difference is the one most often missed in design.</p>" },
          { type: "list", heading: "What varies across the groups the Division serves", items: ["When disability entered the person's life: at birth, in childhood, or suddenly in adulthood.", "Whether the person's needs are stable, progressive, or fluctuating week to week.", "Whether a family has been involved for decades, recently, or not at all.", "How much prior experience the person has with public systems, and whether that experience was good.", "How much privacy the condition has historically required, and what disclosure has cost before.", "Which other systems are already involved: health care, schools, corrections, housing, employment."] },
          { type: "sorting", id: "dsd-minnesota-service-system-1-sort", heading: "Population fact, support need or process assumption?", categories: ["Population fact", "Support need", "Process assumption"], items: [
            { text: "The Division supports people with brain injuries as well as developmental disabilities.", category: "Population fact" },
            { text: "This person needs a consistent routine and advance notice before a change.", category: "Support need" },
            { text: "Everyone can complete a form online within ten business days.", category: "Process assumption" },
            { text: "Some people served have conditions that change from week to week.", category: "Population fact" },
            { text: "This person needs someone to check understanding rather than ask if it was understood.", category: "Support need" },
            { text: "A single phone number reaches everyone who needs to be reached.", category: "Process assumption" },
          ] },
          { type: "leaderMove", heading: "Test against the range, not the average", control: "You control who is in the room when a process is tested, and whether the test includes the people your sequence would cost the most.", failure: "Do not let a good result with one group stand in for the Division's whole caseload. The group that tested it is rarely the group that will struggle with it.", next: "Before your next process change goes live, name the person it would work least well for and find out whether you are right." },
          { type: "flashcards", heading: "Terms worth keeping straight", cards: [
            { front: "Developmental disability", back: "<p>A disability that begins during the developmental period and affects learning, language, mobility, self-care or independent living. It is a category used for eligibility, not a description of what any one person can do.</p>" },
            { front: "Acquired brain injury", back: "<p>An injury to the brain occurring after birth, from trauma, stroke, oxygen loss or illness. Effects are often invisible: fatigue, slowed processing, memory and initiation, rather than anything a person can see.</p>" },
            { front: "Chronic medical condition", back: "<p>A long-term health condition requiring ongoing management. Support needs may rise and fall, which makes a service system built around a fixed annual assessment a poor fit.</p>" },
            { front: "Fluctuating condition", back: "<p>A condition whose effects vary by day or week. A person assessed on a good day may be recorded as needing less than they need on a bad one.</p>" },
            { front: "Nonvisible disability", back: "<p>A disability not apparent to an observer. Most disabilities are nonvisible, and a process that responds only to what staff can see will miss most of the people it serves.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-minnesota-service-system-1-check", question: "A worker notes that an applicant with a brain injury \"seemed fine and understood everything\" during a forty-minute phone assessment. What is the most useful thing to add?", options: [
            { text: "Nothing; the worker observed the person directly and recorded what they saw.", correct: false },
            { text: "Cognitive fatigue often appears after sustained effort, so a person can follow a long call and retain little of it; confirm understanding in writing afterwards and check back.", correct: true },
            { text: "Schedule a second assessment to confirm the first.", correct: false },
          ], feedbackCorrect: "Yes. Performing well during a call and retaining it afterwards are different things, and the difference is exactly what a brain injury can affect.", feedbackIncorrect: "The issue is not whether the worker observed carefully. It is that the observation covers only the call itself, and the effects that matter here show up after it." },
        ],
      },
      {
        id: "dsd-minnesota-service-system-2",
        number: 2,
        title: "What a waiver actually waives",
        summary: "Learn what home and community-based services are, what the word waiver means, and how the main Minnesota programs differ in whom they serve.",
        minutes: 12,
        learning: {
          objective: "Explain what a home and community-based services waiver waives, and match at least four Minnesota waiver programs to the people they were built for.",
          takeaways: [
            "Home and community-based services pay for support in a person's own home and community rather than in an institution — the waiver is a waiver of the rule that would otherwise tie that funding to an institutional setting.",
            "Minnesota runs several distinct waiver programs, each with its own eligibility and service menu, and a person's program shapes what is available to them more than their diagnosis does.",
            "Two people with similar needs can receive different services because they entered through different programs, which is an artifact of the system rather than a judgment about them.",
          ],
          evidence: "A waiver sort matching people to programs, a scenario decision and a knowledge check.",
          appliedNextStep: "Find out which waiver programs most of the people in your area of work are served under, and what that program does not cover.",
        },
        scenario: {
          context: "A colleague new to the Division is drafting guidance and writes: \"People with disabilities in Minnesota receive HCBS waiver services, which cover the supports they need at home.\" They ask you to check it.",
          prompt: "What is the most useful correction?",
          options: [
            { label: "It is accurate enough for general guidance; the detail belongs in program material.", response: "The sentence sounds right and will mislead anyone who acts on it. It implies one program, automatic access and full coverage, and none of those is true." },
            { label: "Name that there are several distinct programs with different eligibility and different service menus, that access depends on meeting a program's criteria and its capacity, and that no program covers everything.", response: "This is what a reader needs in order not to promise something the system does not deliver. It also prepares them for the most common question they will be asked.", recommended: true },
            { label: "Replace it with a link to the program pages and remove the description.", response: "A link is useful, but staff writing and speaking about the system still need a correct working model, and removing the description leaves them with whatever they assumed." },
          ],
        },
        transfer: {
          prompt: "What does the waiver serving most of your caseload not cover, and what do people do instead?",
          options: ["Write down the three services people most often ask for that their program does not fund", "Find out what happens next for those people: another program, a county resource, family, or nothing", "Bring one of those gaps to whoever sets service menus or plans"],
        },
        blocks: [
          { type: "text", heading: "The word waiver, plainly", body: "<p>Federal rules would ordinarily pay for long-term care in an institution. A waiver is permission to waive that rule, so the same funding can pay for support in a person's own home and community instead. That is the whole of the idea. Everything else — eligibility criteria, service menus, annual limits, assessment cycles — is machinery built around it.</p><p>Knowing this changes how the machinery reads. The service menu is not a list of everything a person might need; it is a list of what can be funded in place of an institutional bed. The eligibility criteria exist because the waiver is only available to people who would otherwise qualify for that institutional level of care. And the persistent question of whether a support is covered is usually a question about what the specific program was authorized to fund.</p>" },
          { type: "tabs", heading: "The main Minnesota programs, and whom each was built for", tabs: [
            { label: "Developmental disability", body: "<p>The waiver for people with developmental disabilities or related conditions, generally identified during the developmental period. Typically the longest relationship with the system: many people enter as children and remain served into adulthood, with a family or guardian who has navigated it for years. Service menus tend to be broad, covering residential support, day services, employment support and respite.</p>" },
            { label: "Community access for disability inclusion", body: "<p>For people with disabilities who need the level of care a nursing facility would provide but choose to live in the community. Often serves adults with physical disabilities and adults with mental health conditions. A common route for someone whose disability arrives or worsens in adulthood.</p>" },
            { label: "Brain injury", body: "<p>For people with an acquired or traumatic brain injury who need specialized support, including services shaped around cognitive effects, behavior and rehabilitation. Distinct because the supports that help after a brain injury — cueing, structure, cognitive rehabilitation — are not the same as personal care.</p>" },
            { label: "Community alternative care", body: "<p>For people with chronic medical conditions who would otherwise need hospital-level care. Serves people whose needs are medical and often changing, where the alternative is not a nursing facility but a hospital.</p>" },
            { label: "Elderly waiver", body: "<p>For older adults who need nursing-facility level care and choose to remain at home. Relevant to the Division's work because people age with disabilities, and a person may move between programs as they get older.</p>" },
          ] },
          { type: "sorting", id: "dsd-minnesota-service-system-2-sort", heading: "Which program was built for this person?", categories: ["Developmental disability", "Brain injury", "Community access for disability inclusion", "Community alternative care"], items: [
            { text: "A man in his forties with cognitive and behavioral effects after a motorcycle crash, needing cueing and structure through the day.", category: "Brain injury" },
            { text: "A woman who has received services since childhood for an intellectual disability and now wants supported employment.", category: "Developmental disability" },
            { text: "A woman in her fifties with multiple sclerosis who needs nursing-facility level support and intends to stay in her apartment.", category: "Community access for disability inclusion" },
            { text: "A young man with a complex respiratory condition who would otherwise be in hospital and is supported at home with skilled care.", category: "Community alternative care" },
          ] },
          { type: "statement", body: "A person's program shapes what is available to them more than their diagnosis does. When someone asks why a neighbor with a similar disability receives a service they cannot get, that is usually the answer, and it is worth saying plainly rather than leaving them to conclude the decision was about them." },
          { type: "accordion", heading: "Questions staff are asked, and honest answers", items: [
            { title: "Why is there a wait?", body: "<p>Programs are funded for a set number of people. When demand exceeds that, people wait. This is a budget and capacity fact rather than a judgment about need, and saying so is more respectful than implying the person's need was weighed and found smaller.</p>" },
            { title: "Why does my service plan not include the thing I need most?", body: "<p>Either the service is not on that program's menu, or the assessment did not record the need in the form the menu recognizes. Both are worth checking, and the second is fixable.</p>" },
            { title: "Can I change programs?", body: "<p>Sometimes, and it depends on eligibility for the other program and its capacity. This is a question for the lead agency; what staff can do is make sure the person knows it is a question that can be asked.</p>" },
            { title: "Who decides?", body: "<p>Eligibility rests on assessed need against program criteria, determined through the lead agency. Knowing where the decision sits helps a person direct a question or a disagreement to the place that can act on it.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-minnesota-service-system-2-check", question: "A person asks why the waiver will fund a paid support worker to take them to an appointment but will not fund the cheaper option of reimbursing their sister for the same trip. What is the most accurate framing?", options: [
            { text: "The cheaper option is always preferred; this looks like an error to correct.", correct: false },
            { text: "Each program funds a defined set of services with defined requirements about who may provide them; the question is whether this program has a route for paying a family member, which is worth checking rather than assuming.", correct: true },
            { text: "Family members cannot be paid for support under any circumstances.", correct: false },
          ], feedbackCorrect: "Yes. What is covered, and who may deliver it, is set by the program rather than by what is cheapest, and whether a family route exists is a real question to ask.", feedbackIncorrect: "Neither a blanket yes nor a blanket no is right. The honest answer is that it depends on the program's rules, and that it is worth checking for this person." },
        ],
      },
      {
        id: "dsd-minnesota-service-system-3",
        number: 3,
        title: "The most integrated setting",
        summary: "Understand what the most integrated setting requirement obliges the state to do, and what it looks like when a service technically complies and still narrows a life.",
        minutes: 11,
        learning: {
          objective: "Explain the most integrated setting requirement in your own words and identify one current arrangement where a person's real options are narrower than the requirement intends.",
          takeaways: [
            "Public services must be offered in the most integrated setting appropriate to a person's needs — the setting that allows the fullest interaction with people who do not have disabilities.",
            "Unjustified segregation of people with disabilities is discrimination, not merely an unfortunate outcome of how services happen to be organized.",
            "A setting can satisfy the letter of the requirement and still be segregating in practice: a group home on a residential street where no resident leaves it without staff is integrated only on a map.",
          ],
          evidence: "A scenario decision, a sort separating integration in form from integration in practice, and a knowledge check.",
          appliedNextStep: "Pick one service you know well and ask what proportion of a participant's week is spent only with paid staff and other people with disabilities.",
        },
        scenario: {
          context: "A day program moves from a large building on an industrial lot to a storefront on a busy commercial street. The participants are the same twenty-five people, the staffing is the same, and the day runs as it did before: arrive at nine, activities in the main room, lunch together, leave at three.",
          prompt: "How should the move be described in a progress update?",
          options: [
            { label: "As a move toward the most integrated setting: the program is now in the community rather than on an industrial lot.", response: "The building moved. The day did not. Describing a change of address as integration is how a system persuades itself that something happened." },
            { label: "As an improvement in location that has not yet changed what the day consists of, with the real measure being how much of the week participants spend with people outside the program.", response: "This keeps the requirement pointed at the person's actual experience, which is where it was always aimed, and it names the next thing to work on.", recommended: true },
            { label: "As neutral: the location is not what the requirement addresses.", response: "Location is not irrelevant — a storefront makes ordinary contact possible in a way an industrial lot does not. The error is treating the possibility as the achievement." },
          ],
        },
        transfer: {
          prompt: "Where in your work does a setting meet the requirement on paper but not in a person's week?",
          options: ["Pick one service and estimate how much of a participant's week involves people who are not staff or other participants", "Name one barrier that keeps it that way: transport, staffing ratios, scheduling, risk policy", "Raise that barrier with the person who can change it"],
        },
        blocks: [
          { type: "text", heading: "What the requirement says, and what it asks of us", body: "<p>Public entities must administer services in the most integrated setting appropriate to the needs of the person. The reasoning that produced this requirement is worth stating: unjustified segregation of people with disabilities is itself a form of discrimination, because it deprives people of ordinary community life on the basis of disability. Minnesota carries this forward through its Olmstead Plan, which commits the state to supporting people to live, learn, work and participate in the most integrated setting.</p><p>For a person administering services, the requirement translates into a habit of asking what a person's real options are, not what options exist in principle. A choice between one group home and no service is not a choice. A community activity that only happens when staffing allows is a possibility rather than an option. The requirement is interested in what the person can actually do.</p>" },
          { type: "sorting", id: "dsd-minnesota-service-system-3-sort", heading: "Integrated in form, or integrated in practice?", categories: ["Integrated in form only", "Integrated in practice", "Neither"], items: [
            { text: "A house on an ordinary street where all six residents go out together, with staff, once a week.", category: "Integrated in form only" },
            { text: "A person who works two shifts a week alongside colleagues who do not have disabilities and eats lunch with them.", category: "Integrated in practice" },
            { text: "A day program on a commercial street where participants remain inside from nine until three.", category: "Integrated in form only" },
            { text: "A person who chose their apartment, has a neighbor they see socially, and uses support to get to a choir practice they picked.", category: "Integrated in practice" },
            { text: "A residential facility on the grounds of a former institution, with its own recreation building.", category: "Neither" },
          ] },
          { type: "leaderMove", heading: "Measure the week, not the address", control: "You control which measure appears in your reporting: the setting's category, or how much of a person's week involves people outside the service.", failure: "Do not let a change of building be recorded as a change of life. It flatters the report and leaves the person where they were.", next: "Add one question to a review you already run: in an ordinary week, whom does this person spend time with who is not paid to be there?" },
          { type: "quote", text: "The question is not whether the setting is in the community. It is whether the person is.", cite: "A working restatement of the requirement" },
          { type: "knowledgeCheck", id: "dsd-minnesota-service-system-3-check", question: "A person says they want to move out of a group home and live alone with support. The team's assessment is that this carries real risk. What does the most integrated setting requirement ask of the team?", options: [
            { text: "Nothing further; the requirement applies to the setting offered, and a group home in the community already qualifies.", correct: false },
            { text: "That the team start from what would make the more integrated option workable — what support, technology, backup and planning — and turn to a less integrated setting only if that genuinely cannot be arranged.", correct: true },
            { text: "That the move proceed regardless of assessed risk, because the person has chosen it.", correct: false },
          ], feedbackCorrect: "Yes. The requirement puts the burden on the system to show why a more integrated option will not work, rather than on the person to prove they deserve it.", feedbackIncorrect: "The first answer treats the current setting as the end of the question. The third ignores that appropriateness to the person's needs is part of the requirement. The work is to try seriously to make the more integrated option work." },
        ],
      },
      {
        id: "dsd-minnesota-service-system-4",
        number: 4,
        title: "The path, and where people fall out of it",
        summary: "Follow a person from first contact through assessment, eligibility, planning and services, and find the steps where people most often stop.",
        minutes: 11,
        learning: {
          objective: "Describe the main steps a person passes through to receive services and name at least three points where people commonly drop out and why.",
          takeaways: [
            "A person typically moves through first contact, an assessment of need, an eligibility determination, service planning, provider selection and then ongoing review — each a place where a person can be lost.",
            "People rarely drop out because they stopped needing support; they drop out at the steps that require the most organization, the most waiting, or the most retelling of their story.",
            "A system that records a drop-out as a person's choice learns nothing from it.",
          ],
          evidence: "A scenario decision, an accordion of common drop-out points with causes, and a knowledge check.",
          appliedNextStep: "Find out, for one step you own, how many people who start it do not finish it, and whether anyone has asked why.",
        },
        scenario: {
          context: "A monthly report shows that of people who begin an application for services, roughly a quarter never complete the assessment stage. The report records these as withdrawn.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Record it as a baseline and monitor whether the proportion changes.", response: "Monitoring a number nobody understands produces a longer series of the same puzzle. The useful information is in why, and it is retrievable." },
            { label: "Contact a sample of the people recorded as withdrawn and ask what happened at the point they stopped, then fix the most common cause.", response: "Withdrawal is a description of what the record shows, not an explanation. Asking converts a quarter of applicants from a statistic into a list of fixable causes.", recommended: true },
            { label: "Add a reminder message at the assessment stage.", response: "A reminder is a reasonable guess, and it treats the cause as forgetfulness before finding out whether it is transport, fear, a lost letter, or an appointment slot nobody could make." },
          ],
        },
        transfer: {
          prompt: "Which step in your process loses the most people, and do you know why?",
          options: ["Find the step with the largest drop between starting and finishing", "List three plausible causes and which one you could test cheapest", "Ask three people who stopped what happened"],
        },
        blocks: [
          { type: "text", heading: "The path, stated simply", body: "<p>Strip away the variation between programs and a person's route looks like this. Someone makes first contact, usually with a county or Tribal lead agency, sometimes after being told to by a hospital, a school or a family member. An assessment of need is arranged and carried out. An eligibility determination follows, against the criteria of whichever program fits. If eligible, a service plan is developed and providers are selected. Services begin, and are reviewed on a cycle.</p><p>Each arrow between those steps is a place where a person can be lost, and the losses are not random. They cluster at the steps that ask the most of a person at the moment they have the least: the wait after first contact, the assessment appointment that requires transport and a whole morning, the eligibility letter written in a register most people do not read easily, the gap between an approved plan and a provider with capacity.</p>" },
          { type: "accordion", heading: "Where people fall out, and what is usually behind it", items: [
            { title: "Between first contact and assessment", body: "<p>The wait. A person in crisis makes contact, is told an assessment will be arranged, and hears nothing for weeks. By the time it arrives the crisis has resolved itself in some other way, often worse. What helps: contact during the wait, even brief, and an honest estimate rather than silence.</p>" },
            { title: "At the assessment itself", body: "<p>The appointment costs a morning, transport, and often a support person's time. People with fluctuating conditions may be assessed on a good day and recorded as needing less. What helps: flexibility on time and place, and a route to say the day was not representative.</p>" },
            { title: "At the eligibility decision", body: "<p>The letter. A decision written for the file rather than the reader leaves a person unsure whether they were refused, delayed or approved, and unsure what to do next. What helps: plain wording, the reason, and the next step with a name attached.</p>" },
            { title: "Between approval and services starting", body: "<p>Provider capacity. A person can be approved for a service that no available provider can staff, particularly in rural areas and particularly for specialized support. What helps: saying so early, and counting these people rather than recording them as served.</p>" },
            { title: "At review", body: "<p>The retelling. A person recounts their whole history annually to establish something that has not changed. Some stop showing up. What helps: carrying forward what is stable and asking only about what moves.</p>" },
          ] },
          { type: "list", heading: "Questions that find a drop-out point", ordered: true, items: ["How many people start this step, and how many finish it?", "What does this step require a person to have: transport, a phone, a morning, a support person, an address, reading in English?", "How long does a person wait here, and what are they told during the wait?", "What does the person receive in writing, and would it be clear to someone reading it alone, worried?", "When someone stops here, what is recorded, and does anyone ask why?"] },
          { type: "leaderMove", heading: "Stop recording withdrawal as a decision", control: "You control the categories in your own reporting, and whether the record distinguishes a person who chose not to proceed from a person the process lost.", failure: "Do not let withdrawn or declined stand as an explanation. It reads as the person's decision and hides the step that produced it.", next: "Split one drop-out category into two — chose not to proceed, and stopped responding — and look at the second." },
          { type: "knowledgeCheck", id: "dsd-minnesota-service-system-4-check", question: "A rural county finds that approved participants wait an average of five months for a provider with capacity. In the state-level count, these people appear as served. What is the most useful change?", options: [
            { text: "None; they are approved and will be served, so the count is accurate.", correct: false },
            { text: "Count approval and service start separately, so the gap between them is visible and can be addressed as the capacity problem it is.", correct: true },
            { text: "Remove them from the count until services begin.", correct: false },
          ], feedbackCorrect: "Yes. Approval and delivery are different events, and a count that merges them hides a five-month wait from everyone who could act on it.", feedbackIncorrect: "The first answer treats an intention as a service. The third loses the fact that these people were approved and are waiting, which is exactly the fact worth surfacing." },
        ],
      },
      {
        id: "dsd-minnesota-service-system-5",
        number: 5,
        title: "A service-path review you can run",
        summary: "Run a short structured review on one process you touch, and end with a single change, an owner and a date.",
        minutes: 10,
        learning: {
          objective: "Complete a five-question service-path review on one process you touch and produce one change with a named owner and a review point.",
          takeaways: [
            "A review is worth running on a process you own or influence, not on the whole system, because the output has to be something you can actually move.",
            "The most useful finding is usually a step that assumes a capability the person does not have, rather than a policy that is wrong.",
            "A finding without an owner and a date is a note, and notes do not change processes.",
          ],
          evidence: "A completed service-path review with one named change, an owner and a review point.",
          appliedNextStep: "Send your completed review to the person who owns the process, or keep it if that is you, and put the review point in your calendar.",
        },
        scenario: {
          context: "You complete a review of a renewal process and find three things: the notice is only sent by post, the return window is fourteen days, and the form asks for information already held in the record. You have an hour with the process owner next week.",
          prompt: "How should you use the hour?",
          options: [
            { label: "Present all three findings and let the owner decide the priority.", response: "Three findings with no recommendation is a meeting that generates a fourth meeting. The person who did the review usually knows which one matters most." },
            { label: "Lead with the one that loses the most people — the postal-only notice — with a proposed fix, who would do it, and when you would check. Note the other two.", response: "This gives the owner a decision they can make in the hour and leaves the rest recorded rather than lost.", recommended: true },
            { label: "Send the findings in writing beforehand and use the hour for discussion.", response: "Sending ahead is good practice, and without a recommendation and an owner it still ends as discussion. Do both: send ahead, then lead with the one change." },
          ],
        },
        transfer: {
          prompt: "What is the one change from your review, and who owns it?",
          options: ["Write the change as a single sentence someone else could act on", "Name the person who can make it, not the team", "Set the date you will check whether it happened"],
        },
        blocks: [
          { type: "text", heading: "Keep the scope small enough to move", body: "<p>The temptation with a review like this is to aim it at the system. Resist it. A review of the whole service path produces a document; a review of the renewal notice you send produces a changed notice. Pick something inside your reach or one conversation away from it.</p><p>The five questions below are ordered deliberately. The first two find where people stop. The third asks what the step is for, because a step that protects something real needs replacing rather than deleting. The fourth is where most findings actually land: the alternative exists but only on request, which means it exists for people who know to ask. The fifth turns the finding into work.</p>" },
          { type: "list", heading: "The five questions", ordered: true, items: ["Who cannot complete this step at all, and why not?", "Where do people stop, and what do we record when they do?", "What does this step protect, and could that be protected another way?", "Is the alternative route the default, or does the person have to ask for it?", "Who owns the change, and when will we check?"] },
          { type: "artifact", kind: "tagged-document", label: "Review", title: "A service-path review", summary: "One page recording what you examined, the single change you propose, who owns it and when it will be checked.", fields: [
            { label: "Process examined", value: "The exact step, not the whole service: the renewal notice, the assessment booking, the eligibility letter." },
            { label: "Who cannot complete it", value: "The group the step costs the most, and what specifically stops them." },
            { label: "What we record when they stop", value: "The category currently used, and whether it reads as the person's choice." },
            { label: "Proposed change", value: "One sentence another person could act on without you in the room." },
            { label: "Owner and review point", value: "A named person and the date you will check." },
          ], action: "Complete this for one process and send it to the person who owns it." },
          { type: "leaderMove", heading: "One change, named and dated", control: "You control whether your finding leaves the room as a recommendation with an owner or as a shared concern.", failure: "Do not end a review with everyone agreeing it is a problem. Agreement without an owner is the most comfortable way for nothing to happen.", next: "Before your next review conversation ends, say the change, the name and the date out loud, and write them down." },
          { type: "flashcards", heading: "What the review is looking for", cards: [
            { front: "An assumed capability", back: "<p>Something the step quietly requires: a printer, a morning free, a phone with minutes, reading English, a stable address. The most common finding, and usually the cheapest to fix.</p>" },
            { front: "An alternative on request", back: "<p>A route that exists for people who know to ask. Making it the default, or offering it explicitly, converts it from a courtesy into a service.</p>" },
            { front: "A protective step", back: "<p>A step that exists for a real reason — verification, safety, a legal requirement. These get redesigned rather than removed, and knowing which is which keeps a review credible.</p>" },
            { front: "A category that ends inquiry", back: "<p>Withdrawn, declined, not engaged. Each reads as a decision by the person and stops anyone asking what the process did.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-minnesota-service-system-5-check", question: "Your review finds that a verification step loses people, but the step exists to prevent a real form of error. What is the right conclusion?", options: [
            { text: "Remove the step; losing people is the greater harm.", correct: false },
            { text: "Keep what the step protects and change how it is done — a different channel, a longer window, or verification from information already held — then check whether the loss falls.", correct: true },
            { text: "Keep the step as it is; it exists for a reason.", correct: false },
          ], feedbackCorrect: "Yes. The question is never only whether a step costs people, but whether what it protects can be protected another way.", feedbackIncorrect: "Both other answers skip the middle option, which is usually the available one: keep the protection, change the method." },
        ],
      },
    ],
  },
  jobAid: {
    title: "The Minnesota disability service system",
    subtitle: "A one-page orientation for staff new to how the Division's services work",
    quote: "A waiver waives the rule that would fund an institution instead. Everything else is machinery built around that.",
    use: {
      purpose: "Hold a correct working model of the service system, so that what you tell people is accurate and what you design fits the range the Division actually serves.",
      remember: ["The Division serves people with developmental disabilities, physical disabilities, brain injuries, chronic medical conditions, and people living with HIV — different paths, different histories.", "A person's program shapes what is available to them more than their diagnosis does.", "The most integrated setting is about the person's week, not the building's address.", "People drop out at the steps that ask the most when they have the least."],
      doNext: "Run the five-question service-path review on one process you touch, and send it to whoever owns that process.",
    },
    sections: [
      { heading: "When you explain the system", items: ["Say there are several programs with different eligibility and different service menus, not one.", "Say that waiting is a capacity and budget fact, not a judgment about the person's need.", "Say where the decision sits, so a question or a disagreement reaches a place that can act on it.", "Do not promise coverage you have not confirmed for that person's program."] },
      { heading: "When you design or review a step", items: ["Name the capability the step quietly requires, and who does not have it.", "Make the alternative the default rather than something to request.", "Check whether the step was tested with people whose path is not the typical one.", "Split approval from service start in any count you produce."] },
      { heading: "When a person stops responding", items: ["Treat it as information about the step, not a decision by the person.", "Ask what the notice, the channel and the appointment assumed.", "Record what happened in a category that leaves the question open."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities, including the populations served and the programs available." },
    { title: "Minnesota Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota's plan for supporting people with disabilities to live, learn, work and participate in the most integrated setting." },
    { title: "Medicaid home and community-based services, Centers for Medicare and Medicaid Services", href: "https://www.medicaid.gov/medicaid/home-community-based-services", note: "Federal description of home and community-based services authorities, including what a waiver permits and the settings requirements that apply." },
    { title: "ADA National Network", href: "https://adata.org/", note: "Guidance on the integration mandate and the obligations of public entities administering services to people with disabilities." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
    { title: "Administration for Community Living", href: "https://acl.gov/", note: "Federal agency supporting community living for older adults and people with disabilities, including long-term services and supports." },
  ],
};

export default pack;
