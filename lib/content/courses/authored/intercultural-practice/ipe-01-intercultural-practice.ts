import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Foundations · Module 1: Intercultural practice in public disability services.
// Program-authored for internal DHS and DSD staff whose work shapes policy, programs, communications,
// data, contracts, quality and partnership. Voluntary and self-directed; nothing here is scored or recorded.
const pack: CoursePack = {
  course: {
    id: "ipe-01-intercultural-practice",
    indexNumber: 1143,
    seriesLabel: "Intercultural Practice and Equity · Foundations",
    title: "Intercultural Practice in Public Disability Services",
    subtitle: "How culture, identity, disability and power travel through the ordinary decisions a state division makes every day.",
    scope: "For DHS and DSD staff whose work shapes policy, program oversight, communications, data, contracts, quality, supervision and community partnership. This is not direct-service or provider training; it looks at the public-administration side of the work. Four short lessons, taken in any order and revisited whenever they are useful. Participation is voluntary, nothing you write or choose here is collected or attached to your name, and completion does not count toward DHS-required training credits unless management, a director or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota public-administration examples, flashcards, a sorting exercise, private reflection prompts, an assumption-check tool and a knowledge check in every lesson",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/stock-people-13.jpg",
    coverAlt: "Three colleagues sit at a conference table reviewing printed documents together.",
    introTranscript: "Every state process carries a culture, whether anyone designed it that way or not. A notice assumes a reader. A deadline assumes a week. A required form assumes a person who already knows the program exists. This first module gives you a shared way to talk about culture, identity, disability, intersectionality, power and cultural humility inside public administration, and ends with one practical tool: a way to find a single point where a state process may be relying on an assumption nobody has checked. Nothing here is scored, and nothing you write is collected.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Describe culture, identity and disability as features already built into state processes, not as topics that belong only to the people a program serves.",
        "Explain how disability combines with language, age, income, work, distance and community history in the people a DSD process reaches.",
        "Identify the routine authority staff carry in definitions, deadlines, required channels and meeting agendas.",
        "Distinguish the intent of a decision from its effect on the people it reaches, and respond to the effect without blaming a colleague's motives.",
        "Complete an assumption check for one process you touch, naming the step, the assumption, who it fits, how you would verify it, and the smallest change with an owner.",
      ],
      evidence: [
        "A worked scenario in every lesson with an explanation of why one response fits public-administration work better than the others.",
        "A sorting exercise separating what a record can show, what it cannot, and the assumptions that fill the gap.",
        "A completed assumption check for one real step, written in your own words and kept by you.",
      ],
      appliedNextStep: "Choose one step in a process you touch — a notice, a deadline, a form field, a contract requirement, a meeting rule — and complete the assumption check in the last lesson for that one step.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in DHS or DSD policy, division structure, or the offices responsible for civil rights, accessibility and language access",
        "A change in federal or state accessibility or civil rights guidance that affects how a state process must reach people",
        "Feedback from compensated community advisors or DSD staff that an example reads as unrealistic, stereotyping or out of date",
      ],
      relatedDoor: "Formal determinations about policy, civil rights obligations, accommodation requests and language access belong to the responsible DHS or DSD office — division leadership and the agency office that handles equal opportunity and civil rights — and this module prepares you to bring them a clearer question, not to decide in their place.",
      toolkitQuestion: "Which step in the process I am about to approve is easiest for people whose lives look like mine, and who has to work hardest to meet it?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-01-1",
        number: 1,
        title: "Culture is already in the process",
        summary: "Culture is not only something other people have. In a state division it shows up as defaults: which channel counts, how fast an answer is expected, what proof is accepted, and who is expected to speak.",
        minutes: 10,
        learning: {
          objective: "Name one default in a process you touch and explain the cultural expectation it carries about the people it reaches.",
          takeaways: [
            "Culture, in public administration, is the set of habits and expectations a group treats as normal — including the group that runs a state division. It rarely appears in the policy text; it appears in the defaults around it.",
            "Disability is best understood here as what happens when a person meets an environment built without them in view. That makes much of it a design question, and design questions belong to the staff who write the rule, the notice, the form and the contract.",
            "Cultural humility is a working habit rather than a personal quality: assume your view of a process is partial, check it with people who meet it from outside, and change something when you learn you were wrong.",
            "Sameness and fairness are not the same claim. Identical steps can produce very different access.",
          ],
          evidence: "A scenario about a workgroup that treats identical treatment as fairness, flashcards for the core terms, and a knowledge check on where culture sits inside an ordinary process.",
          appliedNextStep: "Pick one routine your team runs — a meeting, a notice, an approval, an intake of comments — and write down the single default it relies on most.",
        },
        scenario: {
          context: "A DSD workgroup is revising how the division collects public comment on a policy change. The current method is one web page, one online form, and a ten-business-day window. The workgroup lead says, “Everyone gets the same page, the same form and the same ten days. That is what fairness looks like in a public program.”",
          prompt: "What is the most useful thing to say in that room?",
          options: [
            {
              label: "Agree. Identical steps are the cleanest definition of fairness in public work, and anything else invites inconsistent treatment.",
              response: "Consistency matters, and the instinct behind it is a good one. But identical steps are a description of our effort, not of people's access. One web page reaches people who already know the policy change is coming; one written form reaches people who write comfortably in English; ten business days reaches people whose week has room in it. The comment file will look tidy and still be missing most of the people the policy affects.",
            },
            {
              label: "Say that identical steps are not the same as equal access, and ask the group to name who this method is easiest for and who has to work hardest — then add a second way to comment and more time before the decision closes.",
              response: "This is the accurate move, and it stays practical. It keeps the shared standard the lead is protecting, names the default out loud, and changes something the workgroup actually controls: the number of ways in and the size of the window. It also treats the lead as a colleague solving a design problem rather than a person to correct.",
              recommended: true,
            },
            {
              label: "Add a line to the web page inviting anyone who cannot use the form to request an accommodation.",
              response: "Keep the line — it is worth having, and for some people it is the only way in. On its own, though, it reaches only people who already found the page, already know they can ask, and are willing to identify themselves to do it. The step still needs a second door that does not require a request.",
            },
          ],
        },
        transfer: {
          prompt: "Where does “this is just how we do it” sit in your own work?",
          options: [
            "Name one step you have never questioned because it was already in place when you arrived",
            "Write the expectation that step makes about the person on the other side of it",
            "Find out whether that expectation is written anywhere, or whether it has simply been inherited",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Culture shows up as a default, not as a decoration",
            body: "<p>Every state process carries a culture, whether anyone designed it that way or not. A renewal notice assumes a reader who opens mail, reads print, trusts an envelope from a government agency, and can act alone inside the window. A public comment period assumes a person who already knows the comment period exists, writes comfortably in English, and has an opinion ready in the format we asked for. None of those assumptions appear in the policy. They are simply in it.</p><p>Three words are worth keeping apart. <strong>Culture</strong> is the set of habits, expectations and defaults a group treats as normal — and a state division is a group with a culture of its own, not a neutral space where other people's cultures arrive. <strong>Identity</strong> is the set of things about a person's life that shape how a process actually reaches them: language, community, age, family role, work, income, where they live, and disability among them. <strong>Disability</strong>, in this curriculum, is not treated as a diagnosis a person either has or does not have. It is what happens when a person meets an environment built without them in view: the form that times out, the phone tree with no callback, the meeting that moves at the speed of whoever speaks first.</p><p>That last definition matters for public-administration staff, because it moves most of the work back into your hands. If disability were only a medical fact, it would belong to clinicians. Because so much of it is produced by design — a deadline, a format, a proof requirement, a required channel — it belongs to the people who write the rule, the notice, the contract term, the survey question and the agenda. That is the work on your desk.</p>",
          },
          {
            type: "tabs",
            heading: "Where culture sits inside an ordinary state process",
            tabs: [
              { label: "Channel", body: "<p>Which way of reaching us counts as the real one. A process that treats an online form as the front door and a phone call as the exception has made a cultural choice about whose life is easy to serve. So has a process that answers only in writing, or only during business hours, or only to the person named on the file.</p>" },
              { label: "Pace", body: "<p>How fast a response is expected, and what happens to someone who is slower. A short window rewards people with predictable weeks, reliable transportation, flexible work and no one else depending on them. A person who needs an interpreter, a support person, a ride, or a second read of a dense letter is not slower in any meaningful sense — the window is simply short.</p>" },
              { label: "Proof", body: "<p>What we accept as evidence: a signature, a printed statement, a letter from an employer, a record from a system a person cannot see. Proof requirements are usually written for the convenience of the reviewer. They are worth re-reading from the side of the person who has to produce them.</p>" },
              { label: "Voice", body: "<p>Who we expect to speak, and to whom. Some processes assume one adult speaks for a household; some assume a person will advocate for themselves in a room full of professionals; some assume a family member or support worker will do the talking. Each of those is a cultural expectation, and each one changes who is heard.</p>" },
            ],
          },
          {
            type: "flashcards",
            heading: "Words this curriculum keeps apart",
            cards: [
              { front: "Culture", back: "<p>Shared habits, expectations and defaults that a group treats as normal. Divisions, units and professions have cultures too — not only the communities we serve.</p>" },
              { front: "Identity", back: "<p>The parts of a person's life that shape how a process reaches them. People do not arrive one part at a time, and none of it is ours to ask about without a reason.</p>" },
              { front: "Disability", back: "<p>What happens when a person meets an environment built without them in view. Much of it is produced by design, which means much of it can be changed by design.</p>" },
              { front: "Cultural humility", back: "<p>A repeated practice, not an achievement: assume your view is partial, check it with people who see the process from elsewhere, and change something when you learn you were wrong.</p>" },
              { front: "Intercultural practice", back: "<p>Working well across difference on purpose: noticing the defaults in your own work, reading a situation from more than one angle, and adjusting the process rather than asking people to adjust to it.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "The continuum this program uses, and what it is not",
            items: [
              { title: "Denial and Polarization", body: "<p>Denial misses difference: cultural difference is simply not on the screen, so a process is built as though everyone lives the way the designers do. Polarization judges difference as us-and-them, either by defending one's own way as obviously correct or by treating one's own group as the problem in every case. Both make it hard to look at a process clearly, because the conversation turns into a contest before the design question is reached.</p>" },
              { title: "Minimization", body: "<p>The common resting place for large public organizations, and the one worth knowing well. Minimization emphasizes what everyone has in common — “we treat everyone the same here” — and treats identical steps as proof of fairness. It sounds generous and it often comes from a sincere commitment to equal treatment. Its cost is that real differences in how people reach a process stop being visible, so the same people keep falling out of it and nobody can say why.</p>" },
              { title: "Acceptance, Adaptation and Integration", body: "<p>Acceptance recognizes that people bring genuinely different patterns and that those patterns are not deficits to be corrected. Adaptation goes further: a staff member can shift how they frame a question or run a meeting so that it works for people whose starting point is not theirs. Integration describes a person or a group whose intercultural practice has become part of how they see their own work, rather than an extra step at the end of it. In a division, these look like better questions, earlier partnership, and processes that were built with the range in mind.</p>" },
              { title: "What this is not", body: "<p>The program uses this continuum to describe the habits of an organization and to point learning in a direction. It is never a label, a rank, a score, or a record about any individual staff member. Nothing you read, choose or write in this module is collected, stored, reported or attached to your name. Formal intercultural assessment, where it happens at all, is a separate and professionally administered process, and this curriculum does not replace or shortcut it.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Name the default before the group defends it",
            control: "You control whether the defaults in a process get said out loud. Naming one is a normal design question, not a criticism of the people who built it.",
            failure: "Do not let “we treat everyone the same” end the discussion. It is usually a statement about our effort, offered in good faith, and it leaves the actual question — who can reach this step — unasked.",
            next: "In your next process discussion, ask one question: who is this step easiest for, and who has to work hardest to meet it?",
          },
          {
            type: "quote",
            text: "The form was not unfair to me. It just assumed a version of my life I do not have, and then treated me as late.",
            cite: "Composite community advisory member perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-01-1-check",
            question: "A program manager says, “Our policy is culturally neutral. It applies to every applicant identically.” Which response is best supported by this lesson?",
            options: [
              { text: "The manager is correct; a policy that applies identically to everyone cannot carry a cultural assumption.", correct: false },
              { text: "The policy text may be identical for everyone, and the defaults around it — the channel, the pace, the proof and who is expected to speak — still carry expectations about people's lives that are worth naming and checking.", correct: true },
              { text: "The policy should be rewritten with a separate track for each cultural community the program serves.", correct: false },
            ],
            feedbackCorrect: "Yes. The question is not whether the text treats people identically, but whether the surrounding design assumes one kind of life.",
            feedbackIncorrect: "Look past the policy text to the defaults around it: which channel counts, how fast a response is expected, what proof is accepted and who is expected to speak. Those carry the cultural assumptions, and those are the parts staff can change.",
          },
        ],
      },
      {
        id: "ipe-01-2",
        number: 2,
        title: "Identity does not arrive one box at a time",
        summary: "Disability meets language, age, income, work and distance in the same person, on the same day. Records are built from single categories, and the gap between them is usually filled by an assumption.",
        minutes: 11,
        learning: {
          objective: "Identify one place in your own reporting or program design where a single category hides a combination of experiences, and state what the record cannot show.",
          takeaways: [
            "People do not meet a process one category at a time. Disability arrives alongside language, age, family role, work schedule, income and distance, and the combination — not any single part — is what determines whether a step is reachable.",
            "Administrative records are built from categories chosen for administration. They can show which program a person used and when; they rarely show what using it cost.",
            "When a record cannot answer a question, something fills the gap, and it is usually an assumption held by whoever sits closest to the process.",
            "The honest move is to report the number with its limits attached, then go find what the number cannot say — from people who are compensated for that expertise.",
          ],
          evidence: "A scenario about an evaluation finding with a thin explanation behind it, a sorting exercise separating what a record can and cannot show, and a knowledge check on reading a single category.",
          appliedNextStep: "Take one number you report regularly and write a single sentence naming what it cannot tell you about the people behind it.",
        },
        scenario: {
          context: "An evaluation team finds that people in one region complete an annual renewal at a noticeably lower rate than people elsewhere in the state. The records hold county, age band, program type and a language indicator. They do not hold work schedules, transportation, whether anyone read the notice aloud to the person, or whether the notice was understandable to someone who had never seen one before.",
          prompt: "What is the most responsible next step for the team?",
          options: [
            {
              label: "Report the finding as a regional compliance concern and recommend sending more reminder notices.",
              response: "This treats the number as the whole story and recommends more of the thing that may already be failing. If the notice is unreadable, arrives in one format, or lands in a week when the person is working doubles, a second copy of it changes very little.",
            },
            {
              label: "Report the number with an explicit note about what the records cannot show, then arrange a small, compensated conversation with participants, family members and a community organization in that region before recommending any fix.",
              response: "This is the accurate and useful path. It keeps the finding, states its limits so that no one downstream over-reads it, and then goes to the people who can explain the gap — as paid advisors contributing expertise, not as a focus group assembled to validate a conclusion the team already reached.",
              recommended: true,
            },
            {
              label: "Add a question to the renewal form asking people to identify their cultural background so the pattern can be explained.",
              response: "This asks people to disclose something about themselves to explain a process failure, and it collects information the team has no clear plan to act on. The sharper question is about the renewal step itself: what it demands, in what format, in what window, through which channel.",
            },
          ],
        },
        transfer: {
          prompt: "Pick a report or dashboard you produce. Which single category is doing the most work in it?",
          options: [
            "Name the category and what it is being used to explain",
            "Write one thing the category cannot show about the people it counts",
            "Name who could answer that question, and what it would take to compensate them for their time",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The same person, several doors at once",
            body: "<p>Intersectionality is a plain idea with a long name: the parts of a person's life do not queue up politely. A parent who is deaf, speaks Somali at home and works an evening shift does not meet a renewal process as three separate people. She meets it once, with all of it at the same time — and the parts interact. An interpreter appointment is arranged for a weekday morning. The notice arrives in print. The phone line answers during the hours she is at work. Each step was designed by someone reasonable, and together they close the door.</p><p>State systems see people through categories, because categories are how a public program is administered, funded and audited. That is not a failure of anyone's intentions; it is the shape of the tool. The problem starts when the category is asked to explain something it was never built to explain. A language indicator tells you what was recorded on one form. It does not tell you whether the notice was readable, whether an interpreter was available for the kind of appointment involved, or whether the person had a way to ask a question after hours.</p><p>Minnesota adds its own texture to this. Human services here are largely county-administered under state supervision, so the same policy is carried out by many different local offices, in regions with very different distances, transportation, staffing and community organizations. A statewide average can hide a region where the nearest office is an hour away and the only bus runs twice a day. When a division reports a statewide number without naming what it cannot see, the number quietly becomes an explanation.</p>",
          },
          {
            type: "accordion",
            heading: "Four combinations worth seeing before you design a step",
            items: [
              { title: "Language and disability together", body: "<p>Interpreting and plain language are different problems, and solving one does not solve the other. A document translated faithfully from a dense original is still dense. A person who is deaf and uses American Sign Language may need an interpreter and captions and a document written for a first read. A family that uses a relative to interpret at home may still need a professional interpreter for a formal decision, because the two roles are not the same and the relative should not carry that weight.</p>" },
              { title: "Age and disability together", body: "<p>An older adult acquiring a disability late in life is often meeting the disability service system for the first time, with no vocabulary for it and no history of asking for help. A young adult leaving school is leaving one system designed around a family and entering one designed around an individual. Both are transitions, and transitions are where processes tend to drop people.</p>" },
              { title: "Distance and disability together", body: "<p>Distance changes what a requirement costs. An in-person signature is a small ask in a city and a half-day ask in a rural county, more if a person does not drive, more again if the ride has to be arranged in advance. Internet service that is uneven makes an online-only step a barrier rather than a convenience. None of this appears in the policy; all of it appears in who completes the step.</p>" },
              { title: "Work, income and disability together", body: "<p>A person working an hourly shift may lose pay to attend a daytime appointment, and may not be able to take a call during the hours a program is staffed. Someone balancing a fluctuating condition may have good weeks and hard weeks that do not line up with our windows. A process with one appointment time, one channel and one deadline quietly selects for people whose work is flexible.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-01-2-sort",
            heading: "What can this record actually tell you?",
            categories: ["What a record can show", "What a record cannot show", "An assumption filling the gap"],
            items: [
              { text: "How many people in a county are enrolled in a given program, and when each enrollment started.", category: "What a record can show" },
              { text: "Which renewal notices were mailed, to which address, and on which day.", category: "What a record can show" },
              { text: "Whether the person who opened the notice could read and act on it without help.", category: "What a record cannot show" },
              { text: "What the renewal step cost a family in travel, missed pay or time away from caregiving.", category: "What a record cannot show" },
              { text: "People in that region are simply less engaged with the program.", category: "An assumption filling the gap" },
              { text: "Families who do not call back must not need the service.", category: "An assumption filling the gap" },
            ],
          },
          {
            type: "list",
            heading: "Questions that widen a category before you report it",
            items: [
              "What did this category get collected for, and is that what I am now using it to prove?",
              "Which two or three parts of a person's life would change this result, and are any of them in the record?",
              "If the number is lower here than elsewhere, what would have to be true about the step for that to make sense?",
              "Who could tell me in ten minutes what this number cannot, and how do we pay them for that time?",
              "What sentence should travel with this number so that the next reader does not over-read it?",
            ],
          },
          {
            type: "quote",
            text: "They kept telling me the deadline. Nobody asked what my week looks like. If anyone had, the fix would have taken about five minutes.",
            cite: "Composite participant perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-01-2-check",
            question: "A division report shows lower completion of a required step among people recorded with a language other than English. Which reading is best supported?",
            options: [
              { text: "The community involved places a lower priority on the program, which explains the difference.", correct: false },
              { text: "The language indicator marks one recorded fact and cannot by itself explain the difference; the step's format, channel, timing and readability all need to be examined, with input from the people who meet it.", correct: true },
              { text: "The difference is a data quality issue and should be excluded from the report until the records improve.", correct: false },
            ],
            feedbackCorrect: "Yes. The category marks something; it explains nothing on its own. The explanation lives in the step and in what people can tell you about meeting it.",
            feedbackIncorrect: "Ask what the category was collected for and what it can actually support. A recorded language does not tell you whether the notice was readable, whether interpreting was available for that kind of appointment, or whether the window fit the person's week.",
          },
        ],
      },
      {
        id: "ipe-01-3",
        number: 3,
        title: "Power, privilege and the weight of a routine decision",
        summary: "Public authority is rarely exercised as a dramatic decision. It sits in a definition, a deadline, a required channel and an agenda — and its effect is often different from its intent.",
        minutes: 11,
        learning: {
          objective: "Identify the authority carried by a routine decision in your own work and describe its likely effect separately from its intent.",
          takeaways: [
            "Staff in a state division hold four kinds of everyday authority: the power to define, to set timing, to require a channel, and to set an agenda. None of them feels like power while you are using it.",
            "Privilege, in this work, is simply the ability not to notice. A process feels normal to the people it was built around, and the people it was not built around are the only ones who can see it clearly.",
            "Intent and effect are separate questions. A decision made carefully and in good faith can still exclude, and only the effect reaches the person on the other side.",
            "Calling in means naming the effect, keeping the colleague, and asking what the process will do differently — rather than assigning a motive to anyone.",
          ],
          evidence: "A scenario about a contract requirement set without the organizations it binds, a look at four kinds of routine authority, and a knowledge check on separating intent from effect.",
          appliedNextStep: "Name one decision on your desk this month and write down who is in the room when it is made, and who is not.",
        },
        scenario: {
          context: "A DSD team is finalizing a request for proposals for community engagement support. The draft requires an audited financial statement, submission through a state vendor portal, a history of prior state contracts, and a thirty-day turnaround. Two small culturally specific organizations tell a colleague they will not bid, because they can meet the work but not the paperwork in the time allowed.",
          prompt: "Which response best uses the authority the team actually holds?",
          options: [
            {
              label: "Keep the requirements as written — they protect public funds — and suggest that smaller organizations partner as subcontractors under a larger vendor.",
              response: "Stewardship of public money is a real duty, and the instinct is sound. But this leaves the smaller organizations doing the relational work while a larger vendor holds the contract, the payment terms and the relationship with the division. It also skips the question the team has not yet asked: which of these requirements is law, and which is habit?",
            },
            {
              label: "Sort the requirements into what law or policy requires and what the team has simply carried forward, then change the habits: extend the window, accept an alternative financial record where it is allowed, hold an open briefing for organizations that have not bid before, and check the draft with a few of them first.",
              response: "This is the accurate use of the authority the team holds. It keeps every requirement that is actually required, removes the ones that were only inherited, and puts the draft in front of the people it binds while it can still change. It also treats those organizations as advisors whose time has value, not as applicants who should try harder.",
              recommended: true,
            },
            {
              label: "Waive the requirements for smaller organizations so they can compete.",
              response: "This creates an exception without asking whether the requirement was necessary in the first place, which can leave both the organizations and the division exposed later. Separating legal requirements from inherited habits is the more durable fix, and it improves the process for every bidder rather than creating a side door.",
            },
          ],
        },
        transfer: {
          prompt: "Think of a decision you will make or approve in the next two weeks.",
          options: [
            "Write down which of the four kinds of authority it uses: definition, timing, channel or agenda",
            "Name the effect it will have on someone whose week does not look like yours",
            "Name one person or organization who should see the draft while it can still change, and what it would take to compensate them",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Where the authority actually sits",
            body: "<p>Ask most staff in a state division whether they hold power and the honest answer is no. The commissioner holds power. The legislature holds power. A program consultant writing a field guidance note, a contract manager choosing a submission method, a supervisor setting a response standard — those feel like ordinary work. They are ordinary work, and they are also the points where public authority meets a person's life.</p><p>Authority in this setting is quiet and cumulative. It shows up as the definition that decides who is included in a category, the deadline that decides whose week is long enough, the required channel that decides who can reach you, and the agenda that decides which questions get air. None of these announce themselves. All of them travel outward, through counties, providers, contracts and notices, to people who cannot see where the decision was made and have no practical way to ask about it.</p><p>Privilege, in this work, is not an accusation and it is not about anyone's character. It is the simple fact that a process feels normal to the people it was built around. If the phone line's hours have never been a problem for you, the hours are invisible. If you have never needed an interpreter for a formal meeting, the scheduling rule for interpreters is invisible. This is why intent and effect have to be held apart: a decision made carefully, by people acting in good faith, can still land as a closed door — and the effect is the only part the person on the other side experiences. Naming the effect is not an accusation about the intent, and a colleague who hears it as one deserves the clarification rather than the argument.</p>",
          },
          {
            type: "tabs",
            heading: "Four kinds of authority staff carry without noticing",
            tabs: [
              { label: "Definition", body: "<p>The power to decide what a word means in practice: who counts as a caregiver, what counts as a documented need, when a household is one household. Definitions travel further than any memo and are rarely revisited once they are in a form.</p>" },
              { label: "Timing", body: "<p>The power to set the window: how long someone has to respond, how much notice a meeting gets, how quickly a decision closes. Timing decides who is able to participate more often than eligibility rules do.</p>" },
              { label: "Channel", body: "<p>The power to decide how someone must reach us: an online portal, a mailed form, a phone line with set hours, a signature in person. Each channel is easy for someone and closed to someone else, and a single required channel is the most common quiet exclusion in public work.</p>" },
              { label: "Agenda", body: "<p>The power to decide which questions are discussed, in what order, and who speaks. A workgroup that hears from the people affected in the final ten minutes has already made its decisions, whatever the meeting record says.</p>" },
            ],
          },
          {
            type: "list",
            heading: "Signs a routine decision is carrying more weight than it looks",
            items: [
              "It will be copied. Field guidance, templates and standard language get reused for years by people who never see the original reasoning.",
              "It sets a default rather than a maximum. Most people will take the default, so the default is the policy.",
              "It decides who has to ask. Any step that works only when a person requests an exception will reach only the people who know exceptions exist.",
              "It is easiest for people whose work and week look like the team's. That is a signal worth checking, not evidence of bad faith.",
              "Nobody in the room will personally meet the process from the outside. That is the moment to bring someone in, with their time paid for.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Separate the requirement from the habit",
            control: "You control whether your team can say, for each step, where the requirement is written. That single question separates law and policy from things we have simply always done.",
            failure: "Do not defend an inherited step as though it were a legal obligation. It costs the team credibility, and it protects a practice nobody chose.",
            next: "Take one process your team owns, list its steps, and mark each one as required by law or policy, required by a system we use, or inherited. Start the next conversation with the inherited ones.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone — nothing here is collected and nobody will ask you to share it. How might my role, authority, language or assumptions shape the decision in front of me? Who could be helped, burdened, excluded or misunderstood by this process? Whose expertise is missing from the room, and what would it take to bring it in earlier?",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-01-3-check",
            question: "A colleague learns that a submission rule she wrote has effectively excluded several small organizations. She says, “That was never my intent.” What is the most useful next step?",
            options: [
              { text: "Reassure her that intent is what matters and that no further action is needed.", correct: false },
              { text: "Accept that her intent was good, keep the focus on the effect, and work with her on what the rule will do differently — including who should see the next draft before it is final.", correct: true },
              { text: "Report the rule to leadership as a bias concern so that it can be handled formally.", correct: false },
            ],
            feedbackCorrect: "Yes. Intent and effect are separate questions, and only the effect reached the organizations. Keeping the colleague and changing the rule are the same conversation.",
            feedbackIncorrect: "Good intent does not undo an effect, and an effect is not evidence about a colleague's character. The productive move keeps both true: accept the intent, address the effect, and change the step.",
          },
        ],
      },
      {
        id: "ipe-01-4",
        number: 4,
        title: "Find the assumption in a process you touch",
        summary: "The practical tool for this module: take one step in a real process, find the assumption it relies on, check where it is written, and make the smallest honest change with a named owner.",
        minutes: 11,
        learning: {
          objective: "Complete an assumption check for one step you touch, naming the step, the assumption, who it fits, how you would verify it, and the smallest change with an owner.",
          takeaways: [
            "An assumption is a requirement nobody can point to. The first question is always the same: where is this written?",
            "Checking an assumption means asking people who meet the process from outside it — participants, family members, community organizations — and paying them for that expertise as advisors and co-designers, not gathering them as an audience.",
            "The smallest honest change with a named owner is worth more than a large plan with none.",
            "Cultural humility is repeated rather than achieved. Check, change, and check again at a point you set in advance.",
          ],
          evidence: "A sorting exercise separating written requirements from inherited habits, a completed assumption check for one real step, and a knowledge check on what makes an entry usable.",
          appliedNextStep: "Fill in the assumption check for one step you own, make the smallest change that is within your authority, and tell the people the step affects that it changed.",
        },
        scenario: {
          context: "A supervisor in a program oversight unit notices that staff routinely close an inquiry when a caller does not respond to two voicemail messages within five business days. Nothing in policy sets two messages or five days. The practice arrived with a former team lead and has been followed ever since.",
          prompt: "Where does the assumption check start?",
          options: [
            {
              label: "With the callers: survey people whose inquiries were closed and ask why they did not call back.",
              response: "There is useful information in that conversation, and it may be worth having later with people who are compensated for their time. As a starting point it puts the work on the people already left out, and it skips the fact the supervisor has just discovered: the rule is not written anywhere.",
            },
            {
              label: "With the step itself: confirm whether the two-message, five-day practice appears in any policy, and if it does not, write down the assumptions it carries about phones, voicemail, work hours, language and who checks messages — then decide the smallest change the unit can make on its own.",
              response: "This is the right order. It separates a written requirement from an inherited habit, names the assumptions plainly enough to test, and keeps the first change inside the supervisor's own authority. A longer window, a second channel and a written follow-up can all be decided this week.",
              recommended: true,
            },
            {
              label: "With leadership: request a new division policy that sets a longer response timeline for everyone.",
              response: "Escalating before establishing whether a rule exists turns a change the supervisor can make today into a request that waits. Bring leadership the pattern and the fix once the unit has tested one; that conversation goes much better with a working example attached.",
            },
          ],
        },
        transfer: {
          prompt: "Choose the one step you will run through the assumption check this month.",
          options: [
            "Name the step and the process it belongs to",
            "Write the sentence you would use to ask where the requirement is written, and who you would ask",
            "Name the smallest change you could make without anyone's permission, and the person who will ask you about it",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Start with one step, not the whole system",
            body: "<p>Most of what is written about intercultural practice invites you to examine everything at once, which is a reliable way to change nothing. This module ends with something smaller and more useful: one step, in one process you actually touch, examined closely enough to find the assumption underneath it.</p><p>An assumption, for this purpose, is a requirement that nobody can point to. It behaves like a rule — staff follow it, people are held to it, outcomes turn on it — but it is not written in statute, policy, or even a procedure note. It arrived with someone who has since moved on, or it was a sensible fix to a problem that no longer exists, or it is a system's default that nobody chose. Assumptions are not failures of character. They are what happens when a process runs for years and no one has had reason to ask where a step came from.</p><p>The check has five lines, and the order matters. Name the step precisely. Name the assumption it makes about the person on the other side. Say who the step fits and who has to work hardest. Say how you will verify it, and with whom — including how those people are paid for their time. Then name the smallest change, who owns it, and when you will look again. Five lines is not a small thing when they are true: it converts a vague sense that something is off into work a specific person can do.</p>",
          },
          {
            type: "sorting",
            id: "ipe-01-4-sort",
            heading: "Written requirement, or inherited habit?",
            categories: ["A requirement someone can point to", "An assumption we have been carrying"],
            items: [
              { text: "A federal or state rule sets the eligibility criteria for the program.", category: "A requirement someone can point to" },
              { text: "Published policy sets the number of days a person has to appeal a decision.", category: "A requirement someone can point to" },
              { text: "The unit closes an inquiry after two unanswered voicemail messages.", category: "An assumption we have been carrying" },
              { text: "Meeting materials go out the morning of the meeting because that is when the deck is finished.", category: "An assumption we have been carrying" },
              { text: "A signature is collected in person because the form has always been signed in person.", category: "An assumption we have been carrying" },
              { text: "A records retention period is set by law for this program's files.", category: "A requirement someone can point to" },
            ],
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "An assumption check for one state process",
            summary: "Five lines that turn a vague sense that a step is not working into work a named person can do. Copy them into your own notes; nothing is submitted anywhere.",
            fields: [
              { label: "Process and the exact step", value: "Program inquiry line — closing an inquiry after two unanswered voicemail messages in five business days." },
              { label: "The assumption the step makes", value: "That a voicemail reaches the person, that they can listen to it and understand it, that they can return a call during staffed hours, and that five business days is long enough for someone working shifts, sharing a phone, or waiting on an interpreter." },
              { label: "Who the step fits, and who works hardest", value: "Fits people with a private phone, voicemail they check, daytime flexibility and comfortable English. Hardest for shift workers, people who share a household phone, people who need an interpreter to call back, and anyone who has learned that a missed government call means trouble." },
              { label: "How we will check it, and with whom", value: "Ask the staff who make the calls what they see. Then ask three participants and one community organization in the region what would have made the return call possible, with their time compensated at the division's standard rate for advisors." },
              { label: "Smallest change, owner and next look", value: "Extend to three attempts across two weeks, add a short written follow-up with a direct name and number, and note the preferred contact method on the first call. Owner: the unit supervisor. Look again at the agreed review point and record what changed." },
            ],
            action: "Copy these five lines for one step you touch this month, fill them in from what you actually know, and send the last line to whoever owns the step.",
          },
          {
            type: "list",
            heading: "Ways to check an assumption without asking people to work for free",
            items: [
              "Ask the staff who run the step every day what they see. They usually know, and they are rarely asked.",
              "Bring the draft to an existing advisory group rather than convening a new one, and put it on the agenda early enough that it can still change.",
              "Pay participants, family members and community organizations for review time at the division's standard rate, and say so in the invitation.",
              "Tell people afterward what changed because of what they said. Nothing ends a partnership faster than silence after the meeting.",
              "Ask an organization that serves the community in question what the step costs the people they work with, and treat the answer as evidence.",
              "When the topic involves a community this program does not author content for on its own, route it through the responsible DHS office rather than filling the gap yourself.",
            ],
          },
          {
            type: "statement",
            body: "Private reflection, for you alone — not collected, not shared, not part of any record. What might accessibility mean in this step beyond a legal minimum? Does this process make sense to someone who does not already know how DHS works? How could the people most affected by it have shaped it earlier? And if harm or exclusion has already happened here, what would accountability and repair actually require?",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-01-4-check",
            question: "Which assumption-check entry is complete enough to act on?",
            options: [
              { text: "The renewal process is not culturally responsive and should be reviewed for equity.", correct: false },
              { text: "Renewal notices go out by mail only, with a ten-day window; that assumes a reliable address, print reading and a flexible week. Hardest for people who move, who need a document read to them, or who work shifts. We will ask two participants and one community organization, compensated, what would help. Smallest change: add a phone or text reminder and extend the window. Owner: the notices lead. Next look: the agreed review point.", correct: true },
              { text: "Staff should be more aware of cultural differences when following up on renewals.", correct: false },
            ],
            feedbackCorrect: "Yes. A step, an assumption, who it fits, a way to check it with people who are paid for their time, a specific smallest change, an owner and a review point.",
            feedbackIncorrect: "Compare the three for what someone could do tomorrow. Awareness and review are not steps. The usable entry names the assumption, who it burdens, how it will be checked, what changes, who owns it and when you look again.",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Intercultural practice in public disability services",
    subtitle: "One page for the next decision you make about a state process",
    quote: "The process already carries a culture. The only question is whether anyone can say what it is.",
    use: {
      purpose: "Keep the foundations in reach while you draft a policy, write a notice, set a deadline, build a survey, award a contract or run a workgroup.",
      remember: [
        "Culture in a state division shows up as defaults: which channel counts, how fast an answer is expected, what proof is accepted, who is expected to speak.",
        "Identical steps are not the same as equal access, and saying so is a design question rather than a criticism of colleagues.",
        "People meet a process with all of their life at once; a single recorded category explains very little on its own.",
        "Your everyday authority sits in definitions, timing, required channels and agendas, and its effect is separate from your intent.",
        "An assumption is a requirement nobody can point to. Ask where it is written.",
      ],
      doNext: "Run one step through the five-line assumption check this month and make the smallest change that is within your own authority.",
    },
    sections: [
      {
        heading: "Before you decide",
        items: [
          "Ask who this step is easiest for, and who has to work hardest to meet it.",
          "Separate what law or policy requires from what the team has inherited.",
          "Check whether the step works only for people who know they can ask for an exception.",
          "Bring the draft to the people it binds while it can still change, and pay them for that time.",
        ],
      },
      {
        heading: "The assumption check, in five lines",
        items: [
          "Name the process and the exact step.",
          "Name the assumption the step makes about the person on the other side.",
          "Say who the step fits, and who has to work hardest to meet it.",
          "Say how you will check it and with whom, including how their time is compensated.",
          "Name the smallest change, the owner, and when you will look again.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff — a useful starting point before drafting or revising guidance that others will copy for years.",
          "Data, research and evaluation staff — a way to state what a category can and cannot show before a number becomes an explanation.",
          "Supervisors and managers — a way to find the unwritten practices a unit has been carrying, and to change one this week.",
          "Administrative and support staff — the step you run is often the first real contact a person has with the division, and most of it is yours to adjust.",
        ],
      },
      {
        heading: "Private reflection, kept private",
        items: [
          "How might my role, authority, language or assumptions affect this decision?",
          "Who could be helped, burdened, excluded or misunderstood by this process?",
          "Whose expertise is missing, and how could the people most affected shape this work earlier?",
          "What might accessibility mean here beyond a legal minimum, and does this make sense to someone who does not already know how DHS works?",
          "Nothing you write in response to these prompts is collected, stored or attached to your name.",
        ],
      },
      {
        heading: "Related modules in Foundations",
        items: [
          "Disability culture and disability justice",
          "Public power and institutional impact",
          "Bias, assumptions, and accountability",
          "Accessible and respectful communication",
          "Choosing a learning focus",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, plain language, and instruction built for a range of learners rather than adapted afterward." },
    { title: "National CLAS Standards, U.S. Department of Health and Human Services, Think Cultural Health", href: "https://thinkculturalhealth.hhs.gov/clas/standards", note: "The national standards for culturally and linguistically appropriate services, including governance, workforce, language assistance, community partnership and accountability." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's policy, training and technical resource on disability, including accessibility guidance for public bodies and information on state disability policy." },
    { title: "Minnesota Olmstead Implementation Office", href: "https://mn.gov/olmstead/", note: "The state office supporting Minnesota's Olmstead Plan goals for integrated, self-determined community life, including co-creation of the plan with people who have lived experience of disability." },
    { title: "ADA.gov, U.S. Department of Justice", href: "https://www.ada.gov/", note: "Federal information and technical assistance on the Americans with Disabilities Act, including state and local government obligations under Title II." },
    { title: "Section 508 of the Rehabilitation Act, U.S. General Services Administration", href: "https://www.section508.gov/", note: "Practical guidance on accessible documents, presentations, meetings and digital content for public-sector staff." },
    { title: "Plain language guide, Digital.gov", href: "https://digital.gov/guides/plain-language/", note: "Federal plain-language guidance on writing so that readers can find, understand and use information the first time they read it." },
    { title: "The Intercultural Development Continuum, Intercultural Development Inventory", href: "https://idiinventory.com/generalinformation/the-intercultural-development-continuum-idc/", note: "Description of the continuum this program uses as its theory of change, from Denial and Polarization through Minimization toward Acceptance and Adaptation." },
  ],
};

export default pack;
