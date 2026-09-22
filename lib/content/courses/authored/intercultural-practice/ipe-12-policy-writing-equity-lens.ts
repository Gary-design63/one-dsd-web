import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Public-service practice · Module 12: Policy writing through an equity lens.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-12-policy-writing-equity-lens",
    indexNumber: 1154,
    seriesLabel: "Intercultural Practice and Equity · Public-service practice",
    title: "Policy Writing Through an Equity Lens",
    subtitle: "A draft is a set of decisions about who will find this easy and who will find it hard. Four lessons on reading your own draft for barriers, unclear requirements, uneven effects and buried assumptions.",
    scope: "For internal DHS and DSD staff who draft, review, clear or implement written policy: policy and program staff; contracts, fiscal, grants and procurement staff; quality and performance staff; operations, data and communications staff; and supervisors who turn a policy into a work instruction. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and an equity review you can copy and run on one real draft",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-11.jpg",
    coverAlt: "A man reviews a document on his laptop at an office desk.",
    introTranscript: "Very few people will ever read the policy you write. They will meet the requirement inside it: the document they have to find, the appointment they have to get, the deadline counted from a date nobody explained. This module is about the moment before that, when the sentence is still a draft and still cheap to change. It covers what kind of document you are actually holding, four things worth looking for in any draft, how to tell a settled obligation from a practice choice, and who should be reading the draft while the requirements are still open. It ends with an equity review you run on one real document of your own.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Name what kind of document you are drafting — law, rule, policy, guidance or work instruction — and trace one requirement through to what a person outside DHS has to do, find, prove or wait for.",
        "Identify unnecessary barriers, unclear requirements, unintended disparate effects and hidden assumptions in a draft, including one you did not write.",
        "Separate the parts of a draft that carry a settled obligation from the parts that are practice choices, and say who decides each.",
        "Plan who reviews a draft, when, and on what terms, including compensated review by people the policy will affect.",
        "Run an equity review on one real draft policy or guidance document and record findings, owners, suggested wording and what you changed.",
      ],
      evidence: [
        "Four worked scenarios drawn from policy drafting, quality oversight, procurement and pre-clearance review, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates the four findings, and that separates settled obligations from practice choices and from decisions that belong to the people affected.",
        "A completed equity review of one real draft, with findings you changed and findings you routed.",
      ],
      appliedNextStep: "Choose one draft policy, guidance document or work instruction that is in front of you now. Run the equity review on it, make the changes you own, send the rest with suggested wording to the person who owns the draft, and tell them what you changed and why.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in Minnesota's rulemaking or administrative procedure requirements, or in how DHS distinguishes law, rule, policy, guidance and work instruction",
        "A change in ADA Title II, Section 504 or Title VI language-access obligations that affects what a written policy must provide",
        "Feedback from community reviewers, disability-led organizations or division drafting staff that an example does not match how policy drafting actually works here",
      ],
      relatedDoor: "Formal decisions about whether something must go through rulemaking, whether a requirement is legally sound, and when a policy is cleared and published belong to the responsible DHS policy, legal and rulemaking offices; this module prepares your review, it does not clear or approve a draft.",
      toolkitQuestion: "Who could be helped, burdened, excluded or misunderstood by what this draft requires, and whose expertise is missing from the room where it is being written?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-12-1",
        number: 1,
        title: "A draft is a set of decisions about other people",
        summary: "What kind of document you are actually holding, what it binds, and how one ordinary-looking sentence becomes a month of somebody else's work.",
        minutes: 11,
        learning: {
          objective: "Name what kind of document you are drafting — law, rule, policy, guidance or work instruction — and trace one requirement in it through to what a person outside DHS actually has to do, find, prove or wait for.",
          takeaways: [
            "Law, rule, policy, guidance and work instruction are not the same thing. They bind different people, change through different processes, and take different amounts of time to fix. Knowing which one you are holding tells you what you can still change this month.",
            "Most of what people experience as the policy is not the rule. It is a sentence in a bulletin, a field on a form, or a work instruction a unit wrote so the rule could be operated.",
            "Every requirement assigns work to somebody: a document to obtain, an appointment to wait for, a fee to pay, a second person to ask for help, a window to meet. Trace that work before deciding a sentence is reasonable.",
            "The draft is the cheapest place a requirement will ever be to remove. Once it is published, removing it costs a correction, a retraining, and some of the trust you will need next time.",
          ],
          evidence: "A worked trace from draft sentence to the work it creates, a scenario on a documentation requirement, and a knowledge check on what changing a requirement actually takes.",
          appliedNextStep: "Take one requirement from a draft on your desk and write, in plain sentences, the sequence a person outside DHS has to complete to satisfy it. Count the steps, the offices involved and the calendar days.",
        },
        scenario: {
          context: "A DSD policy analyst is drafting guidance for a documentation requirement in a home and community-based services program. The draft sentence reads: “The applicant must submit current written verification of functional need from a licensed professional within 30 days of the request.” The analyst's own notes say the sentence simply restates what the program has always done.",
          prompt: "What is the most useful first move?",
          options: [
            {
              label: "Leave the sentence as it is. It restates existing practice rather than creating a new requirement, so it cannot create a new barrier.",
              response: "Restating a practice publishes it, and publishing it makes it harder to change later. “We have always done it this way” describes a habit, not evidence that the requirement is necessary or that it lands evenly across the state.",
            },
            {
              label: "Trace the sentence: who has to obtain the verification, from whom, how long an appointment takes in different parts of the state, what it costs, and what the 30 days are counted from.",
              response: "This is the recommended move. Tracing turns an ordinary-looking sentence into countable tasks — appointments, travel, fees, interpreters, mail — and shows exactly where a person with less money, less transportation or a longer wait for care is stopped.",
              recommended: true,
            },
            {
              label: "Add a sentence allowing an extension for good cause.",
              response: "Useful, and not a substitute for the trace. An extension helps the person who knows it exists and can document a reason. It leaves the underlying requirement, the appointment wait and the cost exactly where they were.",
            },
          ],
        },
        transfer: {
          prompt: "Take one requirement from a draft you are working on now.",
          options: [
            "Write the sequence a person outside DHS has to complete, one step per line",
            "Mark each step that costs money, transportation, time off work, an interpreter or a second appointment",
            "Name the one step you could remove or replace without losing what the requirement is actually for",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What you are holding, and what it binds",
            body: "<p>Public administration produces a stack of documents that all feel like “the policy” to the person on the other end. They are not the same, and the difference decides what you can change and how long it takes. A requirement in statute is fixed until the Legislature moves. A requirement in an administrative rule changes through rulemaking, on the record, with public notice and comment. Division policy interprets those and directs staff, counties and providers. Guidance explains policy. A work instruction is what a unit wrote so the whole arrangement could be operated on a Tuesday.</p><p>Two things follow. First, the sentence you are drafting has a home, and you should know which one before you write it. A requirement that belongs in rule does not become legitimate by appearing in a bulletin, and a reader who treats guidance as binding will comply with something nobody adopted. Second, the documents nearest the bottom of that stack — the guidance, the form, the desk procedure — shape more of what people actually experience than anything above them, and they are the fastest to fix.</p><p>This is why equity review pays off most at the policy, guidance and work-instruction level. That is where the channel is chosen, the deadline is set, the proof is named and the tone is decided. None of those are settled by statute. All of them decide who finds the program usable.</p>",
          },
          {
            type: "tabs",
            heading: "Five documents, five different things to change",
            tabs: [
              { label: "Law", body: "<p>Statute passed by the Legislature. It sets the program's authority and its outer limits. Changing it is a legislative matter, not a drafting decision. What you can do is say plainly in your draft which requirement comes from statute, so the next reader does not spend a month negotiating something that is fixed.</p>" },
              { label: "Rule", body: "<p>An administrative rule adopted through the state's rulemaking process, with public notice and an opportunity to comment. Rules carry the force of law and change slowly and on the record. That is precisely why a requirement that belongs in a rule should not be quietly invented in a guidance document instead.</p>" },
              { label: "Policy", body: "<p>The division's own written direction to staff and, often, to counties and providers. It interprets law and rule and makes them operable. This is where equity review pays off most: binding in practice, changeable in months rather than sessions, and usually drafted by people who can still be reached.</p>" },
              { label: "Guidance", body: "<p>Manuals, bulletins, question-and-answer documents and letters that explain how to apply a policy. Guidance is not supposed to create a new requirement, although readers experience it as if it does. If your guidance contains a requirement that appears nowhere above it, that is a finding, not a style question.</p>" },
              { label: "Work instruction", body: "<p>The desk procedure, checklist, form field or screen script a unit wrote so the rest could be operated. Nobody outside the unit approved it, most of it is invisible to leadership, and it decides more of what people actually experience than any document above it. It is also the fastest thing on this list to fix.</p>" },
            ],
          },
          {
            type: "list",
            heading: "What one requirement can cost a person",
            items: [
              "An appointment, and the wait for one in the part of the state where they live.",
              "Travel: a car, a ride, a bus route that runs at the right hour, or a day of lost work.",
              "A fee: a records request, a clinic visit, a notary, a certified copy, postage.",
              "A second person: a clinician, an employer, a landlord, a county worker, a relative who has to be asked for help.",
              "An interpreter, and the scheduling that makes one available at the same hour as everything else.",
              "A device, an internet connection and an account, all still working at the end of the process.",
              "Time inside a window they did not choose, counted from a date nobody explained.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Change it while it is still a draft",
            control: "You control the wording of your own sections, the requirements you propose, and whether you find out where a requirement comes from before you restate it.",
            failure: "Do not carry a requirement forward simply because it was in the last version. A restated requirement is a re-decided requirement, and the draft is the cheapest place it will ever be to remove.",
            next: "For one requirement in your current draft, find out whether it sits in statute, rule, division policy or a work instruction, and write that finding into your review note.",
          },
          {
            type: "flashcards",
            heading: "Words worth keeping apart",
            cards: [
              { front: "Requirement", back: "<p>Something a person must do or provide. Every requirement assigns work. Ask what it protects against, and whether that protection is worth the work it creates.</p>" },
              { front: "Criterion", back: "<p>The standard a decision is measured against. A criterion can be reasonable and still produce uneven results when the evidence it asks for is unevenly available.</p>" },
              { front: "Process", back: "<p>The sequence a person moves through. Most exclusion happens in the sequence rather than the criterion — in the order, the channel, the deadline and the handoffs between offices.</p>" },
              { front: "Discretion", back: "<p>The room a worker has to decide. Unwritten discretion is not flexibility; it is uneven treatment nobody can see or appeal. Write down what discretion exists and what should guide it.</p>" },
              { front: "Exception", back: "<p>A relief valve for the person who knows it exists and can document a reason. Exceptions are useful, and they are not a fix for a requirement that should not apply to most people.</p>" },
            ],
          },
          {
            type: "quote",
            text: "We were told the verification was required. It took four months to get the appointment, and by then the request had closed and we started again from the beginning. Nobody along the way could tell us who had decided we needed it.",
            cite: "Composite family perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-12-1-check",
            question: "A unit wants to remove a documentation requirement that is causing long delays. Before anyone can change it, what matters most to establish?",
            options: [
              { text: "Whether the requirement is popular with the staff who use it.", correct: false },
              { text: "Whether the requirement sits in statute, in rule, in division policy or in a work instruction the unit wrote itself — because each changes through a different process and on a different timeline.", correct: true },
              { text: "Whether removing it would reduce the unit's workload.", correct: false },
              { text: "Whether other states impose the same requirement.", correct: false },
            ],
            feedbackCorrect: "Yes. The same sentence may be a two-week edit or a rulemaking process. Finding out which one it is tells you what can be done this month and what has to be routed.",
            feedbackIncorrect: "Ask where the sentence actually lives. A work instruction the unit wrote, a division policy, an administrative rule and a statute each take a different route to change, and the answer decides what happens next.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: how might my role, my authority and my familiarity with this program shape what looks like a reasonable requirement to me?",
          },
        ],
      },
      {
        id: "ipe-12-2",
        number: 2,
        title: "Four things to look for",
        summary: "Unnecessary barriers, unclear requirements, unintended disparate effects and hidden assumptions — what each one sounds like on the page, and how to describe it so it can be fixed.",
        minutes: 11,
        learning: {
          objective: "Identify unnecessary barriers, unclear requirements, unintended disparate effects and hidden assumptions in a draft, and describe each one precisely enough that the person who owns the draft can act on it.",
          takeaways: [
            "An unnecessary barrier is a step the purpose of the policy does not require: a notarization, an in-person appearance, a document the agency already holds, a single channel with one way in.",
            "An unclear requirement is a sentence two careful readers can satisfy two different ways. It produces uneven decisions, appeals and rework, and it quietly favors people who can afford to guess wrong.",
            "An unintended disparate effect is a rule that reads evenly and lands unevenly, because what it requires is not equally available: broadband, a car, daytime hours, a clinician within an hour's drive, a name that matches across three records.",
            "A hidden assumption is the picture of a person the draft was written around. Describe that person out loud, then name who does not match and what the sentence does to them.",
            "A finding is usable when it quotes the sentence, names who is affected, says what happens to them, and offers replacement wording. Anything less arrives as criticism and leaves as nothing.",
          ],
          evidence: "A sorting exercise separating the four findings, a scenario on a requirement described as neutral, and a knowledge check on what makes a finding actionable.",
          appliedNextStep: "Read one page of a draft and write four short findings, one of each kind, each naming the sentence, who it affects, what happens to them and the wording you suggest.",
        },
        scenario: {
          context: "A quality and performance unit reviews a draft policy for a statewide provider self-report. The draft requires each provider to “submit the quarterly self-assessment through the online form by the last business day of the quarter.” Providers who miss the date appear as non-responsive in the division's quarterly summary. The unit's review note says the requirement is neutral because it applies to every provider identically.",
          prompt: "What should the review note say instead?",
          options: [
            {
              label: "Confirm that the requirement is neutral. An identical rule applied identically is the definition of fair treatment.",
              response: "Identical treatment is one meaning of fairness, and it is the one that hides the most. The question a review has to ask is not whether the rule is the same for everyone, but whether what the rule requires is equally available to everyone it binds.",
            },
            {
              label: "Note that the requirement assumes reliable broadband, a staff member free during business hours and a person comfortable with the online form — then ask what share of small, rural and culturally specific providers meet all three, and what the non-responsive label costs them.",
              response: "This is the recommended note. It names the hidden assumption, points to the foreseeable uneven result, and asks a question the unit can answer with information it already holds.",
              recommended: true,
            },
            {
              label: "Recommend adding a help line for providers who have trouble with the online form.",
              response: "A help line helps the provider who calls during the hours the line is open. It does not change the deadline, the single channel, or the label applied to a provider who never got through.",
            },
          ],
        },
        transfer: {
          prompt: "Pick a draft requirement that “applies to everyone the same way.”",
          options: [
            "Write down what the requirement assumes a person already has: a device, a car, an address, daytime hours, a document, a language",
            "Name one group the division works with who are least likely to have it",
            "Write the sentence you would change, and what the change would cost",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Even on the page, uneven on the ground",
            body: "<p>A draft policy is written in general sentences and lived in particular ones. The sentence says “the applicant must submit.” The life says a person who works nights, shares a phone with two other adults, has moved twice since spring and reads Somali more comfortably than English must submit. Nothing in ordinary drafting forces that translation to happen. It has to be done on purpose, by someone who has decided to do it.</p><p>Four findings cover most of what an equity review turns up, and they are worth keeping separate because each has a different fix. An unnecessary barrier is removed. An unclear requirement is specified. A disparate effect is designed around — a second channel, a longer window, a different proof. A hidden assumption is named, and then the sentence is rewritten for the people who do not match it. Collapsing all four into “this is a problem” gives the drafter nothing to do.</p><p>None of this is about intent, and the review works better when it says so. You are not investigating the person who wrote the sentence, and you do not need to prove discrimination to recommend a change. You are reading a draft for foreseeable results while they can still be changed, which is the ordinary work of writing rules for a public that is not uniform.</p>",
          },
          {
            type: "accordion",
            heading: "The four findings, and what each one sounds like",
            items: [
              { title: "Unnecessary barrier", body: "<p>A step the purpose of the policy does not require. Test it by asking what would actually go wrong if the step were removed, and whether that thing is happening now. Signs: a document the agency already holds, an in-person appearance for something verifiable another way, a notarization, an original rather than a copy, one channel with one way in, a form that must be printed to be completed.</p><p>Wording to look for: “must appear in person,” “must be notarized,” “original documents only,” “submitted through the online form.”</p>" },
              { title: "Unclear requirement", body: "<p>A sentence two careful readers can satisfy in two different ways. It produces uneven decisions, appeals, rework and a quiet advantage for people who can afford to guess wrong or who know someone to call. Test it by asking a colleague outside the program to say exactly what they would do.</p><p>Wording to look for: “appropriate documentation,” “promptly,” “as needed,” “sufficient evidence,” “may be required,” “in a timely manner.”</p>" },
              { title: "Unintended disparate effect", body: "<p>A requirement that reads the same for everyone and is not equally available to everyone. Test it against what the state actually looks like: broadband and cellular coverage, distance to a clinic or county office, transit, daytime availability, the languages people read, whether a name and address match across three systems.</p><p>You are not proving discrimination and you do not need to. You are naming a foreseeable uneven result while the sentence is still open.</p>" },
              { title: "Hidden assumption", body: "<p>The person the draft was written around. Read the draft and describe that person out loud: their housing, transportation, work hours, family, reading, documents, and trust in government. Then name who does not match, and what the sentence does to them.</p><p>Wording to look for: “the responsible family member,” “the applicant's home,” “during normal business hours,” “the primary caregiver,” and any process that assumes one stable address.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-12-2-sort",
            heading: "Which finding is this?",
            categories: ["Unnecessary barrier", "Unclear requirement", "Unintended disparate effect", "Hidden assumption"],
            items: [
              { text: "The draft requires a notarized signature on a form the division already receives electronically from the provider.", category: "Unnecessary barrier" },
              { text: "Applicants must appear at a county office during business hours to verify identity, although the same verification is accepted by mail in a neighboring program.", category: "Unnecessary barrier" },
              { text: "The draft says a change must be reported “promptly after it occurs.”", category: "Unclear requirement" },
              { text: "The draft requires “appropriate documentation” without saying what would count.", category: "Unclear requirement" },
              { text: "The only way to file is an online form, and the counties with the slowest connections are the ones with the longest drive to an office.", category: "Unintended disparate effect" },
              { text: "The deadline is counted in business days, and the clinic appointment it depends on is six weeks out in most of the region.", category: "Unintended disparate effect" },
              { text: "The draft refers to the reader throughout as “the responsible family member.”", category: "Hidden assumption" },
              { text: "The timeline assumes the person has one address, one phone number and one spelling of their name across all three records.", category: "Hidden assumption" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Write findings the drafter can act on",
            control: "You control how precisely you describe what you found.",
            failure: "Do not send “this section raises equity concerns.” It cannot be acted on, it puts the drafter on the defensive, and it comes back to you as a request to explain what you meant, usually the week the draft is due.",
            next: "Rewrite your next finding in four parts: the quoted sentence and where it appears, who is affected, what happens to them, and the wording you suggest instead.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-12-2-check",
            question: "Which of these is a finding the person who owns the draft can act on?",
            options: [
              { text: "The eligibility section raises equity concerns and should be reviewed.", correct: false },
              { text: "Section 3, second sentence: “The applicant must provide current proof of residence.” The listed proofs are hard to obtain for people living with family, in shelters or in group settings. Suggested wording: accept a signed statement from the applicant or from a person who knows them, in addition to the listed documents.", correct: true },
              { text: "The policy should be more inclusive of people in unstable housing.", correct: false },
              { text: "We should consult stakeholders before this section is finalized.", correct: false },
            ],
            feedbackCorrect: "Yes. A quoted sentence, the people it affects, what happens to them, and wording the drafter can use as written. That is a decision someone can make today.",
            feedbackIncorrect: "Compare what each option puts on the drafter's desk. Only one names the sentence, the effect and a replacement they can act on without a meeting.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: who could be helped, burdened, excluded or misunderstood by what this draft requires — and which of those groups would I have noticed without looking on purpose?",
          },
        ],
      },
      {
        id: "ipe-12-3",
        number: 3,
        title: "The floor, the choices, and whose expertise is missing",
        summary: "What a policy cannot write below, how much of a draft is genuinely a choice, and what makes outside review capable of changing anything.",
        minutes: 11,
        learning: {
          objective: "Separate the parts of a draft that carry a settled obligation from the parts that are practice choices, and plan who reviews the draft, when, and on what terms, including compensated review by people the policy will affect.",
          takeaways: [
            "Some things in a draft are not open: accessible documents, effective communication, meaningful language access and nondiscrimination set a floor a policy cannot write below. Say in the draft how each is met and who arranges it.",
            "Above that floor, most of a policy is a practice choice — the channel, the deadline, the proof required, the tone, who is told what and when. Practice choices are where equity review does its work.",
            "“It treats everyone the same” is the most comfortable sentence in public administration and the least informative. It sits at the stage this program calls Minimization, where difference is acknowledged in principle and set aside in practice.",
            "Review that cannot change anything is not review. Early enough, specific enough, paid, accessible and closed out with a report back are the five conditions that separate it from decoration.",
            "People with disabilities, families, interpreters and culturally specific organizations bring expertise this work depends on. Bring them in as compensated co-designers, reviewers and advisers, early, with the standing to change something.",
          ],
          evidence: "A sorting exercise separating settled obligations, practice choices and decisions that belong to the people affected; a scenario on grant requirements; and a knowledge check on review that can change a draft.",
          appliedNextStep: "Look at the review plan for a draft you are working on. Write down when the first outside reader sees it, who that reader is, whether they are paid, and what they are allowed to change.",
        },
        scenario: {
          context: "A contracts and procurement team is drafting requirements for a grant that will fund community organizations to do outreach about a DSD program. The draft requires applicants to submit audited financial statements for the past three years, a letter of support from a county agency, and a proposal in a format the team has used for a decade. The team plans to send the draft to two established statewide providers for comment two weeks before the solicitation posts.",
          prompt: "What should change first?",
          options: [
            {
              label: "Keep the requirements and extend the comment period to four weeks so the two reviewers have more time.",
              response: "More time for the same two reviewers produces a more polished version of the same draft. The organizations who could tell you that audited statements and a county letter screen out small and culturally specific applicants are still not in the room.",
            },
            {
              label: "Ask what each requirement is actually protecting against, drop or scale the ones that are not, and pay a wider set of reviewers — including small and culturally specific organizations and disability-led groups — to read the draft while the requirements can still change.",
              response: "This is the recommended path. Each requirement is tested against its purpose rather than its history, and the review happens early enough and broadly enough to change the terms, with people paid for expertise the team does not have.",
              recommended: true,
            },
            {
              label: "Post the solicitation as drafted and hold a bidders' conference where organizations can ask questions.",
              response: "A conference explains the requirements to whoever can attend it. It does not remove a requirement that already decided who was going to apply.",
            },
          ],
        },
        transfer: {
          prompt: "Look at the next draft you will send for review.",
          options: [
            "Name the date the first outside reader sees it, and what can still change on that date",
            "Name one reviewer who would see something your team cannot, and how they will be paid for their time",
            "Write the one specific question you want them to answer, instead of asking for general comments",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The floor and the choices",
            body: "<p>Part of every draft is already decided. A public program has to communicate effectively with people who are Deaf, hard of hearing, blind or have low vision. Its documents and forms have to be usable by someone using a screen reader. It has to provide meaningful access for people with limited English proficiency, including interpretation and translation of the documents that decide whether someone gets a service. It cannot apply a requirement in a way that discriminates. These obligations are the floor, and a policy cannot write below them.</p><p>Drafts get into trouble by leaving the floor implicit. A single line at the end saying materials are available in other formats on request is an offer made in a place many readers will not reach, in a language some of them do not read, with no one named to arrange it. Put the arrangements in the body of the document: who provides the interpreter, how far in advance, what formats already exist, who to contact and how long it takes.</p><p>Everything above the floor is a practice choice, and that is the larger part of any policy: the channel, the deadline, the proof accepted, the order of steps, who is notified and when, what the program calls the people it serves. Practice choices are not neutral simply because they are unremarkable. They are where the draft decides who will find this easy.</p>",
          },
          {
            type: "sorting",
            id: "ipe-12-3-sort",
            heading: "Settled obligation, practice choice, or a decision that belongs to the people affected?",
            categories: ["Settled obligation", "Practice choice", "Belongs to the people affected"],
            items: [
              { text: "Notices and forms have to be usable by someone using a screen reader.", category: "Settled obligation" },
              { text: "Meaningful access for people with limited English proficiency, including interpretation and translation of the documents that decide a service.", category: "Settled obligation" },
              { text: "Effective communication with a person who is Deaf or hard of hearing at an agency meeting.", category: "Settled obligation" },
              { text: "Whether the response window is ten days or thirty.", category: "Practice choice" },
              { text: "Whether the program accepts a request by phone as well as online.", category: "Practice choice" },
              { text: "The order of the sections in the guidance document.", category: "Practice choice" },
              { text: "What the program calls the people it serves in its own written materials.", category: "Belongs to the people affected" },
              { text: "Which of three acceptable proofs is least burdensome to obtain in a rural county.", category: "Belongs to the people affected" },
              { text: "Which part of the process feels most disrespectful and should change first.", category: "Belongs to the people affected" },
            ],
          },
          {
            type: "accordion",
            heading: "Three comfortable sentences, and what to do with each",
            items: [
              { title: "“It treats everyone the same.”", body: "<p>Identical treatment is one meaning of fairness, and it is the one that hides the most. A requirement that asks for something not equally available produces an uneven result while sounding even. This sentence sits at the stage this program calls Minimization: difference is acknowledged in principle and then set aside in practice, usually with real goodwill.</p><p>Moving toward Acceptance and Adaptation is not abandoning consistency. It is asking what consistency costs and designing so that difference changes the design rather than only the apology. These stages describe the program's direction of travel, not a label about any person.</p><p>What to do: replace the claim with a question. What does this requirement assume a person already has, and who is least likely to have it?</p>" },
              { title: "“We would have heard if there were a problem.”", body: "<p>You hear from people who got far enough to complain and believed it was worth the risk. The person stopped at the first step, the provider who did not apply, the family that gave up after the second missed appointment — none of them appear in the feedback that reaches you. Silence is not evidence.</p><p>What to do: find one source of information about the people who did not complete the process, and one person outside the agency who can tell you why.</p>" },
              { title: "“We will fix it in the work instruction.”", body: "<p>Sometimes true, and often a way of publishing a problem and hoping the desk procedure absorbs it. A work instruction can clarify; it cannot remove a requirement the policy created, and it is invisible to everyone outside the unit.</p><p>What to do: if the fix genuinely belongs in the work instruction, write it now and attach it to the draft. If it cannot be written yet, the draft is not ready.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Buy the expertise you do not have",
            control: "You control when the first outside reader sees the draft, who that reader is, whether they are paid, and what they are allowed to change.",
            failure: "Do not send a near-final draft out for unpaid comment and call it engagement. Reviewers recognize it immediately, it spends trust you will need later, and the comments that come back will be about formatting.",
            next: "For your next draft, set the outside review date before the internal clearance date, name one reviewer whose experience your team does not have, arrange payment through the route your unit already uses for professional services, and write down the specific question you want answered.",
          },
          {
            type: "flashcards",
            heading: "Five conditions for review that can change something",
            cards: [
              { front: "Early enough", back: "<p>The requirements are still open. If the only thing a reviewer can change is a word, say so honestly rather than calling it consultation.</p>" },
              { front: "Specific enough", back: "<p>One or two real questions beat a request for general comments. “Which of these three proofs is hardest to get where you are, and why?” produces an answer you can use.</p>" },
              { front: "Paid", back: "<p>Community reviewers, self-advocates, interpreters and culturally specific organizations are bringing professional expertise. Pay for it through the same route you would pay any other adviser.</p>" },
              { front: "Accessible", back: "<p>The draft arrives in a format the reviewer can read, with enough time, with interpretation arranged, and with a plain summary of what the document actually does.</p>" },
              { front: "Closed out", back: "<p>Reviewers are told what changed, what did not, and why. Without that report back, the next invitation is declined, and it should be.</p>" },
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-12-3-check",
            question: "A draft is sent to three community organizations for comment. Which arrangement is most likely to change the draft?",
            options: [
              { text: "A polished near-final draft with a two-week comment window, reviewed without payment, with the comments summarized for the file.", correct: false },
              { text: "An early draft with the requirements still open, one specific question to answer, payment for the reviewers' time and expertise, and a written reply afterward saying what changed and what did not.", correct: true },
              { text: "A published policy with an open comment address on the web page.", correct: false },
              { text: "A briefing meeting where the team presents the draft and invites questions at the end.", correct: false },
            ],
            feedbackCorrect: "Yes. Early enough to change something, specific enough to answer, paid, and closed out with a report back. Each of those separates review from decoration.",
            feedbackIncorrect: "Ask three questions of each option: can the requirements still change, is the reviewer paid for expertise, and will they learn what happened to what they said?",
          },
          {
            type: "quote",
            text: "You sent us the draft on a Thursday and the comment period closed Monday. We read it anyway. We told you the proof you were asking for takes a month to get where we are. The final version had the same sentence and a new heading.",
            cite: "Composite community reviewer perspective, illustrative",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: whose expertise is missing from the room where this draft is being written, and what would it have taken to bring them in earlier?",
          },
        ],
      },
      {
        id: "ipe-12-4",
        number: 4,
        title: "Run the review on one draft",
        summary: "A repeatable equity review you can copy and run on one real policy, guidance document or work instruction, with a worked finding and a way to route what you do not own.",
        minutes: 11,
        learning: {
          objective: "Run an equity review on one real draft policy or guidance document, and record each finding with the sentence, who is affected, what you would change and who owns the change.",
          takeaways: [
            "The review runs in a fixed order — purpose and who is bound, what the draft asks people to do, the four findings, the floor, then routing — because rewriting a sentence inside a requirement that should not exist wastes the effort.",
            "A finding is usable when it quotes the sentence, names who is affected, says what happens to them and offers replacement wording. A finding that names a concern is a feeling; a finding that offers wording is a decision someone can make.",
            "Most drafts hold a few findings you can fix yourself and one or two that belong to another office. Route the second kind with the same precision, and say what you have already changed.",
            "Write down what you considered and decided not to change, and why. The next reader inherits the reasoning instead of repeating the discovery.",
          ],
          evidence: "A completed equity review you can copy, a worked comparison of three ways to write the same finding, and a knowledge check on routing a finding you do not own.",
          appliedNextStep: "Run the review on one draft this week. Make the changes you own, send the findings you do not own with suggested wording to the office that owns them, and tell the drafter what changed and why.",
        },
        scenario: {
          context: "You are asked to review a two-page draft guidance document about a new reporting requirement before it goes to the division's leadership. You have three days. The draft has a clear purpose, one sentence that can be read two ways, a submission channel that is online only, a program term that appears nowhere else, and an accessibility line at the end saying materials are available in other formats on request.",
          prompt: "How do you spend the three days?",
          options: [
            {
              label: "Read for clarity and fix the wording problems; the channel and the accessibility line are someone else's decisions.",
              response: "The wording fixes are real and they are the smallest part. A single online channel and an offer of other formats on request both decide who can comply, and both are still changeable while the document is a draft.",
            },
            {
              label: "Run the review in order: confirm the purpose and who is bound, list what the draft asks people to do, write the four findings with quoted sentences and suggested wording, check the floor, then split the findings into what you change and what you route.",
              response: "This is the recommended path. Working in order keeps you from polishing a sentence that should be deleted, and the split at the end gives both you and the other office something to act on before the draft moves.",
              recommended: true,
            },
            {
              label: "Send the draft to a community organization for comment and wait for their response before writing your review.",
              response: "Outside review is essential, and this is the wrong moment and the wrong terms for it: three days, no payment, and a draft already on its way to leadership. Plan paid review earlier in the next cycle, and do the review you were asked for now.",
            },
          ],
        },
        transfer: {
          prompt: "Name the draft you will review.",
          options: [
            "Name the draft, the day you will review it, and who owns it",
            "Name the one finding you expect to be hardest to raise, and how you will word it",
            "Name the office you will route anything outside your control to, and what you will send them",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Work in order, and stop polishing",
            body: "<p>The review has an order, and the order matters more than the thoroughness. Purpose and who is bound come first, because a requirement whose purpose nobody can state is not a wording problem. Then list what the draft asks people to do, because the four findings are easier to see against a list of tasks than against paragraphs. Then the findings. Then the floor. Routing last, once you know which findings are yours.</p><p>Here is one finding at three levels of quality. Vague: “the documentation section may create barriers for some applicants.” Better: “Section 4 requires original documents, which is hard for people who do not have stable housing.” Usable: “Section 4, first sentence: <em>The applicant must submit original documents.</em> People living in shelters, in group settings or with family often cannot produce originals, and replacing a lost record costs a fee and several weeks. Suggested wording: <em>The applicant may submit copies. The division may request an original only when a copy cannot be verified, and will say why in writing.</em> This section is ours; I have made the change in the draft.”</p><p>The difference between the second and the third is about ten minutes of your time and the entire likelihood that anything changes. A drafter working to a deadline will accept wording they can paste. They will rarely invent new wording for a problem someone else described, because inventing it under deadline is the riskiest thing on their desk.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A policy equity review",
            summary: "One page you can copy and run on a single draft policy, guidance document or work instruction.",
            fields: [
              { label: "Purpose and who is bound", value: "Name the document — law, rule, policy, guidance or work instruction — what it is for, and who has to follow it: staff, counties, providers, applicants, or all of them. Write the one thing a reader should be able to do after reading it. If you cannot write that sentence, the review starts there." },
              { label: "What the draft asks people to do", value: "List every action the draft requires of someone outside DHS, one per line: a document to obtain, an appointment to attend, a form to complete, a channel to use, a deadline to meet. Mark each one that costs money, transportation, time off work, an interpreter or a second appointment." },
              { label: "The four findings", value: "Quote the sentence and give its location for each. Unnecessary barrier: a step the purpose does not require. Unclear requirement: a sentence a careful reader could satisfy two ways. Unintended disparate effect: a requirement not equally available across the state. Hidden assumption: the picture of a person the sentence was written around. Add who is affected, what happens to them, and the wording you suggest instead." },
              { label: "The floor", value: "Check what the draft cannot write below: accessible documents and usable forms; effective communication, including interpreters and captioning; meaningful language access, with the documents that decide a service translated; nondiscrimination in how the requirement is applied. Say in the body of the document how each is met, who arranges it and how long it takes, rather than leaving an offer of other formats at the end." },
              { label: "What you changed, what you routed, what you left", value: "Three short lists. Changed: the wording you replaced, and why. Routed: each finding outside your control, with the sentence, the effect, suggested wording and the office it went to. Left: what you considered and decided not to change, with the reason, so the next reader inherits the thinking instead of repeating it." },
            ],
            action: "Copy the five fields into a blank page, run them against one real draft this week, make the changes you own, send the routed findings with suggested wording, and give the drafter the changed and left lists.",
          },
          {
            type: "tabs",
            heading: "One finding, three ways of writing it",
            tabs: [
              { label: "Too vague to act on", body: "<p>“The documentation section may create barriers for some applicants. Recommend review.”</p><p>The drafter cannot tell which sentence, which applicants, or what to do. It arrives as criticism, generates a meeting, and leaves as nothing.</p>" },
              { label: "Better, but incomplete", body: "<p>“Section 4 requires original documents, which is hard for people who do not have stable housing.”</p><p>The sentence and the people are named, which is real progress. There is still no replacement wording, so the drafter has to invent one under deadline — and the safest thing to invent under deadline is no change at all.</p>" },
              { label: "Usable", body: "<p>“Section 4, first sentence: <em>The applicant must submit original documents.</em> People living in shelters, in group settings or with family often cannot produce originals, and replacing a lost record costs a fee and several weeks. Suggested wording: <em>The applicant may submit copies. The division may request an original only when a copy cannot be verified, and will say why in writing.</em> This section is ours; I have made the change in the draft.”</p><p>Sentence, effect, replacement, owner, status. Nothing left for the drafter to work out.</p>" },
            ],
          },
          {
            type: "list",
            heading: "Changes that usually need nobody's permission",
            ordered: false,
            items: [
              "Delete a requirement your own section added that nothing above it requires.",
              "Replace “appropriate documentation” with the list of what actually counts.",
              "Say what a deadline is counted from, and whether the days are calendar or business days.",
              "Add a second way to submit alongside the online one.",
              "Name a person and a direct number instead of a title and a shared inbox.",
              "Define a program term the first time it appears, or stop using it.",
              "Move the interpretation, translation and format arrangements into the body of the document, with who arranges them and how long they take.",
              "Write down the discretion a worker actually has, and what should guide it.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Send wording, not concern",
            control: "You control how precise the review is that you hand to the person who owns the draft.",
            failure: "Do not raise a concern and wait to be asked what you meant. A concern costs the drafter a meeting they do not have time for; a sentence costs them a paste.",
            next: "Before you send your review, check that every finding quotes a sentence, names who is affected and offers replacement wording, and that the last section says plainly what you have already changed.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-12-4-check",
            question: "Your review finds that an automatic denial notice, owned by another division, gives no reason a reader can understand. What do you send that office?",
            options: [
              { text: "A note asking them to review their notices for plain language.", correct: false },
              { text: "The exact notice, the sentence as it currently reads, what a reader cannot tell from it, suggested replacement wording, and a question about who can approve the change.", correct: true },
              { text: "A copy of your full review with the finding highlighted.", correct: false },
              { text: "A request that the notice be suspended until it can be rewritten.", correct: false },
            ],
            feedbackCorrect: "Yes. The text, the effect, the replacement and a question about ownership. That is something the receiving office can act on this week.",
            feedbackIncorrect: "Think about what arrives on the other person's desk. Only one option hands them the sentence, the problem and wording they can use as written.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: if this draft, or the version before it, has been excluding someone for a while, what would accountability and repair require beyond a quiet correction — and how could the people most affected have shaped it earlier?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Policy writing through an equity lens",
    subtitle: "One page for anyone drafting, reviewing or clearing written policy",
    quote: "An even sentence is not the same as an even result.",
    use: {
      purpose: "Keep the four findings and the review order in view while you draft, review or clear a policy, guidance document or work instruction.",
      remember: [
        "Know what you are holding. Law, rule, policy, guidance and work instruction change through different processes and on different timelines.",
        "Every requirement assigns work to somebody. Trace the appointments, fees, travel, documents and days before deciding a sentence is reasonable.",
        "Four findings: unnecessary barrier, unclear requirement, unintended disparate effect, hidden assumption.",
        "Settled obligations set the floor — accessible documents, effective communication, language access, nondiscrimination. Say in the body of the draft how each is met and who arranges it.",
        "Review that can change nothing is not review. Early enough, specific enough, paid, accessible, closed out.",
        "A usable finding quotes the sentence, names who is affected, says what happens, and offers replacement wording.",
      ],
      doNext: "Run the review on one real draft this week, make the changes you own, and route the rest with suggested wording.",
    },
    sections: [
      {
        heading: "The review, in order",
        items: [
          "Purpose and who is bound: what kind of document this is, who has to follow it, and the one thing a reader should be able to do afterward.",
          "What the draft asks people to do: every action required of someone outside DHS, with the ones that cost money, travel, time off work or a second appointment marked.",
          "The four findings: quoted sentence, who is affected, what happens to them, suggested wording.",
          "The floor: accessible documents, effective communication, language access and nondiscrimination, written into the body of the draft with who arranges each.",
          "Changed, routed, left: what you fixed, what you sent onward with wording, and what you decided not to change and why.",
        ],
      },
      {
        heading: "The four findings",
        items: [
          "Unnecessary barrier: a step the purpose does not require. Ask what would go wrong if it were removed, and whether that is happening.",
          "Unclear requirement: a sentence two careful readers satisfy two ways. Ask a colleague outside the program what they would do.",
          "Unintended disparate effect: a requirement not equally available across the state. Test it against distance, connection, transit, hours, language and records.",
          "Hidden assumption: the person the draft was written around. Describe them out loud, then name who does not match.",
        ],
      },
      {
        heading: "Wording that usually hides something",
        items: [
          "“Appropriate documentation” — say what counts.",
          "“Promptly” or “in a timely manner” — say how many days, and counted from what.",
          "“May be required” — say who decides, and on what basis.",
          "“Must appear in person” — say what that verifies, and whether anything else would.",
          "“The responsible family member” — say what happens to a person who does not have one.",
          "“Available in other formats on request” — say what already exists, who arranges it, and how long it takes.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, who decide what a requirement says and where it lives — a useful place to start.",
          "Contracts, fiscal, grants and procurement staff, whose requirements decide who is able to apply at all — a useful place to start.",
          "Quality and performance staff, who read draft requirements against what the division already knows about who completes a process and who does not.",
          "Communications, training and data staff, whose work turns a drafted sentence into the notice, the form and the count that follow it.",
          "Supervisors and operations staff, who write the work instructions that decide most of what people actually experience.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Accessible public communications",
          "Language access in state programs",
          "Program and service design",
          "Equitable stakeholder partnership",
          "Cross-division coordination",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Content and writing guidelines", href: "https://mn.gov/dhs/digital-showcase/content-guidelines/", note: "The department's own editorial guidance on first-read understanding, descriptive headings, familiar terms and writing suited to the reader — the standard a draft policy is written against." },
    { title: "PlainLanguage.gov, Federal plain language guidelines", href: "https://www.plainlanguage.gov/guidelines/", note: "Detailed guidance on audience, organization, useful headings, sentence structure and the vague words that make a requirement unclear." },
    { title: "Minnesota Office of Administrative Hearings, Rulemaking", href: "https://mn.gov/oah/rulemaking/", note: "How Minnesota agencies adopt administrative rules, including notice, public comment and review — the difference between a rule and a policy or guidance document." },
    { title: "ADA.gov, State and local governments (Title II)", href: "https://www.ada.gov/topics/title-ii/", note: "U.S. Department of Justice guidance on what a state or local government program must provide, including effective communication and accessible programs and services." },
    { title: "LEP.gov, Federal interagency language access guidance", href: "https://www.lep.gov/", note: "Federal guidance on meaningful access for people with limited English proficiency under Title VI, including which documents are treated as vital and require translation." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, and a public source on how state requirements land for disabled Minnesotans." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the governance, policy and written-communication standards used in this module." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
