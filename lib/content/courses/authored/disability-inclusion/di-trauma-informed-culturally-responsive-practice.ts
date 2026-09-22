import type { CoursePack } from "../../source-types";

// Disability Inclusion curriculum, Level 2 module 4: Trauma-Informed and Culturally Responsive Disability Practice.
// Program-authored for supervisors, program staff, direct-support professionals, care coordinators and intake teams.
const pack: CoursePack = {
  course: {
    id: "di-trauma-informed-culturally-responsive-practice",
    indexNumber: 1109,
    seriesLabel: "Disability Inclusion · Applied inclusion",
    title: "Trauma-Informed and Culturally Responsive Disability Practice",
    subtitle: "Understand why people arrive wary of services, and practice choice, transparency, collaboration and cultural humility in ordinary encounters.",
    scope: "For supervisors, program staff, direct-support professionals, care coordinators, intake teams and customer-facing staff. Five short lessons on how trauma, identity, culture and disability combine in a service encounter, and what to do differently. Participation in this program is voluntary and does not replace required training.",
    treatment: "Five short lessons with scenarios, flashcards, a policy review exercise and knowledge checks",
    duration: "48–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/health-wellness-safety.jpg",
    coverAlt: "An East Asian home visitor sits at a kitchen table with an older couple.",
    introTranscript: "Many of the people we serve have learned, from experience, to expect that a service will take something from them: their time, their privacy, their say. Disability, trauma, racism, poverty, language and age do not arrive one at a time; they combine, and the combination shapes how a person reads our forms, our tone and our rules. This course explains where that wariness comes from and gives you four working habits: choice, transparency, collaboration and cultural humility. You will finish by reviewing an intake policy and naming what is missing from it.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain how trauma, racism, poverty, language access, gender identity, age and disability can combine to shape one person’s experience of a service.",
        "Identify sources of institutional mistrust, including institutionalization, segregation, coercion, discrimination and inaccessible systems, and connect them to behavior you may see at intake.",
        "Apply choice, transparency, collaboration and cultural humility in a routine encounter using specific language.",
        "Recognize single-story thinking about disability, race, culture or diagnosis and replace it with questions the person can answer.",
        "Review an intake policy for the requirements that exclude people and propose a corrected version with an owner.",
      ],
      evidence: [
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed sort separating compounding factors, single-story assumptions and practice adjustments.",
        "A written review of one intake policy naming what is missing, who it excludes and who owns the fix.",
      ],
      appliedNextStep: "Choose one intake, referral or eligibility step you touch every week. Walk it as a person who has been let down by services before, and change one thing about the choice, transparency or collaboration it offers.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Questions about a specific person’s services, guardianship, language access or a civil rights concern go to the responsible program office, the language access team or civil rights; this course prepares you, it does not decide a case.",
      toolkitQuestion: "Whose history with services are we asking this person to set aside, and what in our design gives them a reason to?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "trauma-informed-culturally-responsive-practice-1",
        number: 1,
        title: "One person, many stories",
        summary: "See how disability combines with trauma, race, poverty, language, gender identity and age, and why a single story about any of them leads a service astray.",
        minutes: 10,
        learning: {
          objective: "Describe how at least three factors combine in one person’s experience of a service and identify the single-story assumption that would hide that combination.",
          takeaways: [
            "The CDC estimates that about one in four adults in the United States has a disability; disability is not a separate population but a thread running through every community we serve.",
            "Barriers compound: a paper form is a small barrier for one person and a closed door for someone who is blind, reads in Hmong and works two jobs.",
            "A single story about disability, race or diagnosis makes the worker confident and the assessment wrong.",
          ],
          evidence: "A completed sort of compounding factors, single-story assumptions and practice adjustments, and a knowledge check.",
          appliedNextStep: "Pick one person you served this week and list every factor, beyond the presenting need, that shaped what the encounter cost them.",
        },
        scenario: {
          context: "A county eligibility worker reviews a renewal for a Somali-speaking woman in her sixties who has a hearing disability. Two notices went unanswered. The worker’s note says the applicant is “not engaged” and recommends closing the case.",
          prompt: "What is the most useful next step?",
          options: [
            { label: "Close the case; the process gave her two chances.", response: "Two English-language paper notices to a person who is hard of hearing and reads in Somali are not two chances. They are the same barrier sent twice." },
            { label: "Ask what the notices assumed: language, format, phone follow-up, transportation. Reach her through an accessible channel, in her language, before any decision.", response: "This treats the silence as evidence about the process, not about the person. It costs one call and saves a wrongful closure.", recommended: true },
            { label: "Refer her to a community organization to help her respond.", response: "A referral may help later, but it moves the burden of an inaccessible notice onto a third party and leaves the notice inaccessible for the next person." },
          ],
        },
        transfer: {
          prompt: "Which single story is most common in your unit, and what question would replace it?",
          options: ["Write down one label you have seen in a case note this month and the observable facts behind it", "Choose one question you will ask instead of assuming, such as “How do you prefer to get letters from us?”", "Tell a colleague what you noticed and what you will change"],
        },
        blocks: [
          { type: "text", heading: "Factors combine; they do not queue", body: "<p>A service encounter is never about disability alone. The person across the counter is also a parent or not, a renter or not, a speaker of one language or three, a person with a history with this agency or with agencies like it. Each of these shapes what our process costs them. When we plan for one factor at a time, we build a system that works for people who have only one.</p><p>Consider a common combination: a Black man in his fifties with a traumatic brain injury after a work accident, now on a waiver, with a school-age daughter and a job that does not allow calls during a shift. A ten-minute scheduling phone call during business hours is, for him, a lost hour of wages, a cognitive load he manages with notes, and a reminder of past encounters in which his slowness to answer was read as evasion. None of those facts is unusual. Together they decide whether he calls back.</p><p>The intersectional habit from Level 1 becomes practical here. Ask, within the group of people this process affects, who is affected most, and design for them. That usually means offering more than one channel, more than one time, more than one language, and a format the person can keep and return to.</p>" },
          { type: "list", heading: "Factors that commonly compound with disability", items: ["Trauma history, including trauma caused by services, hospitals, schools or police.", "Racism and its effects on trust, on how behavior is interpreted and on who is believed.", "Poverty: transportation, phone minutes, printing, time off work, a stable address.", "Language access: written and spoken language, literacy in either, sign language, need for an interpreter.", "Gender identity and sexuality, especially where forms, staff or providers have been unsafe before.", "Age: an older adult with a new disability and a young adult leaving school services face different systems and different assumptions."] },
          { type: "sorting", id: "trauma-informed-culturally-responsive-practice-1-sort", heading: "Compounding factor, single-story assumption or practice adjustment?", categories: ["Compounding factor", "Single-story assumption", "Practice adjustment"], items: [
            { text: "The applicant works a shift job with no phone access until evening.", category: "Compounding factor" },
            { text: "People with schizophrenia will not keep appointments.", category: "Single-story assumption" },
            { text: "Offer the appointment by phone, video or in person, with an evening slot.", category: "Practice adjustment" },
            { text: "The family’s first language is Karen and the daughter interprets at home.", category: "Compounding factor" },
            { text: "Hmong families take care of their own, so they will not want home care.", category: "Single-story assumption" },
            { text: "Book a professional interpreter and send the notice in the family’s language.", category: "Practice adjustment" },
          ] },
          { type: "leaderMove", heading: "Replace the label with the facts", control: "You control whether a case note records a judgment (“not engaged,” “resistant,” “noncompliant”) or the observable facts and what the process assumed.", failure: "Do not let “did not respond to two notices” become “not interested in services.” Ask what language, format and channel the notices used.", next: "Before you write a judgment word in a note this week, write the three facts it rests on. If you cannot, ask the person." },
          { type: "flashcards", heading: "Terms that keep the thinking honest", cards: [
            { front: "Single story", back: "<p>One narrative about a group, used to predict an individual. It feels like knowledge and works like a blindfold. The antidote is a question the person can answer.</p>" },
            { front: "Compounding barrier", back: "<p>A barrier whose cost multiplies when it meets another: a paper-only notice plus low vision plus a second language plus no printer.</p>" },
            { front: "Intersectional check", back: "<p>Within the people this process affects, who is affected most? Design the process for them, and it will work for everyone else.</p>" },
            { front: "About one in four", back: "<p>The CDC’s estimate of adults in the United States with a disability. Disability is present in every caseload, every team and every community meeting, whether or not anyone has said so.</p>" },
            { front: "Cost of the encounter", back: "<p>Everything a person spends to reach us: wages, transportation, childcare, privacy, energy, and the emotional cost of a place that has let them down before.</p>" },
          ] },
          { type: "knowledgeCheck", id: "trauma-informed-culturally-responsive-practice-1-check", question: "A young man with an intellectual disability, recently aged out of school services, misses his first MnCHOICES assessment. Which reading keeps the attention where it belongs?", options: [
            { text: "He is not ready for adult services and should reapply when he is.", correct: false },
            { text: "The scheduling letter, the location and the transition itself are all new to him; find out which one stopped him and adjust that.", correct: true },
            { text: "His family should have brought him; note the missed appointment and close the referral.", correct: false },
          ], feedbackCorrect: "Yes. A missed first appointment during a transition is information about the process, not a verdict on the person.", feedbackIncorrect: "Both other answers end the story with the person as the problem. Ask what the letter, the location and the transition assumed." },
        ],
      },
      {
        id: "trauma-informed-culturally-responsive-practice-2",
        number: 2,
        title: "Where mistrust comes from",
        summary: "Trace institutional mistrust to its sources, from institutions and segregation to coercion, discrimination and systems no one could use, and recognize how it shows up at your counter.",
        minutes: 12,
        learning: {
          objective: "Connect at least four sources of institutional mistrust to specific behaviors staff may see, and explain why the behavior is a reasonable response rather than a personal flaw.",
          takeaways: [
            "Many disabled people, and many families of color, carry direct or inherited experience of institutions, segregated classrooms, involuntary treatment, guardianship or benefits investigations.",
            "Wariness, minimal answers, bringing a witness, or refusing a home visit are protective strategies that worked before.",
            "Trust is rebuilt in small, kept promises, not in reassurance.",
          ],
          evidence: "A scenario decision and a knowledge check, plus a written list of the promises your own process makes and whether it keeps them.",
          appliedNextStep: "List three promises your intake process makes, explicitly or by implication, and check whether each is kept every time.",
        },
        scenario: {
          context: "A care coordinator arrives for a home visit with a woman in her forties who has a psychiatric disability. The woman meets her on the porch with a neighbor present, says the visit can happen outside, and asks whether anything she says will be reported.",
          prompt: "What is the most trauma-informed response?",
          options: [
            { label: "Explain that home visits must be inside the home for the assessment to be valid, and reschedule.", response: "Insisting on the inside of the home turns a reasonable safety strategy into a rule violation and repeats the coercion she is guarding against." },
            { label: "Accept the porch and the neighbor, answer the reporting question honestly and specifically, and let her decide how much to cover today.", response: "You have given her choice, transparency and control of pace. The assessment can be completed across more than one visit if needed.", recommended: true },
            { label: "Say she has nothing to worry about and begin the visit.", response: "“Nothing to worry about” is not an answer to a specific question, and she will notice. Say exactly what is reported and what is not." },
          ],
        },
        transfer: {
          prompt: "What has your program done, or what have programs like yours done, that a person would reasonably remember?",
          options: ["Find out what your program’s notices say about reporting, sharing and consequences, in the person’s language", "Practice one honest answer to “Will this be reported?” for your role", "Notice one protective strategy this week and treat it as reasonable"],
        },
        blocks: [
          { type: "text", heading: "The memory the person brings", body: "<p>Minnesota once housed thousands of disabled people in state institutions. Many living adults were sent to segregated classrooms, denied jobs or housing, placed under guardianship without being asked, or treated involuntarily. Many Black, Native, Latino, Asian and immigrant families have watched a disability label become a reason for removal, surveillance or lower expectations. The state’s Olmstead Plan exists because that history is recent and its effects are ongoing.</p><p>A person does not need to have lived through an institution to inherit the lesson. A parent’s experience with a school, a sibling’s experience with a hospital, a neighbor’s experience with a benefits investigation all teach the same rule: be careful what you tell them, and never sign anything you have not read twice. When a person is careful with you, they are applying that rule. It is not about you, and it is not irrational.</p><p>Inaccessible systems teach the same lesson more quietly. A phone tree no one can navigate, a notice in a language the household does not read, a portal that cannot be used with a screen reader, a form that requires a document the person cannot get: each one says that the system was not built for them. After enough of these, a person stops trying, and a worker who does not know the history writes “failed to follow through.”</p>" },
          { type: "accordion", heading: "Five sources of mistrust and what they look like at intake", items: [
            { title: "Institutionalization", body: "<p><strong>History:</strong> state hospitals, regional treatment centers, nursing facilities and group settings where daily life was decided by staff.</p><p><strong>What you may see:</strong> hypervigilance about rules, reluctance to disclose symptoms, questions about who decides and whether the person can leave.</p>" },
            { title: "Segregation", body: "<p><strong>History:</strong> separate classrooms, sheltered workshops, day programs and housing that kept disabled people apart from community life.</p><p><strong>What you may see:</strong> low expectations the person has absorbed, or a sharp insistence on ordinary options that staff read as unrealistic.</p>" },
            { title: "Coercion", body: "<p><strong>History:</strong> involuntary treatment, restraint, guardianship, conditions attached to benefits, threats of removal of children.</p><p><strong>What you may see:</strong> agreeing to everything to end the meeting, or refusing everything to keep control. Both are strategies, not personality.</p>" },
            { title: "Discrimination", body: "<p><strong>History:</strong> being denied a job, a lease, a loan or a medical procedure because of disability, race or both; being disbelieved about pain or ability.</p><p><strong>What you may see:</strong> bringing a witness, recording the conversation, asking for everything in writing.</p>" },
            { title: "Inaccessible systems", body: "<p><strong>History:</strong> forms, phone lines, buildings and websites that could not be used, and staff who treated the failure as the person’s.</p><p><strong>What you may see:</strong> a person who stopped responding and is now described in the file as unengaged.</p>" },
          ] },
          { type: "leaderMove", heading: "Read the strategy, not the attitude", control: "You control whether a protective behavior is recorded and treated as a reasonable response to history, or as evidence about the person’s character.", failure: "Do not describe a person who asks for everything in writing as “difficult,” or a person who brings a witness as “hostile.” Both are doing what worked before.", next: "The next time someone is guarded with you, say plainly what you can and cannot promise, then keep the promise you made." },
          { type: "quote", text: "I do not need you to tell me you are different from the last worker. I need you to call when you said you would call. Do that three times and we will talk about the rest.", cite: "Composite participant perspective, illustrative" },
          { type: "flashcards", heading: "Small promises, kept", cards: [
            { front: "Trust is built in the transaction", back: "<p>The callback that came when promised, the letter that arrived in the right language, the worker who said “I do not know, I will find out” and then did. Reassurance without a record is noise.</p>" },
            { front: "Answer the specific question", back: "<p>“Will this be reported?” deserves a specific answer: what is reported, to whom, under what conditions, and what is not. If you do not know, say so and find out before continuing.</p>" },
            { front: "The witness is welcome", back: "<p>A person who brings a friend, an advocate or a recorder is managing risk. Welcome them, address the person, and do not treat the presence of a witness as a sign of bad faith.</p>" },
            { front: "Failed to follow through", back: "<p>Before writing this, name what the person would have needed to follow through: the language, the format, the channel, the time and the document. If any was missing, the process failed first.</p>" },
          ] },
          { type: "statement", body: "A person who has been failed by services is not starting from zero with you. They are starting from below zero, and the first thing they will test is whether your words and your actions match." },
          { type: "knowledgeCheck", id: "trauma-informed-culturally-responsive-practice-2-check", question: "An older Native man on a waiver declines a home visit and asks to meet at the tribal community center instead. Which response is most consistent with this lesson?", options: [
            { text: "Explain that policy requires seeing the home and that declining may affect services.", correct: false },
            { text: "Agree to meet where he chooses, ask what would make a later home visit workable if one is required, and check the actual requirement rather than assuming it.", correct: true },
            { text: "Ask why he does not want you in his home.", correct: false },
          ], feedbackCorrect: "Yes. Choice first, then an honest check of what is actually required, then collaboration on how to meet it.", feedbackIncorrect: "One answer threatens services and one demands an explanation. Neither offers the choice, transparency or collaboration this lesson describes." },
        ],
      },
      {
        id: "trauma-informed-culturally-responsive-practice-3",
        number: 3,
        title: "Choice, transparency and collaboration in practice",
        summary: "Turn the principles of a trauma-informed approach into things you say and do in an intake, an assessment or a phone call.",
        minutes: 11,
        learning: {
          objective: "Use at least one specific sentence or action for each of choice, transparency and collaboration in a routine encounter, and explain what each protects.",
          takeaways: [
            "The federal Substance Abuse and Mental Health Services Administration describes a trauma-informed approach through principles that include safety, trustworthiness and transparency, collaboration, and empowerment through voice and choice; the cultural, historical and gender dimension runs through all of them.",
            "Choice means real options with real consequences explained, not a menu where one item is punished.",
            "Transparency is telling people what will happen, what you are writing, and what you cannot control, before they have to ask.",
          ],
          evidence: "A scenario decision, a knowledge check and a rewritten opening for your own most common encounter.",
          appliedNextStep: "Rewrite the first two minutes of your most common encounter so that it opens with what will happen, what is recorded and what the person can choose.",
        },
        scenario: {
          context: "During a phone intake, a transgender man with a chronic pain condition hesitates when asked for his legal name and the name of his primary provider. He says a previous agency used his former name on every letter and told his provider things he had not agreed to share.",
          prompt: "What do you do?",
          options: [
            { label: "Explain that the system requires the legal name and move on.", response: "The system may require a legal name in one field. That is not a reason to skip explaining how his chosen name will be used, who sees the record, and what is shared with providers." },
            { label: "Explain which name goes where and why, how letters will be addressed, what is shared with his provider and under what consent, and ask how he would like to be addressed by you and in writing.", response: "This is transparency and choice applied to the exact harm he described. It takes ninety seconds and changes the whole call.", recommended: true },
            { label: "Apologize for the other agency and reassure him this one is different.", response: "An apology for another agency does not answer his question. Tell him precisely what this agency will do." },
          ],
        },
        transfer: {
          prompt: "Which of the three practices is weakest in your own encounters, and what will you say differently?",
          options: ["Add one sentence of transparency to your opening: what will happen, what is written down, how long it takes", "Offer one real choice you currently decide for people, such as channel, order of topics or who is present", "Ask “What would make this work better for you?” and change one thing based on the answer"],
        },
        blocks: [
          { type: "text", heading: "Three practices, each with a sentence attached", body: "<p>A trauma-informed approach is often summarized in principles. The version many public agencies use comes from the federal Substance Abuse and Mental Health Services Administration and includes safety, trustworthiness and transparency, peer support, collaboration and mutuality, empowerment through voice and choice, and attention to cultural, historical and gender issues. Principles are only useful when they become sentences you actually say and things you actually do. This lesson focuses on three: choice, transparency and collaboration.</p><p><strong>Choice</strong> is offering options that are genuinely available and explaining the consequences of each, including the consequence of choosing nothing today. A choice with a penalty attached to every option but one is an instruction. <strong>Transparency</strong> is telling people what will happen and what is being recorded, before they ask, in words they can keep. <strong>Collaboration</strong> is treating the person as the expert on their own life and their own history with services, and building the plan with them rather than delivering it to them.</p><p>None of these slows the work down. Most of the time they speed it up, because a person who knows what is happening and has a say in it stops guarding and starts answering.</p>" },
          { type: "tabs", heading: "What each practice sounds like", tabs: [
            { label: "Choice", body: "<p>“We can do this by phone, by video or in person, and today or next week. Here is what changes with each.”</p><p>“You can stop at any point and we will pick up where we left off.”</p><p>“You do not have to answer that. Here is what happens if we leave it blank.”</p>" },
            { label: "Transparency", body: "<p>“Here is what happens in the next forty minutes and what happens after.”</p><p>“I am typing notes as we talk. You can see them or have a copy.”</p><p>“That part is not my decision. Here is who decides and when you will hear.”</p><p>“I do not know. I will find out and call you by Thursday.”</p>" },
            { label: "Collaboration", body: "<p>“You know what has and has not worked before. What should I know before we start?”</p><p>“Here is the draft plan. What is wrong with it?”</p><p>“Who do you want in the room, and who do you not want?”</p>" },
            { label: "Safety", body: "<p>Safety underlies the other three. It includes the physical room, the door, the volume, who is present, and whether the person can leave without penalty. Ask about it directly: “Is this a good place to talk?”</p>" },
          ] },
          { type: "leaderMove", heading: "Say what you are writing", control: "You control whether the person knows what is being recorded about them and by whom, at the moment it is being recorded.", failure: "Do not type in silence and then ask for a signature. Do not describe a record as “just for our files” when it will be read by others.", next: "In your next assessment or intake, name what you are writing at least twice, and offer to read it back or share it." },
          { type: "list", heading: "Collaboration in a plan or an assessment", ordered: true, items: ["Begin with the person’s account, in their words, before the required fields.", "Ask what has worked and what has failed in earlier plans, including plans from other agencies.", "Draft the goals with the person, then read them back and ask what is wrong.", "Offer more than one path to each goal and let the person choose the pace.", "Agree how you will check in, by what channel, and what either of you does if something changes.", "Give the person a copy in a format they can use, and explain who else will see it."] },
          { type: "flashcards", heading: "Checks before you close an encounter", cards: [
            { front: "Did the person choose anything?", back: "<p>Channel, time, order, who was present, what to leave for later. If every decision was yours, the encounter was done to them.</p>" },
            { front: "Does the person know what happens next?", back: "<p>What you will do, by when, who decides what, and how they will hear. Say it, and put it in writing they can keep.</p>" },
            { front: "Does the person know what was recorded?", back: "<p>And who sees it. A person who learns later that a note went further than they expected has learned not to talk to you.</p>" },
            { front: "Did you ask what has failed before?", back: "<p>The fastest way to avoid repeating another program’s mistake is to ask the person what it was.</p>" },
          ] },
          { type: "knowledgeCheck", id: "trauma-informed-culturally-responsive-practice-3-check", question: "Which of these is an actual choice, as this lesson defines it?", options: [
            { text: "“You can complete the form online, or you can wait until we have a paper appointment available next month.”", correct: false },
            { text: "“We can do this by phone, by video or in person this week; here is what is different about each, and you can switch later.”", correct: true },
            { text: "“You can decline the assessment, but then we cannot help you.”", correct: false },
          ], feedbackCorrect: "Yes. Options that are all actually available, with consequences explained and the ability to change.", feedbackIncorrect: "A choice where one option carries a month’s delay or the end of help is an instruction in disguise. Look for options that are all real." },
        ],
      },
      {
        id: "trauma-informed-culturally-responsive-practice-4",
        number: 4,
        title: "Cultural humility in disability work",
        summary: "Practice humility instead of expertise about other people’s cultures, and hold disability, culture and diagnosis as questions rather than conclusions.",
        minutes: 10,
        learning: {
          objective: "Distinguish cultural humility from cultural competence and use at least three questions that let a person define what disability, family, help and privacy mean to them.",
          takeaways: [
            "Cultural competence promises expertise about a group; cultural humility commits to asking, listening and adjusting, and to noticing the power in the room.",
            "Disability is understood differently across cultures, families and generations; the person’s framing, not the diagnosis, tells you what support means.",
            "Interpreters, family and community members can be essential, but the person still speaks for themselves.",
          ],
          evidence: "A scenario decision, a knowledge check and three humility questions adapted to your role.",
          appliedNextStep: "Write three questions you will ask, in your own words, before assuming what help, family involvement or privacy should look like for someone.",
        },
        scenario: {
          context: "A direct-support professional supports a young Hmong woman with cerebral palsy who has moved into her own apartment through a waiver. Her parents visit daily and make many decisions. The support plan lists independence as the goal, and a colleague says the family is “holding her back.”",
          prompt: "What is the culturally humble move?",
          options: [
            { label: "Follow the plan and limit the parents’ involvement to protect her independence.", response: "This makes the agency’s definition of independence the only one and treats her family as an obstacle. Ask her what she wants first." },
            { label: "Ask her, privately and with a professional interpreter if she prefers one, what role she wants her family to have in each kind of decision, and rewrite the plan in her terms.", response: "Independence and family closeness are not opposites in every culture or every person. Her answer defines the goal; the plan follows it.", recommended: true },
            { label: "Assume this is how Hmong families work and step back entirely.", response: "Replacing one single story with another is not humility. The question is what she wants, and only she can answer it." },
          ],
        },
        transfer: {
          prompt: "Where does your program’s default definition of a good outcome come from, and who was not asked?",
          options: ["Name one default, such as independence, self-report or one-on-one meetings, and ask three people whether it fits them", "Book a professional interpreter for one conversation where a family member has been interpreting", "Ask a community partner what your program gets wrong, and compensate their time where appropriate"],
        },
        blocks: [
          { type: "text", heading: "Humility, not expertise", body: "<p>Cultural competence, as the phrase is often used, implies that a worker can learn enough about a group to know what its members need. That framing has two problems. It turns cultures into checklists, and it tells the worker to trust the checklist over the person. Cultural humility starts from the other end: you cannot be an expert in another person’s life, you can notice the power you hold in the encounter, and you can keep asking and adjusting for as long as the relationship lasts.</p><p>Disability makes this urgent because the meaning of disability itself varies. In some families it is private and not named; in others it is a shared identity with pride attached; in others it is understood spiritually, or as a family responsibility rather than an individual condition. A diagnosis in the file tells you almost nothing about which of these the person lives inside. Ask. “What does your family call this?” and “Who do you usually turn to for help with this?” open more doors than any training on a specific community.</p><p>Humility also applies to the tools we use. Standardized assessments, self-report scales and goals like independence carry assumptions about what a good life looks like. They are useful, and they were not written by everyone. Use them, and ask the person whether the picture they paint is accurate.</p>" },
          { type: "accordion", heading: "Questions that let the person define the terms", items: [
            { title: "About disability", body: "<p>“How do you and your family talk about this?” “Is there a word you prefer, in English or another language?” “What has been most helpful, and who provided it?”</p>" },
            { title: "About family and community", body: "<p>“Who do you want involved in decisions like this?” “Are there decisions you want to make alone?” “Is there anyone I should not contact?”</p>" },
            { title: "About help", body: "<p>“When you have needed support before, what did it look like?” “What kind of help feels respectful to you, and what kind does not?”</p>" },
            { title: "About privacy and paperwork", body: "<p>“What would you rather not have in writing?” “Who in your community might see this, and does that matter to you?” “Would you like a copy in another language?”</p>" },
            { title: "About the worker", body: "<p>“Is there anything about me or this office that makes this harder?” Ask it once, plainly, and accept the answer without defending yourself.</p>" },
          ] },
          { type: "leaderMove", heading: "Book the interpreter; address the person", control: "You control whether a person’s child, spouse or neighbor is asked to carry the interpreting load, and whether the person remains the party to the conversation.", failure: "Do not let a family member interpret an assessment, an eligibility decision or a conversation about safety. Do not turn to the interpreter to ask what the person means.", next: "Identify one conversation this month where a family member has been interpreting and arrange a professional interpreter through the language access process." },
          { type: "quote", text: "The worker knew a lot about my community. She did not know anything about me, and she did not ask, because she thought she already knew.", cite: "Composite participant perspective, illustrative" },
          { type: "flashcards", heading: "Habits of humility", cards: [
            { front: "Notice the power", back: "<p>You decide what is written, what is eligible and when the meeting ends. Humility begins with saying that out loud and sharing what you can.</p>" },
            { front: "Hold the diagnosis lightly", back: "<p>Two people with the same diagnosis can live in opposite relationships to it. The diagnosis is a starting question, not an answer.</p>" },
            { front: "Community partners are experts, not shortcuts", back: "<p>A cultural broker or community organization can help you understand context. They do not replace asking the person, and their time deserves compensation.</p>" },
            { front: "Sovereignty is real", back: "<p>Tribal Nations are sovereign governments with their own programs and authority. Coordinate with the appropriate tribal office; do not speak for a Nation or assume state processes apply unchanged.</p>" },
            { front: "Be corrected gracefully", back: "<p>When a person or family tells you a question or a form was offensive, thank them, fix what you can, and pass the rest to the owner of the form.</p>" },
          ] },
          { type: "knowledgeCheck", id: "trauma-informed-culturally-responsive-practice-4-check", question: "Which statement best reflects cultural humility?", options: [
            { text: "“I have taken training on Somali culture, so I know how to approach this family.”", correct: false },
            { text: "“I do not know what disability or help mean to this family. I will ask, use a professional interpreter, and let them tell me.”", correct: true },
            { text: "“Culture is not relevant here; the assessment is the same for everyone.”", correct: false },
          ], feedbackCorrect: "Yes. Humility asks, listens and adjusts, and it notices that the assessment itself carries assumptions.", feedbackIncorrect: "One answer trusts a training over the family; the other pretends the tool is neutral. Humility does neither." },
        ],
      },
      {
        id: "trauma-informed-culturally-responsive-practice-5",
        number: 5,
        title: "What is missing? Reviewing an intake policy",
        summary: "Apply the whole course to an intake policy that looks ordinary and excludes people at five points, then write the corrected version.",
        minutes: 12,
        learning: {
          objective: "Review an intake policy, name each requirement that excludes people and who it excludes, and propose a corrected policy with owners for each change.",
          takeaways: [
            "Online-only completion, English-only instructions, a fixed appointment time, a phone-only help line and hard-to-obtain documentation each look reasonable alone and together close the door on the people the program exists for.",
            "Every exclusion has a person it excludes, a cost it imposes and an owner who can change it.",
            "A corrected policy offers alternatives by default, not on request.",
          ],
          evidence: "A completed review of the sample policy and a written review of one policy from your own unit, naming what is missing and who owns the fix.",
          appliedNextStep: "Take one policy or procedure in your unit through the same five questions and send the result, with proposed owners, to the person who can change it.",
        },
        scenario: {
          context: "A program manager circulates a draft intake policy for a new employment-support program: apply through the online portal, follow the English instructions, attend a fixed intake appointment on Tuesday mornings, call the help line with questions, and bring a certified copy of a disability determination. She asks for comments by Friday.",
          prompt: "What is the most useful comment?",
          options: [
            { label: "Approve it; applicants who have trouble can ask for help.", response: "Asking for help requires a phone line the person can use, in a language they speak, at a time they are free. The policy removes all three." },
            { label: "Name each of the five requirements, who it excludes, and a default alternative for each, and ask that the alternatives be written into the policy rather than offered on request.", response: "This is the review the course has been building toward. It is specific, it names owners, and it changes the default rather than adding an exception.", recommended: true },
            { label: "Suggest adding a line that says accommodations are available upon request.", response: "A line about requests keeps every barrier in place and asks the excluded person to find a way to ask. It is better than nothing and much worse than a corrected policy." },
          ],
        },
        transfer: {
          prompt: "Which policy in your own unit will you review with these five questions, and by when?",
          options: ["Choose one intake, renewal or referral procedure and walk it as five different people", "Write what is missing, who it excludes and who owns each change", "Send the review to the owner and ask for a date"],
        },
        blocks: [
          { type: "text", heading: "Five requirements, five closed doors", body: "<p>The sample policy in this lesson is drawn from patterns that appear across public programs. No one wrote it to exclude anyone. Each requirement solved a problem for the office: the portal reduces data entry, English instructions were quick to write, Tuesday mornings fit the staff schedule, the phone line is cheaper than walk-ins, and the certified determination prevents fraud. The exclusions are side effects, and side effects are still effects.</p><p>Walk the policy as five people. A blind man whose screen reader cannot complete the portal. A Karen-speaking mother who reads neither the instructions nor the confirmation email. A man with a spinal cord injury whose paratransit ride cannot be booked for a fixed Tuesday slot. A Deaf woman for whom a phone-only help line is no help line. A young woman with a learning disability whose school records were lost in a move and whose certified determination would cost her a specialist visit, a fee and six weeks.</p><p>Every one of them is eligible. Every one of them is stopped before the program can find out. The people a policy stops do not appear in its complaint data, because they never got far enough to complain.</p>" },
          { type: "list", heading: "The five questions for any policy", ordered: true, items: ["Who cannot complete this step at all, and why? Name the person, not the category.", "What does this step cost the people who can complete it: time, money, privacy, dignity?", "What is the step actually protecting, and is there a way to protect it that excludes no one?", "What is the default alternative, and is it written into the policy or left to a request?", "Who owns the change, and by when will it be made?"] },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "The intake policy, corrected", summary: "The same five requirements, rewritten so that each has a default alternative and an owner.", fields: [
            { label: "How to apply", value: "Online, by phone, on paper or in person, with the same questions in each channel. A staff member can complete the form with the applicant. Owner: program manager and forms team." },
            { label: "Language and format", value: "Instructions and notices in the program’s top languages, with interpretation for any language on request, plus large print, accessible electronic formats and plain-language versions. Owner: language access and accessibility teams." },
            { label: "Appointments and help", value: "Intake by phone, video or in person, at times including at least one evening, with relay and video-phone access. Help is available by phone, email, text and in person. Owner: intake supervisor." },
            { label: "Documentation", value: "Accept any reasonable evidence of disability, including a provider’s letter or existing agency records, and help the applicant obtain records rather than requiring them up front. Owner: eligibility lead, with the responsible policy office confirming what the program may accept." },
          ], action: "Use this format for the next policy you review: requirement, who it excludes, default alternative, owner. Send it to the owner, not to a general inbox." },
          { type: "leaderMove", heading: "Change the default, not the exception", control: "You control whether an accessible alternative appears in the policy itself or in a sentence about requests that puts the work back on the excluded person.", failure: "Do not accept “accommodations available upon request” as the fix for a step that some people cannot get through to make the request.", next: "In the next policy you touch, move one alternative from the exceptions paragraph into the main procedure." },
          { type: "flashcards", heading: "Who each requirement excludes", cards: [
            { front: "Online-only completion", back: "<p>People whose assistive technology cannot use the portal, people without reliable devices or connections, people who need to complete it with someone else present, and people who do not trust an online record.</p>" },
            { front: "English-only instructions", back: "<p>Anyone who reads in another language, and anyone who reads English with difficulty, including many people with cognitive, learning or print disabilities.</p>" },
            { front: "A fixed appointment time", back: "<p>People who rely on paratransit or a ride, shift workers, parents, people whose conditions fluctuate, and people who need an interpreter who is not free at that hour.</p>" },
            { front: "A phone-only help line", back: "<p>Deaf and hard-of-hearing people, people with speech disabilities, people with anxiety about phone calls, and people who cannot call during the hours it is open.</p>" },
            { front: "Hard-to-obtain documentation", back: "<p>People whose records were lost or are held by a school or provider they no longer see, people who cannot afford a new evaluation, and people who were never formally diagnosed because access to diagnosis is itself unequal.</p>" },
          ] },
          { type: "statement", body: "Every requirement protects something. The question is never whether to protect it, but whether the protection can be redesigned so that it stops no one who belongs in the program." },
          { type: "knowledgeCheck", id: "trauma-informed-culturally-responsive-practice-5-check", question: "A policy requires a certified copy of a disability determination before intake can begin. Which revision best follows this course?", options: [
            { text: "Keep the requirement and add a line that staff may make exceptions in hardship cases.", correct: false },
            { text: "Accept any reasonable evidence, begin intake while records are gathered, and have staff help obtain records, with the responsible policy office confirming what may be accepted.", correct: true },
            { text: "Remove any documentation requirement so no one is excluded.", correct: false },
          ], feedbackCorrect: "Yes. It protects the program’s legitimate interest, changes the default, names help, and checks the rule with the office that owns it.", feedbackIncorrect: "An exceptions line keeps the barrier; removing all evidence ignores what the requirement protected. Redesign the protection so it stops no one who belongs." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Trauma-informed, culturally responsive practice",
    subtitle: "A one-page reminder for intake, assessment, coordination and support",
    quote: "Offer a choice. Say what happens next. Say what you are writing. Ask what has failed before.",
    use: {
      purpose: "Keep choice, transparency, collaboration and humility in view during the encounters that decide whether a person comes back.",
      remember: ["Wariness is a strategy that worked before, not a character trait.", "Factors compound; design for the person the process costs the most.", "A single story about disability, race or diagnosis makes you confident and wrong.", "Change the default in the policy, not the exception in the paragraph about requests."],
      doNext: "Review one policy or procedure with the five questions and send the result to its owner this month.",
    },
    sections: [
      { heading: "Opening an encounter", items: ["Say what will happen, how long it takes, what is recorded and who sees it.", "Offer a real choice: channel, time, order of topics, who is present.", "Ask: “What should I know about what has and has not worked before?”", "Confirm the interpreter is a professional, and keep addressing the person."] },
      { heading: "Reading behavior", items: ["Before writing a judgment word, write the three observable facts it rests on.", "Treat a witness, a recorder or a request for everything in writing as reasonable.", "Ask what the notice, the channel or the appointment assumed before calling anyone unengaged."] },
      { heading: "Reviewing a policy", items: ["Who cannot complete this step at all, and why?", "What does the step protect, and can that be protected another way?", "Is the alternative the default or a request?", "Who owns the change, and by when?"] },
    ],
  },
  sources: [
    { title: "Substance Abuse and Mental Health Services Administration", href: "https://www.samhsa.gov/", note: "Federal agency whose guidance on a trauma-informed approach describes the principles of safety, trustworthiness and transparency, peer support, collaboration, empowerment and choice, and attention to cultural, historical and gender issues." },
    { title: "Minnesota Olmstead Plan, Minnesota Department of Human Services", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "The state’s plan for supporting people with disabilities to live, learn, work and participate in the most integrated setting." },
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Definition of disability inclusion and the estimate that about one in four adults in the United States has a disability." },
    { title: "ADA National Network", href: "https://adata.org/", note: "Guidance on effective communication, service delivery and the rights of people with disabilities in public programs." },
    { title: "U.S. Department of Health and Human Services, Office for Civil Rights", href: "https://www.hhs.gov/civil-rights/", note: "Federal civil rights protections, including Section 504 and language access, that apply to health and human services programs." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
