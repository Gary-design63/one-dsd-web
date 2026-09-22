import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 9: Aging, health and access.
// Program-authored for staff who support people aging with a disability, their aging caregivers, and their access to health care.
const pack: CoursePack = {
  course: {
    id: "dsd-09-aging-health-access",
    indexNumber: 1189,
    seriesLabel: "DSD Service System · Practice",
    title: "Aging, Health and Access",
    subtitle: "What it means to grow older with a lifelong disability, what happens when the parent who has provided support for fifty years can no longer, why people with disabilities get worse health care, and how staff can change what they can reach.",
    scope: "For care coordinators, case managers, direct support staff, health and wellness staff, program and policy staff, and supervisors whose teams support people aging with a disability or the families who support them. Five short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Five short lessons with Minnesota examples, a sort separating aging from disability from overshadowing, scenarios, flashcards, and a health-access review you can run with one person",
    duration: "50–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-aging-and-health-access.jpg",
    coverAlt: "A woman in her seventies and her adult son with Down syndrome sit together on a porch step, the son holding a folder of appointment papers.",
    introTranscript: "People with lifelong disabilities are living longer than any previous generation, and the service system was not built for that. Many still live with parents who are now in their eighties. Health conditions of aging arrive earlier for some and are missed in others because every symptom is attributed to the disability. Health care itself is harder to reach: inaccessible offices, rushed appointments, clinicians who talk to the support worker. This module covers what aging with a disability involves, the aging caregiver, diagnostic overshadowing, the access barriers built into health care, and a health-access review you can run with one person. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe how aging with a lifelong disability differs from aging without one and from acquiring a disability late in life.",
        "Recognize the situation of an aging caregiver and plan for a transition before it is forced by a crisis.",
        "Explain diagnostic overshadowing and identify a symptom in a person's record that may have been attributed to their disability without examination.",
        "Name the main barriers people with disabilities meet in health care and the accommodations that address each.",
        "Run a health-access review with one person and produce one change with an owner.",
      ],
      evidence: [
        "A sort separating effects of aging, effects of disability, and overshadowing.",
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed health-access review with one change.",
      ],
      appliedNextStep: "For one person you support who lives with an aging parent, find out whether a plan exists for when the parent can no longer provide support, and start one if not.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Minnesota programs serving people aging with disabilities or their caregivers", "Change in health care access requirements or accommodation standards", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's health, diagnosis, medication or care go to their clinician; questions about services go to the responsible lead agency or program office. This course builds practice, it does not give medical advice.",
      toolkitQuestion: "Who provides this person's daily support, how old are they, and what is the plan for the day they cannot?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-aging-health-1",
        number: 1,
        title: "Growing older with a disability",
        summary: "Understand how aging with a lifelong disability differs from other kinds of aging, and why the service system was not built for it.",
        minutes: 10,
        learning: {
          objective: "Describe three ways aging with a lifelong disability differs from aging without one, and identify one service assumption that does not fit.",
          takeaways: [
            "People with lifelong disabilities are living into old age in numbers no earlier generation reached, and services designed for younger adults or for older people without disabilities both fit poorly.",
            "Some conditions bring earlier onset of age-related change; some disabilities make the physical effects of aging arrive sooner or harder; and a lifetime of limited access compounds both.",
            "The transition between disability services and aging services is a seam in the system, and people fall through seams.",
          ],
          evidence: "A tabs comparison of three kinds of aging, a scenario decision and a knowledge check.",
          appliedNextStep: "Find out how a person in your area moves between disability services and aging services, and what changes when they do.",
        },
        scenario: {
          context: "A man with Down syndrome in his early fifties has become forgetful, withdrawn and slower over eighteen months. His day program staff say he is getting old and adjust his schedule. Nobody has arranged a medical evaluation.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Accept the staff's reading; people slow down with age.", response: "They do, and a change this marked over eighteen months in a person in his fifties is not what ordinary aging looks like. It is what several treatable and untreatable conditions look like, and the difference matters." },
            { label: "Arrange a medical evaluation, since people with Down syndrome face an earlier and higher likelihood of some age-related conditions and a change this marked needs a diagnosis rather than an adjusted schedule.", response: "This treats the change as a medical question, which it is. Some causes are treatable, some are not, and both require knowing which.", recommended: true },
            { label: "Ask his family whether they have noticed anything.", response: "Worth doing, and it does not replace an evaluation. The family may have noticed and be waiting for someone to suggest one." },
          ],
        },
        transfer: {
          prompt: "Which person you support is aging in a way the plan has not caught up with?",
          options: ["Name one person over fifty whose plan was written for a younger adult", "List what has changed in their health, energy or support in the last two years", "Identify one service assumption that no longer fits"],
        },
        blocks: [
          { type: "text", heading: "A generation the system did not expect", body: "<p>For most of the history of disability services, people with significant lifelong disabilities did not live to old age. Life expectancy for many conditions has risen dramatically within living memory, and the result is a large and growing population that the service system was not designed for: people in their fifties, sixties and seventies with developmental disabilities, cerebral palsy, spinal cord injuries sustained decades ago, and other lifelong conditions, now also facing the ordinary changes of aging.</p><p>Neither existing framework fits well. Disability services were designed around younger adults and goals like employment and independence. Aging services were designed around people who were not disabled until late in life, with different histories, different supports and different expectations. A person who has lived with a disability for sixty years and is now aging sits between the two, and the seam between them is where people are lost.</p>" },
          { type: "tabs", heading: "Three kinds of aging", tabs: [
            { label: "Aging without disability", body: "<p>Gradual change from a baseline of full access. Retirement from work. Health conditions arriving in the sixties and seventies. Services designed around this pattern assume a home, savings, a spouse or children, and a lifetime of navigating health care.</p>" },
            { label: "Acquiring disability late", body: "<p>A stroke, a fall, dementia. Disability arrives after a lifetime without it. The person and the family are new to disability, and aging services are designed largely for them.</p>" },
            { label: "Aging with a lifelong disability", body: "<p>Change from a baseline that was already different. For some conditions, earlier onset of age-related change. For many, physical wear from decades of managing mobility differently. Often no spouse, no children, limited savings, and a parent who has been the primary support for fifty years and is now in their eighties. Neither service framework was built for this.</p>" },
          ] },
          { type: "leaderMove", heading: "Rewrite the plan for the age the person is", control: "You control whether a plan written at thirty is revised or renewed at fifty-five. Renewing it keeps goals that no longer fit and misses the ones that now matter.", failure: "Do not attribute a marked change to aging without a medical evaluation. Aging is gradual; a change over months has a cause.", next: "Review the plans for people over fifty in your area and ask which were written for someone younger." },
          { type: "statement", body: "The seam between disability services and aging services is where people are lost. Someone has to hold the person across it." },
          { type: "knowledgeCheck", id: "dsd-aging-health-1-check", question: "Why does a service framework designed for older adults often fit poorly for a person aging with a lifelong disability?", options: [
            { text: "Because people with lifelong disabilities do not age.", correct: false },
            { text: "Because it assumes a history of full access, savings, a spouse or children, and familiarity with health care, none of which may be true, and does not account for a parent who has been the primary support for decades.", correct: true },
            { text: "Because aging services are less well funded.", correct: false },
          ], feedbackCorrect: "Yes. The framework's assumptions about who the older person is do not match, and that is what produces the poor fit.", feedbackIncorrect: "The issue is the assumptions built into the framework, not funding or whether people with disabilities age." },
        ],
      },
      {
        id: "dsd-aging-health-2",
        number: 2,
        title: "The aging caregiver",
        summary: "Recognize the situation of a parent who has provided support for decades and is now aging, and plan for a transition before a crisis forces one.",
        minutes: 10,
        learning: {
          objective: "Identify the signs that a caregiving arrangement is approaching its limit and describe a transition plan that begins before a crisis.",
          takeaways: [
            "Many adults with lifelong disabilities live with a parent in their seventies or eighties who has provided daily support for the person's entire life and has no plan for what follows.",
            "The transition usually happens in a crisis — a fall, a hospitalization, a death — and a crisis transition is the worst possible way to move a person to new support.",
            "Planning earlier is resisted, by parents who cannot imagine it and by systems that do not ask, and the resistance is exactly why staff have to raise it.",
          ],
          evidence: "An accordion on signs and steps, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "For one person living with an aging parent, ask the parent, kindly and directly, what the plan is for when they cannot continue.",
        },
        scenario: {
          context: "A woman in her fifties with an intellectual disability has lived with her mother all her life. Her mother is eighty-four, recently had a fall, and manages all of her daughter's medication, finances, appointments and meals. Asked about the future, the mother says she will manage as long as she can and does not want to talk about it.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Respect the mother's wishes and revisit it later.", response: "Later usually means the emergency room. The mother's reluctance is understandable and it is not a reason to leave her daughter with no plan for the day her mother cannot manage." },
            { label: "Acknowledge what the mother has done and that the subject is hard, then begin the plan in pieces she can accept: recording what she does each day, introducing one support now, and naming who would step in on a bad week, so that the eventual transition is to something already partly in place.", response: "This respects the mother, protects the daughter, and makes the transition gradual rather than sudden. A plan built in pieces is one the mother can bear to build.", recommended: true },
            { label: "Refer the daughter for residential placement now so the transition is done.", response: "Too fast, unwanted, and it replaces the mother's wishes with the system's convenience. Gradual is the point." },
          ],
        },
        transfer: {
          prompt: "Which caregiving arrangement in your area is closest to its limit, and what is the plan?",
          options: ["Name the person and the caregiver, and the caregiver's age", "Find out whether anyone has written down what the caregiver does each day", "Take one step: record it, introduce one support, or name a backup"],
        },
        blocks: [
          { type: "text", heading: "Fifty years of support, and no plan", body: "<p>A common situation in disability services, and one of the least discussed, is the adult in their fifties living with a parent in their eighties who has done everything for them since birth. The parent manages medication, money, appointments, meals and transport, often without any formal service, and has never been asked what happens when they cannot. They may not have let themselves think about it. The system, for its part, sees a person whose needs are met and does not ask either.</p><p>The transition, when it comes, comes as a crisis. The parent falls, is hospitalized, or dies, and the person is moved within days to whatever is available, grieving, in a setting they did not choose, supported by people who do not know them. Everything about this can be prevented by starting earlier, and everything about it is resisted by the very people who need to start.</p>" },
          { type: "accordion", heading: "Signs, and the first steps", items: [
            { title: "Signs the arrangement is near its limit", body: "<p>The caregiver is over seventy-five. They have had a fall, a hospitalization or a new diagnosis. They manage everything and have no backup. They say they will manage as long as they can. Nobody else knows the routine. The person has never spent a night away.</p>" },
            { title: "First step: write the routine down", body: "<p>What the caregiver does each day, in their words. Medication, meals, money, appointments, what calms the person, what upsets them. This is the plan's foundation, and it is something the caregiver can do without agreeing to anything else.</p>" },
            { title: "Second step: introduce one support now", body: "<p>One worker, one day a week, doing one part of the routine. The person and the worker become familiar with each other while the caregiver is still there to make it work.</p>" },
            { title: "Third step: name the bad-week plan", body: "<p>Who steps in if the caregiver is in hospital for a week. A name, a number, a place. Agreed in advance, tested if possible.</p>" },
            { title: "Fourth step: the longer plan", body: "<p>Only once the first three are in place. Where the person will live, with whom, and how. Built with the person, whose future it is, and at a pace the caregiver can bear.</p>" },
          ] },
          { type: "quote", text: "The transition will happen. The only question is whether it happens as a plan or as an emergency." },
          { type: "leaderMove", heading: "Raise it, kindly, before the crisis", control: "You control whether the question is asked. Nobody else in the arrangement is going to ask it, and the cost of not asking falls on the person with the disability.", failure: "Do not read the caregiver's reluctance as a reason to wait. It is a reason to start smaller.", next: "Ask one aging caregiver this month to write down what they do each day." },
          { type: "knowledgeCheck", id: "dsd-aging-health-2-check", question: "Why is writing down the caregiver's daily routine the recommended first step rather than discussing future living arrangements?", options: [
            { text: "Because it is required for the file.", correct: false },
            { text: "Because it is something the caregiver can do without agreeing to a future they cannot yet face, and it becomes the foundation any later plan is built on.", correct: true },
            { text: "Because living arrangements are not the coordinator's concern.", correct: false },
          ], feedbackCorrect: "Yes. The step is chosen for what the caregiver can bear and for what it makes possible later.", feedbackIncorrect: "The routine is not a paperwork task. It is the piece of the plan that meets the caregiver where they are." },
        ],
      },
      {
        id: "dsd-aging-health-3",
        number: 3,
        title: "Diagnostic overshadowing",
        summary: "Learn how symptoms get attributed to a person's disability without examination, and how to catch it in a record.",
        minutes: 12,
        learning: {
          objective: "Explain diagnostic overshadowing and identify, in a record, a symptom or change that may have been attributed to the person's disability without medical examination.",
          takeaways: [
            "Diagnostic overshadowing is the attribution of a new symptom to a person's existing disability, so that the symptom is never examined and the underlying condition is never found.",
            "It happens in health care, and it happens in services, where a change in behavior, mood, sleep, appetite or function is read as part of the disability rather than as a signal.",
            "The corrective is simple to state: any change from the person's own baseline is a medical question until a clinician has answered it.",
          ],
          evidence: "A sort separating aging, disability and overshadowing, a flashcard set on changes worth examining, a scenario decision and a knowledge check.",
          appliedNextStep: "Find one change noted in a person's file in the last year that was attributed to their disability, and check whether it was ever examined.",
        },
        scenario: {
          context: "A man in his sixties with autism has become agitated in the evenings, is hitting his head, and has stopped eating breakfast. His support notes describe increased behaviors and a behavior plan is updated. Three months later he is found to have a severe dental abscess.",
          prompt: "What went wrong?",
          options: [
            { label: "The behavior plan was not implemented well enough.", response: "The behavior plan was a response to pain that nobody examined. Implementing it better would have managed the expression of an abscess more effectively while the abscess got worse." },
            { label: "A change from his baseline — new agitation, head-hitting, refusing food — was read as part of his autism rather than as a signal, and the medical question was never asked; the corrective is that any change from baseline is examined before it is managed.", response: "This is diagnostic overshadowing in its most common form. The behavior was communication, and the response treated it as the problem rather than the message.", recommended: true },
            { label: "His dentist should have caught it at a routine visit.", response: "Perhaps, if he had one. The failure was earlier: nobody asked whether a change this marked had a physical cause." },
          ],
        },
        transfer: {
          prompt: "Which change in one person's record was attributed to their disability and never examined?",
          options: ["Look at the last year of notes for one person and find a change from baseline", "Check whether a medical evaluation followed", "If not, arrange one now"],
        },
        blocks: [
          { type: "text", heading: "When the disability explains everything", body: "<p>Diagnostic overshadowing is a well-documented pattern in health care: a clinician meets a person with a known disability, observes a symptom, and attributes it to the disability rather than examining it. Depression is read as part of intellectual disability. Pain is read as behavior. A change in gait is read as the cerebral palsy. The symptom is not investigated because it has already been explained.</p><p>The same pattern runs through services. A person becomes withdrawn, or agitated, or stops eating, or sleeps badly, and the note says increased behaviors. The disability is the explanation, so nothing is examined. What has actually happened is that a person who may not be able to say they are in pain has said it the only way available, and the message has been filed under their diagnosis.</p><p>The corrective is a rule: any change from a person's own baseline is a medical question until a clinician has answered it. Not a behavioral question, not an aging question. A medical one, first.</p>" },
          { type: "sorting", id: "dsd-aging-health-3-sort", heading: "Aging, disability, or overshadowing?", categories: ["Ordinary aging", "Part of the disability", "Overshadowing"], items: [
            { text: "Gradual reduction in stamina over ten years in a person in their seventies.", category: "Ordinary aging" },
            { text: "A person with cerebral palsy has always walked with a particular gait.", category: "Part of the disability" },
            { text: "New head-hitting in a nonspeaking person is recorded as increased behaviors and a plan is updated.", category: "Overshadowing" },
            { text: "A person with Down syndrome in their fifties becomes markedly forgetful over a year and staff say he is getting old.", category: "Overshadowing" },
            { text: "A person's long-standing sensory sensitivities to noise.", category: "Part of the disability" },
            { text: "Weight loss and refusing meals attributed to being picky, without examination.", category: "Overshadowing" },
          ] },
          { type: "flashcards", heading: "Changes that are medical questions first", cards: [
            { front: "New or increased self-injury", back: "<p>Pain until proven otherwise. Teeth, ears, stomach, joints, headaches. Especially in a person who cannot report pain in words.</p>" },
            { front: "Refusing food or drink", back: "<p>Dental pain, swallowing difficulty, reflux, nausea, medication side effects, depression. Not pickiness.</p>" },
            { front: "New agitation, especially at a particular time of day", back: "<p>Pain, urinary infection, constipation, medication timing, sleep disruption. Evening agitation in older adults has several medical causes.</p>" },
            { front: "Withdrawal, slowing, loss of skills", back: "<p>Depression, thyroid, hearing or vision loss, medication effects, dementia. Never simply aging without an evaluation.</p>" },
            { front: "Change in sleep", back: "<p>Pain, breathing problems, medication, depression, anxiety. A change from the person's own pattern is the signal.</p>" },
          ] },
          { type: "leaderMove", heading: "Make baseline change a medical referral", control: "You control whether a change in a person's presentation goes to a behavior plan or to a clinician first. Sending it to the clinician first costs a visit; sending it to the plan first can cost months of untreated pain.", failure: "Do not update a behavior plan for a new behavior until a medical cause has been ruled out. The plan will work on the expression and leave the cause.", next: "Add a line to your team's practice: any change from baseline gets a medical question before a behavioral one." },
          { type: "knowledgeCheck", id: "dsd-aging-health-3-check", question: "A nonspeaking woman in her sixties begins refusing to get out of bed in the mornings. Her notes record it as a behavior. What should happen first?", options: [
            { text: "A behavior plan to encourage morning routine.", correct: false },
            { text: "A medical evaluation, since a change from her own baseline in a person who cannot report symptoms in words is a medical question before it is a behavioral one.", correct: true },
            { text: "Wait to see if it resolves.", correct: false },
          ], feedbackCorrect: "Yes. Pain, depression, medication effects and several other causes present exactly this way, and none of them respond to a behavior plan.", feedbackIncorrect: "Both other responses treat the change as behavior or as noise. It is a signal, and the first question is medical." },
        ],
      },
      {
        id: "dsd-aging-health-4",
        number: 4,
        title: "Barriers in health care",
        summary: "Name the barriers people with disabilities meet in health care and the accommodations that address each.",
        minutes: 10,
        learning: {
          objective: "Identify the main barriers a person with a disability meets in health care and match each to an accommodation staff can request or arrange.",
          takeaways: [
            "Barriers include inaccessible examination equipment, appointment lengths that do not allow for communication needs, clinicians who address the support worker rather than the person, and information given in forms the person cannot use.",
            "Most barriers have an accommodation that can be requested in advance: a longer appointment, accessible equipment, an interpreter, a quiet waiting space, written information in plain language.",
            "The support worker's role in an appointment is to make sure the person is addressed and understood, not to answer for them.",
          ],
          evidence: "A tabs walk through barriers and accommodations, a scenario decision and a knowledge check.",
          appliedNextStep: "Before one person's next appointment, call ahead and request one accommodation they have never had.",
        },
        scenario: {
          context: "A woman who uses a wheelchair has not had a full physical examination in eleven years because the clinic's examination table is fixed-height and staff have never offered an alternative. Her file records her as declining preventive screening.",
          prompt: "What is the most accurate reading, and the most useful response?",
          options: [
            { label: "She has declined screening and that is her right.", response: "She has never been offered screening she could physically receive. Recording that as her decision hides an access failure and leaves her without care other patients receive." },
            { label: "The record has attributed to her a barrier the clinic imposed; the response is to request accessible examination equipment or a clinic that has it, and to correct the record so it describes the barrier rather than a decision.", response: "This names what happened and fixes both halves: the care and the record. Eleven years without an examination is a serious health risk that a height-adjustable table would have prevented.", recommended: true },
            { label: "Ask her whether she would like to be examined.", response: "Worth asking, and the question needs to come with the means. Asking without offering accessible equipment produces the same result as before." },
          ],
        },
        transfer: {
          prompt: "Which accommodation has one person you support never been offered?",
          options: ["Name the person and their next appointment", "Identify one barrier they have met before: equipment, time, communication, environment", "Call the clinic ahead and request the accommodation"],
        },
        blocks: [
          { type: "text", heading: "Worse care, for reasons that can be named", body: "<p>People with disabilities receive less preventive care, are diagnosed later, and have worse health outcomes than others, and a substantial part of the reason is in how health care is delivered. Examination tables that cannot be lowered. Scales that cannot weigh a person in a wheelchair. Fifteen-minute appointments for a person who needs time to communicate. Clinicians who direct every question to the worker who came along. Discharge instructions on a dense printed sheet for a person who does not read.</p><p>Each of these has an accommodation, and most can be requested when the appointment is made. The staff role is to know the barriers, request the accommodations, and, in the room, make sure the person is the one being spoken to.</p>" },
          { type: "tabs", heading: "Barriers and accommodations", tabs: [
            { label: "Equipment", body: "<p><strong>Barrier:</strong> Fixed-height tables, standing scales, imaging equipment that requires transfers. <strong>Accommodation:</strong> Height-adjustable table, wheelchair scale, transfer assistance, or a clinic that has them. Ask when booking.</p>" },
            { label: "Time", body: "<p><strong>Barrier:</strong> Standard appointment length too short for communication needs or for undressing and transfers. <strong>Accommodation:</strong> A double appointment, requested at booking, first or last slot of the day.</p>" },
            { label: "Communication", body: "<p><strong>Barrier:</strong> No interpreter; instructions the person cannot read; clinician addresses the worker. <strong>Accommodation:</strong> Interpreter booked in advance; plain-language written summary; the worker redirects every question to the person.</p>" },
            { label: "Environment", body: "<p><strong>Barrier:</strong> Loud, bright, crowded waiting areas; long waits. <strong>Accommodation:</strong> A quiet space or waiting in the car with a call when ready; first appointment of the day.</p>" },
            { label: "Attitude", body: "<p><strong>Barrier:</strong> Assumptions about quality of life, capacity to consent, or whether treatment is worthwhile. <strong>Accommodation:</strong> The person's own goals stated at the start; a worker who names the assumption when it appears.</p>" },
          ] },
          { type: "leaderMove", heading: "Call ahead, every time", control: "You control whether an appointment is booked with accommodations or without. The call takes five minutes and changes what the appointment can do.", failure: "Do not let a worker answer for the person in the room. The worker's job is to make sure the person is asked, and to wait for the answer.", next: "For the next three appointments you help arrange, call ahead and request one accommodation each." },
          { type: "statement", body: "The support worker's job in the appointment is to make sure the person is the one being spoken to, and to wait for the answer." },
          { type: "knowledgeCheck", id: "dsd-aging-health-4-check", question: "A clinician directs every question to the support worker. What should the worker do?", options: [
            { text: "Answer, since they know the person's history.", correct: false },
            { text: "Turn to the person and redirect: \"She can tell you,\" then wait, and supply history only if the person asks or cannot.", correct: true },
            { text: "Say nothing; it is the clinician's appointment.", correct: false },
          ], feedbackCorrect: "Yes. The worker's role is to keep the person as the patient. Redirecting once usually changes the rest of the appointment.", feedbackIncorrect: "Answering makes the worker the patient. Silence leaves the person invisible. Redirecting is the job." },
        ],
      },
      {
        id: "dsd-aging-health-5",
        number: 5,
        title: "A health-access review you can run",
        summary: "Run a short review of one person's health care access and produce one change with an owner.",
        minutes: 12,
        learning: {
          objective: "Complete a health-access review with one person and produce one change with a named owner and a review point.",
          takeaways: [
            "The review asks when the person last had routine and preventive care, what barriers they met, what changes from baseline have gone unexamined, and who will be their support at the next appointment.",
            "Most people with disabilities are behind on preventive care, and the review usually finds something specific and fixable.",
            "One appointment booked with accommodations is worth more than a complete audit.",
          ],
          evidence: "A list of the review's questions, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Run the review with one person this month and book the appointment it finds missing.",
        },
        scenario: {
          context: "Your review finds that a man in his sixties has not had a dental visit in nine years, has never had a bowel screening, has had a persistent cough noted three times as part of his condition, and whose next appointment is a fifteen-minute slot at the end of the day with a worker who has never met him.",
          prompt: "Where do you start?",
          options: [
            { label: "Book the dental and screening appointments; they are the longest overdue.", response: "Both matter and are overdue. The cough has been noted three times and never examined, and a persistent unexplained symptom in a person in his sixties is the most urgent item on the list." },
            { label: "Get the cough examined first, at an appointment booked with a longer slot and a worker who knows him; then book the dental and screening appointments with the same accommodations.", response: "This prioritizes the unexamined symptom, fixes the appointment structure that would otherwise waste the visit, and sequences the rest. Each appointment is then one the person can actually use.", recommended: true },
            { label: "Change the upcoming appointment to a worker who knows him and let the clinician decide what to address.", response: "The worker change helps. A fifteen-minute end-of-day slot will not address a nine-year gap, and the cough needs to be named as the reason for the visit." },
          ],
        },
        transfer: {
          prompt: "Which person will you run the review with, and what will you book?",
          options: ["Name the person and run the five questions with them", "Identify the most urgent gap: an unexamined change, or the longest-overdue care", "Book the appointment with accommodations and a worker who knows them"],
        },
        blocks: [
          { type: "text", heading: "A review that ends in an appointment", body: "<p>The health-access review is short because it is meant to be run, not filed. It asks what preventive care the person has had and when, what barriers they met, what changes from baseline have been noted without examination, and who will be with them at the next appointment. It almost always finds something. The measure of the review is not the list it produces but the appointment it books.</p>" },
          { type: "list", heading: "The five questions", ordered: true, items: ["When did the person last have: a physical examination, dental care, vision and hearing checks, and the screenings recommended for their age? Which are overdue?", "At past appointments, what barriers did they meet: equipment, time, communication, environment, attitude?", "In the last year, what changes from their baseline were noted, and were any of them examined by a clinician?", "Who will support them at the next appointment, do they know the person, and have accommodations been requested?", "What is the most urgent gap, who will book the appointment, and by when?"] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Health-access review", summary: "One page that records what care is overdue, what barriers were met, what has gone unexamined, and the one appointment that gets booked.", fields: [
            { label: "Overdue care", value: "Physical, dental, vision, hearing, screenings; dates" },
            { label: "Barriers met", value: "Equipment, time, communication, environment, attitude" },
            { label: "Unexamined changes", value: "From the last year of notes" },
            { label: "Next appointment support", value: "Who; do they know the person; accommodations requested" },
            { label: "One appointment, one owner, one date", value: "The most urgent gap, booked" },
          ], action: "Run it with one person and book the appointment it finds." },
          { type: "leaderMove", heading: "Unexamined changes first", control: "You control the order in which gaps are addressed. An unexamined change from baseline outranks overdue routine care, because it may be the thing that is currently doing harm.", failure: "Do not let the review become a checklist of everything overdue that nobody books. Book one thing.", next: "Run the review with one person and book the most urgent appointment before the month ends." },
          { type: "flashcards", heading: "Preventive care people with disabilities most often miss", cards: [
            { front: "Dental", back: "<p>The most commonly missed. Untreated dental pain is a leading cause of behavior change in people who cannot report pain in words.</p>" },
            { front: "Vision and hearing", back: "<p>Frequently unexamined for years. Unrecognized sensory loss is routinely mistaken for cognitive decline or withdrawal.</p>" },
            { front: "Cancer screening", back: "<p>Cervical, breast, bowel and other screenings are received at far lower rates, often because equipment or positioning was never accommodated.</p>" },
            { front: "Bone health", back: "<p>People with mobility disabilities and those on certain long-term medications are at elevated risk and are rarely screened.</p>" },
            { front: "Medication review", back: "<p>Long-term prescriptions, sometimes decades old, rarely reviewed for continued need or for interactions. Ask when the list was last reviewed as a whole.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-aging-health-5-check", question: "In a health-access review, why does an unexamined change from baseline take priority over overdue routine care?", options: [
            { text: "Because routine care is less important.", correct: false },
            { text: "Because a change that has been noted and not examined may be a condition currently causing harm, while routine care addresses risk over time; both matter and the first is more urgent.", correct: true },
            { text: "Because routine care requires more appointments.", correct: false },
          ], feedbackCorrect: "Yes. The ordering is about current harm versus future risk. Routine care follows immediately after.", feedbackIncorrect: "Routine care is important and is not the reason for the ordering. Urgency is." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Aging, health and access",
    subtitle: "A one-page reference for anyone supporting a person aging with a disability, an aging caregiver, or a person's access to health care",
    quote: "Any change from a person's own baseline is a medical question until a clinician has answered it.",
    use: {
      purpose: "Catch the changes that get attributed to disability or aging without examination, plan caregiver transitions before a crisis, and make health care appointments the person can actually use.",
      remember: ["Aging with a lifelong disability fits neither service framework; someone has to hold the person across the seam.", "The caregiver transition will happen; the only question is whether it is a plan or an emergency.", "A change from baseline is a medical question first, before a behavior plan.", "Call ahead and request accommodations. In the room, make sure the person is spoken to."],
      doNext: "Run the health-access review with one person and book the appointment it finds.",
    },
    sections: [
      { heading: "When a person is aging with a disability", items: ["Rewrite the plan for the age they are.", "Ask what has changed in the last two years.", "Do not attribute a marked change to aging without an evaluation.", "Find out how they move between disability and aging services, and who holds them across."] },
      { heading: "When a caregiver is aging", items: ["Ask, kindly and directly, what the plan is.", "Write the daily routine down in the caregiver's words.", "Introduce one support now. Name the bad-week plan.", "Build the longer plan at a pace the caregiver can bear."] },
      { heading: "When a person has a health appointment", items: ["Call ahead: equipment, time, interpreter, quiet space.", "Send a worker who knows them.", "Redirect every question to the person and wait.", "Leave with a written plain-language summary."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities." },
    { title: "Minnesota Department of Human Services, Aging and Adult Services", href: "https://mn.gov/dhs/people-we-serve/seniors/", note: "State information on services for older Minnesotans and caregivers." },
    { title: "Senior LinkAge Line", href: "https://mn.gov/senior-linkage-line/", note: "Minnesota's statewide information and assistance line for older adults and caregivers." },
    { title: "National Task Group on Intellectual Disabilities and Dementia Practices", href: "https://www.the-ntg.org/", note: "Guidance on aging, dementia and health in people with intellectual and developmental disabilities." },
    { title: "Centers for Disease Control and Prevention, disability and health", href: "https://www.cdc.gov/disability-and-health/", note: "Federal public health information on health disparities and health care access for people with disabilities." },
    { title: "Administration for Community Living", href: "https://acl.gov/", note: "Federal agency supporting community living for older adults and people with disabilities, including caregiver support." },
  ],
};

export default pack;
